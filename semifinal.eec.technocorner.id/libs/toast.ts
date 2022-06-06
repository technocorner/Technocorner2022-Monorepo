import toast from "react-hot-toast";

export function toastLoading() {
  return toast.loading("Sedang memproses...", {
    style: {
      border: "0.125rem solid #0F1F1C",
      overflowWrap: "break-word",
    },
  });
}

export function toastSendMail(nama: string, email: string) {
  return toast.loading(`Sedang mengirimkan email ke ${nama} (${email})...`, {
    style: {
      border: "0.125rem solid #0F1F1C",
      overflowWrap: "break-word",
    },
  });
}

export function toastLoadingProgress(percentage: number) {
  return toast.loading(`Sedang memproses (${percentage}%)...`, {
    id: "toastLoadingProgress",
    style: {
      border: "0.125rem solid #0F1F1C",
      overflowWrap: "break-word",
    },
  });
}

export function toastError(text: string) {
  toast.error(text, {
    style: {
      border: "0.125rem solid #EF476F",
      overflowWrap: "break-word",
    },
  });
}

export function toastSuccess(text: string) {
  toast.success(text, {
    style: {
      border: "0.125rem solid #04BFAD",
      overflowWrap: "break-word",
    },
  });
}
