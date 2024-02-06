import type { FormProps } from "ant-design-vue";

export type SpanConfig =
  | number
  | {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
    };
// 栅格表单
export const formColConfig = {
  xs: 24,
  sm: 24,
  md: 12,
  lg: 12,
  xl: 8,
  xxl: 6,
};

const CONFIG_SPAN_BREAKPOINTS = {
  xs: 513,
  sm: 513,
  md: 785,
  lg: 992,
  xl: 1057,
  xxl: Infinity,
};
/** 配置表单列变化的容器宽度断点 */
const BREAKPOINTS = {
  vertical: [
    // [breakpoint, cols, layout]
    [513, 1, "vertical"],
    [785, 2, "vertical"],
    [1057, 3, "vertical"],
    [Infinity, 4, "vertical"],
  ],
  default: [
    [513, 1, "vertical"],
    [701, 2, "vertical"],
    [1062, 3, "horizontal"],
    [1352, 3, "horizontal"],
    [Infinity, 4, "horizontal"],
  ],
};
/**
 * 合并用户和默认的配置
 *
 * @param layout
 * @param width
 */
export const getSpanConfig = (
  layout: FormProps["layout"],
  width: number,
  span?: SpanConfig,
): { span: number; layout: FormProps["layout"] } => {
  if (span && typeof span === "number") {
    return {
      span,
      layout,
    };
  }

  const spanConfig: (string | number)[][] = span
    ? ["xs", "sm", "md", "lg", "xl", "xxl"].map((key) => [
        CONFIG_SPAN_BREAKPOINTS[key as "xs"],
        24 / (span as any)[key as "sm"],
        "horizontal",
      ])
    : BREAKPOINTS[(layout as "default") || "default"];

  const breakPoint = (spanConfig || BREAKPOINTS.default).find(
    (item) => width < (item[0] as number) + 180, // 16 = 2 * (ant-row -8px margin)
  );

  if (!breakPoint) {
    return {
      span: 8,
      layout: "horizontal",
    };
  }
  return {
    span: 24 / (breakPoint[1] as number),
    layout: breakPoint?.[2] as "horizontal",
  };
};
