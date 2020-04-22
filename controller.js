function tileClicked(id){
    let row = parseInt(id[0]);
    let col = parseInt(id[1]);
    let position = [row, col];
    if(logics.currentTurn == userColor){
        let piece = logics.board[row][col];
        if(piece == null || piece == enPassantVulnerable){
            if(chosenPiece != null){
                chooseMove(position);
            }
            return;
        }
        color = piece[0];
        if(color == userColor){
            choosePiece(position);
        }
        else if(chosenPiece != null){
            chooseMove(position);
        }
    }
}

function replacementPieceClicked(id){
    switch(id){
        case "pawn":
            chooseReplacementPiece(pieceTypes.pawn);
            break;
        case "knight":
            chooseReplacementPiece(pieceTypes.knight);
            break;
        case "bishop":
            chooseReplacementPiece(pieceTypes.bishop);
            break;
        case "rook":
            chooseReplacementPiece(pieceTypes.rook);
            break;
        case "queen":
            chooseReplacementPiece(pieceTypes.queen);
            break;
    }
}