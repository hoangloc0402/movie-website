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

	function validateSignUpForm() {
      var form = document.forms["sign_up"];
      var email = form["email"].value;
      var password = form["password"].value;
      var name = form["name"].value;
      var cf_password = form["cf_password"].value
      var res = true;
      if (name == "") {
         $('#name').css("background", "rgba(233, 30, 99, .2)");
         res = false;
      }
      if (email == "") {
         $('#email').css("background", "rgba(233, 30, 99, .2)");
         res = false;
      }
      if (!validatePassword(password)) {
      	alert("Password length must be longer than 6")
         $('#password').css("background", "rgba(233, 30, 99, .2)");
         res = false;
      }
      if (!validatePassword(cf_password)) {
      	alert("Password length must be longer than 6")
         $('#cf_password').css("background", "rgba(233, 30, 99, .2)");
         res = false;
      }
      if (cf_password != password) {
      	alert("Password not match!")
         $('#password').css("background", "rgba(233, 30, 99, .2)");
         $('#cf_password').css("background", "rgba(233, 30, 99, .2)");
         res = false;
      }
      return res;
   }

	$(document).ready(function () {
		render_slide();
		$(".my_nav_tag").each((idx, a) => {
			$(a).click(()=>{
				let tag = $(a).text().slice(1);
				window.open(`/searchpage/searchpage.html?q=&tag=${tag}`,"_self");
			})
		});

		$("#submit").click(function(event){
         event.preventDefault();
         if (validateSignUpForm()) {
            $.ajax({
               type: "POST",
               url: '../api/login_register.php',
               datatype: 'json',
               data: JSON.stringify({
                  'type': 'register',
                  'display_name': $("#name").val(),
                  'email': $("#email").val(),
                  'password': $("#password").val()
               }),
               success: function (data) {
                  data = JSON.parse(data)
                  if (data["is_success"]) {
                     window.location = "../loginpage/loginpage.html";
                  }
               },
               error: function (e) {
                  alert("Invalid account!")
               }
            });
         }
      }
      );
	});
	$(window).resize(
		viewport.changed(function () {
			render_slide();
		})
	);

})(jQuery, ResponsiveBootstrapToolkit);
