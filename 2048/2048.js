$(function(){
   var play=new Game2048();
   play.start(); 
   $("#new_game_button").click(function(){
       play.new_game();
   });
});


~(function(){
    window.Game2048=game;
    function game(){
        this.board = new Array();          //每个格子的数字
        this.score = 0;
        this.has_conflicated = new Array();     //解决连续消除的标记
        this.startx = 0;         //移动端触摸屏幕时开始点的x坐标
        this.starty = 0;
        this.endx = 0;           //移动端触摸屏幕时结束点的x坐标
        this.endy = 0;
        this.success_string = "Success";
        this.gameover_string = "GameOver";
    
        this.document_width = window.screen.availWidth;     //屏幕宽度
        this.grid_container_width = 0.92 * this.document_width;   //棋盘宽度
        this.cell_side_length = 0.18 * this.document_width;    //格子的大小
        this.cell_space = 0.04 * this.document_width;         //格子之间的间隔
    }
    
    // game start
    game.prototype.start = function(){
        this.prepare_for_mobile();   //做自适应处理
        this.keyboard();
        this.mobileTouch();
        this.new_game();
    }
    
    game.prototype.new_game = function(){
        //初始化棋盘
        this.init();
        //在随机两个格子生成数字
        this.generate_one_number();
        this.generate_one_number();
    }
    
    game.prototype.init = function(){
        for(var i=0;i<4;i++){
            for(var j=0;j<4;j++){
                var grid_cell=$("#grid_cell_"+i+"_"+j);
                grid_cell.css("top",this.get_pos_top(i,j));
                grid_cell.css("left",this.get_pos_left(i,j));
            }
        }
    
        for(var i=0;i<4;i++){
            this.board[i] = new Array();
            this.has_conflicated[i] = new Array();
            for(var j=0;j<4;j++){
                this.board[i][j] = 0;
                var grid_cell=$("#grid_cell_"+i+"_"+j);
                grid_cell.css("top",this.get_pos_top(i,j));
                grid_cell.css("left",this.get_pos_left(i,j));
                this.has_conflicated[i][j]=false;
            }
        }
        this.update_board_view();
        this.score=0;
        this.update_score(this.score);
    }
    
    //更新棋局
    game.prototype.update_board_view = function(){
        $(".number_cell").remove();
        for(var i=0;i<4;i++){
            for(var j=0;j<4;j++){
                $("#grid_container").append('<div class="number_cell" id="number_cell_'+i+'_'+j+'"></div>');
                var number_cell = $('#number_cell_'+i+'_'+j);
                if(this.board[i][j]==0){
                    number_cell.css('width','0px');
                    number_cell.css('height','0px');
                    number_cell.css('top',this.get_pos_top(i,j)+this.cell_side_length/2);
                    number_cell.css('left',this.get_pos_left(i,j)+this.cell_side_length/2);
                }else{
                    number_cell.css('width',this.cell_side_length);
                    number_cell.css('height',this.cell_side_length);
                    number_cell.css('top',this.get_pos_top(i,j));
                    number_cell.css('left',this.get_pos_left(i,j));
                    number_cell.css('background-color',this.get_number_background_color(this.board[i][j]));
                    number_cell.css('color',this.get_number_color(this.board[i][j]));
                    number_cell.css('font-size',this.get_number_fontSize(this.board[i][j]));
                    number_cell.text(this.board[i][j]);
                }
                this.has_conflicated[i][j]=false;
            }
        }
        $('.number_cell').css('line-height',this.cell_side_length+'px');
    }
    
    //随机在一个格子生成数字
    game.prototype.generate_one_number = function(){
        if(this.nospace(this.board)){
            return false;
        }
        //随机一个位置
        var randx = parseInt(Math.floor(Math.random()*4));
        var randy = parseInt(Math.floor(Math.random()*4));
        var time=0;
        while(time<60){
            if(this.board[randx][randy]==0){
                break;
            }
            randx = parseInt(Math.floor(Math.random()*4));
            randy = parseInt(Math.floor(Math.random()*4));
            time++;
        }
        if(time==60){
            for(var x=0;x<4;x++){
                for(var y=0;y<4;y++){
                    if(this.board[x][y]==0){
                        randx = x;
                        randy = y;
                    }
                }
            }
        }
        //随机一个数字
        var rand_number = Math.random() < 0.5 ? 2 : 4;
        //在随机位置显示随机数字
        this.board[randx][randy] = rand_number;
        this.show_number_with_animation(randx,randy,rand_number);
        return true;
    }
    
    //自适应处理
    game.prototype.prepare_for_mobile= function(){
        if(this.document_width > 500){
            this.grid_container_width=500;
            this.cell_side_length = 100;
            this.cell_space = 20;
        }
        $("#grid_container").css("width",this.grid_container_width-2*this.cell_space);
        $("#grid_container").css("height",this.grid_container_width-2*this.cell_space);
        $("#grid_container").css("padding",this.cell_space);
        $("#grid_container").css("border-radius",0.02*this.grid_container_width);
        $(".grid_cell").css("width",this.cell_side_length);
        $(".grid_cell").css("height",this.cell_side_length);
        $(".grid_cell").css("border-radius",0.02*this.grid_container_width);
    }
    
    //监听键盘的上下左右移动
    game.prototype.keyboard = function(){
        var that=this;
        $(document).keydown(function(event){
            if($("#score").text() == that.success_string){
                that.new_game();
                return;
            }
            switch(event.keyCode){
                case 37:    //left
                    event.preventDefault();
                    if(that.move_left()){
                        setTimeout(() => {
                            that.generate_one_number();
                        }, 210);
                        setTimeout(() => {
                            that.is_gameover();
                        }, 300);
                    }
                    break;
                case 38:     //up
                    event.preventDefault();
                    if(that.move_up()){
                        setTimeout(() => {
                            that.generate_one_number();
                        }, 210);
                        setTimeout(() => {
                            that.is_gameover();
                        }, 300);
                    }
                    break;
                case 39 :   //right
                    event.preventDefault();
                    if(that.move_right()){
                        setTimeout(() => {
                            that.generate_one_number();
                        }, 210);
                        setTimeout(() => {
                            that.is_gameover();
                        }, 300);
                    }
                    break;
                case 40:   //down
                    event.preventDefault();
                    if(that.move_down()){
                        setTimeout(() => {
                            that.generate_one_number();
                        }, 210);
                        setTimeout(() => {
                            that.is_gameover();
                        }, 300);
                    }
                    break;
                default:
                    break;
            }
        });    
    }
    
    game.prototype.mobileTouch = function(){
        var that=this;
        //监听移动设备的触摸开始
        document.addEventListener("touchstart",function(event){
            that.startx = event.touches[0].pageX;
            that.starty = event.touches[0].pageY;
        });
        //监听移动设备的触摸移动
        document.addEventListener("touchmove",function(event){
            event.preventDefault();
        });
        //监听移动设备的触摸结束
        document.addEventListener("touchend",function(event){
            that.endx = event.changedTouches[0].pageX;
            that.endy = event.changedTouches[0].pageY;
    
            var deltax = that.endx - that.startx;
            var deltay = that.endy - that.starty;
    
            if(Math.abs(deltax)<0.3*that.document_width && Math.abs(deltay)<0.3*that.document_width){
                return;
            }
            if($("#score").text() == that.success_string){
                that.new_game();
                return;
            }
            //x
            if(Math.abs(deltax)>=Math.abs(deltay)){
                if(deltax > 0){
                    //move right
                    if(that.move_right()){
                        setTimeout(() => {
                            that.generate_one_number();
                        }, 210);
                        setTimeout(() => {
                            that.is_gameover();
                        }, 300);
                    }
                }else{
                    // move left
                    if(that.move_left()){
                        setTimeout(() => {
                            that.generate_one_number();
                        }, 210);
                        setTimeout(() => {
                            that.is_gameover();
                        }, 300);
                    }
                }
            }else{   //y
                if(deltay>0){
                    //move down
                    if(that.move_down()){
                        setTimeout(() => {
                            that.generate_one_number();
                        }, 210);
                        setTimeout(() => {
                            that.is_gameover();
                        }, 300);
                    }
                }else{
                    //move up
                    if(that.move_up()){
                        setTimeout(() => {
                            that.generate_one_number();
                        }, 210);
                        setTimeout(() => {
                            that.is_gameover();
                        }, 300);
                    }
                }
            }
        });
    }
    
    //向左移动
    game.prototype.move_left=function(){
        if(!this.can_move_left(this.board)){
            return false;
        }
        //move left
        for(var i=0;i<4;i++){
            for(var j=1;j<4;j++){
                if(this.board[i][j]!=0){
                    for(var k=0;k<j;k++){
                        if(this.board[i][k]==0&&this.no_block_horizontal(i,k,j,this.board)){
                            this.show_move_animation(i,j,i,k);
                            this.board[i][k]=this.board[i][j];
                            this.board[i][j]=0;
                            break;
                        }else if(this.board[i][k]==this.board[i][j]&&this.no_block_horizontal(i,k,j,this.board)&& !this.has_conflicated[i][k]){
                            this.show_move_animation(i,j,i,k);
                            this.board[i][k]+=this.board[i][j];
                            this.board[i][j]=0;
                            this.score+=this.board[i][k];
                            this.update_score(this.score);
                            this.has_conflicated[i][k]=true;
                            break;
                        }
                    }
                }
            }
        }
        var that=this;
        setTimeout(() => {
            that.update_board_view();
        }, 200);
        return true;
    }
    
    //向右移动
    game.prototype.move_right=function(){
        if(!this.can_move_right(this.board)){
            return false;
        }
        // move right
        for(var i=0;i<4;i++){
            for(var j=2;j>=0;j--){
                if(this.board[i][j]!=0){
                    for(var k=3;k>j;k--){
                        if(this.board[i][k]==0 && this.no_block_horizontal(i,j,k,this.board)){
                            this.show_move_animation(i,j,i,k);
                            this.board[i][k]=this.board[i][j];
                            this.board[i][j]=0;
                            break;
                        }else if(this.board[i][k]==this.board[i][j] && this.no_block_horizontal(i,j,k,this.board) && !this.has_conflicated[i][k]){
                            this.show_move_animation(i,j,i,k);
                            this.board[i][k]+=this.board[i][j];
                            this.board[i][j]=0;
                            this.score+=this.board[i][k];
                            this.update_score(this.score);
                            this.has_conflicated[i][k]=true;
                            break;
                        }
                    }
                }
            }
        }
        var that=this;
        setTimeout(() => {
            that.update_board_view();
        }, 200);
        return true;
    }
    
    //向上移动
    game.prototype.move_up = function(){
        if(!this.can_move_up(this.board)){
            return false;
        }
        // move up
        for(var j=0;j<4;j++){
            for(var i=1;i<4;i++){
                if(this.board[i][j]!=0){
                    for(var k=0;k<i;k++){
                        if(this.board[k][j]==0 && this.no_block_vertical(j,k,i,this.board)){
                            this.show_move_animation(i,j,k,j);
                            this.board[k][j]=this.board[i][j];
                            this.board[i][j]=0;
                            break;
                        }else if(this.board[k][j]==this.board[i][j] && this.no_block_vertical(j,k,i,this.board) && !this.has_conflicated[k][j]){
                            this.show_move_animation(i,j,k,j);
                            this.board[k][j]+=this.board[i][j];
                            this.board[i][j]=0;
                            this.score+=this.board[k][j];
                            this.update_score(this.score);
                            this.has_conflicated[k][j]=true;
                            break;
                        }
                    }
                }
            }
        }
        var that=this;
        setTimeout(() => {
            that.update_board_view();
        }, 200);
        return true;
    }
    
    //向下移动
    game.prototype.move_down = function(){
        if(!this.can_move_down(this.board)){
            return false;
        }
        //move down
        for(var j=0;j<4;j++){
            for(var i=2;i>=0;i--){
                if(this.board[i][j]!=0){
                    for(var k=3;k>i;k--){
                        if(this.board[k][j]==0 && this.no_block_vertical(j,i,k,this.board)){
                            this.show_move_animation(i,j,k,j);
                            this.board[k][j]=this.board[i][j];
                            this.board[i][j]=0;
                            break;
                        }else if(this.board[k][j]==this.board[i][j] && this.no_block_vertical(j,i,k,this.board) && !this.has_conflicated[k][j]){
                            this.show_move_animation(i,j,k,j);
                            this.board[k][j]+=this.board[i][j];
                            this.board[i][j]=0;
                            this.score+=this.board[k][j];
                            this.update_score(this.score);
                            this.has_conflicated[k][j]=true;
                            break;
                        }
                    }
                }
            }
        }
        var that=this;
        setTimeout(() => {
            that.update_board_view();
        }, 200);
        return true;
    }
    
    //判断游戏成功或失败
    game.prototype.is_gameover=function(){
        for(var i=0;i<4;i++){
            for(var j=0;j<4;j++){
                if(this.board[i][j]==2048){
                    this.update_score(this.success_string);
                    return;
                }
            }
        }
        if(this.nospace(this.board) && this.nomove(this.board)){
            this.gameover();
        }
    }
    //游戏结束时更新游戏失败的文字
    game.prototype.gameover= function(){
        this.update_score(this.gameover_string);
    }
    
    //获得相应格子距离期盘顶部的距离
    game.prototype.get_pos_top= function(i, j) {
        return this.cell_space + i * (this.cell_space + this.cell_side_length);
    }
    
    //获得相应格子距离棋盘左边的距离
    game.prototype.get_pos_left= function(i, j) {
        return this.cell_space + j * (this.cell_space + this.cell_side_length);
    }
    
    //获得相应数字的背景色
    game.prototype.get_number_background_color=function(number) {
        switch (number) {
            case 2: return '#eee4da'; break;
            case 4: return '#ede0c8'; break;
            case 8: return '#f2b179'; break;
            case 16: return '#f59563'; break;
            case 32: return '#f67c5f'; break;
            case 64: return '#f65e3b'; break;
            case 128: return '#edcf72'; break;
            case 256: return '#edcc61'; break;
            case 512: return '#9c0'; break;
            case 1024: return '#33b5e5'; break;
            case 2048: return '#09c'; break;
            case 4096: return '#a6c'; break;
            case 8192: return '#93c'; break;
        }
        return 'black';
    }
    
    //获得相应数字的颜色
    game.prototype.get_number_color=function(number) {
        if (number <= 4)
            return '#776e65';
        return 'white';
    }
    
    //获取字体大小
    game.prototype.get_number_fontSize=function(number){
        var len=number.toString().length;
        if(len>2){
            return Math.floor(this.cell_side_length/len+10) + "px";
        }else{
            return 0.6*this.cell_side_length+'px';
        }
    }
    
    //判断棋盘上是否还有空格子
    game.prototype.nospace=function(board) {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (board[i][j] == 0) {
                    return false;
                }
            }
        }
        return true;
    }
    
    //判断是否能向左移动
    game.prototype.can_move_left=function(board){
        for(var i=0;i<4;i++){
            for(var j=1;j<4;j++){
                if(board[i][j]!=0){
                    if(board[i][j-1]==0 || board[i][j-1]==board[i][j]){
                        return true;
                    }
                }
            }
        }
        return false;
    }
    //判断是否能向右移动
    game.prototype.can_move_right=function(board){
        for(var i=0;i<4;i++){
            for(var j=0;j<3;j++){
                if(board[i][j]!=0){
                    if(board[i][j+1]==0 || board[i][j]==board[i][j+1]){
                        return true;
                    }
                }
            }
        }
        return false;
    }
    //判断是否能向上移动
    game.prototype.can_move_up=function(board){
        for(var i=1;i<4;i++){
            for(var j=0;j<4;j++){
                if(board[i][j]!=0){
                    if(board[i-1][j]==0 || board[i][j]==board[i-1][j]){
                        return true;
                    }
                }
            }
        }
        return false;
    }
    //判断是否能向下移动
    game.prototype.can_move_down=function(board){
        for(var i=0;i<3;i++){
            for(var j=0;j<4;j++){
                if(board[i][j]!=0){
                    if(board[i+1][j]==0 || board[i+1][j]==board[i][j]){
                        return true;
                    }
                }
            }
        }
        return false;
    }
    
    //判断水平方向是否有空格子
    game.prototype.no_block_horizontal=function(row,col1,col2,board){
        for(var i=col1+1;i<col2;i++){
            if(board[row][i]!=0){
                return false;
            }
        }
        return true;
    }
    //判断垂直方向是否有空格子
    game.prototype.no_block_vertical=function(col,row1,row2,board){
        for(var i=row1+1;i<row2;i++){
            if(board[i][col]!=0){
                return false;
            }
        }
        return true;
    }
    
    //判断是否还能移动
    game.prototype.nomove=function(board){
        if(this.can_move_down(board)||this.can_move_up(board)||this.can_move_left(board)||this.can_move_right(board)){
            return false;
        }
        return true;
    }
    
    //动画显示数字格子
    game.prototype.show_number_with_animation=function(i,j,rand_number){
        var number_cell = $("#number_cell_"+i+"_"+j);
        number_cell.css("background-color",this.get_number_background_color(rand_number));
        number_cell.css("color",this.get_number_color(rand_number));
        number_cell.text(rand_number);
        number_cell.animate({
            width:this.cell_side_length,
            height:this.cell_side_length,
            top:this.get_pos_top(i,j),
            left:this.get_pos_left(i,j)
        },100);
    }
    
    game.prototype.update_score=function(score){
        $("#score").text(score);
    }
    
    //格子移动时动画效果
    game.prototype.show_move_animation=function(fromx,fromy,tox,toy){
        var number_cell = $("#number_cell_"+fromx+"_"+fromy);
        number_cell.animate({
            left: this.get_pos_left(tox,toy),
            top:this.get_pos_top(tox,toy)
        },200);
    }
})();