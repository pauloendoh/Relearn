function goToId(htmlId){
    if(!htmlId.startsWith('#'))
        htmlId = '#' + htmlId;
    window.location.href = htmlId;
    scrollBy(0, -100);
    return;
}