app.directive('filterbox', function () {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            apply:"&"
        },
        controller: function ($scope, $element) {
            var filters = $scope.filters = [
                { title: "personal", filter: { sort: 'Id', desc: true, limit: 2, offset: 0 }, selected: true },
                { title: "assigned", filter: { sort: 'Id', desc: true, limit: 20, offset: 0 } },
                { title: "finished", filter: { q: 'Name', limit: 20, offset: 0 } },
            ];

            $scope.select = function (filter) {
                angular.forEach(filters, function (filter) {
                    filter.selected = false;
                });
                filter.selected = true;
                //console.log($scope.apply);
                
                $scope.apply({ filtermessage: filter.filter });
            }
        },

        template:  '<ul class="nav nav-side">' +
                       '<li class="nav-header">My projects</li>' +
                       '<li ng-repeat="filter in filters" ng-class="{active:filter.selected}" >' +
                       '<a href="" ng-click="select(filter)">{{filter.title}}</a>' +
                       '</li>' +
                   '</ul>',

        replace: true
    };
});
