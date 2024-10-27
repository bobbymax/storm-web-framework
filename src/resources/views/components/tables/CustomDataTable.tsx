/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import DataTable, {
  ConditionalArray,
  Raw,
} from "../../../../app/Support/DataTable";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import Pagination from "./Pagination";
import TextInput from "../forms/TextInput";
import Button from "../forms/Button";
import TextInputWithIcon from "../forms/TextInputWithIcon";
import TableButton from "./TableButton";

export interface ColumnData {
  label: string;
  accessor: string;
  type: "text" | "currency" | "date" | "status" | "badge" | "field";
  format?: string;
}

export interface ButtonsProp {
  label: string;
  variant: "success" | "info" | "warning" | "danger" | "dark";
  icon?: string;
  conditions: ConditionalArray[];
  operator: "and" | "or";
  display?: string;
}

export interface DataTableProps {
  collection: Record<string, any>[];
  columns: ColumnData[];
  manage: (raw: Raw, label: string) => void;
  buttons: ButtonsProp[];
  exportable?: boolean;
}

const CustomDataTable = ({
  collection,
  columns,
  manage,
  buttons,
  exportable = false,
}: DataTableProps) => {
  const [tableData, setTableData] = useState<Record<string, any>[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [searchTerm, setSearchTerm] = useState<string>("");

  const manager = useMemo(
    () => new DataTable(collection, columns, pageSize),
    [columns, pageSize, collection]
  );

  const exportData = () => {
    // Alert.flash("Download Excel File", "info", "Perform this action").then(
    //   (result) => {
    //     if (result.isConfirmed) {
    //       dataManager.export(data, generateUniqueString());
    //     }
    //   }
    // );
  };

  const generateButtons = (raw: Raw) => {
    return (
      <div className="flex column gap-sm">
        {buttons.map((bttn, i) => (
          <TableButton
            key={i}
            raw={raw}
            button={bttn}
            action={() => manage(raw, bttn.label)}
          />
        ))}
      </div>
    );
  };

  useEffect(() => {
    const updatedData = manager.paginate(page, filters, searchTerm);
    setTableData(updatedData);
  }, [page, pageSize, filters, searchTerm]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to the first page on search
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleFilterChange = (column: string, value: any) => {
    setFilters((prevFilters) => ({ ...prevFilters, [column]: value }));
    setPage(1); // Reset to the first page on filter change
  };

  return (
    <div className="table-container">
      <div className="table-header mb-4 flex between align">
        <h3 className="resource-header" style={{ fontWeight: 800 }}>
          List of Users
        </h3>
        <Button
          label="Add User"
          icon="ri-add-large-fill"
          variant="info"
          handleClick={() => {}}
        />
      </div>
      <div className="top-section mb-4 flex center-align space-between">
        <div className="search-container" style={{ flexGrow: 1 }}>
          <TextInputWithIcon
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearch}
            size="md"
            icon="ri-search-line"
          />
        </div>
        <div className="button-section">
          <Button
            label="Export to Excel"
            icon="ri-file-excel-2-line"
            variant="success"
            handleClick={() => exportData()}
            isDisabled={collection?.length < 1}
          />
        </div>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.accessor}>
                <span>{col.label}</span>
                <TextInput
                  placeholder={`Filter ${col.label}`}
                  onChange={(e) =>
                    handleFilterChange(col.accessor, e.target.value)
                  }
                  size="sm"
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.length > 0 ? (
            tableData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col) => (
                  <td key={col.accessor}>{row[col.accessor] ?? "N/A"}</td>
                ))}
                {manage !== undefined && (
                  <td style={{ maxWidth: "10%", width: "10%" }}>
                    {generateButtons(row)}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 1}>No Data Found!!!</td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination
        totalRecords={collection.length}
        pageSize={pageSize}
        currentPage={page}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default CustomDataTable;