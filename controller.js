var trial = new Trial(document.getElementById('container'), next);
var trials = [];
var results = [];
var count = 0;
var pressResult = true;

showMessage("Get Ready! Press t to begin.", "white", true, startTrial);
pushTrial("press", "f", 11, 2000, 0.82, 0.07);
pushTrial("double", 0.36, 0.74);
pushTrial("single", 0.43, "left");
//startTrial();
var havePointerLock = 'pointerLockElement' in document ||
    'mozPointerLockElement' in document ||
    'webkitPointerLockElement' in document;

console.log(havePointerLock)


function showMessage(message, color, waitPress, callback){
  document.getElementsByTagName("BODY")[0].style.backgroundColor = 'rgb(90, 90, 90)';
  container.innerHTML = '<div id="ready" style="color: ' + color + '"></div>'
  ready = document.getElementById("ready");
  ready.innerText = message;
  if(waitPress){
    document.addEventListener("keypress", function(e){
      if(e.key == "t"){
        document.removeEventListener("keypress", arguments.callee);
        callback.call(trial);
      }

    })
  } else {
      setTimeout(function(){callback.call(trial)}, 2000)
  }
}

function pushTrial(){
  trials.push(arguments);
}

function startTrial(){
  if(trials.length > 0){
    var info = trials.shift();
    switch(String(info[0])){
      case "double":
        trial.double(info[1], info[2], info.length > 3 ? info[3] : undefined);
        break;
      case "single":
        trial.single(info[1], info[2], info.length > 3 ? info[3] : undefined);
        break;
      case "press":
        trial.press(info[1], info[2], info[3], info[4], info[5]);
        break;
      case "break":
        showMessage("Take a break. Press t to continue.", "white", true, function(){
          count++;
          startTrial();
        })
        break;
    }
  } else {
    console.log("Done!");
    var container = document.getElementById("container");
    //document.getElementById("submitButton").style.display="inherit";
    container.innerHTML = "";
    for(var i = 0; i < results.length; i++){
      var args = Array.prototype.slice.call(results[i]);
      container.innerHTML += (args + "<br />");
    }
    container.innerHTML += "<br />";
  }
}

function next(){
  results[count] = arguments;
  count++;
  startTrial();
}
