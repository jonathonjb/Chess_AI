
// constants
const BOARD_SIZE = 8;

const NO_COLOR = 0;
const RED = 1;
const BLACK = 2;

const NO_PIECE = 3;
const STANDARD_PIECE = 4;
const KING_PIECE = 5;


// game logic variables
let board;
let playerTurn; 
let numOfRedPieces = 0;
let numOfBlackPieces = 0;

function initializeBoard(){
    initializeLogicBoard();
    initializeVisualBoard();
}

function initializeLogicBoard(){
    board = [];
    for(let row = 0; row < BOARD_SIZE; row++){
        let boardRow = [];
        for(let col = 0; col < BOARD_SIZE; col++){
            boardRow.push([NO_COLOR, NO_PIECE]);
        }
        board.push(boardRow);
    }

    // initalizes the black pieces
    let startingCol = 1;
    for(let row = 0; row < 3; row++){
        for(let col = startingCol, piecesInRow = 0; piecesInRow < 4; col += 2, piecesInRow++){
            board[row][col] = [BLACK, STANDARD_PIECE];
        }
        if(startingCol == 1){
            startingCol = 0;
        }
        else{
            startingCol = 1;
        }
        numOfRedPieces++;
    }

    // initalizes the red pieces
    for(let row = 5; row < 8; row++){
        for(let col = startingCol, piecesInRow = 0; piecesInRow < 4; col += 2, piecesInRow++){
            board[row][col] = [RED, STANDARD_PIECE]
        }
        if(startingCol == 1){
            startingCol = 0;
        }
        else{
            startingCol = 1;
        }
    }
    numOfBlackPieces++;
}

function startGame(){
    playerTurn = RED;
    disableBoard();
    enableTeam();
}

function turnEnds(){
    playerTurn = (playerTurn == RED) ? BLACK : RED;
    disableBoard();
    infoBoxUpdate();
    if(teamCanAttack()){
        enableAttackingPieces();
    }
    else{
        enableTeam();
    }
}

function getAllValidPositions(currPosition){
    let currRow = currPosition[0];
    let currCol = currPosition[1];
    let validPositions = [];
    let pieceTuple = board[currRow][currCol];

    let currColor = pieceTuple[0];
    let currPiece = pieceTuple[1];

    if(currPiece == NO_PIECE){
        return null;
    }

    let pieceCanAttack = canAttack(currPosition);

    let rowChangeStart = (currColor == BLACK && currPiece == STANDARD_PIECE) ? 1 : -1;
    let rowChangeEnd = (currColor == RED && currPiece == STANDARD_PIECE) ? -1 : 1;

    for(let rowChange = rowChangeStart; rowChange <= rowChangeEnd; rowChange += 2){
        for(let colChange = -1; colChange <= 1; colChange += 2){
            let newRow = currRow + rowChange;
            let newCol = currCol + colChange;
            let newPosition = [newRow, newCol];
            if(newRow < 0 || newRow >= BOARD_SIZE || newCol < 0 || newCol >= BOARD_SIZE){
                continue;
            }
            if(board[newRow][newCol][1] == NO_PIECE && !pieceCanAttack){
                validPositions.push(newPosition);
            }
            else if(board[newRow][newCol][0] != currColor){
                newRow = currRow + (rowChange * 2);
                newCol = currCol + (colChange * 2);
                newPosition = [newRow, newCol];
                if(newRow < 0 || newRow >= BOARD_SIZE || newCol < 0 || newCol >= BOARD_SIZE){
                    continue;
                }
                if(board[newRow][newCol][1] == NO_PIECE){
                    validPositions.push(newPosition);
                }
            }
        }
    }

    return validPositions;
}

