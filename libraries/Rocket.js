var Bodies = Matter.Bodies;
var Body = Matter.Body;

class Rocket {
  static throttleScale = 0.0002;
  static rotScale = 0.00003;

  static throttleRate = 0.01;
  static throttleMin = 0.101125; // Just for now so it's easy to get to hover
  static throttleMax = 0.601125; // (these normally should have nothing after 0.X)

  constructor(x, y, size) {
    this.body = Bodies.rectangle(x, y, size, size, {
      frictionAir: 0,
      angle: -Math.PI / 2,
    });

    this.engineOn = false;
    this.throttle = 0.101125; // starting here to be able to get to hover
  }

  get thrustVec() {
    const v = new Vector(Math.cos(this.body.angle), Math.sin(this.body.angle));
    return v.mult(Rocket.throttleScale);
  }

  rotate(dir) {
    Body.setAngularVelocity(
      this.body,
      this.body.angularVelocity + Rocket.rotScale * dir
    );
    console.log(
      `rotating towards ${dir} spinning at ${this.body.angularVelocity}`
    );
  }

  // Rocket currently seems to hover best at throttle=0.331125
  setThrottle(val) {
    val = Math.min(val, Rocket.throttleMax);
    val = Math.max(val, Rocket.throttleMin);

    console.log(`setting throttle from ${this.throttle} to ${val}`);
    this.throttle = val;
  }

  toggleEngine() {
    this.engineOn = !this.engineOn;
    console.log(`toggling engines to ${this.engineOn}`);
  }

  update() {
    if (this.engineOn) this.thrust();
  }

  thrust() {
    Body.applyForce(
      this.body,
      this.body.position,
      this.thrustVec.mult(this.throttle)
    );
  }
}
