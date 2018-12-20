import cpp from         './highlight/cpp.mjs'
import html from        './highlight/html.mjs'
import js from          './highlight/js.mjs'
import tex from         './highlight/tex.mjs'
import typeset from     './typeset.mjs'
let languages={
    cpp,
    html,
    js,
    tex,
}
function Highlighted(lang,s){
    this.lang=lang
    this.s=s
}
Highlighted.prototype.toString=function(){
    return `<span class=highlighted_${this.lang}>${
        languages[this.lang](this.s)
    }</span>`
}
Highlighted.prototype.typeset=function(){
    return typeset(this.toString())
}
function highlight(k,s){
    return new Highlighted(k,s)
}
export default new Proxy(highlight,{get:(t,k)=>
    s=>new Highlighted(k,s)
})
