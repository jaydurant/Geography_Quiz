var question_number=0;
var user_answers = {};
var allQuestions = [
	{
		question: "1. What three countries are in North America?", 
		choices: ["Canada, United States and Mexico", "Mexico, Canada and Spain", "North America, Canada, United States"], 
		correctAnswer:0
	},
	{
		question:"2.  The state of Florida is what kind of landform?",
		choices: ["Mountain range","Peninsula","Hill"],
		correctAnswer:1

	},
	{
		question:"3.  The imaginary line that divides the globe into Northern Hemisphere and Southern Hemisphere.",
		choices: ["prime meridian","longitude","equator","grid"],
		correctAnswer:2
	},
	{
		question:"4.  Tiny model of Earth shaped like a sphere.",
		choices:["map","globe","hemisphere","meridian"],
		correctAnswer: 1
	},
	{
		question:"5.  Why do people set up systems of laws in their communities?",
		choices:["To find a better job in the community.","To go to a new school in the community.","To make the community safe.","To make the community unsafe."],
		correctAnswer:2
	},
	{
		question:"6.  Longitude lines travel north and south.",
		choices:["true","false"],
		correctAnswer:0
	},
	{
		question:"7.  How would you describe a rural community?",
		choices:["The towns are small and far away","The cities are big.","The towns have many people.","The towns have many schools."],
		correctAnswer:0
	},
	{
		question:"8.  Which landform makes it possible for people in the Western region to enjoy snow skiing?",
		choices:["plateau","desert","mountain","canyon"],
		correctAnswer:2
	},
	{
		question:"9.  The Earth has ______ oceans.",
		choices:["1","0","3","5"],
		correctAnswer: 3
	},
	{
		question:"10.  Imaginary lines that travel West and East are Longitude.",
		choices:["true","false"],
		correctAnswer:1
	}

];

document.getElementById("accountAccess").onclick = accountAccess;

// accountAccess shows the input fields to create an account or login

function accountAccess(e){
	if (!(e)){
		e = window.event;
	}
    var getstarted = "<div id='getStartedButton' class='nextButton'>Get Started</div>";
	var accessscores = "<div id='accessScoresButton' class='nextButton'>Access Account </div>";
	var name = "<input id='u_name' name='u_name' type='text' class='accountAccessFields'  placeholder='Name' > "
	var username = "<input type='text' name='username' class='accountAccessFields' placeholder='Username' >";
	var password = "<input type='password' name='password' class='accountAccessFields' placeholder='Password'>";
	var verifypassword = "<input type='password' name='passwordverify' class='accountAccessFields' placeholder='Verify Password'>";
	if(e.target.id === "createAccount"){
		document.getElementById("accessFields").innerHTML = name + username + password + verifypassword ;
		document.getElementById("buttons").innerHTML = getstarted;	
	}

	if(e.target.id === "login"){
		document.getElementById("accessFields").innerHTML = username + password ;
		document.getElementById("buttons").innerHTML = getstarted + accessscores;
		document.getElementById("accessScoresButton").onclick = showAccountPage;
	}

	document.getElementById("getStartedButton").onclick = startQuiz;
	
}


//startQuiz function removes the initial text and begins to add the Next button

function startQuiz(){
	if(!(accessValidation() )){
		return;
	}

	if(document.getElementById("scoreTable")){
		document.getElementById("scoreTable").parentNode.removeChild(document.getElementById("scoreTable"));
	}

	if(document.getElementById("accessScoresButton")){
		document.getElementById("accessScoresButton").parentNode.removeChild(document.getElementById("accessScoresButton"));
	}

	var h2Element = document.querySelector("h2");
	h2Element.innerHTML ="";
	h2Element.style.display = "none";
	var started_Button = document.getElementById("getStartedButton");
	started_Button.parentNode.removeChild(started_Button);
	
	var change_questButtonText =  document.createTextNode("Next Question");
	var change_questButtonElement =  document.createElement("div");

	change_questButtonElement.appendChild(change_questButtonText);
	document.getElementById("buttons").appendChild(change_questButtonElement);
    change_questButtonElement.classList.add("nextButton");
    change_questButtonElement.id = "nextQButton";
	changeQuestion();
	
	
	change_questButtonElement.onclick  = function(){changeQuestion(true)};
}

// showAccountPage shows a greeting to the user, a table with the user's scores, and a button to allow user to retake the quiz

