class Cell {
  constructor(state, position, size) {
    this.state = state;
    this.size = size;
    this.position = {
      x: position.x,
      y: position.y
    };
  }

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
