/**
 * @class
 * @property [boolean] state - If is alive or dead
 * @property [number] size - Side size in pixels
 * @property [object] position - Coordinates in the grid
 */
class Cell {
  constructor(state, position, size) {
    this.state = state;
    this.size = size;
    this.position = {
      x: position.x,
      y: position.y
    };
  }

  /**
   * Draws the cell in the canvas
   * @method
   * @param [object] context - Canvas context
   */
  draw(context) {
    context.fillStyle = this.state ? '#ffffff' : '#000000';
    context.fillRect(
      this.position.x * this.size,
      this.position.y * this.size,
      this.size,
      this.size
    );
    context.strokeStyle = "#787878";
    context.strokeRect(
      this.position.x * this.size,
      this.position.y * this.size,
      this.size,
      this.size
    );
  }
}
