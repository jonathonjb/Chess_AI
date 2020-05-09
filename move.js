function movePiece(startPosition, endPosition, currBoard){
    let piece = getPiece(startPosition, currBoard);

    // checks if we're attacking the piece that just executed the en passant; if so, removes the opponent's pawn
    if(piece[1] == pieceTypes.pawn && getPiece(endPosition, currBoard) == enPassantVulnerable){
        let oppPawnRow = piece[0] == colors.white ? endPosition[0] + 1 : endPosition[0] - 1;
        let oppPawnPos = [oppPawnRow, endPosition[1]];
        currBoard[oppPawnPos[0]][oppPawnPos[1]] = null;
    }
    removeEnPassantVulnerables(currBoard);
    currBoard[startPosition[0]][startPosition[1]] = null;
    currBoard[endPosition[0]][endPosition[1]] = piece;
    piece[2] = moveChecks.hasMoved;

    // if the move was a castling move, then it also moves the rook
    if(piece[1] == pieceTypes.king && Math.abs(startPosition[1] - endPosition[1]) > 1){
        // kingside castling
        if(endPosition[1] == 6){
            currBoard[endPosition[0]][5] = currBoard[endPosition[0]][7];
            getPiece([endPosition[0], 5], currBoard)[2] = moveChecks.hasMoved;
            currBoard[endPosition[0]][7] = null;
        }

        // queenside castlling
        if(endPosition[1] == 2){
            currBoard[endPosition[0]][3] = currBoard[endPosition[0]][0];
            getPiece([endPosition[0], 3], currBoard)[2] = moveChecks.hasMoved;
            currBoard[endPosition[0]][0] = null;
        }
    }

    // checks if the pawn has moved two spaces; if so, the space between will become en passant vulnerable
    if(piece[1] == pieceTypes.pawn && Math.abs(startPosition[0] - endPosition[0]) == 2){
        let additon = piece[0] == colors.white ? 1 : -1;
        currBoard[endPosition[0] + additon][endPosition[1]] = enPassantVulnerable;
    }
}

function getCurrMoves(color, currBoard){
    let moves = [];
    if(color == colors.white){
        moves = getWhiteMoves(currBoard);
    }
    else{
        moves = getBlackMoves(currBoard);
    }
    return moves;
}

function getWhiteMoves(currBoard){
    let moves = [];
    for(let row = 0; row < logics.size; row++){
        for(let col = 0; col < logics.size; col++){
            let position = [row, col];
            if(!isEmpty(position, currBoard)){
                let piece = getPiece(position, currBoard);
                if(piece[0] == colors.white){
                    let pieceMoves = getPieceMoves(piece, position, currBoard);
                    if(pieceMoves.length > 0){
                        moves.push([position, pieceMoves]);
                    }
                }
            }
        }
    }
    return moves;
}

function getBlackMoves(currBoard){
    let moves = [];

    for(let row = 0; row < logics.size; row++){
        for(let col = 0; col < logics.size; col++){
            let position = [row, col];
            if(!isEmpty(position, currBoard)){
                let piece = getPiece(position, currBoard);
                if(piece[0] == colors.black){
                    let pieceMoves = getPieceMoves(piece, position, currBoard);
                    if(pieceMoves.length > 0){
                        moves.push([position, pieceMoves]);
                    }
                }
            }
        }
    }
    return moves;
}

/**
 * moves: list of lists; list of elements; each elements have 2 items inside. The first item is the starting position. The 2nd item is 
 * the list of end moves which can be made from the start position.
 * 
 * @param {*} piece 
 * @param {*} position 
 * @param {*} currBoard 
 */

function getPieceMoves(piece, position, currBoard){
    let moves = [];
    switch(piece[1]){
        case pieceTypes.pawn:
            moves = getPawnMoves(position, currBoard);
            break;
        case pieceTypes.knight:
            moves = getKnightMoves(position, currBoard);
            break;
        case pieceTypes.bishop:
            moves = getBishopMoves(position, currBoard);
            break;
        case pieceTypes.rook:
            moves = getRookMoves(position, currBoard);
            break;
        case pieceTypes.queen:
            moves = getQueenMoves(position, currBoard);
            break;
        case pieceTypes.king:
            moves = getKingMoves(position, currBoard);
            break;
    }
    return moves;
}

