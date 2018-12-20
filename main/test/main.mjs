import doe from'../../lib/doe.mjs'
import sh from '../main.mjs'
//import sh from '../main.static.mjs'
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
doe.head(doe.style(sh.style))
code.map(({type,code})=>{
    doe.body(doe(
        sh.highlight(type,code).typeset(),
        n=>{n.style.margin='8px 0'}
    ))
})
