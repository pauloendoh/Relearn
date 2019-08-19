// Ex: minutes = 100 -> 1:40h; minutes = 50 -> 50min
function friendlyMinutes(minutes){
    var result = "";
    if(minutes < 60)
        result = minutes + " min";
    else {
        var hours = Math.floor(minutes/60);
        var remainderMins = minutes % hours;
        if(remainderMins < 10)
            remainderMins = "0" + remainderMins;
        result = hours + ":" + remainderMins + "h"
    }
    return result;
}