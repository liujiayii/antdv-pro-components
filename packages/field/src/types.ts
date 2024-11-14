import type { ComputedRef } from "vue";

export interface ProFieldProps {
  /** @name 模式 */
  mode: "edit" | "read";
  /** @name 值 */
  value: ComputedRef<any>;
  /** @name 表单值 */
  formState: Record<string, any>;
}
