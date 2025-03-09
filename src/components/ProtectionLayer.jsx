import { useState, useEffect } from 'react';
import styles from './ProtectionLayer.module.css';
import { calculateDate } from '../utils/dateCalc';

export default function ProtectionLayer({ onPass, isDev }) {
  const [attempts, setAttempts] = useState(0);
  const [answer, setAnswer] = useState('');
  const [testData, setTestData] = useState(null);

  useEffect(() => {
    if (isDev) {
      onPass();
      return;
    }
    
    generateTest();
  }, [isDev]);

  const generateTest = () => {
    // Generate random dates
    const randomBirthYear = Math.floor(Math.random() * (2010 - 1950) + 1950);
    const randomCurrentYear = Math.floor(Math.random() * (2025 - 2015) + 2015);
    
    const birthdate = `${padZero(Math.floor(Math.random() * 28) + 1)}/${padZero(Math.floor(Math.random() * 12) + 1)}/${randomBirthYear}`;
    const currentDate = `${padZero(Math.floor(Math.random() * 28) + 1)}/${padZero(Math.floor(Math.random() * 12) + 1)}/${randomCurrentYear}`;
    
    const result = calculateDate('Test', birthdate, currentDate);
    
    setTestData({
      birthdate,
      currentDate,
      expected: `${result.cycleMonth}, ${result.cycleDay}`
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAttempts(prev => prev + 1);
    
    if (answer.toLowerCase().replace(/\s/g, '') === testData.expected.toLowerCase().replace(/\s/g, '')) {
      onPass();
    } else if (attempts >= 2) {
      // Reset after 3 failed attempts
      setAttempts(0);
      generateTest();
      setAnswer('');
    }
  };

  const padZero = (num) => String(num).padStart(2, '0');

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <h2>Verification Required</h2>
        <p>Please solve this calculation to proceed:</p>
        {testData && (
          <div className={styles.question}>
            <p>Calculate cycle month and cycle day for:</p>
            <p>Birthdate: {testData.birthdate}</p>
            <p>Current date: {testData.currentDate}</p>
            <p>Format answer as: x-y, a-b</p>
            <p className={styles.small}>Example: 9-4, 1-1</p>
            <p className={styles.attempts}>Attempts remaining: {3 - attempts}</p>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Example: 9-4, 1-1"
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
} 