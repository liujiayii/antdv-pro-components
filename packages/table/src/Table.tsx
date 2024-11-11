import type { SearchConfig } from "@antd-vc/pro-form";
import type { SizeType } from "ant-design-vue/es/config-provider";
import type { TablePaginationConfig } from "ant-design-vue/es/table";
import type { ActionType, ProColumns } from "./typing";
import { ProField } from "@antd-vc/pro-field";
import { QueryFilter } from "@antd-vc/pro-form";
import { Card, Table } from "ant-design-vue";
import { cloneDeep, isFunction } from "lodash-es";
import { computed, defineComponent, onMounted, provide, reactive, ref, watch } from "vue";
import EmptyPagination from "./components/empty-pagination";
import ToolBar from "./components/ToolBar";
import { ProTableProps } from "./typing";
import { pageConfig } from "./utils";

function formatTableColumns(data: ProColumns[]) {
  return data
    .map((item) => {
      if (item.hideInTable) {
        return undefined;
      }
      const row = {
        ...item,
        customRender: item.customRender ?? function ({ text }) {
          return <ProField mode="read" value={text} column={item} />;
        },
      };
      ;
      delete row.colSpan;
      return row;
    })
    .filter(Boolean);
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
    const tableColumns = computed(() => formatTableColumns(props.columns as any));
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
    }, { immediate: true });

    return () => (
      <>
        {props.search && (
          <QueryFilter
            columns={props.columns}
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
            columns={tableColumns.value as any}
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
