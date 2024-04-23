import { useState } from 'react';
export const useFilterAndSortableTable = (data) => {
  const [tableData, setTableData] = useState(data);

  const handleFilteringAndSorting = (
    sortField,
    sortOrder,
    searchQuery,
    setTotalMetrics
  ) => {
    let filteredData = [...data];

    // If there's a search query, it will filter the list
    if (searchQuery) {
      filteredData = filteredData.filter((item) =>
        item.ticker.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortField) {
      filteredData.sort((a, b) => {
        if (a[sortField] === null) return 1;
        if (b[sortField] === null) return -1;
        if (a[sortField] === null && b[sortField] === null) return 0;
        const numA = parseFloat(a[sortField]);
        const numB = parseFloat(b[sortField]);

        // Check if both are numbers
        if (!isNaN(numA) && !isNaN(numB)) {
          return (numA - numB) * (sortOrder === 'asc' ? 1 : -1);
        } else {
          // Fallback for non-numbers (use localeCompare)
          return (
            a[sortField]
              .toString()
              .localeCompare(b[sortField].toString(), 'en', {
                numeric: true,
              }) * (sortOrder === 'asc' ? 1 : -1)
          );
        }
      });
    }
    setTotalMetrics(filteredData.length);
    setTableData(filteredData);
  };

  return [tableData, handleFilteringAndSorting];
};
