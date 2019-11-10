module.exports = date => {
    //checks if a data string is valid
    //returns a Date object if it is, false if it isn't
    //date must be given in a YYYY-MM-DD format
    //i could simply have put the month, day and year in Date(), but it wouldn't return any error, if the date was wrong.

    const dateRegex = /^20[0-9][0-9]-[01][0-9]-[0-3][0-9]T[0-2][0-9]:[0-6][0-9]$/;
    if (dateRegex.test(date)) {
        currentDate = new Date();

        let yearDayMonth = date.slice(0, 10);
        let hoursMinutes = date.slice(11);

        yearDayMonth = yearDayMonth.split('-');
        const year = parseInt(yearDayMonth[0]);
        const month = parseInt(yearDayMonth[1]);
        const day = parseInt(yearDayMonth[2]);

        hoursMinutes = hoursMinutes.split(":");

        const hours = parseInt(hoursMinutes[0]);
        const minutes = parseInt(hoursMinutes[1]);

        if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
            if (year >= currentDate.getFullYear() && year <= currentDate.getFullYear() + 100) {
                switch (month) {
                    case 1: {
                        if (day >= 1 && day <= 31) {
                            return new Date(year, month - 1, day, hours, minutes);
                        }
                        else {
                            return false;
                        }
                    }
                    case 2: {
                        if (year % 4 === 0) {
                            //leap year
                            if (day >= 1 && day <= 29) {
                                return new Date(year, month - 1, day, hours, minutes);
                            }
                            else {
                                return false;
                            }
                        }
                        else {
                            //non-leap year
                            if (day >= 1 && day <= 28) {
                                return new Date(year, month - 1, day, hours, minutes);
                            }
                            else {
                                return false;
                            }

                        }
                    }
                    case 3: {
                        if (day >= 1 && day <= 31) {
                            return new Date(year, month - 1, day, hours, minutes);
                        }
                        else {
                            return false;
                        }
                    }
                    case 4: {
                        if (day >= 1 && day <= 30) {
                            return new Date(year, month - 1, day, hours, minutes);
                        }
                        else {
                            return false;
                        }
                    }
                    case 5: {
                        if (day >= 1 && day <= 31) {
                            return new Date(year, month - 1, day, hours, minutes);
                        }
                        else {
                            return false;
                        }
                    }
                    case 6: {
                        if (day >= 1 && day <= 30) {
                            return new Date(year, month - 1, day, hours, minutes);
                        }
                        else {
                            return false;
                        }
                    }
                    case 7: {
                        if (day >= 1 && day <= 31) {
                            return new Date(year, month - 1, day, hours, minutes);
                        }
                        else {
                            return false;
                        }
                    }
                    case 8: {
                        if (day >= 1 && day <= 31) {
                            return new Date(year, month - 1, day, hours, minutes);
                        }
                        else {
                            return false;
                        }
                    }
                    case 9: {
                        if (day >= 1 && day <= 30) {
                            return new Date(year, month - 1, day, hours, minutes);
                        }
                        else {
                            return false;
                        }
                    }
                    case 10: {
                        if (day >= 1 && day <= 31) {
                            return new Date(year, month - 1, day, hours, minutes);
                        }
                        else {
                            return false;
                        }
                    }
                    case 11: {
                        if (day >= 1 && day <= 30) {
                            return new Date(year, month - 1, day, hours, minutes);
                        }
                        else {
                            return false;
                        }
                    }
                    case 12: {
                        if (day >= 1 && day <= 31) {
                            return new Date(year, month - 1, day, hours, minutes);
                        }
                        else {
                            return false;
                        }
                    }
                    default: return false;
                }
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}