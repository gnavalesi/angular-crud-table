// Begin: ExampleController
/* global app */

function ExampleController($scope, ExampleService) {
    $scope.show = false;
    $scope.serviceMessage = ExampleService.getMessage();
    
    $scope.columns = [{
        name: 'Column 1'
    }, {
        name: 'Column 2'
    }];

	$scope.objects = [{

	}];

	$scope.service = null;

	
}

app.controller('ExampleController', ['$scope', 'ExampleService', ExampleController]);

// End: ExampleController