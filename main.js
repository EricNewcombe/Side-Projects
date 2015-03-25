
function generateGameBoard (width, height) {

	var map = new Array(height);

	for(var i = 0; i < height; i++){
		map[i] = new Array(width);
		for(var j = 0; j < width; j++){
			map[i][j] = 0;
		}
	}

	return map;

}

function generateMineLocations(width, height, numMines){
	var mineLocations = [];

	for (var i = 0; i < numMines; i++) {
		var potentialMine = {
			x = Math.floor(Math.random() * width;
			y = Math.floor(Math.random() * height;
		}
		mineLocations.push(potentialMine);
	}

	return mineLocations;
}

var map = generateGameBoard(10,10);
var mineLocations = generateMineLocations(10,10,15);

console.log(mineLocations);