let minute1 = 3;
let minute2 = 0;
let second1 = 59;
let second2 = 0;
let millisecond1 = 99;
let millisecond2 = 0;
var countdownAudio = new Audio("audio/countdown.mp3"); //untuk audio countdown
let startable1 = true;
let startable2 = true;
let autoTimer2 = true;
let enablePopup = true;

let runTimer = setInterval(() => {
  if (!startable1) {
    timer1();
  }
  if (!startable2) {
    timer2();
  }
}, 10);

function timer1() {
  if (millisecond1 == 0) {
    //MAX 999ms*
    if (second1 == 0) {
      //MAX 59s*
      if (minute1 == 0) {
        //MAX 4s*
        stop1();
        return;
      } else {
        if (second1 == 0 && minute1 == 3 && millisecond1 == 0) {
          modal.style.display = "none";
        }
        minute1--;
      }
      second1 = 59;
    } else {
      if (second1 <= 3 && minute1 == 3 && autoTimer2) {
        popup();
      }
      second1--;
    }
    millisecond1 = 99;
  } else {
    millisecond1--;
  }

  setTimer(1, minute1, second1, millisecond1);
  if (minute1 == 2 && second1 == 59 && millisecond1 == 99 && autoTimer2) {
    startable2 = false;
  }
}

function timer2() {
  if (millisecond2 == 99) {
    //MAX 999ms*
    millisecond2 = 0;
    if (second2 == 59) {
      //MAX 59s*
      second2 = 0;
      if (minute2 == 3) {
        //MAX 3s*
        stop2();
        return;
      } else {
        minute2++;
      }
    } else {
      second2++;
    }
  } else {
    millisecond2++;
  }

  setTimer(2, minute2, second2, millisecond2);
}

function setTimer(timer, minute, second, millisecond) {
  textMinute = "0" + minute;
  if (second < 10) {
    textSecond = "0" + second;
  } else {
    textSecond = second;
  }
  if (millisecond < 10) {
    textMillisecond = "0" + millisecond;
  } else {
    textMillisecond = millisecond;
  }

  if (timer == 1) {
    document.getElementById("minute1").innerText = textMinute;
    document.getElementById("second1").innerText = textSecond;
    document.getElementById("millisecond1").innerText = textMillisecond;
  } else {
    document.getElementById("minute2").innerText = textMinute;
    document.getElementById("second2").innerText = textSecond;
    document.getElementById("millisecond2").innerText = textMillisecond;
  }
}

function start1() {
  if (startable1 && !(minute1 == 0 && second1 == 0 && millisecond1 == 0)) {
    startable1 = false;
    if (minute1 <= 2) {
      start2();
    }
  }
}

function start2() {
  if (startable2 && !(minute2 == 3 && second2 == 0)) {
    startable2 = false;
    autoTimer2 = false;
  }
}

function stop1() {
  startable1 = true;
  stop2();
}

function stop2() {
  startable2 = true;
}

function reset1() {
  startable1 = true;

  minute1 = 3;
  second1 = 59;
  millisecond1 = 59;

  setTimer(1, 4, 0, 0);
}

function reset2() {
  startable2 = true;
  autoTimer2 = true;

  minute2 = 0;
  second2 = 0;
  millisecond2 = 0;

  setTimer(2, minute2, second2, millisecond2);
}

// POP UP 1-2-3 SAAT COUNTDOWN MENIT KE 3 SEBELUM MULAI COUNTUP
let countupTimer;

function popup() {
  if (enablePopup) {
    enablePopup = false;
    modal.style.display = "block";
    span.onclick = function () {
      modal.style.display = "none";
    };
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };
  }
  if (second1 >= 1 && second1 < 4) {
    document.getElementById("tigadetik").innerHTML = second1;
  }
}

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function () {
  modal.style.display = "block";
  popup();
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
