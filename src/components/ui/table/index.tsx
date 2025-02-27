import React, { ReactNode } from "react";
import {productsInventoryTableColumns} from "../../../config/tableColumns";

// Props for Table
interface TableProps {
  children: ReactNode; // Table content (thead, tbody, etc.)
  className?: string; // Optional className for styling
}

// Props for TableHeader
interface TableHeaderProps {
  children?: ReactNode; // Header row(s)
  className?: string; // Optional className for styling
  columns?: string[]
}

// Props for TableBody
interface TableBodyProps {
  children: ReactNode; // Body row(s)
  className?: string; // Optional className for styling
}

// Props for TableRow
interface TableRowProps {
  children: ReactNode; // Cells (th or td)
  className?: string; // Optional className for styling
  hover?: boolean
}

// Props for TableCell
interface TableCellProps {
  children: ReactNode; // Cell content
  isHeader?: boolean; // If true, renders as <th>, otherwise <td>
  className?: string; // Optional className for styling
}

// Table Component
const Table: React.FC<TableProps> = ({ children, className }) => {
  return <table className={`min-w-full  ${className}`}>{children}</table>;
};

// TableHeader Component
const TableHeader: React.FC<TableHeaderProps> = ({className, columns }) => {
  return (
      <thead className={`${className} border-b border-gray-100 dark:border-white/[0.05]`}>
        <TableRow hover={false}>
          {columns?.map((column, index) => (
              <TableCell
                  isHeader
                  className="px-5 py-3 font-bold text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                {column}
              </TableCell>
          ))}
        </TableRow>
      </thead>
  );
};

// TableBody Component
const TableBody: React.FC<TableBodyProps> = ({ children, className }) => {
  return <tbody className={className}>{children}</tbody>;
};

// TableRow Component
const TableRow: React.FC<TableRowProps> = ({ children, className, hover }) => {
  return (
      <tr
          className={`${className} ${hover ? 'hover:bg-gray-100 dark:hover:bg-gray-dark' : ''}`}
      >
        {children}
      </tr>

  );
};

const TableFooter: React.FC<TableHeaderProps> = ({ children, className }) => {
  return <thead className={className}>{children}</thead>;
};

// TableCell Component
const TableCell: React.FC<TableCellProps> = ({
  children,
  isHeader = false,
  className,
}) => {
  const CellTag = isHeader ? "th" : "td";
  return <CellTag className={` ${className}`}>{children}</CellTag>;
};


export { Table, TableHeader, TableBody, TableRow, TableCell, TableFooter };
