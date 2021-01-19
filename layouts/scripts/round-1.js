class User {
  constructor(firstName, lastName, emailaddress, password, question, answer) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.emailaddress = emailaddress;
    this.password = password;
    this.question = question;
    this.answer = answer;
  }
}

class Blog {
	constructor(emailaddress, blogContent) {
		this.emailaddress = emailaddress;
		this.blogContent = blogContent;
	}	
}

var previousData= null;
var changePswdData = null


function navigation(data){
	if(data != previousData){
		$('#'+previousData).hide();
		$('#'+data).show();
	}	
	previousData = data;
	if(data == 'blog'){
		loadUserPreference();
	}else if(data == 'forgetPassword'){
		$("#forgetPwdform")[0].reset();
		$("#forgetPwdform")[0].elements["inputEmail"].removeAttribute("readonly");
		$("#forgetPwdform")[0].elements["inputAnswer"].removeAttribute("readonly");
		$(".changePassword").css("display", "none");
		$(".securityQuestion").css("display", "none");
	}
	
}

function saveUser(form){
	var newUser = new User(form.elements["inputFirstName"].value, form.elements["inputLastName"].value, form.elements["inputEmail"].value, form.elements["inputPassword"].value, form.elements["inputQuestion"].value, form.elements["inputAnswer"].value);
	var entireUserString = localStorage.getItem("userList");
	var isSave = false;
	var entireUserList = null;
	if(null == entireUserString){
		entireUserList = [];
		isSave = true;
	}else{
		entireUserList = JSON.parse(entireUserString);
		var isExists = checkUserExists(entireUserList, newUser);
		if(isExists != null){
			showAlert("failure", "User already Exists");
		}else{
			isSave = true;
		}		
	}
	if(isSave){
		entireUserList.push(newUser);
		localStorage.setItem("userList", JSON.stringify(entireUserList));
		showAlert("success", "User Successfully Saved, Please SignIn to continue...");
		$("#signUpform")[0].reset();
		navigation('signIn')
	}	
}

function loginUser(form){
	var newUser = new User(null, null, form.elements["inputEmail"].value, form.elements["inputPassword"].value, null, null);
	var result = checkCredentailsExists(newUser);
	if(result != null){
		sessionStorage.setItem("userInfo", JSON.stringify(result));
		showAlert("success", "Successfully Logged IN");
		$("#userName").html(result["firstName"] + " " + result["lastName"] );
		$("#userOptions").html("<a class='dropdown-item' href='#' onclick='navigation("+'"underConstruction"'+")'>My Profile</a> <a class='dropdown-item' href='#' onclick='signout()'>Sign Out</a>");
		navigation('home');		
	}else{
		showAlert("failure", "Credentials are invalid");
	}
	$("#signInform")[0].reset();
}

function signout(){
	sessionStorage.removeItem("userInfo");
	$("#userName").html("Admin");
	$("#userOptions").html("<a class='dropdown-item' href='#' onclick='navigation("+'"signIn"'+")'>Sign In</a> <a class='dropdown-item' href='#' onclick='navigation("+'"signUp"'+")'>Sign Up</a>");
	showAlert("success", "Successfully Signed Out");
	navigation('home');
}

function ChangePassword(form){
	var newUser = new User(null, null, form.elements["inputEmail"].value, null, null, form.elements["inputAnswer"].value);
	
	var emailAttr = form.elements["inputEmail"].getAttribute("readonly");
	if(emailAttr == "readonly"){
		var questionAttr = form.elements["inputAnswer"].getAttribute("readonly");
		if(questionAttr == "readonly"){
			if(form.elements["inputPassword"].value != null && form.elements["inputPassword"].value.length>0){
				//Change pswd
				changePswdData["password"] = form.elements["inputPassword"].value;
				var entireUserList = JSON.parse(localStorage.getItem("userList"));
				for(var i=0; i<entireUserList.length; i++){
					if(entireUserList[i]["emailaddress"].toLowerCase() == changePswdData["emailaddress"].toLowerCase()){
						entireUserList[i]["password"] = changePswdData["password"];
						break;
					}		
				}
				localStorage.setItem("userList", JSON.stringify(entireUserList));
				showAlert("success", "Password Successfully Changed");
				navigation('signIn');				
				$("#forgetPwdform")[0].reset();
				form.elements["inputEmail"].removeAttribute("readonly");
				form.elements["inputAnswer"].removeAttribute("readonly");
				$(".changePassword").css("display", "none");
				$(".securityQuestion").css("display", "none");
				
			}else{
				showAlert("failure", "Please Provide New Password");
			}
			
		}else{
			if(form.elements["inputAnswer"].value != null && form.elements["inputAnswer"].value.length>0){
				if(changePswdData["answer"] == form.elements["inputAnswer"].value){
					form.elements["inputAnswer"].setAttribute("readonly", "readonly");
					$(".changePassword").css("display", "block");
				}else{
					showAlert("failure", "Please Provide valid Security Answer, Security Answer doesn't match with the records");
				}				
			}else{
				showAlert("failure", "Please Provide Security Answer");
			}
		}
	}else{
		var entireUserString = localStorage.getItem("userList");
		if(entireUserString != null){
			var entireUserList = JSON.parse(entireUserString);
			var isExists = checkUserExists(entireUserList, newUser);
			if(isExists != null){
				form.elements["inputEmail"].setAttribute("readonly", "readonly");
				$(".securityQuestion").css("display", "block");
				$("#securityQuestion").html(isExists["question"]);
				changePswdData = isExists;
			}else{
				showAlert("failure", "Email doesnt exist, Please register.!!");
			}
		}else{
			showAlert("failure", "Email doesnt exist, Please register.!!");
		}
	}
}


