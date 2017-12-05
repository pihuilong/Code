//动画显示数字格子
function show_number_with_animation(i,j,rand_number){
    var number_cell = $("#number_cell_"+i+"_"+j);
    number_cell.css("background-color",get_number_background_color(rand_number));
    number_cell.css("color",get_number_color(rand_number));
    number_cell.text(rand_number);
    number_cell.animate({
        width:cell_side_length,
        height:cell_side_length,
        top:get_pos_top(i,j),
        left:get_pos_left(i,j)
    },100);
}

function update_score(score){
    $("#score").text(score);
}

//格子移动时动画效果
function show_move_animation(fromx,fromy,tox,toy){
    var number_cell = $("#number_cell_"+fromx+"_"+fromy);
    number_cell.animate({
        left: get_pos_left(tox,toy),
        top:get_pos_top(tox,toy)
    },200);
}