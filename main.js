const body = document.getElementById('body');

const size = new vec(50, 50);
const col = new collider(size.multiply(new vec(0.5, 0.5)), size.multiply(new vec(-0.5, -0.5)));

for (let i = 0; i < 10; i++) {
    const t = new transform(new vec((i % 10) * size.x + i, Math.floor(i / 10) * size.y * 2), 0, size);
    const g = new GameObject(t, col);
    g.assignGraphic("body");
}

for (let i = 0; i < 5; i++) {
    const t = new transform(new vec((i % 10) * size.x + i, Math.floor(i / 10) * size.y * 2 + 500), 0, size);
    const g = new GameObject(t, col);
    g.assignGraphic("body");
}

// ================================================================= 
const update = () => {
    for (let i = 0; i < GameObjects.length; i++) {
        GameObjects[i].update();
    }
}
setInterval(update, 1000 / 30);