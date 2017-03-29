var apps = {
    toggle: function (target, className) {
        if (target.className.indexOf(className) < 0) {
            target.className = className;
        } else {
            target.className = '';
        }
    }
};

(function () {
    var mapLink = document.getElementsByClassName('mapLink')[0];
    var mapCloseBtn = document.querySelector('.mapOverlay .close')

    mapLink.addEventListener('click', function () {
        apps.toggle(document.body, 'overlay');
    });
    mapCloseBtn.addEventListener('click', function () {
        apps.toggle(document.body, 'overlay');
    });
})();