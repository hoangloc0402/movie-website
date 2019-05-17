(function ($, viewport) {
	// Bootstrap 4 Divs
	var bootstrapDivs = {
		'xs': $('<div class="device-xs d-block d-sm-none"></div>'),
		'sm': $('<div class="device-sm d-none d-sm-block d-md-none"></div>'),
		'md': $('<div class="device-md d-none d-md-block d-lg-none"></div>'),
		'lg': $('<div class="device-lg d-none d-lg-block d-xl-none"></div>'),
		'xl': $('<div class="device-xl d-none d-xl-block butts"></div>')
	};
	viewport.use('bs4', bootstrapDivs);

	function render_slide() {
		var op = false;
		if (viewport.is('xs')) {
			if ($("#bd-docs-nav").hasClass("show") === true) $("#bd-docs-nav").removeClass("show");
		}
		if (viewport.is('>=sm')) {
			if ($("#bd-docs-nav").hasClass("show") === true) $("#bd-docs-nav").removeClass("show");
		}
		if (viewport.is('>=md')) {
			if ($("#bd-docs-nav").hasClass("show") === false) $("#bd-docs-nav").addClass("show");
		}
		if (viewport.is('>=lg')) {
			if ($("#bd-docs-nav").hasClass("show") === false) $("#bd-docs-nav").addClass("show");
		}

		if (viewport.is('>=xl')) {
			if ($("#bd-docs-nav").hasClass("show") === false) $("#bd-docs-nav").addClass("show");
		}
	}

	function validatePassword(password){
		if (password.length < 7){
			return false;
		}
		return true;
	}

	function validateForm() {
		var form = document.forms["change"];
		var code = form["code"].value;
		var password = form["password"].value;
		var newpassword = form["newpassword"].value;
		var res = true;
		if (code == "") {
			$("#inform")["0"].innerHTML = "Input your password"
			$('#code').css("background", "rgba(233, 30, 99, .2)");
			res = false;
		}else
		if (!validatePassword(password)) {
			$("#inform")["0"].innerHTML = "Password length must be longer than 6"
			$('#password').css("background", "rgba(233, 30, 99, .2)");
			alert("Password length must be longer than 6")
			res = false;
		}else
		if (!validatePassword(newpassword)) {
			$("#inform")["0"].innerHTML = "Password length must be longer than 6"
			$('#newpassword').css("background", "rgba(233, 30, 99, .2)");
			alert("Password length must be longer than 6")
			res = false;
		}else
		if(password!=newpassword){
			$("#inform")["0"].innerHTML = "Password not match"
			res = false;
		}
		return res;
	}

	$(document).ready(function () {
		var email = $(location).attr('href');
		email = email.split("=")[1]
		render_slide();
		$(".my_nav_tag").each((idx, a) => {
			$(a).click(() => {
				let tag = $(a).text().							slice(1);
				window.open(`/searchpage/searchpage.html?q=&tag=${tag}`, "_self");
			})
		});
		$("#code").on("change paste keyup", function () {
			$('#code').css("background", "#fff");
		});
		$("#password").on("change paste keyup", function () {
			$('#password').css("background", "#fff");
		});
		$("#newpassword").on("change paste keyup", function () {
			$('#newpassword').css("background", "#fff");
		});
		$("#change").submit((e) => {
			e.preventDefault();
			var id = getCookie("user_id")
			// console.log(id)
			if (id == ""){
				$("#inform")["0"].innerHTML = "You havenot logged in"
			}else
			if (validateForm()) {
				$.ajax({
					type: "PUT",
					url: '../api/user.php',
					datatype: 'json',
					data: JSON.stringify({
						'new_password': $("#password").val(),
						'user_id': id,
						'old_password': $("#code").val()
					}),
					success: function (data) {
						data = JSON.parse(data)
						// console.log(data['is_success'])
						if (data["is_success"]) {
							alert(data['message'])
							window.location = "../userinfopage/userinfo.html";
						}
						else{
							$("#inform")["0"].innerHTML = data['message']
						}
					},
					error: function (e) {
						e = JSON.parse(e.responseText)
						$("#inform")["0"].innerHTML = e["message"]
					}
				});
			}
		}
		)

	});
	$(window).resize(
		viewport.changed(function () {
			render_slide();
		})
	);

})(jQuery, ResponsiveBootstrapToolkit);
