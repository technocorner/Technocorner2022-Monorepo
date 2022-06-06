import { useState } from "react";
import {
  MdPerson,
  MdEmail,
  MdVpnKey,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";

interface InputProps {
  name: string;
  placeholder: string;
}

export default function Input({ name, placeholder }: InputProps) {
  const [pwdVisible, setPwdVisible] = useState(false);

  let type;
  switch (name) {
    case "email":
      type = "email";
      break;
    case "sandi":
      type = "password";
      break;
    default:
      type = "text";
  }

  return (
    <div className="w-full my-1 sm:my-2 py-0.5 sm:py-1 px-3 flex items-center gap-3 border-2 border-white-light/30 focus-within:border-sky-500 rounded-2xl">
      {name === "email" && <MdEmail size="1.25rem" className="flex-none" />}
      {name === "sandi" && <MdVpnKey size="1.25rem" className="flex-none" />}
      {name === "kode" && <MdVpnKey size="1.25rem" className="flex-none" />}
      {name === "nama" && <MdPerson size="1.25rem" className="flex-none" />}
      <input
        className="w-full flex-1 leading-8 sm:leading-[2.75rem] bg-transparent outline-none autofill:caret-white-light"
        name={name}
        type={name === "sandi" ? (pwdVisible ? "text" : "password") : type}
        placeholder={placeholder}
        autoComplete="off"
        required
      />
      {name === "sandi" && (
        <button
          type="button"
          onClick={() => setPwdVisible((prevState) => !prevState)}
        >
          {pwdVisible ? (
            <MdVisibilityOff size="1.25rem" className="flex-none" />
          ) : (
            <MdVisibility size="1.25rem" className="flex-none" />
          )}
        </button>
      )}
    </div>
  );
}
