class Trial {
  constructor(container, nextHandler){
  this.container = container;
  this.next = nextHandler;
  }

  press(key, num, duration){
    this.myBody = document.getElementsByTagName("BODY")[0];
    container.innerHTML = "Press the '" + key + "' key quickly to reveal award amounts. Start when you are ready.";
    container.style.textAlign = "center";
    var indicator = document.createElement("DIV");
    indicator.id = "indicator";

    this.key = key;
    this.duration = duration;
    this.num = num;
    this.presses = 0;
    this.presser = this.pressed.bind(this);
    this.indicator = indicator;
    var _myself = this;
    this.myBody.onkeyup = function(e){
      _myself.pressed(e).bind(_myself);
    }
    container.appendChild(indicator);
  }

  single(val, reveal, side){
    container.innerHTML = "";
    this.createClickArea(side, val, reveal);
    this.addStart();
    this.runTrial()
  }

  double(val1, val2, reveal){
    container.innerHTML = "";
    this.createClickArea("left", val1, reveal);
    this.createClickArea("right", val2, reveal);
    this.addStart();
    this.runTrial()

  }


  //-----------------------SUPPOSED TO BE PRIVATE-----------------------//

  endPress(){
    this.myBody.onkeyup = null;
    this.container.children[0].style.background =
      (this.presses >= this.num) ? "#0a0" : "#a00";

    if(this.presses >= this.num){
      this.container.children[0].style.background = "#0a0";
    } else {

    }
    var ret = [this.presses, this.num];
    setTimeout(function(){ this.next(ret);  }, 1500)

  }

  pressed(e){
    if(e.key === this.key){
      var _myself = this;
      this.indicator.style.background = "#888";
      if(this.presses === 0){
        setTimeout(function(){_myself.endPress().bind(this)}, this.duration);
      }
      this.presses += 1;
    }
  }


  runTrial(){
    //this.ptimes = [];
    this.mouse = [];
    this.mtimes = [];
    this.choice = 0;
    this.timers = [];
    this.startTime = Date.now();
    this.myBody = document.getElementsByTagName("BODY")[0];
  }

  startTrial(){
    this.start.style.cursor = "auto";
    var start = this.start;
    var timers = this.timers;
    var _myself = this;
    start.removeEventListener("click", this.starter);
    start.innerHTML = "5<br />Seconds"
    //setupChoices();
    start.style.background='#27e800';
    document.onmousemove = function(e){
      _myself.mouseDetect(e).bind(this);
    };

    var clickareas = document.getElementsByClassName("clickarea");
    for(var i = 0; i < clickareas.length; i++){
      clickareas[i].style.borderColor = "black";
    }

    timers.push(setTimeout(function(){ start.innerHTML = "4<br />Seconds" }, 1000));
    timers.push(setTimeout(function(){ start.innerHTML = "3<br />Seconds" }, 2000));
    timers.push(setTimeout(function(){ start.innerHTML = "2<br />Seconds" }, 3000));
    timers.push(setTimeout(function(){ start.innerHTML = "1<br />Seconds" }, 4000));
    timers.push(setTimeout(function(){
      _myself.finish().bind(_myself);
      document.getElementById("submitButton").style.display="none";
    }, 5000));

  }

  createClickArea(gravity, cash, reveal){
    var div = document.createElement("DIV");
    var _myself = this;
    div.className = "clickarea";
    div.cash = cash;
    div.style.float = gravity;
    div.onclick = function(e){
      _myself.hitDetect(e).bind(this);
      console.log("detected");
    };

    if(reveal){
      var rgb = "#0000" + (Math.round(255*cash)).toString(16);
      div.style.background = rgb;
    }
    div.style.borderColor = div.style.background;
    this.container.appendChild(div);
  }

  addStart(){
    var start = document.createElement("DIV");
    start.id = "startarea";
    start.innerHTML = "Click here to start.";
    this.starter = this.startTrial.bind(this);
    start.addEventListener("click", this.starter);
    container.appendChild(start);
    this.start = start;
  }

  mouseDetect(e){
    var x = e.clientX;
    var y = e.clientY;
    var coor = "{" + x + "," + y + "}";
    this.mouse.push(coor);
    console.log(coor)
    this.mtimes.push(Date.now() - this.startTime);
  }

  hitDetect(event) {

    var x = event.target;
    this.choice = x.cash;

    var clickareas = document.getElementsByClassName("clickarea");
    for(var i = 0; i < clickareas.length; i++){
      clickareas[i].onclick = null;
    }

    this.finish();
  }

  finish(){
    document.onmousemove = null;
    this.start.innerHTML = "You won:<br />$" + this.choice;

    //document.getElementById("demo").innerHTML = document.getElementById("mturk_form").choicedata;
    for(var i = 0; i <  this.timers.length; i++){
      clearTimeout(this.timers[i]);
    }
    var ret = [this.mtimes, this.mouse, this.choice];
    setTimeout(function(){ this.next(ret);  }, 3000) //runs next trial

  }

}
