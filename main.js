var nodes, edges ,network;

// convenience method to stringify a JSON object
function toJSON(obj) {
  return JSON.stringify(obj, null, 4);
}


function addNode() {
  try {
    nodes.add({
      id: document.getElementById("node-id").value,
      label: document.getElementById("node-label").value,
    });
  } catch (err) {
    alert(err);
  }
}

function updateNode() {
  try {
    nodes.update({
      id: document.getElementById("node-id").value,
      label: document.getElementById("node-label").value,
    });
  } catch (err) {
    alert(err);
  }
}

function removeNode() {
  try {
    nodes.remove({ id: document.getElementById("node-id").value });
  } catch (err) {
    alert(err);
  }
}

function addEdge() {
  try {
    edges.add({
      id: document.getElementById("edge-id").value,
      from: document.getElementById("edge-from").value,
      to: document.getElementById("edge-to").value,
      arrows: document.getElementById("edge-Arrow").value,
        });
  } catch (err) {
    alert(err);
  }
}
function updateEdge() {
  try {
    edges.update({
      id: document.getElementById("edge-id").value,
      from: document.getElementById("edge-from").value,
      to: document.getElementById("edge-to").value,
      arrows: document.getElementById("edge-Arrow").value,
    });
  } catch (err) {
    alert(err);
  }
}
function removeEdge() {
  try {
    edges.remove({ id: document.getElementById("edge-id").value });
  } catch (err) {
    alert(err);
  }
}

function llenarMatriz() {
  var Table = document.getElementById("table");
  Table.innerHTML = "";
  var mapfrom = edges.map((edges) => edges.from);
  console.log(mapfrom);

  var mapto = edges.map((edges) => edges.to);
  console.log(mapto);
 
  for(var i = 0; i < mapfrom.length; i++) {
    mapfrom[i] = +mapfrom[i];
    }
    
  for (var i = 0; i< mapto.length; i++){
    mapto[i] = +mapto[i];
  }
  var largo = nodes.length;

  let matrix = new Array(largo+1);
  
  for (let i = 0; i< matrix.length;i++){
    matrix[i] = new Array(matrix.length);
  }

  for(let i = 0; i<matrix.length; i++){
    for(let j = 0; j< matrix[i].length; j++){
      matrix[i][j]=0;
    }
  }

  for(let i=0; i<matrix.length; i++) {
    matrix[i][0]=i;
  }

  for(let j=0; j<matrix.length; j++) {
    matrix[0][j]=j;
  }

  for(let c=0; c<=matrix.length; c++) {
    for(let i=0; i<matrix.length; i++) {
      for(let j=0; j<matrix[i].length; j++) {
        if(i === mapfrom[c] && j === mapto[c]) {
          matrix[i][j] = 1;
          matrix[j][i] = 1;
        }
      }
    }
  }

  console.log(matrix);

  for(var i=0; i<matrix.length; i++) {
    var newRow = table.insertRow(table.length);
    for(var j=0; j<matrix[i].length; j++) {
      var cell= newRow.insertCell(j);

      cell.innerHTML = matrix[i][j];
    }
  }
  conexo(matrix);
}

function conexo(matrix){  
  document.getElementById("conexo").innerHTML = '';
  let cont=0;
  for(let i=1; i<=nodes.length;i++){
    for(let j=1; j<=nodes.length;j++){
      console.log(matrix[i][j]);
      if(matrix[i][j]!=0){
        cont++;
      }
    }
  }

  if(cont!=0)
    document.getElementById("conexo").innerHTML +="<p> Este grafo es de tipo conexo";

  else
     document.getElementById("conexo").innerHTML +="<p> Este grafo es de tipo no conexo";
}

const dijkstra = function (graph, start) {

  //This contains the distances from the start node to all other nodes
  var distances = [];
  //Initializing with a distance of "Infinity"
  for (var i = 0; i < graph.length; i++) distances[i] = Number.MAX_VALUE;
  //The distance from the start node to itself is of course 0
  distances[start] = 0;

  //This contains whether a node was already visited
  var visited = [];

  //While there are nodes left to visit...
  while (true) {
      // ... find the node with the currently shortest distance from the start node...
      var shortestDistance = Number.MAX_VALUE;
      var shortestIndex = -1;
      for (var i = 0; i < graph.length; i++) {
          //... by going through all nodes that haven't been visited yet
          if (distances[i] < shortestDistance && !visited[i]) {
              shortestDistance = distances[i];
              shortestIndex = i;
          }
      }

      console.log("Visiting node " + shortestDistance + " with current distance " + shortestDistance);

      if (shortestIndex === -1) {
          // There was no node not yet visited --> We are done
          return distances;
      }

      //...then, for all neighboring nodes....
      for (var i = 0; i < graph[shortestIndex].length; i++) {
          //...if the path over this edge is shorter...
          if (graph[shortestIndex][i] !== 0 && distances[i] > distances[shortestIndex] + graph[shortestIndex][i]) {
              //...Save this path as new shortest path.
              distances[i] = distances[shortestIndex] + graph[shortestIndex][i];
              console.log("Updating distance of node " + i + " to " + distances[i]);
          }
      }
      // Lastly, note that we are finished with this node.
      visited[shortestIndex] = true;
      console.log("Visited nodes: " + visited);
      console.log("Currently lowest distances: " + distances);

  }
};

function imprimirCaminoCorto(){
  console.log(dijkstra(matrix, 1));
}


function draw() {
  // create an array with nodes
  nodes = new vis.DataSet();
  nodes.on("*", function () {
    document.getElementById("nodes").innerText = JSON.stringify(
      nodes.get(),
      null,
      4
    );
  });
  nodes.add([
    { id: "1", label: "Node 1" },
    { id: "2", label: "Node 2" },
    { id: "3", label: "Node 3" },
    { id: "4", label: "Node 4" },
    { id: "5", label: "Node 5" },
  ]);

  // create an array with edges
  edges = new vis.DataSet();
  edges.on("*", function () {
    document.getElementById("edges").innerText = JSON.stringify(
      edges.get(),
      null,
      4
    );
  });

  edges.add([
    { id: "1", from: "1", to: "2", arrows: document.getElementById("edge-Arrow").value },
    { id: "2", from: "2", to: "3", arrows: document.getElementById("edge-Arrow").value },
    { id: "3", from: "3", to: "4", arrows: document.getElementById("edge-Arrow").value },
    { id: "4", from: "4", to: "5", arrows: document.getElementById("edge-Arrow").value },
    { id: "5", from: "5", to: "1", arrows: document.getElementById("edge-Arrow").value },
  ]);




  // create a network
  var container = document.getElementById("mynetwork");
  var data = {
    nodes: nodes,
    edges: edges,
  };
  var options = {
    
  };
  network = new vis.Network(container, data, options);
}

window.addEventListener("load", () => {
  draw();
});