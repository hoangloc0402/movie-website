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
            $("#display_name").val(data['data']['user_name'])
            $("#email").val(data['data']['user_email'])
            $("#profileImage").attr('src', data['data']['user_profile_image'])
        }

    });

    $(".my_nav_tag").each((idx, a) => {
        $(a).click(()=>{
            let tag = $(a).text().slice(1);
            window.open(`/searchpage/searchpage.html?q=&tag=${tag}`,"_self");
        })
    })
});