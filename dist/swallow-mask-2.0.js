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
        this.$maskToast = maskContext.$maskToast;
        this.$maskShade = maskContext.$maskShade;
        this.$master.data(SWALLOW_MASK_KEY, this);
        this.$maskToast.data(SWALLOW_MASK_KEY, this);
        this.$maskShade.data(SWALLOW_MASK_KEY, this);
    }

    //mask原型对象
    SwallowMask.prototype = {
        show: function () {
            this.getShade().show();
            if (this.getToast()) {
                this.getToast().show();
            }
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
            this.getToast().hide();
            this.getShade().hide();
            return this;
        },
        destroy: function () {
            this.getMaster().removeData(SWALLOW_MASK_KEY);
            this.getToast().removeData(SWALLOW_MASK_KEY).remove();
            this.getShade().removeData(SWALLOW_MASK_KEY).remove();
        },
        getMaster: function () {
            return this.$master;
        },
        getToast: function () {
            return this.$maskToast;
        },
        getShade: function () {
            return this.$maskShade;
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
            createShade: function ($master) {
                var masterTop = 0;
                var masterLeft = 0;
                var masterWidth = $master.outerWidth();
                var masterHeight = $master.outerHeight();

                if ($master.parent().length > 0) {
                    var masterOffset = $master.offset();
                    masterTop = masterOffset.top;
                    masterLeft = masterOffset.left;
                }
                var $maskShade = $("<div class='sw-mask-shade' style='position: fixed; z-index: 9000; "
                    + "top: " + masterTop + "px; left: " + masterLeft + "px; background: #999999; "
                    + "opacity: 0.3; filter: alpha(30);"
                    + "width: " + masterWidth + "px; height: " + masterHeight + "px; box-sizing: border-box; display: none;'></div>");
                return $maskShade;
            },
            createToast: function ($master) {

                var masterTop = 0;
                var masterLeft = 0;
                var masterWidth = $master.outerWidth();
                var masterHeight = $master.outerHeight();

                if ($master.parent().length > 0) {
                    var masterOffset = $master.offset();
                    masterTop = masterOffset.top;
                    masterLeft = masterOffset.left;
                }

                var $icon = $("<i style='width: 30px; height: 30px; display: inline-block;"
                    + "background-image: url(data:image/gif;base64,R0lGODlhJQAlAJECAL3L2AYrTv///wAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFCgACACwAAAAAJQAlAAACi5SPqcvtDyGYIFpF690i8xUw3qJBwUlSadmcLqYmGQu6KDIeM13beGzYWWy3DlB4IYaMk+Dso2RWkFCfLPcRvFbZxFLUDTt21BW56TyjRep1e20+i+eYMR145W2eefj+6VFmgTQi+ECVY8iGxcg35phGo/iDFwlTyXWphwlm1imGRdcnuqhHeop6UAAAIfkEBQoAAgAsEAACAAQACwAAAgWMj6nLXAAh+QQFCgACACwVAAUACgALAAACFZQvgRi92dyJcVJlLobUdi8x4bIhBQAh+QQFCgACACwXABEADAADAAACBYyPqcsFACH5BAUKAAIALBUAFQAKAAsAAAITlGKZwWoMHYxqtmplxlNT7ixGAQAh+QQFCgACACwQABgABAALAAACBYyPqctcACH5BAUKAAIALAUAFQAKAAsAAAIVlC+BGL3Z3IlxUmUuhtR2LzHhsiEFACH5BAUKAAIALAEAEQAMAAMAAAIFjI+pywUAIfkEBQoAAgAsBQAFAAoACwAAAhOUYJnAagwdjGq2amXGU1PuLEYBACH5BAUKAAIALBAAAgAEAAsAAAIFhI+py1wAIfkEBQoAAgAsFQAFAAoACwAAAhWUL4AIvdnciXFSZS6G1HYvMeGyIQUAIfkEBQoAAgAsFwARAAwAAwAAAgWEj6nLBQAh+QQFCgACACwVABUACgALAAACE5RgmcBqDB2MarZqZcZTU+4sRgEAIfkEBQoAAgAsEAAYAAQACwAAAgWEj6nLXAAh+QQFCgACACwFABUACgALAAACFZQvgAi92dyJcVJlLobUdi8x4bIhBQAh+QQFCgACACwBABEADAADAAACBYSPqcsFADs=);"
                    + "background-repeat: no-repeat; background-size: 100% 100%; -moz-background-size: 100% 100%;'></i>");
                var iconHeight = $icon.outerHeight();
                $icon.css("margin-top", ((masterHeight - iconHeight) / 2) + "px");

                var $toast = $("<div class='sw-mask-toast' style='position: fixed; z-index: 9001; "
                    + "top: " + masterTop + "px; left: " + masterLeft + "px; "
                    + "width: " + masterWidth + "px; height: " + masterHeight + "px;"
                    + "text-align:center; box-sizing:border-box; display: none;'></div>");

                $toast.append($icon);
                return $toast;
            },
            clickHandler: function (event) {
                event.preventDefault();
                return false;
            }
        },

        //获取默认的$master
        defaultMaster: function () {
            return $(document);
        },

        //创建mask方法
        createMask: function ($master, maskConfig) {
            var maskConfigOptions = $.extend({}, MaskFactory.DEFAULT_MASK_CONFIG, maskConfig);
            if (!maskConfigOptions.preCreate()) {
                return null;
            }

            if (!$master || $master.length === 0) {
                $master = this.defaultMaster();
            }

            var swallowMask = this.getMask($master);
            if (swallowMask && (swallowMask instanceof SwallowMask)) {
                swallowMask.destroy();
            }

            var $maskToast = maskConfigOptions.createToast($master);
            var $maskShade = maskConfigOptions.createShade($master);
            $maskShade.on("click", maskConfigOptions.clickHandler);

            if ($master.parents("body").length === 0) {
                var $body = $(document.body);
                $body.append($maskToast);
                $body.append($maskShade);
            } else {
                $master.after($maskToast);
                $master.after($maskShade);

            }

            swallowMask = new SwallowMask({
                $master: $master,
                $maskToast: $maskToast,
                $maskShade: $maskShade
            });

            swallowMask = maskConfigOptions.postCreate(swallowMask);

            return swallowMask;
        },

        /**
         * 如果$master已经关联swallowMask,则返回原来的swallowMask
         * 如果没有关联的swallowMask, 则创建新的swallowMask
         */
        forkMask: function ($master, maskConfig) {
            if (!$master || $master.length === 0) {
                $master = this.defaultMaster();
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
            $(".sw-mask-shade").each(function (index, item) {
                var swallowMask = $(item).data(SWALLOW_MASK_KEY);
                maskList.push(swallowMask);
            });
            return maskList;
        }
    };
    return MaskFactory;
})(jQuery);