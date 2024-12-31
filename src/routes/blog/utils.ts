// function to format data
function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        timeZone: 'UTC' // Adjust based on your desired time zone
    };
    //@ts-ignore
    return date.toLocaleDateString('en-US', options);
}

export default formatDate;