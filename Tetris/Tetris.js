function playGame(){
    let board = new Board();
    const interval = setInterval(function(){
        if(board.reachedBottom){
            // check for complete row 4 times, max you can get in one round
            for(let i = 0; i < 4; i++){
                board.completeRow();
            }
            if(board.blocks[4][4].color !== 'white'){
                // game over
                let gameOver = document.createElement('div');
                gameOver.setAttribute('id', 'gameOver');
                gameOver.innerHTML = 'Game over';
                document.body.appendChild(gameOver);
                board.activePiece.coordinates = []; // cannot move last piece
                clearInterval(interval);
            }else{
                board.generateNewPiece();
                board.moveDown();
                board.updateBoard();
            }
        }else{
            board.moveDown();
            board.updateBoard();
        }

        }, 1000);
}

class Board{
    constructor() {
        this.score = 0;
        this.blocks = this.createBlocks();
        this.generateNewPiece();
        this.board = this.createBoard();
        this.display = this.generateSideDisplay();
        this.controls = this.generateControls();
        document.body.appendChild(this.board);
        document.body.appendChild(this.display);
        document.body.appendChild(this.controls);
    }

    createBlocks(){
        let blocks = [];
        for(let i = 0; i < 10; i++){
            let yBlocks = [];
            for(let j = 0; j < 22; j++){ // 18 rows + 4 invisible
                let block = new Block(i,j, 'white','white','white');
                yBlocks.push(block);
            }
            blocks.push(yBlocks);
        }
        return blocks;
    }

    createBoard(){
        let boardDiv = document.createElement('div');
        boardDiv.setAttribute('id', 'background');
        for(let j = 4; j < 22; j++){ // starting at 4 after invisible blocks
            for(let i = 0; i < 10; i++) {
                boardDiv.appendChild(this.blocks[i][j].createBlock());
            }
            const br = document.createElement('br');
            boardDiv.appendChild(br);
        }
        return boardDiv;
    }

    updateBoard(){
        const board = document.getElementById('background');
        const display = document.getElementById('display');
        board.parentNode.removeChild(board);
        const boardDiv = this.createBoard();
        document.body.insertBefore(boardDiv,display);
    }

    generateNewPiece(){
        const shapes = ['I','O','T','J','L','Z','S'];
        const nr = Math.floor(Math.random() * (shapes.length));
        const shape = shapes[nr];
        let piece = new Piece(shape,4,3, this.blocks);
        this.activePiece = piece;
        this.coordinates = piece.createPiece();
        this.reachedBottom = false;
        for(let i = 0; i < this.coordinates.length; i++){
            this.blocks[this.coordinates[i][0]][this.coordinates[i][1]].changeColor(piece.bordertop, piece.color, piece.borderlr, piece.borderbottom);
        }
    }

    completeRow(){
        let completeRow = true;
        for(let i = 0; i < this.blocks.length; i++){
            if(this.blocks[i][21].color === 'white'){
                completeRow = false;
            }
        }
        if(completeRow){
            this.score += 100;
            document.getElementById('score').innerHTML = this.score;
            // move all colors one down and add new greys on top
            for(let i = 0; i < 10; i++){
                for(let j = 20; j > 3; j--) {
                    this.blocks[i][j+1].changeColor(this.blocks[i][j].bordertop,this.blocks[i][j].color, this.blocks[i][j].borderlr, this.blocks[i][j].borderbottom);
                    this.blocks[i][4].changeColor('white','white','white','white');
                }
            }
        }
    }

    movePossible(oldCoordinates, newCoordinates){
        // check which blocks of newCoordinates are also in oldCoordinates,
        // no problems if these are still white when moving
        let realNew = [];
        let realNewSmall = [];
        for(let i = 0; i < newCoordinates.length; i++){
            for(let j = 0; j < oldCoordinates.length; j++){
                if(oldCoordinates[j][0] === newCoordinates[i][0] &&
                    oldCoordinates[j][1] === newCoordinates[i][1]){
                    realNew.push(false);
                }else{
                    realNew.push(true);
                }
            }
        }
        for(let s = 0; s < realNew.length; s+=4){
            if(realNew[s] && realNew[s+1] && realNew[s+2] && realNew[s+3]){
                realNewSmall.push(true);
            }else{
                realNewSmall.push(false);
            }
        }

        let movePossible = true;
        for(let r = 0; r < newCoordinates.length; r++){
            let i = newCoordinates[r][0];
            let j = newCoordinates[r][1];
            if(this.blocks[i][j].color !== 'white' && realNewSmall[r]){
                movePossible = false;
            }
        }
        return movePossible;
    }

