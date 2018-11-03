function findRecurrence(s){
  var mark = s.match(/(daily|every day|weekly|every week|monthly|every month|yearly|every year)/g);

  if (s.includes("daily") || s.includes("every day")){
    s = s.replace("daily", "");
    s = s.replace("every day", "");
    return ["daily", s, mark]
  }
  if (s.includes("weekly") || s.includes("every week")){
    s = s.replace("weekly", "");
    s = s.replace("every week", "");
    return ["weekly", s, mark]
  }
  if (s.includes("monthly") || s.includes("every month")){
    s = s.replace("montly", "");
    s = s.replace("every month", "");
    return ["monthly", s, mark]
  }
  if (s.includes("yearly") || s.includes("every year")){
    s = s.replace("yearly", "");
    s = s.replace("every year", "");
    return ["daily", s, mark]
  }
  return [null, s, []]
}
function findTimes(s, date1, date2){
  if (!s.includes("pm") && !s.includes("am")) {
    return;
  }
  else if (s.includes("pm") && !s.includes("am")) {
    start = "pm"; end = "pm"
  }
  else if (s.includes("am") && !s.includes("pm")) {
    start = "am"; end = "am"
  }
  else if (s.indexOf("am") > s.indexOf("pm")) {
    start = "pm"; end = "am";
  }
  else {
    start = "am"; end = "pm";
  }

  endIndex = s.lastIndexOf(end) + 2;

  cut = s.substring(0, s.lastIndexOf(end));
  var nums = (cut.match(/\d+\:\d+|\d+\b|\d+(?=\w)/g) || [] )
        .map(function (v) {return v;});
  var toMark = (cut.match(/\d+\:\d+|\d+\b|\d+(?=\w)/g) || [] )
        .map(function (v) {return v;});
  var lastTime = nums.pop();
  var firstTime = -1;
  if(nums.length !== 0){
    firstTime = nums.pop();
  }
  else{
    //firstTime = (parseInt(lastTime.charAt(0)) - 1) + lastTime.substring(1);
    firstTime = lastTime;
  }

  if (firstTime.startsWith("12")){
    if (start == "am"){
      start = "pm";
    }
    else{
      start = "am";
    }
  }
  if (lastTime.startsWith("12")){
    if (end == "am"){
      start = "pm";
    }
    else{
      end = "am";
    }
  }

  if (date1 == date2 &&
      start == end &&
      parseInt(firstTime.replace(":", "")) > parseInt(lastTime.replace(":", ""))){
    if (end == "am"){
      start = "pm";
    }
    if (end == "pm"){
      start = "am";
    }
  }

  if (firstTime.startsWith("12")){
    if (start == "am"){
      start = "pm";
    }
    else{
      start = "am";
    }
  }
  if (lastTime.startsWith("12")){
    if (end == "am"){
      start = "pm";
    }
    else{
      end = "am";
    }
  }

  startIndex = cut.indexOf(firstTime);

  end = lastTime + end;
  start = firstTime + start;

  if (!end.includes(":")){
    end = end.substring(0, end.length - 2) + ":00" + end.substring(end.length - 2);
  }
  if (!start.includes(":")){
    start = start.substring(0, start.length - 2) + ":00" + start.substring(start.length - 2);
  }

  toTrim = s.substring(startIndex, endIndex);
  toTrim = toTrim.replace(/[0-9]/g, '');
  while (toTrim.includes("am") || toTrim.includes("pm")){
    toTrim = toTrim.replace("am", "");
    toTrim = toTrim.replace("pm", "");
    toTrim = toTrim.replace(":", "");
  }
  s = s.substring(0, startIndex) + toTrim + s.substring(endIndex);
  return [start, end, s, toMark];
}
function findDays(s){
  var today = new Date();
  var lastDate = new Date();
  var firstDate = new Date();

  daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]

  days = s.match(/(sunday|monday|tuesday|wednesday|thursday|friday|saturday|next)/g);
  lastDayNum = daysOfWeek.indexOf(days.pop());
  daysForward = today.getDay();
  if (lastDayNum < daysForward){
    lastDayNum += 7;
  }

  next = days.pop()
  while (next == "next"){
    next = days.pop()
    lastDayNum += 7;
  }
  lastDate.setDate(lastDate.getDate() + lastDayNum - daysForward);

  if (days.length === 0 && !daysOfWeek.includes(next)){
    firstDate = new Date(lastDate.getTime());
  }
  else{
    firstDayNum = daysOfWeek.indexOf(next);
    if (firstDayNum < daysForward){
      firstDayNum += 7;
    }
      next = days.pop()
    while (next == "next"){
      next = days.pop()
      firstDayNum += 7;
    }
    firstDate.setDate(firstDate.getDate() + firstDayNum - daysForward);
  }

  while (lastDate < firstDate){
    lastDate.setDate(lastDate.getDate() + 7);
  }

  toMark = s.match(/(sunday|monday|tuesday|wednesday|thursday|friday|saturday|next)/g);
  days = s.match(/(this|sunday|monday|tuesday|wednesday|thursday|friday|saturday|next)/g);
  while(days.length > 0){
    s = s.replace(days.pop(), "");
  }
  return [firstDate, lastDate, s, toMark]
}
function findLocation(s){
  start = s.match(/( to | at | in | on )/g);
  startIndex = s.indexOf(start[0]);
  var location = s.substring(startIndex + 4);
  s = s.substring(0, startIndex);
  return [location, s];
}
function findSubject(s){
}

