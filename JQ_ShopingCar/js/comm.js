function AddFavorite(sURL, sTitle){
	try {
		window.external.addFavorite(sURL, sTitle);
	}catch (e){
		try {
			window.sidebar.addPanel(sTitle, sURL, "");
		}catch (e) {
			alert("请使用Ctrl+D进行添加");
		}
	}
}

function SetHome(obj, vrl) {

	try {
		obj.style.behavior = 'url(#default#homepage)'; 
		obj.setHomePage(vrl);
		/*$("#test111").text("k");*/
		}catch (e) {
			alert("您好,您的浏览器不支持自动设置页面为首页功能,请您手动在浏览器里设置该页面为首页!");
			/*if (window.netscape) {
				try {
					netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
					}catch (e) {
						alert("您好,您的浏览器不支持自动设置页面为首页功能,请您手动在浏览器里设置该页面为首页!");
						}
				var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
				prefs.setCharPref('browser.startup.homepage', vrl);
				}*/
		}
}



$(function(){
	//导航处--我的产品
  $('.myProduct').hover(function(){
    $(this).find('ul').show();
  },function(){
    $(this).find('ul').hide();
  });

})