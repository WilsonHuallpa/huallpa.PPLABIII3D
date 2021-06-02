
import Anuncio,{Anuncio_Auto} from "./anuncio.js";

let boton = null;
const automovil = JSON.parse(localStorage.getItem("lista")) || [];
window.addEventListener("DOMContentLoaded",()=>{

    document.forms[0].addEventListener("submit",handlerSubmit);
    document.addEventListener("click", handlerClick);
   if(automovil.length > 0){
       handlerLoadList(automovil);
   }
});

function limpiarFormulario(frm){
    frm.reset();
    document.getElementById("btnEliminar").classList.add("oculto");
    document.getElementById("btnSubmit").value = "Agregar";
    document.forms[0].id.value = "";
}

function almacenarDatos(data){
    localStorage.setItem("lista",JSON.stringify(data));
    handlerLoadList();
}

function altaAuto(p){
    automovil.push(p);
    almacenarDatos(automovil);
}

function handlerSubmit(e){
    e.preventDefault();
    const frm =e.target;
    if(frm.id.value){
        const modificarAuto = new Anuncio_Auto(Date.now(),frm.titulo.value, frm.transaccion.value,frm.descripcion.value,frm.precio.value, frm.puertas.value, frm.kms.value,frm.potencia.value);
        if(confirm("Comfirma Modificacion?")){
            agregarSpinner();
            setTimeout(()=>{
                 modificarAuto(modificarAuto);
                 eliminarSpinner();
             }, 2000);
        }
        console.log("modificando");
        
    }else{
        
        const auto = new Anuncio_Auto(Date.now(),frm.titulo.value, frm.transaccion.value,frm.descripcion.value,frm.precio.value, frm.puertas.value, frm.kms.value,frm.potencia.value);
        altaAuto(auto);
        agregarSpinner();
        setTimeout(()=>{
            altaAuto(auto);
             eliminarSpinner();
         }, 2000);
        
    }
    limpiarFormulario(e.target);
}
function agregarSpinner(){
    let spinner = document.createElement("img");
    spinner.setAttribute("src","./images/spinner.gif");
    spinner.setAttribute("alt","imagen spinner");

    document.getElementById("spinner-container").appendChild(spinner);
}
function eliminarSpinner(){
    document.getElementById("spinner-container").innerHTML = "";
}
function modificarAuto(p){

    let index = automovil.findIndex((per)=>{
        return per.id == p.id;
    });
    automovil.splice(index, 1, p);

    almacenarDatos(automovil);

};


function handlerLoadList(e){
    renderizarLista(crearTabla(automovil), document.getElementById("divLista"));
}

function handlerDeleteList(e){
    renderizarLista(null, document.getElementById("divLista"));
     const emisor = e.target;
     emisor.textContent = " Crear lista";
     emisor.addEventListener("click",handlerDeleteList);
     emisor.removeEventListener("click",handlerLoadList);
}

function renderizarLista(lista, contenedor){

    while(contenedor.hasChildNodes()){
        contenedor.removeChild(contenedor.firstChild);
    }
    if(lista){
        contenedor.appendChild(lista);
    }
}

function crearLista(items){

    const lista = document.createElement("ul");
        items.forEach(element => {
        const li = document.createElement("li");
        const contenido =  documente.createTextNode(element.marca);
        li.appendChild(contenido);
        lista.appendChild(li);
    });

    return lista;
}

function crearTabla(items){
    const tabla = document.createElement("table");
    tabla.appendChild(crearThead(items[0]));
    tabla.appendChild(crearTbody(items));
    return tabla;
}



function crearThead(item){

     const thead = document.createElement("thead");
     const tr = document.createElement("tr");
     tr.style.barckgroundColor = "blue";

     for(const key in item){
         if(key !== "id"){
            const th = document.createElement("th");
            th.textContent = key;
            tr.appendChild(th);
         }    
     }
     thead.appendChild(tr);
    return thead;
}
function crearTbody(items){
    const tbody = document.createElement("tbody");

    items.forEach(item=>{
         const tr = document.createElement("tr");
            for(const key in item){
                if(key === "id"){
                     tr.setAttribute("data-id", item[key]);
                }else{
                    const td = document.createElement("td");
                    td.textContent =  item[key];
                    tr.appendChild(td);
                }
            }
        tbody.appendChild(tr);
    });

return tbody;

};


function handlerClick(e){
    if( e.target.matches("td")){
        let id =  e.target.parentNode.dataset.id;
        cargarFomulario(id);
        
    }
    else if (e.target.matches("#btnEliminar")){
        let id = parseInt( document.forms[0].id.value);
        if(confirm ("confirma Eliminacion?")){
            agregarSpinner();
            setTimeout(()=>{
                let index = automovil.findIndex((el)=> el.id === id);
                automovil.splice(index,1);
                almacenarDatos(automovil);
            
                 eliminarSpinner();
             }, 2000);
        }
        limpiarFormulario(document.forms[0]);
    }
}


function cargarFomulario(id){

    const {titulo,transaccion,descripcion,precio,puertas,kms,potencia} = automovil.filter(p => p.id === parseInt(id))[0];
    const frm = document.forms[0];

    frm.titulo.value = titulo; 
    frm.transaccion.value = transaccion;
    frm.descripcion.value =descripcion;
    frm.precio.value= precio;
    frm.puertas.value= puertas;
    frm.kms.value = kms;
    frm.potencia.value = potencia;
   document.getElementById("btnSubmit").value = "Modificar";
   document.getElementById("btnEliminar").classList.remove("oculto");

}