import { useEffect, useState } from "react";
import { GetStaticPaths, GetStaticProps } from "next/types";
import { useRouter } from "next/router";
import competitions from "../../../data/competitions.json";
import { getData } from "../../../lib/method";
import Admin from "../../../components/pages/kompetisi/cabang/Admin";
import User from "../../../components/pages/kompetisi/cabang/User";
import Loading from "../../../components/pages/Loading";
import HtmlHead from "../../../components/main/HtmlHead";
import { events } from "../../../data/events";
import RegistrationNotYetOpen from "../../../components/pages/RegistrationNotYetOpen";
import RegistrationClosed from "../../../components/pages/RegistrationClosed";
import { isRegistClose, isRegistOpen } from "../../../lib/isRegistOpenClose";

const SingleKompetisiPage = ({
  email,
  role,
  title,
  cabang,
}: {
  email: string;
  role: string;
  title: string;
  cabang: string;
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(isRegistOpen(cabang));
  const [isClose, setIsClose] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await getData(
        `/dashboard/kompetisi/${cabang}/cek-registrasi`
      );
      if (res.success) {
        return router.replace(`${router.asPath}/tim/${res.body.id}`);
      } else {
        if (
          [
            "mail@hilmy.dev",
            "fikri.zaini.baridwan@mail.ugm.ac.id",
            "ibrahim.haidar@mail.ugm.ac.id",
            "dimas.s.a@mail.ugm.ac.id",
          ].indexOf(email) < 0
        ) {
          setIsClose(isRegistClose(cabang));
        }
      }
      setLoading(false);
    })();
  }, [cabang, router.isReady]);

  return (
    <>
      <HtmlHead title={events.find((e) => e.id === cabang)!.name} />
      {!isOpen && <RegistrationNotYetOpen id={cabang} />}
      {isOpen &&
        (loading ? (
          <Loading />
        ) : (
          <>
            {role === "admin" && <Admin title={title} cabang={cabang} />}
            {role === "pengguna" &&
              (isClose ? (
                <RegistrationClosed id={cabang} />
              ) : (
                <User title={title} cabang={cabang} />
              ))}
          </>
        ))}
    </>
  );
};

export default SingleKompetisiPage;

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: Object.keys(competitions).map((c) => {
      return { params: { cabang: c } };
    }),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const title = (competitions as { [key: string]: string })[
    ctx.params!.cabang as string
  ];

  if (!title) {
    return { notFound: true };
  }

  return {
    props: { title, cabang: ctx.params!.cabang },
  };
};
