((global) => {
    const Sleep = (milliseconds) => ( new Promise((resolve) => setTimeout(resolve, milliseconds)) )
    const INTERVAL = 15000


    async function DOMLoaded()
    {
        document.querySelector('#update').addEventListener('click', () => updateView())
        updateView()
    }


    async function updateThread()
    {
        while (true)
        {
            await updateView()
            await Sleep(INTERVAL)
        }
    }


    async function updateView()
    {
        document.querySelector('#date-time').innerText = (new Date()).toLocaleTimeString()

        const start = Date.now()
        document.querySelector(`#state`).innerText = JSON.stringify(await getState(), null, 4)
        document.querySelector(`#interval`).innerText = (Date.now() - start) / 1000        
    }


    async function getState()
    {
        const states = [
            {
                url        : 'index.html',
                lastUpdate :  null
            },
            {
                url        : 'main.css',
                lastUpdate :  null
            },
            {
                url        : 'main.js',
                lastUpdate :  null
            }
        ]

        const results = await Promise.allSettled(states.map( state => new Promise( async (resolve,reject) => {
            try
            {
                const response = await fetch(state.url, {
                    method: 'HEAD'
                })
                if (!response.ok)
                    throw new Error('Fail on fetch')

                const lastModified = response.headers.get('Last-Modified')
                if (!lastModified)
                    throw new Error('Invalid Value')

                const lastModifiedTime = new Date(lastModified);
                if (isNaN(lastModifiedTime.getTime()))
                    throw new Error('Invalid Date')

                state.lastUpdate = lastModifiedTime

                resolve(state)
            }
            catch (exception)
            {
                reject({
                    ...state,
                    error : exception.message
                })
            }
        })))

        return results.map( result => result.status == 'fulfilled' ? ( result.value ) : ( result.status == 'rejected' ? result.reason : null ) )
    }

    document.addEventListener('DOMContentLoaded', DOMLoaded)

})(window)
