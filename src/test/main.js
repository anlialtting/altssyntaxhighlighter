import{dom}from 'https://rawgit.com/anliting/althea/7e4e4285807357154016f76fbca4e55de3c190d8/src/AltheaServer/HttpServer/files/lib/core.static.js';
import syntax from '../highlighter.mjs'
//import syntax from '../highlighter.static.mjs'
let code=`#include<stdio.h>
int main(){
return 0;
}
`
dom.body(
    syntax.highlight.cpp(code).typeset(),
    //dom.div({innerHTML:syntax.highlight.cpp(code)}).firstChild,
)
