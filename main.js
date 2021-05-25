var nodes = null;
var edges = null;
var network = null;
var grafoDijkstra = [];
var vertices = null;
var aristas_from = null;
var aristas_to = null;
//var aristas = [];
var peso = null;
var auxlista= new Map();

var mAdyacencia = null;
var mCaminos = null;
var mPeso = null;

var infociclo;

var form = document.querySelector("#form1");

// randomly create some nodes and edges
var data=null;
var seed=2;
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
  var j;
  table.innerHTML = "";
  if(vertices==null) {
    table.innerHTML = "No hay nodos en la matriz";
    return 0;
  }
  mAdyacencia = [];
  var aux = []; // columnas
  var i;
    for( i=0; i<vertices.length;i++){
      for( j=0; j<vertices.length;j++){
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

    for( i=0; i<mAdyacencia.length; i++) {
      var newRow = table.insertRow(table.length);
      for( j=0; j<mAdyacencia[i].length; j++) {
        var cell = newRow.insertCell(j);
        cell.innerHTML = mAdyacencia[i][j];
      }
    }

    matrizCamino();
    conexo();
    if(conexo()==true){
      infociclo = ciclo();
      euleriano();
      if(infociclo==false){
        console.log(hamiltoniano());
      }
    }
    else {
      euleriano();
      hamiltoniano();
    }

    MatrizDePeso();
    kruskal();
    /*
    console.log(auxlista);
        shortestPath();
    //console.log("El flujo máximo posible es" + fordFulkerson (mPeso ,0 ,5)); */
    return mAdyacencia;
}


function bfs(rGraph, s, t, parent) {
	var visited = [];
	var queue = [];
	var V = rGraph.length;
	// Create a visited array and mark all vertices as not visited
	for (var i = 0; i < V; i++) {
		visited[i] = false;
	}
	// Create a queue, enqueue source vertex and mark source vertex as visited
	queue.push(s);
	visited[s] = true;
	parent[s] = -1;

	while (queue.length != 0) {
		var u = queue.shift();
		for (var v = 0; v < V; v++) {
			if (visited[v] == false && rGraph[u][v] > 0) {
				queue.push(v);
				parent[v] = u;
				visited[v] = true;
			}
		}
	}
	//If we reached sink in BFS starting from source, then return true, else false
	return (visited[t] == true);
}

function fordFulkerson(graph, s, t) {
  if (s < 0 || t < 0 || s > graph.length-1 || t > graph.length-1){
    throw new Error("Ford-Fulkerson-Maximum-Flow :: invalid sink or source");
  }
  if(graph.length === 0){
    throw new Error("Ford-Fulkerson-Maximum-Flow :: invalid graph");
  }
	var rGraph = [];
	for (var u = 0; u < graph.length; u++) {
		var temp = [];
    if(graph[u].length !== graph.length){
      throw new Error("Ford-Fulkerson-Maximum-Flow :: invalid graph. graph needs to be NxN");
    }
		for (v = 0; v < graph.length; v++) {
			temp.push(graph[u][v]);
		}
		rGraph.push(temp);
	}
	var parent = [];
	var maxFlow = 0;

	while (bfs(rGraph, s, t, parent)) {
		var pathFlow = Number.MAX_VALUE;
		for (var v = t; v != s; v = parent[v]) {
			u = parent[v];
			pathFlow = Math.min(pathFlow, rGraph[u][v]);
		}
		for (v = t; v != s; v = parent[v]) {
			u = parent[v];
			rGraph[u][v] -= pathFlow;
			rGraph[v][u] += pathFlow;
		}


		maxFlow += pathFlow;
	}
	// Return the overall flow
  console.log(maxFlow);
	return maxFlow;
}

function LlamarFord(){
  var inicio= document.getElementById("inicio").value;
  var final= document.getElementById("final").value;
  fordFulkerson(mPeso,inicio,final);
}

function buscarPeso(columna,fila){
  for(let i=0; i<aristas_from.length ;i++){
    if(columna===aristas_from[i] && fila===aristas_to[i]){
      return peso[i];
    }
    else{
      if(columna===aristas_from[i] && fila===aristas_to[i] || columna===aristas_to[i] &&  fila===aristas_from[i])
        return peso[i];
    }
  }
}

function MatrizDePeso(){ 
  mPeso = [];
  var aux = [];
  for(let i=0; i<vertices.length;i++){
    for(let j=0; j<vertices.length;j++){
      if(buscarConexo(vertices[i],vertices[j])===1){
        aux.push(buscarPeso(vertices[i],vertices[j]));
      }
      else{
        aux.push(0);
      }    
    }
    mPeso[i]=aux;
    aux=[];
  }
  console.log(mPeso);
  return mPeso;
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

function matrizCamino(){
  var table = document.getElementById("TablaCam");
  var largo = mAdyacencia.length;
  var a;
  var b;
  mCaminos= mAdyacencia;
  for(let k = 0; k < largo; k++){
    for(let i = 0; i < largo; i++){
      for(let j = 0; j < largo; j++){
        if(mAdyacencia[i][j] == 1 || mAdyacencia[i][k] == 1 && mAdyacencia[k][j] == 1){
          mAdyacencia[i][j] = 1;
        }
        else{
          mAdyacencia[i][j] = 0;
        }
      }
    }
  }
  for( a=0; a<mCaminos.length; a++) {
    var newRow = table.insertRow(table.length);
    for( b=0; b<mCaminos[a].length; b++) {
      var cell = newRow.insertCell(b);

      cell.innerHTML = mCaminos[a][b];
    }
  }
  mCaminos = mAdyacencia;
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
    document.getElementById('hamiltoniano').innerHTML='Su grafo es hamiltoniano';
    return true;
  }
  else return false;
}

function hamiltoniano(){
  var cont = 0;
  if(conexo() === true){
      if(vertices.length>=3){
        for(let i = 0; i<vertices.length; i++){
          console.log(vertices[i]);
          console.log(gradoVertice(vertices));
          if(gradoVertice(vertices[i]) >= (vertices.length/2)){
            cont++;
          }
          console.log(cont);
        }
        if(cont === vertices.length){
          console.log("Es hamiltoniana");
          document.getElementById('hamiltoniano').innerHTML='Su grafo es hamiltoniano';
          return true;
        }
        else{
          console.log("No es hamiltoniana");
          document.getElementById('hamiltoniano').innerHTML='Su grafo NO es hamiltoniano';
          return false;
        }
      }
      else{
        console.log("No es hamiltoniana");
        document.getElementById('hamiltoniano').innerHTML='Su grafo NO es hamiltoniano';
        return false;
      }
    }
    else{
    console.log("No es hamiltoniana");
    document.getElementById('hamiltoniano').innerHTML='Su grafo NO es hamiltoniano';
    return false;
  }
}

function euleriano(){
  var contPar = 0;
  if(conexo() === true){
    for(let i = 0; i<vertices.length; i++){
      if(gradoVertice(vertices[i])%2 === 0){
        contPar++;
      }
    }
    if(contPar === vertices.length){
      console.log("Es euleriano");
      document.getElementById('euleriano').innerHTML='Su grafo es euleriano';
    }
    else{
      console.log("No es euleriano");
      document.getElementById('euleriano').innerHTML='Su grafo NO es euleriano';
    }
  }
  else{
    console.log("No es euleriano");
    document.getElementById('euleriano').innerHTML='Su grafo NO es euleriano';
  }
}

function agregarConex(nodoInicial, nodoFinal, valorDistancia) {
var buscarNodo;
var conexion;
  valorDistancia = parseInt(valorDistancia, 10);

  buscarNodo = grafoDijkstra.filter(item => item.origen === nodoInicial);
  if (buscarNodo.length === 0) {
    conexion = [];
    conexion.push({
      destino: nodoFinal,
      distancia: valorDistancia
    });
    grafoDijkstra.push({ origen: nodoInicial, conexiones: conexion });
  }
  else {
    buscarNodo[0].conexiones.push({
      destino: nodoFinal,
      distancia: valorDistancia
    });
  }

}

function shortestPath(){
  var i;
 
  var enlaces;
  var short;
  var desde= document.getElementById("desde").value;
  var hasta= document.getElementById("hasta").value;

  for(i = 0; i < aristas_from.length; i++){
    agregarConex(aristas_from[i], aristas_to[i], peso[i]);
    agregarConex(aristas_to[i], aristas_from[i], peso[i]);
  }

  var g = new Graph();

  grafoDijkstra.forEach(function (value, key, array) {
    enlaces = {};

    value.conexiones.forEach(function (conexion, key2, array2) {
      enlaces[conexion.destino] = conexion.distancia;
      
    });
   
    g.addVertex(value.origen, enlaces);

    short = g.shortestPath(desde, hasta).concat(desde).reverse();
  });

  if(short.length>1){ //Realiza la comprobacion en 1 por que el nodo de inicio ya esta dentro del arreglo
    document.getElementById("Camino").innerHTML='El camino mas corto desde '+ desde + ' hasta ' + hasta + ' es: '+ short; 
  }
  else{
    document.getElementById("Camino").innerHTML='No existe un camino valido para esa ruta';
  }
}

function kruskal(){
  var nodoA = [];
  var nodoB = [];
  var arcos = [];

  var mKruskal = mPeso;
  var min = 9999;
  var ejeX = 0;
  var ejeY = 0;

  for(var i = 0; i < vertices.length; i++){
    for(var j = 0; j < vertices.length; j++){
      if(min > mKruskal[ejeX][j] && mKruskal[ejeX][j] != 0){
        min = mKruskal[ejeX][j];
        ejeY = j;
      }
      else{
        if(mKruskal[j][ejeX] < min && mKruskal[j][ejeX] != 0){
          min = mKruskal[j][ejeX];
          ejeY = j;
        }
      }
    }
    if(min != 0 || min != 9999){
      nodoA.push(ejeX);
      nodoB.push(ejeY);
      arcos.push(min);
      mKruskal[ejeX][ejeY] = 0;
      mKruskal[ejeY][ejeX] = 0;
      ejeX = ejeY;
      min = 9999;
    }
  }
  console.log(nodoA, nodoB, arcos);
}

function draw() {
  destroy();
  nodes = [];
  edges = [];
  var options;
  vertices = [];
  aristas_from = [];
  aristas_to = [];
  //aristas = [];
  peso = [];
  var container = document.getElementById("mynetwork");

  // create a network
  
   options = {
    layout: { randomSeed: seed }, // just to make sure the layout is the same when the locale is changed
    locale: document.getElementById("locale").value,
    manipulation: {
      addNode: function (data0, callback) {
        // filling in the popup DOM elements
        document.getElementById("node-operation").innerText = "Add Node";
        editNode(data0, clearNodePopUp, callback);
      },
     /* editNode: function (data, callback) {
        // filling in the popup DOM elements
        document.getElementById("node-operation").innerText = "Edit Node";
        editNode(data, cancelNodeEdit, callback);
      },*/
      addEdge: function (data2, callback) {
        if (data2.from == data2.to) {
          var r = confirm("Do you want to connect the node to itself?");
          if (r != true) {
            callback(null);
            return;
          }
        }
        if(form.Direccion.value=="Dirigido"){
           options = {
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
           options = {
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
        editEdgeWithoutDrag(data2, callback);
      },
      deleteNode: false,
      deleteEdge: false,
      editEdge: {
        editWithoutDrag: function (data3, callback) {
          document.getElementById("edge-operation").innerText = "Edit Edge";
          editEdgeWithoutDrag(data3, callback);
        },
      },
    },
  };
  network = new vis.Network(container, data, options);
  document.getElementById("locale").innerHTML="Reiniciar Grafos";
}

function editNode(data7, cancelAction, callback) {
  
  document.getElementById("node-saveButton").onclick = saveNodeData.bind(this, data7, callback);
  document.getElementById("node-cancelButton").onclick = cancelAction.bind(this, callback);
  document.getElementById("node-popUp").style.display = "block";
}

function clearNodePopUp() {
  document.getElementById("node-saveButton").onclick = null;
  document.getElementById("node-cancelButton").onclick = null;
  document.getElementById("node-popUp").style.display = "none";
}

function cancelNodeEdit(callback) {
  clearNodePopUp();
  callback(null);
}

function saveNodeData(data4, callback) {
  data4.id = document.getElementById("node-id").value;
  data4.label = document.getElementById("node-id").value;
  for(var i=0; i < vertices.length ;i++){
    if(vertices[i]==data4.id){
      clearNodePopUp();
      return alert("Nodo ya existente");  
    }  
  }
  vertices.push(data4.id);
  clearNodePopUp();
  callback(data4);
}

function editEdgeWithoutDrag(data5, callback) {
  // filling in the popup DOM elements
  document.getElementById("edge-label").value = data5.label;
  document.getElementById("edge-saveButton").onclick = saveEdgeData.bind(this, data5, callback);
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

function saveEdgeData(data6, callback) {
  if (typeof data6.to === "object")
    data6.to = data6.to.id;
 
  if (typeof data6.from === "object")
    data6.from = data6.from.id;

  data6.label = document.getElementById("edge-label").value;
  //aristas[aristas_from.length] = [data.from, data.to];
  aristas_from.push(data6.from);
  aristas_to.push(data6.to);
  peso.push(data6.label);
  clearEdgePopUp();
  callback(data6);
}

function init() {
  draw();
}