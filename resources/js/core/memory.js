/*=====================================================
 MEMORIA PRINCIPAL
 Contiene un array 'bytes' con el contenido de la memoria.
 Los datos se almacenan en formato decimal.
 La clase tiene un puntero llamado "assemblyPointer" hacia
 una posición de memoria que determina en qué posición
 guardar el siguiente byte de código durante el ensamblado.
 La memoria recibe como parámetro:
 -Los registros. Los necesita para acceder al contador de programa (PC).
 -Tamaño de la memoria (opcional). Por defecto es 256.
 */

export default class Memory {
  constructor(setFunction) {
    this.set = setFunction ? setFunction : function (array, index, value) {
      array[index] = value;
    };

    /*this.size = memArray.length;*/
    this.size = 256;
    this.bytes = Array(this.size).fill(0);
    this.metadata = Array(this.size).fill("");

    this.clean();
  }

  //Reinicia la memoria.
  clean() {
    for (var i = 0; i < this.size; i++) {
      this.set(this.bytes, i, 0);
      this.set(this.metadata, i, "");
    }
  }

  //Escribir un valor en una dirección.
  writeAddress(address, value) {
    this.set(this.bytes, address, value);
    if (this.onUpdateCallback) this.onUpdateCallback(this, address, value);
  }

  writeMetadata(address, value) {
    this.set(this.metadata, address, value);
  }

  //Leer un valor de una dirección.
  readAddress(address) {
    return this.bytes[address];
  }

  print() {
    console.log(this.bytes);
  }

  onUpdate(func) {
    this.onUpdateCallback = func;
  }

  getSize() {
    return this.size;
  }

  getData() {
    return this.bytes;
  }

  getMetadata() {
    return this.metadata;
  }
}

