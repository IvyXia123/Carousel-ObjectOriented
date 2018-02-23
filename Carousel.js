(function () {
    //强行暴露一个变量,否则Carousel在闭包内，外部无法获取闭包内的信息：
    window.Carousel = Carousel;

    //轮播图类：
    function Carousel(JSON) {
        this.$dom = $("#" + JSON.id);
        this.$imagesUl = null;
        this.$imagesUlLis = null;

        //小圆点：
        this.$circleOl = null;
        this.$circleLis = null;

        //定时器：
        this.interval = JSON.interval;

        //轮播图的宽高：
        this.width = JSON.width;
        this.height = JSON.height;

        //按钮：
        this.$leftBtn = null;
        this.$rightBtn = null;

        //轮播图片的index
        this.idx = 0;

        //动画的持续时间：
        this.animateDuration = JSON.animateDuration;

        //图片长度：
        this.pictureLength = JSON.images.length;

        //图片地址的数组：
        this.imagesURLArr = JSON.images;

        //初始化
        this.init();

        //事件监听：
        this.bindEvent();

        //定时器：
        this.autoPlay();
    }

    //初始化：
    Carousel.prototype.init = function () {
        //创建ul节点
        this.$imagesUl = $("<ul></ul>");
        this.$dom.append(this.$imagesUl);

        //创建li节点：
        for (var i = 0; i < this.pictureLength; i++) {
            $("<li><img src='" + this.imagesURLArr[i] + "'/></li>").appendTo(this.$imagesUl);
        }

        //获得li节点：
        this.$imagesUlLis = this.$imagesUl.find("li");

        //布局：
        this.$dom.css({
            "position": "relative",
            "width": this.width,
            "height": this.height,
            "overflow": "hidden"
        });

        this.$imagesUlLis.css({
            "position": "absolute",
            "left": this.width,
            "top": 0
        });
        this.$imagesUlLis.eq(0).css("left", 0);

        //创建按钮：
        this.$leftBtn = $("<a href='javascript:;' class='leftBtn'></a>");
        this.$rightBtn = $("<a href='javascript:;' class='rightBtn'></a>");
        this.$leftBtn.appendTo(this.$dom);
        this.$rightBtn.appendTo(this.$dom);

        //创建小圆点：
        this.$circleOl = $("<ol class='circles'></ol>");
        this.$circleOl.appendTo(this.$dom);
        for (var i = 0; i < this.pictureLength; i++) {
            $("<li></li>").appendTo(this.$circleOl);
        }

        //获取小圆点：
        this.$circleLis = this.$circleOl.find("li");

        //给当前小圆点加激活样式：
        this.$circleLis.eq(0).addClass("cur");
    };

    Carousel.prototype.bindEvent = function () {
        var self = this;
        //右边按钮的监听：
        this.$rightBtn.click(function () {
            if (self.$imagesUlLis.is(":animated")) {
                return;
            }
            self.showNext();
        });

        //左边按钮的监听：
        this.$leftBtn.click(function () {
            if (self.$imagesUlLis.is(":animated")) {
                return;
            }
            self.showPrev();
        });

        //小圆点的监听：
        this.$circleLis.click(function () {
            self.show($(this).index());
        });

        //鼠标移入时图片停播：
        this.$dom.mouseenter(function () {
            clearInterval(self.timer);
        });

        //鼠标移出时图片继续播放：
        this.$dom.mouseleave(function () {
            self.autoPlay();
        });
    };

    //展示下一张：
    Carousel.prototype.showNext = function () {
        //点击下一张时，当前图片向左移动：
        this.$imagesUlLis.eq(this.idx).animate({"left": -this.width}, this.animateDuration);
        this.idx++;
        if (this.idx > this.pictureLength - 1) {
            this.idx = 0;
        }
        //当前图片的下一张向右移动：
        this.$imagesUlLis.eq(this.idx).css("left", this.width).animate({"left": 0}, this.animateDuration);

        //圆点的cur：
        this.changeCirclesCur();
    };

    //展示上一张：
    Carousel.prototype.showPrev = function () {
        //点击下一张时，当前图片向右移动：
        this.$imagesUlLis.eq(this.idx).animate({"left": this.width}, this.animateDuration);
        this.idx--;
        if (this.idx < 0) {
            this.idx = this.pictureLength - 1;
        }
        //当前图片的下一张向左移动：
        this.$imagesUlLis.eq(this.idx).css("left", -this.width).animate({"left": 0}, this.animateDuration);

        //圆点的cur：
        this.changeCirclesCur();
    };

    //展示任意：
    Carousel.prototype.show = function (number) {
        var old = this.idx;
        this.idx = number;

        //判断：
        if (this.idx > old) {
            this.$imagesUlLis.eq(old).animate({"left": -this.width}, this.animateDuration);
            this.$imagesUlLis.eq(this.idx).css("left", this.width).animate({"left": 0}, this.animateDuration);
        } else if (this.idx < old) {
            this.$imagesUlLis.eq(old).animate({"left": this.width}, this.animateDuration);
            this.$imagesUlLis.eq(this.idx).css("left", -this.width).animate({"left": 0}, this.animateDuration);
        }

        //圆点的cur：
        this.changeCirclesCur();
    };

    //小圆点的cur：
    Carousel.prototype.changeCirclesCur = function () {
        this.$circleLis.eq(this.idx).addClass("cur").siblings().removeClass("cur");
    };

    // //定时器自动播放：
    Carousel.prototype.autoPlay = function () {
        var self = this;
        this.timer = setInterval(function () {
            self.showNext();
        }, this.interval);
    };
})();