function checkUserExists(entireUserList, newUser){	
	for(var i=0; i<entireUserList.length; i++){
		if(entireUserList[i]["emailaddress"].toLowerCase() == newUser["emailaddress"].toLowerCase()){
			return entireUserList[i]
		}		
	}
	return null;
}

function checkCredentailsExists(newUser){
	var entireUserString = localStorage.getItem("userList");
	if(entireUserString != null){
		var entireUserList = JSON.parse(entireUserString);
		for(var i=0; i<entireUserList.length; i++){
			if(entireUserList[i]["emailaddress"].toLowerCase() == newUser["emailaddress"].toLowerCase() && entireUserList[i]["password"] == newUser["password"]){
				return entireUserList[i];
			}		
		}
	}
	return null;
}

function showAlert(model, alert){
	if(model == "success"){
		//$("#successContent").innerhtml = alert;
		$("#successContent").html(alert);
		$("#success-alert").fadeTo(2000, 500).slideUp(500, function() {
		      $("#success-alert").slideUp(500);
		});
	}else if(model == "failure"){
		$("#failedContent").html(alert);
		$("#failure-alert").fadeTo(2000, 500).slideUp(500, function() {
		      $("#failure-alert").slideUp(500);
		});
	}
	 
}

function checkSessionStorage(){
	var sessionValueString = sessionStorage.getItem("userInfo");
	if(sessionValueString != null){
		var sessionValue = JSON.parse(sessionValueString);
		$("#userName").html(sessionValue["firstName"] + " " + sessionValue["lastName"] );
		$("#userOptions").html("<li><a class='dropdown-item' href='#' onclick='navigation("+'"underConstruction"'+")'>My Profile</a></li> <li><a class='dropdown-item' href='#' onclick='signout()'>Sign Out</a></li>");
		
	}else{
		$("#userName").html("Admin");
		$("#userOptions").html("<li><a class='dropdown-item' href='#' onclick='navigation("+'"signIn"'+")'>Sign In</a></li> <li><a class='dropdown-item' href='#' onclick='navigation("+'"signUp"'+")'>Sign Up</a></li>");

	}
	
}

setTimeout(() => {
	navigation('home');
	$("#success-alert").hide();
	$("#failure-alert").hide();
	checkSessionStorage();	
}, 10);


function loadUserPreference(){
	var sessionValueString = sessionStorage.getItem("userInfo");
	if(sessionValueString != null){
		var text = null;
		var sessionValue = JSON.parse(sessionValueString);
		var blogUserString = localStorage.getItem("blogList");
		if(blogUserString != null){
			var blogUserList = JSON.parse(blogUserString);
			for(var i=0; i<blogUserList.length; i++){
				if(blogUserList[i]["emailaddress"].toLowerCase() == sessionValue["emailaddress"].toLowerCase()){
					text = blogUserList[i]["blogContent"];
					break;
				}		
			}
		}
		if(text == null){
			text = "<div class='text-right'><h1>Hello "+sessionValue["firstName"] + " " + sessionValue["lastName"] +"</h1> - ["+sessionValue["emailaddress"] +"] </div>";
			text += "<div class='text-right'> Click on upload to save the content <span> <input type='button' class ='btn btn-success' value='Upload' onClick=saveBlog()> <span> </div>";
			text += "<h1 class='contentUpdated' contentEditable='true'>Favoutite Dish at our Restaurant</h1>";
			text += "<p class='contentUpdated' contentEditable='true'>Your valuable Comments-1</p> <br>";
			text += "<p class='contentUpdated' contentEditable='true'>Your valuable Comments-2</p> <br>";
			text += "<p><strong>Note:</strong> Click on the elements and type your choice and favourite.</p>";
		}		
		$("#blogObjectContent").html(text);			    
	}else{
		$("#blogObjectContent").html("<h2 class='signInNotice'> Sorry for the inconvenience, Please SignIn and create your custom blog </h2>");
	}
}

function saveBlog(){
	var sessionValueString = sessionStorage.getItem("userInfo");
	if(sessionValueString != null){
		var sessionValue = JSON.parse(sessionValueString);	
		var newBlog = new Blog(sessionValue["emailaddress"], $("#blogObjectContent").html());
		var isUpdate = false;
		var blogUserString = localStorage.getItem("blogList");
		if(blogUserString != null){
			var blogUserList = JSON.parse(blogUserString);
			for(var i=0; i<blogUserList.length; i++){
				if(blogUserList[i]["emailaddress"].toLowerCase() == sessionValue["emailaddress"].toLowerCase()){
					blogUserList[i]["blogContent"] = $("#blogObjectContent").html();
					isUpdate = true;
					break;
				}		
			}
			if(!isUpdate){
				blogUserList.push(newBlog);
			}
		}else{
			var blogUserList = [];			
			blogUserList.push(newBlog);
		}
		localStorage.setItem("blogList", JSON.stringify(blogUserList));
		showAlert("success", "Successfully Saved blog...");
		    
	}else{
		$("#blogObjectContent").html("<h2 class='blinktext'> Sorry for the inconvenience, Please SignIn and create your custom blog </h2>");
	}

}
