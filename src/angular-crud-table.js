/* global angular */

var scripts = document.getElementsByTagName("script"),
	src = scripts[scripts.length - 1].src;

function CRUDTableDirectiveController($scope) {
	$scope.columns = angular.copy($scope.ngModel.columns);
	$scope.objects = angular.copy($scope.ngModel.objects);
	$scope.shownObjects = [];

	function findColumnById(id) {
		return $scope.columns.find(function(column) {
			return column.id === id;
		});
	}

	/*
	 * Order Section
	 */

	// An object to keep the order settings
	$scope.orderBy = {
		id: null,
		reverse: null
	};

	// A function that returns the value or 'sort value' of an object field
	$scope.order = function(a) {
		if($scope.orderBy.id !== null) {
			var column = findColumnById($scope.orderBy.id);
			if(column !== null && column.sort !== undefined) {
				return column.sort(a[$scope.orderBy.id]);
			}
		}

		return a[$scope.orderBy.id];
	};

	// A function that sets the new order settings based on a column
	$scope.changeOrder = function (column) {
		if (column.sortable !== false) {
			if ($scope.orderBy.id && $scope.orderBy.id === column.id) {
				$scope.orderBy.reverse = !$scope.orderBy.reverse;
			} else {
				$scope.orderBy = {
					id: column.id,
					reverse: false
				};
			}
		}
	};

	/*
	 * Page Section
	 */

	// An object to keep the page settings
	$scope.page = {
		objectsPerPage: 10,
		current: 1,
		total: Math.floor($scope.objects.length / 10) + 1
	};

	// A function that calculates the new value of $scope.page.total based on the 'quantity' argument
	// or $scope.objects.length by default
	$scope.calculateTotal = function(quantity) {
		if(!quantity) {
			quantity = $scope.objects.length;
		}

		$scope.page.total = Math.floor(quantity / $scope.page.objectsPerPage) + 1;
		$scope.page.current = Math.min($scope.page.current, $scope.page.total);
	};

	// A function that returns whether an index is in the current page 
	$scope.inCurrentPage = function(index) {
		return index >= ($scope.page.current - 1) * $scope.page.objectsPerPage && index < $scope.page.current * $scope.page.objectsPerPage;
	};

	// Let's watch changes in $scope.page.objectsPerPage to calculate the new $scope.page.total
	$scope.$watch('page.objectsPerPage', function() {
		$scope.calculateTotal($scope.shownObjects.length);
	}, true);

	// Let's watch changes in $scope.shownObjects.length to calculate the new $scope.page.total
	$scope.$watch('shownObjects.length', function() {
		$scope.calculateTotal($scope.shownObjects.length);
	}, true);


	
	/*
	 * Filter Section
	 */

	// An object to keep the current filter values
	$scope.filters = {};

	$scope.$watch('filters', function() {
		Object.keys($scope.filters).forEach(function(key) {
			if($scope.filters[key] === '' || $scope.filters[key] === null) {
				$scope.filters[key] = undefined;
			}
		})
	}, true);

	/*
	 * Controllers Section
	 */

	$scope.controllers = {
		showFilters: false
	};
}

function CRUDTableDirective() {
	return {
		restrict: 'E',
		scope: {
			ngModel: '='
		},
		templateUrl: src.replace('.js', '.html'),
		controller: CRUDTableDirectiveController
	};
}

var module = angular.module('crudTable', ['ngMaterial']);

module.directive('crudTable', CRUDTableDirective);