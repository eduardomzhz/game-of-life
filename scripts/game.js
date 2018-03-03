/**
 * @class
 * @property [number] size - Length of the grid
 * @property [HTMLElement] container - Div container
 * @property [HTMLElement] canvas - Canvas
 * @property [object] context - Canvas 2d context
 * @property [number] speed - Step speed
 * @property [array] matrix - Grid of cells at current time
 * @property [function] loop - Updating and rendering cycle
 */
class Game {
  constructor(container, size) {
    this.isActive = false;
    this.size = size || 40;
    this.container = container;
    this.canvas = this.setCanvas();
    this.context = this.canvas.getContext('2d');
    this.container.appendChild(this.canvas);
    this.clearButton = document.getElementById('clear');
    this.randomButton = document.getElementById('random');
    this.startButton = document.getElementById('start');
    this.speedInput = document.getElementById('speed');
    this.speed = this.speedInput.value;
    this.matrix = this.setMatrix();
    this.bindEvents();

    let lastTime = 0;
    let deltaTime = 0;

    this.loop = (currentTime = 0) => {
      deltaTime += (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      while (deltaTime > this.speed) {
        if (this.isActive) {
          this.update();
        }
        deltaTime -= this.speed;
      }
      this.render();
      requestAnimationFrame(this.loop);
    };

    requestAnimationFrame(this.loop);
  }

  /**
   * Binds controllers events
   * @method
   */
  bindEvents() {
    this.canvas.addEventListener('click', this.toggleCellState.bind(this));
    this.clearButton.addEventListener('click', this.clearMatrix.bind(this));
    this.randomButton.addEventListener('click', this.randomizeMatrix.bind(this));
    this.startButton.addEventListener('click', this.toggleGameState.bind(this));
    this.speedInput.addEventListener('change', this.setSpeed.bind(this));
  }

  /**
   * Sets the matrix cells to DEAD state
   * @method
   * @param [object] cell - Reference cell
   * @return [object] - DEAD and ALIVE number of cells
   */
  clearMatrix() {
    this.matrix.map(row => {
      row.map(cell => {
        cell.state = DEAD;
      });
    });
  }

  /**
   * Gets the state of the adyacent cells
   * @method
   * @param [object] cell - Reference cell
   * @return [object] - DEAD and ALIVE number of cells
   */
  getNeighbors(cell) {
    let neighbors = { true: 0, false: 0 };
    let x = cell.position.x;
    let y = cell.position.y;
    if (x >= 0 && x < this.size - 1) {
      neighbors[this.matrix[y][x+1].state] ++;
      if (y > 0) {
        neighbors[this.matrix[y-1][x+1].state] ++;
      }
    }
    if (x > 0 && x < this.size) {
      neighbors[this.matrix[y][x - 1].state] ++;
      if (y < this.size - 1) {
        neighbors[this.matrix[y+1][x-1].state] ++;
      }
    }
    if (y >= 0 && y < this.size - 1) {
      neighbors[this.matrix[y + 1][x].state] ++;
      if (x < this.size - 1 && y < this.size - 1) {
        neighbors[this.matrix[y+1][x+1].state] ++;
      }
    }
    if (y > 0 && y < this.size) {
      neighbors[this.matrix[y - 1][x].state] ++;
      if (x > 0 && y > 0) {
        neighbors[this.matrix[y-1][x-1].state] ++;
      }
    }
    return neighbors;
  }

  /**
   * Sets the matrix cells to random state
   * @method
   */
  randomizeMatrix() {
    this.matrix.map(row => {
      row.map(cell => {
        let state = Math.random() > 0.90;
        cell.state = state;
      });
    });
  }

  /**
   * Draws each cell of the grid
   * @method
   */
  render() {
    this.matrix.map(row => {
      row.map(cell => {
        cell.draw(this.context);
      });
    });
  }

  /**
   * Create the canvas element
   * @method
   * @return [HTMLElement] - Canvas
   */
  setCanvas() {
    let canvas = document.createElement('canvas');
    canvas.width = this.container.clientWidth;
    canvas.height = this.container.clientHeight;
    return canvas;
  }

  /**
   * Creates a random grid of cells
   * @method
   * @return [array] - Grid
   */
  setMatrix() {
    let cellSize = this.canvas.width / this.size;
    let matrix = [];
    for (let y = 0; y < this.size; y++) {
      let row = [];
      for (let x = 0; x < this.size; x++) {
        let position = { x: x, y: y };
        row.push(new Cell(DEAD, position, cellSize));
      }
      matrix.push(row);
    }
    return matrix;
  }

  /**
   * Changes the step speed
   * @method
   */
  setSpeed() {
    this.speed = this.speedInput.value || 0.5;
  }

  /**
   * Gets the state of the adyacent cells
   * @method
   * @param [object] cell - Reference cell
   * @return [object] - DEAD and ALIVE number of cells
   */
  toggleCellState(ev) {
    let cellSize = this.canvas.width / this.size;
    let x = Math.floor(ev.layerX / cellSize);
    let y = Math.floor(ev.layerY / cellSize);
    this.matrix[y][x].state = !this.matrix[y][x].state;
  }

  /**
   * Toggles game isActive property
   * @method
   */
  toggleGameState() {
    this.isActive = !this.isActive;
    this.startButton.textContent = this.isActive ? 'PAUSE' : 'RESUME';
  }

  /**
   * Applies the rules and updates each cell
   * A live cell with more than 3 live neighbors dies
   * A live cell with less than 2 live neighbors dies
   * A dead cell with exactly 3 live neighbors lives
   * @method
   */
  update() {
    let newMatrix = this.setMatrix();
    this.matrix.map((row, y) => {
      row.map((cell, x) => {
        let newState = cell.state;
        let neighbors = this.getNeighbors(cell);
        if (cell.state === ALIVE && (neighbors[ALIVE] > 3 || neighbors[ALIVE] < 2)) {
          newState = DEAD;
        } else if (cell.state === DEAD && neighbors[ALIVE] === 3) {
          newState = ALIVE;
        }
        newMatrix[y][x].state = newState;
      });
    });
    this.matrix = newMatrix.slice();
  }
}
