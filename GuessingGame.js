function generateWinningNumber() {
    return Math.floor(Math.random() * 100) + 1;
}

function shuffle(array) {
    var m = array.length, t, i;
    while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
    }
    return array;
}

function newGame() {
    return new Game();
}
function Game() {
    this.gNum = 0;
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function() {
    return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function() {
    return this.playersGuess < this.winningNumber ? true : false;
}

Game.prototype.playersGuessSubmission = function(num) {
    if (typeof num !== 'number' || !num || num < 0 || num > 100) {
        return 'That is an invalid guess'
    } else {
        this.playersGuess = num;
        return this.checkGuess(num);
    }
}

Game.prototype.checkGuess = function(num) {
    if (num === this.winningNumber) {
        $('#hint, #submit').prop('disabled',true);
        $('.circle').css({'border': '1px solid rgba(85, 209, 106, 1)'})
        $('.outputs').css({'color': 'rgba(85, 209, 106, 1)'})
        $('.circle').text(this.winningNumber);
        return '[You Win!] Press the Reset button to play again'
    } else if (this.pastGuesses.indexOf(num) !== -1) {
        return 'You have already guessed that number'
    } else {
        this.gNum += 1;
        $('#g' + this.gNum).css({'border': '1px solid rgba(255, 90, 87, 1)'});
        $('#g' + this.gNum).text(this.playersGuess);
        this.pastGuesses.push(num);
        if (this.pastGuesses.length === 5) {
            $('#hint, #submit').prop('disabled', true);
            $('.outputs').css({'color': 'rgba(255, 90, 87, 1)'});
            return '[You Lose] Press the Reset button to play again'
        } else if (this.difference() <= 10) {
            return 'You\'re very close [+/- 10]'
        } else if (this.difference() <= 25) {
            return 'You\'re close [+/- 25]'
        } else if (this.difference() <= 50) {
            return 'You\'re not close [+/- 50]'
        } else {
            return 'You\'re very distant'
        }
    }
}   

Game.prototype.provideHint = function() {
    return shuffle([this.winningNumber, generateWinningNumber(), generateWinningNumber()]);
}

function guessing(game) {
    var guess = +$('#player-input').val();
    $('#player-input').val('');
    
    var output = game.playersGuessSubmission(guess);
        $('.outputs').text(output);
}

$(document).ready(function() {
    var currentGame = new Game();
    $('#submit').click(function() {
        guessing(currentGame);
    })
    $('#player-input').keypress(function(key) {
        if (key.which === 13) {
            guessing(currentGame);
        }
    })
    $('#reset').click(function() {
        currentGame = newGame();
        $('.outputs').text('');
        $('#hint, #submit').prop('disabled', false);
        $('.circle').text('-');
        $('.circle').css({'border': '1px solid white'})
        $('.outputs').css({'color': 'white'})
    })
    $('#hint').click(function() {
        var hints = currentGame.provideHint();
        $('.outputs').text('The winning number is '+hints[0]+', '+hints[1]+', or '+hints[2]);
    })
})