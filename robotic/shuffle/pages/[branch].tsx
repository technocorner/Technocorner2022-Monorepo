import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import lfData from "../data/shuffle_linefollower.json";
import tpData from "../data/shuffle_transporter.json";

type ShuffleData = {
  instansi: string;
  tim: string[];
}[];

type ShuffleDataWithOrder = {
  instansi: string;
  tim: { nama: string; urutan: number }[];
}[];

export default function Branch() {
  const router = useRouter();
  const [branch, setBranch] = useState("");
  const [branchName, setBranchName] = useState("");
  const [shuffleData, setShuffleData] = useState<ShuffleDataWithOrder[]>([]);

  useEffect(() => {
    if (router.isReady) {
      const branch = router.query.branch as string;
      setBranch(branch);

      let branchName = "";
      let shuffleData: ShuffleData;
      switch (branch) {
        case "lf":
          branchName = "Line Follower";
          shuffleData = [...lfData];
          break;
        case "tp":
          branchName = "Transporter";
          shuffleData = [...tpData];
          break;
      }
      setBranchName(branchName);

      let order = 0;
      const shuffleDataWithOrder = [];
      for (let i = 0; i < shuffleData!.length; ++i) {
        const tim = [];
        for (let j = 0; j < shuffleData![i].tim.length; ++j) {
          ++order;
          tim.push({ nama: shuffleData![i].tim[j], urutan: order });
        }
        shuffleDataWithOrder.push({ ...shuffleData![i], tim });
      }

      setShuffleData([shuffleDataWithOrder!]);
    }
  }, [router.isReady]);

  function submitHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const target = event.target as typeof event.target & {
      jumlahBreakout: { value: string };
    };
    const jumlahBreakout = parseInt(
      target.jumlahBreakout.value ? target.jumlahBreakout.value : "1"
    );

    let oldShuffleData: ShuffleData = [];
    switch (branch) {
      case "lf":
        oldShuffleData = lfData;
        break;
      case "tp":
        oldShuffleData = tpData;
        break;
    }

    // shuffle teams in each agency
    for (let i = 0; i < oldShuffleData.length; ++i) {
      const teams = oldShuffleData[i].tim;
      const newTeams = [];

      let indexs: number[] = [];
      for (let j = 0; j < teams.length; ++j) {
        let index = 0;
        do {
          index = Math.floor(Math.random() * teams.length);
        } while (indexs.includes(index));
        indexs.push(index);

        newTeams.push(teams[index]);
      }

      oldShuffleData[i].tim = newTeams;
    }

    // shuffle agency
    {
      const oldShuffleDataCopy = [...oldShuffleData];
      let indexs: number[] = [];
      for (let i = 0; i < oldShuffleDataCopy.length; ++i) {
        let index = 0;
        do {
          index = Math.floor(Math.random() * oldShuffleDataCopy.length);
        } while (indexs.includes(index));
        indexs.push(index);

        oldShuffleData[i] = oldShuffleDataCopy[index];
      }
    }

    const newShuffleData: ShuffleDataWithOrder[] = [];

    // create empty array as much as the number of breakout room
    for (let i = 0; i < jumlahBreakout; ++i) {
      newShuffleData.push([]);
    }

    oldShuffleData.forEach((data) => {
      let leastBreakoutIndex = 0;
      let leastBreakoutLength = 0;

      if (newShuffleData[0].at(-1)) {
        leastBreakoutLength = newShuffleData[0].at(-1)!.tim.at(-1)!.urutan;

        for (let i = 1; i < newShuffleData.length; ++i) {
          if (newShuffleData[i].at(-1)) {
            if (
              leastBreakoutLength > newShuffleData[i].at(-1)!.tim.at(-1)!.urutan
            ) {
              leastBreakoutLength = newShuffleData[i]
                .at(-1)!
                .tim.at(-1)!.urutan;
              leastBreakoutIndex = i;
            }
          } else {
            leastBreakoutIndex = i;
            leastBreakoutLength = 0;
          }
        }
      }

      const newTeam: { nama: string; urutan: number }[] = [];
      for (let j = 0; j < data.tim.length; ++j) {
        ++leastBreakoutLength;
        newTeam.push({ nama: data.tim[j], urutan: leastBreakoutLength });
      }

      newShuffleData[leastBreakoutIndex].push({
        instansi: data.instansi,
        tim: newTeam,
      });
    });

    setShuffleData(newShuffleData);

    (async () => {
      const res = await fetch("http://localhost:3000/api/shuffle", {
        method: "POST",
        body: JSON.stringify({ branch, data: newShuffleData }),
      });
      console.log(await res.json());
    })();
  }

  return (
    <div className="w-full p-8 flex flex-col items-center">
      {branchName.length > 0 && (
        <Head>
          <title>{branchName} Team Shuffle · Technocorner 2022</title>
          <meta name="description" content={`Team shuffle for ${branchName}`} />
        </Head>
      )}
      <form onSubmit={submitHandler} className="flex gap-x-6 items-center">
        <div>
          <span>Jumlah breakout: </span>
          <input
            name="jumlahBreakout"
            type="number"
            className="w-10 px-1 bg-white/20 outline-none"
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-rose-500 rounded-lg">
          Acak
        </button>
      </form>
      <div className="w-[60rem] flex flex-col gap-y-10">
        {shuffleData.map((shuffle, index) => (
          <div key={index}>
            <h2 className="w-fit mx-auto mt-10 mb-2 font-bold text-xl text-center py-2 px-4 bg-sky-700 rounded-xl">
              Breakout {index + 1}
            </h2>
            <table className="w-full">
              <tr>
                <th className="border px-1">Instansi</th>
                <th className="border px-1">Nama Tim</th>
                <th className="border px-1">Urutan</th>
              </tr>
              {shuffle?.map((data, index2) => (
                <tr key={index2}>
                  <td className="border px-1">{data.instansi}</td>
                  <td className="border px-1">
                    {data.tim.map((tim, index3) => (
                      <p key={index3}>{tim.nama}</p>
                    ))}
                  </td>
                  <td className="border px-1 text-center">
                    {data.tim.map((tim, index3) => (
                      <p key={index3}>{tim.urutan}</p>
                    ))}
                  </td>
                </tr>
              ))}
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
