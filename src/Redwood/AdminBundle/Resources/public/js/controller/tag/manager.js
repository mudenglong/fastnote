define(function(require, exports, module) {
    var TagCollector = require('../widget/tag-collector');

	exports.run = function() {
        var tagCollector = new TagCollector({ element: '#demo' }).render();

	};

});