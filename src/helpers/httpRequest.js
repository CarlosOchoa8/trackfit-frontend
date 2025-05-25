export const httpRequest = () => {
    const customFetch = (url, options) => {
        const defaultHeaders = {
            accept: "application/json",
        };

        const controller = new AbortController();
        options.signal = controller.signal;
        options.method = options.method || "GET"
        options.headers = options.headers ? {
            ...defaultHeaders, ...options.headers
        } : defaultHeaders;
        options.body = JSON.stringify(options.body) || false;

        if(!options.body) delete options.body;

        setTimeout(() => {
            controller.abort()
        }, 4000);

        return fetch(url, options).then(res => {
            if (res.ok) {
                return res.json();
            } else {
                return res.json()
                    .catch(() => ({}))
                    .then(errorBody => {
                        return Promise.reject({
                            err: true,
                            status: res.status || "500",
                            statusText: res.statusText || "There was an error during the call.",
                            detail: errorBody.detail || errorBody,
                            otraMadre: res || "asdasd"
                        });
                    });
                }
            }).catch(err => err)
    };

    const get = (url, options = {}) => {
        return customFetch(url, options)
    }
    
    const post = (url, options = {}) => {
        options.headers = {
            "Content-Type": "application/json"
        }
        options.method = "POST"
        return customFetch(url, options)
    }

    return {get, post}
};
