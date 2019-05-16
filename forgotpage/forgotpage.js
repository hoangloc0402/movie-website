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
	function validateForgotForm() {
		var form = document.forms["forgot"];
		var email = form["email"].value;
		var res = true;
		if (email == "") {
			$('#email').css("background", "rgba(233, 30, 99, .2)");
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
		$("#forgot").submit((e) => {
			e.preventDefault();
			console.log($("#email").val())
			window.location = "../resetpage/resetpage.html?email="+$("#email").val()
			if (validateForgotForm()) {
				// $.ajax({
				// 	type: "PUT",
				// 	url: '../api/login_register.php',
				// 	datatype: 'json',
				// 	data: JSON.stringify({
				// 		'email': $("#email").val()
				// 	}),
				// 	success: function (data) {
				// 		data = JSON.parse(data)
				// 		console.log(data)
				// 		if (data["is_success"]) {
				// 			window.location = "../resetpage/resetpage.html";
				// 		}else{
				// 			alert(data['message'])
				// 		}
				// 	},
				// 	error: function (e) {
				// 		window.location = "../resetpage/resetpage.html";
				// 		console.log("error" + JSON.stringify(e));
				// 	}
				// });
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
