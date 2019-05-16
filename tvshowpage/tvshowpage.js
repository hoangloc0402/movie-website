
var series_data = {}

var img_movie_rendered = false;

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
	var gallery_col = 4;
	var gallery_margin = 10;
	function render_slide() {
		var op = false;
		if (viewport.is('xs')) {
			if ($("#bd-docs-nav").hasClass("show") === true) $("#bd-docs-nav").removeClass("show");
			gallery_col = 2;
			gallery_margin = 5;
		}
		if (viewport.is('>=sm')) {
			if ($("#bd-docs-nav").hasClass("show") === true) $("#bd-docs-nav").removeClass("show");
			gallery_col = 2;
			gallery_margin = 5;
		}
		if (viewport.is('>=md')) {
			if ($("#bd-docs-nav").hasClass("show") === false) $("#bd-docs-nav").addClass("show");
			gallery_col = 2;
			gallery_margin = 10;
		}
		if (viewport.is('>=lg')) {
			if ($("#bd-docs-nav").hasClass("show") === false) $("#bd-docs-nav").addClass("show");
			gallery_col = 3;
			gallery_margin = 10;
		}

		if (viewport.is('>=xl')) {
			if ($("#bd-docs-nav").hasClass("show") === false) $("#bd-docs-nav").addClass("show");
			gallery_col = 3;
			gallery_margin = 10;
			op = true;
		}

		var gallery_width = $("#latest_content").width();

		var card_width = gallery_width / 2 - 2 * gallery_margin;
		if (img_movie_rendered === false) {
			for (var i = series_data.list_ep.length - 1; i >= series_data.list_ep.length - 2; i--) {
				if (i < 0) break;
				(function (ele) {
					var div = $(`<div class="movie-thumnail"></div>`);
					if (ele.video_thumbnail) {
						div.css('background-image', 'url(' + ele.video_thumbnail + ')');
					} else {
						div.css('background-image', 'url(' + series_data.series_thumbnail + ')');
					}

					div.append(`<span class="movie-play-button"></span>`)
					$(div).width(card_width);
					var wrapper = $(`<div class="movie-thumnail-wrapper"></div>`)
					wrapper.append(div,
						`<span class="movie-title">${series_data.series_name + " Episode " + ele.video_episode + ": " + ele.video_name}</span>`)
					$(wrapper).width(card_width);
					let url = `/moviewatchingpage/movie-player.html?video_id=${ele.video_id}`;
					$(wrapper).attr("url_watching", url);
					$("#latest_ep_thumnail").append(wrapper);
				})(series_data.list_ep[i])
			}
		} else {
			var arr = $("#latest_ep_thumnail").find("div");
			console.log(arr)
			for (var i = 0; i < arr.length; i++) {
				$(arr[i]).width(card_width)
			}
		}

		gallery_width = $("#ep_list_content").width() - 30;

		card_width = gallery_width / gallery_col - 2 * gallery_margin;
		if (img_movie_rendered === false) {
			for (var i = series_data.list_ep.length - 1; i >= 0; i--) {
				(function (ele) {
					var div = $(`<div class="movie-thumnail"></div>`)
					if (ele.video_thumbnail) {
						div.css('background-image', 'url(' + ele.video_thumbnail + ')');
					} else {
						div.css('background-image', 'url(' + series_data.series_thumbnail + ')');
					}
					div.append(`<span class="movie-play-button"></span>`)
					$(div).width(card_width);

					var wrapper = $(`<div class="movie-thumnail-wrapper"></div>`)
					wrapper.append(div,
						`<span class="movie-title">${series_data.series_name + " Episode " + ele.video_episode + ": " + ele.video_name}</span>`)
					$(wrapper).width(card_width);
					let url = `/moviewatchingpage/movie-player.html?video_id=${ele.video_id}`;
					$(wrapper).attr("url_watching", url);
					$("#gallery").append(wrapper);
				})(series_data.list_ep[i]);
			}
			$(".movie-thumnail-wrapper").each((idx, div) => {
				$(div).click(() => { window.location.href = $(div).attr("url_watching") })
			});
		} else {
			var arr = $("#gallery").find("div");
			console.log(arr)
			for (var i = 0; i < arr.length; i++) {
				$(arr[i]).width(card_width)
			}
		}
		img_movie_rendered = true;
	}

	function render_series() {
		
		if (isAdmin()) {
			$("#add_btn").show();
			$("#add_btn").click(()=>{
				window.open(`/movieuploadpage/movie-upload.html?series_id=${series_data.series_id}`, "_self")
			})
		} else {
			$("#add_btn").hide();
		}
		$("#movie-name").text(series_data.series_name);
		$("#movies_name_div").text(series_data.series_name);
		$("#movies_name_gallery").text(series_data.series_name + " - Episodes List");
		$("#movies_poster").attr("src", series_data.series_thumbnail);
		$("#movies_released_date").append(series_data.series_year);
		$("#movies_imdb").append(parseFloat(series_data.series_rating / 10));
		$("#movies_desp").text(series_data.series_description);
		let tags = JSON.parse(series_data.series_tags);
		for (var i = 0; i < tags.length; i++) {
			if (i == 0)
				$("#movies_tags").append(`<a href="/searchpage/searchpage.html?tag=${tags[i].toLowerCase()}">${tags[i]}</a>`)
			else
				$("#movies_tags").append(` / <a href="/searchpage/searchpage.html?tag=${tags[i].toLowerCase()}"> ${tags[i]}</a>`)
		}

	}

	// 
	// Execute only after document has fully loaded
	$(document).ready(function () {
		var p = new Promise((resolve, reject) => {
			console.log(`/api/series.php?id=${series_id}`);
			$.get(`/api/series.php?id=${series_id}`, (series_data) => {
				series_data = JSON.parse(series_data);
				console.log(series_data)
				if (series_data) {
					ass_per_page = series_data.series_expected_ep_count ? series_data.series_expected_ep_count : 20;
					$.get(`/api/association.php?series_id=${series_id}&get_all=true&page=0&per_page=${ass_per_page}`, (data) => {
						data = JSON.parse(data);
						console.log(data)
						if (data && data.result && data.result.length) {
							series_data.list_ep = data.result;
							resolve(series_data);
						} else {
							reject({no_ep: true, series_data: series_data});
						}
					})
				} else {
					reject({return_home: true});
				}
			})
		})

		p.then((data) => {
			console.log(data);
			series_data = data;
			render_series();
			render_slide();
		}).catch((err) => {
			console.log(err);
			if (err.no_ep) {
				series_data = err.series_data;
				render_series();
			} else {
				window.open("/", "_self");
			}
		})

		$(".my_nav_tag").each((idx, a) => {
			$(a).click(()=>{
				let tag = $(a).text().slice(1);
				window.open(`/searchpage/searchpage.html?q=&tag=${tag}`,"_self");
			})
		})

		

		// console.log($('#gallery'))
	});

	// Execute code each time window size changes
	$(window).resize(
		viewport.changed(function () {
			$("#homepage_popular_movies_inner").html("")
			render_slide();
		})
	);

})(jQuery, ResponsiveBootstrapToolkit);