function showAccountPage(){
	if(!(accessValidation()) ){
		if(!(document.getElementById("accountAccessError")) &&  document.quiz_Form.username.value !== "" && document.quiz_Form.password.value !== ""  ){
		var loginErrorText = document.createTextNode("Your username or password is incorrect");
		var loginerrorElement = document.createElement("div");
		loginerrorElement.appendChild(loginErrorText);
		loginerrorElement.id = "accountAccessError"
		document.getElementById("accessFields").appendChild(loginerrorElement);
		
		}

		return
	}
	var userdata = JSON.parse(localStorage.user)
	document.querySelector("h1").innerHTML = "Hi " + userdata.uname  + ", welcome to your account page.";
	document.querySelector("h2").innerHTML = "View your scores below";
	document.querySelector("h2").style.display="block"

	if(document.getElementById("accessFields") && document.getElementById("accountAccess")){
	document.getElementById("accessFields").parentNode.removeChild(document.getElementById("accessFields"));
	document.getElementById("accountAccess").parentNode.removeChild(document.getElementById("accountAccess"));
	}

	document.getElementById("buttons").innerHTML = "<div id='getStartedButton' class='nextButton'>Retake the Quiz</div>";
	document.getElementById("getStartedButton").onclick = startQuiz;
	question_number = 0;

	insertScores();
}

// insertScores creates a html table which displays the users recorded scores and date/time for when the test took place

function insertScores(){
	var table_div = document.createElement("div");
	table_div.id = "scoreTable";
	var table_html = "<table> <tr> <th>Scores</th> <th>Date</th></tr>"

	var userdata = JSON.parse(localStorage.user);
	var sortedScores = userdata.scores.sort(function(a,b){
		return b[0] - a[0];
	});

	sortedScores.forEach(function(val){
		table_html += "<tr><td>" + val[0] + "% </td><td>" + val[1] +"</td></tr>"; 
	})

	table_html += "</table>";

	table_div.innerHTML = table_html;

	document.querySelector(".content").insertBefore(table_div,document.quiz_Form);
}

// accessValidation detects whether the login and account creation fields have been given values and match the localStorage values

function accessValidation(){
	var quizFields = document.quiz_Form;
	for(var i = 0; i < quizFields.length;i++){
		var current_field = quizFields[i];

		if(current_field.name === "u_name" && current_field.value === ""){
			if(!(document.getElementById("nameError"))){
				var enterNameErrorText = document.createTextNode("Please enter your name");
				var enterNameElement = document.createElement("div");
				enterNameElement.appendChild(enterNameErrorText);
				enterNameElement.id = 'nameError';
				document.getElementById("accessFields").insertBefore(enterNameElement,document.quiz_Form.u_name);
			}
			return false;
			
		}

		if(current_field.name === "username" && current_field.value === ""){
				if( !(document.getElementById("usernameError")) && !(document.getElementById("accountAccessError")) ){
					var enterUsernameErrorText = document.createTextNode("Please enter a valid username");
					var enterUsernameErrorElement = document.createElement("div");
					enterUsernameErrorElement.appendChild(enterUsernameErrorText);
					enterUsernameErrorElement.id = "usernameError";
					document.getElementById("accessFields").insertBefore(enterUsernameErrorElement,document.quiz_Form.username);
				}
				return false;
				
		}

		if(current_field.name === "password" && current_field.value === ""){
			if( !(document.getElementById("userpasswordError")) ){
				var enterPasswordText = document.createTextNode("Please enter your password");
				var enterPasswordErrorElement =  document.createElement("div");
				enterPasswordErrorElement.appendChild(enterPasswordText);
				enterPasswordErrorElement.id = "userpasswordError";
				document.getElementById("accessFields").insertBefore(enterPasswordErrorElement,document.quiz_Form.password);
			}
			return false;
			
			
		}

		if(current_field.name === "passwordverify" && current_field.value === ""){
			if(!(document.getElementById("userverifypasswordError"))){
				var verifyPasswordText = document.createTextNode("Please re-enter your desired password");
				var verifyPasswordElement = document.createElement("div");
				verifyPasswordElement.appendChild(verifyPasswordText);
				verifyPasswordElement.id = "userverifypasswordError";
				document.getElementById("accessFields").insertBefore(verifyPasswordElement,document.quiz_Form.passwordverify);
			}
			return false;
			
		}
	}
	
	if(document.quiz_Form.length === 4 && document.quiz_Form.password.value === document.quiz_Form.passwordverify.value && storageAvailable("localStorage")){
			localStorage.clear();
			var user = {};
			user["uname"] = document.quiz_Form.username.value;
			user["password"] = document.quiz_Form.passwordverify.value;
			user["scores"] = [];
			localStorage["user"] = JSON.stringify(user);
		
	}

	else if(document.quiz_Form.length === 2 && storageAvailable("localStorage")){
		var userLocalStorage = JSON.parse(localStorage.user)
		if (document.quiz_Form.username.value !== userLocalStorage.uname || document.quiz_Form.password.value !== userLocalStorage.password ){
			return false;
		}
	}


	return true;
}

// changeQuestion keeps track of the current question, score ,and traverses the array to change the elements according to the question

