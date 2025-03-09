export const dailyCycles = {};
for (let x = 1; x <= 9; x++) {
  for (let y = 1; y <= 9; y++) {
    dailyCycles[`${x}-${y}`] = `Day ${x}-${y}: A description`;
  }
}

export const monthlyCycles = {};
for (let x = 1; x <= 9; x++) {
  for (let y = 1; y <= 9; y++) {
    monthlyCycles[`${x}-${y}`] = `Month ${x}-${y}: A description`;
  }
}

export const yearlyCycles = {};
for (let x = 1; x <= 9; x++) {
  yearlyCycles[x] = `Year ${x}: A description`;
}