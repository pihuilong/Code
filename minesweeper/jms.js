(function(){
    var JMS = function(id,rowCount,colCount,minLandMineCount,maxLandMineCount){
        if(!(this instanceof JMS)){
            return new JMS(id,rowCount,colCount,minLandMineCount,maxLandMineCount);
        }
        this.doc = document;
        this.table = this.doc.getElementById(id);     //table for  drawing cells
        this.cells = this.table.getElementsByTagName("td")    //cells
        this.rowCount=rowCount || 10;      // rows of the cells
        this.colCount = colCount || 10;     //cols of the cells
        this.landMineCount = 0; //the number of landMines
        this.markLandMineCount =0;     // the number of marked landMines
        this.minLandMineCount = minLandMineCount || 10;      //the minimum number of  landmines
        this.maxLandMineCount = maxLandMineCount || 20;     // the maximum number of  landmines;
        this.arrs = [];  //  the array corresponding to cells
        this.beginTime = null;     // the time when the game began
        this.endTime = null;  //the time when the game ended
        this.currentStepCount = 0;     //the number of steps that you have play
        this.endCallBack = null;     // the callback function that use for the end of the game
        this.landMineCallBack = null;    //the callback function for updating the remaining number of landmines when player marked a landmine
        this.doc.oncontextmenu = function(){   //disable the contextmenu(right mouse menu)
            return false;
        }

        this.drawMap();
    }

    JMS.prototype = {
        // draw cells
        drawMap:function(){
            var tds = [];
            // for IE
            if (window.ActiveXObject && parseInt(navigator.userAgent.match(/msie ([\d.]+)/i)[1]) < 8) {
                var css = '#JMS_main table td{background-color:#888;}',
                    head = this.doc.getElementsByTagName("head")[0],
                    style = this.doc.createElement("style");
                style.type = "text/css";
                if (style.styleSheet) {
                    style.styleSheet.cssText = css;
                } else {
                    style.appendChild(this.doc.createTextNode(css));
                }
                head.appendChild(style);
            }  //end for IE

            for(var i=0;i<this.rowCount;i++){
                tds.push("<tr>");
                for(var j=0;j<this.colCount;j++){
                    tds.push("<td id='m_"+i+"_"+j+"'></td>");
                }
                tds.push("</tr>");
            }
            this.setTableInnerHTML(this.table,tds.join(""));
        },
        //add HTML to table
        setTableInnerHTML:function(table,html){
            //for IE
            if (navigator && navigator.userAgent.match(/msie/i)) {
                var temp = table.ownerDocument.createElement('div');
                temp.innerHTML = '<table><tbody>' + html + '</tbody></table>';
                if (table.tBodies.length == 0) {
                    var tbody = document.createElement("tbody");
                    table.appendChild(tbody);
                }
                table.replaceChild(temp.firstChild.firstChild, table.tBodies[0]);
            }else{    // end for IE
                table.innerHTML = html;
            }
        },

        //init: set the default value of arrs to 0   && confirm the number of landmines
        init:function(){
            for (var i = 0; i < this.rowCount; i++) {
                this.arrs[i] = [];
                for (var j = 0; j < this.colCount; j++) {
                    this.arrs[i][j] = 0;
                }
            }
            this.landMineCount = this.selectFrom(this.minLandMineCount, this.maxLandMineCount);
            this.markLandMineCount = 0;
            this.beginTime = null;
            this.endTime = null;
            this.currentStepCount = 0;
        },
        // set the value of the arrs corresponding to landmines to 9
        landMine: function () {
            var allCount = this.rowCount * this.colCount - 1,
                tempArr = {};
            for (var i = 0; i < this.landMineCount; i++) {
                var randomNum = this.selectFrom(0, allCount),
                    rowCol = this.getRowCol(randomNum);
                if (randomNum in tempArr) {
                    i--;
                    continue;
                }
                this.arrs[rowCol.row][rowCol.col] = 9;
                tempArr[randomNum] = randomNum;
            }
        },
        // calculate the value of other arrs
        calculateNoLandMineCount: function () {
            for (var i = 0; i < this.rowCount; i++) {
                for (var j = 0; j < this.colCount; j++) {
                    if (this.arrs[i][j] == 9)
                        continue;
                    if (i > 0 && j > 0) {
                        if (this.arrs[i - 1][j - 1] == 9)
                            this.arrs[i][j]++;
                    }
                    if (i > 0) {
                        if (this.arrs[i - 1][j] == 9)
                            this.arrs[i][j]++;
                    }
                    if (i > 0 && j < this.colCount - 1) {
                        if (this.arrs[i - 1][j + 1] == 9)
                            this.arrs[i][j]++;
                    }
                    if (j > 0) {
                        if (this.arrs[i][j - 1] == 9)
                            this.arrs[i][j]++;
                    }
                    if (j < this.colCount - 1) {
                        if (this.arrs[i][j + 1] == 9)
                            this.arrs[i][j]++;
                    }
                    if (i < this.rowCount - 1 && j > 0) {
                        if (this.arrs[i + 1][j - 1] == 9)
                            this.arrs[i][j]++;
                    }
                    if (i < this.rowCount - 1) {
                        if (this.arrs[i + 1][j] == 9)
                            this.arrs[i][j]++;
                    }
                    if (i < this.rowCount - 1 && j < this.colCount - 1) {
                        if (this.arrs[i + 1][j + 1] == 9)
                            this.arrs[i][j]++;
                    }
                }
            }
        },
        //get a random number
        selectFrom: function (iFirstValue, iLastValue) {
            var iChoices = iLastValue - iFirstValue + 1;
            return Math.floor(Math.random() * iChoices + iFirstValue);
        },
        // find the value of the row and col   from a number
        getRowCol: function (val) {
            return {
                row: parseInt(val / this.colCount),
                col: val % this.colCount
            };
        },
        
        // get a element by id
        $:function(id){
            return this.doc.getElementById(id);
        },
        //bind the click event for every cell
        bindCells: function () {
            var self = this;
            for (var i = 0; i < this.rowCount; i++) {
                for (var j = 0; j < this.colCount; j++) {
                    (function (row, col) {
                        self.$("m_" + i + "_" + j).onmousedown = function (e) {
                            e = e || window.event;
                            var mouseNum = e.button;
                            var className = this.className;
                            if (mouseNum == 2) {
                                if (className == "flag") {
                                    this.className = "";
                                    self.markLandMineCount--;
                                } else {
                                    this.className = "flag";
                                    self.markLandMineCount++;
                                }
                                if (self.landMineCallBack) {
                                    self.landMineCallBack(self.landMineCount - self.markLandMineCount);
                                }
                            } else if (className != "flag") {
                                self.openBlock.call(self, this, row, col);
                            }
                        };
                    })(i,j);
                }
            }
        },
        //spread the area that no landmine
        showNoLandMine: function (x, y) {
            for (var i = x - 1; i < x + 2; i++)
                for (var j = y - 1; j < y + 2; j++) {
                    if (!(i == x && j == y)) {
                        var ele = this.$("m_" + i + "_" + j);
                        if (ele && ele.className == "") {
                            this.openBlock.call(this, ele, i, j);
                        }
                    }
                }
        },
        //show the cell
        openBlock: function (obj, x, y) {
            if (this.arrs[x][y] != 9) {
                this.currentSetpCount++;
                if (this.arrs[x][y] != 0) {
                    obj.innerHTML = this.arrs[x][y];
                }
                obj.className = "normal";
                if (this.currentSetpCount + this.landMineCount == this.rowCount * this.colCount) {
                    this.success();
                }
                obj.onmousedown = null;
                if (this.arrs[x][y] == 0) {
                    this.showNoLandMine.call(this, x, y);
                }
            } else {
                this.failed();
            }
        },
        //show landmines
        showLandMine: function () {
            for (var i = 0; i < this.rowCount; i++) {
                for (var j = 0; j < this.colCount; j++) {
                    if (this.arrs[i][j] == 9) {
                        this.$("m_" + i + "_" + j).className = "landMine";
                    }
                }
            }
        },
        //show information of all cells
        showAll: function () {
            for (var i = 0; i < this.rowCount; i++) {
                for (var j = 0; j < this.colCount; j++) {
                    if (this.arrs[i][j] == 9) {
                        this.$("m_" + i + "_" + j).className = "landMine";
                    } else {
                        var ele=this.$("m_" + i + "_" + j);
                        if (this.arrs[i][j] != 0)
                            ele.innerHTML = this.arrs[i][j];
                        ele.className = "normal";
                    }
                }
            }
        },
        //clear all information of cells
        hideAll: function () {
            for (var i = 0; i < this.rowCount; i++) {
                for (var j = 0; j < this.colCount; j++) {
                    var tdCell = this.$("m_" + i + "_" + j);
                    tdCell.className = "";
                    tdCell.innerHTML = "";
                }
            }
        },
        //disable the click function of all cells
        disableAll: function () {
            for (var i = 0; i < this.rowCount; i++) {
                for (var j = 0; j < this.colCount; j++) {
                    var tdCell = this.$("m_" + i + "_" + j);
                    tdCell.onmousedown = null;
                }
            }
        },
        

        // game begin
        begin: function () {
            this.currentStepCount = 0;//开始的步数清零
            this.markLandMineCount = 0;
            this.beginTime = new Date();//游戏开始时间
            this.hideAll();
            this.bindCells();
        },
        //game end
        end: function () {
            this.endTime = new Date();//游戏结束时间
            if (this.endCallBack) {//如果有回调函数则调用
                this.endCallBack();
            }
        },
        //game success
        success: function () {
            this.end();
            this.showAll();
            this.disableAll();
            alert("Congratulation！");
        },
        // game failed
        failed: function () {
            this.end();
            this.showAll();
            this.disableAll();
            alert("GAME OVER！");
        },
        //game entrance
        play: function () {
            this.init();
            this.landMine();
            this.calculateNoLandMineCount();
        }
        
        
        
        
    }

    window.JMS = JMS;
})();