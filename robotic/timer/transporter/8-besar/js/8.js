// Timer
var start = document.getElementById('start');
var reset = document.getElementById('reset');
var stop = document.getElementById('stop');

var m = document.getElementById('min');
var s = document.getElementById('sec');
var mil = document.getElementById('mili');

//Sound
    //StartSound
var startSound;
startSound = new Audio('sound/audioStart1.mp3');

    //PointSound
var pointSound;
pointSound = new Audio('sound/Mario Coin Sound.mp3');

    //PenaltySound
var penaltySound;
penaltySound = new Audio('sound/marioHit.mp3');

//store a reference to the variable
var startTimer;

function timer(){
    if(m.innerText == 0 && s.innerText == 0 && mil.innerText == 0){
        m.innerText = 0;
        s.innerText = 0;
        mil.innerText = 0;
    }else if(mil.innerText != 0){
        mil.innerText--;
    }else if(s.innerText != 0 && mil.innerText == 0){
        mil.innerText = 99;
        s.innerText--;
    }else if(m.innerText != 0 && s.innerText == 0 && mil.innerText == 0){
        mil.innerText = 99;
        s.innerText = 59;
        m.innerText--;
    }
    return;
}

function stopTimer(){
    clearInterval(startTimer);
    
}

start.addEventListener('click', function(){
    if(startTimer === undefined){
        if(m.innerText > 2){
            startSound.play()
        }
        startTimer = setInterval(timer, 10)
    }else {
        startSound.pause()
        alert("Timer is already running");
        startSound.play()
    }
})

// start.addEventListener('click', function(){
//     //initialize the variable startTimer
//     function startInterval(){
//         startTimer = setInterval(function(){
//             timer();
//         }, 10);
//     }
//     startInterval()
// })

reset.addEventListener('click', function(){
    m.innerText = "4";
    s.innerText = "00";
    mil.innerText = "00";
    stopTimer()
    startTimer = undefined;
    startSound.pause() 
    startSound.currentTime = 0;
})

stop.addEventListener('click', function(){
    stopTimer()
    startTimer = undefined;
    startSound.pause()  
})


// Counter
        //total point
var total = document.getElementById('total');
var valueTotal = total.innerHTML;

function totalPoint(){
    valueTotal = valuePoint-valuePenalty;
    total = valueTotal;
    document.getElementById('total').innerText = valueTotal;
}

    // point
var point = document.getElementById('point');
var valuePoint = point.innerHTML;
var resetPoint = document.getElementById('reset-point');

resetPoint.addEventListener('click', () =>{
    valuePoint=0;
    point = valuePoint;
    document.getElementById('point').innerText = valuePoint;
    totalPoint()
})

    //blue
var plusBlue = document.getElementById('plus-blue');
var minusBlue = document.getElementById('minus-blue');

plusBlue.addEventListener('click', () => {
	valuePoint++;
    valuePoint++;
    valuePoint++;
    console.log(valuePoint);
    point = valuePoint;
	document.getElementById('point').innerText = valuePoint;
    totalPoint()
    pointSound.play()
});
minusBlue.addEventListener('click', () => {
	if (point > 0) {
		valuePoint--;
        valuePoint--;
        valuePoint--;
	}
    console.log(valuePoint);
	point = valuePoint;
    document.getElementById('point').innerText = valuePoint;
    totalPoint()
});


    //pink
var plusPink = document.getElementById('plus-pink');
var minusPink = document.getElementById('minus-pink');

plusPink.addEventListener('click', () => {
	valuePoint++;
    console.log(valuePoint);
    point = valuePoint;
	document.getElementById('point').innerText = valuePoint;
    totalPoint()
    pointSound.play()
});
minusPink.addEventListener('click', () => {
	if (point > 0) {
		valuePoint--;
	}
    console.log(valuePoint);
	point = valuePoint;
    document.getElementById('point').innerText = valuePoint;
    totalPoint()
});
    //orange
