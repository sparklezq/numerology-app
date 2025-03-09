function reducedSum(num) {
    while (num > 9) num = num.toString().split('').reduce((a, b) => a + +b, 0);
    return num;
  }
  
  function calcPart(part) {
    const hasVowels = /[aeiou]/i.test(part);
    let vowelSum = 0,
      consonantSum = 0;
    for (let char of part.toLowerCase()) {
      if (/[a-z]/i.test(char)) {
        const val = char.charCodeAt(0) - 96;
        const reduced = val > 9 ? reducedSum(val) : val;
        if (/[aeiou]/i.test(char) || (!hasVowels && char === 'y')) vowelSum += reduced;
        else consonantSum += reduced;
      } else if (/[0-9]/.test(char)) {
        consonantSum += +char;
      }
    }
    return {
      part,
      vowelNumber: reducedSum(vowelSum),
      consonantNumber: reducedSum(consonantSum),
      nameNumber: reducedSum(vowelSum + consonantSum),
    };
  }
  
  export function calculateName(name) {
    if (!name.trim()) return null;
    const parts = name.split(' ').filter((p) => p).map(calcPart);
    const combined = {
      vowelNumber: reducedSum(parts.reduce((sum, p) => sum + p.vowelNumber, 0)),
      consonantNumber: reducedSum(parts.reduce((sum, p) => sum + p.consonantNumber, 0)),
      nameNumber: reducedSum(parts.reduce((sum, p) => sum + p.nameNumber, 0)),
    };
    return { name, nameParts: parts, combined };
  }