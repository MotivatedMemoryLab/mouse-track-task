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

    var trial = new Trial(document.getElementById('container'), next);
    var trials = [];

    var havePointerLock = 'pointerLockElement' in document ||
        'mozPointerLockElement' in document ||
        'webkitPointerLockElement' in document;


    if(havePointerLock){

        var cursor = document.getElementById('cursor');

        function firstTap(){

            document.onpointerlockchange = document.onpointerlockchange ||
                document.onmozpointerlockchange ||
                document.onwebkitpointerlockchange;

            document.onpointerlockchange = lockReceived;

            cursor.requestPointerLock = cursor.requestPointerLock ||
                cursor.mozRequestPointerLock ||
                cursor.webkitRequestPointerLock;
            cursor.requestPointerLock();
        }

        function lockReceived(){
            if(document.pointerLockElement === cursor ||
                document.mozPointerLockElement === cursor ||
                document.webkitPointerLockElement === cursor) {

                document.exitPointerLock = document.exitPointerLock ||
                    document.mozExitPointerLock ||
                    document.webkitExitPointerLock;
                document.exitPointerLock();
                startTrial();
            }
        }

        showMessage(trial, "Get Ready! This is a practice run. Do not resize or exit this window until you are done. Press t and read the cursor prompt to begin.", "white", true, firstTap);

        calculate_trials(4, 4, 4, 4, 8);

        // pushTrial("double", 0.36, 0.74);
        // pushTrial("press", "spacebar", 11, 2000, 0.82, 0.07);
        // pushTrial("single", 0.43, "left");

    } else {
        showMessage(trial, "Cannot replace the mouse cursor, please try another browser.", 'white', false, function(){});
    }

    function calculate_trials(num_press, num_left_solo, num_right_solo, num_guess, break_threshold){
        var arr = [];
        var expand = function(data, frequency){
            var ret = [];
            for(var i = 0; i < frequency; i++){
                ret.push(data);
            }
            return ret
        }
        const press_row = 15;
        const left_solo_row = 16;
        const right_solo_row = 17;
        const guess_row = 18;

        arr.push.apply(arr, expand(press_row, num_press));
        arr.push.apply(arr, expand(left_solo_row, num_left_solo));
        arr.push.apply(arr, expand(right_solo_row, num_right_solo));
        arr.push.apply(arr, expand(guess_row, num_guess));
        arr = _.shuffle(arr);
        for(var i = break_threshold; i < arr.length; i+= break_threshold){
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

        rewards = rewards.split("\n").map(function(row){return row.split(",");});

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
                    showMessage(trial, "Take a break. Press t to continue.", "white", true, function(){
                        startTrial();
                    });
                    break;
            }
        } else {
            console.log("Done!");

            document.getElementsByTagName("BODY")[0].style.backgroundColor = 'white';
            currentview = new Questionnaire();
        }
    }

    function next(){

        switch(arguments[0]){
            case "press":
                psiTurk.recordTrialData({'trial':"press",
                    'num':arguments[1],
                    'duration':arguments[2],
                    'val1':arguments[3],
                    'val2':arguments[4],
                    'presses':arguments[5]
                    }
                );
                break;
            case "double":
                psiTurk.recordTrialData({'trial':"double",
                        'val1':arguments[1],
                        'val2':arguments[2],
                        'reveal':arguments[3],
                        'mtimes':arguments[4],
                        'mouse':arguments[5],
                        'choice':arguments[6],
                    }
                );
                break;
            case "single":
                psiTurk.recordTrialData({'trial':"single",
                        'value':arguments[1],
                        'side':arguments[2],
                        'reveal':arguments[3],
                        'mtimes':arguments[4],
                        'mouse':arguments[5],
                        'choice':arguments[6],
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

var Questionnaire = function() {

	var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

	record_responses = function() {

		psiTurk.recordTrialData({'phase':'postquestionnaire', 'status':'submit'});

		$('textarea').each( function(i, val) {
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
                	psiTurk.completeHIT(); // when finished saving compute bonus, the quit
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

$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "static/resources/chances.csv",
        dataType: "text",
        success: function(data) {
            load(data);
        },
        error: function(req, status, error){
            $("body").html("<p>" + error + "</p>");
        }
    });
});

var load = function(data) {
    $(window).load(function () {
        psiTurk.doInstructions(
            instructionPages, // a list of pages you want to display in sequence
            function () {
                currentview = new Mousetrack(data);
            } // what you want to do when you are done with instructions
        );
    });
};