    move(oldCoordinates, newCoordinates){
        // old blocks to grey
        for(let i = 0; i < oldCoordinates.length; i++){
            this.blocks[oldCoordinates[i][0]][oldCoordinates[i][1]].changeColor('white','white','white','white');
        }
        this.coordinates = newCoordinates;
        // new blocks to color
        for(let i = 0; i < newCoordinates.length; i++){
            this.blocks[newCoordinates[i][0]][newCoordinates[i][1]].changeColor(this.activePiece.bordertop,this.activePiece.color,this.activePiece.borderlr,this.activePiece.borderbottom);
            this.updateBoard();
        }
    }

    moveDown = () => {
        const oldCoordinates = this.coordinates;
        let newCoordinates = this.activePiece.moveDown();
        // check if move possible
        if(!this.movePossible(oldCoordinates,newCoordinates)){
            newCoordinates = [];
        }
        // check if bottom reached
        if(newCoordinates.length === 0){
            this.reachedBottom = true;
        }else{
            this.move(oldCoordinates, newCoordinates);
        }
    }

    moveRight = () => {
        const oldCoordinates = this.coordinates;
        let newCoordinates = this.activePiece.moveRight();
        // check if move possible
        if(!this.movePossible(oldCoordinates,newCoordinates)){
            newCoordinates = [];
        }
        if(newCoordinates.length === 0){
            // do not move
        }else{
            this.move(oldCoordinates, newCoordinates);
        }
    }

    moveLeft = () => {
        const oldCoordinates = this.coordinates;
        let newCoordinates = this.activePiece.moveLeft();
        // check if move possible
        if(!this.movePossible(oldCoordinates,newCoordinates)){
            newCoordinates = [];
        }
        if(newCoordinates.length === 0){
            // do not move
        }else{
            this.move(oldCoordinates, newCoordinates);
        }
    }

    rotate = () => {
        const oldCoordinates = this.coordinates;
        const newCoordinates = this.activePiece.rotate();
        this.move(oldCoordinates, newCoordinates);
    }

    generateControls(){
        let controlsDiv = document.createElement('div');
        controlsDiv.setAttribute('id', 'controls');

        let downButton = document.createElement('button');
        downButton.innerHTML = 'V';
        downButton.setAttribute('id', 'downButton');
        downButton.onclick = this.moveDown;
        controlsDiv.appendChild(downButton);

        const br = document.createElement('br');
        controlsDiv.appendChild(br);

        let rightButton = document.createElement('button');
        rightButton.innerHTML = '>';
        rightButton.setAttribute('id', 'rightButton');
        rightButton.onclick = this.moveRight;
        controlsDiv.appendChild(rightButton);

        let leftButton = document.createElement('button');
        leftButton.innerHTML = '<';
        leftButton.setAttribute('id', 'leftButton');
        leftButton.onclick = this.moveLeft;
        controlsDiv.appendChild(leftButton);

        const br1 = document.createElement('br');
        controlsDiv.appendChild(br1);

        let rotateButton = document.createElement('button');
        rotateButton.innerHTML = '^';
        rotateButton.setAttribute('id', 'rotateButton');
        rotateButton.onclick = this.rotate;
        controlsDiv.appendChild(rotateButton);

        return controlsDiv;
    }

    generateSideDisplay(){
        let displayDiv = document.createElement('div');
        displayDiv.setAttribute('id', 'display');

        let title = document.createElement('h1');
        let T = document.createElement('span');
        T.setAttribute('id', 'T');
        T.innerHTML = 'T';
        title.appendChild(T);
        let e = document.createElement('span');
        e.setAttribute('id', 'e');
        e.innerHTML = 'e';
        title.appendChild(e);
        let t = document.createElement('span');
        t.setAttribute('id', 't');
        t.innerHTML = 't';
        title.appendChild(t);
        let r = document.createElement('span');
        r.setAttribute('id', 'r');
        r.innerHTML = 'r';
        title.appendChild(r);
        let i = document.createElement('span');
        i.setAttribute('id', 'i');
        i.innerHTML = 'i';
        title.appendChild(i);
        let s = document.createElement('span');
        s.setAttribute('id', 's');
        s.innerHTML = 's';
        title.appendChild(s);
        // title.innerHTML = 'Tetris';
        displayDiv.appendChild(title);

        let scoreWord = document.createElement('div')
        scoreWord.setAttribute('id', 'scoreWord');
        scoreWord.innerHTML = 'score: ';
        displayDiv.appendChild(scoreWord);

        let scoreDiv = document.createElement('div');
        scoreDiv.setAttribute('id', 'score');
        scoreDiv.innerHTML = this.score;
        displayDiv.appendChild(scoreDiv);

        return displayDiv;
    }
}

