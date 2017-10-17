import core from        './highlighter/core.mjs'
import style from       './highlighter/style.mjs'
import highlight from   './highlighter/highlight.mjs'
import typeset from     './highlighter/typeset.mjs'
let{dom}=core.althea
dom.head(dom.style(style))
export{
    highlight,
    typeset,
}
export default{
    highlight,
    typeset,
}
