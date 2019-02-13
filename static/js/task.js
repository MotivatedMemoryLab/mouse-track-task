/*
 * Requires:
 *     psiturk.js
 *     utils.js
 */

// Initalize psiturk object
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);

var mycondition = condition;  // these two variables are passed by the psiturk server process
var mycounterbalance = counterbalance;  // they tell you which condition you have been assigned to
// they are not used in the stroop code but may be useful to you

// All pages to be loaded
var pages = [
	"instructions/instruct-1.html",
	"instructions/instruct-2.html",
	"instructions/instruct-3.html",
	"instructions/instruct-ready.html",
    "prequestionnaire.html",
	"stage.html",
	"postquestionnaire.html"
];

psiTurk.preloadPages(pages);

var instructionPages = [ // add as a list as many pages as you like
	"instructions/instruct-1.html",
	"instructions/instruct-2.html",
	"instructions/instruct-3.html",
	"instructions/instruct-ready.html"
];


/********************
* HTML manipulation
*
* All HTML files in the templates directory are requested 
* from the server when the PsiTurk object is created above. We
* need code to get those pages from the PsiTurk object and 
* insert them into the document.
*
********************/

var Mousetrack = function(rewards) {
    // Load the stage.html snippet into the body of the page
    psiTurk.showPage('stage.html');

    window.moveTo(0, 0);
    window.resizeTo(screen.width, screen.height);
    /*
    $(window).resize(function(){
        window.resizeTo(screen.width, screen.height);
    });
    */

    var trial = null;
    var trials = null;
    var mode = "practice";

    rewards = rewards.split("\n").map(function(row){return row.split(",");});


    var createPractice = function () {
        mode = "practice";
        trial = new Trial(document.getElementById('container'), next);
        setTrial(trial);
        trials = [];
        calculate_trials(0, 0, 0, 0, 2);
    };

    var createMain = function () {
        mode = "main";
        trial = new Trial(document.getElementById('container'), next);
        setTrial(trial);
        trials = [];
        //calculate_trials(75, 25, 25, 50, 25);
        calculate_trials(0, 0, 0, 0, 2);
    };

    var havePointerLock = 'pointerLockElement' in document ||
        'mozPointerLockElement' in document ||
        'webkitPointerLockElement' in document;

    var getCursor = function(){
        var clicked = function(e){
            document.removeEventListener("click", clicked, true);
            lockMouse.call(trial, e.clientX, e.clientY);
        };
        document.addEventListener("click", clicked, true);
    };

    var restart = function(){
        showMessage(this, "You have unlocked the cursor. " +
            "This would invalidate your results in the main experiment. " +
            "Since this is practice, click anywhere to start over and try again.",
            "red", true,
            showStart.bind(null, "Get Ready! This is a practice run. " +
                "Do not resize or exit this window until you are done. " +
                "Click and read the cursor prompt to begin.")
        )
    };

    var exit = function(){
        showMessage(this, "You have unlocked the cursor during the main experiment, " +
            "and unfortunately you cannot continue. You will still be able to complete " +
            "this hit, but will not be awarded a bonus. Please click to continue.", "white",     true,
            function(){
                psiTurk.recordTrialData({
                    'phase':'exit'
                });

                document.getElementsByTagName("BODY")[0].style.backgroundColor = 'white';
                document.onpointerlockchange = undefined;
                currentview = new Questionnaire();
            }
        )
    };

    var showStart = function(message){
        if (mode === "practice") createPractice();
        else if (mode === "main") createMain();
        getCursor();
        var startExp = document.getElementById("start-exp");
        startExp.style.visibility = "visible";
        document.addEventListener("click", function start(){
            if(cursorOn(startExp)){
                document.removeEventListener("click", start);
                trial.setup(mode === "practice" ? restart : exit);
                startTrial();
                startExp.style.visibility = "hidden";
            }
        });
        showMessage(trial, message, "white", true,
            function(){
                trial.unlock = getCursor;
            });
    };


    if(havePointerLock){
        showStart("Get Ready! This is a practice run. Do not resize or exit this window until you are done. " +
            "Click and read the cursor prompt to begin.");

    } else {
        showMessage(trial, "Cannot replace the mouse cursor, please try another browser.", 'white', false, Function);
    }

    function calculate_trials(num_press, num_left_solo, num_right_solo, num_guess, break_threshold){
        var arr = [];
        var expand = function(data, frequency){
            var ret = [];
            for(var i = 0; i < frequency; i++){
                ret.push(data);
            }
            return ret
        };
        const press_row = 15;
        const left_solo_row = 16;
        const right_solo_row = 17;
        const guess_row = 18;
        const break_trial = -1;

        arr.push.apply(arr, expand(press_row, num_press));
        arr.push.apply(arr, expand(left_solo_row, num_left_solo));
        arr.push.apply(arr, expand(right_solo_row, num_right_solo));
        arr.push.apply(arr, expand(guess_row, num_guess));
        arr = _.shuffle(arr);
        let len = arr.length;
        for(var i = break_threshold; i < len; i+= break_threshold + 1){
            arr.splice(i, 0, break_trial);
        }

        // Press Trial Params
        const key = "spacebar";
        const time = 2000;

        const label_left_dual = 1;
        const label_right_dual = 2;
        const label_left_solo = 3;
        const label_right_solo = 4;
        const label_left_dual_guess = 5;
        const label_right_dual_guess = 6;

        var tick_press = 0;
        var tick_left_solo = 0;
        var tick_right_solo = 0;
        var tick_guess = 0;

        function randi(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        for(var j = 0; j < arr.length; j++){
            switch (arr[j]){
                case press_row:
                    pushTrial("press", key, randi(7, 12), time, rewards[label_left_dual][tick_press], rewards[label_right_dual][tick_press]);
                    tick_press += 1;
                    break;

                case left_solo_row:
                    pushTrial("single", rewards[label_left_solo][tick_left_solo], "left");
                    tick_left_solo += 1;
                    break;

                case right_solo_row:
                    pushTrial("single", rewards[label_right_solo][tick_right_solo], "right");
                    tick_right_solo += 1;
                    break;

                case guess_row:
                    pushTrial("double", rewards[label_left_dual_guess][tick_guess], rewards[label_right_dual_guess][tick_guess]);
                    tick_guess += 1;
                    break;
                case break_trial:
                    pushTrial("break");
                    break;
            }
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
                    trial.unlock = getCursor;
                    showMessage(trial, "Take a break. Click to continue.", "white", true, function(){
                        trial.setup(restart);
                        trial.valid = true;
                        startTrial();
                    });
                    break;
            }
        } else {
            psiTurk.saveData();
            if(mode === "practice"){
                trial.setup(Function);
                document.exitPointerLock();
                mode = "main";
                showStart("You are about to start the main experiment. You must finish completely without exiting for your results to be counted.")
            } else if (mode === "main") {
                document.getElementsByTagName("BODY")[0].style.backgroundColor = 'white';
                document.onpointerlockchange = undefined;
                currentview = new Questionnaire();
            }
        }
    }

    function next(){

        switch(arguments[0][0]){
            case "press":
                psiTurk.recordTrialData({
                    'phase': "trial",
                    'trial':"press",
                    'mode':mode,
                    'num':arguments[0][1],
                    'duration':arguments[0][2],
                    'val1':arguments[0][3],
                    'val2':arguments[0][4],
                    'presses':arguments[0][5],
                    'mtimes':arguments[0][6],
                    'mouse':arguments[0][7],
                    'choice':arguments[0][8]
                    }
                );
                break;
            case "double":
                psiTurk.recordTrialData({
                        'phase': "trial",
                        'trial':"double",
                        'mode':mode,
                        'val1':arguments[0][1],
                        'val2':arguments[0][2],
                        'reveal':arguments[0][3],
                        'mtimes':arguments[0][4],
                        'mouse':arguments[0][5],
                        'choice':arguments[0][6],
                    }
                );
                break;
            case "single":
                psiTurk.recordTrialData({
                        'phase': "trial",
                        'trial':"single",
                        'mode':mode,
                        'value':arguments[0][1],
                        'side':arguments[0][2],
                        'reveal':arguments[0][3],
                        'mtimes':arguments[0][4],
                        'mouse':arguments[0][5],
                        'choice':arguments[0][6],
                    }
                );
                break;
        }

        startTrial();
    }
}


