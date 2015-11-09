'use strict';

var moment = require('./moment');
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
const bankName = 'bank';


function compareElem(a, b){
    return a.time[0] - b.time[0];
}

// Выбирает подходящий ближайший момент начала ограбления
module.exports.getAppropriateMoment = function (json, minDuration, workingHours) {

    var appropriateMoment = moment();
    var allTimes = [];
    var i;
    var data = JSON.parse(json);
    var allAmount = 0;
    for (var key in data) if (data.hasOwnProperty(key)){
        var inStringData = [];
        allAmount ++;
        for (i in data[key]) {
            //собираем все края отрезков времени
            allTimes.push({
                time: translateTimeInSeconds(data[key][i].to),
                type: typeTime.to,
                name: key
            });
            allTimes.push({
                time: translateTimeInSeconds(data[key][i].from),
                type: typeTime.from,
                name: key
            });
        }
    }
    var translatedTimeFrom = translateTimeInSeconds(workingHours.from);
    var translatedTimeTo = translateTimeInSeconds(workingHours.to);

    for (i = 0; i < amountDays; i++) {
        allTimes.push( {
            time: [translatedTimeTo[0] + i * day,
                   translatedTimeTo[1],
                   daysOfWeek[i] + translatedTimeTo[2]],
            type: typeTime.to,
            name: bankName
        });
        allTimes.push({
            time: [translatedTimeFrom[0] + i * day,
                   translatedTimeFrom[1],
                   daysOfWeek[i] + translatedTimeFrom[2]],
            type: typeTime.from,
            name: bankName
        })
    }
    allAmount ++;
    allTimes.sort(compareElem);
    var lastTime = 0;
    var allWhoCan = 4;
    var flagAll = false;
    var set = new Set();
    for (i in allTimes) {
        if (allTimes[i].type == 1) {
            allWhoCan++;
            set.add(allTimes[i].name);
        } else {
            allWhoCan--;
            if (flagAll){
                if (allTimes[i].time[0] - lastTime[0] >= minDuration){
                    break;
                }
                flagAll = false;
            }
            set.delete(allTimes[i].name);
        }
        if (allWhoCan == allAmount){
            lastTime = allTimes[i].time;
            flagAll = true;
        }
    }
    //дата полученная по гринвичу
    appropriateMoment.date = translateFromMinutesToTime(lastTime[0]);
    appropriateMoment.timezone = lastTime[1];
    console.log(appropriateMoment);

    return appropriateMoment;
};

// Возвращает статус ограбления (этот метод уже готов!)
module.exports.getStatus = function (moment, robberyMoment) {
    if (moment.date < robberyMoment.date) {
        // «До ограбления остался 1 день 6 часов 59 минут»
        return robberyMoment.fromMoment(moment);
    }
    return 'Ограбление уже идёт!';
};

function translateTimeInSeconds(dateString){
    var regDate = /^([А-Я]{2})? ?([0-9]{2}):([0-9]{2})(.*)$/;
    var dateArray = dateString.match(regDate);
    //получение даты, Пн 00:00, если отрицательное, то надо прибавить неделю
    //время местное
    if (dateArray[1] !== undefined)
    {
        var date = days[dateArray[1]] + parseInt(dateArray[2]) * hours + parseInt(dateArray[3]);
    }
    else
    {
        var date = parseInt(dateArray[2]) * hours + parseInt(dateArray[3]);
    }


    if (dateArray[4] !== undefined) {
        date -= parseInt(dateArray[4])*hours;
    }
    if (date < 0)
    {
        date += week;
    }
    return [date, dateArray[4], dateString];
};

function translateFromMinutesToTime(minutes){
    //(x-x%y)/y
    var ourMinuts = minutes % hours;
    minutes -= ourMinuts;
    var ourHours = (minutes % day);
    minutes -= ourHours;
    var ourDays = minutes / day;
    ourHours = ourHours / hours;


    return {
        days: daysOfWeek[ourDays],
        hours: ourHours,
        minuts: ourMinuts};
}
