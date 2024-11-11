/**
 * @name 空分页
 * @description 表格没数据时分页器会消失，因此需要一个空的div来撑起高度
 * @why 为什么分页器会消失？https://github.com/ant-design/ant-design/issues/46262
 */
function EmptyPagination() {
  return <div style={{ height: "24px" }}></div>;
}

export default EmptyPagination;
