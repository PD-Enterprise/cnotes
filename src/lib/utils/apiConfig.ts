const DEV_API_URL = "http://127.0.0.1:8787/"
const PROD_API_URL = "https://backend-service.pdenterprise314.workers.dev/"

const getApiUrl = () => {
    if (import.meta.env.MODE == "development") {
        return DEV_API_URL
    }
    return PROD_API_URL
}

const config = {
    apiUrl: getApiUrl()
}

export default config