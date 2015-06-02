angular.module('SignupModule').controller('SignupController', ['$scope', '$http', 'toastr', function ($scope, $http, toastr) {

  // set-up loading state
  $scope.signupForm = {
    loading: false
  };

  $scope.submitSignupForm = function () {

    // Set the loading state (i.e. show loading spinner)
    $scope.signupForm.loading = true;

    // Submit request to Sails.
    $http.post('/signup', {
      name: $scope.signupForm.name,
      description: $scope.signupForm.description,
      email: $scope.signupForm.email,
      password: $scope.signupForm.password
    })
      .then(function onSuccess(sailsResponse) {
        window.location = '/';
      })
      .catch(function onError(sailsResponse) {

        // Handle known error type(s).
        // If using sails-disk adapter -- Handle Duplicate Key
        var emailAddressAlreadyInUse = sailsResponse.status === 409;

        if (emailAddressAlreadyInUse) {
          toastr.error('That email address has already been taken, please try again.', 'Error');
          return;
        }

        toastr.error('An unexpected error occurred, please try again.', 'Error');
      })
      .finally(function eitherWay() {
        $scope.signupForm.loading = false;
      })
  }
}]);
