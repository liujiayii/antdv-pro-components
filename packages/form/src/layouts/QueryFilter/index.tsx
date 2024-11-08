import type { ProColumns } from "@antd-vc/pro-table";
import type { FormInstance } from "ant-design-vue/es/form";
import { DownOutlined } from "@ant-design/icons-vue";
import { ProField } from "@antd-vc/pro-field";
import { Button, Card, Col, Form, Row, Space } from "ant-design-vue";
import { computed, defineComponent, onActivated, provide, reactive, ref, watch } from "vue";
import { useWindowWidth } from "./hooks";
import { ProFormProps } from "./types";
import { getSpanConfig } from "./utils";

const layout = "horizontal";

// 缓存首次渲染
let isFirstShow = true;

export default defineComponent({
  name: "QueryFilter",
  props: ProFormProps,
  setup(props) {
    // 在页面激活时刷新数据
    onActivated(() => {
      if (isFirstShow) {
        isFirstShow = false;
        return;
      }
      props.useFetchData?.();
    });
    const isCollapsed = ref(false);
    const formRef = ref<FormInstance>();
    const formState = props.formState || reactive<Record<string, any>>({});
    const width = useWindowWidth();
    const labelWidth = ref("80");
    const spanSize = computed(() => getSpanConfig(layout, width.value + 16, undefined));
    const searchArr = computed<ProColumns[]>(() => {
      return (
        (props.columns as ProColumns[])?.filter((item: any) => {
          const result = item.search !== false && item.dataIndex && item.valueType !== "option";
          if (result) {
            const colSize = item?.colSize ?? 1;
            const colSpan = Math.min(spanSize.value.span * (colSize || 1), 24);
            item.colSpan = colSpan;
            item.formItemWidth = {
              labelCol: {
                flex: `0 0 ${item.labelWidth || labelWidth.value}px`,
              },
              wrapperCol: {
                style: {
                  maxWidth: `calc(100% - ${item.labelWidth || labelWidth.value}px)`,
                },
              },
              style: {
                flexWrap: "nowrap",
              },
            };
          }

          return result;
        }) || []
      );
    });
    const showLength = computed(() => {
      // 查询重置按钮也会占一个spanSize格子，需要减掉计算
      return Math.max(1, 24 / spanSize.value.span - 1);
    });
    const shownSearchArr = computed<ProColumns[]>(() => {
      return isCollapsed.value ? searchArr.value.slice(0, showLength.value) : searchArr.value;
    });
    const offset = computed(() => {
      const currentSpan = shownSearchArr.value.reduce((prev, cur) => {
        return prev + (cur.colSpan || 0);
      }, 0);
      // console.log("offset", currentSpan % 24, spanSize.value);
      const offsetSpan = (currentSpan % 24) + spanSize.value.span;
      if (offsetSpan > 24) {
        return 24 - spanSize.value.span;
      }
      return 24 - offsetSpan;
    });

    const handleSubmit = async () => {
      // console.log("查询");
      try {
        await formRef.value?.validateFields();
      // eslint-disable-next-line unused-imports/no-unused-vars
      } catch (e) {
        return;
      }
      props.tableAction?.value?.setPageInfo?.({ current: 1 });
      props.useFetchData?.();
    };
    if (!searchArr.value.length) {
      return () => null;
    }
    const searchBtnDom = [
      <Button
        onClick={() => {
          formRef.value?.resetFields();
          Object.keys(formState).forEach((item) => {
            formState[item] = undefined;
          });
          props.useFetchData?.();
        }}
      >
        {props.search?.resetText || "重置"}
      </Button>,
      <Button
        type="primary"
        onClick={handleSubmit}
        loading={props.loading}
      >
        {props.search?.searchText || "查询"}
      </Button>,
    ];
    watch(() => formRef.value, (newFormRef) => {
      if (props.formRef) {
        props.formRef.value = newFormRef;
      }
    }, { immediate: true });
    provide("formState", formState);
    return () => (
      <Card
        bordered={false}
        style={{ marginBottom: "16px" }}
        bodyStyle={{ padding: "16px 24px 0" }}
      >
        <Form name="search" layout={spanSize.value.layout} model={formState} ref={formRef}>
          <Row gutter={24} justify="start">
            {shownSearchArr.value.map((item) => (
              <Col span={item.colSpan} key={item.dataIndex}>
                <Form.Item
                  label={item.title}
                  name={item.dataIndex as string}
                  {...(item as any).formItemWidth}
                  {
                    ... typeof item.formItemProps === "function"
                      ? item.formItemProps(formRef.value as FormInstance, item)
                      : item.formItemProps
                  }
                >
                  {item.renderFormItem
                    ? (
                        item.renderFormItem(undefined, {
                          modelRef: formState, // 透传表单对象和字段，使父组件可以双向绑定
                          fields: item.dataIndex,
                          placeholder: `请选择${item.title}`,
                        })
                      )
                    : <ProField mode="edit" column={item} />}
                </Form.Item>
              </Col>
            ))}
            <Col span={spanSize.value.span} style={{ textAlign: "end" }} offset={offset.value}>
              <Form.Item
                label="&nbsp;"
                colon={false}
                labelCol={{
                  flex: `0 0 auto`,
                }}
              >
                <Space size={16}>
                  <Space>
                    {props.search?.optionRender
                      ? props.search?.optionRender?.({ form: formRef.value }, { modelRef: formState }, searchBtnDom)
                      : searchBtnDom }
                  </Space>
                  <a
                    onClick={() => {
                      isCollapsed.value = !isCollapsed.value;
                    }}
                  >
                    {searchArr.value.length > 3
                      ? (
                          <div>
                            {isCollapsed.value ? "展开" : "收起"}
                            <DownOutlined
                              style={{
                                marginInlineStart: "0.5em",
                                transition: "0.3s all",
                                transform: `rotate(${isCollapsed.value ? 0 : 0.5}turn)`,
                              }}
                            />
                          </div>
                        )
                      : null}
                  </a>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  },
});
