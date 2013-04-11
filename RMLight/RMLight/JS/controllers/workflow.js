function WorkflowListCtrl($scope, $route, $routeParams, WorkflowDATA) {
    $scope.list = ProjectDATA.query();
};