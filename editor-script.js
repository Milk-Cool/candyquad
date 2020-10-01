var currentTile = "NONE",
open = false;
sopen = false;
blocks = [
	"NONE", "0000", "0001", "0010", "0011", "0100", "0101", "0110", "0111", "1000", "1001", "1010", "1011", "1100", "1101", "1110", "1111", "EDG0", "EDG1", "EDG2", "EDG3", "SPK0", "SPK1", "SPK2", "SPK3", "FULL", "STRN", "STR0", "STRT", "FNSH", "LSVE", "LSHO", "LSBO", "SAWX", "PRP0", "PRP1"],
animated = [
	"SAWX", "STRN", "STR0"],
custom = [],
resultToDown = "",
skippress = false;
//thx Denys Rusov
const saveDownloadedData = (fileName, data) => {
    if(~navigator.userAgent.indexOf('MSIE') || ~navigator.appVersion.indexOf('Trident/')) { /* IE9-11 */
        const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
        navigator.msSaveBlob(blob, fileName);
    } else {
        const link = document.createElement('a')
        link.setAttribute('target', '_blank');
        if(Blob !== undefined) {
            const blob = new Blob([data], { type: 'text/plain' });
            link.setAttribute('href', URL.createObjectURL(blob));
        } else {
            link.setAttribute('href', 'data:text/plain,' + encodeURIComponent(data));
        }

        ~window.navigator.userAgent.indexOf('Edge')
            && (fileName = fileName.replace(/[&\/\\#,+$~%.'':*?<>{}]/g, '_')); /* Edge */

        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
function draw(x, y, tileToDraw = currentTile){
	if(custom.includes(tileToDraw)) document.getElementsByClassName("x" + x + "y" + y)[0]["src"] = "etc/custom.png";
	else if(animated.includes(tileToDraw)) document.getElementsByClassName("x" + x + "y" + y)[0]["src"] = "tiles/" + tileToDraw + ".gif";
	else document.getElementsByClassName("x" + x + "y" + y)[0]["src"] = "tiles/" + tileToDraw + ".png";
	$(".x" + x + "y" + y).attr("levelvalue", tileToDraw);
}
for(var x = 0; x < 24; x++)
	for(var y = 0; y < 14; y++)
		$("div#field").append("<img class=\"block x" + x + "y" + y + "\" style=\"cursor: pointer; left:" + x * 48 + "px; top:" + y * 48 + "px\" src=\"tiles/NONE.png\" onclick=\"draw(" + x + ", " + y + ")\" oncontextmenu=\"draw(" + x + ", " + y + ", 'NONE'); return false\" levelvalue=\"NONE\">");
function changeTileS(){
	open = !open;
	if(open) $("#blockselect").css("left", "15px");
	else changeTileF(currentTile);
}
function changeTileF(id){
	open = false;
	$("#blockselect").css("left", "-200px");
	currentTile = id;
}
function changeSS(){
	sopen = !sopen;
	if(sopen) $("#lvldata").animate({"right": "0"});
	else changeSF();
}
function changeSF(){
	sopen = false;
	$("#lvldata").animate({"right": "-400px"});
}
function updCs(){
	try {
		custom = [];
		for(var i = 0; i < JSON.parse("{" + document.getElementById("lvlsets").value + "}").custom.length; i++)
			custom.push(JSON.parse("{" + document.getElementById("lvlsets").value + "}").custom[i][0]);
	}catch(e){console.warn("Can't generate custom array");}
}
$("document").ready(function(){
	$(this).keyup(function(event){
		if(skippress) return;
		if(event.keyCode == 49) changeTileS();
		if(event.keyCode == 50) changeSS();
		if(event.keyCode == 51) setTimeout(function(){
			resultToDown = "{\"level\":[";
			for(var x = 0; x < 14; x++){
				resultToDown += "[";
				for(var y = 0; y < 24; y++){
					resultToDown += "\"" + $("img.x" + y + "y" + x).attr("levelvalue") + "\"";
					if(y != 23) resultToDown += ",";
				}
				resultToDown += "]";
				if(x != 13) resultToDown += ",";
			}
			resultToDown += "], " + document.getElementById("lvlsets").value + "}";
			saveDownloadedData($("#lvlname").val() + ".cql", resultToDown);
		}, 0);
	});
	$("#blockselect").append("<img src=\"tiles/" + blocks[0] + ".png\" onclick=\"changeTileF('" + blocks[0] + "')\" style=\"cursor: pointer\">");
	for(var i = 1; i < blocks.length; i++){
		if(animated.includes(blocks[i])) $("#blockselect").append("<img src=\"tiles/" + blocks[i] + ".gif\" onclick=\"changeTileF('" + blocks[i] + "')\" style=\"cursor: pointer\">");
		else $("#blockselect").append("<img src=\"tiles/" + blocks[i] + ".png\" onclick=\"changeTileF('" + blocks[i] + "')\" style=\"cursor: pointer\">");
	}
});
