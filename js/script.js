
import Anuncio,{Anuncio_Auto} from "./anuncio.js";

let data = [];
window.addEventListener("DOMContentLoaded",()=>{
    document.forms[0].addEventListener("submit",handlerSubmit);
    document.addEventListener("click", handlerClick);
    getElement("todos");
    aplicarFiltrosColumnasTabla();
});

function limpiarFormulario(frm){
    frm.reset();
    document.getElementById("btnEliminar").classList.add("oculto");
    document.getElementById("btnSubmit").value = "Agregar";
    document.forms[0].id.value = "";
}

function handlerSubmit(e){
    e.preventDefault();
    const frm =e.target;
    if(frm.id.value){
        const modificar = new Anuncio_Auto(parseInt(frm.id.value),frm.titulo.value, frm.transaccion.value,frm.descripcion.value,frm.precio.value, frm.puertas.value, frm.kms.value,frm.potencia.value);
        if(confirm("Comfirma Modificacion?")){
            agregarSpinner();
            setTimeout(()=>{
                updateAnuncio(modificar);
                 eliminarSpinner();
             }, 2000);
        }  
    }else{
        
        const auto = new Anuncio_Auto(Date.now(),frm.titulo.value, frm.transaccion.value,frm.descripcion.value,frm.precio.value, frm.puertas.value, frm.kms.value,frm.potencia.value);
        agregarSpinner();
        setTimeout(()=>{
            altaElemen(auto);
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

function renderizarLista(lista, contenedor){

    while(contenedor.hasChildNodes()){
        contenedor.removeChild(contenedor.firstChild);
    }
    if(lista){
        contenedor.appendChild(lista);
    }
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
         if(key !== "id" && key !== "activo"){
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
                }else if(key !== "activo"){
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
                deleteElemento(id);
                almacenarDatos(data);
                eliminarSpinner();
             }, 2000);
        }
        
        limpiarFormulario(document.forms[0]);
    }else if(e.target.matches("#btnCancelar")){
        if(confirm ("seguro quiere cancelar?")){
            limpiarFormulario(document.forms[0]);
        }
    }else if(e.target.matches("#btnTodos")){
        getElement("todos");
    }else if(e.target.matches("#btnVenta")){
        getElement("venta");
    }else if(e.target.matches("#btnAlquiler")){
        getElement("alquiler");
    }
}


function cargarFomulario(id){

    const {titulo,transaccion,descripcion,precio,puertas,kms,potencia} = data.filter(p => p.id === parseInt(id))[0];
    const frm = document.forms[0];

    frm.id.value =  id;
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

function getElement(type){
    const frm = document.forms[1];
    const xhr = new XMLHttpRequest();
    agregarSpinner();
    xhr.onreadystatechange = ()=>{
        if(xhr.readyState == 4){
            if(xhr.status >= 200 && xhr.status < 299){
               data =  JSON.parse(xhr.responseText);
                let tipos = filtrar(data,type);
                let prom = promedio (tipos)
                renderizarLista(crearTabla(tipos), document.getElementById("divLista"));
                frm.promedio.value = prom;
            }
            else{
                const estado =  xhr.statusText || "Ocurrio un error";
                console.error(`Error: ${xhr.status} : ${estado}`);
            }
            
            eliminarSpinner();
        }
    };
    xhr.open("GET","http://localhost:3000/anuncio" );
    xhr.send();
}
function filtrar(dato , tipo){

    let arrayFiltrado = [];
    if(tipo == "venta" || tipo == "alquiler"){
        return arrayFiltrado =  dato.filter((x)=> x.transaccion == tipo);
    }
    return dato;
} 

const altaElemen = (objeto) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        if (xhr.status >= 200 && xhr.status < 299) {
          data = JSON.parse(xhr.responseText);
        } else {
          const statusText = xhr.statusText || "Ocurrio un error";
          console.error(`Error: ${xhr.status} : ${statusText}`);
        }
      }
    };
    xhr.open("POST", "http://localhost:3000/anuncio");
    xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
    xhr.send(JSON.stringify(objeto));
  };

    const deleteElemento = (id) => {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
        if (xhr.readyState == 4) {
            if (xhr.status >= 200 && xhr.status < 299) {
            data = JSON.parse(xhr.responseText);
            } else {
            const statusText = xhr.statusText || "Ocurrio un error";
            console.error(`Error: ${xhr.status} : ${statusText}`);
            }
        }
    };
    xhr.open("DELETE", `http://localhost:3000/anuncio/${id}`);
    xhr.send();
  };

  const updateAnuncio = (objeto) => {
        let id = objeto.id;
        console.log(id);
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
        if (xhr.readyState == 4) {
            if (xhr.status >= 200 && xhr.status < 299) {
            data = JSON.parse(xhr.responseText);
            } else {
            const statusText = xhr.statusText || "Ocurrio un error";
            console.error(`Error: ${xhr.status} : ${statusText}`);
            }
        }
        };
        xhr.open("PUT", `http://localhost:3000/anuncio/${id}`);
        xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
        xhr.send(JSON.stringify(objeto));
  };
  
 function promedio (array){
    let resultado;
    const sumatoria = array.reduce(function(acumulador, siguienteValor){
        return {
          precio: parseInt(acumulador.precio) + parseInt(siguienteValor.precio)
        };
      }, {precio: 0});
    resultado = sumatoria.precio / array.length;
    return resultado;
    
}

