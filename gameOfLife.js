let cols = 50;
let rows = 50;

let isPlaying = false;

let grid = new Array(rows).fill(0);
let nextGrid = new Array(rows).fill(0);

let timer;
let speedOfReproduction = 100;

/*
* INIT 
* Init method and basic constructors
*/
window.onload = () => {
    console.log("Init app...");
    createTable();
    initGrids();}

function initGrids() {
    for (let i = 0; i < rows; i++) {
        grid[i] = [cols];
        nextGrid[i] = [cols];
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

function updateView() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let cell = document.getElementById(i + "-" + j);
            if (grid[i][j] === 0) {
                cell.setAttribute("class", "dead");
            } else {
                cell.setAttribute("class", "alive");
            }
        }
    }
}

/*
* CONTROLS
* Methods to setup controls
 */
function randomButton() {
    console.log("Randomizing")
    //if (playing) return;
    clearButton();
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let isAlive = Math.round(Math.random());
            if (isAlive === 1) {
                let cell = document.getElementById(i + "-" + j);
                cell.setAttribute("class", "alive");
                grid[i][j] = 1;
            }
        }
    }
}

function clearButton(){
    clearTimeout(timer);

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
}

function startButtonHandler(startButton){
    if (isPlaying) {
        console.log("Stop the game  " + this);
        isPlaying = false;
        startButton.innerHTML = "START";
        startButton.style.backgroundColor = '#1ceb23';
        clearTimeout(timer);
    } else {
        console.log("Start the game");
        isPlaying = true;
        startButton.innerHTML = "STOP";
        startButton.style.backgroundColor = '#ff6d12';
        //play();
    }
}