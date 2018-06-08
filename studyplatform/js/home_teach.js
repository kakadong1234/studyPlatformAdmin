var app = angular.module('myApp', []);
app.controller('myCtrl',
    function($scope, $http) {
        var Request = new UrlSearch(); //实例化
        $scope.username=Request.xingming;
        localStorage.setItem("login_user_name",$scope.username);
        $scope.login_user_name=localStorage.getItem("login_user_name");
        $scope.load=function(){
            getshuju(23);
            //获取数据api
            function getshuju(type) {
                $http.get("https://dangjain.ishoubei.com:8443/article?type_id="+type)
                    .then(function (res) {
                        $scope.lists=res.data.rows.map(function(item){
                            console.log(item)
                            if(item.type_name === '党建'){
                                item.type_name = '办公'
                            }
                            if(item.type_name === '农技'){
                                item.type_name = '职业'
                            }
                            if(item.type_name === '教育'){
                                item.type_name = '产品'
                            }
                            if(item.type_name === '法律'){
                                item.type_name = '生活'
                            }
                            if(item.type_name === '科技'){
                                item.type_name = '工具'
                            }
                            if(item.type_name === '其它'){
                                item.type_name = '其他'
                            }
                            return item;
                        });;
                        console.log("文章ID："+$scope.lists.article_id)

                        // $scope.total=res.data.total;
                        // $scope.pagesLists=Math.ceil($scope.total/10);
                    });
            }

            $scope.onleixingClick=function () {
                console.log($scope.leixing)
                getshuju($scope.leixing);
            }

            $scope.deletearticle=function (article_id) {
                var id = Number(article_id)
                console.log(id)
                // var data ={article_id:article_id}
                // $.ajax({
                //     url:"https://dangjain.ishoubei.com:8443/article/",
                //     type:"delete",
                //     contentType:"application/json",
                //     dataType:"json",
                //     data:data,
                //     success:function(msg){
                //         callback(msg);
                //         console.log(1)
                //     },
                //     error:function(xhr,textstatus,thrown){
                //
                //     }
                // });
                alert("确定删除？")
                $http.post("https://dangjain.ishoubei.com:8443/article/del/"+id)
                    .then(function (res) {
                        console.log("已删除")
                        window.location.href='home_teach.html'
                    })

            }




            $scope.onClick = function (article_id) {
                console.log("djaini ")
                window.location.href="article_list1.html?article_id="+article_id;
            }

        }
        // $scope.fullName = function(conts) {
        //     if(conts.length<30){
        //         var aa =conts
        //         return aa;
        //     }else{
        //         var aa =conts.substring(0,30) + "...";
        //         return aa;
        //     }
        // };





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