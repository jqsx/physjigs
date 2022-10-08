const body = document.getElementById('body');

const size = new vec(100, 100);
const col = new collider(size, size.multiply(new vec(-1, -1)));

const t = new transform(new vec(300, 200), 0, size);
const g = new GameObject(t, col);
const gc = new GameObject(new transform(new vec(290, 500), 0, new vec(100, 100)), col);

g.assignGraphic("body");
gc.assignGraphic("body");

// ================================================================= 
const update = () => {
    for (let i = 0; i < GameObjects.length; i++) {
        GameObjects[i].update();
    }
}
setInterval(update, 1000 / 30);