/****************
* Questionnaire *
****************/

var PreQ = function(data) {
    var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";
    record_responses = function() {

        psiTurk.recordTrialData({'phase': 'prequestionnaire', 'status': 'submit'});

        $('textarea').each(function () {
            psiTurk.recordUnstructuredData(this.id, this.value);
        });
        $('input').each(function () {
            psiTurk.recordUnstructuredData(this.id, this.value);
        });
        $('select').each(function () {
            psiTurk.recordUnstructuredData(this.id, this.value);
        });
    };

    let  time = -1;

    prompt_resubmit = function () {
        if (time >= 0) {
            clearTimeout(time);
            time = -1;
        }
        document.body.innerHTML = error_message;
        $("#resubmit").click(resubmit);
    };

    resubmit = function() {
        document.body.innerHTML = "<h1>Trying to resubmit...</h1>";
        time = setTimeout(prompt_resubmit, 10000);

        psiTurk.saveData({
            success: function() {
                clearInterval(time);
                currentview = new Mousetrack(data);
            },
            error: prompt_resubmit
        });
    };



    // Load the questionnaire snippet
    psiTurk.showPage('prequestionnaire.html');
    psiTurk.recordTrialData({'phase':'prequestionnaire', 'status':'begin'});

    $("#next").click(function () {
        record_responses();
        psiTurk.saveData({
            success: function(){
                currentview = new Mousetrack(data);
            },
            error: prompt_resubmit});
    });

};

