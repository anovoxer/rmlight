'use strict'

//var app = angular.module("ReachmeeLightApp", ['ngResource', 'components']);
var app = angular.module("ReachmeeLightApp", ['ngResource']);

app.constant('configuration', {
    ITEMS_URL: '../js/items.json'
});

app.config(['$routeProvider', function ($routeProvider) {
      $routeProvider.
          when('/home', { templateUrl: 'partials/rm-dashboard.html', controller: null }).
          when('/projects/:projectid', { templateUrl: 'partials/rm-project.html', controller: ProjectSupervisor }).
          when('/projects', { templateUrl: 'partials/rm-project-list.html', controller: ProjectListCtrl }).
          //when('/project/create', { templateUrl: 'partials/rm-project.html',  param:{projectid:1}, controller: ProjectCreateCtrl }).
          when('/candidates', { templateUrl: 'partials/rm-candidates.html', controller: null }).
          when('/candidates/:candidateid', { templateUrl: 'partials/rm-candidate-info.html', controller: CandidateInfoCtrl }).
          when('/candidates/:candidateid/edit', { templateUrl: 'partials/rm-candidate-edit.html', controller: CandidateInfoCtrl }).
          when('/management', { templateUrl: 'partials/rm-management.html', controller: null }).
          when('/analytics', { templateUrl: 'partials/rm-analytics.html', controller: null }).
          when('/help', { templateUrl: 'partials/rm-help.html', controller: null }).
          otherwise({ redirectTo: '/home' });
  }]);


/**
/* Menu section. Menu provider to get list of menu items regarding to security rights for user and other settings
*/

app.factory('Menu', function ($resource) {
    return $resource('../js/items.json');
});

app.factory('CandidateDATA', function ($resource) {
    return $resource('/api/candidate/:id', { id: '@id' });
});

app.factory('ProjectDATA', function ($resource) {
    return $resource('/api/project/:id', { id: '@id' }, { update: { method: 'PUT' } });
});


app.factory('WorkflowDATA', function ($resource) {
    return $resource('/api/workflow/:id', { id: '@id' });
});


app.controller("MenuCtrl", function ($scope, Menu) {
    $scope.items = Menu.query();
    $scope.activeid = -1;
    $scope.v = '0.01';
});


app.controller("CandidateListCtrl", function ($scope, CandidateDATA) {
    $scope.list = CandidateDATA.query();
});

//app.controller("CandidateInfoCtrl", function ($scope, $location) {
//    console.log($location);
//});

function CandidateInfoCtrl($scope, $route, $routeParams, CandidateDATA) {
    var id = $routeParams.candidateid;
    $scope.model = CandidateDATA.get({ id: id });
};

function ProjectListCtrl($scope, $route, $routeParams, ProjectDATA) {
    $scope.grid = { columns: [{ "Name": "", "Type": "cellCheckBox" }, { "Name": "Id", "Type": "cellId" }, { "Name": "Name", "Type": "cellName" }, { "Name": "Published", "Type": "cellNumber" }, { "Name": "Candidates", "Type": "cellNumber" }] };


    $scope.filter = {
        q: '',
        sort: 'Id',
        desc: true,
        limit: 2,
        offset: 0
    };

    $scope.applyfilter = function (filter) {
        $scope.filter = filter;
        $scope.search();
    }

    $scope.search = function () {
        $scope.list = ProjectDATA.query($scope.filter);
    }

    $scope.search();

    $scope.delete = function () {
        var itemId = this.project.Id;
        ProjectDATA.delete({ id: itemId }, function () {
            $("#item_" + itemId).fadeOut();
        });
    }
};

function ProjectInfoCtrl($scope, $route, $routeParams, ProjectDATA) {
    var id = $routeParams.projectid;
    $scope.model = id == 0 ? {} : ProjectDATA.get({ id: id });

    $scope.Save = function () {
        if (id == 0) {
            ProjectDATA.save($scope.model, function (info) {
                $scope.setProjectId(info.Id);
                toastr.success('Project ' + info.Name + ' created')
                //console.log(info);
            });
        } else {
            ProjectDATA.update({ id: id }, $scope.model, function (info) {
                $scope.setProjectId(info.Id);
                toastr.success('Project ' + info.Name + ' saved')
                //console.log(info);
            });
        }
    };
};

function ProjectSupervisor($scope, $route, $routeParams, ProjectDATA) {
    var id = $routeParams.projectid;

    $scope.Id = id;    
    $scope.inittabs = function(id) {
        $scope.tabs = {
            dash: { v: true, ro: id == 0, a: false },
            proj: { v: true, ro: false, a: true },
            proc: { v: true, ro: id == 0, a: false },
            publ: { v: true, ro: id == 0, a: false }
        };
    }

    $scope.inittabs(id);
    $scope.enabletabs = function () { $scope.tabs.dash.ro = false; $scope.tabs.proc.ro = false; $scope.tabs.publ.ro = false; }
    $scope.setProjectId = function (id) { $scope.Id = id; $scope.inittabs(id); }
};


app.directive('mainmenu', function (Menu) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {},
        controller: function ($scope, $element) {
            var menus = $scope.menus = Menu.query();

            $scope.select = function (menuitem) {
                angular.forEach(menus, function (menuitem) {
                    menuitem.selected = false;
                });
                menuitem.selected = true;
            }

            //this.addPane = function (pane) { if (menus.length == 0) $scope.select(pane); menus.push(pane); }
        },
        template:
          '<div class="tabbable">' +
            '<ul class="nav nav-pills nav-stacked">' +
              '<li ng-repeat="menuitem in menus" ng-class="{active:menuitem.selected}">' +
                '<a href="#/{{menuitem.url}}" ng-click="select(menuitem)">{{menuitem.name}}</a>' +
              '</li>' +
            '</ul>' +            
          '</div>',
        replace: true
    };
})



app.directive("menuitem", function () {
    return {
        restrict: "E",
        replace: true,
        scope: {
            url: "@",
            name: "@",
            setactive: "&"
        },
        template: "<a href='#/{{url}}' ng-click='setactive()'>{{name}}</a>"
    }
});


app.controller("AppCtrl", function ($scope) {
    $scope.callHome = function (message) {
        alert(message + "called home!");
    }
});

app.directive("panel", function () {
    
    return {
        restrict: "E",
        transclude: true,
        scope: {
            dial: "&",
            cmessage: "@"
        },
        template: '<input type="tet" ng-model="value" />' + 
            '<div ng-transclude class="btn" ng-click="dial({message:cmessage})">call</div>'
            
    }
});



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