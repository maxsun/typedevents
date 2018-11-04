// Client ID and API key from the Developer Console
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
var eventLocation = "";
var eventName = "";
var eventRecurrence = "";
var eventStart = "";
var eventEnd = "";

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
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    //listUpcomingEvents();
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

/**
 * Creates an event in the user's Google calendar
 */
function createEvent(eventObject) {
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
  });
}

// function findRecurrence(s){
//   var mark = s.match(/(daily|every day|weekly|every week|monthly|every month|yearly|every year)/g);

//   if (s.includes("daily") || s.includes("every day")){
//     s = s.replace("daily", "");
//     s = s.replace("every day", "");
//     return ["daily", s, mark]
//   }
//   if (s.includes("weekly") || s.includes("every week")){
//     s = s.replace("weekly", "");
//     s = s.replace("every week", "");
//     return ["weekly", s, mark]
//   }
//   if (s.includes("monthly") || s.includes("every month")){
//     s = s.replace("montly", "");
//     s = s.replace("every month", "");
//     return ["monthly", s, mark]
//   }
//   if (s.includes("yearly") || s.includes("every year")){
//     s = s.replace("yearly", "");
//     s = s.replace("every year", "");
//     return ["daily", s, mark]
//   }
//   return ["", s, []]
// }
// function findTimes(s, date1, date2){
//   if (!s.includes("pm") && !s.includes("am")) {
//     return;
//   }
//   else if (s.includes("pm") && !s.includes("am")) {
//     start = "pm"; end = "pm"
//   }
//   else if (s.includes("am") && !s.includes("pm")) {
//     start = "am"; end = "am"
//   }
//   else if (s.indexOf("am") > s.indexOf("pm")) {
//     start = "pm"; end = "am";
//   }
//   else {
//     start = "am"; end = "pm";
//   }

//   endIndex = s.lastIndexOf(end) + 2;

//   cut = s.substring(0, s.lastIndexOf(end));
//   //console.log(cut);
//   var nums = (cut.match(/\d+\:\d+|\d+\b|\d+(?=\w)/g) || [] )
//         .map(function (v) {return v;});
//   //console.log(nums);
//   var toMark = (cut.match(/\d+\:\d+|\d+\b|\d+(?=\w)/g) || [] )
//         .map(function (v) {return v;});
//   toMark = toMark.slice(Math.max(0, toMark.length-2), toMark.length);
//   var lastTime = nums.pop();
//   var firstTime = -1;
//   if(nums.length !== 0){
//     firstTime = nums.pop();
//   }
//   else{
//     //firstTime = (parseInt(lastTime.charAt(0)) - 1) + lastTime.substring(1);
//     firstTime = lastTime;
//   }

//   if (firstTime.startsWith("12")){
//     if (start == "am"){
//       start = "pm";
//     }
//     else{
//       start = "am";
//     }
//   }
//   if (lastTime.startsWith("12")){
//     if (end == "am"){
//       start = "pm";
//     }
//     else{
//       end = "am";
//     }
//   }

//   if (date1 == date2 &&
//       start == end &&
//       parseInt(firstTime.replace(":", "")) > parseInt(lastTime.replace(":", ""))){
//     if (end == "am"){
//       start = "pm";
//     }
//     if (end == "pm"){
//       start = "am";
//     }
//   }

//   if (firstTime.startsWith("12")){
//     if (start == "am"){
//       start = "pm";
//     }
//     else{
//       start = "am";
//     }
//   }
//   if (lastTime.startsWith("12")){
//     if (end == "am"){
//       start = "pm";
//     }
//     else{
//       end = "am";
//     }
//   }

//   startIndex = cut.indexOf(firstTime);

//   end = lastTime + end;
//   start = firstTime + start;

//   if (!end.includes(":")){
//     end = end.substring(0, end.length - 2) + ":00" + end.substring(end.length - 2);
//   }
//   if (!start.includes(":")){
//     start = start.substring(0, start.length - 2) + ":00" + start.substring(start.length - 2);
//   }

//   toTrim = s.substring(startIndex, endIndex);
//   toTrim = toTrim.replace(/[0-9]/g, '');
//   while (toTrim.includes("am") || toTrim.includes("pm")){
//     toTrim = toTrim.replace("am", "");
//     toTrim = toTrim.replace("pm", "");
//     toTrim = toTrim.replace(":", "");
//   }
//   s = s.substring(0, startIndex) + toTrim + s.substring(endIndex);
//   return [start, end, s, toMark];
// }
// function findDays(s){
//   var today = new Date();
//   var lastDate = new Date();
//   var firstDate = new Date();

//   daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]

//   days = s.match(/(sunday|monday|tuesday|wednesday|thursday|friday|saturday|next)/g);
//   lastDayNum = daysOfWeek.indexOf(days.pop());
//   daysForward = today.getDay();
//   if (lastDayNum < daysForward){
//     lastDayNum += 7;
//   }

//   next = days.pop()
//   while (next == "next"){
//     next = days.pop()
//     lastDayNum += 7;
//   }
//   lastDate.setDate(lastDate.getDate() + lastDayNum - daysForward);

