import { Rocket } from '../rocket/Rocket.js';
import { accelerateUp, turnLeft, turnRight, accelerateDown } from '../js/movementButtons.js';
import { SpaceObject, Satellite } from '../space/SpaceObjects.js';
import { ORI_X, ORI_Y, minimapORI_X, minimapORI_Y } from '../display/DisplayMethods.js';

export const canvas = document.getElementById('canvas1'); // references html canvas tag
/** @type {CanvasRenderingContext2D} */
export const ctx = canvas.getContext('2d'); // something about apis

export const minimapScaleFactor = 200; // minimap scaling factor
export const minimapWidth = 200; // minimap width
export const minimapHeight = 200; // minimap height
export const minimapEdgeWidth = 2; // minimap edge width


// make sure canvas fills up the entire page
canvas.width = window.innerWidth; 
canvas.height = window.innerHeight;

// ensures elements are not distorted when window is resized
window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
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
    drawMinimap(main_rocket, spaceObjects);
}

function drawMinimap(rocket, spaceObjects) {
    ctx.lineWidth = minimapEdgeWidth;
    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(minimapWidth + minimapEdgeWidth / 2, 0);
    ctx.lineTo(minimapWidth + minimapEdgeWidth / 2, minimapHeight + minimapEdgeWidth / 2);
    ctx.lineTo(0, minimapHeight + minimapEdgeWidth / 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    for (let i = 0; i < spaceObjects.length; i++) {
        drawMinimapObject(spaceObjects[i]);
    }

    drawMinimapRocket(rocket);
}

function drawMinimapObject(object) {

    ctx.save();

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(minimapWidth + minimapEdgeWidth / 2, 0);
    ctx.lineTo(minimapWidth + minimapEdgeWidth / 2, minimapHeight + minimapEdgeWidth / 2);
    ctx.lineTo(0, minimapHeight + minimapEdgeWidth / 2);
    ctx.closePath();
    ctx.clip(); // Clip the minimap to the minimap border

    ctx.fillStyle = object.innerColour;
    ctx.strokeStyle = object.edgeColour;
    ctx.lineWidth = object.radius / minimapScaleFactor / 10; // edge of objects on minimap should be 1/10 of the radius of the object

    ctx.beginPath(); 
    ctx.arc(minimapORI_X(object.x), minimapORI_Y(object.y), object.radius / minimapScaleFactor, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    ctx.restore();  
}

function drawMinimapRocket(rocket) {
    ctx.fillStyle = 'gray';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(minimapORI_X(0) - 4, minimapORI_Y(0) + 8);
    ctx.lineTo(minimapORI_X(0) + 4, minimapORI_Y(0) + 8);
    ctx.lineTo(minimapORI_X(0), minimapORI_Y(0) - 8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
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