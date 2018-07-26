var app = angular.module('myApp', []);
app.config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);

app.controller('myCtrl',
    function($scope, $http,$location) {
        var Request = new UrlSearch(); //实例化
        window.localStorage.setItem("corpid",$location.search().corpid);
        window.localStorage.setItem("corp_name",$location.search().corp_name);
        window.localStorage.setItem("user_id",$location.search().user_id);
        window.localStorage.setItem("name",$location.search().name);
        $scope.corpid=window.localStorage.getItem("corpid");
        $scope.corp_name=window.localStorage.getItem("corp_name");
        $scope.userid=window.localStorage.getItem("user_id");
        $scope.username=window.localStorage.getItem("name");

        var yixuanDanxuan=[]
        var yixuanPanduan=[]
        var typebbbb=[{
            type_name: "全选",
            type_sort: 1,
            type_state: 2,
            type_desc: "",
            type_fid: '',
            type_id:0,
        }]
       var  page=1
        $scope.page=1
       var  status=1
        $scope.load=function () {        //获取数据api
            $http.get("https://dangjain.ishoubei.com/exam/question?eqt_id=1")
                .then(function (res) {
                    $scope.shiti1=res.data.rows;

                });
            $http.get("https://dangjain.ishoubei.com/exam/question?eqt_id=2")
                .then(function (res) {
                    $scope.shiti2=res.data.rows;
                });
            getArticletype()
            //获取文章类型
            function getArticletype() {
                $http.get("https://dangjain.ishoubei.com/type")
                    .then(function (res) {
                        $scope.typelistone=res.data.data;
                        for(var i=0;i<$scope.typelistone.length;i++){
                            for (var m=0;m<$scope.typelistone[i].childs.length;m++){
                                typebbbb.push($scope.typelistone[i].childs[m])
                            }
                        }
                        $scope.typelists22=typebbbb
                        $scope.articleType=$scope.typelists22[0]
                        getshuju($scope.page,status, $scope.articleType.type_id, 1)
                    });
            }

            //获取数据api
            function getshuju(pageID,status,type_id, coursetype) {
                $http.get("https://dangjain.ishoubei.com/article?page="+pageID+"&status="+1+"&type_id="+type_id+"&limit=100")
                    .then(function (res) {
                        $scope.lists=res.data.rows.filter(function(item){
                            console.log(item.coursetype)
                            console.log(coursetype)
                            return item.coursetype === Number(coursetype)
                        });
                        $scope.total=res.data.total;
                        $scope.pagesLists=Math.ceil($scope.total/10);
                    });
            }



            //获取试题
            $http.get("https://dangjain.ishoubei.com/exam/question?eqt_id=1")
                .then(function (res) {
                    $scope.shiti1=res.data.rows;

                });
            $http.get("https://dangjain.ishoubei.com/exam/question?eqt_id=2")
                .then(function (res) {
                    $scope.shiti2=res.data.rows;
                });




            $scope.clickType=function () {

                $scope.newsDangjian=$scope.articleType.type_name
                getshuju($scope.page,status,$scope.articleType.type_id, 1)
            }
            $scope.onleixingClick1=function () {
                status=1;
                $scope.newsDangjian=$scope.articleType.type_name
                getshuju($scope.page,status,$scope.articleType.type_id, 1)
            }
            $scope.onleixingClick2=function () {
                status=2;
                $scope.newsDangjian=$scope.articleType.type_name
                getshuju($scope.page,status,$scope.articleType.type_id, 2)
            }
            $scope.onleixingClick5=function () {
                status=5;
                $scope.newsDangjian=$scope.articleType.type_name
                getshuju($scope.page,status,$scope.articleType.type_id, 3)
            }
            $scope.downOnClick= function () {
                if($scope.page<$scope.pagesLists){
                    $scope.page = $scope.page+1;
                    getshuju($scope.page,status,$scope.articleType.type_id, 1);
                }
            }
            $scope.upOnClick= function () {
                if($scope.page>1) {
                    $scope.page = $scope.page - 1;
                    getshuju($scope.page,status,$scope.articleType.type_id, 1);
                }
            }


            //选择试题
            $scope.noshitiClick=function (article_id) {
                $http.get("https://dangjain.ishoubei.com/cadre?page=1&limit=1000")
                    .then(function (res) {
                        $scope.user = res.data.rows
                        $scope.userLength = $scope.user.length
                        getStudy(article_id)
                    });
            }

            $scope.xuancheClick=function (id) {
                console.log('start')
                // console.log($scope.removeUserIdList)
                // console.log($scope.addUserIdList)
                const item = $scope.selectedUserIdList.find(function(sItem){
                    return sItem.user_id === id
                })
                if(item){
                    // 有 item - remove
                    const removeItem = $scope.removeUserIdList.find(function(sItem){
                        return sItem.user_id === id
                    })
                    if(removeItem){
                        //已经添加 - 删除
                        $scope.removeUserIdList = $scope.removeUserIdList.filter(function(sItem){
                            return sItem.user_id !== id
                        })
                    }
                    else{
                        $scope.removeUserIdList.push(item)
                    }
                }
                else { //没有 - 添加
                    const addItem = $scope.addUserIdList.find(function(sItem){
                        return sItem.user_id === id
                    })
                    if(addItem){
                        //已经添加 - 删除
                        $scope.addUserIdList = $scope.addUserIdList.filter(function(sItem){
                            return sItem.user_id !== id
                        })
                    }
                    else{
                        $scope.addUserIdList.push({user_id: id})
                    }
                }
                console.log('end')
                console.log($scope.removeUserIdList)
                console.log($scope.addUserIdList)
            }

            $scope.onshitiClick=function () {
                //add user
                for(var i=0; i<$scope.addUserIdList.length; i++){
                    const data = {
                        article_id: $scope.xubangdaingId,
                        user_id: $scope.addUserIdList[i].user_id,
                        add_user_id: 'xuehaifeng'
                    }
                    addUser(data)
                }
                //remove user
                for(var i=0; i<$scope.removeUserIdList.length; i++){
                    delUser($scope.removeUserIdList[i].us_id)
                }
            }

            $scope.onCacel=function () {
                window.location.href='article_home.html'
            }
            


            $scope.deletearticle=function (article_id) {
                var id = Number(article_id)
                var r=confirm("确定删除？");
                if (r==true)
                {

                    $http.post("https://dangjain.ishoubei.com/article/del/"+id)
                        .then(function (res) {
                            console.log("已删除")
                            window.location.href='article_home.html'
                        })
                }
                else
                {
                    alert("已取消!");
                }
            }



            $scope.bohuiClick=function (article_id) {
                var id = Number(article_id)
                var r=confirm("确定驳回？");
                if (r==true)
                {

                    $http.post("https://dangjain.ishoubei.com/article/"+id+"?status=2")
                        .then(function (res) {
                            window.location.reload()
                        })
                }
                else
                {
                    alert("已取消!");
                }
            }


            $scope.tongguoClick=function (article_id) {
                var id = Number(article_id)
                var r=confirm("确定通过？");
                if (r==true)
                {

                    $http.post("https://dangjain.ishoubei.com/article/"+id+"?status=5")
                        .then(function (res) {
                            window.location.href='article_home.html'
                        })
                }
                else
                {
                    alert("已取消!");
                }
            }



            //    推荐文章
            $scope.settuijian=function (article_id,recommend) {
                console.log(recommend)
                if(recommend==0){
                    $http.post("https://dangjain.ishoubei.com/article/"+article_id+"?recommend=1")
                        .then(function (res) {
                            console.log("已设置为他山之玉")
                            window.location.href='article_home.html?'
                        })
                }else if(recommend==1){
                    $http.post("https://dangjain.ishoubei.com/article/"+article_id+"?recommend=0")
                        .then(function (res) {
                            console.log("取消他山之玉设置")
                            window.location.href='article_home.html'
                        })
                }


            }







            $scope.onClick = function (article_id) {
                console.log("djaini ")
                window.location.href="article_detail.html?article_id="+article_id;
            }
            $scope.oncomment=function (article_id) {
                window.location.href="article_comment.html?article_id="+article_id;
            }


        }


        function UrlSearch() {
            var name, value;
            var str = location.href; //取得整个地址栏
            var num = str.indexOf("?");
            str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]

            var arr = str.split("&"); //各个参数放到数组里
            for (var i = 0; i < arr.length; i++) {
                num = arr[i].indexOf("=");
                if (num > 0) {
                    name = arr[i].substring(0, num);
                    value = arr[i].substr(num + 1);
                    this[name] = value;
                }
            }
        }

        function addUser(data) {
            console.log('add User')
            $http({
                method: 'post',
                url: 'https://dangjain.ishoubei.com/study',
                data: $.param(data),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            }).success(function (req) {
                window.location.href='article_home.html'
            })
        }

        function delUser(us_id){
            console.log('del User')
            $http.delete('https://dangjain.ishoubei.com/study/' + us_id)
            .then(function (req) {
                window.location.href='article_home.html'
            })
        }

        function getStudy(article_id) {
            console.log('getStudy by article_id')
            $http.get("https://dangjain.ishoubei.com/study?article_id="+article_id + "&limit=1000")
            .then(function (res) {
                $scope.selectedUserIdList = res.data.rows.map(function(item){
                    return {
                        user_id: item.user_id,
                        article_id: item.article_id,
                        us_id: item.us_id
                    }
                }) //TODO
                console.log($scope.selectedUserIdList)
                $scope.removeUserIdList = [] //TODO
                $scope.addUserIdList = [] //TODO
                $scope.xubangdaingId=article_id
                $scope.user = $scope.user.map(function(item){
                    const selectedItem = $scope.selectedUserIdList.find(function(sItem){
                        return sItem.user_id === item.user_id
                    })
                    console.log('-----')
                    console.log(selectedItem)
                    console.log('-----')
                    if(selectedItem){
                        item.isSelected = true
                    }
                    else{
                        item.isSelected = false
                    }
                    return item
                })
                console.log($scope.user)
            })
        }
    });