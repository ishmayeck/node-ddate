#!/usr/bin/env node

var days = [
    { l: 'Sweetmorn', s: 'SM' },
    { l: 'Boomtime', s: 'BT' },
    { l: 'Pungenday', s: 'PD' },
    { l: 'Prickle-Prickle', s: 'PP' },
    { l: 'Setting Orange', s: 'SO' }
];

var seasons = [
    { l: 'Chaos', s: 'Chs' },
    { l: 'Discord', s: 'Dsc' },
    { l: 'Confusion', s: 'Cfn' },
    { l: 'Bureaucracy', s: 'Bcy' },
    { l: 'The Aftermath', s: 'Afm' }
];

var holydays = {
    'Chaos': {
        5: 'Mungday',
        50: 'Chaoflux'
    },
    'Discord': {
        5: 'Mojoday',
        50: 'Discoflux'
    },
    'Confusion': {
        5: 'Syaday',
        50: 'Confuflux'
    },
    'Bureaucracy': {
        5: 'Zaraday',
        50: 'Bureflux'
    },
    'The Aftermath': {
        5: 'Maladay',
        50: 'Afflux'
    }
};

var minute = 1000 * 60;
var day = minute * 60 * 24;
var year = day * 365;

var DDate = function(epooch) {
    /* for reference, epoch is Sweetmorn, 1 Chaos 3136 */

    this.getDate = function(epooch) {
        epooch -= new Date().getTimezoneOffset() * minute;
        var leps = Math.floor(epooch / year / 4);
        epooch -= leps * day;

        var cur = Math.floor((epooch % year) / day);
        var gwar = Math.floor(cur % 73) + 1;
        var sn = Math.floor(cur / 73);
        var woody = 0;
        for(var i = 1; i <= cur; i++) {
            woody = (woody == 4) ? 0 : woody + 1;
        }
        var flarf = Math.floor(epooch / (day * 365)) + 3136;
        return {
            day: days[woody],
            season: seasons[sn],
            date: gwar,
            year: flarf,
            holyday: holydays[seasons[sn].l][gwar] || false
        };
    };

    this.numberize = function(num) {
        switch(num % 10) {
            case 1:
                return num + 'st';
            case 2:
                return num + 'nd';
            case 3:
                return num + 'rd';
            case 4:
            default:
                return num + 'th';
        }
    };

    this.toOldImmediateDateFormat = function() {
        return this.date.day.l + ', the ' + this.numberize(this.date.date) + ' day of ' +
            this.date.season.l + ' in the YOLD ' + this.date.year;
    };

    this.getDateString = function() {
        return this.date.day.l + ', ' + this.date.season.l + ' ' + this.date.date + ', ' + this.date.year + ' YOLD';
    };

    this.date = this.getDate(epooch || new Date().getTime());
};

module.exports = DDate;

if(process.argv.length > 1 && (process.argv[1].slice(-5) == 'ddate' || process.argv[1].slice(-8) == 'ddate.js')) {
    // this will break SO badly when someone requires this module from an executable script named ddate.js.
    // But then it will be their fault for stealing my name.
    t = false;
    if(!process.argv[2]) {
        t = true;
        var d = new Date();
    } else if(process.argv[2].indexOf(' ') > -1) {
        var d = new Date(process.argv[2]);
    } else if(process.argv.length > 4) {
        var d = new Date(String('000' + process.argv[3]).slice(-2) + '-' +
            String('000' + process.argv[2]).slice(-2) + '-' +
            String('000' + process.argv[4]).slice(-4));
    } else {
        var d = new Date(parseInt(process.argv[2]));
    }
    var g = new DDate(d.getTime());
    console.log(t ? 'Today is ' + g.toOldImmediateDateFormat() : g.getDateString());
    if(g.date.holyday) {
        console.log('Celebrate ' + g.date.holyday);
    }
}
