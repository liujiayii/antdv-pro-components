import type { FormInstance } from "ant-design-vue/es/form";
import type { defineComponent, VNode } from "vue";

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
