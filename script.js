let oringBoard;
const huPlayer = "O";
const aiPlayer = "X";
const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
]

const cells = document.querySelectorAll('.cell');
startGame();
function startGame() {
    document.querySelector(".endgame").style.display = "none"
    oringBoard = Array.from(Array(9).keys())
    for(let i = 0; i < cells.length; i++){
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false)
    }
}

function turnClick(square) {
    if (typeof oringBoard[square.target.id] === "number") {
        turn(square.target.id, huPlayer);
        if (!checkWin(oringBoard, huPlayer) && !checkTie()) {
            setTimeout(() => {
                turn(bestSpot(), aiPlayer);
            }, 100); 
        }
    }
}
function turn(squareId, player){
    oringBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(oringBoard, player)
    if (gameWon) gameOver(gameWon)
}

function checkWin (board, player){
    let plays = board.reduce((a, e, i) =>
    (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let [index, win] of winCombos.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = {index: index, player: player};
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon){
    for( let index of winCombos[gameWon.index]){
        document.getElementById(index).style.backgroundColor =
        gameWon.player == huPlayer ? "blue" : "red";
    }
    for (var i = 0; i <cells.length; i++){
        cells[i].removeEventListener('click', turnClick, false)
    }
    declareWinner(gameWon.player == huPlayer ? "You Win" : "You Lose" )
}

function declareWinner(who){
    
    document.querySelector(".endgame").style.display = "block"
    document.querySelector(".endgame .text").innerText = who;
}

function emptySquares(){
    return oringBoard.filter(s => typeof s == "number" )
}
function bestSpot(){
    return minmax(oringBoard, aiPlayer).index;
}

function checkTie(){
    if (emptySquares().length == 0){
        for(let i = 0; i< cells.length; i++){
            cells[i].removeEventListener('click', turnClick, false) 
        }
        declareWinner("tie Game")
        return true
    }
    return false;
}

function minmax(newBoard, player) {
    let availSpots = emptySquares(newBoard);

    if (checkWin(newBoard, huPlayer)) {
        return { score: -10 };
    } else if (checkWin(newBoard, aiPlayer)) {
        return { score: 20 };
    } else if (availSpots.length === 0) {
        return { score: 0 };
    }
    let moves = [];
    for (let i = 0; i < availSpots.length; i++) {
        let move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;

        if (player === aiPlayer) {
            let result = minmax(newBoard, huPlayer);
            move.score = result.score;
        } else {
            let result = minmax(newBoard, aiPlayer);
            move.score = result.score;
        }

        newBoard[availSpots[i]] = move.index;
        moves.push(move);
    }
    let bestMove;
    if (player === aiPlayer) {
        let bestScore = -10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}
function bestSpot() {
    return minmax(oringBoard, aiPlayer).index;
}

