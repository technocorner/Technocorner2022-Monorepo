import toast from "react-hot-toast";
import HtmlHead from "../components/HtmlHead";
import { toastLoading } from "../lib/toast";

const SignIn = ({ signIn }: { signIn: Function }) => {
  async function submitHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const loadingToast = toastLoading();

    const target = event.target as typeof event.target & {
      teamId: { value: string };
      userEmail: { value: string };
    };

    const teamId = target.teamId.value;
    const userEmail = target.userEmail.value;

    await signIn({ teamId, userEmail });

    toast.dismiss(loadingToast);
  }

  return (
    <>
      <HtmlHead title="Masuk" />
      <div className="min-w-screen min-h-screen flex items-center justify-center bg-zinc-200">
        <form
          onSubmit={submitHandler}
          className="w-11/12 sm:w-[30rem] p-4 sm:p-8 flex flex-col items-center transform-gpu bg-zinc-50 rounded-3xl border border-black"
        >
          <h1 className="font-bold text-xl">MASUK</h1>
          <div className="mt-2 sm:mt-6 w-full flex flex-col">
            <div>
              <p className="font-bold">
                ID Tim{" "}
                <span className="font-normal text-black/50">
                  (Dapat dilihat pada laman dasbor tim)
                </span>
              </p>
              <input
                name="teamId"
                type="text"
                placeholder="Masukkan ID tim"
                required
                className="w-full py-0.5 sm:py-2.5 px-3 border-2 focus-within:border-sky-500 rounded-xl bg-transparent outline-none"
              />
            </div>
            <div className="mt-4">
              <p className="font-bold">Email</p>
              <input
                name="userEmail"
                type="text"
                placeholder="Masukkan email anggota tim"
                required
                className="w-full py-0.5 sm:py-2.5 px-3 border-2 focus-within:border-sky-500 rounded-xl bg-transparent outline-none"
              />
            </div>
            <button
              className="w-full mt-6 py-1.5 rounded-full bg-[#04BFAD] sm:leading-7 font-bold text-white"
              type="submit"
            >
              Masuk
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default SignIn;
