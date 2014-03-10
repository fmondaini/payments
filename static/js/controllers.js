'use strict';

paymentsApp.controller('PaymentsController',
  function PaymentsController($scope, $http){
    $scope.validateCard = function(){
      var is_valid = true;

      // TODO: Change this validation. it's ugly.
      is_valid = $.payment.validateCardNumber($scope.payment.number)
      is_valid = $.payment.validateCardExpiry($scope.payment.exp_month, $scope.payment.exp_year)
      is_valid = $.payment.validateCardCVC($scope.payment.cvc)

      return is_valid
    }

    var subscribe = function(token, plan, email){
      $http({method: 'POST', url: '/subscribe', data: {
        'stripeToken': token,
        'plan': plan,
        'email': email}}).
        success(function(data, status, headers, config) {
          window.location.reload();
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
        $form.append($('<input type="hidden" name="stripeToken" />').val(token));

        // Charge
        subscribe(token, $scope.payment.plan, $scope.payment.email);
      }
    };

    $scope.newPayment = function(){
      if($scope.validateCard()){
        Stripe.card.createToken($scope.payment, stripeResponseHandler);
        $scope.payments = {}
      }
      
    }
  }
)

.controller('CustomerController',
  function CustomerController($scope, $http){
    $scope.getPurchaseHistory = function () {
      $http({method: 'POST', url: '/get_history', data:{'customer_id': $scope.customer.id}}).
      success(function(data, status, headers, config) {
        $scope.customer = data;
      }).
      error(function(data, status, headers, config) {
        console.log(data);
      });
    }
  }
);
