import core from './highlighter/core.mjs'
import style from './highlighter/style.mjs'
import highlight from './highlighter/functions.mjs'
import typeset from './highlighter/text_border.mjs'
let{dom}=core.althea
dom.head(dom.style(style))
export default{
    highlight,
    typeset,
}
