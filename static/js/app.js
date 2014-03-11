'use strict';

// Declare app level module which depends on filters, and services
var paymentsApp = angular.module('paymentsApp', [
  'ngRoute',
  'paymentsApp.filters',
  'paymentsApp.services',
  'paymentsApp.directives',
  'goangular'
]);

paymentsApp.config(function($goConnectionProvider) {
  $goConnectionProvider.$set('https://goinstant.net/4deb96fc5793/payments');
})
