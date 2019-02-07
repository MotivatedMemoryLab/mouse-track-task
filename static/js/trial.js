class Trial {

  constructor(container, nextHandler, onUnlock){
    this.container = container;
    this.next = nextHandler;
    this.cursor = document.getElementById('cursor');
    this.factor = 10;
    this.unlock = onUnlock;
    this.valid = true;
  }

  setup(onFail){
    this.unlock = function() {
      
      this.cursor.style.display = "none";
      this.valid = false;
      clearTimeout(this.timer);

      console.log("Listeners removed");

      document.removeEventListener("mousemove", this.mouseRecord);
      document.removeEventListener("click", this.checkClicks);
      document.removeEventListener("mousemove", this.border);

      showMessage(this, "You have unlocked the cursor. " +
            "This would invalidate your results in the main experiment. " +
            "Since this is practice, click anywhere to start over and try again.",
            "red", true, onFail);
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
    console.log("cursor hidden");
    this.cursor.style.display = "none";
    this.ret = ["press", num, duration, val1, val2];
    showMessage(this, "Double: Press", "red", false, doPress);

  }

  single(val, side, reveal = true){
    var doSingle = function(){
      container.innerHTML = "";
      this.createClickArea(side, val, reveal, "single");
      //this.addStart();
      this.runTrial()
    };

    console.log("cursor hidden");
    this.cursor.style.display = "none";
    this.ret = ["single", val, side, reveal];
    
    showMessage(this, "Single", "blue", false, doSingle);
  }

  double(val1, val2, reveal = false){
    var runDouble = function(){
      this.doDouble(val1, val2, reveal, "guess");
    };

    console.log("cursor hidden");
    this.cursor.style.display = "none";
    this.ret = ["double", val1, val2, reveal];

    showMessage(this, "Double: Blank", "gray", false, runDouble);

  }


  //-----------------------SUPPOSED TO BE PRIVATE-----------------------//
  doDouble(val1, val2, reveal, type){
    this.container.innerHTML = "";
    this.createClickArea("left", val1, reveal, type);
    this.createClickArea("right", val2, reveal, type);

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
    document.addEventListener("mousemove", this.mouseRecord);

    this.timer = setTimeout(function(){
      _myself.finish();
    }, 5000);
  }

  createClickArea(gravity, cash, reveal, type){
    var div = document.createElement("DIV");
    div.className = "clickarea";
    div.cash = cash;
    div.style.float = gravity;

    if(reveal){
      if(type === "double")
        var rgb = "#" + (Math.round(255*cash)).toString(16) + "0000";
      else
        var rgb = "#0000" + (Math.round(255*cash)).toString(16);
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
    console.log("Listeners removed");
    document.removeEventListener("mousemove", this.mouseRecord);
    document.removeEventListener("click", this.checkClicks);
    document.removeEventListener("mousemove", this.border);

    var ret = this.ret;
    ret.push(this.mtimes, this.mouse, this.choice);

    console.log(this.choice);
    showMessage(this, "You won: $" + parseFloat(this.choice).toFixed(2), "white", false,
        function(){ this.next(ret);  }.bind(this), 3000);
  }

}
