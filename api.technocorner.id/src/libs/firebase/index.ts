import admin from "firebase-admin";
import serviceAccount from "./technocorner-2022-firebase-adminsdk-h74wl-802587ebb9.json";

export default admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  storageBucket: "technocorner-2022.appspot.com",
});
