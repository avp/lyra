angular.module('Sorter', [])
  .controller('SortController', function($scope, $http, $q) {
    $scope.decisionCount = 0;

    $scope.decide = function(winner, loser) {
      $http.post('/decide', {
        winner: winner._id,
        loser: loser._id
      })
        .then(function() {
          $http.get('/decide')
            .success(function(decision) {
              $scope.decision = decision;
            });
        })
    };

    $http.get('/decide').success(function(decision) {
      $scope.decision = decision;
    })
  });
