import type { ProColumns } from "@antd-vc/pro-table";
import type { ProFieldProps } from "../../types";
import { Input } from "ant-design-vue";
import { computed, type ComputedRef, defineComponent, inject } from "vue";

export default defineComponent({
  name: "Money",
  setup() {
    const mode = inject<ProFieldProps["mode"]>("mode", "read");
    const value = inject<ProFieldProps["value"]>("value", computed(() => "-"));
    const formState = inject<ProFieldProps["formState"]>("formState", {});
    const column = inject<ComputedRef<ProColumns>>("column", computed(() => ({}) as ProColumns));
    return () => {
      switch (mode) {
        case "edit":
          return (
            <Input
              v-model:value={formState![column.value!.dataIndex as string]}
              placeholder={`请输入${column.value?.title}`}
              allowClear
              {...(column.value?.fieldProps || {})}
            />
          );
        default:
          return <>{value.value === "-" ? "-" : `￥${value.value}`}</>;
      }
    };
  },
});
