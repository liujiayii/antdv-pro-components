import type { ActionType, ProColumns } from "@antd-vc/pro-table";
import type { FormInstance } from "ant-design-vue/es/form";
import type { defineComponent, PropType, Ref, VNode } from "vue";

export const ProFormProps = {
  columns: {
    type: Array as PropType<ProColumns[]>,
    default: () => [],
  },
  formRef: {
    type: Object as PropType<Ref<FormInstance | undefined >>,
    default: () => undefined,
  },
  /**
   * @type SearchConfig
   * @name 是否显示搜索表单
   */
  search: {
    type: [Object] as PropType<SearchConfig>,
    default: () => ({}),
  },
  useFetchData: {
    type: Function,
  },
  tableAction: {
    type: Object as PropType<Ref<ActionType>>,
    default: undefined,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  formState: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({}),
  },
};

type VueJSXComponentType = ReturnType<typeof defineComponent>;
export interface SearchConfig {
  /**
   * @name 查询按钮的文本
   */
  searchText?: string;
  /**
   * @name 重置按钮的文本
   */
  resetText?: string;
  /**
   * @name 底部操作栏的 render
   */
  optionRender?: (
    searchConfig: { form?: FormInstance },
    props: { modelRef: Record<string, any> },
    dom: VNode[]
  ) => Array<VNode | VueJSXComponentType>;
};
