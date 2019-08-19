// Django related functions

// Use this in someTemplate.html <script></script>
// jsonDjangoObject example: '{{ jsonResourceListInfo }}' 
function serializedDjangoToJsonList(jsonDjangoObject){
    var pureJsonList = [];
    var djangoJsonList = JSON.parse(jsonDjangoObject);
    for(var i = 0; i < djangoJsonList.length; i++){
        delete djangoJsonList[i]["fields"]["id"]
        var obj = djangoJsonList[i].fields;
        obj["id"] = djangoJsonList[i].pk;
        pureJsonList.push(obj);
    }
    return pureJsonList;
}
