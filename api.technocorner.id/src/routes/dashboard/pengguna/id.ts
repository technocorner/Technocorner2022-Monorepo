import { Request, Response, Router } from "express";
import asyncHandler from "../../../libs/asyncHandler";
import firebase from "../../../libs/firebase";
import getUserPhoto from "../../../libs/routes/dashboard/getUserPhoto";
import getUserIdentity from "../../../libs/routes/dashboard/getUserIdentity";
import { events } from "../../../data/events";

const router = Router();

router.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    const penggunaDoc = await firebase
      .firestore()
      .collection("pengguna")
      .doc(id)
      .get();

    if (!penggunaDoc.exists) {
      return res.json({ success: false });
    }

    if (penggunaDoc.data()!.peran === "pengguna") {
      const eventsData: Array<{ id: string; category: string; name: string }> =
        [];
      (
        penggunaDoc.data()!.acara as Array<{ id: string; kategori: string }>
      ).forEach((a) => {
        eventsData.push({
          id: a.id,
          category: a.kategori,
          name: events.find((e) => e.id === a.kategori)!.name,
        });
      });

      return res.json({
        success: true,
        body: {
          id: penggunaDoc.id,
          photo: await getUserPhoto(penggunaDoc.data()!.foto),
          name: penggunaDoc.data()!.nama,
          email: penggunaDoc.data()!.email,
          status: penggunaDoc.data()!.status,
          agency: penggunaDoc.data()!.instansi,
          identity: await getUserIdentity(penggunaDoc.data()!.identitas),
          whatsapp: penggunaDoc.data()!.whatsapp,
          suspend: penggunaDoc.data()!.bekukan,
          verification: penggunaDoc.data()!.verifikasi,
          events: eventsData,
          role: "pengguna",
        },
      });
    } else {
      return res.json({
        success: true,
        body: {
          id: penggunaDoc.id,
          photo: await getUserPhoto(penggunaDoc.data()!.foto),
          name: penggunaDoc.data()!.nama,
          email: penggunaDoc.data()!.email,
          role: "admin",
        },
      });
    }
  })
);

export default router;
