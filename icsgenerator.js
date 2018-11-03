    //var startstring = "10:00pm Thu Nov 22 2018 12:52:33 GMT-0800 (Pacific Standard Time)";
    //var endstring = "10:00pm Thu Nov 22 2018 12:52:33 GMT-0800 (Pacific Standard Time)";

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

    function defaultoffset(startdate, enddate, offset){
      if(startdate.toString() == enddate.toString()){
        startdate.setHours(enddate.getHours()+offset);
      }
    }

    function generateics(s){
      sop = readString(s)[0];
      var startdate = toDate(sop.begin);
      var enddate = toDate(sop.end);
      defaultoffset(startdate, enddate, 1);
      var input = {subject:result.subject, description:"", location:result.location, start: startdate, end: enddate, recurrence: result.recurrence};
      var cal = ics();
      cal.addEvent(input.subject, input.description, input.location, input.start.toLocaleString(), input.end.toLocaleString());    

      var terminate = 5;
      var i=0;
      while(i<terminate && input.recurrence!="NONE"){
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
    }