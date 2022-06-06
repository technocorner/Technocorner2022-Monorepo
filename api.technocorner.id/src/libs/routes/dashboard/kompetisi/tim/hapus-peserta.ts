import { json, NextFunction, Request, Response, Router } from "express";
import asyncHandler from "../../../../asyncHandler";
import firebase from "../../../../firebase";

const router = Router();

router.use(json());

router.delete(
  "/",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const idTim = req.body.idTim;
    const idPengguna = req.body.idPeserta;
    const kategori = req.headers.acara;

    await firebase.firestore().runTransaction(async (t) => {
      try {
        const timRef = firebase
          .firestore()
          .collection(`acara/${kategori}/tim`)
          .doc(idTim);
        const timDoc = await t.get(timRef);

        if (!timDoc.exists) {
          return res.json({ success: false });
        }

        const penggunaRef = firebase
          .firestore()
          .collection("pengguna")
          .doc(idPengguna);
        const penggunaDoc = await t.get(penggunaRef);

        if (timDoc.data()!.ketua.id === idPengguna) {
          return res.json({
            success: false,
            body: {
              error: `Tidak dapat menghapus "Ketua" dari daftar anggota. "Ketua" hanya dapat dihapus dengan menghapus tim.`,
            },
          });
        }

        const anggota = timDoc
          .data()!
          .anggota.filter((a: { id: string }) => a.id !== idPengguna);

        t.update(timRef, { anggota });

        const acara = penggunaDoc
          .data()!
          .acara.filter(
            (a: { kategori: string; id: string }) =>
              !(a.kategori === kategori && a.id === idTim)
          );

        t.update(penggunaRef, { acara });
      } catch (e) {
        next(e);
        throw e;
      }
    });

    return res.json({ success: true });
  })
);

export default router;
