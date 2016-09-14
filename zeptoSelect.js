/**
 * Created by zq on 2016/9/7.
 */
;(function ($, window, document, undefined) {
    'use strict';   //严格模式
    var pluginName = 'zeptoSelect',
        defaults = {};

    function Plugin(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);

        this.init();  //初始化参数
        this.render();  //生成dom结构
        this.eventHandle(); // 绑定事件
    }

    Plugin.prototype = {
        init: function () {
            //初始化所有参数
            this.defaults = defaults;
            this.name = pluginName;
            this.startY = '';        //点击时当前位置相对于可视窗体Y的坐标
            this.moveY = '';          //移动时当前位置相对于可视窗体Y的坐标
            this.endY = '';       //相对于点击是 移动的距离
            this.par = '';       //当前元素父节点
            this.parH = '';         //  当前元素父节点高
            this.parT = '';         //当前元素父节点的offsetTop值
            this.thisT = '';     //当前元素的offsetTop值
            this.thisH = '';       //当前元素的高度
            this._dir = '';     //用来判断滑动方向
            this.badT = '';    //当前元素的offsetTop减去父元素offsetTop值
            this.toY = '';

        },
        render: function () {

        },
        eventHandle: function () {
            this.touchStart(this.element);
            this.touchMove(this.element);
            this.touchEnd(this.element);
        },
        touchStart: function (ele) {
            var _self = this;
            $(ele).on('touchstart', function (e) {
                var touch = e.targetTouches[0];
                _self.startY = touch.clientY;
                _self.par = $(ele).parent();
                _self.parH = _self.par.height();
                _self.parT = _self.par.offset().top;
                _self.thisT = $(ele).offset().top;
                _self.thisH = $(ele).height();
                _self.badT = _self.thisT - _self.parT;
                _self.toY =_self.endY;
            })
        },
        touchMove: function (ele) {
            var _self = this;
            $(ele).on('touchmove', function (e) {
                var touch = e.targetTouches[0];
                _self.moveY = touch.clientY;
                _self.endY = _self.startY - _self.moveY;
                _self._dir = _self.endY > 0 ? '1' : '-1';

                _self.public(_self.element);

            })
        },
        touchEnd: function (ele) {
            var _self = this;
            $(ele).on('touchend', function (e) {

                if( _self.toY ==_self.endY){
                    return;
                }

                _self.public(_self.element);

            })
        },
        public : function (ele) {
            var _self = this;
            if (_self._dir == '-1' && -_self.endY + _self.thisT >= 0) {
                $(ele).css({
                    top: 0 + 'px'
                });
            } else if (_self._dir == '1' && Math.abs(-_self.endY + _self.badT) >= Math.abs(_self.thisH - _self.parH)) {
                $(ele).css({
                    top:- (_self.thisH - _self.parH) + 'px'
                });
            } else {
                $(ele).css({
                    top: -_self.endY + _self.badT + 'px'
                });
            }
        }

    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$(this).data('plugin_' + pluginName)) {
                return $(this).data('plugin_' + pluginName, new Plugin(this, options))
            }
        })
    }
})(Zepto, window, document);