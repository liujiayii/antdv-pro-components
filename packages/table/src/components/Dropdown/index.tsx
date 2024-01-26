import { EllipsisOutlined } from "@ant-design/icons-vue";
import { Dropdown } from "ant-design-vue";
import { type MenuItemProps } from "ant-design-vue/es/menu";
import { defineComponent, type CSSProperties, type PropType } from "vue";
import { menuOverlayCompatible } from "./utils/menuOverlayCompatible";

interface MenuItems extends MenuItemProps {
  name: string;
  key: string;
  title?: string;
}

type DropdownProps = {
  children?: () => void;
  menus: MenuItems[];
  onSelect?: (key: string) => void;
  className?: string;
  style: CSSProperties;
};
export default defineComponent({
  name: "TableDropdown",
  props: {
    children: {
      type: Function as PropType<DropdownProps["children"]>,
    },
    menus: {
      type: Array as PropType<DropdownProps["menus"]>,
      default: () => [],
    },
    onSelect: {
      type: Function as PropType<DropdownProps["onSelect"]>,
      default: () => {},
    },
    className: {
      type: String as PropType<DropdownProps["className"]>,
      default: "",
    },
    style: {
      type: Object as PropType<DropdownProps["style"]>,
      default: () => ({}),
    },
  },
  /**
   * 一个简单的下拉菜单
   *
   * @param param0
   */
  setup(props) {
    const { style, onSelect, menus = [], children } = props;
    // const { getPrefixCls } = inject(ConfigProvider.ConfigContext);

    // const tempClassName = getPrefixCls('pro-table-dropdown');
    // const DropdownButton = ({ children, menus, onSelect, style }: DropdownProps) => {
    //   //  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);

    //   //  const tempClassName = getPrefixCls("pro-table-dropdown");

    //   const dropdownProps = menuOverlayCompatible({
    //     onClick: (params) => onSelect && onSelect(params.key as string),
    //     items: menus?.map((item: any) => ({
    //       label: item.name,
    //       key: item.key,
    //     })),
    //   });

    //   return (
    //     <Dropdown
    //       {...dropdownProps}
    //       //  class={classnames(tempClassName, className)}
    //     >
    //       <Button style={style}>
    //         {children} <DownOutlined />
    //         111111
    //       </Button>
    //     </Dropdown>
    //   );
    // };

    const dropdownProps = menuOverlayCompatible({
      onClick: (params) => {
        onSelect?.(params.key as string);
      },
      // @ts-ignore
      items: menus.map(({ key, name, ...rest }) => ({
        key,
        ...rest,
        title: rest.title as string,
        label: name,
      })),
    });
    // console.log(dropdownProps);
    //  TableDropdown.Button = DropdownButton;
    return () => (
      <Dropdown {...dropdownProps} class={props.className}>
        <a style={style}>{children || <EllipsisOutlined />}</a>
      </Dropdown>
    );
  },
});
