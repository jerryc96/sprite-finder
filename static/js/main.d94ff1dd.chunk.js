(window.webpackJsonp=window.webpackJsonp||[]).push([[0],[function(t,e,n){t.exports=n(1)},function(t,e,n){"use strict";n.r(e);var a={spriteFinder:function(){var t,e,n,a=[],r={};function i(t,e,n){for(var a in n){var r=n[a];if(t>=r.x&&t<=r.x+r.width&&e>=r.y&&e<=r.y+r.height)return r}return null}function o(t,e){for(var n=function(t,e,n,a){return{x:t,y:e,width:n,height:a}}(t,e,1,1),a=h(n),r=u(n);d(a,r);){for(var i=0;i<4;i++)r[i]||a[i]||s(n,i);a=h(n),r=u(n)}return function(t){t.width>1&&(t.width-=1);t.height>1&&(t.height-=1)}(n),n}function h(t){return[0===t.x,t.x+t.width===e.width,0===t.y,t.y+t.height===e.height]}function u(e){var n=t.getImageData(e.x-1,e.y,1,e.height).data,a=t.getImageData(e.x+e.width-1,e.y,1,e.height).data,r=t.getImageData(e.x,e.y-1,e.width,1).data,i=t.getImageData(e.x,e.y+e.height-1,e.width,1).data;return[g(n),g(a),g(r),g(i)]}function g(t){for(var e=0;e<t.length;e+=4){var a=[t[e],t[e+1],t[e+2],t[e+3]];if(!r.pixelsEqual(a,n))return!1}return!0}function d(t,e){for(var n=0;n<4;n++)if(!t[n]&&!e[n])return!0;return!1}function s(t,e){switch(e){case 0:t.x-=1,t.width+=1;break;case 1:t.width+=1;break;case 2:t.y-=1,t.height+=1;break;case 3:t.height+=1}}return r.setCanvas=function(n,r,i){e=n,t=r,i,function(t){for(var e=0;e<t.length;e+=4){var n=[t[e],t[e+1],t[e+2],t[e+3]];a.push(n)}}(i.data)},r.comparePixels=function(t,e){return t[0]*Math.pow(100,3)+t[1]*Math.pow(100,2)+100*t[2]+t[3]-(e[0]*Math.pow(100,3)+e[1]*Math.pow(100,2)+100*e[2]+e[3])},r.pixelsEqual=function(t,e){if(0===t[3]&&0===e[3])return!0;for(var n=0;n<4;n++)if(t[n]!==e[n])return!1;return!0},r.getPixelArr=function(){return a},r.setBackgroundCol=function(){for(var t,e=1,i=1,o=a.sort(function(t,e){return r.comparePixels(t,e)}),h=1;h<o.length;h++)r.pixelsEqual(o[h],o[h-1])?i+=1:(i>e&&(e=i,t=o[h-1]),i=1);i>e&&(e=i,t=o[o.length-1]),console.log(t),n=t},r.getBackgroundCol=function(){return n},r.getCanvas=function(){return e},r.findBoxes=function(){for(var e=[],a=r.getCanvas(),h=a.height,u=a.width,g=0;g<h;){for(var d=0;d<u;){var s=t.getImageData(d,g,1,1).data;if(r.pixelsEqual(s,n))d+=1;else{var c=i(d,g,e);null===c?(c=o(d,g),e.push(c),d+=1):d+=c.width}}g+=1}return e},r}()};document.getElementById("imageLoader").addEventListener("change",function(t){var e=new FileReader;e.onload=function(t){var e=new Image;e.src=t.target.result,e.onload=function(){r.width=e.width,r.height=e.height,i.drawImage(e,0,0);var t=i.getImageData(0,0,r.width,r.height);t.data;a.setCanvas(r,i,t),a.setBackgroundCol();var n=a.findBoxes(),h=JSON.stringify(n);for(var u in console.log(h),n){for(var g=n[u],d=i.getImageData(g.x,g.y,g.width,g.height),s=d.data,c=0;c<s.length;c+=4)s[c]=255-s[c],s[c+1]=255-s[c+1],s[c+2]=255-s[c+2];i.putImageData(d,g.x,g.y)}o.innerText=function(t,e){var n="$spriteMap: ( \n";for(var a in t){var r=t[a],i="sprite"+a+": ("+-r.x+"px, "+-r.y+"px, "+r.width+"px, "+r.height+"px)";n+=i,a!==t.length&&(n+=", \n")}return"@mixin image($xpos, $ypos, $width, $height) { \nheight: $height; \nwidth: width; \nbackground-position: $xpos $ypos; \nbackground-repeat: no-repeat; \n};\n"+(n+="); \n")}(n,e.src)}},e.readAsDataURL(t.target.files[0])},!1);var r=document.getElementById("imageCanvas"),i=r.getContext("2d"),o=document.getElementById("spriteDisplay")}],[[0,1]]]);
//# sourceMappingURL=main.d94ff1dd.chunk.js.map