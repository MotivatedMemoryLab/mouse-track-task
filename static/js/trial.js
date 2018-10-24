class Trial {
  constructor(container, nextHandler){
    this.container = container;
    this.next = nextHandler;
    this.cursor = document.getElementById('cursor');
    this.factor = 10;
  }



  press(key, num, duration, val1, val2){
    var doPress = function(){
      this.myBody = document.getElementsByTagName("BODY")[0];
      container.innerHTML = "Press the '" + key + "' key quickly to reveal award amounts. Start when you are ready.";
      container.style.textAlign = "center";
      var indicator = document.createElement("DIV");
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
      this.createClickArea(side, val, reveal);
      this.addStart();
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
      this.doDouble(val1, val2, reveal);
    }
    showMessage(this, "Double: Blank", "gray", false, runDouble);

  }


  //-----------------------SUPPOSED TO BE PRIVATE-----------------------//
  doDouble(val1, val2, reveal){
    container.innerHTML = "";
    this.createClickArea("left", val1, reveal);
    this.createClickArea("right", val2, reveal);
    this.addStart();
    this.runTrial()
  }

  endPress(){
    this.myBody.onkeyup = undefined;
    this.container.children[0].style.background =
      (this.presses >= this.num) ? "#0a0" : "#a00";

    this.ret.push(this.presses, this.num);
    setTimeout(function(){
      this.doDouble(this.val1, this.val2, this.presses >= this.num)
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

  pix2num(pix){
    return parseFloat(pix.substring(0, pix.length - 2));
  }

  moveCallback(e){
    var cursor = this.cursor;
    var factor = this.factor;

    var movementX = e.movementX ||
        e.mozMovementX          ||
        e.webkitMovementX       ||
        0,
    movementY = e.movementY ||
        e.mozMovementY      ||
        e.webkitMovementY   ||
        0;

    var pix2num = this.pix2num;
    this.mouseRecord(pix2num(cursor.style.left), pix2num(cursor.style.top));

    if(movementX > 0){
      var newleft = pix2num(cursor.style.left) + movementX/factor;
      if(newleft < 1920){
        cursor.style.left = newleft.toString() + "px";
      }
    } else if(movementX < 0){
      var newleft = pix2num(cursor.style.left) + movementX/factor;
      if(newleft > 0){
        cursor.style.left = newleft.toString() + "px";
      }
    }

    if(movementY > 0){
      var newtop = pix2num(cursor.style.top) + movementY/factor;
      if(newtop < 1000){
        cursor.style.top = newtop.toString() + "px";
      }
    } else if(movementY < 0){
      var newtop = pix2num(cursor.style.top) + movementY/factor;
      if(newtop > 0){
        cursor.style.top = newtop.toString() + "px";
      }
    }

    var clickareas = document.getElementsByClassName("clickarea");
    for(var i = 0; i < clickareas.length; i++){
      if(this.lockMouseOn(clickareas[i].getBoundingClientRect())){
        clickareas[i].style.border = "medium solid white";
      } else {
        clickareas[i].style.border = "thin solid " + String(clickareas[i].style.backgroundColor);
      }
    }
  }

  lockMouseOn(bb){
    var cursor = this.cursor;
    var x = this.pix2num(cursor.style.left) + cursor.width/2;
    var y = this.pix2num(cursor.style.top) + cursor.height/2;

    return x >= bb.left && x <= bb.right && y >= bb.top && y <= bb.bottom;
  }

  checkClicks(){
    var clickareas = document.getElementsByClassName("clickarea");
    for(var i = 0; i < clickareas.length; i++){
      if(this.lockMouseOn(clickareas[i].getBoundingClientRect())){
        this.hitDetect.call(this, clickareas[i]);
      }
    }
  }



  changeCallback(e){
    var cursor = this.cursor;
    if (document.pointerLockElement === cursor ||
          document.mozPointerLockElement === cursor ||
          document.webkitPointerLockElement === cursor) {
        // Pointer was just locked
        // Enable the mousemove listener

        cursor.style.display = 'inline';

        if(!this.started){
          this.mover = this.moveCallback.bind(this);
          document.onmousemove = this.mover;
          this.started = true;
          this.startTrial.call(this);

    }
      } else {
        // Pointer was just unlocked
        // Disable the mousemove listener
        document.onmousemove = undefined;
        cursor.style.display = 'none';

        document.onclick = undefined;
    }
  }

  runTrial(){
    //this.ptimes = [];
    this.mouse = [];
    this.mtimes = [];
    this.choice = 0;
    this.timers = [];
    this.myBody = document.getElementsByTagName("BODY")[0];
    var lock = this.changeCallback.bind(this);
    document.onpointerlockchange = document.onpointerlockchange ||
          document.onmozpointerlockchange ||
          document.onwebkitpointerlockchange;

    document.onpointerlockchange = lock;
  }

  startTrial(){
    this.startTime = Date.now();
    this.start.style.cursor = "auto";
    var start = this.start;
    var timers = this.timers;
    var _myself = this;
    start.onclick = undefined;
    start.innerHTML = "5<br />Seconds";
    start.style.background='#27e800';

    document.onclick = this.checkClicks.bind(this);

    timers.push(setTimeout(function(){ start.innerHTML = "4<br />Seconds" }, 1000));
    timers.push(setTimeout(function(){ start.innerHTML = "3<br />Seconds" }, 2000));
    timers.push(setTimeout(function(){ start.innerHTML = "2<br />Seconds" }, 3000));
    timers.push(setTimeout(function(){ start.innerHTML = "1<br />Seconds" }, 4000));
    timers.push(setTimeout(function(){
      _myself.finish();
      document.getElementById("submitButton").style.display="none";
    }, 5000));

  }

  createClickArea(gravity, cash, reveal){
    var div = document.createElement("DIV");
    div.className = "clickarea";
    div.cash = cash;
    div.style.float = gravity;

    if(reveal){
      var rgb = "#0000" + (Math.round(255*cash)).toString(16);
      div.style.background = rgb;
    }
    div.style.borderColor = div.style.backgroundColor;
    this.container.appendChild(div);
  }

  addStart(){
    var start = document.createElement("DIV");
    start.id = "startarea";
    start.innerHTML = "Click here to start.";
    var cursor = this.cursor;
    cursor.requestPointerLock = cursor.requestPointerLock ||
           cursor.mozRequestPointerLock ||
           cursor.webkitRequestPointerLock;
    start.onclick = function(e){
      cursor.style.left = String(e.clientX) + 'px';
      cursor.style.top = String(e.clientY) + 'px';
      cursor.requestPointerLock();
    }

    container.appendChild(start);
    this.start = start;

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
    document.onmousemove = undefined;
    document.exitPointerLock = document.exitPointerLock ||
         document.mozExitPointerLock ||
         document.webkitExitPointerLock;
    document.exitPointerLock();
    var clickareas = document.getElementsByClassName("clickarea");
    for(var i = 0; i < clickareas.length; i++){
      clickareas[i].onclick = undefined;
    }

    this.start.innerHTML = "You won:<br />$" + this.choice;

    //document.getElementById("demo").innerHTML = document.getElementById("mturk_form").choicedata;
    for(var i = 0; i <  this.timers.length; i++){
      clearTimeout(this.timers[i]);
    }
    var ret = this.ret;
    ret.push(this.mtimes, this.mouse, this.choice);
    console.log(this);
    console.log(this.next);
    setTimeout(function(){ this.next(ret);  }.bind(this), 3000) //runs next trial

  }

}
