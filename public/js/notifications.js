var testNotification = new Notify('Yay!', {
    body: 'If you are seeing this, then notifications have been fully set up and are functional!',
    icon: window.page.getStaticUrl() + "images/notificationicon.svg" ,
    notifyShow: testNotify
});

function testNotify() {
    console.log('Test notification was shown.');
}

function showTestNotify(){
    testNotification.show();
}

if (!Notify.needsPermission) {
    doNotification();
} else if (Notify.isSupported()) {
    Notify.requestPermission(onNotifyPermissionGranted, onNotifyPermissionDenied);
}

function onNotifyPermissionGranted() {
    console.log('Notification permission enabled. :)');
    doNotification();
}

function onNotifyPermissionDenied() {
    console.warn('Notification permission denied. :(');
    swal({
        title: 'Oops',
        text: 'You denied access for us to send you desktop notifications. Here are instructions for how to accept access for them: <a href="https://support.google.com/chrome/answer/6148059?hl=en&ref_topic=3434353">Chrome</a>, <a href="https://support.mozilla.org/en-US/kb/push-notifications-firefox">Firefox</a>, and <a href="https://support.apple.com/kb/PH21493?locale=en_US&viewlocale=en_US">Safari</a>. If you need more help, you can contact us at <a href="mailto:hello@myhomework.space">hello@myhomework.space</a>. You can always disable desktop notifications in settings.',
        type: "warning",
        html: true
    });
}