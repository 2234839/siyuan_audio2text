(function(s,o){typeof exports=="object"&&typeof module<"u"?module.exports=o():typeof define=="function"&&define.amd?define(o):(s=typeof globalThis<"u"?globalThis:s||self,s.audio2text_plugin_siyuan=o())})(this,(function(){"use strict";const{fetchSyncPost:s}=require("siyuan");async function o(t,e){let n=await s(t,e);return n.code===0?n.data:null}async function h(t,e,n,a,r){return o("/api/block/insertBlock",{dataType:t,data:e,nextID:n,previousID:a,parentID:r})}async function m(t,e,n){return o("/api/block/updateBlock",{dataType:t,data:e,id:n})}async function b(t,e){return o("/api/attr/setBlockAttrs",{id:t,attrs:e})}async function u(t){return o("/api/query/sql",{stmt:t})}const{Plugin:E}=require("siyuan"),l="custom-audio_id";class w extends E{async onload(){this.addCommand({hotkey:"",langKey:"转化所有音频为文本",langText:"转化所有音频为文本",callback:()=>{this.audio2text()}});var n=(()=>{var a=new MutationObserver(p=>{p.forEach(c=>{c.type==="childList"&&c.addedNodes.forEach(d=>{if(d instanceof HTMLElement&&d?.dataset.type==="NodeAudio"){const i=document.createElement("button");i.innerText="🔄️",i.contentEditable="false",i.style.marginLeft="10px",d.appendChild(i),this.onunloadFn.push(()=>i.remove()),i.onclick=async()=>{const k=(await u(`select * from blocks where id = "${d?.dataset.nodeId}"`))[0];await f(k),i.innerText="🔄️"}}})})}),r={childList:!0,subtree:!0};return a.observe(document.body,r),a})();this.onunloadFn.push(()=>n.disconnect())}async audio2text(){const e=await u(`
    SELECT * FROM blocks AS b
    WHERE
      b.type ="audio"
        AND
      NOT EXISTS (
        SELECT 1
        FROM attributes AS a
        WHERE a.block_id = b.id AND a."name" = "custom-text"
      )
    `);await Promise.all(e.map(f))}onunloadFn=[];async onunload(){this.onunloadFn.forEach(e=>e())}}async function f(t){await fetch(t.content).then(a=>a.arrayBuffer());const e=await x();await b(t.id,{"custom-text":e});const n=(await u(`
    SELECT * FROM attributes
    WHERE "name" ="${l}" AND VALUE = "${t.id}"`))[0];n===void 0?await h("markdown",y(t,e),void 0,t.id):await m("markdown",y(t,e),n.block_id)}async function x(t){return"识别结果测试"+new Date().toLocaleString()}function y(t,e){return`${e}
{: ${l}="${t.id}" style="text-align: center;"}`}return w}));
