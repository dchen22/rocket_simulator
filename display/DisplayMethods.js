import { ctx } from '../js/script.js';

export function ORI(x, y) {
    return {x: ORI_X(x), y: ORI_Y(y)};
}

export function ORI_X(x) {
    return x + window.innerWidth / 2;
}

export function ORI_Y(y) {
    return y + window.innerHeight / 2;
}

export function drawCircle(x, y, radius, innerColour, edgeColour) {
    // Draw the circle with inner color and edge color
    ctx.fillStyle = innerColour;
    ctx.strokeStyle = edgeColour;
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
}