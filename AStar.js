var nodes = [], canStop = true, mcurrent, openSet = [], closedSet = [];

function start() {
  nodes = []
  openSet = []
  closedSet = []
  mcurrent = undefined
  
  while(openSet.length == 0) {
    openSet.push(grid[0][0])
  }
  
  canStop = false
}

function update(delta) {
  if(mcurrent == point) {
    let node = mcurrent
    nodes.push(node)
    
    while(node.previous) {
      node = node.previous
      nodes.push(node)
    }
    
    canStop = true;
    
    return;
  }
  
  let winner = 0;
  
  for(let x = 0; x < openSet.length; x++) {
    if(openSet[x].distance < openSet[winner].distance) {
      
      winner = x
    }
  }
  
  mcurrent = openSet[winner]
  
  if(!mcurrent) { canStop = true; return; }
  
  for(let x = 0; x < mcurrent.neighbors.length; x++) {
    
    const canEnter = _=>{
      const id = {x: nb.id.x - mcurrent.id.x, y: nb.id.y - mcurrent.id.y}
      
      if(id.x == 1) {
        return !nb.walls[3]// == grid[nb.id.y][nb.id.x-1].walls[1]
      }
      
      if(id.x == -1) {
        return !nb.walls[1]// == grid[nb.id.y][nb.id.x+1].walls[3]
      }
      
      if(id.y == 1) {
        return !nb.walls[0]// == grid[nb.id.y-1][nb.id.x].walls[2]
      }
      
      if(id.y == -1) {
        return !nb.walls[2]// == grid[nb.id.y+1][nb.id.x].walls[0]
      }
    }
    
    const nb = mcurrent.neighbors[x]
    
    if(closedSet.includes(nb) || !canEnter()) { continue; }
    
    openSet.push(nb)
    nb.previous = mcurrent
  }
  
  mcurrent.checked = true;
  
  removeItem(openSet, mcurrent)
  closedSet.push(mcurrent)
}

function removeItem(array, item) {
  for(let x = 0; x < array.length; x++) {
    if(array[x] == item) {
      array.splice(x, 1)
    }
  }
}