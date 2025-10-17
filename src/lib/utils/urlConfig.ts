const DEV = "http://localhost:5173/"
const PROD = "https://cnotes.pages.dev/"

const getShareUrl = () => {
    if (import.meta.env.MODE == "development") {
        return DEV
    }
    return PROD
}

const urlConfig = {
    shareUrl: getShareUrl()
}

export default urlConfig