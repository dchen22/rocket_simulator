import { ORI, ORI_X, ORI_Y } from '../display/DisplayMethods.js';
import { ctx } from '../js/script.js';

export class Rocket {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.velocity = {x: 0, y: 0};
        this.accelerationCoefficient = {x: 0.99, y: 0.99};
    }

    display() {
        console.log("x: " + ORI_X(this.x), "y: " + ORI_Y(this.y));
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 5;
        ctx.beginPath(); 
        ctx.arc(ORI_X(this.x), ORI_Y(this.y), 40, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }

    accelerateUp(spaceObjects) {
        this.velocity.y -= 1;
    }

    accelerateLeft(spaceObjects) {
        this.velocity.x -= 1;
    }

    accelerateRight(spaceObjects) {
        this.velocity.x += 1;
    }

    accelerateDown(spaceObjects) {
        this.velocity.y += 1;
    }

    move(spaceObjects) {
        this.shiftOtherObjects(spaceObjects);
    }

    shiftOtherObjects(spaceObjects) {
        for (let i = 0; i < spaceObjects.length; i++) {
            spaceObjects[i].x -= this.velocity.x; // movement should be in opposite direction of what rocket should have moved
            spaceObjects[i].y -= this.velocity.y; // movement should be in opposite direction of what rocket should have moved

            this.velocity.x *= this.accelerationCoefficient.x;
            this.velocity.y *= this.accelerationCoefficient.y;
        }
    }
}