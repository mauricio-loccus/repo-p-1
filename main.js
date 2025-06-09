((global) => {

    function DOMLoaded()
    {
        document.querySelector('#date-time').innerText = Date.now().toString()
    }

    document.addEventListener('DOMContentLoaded', DOMLoaded)

})(window)
