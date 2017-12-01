var td=new Array(),    //保存每个格子的地鼠
      playing=false,
      score=0,      
      beat=0,       //鼠标点击次数
      success=0,    //命中率
      knock=0,     //鼠标点中老鼠图片次数
      countDown=30,   //倒计时
      interId  =null,       //指定setInterval()的变量     
      timeId=null;          //指定setTimeout()的变量
      
function GameOver(){
    timeStop();
    playing=false;
    clearMouse();
    alert("Game Over! \n Your score:"+score+"\n Your hit rate:"+success);
    success=0;
    score=0;
    knock=0;
    beat=0;
    countDown=30;
}
function timeShow(){
    document.form1.remtime.value=countDown;
    if(countDown==0){
        GameOver();
        return;
    }else{
        countDown=countDown-1;
        timeId=setTimeout("timeShow()",1000);
    }
}
function timeStop(){
    clearInterval(interId);
    clearTimeout(timeId);
}

function show(){
    if(playing){
        var current=Math.floor(Math.random()*25);
        document.getElementById("td"+current).innerHTML='<img src="img/mouse.png">';
        setTimeout("document.getElementById('td"+current+"').innerHTML=''",1000);
    }
}
function clearMouse(){
    for(var i=0;i<=24;i++){
        document.getElementById("td"+i).innerHTML="";
    }
}

function hit(id){
    if(playing==false){
        alert("Please start the game!");
        return;
    }else{
        beat+=1;
        if(document.getElementById("td"+id).innerHTML!=""){
            score+=1;
            knock+=1;
            success=knock/beat;
            document.form1.success.value=success;
            document.form1.score.value=score;
            document.getElementById("td"+id).innerHTML="";
        }else{
            score+=-1;
            success=knock/beat;
            document.form1.success.value=success;
            document.form1.score.value=score;
        }
    }
}

function GameStart(){
    if(playing==true){
        return;
    }else{
        playing=true;
        interId=setInterval("show()",400);
        document.form1.success.value=success;
        document.form1.score.value=score;
        timeShow();
    }
    
}