'use strict';

$(document).ready(function () {

  //triggers #searchButton's click handler when enter is pressed while #searchBox is in focus
  $("#searchBox").keypress(function (event) {
    var keyCode = event.keyCode ? event.keyCode : event.which;
    if (keyCode == 13) {
      $('#searchButton').trigger('click');
    }
  });

  //function to handle clicking search button
  $('#searchButton').on('click', function () {

    //get text entered in search box and make a URL for the AJAX call
    var searchStr = $('#searchBox').val();
    var jsonStr = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + searchStr + "&limit=10&namespace=0&format=json";

    //blank input won't trigger search or page reformatting
    if (searchStr === "") {
      return false;
    }

    //AJAX request from Wikipedia's API
    $.ajax({
      url: jsonStr,
      data: {
        format: 'json'
      },
      dataType: 'jsonp'

      //callback to execute when JSON loads
    }).done(function (json) {

      //adds divs to #resultContainer
      for (var i = 0; i < json[1].length; i++) {
        var id = "#result".concat(i.toString());
        $("#resultContainer").append("<div id='result" + i.toString() + "' class='result'></div>");

        //adds title, first sentence, and link to each new div
        $(id).append("<header>".concat(json[1][i]).concat("</header>"));
        $(id).append("<p>".concat(json[2][i]).concat("</p>"));
        $(id).append("<a href='".concat(json[3][i]).concat("'>").concat(json[3][i]).concat("</a>"));
      }

      //handles no results found
      if (json[1].length === 0) {
        $("#resultHead").text("No results found.");
      }

      //removes the footer from its current position and appends it after the new result divs
      var detached = $("#resultFoot").detach();
      $("#resultContainer").append(detached);
    });

    //moves #randomBox off screen
    $("#randomBox").animate({
      left: "250%"
    }, 500);

    //makes #search moveable and then sends it off screen
    $("#search").css("position", "relative");
    $("#search").animate({
      left: "-150%"
    }, 1000);

    //fades out #splash
    $("#splash").fadeOut(900);

    //waits .7 seconds and then expenads previously hidden #resultContainer
    setTimeout(function () {
      $("#resultContainer").slideDown(500);
    }, 700);
  });
});