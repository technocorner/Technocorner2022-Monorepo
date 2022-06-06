import { json, NextFunction, Request, Response, Router } from "express";
import asyncHandler from "../../../../asyncHandler";
import firebase from "../../../../firebase";

const router = Router();

router.use((req, res, next) => {
  if (req.session!.role !== "admin") {
    return res.json({
      success: false,
      body: { error: "Tidak berhak mengakses data" },
    });
  }
  next();
});

router.use(json());

router.delete(
  "/",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const idPendaftaran = req.body.idPendaftaran;
    const idPengguna = req.body.idPeserta;
    const kategori = req.headers.acara;

    await firebase.firestore().runTransaction(async (t) => {
      try {
        const penggunaRef = firebase
          .firestore()
          .collection("pengguna")
          .doc(idPengguna);
        const penggunaDoc = await t.get(penggunaRef);

        const pesertaRef = firebase
          .firestore()
          .collection(`acara/${kategori}/peserta`)
          .doc(idPendaftaran);

        switch (kategori) {
          case "webinar":
            t.delete(pesertaRef);
            break;
          case "workshop":
            const workshopDoc = await t.get(pesertaRef);

            if (!workshopDoc.exists) {
              return res.json({ success: false });
            }

            const peserta = workshopDoc
              .data()!
              .peserta.filter((p: { id: string }) => p.id !== idPengguna);

            if (peserta.length) {
              t.update(pesertaRef, { peserta });
            } else {
              t.delete(pesertaRef);
            }
        }

        const acara = penggunaDoc
          .data()!
          .acara.filter(
            (a: { kategori: string; id: string }) =>
              !(a.kategori === kategori && a.id === idPendaftaran)
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
