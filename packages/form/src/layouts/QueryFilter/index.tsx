import { DownOutlined } from "@ant-design/icons-vue";
import { type ProColumns } from "@antd-vc/pro-table";
import { Button, Card, Col, DatePicker, Form, Input, Row, Select, Space } from "ant-design-vue";
import type { FormInstance } from "ant-design-vue/es/form";
import { computed, defineComponent, reactive, ref } from "vue";
import { formColConfig, showSearch } from "../../utils/utils";

export default defineComponent({
  name: "QueryFilter",
  props: {
    columns: Array, //字段
  },
  setup(props) {
    const isCollapsed = ref(true);
    const formRef = ref<FormInstance>();
    const modelRef = reactive<Record<any, any>>({});
    const loading = ref(false);
    const searchArr = computed<ProColumns[]>(() => {
      return (
        (props.columns as ProColumns[])?.filter(
          (item) => item.search !== false && item.dataIndex,
        ) || []
      );
    });
    if (!searchArr.value.length) {
      return () => null;
    }
    const handleSubmit = () => {
      // console.log('查询')
      fetch({ current: 1, pageSize: pagination.value.pageSize });
    };
    return () => (
      <Card
        bordered={false}
        style={{ marginBottom: "16px" }}
        bodyStyle={{ padding: "16px 24px 0" }}
      >
        <Form name="search" layout="horizontal" model={modelRef} ref={formRef}>
          <Row gutter={16}>
            {(isCollapsed.value ? searchArr.value.slice(0, 3) : searchArr.value).map(
              (item: any) => (
                <Col {...formColConfig} key={item.dataIndex}>
                  <Form.Item label={item.title} name={item.dataIndex as string}>
                    {item.renderFormItem ? (
                      item.renderFormItem(undefined, {
                        modelRef: modelRef, //透传表单对象和字段，使父组件可以双向绑定
                        fields: item.dataIndex,
                        placeholder: `请选择${item.title}`,
                      })
                    ) : typeof item.search === "object" && item.search?.options ? (
                      <Select
                        v-model:value={modelRef[item.dataIndex]}
                        options={item.search.options.value}
                        {...showSearch}
                        placeholder={`请选择${item.title}`}
                        allowClear
                      />
                    ) : item.valueEnum ? (
                      <Select
                        v-model:value={modelRef[item.dataIndex]}
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
                        v-model:value={modelRef[item.dataIndex]}
                        placeholder={`请输入${item.title}`}
                        allowClear
                      />
                    ) : (
                      <Input
                        v-model:value={modelRef[item.dataIndex]}
                        placeholder={`请输入${item.title}`}
                        allowClear
                      />
                    )}
                  </Form.Item>
                </Col>
              ),
            )}
            <Col
              {...formColConfig}
              style={{
                textAlign: "end",
              }}
            >
              <Form.Item label="&nbsp;" colon={false}>
                <Space size={16}>
                  <Space>
                    <Button
                      onClick={() => {
                        formRef.value?.resetFields();
                        Object.keys(modelRef).forEach((item) => {
                          modelRef[item] = undefined;
                        });
                        fetch();
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
                          props.lookUpCondition(modelRef).then((res: boolean) => {
                            console.log("查询条件res", res);
                            // 成立才执行
                            if (res) {
                              handleSubmit();
                            }
                          });
                        } else {
                          handleSubmit();
                        }
                      }}
                      loading={loading.value}
                    >
                      {/* 如果传过来这个值，就叫这个名字。如果没有就叫查询 */}
                      {props.textSearch ? props.textSearch : "查询"}
                    </Button>
                    {typeof props.search === "object" &&
                      props.search?.optionRender(undefined, { modelRef })}
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
