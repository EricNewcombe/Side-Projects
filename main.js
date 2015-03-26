
function generateGameBoard (width, height, numMines) {
	// Creates a game object with attributes clickable, width, height and a map representing all points
	var map = new Array(height);

	for ( var i = 0; i < width; i++ ) { // Generate the map
		map[i] = new Array(height);
		for(var j = 0; j < height; j++){
			map[i][j] = { value: 0, visible: false, marked: false };
		}
	}
	var board = {
		generated: false, 
		clickable: true, 
		width: width, 
		height: height, 
		map: map, 
		numVisible: 0, 
		numMines: numMines, 
		mineLocations: null,
		revealOnClick: true
	};
	return board;

}

function generateMines(board, numMines, startPos){
	// Generates n mine locations on the gameboard provided and updates the cells touching the mine
	// Providing a starting click position makes it so that a mine is never generated where the user first clicks
	var mineLocations = [];

	for (var i = 0; i < numMines; i++) {

		//Generate initial point to insert into array of mine locations every time it loops
		var xPos = Math.floor(Math.random() * board.width);
		var yPos = Math.floor(Math.random() * board.height);

		while( board.map[xPos][yPos].value == 'x' || (xPos == startPos.x && yPos == startPos.y)){
			//If there is an overlap of the potential mine location, then keep recreating it until it is in a unique location
			xPos = Math.floor(Math.random() * board.width);
			yPos = Math.floor(Math.random() * board.height);
		}

		mineLocations.push({x: xPos, y: yPos})

		board.map[xPos][yPos].value = 'x';
		incrementCellsTouching(board, xPos, yPos)

	}

	board.mineLocations = mineLocations;
	board.generated = true;

}

function appendGameBoardToScreen(gameBoard){
	// Displays the object representing the game board onto the screen

	var container = document.getElementById('playArea');
	container.innerHTML = ""; // Clears the element for a new game to be appended
	var board = createDiv('gameBoard', '');

	for(var y = 0; y < gameBoard.height; y++){
		var row = createDiv('row', "");
		for (var x = 0; x < gameBoard.width; x++) {
			var cell = createDiv('cell hiddenCell', "&nbsp&nbsp", function(){cellClicked(gameBoard, this.x, this.y)});
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
	var currentActive = document.getElementsByClassName('activeButton')[0];
	if(currentActive.id == 'revealButton') board.revealOnClick = true;
	else board.revealOnClick = false;
	console.log(board.map[x][y])
	if( board.revealOnClick && board.map[x][y].marked == false ){ // If set to reveal on click and not a marked cell then reveal the cell
		if (board.clickable && board.generated) {
			if (board.map[x][y].value == 'x') endGame(board); //If bomb end game
			else if (board.map[x][y].value == 0) clearEmptyCells(board, x, y); //If an empty cell then clear all attached empty cells
			else if(board.map[x][y].visible == false) revealCell(board, x, y); // If a cell attached to a bomb then just reveal it
			updateScoreBoard(board);
		}
		else if(board.clickable && board.generated == false){
			generateMines(board, board.numMines, {x: x, y: y});
			cellClicked(board, x, y);
		}
		else {
			generateMap();
		}
	}
	else if(board.clickable && board.map[x][y].visible == false && board.map[x][y].marked == false ){ // else mark it as a potential bomb if not already revealed
		markBomb(board, x, y);
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
	return  x < 0 || x >= board.width || y < 0 || y >= board.height || board.map[x][y].value == 'x';
}

function revealCell (board, x, y) {
	//Retrieves the cell which is specified by its x and y position
	board.numVisible++;
	board.map[x][y].visible = true;
	var currentCell = document.getElementById('x'+x+'y'+y);
	currentCell.className = "cell visibleCell";

	// Sets the value contained in the table cell based on what it should be
	if(board.map[x][y].value == 0) currentCell.innerHTML =  "&nbsp&nbsp";
	else if ( board.map[x][y].value == 'x' ) currentCell.className = "cell bomb";
	else currentCell.innerHTML = board.map[x][y].value;

	if(board.numVisible == board.width * board.height - board.numMines) wonGame(board);
}

function markBomb (board, x, y) { // Toggles between the two states
	var currentCell = document.getElementById('x'+x+'y'+y);
	board.map[x][y].marked = board.map[x][y].marked ? false : true;
	console.log(board.map[x][y])
	if(currentCell.className == "cell markedBomb") currentCell.className = "cell";
	else currentCell.className = "cell markedBomb";
}

function setClickAction (action) {
	document.getElementById(action+'Button').className = "button activeButton";
	document.getElementById((action == 'reveal' ? 'mark' : 'reveal') + 'Button').className = "button";

}

function startGame(width, height, numMines){
	var board = generateGameBoard(width, height, numMines);
	updateScoreBoard(board);
	appendGameBoardToScreen(board);
}

function updateScoreBoard(board){
	if(board.clickable){
		document.getElementById('squaresRemaining').innerHTML = "Spaces left: " + (board.width * board.height - board.numMines - board.numVisible);
	}
}

function generateMap(){
	var width = document.getElementById('widthText').value,
		height = document.getElementById('heightText').value,
		mines = document.getElementById('minesText').value;
	startGame(width,height,mines)
}

function endGame(board){
	for (var i = 0; i < board.mineLocations.length; i++) {
		var currentMine = board.mineLocations[i];
		revealCell(board, currentMine.x, currentMine.y);
	};
	
	board.clickable = false;
}

function wonGame(board){
	updateScoreBoard(board);	
	endGame(board);
}

startGame(10, 10, 10)




