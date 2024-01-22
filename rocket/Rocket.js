import { ORI, ORI_X, ORI_Y } from '../display/DisplayMethods.js';
import { ctx } from '../js/script.js';

export class Rocket {
    constructor(x, y) {
        this.velocity = {x: 0, y: 0};
        this.accelerationCoefficient = {x: 0.99, y: 0.99};
        this.turnOrientation = 0;
        this.turnOrientationVelocity = 0;
        this.turnOrientationAccelerationCoefficient = 0.9;
    }

    display() {
        // const rocketImage = document.getElementById('rocket_image');
        // rocketImage.src = '../rocket/rocket.png';
        // ctx.drawImage(rocketImage, ORI_X(0) - rocketImage.clientWidth/2, ORI_Y(0) - rocketImage.clientHeight/2);

        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 5;
        ctx.beginPath(); 
        ctx.arc(ORI_X(0), ORI_Y(0), 40, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }

    accelerateUp(spaceObjects) {
        this.velocity.y -= 0.2;
    }

    turnLeft(spaceObjects) {
        this.turnOrientation += 0.001;
    }

    turnRight(spaceObjects) {
        this.turnOrientation -= 0.001;
    }

    accelerateDown(spaceObjects) {
        this.velocity.y += 0.2;
    }

    move(spaceObjects) {
        this.shiftOtherObjects(spaceObjects);
        this.rotateOtherObjects(spaceObjects);
    }

    shiftOtherObjects(spaceObjects) {
        for (let i = 0; i < spaceObjects.length; i++) {
            spaceObjects[i].x -= this.velocity.x; // movement should be in opposite direction of what rocket should have moved
            spaceObjects[i].y -= this.velocity.y; // movement should be in opposite direction of what rocket should have moved

            this.velocity.x *= this.accelerationCoefficient.x;
            this.velocity.y *= this.accelerationCoefficient.y;
        }
    }

    rotateOtherObjects(spaceObjects) {
        this.turnOrientation *= this.turnOrientationAccelerationCoefficient;
        console.log("turn orientation: " + this.turnOrientation)
        for (let i = 0; i < spaceObjects.length; i++) {
            // rotate positions around origin
            let x = spaceObjects[i].x;
            let y = spaceObjects[i].y;

            spaceObjects[i].x = x * Math.cos(this.turnOrientation) - y * Math.sin(this.turnOrientation);
            spaceObjects[i].y = x * Math.sin(this.turnOrientation) + y * Math.cos(this.turnOrientation);

            // rotate velocities around origin
            let vx = this.velocity.x;
            let vy = this.velocity.y;

            this.velocity.x = vx * Math.cos(this.turnOrientation) - vy * Math.sin(this.turnOrientation);
            this.velocity.y = vx * Math.sin(this.turnOrientation) + vy * Math.cos(this.turnOrientation);
        }
    }
}