'use strict'

const cl = console.log;

class Board {
// Board just holds a game state essentially
  constructor(unitsWide, unitsHigh) {
    cl('new Board()');
    // how this data could be generated dynamically - async / server requests
    // how to do this?  board should be a 2d array of square objects
    // square objects have the following properties:
    //   filled: Boolean
    //   color:  p5.Color
    // probably simpler to just b object literals 
    // can't use new Array(size) and then array.fill to create board -- will link all values in rows
    this.unitsWide = unitsWide;
    this.unitsHigh = unitsHigh;

    this.squares = (function(unitsHigh, unitsWide) {
      // IIFE -- sometimes it is nice to set a variable as the result of invoking a function that only needs to be invoked once
      const result = [];

      for (let y = 0; y < unitsHigh; y++) {
        result.push([]);

        for (let x = 0; x < unitsWide; x++) {
          result[y].push({ 
            filled: false, 
            color: color(0, 0, 0) 
          }); 
        }
      }
      return result
    })(unitsHigh, unitsWide)

    cl('this:', this);
  }

  findFullRows() {
    cl('board.findFullRows()')
    // has to be able to remove multiple rows potentially -
    // this function just returns an array of rows that are full and 
    // it will pass them to another function that will remove those rows and shift the rest of the board down
    // for efficiency it will stop when it finds an empty row
    const indexes = [];

    for (let y = this.unitsHigh - 1; y >= 0; y--) {
      let emptyRow = true;
      let fullRow = true;

      for (let x = 0; x < this.unitsWide; x++) {
        if (this.squares[y][x].filled) emptyRow = false;
        else fullRow = false;

        if (!fullRow && !emptyRow) break
      }
      if (fullRow) indexes.push(y);

      if (emptyRow) {
        this.lowestEmptyRow = y;

        return indexes
      }
    }
    // no empty rows & no full rows -- game is over
    return indexes.length > 0 ? indexes: 'GAME OVER'
  }

