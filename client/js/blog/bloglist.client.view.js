'use strict';

angular.module('BlogModule').controller('BlogListController', function ($scope, $http, $routeParams, $window) {
    var currLabelId = $routeParams.id.substring(1, $routeParams.id.length);
    // 博客分页信息
    $scope.blogsPagination = {
        totalBlogs: 0,      // 所有活动的数量
        maxSize: 5,         // 页面显示个数
        currPage: 1,        // 当前页码
        blogLimit: 20       // 每个页面中显示的活动数量
    };

    var requestBlogs = function (offset, limit) {
        $http.get('/bloglist', {params: {labelId: currLabelId, offset: offset, limit: limit}})
            .success(function (res) {
                $scope.blogsList = res.data.list;
                $scope.blogsPagination.blogLimit = res.data.total;
            })
            .error(function (err) {
                console.log(err);
            });
    };
    requestBlogs(0, $scope.blogsPagination.blogLimit);

    // 更新当前页面的帖子信息
    $scope.updateCurrPageBlogs = function () {
        var from = ($scope.blogsPagination.currPage - 1) * $scope.blogsPagination.activityLimit;
        requestBlogs(from, $scope.blogsPagination.activityLimit);
    };
    $scope.addBlog = function () {
        $window.location.href = '#/addblog/:' + currLabelId;
    };
});
