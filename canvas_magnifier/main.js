//define variables and share objects
var canvas = document.getElementById("canvas"),
      context = canvas.getContext("2d"),
      copycanvas = document.getElementById("copycanvas"),
      copycontext = copycanvas.getContext("2d"),
      square = document.getElementById("square"),
      squaredata = {},
      box = canvas.getBoundingClientRect(),   //获取元素上、下、左、右分别相对浏览器的坐标位置
      regional = document.getElementById("regional"),
      times = 3,
      copySize = copycanvas.width,
      squareSize;
      

//create image object and load it
image = new Image(),
image.src = "fdj.jpeg";
var imgWidth,imgHeight;
image.onload = function(){
    if(image.width < regional.offsetWidth && image.height<regional.offsetHeight){
        imgWidth = image.width;
        imgHeight = image.height;
    }else{
        var pw = image.width/(image.height/regional.offsetHeight);
        var ph = image.height/(image.width/regional.offsetWidth);
        imgWidth = image.width > image.height?regional.offsetWidth:pw;
        imgHeight = image.height>image.width?regional.offsetHeight:ph;
    }
    var bx = (regional.offsetWidth-imgWidth)/2+"px";
    var by = (regional.offsetHeight-imgHeight)/2+"px";
    canvas.height = imgHeight;
    canvas.width = imgWidth;
    canvas.style.left = bx;
    canvas.style.top = by;
    box = canvas.getBoundingClientRect();
    
    context.drawImage(image,0,0,imgWidth,imgHeight);
}

trigger();
//trigger event
function trigger(){
    canvas.onmouseover = function(e){
        var x = e.clientX,
              y = e.clientY;
    
        createSquare(x,y);
    }
    window.onmousemove = function(e){
        var x = e.clientX,
              y = e.clientY;
            
        if(x >= box.left && x <= box.left+canvas.width && y >= box.top && y <= box.top+canvas.height){
            createSquare(x,y);
        }else{
            hideSquare();
            hideCanvas();
        }
    }
}

//hide or show copycanvas && choice box
function showSquare(){
    square.style.display = "block";
}
function hideSquare(){
    square.style.display = "none";
}
function showCanvas(){
    copycanvas.style.display = "inline";
}
function hideCanvas(){
    copycanvas.style.display = "none";
}

//move choice box while the mouse move
function createSquare(x,y){
    squareSize = copySize/times;
    var tempSize = squareSize/2;

    square.style.width = squareSize+"px";
    square.style.height = squareSize+"px";
    x = x-tempSize < box.left? box.left: x-tempSize;
    y = y-tempSize < box.top ? box.top : y-tempSize;
    x = x+squareSize < box.right ? x : box.right-squareSize;
    y = y+squareSize < box.bottom ? y:box.bottom-squareSize;

    squaredata.left = x;
    squaredata.top = y;
    moveSquare(x,y);
}
function moveSquare(x,y){
    square.style.left = x + "px";
    square.style.top = y + "px";
    showCanvas();
    showSquare();
    copy();
}

//draw canvas to copycanvas
function copy(){
    copycontext.drawImage(
        canvas,
        squaredata.left - box.left,
        squaredata.top - box.top,
        squareSize,
        squareSize,
        0,0,copycanvas.width,copycanvas.height
    );
}

//choose image
document.getElementById("choose_img").addEventListener("change",handleFiles,false);
function handleFiles(){
    var fileList = this.files[0];
    var oFReader = new FileReader();
    oFReader.readAsDataURL(fileList);
    oFReader.onload = function(e){
        image.src = e.target.result;
    }
}

//change times
var sel = document.getElementById("times");
if(sel && sel.addEventListener){
    sel.addEventListener("change",function(e){
        var ev = e || window.event;
        var target = ev.target || ev.srcElement;
        times = target.value;
        console.log(times);
    },false)
}
