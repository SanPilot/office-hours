try{self["workbox:core:5.1.3"]&&_()}catch(e){}const e=(e,...t)=>{let s=e;return t.length>0&&(s+=" :: "+JSON.stringify(t)),s};class t extends Error{constructor(t,s){super(e(t,s)),this.name=t,this.details=s}}try{self["workbox:routing:5.1.3"]&&_()}catch(e){}const s=e=>e&&"object"==typeof e?e:{handle:e};class n{constructor(e,t,n="GET"){this.handler=s(t),this.match=e,this.method=n}}class i extends n{constructor(e,t,s){super(({url:t})=>{const s=e.exec(t.href);if(s&&(t.origin===location.origin||0===s.index))return s.slice(1)},t,s)}}const c=e=>new URL(String(e),location.href).href.replace(new RegExp("^"+location.origin),"");class a{constructor(){this.t=new Map}get routes(){return this.t}addFetchListener(){self.addEventListener("fetch",e=>{const{request:t}=e,s=this.handleRequest({request:t,event:e});s&&e.respondWith(s)})}addCacheListener(){self.addEventListener("message",e=>{if(e.data&&"CACHE_URLS"===e.data.type){const{payload:t}=e.data,s=Promise.all(t.urlsToCache.map(e=>{"string"==typeof e&&(e=[e]);const t=new Request(...e);return this.handleRequest({request:t})}));e.waitUntil(s),e.ports&&e.ports[0]&&s.then(()=>e.ports[0].postMessage(!0))}})}handleRequest({request:e,event:t}){const s=new URL(e.url,location.href);if(!s.protocol.startsWith("http"))return;const{params:n,route:i}=this.findMatchingRoute({url:s,request:e,event:t});let c,a=i&&i.handler;if(!a&&this.s&&(a=this.s),a){try{c=a.handle({url:s,request:e,event:t,params:n})}catch(e){c=Promise.reject(e)}return c instanceof Promise&&this.i&&(c=c.catch(n=>this.i.handle({url:s,request:e,event:t}))),c}}findMatchingRoute({url:e,request:t,event:s}){const n=this.t.get(t.method)||[];for(const i of n){let n;const c=i.match({url:e,request:t,event:s});if(c)return n=c,(Array.isArray(c)&&0===c.length||c.constructor===Object&&0===Object.keys(c).length||"boolean"==typeof c)&&(n=void 0),{route:i,params:n}}return{}}setDefaultHandler(e){this.s=s(e)}setCatchHandler(e){this.i=s(e)}registerRoute(e){this.t.has(e.method)||this.t.set(e.method,[]),this.t.get(e.method).push(e)}unregisterRoute(e){if(!this.t.has(e.method))throw new t("unregister-route-but-not-found-with-method",{method:e.method});const s=this.t.get(e.method).indexOf(e);if(!(s>-1))throw new t("unregister-route-route-not-registered");this.t.get(e.method).splice(s,1)}}let r;const o=()=>(r||(r=new a,r.addFetchListener(),r.addCacheListener()),r);const u={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"workbox",runtime:"runtime",suffix:"undefined"!=typeof registration?registration.scope:""},d=e=>[u.prefix,e,u.suffix].filter(e=>e&&e.length>0).join("-"),h=e=>e||d(u.precache),f=e=>e||d(u.runtime);function l(e){e.then(()=>{})}const b=new Set;class w{constructor(e,t,{onupgradeneeded:s,onversionchange:n}={}){this.o=null,this.u=e,this.h=t,this.l=s,this.p=n||(()=>this.close())}get db(){return this.o}async open(){if(!this.o)return this.o=await new Promise((e,t)=>{let s=!1;setTimeout(()=>{s=!0,t(new Error("The open request was blocked and timed out"))},this.OPEN_TIMEOUT);const n=indexedDB.open(this.u,this.h);n.onerror=()=>t(n.error),n.onupgradeneeded=e=>{s?(n.transaction.abort(),n.result.close()):"function"==typeof this.l&&this.l(e)},n.onsuccess=()=>{const t=n.result;s?t.close():(t.onversionchange=this.p.bind(this),e(t))}}),this}async getKey(e,t){return(await this.getAllKeys(e,t,1))[0]}async getAll(e,t,s){return await this.getAllMatching(e,{query:t,count:s})}async getAllKeys(e,t,s){return(await this.getAllMatching(e,{query:t,count:s,includeKeys:!0})).map(e=>e.key)}async getAllMatching(e,{index:t,query:s=null,direction:n="next",count:i,includeKeys:c=!1}={}){return await this.transaction([e],"readonly",(a,r)=>{const o=a.objectStore(e),u=t?o.index(t):o,d=[],h=u.openCursor(s,n);h.onsuccess=()=>{const e=h.result;e?(d.push(c?e:e.value),i&&d.length>=i?r(d):e.continue()):r(d)}})}async transaction(e,t,s){return await this.open(),await new Promise((n,i)=>{const c=this.o.transaction(e,t);c.onabort=()=>i(c.error),c.oncomplete=()=>n(),s(c,e=>n(e))})}async g(e,t,s,...n){return await this.transaction([t],s,(s,i)=>{const c=s.objectStore(t),a=c[e].apply(c,n);a.onsuccess=()=>i(a.result)})}close(){this.o&&(this.o.close(),this.o=null)}}w.prototype.OPEN_TIMEOUT=2e3;const p={readonly:["get","count","getKey","getAll","getAllKeys"],readwrite:["add","put","clear","delete"]};for(const[e,t]of Object.entries(p))for(const s of t)s in IDBObjectStore.prototype&&(w.prototype[s]=async function(t,...n){return await this.g(s,t,e,...n)});try{self["workbox:expiration:5.1.3"]&&_()}catch(e){}const y=e=>{const t=new URL(e,location.href);return t.hash="",t.href};class g{constructor(e){this.m=e,this.o=new w("workbox-expiration",1,{onupgradeneeded:e=>this.v(e)})}v(e){const t=e.target.result.createObjectStore("cache-entries",{keyPath:"id"});t.createIndex("cacheName","cacheName",{unique:!1}),t.createIndex("timestamp","timestamp",{unique:!1}),(async e=>{await new Promise((t,s)=>{const n=indexedDB.deleteDatabase(e);n.onerror=()=>{s(n.error)},n.onblocked=()=>{s(new Error("Delete blocked"))},n.onsuccess=()=>{t()}})})(this.m)}async setTimestamp(e,t){const s={url:e=y(e),timestamp:t,cacheName:this.m,id:this.q(e)};await this.o.put("cache-entries",s)}async getTimestamp(e){return(await this.o.get("cache-entries",this.q(e))).timestamp}async expireEntries(e,t){const s=await this.o.transaction("cache-entries","readwrite",(s,n)=>{const i=s.objectStore("cache-entries").index("timestamp").openCursor(null,"prev"),c=[];let a=0;i.onsuccess=()=>{const s=i.result;if(s){const n=s.value;n.cacheName===this.m&&(e&&n.timestamp<e||t&&a>=t?c.push(s.value):a++),s.continue()}else n(c)}}),n=[];for(const e of s)await this.o.delete("cache-entries",e.id),n.push(e.url);return n}q(e){return this.m+"|"+y(e)}}class m{constructor(e,t={}){this.j=!1,this.R=!1,this._=t.maxEntries,this.k=t.maxAgeSeconds,this.m=e,this.U=new g(e)}async expireEntries(){if(this.j)return void(this.R=!0);this.j=!0;const e=this.k?Date.now()-1e3*this.k:0,t=await this.U.expireEntries(e,this._),s=await self.caches.open(this.m);for(const e of t)await s.delete(e);this.j=!1,this.R&&(this.R=!1,l(this.expireEntries()))}async updateTimestamp(e){await this.U.setTimestamp(e,Date.now())}async isURLExpired(e){if(this.k){return await this.U.getTimestamp(e)<Date.now()-1e3*this.k}return!1}async delete(){this.R=!1,await this.U.expireEntries(1/0)}}const v=(e,t)=>e.filter(e=>t in e),q=async({request:e,mode:t,plugins:s=[]})=>{const n=v(s,"cacheKeyWillBeUsed");let i=e;for(const e of n)i=await e.cacheKeyWillBeUsed.call(e,{mode:t,request:i}),"string"==typeof i&&(i=new Request(i));return i},x=async({cacheName:e,request:t,event:s,matchOptions:n,plugins:i=[]})=>{const c=await self.caches.open(e),a=await q({plugins:i,request:t,mode:"read"});let r=await c.match(a,n);for(const t of i)if("cachedResponseWillBeUsed"in t){const i=t.cachedResponseWillBeUsed;r=await i.call(t,{cacheName:e,event:s,matchOptions:n,cachedResponse:r,request:a})}return r},j=async({cacheName:e,request:s,response:n,event:i,plugins:a=[],matchOptions:r})=>{const o=await q({plugins:a,request:s,mode:"write"});if(!n)throw new t("cache-put-with-no-response",{url:c(o.url)});const u=await(async({request:e,response:t,event:s,plugins:n=[]})=>{let i=t,c=!1;for(const t of n)if("cacheWillUpdate"in t){c=!0;const n=t.cacheWillUpdate;if(i=await n.call(t,{request:e,response:i,event:s}),!i)break}return c||(i=i&&200===i.status?i:void 0),i||null})({event:i,plugins:a,response:n,request:o});if(!u)return;const d=await self.caches.open(e),h=v(a,"cacheDidUpdate"),f=h.length>0?await x({cacheName:e,matchOptions:r,request:o}):null;try{await d.put(o,u)}catch(e){throw"QuotaExceededError"===e.name&&await async function(){for(const e of b)await e()}(),e}for(const t of h)await t.cacheDidUpdate.call(t,{cacheName:e,event:i,oldResponse:f,newResponse:u,request:o})},R=x,k=async({request:e,fetchOptions:s,event:n,plugins:i=[]})=>{if("string"==typeof e&&(e=new Request(e)),n instanceof FetchEvent&&n.preloadResponse){const e=await n.preloadResponse;if(e)return e}const c=v(i,"fetchDidFail"),a=c.length>0?e.clone():null;try{for(const t of i)if("requestWillFetch"in t){const s=t.requestWillFetch,i=e.clone();e=await s.call(t,{request:i,event:n})}}catch(e){throw new t("plugin-error-request-will-fetch",{thrownError:e})}const r=e.clone();try{let t;t="navigate"===e.mode?await fetch(e):await fetch(e,s);for(const e of i)"fetchDidSucceed"in e&&(t=await e.fetchDidSucceed.call(e,{event:n,request:r,response:t}));return t}catch(e){for(const t of c)await t.fetchDidFail.call(t,{error:e,event:n,originalRequest:a.clone(),request:r.clone()});throw e}};try{self["workbox:strategies:5.1.3"]&&_()}catch(e){}const U={cacheWillUpdate:async({response:e})=>200===e.status||0===e.status?e:null};let L;async function O(e,t){const s=e.clone(),n={headers:new Headers(s.headers),status:s.status,statusText:s.statusText},i=t?t(n):n,c=function(){if(void 0===L){const e=new Response("");if("body"in e)try{new Response(e.body),L=!0}catch(e){L=!1}L=!1}return L}()?s.body:await s.blob();return new Response(c,i)}try{self["workbox:precaching:5.1.3"]&&_()}catch(e){}function C(e){if(!e)throw new t("add-to-cache-list-unexpected-type",{entry:e});if("string"==typeof e){const t=new URL(e,location.href);return{cacheKey:t.href,url:t.href}}const{revision:s,url:n}=e;if(!n)throw new t("add-to-cache-list-unexpected-type",{entry:e});if(!s){const e=new URL(n,location.href);return{cacheKey:e.href,url:e.href}}const i=new URL(n,location.href),c=new URL(n,location.href);return i.searchParams.set("__WB_REVISION__",s),{cacheKey:i.href,url:c.href}}class N{constructor(e){this.m=h(e),this.L=new Map,this.O=new Map,this.C=new Map}addToCacheList(e){const s=[];for(const n of e){"string"==typeof n?s.push(n):n&&void 0===n.revision&&s.push(n.url);const{cacheKey:e,url:i}=C(n),c="string"!=typeof n&&n.revision?"reload":"default";if(this.L.has(i)&&this.L.get(i)!==e)throw new t("add-to-cache-list-conflicting-entries",{firstEntry:this.L.get(i),secondEntry:e});if("string"!=typeof n&&n.integrity){if(this.C.has(e)&&this.C.get(e)!==n.integrity)throw new t("add-to-cache-list-conflicting-integrities",{url:i});this.C.set(e,n.integrity)}if(this.L.set(i,e),this.O.set(i,c),s.length>0){const e=`Workbox is precaching URLs without revision info: ${s.join(", ")}\nThis is generally NOT safe. Learn more at https://bit.ly/wb-precache`;console.warn(e)}}}async install({event:e,plugins:t}={}){const s=[],n=[],i=await self.caches.open(this.m),c=await i.keys(),a=new Set(c.map(e=>e.url));for(const[e,t]of this.L)a.has(t)?n.push(e):s.push({cacheKey:t,url:e});const r=s.map(({cacheKey:s,url:n})=>{const i=this.C.get(s),c=this.O.get(n);return this.N({cacheKey:s,cacheMode:c,event:e,integrity:i,plugins:t,url:n})});await Promise.all(r);return{updatedURLs:s.map(e=>e.url),notUpdatedURLs:n}}async activate(){const e=await self.caches.open(this.m),t=await e.keys(),s=new Set(this.L.values()),n=[];for(const i of t)s.has(i.url)||(await e.delete(i),n.push(i.url));return{deletedURLs:n}}async N({cacheKey:e,url:s,cacheMode:n,event:i,plugins:c,integrity:a}){const r=new Request(s,{integrity:a,cache:n,credentials:"same-origin"});let o,u=await k({event:i,plugins:c,request:r});for(const e of c||[])"cacheWillUpdate"in e&&(o=e);if(!(o?await o.cacheWillUpdate({event:i,request:r,response:u}):u.status<400))throw new t("bad-precaching-response",{url:s,status:u.status});u.redirected&&(u=await O(u)),await j({event:i,plugins:c,response:u,request:e===s?r:new Request(e),cacheName:this.m,matchOptions:{ignoreSearch:!0}})}getURLsToCacheKeys(){return this.L}getCachedURLs(){return[...this.L.keys()]}getCacheKeyForURL(e){const t=new URL(e,location.href);return this.L.get(t.href)}async matchPrecache(e){const t=e instanceof Request?e.url:e,s=this.getCacheKeyForURL(t);if(s){return(await self.caches.open(this.m)).match(s)}}createHandler(e=!0){return async({request:s})=>{try{const e=await this.matchPrecache(s);if(e)return e;throw new t("missing-precache-entry",{cacheName:this.m,url:s instanceof Request?s.url:s})}catch(t){if(e)return fetch(s);throw t}}}createHandlerBoundToURL(e,s=!0){if(!this.getCacheKeyForURL(e))throw new t("non-precached-url",{url:e});const n=this.createHandler(s),i=new Request(e);return()=>n({request:i})}}let A;const S=()=>(A||(A=new N),A);const E=(e,t)=>{const s=S().getURLsToCacheKeys();for(const n of function*(e,{ignoreURLParametersMatching:t,directoryIndex:s,cleanURLs:n,urlManipulation:i}={}){const c=new URL(e,location.href);c.hash="",yield c.href;const a=function(e,t=[]){for(const s of[...e.searchParams.keys()])t.some(e=>e.test(s))&&e.searchParams.delete(s);return e}(c,t);if(yield a.href,s&&a.pathname.endsWith("/")){const e=new URL(a.href);e.pathname+=s,yield e.href}if(n){const e=new URL(a.href);e.pathname+=".html",yield e.href}if(i){const e=i({url:c});for(const t of e)yield t.href}}(e,t)){const e=s.get(n);if(e)return e}};let H=!1;function M(e){H||((({ignoreURLParametersMatching:e=[/^utm_/],directoryIndex:t="index.html",cleanURLs:s=!0,urlManipulation:n}={})=>{const i=h();self.addEventListener("fetch",c=>{const a=E(c.request.url,{cleanURLs:s,directoryIndex:t,ignoreURLParametersMatching:e,urlManipulation:n});if(!a)return;let r=self.caches.open(i).then(e=>e.match(a)).then(e=>e||fetch(a));c.respondWith(r)})})(e),H=!0)}const T=[],K={get:()=>T,add(e){T.push(...e)}},P=e=>{const t=S(),s=K.get();e.waitUntil(t.install({event:e,plugins:s}).catch(e=>{throw e}))},D=e=>{const t=S();e.waitUntil(t.activate())};var I;self.addEventListener("message",e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()}),I={},function(e){S().addToCacheList(e),e.length>0&&(self.addEventListener("install",P),self.addEventListener("activate",D))}([{url:"_next/static/8jHb3ROqopnakhjSCynyA/_buildManifest.js",revision:"a5a53479ef83d409e828bc6c1b018187"},{url:"_next/static/8jHb3ROqopnakhjSCynyA/_ssgManifest.js",revision:"abee47769bf307639ace4945f9cfd4ff"},{url:"_next/static/8jHb3ROqopnakhjSCynyA/pages/_app.js",revision:"3f47ac1903285e1db993031aa9c098a1"},{url:"_next/static/8jHb3ROqopnakhjSCynyA/pages/_error.js",revision:"0827f6428561a9d28eb8c9497af9f2b9"},{url:"_next/static/8jHb3ROqopnakhjSCynyA/pages/course/[cid]/course_overrides.js",revision:"adb42ad955d50ed712e8ac174644f2f7"},{url:"_next/static/8jHb3ROqopnakhjSCynyA/pages/course/[cid]/queue/[qid].js",revision:"a458db33c5420bb9e7ba9a3513622eab"},{url:"_next/static/8jHb3ROqopnakhjSCynyA/pages/course/[cid]/schedule.js",revision:"2ad023a3306da203c1d99b8afffd9d2b"},{url:"_next/static/8jHb3ROqopnakhjSCynyA/pages/course/[cid]/today.js",revision:"914784a60cd1a6bba55ebae918ca42d2"},{url:"_next/static/8jHb3ROqopnakhjSCynyA/pages/dev.js",revision:"0232d57870c45ad8152ccd1bd8162ec0"},{url:"_next/static/8jHb3ROqopnakhjSCynyA/pages/index.js",revision:"ef828b0b82824ecb98b4170c6d1db8f9"},{url:"_next/static/8jHb3ROqopnakhjSCynyA/pages/login.js",revision:"10e7282e52b6607af66279780916f62a"},{url:"_next/static/8jHb3ROqopnakhjSCynyA/pages/nocourses.js",revision:"5cd29a32efd1683279defb877dda58f7"},{url:"_next/static/8jHb3ROqopnakhjSCynyA/pages/settings.js",revision:"3a4bf638836f3c01b2768bf89e1587b3"},{url:"_next/static/chunks/0b0546fc8d1c49687ea0c5a0ace66d10598dad3e.96e54de04c15d71ed2ef.js",revision:"2fd7f4823da827a85ad0ed138aada99d"},{url:"_next/static/chunks/11a10835eb40cf19542b54be2838860ba6f381bf.e045abf429bc88180126.js",revision:"b90eacb6057e1e90796ec4ed0bed692d"},{url:"_next/static/chunks/15f0f7cb5c57eefb402105b95732994cdfe9002c.9708f84493aff45b242d.js",revision:"f35341f974dfe46dec6e6438a0ce4c10"},{url:"_next/static/chunks/1a62bd62ee97199466f7a7d9379417788b6b9450.4a3221dbec4bad64f9c4.js",revision:"2164e5ffbc7c0c1950b11d9d67268c41"},{url:"_next/static/chunks/24ec765a7c010339ca56effe49fc396a2aacb9fd.bfde6a9089ecd6cfc481.js",revision:"fad71ca86b5f740692669fc3f714728a"},{url:"_next/static/chunks/29107295.8007f4499acc1bea4d2b.js",revision:"cbfd6cc2bfe1dd2859ce6257974dd068"},{url:"_next/static/chunks/2b062f2d7078e2d034a195485723a6f0d6b5d7ce.46996ce133e8fc75f379.js",revision:"d134fca88fadaec47668a63b62d2ef49"},{url:"_next/static/chunks/3c893c2fe151819f704684df8746d3e619de38ec.372e1928c575f3c94e68.js",revision:"d6e593e44770de8ff053ea5c3f732690"},{url:"_next/static/chunks/574497650dee12efedbeeb3fc698965b9a3e3735.a278836571146d29bd13.js",revision:"fcf95f101d1880303110129b3cc46098"},{url:"_next/static/chunks/629ecbaa62608cda649698dada48c887bde25d28.475aa6618c25f93d0df1.js",revision:"3d7e8184c7fc4e71070dbe7c4bd5a556"},{url:"_next/static/chunks/78d248682ea4798555b01b0e45d19e0315855a5d.af22aa0fdf89a700808c.js",revision:"99db81b45e1d36b289a386ebf16fa935"},{url:"_next/static/chunks/865ddb744d56d6e34eed4dc72c7d2b6cbde30fd9.0b6be8f9b77e8ffd13d2.js",revision:"e388e0ca5722cd24abf1ef78511d43b8"},{url:"_next/static/chunks/9e78316778f3bf2637d5dc21e6bba7c5d214edc1.f88773aed99909610f92.js",revision:"e57b6244396bb9c2a31267cc25d59258"},{url:"_next/static/chunks/a29ae703.42bd497555d899daf3d4.js",revision:"d9b24a664a7b32dc0e464367e545693e"},{url:"_next/static/chunks/c19d0e95222e67758cf69ced08a6d7771f64e5a7.ab8d4c0091946fe18bad.js",revision:"23dcc6b708fb8fbdec55a143a7f41a6b"},{url:"_next/static/chunks/c96b4d7e.31f9101fb3d732608b90.js",revision:"6d4a06db07951dcaf0e199b0c687107c"},{url:"_next/static/chunks/commons.b924aa430bb9ad96d688.js",revision:"e098b315bf73b654607d8d6ebd39b4b5"},{url:"_next/static/chunks/d27114589a4b71b1cd0056e7aa4f03e478818ed7.1a9d9513fcf8cdc8345f.js",revision:"0df5338fac778206aceb6b6056583533"},{url:"_next/static/chunks/fc8d00fd.158594bfc26fc793d03b.js",revision:"718970d88a7e977d8c1fe92cb6b7c698"},{url:"_next/static/chunks/fcfe4dca33c13a218d62933020a3bdd6d9aefbda.1081c1c8525597342cf2.js",revision:"3514bbb6002073ad02f069a335e7f420"},{url:"_next/static/chunks/feec57df862d5db1612b5f753ecea0b7e6cb3071.67ea4ec0b3cc9c22d67d.js",revision:"ddd91e7d40e874cfe8df2ac548ad7430"},{url:"_next/static/chunks/framework.ecbd939e3f22c21530d6.js",revision:"f1f44d4b846ef72b49ca7ba18b1f46ed"},{url:"_next/static/css/0b10e9f32b7d87c5b5ed.css",revision:"9b6bf2b0849057358aaaeb0dd19e37db"},{url:"_next/static/css/20de8917c44a516a459d.css",revision:"9a8cd95b5f951cd1c4dfc2843aaa0909"},{url:"_next/static/runtime/main-e3d3bfc2aa5306ba04a6.js",revision:"8acf0016fc4df14d7c70bdef2f30f7e9"},{url:"_next/static/runtime/polyfills-129b8641b84b21697221.js",revision:"5f0b0318c90f1e0cdedbb1097ad94f47"},{url:"_next/static/runtime/webpack-1c5199ff66550d26e499.js",revision:"029ee2e7063b1566925082c49e4afc45"}]),M(I),function(e,s,c){let a;if("string"==typeof e){const t=new URL(e,location.href);a=new n(({url:e})=>e.href===t.href,s,c)}else if(e instanceof RegExp)a=new i(e,s,c);else if("function"==typeof e)a=new n(e,s,c);else{if(!(e instanceof n))throw new t("unsupported-route-type",{moduleName:"workbox-routing",funcName:"registerRoute",paramName:"capture"});a=e}o().registerRoute(a)}(/^https?.*/,new class{constructor(e={}){if(this.m=f(e.cacheName),e.plugins){const t=e.plugins.some(e=>!!e.cacheWillUpdate);this.A=t?e.plugins:[U,...e.plugins]}else this.A=[U];this.S=e.networkTimeoutSeconds||0,this.H=e.fetchOptions,this.M=e.matchOptions}async handle({event:e,request:s}){const n=[];"string"==typeof s&&(s=new Request(s));const i=[];let c;if(this.S){const{id:t,promise:a}=this.T({request:s,event:e,logs:n});c=t,i.push(a)}const a=this.K({timeoutId:c,request:s,event:e,logs:n});i.push(a);let r=await Promise.race(i);if(r||(r=await a),!r)throw new t("no-response",{url:s.url});return r}T({request:e,logs:t,event:s}){let n;return{promise:new Promise(t=>{n=setTimeout(async()=>{t(await this.P({request:e,event:s}))},1e3*this.S)}),id:n}}async K({timeoutId:e,request:t,logs:s,event:n}){let i,c;try{c=await k({request:t,event:n,fetchOptions:this.H,plugins:this.A})}catch(e){i=e}if(e&&clearTimeout(e),i||!c)c=await this.P({request:t,event:n});else{const e=c.clone(),s=j({cacheName:this.m,request:t,response:e,event:n,plugins:this.A});if(n)try{n.waitUntil(s)}catch(e){}}return c}P({event:e,request:t}){return R({cacheName:this.m,request:t,event:e,matchOptions:this.M,plugins:this.A})}}({cacheName:"offlineCache",plugins:[new class{constructor(e={}){var t;this.cachedResponseWillBeUsed=async({event:e,request:t,cacheName:s,cachedResponse:n})=>{if(!n)return null;const i=this.D(n),c=this.I(s);l(c.expireEntries());const a=c.updateTimestamp(t.url);if(e)try{e.waitUntil(a)}catch(e){}return i?n:null},this.cacheDidUpdate=async({cacheName:e,request:t})=>{const s=this.I(e);await s.updateTimestamp(t.url),await s.expireEntries()},this.W=e,this.k=e.maxAgeSeconds,this.B=new Map,e.purgeOnQuotaError&&(t=()=>this.deleteCacheAndMetadata(),b.add(t))}I(e){if(e===f())throw new t("expire-custom-caches-only");let s=this.B.get(e);return s||(s=new m(e,this.W),this.B.set(e,s)),s}D(e){if(!this.k)return!0;const t=this.F(e);if(null===t)return!0;return t>=Date.now()-1e3*this.k}F(e){if(!e.headers.has("date"))return null;const t=e.headers.get("date"),s=new Date(t).getTime();return isNaN(s)?null:s}async deleteCacheAndMetadata(){for(const[e,t]of this.B)await self.caches.delete(e),await t.delete();this.B=new Map}}({maxEntries:200,purgeOnQuotaError:!0})]}),"GET");
//# sourceMappingURL=service-worker.js.map
