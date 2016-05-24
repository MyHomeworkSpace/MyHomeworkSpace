$("body").contextMenu(true);

$(function(){
    $.contextMenu({
        selector: 'contextMenu',
        items: {
            "edit": {
                name: "Edit",
                icon: "edit",
                // superseeds "global" callback
                callback: function(key, options) {
                    var m = "edit was clicked";
                    window.console && console.log(m) || alert(m);
                }
            },
            "cut": {
              name: "Cut",
              callback: function(key, options) {
                swal("Cut, Copy, and Paste in MyHomeworkSpace", "Due to some browser constraints, you must use keyboard shortcuts to cut, copy, and paste in MyHomeworkSpace. To cut, highlight the text you want to cut, and press Control/Command + X. To copy, higlight the text you want to copy, and press Control/Command + C. To paste, place your cursor where you would like to paste, and press Control/Command + V. Thank you!", "warning");
              }
            },
            copy: {
              name: "Copy",
              callback: function(key, options) {
                swal("Cut, Copy, and Paste in MyHomeworkSpace", "Due to some browser constraints, you must use keyboard shortcuts to cut, copy, and paste in MyHomeworkSpace. To cut, highlight the text you want to cut, and press Control/Command + X. To copy, higlight the text you want to copy, and press Control/Command + C. To paste, place your cursor where you would like to paste, and press Control/Command + V. Thank you!", "warning");
              }
            },
            "paste": {
              name: "Paste",
              callback: function(key, options) {
                swal("Cut, Copy, and Paste in MyHomeworkSpace", "Due to some browser constraints, you must use keyboard shortcuts to cut, copy, and paste in MyHomeworkSpace. To cut, highlight the text you want to cut, and press Control/Command + X. To copy, higlight the text you want to copy, and press Control/Command + C. To paste, place your cursor where you would like to paste, and press Control/Command + V. Thank you!", "warning");
              }
            },
            "sep1": "---------",
            "overview": {
              name: "Overview",
              callback: function(key, options) {
                setPage("overview");
              }
            },
            "hwView": {
              name: "Homework View",
              callback: function(key, options) {
                setPage("hwView");
              }
            },
            "planner": {
              name: "Planner",
              callback: function(key, options) {
                setPage("planner");
              }
            },
            "sep2": "---------",
            "settings": {
              name: "Settings",
              callback: function(key, options) {
                setPage("prefs");
              }
            }
        }
    });
});
