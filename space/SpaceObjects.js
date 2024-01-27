import { ORI, ORI_X, ORI_Y } from '../display/DisplayMethods.js';
import { ctx } from '../js/script.js';

export class SpaceObject {
    constructor(name, x, y, radius, mass, innerColour, edgeColour, isSolid) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.mass = mass;
        this.innerColour = innerColour;
        this.edgeColour = edgeColour;
        this.isSolid = isSolid;
        this.velocity = {x: 0, y: 0};

        this.edgeWidth = 5;
    }

}

export class Satellite extends SpaceObject {
    constructor(name, x, y, radius, mass, innerColour, edgeColour, isSolid) {
        super(name, x, y, radius, mass, innerColour, edgeColour, isSolid);
    }

    display() {
        // console.log("x: " + ORI_X(this.x), "y: " + ORI_Y(this.y));
        ctx.fillStyle = this.innerColour;
        ctx.strokeStyle = this.edgeColour;
        ctx.lineWidth = this.edgeWidth;
        ctx.beginPath(); 
        ctx.arc(ORI_X(this.x), ORI_Y(this.y), this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }
}