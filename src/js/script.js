var app = {
    doms: {
        doctors: null,
        domainBtns: null,
        highlight: null
    },
    params: {
        doctorsClassNameOrg: null,
        domainHeight: 32,
        selectedDomain: 0
    },
    bindSelectDomain: function () {
        var i;
        var bindSelectBtnEvent = function (item, index) {
            item.addEventListener('click', function (e) {
                e.preventDefault();
                selectDomain(index, e.target.getAttribute('href'), true);
            });
        };
        var filterDomain = function (category) {
            var doctors = app.doms.doctors;
            var i;
            var j;
            var found;

            if (category === 'all') {
                for (i = 0; i < doctors.length; i += 1) {
                    doctors[i].className = app.params.doctorsClassNameOrg;
                }
            } else {
                // predefined peopleCategory
                for (i = 0; i < peopleCategory.length; i += 1) {
                    found = false;
                    for (j = 0; j < peopleCategory[i].domains.length; j += 1) {
                        if (peopleCategory[i].domains[j] === category) {
                            found = true;
                        }
                    }
                    if (found) {
                        doctors[i].className = doctors[i].className = app.params.doctorsClassNameOrg;
                    } else {
                        doctors[i].className = app.params.doctorsClassNameOrg + ' hide';
                    }
                }
            }
        };
        var selectDomain = function (index, anchor, toPush) {
            var i;
            var domainName = app.doms.domainBtns[index].innerText;
            var domainBtns = app.doms.domainBtns;

            if (app.params.selectedDomain !== index) {
                app.params.selectedDomain = index;
                for (i = 0; i < domainBtns.length; i += 1) {
                    domainBtns[i].className = domainBtns[i].className.replace(' selected', '');
                }
                domainBtns[index].className += ' selected';
                app.doms.highlight.style.top = app.params.domainHeight * index + 'px';
                if (index === 0) {
                    filterDomain('all');
                } else {
                    filterDomain(domainName);
                }
                if (toPush) {
                    window.history.pushState({}, document.title, app.params.baseUrl + anchor);
                }
            }
        };
        var selectOnLoad = function () {
            var url = window.location.href;
            var anchorIndex = url.indexOf('#division-');
            var anchor;
            var domainIndex;

            app.params.baseUrl = url.substring(0, anchorIndex);
            if (anchorIndex > 0) {
                anchor = url.substring(url.indexOf('#'));
                domainIndex =  parseInt(anchor.substring(anchor.indexOf('-') + 1));
                selectDomain(domainIndex, anchor);
            }
        };

        for (i = 0; i < app.doms.domainBtns.length; i += 1) {
            bindSelectBtnEvent(app.doms.domainBtns[i], i);
        }
        window.onpopstate = function () {
            selectOnLoad();
        };
        selectOnLoad();
    },
    bindSubpage: function () {
        var i;
        var bindSelectSubpageEvent = function (item, index) {
            item.addEventListener('click', function (e) {
                var href = e.target.getAttribute('href');
                var subpageName = href.substring(href.indexOf('#') + 1);

                if (subpageName.indexOf('?') > 0) {
                    subpageName = subpageName.substring(0, subpageName.indexOf('?'));
                }
                e.preventDefault();
                selectSubpage(subpageName, index);
            });
        };
        var bindSelectDivEvent = function (item, index) {
            item.addEventListener('click', function (e) {
                e.preventDefault();
                selectDiv(index, true);
            });

        };
        var bindToggleResumeEvent = function (item) {
            item.addEventListener('click', function (e) {
                e.preventDefault();
                toggleBd(e);
            });
        };
        var toggleBd = function (e) {
            var bd = e.target.parentNode.parentNode;

            if (bd.className.indexOf('show') > 0) {
                bd.className = 'Cf';
            } else {
                bd.className = 'Cf show';
            }
        };
        var selectDiv = function (index, toPush) {
            var i;
            var revealedToggles;

            for (i = 0; i < app.doms.subnavs.length; i += 1) {
                if (i === index) {
                    app.doms.subnavs[i].className = app.params.subNavClassNameOrg + ' selected';
                    app.doms.divisionLi[i].className = app.params.divisionLiClassNameOrg + ' show';
                } else {
                    app.doms.subnavs[i].className = app.params.subNavClassNameOrg;
                    app.doms.divisionLi[i].className = app.params.divisionLiClassNameOrg + ' hide';
                }
            }
            if (toPush) {
                window.history.pushState({}, document.title, app.params.baseUrl + '?div=' + index);
            }
            revealedToggles = document.querySelectorAll('.division-li.show .toggle-resume');
            if (revealedToggles.length <= 4) {
                app.showCollapsedItem(revealedToggles);
            }
        };
        var selectByUrl = function () {
            var url = window.location.href;
            var divQuery = url.indexOf('?div=');

            app.params.baseUrl = url.substring(0, url.indexOf('.html') + 5);
            if (divQuery < 0) {
                divQuery = 0;
            } else {
                divQuery = parseInt(url.substring(divQuery + 5));
            }
            selectDiv(divQuery);
        };
        var revealedToggles;

        if (app.doms.subnavs) {
            for (i = 0; i < app.doms.subnavs.length; i += 1) {
                bindSelectDivEvent(app.doms.subnavs[i], i);
            }
            window.onpopstate = function () {
                selectByUrl();
            };
            selectByUrl();
        }
        for (i = 0; i < app.doms.toggleResume.length; i += 1) {
            bindToggleResumeEvent(app.doms.toggleResume[i]);
        }
        if (app.doms.toggleArticle) {
            for (i = 0; i < app.doms.toggleArticle.length; i += 1) {
                bindToggleResumeEvent(app.doms.toggleArticle[i]);
            }
        }
    },
    highlightSidebar: function () {
        for (i = 0; i < app.doms.sidebars.length; i += 1) {
            bindSelectSubpageEvent(app.doms.sidebars[i], i);
        }
    },
    showCollapsedItem: function (items) {
        var i;

        for (i = 0; i < items.length; i += 1) {
            items[i].parentNode.parentNode.className = 'Cf show';
        }
    },
    bindMapToggle: function () {
        var toggleMap = function (target, className) {
            if (target.className.indexOf(className) < 0) {
                target.className = className;
            } else {
                target.className = '';
            }
        };
        var mapLink = document.getElementsByClassName('mapLink');
        var infoMobile = document.getElementsByClassName('info-mobile');
        var mapCloseBtn = document.querySelector('.mapOverlay .overlay-close');
        var i;
        var bindLinkEvent = function (obj) {
            obj.addEventListener('click', function (e) {
                e.preventDefault();
                toggleMap(document.body, 'overlay');
            });
        };

        for (i = 0; i < mapLink.length; i +=1) {
            bindLinkEvent(mapLink[i]);
        }
        for (i = 0; i < infoMobile.length; i +=1) {
            bindLinkEvent(infoMobile[i]);
        }
        mapCloseBtn.addEventListener('click', function () {
            toggleMap(document.body, 'overlay');
        });
    },
    appendCSS: function (filePath) {
        var style = document.createElement('link');
        var head = document.getElementsByTagName('head')[0];

        style.rel = 'stylesheet';
        style.href = filePath;
        head.appendChild(style);
    },
    init: function () {
        var page;
        // Apply critical path only in home page
        /*
        var pageClass = document.getElementsByClassName('page')[0];
        if (pageClass.className.indexOf('index') > 0) {
            appendCSS('./production.css');
        }
        */
        app.appendCSS('./production.css');
        app.bindMapToggle();
        app.doms.domainBtns = document.getElementsByClassName('select-domain');
        if (app.doms.domainBtns.length > 0) {
            app.doms.domainBtns[app.params.selectedDomain].className += ' selected';
            app.doms.highlight = document.getElementsByClassName('highlight')[0];
            app.doms.doctors = document.getElementsByClassName('people-doc');
            app.doms.highlight.style.top = 0;
            app.params.doctorsClassNameOrg = app.doms.doctors[0].className;
            app.bindSelectDomain();
        }
        //service
        page = document.getElementsByClassName('page')[0];
        if (page.className.indexOf('divisions') > 0) {
            app.doms.subnavs = document.querySelectorAll('.subnav li a');
            app.doms.divisionLi = document.getElementsByClassName('division-li');
            app.doms.toggleResume = document.getElementsByClassName('toggle-resume');
            app.params.subNavClassNameOrg = app.doms.subnavs[0].className;
            app.params.divisionLiClassNameOrg = app.doms.divisionLi[0].className;
            app.bindSubpage();
        } else if (page.className.indexOf('beyondDogCat') > 0) {
            app.doms.toggleResume = document.getElementsByClassName('toggle-resume');
            app.doms.toggleArticle = document.getElementsByClassName('toggle-article');
            app.bindSubpage();
            app.showCollapsedItem(app.doms.toggleResume);
        }
    }
};

app.init();