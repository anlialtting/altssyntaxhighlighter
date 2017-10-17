import{dom}from 'https://rawgit.com/anliting/althea/7e4e4285807357154016f76fbca4e55de3c190d8/src/AltheaServer/HttpServer/files/lib/core.static.js';
import syntax from '../highlighter.mjs'
//import syntax from '../highlighter.static.mjs'
let code=[{
    type:'cpp',
    code:`#include<stdio.h>
int main(){
    return 0;
}
`,
},{
    type:'html',
    code:`<!doctype html>
<title>a</title>
<script src=https://gitcdn.link/cdn/anliting/module/3ab0911691daf85ec952299bd890f61c3eef0f64/src/module.js data-main=a.js></script>
`,
},{
    type:'js',
    code:`\`<script id=a type=a>\${encodeURIComponent(s)}</script>\`
`,
},{
    type:'tex',
    code:`\\documentclass{article}
\\usepackage{fontspec}
\\setmainfont{AR PL UKai CN}
\\begin{document}
人不外乎是自己造就的東西。
\\end{document}
`,
},]
code.map(({type,code})=>{
    dom.body(dom(
        syntax.highlight[type](code).typeset(),
        n=>{n.style.margin='8px 0'}
    ))
})
