import { ColumnHeightOutlined, ReloadOutlined } from "@ant-design/icons-vue";
import { Divider, Dropdown, Menu, Space, Tooltip } from "ant-design-vue";
import { defineComponent, inject, type PropType } from "vue";
import { type ActionType } from "../../typing";
import styles from "./style.module.scss";

export default defineComponent({
  name: "ToolBar",
  props: {
    actionRef: {
      type: Object as PropType<ActionType>,
    }, //表格操作
    title: {
      type: [Array, Boolean],
      default: undefined,
    }, //表格左上侧
    // columns: {
    //   type: Array,
    //   default: undefined,
    // }, //表格列
  },
  setup(props) {
    const tableSize: any = inject("tableSize");
    return () => (
      <div class={styles.tableHeader}>
        <Space size="middle" class={styles.toolBar}>
          <Divider type="vertical" />
          <Tooltip title="刷新">
            <ReloadOutlined onClick={() => props.actionRef?.reload()} />
          </Tooltip>
          <Tooltip title="密度">
            <Dropdown
              trigger={["click"]}
              overlay={
                <Menu
                  style={{ width: "100px" }}
                  onClick={({ keyPath }) => {
                    tableSize.value = keyPath;
                  }}
                  v-model:selectedKeys={tableSize.value}
                >
                  <Menu.Item key="default">默认</Menu.Item>
                  <Menu.Item key="middle">中等</Menu.Item>
                  <Menu.Item key="small">紧凑</Menu.Item>
                </Menu>
              }
            >
              <ColumnHeightOutlined />
            </Dropdown>
          </Tooltip>
          {/* <Tooltip title="列设置">
            <Dropdown>
              <SettingOutlined />
            </Dropdown>
          </Tooltip> */}
        </Space>
        {props.title}
      </div>
    );
  },
});
