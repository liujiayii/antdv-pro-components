export interface ProFieldProps {
  /** @name 模式 */
  mode: "edit" | "read";
  /** @name 值 */
  value: any;
  /** @name 表单值 */
  formState: Record<string, any>;
}
