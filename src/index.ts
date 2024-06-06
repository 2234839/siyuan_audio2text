import { Plugin } from "siyuan";
import { sql, updateBlock } from "./api";
import "./index.css";

export default class Expr extends Plugin {
  async onload() {}

  /** 插件卸载时会执行此数组中的函数 */
  onunloadFn = [] as (() => void)[];
  async onunload() {
    this.onunloadFn.forEach((fn) => fn());
  }
}
