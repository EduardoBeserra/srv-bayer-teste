module.exports = {
    formatDateHour(d) {
        var month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear(),
            hours = d.getHours(),
            minutes = d.getMinutes(),
            seconds = d.getSeconds(),
            millisec = d.getMilliseconds();
        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return `${[year, month, day].join('-')} ${hours}:${minutes}:${seconds}.${millisec}`;
    }
}