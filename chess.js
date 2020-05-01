// constants
const colors = {
    white: 0,
    black: 1
};

const pieceTypes = {
    pawn: 2,
    knight: 3,
    bishop: 4,
    rook: 5,
    queen: 6,
    king: 7
};

const moveChecks = {
    hasMoved: 8,
    hasNotMoved: 9
}

const enPassantVulnerable = 10; // whenever the pawn moves two spaces, the space between gets this value for a single turn.

const logics = {
    size: 8, 
    board: [],
    movementBoard: [],
    currentTurn: colors.white
};

function initializeBoard(){
    initializeView();

    logics.board = [];
    for(let row = 0; row < logics.size; row++){
        rowValues = [];
        for(let col = 0; col < logics.size; col++){
            rowValues.push(null);
        }
        logics.board.push(rowValues);
    }

    setupPieces();
    userColor = colors.white;
    aiColor = colors.black;
}

function startGame(){
    logics.currentTurn = colors.white;
    startTurn();
}

function startTurn(){
    if(userColor == logics.currentTurn){
        enablePieces();
    }
    else if(aiColor == logics.currentTurn){
        aiMakeMove();
    }
    else{
        console.log("PROBLEM");
    }
}

function endTurn(){
    if(checkForCheckmate(logics.currentTurn, logics.board)){
        console.log('GAME OVER - WINNER');
    }

    logics.currentTurn = logics.currentTurn == colors.white ? colors.black : colors.white;
    if(logics.currentTurn == aiColor){
        startTurn();
    }
    startTurn();
}

function isEmpty(position, currBoard){
    return inBounds(position) && currBoard[position[0]][position[1]] == null;
}

function inBounds(position){
    return position[0] >= 0 && position[0] < logics.size && position[1] >= 0 && position[1] < logics.size;
}

function getPiece(position, currBoard){
    //console.log('GETTING PIECE AT ' + position);
    return currBoard[position[0]][position[1]];
}

// checks if the current color has the opposing color on checkmate
function checkForCheckmate(currColor, currBoard){
    let enemyColor = currColor == colors.white ? colors.black : colors.white;
    let enemyMoves = getCurrMoves(enemyColor, currBoard);

    if(!checkForThreat(enemyColor, currBoard)){
        return false;
    }

    for(let i = 0; i < enemyMoves.length; i++){
        // enemyMoves is a 2d array; it contains the list of positions of each pieces that can make a move, and its list of moves
        let currEnemyPiecePosition = enemyMoves[i][0];
        let currEnemyPieceMoves = enemyMoves[i][1];

        for(let j = 0; j < currEnemyPieceMoves.length; j++){
            let boardCopy = createBoardCopy(currBoard);
            movePiece(currEnemyPiecePosition, currEnemyPieceMoves[j], boardCopy);
            if(!checkForThreat(enemyColor, boardCopy)){
                return false;
            }
        }
    }
    return true;
}

function checkForThreat(currColor, currBoard){
    let enemyColor = currColor == colors.white ? colors.black : colors.white;
    let enemyMoves = getCurrMoves(enemyColor, currBoard);
    let kingPosition = getKingPosition(currColor, currBoard);

    for(let i = 0; i < enemyMoves.length; i++){
        // enemyMoves is a 2d array; it contains the list of positions of each pieces that can make a move, and its list of moves
        let pieceMoves = enemyMoves[i][1];
        for(let j = 0; j < pieceMoves.length; j++){
            let pieceMovePosition = pieceMoves[j];
            if(pieceMovePosition[0] == kingPosition[0] && pieceMovePosition[1] == kingPosition[1]){
                return true;
            }
        }
    }
    return false;
}

function getKingPosition(currColor, currBoard){
    for(let row = 0; row < logics.size; row++){
        for(let col = 0; col < logics.size; col++){
            let position = [row, col];
            if(isEmpty(position, currBoard)){
                continue;
            }
            let piece = getPiece(position, currBoard);
            if(piece[0] == currColor && piece[1] == pieceTypes.king){
                return position;
            }
        }
    }
    return null;
}

function createBoardCopy(currBoard){
    let newBoard = currBoard.map((arr) => {
        return arr.map((arrTwo) => {
            if(arrTwo == null || arrTwo == enPassantVulnerable){
                return arrTwo;
            }
            return arrTwo.slice();
        }).slice();
    });
    return newBoard;
}

function pawnReachedEndOfBoard(position, currBoard){
    let piece = getPiece(position, currBoard);
    if(isEmpty(position, currBoard) || piece[1] != pieceTypes.pawn){
        return false;
    }
    return (piece[0] == colors.white && position[0] == 0) || (piece[0] == colors.black && position[0] == 7);
}

function removeEnPassantVulnerables(currBoard){
    for(let row = 0; row < logics.size; row++){
        for(let col = 0; col < logics.size; col++){
            let position = [row, col];
            let piece = getPiece(position, currBoard);
            if(piece == enPassantVulnerable){
                currBoard[row][col] = null;
            }
        }
    }
}