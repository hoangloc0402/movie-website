var comments = [];
const user_id = getCookie("user_id");
const is_admin = isAdmin();
const is_log_in = isLoggedIn();

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

	var video_id;
	var is_series;

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

	function render_comment(focus) {
		$("#comments_list").empty();
		for (var i = 0; i < comments.length; i++) {
			(function (ele) {
				let img_url = ele.user_profile_image ? ele.user_profile_image : "/images/defaultAvatar.png"
				let cmt = $(`<div id="${ele.comment_id}" class="comment" v-for="comment in comments">
					<img alt="Avatar"  class="comment_profile" src="${img_url}" />
					<h4 user_type="${ele.user_type}">${ele.user_name}</h4>
					<p class="comment-content">${ele.comment_detail}</p>
					<p class="comment-time">${ele.comment_post_time}</p>
					</div>`);
				$("#comments_list").append(cmt);
				if (user_id === ele.user_id || is_admin) {
					let i = $(`<i class="material-icons">delete</i>`);
					$(i).attr("link", ele.comment_id);
					$("#" + ele.comment_id).append(i);
				}
			})(comments[i])
		}
		$("#comments_list").find("i").each((i, ele) => {
			$(ele).off('click').click(() => {
				$.ajax({
					url: `/api/comment.php?video_id=${video_id}`,
					type: 'DELETE',
					dataType: "json",
					data: JSON.stringify({
						comment_id: $(ele).attr("link")
					}),
					success: (data) => {
						if (data.is_success) {
							fetch_comment(true);
						}
					},
					error: (err) => {
						console.log(err)
					}
				})
			})
		})
		$("#comments_list").find("h4").each((i, ele) => {
			let ele_type = $(ele).attr("user_type");
			if (ele_type === "admin" || ele_type === "root") {
				var flash = $(`<i class="material-icons" style="color: #448ef6">flash_on</i>`)
				$(ele).append(flash);
			}
		})
		if (focus) {
			$([document.documentElement, document.body]).animate({
				scrollTop: $("#comments_list").first().offset().top
			}, 500);
		}

	}

	function fetch_comment(focus) {
		var p = new Promise((resolve, reject) => {
			console.log('herer')
			$.ajax({
				url: `/api/comment.php?video_id=${video_id}`,
				type: 'GET',
				dataType: "json",
				success: (comments) => {
					console.log(comments)
					if (comments) {
						resolve(comments);
					} else {
						reject();
					}
				},
				error: (err) => {
					console.log(err)
				}
			})
		})
		p.then((data) => {
			comments = data.data;
			render_comment(focus);
		})
			.catch((e) => {
				console.log(e);
			});
	}

	$(document).ready(function () {
		render_slide();
		$("#prospects_form").submit(function (e) {
			e.preventDefault();
			let comment_detail = $("#post_comment").val();
			$.ajax({
				url: "/api/comment.php",
				type: 'POST',
				dataType: "json",
				data: JSON.stringify({
					video_id: video_id,
					user_id: user_id,
					comment_detail: comment_detail
				}),
				success: (data) => {
					if (data.is_success) {
						$("#post_comment").val("");
						fetch_comment(true);
					}
				},
				error: (err) => {
					console.log(err)
				}
			})
		});

		$(".my_nav_tag").each((idx, a) => {
			$(a).click(() => {
				let tag = $(a).text().slice(1);
				window.open(`/searchpage/searchpage.html?q=&tag=${tag}`, "_self");
			})
		})
		fetch_comment(false);
		if (!isLoggedIn()) {
			$("#prospects_form :input").prop("disabled", true);
			$("#prospects_form :input").css("opacity", .3);
			$("#comment_h2").text("You must sign in to leave a comment");
		}

		$('#delete-confirm-button').click(function(){			
			$.ajax({
				type: "DELETE",
				url: "/api/video.php?id=" + video_id +"&is_series=" + is_series,
				success: function (response) {
					console.log(response);
					window.location.href = "/";
				},
				error: function (response) {
					console.log(response);
				}
			});
		})
	});
	$(window).resize(
		viewport.changed(function () {
			render_slide();
		})
	);

	function showVideo(data) {
		video_id = data.video_id;
		is_series = data.is_series;
		if (data.is_series == 0) {
			$("#video-name").text(data.video_name);
			$(".related-video-panel").hide();
		}
		else {
			$("#video-name").text(data.series_name + " Episode " + data.video_episode + ": " + data.video_name);
			getRaltedVideos(data.video_series_id, data.video_id);
		}
		$('#player').attr('src', data.video_source);
		$('#series-description').text(data.series_description);
		$('#series-name-title').text(data.series_name);
		$('#series-name-title').attr('href', '/tvshowpage/tvshowpage.html?series_id=' + data.video_series_id);
	}

	function showRelatedVideos(data, playingVideoId) {
		data = data.result;
		var count = 0;
		for (i = 0; i < data.length; i++) {
			video = data[i];
			if (video.video_id != playingVideoId) {
				childHtml =
					"<div class='col-6 col-sm-3 col-md-12 recommend-panel' src='/moviewatchingpage/movie-player.html?video_id=" + video.video_id + "'>" +
					"<div class='row related-video-padding'>" +
					"<div class='col-12 col-md-6 recommend-panel-img'>" +
					"<span class='movie-play-button'></span>" +
					"</div>" +
					"<div class='col-12 col-md-6 recommend-panel-text'>" +
					video.series_name + " Episode " + video.video_episode + ": " + video.video_name +
					"</div>" +
					"</div>" +
					"</div>";
				$('.related-video-panel').append(childHtml);
			}
			if (i == 4) break;
		}
		$('.recommend-panel').each((idx, div) => {
			$(div).click(function () {
				window.location.href = $(div).attr('src');
			})
		})
	}

	function getRaltedVideos(id, playingVideoId) {
		$.ajax({
			type: "GET",
			url: "/api/association.php?series_id=" + id + "&get_all",
			success: function (response) {
				showRelatedVideos(JSON.parse(response), playingVideoId);
			},
			error: function (response) {
				console.log("err");
			}
		});
	}

	function getVideo(id) {
		$.ajax({
			type: "GET",
			url: "/api/video.php?id=" + id,
			success: function (response) {
				showVideo(JSON.parse(response));
			},
			error: function (response) {
				console.log("err");
			}
		});
	}

	function getSeries(id) {
		$.ajax({
			type: "GET",
			url: "/api/association.php?series_id=" + id + "&get_first",
			success: function (response) {
				data = JSON.parse(response);
				window.location.href = "/moviewatchingpage/movie-player.html?video_id=" + data.result[0].video_id;
			},
			error: function (response) {
				console.log("err");
			}
		});
	}


	function initSeries() {
		if ($.isNumeric(getUrlParameter('video_id'))) {
			getVideo(getUrlParameter('video_id'));
		} else if ($.isNumeric(getUrlParameter('series_id'))) {
			getSeries(getUrlParameter('series_id'));
		}
	}

	initSeries();

})(jQuery, ResponsiveBootstrapToolkit);
