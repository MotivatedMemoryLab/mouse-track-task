/*
 * Requires:
 *     psiturk.js
 *     utils.js
 */

// Initalize psiturk object
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);

// All pages to be loaded
var pages = [
    "pre-test.html",
	"instructions/instruct-1.html",
	"instructions/instruct-2.html",
	"instructions/instruct-3.html",
	"instructions/instruct-ready.html",
    "prequestionnaire.html",
	"stage.html",
    "postquestionnaire.html",
    "postquestionnaire1.html",
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
var pct = 0;

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
    window.resizeTo(screen.width, screen.availHeight);
    let noContext = document.addEventListener('contextmenu', function(e){
        e.preventDefault()
    });

    $(window).resize(function(){
        window.resizeTo(screen.width, screen.availHeight);
        window.moveTo(0, 0);
    });



    var trial = null;
    var trials = null;
    var trial_num = 0;
    reward_trials = [];
    var trialMode = "practice";

    rewards = rewards.split("\n").map(function(row){return row.split(",");});


    var createPractice = function () {
        trialMode = "practice";
        trial_num = 0;
        trial = new Trial(document.getElementById('container'), next, 10);
        setTrial(trial);
        trials = [];
        //calculate_trials(0, 0, 0, 0, 1);
        //calculate_trials(1, 1, 1, 1, 2);
        calculate_trials(4, 4, 4, 4, 8);
    };

    var createMain = function () {
        trialMode = "main";
        trial_num = 0;
        pct = 0;
        reward_trials = [...Array(176).keys()];
        reward_trials = reward_trials.slice(1);
        shuffleArray(reward_trials);
        reward_trials = reward_trials.slice(0, 10);
        function sorter(a, b){
            return a - b;
        }
        reward_trials = reward_trials.sort(sorter);
        trial = new Trial(document.getElementById('container'), next, 10); // the number at the end refers to # milliseconds between mouse position recordings
        setTrial(trial);
        trials = [];
        //calculate_trials(0, 0, 0, 0, 1);
        //calculate_trials(1, 1, 1, 1, 2);
        calculate_trials(75, 25, 25, 50, 25);
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
            "this hit, but only be awarded if you completed at least 80% of the trials. Please click to continue.", "black",     true,
            function(){
                psiTurk.recordTrialData({
                    'phase':'exit',
                    'trial_num':trial_num
                });

                psiTurk.recordUnstructuredData('pct_completion', pct);
                document.getElementsByTagName("BODY")[0].style.backgroundColor = 'white';
                document.onpointerlockchange = undefined;
                Questionnaire(noContext);
            }
        )
    };

    var showStart = function(message){
        if (trialMode === "practice") createPractice();
        else if (trialMode === "main") createMain();

        var cursor = document.getElementById("cursor");
        cursor.style.top = '0px';
        cursor.style.left = '0px';

        getCursor();
        var startExp = document.getElementById("start-exp");
        startExp.style.visibility = "visible";
        document.addEventListener("click", function start(){
            if(cursorOn(startExp)){
                console.log("Click registered and start clicked");
                document.removeEventListener("click", start);
                trial.setup(trialMode === "practice" ? restart : exit);
                startTrial();
                startExp.style.visibility = "hidden";
            }
        });
        showMessage(trial, message, "black", true,
            function(){
                console.log('Unlock removed!');
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

        const press_row = 0;
        const left_solo_row = 1;
        const right_solo_row = 2;
        const guess_row = 3;
        const break_trial = -1;

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
        pct = trial_num / (trial_num + trials.length);
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
            if(trialMode === "practice"){
                trial.setup(Function);
                document.exitPointerLock();
                trialMode = "main";
                document.getElementById("cursor").style.top = "0";
                showStart("You are about to start the main experiment. You must finish completely without exiting for your results to be counted.")
            } else if (trialMode === "main") {
                document.getElementsByTagName("BODY")[0].style.backgroundColor = 'white';
                document.onpointerlockchange = undefined;
                document.exitPointerLock();
                Questionnaire(noContext);
            }
        }
    }

    function next(){

        let included = trialMode === "main" && reward_trials.includes(trial_num);

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
                    'mode':trialMode,
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
                    'mode':trialMode,
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
                    'mode':trialMode,
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

var PreTest = function() {
    function record(){
        const names = ['pt0','pt1','pt2','pt3','pt4'];
        let blank = false;
        $.each(names, function(i, n){
            if ($("input[type=radio][name="+n+"]:checked").length <= 0 && mode !== 'debug') {
                alert("Please answer all questions.");
                blank = true;
                return false;
            }
        });
        if (blank)
            return false;
        let answers = {};
        $('input').each(function () {
            answers[this.id] = this.checked;
            psiTurk.recordUnstructuredData(this.id, this.checked);
        });

        if(!( mode === 'debug' || (
            answers["r-pretest0"] &&
            answers["l-pretest1"] &&
            answers["l-pretest2"] &&
            answers["r-pretest3"] &&
            answers["r-pretest4"] )
        )){
            psiTurk.recordUnstructuredData("ineligibility", "color: " + JSON.stringify(answers));
            window.location.replace("/ineligible?uniqueId="+uniqueId);
            return false;
        }

        return true;

    }

    psiTurk.showPage('pre-test.html');
    psiTurk.recordTrialData({'phase':'pretest', 'status':'begin'});

    let prompts = {1: 'Which square is brighter?', 2:'Which square is blue?'};

    let colors = [["#001", "#003",prompts[1]],["#007", "#005",prompts[1]],["#00b", "#009",prompts[1]],
                    ["#00d","#00f",prompts[1]],["#333","#003",prompts[2]]];

    $.each(colors, function (i, n) {
        $("#tests").append(
            "<div class='comparator'>" +
            "   <div class='test' id='test"+ i.toString() +"left' style='background-color: "+ n[0] +"'></div>\n" +
            "   <div class='test' id='test"+ i.toString() +"right' style='background-color: "+ n[1] +"'></div>\n" +
            "   <label>" + n[2] + "</label>\n" +
            "   <input type='radio' name='pt" + i.toString() + "' id='l-pretest" + i.toString() + "'> Left" +
            "   <input type='radio' name='pt" + i.toString() + "' id='r-pretest" + i.toString() + "'> Right" +
            "</div>")
    });

    $("#next").click(function(){
        if(record())
            PreQ();
    });
};

var PreQ = function() {
   record_responses = function() {

       if(mode !== 'debug' && (document.getElementById("age").value === "" || document.getElementById("cursor_sel").value === "")){
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


       if(mode !== 'debug' && document.getElementById("cursor_sel").value !== "leftmouse" && document.getElementById("cursor_sel").value !== "rightmouse"){
           psiTurk.recordUnstructuredData("ineligibility", "mouse: " + document.getElementById("cursor_sel").value);
           window.location.replace("/ineligible?uniqueId="+uniqueId);
           return false;
       }

        return true;
    };

    // Load the questionnaire snippet
    psiTurk.showPage('prequestionnaire.html');
    psiTurk.recordTrialData({'phase':'prequestionnaire', 'status':'begin'});
    window.scrollTo(0, 0);

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

var Questionnaire = function(noContext) {

    document.removeEventListener(noContext);

	var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

	record = function() {
        $('textarea').each(function () {
            psiTurk.recordUnstructuredData(this.id, this.value);
        });
        $('input').each(function () {
                psiTurk.recordUnstructuredData(this.id, this.checked);
        });
        $('select').each(function () {
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
                    if(pct >= 0.8)
                        alert("Your bonus is $" + bonus + ", and it was collected from trials: " + reward_trials.join(', ').replace(/, ([^,]*)$/, ' and $1') + ". After verification, it will be sent within 5 working days.");
                	else
                	    alert("Due to exiting the experiment early, you will not receive a bonus.");
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
        record();
        next.onclick = undefined;
        psiTurk.showPage('postquestionnaire1.html');
        window.scrollTo(0, 0);
        next = document.getElementById("next");
        next.onclick = function(){
            record();
            next.onclick = undefined;
            psiTurk.showPage('postquestionnaire3.html');
            window.scrollTo(0, 0);
            next = document.getElementById("next");
            next.onclick = function() {
                record();
                next.onclick = undefined;
                psiTurk.showPage('postquestionnaire2.html');
                window.scrollTo(0, 0);
                next = document.getElementById("next");
                next.onclick = function () {
                    record();
                    psiTurk.saveData({
                        success: function () {
                            psiTurk.computeBonus('compute_bonus', function () {
                                bonus = d3.format(".2f")(bonus);
                                alert("Your bonus is $" + bonus + ", and it was collected from trials: " + reward_trials.join(', ').replace(/, ([^,]*)$/, ' and $1') + ". After verification, it will be sent within 5 working days.");
                                psiTurk.completeHIT(); // when finished saving compute bonus, then quit
                            });
                        },
                        error: prompt_resubmit
                    });
                }
            }
        }
    }
};

/*******************
 * Run Task
 ******************/

$(window).load( function(){
    PreTest();
});
