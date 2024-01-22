import { Rocket } from '../rocket/Rocket.js';
import { accelerateUp, turnLeft, turnRight, accelerateDown } from '../js/movementButtons.js';
import { SpaceObject } from '../space/SpaceObjects.js';

const canvas = document.getElementById('canvas1'); // references html canvas tag
/** @type {CanvasRenderingContext2D} */
export const ctx = canvas.getContext('2d'); // something about apis

// make sure canvas fills up the entire page
canvas.width = window.innerWidth; 
canvas.height = window.innerHeight;

// ensures elements are not distorted when window is resized
window.addEventListener('resize', function() {
    canvas.width = window.innerWidth; 
    canvas.height = window.innerHeight;
});

const mouse = {
    x: undefined,
    y: undefined,
}

canvas.addEventListener('click', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

canvas.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
});








var main_rocket = new Rocket(0, 0);

var spaceObjects = [];

var moon1 = new SpaceObject(0, 0, 100);

spaceObjects.push(moon1);

const accelerateButtons = {
    up: document.getElementById('accelerate_up'),
    left: document.getElementById('turn_left'),
    right: document.getElementById('turn_right'),
    down: document.getElementById('accelerate_down'),
};

// Set up event listeners for mousedown and mouseup events
Object.values(accelerateButtons).forEach(button => {
    button.addEventListener('mousedown', function() {
        button.isPressed = true;
    });

    button.addEventListener('mouseup', function() {
        button.isPressed = false;
    });
});


// continuous animation
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (accelerateButtons.up.isPressed) {
        accelerateUp(main_rocket, spaceObjects);
    }

    if (accelerateButtons.left.isPressed) {
        turnLeft(main_rocket, spaceObjects);
    }

    if (accelerateButtons.right.isPressed) {
        turnRight(main_rocket, spaceObjects);
    }

    if (accelerateButtons.down.isPressed) {
        accelerateDown(main_rocket, spaceObjects);
    }

    main_rocket.move(spaceObjects);
    
    for (let i = 0; i < spaceObjects.length; i++) {
        spaceObjects[i].display();
    }
   
    main_rocket.display();    

    requestAnimationFrame(animate);
}
animate();