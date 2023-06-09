// module aliases
var Engine = Matter.Engine;
var Render = Matter.Render;
var Bodies = Matter.Bodies;
var Composite = Matter.Composite;

// create an engine
const engine = Engine.create();
engine.gravity.scale /= 6.04; // Moon gravity

const win = {
  width: 800,
  height: 600,
  hWidth: 400,
  hHeight: 300,
};

const rocketSize = 20;
const rocket = new Rocket(win.hWidth, win.hHeight, rocketSize);

const groundHeight = 60;
const groundWidth = 10 ** 5;
const ground = Bodies.rectangle(
  win.hWidth,
  win.height - groundHeight / 2,
  groundWidth,
  groundHeight,
  { isStatic: true }
);

Composite.add(engine.world, [rocket.body, ground]);

// create a renderer
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: win.width,
    height: win.height,
    showAngleIndicator: true,
    showCollisions: true,
    showVelocity: true,
    showIds: true,
    showPositions: true,
  },
});

let oldRocketPosition = { ...rocket.body.position };

Matter.Events.on(render, "beforeRender", function () {
  var canvas = render.canvas;
  var context = canvas.getContext("2d");

  const dy =
    rocket.body.position.y <= win.hHeight
      ? oldRocketPosition.y - rocket.body.position.y
      : 0;

  context.translate(oldRocketPosition.x - rocket.body.position.x, dy); // Move camera to the left

  oldRocketPosition = { ...rocket.body.position };
});

Render.run(render);

let keyLeftPressed = false;
let keyRightPressed = false;
let mustIncThrottle = false;
let mustDecThrottle = false;
let mustToggleEngine = false;

const setKeys = (e, bool) => {
  if (e.key === "ArrowUp") mustIncThrottle = bool;
  else if (e.key === "ArrowDown") mustDecThrottle = bool;
  else if (e.key === "ArrowLeft") keyLeftPressed = bool;
  else if (e.key === "ArrowRight") keyRightPressed = bool;
  else if (e.key === " ") mustToggleEngine = bool;
};

document.addEventListener("keydown", e => setKeys(e, true));
document.addEventListener("keyup", e => setKeys(e, false));

// run the engine
(function run() {
  if (keyLeftPressed) rocket.rotate(-1);
  if (keyRightPressed) rocket.rotate(1);

  if (mustToggleEngine) {
    rocket.toggleEngine();
    mustToggleEngine = false;
  }

  if (mustIncThrottle) {
    rocket.setThrottle(rocket.throttle + Rocket.throttleRate);
    mustIncThrottle = false;
  }

  if (mustDecThrottle) {
    rocket.setThrottle(rocket.throttle - Rocket.throttleRate);
    mustDecThrottle = false;
  }

  rocket.update();

  window.requestAnimationFrame(run);
  Engine.update(engine, 1000 / 60);
})();
