import { useState } from 'react';
import './PaymentTable.css';
import { data } from '../../assets/constants/dataTable';

export const PaymentTable = () => {
  const visibleColumnsInit = {
    status: true,
    id: false,
    ip: true,
    externalIp: false,
    routerModel: false,
    location: true,
    phoneNumber: false,
    operator: true,
    serverConnectionType: false,
    web_log: false,
    ssh_log: false,
    modemAmount: false,
    modemModel: false,
    modemWebIp: false,
    clientPort: false,
    rebootType: false,
    modemSignal: false,
    lifeTime: false,
  };
  const initialColumns = [
    { name: 'status', order: 0 },
    { name: 'id', order: 1 },
    { name: 'ip', order: 2 },
    { name: 'externalIp', order: 3 },
    { name: 'routerModel', order: 4 },
    { name: 'location', order: 5 },
    { name: 'phoneNumber', order: 6 },
    { name: 'operator', order: 7 },
    { name: 'serverConnectionType', order: 8 },
    { name: 'web_log', order: 9 },
    { name: 'ssh_log', order: 10 },
    { name: 'modemAmount', order: 11 },
    { name: 'modemModel', order: 12 },
    { name: 'modemWebIp', order: 13 },
    { name: 'clientPort', order: 14 },
    { name: 'rebootType', order: 15 },
    { name: 'modemSignal', order: 16 },
    { name: 'lifeTime', order: 17 },
  ];
  const [isVisible, setIsVisible] = useState(false);
  const [columns, setColumns] = useState(initialColumns);
  const [dropTarget, setDropTarget] = useState(null);
  const [visibleColumns, setVisibleColumns] = useState(visibleColumnsInit);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
  });
  // ФУНКЦИЯ ОТКРЫТИЯ ЗАКРЫТИЯ КОЛОНОК
  const toggleButtonColumnVisible = () => {
    isVisible ? setIsVisible(false) : setIsVisible(true);
  };
  // Функция скрытия колонок
  const toggleColumnVisibility = (column) => {
    setVisibleColumns({
      ...visibleColumns,
      [column]: !visibleColumns[column],
    });

    const updatedColumns = columns.map((col) => {
      if (col.name === column) {
        return {
          ...col,
          visible: !visibleColumns[column],
        };
      }
      return col;
    });

    setColumns(updatedColumns);
  };
  // Выбор колонки для перетаскивания
  const onDragStart = (e, columnName) => {
    e.dataTransfer.setData('text/plain', columnName);
  };
  // Эфект при нажатии на колонку
  const onDragOver = (e, targetColumnName) => {
    e.preventDefault();
    setDropTarget(targetColumnName);
  };
  // Выбор колонки куда перетаскиваем
  const onDrop = (e, targetColumnName) => {
    const sourceColumnName = e.dataTransfer.getData('text/plain');
    const sourceColumn = columns.find((col) => col.name === sourceColumnName);
    const targetColumn = columns.find((col) => col.name === targetColumnName);

    if (sourceColumn && targetColumn) {
      const newColumns = [...columns];
      newColumns.splice(sourceColumn.order, 1);
      newColumns.splice(targetColumn.order, 0, sourceColumn);
      newColumns.forEach((col, index) => (col.order = index));
      setColumns(newColumns);
      setDropTarget(null);
    }
  };
  // Функция определяющая цвет лампочки по статусу
  const getStatusBadge = (status) => {
    if (status === 'online') {
      return <div className='indicator-status green' />;
    } else if (status === 'offline') {
      return <div className='indicator-status gray' />;
    } else if (status === 'reserved') {
      return <div className='indicator-status blue' />;
    } else if (status === 'disabled') {
      return <div className='indicator-status red' />;
    }
    return null;
  };
  // СОРТИРОВКА ПО АЛФАВИТУ
  const handleSort = (columnName) => {
    const direction =
      sortConfig.key === columnName && sortConfig.direction === 'ascending'
        ? 'descending'
        : 'ascending';

    setSortConfig({ key: columnName, direction });
  };
  const sortedData = data.sort((a, b) => {
    if (sortConfig.direction === 'ascending') {
      const valueA = a[sortConfig.key] || '';
      const valueB = b[sortConfig.key] || '';

      if (isNaN(valueA) || isNaN(valueB)) {
        return valueA.localeCompare(valueB);
      } else {
        return Number(valueA) - Number(valueB);
      }
    } else if (sortConfig.direction === 'descending') {
      const valueA = a[sortConfig.key] || '';
      const valueB = b[sortConfig.key] || '';

      if (isNaN(valueA) || isNaN(valueB)) {
        return valueB.localeCompare(valueA);
      } else {
        return Number(valueB) - Number(valueA);
      }
    }
  });
  // ФУНЦИЯ ПОИСКА СРЕДИ IP
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };
  const filteredData = sortedData.filter((item) => {
    return item.ip.includes(searchQuery);
  });

  //ПАГИНАЦИЯ СТРАНИЦ
  const [currentPage, setCurrentPage] = useState(1); // Текущая страница
  const itemsPerPage = 15; // Количество строк на странице
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className='payment-table'>
      <nav className='payment-table__nav'>
        <div className='payment-table__search-container'>
          <input
            type='text'
            placeholder='Search by IP...'
            value={searchQuery}
            onChange={handleSearchChange}
            className='payment-table__search-input'
          />
        </div>
        <div className='payment-table__column-toggle'>
          <button
            className='payment-table__burger'
            onClick={toggleButtonColumnVisible}
          >
            Columns
          </button>
          <ul
            className={`payment-table__columns ${isVisible ? 'payment-table__columns_visible' : ''}`}
          >
            {Object.keys(visibleColumnsInit).map((column) => (
              <li key={column} className='payment-table__list'>
                <label>
                  <input
                    type='checkbox'
                    checked={visibleColumns[column]}
                    onChange={() => toggleColumnVisibility(column)}
                  />
                  {column}
                </label>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <div className='payment-table__table'>
        <table className='table'>
          <thead className='table__head'>
            <tr className='table__tr'>
              {columns
                .sort((a, b) => a.order - b.order) // Сортировка колонок
                .map(
                  (col) =>
                    visibleColumns[col.name] && (
                      <th
                        key={col.name}
                        draggable={true}
                        onDragStart={(e) => onDragStart(e, col.name)}
                        onDragOver={(e) => onDragOver(e, col.name)}
                        onDrop={(e) => onDrop(e, col.name)}
                        className={`table__th ${dropTarget === col.name ? 'drop-target' : ''}`}
                        onClick={() => handleSort(col.name)}
                      >
                        {col.name}
                        {sortConfig.key === col.name && (
                          <span>
                            {sortConfig.direction === 'ascending'
                              ? ' 🔽'
                              : ' 🔼'}
                          </span>
                        )}
                      </th>
                    )
                )}
            </tr>
          </thead>
          <tbody className='table__body'>
            {currentItems.map((item) => (
              <tr key={item.id} className='table__tr'>
                {columns
                  .sort((a, b) => a.order - b.order)
                  .map(
                    (col) =>
                      visibleColumns[col.name] && (
                        <td
                          key={`${col.name}-${item.id}`}
                          className='table__td'
                        >
                          {col.name === 'status'
                            ? getStatusBadge(item[col.name])
                            : item[col.name]}
                        </td>
                      )
                  )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='pagination'>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`pagination__btn ${currentPage === page ? 'pagination__btn_active' : ''}`}
            onClick={() => paginate(page)}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};
