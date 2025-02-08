import React, { useState } from 'react';

const EditableTable = ({ data, onSave }) => {
  const [tableData, setTableData] = useState(data);

  const handleEdit = (sectionIndex, labelIndex, value) => {
    const newData = [...tableData];
    newData[sectionIndex][labelIndex] = value;
    setTableData(newData);
  };

  const handleSave = () => {
    onSave(tableData); // Trigger the save handler passed via props
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            {tableData[0].map((header, index) => (
              <th key={index}>
                <input
                  type="text"
                  value={header}
                  onChange={(e) => handleEdit(0, index, e.target.value)} // Edit headers
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.slice(1).map((section, sectionIndex) => (
            <tr key={sectionIndex}>
              {section.map((label, labelIndex) => (
                <td key={labelIndex}>
                  <input
                    type="text"
                    value={label}
                    onChange={(e) =>
                      handleEdit(sectionIndex + 1, labelIndex, e.target.value)
                    } // Edit row labels
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleSave}>Save Changes</button>
    </div>
  );
};

export default EditableTable;