//   if (days.length === 0 && !daysOfWeek.includes(next)){
//     firstDate = new Date(lastDate.getTime());
//   }
//   else{
//     firstDayNum = daysOfWeek.indexOf(next);
//     if (firstDayNum < daysForward){
//       firstDayNum += 7;
//     }
//       next = days.pop()
//     while (next == "next"){
//       next = days.pop()
//       firstDayNum += 7;
//     }
//     firstDate.setDate(firstDate.getDate() + firstDayNum - daysForward);
//   }

//   while (lastDate < firstDate){
//     lastDate.setDate(lastDate.getDate() + 7);
//   }

//   toMark = s.match(/(sunday|monday|tuesday|wednesday|thursday|friday|saturday|next)/g);
//   days = s.match(/(this|sunday|monday|tuesday|wednesday|thursday|friday|saturday|next)/g);
//   while(days.length > 0){
//     s = s.replace(days.pop(), "");
//   }
//   return [firstDate, lastDate, s, toMark]
// }
// function findLocation(s){
//   start = s.match(/( to | at | in | on )/g);
//   startIndex = s.indexOf(start[0]);
//   var location = s.substring(startIndex + 4);
//   s = s.substring(0, startIndex);
//   return [location, s];
// }
// function findSubject(s){
// }

// function finalClean(s){
//   while (s.includes(" to ")){
//     s = s.replace(" to ", " ");
//   }
//   while (s.includes(" from ")){
//     s = s.replace(" from ", " ");
//   }
//   while (s.includes(" until ")){
//     s = s.replace(" until ", " ");
//   }
//   while (s.includes(" at ")){
//     s = s.replace(" at ", " ");
//   }
//   while (s.includes(" in ")){
//     s = s.replace(" in ", " ");
//   }
//   while (s.includes(" on ")){
//     s = s.replace(" on ", " ");
//   }
//   while (s.includes(" -")){
//     s = s.replace(" -", " ");
//   }
//   while (s.includes("  ")){
//     s = s.replace("  ", " ");
//   }
//   s = s.replace(/^[ ]+|[ ]+$/g,'')
//   return s;
// }

// function readString(s){
//   //non-recurrence needs subject, description, location, begin, end
//   var result = {subject:"", location:"", begin:"", end:"", recurrence:"", starts:[]}
//   var markedWords = [];
//   var dayOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday", "monday"];

//   var theDate = new Date();
//   var today = dayOfWeek[theDate.getDay()];
//   var tomorrow = dayOfWeek[theDate.getDay() + 1];
//   var aftertmr = dayOfWeek[theDate.getDay() + 2];
//   var toRemove = [];

//   while (s.includes(" today ")){
//     s = s.replace("today", today);
//     toRemove.push(today);
//     markedWords.push("today");
//   }
//   while (s.includes(" the day after tomorrow ")){
//     s = s.replace("the day after tomorrow", aftertmr);
//     toRemove.push(aftertmr);
//     markedWords.push("the day after tomorrow");
//   }
//   while (s.includes(" tomorrow ") || s.includes(" tmr ")){
//     s = s.replace("tomorrow", tomorrow);
//     s = s.replace("tmr", tomorrow);
//     toRemove.push(tomorrow);
//     if (s.includes(" tomorrow ")){
//       markedWords.push("tomorrow");
//     }
//     else{
//       markedWords.push("tmr");
//     }
//   }

//   s = s.toLowerCase();
//   s = s.replace("noon", "12pm");
//   s = s.replace("midnight", "12am");
//   while (s.includes("p.m.") || s.includes("a.m.")){
//     s = s.replace("p.m.", "pm");
//     s = s.replace("a.m.", "am");
//   }

//   recurrence = findRecurrence(s);
//   result.recurrence = recurrence[0];
//   s = recurrence[1];
//   markedWords = markedWords.concat(recurrence[2]);

//   days = findDays(s);
//   result.begin += days[0];
//   result.end += days[1];
//   s = days[2];
//   markedWords = markedWords.concat(days[3]);


//   times = findTimes(s);
//   result.begin = times[0] + " " + result.begin;
//   result.end = times[1] + " " + result.end;
//   s = times[2];
//   markedWords = markedWords.concat(times[3]);
//   //s = cleanString(s);

//   var location = findLocation(s);
//   result.location = finalClean(location[0]);
//   s = location[1];
//   result.subject = finalClean(s)

//   console.log("Subject  : " + result.subject,
//               "Location : " + result.location,
//               "Start    : " + result.begin,
//               "End      : " + result.end,
//               "Repeat   : " + result.recurrence);
//   markedWords = markedWords.concat(result.location.split(" "));
//   markedWords = markedWords.concat(result.subject.split(" "));
//   console.log("Marked   : " + markedWords);

//   while (toRemove.length > 0) {
//     var remove = toRemove.pop();
//     markedWords = markedWords.splice(markedWords.indexOf(remove), 1);
//   }

//   eventName = result.subject;
//   eventLocation = result.location;
//   eventRecurrence = result.recurrence;
//   eventStart = result.begin;
//   eventEnd = result.end;

//   return [result, markedWords];
// }

function toDate(string){
  var spot = string.indexOf(":");
  var hour = parseInt(string.substring(0,spot));
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