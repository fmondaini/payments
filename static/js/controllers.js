'use strict';

paymentsApp
  .controller('PaymentsController',
    function PaymentsController($scope, $http) {
      $scope.validateCard = function() {
        var is_valid = true;

        // TODO: Change this validation. it's ugly.
        is_valid = $.payment.validateCardNumber($scope.payment.number)
        is_valid = $.payment.validateCardExpiry($scope.payment.exp_month, $scope.payment.exp_year)
        is_valid = $.payment.validateCardCVC($scope.payment.cvc)

        return is_valid
      }

      var subscribe = function(token, plan, email) {
        $http({
          method: 'POST',
          url: '/subscribe',
          data: {
            'stripeToken': token,
            'plan': plan,
            'email': email
          }
        }).
        success(function(data, status, headers, config) {
          $scope.payment = {};
          alert('Success!');
        }).
        error(function(data, status, headers, config) {
          console.log(data);
        });
      }

      var stripeResponseHandler = function(status, response) {
        var $form = $('#payment-form');

        if (response.error) {
          // Show the errors on the form
          $form.find('.payment-errors').text(response.error.message);
          $form.find('button').prop('disabled', false);
        } else {
          // Token
          var token = response.id;

          // Charge
          subscribe(token, $scope.payment.plan, $scope.payment.email);
        }
      };

      $scope.newPayment = function() {
        if ($scope.validateCard()) {
          Stripe.card.createToken($scope.payment, stripeResponseHandler);
        }

      }
    }
)

.controller('CustomerController',
  function CustomerController($scope, $http) {
    $scope.getPurchaseHistory = function() {
      $http({
        method: 'POST',
        url: '/get_history',
        data: {
          'customer_id': $scope.customer.id
        }
      }).
      success(function(data, status, headers, config) {
        $scope.customer_data = data;
      }).
      error(function(data, status, headers, config) {
        console.log(data);
      });
    }
  }
)

.controller('SignupController',
  function SignupController($scope, $http, $goKey, $goConnection) {
    $goConnection.$ready().then(function(connection) {
      return connection.room('lobby').join().get('users');
    })
      .then(function(room) {


        $scope.users = $goKey('users', 'lobby');
        $scope.users.$sync();

        var new_customer = function() {
          $http({
            method: 'POST',
            url: '/customer/new',
            data: {
              'email': $scope.new_user.email
            }
          }).
          success(function(data, status, headers, config) {
            $scope.new_user.id = data.customer_id;
            console.log('Customer Created!');
          }).
          error(function(data, status, headers, config) {
            console.log(data);
          });
        }

        $scope.signup = function() {
          new_customer(); //customer_id is not being added, maybe because this is not a synchronous call.

          $scope.users.$add($scope.new_user)
            .then(
              function(result) {
                alert('New user registered');
                $scope.new_user = {};
              },
              function(err) {
                console.log(err);
              }
          );
        };


      })
      .
    catch (function(err) {
      console.log(data);
    });


  }
  //End SignupController function
)

.controller('LoginController',
  function LoginController($scope, $http) {}
);