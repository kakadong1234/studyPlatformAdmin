var app = angular.module('myApp', []);
app.controller('myCtrl',
    function($scope, $http) {
        var Request = new UrlSearch(); //实例化
        $scope.username=Request.xingming;
        localStorage.setItem("login_user_name",$scope.username);
        $scope.login_user_name=localStorage.getItem("login_user_name");
        $scope.user_id = decodeURI(Request.user_id);
        $scope.user_name= decodeURI(Request.user_name);
        $scope.page=1;
        $scope.load=function(){
            getshuju($scope.page);
            $scope.downOnClick = function () {
                if($scope.page<$scope.pagesLists){
                    $scope.page = $scope.page+1;
                    getshuju($scope.page);
                }
            }
            $scope.upOnClick = function () {
                if($scope.page>1) {
                    $scope.page = $scope.page - 1;
                    getshuju($scope.page);
                }
            }
            //获取数据api
            function getshuju(pageID) {
                // const mockDataList = [
                //     {
                //         article_id: 1,
                //         period: 3,
                //         title:'选修课程01',
                //         coursetype: 1, //选修
                //         created: Date.now()
                //     },
                //     {
                //         article_id: 2,
                //         period: 5,
                //         title:'必修课程02',
                //         coursetype: 2, //选修
                //         created: Date.now()
                //     },
                //     {
                //         article_id: 3,
                //         period: 2,
                //         title:'付费课程03',
                //         coursetype: 3, //选修
                //         created: Date.now()
                //     }
                // ]
                $http.get("http://localhost:8222/studyResult?user_id=" + $scope.user_id)
                    .then(function (res) {
                        console.log(res)
                        $scope.lists = res.data.data.rows.map(function(study){
                            study.type = study.article.coursetype === 1 ? '选修课' : study.article.coursetype === 2 ? '必修课' : '付费课程'
                            study.title = study.article.title
                            study.period = study.article.period
                            return study
                        })
                        $scope.total=$scope.lists.length;
                        $scope.pagesLists=Math.ceil($scope.total/10);
                    });
            }



            $scope.deletearticle=function (user_id) {
                console.log(user_id)
                alert("确定删除？")
                $http.delete("http://localhost:8222/cadre?user_id="+user_id)
                    .then(function (res) {
                        console.log("已删除")
                        window.location.href="ganbu_manage.html"
                    })

            }

        }




        $scope.onClick = function (user_id) {
            // window.location.href="zhucunganbu_detail.html?user_id="+user_id;
        }

        function UrlSearch() {
            var name, value;
            var str = location.href; //取得整个地址栏
            console.log("地址="+str);
            var num = str.indexOf("?");
            str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]

            var arr = str.split("&"); //各个参数放到数组里
            console.log("各个参数放到数组里="+arr);
            for (var i = 0; i < arr.length; i++) {
                num = arr[i].indexOf("=");
                if (num > 0) {
                    name = arr[i].substring(0, num);
                    value = arr[i].substr(num + 1);
                    this[name] = value;
                }
            }
        }
    });