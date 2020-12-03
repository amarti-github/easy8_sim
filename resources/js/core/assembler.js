import { IODevices } from './io';

export default class Assembler {
  /**
   * @param memory La memoria donde se escribirá el programa ensamblado.
   * @param instructionSet Set de instrucciones.
   */
  constructor(memory, instructionSet) {
    this.memory = memory;
    this.instructionSet = instructionSet;

    this.assemblyPointer = 0;

    // tagsTable es un array asociativo en el que la clave es
    // una etiqueta y el valor es la dirección a la que apunta.
    this.tagsTable = this.getHelperTags();

    // unresolvedTags almacena cada una de las referencias que se
    // hace a una etiqueta. Cuando se termina el proceso de ensamblado,
    // que será cuando se conozca a qué dirección hace referencia cada
    // etiqueta, se revisan los usos de esas etiquetas en unresolvedTags
    // y se 'resuelve'.
    this.unresolvedTags = [];

    this.assembling = false;
  }

  setOnSyntaxError(callback) {
    this.onSyntaxError = callback;
  }

  writeByte(byte) {
    this.memory.writeAddress(this.assemblyPointer, byte);
    this.assemblyPointer++;
  }

  writeAddressOrTag(dirOrTag) {
    //La dirección que se quiere guardar en la memoria
    // puede se una dirección real o una etiqueta.

    if (this.isTag(dirOrTag)) {
      //Si es una etiqueta se añade a la lista de etiquetas
      //sin resolver. (Las etiquetas son resueltas más tarde).
      this.addUnresolvedTag(dirOrTag, this.assemblyPointer);

      //Como se desconoce la dirección de salto, se guarda un 0
      //de manera provisional.
      this.writeByte(0);
    }
    else {
      //Si es una dirección real tan sólo hay que
      //guardar la dirección.
      if (isNaN(dirOrTag)) return false;

      this.writeByte(parseInt(dirOrTag, 16));
    }

    return true;
  }

  /*Si, durante el ensamblado, alguna instrucción hace referencia
   * a una etiqueta, se almacena la etiqueta y en qué posición habría
   * que guardar la dirección a la que referencia.
   *
   * Tras el ensamblado, cuando ya se deberían conocer las direcciones
   * de todas las etiquetas, se inicia la etapa de resolución.
   * */
  addUnresolvedTag(tag, memoryAddress) {
    //Se almacena la etiqueta del tag sin resolver
    //y la dirección en memoria DONDE SE DEBERÁ ESCRIBIR LA DIRECCIÓN DEFINITIVA.
    this.unresolvedTags.push({tag: tag, address: memoryAddress});
  };

  isTag(token) {
    if (token[0] == '@') {
      return true;
    }
  }

  assembly(sourceCode) {
    this.assembling = true;

    // Posición de la memoria donde se va a escribir la instrucción:
    this.assemblyPointer = 0;

    var lines = sourceCode.split('\n');

    this.tagsTable = this.getHelperTags();
    this.unresolvedTags = [];

    //Reiniciar la memoria.
    this.memory.clean();

    this.memory.writeAddress(2, 10);
    //return;

    var success = true;

    for (var i = 0; i < lines.length; i++) {

      if (!lines[i]) {
        continue;
      }

      var tokens = this.parseLine(lines[i]);

      //tokens[0] debe contener el comentario si la línea es un comentario.
      //tokens[1] contiene el mnemotécnico.
      //tokens.param1 y tokens.param2 contendrán los parámetros, si procede.
      //token.tag contendrá la etiqueta.
      if (!tokens) {
        this.onSyntaxError &&
        this.onSyntaxError(lines[i], i);
        success = false;
        break;
      }

      //Si tokens.tag tiene algún valor significa que
      //hay una etiqueta y hay que almacenar
      //la dirección en la tabla de etiquetas que se usará posteriormente
      //en la etapa de resolución.
      if (tokens.tag) {
        this.tagsTable[tokens.tag] = this.assemblyPointer;
      }

      if (!tokens.mnemonic) {
        //Es un comentario o un blanco, se pasa a la siguiente línea.
        continue;
      }

      //Buscar las instrucciones que coinciden en el array instructionSet.
      //Generalmente solo habrá un resulado pero alguna instrucción
      //aparece dos veces.
      var instructions = this.getInstructionsByMnemonic(tokens.mnemonic);

      if (instructions.length === 0) {
        //No se ha encontrado la instrucción correspondiente a un
        //mnemotécnico. Probablemente está mal escrito.
        this.onSyntaxError &&
        this.onSyntaxError(lines[i], i);
        success = false;
        break;
      }

      var assemblyPointerBeforeWriting = this.assemblyPointer;

      var matchingInstruction = false;
      // Se recorre cada una de las instrucciones que han hecho matching y se
      // trata de ensamblar con cada una de ellas.
      for (var j = 0; j < instructions.length; j++) {
        if (instructions[j].assembly(this, [tokens.param1, tokens.param2])) {
          this.memory.writeMetadata(assemblyPointerBeforeWriting, lines[i]);
          matchingInstruction = true;
          break;
        }
      }

      if (!matchingInstruction) {
        this.onSyntaxError &&
        this.onSyntaxError(lines[i], i);
        success = false;
        break;
      }
    }

    //Etapa de resolución.
    if (!this.resolveTags()) {
      success = false;
    }

    if (!success) {
      this.memory.clean();
    }

    this.assembling = false;

    return success;
  }

