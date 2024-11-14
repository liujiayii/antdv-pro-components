import type { ProColumns } from "@antd-vc/pro-table";
import type { ProFieldProps } from "../../types";
import { DatePicker } from "ant-design-vue";
import dayjs from "dayjs";
import { computed, type ComputedRef, defineComponent, inject } from "vue";

const VALUE_FORMAT = "YYYY/MM/DD";

export default defineComponent({
  name: "DateTime",
  setup() {
    const mode = inject<ProFieldProps["mode"]>("mode", "read");
    const value = inject<ProFieldProps["value"]>("value", computed(() => "-"));
    const formState = inject<ProFieldProps["formState"]>("formState", {});
    const column = inject<ComputedRef<ProColumns>>("column", computed(() => ({}) as ProColumns));
    return () => {
      switch (mode) {
        case "edit":
          return (
            <DatePicker
              v-model:value={formState[column.value!.dataIndex as string]}
              placeholder={`请输入${column.value?.title}`}
              allowClear
              valueFormat={VALUE_FORMAT}
              {...(column.value?.fieldProps || {})}
            />
          );
        default:
          return <>{value.value === "-" ? value : dayjs(value.value).format(VALUE_FORMAT)}</>;
      }
    };
  },
});
