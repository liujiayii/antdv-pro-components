import { DownOutlined, EllipsisOutlined } from "@ant-design/icons-vue";
import { Button, Dropdown } from "ant-design-vue";
import { defineComponent } from "vue";
import { menuOverlayCompatible } from "./utils/menuOverlayCompatible";

export default defineComponent({
  name: "proDropdown",
  props: {
    children: null,
    menus: null,
    onSelect: null,
    className: null,
    style: null,
  },
  /**
   * 一个简单的下拉菜单
   *
   * @param param0
   */
  setup() {
    // const { getPrefixCls } = inject(ConfigProvider.ConfigContext);

    // //
    // const tempClassName = getPrefixCls('pro-table-dropdown');
    const DropdownButton = ({ children, menus, onSelect, style }) => {
      //  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);

      //  const tempClassName = getPrefixCls("pro-table-dropdown");

      const dropdownProps = menuOverlayCompatible({
        onClick: (params) => onSelect && onSelect(params.key as string),
        items: menus?.map((item) => ({
          label: item.name,
          key: item.key,
        })),
      });

      return (
        <Dropdown
          {...dropdownProps}
          //  class={classnames(tempClassName, className)}
        >
          <Button style={style}>
            {children} <DownOutlined />
            111111
          </Button>
        </Dropdown>
      );
    };

    const TableDropdown: {
      Button: typeof DropdownButton;
    } = ({ style, onSelect, menus = [], children }) => {
      // const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
      // const className = getPrefixCls("pro-table-dropdown");
      const dropdownProps = menuOverlayCompatible({
        onClick: (params) => {
          onSelect?.(params.key as string);
        },
        items: menus.map(({ key, name, ...rest }) => ({
          key,
          ...rest,
          title: rest.title as string,
          label: name,
        })),
      });
      return (
        <Dropdown
          {...dropdownProps}
          // class={classnames(className, propsClassName)}
        >
          <a style={style}>{children || <EllipsisOutlined />}</a>
        </Dropdown>
      );
    };

    TableDropdown.Button = DropdownButton;
    return TableDropdown;
  },
});
