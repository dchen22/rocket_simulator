import { ORI, ORI_X, ORI_Y } from '../display/DisplayMethods.js';
import { ctx } from '../js/script.js';

export class SpaceObject {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    display() {
        console.log("x: " + ORI_X(this.x), "y: " + ORI_Y(this.y));
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'grey';
        ctx.lineWidth = 5;
        ctx.beginPath(); 
        ctx.arc(ORI_X(this.x), ORI_Y(this.y), this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }
}