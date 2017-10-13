import f1 from './highlight_all/f1.mjs'
import functions from './functions.mjs'
let
    highlighters=[{
        selector:'.highlighted_cpp',
        functionName:'highlightCpp',
    },{
        selector:'.highlighted_html',
        functionName:'highlightHtml',
    },{
        selector:'.highlighted_js',
        functionName:'highlightJs',
    },{
        selector:'.highlighted_tex',
        functionName:'highlightTex',
    }]
async function highlight_all(e){
    e=e||document
    await Promise.all(highlighters.map(async highlighter=>{
        if(e.querySelectorAll(highlighter.selector).length==0)
            return
        await Promise.all([
            f0.call(this,e,highlighter),
            f1.call(this,e,highlighter),
            f2.call(this,e,highlighter),
        ])
    }))
}
async function f0(e,highlighter){
    await Promise.all([
        ...e.querySelectorAll('span'+highlighter.selector)
    ].map(async e=>{
        e.innerHTML=await functions[highlighter.functionName].call(this,e.textContent)
        e.style.visibility=''
    }))
}
async function f2(e,highlighter){
    await Promise.all([
        ...e.querySelectorAll('script'+highlighter.selector)
    ].map(async e=>{
        e.innerHTML=await functions[highlighter.functionName].call(this,e.innerHTML)
        if(!e.classList.contains('bordered'))
            replaceByDiv(e)
    }))
}
export default highlight_all
