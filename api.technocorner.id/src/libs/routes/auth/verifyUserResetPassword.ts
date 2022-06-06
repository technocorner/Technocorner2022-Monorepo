import firebase from "../../firebase";

export default async (id: string) => {
  const resetDocs = await firebase
    .firestore()
    .collection("reset-sandi")
    .where("id", "==", id)
    .get();

  if (resetDocs.empty) {
    return { success: false, body: { error: "Kode verifikasi salah" } };
  }

  let resetDoc:
    | FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>
    | undefined;
  resetDocs.forEach((p) => (resetDoc = p));

  // 10 minutes
  if (
    resetDoc &&
    resetDoc.exists &&
    resetDoc.readTime.toMillis() - 10 * 60 * 1000 <
      resetDoc.createTime!.toMillis()
  ) {
    return { success: true, body: { email: resetDoc.id } };
  } else {
    await resetDoc!.ref.delete();
    return {
      success: false,
      body: { error: "Kode verifikasi sudah tidak berlaku" },
    };
  }
};
