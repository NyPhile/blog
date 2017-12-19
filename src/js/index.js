(function () {
    'use strict';
    function preventDefault(ev) {
        ev.preventDefault();
    }
    document.addEventListener('touchmove', preventDefault, false);
    document.addEventListener('touchstart', preventDefault, false);

    //主函数
    function main () {
        var Gesture = function(el){
            this.startX = this.startY = this.moveX = this.moveY = null;
            this.previousPinchScale = 1;
            this.longTapTimeout = null;
        }
        Gesture.prototype._getTime = function(){
            return new Date().getTime();
        }
        Gesture.prototype._getDistance = function(xLen, yLen){
            return Math.sqrt(xLen * xLen + yLen * yLen);
        }
        Gesture.prototype._getRotateDirection = function(vector1, vector2){
            return vector1.x * vector2.y - vector2.x * vector1.y;
        }
        Gesture.prototype._getRotateAngle = function(vector1, vector2){
           var direction = this._getRotateDirection(vector1,vector2);
           direction = direction > 0 ? -1 : 1;
           var len1 = this._getDistance(vector1.x,vector1.y);
           var len2 = this._getDistance(vector2.x,vector2.y);
           var mr = len1 * len2;
           if(mr === 0) return 0;
           var dot = vector1.x * vector2.x + vector1.y * vector2.y;
           var r = dot / mr;
           if(r > 1) r = 1;
           if(r < -1) r = -1;
           return Math.acos(r) * direction * 180 / Math.PI;
        }
        Gesture.prototype._onTouchStart = function(e){
            if(!window.stage){return}
            var point = e.touches ? e.touches[0] : e;
            this.startX = point.pageX;
            this.startY = point.pageY;
            window.clearTimeout(this.longTapTimeout);
            var self = this;
            //两点接触
            if(e.touches.length > 1) {
                var point2 = e.touches[1];
                var xLen = Math.abs(point2.pageX - this.startX);
                var yLen = Math.abs(point2.pageY - this.startY);
                this.touchDistance = this._getDistance(xLen,yLen); 
                this.touchVector = {
                    x: point2.pageX - this.startX,
                    y: point2.pageY - this.startY
                };
            }else {
                this.startTime = this._getTime();
                this.longTapTimeout = setTimeout(function(){
                    // self._emitEvent('onLongPress')
                }, 800);
                if(this.previousTouchPoint) {
                    if( Math.abs(this.startX - this.previousTouchPoint.startX) < 10  &&
                    Math.abs(this.startY - this.previousTouchPoint.startY) < 10 && 
                    Math.abs(this.startTime - this.previousTouchTime) < 300) {
                        // this._emitEvent('onDoubleTap');
                    }
                }
                this.previousTouchTime = this.startTime;
                this.previousTouchPoint = {
                    startX : this.startX,
                    startY : this.startY
                };
            }
        }
        Gesture.prototype._onTouchMove = function(e) {
            if(!window.stage){return}
            var timestamp = this._getTime();
            if (e.touches.length > 1) {
                var xLen = Math.abs(e.touches[0].pageX - e.touches[1].pageX);
                var yLen = Math.abs(e.touches[0].pageY - e.touches[1].pageY);
                var that = this;
                var touchDistance = this._getDistance(xLen, yLen);
                if (this.touchDistance) {
                    var pinchScale = touchDistance / this.touchDistance;
                    pinchScale = Math.sqrt(pinchScale)
                    this.onPinch({pinch: pinchScale - this.previousPinchScale})
                    this.previousPinchScale = pinchScale;
                }
                if (this.touchVector) {
                    var vector = {
                        x: e.touches[1].pageX - e.touches[0].pageX,
                        y: e.touches[1].pageY - e.touches[0].pageY
                    };
                    var angle = this._getRotateAngle(vector, this.touchVector);
                    this.onRotate({angle: angle});
                    this.touchVector.x = vector.x;
                    this.touchVector.y = vector.y;
                }
            } else {
                window.clearTimeout(this.longTapTimeout);
                var point = e.touches ? e.touches[0] : e;
                var deltaX = this.moveX === null ? 0 : point.pageX - this.moveX;
                var deltaY = this.moveY === null ? 0 : point.pageY - this.moveY;
                this.onMove({deltaX: deltaX, deltaY: deltaY})
                this.moveX = point.pageX;
                this.moveY = point.pageY;
            }
            e.preventDefault();
        }
        Gesture.prototype._onTouchCancel = function(e) {
            if(!window.stage){return}
            this._onTouchEnd(e);
        }
        Gesture.prototype._onTouchEnd = function(e) {
            if(!window.stage){return}
            window.clearTimeout(this.longTapTimeout);
            var timestamp = this._getTime();
            if (this.moveX !== null && Math.abs(this.moveX - this.startX) > 10 || this.moveY !== null && Math.abs(this.moveY - this.startY) > 10) {
                if (timestamp - this.startTime < 500) {
                    this.onSwipe()
                }
            } else if (timestamp - this.startTime < 2000) {
                if (timestamp - this.startTime < 500) {
                    this.onTap()
                }
                if (timestamp - this.startTime > 500) {
                    // this._emitEvent('onLongPress');
                }
            }
            this.startX = this.startY = this.moveX = this.moveY = null;
            this.previousPinchScale = 1;
            // this.angle = 0;
            this.w = this.oImg.width();
            this.h = this.oImg.height();
        }
        Gesture.prototype.init = function(){
            $("#filter").on("touchstart", this._onTouchStart.bind(this))
            $("#filter").on("touchmove", this._onTouchMove.bind(this))
            $("#filter").on("touchcancel", this._onTouchCancel.bind(this))
            $("#filter").on("touchend", this._onTouchEnd.bind(this))
            this.oImg = $("#edit_wrap img");
            this.x = 0; this.y = 0; this.pinch = 1; this.angle = 0;
            this.w = 200; this.h = 300;
        }
        Gesture.prototype.onPinch = function(data){
            var _pinch = this.pinch + data.pinch;
            var o = window.stage.getChildById("redsun");
            o.scaleX = _pinch;
            o.scaleY = _pinch;
            // this.oImg.css("transform", "translate("+this.x+"px,"+this.y+"px) scale("+_pinch+") rotateZ("+this.angle+"deg)")
            this.pinch = _pinch;
        }
        Gesture.prototype.onRotate = function(data){
            var _angle = this.angle + data.angle;
            var o = window.stage.getChildById("redsun");
            o.rotation = _angle;
            // this.oImg.css("transform", "translate("+this.x+"px,"+this.y+"px) scale("+this.pinch+") rotateZ("+_angle+"deg)")
            this.angle = _angle;
        }
        Gesture.prototype.onSwipe = function(data){

        }
        Gesture.prototype.onTap = function(data){

        }
        Gesture.prototype.onMove = function(data){
            var _x = this.x + data.deltaX, _y = this.y + data.deltaY;
            // this.oImg.css("transform", "translate("+_x+"px,"+_y+"px) scale("+this.pinch+") rotateZ("+this.angle+"deg)")
            var o = window.stage.getChildById("redsun");
            o.x = _x, o.y = _y;
            this.x = _x;
            this.y = _y;
        }
        Gesture.prototype.toImg = function(){
            var _canvas = document.createElement("canvas");
            _canvas.width = 710; _canvas.height = 1015;
            var _avatar = new Image(); _avatar.src = window.stage.canvas.toDataURL();
            var self = this;
            var _ctx = _canvas.getContext('2d');
            console.log(_avatar.onload)
            var type = ny.type, o = ny.config.types[type];
            // $(".result h3").text(o.title)
            _avatar.onload = function(){
                // alert(1)
                _ctx.drawImage(_avatar,o.c_l,o.c_t + 196,o.c_w,o.c_h);
                console.log(type,o)
                var _img = new Image(); _img.src = o.img;
                _img.onload = function(){
                    // _ctx.drawImage(_img,0,0,710,819);
                    _ctx.drawImage(_img,0,0,710,1015)
                    var _qrcode = new Image(); _qrcode.src = "img/qrcode.png";
                    _qrcode.onload = function(){
                        _ctx.drawImage(_qrcode,0,0,128,162,570,630+190,128,162)
                        $("#result").attr("src", _canvas.toDataURL())
                        // $(".result .photo_wrap").append(_canvas)
                    }
                    //context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
                }
            }

        }

        function Nyphile(){
            this.keys = $(".map .k");
            this.type = 0;
            this.config = {
                types: [{
                    img: "img/img1.png",
                    c_l: 60, c_t: 170, c_w: 200, c_h: 300,
                    title: "我和美国总统特朗普合张影"
                },{
                    img: "img/img2.png",
                    c_l: 70, c_t: 46, c_w: 300, c_h: 300,
                    title: "我和俄罗斯总统普京普合张影"
                },{
                    img: "img/img3.png",
                    c_l: 70, c_t: 46, c_w: 300, c_h: 300,
                    title: "我和加拿大总理特鲁多合张影"
                },{
                    img: "img/img4.png",
                    c_l: 470, c_t: 140, c_w: 200, c_h: 200,
                    title: "我和法国总统马克龙合张影"
                },{
                    img: "img/img5.png",
                    c_l: 440, c_t: 60, c_w: 200, c_h: 200,
                    title: "我和凯特王妃普合张影"
                },{
                    img: "img/img6.png",
                    c_l: 400, c_t: 160, c_w: 300, c_h: 300,
                    title: "我和第一千金伊万卡普合张影"
                },]
            }
        }
        Nyphile.prototype.load = function(){
            var imglist = [
                "img/edit_footer.png",
                "img/edit_header.png",
                "img/img1.png",
                "img/img2.png",
                "img/img3.png",
                "img/img4.png",
                "img/img5.png",
                "img/img6.png",
                "img/loading_bg.jpg",
                "img/map_bg.jpg",
                "img/qrcode.png",
                "img/result_header.png",
                "img/sprite.png"
            ]
            function t() {
                n++;
                var t = parseInt(n / 13 * 100, 10);
                console.log(t),
                t = t >= 100 ? 100 : t,
                $(".loading .process_number").text(t + "%"),
                $(".loading .process i").css({"width":t*384/100 + "px"}),
                100 == t && o && (i(),
                o = !1)
            }
            for (var e = [], n = 0, r = imglist, i = function() {}, o = !0, a = r.length - 1; a >= 0; a--)
                e[a] = new Image,
                e[a].src = r[a],
                e[a].onload = function() {
                    t()
                },
                e[a].onerror = function() {
                    t()
                };
            return {
                done: function(t) {
                    i = t || i
                }
            }
        
        }
        Nyphile.prototype.toEdit = function(){
            var type = this.type, o = this.config.types[type];
            $(".map").hide().removeClass("active");
            $(".edit #edit_wrap")[0].className = "type" + (type + 1);
            $("#canvas")[0].width = o.c_w;
            $("#canvas")[0].height = o.c_h;
            $(".edit").show();
        }
        Nyphile.prototype.init = function(){
            var me = this;
            this.load().done(function(){
                $(".loading").fadeOut();
                $(".map").fadeIn();setTimeout(function(){$(".map").addClass("active");},100)
            })
            // console.log(this.keys)
            this.keys.on("touchend", function(){
                me.type = this.getAttribute("name") - 1;
                setTimeout(function(){
                    me.toEdit();
                },100);
            });
            $("#inputfile").on("touchend", function(){
                this.click();
            });
            $("#inputfile").change(function(e){
                me.reader.readAsDataURL(e.target.files[0]);
            });
            $(".btn_save").on("touchend", function(){
                alert("长按图片，保存到相册")
            })
            $(".result .return").on("touchend", function(){
                $(".edit").show();
                $(".result").hide();
                // window.stage && window.stage.removeAllChildren()
            })
            $(".edit .return").on("touchend", function(){
                $(".edit").hide();
                $(".map").show();setTimeout(function(){$(".map").addClass("active");},100);
                window.stage && window.stage.removeAllChildren()
            })
            this.reader = new FileReader();
            this.reader.onload = function(e){
                var img = new Image(); img.src = e.target.result;
                img.onload = function(){
                    window.stage = window.stage ? window.stage : new Hilo.Stage({
                        canvas: $("#canvas")[0]
                    });
                    stage.removeAllChildren();
                    // 定时器
                    var ticker = new Hilo.Ticker(120);
                    ticker.addTick(Hilo.Tween);
                    ticker.addTick(stage);
                    ticker.start();
                    var redsun = new Hilo.Bitmap({
                        id: "redsun",
                        image: img,
                        rect:[0, 0, img.width, img.height],
                        y: 0,x: 0, pivotX: img.width/2, pivotY: img.height/2,
                    }).addTo(stage);
                }
            }
        }
        var ny = new Nyphile; ny.init();
        // bind();
        var gesture = new Gesture();
        gesture.init();
        $("#toImg").on("touchend", function(){
            gesture.toImg();
            $(".edit").hide();
            $(".result").show();
        })
    }


    //绑定事件
    function bind() {

    }

    $(main);
}());