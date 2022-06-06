import HtmlHead from "../../components/main/HtmlHead";
import Admin from "../../components/pages/bantuan/Admin";
import User from "../../components/pages/bantuan/User";
import Loading from "../../components/pages/Loading";

export default function Kontak({ role }: { role: string }) {
  return (
    <>
      <HtmlHead title="Kontak" />
      {!role && <Loading />}
      {role === "admin" && <Admin />}
      {role === "pengguna" && <User />}
    </>
  );
}
