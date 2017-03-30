(async()=>{
    let syntaxHighlighter=await module.shareImport('highlighter.js')
    let
        textarea=   document.getElementById('textarea'),
        div=        document.getElementById('div'),
        divCode=    document.getElementById('divCode')
    divCode.textContent=tv()
    syntaxHighlighter()
    textarea.oninput=()=>{
        divCode.textContent=tv()
        syntaxHighlighter.highlight_all(div,()=>{
            syntaxHighlighter.border_all(div,()=>{
            })
        })
    }
    function tv(){
        return textarea.value+(/\n$/.test(textarea.value)?'':'\n')
    }
})()