  parseLine(line) {
    if (!line) return null;

    //La expresión regular comprueba que la instrucción tenga una de las
    //siguientes estructuras:
    //1. X Y Z  (P. ej.: MOVE RA, DIR)
    //2. X Y    (P. ej.: IN 01)
    //3. X      (P. ej.: STOP)
    //4. #COMENTARIO
    //5. [blancos]
    //Notar que la expresión regular se usa para comprobar la estructura
    //general de la instrucción y para tokenizarla. Sin embargo, los distintos
    //tokens no son validados. Ese trabajo se delega al método assembly de
    //la instrucción de turno.
    var results = line.match(/^(?:(?:\s*#.*)|(?:\s+)|(?:\s*(@\w+):\s*(?:#.*)?)|(?:\s*(?:(@\w+):)?\s*(\w+)(?:\s+(@?\w+)\s*(?:,\s*(@?\w+))?)?\s*(#.*)?))$/);

    if (!results) return null;

    return {
      tag: results[2] ? results[2] : results[1],
      mnemonic: results[3],
      param1: results[4],
      param2: results[5]
    };

  }

  /*
   * La etapa de resolución se inicia cuando se ha realizado el ensamblado.
   * En este punto ya, salvo que el programador cometa un error, ya se
   * conoce aqué dirección referencian todas las etiquetas.
   * Por tanto, aquí habrá que buscar todas las instrucciones que usaban
   * alguna etiqueta para reemplazarla por la dirección real en memoria.
   * */
  resolveTags() {
    console.log('resolve tags');
    console.log(this.tagsTable);
    for (var i = 0; i < this.unresolvedTags.length; i++) {
      // address contendrá la dirección a la que se referencia
      var address = this.tagsTable[this.unresolvedTags[i].tag];
      if (address === undefined) {
        this.onSyntaxError && this.onSyntaxError('Etiqueta ' + this.unresolvedTags[i].tag + ' no encontrada.', -1);
        return false;
      }

      //unresolvedTags[i].address es la dirección donde se
      //usó la etiqueta y donde habrá que escribir la dirección
      //definitiva.
      this.memory.writeAddress(this.unresolvedTags[i].address, address);

    }

    return true;
  }

  /*
   Devuelve las instrucciones que tienen como mnemotécnico
   el que se pasa por parámetro. Nota que devuelve un array
   porque puede haber varias instrucciones con el mismo
   mnemotécnico.
   */
  getInstructionsByMnemonic(mnemonic) {
    var resInstructions = [];

    for (var i = 0; i < this.instructionSet.length; i++) {
      if (this.instructionSet[i].mnemonic === mnemonic) {
        resInstructions.push(this.instructionSet[i]);
      }
    }

    return resInstructions;
  }

  isAssembling() {
    return this.assembling;
  }

  // Aunque los tags se supone que asocian una etiqueta con una
  // dirección de la memoria, resulta muy conveniente que se asocien
  // con puertos para que el usuario no tenga que conocer los puertos
  // donde están conectados los periféricos.
  getHelperTags() {
    return {
      '@__RED_BUTTON': IODevices.K_BUTTON,
      '@__GREEN_BUTTON': IODevices.BUTTON,
      '@__DISPLAY': IODevices.DISPLAY,
      '@__KEYBOARD': IODevices.KEYBOARD,
      '@__LEDS': IODevices.LEDS,
      '@__SWITCHES': IODevices.SWITCHES,
      '@__TEMPERATURE_SENSOR': IODevices.TEMPERATURE_SENSOR
    };
  }

}
