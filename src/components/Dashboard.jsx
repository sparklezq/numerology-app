import { clearCalculations } from '../utils/storage.js';
import styles from './Dashboard.module.css';
import { useState } from 'react';

export default function Dashboard({
  columns,
  data,
  onDelete,
  onClear,
  showFilter = false,
  showFilterModal = false,
  setShowFilterModal,
  layout = 'table',
}) {
  const [visibleColumns, setVisibleColumns] = useState(
    Object.fromEntries(columns.map(col => [col.key, true]))
  );

  const toggleColumn = (key) => {
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderCell = (item, col) => {
    if (col.render) return col.render(item);
    return item[col.key] || 'N/A';
  };

  return (
    <div>
      {layout === 'table' ? (
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
      ) : (
        <div className={styles.cardContainer}>
          {data.map((item, i) => (
            <div key={i} className={styles.card}>
              {columns.map((col) => (
                <div key={col.key} className={styles.cardItem}>
                  {renderCell(item, col)}
                  {col.isLast && (
                    <button className={styles.deleteButton} onClick={() => onDelete(i)}>
                      {item.confirmDelete ? 'Confirm' : 'X'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
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