function getPawnMoves(position, currBoard){
    let row = position[0];
    let col = position[1];
    let currentTurn = getPiece(position, currBoard)[0];
    moves = [];
    let multiplier = currentTurn == colors.white ? -1 : 1;

    let nextPostition = [row + (1 * multiplier), col];
    if(isEmpty(nextPostition, currBoard)){
        moves.push(nextPostition);

        // checks if double space moves are possible
        nextPostition = [row + (2 * multiplier), col];
        let rowCheck = currentTurn == colors.white ? 6 : 1;
        if(rowCheck == row && isEmpty(nextPostition, currBoard)){
            moves.push(nextPostition);
        }
    }

    // checks if pawn can attack left (for white)
    nextPostition = [row + (1 * multiplier), col - 1];
    if(!isEmpty(nextPostition, currBoard) && inBounds(nextPostition)){
        let piece = getPiece(nextPostition, currBoard);
        if(piece == enPassantVulnerable || piece[0] != currentTurn){
            moves.push(nextPostition);
        }
    }

    // checks if pawn can attack right (for white)
    nextPostition = [row + (1 * multiplier), col + 1];
    if(!isEmpty(nextPostition, currBoard) && inBounds(nextPostition)){
        let piece = getPiece(nextPostition, currBoard);
        if(piece == enPassantVulnerable || piece[0] != currentTurn){
            moves.push(nextPostition);
        }
    }

    return moves;
}

function getRookMoves(position, currBoard){
    let row = position[0];
    let col = position[1];
    let currentTurn = getPiece(position, currBoard)[0];
    moves = [];

    // left
    let nextPostition = [row, col - 1];
    while(isEmpty(nextPostition, currBoard)){
        moves.push(nextPostition);
        nextPostition = [row, nextPostition[1] - 1];
    }
    if(inBounds(nextPostition) && getPiece(nextPostition, currBoard)[0] != currentTurn){
        moves.push(nextPostition);
    }

    // right
    nextPostition = [row, col + 1];
    while(isEmpty(nextPostition, currBoard)){
        moves.push(nextPostition);
        nextPostition = [row, nextPostition[1] + 1];
    }
    if(inBounds(nextPostition) && getPiece(nextPostition, currBoard)[0] != currentTurn){
        moves.push(nextPostition);
    }

    // up
    nextPostition = [row + 1, col];
    while(isEmpty(nextPostition, currBoard)){
        moves.push(nextPostition);
        nextPostition = [nextPostition[0] + 1, col];
    }
    if(inBounds(nextPostition) && getPiece(nextPostition, currBoard)[0] != currentTurn){
        moves.push(nextPostition);
    }

    // down
    nextPostition = [row - 1, col];
    while(isEmpty(nextPostition, currBoard)){
        moves.push(nextPostition);
        nextPostition = [nextPostition[0] - 1, col];
    }
    if(inBounds(nextPostition) && getPiece(nextPostition, currBoard)[0] != currentTurn){
        moves.push(nextPostition);
    }

    return moves;
}

function getKnightMoves(position, currBoard){
    let row = position[0];
    let col = position[1];
    let currentTurn = getPiece(position, currBoard)[0];
    moves = [];

    for(let rowChange = -2; rowChange <= 2; rowChange += 4){
        for(let colChange = -1; colChange <= 1; colChange += 2){
            let nextPostition = [row + rowChange, col + colChange];
            if(isEmpty(nextPostition, currBoard) || (inBounds(nextPostition) && getPiece(nextPostition, currBoard)[0] != currentTurn)){
                moves.push(nextPostition);
            }
        }
    }

    for(let colChange = -2; colChange <= 2; colChange += 4){
        for(let rowChange = -1; rowChange <= 1; rowChange += 2){
            let nextPostition = [row + rowChange, col + colChange];
            if(isEmpty(nextPostition, currBoard) || (inBounds(nextPostition) && getPiece(nextPostition, currBoard)[0] != currentTurn)){
                moves.push(nextPostition);
            }
        }
    }

    return moves;
}

