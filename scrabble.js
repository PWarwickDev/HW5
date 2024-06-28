/*
File: scrabble.js
GUI Assignment: HW5Implementing a Bit of Scrabble with Drag-and-Drop
Paul Warwick, UMass Lowell Computer Science, paul_warwick@student.uml.edu
Copyright (c) 2024 by Paul Warwick. All rights reserved. May be freely copied or
excerpted for educational purposes with credit to the author.
updated by PW on 6/27/2024 at 10:57 pm.

Description: JavaScript file to manipulate html and css and make dynamic additions to the scrabble game.
*/

$(document).ready(function () {
    placeScrabblePieces();     // Loads the 7 random pieces
    loadDropSlots();   // Loads 15 slots for dropping pieces
});

// Determines current word, generates logs and html changes, and calculates word score
function findWord() {
    var word = "";
    var score = 0;

    // Go through the whole game board and generate a possible word.
    for (var i = 0; i < 15; i++) {
        if (gameBoard[i].tile != "empty") {
            word += findLetter(gameBoard[i].tile);
            score += findScore(gameBoard[i].tile);
        }
    }

    // Logic for manipulating score after checking for double. Ex: if score should double score += score, else score += 0;
    score += (score * checkDouble());

    // Save score to html
    $("#score").html(score);

    // Show word if it not empty
    if (word != "") {
        $("#word").html(word);
        return;
    }

    // Otherwise word is blank in html
    $("#word").html("____");
}

// Checks if doubling score is valid for current placement. Returns 1 on true, 0 on false.
function checkDouble() {
    if (gameBoard[2].tile != "empty") {
        return 1;
    }
    if (gameBoard[12].tile != "empty") {
        return 1;
    }

    return 0;
}

// Takes a letter and returns a score
function findScore(given_id) {

    // get letter
    var letter = findLetter(given_id);
    var score = 0;

    // Scans array of pieces to find score, and check logic for doubling
    for (var i = 0; i < 27; i++) {
        // Get object
        var obj = pieces[i];

        if (obj.letter == letter) {
            score = obj.value;

            // Determine if the piece is worth double
            score += (score * doubleLetterCheck(given_id));

            return score;
        }
    }

    // Invalid case
    return -1;
}

// Given a tile ID, check if the dropID on the board leads to double word or letter score
function doubleLetterCheck(given_id) {
    // get dropID
    var dropID = findTilePosition(given_id);

    // Check if double
    if (dropID == "drop6" || dropID == "drop8") {
        return 1;
    }

    return 0;
}

// given a pieceID, gets corresponding letter
function findLetter(given_id) {
    for (var i = 0; i < 7; i++) {
        if (gameTiles[i].id == given_id) {
            return gameTiles[i].letter;
        }
    }

    // Invalid input
    return -1;
}

// Find position of given ID in the droppable array
function findBoardPosition(given_id) {
    for (var i = 0; i < 15; i++) {
        if (gameBoard[i].id == given_id) {
            return i;
        }
    }

    // Invalid case
    return -1;
}

// Given tile, find position
function findTilePosition(given_id) {
    for (var i = 0; i < 15; i++) {
        if (gameBoard[i].tile == given_id) {
            return gameBoard[i].id;
        }
    }

    // Invalid case
    return -1;
}

// Loading of scrabble pieces on the rack
function placeScrabblePieces() {
    var base_url = "graphics_data/tiles/Scrabble_Tile_";   // file path for images base
    var random_num = 1;
    var piece = "<img class='pieces' id='piece" + i + "' src='" + base_url + random_num + ".jpg" + "'></img>";
    var piece_ID = "";
    var what_piece = "";

    // Determine 7 random tiles
    for (var i = 0; i < 7; i++) {
        // Does random generation, making sure there are no multiples of the same from alphabet
        var loop = true;
        while (loop == true) {
            random_num = getRandomInt(0, 26);

            // Remove words from piece structure
            if (pieces[random_num].amount != 0) {
                loop = false;
                pieces[random_num].amount--;
            }
        }

        // Build a piece file path for the image generation on screen
        piece = "<img class='pieces' id='piece" + i + "' src='" + base_url + pieces[random_num].letter + ".jpg" + "'></img>";
        piece_ID = "#piece" + i;
        gameTiles[i].letter = pieces[random_num].letter;


        // Get racks location
        var pos = $("#the_rack").position();

        // Logic for repostioning tile piece 
        var img_left = -165 + (50 * i);
        var img_top = -130;

        // Load pieces onto the page and make draggable.
        $("#rack").append(piece);

        // Adjust piece location relatively
        $(piece_ID).css("left", img_left).css("top", img_top).css("position", "relative");

        // Add draggable ability
        $(piece_ID).draggable();
    }
}

