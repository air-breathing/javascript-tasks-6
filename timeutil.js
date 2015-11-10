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
var typeTime = {
    from: 0,
    to: 1
};

module.exports.translateFromMinutesToTime = function (minutes){
    //(x-x%y)/y
    var ourMinuts = minutes % hours;
    minutes -= ourMinuts;
    var ourHours = (minutes % day);
    minutes -= ourHours;
    var ourDays = minutes / day;
    ourHours = ourHours / hours;
    return {
        minutesInTime: minutes,
        days: daysOfWeek[ourDays],
        hours: ourHours,
        minuts: ourMinuts,
        timeInString: daysOfWeek[ourDays] + ' ' + ourHours + ':' + ourMinuts + '0'};
};

module.exports.translateTimeInMinutes = function (dateString){
    console.log(dateString, 'asdasds');
    var regDate = /^([А-Я]{2})? ?([0-9]{2}):([0-9]{2})(.*)$/;
    var dateArray = dateString.match(regDate);
    var day = dateArray[1];
    if (dateArray[1] !== undefined)
    {
        var date = days[dateArray[1]] + parseInt(dateArray[2]) * hours + parseInt(dateArray[3]);
    }
    else
    {
        var date = parseInt(dateArray[2]) * hours + parseInt(dateArray[3]);
        day = 'ПН';
        dateString = 'ПН ' + dateString;
    }
    if (dateArray[4] !== undefined) {
        date -= parseInt(dateArray[4])*hours;
    }
    if (date < 0)
    {
        date += week;
    }
    return {
        minutesInTime: date,
        days: day,
        hours: parseInt(dateArray[2]),
        minuts: parseInt(dateArray[3]),
        timeInString: dateString
    }
};
