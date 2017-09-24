const Alexa = require('alexa-sdk');

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);

    // alexa.dynamoDBTableName = 'YourTableName'; // creates new table for userid:session.attributes

    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('computePaceIntent');
    },

    'computePaceIntent': function () {

        if (this.event.request.intent.slots.distanceUnitInput) {
            distanceUnitInput = this.event.request.intent.slots.distanceUnitInput.value;
        } else {
            distanceUnitInput = null;
        }

        if (this.event.request.intent.slots.distanceInput) {
            distanceInput = this.event.request.intent.slots.distanceInput.value;
        } else {
            distanceInput = null;
        }

        if (this.event.request.intent.slots.timeInput) {
            timeInput = this.event.request.intent.slots.timeInput.value;
        } else {
            timeInput = null;
        }

        if (this.event.request.intent.slots.timeUnitInput) {
            timeUnitInput = this.event.request.intent.slots.timeUnitInput.value;
        } else {
            timeUnitInput = null;
        }

        if (this.event.request.intent.slots.namedRaceDistance) {
            namedRaceDistance = this.event.request.intent.slots.namedRaceDistance.value;
        } else {
            namedRaceDistance = null;
        }

        if (distanceUnitInput == 'k' || distanceUnitInput == 'kilometers' || distanceUnitInput == 'kilometer'|| distanceUnitInput == 'Kay') {
            distanceConverted = convertKtoMi(distanceInput);
            distanceUnitOutput = " kilometers";
        } else {
            distanceConverted = distanceInput;
            distanceUnitOutput = " miles";
        }

        if (namedRaceDistance) {
            if (namedRaceDistance == "marathon") {
                distanceConverted = 26.2;
                distanceInput = 26.2;
                distanceUnitOutput = " miles";
            } else if (namedRaceDistance == "half-marathon") {
                distanceConverted = 13.1;
                distanceInput = 13.1;
                distanceUnitOutput = " miles";
            }
        }

        if (timeUnitInput == 'minutes' || timeUnitInput == 'minute') {
            timeConverted = convertMinToSecs(timeInput);
            timeUnitOutput = " minutes";
        } else if (timeUnitInput == 'seconds') {
            timeConverted = timeInput;
            timeUnitOutput = " seconds";
        }

        secondsPerMile = timeConverted / distanceConverted;
        minutesPerMile = secondsPerMile / 60;

        var say = "Running " + distanceInput + distanceUnitOutput + " in " + timeInput + timeUnitOutput 
            + " requires a pace of " + ~~((secondsPerMile % 3600) / 60) + " minutes and " + Math.round(secondsPerMile % 60) + " seconds per mile.";

        //var say = timeConverted + " " +  distanceConverted + " " + minutesPerMile;
        this.response.speak(say);
        this.emit(':responseReady');
    },

    // 'AMAZON.HelpIntent': function () {
    //     this.response.speak('you can ask for a fact by saying, tell me a fact.');
    //     this.response.listen('try again');
    // },
    //
    // 'AMAZON.CancelIntent': function () {
    //     this.response.speak('Goodbye')
    //     this.emit(':responseReady');
    // },
    //
    // 'AMAZON.StopIntent': function () {
    //     this.response.speak('Goodbye');
    //     this.emit(':responseReady');
    // }
};

//  helper functions  ===================================================================

function convertKtoMi(kilo) {
    return kilo * 0.62137119;
}

function convertMinToSecs(minutes) {
    return minutes * 60;
}