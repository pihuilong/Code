var postFile = {
    init : function(){
        var t = this;
        t.regional = document.getElementById("label");
        t.getImage = document.getElementById("get_image");
        t.editPic = document.getElementById("edit_pic");
        t.editBox = document.getElementById("cover_box");
        
        t.bx = 0;    //background image x
        t.by = 0;   //background image y
        t.cx = 15;  //crop area x
        t.cy = 15;   //crop area y
        t.cHeight = 100;   // crop area height
        t.cWidth = 100;     // crop area width

        document.getElementById("post_file").addEventListener("change",t.handleFiles,false);
        
        document.getElementById("save_button").onclick = function(){
            t.editPic.height = t.cHeight;
            t.editPic.width = t.cWidth;
            var ctx = t.editPic.getContext("2d");
            var images = new Image();
            images.src = t.imgUrl;

            images.onload = function(){
                ctx.drawImage(images,t.cx,t.cy,t.cWidth,t.cHeight,0,0,t.cWidth,t.cHeight);
                document.getElementById("show_pic").getElementsByTagName("img")[0].src = t.editPic.toDataURL();
            }
        }
    },

    handleFiles : function(){
        var fileList = this.files[0];
        var oFReader = new FileReader();
        oFReader.readAsDataURL(fileList);
        oFReader.onload = function(oFREvent){
            postFile.paintImage(oFREvent.target.result);
        }
    },

    //使用canvas画出图片
    paintImage : function(url){
        var t = this;
        var createCanvas = t.getImage.getContext("2d");
        var img = new Image();
        img.src = url;
        img.onload = function(){
            if( img.width < t.regional.offsetWidth && img.height < t.regional.offsetHeight){
                t.imgWidth = img.width;
                t.imgHeight = img.height;
            }else{
                var pWidth = img.width/(img.height/t.regional.offsetHeight);  //当图片高度大于宽度时的宽度
                var pHeight = img.height/(img.width/t.regional.offsetWidth); //当图片宽度大于高度时的高度

                t.imgWidth = img.width > img.height ? t.regional.offsetWidth : pWidth;
                t.imgHeight = img.height > img.width ? t.regional.offsetHeight : pHeight;
            }
            //确保canvas居中于div#label中，需要计算其left、top偏移
            t.bx = (t.regional.offsetWidth - t.imgWidth)/2 + "px";
            t.by = (t.regional.offsetHeight - t.imgHeight)/2 + "px";
            //设置背景图canvas的宽高为图片宽高，及left、top 
            t.getImage.height = t.imgHeight;
            t.getImage.width = t.imgWidth;
            t.getImage.style.left = t.bx;
            t.getImage.style.top = t.by;

            createCanvas.drawImage(img,0,0,t.imgWidth,t.imgHeight);
            t.imgUrl = t.getImage.toDataURL();
            t.cutImage();
            t.drag_resize();
        }
    },

    //裁剪图片
    cutImage : function(){
        var t = this;
        //设置背景图遮罩canvas
        t.editBox.height = t.imgHeight;
        t.editBox.width = t.imgWidth;
        t.editBox.style.display = "block";
        t.editBox.style.left = t.bx;
        t.editBox.style.top = t.by;

        var cover = t.editBox.getContext("2d");
        cover.fillStyle = "rgba(0,0,0,0.5)";
        cover.fillRect(0,0,t.imgWidth,t.imgHeight);
        //在给定矩形内清空一个矩形（裁剪部分）
        cover.clearRect(t.cx,t.cy,t.cWidth,t.cHeight);

        //裁剪
        var text = "";
        var showEdit = document.getElementById("show_edit");
        text += "background : url("+t.imgUrl+")"+ -t.cx + "px "+ -t.cy +"px no-repeat;";
        text += "width : "+t.cWidth+"px;";
        text += "height : "+t.cHeight + "px;";
        showEdit.style.cssText = text;
    },

    //设置图片裁剪区域拖动
    drag_resize : function(){
        var t = this;
        var draging = false;   //拖动标志
        var startX = 0;     //拖动起点X
        var startY = 0;     //拖动起点Y

        var chgFlag = false;   //更改裁剪大小标志
        var leftFlag = false;   //更改左裁剪大小标志
        var rightFlag = false;  //右
        var topFlag = false;    //上
        var bottomFlag = false;  //下

        t.editBox.onmousemove = function(e){
            //pageX,PageY为指针相对于背景图canvas的位置
            var pageX = e.pageX - (t.regional.offsetLeft + this.offsetLeft);
            var pageY = e.pageY - (t.regional.offsetTop + this.offsetTop);
            //判断鼠标指针所处位置
            var inside = pageX>t.cx+4 && pageX<t.cx+t.cWidth-4&&pageY>t.cy+4&&pageY<t.cy+t.cHeight-4;   //in middle area
            var inP1 = (pageX<=t.cx+4)&&(pageX>=t.cx-5) && (pageY<=t.cy+4)&&(pageY>=t.cy-5);  // in left top point
            var inP2 =  (pageX<=t.cx+4)&&(pageX>=t.cx-5)&& (pageY>=(t.cy+t.cHeight-4))&&(pageY<=(t.cy+t.cHeight+5));  // in left bottom point
            var inP3 = (pageX>=(t.cx+t.cWidth-4)) &&(pageX<=(t.cx+t.cWidth+5)) && (pageY<=t.cy+4)&&(pageY>=t.cy-5);  // in right top point
            var inP4 = (pageX>=(t.cx+t.cWidth-4)) &&(pageX<=(t.cx+t.cWidth+5)) &&   (pageY>=(t.cy+t.cHeight-4))&&(pageY<=(t.cy+t.cHeight+5)); // in right bottom point
            var inL1 = (pageX>=t.cx-5) && (pageX<=t.cx+4) && (pageY>t.cy+4 && (pageY<t.cy+t.cHeight-4)); // in line left
            var inL2 = (pageX>=(t.cx+t.cWidth-4)) &&(pageX<=(t.cx+t.cWidth+5)) && (pageY>t.cy+4 && (pageY<t.cy+t.cHeight-4));  // in line right
            var inL3 = (pageY>=t.cy-5)&&(pageY<=t.cy+4)  && (pageX>t.cx+4 && (pageX<t.cx+t.cWidth-4));  // in line top
            var inL4 = (pageY>=t.cy+t.cHeight-4) && (pageY<=t.cy+t.cHeight+5) && (pageX>t.cx+4 && (pageX<t.cx+t.cWidth-4));  //in line bottom 

            //判断指针是否在裁剪区域，在才可以拖动
            //判断指针是否在可更改裁剪尺寸区域
            if(inP1 || inP2 || inP3 || inP4 || inL1 || inL2 || inL3 || inL4 || inside){
                if(inside){   //指针在内部，可以拖动
                    this.style.cursor = "move";
                }
                else if(inP1){  //分别判断指针所处方位，设置指针形状
                    this.style.cursor = "nw-resize";
                }else if(inP2){
                    this.style.cursor = "sw-resize";
                }else if(inP3){
                    this.style.cursor = "ne-resize";
                }else if(inP4){
                    this.style.cursor = "se-resize";
                }else if(inL1){
                    this.style.cursor = "w-resize";
                }else if(inL2){
                    this.style.cursor = "e-resize";
                }else if(inL3){
                    this.style.cursor = "n-resize";
                }else{
                    this.style.cursor = "s-resize";
                }
                t.tx = t.cx;     // 保存当前裁剪区域左上角坐标，用于改变大小，不可放在mousedown里面，否则值会不断刷新
                t.ty = t.cy;
                this.onmousedown = function(){   //按下鼠标左键
                    if( inside){   //可拖动情况
                        draging = true;
                        t.ex = t.cx;
                        t.ey = t.cy;
                        startX = pageX;
                        startY = pageY;
                    }else{    //可改变裁剪大小情况
                        chgFlag = true;
                        if(inP1){
                            leftFlag=true;
                            topFlag=true;
                        }else if(inP2){
                            leftFlag=true;
                            bottomFlag=true;
                        }else if(inP3){
                            rightFlag = true;
                            topFlag = true;
                        }else if(inP4){
                            rightFlag = true;
                            bottomFlag  =true;
                        }else if(inL1){
                            leftFlag=true;
                        }else if(inL2){
                            rightFlag=true;
                        }else if(inL3){
                            topFlag = true;
                        }else{
                            bottomFlag=true;
                        }
                    }
                }
                window.onmouseup = function(){   //松开鼠标左键
                    draging=false;
                    chgFlag=false;
                    leftFlag=false;
                    rightFlag=false;
                    topFlag=false;
                    bottomFlag=false;
                }
                if(draging){    //拖动位置时的处理
                    if(t.ex + (pageX - startX) < 0){
                        t.cx = 0;
                    }else if(t.ex + (pageX-startX)+t.cWidth > t.imgWidth){
                        t.cx = t.imgWidth - t.cWidth;
                    }else{
                        t.cx = t.ex + (pageX - startX);
                    }

                    if(t.ey + (pageY-startY) < 0){
                        t.cy =0;
                    }else if(t.ey + (pageY-startY)+t.cHeight>t.imgHeight){
                        t.cy = t.imgHeight - t.cHeight;
                    }else{
                        t.cy = t.ey + (pageY-startY);
                    }

                    t.cutImage();
                }
                if(chgFlag){       // 改变裁剪大小时的处理
                    if(leftFlag){
                        if(pageX>t.cx+t.cWidth-20){
                            pageX=t.cx+t.cWidth-20;
                        }
                        t.cx = pageX < 0 ? 0 : pageX;
                        t.cWidth += t.tx-t.cx;
                    }
                    if(rightFlag){
                        if(pageX<t.cx+20){
                            pageX=t.cx+20;
                        }
                        t.cWidth = pageX > t.imgWidth ? (t.imgWidth-t.cx) : (pageX-t.cx);
                    }
                    if(topFlag){
                        if(pageY>t.cy+t.cHeight-20){
                            pageY = t.cy+t.cHeight-20;
                        }
                        t.cy = pageY < 0 ? 0 :pageY;
                        t.cHeight += t.ty-t.cy;
                    }
                    if(bottomFlag){
                        if(pageY<t.cy+20){
                            pageY=t.cy+20;
                        }
                        t.cHeight = pageY > t.imgHeight ? (t.imgHeight-t.cy) : (pageY - t.cy);
                    }
                    t.cutImage();
                }
            } else{
                this.style.cursor = "auto";
                // this.style.cursor = "crosshair";
                // this.onmousedown = function(){
                //     startX = pageX;
                //     startY = pageY;
                // }
                // this.onmouseup = function(){
                //     if(startX<pageX){
                //         var temp = pageX-startX;
                //         t.cx = startX;
                //         t.cWidth = temp > 20 ? temp : 20;
                //     }else{
                //         var temp = startX - pageX;
                //         t.cx = pageX;
                //         t.cWidth = temp > 20 ? temp : 20;
                //     }
                //     if(startY<pageY){
                //         var tempY = pageY-startY;
                //         t.cy = startY;
                //         t.cHeight = tempY > 20 ? temp :20;
                //     }else{
                //         var tempY = startY - pageY;
                //         t.cy = pageY;
                //         t.cHeight = tempY > 20 ? temp : 20;
                //     }
                // }
                // t.cutImage();
            }

        }

    },

}

postFile.init();