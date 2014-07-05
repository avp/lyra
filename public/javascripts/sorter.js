angular.module('Lyra', [])
  .controller('LyraController', function($scope, $http) {
    $scope.decisionCount = 0;

    $scope.decide = function(winner, loser) {
      $scope.decision = null;
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
    });
  });
