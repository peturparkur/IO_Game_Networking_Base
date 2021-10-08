const btn_play = document.getElementById("btn_play"); //button for creating new game
const canvas = document.getElementById("canvas_game"); //we get the canvas
const gameScreen = document.getElementById("GameScreen"); //html div where the game is played
const context = canvas.getContext("2d");
const hiddens = document.getElementsByClassName('hidden');
canvas.width = 300;
canvas.height = 150;
function ChangeVisibilityByCollection(collection) {
    for (let x of collection) {
        const y = x;
        y.style.display = (y.style.display == 'none') ? '' : 'none';
    }
}
function ClearCanvas(ctx = context, canv = canvas) {
    ctx.clearRect(0, 0, canv.width, canv.height);
}
function DrawRect(rect, color = "black", outline = false, ctx = context) {
    ctx.beginPath();
    let style = ctx.fillStyle;
    let stroke_style = ctx.strokeStyle;
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.rect(rect.x, rect.y, rect.width, rect.height);
    if (outline)
        ctx.stroke();
    else
        ctx.fill();
    ctx.closePath();
    ctx.strokeStyle = stroke_style;
    ctx.fillStyle = style;
}
DrawRect(new DOMRect(0, 0, 50, 50));
btn_play.onclick = (ev) => {
    ChangeVisibilityByCollection(hiddens);
};
export {};
