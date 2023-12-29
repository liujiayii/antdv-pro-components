<p align="center">
  <a href="https://www.npmjs.org/package/@antd-vc/pro-table">
    <img src="https://img.shields.io/npm/v/@antd-vc/pro-table.svg">
  </a>
  <a href="https://npmcharts.com/compare/@antd-vc/pro-table?minimal=true">
    <img src="https://img.shields.io/npm/dm/@antd-vc/pro-table.svg">
  </a>
  <br>
</p>

<p align="center">@antd-vc/pro-table</p>

- 🔥 Written in TypeScript

---

## 友情链接

- [Element Plus](https://github.com/element-plus/element-plus)
- [antd](https://github.com/ant-design/ant-design)
- [dumi](https://github.com/umijs/dumi)

## 📦 安装

```bash
pnpm i @antd-vc/pro-table
npm install --save  @antd-vc/pro-table
yarn add @antd-vc/pro-table
```

## 🔨 示例

```tsx
import { ProTable } from "@antd-vc/pro-table";

<ProTable
  params={params}
  request={async (
    params: T & {
      pageSize: number;
      current: number;
    },
    sort,
    filter,
  ) => {
    const msg = await myQuery({
      page: params.current,
      pageSize: params.pageSize,
    });
    return {
      data: msg.result,
      success: boolean,
      total: number,
    };
  }}
/>;
```

引入样式：

```jsx
import "@antd-vc/pro-table/dist/style.css";
```

---
