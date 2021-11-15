var canvas, ctx, width, height, rect, color, lineWidth, timeSpeed = 1, repeat = -1;

function newCanvas(w, h) {
  canvas = document.createElement("canvas")
  
  canvas.width = w
  canvas.height = h
  
  width = w
  height = h
  
  ctx = canvas.getContext("2d")
  
  document.body.appendChild(canvas)
}

function setBackGroundColor(r, g, b, a) {
  canvas.style.backgroundColor = "rgba(" + r + ", " + g + ", " + b + ", " + a + ")"
}

function Rect(x, y, w, h) {
  rect = {x: x, y: y, w: w, h: h}
}

function fill() {
  ctx.fillStyle = color
  ctx.fillRect(rect.x, rect.y, rect.w, rect.h)
}

function stroke() {
  ctx.strokeStyle = color
  ctx.strokeRect(rect.x, rect.y, rect.w, rect.h)
}

function clear() {
  ctx.clearRect(rect.x, rect.y, rect.w, rect.h)
}

function line(x, y, fx, fy) {
  ctx.strokeStyle = color
  ctx.lineWidth = lineWidth
  
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(fx, fy)
  ctx.stroke()
}

function clearAll() {
  if(canvas) {
    document.body.removeChild(canvas)
  }
  
  canvas = undefined
  ctx = undefined
  rect = undefined
  color = undefined
  width = undefined
  height = undefined
  
  timeSpeed = 1
  repeat = -1
  lineWidth = 1
}

setup()

let c = 0;

setInterval(_=>{
  if(ctx == undefined) { console.log("Error: canvas wasnt created"); return; }
  
  if(c < repeat && c >= 0) { render(1 / 60 / timeSpeed); }
  
  else if(repeat < 0) { render(1 / 60 / timeSpeed); }
  
  c++;
}, 1000 / 60000 / timeSpeed)