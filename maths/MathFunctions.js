import {ORI_X, ORI_Y} from "../display/DisplayMethods.js";

export function magnitude(vector) {
    return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
}

export function addVectors(vector1, vector2) {
    return {x: vector1.x + vector2.x, y: vector1.y + vector2.y};
}

export function scaleVector(vector, scalar) {
    return {x: vector.x * scalar, y: vector.y * scalar};
}

export function dotProduct(vector1, vector2) {
    return vector1.x * vector2.x + vector1.y * vector2.y;
}

export function normalizeVector(vector) {
    let mag = magnitude(vector);
    return {x: vector.x / mag, y: vector.y / mag};
}

// apply velocity change after rocket collides with object
export function _applyCollision(rocket, object) {
    // Calculate the normal vector from the rocket to the object
    let normal_normalized = normalizeVector({ x: ORI_X(0)- ORI_X(object.x), y: ORI_Y(0) - ORI_Y(object.y)});

    // Calculate the dot product of the rocket's velocity and the normal vector
    let dp = dotProduct(rocket.velocity, normal_normalized);

    // Calculate the reflection vector
    rocket.velocity = addVectors(rocket.velocity, scaleVector(normal_normalized, -2 * dp));
}

function reverseVelocity(rocket) {
    rocket.velocity = scaleVector(rocket.velocity, -1);
}

// check if rocket is colliding with any objects
export function checkCollide(rocket, object) {
    for (let i = 0; i < rocket.hitboxPoints.length; i++) {
        if (object.solid && Math.sqrt(Math.pow(rocket.hitboxPoints[i][0] - ORI_X(object.x), 2) + Math.pow(rocket.hitboxPoints[i][1] - ORI_Y(object.y), 2)) < object.radius) {
            console.log("colliding");
            // _applyCollision(rocket, object);
            _applyCollision(rocket, object);

            return;
        }
    }
}