import type { TablePaginationConfig } from "ant-design-vue/es/table";

export const pageConfig: TablePaginationConfig = {
  size: "small",
  showQuickJumper: true,
  showSizeChanger: true,
  showTotal: (total) => `总共 ${total} 条`,
  pageSize: 10,
  current: 1,
};
