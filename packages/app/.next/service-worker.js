try{self["workbox:core:5.1.3"]&&_()}catch(e){}const e=(e,...t)=>{let s=e;return t.length>0&&(s+=" :: "+JSON.stringify(t)),s};class t extends Error{constructor(t,s){super(e(t,s)),this.name=t,this.details=s}}try{self["workbox:routing:5.1.3"]&&_()}catch(e){}const s=e=>e&&"object"==typeof e?e:{handle:e};class n{constructor(e,t,n="GET"){this.handler=s(t),this.match=e,this.method=n}}class i extends n{constructor(e,t,s){super(({url:t})=>{const s=e.exec(t.href);if(s&&(t.origin===location.origin||0===s.index))return s.slice(1)},t,s)}}const c=e=>new URL(String(e),location.href).href.replace(new RegExp("^"+location.origin),"");class a{constructor(){this.t=new Map}get routes(){return this.t}addFetchListener(){self.addEventListener("fetch",e=>{const{request:t}=e,s=this.handleRequest({request:t,event:e});s&&e.respondWith(s)})}addCacheListener(){self.addEventListener("message",e=>{if(e.data&&"CACHE_URLS"===e.data.type){const{payload:t}=e.data,s=Promise.all(t.urlsToCache.map(e=>{"string"==typeof e&&(e=[e]);const t=new Request(...e);return this.handleRequest({request:t})}));e.waitUntil(s),e.ports&&e.ports[0]&&s.then(()=>e.ports[0].postMessage(!0))}})}handleRequest({request:e,event:t}){const s=new URL(e.url,location.href);if(!s.protocol.startsWith("http"))return;const{params:n,route:i}=this.findMatchingRoute({url:s,request:e,event:t});let c,a=i&&i.handler;if(!a&&this.s&&(a=this.s),a){try{c=a.handle({url:s,request:e,event:t,params:n})}catch(e){c=Promise.reject(e)}return c instanceof Promise&&this.i&&(c=c.catch(n=>this.i.handle({url:s,request:e,event:t}))),c}}findMatchingRoute({url:e,request:t,event:s}){const n=this.t.get(t.method)||[];for(const i of n){let n;const c=i.match({url:e,request:t,event:s});if(c)return n=c,(Array.isArray(c)&&0===c.length||c.constructor===Object&&0===Object.keys(c).length||"boolean"==typeof c)&&(n=void 0),{route:i,params:n}}return{}}setDefaultHandler(e){this.s=s(e)}setCatchHandler(e){this.i=s(e)}registerRoute(e){this.t.has(e.method)||this.t.set(e.method,[]),this.t.get(e.method).push(e)}unregisterRoute(e){if(!this.t.has(e.method))throw new t("unregister-route-but-not-found-with-method",{method:e.method});const s=this.t.get(e.method).indexOf(e);if(!(s>-1))throw new t("unregister-route-route-not-registered");this.t.get(e.method).splice(s,1)}}let r;const o=()=>(r||(r=new a,r.addFetchListener(),r.addCacheListener()),r);const f={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"workbox",runtime:"runtime",suffix:"undefined"!=typeof registration?registration.scope:""},u=e=>[f.prefix,e,f.suffix].filter(e=>e&&e.length>0).join("-"),h=e=>e||u(f.precache),d=e=>e||u(f.runtime);function l(e){e.then(()=>{})}const b=new Set;class w{constructor(e,t,{onupgradeneeded:s,onversionchange:n}={}){this.o=null,this.u=e,this.h=t,this.l=s,this.p=n||(()=>this.close())}get db(){return this.o}async open(){if(!this.o)return this.o=await new Promise((e,t)=>{let s=!1;setTimeout(()=>{s=!0,t(new Error("The open request was blocked and timed out"))},this.OPEN_TIMEOUT);const n=indexedDB.open(this.u,this.h);n.onerror=()=>t(n.error),n.onupgradeneeded=e=>{s?(n.transaction.abort(),n.result.close()):"function"==typeof this.l&&this.l(e)},n.onsuccess=()=>{const t=n.result;s?t.close():(t.onversionchange=this.p.bind(this),e(t))}}),this}async getKey(e,t){return(await this.getAllKeys(e,t,1))[0]}async getAll(e,t,s){return await this.getAllMatching(e,{query:t,count:s})}async getAllKeys(e,t,s){return(await this.getAllMatching(e,{query:t,count:s,includeKeys:!0})).map(e=>e.key)}async getAllMatching(e,{index:t,query:s=null,direction:n="next",count:i,includeKeys:c=!1}={}){return await this.transaction([e],"readonly",(a,r)=>{const o=a.objectStore(e),f=t?o.index(t):o,u=[],h=f.openCursor(s,n);h.onsuccess=()=>{const e=h.result;e?(u.push(c?e:e.value),i&&u.length>=i?r(u):e.continue()):r(u)}})}async transaction(e,t,s){return await this.open(),await new Promise((n,i)=>{const c=this.o.transaction(e,t);c.onabort=()=>i(c.error),c.oncomplete=()=>n(),s(c,e=>n(e))})}async g(e,t,s,...n){return await this.transaction([t],s,(s,i)=>{const c=s.objectStore(t),a=c[e].apply(c,n);a.onsuccess=()=>i(a.result)})}close(){this.o&&(this.o.close(),this.o=null)}}w.prototype.OPEN_TIMEOUT=2e3;const p={readonly:["get","count","getKey","getAll","getAllKeys"],readwrite:["add","put","clear","delete"]};for(const[e,t]of Object.entries(p))for(const s of t)s in IDBObjectStore.prototype&&(w.prototype[s]=async function(t,...n){return await this.g(s,t,e,...n)});try{self["workbox:expiration:5.1.3"]&&_()}catch(e){}const y=e=>{const t=new URL(e,location.href);return t.hash="",t.href};class g{constructor(e){this.m=e,this.o=new w("workbox-expiration",1,{onupgradeneeded:e=>this.v(e)})}v(e){const t=e.target.result.createObjectStore("cache-entries",{keyPath:"id"});t.createIndex("cacheName","cacheName",{unique:!1}),t.createIndex("timestamp","timestamp",{unique:!1}),(async e=>{await new Promise((t,s)=>{const n=indexedDB.deleteDatabase(e);n.onerror=()=>{s(n.error)},n.onblocked=()=>{s(new Error("Delete blocked"))},n.onsuccess=()=>{t()}})})(this.m)}async setTimestamp(e,t){const s={url:e=y(e),timestamp:t,cacheName:this.m,id:this._(e)};await this.o.put("cache-entries",s)}async getTimestamp(e){return(await this.o.get("cache-entries",this._(e))).timestamp}async expireEntries(e,t){const s=await this.o.transaction("cache-entries","readwrite",(s,n)=>{const i=s.objectStore("cache-entries").index("timestamp").openCursor(null,"prev"),c=[];let a=0;i.onsuccess=()=>{const s=i.result;if(s){const n=s.value;n.cacheName===this.m&&(e&&n.timestamp<e||t&&a>=t?c.push(s.value):a++),s.continue()}else n(c)}}),n=[];for(const e of s)await this.o.delete("cache-entries",e.id),n.push(e.url);return n}_(e){return this.m+"|"+y(e)}}class m{constructor(e,t={}){this.q=!1,this.j=!1,this.R=t.maxEntries,this.U=t.maxAgeSeconds,this.m=e,this.k=new g(e)}async expireEntries(){if(this.q)return void(this.j=!0);this.q=!0;const e=this.U?Date.now()-1e3*this.U:0,t=await this.k.expireEntries(e,this.R),s=await self.caches.open(this.m);for(const e of t)await s.delete(e);this.q=!1,this.j&&(this.j=!1,l(this.expireEntries()))}async updateTimestamp(e){await this.k.setTimestamp(e,Date.now())}async isURLExpired(e){if(this.U){return await this.k.getTimestamp(e)<Date.now()-1e3*this.U}return!1}async delete(){this.j=!1,await this.k.expireEntries(1/0)}}const v=(e,t)=>e.filter(e=>t in e),q=async({request:e,mode:t,plugins:s=[]})=>{const n=v(s,"cacheKeyWillBeUsed");let i=e;for(const e of n)i=await e.cacheKeyWillBeUsed.call(e,{mode:t,request:i}),"string"==typeof i&&(i=new Request(i));return i},x=async({cacheName:e,request:t,event:s,matchOptions:n,plugins:i=[]})=>{const c=await self.caches.open(e),a=await q({plugins:i,request:t,mode:"read"});let r=await c.match(a,n);for(const t of i)if("cachedResponseWillBeUsed"in t){const i=t.cachedResponseWillBeUsed;r=await i.call(t,{cacheName:e,event:s,matchOptions:n,cachedResponse:r,request:a})}return r},j=async({cacheName:e,request:s,response:n,event:i,plugins:a=[],matchOptions:r})=>{const o=await q({plugins:a,request:s,mode:"write"});if(!n)throw new t("cache-put-with-no-response",{url:c(o.url)});const f=await(async({request:e,response:t,event:s,plugins:n=[]})=>{let i=t,c=!1;for(const t of n)if("cacheWillUpdate"in t){c=!0;const n=t.cacheWillUpdate;if(i=await n.call(t,{request:e,response:i,event:s}),!i)break}return c||(i=i&&200===i.status?i:void 0),i||null})({event:i,plugins:a,response:n,request:o});if(!f)return;const u=await self.caches.open(e),h=v(a,"cacheDidUpdate"),d=h.length>0?await x({cacheName:e,matchOptions:r,request:o}):null;try{await u.put(o,f)}catch(e){throw"QuotaExceededError"===e.name&&await async function(){for(const e of b)await e()}(),e}for(const t of h)await t.cacheDidUpdate.call(t,{cacheName:e,event:i,oldResponse:d,newResponse:f,request:o})},R=x,U=async({request:e,fetchOptions:s,event:n,plugins:i=[]})=>{if("string"==typeof e&&(e=new Request(e)),n instanceof FetchEvent&&n.preloadResponse){const e=await n.preloadResponse;if(e)return e}const c=v(i,"fetchDidFail"),a=c.length>0?e.clone():null;try{for(const t of i)if("requestWillFetch"in t){const s=t.requestWillFetch,i=e.clone();e=await s.call(t,{request:i,event:n})}}catch(e){throw new t("plugin-error-request-will-fetch",{thrownError:e})}const r=e.clone();try{let t;t="navigate"===e.mode?await fetch(e):await fetch(e,s);for(const e of i)"fetchDidSucceed"in e&&(t=await e.fetchDidSucceed.call(e,{event:n,request:r,response:t}));return t}catch(e){for(const t of c)await t.fetchDidFail.call(t,{error:e,event:n,originalRequest:a.clone(),request:r.clone()});throw e}};try{self["workbox:strategies:5.1.3"]&&_()}catch(e){}const k={cacheWillUpdate:async({response:e})=>200===e.status||0===e.status?e:null};let L;async function K(e,t){const s=e.clone(),n={headers:new Headers(s.headers),status:s.status,statusText:s.statusText},i=t?t(n):n,c=function(){if(void 0===L){const e=new Response("");if("body"in e)try{new Response(e.body),L=!0}catch(e){L=!1}L=!1}return L}()?s.body:await s.blob();return new Response(c,i)}try{self["workbox:precaching:5.1.3"]&&_()}catch(e){}function D(e){if(!e)throw new t("add-to-cache-list-unexpected-type",{entry:e});if("string"==typeof e){const t=new URL(e,location.href);return{cacheKey:t.href,url:t.href}}const{revision:s,url:n}=e;if(!n)throw new t("add-to-cache-list-unexpected-type",{entry:e});if(!s){const e=new URL(n,location.href);return{cacheKey:e.href,url:e.href}}const i=new URL(n,location.href),c=new URL(n,location.href);return i.searchParams.set("__WB_REVISION__",s),{cacheKey:i.href,url:c.href}}class C{constructor(e){this.m=h(e),this.L=new Map,this.K=new Map,this.D=new Map}addToCacheList(e){const s=[];for(const n of e){"string"==typeof n?s.push(n):n&&void 0===n.revision&&s.push(n.url);const{cacheKey:e,url:i}=D(n),c="string"!=typeof n&&n.revision?"reload":"default";if(this.L.has(i)&&this.L.get(i)!==e)throw new t("add-to-cache-list-conflicting-entries",{firstEntry:this.L.get(i),secondEntry:e});if("string"!=typeof n&&n.integrity){if(this.D.has(e)&&this.D.get(e)!==n.integrity)throw new t("add-to-cache-list-conflicting-integrities",{url:i});this.D.set(e,n.integrity)}if(this.L.set(i,e),this.K.set(i,c),s.length>0){const e=`Workbox is precaching URLs without revision info: ${s.join(", ")}\nThis is generally NOT safe. Learn more at https://bit.ly/wb-precache`;console.warn(e)}}}async install({event:e,plugins:t}={}){const s=[],n=[],i=await self.caches.open(this.m),c=await i.keys(),a=new Set(c.map(e=>e.url));for(const[e,t]of this.L)a.has(t)?n.push(e):s.push({cacheKey:t,url:e});const r=s.map(({cacheKey:s,url:n})=>{const i=this.D.get(s),c=this.K.get(n);return this.C({cacheKey:s,cacheMode:c,event:e,integrity:i,plugins:t,url:n})});await Promise.all(r);return{updatedURLs:s.map(e=>e.url),notUpdatedURLs:n}}async activate(){const e=await self.caches.open(this.m),t=await e.keys(),s=new Set(this.L.values()),n=[];for(const i of t)s.has(i.url)||(await e.delete(i),n.push(i.url));return{deletedURLs:n}}async C({cacheKey:e,url:s,cacheMode:n,event:i,plugins:c,integrity:a}){const r=new Request(s,{integrity:a,cache:n,credentials:"same-origin"});let o,f=await U({event:i,plugins:c,request:r});for(const e of c||[])"cacheWillUpdate"in e&&(o=e);if(!(o?await o.cacheWillUpdate({event:i,request:r,response:f}):f.status<400))throw new t("bad-precaching-response",{url:s,status:f.status});f.redirected&&(f=await K(f)),await j({event:i,plugins:c,response:f,request:e===s?r:new Request(e),cacheName:this.m,matchOptions:{ignoreSearch:!0}})}getURLsToCacheKeys(){return this.L}getCachedURLs(){return[...this.L.keys()]}getCacheKeyForURL(e){const t=new URL(e,location.href);return this.L.get(t.href)}async matchPrecache(e){const t=e instanceof Request?e.url:e,s=this.getCacheKeyForURL(t);if(s){return(await self.caches.open(this.m)).match(s)}}createHandler(e=!0){return async({request:s})=>{try{const e=await this.matchPrecache(s);if(e)return e;throw new t("missing-precache-entry",{cacheName:this.m,url:s instanceof Request?s.url:s})}catch(t){if(e)return fetch(s);throw t}}}createHandlerBoundToURL(e,s=!0){if(!this.getCacheKeyForURL(e))throw new t("non-precached-url",{url:e});const n=this.createHandler(s),i=new Request(e);return()=>n({request:i})}}let N;const S=()=>(N||(N=new C),N);const W=(e,t)=>{const s=S().getURLsToCacheKeys();for(const n of function*(e,{ignoreURLParametersMatching:t,directoryIndex:s,cleanURLs:n,urlManipulation:i}={}){const c=new URL(e,location.href);c.hash="",yield c.href;const a=function(e,t=[]){for(const s of[...e.searchParams.keys()])t.some(e=>e.test(s))&&e.searchParams.delete(s);return e}(c,t);if(yield a.href,s&&a.pathname.endsWith("/")){const e=new URL(a.href);e.pathname+=s,yield e.href}if(n){const e=new URL(a.href);e.pathname+=".html",yield e.href}if(i){const e=i({url:c});for(const t of e)yield t.href}}(e,t)){const e=s.get(n);if(e)return e}};let E=!1;function H(e){E||((({ignoreURLParametersMatching:e=[/^utm_/],directoryIndex:t="index.html",cleanURLs:s=!0,urlManipulation:n}={})=>{const i=h();self.addEventListener("fetch",c=>{const a=W(c.request.url,{cleanURLs:s,directoryIndex:t,ignoreURLParametersMatching:e,urlManipulation:n});if(!a)return;let r=self.caches.open(i).then(e=>e.match(a)).then(e=>e||fetch(a));c.respondWith(r)})})(e),E=!0)}const M=[],T={get:()=>M,add(e){M.push(...e)}},P=e=>{const t=S(),s=T.get();e.waitUntil(t.install({event:e,plugins:s}).catch(e=>{throw e}))},G=e=>{const t=S();e.waitUntil(t.activate())};var O;self.addEventListener("message",e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()}),O={},function(e){S().addToCacheList(e),e.length>0&&(self.addEventListener("install",P),self.addEventListener("activate",G))}([{url:"_next/static/9S6lJjU_GD032WKbqH-oC/_buildManifest.js",revision:"165989fb6161e9b7916fe529d2bda615"},{url:"_next/static/9S6lJjU_GD032WKbqH-oC/_ssgManifest.js",revision:"abee47769bf307639ace4945f9cfd4ff"},{url:"_next/static/9S6lJjU_GD032WKbqH-oC/pages/_app.js",revision:"520db115ee7efd5ef36914da5ce92036"},{url:"_next/static/9S6lJjU_GD032WKbqH-oC/pages/_error.js",revision:"0827f6428561a9d28eb8c9497af9f2b9"},{url:"_next/static/9S6lJjU_GD032WKbqH-oC/pages/course/[cid]/course_overrides.js",revision:"84f6097438820ef2bb0f4d5e0c9f2d1a"},{url:"_next/static/9S6lJjU_GD032WKbqH-oC/pages/course/[cid]/queue/[qid].js",revision:"3b2284650e3b5e3cbf6d31661f961f4d"},{url:"_next/static/9S6lJjU_GD032WKbqH-oC/pages/course/[cid]/schedule.js",revision:"56d97b54b6a0ebdfbc5f8f80032a97c6"},{url:"_next/static/9S6lJjU_GD032WKbqH-oC/pages/course/[cid]/today.js",revision:"07dd1331d53779be9c66f66918a66d14"},{url:"_next/static/9S6lJjU_GD032WKbqH-oC/pages/dev.js",revision:"b94024723d8f16d7d215233ff509f15a"},{url:"_next/static/9S6lJjU_GD032WKbqH-oC/pages/index.js",revision:"b8d327a25664392e91930ea43f630dcd"},{url:"_next/static/9S6lJjU_GD032WKbqH-oC/pages/login.js",revision:"4126eafdbe4a8758fc378f738a821777"},{url:"_next/static/9S6lJjU_GD032WKbqH-oC/pages/nocourses.js",revision:"9a922d7107eae5af02b297b90820c105"},{url:"_next/static/9S6lJjU_GD032WKbqH-oC/pages/settings.js",revision:"c5e52006d10a6f4d7a54a68c2100d87e"},{url:"_next/static/chunks/0d67964bf13e5ab2c03c5e39d0e808a13591419b.772f35a82498f7b19b0c.js",revision:"863c0401290e488199f0e5066896c09d"},{url:"_next/static/chunks/12dc576c387ab9640c898f753bcecc989a9cce34.a19e18f911bef145edcd.js",revision:"3aee83e6ce67bc5390ee4fe871fe3e49"},{url:"_next/static/chunks/29107295.8007f4499acc1bea4d2b.js",revision:"cbfd6cc2bfe1dd2859ce6257974dd068"},{url:"_next/static/chunks/38b846eb288fabd68b7f07617effd9f71cd34414.372e1928c575f3c94e68.js",revision:"8b45a370b071f1db56d7b95348487b94"},{url:"_next/static/chunks/41cebf42b25cc9e60963ee337be38e2f610c38ce.9708f84493aff45b242d.js",revision:"662693968ee5ee3789908afc4cc78b04"},{url:"_next/static/chunks/5e1c1fe19b943ca867af90191006a9731e6b969f.475aa6618c25f93d0df1.js",revision:"83e259097770e7856befa2dae7067bfc"},{url:"_next/static/chunks/6172bd9fcdaf7634530dff6b395da2fbf28950fe.72bf1e1383a281ff2615.js",revision:"2c17b060f548340c9ee89f202d3bfca5"},{url:"_next/static/chunks/6af2cf8fd5e0ea42ea2ca50319a512de014c2206.4a3221dbec4bad64f9c4.js",revision:"2d7cea8a1c82058ef0550f77a941264a"},{url:"_next/static/chunks/7a83d7bd323b85c63776c569cd20d47142ae1f90.af22aa0fdf89a700808c.js",revision:"bd539e386f5cf436a26ec7ddb16282f7"},{url:"_next/static/chunks/7b617b86408f54da06bf0b0a4921868e63811274.f88773aed99909610f92.js",revision:"83f6c3ef7b217037494202c602ecd59d"},{url:"_next/static/chunks/8ad8ba9c430a5f1ddfe2980ecb4ac99fd6f29d8a.0b6be8f9b77e8ffd13d2.js",revision:"903a85c71c5b745170210f34e1ef9a8b"},{url:"_next/static/chunks/9b7841ccee238432392078b6d15408a7f9d0bb70.4639049178c3169658e2.js",revision:"a68412d00123860603430169a6a27fac"},{url:"_next/static/chunks/a29ae703.42bd497555d899daf3d4.js",revision:"d9b24a664a7b32dc0e464367e545693e"},{url:"_next/static/chunks/a9e92423822d6eca53ff66155ca057db18a26a18.40c67a5873e125ca51e6.js",revision:"e5f56f2da639ef1b797ef868dcf9b2c0"},{url:"_next/static/chunks/b3dd4c6618c3012f1de11c6bbfa41a3b53f77df1.1a9d9513fcf8cdc8345f.js",revision:"c53808433a12935158667238e3c628a3"},{url:"_next/static/chunks/c96b4d7e.ff4871388b9ad0566c3b.js",revision:"e7b125b8347adb4ed17b666bc76685ff"},{url:"_next/static/chunks/cc9165237444c2cd47d4a3e511ac9d78e0341ca4.5c43b80c0263428e67c4.js",revision:"04968f5e4d8f9562e82f66ada31a0102"},{url:"_next/static/chunks/commons.e96400741ceb9e7ee352.js",revision:"ff9d7f0530384910f4e3bf182dd0763e"},{url:"_next/static/chunks/ecb1ceeb21648ffb150541cc4ef009fef392504b.d1c581c24484139f5d00.js",revision:"d5b0787c4637006a21e95ba3c54b1140"},{url:"_next/static/chunks/ed7838f2f2c3accb94f3482ee7f978f5f66b3472.143de284a47b7a725d73.js",revision:"0cb530de0fead643791c6cd84b8ef6c6"},{url:"_next/static/chunks/fc8d00fd.158594bfc26fc793d03b.js",revision:"718970d88a7e977d8c1fe92cb6b7c698"},{url:"_next/static/chunks/framework.ecbd939e3f22c21530d6.js",revision:"f1f44d4b846ef72b49ca7ba18b1f46ed"},{url:"_next/static/css/0b10e9f32b7d87c5b5ed.css",revision:"9b6bf2b0849057358aaaeb0dd19e37db"},{url:"_next/static/css/20de8917c44a516a459d.css",revision:"9a8cd95b5f951cd1c4dfc2843aaa0909"},{url:"_next/static/runtime/main-e3d3bfc2aa5306ba04a6.js",revision:"8acf0016fc4df14d7c70bdef2f30f7e9"},{url:"_next/static/runtime/polyfills-129b8641b84b21697221.js",revision:"5f0b0318c90f1e0cdedbb1097ad94f47"},{url:"_next/static/runtime/webpack-1c5199ff66550d26e499.js",revision:"029ee2e7063b1566925082c49e4afc45"}]),H(O),function(e,s,c){let a;if("string"==typeof e){const t=new URL(e,location.href);a=new n(({url:e})=>e.href===t.href,s,c)}else if(e instanceof RegExp)a=new i(e,s,c);else if("function"==typeof e)a=new n(e,s,c);else{if(!(e instanceof n))throw new t("unsupported-route-type",{moduleName:"workbox-routing",funcName:"registerRoute",paramName:"capture"});a=e}o().registerRoute(a)}(/^https?.*/,new class{constructor(e={}){if(this.m=d(e.cacheName),e.plugins){const t=e.plugins.some(e=>!!e.cacheWillUpdate);this.N=t?e.plugins:[k,...e.plugins]}else this.N=[k];this.S=e.networkTimeoutSeconds||0,this.W=e.fetchOptions,this.H=e.matchOptions}async handle({event:e,request:s}){const n=[];"string"==typeof s&&(s=new Request(s));const i=[];let c;if(this.S){const{id:t,promise:a}=this.M({request:s,event:e,logs:n});c=t,i.push(a)}const a=this.T({timeoutId:c,request:s,event:e,logs:n});i.push(a);let r=await Promise.race(i);if(r||(r=await a),!r)throw new t("no-response",{url:s.url});return r}M({request:e,logs:t,event:s}){let n;return{promise:new Promise(t=>{n=setTimeout(async()=>{t(await this.P({request:e,event:s}))},1e3*this.S)}),id:n}}async T({timeoutId:e,request:t,logs:s,event:n}){let i,c;try{c=await U({request:t,event:n,fetchOptions:this.W,plugins:this.N})}catch(e){i=e}if(e&&clearTimeout(e),i||!c)c=await this.P({request:t,event:n});else{const e=c.clone(),s=j({cacheName:this.m,request:t,response:e,event:n,plugins:this.N});if(n)try{n.waitUntil(s)}catch(e){}}return c}P({event:e,request:t}){return R({cacheName:this.m,request:t,event:e,matchOptions:this.H,plugins:this.N})}}({cacheName:"offlineCache",plugins:[new class{constructor(e={}){var t;this.cachedResponseWillBeUsed=async({event:e,request:t,cacheName:s,cachedResponse:n})=>{if(!n)return null;const i=this.G(n),c=this.O(s);l(c.expireEntries());const a=c.updateTimestamp(t.url);if(e)try{e.waitUntil(a)}catch(e){}return i?n:null},this.cacheDidUpdate=async({cacheName:e,request:t})=>{const s=this.O(e);await s.updateTimestamp(t.url),await s.expireEntries()},this.J=e,this.U=e.maxAgeSeconds,this.I=new Map,e.purgeOnQuotaError&&(t=()=>this.deleteCacheAndMetadata(),b.add(t))}O(e){if(e===d())throw new t("expire-custom-caches-only");let s=this.I.get(e);return s||(s=new m(e,this.J),this.I.set(e,s)),s}G(e){if(!this.U)return!0;const t=this.A(e);if(null===t)return!0;return t>=Date.now()-1e3*this.U}A(e){if(!e.headers.has("date"))return null;const t=e.headers.get("date"),s=new Date(t).getTime();return isNaN(s)?null:s}async deleteCacheAndMetadata(){for(const[e,t]of this.I)await self.caches.delete(e),await t.delete();this.I=new Map}}({maxEntries:200,purgeOnQuotaError:!0})]}),"GET");
//# sourceMappingURL=service-worker.js.map
