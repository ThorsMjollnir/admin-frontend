/**
 * Created by Tim Osadchiy on 27/05/2017.
 */

"use strict";

module.exports = function (app) {
    require("./guided-image-editor-canvas/guided-image-editor-canvas.directive")(app);
    require("./guided-image-editor-meta/guided-image-editor-meta.directive")(app);
    require("./guided-image-editor-path-list/guided-image-editor-path-list.directive")(app);

    app.directive("guidedImageEditor", ["$routeParams",
        "GuidedImagesService", directiveFun]);

    function directiveFun($routeParams, GuidedImagesService) {

        function controller(scope, element, attributes) {

            scope.generalInfoVisible = true;

            scope.guideImage = {
                id: $routeParams.guidedId,
                description: "",
                src: "",
                guideImageId: "",
                baseImageId: "",
                guideImageDescription: "",
                imageMapObjects: [],
                hoveredPathIndex: null,
                selectedPathIndex: null
            };

            scope.switchView = function (generalInfoVisible) {
                scope.generalInfoVisible = generalInfoVisible;
            };

            GuidedImagesService.get($routeParams.guidedId).then(function (data) {
                setScopeFromData.call(scope.guideImage, data);
            });

        }

        return {
            restrict: 'E',
            link: controller,
            scope: {},
            template: require("./guided-image-editor.directive.html")
        };
    }

};

function setScopeFromData(data) {
    this.description = data.meta.description;
    this.src = data.path;
    this.imageMapObjects.push.apply(this.imageMapObjects, data.objects);
}


