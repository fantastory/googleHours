

function tests() {
    testcalCulateRequiredDays();



}


function testcalCulateRequiredDays() {
    var tests = [
        [new Date(2016, 11, 1), new Date(2016, 11, 1), 0],
        [new Date(2016, 11, 1), new Date(2016, 11, 2), 1],
        [new Date(2016, 11, 3), new Date(2016, 11, 4), 0],
        [new Date(2016, 11, 3), new Date(2016, 11, 5), 0],
        [new Date(2016, 11, 4), new Date(2016, 11, 5), 0],
        [new Date(2016, 11, 1), new Date(2016, 11, 7), 4],
        [new Date(2016, 11, 1), new Date(2016, 11, 11), 7],
        [new Date(2016, 11, 1), new Date(2016, 11, 12), 7]
    ];

    _.forEach(tests, function(element) {
        var days = calculateRequiredDays(element[0], element[1]);
        if (days == element[2]) {} else  
        {
            console.error('calculateRequiredDays ',element,' was ', days);
        }
    }, this);






}



