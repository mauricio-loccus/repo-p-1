((global) => {

    async function DOMLoaded()
    {
        updateView()
    }


    async function updateView()
    {
        document.querySelector('#date-time').innerText = (new Date()).toLocaleTimeString()

        for(const index of [ 'paralell','sequential' ])
        {
            const result = { value : null }

            const start = Date.now()
            switch (index)
            {
                
                case 'sequential':
                    result.value = await sequential_getState()
                    break

                case 'paralell':
                    result.value = await paralell_getState()
                    break

            }
            document.querySelector(`#state-${index}`).innerText = result.value ? (JSON.stringify(result.value, null, 4)) : ''
            
            document.querySelector(`#interval-${index}`).innerText = (Date.now() - start) / 1000
        }
        
    }


    async function paralell_getState()
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
                const response = await fetch(state.url, { method: 'HEAD' })
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

        //return results
        return results.map( result => result.status == 'fulfilled' ? ( result.value ) : ( result.status == 'rejected' ? result.reason : null ) )
    }


    async function sequential_getState()
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

        for(const state of states)
        {
            try
            {
                const response = await fetch(state.url, { method: 'HEAD' })
                if (!response.ok)
                    throw new Error('Fail on fetch')

                const lastModified = response.headers.get('Last-Modified')
                if (!lastModified)
                    throw new Error('Invalid Value')

                const lastModifiedTime = new Date(lastModified);
                if (isNaN(lastModifiedTime.getTime()))
                    throw new Error('Invalid Date')

                state.lastUpdate = lastModifiedTime
            }
            catch (exception)
            {
                state.error = exception.message
            }
        }

        return states
    }


    document.addEventListener('DOMContentLoaded', DOMLoaded)

})(window)
