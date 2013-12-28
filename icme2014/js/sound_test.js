$(document).ready(function() {
	$("#check_input").keydown(function() {
		if (event.keyCode === 13) checkSubmit();
	});
});

function checkSubmit() {
	if ($("#check_input").val() === "fish") window.location.replace("survey.html");
	else alert("Please enter the word from the sound clip.");
}

