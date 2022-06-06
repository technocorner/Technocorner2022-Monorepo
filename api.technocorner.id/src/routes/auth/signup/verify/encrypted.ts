import { Request, Response, Router } from "express";
import verifyUserSignup from "../../../../libs/routes/auth/verifyUserSignup";
import asyncHandler from "../../../../libs/asyncHandler";
import { decrypt } from "../../../../libs/cryptograph";
import { main } from "../../../../data/client";

const router = Router();

router.get(
  "/:enc",
  asyncHandler(async (req: Request, res: Response) => {
    const encryptedStr = req.params.enc;

    const encrypted = encryptedStr.substring(0, 8);
    const decryptor = encryptedStr.substring(8);

    const id = decrypt({ encrypted, decryptor });

    const result = await verifyUserSignup(id);

    if (!result.success) {
      return res
        .status(401)
        .send(
          result.body && result.body.error
            ? result.body!.error
            : "Verifikasi gagal. Jika ini adalah sebuah kesalahan, mohon hubungi panitia. Terima kasih."
        );
    }

    return res.redirect(main + "/auth/verified");
  })
);

export default router;
