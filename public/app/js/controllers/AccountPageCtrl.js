'use strict';

angular.module('resultsonair.controllers').
	controller('AccountPageCtrl', function($scope, $rootScope, $element, $modal){

		$scope.openEditUsernameModal = function()
		{
			var modalInstance = $modal.open({
				templateUrl: 'editUsernameModalContent',
		        controller: 'EditUserInfoModalInstanceCtrl',
				backdrop: true,
		        resolve: {
		          inputs: function () {
		            return {value: $rootScope.currentUser.username};
		          }
		        }
			});

			modalInstance.result.then(function (result) {
		        $rootScope.currentUser.username = result.value;
		    }, function () {
		        console.log('Modal dismissed at: ' + new Date());
		    });
		};

		$scope.openEditEmailModal = function()
		{
			var modalInstance = $modal.open({
				templateUrl: 'editEmailModalContent',
		        controller: 'EditUserInfoModalInstanceCtrl',
				backdrop: true,
		        resolve: {
		          inputs: function () {
		            return {value: $rootScope.currentUser.email};
		          }
		        }
			});

			modalInstance.result.then(function (result) {
		        $rootScope.currentUser.email = result.value;
		    }, function () {
		        console.log('Modal dismissed at: ' + new Date());
		    });
		};

		$scope.openEditPasswordModal = function()
		{
			var modalInstance = $modal.open({
				templateUrl: 'editPasswordModalContent',
		        controller: 'EditUserInfoModalInstanceCtrl',
				backdrop: true,
		        resolve: {
		          inputs: function () {
		            return {value: $rootScope.currentUser.password};
		          }
		        }
			});

			modalInstance.result.then(function (result) {
		        $rootScope.currentUser.password = result.value;
		    }, function () {
		        console.log('Modal dismissed at: ' + new Date());
		    });
		};
	});