class Piece{
    constructor(shape, x, y) {
        this.shape = shape;
        this.x = x;
        this.y = y;
        this.coordinates = [[x,y]];
        this.firstRotationI = false;
    }

    stayInside(coordinates){
        let inside = true;
        // not past bottom border
        if(Math.max(coordinates[0][1],coordinates[1][1],coordinates[2][1],coordinates[3][1]) >= 22){
            inside = false;
        }
        // not past right border
        if(Math.max(coordinates[0][0],coordinates[1][0],coordinates[2][0],coordinates[3][0]) >= 10){
            inside = false;
        }
        // not past left border
        if(Math.min(coordinates[0][0],coordinates[1][0],coordinates[2][0],coordinates[3][0]) < 0){
            inside = false;
        }
        return inside;
    }

    moveDown = () => {
        const newCoordinates = [
            [this.coordinates[0][0], this.coordinates[0][1] + 1],
            [this.coordinates[1][0], this.coordinates[1][1] + 1],
            [this.coordinates[2][0], this.coordinates[2][1] + 1],
            [this.coordinates[3][0], this.coordinates[3][1] + 1],
        ];
        if(this.stayInside(newCoordinates)){
            this.coordinates = newCoordinates;
            return newCoordinates;
        }else{
            return [];
        }
    }

    moveLeft = () => {
        const newCoordinates = [
            [this.coordinates[0][0] - 1, this.coordinates[0][1]],
            [this.coordinates[1][0] - 1, this.coordinates[1][1]],
            [this.coordinates[2][0] - 1, this.coordinates[2][1]],
            [this.coordinates[3][0] - 1, this.coordinates[3][1]],
        ];
        if(this.stayInside(newCoordinates)){
            this.coordinates = newCoordinates;
            return newCoordinates;
        }else{
            return [];
        }
    }

    moveRight = () => {
        const newCoordinates = [
            [this.coordinates[0][0] + 1, this.coordinates[0][1]],
            [this.coordinates[1][0] + 1, this.coordinates[1][1]],
            [this.coordinates[2][0] + 1, this.coordinates[2][1]],
            [this.coordinates[3][0] + 1, this.coordinates[3][1]],
        ];
        if(this.stayInside(newCoordinates)){
            this.coordinates = newCoordinates;
            return newCoordinates;
        }else{
            return [];
        }
    }

    rotate = () => {
        let rotateAround = [];
        switch (this.shape) {
            case 'I':
                rotateAround = [this.coordinates[2][0],this.coordinates[2][1]];
                break;
            case 'O':
                // no rotation
                break;
            case 'T':
                rotateAround = [this.coordinates[1][0],this.coordinates[1][1]];
                break;
            case 'J':
                rotateAround = [this.coordinates[2][0],this.coordinates[2][1]];
                break;
            case 'L':
                rotateAround = [this.coordinates[2][0],this.coordinates[2][1]];
                break;
            case 'Z':
                rotateAround = [this.coordinates[2][0],this.coordinates[2][1]];
                break;
            case 'S':
                rotateAround = [this.coordinates[2][0],this.coordinates[2][1]];
                break;
        }
        let newCoordinates = this.coordinates;
        if(this.shape === 'I'){
            if(this.firstRotationI){
                // rotate 90 degrees clockwise with rotation matrix
                newCoordinates = [
                    [this.coordinates[0][1]-rotateAround[1]+rotateAround[0], rotateAround[0]-this.coordinates[0][0]+rotateAround[1]],
                    [this.coordinates[1][1]-rotateAround[1]+rotateAround[0], rotateAround[0]-this.coordinates[1][0]+rotateAround[1]],
                    [this.coordinates[2][1]-rotateAround[1]+rotateAround[0], rotateAround[0]-this.coordinates[2][0]+rotateAround[1]],
                    [this.coordinates[3][1]-rotateAround[1]+rotateAround[0], rotateAround[0]-this.coordinates[3][0]+rotateAround[1]],
                ];
                this.firstRotationI = false;
            }else{
                // rotate 90 degrees counter-clockwise with rotation matrix
                newCoordinates = [
                    [rotateAround[1]-this.coordinates[0][1]+rotateAround[0], this.coordinates[0][0]-rotateAround[0]+rotateAround[1]],
                    [rotateAround[1]-this.coordinates[1][1]+rotateAround[0], this.coordinates[1][0]-rotateAround[0]+rotateAround[1]],
                    [rotateAround[1]-this.coordinates[2][1]+rotateAround[0], this.coordinates[2][0]-rotateAround[0]+rotateAround[1]],
                    [rotateAround[1]-this.coordinates[3][1]+rotateAround[0], this.coordinates[3][0]-rotateAround[0]+rotateAround[1]],
                ];
                this.firstRotationI = true;
            }
        }else if(this.shape === 'O'){
            // no rotation
        }else{
            // rotate 90 degrees clockwise with rotation matrix
            newCoordinates = [
                [this.coordinates[0][1]-rotateAround[1]+rotateAround[0], rotateAround[0]-this.coordinates[0][0]+rotateAround[1]],
                [this.coordinates[1][1]-rotateAround[1]+rotateAround[0], rotateAround[0]-this.coordinates[1][0]+rotateAround[1]],
                [this.coordinates[2][1]-rotateAround[1]+rotateAround[0], rotateAround[0]-this.coordinates[2][0]+rotateAround[1]],
                [this.coordinates[3][1]-rotateAround[1]+rotateAround[0], rotateAround[0]-this.coordinates[3][0]+rotateAround[1]],
            ];
        }

        if(this.stayInside(newCoordinates)){
            this.coordinates = newCoordinates;
            return newCoordinates;
        }else{
            return [];
        }
    }

