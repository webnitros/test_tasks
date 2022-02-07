function menuResize () {
    var navbar = $('.headers_menu .navbar-nav')
    var width = $('.headers_menu .navbar-nav').width()
    if (width < 1400) {
        navbar.find('li:last-child').prev().hide()
    } else {
        navbar.find('li:last-child').prev().show()
    }
}

$(document).ready(function ($) {

    if ($('.headers_menu .navbar-nav').length > 0) {
        $(window).resize(function () {
            menuResize()
        })
    }

})
