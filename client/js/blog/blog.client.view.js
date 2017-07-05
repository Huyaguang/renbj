'use strict';

angular.module('BlogModule', ['ngRoute', 'ui.bootstrap', 'textAngular']);
angular.module('BlogModule').controller('BlogController', function ($scope, $http, $uibModal) {
    var getBlogMainPage = function () {
        $http.get('/blogmainpage')
            .success(function (res) {
                if (res.status === 1) {
                    $scope.user = res.data.user;
                    $scope.labels = res.data.labels;
                    $scope.isHasUserPermission = res.data.isHasUserPermission;
                    console.log(res);
                } else {
                    alert('出现错误');
                }
            })
            .error(function (err) {
                console.log(err);
                alert('出现未知错误');
            });
    };
    getBlogMainPage();

    $scope.clickLabel = function (label) {
        console.log(label);
    };

    $scope.openAddLabelModal = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'noticeAdd.html',
            controller: 'LabelAddModalCtrl'
        });
        // 窗口内容填写正常后,关闭,则向服务器提交表单
        function onModalClose(info) {
            addLabel(info);
        }
        // 窗口取消型关闭
        function onModalDismiss() {
            console.log('Modal dismissed at: ' + new Date());
        }
        modalInstance.result.then(onModalClose, onModalDismiss);
    };
    var addLabel = function (label) {
        $http.post('/label', label)
            .success(function (res) {
                if (res.status === 1) {
                    alert('添加成功');
                    getBlogMainPage();
                } else {
                    alert(res.msg);
                }
            })
            .error(function (err) {
                alert(err);
            });
    };
}).config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/label/:id', {
            templateUrl: 'client/html/blog/bloglist.client.view.html'
        })
        .when('/blog/:id', {
            templateUrl: 'client/html/blog/blogdetail.client.view.html'
        })
        .when('/addblog/:id', {
            templateUrl: 'client/html/blog/blogadd.client.view.html'
        })
        .when('/blogdetail/:id', {
            templateUrl: 'client/html/blog/blogdetail.client.view.html'
        })

        .otherwise({
            redirectTo: '/'
        });
}]);


// 添加通知 Modal
angular.module('BlogModule').controller('LabelAddModalCtrl', function ($scope, $uibModalInstance) {
    $scope.label = {};
    $scope.label.labelType = 1;

    $scope.labelType = [
        {id: 1, name: "普通标签"},
        {id: 2, name: "置顶标签"},
        {id: 9, name: "私密标签"}
    ];

    $scope.submit = function () {
        $uibModalInstance.close($scope.label);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});
