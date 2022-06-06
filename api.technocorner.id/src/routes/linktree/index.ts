import { json, Request, Response, Router } from "express";
import multer from "multer";
import config from "../../data/config";
import { link } from "../../data/server";
import asyncHandler from "../../libs/asyncHandler";
import firebase from "../../libs/firebase/link";
import getFirestoreUrl from "../../libs/firebase/link/getFirestoreUrl";
import randomId from "../../libs/randomId";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const linkDocs = await firebase
      .firestore()
      .collection("linktree/link/data")
      .orderBy("urutan", "desc")
      .get();

    const links: Array<{
      judul: string;
      tautanPendek: string;
      warnaTeks: string;
      warnaLatar: string;
    }> = [];

    linkDocs.forEach((uri) => {
      links.push({
        judul: uri.data()!.judul,
        tautanPendek: `${link}/${uri.id}`,
        warnaTeks: uri.data()!.warnaTeks,
        warnaLatar: uri.data()!.warnaLatar,
      });
    });

    const settingsDoc = await firebase
      .firestore()
      .collection("linktree")
      .doc("pengaturan")
      .get();

    let settings = {
      judulProfil: "",
      bio: "",
      warnaLatar: "",
      warnaBackdrop: "",
      backdropBlurLatar: 0,
      transparansiTombol: 0,
      bulatanTombol: 0,
      backdropBlurTombol: 0,
      fotoProfil: "",
      gambarLatar: "",
    };

    if (settingsDoc.exists) {
      let fotoProfil = settingsDoc.data()!.fotoProfil;
      if (fotoProfil) {
        fotoProfil = await getFirestoreUrl(`linktree/fotoProfil/${fotoProfil}`);
      }

      let gambarLatar = settingsDoc.data()!.gambarLatar;
      if (gambarLatar) {
        gambarLatar = await getFirestoreUrl(
          `linktree/gambarLatar/${gambarLatar}`
        );
      }

      settings = {
        judulProfil: settingsDoc.data()!.judulProfil,
        bio: settingsDoc.data()!.bio,
        warnaLatar: settingsDoc.data()!.warnaLatar,
        warnaBackdrop: settingsDoc.data()!.warnaBackdrop,
        backdropBlurLatar: settingsDoc.data()!.backdropBlurLatar,
        transparansiTombol: settingsDoc.data()!.transparansiTombol,
        bulatanTombol: settingsDoc.data()!.bulatanTombol,
        backdropBlurTombol: settingsDoc.data()!.backdropBlurTombol,
        fotoProfil,
        gambarLatar,
      };
    }

    return res.json({ success: true, body: { links, settings } });
  })
);

router.get(
  "/tautan",
  asyncHandler(async (req: Request, res: Response) => {
    const linkDocs = await firebase
      .firestore()
      .collection("linktree/link/data")
      .orderBy("urutan", "desc")
      .get();

    const links: Array<{
      judul: string;
      tautanPendek: string;
      tautanPanjang: string;
      urutan: number;
    }> = [];

    linkDocs.forEach((uri) => {
      links.push({
        judul: uri.data()!.judul,
        tautanPendek: uri.id,
        tautanPanjang: uri.data()!.tautanPanjang,
        urutan: uri.data()!.urutan,
      });
    });

    const settingsDoc = await firebase
      .firestore()
      .collection("linktree")
      .doc("pengaturan")
      .get();

    let settings = {
      judulProfil: "",
      bio: "",
      warnaLatar: "",
      warnaBackdrop: "",
      backdropBlurLatar: 0,
      transparansiTombol: 0,
      bulatanTombol: 0,
      backdropBlurTombol: 0,
      fotoProfil: "",
      gambarLatar: "",
    };

    if (settingsDoc.exists) {
      settings = {
        judulProfil: settingsDoc.data()!.judulProfil,
        bio: settingsDoc.data()!.bio,
        warnaLatar: settingsDoc.data()!.warnaLatar,
        warnaBackdrop: settingsDoc.data()!.warnaBackdrop,
        backdropBlurLatar: settingsDoc.data()!.backdropBlurLatar,
        transparansiTombol: settingsDoc.data()!.transparansiTombol,
        bulatanTombol: settingsDoc.data()!.bulatanTombol,
        backdropBlurTombol: settingsDoc.data()!.backdropBlurTombol,
        fotoProfil: settingsDoc.data()!.fotoProfil,
        gambarLatar: settingsDoc.data()!.gambarLatar,
      };
    }

    return res.json({ success: true, body: { links, settings } });
  })
);

