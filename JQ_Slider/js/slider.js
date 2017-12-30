$(function(){
    var slide = new SliderPlay();
    slide.run();
});

~(function(){
    window.SliderPlay=Slider;
    function Slider(){
        this.imgSlider = $(".imageSlider");
        this.imageBox=this.imgSlider.children(".imageBox");
        this.titleBox    =this.imgSlider.children(".titleBox");
        this.titleArr     =this.titleBox.children("p");
        this.icoBox     =this.imgSlider.children(".icoBox");
        this.icoArr       =this.icoBox.children("span");
        this.imageWidth=this.imgSlider.width();
        this.imageNum=this.imageBox.children("a").length;
        this.imageReelWidth=this.imageWidth*(this.imageNum+1);
        this.activeID=parseInt(this.icoBox.children(".active").attr("rel"));
        this.nextID=0;
        this.setIntervalID;
        this.intervalTime=4000;
        this.imageSpeed=500;
        this.titleSpeed=250;
        this.imgArr=this.imageBox.children("a");
    
    }
    
    Slider.prototype.init = function(){
        this.imageBox.css({ 'width' : this.imageReelWidth + "px" });
        this.imageBox.append($(this.imgArr[0]).clone());
        for(var i=0;i<this.imageNum;i++){
            var currentNum=i+1
            this.titleBox.append("<p>image "+currentNum+"</p>");
            this.icoBox.append("<span rel='"+currentNum+"'>"+currentNum+"</span>");
        }
        this.titleArr     =this.titleBox.children("p");
        this.icoArr       =this.icoBox.children("span");
        $(this.titleArr[0]).addClass("active");
        $(this.icoArr[0]).addClass("active");
        this.activeID=parseInt(this.icoBox.children(".active").attr("rel"));
    }

    Slider.prototype.rotate = function(clickID){
        var that=this;
        var clickFlag=false;
        if(clickID){
            that.nextID=clickID;
            clickFlag=true;
        }else{
            that.nextID=that.activeID <= that.imageNum-1 ? that.activeID+1 : 1;
        }
    
        if(that.nextID==that.activeID){
            return;
        }
        $(that.icoArr[that.activeID-1]).removeClass("active");
        $(that.icoArr[that.nextID-1]).addClass("active");
        $(that.titleArr[that.activeID-1]).animate(
            {bottom:"-40px"},
            that.titleSpeed,
            function(){
                $(that.titleArr[that.nextID-1]).animate({bottom:"0px"},that.titleSpeed);
            }
        );
        $(that.imgArr[that.activeID-1].firstChild).animate({opacity:"0.8"},that.imageSpeed);
        $(that.imgArr[that.nextID-1].firstChild).animate({opacity:"1"},that.imageSpeed);
        if(that.activeID==that.imageNum && !clickFlag){
            that.imageBox.animate({left:"-"+(that.activeID)*that.imageWidth+"px"},that.imageSpeed);
            setTimeout(() => {
                that.imageBox.css("left","0");
            }, that.imageSpeed*3);
        }else{
            that.imageBox.animate({left:"-"+(that.nextID-1)*that.imageWidth+"px"},that.imageSpeed);
        }
    
        that.activeID=that.nextID;
    }
    
    Slider.prototype.run=function(){
        var that=this;
        that.init();
        that.setIntervalID=setInterval(function(){
            that.rotate();
        },that.intervalTime);
        that.imageBox.hover(function(){
            clearInterval(that.setIntervalID);
        },function(){
            that.setIntervalID=setInterval(function(){
                that.rotate();
            },that.intervalTime);
        });
        
        that.icoArr.on("click",function(){
            clearInterval(that.setIntervalID);
            var clickID=parseInt($(this).attr("rel"));
            that.rotate(clickID);
        
            that.setIntervalID=setInterval(function(){
                that.rotate();
            },that.intervalTime);
        });
    }
})()


