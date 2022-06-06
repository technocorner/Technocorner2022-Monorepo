import { useEffect, useState } from "react";
import User from "../../components/pages/webinar/User";
import Admin from "../../components/pages/webinar/Admin";
import { getData } from "../../lib/method";
import { useRouter } from "next/router";
import Loading from "../../components/pages/Loading";
import HtmlHead from "../../components/main/HtmlHead";
import RegistrationNotYetOpen from "../../components/pages/RegistrationNotYetOpen";
import { webinar } from "../../data/events";

export default function Webinar({ role }: { role: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const isOpen = Date.now() >= webinar.registration[0].date[0].getTime();

  useEffect(() => {
    (async () => {
      if (role !== "admin") {
        const timRes = await getData(`/dashboard/webinar/cek-registrasi`);
        if (timRes.success) {
          return router.replace(`${router.asPath}/peserta/${timRes.body.id}`);
        }
      }
      setLoading(false);
    })();
  }, [router.isReady, role]);

  return (
    <>
      <HtmlHead title="Webinar" />
      {!isOpen && <RegistrationNotYetOpen id="webinar" />}
      {isOpen &&
        (loading ? (
          <Loading />
        ) : (
          <>
            {role === "admin" && <Admin />}
            {role === "pengguna" && <User />}
          </>
        ))}
    </>
  );
}
