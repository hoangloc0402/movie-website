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
	function validateResetForm() {
		var form = document.forms["reset"];
		var code = form["code"].value;
		var password = form["password"].value;
		var newpassword = form["newpassword"].value;
		var res = true;
		if (code == "") {
			$('#code').css("background", "rgba(233, 30, 99, .2)");
			res = false;
		}
		if (password == "") {
			$('#password').css("background", "rgba(233, 30, 99, .2)");
			res = false;
		}
		if (newpassword == "") {
			$('#newpassword').css("background", "rgba(233, 30, 99, .2)");
			res = false;
		}
		if(password!=newpassword){
			res = false;
		}
		return res;
	}

	$(document).ready(function () {
		render_slide();
		$(".my_nav_tag").each((idx, a) => {
			$(a).click(() => {
				let tag = $(a).text().slice(1);
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
		$("#reset").submit((e) => {
			e.preventDefault();
			if (validateResetForm()) {
				$.ajax({
					type: "PUT",
					url: '../api/login_register.php',
					datatype: 'json',
					data: JSON.stringify({
						'new_password': $("#password").val()
						'email': "thanh23497@gmail.com",
						'otp': $("#code").val()
					}),
					success: function (data) {
						data = JSON.parse(data)
						if (data["is_success"]) {
							window.location = "../loginpage/loginpage.html";
						}
					},
					error: function (e) {
						console.log("error" + JSON.stringify(e));
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
