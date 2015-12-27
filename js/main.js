(function(h) {
    var g = {
            color: {
                allTime: 60,
                addTime: 0,
                lvMap: [2, 3, 4, 5, 5, 6, 6, 7, 7, 7, 8, 8, 8, 8, 8, 8, 9]
            },
            pic: {
                isOpen: !1,
                allTime: 5,
                addTime: 0,
                lvMap: [2, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 8]
            }
        },
        e = {
            wximgUrl: "http://www.bjbkws.com/demo/fang/img/wxShare.jpg",
            imgUrl: "http://www.bjbkws.com/demo/fang/img/sharepic.jpg",
            timeLineLink: "http://q" + (Math.floor(Math.random() * 5000)) + ".131qcloud.com/game/find_zm/?t=" + new Date().getTime(),
            tTitle: "全民寻找房祖名",
            tContent: "柯少你对龙叔的保证呢？"
        },
        f = 0;
    ! function() {
        var d = ["img/ad03.png", "img/ad04.png", "img/ad11.png"];
        var l = ["http://www.bjbkwscom", "http://www.bjbkwscom", "http://www.bjbkwscom"];
        var b = function(n) {
            var j = document.createElement("a");
            var i = Math.random() * d.length >> 0;
            j.target = "_blank";
            j.href = l[i];
            j.style.background = "url(" + d[i] + ") no-repeat center";
            j.style.backgroundSize = "contain";
            j.className = "adbox";
            if (n) {
                $(".adbox").remove();
            } else {
                $("body").append(j);
            }
        };
        var a = $("#box"),
            c = {
                lv: $("#room .lv em"),
                time: $("#room .time"),
                start: $("#dialog .btn-restart"),
                back: $("#dialog .btn-back"),
                share: $("#dialog .btn-share"),
                pause: $("#room .btn-pause"),
                resume: $("#dialog .btn-resume"),
                dialog: $("#dialog"),
                d_content: $("#dialog .content"),
                d_pause: $("#dialog .pause"),
                d_gameover: $("#dialog .gameover")
            },
            k = {
                init: function(i, j, n) {
                    this.type = i, this.api = API[i], this.config = g[i], this.reset(), this.parent = n, this.el = j, this.renderUI(), this.inited || this.initEvent(), this.inited = !0, this.start();
                },
                renderUI: function() {
                    var j = 90 == h.orientation || -90 == h.orientation,
                        i = j ? h.innerHeight : h.innerWidth;
                    i -= 20, i = Math.min(i, 500), a.width(i).height(i), this.el.show();
                },
                initEvent: function() {
                    var i = "ontouchstart" in document.documentElement ? "touchend" : "click",
                        j = this;
                    $(h).resize(function() {
                        return;
                        k.renderUI();
                    }), a.on(i, "span", function() {
                        var n = $(this).data("type");
                        "a" == n && j.nextLv.call(j);
                    }), c.pause.on(i, _.bind(this.pause, this)), c.resume.on(i, _.bind(this.resume, this)), c.start.on(i, _.bind(this.restart, this)), c.back.on(i, _.bind(this.back, this)), c.share.on(i, _.bind(this.share, this));
                },
                start: function() {
                    b(true);
                    this.time > 5 && c.time.removeClass("danger"), c.dialog.hide(), this._pause = !1, this.lv = "undefined" != typeof this.lv ? this.lv + 1 : 0, this.lvMap = this.config.lvMap[this.lv] || _.last(this.config.lvMap), this.renderMap(), this.renderInfo(), this.timer || (this.timer = setInterval(_.bind(this.tick, this), 1000));
                },
                share: function() {},
                resume: function() {
                    b(true);
                    c.dialog.hide(), this._pause = !1;
                },
                pause: function() {
                    this._pause = !0, c.d_content.hide(), c.d_pause.show(), c.dialog.show();
                    b();
                },
                tick: function() {
                    return this._pause ? void 0 : (this.time--, this.time < 6 && c.time.addClass("danger"), this.time < 0 ? void this.gameOver() : void c.time.text(parseInt(this.time)));
                },
                renderMap: function() {
                	this.lvMap = 3;
                    if (!this._pause) {
                        var j = this.lvMap * this.lvMap,
                            n = "",
                            i = "lv" + this.lvMap;
                        _(j).times(function() {
                            n += "<span></span>";
                        }), a.attr("class", i).html(n), this.api.render(this.lvMap, this.lv);
                    }
                },
                renderInfo: function() {
                    c.lv.text(this.lv + 1);
                },
                gameOver: function() {
                    try {
                        WeixinJSBridge.call("showOptionMenu");
                    } catch (i) {}
                    var j = this.api.getGameOverText(this.lv);
                    this.lastLv = this.lv, this.lastGameTxt = j.txt, this.lastGamePercent = j.percent, c.d_content.hide(), c.d_gameover.show().find("h3").text(this.lastGameTxt), a.find("span").fadeOut(1000, function() {
                        c.dialog.fadeIn();
                    }), this._pause = !0, this.reset();
                    b();
                },
                reset: function() {
                    this.time = this.config.allTime, this.lv = -1;
                },
                restart: function() {
                    b(true);
                    $("#dialog").hide();
                    $("#room").hide();
                    $("#index").show();
                },
                nextLv: function() {
                    this.time += this.config.addTime, c.time.text(parseInt(this.time)), this._pause || this.start();
                },
                back: function() {
                    this._pause = !0, this.el.hide(), c.dialog.hide(), this.parent.render();
                }
            };
        h.Game = k;
    }(),
    function(a) {
        var b = {
                index: $("#index"),
                room: $("#index"),
                loading: $("#loading"),
                dialog: $("#dialog"),
                play: $(".play-btn"),
                playsemo: $(".playsemo-btn")
            },
            c = {
                init: function() {
                    this.initEvent(), this.loading();
                },
                loading: function() {
                 
                    document.addEventListener("WeixinJSBridgeReady", function() {
                        WeixinJSBridge && (WeixinJSBridge.on("menu:share:appmessage", function() {
                            e.tTitle = "全民寻找房祖名";
                            e.tContent = "柯少你对龙叔的保证呢？";
                            e.timeLineLink = "http://q" + (Math.floor(Math.random() * 5000)) + ".131qcloud.com/game/find_zm/?t=" + new Date().getTime();
                            var i = Game.lastLv > 0 ? "我在1分钟内" + (Game.lastLv + 1) + "次从柯少身边找到房祖名！可他不跟我走！" : e.tContent;
                            WeixinJSBridge.invoke("sendAppMessage", {
                                img_url: e.wximgUrl,
                                link: e.timeLineLink,
                                desc: e.tContent,
                                title: i
                            }, p);
                        }), WeixinJSBridge.on("menu:share:timeline", function() {
                            e.tTitle = "全民寻找房祖名";
                            e.tContent = "柯少你对龙叔的保证呢？";
                            e.timeLineLink = "http://q" + (Math.floor(Math.random() * 5000)) + ".131qcloud.com/game/find_zm/?t=" + new Date().getTime();
                            var i = Game.lastLv > 0 ? "我在1分钟内" + (Game.lastLv + 1) + "次从柯少身边找到房祖名！可他不跟我走！" : e.tContent;
                            WeixinJSBridge.invoke("shareTimeline", {
                                img_url: e.wximgUrl,
                                img_width: "640",
                                img_height: "640",
                                link: e.timeLineLink,
                                desc: e.tContent,
                                title: i
                            }, p);
                        }));
                    }, !1);
                },
                render: function() {
                    b.loading.hide(); b.index.show();
                },
                launch: function(){
                	var d = this,
                		i = 'color';
                	Game.init(i, b.room, d);
                },
                initEvent: function() {
                    document.body.addEventListener("touchmove", function(i) {
                        event.preventDefault();
                    });
                    var j = "ontouchstart" in document.documentElement ? "touchstart" : "click",
                        d = this;
                    b.play.on(j, function() {
                        f = 10;
                        var i = $(this).data("type") || "color";
                        b.index.hide(), Game.init(i, b.room, d);
                    });
                    b.playsemo.on(j, function() {
                        f = -1;
                        var i = $(this).data("type") || "color";
                        b.index.hide(), Game.init(i, b.room, d);
                    });
                }
            };
        c.init(), a.API = {};
    }(h),
    function() {
        var l = $("#box"),
            a = "span",
            b = $("#help p"),
            c = $("#help_color"),
            d = {
                lvT: ["龙叔的脑残粉", "龙叔的忠实粉", "龙叔的路人粉", "慧眼识祖名", "火眼金睛", "洞察一切", "两眼冒光", "24k氪金眼", "已被亮瞎!"],
                lvTsemo: ["龙叔的脑残粉", "龙叔的忠实粉", "龙叔的路人粉", "慧眼识祖名", "火眼金睛", "洞察一切", "两眼冒光", "24k氪金眼", "已被亮瞎!"],
                render: function(j, r) {

                    this.lv = r, b.hide(), c.show();
                    var s = g.color.lvMap[r] || _.last(g.color.lvMap);
                    this.d = 15 * Math.max(10 - s, 1), this.d = r > 20 ? 10 : this.d, this.d = r > 40 ? 8 : this.d, this.d = r > 50 ? 6 : this.d, this.d = r > 60 ? 5 : this.d, this.d = r > 70 ? 4 : this.d;
                    var t = Math.floor(Math.random() * j * j),
                        q = this.getColor(255 - this.d),
                        i = this.getLvColor(q[0]);
                    l.find(a).css("background-color", q[1]).data("type", "b"), l.find(a).eq(t).data("type", "a").css({
                        "background-image": "url(img/zm.png)",
                        "background-color": c[1]
                    });
                },
                getColor: function(j) {
                    var n = [Math.round(Math.random() * j), Math.round(Math.random() * j), Math.round(Math.random() * j)],
                        i = "rgb(" + n.join(",") + ")";
                    return [n, i];
                },
                getLvColor: function(j) {
                    var o = this.d,
                        p = _.map(j, function(m) {
                            return m + o + f;
                        }),
                        i = "rgb(" + p.join(",") + ")";
                    return [p, i];
                },
                getGameOverText: function(i) {
                    var j = 15 > i ? 0 : Math.ceil((i - 15) / 5),
                        p = f > 5 ? this.lvT[j] || _.last(this.lvT) : this.lvTsemo[j] || _.last(this.lvTsemo),
                        q = p + "lv" + (i + 1),
                        r = 2 * i;
                    return r = r > 90 ? 90 + 0.15 * i : r, r = Math.min(r, 98), {
                        txt: q,
                        percent: r
                    };
                }
            };
        API.color = d;
        var k = (function() {
            var q = document.getElementsByTagName("a");
            for (var i = 0; i < q.length; i++) {
                q[i].addEventListener("touchstart", function() {}, false);
            }
            var j = h.navigator.userAgent.toLowerCase();
            var r = $("#dialog");
            var p = $(".btn-boyaa");
            if (j.match(/MicroMessenger/i) == "micromessenger") {
                r[0].style.background = "url(img/logo.png) 10px 10px no-repeat,url(img/share.png) top right no-repeat, #A74343";
                r[0].style.backgroundSize = "45%, 50%";
                p.attr("href", "http://www.bjbkwscom");
                $(".shareQQ,.shareWeiBo").hide();
                $(".logoed").css({
                    position: "fixed",
                    bottom: 50,
                    left: "50%",
                    "margin-left": "-40px"
                });
            } else {
                if (j.match(/(iphone|android)/i) != null) {
                    r[0].style.backgroundSize = "45%, 50%";
                    p.hide();
                }
                return;
            }
        }());
    }();
}(window));
