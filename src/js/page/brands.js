function openBrands () {
    $(document).on('click', '.js_open_brands,.page_brands_closed', function (e) {
        e.preventDefault()
        var cnt = $(this).closest('li')
        cnt.toggleClass('active')
        var link = cnt.find('.js_open_brands')
        var count = link.data('count')
        if (cnt.hasClass('active')) {
            cnt.find('.page_brands_list_item__hide').show()
            link.text('Свернуть список')
        } else {
            cnt.find('.page_brands_list_item__hide').hide()
            link.text('Показать ещё ' + count)
        }
    })
}

function brandsSelectedAlphovit () {
    $(document).on('click', '.page_brands_filters_alphabet span', function (e) {
        e.preventDefault()
        $('.page_brands_filters_alphabet span').removeClass('active')
        $(this).addClass('active')
        $('.page_brands__search').addClass('active')

        $('.page_brands__search__query').val($(this).text())
        brandsSearchResults($(this).text())
    })

    $(document).on('click', '.page_brands_clear', function (e) {
        e.preventDefault()
        $('.page_brands_filters_alphabet span').removeClass('active')
        $('.page_brands__search__query').val('')
        brandsSearchResults('')
    })
}

function brandsSearchResults ($input) {

    var query = $input.trim().toUpperCase()

    var resultsHTML = document.getElementById('page_brands__search__results__items')
    resultsHTML.innerHTML = ''


    if (query === '') {
        $('.page_brands_clear').hide()
        $('.page_brands__search').removeClass('active')
    } else {

        var mapBrands = []
        $('.page_brands_list_item_search a').map(function (index, item) {
            mapBrands.push({
                url: $(item).attr('href'),
                name: $(item).text(),
            })
        })
        var i = 0



        mapBrands.map(function (item,index) {
            var currentChar = item.name.toUpperCase().substr(0,  query.length)
            if (query == 'ВСЕ БРЕНДЫ' || currentChar === query) {
                var link = document.createElement('a')
                link.setAttribute('href', item.url)
                link.appendChild(document.createTextNode(item.name))
                resultsHTML.appendChild(link)
                i++
            }
        })

        if (i === 0) {
            var empty = document.createElement('div')
            empty.setAttribute('class', 'page_brands__search__results__empty')
            empty.innerText = 'По вашему запросу ничего не найдено'
            resultsHTML.appendChild(empty)
        }

        $('.page_brands_clear').show()
        $('.page_brands__search').addClass('active')
    }



    // Вставляем элемент первым
    //fdkMegaMenu.elementsNew.appendChild(li)
   // var mapBrandsFind = []
/*    var list = [
        {name: '4 Arn', isLetter: false},
        {name: 'Abax', isLetter: false},
        {name: 'Aramex', isLetter: false},
        {name: 'Booking', isLetter: false},
        {name: 'Dangerous', isLetter: false},
        {name: 'Manali', isLetter: false}
    ]*/




}

function brandsInputKeyWord () {
    $('.page_brands__search__query').keyup(function () {
        console.log('Handler for .keypress() called.')
        var value = $(this).val()
        brandsSearchResults(value)
    })

}

$(document).ready(function ($) {

    if ($('.page_brands').length > 0) {



        openBrands()
        brandsSelectedAlphovit()
        brandsInputKeyWord()
    }
})
