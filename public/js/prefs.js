window.prefs = {};



$(document).ready(function() {
  window.api.get("prefs/get/name-subj", function(data) {
    var btnTrue = data.val;
    if(btnTrue == 1) {
      $("prefs-hwView-swap").prop("checked", true);
    }
    $("#usr-btn").click(function() {
      if(btnTrue == 1) {
        btnTrue = 0;
      } else {
        btnTrue = 1;
      };
      window.api.post("prefs/set", { name: "name-subj", value: btnTrue}, function() {});
    });
  });
});
