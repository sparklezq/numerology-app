export function saveCalculations(calculations) {
    localStorage.setItem('numerologyCalcs', JSON.stringify(calculations));
  }
  
  export function loadCalculations() {
    return JSON.parse(localStorage.getItem('numerologyCalcs')) || [];
  }
  
  export function clearCalculations() {
    localStorage.removeItem('numerologyCalcs');
  }