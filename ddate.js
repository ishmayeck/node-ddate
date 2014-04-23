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

/* for reference, epoch is Sweetmorn, 1 Chaos 3136 */
var getDate = function(epooch) {
    var ds = (Math.floor(epooch / day) % 5) - 1;
    (ds == -1) && (ds = 0);
    var sn = Math.floor((epooch / day / 73) % 5);
    var flarf = Math.floor(3136 + (epooch / year));

    var leps = Math.floor(epooch / year / 4);
    var lard = Math.floor((epooch % year) / day) - leps;
    var gwar = lard % 73 + 1;

    return {
        dw: days[ds],
        sn: seasons[sn],
        d: gwar,
        yold: flarf
    };
};

var g = getDate((process.argv[2] ? new Date(parseInt(process.argv[2])) : new Date()).getTime());
console.log(g.d, g.dw.l, g.sn.l, g.yold);