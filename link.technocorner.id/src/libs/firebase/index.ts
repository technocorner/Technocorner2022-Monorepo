import admin from "firebase-admin";
import serviceAccount from "./linktc22-firebase-adminsdk-1u7g4-25788db485.json";

export default admin.initializeApp(
  {
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  },
  "linkTC22"
);
