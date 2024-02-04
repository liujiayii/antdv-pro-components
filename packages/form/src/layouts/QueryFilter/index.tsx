import { DownOutlined } from "@ant-design/icons-vue";
import type { ActionType, IValueEnum } from "@antd-vc/pro-table";
import { type ProColumns } from "@antd-vc/pro-table";
import { Button, Card, Col, DatePicker, Form, Input, Row, Select, Space } from "ant-design-vue";
import type { FormInstance } from "ant-design-vue/es/form";
import { cloneDeep } from "lodash-es";
import { computed, defineComponent, ref, type PropType } from "vue";
import { useWindowWidth } from "./hooks";
import { formColConfig, getSpanConfig } from "./utils";

const layout = "horizontal";

export default defineComponent({
  name: "QueryFilter",
  props: {
    columns: Array, //字段
    lookUpCondition: {
      type: [Function],
      default: undefined,
    },
    textSearch: {
      type: String,
      default: undefined,
    },
    search: {
      //搜索
      type: [Boolean, Object],
      default: true,
    },
    useFetchData: {
      type: Function,
    },
    tableAction: {
      type: Object as PropType<ActionType>,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    formState: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
      required: true,
    },
  },
  setup(props) {
    const isCollapsed = ref(false);
    const formRef = ref<FormInstance>();
    const formState = props.formState || ref<Record<string, any>>({});
    const width = useWindowWidth();
    const labelWidth = ref("80" || "auto");
    const searchArr = computed<ProColumns[]>(() => {
      return (
        // 深拷贝一下是为了防止修改props，以后再解决复用问题；
        (cloneDeep(props.columns) as ProColumns[])?.filter((item) => {
          const result = item.search !== false && item.dataIndex;
          if (result) {
            const colSize = item?.colSize ?? 1;
            const colSpan = Math.min(spanSize.value.span * (colSize || 1), 24);
            item.colSpan = colSpan;
          }
          return result;
        }) || []
      );
    });
    const shownSearchArr = computed(() => {
      return isCollapsed.value ? searchArr.value.slice(0, showLength.value) : searchArr.value;
    });

    const spanSize = computed(() => getSpanConfig(layout, width.value + 16, formColConfig));
    const showLength = computed(() => {
      // 查询重置按钮也会占一个spanSize格子，需要减掉计算
      return Math.max(1, 24 / spanSize.value.span - 1);
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

    /** 计算最大宽度防止溢出换行 */
    const formItemFixStyle: any = computed(() => {
      if (labelWidth.value && spanSize.value.layout !== "vertical" && labelWidth.value !== "auto") {
        return {
          labelCol: {
            flex: `0 0 ${labelWidth.value}px`,
          },
          wrapperCol: {
            style: {
              maxWidth: `calc(100% - ${labelWidth.value}px)`,
            },
          },
          style: {
            flexWrap: "nowrap",
          },
        };
      }
      return null;
    });

    const handleSubmit = () => {
      // console.log('查询')
      props.tableAction?.setPageInfo?.({ current: 1 });
      props.useFetchData?.();
    };
    if (!searchArr.value.length) {
      return () => null;
    }
    return () => (
      <Card
        bordered={false}
        style={{ marginBottom: "16px" }}
        bodyStyle={{ padding: "16px 24px 0" }}
      >
        <Form name="search" layout={spanSize.value.layout} model={formState} ref={formRef}>
          <Row gutter={24} justify="start">
            {shownSearchArr.value.map((item: any) => (
              <Col span={item.colSpan} key={item.dataIndex}>
                <Form.Item
                  label={item.title}
                  name={item.dataIndex as string}
                  {...formItemFixStyle.value}
                >
                  {item.renderFormItem ? (
                    item.renderFormItem(undefined, {
                      modelRef: formState, //透传表单对象和字段，使父组件可以双向绑定
                      fields: item.dataIndex,
                      placeholder: `请选择${item.title}`,
                    })
                  ) : typeof item.search === "object" && item.search?.options ? (
                    <Select
                      v-model:value={formState[item.dataIndex]}
                      options={item.search.options.value}
                      showSearch={true}
                      placeholder={`请选择${item.title}`}
                      allowClear
                    />
                  ) : item.valueEnum ? (
                    <Select
                      v-model:value={formState[item.dataIndex]}
                      options={Object.keys(item.valueEnum).map((i) => ({
                        value: i,
                        label:
                          typeof (item.valueEnum as IValueEnum)[i] === "object"
                            ? ((item.valueEnum as any)[i]?.text as unknown as string)
                            : (item.valueEnum as IValueEnum)[i],
                      }))}
                      placeholder={`请选择${item.title}`}
                      allowClear
                    />
                  ) : item.valueType === "dateTime" ? (
                    <DatePicker
                      v-model:value={formState[item.dataIndex]}
                      placeholder={`请输入${item.title}`}
                      allowClear
                    />
                  ) : (
                    <Input
                      v-model:value={formState[item.dataIndex]}
                      placeholder={`请输入${item.title}`}
                      allowClear
                    />
                  )}
                </Form.Item>
              </Col>
            ))}
            <Col span={spanSize.value.span} style={{ textAlign: "end" }} offset={offset.value}>
              <Form.Item
                label="&nbsp;"
                colon={false}
                // {...formItemFixStyle.value}
              >
                <Space size={16}>
                  <Space>
                    <Button
                      onClick={() => {
                        formRef.value?.resetFields();
                        Object.keys(formState).forEach((item) => {
                          formState[item] = undefined;
                        });
                        props.useFetchData?.();
                      }}
                    >
                      重置
                    </Button>
                    <Button
                      type="primary"
                      onClick={() => {
                        // 查询的前置条件
                        if (props.lookUpCondition) {
                          // 把modelRef传出去
                          props.lookUpCondition(formState).then((res: boolean) => {
                            // console.log("查询条件res", res);
                            // 成立才执行
                            if (res) {
                              handleSubmit();
                            }
                          });
                        } else {
                          handleSubmit();
                        }
                      }}
                      loading={props.loading}
                    >
                      {/* 如果传过来这个值，就叫这个名字。如果没有就叫查询 */}
                      {props.textSearch ? props.textSearch : "查询"}
                    </Button>
                    {typeof props.search === "object" &&
                      props.search?.optionRender(undefined, { modelRef: formState })}
                  </Space>
                  <a
                    onClick={() => {
                      isCollapsed.value = !isCollapsed.value;
                    }}
                  >
                    {searchArr.value.length > 3 ? (
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
                    ) : null}
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
