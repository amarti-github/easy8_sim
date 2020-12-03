/*=====================================================
 * SIMULADOR DE EJECUCIÓN
 *
 * */

import Registers from './registers';
import Memory from './memory';
import IO from './io';

export default class RuntimeEnvironment {
  constructor(config, instructionSet, setFunction) {
    this.instructionSet = instructionSet;
    this.registers = new Registers();
    this.memory = new Memory(setFunction);
    this.io = new IO(setFunction);

    this.int = null;
    this.running = false;
    this.sleeping = false;
    this.finished = false;

    this.callbacks = {};

  }

  getMemory() {
    return this.memory;
  }

  getRegisters() {
    return this.registers;
  }

  getIo() {
    return this.io;
  }

  setCallbacks(callbacks) {
    /*Callbacks posibles:
     *
     * onMemoryUpdate -> la memoria principal ha sido actualizada.
     * onRegisterUpdate -> un registro ha sido actualizado.
     * */
    this.callbacks = callbacks;

    console.log(callbacks);
  
    callbacks.onMemoryUpdate && this.memory.onUpdate(callbacks.onMemoryUpdate);
    callbacks.onRegisterUpdate && this.registers.onUpdate(callbacks.onRegisterUpdate);
    callbacks.onPortUpdate && this.io.onUpdate(callbacks.onPortUpdate);
  };

  run() {
    //Si se provoca la ejecución cuando ya estaba
    //ejecutándose el programa se reinicia el intervalo.
    if (this.int) {
      clearInterval(this.int);
    }
  
    this.running = true;
    this.sleeping = false;
  
    //this.resetRegisters();
  
    var self = this;
  
    this.int = setInterval(function () {

      if (self.running && !self.sleeping) {
        self.runStep();
      }
  
    }, 50);
  };
  
  runStep() {
    var byte = this.memory.readAddress(this.registers.get('PC'));
    console.log('PC: ' + this.registers.get('PC'));
  
    var instruction = this.getInstructionByCode(byte);
    console.log(instruction);
  
    if (!instruction) {
      console.log('Error de ejecución.');
      this.stop();
      //TODO RuntimeError.
    }
    else if (!instruction.run) {
      console.log('Sin implementación para: ');
      console.log(instruction);
      // TODO RuntimeError.
      this.stop();
    }
    else {
      if (instruction.run(this.memory, this.registers, this.io, this)) {
        this.stop();
        if (this.callbacks.onExecutionFinished) this.callbacks.onExecutionFinished();
      }
      else {
        //Cuando una instrucción detiene la ejecución se quiere
        //que el PC se mantenga en esa instrucción y no pase a
        //la siguiente.
        this.nextByte();
      }
    }
  };

  //Lee el contenido apuntado por el contador de programa.
  readByte() {
    return this.memory.readAddress([this.registers.get('PC')]);
  }

  //Mueve hacia adelante el contador de programa.
  //Devuelve el contenido de la memoria en ese punto.
  nextByte() {
    this.registers.incr('PC');
    return this.memory.readAddress([this.registers.get('PC')]);
  }
  
  resetRegisters() {
    //Reiniciar registros.
    this.registers.reset();
  }
  
  stop() {
    this.running = false;
    this.sleeping = false;
  
    clearInterval(this.int);
  };
  
  sleep(timeout) {
    this.sleeping = true;
  
    var self = this;
  
    if (timeout) {
      setTimeout(function () { self.wakeUp(); }, timeout);
    }
  };
  
  wakeUp() {
    if (!this.sleeping) return;
    this.sleeping = false;
  };

  isRunning() {
    return this.running;
  }

  /*
   AUXILIARES
   */


  getInstructionByCode(code) {
    for (var i = 0; i < this.instructionSet.length; i++) {
      if (code === this.instructionSet[i].code) {
        return this.instructionSet[i];
      }
    }
    return null;
  }

}