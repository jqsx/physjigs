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
        if (position.isNaN()) // uncancer the position
            return;
        this.last = this.position; // store the last safe position
        this.position = position;
    }

    updateVelocity(col = collider, goid = String) {
        if (this.hasGravity) { // for static objects
            this.velocity.y += 1; // gravity
            this.velocity.x *= 0.9; // friction ~

            if (this.position.y > window.innerHeight - this.scale.y / 2 - 10) { // temp ground, stop all objects that have gravity from going below window.innerHeight
                this.position.y = window.innerHeight - this.scale.y / 2 - 10;
                this.velocity.y = -(this.velocity.y - Math.sign(this.velocity.y)) * 0.3; // bounce calc
            }

            for (let i = 0; i < GameObjects.length; i++) {
                if (GameObjects[i].goid != goid) { // sphaghetti math here
                    if (col.isColliding(GameObjects[i].Collider, this.position, GameObjects[i].Transform.position)) { // checking for collisions
                        this.velocity = new vec(0, 0) // reset velocity
                        this.position = this.last; // move object back to a safe position
                        if (this.position.distance(GameObjects[i].Transform.position) <= this.scale.mag() / 3 * 2) { // if safe position is shit then we toss the object away from the other
                            let force = this.scale / 3 * 2 - this.position.distance(GameObjects[i].Transform.position) // calculate force for toss
                            let diff = GameObjects[i].Transform.position.subrtact(this.position); // calculate vector
                            let ff = diff.multiply(new vec(force, force)); // we add the force to the vector
                            if (ff.isNaN()) // checking for nan cos it appears here sometimes idk why, maybe cos i multiply by zero sometimes
                                console.log("nan " + goid)
                            this.velocity = ff; // we set velocity to nan either way dont care
                            this.setPosition(this.position.add(this.velocity)); // update velocity after adjusting position and velocity
                            continue;
                        }
                    }
                }
            }

            this.setPosition(this.position.add(this.velocity)); // update velocity
        }
    }

    addPosition(other = vec) {
        this.setPosition(this.position.add(other));
    }

    addVelocity(other = vec) { // self explanatory
        this.velocity = this.velocity.add(other);
    }

    toCSS() { // cancer
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

    normalize() { // funky math
        return new vec(this.x / this.mag(), this.y / this.mag());
    }

    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    distance(other) {
        let x = other.x - this.x;
        let y = other.y - this.y;
        return Math.sqrt(x * x + y * y);
    }

    isNaN() {
        return Number.isNaN(this.x) || Number.isNaN(this.y); // why does this have to be a thing what the fuuuuuuuuuuckkk??...
        // this proves that god is dead
        // js is shit
        // i want life end
    }
}

class collider { // cancer collider caluclations 
    constructor(point1 = vec, point2 = vec) {
        this.vertices = [point1, point2];
        let v = new vec(point1.x, point1.y * -1);
        let v1 = new vec(point2.x, point2.y * -1);
        this.corners = [point1, point2, v, v1];
    }
    isColliding(other = collider, me = vec, positionother = vec) { // cancer
        for (let i = 0; i < other.corners.length; i++) {
            if (this.isWithin(other.corners[i], positionother))
                return true;
        }
        if (this.isWithin(positionother, me)) // checking for center intersection
            return true;
        return false;
    }

    isWithin(point = vec, me = vec) { // cancer
        return this.vertices[0].x + me.x >= point.x && this.vertices[1].x + me.x <= point.x && this.vertices[0].y + me.y >= point.y && this.vertices[1].y + me.y <= point.y
    }
}

class fuckingstupidCollider extends collider { // i used this for testing maybe gona use it in the future
    constructor() {
        let vertices = [new vec(10, 10), new vec(-10, -10)];
        super(vertices[0], vertices[1]);
    }
}

class GameObject { // i just put everything into one class to be able to access and sync the render with the stored values
    constructor(Transform = transform, Collider = collider) {
        this.Transform = Transform; // assigning
        this.Collider = Collider;
        this.goid = create_UUID(); // epic uuid system for tracking cubes
        GameObjects.push(this); // gameobject list
    }

    Destroy() { // idk if it works didnt test maybe gona fix later dont rly see a point rn plus it'd be diff to do
        delete GameObjects.find(this)
    }

    setColor(color = String) { // customizationnnn
        document.getElementById(this.goid).style.background = color;
    }

    assignGraphic(body = String) { // add render object in body
        const str = '<div id="' + this.goid + '" class="square" style="transform: ' + this.Transform.toCSS() + '"></div>';
        document.getElementById(body).innerHTML += str;
    }

    update() { // update physics and render
        this.Transform.updateVelocity(this.Collider, this.goid);
        document.getElementById(this.goid).style.transform = this.Transform.toCSS();
    }
}

function create_UUID() { // some funky code i stole from the internet
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

var GameObjects = []; // very important
GameObjects.update = () => { // kinda important
    for (let i = 0; i < GameObjects.length; i++) {
        GameObjects[i].update();
    }
}
setInterval(GameObjects.update, 1000 / 30);