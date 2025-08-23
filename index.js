"use strict";const{fetchSyncPost:p}=require("siyuan");async function i(t,e){let a=await p(t,e);return a.code===0?a.data:null}async function b(t,e,a,n,s){return i("/api/block/insertBlock",{dataType:t,data:e,nextID:a,previousID:n,parentID:s})}async function E(t,e,a){return i("/api/block/updateBlock",{dataType:t,data:e,id:a})}async function m(t,e){return i("/api/attr/setBlockAttrs",{id:t,attrs:e})}async function l(t){return i("/api/query/sql",{stmt:t})}const{Plugin:w}=require("siyuan"),f="custom-audio_id";class x extends w{async onload(){this.addCommand({hotkey:"",langKey:"转化所有音频为文本",langText:"转化所有音频为文本",callback:()=>{this.audio2text()}});var a=(()=>{var n=new MutationObserver(d=>{d.forEach(c=>{c.type==="childList"&&c.addedNodes.forEach(r=>{if(r instanceof HTMLElement&&r?.dataset.type==="NodeAudio"){const o=document.createElement("button");o.innerText="🔄️",o.contentEditable="false",o.style.marginLeft="10px",r.appendChild(o),this.onunloadFn.push(()=>o.remove()),o.onclick=async()=>{const h=(await l(`select * from blocks where id = "${r?.dataset.nodeId}"`))[0];await u(h),o.innerText="🔄️"}}})})}),s={childList:!0,subtree:!0};return n.observe(document.body,s),n})();this.onunloadFn.push(()=>a.disconnect())}async audio2text(){const e=await l(`
    SELECT * FROM blocks AS b
    WHERE
      b.type ="audio"
        AND
      NOT EXISTS (
        SELECT 1
        FROM attributes AS a
        WHERE a.block_id = b.id AND a."name" = "custom-text"
      )
    `);await Promise.all(e.map(u))}onunloadFn=[];async onunload(){this.onunloadFn.forEach(e=>e())}}async function u(t){await fetch(t.content).then(n=>n.arrayBuffer());const e=await k();await m(t.id,{"custom-text":e});const a=(await l(`
    SELECT * FROM attributes
    WHERE "name" ="${f}" AND VALUE = "${t.id}"`))[0];a===void 0?await b("markdown",y(t,e),void 0,t.id):await E("markdown",y(t,e),a.block_id)}async function k(t){return"识别结果测试"+new Date().toLocaleString()}function y(t,e){return`${e}
{: ${f}="${t.id}" style="text-align: center;"}`}module.exports=x;
