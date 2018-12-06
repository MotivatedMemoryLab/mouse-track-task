function AssertException(message) { this.message = message; }
AssertException.prototype.toString = function () {
	return 'AssertException: ' + this.message;
};

function assert(exp, message) {
	if (!exp) {
		throw new AssertException(message);
	}
}

// Mean of booleans (true==1; false==0)
function boolpercent(arr) {
	var count = 0;
	for (var i=0; i<arr.length; i++) {
		if (arr[i]) { count++; } 
	}
	return 100* count / arr.length;
}

function showMessage(trial, message, color, waitPress, callback){
    var container = document.getElementById("container");
    document.getElementsByTagName("BODY")[0].style.backgroundColor = 'rgb(90, 90, 90)';
    container.innerHTML = '<div id="ready" style="color: ' + color + '"></div>';
    var ready = document.getElementById("ready");
    ready.style.fontSize = "30px";
    ready.innerText = message;
    if(waitPress){
        var pressed = function(e){
            if(e.key === "t"){
                document.onkeypress = undefined;
                callback.call(trial);
            }

        }
        document.onkeypress = pressed;
    } else {
        setTimeout(function(){callback.call(trial)}, 2000)
    }
}
