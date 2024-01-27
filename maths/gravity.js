import { checkCollide } from "./MathFunctions.js";

export function gravitate_objectToObject(object1, object2) {
    // Calculate the distance between the two objects
    let distance = Math.sqrt(Math.pow(object1.x - object2.x, 2) + Math.pow(object1.y - object2.y, 2));

    // Calculate the force of gravity
    let force = 2000000 * (object1.mass * object2.mass) / Math.pow(distance, 2);

    // Calculate the direction of the force
    let direction = Math.atan2(object2.y - object1.y, object2.x - object1.x);

    // Calculate the acceleration
    let acceleration = force / object1.mass;

    // Calculate the acceleration vector
    let accelerationVector = {x: acceleration * Math.cos(direction), y: acceleration * Math.sin(direction)};

    console.log("gravitational pull: " + accelerationVector.x, accelerationVector.y);

    // Add the acceleration vector to the object's velocity
    object1.velocity.x += accelerationVector.x;
    object1.velocity.y += accelerationVector.y;

    object2.velocity.x -= accelerationVector.x;
    object2.velocity.y -= accelerationVector.y;
}

export function gravitate_rocketToObject(rocket, spaceObjects) {
    for (let i = 0; i < spaceObjects.length; i++) { // go through objects
        let distance = Math.sqrt(Math.pow(spaceObjects[i].x - 0, 2) + Math.pow(spaceObjects[i].y - 0, 2)); // distance from object to rocket
        
        // force of gravity (reaches maximum at 1/5 of the radius of the object)
        let force = 0.01 * (spaceObjects[i].mass * rocket.mass) / Math.pow(distance + spaceObjects[i].radius / 5, 2);
        console.log("force: " + force);
        let direction = Math.atan2(0 - spaceObjects[i].y, 0 - spaceObjects[i].x); // direction of gravity
        let acceleration = force / rocket.mass; // acceleration
        let accelerationVector = {x: -acceleration * Math.cos(direction), y: -acceleration * Math.sin(direction)}; // acceleration vector
        for (let k = 0; k < spaceObjects.length; k++) { // make adjustments to object positions relative to rocket centered at origin
            console.log("gravitational pull: " + accelerationVector.x, accelerationVector.y)
            
            // try to gravitate rocket
            rocket.velocity.x += accelerationVector.x; 
            rocket.velocity.y += accelerationVector.y;

            // if the rocket goes inside then thats bad
            if (spaceObjects[k].isSolid && Math.sqrt(Math.pow(spaceObjects[k].x - 0, 2) + Math.pow(spaceObjects[k].y - 0, 2)) < 0) {
                rocket.velocity.x -= accelerationVector.x; // undo the gravitation
                rocket.velocity.y -= accelerationVector.y; // undo the gravitation
                console.log("space object location: " + spaceObjects[k].x, spaceObjects[k].y);
            }

        }
        // rocket.move(spaceObjects);
    }
}