function getBishopMoves(position, currBoard){
    let row = position[0];
    let col = position[1];
    let currentTurn = getPiece(position, currBoard)[0];
    moves = [];

    // up left
    let nextPostition = [row - 1, col - 1];
    while(isEmpty(nextPostition, currBoard)){
        moves.push(nextPostition);
        nextPostition = [nextPostition[0] - 1, nextPostition[1] - 1];
    }
    if(inBounds(nextPostition) && getPiece(nextPostition, currBoard)[0] != currentTurn){
        moves.push(nextPostition);
    }

    // up right
    nextPostition = [row - 1, col + 1];
    while(isEmpty(nextPostition, currBoard)){
        moves.push(nextPostition);
        nextPostition = [nextPostition[0] - 1, nextPostition[1] + 1];
    }
    if(inBounds(nextPostition) && getPiece(nextPostition, currBoard)[0] != currentTurn){
        moves.push(nextPostition);
    }

    // down left
    nextPostition = [row + 1, col - 1];
    while(isEmpty(nextPostition, currBoard)){
        moves.push(nextPostition);
        nextPostition = [nextPostition[0] + 1, nextPostition[1] - 1];
    }
    if(inBounds(nextPostition) && getPiece(nextPostition, currBoard)[0] != currentTurn){
        moves.push(nextPostition);
    }

    // down right
    nextPostition = [row + 1, col + 1];
    while(isEmpty(nextPostition, currBoard)){
        moves.push(nextPostition);
        nextPostition = [nextPostition[0] + 1, nextPostition[1] + 1];
    }
    if(inBounds(nextPostition) && getPiece(nextPostition, currBoard)[0] != currentTurn){
        moves.push(nextPostition);
    }

    return moves;
}

function getQueenMoves(position, currBoard){
    moves = []
    moves = moves.concat(getRookMoves(position, currBoard));
    moves = moves.concat(getBishopMoves(position, currBoard));
    return moves;
}

function getKingMoves(position, currBoard){
    let row = position[0];
    let col = position[1];
    let currentTurn = getPiece(position, currBoard)[0];
    moves = [];

    for(let rowChange = -1; rowChange <= 1; rowChange++){
        for(let colChange = -1; colChange <= 1; colChange++){
            if(rowChange == 0 && colChange == 0){
                continue;
            }
            let nextPostition = [row + rowChange, col + colChange];
            if(!inBounds(nextPostition)){
                continue;
            }
            if(isEmpty(nextPostition, currBoard) || getPiece(nextPostition, currBoard)[0] != currentTurn){
                moves.push(nextPostition);
            }
        }
    }

    // checks if kingside castling is available
    let rowCheck = currentTurn == colors.white ? 7 : 0;
    let endPiece = getPiece([rowCheck, 7], currBoard);
    if(endPiece != null){
        let rookIsValid = endPiece[1] == pieceTypes.rook && endPiece[2] == moveChecks.hasNotMoved;
        let kingIsValid = getPiece(position, currBoard)[2] == moveChecks.hasNotMoved;
        let emptyAreaBetween = isEmpty([rowCheck, 5], currBoard) && isEmpty([rowCheck, 6], currBoard);
        if(rookIsValid && kingIsValid && emptyAreaBetween){
            nextPostition = [rowCheck, 6];
            moves.push(nextPostition);
        }
    }

    // checks if queenside castling is available
    rowCheck = currentTurn == colors.white ? 7 : 0;
    endPiece = getPiece([rowCheck, 0], currBoard);

    if(endPiece != null){
        rookIsValid = endPiece[1] == pieceTypes.rook && endPiece[2] == moveChecks.hasNotMoved;
        kingIsValid = getPiece(position, currBoard)[2] == moveChecks.hasNotMoved;
        emptyAreaBetween = isEmpty([rowCheck, 1], currBoard) && isEmpty([rowCheck, 2], currBoard) && isEmpty([rowCheck, 3], currBoard);
        if(rookIsValid && kingIsValid && emptyAreaBetween){
            nextPostition = [rowCheck, 2];
            moves.push(nextPostition);
        }
    }
    
    return moves;
}