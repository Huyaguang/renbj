'use strict';

angular.module('BlogModule').controller('BlogDetailsController', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams) {
    var currBlogId = $routeParams.id.substring(1, $routeParams.id.length);
    console.log(currBlogId);
    $http.get('/blog', {params: {blogId: currBlogId}})
        .success(function (res) {
            if (res.status === 1) {
                $scope.blog = res.data;
            } else {
                alert(res.msg);
            }
        })
        .error(function (err) {
            alert(err);
        });
}]);