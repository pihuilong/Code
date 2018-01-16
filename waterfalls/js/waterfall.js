//初始化函数
$(function () {
    var waterfall = new falls();
    waterfall.start();
    // $(window).resize(function(){
    //     $("#container").html("");
    //     start();
    // });
});

var falls = function(){
    //每列当前的高度
    this.topArry = [];
    //每列当前距离浏览器的左边距
    this.leftArry = [];
    //每次加载的图片
    this.imgArray = [];
    //每次加载的第一张图片相对于所有图片（包括已加载图片）的索引
    this.num = 0;
    //加载图片数
    this.dataNum = 0;
    //图片列数
    this.cols = 0;
}

falls.prototype.start = function(){
    this.init();
    this.run();
    // window.onscroll = function () {
    //     var minHeight = getMinHeight();
    //     if (checkWillLoad()) {
    //         run();
    //     }
    // }
}

//使用JSON数据模拟从后台获取图片数据
falls.prototype.getData = function() {
    return $.getJSON("json/falls.json", function (data) {    //此处返回一个jquery的promise对象
        if (data.success) {
            var row = data.row,
                html = "",
                len = row.length;
            this.dataNum += len;

            //将获取到的数据通过字符串连接的方式添加到 html 内容中
            for (var i = 0; i < len; i++) {
                html += "<div class='img-box'><img src='" + row[i].src + "'/></div>";
            }
            $("#container").append(html);
        }
    });
}

//初始化函数（主要初始化：列数，每列左偏移，每列高度置为0）
falls.prototype.init = function() {
    this.getData().then(function () {
        var $boxs = $("#container .img-box");
        this.cols = Math.floor($("#container").width() / $boxs.eq(0).width());
        for (var i = 0; i < this.cols; i++) {
            var left = $boxs.eq(i).offset().left;
            this.leftArry.push(left);
            this.topArry[i] = 0;
        }
    });
}

//主要运行函数
falls.prototype.run = function() {
    this.getData().then(function () {
        //修改每张图片的位置
        this.reset();
    });
}

//获取所有列中的最小高度列
falls.prototype.getMinHeight = function() {
    var minHeight = Math.min.apply(null, this.topArry);
    return minHeight;
}

//reset用于对图片进行重新定位
falls.prototype.reset = function() {
    var $boxs = $("#container .img-box");
    this.imgArray = [];
    $boxs.each(function (i) {
        if (i >= this.num) {      //这里我们只需要拿到新的没有定位过的图片，不用重新定位所有的，提升性能
            this.imgArray.push(this);
        }
    });
    this.num += this.dataNum;
    var img = this.imgArray;
    for (var i = 0, len = img.length; i < len; i++) {
        var minHeight = getMinHeight(),
            index = 0;
        //为了取到高度最小列的角标
        for (var x = 0; x < this.cols; x++) {
            if (minHeight == this.topArry[x]) {
                index = x;
                break;
            }
        }
        //重新定位
        $(img[i]).css({
            "position": "absolute",
            "top": minHeight,
            "left": this.leftArry[index]
        });
        //更新最短列
        this.topArry[index] += $(img[i]).height();
    }
    this.dataNum = 0;
    //可确保不同的显示器屏幕能初始化时便将图片布满屏幕
    if (getMinHeight() < window.screen.height) {
        setTimeout(function () {      //确保浏览器已经重排完毕，否则会出现一些图片叠加在一起
            run();
        }, 1)
    }
}

//判断是否加载图片的条件：最后一张图片顶部相对于页面的位置>=文档高度+滚动条的垂直位置
falls.prototype.checkWillLoad = function(){
    var lastBox = $("#container .img-box").last();
    var topOffset = $(lastBox).offset().top;
    var screenHeight = $(window).height();
    var scrollTop = $(window).scrollTop();
    return topOffset <= screenHeight + scrollTop;
}