// components/ui/table.tsx
"use client";

import React from "react";

export interface Column<T> {
  header: string;
  accessor: keyof T | string;
  render?: (row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
}

export function Table<T extends { id: string | number }>({ columns, data }: TableProps<T>) {
  return (
    <div className="overflow-x-auto border border-gray-200 rounded-md">
      <table className="w-full table-auto">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th
                key={col.accessor as string}
                className="p-3 text-left text-sm font-semibold border-b"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50 transition-colors duration-150">
              {columns.map((col) => (
                <td key={col.accessor as string} className="p-3 border-b">
                  {col.render ? col.render(row) : (row[col.accessor as keyof typeof row] as any)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