var Questionnaire = function() {

	var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

	record_responses = function() {

		psiTurk.recordTrialData({'phase':'postquestionnaire', 'status':'submit'});

		$('textarea').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);
		});

		$('input').each( function (i, val) {
            psiTurk.recordUnstructuredData(this.id, this.value);
        });

		$('select').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);		
		});


	};

	prompt_resubmit = function() {
		document.body.innerHTML = error_message;
		$("#resubmit").click(resubmit);
	};

	resubmit = function() {
		document.body.innerHTML = "<h1>Trying to resubmit...</h1>";
		reprompt = setTimeout(prompt_resubmit, 10000);
		
		psiTurk.saveData({
			success: function() {
			    clearInterval(reprompt); 
                psiTurk.computeBonus('compute_bonus', function(){
                	psiTurk.completeHIT(); // when finished saving compute bonus, then quit
                }); 


			}, 
			error: prompt_resubmit
		});
	};

	// Load the questionnaire snippet 
	psiTurk.showPage('postquestionnaire.html');
	psiTurk.recordTrialData({'phase':'postquestionnaire', 'status':'begin'});
	
	$("#next").click(function () {
	    record_responses();
	    psiTurk.saveData({
            success: function(){
                psiTurk.computeBonus('compute_bonus', function() { 
                	psiTurk.completeHIT(); // when finished saving compute bonus, the quit
                }); 
            }, 
            error: prompt_resubmit});
	});
    
	
};

// Task object to keep track of the current phase
var currentview;

/*******************
 * Run Task
 ******************/

$(window).load( function(){
    psiTurk.doInstructions(
        instructionPages, // a list of pages you want to display in sequence
        function() {
            $(document).ready(function () {
                $.ajax({
                    type: "GET",
                    url: "static/resources/chances.csv",
                    dataType: "text",
                    success: function (data) {
                        currentview = new PreQ(data);  // what you want to do when you are done with instructions
                    },
                    error: function (req, status, error) {
                        $("body").html("<p>" + error + "</p>");
                    }
                });
            });

        }

    );
});
