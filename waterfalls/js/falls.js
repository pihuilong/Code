var falls = {
    //每列当前的高度
    topArry: [],
    //每列当前距离浏览器的左边距
    leftArry: [],
    //每次加载的图片
    imgArray: [],
    //每次加载的第一张图片相对于所有图片（包括已加载图片）的索引
    num: 0,
    //加载图片数
    dataNum: 0,
    //图片列数
    cols: 0,
}

//初始化函数
$(function () {
    start();
    // $(window).resize(function(){
    //     $("#container").html("");
    //     start();
    // });
});

function start(){
    init();
    run();
    window.onscroll = function () {
        var minHeight = getMinHeight();
        if (checkWillLoad()) {
            run();
        }
    }
}

//使用JSON数据模拟从后台获取图片数据
function getData() {
    return $.getJSON("json/falls.json", function (data) {    //此处返回一个jquery的promise对象
        if (data.success) {
            var row = data.row,
                html = "",
                len = row.length;
            falls.dataNum += len;

            //将获取到的数据通过字符串连接的方式添加到 html 内容中
            for (var i = 0; i < len; i++) {
                html += "<div class='img-box'><img src='" + row[i].src + "'/></div>";
            }
            $("#container").append(html);
        }
    });
}

//初始化函数（主要初始化：列数，每列左偏移，每列高度置为0）
function init() {
    getData().then(function () {
        var $boxs = $("#container .img-box");
        falls.cols = Math.floor($("#container").width() / $boxs.eq(0).width());
        for (var i = 0; i < falls.cols; i++) {
            var left = $boxs.eq(i).offset().left;
            falls.leftArry.push(left);
            falls.topArry[i] = 0;
        }
    });
}

//主要运行函数
function run() {
    getData().then(function () {
        //修改每张图片的位置
        reset();
    });
}

//获取所有列中的最小高度列
function getMinHeight() {
    var minHeight = Math.min.apply(null, falls.topArry);
    return minHeight;
}

//reset用于对图片进行重新定位
function reset() {
    var $boxs = $("#container .img-box");
    falls.imgArray = [];
    $boxs.each(function (i) {
        if (i >= falls.num) {      //这里我们只需要拿到新的没有定位过的图片，不用重新定位所有的，提升性能
            falls.imgArray.push(this);
        }
    });
    falls.num += falls.dataNum;
    var img = falls.imgArray;
    for (var i = 0, len = img.length; i < len; i++) {
        var minHeight = getMinHeight(),
            index = 0;
        //为了取到高度最小列的角标
        for (var x = 0; x < falls.cols; x++) {
            if (minHeight == falls.topArry[x]) {
                index = x;
                break;
            }
        }
        //重新定位
        $(img[i]).css({
            "position": "absolute",
            "top": minHeight,
            "left": falls.leftArry[index]
        });
        //更新最短列
        falls.topArry[index] += $(img[i]).height();
    }
    falls.dataNum = 0;
    //可确保不同的显示器屏幕能初始化时便将图片布满屏幕
    if (getMinHeight() < window.screen.height) {
        setTimeout(function () {      //确保浏览器已经重排完毕，否则会出现一些图片叠加在一起
            run();
        }, 1)
    }
}

//判断是否加载图片的条件：最后一张图片顶部相对于页面的位置>=文档高度+滚动条的垂直位置
function checkWillLoad(){
    var lastBox = $("#container .img-box").last();
    var topOffset = $(lastBox).offset().top;
    var screenHeight = $(window).height();
    var scrollTop = $(window).scrollTop();
    return topOffset <= screenHeight + scrollTop;
}