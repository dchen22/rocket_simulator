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