router.post(
  "/tautan",
  json(),
  asyncHandler(async (req: Request, res: Response) => {
    if (req.session!.role !== "admin") {
      return res.json("Tidak berhak mengakses data");
    }

    const judul = req.body.judulTautan;
    const tautanPanjang = req.body.tautanPanjang;
    const tautanPendek = req.body.tautanPendek;
    const warnaTeks = req.body.warnaTeks
      ? (req.body.warnaTeks as string)[0] === "#"
        ? req.body.warnaTeks
        : `#${req.body.warnaTeks}`
      : "";
    const warnaLatar = req.body.warnaLatar
      ? (req.body.warnaLatar as string)[0] === "#"
        ? req.body.warnaLatar
        : `#${req.body.warnaLatar}`
      : "";
    const urutan = Number(req.body.urutan);

    await firebase
      .firestore()
      .collection("linktree/link/data")
      .doc(tautanPendek)
      .set({
        judul,
        tautanPanjang,
        warnaTeks,
        warnaLatar,
        urutan,
      });

    return res.json({ success: true });
  })
);

router.put(
  "/tautan/urutan",
  json(),
  asyncHandler(async (req: Request, res: Response) => {
    const linksOrder = req.body.linksOrder as Array<{
      tautanPendek: string;
      urutan: number;
    }>;

    await Promise.all(
      linksOrder.map(async (l) => {
        await firebase
          .firestore()
          .collection("linktree/link/data")
          .doc(l.tautanPendek)
          .update({ urutan: l.urutan });
      })
    );

    return res.json({ success: true });
  })
);

router.delete(
  "/tautan",
  json(),
  asyncHandler(async (req: Request, res: Response) => {
    if (req.session!.role !== "admin") {
      return res.json("Tidak berhak mengakses data");
    }

    const shortLink = req.body.tautanPendek;

    await firebase
      .firestore()
      .collection("linktree/link/data")
      .doc(shortLink)
      .delete({ exists: true });

    return res.json({ success: true });
  })
);

const upload = multer({ storage: multer.memoryStorage() });