function loadDropSlots() {
    var img_url = "graphics_data/tiles/DropSlot.png";   // File path of clear drop area image 
    var drop = "<img class='droppable' id='drop" + i + "' src='" + img_url + "'></img>";
    var drop_ID = "#drop" + i;

    for (var i = 0; i < 15; i++) {
        drop = "<img class='droppable' id='drop" + i + "' src='" + img_url + "'></img>";
        drop_ID = "#drop" + i;

        // Get board position
        var pos = $("#the_board").position();

        // Determine where droppable targets should go
        var img_left = 0;
        var img_top = -125;

        // Append the image
        $("#board").append(drop);

        // Reposition that image
        $(drop_ID).css("left", img_left).css("top", img_top).css("position", "relative");

        // Make that image droppable 
        $(drop_ID).droppable({
            // When a tile is placed on a droppable zone, set the gameBoard var to hold that tile.
            drop: function (event, ui) {
                var draggableID = ui.draggable.attr("id");
                var droppableID = $(this).attr("id");

                // update game board 
                gameBoard[findBoardPosition(droppableID)].tile = draggableID;

                // Determine word being entered, if there is one
                findWord();
            }
        });
    }
}

// Random number generation
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// array of objects for piece count and value

var pieces = [
    { "letter": "A", "value": 1, "amount": 9 },
    { "letter": "B", "value": 3, "amount": 2 },
    { "letter": "C", "value": 3, "amount": 2 },
    { "letter": "D", "value": 2, "amount": 4 },
    { "letter": "E", "value": 1, "amount": 12 },
    { "letter": "F", "value": 4, "amount": 2 },
    { "letter": "G", "value": 2, "amount": 3 },
    { "letter": "H", "value": 4, "amount": 2 },
    { "letter": "I", "value": 1, "amount": 9 },
    { "letter": "J", "value": 8, "amount": 1 },
    { "letter": "K", "value": 5, "amount": 1 },
    { "letter": "L", "value": 1, "amount": 4 },
    { "letter": "M", "value": 3, "amount": 2 },
    { "letter": "N", "value": 1, "amount": 6 },
    { "letter": "O", "value": 1, "amount": 8 },
    { "letter": "P", "value": 3, "amount": 2 },
    { "letter": "Q", "value": 10, "amount": 1 },
    { "letter": "R", "value": 1, "amount": 6 },
    { "letter": "S", "value": 1, "amount": 4 },
    { "letter": "T", "value": 1, "amount": 6 },
    { "letter": "U", "value": 1, "amount": 4 },
    { "letter": "V", "value": 4, "amount": 2 },
    { "letter": "W", "value": 4, "amount": 2 },
    { "letter": "X", "value": 8, "amount": 1 },
    { "letter": "Y", "value": 4, "amount": 2 },
    { "letter": "Z", "value": 10, "amount": 1 },
    { "letter": "_", "value": 0, "amount": 2 }
];

// array of objects determining piece letters
var gameTiles = [
    { "id": "piece0", "letter": "A" },
    { "id": "piece1", "letter": "B" },
    { "id": "piece2", "letter": "C" },
    { "id": "piece3", "letter": "D" },
    { "id": "piece4", "letter": "E" },
    { "id": "piece5", "letter": "F" },
    { "id": "piece6", "letter": "G" }
]

// Array which keeps track of current game board
var gameBoard = [
    { "id": "drop0", "tile": "empty" },
    { "id": "drop1", "tile": "empty" },
    { "id": "drop2", "tile": "empty" },
    { "id": "drop3", "tile": "empty" },
    { "id": "drop4", "tile": "empty" },
    { "id": "drop5", "tile": "empty" },
    { "id": "drop6", "tile": "empty" },
    { "id": "drop7", "tile": "empty" },
    { "id": "drop8", "tile": "empty" },
    { "id": "drop9", "tile": "empty" },
    { "id": "drop10", "tile": "empty" },
    { "id": "drop11", "tile": "empty" },
    { "id": "drop12", "tile": "empty" },
    { "id": "drop13", "tile": "empty" },
    { "id": "drop14", "tile": "empty" }
]