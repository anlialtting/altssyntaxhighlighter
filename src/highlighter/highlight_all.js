(async()=>{
    let f1=await module.shareImport('highlight_all/f1.js')
    let
        highlighters=[{
            header:'highlightCpp.js',
            selector:'.highlighted_cpp',
            functionName:'highlightCpp',
        },{
            header:'highlightHtml.js',
            selector:'.highlighted_html',
            functionName:'highlightHtml',
        },{
            header:'highlightJs.js',
            selector:'.highlighted_js',
            functionName:'highlightJs',
        },{
            header:'highlightTex.js',
            selector:'.highlighted_tex',
            functionName:'highlightTex',
        }]
    async function highlight_all(e){
        e=e||document
        await Promise.all(highlighters.map(async highlighter=>{
            if(e.querySelectorAll(highlighter.selector).length==0)
                return
            await this.modules.require(highlighter.header)
            await Promise.all([
                f0.call(this,e,highlighter),
                f1.call(this,e,highlighter),
                f2.call(this,e,highlighter),
            ])
        }))
    }
    async function f0(e,highlighter){
        let syntaxHighlighter=this
        await Promise.all([
            ...e.querySelectorAll('span'+highlighter.selector)
        ].map(async e=>{
            e.innerHTML=await syntaxHighlighter[highlighter.functionName](e.textContent)
            e.style.visibility=''
        }))
    }
    async function f2(e,highlighter){
        let syntaxHighlighter=this
        await Promise.all([
            ...e.querySelectorAll('script'+highlighter.selector)
        ].map(async e=>{
            e.innerHTML=await syntaxHighlighter[highlighter.functionName](e.innerHTML)
            if(!e.classList.contains('bordered'))
                replaceByDiv(e)
        }))
    }
    return highlight_all
})()
