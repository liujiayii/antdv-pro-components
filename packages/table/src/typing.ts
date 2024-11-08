import type { SearchConfig } from "@antd-vc/pro-form";
import type { CheckboxProps, DatePickerProps, InputNumberProps, InputProps, RadioProps, SelectProps, TextAreaProps, TimePickerProps, TimeRangePickerProps } from "ant-design-vue";
import type { BadgeProps } from "ant-design-vue/es/badge";
import type { RangePickerProps } from "ant-design-vue/es/date-picker";
import type { FormInstance, FormItemProps } from "ant-design-vue/es/form";
import type { ColumnType } from "ant-design-vue/es/table";
import type { PropType, Ref } from "vue";

export type ValueEnum = Record<string, {
  /** @name 预定的颜色 */
  status?: BadgeProps["status"];
  /** @name 演示的文案 */
  text: string;
  /** @name 自定义的颜色 */
  color?: string;
  /** @name 是否禁用 */
  disabled?: boolean;
} | string>;
/**
 * ProFieldValueTypeWithFieldProps
 * 字段值类型与 ProFieldProps 的映射关系
 */
export interface ProFieldValueTypeWithFieldProps {
  /** 文本输入框 */
  text: InputProps;
  /** 密码输入框 */
  password: InputProps;
  /** 金额 */
  money: Record<string, any>;
  /** 索引 */
  // index: Record<string, any>;
  /** 索引带边框 */
  // indexBorder: Record<string, any>;
  /** 下拉选择 */
  option: Record<string, any>;
  /** 多行文本 */
  textarea: TextAreaProps;
  /** 日期选择器 */
  date: DatePickerProps;
  /** 周选择器 */
  // dateWeek: DatePickerProps;
  /** 月选择器 */
  // dateMonth: DatePickerProps;
  /** 季度选择器 */
  // dateQuarter: DatePickerProps;
  /** 年选择器 */
  // dateYear: DatePickerProps;
  /** 日期时间选择器 */
  dateTime: DatePickerProps;
  /** 相对时间 */
  // fromNow: DatePickerProps;
  /** 日期范围选择器 */
  dateRange: RangePickerProps;
  /** 日期时间范围选择器 */
  dateTimeRange: RangePickerProps;
  /** 周范围选择器 */
  // dateWeekRange: RangePickerProps;
  /** 月范围选择器 */
  // dateMonthRange: RangePickerProps;
  /** 季范围选择器 */
  // dateQuarterRange: RangePickerProps;
  /** 年范围选择器 */
  // dateYearRange: RangePickerProps;
  /** 时间选择器 */
  time: TimePickerProps;
  /** 时间范围选择器 */
  timeRange: TimeRangePickerProps;
  /** 下拉选择器 */
  select: SelectProps;
  /** 复选框 */
  checkbox: CheckboxProps;
  /** 评分 */
  // rate: RateProps;
  /** 滑动条 */
  // slider: SliderSingleProps | SliderRangeProps;
  /** 单选框 */
  radio: RadioProps;
  /** 单选框按钮 */
  radioButton: RadioProps;
  /** 进度条 */
  // progress: ProgressProps;
  /** 百分比输入框 */
  percent: InputNumberProps;
  /** 数字输入框 */
  digit: InputNumberProps;
  /** 数字范围输入框 */
  digitRange: InputNumberProps;
  /** 秒数输入框 */
  // second: InputNumberProps;
  /** 代码输入框 */
  // code: InputProps | TextAreaProps;
  /** JSON 代码输入框 */
  // jsonCode: InputProps | TextAreaProps;
  /** 头像 */
  // avatar: AvatarProps;
  /** 开关 */
  // switch: SwitchProps;
  /** 图片 */
  // image: ImageProps | InputProps;
  /** 级联选择 */
  // cascader: CascaderProps<any>;
  /** 树形选择 */
  // treeSelect: TreeSelectProps;
  /** 颜色选择器 */
  // color: SketchPickerProps &
  //   ColorPickerProps & {
  //     value?: string;
  //     popoverProps?: PopoverProps;
  //     mode?: "read" | "edit";
  //     onChange?: (color: string) => void;
  //     colors?: string[];
  //     /** 是否使用旧版本 */
  //     old?: boolean;
  //   };
  /** 分段器 */
  // segmented: SegmentedProps;
  /** 分组 */
  // group: ProFormBaseGroupProps;
  /** 表单列表 */
  // formList: Record<string, any>;
  /** 表单集合 */
  // formSet: Record<string, any>;
  /** 分割线 */
  // divider: DividerProps;
  /** 显示/隐藏 */
  // dependency: FormItemProps;
}
export type ValueType = Extract<
  keyof ProFieldValueTypeWithFieldProps,
  any
>;
// "text" | "dateTime" | "date" | "time" | "money" | "option";

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
  valueEnum?: ValueEnum;
  valueType?: ValueType;
  hideInTable?: boolean;
  colSize?: number;
  formItemProps?: ((form: FormInstance, config: any) => FormItemProps) | FormItemProps;
  fieldProps?: any;
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
