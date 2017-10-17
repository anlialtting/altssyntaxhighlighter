import core from './core.mjs'
import text_border from './text_border.mjs'
let{dom}=core.althea
function border_all(e){
    e=e||document
    for(let f of e.querySelectorAll('div.bordered'))
        dom(f,
            {innerHTML:''},
            text_border(f.innerHTML),
            f=>{f.style.visibility=''}
        )
    for(let f of e.querySelectorAll('script.bordered'))
        replaceByDiv(
            dom(f,{innerHTML:''},
                text_border(f.innerHTML)
            )
        )
}
function replaceByDiv(e){
    let div=dom('div',e.firstChild)
    for(let i=0;i<e.classList.length;i++)
        div.classList.add(e.classList[i])
    e.parentNode.insertBefore(div,e)
    e.parentNode.removeChild(e)
    return div
}
export default border_all
