let playerScore = 0;
let computerScore = 0;

function play(playerChoice) {
    const choices = ['rock', 'paper', 'scissors'];
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];
    let result = '';

    if (playerChoice === computerChoice) {
        result = `It's a tie! Both chose ${playerChoice}.`;
    } else if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'paper' && computerChoice === 'rock') ||
        (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
        result = `You win! ${playerChoice} beats ${computerChoice}.`;
        playerScore++;
    } else {
        result = `You lose! ${computerChoice} beats ${playerChoice}.`;
        computerScore++;
    }

    document.getElementById('result').innerText = result;
    document.getElementById('score').innerText = `Player: ${playerScore} | Computer: ${computerScore}`;
   
    // Show the restart button after a round
    document.getElementById('restartButton').style.display = 'inline-block';
}

function restartGame() {
    playerScore = 0;
    computerScore = 0;
    document.getElementById('result').innerText = '';
    document.getElementById('score').innerText = `Player: ${playerScore} | Computer: ${computerScore}`;
   
    // Hide the restart button
    document.getElementById('restartButton').style.display = 'none';
}