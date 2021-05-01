var nodes = null;
var edges = null;
var network = null;

var form = document.querySelector('#form1');
console.log(form);

form.addEventListener('submit', (e) =>{

  console.log(form.Direccion.value);
  e.preventDefault();
  
});

var vertices = null;
var aristas_from = null;
var aristas_to = null;
var peso = null;

// randomly create some nodes and edges
var data = getScaleFreeNetwork(0);
var seed = 2;

function getScaleFreeNetwork(nodeCount) {
  var nodes = [];
  var edges = [];
  var connectionCount = [];

  // randomly create some nodes and edges
  for (var i = 0; i < nodeCount; i++) {
    nodes.push({
      id: i,
      label: String(i)
    });

    connectionCount[i] = 0;

    // create edges in a scale-free-network way
    if (i == 1) {
      var from = i;
      var to = 0;
      edges.push({
        from: from,
        to: to
      });
      connectionCount[from]++;
      connectionCount[to]++;
    }
    else if (i > 1) {
      var conn = edges.length * 2;
      var rand = Math.floor(Math.random() * conn);
      var cum = 0;
      var j = 0;
      while (j < connectionCount.length && cum < rand) {
        cum += connectionCount[j];
        j++;
      }


      var from = i;
      var to = j;
      edges.push({
        from: from,
        to: to
      });
      connectionCount[from]++;
      connectionCount[to]++;
    }
  }

  return {nodes:nodes, edges:edges};
}

function destroy() {
  if (network !== null) {
    network.destroy();
    network = null;
  }
}


function buscarConexo(columna,fila){
  for(let i=0; i<(aristas_from.length);i++){
    if(form.Direccion.value=='Dirigido'){
      if(columna===aristas_from[i] && fila===aristas_to[i])
          return 1;
    }else{
      if(columna===aristas_from[i] && fila===aristas_to[i] || columna===aristas_to[i] &&  fila===aristas_from[i])
        return 1;
    }
    }
}


function llenarMatriz() {
  
  var table = document.getElementById("table");
  table.innerHTML = "";
  var mAdyacencia = [];
  var aux = []; // columnas
    for(let i=0; i<vertices.length;i++){
      for(let j=0; j<vertices.length;j++){
        if(buscarConexo(vertices[i],vertices[j])===1){
          aux.push(1);
         }
        else{
          aux.push(0);
        }   
      }
      mAdyacencia[i]=aux;
      aux=[];
    }
    
    console.log(mAdyacencia);

    for(var i=0; i<mAdyacencia.length; i++) {
      var newRow = table.insertRow(table.length);
      for(var j=0; j<mAdyacencia[i].length; j++) {
        var cell = newRow.insertCell(j);

        cell.innerHTML = mAdyacencia[i][j];
      }
    }
    conexo(mAdyacencia);
    return mAdyacencia;
}

function conexo(mAdyacencia){
  var  cont=0;
  for(let i=0; i<mAdyacencia.length;i++){
    for(let j=0; j<mAdyacencia.length;j++){
      if(mAdyacencia[i][j]!=0){
        cont++;
      }
    } 
  }
  if(cont!=0) {
    console.log("es conexo");
    return true;
  }
  else{
    console.log("no es conexo");
    return false;
  }
}

function draw() {
  destroy();
  nodes = [];
  edges = [];

  vertices = [];
  aristas_from = [];
  aristas_to = [];
  peso = [];
  
  var form = document.querySelector('#form1');
  // create a network
  var container = document.getElementById("mynetwork");
  var options = {
    layout: { randomSeed: seed }, // just to make sure the layout is the same when the locale is changed
    locale: document.getElementById("locale").value,
    manipulation: {
      addNode: function (data, callback) {
        // filling in the popup DOM elements
        document.getElementById("node-operation").innerText = "Add Node";
        editNode(data, clearNodePopUp, callback);
      },
      editNode: function (data, callback) {
        // filling in the popup DOM elements
        document.getElementById("node-operation").innerText = "Edit Node";
        editNode(data, cancelNodeEdit, callback);
      },
      addEdge: function (data, callback) {
        if (data.from == data.to) {
          var r = confirm("Do you want to connect the node to itself?");
          if (r != true) {
            callback(null);
            return;
          }
        }
        if(form.Direccion.value=='Dirigido'){
          var options = {
            edges:{
              arrows:{
                to:{
                  enabled: true,
                  scaleFactor: 1,
                  type: "arrow"
                }
              }
                 
            }
          }
          network.setOptions(options);
        }
        document.getElementById("edge-operation").innerText = "Add Edge";
        editEdgeWithoutDrag(data, callback);
      },
      editEdge: {
        editWithoutDrag: function (data, callback) {
          document.getElementById("edge-operation").innerText = "Edit Edge";
          editEdgeWithoutDrag(data, callback);
        },
      },
    },
  };
  network = new vis.Network(container, data, options);
}

function editNode(data, cancelAction, callback) {
  document.getElementById("node-label").value = data.label;
  document.getElementById("node-saveButton").onclick = saveNodeData.bind(this, data, callback);
  document.getElementById("node-cancelButton").onclick = cancelAction.bind(this, callback);
  document.getElementById("node-popUp").style.display = 'block';
}

// Callback passed as parameter is ignored
function clearNodePopUp() {
  document.getElementById('node-saveButton').onclick = null;
  document.getElementById('node-cancelButton').onclick = null;
  document.getElementById('node-popUp').style.display = 'none';
}

function cancelNodeEdit(callback) {
  clearNodePopUp();
  callback(null);
}

function saveNodeData(data, callback) {
  data.id = document.getElementById('node-id').value;
  data.label = document.getElementById('node-id').value;
  for(var i=0; i < vertices.length ;i++){
    if(vertices[i]==data.id){
      clearNodePopUp();
      return alert("Nodo ya existente");  
    }  
  }
  vertices.push(data.id);
  clearNodePopUp();
  callback(data);
}

function editEdgeWithoutDrag(data, callback) {
  // filling in the popup DOM elements
  // document.getElementById('edge-label').value = data.label;
  document.getElementById('edge-saveButton').onclick = saveEdgeData.bind(this, data, callback);
  document.getElementById('edge-cancelButton').onclick = cancelEdgeEdit.bind(this,callback);
  document.getElementById('edge-popUp').style.display = 'block';
}

function clearEdgePopUp() {
  document.getElementById("edge-saveButton").onclick = null;
  document.getElementById("edge-cancelButton").onclick = null;
  document.getElementById("edge-popUp").style.display = "none";
}

function cancelEdgeEdit(callback) {
  clearEdgePopUp();
  callback(null);
}

function saveEdgeData(data, callback) {
  if (typeof data.to === 'object')
    data.to = data.to.id;
 
  if (typeof data.from === 'object')
    data.from = data.from.id;

  data.label = document.getElementById('edge-label').value;
  aristas_from.push(data.from);
  aristas_to.push(data.to);
  peso.push(data.label);

  clearEdgePopUp();
  callback(data);
}

function init() {
  draw();
}