var question_number=0;
var user_answers = {};
var change_questButtonElement;
var last_question_element;
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

//statQuiz function removes the initial text and begins to add the Next button

function startQuiz(){
	var started_Button = document.getElementById("getStartedButton");
	started_Button.parentNode.removeChild(started_Button);
	
	var change_questButtonText =  document.createTextNode("Next Question");
	change_questButtonElement =  document.createElement("div");

	change_questButtonElement.appendChild(change_questButtonText);
	document.getElementById("buttons").appendChild(change_questButtonElement);

	changeQuestion();
	
	change_questButtonElement.className = "nextButton";
	change_questButtonElement.onclick  = function(){changeQuestion(true)};
	document.quiz_Form.onclick = function(){detectFormChange();};
	
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
		if(!(document.getElementsByClassName("nextButton")[0].innerHTML === "Last Question") ){
			lastQButton();
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
		radio_html += "<div class='radio-buttons'><input type='radio' id='" +current_question.choices[i]  +"' name='radio_options' value='" + current_question.choices[i] + "'/>"+ "<label for='"+ current_question.choices[i]+ "'>" +current_question.choices[i] + "</label> </div>";
	}
	document.quiz_Form.innerHTML = radio_html;

	if( !(isNaN(user_answers[question_number])) ){
		var answer_number = user_answers[question_number];
		document.quiz_Form.radio_options[answer_number].checked =  true;
	}

	if(question_number === (allQuestions.length - 1)){
		change_questButtonElement.innerHTML = "Finish Quiz";
	}

	else if( change_questButtonElement.innerHTML === "Finish Quiz" && question_number < (allQuestions.length -1)  ){
		change_questButtonElement.innerHTML  = "Next Question";
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

// adds the last question button to the DOM

function lastQButton(){
		var last_question_text = document.createTextNode("Last Question");
		last_question_element = document.createElement("div");
		last_question_element.appendChild(last_question_text);
		document.getElementById("buttons").insertBefore(last_question_element,change_questButtonElement);
		last_question_element.className = "nextButton";
		last_question_element.onclick = function(){changeQuestion(false)};
}

// displays the users score and quiz response

function quizCompletion(){
  var score = 0;
  var quiz_response;
	if (document.getElementById("checkValidation")){
		document.getElementById("checkValidation").parentNode.removeChild(document.getElementById("checkValidation"));
	}
	document.quiz_Form.parentNode.removeChild(quiz_Form);
	last_question_element.parentNode.removeChild(last_question_element);
	change_questButtonElement.parentNode.removeChild(change_questButtonElement);
	for (var i = 0 ; i < allQuestions.length; i++){
		if(allQuestions[i].correctAnswer === user_answers[i]){
			score += 1 ;
		}
	}

	var user_score = (score / allQuestions.length) * 100;
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

	var quiz_responsElement = document.createElement("div");
	quiz_responsElement.appendChild(quiz_response);
	quiz_responsElement.className = "quiz-response";
	document.getElementsByClassName("content")[0].appendChild(quiz_responsElement);
	return;
}
