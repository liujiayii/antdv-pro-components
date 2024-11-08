import type { ProColumns } from "@antd-vc/pro-table";
import { DatePicker } from "ant-design-vue";
import dayjs from "dayjs";
import { computed, type ComputedRef, defineComponent, inject } from "vue";

const VALUE_FORMAT = "YYYY/MM/DD HH:mm:ss";

export default defineComponent({
  name: "DateTime",
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
            <DatePicker
              v-model:value={formState![column.value?.dataIndex as string]}
              placeholder={`请输入${column.value?.title}`}
              allowClear
              valueFormat={VALUE_FORMAT}
              showTime
              {...column.value?.fieldProps}
            />
          );
        case "read":
        default:
          return <>{value === "-" ? value : dayjs(value).format(VALUE_FORMAT)}</>;
      }
    };
  },
});
