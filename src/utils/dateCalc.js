function reducedSum(num) {
    while (num > 9) num = num.toString().split('').reduce((a, b) => a + +b, 0);
    return num;
  }
  
  function isValidDate(day, month, year) {
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day;
  }
  
  function calculateMinor(age, day, month, year) {
    if (age <= 26) return reducedSum(month);
    else if (age <= 54) return reducedSum(day);
    else return reducedSum(year);
  }
  
  function calculateCycleMonth(cycleYear, currentMonth) {
    const startX = cycleYear;
    const startY = reducedSum(cycleYear * 2);
    const cycleMonths = {};
    let x = startX,
      y = startY;
    for (let i = 7; i <= 12; i++) {
      cycleMonths[i] = `${x}-${y}`;
      x = x === 9 ? 1 : x + 1;
      y = y === 9 ? 1 : y + 1;
      if (y >= 10) y = reducedSum(y);
    }
    x = startX;
    y = startY;
    for (let i = 6; i >= 1; i--) {
      x = x === 1 ? 9 : x - 1;
      y = y === 1 ? 9 : y - 1;
      if (y <= 0) y = reducedSum(y);
      cycleMonths[i] = `${x}-${y}`;
    }
    return cycleMonths[currentMonth];
  }
  
  function calculateCycleDay(cycleMonth, todayDay) {
    const [x] = cycleMonth.split('-').map(Number);
    const initialSum = todayDay + x;
    const reducedInitialSum = reducedSum(initialSum);
    const secondPart = reducedSum(reducedInitialSum + x);
    return `${reducedInitialSum}-${secondPart}`;
  }
  
  export function calculateDate(name, birthdate, currentDate) {
    const [bDay, bMonth, bYear] = birthdate.split('/').map(Number);
    const [cDay, cMonth, cYear] = currentDate.split('/').map(Number);
    
    if (!isValidDate(bDay, bMonth, bYear) || !isValidDate(cDay, cMonth, cYear))
      throw new Error('Invalid date');
    
    const birthDate = new Date(bYear, bMonth - 1, bDay);
    const currDate = new Date(cYear, cMonth - 1, cDay);
    
    if (currDate < birthDate) throw new Error('Current date must be >= birthdate');
    const age = cYear - bYear - (cMonth < bMonth || (cMonth === bMonth && cDay < bDay) ? 1 : 0);
    const birthpath = reducedSum(bDay + bMonth + bYear);
    const minor = calculateMinor(age, bDay, bMonth, bYear);
    const cycleAddon = reducedSum(bDay + bMonth);
    const cycleYear = reducedSum(cycleAddon + cYear + 1);
    const cycleMonth = calculateCycleMonth(cycleYear, cMonth);
    const cycleDay = calculateCycleDay(cycleMonth, cDay);
    
    return { name, birthdate, currentDate, age, birthpath, minor, cycleYear, cycleMonth, cycleDay };
  }

  