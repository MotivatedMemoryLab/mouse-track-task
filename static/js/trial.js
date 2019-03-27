class Trial {

  constructor(container, nextHandler, onUnlock, interval){
    this.container = container;
    this.next = nextHandler;
    this.cursor = document.getElementById('cursor');
    this.factor = 10;
    this.unlock = onUnlock;
    this.valid = true;
    this.interval = interval;
  }

  setup(onFail){
    this.unlock = function() {
      
      this.cursor.style.display = "none";
      this.valid = false;
      clearTimeout(this.timer);

      document.removeEventListener("mousemove", this.mouseRecord);
      document.removeEventListener("click", this.checkClicks);
      document.removeEventListener("mousemove", this.border);

      onFail();

    }.bind(this);
  }

  press(key, num, duration, val1, val2){
    var doPress = function(){
      this.myBody = document.body;
      container.innerHTML = "Press the '" + key + "' key quickly to reveal award amounts.";
      container.style.textAlign = "center";
      var indicator = document.createElement("DIV");
      indicator.style.visibility = "hidden";
      indicator.id = "indicator";

      this.val1 = val1;
      this.val2 = val2;
      this.key = key;
      this.duration = duration;
      this.num = num;
      this.presses = 0;
      this.presser = this.pressed.bind(this);
      this.indicator = indicator;
      var _myself = this;
      this.myBody.onkeyup = function(e){
        _myself.pressed(e);
      };
      container.appendChild(indicator);
      setTimeout(this.endPress.bind(this), this.duration)
    };

    this.cursor.style.display = "none";
    this.ret = ["press", num, duration, val1, val2];
    this.countdown("Press", "black", 3, 700, doPress);

  }

  single(val, side, reveal = true){
    var doSingle = function(){
      container.innerHTML = "";
      this.createClickArea(side, val, reveal);
      //this.addStart();
      this.runTrial()
    };

    this.cursor.style.display = "none";
    this.ret = ["single", val, side, reveal];

    this.countdown("Single", "black", 3, 700, doSingle);
  }

  double(val1, val2, reveal = true){
    var runDouble = function(){
      this.doDouble(val1, val2, reveal);
    };

    this.cursor.style.display = "none";
    this.ret = ["double", val1, val2, reveal];

    this.countdown("Double", "black", 3, 700, runDouble);

  }


  //-----------------------SUPPOSED TO BE PRIVATE-----------------------//
  countdown(message, color, start, duration, callback){
    if(start <= 1){
      showMessage(this, message + " in " + start, color, false, callback, duration)
    } else
      showMessage(this, message + " in " + start, color, false, function(){this.countdown(message, color, start - 1, duration, callback)}, duration)
  }

  doDouble(val1, val2, reveal){
    this.container.innerHTML = "";
    this.createClickArea("left", val1, reveal);
    this.createClickArea("right", val2, reveal);

    this.runTrial()
  }

  endPress(){
    this.myBody.onkeyup = undefined;
    this.container.children[0].style.background =
      (this.presses >= this.num) ? "#0a0" : "#a00";

    this.ret.push(this.presses);
    setTimeout(function(){
      this.doDouble(this.val1, this.val2, this.presses >= this.num, "double")
    }.bind(this), 1500)

  }

  pressed(e){
    if (this.key === "spacebar"){
      this.key = " ";
    }
    if(e.key === this.key){
      this.presses += 1;
    }
  }

  checkClicks(){
    var trial = getTrial();
    let clickareas = document.getElementsByClassName("clickarea");
    Array.from(clickareas).forEach(function(area){
        if(cursorOn(area)){
            trial.hitDetect.call(trial, area);
        }
    })
  }

  border(){
      let clickareas = document.getElementsByClassName("clickarea");
      Array.from(clickareas).forEach(function(area){
          if(cursorOn(area)){
              area.style.borderColor = "white";
          } else if(area.style.borderColor === "white"){
              area.style.borderColor = area.style.backgroundColor;
          }
      })
  }

  runTrial(){
    //this.ptimes = [];
    this.mouse = [];
    this.mtimes = [];
    this.choice = 0;
    this.timer = null;
    this.myBody = document.body;

    var cursor = this.cursor;

    cursor.style.left = String(window.innerWidth / 2) + 'px';
    cursor.style.top = String(window.innerHeight - 20) + 'px';
    cursor.style.display = 'inline';
    this.startTrial();
  }

  startTrial(){

    this.startTime = Date.now();
    var _myself = this;
    document.addEventListener("click", this.checkClicks);
    document.addEventListener("mousemove", this.border);
    //document.addEventListener("mousemove", this.mouseRecord);

    this.mouserecorder = setInterval(function(){
      let trial = getTrial();
      trial.mouse.push({"x": trial.cursor.style.left, "y": trial.cursor.style.top});
    }, this.interval);


    this.timer = setTimeout(function(){
      _myself.finish();
    }, 5000);
  }

  createClickArea(gravity, cash, reveal){
    var div = document.createElement("DIV");
    div.className = "clickarea";
    div.cash = cash;
    div.style.float = gravity;

    if(reveal){
      var rgb = "#" + (Math.round(255*cash)).toString(16) + "0000";
      div.style.background = rgb;
    }
    div.style.borderColor = div.style.backgroundColor;

    this.container.appendChild(div);
  }

  mouseRecord(e){
    let trial = getTrial();
    let coor = "{" + e.clientX + "," + e.clientY + "}";
    trial.mouse.push(coor);
    trial.mtimes.push(Date.now() - trial.startTime);
  }

  hitDetect(target) {
    this.choice = target.cash;
    this.finish();
  }

  finish(){
    
    this.cursor.style.display = "none";

    clearTimeout(this.timer);
    clearInterval(this.mouserecorder);
    document.removeEventListener("mousemove", this.mouseRecord);
    document.removeEventListener("click", this.checkClicks);
    document.removeEventListener("mousemove", this.border);

    var ret = this.ret;
    ret.push(this.mouse, this.choice);

    showMessage(this, "Value: $" + parseFloat(this.choice).toFixed(2), "black", false,
        function(){ this.next(ret);  }.bind(this), 1500);
  }

}
