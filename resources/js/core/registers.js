/*=====================================================
 REGISTROS
 -RA: contenido del registro contador.
 -PC: contador de programa.
 -SP: puntero de pila.
 -RET: dirección previa a la de retorno.
 -Z: si, tras una operación, RA es cero, Z = 1.
 -C: guarda el acarreo de la última operación.
 -N: si, tras una operación, RA es negativo, N = 1.
 */

import ALU from './alu';

export default class Registers {
  constructor() {
    this.onUpdateCallback = null;
    this.regs = {
      ra: 0,
      ret: 0,
      pc: 0,
      sp: 0,
      // FLAGS
      z: 0, // Zero
      c: 0, // Carry
      n: 0, // Negative
      v: 0, // Overflow
      nv: 0, // N xor V
    };
  }

  getData() {
    return this.regs;
  }

  reset() {
    for (var reg in this.regs) {
      this.regs[reg] = 0;
    }
  }

  get(reg) {
    return this.regs[reg.toLowerCase()];
  }
  
  set(reg, value) {
    this.regs[reg.toLowerCase()] = value;
    console.log(reg, value);
    if (this.onUpdateCallback) {
      console.log('port');
      this.onUpdateCallback(reg, value);
    }
  }
  
  incr(reg, value) {
    if (value == undefined) value = 1;
    var newValue = ALU.sum(this.get(reg), value, 8);
    this.set(reg, newValue.result);
  }
  
  decr(reg, value) {
    if (value == undefined) value = 1;
    this.incr(reg, -value);
  }

  incrUpdatingFlags(reg, value) {
    if (value == undefined) value = 1;
    var newValue = ALU.sumUpdatingFlags(this.get(reg), value, 8, this);
    this.set(reg, newValue.result);
  }

  decrUpdatingFlags(reg, value) {
    if (value == undefined) value = 1;
    this.incrUpdatingFlags(reg, -value);
  }
  
  updateZero(reg) {
    if ('ra' === reg.toLowerCase()) {
      if (this.get('RA') === 0) {
        this.set('Z', 1);
      }
      else {
        this.set('Z', 0);
      }
    }
  };
  
  updateCarry(reg, carry) {
    if ('ra' === reg.toLowerCase()) {
      this.set('C', carry);
    }
  }
  
  updateNegative(reg) {
    if ('ra' === reg.toLowerCase()) {
      this.set('N', ALU.isNegative(this.get('RA'), 8) ? 1 : 0);
    }
  }

  updateOverflow(reg, operand1, operand2, result, bits) {
    if ('ra' == reg.toLowerCase()) {
      this.set('V', ALU.overflowed(operand1, operand2, result, bits) ? 1 : 0);
    }
  }
  
  print() {
    console.log('RA: ' + this.get('RA'));
  }
  
  toString() {
    var str = '';
    str = str.concat('RA\t' + ALU.ca2ToInt(this.get('RA'), 8) + '\n');
    str = str.concat('PC\t' + this.get('PC') + '\n');
    str = str.concat('SP\t' + this.get('SP') + '\n');
    str = str.concat('Z\t' + this.get('Z') + '\n');
    str = str.concat('C\t' + this.get('C') + '\n');
    str = str.concat('N\t' + this.get('N') + '\n');
    return str;
  }
  
  onUpdate(func) {
    this.onUpdateCallback = func;
  }

}
