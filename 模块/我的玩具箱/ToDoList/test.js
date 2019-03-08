// 导入模块
import {chooseDate} from './SelectionList/SelectionList.js';
import {chooseGrade} from './grade/grade.js';
import {chooseField} from './field/field.js';

$('document').ready(function() {
// 创建LIST对象
    var LIST = {};

// LIST对象中的方法：tickCheck  点击tickCheck按钮
    LIST.tickCheck = function (selector, complete) {
        $('.tickCheck').click(function (e) {
            $(this).toggleClass('tickChecked');
            e.stopPropagation();
        });
        // 回调
        if ($.isFunction(complete)) {
            complete.call(this);
        };
    };


// LIST对象中的方法：add  点击此待办事项，在此下方添加一个兄弟代办事项
    LIST.add = function (selector) {
        $(selector).click(function () {
            $(this)
                .after(   // 原生input太丑，要改
                    '<li class="temp">' +
                    '<input type="text" value="请输入你的要添加代办事项" />' +
                    '<input class="okButton" type="button" value="ok"/>' +
                    '<input class="cancelButton" type="button" value="cancel"/>' +
                    '</li>'
                )
                .hide()
                .slideDown(150, 'swing');
            // 点击ok按钮 确认添加代办事项
            $('.okButton').click(function () {
                // 获取 textbox里的数据
                var tempList = $(this).parent();
                textbox = $(this).parent().children(":text");
                textbox.data("text", textbox.val());
                /*textbox.data("text", textbox.val());*/
                // 填写标签表单
                LIST.addTags('.temp', function () {
                    // 读取该列表有多少个代办事项 以确认ID号码
                    var CountList = $('.List .ToDoList').length + 1;
                    // 删除temp并生成新的代办事项
                    $('.temp')
                        .hide()
                        // 以该代办事项的描述文本作为该待办事项唯一标识的类
                        .after('<li class="' + textbox.data("text") + ' ToDoList" id="' + CountList + '"><span class="tickCheck"></span><span class=text></span><span class="delete"></span></li>');
                    $('.' + textbox.data("text") + ' .text').text(textbox.data("text"));
                    // 为新增加的代办事项添加必要的方法
                    LIST.add('.' + textbox.data("text"));
                    LIST.tickCheck('.' + textbox.data("text"));
                    LIST.delete('.' + textbox.data("text"));
                });
                // 为新增的待办事项传入标签数据
                $('.' + textbox.data("text")).data("OneOrRepeat", LIST.addTags('.temp')[0]);
                $('.' + textbox.data("text")).data("date", LIST.addTags('.temp')[1]);
                $('.' + textbox.data("text")).data("grade", LIST.addTags('.temp')[2]);
                $('.' + textbox.data("text")).data("field", LIST.addTags('.temp')[3]);
                console.log(LIST.addTags('.temp'));
                console.log(LIST.addTags('.temp')[1]);
                console.log(textbox.data("text"));
                console.log($('.' + textbox.data("text")));
                console.log($('.' + textbox.data("text")).data("date"));
                // 显示标签面板
                LIST.showTags(textbox.data("text"));
                // 保存数据到本地
                LIST.saveLocalDate(textbox.data("text"));
                // 移除temp
                $(".temp").remove();
                // 允许删除刚添加的待办事项
                LIST.delete(".ToDoList");
            });
            // 点击cancel按钮 取消添加代办事项
            $('.cancelButton').click(function () {
                $(this)
                    .parent()
                    .remove();
            });
        });
    };

// LIST对象中的方法：addTags 填写便签表单、添加标签
    LIST.addTags = function (selector, complete) {
        console.log("add tags!");
        // 暴露在外的数据
        var date;
        var grade;
        var field;
        // one time or repeat标签
        $(selector)
            .children()
            .hide()
            .parent()
            .append('<span>one time:</span> <span class="tickCheck OneTickCheck"></span>' +
                '<span>repeat:</span><span class="tickCheck RepeatTickCheck"></span>');

        // 为这组标签表单调用tickCheck函数
        LIST.tickCheck(selector, function () {
            console.log("selector:"+selector);
            console.log("tickCheck");
            // 保存 one time or repeat标签数据
            var flag;
            if ($('.OneTickCheck').hasClass('tickChecked')) {
                console.log('oneTime');
                // flag = 1 代表 onetime
                flag = 1;
            } else {
                console.log('repeat');
                // flag = 0 代表 repeat
                flag = 0;
            }
            // OneTimeOrRepeat标签数据项
            $(selector).data('OneTimeOrRepeat', flag);
            $(selector + ' .tickCheck').click(function () {
                console.log('click the ORR button!');
                // 时间分类标签
                var Date = chooseDate('.timeLine li', function () {
                    var date = $('.timeLine li').data('date');
                    console.log($('.timeLine li').data('date'));
                    // 重要程度分类标签
                    var Grade = chooseGrade(function () {
                        var grade = $(".gradeLine").data("grade");
                        // 领域分类标签
                        var Field = chooseField('.fieldLine li');
                        var field = $(".fieldLine").data("field");
                    });
                });
            });
        });
        // 回调函数
        if ($.isFunction(complete)) {
            complete.call(this);
        };
        // 暴露在外的数据
        // 返回填写的标签数据结果为一个数组
        return [$(selector).data('OneTimeOrRepeat'), date, grade, field];
    };


// 显示数据标签
    LIST.showTags = function (selector) {
        // 获取当前时间
        var nowDate = new Date();
        var currentDate = nowDate.getTime();
        //标签转换器
        var months = {         //  考虑把这一场串的东西封装起来？ &   把它封装成内置函数？
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
        var days = {
            0: "星期日",
            1: "星期一",
            2: "星期三",
            3: "星期四",
            4: "星期五",
            5: "星期六",
        };
        var ORR;
        if ($("." + selector).data("OneOrRepeat") === 1) {
            ORR = "一次性事务";
        } else {
            ORR = "常做事务"
        };
            var gradeOptions = {
                0: "重要紧急",
                1: "重要不紧急",
                2: "不重要紧急",
                3: "不重要不紧急",
            };
            var fieldOptions = {
                0: "学习",
                1: "日常生活",
                2: "修理、整理",
                3: "义务、任务",
                4: "娱乐",
            };
            // 执行hover事件时： 把数据写进标签面板
            /*$(selector).hover(function () {        // 每次执行hover都要重新读写数据  太消耗性能了
                $('.tag_1 .tagText').text(Math.ceil(($('.' + selector).data("date").getTime() - currentDate) / 86400000));  //remain
                $('.tag_3 .tagText').text($('.' + selector).data("date").getFullYear() + "." + $(selector).data("date").getMonth() + "." + $(selector).data("date").getDate() + "  " + days[$(selector).data("date").getDay()]);   // end
                $('.tag_4 .tagText').text(ORR);  // orr
                $('.tag_5 .tagText').text(gradeOptions[$('.' + selector).data("grade")]);  // grade
                $('.tag_6 .tagText').text(fieldOptions[$('.' + selector).data("field")]);  // field
                $('.showTags').animate({left: 0,}, 300);
            }, function () {
                // 鼠标离开此代办事项： 终结动画并 收起标签&删除标签数据
                $('.tag_1 .tagText').text("");
                $('.tag_2 .tagText').text("");
                $('.tag_3 .tagText').text("");
                $('.tag_4 .tagText').text("");
                $('.tag_5 .tagText').text("");
                $('.tag_6 .tagText').text("");
                $('.showTags')
                    .stop()
                    .animate({
                        left: '-300px',
                    }, 50);
            });
            */
    };


// 利用localStorage  将数据保存到本地
    LIST.saveLocalDate = function (selector) {
        localStorage.AllLocalText = localStorage.AllLocalText + '/' + $('.' + selector + ' .text').text();
        localStorage.AllLocalORR = localStorage.AllLocalORR + '/' + $('.' + selector).data("OneOrRepeat");
        console.log(selector);
        console.log($('.' + selector));
        console.log($('.' + selector).data("date"));
        localStorage.AllLocalTime = localStorage.AllLocalTime + '/' + $('.' + selector).data("date").getTime();
        localStorage.AllLocalYear = localStorage.AllLocalYear + '/' + $('.' + selector).data("date").getFullYear();
        localStorage.AllLocalMonth = localStorage.AllLocalMonth + '/' + $('.' + selector).data("date").getMonth();
        localStorage.AllLocalDate = localStorage.AllLocalDate + '/' + $('.' + selector).data("date").getDate();
        localStorage.AllLocalDay = localStorage.AllLocalDay + '/' + $('.' + selector).data("date").getDay();
        localStorage.AllLocalGrade = localStorage.AllLocalGrade + '/' + $('.' + selector).data("grade");
        localStorage.AllLocalField = localStorage.AllLocalField + '/' + $('.' + selector).data("field");
    };


// 加载本地localStorage数据
    LIST.loadLocalDate = function () {
        if (localStorage.AllLocalText) {
            var localTexts = localStorage.AllLocalText.split("/");
            var localORRs = localStorage.AllLocalORR.split("/");
            var localGrades = localStorage.AllLocalGrade.split("/");
            var localFields = localStorage.AllLocalField.split("/");
            var localTimes = localStorage.AllLocalTime.split("/");
            var localYears = localStorage.AllLocalYear.split("/");
            var localMonths = localStorage.AllLocalMonth.split("/");
            var localDates = localStorage.AllLocalDate.split("/");
            var localDays = localStorage.AllLocalDay.split("/");

            // 获取本地数据的数目
            var localLength = localTexts.length;
            // 添加font类 以便后续添加待办事项
            $("#ListTitle").addClass('font');
            // 开始循环 逐个把本地数据生生初始待办事项(i = 1是因为数据开头的undefined是无用数据)
            for (var i = 1; i < localLength; i++) {
                $('.font')
                    .after('<li class="' + i + ' ToDoList StoredItem" id="' + i + '"><span class="tickCheck"></span><span class=text></span><span class="delete"></span></li>');
                $('.' + i + ' .text').text(localTexts[i]);
                // 为每个代办事项生成标签数据
                LIST.showTags(i);

                // font类接力棒交接
                $('.font').removeClass('font');
                $('.' + i).addClass('font');
            }
            ;
            // 为载入的local待办事项添加所需方法
            LIST.add(".StoredItem");
            LIST.tickCheck(".StoredItem");
        }
        ;
    };


// 删除代办事项
    LIST.delete = function (selector) {
        // 提示用户该delete按钮可以点击
        $(selector + " .delete").hover(function () {
            $(this).toggleClass("deleteHover");
        }, function () {
            $(this).toggleClass("deleteHover");
        });
        // 正式删除代办事项
        $(selector + " .delete").click(function () {
            // 删除它的localStorage数据

            // 获取它的排序号
            var num = parseInt($(this).parent().attr("id"));
            // 删除、重组localStorage数据
            var localTexts = localStorage.AllLocalText.split("/");
            var localORRs = localStorage.AllLocalORR.split("/");
            var localGrades = localStorage.AllLocalGrade.split("/");
            var localFields = localStorage.AllLocalField.split("/");
            var localTimes = localStorage.AllLocalTime.split("/");
            var localYears = localStorage.AllLocalYear.split("/");
            var localMonths = localStorage.AllLocalMonth.split("/");
            var localDates = localStorage.AllLocalDate.split("/");
            var localDays = localStorage.AllLocalDay.split("/");
            localStorage.AllLocalText = "";
            localStorage.AllLocalORR = "";
            localStorage.AllLocalGrade = "";
            localStorage.AllLocalField = "";
            localStorage.AllLocalTime = "";
            localStorage.AllLocalYear = "";
            localStorage.AllLocalMonth = "";
            localStorage.AllLocalDate = "";
            localStorage.AllLocalDay = "";

            var len = localTexts.length;
            for (var i = 1; i < len; i++) {
                if (i !== num) {
                    localStorage.AllLocalText = localStorage.AllLocalText + "/" + localTexts[i];
                    localStorage.AllLocalORR = localStorage.AllLocalORR + "/" + localORRs[i];
                    localStorage.AllLocalGrade = localStorage.AllLocalGrade + "/" + localGrades[i];
                    localStorage.AllLocalField = localStorage.AllLocalField + "/" + localFields[i];
                    localStorage.AllLocalTime = localStorage.AllLocalTime + "/" + localTimes[i];
                    localStorage.AllLocalYear = localStorage.AllLocalYear + "/" + localYears[i];
                    localStorage.AllLocalMonth = localStorage.AllLocalMonth + "/" + localMonths[i];
                    localStorage.AllLocalDate = localStorage.AllLocalDate + "/" + localDates[i];
                    localStorage.AllLocalDay = localStorage.AllLocalDay + "/" + localDays[i];
                }
            }
            ;
            // 把该代办事项从DOM中删除
            $(this).parent().remove();
        });
    };


// FIRST: 开局操作
var textbox;
// 先隐藏标签面板
    $('.showTags')
        .css('left', '-300px');

// 加载local待办事项
    LIST.loadLocalDate();
    LIST.tickCheck('.List li:not("#ListTitle")');
    /*LIST.add('.List li');*/
    LIST.delete(".ToDoList");


});