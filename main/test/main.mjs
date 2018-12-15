import{dom}from'https://gitcdn.link/cdn/anliting/simple.js/09b9cd311f438c07fd1ac0ead044aed97158faf3/src/simple.static.js'
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
