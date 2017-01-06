$(document).ready(function() {

  //formats and displays the current expression to be evaluated
  function printInput(input) {
    var re = /[\d|.]/;
    var str = "";

    if (input.length === 0) {
      $('#input').text('');
    }
    for (var i = 0; i < input.length; i++) {
      if (re.test(input[i]) && re.test(input[i + 1])) {
        str += input[i];
      } else {
        str += (input[i] + ' ');
      }
    }
    $('#input').text(str);
  }

  //initialize globals for later use
  let inputArr = [];
  let resetFlag = false;

  //displays and stores operators and numbers when their button is pressed
  $(".expression").click(function() {
    //handles entries that follow a "=" press
    let numRe = /[\d.\(\)]/;
    let opRe = /[\/\*\+\-\^]/;
    let pressed = $(event.target).text();
    //if "=" is followed by an operator, apply it to the previous output
    if (resetFlag && opRe.test(pressed)) {
      inputArr = [$("#output").text()];
      $("#output").text('');
      resetFlag = false;
    //if "=" is followed by a number, reset input and output
    } else if (resetFlag) {
      inputArr = [];
      $("#output").text('');
      resetFlag = false;
    }
    //normal expression button presses
    inputArr.push(event.target.firstChild.nodeValue);
    inputArr = joinNums(inputArr);
    printInput(inputArr);
  });

  //clears display on AC press
  $("#AC").click(function() {
    inputArr = [];
    printInput(inputArr);
    $("#output").text('');
  });

  //evaluates inputArr on '=' press
  $("#equals").click(function() {
    let numRe = /\d/;
    let properDecimalsRe = /^\d*\.?\d+$/;
    inputArr = joinNums(inputArr);
    for (i = 0; i < inputArr.length; i++) {
      if (numRe.test(inputArr[i]) && properDecimalsRe.test(inputArr[i])){
        inputArr[i] = Number(inputArr[i]);
      }
      //this is kind of hacky
      //expressions with bad decimal use don't get converted to ints, and
      //any valid non-int entry in inputArr must be one character long
      if (typeof inputArr[i] === 'string' && inputArr[i].length > 1) {
        $("#output").text("Error: token decimal.");
        return false;
      }

      //check for missing operators next to parenthesis
      if ((inputArr[i] === '(' &&
        numRe.test(inputArr[i - 1])) ||
        (inputArr[i] === ')' &&
        numRe.test(inputArr[i + 1]))) {
          $("#output").text("No implicit multiplcation via parenthesis.");
          return false;
        }
    }
    let result = calculate(inputArr);
    $("#output").text(result);
    resetFlag = true;
  });

  //joins adjacent numbers and decimals into single strings
  function joinNums(arr) {
    let newArr = arr;
    var recursionFlag = false;
    var re = /(\d|\.)+/;
    for (var i = 0; i < newArr.length; i++) {
      if (re.test(newArr[i]) && re.test(newArr[i + 1])) {
        let before = newArr.slice(0, i);
        let result = [newArr[i].concat(newArr[i + 1])];
        let after = newArr.slice(i + 2);
        newArr = before.concat(result).concat(after);
        recursionFlag = true;
      }
    }
    if (recursionFlag) {
      return joinNums(newArr);
    }
    return newArr;
  }

  //function organizes an array with parenthesis into a nested array
  function calculate(arr) {
    //check if parenthesis match
    var lParCount = 0;
    var rParCount = 0;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] === '(') {
        lParCount++;
      } else if (arr[i] === ')') {
        rParCount++;
      }
    }
    if (rParCount !== lParCount) {
      return 'Error: mismatched parenthesis.';
    }
    //finds first instance of ( ... ) without inner parenthesis,
    //then elevates the contents of those parenthesis to a new array,
    //and restarts the search
    for (i = 0; i < arr.length; i++) {
      if (arr[i] === '(') {
        for (var j = i + 1; j < arr.length; j++) {
          if (arr[j] === '(') {
            break;
          } else if (arr[j] === ')') {
            let before = arr.slice(0, i);
            let result = pemdas(arr.slice(i + 1, j));
            let after = arr.slice(j + 1);
            arr = before.concat(result).concat(after);
            return calculate(arr);
          }
        }
      }
    }
    return pemdas(arr);
  }

  function parseExponents(arr) {
    let recursionFlag = false;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] === '^') {
        if(typeof arr[i-1] !== 'number' || typeof arr[i + 1] !== 'number') {
          return 'Error: token "^".';
        } else {
          let before = arr.slice(0, i - 1);
          let result = Math.pow(arr[i - 1], arr[i + 1]);
          let after = arr.slice(i + 2);
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
    let recursionFlag = false;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] === '*') {
        if(typeof arr[i-1] !== 'number' || typeof arr[i + 1] !== 'number') {
          return 'Error: token "*".';
        } else {
          let before = arr.slice(0, i - 1);
          let result = arr[i - 1] * arr[i + 1];
          let after = arr.slice(i + 2);
          arr = before.concat(result).concat(after);
          recursionFlag = true;
        }
      } else if (arr[i] === '/') {
          if(typeof arr[i-1] !== 'number' || typeof arr[i + 1] !== 'number') {
            return 'Error: token "/".';
        } else {
            let before = arr.slice(0, i - 1);
            let result = arr[i - 1] / arr[i + 1];
            let after = arr.slice(i + 2);
            arr = before.concat(result).concat(after);
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
    let recursionFlag = false;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] === '+') {
        if(typeof arr[i-1] !== 'number' || typeof arr[i + 1] !== 'number') {
          return 'Error: token "+".';
        } else {
          let before = arr.slice(0, i - 1);
          let result = arr[i - 1] + arr[i + 1];
          let after = arr.slice(i + 2);
          arr = before.concat(result).concat(after);
          recursionFlag = true;
        }
      } else if (arr[i] === '-') {
          if(typeof arr[i-1] !== 'number' || typeof arr[i + 1] !== 'number') {
            return 'Error: token "-".';
        } else {
            let before = arr.slice(0, i - 1);
            let result = arr[i - 1] - arr[i + 1];
            let after = arr.slice(i + 2);
            arr = before.concat(result).concat(after);
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
    arr = parseExponents(arr);
    arr = parseMultDiv(arr);
    arr = parseAddSub(arr);
    return arr;
  }
});
