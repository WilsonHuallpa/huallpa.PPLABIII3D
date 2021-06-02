export default class Anuncio{
    constructor(id,titulo,transaccion,descripcion,precio){
        this.id = id;
        this.titulo =  titulo;
        this.transaccion = transaccion;
        this.descripcion =  descripcion;
        this.precio = precio;
    }
}
export class Anuncio_Auto extends Anuncio{
    constructor(id,titulo,transaccion,descripcion,precio,puertas,kms,potencia){
        super(id,titulo,transaccion,descripcion,precio);
        this.puertas = puertas;
        this.kms = kms;
        this.potencia = potencia;
    }
}


