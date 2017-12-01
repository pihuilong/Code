$(function(){
    var appertime,disappertime;
    var game=new Dadishu();
    $("#start").click(function(){
        var level = $("#level").val();
        game.setLevel(level);
    });
    $("#end").click(function(){
        game.GameOver();
    });
    $("td").map(function(){
        $(this).click(function(){
            var elem=this;
            game.hit(elem);
        });
    });
    $("#notice > button").click(function(){
        $("#notice").attr("class","noticehide");
    });
});

~(function(){
    window.Dadishu=dadishu;
    function dadishu(){
        this.playing=false;
        this.intId=null;
        this.timeId=null;
        this.score=0;
        this.beat=0;
        this.knock=0;
        this.success=0;
        this.countdown=30;
        this.appertime=500;
        this.disappertime=1000;
    }
    
    dadishu.prototype.GameStart=function(appertime,disappertime){
        if(this.playing){
            return;
        }else{
            if($("#notice").attr("class")!="noticeshow"){
                var that=this;
                that.playing=true;
                that.intId=setInterval(function(){
                    that.show.call(that);
                },this.appertime);
                document.form1.success.value=this.success;
                document.form1.score.value=this.score;
                that.timeShow();
            }else{
                return;
            }
        }
    }
    
    dadishu.prototype.show=function(){
        if(this.playing){
            var current=Math.floor(Math.random()*25);
            $($("td")[current]).html("<img src='img/mouse.png'>");
            setTimeout(function(){				
                $($("td")[current]).html("");
            },this.disappertime);
        }
    }
    
    dadishu.prototype.timeShow=function(){
        if(this.playing){
            document.form1.remtime.value=this.countdown;
            if(this.countdown==0){
                this.GameOver();
                return;
            }else{
                this.countdown-=1;
                var that=this;
                this.timeId=setTimeout(function(){
                    that.timeShow();
                },1000);
            }
        }
    }
    
    dadishu.prototype.GameOver=function(){
        if(!this.playing){
            return;rtime,this.disappertime
        }else{
            this.timeStop();
            this.playing=false;
            $("#notice > .title").text("Game Over!");
            $("#notice > .message").html("Your score: <span style='color:red'>"+this.score+"</span></br>   Your hit rate:<span style='color:red'>"+this.success+"</span>");
            $("#notice").attr("class","noticeshow");
            this.clearMouse();
            this.success=0;
            this.score=0;
            this.knock=0;
            this.beat=0;
            this.countdown=30;
        }
    }
    
    dadishu.prototype.timeStop=function(){
        clearInterval(this.intId);
        clearTimeout(this.timeId);
    }
    
    dadishu.prototype.clearMouse=function(){
        for(var i=0;i<25;i++){
            $($("td")[i]).html("");
        }
    }
    
    dadishu.prototype.hit=function(elem){
        if(!this.playing){
            if($("#notice").attr("class")!="noticeshow"){
                $("#notice > .title").text("Notice:");
                $("#notice > .message").text("Please start the game!");
                $("#notice").attr("class","noticeshow");
            }else{
                return;
            }
        }else{
            this.beat+=1;
            if($(elem).html()==""){
                this.score-=1;
                this.success=( Math.round(parseFloat(this.knock/this.beat)*10000)/100 )+"%";
                document.form1.score.value=this.score;
                document.form1.success.value=this.success;
            }else{
                this.knock+=1;
                this.score+=1;
                this.success=( Math.round(parseFloat(this.knock/this.beat)*10000)/100 )+"%";
                document.form1.score.value=this.score	;
                document.form1.success.value=this.success;
                $(elem).html("");
                $(elem).css("background-color","red");
                setTimeout(() => {
                    $(elem).css("background-color","#00ff33");
                }, 200);
            }
        }
    }

    dadishu.prototype.setLevel=function(level){
        if(level==1){
            this.appertime=1000;
            this.disappertime=2000;
        }else if(level==2){
            this.appertime=500;
            this.disappertime=1500;
        }else if(level==3){
            this.appertime=400;
            this.disappertime=1000;
        }else{
            this.appertime=200;
            this.disappertime=600;
        }
        this.GameStart();
    }
})()