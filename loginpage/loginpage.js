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
	function validateLoginForm() {
		var form = document.forms["login"];
		var email = form["email"].value;
		var password = form["password"].value;
		var res = true;
		if (email == "") {
			$("#inform")["0"].innerHTML = "Email must not be empty"
			$('#email').css("background", "rgba(233, 30, 99, .2)");
			res = false;
		}else
		if (password == "") {
			$("#inform")["0"].innerHTML = "Password must not be empty"
			$('#password').css("background", "rgba(233, 30, 99, .2)");
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
		$("#email").on("change paste keyup", function () {
			$('#email').css("background", "#fff");
		});
		$("#password").on("change paste keyup", function () {
			$('#password').css("background", "#fff");
		});
		$("#login").submit((e) => {
			event.preventDefault();
			if (validateLoginForm()) {
				$.ajax({
					type: "POST",
					url: '../api/login_register.php',
					datatype: 'json',
					data: JSON.stringify({
						'type': 'login',
						'email': $("#email").val(),
						'password': $("#password").val()
					}),
					success: function (data) {
						data = JSON.parse(data)
						if (data["is_success"]) {
							saveObjectToCookie({
								user_id: data.user_id,
								user_type: data.user_type
							});
							$("#inform")["0"].innerHTML = e["message"]
							window.location = "../homepage/homepage.html";
						}
						else{
							$("#inform")["0"].innerHTML = e["message"]
						}
					},
					error: function (e) {
						// e = JSON.parse(e)
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
