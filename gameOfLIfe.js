let cols = 50;
let rows = 50;

let isPlaying = false;

// let grid = new Array(rows);
// let nextGrid = new Array(rows);
// Testing this as I read somewhere that these are better
let grid = [rows];
let nextGrid = [rows];

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
window.addEventListener('mousedown', e => isMouseDown = true);
window.addEventListener('mouseup', e => isMouseDown = false);

function cellClickHandler() {
    changeCell(this);
}

function cellTrailHandler(){
    if (isMouseDown) changeCell(this);
}

function changeCell(obj){
    let rowcol = obj.id.split("-");
    let row = rowcol[0];
    let col = rowcol[1];
    let cellClass = obj.getAttribute("class");

    if(cellClass.indexOf("alive") > -1) {
        obj.setAttribute("class", "dead");
        grid[row][col] = 0;
    } else {
        obj.setAttribute("class", "alive");
        grid[row][col] = 1;
    }
}