#!env node

var days = [
    { l: 'Sweetmorn', s: 'SM' },
    { l: 'Boomtime', s: 'BT' },
    { l: 'Pungenday', s: 'PD' },
    { l: 'Prickle-Pricle', s: 'PP' },
    { l: 'Setting Orange', s: 'SO' }
];

var seasons = [
    { l: 'Chaos', s: 'Chs' },
    { l: 'Discord', s: 'Dsc' },
    { l: 'Confusion', s: 'Cfn' },
    { l: 'Bureaucracy', s: 'Bcy' },
    { l: 'The Aftermath', s: 'Afm' }
];

var holydays = [
    { n: 'Mungday', s: 'Chaos', d: 5 },
    { n: 'Chaoflux', s: 'Chaos', d: 50 },
    { n: 'Mojoday', s: 'Discord', d: 5 },
    { n: 'Discoflux', s: 'Discord', d: 50 },
    { n: 'Syaday', s: 'Confusion', d: 5 },
    { n: 'Confuflux', s: 'Confusion', d: 50 },
    { n: 'Zaraday', s: 'Bureaucracy', d: 5 },
    { n: 'Bureflux', s: 'Bureaucracy', d: 50 },
    { n: 'Maladay', s: 'The Aftermath', d: 5 },
    { n: 'Afflux', s: 'The Aftermath', d: 50 }
];

var day = 1000 * 60 * 60 * 24;
var year = day * 365;

var DDate = function(epooch) {
    /* for reference, epoch is Sweetmorn, 1 Chaos 3136 */

    this.getDate = function(epooch) {
        var leps = Math.floor(epooch / year / 4);
        epooch -= leps * day;

        var into = Math.floor((epooch % year) / day);
        var gwar = Math.floor(into % 73);
        var sn = Math.floor(into / 73);
        var woody = Math.floor(into % 5);
        (into < 73) ? gwar++ : woody--;
        var flarf = Math.floor(epooch / (day * 365)) + 3136;
        return {
            day: days[woody],
            season: seasons[sn],
            date: gwar,
            year: flarf
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
}
