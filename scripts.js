'use strict';
document.addEventListener('DOMContentLoaded', function () {
    debugger;
    var json = {};
    var alternativeTitles = {
        'ПРЕДПРИЯТИЯ': 'УЧРЕЖДЕНИЯ',
        'СРЕДСТВА МАССОВОЙ ИНФОРМАЦИИ': 'СМИ',
        'КОММУНАЛЬНЫЕ СЛУЖБЫ': 'КОМ. СЛУЖБЫ',
        'ФИНАНСОВЫЕ УЧРЕЖДЕНИЯ': 'ФИН. УЧРЕЖДЕНИЯ',
    };
    var fillFolksMenu = function (json) {
        var i = 0, keys = [], html = [];
        keys = Object.keys(json['ЧАСТНЫЕ ЛИЦА']);
        for (i = 0; i < keys.length; i++) {
            html.push('<a href="#" class="dropdown-item is-size-6 is-uppercase" data-key="' + keys[i] + '">' + (alternativeTitles[keys[i]] || keys[i]) + '</a>');
        }
        $('#private-folks').html(html.join('<hr class="dropdown-divider has-background-grey">'));
    }
    var fillPromMenu = function (json) {
        var keys = Object.keys(json);
        var i, j, html = [], subMenu = [];
        for (i = 0; i < keys.length; i++) {
            if (keys[i] === 'ЧАСТНЫЕ ЛИЦА') {
                continue;
            }
            html.push('<a href="#" class="dropdown-item is-size-6 is-uppercase" data-key="' + keys[i] + '">' + (alternativeTitles[keys[i]] || keys[i]) + '</a>');
        }
        $('#promMenu').html(html.join('<hr class="dropdown-divider has-background-grey">'));
    }
    $.getJSON("https://cdn.sttwins.com/static/book/data_ru.json?r=0.04", function (data) {
        json = data;
        fillFolksMenu(json);
        fillPromMenu(json);
        // $('#private-folks a:first').click();
    });
    var scrollToAddresses = function () {
        var windowWidth = $(window).width();
        if (windowWidth >= 700) {
            $([document.documentElement, document.body]).animate({
                scrollTop: 0
            }, 500);
        } else if ($([document.documentElement, document.body]).scrollTop() !== $("#addresses").offset().top) {
            $([document.documentElement, document.body]).animate({
                scrollTop: $("#addresses").offset().top
            }, 500);
        }
    }
    $(document).on('click', '#private-folks a', function (e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        var i = 0, firstLetter = '';
        var html = [];
        var addresses = json['ЧАСТНЫЕ ЛИЦА'][$(e.target).data('key').trim()];
        for (i = 0; i < addresses.length; i++) {
            if (addresses[i].title[0] !== firstLetter) {
                firstLetter = addresses[i].title[0]
                html.push('<h2>' + firstLetter + '</h2>');
            }
            html.push(
                '<div class="f-row">' +
                '<div class="f-title">' + addresses[i].title + '</div>' +
                '<div class="f-right">' +
                '<div class="f-dots">&nbsp;</div>' +
                '<div class="f-address">' + addresses[i].address + '</div>' +
                '</div>' +
                '</div>'
            );
        }
        $('#addresses').html(html.join(''));
        $('#addresses').find(':first').css({marginTop: '0px', paddingTop: '0px'});
        $('#private-folks a.is-active, #promMenu a.is-active').removeClass('is-active');
        $(e.target).addClass('is-active');
        scrollToAddresses();
        return false
    });
    $(document).on('click', '#promMenu a', function (e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        var i = 0, j = 0;
        var html = [];
        var groups = json[$(e.target).data('key').trim()];
        var keys = Object.keys(groups);
        for (i = 0; i < keys.length; i++) {
            if (keys[i] !== 'null') {
                html.push('<h2>' + keys[i] + '</h2>');
            }
            for (j = 0; j < groups[keys[i]].length; j++) {
                html.push(
                    '<div class="f-row">' +
                    '<div class="f-title">' + groups[keys[i]][j].title + '</div>' +
                    '<div class="f-right">' +
                    '<div class="f-dots">&nbsp;</div>' +
                    '<div class="f-address">' + groups[keys[i]][j].address + '</div>' +
                    '</div>' +
                    '</div>'
                );
            }
        }
        $('#addresses').html(html.join(''));
        $('#addresses').find(':first').css({marginTop: '0px', paddingTop: '0px'});
        $('#private-folks a.is-active, #promMenu a.is-active').removeClass('is-active');
        $(e.target).addClass('is-active');
        scrollToAddresses();
        return false
    });

    var topButton = document.getElementById('topButton');

    window.onscroll = function () {
        scrollFunction()
    };

    function scrollFunction() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            if (topButton.style.display !== 'block') {
                topButton.style.display = 'block';
            }
        } else {
            if (topButton.style.display !== 'none') {
                topButton.style.display = 'none';
            }
        }
    }

    window.topFunction = function () {
        $([document.documentElement, document.body]).animate({
            scrollTop: 0
        }, 500);
    }
});