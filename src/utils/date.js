export const getCurrentLocalDateISOString = () => {
    const now = new Date();
    const timeOffsetInMS = now.getTimezoneOffset() * 60000; // convert offset to milliseconds
    const adjustedDate = new Date(now - timeOffsetInMS);
    return adjustedDate.toISOString().substr(0, 10); // format to yyyy-mm-dd
};