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

module.exports.translateFromMinutesToTime = function (minutes){
    //(x-x%y)/y
    var minutes2 = minutes;
    var ourMinuts = minutes % hours;
    minutes -= ourMinuts;
    var ourHours = (minutes % day);
    minutes -= ourHours;
    var ourDays = minutes / day;
    ourHours = ourHours / hours;
    var ourHoursStr = (ourHours < 10) ? '0' + ourHours: '' + ourHours;
    var ourMinutsStr = (ourMinuts < 10) ? '0' + ourMinuts: '' + ourMinuts;
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
};

module.exports.translateTimeInMinutes = function (dateString){
    var regDate = /^([А-Я]{2})? ?([0-9]{2}):([0-9]{2})(.*)$/;
    var dateArray = dateString.match(regDate);
    var day = dateArray[1];
    var date;
    if (dateArray[1] !== undefined) {
         date = days[dateArray[1]] + parseInt(dateArray[2]) * hours + parseInt(dateArray[3]);
    }
    else {
        date = parseInt(dateArray[2]) * hours + parseInt(dateArray[3]);
        day = 'ПН';
        dateString = 'ПН ' + dateString;
    }
    var timeZone = dateArray[4];
    if (timeZone !== undefined) {
        date -= parseInt(timeZone)*hours;
    } else {
        timeZone = '0';
    }
    if (date < 0) {
        date += week;
    }
    var timeStringInGrinvich = module.exports.translateFromMinutesToTime(date);
    return timeStringInGrinvich;
};

module.exports.translateFromMinutesToTimeWithTimeZone = function (minutes, timezone) {
    minutes = minutes + timezone * hours;
    var result = module.exports.translateFromMinutesToTime(minutes);
    result.timeZone = timezone;
    return result;
};

module.exports.getTimeZone = function (value) {
    var regDate = /^([А-Я]{2})? ?([0-9]{2}):([0-9]{2})(.*)$/;
    var dateArray = value.match(regDate);
    return parseInt(dateArray[4]);
};

module.exports.getDifference = function (value1, value2){
    var difference = module.exports.translateFromMinutesToTime(value1.minutesInTime - value2.minutesInTime);
    var result = 'До ограбления ';
    var amountDays = days[difference.days]/day;
    switch (amountDays)
    {
        case 0:
            result += 'осталось ';
            break;
        case 1:
            result += 'остался ' + amountDays + ' день ';
            break;
        case 2:
        case 3:
        case 4:
            result += 'осталось ' +  amountDays + ' дня ';
            break;
        case 5:
        case 6:
            result += 'осталось ' + amountDays + ' дней ';
    }
    switch (difference.hours) {
        case 0:
            break;
        case 1:
            result += difference.hours + ' час ';
            break;
        case 2:
        case 3:
        case 4:
        case 21:
        case 22:
        case 23:
            result += difference.hours + ' часа ';
            break;
        default:
            result += difference.hours + ' часов ';
    }

            result += difference.minuts + ((difference.minuts != 1) ? ' минут ' : ' минута ');
    return result;
};
