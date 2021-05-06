var nodes = null;
var edges = null;
var network = null;

var vertices = null;
var aristas_from = null;
var aristas_to = null;
var aristas = [];
var peso = null;

var mAdyacencia = null;
var mCaminos = null;

var infociclo;

var form = document.querySelector("#form1");

// randomly create some nodes and edges
var data = null;
var seed = 2;

function destroy() {
  if (network !== null) {
    network.destroy();
    network = null;
  }
}

function buscarConexo(columna,fila){
  for(let i=0; i<(aristas_from.length);i++){
    if(form.Direccion.value=="Dirigido"){
      if(columna===aristas_from[i] && fila===aristas_to[i])
          return 1;
    }
    else{
      if(columna===aristas_from[i] && fila===aristas_to[i] || columna===aristas_to[i] &&  fila===aristas_from[i])
        return 1;
    }
  }
}

function llenarMatriz() {  
  var table = document.getElementById("table");
  table.innerHTML = "";
  if(vertices==null) {
    table.innerHTML = "No hay nodos en la matriz";
    return 0;
  }
  mAdyacencia = [];
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

    for(var i=0; i<mAdyacencia.length; i++) {
      var newRow = table.insertRow(table.length);
      for(var j=0; j<mAdyacencia[i].length; j++) {
        var cell = newRow.insertCell(j);

        cell.innerHTML = mAdyacencia[i][j];
      }
    }
    MatCami();
    conexo();
    if(conexo()==true){
      infociclo = ciclo();
      euleriano();
      if(infociclo==false){
        console.log(hamiltoniano());
      }
    }
    //console.log(euler());
    return mAdyacencia;
}

function conexo(){
  var  cont=0;
  
  for(let i=0; i<vertices.length;i++){
    for(let j=0; j<vertices.length;j++){
      if(mCaminos[i][j]===0){
        cont++;
      }
    } 
  }
  if(cont!=0) {
    console.log("no es conexo");
    document.getElementById('conex').innerHTML='Su matriz no es conexa';
    return false;
  }
  else{
    console.log("es conexo");
    document.getElementById('conex').innerHTML='Su matriz es conexa';
    return true;
  }
}

function MatCami(){
  var table = document.getElementById("TablaCam");
  table.innerHTML = "";
  mCaminos= mAdyacencia;
  for(let k = 0; k < mCaminos.length; k++){
    for(let i = 0; i < mCaminos.length; i++){
      for(let j = 0; j < mCaminos.length; j++){
        if(mAdyacencia[i][j] == 1 || mAdyacencia[i][k] == 1 && mAdyacencia[k][j] == 1){
          mAdyacencia[i][j] = 1;
        }
        else{
          mAdyacencia[i][j] = 0;
        }
      }
    }
  }
  for(var i=0; i<mCaminos.length; i++) {
    var newRow = table.insertRow(table.length);
    for(var j=0; j<mCaminos[i].length; j++) {
      var cell = newRow.insertCell(j);

      cell.innerHTML = mCaminos[i][j];
    }
  }
  console.log(mCaminos);
  return mCaminos;
}

function gradoVertice(x){
  var aux = 0;
  var guardaNodo1 = 0;
  var guardaNodo2 = 0;
  
  for(let i = 0; i<vertices.length; i++){
    
    guardaNodo1 = aristas_from[i];
    guardaNodo2 = aristas_to[i];
    
    if(x === guardaNodo1 || x === guardaNodo2){
      aux++;
    }
  }
  console.log(aux);
  return aux;
}

function ciclo(){
  var grado, cont = 0;
  for(let i =0;i<vertices.length;i++){
    grado = gradoVertice(vertices[i]);
    if(grado == 2){
      cont++;
    }
  }
  if(vertices.length==cont){
    console.log("Es hamiltoniano");
    return true;
  }
  else return false;
}

function hamiltoniano(){
  cont = 0;
  if(conexo() === true){
      if(vertices.length>=3){
        for(let i = 0; i<vertices.length; i++){
          
          if(gradoVertice(vertices[i]) >= (vertices.length/2)){
            cont++;
          }
          
        }
        if(cont === vertices.length){
          console.log("Es hamiltoniana");
        }
        else{
          console.log("No es hamiltoniana");
        }
      }
      else{
        console.log("No es hamiltoniana");
      }
    }
    else{
    console.log("No es hamiltoniana");
  }
}

function euleriano(){
  var grad = [];
  grad = gradoVertice(vertices);
  for(let i=0; i<aristas.length;i++){
    if(aristas[i][2]==true){
      console.log("Su grado no es euleriano");
    }
  }
}

/*
function euler(){
  resultadoEuler = document.getElementById("resultadoEuler");
  var grado = [];
  grado = gradoGrafo(vertices,aristas);
  // Verifica que no tenga aristas dirigidas
  for(i=0; i<aristas.length; i++){
      if(aristas[i][2] == true){
          console.error("El grafo no es Euleriano");
          alert("No es euleriano");
          //resultadoEuler.innerHTML = false
          return 0;
      }
  }
}
*/

function draw() {
  destroy();
  nodes = [];
  edges = [];

  vertices = [];
  aristas_from = [];
  aristas_to = [];
  aristas = [];
  peso = [];
  var container = document.getElementById("mynetwork");

  // create a network
  
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
        if(form.Direccion.value=="Dirigido"){
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
        else {
          var options = {
            edges:{
              arrows:{
                to:{
                  enabled: false,
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
  document.getElementById("locale").innerHTML="Reiniciar Grafos";
}

function editNode(data, cancelAction, callback) {
  document.getElementById("node-label").value = data.label;
  document.getElementById("node-saveButton").onclick = saveNodeData.bind(this, data, callback);
  document.getElementById("node-cancelButton").onclick = cancelAction.bind(this, callback);
  document.getElementById("node-popUp").style.display = "block";
}

// Callback passed as parameter is ignored
function clearNodePopUp() {
  document.getElementById("node-saveButton").onclick = null;
  document.getElementById("node-cancelButton").onclick = null;
  document.getElementById("node-popUp").style.display = "none";
}

function cancelNodeEdit(callback) {
  clearNodePopUp();
  callback(null);
}

function saveNodeData(data, callback) {
  data.id = document.getElementById("node-id").value;
  data.label = document.getElementById("node-label").value;
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
  document.getElementById("edge-label").value = data.label;
  document.getElementById("edge-saveButton").onclick = saveEdgeData.bind(this, data, callback);
  document.getElementById("edge-cancelButton").onclick = cancelEdgeEdit.bind(this,callback);
  document.getElementById("edge-popUp").style.display = "block";
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
  if (typeof data.to === "object")
    data.to = data.to.id;
 
  if (typeof data.from === "object")
    data.from = data.from.id;

  data.label = document.getElementById("edge-label").value;

  clearEdgePopUp();
  callback(data);
  aristas[aristas_from.length] = [data.from, data.to];
  aristas_from.push(data.from);
  aristas_to.push(data.to);
  peso.push(data.label);
}

function init() {
  draw();
}