import { useState } from 'react';
import './PaymentTable.css';

const data = [
  {
    status: 'reserved',
    id: '1',
    ip: '10.30.20.40',
    externalIp: '10.10.0.1',
    routerModel: 'Meizu',
    location: 'М/C/D/6.1',
    phoneNumber: '79651234567',
    operator: 'MTS',
    serverConnectionType: 'WG/GRE/Local/',
    web_log: 'admin:password',
    ssh_log: 'admin:password',
    modemAmount: '1/2/3/4',
    modemModel: 'Huawei 3372-153h/Meiglink 838/',
    modemWebIp: '192.168.0.1/router_interface',
    clientPort: 'djuGSjnd:60001/adnrei:53292',
    rebootType: 'local/commander',
    modemSignal: '-63db/-12db',
    lifeTime: '5d16h32m',
  },
  {
    status: 'online',
    id: '2',
    ip: '10.20.30.40',
    externalIp: '10.10.0.1',
    routerModel: 'TP-Link',
    location: 'М/C/D/6.1 или Москва, Дубнинская, д.11',
    phoneNumber: '79651234567',
    operator: 'MTS',
    serverConnectionType: 'WG/GRE/Local/',
    web_log: 'admin:password',
    ssh_log: 'admin:password',
    modemAmount: '1/2/3/4',
    modemModel: 'Huawei 3372-153h/Meiglink 838/',
    modemWebIp: '192.168.0.1/router_interface',
    clientPort: 'djuGSjnd:60001/adnrei:53292',
    rebootType: 'local/commander',
    modemSignal: '-63db/-12db',
    lifeTime: '5d12h32m',
  },
];

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

  const [columns, setColumns] = useState(initialColumns);
  const [dropTarget, setDropTarget] = useState(null);
  const [visibleColumns, setVisibleColumns] = useState(visibleColumnsInit);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
  });
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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

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

  const filteredData = sortedData.filter((item) => {
    return item.ip.includes(searchQuery);
  });

  return (
    <div className='table-container'>
      <div className='search-container'>
        <input
          type='text'
          placeholder='Search by IP...'
          value={searchQuery}
          onChange={handleSearchChange}
          className='search-input'
        />
      </div>
      <div className='column-toggle'>
        <h3>Columns</h3>
        <ul>
          {Object.keys(visibleColumnsInit).map((column) => (
            <li key={column}>
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
                          {sortConfig.direction === 'ascending' ? ' 🔽' : ' 🔼'}
                        </span>
                      )}
                    </th>
                  )
              )}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item.id} className='table__tr'>
              {columns
                .sort((a, b) => a.order - b.order)
                .map(
                  (col) =>
                    visibleColumns[col.name] && (
                      <td key={`${col.name}-${item.id}`} className='table__td'>
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
  );
};
