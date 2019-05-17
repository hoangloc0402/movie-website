var list_top_movies = [];
var list_movies = [];
const urlParams = new URLSearchParams(window.location.search);
const page = (urlParams.get('page') && parseInt(urlParams.get('page'))) ? parseInt(urlParams.get('page')) : 0;
const per_page = 10;
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

	function render_slide() {
		var total_movies = list_top_movies.length;
		var pages = 2;
		var rows = 2;
		var col_per_row = 4;
		var gallery_col = 4;
		var gallery_margin = 10;
		var op = false;
		if (viewport.is('xs')) {
			gallery_col = 2;
			gallery_margin = 5;
			if ($("#bd-docs-nav").hasClass("show") === true) $("#bd-docs-nav").removeClass("show");
			pages = 0;
			// console.log("xs:", pages, rows, col_per_row)
		}
		if (viewport.is('>=sm')) {
			if ($("#bd-docs-nav").hasClass("show") === true) $("#bd-docs-nav").removeClass("show");
			gallery_col = 2;
			gallery_margin = 5;
			rows = 1;
			col_per_row = 2;
			pages = Math.floor(total_movies / (rows * col_per_row));
			// console.log("sm:", pages, rows, col_per_row)
		}
		if (viewport.is('>=md')) {
			if ($("#bd-docs-nav").hasClass("show") === false) $("#bd-docs-nav").addClass("show");
			gallery_col = 3;
			gallery_margin = 10;
			rows = 2;
			col_per_row = 3;
			pages = Math.floor(total_movies / (rows * col_per_row));
			// console.log("md:", pages, rows, col_per_row)
		}
		if (viewport.is('>=lg')) {
			if ($("#bd-docs-nav").hasClass("show") === false) $("#bd-docs-nav").addClass("show");
			gallery_col = 4;
			gallery_margin = 10;
			rows = 2;
			col_per_row = 3;
			pages = Math.floor(total_movies / (rows * col_per_row));
			// console.log("lg:", pages, rows, col_per_row)
		}

		if (viewport.is('>=xl')) {
			if ($("#bd-docs-nav").hasClass("show") === false) $("#bd-docs-nav").addClass("show");
			gallery_col = 5;
			gallery_margin = 10;
			op = true;
			rows = 2;
			col_per_row = 4;
			pages = Math.floor(total_movies / (rows * col_per_row));
			// console.log("xl:", pages, rows, col_per_row)
		}
		var width = $(window).innerWidth();
		var height = $(window).height();
		document.documentElement.clientHeight;

		var height_per_row = height / 5;
		var width_per_col = width / col_per_row;

		// console.log(width, width_per_col)
		// console.log(height, height_per_row)
		var active = true;
		pages = Math.floor(list_top_movies.length / (rows * col_per_row));
		var counter = 0;
		for (var i = 0; i < pages; i++) {
			var carousel_item;
			if (active) {
				carousel_item = $('<div class="carousel-item active">')
			} else {
				carousel_item = $('<div class="carousel-item">')
			}

			for (var j = 0; j < rows; j++) {
				var row = $(`<div class="row"></div>`);
				for (var k = 0; k < col_per_row; k++) {
					var div = $(`<div class="movie"></div>`);
					div.css('background-image', 'url(' + list_top_movies[counter].series_thumbnail + ')');
					div.width(width_per_col);
					div.height(height_per_row);
					div.append(
						$(`<div class="movie_name">${list_top_movies[counter].series_name}</div>`),
						$(`<div class="header-play-button"></div>`),
					)
					div.attr('id', `img_${counter}`)
					let url = "";
					if (list_top_movies[counter].is_series === "1") {
						url = `/tvshowpage/tvshowpage.html?series_id=${list_top_movies[counter].series_id}`;
					} else {
						url = `/moviewatchingpage/movie-player.html?series_id=${list_top_movies[counter].series_id}`;
					}
					div.attr('url_watching', url)
					row.append(div);
					counter++;
				}

				carousel_item.append(row);
			}
			if (i == 0) active = false;

			$("#homepage_popular_movies_inner").append(carousel_item);
		}
		$(".movie").each((i, div) => {
			$(div).click(() => { window.open($(div).attr("url_watching"), "_self") })
		})

		var gallery_width = $("#movies_content").width();

		var card_width = gallery_width / gallery_col - 2 * gallery_margin;
		if (img_movie_rendered === false) {
			img_movie_rendered = true;
			$("#gallery").empty();
			for (var i = 0; i < list_movies.length; i++) {
				(function (ele) {
					var div = $(`<div class="movie-thumnail"></div>`);
					$(div).attr("id", `video-${ele.video_id}`);
					if (ele.video_thumbnail) {
						div.css('background-image', 'url(' + ele.video_thumbnail + ')');
					} else {
						div.css('background-image', 'url(' + ele.series_thumbnail + ')');
					}
					div.append(
						`<span class="movie-title">${ele.video_name}</span>`,
						`<span class="movie-play-button"></span>`,
						`<span class="movie-ep">Episode ${ele.video_episode}</span>`,
					)
					var url = '/moviewatchingpage/movie-player.html?video_id=' + ele.video_id;
					$(div).attr("url_watching", url);
					$(div).width(card_width);
					$("#gallery").append(div);
				})(list_movies[i])
			}
			$(".movie-thumnail").each((idx, div) => {
				$(div).click(() => { window.location.href = $(div).attr("url_watching") })
			});
		} else {
			var arr = $("#gallery").find("div");
			for (var i = 0; i < arr.length; i++) {
				$(arr[i]).width(card_width)
			}
		}
	}

	function loadPage() {
		var p = new Promise((resolve, reject) => {
			$.get(`/api/series.php`, (series) => {
				series = JSON.parse(series);
				// console.log("series", series);
				if (series && series.result) {
					$.get(`/api/video.php?page=${page}&per_page=${per_page}`, (data) => {
						data = JSON.parse(data);
						// console.log(data)
						if (data && data.result && data.result.length > 0) {
							resolve({ videos: data, series: series });
						} else {
							reject();
						}
					})
				} else {
					reject();
				}
			})

		})
		p.then((data) => {
			list_movies = data.videos.result;
			list_top_movies = data.series.result;
			console.log(list_top_movies)
			render_slide();
			if (page > 0) {
				$("#prev_page").show();
				$("#prev_page").off('click').click(() => {
					// img_movie_rendered = false;
					let new_page = page - 1;
					window.open(`/homepage/homepage.html?page=${new_page}`, "_self");
				})
			} else {
				$("#prev_page").hide();
			}
			if (!data.videos.has_more) {
				$("#next_page").hide();
			} else {
				$("#next_page").show();
				$("#next_page").off('click').click(() => {
					// img_movie_rendered = false;
					let new_page = page + 1;
					window.open(`/homepage/homepage.html?page=${new_page}`, "_self")
				})
			}
		})
			.catch((e) => {
				console.log(e);
			});


	}
	// 
	// Execute only after document has fully loaded
	$(document).ready(function () {
		loadPage();
		$(".my_nav_tag").each((idx, a) => {
			$(a).click(() => {
				let tag = $(a).text().slice(1);
				window.open(`/searchpage/searchpage.html?q=&tag=${tag}`, "_self");
			})
		})
	});

	// Execute code each time window size changes
	$(window).resize(
		viewport.changed(function () {
			$("#homepage_popular_movies_inner").html("")
			render_slide();
		})
	);

})(jQuery, ResponsiveBootstrapToolkit);