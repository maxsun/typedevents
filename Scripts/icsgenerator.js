    //var startstring = "10:00pm Thu Nov 22 2018 12:52:33 GMT-0800 (Pacific Standard Time)";
    //var endstring = "10:00pm Thu Nov 22 2018 12:52:33 GMT-0800 (Pacific Standard Time)";

    function toDate(string){
      var spot = string.indexOf(":");
      var hour = parseInt(string.substring(0,spot))%12;
      var minute = parseInt(string.substring(spot+1, spot+3));
      var init = string.substring(spot+6, string.length);
      var ampm=0;
      if(string.substring(spot+3, spot+5)=="pm"){
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

    function defaultoffset(startdate, enddate){
      if(startdate.toString() == enddate.toString()){
        enddate.setHours(enddate.getHours()+1);
      }
    }

    function checkbehind(startdate, enddate){
      if(startdate.getTime() > enddate.getTime() && (startdate.getTime()-enddate.getTime())<=86400000){
        enddate.setDate(enddate.getDate()+1);
      }
    }

    function custom(s){
      words = s.split(" ");
      var i;
      var output = [];
      for(i = 0; i<words.length; i++){
        if(words[i].match(/^[mwfth]+$/g)){
          temp = words[i].replace("th", "h");
          var j;
          for(int j = 0; j<temp.length; j++){
            var c;
            if(temp.charAt(j) == 'm'){
              c = readString(s.replace(words[i], "Monday"));
            } else if(temp.charAt(j) == 't'){
              c = readString(s.replace(words[i], "Tuesday"));
            } else if(temp.charAt(j) == 'w'){
              c = readString(s.replace(words[i], "Wednesday"));
            } else if(temp.charAt(j) == 'h'){
              c = readString(s.replace(words[i], "Thursday"));
            } else if(temp.charAt(j) == 'f'){
              c = readString(s.replace(words[i], "Friday"));
            }
            output = output.concat(c);
          }
          return output;
        }
      }
      return readString(s);
    }

    //sop: the event object created by 'markAndRead.js'
    function generateics(sop){
      var startdate = toDate(sop.begin);
      var enddate = toDate(sop.end);
      defaultoffset(startdate, enddate);
      checkbehind(startdate, enddate);
      var input = {subject:sop.subject, description:"", location:sop.location, start: startdate, end: enddate, recurrence: sop.recurrence};
      var cal = ics();
      cal.addEvent(input.subject, input.description, input.location, input.start.toLocaleString(), input.end.toLocaleString());    

      var terminate = 52;
      var i=0;
      while(i<terminate && input.recurrence!=""){
        if(input.recurrence == "DAILY"){
          input.start.setDate(input.start.getDate()+1);
          input.end.setDate(input.end.getDate()+1);
        } else if(input.recurrence == "WEEKLY"){
          input.start.setDate(input.start.getDate()+7);
          input.end.setDate(input.end.getDate()+7);
        } else if(input.recurrence == "MONTHLY"){
          input.start.setMonth(input.start.getMonth()+1);
          input.end.setMonth(input.end.getMonth()+1);
        } else if(input.recurrence == "YEARLY"){
          input.start.setFullYear(input.start.getFullYear()+1);
          input.end.setFullYear(input.end.getFullYear()+1);
        } 

        cal.addEvent(input.subject, input.description, input.location, input.start.toString(), input.end.toString());    
        i++;
      }
      return cal;
    }