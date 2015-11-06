window.prefs = {};



$(document).ready(function() {
  window.api.get("prefs/get/name-subj", function(data) {
    var btnTrue = data.val;
    if(btnTrue == "1") {
      $("#prefs-hwView-swap").prop("checked", true);
    }
    $("#prefs-hwView-swap").change(function() {
      if(btnTrue == "1") {
        btnTrue = "0";
      } else {
        btnTrue = "1";
      };
      window.api.post("prefs/set", { name: "name-subj", value: btnTrue}, function() {});
      alert("buttonstuff");
      alert(btnTrue);
    });
    
  });
  $("#usr-btn").click(function() {
    var usrname = $("#usr-name").val();
    window.api.post("prefs/setName", { name: "#{usrname}" }, function() {
      alert($("#usr-name").val());
    });
  });
});
