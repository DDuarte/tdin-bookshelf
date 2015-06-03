angular.module('HomepageModule').controller('HomepageController', ['$scope', '$http', 'toastr', function ($scope, $http, toastr) {

  // set-up loginForm loading state
  $scope.loginForm = {
    loading: false
  };

  $scope.submitLoginForm = function () {

    // Set the loading state (i.e. show loading spinner)
    $scope.loginForm.loading = true;

    // Submit request to Sails.
    $http.put('/login', {
      email: $scope.loginForm.email,
      password: $scope.loginForm.password
    })
      .then(function onSuccess() {
        // Refresh the page now that we've been logged in.
        window.location = '/dashboard';
      })
      .catch(function onError(sailsResponse) {

        // Handle known error type(s).
        // Invalid username / password combination.
        if (sailsResponse.status === 400 || sailsResponse.status === 404) {
          toastr.error('Invalid email/password combination.', 'Error', {
            closeButton: true
          });
          return;
        }

        toastr.error('An unexpected error occurred, please try again.', 'Error', {
          closeButton: true
        });
      })
      .finally(function eitherWay() {
        $scope.loginForm.loading = false;
      });
  };

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
        window.location = '/dashboard';
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
