'use strict'

//var app = angular.module("ReachmeeLightApp", ['ngResource', 'components']);
var app = angular.module("ReachmeeLightApp", ['ngResource', 'ui']);

app.constant('configuration', {
    ITEMS_URL: '../js/items.json'
});

app.config(['$routeProvider', function ($routeProvider) {
      $routeProvider.
          when('/hi').
          when('/users', { templateUrl: 'partials/admin/admin-users-list.html', controller: UserListCtrl }).
          otherwise({ redirectTo: '/home' });
  }]);


/**
/* Menu section. Menu provider to get list of menu items regarding to security rights for user and other settings
*/

app.factory('Menu', function ($resource) {
    return $resource('../js/items.json');
});

app.factory('UserDATA', function ($resource) {
    return $resource('/api/user/:id', { id: '@id' }, { update: { method: 'PUT' } });
});

function UserCtrl($scope, $route, $routeParams, UserDATA) {
    var id = $routeParams.userid;
    $scope.model = CandidateDATA.get({ id: id });
};

function UserListCtrl($scope, $route, $routeParams, UserDATA) {
    $scope.grid = {
        columns: [{ "Name": "", "Type": "cellCheckBox" },
            { "Name": "Id", "Type": "cellId" },
            { "Name": "Firstname", "Type": "cellName" },
            { "Name": "Lastname", "Type": "cellName" },
            { "Name": "Email", "Type": "cellName" },
            { "Name": "Password", "Type": "cellName" }]
    };
    $scope.filter = {
        q: '',
        sort: 'Id',
        desc: true,
        limit: 10,
        offset: 0
    };
    $scope.applyfilter = function (filter) {
        $scope.filter = filter;
        $scope.search();
    }
    $scope.search = function () {
        $scope.list = UserDATA.query($scope.filter);
    }
    $scope.search();
    $scope.delete = function () {
        var itemId = this.user.Id;
        UserDATA.delete({ id: itemId }, function () {
            $("#item_" + itemId).fadeOut();
        });
    }
};

function UserSupervisor($scope, $route, $routeParams, UserDATA) {
    var id = $routeParams.userid;

    $scope.Id = id;
    $scope.setUserId = function (id) { $scope.Id = id; }
};

function UserInfoCtrl($scope, $route, $routeParams, UserDATA) {
    var id = $routeParams.userid;
    $scope.model = id == 0 ? {} : UserDATA.get({ id: id });

    $scope.Save = function () {
        if (id == 0) {
            UserDATA.save($scope.model, function (info) {
                $scope.setUserId(info.Id);
                toastr.success('User ' + info.Name + ' created')
            });
        } else {
            UserDATA.update({ id: id }, $scope.model, function (info) {
                $scope.setUserId(info.Id);
                toastr.success('User ' + info.Name + ' saved')
            });
        }
    };
};


// TODO: put it to separate "init.js" 

$(function () {
    toastr.options = {
        "debug": false,
        "positionClass": "toast-bottom-right",
        "onclick": toastr.clear,
        "fadeIn": 300,
        "fadeOut": 600,
        "timeOut": 3000,
        "extendedTimeOut": 1000
    }
});