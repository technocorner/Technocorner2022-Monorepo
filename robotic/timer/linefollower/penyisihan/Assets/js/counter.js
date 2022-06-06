// Counter Ke-1
let count=+document.getElementById('count3').innerHTML;
const minus3=document.getElementById('minus3');
const plus3=document.getElementById('plus3');
const reset3=document.getElementById('reset3');
plus3.addEventListener('click', ()=>{
    count++
    document.getElementById('count3').innerHTML=count;
});

minus3.addEventListener('click', ()=>{
    count--
    document.getElementById('count3').innerHTML=count;
});

reset3.addEventListener('click', ()=>{
    count = 0
    document.getElementById('count3').innerHTML=count;
});



// Counter ke-2
let count2=+document.getElementById('count4').innerHTML;
const minus4=document.getElementById('minus4');
const plus4=document.getElementById('plus4');
const reset4=document.getElementById('reset4');
plus4.addEventListener('click', ()=>{
    count2++;
    document.getElementById('count4').innerHTML=count2;
});

minus4.addEventListener('click', ()=>{
    count2--;
    document.getElementById('count4').innerHTML=count2;
});

reset4.addEventListener('click', ()=>{
    count2 = 0;
    document.getElementById('count4').innerHTML=count2;
});