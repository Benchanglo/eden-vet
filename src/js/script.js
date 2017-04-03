(function () {
    var mapLink = document.getElementsByClassName('mapLink')[0];
    var mapCloseBtn = document.querySelector('.mapOverlay .close')
    var domainBtns = document.getElementsByClassName('select-domain');
    var toggleMap = function (target, className) {
        if (target.className.indexOf(className) < 0) {
            target.className = className;
        } else {
            target.className = '';
        }
    };
    var i;
    var domainHeight;
    var highlight;
    var selectedDomain = 0;
    var doctors;
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
    var domainIndex = 0;
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
                doctors[i].className = 'people-doc';
            }
        } else {
            for (i = 0; i < peopleCategory.length; i += 1) {
                found = false;
                for (j = 0; j < peopleCategory[i].specialties.length; j += 1) {
                    if (peopleCategory[i].specialties[j] === category) {
                        found = true;
                    }
                }
                if (found) {
                    doctors[i].className = doctors[i].className = 'people-doc';
                } else {
                    doctors[i].className = 'people-doc hide';
                }
            }
        }
    };

    mapLink.addEventListener('click', function () {
        toggleMap(document.body, 'overlay');
    });
    mapCloseBtn.addEventListener('click', function () {
        toggleMap(document.body, 'overlay');
    });
    if (domainBtns.length > 0) {
        for (i = 0; i < domainBtns.length; i += 1) {
            bindSelectBtnEvent(domainBtns[i], i);
        }
        highlight = document.getElementsByClassName('highlight')[0];
        domainBtns[selectedDomain].className += ' selected';
        highlight.style.top = 0;
        doctors = document.getElementsByClassName('people-doc');
        domainHeight = domainBtns[0].offsetHeight;
    }
})();