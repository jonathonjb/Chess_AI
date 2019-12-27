
// constants
const LIGHT_BACKGROUND = "rgb(242, 242, 242)";
const DARK_BACKGROUND = "rgb(115, 115, 115)";

const RED_PIECE_IMAGE_PATH = "Images/red_piece.png";
const BLACK_PIECE_IMAGE_PATH = "Images/black_piece.png";
const KING_RED_PIECE_IMAGE_PATH = "Images/king_red_piece.png";
const KING_BLACK_PIECE_IMAGE_PATH = "Images/king_black_piece.png";

// global variables
let visualBoard;

let nextRedId;
let nextBlackId;

function initializeVisualBoard(){
    let tiles = document.getElementsByClassName("tile");
    let backgroundIsAlt = true;
    let row = 0;
    let col = 0;

    visualBoard = [];
    let visualBoardRow = [];
    for(let i = 0; i < tiles.length; i++){
        tiles[i].setAttribute("id", row + "" + col)
        tiles[i].style.background = backgroundIsAlt ? LIGHT_BACKGROUND : DARK_BACKGROUND;
        visualBoardRow.push(tiles[i]);

        col++;
        if(col == BOARD_SIZE){
            col = 0;
            row++;
            backgroundIsAlt = !backgroundIsAlt;

            visualBoard.push(visualBoardRow);
            visualBoardRow = [];
        }
        backgroundIsAlt = !backgroundIsAlt;
    }

    initializePieces();
    initializeInfoBox();
}

function initializePieces(){
    let tiles = document.getElementsByClassName("tile");

    // initializes the black pieces
    nextBlackId = 0;
    for(let i = 0; i < 24; i++){
        if(tiles[i].style.background == DARK_BACKGROUND){
            let blackPieceImage = document.createElement("img");
            blackPieceImage.setAttribute("src", BLACK_PIECE_IMAGE_PATH);
            blackPieceImage.setAttribute("id", "blackPiece" + nextBlackId);
            nextBlackId++;
            tiles[i].appendChild(blackPieceImage);
        }
    }

    // initializes the red pieces
    nextRedId = 0;
    for(let i = 40; i < tiles.length; i++){
        if(tiles[i].style.background == DARK_BACKGROUND){
            let redPieceImage = document.createElement("img");
            redPieceImage.setAttribute("src", RED_PIECE_IMAGE_PATH);
            redPieceImage.setAttribute("id", "redPiece" + nextRedId);
            nextRedId++;
            tiles[i].appendChild(redPieceImage);
        }
    }
}

function initializeInfoBox(){
    let infoBoxRed = document.getElementById("infoBoxRed");
    let infoBoxBlack = document.getElementById("infoBoxBlack");
    infoBoxRed.src = RED_PIECE_IMAGE_PATH;
    infoBoxBlack.src = BLACK_PIECE_IMAGE_PATH;
    infoBoxBlack.style.opacity = "0.3";
}

function infoBoxUpdate(){
    let infoBoxRed = document.getElementById("infoBoxRed");
    let infoBoxBlack = document.getElementById("infoBoxBlack");
    infoBoxBlack.style.opacity = (playerTurn == BLACK) ? "1" : "0.3";
    infoBoxRed.style.opacity = (playerTurn == RED) ? "1" : "0.3";
}

function disableBoard(){
    for(let row = 0; row < BOARD_SIZE; row++){
        for(let col = 0; col < BOARD_SIZE; col++){
            let tile = visualBoard[row][col];

            tile.removeAttribute("ondrop");
            tile.removeAttribute("ondragover");

            if(tile.childElementCount === 1){
                let piece = tile.childNodes[0];
                disablePieceAttributes(piece);
            }
        }
    }
}

function enableTeam(){
    for(let row = 0; row < BOARD_SIZE; row++){
        for(let col = 0; col < BOARD_SIZE; col++){
            let tile = visualBoard[row][col];

            if(tile.childElementCount === 1){
                let piece = tile.childNodes[0];

                if((playerTurn == RED && piece.id.substring(0, 3) === "red") ||
                        playerTurn == BLACK && piece.id.substring(0, 5) === "black"){
                    enablePieceAttributes(piece);
                }
            }
        }
    }
}

