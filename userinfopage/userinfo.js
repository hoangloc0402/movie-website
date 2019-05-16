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

$(document).ready(function(){
    $.ajax({
        type: 'GET',
        url: '../api/user.php',
        dataType: "json",
        async:true,
        data: {
            user_id: 1
        },
        success: function(data) {
            console.log(data['data'])
            $("#display_name").val(data['data']['user_name'])
            $("#email").val(data['data']['user_email'])
            $("#profileImage").attr('src', data['data']['user_profile_image'])
        }

    });
});