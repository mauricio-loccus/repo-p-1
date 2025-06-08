((global) => {

    function DOMLoaded()
    {
        document.querySelector('div').innerText = 'DOM Loaded'
    }

    document.addEventListener('DOMContentLoaded', DOMLoaded)

})(window)
