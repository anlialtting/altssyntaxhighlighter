(async()=>{
    let syntaxHighlighter=await module.module('highlighter.mjs')
    let
        textarea=   document.getElementById('textarea'),
        div=        document.getElementById('div'),
        divCode=    document.getElementById('divCode')
    textarea.value=`#include<stdio.h>
int main(){
    return 0;
}
`
    update()
    textarea.oninput=update
    async function update(){
        divCode.textContent=
            textarea.value+(/\n$/.test(textarea.value)?'':'\n')
        await syntaxHighlighter.highlight_all(div)
        await syntaxHighlighter.border_all(div)
    }
})()