  removeFullRows(indexes) {
    cl('board.removeFullRows(', indexes, ')');

    if (typeof indexes === 'string' || indexes.length === 0) return indexes
    
    for (let i = 0; i < indexes.length; i++) {
      delete this.squares[indexes[i]]

      const newRow = [];

      for (let x = 0; x < this.unitsWide; x++) {
        newRow.push({ 
          filled: false, 
          color: color(0, 0, 0) 
        }); 
      }

      this.squares.unshift(newRow);
    }
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

class Tet {
// has to have position && limbs properties and rotate && move functions that affect these.
  constructor(middle) {
    cl('new Tet()');

    this.bodyPosition = ({ x: middle, y: 4 });

    this.canMoveLeft = true;
    this.canMoveRight = true;

    const possibleTypes = [
      { 
        alias: 'I',
        arms: [
          { x: 0, y: 1 },
          { x: 0, y: -1 },
          { x: 0, y: -2 }
        ], 
        color: color(0, 228, 255)
      },
      { 
        alias: 'T',
        arms: [
          { x: -1, y: 0 },
          { x: 0, y: 1 },
          { x: 1, y: 0 }
        ], 
        color: color(159, 0, 150)
      },
      { 
        alias: 'Z',
        arms: [
          { x: -1, y: 0 },
          { x: 0, y: -1 },
          { x: 1, y: -1 }
        ], 
        color: color(105, 182, 37)
      },
      {
        alias: 'S', 
        arms: [
          { x: 1, y: 0 },
          { x: 0, y: -1 },
          { x: -1, y: -1 }
        ], 
        color: color(245, 0, 0)
      },
      { 
        alias: 'O',
        arms: [
          { x: -1, y: 0 },
          { x: -1, y: -1 },
          { x: 0, y: -1 }
        ], 
        color: color(250, 255, 0)
      },
      { 
        alias: 'J',
        arms: [
          { x: 0, y: 1 },
          { x: 0, y: -1 },
          { x: 1, y: -1 }
        ], 
        color: color(255, 141, 0)
      },
      { 
        alias: 'L',
        arms: [
          { x: 0, y: 1 },
          { x: 0, y: -1 },
          { x: -1, y: -1 }
        ], 
        color: color(255, 81, 188)
      },
    ];

    const type = possibleTypes[Math.floor(Math.random() * possibleTypes.length)];
    
    this.arms = type.arms; 
    this.color = type.color;

    cl('alias:', type.alias);
    cl('this:', this);
  }

  drop() {
    cl('tet.drop()');

    this.bodyPosition.y++;
  }

  move(direction) {
    cl('tet.move(', direction, ')');

    if (direction === 'LEFT' && this.canMoveLeft) {
      this.bodyPosition.x--;
    } else if (direction === 'RIGHT' && this.canMoveRight) {
      this.bodyPosition.x++;
    }
  }

  rotate(spin) {
    cl('tet.rotate(', spin, ')');

    const a = this.arms[0];
    const b = this.arms[1];
    const c = this.arms[2];

    if (spin === 'CLOCKWISE') {
      // x = -y, y = x
      this.arms[0] = { x: -a.y, y: a.x };

      this.arms[1] = { x: -b.y, y: b.x };

      this.arms[2] = { x: -c.y, y: c.x };
    } else if (spin === 'COUNTER-CLOCKWISE') {
      // x = y, y = -x
      this.arms[0] = { x: a.y, y: -a.x };
      
      this.arms[1] = { x: b.y, y: -b.x };

      this.arms[2] = { x: c.y, y: -c.x };
    }
  }

  positions() {
    cl('tet.positions()');

    const bodPos = this.bodyPosition;
    const aPos = { x: bodPos.x + this.arms[0].x, y: bodPos.y + this.arms[0].y };
    const bPos = { x: bodPos.x + this.arms[1].x, y: bodPos.y + this.arms[1].y };
    const cPos = { x: bodPos.x + this.arms[2].x, y: bodPos.y + this.arms[2].y };

    // cl('positions:', fulPos, aPos, bPos, cPos);
    return [bodPos, aPos, bPos, cPos];
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

class Game {
// the Game updates the Board and creates new Tets 
// understanding the relationships beetween concurrent actions and functions
// the relationship beetween methods and attributes
  constructor(unitsWide = 12, unitsHigh = 20) {
    cl('new Game()');
    this.active = true;
    this.over = false;
    this.speed = 500; // millis
    this.board = new Board(unitsWide, unitsHigh);
    this.size = 15;
    this.currentTet = new Tet(Math.floor(unitsWide / 2));
    this.landed = false;
    cl('this', this);
  }

  toggleActive() {
    cl('game.toggleActive()');
    this.active = !this.active;
  }

  tick() {
    cl('game.tick()');
    if (!this.over && this.active) {
      if (this.landed) {
        this.buildInLanded();

        if (this.board.removeFullRows(this.board.findFullRows()) === 'GAME OVER') {
          this.over = true;

          return
        }
        this.currentTet = new Tet(Math.floor(this.board.unitsWide / 2));
        
        this.landed = false;
      }
      this.currentTet.drop();

      this.collisionDetect();

      this.render();
    } 
  }

  collisionDetect() {
    // will have to seperate into edge hits and lands eventually
    cl('game.colisionDetect()');
    const positions = this.currentTet.positions();
    // console.table('positions:', positions);
    
    const leftEdge = Math.min(positions[1].x, positions[2].x, positions[3].x);
    const rightEdge = Math.max(positions[1].x, positions[2].x, positions[3].x);
    const bottomEdge = Math.max(positions[1].y, positions[2].y, positions[3].y);
    
    // check to see if Tet is touching either left or right edge
    if (leftEdge === 0) this.currentTet.LEFT === false;
    else this.currentTet.LEFT === true;
    
    if (rightEdge === this.board.unitsWide - 1) this.currentTet.RIGHT === false;
    else this.currentTet.RIGHT === true;
    
    // check to see if Tet has landed
    if (bottomEdge === this.board.unitsHigh - 1) {
      this.landed = true;
    } else {
      positions.forEach(position => {
        // cl(position);
        // cl(this.board.squares[position.y + 1][position.x])
        if (this.board.squares[position.y + 1][position.x].filled) {
          this.landed = true;
          
          return
        }
      })
    }
  }

  buildInLanded() {
    cl('game.buildInLanded()');
    const positions = this.currentTet.positions();

    positions.forEach(position => {
      cl(position);
      this.board.squares[position.y][position.x].filled = true;
    })
  }

  render() {
    cl('game.render()');
    stroke(120);

    this.board.squares.forEach(row => {
      row.forEach(square => {
        if (!square.filled) square.color = color(0, 0, 0);
      })
    });
    
    this.currentTet.positions().forEach(position => {
      this.board.squares[position.y][position.x].color = this.currentTet.color;
    })

    for(let y = 0; y < this.board.unitsHigh; y++) {
      for(let x = 0; x < this.board.unitsWide; x++) {
        push();

        translate(this.size * x, this.size * y);

        fill(this.board.squares[y][x].color);

        rect(0, 0, this.size, this.size);

        pop();
      }
    }
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
let currentGame;
let tick = 0;

function setup() {
  cl('setup()');

  createCanvas(400, 400);

  background(120);

  currentGame = new Game();
}

function draw() {
  // cl('draw()');
  if (millis() - tick > currentGame.speed) {
    currentGame.tick();

    tick = millis();
  }
  // if (currentGame.active) currentGame.render();
}

function keyPressed() {
  cl('keyPressed(), key ===', key);

  if (key === 'Q') currentGame.currentTet.move('LEFT');
  else if (key === 'W') currentGame.currentTet.move('RIGHT');
  else if (key === 'A') currentGame.currentTet.rotate('COUNTER-CLOCKWISE');
  else if (key === 'S') currentGame.currentTet.rotate('CLOCKWISE');
  else if (key === 'P') currentGame.toggleActive();
  else if (key === 'R') currentGame = new Game();
}
