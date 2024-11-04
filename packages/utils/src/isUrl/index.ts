/**
 * 判断是不是一个 url
 * @param  {string|undefined} path
 * @returns boolean
 */
export function isUrl(path: string | undefined): boolean {
  if (!path)
    return false;
  if (!path.startsWith("http")) {
    return false;
  }
  try {
    const url = new URL(path);
    return !!url;
  // eslint-disable-next-line unused-imports/no-unused-vars
  } catch (error) {
    return false;
  }
}
