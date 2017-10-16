import core from './core.mjs'
let{html}=core.althea
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
export default highlight
