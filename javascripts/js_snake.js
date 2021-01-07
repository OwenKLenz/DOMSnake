const MODELS = {
  segment: function() {
    let segment = document.createElement('span');
    segment.classList.add('segment');
    return segment;
  }(),

  food: function() {
    let segment = document.createElement('span');
    segment.classList.add('food');
    return segment;
  }(),
}

const BOARD_WIDTH = 500;
const BOARD_HEIGHT = 500;

class Food {
  constructor() {
    this.container = document.querySelector('#board');
    this.element = MODELS.food.cloneNode();
    this.container.insertAdjacentElement('afterbegin', this.element);
  }

  generateRandomCoords() {
    this.x = Number(String(Math.round(Math.random() * (BOARD_WIDTH - 20))).replace(/.$/, '0')) + 10;
    this.y = Number(String(Math.round(Math.random() * (BOARD_HEIGHT - 20))).replace(/.$/, '0')) + 10;
  }

  redraw() {
    this.element.style.top = String(this.y) + 'px';
    this.element.style.left = String(this.x) + 'px';
  }
}

class Segment {
  constructor() {
    this.container = document.querySelector('#board');
    this.element = MODELS.segment.cloneNode();
  }

  add(x, y) {
    this.x = x;
    this.y = y;
    this.container.append(this.element);
    return this;
  }

  set x(coord) {
    this.currentX = coord;
    this.element.style.left = String(coord) + 'px';
  }

  set y(coord) {
    this.currentY = coord;
    this.element.style.top = String(coord) + 'px';
  }

  get x() {
    return this.currentX;
  }

  get y() {
    return this.currentY;
  }

  remove() {
    this.element.remove();
  }
}

class Snake {
  constructor() {
    this.currentX = 20;
    this.currentY = 0;
    this.segs = [];
    this.currentDirection = 'east';
  }

  init() {
    this.removeAllSegs();
    this.segs = [
      new Segment().add(0, 0),
      new Segment().add(10, 0),
      new Segment().add(20, 0),
    ];
  }

  addSegment() {
    let seg = new Segment().add(this.currentX, this.currentY);
    this.segs.push(seg);
  }

  removeAllSegs() {
    let length = this.segs.length;
    for (let i = 0; i < length; i++) {
      this.segs[0].remove();
      this.segs.shift();
    }
  }

  validMove(event) {
    let neckX = this.segs[this.segs.length - 2].x;
    let neckY = this.segs[this.segs.length - 2].y;
    let invalid = false;

    if (event.key === 's') {
      invalid = this.currentY + 10 === neckY && this.currentX === neckX; 
    } else if (event.key === 'a') {
      invalid = this.currentY === neckY && this.currentX - 10 === neckX; 
    } else if (event.key === 'd') {
      invalid = this.currentY === neckY && this.currentX + 10 === neckX; 
    } else if (event.key === 'w') {
      invalid = this.currentY - 10 === neckY && this.currentX === neckX; 
    }

    return !invalid;
  }

  removeTailSegment() {
    this.segs[0].remove();
    this.segs.shift();
  }

  tailCollision() {
    let head = this.findHead();

    return this.segs.slice(0, -1).some(seg => {
      return seg.y === head.y && seg.x === head.x;
    });
  }

  wallCollision() {
    return this.currentY < 0 ||
      this.currentX < 0 ||
      this.currentY >= BOARD_HEIGHT ||
      this.currentX >= BOARD_WIDTH;
  }

  findHead() {
    return this.segs[this.segs.length - 1];
  }

  move() {
    switch (this.currentDirection) {
      case 'south':
        this.currentY += 10;
        break;
      case 'west':
        this.currentX -= 10;
        break;
      case 'east':
        this.currentX += 10;
        break;
      case 'north':
        this.currentY -= 10;
        break;
    }

    this.moveSegs();
  }

  moveSegs() {
    for (let i = 0; i < this.segs.length; i++) {
      let currentSeg = this.segs[i];

      if (i === this.segs.length - 1) {
        currentSeg.y = this.currentY;
        currentSeg.x = this.currentX;
      } else {
        currentSeg.y = this.segs[i + 1].y;
        currentSeg.x = this.segs[i + 1].x;
      }
    }
  }
}

class SnakeGame {
  constructor() {
    this.board = document.getElementById('board');
    this.currentScore = document.getElementById('currentScore');
    this.counter = 3;
    this.snake = new Snake();
    this.food = new Food();
    this.init();
  }

  incrementCounter() {
    this.counter += 1;
    this.currentScore.innerText = String(this.counter);
  }

  displayScores() {
    this.counter = 3;
    this.currentScore.innerText = String(this.counter);
    document.getElementById("highScore").innerText = localStorage.longestSnake;
  }

  foundFood() {
    let head = this.snake.findHead();
    return head.x === this.food.x && head.y === this.food.y;
  }

  play() {
    this.intervalId = setInterval(() => {
      if (this.foundFood()) {
        this.placeFood();
        this.incrementCounter();
        this.snake.addSegment();
      } else if ((this.snake.wallCollision() || this.snake.tailCollision())) {
        clearInterval(this.intervalId);
        this.setHighScore();
        alert(`Game over!\nCurrent High Score: ${localStorage.longestSnake}`);
        this.snake.removeAllSegs();
        this.snake = new Snake();
        this.init();
      }

      this.snake.move();
    }, 150);
  }

  setHighScore() {
    if (!localStorage.longestSnake) {
      localStorage.longestSnake = String(this.counter);
    } else if (Number(localStorage.longestSnake) < this.counter ) {
      localStorage.longestSnake = String(this.counter);
    }
  }

  init() {
    this.displayScores();
    this.snake.init();
    this.placeFood();
    this.bindListeners();
    this.play();
  }

  placeFood() {
    do {
      this.food.generateRandomCoords();
    } while (this.invalidFoodPosition());

    this.food.redraw();
  }

  invalidFoodPosition() {
    return this.snake.segs.some(seg => {
      return seg.x === this.food.x & seg.y === this.food.y;
    });
  }


  bindListeners() {
    document.addEventListener('keydown', event => {
      if (event.key === 's' && this.snake.validMove(event)) {
        this.snake.currentDirection = 'south';
      } else if (event.key === 'a' && this.snake.validMove(event)) {
        this.snake.currentDirection = 'west';
      } else if (event.key === 'd' && this.snake.validMove(event)) {
        this.snake.currentDirection = 'east';
      } else if (event.key === 'w' && this.snake.validMove(event)) {
        this.snake.currentDirection = 'north';
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new SnakeGame().play();
});
