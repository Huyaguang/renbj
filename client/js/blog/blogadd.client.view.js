'use strict';

angular.module('BlogModule').controller('BlogAddController', function ($scope, $window, $http, $routeParams) {
    var currLabelId = $routeParams.id.substring(1, $routeParams.id.length);
    $scope.blog = {label: currLabelId};
    $scope.blog.blogType = 1;
    $scope.blogType = [
        {id: 1, name: "普通博客"},
        {id: 2, name: "置顶博客"},
        {id: 9, name: "私密博客"}
    ];
    $scope.submit = function () {
        // console.log()
        // 提交到服务器,服务器返回成功后,关闭窗口
        $http.post('/blog', $scope.blog)
            .success(function (res) {
                if (res.status === 1) {
                    alert('成功');
                } else {
                    alert(res.msg);
                }
            })
            .error(function (err) {
                alert(err);
            });
    };
});
