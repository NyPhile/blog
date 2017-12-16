(function () {
    'use strict';
    function preventDefault(ev) {
        ev.preventDefault();
    }
    document.addEventListener('touchmove', preventDefault, false);
    document.addEventListener('touchstart', preventDefault, false);

    //主函数
    function main () {
        window.imgData = "";
        $("#toImg").on("touchend", function(){
            $(".edit").hide();
            $(".result").show();
        })
        init();
        bind();
    }

    //初始化
    function init() {
    }

    //绑定事件
    function bind() {
        var reader = new FileReader();
        // var stage = new AlloyPaper.Stage("#canvas");
        var config = {
            datalist : [
                {"c_w": 200, "c_h": 300}
            ]
        }
        var type = 0;
        reader.onload = function(e){

    ;(function (AlloyPaper) {
        var Stage = AlloyPaper.Stage, Bitmap = AlloyPaper.Bitmap,Loader=AlloyPaper.Loader;

        var stage = new Stage("#ourCanvas");
        stage.autoUpdate=false;
        var ld = new Loader();
        ld.loadRes([
            { id: "test2", src: "img/edit_footer.png" },
            { id: "test", src: e.target.result }
        ]);
        ld.complete(function () {
            var bmp = new Bitmap(ld.get("test"));
            bmp.originX = 0.5;
            bmp.originY = 0.5;
            bmp.x = stage.width / 2;
            bmp.y =150;
            stage.add(bmp);

            var bmp2 = new Bitmap(ld.get("test2"));
            bmp2.originX = 0.5;
            bmp2.originY = 0.5;
            bmp2.x = stage.width / 2;
            bmp2.y =450;
            stage.add(bmp2);

            stage.update();
            

            var initScale = 1;
            new AlloyFinger(bmp, {
                multipointStart: function () {
                    initScale = bmp.scaleX;
                },
                rotate: function (evt) {
                    bmp.rotation += evt.angle;
                    stage.update();
                },
                pinch: function (evt) {
                    bmp.scaleX = bmp.scaleY = initScale * evt.scale;
                    stage.update();
                },
                pressMove: function (evt) {
                    bmp.x += evt.deltaX;
                    bmp.y += evt.deltaY;
                    evt.preventDefault();
                    stage.update();
                }

            });

            new AlloyFinger(bmp2, {
                multipointStart: function () {
                    initScale = bmp2.scaleX;
                },
                rotate: function (evt) {
                    bmp2.rotation += evt.angle;
                    stage.update();
                },
                pinch: function (evt) {
                    bmp2.scaleX = bmp2.scaleY = initScale * evt.scale;
                    stage.update();
                },
                pressMove: function (evt) {
                    bmp2.x += evt.deltaX;
                    bmp2.y += evt.deltaY;
                    evt.preventDefault();
                    stage.update();
                }

            });
        });


    })(AlloyPaper)



            // if(!$("#canvas").length){
            //     var _canvas = document.createElement("canvas");
            //     _canvas.width = config.datalist[type].c_w , _canvas.height = config.datalist[type].c_h, _canvas.id = "canvas";
            //     $("#edit_wrap .img_wrap").append(_canvas);
            // }
            // var Bitmap = AlloyPaper.Bitmap, Loader=AlloyPaper.Loader;
            // var stage = new AlloyPaper.Stage("#canvas");
            // console.log(stage)
            // stage.autoUpdate = false;
            // var img = new Image(); img.src = e.target.result;
            // $(".edit .footer").append(img)
            // img.onload = function(){
            //     var bmp = new Bitmap(img);
            //     console.log(bmp)
            //     bmp.originX = 0.5;
            //     bmp.originY = 0.5;
            //     bmp.x = stage.width / 2;
            //     bmp.y =150;
            //     stage.add(bmp);
            //     stage.update();
            // }
        }
        $("#inputfile").on("touchend", function(){
            this.click();
        })
        $("#inputfile").change(function(e){
            reader.readAsDataURL(e.target.files[0]);
        });
        // var x = 0, y = 0, oImg = $("#edit_wrap img"),startX,startY;
        // $("#filter").on("touchstart", function(e){
        //     startX = e.touches[0].pageX, startY = e.touches[0].pageY;
        // })

        // $("#filter").on("touchmove", function(e){
        //     var distX = e.touches[0].pageX - startX + x, distY = e.touches[0].pageY - startY + y;
        //     oImg.css("transform","translate("+distX+"px,"+distY+"px)");
        // })
        // $("#filter").on("touchend", function(e){
        //     console.log(e)
        //     x = e.changedTouches[0].pageX - startX + x, y = e.changedTouches[0].pageY - startY + y;
        // })
    }

    $(main);
}());