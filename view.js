
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
        if(backgroundIsAlt){
            tiles[i].style.background = LIGHT_BACKGROUND;
        }
        else{
            tiles[i].setAttribute("ondrop", "handleDrop(event)")
            tiles[i].setAttribute("ondragover", "handleDragOver(event)");
            tiles[i].style.background = DARK_BACKGROUND;
        }

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
}

function initializePieces(){
    let tiles = document.getElementsByClassName("tile");

    // initializes the black pieces
    nextBlackId = 0;
    for(let i = 0; i < 24; i++){
        if(tiles[i].style.background == DARK_BACKGROUND){
            let blackPieceImage = document.createElement("img");
            blackPieceImage.setAttribute("src", BLACK_PIECE_IMAGE_PATH);
            blackPieceImage.setAttribute("ondragstart", "handleDrag(event)");
            blackPieceImage.setAttribute("id", "blackPiece" + nextBlackId);
            nextBlackId++;
            tiles[i].appendChild(blackPieceImage);

            tiles[i].removeAttribute("ondrop")
            tiles[i].removeAttribute("ondragover");
        }
    }

    // initializes the red pieces
    nextRedId = 0;
    for(let i = 40; i < tiles.length; i++){
        if(tiles[i].style.background == DARK_BACKGROUND){
            let redPieceImage = document.createElement("img");
            redPieceImage.setAttribute("src", RED_PIECE_IMAGE_PATH);
            redPieceImage.setAttribute("ondragstart", "handleDrag(event)");
            redPieceImage.setAttribute("id", "redPiece" + nextRedId);
            nextRedId++;
            tiles[i].appendChild(redPieceImage);

            tiles[i].removeAttribute("ondrop");
            tiles[i].removeAttribute("ondragover");
        }
    }
}

function disableBoard(){
    for(let row = 0; row < BOARD_SIZE; row++){
        for(let col = 0; col < BOARD_SIZE; col++){
            let tile = visualBoard[row][col];

            tile.removeAttribute("ondrop");
            tile.removeAttribute("ondragover");

            if(tile.childElementCount === 1){
                let piece = tile.childNodes[0];
                piece.removeAttribute("ondragstart");
                piece.setAttribute("draggable", "false");
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
                    piece.setAttribute("ondragstart", "handleDrag(event)");
                    piece.setAttribute("draggable", "true");
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
        piece.setAttribute("ondragstart", "handleDrag(event)");
        piece.setAttribute("draggable", "true");
    });
}

function enablePiece(position){
    let tile = visualBoard[position[0]][position[1]];
    let piece = tile.childNodes[0];
    piece.setAttribute("ondragstart", "handleDrag(event)");
    piece.setAttribute("draggable", "true");
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

        // FIX THIS TO MAKE ID UNIQUE ALWAYS
        kingRedPieceImage.setAttribute("id", "redKingPiece" + nextRedId);
        nextRedId++;
        tile.appendChild(kingRedPieceImage);
    }
    else{
        let kingBlackPieceImage = document.createElement("img");
        kingBlackPieceImage.setAttribute("src", KING_BLACK_PIECE_IMAGE_PATH);

        // FIX THIS TO MAKE ID UNIQUE ALWAYS
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

    event.target.removeAttribute("ondrop")
    event.target.removeAttribute("ondragover");

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