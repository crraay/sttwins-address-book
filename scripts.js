'use strict';

/// METHODS
function createItem(item) {
    var result =
        '<div class="f-row">' +
        '<div class="f-title">' + item.title + '</div>' +
        '<div class="f-right">' +
        '<div class="f-dots">&nbsp;</div>' +
        '<div class="f-address">' + item.address + '</div>' +
        '</div>' +
        '</div>';

    return result;
}

var alternativeTitles = {
    'ПРЕДПРИЯТИЯ': 'УЧРЕЖДЕНИЯ',
    'СРЕДСТВА МАССОВОЙ ИНФОРМАЦИИ': 'СМИ',
    'КОММУНАЛЬНЫЕ СЛУЖБЫ': 'КОМ. СЛУЖБЫ',
    'ФИНАНСОВЫЕ УЧРЕЖДЕНИЯ': 'ФИН. УЧРЕЖДЕНИЯ',
};

function fillFolksMenu(json) {
    var i = 0, keys = [], html = [];
    keys = Object.keys(json['ЧАСТНЫЕ ЛИЦА']);
    for (i = 0; i < keys.length; i++) {
        html.push('<a href="#' + keys[i] +'" class="dropdown-item is-size-6 is-uppercase">' + (alternativeTitles[keys[i]] || keys[i]) + '</a>');
    }
    $('#private-folks').html(html.join('<hr class="dropdown-divider has-background-grey">'));
}

function fillPromMenu(json) {
    var keys = Object.keys(json);
    var i, j, html = [], subMenu = [];
    for (i = 0; i < keys.length; i++) {
        if (keys[i] === 'ЧАСТНЫЕ ЛИЦА') {
            continue;
        }
        html.push('<a href="#' + keys[i] +'" class="dropdown-item is-size-6 is-uppercase" data-key="' + keys[i] + '">' + (alternativeTitles[keys[i]] || keys[i]) + '</a>');
    }
    $('#promMenu').html(html.join('<hr class="dropdown-divider has-background-grey">'));
}

function fillCitizens(json) {
    var data = json['ЧАСТНЫЕ ЛИЦА'];
    var firstLetter = '';
    var html = [];

    var keys = Object.keys(data);

    keys.forEach(key => {
        html.push('<h1 id="' + key + '">' + key + '</h1>');
        html.push('<div class="content-block">');

        for (var i = 0; i < data[key].length; i++) {
            var dataItem = data[key][i];
            if (dataItem.title[0] !== firstLetter) {
                firstLetter = dataItem.title[0]
                html.push('<h2>' + firstLetter + '</h2>');
            }
            html.push(createItem(dataItem));
        }

        html.push('</div>');
    })

    $('#content').html(html.join(''));
}

function fillBusiness(json) {
    var i = 0, j = 0;
    var html = [];
    var groupKeys = Object.keys(json);

    groupKeys.forEach(groupKey => {
        if (groupKey === 'ЧАСТНЫЕ ЛИЦА') {
            return;
        }

        html.push('<h1 id="' + groupKey + '">' + groupKey + '</h1>');
        html.push('<div class="content-block">');

        var group = json[groupKey];
        var keys = Object.keys(group);
        for (i = 0; i < keys.length; i++) {
            if (keys[i] !== 'null') {
                html.push('<h2>' + keys[i] + '</h2>');
            }
            for (j = 0; j < group[keys[i]].length; j++) {
                html.push(createItem(group[keys[i]][j]));
            }
        }

        html.push('</div>');
    });

    $('#content').html($('#content').html() + html.join(''));
}

/// HANDLERS
$(document).on('scroll', () => {
    if ($(this).scrollTop() > 100) {
        if ($('#topButton').is(':hidden')) {
            $('#topButton').css({opacity : 1}).fadeIn('slow');
        }
    } else {
        $('#topButton').stop(true, false).fadeOut('fast');
    }
});

$('#topButton').on('click', () => {
    $('html, body').stop().animate({scrollTop : 0}, 500);
});

$(document).ready(() => {
    $.getJSON("https://cdn.sttwins.com/static/book/data_ru.json?r=0.04", function (json) {
        fillFolksMenu(json);
        fillPromMenu(json);

        fillCitizens(json);
        fillBusiness(json);
    });

    $(document).on('click', 'a[href^="#"]', function (event) {
        event.preventDefault();

        $('html, body').animate({
            scrollTop: $($.attr(this, 'href')).offset().top
        }, 500);
    });
});