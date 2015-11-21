'use strict';

var timeutil = require('./timeutil');

var translateTimeInMinutes = timeutil.translateTimeInMinutes;
var getTimeZone = timeutil.getTimeZone;
var moment = require('./moment');
const day = 24 * 60;
var daysOfWeek = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
const amountDays = 3;
var typeTime = {
    from: 0,
    to: 1
};
const bankName = 'bank';


function compareElem (a, b) {
    return a.time.minutesInTime - b.time.minutesInTime;
}

// Выбирает подходящий ближайший момент начала ограбления
module.exports.getAppropriateMoment = function (json, minDuration, workingHours) {
    var appropriateMoment = moment();
    var allTimes = [];
    var i;
    var data = JSON.parse(json);
    var allAmount = 0;
    var setNamesWhoCans = new Set();
    var name;
    Object.keys(data).forEach(name => {
        allAmount ++;
        setNamesWhoCans.add(name);
        var i;
        for (i in data[name]) {
            allTimes.push({
                time: translateTimeInMinutes(data[name][i].from),
                type: typeTime.to,
                name: name
            });
            allTimes.push({
                time: translateTimeInMinutes(data[name][i].to),
                type: typeTime.from,
                name: name
            });
        }
});
    //для банка вычисляем время в минутах
    var translatedTimeFrom = translateTimeInMinutes(workingHours.from);
    var translatedTimeTo = translateTimeInMinutes(workingHours.to);
    var currentTimeZone = getTimeZone(workingHours.from);

    //вычисляем время в три дня
    for (i = 0; i < amountDays; i++) {
        allTimes.push({
            time: {
                minutesInTime: translatedTimeFrom.minutesInTime + i * day,
                days: daysOfWeek[i],
                hours: translatedTimeFrom.hours,
                minuts: translatedTimeFrom.minuts,
                timeInString: translatedTimeFrom.timeInString
            },
            type: typeTime.from,
            name: bankName
        });
        allTimes.push({
            time: {
                minutesInTime: translatedTimeTo.minutesInTime + i * day,
                days: daysOfWeek[i],
                hours: translatedTimeTo.hours,
                minuts: translatedTimeTo.minuts,
                timeInString: translatedTimeTo.timeInString
            },
            type: typeTime.to,
            name: bankName
        });
    }
    //значально считаем, что все могут, кроме банка
    var allWhoCan = allAmount;
    //добавляем банк
    allAmount ++;
    //сортируем все времена
    allTimes.sort(compareElem);
    var lastTime = 0;
    var flagAll = false;
    for (var index in allTimes) {
        if (allTimes.hasOwnProperty(index)) {
            if (allTimes[index].type == typeTime.from) {
                setNamesWhoCans.add(allTimes[index].name);
            } else {
                if (flagAll) {
                    if (allTimes[index].time.minutesInTime - lastTime.minutesInTime >= minDuration) {
                        break;
                    }
                    flagAll = false;
                }
                setNamesWhoCans.delete(allTimes[index].name);
            }
            if (setNamesWhoCans.size == allAmount) {

                lastTime = allTimes[index].time;
                flagAll = true;
            }
        }
    }
    //дата полученная по гринвичу
    appropriateMoment.date = lastTime.timeInString;
    appropriateMoment.timezone = currentTimeZone;
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
