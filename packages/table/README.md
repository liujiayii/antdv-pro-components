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

- 🔥 Written in TypeScript & jsx
- 🔥 使用typescript和jsx开发
- ⚠️ For personal learning purposes only, please do not use in production environments.
- ⚠️ 仅供个人学习使用，请勿在生产环境中使用

---

## 友情链接

- [antd-vue](https://github.com/VueComponent/ant-design-vue)
- [antd](https://github.com/ant-design/ant-design)
- [vite](https://github.com/vitejs/vite)

## 📦 安装

```bash
pnpm i @antd-vc/pro-table
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
import "@antd-vc/pro-table/es/style.css";
```

---
