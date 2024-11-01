import { pick } from "lodash-es";
import { ProTableProps } from "../../typing";

export const ToolBarProps = pick(ProTableProps, ["actionRef", "toolBarRender", "headerTitle"]);
