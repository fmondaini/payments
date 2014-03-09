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


    var charge = function(token){

      $http({method: 'POST', url: '/charge', data:{'stripeToken': token}}).
        success(function(data, status, headers, config) {
          console.log('sucesso');
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
        charge(token);
      }
    };

    $scope.newPayment = function(){
      if($scope.validateCard()){
        Stripe.card.createToken($scope.payment, stripeResponseHandler);
      }
      
    }
  }
);