    createPiece(){
        switch (this.shape) {
            case 'I':
                this.bordertop = '#def1f4';
                this.color = '#aedde5';
                this.borderlr = '#83b9c3';
                this.borderbottom = '#4a8c98';
                this.coordinates.push([this.x,this.y-1]);
                this.coordinates.push([this.x,this.y-2]);
                this.coordinates.push([this.x,this.y-3]);
                break;
            case 'O':
                this.bordertop = '#ffffb5';
                this.color = '#f9f0a3';
                this.borderlr = '#ecdf86';
                this.borderbottom = '#d9ad43';
                this.coordinates.push([this.x,this.y-1]);
                this.coordinates.push([this.x+1,this.y]);
                this.coordinates.push([this.x+1,this.y-1]);
                break;
            case 'T':
                this.bordertop = '#ffedf5';
                this.color = '#ebd7e0';
                this.borderlr = '#ccaacb';
                this.borderbottom = '#966d95';
                this.coordinates.push([this.x,this.y-1]);
                this.coordinates.push([this.x+1,this.y-1]);
                this.coordinates.push([this.x-1,this.y-1]);
                break;
            case 'J':
                this.bordertop = '#ffe5db';
                this.color = '#ffc6bf';
                this.borderlr = '#de9a91';
                this.borderbottom = '#bd5c6a';
                this.coordinates.push([this.x+1,this.y]);
                this.coordinates.push([this.x+1,this.y-1]);
                this.coordinates.push([this.x+1,this.y-2]);
                break;
            case 'L':
                this.bordertop = '#ffe6d5';
                this.color = '#ffc7a2';
                this.borderlr = '#e7a477';
                this.borderbottom = '#cb7943';
                this.coordinates.push([this.x+1,this.y]);
                this.coordinates.push([this.x,this.y-1]);
                this.coordinates.push([this.x,this.y-2]);
                break;
            case 'Z':
                this.bordertop = '#e2f4e1';
                this.color = '#cce2cb';
                this.borderlr = '#97c1a9';
                this.borderbottom = '#589371';
                this.coordinates.push([this.x+1,this.y]);
                this.coordinates.push([this.x,this.y-1]);
                this.coordinates.push([this.x-1,this.y-1]);
                break;
            case 'S':
                this.bordertop = '#ffddd8';
                this.color = '#ffaba0';
                this.borderlr = '#de7264';
                this.borderbottom = '#b34a3c';
                this.coordinates.push([this.x+1,this.y]);
                this.coordinates.push([this.x+1,this.y-1]);
                this.coordinates.push([this.x+2,this.y-1]);
                break;
        }
        return this.coordinates;
    }

}

class Block{
    constructor(x, y, bordertop, color, borderlr, borderbottom) {
        this.bordertop = bordertop;
        this.color = color;
        this.borderlr = borderlr;
        this.borderbottom = borderbottom;
        this.x = x;
        this.y = y;
    }

    changeColor(bordertop, color, borderlr, borderbottom){
        this.bordertop = bordertop;
        this.color = color;
        this.borderlr = borderlr;
        this.borderbottom = borderbottom;
    }

    createBlock(){
        this.blockDiv = document.createElement('div');
        this.blockDiv.setAttribute('class','block');
        this.blockDiv.style.borderTopColor = this.bordertop;
        this.blockDiv.style.backgroundColor = this.color;
        this.blockDiv.style.borderLeftColor = this.borderlr;
        this.blockDiv.style.borderRightColor = this.borderlr;
        this.blockDiv.style.borderBottomColor = this.borderbottom;
        return this.blockDiv;
    }

}