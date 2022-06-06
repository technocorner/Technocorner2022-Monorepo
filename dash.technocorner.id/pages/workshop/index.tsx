import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getData } from "../../lib/method";
import Admin from "../../components/pages/workshop/Admin";
import User from "../../components/pages/workshop/User";
import Loading from "../../components/pages/Loading";
import HtmlHead from "../../components/main/HtmlHead";
import { workshop } from "../../data/events";
import RegistrationNotYetOpen from "../../components/pages/RegistrationNotYetOpen";

const WorkshopPage = ({ role }: { role: string }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const isOpen = Date.now() >= workshop.registration[0].date[0].getTime();

  useEffect(() => {
    (async () => {
      if (role !== "admin") {
        const timRes = await getData(`/dashboard/workshop/cek-registrasi`);
        if (timRes.success) {
          return router.replace(`${router.asPath}/peserta/${timRes.body.id}`);
        }
      }
      setLoading(false);
    })();
  }, [router.isReady, role]);

  return (
    <>
      <HtmlHead title="Workshop" />
      {!isOpen && <RegistrationNotYetOpen id="workshop" />}
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
};

export default WorkshopPage;
