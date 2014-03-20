angular.module('searchApp',[]).filter('matchesQuery', function(){
    return function(items, query) {
        if (!items || !query) {
            return [];
        }
        var alternate = query.replace(/ /g,"_").toLowerCase();
        var lcQuery = query.toLowerCase();
        var arrayToReturn = [];        
        for (var i=0; i<items.length; i++){
            if ((items[i].title && items[i].title.toLowerCase().indexOf(lcQuery) !== -1)
                           || items[i].text.indexOf(alternate) !== -1) {
                arrayToReturn.push(items[i]);
            }
        }
        return arrayToReturn;
    };
}).config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

function SearchResultCtrl($scope, $http) {
  $scope.query = "";
  $scope.posts = [];
  $http.get('/contents.json').success(function(data) {
    $scope.contents = data.contents;
  });
}