var plusOrange = document.getElementById('plus-orange');
var minusOrange = document.getElementById('minus-orange');

plusOrange.addEventListener('click', () => {
	valuePoint++;
    valuePoint++;
    console.log(valuePoint);
    point = valuePoint;
	document.getElementById('point').innerText = valuePoint;
    totalPoint()
    pointSound.play()
});
minusOrange.addEventListener('click', () => {
	if (point > 0) {
		valuePoint--;
        valuePoint--;
	}
    console.log(valuePoint);
	point = valuePoint;
    document.getElementById('point').innerText = valuePoint;
    totalPoint()
});

    //yellow
var plusYellow = document.getElementById('plus-yellow');
var minusYellow = document.getElementById('minus-yellow');
    
plusYellow.addEventListener('click', () => {
    valuePoint++;
    valuePoint++;
    console.log(valuePoint);
    point = valuePoint;
    document.getElementById('point').innerText = valuePoint;
    totalPoint()
    pointSound.play()
});
minusYellow.addEventListener('click', () => {
    if (point > 0) {
        valuePoint--;
        valuePoint--;
    }
    console.log(valuePoint);
    point = valuePoint;
    document.getElementById('point').innerText = valuePoint;
    totalPoint()
});

//penalty
var penalty = document.getElementById('penalty');
var valuePenalty = penalty.innerHTML;
var resetPenalty = document.getElementById('reset-penalty');

resetPenalty.addEventListener('click', () =>{
    valuePenalty=0;
    penalty = valuePenalty;
    document.getElementById('penalty').innerText = valuePenalty;
    totalPoint()
})

    
    
    //penalty 2
var plusPenalty2 = document.getElementById('plus-penalty2');
var minusPenalty2 = document.getElementById('minus-penalty2');

plusPenalty2.addEventListener('click', () => {
    valuePenalty++;
    valuePenalty++;
    console.log(valuePenalty);
    penalty = valuePenalty;
    document.getElementById('penalty').innerText = valuePenalty;
    totalPoint()
    penaltySound.play()
});

minusPenalty2.addEventListener('click', () => {
    if (penalty > 0) {
        valuePenalty--;
        valuePenalty--;
    }
    console.log(valuePenalty);
    penalty = valuePenalty;
    document.getElementById('penalty').innerText = valuePenalty;
    totalPoint()
});
    //penalty 3
var plusPenalty3 = document.getElementById('plus-penalty3');
var minusPenalty3 = document.getElementById('minus-penalty3');

plusPenalty3.addEventListener('click', () => {
    valuePenalty++;
    valuePenalty++;
    valuePenalty++;
    console.log(valuePenalty);
    penalty = valuePenalty;
    document.getElementById('penalty').innerText = valuePenalty;
    totalPoint()
    penaltySound.play()
});

minusPenalty3.addEventListener('click', () => {
    if (penalty > 0) {
        valuePenalty--;
        valuePenalty--;
        valuePenalty--;
    }
    console.log(valuePenalty);
    penalty = valuePenalty;
    document.getElementById('penalty').innerText = valuePenalty;
    totalPoint()
});
    
    //penalty 4
var plusPenalty4 = document.getElementById('plus-penalty4');
var minusPenalty4 = document.getElementById('minus-penalty4');

plusPenalty4.addEventListener('click', () => {
    valuePenalty++;
    valuePenalty++;
    valuePenalty++;
    valuePenalty++;
    console.log(valuePenalty);
    penalty = valuePenalty;
    document.getElementById('penalty').innerText = valuePenalty;
    totalPoint()
    penaltySound.play()
});

minusPenalty4.addEventListener('click', () => {
    if (penalty > 0) {
        valuePenalty--;
        valuePenalty--;
        valuePenalty--;
        valuePenalty--;
    }
    console.log(valuePenalty);
    penalty = valuePenalty;
    document.getElementById('penalty').innerText = valuePenalty;
    totalPoint()
});