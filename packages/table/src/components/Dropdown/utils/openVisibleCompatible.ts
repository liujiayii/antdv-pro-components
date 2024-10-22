import process from "node:process";
import { version } from "ant-design-vue";
import { compareVersions } from "./index";
import { omitUndefined } from "./omitUndefined";

export function getVersion() {
  if (typeof process === "undefined")
    return version;
  return process?.env?.ANTD_VERSION || version;
}

function openVisibleCompatible(open?: boolean, onOpenChange?: any) {
  const props
    = compareVersions(getVersion(), "4.23.0") > -1
      ? {
          open,
          onOpenChange,
        }
      : {
          visible: open,
          onVisibleChange: onOpenChange,
        };

  return omitUndefined(props);
}

export { openVisibleCompatible };
