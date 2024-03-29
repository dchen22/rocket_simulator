import { ORI, ORI_X, ORI_Y } from '../display/DisplayMethods.js';
import { ctx, canvas, fps, throttleSlider, thrusterToggle } from '../js/script.js';
import { magnitude, checkCollide, bound, map_range } from '../maths/MathFunctions.js';
import { drawCircle } from '../display/DisplayMethods.js';
import { Background } from './Background.js';



export class Rocket {
    constructor(x, y, acceleration_coefficient) {
        // acceleration_coefficient is used to make sure that other aspects of the rocket scale well with
        // the rocket's power

        // PERFORMANCE
        this.jerk = 0.2 * acceleration_coefficient; // ROCKET POWER (THIS DETERMINES HOW FAST ROCKET SPEEDS UP)
        this.currentAcceleration = 0; // current thruster power
        this.MAX_ACCELERATION = acceleration_coefficient; // cap on thruster power  (THIS DETERMINES MAXIMUM ACCELERATION OF ROCKET)
        this.velocity = {x: 0, y: 0};
        this.mass = 1000; // mass of rocket
        this.spaceDragCoefficient = 1; // determines drag in space (should generally be 1)

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

    // we use this when we want to modify the rocket's power temporarily (e.g. increase throttle)
    // btw we could try the idea of slowing down time as an ability
    // we can add to the list of returned stats if needed (or make a new function)
    getSpecs() {
        // these should only return permanent/long-term stats (i.e. ones that aren't volatile, like current velocity)
        let throttle = throttleSlider.value / 100;
        return {
            jerk: this.jerk * throttle,
            MAX_ACCELERATION: this.MAX_ACCELERATION * throttle,
            spaceDragCoefficient: this.spaceDragCoefficient,
            maxTurnVelocity: this.maxTurnVelocity,
            turnAcceleration: this.turnAcceleration,
            turnOrientationDragCoefficient: this.turnOrientationDragCoefficient,
            // bound thruster length coeff so that thruster trail is not too long nor too short
            // if the interval contains larger values then the thruster trail will be shorter
            thrusterLengthCoefficient: this.thrusterLengthCoefficient / bound(throttle, 1, 1.9),
        }
    }

    
    

    display() {
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

    printStats() {
        let dp = 2; // decimal places
        let unitScale = 60; // this value is arbitrary I guess (for translating from px/frame to m/s)
        console.log("Rocket velocity: " + (magnitude(this.velocity) * unitScale).toFixed(dp) + " m/s");
        console.log("Rocket acceleration: " + (this.currentAcceleration * unitScale**2).toFixed(dp) + " m/s^2");
        console.log("Throttle %: " + throttleSlider.value);
    }

    
    drawThrusterTrail() {

        // Set the center of the canvas as (0, 0)
        const centerX = ORI_X(0);
        const centerY = ORI_Y(0);

        // Set the triangle colors
        const orangeColor = 'orange';
        const yellowColor = 'yellow';

        const thrusterLength = Math.abs(this.currentAcceleration) * this.getSpecs().thrusterLengthCoefficient; // Adjust based on velocity

        for (let i = 0; i < 10; i++) {
            drawCircle(centerX, centerY + 20*(i+1)*thrusterLength/6, Math.max(0, thrusterLength * 2 - 2*i), orangeColor, orangeColor);
            drawCircle(centerX, centerY + 20*(i+1)*thrusterLength/6, Math.max(0, thrusterLength - 2*i), yellowColor, yellowColor);
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

    accelerateUp(spaceObjects, toggleOn) {
        // if thrusters are toggled on
        let throttlePercent = throttleSlider.value;
        let throttleMin = throttleSlider.min;
        let throttleMax = throttleSlider.max;
        if (toggleOn) {
            this.currentAcceleration += this.jerk;
            if (this.currentAcceleration > this.getSpecs().MAX_ACCELERATION) {
                this.currentAcceleration = this.getSpecs().MAX_ACCELERATION;
            }
            this.velocity.y -= this.currentAcceleration;
            // higher the throttle, the more the rotation slows
            this.turnVelocity *= map_range(throttlePercent, throttleMin, throttleMax, 0.999, 0.9); // stabilize spin when accelerating
        } else {
            this.currentAcceleration = 0;
        }
    }

    turnLeft(spaceObjects) {
        this.turnVelocity += this.turnAcceleration;
    }

    turnRight(spaceObjects) {
        this.turnVelocity -= this.turnAcceleration;
    }


    move(spaceObjects) {
        this.accelerateUp(spaceObjects, thrusterToggle);
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

            this.velocity.x *= this.spaceDragCoefficient;
            this.velocity.y *= this.spaceDragCoefficient;
        }
    }

    rotateOtherObjects(spaceObjects) {
        // console.log("turn velocity: " + this.turnVelocity)

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