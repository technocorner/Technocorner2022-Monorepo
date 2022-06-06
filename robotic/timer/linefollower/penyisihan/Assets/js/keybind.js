const cpMinus = document.getElementById("minus3");
const cpPlus = document.getElementById("plus3");
const retryMinus = document.getElementById("minus4");
const retryPlus = document.getElementById("plus4");
const timerStart = document.getElementById("start");
const timerStop = document.getElementById("stop");

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "q":
      cpMinus.click();
      break;
    case "w":
      cpPlus.click();
      break;
    case "o":
      retryMinus.click();
      break;
    case "p":
      retryPlus.click();
      break;
    case " ":
      if (startable1) {
        timerStart.click();
      } else {
        timerStop.click();
      }
      break;
  }
});
