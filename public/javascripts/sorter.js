angular.module('Sorter', [])
  .controller('SortController', function($scope, $http, $q) {
    $scope.decisionCount = 0;

    var merge = function(left, right) {
      left = angular.copy(left);
      right = angular.copy(right);

      var deferred = $q.defer();
      if (left.length < 1) {
        deferred.resolve(right);
        return deferred.promise;
      }
      if (right.length < 1) {
        deferred.resolve(left);
        return deferred.promise;
      }

      compare(left[0], right[0]).then(function(greater) {
        var tmp;
        if (angular.equals(left[0], greater)) {
          tmp = left.shift();
          return merge(left, right).then(function(merged) {
            merged.unshift(tmp);
            deferred.resolve(merged);
            return merged;
          });
        } else {
          tmp = right.shift();
          return merge(left, right).then(function(merged) {
            merged.unshift(tmp);
            deferred.resolve(merged);
            return merged;
          });
        }
      });

      return deferred.promise;
    };

    var compare = function(a, b) {
      var deferred = $q.defer();
      $scope.decision = {a: a, b: b};
      $scope.decisionDeferred = deferred;
      return deferred.promise;
    };

    $scope.decide = function(greater) {
      $scope.decisionCount++;
      $scope.decisionDeferred.resolve(greater);
      $scope.decision = null;
      $scope.decisionDeferred = null;
    };

    var mergeSort = function(songs) {
      if (songs.length <= 1) {
        var deferred = $q.defer();
        deferred.resolve(songs);
        return deferred.promise;
      }
      var half = Math.ceil(songs.length / 2);
      var left = angular.copy(songs).splice(0, half);
      var right = angular.copy(songs).splice(half);

      return mergeSort(left).then(function(sortLeft) {
        return mergeSort(right).then(function(sortRight) {
          return merge(sortLeft, sortRight).then(function(result) {
            $scope.songs = result;
            return result;
          });
        });
      });
    };

    $http.get('/songs').success(function(songs) {
      $scope.songs = songs;
      mergeSort(songs).then(function(songs) {
        $scope.songs = songs;
      });
    })
  });
