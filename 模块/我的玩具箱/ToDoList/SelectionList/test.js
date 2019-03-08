$('document').ready(function(){
    var chooseDate = {};

    // 添加骨架
    $(".List").append('<div class="timeLine">\n' +
        '    <ul>\n' +
        '        <li title="今天"></li>\n' +
        '        <li title="明天"></li>\n' +
        '        <li title="+2"></li>\n' +
        '        <li title="+3"></li>\n' +
        '        <li title="+4"></li>\n' +
        '        <li title="+5"></li>\n' +
        '        <li title="+6"></li>\n' +
        '    </ul>\n' +
        '</div>');

// 提示气泡
    chooseDate.bubbles = function(selector){
        $(selector).hover(function(){
            // 鼠标悬停于此时，生成气泡
            // 判断是否已经存在气泡： 如果已经有气泡了 就不必再生成了
            if( ! Boolean($(this).children('.bubble').hasClass('bubble'))){
                $(this).append(
                    '<div class="bubble">' +
                    '   <div class="message">' +
                    $(this).attr('title') +
                    '   </div>' +
                    '   <div class="tail"></div>' +
                    '</div>'
                );
            }
            // 显示气泡
            $(this).children('.bubble').show();
        }, function(){
            // 鼠标离开时隐藏气泡
            $(this).children('.bubble').hide();
        });
    };

// 存储时间数据
    chooseDate.Date = function(selector){
        // 获取当前日期
        var currentDate = new Date();
        // 创建该待办事项时的日期
        // 初创毫秒数
        $(selector).data('OriginTime', currentDate.getTime());
        // 初创年
        $(selector).data('OriginYear', currentDate.getFullYear());
        // 初创月
        $(selector).data('OriginMonth', currentDate.getMonth());
        // 初创日
        $(selector).data('OriginDate', currentDate.getDate());
        // 初创星期
        $(selector).data('OriginDay', currentDate.getDay());
        // 该代办事项该在几天后做
        var dayGone = {
            '今天': 0,
            '明天': 1,
            '+2': 2,
            '+3': 3,
            '+4': 4,
            '+5': 5,
            '+6': 6,
        }
        currentDate.setTime($(selector).data('OriginTime') + dayGone[$(selector).attr('title')] * 86400000);
        // 目标年
        console.log(currentDate.getFullYear());
        // 目标月
        console.log(currentDate.getMonth());
        // 目标日
        console.log(currentDate.getDate());
        // 目标星期
        console.log(currentDate.getDay());

        return currentDate;
    };


// 调用函数
    chooseDate.bubbles('.timeLine li');
    $('.timeLine li').click(function(){
        $('.timeLine li').data('date', chooseDate.Date(this));
        $('.timeLine').parent().data('date', $('.timeLine li').data('date'));
        // 回调函数
        if ($.isFunction(completed)){
            completed.call(this);
        };
    });
});