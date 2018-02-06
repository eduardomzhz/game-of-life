/**
 * @class
 * @property [number] size - Length of the grid
 * @property [HTMLElement] container - Div container
 * @property [HTMLElement] canvas - Canvas
 * @property [object] context - Canvas 2d context
 * @property [array] matrix - Grid of cells at current time
 * @property [array] backup - Grid of cells one step before
 * @property [function] loop - Updating and rendering cycle
 */
class Game {
  constructor(container, size) {
    this.size = size || 50;
    this.container = container;
    this.canvas = this.setCanvas();
    this.context = this.canvas.getContext('2d');
    this.container.appendChild(this.canvas);
    this.matrix = this.setMatrix();
    this.backup = this.matrix.slice();

    let step = 1 / 2;
    let lastTime = 0;
    let deltaTime = 0;

    this.loop = (currentTime = 0) => {
      deltaTime += (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      while (deltaTime > step) {
        this.update();
        deltaTime -= step;
      }
      this.render();
      requestAnimationFrame(this.loop);
    };

    requestAnimationFrame(this.loop);
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
      neighbors[this.backup[y][x+1].state] ++;
      if (y > 0) {
        neighbors[this.backup[y-1][x+1].state] ++;
      }
    }
    if (x > 0 && x < this.size) {
      neighbors[this.backup[y][x - 1].state] ++;
      if (y < this.size - 1) {
        neighbors[this.backup[y+1][x-1].state] ++;
      }
    }
    if (y >= 0 && y < this.size - 1) {
      neighbors[this.backup[y + 1][x].state] ++;
      if (x < this.size - 1 && y < this.size - 1) {
        neighbors[this.backup[y+1][x+1].state] ++;
      }
    }
    if (y > 0 && y < this.size) {
      neighbors[this.backup[y - 1][x].state] ++;
      if (x > 0 && y > 0) {
        neighbors[this.backup[y-1][x-1].state] ++;
      }
    }
    return neighbors;
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
    for (let i = 0; i < this.size; i++) {
      let row = [];
      for (let j = 0; j < this.size; j++) {
        let state = Math.random() > 0.90;
        let position = { x: j, y: i };
        row.push(new Cell(state, position, cellSize));
      }
      matrix.push(row);
    }
    return matrix;
  }

  /**
   * Applies the rules and updates each cell
   * A live cell with more than 3 live neighbors dies
   * A live cell with less than 2 live neighbors dies
   * A dead cell with more than 3 live neighbors lives
   * @method
   */
  update() {
    this.backup.map((row, x) => {
      row.map((cell, y) => {
        let neighbors = this.getNeighbors(cell);
        // TODO: Check rules
        if (cell.state === ALIVE && (neighbors[ALIVE] > 3 || neighbors[ALIVE] < 2)) {
          this.matrix[x][y].state = DEAD;
        } else if (cell.state === DEAD && neighbors[ALIVE] >= 3) {
          this.matrix[x][y].state = ALIVE;
        }
      });
    });
    this.backup = this.matrix.slice();
  }
}
