export const getCurrentLocalDateISOString = (): string => {
    const now = new Date();
    const timeOffsetInMS: number = now.getTimezoneOffset() * 60000; // convert offset to milliseconds
    const adjustedDate: Date = new Date(now.getTime() - timeOffsetInMS);
    return adjustedDate.toISOString().substr(0, 10); // format to yyyy-mm-dd
};
