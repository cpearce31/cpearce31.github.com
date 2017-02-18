'use strict';

window.onload = function () {

  var inputDisplay = document.querySelector('#input');
  var expressions = document.querySelectorAll('.expression');
  var output = document.querySelector('#output');
  var clear = document.querySelector('#AC');
  var equals = document.querySelector('#equals');

  //  formats and displays the current expression to be evaluated
  function printInput(input) {
    console.log(input);
    var re = /[\d|.]/;
    var str = '';

    if (input.length === 0) {
      input.textContent = '';
    }
    for (var i = 0; i < input.length; i++) {
      if (re.test(input[i]) && re.test(input[i + 1])) {
        str += input[i];
      } else {
        str += input[i] + ' ';
      }
    }
    console.log();
    inputDisplay.textContent = str;
  }

  var inputArr = [];
  var resetFlag = false;

  // displays and stores operators and numbers when their button is pressed
  var btnPress = function btnPress(e) {
    console.log('handler fired');
    // handles entries that follow a "=" press
    var opRe = /[/*+\-^]/;
    var pressed = e.target.textContent;
    console.log(pressed);
    // if "=" is followed by an operator, apply it to the previous output
    if (resetFlag && opRe.test(pressed)) {
      inputArr = [output.textContent];
      output.textContent = '';
      resetFlag = false;
      // if "=" is followed by a number, reset input and output
    } else if (resetFlag) {
      inputArr = [];
      output.textContent = '';
      resetFlag = false;
    }
    // normal expression button presses
    inputArr.push(event.target.firstChild.nodeValue);
    inputArr = joinNums(inputArr);
    console.log(inputArr);
    printInput(inputArr);
  };

  for (var i = 0; i < expressions.length; i++) {
    expressions[i].addEventListener('click', btnPress);
  }

  // clears display on AC press
  clear.addEventListener('click', function () {
    inputArr = [];
    printInput(inputArr);
    output.textContent = '';
  });

  //evaluates inputArr on '=' press
  equals.addEventListener('click', function () {
    console.log('clicked equals');
    var numRe = /\d/;
    var properDecimalsRe = /^\d*\.?\d+$/;
    inputArr = joinNums(inputArr);
    for (var _i = 0; _i < inputArr.length; _i++) {
      if (numRe.test(inputArr[_i]) && properDecimalsRe.test(inputArr[_i])) {
        inputArr[_i] = Number(inputArr[_i]);
      }
      // this is kind of hacky
      // expressions with bad decimal use don't get converted to ints, and
      // any valid non-int entry in inputArr must be one character long
      if (typeof inputArr[_i] === 'string' && inputArr[_i].length > 1) {
        output.textContent = "Error: token decimal.";
        return false;
      }

      // check for missing operators next to parenthesis
      if (inputArr[_i] === '(' && numRe.test(inputArr[_i - 1]) || inputArr[_i] === ')' && numRe.test(inputArr[_i + 1])) {
        output.textContent = "No implicit multiplcation via parenthesis.";
        return false;
      }
    }
    console.log('about to calculate');
    var result = calculate(inputArr);
    console.log(result + '< thats the result');
    output.textContent = result;
    console.log(document.querySelector('#output'));
    resetFlag = true;
  });

  // joins adjacent numbers and decimals into single strings
  function joinNums(arr) {
    var newArr = arr;
    var recursionFlag = false;
    var re = /(\d|\.)+/;
    for (var _i2 = 0; _i2 < newArr.length; _i2++) {
      if (re.test(newArr[_i2]) && re.test(newArr[_i2 + 1])) {
        var before = newArr.slice(0, _i2);
        var result = [newArr[_i2].concat(newArr[_i2 + 1])];
        var after = newArr.slice(_i2 + 2);
        newArr = before.concat(result).concat(after);
        recursionFlag = true;
      }
    }
    if (recursionFlag) {
      return joinNums(newArr);
    }
    return newArr;
  }

  // function organizes an array with parenthesis into a nested array
  function calculate(arr) {
    // check if parenthesis match
    var lParCount = 0;
    var rParCount = 0;
    for (var _i3 = 0; _i3 < arr.length; _i3++) {
      if (arr[_i3] === '(') {
        lParCount++;
      } else if (arr[_i3] === ')') {
        rParCount++;
      }
    }
    if (rParCount !== lParCount) {
      return 'Error: mismatched parenthesis.';
    }
    // finds first instance of ( ... ) without inner parenthesis,
    // then elevates the contents of those parenthesis to a new array,
    // and restarts the search
    for (var _i4 = 0; _i4 < arr.length; _i4++) {
      if (arr[_i4] === '(') {
        for (var j = _i4 + 1; j < arr.length; j++) {
          if (arr[j] === '(') {
            break;
          } else if (arr[j] === ')') {
            var before = arr.slice(0, _i4);
            var result = pemdas(arr.slice(_i4 + 1, j));
            var after = arr.slice(j + 1);
            arr = before.concat(result).concat(after);
            return calculate(arr);
          }
        }
      }
    }
    console.log('about to return calculate func');
    console.log(pemdas(arr));
    return pemdas(arr);
  }

  function parseExponents(arr) {
    var recursionFlag = false;
    for (var _i5 = 0; _i5 < arr.length; _i5++) {
      if (arr[_i5] === '^') {
        if (typeof arr[_i5 - 1] !== 'number' || typeof arr[_i5 + 1] !== 'number') {
          return 'Error: token "^".';
        } else {
          var before = arr.slice(0, _i5 - 1);
          var result = Math.pow(arr[_i5 - 1], arr[_i5 + 1]);
          var after = arr.slice(_i5 + 2);
          arr = before.concat(result).concat(after);
          recursionFlag = true;
        }
      }
    }
    if (recursionFlag) {
      return parseExponents(arr);
    } else {
      return arr;
    }
  }

  function parseMultDiv(arr) {
    var recursionFlag = false;
    for (var _i6 = 0; _i6 < arr.length; _i6++) {
      if (arr[_i6] === '*') {
        if (typeof arr[_i6 - 1] !== 'number' || typeof arr[_i6 + 1] !== 'number') {
          return 'Error: token "*".';
        } else {
          var before = arr.slice(0, _i6 - 1);
          var result = arr[_i6 - 1] * arr[_i6 + 1];
          var after = arr.slice(_i6 + 2);
          arr = before.concat(result).concat(after);
          recursionFlag = true;
        }
      } else if (arr[_i6] === '/') {
        if (typeof arr[_i6 - 1] !== 'number' || typeof arr[_i6 + 1] !== 'number') {
          return 'Error: token "/".';
        } else {
          var _before = arr.slice(0, _i6 - 1);
          var _result = arr[_i6 - 1] / arr[_i6 + 1];
          var _after = arr.slice(_i6 + 2);
          arr = _before.concat(_result).concat(_after);
          recursionFlag = true;
        }
      }
    }
    if (recursionFlag) {
      return parseMultDiv(arr);
    } else {
      return arr;
    }
  }

  function parseAddSub(arr) {
    var recursionFlag = false;
    for (var _i7 = 0; _i7 < arr.length; _i7++) {
      if (arr[_i7] === '+') {
        if (typeof arr[_i7 - 1] !== 'number' || typeof arr[_i7 + 1] !== 'number') {
          return 'Error: token "+".';
        } else {
          var before = arr.slice(0, _i7 - 1);
          var result = arr[_i7 - 1] + arr[_i7 + 1];
          var after = arr.slice(_i7 + 2);
          arr = before.concat(result).concat(after);
          recursionFlag = true;
        }
      } else if (arr[_i7] === '-') {
        if (typeof arr[_i7 - 1] !== 'number' || typeof arr[_i7 + 1] !== 'number') {
          return 'Error: token "-".';
        } else {
          var _before2 = arr.slice(0, _i7 - 1);
          var _result2 = arr[_i7 - 1] - arr[_i7 + 1];
          var _after2 = arr.slice(_i7 + 2);
          arr = _before2.concat(_result2).concat(_after2);
          recursionFlag = true;
        }
      }
    }
    if (recursionFlag) {
      return parseAddSub(arr);
    } else {
      return arr;
    }
  }

  function pemdas(arr) {
    var answer = arr;
    answer = parseExponents(answer);
    answer = parseMultDiv(answer);
    answer = parseAddSub(answer);
    console.log('done pemdasing');
    return answer;
  }
};