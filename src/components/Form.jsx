import { useState } from 'react';
import { calculateName } from '../utils/nameCalc';
import { calculateDate } from '../utils/dateCalc';
import styles from './Form.module.css';

export default function Form({ onSubmit, activeTab }) {
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [useToday, setUseToday] = useState(true);
  const [results, setResults] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted', { name, birthdate, currentDate, useToday });

    if (activeTab === 'name' && name) {
      try {
        const nameResult = calculateName(name);
        console.log('Name result:', nameResult);
        onSubmit(nameResult);
      } catch (error) {
        console.error('Name calculation error:', error);
      }
    } else if (activeTab === 'date' && birthdate) {
      try {
        const refDate = useToday 
          ? new Date().toLocaleDateString('en-GB').split('/').join('/')  // DD/MM/YYYY
          : currentDate;
        
        const dateResult = calculateDate(name, birthdate, refDate);
        console.log('Date result:', dateResult);
        onSubmit(dateResult);
      } catch (error) {
        console.error('Date calculation error:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter name"
        className={styles.input}
      />
      {activeTab === 'date' && (
        <div className={styles.dateInputs}>
          <div className={styles.dateWrapper}>
            <input
              type="text"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              placeholder="BirthDate dd/mm/yyyy"
              className={styles.input}
              pattern="\d{2}/\d{2}/\d{4}"
              title="Enter date as dd/mm/yyyy"
            />
            <input
              type="date"
              onChange={(e) => {
                const [y, m, d] = e.target.value.split('-');
                setBirthdate(`${d}/${m}/${y}`);
              }}
              className={styles.calendarInput}
            />
          </div>
          {!useToday && (
            <div className={styles.dateWrapper}>
              <input
                type="text"
                value={currentDate}
                onChange={(e) => setCurrentDate(e.target.value)}
                placeholder="DD/MM/YYYY"
                className={styles.input}
                pattern="\d{2}/\d{2}/\d{4}"
                title="Enter date as DD/MM/YYYY"
              />
              <input
                type="date"
                onChange={(e) => {
                  const [y, m, d] = e.target.value.split('-');
                  setCurrentDate(`${d}/${m}/${y}`);
                }}
                className={styles.calendarInput}
              />
            </div>
          )}
          <label className={styles.toggleLabel}>
            Use Today
            <input
              type="checkbox"
              checked={useToday}
              onChange={() => setUseToday(!useToday)}
              className={styles.toggleInput}
            />
            <span className={styles.toggleSlider}></span>
          </label>
        </div>
      )}
      <button type="submit" className={styles.submitButton}>
        Calculate
      </button>
    </form>
  );
}