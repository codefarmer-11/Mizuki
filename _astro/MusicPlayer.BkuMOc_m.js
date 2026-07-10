import{i as H,a as F,e as Bt,s as A,c as Ct}from"./attributes.D63UpG25.js";import{i as Ht}from"./lifecycle.CQuC83dM.js";import{o as St,a as Tt,p as Z}from"./props.C7Yd5dVq.js";import{U as At,_ as Ft,bn as Nt,bo as Kt,T as jt,u as Xt,bp as Ot,bq as Ut,L as Wt,bm as nt,br as Et,a5 as tt,ak as pt,a0 as qt,a9 as v,e as n,ab as k,aa as g,a3 as S,a4 as et,a8 as yt,a7 as T,ad as ot,ae as $,ac as D,ai as Y,aj as z,al as vt,B as Yt,af as Gt,bs as Jt,as as Qt,w as ft}from"./branches.B-kny3v9.js";import{a as Zt,s as O}from"./render.DfHSYmSt.js";import{I as V}from"./Icon.DnnTSM6y.js";import{m as bt}from"./config.5oMH7a6q.js";import{m as C}from"./musicPlayerStore.Bvve3k1N.js";import{S as $t,a as te,b as ee,c as re,d as ie,C as ht,P as ne,e as ae,N as oe}from"./SidebarTrackInfo.DbaPATy0.js";import{I as J}from"./zh_TW.CpIQUFG1.js";import{i as Q}from"./translation.CVYtWojD.js";import{s as le}from"./snippet.LfXDSLbl.js";import{a as se}from"./actions.ZXR5A-0M.js";import{e as ue,i as ce}from"./each.CGp-spfT.js";const de=()=>performance.now(),q={tick:r=>requestAnimationFrame(r),now:()=>de(),tasks:new Set};function Mt(){const r=q.now();q.tasks.forEach(t=>{t.c(r)||(q.tasks.delete(t),t.f())}),q.tasks.size!==0&&q.tick(Mt)}function ge(r){let t;return q.tasks.size===0&&q.tick(Mt),{promise:new Promise(e=>{q.tasks.add(t={c:r,f:e})}),abort(){q.tasks.delete(t)}}}function gt(r,t){Et(()=>{r.dispatchEvent(new CustomEvent(t))})}function ve(r){if(r==="float")return"cssFloat";if(r==="offset")return"cssOffset";if(r.startsWith("--"))return r;const t=r.split("-");return t.length===1?t[0]:t[0]+t.slice(1).map(e=>e[0].toUpperCase()+e.slice(1)).join("")}function wt(r){const t={},e=r.split(";");for(const l of e){const[a,o]=l.split(":");if(!a||o===void 0)break;const m=ve(a.trim());t[m]=o.trim()}return t}const me=r=>r;function Lt(r,t,e,l){var a=(r&Ot)!==0,o="both",m,c=t.inert,x=t.style.overflow,i,u;function d(){return Et(()=>m??=e()(t,l?.()??{},{direction:o}))}var f={is_global:a,in(){t.inert=c,i=xt(t,d(),u,1,()=>{gt(t,"introstart")},()=>{gt(t,"introend"),i?.abort(),i=m=void 0,t.style.overflow=x})},out(w){t.inert=!0,u=xt(t,d(),i,0,()=>{gt(t,"outrostart")},()=>{gt(t,"outroend"),w?.()})},stop:()=>{i?.abort(),u?.abort()}},b=At;if((b.nodes.t??=[]).push(f),Zt){var p=a;if(!p){for(var s=b.parent;s&&(s.f&Ft)!==0;)for(;(s=s.parent)&&(s.f&Nt)===0;);p=!s||(s.f&Kt)!==0}p&&jt(()=>{Xt(()=>f.in())})}}function xt(r,t,e,l,a,o){var m=l===1;if(Ut(t)){var c,x=!1;return Wt(()=>{if(!x){var y=t({direction:m?"in":"out"});c=xt(r,y,e,l,a,o)}}),{abort:()=>{x=!0,c?.abort()},deactivate:()=>c.deactivate(),reset:()=>c.reset(),t:()=>c.t()}}if(e?.deactivate(),!t?.duration&&!t?.delay)return a(),o(),{abort:nt,deactivate:nt,reset:nt,t:()=>l};const{delay:i=0,css:u,tick:d,easing:f=me}=t;var b=[];if(m&&e===void 0&&(d&&d(0,1),u)){var p=wt(u(0,1));b.push(p,p)}var s=()=>1-l,w=r.animate(b,{duration:i,fill:"forwards"});return w.onfinish=()=>{w.cancel(),a();var y=e?.t()??1-l;e?.abort();var I=l-y,_=t.duration*Math.abs(I),h=[];if(_>0){var E=!1;if(u)for(var R=Math.ceil(_/16.666666666666668),rt=0;rt<=R;rt+=1){var lt=y+I*f(rt/R),st=wt(u(lt,1-lt));h.push(st),E||=st.overflow==="hidden"}E&&(r.style.overflow="hidden"),s=()=>{var it=w.currentTime;return y+I*f(it/_)},d&&ge(()=>{if(w.playState!=="running")return!1;var it=s();return d(it,1-it),!0})}w=r.animate(h,{duration:_,fill:"forwards"}),w.onfinish=()=>{s=()=>l,d?.(l,1-l),o()}},{abort:()=>{w&&(w.cancel(),w.effect=null,w.onfinish=nt)},deactivate:()=>{o=nt},reset:()=>{l===0&&d?.(1,0)},t:()=>s()}}function fe(r){const t=r-1;return t*t*t+1}function It(r){const t=r-1;return t*t*t+1}function kt(r){const t=typeof r=="string"&&r.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/);return t?[parseFloat(t[1]),t[2]||"px"]:[r,"px"]}function be(r,{delay:t=0,duration:e=400,easing:l=It,x:a=0,y:o=0,opacity:m=0}={}){const c=getComputedStyle(r),x=+c.opacity,i=c.transform==="none"?"":c.transform,u=x*(1-m),[d,f]=kt(a),[b,p]=kt(o);return{delay:t,duration:e,easing:l,css:(s,w)=>`
			transform: ${i} translate(${(1-s)*d}${f}, ${(1-s)*b}${p});
			opacity: ${x-u*w}`}}function ye(r,{delay:t=0,duration:e=400,easing:l=It,axis:a="y"}={}){const o=getComputedStyle(r),m=+o.opacity,c=a==="y"?"height":"width",x=parseFloat(o[c]),i=a==="y"?["top","bottom"]:["left","right"],u=i.map(y=>`${y[0].toUpperCase()}${y.slice(1)}`),d=parseFloat(o[`padding${u[0]}`]),f=parseFloat(o[`padding${u[1]}`]),b=parseFloat(o[`margin${u[0]}`]),p=parseFloat(o[`margin${u[1]}`]),s=parseFloat(o[`border${u[0]}Width`]),w=parseFloat(o[`border${u[1]}Width`]);return{delay:t,duration:e,easing:l,css:y=>`overflow: hidden;opacity: ${Math.min(y*20,1)*m};${c}: ${y*x}px;padding-${i[0]}: ${y*d}px;padding-${i[1]}: ${y*f}px;margin-${i[0]}: ${y*b}px;margin-${i[1]}: ${y*p}px;border-${i[0]}-width: ${y*s}px;border-${i[1]}-width: ${y*w}px;min-${c}: 0`}}var he=T('<div class="fab-music-panel card-base shadow-xl rounded-2xl p-4 w-[20rem] max-w-[80vw] svelte-1lty5dg"><div class="fab-music-header svelte-1lty5dg"><!> <!></div> <!> <!> <!></div>');function xe(r,t){tt(t,!0);let e=pt(qt(C.getState())),l=pt(!1);function a(E){const R=E;R.detail&&yt(e,R.detail,!0)}St(()=>{window.addEventListener("music-sidebar:state",a)}),Tt(()=>{typeof window<"u"&&window.removeEventListener("music-sidebar:state",a)});function o(){C.toggle()}function m(){C.prev()}function c(){C.next()}function x(){C.toggleMode()}function i(){yt(l,!n(l))}function u(E){C.playIndex(E)}function d(E){C.seek(E)}function f(){C.toggleMute()}function b(E){C.setVolume(E)}var p=he(),s=v(p),w=v(s);$t(w,{get currentSong(){return n(e).currentSong},get isPlaying(){return n(e).isPlaying},get isLoading(){return n(e).isLoading}});var y=k(w,2);te(y,{get currentSong(){return n(e).currentSong},get currentTime(){return n(e).currentTime},get duration(){return n(e).duration},get volume(){return n(e).volume},get isMuted(){return n(e).isMuted},onToggleMute:f,onSetVolume:b}),g(s);var I=k(s,2);ee(I,{get currentTime(){return n(e).currentTime},get duration(){return n(e).duration},onSeek:d});var _=k(I,2);re(_,{get isPlaying(){return n(e).isPlaying},get isShuffled(){return n(e).isShuffled},get repeatMode(){return n(e).isRepeating},onToggleMode:x,onPrev:m,onNext:c,onTogglePlay:o,onTogglePlaylist:i});var h=k(_,2);ie(h,{get playlist(){return n(e).playlist},get currentIndex(){return n(e).currentIndex},get isPlaying(){return n(e).isPlaying},get show(){return n(l)},onClose:i,onPlaySong:u}),g(p),S(r,p),et()}var pe=T('<div class="flex-1 min-w-0"><div class="text-sm font-medium text-90 truncate"> </div> <div class="text-xs text-50 truncate"> </div></div>'),we=T('<div class="text-xs text-30 mt-1"> </div>'),ke=T('<div class="flex-1 min-w-0"><div class="song-title text-lg font-bold text-90 truncate mb-1"> </div> <div class="song-artist text-sm text-50 truncate"> </div> <!></div>');function _t(r,t){tt(t,!0);const e=Z(t,"showTime",3,!1),l=Z(t,"size",3,"mini");function a(i){if(!Number.isFinite(i)||i<0)return"0:00";const u=Math.floor(i/60),d=Math.floor(i%60);return`${u}:${d.toString().padStart(2,"0")}`}var o=ot(),m=$(o);{var c=i=>{var u=pe(),d=v(u),f=v(d,!0);g(d);var b=k(d,2),p=v(b,!0);g(b),g(u),D(()=>{O(f,t.song.title),O(p,t.song.artist)}),S(i,u)},x=i=>{var u=ke(),d=v(u),f=v(d,!0);g(d);var b=k(d,2),p=v(b,!0);g(b);var s=k(b,2);{var w=y=>{var I=we(),_=v(I);g(I),D((h,E)=>O(_,`${h??""} / ${E??""}`),[()=>a(t.currentTime),()=>a(t.duration)]),S(y,I)};H(s,y=>{e()&&y(w)})}g(u),D(()=>{O(f,t.song.title),O(p,t.song.artist)}),S(i,u)};H(m,i=>{l()==="mini"?i(c):i(x,-1)})}S(r,o),et()}var _e=T('<!> <div class="flex-1 min-w-0 cursor-pointer" role="button" tabindex="0"><!></div> <div class="flex items-center gap-1"><button class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"><!></button> <button class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"><!></button></div>',1),Pe=T('<div class="flex items-center gap-1"><button class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"><!></button> <button><!></button></div>'),Ce=T("<!> <!> <!>",1),Se=T("<div><!></div>");function zt(r,t){tt(t,!0);const e=Z(t,"size",3,"mini"),l=Z(t,"showControls",3,!1),a=Z(t,"showPlaylist",3,!1);var o=Se(),m=v(o);{var c=i=>{var u=_e(),d=$(u);ht(d,{get cover(){return t.song.cover},get isPlaying(){return t.isPlaying},get isLoading(){return t.isLoading},size:"mini",interactive:!0,get onclick(){return t.onCoverClick}});var f=k(d,2),b=v(f);_t(b,{get song(){return t.song},get currentTime(){return t.currentTime},get duration(){return t.duration},size:"mini"}),g(f);var p=k(f,2),s=v(p),w=v(s);V(w,{icon:"material-symbols:visibility-off",class:"text-lg"}),g(s);var y=k(s,2),I=v(y);V(I,{icon:"material-symbols:expand-less",class:"text-lg"}),g(y),g(p),D((_,h)=>{A(f,"aria-label",_),A(s,"title",h)},[()=>Q(J.musicPlayerExpand),()=>Q(J.musicPlayerHide)]),z("click",f,function(..._){t.onInfoClick?.apply(this,_)}),z("keydown",f,_=>{(_.key==="Enter"||_.key===" ")&&(_.preventDefault(),t.onInfoClick?.())}),z("click",s,_=>{_.stopPropagation(),t.onHideClick?.()}),z("click",y,_=>{_.stopPropagation(),t.onExpandClick?.()}),S(i,u)},x=i=>{var u=Ce(),d=$(u);ht(d,{get cover(){return t.song.cover},get isPlaying(){return t.isPlaying},get isLoading(){return t.isLoading},size:"expanded"});var f=k(d,2);_t(f,{get song(){return t.song},get currentTime(){return t.currentTime},get duration(){return t.duration},showTime:!0,size:"expanded"});var b=k(f,2);{var p=s=>{var w=Pe(),y=v(w),I=v(y);V(I,{icon:"material-symbols:visibility-off",class:"text-lg"}),g(y);var _=k(y,2);let h;var E=v(_);V(E,{icon:"material-symbols:queue-music",class:"text-lg"}),g(_),g(w),D((R,rt)=>{A(y,"title",R),h=F(_,1,"btn-plain w-8 h-8 rounded-lg flex items-center justify-center",null,h,{"text-[var(--primary)]":a()}),A(_,"title",rt)},[()=>Q(J.musicPlayerHide),()=>Q(J.musicPlayerPlaylist)]),z("click",y,function(...R){t.onHideClick?.apply(this,R)}),z("click",_,function(...R){t.onPlaylistClick?.apply(this,R)}),S(s,w)};H(b,s=>{l()&&s(p)})}S(i,u)};H(m,i=>{e()==="mini"?i(c):i(x,-1)})}g(o),D(()=>F(o,1,Bt(e()==="mini"?"flex items-center gap-3 mb-0":"flex items-center gap-4 mb-4"))),S(r,o),et()}Y(["click","keydown"]);var Te=T("<div><!></div>");function Ee(r,t){var e=Te();let l;var a=v(e);zt(a,{get song(){return t.song},get currentTime(){return t.currentTime},get duration(){return t.duration},get isPlaying(){return t.isPlaying},get isLoading(){return t.isLoading},size:"mini",get onCoverClick(){return t.onCoverClick},get onInfoClick(){return t.onInfoClick},get onHideClick(){return t.onHideClick},get onExpandClick(){return t.onExpandClick}}),g(e),D(()=>l=F(e,1,"mini-player card-base shadow-xl rounded-2xl p-3 absolute bottom-0 right-0 w-[17.5rem] svelte-g9ac72",null,l,{"mini-enter":!t.isHidden,"mini-leave":t.isHidden,"pointer-events-none":t.isHidden})),S(r,e)}var Me=T("<button><!></button>"),Le=T("<button><!></button>");function Pt(r,t){const e=Z(t,"repeatMode",3,0),l=Z(t,"disabled",3,!1);var a=ot(),o=$(a);{var m=x=>{var i=Me();let u;var d=v(i);V(d,{icon:"material-symbols:shuffle",class:"text-lg"}),g(i),D(()=>{u=F(i,1,"w-10 h-10 rounded-lg",null,u,{"btn-regular":t.isActive,"btn-plain":!t.isActive}),i.disabled=l()}),z("click",i,function(...f){t.onclick?.apply(this,f)}),S(x,i)},c=x=>{var i=Le();let u;var d=v(i);{var f=s=>{V(s,{icon:"material-symbols:repeat-one",class:"text-lg"})},b=s=>{V(s,{icon:"material-symbols:repeat",class:"text-lg"})},p=s=>{V(s,{icon:"material-symbols:repeat",class:"text-lg opacity-50"})};H(d,s=>{e()===1?s(f):e()===2?s(b,1):s(p,-1)})}g(i),D(()=>u=F(i,1,"w-10 h-10 rounded-lg",null,u,{"btn-regular":t.isActive,"btn-plain":!t.isActive})),z("click",i,function(...s){t.onclick?.apply(this,s)}),S(x,i)};H(o,x=>{t.mode==="shuffle"?x(m):x(c,-1)})}S(r,a)}Y(["click"]);var Ie=T('<div class="controls flex items-center justify-center gap-2 mb-4"><!> <!> <!> <!> <!></div>');function ze(r,t){var e=Ie(),l=v(e);Pt(l,{mode:"shuffle",get isActive(){return t.isShuffled},get onclick(){return t.onShuffleClick}});var a=k(l,2);ne(a,{get onclick(){return t.onPrevClick},disabled:!1});var o=k(a,2);ae(o,{get isPlaying(){return t.isPlaying},get isLoading(){return t.isLoading},get onclick(){return t.onPlayClick}});var m=k(o,2);oe(m,{get onclick(){return t.onNextClick},disabled:!1});var c=k(m,2);{let x=vt(()=>t.isRepeating>0);Pt(c,{mode:"repeat",get isActive(){return n(x)},get repeatMode(){return t.isRepeating},get onclick(){return t.onRepeatClick}})}g(e),S(r,e)}var De=T('<div class="progress-bar flex-1 h-2 bg-[var(--btn-regular-bg)] rounded-full cursor-pointer" role="slider" tabindex="0" aria-valuemin="0" aria-valuemax="100"><div class="h-full bg-[var(--primary)] rounded-full transition-all duration-100"></div></div>');function Re(r,t){tt(t,!0);var e=De(),l=v(e);g(e),D(a=>{A(e,"aria-label",a),A(e,"aria-valuenow",t.duration>0?t.currentTime/t.duration*100:0),Ct(l,`width: ${t.duration>0?t.currentTime/t.duration*100:0}%`)},[()=>Q(J.musicPlayerProgress)]),z("click",e,function(...a){t.onclick?.apply(this,a)}),z("keydown",e,function(...a){t.onkeydown?.apply(this,a)}),S(r,e),et()}Y(["click","keydown"]);var Ve=T('<div class="progress-section mb-4"><!></div>');function Be(r,t){var e=Ve(),l=v(e);Re(l,{get currentTime(){return t.currentTime},get duration(){return t.duration},get onclick(){return t.onProgressClick},get onkeydown(){return t.onProgressKeyDown}}),g(e),S(r,e)}var He=T('<button class="btn-plain w-8 h-8 rounded-lg"><!></button>');function Ae(r,t){var e=He(),l=v(e);{var a=c=>{V(c,{icon:"material-symbols:volume-off",class:"text-lg"})},o=c=>{V(c,{icon:"material-symbols:volume-down",class:"text-lg"})},m=c=>{V(c,{icon:"material-symbols:volume-up",class:"text-lg"})};H(l,c=>{t.isMuted||t.volume===0?c(a):t.volume<.5?c(o,1):c(m,-1)})}g(e),z("click",e,function(...c){t.onclick?.apply(this,c)}),S(r,e)}Y(["click"]);var Fe=T('<div class="flex-1 h-2 bg-[var(--btn-regular-bg)] rounded-full cursor-pointer touch-none" role="slider" tabindex="0" aria-valuemin="0" aria-valuemax="100"><div></div></div>');function Ne(r,t){var e=Fe(),l=v(e);let a;g(e),se(e,o=>t.volumeBarRef?.(o)),D(()=>{A(e,"aria-label",t.ariaLabel),A(e,"aria-valuenow",t.volume*100),a=F(l,1,"h-full bg-[var(--primary)] rounded-full transition-all",null,a,{"duration-100":!t.isVolumeDragging,"duration-0":t.isVolumeDragging}),Ct(l,`width: ${t.volume*100}%`)}),z("pointerdown",e,function(...o){t.onpointerdown?.apply(this,o)}),z("keydown",e,function(...o){t.onkeydown?.apply(this,o)}),S(r,e)}Y(["pointerdown","keydown"]);var Ke=T('<div class="bottom-controls flex items-center gap-2"><!> <!> <!></div>');function je(r,t){var e=Ke(),l=v(e);Ae(l,{get volume(){return t.volume},get isMuted(){return t.isMuted},get onclick(){return t.onVolumeButtonClick}});var a=k(l,2);{let m=vt(()=>t.isMuted?0:t.volume);Ne(a,{get volume(){return n(m)},get isVolumeDragging(){return t.isVolumeDragging},get volumeBarRef(){return t.volumeBarRef},get onpointerdown(){return t.onSliderPointerDown},get onkeydown(){return t.onSliderKeyDown},get ariaLabel(){return t.ariaLabel}})}var o=k(a,2);le(o,()=>t.children??nt),g(e),S(r,e)}var Xe=T('<button class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"><!></button>'),Oe=T("<div><!> <!> <!> <!></div>");function Ue(r,t){tt(t,!0);var e=Oe();let l;var a=v(e);zt(a,{get song(){return t.song},get currentTime(){return t.currentTime},get duration(){return t.duration},get isPlaying(){return t.isPlaying},get isLoading(){return t.isLoading},size:"expanded",showControls:!0,get showPlaylist(){return t.showPlaylist},get onHideClick(){return t.onHideClick},get onPlaylistClick(){return t.onPlaylistClick}});var o=k(a,2);Be(o,{get currentTime(){return t.currentTime},get duration(){return t.duration},get onProgressClick(){return t.onProgressClick},get onProgressKeyDown(){return t.onProgressKeyDown}});var m=k(o,2);ze(m,{get isPlaying(){return t.isPlaying},get isLoading(){return t.isLoading},get isShuffled(){return t.isShuffled},get isRepeating(){return t.isRepeating},get onPlayClick(){return t.onPlayClick},get onPrevClick(){return t.onPrevClick},get onNextClick(){return t.onNextClick},get onShuffleClick(){return t.onShuffleClick},get onRepeatClick(){return t.onRepeatClick}});var c=k(m,2);{let x=vt(()=>Q(J.musicPlayerVolume));je(c,{get volume(){return t.volume},get isMuted(){return t.isMuted},get isVolumeDragging(){return t.isVolumeDragging},get volumeBarRef(){return t.volumeBarRef},get onVolumeButtonClick(){return t.onVolumeButtonClick},get onSliderPointerDown(){return t.onSliderPointerDown},get onSliderKeyDown(){return t.onSliderKeyDown},get ariaLabel(){return n(x)},children:(i,u)=>{var d=Xe(),f=v(d);V(f,{icon:"material-symbols:expand-more",class:"text-lg"}),g(d),D(b=>A(d,"title",b),[()=>Q(J.musicPlayerCollapse)]),z("click",d,function(...b){t.onCollapseClick?.apply(this,b)}),S(i,d)}})}g(e),D(()=>l=F(e,1,"expanded-player card-base shadow-xl rounded-2xl p-4 transition-all duration-500 ease-in-out absolute bottom-0 right-0 w-80",null,l,{"opacity-0":t.isHidden,"scale-95":t.isHidden,"pointer-events-none":t.isHidden})),S(r,e),et()}Y(["click"]);var We=T('<span class="text-sm text-[var(--content-meta)]"> </span>'),qe=T('<div role="button" tabindex="0"><div class="w-6 h-6 flex items-center justify-center"><!></div> <div class="w-10 h-10 rounded-lg overflow-hidden bg-[var(--btn-regular-bg)] flex-shrink-0"><img decoding="async" class="w-full h-full object-cover"/></div> <div class="flex-1 min-w-0"><div> </div> <div> </div></div></div>');function Ye(r,t){tt(t,!0);const e=Z(t,"lazy",3,!0);function l(h){return h.startsWith("http://")||h.startsWith("https://")||h.startsWith("/")?h:`/${h}`}var a=qe();let o;var m=v(a),c=v(m);{var x=h=>{V(h,{icon:"material-symbols:graphic-eq",class:"text-[var(--primary)] animate-pulse"})},i=h=>{V(h,{icon:"material-symbols:pause",class:"text-[var(--primary)]"})},u=h=>{var E=We(),R=v(E,!0);g(E),D(()=>O(R,t.index+1)),S(h,E)};H(c,h=>{t.isCurrent&&t.isPlaying?h(x):t.isCurrent?h(i,1):h(u,-1)})}g(m);var d=k(m,2),f=v(d);g(d);var b=k(d,2),p=v(b);let s;var w=v(p,!0);g(p);var y=k(p,2);let I;var _=v(y,!0);g(y),g(b),g(a),D(h=>{o=F(a,1,"playlist-item flex items-center gap-3 p-3 hover:bg-[var(--btn-plain-bg-hover)] cursor-pointer transition-colors",null,o,{"bg-[var(--btn-plain-bg)]":t.isCurrent,"text-[var(--primary)]":t.isCurrent}),A(a,"aria-label",`播放 ${t.song.title??""} - ${t.song.artist??""}`),A(f,"src",h),A(f,"alt",t.song.title),A(f,"loading",e()?"lazy":"eager"),s=F(p,1,"font-medium truncate",null,s,{"text-[var(--primary)]":t.isCurrent,"text-90":!t.isCurrent}),O(w,t.song.title),I=F(y,1,"text-sm text-[var(--content-meta)] truncate",null,I,{"text-[var(--primary)]":t.isCurrent}),O(_,t.song.artist)},[()=>l(t.song.cover)]),z("click",a,function(...h){t.onclick?.apply(this,h)}),z("keydown",a,h=>{(h.key==="Enter"||h.key===" ")&&(h.preventDefault(),t.onclick())}),S(r,a),et()}Y(["click","keydown"]);var Ge=T('<div class="playlist-panel card-base-transparent fixed bottom-70 right-4 w-80 max-h-96 overflow-hidden z-50 svelte-1v267om"><div class="playlist-header flex items-center justify-between p-4 border-b border-[var(--line-divider)]"><h3 class="text-lg font-semibold text-90"> </h3> <button class="btn-plain w-8 h-8 rounded-lg"><!></button></div> <div class="playlist-content overflow-y-auto max-h-80 hide-scrollbar" role="presentation"></div></div>');function Je(r,t){tt(t,!0);var e=ot(),l=$(e);{var a=o=>{var m=Ge(),c=v(m),x=v(c),i=v(x,!0);g(x);var u=k(x,2),d=v(u);V(d,{icon:"material-symbols:close",class:"text-lg"}),g(u),g(c);var f=k(c,2);ue(f,21,()=>t.playlist,ce,(b,p,s)=>{{let w=vt(()=>s===t.currentIndex);Ye(b,{get song(){return n(p)},index:s,get isCurrent(){return n(w)},get isPlaying(){return t.isPlaying},onclick:()=>t.onPlaySong(s),lazy:s!==0})}}),g(f),g(m),D(b=>O(i,b),[()=>Q(J.musicPlayerPlaylist)]),z("click",u,function(...b){t.onClose?.apply(this,b)}),Lt(3,m,()=>ye,()=>({duration:300,axis:"y"})),S(o,m)};H(l,o=>{t.show&&o(a)})}S(r,e),et()}Y(["click"]);var Qe=T('<div class="fixed bottom-20 right-4 z-[60] max-w-sm"><div class="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-up"><!> <span class="text-sm flex-1"> </span> <button class="text-white/80 hover:text-white transition-colors"><!></button></div></div>'),Ze=T('<div class="music-player-fab-anchor fixed z-[55]"><div class="music-player-fab-shell"><!></div></div>'),$e=T("<div><div><!></div> <!> <!> <!></div>"),tr=T(`<!> <!> <style>.music-player-fab-anchor {
			right: var(--fab-group-right, 1.5rem);
			bottom: calc(
				var(--fab-group-bottom, 10rem) +
					(
						var(--fab-button-size, 3rem) *
							var(--fab-visible-count, 1)
					) +
					(
						var(--fab-group-gap, 0.5rem) *
							(var(--fab-visible-count, 1) - 1)
					)
			);
			width: 0;
			height: 0;
			pointer-events: none;
		}

		.music-player-fab-shell {
			position: absolute;
			right: 0;
			bottom: 0.75rem;
			transform-origin: bottom right;
			pointer-events: auto;
			will-change: transform, opacity;
		}

		.orb-player-container {
			position: absolute;
			bottom: 0;
			right: 0;
		}

		.orb-enter {
			animation: orbElasticIn 460ms cubic-bezier(0.22, 1.25, 0.36, 1)
				forwards;
		}

		.orb-leave {
			animation: orbElasticOut 360ms cubic-bezier(0.4, 0, 1, 1) forwards;
		}

		@keyframes orbElasticIn {
			0% {
				opacity: 0;
				transform: translateX(0) scale(0.55);
			}
			70% {
				opacity: 1;
				transform: translateX(0) scale(1.12);
			}
			100% {
				opacity: 1;
				transform: translateX(0) scale(1);
			}
		}

		@keyframes orbElasticOut {
			0% {
				opacity: 1;
				transform: translateX(0) scale(1);
			}
			100% {
				opacity: 0;
				transform: translateX(0) scale(0.6);
			}
		}

		.music-player.hidden-mode {
			width: 3rem;
			height: 3rem;
		}

		.music-player {
			width: 20rem;
			max-width: 20rem;
			min-width: 20rem;
			user-select: none;
		}

		:global(.mini-player) {
			position: absolute;
			bottom: 0;
			right: 0;
		}

		:global(.expanded-player) {
			position: absolute;
			bottom: 0;
			right: 0;
		}

		:global(.orb-player) {
			position: relative;
			backdrop-filter: blur(10px);
			-webkit-backdrop-filter: blur(10px);
		}

		:global(.orb-player::before) {
			content: "";
			position: absolute;
			inset: -0.125rem;
			background: linear-gradient(
				45deg,
				var(--primary),
				transparent,
				var(--primary)
			);
			border-radius: 50%;
			z-index: -1;
			opacity: 0;
			transition: opacity 0.3s ease;
		}

		:global(.orb-player:hover::before) {
			opacity: 0.3;
			animation: rotate 2s linear infinite;
		}

		:global(.orb-player .animate-pulse) {
			animation: musicWave 1.5s ease-in-out infinite;
		}

		@keyframes rotate {
			from {
				transform: rotate(0deg);
			}
			to {
				transform: rotate(360deg);
			}
		}

		@keyframes musicWave {
			0%,
			100% {
				transform: scaleY(0.5);
			}
			50% {
				transform: scaleY(1);
			}
		}

		:global(.animate-pulse) {
			animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
		}

		@keyframes pulse {
			0%,
			100% {
				opacity: 1;
			}
			50% {
				opacity: 0.5;
			}
		}

		:global(.progress-section div:hover),
		:global(.bottom-controls > div:hover) {
			transform: scaleY(1.2);
			transition: transform 0.2s ease;
		}

		@media (max-width: 768px) {
			.music-player-fab-anchor {
				right: var(--fab-group-right, 0.75rem) !important;
				bottom: calc(
					var(--fab-group-bottom, 5rem) +
						(
							var(--fab-button-size, 2.75rem) *
								var(--fab-visible-count, 1)
						) +
						(
							var(--fab-group-gap, 0.5rem) *
								(var(--fab-visible-count, 1) - 1)
						)
				) !important;
			}

			.music-player-fab-shell {
				right: 0 !important;
				bottom: 0.75rem !important;
			}

			.music-player {
				width: 280px !important;
				min-width: 280px !important;
				max-width: 280px !important;
				bottom: 0.5rem !important;
				right: 0.5rem !important;
			}
			:global(.mini-player) {
				width: 280px !important;
			}
			:global(.expanded-player) {
				width: 280px !important;
				max-width: 280px !important;
			}
			.music-player.expanded {
				width: 280px !important;
				min-width: 280px !important;
				max-width: 280px !important;
				right: 0.5rem !important;
			}
			:global(.playlist-panel) {
				width: 280px !important;
				right: 0.5rem !important;
				max-width: 280px !important;
			}
			:global(.controls) {
				gap: 8px;
			}
			:global(.controls button) {
				width: 36px;
				height: 36px;
			}
			:global(.controls button:nth-child(3)) {
				width: 44px;
				height: 44px;
			}
		}

		@media (max-width: 480px) {
			.music-player-fab-anchor {
				right: var(--fab-group-right, 0.5rem) !important;
				bottom: calc(
					var(--fab-group-bottom, 4.5rem) +
						(
							var(--fab-button-size, 2.5rem) *
								var(--fab-visible-count, 1)
						) +
						(
							var(--fab-group-gap, 0.5rem) *
								(var(--fab-visible-count, 1) - 1)
						)
				) !important;
			}

			.music-player-fab-shell {
				right: 0 !important;
				bottom: 0.75rem !important;
			}

			.music-player {
				width: 260px !important;
				min-width: 260px !important;
				max-width: 260px !important;
			}
			:global(.expanded-player) {
				width: 260px !important;
				max-width: 260px !important;
			}
			:global(.playlist-panel) {
				width: 260px !important;
				max-width: 260px !important;
				right: 0.5rem !important;
			}
			:global(.song-title) {
				font-size: 14px;
			}
			:global(.song-artist) {
				font-size: 12px;
			}
			:global(.controls) {
				gap: 6px;
				margin-bottom: 12px;
			}
			:global(.controls button) {
				width: 32px;
				height: 32px;
			}
			:global(.controls button:nth-child(3)) {
				width: 40px;
				height: 40px;
			}
			:global(.playlist-item) {
				padding: 8px 12px;
			}
			:global(.playlist-item .w-10) {
				width: 32px;
				height: 32px;
			}
		}

		@keyframes slide-up {
			from {
				transform: translateY(100%);
				opacity: 0;
			}
			to {
				transform: translateY(0);
				opacity: 1;
			}
		}

		.animate-slide-up {
			animation: slide-up 0.3s ease-out;
		}

		@media (hover: none) and (pointer: coarse) {
			:global(.music-player button),
			:global(.playlist-item) {
				min-height: 44px;
			}
			:global(.progress-section > div),
			:global(.bottom-controls > div:nth-child(2)) {
				height: 12px;
			}
		}

		@keyframes spin-continuous {
			from {
				transform: rotate(0deg);
			}
			to {
				transform: rotate(360deg);
			}
		}

		:global(.cover-container img) {
			animation: spin-continuous 3s linear infinite;
			animation-play-state: paused;
		}

		:global(.cover-container img.spinning) {
			animation-play-state: running;
		}

		:global(button.bg-\\\\[var\\\\(--primary\\\\)\\\\]) {
			box-shadow: 0 0 0 2px var(--primary);
			border: none;
		}</style>`,1);function fr(r,t){tt(t,!1);let e=Yt(C.getState());const l=bt.showFloatingPlayer,o=(bt.floatingEntryMode??"default")==="fab",m=l&&bt.enable;let c;function x(){C.toggle()}function i(){C.prev()}function u(){C.next()}function d(){C.toggleShuffle()}function f(){C.toggleRepeat()}function b(P){C.playIndex(P)}function p(P){const M=P.currentTarget;if(!M)return;const U=M.getBoundingClientRect(),j=(P.clientX-U.left)/U.width;C.setProgress(j)}function s(P){(P.key==="Enter"||P.key===" ")&&(P.preventDefault(),C.setProgress(.5))}function w(){C.toggleMute()}function y(){C.toggleMute()}function I(P){const M=P.currentTarget;if(!M)return;const U=L=>{const N=M.getBoundingClientRect();if(N.width<=0)return;const K=Math.max(0,Math.min(1,(L-N.left)/N.width));C.setVolume(K)};U(P.clientX);const j=P.pointerId;M.setPointerCapture(j);const ut=L=>{L.pointerId===j&&U(L.clientX)},ct=()=>{M.removeEventListener("pointermove",ut),M.removeEventListener("pointerup",dt),M.removeEventListener("pointercancel",B),M.hasPointerCapture(j)&&M.releasePointerCapture(j)},dt=L=>{L.pointerId===j&&(U(L.clientX),ct())},B=L=>{L.pointerId===j&&ct()};M.addEventListener("pointermove",ut),M.addEventListener("pointerup",dt),M.addEventListener("pointercancel",B)}function _(P){const M=P.target;if(!(M?.tagName==="INPUT"||M?.tagName==="TEXTAREA"||M?.contentEditable==="true")){if(P.key==="ArrowLeft"||P.key==="ArrowDown"){P.preventDefault(),C.setVolume(n(e).volume-.05);return}if(P.key==="ArrowRight"||P.key==="ArrowUp"){P.preventDefault(),C.setVolume(n(e).volume+.05);return}(P.key==="Enter"||P.key===" "||P.key==="m"||P.key==="M")&&(P.preventDefault(),w())}}function h(){C.togglePlaylist()}function E(){C.toggleExpanded()}function R(){C.toggleHidden()}function rt(){C.hideError()}function lt(P){}function st(){return C.canSkip()}St(()=>{c=C.subscribe(P=>{yt(e,P)}),C.initialize()}),Tt(()=>{c&&c(),C.destroy()}),Ht();var it=ot();Gt("keydown",Jt,_);var Dt=$(it);{var Rt=P=>{var M=tr(),U=$(M);{var j=B=>{var L=Qe(),N=v(L),K=v(N);V(K,{icon:"material-symbols:error",class:"text-xl flex-shrink-0"});var W=k(K,2),G=v(W,!0);g(W);var X=k(W,2),at=v(X);V(at,{icon:"material-symbols:close",class:"text-lg"}),g(X),g(N),g(L),D(()=>O(G,n(e).errorMessage)),z("click",X,rt),S(B,L)};H(U,B=>{n(e).showError&&B(j)})}var ut=k(U,2);{var ct=B=>{var L=ot(),N=$(L);{var K=W=>{var G=Ze(),X=v(G),at=v(X);xe(at,{}),g(X),g(G),Lt(3,X,()=>be,()=>({y:16,duration:280,opacity:.12,easing:fe})),S(W,G)};H(N,W=>{n(e).isExpanded&&W(K)})}S(B,L)},dt=B=>{var L=$e();let N;var K=v(L),W=v(K);ht(W,{get cover(){return n(e).currentSong.cover},get isPlaying(){return n(e).isPlaying},get isLoading(){return n(e).isLoading},size:"orb",onclick:R}),g(K);var G=k(K,2);{let mt=ft(()=>n(e).isExpanded||n(e).isHidden);Ee(G,{get song(){return n(e).currentSong},get currentTime(){return n(e).currentTime},get duration(){return n(e).duration},get isPlaying(){return n(e).isPlaying},get isLoading(){return n(e).isLoading},get isHidden(){return n(mt)},onCoverClick:x,onInfoClick:E,onHideClick:R,onExpandClick:E})}var X=k(G,2);{let mt=ft(st),Vt=ft(()=>!n(e).isExpanded);Ue(X,{get song(){return n(e).currentSong},get currentTime(){return n(e).currentTime},get duration(){return n(e).duration},get isPlaying(){return n(e).isPlaying},get isLoading(){return n(e).isLoading},get isShuffled(){return n(e).isShuffled},get isRepeating(){return n(e).isRepeating},get showPlaylist(){return n(e).showPlaylist},get canSkip(){return n(mt)},get volume(){return n(e).volume},get isMuted(){return n(e).isMuted},isVolumeDragging:!1,get isHidden(){return n(Vt)},volumeBarRef:lt,onPlayClick:x,onPrevClick:i,onNextClick:()=>u(),onShuffleClick:d,onRepeatClick:f,onProgressClick:p,onProgressKeyDown:s,onVolumeButtonClick:y,onSliderPointerDown:I,onSliderKeyDown:_,onHideClick:R,onPlaylistClick:h,onCollapseClick:E})}var at=k(X,2);Je(at,{get playlist(){return n(e).playlist},get currentIndex(){return n(e).currentIndex},get isPlaying(){return n(e).isPlaying},get show(){return n(e).showPlaylist},onClose:h,onPlaySong:b}),g(L),D(()=>{N=F(L,1,"music-player fixed bottom-4 right-4 z-50 transition-all duration-300 ease-in-out",null,N,{expanded:n(e).isExpanded,"hidden-mode":n(e).isHidden}),F(K,1,`orb-player-container ${n(e).isHidden?"orb-enter pointer-events-auto":"orb-leave pointer-events-none"}`)}),S(B,L)};H(ut,B=>{o?B(ct):B(dt,-1)})}Qt(2),S(P,M)};H(Dt,P=>{m&&P(Rt)})}S(r,it),et()}Y(["click"]);export{fr as default};
