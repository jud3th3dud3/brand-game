const fs = require('fs');
const csv = require('csv-parser');
const readline = require('readline');

const results = [];
let randomCompany = '';

// Function to read the CSV file and choose a random company
function readCSVAndChooseRandom() {
  return new Promise((resolve, reject) => {
    fs.createReadStream('brands-list.csv')
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        if (results.length > 0) {
          const secondColumn = results.map(row => row[Object.keys(row)[1]]);
          const randomIndex = Math.floor(Math.random() * secondColumn.length);
          randomCompany = secondColumn[randomIndex];
          resolve(randomCompany);
        } else {
          reject('The CSV file is empty or does not have enough rows.');
        }
      });
  });
}

// Function to handle user guesses
function startGuessingGame(randomCompany) {
  const NUMBER_OF_GUESSES = 6;
  let guessesRemaining = NUMBER_OF_GUESSES;

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('Guess the random company name!');

  rl.on('line', (input) => {
    if (input.toLowerCase() === randomCompany.toLowerCase()) {
      console.log(`Congratulations! You guessed it right: ${randomCompany}`);
      rl.close();
    } else {
      guessesRemaining--;
      if (guessesRemaining > 0) {
        console.log(`Wrong guess. Try again. You have ${guessesRemaining} guesses left.`);
      } else {
        console.log(`Sorry, you've run out of guesses. The correct company was: ${randomCompany}`);
        rl.close();
      }
    }
  });

  rl.on('close', () => {
    process.exit(0);
  });
}

// Run the functions
readCSVAndChooseRandom()
  .then(randomCompany => {
    console.log(`Random Company: ${randomCompany}`); // For debugging purposes
    startGuessingGame(randomCompany);
  })
  .catch(error => {
    console.error(error);
  });