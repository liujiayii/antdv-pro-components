import type { TablePaginationConfig } from "ant-design-vue/es/table";
import type { IValueType } from "./typing";
import dayjs from "dayjs";

export const pageConfig: TablePaginationConfig = {
  size: "small",
  showQuickJumper: true,
  showSizeChanger: true,
  showTotal: (total) => `总共 ${total} 条`,
  pageSize: 10,
  current: 1,
};

// 值类型
// eslint-disable-next-line ts/ban-ts-comment
// @ts-expect-error
export const valueType: Record<IValueType, (record: any) => string | undefined> = {
  dateTime: ({ text }: { text?: string }) => text && dayjs(text).format("YYYY/MM/DD HH:mm:ss"),
  date: ({ text }: { text?: string }) => text && dayjs(text).format("YYYY/MM/DD"),
  time: ({ text }: { text?: string }) => text && dayjs(text).format("HH:mm:ss"),
  money: ({ text }: { text?: string }) => text && `￥${text}`,
};
