
function generateGameBoard (width, height, numMines) {
	// Creates a game object with attributes clickable, width, height and a map representing all points
	var map = new Array(height);

	for ( var i = 0; i < width; i++ ) { // Generate the map
		map[i] = new Array(height);
		for(var j = 0; j < height; j++){
			map[i][j] = { value: 0, visible: false };
		}
	}

	return {clickable: true, width: width, height: height, map: map, numVisible: 0, numMines: numMines};

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
	container.innerHTML = ""; // Clears the element for a new game to be appended
	var board = createDiv('gameBoard', '');

	for(var y = 0; y < gameBoard.height; y++){
		var row = createDiv('row', "");
		for (var x = 0; x < gameBoard.width; x++) {
			var text = createDiv('visible', gameBoard.map[x][y])
			var cell = createDiv('cell', gameBoard.map[x][y].value, function(){cellClicked(gameBoard, this.x, this.y)});
			cell.x = x; // Assigns the location of the cell in the grid to the cell to be accessed by other parts of the program
			cell.y = y;
			cell.id = 'x'+x+'y'+y;
			row.appendChild(cell);
		}
		board.appendChild(row);
	}

	container.appendChild(board);

}

function createDiv(className, innerHTML, functionOnClick){
	// Creates a div element with specific characteristics
	var element = document.createElement('div');
	element.className = className;
	element.addEventListener('click', functionOnClick);
	element.innerHTML = innerHTML;
	return element;
}

function incrementCellsTouching(board, mineX, mineY){
	// Goes in a 3x3 box around the center point of where the bomb is located and increases the number of bombs each non bomb cell touching it by one
	for(var xOffset = -1; xOffset <= 1; xOffset++){
		for(var yOffset = -1; yOffset <= 1; yOffset++){
			var x = mineX + xOffset,
				y = mineY + yOffset;
			if(  notValidPoint(board, x,y) ){
				// If the location of the x or y points that are being examined are out of the scope, or if that point is a mine continue through the loop
				continue;
			}
			else { // Else increment the number of bombs it is touching
				board.map[x][y].value++;
			}
		}
	}
}

function cellClicked(board, x, y){
	//Click handler for the game
	if (board.clickable) {
		if (board.map[x][y].value == 'X') { //If bomb end game
			revealCell(board, x, y);
			board.clickable = false;
		}
		else if (board.map[x][y].value == 0) { //If an empty cell then clear all attached empty cells
			clearEmptyCells(board, x, y);
		}
		else { // If a cell attached to a bomb then just reveal it
			revealCell(board, x, y);
		}
	}
}

function clearEmptyCells(board, startX, startY){
	// Recusively reveals all directly adjacent empty cells and reveals one layer deep of directly attached cells touching mines
	for(var xOffset = -1; xOffset <= 1; xOffset++){
		for(var yOffset = -1; yOffset <= 1; yOffset++){
			var x = startX + xOffset,
				y = startY + yOffset;
			if( notValidPoint(board, x, y) || xOffset == yOffset && xOffset != 0 || xOffset == -yOffset && xOffset != 0 ){
				// Eliminates the points which can not be seen by the current location
				// If the location of the x or y points that are being examined are out of the scope, or if that point is a mine continue through the loop
				continue;
			}
			else if ( board.map[x][y].visible == false ){
				// Checks to see if the current cell being examined is already visible or not 
				revealCell(board, x, y);
				if ( board.map[x][y].value == 0 ) clearEmptyCells(board, x, y); // If the cell is blank then recurse
			}
		}
	}

}

function notValidPoint (board, x, y) {
	//Checks to see if the location of the x or y points are within the scope of the map or if it is a map
	return  x < 0 || x >= board.width || y < 0 || y >= board.height || board.map[x][y].value == 'X';
}

function revealCell(board, x, y){
	//Retrieves the cell which is specified by its x and y position
	board.numVisible++;
	board.map[x][y].visible = true;
	var currentCell = document.getElementById('x'+x+'y'+y);
	currentCell.className = "cell visibleCell";
}

function startGame(width, height, numMines){
	var board = generateGameBoard(width, height, numMines);
	generateMines(board, board.numMines);
	appendGameBoardToScreen(board);
	console.log(board);
}

function generateMap(){
	console.log('asdf');
	var width = document.getElementById('widthText').value,
		height = document.getElementById('heightText').value,
		mines = document.getElementById('minesText').value;
	startGame(width,height,mines)
}
startGame(10, 10, 10)




