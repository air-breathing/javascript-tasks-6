'use strict';

var timeutil = require('./timeutil');
var translateFromMinutesToTime = timeutil.translateFromMinutesToTime;
var translateTimeInMinutes = timeutil.translateTimeInMinutes;
var translateFromMinutesToTimeWithTimeZone = timeutil.translateFromMinutesToTimeWithTimeZone;
var getDifference = timeutil.getDifference;
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
            this.dateInOurTimezone = translateFromMinutesToTimeWithTimeZone(this.dateInGrinvich.minutesInTime, value);
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
            return getDifference(this.dateInGrinvich, moment.dateInGrinvich);
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
