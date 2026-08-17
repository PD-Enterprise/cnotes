import imageCompression from "browser-image-compression"

const options = {
    maxSizeMB: 20,
    useWebWorker: true,
}

export async function compressImage(image: File | undefined): Promise<File | null> {
    if (!image) {
        return null;
    }
    try {
        const compressedFile = await imageCompression(image, options)
        return compressedFile;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return null;
    }
}