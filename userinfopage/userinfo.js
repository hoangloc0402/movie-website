$("#profileImage").click(function(e) {
    $("#imageUpload").click();
});

function fasterPreview(uploader) {
    if ( uploader.files && uploader.files[0] ){
          $('#profileImage').attr('src', 
             window.URL.createObjectURL(uploader.files[0]));
    }
}

$("#imageUpload").change(function(){
    fasterPreview(this);
});

function validateForm() {
        var form = document.forms["change"];
        var display_name = form["display_name"].value;
        var res = true;
        if (display_name == "") {
            $("#inform")["0"].innerHTML = "Display name cannot be empty"
            $('#email').css("background", "rgba(233, 30, 99, .2)");
            res = false;
        }
        return res;
    }

$(document).ready(function(){
    var user_id = getCookie('user_id')
    console.log(user_id)
    $.ajax({
        type: 'GET',
        url: '../api/user.php',
        dataType: "json",
        async:true,
        data: {
            'user_id': user_id
        },
        success: function(data) {
            console.log(data)
            $("#display_name").val(data['data']['user_name'])
            $("#email").val(data['data']['user_email'])
            $("#profileImage").attr('src', data['data']['user_profile_image'])
        },
        error: function (e) {
            // e = JSON.parse(e.responseText)
            console.log(e.responseText)
        }

    });

    $(".my_nav_tag").each((idx, a) => {
        $(a).click(()=>{
            let tag = $(a).text().slice(1);
            window.open(`/searchpage/searchpage.html?q=&tag=${tag}`,"_self");
        })
    });

    $("#change").submit((e) => {
            event.preventDefault();
            if (validateForm()) {
                $.ajax({
                    type: "POST",
                    url: '../api/user.php',
                    datatype: 'json',
                    data: JSON.stringify({
                        'email': $("#email").val(),
                        'password': $("#password").val()
                    }),
                    success: function (data) {
                        data = JSON.parse(data)
                        if (data["is_success"]) {
                            window.location = "../homepage/homepage.html";
                        }
                        else{
                            $("#inform")["0"].innerHTML = e["message"]
                        }
                    },
                    error: function (e) {
                        // e = JSON.parse(e)
                        e = JSON.parse(e.responseText)
                        $("#inform")["0"].innerHTML = e["message"]
                    }
                });
            }
        }
        );
});