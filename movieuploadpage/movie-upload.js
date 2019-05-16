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

	var getUrlParameter = function getUrlParameter(sParam) {
		var sPageURL = window.location.search.substring(1),
			sURLVariables = sPageURL.split('&'),
			sParameterName,
			i;

		for (i = 0; i < sURLVariables.length; i++) {
			sParameterName = sURLVariables[i].split('=');

			if (sParameterName[0] === sParam) {
				return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
			}
		}
	};

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
	$(document).ready(function () {
		render_slide();
		$(".my_nav_tag").each((idx, a) => {
			$(a).click(() => {
				let tag = $(a).text().slice(1);
				window.open(`/searchpage/searchpage.html?q=&tag=${tag}`, "_self");
			})
		})
	});
	$(window).resize(
		viewport.changed(function () {
			render_slide();
		})
	);

	function upload_to_gdrive() {

	}

	$('#upload-video-button').click(function () {
		$('#video-upload').click();
	});

	$('#video-upload').change(function (e) {
		var fileName = $(this).val().split("\\").pop();
		$('#video-upload-label').val(fileName);
	});

	$('#upload-thumbnail-button').click(function () { $('#thumbnail-upload').click(); });

	function checkInput() {
		let res = true;
		if ($("#series_name").val().length > 255 || $("#series_name").val().length == 0) {
			$("#series_name").val("");
			$("#series_name").attr("placeholder", "Series name 1-255 characters");
			res = false;
		}
		if (($("#video-name").val().length > 255 || $("#video-name").val().length == 0) && ($("#is_series").val() === '0')) {
			$("#video-name").val("");
			$("#video-name").attr("placeholder", "Video name 1-255 characters");
			res = false;
		}
		if ($("#thumbnail-upload-label").val() == "") {
			$("#thumbnail-upload-label").attr("placeholder", "Upload thumbnail");
			res = false;
		}
		if ($("#video-upload-label").val() == "") {
			$("#video-upload-label").attr("placeholder", "Upload video");
			res = false;
		}
		if ($("#video-episode").val() == "" && $("#is_series").val() === '0') {
			$("#video-episode").attr("placeholder", "Video episode must not be empty");
			res = false;
		}
		else
			if (!/^\d*$/.test($('#video-episode').val())) {
				$("#video-episode").val("");
				$("#video-episode").attr("placeholder", "Wrong Integer number format");
				res = false;
			}
		return res;
	}

	$('#is_series').change(() => {
		if ($("#is_series").val() === '0') {
			// Hide all series stuff
			$(".video_stuff").fadeOut();
		} else {
			$(".video_stuff").fadeIn();
		}
	})

	$('#form-upload-button').click(function () {
		if (checkInput()) {
			jsonObj = [];
			item = {};
			item["video_name"] = $('#video-name').val();
			item["video_series_id"] = getUrlParameter('id');
			item["video_uploader_id"] = "1"; //edit later
			item["video_thumbnail"] = $("#thumbnail-upload-label").val();
			item["video_source"] = $('#video-upload-label').val();
			item['video_episode'] = $('#video-episode').val();
			jsonObj.push(item);
			jsonString = JSON.stringify(jsonObj);

			// console.log(jsonString);

			$.ajax({
				type: "POST",
				url: "",
				contentType: 'application/json',
				data: jsonString,
				crossDomain: true,
				dataType: "json",
				success: function (response) {
					console.log(response);
				},
				error: function (response) {
					console.log(response);
				}
			});
		}
	})

})(jQuery, ResponsiveBootstrapToolkit);
