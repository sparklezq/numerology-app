export default function History({ calculations, onClear }) {
  return (
    <div>
      <h2>Calculation History</h2>
      <button onClick={onClear}>Clear History</button>
      <ul>
        {calculations.map((calc, i) => (
          <li key={i}>
            {calc.name} - {calc.birthdate || 'No birthdate'} -{' '}
            {calc.currentDate || 'No current date'}
          </li>
        ))}
      </ul>
    </div>
  );
}