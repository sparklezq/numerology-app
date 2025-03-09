import { useState } from 'react';
import { calculateName } from '../utils/nameCalc.js';
import { calculateDate } from '../utils/dateCalc.js';
import styles from './Form.module.css';

export default function Form({ onSubmit }) {
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date().toLocaleDateString('en-GB'));
  const [useToday, setUseToday] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const nameResult = calculateName(name);
      const dateResult =
        birthdate && currentDate && !useToday
          ? calculateDate(name, birthdate, currentDate)
          : birthdate
          ? calculateDate(name, birthdate, new Date().toLocaleDateString('en-GB'))
          : {};
      onSubmit({ ...nameResult, ...dateResult });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        required
      />
      <input
        className={styles.input}
        value={birthdate}
        onChange={(e) => setBirthdate(e.target.value)}
        placeholder="DD/MM/YYYY"
      />
      <label>
        Use Today
        <div className="toggle-switch">
          <input
            type="checkbox"
            checked={useToday}
            onChange={() => setUseToday(!useToday)}
          />
          <span className="toggle-slider"></span>
        </div>
      </label>
      {!useToday && (
        <input
          className={styles.input}
          value={currentDate}
          onChange={(e) => setCurrentDate(e.target.value)}
          placeholder="DD/MM/YYYY"
        />
      )}
      <button className={styles.submitButton} type="submit">Calculate</button>
    </form>
  );
}