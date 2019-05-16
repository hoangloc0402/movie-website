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

var typingTimer;
var doneTypingInterval = 500;
var $input = $('#my_search_bar_input');

$input.on('keyup', function () {
	clearTimeout(typingTimer);
	typingTimer = setTimeout(doneTyping, doneTypingInterval);
});

//on keydown, clear the countdown 
$input.on('keydown', function () {
	clearTimeout(typingTimer);
});

$("#search_results").width($input.width());

function doneTyping() {
	if ($input.val() !== "") {
		var q = $input.val();
		$.get(`/api/series.php?q=${q}&tag=&page=0&per_page=5`, (data) => {
			data = JSON.parse(data);
			let list = [];
			if (data && data.result && data.result.length > 0) {
				for (var i = 0; i < data.result.length; i++) {
					let div = $(`<p>${data.result[i].series_name}</p>`)
					let url = "";
					if (data.result[i].is_series === "1") {
						url = `/tvshowpage/tvshowpage.html?series_id=${data.result[i].series_id}`;
					} else {
						url = `/moviewatchingpage/movie-player.html?series_id=${data.result[i].series_id}`;
					}
					div.attr('url_watching', url)
					list.push(div)
				}
			}
			$("#search_results").empty();
			$("#search_results").append(list);
			$("#search_results").find("p").each((i, p) => {
				$(p).click(() => { window.open($(p).attr('url_watching'), '_self') })
			})
		})
	}
}

$input.focusout(() => {
	$("#search_results").empty();
})