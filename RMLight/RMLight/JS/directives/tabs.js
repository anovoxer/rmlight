//angular.module('components', []).
  app.directive('tabs', function () {
      return {
          restrict: 'E',
          transclude: true,
          scope: {},
          controller: function ($scope, $element) {
              var panes = $scope.panes = [];

              $scope.select = function (pane) {
                  if (pane.ro) { return; }
                  angular.forEach(panes, function (pane) {
                      pane.selected = false;
                  });
                  pane.selected = true;
              }

              this.addPane = function (pane) {
                  //if (panes.length == 0) $scope.select(pane);
                  panes.push(pane);
              }
          },

          template: '<div class="row"><div class="columns large-2 sideMenu">' +
                        '<ul class="side-nav">' + 
                            '<li class="divider"></li>' + 
                            //'<li class="active"><a href="project_info.html">Info</a></li>' + 
                            '<li ng-repeat="pane in panes" ng-class="{active:pane.selected, disabled:pane.ro, hide:!pane.visible}" >' +
                            '<a href="" ng-click="select(pane)">{{pane.title}}</a>' +
                            '</li>' +
                        '</ul>' +            
                    '</div>' +
                    '<div class="columns large-10 cntrWrapper"><hr><div class="navPan" ng-transclude></div></div>' +
                    '</div>',

          template_old:
            '<div class="tabbable">' +
              '<ul class="nav nav-tabs">' +
                '<li ng-repeat="pane in panes" ng-class="{active:pane.selected, disabled:pane.ro, hide:!pane.visible}" >' +
                  '<a href="" ng-click="select(pane)">{{pane.title}}</a>' +
                '</li>' +
              '</ul>' +
              '<div class="tab-content" ng-transclude></div>' +
            '</div>',
          replace: true
      };
  }).
  directive('pane', function () {
      return {
          require: '^tabs',
          restrict: 'E',
          transclude: true,
          scope: {
              title: '@',
              visible: '=',
              ro: '=',
              selected: '='
          },
          link: function (scope, element, attrs, tabsCtrl1) {
              tabsCtrl1.addPane(scope);
          },
          template:
            '<div class="tabPane" ng-class="{active: selected, hide: !selected}" ng-transclude>' +
            '</div>',

          template_old:
            '<div class="tab-pane" ng-class="{active: selected, hide: !selected}" ng-transclude>' +
            '</div>',
          replace: true
      };
  })