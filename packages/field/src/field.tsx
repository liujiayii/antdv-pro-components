import type { ProColumns, ValueType } from "@antd-vc/pro-table";
import { computed, defineComponent, type PropType, provide } from "vue";
import DateTime from "./components/date-time";
import Money from "./components/money";
import Select from "./components/select";
import Text from "./components/text";

export default defineComponent({
  name: "ProField",
  props: {
    mode: {
      type: String as PropType<"edit" | "read">,
      default: "read",
    },
    value: {
      type: [String, Number, Boolean, Object, Array],
      default: undefined,
    },
    column: {
      type: Object as PropType<ProColumns>,
      default: () => ({}),
    },
  },
  setup(props) {
    const column = computed(() => props.column);
    const valueType = computed<ValueType>(() => props.column.valueType || "text");
    provide("value", props.value);
    provide("mode", props.mode);
    provide("column", column);
    // console.log(props, "props");
    return () => {
      if (valueType.value === "text" && props.column.valueEnum) {
        return <Select />;
      } else if (valueType.value === "dateTime") {
        return <DateTime />;
      } else if (valueType.value === "money") {
        return <Money />;
      } else {
        return <Text />;
      }
    };
  },
});
