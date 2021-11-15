const nodeSize = 35

var grid = [], current

const input = document.getElementById("spf")
const say = document.getElementById("say")
const clean = document.getElementById("clear")

function setup() {
  clearAll()
  newCanvas(350, 350)
  setBackGroundColor(0, 0, 0, 255)
  
  timeSpeed = 0.01
  
  grid = new Array(width / nodeSize)
  
  for(let r = 0; r < 2; r++) {
    for(let y = 0; y < grid.length; y++) {
      if(r == 0) { grid[y] = new Array(height / nodeSize); }
      
      for(let x = 0; x < grid[y].length; x++) {
        if(r == 0) { grid[y][x] = new Node(x * nodeSize+1, y * nodeSize+1, nodeSize-1, "rgba(0, 0, 0, 255)", {x: x, y: y}) }
        
        else {
          grid[y][x].saveNeighbors()
        }
      }
    }
    
    if(r == 0) { point = grid[grid.length-1][grid[grid.length-1].length-1]; }
  }
  
  current = grid[0][0]
  
  say.addEventListener("touchstart", (e)=>{
    if(current.visited) { console.log(point) }
  })
  
  addEventListener("touchstart", (e)=>{
    if(!current.visited) { return; }
    
    const t = {x: e.touches[0].clientX, y: e.touches[0].clientY}
      
    for(let y = 0; y < grid.length; y++) {
      for(let x = 0; x < grid[y].length; x++) {
        if(t.x >= grid[y][x].x && t.x <= grid[y][x].x + grid[y][x].size && t.y >= grid[y][x].y && t.y <= grid[y][x].y + grid[y][x].size) {
            
          point = grid[y][x]
        }
      }
    }
  })
    
  input.addEventListener("touchstart", (e)=>{
    if(current.visited) { start() }
  })
  
  clean.addEventListener("touchstart", (e)=>{
    nodes = []
    closedSet = []
    openSet = []
    canStop = true
  })
}

function render(delta) {
  Rect(0, 0, width, height)
  clear()
  
  for(let y = 0; y < grid.length; y++) {
    for(let x = 0; x < grid[y].length; x++) {
      if(nodes.includes(grid[y][x])) {
        grid[y][x].color = "rgba(0, 0, 255, 255)"
      }
      else if(grid[y][x] == point) {
        grid[y][x].color = "rgb(100, 0, 255)"
      }
      else {
        grid[y][x].color = "rgba(0, 0, 0, 0)"
      }
      
      grid[y][x].updateWalls()
      grid[y][x].draw()
    }
  }
  
  const next = current.getNext()
  current.visited = true
  
  if(next) {
    current.removeWalls(next)
    current = next
  }
  
  if(current.visited && !canStop) {
    update(delta);
  }
}

function Node(x, y, size, nodeColor, id) {
  this.x = x;
  this.y = y;
  this.size = size;
  this.color = nodeColor;
  this.id = id;
  
  this.distance = 0;
  
  this.neighbors = []
  
  this.walls = [true, true, true, true]
  
  this.visited = false
  this.checked = false
  
  this.previous = undefined
  
  this.draw = _=>{
    Rect(this.x, this.y, this.size, this.size)
    
    color = "rgb(255, 0, 0)"
    
    //top
    if(this.walls[0]) {
      line(this.x, this.y, this.size + this.x, this.y)
    }
    
    //right
    if(this.walls[1]) {
      line(this.x + this.size, this.y, this.x + this.size, this.y + this.size)
    }
    
    //bottom
    if(this.walls[2]) {
      line(this.x, this.y + this.size, this.x + this.size, this.y + this.size)
    }
    
    //left
    if(this.walls[3]) {
      line(this.x, this.y, this.x, this.y + this.size)
    }
    
    this.distance = Math.abs(point.id.x - this.id.x) + Math.abs(point.id.y - this.id.y)
    
    color = this.color
    
    fill()
  }
  
  this.saveNeighbors = _=>{
    if(this.id.y > 0) { this.neighbors.push(grid[this.id.y-1][this.id.x]); }
    
    if(this.id.x > 0) { this.neighbors.push(grid[this.id.y][this.id.x-1]); }
    
    if(this.id.y < grid.length-1) { this.neighbors.push(grid[this.id.y+1][this.id.x]); }
    
    if(this.id.x < grid[0].length-1) { this.neighbors.push(grid[this.id.y][this.id.x+1]); }
  }
  
  this.removeWalls = (node)=>{
    const id = {x: node.id.x - this.id.x, y: node.id.y - this.id.y}
    
    if(id.y == -1) {
      this.walls[0] = false
      node.walls[2] = false
    }
    else if(id.y == 1) {
      this.walls[2] = false
      node.walls[0] = false
    }
    else if(id.x == -1) {
      this.walls[3] = false
      node.walls[1] = false
    }
    else if(id.x == 1) {
      this.walls[1] = false
      node.walls[3] = false
    }
  }
  
  this.getNext = _=>{
    const nbs = []
    
    for(let x = 0; x < this.neighbors.length; x++) {
      
      if(!this.neighbors[x].visited) {
        nbs.push(this.neighbors[x])
      }
    }
    
    if(nbs.length > 0) { return nbs[Math.floor(Math.random() * nbs.length)]; }
    
    for(let y = 0; y < grid.length; y++) {
      for(let x = 0; x < grid[y].length; x++) {
        if(!grid[y][x].visited) {
          return grid[y][x]
        }
      }
    }
    
    return undefined
  }
  
  this.updateWalls = _=>{
    for(let x = 0; x < this.neighbors.length; x++) {
      
      const nb = this.neighbors[x]
      const id = {x: nb.id.x - this.id.x, y: nb.id.y - this.id.y}
      
      if(id.x == 1) {
        nb.walls[3] = this.walls[1]
      }
      else if(id.y == 1) {
        nb.walls[0] = this.walls[2]
      }
      else if(id.x == -1) {
        nb.walls[1] = this.walls[3]
      }
      else if(id.y == -1) {
        nb.walls[2] = this.walls[0]
      }
    }
  }
}