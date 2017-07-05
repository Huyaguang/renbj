'use strict';

function signinModuleInit() {
    var app = angular.module('SigninModule', ['directives', 'ngAnimate', 'ui.bootstrap']);

    app.controller('SigninController', ['$scope', '$http', '$window', function ($scope, $http, $window) {
        $scope.formFields = {};
        // 提交表单
        $scope.submitForm = function () {
            $scope.errorMsgs = [];
            if (!$scope.formFields.phone || $scope.formFields.phone.toString().length === 0) {
                $scope.errorMsgs.push('请输入手机号');
            }
            if (!$scope.formFields.password || $scope.formFields.password.toString().length === 0) {
                $scope.errorMsgs.push('请输入密码');
            }
            if ($scope.errorMsgs.length > 0) {
                return;
            }

            // 向服务器提交表单
            $http.post('/login', $scope.formFields)
                .success(function (res) {
                    if (res.status === 1) {
                        $window.location.href = "/";
                    } else {
                        $scope.errorMsgs.push(res.msg);
                    }
                })
                .error(function (err) {
                    $scope.errorMsgs.push('手机号或者密码错误');
                });
        };
    }]);
}

signinModuleInit();
