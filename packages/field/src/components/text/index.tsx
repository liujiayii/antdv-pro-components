import type { ProColumns } from "@antd-vc/pro-table";
import { Input } from "ant-design-vue";
import { computed, type ComputedRef, defineComponent, inject } from "vue";

export default defineComponent({
  name: "Text",
  props: { },
  setup() {
    const mode = inject<"edit" | "read">("mode", "read");
    const value = inject<string | number>("value", "-");
    const formState = inject<Record<string, any>>("formState", {});
    const column = inject<ComputedRef<ProColumns | undefined>>("column", computed(() => undefined));
    return () => {
      switch (mode) {
        case "edit":
          return (
            <Input
              v-model:value={formState![column.value?.dataIndex as string]}
              placeholder={`请输入${column.value?.title}`}
              allowClear
              {...column.value?.fieldProps}
            />
          );
        case "read":
        default:
          return <>{value}</>;
      }
    };
  },
});
