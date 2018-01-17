//初始化函数
$(function () {
    var waterfall = new Falls();
    waterfall.start();
    // $(window).resize(function(){
    //     $("#container").html("");
    //     start();
    // });
});

!(function () {
    window.Falls = falls;
    function falls() {
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

    falls.prototype.start = function () {
        this.init();
        this.run();
        var that = this;
        window.onscroll = throttle(function () {
            var minHeight = that.getMinHeight();
            if (that.checkWillLoad()) {
                that.run();
            }
        },200,1000/60);
    }

    //滚动优化函数：节流&防抖
    /**
     * see detail : https://www.cnblogs.com/coco1s/p/5499469.html
     * @param {真正要执行的函数} func 
     * @param {防抖间隔} wait 
     * @param {必须运行的时间间隔} mustRun 
     */
    function throttle(func, wait, mustRun) {
        var timeout,
            startTime = new Date();
        return function () {
            var context = this,
                args = arguments,
                curTime = new Date();

            clearTimeout(timeout);
            // 如果达到了规定的触发时间间隔，触发 handler
            if (curTime - startTime >= mustRun) {
                func.apply(context, args);
                startTime = curTime;
                // 没达到触发间隔，重新设定定时器
            } else {
                timeout = setTimeout(func, wait);
            }
        };
    };

    //使用JSON数据模拟从后台获取图片数据
    falls.prototype.getData = function () {
        var that = this;
        return $.getJSON("json/falls.json", function (data) {    //此处返回一个jquery的promise对象
            if (data.success) {
                var row = data.row,
                    html = "",
                    len = row.length;
                that.dataNum += len;

                //将获取到的数据通过字符串连接的方式添加到 html 内容中
                for (var i = 0; i < len; i++) {
                    html += "<div class='img-box'><img src='" + row[i].src + "'/></div>";
                }
                $("#container").append(html);
            }
        });
    }

    //初始化函数（主要初始化：列数，每列左偏移，每列高度置为0）
    falls.prototype.init = function () {
        var that = this;
        this.getData().then(function () {
            var $boxs = $("#container .img-box");
            that.cols = Math.floor($("#container").width() / $boxs.eq(0).width());
            for (var i = 0; i < that.cols; i++) {
                var left = $boxs.eq(i).offset().left;
                that.leftArry.push(left);
                that.topArry[i] = 0;
            }
        });
    }

    //主要运行函数
    falls.prototype.run = function () {
        var that = this;
        this.getData().then(function () {
            that.reset();
        });
    }

    //获取所有列中的最小高度列
    falls.prototype.getMinHeight = function () {
        var minHeight = Math.min.apply(null, this.topArry);
        return minHeight;
    }

    //reset用于对图片进行重新定位
    falls.prototype.reset = function () {
        var $boxs = $("#container .img-box");
        this.imgArray = [];
        var that = this;
        $boxs.each(function (i, el) {
            if (i >= that.num) {      //这里我们只需要拿到新的没有定位过的图片，不用重新定位所有的，提升性能
                that.imgArray.push(this);
            }
        });
        this.num += this.dataNum;
        var img = this.imgArray;
        for (var i = 0, len = img.length; i < len; i++) {
            var minHeight = this.getMinHeight(),
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
        if (this.getMinHeight() < window.screen.height) {
            setTimeout(this.run.apply(this), 1)
        }
    }

    //判断是否加载图片的条件：最后一张图片顶部相对于页面的位置>=文档高度+滚动条的垂直位置
    falls.prototype.checkWillLoad = function () {
        var lastBox = $("#container .img-box").last();
        var topOffset = $(lastBox).offset().top;
        var screenHeight = $(window).height();
        var scrollTop = $(window).scrollTop();
        return topOffset <= screenHeight + scrollTop;
    }
})()