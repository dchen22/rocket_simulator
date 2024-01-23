import { ORI, ORI_X, ORI_Y } from '../display/DisplayMethods.js';
import { ctx, canvas } from '../js/script.js';
import { magnitude, checkCollide } from '../maths/MathFunctions.js';
import { drawCircle } from '../display/DisplayMethods.js';

export class Rocket {
    constructor(x, y) {
        this.velocity = {x: 0, y: 0};
        this.accelerationCoefficient = {x: 0.99, y: 0.99};
        this.turnOrientation = 0;
        this.turnOrientationVelocity = 0.0002;
        this.turnOrientationAccelerationCoefficient = 0.99;

        // we check if any of the hitboxpoints land inside of another object to determine whether they collide
        // this.hitboxPoints = [[ORI_X(0) - 10, ORI_Y(0) + 20], [ORI_X(0) + 10, ORI_Y(0) + 20], [ORI_X(0) + 10, ORI_Y(0) - 20], [ORI_X(0) - 10, ORI_Y(0) - 20], [ORI_X(0), ORI_Y(0) - 40]]
        this.hitboxPoints = [[ORI_X(0), ORI_Y(0)]]

        this.backgroundImagePath = "../images/starry_background.png"
        this.backgroundImage = new Image();
        this.backgroundImage.src = this.backgroundImagePath;
    }

    display() {
        // const rocketImage = document.getElementById('rocket_image');
        // rocketImage.src = '../rocket/rocket.png';
        // ctx.drawImage(rocketImage, ORI_X(0) - rocketImage.clientWidth/2, ORI_Y(0) - rocketImage.clientHeight/2);

        // Set the center of the canvas as (0, 0)
        const centerX = ORI_X(0);
        const centerY = ORI_Y(0);

        // this.displayBackground();

        this.drawThrusterTrail();

        // Draw the rocket body
        ctx.fillStyle = 'gray';
        ctx.beginPath();
        ctx.moveTo(centerX - 10, centerY + 20);
        ctx.lineTo(centerX + 10, centerY + 20);
        ctx.lineTo(centerX + 10, centerY - 20);
        ctx.lineTo(centerX - 10, centerY - 20);
        ctx.closePath();
        ctx.fill();

        // Draw the rocket tip
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.moveTo(centerX - 10, centerY - 20);
        ctx.lineTo(centerX + 10, centerY - 20);
        ctx.lineTo(centerX, centerY - 40);
        ctx.closePath();
        ctx.fill();

    }

    
    drawThrusterTrail() {

        // Set the center of the canvas as (0, 0)
        const centerX = ORI_X(0);
        const centerY = ORI_Y(0);

        // Set the triangle colors
        const orangeColor = 'orange';
        const yellowColor = 'yellow';

        const speedMagnitude = magnitude(this.velocity) / 1.25; // Adjust based on velocity

        for (let i = 0; i < 10; i++) {
            drawCircle(centerX, centerY + 20*(i+1)*speedMagnitude/6, Math.max(0, speedMagnitude * 2 - 2*i), orangeColor, orangeColor);
            drawCircle(centerX, centerY + 20*(i+1)*speedMagnitude/6, Math.max(0, speedMagnitude - 2*i), yellowColor, yellowColor);
        }


    }

    displayBackground() {
        for (let i = 0; i < canvas.width; i += this.backgroundImage.clientWidth) {
            for (let j = 0; j < canvas.height; j += this.backgroundImage.clientHeight) {
                // ctx.drawImage(this.backgroundImage, i, j, this.backgroundImage.clientWidth, this.backgroundImage.clientHeight);
            }
        }
    }

    _drawHitboxPoints() {
        // if u need to see the hitbox points
        for (let i = 0; i < this.hitboxPoints.length; i++) {
            drawCircle(this.hitboxPoints[i][0], this.hitboxPoints[i][1], 5, 'red', 'red');
            console.log("hitbox points: " + this.hitboxPoints[i][0] + ", " + this.hitboxPoints[i][1])
        }
    }

    accelerateUp(spaceObjects) {
        this.velocity.y -= 0.2;
        console.log("velocity: " + this.velocity.y);
    }

    turnLeft(spaceObjects) {
        this.turnOrientation += this.turnOrientationVelocity;
    }

    turnRight(spaceObjects) {
        this.turnOrientation -= this.turnOrientationVelocity;
    }

    accelerateDown(spaceObjects) {
        this.velocity.y += 0.2;
    }

    move(spaceObjects) {
        this.shiftOtherObjects(spaceObjects);
        this.rotateOtherObjects(spaceObjects);
        for (let i = 0; i < spaceObjects.length; i++) {
            checkCollide(this, spaceObjects[i]);
        }
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