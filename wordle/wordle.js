window.onload = async() => {
    const res = await fetch("https://api.masoudkf.com/v1/wordle", {
    headers: {
    "x-api-key": "sw0Tr2othT1AyTQtNDUE06LqMckbTiKWaVYhuirv",
    },
    });
    const data = await res.json();
    let {dictionary} = data; 
    keyWord = dictionary[Number.parseInt(Math.random() * dictionary.length)];
    hint = keyWord.hint;


let state = {
    secret : keyWord.word.toLowerCase(),
    grid: Array(4)
        .fill()
        .map(() => Array(4).fill('')),
    currentRow: 0,
    currentCol: 0,
};

//Updating the grid//
function updateGrid(){
    for (let i = 0; i < state.grid.length; i++){
        for (let j = 0; j < state.grid[i].length; j++){
            const box = document.getElementById(`box${i}${j}`);
            box.textContent = state.grid[i][j];
        }
    }
}
////////

//Making the game grid//
function makeBox(container, row, col, letter = ''){
    const box = document.createElement('div');
    box.className = 'box';
    box.id = `box${row}${col}`;
    box.textContent = letter;

    container.appendChild(box);
    return box;
}

function makeGrid(container){
    const grid = document.createElement('div');
    grid.className = 'grid';

    for (let i = 0; i < 4; i++){
        for (let j = 0; j < 4; j++){
            makeBox(grid, i, j);
        }
    }

    container.appendChild(grid);
}
////////

//Keyboard Usage//
function KeyboardEvents(){
    document.body.onkeydown = (e) => {
        const key = e.key;
        if (key === 'Enter'){
            if (state.currentCol === 4){
                const word = getWord();
                
                revealWord(word);
                state.currentRow++;
                state.currentCol = 0;
            }
            else{
                alert('Please enter a 4 letter word.')
            }
        }
        if (key === 'Backspace'){
            removeLetter();
        }
        if (isLetter(key)){
            addLetter(key);
        }
        
        updateGrid();
    };    
}

function getWord(){
    return state.grid[state.currentRow].reduce((prev, curr) => prev + curr);
}

function isLetter(key){
    return key.length === 1 && key.match(/[a-z]/i);
}
////////

//Revealing the word//
function revealWord(guess){
    const row = state.currentRow;
    const animation_duration = 500;//ms
    
    for (let i = 0; i < 4; i++){
        const box = document.getElementById(`box${row}${i}`);
        const letter = box.textContent;

        setTimeout(() => {
            if (letter === state.secret[i]){
            box.classList.add('right')
            } 
            else if (state.secret.includes(letter)){
            box.classList.add('wrong')
            }
            else{
            box.classList.add('empty')
            }
        }, ((i+1) * animation_duration) / 2);
        
        box.classList.add('animated');
        box.style.animationDelay = `${(i * animation_duration)/2}ms`;
    }
    const isWinner = state.secret === guess;
    const isGameOver = state.currentRow === 3;

    setTimeout(() => {
        if (isWinner){
            document.getElementById("show").innerHTML = "You have correctly guessed the  word: " + state.secret.toUpperCase() + "!";
            document.getElementById("show").className = "success";
            const picture = document.getElementById("win");
            const game = document.getElementById("game");
            game.style.display = "none";
            picture.style.display = "flex";
        }
        else if (isGameOver){
            document.getElementById("show").innerHTML = "Aww man, you lost! Better luck next time. The word was: " + state.secret.toUpperCase() + ".";
            document.getElementById("show").className = "fail";
        }
    }, 3 * animation_duration);
}
////////

//Adding and removing letters//
function addLetter(letter){
    if (state.currentCol === 4){
        return;
    }
    state.grid[state.currentRow][state.currentCol] = letter;
    state.currentCol++;
}

function removeLetter(){
    if (state.currentCol === 0){
        return;
    }
    state.grid[state.currentRow][state.currentCol - 1] = '';
    state.currentCol--;
}
////////

//The Start Over button/Resetting the game//
const startOver = document.getElementById("start");
startOver.addEventListener("click", function(){

    document.getElementById("show").innerHTML = "";
    document.getElementById("show").className = "hidden";
    const picture = document.getElementById("win");
    const game = document.getElementById("game");
    game.style.display = "grid";
    picture.style.display = "none";

    restart();
});

function restart(){
    
    clearGame();

    keyWord = dictionary[Number.parseInt(Math.random() * dictionary.length)];
    state.secret = keyWord.word.toLowerCase();
    hint = keyWord.hint;
    console.log(state.secret);
}

function clearGame(){
    state.grid = Array(4)
        .fill()
        .map(() => Array(4).fill(''));
    state.currentCol = 0;
    state.currentRow = 0;

    for (let i = 0; i < 4; i++) {
        for(let j = 0; j < 4; j++){
            const box = document.getElementById(`box${i}${j}`);
            box.classList.remove('right');
            
            box.classList.remove('wrong');
         
            box.classList.remove('empty');

            box.classList.remove('animated');
        }
    }
    updateGrid();
}////////

//Running the game//
function startup(){
    const game = document.getElementById('game');
    makeGrid(game);

    KeyboardEvents();

    console.log(state.secret);

}

startup();
///////

//For other buttons//
const dark = document.getElementById("btn1");
dark.addEventListener("click", dark_function);

const hint_button = document.getElementById("btn2");
hint_button.addEventListener("click", hint_function);

const instr = document.getElementById("btn3");
instr.addEventListener("click", instr_function);
///////
}

//Other button functions//
//dark mode
function dark_function(){
    const darkMode = document.getElementById("btn1");
    const hint_button = document.getElementById("btn2");
    const instr = document.getElementById("btn3");
    const body = document.body;
    const tiles = document.getElementsByTagName("div");


    darkMode.classList.toggle("dark-mode");
    hint_button.classList.toggle("dark-mode");
    instr.classList.toggle("dark-mode");
    body.classList.toggle("dark-mode");
    for (let i = 0; i < tiles.length; i++){
        tiles[i].classList.toggle("dark-mode");
    }
}

//instructions
function instr_function(){
    var instructions = document.getElementById("instructions");
    instructions.classList.toggle("hidden");
    document.getElementById("show").innerHTML = "";
    document.getElementById("show").className = "hidden";
}

//hint
function hint_function(){
    const word_hint = document.getElementById("show");
    document.getElementById("show").innerHTML = "Hint: " + hint + ".";
    if (word_hint.classList.contains("hidden")){
    word_hint.className = "hint";
    }
    else{
    word_hint.classList.toggle("hidden");
    }
}
////////
