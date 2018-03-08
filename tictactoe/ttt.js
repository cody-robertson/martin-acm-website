function fillSpot(spot, player) {
  // function that takes the spot and the player and returns the html to fill the spot.
  var html = "<h2>" + player + "</h2>";
  return html;
};

function removeSpot(spot, array) {
  // function that will remove a number from an array;
  for (var i = 0; i < array.length; i++) {
    if (spot == array[i]) {
      array.splice(i, 1);
    }
  }
  return array;
}

function isIn(num, array) {
  // checks if spot on board is taken or not
  for (var i = 0; i < array.length; i++) {
    if (num == array[i]) {
      return true;
    }
  }
  return false;
}

function blockNeeded(array, openSpots) {
  // if player is only 1 away from winning, returns spot needed to block
  var block = 0;
  var winArray = ["123", "456", "789", "147", "258", "369", "159", "357"];
  for (var i = 0; i < winArray.length; i++) {
    var winNums = winArray[i].split("");
    for (var j = 0; j < winNums.length; j++) {
      for (var k = 0; k < array.length; k++) {
        if (winNums[j] == array[k]) {
          block++;
        }
      }
      if (block == 2) {
        winNums = winArray[i].split("");
        for (var k = 0; k < winNums.length; k++) {
          for (var l = 0; l < array.length; l++) {
            if (array[l] == winNums[k]) {
              winNums.splice(k, 1, "0");
            }
          }
        }
        // if spot is available take it
        for (var m = 0; m < winNums.length; m++) {
          if (winNums[m] != "0") {
            for (var n = 0; n < openSpots.length; n++) {
              if (winNums[m] == openSpots[n]) {
                return winNums[m];
              }
            }
          }
        }
      }
    }
    block = 0;
  }
  return false;
}

function isWinner(array) {
  var win = 0;
  // returns true if user is a winner
  var winArray = ["123", "456", "789", "147", "258", "369", "159", "357"];
  for (var i = 0; i < winArray.length; i++) {
    var winNums = winArray[i].split("");
    for (var j = 0; j < winNums.length; j++) {
      for (var k = 0; k < array.length; k++) {
        if (winNums[j] == array[k]) {
          win++;
        }
      }
    }
    if (win == 3) {
      return true;
    } else {
      win = 0;
    }
  }
  return false;
}

function bestMove(player1, player2, turnNum, openSpots) {
  // looks at moves by player 1 and returns best move for player 2
  // beginning is just best possible moves
  if (turnNum == 1) {
    return 5;
  }
  if (turnNum == 2) {
    if ((player1[0] == 1) || (player1[0] == 3) || (player1[0] == 7 || player1[0] == 9)) {
      return 5;
    }
    if (player1[0] == 5) {
      return 1;
    }
    if ((player1[0] == 2) || (player1[0] == 4) || (player1[0] == 6) || (player1[0] == 8)) {
      return 5;
    }
  }
  if (turnNum == 3) {
    if ((player1[0] == 2) || (player1[0] == 4) || (player1[0] == 6) || (player1[0] == 8)) {
      return 1;
    } else {
      return 2;
    }
  }
  if (turnNum == 4) {
    if ((player1[0] == 1) && (player1[1] == 8)) {
      return 7;
    }
    if ((player1[0] == 5) && (player1[1] == 9)) {
      return 3;
    }
  }
  if (turnNum == 5) {
    if ((player1[0] == 1) && (player1[1] == 8)) {
      return 7;
    }
    if ((player1[0] == 3) && (player1[1] == 8)) {
      return 9;
    }
  }
  // if there is a move that wins immediatley, return that
  for (var i = 1; i < 10; i++) {
    var tempArray = [];
    if (isIn(i, openSpots)) {
      for (var j = 0; j < player2.length; j++) {
        tempArray.push(player2[j]);
      }
      tempArray.push(i)
    }
    if (isWinner(tempArray)) {
      return i;
    }
  }
  // if there is a block needed, return that.
  if (blockNeeded(player1, openSpots)) {
    return blockNeeded(player1, openSpots);
  }
  return openSpots[0];
}

$(document).ready(function() {
  // spots on board available to pick
  // everytime a spot is chosen it is removed from array;
  var available = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  // variable to hold all different spots on board
  var playerSpots = [];
  var compSpots = [];
  var player = "";
  var comp = "";
  var turn = "";
  var id = "";
  var turnNumber = 1;
  var compScore = 0;
  var playerScore = 0;
  var newGame = false;

  // player picks piece
  $(".choice").click(function() {
    if (player == "") {
      if (this.id == "X") {
        player = "X";
        comp = "O";
        $("#O").fadeOut();
      } else {
        player = "O";
        comp = "X";
        $("#X").fadeOut();
        // if player picked 0 -> computer goes first
        id = bestMove(playerSpots, compSpots, turnNumber, available);
        $("#" + id).html(fillSpot(id, comp));
        available = removeSpot(id, available);
        compSpots.push(id);
        turnNumber++;
      }
    }
  });

  // when table is clicked player moves followed by comp
  $(".square").click(function() {
    if (player != "") {
      id = this.id;
      // make sure spot isn't taken
      if (isIn(id, available)) {
        playerSpots.push(id);
        available = removeSpot(id, available);
        $("#" + id).html(fillSpot(id, player));
        turn = "computer";
        turnNumber++;
        // if player wins restart
        if (isWinner(playerSpots)) {
          newGame = true;
          playerScore++;
          alert("You Win");
        }
        if (newGame == false) {
          id = bestMove(playerSpots, compSpots, turnNumber, available);
          $("#" + id).html(fillSpot(id, comp));
          available = removeSpot(id, available);
          compSpots.push(id);
          turnNumber++;
          // if computer wins restart
          if (newGame == false) {
            if (isWinner(compSpots)) {
              newGame = true;
              compScore++;
              alert("You Lose");
            }
          }
        }
        // if board is full declare tie
        if (available.length < 1) {
          newGame = true;
          alert("Tie");
        }
      }
      // if someone has won
      if (newGame == true) {
        // clear board
        for (var i = 1; i < 10; i++) {
          $("#" + i).html(fillSpot(i, ""));
        }
        // reset all the variables
        (player == "X") ? $("#O").fadeIn(): $("#X").fadeIn();
        available = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
        playerSpots = [];
        compSpots = [];
        player = "";
        comp = "";
        turn = "";
        id = "";
        turnNumber = 1;
        newGame = false;
      }
    }
    // update scores
    $(".playerScore").html("<h3>Player -> " + playerScore);
    $(".computerScore").html("<h3>Computer -> " + compScore);
  })
});