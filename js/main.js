var fade_time = 200;	// (ms)

$(document).ready(function() {
	setContainer("home");

	$("a[class^=myNav-]").click(function() {
		if ($(".navbar-toggle").is(":visible")) $(".navbar-toggle").click();
	});

	$("#wrap").click(function() {
		if ($(".navbar-toggle").is(":visible") && $(".navbar-collapse").is(":visible")) $(".navbar-toggle").click();
	});
});

function setContainer(page) {
	$("a[class^=myNav-]").parent().removeClass("active");
	$(".myNav-" + page).parent().addClass("active");
	$.ajax("html/" + page + ".html").done(function(html) {
		$("#container").fadeOut(fade_time, function() {
			$("#container").html(html).fadeIn(fade_time);
		});
	});
}
