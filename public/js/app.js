// See LICENSE.MD for license information.

var app = angular.module('MEANapp', ['ngRoute', 'ngStorage', 'ui.grid']);

/*********************************
 Controllers
 *********************************/

app.controller('HeaderController', function($scope, $localStorage, $sessionStorage, $location, $http){

    // Set local scope to persisted user data
    $scope.user = $localStorage;

    // Logout function
    $scope.logout = function(){
        $http({
            method: 'GET',
            url: '/account/logout'
        })
            .success(function(response){
                alert(response);
                $localStorage.$reset();
                $location.path('/');
            })
            .error(function(response){
                alert(response);
                $location.path('/account/login');
            }
        );
    };
});


app.controller('AdministrationController', function($scope, $localStorage, $sessionStorage, $http, $location){});

app.controller('HomeController', function($scope, $localStorage, $sessionStorage){});

app.controller('LoginController', function($scope, $localStorage, $sessionStorage, $location, $http){

    // Login submission
    $scope.submitLogin = function(){

        // Login request
        $http({
            method: 'POST',
            url: '/account/login',
            data: {
                    'username': $scope.loginForm.username,
                    'password': $scope.loginForm.password
                }
            })
            .success(function(response){
                // $localStorage persists data in browser's local storage (prevents data loss on page refresh)
                $localStorage.status = true;
                $localStorage.user = response;
                $localStorage.admin = ($scope.loginForm.username == "Administrator");
                $location.path('/');
            })
            .error(function(){
                alert('Login failed. Check username/password and try again.');
            }
        );
    };

    // Redirect to account creation page
    $scope.createAccount = function(){
        $location.path('/account/create');
    }
});

app.controller('CreateAccountController', function($scope, $localStorage, $sessionStorage, $http, $location){

    // Create account
    $scope.submitForm = function(){
        $http({
            method: 'POST',
            url: '/account/create',
            data: {
                    'username': $scope.newUser.username,
                    'password': $scope.newUser.password,
                    'name' : $scope.newUser.name,
                    'email' : $scope.newUser.email
                }
            })
            .success(function(response){
                alert(response);
                $location.path('/account/login');
            })
            .error(function(response){
                // When a string is returned
                if(typeof response === 'string'){
                    alert(response);
                }
                // When array is returned
                else if (Array.isArray(response)){
                    // More than one message returned in the array
                    if(response.length > 1){
                        var messages = [],
                            allMessages;
                        for (var i = response.length - 1; i >= 0; i--) {
                            messages.push(response[i]['msg']);
                            if(response.length == 0){
                                allMessages = messages.join(", ");
                                alert(allMessages);
                                console.error(response);
                            }
                        }
                    }
                    // Single message returned in the array
                    else{
                        alert(response[0]['msg']);
                        console.error(response);
                    }
                }
                // When something else is returned
                else{
                    console.error(response);
                    alert("See console for error.");
                }
            }
        );

    };
});

app.controller('AccountController', function($scope, $localStorage, $sessionStorage, $http, $location){

    // Create static copy of user data for form usage (otherwise any temporary changes will bind permanently to $localStorage)
    $scope.formData = $.extend(true,{},$localStorage.user);

    // Update user's account with new data
    $scope.updateAccount = function(){
        $http({
            method: 'POST',
            url: '/account/update',
            data: {
                'username': $scope.formData.username,
                'password': $scope.password,
                'name' : $scope.formData.name,
                'email' : $scope.formData.email
            }
        })
            .success(function(response){
                $localStorage.user = $scope.formData;
                alert(response);
            })
            .error(function(response){
                // When a string is returned
                if(typeof response === 'string'){
                    alert(response);
                }
                // When an array is returned
                else if (Array.isArray(response)){
                    // More than one message returned in the array
                    if(response.length > 1){
                        var messages = [],
                            allMessages;
                        for (var i = response.length - 1; i >= 0; i--) {
                            messages.push(response[i]['msg']);
                            if(response.length == 0){
                                allMessages = messages.join(", ");
                                alert(allMessages);
                                console.error(response);
                            }
                        }
                    }
                    // Single message returned in the array
                    else{
                        alert(response[0]['msg']);
                        console.error(response);
                    }
                }
                // When something else is returned
                else{
                    console.error(response);
                    alert("See console for error.");
                }
            }
        );
    };

    // Delete user's account
    $scope.deleteAccount = function(){
        var response = confirm("Are you sure you want to delete your account? This cannot be undone!");
        if(response == true){
            $http({
                method: 'POST',
                url: '/account/delete',
                data: {
                    'username': $scope.formData.username
                }
            })
                .success(function(response){
                    $localStorage.$reset();
                    alert(response);
                    $location.path('/');
                })
                .error(function(response){
                    alert(response);
                }
            );
        }
    };
});

