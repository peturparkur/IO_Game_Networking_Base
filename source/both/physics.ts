/**
 * base circle implementation
 */
abstract class Circle
{
    /**
     * x/horizontal coordinate
     */
    x : number;
    /**
     * y/vertical coordinate
     */
    y : number;
    radius : number;
    constructor(x : number = 0, y : number = 0, radius : number = 0){
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
}

// rectangle is described from the top left corner + height + weight
/**
 * Check whether a point (x, y) is within a rectangle - rectangle is defined by top-left corner & width & height
 * @param x x coordinate of point
 * @param y y coordinate of point
 * @param rect DOMRect definition
 * @returns True if (x, y) inside rect, False otherwise
 */
function InsideRect(x : number, y : number, rect : DOMRect = new DOMRect()) : boolean{
    let dx = x - rect.x;
    let dy = y - rect.y;
    if(dx > rect.width || dx < 0) return false
    if(dy > rect.height || dy < 0) return false
    return true
}

// circle is described by center + radius
/**
 * Check whether a point (x, y) is within a Circle - Circle is defined by center point & radius
 * @param x x coordinate of point
 * @param y y coordinate of point
 * @param circle Circle definition
 * @returns True if (x, y) inside Circle, False otherwise
 */
function InsideCircle(x : number, y : number, circle : Circle){
    let dx = Math.abs(x - circle.x)
    let dy = Math.abs(y - circle.y)
    if (dx * dx + dy * dy > circle.radius) return false
    return true
}


export { Circle, InsideCircle, InsideRect }