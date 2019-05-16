function direct2SearchPage(d){     
	window.open(`../searchpage/searchpage.html?q=${$($(d).find("input")[0]).val()}`,"_self")
	return false
}
function direct2Home(){     
	window.open("../homepage/homepage.html","_self")
	return false
}
function direct2Login(){     
	window.open("../loginpage/loginpage.html","_self")
	return false
}
function direct2Signup(){     
	window.open("../registerpage/registerpage.html","_self")
	return false
}