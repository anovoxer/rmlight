//angular.module('components', []).
  app.directive('workflow', function (WorkflowDATA) {
      return {
          restrict: 'E',
          scope: {
              projectid: '@',
              candidateid: '@'
          },
          controller: function ($scope, $element) {
              var panes = $scope.panes = WorkflowDATA.query();
          },
          template:
            '<div class="tabbable">' +
                '<div>workflow control</div>' +
            '</div>',
          replace: true
      };
  }).
  directive('pane222', function () {
      return {
          require: '^workflow',
          restrict: 'E',
          transclude: true,
          scope: { title: '@' },
          link: function (scope, element, attrs, tabsCtrl) {
              tabsCtrl.addPane(scope);
          },
          template:
            '<div class="tab-pane" ng-class="{active: selected}" ng-transclude>' +
            '</div>',
          replace: true
      };
  })