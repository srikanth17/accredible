var myApp = angular.module('myApp',[]);

myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {

    $scope.error = false;
    $scope.certificates = [];

    $scope.addCredential = function() {
        var url = $scope.url;
        $scope.spinningWheel = true;
        $scope.showError = false;
        $http.get('/get-url?url=' + url).then(function (data) {
            $scope.spinningWheel = false;
            var certs = data.data.certficates;
            if(certs == null) {
                $scope.spinningWheel = false;
                $scope.showError = true;
                $scope.errorMessage = 'Not Valid URL';
            } else {
                $scope.certificates = $scope.certificates.concat(certs);
                $scope.url = '';
            }
        });
    };
}]);