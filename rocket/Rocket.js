import { ORI, ORI_X, ORI_Y } from '../display/DisplayMethods.js';
import { ctx, canvas, fps } from '../js/script.js';
import { magnitude, checkCollide } from '../maths/MathFunctions.js';
import { drawCircle } from '../display/DisplayMethods.js';
import { Background } from './Background.js';



export class Rocket {
    constructor(x, y, acceleration_coefficient) {
        // acceleration_coefficient is used to make sure that other aspects of the rocket scale well with
        // the rocket's power

        // PERFORMANCE
        this.jerk = 0.1 * acceleration_coefficient; // ROCKET POWER (THIS DETERMINES HOW FAST ROCKET SPEEDS UP)
        this.currentAcceleration = 0; // current thruster power
        this.MAX_ACCELERATION = acceleration_coefficient; // cap on thruster power  (THIS DETERMINES MAXIMUM ACCELERATION OF ROCKET)
        this.velocity = {x: 0, y: 0};
        this.mass = 1000; // mass of rocket
        this.spaceDragCoefficient = 0.999; // determines drag in space (aerodynamics of rocket)

        this.turnVelocity = 0;
        this.maxTurnVelocity = 0.005; // nice to have so it doesn't spin out of control
        this.turnAcceleration = 0.0001;
        this.turnOrientationDragCoefficient = 0.999; // determines rotational drag in space

        // VISUALS
        this.thrusterLengthCoefficient = 8 / acceleration_coefficient; // determines length of thruster trail

        // we check if any of the hitboxpoints land inside of another object to determine whether they collide
        // this.hitboxPoints = [[ORI_X(0) - 10, ORI_Y(0) + 20], [ORI_X(0) + 10, ORI_Y(0) + 20], [ORI_X(0) + 10, ORI_Y(0) - 20], [ORI_X(0) - 10, ORI_Y(0) - 20], [ORI_X(0), ORI_Y(0) - 40]]
        this.hitboxPoints = [[0, 0]]
        this.background = new Background();
    }

    display() {
        this.displayBackground();
        // const rocketImage = document.getElementById('rocket_image');
        // rocketImage.src = '../rocket/rocket.png';
        // ctx.drawImage(rocketImage, ORI_X(0) - rocketImage.clientWidth/2, ORI_Y(0) - rocketImage.clientHeight/2);

        // Set the center of the canvas as (0, 0)
        const centerX = ORI_X(0);
        const centerY = ORI_Y(0);

        // this.displayBackground();

        this.drawThrusterTrail();

        ctx.strokeStyle = 'black';

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
        ctx.lineTo(centerX, centerY - 40);
        ctx.lineTo(centerX + 10, centerY - 20);
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

        const speedMagnitude = Math.abs(this.currentAcceleration) * this.thrusterLengthCoefficient; // Adjust based on velocity

        for (let i = 0; i < 10; i++) {
            drawCircle(centerX, centerY + 20*(i+1)*speedMagnitude/6, Math.max(0, speedMagnitude * 2 - 2*i), orangeColor, orangeColor);
            drawCircle(centerX, centerY + 20*(i+1)*speedMagnitude/6, Math.max(0, speedMagnitude - 2*i), yellowColor, yellowColor);
        }


    }

    displayBackground() {
        // Update the stars based on rocket velocity
        this.background.updateStars({ x: this.velocity.x, y: this.velocity.y });

        // Draw the stars
        this.background.drawStars(ctx);
    }

    _drawHitboxPoints() {
        // if u need to see the hitbox points
        for (let i = 0; i < this.hitboxPoints.length; i++) {
            drawCircle(this.hitboxPoints[i][0], this.hitboxPoints[i][1], 5, 'red', 'red');
            console.log("hitbox points: " + this.hitboxPoints[i][0] + ", " + this.hitboxPoints[i][1])
        }
    }

    accelerateUp(spaceObjects) {
        this.currentAcceleration += this.jerk;
        if (this.currentAcceleration > this.MAX_ACCELERATION) {
            this.currentAcceleration = this.MAX_ACCELERATION;
        }
        this.velocity.y -= this.currentAcceleration;
        this.turnVelocity *= 0.95; // stabilize spin when accelerating
    }

    turnLeft(spaceObjects) {
        this.turnVelocity += this.turnAcceleration;
    }

    turnRight(spaceObjects) {
        this.turnVelocity -= this.turnAcceleration;
    }

    // remove this and its button later
    accelerateDown(spaceObjects) {
        // this.velocity.y += this.ACCELERATION;
        console.log("can't go backwards in a rocket :(");
    }

    move(spaceObjects) {
        console.log("VELOCITY: " + magnitude(this.velocity) * fps + "m/s");
        this.shiftOtherObjects(spaceObjects);
        this.rotateOtherObjects(spaceObjects);
        for (let i = 0; i < spaceObjects.length; i++) {
            checkCollide(this, spaceObjects[i]);
        }
        this.currentAcceleration *= 0.99;
    }

    shiftOtherObjects(spaceObjects) {
        for (let i = 0; i < spaceObjects.length; i++) {
            spaceObjects[i].x -= this.velocity.x; // movement should be in opposite direction of what rocket should have moved
            spaceObjects[i].y -= this.velocity.y; // movement should be in opposite direction of what rocket should have moved

            this.velocity.x *= this.spaceDragCoefficient;
            this.velocity.y *= this.spaceDragCoefficient;
        }
    }

    rotateOtherObjects(spaceObjects) {
        console.log("turn velocity: " + this.turnVelocity)

        this.turnVelocity *= this.turnOrientationDragCoefficient;
        if (this.turnVelocity > this.maxTurnVelocity) {
            this.turnVelocity = this.maxTurnVelocity;
        } else if (this.turnVelocity < -this.maxTurnVelocity) {
            this.turnVelocity = -this.maxTurnVelocity;
        }
        for (let i = 0; i < spaceObjects.length; i++) {
            // rotate positions around origin
            let x = spaceObjects[i].x;
            let y = spaceObjects[i].y;

            spaceObjects[i].x = x * Math.cos(this.turnVelocity) - y * Math.sin(this.turnVelocity);
            spaceObjects[i].y = x * Math.sin(this.turnVelocity) + y * Math.cos(this.turnVelocity);

            // rotate velocities around origin
            let vx = this.velocity.x;
            let vy = this.velocity.y;

            this.velocity.x = vx * Math.cos(this.turnVelocity) - vy * Math.sin(this.turnVelocity);
            this.velocity.y = vx * Math.sin(this.turnVelocity) + vy * Math.cos(this.turnVelocity);
        }

        for (let i = 0; i < this.background.stars.length; i++) {
            // rotate positions around origin
            let x = this.background.stars[i].x;
            let y = this.background.stars[i].y;

            this.background.stars[i].x = x * Math.cos(this.turnVelocity) - y * Math.sin(this.turnVelocity);
            this.background.stars[i].y = x * Math.sin(this.turnVelocity) + y * Math.cos(this.turnVelocity);
        }
    }
}