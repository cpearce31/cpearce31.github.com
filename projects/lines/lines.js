'use strict';

/*All script is insude JSONP callback to avoid async problems */
$.getJSON("https://en.wikiquote.org/w/api.php?action=parse&page=Opening%20lines&format=json&callback=?", function (json) {

  //gets a slice of wiki text that only contains quotes
  var toBeParsed = JSON.stringify(json.parse.text);
  toBeParsed = toBeParsed.slice(toBeParsed.indexOf('From'), toBeParsed.indexOf('<li>1801 – I have just returned'));

  //splits text into seperate quotes
  var quoteArray = [];
  var delim = "</li>\\n</ul>\\n";
  quoteArray = toBeParsed.split(delim);

  //removes blank entries left by splitting
  //TODO: figure out why split is leaving blank entries
  quoteArray = quoteArray.filter(function (entry) {
    return entry !== "";
  });

  //Regexes for filtering out non-text charachters
  var htmlRe = /<.+?>/g; //catches anything between HTML tags
  var alphabetHeaderRe = /[A-Z]\[edit\]\\n\\n/g; //catches "A"-"Z" headers
  var doubleNewLineRe = /\\n\\n/; //uses \n\n to find where the wuote stops and author/title begins
  var newLineRe = /\\n/g; //removes newlines
  var backslashRe = /\\"?n?/g; //removes backslashes used to escape double quotes
  var quoteInfoArray = [];
  //this loop removes all unwanted text in quoteArray and adds 'SPLITHERE' to denote where authorinfo begins
  for (var i = 0; i < quoteArray.length; i++) {
    quoteArray[i] = quoteArray[i].replace(htmlRe, '');
    quoteArray[i] = quoteArray[i].replace(alphabetHeaderRe, '');
    quoteArray[i] = quoteArray[i].replace(doubleNewLineRe, 'SPLITHERE');
    quoteArray[i] = quoteArray[i].replace(newLineRe, '');
    quoteArray[i] = quoteArray[i].replace(backslashRe, '');
    quoteInfoArray[i] = quoteArray[i].split('SPLITHERE');
  }
  quoteInfoArray.pop(); //removes last entry, which is empty

  //the following loop cleans up the author/title string and split into seperate array entries
  for (i = 0; i < quoteInfoArray.length; i++) {
    var commaIndex = quoteInfoArray[i][1].lastIndexOf(','); //finds the comma before 'by John Doe'
    quoteInfoArray[i][1] = quoteInfoArray[i][1].substr(0, commaIndex) + quoteInfoArray[i][1].substr(commaIndex + 1); //removes the comma
    if (quoteInfoArray[i][1].slice(-1) === '.') {
      //removes a period from the end of the string, if there is one
      quoteInfoArray[i][1] = quoteInfoArray[i][1].slice(0, -1);
    }
    var byIndex = quoteInfoArray[i][1].lastIndexOf(' by '); //last instance of 'by' indicates end of title and start of author name
    quoteInfoArray[i].push(quoteInfoArray[i][1].substr(byIndex + 4)); //adds author name to quoteInfoArray
    quoteInfoArray[i][1] = quoteInfoArray[i][1].slice(0, byIndex); //truncates title/author string to only include title
  }

  //function to choose and display a random quote and its author/title info
  var quoteIndex = 0;
  function newQuote() {
    quoteIndex = Math.floor(Math.random() * quoteInfoArray.length);
    $("#quote").html('"' + quoteInfoArray[quoteIndex][0] + '"');
    $("#title").html(quoteInfoArray[quoteIndex][1]);
    $("#author").html(quoteInfoArray[quoteIndex][2]);
  }

  newQuote(); //shows a quote on page load

  $("#newQuote").click(newQuote); //shows a quote when See Another button is clicked
});