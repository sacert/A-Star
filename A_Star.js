function Node(x, y) {
    this.block = false;
    this.x = x;  
    this.y = y;
    this.parent = null;
    this.gScore = -1; // score of getting from start to this node
    this.fScore = -1; // score of gScore plus hueristic value
    this.heuristicCalc = function (x_final, y_final) {
        return Math.floor(Math.sqrt(Math.pow(x_final - this.x,2) + Math.pow(y_final - this.y, 2)));
    };
}

// create 2D grid of of nxn where n = size
function grid(size) {
  
  // create array 
  var grid = new Array(size);
  for (var i = 0; i < size; i++) {
    grid[i] = new Array(size);
  }
  
  // associate each element with a node object
  for (var i = 0; i < size; i++) {
    for (var j = 0; j < size; j++) {
      if(grid[i][j] != "-") {
        grid[i][j] = new Node(j, i);
      }
    }
  }
  
  grid[3][0].block = true;
  grid[3][1].block = true;
  grid[3][2].block = true;
  grid[3][5].block = true;
  grid[3][3].block = true;
  grid[3][4].block = true;
  grid[3][6].block = true;
  grid[3][7].block = true;
  grid[5][9].block = true;
  grid[5][8].block = true;
  grid[5][7].block = true;
  grid[5][6].block = true;
  grid[5][5].block = true;
  grid[5][4].block = true;
  grid[5][3].block = true;
  
  return grid;
}

// used to sort open set according to fScore values 
function fScoreSort(a,b) {
  if (a.fScore < b.fScore)
    return -1;
  if (a.fScore > b.fScore)
    return 1;
  return 0;
}

function A_Star() {
  
  // starting values 
  var start_x = 0;
  var start_y = 0;
  
  // ending values 
  var end_x = 6;
  var end_y = 8;
  
  var size = 10;
  
  // initialize grid of size 10
  var grid10 = grid(size);
  
  // set of nodes that have already been looked at
  var closedSet = [];
  
  // set of nodes that are known but not looked at 
  var openSet = [];
  
  // add the starting element to the open set
  openSet.push(grid10[start_y][start_x]);
  grid10[start_y][start_x].gScore = 0;
  grid10[start_y][start_x].fScore = grid10[start_y][start_x].heuristicCalc(end_x, end_y); // just the heuristic

  // while open set is not empty
  while (openSet.length > 0) {
    openSet.sort(fScoreSort);
    var currentNode = openSet[0];
    
    //console.log(currentNode.x + " " + currentNode.y);
    
    if ((currentNode.x == end_x) && (currentNode.y == end_y)) {
      return reconstruct_path(grid10, currentNode, start_x, start_y); // return path
    }
    
    // remove current node from open set
    var index = openSet.indexOf(currentNode);
    openSet.splice(index, 1);
    
    closedSet.push(currentNode);
    
    for (var i = -1; i < 2; i++) {
      for (var j = -1; j < 2; j++) {
        
        // out of bounds
        if(((currentNode.x + j) < 0) || ((currentNode.x + j) > size-1) || ((currentNode.y + i) < 0) || ((currentNode.y + i) > size-1)) {
          continue;
        }

        // check to see if "-" (block) is within the grid
        if ((grid10[currentNode.y + i][currentNode.x + j].block)) {
          continue;
        }

        var neighbour = grid10[currentNode.y + i][currentNode.x + j];
        
        
        // skip the current node
        if (currentNode.y + i == currentNode.y && currentNode.x + j == currentNode.x) {
          continue;
        }
        
        // if node is within the closed set, it has already
        // been looked at - therefore skip it
        if (closedSet.indexOf(neighbour) != -1) {
          continue;
        }
        
        // set tentative score to gScore plus distance from
        // current to neighbour
        // in this case, the weight is equal to 1 everywhere
        var tScore = neighbour.gScore + 1;
        
        // if neighbour is not in open set, add it
        if (openSet.indexOf(neighbour) == -1) {
          openSet.push(neighbour);
        }
        
        // it has a better route so skip it
        //if (tScore > neighbour.gScore) {
        //  continue;
        //}
        
        // this is a better path so set node's new values
        neighbour.parent = currentNode;
        neighbour.gScore = tScore;
        neighbour.fScore = neighbour.gScore + neighbour.heuristicCalc(end_x, end_y);
        
      }
    }
    
  }
  
  // the node was not found
  return false;
  
}

function reconstruct_path(grid10, current, start_x, start_y) {
    var currentNode = current;
    var totalPath = [current];
    
    // used to print array
    var map = new Array(10);
    for (var i = 0; i < 10; i++) {
      map[i] = new Array(10).fill(0);
    }
    
    // insert 'blocks' into grid
    for (var i = 0; i < map.length; i++) {
      for (var j = 0; j < map.length; j++) {
        if(grid10[i][j].block) {
          map[i][j] = 9;
        }
      }
    }
    
    // go through the parents to find how the route
    while (currentNode.parent != null) {
      map[currentNode.y][currentNode.x] = 1;
      totalPath.push(currentNode.parent);
      currentNode = currentNode.parent;
    }
    
    // include the initial node as well
    var initialNode = grid10[start_y][start_x];
    map[initialNode.y][initialNode.x] = 1;
    totalPath.push(initialNode);
    
    // print it
    console.log(map);
    
    return totalPath;
}

var aStar = A_Star();
