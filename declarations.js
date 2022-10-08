class transform {
    constructor(position = vec, rotation = Number, scale = vec) {
        this.position = position;
        this.rotation = rotation;
        this.velocity = new vec(0, 0);
        this.last = position;
        this.scale = scale;
        this.hasGravity = true;
    }

    setPosition(position = vec) {
        this.last = this.position;
        this.position = position;
    }

    updateVelocity(col = collider, goid = String) {
        if (this.hasGravity) {
            this.velocity.y += 1;

            if (this.position.y > window.innerHeight - this.scale.y / 2 - 10) { // temp ground
                this.position.y = window.innerHeight - this.scale.y / 2 - 10;
                this.velocity.y = -(this.velocity.y - Math.sign(this.velocity.y)) * 0.3;
            }

            for (let i = 0; i < GameObjects.length; i++) {
                if (GameObjects[i].goid != goid) {
                    if (col.isColliding(GameObjects[i].Collider, this.position, GameObjects[i].Transform.position)) {
                        let diff = GameObjects[i].Transform.position.subrtact(this.position);
                        this.velocity = new vec(0, 0) //this.velocity.add(diff.multiply(new vec(-0.05, -0.05)));
                        this.position = this.last;
                        GameObjects[i].setColor("red");
                    } else {
                        GameObjects[i].setColor("white");
                    }
                }
            }

            this.setPosition(this.position.add(this.velocity));
        }
    }

    addPosition(other = vec) {
        this.setPosition(this.position.add(other));
    }

    addVelocity(other = vec) {
        this.velocity = this.velocity.add(other);
    }

    toCSS() {
        return 'translate(' + this.position.x + 'px,' + this.position.y + 'px) rotate(' + this.rotation + 'deg) scale(' + this.scale.x + ', ' + this.scale.y + ')';
    }
}

class vec {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(vector = vec) {
        return new vec(this.x + vector.x, this.y + vector.y)
    }

    subrtact(vector = vec) {
        return new vec(this.x - vector.x, this.y - vector.y)
    }

    multiply(vector = vec) {
        return new vec(this.x * vector.x, this.y * vector.y)
    }
    divide(vector = vec) {
        return new vec(this.x / vector.x, this.y / vector.y)
    }

    normalize() {
        return new vec(this.x / this.mag(), this.y / this.mag());
    }

    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
}

class collider {
    constructor(point1 = vec, point2 = vec) {
        this.vertices = [point1, point2];
        let v = new vec(point1.x, point1.y * -1);
        let v1 = new vec(point2.x, point2.y * -1);
        this.corners = [point1, point2, v, v1];
    }
    isColliding(other = collider, me = vec, positionother = vec) {
        for (let i = 0; i < other.corners.length; i++) {
            if (this.isWithin(other.corners[i], positionother))
                return true;
        }
        if (this.isWithin(positionother, me)) // checking for center intersection
            return true;
        return false;
    }

    isWithin(point = vec, me = vec) {
        return this.vertices[0].x + me.x >= point.x && this.vertices[1].x + me.x <= point.x && this.vertices[0].y + me.y >= point.y && this.vertices[1].y + me.y <= point.y
    }
}

class fuckingstupidCollider extends collider {
    constructor() {
        let vertices = [new vec(10, 10), new vec(-10, -10)];
        super(vertices[0], vertices[1]);
    }
}

class GameObject {
    constructor(Transform = transform, Collider = collider) {
        this.Transform = Transform;
        this.Collider = Collider;
        this.goid = create_UUID();
        GameObjects.push(this);
    }

    Destroy() {
        delete GameObjects.find(this)
    }

    setColor(color = String) {
        document.getElementById(this.goid).style.background = color;
    }

    assignGraphic(body = String) {
        const str = '<div id="' + this.goid + '" class="square" style="transform: ' + this.Transform.toCSS() + '"></div>';
        document.getElementById(body).innerHTML += str;
    }

    update() {
        document.getElementById(this.goid).style.transform = this.Transform.toCSS();
        this.Transform.updateVelocity(this.Collider, this.goid);
    }
}

function create_UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

var GameObjects = [];