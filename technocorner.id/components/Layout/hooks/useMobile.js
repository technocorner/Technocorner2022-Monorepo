import { useState, useEffect } from "react";

export default function useMobile() {
  const [isMobile, setIsMobile] = useState(false);

  const handleChange = () => {
    window.innerWidth <= 768 ? setIsMobile(true) : setIsMobile(false);
  };

  useEffect(() => {
    window.addEventListener("load", handleChange);
    window.addEventListener("resize", handleChange);
  }, []);

  return isMobile;
}
