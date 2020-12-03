// Funciones para facilitar el trabajo con el stack de la memoria del Easy8.

import ALU from './alu';

export default {
  push(memory, stackPointer, value) {
    var res = ALU.sum(stackPointer, -1, 8);
    stackPointer = res.result;
    memory.writeAddress(stackPointer, value);
    return stackPointer;
  },

  pop(memory, stackPointer) {
    var top = memory.readAddress(stackPointer);

    if (stackPointer < memory.size - 1) {
      stackPointer++;
    }
    else {
      stackPointer = 0;
    }

    return { top: top, stackPointer: stackPointer };
  },
}