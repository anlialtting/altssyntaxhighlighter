import{dom}from 'https://rawgit.com/anliting/althea/7e4e4285807357154016f76fbca4e55de3c190d8/src/AltheaServer/HttpServer/files/lib/core.static.js';
import syntax from '../highlighter.mjs'
let code=`#include<stdio.h>
int main(){
return 0;
}
`
dom.body(
    dom.div(
        {className:'bordered highlighted_cpp'},
        syntax.typeset(
            syntax.highlight.cpp(code)
        )
    )
)
