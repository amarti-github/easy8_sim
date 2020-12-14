/*=====================================================
 SET DE INSTRUCCIONES
 El siguiente array almacena el juego de instrucciones del Easy8
 junto con información sobre la instrucción:
 -mnemonic: código mnemotécnico de la instrucción.
 -code: código (decimal) que se usará para el ensamblado.
 -assembly: función que se ejecutará cuando se esté ensamblado
 la instrucción. La función recibe los siguientes parámetros:
 -memory: la memoria principal donde se escribirá la función.
 -params: array con los parámetros de la instrucción.
 -environtment: instancia del RuntimeEnvirontment.
 La función assembly deberá comprobar que los parámetros
 tienen el formato correcto. Si es así, deberá devolver
 true. Si no, devolverá false.
 La función assembly debe escribir en la memoria la
 codificación de la instrucción junto con los parámetros,
 si los tiene.
 -run: la función de ejecución de la instrucción. Recibe como
 parámetros:
 -memory: memoria principal.
 -registers: registros.
 -io: instancia de IO.
 -environment: instancia del entorno de ejecución.
 Si la función devuelve true se terminará la ejecución del programa,
 como haría la instrucción STOP.
 Si la función devuelve false o no devuelve nada, la ejecución
 sigue su curso.
 */

import assemblyRules from './assembly-rules';
import ALU from './alu';
import stack from './stack';

