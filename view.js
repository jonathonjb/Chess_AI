const backgrounds = {
    light: "rgb(242, 242, 242)", 
    dark: "rgb(115, 115, 115)"
};

const imagePaths = {
    whiteKing: "Images/whiteKing.png",
    whiteQueen: "Images/whiteQueen.png",
    whiteRook: "Images/whiteRook.png",
    whiteBishop: "Images/whiteBishop.png",
    whiteKnight: "Images/whiteKnight.png",
    whitePawn: "Images/whitePawn.png",
    blackKing: "Images/blackKing.png",
    blackQueen: "Images/blackQueen.png",
    blackRook: "Images/blackRook.png",
    blackBishop: "Images/blackBishop.png",
    blackKnight: "Images/blackKnight.png",
    blackPawn: "Images/blackPawn.png"
};

visualBoard = [];

function initializeView(){
    let tiles = document.getElementsByClassName("tile");

    let visualBoardRow = [];
    let row = 0;
    let col = 0;
    let alt = true;
    for(let i = 0; i < tiles.length; i++){
        tiles[i].setAttribute("id", row + "" + col)
        tiles[i].style.background = alt ? backgrounds.light : backgrounds.dark;
        visualBoardRow.push(tiles[i]);

        col++;
        if(col == logics.size){
            col = 0;
            row++;
            alt = !alt;

            visualBoard.push(visualBoardRow);
            visualBoardRow = [];
        }
        alt = !alt;
    }

    //initializeInfoBox();
}

function makeViewMatchBoard(){
    clearBoard();
    for(let row = 0; row < logics.size; row++){
        for(let col = 0; col < logics.size; col++){
            position = [row, col];
            if(!isEmpty(position, logics.board)){
                let piece = getPiece(position, logics.board);
                placePieceImage(piece[0], piece[1], position);
            }
        }
    }
}

function clearBoard(){
    for(let row = 0; row < logics.size; row++){
        for(let col = 0; col < logics.size; col++){
            position = [row, col];
            removePieceImage(position);
        }
    }
}

function placePieceImage(color, piece, position){
    let tile = visualBoard[position[0]][position[1]];
    let pieceImage = document.createElement("img");
    if(color == colors.white){
        switch(piece){
            case pieceTypes.pawn:
                pieceImage.setAttribute("src", imagePaths.whitePawn);
                break;
            case pieceTypes.knight:
                pieceImage.setAttribute("src", imagePaths.whiteKnight);
                break;
            case pieceTypes.bishop:
                pieceImage.setAttribute("src", imagePaths.whiteBishop);
                break;
            case pieceTypes.rook:
                pieceImage.setAttribute("src", imagePaths.whiteRook);
                break;
            case pieceTypes.queen:
                pieceImage.setAttribute("src", imagePaths.whiteQueen);
                break;
            case pieceTypes.king:
                pieceImage.setAttribute("src", imagePaths.whiteKing);
                break;
        }
    }
    else if(color == colors.black){
        switch(piece){
            case pieceTypes.pawn:
                pieceImage.setAttribute("src", imagePaths.blackPawn);
                break;
            case pieceTypes.knight:
                pieceImage.setAttribute("src", imagePaths.blackKnight);
                break;
            case pieceTypes.bishop:
                pieceImage.setAttribute("src", imagePaths.blackBishop);
                break;
            case pieceTypes.rook:
                pieceImage.setAttribute("src", imagePaths.blackRook);
                break;
            case pieceTypes.queen:
                pieceImage.setAttribute("src", imagePaths.blackQueen);
                break;
            case pieceTypes.king:
                pieceImage.setAttribute("src", imagePaths.blackKing);
                break;
        }
    }
    tile.appendChild(pieceImage);
}

function removePieceImage(position){
    let tile = visualBoard[position[0]][position[1]];
    if(tile.childElementCount > 0){
        tile.removeChild(tile.childNodes[0]);
    }
}

function enableTile(position){
    let tile = visualBoard[position[0]][position[1]];
    tile.style.cursor = 'pointer';
}

function disableTile(position){
    let tile = visualBoard[position[0]][position[1]];
    tile.style.cursor = 'auto';
}

function openWhitePieceChooser(){
    let box = document.getElementById("whiteChoosePieceBox");
    box.style.display = "inline-flex";
}

function openBlackPieceChooser(){
    let box = document.getElementById("blackChoosePieceBox");
    box.style.display = "inline-flex";
}

function closeChoosers(){
    let box = document.getElementById("whiteChoosePieceBox");
    box.style.display = "none";
    box = document.getElementById("blackChoosePieceBox");
    box.style.display = "none";
}