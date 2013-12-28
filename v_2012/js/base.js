// variables
var fade_time = 250;	// (ms)

window.onload = function() {
	changePage(document.getElementById("home"));
}

function changePage(clickPage) {
	setColumnStyle(clickPage);

	var xmlhttp;
	if (window.XMLHttpRequest) {
		xmlhttp = new XMLHttpRequest();
	}
	else {
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			$("#content").fadeOut(fade_time, function() {
				document.getElementById("content").innerHTML = xmlhttp.responseText;
				$("#content").fadeIn(fade_time);
			});
		}
	}
	xmlhttp.open("GET", "html/" + clickPage.id + ".html", true);
	xmlhttp.send();
}

function setColumnStyle(clickPage) {
	$("li a").css({
		"background" : "#809900",
		"color" : "white"
	});
	$("li a").hover(
		function () {
			$(this).css({
				"color" : "#4C7300",
				"background" : "#EFF2DF"
			});
		},
		function () {
			$(this).css({
				"color" : "white",
				"background" : "#809900"
			});
		}
	);
	$(clickPage).css({
		"color" : "#4C7300",
		"background" : "#EFF2DF"
	});
	$(clickPage).unbind("mouseenter mouseleave");
}
