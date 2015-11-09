'use strict';

module.exports = function () {
    return {
        // Здесь как-то хранится дата ;)
        date: null,

        // А здесь часовой пояс
        timezone: null,

        // Выводит дату в переданном формате
        format: function (pattern) {
            if (this.date == null){
                console.log('Дата не инициализирована');
                return;
            }
            pattern = pattern.split('%DD');
            pattern = pattern.join(this.date.days);

            pattern = pattern.split('%HH');
            pattern = pattern.join(getGoodStringOfTime(this.date.hours));

            pattern = pattern.split('%MM');
            pattern = pattern.join(getGoodStringOfTime(this.date.minuts));

            return pattern
        },

        // Возвращает кол-во времени между текущей датой и переданной `moment`
        // в человекопонятном виде
        fromMoment: function (moment) {
        }
    };
};

function getGoodStringOfTime(timeInNumber){
    var result = timeInNumber + '';
    if (result.length <= 1)
    {
        return '0' + result;
    }
    return result;
}
