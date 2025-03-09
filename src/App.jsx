import { useState, useEffect } from 'react';
import Form from './components/Form.jsx';
import Dashboard from './components/Dashboard.jsx';
import { loadCalculations, saveCalculations } from './utils/storage.js';
import styles from './App.module.css';
import logo from './assets/calculatoria-logo.svg';

export default function App() {
  const [activeTab, setActiveTab] = useState('name');
  const [calculations, setCalculations] = useState([]);

  useEffect(() => {
    setCalculations(loadCalculations());
  }, []);

  const handleSubmit = (result) => {
    const newCalcs = [...calculations, { ...result, confirmDelete: false }];
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
    setCalculations([]);
  };

  const nameColumns = [
    {
      key: 'nameParts',
      label: 'Parts',
      render: (item) =>
        item.nameParts
          ? item.nameParts.map(p => `${p.part}: ${p.vowelNumber}-${p.consonantNumber}-${p.nameNumber}`).join(', ')
          : 'N/A',
    },
    {
      key: 'combined',
      label: 'Combined',
      render: (item) =>
        item.combined
          ? `${item.combined.vowelNumber}-${item.combined.consonantNumber}-${item.combined.nameNumber}`
          : 'N/A',
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

  const filteredDateData = calculations.filter((calc) => calc.birthdate);

  return (
    <>
      <header className={styles.header}>
        <img src={logo} className={styles.logo} alt="Calculatoria Logo" />
        <h1>Calculatoria</h1>
      </header>
      <Form onSubmit={handleSubmit} />
      <div className={styles.tabButtons}>
        <button
          className={activeTab === 'name' ? styles.primaryTab : styles.secondaryTab}
          onClick={() => setActiveTab('name')}
        >
          Name Tab
        </button>
        <button
          className={activeTab === 'date' ? styles.primaryTab : styles.secondaryTab}
          onClick={() => setActiveTab('date')}
        >
          Date Tab
        </button>
      </div>
      {activeTab === 'name' && (
        <Dashboard
          title="Name Calculations"
          columns={nameColumns}
          data={calculations}
          onDelete={handleDelete}
          onClear={handleClear}
          layout="card" // Switch to card layout
        />
      )}
      {activeTab === 'date' && (
        <Dashboard
          title="Date Calculations"
          columns={dateColumns}
          data={filteredDateData}
          onDelete={handleDelete}
          onClear={handleClear}
          showFilter={true}
          layout="table" // Keep table layout
        />
      )}
    </>
  );
}