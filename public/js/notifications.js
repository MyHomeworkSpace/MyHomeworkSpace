var testNotification = new Notify('Yay! 😀', {
    body: 'If you are seeing this, then notifications have been fully set up and are functional!',
    notifyShow: testNotify
});

function testNotify() {
    console.log('Test notification was shown. 😀');
}
function showTestNotify(){
    testNotification.show();
}