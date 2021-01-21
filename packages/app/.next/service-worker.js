try{self["workbox:core:5.1.3"]&&_()}catch(e){}const e=(e,...t)=>{let s=e;return t.length>0&&(s+=" :: "+JSON.stringify(t)),s};class t extends Error{constructor(t,s){super(e(t,s)),this.name=t,this.details=s}}try{self["workbox:routing:5.1.3"]&&_()}catch(e){}const s=e=>e&&"object"==typeof e?e:{handle:e};class n{constructor(e,t,n="GET"){this.handler=s(t),this.match=e,this.method=n}}class a extends n{constructor(e,t,s){super(({url:t})=>{const s=e.exec(t.href);if(s&&(t.origin===location.origin||0===s.index))return s.slice(1)},t,s)}}const i=e=>new URL(String(e),location.href).href.replace(new RegExp("^"+location.origin),"");class c{constructor(){this.t=new Map}get routes(){return this.t}addFetchListener(){self.addEventListener("fetch",e=>{const{request:t}=e,s=this.handleRequest({request:t,event:e});s&&e.respondWith(s)})}addCacheListener(){self.addEventListener("message",e=>{if(e.data&&"CACHE_URLS"===e.data.type){const{payload:t}=e.data,s=Promise.all(t.urlsToCache.map(e=>{"string"==typeof e&&(e=[e]);const t=new Request(...e);return this.handleRequest({request:t})}));e.waitUntil(s),e.ports&&e.ports[0]&&s.then(()=>e.ports[0].postMessage(!0))}})}handleRequest({request:e,event:t}){const s=new URL(e.url,location.href);if(!s.protocol.startsWith("http"))return;const{params:n,route:a}=this.findMatchingRoute({url:s,request:e,event:t});let i,c=a&&a.handler;if(!c&&this.s&&(c=this.s),c){try{i=c.handle({url:s,request:e,event:t,params:n})}catch(e){i=Promise.reject(e)}return i instanceof Promise&&this.i&&(i=i.catch(n=>this.i.handle({url:s,request:e,event:t}))),i}}findMatchingRoute({url:e,request:t,event:s}){const n=this.t.get(t.method)||[];for(const a of n){let n;const i=a.match({url:e,request:t,event:s});if(i)return n=i,(Array.isArray(i)&&0===i.length||i.constructor===Object&&0===Object.keys(i).length||"boolean"==typeof i)&&(n=void 0),{route:a,params:n}}return{}}setDefaultHandler(e){this.s=s(e)}setCatchHandler(e){this.i=s(e)}registerRoute(e){this.t.has(e.method)||this.t.set(e.method,[]),this.t.get(e.method).push(e)}unregisterRoute(e){if(!this.t.has(e.method))throw new t("unregister-route-but-not-found-with-method",{method:e.method});const s=this.t.get(e.method).indexOf(e);if(!(s>-1))throw new t("unregister-route-route-not-registered");this.t.get(e.method).splice(s,1)}}let r;const o=()=>(r||(r=new c,r.addFetchListener(),r.addCacheListener()),r);const u={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"workbox",runtime:"runtime",suffix:"undefined"!=typeof registration?registration.scope:""},f=e=>[u.prefix,e,u.suffix].filter(e=>e&&e.length>0).join("-"),h=e=>e||f(u.precache),d=e=>e||f(u.runtime);function l(e){e.then(()=>{})}const w=new Set;class b{constructor(e,t,{onupgradeneeded:s,onversionchange:n}={}){this.o=null,this.u=e,this.h=t,this.l=s,this.p=n||(()=>this.close())}get db(){return this.o}async open(){if(!this.o)return this.o=await new Promise((e,t)=>{let s=!1;setTimeout(()=>{s=!0,t(new Error("The open request was blocked and timed out"))},this.OPEN_TIMEOUT);const n=indexedDB.open(this.u,this.h);n.onerror=()=>t(n.error),n.onupgradeneeded=e=>{s?(n.transaction.abort(),n.result.close()):"function"==typeof this.l&&this.l(e)},n.onsuccess=()=>{const t=n.result;s?t.close():(t.onversionchange=this.p.bind(this),e(t))}}),this}async getKey(e,t){return(await this.getAllKeys(e,t,1))[0]}async getAll(e,t,s){return await this.getAllMatching(e,{query:t,count:s})}async getAllKeys(e,t,s){return(await this.getAllMatching(e,{query:t,count:s,includeKeys:!0})).map(e=>e.key)}async getAllMatching(e,{index:t,query:s=null,direction:n="next",count:a,includeKeys:i=!1}={}){return await this.transaction([e],"readonly",(c,r)=>{const o=c.objectStore(e),u=t?o.index(t):o,f=[],h=u.openCursor(s,n);h.onsuccess=()=>{const e=h.result;e?(f.push(i?e:e.value),a&&f.length>=a?r(f):e.continue()):r(f)}})}async transaction(e,t,s){return await this.open(),await new Promise((n,a)=>{const i=this.o.transaction(e,t);i.onabort=()=>a(i.error),i.oncomplete=()=>n(),s(i,e=>n(e))})}async g(e,t,s,...n){return await this.transaction([t],s,(s,a)=>{const i=s.objectStore(t),c=i[e].apply(i,n);c.onsuccess=()=>a(c.result)})}close(){this.o&&(this.o.close(),this.o=null)}}b.prototype.OPEN_TIMEOUT=2e3;const p={readonly:["get","count","getKey","getAll","getAllKeys"],readwrite:["add","put","clear","delete"]};for(const[e,t]of Object.entries(p))for(const s of t)s in IDBObjectStore.prototype&&(b.prototype[s]=async function(t,...n){return await this.g(s,t,e,...n)});try{self["workbox:expiration:5.1.3"]&&_()}catch(e){}const y=e=>{const t=new URL(e,location.href);return t.hash="",t.href};class g{constructor(e){this.m=e,this.o=new b("workbox-expiration",1,{onupgradeneeded:e=>this.v(e)})}v(e){const t=e.target.result.createObjectStore("cache-entries",{keyPath:"id"});t.createIndex("cacheName","cacheName",{unique:!1}),t.createIndex("timestamp","timestamp",{unique:!1}),(async e=>{await new Promise((t,s)=>{const n=indexedDB.deleteDatabase(e);n.onerror=()=>{s(n.error)},n.onblocked=()=>{s(new Error("Delete blocked"))},n.onsuccess=()=>{t()}})})(this.m)}async setTimestamp(e,t){const s={url:e=y(e),timestamp:t,cacheName:this.m,id:this._(e)};await this.o.put("cache-entries",s)}async getTimestamp(e){return(await this.o.get("cache-entries",this._(e))).timestamp}async expireEntries(e,t){const s=await this.o.transaction("cache-entries","readwrite",(s,n)=>{const a=s.objectStore("cache-entries").index("timestamp").openCursor(null,"prev"),i=[];let c=0;a.onsuccess=()=>{const s=a.result;if(s){const n=s.value;n.cacheName===this.m&&(e&&n.timestamp<e||t&&c>=t?i.push(s.value):c++),s.continue()}else n(i)}}),n=[];for(const e of s)await this.o.delete("cache-entries",e.id),n.push(e.url);return n}_(e){return this.m+"|"+y(e)}}class m{constructor(e,t={}){this.q=!1,this.R=!1,this.j=t.maxEntries,this.U=t.maxAgeSeconds,this.m=e,this.L=new g(e)}async expireEntries(){if(this.q)return void(this.R=!0);this.q=!0;const e=this.U?Date.now()-1e3*this.U:0,t=await this.L.expireEntries(e,this.j),s=await self.caches.open(this.m);for(const e of t)await s.delete(e);this.q=!1,this.R&&(this.R=!1,l(this.expireEntries()))}async updateTimestamp(e){await this.L.setTimestamp(e,Date.now())}async isURLExpired(e){if(this.U){return await this.L.getTimestamp(e)<Date.now()-1e3*this.U}return!1}async delete(){this.R=!1,await this.L.expireEntries(1/0)}}const v=(e,t)=>e.filter(e=>t in e),x=async({request:e,mode:t,plugins:s=[]})=>{const n=v(s,"cacheKeyWillBeUsed");let a=e;for(const e of n)a=await e.cacheKeyWillBeUsed.call(e,{mode:t,request:a}),"string"==typeof a&&(a=new Request(a));return a},q=async({cacheName:e,request:t,event:s,matchOptions:n,plugins:a=[]})=>{const i=await self.caches.open(e),c=await x({plugins:a,request:t,mode:"read"});let r=await i.match(c,n);for(const t of a)if("cachedResponseWillBeUsed"in t){const a=t.cachedResponseWillBeUsed;r=await a.call(t,{cacheName:e,event:s,matchOptions:n,cachedResponse:r,request:c})}return r},R=async({cacheName:e,request:s,response:n,event:a,plugins:c=[],matchOptions:r})=>{const o=await x({plugins:c,request:s,mode:"write"});if(!n)throw new t("cache-put-with-no-response",{url:i(o.url)});const u=await(async({request:e,response:t,event:s,plugins:n=[]})=>{let a=t,i=!1;for(const t of n)if("cacheWillUpdate"in t){i=!0;const n=t.cacheWillUpdate;if(a=await n.call(t,{request:e,response:a,event:s}),!a)break}return i||(a=a&&200===a.status?a:void 0),a||null})({event:a,plugins:c,response:n,request:o});if(!u)return;const f=await self.caches.open(e),h=v(c,"cacheDidUpdate"),d=h.length>0?await q({cacheName:e,matchOptions:r,request:o}):null;try{await f.put(o,u)}catch(e){throw"QuotaExceededError"===e.name&&await async function(){for(const e of w)await e()}(),e}for(const t of h)await t.cacheDidUpdate.call(t,{cacheName:e,event:a,oldResponse:d,newResponse:u,request:o})},j=q,U=async({request:e,fetchOptions:s,event:n,plugins:a=[]})=>{if("string"==typeof e&&(e=new Request(e)),n instanceof FetchEvent&&n.preloadResponse){const e=await n.preloadResponse;if(e)return e}const i=v(a,"fetchDidFail"),c=i.length>0?e.clone():null;try{for(const t of a)if("requestWillFetch"in t){const s=t.requestWillFetch,a=e.clone();e=await s.call(t,{request:a,event:n})}}catch(e){throw new t("plugin-error-request-will-fetch",{thrownError:e})}const r=e.clone();try{let t;t="navigate"===e.mode?await fetch(e):await fetch(e,s);for(const e of a)"fetchDidSucceed"in e&&(t=await e.fetchDidSucceed.call(e,{event:n,request:r,response:t}));return t}catch(e){for(const t of i)await t.fetchDidFail.call(t,{error:e,event:n,originalRequest:c.clone(),request:r.clone()});throw e}};try{self["workbox:strategies:5.1.3"]&&_()}catch(e){}const E={cacheWillUpdate:async({response:e})=>200===e.status||0===e.status?e:null};let L;async function k(e,t){const s=e.clone(),n={headers:new Headers(s.headers),status:s.status,statusText:s.statusText},a=t?t(n):n,i=function(){if(void 0===L){const e=new Response("");if("body"in e)try{new Response(e.body),L=!0}catch(e){L=!1}L=!1}return L}()?s.body:await s.blob();return new Response(i,a)}try{self["workbox:precaching:5.1.3"]&&_()}catch(e){}function N(e){if(!e)throw new t("add-to-cache-list-unexpected-type",{entry:e});if("string"==typeof e){const t=new URL(e,location.href);return{cacheKey:t.href,url:t.href}}const{revision:s,url:n}=e;if(!n)throw new t("add-to-cache-list-unexpected-type",{entry:e});if(!s){const e=new URL(n,location.href);return{cacheKey:e.href,url:e.href}}const a=new URL(n,location.href),i=new URL(n,location.href);return a.searchParams.set("__WB_REVISION__",s),{cacheKey:a.href,url:i.href}}class Z{constructor(e){this.m=h(e),this.k=new Map,this.N=new Map,this.Z=new Map}addToCacheList(e){const s=[];for(const n of e){"string"==typeof n?s.push(n):n&&void 0===n.revision&&s.push(n.url);const{cacheKey:e,url:a}=N(n),i="string"!=typeof n&&n.revision?"reload":"default";if(this.k.has(a)&&this.k.get(a)!==e)throw new t("add-to-cache-list-conflicting-entries",{firstEntry:this.k.get(a),secondEntry:e});if("string"!=typeof n&&n.integrity){if(this.Z.has(e)&&this.Z.get(e)!==n.integrity)throw new t("add-to-cache-list-conflicting-integrities",{url:a});this.Z.set(e,n.integrity)}if(this.k.set(a,e),this.N.set(a,i),s.length>0){const e=`Workbox is precaching URLs without revision info: ${s.join(", ")}\nThis is generally NOT safe. Learn more at https://bit.ly/wb-precache`;console.warn(e)}}}async install({event:e,plugins:t}={}){const s=[],n=[],a=await self.caches.open(this.m),i=await a.keys(),c=new Set(i.map(e=>e.url));for(const[e,t]of this.k)c.has(t)?n.push(e):s.push({cacheKey:t,url:e});const r=s.map(({cacheKey:s,url:n})=>{const a=this.Z.get(s),i=this.N.get(n);return this.A({cacheKey:s,cacheMode:i,event:e,integrity:a,plugins:t,url:n})});await Promise.all(r);return{updatedURLs:s.map(e=>e.url),notUpdatedURLs:n}}async activate(){const e=await self.caches.open(this.m),t=await e.keys(),s=new Set(this.k.values()),n=[];for(const a of t)s.has(a.url)||(await e.delete(a),n.push(a.url));return{deletedURLs:n}}async A({cacheKey:e,url:s,cacheMode:n,event:a,plugins:i,integrity:c}){const r=new Request(s,{integrity:c,cache:n,credentials:"same-origin"});let o,u=await U({event:a,plugins:i,request:r});for(const e of i||[])"cacheWillUpdate"in e&&(o=e);if(!(o?await o.cacheWillUpdate({event:a,request:r,response:u}):u.status<400))throw new t("bad-precaching-response",{url:s,status:u.status});u.redirected&&(u=await k(u)),await R({event:a,plugins:i,response:u,request:e===s?r:new Request(e),cacheName:this.m,matchOptions:{ignoreSearch:!0}})}getURLsToCacheKeys(){return this.k}getCachedURLs(){return[...this.k.keys()]}getCacheKeyForURL(e){const t=new URL(e,location.href);return this.k.get(t.href)}async matchPrecache(e){const t=e instanceof Request?e.url:e,s=this.getCacheKeyForURL(t);if(s){return(await self.caches.open(this.m)).match(s)}}createHandler(e=!0){return async({request:s})=>{try{const e=await this.matchPrecache(s);if(e)return e;throw new t("missing-precache-entry",{cacheName:this.m,url:s instanceof Request?s.url:s})}catch(t){if(e)return fetch(s);throw t}}}createHandlerBoundToURL(e,s=!0){if(!this.getCacheKeyForURL(e))throw new t("non-precached-url",{url:e});const n=this.createHandler(s),a=new Request(e);return()=>n({request:a})}}let A;const W=()=>(A||(A=new Z),A);const M=(e,t)=>{const s=W().getURLsToCacheKeys();for(const n of function*(e,{ignoreURLParametersMatching:t,directoryIndex:s,cleanURLs:n,urlManipulation:a}={}){const i=new URL(e,location.href);i.hash="",yield i.href;const c=function(e,t=[]){for(const s of[...e.searchParams.keys()])t.some(e=>e.test(s))&&e.searchParams.delete(s);return e}(i,t);if(yield c.href,s&&c.pathname.endsWith("/")){const e=new URL(c.href);e.pathname+=s,yield e.href}if(n){const e=new URL(c.href);e.pathname+=".html",yield e.href}if(a){const e=a({url:i});for(const t of e)yield t.href}}(e,t)){const e=s.get(n);if(e)return e}};let T=!1;function K(e){T||((({ignoreURLParametersMatching:e=[/^utm_/],directoryIndex:t="index.html",cleanURLs:s=!0,urlManipulation:n}={})=>{const a=h();self.addEventListener("fetch",i=>{const c=M(i.request.url,{cleanURLs:s,directoryIndex:t,ignoreURLParametersMatching:e,urlManipulation:n});if(!c)return;let r=self.caches.open(a).then(e=>e.match(c)).then(e=>e||fetch(c));i.respondWith(r)})})(e),T=!0)}const P=[],O={get:()=>P,add(e){P.push(...e)}},D=e=>{const t=W(),s=O.get();e.waitUntil(t.install({event:e,plugins:s}).catch(e=>{throw e}))},G=e=>{const t=W();e.waitUntil(t.activate())};var C;self.addEventListener("message",e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()}),C={},function(e){W().addToCacheList(e),e.length>0&&(self.addEventListener("install",D),self.addEventListener("activate",G))}([{url:"_next/static/ZyWjXVal930eZAGdEtaw_/_buildManifest.js",revision:"6fb2892d9dee2813a7748eada764eeba"},{url:"_next/static/ZyWjXVal930eZAGdEtaw_/_ssgManifest.js",revision:"abee47769bf307639ace4945f9cfd4ff"},{url:"_next/static/ZyWjXVal930eZAGdEtaw_/pages/_app.js",revision:"44683609479cc4b0ef963818ce68c6a6"},{url:"_next/static/ZyWjXVal930eZAGdEtaw_/pages/_error.js",revision:"e8ce70d392c587b109ff3b22e814179b"},{url:"_next/static/ZyWjXVal930eZAGdEtaw_/pages/course/[cid]/queue/[qid].js",revision:"ebc09cc8e61d1afc8137fd6b0531bdbd"},{url:"_next/static/ZyWjXVal930eZAGdEtaw_/pages/course/[cid]/schedule.js",revision:"14b19b2498dcd96b3e5a8efa3d948496"},{url:"_next/static/ZyWjXVal930eZAGdEtaw_/pages/course/[cid]/today.js",revision:"842527628eca8cbe3e16120781566685"},{url:"_next/static/ZyWjXVal930eZAGdEtaw_/pages/dev.js",revision:"68f08dcca1a3016ec6323651c092ab48"},{url:"_next/static/ZyWjXVal930eZAGdEtaw_/pages/index.js",revision:"9a138b2aadd1c64f670f46c507433616"},{url:"_next/static/ZyWjXVal930eZAGdEtaw_/pages/login.js",revision:"5301858f25a54a4d827a11df74f97ede"},{url:"_next/static/ZyWjXVal930eZAGdEtaw_/pages/nocourses.js",revision:"610eaf392931c7460c2038a78f2cfd46"},{url:"_next/static/ZyWjXVal930eZAGdEtaw_/pages/settings.js",revision:"a7e194cf3507f4f13d4f97a7034d124c"},{url:"_next/static/chunks/0cb7348278e6681b37eb6379fdc1771784da654e.68b600bb19fc7cc57e73.js",revision:"c1a5434e42f5d46a1391d05465f6ca50"},{url:"_next/static/chunks/29107295.9234196b81fd02ccfdc7.js",revision:"29e5c0bc2f6690c6e84e9faa88072e02"},{url:"_next/static/chunks/3375c9dc30352c90fcfbb16d2edc619257944c6f.9708f84493aff45b242d.js",revision:"82e1b5e5603d3b335dd4d35c244cd263"},{url:"_next/static/chunks/5c091f332a5b26dded1ebf84c1f8b2a1687324b5.bacbb74cf072f0a4d0ab.js",revision:"b1d0e3fd785dc51aacd7958dc6215200"},{url:"_next/static/chunks/6ef2ee5f9ec3f21942f7580787ecf0888aaa7677.f0b53fd959560d09a358.js",revision:"2233ebd540778c3078373aac20799fe0"},{url:"_next/static/chunks/7609fa34ca9b21ee0ddcbc920ed5c12439f6e324.772f35a82498f7b19b0c.js",revision:"db0b7b75ac415a3f18bc7cf5cd2da18c"},{url:"_next/static/chunks/87820a3456867b1d195b490e0334d947ed71ce1f.27b6dd0cac84e76a1525.js",revision:"38ac4b85749512fcd952d4294d46bcaa"},{url:"_next/static/chunks/8a3541f802e7cf3a8624d0fbd4ab0e4ad8327292.279a71f8064ff98b2e24.js",revision:"fae991e6f59594143496357e948ae535"},{url:"_next/static/chunks/8f59efa066d49331734914d1a70f92296be6ab5c.37a64f0817d0a2c04f98.js",revision:"d5d543845afc1e840affdda3a9a1fe43"},{url:"_next/static/chunks/a29ae703.42bd497555d899daf3d4.js",revision:"d9b24a664a7b32dc0e464367e545693e"},{url:"_next/static/chunks/b925dfaedb70a962bc9194c3a5903fc384e3e999.73905a6cabacf976282d.js",revision:"58817d0d9cdf7c70ab372444579fffea"},{url:"_next/static/chunks/b974af99b0322f0f7c85aeee31a48c550201885c.a19e18f911bef145edcd.js",revision:"b37357854dbf6eee92273728ea9f3031"},{url:"_next/static/chunks/be1225aa39102006fb20b392ab2ab8c376b76f73.bfcb66a4644c32b7da65.js",revision:"eccfb53d13f67c1904418be416a0278e"},{url:"_next/static/chunks/bfeb6e45cc5309c3804ea3292f25d66c7c749cc0.04e52eae15f25a31aa27.js",revision:"6ffe48eb42f4e05ae3db0f1f44b1a2ba"},{url:"_next/static/chunks/c2aabdef963979a2e141374a34125679c06004ee.475aa6618c25f93d0df1.js",revision:"9cec6a2de5bc67eb15ec4a5e9e4f2e5d"},{url:"_next/static/chunks/c96b4d7e.ff4871388b9ad0566c3b.js",revision:"e7b125b8347adb4ed17b666bc76685ff"},{url:"_next/static/chunks/commons.83e80f4083b08635baf3.js",revision:"0e5d791923c275a1a38825deece7cfc1"},{url:"_next/static/chunks/fc8d00fd.afd2d8f4015a50040cc7.js",revision:"034a5909526fbfd8b9f907ec8a52d5df"},{url:"_next/static/chunks/framework.ecbd939e3f22c21530d6.js",revision:"f1f44d4b846ef72b49ca7ba18b1f46ed"},{url:"_next/static/css/0b10e9f32b7d87c5b5ed.css",revision:"9b6bf2b0849057358aaaeb0dd19e37db"},{url:"_next/static/css/82cdff9d095f5d7a12bb.css",revision:"6b687fd5afb07213a49206ef2e8317af"},{url:"_next/static/runtime/main-35dd3106a90fb78b53d9.js",revision:"24ad9fc64cbd38bf999236031401fdba"},{url:"_next/static/runtime/polyfills-af445991d1bdd9ff562d.js",revision:"47029bf386dd05a69e8f30f6bcc63580"},{url:"_next/static/runtime/webpack-1c5199ff66550d26e499.js",revision:"029ee2e7063b1566925082c49e4afc45"}]),K(C),function(e,s,i){let c;if("string"==typeof e){const t=new URL(e,location.href);c=new n(({url:e})=>e.href===t.href,s,i)}else if(e instanceof RegExp)c=new a(e,s,i);else if("function"==typeof e)c=new n(e,s,i);else{if(!(e instanceof n))throw new t("unsupported-route-type",{moduleName:"workbox-routing",funcName:"registerRoute",paramName:"capture"});c=e}o().registerRoute(c)}(/^https?.*/,new class{constructor(e={}){if(this.m=d(e.cacheName),e.plugins){const t=e.plugins.some(e=>!!e.cacheWillUpdate);this.W=t?e.plugins:[E,...e.plugins]}else this.W=[E];this.M=e.networkTimeoutSeconds||0,this.T=e.fetchOptions,this.K=e.matchOptions}async handle({event:e,request:s}){const n=[];"string"==typeof s&&(s=new Request(s));const a=[];let i;if(this.M){const{id:t,promise:c}=this.P({request:s,event:e,logs:n});i=t,a.push(c)}const c=this.O({timeoutId:i,request:s,event:e,logs:n});a.push(c);let r=await Promise.race(a);if(r||(r=await c),!r)throw new t("no-response",{url:s.url});return r}P({request:e,logs:t,event:s}){let n;return{promise:new Promise(t=>{n=setTimeout(async()=>{t(await this.D({request:e,event:s}))},1e3*this.M)}),id:n}}async O({timeoutId:e,request:t,logs:s,event:n}){let a,i;try{i=await U({request:t,event:n,fetchOptions:this.T,plugins:this.W})}catch(e){a=e}if(e&&clearTimeout(e),a||!i)i=await this.D({request:t,event:n});else{const e=i.clone(),s=R({cacheName:this.m,request:t,response:e,event:n,plugins:this.W});if(n)try{n.waitUntil(s)}catch(e){}}return i}D({event:e,request:t}){return j({cacheName:this.m,request:t,event:e,matchOptions:this.K,plugins:this.W})}}({cacheName:"offlineCache",plugins:[new class{constructor(e={}){var t;this.cachedResponseWillBeUsed=async({event:e,request:t,cacheName:s,cachedResponse:n})=>{if(!n)return null;const a=this.G(n),i=this.C(s);l(i.expireEntries());const c=i.updateTimestamp(t.url);if(e)try{e.waitUntil(c)}catch(e){}return a?n:null},this.cacheDidUpdate=async({cacheName:e,request:t})=>{const s=this.C(e);await s.updateTimestamp(t.url),await s.expireEntries()},this.V=e,this.U=e.maxAgeSeconds,this.I=new Map,e.purgeOnQuotaError&&(t=()=>this.deleteCacheAndMetadata(),w.add(t))}C(e){if(e===d())throw new t("expire-custom-caches-only");let s=this.I.get(e);return s||(s=new m(e,this.V),this.I.set(e,s)),s}G(e){if(!this.U)return!0;const t=this.X(e);if(null===t)return!0;return t>=Date.now()-1e3*this.U}X(e){if(!e.headers.has("date"))return null;const t=e.headers.get("date"),s=new Date(t).getTime();return isNaN(s)?null:s}async deleteCacheAndMetadata(){for(const[e,t]of this.I)await self.caches.delete(e),await t.delete();this.I=new Map}}({maxEntries:200,purgeOnQuotaError:!0})]}),"GET");
//# sourceMappingURL=service-worker.js.map
