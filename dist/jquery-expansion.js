/**
 * Created by swallow on 2017/4/20.
 */

if (typeof jQuery === 'undefined') {
    throw new Error('该插件需要jQuery');
}

+(function ($) {
    'use strict';

    /**
     * 判断是否存在元素
     * @returns {boolean} true:存在, false:不存在
     */
    $.fn.exists = function () {
        return this.length > 0;
    };

    /**
     * 不能选中文本
     * @returns {*}
     */
    $.fn.unSelectText = function () {
        return this.attr('unselectable', 'on')
            .css('user-select', 'none')
            .on('selectstart', false);
    };

})(jQuery);