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

var Mousetrack = function() {
    // Load the stage.html snippet into the body of the page
    psiTurk.showPage('stage.html');

    var trial = new Trial(document.getElementById('container'), next);
    var trials = [];

    var havePointerLock = 'pointerLockElement' in document ||
        'mozPointerLockElement' in document ||
        'webkitPointerLockElement' in document;


    if(havePointerLock){

        var container = document.getElementById('container');

        function firstTap(){

            document.onpointerlockchange = document.onpointerlockchange ||
                document.onmozpointerlockchange ||
                document.onwebkitpointerlockchange;

            document.onpointerlockchange = lockReceived;

            container.requestPointerLock = container.requestPointerLock ||
                container.mozRequestPointerLock ||
                container.webkitRequestPointerLock;
            container.requestPointerLock();
        }

        function lockReceived(){
            if(document.pointerLockElement === container ||
                document.mozPointerLockElement === container ||
                document.webkitPointerLockElement === container) {

                document.exitPointerLock = document.exitPointerLock ||
                    document.mozExitPointerLock ||
                    document.webkitExitPointerLock;
                document.exitPointerLock();
                startTrial();
            }
        }

        showMessage(trial, "Get Ready! This is a practice run. Press t and read the cursor prompt to begin.", "white", true, firstTap);

        pushTrial("double", 0.36, 0.74);
        pushTrial("press", "spacebar", 11, 2000, 0.82, 0.07);
        pushTrial("single", 0.43, "left");

    } else {
        showMessage(trial, "Cannot replace the mouse cursor, please try another browser.", 'white', false, function(){});
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
                    })
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
$(window).load( function(){
    psiTurk.doInstructions(
    	instructionPages, // a list of pages you want to display in sequence
    	function() { currentview = new Mousetrack(); } // what you want to do when you are done with instructions
    );
});
