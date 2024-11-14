import type { ProColumns, ValueEnum } from "@antd-vc/pro-table";
import type { DefaultOptionType } from "ant-design-vue/es/select";
import type { ProFieldProps } from "../../types";
import { Badge, Select } from "ant-design-vue";
import { computed, type ComputedRef, defineComponent, inject } from "vue";

export default defineComponent({
  name: "Select",
  setup() {
    const mode = inject<ProFieldProps["mode"]>("mode", "read");
    const value = inject<ProFieldProps["value"]>("value", computed(() => "-"));
    const formState = inject<ProFieldProps["formState"]>("formState", {});
    const column = inject<ComputedRef<ProColumns>>("column", computed(() => ({}) as ProColumns));

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
      if (column.value?.valueEnum && value.value !== "-") {
        const item = (column.value?.valueEnum as ValueEnum)[value.value];
        return (typeof item === "object" ? <Badge {...item} /> : item) || "-";
      }
      return "-";
    });
    return () => {
      switch (mode) {
        case "edit":
          return (
            <Select
              v-model:value={formState[column.value!.dataIndex as string]}
              placeholder={`请选择${column.value?.title}`}
              allowClear
              options={options.value}
              {...(column.value?.fieldProps || {})}
            />
          );
        default:
          return <>{fieldValue.value}</>;
      }
    };
  },
});
