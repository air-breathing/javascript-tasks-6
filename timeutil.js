/**
 * Created by Надежда on 10.11.2015.
 */
const day = 24 * 60;
const hours = 60;
var days = {
    'ПН': 0,
    'ВТ': day,
    'СР': day * 2,
    'ЧТ': day * 3,
    'ПТ': day * 4,
    'СБ': day * 5,
    'ВС': day * 6
};

var daysOfWeek = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

const amountDays = 3;
const week = day * amountDays;

function translateFromMinutesToTime(minutes) {
    var minutes2 = minutes;
    var ourMinuts = minutes % hours;
    minutes -= ourMinuts;
    var ourHours = (minutes % day);
    minutes -= ourHours;
    var ourDays = minutes / day;
    ourHours = ourHours / hours;
    var ourHoursStr = (ourHours < 10) ? '0' + ourHours : ourHours.toString();
    var ourMinutsStr = (ourMinuts < 10) ? '0' + ourMinuts : ourMinuts.toString();
    return {
        minutesInTime: parseInt(minutes2),
        days: daysOfWeek[ourDays],
        hours: ourHours,
        minuts: ourMinuts,
        timeInString: daysOfWeek[ourDays] + ' ' + ourHoursStr + ':' + ourMinutsStr + '+0',
        timeZone: 0,
        valueOf: function () {
            return this.minutesInTime;
        }
    };
}

function translateTimeInMinutes(dateString) {
    var regDate = /^([А-Я]{2})? ?([0-9]{2}):([0-9]{2})(.*)$/;
    var dateArray = dateString.match(regDate);
    var day = dateArray[1];
    var date;
    if (dateArray[1] !== undefined) {
        date = days[dateArray[1]] + parseInt(dateArray[2]) * hours + parseInt(dateArray[3]);
    } else {
        date = parseInt(dateArray[2]) * hours + parseInt(dateArray[3]);
        day = 'ПН';
        dateString = 'ПН ' + dateString;
    }
    var timeZone = dateArray[4];
    if (timeZone !== undefined) {
        date -= parseInt(timeZone) * hours;
    } else {
        timeZone = '0';
    }
    if (date < 0) {
        date += week;
    }
    var timeStringInGrinvich = translateFromMinutesToTime(date);
    return timeStringInGrinvich;
}

function translateFromMinutesToTimeWithTimeZone(minutes, timezone) {
    minutes = minutes + timezone * hours;
    var result = translateFromMinutesToTime(minutes);
    result.timeZone = timezone;
    return result;
}

function getTimeZone(value) {
    var regDate = /^([А-Я]{2})? ?([0-9]{2}):([0-9]{2})(.*)$/;
    var dateArray = value.match(regDate);
    return parseInt(dateArray[4]);
}

function getDifference(value1, value2) {
    var difference = translateFromMinutesToTime(
        value1.minutesInTime - value2.minutesInTime);
    var result = 'До ограбления ';
    var amountDays = days[difference.days] / day;
    var presenceLeft = false;
    switch (amountDays)
    {
        case 0:
            break;
        case 1:
            result += 'остался ' + amountDays + ' день ';
            presenceLeft = true;
            break;
        case 2:
        case 3:
        case 4:
            result += 'осталось ' + amountDays + ' дня ';
            presenceLeft = true;
            break;
        case 5:
        case 6:
            result += 'осталось ' + amountDays + ' дней ';
            presenceLeft = true;
    }
    switch (difference.hours) {
        case 0:
            break;
        case 1:
            if (!presenceLeft) {
                result += 'остался ';
                presenceLeft = true;
            }
            result += difference.hours + ' час ';
            break;
        case 2:
        case 3:
        case 4:
        case 21:
        case 22:
        case 23:
            if (!presenceLeft) {
                result += 'осталось ';
                presenceLeft = true;
            }
            result += difference.hours + ' часа ';
            break;
        default:
            if (!presenceLeft) {
                result += 'осталось ';
                presenceLeft = true;
            }
            result += difference.hours + ' часов ';
    }
    switch (difference.minuts) {
        case 0:
            if (!presenceLeft) {
                result += 'времени не осталось';
            }
            break;
        case 1:
        case 21:
        case 31:
        case 41:
        case 51:
            if (!presenceLeft) {
                result += 'осталась';
            }
            result += difference.minuts + ' минута';
            break;
        case 2:
        case 3:
        case 4:
        case 22:
        case 23:
        case 24:
        case 32:
        case 33:
        case 34:
        case 42:
        case 43:
        case 44:
        case 52:
        case 53:
        case 54:
            if (!presenceLeft) {
                result += 'осталось ';
            }
            result += difference.minuts + ' минуты';
            break;
        default:
            if (!presenceLeft) {
                result += 'осталось ';
            }
            result += difference.minuts + ' минут';
    }

    return result;
}

module.exports.translateFromMinutesToTime = translateFromMinutesToTime;
module.exports.translateTimeInMinutes = translateTimeInMinutes;
module.exports.translateFromMinutesToTimeWithTimeZone = translateFromMinutesToTimeWithTimeZone;
module.exports.getTimeZone = getTimeZone;
module.exports.getDifference = getDifference;
