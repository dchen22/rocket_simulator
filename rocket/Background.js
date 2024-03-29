import { ctx, canvas } from '../js/script.js';
import { ORI_X, ORI_Y, drawCircle } from '../display/DisplayMethods.js';

// background.js
export class Background {
    constructor() {
        this.stars = [];
        this.minStars = 5; // Minimum number of stars on the screen
        this.maxStars = 20; // Maximum number of stars on the screen
        this.starLifespan = 200; // Base lifespan of each star in frames
        this.starSpawnDelay = this.starLifespan / this.maxStars; // Delay between spawning new stars in frames
        this.framesSinceLastSpawn = 0;
        this.starSpeedMultiplier = 0.02; // Adjustable speed multiplier
        this.starGenerationSpreadParameter = 2; // Higher value means stars will be more spread out

        this.generateInitialStars();
    }

    generateInitialStars() {
        for (let i = 0; i < this.maxStars; i++) {
            this.spawnStar();
        }
    }

    spawnStar() {
        this.stars.push({
            x: this.starGenerationSpreadParameter*(Math.random() * Math.max(canvas.clientWidth, canvas.clientHeight) - canvas.clientWidth / 2),
            y: this.starGenerationSpreadParameter*(Math.random() * Math.max(canvas.clientWidth, canvas.clientHeight) - canvas.clientWidth / 2),
            lifespan: Math.floor(Math.random() * this.starLifespan) + 1, // Random lifespan
            spawnDelay: Math.floor(Math.random() * this.starSpawnDelay), // Random spawn delay
        });
    }

    updateStars(rocketVelocity) {
        for (let i = this.stars.length - 1; i >= 0; i--) {
            const star = this.stars[i];
            star.x -= rocketVelocity.x * this.starSpeedMultiplier;
            star.y -= rocketVelocity.y * this.starSpeedMultiplier;

            // Apply spawn delay
            if (star.spawnDelay > 0) {
                star.spawnDelay--;
                continue;
            }

            // Update lifespan
            if (--star.lifespan <= 0) {
                // Star has reached the end of its lifespan, remove it
                this.stars.splice(i, 1);

                if (this.stars.length < this.maxStars) {
                    // Spawn a new star to replace the expired one
                    this.spawnStar();
                }
            }

            if (this.stars.length < this.minStars) {
                // Spawn a new star to replace the expired one
                this.spawnStar();
            }
        }

        // Update frames since last spawn
        this.framesSinceLastSpawn++;

        // Spawn a new star periodically
        if (this.framesSinceLastSpawn >= this.starSpawnDelay) {
            this.spawnStar();
            this.framesSinceLastSpawn = 0;
        }
    }

    drawStars(ctx) {
        ctx.fillStyle = 'white';
        for (let i = 0; i < this.stars.length; i++) {
            const star = this.stars[i];
            const alpha = star.lifespan / this.starLifespan; // Fade out effect
            ctx.globalAlpha = alpha;
            drawCircle(ORI_X(star.x), ORI_Y(star.y), 1, 'white', 'white');
        }
        ctx.globalAlpha = 1; // Reset global alpha
    }
}
