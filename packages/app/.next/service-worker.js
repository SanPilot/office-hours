try{self["workbox:core:5.1.3"]&&_()}catch(e){}const e=(e,...t)=>{let s=e;return t.length>0&&(s+=" :: "+JSON.stringify(t)),s};class t extends Error{constructor(t,s){super(e(t,s)),this.name=t,this.details=s}}try{self["workbox:routing:5.1.3"]&&_()}catch(e){}const s=e=>e&&"object"==typeof e?e:{handle:e};class n{constructor(e,t,n="GET"){this.handler=s(t),this.match=e,this.method=n}}class c extends n{constructor(e,t,s){super(({url:t})=>{const s=e.exec(t.href);if(s&&(t.origin===location.origin||0===s.index))return s.slice(1)},t,s)}}const i=e=>new URL(String(e),location.href).href.replace(new RegExp("^"+location.origin),"");class a{constructor(){this.t=new Map}get routes(){return this.t}addFetchListener(){self.addEventListener("fetch",e=>{const{request:t}=e,s=this.handleRequest({request:t,event:e});s&&e.respondWith(s)})}addCacheListener(){self.addEventListener("message",e=>{if(e.data&&"CACHE_URLS"===e.data.type){const{payload:t}=e.data,s=Promise.all(t.urlsToCache.map(e=>{"string"==typeof e&&(e=[e]);const t=new Request(...e);return this.handleRequest({request:t})}));e.waitUntil(s),e.ports&&e.ports[0]&&s.then(()=>e.ports[0].postMessage(!0))}})}handleRequest({request:e,event:t}){const s=new URL(e.url,location.href);if(!s.protocol.startsWith("http"))return;const{params:n,route:c}=this.findMatchingRoute({url:s,request:e,event:t});let i,a=c&&c.handler;if(!a&&this.s&&(a=this.s),a){try{i=a.handle({url:s,request:e,event:t,params:n})}catch(e){i=Promise.reject(e)}return i instanceof Promise&&this.i&&(i=i.catch(n=>this.i.handle({url:s,request:e,event:t}))),i}}findMatchingRoute({url:e,request:t,event:s}){const n=this.t.get(t.method)||[];for(const c of n){let n;const i=c.match({url:e,request:t,event:s});if(i)return n=i,(Array.isArray(i)&&0===i.length||i.constructor===Object&&0===Object.keys(i).length||"boolean"==typeof i)&&(n=void 0),{route:c,params:n}}return{}}setDefaultHandler(e){this.s=s(e)}setCatchHandler(e){this.i=s(e)}registerRoute(e){this.t.has(e.method)||this.t.set(e.method,[]),this.t.get(e.method).push(e)}unregisterRoute(e){if(!this.t.has(e.method))throw new t("unregister-route-but-not-found-with-method",{method:e.method});const s=this.t.get(e.method).indexOf(e);if(!(s>-1))throw new t("unregister-route-route-not-registered");this.t.get(e.method).splice(s,1)}}let r;const o=()=>(r||(r=new a,r.addFetchListener(),r.addCacheListener()),r);const u={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"workbox",runtime:"runtime",suffix:"undefined"!=typeof registration?registration.scope:""},f=e=>[u.prefix,e,u.suffix].filter(e=>e&&e.length>0).join("-"),h=e=>e||f(u.precache),d=e=>e||f(u.runtime);function l(e){e.then(()=>{})}const b=new Set;class w{constructor(e,t,{onupgradeneeded:s,onversionchange:n}={}){this.o=null,this.u=e,this.h=t,this.l=s,this.p=n||(()=>this.close())}get db(){return this.o}async open(){if(!this.o)return this.o=await new Promise((e,t)=>{let s=!1;setTimeout(()=>{s=!0,t(new Error("The open request was blocked and timed out"))},this.OPEN_TIMEOUT);const n=indexedDB.open(this.u,this.h);n.onerror=()=>t(n.error),n.onupgradeneeded=e=>{s?(n.transaction.abort(),n.result.close()):"function"==typeof this.l&&this.l(e)},n.onsuccess=()=>{const t=n.result;s?t.close():(t.onversionchange=this.p.bind(this),e(t))}}),this}async getKey(e,t){return(await this.getAllKeys(e,t,1))[0]}async getAll(e,t,s){return await this.getAllMatching(e,{query:t,count:s})}async getAllKeys(e,t,s){return(await this.getAllMatching(e,{query:t,count:s,includeKeys:!0})).map(e=>e.key)}async getAllMatching(e,{index:t,query:s=null,direction:n="next",count:c,includeKeys:i=!1}={}){return await this.transaction([e],"readonly",(a,r)=>{const o=a.objectStore(e),u=t?o.index(t):o,f=[],h=u.openCursor(s,n);h.onsuccess=()=>{const e=h.result;e?(f.push(i?e:e.value),c&&f.length>=c?r(f):e.continue()):r(f)}})}async transaction(e,t,s){return await this.open(),await new Promise((n,c)=>{const i=this.o.transaction(e,t);i.onabort=()=>c(i.error),i.oncomplete=()=>n(),s(i,e=>n(e))})}async g(e,t,s,...n){return await this.transaction([t],s,(s,c)=>{const i=s.objectStore(t),a=i[e].apply(i,n);a.onsuccess=()=>c(a.result)})}close(){this.o&&(this.o.close(),this.o=null)}}w.prototype.OPEN_TIMEOUT=2e3;const p={readonly:["get","count","getKey","getAll","getAllKeys"],readwrite:["add","put","clear","delete"]};for(const[e,t]of Object.entries(p))for(const s of t)s in IDBObjectStore.prototype&&(w.prototype[s]=async function(t,...n){return await this.g(s,t,e,...n)});try{self["workbox:expiration:5.1.3"]&&_()}catch(e){}const y=e=>{const t=new URL(e,location.href);return t.hash="",t.href};class g{constructor(e){this.m=e,this.o=new w("workbox-expiration",1,{onupgradeneeded:e=>this.v(e)})}v(e){const t=e.target.result.createObjectStore("cache-entries",{keyPath:"id"});t.createIndex("cacheName","cacheName",{unique:!1}),t.createIndex("timestamp","timestamp",{unique:!1}),(async e=>{await new Promise((t,s)=>{const n=indexedDB.deleteDatabase(e);n.onerror=()=>{s(n.error)},n.onblocked=()=>{s(new Error("Delete blocked"))},n.onsuccess=()=>{t()}})})(this.m)}async setTimestamp(e,t){const s={url:e=y(e),timestamp:t,cacheName:this.m,id:this._(e)};await this.o.put("cache-entries",s)}async getTimestamp(e){return(await this.o.get("cache-entries",this._(e))).timestamp}async expireEntries(e,t){const s=await this.o.transaction("cache-entries","readwrite",(s,n)=>{const c=s.objectStore("cache-entries").index("timestamp").openCursor(null,"prev"),i=[];let a=0;c.onsuccess=()=>{const s=c.result;if(s){const n=s.value;n.cacheName===this.m&&(e&&n.timestamp<e||t&&a>=t?i.push(s.value):a++),s.continue()}else n(i)}}),n=[];for(const e of s)await this.o.delete("cache-entries",e.id),n.push(e.url);return n}_(e){return this.m+"|"+y(e)}}class m{constructor(e,t={}){this.q=!1,this.L=!1,this.R=t.maxEntries,this.j=t.maxAgeSeconds,this.m=e,this.U=new g(e)}async expireEntries(){if(this.q)return void(this.L=!0);this.q=!0;const e=this.j?Date.now()-1e3*this.j:0,t=await this.U.expireEntries(e,this.R),s=await self.caches.open(this.m);for(const e of t)await s.delete(e);this.q=!1,this.L&&(this.L=!1,l(this.expireEntries()))}async updateTimestamp(e){await this.U.setTimestamp(e,Date.now())}async isURLExpired(e){if(this.j){return await this.U.getTimestamp(e)<Date.now()-1e3*this.j}return!1}async delete(){this.L=!1,await this.U.expireEntries(1/0)}}const v=(e,t)=>e.filter(e=>t in e),x=async({request:e,mode:t,plugins:s=[]})=>{const n=v(s,"cacheKeyWillBeUsed");let c=e;for(const e of n)c=await e.cacheKeyWillBeUsed.call(e,{mode:t,request:c}),"string"==typeof c&&(c=new Request(c));return c},q=async({cacheName:e,request:t,event:s,matchOptions:n,plugins:c=[]})=>{const i=await self.caches.open(e),a=await x({plugins:c,request:t,mode:"read"});let r=await i.match(a,n);for(const t of c)if("cachedResponseWillBeUsed"in t){const c=t.cachedResponseWillBeUsed;r=await c.call(t,{cacheName:e,event:s,matchOptions:n,cachedResponse:r,request:a})}return r},L=async({cacheName:e,request:s,response:n,event:c,plugins:a=[],matchOptions:r})=>{const o=await x({plugins:a,request:s,mode:"write"});if(!n)throw new t("cache-put-with-no-response",{url:i(o.url)});const u=await(async({request:e,response:t,event:s,plugins:n=[]})=>{let c=t,i=!1;for(const t of n)if("cacheWillUpdate"in t){i=!0;const n=t.cacheWillUpdate;if(c=await n.call(t,{request:e,response:c,event:s}),!c)break}return i||(c=c&&200===c.status?c:void 0),c||null})({event:c,plugins:a,response:n,request:o});if(!u)return;const f=await self.caches.open(e),h=v(a,"cacheDidUpdate"),d=h.length>0?await q({cacheName:e,matchOptions:r,request:o}):null;try{await f.put(o,u)}catch(e){throw"QuotaExceededError"===e.name&&await async function(){for(const e of b)await e()}(),e}for(const t of h)await t.cacheDidUpdate.call(t,{cacheName:e,event:c,oldResponse:d,newResponse:u,request:o})},R=q,j=async({request:e,fetchOptions:s,event:n,plugins:c=[]})=>{if("string"==typeof e&&(e=new Request(e)),n instanceof FetchEvent&&n.preloadResponse){const e=await n.preloadResponse;if(e)return e}const i=v(c,"fetchDidFail"),a=i.length>0?e.clone():null;try{for(const t of c)if("requestWillFetch"in t){const s=t.requestWillFetch,c=e.clone();e=await s.call(t,{request:c,event:n})}}catch(e){throw new t("plugin-error-request-will-fetch",{thrownError:e})}const r=e.clone();try{let t;t="navigate"===e.mode?await fetch(e):await fetch(e,s);for(const e of c)"fetchDidSucceed"in e&&(t=await e.fetchDidSucceed.call(e,{event:n,request:r,response:t}));return t}catch(e){for(const t of i)await t.fetchDidFail.call(t,{error:e,event:n,originalRequest:a.clone(),request:r.clone()});throw e}};try{self["workbox:strategies:5.1.3"]&&_()}catch(e){}const U={cacheWillUpdate:async({response:e})=>200===e.status||0===e.status?e:null};let E;async function k(e,t){const s=e.clone(),n={headers:new Headers(s.headers),status:s.status,statusText:s.statusText},c=t?t(n):n,i=function(){if(void 0===E){const e=new Response("");if("body"in e)try{new Response(e.body),E=!0}catch(e){E=!1}E=!1}return E}()?s.body:await s.blob();return new Response(i,c)}try{self["workbox:precaching:5.1.3"]&&_()}catch(e){}function P(e){if(!e)throw new t("add-to-cache-list-unexpected-type",{entry:e});if("string"==typeof e){const t=new URL(e,location.href);return{cacheKey:t.href,url:t.href}}const{revision:s,url:n}=e;if(!n)throw new t("add-to-cache-list-unexpected-type",{entry:e});if(!s){const e=new URL(n,location.href);return{cacheKey:e.href,url:e.href}}const c=new URL(n,location.href),i=new URL(n,location.href);return c.searchParams.set("__WB_REVISION__",s),{cacheKey:c.href,url:i.href}}class I{constructor(e){this.m=h(e),this.k=new Map,this.P=new Map,this.I=new Map}addToCacheList(e){const s=[];for(const n of e){"string"==typeof n?s.push(n):n&&void 0===n.revision&&s.push(n.url);const{cacheKey:e,url:c}=P(n),i="string"!=typeof n&&n.revision?"reload":"default";if(this.k.has(c)&&this.k.get(c)!==e)throw new t("add-to-cache-list-conflicting-entries",{firstEntry:this.k.get(c),secondEntry:e});if("string"!=typeof n&&n.integrity){if(this.I.has(e)&&this.I.get(e)!==n.integrity)throw new t("add-to-cache-list-conflicting-integrities",{url:c});this.I.set(e,n.integrity)}if(this.k.set(c,e),this.P.set(c,i),s.length>0){const e=`Workbox is precaching URLs without revision info: ${s.join(", ")}\nThis is generally NOT safe. Learn more at https://bit.ly/wb-precache`;console.warn(e)}}}async install({event:e,plugins:t}={}){const s=[],n=[],c=await self.caches.open(this.m),i=await c.keys(),a=new Set(i.map(e=>e.url));for(const[e,t]of this.k)a.has(t)?n.push(e):s.push({cacheKey:t,url:e});const r=s.map(({cacheKey:s,url:n})=>{const c=this.I.get(s),i=this.P.get(n);return this.N({cacheKey:s,cacheMode:i,event:e,integrity:c,plugins:t,url:n})});await Promise.all(r);return{updatedURLs:s.map(e=>e.url),notUpdatedURLs:n}}async activate(){const e=await self.caches.open(this.m),t=await e.keys(),s=new Set(this.k.values()),n=[];for(const c of t)s.has(c.url)||(await e.delete(c),n.push(c.url));return{deletedURLs:n}}async N({cacheKey:e,url:s,cacheMode:n,event:c,plugins:i,integrity:a}){const r=new Request(s,{integrity:a,cache:n,credentials:"same-origin"});let o,u=await j({event:c,plugins:i,request:r});for(const e of i||[])"cacheWillUpdate"in e&&(o=e);if(!(o?await o.cacheWillUpdate({event:c,request:r,response:u}):u.status<400))throw new t("bad-precaching-response",{url:s,status:u.status});u.redirected&&(u=await k(u)),await L({event:c,plugins:i,response:u,request:e===s?r:new Request(e),cacheName:this.m,matchOptions:{ignoreSearch:!0}})}getURLsToCacheKeys(){return this.k}getCachedURLs(){return[...this.k.keys()]}getCacheKeyForURL(e){const t=new URL(e,location.href);return this.k.get(t.href)}async matchPrecache(e){const t=e instanceof Request?e.url:e,s=this.getCacheKeyForURL(t);if(s){return(await self.caches.open(this.m)).match(s)}}createHandler(e=!0){return async({request:s})=>{try{const e=await this.matchPrecache(s);if(e)return e;throw new t("missing-precache-entry",{cacheName:this.m,url:s instanceof Request?s.url:s})}catch(t){if(e)return fetch(s);throw t}}}createHandlerBoundToURL(e,s=!0){if(!this.getCacheKeyForURL(e))throw new t("non-precached-url",{url:e});const n=this.createHandler(s),c=new Request(e);return()=>n({request:c})}}let N;const A=()=>(N||(N=new I),N);const H=(e,t)=>{const s=A().getURLsToCacheKeys();for(const n of function*(e,{ignoreURLParametersMatching:t,directoryIndex:s,cleanURLs:n,urlManipulation:c}={}){const i=new URL(e,location.href);i.hash="",yield i.href;const a=function(e,t=[]){for(const s of[...e.searchParams.keys()])t.some(e=>e.test(s))&&e.searchParams.delete(s);return e}(i,t);if(yield a.href,s&&a.pathname.endsWith("/")){const e=new URL(a.href);e.pathname+=s,yield e.href}if(n){const e=new URL(a.href);e.pathname+=".html",yield e.href}if(c){const e=c({url:i});for(const t of e)yield t.href}}(e,t)){const e=s.get(n);if(e)return e}};let M=!1;function T(e){M||((({ignoreURLParametersMatching:e=[/^utm_/],directoryIndex:t="index.html",cleanURLs:s=!0,urlManipulation:n}={})=>{const c=h();self.addEventListener("fetch",i=>{const a=H(i.request.url,{cleanURLs:s,directoryIndex:t,ignoreURLParametersMatching:e,urlManipulation:n});if(!a)return;let r=self.caches.open(c).then(e=>e.match(a)).then(e=>e||fetch(a));i.respondWith(r)})})(e),M=!0)}const K=[],G={get:()=>K,add(e){K.push(...e)}},O=e=>{const t=A(),s=G.get();e.waitUntil(t.install({event:e,plugins:s}).catch(e=>{throw e}))},D=e=>{const t=A();e.waitUntil(t.activate())};var J;self.addEventListener("message",e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()}),J={},function(e){A().addToCacheList(e),e.length>0&&(self.addEventListener("install",O),self.addEventListener("activate",D))}([{url:"_next/static/Gi8h67mH1PJLvIA-L_eE7/_buildManifest.js",revision:"7bbf8860471ecbda9cdb956d8d21a9da"},{url:"_next/static/Gi8h67mH1PJLvIA-L_eE7/_ssgManifest.js",revision:"abee47769bf307639ace4945f9cfd4ff"},{url:"_next/static/Gi8h67mH1PJLvIA-L_eE7/pages/_app.js",revision:"cd153a0757684e84fdff89670bdb7d27"},{url:"_next/static/Gi8h67mH1PJLvIA-L_eE7/pages/_error.js",revision:"0827f6428561a9d28eb8c9497af9f2b9"},{url:"_next/static/Gi8h67mH1PJLvIA-L_eE7/pages/course/[cid]/course_overrides.js",revision:"dfea0eea14a69b7fff5a75f952d63c36"},{url:"_next/static/Gi8h67mH1PJLvIA-L_eE7/pages/course/[cid]/queue/[qid].js",revision:"839bc3f44539cdd64e0c62c66812112d"},{url:"_next/static/Gi8h67mH1PJLvIA-L_eE7/pages/course/[cid]/schedule.js",revision:"9ac01e2971a2993f9c21eb82cd92ced4"},{url:"_next/static/Gi8h67mH1PJLvIA-L_eE7/pages/course/[cid]/today.js",revision:"b9c514cbcc94f1f8ce692c429507b480"},{url:"_next/static/Gi8h67mH1PJLvIA-L_eE7/pages/dev.js",revision:"b94024723d8f16d7d215233ff509f15a"},{url:"_next/static/Gi8h67mH1PJLvIA-L_eE7/pages/index.js",revision:"b8d327a25664392e91930ea43f630dcd"},{url:"_next/static/Gi8h67mH1PJLvIA-L_eE7/pages/login.js",revision:"4126eafdbe4a8758fc378f738a821777"},{url:"_next/static/Gi8h67mH1PJLvIA-L_eE7/pages/nocourses.js",revision:"3224c6e6f93ae6a4c47e9bff6a5b00cf"},{url:"_next/static/Gi8h67mH1PJLvIA-L_eE7/pages/settings.js",revision:"c8c215edff423e54df9755dd34711ce4"},{url:"_next/static/chunks/08cb5e083ede2956b6398ef1ba473b9dea1f379b.14505d57476ddc57f310.js",revision:"beacf66cd0a5a867ee27d6e0cef741aa"},{url:"_next/static/chunks/109332fcd837dd9554d1ad64c2cb3e3f6aede294.372e1928c575f3c94e68.js",revision:"23dd9495ea2294e095423a1bb2fdad95"},{url:"_next/static/chunks/2599f0356c2eb740e6cbc970abb3fc9dd5c816e6.37bd50e4bb529f3a45ce.js",revision:"5ad730081bf77a65050f84c955116a3c"},{url:"_next/static/chunks/29107295.7224e772e3df248b9b6d.js",revision:"deb89a1ae86143709cdba6e1d2b54751"},{url:"_next/static/chunks/2dff57e18d989ca3427054ccf0827771c05e89b0.772f35a82498f7b19b0c.js",revision:"33b7608a91a5297c559000928042a228"},{url:"_next/static/chunks/2ec56cda0ed580a886d2be8694c3cce6de5ebdce.9708f84493aff45b242d.js",revision:"b21c4551e56b19430237e4df5bcf939b"},{url:"_next/static/chunks/2ed9cb3d1525c1092c6ace8633d5a8cb583b768f.4639049178c3169658e2.js",revision:"2f1ac2a04be5317eb90072c588020771"},{url:"_next/static/chunks/56e86cdf8cbfe59b6047f3fe41ff95f92e805d81.539c1af7b5198ae65a7c.js",revision:"5802b99bc98127a90ca6cd5e2e6280ae"},{url:"_next/static/chunks/5816faf6518f942f449beecb85956bf45b05cdb4.62771071347ff5dfcd54.js",revision:"945da66f97408b34ab653846e997cbef"},{url:"_next/static/chunks/96bd1b97c6a822cd05f28ffd019019d3ec374d4a.54418c2cf159bb7fd8c0.js",revision:"a506f0c810effc9851c2765ce0e4f43f"},{url:"_next/static/chunks/a29ae703.16fee017b3d899b4d271.js",revision:"a5544d641d1220b8f8cb9d8e7825346f"},{url:"_next/static/chunks/b0ebcf48ab6f6f8b46f74bebfaa500b3e01ca331.37c550ed7b3ce9533dff.js",revision:"c7d23b79e4ce0ffe6151b9bd32d5427a"},{url:"_next/static/chunks/b0fbb3e2319d6cef40141432540ebbb16455587b.40c67a5873e125ca51e6.js",revision:"c39b32a0694acbb82d382976ec88ec34"},{url:"_next/static/chunks/b14e724aa2f836e7185bcf7a958e381f3e1551a3.1a9d9513fcf8cdc8345f.js",revision:"ee13dd7a8bc4956f6f5056f2ce4840d5"},{url:"_next/static/chunks/b75a13fce89b21ed80e26e1dd7a5c9806dbca92c.475aa6618c25f93d0df1.js",revision:"bb83a96ac9d2fe647bd9baf03688eed8"},{url:"_next/static/chunks/bb9e611b8c9ed813bd740cde96abdc8a968f9b89.a19e18f911bef145edcd.js",revision:"069425028475b6256c50451d403b0315"},{url:"_next/static/chunks/bcdede3b157bc3da4a12b8734a742d9e881b4bb7.8593ab6f7a8a8d1d042c.js",revision:"c52ca85ef821e86d73ecf297519e9e74"},{url:"_next/static/chunks/c96b4d7e.31f9101fb3d732608b90.js",revision:"6d4a06db07951dcaf0e199b0c687107c"},{url:"_next/static/chunks/cb9660cc915e2ed7b0831cbd293bb87fcb6ca1f8.67ea4ec0b3cc9c22d67d.js",revision:"7c096140cdf545dcca42efac8aa7a5b3"},{url:"_next/static/chunks/commons.2b7932428f1844f719b6.js",revision:"89908767deb308183365d452e4bcdb46"},{url:"_next/static/chunks/fc8d00fd.158594bfc26fc793d03b.js",revision:"718970d88a7e977d8c1fe92cb6b7c698"},{url:"_next/static/chunks/framework.ecbd939e3f22c21530d6.js",revision:"f1f44d4b846ef72b49ca7ba18b1f46ed"},{url:"_next/static/css/0b10e9f32b7d87c5b5ed.css",revision:"9b6bf2b0849057358aaaeb0dd19e37db"},{url:"_next/static/css/20de8917c44a516a459d.css",revision:"9a8cd95b5f951cd1c4dfc2843aaa0909"},{url:"_next/static/runtime/main-e3d3bfc2aa5306ba04a6.js",revision:"8acf0016fc4df14d7c70bdef2f30f7e9"},{url:"_next/static/runtime/polyfills-129b8641b84b21697221.js",revision:"5f0b0318c90f1e0cdedbb1097ad94f47"},{url:"_next/static/runtime/webpack-1c5199ff66550d26e499.js",revision:"029ee2e7063b1566925082c49e4afc45"}]),T(J),function(e,s,i){let a;if("string"==typeof e){const t=new URL(e,location.href);a=new n(({url:e})=>e.href===t.href,s,i)}else if(e instanceof RegExp)a=new c(e,s,i);else if("function"==typeof e)a=new n(e,s,i);else{if(!(e instanceof n))throw new t("unsupported-route-type",{moduleName:"workbox-routing",funcName:"registerRoute",paramName:"capture"});a=e}o().registerRoute(a)}(/^https?.*/,new class{constructor(e={}){if(this.m=d(e.cacheName),e.plugins){const t=e.plugins.some(e=>!!e.cacheWillUpdate);this.A=t?e.plugins:[U,...e.plugins]}else this.A=[U];this.H=e.networkTimeoutSeconds||0,this.M=e.fetchOptions,this.T=e.matchOptions}async handle({event:e,request:s}){const n=[];"string"==typeof s&&(s=new Request(s));const c=[];let i;if(this.H){const{id:t,promise:a}=this.K({request:s,event:e,logs:n});i=t,c.push(a)}const a=this.G({timeoutId:i,request:s,event:e,logs:n});c.push(a);let r=await Promise.race(c);if(r||(r=await a),!r)throw new t("no-response",{url:s.url});return r}K({request:e,logs:t,event:s}){let n;return{promise:new Promise(t=>{n=setTimeout(async()=>{t(await this.O({request:e,event:s}))},1e3*this.H)}),id:n}}async G({timeoutId:e,request:t,logs:s,event:n}){let c,i;try{i=await j({request:t,event:n,fetchOptions:this.M,plugins:this.A})}catch(e){c=e}if(e&&clearTimeout(e),c||!i)i=await this.O({request:t,event:n});else{const e=i.clone(),s=L({cacheName:this.m,request:t,response:e,event:n,plugins:this.A});if(n)try{n.waitUntil(s)}catch(e){}}return i}O({event:e,request:t}){return R({cacheName:this.m,request:t,event:e,matchOptions:this.T,plugins:this.A})}}({cacheName:"offlineCache",plugins:[new class{constructor(e={}){var t;this.cachedResponseWillBeUsed=async({event:e,request:t,cacheName:s,cachedResponse:n})=>{if(!n)return null;const c=this.D(n),i=this.J(s);l(i.expireEntries());const a=i.updateTimestamp(t.url);if(e)try{e.waitUntil(a)}catch(e){}return c?n:null},this.cacheDidUpdate=async({cacheName:e,request:t})=>{const s=this.J(e);await s.updateTimestamp(t.url),await s.expireEntries()},this.C=e,this.j=e.maxAgeSeconds,this.S=new Map,e.purgeOnQuotaError&&(t=()=>this.deleteCacheAndMetadata(),b.add(t))}J(e){if(e===d())throw new t("expire-custom-caches-only");let s=this.S.get(e);return s||(s=new m(e,this.C),this.S.set(e,s)),s}D(e){if(!this.j)return!0;const t=this.W(e);if(null===t)return!0;return t>=Date.now()-1e3*this.j}W(e){if(!e.headers.has("date"))return null;const t=e.headers.get("date"),s=new Date(t).getTime();return isNaN(s)?null:s}async deleteCacheAndMetadata(){for(const[e,t]of this.S)await self.caches.delete(e),await t.delete();this.S=new Map}}({maxEntries:200,purgeOnQuotaError:!0})]}),"GET");
//# sourceMappingURL=service-worker.js.map
