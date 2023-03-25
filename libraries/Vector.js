class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  mult(val) {
    this.x *= val;
    this.y *= val;

    return this;
  }
}
