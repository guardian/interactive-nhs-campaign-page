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
        var target = $('#article');
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

        app.on('shareContainer.share',shareContent);
    }

    function positionStats() {
        $(".this-is-the-nhs__stat-one").insertAfter("p:nth-of-type(2)");
        $(".this-is-the-nhs__stat-two").insertAfter("p:nth-of-type(5)");
    }

    function shareContent(e, platform, message, url, image){
        var shareURL = "http://gu.com/p/4ft63"; // short url will only work in a guardian page
        var shareWindow;
        var twitterBaseUrl = "http://twitter.com/share?text=";
        var facebookBaseUrl = "https://www.facebook.com/dialog/feed?display=popup&app_id=741666719251986&link=";

        var articleUrl = shareURL;
        var facebookUrl = shareURL;
        var urlsuffix = url ? url : "";
        var shareUrl = articleUrl + urlsuffix;

        var fallbackMessage = "The story of one of the most complex organisations in the world, the voices of those on the frontline #ThisIsTheNHS";
        message = message ? message : fallbackMessage;

        var shareImagePath = "@@assetPath@@/imgs/";
        var shareImage = image ? shareImagePath + image : shareImagePath + 'logo.png'

        if(platform === "twitter"){
            shareWindow = 
                twitterBaseUrl + 
                encodeURIComponent(message) + 
                "&url=" + 
                encodeURIComponent(shareUrl)   
        }else if(platform === "facebook"){
            shareWindow = 
                facebookBaseUrl + 
                encodeURIComponent(facebookUrl) + 
                "&picture=" + 
                encodeURIComponent(shareImage) + 
                "&redirect_uri=http://www.theguardian.com";
        }else if(platform === "mail"){
            shareWindow =
                "mailto:" +
                "?subject=" + message +
                "&body=" + shareUrl 
        }
        window.open(shareWindow, platform + "share", "width=640,height=320");
    }
    return {
        init: init
    };
});
