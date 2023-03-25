var Bodies = Matter.Bodies;
var Body = Matter.Body;

class Rocket {
  static throttleScale = 0.0002;
  static rotScale = 0.00003;

  static throttleRate = 0.01;
  static throttleMin = 0.1;
  static throttleMax = 0.6;
  constructor(x, y, size) {
    this.body = Bodies.rectangle(x, y, size, size, {
      frictionAir: 0,
      angle: -Math.PI / 2,
    });

    this.engineOn = false;
    this.throttle = 0.1;
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
    console.log("rotating", dir, this.body.angularVelocity);
  }

  setThrottle(val) {
    val = Math.min(val, Rocket.throttleMax);
    val = Math.max(val, Rocket.throttleMin);

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
      this.thrustVec.mult(this.throttle)
    );
  }
}
