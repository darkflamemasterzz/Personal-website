// 导入模块
import {chooseDate} from './SelectionList/SelectionList.js';
import {chooseGrade} from './grade/grade.js';
import {chooseField} from './field/field.js';

$('document').ready(function(){
    // 创建LIST对象
    var LIST = {};

    // 点击tickCheck按钮
    LIST.tickCheck = function(selector, complete){
        // 点击tickCheck按钮
        $('.tickCheck').click(function(e){
            $(this).toggleClass('tickChecked');
            // 阻止事件传播
            e.stopPropagation();
        });
        // 回调
        if ($.isFunction(complete)){
            complete.call(this);
        };
    };
    LIST.tickCheck('.List li:not("#ListTitle")');


    // 点击此待办事项，在此下方添加一个兄弟代办事项
    LIST.add = function(selector){
        $(selector).click(function(){
            $(this)
                .after(   // 原生input太丑，要改
                    '<li class="temp">' +
                    '<input type="text" value="请输入你的要添加代办事项" />' +
                    '<input class="okButton" type="button" value="ok"/>' +
                    '<input class="cancelButton" type="button" value="cancel"/>'+
                    '</li>'
                )
                .hide()
                .slideDown(150,'swing');
            // 点击ok按钮 确认添加代办事项
            $('.okButton').click(function(){
                // 获取 textbox里的数据
                var tempList = $(this).parent();
                textbox = $(this).parent().children(":text");
                textbox.data("text", textbox.val());
                // 填写标签表单
                LIST.addTags('.temp');
            });
            // 点击cancel按钮 取消添加代办事项
            $('.cancelButton').click(function(){
                $(this)
                    .parent()
                    .remove();
            });
        });
    };

    var textbox;
    LIST.add('.List li');

    // 添加标签
    LIST.addTags = function(selector){
        // one time or repeat标签
        $(selector)
            .children()
            .hide()
            .parent()
            .append('<span>one time:</span> <span class="tickCheck OneTickCheck"></span>'+
                '<span>repeat:</span><span class="tickCheck RepeatTickCheck"></span>');

        // 为这组标签表单调用tickCheck函数
        LIST.tickCheck(selector, function(){
            // 保存 one time or repeat标签数据
            var flag;
            if ($('.OneTickCheck').hasClass('tickChecked')){
                // flag = 1 代表 onetime
                flag = 1;
            }else{
                // flag = 0 代表 repeat
                flag = 0;
            }
            // OneTimeOrRepeat标签数据项
            $(selector).data('OneTimeOrRepeat', flag);

            $(selector + ' .tickCheck').click(function(){
                // 时间分类标签
                $(selector)
                    .children()
                    .hide()  // 隐藏one time or repeat标签表
                    .parent()
                    .append('<div class="timeLine">' +
                        '    <ul>' +
                        '        <li title="今天"></li>' +
                        '        <li title="明天"></li>' +
                        '        <li title="+2"></li>' +
                        '        <li title="+3"></li>' +
                        '        <li title="+4"></li>' +
                        '        <li title="+5"></li>' +
                        '        <li title="+6"></li>' +
                        '    </ul>' +
                        '</div>');
                    var Date = chooseDate('.timeLine li', function(){
                        // 重要程度分类标签
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
                        var Grade = chooseGrade(function(){
                            // 领域分类标签
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
                            var Field = chooseField('.fieldLine li', function(){
                                console.log($(selector).data('OneTimeOrRepeat'));
                                console.log($(selector).data('date').getFullYear());
                                console.log($(selector).data('grade'));
                                console.log($(selector).data('field'));

                                console.log(textbox.data("text"));
                                // 删除temp并生成新的代办事项
                                $(selector)
                                    .hide()
                                    // 以该代办事项的描述文本作为该待办事项唯一标识的类
                                    .after('<li class=' + textbox.data("text") + ' ToDoList><span class="tickCheck"></span><span class=text></span></li>');
                                $('.'+textbox.data("text")+ ' .text').text(textbox.data("text"));
                                // 为新增加的代办事项添加必要的方法
                                LIST.add('.currentList');
                                LIST.tickCheck('.currentList');
                                // 为新增加的代办事项添加各类标签
                                $('.'+textbox.data("text")).data("OneOrRepeat", $(selector).data('OneTimeOrRepeat'));
                                $('.'+textbox.data("text")).data("date", $(selector).data('date'));
                                $('.'+textbox.data("text")).data("grade", $(selector).data('grade'));
                                $('.'+textbox.data("text")).data("field", $(selector).data('field'));
                                // 添加显示便签方法
                                LIST.showTags('.'+textbox.data("text"));
                                // 移除temp
                                $(".temp").remove();
                            });
                        });
                    });

            });
        });


    };
    // 显示标签函数
    // 先隐藏标签面板
    $('.showTags')
        .css('left','-300px');
    LIST.showTags = function(selector){
        $(selector).hover(function(){
            // 把标签数据转换成要显示的内容
            var start = "?";
            var year = $(selector).data("date").getFullYear();
            var months = {
                0: 1,
                1: 2,
                2: 3,
                3: 4,
                4: 5,
                5: 6,
                6: 7,
                7: 8,
                8: 9,
                9: 10,
                10: 11,
                11: 12,
            };
            var month = months[$(selector).data("date").getMonth()];
            var date = $(selector).data("date").getDate();
            var days = {
                0: "星期日",
                1: "星期一",
                2: "星期三",
                3: "星期四",
                4: "星期五",
                5: "星期六",
            };
            var day = days[$(selector).data("date").getDay()];
            var end = "DeadLine: " + year + "." + month + "." + date + "  " + day;
            var ORR;
            if ($(selector).data("OneOrRepeat")===1){
                ORR = "一次性事务";
            }else{
                ORR = "常做事务"
            };
            var gradeOptions = {
                0: "重要紧急",
                1: "重要不紧急",
                2: "不重要紧急",
                3: "不重要不紧急",
            };
            var grade = gradeOptions[$(selector).data("grade")];
            var fieldOptions = {
                0: "学习",
                1: "日常生活",
                2: "修理、整理",
                3: "义务、任务",
                4: "娱乐",
            };
            var field = fieldOptions[$(selector).data("field")];
            // 鼠标悬停于此代办事项： 加载相应的标签数据&显示标签面板
            $('.tag_1').text("n天后完成");
            $('.tag_2').text(start);
            $('.tag_3').text(end);
            $('.tag_4').text(ORR);
            $('.tag_5').text(grade);
            $('.tag_6').text(field);
            $('.showTags').animate({
                left: 0,
            },300);
        },function(){
            // 鼠标离开此代办事项： 终结动画并 收起标签&删除标签数据
            $('.tag_1').text("");
            $('.tag_2').text("");
            $('.tag_3').text("");
            $('.tag_4').text("");
            $('.tag_5').text("");
            $('.tag_6').text("");
            $('.showTags')
                .stop()
                .animate({
                    left: '-300px',
                },100);
        });
    };

    LIST.showTags('.ToDoList');

});