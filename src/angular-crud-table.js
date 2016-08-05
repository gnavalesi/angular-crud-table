/* global angular */

var scripts = document.getElementsByTagName("script"),
	src = scripts[scripts.length - 1].src;

function CRUDTableDirective() {
	return {
		restrict: 'E',
		scope: {
			message: '@',
			columns: '='
		},
		templateUrl: src.replace('.js', '.html')
	};
}

var module = angular.module('crudTable', ['ngMaterial']);

module.directive('crudTable', CRUDTableDirective);