import type { SearchConfig } from "@antd-vc/pro-form";
import type { BadgeProps } from "ant-design-vue/es/badge";
import type { FormInstance } from "ant-design-vue/es/form";
import type { ColumnType } from "ant-design-vue/es/table";
import type { PropType, Ref } from "vue";

export type IValueEnum =
  | Record<string, string>
  | Record<string, { status: BadgeProps["status"]; text: string }>;

export type IValueType = "dateTime" | "date" | "time" | "money" | "option";

export type ProColumns<T = any> = {
  search?: boolean | { options: { value: any[] } };
  dataIndex?: string;
  renderFormItem?: (
    _: any,
    field: {
      modelRef: T; // 透传表单对象和字段，使父组件可以双向绑定
      fields: any;
      placeholder: any;
    },
  ) => any;
  valueEnum?: IValueEnum;
  valueType?: IValueType;
  hideInTable?: boolean;
  colSize?: number;
} & ColumnType;

/** ProTable 的类型定义 继承自 antd 的 Table */
export const ProTableProps = {
  request: {
    type: Function as PropType<(params: Record<any, any>) => Promise<any>>,
    default: undefined,
    required: true,
  },
  /** 字段 */
  columns: {
    type: Array as PropType<ProColumns[]>,
    default: () => [],
  },
  rowKey: {
    type: [String, Object, Number], // key
    default: undefined,
  },
  /** 渲染工具栏，支持返回一个 dom 数组，会自动增加 margin-right */
  toolBarRender: {
    type: [Function, Boolean] as PropType<() => any[] | false>,
    default: () => undefined,
  },
  /** 左上角的 title */
  headerTitle: {
    type: Object as PropType<any>,
    default: () => undefined,
  },
  /** 表格操作 */
  actionRef: {
    type: Object as PropType<Ref<ActionType>>,
    default: () => null,
  },
  formRef: {
    type: Object as PropType<Ref<FormInstance | undefined >>,
    default: () => undefined,
  },
  /** 默认参数 */
  params: {
    type: Object as PropType<Record<any, any>>,
    default: () => undefined,
  },
  /**
   * @type SearchConfig
   * @name 是否显示搜索表单
   */
  search: {
    type: [Boolean, Object] as PropType<boolean | SearchConfig>,
    default: () => ({}),
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
    type: Function as PropType<(params: Record<any, any>) => Record<any, any>>,
    default: undefined,
  },
  onLoad: {
    type: Function as PropType<(data: any) => void>,
    default: undefined,
  },
  revalidateOnFocus: {
    type: Boolean,
    default: false,
  },
};

export interface PageInfo {
  pageSize: number;
  total: number;
  current: number;
}

/** 操作类型 */
export interface ProCoreActionType {
  /** @name 刷新 */
  reload: (resetPageIndex?: boolean) => Promise<void>;
  /** @name 刷新并清空，只清空页面，不包括表单 */
  // reloadAndRest?: () => Promise<void>;
  /** @name 重置任何输入项，包括表单 */
  // reset?: () => void;
  /** @name 清空选择 */
  // clearSelected?: () => void;
  /** @name p页面的信息都在里面 */
  // pageInfo?: PageInfo;
}

/** 操作类型 */
export type ActionType = ProCoreActionType & {
  // fullScreen?: () => void;
  setPageInfo?: (page: Partial<PageInfo>) => void;
} | null;
