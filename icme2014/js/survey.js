function checkSubmit() {
	var checkNames = {
		"gender" : "Please fill in gender.",
		"age" : "How old are you?",
		"education" : "Do you have music education?",
		"listening" : "How often do you listen to music?",
		"genre_rock" : "What's your preference to rock music?",
		"genre_metal" : "What's your preference to metal music?",
		"genre_country" : "What's your preference to country music?",
		"genre_jazz" : "What's your preference to jazz music?",
		"genre_pop" : "What's your preference to pop music?",
		"genre_classical" : "What's your preference to classical music?",
		"genre_blues" : "What's your preference to blues music?",
		"genre_hiphop" : "What's your preference to hiphop music?",
		"genre_electronic" : "What's your preference to electronic music?",
		"genre_raggae" : "What's your preference to raggae music?",
		"genre_dance" : "What's your preference to dance music?"
	};

	var canSubmit = true;
	$.each(checkNames, function(key, value) {
		if (key === "age") {
			var age = parseInt($("input[name=\"age\"]").val());
			if (isNaN(age)) {
				alert(value);
				canSubmit = false;
				return false;
			}
			else if (age < 18 || age > 99) {
				alert("You should be at least 18 years old or under 99 years old to participate this HIT. Please check your age.");
				canSubmit = false;
				return false;
			}
		}
		else {
			if ($("input[name=\"" + key + "\"]:checked").length === 0) {
				alert(value);
				canSubmit = false;
				return false;
			}
		}
	});

	if (canSubmit) window.location.replace("experiment.html");
} 
