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
}).config(function($httpProvider, $interpolateProvider) {
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
}).controller('SearchWikiCtrl', function($scope, $http) {
  $scope.query = "";
  $scope.posts = 'test';
  $http.get('/contents.json').success(function(data) {
    $scope.contents = data.contents;
  });
}).controller('SearchSupportCtrl', function($scope, $http, $filter) {

  $http.get('/contents.json').success(function(data) {
    $scope.allContents = data.contents;
  });

  $scope.search = function() {
    $scope.contents = [];
    $scope.answers = [];
    $scope.issues = [];
    if ($scope.query) {

        $scope.contents = $filter('matchesQuery')($scope.allContents, $scope.query);

        var params = {
            type: "question",
            query: $scope.query,
            tags: 'addon-jira-timesheet-plugin',
            sort: "active"
        }
        var query = Object.keys(params).map(function(key) {
          return key + '=' + encodeURIComponent(params[key]);
        }).join('&');
        $scope.loading = false;
        /* FIXME: tags/topics query param is ignored
        var resource = 'https://answers.atlassian.com/rest/questions/1.0/search/?' + query;
        $http.jsonp('http://localhost:5000?callback=JSON_CALLBACK&resource=' + encodeURIComponent(resource)).success(function(data) {
          $scope.answers = data;
          $scope.loading = false
        }).error(function() {
          $scope.loading = false
        });

        // FIXME: api gone
        $http.jsonp('https://bitbucket.org/api/1.0/repositories/azhdanov/jiratimesheet/issues?callback=JSON_CALLBACK&search='
            + encodeURIComponent($scope.query)).success(function(data) {
          $scope.issues = data.issues;
          $scope.loading = false
        });
        */

    }
  }
}).filter('encodeURIComponent', function() {
  return window.encodeURIComponent;
});
