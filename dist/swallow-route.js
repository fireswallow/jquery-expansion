/**
 * @author WeiWanrong
 * @date 2018/10/26
 */
var Router = {
    META_TYPE: {
        APPLICATION_FORM_URLENCODED: "application/x-www-form-urlencoded",
        APPLICATION_JSON_UTF8: "application/json;charset=UTF-8"
    },

    /**
     *  初始化Router
     * @param contextConfig {{contextPath: string 上下文路径, ajaxError: function routeAjax发生错误回调函数}}
     * @returns {{routeLocation: routeLocation, routeParam: routeParam, routeAjax: (function(*=): (* | {}))}}
     */
    initRouter: function (contextConfig) {
        return {
            //获取相对contextConfig.contextPath的路径
            routerUrl: function (url) {
                if (url !== undefined && url !== null) {
                    if (url.charAt(0) === "/") {
                        url = contextConfig.contextPath + url;
                    }
                }
                return url;
            },

            //页面跳转
            routeLocation: function (url, params, options) {
                options = $.extend({}, {
                    stringify: false,
                    encoded: true
                }, options);
                var paramArray = [];
                var paramStr = "";
                url = this.routerUrl(url);
                if (params) {
                    if (url.charAt(url.length - 1) !== "?") {
                        url += "?";
                    }

                    $.each(params, function (key, value) {
                        if (options.stringify) {
                            value = JSON.stringify(value);
                            if (options.encoded) {
                                key = encodeURIComponent(key);
                                value = encodeURIComponent(value);
                            }
                            paramArray.push(key + "=" + value);
                        } else {
                            if (value === null || value === undefined) {
                                value = "";
                            }
                            if (options.encoded) {
                                key = encodeURIComponent(key);
                                value = encodeURIComponent(value);
                            }
                            paramArray.push(key + "=" + value);
                        }
                        paramStr = paramArray.join("&");
                    });
                }

                url += paramStr;
                if (options.target) {
                    if (options.target === "_blank") {
                        window.open(url, "options.target");
                    }
                } else {
                    window.location.href = url;
                }
            },

            //获取路径参数
            routeParam: function (options, url) {
                options = $.extend({}, {
                    stringify: false,
                    decoded: true
                }, options);
                if ((typeof url) !== "string") {
                    url = window.location.href;
                }
                if (url.indexOf("?") === -1 || url.indexOf("?") === url.length - 1) {
                    return {};
                }
                url = url.slice(url.indexOf("?") + 1);
                if (url.lastIndexOf("#") !== -1) {
                    url.slice(0, url.lastIndexOf());
                }
                var paramContent = {};
                $.each(url.split("&"), function (index, value) {
                    var pair = value.split("=");
                    var key = pair[0];
                    var content = pair[1];
                    if (options.decoded) {
                        key = decodeURIComponent(key);
                        content = decodeURIComponent(content);
                    }
                    if (options.stringify) {
                        content = JSON.parse(content);
                    }
                    paramContent[key] = content;
                });

                return paramContent;
            },

            //发送ajax请求
            routeAjax: function (options) {
                options.url = this.routerUrl(options.url);

                return $.extend({
                    data: JSON.stringify({}),
                    type: "POST",
                    contentType: Router.META_TYPE.APPLICATION_JSON_UTF8,
                    dataType: "json",
                    error: function (xMLHttpRequest, textStatus, errorThrown) {
                        if ($.isFunction(contextConfig.ajaxError)) {
                            contextConfig.ajaxError({
                                url: options.url,
                                xhr: xMLHttpRequest,
                                text: textStatus,
                                thrown: errorThrown
                            });
                        }
                    }
                }, options)
            }
        }
    }
};
