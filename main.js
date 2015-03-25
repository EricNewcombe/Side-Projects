
function generateGameBoard (width, height) {

	var map = new Array(height);

	for(var i = 0; i < width; i++){
		map[i] = new Array(height);
		for(var j = 0; j < height; j++){
			map[i][j] = {
						value: 0,
						visible: false
					};
		}
	}

	return {width: width, height: height, map: map};

}

function generateMines(board, numMines){
	//Generates n mine locations on the gameboard provided and updates the cells touching the mine

	var mineLocations = [];

	for (var i = 0; i < numMines; i++) {

		//Generate initial point to insert into array of mine locations every time it loops
		var xPos = Math.floor(Math.random() * board.width);
		var yPos = Math.floor(Math.random() * board.height);

		while( board.map[xPos][yPos].value == 'X' ){
			//If there is an overlap of the potential mine location, then keep recreating it until it is in a unique location
			xPos = Math.floor(Math.random() * board.width);
			yPos = Math.floor(Math.random() * board.height);
		}

		board.map[xPos][yPos].value = 'X';
		incrementCellsTouching(board, xPos, yPos)

	}

}

function appendGameBoardToScreen(gameBoard){
	// Displays the object representing the game board onto the screen

	var container = document.getElementById('playArea');
	var board = createDiv('gameBoard', '');

	for(var y = 0; y < gameBoard.height; y++){
		var row = createDiv('row', "");
		for (var x = 0; x < gameBoard.width; x++) {
			var text = createDiv('visible', gameBoard.map[x][y])
			var cell = createDiv('cell', gameBoard.map[x][y].value, function(){cellClicked(gameBoard, this.x, this.y)});
			cell.x = x;
			cell.y = y;
			cell.id = ''+x+y;
			row.appendChild(cell);
		}
		board.appendChild(row);
	}

	container.appendChild(board);

}

function createDiv(className, innerHTML, functionOnClick){
	var element = document.createElement('div');
	element.className = className;
	element.addEventListener('click', functionOnClick);
	element.innerHTML = innerHTML;
	return element;
}

function incrementCellsTouching(board, mineX, mineY){
	for(var xOffset = -1; xOffset <= 1; xOffset++){
		for(var yOffset = -1; yOffset <= 1; yOffset++){
			var x = mineX + xOffset,
				y = mineY + yOffset;
			if(  notValidPoint(x,y) ){
				// If the location of the x or y points that are being examined are out of the scope, or if that point is a mine continue through the loop
				continue;
			}
			else {
				board.map[x][y].value++;
			}
		}
	}
}

function cellClicked(board, x, y){
	console.log('clicked cell (' + x + ',' + y + ')');
	if(board.map[x][y].value == 'X'){

	}
	else if(board.map[x][y].value == 0){
		clearEmptyCells(board, x, y);
	}
	else{
		revealCell(x,y);
	}
}

function clearEmptyCells(board, startX, startY){

	for(var xOffset = -1; xOffset <= 1; xOffset++){
		for(var yOffset = -1; yOffset <= 1; yOffset++){
			var x = startX + xOffset,
				y = startY + yOffset;
			if( notValidPoint(x,y) ){
				// If the location of the x or y points that are being examined are out of the scope, or if that point is a mine continue through the loop
				continue;
			}
			else if (board.map[x][y].value == 0 && board.map[x][y].visible == false){
				board.map[x][y].visible = true;
				clearEmptyCells(board, x, y);
				revealCell(x,y);
			}
		}
	}

}

function notValidPoint(x,y){
	return  x < 0 || x >= board.width || y < 0 || y >= board.height || board.map[x][y].value == 'X';
}

function revealCell(x,y){
	var currentCell = document.getElementById(''+x+y);
	currentCell.className = "cell searched";
}

var board = generateGameBoard(10,10);
generateMines(board,10);

console.log(board);

appendGameBoardToScreen(board);




