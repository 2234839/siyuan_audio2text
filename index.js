"use strict";var E=Object.defineProperty;var m=(t,e,a)=>e in t?E(t,e,{enumerable:!0,configurable:!0,writable:!0,value:a}):t[e]=a;var y=(t,e,a)=>m(t,typeof e!="symbol"?e+"":e,a);const{fetchSyncPost:w}=require("siyuan");async function c(t,e){let a=await w(t,e);return a.code===0?a.data:null}async function x(t,e,a,n,r){return c("/api/block/insertBlock",{dataType:t,data:e,nextID:a,previousID:n,parentID:r})}async function k(t,e,a){return c("/api/block/updateBlock",{dataType:t,data:e,id:a})}async function T(t,e){return c("/api/attr/setBlockAttrs",{id:t,attrs:e})}async function l(t){return c("/api/query/sql",{stmt:t})}const{Plugin:A}=require("siyuan"),p="custom-audio_id";class g extends A{constructor(){super(...arguments);y(this,"onunloadFn",[])}async onload(){this.addCommand({hotkey:"",langKey:"转化所有音频为文本",langText:"转化所有音频为文本",callback:()=>{this.audio2text()}});var n=(()=>{var r=new MutationObserver(d=>{d.forEach(u=>{u.type==="childList"&&u.addedNodes.forEach(o=>{if(o instanceof HTMLElement&&(o==null?void 0:o.dataset.type)==="NodeAudio"){const s=document.createElement("button");s.innerText="🔄️",s.contentEditable="false",s.style.marginLeft="10px",o.appendChild(s),this.onunloadFn.push(()=>s.remove()),s.onclick=async()=>{const b=(await l(`select * from blocks where id = "${o==null?void 0:o.dataset.nodeId}"`))[0];await f(b),s.innerText="🔄️"}}})})}),i={childList:!0,subtree:!0};return r.observe(document.body,i),r})();this.onunloadFn.push(()=>n.disconnect())}async audio2text(){const a=await l(`
    SELECT * FROM blocks AS b
    WHERE
      b.type ="audio"
        AND
      NOT EXISTS (
        SELECT 1
        FROM attributes AS a
        WHERE a.block_id = b.id AND a."name" = "custom-text"
      )
    `);await Promise.all(a.map(f))}async onunload(){this.onunloadFn.forEach(a=>a())}}async function f(t){await fetch(t.content).then(n=>n.arrayBuffer());const e=await L();await T(t.id,{"custom-text":e});const a=(await l(`
    SELECT * FROM attributes
    WHERE "name" ="${p}" AND VALUE = "${t.id}"`))[0];a===void 0?await x("markdown",h(t,e),void 0,t.id):await k("markdown",h(t,e),a.block_id)}async function L(t){return"识别结果测试"+new Date().toLocaleString()}function h(t,e){return`${e}
{: ${p}="${t.id}" style="text-align: center;"}`}module.exports=g;
