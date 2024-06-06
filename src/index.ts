import { Plugin } from "siyuan";
import { getFile, setBlockAttrs, sql, updateBlock } from "./api";
import "./index.css";
import { string } from "@llej/js_util/dist/src/js-core";

type aliasAttribute = { [K in keyof attribute as `a_${K}`]: attribute[K] };
/** 合并了block和attribute，其中attribute的属性key前面添加了`a_` */
type MergedBlock = aliasAttribute & Block;

const attrName = "custom-text";

export default class Siyuan_audio2text extends Plugin {
  async onload() {
    this.addCommand({
      hotkey: "",
      langKey: `转化所有音频为文本`,
      langText: `转化所有音频为文本`,
      callback: () => {
        this.audio2text();
      },
    });
  }
  async audio2text() {
    const audioBlocks: MergedBlock[] = await sql(`
    SELECT b.*,a.id AS a_id,a."name" AS a_name,a."value" as a_value,a."type" AS a_type,a.block_id AS a_block_id,a.root_id AS a_root_id,a.box AS a_box,a."path" AS a_path
      FROM blocks AS  b
      INNER JOIN attributes AS a
      ON b.id = a.block_id
      WHERE b.type ="audio" AND a.name = "${attrName}"
    `);
    await Promise.all(audioBlocks.map(audioBlockAddText));
  }
  /** 插件卸载时会执行此数组中的函数 */
  onunloadFn = [] as (() => void)[];
  async onunload() {
    this.onunloadFn.forEach((fn) => fn());
  }
}

async function audioBlockAddText(audioBlock: Block) {
  const audioFile = await fetch(audioBlock.content).then((r) => r.arrayBuffer());

  // 上传文件识别为文本
  const audioText = await audioFile2Text(audioFile);
  // 插入文本节点
  console.log(audioBlock, audioText);

  await setBlockAttrs(audioBlock.id, {
    "custom-text": audioText,
  });
}

async function audioFile2Text(audio: ArrayBuffer): Promise<string> {
  // 此处实现识别音频为文本的功能

  return "识别结果测试";
}
