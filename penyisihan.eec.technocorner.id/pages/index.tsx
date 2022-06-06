import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import HtmlHead from "../components/HtmlHead";
import data from "../data/data";
import {
  SessionType,
  NumbersEnum,
  SubjectEnum,
  SubjectString,
  WsConnStatusEnum,
  TrackAnsweredType,
  PositionsType,
  ImgLoadStateEnum,
  WebSocketSyncDataRequestEnum,
  WebSocketSyncDataResponseType,
  WebSocketSyncDataResponseEnum,
  AnsWithoutValType,
  CompleteAnsType,
  PositionType,
  TimerType,
  TimerEnum,
} from "../interface/interface";
import { postData } from "../lib/fetch";
import statusCode from "../lib/statusCode";
import { toastError, toastLoading, toastSuccess } from "../lib/toast";

const Home = ({
  session,
  signOut,
}: {
  session: SessionType;
  signOut: Function;
}) => {
  const router = useRouter();
  const [init, setInit] = useState(true);
  const [number, setNumber] = useState(NumbersEnum.First);
  const [subject, setSubject] = useState(SubjectEnum.Math);
  const [timer, setTimer] = useState<TimerType>(TimerEnum.default);
  const [wsConn, setWsConn] = useState<WebSocket | undefined>(undefined);
  const [wsConnStatus, setWsConnStatus] = useState(WsConnStatusEnum.nonactive);
  const [answered, setAnswered] = useState<TrackAnsweredType>();
  const [syncAnswered, setSyncAnswered] = useState<TrackAnsweredType>();
  const [positions, setPositions] = useState<PositionsType>({});
  const [syncPositions, setSyncPositions] = useState<PositionsType>({});
  const [imgQuestionLoadState, setImgQuestionLoadState] = useState(
    ImgLoadStateEnum.Loading
  );
  const [imgQuestionKey, setImgQuestionKey] = useState(0);

  useEffect(() => {
    const { subject, number } = getParamsHelper();
    if (subject) {
      setSubject(parseInt(subject));
    }
    if (number) {
      setNumber(parseInt(number));
    }

    setInit(false);
  }, []);

  useEffect(() => {
    if (session && session.teamId && session.userId) {
      initWsConn();
    }
  }, [session]);

  useEffect(() => {
    if (router.isReady) {
      const { subject: subjectParam, number: numberParam } = getParamsHelper();

      if (subjectParam && subject !== parseInt(subjectParam)) {
        setSubject(parseInt(subjectParam));
      }

      if (numberParam && number !== parseInt(numberParam)) {
        setNumber(parseInt(numberParam));
      }
    }
  }, [router.isReady, router.asPath]);

  useEffect(() => {
    if (!init && router.isReady) {
      const { subject: subjectParam, number: numberParam } = getParamsHelper();

      if (
        subject !== parseInt(subjectParam!) ||
        number !== parseInt(numberParam!)
      ) {
        if (imgQuestionLoadState !== ImgLoadStateEnum.Loading) {
          setImgQuestionLoadState(ImgLoadStateEnum.Loading);
        }

        router.push(`/?subject=${subject}&number=${number}`);

        router.beforePopState(({ url }) => {
          const { subject, number } = getParamsHelper(url);

          if (subject) {
            setSubject(parseInt(subject));
          }
          if (number) {
            setNumber(parseInt(number));
          }

          return true;
        });

        return () => router.beforePopState(() => true);
      }
    }
  }, [router.isReady, number, subject]);

  useEffect(() => {
    if (syncAnswered && syncAnswered.data) {
      if (
        !answered ||
        (answered && Math.floor(answered.time) < Math.floor(syncAnswered.time))
      ) {
        setAnswered(syncAnswered);
      }
    }
  }, [syncAnswered]);

  useEffect(() => {
    if (
      answered &&
      answered.data &&
      (!syncAnswered || answered.time !== syncAnswered.time)
    ) {
      updateAnswerHelper();
    }
  }, [answered]);

  useEffect(() => {
    if (!session || !session.userName) {
      return;
    }

    let newPositions = { ...syncPositions };
    newPositions = {
      ...newPositions,
      [session.userName]: { subject, number },
    };
    setPositions(newPositions);
    updatePositionHelper();
  }, [session, number, subject]);

  useEffect(() => {
    if (
      syncPositions &&
      session &&
      session.userName &&
      syncPositions[session.userName]
    ) {
      if (
        syncPositions[session.userName].number !== number ||
        syncPositions[session.userName].subject !== subject
      ) {
        updatePositionHelper();
        return;
      }
      setPositions(syncPositions);
    }
  }, [syncPositions]);

  async function signOutHandler() {
    const loadingToast = toastLoading();
    if (wsConn) {
      wsConn.close(4998, "Client signout");
      setWsConn(undefined);
    }
    await signOut();
    toast.dismiss(loadingToast);
  }

  function initWsConn() {
    if (wsConn && wsConn.readyState < WebSocket.CLOSED) {
      return;
    }

    const newWsConn = new WebSocket(
      `${data.wsServer}?groupId=${session.teamId}&userId=${session.userId}`
    );

    newWsConn.onmessage = (event) => {
      const wsData: WebSocketSyncDataResponseType = JSON.parse(event.data);
      handleWsDataHelper(wsData, newWsConn);
    };

    newWsConn.onopen = () => {
      setWsConnStatus(WsConnStatusEnum.active);
    };

    newWsConn.onclose = (event) => {
      // console.log("closews", event.code, "Reason:", event.reason);

      // 4995: Deadline has passed (server)
      // 4996: Answers has been submitted (server)
      // 4997: New WebSocket instance (client)
      // 4998: Signout (client)
      // 4999: Multiple access detected (server)

      if (event.code !== 4997) {
        setWsConnStatus(WsConnStatusEnum.nonactive);
        setTimer(TimerEnum.default);
      }

      if (event.code === 4999 || event.code == 4996 || event.code == 4995) {
        toastError(event.reason ? event.reason : "Dikeluarkan dari server");
        signOutHandler();
        return;
      }

      if (event.code !== 4997 && event.code !== 4998) {
        setTimeout(() => {
          // console.log("reinitws");
          initWsConn();
        }, 2000);
      }
    };

    setWsConn((prev) => {
      if (prev) {
        prev.close(4997, "New websocket connection created");
      }
      return newWsConn;
    });
  }

  function answerHandler(ans: string) {
    if (!deleteAnswerHandler(ans)) {
      changeAnswerHelper({ ans });
    }
  }

  function deleteAnswerHandler(ans?: string) {
    if (ans ? checkAnswerHelper({ ans }) : checkAnswerHelper()) {
      const newAnswered = { ...answered };
      delete newAnswered.data![subject][number];
      newAnswered.time = Date.now();
      setAnswered(newAnswered as TrackAnsweredType);
      return true;
    }
    return false;
  }

  function doubtHandler() {
    if (!checkAnswerHelper()) {
      toastError("Pilih jawaban terlebih dahulu");
      return;
    }

    changeAnswerHelper({ isDoubt: !answered!.data[subject][number].isDoubt });
  }

  function changeSubjectHandler(subject: SubjectEnum) {
    if (!wsConn || wsConn.readyState !== WebSocket.OPEN) {
      toastError("Tidak terhubung ke server");
      return;
    }

    setSubject(subject);
    setNumber(NumbersEnum.First);
  }

  function changeNumberHandler(number: number) {
    if (!wsConn || wsConn.readyState !== WebSocket.OPEN) {
      toastError("Tidak terhubung ke server");
      return;
    }

    setNumber(number);
  }

  function refreshImgQuestionHandler() {
    setImgQuestionLoadState(ImgLoadStateEnum.Loading);
    setImgQuestionKey(Date.now() / (60 * 1000));
  }

  async function submitHandler() {
    const loadingToast = toastLoading();

    const res = await postData("/question/submit", {});

    toast.dismiss(loadingToast);
    if (res.status === statusCode.Created) {
      toastSuccess("Berhasil melakukan submit jawaban");
      signOutHandler();
    } else {
      toastError(res.json ? res.json : "Gagal melakukan submit jawaban");
    }
  }

  function getParamsHelper(url?: string) {
    const urlParams = new URLSearchParams(
      new URL(`${data.client}${url ? url : router.asPath}`).search
    );
    const subject = urlParams.get("subject");
    const number = urlParams.get("number");
    return { subject, number };
  }

  function checkAnswerHelper(param?: { ans?: string; num?: number }) {
    let ans, num;
    if (param) {
      ({ ans, num } = param);
    }
    if (
      answered &&
      answered.data &&
      answered.data[subject] &&
      answered.data[subject][num ? num : number]
    ) {
      if (ans && ans.length > 0) {
        if (answered.data[subject][num ? num : number].value === ans) {
          return true;
        }
        return false;
      }
      return true;
    }
    return false;
  }

  function changeAnswerHelper({
    ans,
    isDoubt,
  }: {
    ans?: string;
    isDoubt?: boolean;
  }) {
    if (!wsConn || wsConn.readyState !== WebSocket.OPEN) {
      toastError("Tidak terhubung ke server");
      return;
    }

    let newAnswered = { ...answered };
    if (!newAnswered) {
      newAnswered = { time: Date.now() };
    }
    let val: AnsWithoutValType = {
      by: session.userName,
      isDoubt: isDoubt ? true : false,
    };
    if (ans) {
      val.value = ans;
    }
    if (checkAnswerHelper()) {
      newAnswered.data![subject][number] = {
        ...newAnswered.data![subject][number],
        ...val,
      };
    } else if (newAnswered) {
      if (newAnswered.data) {
        if (newAnswered.data[subject]) {
          newAnswered.data[subject] = {
            ...newAnswered.data[subject],
            [number]: val as CompleteAnsType,
          };
        } else {
          newAnswered.data = {
            ...newAnswered.data,
            [subject]: { [number]: val },
          };
        }
      } else {
        newAnswered = {
          ...newAnswered,
          data: { [subject]: { [number]: val } },
        } as TrackAnsweredType;
      }
    }
    newAnswered.time = Date.now();
    setAnswered(newAnswered as TrackAnsweredType);
  }

  function updatePositionHelper() {
    sendWebsocketHelper({
      type: WebSocketSyncDataRequestEnum.position,
      position: { subject, number },
    });
  }

  function updateAnswerHelper() {
    sendWebsocketHelper({
      type: WebSocketSyncDataRequestEnum.answer,
      answered: answered!.data,
    });
  }

  function sendWebsocketHelper(data: any) {
    if (wsConn && wsConn.readyState === WebSocket.OPEN) {
      // console.log("send", data);
      wsConn.send(JSON.stringify(data));
    }
  }

  function handleWsDataHelper(
    wsData: WebSocketSyncDataResponseType,
    wsConn: WebSocket
  ) {
    // console.log("receive", wsData);
    if (wsData.type === WebSocketSyncDataResponseEnum.error) {
      toastError(wsData.payload);
      return;
    }
    if (wsData.type === WebSocketSyncDataResponseEnum.timer) {
      const time: number = wsData.payload;
      let hours: number | string = Math.floor(time / (60 * 60));
      let minutes: number | string = Math.floor(time / 60) - hours * 60;
      let seconds: number | string = time - (hours * 60 * 60 + minutes * 60);
      if (hours < 10) {
        hours = `0${hours}`;
      }
      if (minutes < 10) {
        minutes = `0${minutes}`;
      }
      if (seconds < 10) {
        seconds = `0${seconds}`;
      }
      setTimer(`${hours}:${minutes}:${seconds}`);
      return;
    }
    if (wsData.type === WebSocketSyncDataResponseEnum.position) {
      const newPositions: PositionsType = {};
      let count = 0;
      (
        wsData.payload as { position: PositionType; userName: string }[]
      ).forEach((pl) => {
        if (pl.userName && pl.position) {
          if (pl.userName == session.userName) {
            ++count;
            if (count > 1) {
              // No longer used. It's been handled by the backend.
              wsConn.close(4999, "Multiple access detected");
              toastError("Akses ganda terdeteksi");
              return;
            }
          }
          newPositions[pl.userName] = pl.position;
        }
      });
      setSyncPositions(newPositions);
      // console.log("newPosition", newPositions);
      return;
    }
    if (wsData.type === WebSocketSyncDataResponseEnum.data) {
      const time = new Date(wsData.payload.time).getTime();
      setSyncAnswered({ time, data: wsData.payload.data });
      // console.log("newAnswered", { time, data: wsData.payload.data });
      return;
    }
  }

  return (
    <>
      <HtmlHead title={`${SubjectString[subject]} - ${number}`} />
      {session !== undefined && (
        <main className="min-w-screen min-h-screen flex">
          <section className="h-screen py-6 px-8 flex-1 flex flex-col bg-zinc-200">
            <div className="min-h-0 flex-1 p-6 flex flex-col items-center bg-white rounded-3xl">
              <h1 className="self-start w-full mb-3 flex items-center">
                SOAL {number} - {SubjectString[subject]}
                {checkAnswerHelper() && (
                  <span className="inline-block ml-auto text-xs">
                    {" "}
                    (Dijawab oleh{" "}
                    {answered!.data[subject][number].by.split(" ")[0]})
                  </span>
                )}
              </h1>
              <div className="min-h-0 shrink w-full mb-6 overflow-y-auto">
                <img
                  key={imgQuestionKey}
                  src={`${data.apiServer[0]}/question?subject=${subject}&number=${number}&key=${imgQuestionKey}`}
                  alt={`Pertanyaan ${SubjectString[subject]} nomor ${number}`}
                  onLoad={() =>
                    setImgQuestionLoadState(ImgLoadStateEnum.Loaded)
                  }
                  onError={() =>
                    setImgQuestionLoadState(ImgLoadStateEnum.Error)
                  }
                  className={`${
                    imgQuestionLoadState === ImgLoadStateEnum.Loaded
                      ? "block"
                      : "hidden"
                  } mx-auto pointer-events-none select-none touch-none`}
                />
                {imgQuestionLoadState === ImgLoadStateEnum.Loading && (
                  <span className="inline-block w-full text-center">
                    Sedang memuat soal...
                  </span>
                )}
                {imgQuestionLoadState === ImgLoadStateEnum.Error && (
                  <span className="inline-block w-full text-center">
                    <span className="text-red-500">Terjadi galat.</span>{" "}
                    <button
                      onClick={refreshImgQuestionHandler}
                      className="hover:underline"
                    >
                      Klik untuk memuat ulang soal
                    </button>{" "}
                    atau{" "}
                    <button
                      onClick={() => router.reload()}
                      className="hover:underline"
                    >
                      klik untuk merefresh halaman
                    </button>
                    .
                  </span>
                )}
              </div>
              <div className="w-96 mt-auto">
                <div className="w-full flex justify-between">
                  {["A", "B", "C", "D", "E"].map((ans) => (
                    <button
                      key={ans}
                      onClick={() => answerHandler(ans)}
                      className={`w-12 h-12 rounded-lg ${
                        checkAnswerHelper({ ans })
                          ? "bg-orange-500"
                          : "bg-zinc-300"
                      }`}
                    >
                      {ans}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="w-[35rem] mt-6 mx-auto flex justify-between">
              <button
                onClick={() => number > 1 && changeNumberHandler(number - 1)}
                className={`${
                  number === NumbersEnum.First ? "bg-zinc-400" : "bg-blue-600"
                } px-4 py-2 rounded-lg text-white`}
              >
                Sebelumnya
              </button>
              <button
                onClick={doubtHandler}
                className={`${
                  checkAnswerHelper()
                    ? answered!.data[subject][number].isDoubt
                      ? "bg-yellow-500"
                      : "bg-yellow-400"
                    : "bg-zinc-400"
                } px-4 py-2 rounded-lg text-white`}
              >
                Ragu-ragu
              </button>
              <button
                onClick={() => deleteAnswerHandler()}
                className={`${
                  checkAnswerHelper() ? "bg-rose-500" : "bg-zinc-400"
                } px-4 py-2 rounded-lg text-white`}
              >
                Hapus jawaban
              </button>
              <button
                onClick={() =>
                  number < NumbersEnum.Last && changeNumberHandler(number + 1)
                }
                className={`${
                  number === NumbersEnum.Last ? "bg-zinc-400" : "bg-blue-600"
                } px-4 py-2 rounded-lg text-white`}
              >
                Selanjutnya
              </button>
            </div>
          </section>
          <section className="w-96 h-screen py-6 px-8 flex flex-col bg-zinc-300">
            <div className="mb-4 flex justify-between">
              <div className="w-52">
                <p className="truncate">{session.userName}</p>
                <p className="truncate font-bold text-sm">{session.teamName}</p>
              </div>
              <button
                onClick={signOutHandler}
                className="mt-1.5 px-4 py-1 bg-rose-600 rounded-lg text-white"
              >
                Keluar
              </button>
            </div>
            <div className="h-9 mb-4 flex items-center justify-between">
              <span className="flex items-center gap-x-1">
                Sisa waktu: <b className="text-xl">{timer}</b>
              </span>
              <span
                title={wsConnStatus ? "Terhubung" : "Tidak terhubung"}
                className="relative h-5 flex items-center gap-x-1"
              >
                <span>Sinkronisasi:</span>
                {wsConnStatus === WsConnStatusEnum.active && (
                  <span className="animate-ping absolute right-0 inline-flex h-5 w-5 rounded-full bg-green-400 opacity-75"></span>
                )}
                <span
                  className={`${
                    wsConnStatus === WsConnStatusEnum.active
                      ? "bg-green-500"
                      : "bg-red-500"
                  } relative inline-flex rounded-full h-5 w-5`}
                ></span>
              </span>
            </div>
            <nav className="mb-4 flex gap-x-1">
              <button
                onClick={() => changeSubjectHandler(SubjectEnum.Math)}
                className={`${
                  subject === SubjectEnum.Math
                    ? "bg-orange-500 text-white"
                    : "bg-orange-100 text-zinc-500"
                } flex-1 px-2 py-1 border-2 border-black rounded font-bold`}
              >
                Math
              </button>
              <button
                onClick={() => changeSubjectHandler(SubjectEnum.Phys)}
                className={`${
                  subject === SubjectEnum.Phys
                    ? "bg-orange-500 text-white"
                    : "bg-orange-100 text-zinc-500"
                } flex-1 px-2 py-1 border-2 border-black rounded font-bold`}
              >
                Phys
              </button>
              <button
                onClick={() => changeSubjectHandler(SubjectEnum.Comp)}
                className={`${
                  subject === SubjectEnum.Comp
                    ? "bg-orange-500 text-white"
                    : "bg-orange-100 text-zinc-500"
                } flex-1 px-2 py-1 border-2 border-black rounded font-bold`}
              >
                Comp
              </button>
            </nav>
            <div className="mb-4 shrink overflow-y-auto">
              <div className="h-[32rem] grid grid-cols-5 grid-rows-8 auto-cols-auto">
                {Array.from(
                  { length: NumbersEnum.Last },
                  (_, i) => i + NumbersEnum.First
                ).map((i) => {
                  const isAnswered = checkAnswerHelper({ num: i });
                  const isDoubt =
                    isAnswered && answered!.data[subject][i].isDoubt;

                  const rightSide = i % 5 === 0;
                  const upSide = i <= 5;

                  return (
                    <div
                      key={i}
                      className={`${
                        isAnswered
                          ? isDoubt
                            ? "bg-yellow-400"
                            : "bg-lime-500"
                          : ""
                      } ${rightSide && "border-r-2"} ${
                        upSide && "border-t-2"
                      } relative flex border-b-2 border-l-2 border-black text-lg overflow-hidden`}
                    >
                      <button
                        onClick={() => changeNumberHandler(i)}
                        className={`${
                          number === i && "bg-black/5"
                        } w-full h-full font-bold`}
                      >
                        {i}
                      </button>
                      <div className="absolute right-0.5 bottom-0.5 flex gap-x-0.5">
                        {positions &&
                          Object.entries(positions).map((position, index) => {
                            if (
                              position[1].subject === subject &&
                              position[1].number === i
                            ) {
                              return (
                                <p
                                  key={index}
                                  title={position[0]}
                                  className="w-4 h-4 flex items-center justify-center bg-black/10 rounded-full text-xs hover:scale-125"
                                >
                                  {position[0][0]}
                                </p>
                              );
                            }
                          })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mb-4">
              <div className="flex items-center gap-x-4">
                <div className="w-6 h-6 bg-lime-500 border-2 border-black"></div>
                <span>Sudah terjawab</span>
              </div>
              <div className="mt-2 flex items-center gap-x-4">
                <div className="w-6 h-6 bg-yellow-400 border-2 border-black"></div>
                <span>Ragu-ragu</span>
              </div>
            </div>
            <button
              onClick={submitHandler}
              className="mt-auto px-4 py-2 bg-blue-700 rounded-lg font-bold text-white"
            >
              Kumpulkan
            </button>
          </section>
        </main>
      )}
    </>
  );
};

export default Home;
