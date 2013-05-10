angular.module('services.breadcrumbs', []);
angular.module('services.breadcrumbs').factory('breadcrumbs', ['$rootScope', '$location', 'DataContainer', function ($rootScope, $location, DataContainer) {

    var breadcrumbs = [];
    var breadcrumbsService = {};

    $rootScope.$on('$routeChangeSuccess', function(event, current){

        if (typeof (current.$route) === "undefined") { return; }
        var bread = typeof(current.$route.bread) !== "undefined" && current.$route.bread ? current.$route.bread : [];
        breadcrumbs = [];

        for (var i = 0; i < bread.length; i++) {
            var path = bread[i].url.replace(":projectid", current.pathParams.projectid);
            var name = bread[i].name;
            breadcrumbs.push({ name: name, path: path });
        };
    });

    breadcrumbsService.getAll = function () {
        return breadcrumbs;
    };

    breadcrumbsService.getFirst = function() {
        return breadcrumbs[0] || {};
    };

    return breadcrumbsService;
}]);


app.directive('breadcrumb', function ($location, $route, breadcrumbs) {
    return {
        restrict: 'E',
        priority: 99,
        replace: true,
        link: function (scope, element, attrs, controller) {
            scope.breadcrumbs = breadcrumbs;
        },
        template: '<ul class="breadcrumb" >' +
            '<li ng-repeat="breadcrumb in breadcrumbs.getAll()">' +
                '<span class="divider">/</span>' +
                '<ng-switch on="$last">' +
                    '<span ng-switch-when="true">' +
                                '<ng-switch on="breadcrumb.name">' +
                                    '<span ng-switch-when="{projectname}">{{GlobalController.projectname}}</span>' +
                                    '<span ng-switch-default>{{breadcrumb.name}}</span>' +
                                '</ng-switch>'+
                    '</span>' +
                    '<span ng-switch-default>' +
                                '<ng-switch on="breadcrumb.name">' +
                                    '<span ng-switch-when="{projectname}"><a href="{{breadcrumb.path}}">{{GlobalController.projectname}}</a></span>' +
                                    '<span ng-switch-default><a href="{{breadcrumb.path}}">{{breadcrumb.name}}</a></span>' +
                                '</ng-switch>'+
                    '</span>' +
                '</ng-switch>' +
            '</li>' +
        '</ul>'
    }
});