function finalClean(s){
  while (s.includes(" to ")){
    s = s.replace(" to ", " ");
  }
  while (s.includes(" from ")){
    s = s.replace(" from ", " ");
  }
  while (s.includes(" until ")){
    s = s.replace(" until ", " ");
  }
  while (s.includes(" at ")){
    s = s.replace(" at ", " ");
  }
  while (s.includes(" in ")){
    s = s.replace(" in ", " ");
  }
  while (s.includes(" on ")){
    s = s.replace(" on ", " ");
  }
  while (s.includes(" -")){
    s = s.replace(" -", " ");
  }
  while (s.includes("  ")){
    s = s.replace("  ", " ");
  }
  s = s.replace(/^[ ]+|[ ]+$/g,'')
  return s;
}

function readString(s){
  //non-recurrence needs subject, description, location, begin, end
  var result = {subject:"", location:"", begin:"", end:"", recurrence:"", starts:[]}
  var markedWords = [];

  s = s.toLowerCase();
  s = s.replace("noon", "12pm");
  s = s.replace("midnight", "12am");
  while (s.includes("p.m.") || s.includes("a.m.")){
    s = s.replace("p.m.", "pm");
    s = s.replace("a.m.", "am");
  }

  recurrence = findRecurrence(s);
  result.recurrence = recurrence[0];
  s = recurrence[1];
  markedWords = markedWords.concat(recurrence[2]);

  days = findDays(s);
  result.begin += days[0];
  result.end += days[1];
  s = days[2];
  markedWords = markedWords.concat(days[3]);


  times = findTimes(s);
  result.begin = times[0] + " " + result.begin;
  result.end = times[1] + " " + result.end;
  s = times[2];
  markedWords = markedWords.concat(times[3]);
  //s = cleanString(s);

  var location = findLocation(s);
  result.location = finalClean(location[0]);
  s = location[1];
  result.subject = finalClean(s)

  console.log("Subject  : " + result.subject,
              "Location : " + result.location,
              "Start    : " + result.begin,
              "End      : " + result.end,
              "Repeat   : " + result.recurrence);
  markedWords = markedWords.concat(result.location.split(" "));
  markedWords = markedWords.concat(result.subject.split(" "));
  console.log("Marked   : " + markedWords);
  return [result, markedWords];
}

function test(){
  var a = "cs70 midterm review at pimentel 150 thursday 4-12am";
  a = a.toLowerCase();
  console.log("Input    : " + a);
  readString(a);
}