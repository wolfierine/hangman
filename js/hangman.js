/* 
	NEW GAME - Set new word to guess
*/

// declare var
const randomWords = ["chair", "tower", "happiness", "sea", "mountains", "wolves", ];
let previousWord = "";
let firstGame = true;
let random = "";
const button = document.querySelectorAll(".newgame");
const charsList = document.querySelector("#chars");
let x;
const hangman = document.querySelector("#hangman svg");
const hangmanPart = [...hangman.children];
let partsOfHangman = 0;
const hangmanBody = hangman.querySelector("#body");
const victory = document.querySelector("#victory");

let wordArray;
let duplicateArray;
let win = 0;

// random word from array of wordsw
function randomWord(){
	const wordsNumber = randomWords.length;
	const index = Math.floor(Math.random() * wordsNumber);
	const word = randomWords[index];
	return word;
}

// show fields for word
function generateHTML(){
	return `
		<li>
			<span>_</span>
		</li>
	`;
}

//  set word to guess
function setWord(newword){
	const chars = newword.split('');
	const charsNumber = chars.length;
	const list = chars.map(generateHTML).join('');
	charsList.innerHTML = list;
	x = newword;	
	wordArray = x.split('');
	duplicateArray = [...wordArray];
}

//check if new word is not the same as previous
function checkWord(prev, rand){
	if(prev === rand){
		return checkWord(previousWord, randomWord());
	} else {
		previousWord = rand;
		return rand;
	}
}

// begin new game
function newGame(){
	if(firstGame){
		firstGame = !firstGame;
		const random = randomWord();
		previousWord = random;
		setWord(random);
	} else {
		random = randomWord();
		setWord(checkWord(previousWord, random));
	}
	hangmanPart.map( part => part.style.opacity = 0);
	partsOfHangman = 0;
	hangmanBody.classList.remove("fall");
	win = 0;
	victory.classList.remove("winner");
}

// init game
newGame();

// add event listeners
button.forEach(function(btn){
	btn.addEventListener("click", newGame);
});



/* 
	GUESS PROCESS - if char is correct show it in the right place, otherwise draw a hangman
*/

// check if char is in the word on key down
function checkChar(e){
	// take array of chars before and after check if char is in the word 
	// to compare if there is a change and if there is show piece of hangman
	const before = wordArray.length;
	// loop through every char to check if char is in the word 
	wordArray.map( (m, i) => check(m, i, e.key));
	// array of chars after checking
	const after = duplicateArray.length;
	// if there weren't no changes show hangman
	if(before == after){
		hangmanPart[partsOfHangman].style.opacity = 1;
		partsOfHangman++;
		if(partsOfHangman === hangmanPart.length){
			hangmanBody.classList.add("fall");
			setTimeout(function(){
				newGame();
			}, 1000);
		}
	}
	// reset after array for new comparison
	duplicateArray = [...wordArray];
	// console.log(win);
	// console.log(before);
	if(win === before){
		setTimeout(function(){
				victory.classList.add("winner");
			}, 700);
	}
}

// loop through every char
function check(v, i, k){
	//someone guess 
	if(v === k){
		const charField = charsList.children;
		charField[i].innerHTML = v;
		duplicateArray.splice(i,1);
		win++;
	}
}

// add event listeners
window.addEventListener("keydown", checkChar);