function move(startPosition, endPosition){
    let startRow = startPosition[0];
    let startCol = startPosition[1];
    let endRow = endPosition[0];
    let endCol = endPosition[1];

    board[endRow][endCol] = board[startRow][startCol];
    board[startRow][startCol] = [NO_COLOR, NO_PIECE];

    let turnEndsAfterAttack = true;

    if(isAttack(startPosition, endPosition)){
        attack(startPosition, endPosition);

        if(canAttack(endPosition)){
            disableBoard();
            enablePiece(endPosition);
            turnEndsAfterAttack = false;
        }
    }

    if(reachedEndOfBoard(endPosition)){
        convertToKing(endPosition);
    }

    if(turnEndsAfterAttack){
        turnEnds();
    }
}

function isAttack(startPosition, endPosition){
    let startRow = startPosition[0];
    let endRow = endPosition[0];
    return Math.abs(startRow - endRow) == 2;
}

/**
 * This is a attack/jump; the enemy piece that was jumped will be removed from the board.
 * 
 * @param {*} startPosition 
 * @param {*} endPosition 
 */
function attack(startPosition, endPosition){
    let startRow = startPosition[0];
    let endRow = endPosition[0];
    let startCol = startPosition[1];
    let endCol = endPosition[1];

    let enemyRow = startRow + ((endRow - startRow) / 2);
    let enemyCol = startCol + ((endCol - startCol) / 2);
    let enemyPosition = [enemyRow, enemyCol];

    board[enemyRow][enemyCol] = [NO_COLOR, NO_PIECE];
    removePiece(enemyPosition);
}

function teamCanAttack(){
    for(let row = 0; row < BOARD_SIZE; row++){
        for(let col = 0; col < BOARD_SIZE; col++){
            let position = [row, col];
            let tile = board[row][col];
            if(tile[0] == playerTurn && canAttack(position)){
                return true;
            }
        }
    }
    return false;
}

function getPositionsThatCanAttack(){
    let positionsThatCanAttack = [];
    for(let row = 0; row < BOARD_SIZE; row++){
        for(let col = 0; col < BOARD_SIZE; col++){
            let position = [row, col];
            let tile = board[row][col];
            if(tile[0] == playerTurn && canAttack(position)){
                positionsThatCanAttack.push([row, col]);
            }
        }
    }
    return positionsThatCanAttack;
}

function canAttack(position){
    let row = position[0];
    let col = position[1];
    let pieceTuple = board[row][col];
    let color = pieceTuple[0];
    let piece = pieceTuple[1];

    let rowChangeStart = (color == BLACK && piece == STANDARD_PIECE) ? 1 : -1;
    let rowChangeEnd = (color == RED && piece == STANDARD_PIECE) ? -1 : 1;

    for(let rowChange = rowChangeStart; rowChange <= rowChangeEnd; rowChange += 2){
        for(let colChange = -1; colChange <= 1; colChange += 2){
            let newRow = row + rowChange;
            let newCol = col + colChange;
            let newPosition = [newRow, newCol];
            if(newRow < 0 || newRow >= BOARD_SIZE || newCol < 0 || newCol >= BOARD_SIZE){
                continue;
            }
            else if(board[newRow][newCol][1] == NO_PIECE){
                continue;
            }
            else if(board[newRow][newCol][0] != color){
                newRow = row + (rowChange * 2);
                newCol = col + (colChange * 2);
                newPosition = [newRow, newCol];
                if(newRow < 0 || newRow >= BOARD_SIZE || newCol < 0 || newCol >= BOARD_SIZE){
                    continue;
                }
                if(board[newRow][newCol][1] == NO_PIECE){
                    return true;
                }
            }
        }
    }
    return false;
}

function reachedEndOfBoard(position){
    let row = position[0];
    let col = position[1];
    let pieceTuple = board[row][col];
    let color = pieceTuple[0];

    return (color == BLACK && row == BOARD_SIZE - 1) || (color == RED && row == 0);
}

function convertToKing(position){
    let row = position[0];
    let col = position[1];
    let pieceTuple = board[row][col];
    let color = pieceTuple[0];

    board[row][col] = (color == RED) ? [RED, KING_PIECE] : [BLACK, KING_PIECE];
    convertToKingPieceImage(position);
}