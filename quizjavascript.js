var questionNumber=0;
var userAnswers = {};
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

window.onload =  function(){

	document.getElementById("accountAccess").onclick = accountAccess;

	var cookieName = getCookieValue("name");
	if(cookieName){
		document.querySelector("h2").innerHTML = "Hi " + cookieName[0].toUpperCase() + cookieName.substring(1) + ", please login";
	}

};

// accountAccess shows the input fields to create an account or login

function accountAccess(e){
	if (!(e)){
		e = window.event;
	}
    var getStartedButton = "<div id='getStartedButton' class='normalButton'>Get Started</div>";
	var accesScoresButton = "<div id='accessScoresButton' class='normalButton'>Access Account </div>";
	var nameField = "<input type='text' name='name'  id='name' class='accountAccessInputs'  placeholder='Name' > "
	var usernameField = "<input type='text' name='username' class='accountAccessInputs' placeholder='Username' >";
	var passwordField = "<input type='password' name='password' class='accountAccessInputs' placeholder='Password'>";
	var passwordVerify = "<input type='password' name='passwordverify' class='accountAccessInputs' placeholder='Verify Password'>";
	if(e.target.id === "createAccountButton"){
		document.getElementById("accessFields").innerHTML = nameField + usernameField + passwordField + passwordVerify ;
		document.getElementById("actionButtons").innerHTML = getStartedButton;	
	}

	if(e.target.id === "loginButton"){
		document.getElementById("accessFields").innerHTML = usernameField + passwordField ;
		document.getElementById("actionButtons").innerHTML = getStartedButton + accesScoresButton;
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
	var startedButton = document.getElementById("getStartedButton");
	startedButton.parentNode.removeChild(startedButton);
	
	var changeQuestButtonText =  document.createTextNode("Next Question");
	var changeQuestButtonElement =  document.createElement("div");

	changeQuestButtonElement.appendChild(changeQuestButtonText);
	document.getElementById("actionButtons").appendChild(changeQuestButtonElement);
    changeQuestButtonElement.classList.add("normalButton");
    changeQuestButtonElement.id = "nextQButton";
	changeQuestion();
	
	
	changeQuestButtonElement.onclick  = function(){changeQuestion(true)};
}

// showAccountPage shows a greeting to the user, a table with the user's scores, and a button to allow user to retake the quiz

function showAccountPage(){
	if(!(accessValidation()) ){
		if(!(document.getElementById("accountAccessError")) &&  document.quizForm.username.value !== "" && document.quizForm.password.value !== ""  ){
			var loginErrorElement = document.createElement("div");
			loginErrorElement.appendChild(loginErrorText);
			loginErrorElement.classList.add("errorElement");
			loginErrorElement.id = "accountAccessError"
			document.getElementById("accessFields").appendChild(loginErrorElement);
		
		}

		return
	}
	var userData = JSON.parse(localStorage.user)
	document.querySelector("h1").innerHTML = "Hi " + userData.username  + ", welcome to your account page";
	document.querySelector("h2").innerHTML = "View your scores below";
	document.querySelector("h2").style.display="block"

	if(document.getElementById("accessFields") && document.getElementById("accountAccess")){
	document.getElementById("accessFields").parentNode.removeChild(document.getElementById("accessFields"));
	document.getElementById("accountAccess").parentNode.removeChild(document.getElementById("accountAccess"));
	}

	document.getElementById("actionButtons").innerHTML = "<div id='getStartedButton' class='normalButton'>Retake the Quiz</div>";
	document.getElementById("getStartedButton").onclick = startQuiz;
	questionNumber = 0;

	var userData = JSON.parse(localStorage.user)
	if(userData.scores.length !== 0){
		insertScores();
	}
	
}

// insertScores creates a html table which displays the users recorded scores and date/time for when the test took place

function insertScores(){
	var tableDiv = document.createElement("div");
	tableDiv.id = "scoreTable";
	var tableHTML = "<table> <tr> <th>Scores</th> <th>Date</th></tr>"

	var userData = JSON.parse(localStorage.user);
	var sortedScores = userData.scores.sort(function(a,b){
		return b[0] - a[0];
	});

	sortedScores.forEach(function(val){
		tableHTML += "<tr><td>" + val[0] + "% </td><td>" + val[1] +"</td></tr>"; 
	})

	tableHTML += "</table>";

	tableDiv.innerHTML = tableHTML;

	document.querySelector(".content").insertBefore(tableDiv,document.quizForm);
}



// changeQuestion keeps track of the current question, score ,and traverses the array to change the elements according to the question

function changeQuestion(button_type){
	if( button_type === true){
		if(!(checkRadioValidation())){
			return;
		};
	}

	if (questionNumber > 0 && button_type === false){
		questionNumber -= 1;
		if (questionNumber === 0){
			document.getElementById("previousQButton").parentNode.removeChild(document.getElementById("previousQButton"));
		}
	}

	if(questionNumber > 0){
		if(!(document.getElementById("previousQButton")) ){
			previousQButton();
		}
	}

	if(questionNumber === allQuestions.length){
		quizCompletion();
		return;
	}



	if(document.getElementById("checkRadioValidation")){
		document.getElementById("checkRadioValidation").parentNode.removeChild(document.getElementById("checkRadioValidation"));
	}

	var currentQuestion =  allQuestions[questionNumber];
	var questionText = currentQuestion.question;
	document.getElementById("title").innerHTML = questionText;
	var radioHTML = "";
	for (var i =0 ; i < currentQuestion.choices.length;i++ ){
		radioHTML += "<div class='radio-buttons'><label><input type='radio' id='" +currentQuestion.choices[i]  +"' name='radioOptions' value='" + currentQuestion.choices[i] + "'/>" + currentQuestion.choices[i] + "</label> </div>";
	}
	document.quizForm.innerHTML = radioHTML;

	if( !(isNaN(userAnswers[questionNumber])) ){
		var answerNumber = userAnswers[questionNumber];
		document.quizForm.radioOptions[answerNumber].checked =  true;
	}

	if(questionNumber === (allQuestions.length - 1)){
		document.getElementById("nextQButton").innerHTML = "Finish Quiz";
	}

	else if( document.getElementById("nextQButton").innerHTML === "Finish Quiz" && questionNumber < (allQuestions.length - 1)  ){
		document.getElementById("nextQButton").innerHTML  = "Next Question";
	}

}

// previousQButton adds the last question button to the DOM

function previousQButton(){
		var lastQuesitonText = document.createTextNode("Previous Question");
		var lastQuestionElement = document.createElement("div");
		lastQuestionElement.appendChild(lastQuesitonText);
		document.getElementById("actionButtons").insertBefore(lastQuestionElement,document.getElementById("nextQButton"));
		lastQuestionElement.classList.add("normalButton");
		lastQuestionElement.id = "previousQButton";
		lastQuestionElement.onclick = function(){changeQuestion(false)};
}

// accessValidation detects whether the login and account creation fields have been given values and match the localStorage values

function accessValidation(){
	var quizFields = document.quizForm;
	for(var i = 0; i < quizFields.length;i++){
		var currentField = quizFields[i];

		if(currentField.name === "name" && currentField.value === ""){
			if(!(document.getElementById("nameError"))){
				var enterNameErrorText = document.createTextNode("Please enter your name");
				var enterNameElement = document.createElement("div");
				enterNameElement.appendChild(enterNameErrorText);
				enterNameElement.classList.add("errorElement");
				enterNameElement.id = 'nameError';
				document.getElementById("accessFields").insertBefore(enterNameElement,document.quizForm.name);
			}
			return false;
			
		}

		if(currentField.name === "username" && currentField.value === ""){
				if( !(document.getElementById("usernameError")) && !(document.getElementById("accountAccessError")) ){
					var enterUsernameErrorText = document.createTextNode("Please enter a valid username");
					var enterUsernameErrorElement = document.createElement("div");
					enterUsernameErrorElement.appendChild(enterUsernameErrorText);
					enterUsernameErrorElement.classList.add("errorElement");
					enterUsernameErrorElement.id = "usernameError";
					document.getElementById("accessFields").insertBefore(enterUsernameErrorElement,document.quizForm.username);
				}
				return false;
				
		}

		if(currentField.name === "password" && currentField.value === ""){
			if( !(document.getElementById("userpasswordError")) ){
				var enterPasswordText = document.createTextNode("Please enter your password");
				var enterPasswordErrorElement =  document.createElement("div");
				enterPasswordErrorElement.appendChild(enterPasswordText);
				enterPasswordErrorElement.classList.add("errorElement");
				enterPasswordErrorElement.id = "userpasswordError";
				document.getElementById("accessFields").insertBefore(enterPasswordErrorElement,document.quizForm.password);
			}
			return false;
			
			
		}

		if(currentField.name === "passwordverify" && currentField.value === ""){
			if(!(document.getElementById("userverifypasswordError"))){
				var verifyPasswordText = document.createTextNode("Please re-enter your desired password");
				var verifyPasswordElement = document.createElement("div");
				verifyPasswordElement.appendChild(verifyPasswordText);
				verifyPasswordElement.classList.add("errorElement");
				verifyPasswordElement.id = "userverifypasswordError";
				document.getElementById("accessFields").insertBefore(verifyPasswordElement,document.quizForm.passwordverify);
			}
			return false;
			
		}
	}
	
	if(document.quizForm.length === 4 && storageAvailable("localStorage")){
			if(document.quizForm.password.value !== document.quizForm.passwordverify.value ){
				if(!(document.getElementById("passwordMatchError"))){
					var passwordMatchErrorText = document.createTextNode("Your password and repeated password do not match");
					var passwordMatchErrorElement = document.createElement("div");
					passwordMatchErrorElement.appendChild(passwordMatchErrorText);
					passwordMatchErrorElement.classList.add("errorElement");
					passwordMatchErrorElement.id = "passwordMatchError";
					document.getElementById("accessFields").appendChild(passwordMatchErrorElement);
				}
				return false;
			}

			localStorage.clear();
			var user = {};
			user["username"] = document.quizForm.username.value;
			user["password"] = document.quizForm.passwordverify.value;
			user["scores"] = [];
			localStorage["user"] = JSON.stringify(user);

			setCookie("name",document.quizForm.name.value,"","/")
		
	}

	else if(document.quizForm.length === 2 && storageAvailable("localStorage")){
		var userLocalStorage = JSON.parse(localStorage.user)
		if (document.quizForm.username.value !== userLocalStorage.username || document.quizForm.password.value !== userLocalStorage.password ){
			if(!(document.getElementById("accountAccessError")) ){
				var loginErrorText = document.createTextNode("Your username or password is incorrect");
				var loginErrorElement = document.createElement("div");
				loginErrorElement.appendChild(loginErrorText);
				loginErrorElement.classList.add("errorElement");
				loginErrorElement.id = "accountAccessError";
				document.getElementById("accessFields").appendChild(loginErrorElement);
			}
			return false;
		}
	}


	return true;
}

// checkRadioValidation checks to see if a user has answered the question

function checkRadioValidation(){
	if ( detectFormChange() ){
			questionNumber += 1;
			return true;
	}

	if (document.getElementById("checkRadioValidation")){
		return false;
	}
	
	var radioErrorText = document.createTextNode("You can't move forward without answering a question.");
	var radioErrorElement = document.createElement("div");
	radioErrorElement.classList.add("errorElement","errorElementWidth");
	radioErrorElement.id = "checkRadioValidation";
	var contentElement =  document.getElementsByClassName("content")[0];
	var form = document.quizForm;
	radioErrorElement.appendChild(radioErrorText);
	contentElement.insertBefore(radioErrorElement,form);
	return false;

	
}

// detectFormChange detects whether the a radio option has been selected

function detectFormChange(){
	var radioOptions = document.quizForm.radioOptions;
	for(var i = 0; i < radioOptions.length; i++){
		if(document.quizForm.radioOptions[i].checked === true){
			userAnswers[questionNumber] = i;
			return true;
		}
	}
	return false;

}

// displays the users score and quiz response

function quizCompletion(){
  var score = 0;
  var quizResponse;
	if (document.getElementById("checkRadioValidation")){
		document.getElementById("checkRadioValidation").parentNode.removeChild(document.getElementById("checkRadioValidation"));
	}
	document.quizForm.innerHTML = "";
	document.getElementById("previousQButton").parentNode.removeChild(document.getElementById("previousQButton"));
	document.getElementById("nextQButton").parentNode.removeChild(document.getElementById("nextQButton"));
	for (var i = 0 ; i < allQuestions.length; i++){
		if(allQuestions[i].correctAnswer === userAnswers[i]){
			score += 1 ;
		}
	}

	var userScore = (score / allQuestions.length) * 100;
	var userData = JSON.parse(localStorage.user);
	var date = new Date();
	userData.scores.push([userScore.toFixed(0),date.toLocaleString()])
	localStorage["user"] = JSON.stringify(userData);

	document.getElementById("title").innerHTML = "Your Grade: " + userScore.toFixed(0) +"%";

	switch (userScore){
		case 0:
		case 10:
		case 20:
		case 30:
			quizResponse = document.createTextNode("You need to go back to school! ASAP!");
			break;
		case 40:
		case 50:
		case 60:
			quizResponse = document.createTextNode("Your should probably read Wikipedia more.");
			break;
		case 70:
		case 80:
			quizResponse =  document.createTextNode("Someone watches the Discovery channel on their spare time.");
			break;
		case 90:
		case 100:
			quizResponse =  document.createTextNode("You are as smart as a third grader! Congratulations!");
			break;
	};

	var quizResponsElement = document.querySelector("h2")
	quizResponsElement.style.display = "block";
	quizResponsElement.appendChild(quizResponse);
	quizResponsElement.className = "quizResponse";
	document.getElementById("actionButtons").innerHTML ="<div id='accessScoresButton' class='normalButton'>Access Account </div>";;
	document.getElementById("accessScoresButton").onclick = showAccountPage;
	userAnswers = {};
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

// setCookie sets the cookie

function setCookie(cookieName,cookieValue,cookieExpires,cookiePath){
	cookieValue = encodeURIComponent(cookieValue);
	if( cookieExpires ==="" ){
		var nowDate = new Date();
		nowDate.setMonth(nowDate.getMonth() + 6);
		cookieExpires = nowDate.toGMTString();
	}

	if (cookiePath !== ""){
		cookiePath = ";Path=" + cookiePath;
	}

	document.cookie = cookieName + "=" + cookieValue + ";expires=" + cookieExpires + cookiePath;
}

// getCookieValue returns the value of a name - value pair

function getCookieValue(cookieName){
	var cookieValue =  document.cookie;
	var cookieStartsAt = cookieValue.indexOf(" " + cookieName + "=");

	if (cookieStartsAt === -1){
		cookieStartsAt =  cookieValue.indexOf(cookieName + "=");
	}

	if (cookieStartsAt === -1){
		return null;
	}

	else{
		var cookieValueStart = cookieValue.indexOf("=",cookieStartsAt) + 1;
		var cookieValueEnd = cookieValue.indexOf(";",cookieStartsAt);
		if (cookieValueEnd === -1){
			cookieValueEnd = cookieValue.length;
		}

		cookieValue = decodeURIComponent(cookieValue.substring(cookieValueStart,cookieValueEnd));

	}

	return cookieValue;

}
