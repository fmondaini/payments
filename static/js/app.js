'use strict';

// Declare app level module which depends on filters, and services
var paymentsApp = angular.module('paymentsApp', [
  'ngRoute',
  'paymentsApp.filters',
  'paymentsApp.services',
  'paymentsApp.directives'
]);
