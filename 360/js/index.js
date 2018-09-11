(function () {
    'use strict';

    function preventDefault(ev) {
        ev.preventDefault();
        ev.stopPropagation();
    }
    //主函数
    function main () {
        var App = function(){
            this.w = window.innerWidth;
            this.h = window.innerHeight;

            this.images = ["arr.png","p1_bg.jpg","p1_light.jpg","p1_man.png","p2_bg.jpg","p2_hand.png","p2_light.jpg","p2_man.jpg","p2_modern.png","p2_modern_light.png","p2_text1.png","p2_text2.png","p2_zhy1.png","p2_zhy2.png","p2_zhy_light.png","p2_zhy_red.png","p3_btn.png","p3_man.png","p3_modern.png","p3_stars.gif","p3_text.png","p5_bg.jpg","p5_light.jpg","p5_modern_light.png","p5_text1.png","p5_text2.png","p6_modern.png","p6_nb.png","p6_nice.jpg","p6_ttl.jpg","p6_zhy1.png","p6_zhy2.png","p6_zhy3.png","p7_100.jpg","p7_chicken.png","p7_k3.png","p7_modern.png","p7_most.png","p7_pan.png","p7_ttl.png","p7_win.png","p8_lego.png","p8_live.png","p8_logo.png","p8_more.png","p8_wait.png","p9_btn.png","p9_chicken.png","p9_k3.png","p9_king.png","p9_pointer.png","p9_prize.png","p9_ttl.png"];
            this.imgArr = {};
            this.domain = "img/";
        };
        App.prototype = {
            preload: function(){
                var  arr = this.images, domain = this.domain, a = [], total = 0;
                var p = function(){}, flag = true;

                function handler(){
                    total++;
                    if(total  == arr.length && flag){
                        p(); flag = false;
                    }                    
                }
                for (var i = arr.length - 1; i >= 0; i--) {
                    a[i] = new Image();
                    a[i].crossOrigin = "Anonymous";
                    // var id = arr[i].replace(/.*\/(.*)\..*/, '$1');
                    var _id = arr[i].replace(/.*\//, '').replace(/\..*/, '');
                    this.imgArr[_id] = a[i];
                    a[i].src = domain + arr[i];
                    a[i].onload = function(){
                        handler();
                    }
                    a[i].onerror = function(){
                        handler();
                    }
                }
                return {
                    done: function(f){
                        p = f || p;
                    }
                }
            },
            p1: function(){
                var self = this;
                setTimeout(function(){
                    $(".page.p1").addClass("active")
                },50)
                setTimeout(function(){
                    $(".page.p1").one("touchend", function(){
                        self.p2();
                    })
                }, 4000)
            },
            p2: function(){
                var self = this;
                $(".page.p1").fadeOut();
                $(".page.p2").fadeIn();
                setTimeout(function(){
                    $(".page.p2").addClass("step1")
                }, 500)
                setTimeout(function(){
                    $(".page.p2").addClass("step2")
                }, 9500)
                setTimeout(function(){
                    $(".page.p2").addClass("step3")
                }, 9500+4000)
                setTimeout(function(){
                    $(".page.p2").one("touchend", function(){
                        self.p3();
                    })
                },18000)
            },
            // p2_2: function(){
            //     var self = this;
            //     $(".page.p2").addClass("step2")
            //     setTimeout(function(){
            //         self.p2_3();
            //     },1000)
            // },
            // p2_3: function(){
            //     var self = this;
            //     $(".page.p2").addClass("step3")
            //     setTimeout(function(){
            //         $(".page.p2").one("touchend", function(){
            //             self.p3();
            //         })
            //     },1500)
            // },
            p3: function(){
                var self = this;
                $(".page.p2").fadeOut();
                $(".page.p3").fadeIn();
                setTimeout(function(){
                    $(".page.p3").addClass("active");
                },200)
            },
            p4: function(){
                $(".page.p3").fadeOut();
                $(".page.p4").fadeIn();
            },
            p6: function(){
                var self = this;
                $(".page.p5").fadeOut();
                $(".page.p6").fadeIn();
                setTimeout(function(){
                    $(".page.p6").addClass("active");
                },200)
                setTimeout(function(){
                    $(".page.p6").one("touchend", function(){
                        self.p7();
                    })
                },4200)
            },
            p7: function(){
                var self = this;
                $(".page.p5").fadeOut();
                $(".page.p7").fadeIn();
                setTimeout(function(){
                    $(".page.p7").addClass("active");
                },200)
                setTimeout(function(){
                    $(".page.p7").one("touchend", function(){
                        self.p8();
                    })
                },7200)
            },
            p8: function(){
                var self = this;
                $(".page.p7").fadeOut();
                $(".page.p8").fadeIn();
                setTimeout(function(){
                    $(".page.p8").addClass("active");
                },200)
                setTimeout(function(){
                    $(".page.p8").one("touchend", function(){
                        self.p9();
                    })
                },4200)
            },
            p9: function(){
                var self = this;
                $(".page.p8").fadeOut();
                $(".page.p9").fadeIn();
                setTimeout(function(){
                    $(".page.p9").addClass("active");
                },200)
            },
            init: function(){
                var self = this;
                // p1
                setTimeout(function(){
                    self.p1();
                },150)
                this.preload().done(function(){
                    // self.initStage();
                    // self.initPages();
                });
                $(".page.p3 .btn").on("touchend", function(){
                    $(".page.p3").hide();
                    $(".page.p4").show();
                    $("#video")[0].play();
                })
                $("#video").on("ended pause", function(){
                    $(".page.p4").fadeOut();
                    $(".page.p5").fadeIn();
                    setTimeout(function(){
                        $(".page.p5").addClass("active");
                    },200)
                    setTimeout(function(){
                        $(".page.p5").addClass("step2");
                    },4200)
                    setTimeout(function(){
                        $(".page.p5").one("touchend", function(){
                            self.p7();
                        })
                    },10200)
                })
                $(".page.p9 .btn").on("click", function(){
                    window.location.href = "#"
                })
            }
        }
        window.NyPhile = new App();
        NyPhile.init();
        $(".page").on("touchstart", function(e){

                e.stopPropagation();
                e.preventDefault();
        })
    }

    $(main);
}());