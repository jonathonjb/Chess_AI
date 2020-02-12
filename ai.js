const STANDARD_PIECE_VALUE = 1;
const KING_PIECE_VALUE = 4;

function evaluationFunction(currBoard, currPlayer){
    let numOfBlackStandardPieces = 0;
    let numOfBlackKingPieces = 0;
    let numOfRedStandardPieces = 0;
    let numOfRedKingPieces = 0;

    for(let row = 0; row < BOARD_SIZE; row++){
        for(let col = 0; col < BOARD_SIZE; col++){
            if(currBoard[row][col][0] == RED && currBoard[row][col][1] == STANDARD_PIECE){
                numOfRedStandardPieces++;
            }
            else if(currBoard[row][col][0] == RED && currBoard[row][col][1] == KING_PIECE){
                numOfRedKingPieces++;
            }
            else if(currBoard[row][col][0] == BLACK && currBoard[row][col][1] == STANDARD_PIECE){
                numOfBlackStandardPieces++;
            }
            else if(currBoard[row][col][0] == BLACK && currBoard[row][col][1] ==  KING_PIECE){
                numOfBlackKingPieces++;
            }
        }
    }

    if(currPlayer == RED){
        return (STANDARD_PIECE_VALUE * numOfRedStandardPieces) + (KING_PIECE_VALUE * numOfRedKingPieces) - 
            (STANDARD_PIECE_VALUE * numOfBlackStandardPieces) - (KING_PIECE_VALUE* numOfBlackKingPieces);
    }
    else if(currPlayer == BLACK){
        return (STANDARD_PIECE_VALUE * numOfBlackStandardPieces) + (KING_PIECE_VALUE * numOfBlackKingPieces) - 
            (STANDARD_PIECE_VALUE * numOfRedStandardPieces) - (KING_PIECE_VALUE* numOfRedKingPieces);
    }
}

function aiStartTurn(){
    aiMakeMove();
    turnEnds();
}

function aiMakeMove(){
    for(let row = 0; row < BOARD_SIZE; row++){
        for(let col = 0; col < BOARD_SIZE; col++){
            if(board[row][col][0] == playerTurn){
                let validPositions = getAllValidPositions([row, col]);
                for(let i = 0; i < validPositions.length; i++){
                    move([row, col], validPositions[i]);
                    movePieceView([row, col], validPositions[i]);
                    return;
                }
            }
        }
    }
}