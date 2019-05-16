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

	function getData() {
		$.ajax({
			type: "GET",
			url: "/api/user.php?page=0&per_page=5",
			success: function (response) {
				data = [];
				response = JSON.parse(response);
				$.each(response.data, function (idx, val) {
					dataItem = [];
					dataItem.push(val.user_id);
					dataItem.push(val.user_name);
					dataItem.push(val.user_email);
					dataItem.push(val.user_joining_date);
					dataItem.push(val.user_last_login);
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

	function updateTableContent(data) {

		$.each(data, function (rowIndex, r) {
			var row = $("<tr/>");
			for (var i = 0; i < 5; i++) {
				row.append($("<td/>").text(r[i]));
			}
			var inHtml = "";
			switch (r[5]) {
				case "root_admin":
					inHtml = "<td><select class='form-control' id='sel1' name='sellist1' disabled><option selected='selected'>root_admin</option><option>admin</option><option>user</option></select></td>";
					break;
				case "admin":
					inHtml = "<td><select class='form-control' id='sel1' name='sellist1' disabled><option>root_admin</option><option selected='selected'>admin</option><option>user</option></select></td>";
					break;
				case "user":
					inHtml = "<td><select class='form-control' id='sel1' name='sellist1' disabled><option>root_admin</option><option>admin</option><option selected='selected'>user</option></select></td>";
					break;
				default: break;
			}
			row.append(inHtml);
			if (r[6] == 1) {
				inHtml = "<td><input type='checkbox' class='form-check-input' value='' checked disabled></td>"
			}
			row.append(inHtml);
			row.append("<td><button class='edit-button' id='button-id-" + r[0] + "'>Edit</button></td>");
			$('#user-table-body').append(row);
		});
	}

	getData();

})(jQuery, ResponsiveBootstrapToolkit);
