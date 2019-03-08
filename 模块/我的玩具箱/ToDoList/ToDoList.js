// 导入模块
import {chooseDate} from './SelectionList/SelectionList.js';
import {chooseGrade} from './grade/grade.js';
import {chooseField} from './field/field.js';

$('document').ready(function(){
    // temp  用来删除本地数据
    /*$('#temp').click(function(){
        localStorage.removeItem("AllLocalText");
        localStorage.removeItem("AllLocalORR");
        localStorage.removeItem("AllLocalTime");
        localStorage.removeItem("AllLocalYear");
        localStorage.removeItem("AllLocalMonth");
        localStorage.removeItem("AllLocalDate");
        localStorage.removeItem("AllLocalDay");
        localStorage.removeItem("AllLocalGrade");
        localStorage.removeItem("AllLocalField");

        console.log("remove!");
        console.log(localStorage.AllLocalText);
        console.log(localStorage.AllLocalMonth);
    });*/

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
                /*textbox.data("text", textbox.val());*/
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
                    var Date = chooseDate('.timeLine li', function(){
                        // 重要程度分类标签
                        var Grade = chooseGrade(function(){
                            // 领域分类标签
                            var Field = chooseField('.fieldLine li', function(){
                                // 读取该列表有多少个代办事项 以确认ID号码
                                var CountList = $('.List .ToDoList').length+1;
                                // 删除temp并生成新的代办事项
                                $(selector)
                                    .hide()
                                    // 以该代办事项的描述文本作为该待办事项唯一标识的类
                                    .after('<li class="' + textbox.data("text") +  ' ToDoList" id="'+CountList+'"><span class="tickCheck"></span><span class=text></span><span class="delete"></span></li>');
                                $('.'+textbox.data("text")+ ' .text').text(textbox.data("text"));

                                // 为新增加的代办事项添加必要的方法
                                LIST.add('.'+textbox.data("text"));
                                LIST.tickCheck('.'+textbox.data("text"));
                                LIST.delete('.'+textbox.data("text"));
                                // 为新增加的代办事项添加各类标签
                                $('.'+textbox.data("text")).data("OneOrRepeat", $(selector).data('OneTimeOrRepeat'));
                                $('.'+textbox.data("text")).data("date", $(selector).data('date'));
                                $('.'+textbox.data("text")).data("grade", $(selector).data('grade'));
                                $('.'+textbox.data("text")).data("field", $(selector).data('field'));

                                // 整合该待办事项的所有数据给localStorage
                                localStorage.AllLocalText = localStorage.AllLocalText + '/' +  $('.'+textbox.data("text")+ ' .text').text();
                                localStorage.AllLocalORR = localStorage.AllLocalORR + '/' + $('.'+textbox.data("text")).data("OneOrRepeat");
                                localStorage.AllLocalTime = localStorage.AllLocalTime + '/' + $('.'+textbox.data("text")).data("date").getTime();
                                localStorage.AllLocalYear = localStorage.AllLocalYear + '/' + $('.'+textbox.data("text")).data("date").getFullYear();
                                localStorage.AllLocalMonth = localStorage.AllLocalMonth + '/' + $('.'+textbox.data("text")).data("date").getMonth();
                                localStorage.AllLocalDate = localStorage.AllLocalDate + '/' + $('.'+textbox.data("text")).data("date").getDate();
                                localStorage.AllLocalDay = localStorage.AllLocalDay + '/' + $('.'+textbox.data("text")).data("date").getDay();
                                localStorage.AllLocalGrade = localStorage.AllLocalGrade + '/' + $('.'+textbox.data("text")).data("grade");
                                localStorage.AllLocalField = localStorage.AllLocalField + '/' + $('.'+textbox.data("text")).data("field");
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
                2: "星期二",
                3: "星期三",
                4: "星期四",
                5: "星期五",
                6: "星期六",
            };
            var day = days[$(selector).data("date").getDay()];
            // 获取当前时间
            var nowDate = new Date();
            var currentDate = nowDate.getTime();
            var end = year + "." + month + "." + date + " " + day;
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
            $('.tag_1 .tagText').text(Math.ceil(($(selector).data("date").getTime()-currentDate)/86400000));
            $('.tag_2 .tagText').text(start);
            $('.tag_3 .tagText').text(end);
            $('.tag_4 .tagText').text(ORR);
            $('.tag_5 .tagText').text(grade);
            $('.tag_6 .tagText').text(field);
            $('.showTags').animate({
                    left: 0,
                },300);
        },function(){
            $('.tag_1 .tagText').text("");
            $('.tag_2 .tagText').text("");
            $('.tag_3 .tagText').text("");
            $('.tag_4 .tagText').text("");
            $('.tag_5 .tagText').text("");
            $('.tag_6 .tagText').text("");
            // 鼠标离开此代办事项： 终结动画并 收起标签
            $('.showTags')
                .stop()
                .animate({
                    left: '-300px',
                },100);
        });
    };

    LIST.showTags('.ToDoList');

    // 加载localStorage的数据
    if (localStorage.AllLocalText){
        var localTexts = localStorage.AllLocalText.split("/");
        var localORRs = localStorage.AllLocalORR.split("/");
        var localGrades = localStorage.AllLocalGrade.split("/");
        var localFields = localStorage.AllLocalField.split("/");
        var localTimes = localStorage.AllLocalTime.split("/");
        var localYears = localStorage.AllLocalYear.split("/");
        var localMonths = localStorage.AllLocalMonth.split("/");
        var localDates = localStorage.AllLocalDate.split("/");
        var localDays = localStorage.AllLocalDay.split("/");
        // 获取当前时间
        var nowDate = new Date();
        var currentDate = nowDate.getTime();
        //标签转换器
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
        var days = {
            0: "星期日",
            1: "星期一",
            2: "星期二",
            3: "星期三",
            4: "星期四",
            5: "星期五",
            6: "星期六",
        };
        var ORR;
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

        // 获取本地数据的数目
        var localLength = localTexts.length;
        // 添加font类 以便后续添加待办事项
        $("#ListTitle").addClass('font');
        // 开始循环 逐个把本地数据生生初始待办事项(i = 1是因为数据开头的undefined是无用数据)
        for (var i=1; i<localLength; i++){
            $('.font')
                .after('<li class="' + i + ' ToDoList StoredItem" id="'+i+'"><span class="tickCheck"></span><span class=text></span><span class="delete"></span></li>');
            $('.'+i+ ' .text').text(localTexts[i]);
            // 为每个代办事项生成标签数据
            $("."+i).data("tag", i);
            $('.'+i).data("year", localYears[i]);
            $('.'+i).data("month", months[parseInt(localMonths[i])]);
            $('.'+i).data("date", localDates[i]);
            $('.'+i).data("day", localDays[i]);
            $('.'+i).data("end",$('.'+i).data("year") + "." + $('.'+i).data("month") + "." + $('.'+i).data("date") + "  " + days[$('.'+i).data("day")]);
            $('.'+i).data("remain", Math.ceil((localTimes[i]-currentDate)/86400000));
            if (parseInt(localORRs[i])===1){
                ORR = "一次性事务";
            }else{
                ORR = "常做事务"
            };
            $('.'+i).data("ORR", ORR);
            $('.'+i).data("grade", gradeOptions[parseInt(localGrades[i])]);
            $('.'+i).data("field", fieldOptions[parseInt(localFields[i])]);


            // font类接力棒交接
            $('.font').removeClass('font');
            $('.'+i).addClass('font');
        };
        };
    $('.StoredItem').hover(function(){
        // 鼠标悬停于此代办事项： 加载相应的标签数据&显示标签面板
        var tag = $(this).data("tag");
        $('.tag_1 .tagText').text($('.'+String(tag)).data("remain"));
        $('.tag_3 .tagText').text($('.'+String(tag)).data("end"));
        $('.tag_4 .tagText').text($('.'+String(tag)).data("ORR"));
        $('.tag_5 .tagText').text($('.'+String(tag)).data("grade"));
        $('.tag_6 .tagText').text($('.'+String(tag)).data("field"));
        $('.showTags').animate({left: 0,},300);
    },function(){
        $('.tag_1 .tagText').text("");
        $('.tag_2 .tagText').text("");
        $('.tag_3 .tagText').text("");
        $('.tag_4 .tagText').text("");
        $('.tag_5 .tagText').text("");
        $('.tag_6 .tagText').text("");
        // 鼠标离开此代办事项： 终结动画并 收起标签
        $('.showTags')
            .stop()
            .animate({
                left: '-300px',
            },50);
    });
    // 为载入的local待办事项添加所需方法
    LIST.add(".StoredItem");
    LIST.tickCheck(".StoredItem");

    // 删除代办事项
    LIST.delete = function(selector){
        // 提示用户该delete按钮可以点击
        $(selector + " .delete").hover(function(){
            $(this).toggleClass("deleteHover");
        },function(){
            $(this).toggleClass("deleteHover");
        });
        // 正式删除代办事项
        $(selector + " .delete").click(function(){
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
            for (var i=1; i<len; i++){
                if (i !== num){
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
            };
            // 把该代办事项从DOM中删除
            $(this).parent().remove();


        });
    };

    $("#ListTitle .filterButton").click(function(event){
        // 点击filter按钮打开filter面板 、 再点击filter按钮回到初始面板
        if($(this).hasClass("filterButtonClicked")){
            $(this).removeClass("filterButtonClicked");
            $('.List .ToDoList').show();
        }else {
            $(this).addClass("filterButtonClicked");
            // 点击filter按钮后在屏幕正中央显示filter表单
            $('body').append('<div id="curtain">\n' +
                '<div id="filterPanel">\n' +
                '    <p id="title">筛选你的待办事项</p>\n' +
                '    <div id="date">\n' +
                '    <ul class="chooseList">\n' +
                '        <li>时间排序：</li>\n' +
                '        <li>从近到远</li>\n' +
                '        <li>从远到近</li>\n' +
                '    </ul>\n' +
                '    </div>\n' +
                '    <div id="ORR">\n' +
                '    <ul class="chooseList">\n' +
                '        <li>重复性分类：</li>\n' +
                '        <li>一次性事项</li>\n' +
                '        <li>重复性事项</li>\n' +
                '    </ul>\n' +
                '    </div>\n' +
                '    <div id="grade">\n' +
                '    <ul class="chooseList">\n' +
                '        <li>重要程度分类：</li>\n' +
                '        <li>重要紧急</li>\n' +
                '        <li>重要不紧急</li>\n' +
                '        <li>不重要紧急</li>\n' +
                '        <li>不重要不紧急</li>\n' +
                '    </ul>\n' +
                '    </div>\n' +
                '    <div id="field">\n' +
                '    <ul class="chooseList">\n' +
                '        <li>领域分类：</li>\n' +
                '        <li>学习</li>\n' +
                '        <li>日常生活</li>\n' +
                '        <li>整理、修理</li>\n' +
                '        <li>义务、任务</li>\n' +
                '        <li>娱乐</li>\n' +
                '    </ul>\n' +
                '    </div>\n' +
                '    <p class="button"><span class="ok">确认</span><span class="cancel">取消</span></p>\n' +
                '</div>\n' +
                '</div>');
            $('#filterPanel').css('left', ($('body').width() - $('#filterPanel').width()) / 2);
            // 填写表单
            var filterDate;
            var filterORRs;
            var filterGrades;
            var filterFields;
            // 填写期限字段
            $('#filterPanel #date li:nth-child(2)').click(function () {
                if (!$(this).parent().hasClass("filterChoosed")) {
                    $(this).parent().addClass("filterChoosed");
                    filterDate = 0; // 从近到远
                    /*console.log(filterDate);*/
                }
                ;
            });
            $('#filterPanel #date li:nth-child(3)').click(function () {
                if (!$(this).parent().hasClass("filterChoosed")) {
                    $(this).parent().addClass("filterChoosed");
                    filterDate = 1; // 从远到近
                    /*console.log(filterDate);*/
                }
                ;
            });
            // 填写ORR字段
            $('#filterPanel #ORR li:nth-child(2)').click(function () {
                if (!$(this).parent().hasClass("filterChoosed")) {
                    $(this).parent().addClass("filterChoosed");
                    filterORRs = 1; // 一次性事项
                    /*console.log(filterORR);*/
                }
                ;
            });
            $('#filterPanel #ORR li:nth-child(3)').click(function () {
                if (!$(this).parent().hasClass("filterChoosed")) {
                    $(this).parent().addClass("filterChoosed");
                    filterORRs = 0; // 重复事项
                    /*console.log(filterORR);*/
                }
                ;
            });
            // 填写Grade字段
            $('#filterPanel #grade li:nth-child(2)').click(function () {
                if (!$(this).parent().hasClass("filterChoosed")) {
                    $(this).parent().addClass("filterChoosed");
                    filterGrades = 0; // 重要紧急
                    /*console.log(filterGrade);*/
                }
                ;
            });
            $('#filterPanel #grade li:nth-child(3)').click(function () {
                if (!$(this).parent().hasClass("filterChoosed")) {
                    $(this).parent().addClass("filterChoosed");
                    filterGrades = 1; // 重要不紧急
                    /*console.log(filterGrade);*/
                }
                ;
            });
            $('#filterPanel #grade li:nth-child(4)').click(function () {
                if (!$(this).parent().hasClass("filterChoosed")) {
                    $(this).parent().addClass("filterChoosed");
                    filterGrades = 2; // 不重要紧急
                    /* console.log(filterGrade);*/
                }
                ;
            });
            $('#filterPanel #grade li:nth-child(5)').click(function () {
                if (!$(this).parent().hasClass("filterChoosed")) {
                    $(this).parent().addClass("filterChoosed");
                    filterGrades = 3; // 不重要不紧急
                    /*console.log(filterGrade);*/
                }
                ;
            });
            // 填写Field字段
            $('#filterPanel #field li:nth-child(2)').click(function () {
                if (!$(this).parent().hasClass("filterChoosed")) {
                    $(this).parent().addClass("filterChoosed");
                    filterFields = 0; // 学习
                    /*console.log(filterField);*/
                }
                ;
            });
            $('#filterPanel #field li:nth-child(3)').click(function () {
                if (!$(this).parent().hasClass("filterChoosed")) {
                    $(this).parent().addClass("filterChoosed");
                    filterFields = 1; // 日常生活
                    /*console.log(filterField);*/
                }
                ;
            });
            $('#filterPanel #field li:nth-child(4)').click(function () {
                if (!$(this).parent().hasClass("filterChoosed")) {
                    $(this).parent().addClass("filterChoosed");
                    filterFields = 2; // 修理、整理
                    /*console.log(filterField);*/
                }
                ;
            });
            $('#filterPanel #field li:nth-child(5)').click(function () {
                if (!$(this).parent().hasClass("filterChoosed")) {
                    $(this).parent().addClass("filterChoosed");
                    filterFields = 3; // 义务、任务
                    /*console.log(filterField);*/
                }
                ;
            });
            $('#filterPanel #field li:nth-child(6)').click(function () {
                if (!$(this).parent().hasClass("filterChoosed")) {
                    $(this).parent().addClass("filterChoosed");
                    filterFields = 4; // 娱乐
                    /*console.log(filterField);*/
                }
                ;
            });


            // 点击确认按钮：删掉现有待办事项DOM -->  根据表单生成filt后的待办事项列表
            $('#filterPanel .button .ok').click(function () {
                var filterPanel = {
                    "Date": filterDate,
                    "ORR": filterORRs,
                    "Grade": filterGrades,
                    "Field": filterFields,
                };
                console.log(filterPanel);
                // 隐藏filterPanel & 删除现有待办事项DOM
                $('#curtain').hide();
                var FilterLocalDate = localStorage.AllLocalTime.split("/");
                var FilterLocalORR = localStorage.AllLocalORR.split("/");
                var FilterLocalGrade = localStorage.AllLocalGrade.split("/");
                var FilterLocalField = localStorage.AllLocalField.split("/");
                var FilterLocalText = localStorage.AllLocalText.split("/");
                // 遍历数据 找到合适的数据
                var FilterI = [];
                for (var f = 1; f < FilterLocalORR.length; f++) {
                    FilterI.push(f);
                }
                ;
                var FilterTempJ = [];
                var FilterTempK = [];
                var FilterORRLength = FilterLocalORR.length;
                // 如果ORR不是undefined  先遍历ORR
                if (!(filterPanel.ORR === undefined)) {        // 这一段代码质量太差
                    FilterI = [];
                    for (var i = 1; i < FilterORRLength; i++) {
                        if (FilterLocalORR[i] == filterPanel["ORR"]) {
                            FilterI.push(i);
                        }
                        ;
                    }
                    ;
                }
                ;
                // 在遍历完ORR的基础上遍历Grade
                if (!(filterPanel.Grade === undefined)) {
                    for (var j = 0; j < FilterORRLength; j++) {
                        if (FilterLocalGrade[j] == filterPanel["Grade"] && FilterI.indexOf(j) > -1) {
                            FilterTempJ.push(j);
                        }
                        ;
                    }
                    ;
                    FilterI = FilterTempJ;
                }
                ;
                // 在遍历完Grade的基础上遍历Field
                if (!(filterPanel.Field === undefined)) {
                    for (var k = 0; k < FilterORRLength; k++) {
                        if (FilterLocalField[k] == filterPanel["Field"] && FilterI.indexOf(k) > -1) {
                            FilterTempK.push(k);
                        }
                        ;
                    }
                    ;
                    FilterI = FilterTempK;
                }
                ;
                console.log("FilterI: " + FilterI);
                console.log(localStorage.AllLocalText);
                console.log(FilterLocalText);
                i = 0;
                // 遍历FilterI 为匹配的待办事项天上filter标签
                for (i = 0; i < FilterI.length; i++) {
                    console.log(FilterI[i]);
                    console.log($(".List  ." + String(FilterI[i])));
                    $(".List  ." + String(FilterI[i])).addClass("filter");
                    $(".List #ListTitle").addClass("filter");
                }
                ;
                // 隐藏没被选中的待办事项
                $('.List li:not(.filter)').hide();
                $('#curtain').remove();
            });

            // 点击取消：清除表单数据 & 删除filter表单
            $('.button .cancel').click(function () {
                filterDate = null;
                filterORRs = null;
                filterGrades = null;
                filterFields = null;
                $('#curtain').remove();
            });
        };
        event.stopPropagation();
    });



    LIST.delete(".ToDoList");

    // 设置showTags panel的高度为屏幕高度
    $(".showTags").css("height", $('html').css("height"));













});