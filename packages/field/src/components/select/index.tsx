import type { ProColumns, ValueEnum } from "@antd-vc/pro-table";
import type { DefaultOptionType } from "ant-design-vue/es/select";
import { Badge, Select } from "ant-design-vue";
import { computed, type ComputedRef, defineComponent, inject } from "vue";

export default defineComponent({
  name: "Select",
  props: { },
  setup() {
    const mode = inject<"edit" | "read">("mode", "read");
    const value = inject<string | number>("value", "-");
    const formState = inject<Record<string, any>>("formState", {});
    const column = inject<ComputedRef<ProColumns | undefined>>("column", computed(() => undefined));

    const options = computed<DefaultOptionType[]>(() => {
      if (column.value?.valueEnum) {
        return Object.keys(column.value.valueEnum as ValueEnum).map((i) => {
          const item = (column.value?.valueEnum as ValueEnum)[i];
          return ({
            value: i,
            label: typeof item === "object" ? (item.text) : item,
          });
        });
      }
      return [];
    });
    const fieldValue = computed(() => {
      if (column.value?.valueEnum && value !== "-") {
        const item = (column.value?.valueEnum as ValueEnum)[value];
        return (typeof item === "object" ? <Badge {...item} /> : item) || "-";
      }
      return "-";
    });
    return () => {
      switch (mode) {
        case "edit":
          return (
            <Select
              v-model:value={formState![column.value?.dataIndex as string]}
              placeholder={`请选择${column.value?.title}`}
              allowClear
              options={options.value}
              {...column.value?.fieldProps}
            />
          );
        case "read":
        default:
          return <>{fieldValue.value}</>;
      }
    };
  },
});
