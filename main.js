const body = document.getElementById('body');

const size = new vec(100, 100);
const col = new collider(size.multiply(new vec(1, 1)), size.multiply(new vec(-1, -1))); // terrible creation process, if js had multiple constuctors functionality then maybe id be able to do easier gameobject creation and for now i dont care

const sp = () => { // sample cube spawning function
    if (GameObjects.length < 5) {
        const t = new transform(new vec(50 * (GameObjects.length + 2) + GameObjects.length, 100), 0, size);
        const g = new GameObject(t, col);
        g.assignGraphic("body");
    }
    setTimeout(sp, 1000);
}
sp();

// i somehow managed to break the entire thing by just writing comments thats sick