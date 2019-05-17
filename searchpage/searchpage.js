const urlParams = new URLSearchParams(window.location.search);
const search_key = (urlParams.get('q')) ? urlParams.get('q') : "";
const tag_key = (urlParams.get('tag')) ? urlParams.get('tag') : "";
const page = (urlParams.get('page') && parseInt(urlParams.get('page'))) ? parseInt(urlParams.get('page')) : 0;
const per_page = 30;
var list_movies = [];


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
			gallery_col = 3;
			gallery_margin = 10;
		}
		if (viewport.is('>=lg')) {
			if ($("#bd-docs-nav").hasClass("show") === false) $("#bd-docs-nav").addClass("show");
			gallery_col = 4;
			gallery_margin = 10;
		}

		if (viewport.is('>=xl')) {
			if ($("#bd-docs-nav").hasClass("show") === false) $("#bd-docs-nav").addClass("show");
			gallery_col = 5;
			gallery_margin = 10;
			op = true;
		}

		var gallery_width = $("#movies_content").width();

		var card_width = gallery_width / gallery_col - 2 * gallery_margin;
		if (img_movie_rendered === false) {
			img_movie_rendered = true;
			for (var i = 0; i < list_movies.length; i++) {
				(function (ele) {
					var div = $(`<div class="movie-thumnail"></div>`)
					div.css('background-image', 'url(' + ele.series_thumbnail + ')');
					div.append(`<span class="movie-play-button"></span>`)
					$(div).width(card_width);

					var wrapper = $(`<div class="movie-thumnail-wrapper"></div>`)
					wrapper.append(div,
						`<span class="movie-title">${ele.series_name}</span>`)
					$(wrapper).width(card_width);
					let url;
					if (ele.is_series === "1") {
						url = "/tvshowpage/tvshowpage.html?series_id=" + ele.series_id;
					} else {
						url = "/moviewatchingpage/movie-player.html?series_id=" + ele.series_id;
					}
					$(div).attr("url_watching", url);
					$("#gallery").append(wrapper);
				})(list_movies[i]);
				$(".movie-thumnail").each((idx, div) => {
					$(div).click(() => { window.location.href = $(div).attr("url_watching") })
				});
			}
		} else {
			var arr = $("#gallery").find("div");
			for (var i = 0; i < arr.length; i++) {
				$(arr[i]).width(card_width)
			}
		}

	}

	// 
	// Execute only after document has fully loaded
	$(document).ready(function () {
		var p = new Promise((resolve, reject) => {
			// console.log(`/api/series.php?q=${search_key}&tag=${tag_key}&page=${page}&per_page=${per_page}`);
			$.get(`/api/series.php?q=${search_key}&tag=${tag_key}&page=${page}&per_page=${per_page}`, (data) => {
				data = JSON.parse(data);
				if (data && data.result && data.result.length > 0) {
					resolve(data);
				} else {
					reject();
				}
			})
		})
		if (tag_key && tag_key !== "") {
			$("#search-result").append(` for "${tag_key}"`)
		} else {
			$("#search-result").append(` for "${search_key}"`)
		}
		p.then((data) => {
			list_movies = data.result;
			render_slide();
			if (page > 0) {
				$("#prev_page").show();
				$("#prev_page").off('click').click(() => {
					let new_page = page - 1;
					window.open(`/searchpage/searchpage.html?q=${search_key}&tag=${tag_key}&page=${new_page}`, "_self");
				})
			} else {
				$("#prev_page").hide();
			}
			if (!data.has_more) {
				$("#next_page").hide();
			} else {
				$("#next_page").show();
				$("#next_page").off('click').click(() => {
					let new_page = page + 1;
					window.open(`/searchpage/searchpage.html?q=${search_key}&tag=${tag_key}&page=${new_page}`, "_self")
				})
			}
		}).catch((e) => {
			console.log(e)
		})

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
