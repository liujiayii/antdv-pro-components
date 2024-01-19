import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Space,
  Table,
} from "ant-design-vue";
import type { FormInstance } from "ant-design-vue/es/form";
import type { TablePaginationConfig } from "ant-design-vue/es/table";
import { cloneDeep, isFunction, omit } from "lodash-es";
import { computed, defineComponent, onMounted, provide, reactive, ref } from "vue";
import ToolBar from "./components/ToolBar";
import { tableSize } from "./store";
import type { ActionType, IValueEnum, ProColumns } from "./typing";
import { ProTableProps } from "./typing";
import { pageConfig, valueType } from "./utils";
import { formColConfig, showSearch } from "./utils/utils";

//值的枚举
const formatValueEnum = (valueEnum: IValueEnum) => {
  return ({ text }: { text: string }) => {
    const field = valueEnum[text];
    if (typeof field === "object") {
      return <Badge status={field.status} text={field.text} />;
    } else if (typeof field === "string") {
      return field;
    } else {
      return text;
    }
  };
};

const formatTableColumns = (data: ProColumns[]) => {
  return data
    .map((item) => {
      if (item.hideInTable) {
        return;
      }
      const row = { ...item };
      if (item.valueType === "option") {
        row.width = row.width ?? 200;
      } else if (item.valueType) {
        row.customRender = valueType[item.valueType];
      } else if (item.valueEnum) {
        row.customRender = item.customRender ?? formatValueEnum(item.valueEnum);
      }
      return row;
    })
    .filter(Boolean);
};
/**
 * @name 空分页
 * @description 表格没数据时分页器会消失，因此需要一个空的div来撑起高度
 * @why 为什么分页器会消失？https://github.com/ant-design/ant-design/issues/46262
 */
const EmptyPagination = () => {
  return <div style={{ height: "24px" }}></div>;
};

export default defineComponent({
  name: "ProTable",
  props: ProTableProps,
  setup(props) {
    //console.log(props);

    const tableData = ref<any[]>([]);
    const loading = ref(false);
    const pagination = ref<TablePaginationConfig>(cloneDeep(pageConfig));
    // const tableSize = ref<SizeType[]>(["middle"]);
    provide("tableSize", tableSize);
    //过滤搜索字段
    //const searchFields = {};
    // console.log('props.columns',props.columns);
    const searchArr = computed<ProColumns[]>(() => {
      return (
        (props.columns as ProColumns[])?.filter(
          (item) => item.search !== false && item.dataIndex,
        ) || []
      );
    });

    //console.log(searchArr);
    //console.log(searchArr);
    //searchArr.forEach((item) => (searchFields[item.dataIndex] = ""));
    // console.log(searchFields)
    const modelRef = reactive<Record<any, any>>({});
    const formRef = ref<FormInstance>();
    const fetch = (
      params: { current?: number; pageSize?: number } = { current: 1, pageSize: 10 },
    ) => {
      console.log("fetch", params);
      //console.log(modelRef);
      if (!props.request) {
        return;
      }
      loading.value = true;
      let allObj = { ...params, ...modelRef, ...props.params };
      if (props.beforeSearchSubmit) {
        allObj = props.beforeSearchSubmit(allObj);
      }
      console.log(allObj);
      props.request(allObj).then((res: any) => {
        loading.value = false;
        if (res?.code === 20000) {
          // console.log("res",{ ...params });
          const pageTemp = { ...pagination.value };

          pageTemp.total = res?.data?.total;
          pageTemp.current = params.current;
          tableData.value = res?.data?.records || [];

          pagination.value = pageTemp;
          if (isFunction(props.onLoad)) {
            props.onLoad(res);
          }
        }
      });
    };

    const handleTableChange = async (page = pagination.value) => {
      const pageTemp = { ...pagination.value };
      pageTemp.current = page.current;
      pageTemp.pageSize = page.pageSize;
      pagination.value = pageTemp;
      console.log(page);
      fetch({
        current: page.current,
        pageSize: page.pageSize,
      });
    };
    const handleSubmit = () => {
      // console.log('查询')

      fetch({ current: 1, pageSize: pagination.value.pageSize });
    };
    const actionRef: ActionType = {
      reload: () => handleTableChange(),
    };

    if (props.formExtraRef) {
      console.log("init formExtraRef");
      props?.formExtraRef({
        setFieldsValue: (values: any) => {
          console.log(values);
          // 分页参数，后面需要改成pros.pagination传过来
          if (values.current) {
            pagination.value.current = +values.current;
          }
          if (values.pageSize) {
            pagination.value.pageSize = +values.pageSize;
          }
          Object.assign(modelRef, omit(values, ["current", "pageSize"]));
        },
      });
    }

    onMounted(() => {
      if (props.actionRef) {
        props?.actionRef(actionRef);
      }
      fetch({ current: pagination.value.current, pageSize: pagination.value.pageSize });
    });

    return () => (
      <>
        {props.search && !!searchArr.value.length && (
          <Card
            bordered={false}
            style={{ marginBottom: "16px" }}
            bodyStyle={{ padding: "16px 24px 0" }}
          >
            <Form name="search" layout="vertical" model={modelRef} ref={formRef}>
              <Row gutter={16}>
                {searchArr.value.map((item) => (
                  <Col {...formColConfig} key="111">
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
                ))}
              </Row>
              <Row justify="end">
                <Col>
                  <Form.Item style={{ marginBottom: 0 }}>
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
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        )}
        <Card bordered={false} bodyStyle={{ padding: "0 24px" }}>
          <ToolBar actionRef={actionRef} title={props.title} />
          <Table
            bordered
            columns={formatTableColumns(props.columns as any) as any}
            rowKey={props.rowKey as string}
            dataSource={props.dataSource ?? tableData.value}
            pagination={pagination.value}
            loading={loading.value}
            onChange={handleTableChange}
            scroll={props.expandable ? undefined : { x: "max-content" }} // scroll和expandable不可同时使用
            size={tableSize.value[0]}
            {...props.expandable}
          />
          {pagination.value.total === 0 && <EmptyPagination />}
        </Card>
      </>
    );
  },
});
