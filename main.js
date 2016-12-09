
var gNow = new Date();
var gYear = gNow.getFullYear(); 

function addDays(date, days) {
    date.setDate(date.getDate() + days);
}

var gUsers = {
    'Remigiusz': "Remigiusz Półtorak"
}

var gUsersByKeys = function () {
    _.for
    
}();


function getName(event) {
    var name = event.summary;
    if (!name) {
        return null;
    }    
    
    //name = users.find(function(elem, index) {return _.includes(name, elem)});

    var idSource = name.replace("  ", " ").replace("  ", " ");

    var res = idSource.split(" ");
    if (res.length < 2) return res[0];
    return res[0] + ' ' + res[1];
}

function getCalendarDuration(event) {
    if(event.start.date && event.end.date) {
        return (new Date(event.end.date) - new Date(event.start.date)) / 24 * 3 ;
    }
    var start = new Date(event.start.dateTime);
    var end = new Date(event.end.dateTime);
    return (end.getTime() - start.getTime());
}

var gRequiredHoursPerDay = 8;

/* startDay inclusive, endDate exclusive
*/
function calculateRequiredDaysX(startDate, endDate) {
    var saturday = new Date(startDate);
    addDays(saturday, 6 - startDate.getDay());
    var days = 6-startDate.getDay();

    var weeks = 0;
    while (saturday < endDate) {
        weeks++; 
        addDays(saturday, 7);    
    }
    days += weeks * 5;
    days += endDate.getDay() - 6;

    return days;
}

function calculateRequiredDays(startDate, endDate) {
    var days = 0;
    var currDate = new Date(startDate); 
    while (currDate < endDate) {
        var dayOfWeek = currDate.getDay();
        if (dayOfWeek == 0 || dayOfWeek == 6) {

        } else {
            days++;
        }
        addDays(currDate, 1);
    } 
    return days;
}

function calculateRequiredMinutes(startDate, endDate) {
    var days = calculateRequiredDays(startDate, endDate);
    return days * gRequiredHoursPerDay * 60;
}

function minutesString(totalMinutes) {
    let minutes = totalMinutes % 60; 
    let hours = (totalMinutes - minutes) / 60;

    let ret = '';
    if (hours < 100) ret += '&nbsp;';
    if (hours < 10) ret += '0';

    ret += hours + ':';
    if (minutes < 10) ret += '0';
    ret += minutes; 
    return ret;
}

function workWithCalendarData(resp) {
    console.log(resp);

    var events = resp.items;
    //listEvents(events);



    //group by names (summary)

    var eventsByName = events.reduce(
        function(acc, event) {
            var name = getName(event);
            if (name) { 
                if (!acc.hasOwnProperty(name)) { 
                    acc[name] = {
                        events : [],
                    };
                }
                acc[name].events.push(event);
            }
            return acc;
        }, 
        {} 
    );

    var requiredMinutesInMonth = [];
    for (let i = 0; i < 12; ++i) {
        let start = new Date(gYear, i, 1);
        let end = new Date(gYear, i+1, -1);
        requiredMinutesInMonth[i] = calculateRequiredMinutes(start, end);
    }

    _.forEach(eventsByName,
        function(userEvents) {
            userEvents.minutesInMonths = [];
            for (let i = 0; i < 12; ++i) {
                userEvents.minutesInMonths[i] = 0;
            }

            _.forEach(userEvents.events,
                function(event) {
                    var date;
                    if(event.start.dateTime)
                        date = new Date(event.start.dateTime);
                    else {
                        date = new Date(event.start.date);
                    }
                    let month = date.getMonth();
                    userEvents.minutesInMonths[month] += getCalendarDuration(event) / 1000 / 60;
                } 
            );
        }
    );

    var table = document.getElementById("hourTable");

    let header = table.insertRow(-1);
    header.insertCell(-1).innerHTML = 'User';
    header.insertCell(-1).innerHTML = 'Total';
    for (var i = 1; i <= 12; ++i) {
        header.insertCell(-1).innerHTML = i;
    }

    

    _.forEach(eventsByName,
        function(userEvents, name) {
            let totalWorked = userEvents.minutesInMonths.reduce(function(acc,elem) { return acc+elem;}, 0);
            let totalRequired = requiredMinutesInMonth.reduce(function(acc,elem) { return acc+elem;}, 0);
            let row = table.insertRow(-1);            
            row.insertCell(-1).innerHTML = name;
            row.insertCell(-1).innerHTML = minutesString(totalWorked) + '/' + minutesString(totalRequired);
            for (var i = 0; i < 12; ++i) {
                row.insertCell(-1).innerHTML = minutesString(userEvents.minutesInMonths[i]) + '/'
                    + minutesString(requiredMinutesInMonth[i])
                ;
            }
        }
    );
    


    console.log(eventsByName);
    console.log(requiredMinutesInMonth);
    
}