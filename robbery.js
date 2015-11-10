'use strict';

var timeutil = require('./timeutil');
var translateFromMinutesToTime = timeutil.translateFromMinutesToTime;
var translateTimeInMinutes = timeutil.translateTimeInMinutes;
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
    return a.time.timeInMinutes - b.time.timeInMinutes;
}

// Выбирает подходящий ближайший момент начала ограбления
module.exports.getAppropriateMoment = function (json, minDuration, workingHours) {
    var appropriateMoment = moment();
    //здесь будем хранить все времена, которые мы имеем
    var allTimes = [];
    var i;
    var data = JSON.parse(json);
    //здесь будет количество всех людей, которые хотят грабить банк
    var allAmount = 0;
    for (var key in data) if (data.hasOwnProperty(key)){
        var inStringData = [];
        allAmount ++;
        for (i in data[key]) {
            //собираем все края отрезков времени
            //меняем их значимость, т е выбираем свободные отрезки
            allTimes.push({
                time: translateTimeInMinutes(data[key][i].from),
                type: typeTime.to,
                name: key
            });
            allTimes.push({
                time: translateTimeInMinutes(data[key][i].to),
                type: typeTime.from,
                name: key
            });
        }
    }
    //для банка вычисляем время в минутах
    var translatedTimeFrom = translateTimeInMinutes(workingHours.from);
    var translatedTimeTo = translateTimeInMinutes(workingHours.to);

    //вычисляем время в три дня
    for (i = 0; i < amountDays; i++) {
        allTimes.push( {
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
    }
    //значально считаем, что все могут, кроме банка
    var allWhoCan = allAmount;
    //добавляем банк
    allAmount ++;
    //сортируем все времена
    allTimes.sort(compareElem);
    var lastTime = 0;

    var flagAll = false;
    var set = new Set();
    for (i in allTimes) {
        console.log(set);
        if (allTimes[i].type == typeTime.to) {
            allWhoCan++;
            set.add(allTimes[i].name);
        } else {
            allWhoCan--;
            if (flagAll){
                if (allTimes[i].time.timeInMinutes - lastTime.timeInMinutes >= minDuration){
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
    console.log(lastTime, 'lastTime');
    appropriateMoment.date = lastTime.timeInString;
    appropriateMoment.timezone = 5;

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
