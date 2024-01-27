import {ORI_X, ORI_Y} from "../display/DisplayMethods.js";
import { spaceObjects } from "../js/script.js";

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
    // technically it's object.x - rocket.x and object.y - rocket.y but we're assuming the rocket is at the origin
    let normal_normalized = normalizeVector({ x: object.x, y: object.y});

    // Calculate the dot product of the rocket's velocity and the normal vector
    let dp = dotProduct(rocket.velocity, normal_normalized);

    // Calculate the reflection vector
    rocket.velocity = addVectors(rocket.velocity, scaleVector(normal_normalized, -2 * dp));

    // TODO: once we "land" we should be able to start rotating again, with high dampening (i.e. you can rotate but the slowdown once you let go is high)
    rocket.turnVelocity *= 0.2; // dampen rotation once we hit something
    rocket.velocity.x *= 0.8; // dampen velocity once we hit something
    rocket.velocity.y *= 0.8; // dampen velocity once we hit something
}

function reverseVelocity(rocket) {
    rocket.velocity = scaleVector(rocket.velocity, -1);
}

// check if rocket is colliding with any objects
export function checkCollide(rocket, object) {
    for (let i = 0; i < rocket.hitboxPoints.length; i++) {
        console.log(object.isSolid);
        if (object.isSolid && Math.sqrt(Math.pow(rocket.hitboxPoints[i][0] - object.x, 2) + Math.pow(rocket.hitboxPoints[i][1] - object.y, 2)) < object.radius) {
            
            // if the rocket is inside the SOLID object then teleport it to the closest edge
            // remember, we have to move all other objects, not the rocket itself
            let vectorFromCenterTo_Rocket = {x : object.x, y: object.y};
            let vectorFromCenterTo_Edge = {x : object.x, y: object.y};
            vectorFromCenterTo_Edge.x *= object.radius / magnitude(vectorFromCenterTo_Rocket);  
            vectorFromCenterTo_Edge.y *= object.radius / magnitude(vectorFromCenterTo_Rocket); 
            let distanceFromRocketTo_Edge = {
                x: vectorFromCenterTo_Edge.x - vectorFromCenterTo_Rocket.x, 
                y: vectorFromCenterTo_Edge.y - vectorFromCenterTo_Rocket.y
            };
            for (let j = 0; j < spaceObjects.length; j++) {
                spaceObjects[j].x += distanceFromRocketTo_Edge.x;
                spaceObjects[j].y += distanceFromRocketTo_Edge.y;
            }

            _applyCollision(rocket, object);
            return;
        }
    }
}