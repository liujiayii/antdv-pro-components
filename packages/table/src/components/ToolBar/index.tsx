import { ColumnHeightOutlined, ReloadOutlined } from "@ant-design/icons-vue";
import { Dropdown, Flex, Menu, Space, Tooltip } from "ant-design-vue";
import { defineComponent, inject } from "vue";
import { ToolBarProps } from "./types";
import { iconStyle } from "./utils";

export default defineComponent({
  name: "ToolBar",
  props: ToolBarProps,
  setup(props) {
    const tableSize: any = inject("tableSize");
    return () => (
      <Flex justify="space-between" style={{ paddingBlock: "16px" }}>
        <Flex align="center">
          {props.headerTitle}
        </Flex>
        <Flex gap={8}>
          <Space size={8}>{props.toolBarRender?.()}</Space>
          <Space size={8}>
            <Tooltip title="刷新">
              <ReloadOutlined style={iconStyle} onClick={() => props.actionRef?.value?.reload()} />
            </Tooltip>
            <Tooltip title="密度">
              <Dropdown
                trigger={["click"]}
                overlay={(
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
                )}
              >
                <ColumnHeightOutlined style={iconStyle} />
              </Dropdown>
            </Tooltip>
            {/* <Tooltip title="列设置">
            <Dropdown>
              <SettingOutlined />
            </Dropdown>
          </Tooltip> */}
          </Space>
        </Flex>
      </Flex>
    );
  },
});
