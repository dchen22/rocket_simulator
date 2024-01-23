import { Rocket } from '../rocket/Rocket.js';
import { accelerateUp, turnLeft, turnRight, accelerateDown } from '../js/movementButtons.js';
import { SpaceObject, Satellite } from '../space/SpaceObjects.js';
import { ORI_X, ORI_Y } from '../display/DisplayMethods.js';

export const canvas = document.getElementById('canvas1'); // references html canvas tag
export const minimapCanvas = document.getElementById('minimap'); // Add this line
/** @type {CanvasRenderingContext2D} */
export const ctx = canvas.getContext('2d'); // something about apis
/** @type {CanvasRenderingContext2D} */
export const minimapCtx = minimapCanvas.getContext('2d'); // Add this line

const scaleFactor = 10000; // Add this line


// make sure canvas fills up the entire page
canvas.width = window.innerWidth; 
canvas.height = window.innerHeight;

// ensures elements are not distorted when window is resized
window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    minimapCanvas.width = 200; // Update the minimap canvas size as needed
    minimapCanvas.height = 200;
    updateMinimap(); // Call this function to update the minimap content
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

var spaceObjects = [
    new Satellite(-300, -300, 100, "white", "grey", true),
    new Satellite(3750, 3750, 5000, "yellow", "orange", false),
];

// Add a function to update the minimap content
function updateMinimap() {
    // TODO
}

function drawMinimap() {
    // TODO
}

function drawMinimapObject(object) {
    // TODO
}

function getNearbyObjects(centerObject, objects, radius) {
    return objects.filter(obj => {
        const distance = Math.sqrt((obj.x - 0) ** 2 + (obj.y - 0) ** 2);
        return distance <= radius;
    });
}

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

    updateMinimap(); // Update the minimap content

    requestAnimationFrame(animate);
}
animate();