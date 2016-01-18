define([
    'ractive',
    'jquery',
    'text!./templates/appTemplate.html',
    'text!./templates/headerTemplate.html',
    'text!./templates/shareTemplate.html',
    'text!./templates/bodyTemplate.html',
    'text!./templates/footerTemplate.html'
], function(
    Ractive,
    $,
    appTemplate,
    headerTemplate,
    shareTemplate,
    bodyTemplate,
    footerTemplate
) {
   'use strict';
    var data;

    function init(el, context, config, mediator) {
        var headCount = -1;
        if ($("#article")) {
            var target = $('#article, .article--standard, .article--immersive');
        } else {
            var target = $(".article--standard");
            alert("Error loading");
        }
        $.ajax({
            url: 'https://interactive.guim.co.uk/docsdata-test/1MPqC3c6l8wEYWZMBNOx2vKLUz09WAQk5Ml2P03zdMr0.json',
            success: function(response){
                for(var key in response.sheets){
                    var newSheet = response.sheets[key].map(function(row){
                        if(row.text){
                            row.text = row.text.split('\n').filter(function(p){return p});
                        }
                        return row;
                    });
                    response.sheets[key] = newSheet;
                }
                data = response.sheets;
                renderPage(target);
            },
            error:function(err){
                // console.log('data not loading',err);
            }
        })
    }

    function renderPage(el){
        var appHeader           = Ractive.extend({template:headerTemplate});
        var shareContainer      = Ractive.extend({template:shareTemplate});
        var bodyContainer       = Ractive.extend({template:bodyTemplate});
        var footerContainer     = Ractive.extend({template:footerTemplate});

        var addEvent = function(object, type, callback) {
            if (object == null || typeof(object) == 'undefined') return;
            if (object.addEventListener) {
                object.addEventListener(type, callback, false);
            } else if (object.attachEvent) {
                object.attachEvent("on" + type, callback);
            } else {
                object["on"+type] = callback;
            }
        };

        var app = new Ractive({
            el:el,
            template:appTemplate,
            components: {
                appHeader:appHeader,
                shareContainer:shareContainer,
                bodyContainer:bodyContainer,
                footerContainer:footerContainer
            },
            data:data
        })

        positionStats();
    }

    function positionStats() {
        $(".this-is-the-nhs__stat-one").insertAfter(".this-is-the-nhs__body p:nth-of-type(2)");
        $(".this-is-the-nhs__stat-two").insertAfter(".this-is-the-nhs__body p:nth-of-type(5)");
    }


    return {
        init: init
    };
});
