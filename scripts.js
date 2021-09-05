'use strict';

/// METHODS
function createAddressItem(item) {
    var result =
        `<div class="f-row">
            <div class="f-title">${item.title}</div>
            <div class="f-dots">&nbsp;</div>
            <div class="f-address">${item.address}</div>
        </div>`;

    return result;
}

function createAddressesContent(data, groupByFirstLetter = false) {
    var firstLetter = '';
    var result = [];
    var item;

    for (var i = 0; i < data.length; i++) {
        item = data[i];

        if (groupByFirstLetter && (item.title[0] !== firstLetter)) {
            firstLetter = item.title[0]
            result.push('<h2>' + firstLetter + '</h2>');
        }

        result.push(createAddressItem(item));
    }

    return result;
}

function createAddressesHeader(title) {
    return '<h1 id="' + $.escapeSelector(title) + '">' + title + '</h1>';
}

function createSubmenu(data) {
    var alternativeTitles = {
        'ПРЕДПРИЯТИЯ': 'УЧРЕЖДЕНИЯ',
        'СРЕДСТВА МАССОВОЙ ИНФОРМАЦИИ': 'СМИ',
        'КОММУНАЛЬНЫЕ СЛУЖБЫ': 'КОМ. СЛУЖБЫ',
        'ФИНАНСОВЫЕ УЧРЕЖДЕНИЯ': 'ФИН. УЧРЕЖДЕНИЯ',
    };

    var keys = Object.keys(data);
    var result = [];

    for (var i = 0; i < keys.length; i++) {
        result.push(
            `<a
                data-key="${$.escapeSelector(keys[i])}"
                class="dropdown-item is-size-6 is-uppercase">
                ${(alternativeTitles[keys[i]] || keys[i])}
            </a>`
        );
    }

    return result.join('<hr class="dropdown-divider has-background-grey">');
}

function createCitizens(data) {
    var result = [];
    var keys = Object.keys(data);

    keys.forEach(key => {
        result.push(createAddressesHeader(key));
        result.push('<div class="content-block">');

        result = result.concat(createAddressesContent(data[key], true));

        result.push('</div>');
    })

    return result.join('');
}

function createBusiness(data) {
    var result = [];
    var groupKeys = Object.keys(data);

    groupKeys.forEach(groupKey => {
        result.push(createAddressesHeader(groupKey));
        result.push('<div class="content-block">');

        var group = data[groupKey];
        var keys = Object.keys(group);
        for (var i = 0; i < keys.length; i++) {
            result.push('<h2>' + keys[i] + '</h2>');

            result = result.concat(createAddressesContent(group[keys[i]]));
        }

        result.push('</div>');
    });

    return result.join('');
}

/// HANDLERS
$(document).on('scroll', event => {
    if ($(this).scrollTop() > 100) {
        if ($('#topButton').is(':hidden')) {
            $('#topButton').css({opacity : 1}).fadeIn('slow');
        }
    } else {
        $('#topButton').stop(true, false).fadeOut('fast');
    }

    var scrollTop = $(document).scrollTop();
    var fixedTop = 90;

    var diff = fixedTop - scrollTop;
    var menu = $('#fixed-menu');
    menu.css({top: `${diff > 0 ? diff : 0}px`});
});

$('#topButton').on('click', () => {
    $('html, body').stop().animate({scrollTop : 0}, 500);
});

$(document).ready(() => {
    $.getJSON("https://cdn.sttwins.com/static/book/data_ru.json?r=0.04", function (json) {
        var citizens = json['ЧАСТНЫЕ ЛИЦА'];
        delete json['ЧАСТНЫЕ ЛИЦА'];

        $('#citizenMenu .content').html(createSubmenu(citizens))
        $('#businessMenu .content').html(createSubmenu(json))

        $('#content').html(createCitizens(citizens) + createBusiness(json));
    });

    $(document).on('click', 'a[data-key]', function (event) {
        event.preventDefault();

        const id = $.attr(this, 'data-key');
        $('html, body').animate({
            scrollTop: $('#' + $.escapeSelector(id)).offset().top
        }, 500);
    });
});