router.put(
  "/pengaturan",
  upload.array("attachments"),
  asyncHandler(async (req: Request, res: Response) => {
    if (req.session!.role !== "admin") {
      return res.json("Tidak berhak mengakses data");
    }

    const judulProfil = req.body.judulProfil;
    const bio = req.body.bio;
    const warnaTeksProfil = req.body.warnaTeksProfil
      ? (req.body.warnaTeksProfil as string)[0] === "#"
        ? req.body.warnaTeksProfil
        : `#${req.body.warnaTeksProfil}`
      : "";
    const warnaLatar = req.body.warnaLatar
      ? (req.body.warnaLatar as string)[0] === "#"
        ? req.body.warnaLatar
        : `#${req.body.warnaLatar}`
      : "";
    const warnaBackdrop = req.body.warnaBackdrop
      ? (req.body.warnaBackdrop as string)[0] === "#"
        ? req.body.warnaBackdrop
        : `#${req.body.warnaBackdrop}`
      : "";
    const backdropBlurLatar = req.body.backdropBlurLatar;
    const transparansiTombol = req.body.transparansiTombol;
    const bulatanTombol = req.body.bulatanTombol;
    const warnaTeksTombol = req.body.warnaTeksTombol
      ? (req.body.warnaTeksTombol as string)[0] === "#"
        ? req.body.warnaTeksTombol
        : `#${req.body.warnaTeksTombol}`
      : "";
    const warnaLatarTombol = req.body.warnaLatarTombol
      ? (req.body.warnaLatarTombol as string)[0] === "#"
        ? req.body.warnaLatarTombol
        : `#${req.body.warnaLatarTombol}`
      : "";
    const backdropBlurTombol = req.body.backdropBlurTombol;

    let fotoProfil = "";
    let gambarLatar = "";

    const settingsRef = firebase
      .firestore()
      .collection("linktree")
      .doc("pengaturan");
    const settingsDoc = await settingsRef.get();

    if (req.files && req.files.length) {
      let attachments: Array<string>;
      if (typeof req.body.attachmentsDetail === "string") {
        attachments = Array(req.body.attachmentsDetail);
      } else {
        attachments = req.body.attachmentsDetail;
      }
      await Promise.all(
        attachments.map(async (type, index) => {
          // check file type and size
          if (
            !(req.files as Array<{ mimetype: string }>)[
              index
            ].mimetype.includes("image/")
          ) {
            const tipe = config.type.linktree.join(" / ");
            return res.json({
              success: false,
              body: { error: `Berkas harus bertipe ${tipe}` },
            });
          }
          if (
            (req.files as Array<{ size: number }>)[index].size <
              config.limit.linktree[0] ||
            (req.files as Array<{ size: number }>)[index].size >
              config.limit.linktree[1]
          ) {
            const size = config.limit.linktree;
            return res.json({
              success: false,
              body: {
                error: `Berkas harus berukuran minimal ${size[0] / 1024}`,
              },
            });
          }

          if (settingsDoc.exists) {
            // remove previous file
            const prevFile = settingsDoc.data()![type];
            if (prevFile) {
              await firebase
                .storage()
                .bucket()
                .file(`linktree/${type}/${prevFile}`)
                .delete();
            }
          }

          // upload new file
          const fileName = randomId(32);
          const blob = firebase
            .storage()
            .bucket()
            .file(`linktree/${type}/${fileName}`);
          const blobWriter = blob.createWriteStream({
            metadata: {
              contentType: (req.files as Array<{ mimetype: string }>)[index]
                .mimetype,
            },
          });
          blobWriter.on("error", (error) => {
            return res.json({ success: false, body: { error } });
          });
          blobWriter.end(
            (req.files as Array<{ buffer: Buffer }>)[index].buffer
          );

          if (type === "fotoProfil") {
            fotoProfil = fileName;
          } else if (type === "gambarLatar") {
            gambarLatar = fileName;
          }
        })
      );
    }

    const data = {
      judulProfil,
      bio,
      warnaTeksProfil,
      warnaLatar,
      warnaBackdrop,
      backdropBlurLatar,
      transparansiTombol,
      bulatanTombol,
      backdropBlurTombol,
      fotoProfil,
      gambarLatar,
    };

    if (settingsDoc.exists) {
      if (!judulProfil) {
        data.judulProfil = settingsDoc.data()!.judulProfil;
      }
      if (!bio) {
        data.bio = settingsDoc.data()!.bio;
      } else if (bio === "null") {
        data.bio = "";
      }
      if (!warnaTeksProfil) {
        data.warnaTeksProfil = settingsDoc.data()!.warnaTeksProfil;
      }
      if (!warnaLatar) {
        data.warnaLatar = settingsDoc.data()!.warnaLatar;
      }
      if (!warnaBackdrop) {
        data.warnaBackdrop = settingsDoc.data()!.warnaBackdrop;
      }
      if (!backdropBlurLatar) {
        data.backdropBlurLatar = settingsDoc.data()!.backdropBlurLatar;
      } else {
        data.backdropBlurLatar = Number(backdropBlurLatar);
      }
      if (!transparansiTombol) {
        data.transparansiTombol = settingsDoc.data()!.transparansiTombol;
      } else {
        data.transparansiTombol = Number(transparansiTombol);
      }
      if (!bulatanTombol) {
        data.bulatanTombol = settingsDoc.data()!.bulatanTombol;
      } else {
        data.bulatanTombol = Number(bulatanTombol);
      }
      if (!backdropBlurTombol) {
        data.backdropBlurTombol = settingsDoc.data()!.backdropBlurTombol;
      } else {
        data.backdropBlurTombol = Number(backdropBlurTombol);
      }
      if (!fotoProfil) {
        data.fotoProfil = settingsDoc.data()!.fotoProfil;
      }
      if (!gambarLatar) {
        data.gambarLatar = settingsDoc.data()!.gambarLatar;
      }
    }

    await settingsRef.set(data);

    if (warnaTeksTombol || warnaLatarTombol) {
      const linkDocs = await firebase
        .firestore()
        .collection("linktree/link/data")
        .get();

      const linkRefs: Array<
        FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>
      > = [];
      linkDocs.forEach((l) => linkRefs.push(l.ref));

      await Promise.all(
        linkRefs.map(async (l) =>
          l.update({ warnaTeks: warnaTeksTombol, warnaLatar: warnaLatarTombol })
        )
      );
    }

    return res.json({ success: true });
  })
);

router.delete(
  "/pengaturan",
  json(),
  asyncHandler(async (req: Request, res: Response) => {
    const type = req.body.type;

    const settingsRef = firebase
      .firestore()
      .collection("linktree")
      .doc("pengaturan");

    const settingsDoc = await settingsRef.get();

    // remove previous file
    const prevFile = settingsDoc.data()![type];
    if (prevFile) {
      await firebase
        .storage()
        .bucket()
        .file(`linktree/${type}/${prevFile}`)
        .delete();
    }

    await settingsRef.update({ [type]: "" });

    return res.json({ success: true });
  })
);

export default router;
