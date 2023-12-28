import type { MenuProps } from "ant-design-vue";
import { Menu } from "ant-design-vue";
import { omitUndefined } from "./omitUndefined";
import { compareVersions } from "./index";
import { getVersion } from "./openVisibleCompatible";

const menuOverlayCompatible = (menu: MenuProps) => {
  const props =
    compareVersions(getVersion(), "4.24.0") > -1
      ? {
          menu: menu,
        }
      : {
          overlay: <Menu {...menu} />,
        };

  return omitUndefined(props);
};

export { menuOverlayCompatible };
