export const httpRequest = () => {
    const customFetch = (url, options) => {
        const defaultHeader = {
            accept: "application/json"
        };

        const controller = new AbortController();
        options.signal = controller.signal;
        options.method = options.method || "GET"
        options.header = options.header ? {
            ...defaultHeader, ...options.header
        } : defaultHeader;
        options.body = JSON.stringify(options.body) || false;

        if(!options.body) delete options.body;

        setTimeout(() => {
            controller.abort()
        }, 1000);

        return fetch(url, options).then(
            res => res.ok ? res.json(): Promise.reject({
                err: true,
                status: res.status || "500",
                statusText: res.statusTest || "There was an error during the call."
            })
        ).catch(err => err)
    };

    const get = (url, options = {}) => {
        return customFetch(url, options)
    }
    
    const post = (url, options = {}) => {
        options.method = "POST"
        return customFetch(url, options)
    }

    return {get, post}
};
