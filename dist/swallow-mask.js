/**
 * (1)当前插件不支持IE8及以下.
 * (2)尽量不要创建新的mask
 * @author lightswallow@163.com
 */

'use strict';

if (typeof jQuery === 'undefined') {
    throw new Error('该插件需要jQuery');
}

var MaskFactory = (function ($) {
    var SWALLOW_MASK_KEY = "SWALLOW_MASK";

    //mask构造函数
    function SwallowMask(maskContext) {
        this.$master = maskContext.$master;
        this.$mask = maskContext.$mask;
        this.$master.data(SWALLOW_MASK_KEY, this);
        this.$mask.data(SWALLOW_MASK_KEY, this);
    }

    //mask原型对象
    SwallowMask.prototype = {
        show: function () {
            this.getMaskEle().show();
            return this;
        },
        showLast: function () {
            var maskList = MaskFactory.getMaskList();
            $.each(maskList, function (index, item) {
                item.close();
            });
            this.show();
            return this;
        },
        close: function (remove) {
            this.getMaskEle().hide();
            return this;
        },
        destroy: function () {
            this.getMasterEle().removeData(SWALLOW_MASK_KEY);
            this.getMaskEle().removeData(SWALLOW_MASK_KEY).remove();
        },
        getMasterEle: function () {
            return this.$master;
        },
        getMaskEle: function () {
            return this.$mask;
        }
    };

    SwallowMask.prototype.constructor = SwallowMask;

    //mask工厂
    var MaskFactory = {
        //工厂默认配置
        DEFAULT_MASK_CONFIG: {
            preCreate: function () {
                return true;
            },

            postCreate: function (swallowMask) {
                return swallowMask;
            },
            maskStyle: function (originalCss) {
                return originalCss;
            },
            clickHandler: function (event) {
                event.preventDefault();
                return false;
            }
        },

        //获取默认的$master
        defaultMasterEle: function () {
            return $(document);
        },

        //创建mask方法
        createMask: function ($master, maskConfig) {
            var maskConfigOptions = $.extend({}, MaskFactory.DEFAULT_MASK_CONFIG, maskConfig);
            if (!maskConfigOptions.preCreate()) {
                return null;
            }

            if (!$master || $master.length === 0) {
                $master = this.defaultMasterEle();
            }

            var swallowMask = this.getMask($master);
            if (swallowMask && (swallowMask instanceof SwallowMask)) {
                swallowMask.destroy();
            }

            var masterTop = 0;
            var masterLeft = 0;
            var masterWidth = $master.outerWidth();
            var masterHeight = $master.outerHeight();

            if ($master.parent().length > 0) {
                var masterOffset = $master.offset();
                masterTop = masterOffset.top;
                masterLeft = masterOffset.left;
            }

            var cssContent = {
                position: "fixed",
                "z-index": 999999,
                top: masterTop,
                left: masterLeft,
                background: "rgba(200,200,200,0.4)",
                opacity: 1,
                filter: "alpha(opacity = 100)",
                width: masterWidth,
                height: masterHeight,
                "box-sizing": "border-box",
                display: "none"
            };

            cssContent = maskConfigOptions.maskStyle(cssContent);

            var $maskPanel = $("<div class='sw-mask-panel'></div>");
            $maskPanel.css(cssContent);
            var $loadMessage = this.createLoadMessage($maskPanel);
            $maskPanel.append($loadMessage);

            $maskPanel.on("click", maskConfigOptions.clickHandler);

            if ($master.parents("body").length === 0) {
                $(document.body).append($maskPanel);
            } else {
                $master.after($maskPanel);
            }

            swallowMask = new SwallowMask({
                $master: $master,
                $mask: $maskPanel
            });

            swallowMask = maskConfigOptions.postCreate(swallowMask);

            return swallowMask;
        },

        //创建加载信息
        createLoadMessage: function ($maskPanel) {
            var $loadMessage = $("<div class='load-panel'></div>");

            var $icon = $("<i></i>");
            $icon.css({
                width: 30,
                height: 30,
                display: "inline-block",
                "line-height": "100%",
                "vertical-align": "middle",
                "background-image": "url(data:image/gif;base64,R0lGODlhJQAlAJECAL3L2AYrTv///wAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFCgACACwAAAAAJQAlAAACi5SPqcvtDyGYIFpF690i8xUw3qJBwUlSadmcLqYmGQu6KDIeM13beGzYWWy3DlB4IYaMk+Dso2RWkFCfLPcRvFbZxFLUDTt21BW56TyjRep1e20+i+eYMR145W2eefj+6VFmgTQi+ECVY8iGxcg35phGo/iDFwlTyXWphwlm1imGRdcnuqhHeop6UAAAIfkEBQoAAgAsEAACAAQACwAAAgWMj6nLXAAh+QQFCgACACwVAAUACgALAAACFZQvgRi92dyJcVJlLobUdi8x4bIhBQAh+QQFCgACACwXABEADAADAAACBYyPqcsFACH5BAUKAAIALBUAFQAKAAsAAAITlGKZwWoMHYxqtmplxlNT7ixGAQAh+QQFCgACACwQABgABAALAAACBYyPqctcACH5BAUKAAIALAUAFQAKAAsAAAIVlC+BGL3Z3IlxUmUuhtR2LzHhsiEFACH5BAUKAAIALAEAEQAMAAMAAAIFjI+pywUAIfkEBQoAAgAsBQAFAAoACwAAAhOUYJnAagwdjGq2amXGU1PuLEYBACH5BAUKAAIALBAAAgAEAAsAAAIFhI+py1wAIfkEBQoAAgAsFQAFAAoACwAAAhWUL4AIvdnciXFSZS6G1HYvMeGyIQUAIfkEBQoAAgAsFwARAAwAAwAAAgWEj6nLBQAh+QQFCgACACwVABUACgALAAACE5RgmcBqDB2MarZqZcZTU+4sRgEAIfkEBQoAAgAsEAAYAAQACwAAAgWEj6nLXAAh+QQFCgACACwFABUACgALAAACFZQvgAi92dyJcVJlLobUdi8x4bIhBQAh+QQFCgACACwBABEADAADAAACBYSPqcsFADs=)",
                "background-repeat": "no-repeat",
                "background-size": "100% 100%",
                "-moz-background-size": "100% 100%"
            });

            var iconHeigth = $icon.outerHeight();
            $loadMessage.css({
                position: "relative",
                top: "50%",
                width: "100%",
                height: iconHeigth,
                "margin-top": -(iconHeigth / 2),
                "line-height": "100%",
                "text-align": "center",
                "box-sizing": "border-box"
            });

            $loadMessage.append($icon);
            return $loadMessage;
        },

        /**
         * 如果$master已经关联swallowMask,则返回原来的swallowMask
         * 如果没有关联的swallowMask, 则创建新的swallowMask
         */
        forkMask: function ($master, maskConfig) {
            if (!$master || $master.length === 0) {
                $master = this.defaultMasterEle();
            }
            var swallowMask = this.getMask($master);
            if (swallowMask && (swallowMask instanceof SwallowMask)) {
                return swallowMask;
            } else {
                return this.createMask($master, maskConfig);
            }
        },

        //根据$master获取swallowMask
        getMask: function ($master) {
            return $master.data(SWALLOW_MASK_KEY);
        },

        //获取所有mask对象
        getMaskList: function () {
            var maskList = [];
            $(".sw-mask-panel").each(function (index, item) {
                var swallowMask = $(item).data(SWALLOW_MASK_KEY);
                maskList.push(swallowMask);
            });
            return maskList;
        }
    };
    return MaskFactory;
})(jQuery);