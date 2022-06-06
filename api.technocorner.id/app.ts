import app from "./src/routes";
import { server, port } from "./src/data/server";

app.listen(port, () => {
  console.log(
    `server in ${process.env.NODE_ENV} mode is listening on ${server}`
  );
});