function changeQuestion(button_type){
	if( button_type === true){
		if(!(checkValidation())){
			return;
		};
	}

	if (question_number > 0 && button_type === false){
		question_number -= 1;
		if (question_number === 0){
			document.getElementsByClassName("nextButton")[0].parentNode.removeChild(document.getElementsByClassName("nextButton")[0]);
		}
	}

	if(question_number > 0){
		if(!(document.getElementsByClassName("nextButton")[0].innerHTML === "Previous Question") ){
			prevQButton();
		}
	}

	if(question_number === allQuestions.length){
		quizCompletion();
		return;
	}



	if(document.getElementById("checkValidation")){
		document.getElementById("checkValidation").parentNode.removeChild(document.getElementById("checkValidation"));
	}

	var current_question =  allQuestions[question_number];
	var question_text = current_question.question;
	document.getElementById("title").innerHTML = question_text;
	var radio_html = "";
	for (var i =0 ; i < current_question.choices.length;i++ ){
		radio_html += "<div class='radio-buttons'><label><input type='radio' id='" +current_question.choices[i]  +"' name='radio_options' value='" + current_question.choices[i] + "'/>" + current_question.choices[i] + "</label> </div>";
	}
	document.quiz_Form.innerHTML = radio_html;

	if( !(isNaN(user_answers[question_number])) ){
		var answer_number = user_answers[question_number];
		document.quiz_Form.radio_options[answer_number].checked =  true;
	}

	if(question_number === (allQuestions.length - 1)){
		document.getElementById("nextQButton").innerHTML = "Finish Quiz";
	}

	else if( document.getElementById("nextQButton").innerHTML === "Finish Quiz" && question_number < (allQuestions.length - 1)  ){
		document.getElementById("nextQButton").innerHTML  = "Next Question";
	}

}

// checkValidation checks to see if a user has answered the question

function checkValidation(){
	if ( detectFormChange() ){
			question_number += 1;
			return true;
	}

	if (document.getElementById("checkValidation")){
		return false;
	}
	
	var error_text = document.createTextNode("You can't move forward without answering a question.");
	var error_element = document.createElement("div");
	error_element.id = "checkValidation";
	var content_element =  document.getElementsByClassName("content")[0];
	var form = document.quiz_Form;
	error_element.appendChild(error_text);
	content_element.insertBefore(error_element,form);
	return false;

	
}

// detectFormChange detects whether the a radio option has been selected

function detectFormChange(){
	var radio_options = document.quiz_Form.radio_options;
	for(var i = 0; i < radio_options.length; i++){
		if(document.quiz_Form.radio_options[i].checked === true){
			user_answers[question_number] = i;
			return true;
		}
	}
	return false;

}

// prevQButton adds the last question button to the DOM

function prevQButton(){
		var last_question_text = document.createTextNode("Previous Question");
		var last_question_element = document.createElement("div");
		last_question_element.appendChild(last_question_text);
		document.getElementById("buttons").insertBefore(last_question_element,document.getElementById("nextQButton"));
		last_question_element.classList.add("nextButton");
		last_question_element.id = "prevQButton";
		last_question_element.onclick = function(){changeQuestion(false)};
}

// displays the users score and quiz response

function quizCompletion(){
  var score = 0;
  var quiz_response;
	if (document.getElementById("checkValidation")){
		document.getElementById("checkValidation").parentNode.removeChild(document.getElementById("checkValidation"));
	}
	document.quiz_Form.innerHTML = "";
	document.getElementById("prevQButton").parentNode.removeChild(document.getElementById("prevQButton"));
	document.getElementById("nextQButton").parentNode.removeChild(document.getElementById("nextQButton"));
	for (var i = 0 ; i < allQuestions.length; i++){
		if(allQuestions[i].correctAnswer === user_answers[i]){
			score += 1 ;
		}
	}

	var user_score = (score / allQuestions.length) * 100;
	var userdata = JSON.parse(localStorage.user);
	var date = new Date();
	userdata.scores.push([user_score.toFixed(0),date.toLocaleString()])
	localStorage["user"] = JSON.stringify(userdata);

	document.getElementById("title").innerHTML = "Your Grade: " + user_score.toFixed(0) +"%";

	switch (user_score){
		case 0:
		case 10:
		case 20:
		case 30:
			quiz_response = document.createTextNode("You need to go back to school! ASAP!");
			break;
		case 40:
		case 50:
		case 60:
			quiz_response = document.createTextNode("Your should probably read Wikipedia more.");
			break;
		case 70:
		case 80:
			quiz_response =  document.createTextNode("Someone watches the Discovery channel on their spare time.");
			break;
		case 90:
		case 100:
			quiz_response =  document.createTextNode("You are as smart as a third grader! Congratulations!");
			break;
	};

	var quiz_responsElement = document.querySelector("h2")
	quiz_responsElement.style.display = "block";
	quiz_responsElement.appendChild(quiz_response);
	quiz_responsElement.className = "quiz-response";
	document.getElementById("buttons").innerHTML ="<div id='accessScoresButton' class='nextButton'>Access Account </div>";;
	document.getElementById("accessScoresButton").onclick = showAccountPage;
	user_answers = {};
	return;
}

// storageAvailable detects availibility of localStorage
function storageAvailable(storageType){
	try{
		var storage = window[storageType];
		var x = "__storage_test__";
		storage.setItem(x,x);
		storage.removeItem(x);
		return true;
	}
	catch (e){
		return false;
	}

}
