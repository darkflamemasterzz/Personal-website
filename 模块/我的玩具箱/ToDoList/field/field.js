export function chooseField(selector, completed){
    $('document').ready(function(){
        var chooseField = {};

        // 添加骨架
        chooseField.build = function(selector){
            $(selector)
                .children()
                .hide()
                .parent()
                .append('<div class="fieldLine">' +
                    '    <ul>' +
                    '        <li title="学习"></li>' +
                    '        <li title="日常生活"></li>' +
                    '        <li title="修理、整理"></li>' +
                    '        <li title="义务、任务"></li>' +
                    '        <li title="娱乐"></li>' +
                    '    </ul>'                    +
                    '</div>');
        };

        // 提示气泡
        chooseField.bubbles = function(selector){
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

        // 存储重要程度数据
        chooseField.Data = function(selector){
            // 重要程度选项
            var options = {
                "学习": 0,
                "日常生活": 1,
                "修理、整理": 2,
                "义务、任务": 3,
                "娱乐":4,
            }
            // 存储该临时待办事项的紧急程度数据
            $(".fieldLine").data("field", options[$(selector).attr("title")]);

        };

        // 调用函数
        chooseField.build('.temp');
        chooseField.bubbles('.fieldLine li');
        $('.fieldLine li').click(function(){
            chooseField.Data(this);
            $('.fieldLine').parent().data('field', $(".fieldLine").data("field"));
            // 回调函数
            if ($.isFunction(completed)){
                completed.call(this);
            };
        });

    });
};

