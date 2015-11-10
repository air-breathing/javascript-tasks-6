'use strict';

var timeutil = require('./timeutil');
var translateFromMinutesToTime = timeutil.translateFromMinutesToTime;
var translateTimeInMinutes = timeutil.translateTimeInMinutes;

const day = 24 * 60;
var daysOfWeek2 = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
var days = {
    'ПН': 0,
    'ВТ': day,
    'СР': day * 2,
    'ЧТ': day * 3,
    'ПТ': day * 4,
    'СБ': day * 5,
    'ВС': day * 6
};
const hours = 60;
var daysOfWeek = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];



module.exports = function () {
    return {
        // Здесь как-то хранится дата ;)
        dateInGrinvich: null,
        dateString: null,
        get date() {
            return this.dateInGrinvich;
        },

        set date(value) {
            this.dateString = value;
            this.dateInGrinvich = translateTimeInMinutes(value);
        },

        // А здесь часовой пояс
        dateInOurTimezone: null,
        timezoneNumber:null,
        get timezone() {
            return this.timezoneNumber;
        },
        set timezone(value) {
            this.timezoneNumber = value;
            this.dateInOurTimezone = getInOurTimezone(this.dateInGrinvich, value);
            console.log(this.dateInOurTimezone, 'in');
        },

        // Выводит дату в переданном формате
        format: function (pattern) {
            if (this.dateInGrinvich == null){
                console.log('Дата не инициализирована');
                return;
            }
            pattern = pattern.split('%DD');
            pattern = pattern.join(this.dateInOurTimezone.days);

            pattern = pattern.split('%HH');
            pattern = pattern.join(getGoodStringOfTime(this.dateInOurTimezone.hours));

            pattern = pattern.split('%MM');
            pattern = pattern.join(getGoodStringOfTime(this.dateInOurTimezone.minuts));

            return pattern
        },

        // Возвращает кол-во времени между текущей датой и переданной `moment`
        // в человекопонятном виде
        fromMoment: function (moment) {

        }
    };
};

function getGoodStringOfTime(timeInNumber, timezone){
    var result = timeInNumber + '';
    if (result.length <= 1)
    {
        return '0' + result;
    }
    return result;
}

function getInOurTimezone(data, timezone){
    console.log(data, 'adadadadad');
    console.log(timezone);
    var inOurZoneDate = days[data.days] + data.hours * hours + data.minuts + timezone*hours;
    return translateFromMinutesToTime(inOurZoneDate);
}
