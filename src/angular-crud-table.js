/* global angular */

var scripts = document.getElementsByTagName("script"),
	src = scripts[scripts.length - 1].src;

function CRUDTableDirectiveController($scope) {
	$scope.columns = angular.copy($scope.ngModel.columns);
	$scope.objects = angular.copy($scope.ngModel.objects);

	/*
	 * Page Section
	 */
	$scope.page = {
		objectPerPage: 10,
		current: 1,
		total: Math.floor($scope.objects.length / 10) + 1
	};

	$scope.shouldShowObject = function(index) {
		return index >= ($scope.page.current - 1) * $scope.page.objectPerPage && index < $scope.page.current * $scope.page.objectPerPage;
	};

	$scope.calculateTotal = function(quantity) {
		if(!quantity) {
			quantity = $scope.objects.length;
		}

		$scope.page.total = Math.floor(quantity / $scope.page.objectPerPage) + 1;
		$scope.page.current = Math.min($scope.page.current, $scope.page.total);
	};

	/*
	 * Sort Section
	 */
	$scope.sortBy = {
		id: null,
		direction: null
	};

	$scope.sort = function (column) {
		if (column.sortable !== false) {
			if ($scope.sortBy.id && $scope.sortBy.id === column.id) {
				$scope.sortBy.direction = !$scope.sortBy.direction;
			} else {
				$scope.sortBy = {
					id: column.id,
					direction: true
				};
			}

			var sortFunction = column.sort;
			if (!sortFunction) {
				sortFunction = function (c) {
					return c;
				};
			}

			$scope.objects = $scope.objects.sort(function (object1, object2) {
				var a = sortFunction(object1[column.id]);
				var b = sortFunction(object2[column.id]);

				if (a < b) {
					return $scope.sortBy.direction ? -1 : 1;
				}
				if (a > b) {
					return $scope.sortBy.direction ? 1 : -1;
				}

				return 0;
			});
		}
	};
	/*
	 * Filter Section
	 */
	$scope.filters = [];

	$scope.filtered = [];
	$scope.$watch('filtered.length', function(newValue) {
		$scope.calculateTotal(newValue);
	}, true);
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