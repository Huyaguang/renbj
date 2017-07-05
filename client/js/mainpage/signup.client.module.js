'use strict';

var app = angular.module('SignupModule', ['directives', 'ngAnimate', 'ui.bootstrap']);

app.controller('SignupController', function ($scope, $http, $window) {
    $scope.formFields = {};

    // 提交表单
    $scope.submitForm = function () {
        // 验证
        $scope.errorMsgs = [];
        if (!$scope.formFields.verification || $scope.formFields.verification.toString().length === 0) {
            $scope.errorMsgs.push('验证信息为空');
        }
        if (!$scope.formFields.nickname || $scope.formFields.nickname.toString().length === 0) {
            $scope.errorMsgs.push('昵称为空');
        }
        if (!$scope.formFields.phone || $scope.formFields.phone.toString().length !== 11) {
            $scope.errorMsgs.push('手机号格式错误');
        }
        if (!$scope.formFields.password || $scope.formFields.password.toString().length < 6) {
            $scope.errorMsgs.push('密码格式错误');
        }
        if ($scope.errorMsgs.length > 0) {
            return;
        }

        // 向服务器提交表单
        $http.post('/register', $scope.formFields)
            .success(function (res) {
                if (res.status === 1) {
                    $window.location.href = "/";
                } else {
                    $scope.errorMsgs.push(res.msg);
                }
            })
            .error(function (err) {
                $scope.errorMsgs.push('注册失败，请重试');
            });
    };
});
