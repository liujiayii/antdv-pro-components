export const showSearch = {
  showSearch: true,
  filterOption: (input: string, option: any) =>
    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0,
};
// 栅格表单
export const formColConfig = {
  xs: 24,
  sm: 24,
  md: 12,
  lg: 12,
  xl: 8,
  xxl: 8,
};
