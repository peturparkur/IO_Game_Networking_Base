class Circle {
    constructor(x = 0, y = 0, radius = 0) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
}
// rectangle is described from the top left corner + height + weight
function InsideRect(x, y, rect = new DOMRect()) {
    let dx = x - rect.x;
    let dy = y - rect.y;
    if (dx > rect.width || dx < 0)
        return false;
    if (dy > rect.height || dy < 0)
        return false;
    return true;
}
// circle is described by center + radius
function InsideCircle(x, y, circle) {
    let dx = Math.abs(x - circle.x);
    let dy = Math.abs(y - circle.y);
    if (dx * dx + dy * dy > circle.radius)
        return false;
    return true;
}
export { Circle, InsideCircle, InsideRect };
