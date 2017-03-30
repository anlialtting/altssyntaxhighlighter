(async()=>{
    let syntaxHighlighter=await module.shareImport('highlighter.js')
    let
        textarea=   document.getElementById('textarea'),
        div=        document.getElementById('div'),
        divCode=    document.getElementById('divCode')
    update()
    textarea.oninput=update
    async function update(){
        divCode.textContent=
            textarea.value+(/\n$/.test(textarea.value)?'':'\n')
        await syntaxHighlighter.highlight_all(div)
        await syntaxHighlighter.border_all(div)
    }
})()
