(function () {
    var selectedDomain = 0;
    var domainBtns;
    var domainHeight = 32;
    var highlight;
    var doctors;
    var doctorsClassNameOrg;
    var bindMapToggle = function () {
        var toggleMap = function (target, className) {
            if (target.className.indexOf(className) < 0) {
                target.className = className;
            } else {
                target.className = '';
            }
        };
        var mapLink = document.getElementsByClassName('mapLink');
        var infoMobile = document.getElementsByClassName('info-mobile');
        var mapCloseBtn = document.querySelector('.mapOverlay .close');

        mapLink[0].addEventListener('click', function () {
            toggleMap(document.body, 'overlay');
        });
        infoMobile[0].addEventListener('click', function (e) {
            e.preventDefault();
            toggleMap(document.body, 'overlay');
        });
        mapCloseBtn.addEventListener('click', function () {
            toggleMap(document.body, 'overlay');
        });
    };
    var bindSelectDomain = function () {
        var i;
        var bindSelectBtnEvent = function (item, index) {
            item.addEventListener('click', function (e) {
                e.preventDefault();
                selectDomain(index);
            });
        };
        var filterDomain = function (category) {
            var i;
            var j;
            var found;

            if (category === 'all') {
                for (i = 0; i < doctors.length; i += 1) {
                    doctors[i].className = doctorsClassNameOrg;
                }
            } else {
                for (i = 0; i < peopleCategory.length; i += 1) {
                    found = false;
                    for (j = 0; j < peopleCategory[i].domains.length; j += 1) {
                        if (peopleCategory[i].domains[j] === category) {
                            found = true;
                        }
                    }
                    if (found) {
                        doctors[i].className = doctors[i].className = doctorsClassNameOrg;
                    } else {
                        doctors[i].className = doctorsClassNameOrg + ' hide';
                    }
                }
            }
        };
        var selectDomain = function (index) {
            var i;
            var domainName = domainBtns[index].innerText;

            if (selectedDomain !== index) {
                selectedDomain = index;
                for (i = 0; i < domainBtns.length; i += 1) {
                    domainBtns[i].className = domainBtns[i].className.replace(' selected', '');
                }
                domainBtns[index].className += ' selected';
                highlight.style.top = domainHeight * index + 'px';
                if (index === 0) {
                    filterDomain('all');
                } else {
                    filterDomain(domainName);
                }
            }
        };

        for (i = 0; i < domainBtns.length; i += 1) {
            bindSelectBtnEvent(domainBtns[i], i);
        }
    };
    var appendCSS = function (filePath) {
        var style = document.createElement('link');
        var head = document.getElementsByTagName('head')[0];

        style.rel = 'stylesheet';
        style.href = filePath;
        head.appendChild(style);
    };

    appendCSS('./production.css');
    bindMapToggle();
    domainBtns = document.getElementsByClassName('select-domain');
    if (domainBtns.length > 0) {
        highlight = document.getElementsByClassName('highlight')[0];
        doctors = document.getElementsByClassName('people-doc');
        domainBtns[selectedDomain].className += ' selected';
        highlight.style.top = 0;
        doctorsClassNameOrg = doctors[0].className;
        //domainHeight = domainBtns[0].offsetHeight;
        bindSelectDomain();
    }
})();