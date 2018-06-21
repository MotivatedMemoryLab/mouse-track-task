var trial = new Trial(document.getElementById('container'), next);
var trials = [];
var results = [];
var count = 0;
var pressResult = true;

showStart();
//pushTrial("press", "f", 11, 2000);
pushTrial("double", 0.36, 0.74, true);
pushTrial("single", 0.43, true, "left");
//startTrial();

var nonTrialColor = 'rgb(120, 120, 120)';

function showStart(){
  document.getElementsByTagName("BODY")[0].style.backgroundColor = 'rgb(90, 90, 90)';
  container.innerHTML = '<div id="ready">Get Ready! Press t to begin.</div>'
  ready = document.getElementById("ready");
  console.log(ready);
  document.addEventListener("keypress", function(e){
    if(e.key == "t") startTrial();
  })//This is just not working
}

function pushTrial(){
  trials.push(arguments);
}

function startTrial(){
  if(trials.length > 0){
    var info = trials.shift();
    switch(String(info[0])){
      case "double":
        trial.double(info[1], info[2],
        info.length > 3 ? info[3] :
          (results[count-1][0][0] >= results[count-1][0][1])
          );
        break;
      case "single":
        trial.single(info[1], info[2], info[3]);
        break;
      case "press":
        trial.press(info[1], info[2], info[3]);
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
