'use strict';

document.addEventListener('DOMContentLoaded', function () {

  var board = [['', '', ''], ['', '', ''], ['', '', '']];

  board.spaceIsOpen = function (x, y) {
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

  board.move = function (player, x, y) {
    if (this.spaceIsOpen(x, y)) {
      this[y][x] = player;
      board.print();

      //check if game is has been won
      var winner = board.checkWin(x, y);
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
      var compTurn = board.currentGame.turn === board.currentGame.aISymbol;
      if (board.active && compTurn) {
        board.aIMove();
      }
    }
  };

  board.aIMove = function () {
    var y = Math.floor(Math.random() * board.length);
    var x = Math.floor(Math.random() * board.length);
    if (!board.spaceIsOpen(x, y)) {
      board.aIMove();
      return;
    }
    var pause = window.setTimeout(function () {
      board.move(board.currentGame.aISymbol, x, y);
    }, 400);
  };

  board.movesTillEnd = function () {
    var empties = 0;
    for (var i = 0; i < this.length; i++) {
      for (var j = 0; j < this.length; j++) {
        if (this[i][j] === '') {
          empties++;
        }
      }
    }
    return empties;
  };

  var message = document.getElementById('message');

  board.reset = function () {
    var box = void 0;
    for (var i = 0; i < this.length; i++) {
      for (var j = 0; j < this.length; j++) {
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

  board.checkHorizWin = function (x, y) {
    for (var i = 0; i < board[y].length - 1; i++) {
      if (board[y][i] !== board[y][i + 1] || !board[y][i]) {
        return false;
      }
    }
    return 'row' + y;
  };

  board.checkVertiWin = function (x, y) {
    for (var i = 0; i < board.length - 1; i++) {
      if (board[i][x] !== board[i + 1][x] || !board[i][x]) {
        return false;
      }
    }
    return 'col' + x;
  };

  board.checkDiagWin = function () {
    var ymax = board.length - 1;
    var diag0 = 'diag0';
    var diag1 = 'diag1';
    for (var i = 0; i < ymax; i++) {
      if (board[i][i] !== board[i + 1][i + 1] || !board[i][i]) {
        diag0 = false;
      }
    }
    for (var _i = 0; _i < board.length - 1; _i++) {
      if (board[ymax - _i][_i] !== board[ymax - (_i + 1)][_i + 1] || !board[ymax - _i][_i]) {
        diag1 = false;
      }
    }
    return diag0 || diag1;
  };

  board.checkWin = function (x, y) {
    return board.checkHorizWin(x, y) || board.checkVertiWin(x, y) || board.checkDiagWin();
  };

  // User interface functions
  board.print = function () {
    var box = void 0;
    var boxID = void 0;
    for (var y = 0; y < this.length; y++) {
      for (var x = 0; x < this.length; x++) {
        boxID = 'box' + y + '-' + x;
        box = document.getElementById(boxID);
        box.innerHTML = this[y][x];
      }
    }
  };

  board.highlight = function (winner) {
    var winType = winner.slice(0, -1);
    var coord = parseInt(winner.slice(-1));
    if (winType === 'row') {
      var rows = ['top', 'y-mid', 'bottom'];
      var targetBoxes = document.getElementsByClassName(rows[coord]);
      for (var i = 0; i < targetBoxes.length; i++) {
        targetBoxes[i].style.color = 'red';
      }
    } else if (winType === 'col') {
      var cols = ['left', 'x-mid', 'right'];
      var _targetBoxes = document.getElementsByClassName(cols[coord]);
      for (var _i2 = 0; _i2 < _targetBoxes.length; _i2++) {
        _targetBoxes[_i2].style.color = 'red';
      }
    } else if (winType === 'diag') {
      if (coord === 0) {
        var elem = void 0;
        for (var _i3 = 0; _i3 < board.length; _i3++) {
          elem = document.getElementById('box' + _i3 + '-' + _i3);
          elem.style.color = 'red';
        }
      } else {
        var _elem = void 0;
        for (var _i4 = 0; _i4 < board.length; _i4++) {
          _elem = document.getElementById('box' + (board.length - 1 - _i4) + '-' + _i4);
          _elem.style.color = 'red';
        }
      }
    }
  };

  board.active = true;

  var boxes = document.getElementsByClassName('box');

  for (var i = 0; i < boxes.length; i++) {
    boxes[i].addEventListener('click', function () {
      if (board.active) {

        //get box coordinates from DOM ID
        var x = parseInt(this.id.slice(3, 4));
        var y = parseInt(this.id.slice(5));

        //place X or Y and update DOM
        board.move(board.currentGame.turn, y, x);
      }
    });
  }

  reset = document.getElementById('reset');
  reset.addEventListener('click', function () {
    board.reset();
    options.style.display = 'block';
    game.style.display = 'none';
  });

  //initalize game state based on options selected
  var start = document.getElementById('start');
  var players = document.getElementById('players');
  var symbol = document.getElementById('symbol');
  var options = document.getElementById('options');
  var game = document.getElementById('game');

  players.addEventListener('click', function () {
    if (players.elements.players.value == 1) {
      symbol.style.visibility = 'visible';
    } else if (players.elements.players.value == 2) {
      symbol.style.visibility = 'hidden';
    }
  });

  start.addEventListener('click', function () {
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