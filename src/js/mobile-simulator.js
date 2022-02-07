if (window.location.search.indexOf("mobileDevice=1") > -1) {

    let pushState = History.prototype.pushState
    History.prototype.pushState = function (state, title, url) {
        let event = new CustomEvent('pushState', {detail: {state: state, title: title, url: url}})
        window.frameElement.dispatchEvent(event)
        pushState.call(this, state, title, url)
    }

    Object.defineProperty(window.navigator, 'userAgent', {value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/14.0.0 Mobile/15A5370a Safari/602.1', writable: false})
    Object.defineProperty(window.screen, 'availWidth', {value: 390, writable: false})
    Object.defineProperty(window.screen, 'availHeight', {value: 844, writable: false})
    Object.defineProperty(window.screen, 'width', {value: 390, writable: false})
    Object.defineProperty(window.screen, 'height', {value: 844, writable: false})
    Object.defineProperty(window, 'devicePixelRatio', {value: 3, writable: false})
    Object.defineProperty(window, 'outerWidth', {value: 390, writable: false})
    Object.defineProperty(window, 'outerHeight', {value: 844, writable: false})
    Object.defineProperty(window.screen.orientation, 'angle', {value: 0, writable: false})
    Object.defineProperty(window.screen.orientation, 'type', {value: 'portrait-primary', writable: false})
    //Object.defineProperty(window.navigator, "serviceWorker", { value: "", writable : false });
    ServiceWorkerContainer.prototype.register = function () { return new Promise((resolve, reject) => { reject() }) }

    var windowOpenFn = window.open
    window.open = (url, name, features) => {
        name = name.replace('_top', '_self').replace('_parent', '_self')
        windowOpenFn(url, name, features)
    }

    var body = document.body;

    body.classList.add("mobile-simulator");


    var obj = document.createElement('style');
    obj.innerText = 'html { zoom: 100% !important;}*:not(.simulator) {    cursor: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAYAAAAe2bNZAAAACXBIWXMAAC4jAAAuIwF4pT92AAAE/2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0NDYwLCAyMDIwLzA1LzEyLTE2OjA0OjE3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMiAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjAtMTEtMDFUMjA6MzM6MzMrMDE6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjAtMTEtMDFUMjA6MzM6MzMrMDE6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIwLTExLTAxVDIwOjMzOjMzKzAxOjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1NGQ2YzIwNC01MTg5LTQ3NDQtYmNjMi1iYWFlODA5MDhmMTUiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDoyMTE0OTVlYS1mODk3LTA0NGMtODVlMS0wZjYxMjA3OTRhNjYiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1NGQ2YzIwNC01MTg5LTQ3NDQtYmNjMi1iYWFlODA5MDhmMTUiIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjU0ZDZjMjA0LTUxODktNDc0NC1iY2MyLWJhYWU4MDkwOGYxNSIgc3RFdnQ6d2hlbj0iMjAyMC0xMS0wMVQyMDozMzozMyswMTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjIgKE1hY2ludG9zaCkiLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+7bt9yAAAAh9JREFUWMPNmDtuwkAQhleWoePRQQlNlJwBaAFBAxyEXAAQNDREIig02wANVHAGKIBrkR1rfmvjKMgbP4tfFtZ65sOenZ0Z8Xg8hIEspVelntK70lzpU0nydc73e7zOMrHvd2FOqa+0YMd+teDncmHA2EodpS84uFwucjabyVarJavVqiwWi1II4VzpN92fTqfOOg2Knu+yvX/BlJRGMHg6nWS9Xncc+xWtp+c0qBHbNYJ5UVqSgfv97vxbEwivms2mY4eBlmzfF8wrPsvhcJDZbDYQCJTJZBx7DLRmP09hStgdu90uFAivttut1HZf6S8YGzGy3+8jAYHIPgON9aDWYTqIEXqlUcKQ/dvtBqCOFyaPOGm325GCQLQptPjJ6zCUMeXxeIwFBCJ/DNQHjIXM2mg0YoWhPKRlagtbWZ7P51hBIPLLQG/uJ6IUnwTMZDIBzIBghnEGrlfkl2GGgo99WalUEoGhw5Vh5gSzoh+FQiERGPLLMCuBEzUJEMhlSNubSVXMpGo3pSrPpCoDu2eTaY0bxdkk+NRMxamNeobqisDFdxj1jFvpUQWWdKWHGniclhr4R3ew2WwiASG7froDvW9ao2+ybTsUCLJj2jf96iiv16vTEQbtKLUYMeoooTJiCNveNA/VajV9+yJGykGmEF18NkwhaMqAKQROe7o+mUKsg04hdOU5MX0Yzmdo/QB5JKxh0bPJ1Qr1SNDJ1Te3Vbki9SeGVAAAAABJRU5ErkJggg==) 17 17, pointer !important;    scrollbar-width: none;}body {display: block !important;}* {image-rendering: -webkit-optimize-contrast;image-rendering: optimize-contrast;}::-webkit-scrollbar {background: transparent;width: 0 !important; height: 0 !important;}::-webkit-scrollbar-thumb {width: 0 !important;background: rgba(0, 0, 0, 0.5);border: solid 3px transparent;background-clip: content-box;border-radius: 17px;}.mf-hide-element {display: none !important;opacity: 0 !important;visibility: hidden !important;}'
    body.appendChild(obj);
}
