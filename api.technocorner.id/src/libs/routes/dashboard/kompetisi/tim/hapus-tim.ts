import { json, NextFunction, Request, Response, Router } from "express";
import asyncHandler from "../../../../asyncHandler";
import firebase from "../../../../firebase";

const router = Router();

router.use(json());

router.delete(
  "/",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const kategori = req.headers.acara as string;
    const idTim = req.body.idTim;

    await firebase.firestore().runTransaction(async (t) => {
      try {
        const timRef = firebase
          .firestore()
          .collection(`acara/${kategori}/tim`)
          .doc(idTim);
        const timDoc = await t.get(timRef);

        if (timDoc.exists) {
          const statAcaraRef = firebase
            .firestore()
            .collection("statistik")
            .doc("acara");
          const statAcaraDoc = await t.get(statAcaraRef);

          const idPeserta = [timDoc.data()!.ketua];

          timDoc.data()!.anggota.forEach((id: string) => idPeserta.push(id));

          const penggunaRef: Array<
            FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>
          > = [];
          const acaraPengguna: Array<FirebaseFirestore.DocumentData> = [];
          await Promise.all(
            idPeserta.map(async (pId) => {
              const pRef = firebase.firestore().collection("pengguna").doc(pId);
              const pDoc = await t.get(pRef);
              penggunaRef.push(pRef);
              acaraPengguna.push(
                pDoc
                  .data()!
                  .acara.filter(
                    (a: { kategori: string; id: string }) =>
                      !(a.kategori === kategori && a.id === idTim)
                  )
              );
            })
          );

          t.delete(timRef);

          penggunaRef.forEach(async (pRef, index) => {
            t.update(pRef, { acara: acaraPengguna[index] });
          });

          t.update(statAcaraRef, {
            ...statAcaraDoc.data(),
            [kategori]: {
              verifikasi: timDoc.data()!.verifikasi
                ? statAcaraDoc.data()![kategori].verifikasi - 1
                : statAcaraDoc.data()![kategori].verifikasi,
              total: statAcaraDoc.data()![kategori].total - 1,
            },
          });
        }
      } catch (e) {
        next(e);
        throw e;
      }
    });

    return res.json({ success: true });
  })
);

export default router;
