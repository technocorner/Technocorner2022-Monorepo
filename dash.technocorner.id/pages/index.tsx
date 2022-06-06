import User from "../components/pages/beranda/User";
import Admin from "../components/pages/beranda/Admin";
import Loading from "../components/pages/Loading";
import HtmlHead from "../components/main/HtmlHead";

export default function Beranda({ role }: { role: string }) {
  return (
    <>
      <HtmlHead title="Beranda" />
      {!role && <Loading />}
      {role === "admin" && <Admin />}
      {role === "pengguna" && <User />}
    </>
  );
}
