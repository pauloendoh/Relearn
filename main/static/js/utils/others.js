function goToId(htmlId) {
    if (!htmlId.startsWith('#'))
        htmlId = '#' + htmlId;
    window.location.href = htmlId;
    scrollBy(0, -100);
    return;
}

function briefHighlight(htmlSelector) {
    window.location.href = htmlSelector;
    scrollBy(0, -100);
    $(htmlSelector).css({
        "box-shadow": "0px 0px 30px -9px rgba(0,163,155,1)",
        "transition": "0.5s"
    });
    setTimeout(function () {
        $(htmlSelector).css("box-shadow", "none");
    }, 1000)
}