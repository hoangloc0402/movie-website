const user_id = getCookie("user_id");
const is_admin = isAdmin();
const is_log_in = isLoggedIn();
const urlParams = new URLSearchParams(window.location.search);
const pre_series_id = urlParams.get('series_id');
var pre_series_data;

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

	var search_offset = 1;

	function render_slide() {
		var op = false;
		if (viewport.is('xs')) {
			if ($("#bd-docs-nav").hasClass("show") === true) $("#bd-docs-nav").removeClass("show");
			search_offset = 2;
		}
		if (viewport.is('>=sm')) {
			if ($("#bd-docs-nav").hasClass("show") === true) $("#bd-docs-nav").removeClass("show");
			search_offset = 2;
		}
		if (viewport.is('>=md')) {
			if ($("#bd-docs-nav").hasClass("show") === false) $("#bd-docs-nav").addClass("show");
			search_offset = 1;
		}
		if (viewport.is('>=lg')) {
			if ($("#bd-docs-nav").hasClass("show") === false) $("#bd-docs-nav").addClass("show");
			search_offset = 1;
		}

		if (viewport.is('>=xl')) {
			if ($("#bd-docs-nav").hasClass("show") === false) $("#bd-docs-nav").addClass("show");
			search_offset = 1;
		}

	}
	$(document).ready(function () {
		if (pre_series_id) {
			$.get(`/api/series.php?id=${pre_series_id}`, (data)=> {
				pre_series_data = JSON.parse(data);
				// console.log(pre_series_data)
				if (pre_series_data.series_name) $("#series_name").val(pre_series_data.series_name)
				if (pre_series_data.is_series === "0") {
					$("#is_series").val("0");
					$(".video_stuff").fadeOut();
				}
				if (pre_series_data.series_rating) $("#series_rating").val(pre_series_data.series_rating)
				if (pre_series_data.series_year) $("#series_year").val(pre_series_data.series_year)
				let tags = JSON.parse(pre_series_data.series_tags)
				if (tags && tags.length > 0) $("#series_tags").val(tags[0].toLowerCase());
				if (pre_series_data.series_description) $("#series_description").val(pre_series_data.series_description)
				if (pre_series_data.series_thumbnail) $("#series_thumbnail").val(pre_series_data.series_thumbnail)
				if (pre_series_data.series_expected_ep_count) $("#series_expected_ep_count").val(pre_series_data.series_expected_ep_count)
			})
		}
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
		if (($("#video-name").val().length > 255 || $("#video-name").val().length == 0) && ($("#is_series").val() === '1')) {
			$("#video-name").val("");
			$("#video-name").attr("placeholder", "Video name 1-255 characters");
			res = false;
		}
		if ($("#series_thumbnail").val() == "") {
			$("#series_thumbnail").attr("placeholder", "Upload thumbnail");
			res = false;
		}
		if ($("#video-upload-label").val() == "") {
			$("#video-upload-label").attr("placeholder", "Upload video");
			res = false;
		}
		if ($("#video-episode").val() == "" && $("#is_series").val() === '1') {
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

	function clean(obj) {
		for (var propName in obj) {
			if (obj[propName] === null || obj[propName] === undefined) {
				delete obj[propName];
			}
		}
		return obj
	}

	$('#form-upload-button').click(function () {
		if (checkInput()) {
			video = {};
			video["video_name"] = $("#is_series").val() === '1' ? $('#video-name').val() : $('#series_name').val();
			video["video_thumbnail"] = ($('#thumbnail-upload-label').val() !== "" ? $('#thumbnail-upload-label').val() : null);
			video["video_source"] = ($('#video-upload-label').val() !== "" ? $('#video-upload-label').val() : null);
			video['video_episode'] = ($('#video-episode').val() !== "" ? $('#video-episode').val() : 1);

			tags = [];
			tags.push($('#series_tags').val())
			series = {
				series_name: $('#series_name').val(),
				series_uploader_id: user_id,
				series_thumbnail: ($('#series_thumbnail').val() !== "" ? $('#series_thumbnail').val() : null),
				series_tags: tags,
				is_series: $("#is_series").val() === '1' ? "true" : "false",
				series_expected_ep_count: ($('#series_expected_ep_count').val() !== "" ? $('#series_expected_ep_count').val() : null),
				series_rating: ($('#series_rating').val() !== "" ? $('#series_rating').val() : null),
				series_description: ($('#series_description').val() !== "" ? $('#series_description').val() : null),
				series_year: ($('#series_year').val() !== "" ? $('#series_year').val() : null),
			}
			// console.log(clean(series));

			$.ajax({
				type: pre_series_id ? "PUT" : "POST",
				url: pre_series_id ? "/api/series.php?id=" + pre_series_id : "/api/series.php",
				contentType: 'application/json',
				data: JSON.stringify(clean(series)),
				crossDomain: true,
				dataType: "json",
				success: function (data) {
					var series_id = data.id;
					video.video_series_id = series_id;
					video.video_uploader_id = user_id;
					$.ajax({
						type: "POST",
						url: "/api/video.php",
						contentType: 'application/json',
						data: JSON.stringify(clean(video)),
						crossDomain: true,
						dataType: "json",
						success: function (data) {
							if ($("#is_series").val() === '1') {
								window.open(`/tvshowpage/tvshowpage.html?series_id=${series_id}`, "_self");
							} else {
								window.open(`/moviewatchingpage/movie-player.html?video_id=${data.id}`, "_self");
							}
						},
						error: function (err) {
							console.log(err);
						}
					});

				},
				error: function (err) {
					console.log(err);
				}
			});
		}
	})

})(jQuery, ResponsiveBootstrapToolkit);
