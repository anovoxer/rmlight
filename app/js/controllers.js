'use strict';

/* Controllers */

function PhoneListCtrl($scope, Phone) {
  $scope.phones = Phone.query();
  $scope.orderProp = 'age';
}

//PhoneListCtrl.$inject = ['$scope', 'Phone'];


function DashboardCtrl($scope, $routeParams, Phone) {

	//alert($scope);
	
	$scope.Name = "DashboardCtrl";

  $scope.phone = Phone.get({phoneId: $routeParams.phoneId}, function(phone) {
    $scope.mainImageUrl = phone.images[0];
  });

  $scope.setImage = function(imageUrl) {
    $scope.mainImageUrl = imageUrl;
  }
}


function PhoneDetailCtrl($scope, $routeParams, Phone) {
  $scope.phone = Phone.get({phoneId: $routeParams.phoneId}, function(phone) {
    $scope.mainImageUrl = phone.images[0];
  });

  $scope.setImage = function(imageUrl) {
    $scope.mainImageUrl = imageUrl;
  }
}

//PhoneDetailCtrl.$inject = ['$scope', '$routeParams', 'Phone'];

/* Menu controler */

function MenuCtrl($scope) {
	$scope.activeId = 0;
	$scope.menus = [
		{ id: 0, 'name':'Dashboard', 'url':'index.html'},
		{ id: 1, 'name':'Projects', 'url':'project.html'},
		{ id: 2, 'name':'Candidates', 'url':'candidates.html'},
		{ id: 3, 'name':'Analytics', 'url':'analytics.html'},
		{ id: 4, 'name':'Help', 'url':'help.html'}
	];
}

function MainHeaderCtrl($scope)
{
}