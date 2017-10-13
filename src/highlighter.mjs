import core from './highlighter/core.mjs'
import analyze from './highlighter/analyze.mjs'
import highlight_all from './highlighter/highlight_all.mjs'
import border_all from './highlighter/border_all.mjs'
import newlineDeletedAnalyze from './highlighter/newlineDeletedAnalyze.mjs'
import style from './highlighter/style.mjs'
let{dom,html}=core.althea
let
    options=window.syntaxHighlighter
dom.head(dom.style(style))
syntaxHighlighter.analyze=analyze
syntaxHighlighter.newlineDeletedAnalyze=newlineDeletedAnalyze
syntaxHighlighter.highlight=highlight
syntaxHighlighter.highlight_all=highlight_all
syntaxHighlighter.border_all=border_all
function syntaxHighlighter(){
    this.highlight_all()
    this.border_all()
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
export default syntaxHighlighter
