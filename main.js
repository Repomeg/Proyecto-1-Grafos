var nodes = null;
var edges = null;
var network = null;
var grafoDijkstra = [];
var vertices = null;
var aristas_from = null;
var aristas_to = null;
var peso = null;
var auxlista= new Map();
var pesoAux = [];
var a_desde = [];
var a_hacia = [];
var contador = 1;

var mAdyacencia = null;
var mCaminos = null;
var mPeso = null;

var infociclo;

var form = document.querySelector("#form1");


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
    return mAdyacencia;
}


function bfs(rGraph, s, t, parent) {
	var visited = [];
	var queue = [];
	var V = rGraph.length;

	for (var i = 0; i < V; i++) {
		visited[i] = false;
	}
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
	return (visited[t] == true);
}

function fordFulkerson(graph, s, t) {
  if(form.Direccion.value!="Dirigido"){
    alert("Esta funcion solo es valida con Grafos Dirigidos.");
    console.log("El Grafo ingresado en la funcion de Flujo Maximo no es Valido.");
    return 0;
  } 
	var rGraph = [];
	for (var u = 0; u < graph.length; u++) {
		var temp = [];

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

function llenar(){
  for (var i = 0; i < peso.length ; i++){
    pesoAux[i] = peso[i][2];
  }
}

function stringAInt(boo){
  for (var i = 0; i < boo.length; i++ ){
    var aux = boo[i];
    aux = parseInt(boo[i], 10);
    boo[i] = aux;
  }
}

function order(){
  for(var i = 0; i < pesoAux.length ; i++){
    if (aristas_from[i] > aristas_to[i]){
      var aux = aristas_from[i];
      aristas_from[i] = aristas_to[i];
      aristas_to[i] = aux;
    }
  }
}

function bubble(){
  var len = pesoAux.length;    
  for (var i = 0; i < len ; i++) {
    for(var j = 0 ; j < len - i - 1; j++){
      if (pesoAux[j] > pesoAux[j + 1]){
      var temp = pesoAux[j];
      var temp2 = aristas_from[j];
      var temp3 = aristas_to[j];
      pesoAux[j] = pesoAux[j+1];
      aristas_from[j] = aristas_from[j+1];
      aristas_to[j] = aristas_to[j+1];
      pesoAux[j+1] = temp;
      aristas_from[j+1] = temp2;
      aristas_to[j+1] = temp3;
      }
    }
  }
}

function kruskal (){
  var total = 0;
  llenar();
  stringAInt(pesoAux);
  order();
  bubble();

  if(conexo()!=true){
    alert("Esta funcion solo esta disponible para Grafos que son Conexos.");
    console.log("El Grafo ingresado a la funcion Kruskal no es Valido.");
    return 0
  }


  for (var i = 0; i<pesoAux.length;i++){   
  if ((a_desde.includes(aristas_to[i], 0) == false) && (a_hacia.includes(aristas_from[i], 0) == false)){
    if (aristas_from[i] != aristas_from[i+1]){
      a_desde.push(aristas_from[i]);
      a_hacia.push(aristas_to[i]);
      contador++;
      total = total + pesoAux[i];
    }
  }else if((a_desde.includes(aristas_from[i], 0) == false) && (a_hacia.includes(aristas_to[i], 0) == false)){
    if (aristas_from[i] != aristas_from[i+1]){
      a_desde.push(aristas_from[i]);
      a_hacia.push(aristas_to[i]);
      contador++;
      total = total + pesoAux[i];
    }
  }else if((a_hacia.includes(aristas_from[i], 0) == false) && (a_hacia.includes(aristas_to[i], 0) == false)){
    if (aristas_from[i] != aristas_from[i+1]){
      a_desde.push(aristas_from[i]);
      a_hacia.push(aristas_to[i]);
      contador++;
      total = total + pesoAux[i];
    }
  }else if((a_desde.includes(aristas_from[i], 0) == false) && (a_desde.includes(aristas_to[i], 0) == false)){
    if (aristas_from[i] != aristas_from[i+1]){
      a_desde.push(aristas_from[i]);
      a_hacia.push(aristas_to[i]);
      contador++;
      total = total + pesoAux[i];
    }
  }
    if (contador == vertices.length){
      break;
    }
  }
  console.log(a_desde);
  console.log(a_hacia);
  return total;
}

function draw() {
  destroy();
  nodes = [];
  edges = [];
  var options;
  vertices = [];
  aristas_from = [];
  aristas_to = [];
  peso = [];
  mAdyacencia = [];
  mCaminos = [];
  mPeso = [];
  var container = document.getElementById("mynetwork");

  // create a network
  
   options = {
    layout: { randomSeed: seed }, 
    locale: document.getElementById("locale").value,
    manipulation: {
      addNode: function (data0, callback) {
        // filling in the popup DOM elements
        
        editNode(data0, clearNodePopUp, callback);
      },
      addEdge: function (data2, callback) {
        if (data2.from == data2.to) {
          var r = confirm("¿Quieres conectar este nodo a si mismo?(Formara un ciclo)");
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
        
        document.getElementById("edge-operation").innerText = "Añadir Nodo";
        editEdgeWithoutDrag(data2, callback);
      },
      deleteNode: false,
      deleteEdge: false,
      editEdge: {
        editWithoutDrag: function (data3, callback) {
          document.getElementById("edge-operation").innerText = "Editar Nodo";
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

function saveNodeData(data4, callback) {  //POP UP PARA GUARDAR DATOS DEL NODO
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

function saveEdgeData(data6, callback) {   // POP UP PARA LLENAR LOS DATOS DE LA ARISTA
  if (typeof data6.to === "object")
    data6.to = data6.to.id;
 
  if (typeof data6.from === "object")
    data6.from = data6.from.id;

  data6.label = document.getElementById("edge-label").value;

  aristas_from.push(data6.from);
  aristas_to.push(data6.to);
  peso.push(data6.label);
  clearEdgePopUp();
  callback(data6);
}

function init() {
  draw();
}