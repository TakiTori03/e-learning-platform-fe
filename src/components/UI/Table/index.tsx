import { type TableProps } from "antd";
import { type FC } from "react";
import { StyledCommonTable } from "./styles";

const CTable: FC<TableProps<any>> = ({ className, ...rest }) => {
  return (
    <div className={`w-full ${className || ""}`}>
      <StyledCommonTable
        locale={{ emptyText: "Không có dữ liệu" }}
        indentSize={50}
        {...rest as any}
        rowClassName={(record: any, index: number, indent: number) => {
          let externalClass = "";
          if (typeof rest.rowClassName === "function") {
            externalClass = rest.rowClassName(record, index, indent) || "";
          } else if (typeof rest.rowClassName === "string") {
            externalClass = rest.rowClassName;
          }

          // Tự động phân dòng chẵn/lẻ bằng màu nền để tăng trải nghiệm nhìn
          return index % 2 === 0
            ? externalClass
            : `${externalClass} row-has-color`.trim();
        }}
      />
    </div>
  );
};

export default CTable;
