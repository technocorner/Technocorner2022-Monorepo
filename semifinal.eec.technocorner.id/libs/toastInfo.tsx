import toast from "react-hot-toast";

export function toastInfo(text: string) {
  return toast(
    (t) => (
      <div className="flex flex-col">
        <div>{text}</div>
        <button
          className="mt-2 border-2 rounded-lg px-4 py-1 hover:bg-blue-light hover:text-white-light hover:border-blue-light"
          onClick={() => toast.dismiss(t.id)}
        >
          Tutup
        </button>
      </div>
    ),
    {
      id: "toastInfo",
      duration: Infinity,
      style: {
        border: "0.125rem solid #07A6D1",
      },
    }
  );
}
