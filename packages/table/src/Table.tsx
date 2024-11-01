import type { SearchConfig } from "@antd-vc/pro-form";
import type { SizeType } from "ant-design-vue/es/config-provider";
import type { TablePaginationConfig } from "ant-design-vue/es/table";
import type { ActionType, IValueEnum, ProColumns } from "./typing";
import { QueryFilter } from "@antd-vc/pro-form";
import { Badge, Card, Table } from "ant-design-vue";
import { cloneDeep, isFunction } from "lodash-es";
import { defineComponent, onMounted, provide, reactive, ref, watch } from "vue";
import ToolBar from "./components/ToolBar";
import { ProTableProps } from "./typing";
import { pageConfig, valueType } from "./utils";

// 值的枚举
function formatValueEnum(valueEnum: IValueEnum) {
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
}

function formatTableColumns(data: ProColumns[]) {
  return data
    .map((item) => {
      if (item.hideInTable) {
        return undefined;
      }
      const row = { ...item };
      if (item.valueType === "option") {
        row.width = row.width ?? 200;
      } else if (item.valueType) {
        row.customRender = valueType[item.valueType];
      } else if (item.valueEnum) {
        row.customRender = item.customRender ?? formatValueEnum(item.valueEnum);
      }
      delete row.colSpan;
      return row;
    })
    .filter(Boolean);
}
/**
 * @name 空分页
 * @description 表格没数据时分页器会消失，因此需要一个空的div来撑起高度
 * @why 为什么分页器会消失？https://github.com/ant-design/ant-design/issues/46262
 */
function EmptyPagination() {
  return <div style={{ height: "24px" }}></div>;
}

export default defineComponent({
  name: "ProTable",
  props: ProTableProps,
  setup(props) {
    const tableData = ref<any[]>([]);
    const loading = ref(false);
    const pagination = ref<TablePaginationConfig>(cloneDeep(pageConfig));
    const tableSize = ref<SizeType[]>(["middle"]);
    const formState = reactive<Record<any, any>>({});
    provide("tableSize", tableSize);

    const useFetchData = (
      params: { current?: number; pageSize?: number } = { current: 1, pageSize: 10 },
    ) => {
      // console.log("fetch", params);
      // console.log(formState);
      if (!props.request) {
        return;
      }
      loading.value = true;
      let allObj = { ...params, ...formState, ...props.params };
      if (props.beforeSearchSubmit) {
        allObj = props.beforeSearchSubmit(allObj);
      }
      // console.log(allObj);
      props.request(allObj).then((res: any) => {
        loading.value = false;
        if (res?.code === 20000) {
          tableData.value = res?.data?.records || [];
          pagination.value = {
            ...pagination.value,
            total: res?.data?.total,
            current: params.current,
          };
          if (isFunction(props.onLoad)) {
            props.onLoad(res);
          }
        }
      });
    };

    const handleTableChange = async (page = pagination.value) => {
      pagination.value = {
        ...pagination.value,
        current: page.current,
        pageSize: page.pageSize,
      };
      useFetchData({
        current: page.current,
        pageSize: page.pageSize,
      });
    };

    const actionRef = ref<ActionType>({
      reload: () => handleTableChange(),
      setPageInfo(page) {
        pagination.value = {
          ...pagination.value,
          ...page,
        };
      },
    });

    /** 聚焦的时候重新请求数据，这样可以保证数据都是最新的。 */
    onMounted(() => {
      // 手动模式和 request 为空都不生效
      if (!props.request || !props.revalidateOnFocus)
        return;

      // 聚焦时重新请求事件
      const visibilitychange = () => {
        if (document.visibilityState === "visible") {
          actionRef.value?.reload();
        }
      };
      document.addEventListener("visibilitychange", visibilitychange);
      return () => document.removeEventListener("visibilitychange", visibilitychange);
    });
    onMounted(() => {
      useFetchData({ current: pagination.value.current, pageSize: pagination.value.pageSize });
    });
    watch(() => actionRef.value, (newActionRef) => {
      if (props.actionRef) {
        props.actionRef.value = newActionRef;
      }
    });

    return () => (
      <>
        {props.search && (
          <QueryFilter
            columns={props.columns}
            lookUpCondition={props.lookUpCondition}
            search={props.search as SearchConfig}
            useFetchData={useFetchData}
            tableAction={actionRef}
            loading={loading.value}
            formState={formState}
            formRef={props.formRef}
          />
        )}
        <Card bordered={false} bodyStyle={{ padding: "0 24px" }}>
          <ToolBar
            actionRef={actionRef}
            toolBarRender={props.toolBarRender}
            headerTitle={props.headerTitle}
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
