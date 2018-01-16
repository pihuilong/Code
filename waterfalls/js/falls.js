var falls = {
    //每列当前的高度
  topArry:[0,0,0,0,0],
  //每列当前距离浏览器的左边距
  leftArry:[],
  //每次加载的图片
  imgArray:[],
  //每次加载的第一张图片相对于所有图片（包括已加载图片）的索引
  num:0,
  //加载图片数，默认 9 张，根据实际修改
  dataNum:9,
}

//初始化函数
$(function(){
  getData();
//   getMinHeight();
  window.onscroll = function(){
      var minHeight = getMinHeight();
      //当屏幕滚动的距离大于最短高度的二分之一（可任意设置，看个人喜好），再次加载图片
        if(window.scrollY>minHeight/2){
            getData();
        }
  }
});

function getData(){
    $.getJSON("json/falls.json",function(data){
        if(data.success){
            var row = data.row,
                  len = row.length,
                  html = "";
            
            //将获取到的数据通过字符串连接的方式添加到 html 内容中
            for(var i=0;i<len;i++){
                html+="<div class='img-box'><img src='"+row[i].src+"'/></div>";
            }
            $("#container").append(html);
           

            //修改每张图片的位置
            reset();
        }
    })
}

function getMinHeight(){
    var minHeight = Math.min.apply(null,falls.topArry);
    return minHeight;
}

function getLeft(){
    for(var i=0;i<5;i++){
        var left = $("#container .img-box").eq(i).offset().left;
        falls.leftArry.push(left);
    }
}

function reset(){
    getLeft();
    //可确保不同的显示器屏幕能初始化时便将图片布满屏幕
   if(getMinHeight()<window.screen.height){
       getData();
   }
   falls.imgArray = [];
   $("#container .img-box").each(function(i){
       if(i >= falls.num){
           falls.imgArray.push(this);
       }
   });
   falls.num += falls.dataNum;

    var img = falls.imgArray;
    for(var i=0,len=img.length;i<len;i++){
        var minHeight = getMinHeight(),
            index = 0;
        
        for(var x=0;x<falls.dataNum;x++){
            if(minHeight == falls.topArry[x]){
                index = x;
                break;
            }
        }

        $(img[i]).css({
            "position" : "absolute",
            "top" : minHeight,
            "left" : falls.leftArry[index]
        });

        falls.topArry[index] += $(img[i]).height();
    }
}