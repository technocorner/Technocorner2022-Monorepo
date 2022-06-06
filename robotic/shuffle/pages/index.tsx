import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Team Shuffle · Technocorner 2022</title>
        <meta
          name="description"
          content="Team shuffle for Line Follower and Transporter Competition"
        />
      </Head>
      <main className="my-auto">
        <h1 className="w-fit mx-auto mb-10 font-bold text-5xl">Team Shuffle</h1>
        <div className="flex justify-between gap-10">
          <Link href="/lf">
            <a className="w-44 h-16 flex items-center justify-center font-bold text-lg bg-sky-500 rounded-xl">
              Line Follower
            </a>
          </Link>
          <Link href="/tp">
            <a className="w-44 h-16 flex items-center justify-center font-bold text-lg bg-sky-500 rounded-xl">
              Transporter
            </a>
          </Link>
        </div>
      </main>
    </>
  );
};

export default Home;
