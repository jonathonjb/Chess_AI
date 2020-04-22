function setupPieces(){
    logics.board[0][0] = [colors.black, pieceTypes.rook, moveChecks.hasNotMoved];
    placePieceImage(colors.black, pieceTypes.rook, [0, 0]);
    logics.board[0][7] = [colors.black, pieceTypes.rook, moveChecks.hasNotMoved];
    placePieceImage(colors.black, pieceTypes.rook, [0, 7]);

    logics.board[0][1] = [colors.black, pieceTypes.knight, moveChecks.hasNotMoved];
    placePieceImage(colors.black, pieceTypes.knight, [0, 1]);
    logics.board[0][6] = [colors.black, pieceTypes.knight, moveChecks.hasNotMoved];
    placePieceImage(colors.black, pieceTypes.knight, [0, 6]);

    logics.board[0][2] = [colors.black, pieceTypes.bishop, moveChecks.hasNotMoved];
    placePieceImage(colors.black, pieceTypes.bishop, [0, 2]);
    logics.board[0][5] = [colors.black, pieceTypes.bishop, moveChecks.hasNotMoved];
    placePieceImage(colors.black, pieceTypes.bishop, [0, 5]);

    logics.board[0][3] = [colors.black, pieceTypes.queen, moveChecks.hasNotMoved];
    placePieceImage(colors.black, pieceTypes.queen, [0, 3]);
    logics.board[0][4] = [colors.black, pieceTypes.king, moveChecks.hasNotMoved];
    placePieceImage(colors.black, pieceTypes.king, [0, 4]);

    for(let col = 0; col < logics.size; col++){
        logics.board[1][col] = [colors.black, pieceTypes.pawn, moveChecks.hasNotMoved];
        placePieceImage(colors.black, pieceTypes.pawn, [1, col]);
    }

    logics.board[7][0] = [colors.white, pieceTypes.rook, moveChecks.hasNotMoved];
    placePieceImage(colors.white, pieceTypes.rook, [7, 0]);
    logics.board[7][7] = [colors.white, pieceTypes.rook, moveChecks.hasNotMoved];
    placePieceImage(colors.white, pieceTypes.rook, [7, 7]);

    logics.board[7][1] = [colors.white, pieceTypes.knight, moveChecks.hasNotMoved];
    placePieceImage(colors.white, pieceTypes.knight, [7, 1]);
    logics.board[7][6] = [colors.white, pieceTypes.knight, moveChecks.hasNotMoved];
    placePieceImage(colors.white, pieceTypes.knight, [7, 6]);

    logics.board[7][2] = [colors.white, pieceTypes.bishop, moveChecks.hasNotMoved];
    placePieceImage(colors.white, pieceTypes.bishop, [7, 2]);
    logics.board[7][5] = [colors.white, pieceTypes.bishop, moveChecks.hasNotMoved];
    placePieceImage(colors.white, pieceTypes.bishop, [7, 5]);

    logics.board[7][3] = [colors.white, pieceTypes.queen, moveChecks.hasNotMoved];
    placePieceImage(colors.white, pieceTypes.queen, [7, 3]);
    logics.board[7][4] = [colors.white, pieceTypes.king, moveChecks.hasNotMoved];
    placePieceImage(colors.white, pieceTypes.king, [7, 4]);

    for(let col = 0; col < logics.size; col++){
        logics.board[6][col] = [colors.white, pieceTypes.pawn, moveChecks.hasNotMoved];
        placePieceImage(colors.white, pieceTypes.pawn, [6, col]);
    }

    /*logics.board[3][2] = [colors.black, pieceTypes.pawn, moveChecks.hasMoved];
    placePieceImage(colors.black, pieceTypes.pawn, [3, 2]);

    //logics.board[2][2] = enPassantVulnerable;

    logics.board[3][3] = [colors.white, pieceTypes.pawn, moveChecks.hasMoved];
    placePieceImage(colors.white, pieceTypes.pawn, [3, 3]);*/

    /*logics.board[5][4] = [colors.black, pieceTypes.queen, moveChecks.hasNotMoved];
    placePieceImage(colors.black, pieceTypes.queen, [5, 4]);*/
}