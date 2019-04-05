/*
 * Requires:
 *     psiturk.js
 *     utils.js
 */

// Initalize psiturk object
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);

// All pages to be loaded
var pages = [
	"instructions/instruct-1.html",
	"instructions/instruct-2.html",
	"instructions/instruct-3.html",
	"instructions/instruct-ready.html",
    "prequestionnaire.html",
	"stage.html",
    "postquestionnaire.html",
    "postquestionnaire2.html",
    "postquestionnaire3.html"
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

var bonus = 0;
var reward_trials = [];

const conditions = [[3, 2, 0, 0, 3, 3, 0, 3, 0, 2, 0, 3, 0, 3, 3, 0, 0, 3, 3, 3, 0, 0, 0, 1, 3, 0, 2, 0, 2, 0, 0, 0, 2, 0, 3, 0, 0, 0, 2, 0, 0, 0, 3, 0, 3, 0, 3, 0, 2, 0, 2, 2, 1, 0, 0, 1, 3, 2, 0, 3, 0, 0, 3, 0, 3, 0, 2, 0, 0, 0, 1, 0, 0, 0, 3, 1, 0, 1, 0, 2, 0, 0, 3, 3, 0, 1, 3, 3, 0, 0, 2, 0, 2, 3, 1, 2, 1, 1, 0, 1, 3, 0, 0, 0, 3, 0, 1, 3, 0, 3, 3, 1, 0, 0, 3, 3, 0, 1, 0, 3, 1, 2, 0, 3, 2, 2, 0, 0, 2, 2, 2, 3, 1, 0, 3, 0, 0, 3, 3, 3, 0, 0, 3, 2, 1, 3, 0, 3, 3, 1, 3, 1, 0, 3, 0, 3, 2, 1, 0, 1, 1, 3, 0, 3, 0, 1, 3, 2, 0, 2, 1, 1, 3, 0, 0]
    ,
    [3, 1, 0, 3, 0, 0, 0, 3, 2, 0, 0, 0, 2, 0, 3, 2, 0, 3, 0, 0, 1, 0, 3, 0, 3, 2, 0, 0, 0, 1, 0, 3, 0, 1, 1, 2, 1, 3, 0, 3, 0, 2, 3, 1, 0, 3, 2, 0, 0, 3, 0, 0, 0, 2, 0, 2, 0, 0, 1, 3, 3, 2, 1, 1, 3, 0, 1, 2, 0, 3, 3, 0, 0, 1, 1, 0, 3, 1, 3, 0, 0, 0, 2, 0, 2, 3, 3, 0, 2, 3, 3, 1, 1, 3, 0, 2, 2, 0, 0, 3, 1, 0, 2, 2, 3, 0, 1, 0, 3, 3, 0, 0, 3, 3, 0, 0, 3, 0, 0, 1, 3, 0, 1, 0, 3, 0, 3, 3, 0, 3, 1, 2, 3, 0, 0, 0, 2, 1, 0, 3, 0, 3, 3, 3, 0, 2, 3, 0, 1, 0, 3, 3, 3, 2, 3, 0, 0, 0, 3, 2, 0, 0, 0, 2, 0, 3, 1, 0, 0, 0, 1, 0, 2, 3, 0]
    ,
    [3, 0, 3, 0, 0, 1, 3, 0, 2, 1, 0, 0, 1, 0, 3, 2, 0, 1, 0, 0, 0, 2, 3, 0, 0, 2, 3, 0, 0, 2, 1, 0, 0, 0, 3, 0, 0, 0, 3, 3, 3, 2, 0, 1, 3, 3, 3, 1, 0, 0, 3, 1, 0, 3, 1, 0, 2, 0, 2, 0, 2, 0, 1, 0, 2, 3, 0, 1, 3, 0, 1, 2, 0, 1, 3, 0, 2, 2, 3, 0, 3, 0, 3, 3, 0, 0, 0, 3, 1, 0, 1, 0, 3, 3, 2, 3, 2, 2, 0, 0, 3, 3, 2, 2, 3, 0, 0, 2, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 3, 3, 0, 0, 3, 0, 1, 3, 0, 1, 0, 3, 2, 0, 3, 0, 0, 2, 3, 3, 3, 0, 1, 0, 0, 2, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 2, 0, 1, 3, 0, 1, 0, 0, 3, 0, 3, 3, 3, 0, 3, 3, 2, 3, 2, 0, 3]
    ,
    [3, 3, 0, 0, 2, 0, 1, 2, 1, 0, 3, 0, 0, 3, 0, 0, 2, 2, 0, 0, 2, 0, 3, 3, 0, 0, 3, 0, 0, 1, 0, 3, 1, 3, 0, 3, 3, 3, 0, 2, 0, 3, 0, 0, 3, 0, 0, 1, 1, 0, 0, 1, 0, 3, 0, 3, 0, 2, 0, 0, 1, 3, 0, 3, 3, 3, 0, 1, 2, 0, 2, 1, 3, 0, 0, 1, 0, 0, 0, 1, 0, 0, 3, 3, 0, 0, 1, 2, 1, 0, 3, 0, 0, 0, 2, 0, 3, 0, 2, 3, 1, 0, 3, 3, 3, 0, 3, 0, 1, 0, 2, 1, 1, 0, 1, 3, 3, 2, 0, 0, 0, 2, 0, 0, 2, 3, 3, 0, 3, 3, 3, 0, 3, 3, 0, 2, 1, 3, 0, 1, 2, 1, 0, 2, 3, 0, 0, 1, 1, 0, 2, 0, 2, 0, 3, 0, 3, 0, 0, 0, 2, 3, 2, 3, 3, 0, 3, 3, 3, 0, 1, 0, 2, 3, 2]
    ];
var Mousetrack = function(rewards) {
    // Load the stage.html snippet into the body of the page
    psiTurk.showPage('stage.html');

    psiTurk.recordUnstructuredData("screen_x", screen.width);
    psiTurk.recordUnstructuredData("screen_y", screen.height);
    let gamut = "none";
    if (window.matchMedia("(color-gamut: srgb)").matches) {
        gamut = "srgb";
    }

    if (window.matchMedia("(color-gamut: p3)").matches) {
        gamut = "p3";
    }

    if (window.matchMedia("(color-gamut: rec2020)").matches) {
        gamut = "rec2020";
    }

    psiTurk.recordUnstructuredData("color-gamut", gamut);
    psiTurk.recordUnstructuredData("color-depth", window.screen.colorDepth);

    window.moveTo(0, 0);
    window.resizeTo(screen.width, screen.height);
    /*
    $(window).resize(function(){
        window.resizeTo(screen.width, screen.height);
    });
    */


    var trial = null;
    var trials = null;
    var trial_num = 0;
    reward_trials = [];
    var mode = "practice";

    rewards = rewards.split("\n").map(function(row){return row.split(",");});


    var createPractice = function () {
        mode = "practice";
        trial_num = 0;
        trial = new Trial(document.getElementById('container'), next, 10);
        setTrial(trial);
        trials = [];
        calculate_trials(0, 0, 0, 0, 1);
        //calculate_trials(1, 1, 1, 1, 2);
        //calculate_trials(4, 4, 4, 4, 8);
    };

    var createMain = function () {
        mode = "main";
        trial_num = 0;
        reward_trials = [...Array(176).keys()];
        reward_trials = reward_trials.slice(1);
        shuffleArray(reward_trials);
        reward_trials = reward_trials.slice(0, 10);
        reward_trials = reward_trials.sort();
        trial = new Trial(document.getElementById('container'), next, 10); // the number at the end refers to # milliseconds between mouse position recordings
        setTrial(trial);
        trials = [];
        calculate_trials(0, 0, 0, 0, 1);
        //calculate_trials(1, 1, 1, 1, 2);
        //calculate_trials(75, 25, 25, 50, 25);
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
            "this hit, but will not be awarded a bonus. Please click to continue.", "black",     true,
            function(){
                psiTurk.recordTrialData({
                    'phase':'exit',
                    'trial_num':trial_num
                });

                document.getElementsByTagName("BODY")[0].style.backgroundColor = 'white';
                document.onpointerlockchange = undefined;
                Questionnaire();
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
        showMessage(trial, message, "black", true,
            function(){
                trial.unlock = getCursor;
            });
    };


    if(havePointerLock){
        showStart("Get Ready! This is a practice run. Do not resize or exit this window until you are done. " +
            "Click and read the cursor prompt to begin.");

    } else {
        showMessage(trial, "Cannot replace the mouse cursor, please try another browser.", 'black', false, Function);
    }

    function calculate_trials(num_press, num_left_solo, num_right_solo, num_guess, break_threshold){
        var arr = [];
        if(num_press === 75 && num_left_solo === 25 && num_right_solo === 25 && num_guess === 50){
            // These are four pre-created conditions for the main experiment.
            arr = conditions[condition];
        } else {
            var expand = function(data, frequency){
                var ret = [];
                for(var i = 0; i < frequency; i++){
                    ret.push(data);
                }
                return ret
            };
            const press_row = 0;
            const left_solo_row = 1;
            const right_solo_row = 2;
            const guess_row = 3;
            const break_trial = -1;

            arr.push.apply(arr, expand(press_row, num_press));
            arr.push.apply(arr, expand(left_solo_row, num_left_solo));
            arr.push.apply(arr, expand(right_solo_row, num_right_solo));
            arr.push.apply(arr, expand(guess_row, num_guess));
            arr = _.shuffle(arr);
        }

        let len = arr.length;
        for(var i = break_threshold; i < len; i+= break_threshold + 1){
            arr.splice(i, 0, break_trial);
        }

        // Press Trial Params
        const key = "spacebar";
        const time = 2000;

        const label_left_dual = 4;
        const label_right_dual = 5;
        const label_left_solo = 6;
        const label_right_solo = 7;
        const label_left_dual_guess = 8;
        const label_right_dual_guess = 9;

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
                    pushTrial("press", key, randi(7, 15), time, rewards[label_left_dual][tick_press], rewards[label_right_dual][tick_press]);
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
            trial_num++;
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
                    psiTurk.recordUnstructuredData('break', trial_num);
                    trial_num--;
                    trial.unlock = getCursor;
                    showMessage(trial, "Take a break. Click to continue.", "black", true, function(){
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
                document.getElementById("cursor").style.top = "0";
                showStart("You are about to start the main experiment. You must finish completely without exiting for your results to be counted.")
            } else if (mode === "main") {
                document.getElementsByTagName("BODY")[0].style.backgroundColor = 'white';
                document.onpointerlockchange = undefined;
                document.exitPointerLock();
                Questionnaire();
            }
        }
    }

    function next(){

        let included = mode === "main" && reward_trials.includes(trial_num);

        switch(arguments[0][0]){
            case "press":
                if (included) {
                    bonus += parseFloat(arguments[0][7]);
                }
                psiTurk.recordTrialData({
                    'phase': "trial",
                    'trial':"press",
                    'included':included,
                    'trial_num': trial_num,
                    'mode':mode,
                    'num':arguments[0][1],
                    'duration':arguments[0][2],
                    'val1':arguments[0][3],
                    'val2':arguments[0][4],
                    'presses':arguments[0][5],
                    'mouse':arguments[0][6],
                    'choice':arguments[0][7]
                    }
                );
                break;
            case "double":
                if (included) {
                    bonus += parseFloat(arguments[0][5]);
                }
                psiTurk.recordTrialData({
                    'phase': "trial",
                    'trial':"double",
                    'included':included,
                    'trial_num': trial_num,
                    'mode':mode,
                    'val1':arguments[0][1],
                    'val2':arguments[0][2],
                    'reveal':arguments[0][3],
                    'mouse':arguments[0][4],
                    'choice':arguments[0][5],
                    }
                );
                break;
            case "single":
                if (included) {
                    bonus += parseFloat(arguments[0][5]);
                }
                psiTurk.recordTrialData({
                    'phase': "trial",
                    'trial':"single",
                    'included':included,
                    'trial_num': trial_num,
                    'mode':mode,
                    'value':arguments[0][1],
                    'side':arguments[0][2],
                    'reveal':arguments[0][3],
                    'mouse':arguments[0][4],
                    'choice':arguments[0][5],
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

var PreQ = function() {
   record_responses = function() {

       if(document.getElementById("age").value === "" || document.getElementById("cursor_sel").value === ""){
           alert("Please fill out the form before continuing.");
           return false;
       }

        //psiTurk.recordTrialData({'phase': 'prequestionnaire', 'status': 'submit'});

        $('textarea').each(function () {
            psiTurk.recordUnstructuredData(this.id, this.value);
        });
        $('input').each(function () {
            if(this.type === "checkbox")
                psiTurk.recordUnstructuredData(this.id, this.checked);
            else
                psiTurk.recordUnstructuredData(this.id, this.value);
        });
        $('select').each(function () {
            psiTurk.recordUnstructuredData(this.id, this.value);
        });

        if(parseInt(document.getElementById("age").value) > new Date().getFullYear()-17 ||
           parseInt(document.getElementById("age").value) < new Date().getFullYear()-46 ){
            psiTurk.recordUnstructuredData("ineligibility", "age: " + document.getElementById("age").value);
            window.location.replace("/ineligible?uniqueId="+uniqueId);
            return false;
        }


       if(document.getElementById("cursor_sel").value !== "leftmouse" && document.getElementById("cursor_sel").value !== "rightmouse"){
           psiTurk.recordUnstructuredData("ineligibility", "mouse: " + document.getElementById("cursor_sel").value);
           window.location.replace("/ineligible?uniqueId="+uniqueId);
           return false;
       }

        return true;
    };

    // Load the questionnaire snippet
    psiTurk.showPage('prequestionnaire.html');
    psiTurk.recordTrialData({'phase':'prequestionnaire', 'status':'begin'});

    $("#next").click(function () {

        if(record_responses()){
            psiTurk.doInstructions(
                instructionPages, // a list of pages you want to display in sequence
                function() {
                    $(document).ready(function () {
                        $.ajax({
                            type: "GET",
                            url: "static/resources/values.csv",
                            dataType: "text",
                            success: function (data) {
                                Mousetrack(data);  // what you want to do when you are done with instructions
                            },
                            error: function (req, status, error) {
                                $("body").html("<p>" + error + "</p>");
                            }
                        });
                    });

                }

            );
        }

    });

};

var Questionnaire = function() {

	var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

	recordLoc = function() {

		//psiTurk.recordTrialData({'phase':'loc', 'status':'submit'});

		$('input').each( function () {
            psiTurk.recordUnstructuredData(this.id, this.checked);
        });
	};

    recordBisbasMtq = function() {

        //psiTurk.recordTrialData({'phase':'bisbas', 'status':'submit'});

        $('select').each( function() {
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
                    bonus = d3.format(".2f")(bonus);
                    alert("Your bonus is $" + bonus + ", and it was collected from trials: " + reward_trials.join(', ').replace(/, ([^,]*)$/, ' and $1') + ". After verification, it will be sent within 5 working days.");
                	psiTurk.completeHIT(); // when finished saving compute bonus, then quit
                });
			}, 
			error: prompt_resubmit
		});
	};

	// Load the questionnaire snippet 
	psiTurk.showPage('postquestionnaire.html');
	//psiTurk.recordTrialData({'phase':'loc', 'status':'begin'});

	let next = document.getElementById("next");

    next.onclick = function(){
	    recordLoc();
        next.onclick = undefined;
        psiTurk.showPage('postquestionnaire2.html');
        next = document.getElementById("next");
        next.onclick = function(){
            recordBisbasMtq();
            next.onclick = undefined;
            psiTurk.showPage('postquestionnaire3.html');
            next = document.getElementById("next");
            next.onclick = function(){
                recordBisbasMtq();
                psiTurk.saveData({
                    success: function(){
                        psiTurk.computeBonus('compute_bonus', function() {
                            bonus = d3.format(".2f")(bonus);
                            alert("Your bonus is $" + bonus + ", and it was collected from trials: " + reward_trials.join(', ').replace(/, ([^,]*)$/, ' and $1') + ". After verification, it will be sent within 5 working days.");
                            psiTurk.completeHIT(); // when finished saving compute bonus, then quit
                        });
                    },
                    error: prompt_resubmit});
            }
        }
    }
};

/*******************
 * Run Task
 ******************/

$(window).load( function(){
    PreQ();
});
