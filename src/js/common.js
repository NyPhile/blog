;(function () {
    'use strict';
    var $commonLandscape, $commonPC, $commonShare, $commonContainer;

    //主函数
    function main() {
        init();
        landscapeSetting();
        pcSetting();
        shareSetting();
        containerSetting();
    }

    //初始化
    function init() {
        $commonLandscape = $('#common-landscape');
        $commonPC = $('#common-pc');
        $commonShare = $('#common-share');
        $commonContainer = $('.common-container');
    }

    //通用横屏提示设置
    function landscapeSetting() {
        var handler = function () {
            switch (window.orientation) {
                case 0:
                case 180:
                    $commonLandscape.hide();
                    break;
                case -90:
                case 90:
                    $commonLandscape.show();
                    break;
            }
        };

        handler();
        window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", handler, false);
    }

    //通用pc扫码提示设置
    function pcSetting() {
        if (!$.os.phone && !$.os.tablet) {
            new QRCode($commonPC.children()[0]).makeCode(location.href);
            $('body').children().hide();
            $commonPC.show();
        }
    }

    //通用分享设置
    function shareSetting() {
        window.NewsAppShare = {
            shareData: {
                title: '',
                desc: '',
                img_url: '',
                link: ''
            },
            update: function (data) {
                for (var i in data) {
                    if (this.shareData.hasOwnProperty(i)) {
                        this.shareData[i] = data[i];
                    }
                }
                document.getElementById('__newsapp_sharetext').innerHTML = this.shareData.title + ' ' + this.shareData.link;
                document.getElementById('__newsapp_sharephotourl').innerHTML = this.shareData.img_url;
                document.getElementById('__newsapp_sharewxtitle').innerHTML = this.shareData.title;
                document.getElementById('__newsapp_sharewxtext').innerHTML = this.shareData.desc;
                document.getElementById('__newsapp_sharewxthumburl').innerHTML = this.shareData.img_url;
                document.getElementById('__newsapp_sharewxurl').innerHTML = this.shareData.link;
            },
            show: function () {
                if (NewsAppClient.isNewsApp()) {
                    NewsAppClient.share();
                } else {
                    $commonShare.fadeIn(300);
                    setTimeout(function () {
                        $commonShare.fadeOut(300);
                    }, 2000);
                }
            },
            getAbsPath: function (url) {
                if (url) {
                    var a = document.createElement('a');
                    a.href = url;
                    return a.href;
                } 
                var r = new RegExp(/(\?|#).*/);
                return location.href.replace(r, '');
            }
        };
        //初始化分享数据
        NewsAppShare.update({
            title: '分享标题',
            desc: '分享描述',
            img_url: 'https://c.m.163.com/nc/qa/activity/tiewhitepaper20170628/img/share-icon.png',
            link: NewsAppShare.getAbsPath()
        });

        //微信分享设置
        document.addEventListener('WeixinJSBridgeReady', function () {
            WeixinJSBridge.on('menu:share:timeline', function () {
                WeixinJSBridge.invoke('shareTimeline', NewsAppShare.shareData, function (res) {

                });
            });
            WeixinJSBridge.on('menu:share:appmessage', function () {
                WeixinJSBridge.invoke('sendAppMessage', NewsAppShare.shareData, function (res) {

                });
            });
        }, false);

        //易信分享设置
        document.addEventListener('YixinJSBridgeReady', function () {
            YixinJSBridge.on('menu:share:timeline', function () {
                YixinJSBridge.invoke('shareTimeline', NewsAppShare.shareData, function () {
                });
            });
            YixinJSBridge.on('menu:share:appmessage', function () {
                YixinJSBridge.invoke('sendAppMessage', NewsAppShare.shareData, function () {
                });
            });
        }, false);
    }

    //通用容器适配设置
    function containerSetting() {
        var clientHeight = document.documentElement.clientHeight;
        var designHeight = parseInt($commonContainer.css('height'));
        $commonContainer.animate({
            scale: Math.min(clientHeight / designHeight, 1),
            top: -(designHeight - clientHeight) / 2
        }, 0);
    }

    $(main);
}());