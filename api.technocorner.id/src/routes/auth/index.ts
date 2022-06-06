import { Router } from "express";
import redirectIfSignedIn from "../../libs/routes/auth/redirectIfSignedIn";
import csrf from "./csrf";
import signout from "./signout";
import showSession from "./show-session";
import signin from "./signin";
import signup from "./signup";
import resetPassword from "./reset-password";
import checkSignin from "./check-signin";

const router = Router();

router.use("/csrf", csrf);
router.use("/signout", signout);
router.use("/show-session", showSession);
router.use("/check-signin", checkSignin);

router.use(redirectIfSignedIn);

router.use("/signin", signin);
router.use("/signup", signup);
router.use("/reset-password", resetPassword);

export default router;
