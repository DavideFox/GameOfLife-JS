let cols = 90;
let rows = 90;

let isPlaying = false;

let grid = new Array(rows);
let nextGrid = new Array(rows);

let timer;
let speedOfReproduction = 100;

/*
* INIT 
* Init method and basic constructors
*/
window.onload = () => {
    console.log("Init app...");
    createTable();
    initGrids();
    resetGrids();
}

function initGrids() {
    for (let i = 0; i < rows; i++) {
        grid[i] = new Array(cols);
        nextGrid[i] = new Array(cols);
    }
}

function resetGrids() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = 0;
            nextGrid[i][j] = 0;
        }
    }
}

function copyAndResetGrid() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = nextGrid[i][j];
            nextGrid[i][j] = 0;
        }
    }
}

function createTable() {
    console.log("Creating the html table");
    let gridContainer = document.getElementById('grid');
    let table = document.createElement("table");
    
    for (let i = 0; i < rows; i++) {
        let tr = document.createElement("tr");
        for (let j = 0; j < cols; j++) {
            let cell = document.createElement("td");
            cell.setAttribute("id", i + "-" + j);
            cell.setAttribute("class", "dead");
            cell.onclick = cellClickHandler;
            cell.onmouseover = cellTrailHandler;
            tr.appendChild(cell);
        }
        table.appendChild(tr);
    }
    gridContainer.appendChild(table);
}

// Slider for speed selection
let slider = document.getElementById("gameSpeed");
let output = document.getElementById("gameSpeedLabel");

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
    output.innerHTML = "Time Between Cycles: " + slider.value;
    speedOfReproduction = this.value;
}

/*
* DRAWING 
* This section has all the methods used to draw one the table.
*/
let isMouseDown = false;
window.addEventListener('mousedown', () => isMouseDown = true);
window.addEventListener('mouseup', () => isMouseDown = false);

function cellClickHandler() {
    changeCell(this);
}

function cellTrailHandler(){
    if (isMouseDown) changeCell(this);
}

function changeCell(obj){
    let rowCol = obj.id.split("-");
    let row = rowCol[0];
    let col = rowCol[1];
    let cellClass = obj.getAttribute("class");

    if(cellClass.indexOf("alive") > -1) {
        obj.setAttribute("class", "dead");
        grid[row][col] = 0;
    } else {
        obj.setAttribute("class", "alive");
        grid[row][col] = 1;
    }
}

// Buggato, ma non capisco perché
function updateView() {
    console.log("Updating view")
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let cell = document.getElementById(i + "-" + j);
            if (grid[i][j] === 0) {
                console.log("Cell is dead")
                cell.setAttribute("class", "dead");
            } else {
                console.log("Cell is alive")
                cell.setAttribute("class", "alive");
            }
        }
    }
}



/*
* CONTROLS
* Methods to setup controls
 */
let startBtn = document.getElementById('start');

function randomButton() {
    console.log("Randomizing")
    clearButton();
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let isAlive = Math.random() < 0.3
            if (isAlive) {
                let cell = document.getElementById(i + "-" + j);
                cell.setAttribute("class", "alive");
                grid[i][j] = 1;
            }
        }
    }
}

function clearButton(){
    counter = 0;
    if (isPlaying) {
        isPlaying = false;
        console.log("Stop the game  ");
        startBtn.innerHTML = "START";
        startBtn.style.backgroundColor = '#1ceb23';
        clearTimeout(timer);
    }

    let cellsNodeList = document.getElementsByClassName("alive");
    let cells = [];
    for (let i = 0; i < cellsNodeList.length; i++) {
        cells.push(cellsNodeList[i]);
    }

    for (let i = 0; i < cells.length; i++) {
        cells[i].setAttribute("class", "dead");
    }
    grid.fill(0);
    nextGrid.fill(0);

    initGrids()
    resetGrids()
    updateView()
}

function startButtonHandler(){
    if (isPlaying) {
        console.log("Stop the game  ");
        isPlaying = false;
        startBtn.innerHTML = "START";
        startBtn.style.backgroundColor = '#1ceb23';
        clearTimeout(timer);

    } else {
        console.log("Start the game");
        isPlaying = true;
        startBtn.innerHTML = "STOP";
        startBtn.style.backgroundColor = '#ff6d12';
        play();
    }
}

// Gameplay
function play(){
    if (isPlaying){
        calcNextGen();
        console.log("Playing");
        setTimeout(play, speedOfReproduction);
    }
}

function calcNextGen() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            checkCell(i, j);
        }
    }
    updateCounter()
    // checkCell works on a "future" grid, so we have to make that grid the current one
    copyAndResetGrid();
    updateView();
}

let counterEl = document.getElementById('cycleCounter')
let counter = 0;
function updateCounter(){
    counterEl.innerHTML = "Cycle: " + ++counter;
}

function checkCell(row, col){
    let numNeighbors = countNeighbours(row, col);
    if (grid[row][col] === 1) {
        if (numNeighbors < 2) {
            nextGrid[row][col] = 0;
        } else if (numNeighbors === 2 || numNeighbors === 3) {
            nextGrid[row][col] = 1;
        } else if (numNeighbors > 3) {
            nextGrid[row][col] = 0;
        }
    } else if (grid[row][col] === 0) {
        if (numNeighbors === 3) {
            nextGrid[row][col] = 1;
        }
    }
}

function countNeighbours(row, col){
    let count = 0;
    for (let x = row - 1; x <= row + 1; x++) {
        for (let y = col - 1; y <= col + 1; y++) {
            if (x >= 0 && x < cols && y >= 0 && y < rows) {
                count += grid[x][y] ? 1 : 0;
            }
        }
    }
    count -= grid[row][col] ? 1 : 0;
    return count;
}