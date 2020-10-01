function switch_to_0(){
	$("#mode0").addClass("active");
	$("#mode1").removeClass("active");
	$("iframe.main").attr("src", "game.html");
}
function switch_to_1(){
	$("#mode0").removeClass("active");
	$("#mode1").addClass("active");
	$("iframe.main").attr("src", "editor.html");
}
