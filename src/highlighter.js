;(async()=>{
    module.repository.Syntax=module.module('highlighter/Syntax.mjs')
    let[
        core,
        analyze,
        highlight_all,
        border_all,
        newlineDeletedAnalyze,
        Cache,
    ]=await Promise.all([
        module.module('highlighter/core.mjs'),
        module.module('highlighter/analyze.mjs'),
        module.module('highlighter/highlight_all.mjs'),
        module.module('highlighter/border_all.mjs'),
        module.module('highlighter/newlineDeletedAnalyze.mjs'),
        module.module('highlighter/Cache.mjs'),
    ])
    let{dom,html}=core.althea
    let
        options=window.syntaxHighlighter
    loadCSS('highlighter/highlighter.css')
    syntaxHighlighter.analyze=analyze
    syntaxHighlighter.newlineDeletedAnalyze=newlineDeletedAnalyze
    syntaxHighlighter.highlight=highlight
    syntaxHighlighter.highlight_all=highlight_all
    syntaxHighlighter.border_all=border_all
    async function syntaxHighlighter(){
        await this.highlight_all()
        await this.border_all()
    }
    async function loadCSS(path){
        dom.head(
            dom.style(await module.get(path))
        )
    }
    function highlight(list){
        return list.map(item=>{
            if(typeof item=='string')
                return html.encodeText(item)
            else if(typeof item=='object')
                return `<span class=${item.syntaxName}>${
                    highlight(item.list)
                }</span>`
        }).join('')
    }
    return syntaxHighlighter
})()
