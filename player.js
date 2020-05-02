let userColor = null
let chosenPiece = null
let chosenPiecePosition = null
let replacementPiecePosition = null

function choosePiece(position){
    enablePieces();
    chosenPiecePosition = position;
    chosenPiece = logics.board[position[0]][position[1]];

    moves = getPieceMoves(chosenPiece, chosenPiecePosition, logics.board);
    for(let i = 0; i < moves.length; i++){
        let currMove = moves[i];
        enableTile(currMove);
    }
}

function chooseMove(position){
    let valid = false;
    moves = getPieceMoves(chosenPiece, chosenPiecePosition, logics.board);
    for(let i = 0; i < moves.length; i++){
        let currMove = moves[i];
        if(currMove[0] == position[0] && currMove[1] == position[1]){
            valid = true;
        }
    }
    if(!valid){
        return;
    }

    
    // creates a copy of the board, then makes the move and checks if there would be any threat at the end of the move.row
    // if there is a threat, the move is invalid and won't be made to the original board.
    let boardCopy = createBoardCopy(logics.board);
    movePiece(chosenPiecePosition, position, boardCopy);
    if(checkForThreat(userColor, boardCopy)){
        return;
    }

    // checks if there is an enemy at that position; if so, remove the piece
    if(!isEmpty(position, logics.board)){
        removePieceImage(position);
    }

    // checks if we're attacking the piece that just executed the en passant; if so, removes the opponent's pawn
    if(chosenPiece[1] == pieceTypes.pawn && getPiece(position, logics.board) == enPassantVulnerable){
        let oppPawnRow = userColor == colors.white ? position[0] + 1 : position[0] - 1;
        let oppPawnPos = [oppPawnRow, position[1]];
        removePieceImage(oppPawnPos); 
        logics.board[oppPawnPos[0]][oppPawnPos[1]] = null;
    }

    // checks if the move was a castle
    if(chosenPiece[1] == pieceTypes.king && Math.abs(position[1] - chosenPiecePosition[1]) > 1){
        // kingside castling
        if(position[1] == 6){
            removePieceImage([position[0], 7]);
            placePieceImage(userColor, pieceTypes.rook, [position[0], 5]);
        }

        // queenside castling
        if(position[1] == 2){
            removePieceImage([position[0], 0]);
            placePieceImage(userColor, pieceTypes.rook, [position[0], 3]);
        }
    }
    placePieceImage(userColor, chosenPiece[1], position);
    removePieceImage(chosenPiecePosition);
    movePiece(chosenPiecePosition, position, logics.board);

    chosenPiece = null;
    chosenPiecePosition = null;

    // checks if the pawn has reached the end of the board
    if(pawnReachedEndOfBoard(position, logics.board)){
        replacementPiecePosition = position;
        if(userColor == colors.white){
            openWhitePieceChooser();
        }
        else{
            openBlackPieceChooser();
        }
        return;
    }

    endTurn();
}

function enablePieces(){
    for(let row = 0; row < logics.size; row++){
        for(let col = 0; col < logics.size; col++){
            let pieceTuple = logics.board[row][col];
            let position = [row, col];
            if(pieceTuple == null){
                disableTile(position);
                continue;
            }
            let color = pieceTuple[0];
            if(color == userColor){
                enableTile(position);
            }
            else{
                disableTile(position);
            }
        }
    }
}

function disablePieces(){
    for(let row = 0; row < logics.size; row++){
        for(let col = 0; col < logics.size; col++){
            let pieceTuple = logics.board[row][col];
            if(pieceTuple == null){
                continue;
            }
            let position = [row, col];
            disableTile(position);
        }
    }
}

function chooseReplacementPiece(piece){
    let position = replacementPiecePosition;
    logics.board[position[0]][position[1]] = [userColor, piece];

    removePieceImage(position);
    placePieceImage(userColor, piece, position);

    closeChoosers();
    endTurn();
}
