const body = document.getElementById('body');

const t = new transform(new vec(0, 0), 0, new vec(100, 100));
const c = new collider();
const g = new GameObject(t, c);

asignGraphic(g);

function asignGraphic(target = GameObject) {
    const str = '<div id="' + target.goid + '" class="square" style="transform: ' + target.Transform.toCSS() + '"></div>';
    body.innerHTML += str;
}