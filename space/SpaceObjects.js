import { ORI, ORI_X, ORI_Y } from '../display/DisplayMethods.js';
import { ctx } from '../js/script.js';

export class SpaceObject {
    constructor(x, y, radius, innerColour, edgeColour, solid=true) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.innerColour = innerColour;
        this.edgeColour = edgeColour;
        this.solid = solid;
    }

}

export class Satellite extends SpaceObject {
    constructor(x, y, radius, innerColour, edgeColour, solid=true) {
        super(x, y, radius, innerColour, edgeColour, solid);
    }

    display() {
        // console.log("x: " + ORI_X(this.x), "y: " + ORI_Y(this.y));
        ctx.fillStyle = this.innerColour;
        ctx.strokeStyle = this.edgeColour;
        ctx.lineWidth = 5;
        ctx.beginPath(); 
        ctx.arc(ORI_X(this.x), ORI_Y(this.y), this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }
}