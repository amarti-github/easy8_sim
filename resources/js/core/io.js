/*=====================================================
 INPUT/OUTPUT
 */

export const IODevices = {
  KEYBOARD: 0,
  DISPLAY: 1,
  K_BUTTON: 2,
  TEMPERATURE_SENSOR: 6,
  SWITCHES: 8,
  LEDS: 9,
  BUTTON: 170,
};

export default class IO {

  constructor(setFunction) {
    this.set = setFunction ? setFunction : function (array, index, value) {
      array[index] = value;
    };

    this.ports = Array(256).fill(0);
    this.onUpdateCallback = null;
  }

  clean() {
    for (var i = 0; i < this.ports.length; i++) {
      this.set(this.ports, i, 0);
    }
  }

  readPort(port) {
    var value = this.ports[port];

    // Las especificaciones del simulador requieren que, al leer el
    // puerto el botón rojo, se resetee su valor.
    if (port == IODevices.K_BUTTON) {
      this.writePort(IODevices.K_BUTTON, 0);
    }

    return value;
  }

  writePort(port, value) {
    this.set(this.ports, port, value);
    this.onUpdateCallback && this.onUpdateCallback(this, port, value);
  }

  getData() {
    return this.ports;
  }

  onUpdate(callback) {
    this.onUpdateCallback = callback;
  }

}
