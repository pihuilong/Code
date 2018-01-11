$(function(){
    var lottery = {
        pLevel : ["一等奖","二等奖","三等奖","鼓励奖"],
        pName : ["iPhoneX","iPad Mini","20元话费","苹果一只"],
        p:0
    }
    initLottery(lottery);
    $(".btn").bind("click",function(){
        clickBtn(lottery);
    });

    $(".lottery")[0].addEventListener("transitionend",function(){
        $(".btn").bind("click",function(){
            clickBtn(lottery);  
        }).css("cursor","pointer");
        result(lottery);
        $(this).css({
            "transition" : "none",
            // "transform" : "none",
            // "-webkit-transform" : "none"
        });
    });
});

function initLottery(lot){
    var blocksLen = 8;
    var blockstr = "";
    var $blocks=null;
    for(var j=0;j<blocksLen;j++){
        blockstr += '<div class="block"></div>';
    }
    $(".lottery").append(blockstr);
    $blocks = $(".block");
    for(var i=0,deg=0;i<blocksLen;i++,deg+=360/blocksLen){
        $($blocks[i]).css("transform","rotate("+deg+"deg) "+"skewY("+360/blocksLen+"deg)");
    }
    for(var k=0,imgOrder=0;k<blocksLen;k++){
        var constr = "";
        if(k%2){
            constr+="<div class='content'><div class='none'>再接再厉</div></div>";
            $($blocks[k]).append(constr);
        }else{
            constr='<div class="content"><div class="text"><p>'+lot.pLevel[imgOrder]+
                            '</p><p>'+lot.pName[imgOrder]+'</p></div>'+
                            '<div class="img"><img src="img/'+(imgOrder+1)+'.jpg"/></div></div>'
            $($blocks[k]).append(constr);
            imgOrder++;
        }
    }
}

function clickBtn(lot){
    // var n = Math.floor(Math.random()*8+1);
    var n = getRandomNum();
    lot.p=45*n+1822.5;
    $('.lottery').css({
        "transform":"rotate("+0+"deg)",
        "-webkit-transform":"rotate("+0+"deg)"
    });
    $(".btn").unbind("click").css("cursor","wait");
    setTimeout(() => {
        $('.lottery').css({
            "transition":"all 10s ease-in-out",
            "transform":"rotate("+lot.p+"deg)",
            "-webkit-transform":"rotate("+lot.p+"deg)"
        });
    }, 1);
    
}

function result(lot){
    var num = (lot.p-1822.5)/45;
    if(num%2){
        alert("很遗憾，请再接再厉喔！");
    }else{
        var temp = lot.pLevel.length-num/2
        alert("恭喜你，拿下"+lot.pLevel[temp]+" : "+lot.pName[temp]+"!");
    }
}

function getRandomNum(){
    var number;
    var n = Math.floor(Math.random()*100);
    if(n>=0&&n<20){
        number=1;
    }else if(n>=20&&n<40){
        number=3;
    }else if(n>=40&&n<60){
        number=5;
    }else if(n>=60&&n<80){
        number=7;
    }else if(n>=80&&n<90){
        number=2;
    }else if(n>=90&&n<95){
        number=4;
    }else if(n>=95&&n<98){
        number=6;
    }else{
        number=8;
    }
    return number;
}