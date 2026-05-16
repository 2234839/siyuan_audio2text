(function(e,t){typeof exports==`object`&&typeof module<`u`?module.exports=t():typeof define==`function`&&define.amd?define([],t):(e=typeof globalThis<`u`?globalThis:e||self,e.audio2text_plugin_siyuan=t())})(this,function(){var{fetchSyncPost:e}=require(`siyuan`);async function t(t,n){let r=await e(t,n);return r.code===0?r.data:null}async function n(e,n,r,i,a){return t(`/api/block/insertBlock`,{dataType:e,data:n,nextID:r,previousID:i,parentID:a})}async function r(e,n,r){return t(`/api/block/updateBlock`,{dataType:e,data:n,id:r})}async function i(e,n){return t(`/api/attr/setBlockAttrs`,{id:e,attrs:n})}async function a(e){return t(`/api/query/sql`,{stmt:e})}var{Plugin:o}=require(`siyuan`),s=`custom-audio_id`,c=class extends o{async onload(){this.addCommand({hotkey:``,langKey:`转化所有音频为文本`,langText:`转化所有音频为文本`,callback:()=>{this.audio2text()}});var e=(()=>{var e=new MutationObserver(e=>{e.forEach(e=>{e.type===`childList`&&e.addedNodes.forEach(e=>{if(e instanceof HTMLElement&&e?.dataset.type===`NodeAudio`){let t=document.createElement(`button`);t.innerText=`🔄️`,t.contentEditable=`false`,t.style.marginLeft=`10px`,e.appendChild(t),this.onunloadFn.push(()=>t.remove()),t.onclick=async()=>{let n=(await a(`select * from blocks where id = "${e?.dataset.nodeId}"`))[0];await l(n),t.innerText=`🔄️`}}})})});return e.observe(document.body,{childList:!0,subtree:!0}),e})();this.onunloadFn.push(()=>e.disconnect())}async audio2text(){let e=await a(`
    SELECT * FROM blocks AS b
    WHERE
      b.type ="audio"
        AND
      NOT EXISTS (
        SELECT 1
        FROM attributes AS a
        WHERE a.block_id = b.id AND a."name" = "custom-text"
      )
    `);await Promise.all(e.map(l))}onunloadFn=[];async onunload(){this.onunloadFn.forEach(e=>e())}};async function l(e){let t=await u(await fetch(e.content).then(e=>e.arrayBuffer()));await i(e.id,{"custom-text":t});let o=(await a(`
    SELECT * FROM attributes
    WHERE "name" ="${s}" AND VALUE = "${e.id}"`))[0];o===void 0?await n(`markdown`,d(e,t),void 0,e.id):await r(`markdown`,d(e,t),o.block_id)}async function u(e){return`识别结果测试`+new Date().toLocaleString()}function d(e,t){return`${t}\n{: ${s}="${e.id}" style="text-align: center;"}`}return c});