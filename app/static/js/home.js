const canvas = document.querySelector(".connecting-dots");
const ctx = canvas.getContext("2d");

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

let particals = [];
const numParticals = 100;
let cursorX = width / 2;
let cursorY = height / 2;
const radius = 500;  

class Particals {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 1;
        this.vy = (Math.random() - 0.5) * 1;
        this.radius = 2;
        this.alpha = 0.1;  
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    draw() {
        let dx = this.x - cursorX;
        let dy = this.y - cursorY;
        let dist = Math.sqrt(dx * dx + dy * dy);

        let brightness = Math.max(0, Math.min(1, 1 - dist / radius)); 
        this.alpha = brightness * 0.8 + 0.1; 

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.fill();
    }
}

function connectingParticals() {
    for (let i = 0; i < particals.length; i++) {
        let dx = particals[i].x - cursorX;
        let dy = particals[i].y - cursorY;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < radius) {
            for (let j = i + 1; j < particals.length; j++) {
                let dx2 = particals[i].x - particals[j].x;
                let dy2 = particals[i].y - particals[j].y;
                let dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

                if (dist2 < 120) {
                    let brightness = Math.max(0, Math.min(1, 1 - dist / radius));
                    ctx.beginPath();
                    ctx.moveTo(particals[i].x, particals[i].y);
                    ctx.lineTo(particals[j].x, particals[j].y);
                    ctx.strokeStyle = `rgba(0, 255, 255, ${brightness * 0.5})`; 
                    ctx.lineWidth = 0.8; 
                    ctx.stroke();
                }
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    particals.forEach(p => {
        p.update();
        p.draw();
    });

    connectingParticals();
    requestAnimationFrame(animate);
}

window.addEventListener("mousemove", (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
});

window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

for (let i = 0; i < numParticals; i++) {
    particals.push(new Particals());
}

animate();
