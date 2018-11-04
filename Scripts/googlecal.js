// Client ID and API key from the Developer Console
// Restricted to only run from typed.events
var CLIENT_ID = '882340990243-0h3cqmbk955vsomslpa029q80587josv.apps.googleusercontent.com';
var API_KEY = 'AIzaSyBT_WCjCCc0Sidu96R_y0OtpbdKT7Iwg-U';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar";

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');
var eventButton = document.getElementById('create_event');

var signedIn = false;

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    // authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = signOut;
  });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  signedIn = isSignedIn;
  if (signedIn) {
    signoutButton.style.display = "inline-block";
  } else {
    signoutButton.style.display = "none";
  }
}

/**
 *  Sign in the user upon button click.
 */
function authenticate(event, cb) {
  gapi.auth2.getAuthInstance().signIn().then(cb);
}

/**
 *  Sign out the user upon button click.
 */
function signOut(event) {
  gapi.auth2.getAuthInstance().signOut();
  // updateSigninStatus(false);
}

/**
 * Creates an event in the user's Google calendar
 */
function createEvent(eventObject, callback) {
  // readString(event_name.value);
  console.log(eventObject.begin);

  if (eventObject.recurrence == "") {
    eventObject.recurrence = "DAILY;COUNT=1"
  }

  let startTime = toDate(eventObject.begin);
  let endTime = toDate(eventObject.end);

  let event = {
    'summary': eventObject.subject,
    'location': eventObject.location,
    'description': 'Auto-created event by TypedEvents: \"' + eventObject.subject + '\"',
    'start': {
      'dateTime': startTime.toISOString(),
      'timeZone': 'America/Los_Angeles'
    },
    'end': {
      'dateTime': endTime.toISOString(),
      'timeZone': 'America/Los_Angeles'
    },
    'recurrence': [
      'RRULE:FREQ=' + eventObject.recurrence.toUpperCase()
    ],
  };

  let request = gapi.client.calendar.events.insert({
    'calendarId': 'primary',
    'resource': event
  });

  request.execute(function(event) {
    console.log("Success to Google Cal");
    callback();
  });
}

function toDate(string){
  var spot = string.indexOf(":");
  var hour = parseInt(string.substring(0,spot))%12;
  var minute = parseInt(string.substring(spot+1, spot+3));
  var init = string.substring(spot+6, string.length);
  var ampm;
  if(string.substring(spot+3, spot+5)=="am"){
    ampm = 0;
  } else if(string.substring(spot+3, spot+5)=="pm"){
    ampm = 1;
  } 
  hour = hour+ampm*12;

  output = new Date(init);
  output.setHours(hour);
  output.setMinutes(minute);
  output.setSeconds(0);
  output.setMilliseconds(0);

  return output;
}
