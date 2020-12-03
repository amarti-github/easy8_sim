import instructionSet from './core/instruction-set'

var keywords = instructionSet.map((instruction) => {
  return instruction.mnemonic;
}).join('|');

var regex = new RegExp("(?:" + keywords + ")",);

export default function () {
  return {
    token(stream, state) {
      if (stream.match(regex)) {
        return "keyword"
      }
      else if (stream.match(/@[a-zA-z0-9]+/)) {
        return "variable-2"
      }
      else if (stream.match(/#.*/)) {
        return "comment"
      }
      else {
        stream.next();
        return null
      }
    }
  }
}