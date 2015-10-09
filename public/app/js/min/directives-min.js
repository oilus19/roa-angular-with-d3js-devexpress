angular.module("resultsonair.directives",[]).directive("settingsPane",function(){return{restrict:"E",templateUrl:appHelper.templatePath("layout/settings-pane"),controller:"SettingsPaneCtrl"}}).directive("horizontalMenu",function(){return{restrict:"E",replace:!0,templateUrl:appHelper.templatePath("layout/horizontal-menu"),controller:"HorizontalMenuCtrl"}}).directive("sidebarMenu",function(){return{restrict:"E",templateUrl:appHelper.templatePath("layout/sidebar-menu"),controller:"SidebarMenuCtrl"}}).directive("sidebarChat",function(){return{restrict:"E",replace:!0,templateUrl:appHelper.templatePath("layout/sidebar-chat")}}).directive("footerChat",function(){return{restrict:"E",replace:!0,controller:"FooterChatCtrl",templateUrl:appHelper.templatePath("layout/footer-chat")}}).directive("sidebarLogo",function(){return{restrict:"E",replace:!0,templateUrl:appHelper.templatePath("layout/sidebar-logo")}}).directive("sidebarProfile",function(){return{restrict:"E",replace:!0,templateUrl:appHelper.templatePath("layout/sidebar-profile")}}).directive("userInfoNavbar",function(){return{restrict:"E",replace:!0,templateUrl:appHelper.templatePath("layout/user-info-navbar")}}).directive("pageTitle",function(){return{restrict:"E",replace:!0,templateUrl:appHelper.templatePath("layout/page-title"),link:function(t,e,r){t.title=r.title,t.description=r.description}}}).directive("siteFooter",function(){return{restrict:"E",templateUrl:appHelper.templatePath("layout/footer")}}).directive("xeBreadcrumb",function(){return{restrict:"A",link:function(t,e){var r=angular.element(e);if(r.hasClass("auto-hidden")){var a=r.find("li a"),n=a.width(),i=0;a.each(function(t,e){var r=$(e);i=r.outerWidth(!0),r.addClass("collapsed").width(i),r.hover(function(){r.removeClass("collapsed")},function(){r.addClass("collapsed")})})}}}}).directive("xeCounter",function(){return{restrict:"EAC",link:function(t,e,r){var a=angular.element(e),n=scrollMonitor.create(e);n.fullyEnterViewport(function(){var t={useEasing:attrDefault(a,"easing",!0),useGrouping:attrDefault(a,"grouping",!0),separator:attrDefault(a,"separator",","),decimal:attrDefault(a,"decimal","."),prefix:attrDefault(a,"prefix",""),suffix:attrDefault(a,"suffix","")},e="this"==attrDefault(a,"count","this")?a:a.find(a.data("count")),r=attrDefault(a,"from",0),i=attrDefault(a,"to",100),l=attrDefault(a,"duration",2.5),o=attrDefault(a,"delay",0),u=new String(i).match(/\.([0-9]+)/)?new String(i).match(/\.([0-9]+)$/)[1].length:0,c=new countUp(e.get(0),r,i,u,l,t);setTimeout(function(){c.start()},1e3*o),n.destroy()})}}}).directive("xeFillCounter",function(){return{restrict:"EAC",link:function(t,e,r){var a=angular.element(e),n=scrollMonitor.create(e);n.fullyEnterViewport(function(){var t={current:null,from:attrDefault(a,"fill-from",0),to:attrDefault(a,"fill-to",100),property:attrDefault(a,"fill-property","width"),unit:attrDefault(a,"fill-unit","%")},e={current:t.to,onUpdate:function(){a.css(t.property,t.current+t.unit)},delay:attrDefault(a,"delay",0)},r=attrDefault(a,"fill-easing",!0),i=attrDefault(a,"fill-duration",2.5);r&&(e.ease=Sine.easeOut),t.current=t.from,TweenMax.to(t,i,e),n.destroy()})}}}).directive("xeStatusUpdate",function(){return{restrict:"EAC",link:function(t,e,r){function a(t){o=(o+t)%l.length,0>o&&(o=l.length-1);var e=l.filter(".active"),r=l.eq(o);e.removeClass("active"),r.addClass("active").fadeTo(0,0).fadeTo(320,1)}var n=angular.element(e),i=n.find(".xe-nav a"),l=n.find(".xe-body li"),o=l.filter(".active").index(),u=attrDefault(n,"auto-switch",0),c=0;u>0&&(c=setInterval(function(){a(1)},1e3*u),n.hover(function(){window.clearInterval(c)},function(){c=setInterval(function(){a(1)},1e3*u)})),i.on("click",function(t){t.preventDefault();var e=$(this).hasClass("xe-prev")?-1:1;a(e)})}}}).directive("tocify",function(){return{restrict:"AC",link:function(t,e,r){if(!jQuery.isFunction(jQuery.fn.tocify))return!1;var a=angular.element(e),n=scrollMonitor.create(a.get(0));a.tocify({context:".tocify-content",selectors:"h2,h3,h4,h5"}),a.width(a.parent().width()),n.lock(),n.stateChange(function(){$(a.get(0)).toggleClass("fixed",this.isAboveViewport)})}}}).directive("scrollable",function(){return{restrict:"AC",link:function(t,e,r){if(!jQuery.isFunction(jQuery.fn.perfectScrollbar))return!1;var a=angular.element(e),n=parseInt(attrDefault(a,"max-height",200),10);n=0>n?200:n,a.css({maxHeight:n}).perfectScrollbar({wheelPropagation:!0})}}}).directive("tagsinput",function(){return{restrict:"AC",link:function(t,e,r){var a=angular.element(e);return jQuery.isFunction(jQuery.fn.tagsinput)?void a.tagsinput():!1}}}).directive("dropzone",function(){return{restrict:"AC",link:function(t,e,r){var a=angular.element(e);return jQuery.isFunction(jQuery.fn.dropzone)?void a.dropzone():!1}}}).directive("wysihtml5",function(){return{restrict:"AC",link:function(t,e,r){if(!jQuery.isFunction(jQuery.fn.wysihtml5))return!1;var a=angular.element(e),n=attrDefault(a,"stylesheet-url","");$(".wysihtml5").wysihtml5({size:"white",stylesheets:n.split(","),html:attrDefault(a,"html",!0),color:attrDefault(a,"colors",!0)})}}}).directive("autogrow",function(){return{restrict:"AC",link:function(t,e,r){if(!jQuery.isFunction(jQuery.fn.autosize))return!1;var a=angular.element(e);a.autosize()}}}).directive("slider",function(){return{restrict:"AC",link:function(t,e,r){if(!jQuery.isFunction(jQuery.fn.slider))return!1;var a=angular.element(e),n=$('<span class="ui-label"></span>'),i=n.clone(),l=0!=attrDefault(a,"vertical",0)?"vertical":"horizontal",o=attrDefault(a,"prefix",""),u=attrDefault(a,"postfix",""),c=attrDefault(a,"fill",""),s=$(c),f=attrDefault(a,"step",1),d=attrDefault(a,"value",5),p=attrDefault(a,"min",0),m=attrDefault(a,"max",100),v=attrDefault(a,"min-val",10),h=attrDefault(a,"max-val",90),g=a.is("[data-min-val]")||a.is("[data-max-val]"),D=0;if(g){a.slider({range:!0,orientation:l,min:p,max:m,values:[v,h],step:f,slide:function(t,e){var r=(o?o:"")+e.values[0]+(u?u:""),a=(o?o:"")+e.values[1]+(u?u:"");n.html(r),i.html(a),c&&s.val(r+","+a),D++},change:function(t,e){if(1==D){var r=(o?o:"")+e.values[0]+(u?u:""),a=(o?o:"")+e.values[1]+(u?u:"");n.html(r),i.html(a),c&&s.val(r+","+a)}D=0}});var y=a.find(".ui-slider-handle");n.html((o?o:"")+v+(u?u:"")),y.first().append(n),i.html((o?o:"")+h+(u?u:"")),y.last().append(i)}else{a.slider({range:attrDefault(a,"basic",0)?!1:"min",orientation:l,min:p,max:m,value:d,step:f,slide:function(t,e){var r=(o?o:"")+e.value+(u?u:"");n.html(r),c&&s.val(r),D++},change:function(t,e){if(1==D){var r=(o?o:"")+e.value+(u?u:"");n.html(r),c&&s.val(r)}D=0}});var y=a.find(".ui-slider-handle");n.html((o?o:"")+d+(u?u:"")),y.html(n)}}}}).directive("formWizard",function(){return{restrict:"AC",link:function(t,e,r){if(jQuery.isFunction(jQuery.fn.bootstrapWizard)){var a=$(e),n=a.find("> .tabs > li"),i=a.find(".progress-indicator"),l=a.find("> ul > li.active").index(),o=function(t,e,r){if(a.hasClass("validate")){var n=a.valid();if(!n)return a.data("validator").focusInvalid(),!1}return!0};l>0&&(i.css({width:l/n.length*100+"%"}),n.removeClass("completed").slice(0,l).addClass("completed")),a.bootstrapWizard({tabClass:"",onTabShow:function(t,e,r){var a=n.eq(r).position().left/n.parent().width()*100;n.removeClass("completed").slice(0,r).addClass("completed"),i.css({width:a+"%"})},onNext:o,onTabClick:o}),a.data("bootstrapWizard").show(l),a.find(".pager a").on("click",function(t){t.preventDefault()})}}}}).directive("colorpicker",function(){return{restrict:"AC",link:function(t,e,r){if(!jQuery.isFunction(jQuery.fn.colorpicker))return!1;var a=angular.element(e),n={},i=a.next(),l=a.prev(),o=a.siblings(".input-group-addon").find(".color-preview");a.colorpicker(n),i.is(".input-group-addon")&&i.has("a")&&i.on("click",function(t){t.preventDefault(),a.colorpicker("show")}),l.is(".input-group-addon")&&l.has("a")&&l.on("click",function(t){t.preventDefault(),a.colorpicker("show")}),o.length&&(a.on("changeColor",function(t){o.css("background-color",t.color.toHex())}),a.val().length&&o.css("background-color",a.val()))}}}).directive("validate",function(){return{restrict:"AC",link:function(t,e,r){if(!jQuery.isFunction(jQuery.fn.validate))return!1;var a=angular.element(e),n={rules:{},messages:{},errorElement:"span",errorClass:"validate-has-error",highlight:function(t){$(t).closest(".form-group").addClass("validate-has-error")},unhighlight:function(t){$(t).closest(".form-group").removeClass("validate-has-error")},errorPlacement:function(t,e){t.insertAfter(e.closest(".has-switch").length?e.closest(".has-switch"):e.parent(".checkbox, .radio").length||e.parent(".input-group").length?e.parent():e)}},i=a.find("[data-validate]");i.each(function(t,e){var r=$(e),a=r.attr("name"),i=attrDefault(r,"validate","").toString(),l=i.split(",");for(var o in l){var u=l[o],c,s;"undefined"==typeof n.rules[a]&&(n.rules[a]={},n.messages[a]={}),-1!=$.inArray(u,["required","url","email","number","date","creditcard"])?(n.rules[a][u]=!0,s=r.data("message-"+u),s&&(n.messages[a][u]=s)):(c=u.match(/(\w+)\[(.*?)\]/i))&&-1!=$.inArray(c[1],["min","max","minlength","maxlength","equalTo"])&&(n.rules[a][c[1]]=c[2],s=r.data("message-"+c[1]),s&&(n.messages[a][c[1]]=s))}}),a.validate(n)}}}).directive("inputmask",function(){return{restrict:"AC",link:function(t,e,r){if(!jQuery.isFunction(jQuery.fn.inputmask))return!1;var a=angular.element(e),n=a.data("mask").toString(),i={numericInput:attrDefault(a,"numeric",!1),radixPoint:attrDefault(a,"radixPoint",""),rightAlign:"right"==attrDefault(a,"numericAlign","left")},l=attrDefault(a,"placeholder",""),o=attrDefault(a,"isRegex","");switch(l.length&&(i[l]=l),n.toLowerCase()){case"phone":n="(999) 999-9999";break;case"currency":case"rcurrency":var u=attrDefault(a,"sign","$");n="999,999,999.99","rcurrency"==a.data("mask").toLowerCase()?n+=" "+u:n=u+" "+n,i.numericInput=!0,i.rightAlignNumerics=!1,i.radixPoint=".";break;case"email":n="Regex",i.regex="[a-zA-Z0-9._%-]+@[a-zA-Z0-9-]+\\.[a-zA-Z]{2,4}";break;case"fdecimal":n="decimal",$.extend(i,{autoGroup:!0,groupSize:3,radixPoint:attrDefault(a,"rad","."),groupSeparator:attrDefault(a,"dec",",")})}o&&(i.regex=n,n="Regex"),a.inputmask(n,i)}}}).directive("timepicker",function(){return{restrict:"AC",link:function(t,e,r){if(!jQuery.isFunction(jQuery.fn.timepicker))return!1;var a=angular.element(e),n={template:attrDefault(a,"template",!1),showSeconds:attrDefault(a,"showSeconds",!1),defaultTime:attrDefault(a,"defaultTime","current"),showMeridian:attrDefault(a,"showMeridian",!0),minuteStep:attrDefault(a,"minuteStep",15),secondStep:attrDefault(a,"secondStep",15)},i=a.next(),l=a.prev();a.timepicker(n),i.is(".input-group-addon")&&i.has("a")&&i.on("click",function(t){t.preventDefault(),a.timepicker("showWidget")}),l.is(".input-group-addon")&&l.has("a")&&l.on("click",function(t){t.preventDefault(),a.timepicker("showWidget")})}}}).directive("datepicker",function(){return{restrict:"AC",link:function(t,e,r){if(!jQuery.isFunction(jQuery.fn.datepicker))return!1;var a=angular.element(e),n={format:attrDefault(a,"format","mm/dd/yyyy"),startDate:attrDefault(a,"startDate",""),endDate:attrDefault(a,"endDate",""),daysOfWeekDisabled:attrDefault(a,"disabledDays",""),startView:attrDefault(a,"startView",0)},i=a.next(),l=a.prev();a.datepicker(n),i.is(".input-group-addon")&&i.has("a")&&i.on("click",function(t){t.preventDefault(),a.datepicker("show")}),l.is(".input-group-addon")&&l.has("a")&&l.on("click",function(t){t.preventDefault(),a.datepicker("show")})}}}).directive("daterange",function(){return{restrict:"AC",link:function(t,e,r){if(!jQuery.isFunction(jQuery.fn.daterangepicker))return!1;var a=angular.element(e),n={Today:[moment(),moment()],Yesterday:[moment().subtract("days",1),moment().subtract("days",1)],"Last 7 Days":[moment().subtract("days",6),moment()],"Last 30 Days":[moment().subtract("days",29),moment()],"This Month":[moment().startOf("month"),moment().endOf("month")],"Last Month":[moment().subtract("month",1).startOf("month"),moment().subtract("month",1).endOf("month")]},i={format:attrDefault(a,"format","MM/DD/YYYY"),timePicker:attrDefault(a,"timePicker",!1),timePickerIncrement:attrDefault(a,"timePickerIncrement",!1),separator:attrDefault(a,"separator"," - ")},l=attrDefault(a,"minDate",""),o=attrDefault(a,"maxDate",""),u=attrDefault(a,"startDate",""),c=attrDefault(a,"endDate","");a.hasClass("add-ranges")&&(i.ranges=n),l.length&&(i.minDate=l),o.length&&(i.maxDate=o),u.length&&(i.startDate=u),c.length&&(i.endDate=c),a.daterangepicker(i,function(t,e){var r=a.data("daterangepicker");a.is("[data-callback]")&&callback_test(t,e),a.hasClass("daterange-inline")&&a.find("span").html(t.format(r.format)+r.separator+e.format(r.format))}),"object"==typeof i.ranges&&a.data("daterangepicker").container.removeClass("show-calendar")}}}).directive("spinner",function(){return{restrict:"AC",link:function(t,e,r){var a=angular.element(e),n=a.find('[data-type="decrement"]'),i=a.find('[data-type="increment"]'),l=a.find(".form-control"),o=attrDefault(a,"step",1),u=attrDefault(a,"min",0),c=attrDefault(a,"max",0),s=c>u;n.on("click",function(t){t.preventDefault();var e=new Number(l.val())-o;s&&u>=e&&(e=u),l.val(e)}),i.on("click",function(t){t.preventDefault();var e=new Number(l.val())+o;s&&e>=c&&(e=c),l.val(e)})}}}).directive("loginForm",function(){return{restrict:"AC",link:function(t,e){jQuery(e).find(".form-group:has(label)").each(function(t,e){var r=angular.element(e),a=r.find("label"),n=r.find(".form-control");n.on("focus",function(){r.addClass("is-focused")}),n.on("keydown",function(){r.addClass("is-focused")}),n.on("blur",function(){r.removeClass("is-focused"),n.val().trim().length>0&&r.addClass("is-focused")}),a.on("click",function(){n.focus()}),n.val().trim().length>0&&r.addClass("is-focused")})}}});