//haxing
$(document).ready(function(){
    var groups = [];
    window.api.get("groups/getGroups/", function(result){
        console.log("emlynizdumb")
        //swal("emlynizdumb", result, "success");
        groups = result;
    })
    var htmlEdit =  '';
    for (i=0, i<groups.length(), i++){
         htmlEdit += "<li>"+ groups[i] + "</li>";
    }
    document.getElementById("groupList").innerHTML = htmlEdit;
});
