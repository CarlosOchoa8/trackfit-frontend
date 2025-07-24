const renderService = async (url = import.meta.env.VITE_EXERCISE_BACKEND_API, timeout = 45000) => {
    // console.log("Waking up back service.")
    // console.log("URL =>", url)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const init = performance.now();
        await fetch(url, {
            method: "GET",
            signal: controller.signal,
            headers: {
                "Content-Type": "application/json"
            }
        });
        const end = performance.now();
        const message = {"Ping": `${(end - init).toFixed(2)} ms`};
        // console.log(message)
        return message
    } catch(err) {
        clearTimeout(timeoutId);
        console.log("Service not available.", err)
    }
};

export default renderService;
