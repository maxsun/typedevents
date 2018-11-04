console.log("Running");

let input = document.getElementById("mainInput");

var getText = (function() {
  var div = document.createElement('div');

  if (typeof div.textContent == 'string') {
    return function(el) {
      return el.textContent;
    }

  } else if (typeof div.innerText == 'string') {
    return function(el) {
      return el.innerText;
    }
  }
}());

class Selection {
  constructor($container) {
    this.$container = $container;
  }

  getSelection() {
    if (window.getSelection) {
      return window.getSelection().getRangeAt(0);
    } else if (document.selection) {
      return document.selection.createRange();
    }
  }

  sumCurrentOffset(root, node, startOffset) {
    for (let ele of Array.from(root.childNodes)) {
      if (node === ele) {
        break;
      }
      if (ele.contains(node)) {
        const result = this.sumCurrentOffset(ele, node, 0);
        startOffset += result;
        break;
      } else {
        startOffset += ele.textContent.length;
      }
    }
    return startOffset;
  }

  findNodeForPosition($container, currentOffset) {
    let node;
    ({ node, currentOffset } = this.findNode(
      $container.childNodes,
      currentOffset
    ));
    if (node.childNodes.length === 0) {
      return { node, currentOffset };
    } else {
      return this.findNodeForPosition(node, currentOffset);
    }
  }

  findNode(childNodes, currentOffset) {
    for (let node of Array.from(childNodes)) {
      if (currentOffset - node.textContent.length <= 0) {
        return { node, currentOffset };
      } else {
        currentOffset -= node.textContent.length;
      }
    }
  }

  saveCurrentSelection() {
    this.currentSelection = this.getSelection();
    this.startOffset = this.currentSelection.startOffset;
    this.currentOffset = this.sumCurrentOffset(
      this.$container,
      this.currentSelection.startContainer,
      this.startOffset
    );
  }

  restoreSelection() {
    let node;
    if (this.currentOffset === 0) {
      return;
    }
    const range = document.createRange();
    ({ node, currentOffset: this.currentOffset } = this.findNodeForPosition(
      this.$container,
      this.currentOffset
    ));
    range.setStart(node, this.currentOffset);
    range.collapse(true);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
}
function addToEventsDisplay(tokens) {
  let line = document.createElement("p");
  line.className = "line animated fadeIn";

  for (let i = 0; i < tokens.length; i++) {
    let token = document.createElement("span");
    token.className = "token";
    token.innerText = tokens[i];

    line.appendChild(token);
  }
  document.getElementById("events").appendChild(line);
}

function makeHighlightNode(text) {
  let highlight = document.createElement("span");
  highlight.className = "highlight";
  highlight.textContent = text;
  return highlight;
}

function makePlaintextNode(text) {
  let plain = document.createElement("span");
  plain.textContent = text;
  plain.className = "plain";
  return plain;
}

function fakeHighlights(str) {
  let splits = str.toString().split(" ");
  splits = splits.map((x, i) => {return {
    "value": x,
    "startIndex": str.indexOf(x),
    "endIndex": str.indexOf(x) + x.length
  }});
  splits = splits.filter((x, i) => {return i % 2 == 0 && x.value.trim() != ""});
  return splits;
}

input.addEventListener("keyup", function(event) {
  if(event.key == "Enter" && this.innerText.trim() != "") {
    event.preventDefault();

    try {
      let ev = readString(this.innerText);
      console.log(ev);
      addToEventsDisplay(this.innerText.split(" "));
      document.getElementById("events").scrollTo(0, document.getElementById("events").scrollHeight);
      this.innerText = "";
    } catch (err) {
      console.log("Not Ready Yet!");
    }
  }
});

document.getElementById("download").onclick = function() {
  console.log("Downloading ics!");
  let cal = generateics(readString(input.innerText)[0]);
  cal.download();
}

document.getElementById("sendToGoogle").onclick = function(e) {
  console.log("Sending to google!");
  if (!signedIn) {
    authenticate(e, function() {
      createEvent(readString(input.innerText)[0]);
    });
  } else {
    createEvent(readString(input.innerText)[0]);
  }
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
  // this.selection = new Selection(this);
  // this.selection.saveCurrentSelection();

  // let segments = [];

  // let text = this.innerText;

  // let highlights = fakeHighlights(text);
  // let startIndex = 0;
  // let test = [];
  // for (let i = 0; i < highlights.length; i++) {
  //   let plaintext = text.substring(startIndex, highlights[i].startIndex);
  //   segments.push(makePlaintextNode(plaintext));
  //   test.push(plaintext);
  //   startIndex = highlights[i].endIndex;
  //   segments.push(makeHighlightNode(highlights[i].value));

  // }
  // console.log(test);
  // let plaintext = text.substring(startIndex);
  // console.log(text, "splits:", text.split(" "));
  // console.log("highlights", highlights)
  // segments.push(makePlaintextNode(plaintext));

  // document.getElementById("test").innerHTML = "";
  // input.innerText = "";
  // for (let i = 0; i < segments.length; i++) {
  //   document.getElementById("test").appendChild(segments[i]);
  //   input.appendChild(segments[i]);
  // }
  // // setCaretPosition(cursorPosition);
  // this.selection.restoreSelection();

}