import { useState } from 'react';
import { clearCalculations } from '../utils/storage.js';
import styles from './Dashboard.module.css';

export default function Dashboard({ title, columns, data, onDelete, onClear, showFilter = false }) {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(
    Object.fromEntries(columns.map(col => [col.key, true]))
  );

  const toggleColumn = (key) => {
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleClear = () => {
    clearCalculations();
    onClear();
  };

  const renderCell = (item, col) => {
    if (col.render) return col.render(item);
    return item[col.key] || 'N/A';
  };

  return (
    <div>
      <div className={styles.container}>
        <h2>{title}</h2>
        <div className={styles.buttonGroup}>
          {showFilter && (
            <button className={styles.filterButton} onClick={() => setShowFilterModal(true)}>
              Filter Columns
            </button>
          )}
          <button className={styles.clearButton} onClick={handleClear}>
            Clear
          </button>
        </div>
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tr}>
              {columns.map((col) => (
                visibleColumns[col.key] && (
                  <th key={col.key} className={styles.th}>
                    {col.label}
                  </th>
                )
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={i} className={styles.tr}>
                {columns.map((col) => (
                  visibleColumns[col.key] && (
                    <td key={col.key} className={styles.td}>
                      {renderCell(item, col)}
                      {col.isLast && (
                        <button className={styles.deleteButton} onClick={() => onDelete(i)}>
                          {item.confirmDelete ? 'Confirm' : 'X'}
                        </button>
                      )}
                    </td>
                  )
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showFilter && showFilterModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Filter Columns</h3>
            {columns.map((col) => (
              <label key={col.key}>
                {col.label}
                <div className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={visibleColumns[col.key]}
                    onChange={() => toggleColumn(col.key)}
                  />
                  <span className="toggle-slider"></span>
                </div>
              </label>
            ))}
            <button className={styles.closeButton} onClick={() => setShowFilterModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}