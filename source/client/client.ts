import { ws } from './client_networking.js' //import websocket connection

const btn_play = <HTMLButtonElement> document.getElementById("btn_play"); //button for creating new game
const canvas = <HTMLCanvasElement> document.getElementById("canvas_game"); //we get the canvas
const gameScreen = document.getElementById("GameScreen")!; //html div where the game is played
const context = canvas.getContext("2d")!;

const hiddens = document.getElementsByClassName('hidden')
canvas.width = 300
canvas.height = 150

function ChangeVisibilityByCollection(collection : HTMLCollectionOf<Element>){
    for(let x of collection){
        const y = x as HTMLElement
        y.style.display = (y.style.display == 'none') ? '' : 'none'
    }
}
function ClearCanvas(ctx : CanvasRenderingContext2D = context, canv : HTMLCanvasElement = canvas)
{
    ctx.clearRect(0, 0, canv.width, canv.height);
}
function DrawRect(rect : DOMRect, color:string = "black", outline=false, ctx : CanvasRenderingContext2D = context){
    ctx.beginPath();
    let style = ctx.fillStyle;
    let stroke_style = ctx.strokeStyle;

    ctx.fillStyle = color;
    ctx.strokeStyle = color;

    ctx.rect(rect.x, rect.y, rect.width, rect.height);
    if(outline)
        ctx.stroke()
    else
        ctx.fill();

    ctx.closePath();
    ctx.strokeStyle = stroke_style;
    ctx.fillStyle = style;
}
DrawRect(new DOMRect(0, 0, 50, 50))

btn_play.onclick = (ev) =>{
    ChangeVisibilityByCollection(hiddens)
}