app.controller('ProtectedController', function($scope, $localStorage, $sessionStorage, $http, $location){

    $scope.chemicals = [];
    $scope.newChemical = {};
    updateData();
    
    // Create musician
    $scope.addData = function(){
        console.log("data upload:", $scope.newChemical);
        $http({
            method: 'POST',
            url: '/protected/create',
            data: {
                    'chemical' : $scope.newChemical.chemical,
                    'maxweight' : $scope.newChemical.maxweight,
                    'location' : $scope.newChemical.location,
                    'store' : $scope.newChemical.store
                }
            })
            .success(function(response){
                alert(response);
                $location.path('/protected');
                console.log("data upload to chemicals:", response.data);
                updateData();
            })
            .error(function(response){
                // When a string is returned
                if(typeof response === 'string'){
                    alert(response);
                }
                // When array is returned
                else if (Array.isArray(response)){
                    // More than one message returned in the array
                    if(response.length > 1){
                        var messages = [],
                            allMessages;
                        for (var i = response.length - 1; i >= 0; i--) {
                            messages.push(response[i]['msg']);
                            if(response.length == 0){
                                allMessages = messages.join(", ");
                                alert(allMessages);
                                console.error(response);
                            }
                        }
                    }
                    // Single message returned in the array
                    else{
                        alert(response[0]['msg']);
                        console.error(response);
                    }
                }
                // When something else is returned
                else{
                    console.error(response);
                    alert("See console for error.");
                }
            }
        );
        
    };

    // Drop inventory new data
    $scope.dropData = function(){
        var response = confirm("Are you sure you want to drop the data? This cannot be undone!");
        
        if(response == true){
            //$scope.chemicals.splice(0,1);
            $http({
                method: 'POST',
                url: '/protected/delete',
                data: {
                    'chemical': $scope.newChemical.chemical
                }
            })
                .success(function(response){
                    $localStorage.$reset();
                    alert(response);
                    $location.path('/protected');
                })
                .error(function(response){
                    alert(response);
                }
            );
            $scope.newChemical.chemical = "";
            $scope.newChemical.maxweight = "";
            $scope.newChemical.location = "";
            $scope.newChemical.store  = "";
        }
        
    };
    
    function updateData() {
        $http({
            method: 'GET',
            url: '/protected'
        })
            .success(function(response){
                $scope.chemicals = response;
                console.log($scope.chemicals);
            })
            .error(function(response){
                alert(response);
                $location.path('/protected');
            }
        );
    }

	$scope.startDictation = function () {

        if (window.hasOwnProperty('webkitSpeechRecognition')) {

            var recognition = new webkitSpeechRecognition();

            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.lang = "en-US";
            recognition.start();

            recognition.onresult = function(e) {
                $scope.newChemical.chemical = e.results[0][0].transcript;
                recognition.stop();
                $scope.$apply();
            };

            recognition.onerror = function(e) {
                recognition.stop();
            }

        }
    };
    
});

/*********************************
 Routing
 *********************************/
app.config(function($routeProvider) {
    'use strict';

    $routeProvider.

        //Root
        when('/', {
            templateUrl: 'views/home.html',
            controller: 'HomeController'
        }).

        //Login page
        when('/account/login', {
            templateUrl: 'views/login.html',
            controller: 'LoginController'
        }).

        //Account page
        when('/account', {
            templateUrl: 'views/account.html',
            controller: 'AccountController'
        }).

        //Create Account page
        when('/account/create', {
            templateUrl: 'views/create_account.html',
            controller: 'CreateAccountController'
        }).

		//Admin
        when('/admin', {
            templateUrl: 'views/admin.html',
            controller: 'AdministrationController'
        }).

        //Protected page
        when('/protected', {
            templateUrl: 'views/protected.html',
            controller: 'ProtectedController'
        });

});
