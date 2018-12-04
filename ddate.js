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

var month_days = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] ;
var DDate = function(epooch) {
    /* for reference, epoch is Sweetmorn, 1 Chaos 3136 */
    this.date = {};

    this.initificate = function(epooch) {
        if( typeof epooch === 'undefined') { epooch = new Date(); } else {epooch = new Date(epooch) ;}
        // console.log(epooch.toJSON() );
        var gyear = epooch.getUTCFullYear() ; 
        var leapyear = ( gyear % 4 == 0 ) ;
        // console.log("leapyear", leapyear);
        var dyear = gyear + 1166   ;
        // console.log("dyear", dyear);
        var dom = epooch.getDate();
        // console.log("dom", dom);
        var month = epooch.getMonth(); //0 index
        // console.log("month", month);
        var ddoy = dom ; 
        var leapday = false ; 
        for( var i = 0 ; i < month ; i++ ){
            // console.log("month_days", i );
            ddoy += month_days[i];
        }

        if(leapyear == true ){
            if( month == 1 && dom == 29 ){ 
                leapday = true;
                // console.log("ld", leapday );
            } 
            // if( month > 1) {ddoy += 1 ; } ; 
        }
        //invalid
        if( ! leapday ) {
            if ( month_days[month] < dom ) {
                console.log("invalid date!");
                return "error";
            }
        }
        // console.log( "leapday", leapday) ;
        // console.log( "ddoy", ddoy );
        var dday = ddoy % 73 ;
        var sn = Math.floor( ddoy / 73 );
        // console.log("sn", sn );
        //weekday
        var woody = ( ddoy - 1 ) % 5 ; 
        // var woody = 0;
        // for(var i = 1; i <= dday; i++) {
        //     woody = (woody == 4) ? 0 : woody + 1;
        // }
        // console.log("woody", woody);
        var hoyl = holydays[seasons[sn].l][dday] || false;
        // console.log("hoyl", hoyl );
        this.numricks = [ woody, sn, dday, dyear, hoyl ];
        this.tabby = leapday ; 
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
        return this.format("%{%A, %B %e%}, %Y YOLD %H");
    };

    this.getDate = function() {
        return this.date;
    };

    this.ddate = function() {
        return this.format("Today is %{%A, the %e day of %B%} in the YOLD %Y%N%nCelebrate %H");
    }

    this.format = function(str) {
        if(!str) return;
        // console.log("str", str);
        var r = '';
        var stopit = false;
        var tibsing = false;
        for(var i = 0; i < str.length; i++) {
            // console.log("i",i, str[i], str[i+1], "numricks", this.numricks );
            if(stopit) break;
            if(str[i] == '%' && str[i+1] == '}') tibsing = ((i += 2) == Infinity);
            // console.log("tibsing",tibsing);
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
