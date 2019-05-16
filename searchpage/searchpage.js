const urlParams = new URLSearchParams(window.location.search);
const search_key = (urlParams.get('q')) ? urlParams.get('q'): "";
const page = (urlParams.get('page') && parseInt(urlParams.get('page'))) ? parseInt(urlParams.get('page')): 0 ;
const per_page = 4;
const list_movies = [
	// {
	// 	src: "images/1.png",
	// 	name: "The Small Woman in Grey",  href : "../tvshowpage/tvshowpage.html", "ep": "Episode 01"
	// },
	// {
	// 	src: "images/2.png",
	// 	name: "Grey Gardens",  href : "../tvshowpage/tvshowpage.html", "ep": "Episode 01"
	// },
	// {
	// 	src: "images/3.png",
	// 	name: "Fifty Shades Of Grey",  href : "../tvshowpage/tvshowpage.html", "ep": "Episode 01"
	// },
	// {
	// 	src: "images/4.png",
	// 	name: "Grey's Anatomy - Season 8",  href : "../tvshowpage/tvshowpage.html", "ep": "Episode 01"
	// },
	// {
	// 	src: "images/5.png",
	// 	name: "Grey's Anatomy - Season 7",  href : "../tvshowpage/tvshowpage.html", "ep": "Episode 01"
	// },
	// {
	// 	src: "images/6.png",
	// 	name: "Grey's Anatomy - Season 6",  href : "../tvshowpage/tvshowpage.html", "ep": "Episode 01"
	// },
	// {
	// 	src: "images/7.png",
	// 	name: "Grey's Anatomy - Season 5",  href : "../tvshowpage/tvshowpage.html", "ep": "Episode 01"
	// },
	// {
	// 	src: "images/8.png",
	// 	name: "Grey's Anatomy - Season 4",  href : "../tvshowpage/tvshowpage.html", "ep": "Episode 01"
	// },
	// {
	// 	src: "images/9.png",
	// 	name: "Grey's Anatomy - Season 3",  href : "../tvshowpage/tvshowpage.html", "ep": "Episode 01"
	// },
	// {
	// 	src: "images/10.png",
	// 	name: "Grey's Anatomy - Season 2",  href : "../tvshowpage/tvshowpage.html", "ep": "Episode 01"
	// },
	// {
	// 	src: "images/11.png",
	// 	name: "Grey's Anatomy - Season 1",  href : "../tvshowpage/tvshowpage.html", "ep": "Episode 01"
	// },
	// {
	// 	src: "images/12.png",
	// 	name: "Grey's Anatomy - Season 15",  href : "../tvshowpage/tvshowpage.html", "ep": "Episode 01"
	// },
	// {
	// 	src: "images/13.png",
	// 	name: "Grey's Anatomy - Season 11",  href : "../tvshowpage/tvshowpage.html", "ep": "Episode 01"
	// },
	// {
	// 	src: "images/14.png",
	// 	name: "Greystoke Tarzan",  href : "../tvshowpage/tvshowpage.html", "ep": "Episode 01"
	// },
	// {
	// 	src: "images/15.png",
	// 	name: "The Grey",  href : "../tvshowpage/tvshowpage.html", "ep": "Episode 01"
	// },
	// {
	// 	src: "images/16.png",
	// 	name: "Good Witch Secrects of Grey House",  href : "../tvshowpage/tvshowpage.html", "ep": "Episode 01"
	// },
	// {
	// 	src: "images/17.png",
	// 	name: "Grey Agenda",  href : "../tvshowpage/tvshowpage.html", "ep": "Episode 01"
	// },
	// {
	// 	src: "images/18.png",
	// 	name: "Grey Lady",  href : "../tvshowpage/tvshowpage.html", "ep": "Episode 01"
	// },
	// {
	// 	src: "images/19.png",
	// 	name: "Indecent",  href : "../tvshowpage/tvshowpage.html", "ep": "Episode 01"
	// },
	// {
	// 	src: "images/20.png",
	// 	name: "Grey's Anatomy - Season 14",  href : "../tvshowpage/tvshowpage.html", "ep": "Episode 01"
	// },
	// {
	// 	src: "images/21.png",
	// 	name: "Grey's Anatomy - Season 13",  href : "../tvshowpage/tvshowpage.html", "ep": "Episode 01"
	// }
];


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
		console.log("HERE", gallery_width, gallery_col, card_width, img_movie_rendered);
		if (img_movie_rendered === false) {
			img_movie_rendered = true;
			for (var i = 0; i < list_movies.length; i++) {
				var div = $(`<div class="movie-thumnail"></div>`)
				div.css('background-image', 'url(' + list_movies[i].src + ')');
				div.append(`<span class="movie-play-button"></span>`)
				$(div).width(card_width);

				var wrapper = $(`<div class="movie-thumnail-wrapper"></div>`)
				wrapper.append(div,
					`<span class="movie-title">${list_movies[i].name}</span>`)
				$(wrapper).width(card_width);
				$(wrapper).click(()=>{window.location.href = list_movies[10].href})
				$("#gallery").append(wrapper);
			}
		} else {
			var arr = $("#gallery").find("div");
			console.log(arr)
			for (var i = 0; i < arr.length; i++) {
				$(arr[i]).width(card_width)
			}
		}

	}

	// 
	// Execute only after document has fully loaded
	$(document).ready(function () {
		var p = new Promise((resolve, reject) => {
			console.log(`/api/series.php?q=${search_key}&page=${page}&per_page=${per_page}`);
			$.get(`/api/video.php?page=${page}&per_page=${per_page}`, (data) => {
				data = JSON.parse(data);
				if (data && data.length > 0) {
					resolve(data);
				} else {
					reject();
				}
			})
		})
		$("#search-result").append(` for "${search_key}"`)
		render_slide();
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
