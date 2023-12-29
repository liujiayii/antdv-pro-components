import { ColumnHeightOutlined, ReloadOutlined } from "@ant-design/icons-vue";
import { Divider, Dropdown, Menu, Space, Tooltip } from "ant-design-vue";
import { defineComponent } from "vue";
import styles from "./style.module.scss";
export default defineComponent({
  name: "proTooltip",
  props: {
    actionRef: Object, //表格操作
    title: {
      type: [Array, Boolean],
      default: undefined,
    }, //表格左上侧
    tableSize: Object,
  },
  setup(props) {
    return () => (
      <div class={styles.tableHeader}>
        <Space size="middle" class={styles.toolBar}>
          <Divider type="vertical" />
          <Tooltip title="刷新">
            <ReloadOutlined onClick={props.actionRef?.reload} />
          </Tooltip>
          <Tooltip title="密度">
            <Dropdown
              trigger={["click"]}
              overlay={
                <Menu
                  style={{ width: "100px" }}
                  onClick={({ keyPath }) => {
                    //@ts-ignore
                    // eslint-disable-next-line vue/no-mutating-props
                    props.tableSize?.value = keyPath as SizeType[];
                  }}
                  v-model:selectedKeys={props.tableSize?.value}
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
        </Space>
        {props.title}
      </div>
    );
  },
});
