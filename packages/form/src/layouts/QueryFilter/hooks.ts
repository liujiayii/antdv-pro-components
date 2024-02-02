import { isBrowser } from "@antd-vc/pro-utils";
import { debounce } from "lodash-es";
import { onBeforeUnmount, onMounted, ref } from "vue";

const defaultWidth = isBrowser() ? document?.body?.clientWidth : 1024;
const width = ref<any>(defaultWidth);
const onWindowResize = debounce(() => {
  width.value = document?.body?.clientWidth;
}, 300);

export const useWindowWidth = () => {
  onMounted(() => {
    window.addEventListener("resize", () => onWindowResize());
  });
  onBeforeUnmount(() => {
    window.removeEventListener("resize", () => onWindowResize());
  });
  return width;
};
