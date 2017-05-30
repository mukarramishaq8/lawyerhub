/**
 * AngularJS module to process a form.
 */
angular.module('myApp', ['ajoslin.promise-tracker'])
  .controller('signup', function ($scope, $http, $log, promiseTracker, $timeout,$location) {
    

    // Inititate the promise tracker to track form submissions.
    $scope.progress = promiseTracker();

    // Form submit handler.
    $scope.submit = function(form) {
      // Trigger validation flag.
      $scope.submitted = true;

      // If form is invalid, return and let AngularJS show validation errors.
      if (form.$invalid) {
        return;
      }
      
      //set type of user
      var path = $location.absUrl();
      if(path.indexOf('lawyer')!== -1){
      	$scope.type = 'lawyer'
      }
      else{
      	$scope.type = 'client'
      }
      // Default values for the request.
      var config = {
        params : {
          'callback' : 'JSON_CALLBACK',
          'firstname' : $scope.firstname,
          'lastname' : $scope.lastname,
          'email' : $scope.email,
          'password': $scope.password,
          'userType': $scope.type,
        },
      };

      // Perform JSONP request.
      var $promise = $http.get('/createAccount', config)
        .success(function(data, status, headers, config) {
        	console.log(data);console.log(status);console.log(config);
          if (data.status == 'OK') {
            $scope.firstname = null;
            $scope.lastname = null;
            $scope.email = null;
            $scope.password = null;
            $scope.userType = null;
            //$scope.messages = 'Your form has been sent!';
            $scope.messages = data.msg;
            $scope.submitted = false;
          } else {
            //$scope.messages = 'Oops, we received your request, but there was an error processing it.';
            $scope.messages = data.msg;
            $log.error(data);
          }
        })
        .error(function(data, status, headers, config) {
        	console.log(data);console.log(status);console.log(config);
          $scope.progress = data;
          
          //$scope.messages = 'There was a network error. Try again later.';
          $scope.messages = data.msg;
          $log.error(data);
        })
        .finally(function() {
          // Hide status messages after three seconds.
          $timeout(function() {
            $scope.messages = null;
          }, 3000);
        });

      // Track the request and show its progress to the user.
      $scope.progress.addPromise($promise);
    };
  });