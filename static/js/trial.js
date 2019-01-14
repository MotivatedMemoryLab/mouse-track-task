class Trial {
  constructor(container, nextHandler){
    this.container = container;
    this.next = nextHandler;
    this.cursor = document.getElementById('cursor');
    this.factor = 10;
  }



  press(key, num, duration, val1, val2){
    var doPress = function(){
      this.myBody = document.body;
      container.innerHTML = "Press the '" + key + "' key quickly to reveal award amounts. Start when you are ready.";
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
    };
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
    this.ret = ["single", val, side, reveal];
    this.started = false;
    showMessage(this, "Single", "blue", false, doSingle);
  }

  double(val1, val2, reveal = false){
    this.ret = ["double", val1, val2, reveal];
    this.started = false;
    var runDouble = function(){
      this.doDouble(val1, val2, reveal, "guess");
    }
    showMessage(this, "Double: Blank", "gray", false, runDouble);

  }


  //-----------------------SUPPOSED TO BE PRIVATE-----------------------//
  doDouble(val1, val2, reveal, type){
    container.innerHTML = "";
    this.createClickArea("left", val1, reveal, type);
    this.createClickArea("right", val2, reveal, type);
    //this.addStart();
    this.runTrial()
  }

  endPress(){
    this.myBody.onkeyup = undefined;
    this.container.children[0].style.background =
      (this.presses >= this.num) ? "#0a0" : "#a00";

    this.ret.push(this.presses, this.num);
    setTimeout(function(){
      this.doDouble(this.val1, this.val2, this.presses >= this.num, "double")
    }.bind(this), 1500)

  }

  pressed(e){
    if (this.key === "spacebar"){
      this.key = " ";
    }
    if(e.key === this.key){
      this.indicator.style.background = "#888";
      if(this.presses === 0){
        setTimeout(this.endPress.bind(this), this.duration);
      }
      this.presses += 1;
    }
  }

  checkClicks(){
    var clickareas = document.getElementsByClassName("clickarea");
    for(var i = 0; i < clickareas.length; i++){
      if(cursorOn(clickareas[i])){
        this.hitDetect.call(this, clickareas[i]);
      }
    }
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

    document.addEventListener("click", this.checkClicks.bind(this));

    this.timer = setTimeout(function(){
      _myself.finish();
    }, 5000);
    document.addEventListener("mousemove", this.mouseRecord.bind(this));
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

  mouseRecord(x, y){
    var coor = "{" + x + "," + y + "}";
    this.mouse.push(coor);
    this.mtimes.push(Date.now() - this.startTime);
  }

  hitDetect(target) {
    this.choice = target.cash;
    this.finish();
  }

  finish(){
    this.started = false;
    this.cursor.style.display = "none";

    clearTimeout(this.timer);
    document.removeEventListener("mousemove", this.mouseRecord);
    document.removeEventListener("click", this.checkClicks);

    var ret = this.ret;
    ret.push(this.mtimes, this.mouse, this.choice);

    showMessage(this, "You won: $" + parseFloat(this.choice).toFixed(2), "white", false,
        function(){ this.next(ret);  }.bind(this), 3000);
  }

}
