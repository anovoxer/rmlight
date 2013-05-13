'use strict'

var pages = {
    home: { name: "home", url: "#/home" },
    projects: { name: "projects", url: "#/projects" },
    projectinfo: { name: "{projectname}", url: "#/projects/info/:projectid" },
    projectdash: { name: "dashboard", url: "#/projects/dashboard/:projectid" },
    projectpublish: { name: "publishing", url: "#/projects/publishing/:projectid" },
    projectprocedure: { name: "procedure", url: "#/projects/procedure/:projectid" },
    projectcandidates: { name: "applications", url: "#/projects/:projectid/candidates" },
    projectapplicationinfo: { name: "application", url: "#/projects/:projectid/candidates/:candidateid" }
};

var paths = {
    projects: [pages.home, pages.projects],
    projectsinfo: [pages.home, pages.projects, pages.projectinfo],
    projectdash: [pages.home, pages.projects, pages.projectinfo, pages.projectdash],
    projectcandidates: [pages.home, pages.projects, pages.projectinfo, pages.projectcandidates],
    projectapplicationinfo: [pages.home, pages.projects, pages.projectinfo, pages.projectcandidates, pages.projectapplicationinfo]
};

//var app = angular.module("ReachmeeLightApp", ['ngResource', 'components']);
var app = angular.module("ReachmeeLightApp", ['ngResource', 'ui', 'ui.bootstrap', 'services.breadcrumbs']);

app.constant('configuration', {
    ITEMS_URL: '../js/items.json'
});

app.config(['$routeProvider', function ($routeProvider) {
      $routeProvider.
          when('/home', { templateUrl: 'partials/rm-dashboard.html', controller: null }).

          when('/projects/:projectid', { templateUrl: 'partials/rm-project.html', controller: ProjectSupervisor }).
          when('/projects', { templateUrl: 'partials/rm-project-list.html', controller: ProjectListCtrl, bread: paths.projects }).
          when('/projects/dashboard/:projectid', { templateUrl: 'partials/rm-project-dashboard.html', controller: null, bread: paths.projectdash }).
          when('/projects/info/:projectid', { templateUrl: 'partials/rm-project-info.html', controller: ProjectInfoCtrl, bread: paths.projectsinfo }).
          when('/projects/info/:projectid/edit', { templateUrl: 'partials/rm-project-info-edit.html', controller: ProjectInfoCtrl, bread: paths.projectsinfo }).
          when('/projects/procedure/:projectid', { templateUrl: 'partials/rm-project-procedure.html', controller: null }).
          when('/projects/publishing/:projectid', { templateUrl: 'partials/rm-project-publishing.html', controller: null }).
          when('/projects/:projectid/candidates', { templateUrl: 'partials/rm-project-candidates.html', controller: ApplicationListCtrl, bread: paths.projectcandidates }).
          when('/projects/:projectid/candidates/:applicationid', { templateUrl: 'partials/rm-project-candidate.html', controller: ApplicationInfoCtrl, bread: paths.projectapplicationinfo }).
          when('/projects/:projectid/candidates/:applicationid/edit', { templateUrl: 'partials/rm-project-candidate-add.html', controller: ApplicationInfoCtrl, bread: paths.projectapplicationinfo }).

          //when('/project/create', { templateUrl: 'partials/rm-project.html',  param:{projectid:1}, controller: ProjectCreateCtrl }).
          when('/candidates', { templateUrl: 'partials/rm-candidates.html', controller: null }).
          when('/candidates/:candidateid', { templateUrl: 'partials/rm-candidate-info.html', controller: CandidateInfoCtrl }).
          when('/candidates/:candidateid/edit', { templateUrl: 'partials/rm-candidate-edit.html', controller: CandidateInfoCtrl }).
          when('/management', { templateUrl: 'partials/rm-management.html', controller: null }).
          when('/analytics', { templateUrl: 'partials/rm-analytics.html', controller: null }).
          when('/help', { templateUrl: 'partials/rm-help.html', controller: null }).
          when('/hi').
          otherwise({ redirectTo: '/home' });
  }]);


/**
/* Menu section. Menu provider to get list of menu items regarding to security rights for user and other settings
*/

app.factory('Menu', function ($resource) {
    return $resource('../js/items.json');
});

app.factory('CandidateDATA', function ($resource) {
    return $resource('/api/candidate/:id', { id: '@id' },
            { update: { method: 'PUT' },
            createapp: { method: 'POST', params: { candidateId: '@candidateId', projectId: '@projectId' }, isArray: true } 
            });
});

