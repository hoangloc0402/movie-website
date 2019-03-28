const movie = {
	movie_name : "Grey's Anatomy - Season 8",
	src : "images/1.png",
	released_date : "2011",
	imdb : 7.7,
	tag : [
		{g:"Drama",s:"#"},
		{g:"Romance",s:"#"}
	],
	description : "In this season, challenges keep coming. Loyalties will be tested, relationships will be strained and everyone’s future will hang in the balance.But no matter how hard life is, the doctors of Seattle Grace know they can always lean on one another.",
	list_ep : [
		{
			href : "#",
			name : "Flight",
			season: 8,
			ep: 1
		},
		{
			href : "#",
			name : "Flight",
			season: 8,
			ep: 2
		},
		{
			href : "#",
			name : "Flight",
			season: 8,
			ep: 3
		},
		{
			href : "#",
			name : "Flight",
			season: 8,
			ep: 4
		},
		{
			href : "#",
			name : "Flight",
			season: 8,
			ep: 5
		},
		{
			href : "#",
			name : "Flight",
			season: 8,
			ep: 6
		},
		{
			href : "#",
			name : "Flight",
			season: 8,
			ep: 7
		},
		{
			href : "#",
			name : "Flight",
			season: 8,
			ep: 8
		},
		{
			href : "#",
			name : "Flight",
			season: 8,
			ep: 9
		},
		{
			href : "#",
			name : "Flight",
			season: 8,
			ep: 10
		},
		{
			href : "#",
			name : "Flight",
			season: 8,
			ep: 11
		},
		{
			href : "#",
			name : "Flight",
			season: 8,
			ep: 12
		},
		{
			href : "#",
			name : "Flight",
			season: 8,
			ep: 13
		},
		{
			href : "#",
			name : "Flight",
			season: 8,
			ep: 14
		},
		{
			href : "#",
			name : "Flight",
			season: 8,
			ep: 15
		},
		{
			href : "#",
			name : "Flight",
			season: 18,
			ep: 16
		},
		{
			href : "#",
			name : "Flight",
			season: 8,
			ep: 17
		},
		{
			href : "#",
			name : "Flight",
			season: 8,
			ep: 18
		},
		{
			href : "#",
			name : "Flight",
			season: 8,
			ep: 19
		},
		{
			href : "#",
			name : "Flight",
			season: 8,
			ep: 20
		},
		{
			href : "#",
			name : "Flight",
			season: 8,
			ep: 21
		},
		{
			href : "#",
			name : "Flight",
			season: 8,
			ep: 22
		},
		{
			href : "#",
			name : "Flight",
			season: 8,
			ep: 23
		},
		{
			href : "#",
			name : "Flight",
			season: 8,
			ep: 24
		},
	
	]
}


var img_movie_rendered = false;

(function($, viewport){
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
		if( viewport.is('xs') ) {
			if ($("#bd-docs-nav").hasClass("show") === true) $("#bd-docs-nav").removeClass("show");
			gallery_col = 2;
			gallery_margin = 5;
		}
		if( viewport.is('>=sm') ) {
			if ($("#bd-docs-nav").hasClass("show") === true) $("#bd-docs-nav").removeClass("show");
			gallery_col = 2;
			gallery_margin = 5;
		}
		if( viewport.is('>=md') ) {
			if ($("#bd-docs-nav").hasClass("show") === false) $("#bd-docs-nav").addClass("show");
			gallery_col = 2;
			gallery_margin = 10;
		}
		if( viewport.is('>=lg') ) {
			if ($("#bd-docs-nav").hasClass("show") === false) $("#bd-docs-nav").addClass("show");
			gallery_col = 3;
			gallery_margin = 10;
		}

		if( viewport.is('>=xl') ) {
			if ($("#bd-docs-nav").hasClass("show") === false) $("#bd-docs-nav").addClass("show");
			gallery_col = 3;
			gallery_margin = 10;
			op = true;
		}

		var gallery_width = $("#latest_content").width();
		
		var card_width = gallery_width / 2 - 2 * gallery_margin;
		console.log("HERE", gallery_width, 2, card_width, img_movie_rendered );
		if (img_movie_rendered === false) {
			for (var i = movie.list_ep.length - 1; i >= movie.list_ep.length - 2; i --) {
				var div =  $(`<div class="movie-thumnail"></div>`)
				div.css('background-image', 'url(' + movie.src + ')');
				div.append(`<span class="movie-play-button"></span>`)
				$(div).width(card_width);

				var wrapper = $(`<div class="movie-thumnail-wrapper"></div>`)
				wrapper.append(div,
					`<span class="movie-title">${movie.movie_name + " Episode " + movie.list_ep[i].ep + ": " + movie.list_ep[i].name}</span>`)
				$(wrapper).width(card_width);
				$("#latest_ep_thumnail").append(wrapper);
			}
		} else {
			var arr = $("#latest_ep_thumnail").find("div");
			console.log(arr)
			for (var i = 0; i < arr.length; i ++) {
				$(arr[i]).width(card_width)
			}
		}

		gallery_width = $("#ep_list_content").width() - 30;
		
		card_width = gallery_width / gallery_col - 2 * gallery_margin;
		console.log("HERE", gallery_width, gallery_col, card_width, img_movie_rendered );
		if (img_movie_rendered === false) {
			img_movie_rendered = true;
			for (var i = movie.list_ep.length - 1; i >= 0; i --) {
				var div =  $(`<div class="movie-thumnail"></div>`)
				div.css('background-image', 'url(' + movie.src + ')');
				div.append(`<span class="movie-play-button"></span>`)
				$(div).width(card_width);

				var wrapper = $(`<div class="movie-thumnail-wrapper"></div>`)
				wrapper.append(div,
					`<span class="movie-title">${movie.movie_name + " Episode " + movie.list_ep[i].ep + ": " + movie.list_ep[i].name}</span>`)
				$(wrapper).width(card_width);
				$("#gallery").append(wrapper);
			}
		} else {
			var arr = $("#gallery").find("div");
			console.log(arr)
			for (var i = 0; i < arr.length; i ++) {
				$(arr[i]).width(card_width)
			}
		}



    }

    // 
    // Execute only after document has fully loaded
    $(document).ready(function() {
			$("#movie-name").text(movie.movie_name);
			$("#movies_name_div").text(movie.movie_name);
			$("#movies_name_gallery").text(movie.movie_name + " - Episodes List");
			$("#movies_poster").attr("src",movie.src);
			$("#movies_released_date").append(movie.released_date);
			$("#movies_imdb").append(movie.imdb);
			$("#movies_desp").text(movie.description);
			for (var i = 0; i < movie.tag.length; i++) {
				if (i == 0)
					$("#movies_tags").append(`<a href=${movie.tag[i].s}>${movie.tag[i].g}</a>`)
				else 
					$("#movies_tags").append(` / <a href=${movie.tag[i].s}> ${movie.tag[i].g}</a>`)
			}
			render_slide();
			// console.log($('#gallery'))
    });

    // Execute code each time window size changes
    $(window).resize(
			viewport.changed(function() {
			$("#homepage_popular_movies_inner").html("")
			render_slide();
			})
    ); 

})(jQuery, ResponsiveBootstrapToolkit);
