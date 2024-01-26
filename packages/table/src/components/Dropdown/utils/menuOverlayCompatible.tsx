import type { MenuProps } from "ant-design-vue";
import { Menu } from "ant-design-vue";
import { omitUndefined } from "./omitUndefined";

const menuOverlayCompatible = (menu: MenuProps) => {
  const props = {
    overlay: <Menu {...menu} />,
  };
  return omitUndefined(props);
};

export { menuOverlayCompatible };
