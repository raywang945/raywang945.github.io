var is_english;
var is_sort;
var limit = 50;

$(document).ready(function() {
	is_english = getUrlGetByName("lang") === "english";
	is_sort = getUrlGetByName("is_sort") === "true";

	// TODO
	$("#show_button").addClass("hide");
	$("p.text-info").addClass("hide");
	// TODO

	$("#password").keydown(function() {
		if (($("h2").text() === "Please sign in" || $("h2").text() === "請登入") && event.keyCode === 13) login();
	});
});

function login() {
	var username = $("#username").val();
	var password = $("#password").val();
	$.post("php/account.php", { mode: "login", username: username, password: password }, function(data) {
		switch(data) {
			case "no username":
				if (is_english) alert("The username you entered does not exist, please create a new account to sign in.");
				else alert("您輸入的帳號不存在，請申請一個新的帳號。");
				break;
			case "password error":
				if (is_english) alert("Wrong password.");
				else alert("密碼錯誤。");
				break;
			case "all done":
				if (is_english) alert("You have done all " + limit + " songs.");
				else alert("您已標記完" + limit + "首歌了。");
				break;
			case "success":
				document.nextForm.action = "./?username=" + username;
				if (is_english) document.nextForm.action += "&lang=english";
				if (is_sort) document.nextForm.action += "&is_sort=true";
				document.nextForm.submit();
				break;
			default:
				console.log("account return error: " + data);
				break;
		}
	});
}

function showCreateAccount() {
	$("h2").text(is_english ? "申請帳號" : "Create an account");
	$("#username").focus().val('');
	$("#password").val('');
	$("#retype").removeClass("hide").val('');
	$("p").addClass("hide");
	$("#login_button").addClass("hide");
	$("#show_button").addClass("hide");
	$("#create_button").removeClass("hide");
	$("a").removeClass("hide");
}

function createAccount() {
	var username = $("#username").val();
	if (username.length === 0) {
		if (is_english) alert("Please enter username.");
		else alert("請輸入帳號。");
		return ;
	}
	var password = $("#password").val();
	var retype = $("#retype").val();
	if (password !== retype) {
		if (is_english) alert("Two passwords are not the same.");
		else alert("兩組密碼不相同。");
		return ;
	}
	if (password.length === 0) {
		if (is_english) alert("Please enter password.");
		else alert("請輸入密碼。");
		return ;
	}
	$.post("php/account.php", { mode: "create", username: username, password: password }, function(data) {
		if (data === "error") {
			if (is_english) alert("This username is already registered, please enter another username.");
			else alert("此帳號已被註冊，請輸入新的帳號。");
		}
		else if (data === "finished") {
			document.nextForm.action = "./?username=" + username;
			if (is_english) document.nextForm.action += "&lang=english";
			if (is_sort) document.nextForm.action += "&is_sort=true";
			document.nextForm.submit();
		}
	});
}

function cancel() {
	$("h2").text(is_english ? "Please sign in" : "請登入");
	$("#username").focus().val('');
	$("#password").val('');
	$("#retype").addClass("hide").val('');
	$("p").removeClass("hide");
	$("#login_button").removeClass("hide");
	$("#show_button").removeClass("hide");
	$("#create_button").addClass("hide");
	$("a").addClass("hide");
}
