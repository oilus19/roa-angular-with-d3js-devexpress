"use strict";angular.module("resultsonair.controllers",[]).controller("LoginCtrl",function(e,i){i.isLoginPage=!0,i.isLightLoginPage=!1,i.isLockscreenPage=!1,i.isMainPage=!1}).controller("LoginLightCtrl",function(e,i){i.isLoginPage=!0,i.isLightLoginPage=!0,i.isLockscreenPage=!1,i.isMainPage=!1}).controller("LockscreenCtrl",function(e,i){i.isLoginPage=!1,i.isLightLoginPage=!1,i.isLockscreenPage=!0,i.isMainPage=!1}).controller("MainCtrl",function(e,i,t,a,s,n,o){i.isLoginPage=!1,i.isLightLoginPage=!1,i.isLockscreenPage=!1,i.isMainPage=!0,i.layoutOptions={horizontalMenu:{isVisible:!1,isFixed:!0,minimal:!1,clickToExpand:!1,isMenuOpenMobile:!1},sidebar:{isVisible:!0,isCollapsed:!1,toggleOthers:!0,isFixed:!0,isRight:!1,isMenuOpenMobile:!1,userProfile:!0},chat:{isOpen:!1},settingsPane:{isOpen:!1,useAnimation:!0},container:{isBoxed:!1},skins:{sidebarMenu:"",horizontalMenu:"",userInfoNavbar:""},pageTitles:!0,userInfoNavVisible:!1},a.loadOptionsFromCookies(),e.updatePsScrollbars=function(){var e=jQuery(".ps-scrollbar:visible");e.each(function(e,i){"undefined"==typeof jQuery(i).data("perfectScrollbar")?jQuery(i).perfectScrollbar():jQuery(i).perfectScrollbar("update")})},public_vars.$body=jQuery("body"),s.initToggles(),e.setFocusOnSearchField=function(){public_vars.$body.find('.search-form input[name="s"]').focus(),setTimeout(function(){public_vars.$body.find('.search-form input[name="s"]').focus()},100)},e.$watch(function(){cbr_replace()}),i.$watch("layoutOptions.sidebar.isCollapsed",function(e,i){e!=i&&public_vars.$sidebarMenu.find(".sidebar-menu-inner").perfectScrollbar(1==e?"destroy":{wheelPropagation:public_vars.wheelPropagation})}),n.init(),e.showLoadingBar=showLoadingBar,e.hideLoadingBar=hideLoadingBar,i.$on("$stateChangeStart",function(){var e={pos:jQuery(window).scrollTop()};TweenLite.to(e,.25,{pos:0,ease:Power4.easeOut,onUpdate:function(){$(window).scrollTop(e.pos)}})}),e.isFullscreenSupported=o.isSupported(),e.isFullscreen=o.isEnabled()?!0:!1,e.goFullscreen=function(){o.isEnabled()?o.cancel():o.all(),e.isFullscreen=o.isEnabled()?!0:!1}}).controller("SidebarMenuCtrl",function(e,i,t,a,s,n,o){var l=t.instantiate();e.menuItems=l.prepareSidebarMenu().getAll(),l.setActive(s.path()),i.$on("$stateChangeSuccess",function(){l.setActive(n.current.name)}),public_vars.$sidebarMenu=public_vars.$body.find(".sidebar-menu"),a(setup_sidebar_menu,1),ps_init()}).controller("HorizontalMenuCtrl",function(e,i,t,a,s,n){var o=t.instantiate();e.menuItems=o.prepareHorizontalMenu().getAll(),o.setActive(s.path()),i.$on("$stateChangeSuccess",function(){o.setActive(n.current.name),$(".navbar.horizontal-menu .navbar-nav .hover").removeClass("hover")}),a(setup_horizontal_menu,1)}).controller("SettingsPaneCtrl",function(e){public_vars.$settingsPane=public_vars.$body.find(".settings-pane"),public_vars.$settingsPaneIn=public_vars.$settingsPane.find(".settings-pane-inner")}).controller("ChatCtrl",function(e,i){var t=jQuery(i),a=t.find(".chat-conversation");t.find(".chat-inner").perfectScrollbar(),t.on("click",".chat-group a",function(e){e.preventDefault(),a.toggleClass("is-open"),a.is(":visible")&&(t.find(".chat-inner").perfectScrollbar("update"),a.find("textarea").autosize())}),a.on("click",".conversation-close",function(e){e.preventDefault(),a.removeClass("is-open")})}).controller("UIModalsCtrl",function(e,i,t,a){e.openModal=function(e,a,s){i.currentModal=t.open({templateUrl:e,size:a,backdrop:"undefined"==typeof s?!0:s})},e.openAjaxModal=function(e,s){i.currentModal=t.open({templateUrl:e,resolve:{ajaxContent:function(e){return e.get(s).then(function(e){i.modalContent=a.trustAsHtml(e.data)},function(e){i.modalContent=a.trustAsHtml('<div class="label label-danger">Cannot load ajax content! Please check the given url.</div>')})}}}),i.modalContent=a.trustAsHtml("Modal content is loading...")}}).controller("PaginationDemoCtrl",function(e){e.totalItems=64,e.currentPage=4,e.setPage=function(i){e.currentPage=i},e.pageChanged=function(){console.log("Page changed to: "+e.currentPage)},e.maxSize=5,e.bigTotalItems=175,e.bigCurrentPage=1}).controller("LayoutVariantsCtrl",function($scope,$layout,$cookies){$scope.opts={sidebarType:null,fixedSidebar:null,sidebarToggleOthers:null,sidebarVisible:null,sidebarPosition:null,horizontalVisible:null,fixedHorizontalMenu:null,horizontalOpenOnClick:null,minimalHorizontalMenu:null,sidebarProfile:null},$scope.sidebarTypes=[{value:["sidebar.isCollapsed",!1],text:"Expanded",selected:$layout.is("sidebar.isCollapsed",!1)},{value:["sidebar.isCollapsed",!0],text:"Collapsed",selected:$layout.is("sidebar.isCollapsed",!0)}],$scope.fixedSidebar=[{value:["sidebar.isFixed",!0],text:"Fixed",selected:$layout.is("sidebar.isFixed",!0)},{value:["sidebar.isFixed",!1],text:"Static",selected:$layout.is("sidebar.isFixed",!1)}],$scope.sidebarToggleOthers=[{value:["sidebar.toggleOthers",!0],text:"Yes",selected:$layout.is("sidebar.toggleOthers",!0)},{value:["sidebar.toggleOthers",!1],text:"No",selected:$layout.is("sidebar.toggleOthers",!1)}],$scope.sidebarVisible=[{value:["sidebar.isVisible",!0],text:"Visible",selected:$layout.is("sidebar.isVisible",!0)},{value:["sidebar.isVisible",!1],text:"Hidden",selected:$layout.is("sidebar.isVisible",!1)}],$scope.sidebarPosition=[{value:["sidebar.isRight",!1],text:"Left",selected:$layout.is("sidebar.isRight",!1)},{value:["sidebar.isRight",!0],text:"Right",selected:$layout.is("sidebar.isRight",!0)}],$scope.horizontalVisible=[{value:["horizontalMenu.isVisible",!0],text:"Visible",selected:$layout.is("horizontalMenu.isVisible",!0)},{value:["horizontalMenu.isVisible",!1],text:"Hidden",selected:$layout.is("horizontalMenu.isVisible",!1)}],$scope.fixedHorizontalMenu=[{value:["horizontalMenu.isFixed",!0],text:"Fixed",selected:$layout.is("horizontalMenu.isFixed",!0)},{value:["horizontalMenu.isFixed",!1],text:"Static",selected:$layout.is("horizontalMenu.isFixed",!1)}],$scope.horizontalOpenOnClick=[{value:["horizontalMenu.clickToExpand",!1],text:"No",selected:$layout.is("horizontalMenu.clickToExpand",!1)},{value:["horizontalMenu.clickToExpand",!0],text:"Yes",selected:$layout.is("horizontalMenu.clickToExpand",!0)}],$scope.minimalHorizontalMenu=[{value:["horizontalMenu.minimal",!1],text:"No",selected:$layout.is("horizontalMenu.minimal",!1)},{value:["horizontalMenu.minimal",!0],text:"Yes",selected:$layout.is("horizontalMenu.minimal",!0)}],$scope.chatVisibility=[{value:["chat.isOpen",!1],text:"No",selected:$layout.is("chat.isOpen",!1)},{value:["chat.isOpen",!0],text:"Yes",selected:$layout.is("chat.isOpen",!0)}],$scope.boxedContainer=[{value:["container.isBoxed",!1],text:"No",selected:$layout.is("container.isBoxed",!1)},{value:["container.isBoxed",!0],text:"Yes",selected:$layout.is("container.isBoxed",!0)}],$scope.sidebarProfile=[{value:["sidebar.userProfile",!1],text:"No",selected:$layout.is("sidebar.userProfile",!1)},{value:["sidebar.userProfile",!0],text:"Yes",selected:$layout.is("sidebar.userProfile",!0)}],$scope.resetOptions=function(){$layout.resetCookies(),window.location.reload()};var setValue=function(val){null!=val&&(val=eval(val),$layout.setOptions(val[0],val[1]))};$scope.$watch("opts.sidebarType",setValue),$scope.$watch("opts.fixedSidebar",setValue),$scope.$watch("opts.sidebarToggleOthers",setValue),$scope.$watch("opts.sidebarVisible",setValue),$scope.$watch("opts.sidebarPosition",setValue),$scope.$watch("opts.horizontalVisible",setValue),$scope.$watch("opts.fixedHorizontalMenu",setValue),$scope.$watch("opts.horizontalOpenOnClick",setValue),$scope.$watch("opts.minimalHorizontalMenu",setValue),$scope.$watch("opts.chatVisibility",setValue),$scope.$watch("opts.boxedContainer",setValue),$scope.$watch("opts.sidebarProfile",setValue)}).controller("ThemeSkinsCtrl",function(e,i){var t=jQuery("body");e.opts={sidebarSkin:i.get("skins.sidebarMenu"),horizontalMenuSkin:i.get("skins.horizontalMenu"),userInfoNavbarSkin:i.get("skins.userInfoNavbar")},e.skins=[{value:"",name:"Default",palette:["#2c2e2f","#EEEEEE","#FFFFFF","#68b828","#27292a","#323435"]},{value:"aero",name:"Aero",palette:["#558C89","#ECECEA","#FFFFFF","#5F9A97","#558C89","#255E5b"]},{value:"navy",name:"Navy",palette:["#2c3e50","#a7bfd6","#FFFFFF","#34495e","#2c3e50","#ff4e50"]},{value:"facebook",name:"Facebook",palette:["#3b5998","#8b9dc3","#FFFFFF","#4160a0","#3b5998","#8b9dc3"]},{value:"turquoise",name:"Truquoise",palette:["#16a085","#96ead9","#FFFFFF","#1daf92","#16a085","#0f7e68"]},{value:"lime",name:"Lime",palette:["#8cc657","#ffffff","#FFFFFF","#95cd62","#8cc657","#70a93c"]},{value:"green",name:"Green",palette:["#27ae60","#a2f9c7","#FFFFFF","#2fbd6b","#27ae60","#1c954f"]},{value:"purple",name:"Purple",palette:["#795b95","#c2afd4","#FFFFFF","#795b95","#27ae60","#5f3d7e"]},{value:"white",name:"White",palette:["#FFFFFF","#666666","#95cd62","#EEEEEE","#95cd62","#555555"]},{value:"concrete",name:"Concrete",palette:["#a8aba2","#666666","#a40f37","#b8bbb3","#a40f37","#323232"]},{value:"watermelon",name:"Watermelon",palette:["#b63131","#f7b2b2","#FFFFFF","#c03737","#b63131","#32932e"]},{value:"lemonade",name:"Lemonade",palette:["#f5c150","#ffeec9","#FFFFFF","#ffcf67","#f5c150","#d9a940"]}],e.$watch("opts.sidebarSkin",function(e){null!=e&&(i.setOptions("skins.sidebarMenu",e),t.attr("class",t.attr("class").replace(/\sskin-[a-z]+/)).addClass("skin-"+e))}),e.$watch("opts.horizontalMenuSkin",function(e){null!=e&&(i.setOptions("skins.horizontalMenu",e),t.attr("class",t.attr("class").replace(/\shorizontal-menu-skin-[a-z]+/)).addClass("horizontal-menu-skin-"+e))}),e.$watch("opts.userInfoNavbarSkin",function(e){null!=e&&(i.setOptions("skins.userInfoNavbar",e),t.attr("class",t.attr("class").replace(/\suser-info-navbar-skin-[a-z]+/)).addClass("user-info-navbar-skin-"+e))})}).controller("FooterChatCtrl",function(e,i){e.isConversationVisible=!1,e.toggleChatConversation=function(){e.isConversationVisible=!e.isConversationVisible,e.isConversationVisible&&setTimeout(function(){var e=i.find(".ps-scrollbar");e.hasClass("ps-scroll-down")&&e.scrollTop(e.prop("scrollHeight")),e.perfectScrollbar({wheelPropagation:!1}),i.find(".form-control").focus()},300)}});