function enableAttackingPieces(){
    let positionsThatCanAttack = getPositionsThatCanAttack();
    positionsThatCanAttack.forEach(position => {
        let tile = visualBoard[position[0]][position[1]];
        let piece = tile.childNodes[0];
        enablePieceAttributes(piece);
    });
}

function enablePiece(position){
    let tile = visualBoard[position[0]][position[1]];
    let piece = tile.childNodes[0];
    enablePieceAttributes(piece);
}

function enablePieceAttributes(piece){
    piece.setAttribute("ondragstart", "handleDrag(event)");
    piece.setAttribute("draggable", "true");
    piece.setAttribute("onMouseOver", "this.style.cursor='pointer'");
}

function disablePieceAttributes(piece){
    piece.removeAttribute("ondragstart");
    piece.setAttribute("draggable", "false");
    piece.removeAttribute("onmouseover");
    piece.style.removeProperty("cursor");
}

function enableAttacks(currPosition){
    let validPositions = getAllValidPositions(currPosition);
    validPositions.forEach(function(validPosition){
        let nextRow = validPosition[0];
        let nextCol = validPosition[1];
        visualBoard[nextRow][nextCol].setAttribute("ondrop", "handleDrop(event)")
        visualBoard[nextRow][nextCol].setAttribute("ondragover", "handleDragOver(event)");
    });
}

function removePiece(position){
    let tile = visualBoard[position[0]][position[1]];
    tile.removeChild(tile.childNodes[0]);
}

function convertToKingPieceImage(position){

    let tile = visualBoard[position[0]][position[1]];
    tile.removeChild(tile.childNodes[0]);
    if((board[position[0]][position[1]])[0] == RED){
        let kingRedPieceImage = document.createElement("img");
        kingRedPieceImage.setAttribute("src", KING_RED_PIECE_IMAGE_PATH);
        kingRedPieceImage.setAttribute("id", "redKingPiece" + nextRedId);
        nextRedId++;
        tile.appendChild(kingRedPieceImage);
    }
    else{
        let kingBlackPieceImage = document.createElement("img");
        kingBlackPieceImage.setAttribute("src", KING_BLACK_PIECE_IMAGE_PATH);
        kingBlackPieceImage.setAttribute("id", "blackKingPiece" + nextBlackId);
        nextBlackId++;
        tile.appendChild(kingBlackPieceImage);
    }
}

function handleClick(id){
}

function handleDrag(event){
    let tileId = event.target.parentElement.id;
    event.dataTransfer.setData("previousTile", tileId);
    event.dataTransfer.setData("pieceImage", event.target.id);

    let row = parseInt(tileId.charAt(0));
    let col = parseInt(tileId.charAt(1));
    let currPosition = [row, col];
    enableAttacks(currPosition);
}

function handleDragOver(event){
    event.preventDefault();
}

function handleDrop(event){
    event.preventDefault();
    let imageId = event.dataTransfer.getData("pieceImage");
    let currTile = event.target;
    currTile.appendChild(document.getElementById(imageId));

    currTile.removeAttribute("ondrop")
    currTile.removeAttribute("ondragover");

    let previousTileId = event.dataTransfer.getData("previousTile");
    let previousTile = document.getElementById(previousTileId);
    previousTile.setAttribute("ondrop", "handleDrop(event)")
    previousTile.setAttribute("ondragover", "handleDragOver(event)");

    let startRow = parseInt(previousTileId.charAt(0));
    let startCol = parseInt(previousTileId.charAt(1));
    let startPosition = [startRow, startCol];

    let currTileId = currTile.id;
    let endRow = parseInt(currTileId.charAt(0));
    let endCol = parseInt(currTileId.charAt(1));
    let endPosition = [endRow, endCol];

    move(startPosition, endPosition);
}