app.factory('ProjectDATA', function ($resource) {
    return $resource('/api/project/:id', { id: '@id' }, {
        update: { method: 'PUT' },
        getpagecount: { method: 'GET', params: { returncount: true }, isArray: false },
        getbycandidateid: { method: 'GET', params: { returncount: true }, isArray: false }
    });
});

app.factory('ApplicationDATA', function ($resource) {
    return $resource('/api/application/:id', { id: '@id' }, { update: { method: 'PUT' }, getpagecount: { method: 'GET', params: { returncount: true }, isArray: false } });
});

app.factory('WorkflowDATA', function ($resource) {
    return $resource('/api/workflow/:id', { id: '@id' });
});

app.factory('CustomerDATA', function ($resource) {
    return $resource('/api/customer/:id', { id: '@id' }, { check: { method: 'GET', isArray: false } });
});

app.factory('SecurityDATA', function ($resource) {
    return $resource('/api/security/:id', { id: '@id' }, { logout: { method: 'GET', params: { action: 'logout'} } });
});

app.factory('DataContainer', function () {
    return {
        projectname: '',
        candidatename: ''
    };
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

function SecurityCtrl($scope, $route, $routeParams, SecurityDATA) {
    $scope.model = SecurityDATA.get();
    //console.log($scope.model);
    $scope.logout = function () { SecurityDATA.logout({}, function () { console.log("done logout"); window.location = "/"; }); }
};

function CandidateInfoCtrl($scope, $route, $routeParams, $location, CandidateDATA, ProjectDATA) {
    var id = $routeParams.candidateid;
    $scope.candidate = id == 0 ? {} : CandidateDATA.get({ id: id });
    $scope.projectslist = [];

    $scope.Save = function () {
        if (id == 0) {
            CandidateDATA.save($scope.candidate, function (info) {
                $location.path("/candidates/" + info.Id);
                toastr.success('Candidate ' + info.Name + ' created');
            });
        } else {
            CandidateDATA.update({ id: id }, $scope.candidate, function (info) {
                $location.path("/candidates/" + info.Id);
                toastr.success('Candidate ' + info.Name + ' saved');
            });
        }
    };

    $scope.Cancel = function () {
        $location.path("/candidates" + ($scope.candidate.Id > 0 ? "/" + $scope.candidate.Id : ""));
    };

    $scope.Delete = function () {
        var confirm = window.confirm("Remove candidate information?");
        if (confirm) {
            CandidateDATA.delete({ id: $scope.candidate.Id }, function (info) {
                $location.path("/candidates");
                toastr.success('Candidate ' + info.Name + ' was removed from system.');
            });
        };
    };

    $scope.PopulateProjects = function () {
        $scope.projectslist = ProjectDATA.query();
    };

    $scope.ApplyCandidateToPorject = function (projectId) {
        CandidateDATA.createapp({ candidateId: $scope.candidate.Id, projectId: projectId }, function (info) {
            toastr.success('Candidate ' + $scope.candidate.Name + ' ' + $scope.candidate.LastName + ' application was added to project.');
        });
    };
};

function ProjectListCtrl($scope, $route, $routeParams, ProjectDATA) {
    $scope.grid = { columns: [{ "Name": "", "Type": "cellCheckBox" }, { "Name": "Id", "Type": "cellId" }, { "Name": "Name", "Type": "cellName" }, { "Name": "Published", "Type": "cellNumber" }, { "Name": "Candidates", "Type": "cellNumber" }] };


    $scope.filter = {
        q: '',
        sort: 'Id',
        desc: true,
        limit: 10,
        offset: 0
    };

    $scope.applyfilter = function (filter) {
        $scope.filter = filter;
        $scope.search(true);
    }

    $scope.search = function (resetpage) {
        $scope.list = ProjectDATA.query($scope.filter, function () { $scope.fmenu.init(); });
        $scope.pagesCount = ProjectDATA.getpagecount($scope.filter, function (v) { $scope.pagesCount = v.Count; });
        if (resetpage) { $scope.currentPage = 1; }
    }

    $scope.search(false);

    $scope.delete = function () {
        var itemId = this.project.Id;
        ProjectDATA.delete({ id: itemId }, function () {
            $("#item_" + itemId).fadeOut();
        });
    }

    //* top functional menu:
    // TODO: separate as a directive with own controller.
    $scope.fmenu = {
        func: { active: false, click: function () { if (!$scope.fmenu.func.active) { return; } alert("func"); }},
        move: { active: false, click: function () { if (!$scope.fmenu.move.active) { return; } alert("move"); } },
        lock: { active: false, click: function () { if (!$scope.fmenu.lock.active) { return; } alert("lock"); } },

        init: function () {
            $scope.fmenu.move.active = false;
            $scope.fmenu.lock.active = false;
            $scope.fmenu.func.active = false;
            angular.forEach($scope.list, function (v) {
                if (v.selected) {
                    $scope.fmenu.move.active = true;
                    $scope.fmenu.lock.active = true;
                    $scope.fmenu.func.active = true;
                }
            });
        }
    }

    //* pager:
    $scope.pagesCount = 1;
    $scope.currentPage = 1;

    $scope.$watch('currentPage', function () {
        $scope.filter.offset = ($scope.currentPage - 1) * $scope.filter.limit;
        $scope.search(false);
    });
};


function ApplicationListCtrl($scope, $route, $routeParams, ApplicationDATA) {

    $scope.projectId = $routeParams.projectid;

    $scope.filter = {
        q: '',
        projectId: $routeParams.projectid
    };

    $scope.search = function () {
        $scope.list = ApplicationDATA.query($scope.filter);
    }

    $scope.search();

    $scope.remove = function (info) {
       // alert(info.applicant.Id);
        ApplicationDATA.delete({ id: info.applicant.Id }, function () {
            $("#_i_" + info.applicant.Id).fadeOut(function () { $scope.search(); });
        });
        
        //var itemId = this.project.Id;
        //ProjectDATA.delete({ id: itemId }, function () {
        //    
        //});
    }
};

function ApplicationInfoCtrl($scope, $route, $routeParams, $location, ApplicationDATA) {
    var id = $routeParams.applicationid;

    $scope.projectId = $routeParams.projectid;
    $scope.applicationId = $routeParams.applicationid;

    $scope.model = id == 0 ? {} : ApplicationDATA.get({ id: id }, function (data) { /**/ });

    $scope.Save = function () {
        if (id == 0) {
            ApplicationDATA.save($scope.model, function (info) {
                $location.path("/projects/" + $scope.projectId + "/candidates/" + $scope.applicationId);
                toastr.success('Application ' + info.Name + ' created.')
            });
        } else {
            ApplicationDATA.update({ id: id }, $scope.model, function (info) {
                $location.path("/projects/" + $scope.projectId + "/candidates/" + $scope.applicationId);
                toastr.success('Application ' + info.Name + ' saved.')
            });
        }
    };

    $scope.Cancel = function () {
        $location.path("/projects/" + $scope.projectId + "/candidates/" + $scope.applicationId);
    };

    $scope.Delete = function () {
        var confirm = window.confirm("Remove project information?");
        if (confirm) {
            ProjectDATA.delete({ id: $scope.model.Id }, function (info) {
                $location.path("/projects");
                toastr.success('Project ' + info.Name + ' was removed from system.');
            });
        };
    };

};





function ProjectInfoCtrl($scope, $route, $routeParams, $location, ProjectDATA, DataContainer) {
    var id = $routeParams.projectid;
    $scope.model = id == 0 ? {} : ProjectDATA.get({ id: id }, function (data) { $scope.GlobalController.projectname = data.Name; });

    $scope.Save = function () {
        if (id == 0) {
            ProjectDATA.save($scope.model, function (info) {
                //$scope.setProjectId(info.Id);
                $location.path("/projects/info/" + info.Id);
                toastr.success('Project ' + info.Name + ' created')
            });
        } else {
            ProjectDATA.update({ id: id }, $scope.model, function (info) {
                //$scope.setProjectId(info.Id);
                $location.path("/projects/info/" + info.Id);
                toastr.success('Project ' + info.Name + ' saved')
            });
        }
    };

    $scope.Cancel = function () {
        $location.path("/projects" + ($scope.model.Id > 0 ? "/info/" + $scope.model.Id : ""));
    };

    $scope.Delete = function () {
        var confirm = window.confirm("Remove project information?");
        if (confirm) {
            ProjectDATA.delete({ id: $scope.model.Id }, function (info) {
                $location.path("/projects");
                toastr.success('Project ' + info.Name + ' was removed from system.');
            });
        };
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



function stopevent(e) { var e = e ? e : window.event; e.preventDefault(); e.stopPropagation(); return false; };