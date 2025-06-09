((global) => {

    function DOMLoaded()
    {
        document.querySelector('#date-time').innerText = (new Date()).toLocaleTimeString()
    }

    document.addEventListener('DOMContentLoaded', DOMLoaded)

})(window)
