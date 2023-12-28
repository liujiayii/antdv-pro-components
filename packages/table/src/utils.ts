import type { TablePaginationConfig } from "ant-design-vue/es/table";
import dayjs from "dayjs";

export const pageConfig: TablePaginationConfig = {
  size: "small",
  showQuickJumper: true,
  showSizeChanger: true,
  showTotal: (total) => `总共 ${total} 条`,
  pageSize: 10,
  current: 1,
};

export type IValueType = "dateTime" | "date" | "time" | "money" | "option";
//值类型
export const valueType: Record<IValueType, (record: any) => string | undefined> = {
  dateTime: ({ text }: { text?: string }) => text && dayjs(text).format("YYYY/MM/DD HH:mm:ss"),
  date: ({ text }: { text?: string }) => text && dayjs(text).format("YYYY/MM/DD"),
  time: ({ text }: { text?: string }) => text && dayjs(text).format("HH:mm:ss"),
  money: ({ text }: { text?: string }) => text && `￥${text}`,
};
