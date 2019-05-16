var comments = [];
const user_id = "2";
const is_admin = false;

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

	function render_comment(focus) {
		$("#comments_list").empty();
		for (var i = 0; i < comments.length; i++) {
			(function (ele) {
				let img_url = ele.user_profile_image ? ele.user_profile_image : "/images/defaultAvatar.png"
				let cmt = $(`<div id="${ele.comment_id}" class="comment" v-for="comment in comments">
					<img alt="Avatar"  class="comment_profile" src="${img_url}" />
					<h4>${ele.user_name}</h4>
					<p>${ele.comment_detail}</p>
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
		$("#comments_list").find("i").each((i, ele)=> {
			$(ele).off('click').click(()=>{
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
	});
	$(window).resize(
		viewport.changed(function () {
			render_slide();
		})
	);

})(jQuery, ResponsiveBootstrapToolkit);
