angular.module('DashboardModule').controller('DashboardController', ['$scope', '$http', 'toastr', '$modal', function ($scope, $http, toastr, $modal) {

  $scope.orders = [{
    id: 1,
    date: new Date(),
    books: [{
      title: 'Some book',
      isbn: '239048234023',
      quantity: 10
    }, {
      title: 'Other book',
      isbn: '009234803243',
      quantity: 20
    }]
  }, {
    id: 2,
    date: new Date(),
    books: [{
      title: 'A book',
      isbn: '09876543',
      quantity: 1
    }]
  }, {
    id: 3,
    date: new Date(),
    books: [{
      title: 'The book',
      isbn: '23456789',
      quantity: 6
    }]
  }];

  $scope.openOrderDetails = function (order) {
    var modalInstance = $modal.open({
      animation: true,
      templateUrl: 'orderDetailsModal.html',
      controller: 'OrderDetailsController',
      resolve: {
        order: function () {
          return order;
        }
      }
    });

    modalInstance.result.then(function (selectedOrder) {
      $scope.selected = selectedOrder;
    }, function () {
      console.log('Modal dismissed at:', new Date());
    });
  };

  $scope.numberOfBooks = function (books) {
    var count = 0;
    for (var i = 0; i < books.length; ++i) {
      count += books[i].quantity;
    }

    return count;
  };
}]);

angular.module('DashboardModule').controller('OrderDetailsController', ['$scope', '$modalInstance', 'order', function ($scope, $modalInstance, order) {
  $scope.order = order;

  $scope.dispatch = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);
