// 创建一个 Angular 对象
var todoapp = window.angular.module("todoapp", []);

// 对象的控制器参数
todoapp.controller("todolistcontroller",["$scope",function($scope){
    $scope.text = '';
    // 默认的清单列表
    $scope.todolist = [];
    // [{
    //     text: 'hello world',
    //     done: false
    // }, {
    //     text: 'I use Python',
    //     done: false
    // }];
    // 实现增添任务功能
    $scope.add = function(){

        // 获取任务文本内容
        var text = $scope.text.trim();
        if(text){
            $scope.todolist.push({
                text: text,
                done: false
            });

            $scope.text = '';
        }
    }
    // 删除任务函数
    $scope.delete = function(todo){
        var index = $scope.todolist.indexOf(todo);

        $scope.todolist.splice(index, 1);
    }
    // 统计任务总数量
    $scope.doneCount = function(){
        var temp = $scope.todolist.filter(function(item){
            return item.done;
        });

        // 返回任务个数
        return temp.length;
    }

}]);