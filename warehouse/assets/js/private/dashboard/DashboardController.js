angular.module('DashboardModule').controller('DashboardController', ['$scope', '$http', 'toastr', '$modal', '$timeout', '$http', 'SweetAlert', 'lodash',
  function ($scope, $http, toastr, $modal, $timeout, $http, SweetAlert, lodash) {

    $scope.orders = [];
    $scope.displayDispatched = false;

    (function tick() {
      $http.get('/orders').
        success(function (data, status, headers, config) {
          console.log($scope.displayDispatched);
          if ($scope.displayDispatched) {
            $scope.orders = data;
          } else {
            $scope.orders = lodash.filter(data, function (order) {
              return !order.dispatchDate;
            });
          }

          $timeout(tick, 1800);
        }).
        error(function (data, status, headers, config) {
          console.log("Error in GET /orders", data, status, headers);
          $timeout(tick, 10000);
        });
    })();

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

    $scope.dispatchOrder = function (order) {

      $http.patch('/orders/' + order.id).
        success(function (data, status, headers, config) {
          SweetAlert.swal("Success", "Order " + order.id + " (#" + order.storeOrderId + ") dispatched!", "success")
        }).
        error(function (data, status, headers, config) {
          console.log("Error in PATCH /orders/" + order.id, data, status, headers);
        });
    };
  }]);

angular.module('DashboardModule').controller('OrderDetailsController', ['$scope', '$modalInstance', '$http', 'order', 'SweetAlert',
  function ($scope, $modalInstance, $http, order, SweetAlert) {
    $scope.order = order;

    $scope.dispatch = function () {

      $http.patch('/orders/' + $scope.order.id).
        success(function (data, status, headers, config) {
          SweetAlert.swal("Success", "Order " + $scope.order.id + " (#" + $scope.order.storeOrderId + ") dispatched!", "success")
        }).
        error(function (data, status, headers, config) {
          console.log("Error in PATCH /orders/" + order.id, data, status, headers);
        });

      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }]);
