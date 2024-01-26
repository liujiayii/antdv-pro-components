import { QueryFilter } from "@antd-vc/pro-form";
import { Badge, Card, Table } from "ant-design-vue";
import type { SizeType } from "ant-design-vue/es/config-provider";
import type { TablePaginationConfig } from "ant-design-vue/es/table";
import { cloneDeep, isFunction, omit } from "lodash-es";
import { defineComponent, onMounted, provide, reactive, ref } from "vue";
import ToolBar from "./components/ToolBar";
import type { ActionType, IValueEnum, ProColumns } from "./typing";
import { ProTableProps } from "./typing";
import { pageConfig, valueType } from "./utils";

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
    const tableSize = ref<SizeType[]>(["middle"]);
    provide("tableSize", tableSize);
    //过滤搜索字段
    //const searchFields = {};
    // console.log('props.columns',props.columns);

    //console.log(searchArr);
    //console.log(searchArr);
    //searchArr.forEach((item) => (searchFields[item.dataIndex] = ""));
    // console.log(searchFields)
    const modelRef = reactive<Record<any, any>>({});
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
        {props.search && <QueryFilter columns={props.columns} />}
        <Card bordered={false} bodyStyle={{ padding: "0 24px" }}>
          <ToolBar
            actionRef={actionRef}
            title={props.title}
            // columns={formatTableColumns(props.columns as any) as any}
          />
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
