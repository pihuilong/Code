function waterFall(){
    var allBox = $("#container .img-box");
    var boxWidth = $(allBox).eq(0).outerWidth();
    var screenWidth = $(window).width();
    var cols = Math.floor((screenWidth-200)/boxWidth);

    $("#container").css({
        "width" : cols*boxWidth + "px",
        "margin" : "0 auto",
    });

    var leftArr = [];
    var heightArr = [];
    $.each(allBox,function(index,value){
        var boxHeight = $(value).outerHeight();
        var left;
        if(index<cols){
            heightArr[index] = boxHeight;
            left = allBox.eq(index).offset().left;
            leftArr.push(left);
        }else{
            var minBoxHeight = Math.min.apply(null,heightArr);
            var minBoxIndex = $.inArray(minBoxHeight,heightArr);
            $(value).css({
                "position" : "absolute",
                "top" : minBoxHeight + "px",
                "left" : leftArr[minBoxIndex] + "px",
            });
            heightArr[minBoxIndex] += boxHeight;
        }
    })
}

function checkWillLoad(){
    var lastBox = $("#container .img-box").last();
    var topOffset = $(lastBox).offset().top;
    var screenHeight = $(window).height();
    var scrollTop = $(window).scrollTop();
    return topOffset <= screenHeight + scrollTop;
}

function getData(){
    var data =  [{
        "src" : "img/0.jpg"
    },{
        "src" : "img/1.jpg"
    },{
        "src" : "img/2.jpeg"
    },{
        "src" : "img/3.jpg"
    },{
        "src" : "img/4.jpg"
    },{
        "src" : "img/5.jpg"
    },{
        "src" : "img/6.jpg"
    },{
        "src" : "img/7.jpeg"
    },{
        "src" : "img/8.jpg"
    }]
    var  len = data.length;
    var html = "";
    for(var i=0;i<len;i++){
        html+="<div class='img-box'><img src='"+data[i].src+"'/></div>";
    }
    $("#container").append(html);

    waterFall();
}


$(function(){
    getData();
});