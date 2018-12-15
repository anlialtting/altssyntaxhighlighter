import{escape}from'../../../lib/cr.mjs'
function highlight(list){
    return list.map(item=>{
        if(typeof item=='string')
            return escape(item)
        else if(typeof item=='object')
            return `<span class=${item.syntaxName}>${
                highlight(item.list)
            }</span>`
    }).join('')
}
export default highlight
