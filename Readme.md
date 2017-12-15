# node-ddate

Utility to convert dates to the Discordian calendar. forked from ishmayeck/node-ddate.

- y2k17 compliant
- y2100 on up seem to have issues though (math.floor?)
- Variables renamed to make some sort of sense to myself

## Features
- Blazing fast - no dependencies.
- Can be require()d as a library
- Almost 100% compatible with command-line usage of the ddate found in util-linux.
- Converts aneristic dates into Discordian ones, probably correctly
- Written in the spirit of the original ddate utility!

## Installation

Install from npm with ```npm install ddate```. Toss in the ```-g``` flag if you want to run it from the commandline too,
which you should because it's great.

## Commandline Usage

This utility provides a drop-in replacement for the ddate from util-linux. As such, the man page for that tool still
applies. Parts of said man page are reproduced here.

If  called  with  no  arguments, ddate will get the current system date, convert this to the
Discordian date format and print this on the standard  output.  Alternatively,  a  Gregorian
date may be specified on the command line, in the form of a numerical day, month and year.

If  a  format string is specified, the Discordian date will be printed in a format specified
by the string. This mechanism works similarly to the format  string  mechanism  of  date(1),
only almost completely differently. The fields are:

       %A     Full name of the day of the week (i.e., Sweetmorn)

       %a     Abbreviated name of the day of the week (i.e., SM)

       %B     Full name of the season (i.e., Chaos)

       %b     Abbreviated name of the season (i.e., Chs)

       %d     Ordinal number of day in season (i.e., 23)

       %e     Cardinal number of day in season (i.e., 23rd)

       %H     Name of current Holyday, if any

       %N     Magic code to prevent rest of format from being printed unless today is a Holyday.

       %n     Newline

       %t     Tab

       %{

       %}     Used to enclose the part of the string which is to be replaced with  the  words  "St.
              Tib's Day" if the current day is St. Tib's Day.
              
## Examples

       % ddate
       Sweetmorn, Bureaucracy 42, 3161 YOLD

       % ddate +'Today is %{%A, the %e of %B%}, %Y. %N%nCelebrate %H'
       Today is Sweetmorn, the 42nd of Bureaucracy, 3161.

       % ddate +"It's %{%A, the %e of %B%}, %Y. %N%nCelebrate %H" 26 9 1995
       It's Prickle-Prickle, the 50th of Bureaucracy, 3161.
       Celebrate Bureflux

       % ddate +"Today's %{%A, the %e of %B%}, %Y. %N%nCelebrate %H" 29 2 1996
       Today's St. Tib's Day, 3162.

## Programmatic usage

#### DDate([timestamp])

Constructor. This is what you get from require('ddate'). If a UNIX timestamp is provided, will create an object for
the date specified.

#### toDateString()

Prints the DDate object's date in a vaguely acceptable format.

        var DDate = require('ddate');
        var now = new DDate();
        now.toDateString(); // 'Sweetmorn, Confusion 5, 3180 YOLD'
        
#### format(fmtString)

This method allows you to provide a format string. This string accepts all the same things the command-line
format string does.

#### getDate()

Returns an object describing the current Discordian date.

    > d.getDate()
    { 
      tibs: false, // St. Tib's day indicator.
                   // If this is true, the presence and state of everything else in the object besides "year" are undefined.
                   // As in, undefined behavior. Not the value undefined.
      day: {       // long and short names of the day
        l: 'Sweetmorn',
        s: 'SM'
      },           // long and short names of the season
      season: {
        l: 'Confusion',
        s: 'Cfn'
      },           // should be pretty obvious what these are
      date: 5,
      year: 3180,
      holyday: 'Syaday' // present only if it's a Holyday
    }

## Known Issues

For now it can only handle dates after UNIX epoch. Will fix eventually.

## License

Quadruple licensed under the WTFPL, BSD 3-Clause, MIT and zlib licenses. Use whichever one you want. Or you can use
one you don't want, if you want.