export default [
  /*CODIFICADOS EN UN BYTE*/
  {
    mnemonic: 'STOP',
    code: 21,
    assembly: assemblyRules.oneByteAssembly,
    run: function () {
      return true; //Fin de la ejecución.
    }
  },
  {
    mnemonic: 'INC',
    code: 7,
    assembly: assemblyRules.oneByteAssembly,
    run: function (memory, registers) {
      registers.incrUpdatingFlags('RA', 1);
    }
  },
  {
    mnemonic: 'DEC',
    code: 8,
    assembly: assemblyRules.oneByteAssembly,
    run: function (memory, registers) {
      registers.decrUpdatingFlags('RA', 1);
    }
  },
  {
    mnemonic: 'PUSH',
    code: 15,
    assembly: assemblyRules.oneByteAssembly,
    run: function (memory, registers) {
      var newStackPointer = stack.push(memory, registers.get('SP'), registers.get('RA'));
      registers.set('SP', newStackPointer);
    }
  },
  {
    mnemonic: 'POP',
    code: 16,
    assembly: assemblyRules.oneByteAssembly,
    run: function (memory, registers) {
      var res = stack.pop(memory, registers.get('SP'));
      registers.set('SP', res.stackPointer);
      registers.set('RA', res.top);
    }
  },
  {
    mnemonic: 'RET',
    code: 18,
    assembly: assemblyRules.oneByteAssembly,
    run: function (memory, registers) {
      var res = stack.pop(memory, registers.get('SP'));
      registers.set('SP', res.stackPointer);

      // res.top apunta a la siguiente instrucción a ejecutar.
      // Sin embargo, hay que tener en cuenta que el entorno de
      // ejecución le suma +1 al PC justo después de ejecutar .run(),
      // por eso se le resta 1.
      registers.set('PC', res.top - 1);
    }
  },
  /*CODIFICADOS EN DOS BYTES*/
  {
    mnemonic: 'MOVEI',
    code: 0,
    assembly: assemblyRules.raValueAssembly,
    run: function (memory, registers, io, environment) {
      registers.set('RA', environment.nextByte());
    }
  },
  {
    mnemonic: 'MOVE',
    code: 1,
    assembly: assemblyRules.moveAssembly,
    run: function (memory, registers, io, environment) {
      var addr = environment.nextByte();
      registers.set('RA', memory.readAddress(addr));
    }
  },
  {
    mnemonic: 'MOVE',
    code: 2,
    assembly: assemblyRules.moveAssembly,
    run: function (memory, registers, io, environment) {
      var v = environment.nextByte();
      memory.writeAddress(v, registers.get('RA'));
    }
  },
  {
    mnemonic: 'ADDI',
    code: 3,
    assembly: assemblyRules.raValueAssembly,
    run: function (memory, registers, io, environment) {
      registers.incrUpdatingFlags('RA', environment.nextByte());
    }
  },
  {
    mnemonic: 'ADD',
    code: 4,
    assembly: assemblyRules.raValueAssembly,
    run: function (memory, registers, io, environment) {
      var addr = environment.nextByte();
      registers.incrUpdatingFlags('RA', memory.readAddress(addr));
    }
  },
  {
    mnemonic: 'SUBI',
    code: 5,
    assembly: assemblyRules.raValueAssembly,
    run: function (memory, registers, io, environment) {
      registers.decrUpdatingFlags('RA', environment.nextByte());
    }
  },
  {
    mnemonic: 'SUB',
    code: 6,
    assembly: assemblyRules.raValueAssembly,
    run: function (memory, registers, io, environment) {
      var addr = environment.nextByte();
      registers.decrUpdatingFlags('RA', memory.readAddress(addr));
    }
  },
  {
    mnemonic: 'COMPAREI',
    code: 9,
    assembly: assemblyRules.raValueAssembly,
    run: function (memory, registers, io, environment) {
      var val = environment.nextByte();
      ALU.decrUpdatingFlags(registers.get('RA'), val, 8, registers);
    }
  },
  {
    mnemonic: 'COMPARE',
    code: 10,
    assembly: assemblyRules.raValueAssembly,
    run: function (memory, registers, io, environment) {
      var val = memory.readAddress(environment.nextByte());
      ALU.decrUpdatingFlags(registers.get('RA'), val, 8, registers);
    }
  },
  {
    mnemonic: 'JUMP',
    code: 11,
    assembly: assemblyRules.valueDirAssembly,
    run: function (memory, registers, io, environment) {
      //environment.nextByte() desplaza el PC a la
      //siguiente posición y devuelve el contenido
      //de la memoria en ese punto. En este caso, esa posición
      //contiene la dirección objetivo del salto.
      var target = environment.nextByte();

      //Se establece el contador de programa
      //para que la siguiente instrucción a ejecutar
      //sea a la que apunta target. Hay que restar 1 porque
      //después de ejecutar esta función se pasa al siguiente byte.
      registers.set('PC', target - 1);

    }
  },
  {
    mnemonic: 'JLESS',
    code: 12,
    assembly: assemblyRules.valueDirAssembly,
    run: function (memory, registers, io, environment) {
      var target = environment.nextByte();

     // if ( (registers.get('N')) && (!registers.get('V'))){ //Si el resultado es negativo sin desbordamiento
     //   registers.set('PC', target - 1);
     // }
	 // if ( (!registers.get('N')) && (registers.get('V'))){ //Si el resultado es positivo pero hay desbordamiento
     //   registers.set('PC', target - 1);
	 // }
	 if  (registers.get('NV')) { //Flag NV es la or exclusiva de N y V
        registers.set('PC', target - 1);
      }
    } 
  },
  {
    mnemonic: 'JGREATER',
    code: 13,
    assembly: assemblyRules.valueDirAssembly,
    run: function (memory, registers, io, environment) {
      var target = environment.nextByte();

      if (!registers.get('NV') && !registers.get('Z')) { //Flag NV es la or exclusiva de N y V
        registers.set('PC', target - 1);
      }
    }
  },
  {
    mnemonic: 'JEQUAL',
    code: 14,
    assembly: assemblyRules.valueDirAssembly,
    run: function (memory, registers, io, environment) {
      var target = environment.nextByte();
      if ( (registers.get('Z') === 1) && (!registers.get('V'))) {
        registers.set('PC', target - 1);
      }
    }
  },
  {
    mnemonic: 'CALL',
    code: 17,
    assembly: assemblyRules.valueDirAssembly,
    run: function (memory, registers, io, environment) {
      var newStackPointer = stack.push(memory, registers.get('SP'), registers.get('PC') + 2)
      registers.set('SP', newStackPointer);

      //Se suma +2 para que la dir. de retorno apunte a
      //la dirección de la instrucción siguiente a CALL (CALL usa 2 bytes).
      var target = environment.nextByte() - 1;
      registers.set('PC', target);

    }
  },
  {
    mnemonic: 'IN',
    code: 19,
    assembly: assemblyRules.valueDirAssembly,
    run: function (memory, registers, io, runtimeEnvironment) {
      var port = runtimeEnvironment.nextByte();
      registers.set('RA', io.readPort(port));
    }
  },
  {
    mnemonic: 'OUT',
    code: 20,
    assembly: assemblyRules.valueDirAssembly,
    run: function (memory, registers, io, environment) {
      var port = environment.nextByte();
      io.writePort(port, registers.get('RA'));
    }
  },
  {
    mnemonic: 'SLEEP',
    code: 22,
    assembly: assemblyRules.valueDirAssembly,
    run: function (memory, registers, io, runtimeEnvironment) {
      var addr = runtimeEnvironment.nextByte();
      runtimeEnvironment.sleep(memory.readAddress(addr) * 1000);
    }
  },
  {
    mnemonic: 'SLEEPI',
    code: 23,
    assembly: assemblyRules.valueDirAssembly,
    run: function (memory, registers, io, runtimeEnvironment) {
      runtimeEnvironment.sleep(runtimeEnvironment.nextByte() * 1000);
    }
  },
  {
    mnemonic: 'RAND',
    code: 24,
    assembly: assemblyRules.oneByteAssembly,
    run: function (memory, registers) {
      registers.set('RA', Math.floor(Math.random() * 255) + 1);
    }
  },
  {
    mnemonic: 'BYTE',
    code: -1,
    assembly: function (assembler, params) {
      if (params[0] === undefined) return false;
      assembler.writeByte(parseInt(params[0], 16));
      return true;
    }
  },
  {
    mnemonic: 'LOAD_Z',
    code: 25,
    assembly: assemblyRules.oneByteAssembly,
    run: function (memory, registers) {
      registers.set('RA', registers.get('Z'));
    }
  },
  {
    mnemonic: 'LOAD_N',
    code: 26,
    assembly: assemblyRules.oneByteAssembly,
    run: function (memory, registers) {
      registers.set('RA', registers.get('N'));
    }
  },
  {
    mnemonic: 'LOAD_C',
    code: 27,
    assembly: assemblyRules.oneByteAssembly,
    run: function (memory, registers) {
      registers.set('RA', registers.get('C'));
    }
  },
  {
    mnemonic: 'LOAD_V',
    code: 28,
    assembly: assemblyRules.oneByteAssembly,
    run: function (memory, registers) {
      registers.set('RA', registers.get('V'));
    }
  },
  {
    mnemonic: 'LOAD_NV',
    code: 29,
    assembly: assemblyRules.oneByteAssembly,
    run: function (memory, registers) {
      registers.set('RA', registers.get('NV'));
    }
  },

];