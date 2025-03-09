import { useState, useEffect } from 'react';
import styles from './ProtectionLayer.module.css';
import { calculateDate } from '../utils/dateCalc';
import { calculateCycleDay } from '../utils/dateCalc';

export default function ProtectionLayer({ onPass, isDev }) {
  const [attempts, setAttempts] = useState(0);
  const [answer, setAnswer] = useState('');
  const [testData, setTestData] = useState(null);
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (isDev) {
      onPass();
      return;
    }
    generateTest();
  }, [isDev]);

  const generateTest = () => {
    // Generate random dates for cycle month
    const randomBirthYear = Math.floor(Math.random() * (2010 - 1950) + 1950);
    const randomCurrentYear = Math.floor(Math.random() * (2025 - 2015) + 2015);
    
    const birthdate = `${padZero(Math.floor(Math.random() * 28) + 1)}/${padZero(Math.floor(Math.random() * 12) + 1)}/${randomBirthYear}`;
    const currentDate = `${padZero(Math.floor(Math.random() * 28) + 1)}/${padZero(Math.floor(Math.random() * 12) + 1)}/${randomCurrentYear}`;
    
    const result = calculateDate('Test', birthdate, currentDate);
    
    // Generate random day for cycle day question
    const randomDay = Math.floor(Math.random() * 28) + 1;
    const [x, y] = result.cycleMonth.split('-');
    const cycleDayResult = calculateCycleDay(result.cycleMonth, randomDay);

    setTestData({
      birthdate,
      currentDate,
      randomDay,
      cycleMonth: result.cycleMonth,
      expected: step === 1 ? result.cycleMonth : cycleDayResult
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (answer.toLowerCase().replace(/\s/g, '') === testData.expected.toLowerCase().replace(/\s/g, '')) {
      if (step === 1) {
        // Move to cycle day question
        setStep(2);
        setAnswer('');
        generateTest();
      } else {
        // Passed both questions
        onPass();
      }
    } else {
      setAttempts(prev => prev + 1);
      if (attempts >= 2) {
        // Reset after 3 failed attempts
        setAttempts(0);
        setStep(1);
        setAnswer('');
        generateTest();
      }
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
            {step === 1 ? (
              <>
                <p>Calculate cycle month for:</p>
                <p>Birthdate: {testData.birthdate}</p>
                <p>Current date: {testData.currentDate}</p>
                <p>Format answer as: x-y</p>
                <p className={styles.small}>Example: 9-4</p>
              </>
            ) : (
              <>
                <p>For cycle month {testData.cycleMonth},</p>
                <p>what is the cycle day on day {testData.randomDay}?</p>
                <p>Format answer as: a-b</p>
                <p className={styles.small}>Example: 1-1</p>
              </>
            )}
            <p className={styles.attempts}>Attempts remaining: {3 - attempts}</p>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={step === 1 ? "Example: 9-4" : "Example: 1-1"}
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