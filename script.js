const apiUrl = 'https://restcountries.com/v3.1/all?fields=name,flags';
const maxGuesses = 5;
let guessesRemaining = maxGuesses;

let country;
let nameBoxes;
let currentAttemptId;
let attemptNum = 1;

initGame();

async function initGame() {
  country = await getRandomCountry();
  displayFlag(country);
  createNameBoxes();
  setMessage();
}

async function getRandomCountry() {
  const response = await fetch(apiUrl);
  const data = await response.json();
  return getRandomItem(data); 
}

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function displayFlag(country) {
  document.getElementById('flag-image').src = country.flags.png;
}

function createNameBoxes(id) {
    const name = country.name.common;
    console.log(name, id);
    letterBoxes = id ? document.getElementById(id) : document.getElementById('letter-boxes');

for(let i=0; i < name.length; i++) {
    if(name[i] === ' ') {
        // Create empty space element
        let space = document.createElement('div');
        space.classList.add('space');
        letterBoxes.appendChild(space);
    
    } else {
        let box = document.createElement('input');
        box.maxLength = 1;
        box.classList.add('letter-box');
        letterBoxes.appendChild(box);
    }
}

letterBoxes.addEventListener('input', (e) => {
    console.log(e);

  // Get index of updated box
  const index = [...letterBoxes.children].indexOf(e.target);

  // Set focus to next box
  if(index < name.length - 1) {
    if(letterBoxes.children[index].classList.contains('space')){
        letterBoxes.children[index+2].focus();
    }else{
        letterBoxes.children[index+1].focus();
    }
  }

});

letterBoxes.addEventListener('keydown', e => {
    console.log('key', e.key);
    if(e.key === "Backspace"){
        const index = [...letterBoxes.children].indexOf(document.activeElement);
  
        if(index === 0) return; // First box
        
        // Move to previous box
        const prevBox = letterBoxes.children[index-1];
        prevBox.focus();
        
        // Clear value
        prevBox.value = ''; 
    }
    if(e.key === "Enter"){
        attemptNum++
        guessesRemaining--
        setMessage();

    // Get current input value
    const values = [...letterBoxes.children]
    console.log('values', values);
  
    let incorrect;
  // Loop through each letter
  for(let i = 0; i < values.length; i++) {
    if(values[i].classList.contains('space')){
        continue;
    }
    // Get current letter
    const letter = values[i].value;

    // Check if matches
    if(letter.toLowerCase() === country.name.common[i].toLowerCase()) {
    // Animate background green
    values[i].style.backgroundColor = 'lightgreen';
    values[i].style.animation = 'flip 0.5s ease';
    } else {
    // Animate background red
    values[i].style.backgroundColor = 'pink'; 
    values[i].style.animation = 'flip 0.5s ease';
    incorrect = true;
    }
}

if(incorrect){
    const newBoxes = document.createElement('div');
    newBoxes.id = 'letter-boxes'+attemptNum;
    newBoxes.style.paddingTop = "10px";
    currentAttemptId = newBoxes.id;
    
  letterBoxes.after(newBoxes);

    // Populate with new input boxs
    createNameBoxes(currentAttemptId); 

  // Update reference
  letterBoxes = newBoxes;
}
    }
});
}

function setMessage(){
    document.getElementById('message').innerHTML = `guess the country name... ${guessesRemaining}/${maxGuesses} guesses remaining`;
}