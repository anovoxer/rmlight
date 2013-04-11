'use strict';

/* App Module */

angular.module('reachmeelight', ['phonecatFilters', 'phonecatServices']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/dashboard', {templateUrl: 'partials/rm-dashboard.html',   controller: DashboardCtrl}).
      when('/phones/:phoneId', {templateUrl: 'partials/phone-detail.html', controller: PhoneDetailCtrl}).
      otherwise({redirectTo: '/dashboard'});
}]);


var app = angular.module('phonecat', []);
app.controller('MenuCtrl2', function($scope) {
	$scope.activeId = 0;
	$scope.menus = [
		{ id: 0, 'name':'Dashboard', 'url':'index.html'},
		{ id: 4, 'name':'Help', 'url':'help.html'}
	];
});

