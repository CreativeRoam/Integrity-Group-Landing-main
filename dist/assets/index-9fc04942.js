var Jo=Object.defineProperty;var el=(t,e,n)=>e in t?Jo(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var oe=(t,e,n)=>(el(t,typeof e!="symbol"?e+"":e,n),n);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function n(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=n(r);fetch(r.href,s)}})();function xr(t,e){const n=Object.create(null),i=t.split(",");for(let r=0;r<i.length;r++)n[i[r]]=!0;return e?r=>!!n[r.toLowerCase()]:r=>!!n[r]}const he={},It=[],We=()=>{},tl=()=>!1,nl=/^on[^a-z]/,ti=t=>nl.test(t),_r=t=>t.startsWith("onUpdate:"),_e=Object.assign,yr=(t,e)=>{const n=t.indexOf(e);n>-1&&t.splice(n,1)},il=Object.prototype.hasOwnProperty,ee=(t,e)=>il.call(t,e),X=Array.isArray,sn=t=>ni(t)==="[object Map]",rl=t=>ni(t)==="[object Set]",Y=t=>typeof t=="function",we=t=>typeof t=="string",wr=t=>typeof t=="symbol",pe=t=>t!==null&&typeof t=="object",Na=t=>pe(t)&&Y(t.then)&&Y(t.catch),sl=Object.prototype.toString,ni=t=>sl.call(t),al=t=>ni(t).slice(8,-1),ol=t=>ni(t)==="[object Object]",Er=t=>we(t)&&t!=="NaN"&&t[0]!=="-"&&""+parseInt(t,10)===t,$n=xr(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"),ii=t=>{const e=Object.create(null);return n=>e[n]||(e[n]=t(n))},ll=/-(\w)/g,Je=ii(t=>t.replace(ll,(e,n)=>n?n.toUpperCase():"")),cl=/\B([A-Z])/g,Ht=ii(t=>t.replace(cl,"-$1").toLowerCase()),ri=ii(t=>t.charAt(0).toUpperCase()+t.slice(1)),xi=ii(t=>t?`on${ri(t)}`:""),gn=(t,e)=>!Object.is(t,e),_i=(t,e)=>{for(let n=0;n<t.length;n++)t[n](e)},Zn=(t,e,n)=>{Object.defineProperty(t,e,{configurable:!0,enumerable:!1,value:n})},hl=t=>{const e=parseFloat(t);return isNaN(e)?t:e};let ns;const Yi=()=>ns||(ns=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{});function Ar(t){if(X(t)){const e={};for(let n=0;n<t.length;n++){const i=t[n],r=we(i)?pl(i):Ar(i);if(r)for(const s in r)e[s]=r[s]}return e}else{if(we(t))return t;if(pe(t))return t}}const ul=/;(?![^(]*\))/g,fl=/:([^]+)/,dl=/\/\*[^]*?\*\//g;function pl(t){const e={};return t.replace(dl,"").split(ul).forEach(n=>{if(n){const i=n.split(fl);i.length>1&&(e[i[0].trim()]=i[1].trim())}}),e}function si(t){let e="";if(we(t))e=t;else if(X(t))for(let n=0;n<t.length;n++){const i=si(t[n]);i&&(e+=i+" ")}else if(pe(t))for(const n in t)t[n]&&(e+=n+" ");return e.trim()}const gl="itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly",ml=xr(gl);function ka(t){return!!t||t===""}let Be;class vl{constructor(e=!1){this.detached=e,this._active=!0,this.effects=[],this.cleanups=[],this.parent=Be,!e&&Be&&(this.index=(Be.scopes||(Be.scopes=[])).push(this)-1)}get active(){return this._active}run(e){if(this._active){const n=Be;try{return Be=this,e()}finally{Be=n}}}on(){Be=this}off(){Be=this.parent}stop(e){if(this._active){let n,i;for(n=0,i=this.effects.length;n<i;n++)this.effects[n].stop();for(n=0,i=this.cleanups.length;n<i;n++)this.cleanups[n]();if(this.scopes)for(n=0,i=this.scopes.length;n<i;n++)this.scopes[n].stop(!0);if(!this.detached&&this.parent&&!e){const r=this.parent.scopes.pop();r&&r!==this&&(this.parent.scopes[this.index]=r,r.index=this.index)}this.parent=void 0,this._active=!1}}}function bl(t,e=Be){e&&e.active&&e.effects.push(t)}function xl(){return Be}const Mr=t=>{const e=new Set(t);return e.w=0,e.n=0,e},$a=t=>(t.w&bt)>0,Wa=t=>(t.n&bt)>0,_l=({deps:t})=>{if(t.length)for(let e=0;e<t.length;e++)t[e].w|=bt},yl=t=>{const{deps:e}=t;if(e.length){let n=0;for(let i=0;i<e.length;i++){const r=e[i];$a(r)&&!Wa(r)?r.delete(t):e[n++]=r,r.w&=~bt,r.n&=~bt}e.length=n}},Ki=new WeakMap;let tn=0,bt=1;const Qi=30;let Ne;const At=Symbol(""),Ji=Symbol("");class Pr{constructor(e,n=null,i){this.fn=e,this.scheduler=n,this.active=!0,this.deps=[],this.parent=void 0,bl(this,i)}run(){if(!this.active)return this.fn();let e=Ne,n=pt;for(;e;){if(e===this)return;e=e.parent}try{return this.parent=Ne,Ne=this,pt=!0,bt=1<<++tn,tn<=Qi?_l(this):is(this),this.fn()}finally{tn<=Qi&&yl(this),bt=1<<--tn,Ne=this.parent,pt=n,this.parent=void 0,this.deferStop&&this.stop()}}stop(){Ne===this?this.deferStop=!0:this.active&&(is(this),this.onStop&&this.onStop(),this.active=!1)}}function is(t){const{deps:e}=t;if(e.length){for(let n=0;n<e.length;n++)e[n].delete(t);e.length=0}}let pt=!0;const ja=[];function Gt(){ja.push(pt),pt=!1}function Zt(){const t=ja.pop();pt=t===void 0?!0:t}function Ce(t,e,n){if(pt&&Ne){let i=Ki.get(t);i||Ki.set(t,i=new Map);let r=i.get(n);r||i.set(n,r=Mr()),Va(r)}}function Va(t,e){let n=!1;tn<=Qi?Wa(t)||(t.n|=bt,n=!$a(t)):n=!t.has(Ne),n&&(t.add(Ne),Ne.deps.push(t))}function st(t,e,n,i,r,s){const a=Ki.get(t);if(!a)return;let o=[];if(e==="clear")o=[...a.values()];else if(n==="length"&&X(t)){const l=Number(i);a.forEach((h,c)=>{(c==="length"||c>=l)&&o.push(h)})}else switch(n!==void 0&&o.push(a.get(n)),e){case"add":X(t)?Er(n)&&o.push(a.get("length")):(o.push(a.get(At)),sn(t)&&o.push(a.get(Ji)));break;case"delete":X(t)||(o.push(a.get(At)),sn(t)&&o.push(a.get(Ji)));break;case"set":sn(t)&&o.push(a.get(At));break}if(o.length===1)o[0]&&er(o[0]);else{const l=[];for(const h of o)h&&l.push(...h);er(Mr(l))}}function er(t,e){const n=X(t)?t:[...t];for(const i of n)i.computed&&rs(i);for(const i of n)i.computed||rs(i)}function rs(t,e){(t!==Ne||t.allowRecurse)&&(t.scheduler?t.scheduler():t.run())}const wl=xr("__proto__,__v_isRef,__isVue"),Ha=new Set(Object.getOwnPropertyNames(Symbol).filter(t=>t!=="arguments"&&t!=="caller").map(t=>Symbol[t]).filter(wr)),El=Tr(),Al=Tr(!1,!0),Ml=Tr(!0),ss=Pl();function Pl(){const t={};return["includes","indexOf","lastIndexOf"].forEach(e=>{t[e]=function(...n){const i=ie(this);for(let s=0,a=this.length;s<a;s++)Ce(i,"get",s+"");const r=i[e](...n);return r===-1||r===!1?i[e](...n.map(ie)):r}}),["push","pop","shift","unshift","splice"].forEach(e=>{t[e]=function(...n){Gt();const i=ie(this)[e].apply(this,n);return Zt(),i}}),t}function Tl(t){const e=ie(this);return Ce(e,"has",t),e.hasOwnProperty(t)}function Tr(t=!1,e=!1){return function(i,r,s){if(r==="__v_isReactive")return!t;if(r==="__v_isReadonly")return t;if(r==="__v_isShallow")return e;if(r==="__v_raw"&&s===(t?e?jl:Ya:e?Xa:qa).get(i))return i;const a=X(i);if(!t){if(a&&ee(ss,r))return Reflect.get(ss,r,s);if(r==="hasOwnProperty")return Tl}const o=Reflect.get(i,r,s);return(wr(r)?Ha.has(r):wl(r))||(t||Ce(i,"get",r),e)?o:Ae(o)?a&&Er(r)?o:o.value:pe(o)?t?Qa(o):oi(o):o}}const Sl=Ga(),Cl=Ga(!0);function Ga(t=!1){return function(n,i,r,s){let a=n[i];if(zt(a)&&Ae(a)&&!Ae(r))return!1;if(!t&&(!qn(r)&&!zt(r)&&(a=ie(a),r=ie(r)),!X(n)&&Ae(a)&&!Ae(r)))return a.value=r,!0;const o=X(n)&&Er(i)?Number(i)<n.length:ee(n,i),l=Reflect.set(n,i,r,s);return n===ie(s)&&(o?gn(r,a)&&st(n,"set",i,r):st(n,"add",i,r)),l}}function Rl(t,e){const n=ee(t,e);t[e];const i=Reflect.deleteProperty(t,e);return i&&n&&st(t,"delete",e,void 0),i}function Ol(t,e){const n=Reflect.has(t,e);return(!wr(e)||!Ha.has(e))&&Ce(t,"has",e),n}function Fl(t){return Ce(t,"iterate",X(t)?"length":At),Reflect.ownKeys(t)}const Za={get:El,set:Sl,deleteProperty:Rl,has:Ol,ownKeys:Fl},Ll={get:Ml,set(t,e){return!0},deleteProperty(t,e){return!0}},Il=_e({},Za,{get:Al,set:Cl}),Sr=t=>t,ai=t=>Reflect.getPrototypeOf(t);function Cn(t,e,n=!1,i=!1){t=t.__v_raw;const r=ie(t),s=ie(e);n||(e!==s&&Ce(r,"get",e),Ce(r,"get",s));const{has:a}=ai(r),o=i?Sr:n?Or:mn;if(a.call(r,e))return o(t.get(e));if(a.call(r,s))return o(t.get(s));t!==r&&t.get(e)}function Rn(t,e=!1){const n=this.__v_raw,i=ie(n),r=ie(t);return e||(t!==r&&Ce(i,"has",t),Ce(i,"has",r)),t===r?n.has(t):n.has(t)||n.has(r)}function On(t,e=!1){return t=t.__v_raw,!e&&Ce(ie(t),"iterate",At),Reflect.get(t,"size",t)}function as(t){t=ie(t);const e=ie(this);return ai(e).has.call(e,t)||(e.add(t),st(e,"add",t,t)),this}function os(t,e){e=ie(e);const n=ie(this),{has:i,get:r}=ai(n);let s=i.call(n,t);s||(t=ie(t),s=i.call(n,t));const a=r.call(n,t);return n.set(t,e),s?gn(e,a)&&st(n,"set",t,e):st(n,"add",t,e),this}function ls(t){const e=ie(this),{has:n,get:i}=ai(e);let r=n.call(e,t);r||(t=ie(t),r=n.call(e,t)),i&&i.call(e,t);const s=e.delete(t);return r&&st(e,"delete",t,void 0),s}function cs(){const t=ie(this),e=t.size!==0,n=t.clear();return e&&st(t,"clear",void 0,void 0),n}function Fn(t,e){return function(i,r){const s=this,a=s.__v_raw,o=ie(a),l=e?Sr:t?Or:mn;return!t&&Ce(o,"iterate",At),a.forEach((h,c)=>i.call(r,l(h),l(c),s))}}function Ln(t,e,n){return function(...i){const r=this.__v_raw,s=ie(r),a=sn(s),o=t==="entries"||t===Symbol.iterator&&a,l=t==="keys"&&a,h=r[t](...i),c=n?Sr:e?Or:mn;return!e&&Ce(s,"iterate",l?Ji:At),{next(){const{value:u,done:f}=h.next();return f?{value:u,done:f}:{value:o?[c(u[0]),c(u[1])]:c(u),done:f}},[Symbol.iterator](){return this}}}}function lt(t){return function(...e){return t==="delete"?!1:this}}function Dl(){const t={get(s){return Cn(this,s)},get size(){return On(this)},has:Rn,add:as,set:os,delete:ls,clear:cs,forEach:Fn(!1,!1)},e={get(s){return Cn(this,s,!1,!0)},get size(){return On(this)},has:Rn,add:as,set:os,delete:ls,clear:cs,forEach:Fn(!1,!0)},n={get(s){return Cn(this,s,!0)},get size(){return On(this,!0)},has(s){return Rn.call(this,s,!0)},add:lt("add"),set:lt("set"),delete:lt("delete"),clear:lt("clear"),forEach:Fn(!0,!1)},i={get(s){return Cn(this,s,!0,!0)},get size(){return On(this,!0)},has(s){return Rn.call(this,s,!0)},add:lt("add"),set:lt("set"),delete:lt("delete"),clear:lt("clear"),forEach:Fn(!0,!0)};return["keys","values","entries",Symbol.iterator].forEach(s=>{t[s]=Ln(s,!1,!1),n[s]=Ln(s,!0,!1),e[s]=Ln(s,!1,!0),i[s]=Ln(s,!0,!0)}),[t,n,e,i]}const[Ul,Bl,zl,Nl]=Dl();function Cr(t,e){const n=e?t?Nl:zl:t?Bl:Ul;return(i,r,s)=>r==="__v_isReactive"?!t:r==="__v_isReadonly"?t:r==="__v_raw"?i:Reflect.get(ee(n,r)&&r in i?n:i,r,s)}const kl={get:Cr(!1,!1)},$l={get:Cr(!1,!0)},Wl={get:Cr(!0,!1)},qa=new WeakMap,Xa=new WeakMap,Ya=new WeakMap,jl=new WeakMap;function Vl(t){switch(t){case"Object":case"Array":return 1;case"Map":case"Set":case"WeakMap":case"WeakSet":return 2;default:return 0}}function Hl(t){return t.__v_skip||!Object.isExtensible(t)?0:Vl(al(t))}function oi(t){return zt(t)?t:Rr(t,!1,Za,kl,qa)}function Ka(t){return Rr(t,!1,Il,$l,Xa)}function Qa(t){return Rr(t,!0,Ll,Wl,Ya)}function Rr(t,e,n,i,r){if(!pe(t)||t.__v_raw&&!(e&&t.__v_isReactive))return t;const s=r.get(t);if(s)return s;const a=Hl(t);if(a===0)return t;const o=new Proxy(t,a===2?i:n);return r.set(t,o),o}function Dt(t){return zt(t)?Dt(t.__v_raw):!!(t&&t.__v_isReactive)}function zt(t){return!!(t&&t.__v_isReadonly)}function qn(t){return!!(t&&t.__v_isShallow)}function Ja(t){return Dt(t)||zt(t)}function ie(t){const e=t&&t.__v_raw;return e?ie(e):t}function eo(t){return Zn(t,"__v_skip",!0),t}const mn=t=>pe(t)?oi(t):t,Or=t=>pe(t)?Qa(t):t;function to(t){pt&&Ne&&(t=ie(t),Va(t.dep||(t.dep=Mr())))}function no(t,e){t=ie(t);const n=t.dep;n&&er(n)}function Ae(t){return!!(t&&t.__v_isRef===!0)}function an(t){return io(t,!1)}function Gl(t){return io(t,!0)}function io(t,e){return Ae(t)?t:new Zl(t,e)}class Zl{constructor(e,n){this.__v_isShallow=n,this.dep=void 0,this.__v_isRef=!0,this._rawValue=n?e:ie(e),this._value=n?e:mn(e)}get value(){return to(this),this._value}set value(e){const n=this.__v_isShallow||qn(e)||zt(e);e=n?e:ie(e),gn(e,this._rawValue)&&(this._rawValue=e,this._value=n?e:mn(e),no(this))}}function Ut(t){return Ae(t)?t.value:t}const ql={get:(t,e,n)=>Ut(Reflect.get(t,e,n)),set:(t,e,n,i)=>{const r=t[e];return Ae(r)&&!Ae(n)?(r.value=n,!0):Reflect.set(t,e,n,i)}};function ro(t){return Dt(t)?t:new Proxy(t,ql)}class Xl{constructor(e,n,i,r){this._setter=n,this.dep=void 0,this.__v_isRef=!0,this.__v_isReadonly=!1,this._dirty=!0,this.effect=new Pr(e,()=>{this._dirty||(this._dirty=!0,no(this))}),this.effect.computed=this,this.effect.active=this._cacheable=!r,this.__v_isReadonly=i}get value(){const e=ie(this);return to(e),(e._dirty||!e._cacheable)&&(e._dirty=!1,e._value=e.effect.run()),e._value}set value(e){this._setter(e)}}function Yl(t,e,n=!1){let i,r;const s=Y(t);return s?(i=t,r=We):(i=t.get,r=t.set),new Xl(i,r,s||!r,n)}function gt(t,e,n,i){let r;try{r=i?t(...i):t()}catch(s){li(s,e,n)}return r}function je(t,e,n,i){if(Y(t)){const s=gt(t,e,n,i);return s&&Na(s)&&s.catch(a=>{li(a,e,n)}),s}const r=[];for(let s=0;s<t.length;s++)r.push(je(t[s],e,n,i));return r}function li(t,e,n,i=!0){const r=e?e.vnode:null;if(e){let s=e.parent;const a=e.proxy,o=n;for(;s;){const h=s.ec;if(h){for(let c=0;c<h.length;c++)if(h[c](t,a,o)===!1)return}s=s.parent}const l=e.appContext.config.errorHandler;if(l){gt(l,null,10,[t,a,o]);return}}Kl(t,n,r,i)}function Kl(t,e,n,i=!0){console.error(t)}let vn=!1,tr=!1;const Ee=[];let Qe=0;const Bt=[];let tt=null,yt=0;const so=Promise.resolve();let Fr=null;function ao(t){const e=Fr||so;return t?e.then(this?t.bind(this):t):e}function Ql(t){let e=Qe+1,n=Ee.length;for(;e<n;){const i=e+n>>>1;bn(Ee[i])<t?e=i+1:n=i}return e}function Lr(t){(!Ee.length||!Ee.includes(t,vn&&t.allowRecurse?Qe+1:Qe))&&(t.id==null?Ee.push(t):Ee.splice(Ql(t.id),0,t),oo())}function oo(){!vn&&!tr&&(tr=!0,Fr=so.then(co))}function Jl(t){const e=Ee.indexOf(t);e>Qe&&Ee.splice(e,1)}function ec(t){X(t)?Bt.push(...t):(!tt||!tt.includes(t,t.allowRecurse?yt+1:yt))&&Bt.push(t),oo()}function hs(t,e=vn?Qe+1:0){for(;e<Ee.length;e++){const n=Ee[e];n&&n.pre&&(Ee.splice(e,1),e--,n())}}function lo(t){if(Bt.length){const e=[...new Set(Bt)];if(Bt.length=0,tt){tt.push(...e);return}for(tt=e,tt.sort((n,i)=>bn(n)-bn(i)),yt=0;yt<tt.length;yt++)tt[yt]();tt=null,yt=0}}const bn=t=>t.id==null?1/0:t.id,tc=(t,e)=>{const n=bn(t)-bn(e);if(n===0){if(t.pre&&!e.pre)return-1;if(e.pre&&!t.pre)return 1}return n};function co(t){tr=!1,vn=!0,Ee.sort(tc);const e=We;try{for(Qe=0;Qe<Ee.length;Qe++){const n=Ee[Qe];n&&n.active!==!1&&gt(n,null,14)}}finally{Qe=0,Ee.length=0,lo(),vn=!1,Fr=null,(Ee.length||Bt.length)&&co()}}function nc(t,e,...n){if(t.isUnmounted)return;const i=t.vnode.props||he;let r=n;const s=e.startsWith("update:"),a=s&&e.slice(7);if(a&&a in i){const c=`${a==="modelValue"?"model":a}Modifiers`,{number:u,trim:f}=i[c]||he;f&&(r=n.map(d=>we(d)?d.trim():d)),u&&(r=n.map(hl))}let o,l=i[o=xi(e)]||i[o=xi(Je(e))];!l&&s&&(l=i[o=xi(Ht(e))]),l&&je(l,t,6,r);const h=i[o+"Once"];if(h){if(!t.emitted)t.emitted={};else if(t.emitted[o])return;t.emitted[o]=!0,je(h,t,6,r)}}function ho(t,e,n=!1){const i=e.emitsCache,r=i.get(t);if(r!==void 0)return r;const s=t.emits;let a={},o=!1;if(!Y(t)){const l=h=>{const c=ho(h,e,!0);c&&(o=!0,_e(a,c))};!n&&e.mixins.length&&e.mixins.forEach(l),t.extends&&l(t.extends),t.mixins&&t.mixins.forEach(l)}return!s&&!o?(pe(t)&&i.set(t,null),null):(X(s)?s.forEach(l=>a[l]=null):_e(a,s),pe(t)&&i.set(t,a),a)}function ci(t,e){return!t||!ti(e)?!1:(e=e.slice(2).replace(/Once$/,""),ee(t,e[0].toLowerCase()+e.slice(1))||ee(t,Ht(e))||ee(t,e))}let Ie=null,uo=null;function Xn(t){const e=Ie;return Ie=t,uo=t&&t.type.__scopeId||null,e}function ic(t,e=Ie,n){if(!e||t._n)return t;const i=(...r)=>{i._d&&ys(-1);const s=Xn(e);let a;try{a=t(...r)}finally{Xn(s),i._d&&ys(1)}return a};return i._n=!0,i._c=!0,i._d=!0,i}function yi(t){const{type:e,vnode:n,proxy:i,withProxy:r,props:s,propsOptions:[a],slots:o,attrs:l,emit:h,render:c,renderCache:u,data:f,setupState:d,ctx:p,inheritAttrs:m}=t;let x,_;const P=Xn(t);try{if(n.shapeFlag&4){const b=r||i;x=Ke(c.call(b,b,u,s,d,f,p)),_=l}else{const b=e;x=Ke(b.length>1?b(s,{attrs:l,slots:o,emit:h}):b(s,null)),_=e.props?l:rc(l)}}catch(b){cn.length=0,li(b,t,1),x=ve(xn)}let w=x;if(_&&m!==!1){const b=Object.keys(_),{shapeFlag:M}=w;b.length&&M&7&&(a&&b.some(_r)&&(_=sc(_,a)),w=Nt(w,_))}return n.dirs&&(w=Nt(w),w.dirs=w.dirs?w.dirs.concat(n.dirs):n.dirs),n.transition&&(w.transition=n.transition),x=w,Xn(P),x}const rc=t=>{let e;for(const n in t)(n==="class"||n==="style"||ti(n))&&((e||(e={}))[n]=t[n]);return e},sc=(t,e)=>{const n={};for(const i in t)(!_r(i)||!(i.slice(9)in e))&&(n[i]=t[i]);return n};function ac(t,e,n){const{props:i,children:r,component:s}=t,{props:a,children:o,patchFlag:l}=e,h=s.emitsOptions;if(e.dirs||e.transition)return!0;if(n&&l>=0){if(l&1024)return!0;if(l&16)return i?us(i,a,h):!!a;if(l&8){const c=e.dynamicProps;for(let u=0;u<c.length;u++){const f=c[u];if(a[f]!==i[f]&&!ci(h,f))return!0}}}else return(r||o)&&(!o||!o.$stable)?!0:i===a?!1:i?a?us(i,a,h):!0:!!a;return!1}function us(t,e,n){const i=Object.keys(e);if(i.length!==Object.keys(t).length)return!0;for(let r=0;r<i.length;r++){const s=i[r];if(e[s]!==t[s]&&!ci(n,s))return!0}return!1}function oc({vnode:t,parent:e},n){for(;e&&e.subTree===t;)(t=e.vnode).el=n,e=e.parent}const lc=t=>t.__isSuspense;function cc(t,e){e&&e.pendingBranch?X(t)?e.effects.push(...t):e.effects.push(t):ec(t)}function hc(t,e){return Ir(t,null,{flush:"post"})}const In={};function Wn(t,e,n){return Ir(t,e,n)}function Ir(t,e,{immediate:n,deep:i,flush:r,onTrack:s,onTrigger:a}=he){var o;const l=xl()===((o=xe)==null?void 0:o.scope)?xe:null;let h,c=!1,u=!1;if(Ae(t)?(h=()=>t.value,c=qn(t)):Dt(t)?(h=()=>t,i=!0):X(t)?(u=!0,c=t.some(b=>Dt(b)||qn(b)),h=()=>t.map(b=>{if(Ae(b))return b.value;if(Dt(b))return Lt(b);if(Y(b))return gt(b,l,2)})):Y(t)?e?h=()=>gt(t,l,2):h=()=>{if(!(l&&l.isUnmounted))return f&&f(),je(t,l,3,[d])}:h=We,e&&i){const b=h;h=()=>Lt(b())}let f,d=b=>{f=P.onStop=()=>{gt(b,l,4)}},p;if(yn)if(d=We,e?n&&je(e,l,3,[h(),u?[]:void 0,d]):h(),r==="sync"){const b=sh();p=b.__watcherHandles||(b.__watcherHandles=[])}else return We;let m=u?new Array(t.length).fill(In):In;const x=()=>{if(P.active)if(e){const b=P.run();(i||c||(u?b.some((M,C)=>gn(M,m[C])):gn(b,m)))&&(f&&f(),je(e,l,3,[b,m===In?void 0:u&&m[0]===In?[]:m,d]),m=b)}else P.run()};x.allowRecurse=!!e;let _;r==="sync"?_=x:r==="post"?_=()=>Te(x,l&&l.suspense):(x.pre=!0,l&&(x.id=l.uid),_=()=>Lr(x));const P=new Pr(h,_);e?n?x():m=P.run():r==="post"?Te(P.run.bind(P),l&&l.suspense):P.run();const w=()=>{P.stop(),l&&l.scope&&yr(l.scope.effects,P)};return p&&p.push(w),w}function uc(t,e,n){const i=this.proxy,r=we(t)?t.includes(".")?fo(i,t):()=>i[t]:t.bind(i,i);let s;Y(e)?s=e:(s=e.handler,n=e);const a=xe;kt(this);const o=Ir(r,s.bind(i),n);return a?kt(a):Mt(),o}function fo(t,e){const n=e.split(".");return()=>{let i=t;for(let r=0;r<n.length&&i;r++)i=i[n[r]];return i}}function Lt(t,e){if(!pe(t)||t.__v_skip||(e=e||new Set,e.has(t)))return t;if(e.add(t),Ae(t))Lt(t.value,e);else if(X(t))for(let n=0;n<t.length;n++)Lt(t[n],e);else if(rl(t)||sn(t))t.forEach(n=>{Lt(n,e)});else if(ol(t))for(const n in t)Lt(t[n],e);return t}function xt(t,e,n,i){const r=t.dirs,s=e&&e.dirs;for(let a=0;a<r.length;a++){const o=r[a];s&&(o.oldValue=s[a].value);let l=o.dir[i];l&&(Gt(),je(l,n,8,[t.el,o,t,e]),Zt())}}function po(t,e){return Y(t)?(()=>_e({name:t.name},e,{setup:t}))():t}const jn=t=>!!t.type.__asyncLoader,go=t=>t.type.__isKeepAlive;function fc(t,e){mo(t,"a",e)}function dc(t,e){mo(t,"da",e)}function mo(t,e,n=xe){const i=t.__wdc||(t.__wdc=()=>{let r=n;for(;r;){if(r.isDeactivated)return;r=r.parent}return t()});if(hi(e,i,n),n){let r=n.parent;for(;r&&r.parent;)go(r.parent.vnode)&&pc(i,e,n,r),r=r.parent}}function pc(t,e,n,i){const r=hi(e,t,i,!0);Ur(()=>{yr(i[e],r)},n)}function hi(t,e,n=xe,i=!1){if(n){const r=n[t]||(n[t]=[]),s=e.__weh||(e.__weh=(...a)=>{if(n.isUnmounted)return;Gt(),kt(n);const o=je(e,n,t,a);return Mt(),Zt(),o});return i?r.unshift(s):r.push(s),s}}const ot=t=>(e,n=xe)=>(!yn||t==="sp")&&hi(t,(...i)=>e(...i),n),gc=ot("bm"),Dr=ot("m"),mc=ot("bu"),vc=ot("u"),bc=ot("bum"),Ur=ot("um"),xc=ot("sp"),_c=ot("rtg"),yc=ot("rtc");function wc(t,e=xe){hi("ec",t,e)}const vo="components";function Tt(t,e){return Ac(vo,t,!0,e)||t}const Ec=Symbol.for("v-ndc");function Ac(t,e,n=!0,i=!1){const r=Ie||xe;if(r){const s=r.type;if(t===vo){const o=nh(s,!1);if(o&&(o===e||o===Je(e)||o===ri(Je(e))))return s}const a=fs(r[t]||s[t],e)||fs(r.appContext[t],e);return!a&&i?s:a}}function fs(t,e){return t&&(t[e]||t[Je(e)]||t[ri(Je(e))])}const nr=t=>t?So(t)?$r(t)||t.proxy:nr(t.parent):null,on=_e(Object.create(null),{$:t=>t,$el:t=>t.vnode.el,$data:t=>t.data,$props:t=>t.props,$attrs:t=>t.attrs,$slots:t=>t.slots,$refs:t=>t.refs,$parent:t=>nr(t.parent),$root:t=>nr(t.root),$emit:t=>t.emit,$options:t=>Br(t),$forceUpdate:t=>t.f||(t.f=()=>Lr(t.update)),$nextTick:t=>t.n||(t.n=ao.bind(t.proxy)),$watch:t=>uc.bind(t)}),wi=(t,e)=>t!==he&&!t.__isScriptSetup&&ee(t,e),Mc={get({_:t},e){const{ctx:n,setupState:i,data:r,props:s,accessCache:a,type:o,appContext:l}=t;let h;if(e[0]!=="$"){const d=a[e];if(d!==void 0)switch(d){case 1:return i[e];case 2:return r[e];case 4:return n[e];case 3:return s[e]}else{if(wi(i,e))return a[e]=1,i[e];if(r!==he&&ee(r,e))return a[e]=2,r[e];if((h=t.propsOptions[0])&&ee(h,e))return a[e]=3,s[e];if(n!==he&&ee(n,e))return a[e]=4,n[e];ir&&(a[e]=0)}}const c=on[e];let u,f;if(c)return e==="$attrs"&&Ce(t,"get",e),c(t);if((u=o.__cssModules)&&(u=u[e]))return u;if(n!==he&&ee(n,e))return a[e]=4,n[e];if(f=l.config.globalProperties,ee(f,e))return f[e]},set({_:t},e,n){const{data:i,setupState:r,ctx:s}=t;return wi(r,e)?(r[e]=n,!0):i!==he&&ee(i,e)?(i[e]=n,!0):ee(t.props,e)||e[0]==="$"&&e.slice(1)in t?!1:(s[e]=n,!0)},has({_:{data:t,setupState:e,accessCache:n,ctx:i,appContext:r,propsOptions:s}},a){let o;return!!n[a]||t!==he&&ee(t,a)||wi(e,a)||(o=s[0])&&ee(o,a)||ee(i,a)||ee(on,a)||ee(r.config.globalProperties,a)},defineProperty(t,e,n){return n.get!=null?t._.accessCache[e]=0:ee(n,"value")&&this.set(t,e,n.value,null),Reflect.defineProperty(t,e,n)}};function ds(t){return X(t)?t.reduce((e,n)=>(e[n]=null,e),{}):t}let ir=!0;function Pc(t){const e=Br(t),n=t.proxy,i=t.ctx;ir=!1,e.beforeCreate&&ps(e.beforeCreate,t,"bc");const{data:r,computed:s,methods:a,watch:o,provide:l,inject:h,created:c,beforeMount:u,mounted:f,beforeUpdate:d,updated:p,activated:m,deactivated:x,beforeDestroy:_,beforeUnmount:P,destroyed:w,unmounted:b,render:M,renderTracked:C,renderTriggered:Z,errorCaptured:te,serverPrefetch:re,expose:Q,inheritAttrs:ne,components:G,directives:A,filters:I}=e;if(h&&Tc(h,i,null),a)for(const z in a){const j=a[z];Y(j)&&(i[z]=j.bind(n))}if(r){const z=r.call(n,n);pe(z)&&(t.data=oi(z))}if(ir=!0,s)for(const z in s){const j=s[z],le=Y(j)?j.bind(n,n):Y(j.get)?j.get.bind(n,n):We,ye=!Y(j)&&Y(j.set)?j.set.bind(n):We,fe=ke({get:le,set:ye});Object.defineProperty(i,z,{enumerable:!0,configurable:!0,get:()=>fe.value,set:de=>fe.value=de})}if(o)for(const z in o)bo(o[z],i,n,z);if(l){const z=Y(l)?l.call(n):l;Reflect.ownKeys(z).forEach(j=>{Vn(j,z[j])})}c&&ps(c,t,"c");function R(z,j){X(j)?j.forEach(le=>z(le.bind(n))):j&&z(j.bind(n))}if(R(gc,u),R(Dr,f),R(mc,d),R(vc,p),R(fc,m),R(dc,x),R(wc,te),R(yc,C),R(_c,Z),R(bc,P),R(Ur,b),R(xc,re),X(Q))if(Q.length){const z=t.exposed||(t.exposed={});Q.forEach(j=>{Object.defineProperty(z,j,{get:()=>n[j],set:le=>n[j]=le})})}else t.exposed||(t.exposed={});M&&t.render===We&&(t.render=M),ne!=null&&(t.inheritAttrs=ne),G&&(t.components=G),A&&(t.directives=A)}function Tc(t,e,n=We){X(t)&&(t=rr(t));for(const i in t){const r=t[i];let s;pe(r)?"default"in r?s=Ve(r.from||i,r.default,!0):s=Ve(r.from||i):s=Ve(r),Ae(s)?Object.defineProperty(e,i,{enumerable:!0,configurable:!0,get:()=>s.value,set:a=>s.value=a}):e[i]=s}}function ps(t,e,n){je(X(t)?t.map(i=>i.bind(e.proxy)):t.bind(e.proxy),e,n)}function bo(t,e,n,i){const r=i.includes(".")?fo(n,i):()=>n[i];if(we(t)){const s=e[t];Y(s)&&Wn(r,s)}else if(Y(t))Wn(r,t.bind(n));else if(pe(t))if(X(t))t.forEach(s=>bo(s,e,n,i));else{const s=Y(t.handler)?t.handler.bind(n):e[t.handler];Y(s)&&Wn(r,s,t)}}function Br(t){const e=t.type,{mixins:n,extends:i}=e,{mixins:r,optionsCache:s,config:{optionMergeStrategies:a}}=t.appContext,o=s.get(e);let l;return o?l=o:!r.length&&!n&&!i?l=e:(l={},r.length&&r.forEach(h=>Yn(l,h,a,!0)),Yn(l,e,a)),pe(e)&&s.set(e,l),l}function Yn(t,e,n,i=!1){const{mixins:r,extends:s}=e;s&&Yn(t,s,n,!0),r&&r.forEach(a=>Yn(t,a,n,!0));for(const a in e)if(!(i&&a==="expose")){const o=Sc[a]||n&&n[a];t[a]=o?o(t[a],e[a]):e[a]}return t}const Sc={data:gs,props:ms,emits:ms,methods:nn,computed:nn,beforeCreate:Me,created:Me,beforeMount:Me,mounted:Me,beforeUpdate:Me,updated:Me,beforeDestroy:Me,beforeUnmount:Me,destroyed:Me,unmounted:Me,activated:Me,deactivated:Me,errorCaptured:Me,serverPrefetch:Me,components:nn,directives:nn,watch:Rc,provide:gs,inject:Cc};function gs(t,e){return e?t?function(){return _e(Y(t)?t.call(this,this):t,Y(e)?e.call(this,this):e)}:e:t}function Cc(t,e){return nn(rr(t),rr(e))}function rr(t){if(X(t)){const e={};for(let n=0;n<t.length;n++)e[t[n]]=t[n];return e}return t}function Me(t,e){return t?[...new Set([].concat(t,e))]:e}function nn(t,e){return t?_e(Object.create(null),t,e):e}function ms(t,e){return t?X(t)&&X(e)?[...new Set([...t,...e])]:_e(Object.create(null),ds(t),ds(e??{})):e}function Rc(t,e){if(!t)return e;if(!e)return t;const n=_e(Object.create(null),t);for(const i in e)n[i]=Me(t[i],e[i]);return n}function xo(){return{app:null,config:{isNativeTag:tl,performance:!1,globalProperties:{},optionMergeStrategies:{},errorHandler:void 0,warnHandler:void 0,compilerOptions:{}},mixins:[],components:{},directives:{},provides:Object.create(null),optionsCache:new WeakMap,propsCache:new WeakMap,emitsCache:new WeakMap}}let Oc=0;function Fc(t,e){return function(i,r=null){Y(i)||(i=_e({},i)),r!=null&&!pe(r)&&(r=null);const s=xo(),a=new Set;let o=!1;const l=s.app={_uid:Oc++,_component:i,_props:r,_container:null,_context:s,_instance:null,version:ah,get config(){return s.config},set config(h){},use(h,...c){return a.has(h)||(h&&Y(h.install)?(a.add(h),h.install(l,...c)):Y(h)&&(a.add(h),h(l,...c))),l},mixin(h){return s.mixins.includes(h)||s.mixins.push(h),l},component(h,c){return c?(s.components[h]=c,l):s.components[h]},directive(h,c){return c?(s.directives[h]=c,l):s.directives[h]},mount(h,c,u){if(!o){const f=ve(i,r);return f.appContext=s,c&&e?e(f,h):t(f,h,u),o=!0,l._container=h,h.__vue_app__=l,$r(f.component)||f.component.proxy}},unmount(){o&&(t(null,l._container),delete l._container.__vue_app__)},provide(h,c){return s.provides[h]=c,l},runWithContext(h){Kn=l;try{return h()}finally{Kn=null}}};return l}}let Kn=null;function Vn(t,e){if(xe){let n=xe.provides;const i=xe.parent&&xe.parent.provides;i===n&&(n=xe.provides=Object.create(i)),n[t]=e}}function Ve(t,e,n=!1){const i=xe||Ie;if(i||Kn){const r=i?i.parent==null?i.vnode.appContext&&i.vnode.appContext.provides:i.parent.provides:Kn._context.provides;if(r&&t in r)return r[t];if(arguments.length>1)return n&&Y(e)?e.call(i&&i.proxy):e}}function Lc(t,e,n,i=!1){const r={},s={};Zn(s,fi,1),t.propsDefaults=Object.create(null),_o(t,e,r,s);for(const a in t.propsOptions[0])a in r||(r[a]=void 0);n?t.props=i?r:Ka(r):t.type.props?t.props=r:t.props=s,t.attrs=s}function Ic(t,e,n,i){const{props:r,attrs:s,vnode:{patchFlag:a}}=t,o=ie(r),[l]=t.propsOptions;let h=!1;if((i||a>0)&&!(a&16)){if(a&8){const c=t.vnode.dynamicProps;for(let u=0;u<c.length;u++){let f=c[u];if(ci(t.emitsOptions,f))continue;const d=e[f];if(l)if(ee(s,f))d!==s[f]&&(s[f]=d,h=!0);else{const p=Je(f);r[p]=sr(l,o,p,d,t,!1)}else d!==s[f]&&(s[f]=d,h=!0)}}}else{_o(t,e,r,s)&&(h=!0);let c;for(const u in o)(!e||!ee(e,u)&&((c=Ht(u))===u||!ee(e,c)))&&(l?n&&(n[u]!==void 0||n[c]!==void 0)&&(r[u]=sr(l,o,u,void 0,t,!0)):delete r[u]);if(s!==o)for(const u in s)(!e||!ee(e,u))&&(delete s[u],h=!0)}h&&st(t,"set","$attrs")}function _o(t,e,n,i){const[r,s]=t.propsOptions;let a=!1,o;if(e)for(let l in e){if($n(l))continue;const h=e[l];let c;r&&ee(r,c=Je(l))?!s||!s.includes(c)?n[c]=h:(o||(o={}))[c]=h:ci(t.emitsOptions,l)||(!(l in i)||h!==i[l])&&(i[l]=h,a=!0)}if(s){const l=ie(n),h=o||he;for(let c=0;c<s.length;c++){const u=s[c];n[u]=sr(r,l,u,h[u],t,!ee(h,u))}}return a}function sr(t,e,n,i,r,s){const a=t[n];if(a!=null){const o=ee(a,"default");if(o&&i===void 0){const l=a.default;if(a.type!==Function&&!a.skipFactory&&Y(l)){const{propsDefaults:h}=r;n in h?i=h[n]:(kt(r),i=h[n]=l.call(null,e),Mt())}else i=l}a[0]&&(s&&!o?i=!1:a[1]&&(i===""||i===Ht(n))&&(i=!0))}return i}function yo(t,e,n=!1){const i=e.propsCache,r=i.get(t);if(r)return r;const s=t.props,a={},o=[];let l=!1;if(!Y(t)){const c=u=>{l=!0;const[f,d]=yo(u,e,!0);_e(a,f),d&&o.push(...d)};!n&&e.mixins.length&&e.mixins.forEach(c),t.extends&&c(t.extends),t.mixins&&t.mixins.forEach(c)}if(!s&&!l)return pe(t)&&i.set(t,It),It;if(X(s))for(let c=0;c<s.length;c++){const u=Je(s[c]);vs(u)&&(a[u]=he)}else if(s)for(const c in s){const u=Je(c);if(vs(u)){const f=s[c],d=a[u]=X(f)||Y(f)?{type:f}:_e({},f);if(d){const p=_s(Boolean,d.type),m=_s(String,d.type);d[0]=p>-1,d[1]=m<0||p<m,(p>-1||ee(d,"default"))&&o.push(u)}}}const h=[a,o];return pe(t)&&i.set(t,h),h}function vs(t){return t[0]!=="$"}function bs(t){const e=t&&t.toString().match(/^\s*(function|class) (\w+)/);return e?e[2]:t===null?"null":""}function xs(t,e){return bs(t)===bs(e)}function _s(t,e){return X(e)?e.findIndex(n=>xs(n,t)):Y(e)&&xs(e,t)?0:-1}const wo=t=>t[0]==="_"||t==="$stable",zr=t=>X(t)?t.map(Ke):[Ke(t)],Dc=(t,e,n)=>{if(e._n)return e;const i=ic((...r)=>zr(e(...r)),n);return i._c=!1,i},Eo=(t,e,n)=>{const i=t._ctx;for(const r in t){if(wo(r))continue;const s=t[r];if(Y(s))e[r]=Dc(r,s,i);else if(s!=null){const a=zr(s);e[r]=()=>a}}},Ao=(t,e)=>{const n=zr(e);t.slots.default=()=>n},Uc=(t,e)=>{if(t.vnode.shapeFlag&32){const n=e._;n?(t.slots=ie(e),Zn(e,"_",n)):Eo(e,t.slots={})}else t.slots={},e&&Ao(t,e);Zn(t.slots,fi,1)},Bc=(t,e,n)=>{const{vnode:i,slots:r}=t;let s=!0,a=he;if(i.shapeFlag&32){const o=e._;o?n&&o===1?s=!1:(_e(r,e),!n&&o===1&&delete r._):(s=!e.$stable,Eo(e,r)),a=e}else e&&(Ao(t,e),a={default:1});if(s)for(const o in r)!wo(o)&&!(o in a)&&delete r[o]};function ar(t,e,n,i,r=!1){if(X(t)){t.forEach((f,d)=>ar(f,e&&(X(e)?e[d]:e),n,i,r));return}if(jn(i)&&!r)return;const s=i.shapeFlag&4?$r(i.component)||i.component.proxy:i.el,a=r?null:s,{i:o,r:l}=t,h=e&&e.r,c=o.refs===he?o.refs={}:o.refs,u=o.setupState;if(h!=null&&h!==l&&(we(h)?(c[h]=null,ee(u,h)&&(u[h]=null)):Ae(h)&&(h.value=null)),Y(l))gt(l,o,12,[a,c]);else{const f=we(l),d=Ae(l);if(f||d){const p=()=>{if(t.f){const m=f?ee(u,l)?u[l]:c[l]:l.value;r?X(m)&&yr(m,s):X(m)?m.includes(s)||m.push(s):f?(c[l]=[s],ee(u,l)&&(u[l]=c[l])):(l.value=[s],t.k&&(c[t.k]=l.value))}else f?(c[l]=a,ee(u,l)&&(u[l]=a)):d&&(l.value=a,t.k&&(c[t.k]=a))};a?(p.id=-1,Te(p,n)):p()}}}const Te=cc;function zc(t){return Nc(t)}function Nc(t,e){const n=Yi();n.__VUE__=!0;const{insert:i,remove:r,patchProp:s,createElement:a,createText:o,createComment:l,setText:h,setElementText:c,parentNode:u,nextSibling:f,setScopeId:d=We,insertStaticContent:p}=t,m=(g,v,y,S=null,O=null,F=null,N=!1,D=null,B=!!v.dynamicChildren)=>{if(g===v)return;g&&!Qt(g,v)&&(S=T(g),de(g,O,F,!0),g=null),v.patchFlag===-2&&(B=!1,v.dynamicChildren=null);const{type:L,ref:V,shapeFlag:$}=v;switch(L){case ui:x(g,v,y,S);break;case xn:_(g,v,y,S);break;case ln:g==null&&P(v,y,S,N);break;case Ye:G(g,v,y,S,O,F,N,D,B);break;default:$&1?M(g,v,y,S,O,F,N,D,B):$&6?A(g,v,y,S,O,F,N,D,B):($&64||$&128)&&L.process(g,v,y,S,O,F,N,D,B,U)}V!=null&&O&&ar(V,g&&g.ref,F,v||g,!v)},x=(g,v,y,S)=>{if(g==null)i(v.el=o(v.children),y,S);else{const O=v.el=g.el;v.children!==g.children&&h(O,v.children)}},_=(g,v,y,S)=>{g==null?i(v.el=l(v.children||""),y,S):v.el=g.el},P=(g,v,y,S)=>{[g.el,g.anchor]=p(g.children,v,y,S,g.el,g.anchor)},w=({el:g,anchor:v},y,S)=>{let O;for(;g&&g!==v;)O=f(g),i(g,y,S),g=O;i(v,y,S)},b=({el:g,anchor:v})=>{let y;for(;g&&g!==v;)y=f(g),r(g),g=y;r(v)},M=(g,v,y,S,O,F,N,D,B)=>{N=N||v.type==="svg",g==null?C(v,y,S,O,F,N,D,B):re(g,v,O,F,N,D,B)},C=(g,v,y,S,O,F,N,D)=>{let B,L;const{type:V,props:$,shapeFlag:H,transition:q,dirs:K}=g;if(B=g.el=a(g.type,F,$&&$.is,$),H&8?c(B,g.children):H&16&&te(g.children,B,null,S,O,F&&V!=="foreignObject",N,D),K&&xt(g,null,S,"created"),Z(B,g,g.scopeId,N,S),$){for(const ae in $)ae!=="value"&&!$n(ae)&&s(B,ae,null,$[ae],F,g.children,S,O,be);"value"in $&&s(B,"value",null,$.value),(L=$.onVnodeBeforeMount)&&qe(L,S,g)}K&&xt(g,null,S,"beforeMount");const ce=(!O||O&&!O.pendingBranch)&&q&&!q.persisted;ce&&q.beforeEnter(B),i(B,v,y),((L=$&&$.onVnodeMounted)||ce||K)&&Te(()=>{L&&qe(L,S,g),ce&&q.enter(B),K&&xt(g,null,S,"mounted")},O)},Z=(g,v,y,S,O)=>{if(y&&d(g,y),S)for(let F=0;F<S.length;F++)d(g,S[F]);if(O){let F=O.subTree;if(v===F){const N=O.vnode;Z(g,N,N.scopeId,N.slotScopeIds,O.parent)}}},te=(g,v,y,S,O,F,N,D,B=0)=>{for(let L=B;L<g.length;L++){const V=g[L]=D?ft(g[L]):Ke(g[L]);m(null,V,v,y,S,O,F,N,D)}},re=(g,v,y,S,O,F,N)=>{const D=v.el=g.el;let{patchFlag:B,dynamicChildren:L,dirs:V}=v;B|=g.patchFlag&16;const $=g.props||he,H=v.props||he;let q;y&&_t(y,!1),(q=H.onVnodeBeforeUpdate)&&qe(q,y,v,g),V&&xt(v,g,y,"beforeUpdate"),y&&_t(y,!0);const K=O&&v.type!=="foreignObject";if(L?Q(g.dynamicChildren,L,D,y,S,K,F):N||j(g,v,D,null,y,S,K,F,!1),B>0){if(B&16)ne(D,v,$,H,y,S,O);else if(B&2&&$.class!==H.class&&s(D,"class",null,H.class,O),B&4&&s(D,"style",$.style,H.style,O),B&8){const ce=v.dynamicProps;for(let ae=0;ae<ce.length;ae++){const ge=ce[ae],Ue=$[ge],Ct=H[ge];(Ct!==Ue||ge==="value")&&s(D,ge,Ue,Ct,O,g.children,y,S,be)}}B&1&&g.children!==v.children&&c(D,v.children)}else!N&&L==null&&ne(D,v,$,H,y,S,O);((q=H.onVnodeUpdated)||V)&&Te(()=>{q&&qe(q,y,v,g),V&&xt(v,g,y,"updated")},S)},Q=(g,v,y,S,O,F,N)=>{for(let D=0;D<v.length;D++){const B=g[D],L=v[D],V=B.el&&(B.type===Ye||!Qt(B,L)||B.shapeFlag&70)?u(B.el):y;m(B,L,V,null,S,O,F,N,!0)}},ne=(g,v,y,S,O,F,N)=>{if(y!==S){if(y!==he)for(const D in y)!$n(D)&&!(D in S)&&s(g,D,y[D],null,N,v.children,O,F,be);for(const D in S){if($n(D))continue;const B=S[D],L=y[D];B!==L&&D!=="value"&&s(g,D,L,B,N,v.children,O,F,be)}"value"in S&&s(g,"value",y.value,S.value)}},G=(g,v,y,S,O,F,N,D,B)=>{const L=v.el=g?g.el:o(""),V=v.anchor=g?g.anchor:o("");let{patchFlag:$,dynamicChildren:H,slotScopeIds:q}=v;q&&(D=D?D.concat(q):q),g==null?(i(L,y,S),i(V,y,S),te(v.children,y,V,O,F,N,D,B)):$>0&&$&64&&H&&g.dynamicChildren?(Q(g.dynamicChildren,H,y,O,F,N,D),(v.key!=null||O&&v===O.subTree)&&Mo(g,v,!0)):j(g,v,y,V,O,F,N,D,B)},A=(g,v,y,S,O,F,N,D,B)=>{v.slotScopeIds=D,g==null?v.shapeFlag&512?O.ctx.activate(v,y,S,N,B):I(v,y,S,O,F,N,B):E(g,v,B)},I=(g,v,y,S,O,F,N)=>{const D=g.component=Yc(g,S,O);if(go(g)&&(D.ctx.renderer=U),Qc(D),D.asyncDep){if(O&&O.registerDep(D,R),!g.el){const B=D.subTree=ve(xn);_(null,B,v,y)}return}R(D,g,v,y,O,F,N)},E=(g,v,y)=>{const S=v.component=g.component;if(ac(g,v,y))if(S.asyncDep&&!S.asyncResolved){z(S,v,y);return}else S.next=v,Jl(S.update),S.update();else v.el=g.el,S.vnode=v},R=(g,v,y,S,O,F,N)=>{const D=()=>{if(g.isMounted){let{next:V,bu:$,u:H,parent:q,vnode:K}=g,ce=V,ae;_t(g,!1),V?(V.el=K.el,z(g,V,N)):V=K,$&&_i($),(ae=V.props&&V.props.onVnodeBeforeUpdate)&&qe(ae,q,V,K),_t(g,!0);const ge=yi(g),Ue=g.subTree;g.subTree=ge,m(Ue,ge,u(Ue.el),T(Ue),g,O,F),V.el=ge.el,ce===null&&oc(g,ge.el),H&&Te(H,O),(ae=V.props&&V.props.onVnodeUpdated)&&Te(()=>qe(ae,q,V,K),O)}else{let V;const{el:$,props:H}=v,{bm:q,m:K,parent:ce}=g,ae=jn(v);if(_t(g,!1),q&&_i(q),!ae&&(V=H&&H.onVnodeBeforeMount)&&qe(V,ce,v),_t(g,!0),$&&J){const ge=()=>{g.subTree=yi(g),J($,g.subTree,g,O,null)};ae?v.type.__asyncLoader().then(()=>!g.isUnmounted&&ge()):ge()}else{const ge=g.subTree=yi(g);m(null,ge,y,S,g,O,F),v.el=ge.el}if(K&&Te(K,O),!ae&&(V=H&&H.onVnodeMounted)){const ge=v;Te(()=>qe(V,ce,ge),O)}(v.shapeFlag&256||ce&&jn(ce.vnode)&&ce.vnode.shapeFlag&256)&&g.a&&Te(g.a,O),g.isMounted=!0,v=y=S=null}},B=g.effect=new Pr(D,()=>Lr(L),g.scope),L=g.update=()=>B.run();L.id=g.uid,_t(g,!0),L()},z=(g,v,y)=>{v.component=g;const S=g.vnode.props;g.vnode=v,g.next=null,Ic(g,v.props,S,y),Bc(g,v.children,y),Gt(),hs(),Zt()},j=(g,v,y,S,O,F,N,D,B=!1)=>{const L=g&&g.children,V=g?g.shapeFlag:0,$=v.children,{patchFlag:H,shapeFlag:q}=v;if(H>0){if(H&128){ye(L,$,y,S,O,F,N,D,B);return}else if(H&256){le(L,$,y,S,O,F,N,D,B);return}}q&8?(V&16&&be(L,O,F),$!==L&&c(y,$)):V&16?q&16?ye(L,$,y,S,O,F,N,D,B):be(L,O,F,!0):(V&8&&c(y,""),q&16&&te($,y,S,O,F,N,D,B))},le=(g,v,y,S,O,F,N,D,B)=>{g=g||It,v=v||It;const L=g.length,V=v.length,$=Math.min(L,V);let H;for(H=0;H<$;H++){const q=v[H]=B?ft(v[H]):Ke(v[H]);m(g[H],q,y,null,O,F,N,D,B)}L>V?be(g,O,F,!0,!1,$):te(v,y,S,O,F,N,D,B,$)},ye=(g,v,y,S,O,F,N,D,B)=>{let L=0;const V=v.length;let $=g.length-1,H=V-1;for(;L<=$&&L<=H;){const q=g[L],K=v[L]=B?ft(v[L]):Ke(v[L]);if(Qt(q,K))m(q,K,y,null,O,F,N,D,B);else break;L++}for(;L<=$&&L<=H;){const q=g[$],K=v[H]=B?ft(v[H]):Ke(v[H]);if(Qt(q,K))m(q,K,y,null,O,F,N,D,B);else break;$--,H--}if(L>$){if(L<=H){const q=H+1,K=q<V?v[q].el:S;for(;L<=H;)m(null,v[L]=B?ft(v[L]):Ke(v[L]),y,K,O,F,N,D,B),L++}}else if(L>H)for(;L<=$;)de(g[L],O,F,!0),L++;else{const q=L,K=L,ce=new Map;for(L=K;L<=H;L++){const Re=v[L]=B?ft(v[L]):Ke(v[L]);Re.key!=null&&ce.set(Re.key,L)}let ae,ge=0;const Ue=H-K+1;let Ct=!1,Jr=0;const Kt=new Array(Ue);for(L=0;L<Ue;L++)Kt[L]=0;for(L=q;L<=$;L++){const Re=g[L];if(ge>=Ue){de(Re,O,F,!0);continue}let Ze;if(Re.key!=null)Ze=ce.get(Re.key);else for(ae=K;ae<=H;ae++)if(Kt[ae-K]===0&&Qt(Re,v[ae])){Ze=ae;break}Ze===void 0?de(Re,O,F,!0):(Kt[Ze-K]=L+1,Ze>=Jr?Jr=Ze:Ct=!0,m(Re,v[Ze],y,null,O,F,N,D,B),ge++)}const es=Ct?kc(Kt):It;for(ae=es.length-1,L=Ue-1;L>=0;L--){const Re=K+L,Ze=v[Re],ts=Re+1<V?v[Re+1].el:S;Kt[L]===0?m(null,Ze,y,ts,O,F,N,D,B):Ct&&(ae<0||L!==es[ae]?fe(Ze,y,ts,2):ae--)}}},fe=(g,v,y,S,O=null)=>{const{el:F,type:N,transition:D,children:B,shapeFlag:L}=g;if(L&6){fe(g.component.subTree,v,y,S);return}if(L&128){g.suspense.move(v,y,S);return}if(L&64){N.move(g,v,y,U);return}if(N===Ye){i(F,v,y);for(let $=0;$<B.length;$++)fe(B[$],v,y,S);i(g.anchor,v,y);return}if(N===ln){w(g,v,y);return}if(S!==2&&L&1&&D)if(S===0)D.beforeEnter(F),i(F,v,y),Te(()=>D.enter(F),O);else{const{leave:$,delayLeave:H,afterLeave:q}=D,K=()=>i(F,v,y),ce=()=>{$(F,()=>{K(),q&&q()})};H?H(F,K,ce):ce()}else i(F,v,y)},de=(g,v,y,S=!1,O=!1)=>{const{type:F,props:N,ref:D,children:B,dynamicChildren:L,shapeFlag:V,patchFlag:$,dirs:H}=g;if(D!=null&&ar(D,null,y,g,!0),V&256){v.ctx.deactivate(g);return}const q=V&1&&H,K=!jn(g);let ce;if(K&&(ce=N&&N.onVnodeBeforeUnmount)&&qe(ce,v,g),V&6)Ge(g.component,y,S);else{if(V&128){g.suspense.unmount(y,S);return}q&&xt(g,null,v,"beforeUnmount"),V&64?g.type.remove(g,v,y,O,U,S):L&&(F!==Ye||$>0&&$&64)?be(L,v,y,!1,!0):(F===Ye&&$&384||!O&&V&16)&&be(B,v,y),S&&Fe(g)}(K&&(ce=N&&N.onVnodeUnmounted)||q)&&Te(()=>{ce&&qe(ce,v,g),q&&xt(g,null,v,"unmounted")},y)},Fe=g=>{const{type:v,el:y,anchor:S,transition:O}=g;if(v===Ye){De(y,S);return}if(v===ln){b(g);return}const F=()=>{r(y),O&&!O.persisted&&O.afterLeave&&O.afterLeave()};if(g.shapeFlag&1&&O&&!O.persisted){const{leave:N,delayLeave:D}=O,B=()=>N(y,F);D?D(g.el,F,B):B()}else F()},De=(g,v)=>{let y;for(;g!==v;)y=f(g),r(g),g=y;r(v)},Ge=(g,v,y)=>{const{bum:S,scope:O,update:F,subTree:N,um:D}=g;S&&_i(S),O.stop(),F&&(F.active=!1,de(N,g,v,y)),D&&Te(D,v),Te(()=>{g.isUnmounted=!0},v),v&&v.pendingBranch&&!v.isUnmounted&&g.asyncDep&&!g.asyncResolved&&g.suspenseId===v.pendingId&&(v.deps--,v.deps===0&&v.resolve())},be=(g,v,y,S=!1,O=!1,F=0)=>{for(let N=F;N<g.length;N++)de(g[N],v,y,S,O)},T=g=>g.shapeFlag&6?T(g.component.subTree):g.shapeFlag&128?g.suspense.next():f(g.anchor||g.el),k=(g,v,y)=>{g==null?v._vnode&&de(v._vnode,null,null,!0):m(v._vnode||null,g,v,null,null,null,y),hs(),lo(),v._vnode=g},U={p:m,um:de,m:fe,r:Fe,mt:I,mc:te,pc:j,pbc:Q,n:T,o:t};let W,J;return e&&([W,J]=e(U)),{render:k,hydrate:W,createApp:Fc(k,W)}}function _t({effect:t,update:e},n){t.allowRecurse=e.allowRecurse=n}function Mo(t,e,n=!1){const i=t.children,r=e.children;if(X(i)&&X(r))for(let s=0;s<i.length;s++){const a=i[s];let o=r[s];o.shapeFlag&1&&!o.dynamicChildren&&((o.patchFlag<=0||o.patchFlag===32)&&(o=r[s]=ft(r[s]),o.el=a.el),n||Mo(a,o)),o.type===ui&&(o.el=a.el)}}function kc(t){const e=t.slice(),n=[0];let i,r,s,a,o;const l=t.length;for(i=0;i<l;i++){const h=t[i];if(h!==0){if(r=n[n.length-1],t[r]<h){e[i]=r,n.push(i);continue}for(s=0,a=n.length-1;s<a;)o=s+a>>1,t[n[o]]<h?s=o+1:a=o;h<t[n[s]]&&(s>0&&(e[i]=n[s-1]),n[s]=i)}}for(s=n.length,a=n[s-1];s-- >0;)n[s]=a,a=e[a];return n}const $c=t=>t.__isTeleport,Ye=Symbol.for("v-fgt"),ui=Symbol.for("v-txt"),xn=Symbol.for("v-cmt"),ln=Symbol.for("v-stc"),cn=[];let $e=null;function qt(t=!1){cn.push($e=t?null:[])}function Wc(){cn.pop(),$e=cn[cn.length-1]||null}let _n=1;function ys(t){_n+=t}function Po(t){return t.dynamicChildren=_n>0?$e||It:null,Wc(),_n>0&&$e&&$e.push(t),t}function Pn(t,e,n,i,r,s){return Po(rt(t,e,n,i,r,s,!0))}function jc(t,e,n,i,r){return Po(ve(t,e,n,i,r,!0))}function or(t){return t?t.__v_isVNode===!0:!1}function Qt(t,e){return t.type===e.type&&t.key===e.key}const fi="__vInternal",To=({key:t})=>t??null,Hn=({ref:t,ref_key:e,ref_for:n})=>(typeof t=="number"&&(t=""+t),t!=null?we(t)||Ae(t)||Y(t)?{i:Ie,r:t,k:e,f:!!n}:t:null);function rt(t,e=null,n=null,i=0,r=null,s=t===Ye?0:1,a=!1,o=!1){const l={__v_isVNode:!0,__v_skip:!0,type:t,props:e,key:e&&To(e),ref:e&&Hn(e),scopeId:uo,slotScopeIds:null,children:n,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetAnchor:null,staticCount:0,shapeFlag:s,patchFlag:i,dynamicProps:r,dynamicChildren:null,appContext:null,ctx:Ie};return o?(Nr(l,n),s&128&&t.normalize(l)):n&&(l.shapeFlag|=we(n)?8:16),_n>0&&!a&&$e&&(l.patchFlag>0||s&6)&&l.patchFlag!==32&&$e.push(l),l}const ve=Vc;function Vc(t,e=null,n=null,i=0,r=null,s=!1){if((!t||t===Ec)&&(t=xn),or(t)){const o=Nt(t,e,!0);return n&&Nr(o,n),_n>0&&!s&&$e&&(o.shapeFlag&6?$e[$e.indexOf(t)]=o:$e.push(o)),o.patchFlag|=-2,o}if(ih(t)&&(t=t.__vccOpts),e){e=Hc(e);let{class:o,style:l}=e;o&&!we(o)&&(e.class=si(o)),pe(l)&&(Ja(l)&&!X(l)&&(l=_e({},l)),e.style=Ar(l))}const a=we(t)?1:lc(t)?128:$c(t)?64:pe(t)?4:Y(t)?2:0;return rt(t,e,n,i,r,a,s,!0)}function Hc(t){return t?Ja(t)||fi in t?_e({},t):t:null}function Nt(t,e,n=!1){const{props:i,ref:r,patchFlag:s,children:a}=t,o=e?Zc(i||{},e):i;return{__v_isVNode:!0,__v_skip:!0,type:t.type,props:o,key:o&&To(o),ref:e&&e.ref?n&&r?X(r)?r.concat(Hn(e)):[r,Hn(e)]:Hn(e):r,scopeId:t.scopeId,slotScopeIds:t.slotScopeIds,children:a,target:t.target,targetAnchor:t.targetAnchor,staticCount:t.staticCount,shapeFlag:t.shapeFlag,patchFlag:e&&t.type!==Ye?s===-1?16:s|16:s,dynamicProps:t.dynamicProps,dynamicChildren:t.dynamicChildren,appContext:t.appContext,dirs:t.dirs,transition:t.transition,component:t.component,suspense:t.suspense,ssContent:t.ssContent&&Nt(t.ssContent),ssFallback:t.ssFallback&&Nt(t.ssFallback),el:t.el,anchor:t.anchor,ctx:t.ctx,ce:t.ce}}function Gc(t=" ",e=0){return ve(ui,null,t,e)}function St(t,e){const n=ve(ln,null,t);return n.staticCount=e,n}function Ke(t){return t==null||typeof t=="boolean"?ve(xn):X(t)?ve(Ye,null,t.slice()):typeof t=="object"?ft(t):ve(ui,null,String(t))}function ft(t){return t.el===null&&t.patchFlag!==-1||t.memo?t:Nt(t)}function Nr(t,e){let n=0;const{shapeFlag:i}=t;if(e==null)e=null;else if(X(e))n=16;else if(typeof e=="object")if(i&65){const r=e.default;r&&(r._c&&(r._d=!1),Nr(t,r()),r._c&&(r._d=!0));return}else{n=32;const r=e._;!r&&!(fi in e)?e._ctx=Ie:r===3&&Ie&&(Ie.slots._===1?e._=1:(e._=2,t.patchFlag|=1024))}else Y(e)?(e={default:e,_ctx:Ie},n=32):(e=String(e),i&64?(n=16,e=[Gc(e)]):n=8);t.children=e,t.shapeFlag|=n}function Zc(...t){const e={};for(let n=0;n<t.length;n++){const i=t[n];for(const r in i)if(r==="class")e.class!==i.class&&(e.class=si([e.class,i.class]));else if(r==="style")e.style=Ar([e.style,i.style]);else if(ti(r)){const s=e[r],a=i[r];a&&s!==a&&!(X(s)&&s.includes(a))&&(e[r]=s?[].concat(s,a):a)}else r!==""&&(e[r]=i[r])}return e}function qe(t,e,n,i=null){je(t,e,7,[n,i])}const qc=xo();let Xc=0;function Yc(t,e,n){const i=t.type,r=(e?e.appContext:t.appContext)||qc,s={uid:Xc++,vnode:t,type:i,parent:e,appContext:r,root:null,next:null,subTree:null,effect:null,update:null,scope:new vl(!0),render:null,proxy:null,exposed:null,exposeProxy:null,withProxy:null,provides:e?e.provides:Object.create(r.provides),accessCache:null,renderCache:[],components:null,directives:null,propsOptions:yo(i,r),emitsOptions:ho(i,r),emit:null,emitted:null,propsDefaults:he,inheritAttrs:i.inheritAttrs,ctx:he,data:he,props:he,attrs:he,slots:he,refs:he,setupState:he,setupContext:null,attrsProxy:null,slotsProxy:null,suspense:n,suspenseId:n?n.pendingId:0,asyncDep:null,asyncResolved:!1,isMounted:!1,isUnmounted:!1,isDeactivated:!1,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null,sp:null};return s.ctx={_:s},s.root=e?e.root:s,s.emit=nc.bind(null,s),t.ce&&t.ce(s),s}let xe=null;const Kc=()=>xe||Ie;let kr,Rt,ws="__VUE_INSTANCE_SETTERS__";(Rt=Yi()[ws])||(Rt=Yi()[ws]=[]),Rt.push(t=>xe=t),kr=t=>{Rt.length>1?Rt.forEach(e=>e(t)):Rt[0](t)};const kt=t=>{kr(t),t.scope.on()},Mt=()=>{xe&&xe.scope.off(),kr(null)};function So(t){return t.vnode.shapeFlag&4}let yn=!1;function Qc(t,e=!1){yn=e;const{props:n,children:i}=t.vnode,r=So(t);Lc(t,n,r,e),Uc(t,i);const s=r?Jc(t,e):void 0;return yn=!1,s}function Jc(t,e){const n=t.type;t.accessCache=Object.create(null),t.proxy=eo(new Proxy(t.ctx,Mc));const{setup:i}=n;if(i){const r=t.setupContext=i.length>1?th(t):null;kt(t),Gt();const s=gt(i,t,0,[t.props,r]);if(Zt(),Mt(),Na(s)){if(s.then(Mt,Mt),e)return s.then(a=>{Es(t,a,e)}).catch(a=>{li(a,t,0)});t.asyncDep=s}else Es(t,s,e)}else Co(t,e)}function Es(t,e,n){Y(e)?t.type.__ssrInlineRender?t.ssrRender=e:t.render=e:pe(e)&&(t.setupState=ro(e)),Co(t,n)}let As;function Co(t,e,n){const i=t.type;if(!t.render){if(!e&&As&&!i.render){const r=i.template||Br(t).template;if(r){const{isCustomElement:s,compilerOptions:a}=t.appContext.config,{delimiters:o,compilerOptions:l}=i,h=_e(_e({isCustomElement:s,delimiters:o},a),l);i.render=As(r,h)}}t.render=i.render||We}kt(t),Gt(),Pc(t),Zt(),Mt()}function eh(t){return t.attrsProxy||(t.attrsProxy=new Proxy(t.attrs,{get(e,n){return Ce(t,"get","$attrs"),e[n]}}))}function th(t){const e=n=>{t.exposed=n||{}};return{get attrs(){return eh(t)},slots:t.slots,emit:t.emit,expose:e}}function $r(t){if(t.exposed)return t.exposeProxy||(t.exposeProxy=new Proxy(ro(eo(t.exposed)),{get(e,n){if(n in e)return e[n];if(n in on)return on[n](t)},has(e,n){return n in e||n in on}}))}function nh(t,e=!0){return Y(t)?t.displayName||t.name:t.name||e&&t.__name}function ih(t){return Y(t)&&"__vccOpts"in t}const ke=(t,e)=>Yl(t,e,yn);function Ro(t,e,n){const i=arguments.length;return i===2?pe(e)&&!X(e)?or(e)?ve(t,null,[e]):ve(t,e):ve(t,null,e):(i>3?n=Array.prototype.slice.call(arguments,2):i===3&&or(n)&&(n=[n]),ve(t,e,n))}const rh=Symbol.for("v-scx"),sh=()=>Ve(rh),ah="3.3.4",oh="http://www.w3.org/2000/svg",wt=typeof document<"u"?document:null,Ms=wt&&wt.createElement("template"),lh={insert:(t,e,n)=>{e.insertBefore(t,n||null)},remove:t=>{const e=t.parentNode;e&&e.removeChild(t)},createElement:(t,e,n,i)=>{const r=e?wt.createElementNS(oh,t):wt.createElement(t,n?{is:n}:void 0);return t==="select"&&i&&i.multiple!=null&&r.setAttribute("multiple",i.multiple),r},createText:t=>wt.createTextNode(t),createComment:t=>wt.createComment(t),setText:(t,e)=>{t.nodeValue=e},setElementText:(t,e)=>{t.textContent=e},parentNode:t=>t.parentNode,nextSibling:t=>t.nextSibling,querySelector:t=>wt.querySelector(t),setScopeId(t,e){t.setAttribute(e,"")},insertStaticContent(t,e,n,i,r,s){const a=n?n.previousSibling:e.lastChild;if(r&&(r===s||r.nextSibling))for(;e.insertBefore(r.cloneNode(!0),n),!(r===s||!(r=r.nextSibling)););else{Ms.innerHTML=i?`<svg>${t}</svg>`:t;const o=Ms.content;if(i){const l=o.firstChild;for(;l.firstChild;)o.appendChild(l.firstChild);o.removeChild(l)}e.insertBefore(o,n)}return[a?a.nextSibling:e.firstChild,n?n.previousSibling:e.lastChild]}};function ch(t,e,n){const i=t._vtc;i&&(e=(e?[e,...i]:[...i]).join(" ")),e==null?t.removeAttribute("class"):n?t.setAttribute("class",e):t.className=e}function hh(t,e,n){const i=t.style,r=we(n);if(n&&!r){if(e&&!we(e))for(const s in e)n[s]==null&&lr(i,s,"");for(const s in n)lr(i,s,n[s])}else{const s=i.display;r?e!==n&&(i.cssText=n):e&&t.removeAttribute("style"),"_vod"in t&&(i.display=s)}}const Ps=/\s*!important$/;function lr(t,e,n){if(X(n))n.forEach(i=>lr(t,e,i));else if(n==null&&(n=""),e.startsWith("--"))t.setProperty(e,n);else{const i=uh(t,e);Ps.test(n)?t.setProperty(Ht(i),n.replace(Ps,""),"important"):t[i]=n}}const Ts=["Webkit","Moz","ms"],Ei={};function uh(t,e){const n=Ei[e];if(n)return n;let i=Je(e);if(i!=="filter"&&i in t)return Ei[e]=i;i=ri(i);for(let r=0;r<Ts.length;r++){const s=Ts[r]+i;if(s in t)return Ei[e]=s}return e}const Ss="http://www.w3.org/1999/xlink";function fh(t,e,n,i,r){if(i&&e.startsWith("xlink:"))n==null?t.removeAttributeNS(Ss,e.slice(6,e.length)):t.setAttributeNS(Ss,e,n);else{const s=ml(e);n==null||s&&!ka(n)?t.removeAttribute(e):t.setAttribute(e,s?"":n)}}function dh(t,e,n,i,r,s,a){if(e==="innerHTML"||e==="textContent"){i&&a(i,r,s),t[e]=n??"";return}const o=t.tagName;if(e==="value"&&o!=="PROGRESS"&&!o.includes("-")){t._value=n;const h=o==="OPTION"?t.getAttribute("value"):t.value,c=n??"";h!==c&&(t.value=c),n==null&&t.removeAttribute(e);return}let l=!1;if(n===""||n==null){const h=typeof t[e];h==="boolean"?n=ka(n):n==null&&h==="string"?(n="",l=!0):h==="number"&&(n=0,l=!0)}try{t[e]=n}catch{}l&&t.removeAttribute(e)}function ph(t,e,n,i){t.addEventListener(e,n,i)}function gh(t,e,n,i){t.removeEventListener(e,n,i)}function mh(t,e,n,i,r=null){const s=t._vei||(t._vei={}),a=s[e];if(i&&a)a.value=i;else{const[o,l]=vh(e);if(i){const h=s[e]=_h(i,r);ph(t,o,h,l)}else a&&(gh(t,o,a,l),s[e]=void 0)}}const Cs=/(?:Once|Passive|Capture)$/;function vh(t){let e;if(Cs.test(t)){e={};let i;for(;i=t.match(Cs);)t=t.slice(0,t.length-i[0].length),e[i[0].toLowerCase()]=!0}return[t[2]===":"?t.slice(3):Ht(t.slice(2)),e]}let Ai=0;const bh=Promise.resolve(),xh=()=>Ai||(bh.then(()=>Ai=0),Ai=Date.now());function _h(t,e){const n=i=>{if(!i._vts)i._vts=Date.now();else if(i._vts<=n.attached)return;je(yh(i,n.value),e,5,[i])};return n.value=t,n.attached=xh(),n}function yh(t,e){if(X(e)){const n=t.stopImmediatePropagation;return t.stopImmediatePropagation=()=>{n.call(t),t._stopped=!0},e.map(i=>r=>!r._stopped&&i&&i(r))}else return e}const Rs=/^on[a-z]/,wh=(t,e,n,i,r=!1,s,a,o,l)=>{e==="class"?ch(t,i,r):e==="style"?hh(t,n,i):ti(e)?_r(e)||mh(t,e,n,i,a):(e[0]==="."?(e=e.slice(1),!0):e[0]==="^"?(e=e.slice(1),!1):Eh(t,e,i,r))?dh(t,e,i,s,a,o,l):(e==="true-value"?t._trueValue=i:e==="false-value"&&(t._falseValue=i),fh(t,e,i,r))};function Eh(t,e,n,i){return i?!!(e==="innerHTML"||e==="textContent"||e in t&&Rs.test(e)&&Y(n)):e==="spellcheck"||e==="draggable"||e==="translate"||e==="form"||e==="list"&&t.tagName==="INPUT"||e==="type"&&t.tagName==="TEXTAREA"||Rs.test(e)&&we(n)?!1:e in t}function Ah(t){const e=Kc();if(!e)return;const n=e.ut=(r=t(e.proxy))=>{Array.from(document.querySelectorAll(`[data-v-owner="${e.uid}"]`)).forEach(s=>hr(s,r))},i=()=>{const r=t(e.proxy);cr(e.subTree,r),n(r)};hc(i),Dr(()=>{const r=new MutationObserver(i);r.observe(e.subTree.el.parentNode,{childList:!0}),Ur(()=>r.disconnect())})}function cr(t,e){if(t.shapeFlag&128){const n=t.suspense;t=n.activeBranch,n.pendingBranch&&!n.isHydrating&&n.effects.push(()=>{cr(n.activeBranch,e)})}for(;t.component;)t=t.component.subTree;if(t.shapeFlag&1&&t.el)hr(t.el,e);else if(t.type===Ye)t.children.forEach(n=>cr(n,e));else if(t.type===ln){let{el:n,anchor:i}=t;for(;n&&(hr(n,e),n!==i);)n=n.nextSibling}}function hr(t,e){if(t.nodeType===1){const n=t.style;for(const i in e)n.setProperty(`--${i}`,e[i])}}const Mh=_e({patchProp:wh},lh);let Os;function Ph(){return Os||(Os=zc(Mh))}const Th=(...t)=>{const e=Ph().createApp(...t),{mount:n}=e;return e.mount=i=>{const r=Sh(i);if(!r)return;const s=e._component;!Y(s)&&!s.render&&!s.template&&(s.template=r.innerHTML),r.innerHTML="";const a=n(r,!1,r instanceof SVGElement);return r instanceof Element&&(r.removeAttribute("v-cloak"),r.setAttribute("data-v-app","")),a},e};function Sh(t){return we(t)?document.querySelector(t):t}/*!
  * vue-router v4.2.4
  * (c) 2023 Eduardo San Martin Morote
  * @license MIT
  */const Ft=typeof window<"u";function Ch(t){return t.__esModule||t[Symbol.toStringTag]==="Module"}const se=Object.assign;function Mi(t,e){const n={};for(const i in e){const r=e[i];n[i]=He(r)?r.map(t):t(r)}return n}const hn=()=>{},He=Array.isArray,Rh=/\/$/,Oh=t=>t.replace(Rh,"");function Pi(t,e,n="/"){let i,r={},s="",a="";const o=e.indexOf("#");let l=e.indexOf("?");return o<l&&o>=0&&(l=-1),l>-1&&(i=e.slice(0,l),s=e.slice(l+1,o>-1?o:e.length),r=t(s)),o>-1&&(i=i||e.slice(0,o),a=e.slice(o,e.length)),i=Dh(i??e,n),{fullPath:i+(s&&"?")+s+a,path:i,query:r,hash:a}}function Fh(t,e){const n=e.query?t(e.query):"";return e.path+(n&&"?")+n+(e.hash||"")}function Fs(t,e){return!e||!t.toLowerCase().startsWith(e.toLowerCase())?t:t.slice(e.length)||"/"}function Lh(t,e,n){const i=e.matched.length-1,r=n.matched.length-1;return i>-1&&i===r&&$t(e.matched[i],n.matched[r])&&Oo(e.params,n.params)&&t(e.query)===t(n.query)&&e.hash===n.hash}function $t(t,e){return(t.aliasOf||t)===(e.aliasOf||e)}function Oo(t,e){if(Object.keys(t).length!==Object.keys(e).length)return!1;for(const n in t)if(!Ih(t[n],e[n]))return!1;return!0}function Ih(t,e){return He(t)?Ls(t,e):He(e)?Ls(e,t):t===e}function Ls(t,e){return He(e)?t.length===e.length&&t.every((n,i)=>n===e[i]):t.length===1&&t[0]===e}function Dh(t,e){if(t.startsWith("/"))return t;if(!t)return e;const n=e.split("/"),i=t.split("/"),r=i[i.length-1];(r===".."||r===".")&&i.push("");let s=n.length-1,a,o;for(a=0;a<i.length;a++)if(o=i[a],o!==".")if(o==="..")s>1&&s--;else break;return n.slice(0,s).join("/")+"/"+i.slice(a-(a===i.length?1:0)).join("/")}var wn;(function(t){t.pop="pop",t.push="push"})(wn||(wn={}));var un;(function(t){t.back="back",t.forward="forward",t.unknown=""})(un||(un={}));function Uh(t){if(!t)if(Ft){const e=document.querySelector("base");t=e&&e.getAttribute("href")||"/",t=t.replace(/^\w+:\/\/[^\/]+/,"")}else t="/";return t[0]!=="/"&&t[0]!=="#"&&(t="/"+t),Oh(t)}const Bh=/^[^#]+#/;function zh(t,e){return t.replace(Bh,"#")+e}function Nh(t,e){const n=document.documentElement.getBoundingClientRect(),i=t.getBoundingClientRect();return{behavior:e.behavior,left:i.left-n.left-(e.left||0),top:i.top-n.top-(e.top||0)}}const di=()=>({left:window.pageXOffset,top:window.pageYOffset});function kh(t){let e;if("el"in t){const n=t.el,i=typeof n=="string"&&n.startsWith("#"),r=typeof n=="string"?i?document.getElementById(n.slice(1)):document.querySelector(n):n;if(!r)return;e=Nh(r,t)}else e=t;"scrollBehavior"in document.documentElement.style?window.scrollTo(e):window.scrollTo(e.left!=null?e.left:window.pageXOffset,e.top!=null?e.top:window.pageYOffset)}function Is(t,e){return(history.state?history.state.position-e:-1)+t}const ur=new Map;function $h(t,e){ur.set(t,e)}function Wh(t){const e=ur.get(t);return ur.delete(t),e}let jh=()=>location.protocol+"//"+location.host;function Fo(t,e){const{pathname:n,search:i,hash:r}=e,s=t.indexOf("#");if(s>-1){let o=r.includes(t.slice(s))?t.slice(s).length:1,l=r.slice(o);return l[0]!=="/"&&(l="/"+l),Fs(l,"")}return Fs(n,t)+i+r}function Vh(t,e,n,i){let r=[],s=[],a=null;const o=({state:f})=>{const d=Fo(t,location),p=n.value,m=e.value;let x=0;if(f){if(n.value=d,e.value=f,a&&a===p){a=null;return}x=m?f.position-m.position:0}else i(d);r.forEach(_=>{_(n.value,p,{delta:x,type:wn.pop,direction:x?x>0?un.forward:un.back:un.unknown})})};function l(){a=n.value}function h(f){r.push(f);const d=()=>{const p=r.indexOf(f);p>-1&&r.splice(p,1)};return s.push(d),d}function c(){const{history:f}=window;f.state&&f.replaceState(se({},f.state,{scroll:di()}),"")}function u(){for(const f of s)f();s=[],window.removeEventListener("popstate",o),window.removeEventListener("beforeunload",c)}return window.addEventListener("popstate",o),window.addEventListener("beforeunload",c,{passive:!0}),{pauseListeners:l,listen:h,destroy:u}}function Ds(t,e,n,i=!1,r=!1){return{back:t,current:e,forward:n,replaced:i,position:window.history.length,scroll:r?di():null}}function Hh(t){const{history:e,location:n}=window,i={value:Fo(t,n)},r={value:e.state};r.value||s(i.value,{back:null,current:i.value,forward:null,position:e.length-1,replaced:!0,scroll:null},!0);function s(l,h,c){const u=t.indexOf("#"),f=u>-1?(n.host&&document.querySelector("base")?t:t.slice(u))+l:jh()+t+l;try{e[c?"replaceState":"pushState"](h,"",f),r.value=h}catch(d){console.error(d),n[c?"replace":"assign"](f)}}function a(l,h){const c=se({},e.state,Ds(r.value.back,l,r.value.forward,!0),h,{position:r.value.position});s(l,c,!0),i.value=l}function o(l,h){const c=se({},r.value,e.state,{forward:l,scroll:di()});s(c.current,c,!0);const u=se({},Ds(i.value,l,null),{position:c.position+1},h);s(l,u,!1),i.value=l}return{location:i,state:r,push:o,replace:a}}function Gh(t){t=Uh(t);const e=Hh(t),n=Vh(t,e.state,e.location,e.replace);function i(s,a=!0){a||n.pauseListeners(),history.go(s)}const r=se({location:"",base:t,go:i,createHref:zh.bind(null,t)},e,n);return Object.defineProperty(r,"location",{enumerable:!0,get:()=>e.location.value}),Object.defineProperty(r,"state",{enumerable:!0,get:()=>e.state.value}),r}function Zh(t){return typeof t=="string"||t&&typeof t=="object"}function Lo(t){return typeof t=="string"||typeof t=="symbol"}const ct={path:"/",name:void 0,params:{},query:{},hash:"",fullPath:"/",matched:[],meta:{},redirectedFrom:void 0},Io=Symbol("");var Us;(function(t){t[t.aborted=4]="aborted",t[t.cancelled=8]="cancelled",t[t.duplicated=16]="duplicated"})(Us||(Us={}));function Wt(t,e){return se(new Error,{type:t,[Io]:!0},e)}function et(t,e){return t instanceof Error&&Io in t&&(e==null||!!(t.type&e))}const Bs="[^/]+?",qh={sensitive:!1,strict:!1,start:!0,end:!0},Xh=/[.+*?^${}()[\]/\\]/g;function Yh(t,e){const n=se({},qh,e),i=[];let r=n.start?"^":"";const s=[];for(const h of t){const c=h.length?[]:[90];n.strict&&!h.length&&(r+="/");for(let u=0;u<h.length;u++){const f=h[u];let d=40+(n.sensitive?.25:0);if(f.type===0)u||(r+="/"),r+=f.value.replace(Xh,"\\$&"),d+=40;else if(f.type===1){const{value:p,repeatable:m,optional:x,regexp:_}=f;s.push({name:p,repeatable:m,optional:x});const P=_||Bs;if(P!==Bs){d+=10;try{new RegExp(`(${P})`)}catch(b){throw new Error(`Invalid custom RegExp for param "${p}" (${P}): `+b.message)}}let w=m?`((?:${P})(?:/(?:${P}))*)`:`(${P})`;u||(w=x&&h.length<2?`(?:/${w})`:"/"+w),x&&(w+="?"),r+=w,d+=20,x&&(d+=-8),m&&(d+=-20),P===".*"&&(d+=-50)}c.push(d)}i.push(c)}if(n.strict&&n.end){const h=i.length-1;i[h][i[h].length-1]+=.7000000000000001}n.strict||(r+="/?"),n.end?r+="$":n.strict&&(r+="(?:/|$)");const a=new RegExp(r,n.sensitive?"":"i");function o(h){const c=h.match(a),u={};if(!c)return null;for(let f=1;f<c.length;f++){const d=c[f]||"",p=s[f-1];u[p.name]=d&&p.repeatable?d.split("/"):d}return u}function l(h){let c="",u=!1;for(const f of t){(!u||!c.endsWith("/"))&&(c+="/"),u=!1;for(const d of f)if(d.type===0)c+=d.value;else if(d.type===1){const{value:p,repeatable:m,optional:x}=d,_=p in h?h[p]:"";if(He(_)&&!m)throw new Error(`Provided param "${p}" is an array but it is not repeatable (* or + modifiers)`);const P=He(_)?_.join("/"):_;if(!P)if(x)f.length<2&&(c.endsWith("/")?c=c.slice(0,-1):u=!0);else throw new Error(`Missing required param "${p}"`);c+=P}}return c||"/"}return{re:a,score:i,keys:s,parse:o,stringify:l}}function Kh(t,e){let n=0;for(;n<t.length&&n<e.length;){const i=e[n]-t[n];if(i)return i;n++}return t.length<e.length?t.length===1&&t[0]===40+40?-1:1:t.length>e.length?e.length===1&&e[0]===40+40?1:-1:0}function Qh(t,e){let n=0;const i=t.score,r=e.score;for(;n<i.length&&n<r.length;){const s=Kh(i[n],r[n]);if(s)return s;n++}if(Math.abs(r.length-i.length)===1){if(zs(i))return 1;if(zs(r))return-1}return r.length-i.length}function zs(t){const e=t[t.length-1];return t.length>0&&e[e.length-1]<0}const Jh={type:0,value:""},e1=/[a-zA-Z0-9_]/;function t1(t){if(!t)return[[]];if(t==="/")return[[Jh]];if(!t.startsWith("/"))throw new Error(`Invalid path "${t}"`);function e(d){throw new Error(`ERR (${n})/"${h}": ${d}`)}let n=0,i=n;const r=[];let s;function a(){s&&r.push(s),s=[]}let o=0,l,h="",c="";function u(){h&&(n===0?s.push({type:0,value:h}):n===1||n===2||n===3?(s.length>1&&(l==="*"||l==="+")&&e(`A repeatable param (${h}) must be alone in its segment. eg: '/:ids+.`),s.push({type:1,value:h,regexp:c,repeatable:l==="*"||l==="+",optional:l==="*"||l==="?"})):e("Invalid state to consume buffer"),h="")}function f(){h+=l}for(;o<t.length;){if(l=t[o++],l==="\\"&&n!==2){i=n,n=4;continue}switch(n){case 0:l==="/"?(h&&u(),a()):l===":"?(u(),n=1):f();break;case 4:f(),n=i;break;case 1:l==="("?n=2:e1.test(l)?f():(u(),n=0,l!=="*"&&l!=="?"&&l!=="+"&&o--);break;case 2:l===")"?c[c.length-1]=="\\"?c=c.slice(0,-1)+l:n=3:c+=l;break;case 3:u(),n=0,l!=="*"&&l!=="?"&&l!=="+"&&o--,c="";break;default:e("Unknown state");break}}return n===2&&e(`Unfinished custom RegExp for param "${h}"`),u(),a(),r}function n1(t,e,n){const i=Yh(t1(t.path),n),r=se(i,{record:t,parent:e,children:[],alias:[]});return e&&!r.record.aliasOf==!e.record.aliasOf&&e.children.push(r),r}function i1(t,e){const n=[],i=new Map;e=$s({strict:!1,end:!0,sensitive:!1},e);function r(c){return i.get(c)}function s(c,u,f){const d=!f,p=r1(c);p.aliasOf=f&&f.record;const m=$s(e,c),x=[p];if("alias"in c){const w=typeof c.alias=="string"?[c.alias]:c.alias;for(const b of w)x.push(se({},p,{components:f?f.record.components:p.components,path:b,aliasOf:f?f.record:p}))}let _,P;for(const w of x){const{path:b}=w;if(u&&b[0]!=="/"){const M=u.record.path,C=M[M.length-1]==="/"?"":"/";w.path=u.record.path+(b&&C+b)}if(_=n1(w,u,m),f?f.alias.push(_):(P=P||_,P!==_&&P.alias.push(_),d&&c.name&&!ks(_)&&a(c.name)),p.children){const M=p.children;for(let C=0;C<M.length;C++)s(M[C],_,f&&f.children[C])}f=f||_,(_.record.components&&Object.keys(_.record.components).length||_.record.name||_.record.redirect)&&l(_)}return P?()=>{a(P)}:hn}function a(c){if(Lo(c)){const u=i.get(c);u&&(i.delete(c),n.splice(n.indexOf(u),1),u.children.forEach(a),u.alias.forEach(a))}else{const u=n.indexOf(c);u>-1&&(n.splice(u,1),c.record.name&&i.delete(c.record.name),c.children.forEach(a),c.alias.forEach(a))}}function o(){return n}function l(c){let u=0;for(;u<n.length&&Qh(c,n[u])>=0&&(c.record.path!==n[u].record.path||!Do(c,n[u]));)u++;n.splice(u,0,c),c.record.name&&!ks(c)&&i.set(c.record.name,c)}function h(c,u){let f,d={},p,m;if("name"in c&&c.name){if(f=i.get(c.name),!f)throw Wt(1,{location:c});m=f.record.name,d=se(Ns(u.params,f.keys.filter(P=>!P.optional).map(P=>P.name)),c.params&&Ns(c.params,f.keys.map(P=>P.name))),p=f.stringify(d)}else if("path"in c)p=c.path,f=n.find(P=>P.re.test(p)),f&&(d=f.parse(p),m=f.record.name);else{if(f=u.name?i.get(u.name):n.find(P=>P.re.test(u.path)),!f)throw Wt(1,{location:c,currentLocation:u});m=f.record.name,d=se({},u.params,c.params),p=f.stringify(d)}const x=[];let _=f;for(;_;)x.unshift(_.record),_=_.parent;return{name:m,path:p,params:d,matched:x,meta:a1(x)}}return t.forEach(c=>s(c)),{addRoute:s,resolve:h,removeRoute:a,getRoutes:o,getRecordMatcher:r}}function Ns(t,e){const n={};for(const i of e)i in t&&(n[i]=t[i]);return n}function r1(t){return{path:t.path,redirect:t.redirect,name:t.name,meta:t.meta||{},aliasOf:void 0,beforeEnter:t.beforeEnter,props:s1(t),children:t.children||[],instances:{},leaveGuards:new Set,updateGuards:new Set,enterCallbacks:{},components:"components"in t?t.components||null:t.component&&{default:t.component}}}function s1(t){const e={},n=t.props||!1;if("component"in t)e.default=n;else for(const i in t.components)e[i]=typeof n=="object"?n[i]:n;return e}function ks(t){for(;t;){if(t.record.aliasOf)return!0;t=t.parent}return!1}function a1(t){return t.reduce((e,n)=>se(e,n.meta),{})}function $s(t,e){const n={};for(const i in t)n[i]=i in e?e[i]:t[i];return n}function Do(t,e){return e.children.some(n=>n===t||Do(t,n))}const Uo=/#/g,o1=/&/g,l1=/\//g,c1=/=/g,h1=/\?/g,Bo=/\+/g,u1=/%5B/g,f1=/%5D/g,zo=/%5E/g,d1=/%60/g,No=/%7B/g,p1=/%7C/g,ko=/%7D/g,g1=/%20/g;function Wr(t){return encodeURI(""+t).replace(p1,"|").replace(u1,"[").replace(f1,"]")}function m1(t){return Wr(t).replace(No,"{").replace(ko,"}").replace(zo,"^")}function fr(t){return Wr(t).replace(Bo,"%2B").replace(g1,"+").replace(Uo,"%23").replace(o1,"%26").replace(d1,"`").replace(No,"{").replace(ko,"}").replace(zo,"^")}function v1(t){return fr(t).replace(c1,"%3D")}function b1(t){return Wr(t).replace(Uo,"%23").replace(h1,"%3F")}function x1(t){return t==null?"":b1(t).replace(l1,"%2F")}function Qn(t){try{return decodeURIComponent(""+t)}catch{}return""+t}function _1(t){const e={};if(t===""||t==="?")return e;const i=(t[0]==="?"?t.slice(1):t).split("&");for(let r=0;r<i.length;++r){const s=i[r].replace(Bo," "),a=s.indexOf("="),o=Qn(a<0?s:s.slice(0,a)),l=a<0?null:Qn(s.slice(a+1));if(o in e){let h=e[o];He(h)||(h=e[o]=[h]),h.push(l)}else e[o]=l}return e}function Ws(t){let e="";for(let n in t){const i=t[n];if(n=v1(n),i==null){i!==void 0&&(e+=(e.length?"&":"")+n);continue}(He(i)?i.map(s=>s&&fr(s)):[i&&fr(i)]).forEach(s=>{s!==void 0&&(e+=(e.length?"&":"")+n,s!=null&&(e+="="+s))})}return e}function y1(t){const e={};for(const n in t){const i=t[n];i!==void 0&&(e[n]=He(i)?i.map(r=>r==null?null:""+r):i==null?i:""+i)}return e}const w1=Symbol(""),js=Symbol(""),pi=Symbol(""),jr=Symbol(""),dr=Symbol("");function Jt(){let t=[];function e(i){return t.push(i),()=>{const r=t.indexOf(i);r>-1&&t.splice(r,1)}}function n(){t=[]}return{add:e,list:()=>t.slice(),reset:n}}function dt(t,e,n,i,r){const s=i&&(i.enterCallbacks[r]=i.enterCallbacks[r]||[]);return()=>new Promise((a,o)=>{const l=u=>{u===!1?o(Wt(4,{from:n,to:e})):u instanceof Error?o(u):Zh(u)?o(Wt(2,{from:e,to:u})):(s&&i.enterCallbacks[r]===s&&typeof u=="function"&&s.push(u),a())},h=t.call(i&&i.instances[r],e,n,l);let c=Promise.resolve(h);t.length<3&&(c=c.then(l)),c.catch(u=>o(u))})}function Ti(t,e,n,i){const r=[];for(const s of t)for(const a in s.components){let o=s.components[a];if(!(e!=="beforeRouteEnter"&&!s.instances[a]))if(E1(o)){const h=(o.__vccOpts||o)[e];h&&r.push(dt(h,n,i,s,a))}else{let l=o();r.push(()=>l.then(h=>{if(!h)return Promise.reject(new Error(`Couldn't resolve component "${a}" at "${s.path}"`));const c=Ch(h)?h.default:h;s.components[a]=c;const f=(c.__vccOpts||c)[e];return f&&dt(f,n,i,s,a)()}))}}return r}function E1(t){return typeof t=="object"||"displayName"in t||"props"in t||"__vccOpts"in t}function Vs(t){const e=Ve(pi),n=Ve(jr),i=ke(()=>e.resolve(Ut(t.to))),r=ke(()=>{const{matched:l}=i.value,{length:h}=l,c=l[h-1],u=n.matched;if(!c||!u.length)return-1;const f=u.findIndex($t.bind(null,c));if(f>-1)return f;const d=Hs(l[h-2]);return h>1&&Hs(c)===d&&u[u.length-1].path!==d?u.findIndex($t.bind(null,l[h-2])):f}),s=ke(()=>r.value>-1&&T1(n.params,i.value.params)),a=ke(()=>r.value>-1&&r.value===n.matched.length-1&&Oo(n.params,i.value.params));function o(l={}){return P1(l)?e[Ut(t.replace)?"replace":"push"](Ut(t.to)).catch(hn):Promise.resolve()}return{route:i,href:ke(()=>i.value.href),isActive:s,isExactActive:a,navigate:o}}const A1=po({name:"RouterLink",compatConfig:{MODE:3},props:{to:{type:[String,Object],required:!0},replace:Boolean,activeClass:String,exactActiveClass:String,custom:Boolean,ariaCurrentValue:{type:String,default:"page"}},useLink:Vs,setup(t,{slots:e}){const n=oi(Vs(t)),{options:i}=Ve(pi),r=ke(()=>({[Gs(t.activeClass,i.linkActiveClass,"router-link-active")]:n.isActive,[Gs(t.exactActiveClass,i.linkExactActiveClass,"router-link-exact-active")]:n.isExactActive}));return()=>{const s=e.default&&e.default(n);return t.custom?s:Ro("a",{"aria-current":n.isExactActive?t.ariaCurrentValue:null,href:n.href,onClick:n.navigate,class:r.value},s)}}}),M1=A1;function P1(t){if(!(t.metaKey||t.altKey||t.ctrlKey||t.shiftKey)&&!t.defaultPrevented&&!(t.button!==void 0&&t.button!==0)){if(t.currentTarget&&t.currentTarget.getAttribute){const e=t.currentTarget.getAttribute("target");if(/\b_blank\b/i.test(e))return}return t.preventDefault&&t.preventDefault(),!0}}function T1(t,e){for(const n in e){const i=e[n],r=t[n];if(typeof i=="string"){if(i!==r)return!1}else if(!He(r)||r.length!==i.length||i.some((s,a)=>s!==r[a]))return!1}return!0}function Hs(t){return t?t.aliasOf?t.aliasOf.path:t.path:""}const Gs=(t,e,n)=>t??e??n,S1=po({name:"RouterView",inheritAttrs:!1,props:{name:{type:String,default:"default"},route:Object},compatConfig:{MODE:3},setup(t,{attrs:e,slots:n}){const i=Ve(dr),r=ke(()=>t.route||i.value),s=Ve(js,0),a=ke(()=>{let h=Ut(s);const{matched:c}=r.value;let u;for(;(u=c[h])&&!u.components;)h++;return h}),o=ke(()=>r.value.matched[a.value]);Vn(js,ke(()=>a.value+1)),Vn(w1,o),Vn(dr,r);const l=an();return Wn(()=>[l.value,o.value,t.name],([h,c,u],[f,d,p])=>{c&&(c.instances[u]=h,d&&d!==c&&h&&h===f&&(c.leaveGuards.size||(c.leaveGuards=d.leaveGuards),c.updateGuards.size||(c.updateGuards=d.updateGuards))),h&&c&&(!d||!$t(c,d)||!f)&&(c.enterCallbacks[u]||[]).forEach(m=>m(h))},{flush:"post"}),()=>{const h=r.value,c=t.name,u=o.value,f=u&&u.components[c];if(!f)return Zs(n.default,{Component:f,route:h});const d=u.props[c],p=d?d===!0?h.params:typeof d=="function"?d(h):d:null,x=Ro(f,se({},p,e,{onVnodeUnmounted:_=>{_.component.isUnmounted&&(u.instances[c]=null)},ref:l}));return Zs(n.default,{Component:x,route:h})||x}}});function Zs(t,e){if(!t)return null;const n=t(e);return n.length===1?n[0]:n}const C1=S1;function R1(t){const e=i1(t.routes,t),n=t.parseQuery||_1,i=t.stringifyQuery||Ws,r=t.history,s=Jt(),a=Jt(),o=Jt(),l=Gl(ct);let h=ct;Ft&&t.scrollBehavior&&"scrollRestoration"in history&&(history.scrollRestoration="manual");const c=Mi.bind(null,T=>""+T),u=Mi.bind(null,x1),f=Mi.bind(null,Qn);function d(T,k){let U,W;return Lo(T)?(U=e.getRecordMatcher(T),W=k):W=T,e.addRoute(W,U)}function p(T){const k=e.getRecordMatcher(T);k&&e.removeRoute(k)}function m(){return e.getRoutes().map(T=>T.record)}function x(T){return!!e.getRecordMatcher(T)}function _(T,k){if(k=se({},k||l.value),typeof T=="string"){const y=Pi(n,T,k.path),S=e.resolve({path:y.path},k),O=r.createHref(y.fullPath);return se(y,S,{params:f(S.params),hash:Qn(y.hash),redirectedFrom:void 0,href:O})}let U;if("path"in T)U=se({},T,{path:Pi(n,T.path,k.path).path});else{const y=se({},T.params);for(const S in y)y[S]==null&&delete y[S];U=se({},T,{params:u(y)}),k.params=u(k.params)}const W=e.resolve(U,k),J=T.hash||"";W.params=c(f(W.params));const g=Fh(i,se({},T,{hash:m1(J),path:W.path})),v=r.createHref(g);return se({fullPath:g,hash:J,query:i===Ws?y1(T.query):T.query||{}},W,{redirectedFrom:void 0,href:v})}function P(T){return typeof T=="string"?Pi(n,T,l.value.path):se({},T)}function w(T,k){if(h!==T)return Wt(8,{from:k,to:T})}function b(T){return Z(T)}function M(T){return b(se(P(T),{replace:!0}))}function C(T){const k=T.matched[T.matched.length-1];if(k&&k.redirect){const{redirect:U}=k;let W=typeof U=="function"?U(T):U;return typeof W=="string"&&(W=W.includes("?")||W.includes("#")?W=P(W):{path:W},W.params={}),se({query:T.query,hash:T.hash,params:"path"in W?{}:T.params},W)}}function Z(T,k){const U=h=_(T),W=l.value,J=T.state,g=T.force,v=T.replace===!0,y=C(U);if(y)return Z(se(P(y),{state:typeof y=="object"?se({},J,y.state):J,force:g,replace:v}),k||U);const S=U;S.redirectedFrom=k;let O;return!g&&Lh(i,W,U)&&(O=Wt(16,{to:S,from:W}),fe(W,W,!0,!1)),(O?Promise.resolve(O):Q(S,W)).catch(F=>et(F)?et(F,2)?F:ye(F):j(F,S,W)).then(F=>{if(F){if(et(F,2))return Z(se({replace:v},P(F.to),{state:typeof F.to=="object"?se({},J,F.to.state):J,force:g}),k||S)}else F=G(S,W,!0,v,J);return ne(S,W,F),F})}function te(T,k){const U=w(T,k);return U?Promise.reject(U):Promise.resolve()}function re(T){const k=De.values().next().value;return k&&typeof k.runWithContext=="function"?k.runWithContext(T):T()}function Q(T,k){let U;const[W,J,g]=O1(T,k);U=Ti(W.reverse(),"beforeRouteLeave",T,k);for(const y of W)y.leaveGuards.forEach(S=>{U.push(dt(S,T,k))});const v=te.bind(null,T,k);return U.push(v),be(U).then(()=>{U=[];for(const y of s.list())U.push(dt(y,T,k));return U.push(v),be(U)}).then(()=>{U=Ti(J,"beforeRouteUpdate",T,k);for(const y of J)y.updateGuards.forEach(S=>{U.push(dt(S,T,k))});return U.push(v),be(U)}).then(()=>{U=[];for(const y of g)if(y.beforeEnter)if(He(y.beforeEnter))for(const S of y.beforeEnter)U.push(dt(S,T,k));else U.push(dt(y.beforeEnter,T,k));return U.push(v),be(U)}).then(()=>(T.matched.forEach(y=>y.enterCallbacks={}),U=Ti(g,"beforeRouteEnter",T,k),U.push(v),be(U))).then(()=>{U=[];for(const y of a.list())U.push(dt(y,T,k));return U.push(v),be(U)}).catch(y=>et(y,8)?y:Promise.reject(y))}function ne(T,k,U){o.list().forEach(W=>re(()=>W(T,k,U)))}function G(T,k,U,W,J){const g=w(T,k);if(g)return g;const v=k===ct,y=Ft?history.state:{};U&&(W||v?r.replace(T.fullPath,se({scroll:v&&y&&y.scroll},J)):r.push(T.fullPath,J)),l.value=T,fe(T,k,U,v),ye()}let A;function I(){A||(A=r.listen((T,k,U)=>{if(!Ge.listening)return;const W=_(T),J=C(W);if(J){Z(se(J,{replace:!0}),W).catch(hn);return}h=W;const g=l.value;Ft&&$h(Is(g.fullPath,U.delta),di()),Q(W,g).catch(v=>et(v,12)?v:et(v,2)?(Z(v.to,W).then(y=>{et(y,20)&&!U.delta&&U.type===wn.pop&&r.go(-1,!1)}).catch(hn),Promise.reject()):(U.delta&&r.go(-U.delta,!1),j(v,W,g))).then(v=>{v=v||G(W,g,!1),v&&(U.delta&&!et(v,8)?r.go(-U.delta,!1):U.type===wn.pop&&et(v,20)&&r.go(-1,!1)),ne(W,g,v)}).catch(hn)}))}let E=Jt(),R=Jt(),z;function j(T,k,U){ye(T);const W=R.list();return W.length?W.forEach(J=>J(T,k,U)):console.error(T),Promise.reject(T)}function le(){return z&&l.value!==ct?Promise.resolve():new Promise((T,k)=>{E.add([T,k])})}function ye(T){return z||(z=!T,I(),E.list().forEach(([k,U])=>T?U(T):k()),E.reset()),T}function fe(T,k,U,W){const{scrollBehavior:J}=t;if(!Ft||!J)return Promise.resolve();const g=!U&&Wh(Is(T.fullPath,0))||(W||!U)&&history.state&&history.state.scroll||null;return ao().then(()=>J(T,k,g)).then(v=>v&&kh(v)).catch(v=>j(v,T,k))}const de=T=>r.go(T);let Fe;const De=new Set,Ge={currentRoute:l,listening:!0,addRoute:d,removeRoute:p,hasRoute:x,getRoutes:m,resolve:_,options:t,push:b,replace:M,go:de,back:()=>de(-1),forward:()=>de(1),beforeEach:s.add,beforeResolve:a.add,afterEach:o.add,onError:R.add,isReady:le,install(T){const k=this;T.component("RouterLink",M1),T.component("RouterView",C1),T.config.globalProperties.$router=k,Object.defineProperty(T.config.globalProperties,"$route",{enumerable:!0,get:()=>Ut(l)}),Ft&&!Fe&&l.value===ct&&(Fe=!0,b(r.location).catch(J=>{}));const U={};for(const J in ct)Object.defineProperty(U,J,{get:()=>l.value[J],enumerable:!0});T.provide(pi,k),T.provide(jr,Ka(U)),T.provide(dr,l);const W=T.unmount;De.add(T),T.unmount=function(){De.delete(T),De.size<1&&(h=ct,A&&A(),A=null,l.value=ct,Fe=!1,z=!1),W()}}};function be(T){return T.reduce((k,U)=>k.then(()=>re(U)),Promise.resolve())}return Ge}function O1(t,e){const n=[],i=[],r=[],s=Math.max(e.matched.length,t.matched.length);for(let a=0;a<s;a++){const o=e.matched[a];o&&(t.matched.find(h=>$t(h,o))?i.push(o):n.push(o));const l=t.matched[a];l&&(e.matched.find(h=>$t(h,l))||r.push(l))}return[n,i,r]}function F1(){return Ve(pi)}function L1(){return Ve(jr)}Date.now=Date.now||function(){return new Date().getTime()};if(typeof window<"u"&&("performance"in window||(window.performance={}),!("now"in window.performance))){var qs=Date.now();performance.timing&&performance.timing.navigationStart&&(qs=performance.timing.navigationStart),window.performance.now=function(){return Date.now()-qs}}class I1{constructor(){this.funcs={},this.lastPass={},this.framerates={},this.nextFramePendingFuncs=[],this.nextFrameFuncs=[],this.postFrameFuncs=[],this.dt=1/0,this.timeElapsed=0,this.frame=0,this.dictonary=[],this.last=performance.now(),this.initTime=performance.now(),this.isBlurred=!1,this.onBefore=function(){},this.onAfter=function(){},typeof window<"u"&&this.init()}subscribe(e,n,i=null){this.funcs[e]||(this.dictonary.push(e),this.funcs[e]=n,this.lastPass[e]=Date.now(),i!==null?this.framerates[e]=1/i:this.framerates[e]=i)}unsubscribe(e){this.funcs[e]&&(this.dictonary.splice(this.dictonary.indexOf(e),1),delete this.funcs[e])}init(){window.addEventListener("focus",()=>{this.last=performance.now()}),window.addEventListener("visibilitychange",e=>{document.visibilityState==="visible"?this.isBlurred=!1:this.isBlurred=!0}),this.update=this.update.bind(this),this.update()}nextFrame(e){this.nextFramePendingFuncs.push(e)}postFrame(e){this.postFrameFuncs.push(e)}update(){if(requestAnimationFrame(this.update),this.isBlurred)return;for(this.onBefore(),this.frame++,this.dt=performance.now()-this.last,this.timeElapsed+=this.dt;this.nextFrameFuncs.length>0;)this.nextFrameFuncs.splice(0,1)[0]();for(;this.nextFramePendingFuncs.length>0;)this.nextFrameFuncs.push(this.nextFramePendingFuncs.splice(0,1)[0]);let e=Date.now();for(let n=0;n<this.dictonary.length;n++)this.framerates[this.dictonary[n]]!==null&&e-this.lastPass[this.dictonary[n]]<this.framerates[this.dictonary[n]]*1e3||typeof this.funcs[this.dictonary[n]]=="function"&&(this.lastPass[this.dictonary[n]]=e,this.funcs[this.dictonary[n]]());for(;this.postFrameFuncs.length>0;)this.postFrameFuncs.splice(0,1)[0]();this.onAfter(),this.last=performance.now()}}const at=new I1;function $o(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var pr={exports:{}},Wo={exports:{}},D1=void 0,jo=function(t){return t!==D1&&t!==null},U1=jo,B1={object:!0,function:!0,undefined:!0},z1=function(t){return U1(t)?hasOwnProperty.call(B1,typeof t):!1},N1=z1,k1=function(t){if(!N1(t))return!1;try{return t.constructor?t.constructor.prototype===t:!1}catch{return!1}},$1=k1,W1=function(t){if(typeof t!="function"||!hasOwnProperty.call(t,"length"))return!1;try{if(typeof t.length!="number"||typeof t.call!="function"||typeof t.apply!="function")return!1}catch{return!1}return!$1(t)},j1=W1,V1=/^\s*class[\s{/}]/,H1=Function.prototype.toString,G1=function(t){return!(!j1(t)||V1.test(H1.call(t)))},Z1=function(){var t=Object.assign,e;return typeof t!="function"?!1:(e={foo:"raz"},t(e,{bar:"dwa"},{trzy:"trzy"}),e.foo+e.bar+e.trzy==="razdwatrzy")},Si,Xs;function q1(){return Xs||(Xs=1,Si=function(){try{return Object.keys("primitive"),!0}catch{return!1}}),Si}var X1=function(){},Y1=X1(),Vr=function(t){return t!==Y1&&t!==null},Ci,Ys;function K1(){if(Ys)return Ci;Ys=1;var t=Vr,e=Object.keys;return Ci=function(n){return e(t(n)?Object(n):n)},Ci}var Ri,Ks;function Q1(){return Ks||(Ks=1,Ri=q1()()?Object.keys:K1()),Ri}var Oi,Qs;function J1(){if(Qs)return Oi;Qs=1;var t=Vr;return Oi=function(e){if(!t(e))throw new TypeError("Cannot use null or undefined");return e},Oi}var Fi,Js;function eu(){if(Js)return Fi;Js=1;var t=Q1(),e=J1(),n=Math.max;return Fi=function(i,r){var s,a,o=n(arguments.length,2),l;for(i=Object(e(i)),l=function(h){try{i[h]=r[h]}catch(c){s||(s=c)}},a=1;a<o;++a)r=arguments[a],t(r).forEach(l);if(s!==void 0)throw s;return i},Fi}var tu=Z1()?Object.assign:eu(),nu=Vr,iu=Array.prototype.forEach,ru=Object.create,su=function(t,e){var n;for(n in t)e[n]=t[n]},au=function(t){var e=ru(null);return iu.call(arguments,function(n){nu(n)&&su(Object(n),e)}),e},Li="razdwatrzy",ou=function(){return typeof Li.contains!="function"?!1:Li.contains("dwa")===!0&&Li.contains("foo")===!1},Ii,ea;function lu(){if(ea)return Ii;ea=1;var t=String.prototype.indexOf;return Ii=function(e){return t.call(this,e,arguments[1])>-1},Ii}var cu=ou()?String.prototype.contains:lu(),Gn=jo,ta=G1,Vo=tu,Ho=au,fn=cu,hu=Wo.exports=function(t,e){var n,i,r,s,a;return arguments.length<2||typeof t!="string"?(s=e,e=t,t=null):s=arguments[2],Gn(t)?(n=fn.call(t,"c"),i=fn.call(t,"e"),r=fn.call(t,"w")):(n=r=!0,i=!1),a={value:e,configurable:n,enumerable:i,writable:r},s?Vo(Ho(s),a):a};hu.gs=function(t,e,n){var i,r,s,a;return typeof t!="string"?(s=n,n=e,e=t,t=null):s=arguments[3],Gn(e)?ta(e)?Gn(n)?ta(n)||(s=n,n=void 0):n=void 0:(s=e,e=n=void 0):e=void 0,Gn(t)?(i=fn.call(t,"c"),r=fn.call(t,"e")):(i=!0,r=!1),a={get:e,set:n,configurable:i,enumerable:r},s?Vo(Ho(s),a):a};var uu=Wo.exports,fu=function(t){if(typeof t!="function")throw new TypeError(t+" is not a function");return t};(function(t,e){var n=uu,i=fu,r=Function.prototype.apply,s=Function.prototype.call,a=Object.create,o=Object.defineProperty,l=Object.defineProperties,h=Object.prototype.hasOwnProperty,c={configurable:!0,enumerable:!1,writable:!0},u,f,d,p,m,x,_;u=function(P,w){var b;return i(w),h.call(this,"__ee__")?b=this.__ee__:(b=c.value=a(null),o(this,"__ee__",c),c.value=null),b[P]?typeof b[P]=="object"?b[P].push(w):b[P]=[b[P],w]:b[P]=w,this},f=function(P,w){var b,M;return i(w),M=this,u.call(this,P,b=function(){d.call(M,P,b),r.call(w,this,arguments)}),b.__eeOnceListener__=w,this},d=function(P,w){var b,M,C,Z;if(i(w),!h.call(this,"__ee__"))return this;if(b=this.__ee__,!b[P])return this;if(M=b[P],typeof M=="object")for(Z=0;C=M[Z];++Z)(C===w||C.__eeOnceListener__===w)&&(M.length===2?b[P]=M[Z?0:1]:M.splice(Z,1));else(M===w||M.__eeOnceListener__===w)&&delete b[P];return this},p=function(P){var w,b,M,C,Z;if(h.call(this,"__ee__")&&(C=this.__ee__[P],!!C))if(typeof C=="object"){for(b=arguments.length,Z=new Array(b-1),w=1;w<b;++w)Z[w-1]=arguments[w];for(C=C.slice(),w=0;M=C[w];++w)r.call(M,this,Z)}else switch(arguments.length){case 1:s.call(C,this);break;case 2:s.call(C,this,arguments[1]);break;case 3:s.call(C,this,arguments[1],arguments[2]);break;default:for(b=arguments.length,Z=new Array(b-1),w=1;w<b;++w)Z[w-1]=arguments[w];r.call(C,this,Z)}},m={on:u,once:f,off:d,emit:p},x={on:n(u),once:n(f),off:n(d),emit:n(p)},_=l({},x),t.exports=e=function(P){return P==null?a(_):l(Object(P),x)},e.methods=m})(pr,pr.exports);var du=pr.exports;const Tn=$o(du);var pu=1e-6,Pe=typeof Float32Array<"u"?Float32Array:Array;Math.hypot||(Math.hypot=function(){for(var t=0,e=arguments.length;e--;)t+=arguments[e]*arguments[e];return Math.sqrt(t)});function Go(){var t=new Pe(9);return Pe!=Float32Array&&(t[1]=0,t[2]=0,t[3]=0,t[5]=0,t[6]=0,t[7]=0),t[0]=1,t[4]=1,t[8]=1,t}function jt(){var t=new Pe(16);return Pe!=Float32Array&&(t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0),t[0]=1,t[5]=1,t[10]=1,t[15]=1,t}function gu(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}function mu(t,e,n){var i=e[0],r=e[1],s=e[2],a=e[3],o=e[4],l=e[5],h=e[6],c=e[7],u=e[8],f=e[9],d=e[10],p=e[11],m=e[12],x=e[13],_=e[14],P=e[15],w=n[0],b=n[1],M=n[2],C=n[3];return t[0]=w*i+b*o+M*u+C*m,t[1]=w*r+b*l+M*f+C*x,t[2]=w*s+b*h+M*d+C*_,t[3]=w*a+b*c+M*p+C*P,w=n[4],b=n[5],M=n[6],C=n[7],t[4]=w*i+b*o+M*u+C*m,t[5]=w*r+b*l+M*f+C*x,t[6]=w*s+b*h+M*d+C*_,t[7]=w*a+b*c+M*p+C*P,w=n[8],b=n[9],M=n[10],C=n[11],t[8]=w*i+b*o+M*u+C*m,t[9]=w*r+b*l+M*f+C*x,t[10]=w*s+b*h+M*d+C*_,t[11]=w*a+b*c+M*p+C*P,w=n[12],b=n[13],M=n[14],C=n[15],t[12]=w*i+b*o+M*u+C*m,t[13]=w*r+b*l+M*f+C*x,t[14]=w*s+b*h+M*d+C*_,t[15]=w*a+b*c+M*p+C*P,t}function Dn(t,e,n,i){var r=e[0],s=e[1],a=e[2],o=e[3],l=r+r,h=s+s,c=a+a,u=r*l,f=r*h,d=r*c,p=s*h,m=s*c,x=a*c,_=o*l,P=o*h,w=o*c,b=i[0],M=i[1],C=i[2];return t[0]=(1-(p+x))*b,t[1]=(f+w)*b,t[2]=(d-P)*b,t[3]=0,t[4]=(f-w)*M,t[5]=(1-(u+x))*M,t[6]=(m+_)*M,t[7]=0,t[8]=(d+P)*C,t[9]=(m-_)*C,t[10]=(1-(u+p))*C,t[11]=0,t[12]=n[0],t[13]=n[1],t[14]=n[2],t[15]=1,t}var na=mu;function nt(){var t=new Pe(3);return Pe!=Float32Array&&(t[0]=0,t[1]=0,t[2]=0),t}function Un(t){var e=new Pe(3);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e}function vu(t){var e=t[0],n=t[1],i=t[2];return Math.hypot(e,n,i)}function Se(t,e,n){var i=new Pe(3);return i[0]=t,i[1]=e,i[2]=n,i}function ia(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t}function dn(t,e,n){return t[0]=e[0]+n[0],t[1]=e[1]+n[1],t[2]=e[2]+n[2],t}function gr(t,e,n){return t[0]=e[0]-n[0],t[1]=e[1]-n[1],t[2]=e[2]-n[2],t}function bu(t,e,n){return t[0]=e[0]*n[0],t[1]=e[1]*n[1],t[2]=e[2]*n[2],t}function pn(t,e,n){return t[0]=e[0]*n,t[1]=e[1]*n,t[2]=e[2]*n,t}function En(t,e){var n=e[0],i=e[1],r=e[2],s=n*n+i*i+r*r;return s>0&&(s=1/Math.sqrt(s)),t[0]=e[0]*s,t[1]=e[1]*s,t[2]=e[2]*s,t}function xu(t,e){return t[0]*e[0]+t[1]*e[1]+t[2]*e[2]}function Pt(t,e,n){var i=e[0],r=e[1],s=e[2],a=n[0],o=n[1],l=n[2];return t[0]=r*l-s*o,t[1]=s*a-i*l,t[2]=i*o-r*a,t}function Di(t){return t[0]=0,t[1]=0,t[2]=0,t}var Jn=gr,Ui=bu,_u=vu;(function(){var t=nt();return function(e,n,i,r,s,a){var o,l;for(n||(n=3),i||(i=0),r?l=Math.min(r*n+i,e.length):l=e.length,o=i;o<l;o+=n)t[0]=e[o],t[1]=e[o+1],t[2]=e[o+2],s(t,t,a),e[o]=t[0],e[o+1]=t[1],e[o+2]=t[2];return e}})();function yu(){var t=new Pe(4);return Pe!=Float32Array&&(t[0]=0,t[1]=0,t[2]=0,t[3]=0),t}function wu(t,e){var n=e[0],i=e[1],r=e[2],s=e[3],a=n*n+i*i+r*r+s*s;return a>0&&(a=1/Math.sqrt(a)),t[0]=n*a,t[1]=i*a,t[2]=r*a,t[3]=s*a,t}(function(){var t=yu();return function(e,n,i,r,s,a){var o,l;for(n||(n=4),i||(i=0),r?l=Math.min(r*n+i,e.length):l=e.length,o=i;o<l;o+=n)t[0]=e[o],t[1]=e[o+1],t[2]=e[o+2],t[3]=e[o+3],s(t,t,a),e[o]=t[0],e[o+1]=t[1],e[o+2]=t[2],e[o+3]=t[3];return e}})();function An(){var t=new Pe(4);return Pe!=Float32Array&&(t[0]=0,t[1]=0,t[2]=0),t[3]=1,t}function Eu(t,e,n){n=n*.5;var i=Math.sin(n);return t[0]=i*e[0],t[1]=i*e[1],t[2]=i*e[2],t[3]=Math.cos(n),t}function ra(t,e,n){n*=.5;var i=e[0],r=e[1],s=e[2],a=e[3],o=Math.sin(n),l=Math.cos(n);return t[0]=i*l+a*o,t[1]=r*l+s*o,t[2]=s*l-r*o,t[3]=a*l-i*o,t}function sa(t,e,n){n*=.5;var i=e[0],r=e[1],s=e[2],a=e[3],o=Math.sin(n),l=Math.cos(n);return t[0]=i*l-s*o,t[1]=r*l+a*o,t[2]=s*l+i*o,t[3]=a*l-r*o,t}function aa(t,e,n){n*=.5;var i=e[0],r=e[1],s=e[2],a=e[3],o=Math.sin(n),l=Math.cos(n);return t[0]=i*l+r*o,t[1]=r*l-i*o,t[2]=s*l+a*o,t[3]=a*l-s*o,t}function Bi(t,e,n,i){var r=e[0],s=e[1],a=e[2],o=e[3],l=n[0],h=n[1],c=n[2],u=n[3],f,d,p,m,x;return d=r*l+s*h+a*c+o*u,d<0&&(d=-d,l=-l,h=-h,c=-c,u=-u),1-d>pu?(f=Math.acos(d),p=Math.sin(f),m=Math.sin((1-i)*f)/p,x=Math.sin(i*f)/p):(m=1-i,x=i),t[0]=m*r+x*l,t[1]=m*s+x*h,t[2]=m*a+x*c,t[3]=m*o+x*u,t}function Zo(t,e){var n=e[0]+e[4]+e[8],i;if(n>0)i=Math.sqrt(n+1),t[3]=.5*i,i=.5/i,t[0]=(e[5]-e[7])*i,t[1]=(e[6]-e[2])*i,t[2]=(e[1]-e[3])*i;else{var r=0;e[4]>e[0]&&(r=1),e[8]>e[r*3+r]&&(r=2);var s=(r+1)%3,a=(r+2)%3;i=Math.sqrt(e[r*3+r]-e[s*3+s]-e[a*3+a]+1),t[r]=.5*i,i=.5/i,t[3]=(e[s*3+a]-e[a*3+s])*i,t[s]=(e[s*3+r]+e[r*3+s])*i,t[a]=(e[a*3+r]+e[r*3+a])*i}return t}var qo=wu;(function(){var t=nt(),e=Se(1,0,0),n=Se(0,1,0);return function(i,r,s){var a=xu(r,s);return a<-.999999?(Pt(t,e,r),_u(t)<1e-6&&Pt(t,n,r),En(t,t),Eu(i,t,Math.PI),i):a>.999999?(i[0]=0,i[1]=0,i[2]=0,i[3]=1,i):(Pt(t,r,s),i[0]=t[0],i[1]=t[1],i[2]=t[2],i[3]=1+a,qo(i,i))}})();(function(){var t=An(),e=An();return function(n,i,r,s,a,o){return Bi(t,i,a,o),Bi(e,r,s,o),Bi(n,t,e,2*o*(1-o)),n}})();(function(){var t=Go();return function(e,n,i,r){return t[0]=i[0],t[3]=i[1],t[6]=i[2],t[1]=r[0],t[4]=r[1],t[7]=r[2],t[2]=-n[0],t[5]=-n[1],t[8]=-n[2],qo(e,Zo(e,t))}})();function Hr(){var t=new Pe(2);return Pe!=Float32Array&&(t[0]=0,t[1]=0),t}function Xe(t,e){var n=new Pe(2);return n[0]=t,n[1]=e,n}function Au(t,e,n){return t[0]=e[0]+n[0],t[1]=e[1]+n[1],t}function Mu(t,e,n){return t[0]=e[0]-n[0],t[1]=e[1]-n[1],t}function Pu(t,e,n){return t[0]=e[0]*n,t[1]=e[1]*n,t}function Tu(t,e){var n=e[0]-t[0],i=e[1]-t[1];return Math.hypot(n,i)}var Su=Mu,Cu=Tu;(function(){var t=Hr();return function(e,n,i,r,s,a){var o,l;for(n||(n=2),i||(i=0),r?l=Math.min(r*n+i,e.length):l=e.length,o=i;o<l;o+=n)t[0]=e[o],t[1]=e[o+1],s(t,t,a),e[o]=t[0],e[o+1]=t[1];return e}})();const gi=Go(),Bn=new Float32Array(gi.buffer,0*4,3),Ru=new Float32Array(gi.buffer,3*4,3),Ot=new Float32Array(gi.buffer,6*4,3),Ou=Se(0,1,0),zi=An(),ht=nt();class Gr{constructor(e=!1){return this.parent=null,this.children=[],this.position=Se(0,0,0),this.positionDamped=Se(0,0,0),this.scale=Se(1,1,1),this.rotation=Se(0,0,0),this.rotationDamped=Se(0,0,0),this.quaternion=An(),this.matrix=jt(),this.lmatrix=jt(),this.damped=!1,this.dampedRot=!1,this.damping=.03,this.rotDamping=.03,this.lookAtNode=null,this.needUpdate=!0,this.forceUpdate=!1,this.manualRot=!1,this.isCamera=e,at.nextFrame(()=>{this.getMatrix()}),this}setPosition(e,n,i){this.needUpdate=!0,this.position[0]=e,this.position[1]=n,this.position[2]=i}setRotation(e,n,i){this.needUpdate=!0,this.rotation[0]=e,this.rotation[1]=n,this.rotation[2]=i}setScale(e){this.needUpdate=!0,this.scale[0]=e,this.scale[1]=e,this.scale[2]=e}activateDamping(e){this.positionDamped=Un(this.position),this.damped=!0,this.damping=e,this.needUpdate=!0,this.getMatrix()}registerNodeToLookAt(e){this.lookAtNode=e,this.needUpdate=!0}lookAt(e){this.damped?gr(Ot,this.positionDamped,e):gr(Ot,this.position,e),En(Ot,Ot),Pt(Bn,Ou,Ot),En(Bn,Bn),Pt(Ru,Ot,Bn),Zo(zi,gi),this.damped?Dn(this.matrix,zi,this.positionDamped,this.scale):Dn(this.matrix,zi,this.position,this.scale),this.parent!==null&&na(this.matrix,this.parent.getMatrix(),this.matrix),this.needUpdate=!1}getMatrix(){return!this.forceUpdate&&!this.needUpdate&&!this.damped&&this.lookAtNode==null?this.matrix:(gu(this.matrix),this.manualRot==!1&&(this.quaternion=An(),this.dampedRot?(Jn(ht,this.rotation,this.rotationDamped),pn(ht,ht,this.rotDamping),dn(this.rotationDamped,this.rotationDamped,ht),sa(this.quaternion,this.quaternion,this.rotationDamped[1]),ra(this.quaternion,this.quaternion,this.rotationDamped[0]),aa(this.quaternion,this.quaternion,this.rotationDamped[2])):(sa(this.quaternion,this.quaternion,this.rotation[1]),ra(this.quaternion,this.quaternion,this.rotation[0]),aa(this.quaternion,this.quaternion,this.rotation[2]))),this.damped?(Jn(ht,this.position,this.positionDamped),pn(ht,ht,this.damping),dn(this.positionDamped,this.positionDamped,ht),Dn(this.matrix,this.quaternion,this.positionDamped,this.scale)):Dn(this.matrix,this.quaternion,this.position,this.scale),this.parent!==null&&na(this.matrix,this.parent.getMatrix(),this.matrix),this.lookAtNode!==null&&(this.lookAtNode.getMatrix(),this.lookAtNode.damped?this.lookAt(this.lookAtNode.positionDamped):this.lookAt(this.lookAtNode.position),at.postFrame(()=>{this.needUpdate=!0})),this.needUpdate=!1,this.matrix)}getChildByName(e){for(let n=0;n<this.children.length;n++){const i=this.children[n];if(i.name&&i.name===e)return i}}addChildNode(e){this.children.push(e),e.parent=this}fromPositionRotationScale(e,n,i){return this.position=Un(e),this.scale=Un(i),this.rotation=Un(n),this}}const Mn=window.navigator.userAgent;navigator.userAgent.indexOf("Firefox")>-1;window.opr&&opr.addons||window.opera||navigator.userAgent.indexOf(" OPR/")>=0;window.chrome&&(window.chrome.webstore||window.chrome.runtime);const Fu=Mn.match(/iPad/i)||Mn.match(/iPhone/i),Lu=Mn.match(/WebKit/i);Fu&&Lu&&Mn.match(/CriOS/i);let Vt=!1,oa=!1,rn=!1,Zr=!0;function Iu(){Vt=typeof window.orientation<"u"||navigator.userAgent.indexOf("IEMobile")!==-1,oa=Mn.match(/(iPad)/)||navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1,rn=document.documentElement.clientHeight>document.documentElement.clientWidth&&document.documentElement.clientWidth<1024,Zr=!Vt&&!oa}Iu();let Du=class{constructor(e,n){this.dpr=n.dpr,this.width=e.offsetWidth*this.dpr,this.height=e.offsetHeight*this.dpr,this.container=e,this.isMobile=Vt,this.active=!1,this.time=0,this.dt=0,this.passes=[],n!==null?(this.manager=n,this.canvas=this.manager.canvas,this.gl=this.manager.gl):this.catchContext(),this.inTransition=!1,this.root=new Gr,this._emitter={},Tn(this._emitter),this.on=this._emitter.on.bind(this._emitter),this.postOptions={},this.hasBloom=!0}getMesh(e){for(let n=0;n<this.meshes.length;n++)if(this.meshes[n].name==e)return this.meshes[n]}getMeshes(e){let n=[];for(let i=0;i<this.meshes.length;i++)this.meshes[i].name==e&&n.push(this.meshes[i]);return n}getParentInNodeTree(e,n){for(const i in e)if(Object.hasOwnProperty.call(e,i)){const r=e[i];if(r.childrenIds.indexOf(n)>-1)return r.transform}}catchContext(){if(this.canvas=document.createElement("canvas"),this.canvas.width=this.width,this.canvas.height=this.height,this.canvas.style.maxWidth=this.container.offsetWidth+"px",this.canvas.style.maxHeight=this.container.offsetHeight+"px",this.container.appendChild(this.canvas),this.gl=this.canvas.getContext("webgl",{}),this.gl===void 0)return;let e=this.gl.getExtension("OES_vertex_array_object");e&&(this.gl.createVertexArray=function(){return e.createVertexArrayOES()},this.gl.deleteVertexArray=function(n){e.deleteVertexArrayOES(n)},this.gl.bindVertexArray=function(n){e.bindVertexArrayOES(n)},this.gl.isVertexArray=function(n){return e.isVertexArrayOES(n)}),this.gl.getExtension("OES_standard_derivatives"),this.gl.getExtension("EXT_shader_texture_lod"),this.gl.getExtension("OES_texture_float"),this.gl.getExtension("OES_texture_float_linear"),this.gl.getExtension("OES_texture_half_float"),this.gl.getExtension("OES_texture_half_float_linear"),this.gl.getExtension("EXT_color_buffer_half_float")}resize(){for(let e=0;e<this.passes.length;e++)this.passes[e].onResize()}onResize(){this.inTransition&&this.isMobile||(this.dpr=this.manager.dpr,this.width=this.container.offsetWidth*this.dpr,this.height=this.container.offsetHeight*this.dpr,this.canvas.width=this.width,this.canvas.height=this.height,this.canvas.style.maxWidth=this.container.offsetWidth+"px",this.canvas.style.maxHeight=this.container.offsetHeight+"px",this.gl.viewport(0,0,this.width,this.height),this.resize&&this.resize(),this.post&&this.post.resize())}dispose(){this.disposeMeshes()}disposeMeshes(){this.meshes&&(this.meshes.forEach(e=>{e.dispose?e.dispose():e.setParent&&e.setParent(null)}),this.meshes=[])}};const Ni={main:{test:{url:"/glxp/textures/Debug/UV_Grid.ktx2",options:["compressed"]},testPng:{url:"/glxp/textures/Debug/UV_Grid.png",options:[]},brdfLUT:{url:"/glxp/brdfLUT.png",options:["clamp"]},flakes:{url:"/glxp/flake-map.ktx2",options:["compressed","repeat"]},white:{url:"/glxp/textures/white.jpg",options:["repeat"]},black:{url:"/glxp/textures/black.jpg",options:["repeat"]},default_normals:{url:"/glxp/textures/default_normals.jpg",options:["repeat"]}},fonts:{},audio:{},mp3:{},materials:{}};function zn(t){throw new Error('Could not dynamically require "'+t+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Xo={exports:{}};(function(t,e){(function(n){t.exports=n()})(function(){return function(){function n(i,r,s){function a(h,c){if(!r[h]){if(!i[h]){var u=typeof zn=="function"&&zn;if(!c&&u)return u(h,!0);if(o)return o(h,!0);var f=new Error("Cannot find module '"+h+"'");throw f.code="MODULE_NOT_FOUND",f}var d=r[h]={exports:{}};i[h][0].call(d.exports,function(p){var m=i[h][1][p];return a(m||p)},d,d.exports,n,i,r,s)}return r[h].exports}for(var o=typeof zn=="function"&&zn,l=0;l<s.length;l++)a(s[l]);return a}return n}()({1:[function(n,i,r){/**
 * @file Embedded JavaScript templating engine. {@link http://ejs.co}
 * @author Matthew Eernisse <mde@fleegix.org>
 * @author Tiancheng "Timothy" Gu <timothygu99@gmail.com>
 * @project EJS
 * @license {@link http://www.apache.org/licenses/LICENSE-2.0 Apache License, Version 2.0}
 */var s=n("fs"),a=n("path"),o=n("./utils"),l=!1,h=n("../package.json").version,c="<",u=">",f="%",d="locals",p="ejs",m="(<%%|%%>|<%=|<%-|<%_|<%#|<%|%>|-%>|_%>)",x=["delimiter","scope","context","debug","compileDebug","client","_with","rmWhitespace","strict","filename","async"],_=x.concat("cache"),P=/^\uFEFF/,w=/^[a-zA-Z_$][0-9a-zA-Z_$]*$/;r.cache=o.cache,r.fileLoader=s.readFileSync,r.localsName=d,r.promiseImpl=new Function("return this;")().Promise,r.resolveInclude=function(A,I,E){var R=a.dirname,z=a.extname,j=a.resolve,le=j(E?I:R(I),A),ye=z(A);return ye||(le+=".ejs"),le};function b(A,I){var E;if(I.some(function(R){return E=r.resolveInclude(A,R,!0),s.existsSync(E)}))return E}function M(A,I){var E,R,z=I.views,j=/^[A-Za-z]+:\\|^\//.exec(A);if(j&&j.length)A=A.replace(/^\/*/,""),Array.isArray(I.root)?E=b(A,I.root):E=r.resolveInclude(A,I.root||"/",!0);else if(I.filename&&(R=r.resolveInclude(A,I.filename),s.existsSync(R)&&(E=R)),!E&&Array.isArray(z)&&(E=b(A,z)),!E&&typeof I.includer!="function")throw new Error('Could not find the include file "'+I.escapeFunction(A)+'"');return E}function C(A,I){var E,R=A.filename,z=arguments.length>1;if(A.cache){if(!R)throw new Error("cache option requires a filename");if(E=r.cache.get(R),E)return E;z||(I=te(R).toString().replace(P,""))}else if(!z){if(!R)throw new Error("Internal EJS error: no file name or template provided");I=te(R).toString().replace(P,"")}return E=r.compile(I,A),A.cache&&r.cache.set(R,E),E}function Z(A,I,E){var R;if(E){try{R=C(A)(I)}catch(z){return E(z)}E(null,R)}else{if(typeof r.promiseImpl=="function")return new r.promiseImpl(function(z,j){try{R=C(A)(I),z(R)}catch(le){j(le)}});throw new Error("Please provide a callback function")}}function te(A){return r.fileLoader(A)}function re(A,I){var E=o.shallowCopy(o.createNullProtoObjWherePossible(),I);if(E.filename=M(A,E),typeof I.includer=="function"){var R=I.includer(A,E.filename);if(R&&(R.filename&&(E.filename=R.filename),R.template))return C(E,R.template)}return C(E)}function Q(A,I,E,R,z){var j=I.split(`
`),le=Math.max(R-3,0),ye=Math.min(j.length,R+3),fe=z(E),de=j.slice(le,ye).map(function(Fe,De){var Ge=De+le+1;return(Ge==R?" >> ":"    ")+Ge+"| "+Fe}).join(`
`);throw A.path=fe,A.message=(fe||"ejs")+":"+R+`
`+de+`

`+A.message,A}function ne(A){return A.replace(/;(\s*$)/,"$1")}r.compile=function(I,E){var R;return E&&E.scope&&(l||(console.warn("`scope` option is deprecated and will be removed in EJS 3"),l=!0),E.context||(E.context=E.scope),delete E.scope),R=new G(I,E),R.compile()},r.render=function(A,I,E){var R=I||o.createNullProtoObjWherePossible(),z=E||o.createNullProtoObjWherePossible();return arguments.length==2&&o.shallowCopyFromList(z,R,x),C(z,A)(R)},r.renderFile=function(){var A=Array.prototype.slice.call(arguments),I=A.shift(),E,R={filename:I},z,j;return typeof arguments[arguments.length-1]=="function"&&(E=A.pop()),A.length?(z=A.shift(),A.length?o.shallowCopy(R,A.pop()):(z.settings&&(z.settings.views&&(R.views=z.settings.views),z.settings["view cache"]&&(R.cache=!0),j=z.settings["view options"],j&&o.shallowCopy(R,j)),o.shallowCopyFromList(R,z,_)),R.filename=I):z=o.createNullProtoObjWherePossible(),Z(R,z,E)},r.Template=G,r.clearCache=function(){r.cache.reset()};function G(A,I){var E=o.hasOwnOnlyObject(I),R=o.createNullProtoObjWherePossible();this.templateText=A,this.mode=null,this.truncate=!1,this.currentLine=1,this.source="",R.client=E.client||!1,R.escapeFunction=E.escape||E.escapeFunction||o.escapeXML,R.compileDebug=E.compileDebug!==!1,R.debug=!!E.debug,R.filename=E.filename,R.openDelimiter=E.openDelimiter||r.openDelimiter||c,R.closeDelimiter=E.closeDelimiter||r.closeDelimiter||u,R.delimiter=E.delimiter||r.delimiter||f,R.strict=E.strict||!1,R.context=E.context,R.cache=E.cache||!1,R.rmWhitespace=E.rmWhitespace,R.root=E.root,R.includer=E.includer,R.outputFunctionName=E.outputFunctionName,R.localsName=E.localsName||r.localsName||d,R.views=E.views,R.async=E.async,R.destructuredLocals=E.destructuredLocals,R.legacyInclude=typeof E.legacyInclude<"u"?!!E.legacyInclude:!0,R.strict?R._with=!1:R._with=typeof E._with<"u"?E._with:!0,this.opts=R,this.regex=this.createRegex()}G.modes={EVAL:"eval",ESCAPED:"escaped",RAW:"raw",COMMENT:"comment",LITERAL:"literal"},G.prototype={createRegex:function(){var A=m,I=o.escapeRegExpChars(this.opts.delimiter),E=o.escapeRegExpChars(this.opts.openDelimiter),R=o.escapeRegExpChars(this.opts.closeDelimiter);return A=A.replace(/%/g,I).replace(/</g,E).replace(/>/g,R),new RegExp(A)},compile:function(){var A,I,E=this.opts,R="",z="",j=E.escapeFunction,le,ye=E.filename?JSON.stringify(E.filename):"undefined";if(!this.source){if(this.generateSource(),R+=`  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
`,E.outputFunctionName){if(!w.test(E.outputFunctionName))throw new Error("outputFunctionName is not a valid JS identifier.");R+="  var "+E.outputFunctionName+` = __append;
`}if(E.localsName&&!w.test(E.localsName))throw new Error("localsName is not a valid JS identifier.");if(E.destructuredLocals&&E.destructuredLocals.length){for(var fe="  var __locals = ("+E.localsName+` || {}),
`,de=0;de<E.destructuredLocals.length;de++){var Fe=E.destructuredLocals[de];if(!w.test(Fe))throw new Error("destructuredLocals["+de+"] is not a valid JS identifier.");de>0&&(fe+=`,
  `),fe+=Fe+" = __locals."+Fe}R+=fe+`;
`}E._with!==!1&&(R+="  with ("+E.localsName+` || {}) {
`,z+=`  }
`),z+=`  return __output;
`,this.source=R+this.source+z}E.compileDebug?A=`var __line = 1
  , __lines = `+JSON.stringify(this.templateText)+`
  , __filename = `+ye+`;
try {
`+this.source+`} catch (e) {
  rethrow(e, __lines, __filename, __line, escapeFn);
}
`:A=this.source,E.client&&(A="escapeFn = escapeFn || "+j.toString()+`;
`+A,E.compileDebug&&(A="rethrow = rethrow || "+Q.toString()+`;
`+A)),E.strict&&(A=`"use strict";
`+A),E.debug&&console.log(A),E.compileDebug&&E.filename&&(A=A+`
//# sourceURL=`+ye+`
`);try{if(E.async)try{le=new Function("return (async function(){}).constructor;")()}catch(T){throw T instanceof SyntaxError?new Error("This environment does not support async/await"):T}else le=Function;I=new le(E.localsName+", escapeFn, include, rethrow",A)}catch(T){throw T instanceof SyntaxError&&(E.filename&&(T.message+=" in "+E.filename),T.message+=` while compiling ejs

`,T.message+=`If the above error is not helpful, you may want to try EJS-Lint:
`,T.message+="https://github.com/RyanZim/EJS-Lint",E.async||(T.message+=`
`,T.message+="Or, if you meant to create an async function, pass `async: true` as an option.")),T}var De=E.client?I:function(k){var U=function(W,J){var g=o.shallowCopy(o.createNullProtoObjWherePossible(),k);return J&&(g=o.shallowCopy(g,J)),re(W,E)(g)};return I.apply(E.context,[k||o.createNullProtoObjWherePossible(),j,U,Q])};if(E.filename&&typeof Object.defineProperty=="function"){var Ge=E.filename,be=a.basename(Ge,a.extname(Ge));try{Object.defineProperty(De,"name",{value:be,writable:!1,enumerable:!1,configurable:!0})}catch{}}return De},generateSource:function(){var A=this.opts;A.rmWhitespace&&(this.templateText=this.templateText.replace(/[\r\n]+/g,`
`).replace(/^\s+|\s+$/gm,"")),this.templateText=this.templateText.replace(/[ \t]*<%_/gm,"<%_").replace(/_%>[ \t]*/gm,"_%>");var I=this,E=this.parseTemplateText(),R=this.opts.delimiter,z=this.opts.openDelimiter,j=this.opts.closeDelimiter;E&&E.length&&E.forEach(function(le,ye){var fe;if(le.indexOf(z+R)===0&&le.indexOf(z+R+R)!==0&&(fe=E[ye+2],!(fe==R+j||fe=="-"+R+j||fe=="_"+R+j)))throw new Error('Could not find matching close tag for "'+le+'".');I.scanLine(le)})},parseTemplateText:function(){for(var A=this.templateText,I=this.regex,E=I.exec(A),R=[],z;E;)z=E.index,z!==0&&(R.push(A.substring(0,z)),A=A.slice(z)),R.push(E[0]),A=A.slice(E[0].length),E=I.exec(A);return A&&R.push(A),R},_addOutput:function(A){if(this.truncate&&(A=A.replace(/^(?:\r\n|\r|\n)/,""),this.truncate=!1),!A)return A;A=A.replace(/\\/g,"\\\\"),A=A.replace(/\n/g,"\\n"),A=A.replace(/\r/g,"\\r"),A=A.replace(/"/g,'\\"'),this.source+='    ; __append("'+A+`")
`},scanLine:function(A){var I=this,E=this.opts.delimiter,R=this.opts.openDelimiter,z=this.opts.closeDelimiter,j=0;switch(j=A.split(`
`).length-1,A){case R+E:case R+E+"_":this.mode=G.modes.EVAL;break;case R+E+"=":this.mode=G.modes.ESCAPED;break;case R+E+"-":this.mode=G.modes.RAW;break;case R+E+"#":this.mode=G.modes.COMMENT;break;case R+E+E:this.mode=G.modes.LITERAL,this.source+='    ; __append("'+A.replace(R+E+E,R+E)+`")
`;break;case E+E+z:this.mode=G.modes.LITERAL,this.source+='    ; __append("'+A.replace(E+E+z,E+z)+`")
`;break;case E+z:case"-"+E+z:case"_"+E+z:this.mode==G.modes.LITERAL&&this._addOutput(A),this.mode=null,this.truncate=A.indexOf("-")===0||A.indexOf("_")===0;break;default:if(this.mode){switch(this.mode){case G.modes.EVAL:case G.modes.ESCAPED:case G.modes.RAW:A.lastIndexOf("//")>A.lastIndexOf(`
`)&&(A+=`
`)}switch(this.mode){case G.modes.EVAL:this.source+="    ; "+A+`
`;break;case G.modes.ESCAPED:this.source+="    ; __append(escapeFn("+ne(A)+`))
`;break;case G.modes.RAW:this.source+="    ; __append("+ne(A)+`)
`;break;case G.modes.COMMENT:break;case G.modes.LITERAL:this._addOutput(A);break}}else this._addOutput(A)}I.opts.compileDebug&&j&&(this.currentLine+=j,this.source+="    ; __line = "+this.currentLine+`
`)}},r.escapeXML=o.escapeXML,r.__express=r.renderFile,r.VERSION=h,r.name=p,typeof window<"u"&&(window.ejs=r)},{"../package.json":6,"./utils":2,fs:3,path:4}],2:[function(n,i,r){var s=/[|\\{}()[\]^$+*?.]/g,a=Object.prototype.hasOwnProperty,o=function(d,p){return a.apply(d,[p])};r.escapeRegExpChars=function(d){return d?String(d).replace(s,"\\$&"):""};var l={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&#34;","'":"&#39;"},h=/[&<>'"]/g;function c(d){return l[d]||d}var u=`var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
`;r.escapeXML=function(d){return d==null?"":String(d).replace(h,c)};function f(){return Function.prototype.toString.call(this)+`;
`+u}try{typeof Object.defineProperty=="function"?Object.defineProperty(r.escapeXML,"toString",{value:f}):r.escapeXML.toString=f}catch{console.warn("Unable to set escapeXML.toString (is the Function prototype frozen?)")}r.shallowCopy=function(d,p){if(p=p||{},d!=null)for(var m in p)o(p,m)&&(m==="__proto__"||m==="constructor"||(d[m]=p[m]));return d},r.shallowCopyFromList=function(d,p,m){if(m=m||[],p=p||{},d!=null)for(var x=0;x<m.length;x++){var _=m[x];if(typeof p[_]<"u"){if(!o(p,_)||_==="__proto__"||_==="constructor")continue;d[_]=p[_]}}return d},r.cache={_data:{},set:function(d,p){this._data[d]=p},get:function(d){return this._data[d]},remove:function(d){delete this._data[d]},reset:function(){this._data={}}},r.hyphenToCamel=function(d){return d.replace(/-[a-z]/g,function(p){return p[1].toUpperCase()})},r.createNullProtoObjWherePossible=function(){return typeof Object.create=="function"?function(){return Object.create(null)}:{__proto__:null}instanceof Object?function(){return{}}:function(){return{__proto__:null}}}(),r.hasOwnOnlyObject=function(d){var p=r.createNullProtoObjWherePossible();for(var m in d)o(d,m)&&(p[m]=d[m]);return p}},{}],3:[function(n,i,r){},{}],4:[function(n,i,r){(function(s){function a(c,u){for(var f=0,d=c.length-1;d>=0;d--){var p=c[d];p==="."?c.splice(d,1):p===".."?(c.splice(d,1),f++):f&&(c.splice(d,1),f--)}if(u)for(;f--;f)c.unshift("..");return c}r.resolve=function(){for(var c="",u=!1,f=arguments.length-1;f>=-1&&!u;f--){var d=f>=0?arguments[f]:s.cwd();if(typeof d!="string")throw new TypeError("Arguments to path.resolve must be strings");if(!d)continue;c=d+"/"+c,u=d.charAt(0)==="/"}return c=a(l(c.split("/"),function(p){return!!p}),!u).join("/"),(u?"/":"")+c||"."},r.normalize=function(c){var u=r.isAbsolute(c),f=h(c,-1)==="/";return c=a(l(c.split("/"),function(d){return!!d}),!u).join("/"),!c&&!u&&(c="."),c&&f&&(c+="/"),(u?"/":"")+c},r.isAbsolute=function(c){return c.charAt(0)==="/"},r.join=function(){var c=Array.prototype.slice.call(arguments,0);return r.normalize(l(c,function(u,f){if(typeof u!="string")throw new TypeError("Arguments to path.join must be strings");return u}).join("/"))},r.relative=function(c,u){c=r.resolve(c).substr(1),u=r.resolve(u).substr(1);function f(w){for(var b=0;b<w.length&&w[b]==="";b++);for(var M=w.length-1;M>=0&&w[M]==="";M--);return b>M?[]:w.slice(b,M-b+1)}for(var d=f(c.split("/")),p=f(u.split("/")),m=Math.min(d.length,p.length),x=m,_=0;_<m;_++)if(d[_]!==p[_]){x=_;break}for(var P=[],_=x;_<d.length;_++)P.push("..");return P=P.concat(p.slice(x)),P.join("/")},r.sep="/",r.delimiter=":",r.dirname=function(c){if(typeof c!="string"&&(c=c+""),c.length===0)return".";for(var u=c.charCodeAt(0),f=u===47,d=-1,p=!0,m=c.length-1;m>=1;--m)if(u=c.charCodeAt(m),u===47){if(!p){d=m;break}}else p=!1;return d===-1?f?"/":".":f&&d===1?"/":c.slice(0,d)};function o(c){typeof c!="string"&&(c=c+"");var u=0,f=-1,d=!0,p;for(p=c.length-1;p>=0;--p)if(c.charCodeAt(p)===47){if(!d){u=p+1;break}}else f===-1&&(d=!1,f=p+1);return f===-1?"":c.slice(u,f)}r.basename=function(c,u){var f=o(c);return u&&f.substr(-1*u.length)===u&&(f=f.substr(0,f.length-u.length)),f},r.extname=function(c){typeof c!="string"&&(c=c+"");for(var u=-1,f=0,d=-1,p=!0,m=0,x=c.length-1;x>=0;--x){var _=c.charCodeAt(x);if(_===47){if(!p){f=x+1;break}continue}d===-1&&(p=!1,d=x+1),_===46?u===-1?u=x:m!==1&&(m=1):u!==-1&&(m=-1)}return u===-1||d===-1||m===0||m===1&&u===d-1&&u===f+1?"":c.slice(u,d)};function l(c,u){if(c.filter)return c.filter(u);for(var f=[],d=0;d<c.length;d++)u(c[d],d,c)&&f.push(c[d]);return f}var h="ab".substr(-1)==="b"?function(c,u,f){return c.substr(u,f)}:function(c,u,f){return u<0&&(u=c.length+u),c.substr(u,f)}}).call(this,n("_process"))},{_process:5}],5:[function(n,i,r){var s=i.exports={},a,o;function l(){throw new Error("setTimeout has not been defined")}function h(){throw new Error("clearTimeout has not been defined")}(function(){try{typeof setTimeout=="function"?a=setTimeout:a=l}catch{a=l}try{typeof clearTimeout=="function"?o=clearTimeout:o=h}catch{o=h}})();function c(b){if(a===setTimeout)return setTimeout(b,0);if((a===l||!a)&&setTimeout)return a=setTimeout,setTimeout(b,0);try{return a(b,0)}catch{try{return a.call(null,b,0)}catch{return a.call(this,b,0)}}}function u(b){if(o===clearTimeout)return clearTimeout(b);if((o===h||!o)&&clearTimeout)return o=clearTimeout,clearTimeout(b);try{return o(b)}catch{try{return o.call(null,b)}catch{return o.call(this,b)}}}var f=[],d=!1,p,m=-1;function x(){!d||!p||(d=!1,p.length?f=p.concat(f):m=-1,f.length&&_())}function _(){if(!d){var b=c(x);d=!0;for(var M=f.length;M;){for(p=f,f=[];++m<M;)p&&p[m].run();m=-1,M=f.length}p=null,d=!1,u(b)}}s.nextTick=function(b){var M=new Array(arguments.length-1);if(arguments.length>1)for(var C=1;C<arguments.length;C++)M[C-1]=arguments[C];f.push(new P(b,M)),f.length===1&&!d&&c(_)};function P(b,M){this.fun=b,this.array=M}P.prototype.run=function(){this.fun.apply(null,this.array)},s.title="browser",s.browser=!0,s.env={},s.argv=[],s.version="",s.versions={};function w(){}s.on=w,s.addListener=w,s.once=w,s.off=w,s.removeListener=w,s.removeAllListeners=w,s.emit=w,s.prependListener=w,s.prependOnceListener=w,s.listeners=function(b){return[]},s.binding=function(b){throw new Error("process.binding is not supported")},s.cwd=function(){return"/"},s.chdir=function(b){throw new Error("process.chdir is not supported")},s.umask=function(){return 0}},{}],6:[function(n,i,r){i.exports={name:"ejs",description:"Embedded JavaScript templates",keywords:["template","engine","ejs"],version:"3.1.9",author:"Matthew Eernisse <mde@fleegix.org> (http://fleegix.org)",license:"Apache-2.0",bin:{ejs:"./bin/cli.js"},main:"./lib/ejs.js",jsdelivr:"ejs.min.js",unpkg:"ejs.min.js",repository:{type:"git",url:"git://github.com/mde/ejs.git"},bugs:"https://github.com/mde/ejs/issues",homepage:"https://github.com/mde/ejs",dependencies:{jake:"^10.8.5"},devDependencies:{browserify:"^16.5.1",eslint:"^6.8.0","git-directory-deploy":"^1.5.1",jsdoc:"^4.0.2","lru-cache":"^4.0.1",mocha:"^10.2.0","uglify-js":"^3.3.16"},engines:{node:">=0.10.0"},scripts:{test:"npx jake test"}}},{}]},{},[1])(1)})})(Xo);var Uu=Xo.exports;const ki=$o(Uu);var Bu=`<% if (vert) { %>
  
    precision highp float; 

    attribute vec3 position;
    attribute vec2 uv;

    uniform mat4 modelViewMatrix;
    uniform mat4 modelMatrix;
    uniform mat4 projectionMatrix;
    uniform float uTime;

    varying vec2 vUv;
    varying vec4 vPos;

    void main(){
        vec4 wPos = modelMatrix * vec4(position, 1.0);
        vPos = wPos;
        vUv = uv;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }

<% } %>

<% if (frag) { %>

    precision highp float; 

    varying vec2 vUv;
    varying vec4 vPos;

    uniform mat4 projectionMatrix;
    uniform mat4 viewMatrix;

    uniform float uReflectionScale;
    uniform float uReflectionSize;
    uniform float uReflectionOpacity;
    uniform float uCircleRadius;
    uniform float uFeather;
    uniform float uScrollSpeed;

    uniform vec3 uColor;

    uniform sampler2D uTexture;
    uniform sampler2D uNoiseTexture;
    uniform float uTime;

    float blendScreen(float base, float blend) {
        return 1.0-((1.0-base)*(1.0-blend));
    }

    vec3 blendScreen(vec3 base, vec3 blend) {
        return vec3(blendScreen(base.r,blend.r),blendScreen(base.g,blend.g),blendScreen(base.b,blend.b));
    }

    vec3 blendScreen(vec3 base, vec3 blend, float opacity) {
        return (blendScreen(base, blend) * opacity + base * (1.0 - opacity));
    }

    void main() { 

        vec4 clipSpace = projectionMatrix * (viewMatrix * vPos);
        vec3 ndc = clipSpace.xyz / clipSpace.w;
        vec2 ssUv = (ndc.xy * .5 + .5);

        vec2 uv = vUv;
        uv -= vec2(0.5);
        float dist = sqrt(dot(uv, uv)) * 2.;

        float dr = uCircleRadius;
        float alpha = smoothstep(dr+uFeather, dr-uFeather, dist);

        vec2 fUv = (vUv + vec2(0., uTime * uScrollSpeed)) * uReflectionSize;
        vec2 d = ((texture2D( uNoiseTexture, fUv ).xy));
        vec4 t = texture2D( uTexture, ssUv + (d * uReflectionScale) );

        vec3 color = uColor;
        color.xyz = blendScreen(color, t.xyz * uReflectionOpacity, 1.);
        color -= (d.x + d.y) * .05;

        gl_FragColor = vec4(color, alpha); 
        
        
    } 
        
<% } %>`,zu=`<% if (vert) { %>
  
    precision highp float; 

    attribute vec3 position;
    attribute vec2 uv;

    varying vec2 vUv;
    varying vec4 vPosition;

    void main(){
        vUv = uv;
        gl_Position = vec4(position, 1.0);
        vPosition = vec4(position, 1.0);
        gl_Position.z = 1.;
    }

<% } %>

<% if (frag) { %>

    precision highp float; 

    varying vec2 vUv;
    varying vec4 vPosition;

    uniform float uTime;
    uniform float uAlpha;
    uniform vec2 uRez;

    uniform sampler2D uTextureNoise;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    uniform vec3 uColor4;
    uniform vec3 uColorBackground;
    uniform float uProgress;

    #define S(a,b,t) smoothstep(a,b,t)

    mat2 Rot(float a)
    {
        float s = sin(a);
        float c = cos(a);
        return mat2(c, -s, s, c);
    }

    
    
    vec2 hash( vec2 p )
    {
        p = vec2( dot(p,vec2(2127.1,81.17)), dot(p,vec2(1269.5,283.37)) );
        return fract(sin(p)*43758.5453);
    }

    float noise( in vec2 p )
    {
        vec2 i = floor( p );
        vec2 f = fract( p );
        
        vec2 u = f*f*(3.0-2.0*f);

        float n = mix( mix( dot( -1.0+2.0*hash( i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ), 
                            dot( -1.0+2.0*hash( i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                    mix( dot( -1.0+2.0*hash( i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ), 
                            dot( -1.0+2.0*hash( i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
        return 0.5 + 0.5*n;
    }

    vec3 lensflare(vec2 uv,vec2 pos)
    {
        vec2 main = uv-pos;
        vec2 uvd = uv*(length(uv));
        
        float f2 = max(1.0/(1.0+32.0*pow(length(uvd+0.8*pos),2.0)),.0)*00.55;
        float f22 = max(1.0/(1.0+32.0*pow(length(uvd+0.85*pos),2.0)),.0)*00.53;
        float f23 = max(1.0/(1.0+32.0*pow(length(uvd+0.9*pos),2.0)),.0)*00.51;
        
        vec3 c = vec3(f2, f22, f23); 
        return c;
    }

    vec3 cc(vec3 color, float factor,float factor2) 
    {
        float w = color.x+color.y+color.z;
        return mix(color,vec3(w)*factor,w*factor2);
    }

    void main() { 

        vec2 uv = vUv;
        float ratio = uRez.x / uRez.y;
        
        vec2 tuv = uv;
        tuv -= .5;

        if (ratio < 1.) {
            tuv.x /= 2./ratio;
        }

        
        float degree = noise(vec2(uTime*.1, tuv.x*tuv.y));
        tuv.y *= 1./ratio;
        tuv *= Rot(radians((degree-.5)*720.+180.));
        tuv.y *= ratio;

        
        float frequency = 5.;
        float amplitude = 30.;
        float speed = uTime * 2.;
        tuv.x += sin(tuv.y*frequency+speed)/amplitude;
        tuv.y += sin(tuv.x*frequency*1.5+speed)/(amplitude*.5);

        
        vec3 layer1 = mix(uColor1, uColor2, S(-.3, .2, (tuv*Rot(radians(-5.))).x));
        vec3 layer2 = mix(uColor3, uColor4, S(-.3, .2, (tuv*Rot(radians(-5.))).x));
        
        
        vec3 finalComp = mix(layer1, layer2, S(.5, -.3, tuv.y));
        finalComp = mix(uColorBackground, finalComp, uProgress);
        finalComp *= uAlpha;

        vec3 col = finalComp;

        
        gl_FragColor = vec4(col, 1.0);

    } 
        
<% } %>`,Nu=`<% if (vert) { %>
  
    precision highp float; 

    attribute vec3 position;
    attribute vec2 uv;

    varying vec2 vUv;
    varying vec4 vPosition;

    void main(){
        vUv = uv;
        gl_Position = vec4(position, 1.0);
        vPosition = vec4(position, 1.0);
        gl_Position.z = 1.;
    }

<% } %>

<% if (frag) { %>

    precision highp float; 

    varying vec2 vUv;
    varying vec4 vPosition;

    uniform float uTime;
    uniform float uAlpha;
    uniform vec2 uRez;
    uniform vec2 uLightPos;
    uniform vec3 uColorHalo;
    uniform vec3 uColorGradient1;
    uniform vec3 uColorGradient2;

    uniform float uStrengthHalo;
    uniform float uOpacityHalo;
    uniform float uStrengthGradient;
    uniform float uOpacityGradient;
    uniform float uOpacityGeneral;
    uniform float uGrain;

    #define S(a,b,t) smoothstep(a,b,t)

    mat2 Rot(float a)
    {
        float s = sin(a);
        float c = cos(a);
        return mat2(c, -s, s, c);
    }

    
    
    vec2 hash( vec2 p )
    {
        p = vec2( dot(p,vec2(2127.1,81.17)), dot(p,vec2(1269.5,283.37)) );
        return fract(sin(p)*43758.5453);
    }

    float noise( in vec2 p )
    {
        vec2 i = floor( p );
        vec2 f = fract( p );
        
        vec2 u = f*f*(3.0-2.0*f);

        float n = mix( mix( dot( -1.0+2.0*hash( i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ), 
                            dot( -1.0+2.0*hash( i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                    mix( dot( -1.0+2.0*hash( i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ), 
                            dot( -1.0+2.0*hash( i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
        return 0.5 + 0.5*n;
    }

    vec3 lensflare(vec2 uv,vec2 pos)
    {
        vec2 main = uv-pos;
        vec2 uvd = uv*(length(uv));
        
        float f2 = max(1.0/(1.0+32.0*pow(length(uvd+0.8*pos),2.0)),.0)*00.55 * uStrengthHalo;
        float f22 = max(1.0/(1.0+32.0*pow(length(uvd+0.85*pos),2.0)),.0)*00.53 * uStrengthHalo;
        float f23 = max(1.0/(1.0+32.0*pow(length(uvd+0.9*pos),2.0)),.0)*00.51 * uStrengthHalo;
        
        vec3 c = vec3(f2, f22, f23); 
        return c;
    }

    vec3 cc(vec3 color, float factor,float factor2) 
    {
        float w = color.x+color.y+color.z;
        return mix(color,vec3(w)*factor,w*factor2);
    }

    void main() { 

        vec2 uv = vUv;
        float ratio = uRez.x / uRez.y;

        vec3 color = vec3(0.);
        float time = uTime;
        
        vec2 tuv = (uv - vec2(.5)) * 2.;
        tuv.x *= ratio;

        vec2 lightPos = uLightPos;
        lightPos.x *= ratio;

        vec3 halo = uColorHalo * lensflare(tuv, lightPos) * uOpacityHalo;
        halo = cc(halo, .5, .5);

        vec2 circlePos1 = uLightPos * .2;
        vec2 circleUv = tuv - circlePos1;
        circleUv += (hash(uv + 13.4) - .5) * .1 * uGrain;

        vec2 circlePos2 = -uLightPos * .6;
        vec2 circleUv2 = tuv - circlePos2;
        circleUv2 += (hash(uv + 86.4) - .5) * .05 * uGrain;

        float borderSize = sin(time * .5) * 2.;
        borderSize = sin(borderSize) * (max(pow(borderSize, .5), 1.));
        float circleRadius = sin(time * .7) * .5 + 0.5;

        float dist = dot((circleUv), (circleUv));
        float dist2 = dot(circleUv2, circleUv2);
        float distGeneral = dot(
            tuv + (lightPos * .2) + ((hash(uv + 13.4) - .5) * .1 * uGrain), 
            tuv + (lightPos * .1) + ((hash(uv + 86.4) - .5) * .05 * uGrain)
        );

        float circleRadiusGeneral = sin(time * .7 + 23.) * .5 + 0.5;
        float borderSizeGeneral = sin(time * .5 + 389.) * 2.;

        dist = pow(dist, .5);
        dist2 = pow(dist2, .5);

        float t = smoothstep(circleRadius - borderSize, circleRadius, dist) - smoothstep(circleRadius, circleRadius + borderSize, dist2);
        float tGeneral = smoothstep(circleRadiusGeneral - borderSizeGeneral, circleRadiusGeneral, distGeneral);

        color = mix(uColorGradient1 * uOpacityGradient, uColorGradient2 * uOpacityGradient, t) * tGeneral;
        color += halo;

        
        gl_FragColor = vec4(color, uAlpha);

    } 
        
<% } %>`,ku=`<% if (vert) { %>
    needES300
    precision highp float; 

    in vec3 position;
    in vec2 uv;

    uniform mat4 modelViewMatrix;
    uniform mat4 modelMatrix;
    uniform mat4 projectionMatrix;
    uniform float uTime;

    #ifdef HAS_SHADOW
        uniform mat4 shadowViewMatrix;
        uniform mat4 shadowProjectionMatrix;
        out vec4 vLightNDC;
        const mat4 depthScaleMatrix = mat4( 0.5, 0, 0, 0, 0, 0.5, 0, 0, 0, 0, 0.5, 0, 0.5, 0.5, 0.5, 1 );
    #endif

    out vec2 vUv;

    void main(){
        vUv = uv;

        
        #ifdef HAS_SHADOW
            vLightNDC = depthScaleMatrix * shadowProjectionMatrix * shadowViewMatrix * modelMatrix * vec4(position, 1.0);
        #endif

        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }

<% } %>

<% if (frag) { %>
    needES300
    precision highp float; 

    in vec2 vUv;
    uniform vec3 uColor;
    out vec4 outColor;

    #ifdef HAS_SHADOW
        uniform sampler2D tShadow;
        in vec4 vLightNDC;
    #endif

    const float division = 50.;

    void main() { 
        vec2 uv = vUv.xy * division;
        vec2 grid = abs(fract(uv - 0.5) - 0.5) / fwidth(uv);
        float line = min(grid.x, grid.y);

        vec2 circleUv = vUv -.5;
        float dist = sqrt(dot(circleUv, circleUv));
        float t = pow(smoothstep(.6, .1, dist), 1.5);

        #ifdef IS_WEBGL_1
            gl_FragColor = vec4(1.0 - min(line, 1.0)) * .5 * t;
            gl_FragColor.rgb = uColor - gl_FragColor.rgb;
            gl_FragColor.a = t;
        #else
            outColor = vec4(1.0 - min(line, 1.0)) * .5 * t;
            outColor.rgb = uColor - outColor.rgb;
            outColor.a = t;
        #endif

        #ifdef HAS_SHADOW

            vec3 lightPos = vLightNDC.xyz / vLightNDC.w;
            float bias = 0.0025;
            float depth = lightPos.z - bias;
            float occluder = texture(tShadow, lightPos.xy).r;
            float bounds = (step(0., lightPos.x) - step(1., lightPos.x)) * (step(0., lightPos.y) - step(1., lightPos.y));
            
            float shadow = mix(0.2, 1.0, step(depth, occluder));

            #ifdef IS_WEBGL_1
                gl_FragColor.rgb = mix(gl_FragColor.rgb, gl_FragColor.rgb * shadow, bounds);
            #else
                outColor.rgb = mix(outColor.rgb, outColor.rgb * shadow, bounds);
            #endif

            
            
            
            
            
        #endif

    } 
        
<% } %>`,$u=`<% if (vert) { %>

   precision highp float;

    attribute vec3 position;
    attribute vec2 uv;

    uniform vec2 uRez;
    uniform bool uFxaa;

    varying vec2 vUv;

    <%= commons.fxaa %>

    void main(void) {
        vUv = uv;

        vec2 fragCoord = vUv * uRez;
        texcoords(fragCoord, uRez, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);

        gl_Position = vec4(position, 1.0);
    }

<% } %>

<% if (frag) { %>

    precision highp float;

    uniform sampler2D uTexture;
    uniform sampler2D uDepth;
    uniform sampler2D uBloom;
    uniform sampler2D uNoise;
    varying vec2 vUv;

    uniform vec2 uRez;
    uniform vec2 uMouse;
    uniform float uTime;
    uniform float uHueShift;
    uniform float uVignette;
    uniform float uNoiseOpacity;
    uniform float uChromaticAberations;
    uniform float uGamma;
    uniform float uExposure;
    uniform float uBloomOpacity;
    uniform float uContrast;
    uniform float uKonami;
    uniform vec3 uVignetteColor;
    uniform float uVignetteStrength;
    uniform bool uBloomEnabled;
    uniform bool uShowDepth;
    uniform bool uFxaa;

    <%= commons.allBlendModes %>
    <%= commons.colorCorrection %>
    <%= commons.fxaa %>

    float random (in vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    void main() {

        vec2 uv = vUv;
        vec4 color;

        
        float n = 1.0;
        float f = 1000.0; 
        float z = texture2D(uDepth, vUv).x;
        float depth = (2.0 * n) / (f + n - z*(f-n));

        
        

        
        float maxDistort = uChromaticAberations * .1;
        float scalar = 1.0 * maxDistort;
        vec4 colourScalar = vec4(700.0, 560.0, 490.0, 1.0);	
        colourScalar /= max(max(colourScalar.x, colourScalar.y), colourScalar.z);
        colourScalar /= 100.;
        colourScalar *= scalar;

        
        if (uFxaa) {
            vec2 fragCoord = vUv * uRez; 
            color = fxaa(uTexture, fragCoord, uRez, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);
        } else {
            color.r += texture2D(uTexture, uv + colourScalar.r).r;
            color.g += texture2D(uTexture, uv + -colourScalar.g).g;
            color.b += texture2D(uTexture, uv + colourScalar.b).b;
        }

        
        if(uBloomEnabled){
            vec4 bloom = texture2D(uBloom, uv);
            color.rgb = blendScreen_21_19(color.rgb, bloom.rgb, uBloomOpacity);
        }

        
        vec2 vgnUv = vUv;
        vgnUv *= (1.0 - vgnUv.yx);
        float vig = vgnUv.x * vgnUv.y * 15.0;
        vig = pow(vig, uVignette);

        
        
        
        
        

        
        color.rgb = blendOverlay_9_12(color.rgb, vec3(random(vUv + mod(uTime, 1.))), uNoiseOpacity);
        color.rgb = linearToneMapping(color.rgb, uGamma);
        color.rgb = contrast(color.rgb, uContrast);
        color.rgb = exposure(color.rgb, uExposure);

        
        
        color.rgb = mix(color.rgb, mix(uVignetteColor, color.rgb * vig, vig), uVignetteStrength);

        
        color.a = 1.;

        
        
        if(uShowDepth){
            color = vec4(depth, depth, depth, 1.0);
        }
        

        gl_FragColor = color;
    }

<% } %>`,Wu=`<% if (vert) { %>
    precision highp float;
    attribute vec3 aPos;
    attribute vec2 aUvs;
    varying vec2 vUv;
    void main(void) {
        vUv = aUvs;
        gl_Position = vec4(aPos, 1.0);
    }
<% } %>

<% if (passes.pass_1) { %>
    precision highp float;
    uniform sampler2D uTexture;
    varying vec2 vUv;
    uniform vec2 uRez;
    uniform vec2 uDir;
    uniform vec3 uTint;
    uniform float uPower;
    uniform float uIsFirstPass;
    uniform float uThresold;
    uniform float uSimilarity;
    uniform float uDebug;
    uniform float uOverdrive;

    <%= commons.blur %>
    void main() {
        vec4 color = blur5(uTexture, vUv, uRez, uDir * uPower);
        gl_FragColor = vec4(color.rgb * color.a, color.a);
        if(uIsFirstPass > 0.5){
            float brightness = dot(color.rgb, vec3(0.2126, 0.7152, 0.0722));
            float highlights = smoothstep(uThresold, uThresold+uSimilarity, brightness);
            gl_FragColor = vec4((color.rgb * (1. + uOverdrive)) * vec3(highlights) * uTint, 1.);
        }
    }
<% } %>

<% if (frag) { %>
    precision highp float;
    uniform sampler2D uBlur;
    varying vec2 vUv;
    uniform vec2 uRez;

 <%if (defines["COLOR_CORRECTION"] >= 1) { %>
    uniform float uShift;
    uniform float uBrightness;
    uniform float uContrast;

    <%= commons.colorCorrection %>
<% } %>

    void main() {
        
        vec4 blur = texture2D( uBlur, vUv);
        gl_FragColor = blur;

        <%if (defines["TRANSPARENT"] >= 1) { %>
            
            float a = smoothstep(1., 0.2, blur.z);
            a = pow(a, 2.);
            blur.z = 0.;
            gl_FragColor = vec4(blur.rgb, a);
        <% } %>

        <%if (defines["COLOR_CORRECTION"] >= 1) { %>
            vec3 color = hueShift(gl_FragColor.rgb, uShift);
            vec3 colorContrasted = (color) * uContrast;
            vec3 bright = colorContrasted + vec3(uBrightness);
            gl_FragColor.rgb = bright;
        <% } %>

    }
<% } %>`,ju=`<% if (vert) { %>
    needES300
    precision highp float; 

    in vec3 position;
    in vec2 uv;
    in float charsId;

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform mat4 modelMatrix;

    out vec2 vUv;
    out vec4 vPos;

    void main(){
        vUv = uv;
        charsId;
        vPos = modelMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }

<% } %>

<% if (frag) { %>
    
    precision highp float; 

    in vec2 vUv;
    in vec4 vPos;

    uniform bool isCameraFliped;

    uniform sampler2D tMap;
    uniform vec3 uColor;
    uniform float uAlpha;

    out vec4 outColor;

    void main() { 
        if(isCameraFliped && vPos.y < 0.01){ discard; }

        vec3 tex = texture(tMap, vUv).rgb;

        float signedDist = max(min(tex.r, tex.g), min(max(tex.r, tex.g), tex.b)) - 0.5;
        float d = fwidth(signedDist);
        float alpha = smoothstep(-d, d, signedDist);

        if (alpha < 0.01) discard;

        #ifdef IS_WEBGL_1
            gl_FragColor.rgb = uColor;
            gl_FragColor.a = alpha * uAlpha;
        #else
            outColor.rgb = uColor;
            outColor.a = alpha * uAlpha;
        #endif

    } 
        
<% } %>`,Vu=`<% if (vert) { %>
    needES300
    precision highp float; 

    in vec3 position;
    in vec3 center;
    in vec2 uv;
    in float charsId;

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform mat4 modelMatrix;
    uniform float uProgress;
    uniform float uMaxIds;
    uniform vec2 uAnimationDirrection;

    out vec2 vUv;
    out vec4 vPos;
    out float vAlpha;

    const float stagger = .15;

    <%= commons.easing %>

    void main(){
        vUv = uv;
        
        vec3 pos = position;

        float inProgress = smoothstep(-1., 0., (1. - uProgress) - 1.);
        float outProgress = smoothstep(1., 0., (1. - uProgress) - 1.);
        float cp = charsId/uMaxIds;
        float lpi = smoothstep(0. + (cp * stagger), 1. + (cp * stagger), (1. - inProgress) * (1. + stagger));
        float lpo = smoothstep(0. - (cp * stagger), 1. - (cp * stagger), (1. - outProgress) * (1. + stagger) - stagger);
        pos = mix(pos, center, quarticOut(lpo));
        pos.yz -= uAnimationDirrection * .5 * quarticIn(lpi);
        pos.yz += uAnimationDirrection * quarticOut(lpo);
        vAlpha = (1. - quarticInOut(lpi)) * (1. - quarticOut(lpo));

        vPos = modelMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }

<% } %>

<% if (frag) { %>
    
    precision highp float; 

    in vec2 vUv;
    in vec4 vPos;
    in float vAlpha;

    uniform bool isCameraFliped;

    uniform sampler2D tMap;
    uniform vec3 uColor;
    uniform float uAlpha;

    out vec4 outColor;

    void main() { 
        if(isCameraFliped && vPos.y < 0.01){ discard; }

        vec3 tex = texture(tMap, vUv).rgb;

        float signedDist = max(min(tex.r, tex.g), min(max(tex.r, tex.g), tex.b)) - 0.5;
        float d = fwidth(signedDist);
        float alpha = smoothstep(-d, d, signedDist);

        if (alpha < 0.01) discard;

        #ifdef IS_WEBGL_1
            gl_FragColor.rgb = uColor;
            gl_FragColor.a = alpha * uAlpha * vAlpha;
        #else
            outColor.rgb = uColor;
            outColor.a = alpha * uAlpha * vAlpha;
        #endif

    } 
        
<% } %>`,Hu=`vec3 blendNormal(vec3 normal){
    vec3 blending = abs(normal);
    blending = normalize(max(blending, 0.00001));
    blending /= vec3(blending.x + blending.y + blending.z);
    return blending;
}

vec3 triplanarMapping (sampler2D texture, vec3 normal, vec3 position) {
    vec3 normalBlend = blendNormal(normal);
    vec3 xColor = texture2D(texture, position.yz).rgb;
    vec3 yColor = texture2D(texture, position.xz).rgb;
    vec3 zColor = texture2D(texture, position.xy).rgb;
    return (xColor * normalBlend.x + yColor * normalBlend.y + zColor * normalBlend.z);
}`,Gu=`float blendColorBurn(float base, float blend) {
    return (blend==0.0)?blend:max((1.0-((1.0-base)/blend)),0.0);
}

vec3 blendColorBurn(vec3 base, vec3 blend) {
    return vec3(blendColorBurn(base.r,blend.r),blendColorBurn(base.g,blend.g),blendColorBurn(base.b,blend.b));
}`,Zu=`mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
    mat4 m = rotationMatrix(axis, angle);
    return (m * vec4(v, 1.0)).xyz;
}`,qu=`vec3 blendNormal(vec3 base, vec3 blend) {
	return blend;
}

vec3 blendNormal(vec3 base, vec3 blend, float opacity) {
	return (blendNormal(base, blend) * opacity + base * (1.0 - opacity));
}`,Xu=`float blendScreen(float base, float blend) {
	return 1.0-((1.0-base)*(1.0-blend));
}

vec3 blendScreen(vec3 base, vec3 blend) {
	return vec3(blendScreen(base.r,blend.r),blendScreen(base.g,blend.g),blendScreen(base.b,blend.b));
}

vec3 blendScreen(vec3 base, vec3 blend, float opacity) {
	return (blendScreen(base, blend) * opacity + base * (1.0 - opacity));
}`,Yu=`vec4 blur5(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
  vec4 color = vec4(0.0);
  vec2 off1 = vec2(1.3333333333333333) * direction;
  color += texture2D(image, uv) * 0.29411764705882354;
  color += texture2D(image, uv + (off1 / resolution)) * 0.35294117647058826;
  color += texture2D(image, uv - (off1 / resolution)) * 0.35294117647058826;
  return color; 
}`,Ku=`precision highp float;

vec4 blur5(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
  vec4 color = vec4(0.0);
  vec2 off1 = vec2(1.3333333333333333) * direction;
  color += texture2D(image, uv) * 0.29411764705882354;
  color += texture2D(image, uv + (off1 / resolution)) * 0.35294117647058826;
  color += texture2D(image, uv - (off1 / resolution)) * 0.35294117647058826;
  return color;
}

vec4 blur9(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
  vec4 color = vec4(0.0);
  vec2 off1 = vec2(1.3846153846) * direction;
  vec2 off2 = vec2(3.2307692308) * direction;
  color += texture2D(image, uv) * 0.2270270270;
  color += texture2D(image, uv + (off1 / resolution)) * 0.3162162162;
  color += texture2D(image, uv - (off1 / resolution)) * 0.3162162162;
  color += texture2D(image, uv + (off2 / resolution)) * 0.0702702703;
  color += texture2D(image, uv - (off2 / resolution)) * 0.0702702703;
  return color;
}

uniform sampler2D tMap;
uniform vec2 u_direction;
uniform vec2 u_resolution;
varying vec2 vUv;
void main() {
  
  
  gl_FragColor = blur5(tMap, vUv, u_resolution, u_direction);
}`,Qu=`precision highp float;

uniform sampler2D tMap;
uniform sampler2D t_bloom;
uniform vec2 u_resolution;
uniform float u_bloomStrength;

varying vec2 vUv;

void main() {
  vec4 color = texture2D(tMap, vUv) + texture2D(t_bloom, vUv) * u_bloomStrength;
  
  gl_FragColor = color;
}`,Ju=`precision highp float;

uniform sampler2D tMap;
uniform float u_threshold;

varying vec2 vUv;

void main() {
  vec4 tex = texture2D(tMap, vUv);
  vec4 bright = tex * step(u_threshold, length(tex.rgb) / 1.73205);
  
  gl_FragColor = bright;
}`,ef=`vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
float permute(float x){return floor(mod(((x*34.0)+1.0)*x, 289.0));}

vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float taylorInvSqrt(float r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1. + 3.0 * C.xxx;

  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  float n_ = 1.0/7.0; 
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}

vec4 grad4(float j, vec4 ip){
  const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
  vec4 p,s;

  p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
  p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
  s = vec4(lessThan(p, vec4(0.0)));
  p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www; 

  return p;
}

float snoise(vec4 v){
  const vec2  C = vec2( 0.138196601125010504,  
                        0.309016994374947451); 

  vec4 i  = floor(v + dot(v, C.yyyy) );
  vec4 x0 = v -   i + dot(i, C.xxxx);

  vec4 i0;

  vec3 isX = step( x0.yzw, x0.xxx );
  vec3 isYZ = step( x0.zww, x0.yyz );

  i0.x = isX.x + isX.y + isX.z;
  i0.yzw = 1.0 - isX;

  i0.y += isYZ.x + isYZ.y;
  i0.zw += 1.0 - isYZ.xy;

  i0.z += isYZ.z;
  i0.w += 1.0 - isYZ.z;

  
  vec4 i3 = clamp( i0, 0.0, 1.0 );
  vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
  vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );

  
  vec4 x1 = x0 - i1 + 1.0 * C.xxxx;
  vec4 x2 = x0 - i2 + 2.0 * C.xxxx;
  vec4 x3 = x0 - i3 + 3.0 * C.xxxx;
  vec4 x4 = x0 - 1.0 + 4.0 * C.xxxx;

  i = mod(i, 289.0); 
  float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
  vec4 j1 = permute( permute( permute( permute (
             i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
           + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
           + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
           + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));

  vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;

  vec4 p0 = grad4(j0,   ip);
  vec4 p1 = grad4(j1.x, ip);
  vec4 p2 = grad4(j1.y, ip);
  vec4 p3 = grad4(j1.z, ip);
  vec4 p4 = grad4(j1.w, ip);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  p4 *= taylorInvSqrt(dot(p4,p4));

  vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
  vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
  m0 = m0 * m0;
  m1 = m1 * m1;
  return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
               + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;

}`,tf=`vec3 mod289(vec3 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x)
{
  return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec3 fade(vec3 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}

float pnoise(vec3 P, vec3 rep)
{
  vec3 Pi0 = mod(floor(P), rep); 
  vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); 
  Pi0 = mod289(Pi0);
  Pi1 = mod289(Pi1);
  vec3 Pf0 = fract(P); 
  vec3 Pf1 = Pf0 - vec3(1.0); 
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 * (1.0 / 7.0);
  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 * (1.0 / 7.0);
  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
  return 2.2 * n_xyz;
}`,nf=`float blendColorDodge_14_0(float base, float blend) {
	return (blend==1.0)?blend:min(base/(1.0-blend),1.0);
}

vec3 blendColorDodge_14_0(vec3 base, vec3 blend) {
	return vec3(blendColorDodge_14_0(base.r,blend.r),blendColorDodge_14_0(base.g,blend.g),blendColorDodge_14_0(base.b,blend.b));
}

vec3 blendColorDodge_14_0(vec3 base, vec3 blend, float opacity) {
	return (blendColorDodge_14_0(base, blend) * opacity + base * (1.0 - opacity));
}

float blendColorBurn_15_1(float base, float blend) {
	return (blend==0.0)?blend:max((1.0-((1.0-base)/blend)),0.0);
}

vec3 blendColorBurn_15_1(vec3 base, vec3 blend) {
	return vec3(blendColorBurn_15_1(base.r,blend.r),blendColorBurn_15_1(base.g,blend.g),blendColorBurn_15_1(base.b,blend.b));
}

vec3 blendColorBurn_15_1(vec3 base, vec3 blend, float opacity) {
	return (blendColorBurn_15_1(base, blend) * opacity + base * (1.0 - opacity));
}

float blendVividLight_3_2(float base, float blend) {
	return (blend<0.5)?blendColorBurn_15_1(base,(2.0*blend)):blendColorDodge_14_0(base,(2.0*(blend-0.5)));
}

vec3 blendVividLight_3_2(vec3 base, vec3 blend) {
	return vec3(blendVividLight_3_2(base.r,blend.r),blendVividLight_3_2(base.g,blend.g),blendVividLight_3_2(base.b,blend.b));
}

vec3 blendVividLight_3_2(vec3 base, vec3 blend, float opacity) {
	return (blendVividLight_3_2(base, blend) * opacity + base * (1.0 - opacity));
}

float blendHardMix_2_3(float base, float blend) {
	return (blendVividLight_3_2(base,blend)<0.5)?0.0:1.0;
}

vec3 blendHardMix_2_3(vec3 base, vec3 blend) {
	return vec3(blendHardMix_2_3(base.r,blend.r),blendHardMix_2_3(base.g,blend.g),blendHardMix_2_3(base.b,blend.b));
}

vec3 blendHardMix_2_3(vec3 base, vec3 blend, float opacity) {
	return (blendHardMix_2_3(base, blend) * opacity + base * (1.0 - opacity));
}

float blendLinearDodge_12_4(float base, float blend) {
	
	return min(base+blend,1.0);
}

vec3 blendLinearDodge_12_4(vec3 base, vec3 blend) {
	
	return min(base+blend,vec3(1.0));
}

vec3 blendLinearDodge_12_4(vec3 base, vec3 blend, float opacity) {
	return (blendLinearDodge_12_4(base, blend) * opacity + base * (1.0 - opacity));
}

float blendLinearBurn_13_5(float base, float blend) {
	
	return max(base+blend-1.0,0.0);
}

vec3 blendLinearBurn_13_5(vec3 base, vec3 blend) {
	
	return max(base+blend-vec3(1.0),vec3(0.0));
}

vec3 blendLinearBurn_13_5(vec3 base, vec3 blend, float opacity) {
	return (blendLinearBurn_13_5(base, blend) * opacity + base * (1.0 - opacity));
}

float blendLinearLight_4_6(float base, float blend) {
	return blend<0.5?blendLinearBurn_13_5(base,(2.0*blend)):blendLinearDodge_12_4(base,(2.0*(blend-0.5)));
}

vec3 blendLinearLight_4_6(vec3 base, vec3 blend) {
	return vec3(blendLinearLight_4_6(base.r,blend.r),blendLinearLight_4_6(base.g,blend.g),blendLinearLight_4_6(base.b,blend.b));
}

vec3 blendLinearLight_4_6(vec3 base, vec3 blend, float opacity) {
	return (blendLinearLight_4_6(base, blend) * opacity + base * (1.0 - opacity));
}

float blendLighten_16_7(float base, float blend) {
	return max(blend,base);
}

vec3 blendLighten_16_7(vec3 base, vec3 blend) {
	return vec3(blendLighten_16_7(base.r,blend.r),blendLighten_16_7(base.g,blend.g),blendLighten_16_7(base.b,blend.b));
}

vec3 blendLighten_16_7(vec3 base, vec3 blend, float opacity) {
	return (blendLighten_16_7(base, blend) * opacity + base * (1.0 - opacity));
}

float blendDarken_17_8(float base, float blend) {
	return min(blend,base);
}

vec3 blendDarken_17_8(vec3 base, vec3 blend) {
	return vec3(blendDarken_17_8(base.r,blend.r),blendDarken_17_8(base.g,blend.g),blendDarken_17_8(base.b,blend.b));
}

vec3 blendDarken_17_8(vec3 base, vec3 blend, float opacity) {
	return (blendDarken_17_8(base, blend) * opacity + base * (1.0 - opacity));
}

float blendPinLight_5_9(float base, float blend) {
	return (blend<0.5)?blendDarken_17_8(base,(2.0*blend)):blendLighten_16_7(base,(2.0*(blend-0.5)));
}

vec3 blendPinLight_5_9(vec3 base, vec3 blend) {
	return vec3(blendPinLight_5_9(base.r,blend.r),blendPinLight_5_9(base.g,blend.g),blendPinLight_5_9(base.b,blend.b));
}

vec3 blendPinLight_5_9(vec3 base, vec3 blend, float opacity) {
	return (blendPinLight_5_9(base, blend) * opacity + base * (1.0 - opacity));
}

float blendReflect_18_10(float base, float blend) {
	return (blend==1.0)?blend:min(base*base/(1.0-blend),1.0);
}

vec3 blendReflect_18_10(vec3 base, vec3 blend) {
	return vec3(blendReflect_18_10(base.r,blend.r),blendReflect_18_10(base.g,blend.g),blendReflect_18_10(base.b,blend.b));
}

vec3 blendReflect_18_10(vec3 base, vec3 blend, float opacity) {
	return (blendReflect_18_10(base, blend) * opacity + base * (1.0 - opacity));
}

vec3 blendGlow_6_11(vec3 base, vec3 blend) {
	return blendReflect_18_10(blend,base);
}

vec3 blendGlow_6_11(vec3 base, vec3 blend, float opacity) {
	return (blendGlow_6_11(base, blend) * opacity + base * (1.0 - opacity));
}

float blendOverlay_9_12(float base, float blend) {
	return base<0.5?(2.0*base*blend):(1.0-2.0*(1.0-base)*(1.0-blend));
}

vec3 blendOverlay_9_12(vec3 base, vec3 blend) {
	return vec3(blendOverlay_9_12(base.r,blend.r),blendOverlay_9_12(base.g,blend.g),blendOverlay_9_12(base.b,blend.b));
}

vec3 blendOverlay_9_12(vec3 base, vec3 blend, float opacity) {
	return (blendOverlay_9_12(base, blend) * opacity + base * (1.0 - opacity));
}

vec3 blendHardLight_7_13(vec3 base, vec3 blend) {
	return blendOverlay_9_12(blend,base);
}

vec3 blendHardLight_7_13(vec3 base, vec3 blend, float opacity) {
	return (blendHardLight_7_13(base, blend) * opacity + base * (1.0 - opacity));
}

vec3 blendPhoenix_8_14(vec3 base, vec3 blend) {
	return min(base,blend)-max(base,blend)+vec3(1.0);
}

vec3 blendPhoenix_8_14(vec3 base, vec3 blend, float opacity) {
	return (blendPhoenix_8_14(base, blend) * opacity + base * (1.0 - opacity));
}

vec3 blendNormal_10_15(vec3 base, vec3 blend) {
	return blend;
}

vec3 blendNormal_10_15(vec3 base, vec3 blend, float opacity) {
	return (blendNormal_10_15(base, blend) * opacity + base * (1.0 - opacity));
}

vec3 blendNegation_11_16(vec3 base, vec3 blend) {
	return vec3(1.0)-abs(vec3(1.0)-base-blend);
}

vec3 blendNegation_11_16(vec3 base, vec3 blend, float opacity) {
	return (blendNegation_11_16(base, blend) * opacity + base * (1.0 - opacity));
}

vec3 blendMultiply_19_17(vec3 base, vec3 blend) {
	return base*blend;
}

vec3 blendMultiply_19_17(vec3 base, vec3 blend, float opacity) {
	return (blendMultiply_19_17(base, blend) * opacity + base * (1.0 - opacity));
}

vec3 blendAverage_20_18(vec3 base, vec3 blend) {
	return (base+blend)/2.0;
}

vec3 blendAverage_20_18(vec3 base, vec3 blend, float opacity) {
	return (blendAverage_20_18(base, blend) * opacity + base * (1.0 - opacity));
}

float blendScreen_21_19(float base, float blend) {
	return 1.0-((1.0-base)*(1.0-blend));
}

vec3 blendScreen_21_19(vec3 base, vec3 blend) {
	return vec3(blendScreen_21_19(base.r,blend.r),blendScreen_21_19(base.g,blend.g),blendScreen_21_19(base.b,blend.b));
}

vec3 blendScreen_21_19(vec3 base, vec3 blend, float opacity) {
	return (blendScreen_21_19(base, blend) * opacity + base * (1.0 - opacity));
}

float blendSoftLight_22_20(float base, float blend) {
	return (blend<0.5)?(2.0*base*blend+base*base*(1.0-2.0*blend)):(sqrt(base)*(2.0*blend-1.0)+2.0*base*(1.0-blend));
}

vec3 blendSoftLight_22_20(vec3 base, vec3 blend) {
	return vec3(blendSoftLight_22_20(base.r,blend.r),blendSoftLight_22_20(base.g,blend.g),blendSoftLight_22_20(base.b,blend.b));
}

vec3 blendSoftLight_22_20(vec3 base, vec3 blend, float opacity) {
	return (blendSoftLight_22_20(base, blend) * opacity + base * (1.0 - opacity));
}

float blendSubtract_23_21(float base, float blend) {
	return max(base+blend-1.0,0.0);
}

vec3 blendSubtract_23_21(vec3 base, vec3 blend) {
	return max(base+blend-vec3(1.0),vec3(0.0));
}

vec3 blendSubtract_23_21(vec3 base, vec3 blend, float opacity) {
	return (blendSubtract_23_21(base, blend) * opacity + base * (1.0 - opacity));
}

vec3 blendExclusion_24_22(vec3 base, vec3 blend) {
	return base+blend-2.0*base*blend;
}

vec3 blendExclusion_24_22(vec3 base, vec3 blend, float opacity) {
	return (blendExclusion_24_22(base, blend) * opacity + base * (1.0 - opacity));
}

vec3 blendDifference_25_23(vec3 base, vec3 blend) {
	return abs(base-blend);
}

vec3 blendDifference_25_23(vec3 base, vec3 blend, float opacity) {
	return (blendDifference_25_23(base, blend) * opacity + base * (1.0 - opacity));
}

float blendAdd_26_24(float base, float blend) {
	return min(base+blend,1.0);
}

vec3 blendAdd_26_24(vec3 base, vec3 blend) {
	return min(base+blend,vec3(1.0));
}

vec3 blendAdd_26_24(vec3 base, vec3 blend, float opacity) {
	return (blendAdd_26_24(base, blend) * opacity + base * (1.0 - opacity));
}

vec3 blendMode_1_25( int mode, vec3 base, vec3 blend ){
	if( mode == 1 ){
		return blendAdd_26_24( base, blend );
	}else
	if( mode == 2 ){
		return blendAverage_20_18( base, blend );
	}else
	if( mode == 3 ){
		return blendColorBurn_15_1( base, blend );
	}else
	if( mode == 4 ){
		return blendColorDodge_14_0( base, blend );
	}else
	if( mode == 5 ){
		return blendDarken_17_8( base, blend );
	}else
	if( mode == 6 ){
		return blendDifference_25_23( base, blend );
	}else
	if( mode == 7 ){
		return blendExclusion_24_22( base, blend );
	}else
	if( mode == 8 ){
		return blendGlow_6_11( base, blend );
	}else
	if( mode == 9 ){
		return blendHardLight_7_13( base, blend );
	}else
	if( mode == 10 ){
		return blendHardMix_2_3( base, blend );
	}else
	if( mode == 11 ){
		return blendLighten_16_7( base, blend );
	}else
	if( mode == 12 ){
		return blendLinearBurn_13_5( base, blend );
	}else
	if( mode == 13 ){
		return blendLinearDodge_12_4( base, blend );
	}else
	if( mode == 14 ){
		return blendLinearLight_4_6( base, blend );
	}else
	if( mode == 15 ){
		return blendMultiply_19_17( base, blend );
	}else
	if( mode == 16 ){
		return blendNegation_11_16( base, blend );
	}else
	if( mode == 17 ){
		return blendNormal_10_15( base, blend );
	}else
	if( mode == 18 ){
		return blendOverlay_9_12( base, blend );
	}else
	if( mode == 19 ){
		return blendPhoenix_8_14( base, blend );
	}else
	if( mode == 20 ){
		return blendPinLight_5_9( base, blend );
	}else
	if( mode == 21 ){
		return blendReflect_18_10( base, blend );
	}else
	if( mode == 22 ){
		return blendScreen_21_19( base, blend );
	}else
	if( mode == 23 ){
		return blendSoftLight_22_20( base, blend );
	}else
	if( mode == 24 ){
		return blendSubtract_23_21( base, blend );
	}else
	if( mode == 25 ){
		return blendVividLight_3_2( base, blend );
	}
}

vec3 blendMode_1_25( int mode, vec3 base, vec3 blend, float opacity ){
	if( mode == 1 ){
		return blendAdd_26_24( base, blend, opacity );
	}else
	if( mode == 2 ){
		return blendAverage_20_18( base, blend, opacity );
	}else
	if( mode == 3 ){
		return blendColorBurn_15_1( base, blend, opacity );
	}else
	if( mode == 4 ){
		return blendColorDodge_14_0( base, blend, opacity );
	}else
	if( mode == 5 ){
		return blendDarken_17_8( base, blend, opacity );
	}else
	if( mode == 6 ){
		return blendDifference_25_23( base, blend, opacity );
	}else
	if( mode == 7 ){
		return blendExclusion_24_22( base, blend, opacity );
	}else
	if( mode == 8 ){
		return blendGlow_6_11( base, blend, opacity );
	}else
	if( mode == 9 ){
		return blendHardLight_7_13( base, blend, opacity );
	}else
	if( mode == 10 ){
		return blendHardMix_2_3( base, blend, opacity );
	}else
	if( mode == 11 ){
		return blendLighten_16_7( base, blend, opacity );
	}else
	if( mode == 12 ){
		return blendLinearBurn_13_5( base, blend, opacity );
	}else
	if( mode == 13 ){
		return blendLinearDodge_12_4( base, blend, opacity );
	}else
	if( mode == 14 ){
		return blendLinearLight_4_6( base, blend, opacity );
	}else
	if( mode == 15 ){
		return blendMultiply_19_17( base, blend, opacity );
	}else
	if( mode == 16 ){
		return blendNegation_11_16( base, blend, opacity );
	}else
	if( mode == 17 ){
		return blendNormal_10_15( base, blend, opacity );
	}else
	if( mode == 18 ){
		return blendOverlay_9_12( base, blend, opacity );
	}else
	if( mode == 19 ){
		return blendPhoenix_8_14( base, blend, opacity );
	}else
	if( mode == 20 ){
		return blendPinLight_5_9( base, blend, opacity );
	}else
	if( mode == 21 ){
		return blendReflect_18_10( base, blend, opacity );
	}else
	if( mode == 22 ){
		return blendScreen_21_19( base, blend, opacity );
	}else
	if( mode == 23 ){
		return blendSoftLight_22_20( base, blend, opacity );
	}else
	if( mode == 24 ){
		return blendSubtract_23_21( base, blend, opacity );
	}else
	if( mode == 25 ){
		return blendVividLight_3_2( base, blend, opacity );
	}
}`,rf=`vec3 contrast(vec3 color, float value) {
    return clamp(0.5 + (1.0 + value) * (color - 0.5), vec3(0.), vec3(1.));
}
vec3 exposure(vec3 color, float value) {
    return (1.0 + value) * color;
}
vec3 czm_saturation(vec3 rgb, float adjustment) {
    const vec3 W = vec3(0.2125, 0.7154, 0.0721);
    vec3 intensity = vec3(dot(rgb, W));
    return mix(intensity, rgb, adjustment);
}
vec3 hueShift(vec3 color, float hue) {
    const vec3 k = vec3(0.57735, 0.57735, 0.57735);
    float cosAngle = cos(hue);
    return vec3(color * cosAngle + cross(k, color) * sin(hue) + k * dot(k, color) * (1.0 - cosAngle));
}
vec3 linearToneMapping(vec3 color, float gamma) {
    float exposure = 1.;
    color = clamp(exposure * color, 0., 1.);
    color = pow(color, vec3(1. / gamma));
    return color;
}`,sf=`varying vec2 v_rgbNW;
varying vec2 v_rgbNE;
varying vec2 v_rgbSW;
varying vec2 v_rgbSE;
varying vec2 v_rgbM;

void texcoords(vec2 fragCoord, vec2 resolution,
            out vec2 v_rgbNW, out vec2 v_rgbNE,
            out vec2 v_rgbSW, out vec2 v_rgbSE,
            out vec2 v_rgbM) {
    vec2 inverseVP = 1.0 / resolution.xy;
    v_rgbNW = (fragCoord + vec2(-1.0, -1.0)) * inverseVP;
    v_rgbNE = (fragCoord + vec2(1.0, -1.0)) * inverseVP;
    v_rgbSW = (fragCoord + vec2(-1.0, 1.0)) * inverseVP;
    v_rgbSE = (fragCoord + vec2(1.0, 1.0)) * inverseVP;
    v_rgbM = vec2(fragCoord * inverseVP);
}

#ifndef FXAA_REDUCE_MIN
    #define FXAA_REDUCE_MIN   (1.0/ 128.0)
#endif
#ifndef FXAA_REDUCE_MUL
    #define FXAA_REDUCE_MUL   (1.0 / 8.0)
#endif
#ifndef FXAA_SPAN_MAX
    #define FXAA_SPAN_MAX     8.0
#endif

vec4 fxaa(sampler2D tex, vec2 fragCoord, vec2 resolution,
            vec2 v_rgbNW, vec2 v_rgbNE, 
            vec2 v_rgbSW, vec2 v_rgbSE, 
            vec2 v_rgbM) {
    vec4 color;
    mediump vec2 inverseVP = vec2(1.0 / resolution.x, 1.0 / resolution.y);
    vec3 rgbNW = texture2D(tex, v_rgbNW).xyz;
    vec3 rgbNE = texture2D(tex, v_rgbNE).xyz;
    vec3 rgbSW = texture2D(tex, v_rgbSW).xyz;
    vec3 rgbSE = texture2D(tex, v_rgbSE).xyz;
    vec4 texColor = texture2D(tex, v_rgbM);
    vec3 rgbM  = texColor.xyz;
    vec3 luma = vec3(0.299, 0.587, 0.114);
    float lumaNW = dot(rgbNW, luma);
    float lumaNE = dot(rgbNE, luma);
    float lumaSW = dot(rgbSW, luma);
    float lumaSE = dot(rgbSE, luma);
    float lumaM  = dot(rgbM,  luma);
    float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));
    float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));
    
    mediump vec2 dir;
    dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));
    dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));
    
    float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) *
                          (0.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);
    
    float rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);
    dir = min(vec2(FXAA_SPAN_MAX, FXAA_SPAN_MAX),
              max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),
              dir * rcpDirMin)) * inverseVP;
    
    vec3 rgbA = 0.5 * (
        texture2D(tex, fragCoord * inverseVP + dir * (1.0 / 3.0 - 0.5)).xyz +
        texture2D(tex, fragCoord * inverseVP + dir * (2.0 / 3.0 - 0.5)).xyz);
    vec3 rgbB = rgbA * 0.5 + 0.25 * (
        texture2D(tex, fragCoord * inverseVP + dir * -0.5).xyz +
        texture2D(tex, fragCoord * inverseVP + dir * 0.5).xyz);

    float lumaB = dot(rgbB, luma);
    if ((lumaB < lumaMin) || (lumaB > lumaMax))
        color = vec4(rgbA, texColor.a);
    else
        color = vec4(rgbB, texColor.a);
    return color;
}`;const mt={ground:Bu,background:zu,flare:Nu,grid:ku,post:$u,postBlur:Wu,MSDFUnlit:ju,MSDFUnlitAnimated:Vu,commons:{triplanar:Hu,colorBurn:Gu,rotation:Zu,blur:Yu,noise:ef,pnoise:tf,blurPost:Ku,composite:Qu,bright:Ju,allBlendModes:nf,normalBlending:qu,screenBlending:Xu,colorCorrection:rf,fxaa:sf}};if(!String.prototype.replaceAll){let t=function(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")};var g2=t;String.prototype.replaceAll=function(e,n){return Object.prototype.toString.call(e).toLowerCase()==="[object regexp]"?this.replace(e,n):this.replace(new RegExp(t(e),"g"),n)}}class Sn{constructor(e,n=1,i={},r=!1,s=!1){this.string=e,this.defines=i;let a=function(f){let d="";for(let p in f)d+="#define "+p+" "+f[p]+`
`;return d},o={},l=ki.render(this.string,{frag:!0,vert:!1,passes:o,commons:mt.commons,defines:i}),h=ki.render(this.string,{frag:!1,vert:!0,passes:o,commons:mt.commons,defines:i});Et.gl;let c="";l=l.replaceAll("&lt;","<"),l=l.replaceAll("&gt;",">"),h=h.replaceAll("&lt;","<"),h=h.replaceAll("&gt;",">"),e.includes("needES300")&&(e=e.replaceAll("needES300",""),l=l.replaceAll("needES300",""),h=h.replaceAll("needES300",""),Et.renderer.isWebgl2?c+=`#version 300 es
`:(this.defines.IS_WEBGL_1=1,c+=`#extension GL_OES_standard_derivatives : enable
`,h=h.replaceAll("texture(","texture2D("),h=h.replaceAll("in ","attribute "),h=h.replaceAll("out ","varying "),l=l.replaceAll("texture(","texture2D("),l=l.replaceAll("in ","varying "),l=l.replaceAll("out ","// ")));let u=a(this.defines);if(n>1){this.passes=[];for(let f=0;f<n-1;f++){o["pass_"+(f+1)]=!0;let d=ki.render(this.string,{frag:!1,vert:!1,passes:o,commons:mt.commons,defines:i});d=d.replaceAll("&lt;","<"),d=d.replaceAll("&gt;",">"),this.passes.push(c+u+d),o["pass_"+(f+1)]=!1}}this.frag=c+u+l,this.vert=c+u+h,this.attributesCount=r,this.uniformsCount=s}}function la(t){let e=t[0],n=t[1],i=t[2];return Math.sqrt(e*e+n*n+i*i)}function mr(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t}function af(t,e,n,i){return t[0]=e,t[1]=n,t[2]=i,t}function ca(t,e,n){return t[0]=e[0]+n[0],t[1]=e[1]+n[1],t[2]=e[2]+n[2],t}function ha(t,e,n){return t[0]=e[0]-n[0],t[1]=e[1]-n[1],t[2]=e[2]-n[2],t}function of(t,e,n){return t[0]=e[0]*n[0],t[1]=e[1]*n[1],t[2]=e[2]*n[2],t}function lf(t,e,n){return t[0]=e[0]/n[0],t[1]=e[1]/n[1],t[2]=e[2]/n[2],t}function $i(t,e,n){return t[0]=e[0]*n,t[1]=e[1]*n,t[2]=e[2]*n,t}function cf(t,e){let n=e[0]-t[0],i=e[1]-t[1],r=e[2]-t[2];return Math.sqrt(n*n+i*i+r*r)}function hf(t,e){let n=e[0]-t[0],i=e[1]-t[1],r=e[2]-t[2];return n*n+i*i+r*r}function ua(t){let e=t[0],n=t[1],i=t[2];return e*e+n*n+i*i}function uf(t,e){return t[0]=-e[0],t[1]=-e[1],t[2]=-e[2],t}function ff(t,e){return t[0]=1/e[0],t[1]=1/e[1],t[2]=1/e[2],t}function vr(t,e){let n=e[0],i=e[1],r=e[2],s=n*n+i*i+r*r;return s>0&&(s=1/Math.sqrt(s)),t[0]=e[0]*s,t[1]=e[1]*s,t[2]=e[2]*s,t}function Yo(t,e){return t[0]*e[0]+t[1]*e[1]+t[2]*e[2]}function fa(t,e,n){let i=e[0],r=e[1],s=e[2],a=n[0],o=n[1],l=n[2];return t[0]=r*l-s*o,t[1]=s*a-i*l,t[2]=i*o-r*a,t}function df(t,e,n,i){let r=e[0],s=e[1],a=e[2];return t[0]=r+i*(n[0]-r),t[1]=s+i*(n[1]-s),t[2]=a+i*(n[2]-a),t}function pf(t,e,n){let i=e[0],r=e[1],s=e[2],a=n[3]*i+n[7]*r+n[11]*s+n[15];return a=a||1,t[0]=(n[0]*i+n[4]*r+n[8]*s+n[12])/a,t[1]=(n[1]*i+n[5]*r+n[9]*s+n[13])/a,t[2]=(n[2]*i+n[6]*r+n[10]*s+n[14])/a,t}function gf(t,e,n){let i=e[0],r=e[1],s=e[2],a=n[3]*i+n[7]*r+n[11]*s+n[15];return a=a||1,t[0]=(n[0]*i+n[4]*r+n[8]*s)/a,t[1]=(n[1]*i+n[5]*r+n[9]*s)/a,t[2]=(n[2]*i+n[6]*r+n[10]*s)/a,t}function mf(t,e,n){let i=e[0],r=e[1],s=e[2],a=n[0],o=n[1],l=n[2],h=n[3],c=o*s-l*r,u=l*i-a*s,f=a*r-o*i,d=o*f-l*u,p=l*c-a*f,m=a*u-o*c,x=h*2;return c*=x,u*=x,f*=x,d*=2,p*=2,m*=2,t[0]=i+c+d,t[1]=r+u+p,t[2]=s+f+m,t}const vf=function(){const t=[0,0,0],e=[0,0,0];return function(n,i){mr(t,n),mr(e,i),vr(t,t),vr(e,e);let r=Yo(t,e);return r>1?0:r<-1?Math.PI:Math.acos(r)}}();function bf(t,e){return t[0]===e[0]&&t[1]===e[1]&&t[2]===e[2]}class ue extends Array{constructor(e=0,n=e,i=e){return super(e,n,i),this}get x(){return this[0]}get y(){return this[1]}get z(){return this[2]}set x(e){this[0]=e}set y(e){this[1]=e}set z(e){this[2]=e}set(e,n=e,i=e){return e.length?this.copy(e):(af(this,e,n,i),this)}copy(e){return mr(this,e),this}add(e,n){return n?ca(this,e,n):ca(this,this,e),this}sub(e,n){return n?ha(this,e,n):ha(this,this,e),this}multiply(e){return e.length?of(this,this,e):$i(this,this,e),this}divide(e){return e.length?lf(this,this,e):$i(this,this,1/e),this}inverse(e=this){return ff(this,e),this}len(){return la(this)}distance(e){return e?cf(this,e):la(this)}squaredLen(){return ua(this)}squaredDistance(e){return e?hf(this,e):ua(this)}negate(e=this){return uf(this,e),this}cross(e,n){return n?fa(this,e,n):fa(this,this,e),this}scale(e){return $i(this,this,e),this}normalize(){return vr(this,this),this}dot(e){return Yo(this,e)}equals(e){return bf(this,e)}applyMatrix4(e){return pf(this,this,e),this}scaleRotateMatrix4(e){return gf(this,this,e),this}applyQuaternion(e){return mf(this,this,e),this}angle(e){return vf(this,e)}lerp(e,n){return df(this,this,e,n),this}clone(){return new ue(this[0],this[1],this[2])}fromArray(e,n=0){return this[0]=e[n],this[1]=e[n+1],this[2]=e[n+2],this}toArray(e=[],n=0){return e[n]=this[0],e[n+1]=this[1],e[n+2]=this[2],e}transformDirection(e){const n=this[0],i=this[1],r=this[2];return this[0]=e[0]*n+e[4]*i+e[8]*r,this[1]=e[1]*n+e[5]*i+e[9]*r,this[2]=e[2]*n+e[6]*i+e[10]*r,this.normalize()}}const da=new ue;let xf=1,_f=1,pa=!1;class mi{constructor(e,n={}){e.canvas||console.error("gl not passed as first argument to Geometry"),this.gl=e,this.attributes=n,this.id=xf++,this.VAOs={},this.drawRange={start:0,count:0},this.instancedCount=0,this.gl.renderer.bindVertexArray(null),this.gl.renderer.currentGeometry=null,this.glState=this.gl.renderer.state;for(let i in n)this.addAttribute(i,n[i])}addAttribute(e,n){if(this.attributes[e]=n,n.id=_f++,n.size=n.size||1,n.type=n.type||(n.data.constructor===Float32Array?this.gl.FLOAT:n.data.constructor===Uint16Array?this.gl.UNSIGNED_SHORT:this.gl.UNSIGNED_INT),n.target=e==="index"?this.gl.ELEMENT_ARRAY_BUFFER:this.gl.ARRAY_BUFFER,n.normalized=n.normalized||!1,n.stride=n.stride||0,n.offset=n.offset||0,n.count=n.count||(n.stride?n.data.byteLength/n.stride:n.data.length/n.size),n.divisor=n.instanced||0,n.needsUpdate=!1,n.buffer||(n.buffer=this.gl.createBuffer(),this.updateAttribute(n)),n.divisor){if(this.isInstanced=!0,this.instancedCount&&this.instancedCount!==n.count*n.divisor)return console.warn("geometry has multiple instanced buffers of different length"),this.instancedCount=Math.min(this.instancedCount,n.count*n.divisor);this.instancedCount=n.count*n.divisor}else e==="index"?this.drawRange.count=n.count:this.attributes.index||(this.drawRange.count=Math.max(this.drawRange.count,n.count))}updateAttribute(e){this.glState.boundBuffer!==e.buffer&&(this.gl.bindBuffer(e.target,e.buffer),this.glState.boundBuffer=e.buffer),this.gl.bufferData(e.target,e.data,this.gl.STATIC_DRAW),e.needsUpdate=!1}setIndex(e){this.addAttribute("index",e)}setDrawRange(e,n){this.drawRange.start=e,this.drawRange.count=n}setInstancedCount(e){this.instancedCount=e}createVAO(e){this.VAOs[e.attributeOrder]=this.gl.renderer.createVertexArray(),this.gl.renderer.bindVertexArray(this.VAOs[e.attributeOrder]),this.bindAttributes(e)}bindAttributes(e){e.attributeLocations.forEach((n,{name:i,type:r})=>{if(!this.attributes[i]){console.warn(`active attribute ${i} not being supplied`);return}const s=this.attributes[i];this.gl.bindBuffer(s.target,s.buffer),this.glState.boundBuffer=s.buffer;let a=1;r===35674&&(a=2),r===35675&&(a=3),r===35676&&(a=4);const o=s.size/a,l=a===1?0:a*a*a,h=a===1?0:a*a;for(let c=0;c<a;c++)this.gl.vertexAttribPointer(n+c,o,s.type,s.normalized,s.stride+l,s.offset+c*h),this.gl.enableVertexAttribArray(n+c),this.gl.renderer.vertexAttribDivisor(n+c,s.divisor)}),this.attributes.index&&this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER,this.attributes.index.buffer)}draw({program:e,mode:n=this.gl.TRIANGLES}){this.gl.renderer.currentGeometry!==`${this.id}_${e.attributeOrder}`&&(this.VAOs[e.attributeOrder]||this.createVAO(e),this.gl.renderer.bindVertexArray(this.VAOs[e.attributeOrder]),this.gl.renderer.currentGeometry=`${this.id}_${e.attributeOrder}`),e.attributeLocations.forEach((i,{name:r})=>{const s=this.attributes[r];s.needsUpdate&&this.updateAttribute(s)}),this.isInstanced?this.attributes.index?this.gl.renderer.drawElementsInstanced(n,this.drawRange.count,this.attributes.index.type,this.attributes.index.offset+this.drawRange.start*2,this.instancedCount):this.gl.renderer.drawArraysInstanced(n,this.drawRange.start,this.drawRange.count,this.instancedCount):this.attributes.index?this.gl.drawElements(n,this.drawRange.count,this.attributes.index.type,this.attributes.index.offset+this.drawRange.start*2):this.gl.drawArrays(n,this.drawRange.start,this.drawRange.count)}getPosition(){const e=this.attributes.position;if(e.data)return e;if(!pa)return console.warn("No position buffer data found to compute bounds"),pa=!0}computeBoundingBox(e){e||(e=this.getPosition());const n=e.data,i=e.offset||0,r=e.stride||e.size;this.bounds||(this.bounds={min:new ue,max:new ue,center:new ue,scale:new ue,radius:1/0});const s=this.bounds.min,a=this.bounds.max,o=this.bounds.center,l=this.bounds.scale;s.set(1/0),a.set(-1/0);for(let h=i,c=n.length;h<c;h+=r){const u=n[h],f=n[h+1],d=n[h+2];s.x=Math.min(u,s.x),s.y=Math.min(f,s.y),s.z=Math.min(d,s.z),a.x=Math.max(u,a.x),a.y=Math.max(f,a.y),a.z=Math.max(d,a.z)}l.sub(a,s),o.add(s,a).divide(2)}computeBoundingSphere(e){e||(e=this.getPosition());const n=e.data,i=e.offset||0,r=e.stride||e.size;this.bounds||this.computeBoundingBox(e);let s=0;for(let a=i,o=n.length;a<o;a+=r)da.fromArray(n,a),s=Math.max(s,this.bounds.center.squaredDistance(da));this.bounds.radius=Math.sqrt(s)}remove(){for(let e in this.VAOs)this.gl.renderer.deleteVertexArray(this.VAOs[e]),delete this.VAOs[e];for(let e in this.attributes)this.gl.deleteBuffer(this.attributes[e].buffer),delete this.attributes[e]}}class Xt extends mi{constructor(e,{width:n=1,height:i=1,widthSegments:r=1,heightSegments:s=1,attributes:a={}}={}){const o=r,l=s,h=(o+1)*(l+1),c=o*l*6,u=new Float32Array(h*3),f=new Float32Array(h*3),d=new Float32Array(h*2),p=c>65536?new Uint32Array(c):new Uint16Array(c);Xt.buildPlane(u,f,d,p,n,i,0,o,l),Object.assign(a,{position:{size:3,data:u},normal:{size:3,data:f},uv:{size:2,data:d},index:{data:p}}),super(e,a)}static buildPlane(e,n,i,r,s,a,o,l,h,c=0,u=1,f=2,d=1,p=-1,m=0,x=0){const _=m,P=s/l,w=a/h;for(let b=0;b<=h;b++){let M=b*w-a/2;for(let C=0;C<=l;C++,m++){let Z=C*P-s/2;if(e[m*3+c]=Z*d,e[m*3+u]=M*p,e[m*3+f]=o/2,n[m*3+c]=0,n[m*3+u]=0,n[m*3+f]=o>=0?1:-1,i[m*2]=C/l,i[m*2+1]=1-b/h,b===h||C===l)continue;let te=_+C+b*(l+1),re=_+C+(b+1)*(l+1),Q=_+C+(b+1)*(l+1)+1,ne=_+C+b*(l+1)+1;r[x*6]=te,r[x*6+1]=re,r[x*6+2]=ne,r[x*6+3]=re,r[x*6+4]=Q,r[x*6+5]=ne,x++}}}}let yf=1;const ga={};class vi{constructor(e,{vertex:n,fragment:i,uniforms:r={},uniformsCount:s=!1,calcAttributesCount:a=!1,debugShader:o=!0,transparent:l=!1,cullFace:h=e.BACK,frontFace:c=e.CCW,depthTest:u=!0,depthWrite:f=!0,depthFunc:d=e.LESS}={}){oe(this,"calcAttributesCount",e=>{const i=/#version 300 es/.test(e);let r=0;const s=new RegExp(`${i?"in":"attribute"} ([^\\s]+) ([^\\s]+)`,"g");for(const a of e.matchAll(s)){const o=a[2].replace(";",""),l=new RegExp(`(?:^|\\W)${o}(?:$|\\W)`,"g"),h=e.match(l);if(!h){console.error("Attribute name not found in vertex shader",o);continue}h.length>1&&r++}return r});e.canvas||console.error("gl not passed as fist argument to Program"),this.gl=e,this.uniforms=r,this.id=yf++,n||console.warn("vertex shader not supplied"),i||console.warn("fragment shader not supplied"),this.transparent=l,this.cullFace=h,this.frontFace=c,this.depthTest=u,this.depthWrite=f,this.depthFunc=d,this.blendFunc={},this.blendEquation={},this.transparent&&!this.blendFunc.src&&(this.gl.renderer.premultipliedAlpha?this.setBlendFunc(this.gl.ONE,this.gl.ONE_MINUS_SRC_ALPHA):this.setBlendFunc(this.gl.SRC_ALPHA,this.gl.ONE_MINUS_SRC_ALPHA));const p=e.createShader(e.VERTEX_SHADER);e.shaderSource(p,n),e.compileShader(p),o&&e.getShaderInfoLog(p)!==""&&console.warn(`${e.getShaderInfoLog(p)}
Vertex Shader
${ma(n)}`);const m=e.createShader(e.FRAGMENT_SHADER);if(e.shaderSource(m,i),e.compileShader(m),o&&e.getShaderInfoLog(m)!==""&&console.warn(`${e.getShaderInfoLog(m)}
Fragment Shader
${ma(i)}`),this.program=e.createProgram(),e.attachShader(this.program,p),e.attachShader(this.program,m),e.linkProgram(this.program),o&&!e.getProgramParameter(this.program,e.LINK_STATUS))return console.warn(e.getProgramInfoLog(this.program));e.deleteShader(p),e.deleteShader(m),this.uniformLocations=new Map;let x=s||e.getProgramParameter(this.program,e.ACTIVE_UNIFORMS);for(let w=0;w<x;w++){let b=e.getActiveUniform(this.program,w);this.uniformLocations.set(b,e.getUniformLocation(this.program,b.name));const M=b.name.match(/(\w+)/g);b.uniformName=M[0],M.length===3?(b.isStructArray=!0,b.structIndex=Number(M[1]),b.structProperty=M[2]):M.length===2&&isNaN(Number(M[1]))&&(b.isStruct=!0,b.structProperty=M[1])}this.attributeLocations=new Map;const _=[],P=a?this.calcAttributesCount(n):e.getProgramParameter(this.program,e.ACTIVE_ATTRIBUTES);for(let w=0;w<P;w++){const b=e.getActiveAttrib(this.program,w),M=e.getAttribLocation(this.program,b.name);_[M]=b.name,this.attributeLocations.set(b,M)}this.attributeOrder=_.join("")}setBlendFunc(e,n,i,r){this.blendFunc.src=e,this.blendFunc.dst=n,this.blendFunc.srcAlpha=i,this.blendFunc.dstAlpha=r,e&&(this.transparent=!0)}setBlendEquation(e,n){this.blendEquation.modeRGB=e,this.blendEquation.modeAlpha=n}applyState(){this.depthTest?this.gl.renderer.enable(this.gl.DEPTH_TEST):this.gl.renderer.disable(this.gl.DEPTH_TEST),this.cullFace?this.gl.renderer.enable(this.gl.CULL_FACE):this.gl.renderer.disable(this.gl.CULL_FACE),this.blendFunc.src?this.gl.renderer.enable(this.gl.BLEND):this.gl.renderer.disable(this.gl.BLEND),this.cullFace&&this.gl.renderer.setCullFace(this.cullFace),this.gl.renderer.setFrontFace(this.frontFace),this.gl.renderer.setDepthMask(this.depthWrite),this.gl.renderer.setDepthFunc(this.depthFunc),this.blendFunc.src&&this.gl.renderer.setBlendFunc(this.blendFunc.src,this.blendFunc.dst,this.blendFunc.srcAlpha,this.blendFunc.dstAlpha),this.gl.renderer.setBlendEquation(this.blendEquation.modeRGB,this.blendEquation.modeAlpha)}use({flipFaces:e=!1}={}){let n=-1;this.gl.renderer.currentProgram===this.id||(this.gl.useProgram(this.program),this.gl.renderer.currentProgram=this.id),this.uniformLocations.forEach((r,s)=>{let a=s.uniformName,o=this.uniforms[a];if(s.isStruct&&(o=o[s.structProperty],a+=`.${s.structProperty}`),s.isStructArray&&(o=o[s.structIndex][s.structProperty],a+=`[${s.structIndex}].${s.structProperty}`),!o)return va(`Active uniform ${a} has not been supplied`);if(o&&o.value===void 0)return va(`${a} uniform is missing a value parameter`);if(o.value.texture)return n=n+1,o.value.update(n),Wi(this.gl,s.type,r,n);if(o.value.length&&o.value[0].texture){const l=[];return o.value.forEach(h=>{n=n+1,h.update(n),l.push(n)}),Wi(this.gl,s.type,r,l)}Wi(this.gl,s.type,r,o.value)}),this.applyState(),e&&this.gl.renderer.setFrontFace(this.frontFace===this.gl.CCW?this.gl.CW:this.gl.CCW)}remove(){this.gl.deleteProgram(this.program)}}function Wi(t,e,n,i){i=i.length?wf(i):i;const r=t.renderer.state.uniformLocations.get(n);if(i.length)if(r===void 0||r.length!==i.length)t.renderer.state.uniformLocations.set(n,i.slice(0));else{if(Ef(r,i))return;r.set?r.set(i):Af(r,i),t.renderer.state.uniformLocations.set(n,r)}else{if(r===i)return;t.renderer.state.uniformLocations.set(n,i)}switch(e){case 5126:return i.length?t.uniform1fv(n,i):t.uniform1f(n,i);case 35664:return t.uniform2fv(n,i);case 35665:return t.uniform3fv(n,i);case 35666:return t.uniform4fv(n,i);case 35670:case 5124:case 35678:case 35680:return i.length?t.uniform1iv(n,i):t.uniform1i(n,i);case 35671:case 35667:return t.uniform2iv(n,i);case 35672:case 35668:return t.uniform3iv(n,i);case 35673:case 35669:return t.uniform4iv(n,i);case 35674:return t.uniformMatrix2fv(n,!1,i);case 35675:return t.uniformMatrix3fv(n,!1,i);case 35676:return t.uniformMatrix4fv(n,!1,i)}}function ma(t){let e=t.split(`
`);for(let n=0;n<e.length;n++)e[n]=n+1+": "+e[n];return e.join(`
`)}function wf(t){const e=t.length,n=t[0].length;if(n===void 0)return t;const i=e*n;let r=ga[i];r||(ga[i]=r=new Float32Array(i));for(let s=0;s<e;s++)r.set(t[s],s*n);return r}function Ef(t,e){if(t.length!==e.length)return!1;for(let n=0,i=t.length;n<i;n++)if(t[n]!==e[n])return!1;return!0}function Af(t,e){for(let n=0,i=t.length;n<i;n++)t[n]=e[n]}let ji=0;function va(t){ji>100||(console.warn(t),ji++,ji>100&&console.warn("More than 100 program warnings - stopping logs."))}function Mf(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t}function Pf(t,e,n,i,r){return t[0]=e,t[1]=n,t[2]=i,t[3]=r,t}function Tf(t,e){let n=e[0],i=e[1],r=e[2],s=e[3],a=n*n+i*i+r*r+s*s;return a>0&&(a=1/Math.sqrt(a)),t[0]=n*a,t[1]=i*a,t[2]=r*a,t[3]=s*a,t}function Sf(t,e){return t[0]*e[0]+t[1]*e[1]+t[2]*e[2]+t[3]*e[3]}function Cf(t){return t[0]=0,t[1]=0,t[2]=0,t[3]=1,t}function Rf(t,e,n){n=n*.5;let i=Math.sin(n);return t[0]=i*e[0],t[1]=i*e[1],t[2]=i*e[2],t[3]=Math.cos(n),t}function ba(t,e,n){let i=e[0],r=e[1],s=e[2],a=e[3],o=n[0],l=n[1],h=n[2],c=n[3];return t[0]=i*c+a*o+r*h-s*l,t[1]=r*c+a*l+s*o-i*h,t[2]=s*c+a*h+i*l-r*o,t[3]=a*c-i*o-r*l-s*h,t}function Of(t,e,n){n*=.5;let i=e[0],r=e[1],s=e[2],a=e[3],o=Math.sin(n),l=Math.cos(n);return t[0]=i*l+a*o,t[1]=r*l+s*o,t[2]=s*l-r*o,t[3]=a*l-i*o,t}function Ff(t,e,n){n*=.5;let i=e[0],r=e[1],s=e[2],a=e[3],o=Math.sin(n),l=Math.cos(n);return t[0]=i*l-s*o,t[1]=r*l+a*o,t[2]=s*l+i*o,t[3]=a*l-r*o,t}function Lf(t,e,n){n*=.5;let i=e[0],r=e[1],s=e[2],a=e[3],o=Math.sin(n),l=Math.cos(n);return t[0]=i*l+r*o,t[1]=r*l-i*o,t[2]=s*l+a*o,t[3]=a*l-s*o,t}function If(t,e,n,i){let r=e[0],s=e[1],a=e[2],o=e[3],l=n[0],h=n[1],c=n[2],u=n[3],f,d,p,m,x;return d=r*l+s*h+a*c+o*u,d<0&&(d=-d,l=-l,h=-h,c=-c,u=-u),1-d>1e-6?(f=Math.acos(d),p=Math.sin(f),m=Math.sin((1-i)*f)/p,x=Math.sin(i*f)/p):(m=1-i,x=i),t[0]=m*r+x*l,t[1]=m*s+x*h,t[2]=m*a+x*c,t[3]=m*o+x*u,t}function Df(t,e){let n=e[0],i=e[1],r=e[2],s=e[3],a=n*n+i*i+r*r+s*s,o=a?1/a:0;return t[0]=-n*o,t[1]=-i*o,t[2]=-r*o,t[3]=s*o,t}function Uf(t,e){return t[0]=-e[0],t[1]=-e[1],t[2]=-e[2],t[3]=e[3],t}function Bf(t,e){let n=e[0]+e[4]+e[8],i;if(n>0)i=Math.sqrt(n+1),t[3]=.5*i,i=.5/i,t[0]=(e[5]-e[7])*i,t[1]=(e[6]-e[2])*i,t[2]=(e[1]-e[3])*i;else{let r=0;e[4]>e[0]&&(r=1),e[8]>e[r*3+r]&&(r=2);let s=(r+1)%3,a=(r+2)%3;i=Math.sqrt(e[r*3+r]-e[s*3+s]-e[a*3+a]+1),t[r]=.5*i,i=.5/i,t[3]=(e[s*3+a]-e[a*3+s])*i,t[s]=(e[s*3+r]+e[r*3+s])*i,t[a]=(e[a*3+r]+e[r*3+a])*i}return t}function zf(t,e,n="YXZ"){let i=Math.sin(e[0]*.5),r=Math.cos(e[0]*.5),s=Math.sin(e[1]*.5),a=Math.cos(e[1]*.5),o=Math.sin(e[2]*.5),l=Math.cos(e[2]*.5);return n==="XYZ"?(t[0]=i*a*l+r*s*o,t[1]=r*s*l-i*a*o,t[2]=r*a*o+i*s*l,t[3]=r*a*l-i*s*o):n==="YXZ"?(t[0]=i*a*l+r*s*o,t[1]=r*s*l-i*a*o,t[2]=r*a*o-i*s*l,t[3]=r*a*l+i*s*o):n==="ZXY"?(t[0]=i*a*l-r*s*o,t[1]=r*s*l+i*a*o,t[2]=r*a*o+i*s*l,t[3]=r*a*l-i*s*o):n==="ZYX"?(t[0]=i*a*l-r*s*o,t[1]=r*s*l+i*a*o,t[2]=r*a*o-i*s*l,t[3]=r*a*l+i*s*o):n==="YZX"?(t[0]=i*a*l+r*s*o,t[1]=r*s*l+i*a*o,t[2]=r*a*o-i*s*l,t[3]=r*a*l-i*s*o):n==="XZY"&&(t[0]=i*a*l-r*s*o,t[1]=r*s*l-i*a*o,t[2]=r*a*o+i*s*l,t[3]=r*a*l+i*s*o),t}const Nf=Mf,kf=Pf,$f=Sf,Wf=Tf;class jf extends Array{constructor(e=0,n=0,i=0,r=1){return super(e,n,i,r),this.onChange=()=>{},this}get x(){return this[0]}get y(){return this[1]}get z(){return this[2]}get w(){return this[3]}set x(e){this[0]=e,this.onChange()}set y(e){this[1]=e,this.onChange()}set z(e){this[2]=e,this.onChange()}set w(e){this[3]=e,this.onChange()}identity(){return Cf(this),this.onChange(),this}set(e,n,i,r){return e.length?this.copy(e):(kf(this,e,n,i,r),this.onChange(),this)}rotateX(e){return Of(this,this,e),this.onChange(),this}rotateY(e){return Ff(this,this,e),this.onChange(),this}rotateZ(e){return Lf(this,this,e),this.onChange(),this}inverse(e=this){return Df(this,e),this.onChange(),this}conjugate(e=this){return Uf(this,e),this.onChange(),this}copy(e){return Nf(this,e),this.onChange(),this}normalize(e=this){return Wf(this,e),this.onChange(),this}multiply(e,n){return n?ba(this,e,n):ba(this,this,e),this.onChange(),this}dot(e){return $f(this,e)}fromMatrix3(e){return Bf(this,e),this.onChange(),this}fromEuler(e){return zf(this,e,e.order),this}fromAxisAngle(e,n){return Rf(this,e,n),this}slerp(e,n){return If(this,this,e,n),this}fromArray(e,n=0){return this[0]=e[n],this[1]=e[n+1],this[2]=e[n+2],this[3]=e[n+3],this}toArray(e=[],n=0){return e[n]=this[0],e[n+1]=this[1],e[n+2]=this[2],e[n+3]=this[3],e}}const Vf=1e-6;function Hf(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8],t[9]=e[9],t[10]=e[10],t[11]=e[11],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15],t}function Gf(t,e,n,i,r,s,a,o,l,h,c,u,f,d,p,m,x){return t[0]=e,t[1]=n,t[2]=i,t[3]=r,t[4]=s,t[5]=a,t[6]=o,t[7]=l,t[8]=h,t[9]=c,t[10]=u,t[11]=f,t[12]=d,t[13]=p,t[14]=m,t[15]=x,t}function Zf(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}function qf(t,e){let n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],h=e[7],c=e[8],u=e[9],f=e[10],d=e[11],p=e[12],m=e[13],x=e[14],_=e[15],P=n*o-i*a,w=n*l-r*a,b=n*h-s*a,M=i*l-r*o,C=i*h-s*o,Z=r*h-s*l,te=c*m-u*p,re=c*x-f*p,Q=c*_-d*p,ne=u*x-f*m,G=u*_-d*m,A=f*_-d*x,I=P*A-w*G+b*ne+M*Q-C*re+Z*te;return I?(I=1/I,t[0]=(o*A-l*G+h*ne)*I,t[1]=(r*G-i*A-s*ne)*I,t[2]=(m*Z-x*C+_*M)*I,t[3]=(f*C-u*Z-d*M)*I,t[4]=(l*Q-a*A-h*re)*I,t[5]=(n*A-r*Q+s*re)*I,t[6]=(x*b-p*Z-_*w)*I,t[7]=(c*Z-f*b+d*w)*I,t[8]=(a*G-o*Q+h*te)*I,t[9]=(i*Q-n*G-s*te)*I,t[10]=(p*C-m*b+_*P)*I,t[11]=(u*b-c*C-d*P)*I,t[12]=(o*re-a*ne-l*te)*I,t[13]=(n*ne-i*re+r*te)*I,t[14]=(m*w-p*M-x*P)*I,t[15]=(c*M-u*w+f*P)*I,t):null}function Xf(t){let e=t[0],n=t[1],i=t[2],r=t[3],s=t[4],a=t[5],o=t[6],l=t[7],h=t[8],c=t[9],u=t[10],f=t[11],d=t[12],p=t[13],m=t[14],x=t[15],_=e*a-n*s,P=e*o-i*s,w=e*l-r*s,b=n*o-i*a,M=n*l-r*a,C=i*l-r*o,Z=h*p-c*d,te=h*m-u*d,re=h*x-f*d,Q=c*m-u*p,ne=c*x-f*p,G=u*x-f*m;return _*G-P*ne+w*Q+b*re-M*te+C*Z}function xa(t,e,n){let i=e[0],r=e[1],s=e[2],a=e[3],o=e[4],l=e[5],h=e[6],c=e[7],u=e[8],f=e[9],d=e[10],p=e[11],m=e[12],x=e[13],_=e[14],P=e[15],w=n[0],b=n[1],M=n[2],C=n[3];return t[0]=w*i+b*o+M*u+C*m,t[1]=w*r+b*l+M*f+C*x,t[2]=w*s+b*h+M*d+C*_,t[3]=w*a+b*c+M*p+C*P,w=n[4],b=n[5],M=n[6],C=n[7],t[4]=w*i+b*o+M*u+C*m,t[5]=w*r+b*l+M*f+C*x,t[6]=w*s+b*h+M*d+C*_,t[7]=w*a+b*c+M*p+C*P,w=n[8],b=n[9],M=n[10],C=n[11],t[8]=w*i+b*o+M*u+C*m,t[9]=w*r+b*l+M*f+C*x,t[10]=w*s+b*h+M*d+C*_,t[11]=w*a+b*c+M*p+C*P,w=n[12],b=n[13],M=n[14],C=n[15],t[12]=w*i+b*o+M*u+C*m,t[13]=w*r+b*l+M*f+C*x,t[14]=w*s+b*h+M*d+C*_,t[15]=w*a+b*c+M*p+C*P,t}function Yf(t,e,n){let i=n[0],r=n[1],s=n[2],a,o,l,h,c,u,f,d,p,m,x,_;return e===t?(t[12]=e[0]*i+e[4]*r+e[8]*s+e[12],t[13]=e[1]*i+e[5]*r+e[9]*s+e[13],t[14]=e[2]*i+e[6]*r+e[10]*s+e[14],t[15]=e[3]*i+e[7]*r+e[11]*s+e[15]):(a=e[0],o=e[1],l=e[2],h=e[3],c=e[4],u=e[5],f=e[6],d=e[7],p=e[8],m=e[9],x=e[10],_=e[11],t[0]=a,t[1]=o,t[2]=l,t[3]=h,t[4]=c,t[5]=u,t[6]=f,t[7]=d,t[8]=p,t[9]=m,t[10]=x,t[11]=_,t[12]=a*i+c*r+p*s+e[12],t[13]=o*i+u*r+m*s+e[13],t[14]=l*i+f*r+x*s+e[14],t[15]=h*i+d*r+_*s+e[15]),t}function Kf(t,e,n){let i=n[0],r=n[1],s=n[2];return t[0]=e[0]*i,t[1]=e[1]*i,t[2]=e[2]*i,t[3]=e[3]*i,t[4]=e[4]*r,t[5]=e[5]*r,t[6]=e[6]*r,t[7]=e[7]*r,t[8]=e[8]*s,t[9]=e[9]*s,t[10]=e[10]*s,t[11]=e[11]*s,t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15],t}function Qf(t,e,n,i){let r=i[0],s=i[1],a=i[2],o=Math.hypot(r,s,a),l,h,c,u,f,d,p,m,x,_,P,w,b,M,C,Z,te,re,Q,ne,G,A,I,E;return Math.abs(o)<Vf?null:(o=1/o,r*=o,s*=o,a*=o,l=Math.sin(n),h=Math.cos(n),c=1-h,u=e[0],f=e[1],d=e[2],p=e[3],m=e[4],x=e[5],_=e[6],P=e[7],w=e[8],b=e[9],M=e[10],C=e[11],Z=r*r*c+h,te=s*r*c+a*l,re=a*r*c-s*l,Q=r*s*c-a*l,ne=s*s*c+h,G=a*s*c+r*l,A=r*a*c+s*l,I=s*a*c-r*l,E=a*a*c+h,t[0]=u*Z+m*te+w*re,t[1]=f*Z+x*te+b*re,t[2]=d*Z+_*te+M*re,t[3]=p*Z+P*te+C*re,t[4]=u*Q+m*ne+w*G,t[5]=f*Q+x*ne+b*G,t[6]=d*Q+_*ne+M*G,t[7]=p*Q+P*ne+C*G,t[8]=u*A+m*I+w*E,t[9]=f*A+x*I+b*E,t[10]=d*A+_*I+M*E,t[11]=p*A+P*I+C*E,e!==t&&(t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t)}function Jf(t,e){return t[0]=e[12],t[1]=e[13],t[2]=e[14],t}function Ko(t,e){let n=e[0],i=e[1],r=e[2],s=e[4],a=e[5],o=e[6],l=e[8],h=e[9],c=e[10];return t[0]=Math.hypot(n,i,r),t[1]=Math.hypot(s,a,o),t[2]=Math.hypot(l,h,c),t}function ed(t){let e=t[0],n=t[1],i=t[2],r=t[4],s=t[5],a=t[6],o=t[8],l=t[9],h=t[10];const c=e*e+n*n+i*i,u=r*r+s*s+a*a,f=o*o+l*l+h*h;return Math.sqrt(Math.max(c,u,f))}const td=function(){const t=[1,1,1];return function(e,n){let i=t;Ko(i,n);let r=1/i[0],s=1/i[1],a=1/i[2],o=n[0]*r,l=n[1]*s,h=n[2]*a,c=n[4]*r,u=n[5]*s,f=n[6]*a,d=n[8]*r,p=n[9]*s,m=n[10]*a,x=o+u+m,_=0;return x>0?(_=Math.sqrt(x+1)*2,e[3]=.25*_,e[0]=(f-p)/_,e[1]=(d-h)/_,e[2]=(l-c)/_):o>u&&o>m?(_=Math.sqrt(1+o-u-m)*2,e[3]=(f-p)/_,e[0]=.25*_,e[1]=(l+c)/_,e[2]=(d+h)/_):u>m?(_=Math.sqrt(1+u-o-m)*2,e[3]=(d-h)/_,e[0]=(l+c)/_,e[1]=.25*_,e[2]=(f+p)/_):(_=Math.sqrt(1+m-o-u)*2,e[3]=(l-c)/_,e[0]=(d+h)/_,e[1]=(f+p)/_,e[2]=.25*_),e}}();function nd(t,e,n,i){let r=e[0],s=e[1],a=e[2],o=e[3],l=r+r,h=s+s,c=a+a,u=r*l,f=r*h,d=r*c,p=s*h,m=s*c,x=a*c,_=o*l,P=o*h,w=o*c,b=i[0],M=i[1],C=i[2];return t[0]=(1-(p+x))*b,t[1]=(f+w)*b,t[2]=(d-P)*b,t[3]=0,t[4]=(f-w)*M,t[5]=(1-(u+x))*M,t[6]=(m+_)*M,t[7]=0,t[8]=(d+P)*C,t[9]=(m-_)*C,t[10]=(1-(u+p))*C,t[11]=0,t[12]=n[0],t[13]=n[1],t[14]=n[2],t[15]=1,t}function id(t,e){let n=e[0],i=e[1],r=e[2],s=e[3],a=n+n,o=i+i,l=r+r,h=n*a,c=i*a,u=i*o,f=r*a,d=r*o,p=r*l,m=s*a,x=s*o,_=s*l;return t[0]=1-u-p,t[1]=c+_,t[2]=f-x,t[3]=0,t[4]=c-_,t[5]=1-h-p,t[6]=d+m,t[7]=0,t[8]=f+x,t[9]=d-m,t[10]=1-h-u,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}function rd(t,e,n,i,r){let s=1/Math.tan(e/2),a=1/(i-r);return t[0]=s/n,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=s,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=(r+i)*a,t[11]=-1,t[12]=0,t[13]=0,t[14]=2*r*i*a,t[15]=0,t}function sd(t,e,n,i,r,s,a){let o=1/(e-n),l=1/(i-r),h=1/(s-a);return t[0]=-2*o,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=-2*l,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=2*h,t[11]=0,t[12]=(e+n)*o,t[13]=(r+i)*l,t[14]=(a+s)*h,t[15]=1,t}function ad(t,e,n,i){let r=e[0],s=e[1],a=e[2],o=i[0],l=i[1],h=i[2],c=r-n[0],u=s-n[1],f=a-n[2],d=c*c+u*u+f*f;d===0?f=1:(d=1/Math.sqrt(d),c*=d,u*=d,f*=d);let p=l*f-h*u,m=h*c-o*f,x=o*u-l*c;return d=p*p+m*m+x*x,d===0&&(h?o+=1e-6:l?h+=1e-6:l+=1e-6,p=l*f-h*u,m=h*c-o*f,x=o*u-l*c,d=p*p+m*m+x*x),d=1/Math.sqrt(d),p*=d,m*=d,x*=d,t[0]=p,t[1]=m,t[2]=x,t[3]=0,t[4]=u*x-f*m,t[5]=f*p-c*x,t[6]=c*m-u*p,t[7]=0,t[8]=c,t[9]=u,t[10]=f,t[11]=0,t[12]=r,t[13]=s,t[14]=a,t[15]=1,t}class vt extends Array{constructor(e=1,n=0,i=0,r=0,s=0,a=1,o=0,l=0,h=0,c=0,u=1,f=0,d=0,p=0,m=0,x=1){return super(e,n,i,r,s,a,o,l,h,c,u,f,d,p,m,x),this}get x(){return this[12]}get y(){return this[13]}get z(){return this[14]}get w(){return this[15]}set x(e){this[12]=e}set y(e){this[13]=e}set z(e){this[14]=e}set w(e){this[15]=e}set(e,n,i,r,s,a,o,l,h,c,u,f,d,p,m,x){return e.length?this.copy(e):(Gf(this,e,n,i,r,s,a,o,l,h,c,u,f,d,p,m,x),this)}translate(e,n=this){return Yf(this,n,e),this}rotate(e,n,i=this){return Qf(this,i,e,n),this}scale(e,n=this){return Kf(this,n,typeof e=="number"?[e,e,e]:e),this}multiply(e,n){return n?xa(this,e,n):xa(this,this,e),this}identity(){return Zf(this),this}copy(e){return Hf(this,e),this}fromPerspective({fov:e,aspect:n,near:i,far:r}={}){return rd(this,e,n,i,r),this}fromOrthogonal({left:e,right:n,bottom:i,top:r,near:s,far:a}){return sd(this,e,n,i,r,s,a),this}fromQuaternion(e){return id(this,e),this}setPosition(e){return this.x=e[0],this.y=e[1],this.z=e[2],this}inverse(e=this){return qf(this,e),this}compose(e,n,i){return nd(this,e,n,i),this}getRotation(e){return td(e,this),this}getTranslation(e){return Jf(e,this),this}getScaling(e){return Ko(e,this),this}getMaxScaleOnAxis(){return ed(this)}lookAt(e,n,i){return ad(this,e,n,i),this}determinant(){return Xf(this)}fromArray(e,n=0){return this[0]=e[n],this[1]=e[n+1],this[2]=e[n+2],this[3]=e[n+3],this[4]=e[n+4],this[5]=e[n+5],this[6]=e[n+6],this[7]=e[n+7],this[8]=e[n+8],this[9]=e[n+9],this[10]=e[n+10],this[11]=e[n+11],this[12]=e[n+12],this[13]=e[n+13],this[14]=e[n+14],this[15]=e[n+15],this}toArray(e=[],n=0){return e[n]=this[0],e[n+1]=this[1],e[n+2]=this[2],e[n+3]=this[3],e[n+4]=this[4],e[n+5]=this[5],e[n+6]=this[6],e[n+7]=this[7],e[n+8]=this[8],e[n+9]=this[9],e[n+10]=this[10],e[n+11]=this[11],e[n+12]=this[12],e[n+13]=this[13],e[n+14]=this[14],e[n+15]=this[15],e}}function od(t,e,n="YXZ"){return n==="XYZ"?(t[1]=Math.asin(Math.min(Math.max(e[8],-1),1)),Math.abs(e[8])<.99999?(t[0]=Math.atan2(-e[9],e[10]),t[2]=Math.atan2(-e[4],e[0])):(t[0]=Math.atan2(e[6],e[5]),t[2]=0)):n==="YXZ"?(t[0]=Math.asin(-Math.min(Math.max(e[9],-1),1)),Math.abs(e[9])<.99999?(t[1]=Math.atan2(e[8],e[10]),t[2]=Math.atan2(e[1],e[5])):(t[1]=Math.atan2(-e[2],e[0]),t[2]=0)):n==="ZXY"?(t[0]=Math.asin(Math.min(Math.max(e[6],-1),1)),Math.abs(e[6])<.99999?(t[1]=Math.atan2(-e[2],e[10]),t[2]=Math.atan2(-e[4],e[5])):(t[1]=0,t[2]=Math.atan2(e[1],e[0]))):n==="ZYX"?(t[1]=Math.asin(-Math.min(Math.max(e[2],-1),1)),Math.abs(e[2])<.99999?(t[0]=Math.atan2(e[6],e[10]),t[2]=Math.atan2(e[1],e[0])):(t[0]=0,t[2]=Math.atan2(-e[4],e[5]))):n==="YZX"?(t[2]=Math.asin(Math.min(Math.max(e[1],-1),1)),Math.abs(e[1])<.99999?(t[0]=Math.atan2(-e[9],e[5]),t[1]=Math.atan2(-e[2],e[0])):(t[0]=0,t[1]=Math.atan2(e[8],e[10]))):n==="XZY"&&(t[2]=Math.asin(-Math.min(Math.max(e[4],-1),1)),Math.abs(e[4])<.99999?(t[0]=Math.atan2(e[6],e[5]),t[1]=Math.atan2(e[8],e[0])):(t[0]=Math.atan2(-e[9],e[10]),t[1]=0)),t}const _a=new vt;class ld extends Array{constructor(e=0,n=e,i=e,r="YXZ"){return super(e,n,i),this.order=r,this.onChange=()=>{},this}get x(){return this[0]}get y(){return this[1]}get z(){return this[2]}set x(e){this[0]=e,this.onChange()}set y(e){this[1]=e,this.onChange()}set z(e){this[2]=e,this.onChange()}set(e,n=e,i=e){return e.length?this.copy(e):(this[0]=e,this[1]=n,this[2]=i,this.onChange(),this)}copy(e){return this[0]=e[0],this[1]=e[1],this[2]=e[2],this.onChange(),this}reorder(e){return this.order=e,this.onChange(),this}fromRotationMatrix(e,n=this.order){return od(this,e,n),this}fromQuaternion(e,n=this.order){return _a.fromQuaternion(e),this.fromRotationMatrix(_a,n)}toArray(e=[],n=0){return e[n]=this[0],e[n+1]=this[1],e[n+2]=this[2],e}}let cd=0;class qr{constructor({scale:e=1}={}){this.parent=null,this.children=[],this.visible=!0,this.castable=!0,this.matrix=new vt,this.worldMatrix=new vt,this.matrixAutoUpdate=!0,this.position=new ue,this.worldPosition=new ue,this.quaternion=new jf,this.scale=new ue(e,e,e),this.rotation=new ld,this.up=new ue(0,1,0),this.id=cd++,this.rotation.onChange=()=>this.quaternion.fromEuler(this.rotation),this.quaternion.onChange=()=>this.rotation.fromQuaternion(this.quaternion)}setParent(e,n=!0){this.parent&&e!==this.parent&&this.parent.removeChild(this,!1),this.parent=e,n&&e&&e.addChild(this,!1)}addChild(e,n=!0){~this.children.indexOf(e)||this.children.push(e),n&&e.setParent(this,!1)}removeChild(e,n=!0){~this.children.indexOf(e)&&this.children.splice(this.children.indexOf(e),1),n&&e.setParent(null,!1)}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.worldMatrixNeedsUpdate||e)&&(this.parent===null?this.worldMatrix.copy(this.matrix):this.worldMatrix.multiply(this.parent.worldMatrix,this.matrix),this.worldMatrixNeedsUpdate=!1,e=!0,this.worldMatrix.getTranslation(this.worldPosition));for(let n=0,i=this.children.length;n<i;n++)this.children[n].updateMatrixWorld(e)}updateMatrix(){this.matrix.compose(this.quaternion,this.position,this.scale),this.worldMatrixNeedsUpdate=!0}traverse(e){if(!e(this))for(let n=0,i=this.children.length;n<i;n++)this.children[n].traverse(e)}decompose(){this.matrix.getTranslation(this.position),this.matrix.getRotation(this.quaternion),this.matrix.getScaling(this.scale),this.rotation.fromQuaternion(this.quaternion)}lookAt(e,n=!1){n?this.matrix.lookAt(this.position,e,this.up):this.matrix.lookAt(e,this.position,this.up),this.matrix.getRotation(this.quaternion),this.rotation.fromQuaternion(this.quaternion)}lookAtWorld(e,n=!1){const i=[this.worldMatrix[12],this.worldMatrix[13],this.worldMatrix[14]];n?this.matrix.lookAt(i,e,this.up):this.matrix.lookAt(e,i,this.up),this.matrix.getRotation(this.quaternion),this.rotation.fromQuaternion(this.quaternion)}}function hd(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[4],t[4]=e[5],t[5]=e[6],t[6]=e[8],t[7]=e[9],t[8]=e[10],t}function ud(t,e){let n=e[0],i=e[1],r=e[2],s=e[3],a=n+n,o=i+i,l=r+r,h=n*a,c=i*a,u=i*o,f=r*a,d=r*o,p=r*l,m=s*a,x=s*o,_=s*l;return t[0]=1-u-p,t[3]=c-_,t[6]=f+x,t[1]=c+_,t[4]=1-h-p,t[7]=d-m,t[2]=f-x,t[5]=d+m,t[8]=1-h-u,t}function fd(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8],t}function dd(t,e,n,i,r,s,a,o,l,h){return t[0]=e,t[1]=n,t[2]=i,t[3]=r,t[4]=s,t[5]=a,t[6]=o,t[7]=l,t[8]=h,t}function pd(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=1,t[5]=0,t[6]=0,t[7]=0,t[8]=1,t}function gd(t,e){let n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],h=e[7],c=e[8],u=c*a-o*h,f=-c*s+o*l,d=h*s-a*l,p=n*u+i*f+r*d;return p?(p=1/p,t[0]=u*p,t[1]=(-c*i+r*h)*p,t[2]=(o*i-r*a)*p,t[3]=f*p,t[4]=(c*n-r*l)*p,t[5]=(-o*n+r*s)*p,t[6]=d*p,t[7]=(-h*n+i*l)*p,t[8]=(a*n-i*s)*p,t):null}function ya(t,e,n){let i=e[0],r=e[1],s=e[2],a=e[3],o=e[4],l=e[5],h=e[6],c=e[7],u=e[8],f=n[0],d=n[1],p=n[2],m=n[3],x=n[4],_=n[5],P=n[6],w=n[7],b=n[8];return t[0]=f*i+d*a+p*h,t[1]=f*r+d*o+p*c,t[2]=f*s+d*l+p*u,t[3]=m*i+x*a+_*h,t[4]=m*r+x*o+_*c,t[5]=m*s+x*l+_*u,t[6]=P*i+w*a+b*h,t[7]=P*r+w*o+b*c,t[8]=P*s+w*l+b*u,t}function md(t,e,n){let i=e[0],r=e[1],s=e[2],a=e[3],o=e[4],l=e[5],h=e[6],c=e[7],u=e[8],f=n[0],d=n[1];return t[0]=i,t[1]=r,t[2]=s,t[3]=a,t[4]=o,t[5]=l,t[6]=f*i+d*a+h,t[7]=f*r+d*o+c,t[8]=f*s+d*l+u,t}function vd(t,e,n){let i=e[0],r=e[1],s=e[2],a=e[3],o=e[4],l=e[5],h=e[6],c=e[7],u=e[8],f=Math.sin(n),d=Math.cos(n);return t[0]=d*i+f*a,t[1]=d*r+f*o,t[2]=d*s+f*l,t[3]=d*a-f*i,t[4]=d*o-f*r,t[5]=d*l-f*s,t[6]=h,t[7]=c,t[8]=u,t}function bd(t,e,n){let i=n[0],r=n[1];return t[0]=i*e[0],t[1]=i*e[1],t[2]=i*e[2],t[3]=r*e[3],t[4]=r*e[4],t[5]=r*e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8],t}function xd(t,e){let n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],h=e[7],c=e[8],u=e[9],f=e[10],d=e[11],p=e[12],m=e[13],x=e[14],_=e[15],P=n*o-i*a,w=n*l-r*a,b=n*h-s*a,M=i*l-r*o,C=i*h-s*o,Z=r*h-s*l,te=c*m-u*p,re=c*x-f*p,Q=c*_-d*p,ne=u*x-f*m,G=u*_-d*m,A=f*_-d*x,I=P*A-w*G+b*ne+M*Q-C*re+Z*te;return I?(I=1/I,t[0]=(o*A-l*G+h*ne)*I,t[1]=(l*Q-a*A-h*re)*I,t[2]=(a*G-o*Q+h*te)*I,t[3]=(r*G-i*A-s*ne)*I,t[4]=(n*A-r*Q+s*re)*I,t[5]=(i*Q-n*G-s*te)*I,t[6]=(m*Z-x*C+_*M)*I,t[7]=(x*b-p*Z-_*w)*I,t[8]=(p*C-m*b+_*P)*I,t):null}class _d extends Array{constructor(e=1,n=0,i=0,r=0,s=1,a=0,o=0,l=0,h=1){return super(e,n,i,r,s,a,o,l,h),this}set(e,n,i,r,s,a,o,l,h){return e.length?this.copy(e):(dd(this,e,n,i,r,s,a,o,l,h),this)}translate(e,n=this){return md(this,n,e),this}rotate(e,n=this){return vd(this,n,e),this}scale(e,n=this){return bd(this,n,e),this}multiply(e,n){return n?ya(this,e,n):ya(this,this,e),this}identity(){return pd(this),this}copy(e){return fd(this,e),this}fromMatrix4(e){return hd(this,e),this}fromQuaternion(e){return ud(this,e),this}fromBasis(e,n,i){return this.set(e[0],e[1],e[2],n[0],n[1],n[2],i[0],i[1],i[2]),this}inverse(e=this){return gd(this,e),this}getNormalMatrix(e){return xd(this,e),this}}class bi extends qr{constructor(e,{geometry:n,program:i,mode:r=e.TRIANGLES,frustumCulled:s=!0,renderOrder:a=0,forceRenderOrder:o=!1,transform:l=null}={}){super(),e.canvas||console.error("gl not passed as first argument to Mesh"),this.gl=e,l!==null&&(this.position.copy(l.position),this.scale.copy(l.scale),this.rotation.copy(l.rotation),l.parent&&this.setParent(l.parent)),this.geometry=n,this.program=i,this.mode=r,this.frustumCulled=s,this.renderOrder=a,o?this.forceRenderOrder=!0:this.forceRenderOrder=this.renderOrder!==0&&typeof this.renderOrder=="number",this.modelViewMatrix=new vt,this.normalMatrix=new _d,this.isCameraFliped=!1,this.beforeRenderCallbacks=[],this.afterRenderCallbacks=[]}onBeforeRender(e){return this.beforeRenderCallbacks.push(e),this}onAfterRender(e){return this.afterRenderCallbacks.push(e),this}draw({camera:e}={}){this.beforeRenderCallbacks.forEach(r=>r&&r({mesh:this,camera:e}));let n=!1;e&&(this.program.uniforms.modelMatrix||Object.assign(this.program.uniforms,{modelMatrix:{value:null},viewMatrix:{value:null},modelViewMatrix:{value:null},normalMatrix:{value:null},projectionMatrix:{value:null},cameraPosition:{value:null},isCameraFliped:{value:null}}),this.program.uniforms.projectionMatrix.value=e.projectionMatrix,this.program.uniforms.cameraPosition.value=e.worldPosition,this.program.uniforms.viewMatrix.value=e.viewMatrix,this.program.uniforms.isCameraFliped.value=e.isFliped,this.modelViewMatrix.multiply(e.viewMatrix,this.worldMatrix),this.normalMatrix.getNormalMatrix(this.worldMatrix),this.program.uniforms.modelMatrix.value=this.worldMatrix,this.program.uniforms.modelViewMatrix.value=this.modelViewMatrix,this.program.uniforms.normalMatrix.value=this.normalMatrix,n=e.isFliped);let i=this.program.cullFace&&this.worldMatrix.determinant()<0||n;this.program.use({flipFaces:i}),this.geometry.draw({mode:this.mode,program:this.program}),this.afterRenderCallbacks.forEach(r=>r&&r({mesh:this,camera:e}))}}const wa=new Uint8Array(4);function Ea(t){return(t&t-1)===0}let yd=1;class it{constructor(e,{image:n,target:i=e.TEXTURE_2D,type:r=e.UNSIGNED_BYTE,format:s=e.RGBA,internalFormat:a=s,rt:o=null,depth:l=!1,pass:h=null,wrapS:c=e.CLAMP_TO_EDGE,wrapT:u=e.CLAMP_TO_EDGE,generateMipmaps:f=!0,minFilter:d=f?e.NEAREST_MIPMAP_LINEAR:e.LINEAR,magFilter:p=e.LINEAR,premultiplyAlpha:m=!1,unpackAlignment:x=4,flipY:_=i==e.TEXTURE_2D,anisotropy:P=0,level:w=0,width:b,height:M=b}={}){this.gl=e,this.id=yd++,this.image=n,this.target=i,this.type=r,this.format=s,this.rt=o,this.depth=l,this.pass=h,this.internalFormat=a,this.minFilter=d,this.magFilter=p,this.wrapS=c,this.wrapT=u,this.generateMipmaps=f,this.premultiplyAlpha=m,this.unpackAlignment=x,this.flipY=_,this.anisotropy=Math.min(P,this.gl.renderer.parameters.maxAnisotropy),this.level=w,this.width=b,this.height=M,this.texture=this.gl.createTexture(),this.store={image:null},this.glState=this.gl.renderer.state,this.state={},this.state.minFilter=this.gl.NEAREST_MIPMAP_LINEAR,this.state.magFilter=this.gl.LINEAR,this.state.wrapS=this.gl.REPEAT,this.state.wrapT=this.gl.REPEAT,this.state.anisotropy=0}bind(){this.rt!==null?this.depth?this.gl.bindTexture(this.target,this.rt.getDepthTexture()):this.gl.bindTexture(this.target,this.rt.getTexture()):this.pass!==null?this.gl.bindTexture(this.target,this.pass.getTexture()):this.gl.bindTexture(this.target,this.texture),this.glState.textureUnits[this.glState.activeTextureUnit]=this.id}update(e=0){const n=!(this.image===this.store.image&&!this.needsUpdate);if((n||this.glState.textureUnits[e]!==this.id)&&(this.gl.renderer.activeTexture(e),this.bind()),!!n){if(this.needsUpdate=!1,this.flipY!==this.glState.flipY&&(this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL,this.flipY),this.glState.flipY=this.flipY),this.premultiplyAlpha!==this.glState.premultiplyAlpha&&(this.gl.pixelStorei(this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,this.premultiplyAlpha),this.glState.premultiplyAlpha=this.premultiplyAlpha),this.unpackAlignment!==this.glState.unpackAlignment&&(this.gl.pixelStorei(this.gl.UNPACK_ALIGNMENT,this.unpackAlignment),this.glState.unpackAlignment=this.unpackAlignment),this.minFilter!==this.state.minFilter&&(this.gl.texParameteri(this.target,this.gl.TEXTURE_MIN_FILTER,this.minFilter),this.state.minFilter=this.minFilter),this.magFilter!==this.state.magFilter&&(this.gl.texParameteri(this.target,this.gl.TEXTURE_MAG_FILTER,this.magFilter),this.state.magFilter=this.magFilter),this.wrapS!==this.state.wrapS&&(this.gl.texParameteri(this.target,this.gl.TEXTURE_WRAP_S,this.wrapS),this.state.wrapS=this.wrapS),this.wrapT!==this.state.wrapT&&(this.gl.texParameteri(this.target,this.gl.TEXTURE_WRAP_T,this.wrapT),this.state.wrapT=this.wrapT),this.anisotropy&&this.anisotropy!==this.state.anisotropy&&(this.gl.texParameterf(this.target,this.gl.renderer.getExtension("EXT_texture_filter_anisotropic").TEXTURE_MAX_ANISOTROPY_EXT,this.anisotropy),this.state.anisotropy=this.anisotropy),this.image){if(this.image.width&&(this.width=this.image.width,this.height=this.image.height),this.target===this.gl.TEXTURE_CUBE_MAP)for(let i=0;i<6;i++)this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_POSITIVE_X+i,this.level,this.internalFormat,this.format,this.type,this.image[i]);else if(ArrayBuffer.isView(this.image))this.gl.texImage2D(this.target,this.level,this.internalFormat,this.width,this.height,0,this.format,this.type,this.image);else if(this.image.isCompressedTexture)for(let i=0;i<this.image.length;i++)this.gl.compressedTexImage2D(this.target,i,this.internalFormat,this.image[i].width,this.image[i].height,0,this.image[i].data);else this.gl.texImage2D(this.target,this.level,this.internalFormat,this.format,this.type,this.image);this.generateMipmaps&&(!this.gl.renderer.isWebgl2&&(!Ea(this.image.width)||!Ea(this.image.height))?(this.generateMipmaps=!1,this.wrapS=this.wrapT=this.gl.CLAMP_TO_EDGE,this.minFilter=this.gl.LINEAR):this.gl.generateMipmap(this.target)),this.onUpdate&&this.onUpdate()}else if(this.target===this.gl.TEXTURE_CUBE_MAP)for(let i=0;i<6;i++)this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_POSITIVE_X+i,0,this.gl.RGBA,1,1,0,this.gl.RGBA,this.gl.UNSIGNED_BYTE,wa);else this.width?this.rt===null&&this.pass===null&&this.gl.texImage2D(this.target,this.level,this.internalFormat,this.width,this.height,0,this.format,this.type,null):this.rt===null&&this.pass===null&&this.gl.texImage2D(this.target,0,this.gl.RGBA,1,1,0,this.gl.RGBA,this.gl.UNSIGNED_BYTE,wa);this.store.image=this.image}}}const wd="modulepreload",Ed=function(t){return"/"+t},Aa={},Ma=function(e,n,i){if(!n||n.length===0)return e();const r=document.getElementsByTagName("link");return Promise.all(n.map(s=>{if(s=Ed(s),s in Aa)return;Aa[s]=!0;const a=s.endsWith(".css"),o=a?'[rel="stylesheet"]':"";if(!!i)for(let c=r.length-1;c>=0;c--){const u=r[c];if(u.href===s&&(!a||u.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${s}"]${o}`))return;const h=document.createElement("link");if(h.rel=a?"stylesheet":wd,a||(h.as="script",h.crossOrigin=""),h.href=s,document.head.appendChild(h),a)return new Promise((c,u)=>{h.addEventListener("load",c),h.addEventListener("error",()=>u(new Error(`Unable to preload CSS for ${s}`)))})})).then(()=>e()).catch(s=>{const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=s,window.dispatchEvent(a),!a.defaultPrevented)throw s})},Ad={_SplinesEditorData:{camera:{name:"camera",points:[[0,0,0],[0,15,10],[15,15,-10],[0,15,-20]]},lookat:{name:"lookat",points:[[0,0,0],[0,15,10],[15,15,-10],[0,15,-20]]}}},Pa=0,Md=null;let Ta,en;class Pd{constructor(){oe(this,"loopChildren",(e,n)=>{e.forEach(i=>{i.name||(i.name="Unnamed");let r=null;i.parent?r=n.get(i.parent.id).addFolder({title:`${i.name} - ID:${i.id}`,expanded:!1}):r=n.get(root.id).addFolder({title:`${i.name} - ID:${i.id}`,expanded:!0}),r.addBinding(i,"visible"),r.addBinding(i,"position"),r.addBinding(i,"rotation"),r.addBinding(i,"scale"),n.set(i.id,r),i.children.length&&this.loopChildren(i.children,n)})});oe(this,"addHierarchyPane",e=>{console.log({root:e}),this.hierarchyPane=new en({title:"Hierarchy"}),this.hierarchyPane.hidden=!this.active,this.addPositionBlade(this.hierarchyPane,this.networkPane?"bottom right":"bottom left"),this.updatePanesPosition(this.hierarchyPane),this.hierarchyPane.element.classList.add("debug-pane","debug-pane--hierarchy"),e.name="Root";const n=new Map,i=this.hierarchyPane.addFolder({title:e.name,expanded:!0});n.set(e.id,i),this.loopChildren(e.children,n)});oe(this,"addPositionBlade",(e,n)=>{e.position=n,e.addBlade({view:"list",label:"position",options:[{text:"top right",value:"top right"},{text:"top left",value:"top left"},{text:"bottom right",value:"bottom right"},{text:"bottom left",value:"bottom left"}],value:n}).on("change",i=>{this.updatePanesPosition(e,i.value)})});oe(this,"removeSpecificKey",(e,n="")=>{e[n]!==void 0&&delete e[n];for(let i in e)e[i]!==null&&typeof e[i]=="object"&&e[i].nodeType!==1&&this.removeSpecificKey(e[i],n)});this.active=this.queryDebug(),this.tweakpaneIsLoaded=!1,this.guiIsReady=!this.active,this.bladesQueue=[],this.config={},this.backupConfig={},this.networkConfigs={},this.inputs={},this.folders={},this.webglManager=null,this._emitter={},Tn(this._emitter),this.on=this._emitter.on.bind(this._emitter),this.active&&(this.lazyloadTweakpaneThenInit(),this.addEventListeners())}setManager(e){this.webglManager=e}lazyloadTweakpaneThenInit(){const e=Ma(()=>import("./tweakpane-834ceedf.js"),[]),n=Ma(()=>import("./tweakpane-plugin-essentials-e46101ab.js"),[]);Promise.all([e,n]).then(i=>{en=i[0].Pane,Ta=i[1],this.tweakpaneIsLoaded=!0,this.init(),this.responsivePanePosition(),window.addEventListener("resize",this.responsivePanePosition.bind(this),{passive:!1});for(let r=0;r<this.bladesQueue.length;r++){const s=this.bladesQueue[r];this.addBladeConfigActive(s.config,s.id,s.tabId)}this.bladesQueue=[],this._emitter.emit("gui-lazyloaded"),this.guiIsReady=!0})}init(){this.pane=new en({title:"Debug UI",expanded:!rn}),this.pane.hidden=!this.active||this.queryDebug("demo"),this.addPositionBlade(this.pane,"top right"),this.updatePanesPosition(this.pane),this.pane.element.classList.add("debug-pane","debug-pane--config"),this.scenePane=new en({title:"Scene Controller",expanded:!rn}),this.scenePane.hidden=!this.active,this.addPositionBlade(this.scenePane,"top left"),this.updatePanesPosition(this.scenePane),this.scenePane.element.classList.add("debug-pane","debug-pane--scene");const e=new URLSearchParams(window.location.search);this.scenePane.addBlade({view:"list",label:"Scene to load",options:[{text:"main",value:"main"},{text:"carpaint",value:"carpaint"},{text:"pbr",value:"pbr"},{text:"subParent",value:"subParent"},{text:"minimal",value:"minimal"},{text:"refraction",value:"refraction"},{text:"celshading",value:"celshading"},{text:"gltfAnimation",value:"gltfAnimation"},{text:"flares",value:"flares"},{text:"particles",value:"particles"},{text:"rays",value:"rays"},{text:"gltfHierarchy",value:"gltfHierarchy"}],value:e.has("scene")?e.get("scene"):"main"}).on("change",i=>{e.set("scene",i.value),window.location.href="/?"+e.toString()}),this.pane.registerPlugin(Ta),this.fpsGraph=this.pane.addBlade({view:"fpsgraph",label:"FPS",lineCount:2}),at.onBefore=this.fpsGraph.begin.bind(this.fpsGraph),at.onAfter=this.fpsGraph.end.bind(this.fpsGraph),this.tab=this.pane.addTab({pages:[{title:"General"},{title:"Mat - Custom"}]}),document.head.insertAdjacentHTML("beforeend",`<style>
      :root {
        --tp-base-background-color: hsla(0, 0%, 10%, 0.975);
        --tp-base-shadow-color: hsla(0, 0%, 0%, 0.2);
        --tp-button-background-color: hsla(0, 0%, 80%, 1);
        --tp-button-background-color-active: hsla(0, 0%, 100%, 1);
        --tp-button-background-color-focus: hsla(0, 0%, 95%, 1);
        --tp-button-background-color-hover: hsla(0, 0%, 85%, 1);
        --tp-button-foreground-color: hsla(0, 0%, 0%, 0.8);
        --tp-container-background-color: hsla(0, 0%, 0%, 0.3);
        --tp-container-background-color-active: hsla(0, 0%, 0%, 0.6);
        --tp-container-background-color-focus: hsla(0, 0%, 0%, 0.5);
        --tp-container-background-color-hover: hsla(0, 0%, 0%, 0.4);
        --tp-container-foreground-color: hsla(0, 0%, 100%, 0.5);
        --tp-groove-foreground-color: hsla(0, 0%, 0%, 0.2);
        --tp-input-background-color: hsla(0, 0%, 0%, 0.3);
        --tp-input-background-color-active: hsla(0, 0%, 0%, 0.6);
        --tp-input-background-color-focus: hsla(0, 0%, 0%, 0.5);
        --tp-input-background-color-hover: hsla(0, 0%, 0%, 0.4);
        --tp-input-foreground-color: hsla(0, 0%, 100%, 0.5);
        --tp-label-foreground-color: hsla(0, 0%, 100%, 0.5);
        --tp-monitor-background-color: hsla(0, 0%, 0%, 0.3);
        --tp-monitor-foreground-color: hsla(0, 0%, 100%, 0.3);
      }
      .tp-dfwv {
        position: fixed;
        width: 350px !important;
        max-width: 95%;
        z-index: 10001;
        max-height: calc(100vh - 8px);
        overflow-y: auto;
        overflox-x: hidden;
      }
      .tp-dfwv:has(.debug-pane--config) {
        width: 550px !important;
      }
      </style>`),this.pane.containerElem_.addEventListener("mouseenter",()=>{this._emitter.emit("drag-prevent")}),this.pane.containerElem_.addEventListener("mouseleave",()=>{this._emitter.emit("drag-unprevent")}),this.scenePane.containerElem_.addEventListener("mouseenter",()=>{this._emitter.emit("drag-prevent")}),this.scenePane.containerElem_.addEventListener("mouseleave",()=>{this._emitter.emit("drag-unprevent")})}updatePanesPosition(e,n=null){switch(n&&(e.position=n),e.position){case"top right":e.element.parentNode.style.top="8px",e.element.parentNode.style.right="8px",e.element.parentNode.style.bottom="auto",e.element.parentNode.style.left="auto";break;case"top left":e.element.parentNode.style.top="8px",e.element.parentNode.style.right="auto",e.element.parentNode.style.bottom="auto",e.element.parentNode.style.left="8px";break;case"bottom right":e.element.parentNode.style.top="auto",e.element.parentNode.style.right="8px",e.element.parentNode.style.bottom="8px",e.element.parentNode.style.left="auto";break;case"bottom left":e.element.parentNode.style.top="auto",e.element.parentNode.style.right="auto",e.element.parentNode.style.bottom="8px",e.element.parentNode.style.left="8px";break}}responsivePanePosition(){rn&&(this.scenePane.containerElem_.style.top="auto",this.scenePane.containerElem_.style.bottom="8px")}queryDebug(e="dev"){let n=window.location.href;e=e.replace(/[[]]/g,"\\$&");var i=new RegExp("[?&]"+e+"(=([^&#]*)|&|#|$)"),r=i.exec(n);return r?decodeURIComponent(r[2].replace(/\+/g," "))==="true":!1}initNetwork(){this.networkIsOnline=!1,this.networkInputs={},this.networkParams={status:"🔴 offline",name:localStorage.getItem("firebase-gui-name")||"","config-list":[]},this.networkPane=new en({title:"Network",expanded:!rn}),this.networkPane.hidden=!this.active||this.queryDebug("demo"),this.addPositionBlade(this.networkPane,"bottom left"),this.updatePanesPosition(this.networkPane),this.networkPane.addBinding(this.networkParams,"status",{multiline:!1,lineCount:1}),this.networkPane.addBlade({view:"separator"}),this.networkInputs.list=this.networkPane.addBlade({view:"list",label:"presets",options:this.networkParams["config-list"],value:"none"}),this.networkPane.addBlade({view:"separator"}),this.networkInputs.sync=this.networkPane.addButton({title:"Sync"}),this.networkInputs.dump=this.networkPane.addButton({title:"Dump"}),this.networkPane.addBlade({view:"separator"}),this.networkInputs.name=this.networkPane.addBinding(this.networkParams,"name"),this.networkInputs.save=this.networkPane.addButton({title:"Save"}),this.firebase=initializeApp(Md),this.initNetworkEvents(),this.updateNetworkStatus()}dump(){this.removeSpecificKey(this.config,"_gsap"),console.log(this.config),console.log(JSON.stringify(this.config))}initNetworkEvents(){this.networkInputs.name.on("change",e=>{localStorage.setItem("firebase-gui-name",e.value)}),this.networkInputs.dump.on("click",()=>{this._emitter.emit("beforeSave"),this.dump()}),this.networkInputs.save.on("click",()=>{if(this._emitter.emit("beforeSave"),this.networkParams.name==""){alert("Please fill a name in Network GUI");return}this.removeSpecificKey(this.config,"_gsap");const e=`${this.networkParams.name.replace(/[.\/#$\[\]]+/g,"_")}___${new Date().toUTCString().replaceAll(",","").replaceAll(" ","-")}`;console.log("saving",e);const n=getDatabase();console.log(this.config),set(ref(n,"configs/"+e),this.config).then(()=>{this.refreshNetwork()})}),this.networkInputs.sync.on("click",()=>{this.refreshNetwork()})}refreshNetwork(){const e=getDatabase(),n=ref(e,"configs/");onValue(n,i=>{const r=i.val();this.networkConfigs=r,this.networkParams["config-list"].length=0,this.networkParams["config-list"].push({text:"current",value:null});for(const s in r)Object.hasOwnProperty.call(r,s)&&this.networkParams["config-list"].push({text:s,value:s});this.networkInputs.list.dispose(),this.networkInputs.list=this.networkPane.addBlade({view:"list",label:"presets",index:1,options:this.networkParams["config-list"],value:"none"}),this.networkInputs.list.on("change",s=>{this.applyConfig(s.value)}),setTimeout(()=>{this.networkPane.refresh()},200)})}updateNetworkStatus(){const e=getDatabase(),n=ref(e,".info/connected");onValue(n,i=>{i.val()===!0?(this.networkIsOnline=!0,console.log("GUI connected"),this.refreshNetwork(),this.networkParams.status="🟢 online"):(this.networkIsOnline=!1,console.log("GUI not connected")),this.networkInputs.sync.disabled=!this.networkIsOnline,this.networkInputs.dump.disabled=!this.networkIsOnline,this.networkInputs.save.disabled=!this.networkIsOnline,this.networkPane.refresh()})}applyConfig(e){for(const n in this.networkConfigs[e])if(Object.hasOwnProperty.call(this.networkConfigs[e],n)){const i=this.networkConfigs[e][n];if(this.config[n]){const r=this.config[n];for(const s in i)if(Object.hasOwnProperty.call(i,s)){const a=i[s];if(r[s]){const o=r[s];o.value=a.value}}}}this.refreshGUI(),this._emitter.emit("updateConfig")}applyConfigFile(e){for(const n in e)if(Object.hasOwnProperty.call(e,n)){const i=e[n];if(this.config[n]){const r=this.config[n];for(const s in i)if(Object.hasOwnProperty.call(i,s)){const a=i[s];if(r[s]){const o=r[s];o.value=a.value}}}}e._SplinesEditorData&&(this.config._SplinesEditorData=e._SplinesEditorData),this.refreshGUI(),this._emitter.emit("updateConfig")}applyConfigSpecificFolder(e,n){const i=this.config[n],r=e[n];if(i&&r){for(const s in i)if(Object.hasOwnProperty.call(i,s)){const a=i[s],o=r[s];o&&(a.value=o.value)}}this.refreshGUI(),this._emitter.emit("updateConfig")}refreshGUI(){if(this.pane){for(const e in this.folders)this.folders[e].refresh();this.pane.refresh()}}addEventListeners(){window.addEventListener("keyup",this.onKeyUp.bind(this))}onKeyUp({key:e}){e&&(e==="h"||e==="H")&&(this.pane&&(this.pane.hidden=!this.pane.hidden),this.scenePane&&(this.scenePane.hidden=!this.scenePane.hidden),this.networkPane&&(this.networkPane.hidden=!this.networkPane.hidden))}onLoaded(){this.applyConfigFile(Ad)}addConfig(){}addBladeScene(e,n){return this.addBlade(e,n,"scene")}addBlade(e,n,i=Pa){return this.active?this.tweakpaneIsLoaded?this.addBladeConfigActive(e,n,i):(this.bladesQueue.push({config:e,id:n,tabId:i}),null):(this.addBladeConfigInactive(e,n,i),null)}addBladeConfigActive(e,n,i=Pa){const r=i==="scene"?this.scenePane:this.tab.pages[i];this.folders[n]=r.addFolder({title:n,expanded:!1});let s={};this.inputs[n]={};for(const l in e)if(Object.hasOwnProperty.call(e,l)){const h=e[l];h.type=="bool"?this.folders[n].addBinding(h,"value",{label:l}):h.view==="cubicbezier"?this.folders[n].addBlade(h):(this.config[n]=e,this.backupConfig[n]=structuredClone(e),s[l]=this.folders[n].addBinding(h,"value",Object.assign(h.params,{label:l})))}this.folders[n].addBlade({view:"separator"}),this.folders[n].addButton({title:"RESET"}).on("click",()=>{if(this.networkInputs&&this.networkInputs.list&&this.networkInputs.list.value!=="none"){const l=this.networkConfigs[this.networkInputs.list.value];l&&this.applyConfigSpecificFolder(l,n)}else console.log("DebugController.js:576","eeeehello",this.backupConfig),this.applyConfigSpecificFolder(this.backupConfig,n)});const o=this.folders[`${n}`];return o.params=s,o}addBladeConfigInactive(e,n){for(const i in e)Object.hasOwnProperty.call(e,i)&&(this.config[n]=e)}getGui(e){return this.folders[`${e}`]}removeItemFromArray(e,n){const i=e.indexOf(n);return i>-1&&e.splice(i,1),e}addSharedTextureUpload(e,n="env_diffuse",i="uSpecularEnvSampler",r=["repeat"]){const s=this.createFileInput(e,n);s.inputFile.addEventListener("change",()=>{if(this.webglManager){const a=s.inputFile.files[0],o=new Image;o.onload=()=>{const l=this.webglManager.textureLoader.initTexture(o,r);for(const h in this.webglManager.scenes){const c=this.webglManager.scenes[h],u=c&&c.scene?c.scene:null;if(u&&u.meshes)for(let f=0,d=u.meshes.length;f<d;f++){const p=u.meshes[f];p.localState&&p.localState.uniforms[i]&&(p.localState.uniforms[i].value=l,p.localState.uniforms[i].value.needsUpdate=!0,p.maxTextureIndex++,p.localState.uniforms[i].textIndx=p.maxTextureIndex)}URL.revokeObjectURL(o.src)}},a&&(o.src=URL.createObjectURL(a))}else console.warn("missing `this.webglManager`, needed to add shared textures upload in the GUI")})}addTextureUpload(e,n={}){const r={...{maps:["albedoMap","albedoMapUnlit","normalTexture","ORMTexture","metallicRoughnessTexture","alphaTexture","emissiveTexture","occlusionTexture"],callback:null,textureOptions:["repeat"]},...n};let s=!1;if(e.gui&&(e.gui.textureInputs?s=!0:e.gui.textureInputs={}),s){for(const a in e.gui.textureInputs)if(Object.hasOwnProperty.call(e.gui.textureInputs,a)){const o=e.gui.textureInputs[a].inputFile;this.bindUploadInput(o,a,e,r)}}else{const a=e.defines;a.HAS_NORMALMAP||this.removeItemFromArray(r.maps,"normalTexture"),a.HAS_ORM_MAP||this.removeItemFromArray(r.maps,"ORMTexture"),a.HAS_METALROUGHNESSMAP||this.removeItemFromArray(r.maps,"metallicRoughnessTexture"),a.HAS_EMISSIVEMAP||this.removeItemFromArray(r.maps,"emissiveTexture"),a.HAS_OCCLUSIONMAP||this.removeItemFromArray(r.maps,"occlusionTexture"),a.HAS_ALPHAMAP||this.removeItemFromArray(r.maps,"alphaTexture"),a.USE_IBL?(this.removeItemFromArray(r.maps,"albedoMapUnlit"),a.HAS_BASECOLORMAP||this.removeItemFromArray(r.maps,"albedoMap")):a.HAS_BASECOLORMAP||this.removeItemFromArray(r.maps,"albedoMapUnlit");for(let o=0;o<r.maps.length;o++){const l=r.maps[o],h=this.createFileInput(e.gui,l);h?this.bindUploadInput(h.inputFile,l,e,r):this.active&&console.warn("entity.gui is undefined, cannot add texture upload button",r)}}}createFileInput(e,n){const i=document.createElement("input");if(i.type="file",i.classList.add("input-file"),e){const r=e.addButton({title:n,label:"Upload texture",index:1});return r.on("click",()=>{i.click()}),e.textureInputs==null&&(e.textureInputs={}),e.textureInputs[n]={debugBtn:r,inputFile:i},e.textureInputs[n]}return null}bindUploadInput(e,n,i,r){e.addEventListener("change",s=>{const a=e.files[0],o=new Image;o.onload=()=>{let l;if(i.scene.textureLoader)l=i.scene.textureLoader.initTexture(o,r.textureOptions);else{console.warn("entity.scene.textureLoader is undefined, cannot create texture from image",r);return}let h=null;n==="albedoMap"&&(h="uBaseColorSampler"),n==="ORMTexture"&&(h="uOcclusionRoughnessMetallicSampler"),n==="metallicRoughnessTexture"&&(h="uMetallicRoughnessSampler"),n==="normalTexture"&&(h="uNormalSampler"),n==="emissiveTexture"&&(h="uEmissiveSampler"),n==="occlusionTexture"&&(h="uOcclusionSampler"),n==="alphaTexture"&&(h="uAlphaMapSampler"),n==="albedoMapUnlit"&&(h="uTexture"),h&&i.program.uniforms[h]?(i.program.uniforms[h].value=l,i.program.uniforms[h].value.needsUpdate=!0):console.warn("no uniform matching that title:",n," - uniforms:",i.program.uniforms),r.callback&&r.callback(l),URL.revokeObjectURL(o.src)},a&&(o.src=URL.createObjectURL(a))})}}const Oe=new Pd;class Td{constructor(e,n,{parent:i=null,scale:r=1,blendFunc:s={src:e.gl.SRC_ALPHA,dst:e.gl.ONE_MINUS_SRC_ALPHA},transparent:a=!1,depthTest:o=!0,depthWrite:l=!0,renderOrder:h=0,alpha:c=1,hasShadow:u=!1,name:f="PlaneEntity",textureId:d=null,textureScale:p=1,cullFace:m=e.gl.FRONT,color:x=[1,1,1]}={}){this.gl=e.gl,this.scene=e,this.parent=i||e.root,this.scale=r,this.transparent=a,this.blendFunc=s,this.depthTest=o,this.depthWrite=l,this.textureId=d,this.textureScale=p,this.renderOrder=h,this.hasShadow=u,this.name=f,this.cullFace=m,this.defines={},this.hasShadow&&(this.defines.HAS_SHADOW=1),this.textureId&&(this.defines.HAS_BASECOLORMAP=1),this.shader=new Sn(mt[n],1,this.defines),this.texture=new it(this.gl),this.alpha=c,this.color=Se(x[0],x[1],x[2]),this.init()}init(){this.geometry=new Xt(this.gl),this.uniforms={uTexture:{value:this.texture},uTime:{value:this.scene.time},uAlpha:{value:this.alpha},uColor:{value:this.color},uRez:{value:[this.scene.width,this.scene.height]}},this.textureId&&Object.assign(this.uniforms,{uTextureScale:{value:this.textureScale}}),this.program=new vi(this.gl,{vertex:this.shader.vert,fragment:this.shader.frag,debugShader:Oe.active,depthTest:this.depthTest,depthWrite:this.depthWrite,transparent:this.transparent,uniforms:this.uniforms}),this.program.cullFace=this.cullFace,this.program.setBlendFunc(this.blendFunc.src,this.blendFunc.dst),this.mesh=new bi(this.gl,{geometry:this.geometry,program:this.program,renderOrder:this.renderOrder}),this.mesh.scale.set(this.scale,this.scale,this.scale),this.mesh.name=this.name,this.mesh.setParent(this.parent)}onLoaded(){if(this.textureId){if(this.texture=this.scene.textureLoader.getTexture(this.textureId),!this.texture){console.error(`Texture ${this.textureId} not found`);return}this.texture.needsUpdate=!0,this.program.uniforms.uTexture.value=this.texture}}preRender(){this.program.uniforms.uTime.value=this.scene.time,this.program.uniforms.uAlpha.value=this.alpha,this.program.uniforms.uColor.value=this.color,this.program.uniforms.uRez.value=[this.scene.width,this.scene.height]}dispose(){this.mesh.setParent(null),this.geometry.remove(),this.program.remove()}}function Sa(t,e,n){return Math.min(n,Math.max(e,t))}for(var Nn=0;Nn<256;Nn++)(Nn<16?"0":"")+Nn.toString(16);function Sd(t){let e=0;for(let i=0;i<t.length;i++)e=e+t[i];const n=e/t.length;return n!==1/0?n:0}const kn=Hr();class Cd{constructor(e){this.cursor=Xe(0,0),this.downCursor=Xe(0,0),this.drag=Xe(0,0),this.dragStartCursor=Xe(0,0),this.lastCursor=Xe(0,0),this.velocity=Xe(0,0),this.dampedCursor=Xe(.5,.5),this.target=e||window,this.wheelVelocity=Xe(0,0),this.wheel=Xe(0,0),this.lastWheel=Xe(0,0),this.screenWidth=window.innerWidth,this.screenHeight=window.innerHeight,this.isDown=!1,this.isDragging=!1,this.wheelDir=null,this.isPinching=!1,this.pinchDistanceStart=0,this.pinchDistance=0,this.wheelConfigBy=.07,this.wheelSpeed=.35,this.isWheelLock=!1,this.normalizeWheel=0,this.current=0,this.maxWheel=3750,this.minDistanceToTriggerDrag=.01,this.emitter={},this.preventDamping=!1,this.preventIOSGestures=!0,Tn(this.emitter),this.on=this.emitter.on.bind(this.emitter),this.off=this.emitter.off.bind(this.emitter),at.subscribe("mouse",()=>{this.update()}),this.config={damping:{value:.175,params:{min:0,max:.5,step:.001}}},this.initEvents(),window.__debugMouse=this}initEvents(){Vt?(this.target.addEventListener("touchstart",e=>{this.onTouchStart(e)}),this.target.addEventListener("touchend",e=>{this.onTouchEnd(e)}),this.target.addEventListener("touchmove",e=>{this.onTouchMove(e)}),this.preventIOSGestures&&(document.addEventListener("gesturestart",e=>{e.preventDefault(),document.body.style.zoom=.99}),document.addEventListener("gesturechange",function(e){e.preventDefault(),document.body.style.zoom=.99}),document.addEventListener("gestureend",function(){document.body.style.zoom=1}))):(this.target.addEventListener("mousedown",e=>{this.onDown(e)}),this.target.addEventListener("mousemove",e=>{this.onMouve(e)}),this.target.addEventListener("mouseup",e=>{this.onUp(e)}),this.target.addEventListener("wheel",e=>{this.onWheel(e)},{passive:!1})),this.target.addEventListener("click",()=>{this.emitter.emit("click")}),window.addEventListener("resize",()=>{this.screenWidth=window.innerWidth,this.screenHeight=window.innerHeight})}onTouchStart(e){if(e&&e.touches.length===2)this.isPinching=!0,this.pinchDistanceStart=Math.hypot(e.touches[0].pageX-e.touches[1].pageX,e.touches[0].pageY-e.touches[1].pageY),this.emitter.emit("pinch-start",this);else{const n=e.touches[0]?e.touches[0]:e;this.onDown(n)}}onTouchEnd(e){this.isPinching&&e.touches.length<3&&(this.isPinching=!1,this.pinchDistanceStart=0,this.pinchDistance=0);const n=e.touches[0]?e.touches[0]:e;this.onUp(n)}onTouchMove(e){if(this.isPinching)this.pinchDistance=this.pinchDistanceStart-Math.hypot(e.touches[0].pageX-e.touches[1].pageX,e.touches[0].pageY-e.touches[1].pageY),this.emitter.emit("pinch",this);else{const n=e.touches[0]?e.touches[0]:e;this.onMouve(n)}}onDown(e){this.cursor[0]=(e.clientX/this.screenWidth-.5)*2,this.cursor[1]=(e.clientY/this.screenHeight-.5)*2,this.lastCursor[0]=this.cursor[0],this.lastCursor[1]=this.cursor[1],this.downCursor[0]=this.cursor[0],this.downCursor[1]=this.cursor[1],this.dragStartCursor[0]=this.cursor[0],this.dragStartCursor[1]=this.cursor[1],this.isDown=!0,this.emitter.emit("down",this)}onUp(e){this.isDown=!1,this.isDragging=!1,this.emitter.emit("up",this)}onWheel(e){this.isWheelLock||(this.lastWheel[0]=this.wheel[0],this.lastWheel[1]=this.wheel[1],this.wheel[0]=e.deltaX,this.wheel[1]=e.deltaY,this.wheelDir=e.deltaY<0?"up":"down",this.current+=e.deltaY*this.wheelConfigBy*this.wheelSpeed,this.current=Sa(this.current,0,this.maxWheel),this.normalizeWheel=this.current/this.maxWheel,this.emitter.emit("wheel",this))}onMouve(e){if(this.cursor[0]=(e.clientX/this.screenWidth-.5)*2,this.cursor[1]=(e.clientY/this.screenHeight-.5)*2,this.emitter.emit("mouve",this),this.isDown&&(this.drag[0]=this.cursor[0]-this.downCursor[0],this.drag[1]=this.cursor[1]-this.downCursor[1],this.downCursor[0]=this.cursor[0],this.downCursor[1]=this.cursor[1],Cu(this.dragStartCursor,this.cursor)>this.minDistanceToTriggerDrag&&(this.isDragging=!0,this.emitter.emit("drag",this))),!this.isWheelLock&&Vt){let n=(this.cursor[1]-this.lastCursor[1])*-.01;this.normalizeWheel=Sa(n+this.normalizeWheel,0,1)}}update(){this.velocity[0]=this.cursor[0]-this.lastCursor[0],this.velocity[1]=this.cursor[1]-this.lastCursor[1],this.wheelVelocity[0]=this.wheel[0]-this.lastWheel[0],this.wheelVelocity[1]=this.wheel[1]-this.lastWheel[1],this.lastCursor[0]=this.cursor[0],this.lastCursor[1]=this.cursor[1],this.preventDamping||(Su(kn,this.cursor,this.dampedCursor),Pu(kn,kn,this.config.damping.value),Au(this.dampedCursor,this.dampedCursor,kn))}}const me=new Cd,Rd=new vt,Od=new ue,Fd=new ue;class Ld extends qr{constructor(e,{near:n=.1,far:i=100,fov:r=45,aspect:s=1,left:a,right:o,bottom:l,top:h,zoom:c=1}={}){super(),Object.assign(this,{near:n,far:i,fov:r,aspect:s,left:a,right:o,bottom:l,top:h,zoom:c}),this.projectionMatrix=new vt,this.viewMatrix=new vt,this.projectionViewMatrix=new vt,this.worldPosition=new ue,this.isFliped=!1,this.type=a||o?"orthographic":"perspective",this.type==="orthographic"?this.orthographic():this.perspective()}perspective({near:e=this.near,far:n=this.far,fov:i=this.fov,aspect:r=this.aspect}={}){return Object.assign(this,{near:e,far:n,fov:i,aspect:r}),this.projectionMatrix.fromPerspective({fov:i*(Math.PI/180),aspect:r,near:e,far:n}),this.type="perspective",this}orthographic({near:e=this.near,far:n=this.far,left:i=this.left,right:r=this.right,bottom:s=this.bottom,top:a=this.top,zoom:o=this.zoom}={}){return Object.assign(this,{near:e,far:n,left:i,right:r,bottom:s,top:a,zoom:o}),i/=o,r/=o,s/=o,a/=o,this.projectionMatrix.fromOrthogonal({left:i,right:r,bottom:s,top:a,near:e,far:n}),this.type="orthographic",this}updateMatrixWorld(e=!1){return super.updateMatrixWorld(),e&&(this.worldMatrix[1]*=-1,this.worldMatrix[5]*=-1,this.worldMatrix[9]*=-1,this.worldMatrix[13]*=-1),this.isFliped=e,this.viewMatrix.inverse(this.worldMatrix),this.worldMatrix.getTranslation(this.worldPosition),this.projectionViewMatrix.multiply(this.projectionMatrix,this.viewMatrix),this}lookAt(e){return super.lookAt(e,!0),this}project(e){return e.applyMatrix4(this.viewMatrix),e.applyMatrix4(this.projectionMatrix),this}unproject(e){return e.applyMatrix4(Rd.inverse(this.projectionMatrix)),e.applyMatrix4(this.worldMatrix),this}updateFrustum(){this.frustum||(this.frustum=[new ue,new ue,new ue,new ue,new ue,new ue]);const e=this.projectionViewMatrix;this.frustum[0].set(e[3]-e[0],e[7]-e[4],e[11]-e[8]).constant=e[15]-e[12],this.frustum[1].set(e[3]+e[0],e[7]+e[4],e[11]+e[8]).constant=e[15]+e[12],this.frustum[2].set(e[3]+e[1],e[7]+e[5],e[11]+e[9]).constant=e[15]+e[13],this.frustum[3].set(e[3]-e[1],e[7]-e[5],e[11]-e[9]).constant=e[15]-e[13],this.frustum[4].set(e[3]-e[2],e[7]-e[6],e[11]-e[10]).constant=e[15]-e[14],this.frustum[5].set(e[3]+e[2],e[7]+e[6],e[11]+e[10]).constant=e[15]+e[14];for(let n=0;n<6;n++){const i=1/this.frustum[n].distance();this.frustum[n].multiply(i),this.frustum[n].constant*=i}}frustumIntersectsMesh(e){if(!e.geometry.attributes.position||((!e.geometry.bounds||e.geometry.bounds.radius===1/0)&&e.geometry.computeBoundingSphere(),!e.geometry.bounds))return!0;const n=Od;n.copy(e.geometry.bounds.center),n.applyMatrix4(e.worldMatrix);const i=e.geometry.bounds.radius*e.worldMatrix.getMaxScaleOnAxis();return this.frustumIntersectsSphere(n,i)}frustumIntersectsSphere(e,n){const i=Fd;for(let r=0;r<6;r++){const s=this.frustum[r];if(i.copy(s).dot(e)+s.constant<-n)return!1}return!0}}const Ca={black:"#000000",white:"#ffffff",red:"#ff0000",green:"#00ff00",blue:"#0000ff",fuchsia:"#ff00ff",cyan:"#00ffff",yellow:"#ffff00",orange:"#ff8000"};function Ra(t){t.length===4&&(t=t[0]+t[1]+t[1]+t[2]+t[2]+t[3]+t[3]);const e=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);return e||console.warn(`Unable to convert hex string ${t} to rgb values`),[parseInt(e[1],16)/255,parseInt(e[2],16)/255,parseInt(e[3],16)/255]}function Id(t){return t=parseInt(t),[(t>>16&255)/255,(t>>8&255)/255,(t&255)/255]}function Oa(t){return t===void 0?[0,0,0]:arguments.length===3?arguments:isNaN(t)?t[0]==="#"?Ra(t):Ca[t.toLowerCase()]?Ra(Ca[t.toLowerCase()]):(console.warn("Color format not recognised"),[0,0,0]):Id(t)}function Vi(t){var e=t.toString(16);return e.length==1?"0"+e:e}function Dd(t,e,n){return"#"+Vi(t)+Vi(e)+Vi(n)}class ze extends Array{constructor(e){return Array.isArray(e)?super(...e):super(...Oa(...arguments))}get r(){return this[0]}get g(){return this[1]}get b(){return this[2]}getHex(){return Dd(Math.round(this[0]*255),Math.round(this[1]*255),Math.round(this[2]*255))}getRGBA(){return[this[0],this[1],this[2],1]}set r(e){this[0]=e}set g(e){this[1]=e}set b(e){this[2]=e}set(e){return Array.isArray(e)?this.copy(e):this.copy(Oa(...arguments))}copy(e){return this[0]=e[0],this[1]=e[1],this[2]=e[2],this}}const Ud=[-1,1,0,-1,-1,0,1,-1,0,1,1,0],Bd=[0,1,2,0,2,3],zd=[0,1,0,0,1,0,1,1];jt();class Nd{constructor(e,{parent:n=null,blendFunc:i={},transparent:r=!0,depthTest:s=!1,depthWrite:a=!1,alpha:o=1,name:l="Background"}={}){this.gl=e.gl,this.scene=e,this.transparent=r,this.blendFunc=i,this.depthTest=s,this.depthWrite=a,this.name=l,this.parent=n||e.root,this.viewDirProjInverse=jt(),this.shader=new Sn(mt.background),this.texture=new it(this.gl),this.alpha=o,this.time=0,this.speed=0,this.pageOffset=0,this.config={Color1:{value:"#948765",params:{}},Color2:{value:"#00253c",params:{}},Color3:{value:"#46232c",params:{}},Color4:{value:"#ec683a",params:{}},ColorBackground:{value:"#dcb1a1",params:{}},Opacity:{value:.5,params:{min:0,max:1,step:.01}}},this.init()}init(){this.geometry=new Xt(this.gl);const e={position:{size:3,data:new Float32Array(Ud)},uv:{size:2,data:new Float32Array(zd)},index:{data:new Uint16Array(Bd)}};this.geometry=new mi(this.gl,e),this.program=new vi(this.gl,{vertex:this.shader.vert,fragment:this.shader.frag,depthTest:this.depthTest,depthWrite:this.depthWrite,transparent:this.transparent,uniforms:{uTextureNoise:{value:this.texture},uTime:{value:this.scene.time},uViewDirProjInverse:{value:this.viewDirProjInverse},uRez:{value:[this.scene.width,this.scene.height]},uMouse:{value:me.cursor},uColorBackground:{value:new ze(this.config.ColorBackground.value)},uColor1:{value:[0,0,0]},uColor2:{value:[0,0,0]},uColor3:{value:[0,0,0]},uColor4:{value:[0,0,0]},uProgress:{value:0},uAlpha:this.config.Opacity}}),this.program.cullFace=!1,this.mesh=new bi(this.gl,{geometry:this.geometry,program:this.program,renderOrder:-1}),this.mesh.name=this.name,this.mesh.setParent(this.parent)}initGui(){Oe.addBlade(this.config,`${this.scene.name} - ${this.name}`,1)}onLoaded(){this.initGui()}preRender(){this.pageOffset+=(window.pageYOffset-this.pageOffset)*.1,this.time+=this.scene.dt/1e3*2;let e=this.pageOffset/(this.scene.height/this.scene.dpr),n=Math.max(1-e*2,0);this.program.uniforms.uTime.value=this.time,this.program.uniforms.uRez.value=[this.scene.width,this.scene.height],this.program.uniforms.uMouse.value=me.cursor,this.program.uniforms.uProgress.value=n,this.program.uniforms.uColorBackground.value=new ze(this.config.ColorBackground.value),this.program.uniforms.uColor1.value=new ze(this.config.Color1.value),this.program.uniforms.uColor2.value=new ze(this.config.Color2.value),this.program.uniforms.uColor3.value=new ze(this.config.Color3.value),this.program.uniforms.uColor4.value=new ze(this.config.Color4.value)}dispose(){this.mesh.setParent(null),this.geometry.remove(),this.program.remove()}}const kd=[-1,1,0,-1,-1,0,1,-1,0,1,1,0],$d=[0,1,2,0,2,3],Wd=[0,1,0,0,1,0,1,1];jt();class jd{constructor(e,{parent:n=null,blendFunc:i={},transparent:r=!0,depthTest:s=!1,depthWrite:a=!1,alpha:o=1,name:l="Flare"}={}){this.gl=e.gl,this.scene=e,this.transparent=r,this.blendFunc=i,this.depthTest=s,this.depthWrite=a,this.name=l,this.parent=n||e.root,this.viewDirProjInverse=jt(),this.shader=new Sn(mt.flare),this.texture=new it(this.gl),this.alpha=o,this.speed=0,this.speedTarget=0,this.pageOffset=0,this.lightPos=Hr(),this.time=Math.random()*100,this.config={ColorHalo:{value:"#e70c25",params:{}},StrengthHalo:{value:2.25,params:{min:0,max:3,step:.01}},OpacityHalo:{value:.85,params:{min:0,max:1,step:.01}},ColorGradient1:{value:"#005f77",params:{}},ColorGradient2:{value:"#dfd7cd",params:{}},StrengthGradient:{value:1.7,params:{min:0,max:3,step:.01}},OpacityGradient:{value:.6,params:{min:0,max:1,step:.01}},OpacityGeneral:{value:.35,params:{min:0,max:1,step:.01}},Grain:{value:.8,params:{min:0,max:3,step:.01}},Speed:{value:.6,params:{min:0,max:5,step:.01}}},this.init()}init(){this.geometry=new Xt(this.gl);const e={position:{size:3,data:new Float32Array(kd)},uv:{size:2,data:new Float32Array(Wd)},index:{data:new Uint16Array($d)}};this.geometry=new mi(this.gl,e),this.program=new vi(this.gl,{vertex:this.shader.vert,fragment:this.shader.frag,depthTest:this.depthTest,depthWrite:this.depthWrite,transparent:this.transparent,uniforms:{uTextureNoise:{value:this.texture},uTime:{value:this.scene.time},uViewDirProjInverse:{value:this.viewDirProjInverse},uRez:{value:[this.scene.width,this.scene.height]},uMouse:{value:me.cursor},uColorHalo:{value:[0,0,0]},uLightPos:{value:[0,0]},uStrengthHalo:this.config.StrengthHalo,uOpacityHalo:this.config.OpacityHalo,uColorGradient1:{value:[0,0,0]},uColorGradient2:{value:[0,0,0]},uStrengthGradient:this.config.StrengthGradient,uOpacityGradient:this.config.OpacityGradient,uAlpha:{value:0},uGrain:this.config.Grain}}),this.program.cullFace=!1,this.program.setBlendFunc(this.gl.SRC_ALPHA,this.gl.ONE),this.mesh=new bi(this.gl,{geometry:this.geometry,program:this.program,renderOrder:100}),this.mesh.name=this.name,this.mesh.setParent(this.parent)}initGui(){Oe.addBlade(this.config,`${this.scene.name} - ${this.name}`,1)}onLoaded(){this.initGui()}preRender(){this.speedTarget+=((window.pageYOffset-this.pageOffset)*.5-this.speedTarget)*.25,this.pageOffset=window.pageYOffset,this.time+=this.scene.dt*this.config.Speed.value/1e3*(1+this.speed)*.5,this.lightPos[0]=Math.sin(this.time)*.5,this.lightPos[1]=Math.sin(this.time*.913)*.5,this.lightPos[0]+=me.dampedCursor[0]*1,this.lightPos[1]+=-me.dampedCursor[1]*1;let e=this.pageOffset/(this.scene.height/this.scene.dpr),n=Math.max(1-e*2,0);this.program.uniforms.uTime.value=this.time,this.program.uniforms.uRez.value=[this.scene.width,this.scene.height],this.program.uniforms.uMouse.value=me.cursor,this.program.uniforms.uLightPos.value=this.lightPos,this.program.uniforms.uAlpha.value=n*this.config.OpacityGeneral.value,this.program.uniforms.uColorHalo.value=new ze(this.config.ColorHalo.value),this.program.uniforms.uColorGradient1.value=new ze(this.config.ColorGradient1.value),this.program.uniforms.uColorGradient2.value=new ze(this.config.ColorGradient2.value)}dispose(){this.mesh.setParent(null),this.geometry.remove(),this.program.remove()}}class br{constructor(e,n=1,i="rgb",r=null,s=!1,a="linear",o=!1,l=null){this.scene=e,this.gl=e.gl,this.pixelRatio=n,this.format=i,this.size=r,this.depth=s,this.filter=a,this.transparent=o,this.depthTexture=null,this.previousFrameBuffer=null,this.preventResize=!1,this.data=l,r===null?(this.width=this.scene.width*this.pixelRatio,this.height=this.scene.height*this.pixelRatio):(this.width=r,this.height=r),this.createTexture(),s&&this.createDepthTexture(),this.createFB(),this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,null),this.scene.manager.on("resize",this.onResize.bind(this)),setTimeout(()=>{this.onResize()},1e3)}createTexture(){let e=this.gl;this.targetTexture=this.gl.createTexture(),e.bindTexture(e.TEXTURE_2D,this.targetTexture);let n=0,i=e.RGBA,r=0,s=e.RGBA,a=e.UNSIGNED_BYTE;this.format==="float"&&(a=Zr?e.FLOAT:e.HALF_FLOAT||e.renderer.extensions.OES_texture_half_float.HALF_FLOAT_OES,i=e.renderer.isWebgl2?a===e.FLOAT?e.RGBA32F:e.RGBA16F:e.RGBA);let o=this.data;e.texImage2D(e.TEXTURE_2D,n,i,this.width,this.height,r,s,a,o),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),this.filter=="nearest"&&(e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST)),e.bindTexture(e.TEXTURE_2D,null)}createDepthTexture(){let e=this.scene.gl;this.depthTexture=e.createTexture(),e.bindTexture(e.TEXTURE_2D,this.depthTexture),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,e.renderer.isWebgl2?e.DEPTH_COMPONENT24:e.DEPTH_COMPONENT,this.width,this.height,0,e.DEPTH_COMPONENT,e.UNSIGNED_INT,null),e.bindTexture(e.TEXTURE_2D,null)}onResize(){if(this.preventResize)return;let e=this.gl;this.size===null?(this.width=this.scene.width*this.pixelRatio,this.height=this.scene.height*this.pixelRatio):(this.width=this.size,this.height=this.size),e.deleteTexture(this.targetTexture),this.depth&&e.deleteTexture(this.depthTexture),e.deleteFramebuffer(this.fb),this.createTexture(),this.depth&&this.createDepthTexture(),this.createFB(),this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,null)}createFB(){let e=this.gl;this.fb=e.createFramebuffer(),this.fb.width=this.width,this.fb.height=this.height,e.bindFramebuffer(e.FRAMEBUFFER,this.fb);const n=0,i=e.COLOR_ATTACHMENT0;e.framebufferTexture2D(e.FRAMEBUFFER,i,e.TEXTURE_2D,this.targetTexture,n);const r=e.createRenderbuffer();e.bindRenderbuffer(e.RENDERBUFFER,r),e.renderbufferStorage(e.RENDERBUFFER,e.DEPTH_COMPONENT16,this.width,this.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.RENDERBUFFER,r),this.depth&&e.framebufferTexture2D(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.TEXTURE_2D,this.depthTexture,0)}clear(){let e=this.gl;this.transparent?(e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT)):(e.clearColor(this.scene.clearColor[0],this.scene.clearColor[1],this.scene.clearColor[2],this.scene.clearColor[3]),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT))}preRender(){let e=this.gl;this.previousFrameBuffer=this.scene.activeFrameBuffer!==void 0?this.scene.activeFrameBuffer:null,this.scene.activeFrameBuffer=this.fb,e.bindFramebuffer(e.FRAMEBUFFER,this.scene.activeFrameBuffer),e.viewport(0,0,this.width,this.height),this.clear()}postRender(){let e=this.gl;this.scene.activeFrameBuffer=this.previousFrameBuffer,e.bindFramebuffer(e.FRAMEBUFFER,this.scene.activeFrameBuffer),e.viewport(0,0,this.scene.width,this.scene.height)}bind(){let e=this.gl;e.bindTexture(e.TEXTURE_2D,this.targetTexture)}bindDepth(){let e=this.gl;this.depth&&e.bindTexture(e.TEXTURE_2D,this.depthTexture)}getTexture(){return this.targetTexture}getDepthTexture(){return this.depthTexture}}class Vd{constructor(e){this.scene=e,this.gl=e.gl,this.uniforms={},this.hasNormal=!0,this.onlyVertices=!1,this.customAttributes=[],this.node=new Gr,this.defines={},this.buffersOptions={},this.isHidden=!1}initProgram(e,n){let i=this.gl,s=function(c){let u="";for(let f in c)u+="#define "+f+" "+c[f]+`
`;return u}(this.defines),a=i.createShader(i.VERTEX_SHADER);i.shaderSource(a,s+e),i.compileShader(a);let o=i.createShader(i.FRAGMENT_SHADER);if(i.shaderSource(o,s+n),i.compileShader(o),!i.getShaderParameter(a,i.COMPILE_STATUS))return console.error("error vert",this,i.getShaderInfoLog(a)),null;if(!i.getShaderParameter(o,i.COMPILE_STATUS))return console.error("error frag",this,i.getShaderInfoLog(o)),null;let l=i.createProgram();i.attachShader(l,a),i.attachShader(l,o),i.linkProgram(l),i.getProgramParameter(l,i.LINK_STATUS)||console.error("Could not initialise shaders",i.getProgramInfoLog(l)),i.useProgram(l),l.vertexPositionAttribute=i.getAttribLocation(l,"aPos"),this.onlyVertices||(l.vertexUvAttribute=i.getAttribLocation(l,"aUvs")),this.hasNormal&&(l.vertexNormalAttribute=i.getAttribLocation(l,"aNormal")),this.customAttributes.forEach(c=>{l[`${c.name}Attribute`]=i.getAttribLocation(l,c.attributeName)}),this.vertShader=a,this.fragSahder=o,this.program=l;const h=i.getProgramParameter(l,i.ACTIVE_ATTRIBUTES);for(let c=0;c<h;++c){const u=i.getActiveAttrib(l,c);i.getAttribLocation(l,u.name)}}initVao(){let e=this.gl,n=this.buffersOptions;this.vao=e.createVertexArray(),e.bindVertexArray(this.vao),e.bindBuffer(e.ARRAY_BUFFER,this.vertexPositionBuffer),e.vertexAttribPointer(this.program.vertexPositionAttribute,3,e.FLOAT,!1,n.vertices?n.vertices.byteStride:0,n.vertices?n.vertices.byteOffset:0),e.enableVertexAttribArray(this.program.vertexPositionAttribute),this.onlyVertices||(e.bindBuffer(e.ARRAY_BUFFER,this.uvsBuffer),e.vertexAttribPointer(this.program.vertexUvAttribute,2,e.FLOAT,!1,n.uvs?n.uvs.byteStride:0,n.uvs?n.uvs.byteOffset:0),e.enableVertexAttribArray(this.program.vertexUvAttribute)),this.hasNormal&&(e.bindBuffer(e.ARRAY_BUFFER,this.normalBuffer),e.vertexAttribPointer(this.program.vertexNormalAttribute,3,e.FLOAT,!1,n.normals?n.normals.byteStride:0,n.normals?n.normals.byteOffset:0),e.enableVertexAttribArray(this.program.vertexNormalAttribute));for(let i=0;i<this.customAttributes.length;i++){const r=this.customAttributes[i];e.bindBuffer(e.ARRAY_BUFFER,r.buffer),e.vertexAttribPointer(this.program[r.name+"Attribute"],r.dimensions,e.FLOAT,!1,0,0),e.enableVertexAttribArray(this.program[r.name+"Attribute"])}this.onlyVertices||e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,this.indicesBuffer),e.bindVertexArray(null)}initBuffer(e){let n=this.gl;e.options&&(this.buffersOptions=e.options);let i=n.createBuffer();n.bindBuffer(n.ARRAY_BUFFER,i),n.bufferData(n.ARRAY_BUFFER,new Float32Array(e.vertices),n.STATIC_DRAW);let r=n.createBuffer();this.hasNormal&&(n.bindBuffer(n.ARRAY_BUFFER,r),n.bufferData(n.ARRAY_BUFFER,new Float32Array(e.normal),n.STATIC_DRAW));let s=n.createBuffer(),a=n.createBuffer();this.onlyVertices||(n.bindBuffer(n.ARRAY_BUFFER,s),n.bufferData(n.ARRAY_BUFFER,new Float32Array(e.uvs),n.STATIC_DRAW),n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,a),n.bufferData(n.ELEMENT_ARRAY_BUFFER,new Uint16Array(e.indices),n.STATIC_DRAW)),this.customAttributes.forEach(o=>{o.buffer=n.createBuffer(),n.bindBuffer(n.ARRAY_BUFFER,o.buffer),n.bufferData(n.ARRAY_BUFFER,new Float32Array(o.data),n.STATIC_DRAW)}),this.vertexPositionBuffer=i,this.uvsBuffer=s,this.hasNormal&&(this.normalBuffer=r),this.indicesBuffer=a}initMatrix(){this.createUniform("uPMatrix","mat4"),this.createUniform("uVMatrix","mat4"),this.createUniform("uMMatrix","mat4")}bindMatrixUniforms(e){this.bindUniform("uPMatrix",e.getProjectionMatrix()),this.bindUniform("uVMatrix",e.getViewMatrix()),this.bindUniform("uMMatrix",this.node.getMatrix())}createUniform(e,n="float1"){return this.program[e+"Uniform"]=this.gl.getUniformLocation(this.program,e),this.uniforms[e+"Uniform"]={name:e,type:n,uniform:this.program[e+"Uniform"]},this.program[e+"Uniform"]}createAttribute(e,n,i,r){this.customAttributes.push({name:e,attributeName:n,dimensions:i,buffer:null,data:r})}bindUniform(e,n){let i=this.gl;this.uniforms[e+"Uniform"].type==="texture"&&i.uniform1i(this.program[e+"Uniform"],n),this.uniforms[e+"Uniform"].type==="textureCube"?i.uniform1i(this.program[e+"Uniform"],n):this.uniforms[e+"Uniform"].type==="float1"?i.uniform1f(this.program[e+"Uniform"],n):this.uniforms[e+"Uniform"].type==="float2"?i.uniform2fv(this.program[e+"Uniform"],n):this.uniforms[e+"Uniform"].type==="float3"?i.uniform3fv(this.program[e+"Uniform"],n):this.uniforms[e+"Uniform"].type==="float4"?i.uniform4fv(this.program[e+"Uniform"],n):this.uniforms[e+"Uniform"].type==="mat4"?i.uniformMatrix4fv(this.program[e+"Uniform"],!1,n):this.uniforms[e+"Uniform"].type==="[mat4]"&&i.uniformMatrix4fv(this.program[e+"Uniform"],!1,n)}checkVisibility(){return this.isHidden}}const Hd=[-1,1,0,-1,-1,0,1,-1,0,1,1,0],Hi=[0,1,2,0,2,3],Gd=[0,1,0,0,1,0,1,1];class Zd extends Vd{constructor(e,n,i){super(e),this.hasNormal=!1,this.parent=n,this.rtScale=.15,this.power=0,this.id=i,this.transparent=!0,this.direction=[0,0],this.threshold=0,this.color=Se(1,1,1),this.blurPass=[[4,-1],[-1,4],[1,0],[0,1]];var r=new Sn(mt.postBlur,2,{TRANSPARENT:this.transparent?1:0});this.initProgram(r.vert,r.passes[0]),this.initBuffer({vertices:Hd,uvs:Gd,indices:Hi}),this.initVao(),this.createUniforms(),this.activeRt=0,this.disabledRt=1,this.rts=[new br(this.scene,this.rtScale,"rgba",null,!0,"linear",this.transparent),new br(this.scene,this.rtScale,"rgba",null,!0,"linear",this.transparent)],this.config={BloomTint:{value:"#ffffff",params:{}},Threshold:{value:.7,params:{min:0,max:1.25,step:.01}},Blur:{value:1,params:{min:0,max:1,step:.01}},Overdrive:{value:0,params:{min:0,max:1,step:.01}},Similarity:{value:.1,params:{min:0,max:.2,step:.001}}},Oe.addBlade(this.config,`Bloom - ${this.scene.name||"Unknown"}`,0)}createUniforms(){this.createUniform("uTexture","texture"),this.createUniform("uRez","float2"),this.createUniform("uDir","float2"),this.createUniform("uTint","float3"),this.createUniform("uPower"),this.createUniform("uIsFirstPass"),this.createUniform("uThresold"),this.createUniform("uSimilarity"),this.createUniform("uOverdrive")}applyState(){let e=this.gl;this.scene.applyDefaultState(),e.disable(e.DEPTH_TEST),e.depthMask(!1)}preRender(){this.rts[this.disabledRt].preRender()}postRender(){this.rts[this.disabledRt].postRender(),this.activeRt=this.activeRt===1?0:1,this.disabledRt=this.disabledRt===1?0:1}clear(){this.rts[this.activeRt].clear(),this.rts[this.disabledRt].clear()}bind(){this.rts[this.activeRt].bind()}getTexture(){return this.rts[this.activeRt].getTexture()}render(){let e=this.gl;e.useProgram(this.program),e.bindVertexArray(this.vao),this.applyState(),this.preRender(),this.power=this.config.Blur.value,this.color=new ze(this.config.BloomTint.value),this.threshold=this.config.Threshold.value,this.bindUniform("uRez",[this.scene.width,this.scene.height]),this.direction=this.blurPass[0],this.bindUniform("uDir",[this.direction[0]*this.scene.dpr,this.direction[1]*this.scene.dpr]),e.activeTexture(e.TEXTURE0),this.parent.rt.bind(),this.bindUniform("uTexture",0),this.bindUniform("uPower",this.power),this.bindUniform("uIsFirstPass",1),this.bindUniform("uTint",this.color),this.bindUniform("uThresold",this.threshold),this.bindUniform("uSimilarity",this.config.Similarity.value),this.bindUniform("uOverdrive",this.config.Overdrive.value),e.drawElements(e.TRIANGLES,Hi.length,e.UNSIGNED_SHORT,0),this.postRender();for(let n=1;n<this.blurPass.length;n++)this.preRender(),this.direction=this.blurPass[n],this.bindUniform("uDir",[this.direction[0]*this.scene.dpr,this.direction[1]*this.scene.dpr]),e.activeTexture(e.TEXTURE0),this.rts[this.activeRt].bind(),this.bindUniform("uTexture",0),this.bindUniform("uIsFirstPass",0),e.drawElements(e.TRIANGLES,Hi.length,e.UNSIGNED_SHORT,0),this.postRender();e.bindVertexArray(null),e.bindFramebuffer(e.FRAMEBUFFER,null)}}const qd=[-1,1,0,-1,-1,0,1,-1,0,1,1,0],Xd=[0,1,2,0,2,3],Yd=[0,1,0,0,1,0,1,1];class Kd{constructor(e,{blendFunc:n={},transparent:i=!1,depthTest:r=!1,depthWrite:s=!1,renderOrder:a=0,alpha:o=1,fxaa:l=void 0}={}){this.gl=e.gl,this.scene=e,this.rt=new br(this.scene,1,"rgb",null,!0),this.transparent=i,this.blendFunc=n,this.depthTest=r,this.depthWrite=s,this.textureId=null,this.renderOrder=a,this.shader=new Sn(mt.post),this.texture=new it(this.gl,{rt:this.rt,width:this.rt.width,height:this.rt.height}),this.depthTexture=new it(this.gl,{rt:this.rt,depth:!0,width:this.rt.width,height:this.rt.height}),this.bloomTexture=new it(this.gl),this.alpha=o,this.fxaa=l===void 0?Zr&&this.scene.manager.dpr<2:l,this.config={Bloom:{value:!1,params:{}},ShowDepth:{value:!1,params:{}},BloomOpacity:{value:.5,params:{min:0,max:1,step:.01}},NoiseOpacity:{value:.15,params:{min:0,max:1,step:.01}},Gamma:{value:1.75,params:{min:0,max:2,step:.01}},Exposure:{value:0,params:{min:-2,max:2,step:.01}},Contrast:{value:0,params:{min:-1,max:1,step:.01}},Vignette:{value:.35,params:{min:0,max:1,step:.01}},ChromaticAberations:{value:.8,params:{min:0,max:1,step:.01}},VignetteColor:{value:"#8fac9d",params:{}},VignetteStrength:{value:.45,params:{min:0,max:1,step:.01}},FXAA:{value:this.fxaa,params:{}}},Oe.addBlade(this.config,`Post Processing - ${this.scene.name||"Unknown"}`,0),this.init()}init(){this.geometry=new Xt(this.gl);const e={position:{size:3,data:new Float32Array(qd)},uv:{size:2,data:new Float32Array(Yd)},index:{data:new Uint16Array(Xd)}};this.geometry=new mi(this.gl,e),this.program=new vi(this.gl,{vertex:this.shader.vert,fragment:this.shader.frag,depthTest:this.depthTest,depthWrite:this.depthWrite,transparent:this.transparent,uniforms:{uTexture:{value:this.texture},uDepth:{value:this.depthTexture},uBloom:{value:this.bloomTexture},uTime:{value:this.scene.time},uRez:{value:[this.scene.width,this.scene.height]},uMouse:{value:me.cursor},uVignette:this.config.Vignette,uVignetteColor:this.config.VignetteColor,uVignetteStrength:this.config.VignetteStrength,uNoiseOpacity:this.config.NoiseOpacity,uChromaticAberations:this.config.ChromaticAberations,uGamma:this.config.Gamma,uBloomOpacity:this.config.BloomOpacity,uExposure:this.config.Exposure,uContrast:this.config.Contrast,uBloomEnabled:this.config.Bloom,uShowDepth:this.config.ShowDepth,uFxaa:this.config.FXAA}}),this.program.cullFace=!1,this.mesh=new bi(this.gl,{geometry:this.geometry,program:this.program,renderOrder:this.renderOrder})}onLoaded(){this.scene.bloomPass&&(this.bloomTexture=new it(this.gl,{rt:this.scene.bloomPass.rts[0],width:this.scene.bloomPass.rts[0].width,height:this.scene.bloomPass.rts[0].height})),this.program.uniforms.uBloom.value=this.bloomTexture}preRender(){this.rt.preRender()}postRender(){this.rt.postRender()}resize(){}render({target:e=null}={}){this.program.uniforms.uTime.value=this.scene.time,this.program.uniforms.uRez.value=[this.scene.width,this.scene.height],this.program.uniforms.uMouse.value=me.cursor,this.program.uniforms.uVignetteColor.value=new ze(this.config.VignetteColor.value),this.texture.needsUpdate=!0,e?this.scene.renderer.render({scene:this.mesh,clear:!0,frustumCull:!1,sort:!1,target:e}):this.scene.renderer.render({scene:this.mesh,clear:!0,frustumCull:!1,sort:!1})}dispose(){this.mesh.setParent(null),this.geometry.remove(),this.program.remove()}}const Qd={CONFIG_0:{IBLDiffuseFactor:{value:1,params:{min:0,max:2,step:.01}},IBLSpecularFactor:{value:1,params:{min:0,max:2,step:.01}},Environment:{value:"env_autoshop",params:{options:{default:"env_default",autoshop:"env_autoshop",papermill:"env_papermill",night_sky:"env_night_sky",coffe_shop:"env_coffe_shop",studio:"env_studio"}}},EnvironmentDiffuse:{value:"env_diffuse",params:{options:{default:"env_diffuse"}}},EnvRotationOffset:{value:0,params:{min:0,max:1,step:.001}},lightColor:{value:"#ffffff",params:{}},lightPosition:{value:{x:1,y:3,z:1},params:{x:{step:1},y:{step:1},z:{step:1}}},emissiveColor:{value:"#000000",params:{}},FogColor:{value:"#ffffff",params:{}},FogNear:{value:15,params:{min:0,max:50,step:.01}},FogFar:{value:25,params:{min:0,max:50,step:.01}},lightPower:{value:5,params:{min:0,max:10,step:.01}},Alpha:{value:1,params:{min:0,max:1,step:.01}},Debug:{value:"disabled",params:{options:{disabled:"disabled",baseColor:"baseColor",metallic:"metallic",roughness:"roughness",specRef:"specRef",geomOcc:"geomOcc",mcrfctDist:"mcrfctDist",spec:"spec",mathDiff:"mathDiff"}}}}};class Jd{constructor(){this._emitter={},Tn(this._emitter),this.on=this._emitter.on.bind(this._emitter),this.off=this._emitter.off.bind(this._emitter),this.emit=this._emitter.emit.bind(this._emitter),this.once=this._emitter.once.bind(this._emitter)}}const ei=new Jd,ut=nt(),Fa=nt(),e0=Se(0,1,0);class t0{constructor(e,n,{pan:i=!0,startDistance:r=10,minDistance:s=1e-4,maxDistance:a=1/0,applyTransform:o=!0,startAngleX:l=Math.PI,startAngleY:h=-Math.PI/2,angleLimitY:c=[-Math.PI+.1,-.1],dragVelocity:u=5,target:f=[0,0,0]}={}){this.scene=e,this.camera=n,this.node=new Gr,this.offset=Se(h,l,0),this.offsetTarget=Se(h,l,0),this.radiusTarget=r,this.radius=r,this.pinchStartRadius=r,this.target=Se(f[0],f[1],f[2]),this.targetCopy=new ue,this.canPan=i,this.dragVelocity=u,this.angleLimitY=c,this.pan=nt(),this.altPressed=!1,this.prevent=!1,this.applyTransform=o,this.canZoom=!0,this.canRotate=!0,this.cameraDir=nt(),this.cameraUp=nt(),this.cameraRight=nt(),this.config={camera_damping:{value:.2,range:[.001,.1]}},me.on("pinch-start",()=>{!this.canZoom||this.prevent||(this.pinchStartRadius=this.radiusTarget)}),me.on("pinch",()=>{!this.canZoom||this.prevent||(this.radiusTarget=this.pinchStartRadius+me.pinchDistance*.03,this.radiusTarget=Math.max(Math.min(this.radiusTarget,a),s))}),me.on("wheel",()=>{this.canZoom&&(this.prevent||(me.wheelDir=="up"?this.radiusTarget+=.1:this.radiusTarget-=.1),this.radiusTarget=Math.max(Math.min(this.radiusTarget,a),s))}),this.canPan&&(window.addEventListener("keydown",d=>{d.key=="Alt"&&(this.altPressed=!0)}),window.addEventListener("keyup",d=>{d.key=="Alt"&&(this.altPressed=!1)})),Oe.on("drag-prevent",()=>{this.prevent=!0}),Oe.on("drag-unprevent",()=>{this.prevent=!1}),Oe.addConfig(this.config,"Orbit")}update(){this.prevent||(this.altPressed?me.isDown&&(Di(this.cameraDir),Di(this.cameraRight),Di(this.cameraUp),this.pan[0]=me.velocity[0]*-10,this.pan[1]=me.velocity[1]*(this.scene.width/this.scene.height)*5,Jn(this.cameraDir,this.node.position,this.target),En(this.cameraDir,this.cameraDir),Pt(this.cameraRight,e0,this.cameraDir),En(this.cameraRight,this.cameraRight),Pt(this.cameraUp,this.cameraDir,this.cameraRight),pn(ut,this.cameraRight,this.pan[0]),pn(Fa,this.cameraUp,this.pan[1]),dn(ut,ut,Fa),dn(this.target,this.target,ut)):me.isDown&&this.canRotate&&(this.offsetTarget[1]+=me.velocity[0]*this.dragVelocity,this.offsetTarget[0]+=me.velocity[1]*(this.scene.width/this.scene.height)*this.dragVelocity)),this.offsetTarget[0]=Math.min(Math.max(this.offsetTarget[0],this.angleLimitY[0]),this.angleLimitY[1]),Jn(ut,this.offsetTarget,this.offset),pn(ut,ut,this.config.camera_damping.value),dn(this.offset,this.offset,ut);let e=this.radiusTarget-this.radius;e*=this.config.camera_damping.value,this.radius+=e;let n=this.radius;this.node.position[0]=n*-Math.sin(this.offset[0])*Math.sin(this.offset[1])+this.target[0],this.node.position[1]=n*Math.cos(this.offset[0])+this.target[1],this.node.position[2]=n*Math.sin(this.offset[0])*Math.cos(this.offset[1])+this.target[2],this.applyTransform&&(this.camera.position.set(this.node.position[0],this.node.position[1],this.node.position[2]),this.targetCopy.set(this.target[0],this.target[1],this.target[2]),this.camera.lookAt(this.targetCopy))}}class n0{constructor(e,n){this.width=n.width,this.height=n.height,this.scene=n.scene,this.debug=n.debug,this.fov=n.fov||40,this.gl=e,this.toGo=new ue(0,0,10),this.toLook=new ue(0,0,0),this.lastWheel=0,this.catmulls={},this.mouse=[0,0],this.camera=new Ld(this.gl,{near:.01,far:1e3,fov:this.fov,aspect:this.width/this.height}),this.debug&&(this.debugMode=!0,this.orbit=new t0(this.scene,this.camera,{startAngleX:n.frontFacing?Math.PI:2.5,startAngleY:n.frontFacing?-Math.PI/2:-1,startDistance:7,target:[0,.5,0]}),Oe.on("gui-lazyloaded",this.initDebugEvents)),window.__cameraManager=this}resize(e,n){this.camera.perspective({aspect:e/n})}initDebugEvents(){}preRender(){this.update(),this.orbit&&this.orbit.update()}addSpline(e,n){this.catmulls[n]=e}update(){this.debugMode?(this.scene.progressTarget=this.scene.time*.01%1,this.scene.progress=this.scene.progressTarget):(this.catmulls.camera&&(ia(this.toGo,this.catmulls.camera.getPointLinearMotion(this.scene.progress)),Ui(this.camera.position,this.toGo,this.scene.debugManager.splineEditor.root.scale)),this.catmulls.lookat&&ia(this.toLook,this.catmulls.lookat.getPointLinearMotion(this.scene.progress+.01))),Ui(this.camera.position,this.toGo,this.scene.root.scale),Ui(this.toLook,this.toLook,this.scene.root.scale),this.camera.lookAt(this.toLook)}}class i0 extends Du{constructor(e,n=null){super(e,n),this.name="Main",this.manager=n,this.renderer=n.renderer,this.time=0,this.dt=0,this.drawcalls=0,this.progress=0,this.progressDelta=0,this.progressTarget=1e-5,this.timescale=1,this.forceAllDraw=!0,this.clearColor=this.manager.clearColor,this.loaded=!1,this.active=!1,this.root=new qr,this.root.scale.set(1,1,1),this.meshes=[],this.textureLoader=this.manager.textureLoader,this.config={Pause:{value:!1,type:"bool"},time_scale:{value:1.5,params:{min:0,max:3,step:.01}},debug:{value:0,params:{min:0,max:.1,step:1e-4}},scroll_damping:{value:.05,params:{min:0,max:1,step:.01}},scroll_speed:{value:5,params:{min:0,max:10,step:.1}}},Oe.addBlade(this.config,`Global Settings - ${this.name||"Unknown"}`),this.PBRConfigs=Qd.CONFIG_0,this.initCameras(),this.initBackground(),this.initFlare()}initCameras(){this.cameraManager=new n0(this.gl,{width:this.width,height:this.height,scene:this,debug:!1}),this.camera=this.cameraManager.camera}initDummy(){let e=new Td(this,"grid",{scale:50,name:"DummyPlane"});e.mesh.rotation.x=Math.PI/2,this.meshes.push(e)}initBackground(){let e=new Nd(this,{name:"BackgroundPlane"});this.meshes.push(e)}initFlare(){let e=new jd(this,{name:"Flare"});this.meshes.push(e)}setProgress(e){this.progressTarget=e}activate(){return new Promise(e=>{this.active=!0,this.activationResolve=e,this.postFirstDraw()})}async load(){this.post=new Kd(this);let e=[];e=[...e,...this.loadTextures()],e=[...e,...this.loadModels()],Promise.all(e).then(()=>{this.onLoaded()});let n=0;for(let i=0;i<e.length;i++)e[i].then(()=>{n++;const r=Math.round(n/e.length*100);this._emitter.emit("progress",r),ei.emit("loading_progress",{progress:r})})}loadTextures(){const e=[];return(i=>{for(const r in Ni[i])if(Ni[i].hasOwnProperty(r)){const s=Ni[i][r];e.push(this.textureLoader.load(s.url,r,s.options))}})("main"),e}loadModels(){return[]}applyDefaultState(){let e=this.gl;e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA),e.enable(e.BLEND),e.enable(e.DEPTH_TEST),e.depthMask(!0)}postFirstDraw(){}onLoaded(){this.active=!0,this._emitter.emit("loaded"),ei.emit("webgl_loaded");for(let e=0;e<this.meshes.length;e++)this.meshes[e].onLoaded();this.hasBloom&&(this.bloomPass=new Zd(this,this.post)),this.post.onLoaded(),Oe.onLoaded()}resize(){this.cameraManager.resize(this.width,this.height)}preRender(){let e;e=this.progressTarget-this.progress,this.progressDelta=e,e*=this.config.scroll_damping.value,this.timescale=this.config.time_scale.value,this.progress+=e;for(let n=0;n<this.meshes.length;n++)this.meshes[n].preRender();this.cameraManager.preRender()}render(){if(!this.active)return;let e=this.gl;this.time+=at.dt/1e3,this.dt=at.dt,this.preRender(),this.meshes.length>0&&(e.viewport(0,0,this.width,this.height),this.camera.perspective({aspect:this.width/this.height}),this.renderer.setViewport(this.width,this.height),this.renderer.render({scene:this.root,camera:this.camera,clear:!0,frustumCull:!0,sort:!1,post:this.post}),this.post.render(),this.postRender())}postRender(){this.gl.viewport(0,0,this.width,this.height),this.drawcalls++,this.forceAllDraw&&this.drawcalls>40&&(this.forceAllDraw=!1,this.activationResolve())}}let Gi,Zi=0;class r0{constructor(e){Gi||(Gi=this.getSupportedFormat()),this.onMessage=this.onMessage.bind(this),this.queue=new Map,this.initWorker(e)}getSupportedFormat(){const e=document.createElement("canvas").getContext("webgl");return e.getExtension("WEBGL_compressed_texture_astc")?"astc":e.getExtension("EXT_texture_compression_bptc")?"bptc":e.getExtension("WEBGL_compressed_texture_s3tc")?"s3tc":e.getExtension("WEBGL_compressed_texture_etc1")?"etc1":e.getExtension("WEBGL_compressed_texture_pvrtc")||e.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc")?"pvrtc":"none"}initWorker(e){this.worker=new Worker(e),this.worker.onmessage=this.onMessage}onMessage({data:e}){const{id:n,error:i,image:r}=e;if(i){console.log(i,n);return}const s=this.queue.get(n);this.queue.delete(n),r.isBasis=!0,s(r)}parseTexture(e){Zi++,this.worker.postMessage({id:Zi,buffer:e,supportedFormat:Gi});let n;const i=new Promise(r=>n=r);return this.queue.set(Zi,n),i}}class s0{constructor(e){this.gl=e,this.textures={},this.currentUnit=0,this.USE_AVIF_IF_SUPPORTED=!0,this.avifPromise=null,this.isCompressedSupport=!1,this.fallbackFormatWithoutTransparency=".jpg",this.detectFallbackFormats();const n={astcSupported:!!e.renderer.getExtension("WEBGL_compressed_texture_astc"),etc1Supported:!!e.renderer.getExtension("WEBGL_compressed_texture_etc1"),etc2Supported:!!e.renderer.getExtension("WEBGL_compressed_texture_etc"),dxtSupported:!!e.renderer.getExtension("WEBGL_compressed_texture_s3tc"),bptcSupported:!!e.renderer.getExtension("EXT_texture_compression_bptc"),pvrtcSupported:!!e.renderer.getExtension("WEBGL_compressed_texture_pvrtc")||!!e.renderer.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc")};for(const[i,r]of Object.entries(n))r&&(this.isCompressedSupport=!0);this.basisManager=new r0("/vendors/basis/BasisWorker.js")}async detectFallbackFormats(){if(this.avifPromise)return this.avifPromise;if(this.supportsWebp=document.createElement("canvas").toDataURL("image/webp").indexOf("data:image/webp")==0,this.fallbackFormatWithoutTransparency=this.supportsWebp?".webp":".jpg",this.USE_AVIF_IF_SUPPORTED)this.avifPromise=new Promise(e=>{const n=new Image;n.onerror=e,n.onload=()=>{this.fallbackFormatWithoutTransparency=".avif",e()},n.src="data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A="}).catch(()=>!1);else return new Promise(e=>{e()});return this.avifPromise}load(e,n,i){const r=i.indexOf("compressed")>-1,s=i.indexOf("transparent")>-1,a=i.indexOf("jpg")>-1,o=i.indexOf("png")>-1,l=i.indexOf("webp")>-1;let h=i.filter(m=>{if(m.indexOf("lodTarget")!==-1)return!0})[0];h=h!==void 0?h.replace("lodTarget=",""):"";const c=h!=="",u=e.replace(/^.*[\\\/]/,""),f=e.replace(u,""),d=`${f}${h}/${u}`;let p=e;if(c&&(p=`${d}${this.fallbackFormatWithoutTransparency}`),r&&this.isCompressedSupport)return c?p=`${d}.ktx2`:p=`${f}${u.replace(/\.[^/.]+$/,"")}.ktx2`,this.textures[n]={options:i},new Promise(x=>{fetch(p).then(_=>{_.arrayBuffer().then(P=>{this.basisManager.parseTexture(P).then(w=>{const b=this.initCompressedTexture(w,i);this.textures[n].texture=b,this.textures[n].unit=this.currentUnit,b.update(),this.currentUnit++,x(b)})})})});{(o||s)&&(p=`${d}.png`),a&&(p=`${d}.jpg`),l&&this.supportsWebp&&(p=`${d}.webp`),!this.supportsWebp&&p.includes(".webp")&&(p=p.replace(".webp",".jpg"));let m=new Image;m.crossOrigin="anonymous";const x=new Promise(_=>{m.onload=()=>{let P=this.initTexture(m,i);this.textures[n].texture=P,this.textures[n].unit=this.currentUnit,this.currentUnit++,_(P)}});return m.src=p,this.textures[n]={img:m,options:i},x}}initCompressedTexture(e,n){const i=this.gl,r=new it(i,{generateMipmaps:n.indexOf("mipmap")>-1,internalFormat:e.internalFormat});return r.image=e,r.flipY=n.indexOf("flipY")>-1,r.wrapS=n.indexOf("mirror")>-1?i.MIRRORED_REPEAT:i.CLAMP_TO_EDGE,r.wrapT=n.indexOf("mirror")>-1?i.MIRRORED_REPEAT:i.CLAMP_TO_EDGE,r.wrapS=n.indexOf("repeat")>-1?i.REPEAT:r.wrapS,r.wrapT=n.indexOf("repeat")>-1?i.REPEAT:r.wrapT,r.wrapS=n.indexOf("clamp")>-1?i.CLAMP_TO_EDGE:r.wrapS,r.wrapT=n.indexOf("clamp")>-1?i.CLAMP_TO_EDGE:r.wrapT,r.minFilter=n.indexOf("nearest")>-1?i.NEAREST:r.minFilter,r.magFilter=n.indexOf("nearest")>-1?i.NEAREST:r.magFilter,r.needsUpdate=!0,r}initTexture(e,n){const i=this.gl,r=new it(i,{generateMipmaps:n.indexOf("mipmap")>-1,flipY:n.indexOf("flipY")>-1});return r.image=e,r.flipY=n.indexOf("flipY")>-1,r.wrapS=n.indexOf("mirror")>-1?i.MIRRORED_REPEAT:i.CLAMP_TO_EDGE,r.wrapT=n.indexOf("mirror")>-1?i.MIRRORED_REPEAT:i.CLAMP_TO_EDGE,r.wrapS=n.indexOf("repeat")>-1?i.REPEAT:r.wrapS,r.wrapT=n.indexOf("repeat")>-1?i.REPEAT:r.wrapT,r.wrapS=n.indexOf("clamp")>-1?i.CLAMP_TO_EDGE:r.wrapS,r.wrapT=n.indexOf("clamp")>-1?i.CLAMP_TO_EDGE:r.wrapT,r.minFilter=n.indexOf("nearest")>-1?i.NEAREST:r.minFilter,r.magFilter=n.indexOf("nearest")>-1?i.NEAREST:r.magFilter,r}get(e){if(this.textures[e])return this.textures[e]}getTexture(e){if(this.textures[e])return this.textures[e].texture}getImage(e){return this.textures[e]?this.textures[e].img:null}isTextureRegistered(e){return!!this.textures[e]}}const a0=(t,e)=>{let n,i=0;return(...r)=>{clearTimeout(n);const s=performance.now();s-i>e?t(...r):n=setTimeout(()=>t(...r),e),i=s}};function o0(t,e){return t[0]=e[0],t[1]=e[1],t}function l0(t,e,n){return t[0]=e,t[1]=n,t}function La(t,e,n){return t[0]=e[0]+n[0],t[1]=e[1]+n[1],t}function Ia(t,e,n){return t[0]=e[0]-n[0],t[1]=e[1]-n[1],t}function c0(t,e,n){return t[0]=e[0]*n[0],t[1]=e[1]*n[1],t}function h0(t,e,n){return t[0]=e[0]/n[0],t[1]=e[1]/n[1],t}function qi(t,e,n){return t[0]=e[0]*n,t[1]=e[1]*n,t}function u0(t,e){var n=e[0]-t[0],i=e[1]-t[1];return Math.sqrt(n*n+i*i)}function f0(t,e){var n=e[0]-t[0],i=e[1]-t[1];return n*n+i*i}function Da(t){var e=t[0],n=t[1];return Math.sqrt(e*e+n*n)}function d0(t){var e=t[0],n=t[1];return e*e+n*n}function p0(t,e){return t[0]=-e[0],t[1]=-e[1],t}function g0(t,e){return t[0]=1/e[0],t[1]=1/e[1],t}function m0(t,e){var n=e[0],i=e[1],r=n*n+i*i;return r>0&&(r=1/Math.sqrt(r)),t[0]=e[0]*r,t[1]=e[1]*r,t}function v0(t,e){return t[0]*e[0]+t[1]*e[1]}function Ua(t,e){return t[0]*e[1]-t[1]*e[0]}function b0(t,e,n,i){var r=e[0],s=e[1];return t[0]=r+i*(n[0]-r),t[1]=s+i*(n[1]-s),t}function x0(t,e,n){var i=e[0],r=e[1];return t[0]=n[0]*i+n[3]*r+n[6],t[1]=n[1]*i+n[4]*r+n[7],t}function _0(t,e,n){let i=e[0],r=e[1];return t[0]=n[0]*i+n[4]*r+n[12],t[1]=n[1]*i+n[5]*r+n[13],t}function y0(t,e){return t[0]===e[0]&&t[1]===e[1]}class Xr extends Array{constructor(e=0,n=e){return super(e,n),this}get x(){return this[0]}get y(){return this[1]}set x(e){this[0]=e}set y(e){this[1]=e}set(e,n=e){return e.length?this.copy(e):(l0(this,e,n),this)}copy(e){return o0(this,e),this}add(e,n){return n?La(this,e,n):La(this,this,e),this}sub(e,n){return n?Ia(this,e,n):Ia(this,this,e),this}multiply(e){return e.length?c0(this,this,e):qi(this,this,e),this}divide(e){return e.length?h0(this,this,e):qi(this,this,1/e),this}inverse(e=this){return g0(this,e),this}len(){return Da(this)}distance(e){return e?u0(this,e):Da(this)}squaredLen(){return this.squaredDistance()}squaredDistance(e){return e?f0(this,e):d0(this)}negate(e=this){return p0(this,e),this}cross(e,n){return n?Ua(e,n):Ua(this,e)}scale(e){return qi(this,this,e),this}normalize(){return m0(this,this),this}dot(e){return v0(this,e)}equals(e){return y0(this,e)}applyMatrix3(e){return x0(this,this,e),this}applyMatrix4(e){return _0(this,this,e),this}lerp(e,n){return b0(this,this,e,n),this}clone(){return new Xr(this[0],this[1])}fromArray(e,n=0){return this[0]=e[n],this[1]=e[n+1],this}toArray(e=[],n=0){return e[n]=this[0],e[n+1]=this[1],e}}const Xi=new ue;let w0=1;class E0{constructor({canvas:e=document.createElement("canvas"),width:n=300,height:i=150,dpr:r=1,alpha:s=!1,depth:a=!0,stencil:o=!1,antialias:l=!1,premultipliedAlpha:h=!1,preserveDrawingBuffer:c=!1,powerPreference:u="default",autoClear:f=!0,webgl:d=2}={}){const p={alpha:s,depth:a,stencil:o,antialias:l,premultipliedAlpha:h,preserveDrawingBuffer:c,powerPreference:u};this.dpr=r,this.alpha=s,this.color=!0,this.depth=a,this.stencil=o,this.premultipliedAlpha=h,this.autoClear=f,this.id=w0++,this.drawCalls=0,this.vpOffset=new Xr,this.vpOverwriteSize=null,d===2&&(this.gl=e.getContext("webgl2",p)),this.isWebgl2=!!this.gl,this.gl||(this.gl=e.getContext("webgl",p)),this.gl||console.error("unable to create webgl context"),this.gl.renderer=this,this.setSize(n,i),this.state={},this.state.blendFunc={src:this.gl.ONE,dst:this.gl.ZERO},this.state.blendEquation={modeRGB:this.gl.FUNC_ADD},this.state.cullFace=null,this.state.frontFace=this.gl.CCW,this.state.depthMask=!0,this.state.depthFunc=this.gl.LESS,this.state.premultiplyAlpha=!1,this.state.flipY=!1,this.state.unpackAlignment=4,this.state.framebuffer=null,this.state.viewport={width:null,height:null},this.state.textureUnits=[],this.state.activeTextureUnit=0,this.state.boundBuffer=null,this.state.uniformLocations=new Map,this.extensions={},this.isWebgl2?(this.getExtension("EXT_color_buffer_float"),this.getExtension("OES_texture_float_linear")):(this.getExtension("OES_texture_float"),this.getExtension("OES_texture_float_linear"),this.getExtension("OES_texture_half_float"),this.getExtension("OES_texture_half_float_linear"),this.getExtension("OES_element_index_uint"),this.getExtension("OES_standard_derivatives"),this.getExtension("EXT_sRGB"),this.getExtension("WEBGL_depth_texture"),this.getExtension("WEBGL_draw_buffers")),this.vertexAttribDivisor=this.getExtension("ANGLE_instanced_arrays","vertexAttribDivisor","vertexAttribDivisorANGLE"),this.drawArraysInstanced=this.getExtension("ANGLE_instanced_arrays","drawArraysInstanced","drawArraysInstancedANGLE"),this.drawElementsInstanced=this.getExtension("ANGLE_instanced_arrays","drawElementsInstanced","drawElementsInstancedANGLE"),this.createVertexArray=this.getExtension("OES_vertex_array_object","createVertexArray","createVertexArrayOES"),this.bindVertexArray=this.getExtension("OES_vertex_array_object","bindVertexArray","bindVertexArrayOES"),this.deleteVertexArray=this.getExtension("OES_vertex_array_object","deleteVertexArray","deleteVertexArrayOES"),this.drawBuffers=this.getExtension("WEBGL_draw_buffers","drawBuffers","drawBuffersWEBGL"),this.parameters={},this.parameters.maxTextureUnits=this.gl.getParameter(this.gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS),this.parameters.maxAnisotropy=this.getExtension("EXT_texture_filter_anisotropic")?this.gl.getParameter(this.getExtension("EXT_texture_filter_anisotropic").MAX_TEXTURE_MAX_ANISOTROPY_EXT):0}setSize(e,n){this.width=e,this.height=n,this.gl.canvas.width=e*this.dpr,this.gl.canvas.height=n*this.dpr,Object.assign(this.gl.canvas.style,{width:e+"px",height:n+"px"})}setViewport(e,n){this.state.viewport.width===e&&this.state.viewport.height===n||(this.state.viewport.width=e,this.state.viewport.height=n,this.gl.viewport(this.vpOffset.x,this.vpOffset.y,e,n))}enable(e){this.state[e]!==!0&&(this.gl.enable(e),this.state[e]=!0)}disable(e){this.state[e]!==!1&&(this.gl.disable(e),this.state[e]=!1)}setBlendFunc(e,n,i,r){this.state.blendFunc.src===e&&this.state.blendFunc.dst===n&&this.state.blendFunc.srcAlpha===i&&this.state.blendFunc.dstAlpha===r||(this.state.blendFunc.src=e,this.state.blendFunc.dst=n,this.state.blendFunc.srcAlpha=i,this.state.blendFunc.dstAlpha=r,i!==void 0?this.gl.blendFuncSeparate(e,n,i,r):this.gl.blendFunc(e,n))}setBlendEquation(e,n){e=e||this.gl.FUNC_ADD,!(this.state.blendEquation.modeRGB===e&&this.state.blendEquation.modeAlpha===n)&&(this.state.blendEquation.modeRGB=e,this.state.blendEquation.modeAlpha=n,n!==void 0?this.gl.blendEquationSeparate(e,n):this.gl.blendEquation(e))}setCullFace(e){this.state.cullFace!==e&&(this.state.cullFace=e,this.gl.cullFace(e))}setFrontFace(e){this.state.frontFace!==e&&(this.state.frontFace=e,this.gl.frontFace(e))}setDepthMask(e){this.state.depthMask!==e&&(this.state.depthMask=e,this.gl.depthMask(e))}setDepthFunc(e){this.state.depthFunc!==e&&(this.state.depthFunc=e,this.gl.depthFunc(e))}activeTexture(e){this.state.activeTextureUnit!==e&&(this.state.activeTextureUnit=e,this.gl.activeTexture(this.gl.TEXTURE0+e))}bindFramebuffer({target:e=this.gl.FRAMEBUFFER,buffer:n=null}={}){this.state.framebuffer!==n&&(this.state.framebuffer=n,this.gl.bindFramebuffer(e,n))}getExtension(e,n,i){return n&&this.gl[n]?this.gl[n].bind(this.gl):(this.extensions[e]||(this.extensions[e]=this.gl.getExtension(e)),n?this.extensions[e]?this.extensions[e][i].bind(this.extensions[e]):null:this.extensions[e])}sortOpaque(e,n){return e.renderOrder!==n.renderOrder?e.renderOrder-n.renderOrder:e.program.id!==n.program.id?e.program.id-n.program.id:e.zDepth!==n.zDepth?e.zDepth-n.zDepth:n.id-e.id}sortTransparent(e,n){return e.renderOrder!==n.renderOrder?e.renderOrder-n.renderOrder:e.zDepth!==n.zDepth?n.zDepth-e.zDepth:n.id-e.id}sortManual(e,n){return e.renderOrder!==n.renderOrder?e.renderOrder-n.renderOrder:e.zDepth!==n.zDepth?n.zDepth-e.zDepth:n.id-e.id}sortUI(e,n){return e.renderOrder!==n.renderOrder?e.renderOrder-n.renderOrder:e.program.id!==n.program.id?e.program.id-n.program.id:n.id-e.id}getRenderList({scene:e,camera:n,frustumCull:i,sort:r}){let s=[];if(n&&i&&n.updateFrustum(),e.traverse(a=>{if(!a.visible)return!0;a.draw&&(!a.forceRenderOrder&&i&&a.frustumCulled&&n&&!n.frustumIntersectsMesh(a)||s.push(a))}),r){const a=[],o=[],l=[],h=[],c=[];s.forEach(u=>{u.program.transparent?u.forceRenderOrder?u.renderOrder<0?h.push(u):c.push(u):u.program.depthTest?o.push(u):l.push(u):a.push(u),u.zDepth=0,!(u.renderOrder!==0||!u.program.depthTest||!n)&&(u.worldMatrix.getTranslation(Xi),Xi.applyMatrix4(n.projectionViewMatrix),u.zDepth=Xi.z)}),a.sort(this.sortOpaque),o.sort(this.sortTransparent),h.sort(this.sortManual),c.sort(this.sortManual),l.sort(this.sortUI),s=h.concat(a,o,l,c)}return s}render({scene:e,camera:n,target:i=null,flip:r=!1,post:s=null,update:a=!0,sort:o=!0,frustumCull:l=!0,clear:h}){i===null&&s===null&&this.vpOverwriteSize===null?(this.bindFramebuffer(),this.setViewport(this.width*this.dpr,this.height*this.dpr)):s!==null?(this.setViewport(s.rt.width,s.rt.height),this.bindFramebuffer({target:this.gl.FRAMEBUFFER,buffer:s.rt.fb})):this.vpOverwriteSize!==null?(this.bindFramebuffer(),this.setViewport(this.vpOverwriteSize[0],this.vpOverwriteSize[1])):(this.bindFramebuffer(i),this.setViewport(i.width,i.height)),(h||this.autoClear&&h!==!1)&&(this.depth&&(!i||i.depth)&&(this.enable(this.gl.DEPTH_TEST),this.setDepthMask(!0)),this.gl.clear((this.color?this.gl.COLOR_BUFFER_BIT:0)|(this.depth?this.gl.DEPTH_BUFFER_BIT:0)|(this.stencil?this.gl.STENCIL_BUFFER_BIT:0))),a&&e.updateMatrixWorld(),n&&n.updateMatrixWorld(r),this.getRenderList({scene:e,camera:n,frustumCull:l,sort:o}).forEach(u=>{u.draw({camera:n}),this.drawCalls++}),r&&(n.isFliped=!1),s!==null&&this.bindFramebuffer({target:this.gl.FRAMEBUFFER,buffer:i})}}function A0(t){const e=new Map,n={set(r,s,a){const o=r[s];r[s]=a;for(const l of e.get(s)||[])l(a,o);return!0}},i={onChange:(r,s)=>(e.has(r)||e.set(r,[]),e.get(r).push(s),()=>{const a=e.get(r),o=a.indexOf(s);a.splice(o,1),a.length===0&&e.delete(r)}),...t};return new Proxy(i,n)}const Le={NORMAL:0,LOW:1,POTATO:2};class M0{constructor(e,{thresholds:n}){oe(this,"webglManager");oe(this,"active",!0);oe(this,"thresholds",{potato:0,low:0,normal:0});oe(this,"state",A0({mode:"static",renderQuality:Le.NORMAL}));oe(this,"windowIsBlurred",!1);oe(this,"perfCheckHistory",[]);oe(this,"onAverageCallback",null);oe(this,"averageFPS",60);oe(this,"fps",60);oe(this,"arrayFPS",[]);oe(this,"averageCount",60);oe(this,"enableLogs",!1);oe(this,"setEvents",()=>{window.addEventListener("blur",()=>{this.windowIsBlurred=!0}),window.addEventListener("visibilitychange",e=>{document.visibilityState==="visible"?this.windowIsBlurred=!1:this.windowIsBlurred=!0}),window.addEventListener("focus",()=>{this.windowIsBlurred=!1}),this.state.onChange("renderQuality",this.onRenderQualityChange)});oe(this,"onRenderQualityChange",e=>{switch(this.enableLogs&&console.warn(`Set WebGL to ${e} quality`),e){case Le.NORMAL:this.webglManager.dpr=Math.min(window.devicePixelRatio,2);break;case Le.LOW:this.webglManager.dpr=1;break;case Le.POTATO:this.webglManager.dpr=1,this.setActive(!1);break}this.webglManager.resize()});oe(this,"setOnAverageCallback",e=>{this.onAverageCallback=e});oe(this,"setDebugEvents",()=>{this.enableLogs&&console.log("set debug events"),window.addEventListener("keydown",e=>{e.code==="Space"&&(this.active=!this.active);const n=e.code==="ArrowDown",i=e.code==="ArrowUp";n?this.downgradeQuality():i&&this.upgradeQuality()})});oe(this,"onPerfCheck",e=>{if(this.enableLogs&&console.log("perf-check",e),!(!this.active||document.hidden||this.windowIsBlurred))switch(this.state.mode){case"static":e.fps>this.thresholds.potato&&e.fps<=this.thresholds.low?this.state.renderQuality="low":e.fps<=this.thresholds.potato&&(this.state.renderQuality="potato");break;case"dynamic":{const n=Vt?.5:.3,i=e.delta>e.cappedFPS*n,r=e.delta<=-11;i?this.downgradeQuality():r&&this.upgradeQuality(),this.enableLogs&&(console.log("should downgrade: ",i),console.log("should upgrade: ",r)),(i||r)&&(this.webglManager.resize(),this.webglManager._emitter.emit("resize"))}break}});oe(this,"upgradeQuality",()=>{this.state.renderQuality==Le.LOW?this.state.renderQuality=Le.NORMAL:this.state.renderQuality==Le.POTATO&&(this.state.renderQuality=Le.LOW)});oe(this,"downgradeQuality",()=>{this.state.renderQuality==Le.NORMAL?this.state.renderQuality=Le.LOW:this.state.renderQuality==Le.LOW&&(this.state.renderQuality=Le.POTATO)});oe(this,"setActive",e=>{this.active=e});oe(this,"update",()=>{!this.active||this.windowIsBlurred||(this.arrayFPS.length<this.averageCount?(this.fps=Math.round(1/(Math.max(at.dt,1)/1e3)),this.arrayFPS.push(this.fps)):(this.averageFPS=Sd(this.arrayFPS),this.arrayFPS=[],this.onAverageCallback&&this.onAverageCallback(this.averageFPS)))});this.webglManager=e,this.thresholds=n,this.setEvents()}activate(){this.enableLogs&&console.log("call activate perf check");for(const e of Object.values(this.webglManager.scenes))e.scene?(this.webglManager.forceAllDraw||this.webglManager.drawcalls<40)&&console.error("attempted to launch PerformanceManager on first frames"):console.error("attempted to launch PerformanceManager when scenes weren't constructed yet");this.enableLogs&&console.log("activate perf check"),this.active=!0}}class P0{constructor(){this.scenes={},this.initialized=!1,this.clearColor=[0,0,0,1],this._emitter={},Tn(this._emitter),this.on=this._emitter.on.bind(this._emitter),this.performanceManager=new M0(this,{thresholds:{potato:53,low:57}}),window.GLXP=this,this.maxDpr=2}init(e){return this.dpr=Math.max(Math.min(window.devicePixelRatio,this.maxDpr),1),this.width=e.offsetWidth*this.dpr,this.height=e.offsetHeight*this.dpr,this.container=e,this.catchContext(),this.textureLoader=new s0(this.gl),this.initialized=!0,Oe.setManager(this),this.initScenes(),this.debouncedResize=a0(this.resize.bind(this),30),window.addEventListener("resize",this.debouncedResize),this}initScenes(){this.addScene("main",i0)}addScene(e,n){this.scenes[e]={scene:new n(this.container,this),active:!1,callbackCanvas:null}}registerCallbackCanvas(e,n){this.scenes[e].callbackCanvas=n}getScene(e){return this.scenes[e].scene}loadScene(e){if(this.scenes[e].scene.loaded===!1)return new Promise((i,r)=>{this.scenes[e].scene.load(),this.scenes[e].scene.on("loaded",()=>{this.resize(),this.scenes[e].scene.onResize(),i()})})}activate(e){this.scenes[e].active=!0;const n=this.scenes[e].scene.activate();return n.then(()=>{this.performanceManager.setOnAverageCallback(i=>{const r=Math.min(Math.round(i),60);this.performanceManager.onPerfCheck({fps:r})}),Oe.active&&this.performanceManager.setDebugEvents()}),n}resize(){this._emitter.emit("resize"),this.width=this.container.offsetWidth*this.dpr,this.height=this.container.offsetHeight*this.dpr,this.renderer.setSize(this.width,this.height),this.canvas.style.minWidth=`${this.container.offsetWidth}px`,this.canvas.style.minHeight=`${this.container.offsetHeight}px`;for(const e in this.scenes)if(this.scenes.hasOwnProperty(e)){const n=this.scenes[e].scene;n.onResize(),n.subscenes&&n.subscenes.forEach(i=>{i.onResize()})}}desactivate(e){this.scenes[e].active=!1,this.gl.clearColor(0,0,0,0),this.gl.clear(this.gl.COLOR_BUFFER_BIT|this.gl.DEPTH_BUFFER_BIT),this.gl.colorMask(!0,!0,!0,!0)}catchContext(){if(this.renderer=new E0({antialias:!1,powerPreference:"high-performance",stencil:!1}),this.gl=this.renderer.gl,!this.renderer.isWebgl2){let e=this.gl.getExtension("OES_vertex_array_object");e&&(this.gl.createVertexArray=function(){return e.createVertexArrayOES()},this.gl.deleteVertexArray=function(n){e.deleteVertexArrayOES(n)},this.gl.bindVertexArray=function(n){e.bindVertexArrayOES(n)},this.gl.isVertexArray=function(n){return e.isVertexArrayOES(n)}),this.gl.getExtension("OES_standard_derivatives"),this.gl.getExtension("EXT_shader_texture_lod"),this.gl.getExtension("OES_texture_float"),this.gl.getExtension("OES_texture_float_linear"),this.gl.getExtension("OES_texture_half_float"),this.gl.getExtension("OES_texture_half_float_linear"),this.gl.getExtension("EXT_color_buffer_half_float")}this.canvas=this.gl.canvas,this.container.appendChild(this.gl.canvas),this.resize(),setTimeout(()=>{this.resize()},1e3)}render(){let e=this.gl;e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),e.colorMask(!0,!0,!0,!0),this.renderer.drawCalls=0,this.performanceManager.update();for(const n in this.scenes)if(this.scenes.hasOwnProperty(n)){const i=this.scenes[n];i.active===!0&&(i.scene.render(),e.clearColor(i.scene.clearColor[0],i.scene.clearColor[1],i.scene.clearColor[2],i.scene.clearColor[3]))}}}const T0=new P0,Et=T0;const Yt=(t,e)=>{const n=t.__vccOpts||t;for(const[i,r]of e)n[i]=r;return n},Yr={name:"WebGL",props:{height:{type:String,default:"88vh"},mobileHeight:{type:String,default:"80vh"}},setup(){const t=an(null),e=F1();return L1(),Dr(async()=>{await e.isReady();const n=Et.init(t.value);at.subscribe("canvas",n.render.bind(n));const i="main";Et.getScene(i).setProgress(0),Et.textureLoader.detectFallbackFormats().then(()=>{Et.loadScene(i).then(()=>{Et.activate(i).then(()=>{})})})}),{canvas:t}}},Ba=()=>{Ah(t=>({"644529b8":t.height,"8be0978c":t.mobileHeight}))},za=Yr.setup;Yr.setup=za?(t,e)=>(Ba(),za(t,e)):Ba;const S0={ref:"canvas",class:"demo"};function C0(t,e,n,i,r,s){return qt(),Pn("div",S0,null,512)}const Kr=Yt(Yr,[["render",C0]]);const R0={name:"CustomLoader",setup(){const t=an(0),e=an(!0),n=an(!1);return{progress:t,isVisible:e,off:n}},mounted(){ei.on("loading_progress",this.handleLoadingProgress),ei.on("webgl_loaded",this.handleLoaded)},methods:{handleLoadingProgress(t){this.progress=Math.round(t.progress)},handleLoaded(){this.isVisible=!1,setTimeout(()=>{this.off=!0},1e3)}}};function O0(t,e,n,i,r,s){return qt(),Pn("div",{class:si(["loader",{"is-hidden":!i.isVisible,off:i.off}])},null,2)}const Qr=Yt(R0,[["render",O0]]);const F0={name:"Home",components:{WebGL:Kr,Loader:Qr},computed:{mode:function(){return{}.VUE_APP_MODE||"app"}},watch:{},mounted(){setTimeout(()=>{this.$refs.header.classList.remove("hidden"),this.$refs.contentContainer.classList.remove("hidden")},500),window.addEventListener("scroll",()=>{window.pageYOffset/window.innerHeight>.5?this.$refs.navDesktop.classList.remove("hidden"):this.$refs.navDesktop.classList.add("hidden")});const t={root:null,rootMargin:"0px",threshold:.1},e=new IntersectionObserver(i=>{i.forEach(r=>{if(r.isIntersecting){const s=r.target.children;Array.from(s).forEach((a,o)=>{setTimeout(()=>{a.classList.add("content-section__child--visible")},o*50)})}})},t);document.querySelectorAll(".content-section__inner").forEach(i=>{e.observe(i)})},methods:{}},L0={style:{height:"100vh","overflow-y":"hidden"},ref:"main",class:"site-wrapper"},I0={ref:"navDesktop",class:"nav-desktop hidden"},D0=St('<a class="logo" href="https://integrity.ai"><svg fill="#000000" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 238.02 65.34"><path d="M39.6,34.57v-5.08c0-4.11-1.73-6.17-5.25-6.17s-5.74,2.82-5.74,2.82v-2.86l-3.6.76c.22.28.38.62.48,1.02.1.4.17,1.01.2,1.85.03.84.05,2.22.05,4.16v3.5c0,1.85-.04,3.08-.12,3.7-.08.61-.25,1.11-.51,1.48h4.19c-.24-.37-.4-.87-.48-1.5-.08-.63-.12-1.85-.12-3.68h.02s0-6.86,0-6.86c.51-.51,1.17-.92,1.98-1.24.82-.32,1.65-.48,2.51-.48,1.17,0,2.03.34,2.59,1.02.56.68.84,1.75.84,3.2v4.36c0,1.85-.04,3.08-.12,3.7-.08.61-.25,1.11-.51,1.48h4.19c-.24-.37-.4-.87-.48-1.5s-.12-1.85-.12-3.68Z"></path><path d="M95.95,23.32c-3.29,0-4.69,2.82-4.69,2.82l-.03-2.86-3.56.73c.24.31.41.66.51,1.07.1.41.16,1.04.18,1.9.02.85.03,2.37.03,4.55v3.04c0,1.85-.04,3.08-.12,3.7-.08.61-.25,1.11-.51,1.48h4.19c-.24-.37-.4-.87-.48-1.5-.08-.63-.12-1.85-.12-3.68h.01v-6.86c1.12-.99,2.43-1.32,3.93-1.32.66,0,1.29.1,1.88.3l-.36-3.27c-.33-.07-.62-.1-.86-.1Z"></path><path d="M167.02,23.32c-3.29,0-4.69,2.82-4.69,2.82l-.03-2.86-3.56.73c.24.31.41.66.51,1.07.1.41.16,1.04.18,1.9.02.85.03,2.37.03,4.55v3.04c0,1.85-.04,3.08-.12,3.7-.08.61-.25,1.11-.51,1.48h4.19c-.24-.37-.4-.87-.48-1.5-.08-.63-.12-1.85-.12-3.68h.01v-6.86c1.12-.99,2.43-1.32,3.93-1.32.66,0,1.29.1,1.88.3l-.36-3.27c-.33-.07-.62-.1-.86-.1Z"></path><path d="M129.24,23.46c.09.75-.07,1.81-.49,3.17,0,0-3.08,8.66-3.71,10.27-.54-1.72-3.45-10.17-3.45-10.17-.37-1.19-.56-2.1-.56-2.74,0-.24,0-.42.03-.53h-4.09c.25.44.49.96.73,1.55.24.6.54,1.39.89,2.38,0,0,4.57,12.67,4.83,13.57-.42,1.43-1.06,3.09-1.65,3.83-.59.74-1.33,1.11-2.21,1.11-.99,0-1.92-.28-3.09-.83l.4,3.11c1.3.49,3.56.87,5.66-.35.76-.45,1.39-1.27,1.96-2.31s1.67-3.65,2.22-5.41c.57-1.76,4.89-12.63,4.89-12.63.18-.44.29-.71.33-.82.48-1.36.92-2.43,1.32-3.2h-4.01Z"></path><path d="M177.5,23.31c-6.09,0-8.56,4.37-8.56,8.25h0c0,3.9,2.48,8.52,8.56,8.52s8.31-4.64,8.31-8.53-2.22-8.24-8.31-8.24ZM177.49,37.85c-4.19,0-5.23-3.79-5.23-6.29s.91-5.99,5.23-5.99,4.99,3.48,4.99,5.99-.8,6.29-4.99,6.29Z"></path><path d="M220.34,26.79c-.54-1.15-1.26-2.01-2.15-2.57s-1.87-.84-2.95-.84c-3.63,0-5.58,2.82-5.58,2.82v-2.86l-3.56.76c.31.4.5.9.58,1.52.08.62.12,1.71.12,3.27v19.68l3.5-.76c-.22-.38-.36-.86-.43-1.44-.07-.59-.1-1.66-.1-3.22h-.01s0-3.9,0-3.9c1.32.59,2.53.89,3.63.89,1.46,0,2.76-.34,3.93-1.04,1.17-.7,2.1-1.73,2.79-3.09.69-1.36,1.04-3.01,1.04-4.95,0-1.69-.27-3.11-.81-4.27ZM217.41,34.85c-.49.96-1.12,1.65-1.88,2.08h.01c-.76.44-1.55.65-2.36.65-.68,0-1.25-.06-1.7-.18s-1.02-.35-1.7-.68v-8.98c.39-.42,1-.82,1.81-1.19s1.7-.56,2.67-.56c1.2,0,2.16.45,2.85,1.34.69.89,1.04,2.17,1.04,3.84,0,1.5-.24,2.72-.74,3.68Z"></path><polygon points="51.9 37.19 51.9 37.19 51.9 37.19 51.9 37.19"></polygon><path d="M52.48,26.34l-.17-2.9c-1.06.13-2.6.2-4.62.2v-3.53h-.03l-5.18,6.14v.1c.64-.13,1.39-.2,2.24-.2v8.42c0,1.98.39,3.39,1.17,4.24.78.85,1.91,1.27,3.38,1.27.81,0,1.61-.11,2.42-.31l.21-2.58c-.09.04-.19.09-.28.11-.55.18-1.12.26-1.72.26-.84,0-1.41-.24-1.73-.73-.32-.49-.48-1.36-.48-2.64v-8.05c2.4,0,3.99.07,4.79.2Z"></path><path d="M115.78,26.34l-.17-2.9c-1.06.13-2.6.2-4.62.2v-3.53h-.03l-5.18,6.14v.1c.64-.13,1.39-.2,2.24-.2v8.42c0,1.98.39,3.39,1.17,4.24.78.85,1.91,1.27,3.38,1.27.81,0,1.61-.11,2.42-.31l.21-2.58h0c-.09.04-.19.09-.28.11-.55.18-1.12.26-1.72.26-.84,0-1.41-.24-1.73-.73-.32-.49-.48-1.36-.48-2.64v-8.05c2.4,0,3.99.07,4.79.2Z"></path><path d="M62.5,23.3c-2.72-.17-4.53.64-5.9,1.91-1.82,1.69-2.53,4.08-2.5,6.81.04,3.21,1.43,5.41,3.44,6.86s5.86,1.61,9.04.27l.4-3.07h-.01c-3.58,2.51-7.74,1.88-9.38-1.53-.29-.59-.52-1.64-.54-2.82l2.6.9s2.43-.88,4.35-1.6c1.58-.59,3.47-1.35,3.47-1.35.38-.39.19-1.5.12-1.88-.35-1.99-1.84-4.3-5.09-4.5ZM63.18,29.3l-6.13,2.41c-.02-2.06.64-4.5,2.93-5.55,3.13-1.44,4.68.39,4.86,2.02.05.44-.55.64-1.66,1.12Z"></path><path d="M202.69,36.12c-.03-.84-.05-2.22-.05-4.16v-8.61l-3.56.78c.24.37.4.87.48,1.5.08.63.12,1,.12,2.83h-.02v7.26c-.51.51-1.17.92-1.98,1.24-.82.32-1.65.48-2.51.48-1.17,0-2.03-.34-2.59-1.02s-.84-1.75-.84-3.2v-9.87l-3.56.78c.24.37.4.87.48,1.5s.12,1,.12,2.83v5.48c0,4.11,1.73,6.17,5.25,6.17s5.74-2.82,5.74-2.82v2.46l3.6-.76c-.22-.28-.38-.62-.48-1.02-.1-.4-.17-1.01-.2-1.85Z"></path><path d="M20.46,34.57h.01v-11.22c-1.35.84-3.5.76-3.5.76.22.38.36.86.43,1.44.07.58.1,1.64.1,3.18v5.84c0,1.85-.04,3.08-.12,3.7-.08.61-.25,1.11-.51,1.48h4.19c-.24-.37-.4-.87-.48-1.5-.08-.63-.12-1.85-.12-3.68Z"></path><path d="M20.58,19.21c.18-.32.08-1.06-.27-1.54-.32-.46-.77-.77-1.44-.87-.62-.09-1.13.04-1.56.4-.43.36-.68.81-.76,1.35-.09.6.06,1.21.44,1.61.42.45,2.84.33,3.59-.95Z"></path><path d="M102.92,34.57h0v-11.22c-1.35.84-3.5.76-3.5.76.22.38.36.86.43,1.44.07.58.1,1.64.1,3.18v5.84c0,1.85-.04,3.08-.12,3.7-.08.61-.25,1.11-.51,1.48h4.19c-.24-.37-.4-.87-.48-1.5-.08-.63-.12-1.85-.12-3.68Z"></path><path d="M103.04,19.21c.18-.32.08-1.06-.27-1.54-.32-.46-.77-.77-1.44-.87-.62-.09-1.13.04-1.56.4-.43.36-.68.81-.76,1.35-.09.6.06,1.21.44,1.61.42.45,2.84.33,3.59-.95Z"></path><path d="M80.43,39.19h.02c-1.43-.17-6.8-.07-6.8-1.13,0-.5,1.49-.84,3.52-1.39.77-.21,1.61-.51,2.54-.88-.03,0-.07.01-.11.02,2.95-.81,4.88-3.11,4.88-6.14,0-2.36-1.27-4.28-3.2-5.39.28.02.64.03,1.1.03.75,0,1.55-.07,2.41-.2l-.73-2.61c-.73.46-1.78.86-3.15,1.2-1.36.34-2.55.51-3.58.51h-.17c-4.01,0-7.31,2.66-7.31,6.46s2.92,6.35,7.08,6.45c-.11.01-.19.02-.19.02-4.51.79-5.71,1.61-5.71,3.14s2.45,1.95,4.7,2.14c3.78.33,6.57.89,6.57,2.72,0,1.68-4.56,2.18-6.42,1.97-5.03-.55-4.09-2.84-1.65-3.51l-1.01-.17c-2.27.63-3.44,1.45-3.44,2.93,0,2.13,3.08,3.26,6.66,3.26,3.11,0,8.97-1.11,8.97-4.92,0-2.45-1.78-4.1-4.98-4.51ZM72.9,29.66c0-2.1,1.41-4.02,4.28-4.02s4.28,1.92,4.28,4.02-1.43,4.02-4.28,4.02c-2.7,0-4.28-1.92-4.28-4.02Z"></path><path d="M151.48,39.19h.02c-1.43-.17-6.8-.07-6.8-1.13,0-.5,1.49-.84,3.52-1.39.77-.21,1.61-.51,2.54-.88-.03,0-.07.01-.11.02,2.95-.81,4.88-3.11,4.88-6.14,0-2.36-1.27-4.28-3.2-5.39.28.02.64.03,1.1.03.75,0,1.55-.07,2.41-.2l-.73-2.61c-.73.46-1.78.86-3.15,1.2-1.36.34-2.55.51-3.58.51h-.17c-4.01,0-7.31,2.66-7.31,6.46s2.92,6.35,7.08,6.45c-.11.01-.19.02-.19.02-4.51.79-5.71,1.61-5.71,3.14s2.45,1.95,4.7,2.14c3.78.33,6.57.89,6.57,2.72,0,1.68-4.56,2.18-6.42,1.97-5.03-.55-4.09-2.84-1.65-3.51l-1.01-.17c-2.27.63-3.44,1.45-3.44,2.93,0,2.13,3.08,3.26,6.66,3.26,3.11,0,8.97-1.11,8.97-4.92,0-2.45-1.78-4.1-4.98-4.51ZM143.95,29.66c0-2.1,1.41-4.02,4.28-4.02s4.28,1.92,4.28,4.02-1.43,4.02-4.28,4.02c-2.7,0-4.28-1.92-4.28-4.02Z"></path></svg></a><ul><li><a class="external" href="https://integrityhealth.ai/">Health</a></li><li><a class="external" href="https://integrity.org/">Foundation</a></li></ul>',2),U0=[D0],B0={ref:"header",class:"header-section hidden"},z0=St('<div class="header-content"><svg class="header-logo" fill="#ffffff" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 238.02 65.34"><path d="M39.6,34.57v-5.08c0-4.11-1.73-6.17-5.25-6.17s-5.74,2.82-5.74,2.82v-2.86l-3.6.76c.22.28.38.62.48,1.02.1.4.17,1.01.2,1.85.03.84.05,2.22.05,4.16v3.5c0,1.85-.04,3.08-.12,3.7-.08.61-.25,1.11-.51,1.48h4.19c-.24-.37-.4-.87-.48-1.5-.08-.63-.12-1.85-.12-3.68h.02s0-6.86,0-6.86c.51-.51,1.17-.92,1.98-1.24.82-.32,1.65-.48,2.51-.48,1.17,0,2.03.34,2.59,1.02.56.68.84,1.75.84,3.2v4.36c0,1.85-.04,3.08-.12,3.7-.08.61-.25,1.11-.51,1.48h4.19c-.24-.37-.4-.87-.48-1.5s-.12-1.85-.12-3.68Z"></path><path d="M95.95,23.32c-3.29,0-4.69,2.82-4.69,2.82l-.03-2.86-3.56.73c.24.31.41.66.51,1.07.1.41.16,1.04.18,1.9.02.85.03,2.37.03,4.55v3.04c0,1.85-.04,3.08-.12,3.7-.08.61-.25,1.11-.51,1.48h4.19c-.24-.37-.4-.87-.48-1.5-.08-.63-.12-1.85-.12-3.68h.01v-6.86c1.12-.99,2.43-1.32,3.93-1.32.66,0,1.29.1,1.88.3l-.36-3.27c-.33-.07-.62-.1-.86-.1Z"></path><path d="M167.02,23.32c-3.29,0-4.69,2.82-4.69,2.82l-.03-2.86-3.56.73c.24.31.41.66.51,1.07.1.41.16,1.04.18,1.9.02.85.03,2.37.03,4.55v3.04c0,1.85-.04,3.08-.12,3.7-.08.61-.25,1.11-.51,1.48h4.19c-.24-.37-.4-.87-.48-1.5-.08-.63-.12-1.85-.12-3.68h.01v-6.86c1.12-.99,2.43-1.32,3.93-1.32.66,0,1.29.1,1.88.3l-.36-3.27c-.33-.07-.62-.1-.86-.1Z"></path><path d="M129.24,23.46c.09.75-.07,1.81-.49,3.17,0,0-3.08,8.66-3.71,10.27-.54-1.72-3.45-10.17-3.45-10.17-.37-1.19-.56-2.1-.56-2.74,0-.24,0-.42.03-.53h-4.09c.25.44.49.96.73,1.55.24.6.54,1.39.89,2.38,0,0,4.57,12.67,4.83,13.57-.42,1.43-1.06,3.09-1.65,3.83-.59.74-1.33,1.11-2.21,1.11-.99,0-1.92-.28-3.09-.83l.4,3.11c1.3.49,3.56.87,5.66-.35.76-.45,1.39-1.27,1.96-2.31s1.67-3.65,2.22-5.41c.57-1.76,4.89-12.63,4.89-12.63.18-.44.29-.71.33-.82.48-1.36.92-2.43,1.32-3.2h-4.01Z"></path><path d="M177.5,23.31c-6.09,0-8.56,4.37-8.56,8.25h0c0,3.9,2.48,8.52,8.56,8.52s8.31-4.64,8.31-8.53-2.22-8.24-8.31-8.24ZM177.49,37.85c-4.19,0-5.23-3.79-5.23-6.29s.91-5.99,5.23-5.99,4.99,3.48,4.99,5.99-.8,6.29-4.99,6.29Z"></path><path d="M220.34,26.79c-.54-1.15-1.26-2.01-2.15-2.57s-1.87-.84-2.95-.84c-3.63,0-5.58,2.82-5.58,2.82v-2.86l-3.56.76c.31.4.5.9.58,1.52.08.62.12,1.71.12,3.27v19.68l3.5-.76c-.22-.38-.36-.86-.43-1.44-.07-.59-.1-1.66-.1-3.22h-.01s0-3.9,0-3.9c1.32.59,2.53.89,3.63.89,1.46,0,2.76-.34,3.93-1.04,1.17-.7,2.1-1.73,2.79-3.09.69-1.36,1.04-3.01,1.04-4.95,0-1.69-.27-3.11-.81-4.27ZM217.41,34.85c-.49.96-1.12,1.65-1.88,2.08h.01c-.76.44-1.55.65-2.36.65-.68,0-1.25-.06-1.7-.18s-1.02-.35-1.7-.68v-8.98c.39-.42,1-.82,1.81-1.19s1.7-.56,2.67-.56c1.2,0,2.16.45,2.85,1.34.69.89,1.04,2.17,1.04,3.84,0,1.5-.24,2.72-.74,3.68Z"></path><polygon points="51.9 37.19 51.9 37.19 51.9 37.19 51.9 37.19"></polygon><path d="M52.48,26.34l-.17-2.9c-1.06.13-2.6.2-4.62.2v-3.53h-.03l-5.18,6.14v.1c.64-.13,1.39-.2,2.24-.2v8.42c0,1.98.39,3.39,1.17,4.24.78.85,1.91,1.27,3.38,1.27.81,0,1.61-.11,2.42-.31l.21-2.58c-.09.04-.19.09-.28.11-.55.18-1.12.26-1.72.26-.84,0-1.41-.24-1.73-.73-.32-.49-.48-1.36-.48-2.64v-8.05c2.4,0,3.99.07,4.79.2Z"></path><path d="M115.78,26.34l-.17-2.9c-1.06.13-2.6.2-4.62.2v-3.53h-.03l-5.18,6.14v.1c.64-.13,1.39-.2,2.24-.2v8.42c0,1.98.39,3.39,1.17,4.24.78.85,1.91,1.27,3.38,1.27.81,0,1.61-.11,2.42-.31l.21-2.58h0c-.09.04-.19.09-.28.11-.55.18-1.12.26-1.72.26-.84,0-1.41-.24-1.73-.73-.32-.49-.48-1.36-.48-2.64v-8.05c2.4,0,3.99.07,4.79.2Z"></path><path d="M62.5,23.3c-2.72-.17-4.53.64-5.9,1.91-1.82,1.69-2.53,4.08-2.5,6.81.04,3.21,1.43,5.41,3.44,6.86s5.86,1.61,9.04.27l.4-3.07h-.01c-3.58,2.51-7.74,1.88-9.38-1.53-.29-.59-.52-1.64-.54-2.82l2.6.9s2.43-.88,4.35-1.6c1.58-.59,3.47-1.35,3.47-1.35.38-.39.19-1.5.12-1.88-.35-1.99-1.84-4.3-5.09-4.5ZM63.18,29.3l-6.13,2.41c-.02-2.06.64-4.5,2.93-5.55,3.13-1.44,4.68.39,4.86,2.02.05.44-.55.64-1.66,1.12Z"></path><path d="M202.69,36.12c-.03-.84-.05-2.22-.05-4.16v-8.61l-3.56.78c.24.37.4.87.48,1.5.08.63.12,1,.12,2.83h-.02v7.26c-.51.51-1.17.92-1.98,1.24-.82.32-1.65.48-2.51.48-1.17,0-2.03-.34-2.59-1.02s-.84-1.75-.84-3.2v-9.87l-3.56.78c.24.37.4.87.48,1.5s.12,1,.12,2.83v5.48c0,4.11,1.73,6.17,5.25,6.17s5.74-2.82,5.74-2.82v2.46l3.6-.76c-.22-.28-.38-.62-.48-1.02-.1-.4-.17-1.01-.2-1.85Z"></path><path d="M20.46,34.57h.01v-11.22c-1.35.84-3.5.76-3.5.76.22.38.36.86.43,1.44.07.58.1,1.64.1,3.18v5.84c0,1.85-.04,3.08-.12,3.7-.08.61-.25,1.11-.51,1.48h4.19c-.24-.37-.4-.87-.48-1.5-.08-.63-.12-1.85-.12-3.68Z"></path><path d="M20.58,19.21c.18-.32.08-1.06-.27-1.54-.32-.46-.77-.77-1.44-.87-.62-.09-1.13.04-1.56.4-.43.36-.68.81-.76,1.35-.09.6.06,1.21.44,1.61.42.45,2.84.33,3.59-.95Z"></path><path d="M102.92,34.57h0v-11.22c-1.35.84-3.5.76-3.5.76.22.38.36.86.43,1.44.07.58.1,1.64.1,3.18v5.84c0,1.85-.04,3.08-.12,3.7-.08.61-.25,1.11-.51,1.48h4.19c-.24-.37-.4-.87-.48-1.5-.08-.63-.12-1.85-.12-3.68Z"></path><path d="M103.04,19.21c.18-.32.08-1.06-.27-1.54-.32-.46-.77-.77-1.44-.87-.62-.09-1.13.04-1.56.4-.43.36-.68.81-.76,1.35-.09.6.06,1.21.44,1.61.42.45,2.84.33,3.59-.95Z"></path><path d="M80.43,39.19h.02c-1.43-.17-6.8-.07-6.8-1.13,0-.5,1.49-.84,3.52-1.39.77-.21,1.61-.51,2.54-.88-.03,0-.07.01-.11.02,2.95-.81,4.88-3.11,4.88-6.14,0-2.36-1.27-4.28-3.2-5.39.28.02.64.03,1.1.03.75,0,1.55-.07,2.41-.2l-.73-2.61c-.73.46-1.78.86-3.15,1.2-1.36.34-2.55.51-3.58.51h-.17c-4.01,0-7.31,2.66-7.31,6.46s2.92,6.35,7.08,6.45c-.11.01-.19.02-.19.02-4.51.79-5.71,1.61-5.71,3.14s2.45,1.95,4.7,2.14c3.78.33,6.57.89,6.57,2.72,0,1.68-4.56,2.18-6.42,1.97-5.03-.55-4.09-2.84-1.65-3.51l-1.01-.17c-2.27.63-3.44,1.45-3.44,2.93,0,2.13,3.08,3.26,6.66,3.26,3.11,0,8.97-1.11,8.97-4.92,0-2.45-1.78-4.1-4.98-4.51ZM72.9,29.66c0-2.1,1.41-4.02,4.28-4.02s4.28,1.92,4.28,4.02-1.43,4.02-4.28,4.02c-2.7,0-4.28-1.92-4.28-4.02Z"></path><path d="M151.48,39.19h.02c-1.43-.17-6.8-.07-6.8-1.13,0-.5,1.49-.84,3.52-1.39.77-.21,1.61-.51,2.54-.88-.03,0-.07.01-.11.02,2.95-.81,4.88-3.11,4.88-6.14,0-2.36-1.27-4.28-3.2-5.39.28.02.64.03,1.1.03.75,0,1.55-.07,2.41-.2l-.73-2.61c-.73.46-1.78.86-3.15,1.2-1.36.34-2.55.51-3.58.51h-.17c-4.01,0-7.31,2.66-7.31,6.46s2.92,6.35,7.08,6.45c-.11.01-.19.02-.19.02-4.51.79-5.71,1.61-5.71,3.14s2.45,1.95,4.7,2.14c3.78.33,6.57.89,6.57,2.72,0,1.68-4.56,2.18-6.42,1.97-5.03-.55-4.09-2.84-1.65-3.51l-1.01-.17c-2.27.63-3.44,1.45-3.44,2.93,0,2.13,3.08,3.26,6.66,3.26,3.11,0,8.97-1.11,8.97-4.92,0-2.45-1.78-4.1-4.98-4.51ZM143.95,29.66c0-2.1,1.41-4.02,4.28-4.02s4.28,1.92,4.28,4.02-1.43,4.02-4.28,4.02c-2.7,0-4.28-1.92-4.28-4.02Z"></path></svg><h1 class="header-title">Creating technology with a conscience</h1></div>',1);function N0(t,e,n,i,r,s){const a=Tt("Loader"),o=Tt("WebGL");return qt(),Pn("main",L0,[rt("nav",I0,U0,512),ve(a),rt("header",B0,[ve(o,{height:"100vh",mobileHeight:"100vh"}),z0],512)],512)}const k0=Yt(F0,[["render",N0]]);const $0={name:"144",components:{WebGL:Kr,Loader:Qr},computed:{mode:function(){return{}.VUE_APP_MODE||"app"}},watch:{},mounted(){setTimeout(()=>{this.$refs.header.classList.remove("hidden"),this.$refs.contentContainer.classList.remove("hidden")},500),window.addEventListener("scroll",()=>{window.pageYOffset/window.innerHeight>.5?this.$refs.navDesktop.classList.remove("hidden"):this.$refs.navDesktop.classList.add("hidden")});const t={root:null,rootMargin:"0px",threshold:.1},e=new IntersectionObserver(i=>{i.forEach(r=>{if(r.isIntersecting){const s=r.target.children;Array.from(s).forEach((a,o)=>{setTimeout(()=>{a.classList.add("content-section__child--visible")},o*50)})}})},t);document.querySelectorAll(".content-section__inner").forEach(i=>{e.observe(i)})},methods:{}},W0={ref:"main",class:"site-wrapper"},j0={ref:"navDesktop",class:"nav-desktop hidden"},V0=St('<a class="logo" href="https://integrity.ai"><svg fill="#000000" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 238.02 65.34"><path d="M39.6,34.57v-5.08c0-4.11-1.73-6.17-5.25-6.17s-5.74,2.82-5.74,2.82v-2.86l-3.6.76c.22.28.38.62.48,1.02.1.4.17,1.01.2,1.85.03.84.05,2.22.05,4.16v3.5c0,1.85-.04,3.08-.12,3.7-.08.61-.25,1.11-.51,1.48h4.19c-.24-.37-.4-.87-.48-1.5-.08-.63-.12-1.85-.12-3.68h.02s0-6.86,0-6.86c.51-.51,1.17-.92,1.98-1.24.82-.32,1.65-.48,2.51-.48,1.17,0,2.03.34,2.59,1.02.56.68.84,1.75.84,3.2v4.36c0,1.85-.04,3.08-.12,3.7-.08.61-.25,1.11-.51,1.48h4.19c-.24-.37-.4-.87-.48-1.5s-.12-1.85-.12-3.68Z"></path><path d="M95.95,23.32c-3.29,0-4.69,2.82-4.69,2.82l-.03-2.86-3.56.73c.24.31.41.66.51,1.07.1.41.16,1.04.18,1.9.02.85.03,2.37.03,4.55v3.04c0,1.85-.04,3.08-.12,3.7-.08.61-.25,1.11-.51,1.48h4.19c-.24-.37-.4-.87-.48-1.5-.08-.63-.12-1.85-.12-3.68h.01v-6.86c1.12-.99,2.43-1.32,3.93-1.32.66,0,1.29.1,1.88.3l-.36-3.27c-.33-.07-.62-.1-.86-.1Z"></path><path d="M167.02,23.32c-3.29,0-4.69,2.82-4.69,2.82l-.03-2.86-3.56.73c.24.31.41.66.51,1.07.1.41.16,1.04.18,1.9.02.85.03,2.37.03,4.55v3.04c0,1.85-.04,3.08-.12,3.7-.08.61-.25,1.11-.51,1.48h4.19c-.24-.37-.4-.87-.48-1.5-.08-.63-.12-1.85-.12-3.68h.01v-6.86c1.12-.99,2.43-1.32,3.93-1.32.66,0,1.29.1,1.88.3l-.36-3.27c-.33-.07-.62-.1-.86-.1Z"></path><path d="M129.24,23.46c.09.75-.07,1.81-.49,3.17,0,0-3.08,8.66-3.71,10.27-.54-1.72-3.45-10.17-3.45-10.17-.37-1.19-.56-2.1-.56-2.74,0-.24,0-.42.03-.53h-4.09c.25.44.49.96.73,1.55.24.6.54,1.39.89,2.38,0,0,4.57,12.67,4.83,13.57-.42,1.43-1.06,3.09-1.65,3.83-.59.74-1.33,1.11-2.21,1.11-.99,0-1.92-.28-3.09-.83l.4,3.11c1.3.49,3.56.87,5.66-.35.76-.45,1.39-1.27,1.96-2.31s1.67-3.65,2.22-5.41c.57-1.76,4.89-12.63,4.89-12.63.18-.44.29-.71.33-.82.48-1.36.92-2.43,1.32-3.2h-4.01Z"></path><path d="M177.5,23.31c-6.09,0-8.56,4.37-8.56,8.25h0c0,3.9,2.48,8.52,8.56,8.52s8.31-4.64,8.31-8.53-2.22-8.24-8.31-8.24ZM177.49,37.85c-4.19,0-5.23-3.79-5.23-6.29s.91-5.99,5.23-5.99,4.99,3.48,4.99,5.99-.8,6.29-4.99,6.29Z"></path><path d="M220.34,26.79c-.54-1.15-1.26-2.01-2.15-2.57s-1.87-.84-2.95-.84c-3.63,0-5.58,2.82-5.58,2.82v-2.86l-3.56.76c.31.4.5.9.58,1.52.08.62.12,1.71.12,3.27v19.68l3.5-.76c-.22-.38-.36-.86-.43-1.44-.07-.59-.1-1.66-.1-3.22h-.01s0-3.9,0-3.9c1.32.59,2.53.89,3.63.89,1.46,0,2.76-.34,3.93-1.04,1.17-.7,2.1-1.73,2.79-3.09.69-1.36,1.04-3.01,1.04-4.95,0-1.69-.27-3.11-.81-4.27ZM217.41,34.85c-.49.96-1.12,1.65-1.88,2.08h.01c-.76.44-1.55.65-2.36.65-.68,0-1.25-.06-1.7-.18s-1.02-.35-1.7-.68v-8.98c.39-.42,1-.82,1.81-1.19s1.7-.56,2.67-.56c1.2,0,2.16.45,2.85,1.34.69.89,1.04,2.17,1.04,3.84,0,1.5-.24,2.72-.74,3.68Z"></path><polygon points="51.9 37.19 51.9 37.19 51.9 37.19 51.9 37.19"></polygon><path d="M52.48,26.34l-.17-2.9c-1.06.13-2.6.2-4.62.2v-3.53h-.03l-5.18,6.14v.1c.64-.13,1.39-.2,2.24-.2v8.42c0,1.98.39,3.39,1.17,4.24.78.85,1.91,1.27,3.38,1.27.81,0,1.61-.11,2.42-.31l.21-2.58c-.09.04-.19.09-.28.11-.55.18-1.12.26-1.72.26-.84,0-1.41-.24-1.73-.73-.32-.49-.48-1.36-.48-2.64v-8.05c2.4,0,3.99.07,4.79.2Z"></path><path d="M115.78,26.34l-.17-2.9c-1.06.13-2.6.2-4.62.2v-3.53h-.03l-5.18,6.14v.1c.64-.13,1.39-.2,2.24-.2v8.42c0,1.98.39,3.39,1.17,4.24.78.85,1.91,1.27,3.38,1.27.81,0,1.61-.11,2.42-.31l.21-2.58h0c-.09.04-.19.09-.28.11-.55.18-1.12.26-1.72.26-.84,0-1.41-.24-1.73-.73-.32-.49-.48-1.36-.48-2.64v-8.05c2.4,0,3.99.07,4.79.2Z"></path><path d="M62.5,23.3c-2.72-.17-4.53.64-5.9,1.91-1.82,1.69-2.53,4.08-2.5,6.81.04,3.21,1.43,5.41,3.44,6.86s5.86,1.61,9.04.27l.4-3.07h-.01c-3.58,2.51-7.74,1.88-9.38-1.53-.29-.59-.52-1.64-.54-2.82l2.6.9s2.43-.88,4.35-1.6c1.58-.59,3.47-1.35,3.47-1.35.38-.39.19-1.5.12-1.88-.35-1.99-1.84-4.3-5.09-4.5ZM63.18,29.3l-6.13,2.41c-.02-2.06.64-4.5,2.93-5.55,3.13-1.44,4.68.39,4.86,2.02.05.44-.55.64-1.66,1.12Z"></path><path d="M202.69,36.12c-.03-.84-.05-2.22-.05-4.16v-8.61l-3.56.78c.24.37.4.87.48,1.5.08.63.12,1,.12,2.83h-.02v7.26c-.51.51-1.17.92-1.98,1.24-.82.32-1.65.48-2.51.48-1.17,0-2.03-.34-2.59-1.02s-.84-1.75-.84-3.2v-9.87l-3.56.78c.24.37.4.87.48,1.5s.12,1,.12,2.83v5.48c0,4.11,1.73,6.17,5.25,6.17s5.74-2.82,5.74-2.82v2.46l3.6-.76c-.22-.28-.38-.62-.48-1.02-.1-.4-.17-1.01-.2-1.85Z"></path><path d="M20.46,34.57h.01v-11.22c-1.35.84-3.5.76-3.5.76.22.38.36.86.43,1.44.07.58.1,1.64.1,3.18v5.84c0,1.85-.04,3.08-.12,3.7-.08.61-.25,1.11-.51,1.48h4.19c-.24-.37-.4-.87-.48-1.5-.08-.63-.12-1.85-.12-3.68Z"></path><path d="M20.58,19.21c.18-.32.08-1.06-.27-1.54-.32-.46-.77-.77-1.44-.87-.62-.09-1.13.04-1.56.4-.43.36-.68.81-.76,1.35-.09.6.06,1.21.44,1.61.42.45,2.84.33,3.59-.95Z"></path><path d="M102.92,34.57h0v-11.22c-1.35.84-3.5.76-3.5.76.22.38.36.86.43,1.44.07.58.1,1.64.1,3.18v5.84c0,1.85-.04,3.08-.12,3.7-.08.61-.25,1.11-.51,1.48h4.19c-.24-.37-.4-.87-.48-1.5-.08-.63-.12-1.85-.12-3.68Z"></path><path d="M103.04,19.21c.18-.32.08-1.06-.27-1.54-.32-.46-.77-.77-1.44-.87-.62-.09-1.13.04-1.56.4-.43.36-.68.81-.76,1.35-.09.6.06,1.21.44,1.61.42.45,2.84.33,3.59-.95Z"></path><path d="M80.43,39.19h.02c-1.43-.17-6.8-.07-6.8-1.13,0-.5,1.49-.84,3.52-1.39.77-.21,1.61-.51,2.54-.88-.03,0-.07.01-.11.02,2.95-.81,4.88-3.11,4.88-6.14,0-2.36-1.27-4.28-3.2-5.39.28.02.64.03,1.1.03.75,0,1.55-.07,2.41-.2l-.73-2.61c-.73.46-1.78.86-3.15,1.2-1.36.34-2.55.51-3.58.51h-.17c-4.01,0-7.31,2.66-7.31,6.46s2.92,6.35,7.08,6.45c-.11.01-.19.02-.19.02-4.51.79-5.71,1.61-5.71,3.14s2.45,1.95,4.7,2.14c3.78.33,6.57.89,6.57,2.72,0,1.68-4.56,2.18-6.42,1.97-5.03-.55-4.09-2.84-1.65-3.51l-1.01-.17c-2.27.63-3.44,1.45-3.44,2.93,0,2.13,3.08,3.26,6.66,3.26,3.11,0,8.97-1.11,8.97-4.92,0-2.45-1.78-4.1-4.98-4.51ZM72.9,29.66c0-2.1,1.41-4.02,4.28-4.02s4.28,1.92,4.28,4.02-1.43,4.02-4.28,4.02c-2.7,0-4.28-1.92-4.28-4.02Z"></path><path d="M151.48,39.19h.02c-1.43-.17-6.8-.07-6.8-1.13,0-.5,1.49-.84,3.52-1.39.77-.21,1.61-.51,2.54-.88-.03,0-.07.01-.11.02,2.95-.81,4.88-3.11,4.88-6.14,0-2.36-1.27-4.28-3.2-5.39.28.02.64.03,1.1.03.75,0,1.55-.07,2.41-.2l-.73-2.61c-.73.46-1.78.86-3.15,1.2-1.36.34-2.55.51-3.58.51h-.17c-4.01,0-7.31,2.66-7.31,6.46s2.92,6.35,7.08,6.45c-.11.01-.19.02-.19.02-4.51.79-5.71,1.61-5.71,3.14s2.45,1.95,4.7,2.14c3.78.33,6.57.89,6.57,2.72,0,1.68-4.56,2.18-6.42,1.97-5.03-.55-4.09-2.84-1.65-3.51l-1.01-.17c-2.27.63-3.44,1.45-3.44,2.93,0,2.13,3.08,3.26,6.66,3.26,3.11,0,8.97-1.11,8.97-4.92,0-2.45-1.78-4.1-4.98-4.51ZM143.95,29.66c0-2.1,1.41-4.02,4.28-4.02s4.28,1.92,4.28,4.02-1.43,4.02-4.28,4.02c-2.7,0-4.28-1.92-4.28-4.02Z"></path></svg></a><ul><li><a class="external" href="https://integrityhealth.ai/">Health</a></li><li><a class="external" href="https://integrity.org/">Foundation</a></li></ul>',2),H0=[V0],G0={ref:"header",class:"header-section hidden"},Z0=St('<div class="header-content"><svg class="header-logo" fill="#ffffff" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 238.02 65.34"><path d="M39.6,34.57v-5.08c0-4.11-1.73-6.17-5.25-6.17s-5.74,2.82-5.74,2.82v-2.86l-3.6.76c.22.28.38.62.48,1.02.1.4.17,1.01.2,1.85.03.84.05,2.22.05,4.16v3.5c0,1.85-.04,3.08-.12,3.7-.08.61-.25,1.11-.51,1.48h4.19c-.24-.37-.4-.87-.48-1.5-.08-.63-.12-1.85-.12-3.68h.02s0-6.86,0-6.86c.51-.51,1.17-.92,1.98-1.24.82-.32,1.65-.48,2.51-.48,1.17,0,2.03.34,2.59,1.02.56.68.84,1.75.84,3.2v4.36c0,1.85-.04,3.08-.12,3.7-.08.61-.25,1.11-.51,1.48h4.19c-.24-.37-.4-.87-.48-1.5s-.12-1.85-.12-3.68Z"></path><path d="M95.95,23.32c-3.29,0-4.69,2.82-4.69,2.82l-.03-2.86-3.56.73c.24.31.41.66.51,1.07.1.41.16,1.04.18,1.9.02.85.03,2.37.03,4.55v3.04c0,1.85-.04,3.08-.12,3.7-.08.61-.25,1.11-.51,1.48h4.19c-.24-.37-.4-.87-.48-1.5-.08-.63-.12-1.85-.12-3.68h.01v-6.86c1.12-.99,2.43-1.32,3.93-1.32.66,0,1.29.1,1.88.3l-.36-3.27c-.33-.07-.62-.1-.86-.1Z"></path><path d="M167.02,23.32c-3.29,0-4.69,2.82-4.69,2.82l-.03-2.86-3.56.73c.24.31.41.66.51,1.07.1.41.16,1.04.18,1.9.02.85.03,2.37.03,4.55v3.04c0,1.85-.04,3.08-.12,3.7-.08.61-.25,1.11-.51,1.48h4.19c-.24-.37-.4-.87-.48-1.5-.08-.63-.12-1.85-.12-3.68h.01v-6.86c1.12-.99,2.43-1.32,3.93-1.32.66,0,1.29.1,1.88.3l-.36-3.27c-.33-.07-.62-.1-.86-.1Z"></path><path d="M129.24,23.46c.09.75-.07,1.81-.49,3.17,0,0-3.08,8.66-3.71,10.27-.54-1.72-3.45-10.17-3.45-10.17-.37-1.19-.56-2.1-.56-2.74,0-.24,0-.42.03-.53h-4.09c.25.44.49.96.73,1.55.24.6.54,1.39.89,2.38,0,0,4.57,12.67,4.83,13.57-.42,1.43-1.06,3.09-1.65,3.83-.59.74-1.33,1.11-2.21,1.11-.99,0-1.92-.28-3.09-.83l.4,3.11c1.3.49,3.56.87,5.66-.35.76-.45,1.39-1.27,1.96-2.31s1.67-3.65,2.22-5.41c.57-1.76,4.89-12.63,4.89-12.63.18-.44.29-.71.33-.82.48-1.36.92-2.43,1.32-3.2h-4.01Z"></path><path d="M177.5,23.31c-6.09,0-8.56,4.37-8.56,8.25h0c0,3.9,2.48,8.52,8.56,8.52s8.31-4.64,8.31-8.53-2.22-8.24-8.31-8.24ZM177.49,37.85c-4.19,0-5.23-3.79-5.23-6.29s.91-5.99,5.23-5.99,4.99,3.48,4.99,5.99-.8,6.29-4.99,6.29Z"></path><path d="M220.34,26.79c-.54-1.15-1.26-2.01-2.15-2.57s-1.87-.84-2.95-.84c-3.63,0-5.58,2.82-5.58,2.82v-2.86l-3.56.76c.31.4.5.9.58,1.52.08.62.12,1.71.12,3.27v19.68l3.5-.76c-.22-.38-.36-.86-.43-1.44-.07-.59-.1-1.66-.1-3.22h-.01s0-3.9,0-3.9c1.32.59,2.53.89,3.63.89,1.46,0,2.76-.34,3.93-1.04,1.17-.7,2.1-1.73,2.79-3.09.69-1.36,1.04-3.01,1.04-4.95,0-1.69-.27-3.11-.81-4.27ZM217.41,34.85c-.49.96-1.12,1.65-1.88,2.08h.01c-.76.44-1.55.65-2.36.65-.68,0-1.25-.06-1.7-.18s-1.02-.35-1.7-.68v-8.98c.39-.42,1-.82,1.81-1.19s1.7-.56,2.67-.56c1.2,0,2.16.45,2.85,1.34.69.89,1.04,2.17,1.04,3.84,0,1.5-.24,2.72-.74,3.68Z"></path><polygon points="51.9 37.19 51.9 37.19 51.9 37.19 51.9 37.19"></polygon><path d="M52.48,26.34l-.17-2.9c-1.06.13-2.6.2-4.62.2v-3.53h-.03l-5.18,6.14v.1c.64-.13,1.39-.2,2.24-.2v8.42c0,1.98.39,3.39,1.17,4.24.78.85,1.91,1.27,3.38,1.27.81,0,1.61-.11,2.42-.31l.21-2.58c-.09.04-.19.09-.28.11-.55.18-1.12.26-1.72.26-.84,0-1.41-.24-1.73-.73-.32-.49-.48-1.36-.48-2.64v-8.05c2.4,0,3.99.07,4.79.2Z"></path><path d="M115.78,26.34l-.17-2.9c-1.06.13-2.6.2-4.62.2v-3.53h-.03l-5.18,6.14v.1c.64-.13,1.39-.2,2.24-.2v8.42c0,1.98.39,3.39,1.17,4.24.78.85,1.91,1.27,3.38,1.27.81,0,1.61-.11,2.42-.31l.21-2.58h0c-.09.04-.19.09-.28.11-.55.18-1.12.26-1.72.26-.84,0-1.41-.24-1.73-.73-.32-.49-.48-1.36-.48-2.64v-8.05c2.4,0,3.99.07,4.79.2Z"></path><path d="M62.5,23.3c-2.72-.17-4.53.64-5.9,1.91-1.82,1.69-2.53,4.08-2.5,6.81.04,3.21,1.43,5.41,3.44,6.86s5.86,1.61,9.04.27l.4-3.07h-.01c-3.58,2.51-7.74,1.88-9.38-1.53-.29-.59-.52-1.64-.54-2.82l2.6.9s2.43-.88,4.35-1.6c1.58-.59,3.47-1.35,3.47-1.35.38-.39.19-1.5.12-1.88-.35-1.99-1.84-4.3-5.09-4.5ZM63.18,29.3l-6.13,2.41c-.02-2.06.64-4.5,2.93-5.55,3.13-1.44,4.68.39,4.86,2.02.05.44-.55.64-1.66,1.12Z"></path><path d="M202.69,36.12c-.03-.84-.05-2.22-.05-4.16v-8.61l-3.56.78c.24.37.4.87.48,1.5.08.63.12,1,.12,2.83h-.02v7.26c-.51.51-1.17.92-1.98,1.24-.82.32-1.65.48-2.51.48-1.17,0-2.03-.34-2.59-1.02s-.84-1.75-.84-3.2v-9.87l-3.56.78c.24.37.4.87.48,1.5s.12,1,.12,2.83v5.48c0,4.11,1.73,6.17,5.25,6.17s5.74-2.82,5.74-2.82v2.46l3.6-.76c-.22-.28-.38-.62-.48-1.02-.1-.4-.17-1.01-.2-1.85Z"></path><path d="M20.46,34.57h.01v-11.22c-1.35.84-3.5.76-3.5.76.22.38.36.86.43,1.44.07.58.1,1.64.1,3.18v5.84c0,1.85-.04,3.08-.12,3.7-.08.61-.25,1.11-.51,1.48h4.19c-.24-.37-.4-.87-.48-1.5-.08-.63-.12-1.85-.12-3.68Z"></path><path d="M20.58,19.21c.18-.32.08-1.06-.27-1.54-.32-.46-.77-.77-1.44-.87-.62-.09-1.13.04-1.56.4-.43.36-.68.81-.76,1.35-.09.6.06,1.21.44,1.61.42.45,2.84.33,3.59-.95Z"></path><path d="M102.92,34.57h0v-11.22c-1.35.84-3.5.76-3.5.76.22.38.36.86.43,1.44.07.58.1,1.64.1,3.18v5.84c0,1.85-.04,3.08-.12,3.7-.08.61-.25,1.11-.51,1.48h4.19c-.24-.37-.4-.87-.48-1.5-.08-.63-.12-1.85-.12-3.68Z"></path><path d="M103.04,19.21c.18-.32.08-1.06-.27-1.54-.32-.46-.77-.77-1.44-.87-.62-.09-1.13.04-1.56.4-.43.36-.68.81-.76,1.35-.09.6.06,1.21.44,1.61.42.45,2.84.33,3.59-.95Z"></path><path d="M80.43,39.19h.02c-1.43-.17-6.8-.07-6.8-1.13,0-.5,1.49-.84,3.52-1.39.77-.21,1.61-.51,2.54-.88-.03,0-.07.01-.11.02,2.95-.81,4.88-3.11,4.88-6.14,0-2.36-1.27-4.28-3.2-5.39.28.02.64.03,1.1.03.75,0,1.55-.07,2.41-.2l-.73-2.61c-.73.46-1.78.86-3.15,1.2-1.36.34-2.55.51-3.58.51h-.17c-4.01,0-7.31,2.66-7.31,6.46s2.92,6.35,7.08,6.45c-.11.01-.19.02-.19.02-4.51.79-5.71,1.61-5.71,3.14s2.45,1.95,4.7,2.14c3.78.33,6.57.89,6.57,2.72,0,1.68-4.56,2.18-6.42,1.97-5.03-.55-4.09-2.84-1.65-3.51l-1.01-.17c-2.27.63-3.44,1.45-3.44,2.93,0,2.13,3.08,3.26,6.66,3.26,3.11,0,8.97-1.11,8.97-4.92,0-2.45-1.78-4.1-4.98-4.51ZM72.9,29.66c0-2.1,1.41-4.02,4.28-4.02s4.28,1.92,4.28,4.02-1.43,4.02-4.28,4.02c-2.7,0-4.28-1.92-4.28-4.02Z"></path><path d="M151.48,39.19h.02c-1.43-.17-6.8-.07-6.8-1.13,0-.5,1.49-.84,3.52-1.39.77-.21,1.61-.51,2.54-.88-.03,0-.07.01-.11.02,2.95-.81,4.88-3.11,4.88-6.14,0-2.36-1.27-4.28-3.2-5.39.28.02.64.03,1.1.03.75,0,1.55-.07,2.41-.2l-.73-2.61c-.73.46-1.78.86-3.15,1.2-1.36.34-2.55.51-3.58.51h-.17c-4.01,0-7.31,2.66-7.31,6.46s2.92,6.35,7.08,6.45c-.11.01-.19.02-.19.02-4.51.79-5.71,1.61-5.71,3.14s2.45,1.95,4.7,2.14c3.78.33,6.57.89,6.57,2.72,0,1.68-4.56,2.18-6.42,1.97-5.03-.55-4.09-2.84-1.65-3.51l-1.01-.17c-2.27.63-3.44,1.45-3.44,2.93,0,2.13,3.08,3.26,6.66,3.26,3.11,0,8.97-1.11,8.97-4.92,0-2.45-1.78-4.1-4.98-4.51ZM143.95,29.66c0-2.1,1.41-4.02,4.28-4.02s4.28,1.92,4.28,4.02-1.43,4.02-4.28,4.02c-2.7,0-4.28-1.92-4.28-4.02Z"></path></svg><h1 class="header-title">Creating technology with a conscience</h1></div>',1),q0={ref:"contentContainer",class:"page-content hidden"},X0=St('<h1 style="display:none;">Integrity Group</h1><section class="content-section content-section--gradient"><div class="content-section__inner"><h2 style="margin-top:.5rem;">Profit with purpose</h2><h3>The Integrity Group exists to reimagine prosperity as a pathway to purpose. By converting growth into access and intelligence into empathy, we build technology aligned with its highest potential: to uplift, to connect and to heal.</h3><p>Technology can be one of the most powerful forces ever created, capable of enhancing the lives of billions, curing diseases and reshaping entire economies. But without purpose, the light of innovation can blind as easily as it can illuminate. It can destroy more than it creates.</p><p>We are building a different kind of system, where intelligence is guided by intention.</p><p>Where capital and compassion fuel each other.</p><p>Where technology serves humanity, not the other way around.</p></div></section><section class="content-section content-section--gradient content-section--alt"><div class="content-section__inner"><h2>The Integrity model</h2><h3>We believe the engines of capitalism and the missions of philanthropy are capable of working together harmoniously. Our model unites them — as one ecosystem of for-profit innovation and nonprofit purpose.</h3><p>We operate across three distinct entities:</p><ul><li><a href="https://integrity.ai">integrity.ai</a> builds and scales fundamental AI technology through invention, investment, and acquisition. It operates on our <span class="italic">Ethical AI</span> framework, ensuring that what we create accelerates progress while protecting the fragile systems we depend on. <span class="italic">Fifty-one percent</span> of returns from integrity.ai will perpetually fund the Integrity Foundation, creating a self-sustaining loop of impact.</li><li><a href="https://www.integrity.org/">Integrity Foundation</a> expands access to AI in underserved segments of the population and funds primary research and education in areas that improve mental health and human wellbeing. We run the Foundation with the spirit of a startup, meaning fast, creative, and driven by impact. Innovation isn’t just encouraged. It is rewarded. Our pay and benefits match those of our for-profit ventures, honoring great work with equal value across every team</li><li><a href="https://integrityhealth.ai">Integrity Health</a> is our first major venture powered by integrity.ai’s foundational framework: an AI-first, human-centered operating system that expands access to evidence-based health and wellness. It unites, enables and curates the vast array of digital therapeutics, personalized human support, and wellness ecosystems into one coherent experience designed to heal at scale while keeping people, not algorithms, at the center. Because when people are mentally well, everything else works better for families, communities, economies, and the future itself.</li></ul></div></section><section class="content-section content-section--gradient"><div class="content-section__inner"><h2>What is ethical AI?</h2><h3>Artificial intelligence is rewriting the rules of work, health, and society. It can concentrate power in the hands of a few, or expand opportunity for everyone. The outcome depends on the frameworks we design today.</h3><p>Ethical AI ensures transparency, data integrity, and accountability into every layer of design, using technology to enhance human potential and restore balance across social, economic, and ecological systems.</p><p>It is not about limiting innovation. It is about ensuring that what we create amplifies life, rather than extracts from it.</p><p>Ethical AI is not a product feature. It is a philosophy, a living system for building intelligence with and for humanity.</p></div></section><section id="about" class="content-section content-section--gradient content-section--alt"><div class="content-section__inner"><h2>Who we are</h2><h4><a href="https://www.linkedin.com/in/bjarratt/">Braxton Jarratt</a> | The Catalyst</h4><p>I have spent my career building technology that changes how people connect, live and work, from the early days of high-speed consumer internet to platforms that reshaped how the world watches, learns, communicates, and organizes.</p><p>I saw the profound potential of artificial intelligence firsthand when my startup was acquired by IBM’s Watson AI group a decade ago. Along the way, I have witnessed world-transforming innovation unfold before my eyes, and seen what happens when progress outpaces intention.</p><p>Technology has the power to create and to consume or destroy. It can expand human potential or reduce it to metrics. After decades leading companies through rapid growth, I began asking a different question: not how fast can we build, but why are we building?</p><p>I founded the Integrity Group to bring that question back to the center of my work and life. I believe artificial intelligence can serve humanity — when guided by human values that resonate with me, such as transparency, empathy, and purpose.</p><p>Integrity is not just a slogan. It is a design principle for my life and my work. I truly believe that when intelligence and intention align, technology doesn’t replace us. It elevates us.</p><h4 style="margin-top:3rem;"><a href="https://www.linkedin.com/in/eric-burns-05b63613/">Eric Burns</a> | Dollars and Sense</h4><p>For the past 15 years, I have had the privilege of advising clients on some of their most important transactions, going public, raising capital, acquiring or being acquired. My career as an investment banker was a pleasant surprise in many ways, characterized by fewer Gordon Gekkos than expected as colleagues, brilliant young people with energy, travel around the world, and an opportunity to partner with the leadership and entrepreneurs that fuel high growth technology companies, large conglomerates and everything in between. But yes, people should continue to make fun of investment bankers.</p><p>I spent years speaking with founders and executives about the potential for AI to transform industries. That future is here now, and it feels overwhelming to think about the impact AI is having this year, much less a decade from now. There are deep philosophical and ethical questions at hand.</p><p>But I am optimistic, and hopeful, that AI with the right ethical and governance frameworks, can help fix broken systems within our society, like healthcare, while allowing the people within those systems to be more human than they ever have been.</p><h4 style="margin-top:3rem;"><a href="https://www.linkedin.com/in/dwightwitherspoon/">Dwight Witherspoon</a> | Narrative Alchemist</h4><p>I have spent more than 20 years in the tech industry, and what a ride it has been. I was there when Sun Microsystems put the dot in dotcom, when Ericsson launched 3G, 4G, and 5G, and when the media industry shifted from video stores to streaming. I’ve watched software evolve from proprietary code to open, visual, and collaborative systems that unlocked innovation for millions. And I’ve had the privilege of working with teams at the World Food Programme, who used mobile technology to reconnect communities after natural disasters in developing parts of the world.</p><p>Those were exciting times, moments when technology really did make life better. But as the years went on, I began to feel a growing disconnect. Too often, the industry became consumed by valuation, speed, and scale, not by solving the problems that truly matter. Climate change, healthcare, mental health, homelessness, and wealth inequality - these challenges persist not because we lack intelligence, but because we have lacked intention.</p><p>Now we are standing at the start of another transformation. Artificial intelligence holds extraordinary promise: the ability to accelerate solutions, empower individuals, and reimagine how we live and work. But if left unchecked, it could also deepen divides and erode trust.</p><p>That is why I joined Braxton and Eric in launching the Integrity Group. AI will shape the future, but how it shapes humanity depends on the integrity of those building it.</p></div></section><section class="content-section content-section--gradient"><div class="content-section__inner"><h2>An invitation</h2><h3>This isn’t a manifesto. It’s an open invitation to co-create what comes next.</h3><p>To the investors who care what their capital builds.<br> To the technologists who believe code can have a conscience.<br> To the dreamers who still believe optimism is the most human act of all.<br></p><p>Join us.<br> 💜 <a href="mailto:hello@integrity.ai" class="email">hello@integrity.ai</a></p></div></section><footer><section class="content-section"><div class="content-section__inner"><div class="nav-mobile"><ul><li><a class="external" href="https://integrity.org/">Foundation</a></li><li><a class="external" href="https://integrityhealth.ai/">Health</a></li></ul></div></div></section></footer>',7),Y0=[X0];function K0(t,e,n,i,r,s){const a=Tt("Loader"),o=Tt("WebGL");return qt(),Pn("main",W0,[rt("nav",j0,H0,512),ve(a),rt("header",G0,[ve(o),Z0],512),rt("div",q0,Y0,512)],512)}const Q0=Yt($0,[["render",K0]]);const J0={name:"Error",components:{WebGL:Kr,Loader:Qr},computed:{mode:function(){return{}.VUE_APP_MODE||"app"}},watch:{},mounted(){setTimeout(()=>{this.$refs.header.classList.remove("hidden"),this.$refs.contentContainer.classList.remove("hidden")},500),window.addEventListener("scroll",()=>{window.pageYOffset/window.innerHeight>.5?this.$refs.navDesktop.classList.remove("hidden"):this.$refs.navDesktop.classList.add("hidden")});const t={root:null,rootMargin:"0px",threshold:.1},e=new IntersectionObserver(i=>{i.forEach(r=>{if(r.isIntersecting){const s=r.target.children;Array.from(s).forEach((a,o)=>{setTimeout(()=>{a.classList.add("content-section__child--visible")},o*50)})}})},t);document.querySelectorAll(".content-section__inner").forEach(i=>{e.observe(i)})},methods:{}},e2={style:{height:"100vh","overflow-y":"hidden"},ref:"main",class:"site-wrapper"},t2={ref:"navDesktop",class:"nav-desktop hidden"},n2=St('<a class="logo" href="https://integrity.ai"><svg fill="#000000" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 238.02 65.34"><path d="M39.6,34.57v-5.08c0-4.11-1.73-6.17-5.25-6.17s-5.74,2.82-5.74,2.82v-2.86l-3.6.76c.22.28.38.62.48,1.02.1.4.17,1.01.2,1.85.03.84.05,2.22.05,4.16v3.5c0,1.85-.04,3.08-.12,3.7-.08.61-.25,1.11-.51,1.48h4.19c-.24-.37-.4-.87-.48-1.5-.08-.63-.12-1.85-.12-3.68h.02s0-6.86,0-6.86c.51-.51,1.17-.92,1.98-1.24.82-.32,1.65-.48,2.51-.48,1.17,0,2.03.34,2.59,1.02.56.68.84,1.75.84,3.2v4.36c0,1.85-.04,3.08-.12,3.7-.08.61-.25,1.11-.51,1.48h4.19c-.24-.37-.4-.87-.48-1.5s-.12-1.85-.12-3.68Z"></path><path d="M95.95,23.32c-3.29,0-4.69,2.82-4.69,2.82l-.03-2.86-3.56.73c.24.31.41.66.51,1.07.1.41.16,1.04.18,1.9.02.85.03,2.37.03,4.55v3.04c0,1.85-.04,3.08-.12,3.7-.08.61-.25,1.11-.51,1.48h4.19c-.24-.37-.4-.87-.48-1.5-.08-.63-.12-1.85-.12-3.68h.01v-6.86c1.12-.99,2.43-1.32,3.93-1.32.66,0,1.29.1,1.88.3l-.36-3.27c-.33-.07-.62-.1-.86-.1Z"></path><path d="M167.02,23.32c-3.29,0-4.69,2.82-4.69,2.82l-.03-2.86-3.56.73c.24.31.41.66.51,1.07.1.41.16,1.04.18,1.9.02.85.03,2.37.03,4.55v3.04c0,1.85-.04,3.08-.12,3.7-.08.61-.25,1.11-.51,1.48h4.19c-.24-.37-.4-.87-.48-1.5-.08-.63-.12-1.85-.12-3.68h.01v-6.86c1.12-.99,2.43-1.32,3.93-1.32.66,0,1.29.1,1.88.3l-.36-3.27c-.33-.07-.62-.1-.86-.1Z"></path><path d="M129.24,23.46c.09.75-.07,1.81-.49,3.17,0,0-3.08,8.66-3.71,10.27-.54-1.72-3.45-10.17-3.45-10.17-.37-1.19-.56-2.1-.56-2.74,0-.24,0-.42.03-.53h-4.09c.25.44.49.96.73,1.55.24.6.54,1.39.89,2.38,0,0,4.57,12.67,4.83,13.57-.42,1.43-1.06,3.09-1.65,3.83-.59.74-1.33,1.11-2.21,1.11-.99,0-1.92-.28-3.09-.83l.4,3.11c1.3.49,3.56.87,5.66-.35.76-.45,1.39-1.27,1.96-2.31s1.67-3.65,2.22-5.41c.57-1.76,4.89-12.63,4.89-12.63.18-.44.29-.71.33-.82.48-1.36.92-2.43,1.32-3.2h-4.01Z"></path><path d="M177.5,23.31c-6.09,0-8.56,4.37-8.56,8.25h0c0,3.9,2.48,8.52,8.56,8.52s8.31-4.64,8.31-8.53-2.22-8.24-8.31-8.24ZM177.49,37.85c-4.19,0-5.23-3.79-5.23-6.29s.91-5.99,5.23-5.99,4.99,3.48,4.99,5.99-.8,6.29-4.99,6.29Z"></path><path d="M220.34,26.79c-.54-1.15-1.26-2.01-2.15-2.57s-1.87-.84-2.95-.84c-3.63,0-5.58,2.82-5.58,2.82v-2.86l-3.56.76c.31.4.5.9.58,1.52.08.62.12,1.71.12,3.27v19.68l3.5-.76c-.22-.38-.36-.86-.43-1.44-.07-.59-.1-1.66-.1-3.22h-.01s0-3.9,0-3.9c1.32.59,2.53.89,3.63.89,1.46,0,2.76-.34,3.93-1.04,1.17-.7,2.1-1.73,2.79-3.09.69-1.36,1.04-3.01,1.04-4.95,0-1.69-.27-3.11-.81-4.27ZM217.41,34.85c-.49.96-1.12,1.65-1.88,2.08h.01c-.76.44-1.55.65-2.36.65-.68,0-1.25-.06-1.7-.18s-1.02-.35-1.7-.68v-8.98c.39-.42,1-.82,1.81-1.19s1.7-.56,2.67-.56c1.2,0,2.16.45,2.85,1.34.69.89,1.04,2.17,1.04,3.84,0,1.5-.24,2.72-.74,3.68Z"></path><polygon points="51.9 37.19 51.9 37.19 51.9 37.19 51.9 37.19"></polygon><path d="M52.48,26.34l-.17-2.9c-1.06.13-2.6.2-4.62.2v-3.53h-.03l-5.18,6.14v.1c.64-.13,1.39-.2,2.24-.2v8.42c0,1.98.39,3.39,1.17,4.24.78.85,1.91,1.27,3.38,1.27.81,0,1.61-.11,2.42-.31l.21-2.58c-.09.04-.19.09-.28.11-.55.18-1.12.26-1.72.26-.84,0-1.41-.24-1.73-.73-.32-.49-.48-1.36-.48-2.64v-8.05c2.4,0,3.99.07,4.79.2Z"></path><path d="M115.78,26.34l-.17-2.9c-1.06.13-2.6.2-4.62.2v-3.53h-.03l-5.18,6.14v.1c.64-.13,1.39-.2,2.24-.2v8.42c0,1.98.39,3.39,1.17,4.24.78.85,1.91,1.27,3.38,1.27.81,0,1.61-.11,2.42-.31l.21-2.58h0c-.09.04-.19.09-.28.11-.55.18-1.12.26-1.72.26-.84,0-1.41-.24-1.73-.73-.32-.49-.48-1.36-.48-2.64v-8.05c2.4,0,3.99.07,4.79.2Z"></path><path d="M62.5,23.3c-2.72-.17-4.53.64-5.9,1.91-1.82,1.69-2.53,4.08-2.5,6.81.04,3.21,1.43,5.41,3.44,6.86s5.86,1.61,9.04.27l.4-3.07h-.01c-3.58,2.51-7.74,1.88-9.38-1.53-.29-.59-.52-1.64-.54-2.82l2.6.9s2.43-.88,4.35-1.6c1.58-.59,3.47-1.35,3.47-1.35.38-.39.19-1.5.12-1.88-.35-1.99-1.84-4.3-5.09-4.5ZM63.18,29.3l-6.13,2.41c-.02-2.06.64-4.5,2.93-5.55,3.13-1.44,4.68.39,4.86,2.02.05.44-.55.64-1.66,1.12Z"></path><path d="M202.69,36.12c-.03-.84-.05-2.22-.05-4.16v-8.61l-3.56.78c.24.37.4.87.48,1.5.08.63.12,1,.12,2.83h-.02v7.26c-.51.51-1.17.92-1.98,1.24-.82.32-1.65.48-2.51.48-1.17,0-2.03-.34-2.59-1.02s-.84-1.75-.84-3.2v-9.87l-3.56.78c.24.37.4.87.48,1.5s.12,1,.12,2.83v5.48c0,4.11,1.73,6.17,5.25,6.17s5.74-2.82,5.74-2.82v2.46l3.6-.76c-.22-.28-.38-.62-.48-1.02-.1-.4-.17-1.01-.2-1.85Z"></path><path d="M20.46,34.57h.01v-11.22c-1.35.84-3.5.76-3.5.76.22.38.36.86.43,1.44.07.58.1,1.64.1,3.18v5.84c0,1.85-.04,3.08-.12,3.7-.08.61-.25,1.11-.51,1.48h4.19c-.24-.37-.4-.87-.48-1.5-.08-.63-.12-1.85-.12-3.68Z"></path><path d="M20.58,19.21c.18-.32.08-1.06-.27-1.54-.32-.46-.77-.77-1.44-.87-.62-.09-1.13.04-1.56.4-.43.36-.68.81-.76,1.35-.09.6.06,1.21.44,1.61.42.45,2.84.33,3.59-.95Z"></path><path d="M102.92,34.57h0v-11.22c-1.35.84-3.5.76-3.5.76.22.38.36.86.43,1.44.07.58.1,1.64.1,3.18v5.84c0,1.85-.04,3.08-.12,3.7-.08.61-.25,1.11-.51,1.48h4.19c-.24-.37-.4-.87-.48-1.5-.08-.63-.12-1.85-.12-3.68Z"></path><path d="M103.04,19.21c.18-.32.08-1.06-.27-1.54-.32-.46-.77-.77-1.44-.87-.62-.09-1.13.04-1.56.4-.43.36-.68.81-.76,1.35-.09.6.06,1.21.44,1.61.42.45,2.84.33,3.59-.95Z"></path><path d="M80.43,39.19h.02c-1.43-.17-6.8-.07-6.8-1.13,0-.5,1.49-.84,3.52-1.39.77-.21,1.61-.51,2.54-.88-.03,0-.07.01-.11.02,2.95-.81,4.88-3.11,4.88-6.14,0-2.36-1.27-4.28-3.2-5.39.28.02.64.03,1.1.03.75,0,1.55-.07,2.41-.2l-.73-2.61c-.73.46-1.78.86-3.15,1.2-1.36.34-2.55.51-3.58.51h-.17c-4.01,0-7.31,2.66-7.31,6.46s2.92,6.35,7.08,6.45c-.11.01-.19.02-.19.02-4.51.79-5.71,1.61-5.71,3.14s2.45,1.95,4.7,2.14c3.78.33,6.57.89,6.57,2.72,0,1.68-4.56,2.18-6.42,1.97-5.03-.55-4.09-2.84-1.65-3.51l-1.01-.17c-2.27.63-3.44,1.45-3.44,2.93,0,2.13,3.08,3.26,6.66,3.26,3.11,0,8.97-1.11,8.97-4.92,0-2.45-1.78-4.1-4.98-4.51ZM72.9,29.66c0-2.1,1.41-4.02,4.28-4.02s4.28,1.92,4.28,4.02-1.43,4.02-4.28,4.02c-2.7,0-4.28-1.92-4.28-4.02Z"></path><path d="M151.48,39.19h.02c-1.43-.17-6.8-.07-6.8-1.13,0-.5,1.49-.84,3.52-1.39.77-.21,1.61-.51,2.54-.88-.03,0-.07.01-.11.02,2.95-.81,4.88-3.11,4.88-6.14,0-2.36-1.27-4.28-3.2-5.39.28.02.64.03,1.1.03.75,0,1.55-.07,2.41-.2l-.73-2.61c-.73.46-1.78.86-3.15,1.2-1.36.34-2.55.51-3.58.51h-.17c-4.01,0-7.31,2.66-7.31,6.46s2.92,6.35,7.08,6.45c-.11.01-.19.02-.19.02-4.51.79-5.71,1.61-5.71,3.14s2.45,1.95,4.7,2.14c3.78.33,6.57.89,6.57,2.72,0,1.68-4.56,2.18-6.42,1.97-5.03-.55-4.09-2.84-1.65-3.51l-1.01-.17c-2.27.63-3.44,1.45-3.44,2.93,0,2.13,3.08,3.26,6.66,3.26,3.11,0,8.97-1.11,8.97-4.92,0-2.45-1.78-4.1-4.98-4.51ZM143.95,29.66c0-2.1,1.41-4.02,4.28-4.02s4.28,1.92,4.28,4.02-1.43,4.02-4.28,4.02c-2.7,0-4.28-1.92-4.28-4.02Z"></path></svg></a><ul><li><a class="external" href="https://integrityhealth.ai/">Health</a></li><li><a class="external" href="https://integrity.org/">Foundation</a></li></ul>',2),i2=[n2],r2={ref:"header",class:"header-section hidden"},s2=St('<div class="header-content"><svg class="header-logo" fill="#ffffff" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 238.02 65.34"><path d="M39.6,34.57v-5.08c0-4.11-1.73-6.17-5.25-6.17s-5.74,2.82-5.74,2.82v-2.86l-3.6.76c.22.28.38.62.48,1.02.1.4.17,1.01.2,1.85.03.84.05,2.22.05,4.16v3.5c0,1.85-.04,3.08-.12,3.7-.08.61-.25,1.11-.51,1.48h4.19c-.24-.37-.4-.87-.48-1.5-.08-.63-.12-1.85-.12-3.68h.02s0-6.86,0-6.86c.51-.51,1.17-.92,1.98-1.24.82-.32,1.65-.48,2.51-.48,1.17,0,2.03.34,2.59,1.02.56.68.84,1.75.84,3.2v4.36c0,1.85-.04,3.08-.12,3.7-.08.61-.25,1.11-.51,1.48h4.19c-.24-.37-.4-.87-.48-1.5s-.12-1.85-.12-3.68Z"></path><path d="M95.95,23.32c-3.29,0-4.69,2.82-4.69,2.82l-.03-2.86-3.56.73c.24.31.41.66.51,1.07.1.41.16,1.04.18,1.9.02.85.03,2.37.03,4.55v3.04c0,1.85-.04,3.08-.12,3.7-.08.61-.25,1.11-.51,1.48h4.19c-.24-.37-.4-.87-.48-1.5-.08-.63-.12-1.85-.12-3.68h.01v-6.86c1.12-.99,2.43-1.32,3.93-1.32.66,0,1.29.1,1.88.3l-.36-3.27c-.33-.07-.62-.1-.86-.1Z"></path><path d="M167.02,23.32c-3.29,0-4.69,2.82-4.69,2.82l-.03-2.86-3.56.73c.24.31.41.66.51,1.07.1.41.16,1.04.18,1.9.02.85.03,2.37.03,4.55v3.04c0,1.85-.04,3.08-.12,3.7-.08.61-.25,1.11-.51,1.48h4.19c-.24-.37-.4-.87-.48-1.5-.08-.63-.12-1.85-.12-3.68h.01v-6.86c1.12-.99,2.43-1.32,3.93-1.32.66,0,1.29.1,1.88.3l-.36-3.27c-.33-.07-.62-.1-.86-.1Z"></path><path d="M129.24,23.46c.09.75-.07,1.81-.49,3.17,0,0-3.08,8.66-3.71,10.27-.54-1.72-3.45-10.17-3.45-10.17-.37-1.19-.56-2.1-.56-2.74,0-.24,0-.42.03-.53h-4.09c.25.44.49.96.73,1.55.24.6.54,1.39.89,2.38,0,0,4.57,12.67,4.83,13.57-.42,1.43-1.06,3.09-1.65,3.83-.59.74-1.33,1.11-2.21,1.11-.99,0-1.92-.28-3.09-.83l.4,3.11c1.3.49,3.56.87,5.66-.35.76-.45,1.39-1.27,1.96-2.31s1.67-3.65,2.22-5.41c.57-1.76,4.89-12.63,4.89-12.63.18-.44.29-.71.33-.82.48-1.36.92-2.43,1.32-3.2h-4.01Z"></path><path d="M177.5,23.31c-6.09,0-8.56,4.37-8.56,8.25h0c0,3.9,2.48,8.52,8.56,8.52s8.31-4.64,8.31-8.53-2.22-8.24-8.31-8.24ZM177.49,37.85c-4.19,0-5.23-3.79-5.23-6.29s.91-5.99,5.23-5.99,4.99,3.48,4.99,5.99-.8,6.29-4.99,6.29Z"></path><path d="M220.34,26.79c-.54-1.15-1.26-2.01-2.15-2.57s-1.87-.84-2.95-.84c-3.63,0-5.58,2.82-5.58,2.82v-2.86l-3.56.76c.31.4.5.9.58,1.52.08.62.12,1.71.12,3.27v19.68l3.5-.76c-.22-.38-.36-.86-.43-1.44-.07-.59-.1-1.66-.1-3.22h-.01s0-3.9,0-3.9c1.32.59,2.53.89,3.63.89,1.46,0,2.76-.34,3.93-1.04,1.17-.7,2.1-1.73,2.79-3.09.69-1.36,1.04-3.01,1.04-4.95,0-1.69-.27-3.11-.81-4.27ZM217.41,34.85c-.49.96-1.12,1.65-1.88,2.08h.01c-.76.44-1.55.65-2.36.65-.68,0-1.25-.06-1.7-.18s-1.02-.35-1.7-.68v-8.98c.39-.42,1-.82,1.81-1.19s1.7-.56,2.67-.56c1.2,0,2.16.45,2.85,1.34.69.89,1.04,2.17,1.04,3.84,0,1.5-.24,2.72-.74,3.68Z"></path><polygon points="51.9 37.19 51.9 37.19 51.9 37.19 51.9 37.19"></polygon><path d="M52.48,26.34l-.17-2.9c-1.06.13-2.6.2-4.62.2v-3.53h-.03l-5.18,6.14v.1c.64-.13,1.39-.2,2.24-.2v8.42c0,1.98.39,3.39,1.17,4.24.78.85,1.91,1.27,3.38,1.27.81,0,1.61-.11,2.42-.31l.21-2.58c-.09.04-.19.09-.28.11-.55.18-1.12.26-1.72.26-.84,0-1.41-.24-1.73-.73-.32-.49-.48-1.36-.48-2.64v-8.05c2.4,0,3.99.07,4.79.2Z"></path><path d="M115.78,26.34l-.17-2.9c-1.06.13-2.6.2-4.62.2v-3.53h-.03l-5.18,6.14v.1c.64-.13,1.39-.2,2.24-.2v8.42c0,1.98.39,3.39,1.17,4.24.78.85,1.91,1.27,3.38,1.27.81,0,1.61-.11,2.42-.31l.21-2.58h0c-.09.04-.19.09-.28.11-.55.18-1.12.26-1.72.26-.84,0-1.41-.24-1.73-.73-.32-.49-.48-1.36-.48-2.64v-8.05c2.4,0,3.99.07,4.79.2Z"></path><path d="M62.5,23.3c-2.72-.17-4.53.64-5.9,1.91-1.82,1.69-2.53,4.08-2.5,6.81.04,3.21,1.43,5.41,3.44,6.86s5.86,1.61,9.04.27l.4-3.07h-.01c-3.58,2.51-7.74,1.88-9.38-1.53-.29-.59-.52-1.64-.54-2.82l2.6.9s2.43-.88,4.35-1.6c1.58-.59,3.47-1.35,3.47-1.35.38-.39.19-1.5.12-1.88-.35-1.99-1.84-4.3-5.09-4.5ZM63.18,29.3l-6.13,2.41c-.02-2.06.64-4.5,2.93-5.55,3.13-1.44,4.68.39,4.86,2.02.05.44-.55.64-1.66,1.12Z"></path><path d="M202.69,36.12c-.03-.84-.05-2.22-.05-4.16v-8.61l-3.56.78c.24.37.4.87.48,1.5.08.63.12,1,.12,2.83h-.02v7.26c-.51.51-1.17.92-1.98,1.24-.82.32-1.65.48-2.51.48-1.17,0-2.03-.34-2.59-1.02s-.84-1.75-.84-3.2v-9.87l-3.56.78c.24.37.4.87.48,1.5s.12,1,.12,2.83v5.48c0,4.11,1.73,6.17,5.25,6.17s5.74-2.82,5.74-2.82v2.46l3.6-.76c-.22-.28-.38-.62-.48-1.02-.1-.4-.17-1.01-.2-1.85Z"></path><path d="M20.46,34.57h.01v-11.22c-1.35.84-3.5.76-3.5.76.22.38.36.86.43,1.44.07.58.1,1.64.1,3.18v5.84c0,1.85-.04,3.08-.12,3.7-.08.61-.25,1.11-.51,1.48h4.19c-.24-.37-.4-.87-.48-1.5-.08-.63-.12-1.85-.12-3.68Z"></path><path d="M20.58,19.21c.18-.32.08-1.06-.27-1.54-.32-.46-.77-.77-1.44-.87-.62-.09-1.13.04-1.56.4-.43.36-.68.81-.76,1.35-.09.6.06,1.21.44,1.61.42.45,2.84.33,3.59-.95Z"></path><path d="M102.92,34.57h0v-11.22c-1.35.84-3.5.76-3.5.76.22.38.36.86.43,1.44.07.58.1,1.64.1,3.18v5.84c0,1.85-.04,3.08-.12,3.7-.08.61-.25,1.11-.51,1.48h4.19c-.24-.37-.4-.87-.48-1.5-.08-.63-.12-1.85-.12-3.68Z"></path><path d="M103.04,19.21c.18-.32.08-1.06-.27-1.54-.32-.46-.77-.77-1.44-.87-.62-.09-1.13.04-1.56.4-.43.36-.68.81-.76,1.35-.09.6.06,1.21.44,1.61.42.45,2.84.33,3.59-.95Z"></path><path d="M80.43,39.19h.02c-1.43-.17-6.8-.07-6.8-1.13,0-.5,1.49-.84,3.52-1.39.77-.21,1.61-.51,2.54-.88-.03,0-.07.01-.11.02,2.95-.81,4.88-3.11,4.88-6.14,0-2.36-1.27-4.28-3.2-5.39.28.02.64.03,1.1.03.75,0,1.55-.07,2.41-.2l-.73-2.61c-.73.46-1.78.86-3.15,1.2-1.36.34-2.55.51-3.58.51h-.17c-4.01,0-7.31,2.66-7.31,6.46s2.92,6.35,7.08,6.45c-.11.01-.19.02-.19.02-4.51.79-5.71,1.61-5.71,3.14s2.45,1.95,4.7,2.14c3.78.33,6.57.89,6.57,2.72,0,1.68-4.56,2.18-6.42,1.97-5.03-.55-4.09-2.84-1.65-3.51l-1.01-.17c-2.27.63-3.44,1.45-3.44,2.93,0,2.13,3.08,3.26,6.66,3.26,3.11,0,8.97-1.11,8.97-4.92,0-2.45-1.78-4.1-4.98-4.51ZM72.9,29.66c0-2.1,1.41-4.02,4.28-4.02s4.28,1.92,4.28,4.02-1.43,4.02-4.28,4.02c-2.7,0-4.28-1.92-4.28-4.02Z"></path><path d="M151.48,39.19h.02c-1.43-.17-6.8-.07-6.8-1.13,0-.5,1.49-.84,3.52-1.39.77-.21,1.61-.51,2.54-.88-.03,0-.07.01-.11.02,2.95-.81,4.88-3.11,4.88-6.14,0-2.36-1.27-4.28-3.2-5.39.28.02.64.03,1.1.03.75,0,1.55-.07,2.41-.2l-.73-2.61c-.73.46-1.78.86-3.15,1.2-1.36.34-2.55.51-3.58.51h-.17c-4.01,0-7.31,2.66-7.31,6.46s2.92,6.35,7.08,6.45c-.11.01-.19.02-.19.02-4.51.79-5.71,1.61-5.71,3.14s2.45,1.95,4.7,2.14c3.78.33,6.57.89,6.57,2.72,0,1.68-4.56,2.18-6.42,1.97-5.03-.55-4.09-2.84-1.65-3.51l-1.01-.17c-2.27.63-3.44,1.45-3.44,2.93,0,2.13,3.08,3.26,6.66,3.26,3.11,0,8.97-1.11,8.97-4.92,0-2.45-1.78-4.1-4.98-4.51ZM143.95,29.66c0-2.1,1.41-4.02,4.28-4.02s4.28,1.92,4.28,4.02-1.43,4.02-4.28,4.02c-2.7,0-4.28-1.92-4.28-4.02Z"></path></svg><h1 class="header-title">Creating technology with a conscience</h1></div>',1);function a2(t,e,n,i,r,s){const a=Tt("Loader"),o=Tt("WebGL");return qt(),Pn("main",e2,[rt("nav",t2,i2,512),ve(a),rt("header",r2,[ve(o,{height:"100vh",mobileHeight:"100vh"}),s2],512)],512)}const o2=Yt(J0,[["render",a2]]),l2=[{path:"/",name:"Home",component:k0},{path:"/144",name:"Page144",component:Q0},{path:"/:route(.*)*",component:o2}],c2=R1({routes:l2,history:Gh()}),h2={name:"RouterRoot"};function u2(t,e,n,i,r,s){const a=Tt("RouterView");return qt(),jc(a)}const f2=Yt(h2,[["render",u2]]);window.console.log("Made with love ♥ Dorian Lods - http://www.dorianlods.com/");const Qo=Th(f2);Qo.use(c2);Qo.mount("#app");
