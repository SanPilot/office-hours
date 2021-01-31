try{self["workbox:core:5.1.3"]&&_()}catch(e){}const e=(e,...t)=>{let s=e;return t.length>0&&(s+=" :: "+JSON.stringify(t)),s};class t extends Error{constructor(t,s){super(e(t,s)),this.name=t,this.details=s}}try{self["workbox:routing:5.1.3"]&&_()}catch(e){}const s=e=>e&&"object"==typeof e?e:{handle:e};class n{constructor(e,t,n="GET"){this.handler=s(t),this.match=e,this.method=n}}class i extends n{constructor(e,t,s){super(({url:t})=>{const s=e.exec(t.href);if(s&&(t.origin===location.origin||0===s.index))return s.slice(1)},t,s)}}const c=e=>new URL(String(e),location.href).href.replace(new RegExp("^"+location.origin),"");class a{constructor(){this.t=new Map}get routes(){return this.t}addFetchListener(){self.addEventListener("fetch",e=>{const{request:t}=e,s=this.handleRequest({request:t,event:e});s&&e.respondWith(s)})}addCacheListener(){self.addEventListener("message",e=>{if(e.data&&"CACHE_URLS"===e.data.type){const{payload:t}=e.data,s=Promise.all(t.urlsToCache.map(e=>{"string"==typeof e&&(e=[e]);const t=new Request(...e);return this.handleRequest({request:t})}));e.waitUntil(s),e.ports&&e.ports[0]&&s.then(()=>e.ports[0].postMessage(!0))}})}handleRequest({request:e,event:t}){const s=new URL(e.url,location.href);if(!s.protocol.startsWith("http"))return;const{params:n,route:i}=this.findMatchingRoute({url:s,request:e,event:t});let c,a=i&&i.handler;if(!a&&this.s&&(a=this.s),a){try{c=a.handle({url:s,request:e,event:t,params:n})}catch(e){c=Promise.reject(e)}return c instanceof Promise&&this.i&&(c=c.catch(n=>this.i.handle({url:s,request:e,event:t}))),c}}findMatchingRoute({url:e,request:t,event:s}){const n=this.t.get(t.method)||[];for(const i of n){let n;const c=i.match({url:e,request:t,event:s});if(c)return n=c,(Array.isArray(c)&&0===c.length||c.constructor===Object&&0===Object.keys(c).length||"boolean"==typeof c)&&(n=void 0),{route:i,params:n}}return{}}setDefaultHandler(e){this.s=s(e)}setCatchHandler(e){this.i=s(e)}registerRoute(e){this.t.has(e.method)||this.t.set(e.method,[]),this.t.get(e.method).push(e)}unregisterRoute(e){if(!this.t.has(e.method))throw new t("unregister-route-but-not-found-with-method",{method:e.method});const s=this.t.get(e.method).indexOf(e);if(!(s>-1))throw new t("unregister-route-route-not-registered");this.t.get(e.method).splice(s,1)}}let r;const o=()=>(r||(r=new a,r.addFetchListener(),r.addCacheListener()),r);const h={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"workbox",runtime:"runtime",suffix:"undefined"!=typeof registration?registration.scope:""},u=e=>[h.prefix,e,h.suffix].filter(e=>e&&e.length>0).join("-"),f=e=>e||u(h.precache),d=e=>e||u(h.runtime);function l(e){e.then(()=>{})}const w=new Set;class b{constructor(e,t,{onupgradeneeded:s,onversionchange:n}={}){this.o=null,this.h=e,this.u=t,this.l=s,this.p=n||(()=>this.close())}get db(){return this.o}async open(){if(!this.o)return this.o=await new Promise((e,t)=>{let s=!1;setTimeout(()=>{s=!0,t(new Error("The open request was blocked and timed out"))},this.OPEN_TIMEOUT);const n=indexedDB.open(this.h,this.u);n.onerror=()=>t(n.error),n.onupgradeneeded=e=>{s?(n.transaction.abort(),n.result.close()):"function"==typeof this.l&&this.l(e)},n.onsuccess=()=>{const t=n.result;s?t.close():(t.onversionchange=this.p.bind(this),e(t))}}),this}async getKey(e,t){return(await this.getAllKeys(e,t,1))[0]}async getAll(e,t,s){return await this.getAllMatching(e,{query:t,count:s})}async getAllKeys(e,t,s){return(await this.getAllMatching(e,{query:t,count:s,includeKeys:!0})).map(e=>e.key)}async getAllMatching(e,{index:t,query:s=null,direction:n="next",count:i,includeKeys:c=!1}={}){return await this.transaction([e],"readonly",(a,r)=>{const o=a.objectStore(e),h=t?o.index(t):o,u=[],f=h.openCursor(s,n);f.onsuccess=()=>{const e=f.result;e?(u.push(c?e:e.value),i&&u.length>=i?r(u):e.continue()):r(u)}})}async transaction(e,t,s){return await this.open(),await new Promise((n,i)=>{const c=this.o.transaction(e,t);c.onabort=()=>i(c.error),c.oncomplete=()=>n(),s(c,e=>n(e))})}async g(e,t,s,...n){return await this.transaction([t],s,(s,i)=>{const c=s.objectStore(t),a=c[e].apply(c,n);a.onsuccess=()=>i(a.result)})}close(){this.o&&(this.o.close(),this.o=null)}}b.prototype.OPEN_TIMEOUT=2e3;const p={readonly:["get","count","getKey","getAll","getAllKeys"],readwrite:["add","put","clear","delete"]};for(const[e,t]of Object.entries(p))for(const s of t)s in IDBObjectStore.prototype&&(b.prototype[s]=async function(t,...n){return await this.g(s,t,e,...n)});try{self["workbox:expiration:5.1.3"]&&_()}catch(e){}const y=e=>{const t=new URL(e,location.href);return t.hash="",t.href};class g{constructor(e){this.v=e,this.o=new b("workbox-expiration",1,{onupgradeneeded:e=>this.m(e)})}m(e){const t=e.target.result.createObjectStore("cache-entries",{keyPath:"id"});t.createIndex("cacheName","cacheName",{unique:!1}),t.createIndex("timestamp","timestamp",{unique:!1}),(async e=>{await new Promise((t,s)=>{const n=indexedDB.deleteDatabase(e);n.onerror=()=>{s(n.error)},n.onblocked=()=>{s(new Error("Delete blocked"))},n.onsuccess=()=>{t()}})})(this.v)}async setTimestamp(e,t){const s={url:e=y(e),timestamp:t,cacheName:this.v,id:this.R(e)};await this.o.put("cache-entries",s)}async getTimestamp(e){return(await this.o.get("cache-entries",this.R(e))).timestamp}async expireEntries(e,t){const s=await this.o.transaction("cache-entries","readwrite",(s,n)=>{const i=s.objectStore("cache-entries").index("timestamp").openCursor(null,"prev"),c=[];let a=0;i.onsuccess=()=>{const s=i.result;if(s){const n=s.value;n.cacheName===this.v&&(e&&n.timestamp<e||t&&a>=t?c.push(s.value):a++),s.continue()}else n(c)}}),n=[];for(const e of s)await this.o.delete("cache-entries",e.id),n.push(e.url);return n}R(e){return this.v+"|"+y(e)}}class v{constructor(e,t={}){this.q=!1,this._=!1,this.j=t.maxEntries,this.U=t.maxAgeSeconds,this.v=e,this.L=new g(e)}async expireEntries(){if(this.q)return void(this._=!0);this.q=!0;const e=this.U?Date.now()-1e3*this.U:0,t=await this.L.expireEntries(e,this.j),s=await self.caches.open(this.v);for(const e of t)await s.delete(e);this.q=!1,this._&&(this._=!1,l(this.expireEntries()))}async updateTimestamp(e){await this.L.setTimestamp(e,Date.now())}async isURLExpired(e){if(this.U){return await this.L.getTimestamp(e)<Date.now()-1e3*this.U}return!1}async delete(){this._=!1,await this.L.expireEntries(1/0)}}const m=(e,t)=>e.filter(e=>t in e),R=async({request:e,mode:t,plugins:s=[]})=>{const n=m(s,"cacheKeyWillBeUsed");let i=e;for(const e of n)i=await e.cacheKeyWillBeUsed.call(e,{mode:t,request:i}),"string"==typeof i&&(i=new Request(i));return i},x=async({cacheName:e,request:t,event:s,matchOptions:n,plugins:i=[]})=>{const c=await self.caches.open(e),a=await R({plugins:i,request:t,mode:"read"});let r=await c.match(a,n);for(const t of i)if("cachedResponseWillBeUsed"in t){const i=t.cachedResponseWillBeUsed;r=await i.call(t,{cacheName:e,event:s,matchOptions:n,cachedResponse:r,request:a})}return r},q=async({cacheName:e,request:s,response:n,event:i,plugins:a=[],matchOptions:r})=>{const o=await R({plugins:a,request:s,mode:"write"});if(!n)throw new t("cache-put-with-no-response",{url:c(o.url)});const h=await(async({request:e,response:t,event:s,plugins:n=[]})=>{let i=t,c=!1;for(const t of n)if("cacheWillUpdate"in t){c=!0;const n=t.cacheWillUpdate;if(i=await n.call(t,{request:e,response:i,event:s}),!i)break}return c||(i=i&&200===i.status?i:void 0),i||null})({event:i,plugins:a,response:n,request:o});if(!h)return;const u=await self.caches.open(e),f=m(a,"cacheDidUpdate"),d=f.length>0?await x({cacheName:e,matchOptions:r,request:o}):null;try{await u.put(o,h)}catch(e){throw"QuotaExceededError"===e.name&&await async function(){for(const e of w)await e()}(),e}for(const t of f)await t.cacheDidUpdate.call(t,{cacheName:e,event:i,oldResponse:d,newResponse:h,request:o})},j=x,U=async({request:e,fetchOptions:s,event:n,plugins:i=[]})=>{if("string"==typeof e&&(e=new Request(e)),n instanceof FetchEvent&&n.preloadResponse){const e=await n.preloadResponse;if(e)return e}const c=m(i,"fetchDidFail"),a=c.length>0?e.clone():null;try{for(const t of i)if("requestWillFetch"in t){const s=t.requestWillFetch,i=e.clone();e=await s.call(t,{request:i,event:n})}}catch(e){throw new t("plugin-error-request-will-fetch",{thrownError:e})}const r=e.clone();try{let t;t="navigate"===e.mode?await fetch(e):await fetch(e,s);for(const e of i)"fetchDidSucceed"in e&&(t=await e.fetchDidSucceed.call(e,{event:n,request:r,response:t}));return t}catch(e){for(const t of c)await t.fetchDidFail.call(t,{error:e,event:n,originalRequest:a.clone(),request:r.clone()});throw e}};try{self["workbox:strategies:5.1.3"]&&_()}catch(e){}const E={cacheWillUpdate:async({response:e})=>200===e.status||0===e.status?e:null};let L;async function M(e,t){const s=e.clone(),n={headers:new Headers(s.headers),status:s.status,statusText:s.statusText},i=t?t(n):n,c=function(){if(void 0===L){const e=new Response("");if("body"in e)try{new Response(e.body),L=!0}catch(e){L=!1}L=!1}return L}()?s.body:await s.blob();return new Response(c,i)}try{self["workbox:precaching:5.1.3"]&&_()}catch(e){}function k(e){if(!e)throw new t("add-to-cache-list-unexpected-type",{entry:e});if("string"==typeof e){const t=new URL(e,location.href);return{cacheKey:t.href,url:t.href}}const{revision:s,url:n}=e;if(!n)throw new t("add-to-cache-list-unexpected-type",{entry:e});if(!s){const e=new URL(n,location.href);return{cacheKey:e.href,url:e.href}}const i=new URL(n,location.href),c=new URL(n,location.href);return i.searchParams.set("__WB_REVISION__",s),{cacheKey:i.href,url:c.href}}class D{constructor(e){this.v=f(e),this.M=new Map,this.k=new Map,this.D=new Map}addToCacheList(e){const s=[];for(const n of e){"string"==typeof n?s.push(n):n&&void 0===n.revision&&s.push(n.url);const{cacheKey:e,url:i}=k(n),c="string"!=typeof n&&n.revision?"reload":"default";if(this.M.has(i)&&this.M.get(i)!==e)throw new t("add-to-cache-list-conflicting-entries",{firstEntry:this.M.get(i),secondEntry:e});if("string"!=typeof n&&n.integrity){if(this.D.has(e)&&this.D.get(e)!==n.integrity)throw new t("add-to-cache-list-conflicting-integrities",{url:i});this.D.set(e,n.integrity)}if(this.M.set(i,e),this.k.set(i,c),s.length>0){const e=`Workbox is precaching URLs without revision info: ${s.join(", ")}\nThis is generally NOT safe. Learn more at https://bit.ly/wb-precache`;console.warn(e)}}}async install({event:e,plugins:t}={}){const s=[],n=[],i=await self.caches.open(this.v),c=await i.keys(),a=new Set(c.map(e=>e.url));for(const[e,t]of this.M)a.has(t)?n.push(e):s.push({cacheKey:t,url:e});const r=s.map(({cacheKey:s,url:n})=>{const i=this.D.get(s),c=this.k.get(n);return this.N({cacheKey:s,cacheMode:c,event:e,integrity:i,plugins:t,url:n})});await Promise.all(r);return{updatedURLs:s.map(e=>e.url),notUpdatedURLs:n}}async activate(){const e=await self.caches.open(this.v),t=await e.keys(),s=new Set(this.M.values()),n=[];for(const i of t)s.has(i.url)||(await e.delete(i),n.push(i.url));return{deletedURLs:n}}async N({cacheKey:e,url:s,cacheMode:n,event:i,plugins:c,integrity:a}){const r=new Request(s,{integrity:a,cache:n,credentials:"same-origin"});let o,h=await U({event:i,plugins:c,request:r});for(const e of c||[])"cacheWillUpdate"in e&&(o=e);if(!(o?await o.cacheWillUpdate({event:i,request:r,response:h}):h.status<400))throw new t("bad-precaching-response",{url:s,status:h.status});h.redirected&&(h=await M(h)),await q({event:i,plugins:c,response:h,request:e===s?r:new Request(e),cacheName:this.v,matchOptions:{ignoreSearch:!0}})}getURLsToCacheKeys(){return this.M}getCachedURLs(){return[...this.M.keys()]}getCacheKeyForURL(e){const t=new URL(e,location.href);return this.M.get(t.href)}async matchPrecache(e){const t=e instanceof Request?e.url:e,s=this.getCacheKeyForURL(t);if(s){return(await self.caches.open(this.v)).match(s)}}createHandler(e=!0){return async({request:s})=>{try{const e=await this.matchPrecache(s);if(e)return e;throw new t("missing-precache-entry",{cacheName:this.v,url:s instanceof Request?s.url:s})}catch(t){if(e)return fetch(s);throw t}}}createHandlerBoundToURL(e,s=!0){if(!this.getCacheKeyForURL(e))throw new t("non-precached-url",{url:e});const n=this.createHandler(s),i=new Request(e);return()=>n({request:i})}}let N;const T=()=>(N||(N=new D),N);const K=(e,t)=>{const s=T().getURLsToCacheKeys();for(const n of function*(e,{ignoreURLParametersMatching:t,directoryIndex:s,cleanURLs:n,urlManipulation:i}={}){const c=new URL(e,location.href);c.hash="",yield c.href;const a=function(e,t=[]){for(const s of[...e.searchParams.keys()])t.some(e=>e.test(s))&&e.searchParams.delete(s);return e}(c,t);if(yield a.href,s&&a.pathname.endsWith("/")){const e=new URL(a.href);e.pathname+=s,yield e.href}if(n){const e=new URL(a.href);e.pathname+=".html",yield e.href}if(i){const e=i({url:c});for(const t of e)yield t.href}}(e,t)){const e=s.get(n);if(e)return e}};let P=!1;function O(e){P||((({ignoreURLParametersMatching:e=[/^utm_/],directoryIndex:t="index.html",cleanURLs:s=!0,urlManipulation:n}={})=>{const i=f();self.addEventListener("fetch",c=>{const a=K(c.request.url,{cleanURLs:s,directoryIndex:t,ignoreURLParametersMatching:e,urlManipulation:n});if(!a)return;let r=self.caches.open(i).then(e=>e.match(a)).then(e=>e||fetch(a));c.respondWith(r)})})(e),P=!0)}const Q=[],C={get:()=>Q,add(e){Q.push(...e)}},J=e=>{const t=T(),s=C.get();e.waitUntil(t.install({event:e,plugins:s}).catch(e=>{throw e}))},z=e=>{const t=T();e.waitUntil(t.activate())};var I;self.addEventListener("message",e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()}),I={},function(e){T().addToCacheList(e),e.length>0&&(self.addEventListener("install",J),self.addEventListener("activate",z))}([{url:"_next/static/QhzvbREx5R3jJMUh5w7D8/_buildManifest.js",revision:"c3a6ce291856e5d57f9dcdf7cc03864a"},{url:"_next/static/QhzvbREx5R3jJMUh5w7D8/_ssgManifest.js",revision:"abee47769bf307639ace4945f9cfd4ff"},{url:"_next/static/QhzvbREx5R3jJMUh5w7D8/pages/_app.js",revision:"33f35ff1034098e6773424395ebc3ce8"},{url:"_next/static/QhzvbREx5R3jJMUh5w7D8/pages/_error.js",revision:"e8ce70d392c587b109ff3b22e814179b"},{url:"_next/static/QhzvbREx5R3jJMUh5w7D8/pages/course/[cid]/queue/[qid].js",revision:"eca1cd83c7f47fa0a5a448f740852541"},{url:"_next/static/QhzvbREx5R3jJMUh5w7D8/pages/course/[cid]/schedule.js",revision:"0288a6b75072a822609de574c4fcd821"},{url:"_next/static/QhzvbREx5R3jJMUh5w7D8/pages/course/[cid]/today.js",revision:"7b640b2699d11c2e49e1353acbaefc71"},{url:"_next/static/QhzvbREx5R3jJMUh5w7D8/pages/dev.js",revision:"eff64a6babf3aef9dfd4f92ae9583493"},{url:"_next/static/QhzvbREx5R3jJMUh5w7D8/pages/index.js",revision:"945cf84d69e1bd9a1dbe6a24d669a562"},{url:"_next/static/QhzvbREx5R3jJMUh5w7D8/pages/login.js",revision:"bd5d0aa2649648fbc34f2ffdbfba9401"},{url:"_next/static/QhzvbREx5R3jJMUh5w7D8/pages/nocourses.js",revision:"52797dec0deb9046ebb8d31bbf50f1c5"},{url:"_next/static/QhzvbREx5R3jJMUh5w7D8/pages/settings.js",revision:"4999055e09320b8cbe79f7a0e5a980ad"},{url:"_next/static/chunks/1029c40c1a49c876f77078763942f939a7eb4965.e43c8ed79f9662adf44c.js",revision:"ad1f6c7d050ba9b3ee05b06dae35be9d"},{url:"_next/static/chunks/1ac8e34706ad2f3b8e0bc8613b0eae0cccfd45a0.c85c9f7dbff57920ebd9.js",revision:"ebf84fa6f4407993d96df170af9b6aec"},{url:"_next/static/chunks/29107295.57c205444afd2d06740a.js",revision:"b95ffe42c5645e40ee6c4857c15e0e4d"},{url:"_next/static/chunks/371912e8a5d78fb01a2b8e7c77df1d43f3195785.6aafbe998de7c270fe19.js",revision:"bad72064c80074c0790350f250e77768"},{url:"_next/static/chunks/496cf6fc353716a4f2221f1588be00f6d2a6318d.9176c64ca5fcccc0a30f.js",revision:"a37fd492cedc5e5124492f6547225d36"},{url:"_next/static/chunks/66f2527c55fc5000a4d65cb77c25402e8a13db3b.9bf193d53125b0257899.js",revision:"b99267db4d46c2cc283966e8a8eba285"},{url:"_next/static/chunks/7ec9ed55dd8d37e79778c1138a0a6058165838c1.9ce607cf4728896ae47e.js",revision:"eab1df94bb00500bbf966682cbff8563"},{url:"_next/static/chunks/83c926d6c29a2489e973e3402bc032d178079618.6063326b38eba2c96076.js",revision:"c3a801d7641780c23bdd109deadfc9eb"},{url:"_next/static/chunks/8e2e0f42349b74f9d4402ba2f968f026a2ab3af3.475aa6618c25f93d0df1.js",revision:"ec092ef9f1ba3db3c20782de692ab7f3"},{url:"_next/static/chunks/a29ae703.a6b1d49c8c18c916051d.js",revision:"b4d98aa353fdfb78b8e2798fbf65b083"},{url:"_next/static/chunks/c96b4d7e.27fa719770faefd04467.js",revision:"dde108a23977804cd02adb08e870f0a9"},{url:"_next/static/chunks/commons.c79698ec122ee14b00e1.js",revision:"d5f90fb4d3602b935e96407c5fb942e0"},{url:"_next/static/chunks/d61d76f102ce4379c5e74bd21cca389ae1a40eab.96e54de04c15d71ed2ef.js",revision:"320ba47308a55511fbb376bcd91dd61b"},{url:"_next/static/chunks/de857dca632b59ee0973e47cc83aeabc0b7520f9.3a134da5df83fd96b9c8.js",revision:"1539bd10c70f29a40fdff441ccc7300b"},{url:"_next/static/chunks/ee4830198e55293fb218fd1d1ea91b5bb02156b9.b990028738d317dba5be.js",revision:"38e26b0364ab599527ccebd902ae2fea"},{url:"_next/static/chunks/efede6371aa2777ee7b9af41c6df3c35208d8be3.9708f84493aff45b242d.js",revision:"56c6e962e4c17458c493b2591c940a56"},{url:"_next/static/chunks/f442ad582a88bd847ca9859020fdddc8d5eecb33.489f4428fd1c6ea614b2.js",revision:"87d8029ebd6e5d428f3e582b558aa1ff"},{url:"_next/static/chunks/fc8d00fd.afd2d8f4015a50040cc7.js",revision:"034a5909526fbfd8b9f907ec8a52d5df"},{url:"_next/static/chunks/framework.ecbd939e3f22c21530d6.js",revision:"f1f44d4b846ef72b49ca7ba18b1f46ed"},{url:"_next/static/css/0b10e9f32b7d87c5b5ed.css",revision:"9b6bf2b0849057358aaaeb0dd19e37db"},{url:"_next/static/css/20de8917c44a516a459d.css",revision:"9a8cd95b5f951cd1c4dfc2843aaa0909"},{url:"_next/static/runtime/main-35dd3106a90fb78b53d9.js",revision:"24ad9fc64cbd38bf999236031401fdba"},{url:"_next/static/runtime/polyfills-af445991d1bdd9ff562d.js",revision:"47029bf386dd05a69e8f30f6bcc63580"},{url:"_next/static/runtime/webpack-1c5199ff66550d26e499.js",revision:"029ee2e7063b1566925082c49e4afc45"}]),O(I),function(e,s,c){let a;if("string"==typeof e){const t=new URL(e,location.href);a=new n(({url:e})=>e.href===t.href,s,c)}else if(e instanceof RegExp)a=new i(e,s,c);else if("function"==typeof e)a=new n(e,s,c);else{if(!(e instanceof n))throw new t("unsupported-route-type",{moduleName:"workbox-routing",funcName:"registerRoute",paramName:"capture"});a=e}o().registerRoute(a)}(/^https?.*/,new class{constructor(e={}){if(this.v=d(e.cacheName),e.plugins){const t=e.plugins.some(e=>!!e.cacheWillUpdate);this.T=t?e.plugins:[E,...e.plugins]}else this.T=[E];this.K=e.networkTimeoutSeconds||0,this.P=e.fetchOptions,this.O=e.matchOptions}async handle({event:e,request:s}){const n=[];"string"==typeof s&&(s=new Request(s));const i=[];let c;if(this.K){const{id:t,promise:a}=this.C({request:s,event:e,logs:n});c=t,i.push(a)}const a=this.J({timeoutId:c,request:s,event:e,logs:n});i.push(a);let r=await Promise.race(i);if(r||(r=await a),!r)throw new t("no-response",{url:s.url});return r}C({request:e,logs:t,event:s}){let n;return{promise:new Promise(t=>{n=setTimeout(async()=>{t(await this.I({request:e,event:s}))},1e3*this.K)}),id:n}}async J({timeoutId:e,request:t,logs:s,event:n}){let i,c;try{c=await U({request:t,event:n,fetchOptions:this.P,plugins:this.T})}catch(e){i=e}if(e&&clearTimeout(e),i||!c)c=await this.I({request:t,event:n});else{const e=c.clone(),s=q({cacheName:this.v,request:t,response:e,event:n,plugins:this.T});if(n)try{n.waitUntil(s)}catch(e){}}return c}I({event:e,request:t}){return j({cacheName:this.v,request:t,event:e,matchOptions:this.O,plugins:this.T})}}({cacheName:"offlineCache",plugins:[new class{constructor(e={}){var t;this.cachedResponseWillBeUsed=async({event:e,request:t,cacheName:s,cachedResponse:n})=>{if(!n)return null;const i=this.A(n),c=this.S(s);l(c.expireEntries());const a=c.updateTimestamp(t.url);if(e)try{e.waitUntil(a)}catch(e){}return i?n:null},this.cacheDidUpdate=async({cacheName:e,request:t})=>{const s=this.S(e);await s.updateTimestamp(t.url),await s.expireEntries()},this.W=e,this.U=e.maxAgeSeconds,this.B=new Map,e.purgeOnQuotaError&&(t=()=>this.deleteCacheAndMetadata(),w.add(t))}S(e){if(e===d())throw new t("expire-custom-caches-only");let s=this.B.get(e);return s||(s=new v(e,this.W),this.B.set(e,s)),s}A(e){if(!this.U)return!0;const t=this.F(e);if(null===t)return!0;return t>=Date.now()-1e3*this.U}F(e){if(!e.headers.has("date"))return null;const t=e.headers.get("date"),s=new Date(t).getTime();return isNaN(s)?null:s}async deleteCacheAndMetadata(){for(const[e,t]of this.B)await self.caches.delete(e),await t.delete();this.B=new Map}}({maxEntries:200,purgeOnQuotaError:!0})]}),"GET");
//# sourceMappingURL=service-worker.js.map
