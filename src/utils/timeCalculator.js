/**
 * Calculates working hours between two dates considering work hours (8-17) and lunch break (12-13)
 * @param {Date} startDate - Start date and time
 * @param {Date} endDate - End date and time
 * @returns {number} Total working hours
 */
/**
 * Generates time options based on start and end times with 1.5h increments
 * @param {Date} startTime - Start time of the day
 * @param {Date} endTime - End time of the day
 * @returns {string[]} Array of time options
 */
export const generateHourOptions = (startTime, endTime) => {
    const HOURS_PER_DAY = 24;

    // Calculate total hours between start and end
    const totalHours = (endTime - startTime) / (1000 * 60 * 60);
    // If within same day
    if (totalHours < 8) {
        // Generate hour-based options with half-hour increments
        const hourOptions = [
            '0.5',
            '1.0',
            '1.5',
            '2.0',
            '2.5',
            '3.0',
            '3.5',
            '4.0',
            '4.5',
            '5.0',
            '5.5',
            '6.0',
            '6.5',
            '7.0',
            '7.5',
        ];

        // Filter options based on total available hours
        return hourOptions
            .filter((hours) => parseFloat(hours) <= Math.min(totalHours, HOURS_PER_DAY))
            .map((hours) => `${hours} giờ`);
    }

    // For multi-day periods
    const totalDays = Math.ceil(totalHours / HOURS_PER_DAY);

    // Add day options with half-day increments
    const dayOptions = [
        '1.0',
        '1.5',
        '2.0',
        '2.5',
        '3.0',
        '3.5',
        '4.0',
        '4.5',
        '5.0',
        '5.5',
        '6.0',
        '6.5',
        '7.0',
        '7.5',
        '8.0',
        '8.5',
        '9.0',
        '9.5',
        '10.0',
        '10.5',
        '11.0',
        '11.5',
        '12.0',
        '12.5',
        '13.0',
        '13.5',
        '14.0',
        '14.5',
        '15.0',
    ];

    return dayOptions.filter((days) => parseFloat(days) <= totalDays).map((days) => `${days} ngày`);
};

export const generateHourOverTimeOptions = (startTime, endTime) => {
    const HOURS_PER_DAY = 24;

    // Calculate total hours between start and end
    const totalHours = (endTime - startTime) / (1000 * 60 * 60);
    // If within same day
    if (totalHours < 16) {
        // Generate hour-based options with half-hour increments
        const hourOptions = [
            '0.5',
            '1.0',
            '1.5',
            '2.0',
            '2.5',
            '3.0',
            '3.5',
            '4.0',
            '4.5',
            '5.0',
            '5.5',
            '6.0',
            '6.5',
            '7.0',
            '7.5',
            '8.0',
            '8.5',
            '9.0',
            '9.5',
            '10.0',
            '10.5',
            '11.0',
            '11.5',
            '12.0',
            '12.5',
            '13.0',
            '13.5',
            '14.0',
            '14.5',
            '15.0',
            '15.5',
            '16.0',
        ];

        // Filter options based on total available hours
        return hourOptions
            .filter((hours) => parseFloat(hours) <= Math.min(totalHours, HOURS_PER_DAY))
            .map((hours) => `${hours} giờ`);
    }
    return [];
};

export const formatWorkingTime = (hours) => {
    const HOURS_PER_DAY = 8;

    // If less than one day
    if (hours < HOURS_PER_DAY) {
        return `${hours.toFixed(1)} giờ`;
    }

    // Convert to days with one decimal place
    const days = (hours / HOURS_PER_DAY).toFixed(1);
    return `${days} ngày`;
};

/**
 * Converts time text (e.g. "2.5 ngày", "1.5 giờ") to total working hours
 * @param {string} timeText - Text representation of working time
 * @returns {number} Total working hours
 */
export const convertTimeTextToHours = (timeText) => {
    const HOURS_PER_DAY = 8;

    if (!timeText) return 0;

    // Split value and unit
    const [value, unit] = timeText.trim().split(' ');
    const numericValue = parseFloat(value);

    if (isNaN(numericValue)) return 0;

    switch (unit) {
        case 'ngày':
            return numericValue * HOURS_PER_DAY;
        case 'giờ':
            return numericValue;
        default:
            return 0;
    }
};

// Example usage:
// const start = new Date('2025-06-15 09:00');
// const end = new Date('2025-06-17 15:00');
// const hours = calculateWorkingHours(start, end);
// console.log(formatWorkingTime(hours));
// convertTimeTextToHours("2 ngày 4 giờ") => 20
// convertTimeTextToHours("3 ngày") => 24
// convertTimeTextToHours("6 giờ") => 6
// convertTimeTextToHours("2.5 ngày") => 20
// convertTimeTextToHours("1.5 giờ") => 1.5
// convertTimeTextToHours("0.5 giờ") => 0.5
// convertTimeTextToHours("1.0 ngày") => 8
