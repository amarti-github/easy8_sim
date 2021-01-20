/*=====================================================
 ALU
 Conjunto de funciones matemáticas.
 */

export default class ALU {
  static hexCa2ToInt(hex, bits) {
    var integer = parseInt(hex, 16); // 256 | 2
    return ca2ToInt(integer, bits);

  };

  static ca2ToInt(number, bits) {
    //Si el último bit es 1 significa que el número es negativo.
    if ((number & (1 << (bits - 1))) > 0) {
      number--;
      //Generar máscara para calcular el Ca1.
      var mask = 1;
      for (var i = 0; i < bits - 1; i++) {
        mask = (mask << 1) | 1;
      }
      return - (number ^ mask);
    }
    return number;
  }

  /**
   * Devuelve la suma de dos números enteros.
   * @param n1 Número 1.
   * @param n2 Número 2.
   * @param bits Número de bits usados para codificar el número.
   * @returns {{result: number, carry: number}}
   */
  static sum(n1, n2, bits) {
    //Crear máscara para leer el bit más a la derecha.
    var carry = 0;
    var carry_ant = 0;
    var resultI = 0;

    for (var i = 0; i < bits; i++) {
      var b1 = n1 & 1;
      var b2 = n2 & 1;
      n1 = n1 >> 1;
      n2 = n2 >> 1;

      var s = this.bitSum(b1, b2, carry);
      resultI = (resultI << 1) | s.result;
      carry = s.carry;
      if ( i == (bits-2)) {carry_ant = carry;}
    }

    var result = 0;

    //resultI guarda el resultado en orden inverso. Aquí
    //se invierte para que esté correctamente.
    for (var i = 0; i < bits; i++) {
      result = (result << 1) | (resultI & 1);
      resultI = resultI >> 1;
    }

    return {result: result, carry: carry, carry_ant: carry_ant};

  };


   static resta(n1, n2, bits) { //n1 + Ca1(n2) + 1
    //Crear máscara para leer el bit más a la derecha.
    var carry = 1;
    var carry_ant = 0;
    var resultI = 0;

	n2 = ~n2;

    for (var i = 0; i < bits; i++) {
      var b1 = n1 & 1;
      var b2 = n2 & 1;
      n1 = n1 >> 1;
      n2 = n2 >> 1;

      var s = this.bitSum(b1, b2, carry);
      resultI = (resultI << 1) | s.result;
      carry = s.carry;
      if ( i == (bits-2)) {carry_ant = carry;}
    }

    var result = 0;

    //resultI guarda el resultado en orden inverso. Aquí
    //se invierte para que esté correctamente.
    for (var i = 0; i < bits; i++) {
      result = (result << 1) | (resultI & 1);
      resultI = resultI >> 1;
    }

    //return {result: result, carry: carry, carry_ant: carry_ant};
    return {result: result, carry: carry, carry_ant: carry_ant};

  };

 static actualitza_flags (result, carry, carry_ant, bits, registers)
  {
    registers.set('Z', result === 0 ? 1 : 0);
    registers.set('N', ALU.isNegative(result, 8) ? 1 : 0);
    registers.set('C', carry);
    registers.set('V', carry ^ carry_ant);
    registers.set('NV', registers.get('N') ^ registers.get('V'));
  }


  static sumUpdatingFlags(n1, n2, bits, registers) {
    var res = this.sum(n1, n2, bits);
    this.actualitza_flags (res.result, res.carry, res.carry_ant, bits, registers);
    return res;
  }


    static decrUpdatingFlags(n1, n2, bits, registers) {
    var res = this.resta(n1, n2, bits);
    this.actualitza_flags (res.result, res.carry, res.carry_ant, bits, registers);
    return res;
  }

  /**
   * Suma de dos bits.
   * @param b1 Bit 1.
   * @param b2 Bit 2.
   * @param carry
   * @returns {{result: number, carry: number}}
   */
  static bitSum(b1, b2, carry) {
    var xor = b1 ^ b2;
    var and = b1 & b2;

    var sum = xor ^ carry;
    var and2 = xor & carry;

    var carry_out = and | and2;

    return {
      result: sum, carry: carry_out
    };
  };

  static isNegative(number, bits) {
    var mask = 1 << (bits - 1);
    return (number != 0) && ((mask & number) > 0);
  };



}


