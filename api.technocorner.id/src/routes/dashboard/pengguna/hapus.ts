import { json, NextFunction, Request, Response, Router } from "express";
import asyncHandler from "../../../libs/asyncHandler";
import firebase from "../../../libs/firebase";

const router = Router();

router.use(json());

router.delete(
  "/",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const idPengguna = req.body.email;

    await firebase.firestore().runTransaction(async (t) => {
      try {
        const penggunaRef = firebase
          .firestore()
          .collection("pengguna")
          .doc(idPengguna);
        const penggunaDoc = await t.get(penggunaRef);

        const data: {
          komp: Array<{
            ref: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>;
            ketua: boolean;
            pengguna: {
              refs: Array<
                FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>
              >;
              acara: Array<object>;
            };
            anggota: Array<object>;
          }>;
          ws: {
            ref?: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>;
            peserta?: Array<object>;
          };
          web: {
            ref?: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>;
          };
        } = {
          komp: [],
          ws: {},
          web: {},
        };

        await Promise.all(
          penggunaDoc
            .data()!
            .acara.map(async (a: { kategori: string; id: string }) => {
              switch (a.kategori) {
                case "eec":
                case "iot":
                case "tp":
                case "lf":
                  const kompRef = firebase
                    .firestore()
                    .collection(`acara/${a.kategori}/tim`)
                    .doc(a.id);
                  const kompDoc = await t.get(kompRef);

                  const komp: {
                    ref: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>;
                    ketua: boolean;
                    pengguna: {
                      refs: Array<
                        FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>
                      >;
                      acara: Array<object>;
                    };
                    anggota: Array<object>;
                  } = {
                    ref: kompRef,
                    ketua: kompDoc.data()!.ketua.id === idPengguna,
                    pengguna: { refs: [], acara: [] },
                    anggota: [],
                  };

                  if (komp.ketua) {
                    const idAnggota = kompDoc
                      .data()!
                      .anggota.map((an: { id: string }) => an.id);

                    await Promise.all(
                      idAnggota.map(async (id: string) => {
                        const ref = firebase
                          .firestore()
                          .collection("pengguna")
                          .doc(id);
                        komp.pengguna.refs.push(ref);

                        const doc = await t.get(ref);
                        const acara = doc
                          .data()!
                          .acara.filter(
                            (ac: { id: string }) => ac.id !== kompDoc.data()!.id
                          );
                        komp.pengguna.acara.push(acara);
                      })
                    );
                  } else {
                    komp.anggota = kompDoc
                      .data()!
                      .anggota.filter(
                        (an: { id: string }) => an.id !== idPengguna
                      );
                  }

                  data.komp.push(komp);
                  break;
                case "workshop":
                  const wsRef = firebase
                    .firestore()
                    .collection("acara/workshop/peserta")
                    .doc(a.id);
                  const wsDoc = await t.get(wsRef);

                  const ws = {
                    ref: wsRef,
                    peserta: [{}],
                  };

                  if (wsDoc.exists) {
                    ws.peserta = wsDoc
                      .data()!
                      .peserta.filter(
                        (p: { id: string }) => p.id !== idPengguna
                      );
                  }

                  data.ws = ws;
                  break;
                case "webinar":
                  const ref = firebase
                    .firestore()
                    .collection("acara/webinar/peserta")
                    .doc(a.id);
                  const web = { ref };
                  data.web = web;
                  break;
              }
            })
        );

        data.komp.forEach((komp) => {
          if (komp.ketua) {
            komp.pengguna.refs.forEach((ref, index) => {
              t.update(ref, { acara: komp.pengguna.acara[index] });
            });
            t.delete(komp.ref);
          } else {
            t.update(komp.ref, { anggota: komp.anggota });
          }
        });

        if (Object.keys(data.ws).length) {
          if (data.ws.peserta!.length) {
            t.update(data.ws.ref!, { peserta: data.ws.peserta });
          } else {
            t.delete(data.ws.ref!);
          }
        }

        if (Object.keys(data.web).length) {
          t.delete(data.web.ref!);
        }

        t.delete(penggunaRef);
      } catch (e) {
        next(e);
        throw e;
      }
    });

    await firebase.firestore().collection("pengguna").doc(idPengguna).delete();

    return res.json({ success: true });
  })
);

export default router;
