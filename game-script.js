function playsound(path){
	setTimeout(function(path){
		new Audio(path).play();
	}, 0, path);
}
if(Cookies.get("-candyquad-stars") == undefined) Cookies.set("-candyquad-stars", "0");
var keysPressed = {
	left: false,
	right: false,
	up: false,
	down: false
};
var block_types = {
	"has_collision": [
		"0001", "0010", "0011", "0100", "0101", "0110", "0111", "1000", "1001", "1010", "1011", "1100", "1101", "1110", "1111", "FULL", "PRP0"],
	"has_no_collision": [
		"STRT", "FNSH", "NONE", "0000", "EDG0", "EDG1", "EDG2", "EDG3", "SPK0", "SPK1", "SPK2", "SPK3", "LSVE", "LSHO", "LSBO", "PRP1", "SAWX", "STRN", "STR0"],
	"death": [
		"SPK0", "SPK1", "SPK2", "SPK3", "SAWX", "PRP0"],
	"animated": [
		"SAWX", "STRN", "STR0"],
	"custom": []
},
player = {
	"x": 0,
	"y": 0
},
level = null,
time,
ttt = setTimeout(function(){}, 0),
custom_obj = {},
lasers = [],
is_official_level = false,
se_t,
lstlas = 0,
stars = Number(Cookies.get("-candyquad-stars")),
pre_laser,
off_lvl_n = 1;
sm = true,
musicTimeout = null,
music = null;
function play(input){
	level = input.level;
	se_t = 0;
	level_w = input.properties.width;
	level_h = input.properties.height;
	$("#file").animate({"opacity": 0}, 500);
	$("#xTxt").animate({"opacity": 0}, 500);
	$("#olid").animate({"opacity": 0}, 500);
	$("#xBtn").animate({"opacity": 0}, 500);
	$("b.hint").animate({"opacity": 0}, 2500);
	$("i.lvlinfo").text(input.properties.artist + " - " + input.properties.name);
	if(input.properties.hint != "") $("i.lvlinfo").text($("i.lvlinfo").text() + "  |  " + input.properties.hint);
	setTimeout(function(){
		$("i.lvlinfo").text("");
	}, 5000);
	musicTimeout = setTimeout(function(){
		music = new Audio(input.properties.song);
		music.play();
		setTimeout(function(){
			music.onended = function(){
				$("#field").empty();        clearTimeout(ttt);
				for(var i = 0; i < lasers.length; i++){ try{ clearTimeout(lasers[i]); } catch(e){ clearInterval(lasers[i]); }}
				clearInterval(pre_laser);
				$("b.starcount").text("Stars: " + stars);
				readFile(is_official_level, off_lvl_n);
			};
		}, 0);
	}, 0);
	for(var i = 0; i < input.custom.length; i++){
		block_types.custom.push(input.custom[i][0]);
		if(input.custom[i][1]) block_types.has_collision.push(input.custom[i][0]);
		else block_types.has_no_collision.push(input.custom[i][0]);
		if(input.custom[i][2]) block_types.death.push(input.custom[i][0]);
		custom_obj[input.custom[i][0]] = input.custom[i][3];
	}
	for(var x = 0; x < level_h; x++)
		for(var y = 0; y < level_w; y++)
			if(level[x][y] != "NONE"){
				if(block_types.custom.includes(level[x][y])) $("#field").append("<img src=\"" + custom_obj[level[x][y]] + "\" class=\"block x" + x + "y" + y + "\" style=\"top: " + x * 48 + "px;left: " + y * 48 + "px\">");
				else if(block_types.animated.includes(level[x][y])) $("#field").append("<img src=\"tiles/" + level[x][y] + ".gif\" class=\"block x" + x + "y" + y + "\" style=\"top: " + x * 48 + "px;left: " + y * 48 + "px\">");
				else $("#field").append("<img src=\"tiles/" + level[x][y] + ".png\" class=\"block x" + x + "y" + y + "\" style=\"top: " + x * 48 + "px;left: " + y * 48 + "px\">");
				if(level[x][y] == "STRT"){
					$("#player").css("top", x * 48);
					$("#player").css("left", y * 48);
					$("#player").animate({"opacity": 1}, 500);
					player.x = x;
					player.y = y;
				}
			}
	for(var i = 0; i < input.lasers.length; i++){
		if(input.lasers[i][2]){
			lasers.push(setInterval(function(x, y, m, s){
				lstlas++;
				$("#field").append("<img src=\"etc/LS" + m + ".png\" style=\"position: absolute; top: -" + (672 - (y * 48) - 24).toString() + "px; left: -" + (1152 - (x * 48) - 24).toString() + "px\" id=\"laser" + lstlas + "\" class=\"laser\">");
				$("#laser" + lstlas).animate({"opacity": 0}, 500);
				if(s) playsound("etc/laser.wav");
				if((m == "HO" || m == "BO") && player.x == y){
					death_effect(player.y, player.x);
					playsound("etc/death.wav");
					for(var x = 0; x < level.length; x++)
						for(var y = 0; y < level[x].length; y++)
							if(level[x][y] == "STRT"){
								$("#player").css("top", x * 48);
								$("#player").css("left", y * 48);
								player.x = x;
								player.y = y;
							}
				}
				else if((m == "VE" || m == "BO") && player.y == x){
					death_effect(player.y, player.x);
					playsound("etc/death.wav");
					for(var x = 0; x < level.length; x++)
						for(var y = 0; y < level[x].length; y++)
							if(level[x][y] == "STRT"){
								$("#player").css("top", x * 48);
								$("#player").css("left", y * 48);
								player.x = x;
								player.y = y;
							}
				}
				else if(player.x == y && player.y == x){
					death_effect(player.y, player.x);
					playsound("etc/death.wav");
					for(var x = 0; x < level.length; x++)
						for(var y = 0; y < level[x].length; y++)
							if(level[x][y] == "STRT"){
								$("#player").css("top", x * 48);
								$("#player").css("left", y * 48);
								player.x = x;
								player.y = y;
							}
				}
			}, input.lasers[i][3], input.lasers[i][0], input.lasers[i][1], input.lasers[i][4], input.lasers[i][5]));
		} else {
			lasers.push(setTimeout(function(x, y, m, s){
				lstlas++;
				$("#field").append("<img src=\"etc/LS" + m + ".png\" style=\"position: absolute; top: -" + (672 - (y * 48) - 24).toString() + "px; left: -" + (1152 - (x * 48) - 24).toString() + "px\" id=\"laser" + lstlas + "\" class=\"laser\">");
				$("#laser" + lstlas).animate({"opacity": 0}, 500);
				if(s) playsound("etc/laser.wav");
				if((m == "HO" || m == "BO") && player.x == y){
					death_effect(player.y, player.x);
					playsound("etc/death.wav");
					for(var x = 0; x < level.length; x++)
						for(var y = 0; y < level[x].length; y++)
							if(level[x][y] == "STRT"){
								$("#player").css("top", x * 48);
								$("#player").css("left", y * 48);
								player.x = x;
								player.y = y;
							}
				}
				else if((m == "VE" || m == "BO") && player.y == x){
					death_effect(player.y, player.x);
					playsound("etc/death.wav");
					for(var x = 0; x < level.length; x++)
						for(var y = 0; y < level[x].length; y++)
							if(level[x][y] == "STRT"){
								$("#player").css("top", x * 48);
								$("#player").css("left", y * 48);
								player.x = x;
								player.y = y;
							}
				}
				else if(player.x == y && player.y == x){
					death_effect(player.y, player.x);
					playsound("etc/death.wav");
					for(var x = 0; x < level.length; x++)
						for(var y = 0; y < level[x].length; y++)
							if(level[x][y] == "STRT"){
								$("#player").css("top", x * 48);
								$("#player").css("left", y * 48);
								player.x = x;
								player.y = y;
							}
				}
			}, input.lasers[i][3], input.lasers[i][0], input.lasers[i][1], input.lasers[i][4], input.lasers[i][5]));
		}
	}
	time = 0;
	pre_laser = setInterval(function(input){
		setTimeout(function(){
			time += 50;
			for(var i = 0; i < input.length; i++)
				if(!input[i][2] && time == input[i][3] - 700){
					$("#field").append("<img src=\"etc/LS" + input[i][4] + ".png\" style=\"position: absolute; top: -" + (672 - (input[i][1] * 48) - 24).toString() + "px; left: -" + (1152 - (input[i][0] * 48) - 24).toString() + "px\" class=\"laser pre lapr" + time + "\">");
					setTimeout(function(time){
						$(".lapr" + time).remove();
					}, 700, time);
				}else if(input[i][2] && time % input[i][3] == input[i][3] - 700){
					$("#field").append("<img src=\"etc/LS" + input[i][4] + ".png\" style=\"position: absolute; top: -" + (672 - (input[i][1] * 48) - 24).toString() + "px; left: -" + (1152 - (input[i][0] * 48) - 24).toString() + "px\" class=\"laser pre lapr" + time + "\">");
					setTimeout(function(time){
						$(".lapr" + time).remove();
					}, 700, time);
				}
		}, 0);
	}, 50, input.lasers);
	console.log("Loaded level: ");
	console.log(input);
}
var pressed = (key) => keysPressed[key];
var oln;
function readFile(official, n = 0) {
	is_official_level = official;
	off_lvl_n = n;
	if(!official){
		var file = document.getElementById("file").files[0];
		var reader = new FileReader();
		reader.readAsText(file);
		reader.onload = function() {
			play(JSON.parse(reader.result));
		};
		reader.onerror = function() {
			console.error(reader.error);
		};
	}
	else{
		play(olevels[n - 1]);
		if(n != 0 && n != 15) document.getElementById('olid').stepUp(1);
		if(official && n == 14) ttt = setTimeout(function(){
			level[8][12] = "FNSH";
			$("#field").append("<img src=\"tiles/FNSH.png\" class=\"block x8y12\" style=\"top: 384px; left: 576px\">");
		}, 49000);
	}
}
$("document").ready(function(){
	$(this).keydown(function(event){
		event.preventDefault();
		var kk = false;
		if(!pressed("left") && !pressed("right") && !pressed("up") && !pressed("down")) kk = true;
		if(event.keyCode >= 48 && event.keyCode <= 57) $("img#player").attr("src", "skins/" + event.keyCode + ".png");
		else if(event.keyCode == 37 || event.keyCode == 65) keysPressed.left = true;
		else if(event.keyCode == 38 || event.keyCode == 87) keysPressed.up = true;
		else if(event.keyCode == 39 || event.keyCode == 68) keysPressed.right = true;
		else if(event.keyCode == 40 || event.keyCode == 83) keysPressed.down = true;
		if(kk){
			move();
			sm = false;
		}
	});
	$(this).keyup(function(event){
		event.preventDefault();
		if(event.keyCode == 37 || event.keyCode == 65 && pressed("left")) keysPressed.left = false;
		else if(event.keyCode == 38 || event.keyCode == 87 && pressed("up")) keysPressed.up = false;
		else if(event.keyCode == 39 || event.keyCode == 68 && pressed("right")) keysPressed.right = false;
		else if(event.keyCode == 40 || event.keyCode == 83 && pressed("down")) keysPressed.down = false;
		else if(event.keyCode == 82){
			$("#field").empty();        clearTimeout(ttt);
			music.pause();
			for(var i = 0; i < lasers.length; i++){ try{ clearTimeout(lasers[i]); } catch(e){ clearInterval(lasers[i]); }}
			clearInterval(pre_laser);
			$("b.starcount").text("Stars: " + stars);
			readFile(is_official_level, off_lvl_n);
		}
	});
});
move = function(){
	if(level == null) return;
	if(!sm){
		sm = true;
		return;
	}
	if(pressed("left") || pressed("right") || pressed("up") || pressed("down")){
		playsound("etc/walk.wav");
		if(player.y != 0 && pressed("left") && !pressed("right")){
			$("img#player").css("transform", "rotate(90deg)");
			if(block_types.has_no_collision.includes(level[player.x][player.y - 1])){
				if(level[player.x][player.y] == "PRP1"){
					for(var x = 0; x < level.length; x++)
						for(var y = 0; y < level[x].length; y++){
							if(level[x][y] == "PRP0") level[x][y] = "PRP1";
							else if(level[x][y] == "PRP1") level[x][y] = "PRP0";
							if(level[x][y] == "PRP0" || level[x][y] == "PRP1") $(".x" + x + "y" + y).attr("src", "tiles/" + level[x][y] + ".png");
						}
				}
				player.y -= 1;
				$("#player").css("left", player.y * 48);
			}
			if(block_types.death.includes(level[player.x][player.y])){
				death_effect(player.y, player.x);
				for(var x = 0; x < level.length; x++)
					for(var y = 0; y < level[x].length; y++)
						if(level[x][y] == "STRT"){
							$("#player").css("top", x * 48);
							$("#player").css("left", y * 48);
							player.x = x;
							player.y = y;
						}
				playsound("etc/death.wav");
			}
			if(level[player.x][player.y] == "STRN" || level[player.x][player.y] == "STR0"){
				se_t++;
				playsound("etc/star.wav");
				if(level[player.x][player.y] == "STR0") $(".x" + player.x + "y" + player.y).attr("src", "tiles/0000.png"); else $(".x" + player.x + "y" + player.y).remove();
				$("b.starcount").text("Stars: " + (stars + se_t));
				level[player.x][player.y] = "NONE";
			}
			if(level[player.x][player.y] == "FNSH"){
				playsound("etc/win.wav");
				music.pause();
				$("div#field").empty();
				$("#player").animate({"opacity": 0}, 500);
				$("#file").animate({"opacity": 1}, 500);
				$("b.hint").animate({"opacity": 1}, 500);
				$("#xTxt").animate({"opacity": 1}, 500);
				$("#olid").animate({"opacity": 1}, 500);
				$("#xBtn").animate({"opacity": 1}, 500);
				for(var i = 0; i < lasers.length; i++){ try{ clearTimeout(lasers[i]); } catch(e){ clearInterval(lasers[i]); }}
				clearInterval(pre_laser);
				$("#file").wrap('<form>').closest('form').get(0).reset();
				$("#file").unwrap();
				stars += se_t;
				level = null;
			}
		}
		if(player.y != level_w - 1 && pressed("right") && !pressed("left")){
			$("img#player").css("transform", "rotate(-90deg)");
			if(block_types.has_no_collision.includes(level[player.x][player.y + 1])){
				if(level[player.x][player.y] == "PRP1"){
					for(var x = 0; x < level.length; x++)
						for(var y = 0; y < level[x].length; y++){
							if(level[x][y] == "PRP0") level[x][y] = "PRP1";
							else if(level[x][y] == "PRP1") level[x][y] = "PRP0";
							if(level[x][y] == "PRP0" || level[x][y] == "PRP1") $(".x" + x + "y" + y).attr("src", "tiles/" + level[x][y] + ".png");
						}
				}
				player.y += 1;
				$("#player").css("left", player.y * 48);
			}
			if(block_types.death.includes(level[player.x][player.y])){
				death_effect(player.y, player.x);
				for(var x = 0; x < level.length; x++)
					for(var y = 0; y < level[x].length; y++)
						if(level[x][y] == "STRT"){
							$("#player").css("top", x * 48);
							$("#player").css("left", y * 48);
							player.x = x;
							player.y = y;
						}
				playsound("etc/death.wav");
			}
			if(level[player.x][player.y] == "STRN" || level[player.x][player.y] == "STR0"){
				se_t++;
				playsound("etc/star.wav");
				if(level[player.x][player.y] == "STR0") $(".x" + player.x + "y" + player.y).attr("src", "tiles/0000.png"); else $(".x" + player.x + "y" + player.y).remove();
				$("b.starcount").text("Stars: " + (stars + se_t));
				level[player.x][player.y] = "NONE";
			}
			if(level[player.x][player.y] == "FNSH"){
				playsound("etc/win.wav");
				music.pause();
				$("div#field").empty();
				$("#player").animate({"opacity": 0}, 500);
				$("#file").animate({"opacity": 1}, 500);
				$("b.hint").animate({"opacity": 1}, 500);
				$("#xTxt").animate({"opacity": 1}, 500);
				$("#olid").animate({"opacity": 1}, 500);
				$("#xBtn").animate({"opacity": 1}, 500);
				for(var i = 0; i < lasers.length; i++){ try{ clearTimeout(lasers[i]); } catch(e){ clearInterval(lasers[i]); }}
				clearInterval(pre_laser);
				$("#file").wrap('<form>').closest('form').get(0).reset();
				$("#file").unwrap();
				stars += se_t;
				level = null;
			}
		}
		if(player.x != 0 && pressed("up") && !pressed("down")){
			$("img#player").css("transform", "rotate(180deg)");
			if(block_types.has_no_collision.includes(level[player.x - 1][player.y])){
				if(level[player.x][player.y] == "PRP1"){
					for(var x = 0; x < level.length; x++)
						for(var y = 0; y < level[x].length; y++){
							if(level[x][y] == "PRP0") level[x][y] = "PRP1";
							else if(level[x][y] == "PRP1") level[x][y] = "PRP0";
							if(level[x][y] == "PRP0" || level[x][y] == "PRP1") $(".x" + x + "y" + y).attr("src", "tiles/" + level[x][y] + ".png");
						}
				}
				player.x -= 1;
				$("#player").css("top", player.x * 48);
			}
			if(block_types.death.includes(level[player.x][player.y])){
				death_effect(player.y, player.x);
				for(var x = 0; x < level.length; x++)
					for(var y = 0; y < level[x].length; y++)
						if(level[x][y] == "STRT"){
							$("#player").css("top", x * 48);
							$("#player").css("left", y * 48);
							player.x = x;
							player.y = y;
						}
				playsound("etc/death.wav");
			}
			if(level[player.x][player.y] == "STRN" || level[player.x][player.y] == "STR0"){
				se_t++;
				playsound("etc/star.wav");
				if(level[player.x][player.y] == "STR0") $(".x" + player.x + "y" + player.y).attr("src", "tiles/0000.png"); else $(".x" + player.x + "y" + player.y).remove();
				$("b.starcount").text("Stars: " + (stars + se_t));
				level[player.x][player.y] = "NONE";
			}
			if(level[player.x][player.y] == "FNSH"){
				playsound("etc/win.wav");
				music.pause();
				$("div#field").empty();
				$("#player").animate({"opacity": 0}, 500);
				$("#file").animate({"opacity": 1}, 500);
				$("b.hint").animate({"opacity": 1}, 500);
				$("#xTxt").animate({"opacity": 1}, 500);
				$("#olid").animate({"opacity": 1}, 500);
				$("#xBtn").animate({"opacity": 1}, 500);
				for(var i = 0; i < lasers.length; i++){ try{ clearTimeout(lasers[i]); } catch(e){ clearInterval(lasers[i]); }}
				clearInterval(pre_laser);
				$("#file").wrap('<form>').closest('form').get(0).reset();
				$("#file").unwrap();
				stars += se_t;
				level = null;
			}
		}
		if(player.x != level_h - 1 && pressed("down") && !pressed("up")){
			$("img#player").css("transform", "rotate(0deg)");
			if(block_types.has_no_collision.includes(level[player.x + 1][player.y])){
				if(level[player.x][player.y] == "PRP1"){
					for(var x = 0; x < level.length; x++)
						for(var y = 0; y < level[x].length; y++){
							if(level[x][y] == "PRP0") level[x][y] = "PRP1";
							else if(level[x][y] == "PRP1") level[x][y] = "PRP0";
							if(level[x][y] == "PRP0" || level[x][y] == "PRP1") $(".x" + x + "y" + y).attr("src", "tiles/" + level[x][y] + ".png");
						}
				}
				player.x += 1;
				$("#player").css("top", player.x * 48);
			}
			if(block_types.death.includes(level[player.x][player.y])){
				death_effect(player.y, player.x);
				for(var x = 0; x < level.length; x++)
					for(var y = 0; y < level[x].length; y++)
						if(level[x][y] == "STRT"){
							$("#player").css("top", x * 48);
							$("#player").css("left", y * 48);
							player.x = x;
							player.y = y;
						}
				playsound("etc/death.wav");
			}
			if(level[player.x][player.y] == "STRN" || level[player.x][player.y] == "STR0"){
				se_t++;
				playsound("etc/star.wav");
				if(level[player.x][player.y] == "STR0") $(".x" + player.x + "y" + player.y).attr("src", "tiles/0000.png"); else $(".x" + player.x + "y" + player.y).remove();
				$("b.starcount").text("Stars: " + (stars + se_t));
				level[player.x][player.y] = "NONE";
			}
			if(level[player.x][player.y] == "FNSH"){
				playsound("etc/win.wav");
				music.pause();
				$("div#field").empty();
				$("#player").animate({"opacity": 0}, 500);
				$("#file").animate({"opacity": 1}, 500);
				$("b.hint").animate({"opacity": 1}, 500);
				$("#xTxt").animate({"opacity": 1}, 500);
				$("#olid").animate({"opacity": 1}, 500);
				$("#xBtn").animate({"opacity": 1}, 500);
				for(var i = 0; i < lasers.length; i++){ try{ clearTimeout(lasers[i]); } catch(e){ clearInterval(lasers[i]); }}
				clearInterval(pre_laser);
				$("#file").wrap('<form>').closest('form').get(0).reset();
				$("#file").unwrap();
				stars += se_t;
				level = null;
			}
		}
	}
};
function death_effect(x, y){
	$("img#de").css({"left": (x * 48) + "px", "top": (y * 48) + "px"});
	$("img#de").animate({opacity: 1}, 500, complete = function(){
		$("img#de").animate({opacity: 0}, 250);
	});
	se_t = 0;
	$("b.starcount").text("Stars: " + stars);
	if(is_official_level && off_lvl_n == 14){
		music.pause();
		$("#field").empty();        clearTimeout(ttt);
		for(var i = 0; i < lasers.length; i++){ try{ clearTimeout(lasers[i]); } catch(e){ clearInterval(lasers[i]); }}
		clearInterval(pre_laser);
		$("b.starcount").text("Stars: " + stars);
		readFile(is_official_level, off_lvl_n);
	}
}
setInterval(move, 250);
setInterval(function(){
	Cookies.set("-candyquad-stars", String(stars));
}, 200);
window.onload = function(){
	$("b.starcount").text("Stars: " + Cookies.get("-candyquad-stars"));
};
