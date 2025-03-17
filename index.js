"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
const { fetchSyncPost } = require("siyuan");
async function request(url, data) {
  let response = await fetchSyncPost(url, data);
  let res = response.code === 0 ? response.data : null;
  return res;
}
async function insertBlock(dataType, data, nextID, previousID, parentID) {
  let payload = {
    dataType,
    data,
    nextID,
    previousID,
    parentID
  };
  let url = "/api/block/insertBlock";
  return request(url, payload);
}
async function updateBlock(dataType, data, id) {
  let payload = {
    dataType,
    data,
    id
  };
  let url = "/api/block/updateBlock";
  return request(url, payload);
}
async function setBlockAttrs(id, attrs) {
  let data = {
    id,
    attrs
  };
  let url = "/api/attr/setBlockAttrs";
  return request(url, data);
}
async function sql(sql2) {
  let sqldata = {
    stmt: sql2
  };
  let url = "/api/query/sql";
  return request(url, sqldata);
}
const { Plugin } = require("siyuan");
const custom_audio_id = "custom-audio_id";
class audio2text_plugin_siyuan extends Plugin {
  constructor() {
    super(...arguments);
    /** 插件卸载时会执行此数组中的函数 */
    __publicField(this, "onunloadFn", []);
  }
  async onload() {
    this.addCommand({
      hotkey: "",
      langKey: `转化所有音频为文本`,
      langText: `转化所有音频为文本`,
      callback: () => {
        this.audio2text();
      }
    });
    const watchDOMChanges = () => {
      var observer2 = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "childList") {
            mutation.addedNodes.forEach((audioDiv) => {
              if (audioDiv instanceof HTMLElement && (audioDiv == null ? void 0 : audioDiv.dataset.type) === "NodeAudio") {
                const reloadBtn = document.createElement("button");
                reloadBtn.innerText = "🔄️";
                reloadBtn.contentEditable = "false";
                reloadBtn.style.marginLeft = "10px";
                audioDiv.appendChild(reloadBtn);
                this.onunloadFn.push(() => reloadBtn.remove());
                reloadBtn.onclick = async () => {
                  const audioBlock = (await sql(`select * from blocks where id = "${audioDiv == null ? void 0 : audioDiv.dataset.nodeId}"`))[0];
                  await audioBlockAddText(audioBlock);
                  reloadBtn.innerText = "🔄️";
                };
              }
            });
          }
        });
      });
      var config = { childList: true, subtree: true };
      observer2.observe(document.body, config);
      return observer2;
    };
    var observer = watchDOMChanges();
    this.onunloadFn.push(() => observer.disconnect());
  }
  async audio2text() {
    const audioBlocks = await sql(
      /** 查询没有 text 属性的blocks */
      `
    SELECT * FROM blocks AS b
    WHERE
      b.type ="audio"
        AND
      NOT EXISTS (
        SELECT 1
        FROM attributes AS a
        WHERE a.block_id = b.id AND a."name" = "custom-text"
      )
    `
    );
    await Promise.all(audioBlocks.map(audioBlockAddText));
  }
  async onunload() {
    this.onunloadFn.forEach((fn) => fn());
  }
}
async function audioBlockAddText(audioBlock) {
  await fetch(audioBlock.content).then((r) => r.arrayBuffer());
  const audioText = await audioFile2Text();
  await setBlockAttrs(audioBlock.id, {
    "custom-text": audioText
  });
  const audioTextAttr = (await sql(
    `
    SELECT * FROM attributes
    WHERE "name" ="${custom_audio_id}" AND VALUE = "${audioBlock.id}"`
  ))[0];
  if (audioTextAttr === void 0) {
    await insertBlock(
      "markdown",
      genAudioTextMarkdown(audioBlock, audioText),
      void 0,
      audioBlock.id
    );
  } else {
    await updateBlock(
      "markdown",
      genAudioTextMarkdown(audioBlock, audioText),
      audioTextAttr.block_id
    );
  }
}
async function audioFile2Text(audio) {
  return "识别结果测试" + (/* @__PURE__ */ new Date()).toLocaleString();
}
function genAudioTextMarkdown(audioBlock, audioText) {
  return `${audioText}
{: ${custom_audio_id}="${audioBlock.id}" style="text-align: center;"}`;
}
module.exports = audio2text_plugin_siyuan;
