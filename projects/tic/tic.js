document.addEventListener('DOMContentLoaded', function() {

  let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];

  board.spaceIsOpen = function(x, y) {
    if (this[y][x] === '') {
      return true;
    } else {
      return false;
    }
  };

  board.currentGame = {
    useAI: true,
    humanSymbol: '',
    aISymbol: '',
    turn: 'X'
  };

  board.move = function(player, x, y) {
    if (this.spaceIsOpen(x, y)) {
      this[y][x] = player;
      board.print();

      //check if game is has been won
      let winner = board.checkWin(x, y);
      if (winner) {
        message.innerHTML = 'Player ' + board.currentGame.turn + ' wins!';
        board.highlight(winner);
        board.active = false;
        return;
      }

      //check for a tie
      if (board.movesTillEnd() === 0) {
        message.innerHTML = 'Tie game.';
        board.active = false;
        return;
      }

      //switch turns
      if (board.currentGame.turn === 'X') {
        board.currentGame.turn = 'O';
      } else {
        board.currentGame.turn = 'X';
      }

      //update message
      message.innerHTML = board.currentGame.turn + "'s move.";

      //check if next move is handled by AI
      let compTurn = board.currentGame.turn === board.currentGame.aISymbol;
      if (board.active && compTurn) {
        board.aIMove();
      }
    }

  };

  board.aIMove = function() {
    let y = Math.floor(Math.random() * board.length);
    let x = Math.floor(Math.random() * board.length);
    if (!board.spaceIsOpen(x, y)) {
      board.aIMove();
      return;
    }
    let pause = window.setTimeout(function() {
      board.move(board.currentGame.aISymbol, x, y);
    }, 400);
  };

  board.movesTillEnd = function() {
    let empties = 0;
    for (let i = 0; i < this.length; i++) {
      for (let j = 0; j < this.length; j++) {
        if (this[i][j] === '') {
          empties++;
        }
      }
    }
    return empties;
  };

  let message = document.getElementById('message');

  board.reset = function() {
    let box;
    for (let i = 0; i < this.length; i++) {
      for (let j = 0; j < this.length; j++) {
        this[i][j] = '';
        box = document.getElementById('box' + i + '-' + j);
        box.style.color = '#236ce0';
      }
    }
    board.currentGame.turn = 'X';
    board.currentGame.useAI = false;
    board.currentGame.humanSymbol = '';
    board.currentGame.aISymbol = '';
    message.innerHTML = "X's move.";
    board.print();
    board.active = true;
  };

  board.checkHorizWin = function(x, y) {
    for (let i = 0; i < board[y].length - 1; i++) {
      if (board[y][i] !== board[y][i + 1] || !board[y][i]) {
        return false;
      }
    }
    return 'row' + y;
  };

  board.checkVertiWin = function(x, y) {
    for (let i = 0; i < board.length - 1; i++) {
      if (board[i][x] !== board[i + 1][x] || !board[i][x]) {
        return false;
      }
    }
    return 'col' + x;
  };

  board.checkDiagWin = function() {
    let ymax = board.length - 1;
    let diag0 = 'diag0';
    let diag1 = 'diag1';
    for (let i = 0; i < ymax; i++) {
      if (board[i][i] !== board[i + 1][i + 1] || !board[i][i]) {
        diag0 = false;
      }
    }
    for (let i = 0; i < board.length - 1; i++) {
      if (board[ymax - i][i] !== board[ymax - (i + 1)][i + 1] || !board[ymax - i][i]) {
        diag1 = false;
      }
    }
    return diag0 || diag1;
  };

  board.checkWin = function(x, y) {
    return board.checkHorizWin(x, y) ||
           board.checkVertiWin(x, y) ||
           board.checkDiagWin();
  };

  // User interface functions
  board.print = function() {
    let box;
    let boxID;
    for (let y = 0; y < this.length; y++) {
      for (let x = 0; x < this.length; x++) {
        boxID = 'box' + y + '-' + x;
        box = document.getElementById(boxID);
        box.innerHTML = this[y][x];
      }
    }
  };

  board.highlight = function(winner) {
    let winType = winner.slice(0, -1);
    let coord = parseInt(winner.slice(-1));
    if (winType === 'row') {
      let rows = ['top', 'y-mid', 'bottom'];
      let targetBoxes = document.getElementsByClassName(rows[coord]);
      for (let i = 0; i < targetBoxes.length; i++) {
        targetBoxes[i].style.color = 'red';
      }
    } else if (winType === 'col') {
      let cols = ['left', 'x-mid', 'right'];
      let targetBoxes = document.getElementsByClassName(cols[coord]);
      for (let i = 0; i < targetBoxes.length; i++) {
        targetBoxes[i].style.color = 'red';
      }
    } else if (winType === 'diag') {
      if (coord === 0) {
        let elem;
        for (let i = 0; i < board.length; i++) {
          elem = document.getElementById('box' + i + '-' + i);
          elem.style.color = 'red';
        }
      } else {
        let elem;
        for (let i = 0; i < board.length; i++) {
          elem = document.getElementById('box' + ((board.length - 1) - i) + '-' + i);
          elem.style.color = 'red';
        }
      }
    }

  };

  board.active = true;

  let boxes = document.getElementsByClassName('box');

  for (let i = 0; i < boxes.length; i++) {
    boxes[i].addEventListener('click', function() {
      if (board.active) {

        //get box coordinates from DOM ID
        let x = parseInt(this.id.slice(3, 4));
        let y = parseInt(this.id.slice(5));

        //place X or Y and update DOM
        board.move(board.currentGame.turn, y, x);
      }
    });
  }

  reset = document.getElementById('reset');
  reset.addEventListener('click', function() {
    board.reset();
    options.style.display = 'block';
    game.style.display = 'none';
  });

  //initalize game state based on options selected
  let start = document.getElementById('start');
  let players = document.getElementById('players');
  let symbol = document.getElementById('symbol');
  let options = document.getElementById('options');
  let game = document.getElementById('game');

  players.addEventListener('click', function() {
    if (players.elements.players.value == 1) {
      symbol.style.visibility = 'visible';
    } else if (players.elements.players.value == 2) {
      symbol.style.visibility = 'hidden';
    }
  });


  start.addEventListener('click', function() {
    options.style.display = 'none';
    game.style.display = 'flex';
    board.reset();
    if (players.elements.players.value == 1) {
      board.currentGame.useAI = true;
      board.currentGame.humanSymbol = symbol.elements.symbol.value;
      if (board.currentGame.humanSymbol === 'X') {
        board.currentGame.aISymbol = 'O';
      } else {
        board.currentGame.aISymbol = 'X';
        board.aIMove();
      }
    }
  });
});
