angular.module('directives', [])
    .directive('obFocus', function($timeout) {
        return {
            scope: { trigger: '@obFocus' },
            link: function(scope, element, attrs) {
                if (attrs.obFocus === "true") {
                    $timeout(function() {
                            element[0].focus();
                    });
                }
            }
        };
    });