var Bodies = Matter.Bodies;
var Body = Matter.Body;

class Rocket {
  static throttleRate = 0.01;
  static throttleLimit = {
    min: 0.1,
    max: 0.6,
  };

  constructor(x, y, size) {
    this.body = Bodies.rectangle(x, y, size, size, {
      frictionAir: 0,
      angle: -Math.PI / 2,
    });

    this.engineOn = false;
    this.throttle = 0.1;
  }

  get thrustVec() {
    return new Vector(Math.cos(this.body.angle), Math.sin(this.body.angle));
  }

  rotate(dir) {
    Body.setAngularVelocity(
      this.body,
      this.body.angularVelocity + 0.00003 * dir
    );
    console.log("rotating", dir, this.body.angularVelocity);
  }

  setThrottle(val) {
    val = Math.min(val, Rocket.throttleLimit.max);
    val = Math.max(val, Rocket.throttleLimit.min);

    console.log("setting throttle", this.throttle, val);
    this.throttle = val;
  }

  toggleEngine() {
    this.engineOn = !this.engineOn;
    console.log("toggling engines to", this.engineOn);
  }

  update() {
    if (this.engineOn) this.thrust();
  }

  thrust() {
    Body.applyForce(
      this.body,
      this.body.position,
      this.thrustVec.mult(0.0002 * this.throttle)
    );
  }
}
