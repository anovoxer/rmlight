app.directive('topnavigation', function () {
      return {
          restrict: 'E',
          scope: {
          },
          templateUrl: 'Partials/ui-elements/t-topnav.html',
          replace: true
      };
});


app.directive('projectmenu', function () {
    return {
        restrict: 'E',
        scope: {            
        },
        controller: function ($scope, $element, $routeParams) {
            $scope.Id = $routeParams.projectid;
        },
        templateUrl: 'Partials/ui-elements/t-menu-project.html',
        replace: true
    };
});