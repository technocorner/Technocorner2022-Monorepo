import firebase from "../../firebase";
import registerUser from "./registerUser";

export default async (id: string) => {
  const pendaftarDocs = await firebase
    .firestore()
    .collection("pendaftar")
    .where("id", "==", id)
    .get();

  if (pendaftarDocs.empty) {
    return { success: false, body: { error: "Kode verifikasi salah" } };
  }

  let pendaftarDoc:
    | FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>
    | undefined;
  pendaftarDocs.forEach((p) => (pendaftarDoc = p));

  // 2 hours
  if (
    pendaftarDoc &&
    pendaftarDoc.exists &&
    pendaftarDoc.readTime.toMillis() - 2 * 60 * 60 * 1000 <
      pendaftarDoc.createTime!.toMillis()
  ) {
    const nama = pendaftarDoc.data()!.nama;
    const email = pendaftarDoc.id;
    const sandi = pendaftarDoc.data()!.sandi;

    const reg = await registerUser({ nama, email, googleId: "", sandi });
    if (reg.success) {
      return { success: true };
    } else {
      return {
        success: false,
        body: { error: "Gagal melakukan pendaftaran akun" },
      };
    }
  } else {
    await pendaftarDoc!.ref.delete();
    return {
      success: false,
      body: { error: "Kode verifikasi sudah tidak berlaku" },
    };
  }
};
