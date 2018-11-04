console.log("Running");

let input = document.getElementById("mainInput");

var events = [];

function openInNewTab(url) {
  var a = document.createElement("a");
  a.target = "_blank";
  a.href = url;
  a.click();
}

function updateEventsDisplay() {
  document.getElementById("events").innerHTML = "";
  for (let i = 0; i < events.length; i++) {
    let line = document.createElement("p");
    line.className = "line animated fadeIn"
    line.innerText = events[i].text;
    line.event = events[i];
    line.onclick = function() {
      events = events.filter((x) => {
        return x.text != this.event.text;
      });
      updateEventsDisplay();
    }

    document.getElementById("events").appendChild(line);
  }
}

function updateIndicators() {
  let checkCircle = "fa-check-circle";
  let errorCircle = "fa-times-circle";

  let text = input.innerText;
  let errors = readCompoundString(text)[0][1];

  let ti = document.getElementById("timeIndicator");
  ti.className = ti.className.replace(" valid", "");
  ti.className = ti.className.replace(" invalid", "");

  let di = document.getElementById("dayIndicator");
  di.className = di.className.replace(" valid", "");
  di.className = di.className.replace(" invalid", "");

  let li = document.getElementById("locationIndicator");
  li.className = li.className.replace(" valid", "");
  li.className = li.className.replace(" invalid", "");

  let ri = document.getElementById("recurrenceIndicator");
  ri.className = ri.className.replace(" valid", "");
  ri.className = ri.className.replace(" invalid", "");

  if (errors.indexOf("time") == -1) {
    ti.className += " valid";
    ti.children[0].className = "indicatorIcon far " + checkCircle;
  } else {
    ti.className += " invalid";
    ti.children[0].className = "indicatorIcon far " + errorCircle;
  }

  if (errors.indexOf("day") == -1) {
    di.className += " valid";
    di.children[0].className = "indicatorIcon far " + checkCircle;
  } else {
    di.className += " invalid";
    di.children[0].className = "indicatorIcon far " + errorCircle;
  }

  if (errors.indexOf("location") == -1) {
    li.className += " valid";
    li.children[0].className = "indicatorIcon far " + checkCircle;
  } else {
    li.className += " invalid";
    li.children[0].className = "indicatorIcon far " + errorCircle;
  }

  if (errors.indexOf("recurrence") == -1) {
    ri.className += " valid";
    ri.children[0].className = "indicatorIcon far " + checkCircle;
  } else {
    ri.className += " invalid";
    ri.children[0].className = "indicatorIcon far " + errorCircle;
  }
}

input.addEventListener("keyup", function(event) {
  if(event.key == "Enter" && this.innerText.trim() != "") {
    event.preventDefault();

    let evs = readCompoundString(this.innerText);

    let errors = evs[0][1];
    if (errors.indexOf("time") == -1) {
      events.push({
        "text": this.innerText,
        "events": evs
      });
      updateEventsDisplay();
      document.getElementById("events").scrollTo(0, document.getElementById("events").scrollHeight);
      this.innerText = "";
      updateIndicators();
    }
  }
});

function generateSuccessMessage() {
  let msg = document.getElementById("statusMessage");
  msg.addEventListener("animationend", function() {
    console.log("done");
    msg.className = msg.className.replace("fadeIn", "");
    msg.classList.add("fadeOut");
    msg.addEventListener("animationend", function() {
      msg.className = "";
      msg.style.display = "none";
    });
  },false);
  msg.className = "animated fadeIn valid";
  msg.style.display = "inline-block";
  msg.innerText = "Success!";
}

function generateFailMessage() {
  let msg = document.getElementById("statusMessage");
  msg.addEventListener("animationend", function() {
    console.log("done");
    msg.className = msg.className.replace("fadeIn", "");
    msg.classList.add("fadeOut");
    msg.addEventListener("animationend", function() {
      msg.className = "";
      msg.style.display = "none";
    });
  },false);
  msg.className = "animated fadeIn invalid";
  msg.style.display = "inline-block";
  msg.innerText = "Failed!";
}

document.getElementById("download").onclick = function() {
  console.log("Downloading ics!");
  let cal = ics();

  for (let i = 0; i < events.length; i++) {
    for (let j = 0; j < events[i].events.length; j++) {
      cal = generateics(events[i].events[j][0], cal);
    }
  }
  

  if (events.length != 0) {
    generateSuccessMessage();
  } else {
    generateFailMessage();
  }

  cal.download();
}

document.getElementById("sendToGoogle").onclick = function(e) {
  console.log("Sending to google!");
  if (!signedIn) {
    authenticate(e, function() {
      for (let i = 0; i < events.length; i++) {
        for (let j = 0; j < events[i].events.length; j++) {
          createEvent(events[i].events[j][0], generateSuccessMessage);
        }
      }
    });
  } else {
    for (let i = 0; i < events.length; i++) {
      for (let j = 0; j < events[i].events.length; j++) {
        createEvent(events[i].events[j][0], generateSuccessMessage);
      }
    }
  }
  openInNewTab("https://calendar.google.com/calendar/r");

}

input.onkeydown = function (e) {
  if (!e) {
      e = window.event;
  }
  if (e.key == "Enter") {
      e.preventDefault();
  } else if (e.key == "Enter") {
      e.returnValue = false;
  }
};

input.oninput = function() {
  updateIndicators();
}