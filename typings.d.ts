type CSSModuleClasses = { readonly [key: string]: string };
declare module "*.css" {
  const classes: CSSModuleClasses;
  export default classes;
}
declare module "*.scss" {
  const classes: CSSModuleClasses;
  export default classes;
}
