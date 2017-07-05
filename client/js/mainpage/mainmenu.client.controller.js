'use strict';

angular.module('MainModule').controller('MainMenuController', ['$scope', '$uibModal', 'MainMenuService', function($scope, $uibModal, MainMenuService) {
    $scope.$on('activeMenuItem.refresh', function(event) {
        $scope.activeMenuItem = MainMenuService.activeMenuItem;
    });

    // 打开退出警告框
    $scope.login = function() {
        console.log('login');
    };
}]);

angular.module('MainModule').service('MainMenuService', ['$rootScope', '$location', function($rootScope, $location) {
    var urlStr_menuItem = [
        {
            urlStr: '/notes',
            menuItem: 'notes'
        }
    ];

    var service = {
        activeMenuItem : "notes"
    };
    $rootScope.$watch(
        function() {
            return $location.path();
        },
        function() {
            var currPath = $location.path();
            urlStr_menuItem.forEach(function (singleItem) {
                if (currPath.substring(0, singleItem.urlStr.length) === singleItem.urlStr) {
                    service.activeMenuItem = singleItem.menuItem;
                    $rootScope.$broadcast('activeMenuItem.refresh');
                }
            });
        });
    return service;
}]);
