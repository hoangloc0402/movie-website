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

	var hasNext = false;
	var hasPrev = false;
	var page = 0;
	var per_page = 3;

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


	function getData(page, per_page) {
		$.ajax({
			type: "GET",
			url: "/api/user.php?page=" + page + "&per_page=" + per_page,
			success: function (response) {
				data = [];
				response = JSON.parse(response);
				hasNext = response.has_next;
				if (!hasNext) $('#next-button').attr('disabled', true);
				$.each(response.data, function (idx, val) {
					dataItem = [];
					dataItem.push(val.user_id);
					dataItem.push(val.user_name);
					dataItem.push(val.user_email);
					dataItem.push(val.user_joining_date);
					dataItem.push(val.user_type);
					dataItem.push(val.user_is_active);
					data.push(dataItem);
				})
				updateTableContent(data);
			},
			error: function (response) {
				console.log("error");
			}
		});
	}

	function updateData(jsonString) {
		console.log(jsonString);

		$.ajax({
			type: "POST",
			url: "/api/user.php",
			data: jsonString,
			dataType: "json",
			success: function (response) {
				console.log(response);
			},
			error: function (response) {
				console.log("err");
			}
		});
	}

	function updateTableContent(data) {
		$("#user-table-body tr").remove();
		$.each(data, function (rowIndex, r) {
			var row = $("<tr/>");
			for (var i = 0; i < 4; i++) {
				row.append($("<td/>").text(r[i]));
			}
			var inHtml = "";
			switch (r[4]) {
				case "root":
					inHtml = "<td><select class='form-control' id='sel" + rowIndex + "' name='sellist1' disabled><option selected='selected'>root</option><option>admin</option><option>user</option></select></td>";
					break;
				case "admin":
					inHtml = "<td><select class='form-control' id='sel" + rowIndex + "' name='sellist1' disabled><option>root</option><option selected='selected'>admin</option><option>user</option></select></td>";
					break;
				case "user":
					inHtml = "<td><select class='form-control' id='sel" + rowIndex + "' name='sellist1' disabled><option>root</option><option>admin</option><option selected='selected'>user</option></select></td>";
					break;
				default: break;
			}
			row.append(inHtml);
			if (r[5] == 1) {
				inHtml = "<td><input type='checkbox' id='check" + rowIndex + "'  value='' checked disabled></td>"
			}
			else inHtml = "<td><input type='checkbox' id='check" + rowIndex + "'  value='' disabled></td>"
			row.append(inHtml);
			row.append("<td><button type='button' style='background-color: #db4a3f;' uid='" + r[0] + "' class='btn btn-success edit-button'>Edit</button></td>");
			$('#user-table-body').append(row);
		});
		$('.edit-button').each((idx, button) =>
			$(button).click(function () {
				if ($('#sel' + idx).is(':disabled')) {
					$('#sel' + idx).removeAttr("disabled");
					$('#check' + idx).removeAttr("disabled");
					$(this).text('Save');
				}
				else {
					$('#sel' + idx).attr("disabled", true);
					$('#check' + idx).attr("disabled", true);
					$(this).text('Edit');

					item = {};

					item["user_id"] = parseInt($(button).attr('uid'));

					if ($('#check' + idx).is(":checked"))
						item["user_is_active"] = "true";
					else
						item["user_is_active"] = "false";

					item['user_type'] = $('#sel' + idx + ' :selected').text();
					jsonString = JSON.stringify(item);

					updateData(jsonString);
				}
			})
		);
	}

	$('#next-button').click(function () {
		page += 1;
		getData(page, per_page);
		hasPrev = true;
		$('#prev-button').removeAttr("disabled");
	})

	$('#prev-button').click(function () {
		page -= 1;
		getData(page, per_page);
		if (page == 0) {
			hasPrev = false;
			$('#prev-button').attr('disabled', true);
		}
		hasNext = true;
		$('#next-button').removeAttr('disabled');
	})

	function init() {
		getData(page, per_page);
		$('#prev-button').attr('disabled', true);
		if (!hasNext) $('next-button').attr('disabled', true);
	}

	init();

})(jQuery, ResponsiveBootstrapToolkit);
