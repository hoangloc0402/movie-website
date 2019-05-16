
var typingTimer;
var doneTypingInterval = 500;
var $input = $('#my_search_bar_input');

$input.on('keyup', function () {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTyping, doneTypingInterval);
});

//on keydown, clear the countdown 
$input.on('keydown', function () {
    clearTimeout(typingTimer);
});

$("#search_results").width($input.width());

function doneTyping() {
    if ($input.val() !== "") {
        var q = $input.val();
        $.get(`/api/series.php?q=${q}&tag=&page=0&per_page=5`, (data) => {
            data = JSON.parse(data);
            let list = [];
            if (data && data.result && data.result.length > 0) {
                for (var i = 0; i < data.result.length; i++) {
                    let div = $(`<p>${data.result[i].series_name}</p>`)
                    let url = "";
                    if (data.result[i].is_series === "1") {
                        url = `/tvshowpage/tvshowpage.html?series_id=${data.result[i].series_id}`;
                    } else {
                        url = `/moviewatchingpage/movie-player.html?series_id=${data.result[i].series_id}`;
                    }
                    div.attr('url_watching', url)
                    list.push(div)
                }
            }
            $("#search_results").empty();
            $("#search_results").append(list);
            $("#search_results").find("p").each((i, p) => {
                $(p).click(() => { window.open($(p).attr('url_watching'), '_self') })
            })
        })
    }
}

$input.focusout(() => {
    $("#search_results").empty();
})