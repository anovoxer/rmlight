app.directive('activelink', ['$location', function (location) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs, controller) {
            var path = attrs.activelink.substring(1);
            scope.location = location;
            scope.$watch('location.path()', function (newPath) {                
                //if (path === newPath) {
                if (newPath.indexOf(path) == 0) {
                    element.addClass("active");
                } else {
                    element.removeClass("active");
                }
            });
        }
    };
}]);