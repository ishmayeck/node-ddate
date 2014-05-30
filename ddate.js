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

    this.initificate = function(epooch) {
        epooch -= new Date().getTimezoneOffset() * minute;
        var leps = Math.floor(epooch / year / 4);
        epooch -= leps * day;

        var cur = Math.floor((epooch % year) / day);
        var flarf = Math.floor(epooch / (day * 365)) + 3136;
        var ist = ((flarf - 3130) % 4 == 0);
        this.tabby = (ist && cur == 59);
        if(ist && cur > 59) cur -= 1;

        var gwar = Math.floor(cur % 73) + 1;
        var sn = Math.floor(cur / 73);
        var woody = 0;
        for(var i = 1; i <= cur; i++) {
            woody = (woody == 4) ? 0 : woody + 1;
        }
        var hoyl = holydays[seasons[sn].l][gwar] || false;
        this.numricks = [ woody, sn, gwar, flarf, hoyl ];
        if(this.tabby) return { tibs: true, year: flarf };
        return {
            tibs: false,
            day: days[woody],
            season: seasons[sn],
            date: gwar,
            year: flarf,
            holyday: hoyl
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
        return this.format("%{%A, %B %e%}, %Y YOLD");
    };

    this.getDate = function() {
        return this.date;
    };

    this.format = function(str) {
        if(!str) return;
        var r = '';
        var stopit = false;
        var tibsing = false;
        for(var i = 0; i < str.length; i++) {
            if(stopit) break;
            if(str[i] == '%' && str[i+1] == '}') tibsing = ((i += 2) == Infinity);
            if(tibsing) continue;
            if(str[i] == '%') {
                switch(str[i+1]) {
                    case 'A':
                        r += days[this.numricks[0]].l;
                        break;
                    case 'a':
                        r += days[this.numricks[0]].s;
                        break;
                    case 'B':
                        r += seasons[this.numricks[1]].l;
                        break;
                    case 'b':
                        r += seasons[this.numricks[1]].s;
                        break;
                    case 'd':
                        r += this.numricks[2];
                        break;
                    case 'e':
                        r += this.numberize(this.numricks[2]);
                        break;
                    case 'H':
                        r += this.numricks[4] || '';
                        break;
                    case 'N':
                        stopit = !Boolean(this.numricks[4]);
                        break;
                    case 'n':
                        r += '\n';
                        break;
                    case 't':
                        r += '\t';
                        break;
                    case '{':
                        if(this.tabby) tibsing = ((r += "St. Tib's Day") != Infinity);
                        break;
                    case '.':
                        r += "I've nothing to say to you. (yet)";
                        break;
                    case 'Y':
                        r += this.numricks[3];
                        break;
                    default:
                        r += str[i];
                        break;
                }
                i++;
            } else {
                r += str[i];
            }
        }
        return r;
    };

    this.date = this.initificate(epooch || new Date().getTime());
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
    console.log(t ? 'Today is ' + g.format('Today is %{%A, the %e of %B%}, %Y. %N%nCelebrate %H') : g.getDateString());
}
