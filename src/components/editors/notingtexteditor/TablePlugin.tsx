"use client";
import { FluentTable48Regular } from "@/components/icons";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createTableNodeWithDimensions } from "@lexical/table";
import { $insertNodeToNearestRoot } from "@lexical/utils";
import { Checkbox, InputNumber, Modal } from "antd";
import { useState } from "react";
import { toast } from "react-toastify";

const TablePlugin = () => {
  interface TableRowCol {
    rows: number;
    cols: number;
    header: boolean;
  }

  const [editor] = useLexicalComposerContext();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [tableRowCol, setTableRowCol] = useState<TableRowCol>({
    rows: 1,
    cols: 1,
    header: false,
  });

  const createTable = () => {
    if (tableRowCol.rows < 1 || tableRowCol.cols < 1) {
      toast.error("Rows and columns must be at least 1.");
    }

    editor.update(() => {
      const tableNode = $createTableNodeWithDimensions(
        tableRowCol.rows,
        tableRowCol.cols,
        tableRowCol.header
      );
      $insertNodeToNearestRoot(tableNode);
    });
    setIsModalOpen(false);
    setTableRowCol({ rows: 1, cols: 1, header: false });
  };
  return (
    <>
      <button
        className="px-2"
        title="Table"
        onClick={() => setIsModalOpen(true)}
        type="button"
      >
        <FluentTable48Regular />
      </button>
      <Modal
        width={250}
        title="Create Table"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onOk={createTable}
        onCancel={() => setIsModalOpen(false)}
      >
        <div className="w-full">
          <p>Number of rows</p>

          <InputNumber
            id="rows"
            style={{ width: 200 }}
            min={1}
            max={10}
            defaultValue={tableRowCol.rows}
            value={tableRowCol.rows}
            changeOnWheel
            onChange={(value) =>
              setTableRowCol((prev) => ({
                ...prev,
                rows: value || 0,
              }))
            }
          />
        </div>

        <label htmlFor="cols">Columns</label>
        <div>
          <InputNumber
            id="cols"
            style={{ width: 200 }}
            min={1}
            max={10}
            defaultValue={tableRowCol.cols}
            changeOnWheel
            value={tableRowCol.cols}
            onChange={(value) =>
              setTableRowCol((prev) => ({
                ...prev,
                cols: value || 0,
              }))
            }
          />
        </div>
        <div className="flex items-center gap-2 mt-2">
          <label htmlFor="header">Header: </label>
          <Checkbox
            id="header"
            checked={tableRowCol.header}
            onChange={(e) =>
              setTableRowCol((prev) => ({
                ...prev,
                header: e.target.checked,
              }))
            }
          />
        </div>
      </Modal>
    </>
  );
};

export default TablePlugin;
