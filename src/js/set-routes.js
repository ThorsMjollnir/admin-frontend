'use strict';

module.exports = function (app) {

    var routes = {
        welcome: "/",
        foodExplorer: "/fe/:locale",
        imageGalleryRoute: '/galleries',
        imageGalleryMain: "/galleries/main",
        imageGalleryAsServed: "/galleries/as-served",
        imageGalleryGuidedList: "/galleries/guided",
        imageGalleryGuidedItem: "/galleries/guided/:guidedId",
        imageGalleryNewGuidedItem: "/galleries/new-guided",
        userManagerRoute: '/users',
        userManagerRespondents: '/users/respondents',
        userManagerAdmins: '/users/admins',
        surveyManager: '/survey-manager',
        surveyManagerNew: '/survey-manager/new',
        surveyManagerSurvey: '/survey-manager/:surveyId',
        surveyManagerSurveyDescription: '/survey-manager/:surveyId/description',
        surveyManagerSurveyUsers: '/survey-manager/:surveyId/users',
        surveyManagerSurveyResults: '/survey-manager/:surveyId/results',
        surveyFeedback: '/survey-feedback'
    };

    app.constant('appRoutes', routes);

    app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $locationProvider.hashPrefix('');
        $routeProvider
            .when(routes.welcome, {
                template: require("./welcome/welcome.controller.html"),
                controller: 'WelcomeController'
            })
            .when(routes.foodExplorer, {
                template: require("./explorer/templates/index.pug"),
                controller: 'MainController'
            })
            .when(routes.imageGalleryMain, {
                template: require("./image-gallery/templates/image-gallery-main.pug"),
                controller: 'ImageGalleryMain'
            })
            .when(routes.imageGalleryAsServed, {
                template: require("./image-gallery/templates/image-gallery-as-served.pug"),
                controller: 'ImageGalleryAsServed'
            })
            .when(routes.imageGalleryGuidedList, {
                template: require("./image-gallery/templates/image-gallery-guided.pug"),
                controller: 'ImageGalleryGuided',
                reloadOnSearch: false
            })
            .when(routes.imageGalleryGuidedItem, {
                template: require("./image-gallery/templates/image-gallery-guided-item.pug"),
                controller: 'ImageGalleryGuidedItem'
            })
            .when(routes.imageGalleryNewGuidedItem, {
                template: require("./image-gallery/templates/image-gallery-guided-item.pug"),
                controller: 'ImageGalleryGuidedItem'
            })
            .when(routes.imageGalleryRoute, {
                redirectTo: routes.imageGalleryMain
            })
            .when(routes.userManagerAdmins, {
                template: require("./user-managers/controllers/user-manager-admins/index.html"),
                controller: 'UserManagerAdmins'
            })
            .when(routes.userManagerRespondents, {
                template: require("./user-managers/controllers/user-manager-respondents/index.html"),
                controller: 'UserManagerRespondents'
            })
            .when(routes.surveyManager, {
                template: require("./survey-manager/survey-manager.controller.html"),
                controller: 'SurveyManagerController'
            })
            .when(routes.surveyManagerNew, {
                template: require("./survey-manager/survey-manager.controller.html"),
                controller: 'SurveyManagerController'
            })
            .when(routes.surveyManagerSurvey, {
                template: require("./survey-manager/survey-manager.controller.html"),
                controller: 'SurveyManagerController'
            })
            .when(routes.surveyManagerSurveyDescription, {
                template: require("./survey-manager/survey-manager.controller.html"),
                controller: 'SurveyManagerController'
            })
            .when(routes.surveyManagerSurveyUsers, {
                template: require("./survey-manager/survey-manager.controller.html"),
                controller: 'SurveyManagerController'
            })
            .when(routes.surveyManagerSurveyResults, {
                template: require("./survey-manager/survey-manager.controller.html"),
                controller: 'SurveyManagerController',
                reloadOnSearch: false
            })
            .when(routes.surveyFeedback, {
                template: require("./survey-feedback/survey-feedback.pug"),
                controller: 'SurveyFeedbackController'
            })
            .when(routes.userManagerRoute, {
                redirectTo: routes.userManagerRespondents
            })
            .otherwise({
                redirectTo: routes.welcome
            });
    }]);
};