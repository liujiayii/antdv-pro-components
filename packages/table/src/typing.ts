import type { BadgeProps } from "ant-design-vue/es/badge";
import type { ColumnType } from "ant-design-vue/es/table";
import { type PropType } from "vue";

export type IValueEnum =
  | Record<string, string>
  | Record<string, { status: BadgeProps["status"]; text: string }>;

export type IValueType = "dateTime" | "date" | "time" | "money" | "option";
export type ProColumns = {
  search?: boolean | { options: { value: any[] } };
  dataIndex: string;
  renderFormItem?: (
    _: any,
    field: {
      modelRef: any; //透传表单对象和字段，使父组件可以双向绑定
      fields: any;
      placeholder: any;
    },
  ) => any;
  valueEnum?: IValueEnum;
  valueType?: IValueType;
  hideInTable?: boolean;
} & ColumnType;

/** ProTable 的类型定义 继承自 antd 的 Table */
export const ProTableProps = {
  request: {
    type: Function as PropType<(params: Record<any, any>) => Promise<any>>,
    default: undefined,
    required: true,
  },
  columns: Array, //字段
  rowKey: {
    type: [String, Object, Number], //key
    default: undefined,
  },
  title: {
    type: [Array, Boolean],
    default: undefined,
  }, //表格左上侧
  actionRef: Function, //表格操作
  formRef: Function,
  formExtraRef: Function,
  params: {
    type: Object as PropType<Record<any, any>>,
    default: undefined,
  }, //默认参数
  search: {
    //搜索
    type: [Boolean, Object],
    default: true,
  },
  textSearch: {
    type: String,
    default: undefined,
  },
  lookUpCondition: {
    type: [Function],
    default: undefined,
  },
  expandable: Object,
  dataSource: {
    type: Array as PropType<any[]>,
    default: undefined,
  },
  beforeSearchSubmit: {
    type: [Function],
    default: undefined,
  },
  onLoad: {
    type: Function as PropType<(data: any) => void>,
    default: undefined,
  },
};
