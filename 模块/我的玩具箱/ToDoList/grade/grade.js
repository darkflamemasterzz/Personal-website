export function chooseGrade(completed){

        var chooseGrade = {};

        // 添加骨架
        chooseGrade.build = function(selector){
            $(selector)
                .children()
                .hide()
                .parent()
                .append('<div class="gradeLine">' +
                    '    <ul>' +
                    '        <li title="重要紧急"></li>' +
                    '        <li title="重要不紧急"></li>' +
                    '        <li title="不重要紧急"></li>' +
                    '        <li title="不重要不紧急"></li>' +
                    '    </ul>'                    +
                    '</div>');
        };

        // 提示气泡
        chooseGrade.bubbles = function(selector){
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
        chooseGrade.Data = function(selector){
            // 重要程度选项
            var options = {
                "重要紧急": 0,
                "重要不紧急": 1,
                "不重要紧急": 2,
                "不重要不紧急": 3,
            }
            // 存储该临时待办事项的紧急程度数据
            $(".gradeLine").data("grade", options[$(selector).attr("title")]);

        };

        // 调用函数
        chooseGrade.build('.temp');
        chooseGrade.bubbles('.gradeLine li');
        $('.gradeLine li').click(function(){
            chooseGrade.Data(this);
            $('.gradeLine').parent().data('grade', $(".gradeLine").data("grade"));
            // 回调函数
            if ($.isFunction(completed)){
                completed.call(this);
            };
        });




};

