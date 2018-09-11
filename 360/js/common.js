;(function () {
    'use strict';
    var $commonLandscape, $commonPC, $commonShare, $commonContainer;

    //主函数
    function main() {
        init();
        landscapeSetting();
        pcSetting();
        shareSetting();
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
        window.appShare = {
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
            },
            show: function () {
                $commonShare.fadeIn(300);
                setTimeout(function () {
                    $commonShare.fadeOut(300);
                }, 2000);
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
        appShare.update({
            title: '每个人都是孤独的食客 - 口碑',
            desc: '每个人都是孤独的食客',
            img_url: '',
            link: window.location.href
        });

        //微信分享设置
        document.addEventListener('WeixinJSBridgeReady', function () {
            WeixinJSBridge.on('menu:share:timeline', function () {
                WeixinJSBridge.invoke('shareTimeline', appShare.shareData, function (res) {
                    //
                });
            });
            WeixinJSBridge.on('menu:share:appmessage', function () {
                WeixinJSBridge.invoke('sendAppMessage', appShare.shareData, function (res) {
                    //
                });
            });
        }, false);

        //易信分享设置
        document.addEventListener('YixinJSBridgeReady', function () {
            YixinJSBridge.on('menu:share:timeline', function () {
                YixinJSBridge.invoke('shareTimeline', appShare.shareData, function () {
                });
            });
            YixinJSBridge.on('menu:share:appmessage', function () {
                YixinJSBridge.invoke('sendAppMessage', appShare.shareData, function () {
                });
            });
        }, false);
    }

    $(main);
}());