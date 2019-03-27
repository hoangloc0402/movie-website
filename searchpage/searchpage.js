const list_movies = [
	{
		src : "images/1.png",
		name : "Those Who Can't - Season 1", "href" : "#", "ep" : "Episode 01"
	},
	{
		src : "images/2.png",
		name : "Absentia - Season 2", "href" : "#", "ep" : "Episode 01"
	},
	{
		src : "images/3.png",
		name : "American Housewife - Season 4", "href" : "#", "ep" : "Episode 01"
	},
	{
		src : "images/4.png",
		name : "Bar Rescue - Season 3", "href" : "#", "ep" : "Episode 01"
	},
	{
		src : "images/5.png",
		name : "Dateline: Secrets Uncovered", "href" : "#", "ep" : "Episode 01"
	},
	{
		src : "images/6.png",
		name : "The Tonight Show Starring Jimmy Fallon", "href" : "#", "ep" : "Episode 01"
	},
	{
		src : "images/7.png",
		name : "Deadliest Catch", "href" : "#", "ep" : "Episode 01"
	},
	{
		src : "images/8.png",
		name : "Deadliest Catch", "href" : "#", "ep" : "Episode 01"
	},
	{
		src : "images/9.png",
		name : "Derry Girls", "href" : "#", "ep" : "Episode 01"
	},
	{
		src : "images/10.png",
		name : "The Great British Sewing Bee", "href" : "#", "ep" : "Episode 01"
	},
	{
		src : "images/11.png",
		name : "East Enders", "href" : "#", "ep" : "Episode 01"
	},
	{
		src : "images/12.png",
		name : "Law & Order", "href" : "#", "ep" : "Episode 01"
	},
	{
		src : "images/13.png",
		name : "Five Feet Apart", "href" : "#", "ep" : "Episode 01"
	},
	{
		src : "images/14.png",
		name : "Go!", "href" : "#", "ep" : "Episode 01"
	},
	{
		src : "images/15.png",
		name : "Good Trouble", "href" : "#", "ep" : "Episode 01"
	},
	{
		src : "images/16.png",
		name : "Haunted Case Files", "href" : "#", "ep" : "Episode 01"
	},
	{
		src : "images/17.png",
		name : "The Rookie", "href" : "#", "ep" : "Episode 01"
	},
	{
		src : "images/18.png",
		name : "Holby City", "href" : "#", "ep" : "Episode 01"
	},
	{
		src : "images/19.png",
		name : "Indecent", "href" : "#", "ep" : "Episode 01"
	},
	{
		src : "images/20.png",
		name : "Ice Cold Blood", "href" : "#", "ep" : "Episode 01"
	},
	{
		src : "images/21.png",
		name : "Kim's Convenience", "href" : "#", "ep" : "Episode 01"
	},
	{
		src : "images/22.png",
		name : "The Late Show With Stephen Colbert", "href" : "#", "ep" : "Episode 01"
	},
	{
		src : "images/23.png",
		name : "MasterChef: Kids", "href" : "#", "ep" : "Episode 01"
	},
	{
		src : "images/24.png",
		name : "MasterChef", "href" : "#", "ep" : "Episode 01"
	},
];


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
			gallery_col = 2;
			gallery_margin = 5;
		}
		if( viewport.is('>=sm') ) {
			gallery_col = 2;
			gallery_margin = 5;
		}
		if( viewport.is('>=md') ) {
			gallery_col = 3;
			gallery_margin = 10;
		}
		if( viewport.is('>=lg') ) {
			gallery_col = 4;
			gallery_margin = 10;
		}

		if( viewport.is('>=xl') ) {
			gallery_col = 5;
			gallery_margin = 10;
			op = true;
		}

		var gallery_width = $("#movies_content").width();
		
		var card_width = gallery_width / gallery_col - 2 * gallery_margin;
		console.log("HERE", gallery_width, gallery_col, card_width, img_movie_rendered );
		if (img_movie_rendered === false) {
			img_movie_rendered = true;
			for (var i = 0; i < list_movies.length; i ++) {
				var div =  $(`<div class="movie-thumnail"></div>`)
				div.css('background-image', 'url(' + list_movies[i].src + ')');
				div.append(`<span class="movie-play-button"></span>`)
				$(div).width(card_width);

				var wrapper = $(`<div class="movie-thumnail-wrapper"></div>`)
				wrapper.append(div,
					`<span class="movie-title">${list_movies[i].name}</span>`)
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
