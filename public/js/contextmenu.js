context.init({
    fadeSpeed: 100,
    filter: function ($obj){},
    above: 'auto',
    preventDoubleContext: true,
    compress: false  
})

function cutcopypaste() {
    swal("Cut, Copy, and Paste in MyHomeworkSpace", "Due to some browser constraints, you must use keyboard shortcuts to cut, copy, and paste in MyHomeworkSpace. To cut, highlight the text you want to cut, and press Control/Command + X. To copy, higlight the text you want to copy, and press Control/Command + C. To paste, place your cursor where you would like to paste, and press Control/Command + V. Thank you!", "warning");
}

context.attach('html', [{
    header: 'Menu'
}, {
    text: 'Cut',
    action: function(e) {
        cutcopypaste();
    }
}, {
    text: 'Copy',
    action: function(e) {
        cutcopypaste();
    }
}, {
    text: 'Paste',
    action: function(e) {
        cutcopypaste();
    }
}, {
    divider: true
}, {
    text: 'Print',
    action: function(e) {
        window.print();
    }
}, {
    divide: true
}, {
    text: 'Overview',
    action: function(e) {
        setPage("overview")
    }
}, {
    text: 'HW View',
    action: function(e) {
        setPage("hwview")
    }
}, {
    text: 'Planner',
    action: function(e) {
        setPage("planner")
    }
}, {
    text: 'Prefrences',
    action: function(e) {
        setPage("prefs")
    }
}, ]);
