class transform {
    constructor(position = vec, rotation = Number, scale = vec) {
        this.position = position;
        this.rotation = rotation;
        this.velocity = new vec(0, 0);
        this.last = position;
        this.scale = scale;
    }

    setPosition(position = vec) {
        this.last = this.position;
        this.position = position;
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
        return new vec(x + vector.x, y + vector.y)
    }

    multiply(vector = vec) {
        return new vec(x * vector.x, y * vector.y)
    }
}

class collider {
    constructor(point1 = vec, point2 = vec) {
        if (point1 != undefined && point2 != undefined) {
            this.vertices = [point1, point2];
            let v = new vec(point1.x, point1.y * -1);
            let v1 = new vec(point2.x, point2.y * -1);
            this.corners = [point1, point2, v, v1];
        } else {
            this.vertices = [new vec(10, 10), new vec(-10, -10)];
            let v = new vec(this.vertices[0].x, this.vertices[0].y * -1);
            let v1 = new vec(this.vertices[1].x, this.vertices[1].y * -1);
            this.corners = [this.vertices[0], this.vertices[1], v, v1];
        }

    }
    isColliding(other = collider, me = vec, positionother = vec) {
        for (let i = 0; i < other.corners.length; i++) {
            if (this.isWithin(other.corners[i].add(positionother)))
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