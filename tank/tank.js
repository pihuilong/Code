//首先我们在页面加载完后获取坦克移动的范围，就是id='border' 的DIV的宽度和高度
window.onload=function(){
    width=document.getElementById("border").offsetWidth;
    height=document.getElementById("border").offsetHeight;
}
var width,height;
var y=50;    //坦克的坐标，以左上角为计算原点，水平方向为X轴，垂直方向为Y轴初始化坐标
var x=50;

document.onkeydown=keydown;
document.onkeyup=keyup;

//我们再分别编写函数，处理按键
function keydown(e){
    var ev=e || window.event;//兼容火狐和IE,
    //使用 || 运算符的好处是，当e可用时，ev=e,既火狐浏览器下，
    //非火狐浏览器时e为undefined，ev=window.event，既IE和webkit浏览器

    if(ev.keyCode==37 || ev.keyCode==65){        //left or  A
        deal_left("move");
    }else if(ev.keyCode==38 || ev.keyCode==87){
        deal_up("move");
    }else if(ev.keyCode==39 || ev.keyCode==68){
        deal_right("move");
    }else if(ev.keyCode==40 || ev.keyCode==83){
        deal_down("move");
    }
}

function keyup(e){
    var ev=e || window.event;
    if(ev.keyCode==37 || ev.keyCode==65){        //left or  A
        deal_left("stop");
    }else if(ev.keyCode==38 || ev.keyCode==87){
        deal_up("stop");
    }else if(ev.keyCode==39 || ev.keyCode==68){
        deal_right("stop");
    }else if(ev.keyCode==40 || ev.keyCode==83){
        deal_down("stop");
    }
}

//然后我们再分别编写处理各方向的函数
var f_left,f_right,f_up,f_down;
var left_flag=0;   //保存该方向是否进行移动，0表示停止，1表示正在移动
var right_flag=0;
var up_flag=0;
var down_flag=0;
var rotate=0;     //保存坦克的前进方向

function deal_left(type){
    if(type=="move"){
        if(left_flag!=1){
            f_left=setInterval(left_move,10);
        }
        left_flag=1;
    }else{
        clearInterval(f_left);
        left_flag=0;
    }
}function deal_right(type){
    if(type=="move"){
        if(right_flag!=1){
            f_right=setInterval(right_move,10);
        }
        right_flag=1;
    }else{
        clearInterval(f_right);
        right_flag=0;
    }
}
function deal_up(type){
    if(type=="move"){
        if(up_flag!=1){
            f_up=setInterval(up_move,10);
        }
        up_flag=1;
    }else{
        clearInterval(f_up);
        up_flag=0;
    }
}
function deal_down(type){
    if(type=="move"){
        if(down_flag!=1){
            f_down=setInterval(down_move,10);
        }
        down_flag=1;
    }else{
        clearInterval(f_down);
        down_flag=0;
    }
}

//最后一个函数了！终于快完成了。编写真正的移动函数
function left_move(){
    if((x-48)>50) x-=2;
    document.getElementById("tank").style.top=y-50+"px";
    document.getElementById("tank").style.left=x-50+"px";
    rotate=-90;
    document.getElementById("tank").style.webkitTransform="rotate(-90deg)";
    document.getElementById("tank").style.MozTrasform="rotate(-90deg)";
}
function right_move()
{
    if((x-52)<width-100)
        x+=2;
    document.getElementById("tank").style.top=y-50+"px";
    document.getElementById("tank").style.left=x-50+"px";
    rotate=90;
    document.getElementById("tank").style.WebkitTransform="rotate(90deg)";
    document.getElementById("tank").style.MozTransform="rotate(90deg)";
}
function up_move()
{
    if((y-52)>50)
        y-=2;
    document.getElementById("tank").style.top=y-50+"px";
    document.getElementById("tank").style.left=x-50+"px";
    rotate=0;
    document.getElementById("tank").style.WebkitTransform="rotate(0deg)";
    document.getElementById("tank").style.MozTransform="rotate(0deg)";
}
function down_move()
{
    if((y-48)<height-100)
        y+=2;
    document.getElementById("tank").style.top=y-50+"px";
    document.getElementById("tank").style.left=x-50+"px";
    rotate=180;
    document.getElementById("tank").style.WebkitTransform="rotate(180deg)";
    document.getElementById("tank").style.MozTransform="rotate(180deg)";
}
