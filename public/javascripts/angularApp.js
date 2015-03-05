var app = angular.module('flapperNews', [
        'ui.router'
]);

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: '/home.html',
                controller: 'MainCtrl',
                resolve: {
                    postPromise: ['postRepository', function(postRepository){
                        return postRepository.getAll();
                    }]
                }
            })

            .state('posts', {
                url: '/posts/{id}',
                templateUrl: '/posts.html',
                controller: 'PostsCtrl',
                resolve: {
                    post: ['$stateParams', 'postRepository', function($stateParams, postRepository) {
                        return postRepository.get($stateParams.id);
                    }]
                }
            });

        $urlRouterProvider.otherwise('home');
    }
]);

app.factory('postRepository', ['$http', function($http){
    var o = {
        posts: []
    };

    o.get = function(id) {
        return $http.get('/posts/' + id).then(function(res){
            return res.data;
        });
    };

    o.getAll = function() {
        return $http.get('/posts').success(function(data){
            angular.copy(data, o.posts);
        });
    };

    o.create = function(post) {
        return $http.post('/posts', post).success(function(data){
            o.posts.push(data);
        });
    };

    o.upvote = function(post) {
        return $http.put('/posts/' + post._id + '/upvote')
            .success(function(data){
                post.upvotes += 1;
            });
    };

    o.addComment = function(id, comment) {
        return $http.post('/posts/' + id + '/comments', comment);
    };

    o.upvoteComment = function(post, comment) {
        return $http.put('/posts/' + post._id + '/comments/'+ comment._id + '/upvote')
            .success(function(data){
                comment.upvotes += 1;
            });
    };

    return o;
}]);

app.controller('MainCtrl', [
    '$scope',
    'postRepository',
    function($scope, postRepository){
        $scope.test = 'Hello world!';

        $scope.posts = postRepository.posts;

        $scope.addPost = function(){
            if(!$scope.title || $scope.title === '') { return; }
            postRepository.create({
                title: $scope.title,
                link: $scope.link
            });
            $scope.title = '';
            $scope.link = '';
        };

        $scope.incrementPostUpvotes = function(post) {
            postRepository.upvote(post);
        };

    }
]);

app.controller('PostsCtrl', [
    '$scope',
    'postRepository',
    'post',
    function($scope, postRepository, post){
        $scope.post = post;

        $scope.addComment = function(){
            if($scope.body === '') { return; }
            postRepository.addComment(post._id, {
                body: $scope.body,
                author: 'user'
            }).success(function(comment) {
                $scope.post.comments.push(comment);
            });
            $scope.body = '';
        };

        $scope.incrementCommentUpvotes = function(comment){
            postRepository.upvoteComment(post, comment);
        };
    }
]);
