import { useState, useEffect } from 'react';
import Form from './components/Form.jsx';
import Dashboard from './components/Dashboard.jsx';
import { loadCalculations, saveCalculations } from './utils/storage.js';
import styles from './App.module.css';
import ProtectionLayer from './components/ProtectionLayer.jsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('name');
  const [calculations, setCalculations] = useState([]);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [isProtectionPassed, setIsProtectionPassed] = useState(() => {
    return localStorage.getItem('protectionPassed') !== 'false'; // Default to true unless explicitly set to false
  });
  const [isDev, setIsDev] = useState(() => {
    return localStorage.getItem('devMode') === 'true';
  });
  const [tapCount, setTapCount] = useState(0);
  const [lastTap, setLastTap] = useState(0);

  // Add keyboard shortcut for dev mode toggle (Ctrl + Alt + D)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.altKey && e.key === 'd') {
        setIsDev(prev => {
          const newValue = !prev;
          localStorage.setItem('devMode', newValue);
          return newValue;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    setCalculations(loadCalculations());
  }, []);

  const handleSubmit = (result) => {
    const isDateCalc = 'birthdate' in result;
    
    // Keep existing calculations of the other type
    const existingOtherTypeCalcs = isDateCalc 
      ? calculations.filter(calc => !('birthdate' in calc))
      : calculations.filter(calc => 'birthdate' in calc);

    // Keep existing calculations of the same type, excluding the newest one
    const existingSameTypeCalcs = isDateCalc 
      ? calculations.filter(calc => 'birthdate' in calc)
      : calculations.filter(calc => !('birthdate' in calc));

    const newCalcs = [
      { ...result, confirmDelete: false },
      ...existingSameTypeCalcs,
      ...existingOtherTypeCalcs  // Keep the other type's calculations
    ];
    
    setCalculations(newCalcs);
    saveCalculations(newCalcs);
  };

  const handleDelete = (index) => {
    setCalculations((prev) => {
      const newCalculations = [...prev];
      if (newCalculations[index].confirmDelete) {
        newCalculations.splice(index, 1);
      } else {
        newCalculations[index].confirmDelete = true;
      }
      saveCalculations(newCalculations);
      return newCalculations;
    });
  };

  const handleClear = () => {
    setShowClearModal(true);
  };

  const confirmClear = () => {
    setCalculations([]);
    saveCalculations([]);
    setShowClearModal(false);
  };

  const nameColumns = [
    {
      key: 'nameParts',
      label: 'Parts',
      render: (item) =>
        item.nameParts
          ? item.nameParts.map((p, i) => (
              <div key={i} className={styles.cardLine}>
                <span className={styles.bold}>{p.part}</span>: {p.vowelNumber}-{p.consonantNumber}-{p.nameNumber}
              </div>
            ))
          : 'N/A',
    },
    {
      key: 'combined',
      label: 'Combined',
      render: (item) =>
        item.combined ? (
          <div className={styles.cardLine}>
            <span className={styles.bold}>Total</span>: {item.combined.vowelNumber}-{item.combined.consonantNumber}-{item.combined.nameNumber}
          </div>
        ) : 'N/A',
      isLast: true,
    },
  ];

  const dateColumns = [
    { key: 'name', label: 'Name' },
    { key: 'birthdate', label: 'Birthdate' },
    { key: 'currentDate', label: 'Reference Date' },
    { key: 'age', label: 'Age' },
    { key: 'birthpath', label: 'Birthpath' },
    { key: 'minor', label: 'Minor' },
    { key: 'cycleYear', label: 'Cycle Year' },
    { key: 'cycleMonth', label: 'Cycle Month' },
    { key: 'cycleDay', label: 'Cycle Day', isLast: true },
  ];

  const handleProtectionPass = () => {
    setIsProtectionPassed(true);
    localStorage.setItem('protectionPassed', 'true');
  };

  const toggleDevMode = () => {
    localStorage.setItem('devMode', 'true');
    setIsDev(true);
  };

  const handleTitleTap = () => {
    const now = Date.now();
    if (now - lastTap > 500) { // Reset if more than 500ms between taps
      setTapCount(1);
    } else {
      setTapCount(prev => prev + 1);
      if (tapCount === 2) { // On third tap
        setIsDev(prev => {
          const newValue = !prev;
          localStorage.setItem('devMode', newValue);
          return newValue;
        });
        setTapCount(0);
      }
    }
    setLastTap(now);
  };

  if (!isProtectionPassed) {
    return <ProtectionLayer onPass={handleProtectionPass} isDev={isDev} />;
  }

  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.title} onTouchStart={handleTitleTap}>
          Calculatoria
        </h1>
      </header>
      <div className={styles.buttonContainer}>
        <button
          className={activeTab === 'name' ? styles.primaryTab : styles.secondaryTab}
          onClick={() => setActiveTab('name')}
        >
          NameCalc
        </button>
        <button
          className={activeTab === 'date' ? styles.primaryTab : styles.secondaryTab}
          onClick={() => setActiveTab('date')}
        >
          DateCalc
        </button>
        {activeTab === 'date' && (
          <button
            className={styles.filterButton}
            onClick={() => setShowFilterModal(true)}
          >
            Filter
          </button>
        )}
        <button className={styles.clearButton} onClick={handleClear}>
          Clear
        </button>
      </div>
      <Form onSubmit={handleSubmit} activeTab={activeTab} />
      {activeTab === 'name' && (
        <Dashboard
          columns={nameColumns}
          data={calculations.filter(calc => !('birthdate' in calc))}
          onDelete={handleDelete}
          onClear={handleClear}
          layout="card"
        />
      )}
      {activeTab === 'date' && (
        <Dashboard
          columns={dateColumns}
          data={calculations.filter(calc => 'birthdate' in calc)}
          onDelete={handleDelete}
          onClear={handleClear}
          showFilter={true}
          showFilterModal={showFilterModal}
          setShowFilterModal={setShowFilterModal}
          layout="table"
        />
      )}
      {showClearModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <p>By pressing Clear, you will delete all data for both tables.</p>
            <div className={styles.modalButtons}>
              <button className={styles.confirmButton} onClick={confirmClear}>
                Confirm
              </button>
              <button className={styles.cancelButton} onClick={() => setShowClearModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}