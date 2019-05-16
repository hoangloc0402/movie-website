function direct2SearchPage(d) {
	window.open(`../searchpage/searchpage.html?q=${$($(d).find("input")[0]).val()}`, "_self")
	return false
}
function direct2Home() {
	window.open("../homepage/homepage.html", "_self")
	return false
}
function direct2Login() {
	window.open("../loginpage/loginpage.html", "_self")
	return false
}
function direct2UserInfo() {
	window.open("../userinfopage/userinfo.html", "_self")
	return false
}
function direct2Signup() {
	window.open("../registerpage/registerpage.html", "_self")
	return false
}

function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

function isLoggedIn(){
	var user_type = getCookie("user_type");
	var user_id = getCookie("user_id");
	if (user_id && user_id !== "" && user_type && user_type !== "") {
		return true;
	}
	return false;
}

function logOut(){
	setCookie("user_type", null, -1);
	setCookie("user_id", null, -1);
	direct2Home();
}

function isAdmin() {
	var user_type = getCookie("user_type");
	if (user_type === "admin" || user_type === "root") return true;
	return false;
}

function isRootAdmin() {
	var user_type = getCookie("user_type");
	if (user_type === "root") return true;
	return false;
}

function saveObjectToCookie(d) {
	for (var key in d) {
		if (!d.hasOwnProperty(key)) continue;
		var obj = d[key];
		setCookie(key, obj, 14);
	}
}