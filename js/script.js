import { Rocket } from '../rocket/Rocket.js';
import { accelerateUp, turnLeft, turnRight, accelerateDown } from '../js/movementButtons.js';
import { SpaceObject, Satellite } from '../space/SpaceObjects.js';
import { ORI_X, ORI_Y, minimapORI_X, minimapORI_Y, drawCircle } from '../display/DisplayMethods.js';
import { gravitate_objectToObject, gravitate_rocketToObject as gravitate_rocketToObjects } from '../maths/gravity.js';

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









var DEFAULT_ACCELERATION = 0.04; // default acceleration of rocket

var main_rocket = new Rocket(0, 0, DEFAULT_ACCELERATION);

// calculating fps
const times = [];
export var fps;

export var spaceObjects = [
    new Satellite("SMALL MOON", -300, -300, 100, 100000, "white", "grey", true),
    new Satellite("SMALL STAR", 3750, 3750, 5000, 125000000, "yellow", "orange", false),
    new Satellite("VORPON", 0, 120000, 100000, 100000**2, "purple", "darkmagenta", true)
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
    ctx.moveTo(minimapEdgeWidth / 2, minimapEdgeWidth / 2); // off from top left by edge width
    ctx.lineTo(minimapWidth - minimapEdgeWidth / 2, minimapEdgeWidth / 2);
    ctx.lineTo(minimapWidth - minimapEdgeWidth / 2, minimapHeight - minimapEdgeWidth / 2);
    ctx.lineTo(minimapEdgeWidth / 2, minimapHeight - minimapEdgeWidth / 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    for (let i = 0; i < spaceObjects.length; i++) {
        drawMinimapObject(spaceObjects[i]);
    }

    drawMinimapRocket(rocket);
}

function drawMinimapObject(object) {

    ctx.save(); // Save the current state of the canvas (without clipping)

    ctx.beginPath();
    ctx.moveTo(minimapEdgeWidth, minimapEdgeWidth); // off from top left by edge width
    ctx.lineTo(minimapWidth - minimapEdgeWidth, minimapEdgeWidth);
    ctx.lineTo(minimapWidth - minimapEdgeWidth, minimapHeight - minimapEdgeWidth);
    ctx.lineTo(minimapEdgeWidth, minimapHeight - minimapEdgeWidth);
    ctx.closePath();
    ctx.clip(); // Clip the canvas to the minimap so that we don't draw map objects outside of the minimap

    ctx.fillStyle = object.innerColour;
    ctx.strokeStyle = object.edgeColour;
    let edgeWidth = object.radius / minimapScaleFactor / 10; // edge of objects on minimap should be 1/10 of the radius of the object
    ctx.lineWidth = edgeWidth;

    ctx.beginPath(); 
    // the reason we subtract edgeWidth / 2 from radius is because the outer edge of the object on the map should match
    // where the actual surface of the object is. For large planets with a thickly drawn edge, we don't want it to protrude
    // further than where the surface actually is.
    ctx.arc(minimapORI_X(object.x), minimapORI_Y(object.y), object.radius / minimapScaleFactor - edgeWidth / 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    ctx.restore(); // Restore the previous state of the canvas (without clipping)
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

    gravitate_rocketToObjects(main_rocket, spaceObjects);

    main_rocket.move(spaceObjects);

    for (let i = 0; i < spaceObjects.length; i++) {
        spaceObjects[i].display();
    }


    main_rocket.display();

    updateMinimap(); // Update the minimap content

    // calculate fps
    const now = performance.now();
    while (times.length > 0 && times[0] <= now - 1000) {
        times.shift();
    }
    times.push(now);
    fps = times.length;
    console.log("fps:", fps);

    requestAnimationFrame(animate);
}
animate();