import { eec, iot, lf, tp } from "../data/events";

export function isRegistOpen(cabang: string) {
  let isOpen = false;
  switch (cabang) {
    case "iot":
      isOpen = Date.now() >= iot.registration[0].date[0].getTime();
      break;
    case "eec":
      isOpen = Date.now() >= eec.registration[0].date[0].getTime();
      break;
    case "lf":
      isOpen = Date.now() >= lf.registration[0].date[0].getTime();
      break;
    case "tp":
      isOpen = Date.now() >= tp.registration[0].date[0].getTime();
      break;
  }
  return isOpen;
}

export function isRegistClose(cabang: string) {
  let isClose = false;
  switch (cabang) {
    case "iot":
      isClose = Date.now() >= iot.registration[0].date[1].getTime() - 1;
      break;
    case "eec":
      isClose = Date.now() >= eec.registration[0].date[1].getTime() - 1;
      break;
    case "lf":
      isClose = Date.now() >= lf.registration[0].date[1].getTime() - 1;
      break;
    case "tp":
      isClose = Date.now() >= tp.registration[0].date[1].getTime() - 1;
      break;
  }
  return isClose;
}
