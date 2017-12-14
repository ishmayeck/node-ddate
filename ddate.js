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

var month_days = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] ;
var DDate = function(epooch) {
    /* for reference, epoch is Sweetmorn, 1 Chaos 3136 */
    this.date = {};

    this.initificate = function(epooch) {
        if( typeof epooch === 'undefined') epooch = new Date()
        //epooch will be a date object
        console.log( "epooch init", epooch);
        var gd = new Date(epooch); 
                
        // epooch -= new Date().getTimezoneOffset() * minute;
        console.log( "epooch", epooch, ",", gd.toString() );

        //leap years? epoch / 4

        var years_since_epoch = Math.floor( epooch / year );
        var leap_years_since_epoch =  (years_since_epoch >= 2 )? Math.floor( (years_since_epoch + 2) / 4 ) : 0 ;
        console.log("years_since_epoch", years_since_epoch);
        console.log("leap_years_since_epoch", leap_years_since_epoch);
        // var yarz = epooch / year ; 
        // console.log("yarz", yarz); 
        // var leps = Math.floor(epooch / (year*4) );
        // console.log("leps", leps );
        var leapyear = ( ( years_since_epoch + 2 ) % 4 == 0 );
        var leapyear_day_offset = Math.floor(leap_years_since_epoch * day);
        var days_in_this_year = leapyear? 366 : 365 ;
        console.log("epooch minus leps * day", epooch, leapyear_day_offset );

        //current discordian day of season (5 x 73 day seasons)
        var cur = Math.floor( (epooch % year) / day ) - leap_years_since_epoch;
        console.log("cur init", cur);
        // add one if it is a leap year
        // if(leapyear) cur += 1 ;
        //the discordian year
        console.log("epooch", epooch );
        var dyear = Math.floor(epooch / year) + 3136;
        console.log("dyear", dyear);

        //  Every fourth year in the Discordian calendar, starting in 2 YOLD an extra day is inserted between Chaos 59 and Chaos 60 called St. Tib's Day (same as unix epoch)
        // var leapyear = ((dyear - 3134) % 4 == 0);
        console.log("leapyear", leapyear);
        //st.tibs day
        this.tabby = (leapyear && cur == 59);
        console.log("tabby", this.tabby);
        
        //remove st.tibs day since it it is "dateless"
        if(leapyear && cur > 59) cur -= 1;
        console.log("cur minus st.tibs", cur)

        var dday = Math.floor(cur % 73) + 1;
        console.log("dday", dday);
        var sn = Math.floor(cur / 73);
        console.log("sn", sn);
        var woody = 0;
        for(var i = 1; i <= cur; i++) {
            woody = (woody == 4) ? 0 : woody + 1;
        }
        var hoyl = holydays[seasons[sn].l][dday] || false;
        this.numricks = [ woody, sn, dday, dyear, hoyl ];
        if(this.tabby) return { tibs: true, year: dyear };
        return {
            tibs: false,
            day: days[woody],
            season: seasons[sn],
            date: dday,
            year: dyear,
            holyday: hoyl
        };
    };

    this.numberize = function(num) {
        var thtaghn = (num % 100) > 9 && (num % 100) < 15;
        switch(num % 10) {
            case 1:
                return num + (thtaghn ? 'th' : 'st');
            case 2:
                return num + (thtaghn ? 'th' : 'nd');
            case 3:
                return num + (thtaghn ? 'th' : 'rd');
            case 4:
            default:
                return num + 'th';
        }
    };

    this.toOldImmediateDateFormat = function() {
        return this.date.day.l + ', the ' + this.numberize(this.date.date) + ' day of ' +
            this.date.season.l + ' in the YOLD ' + this.date.year;
    };

    this.toDateString = function() {
        return this.format("%{%A, %B %e%}, %Y YOLD");
    };

    this.getDate = function() {
        return this.date;
    };

    this.ddate = function() {
        return this.format("Today is %{%A, the %e day of %B%} in the YOLD %Y%N%nCelebrate %H");
    }

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

    this.date = this.initificate( epooch || new Date().getTime() );
};

module.exports = DDate;

if(process.argv.length > 1 && (process.argv[1].slice(-5) == 'ddate' || process.argv[1].slice(-8) == 'ddate.js')) {
    // this will break SO badly when someone requires this module from an executable script named ddate.js.
    // But then it will be their fault for stealing my name.
    t = false;
    f = false;
    var varg = process.argv;
    if(varg[2] && varg[2][0] == '+') {
        f = varg[2].slice(1);
        var vor = [];
        for(var i = 0; i < varg.length; i++) {
            if(i !== 2) vor.push(varg[i]);
        }
        varg = vor;
    }

    var d;
    if(!varg[2]) {
        t = true;
        d = new Date();
    } else if(varg[2].indexOf(' ') > -1) {
        d = new Date(varg[2]);
    } else if(varg.length > 4) {
        d = new Date(String('000' + varg[3]).slice(-2) + '-' +
            String('000' + varg[2]).slice(-2) + '-' +
            String('000' + varg[4]).slice(-4));
    } else {
        d = new Date(parseInt(varg[2]));
    }
    var g = new DDate(d.getTime());
    console.log(t ? g.format((f || 'Today is %{%A, the %e day of %B%} in the YOLD %Y%N%nCelebrate %H')) : (f ? g.format(f) : g.toDateString()));
}
