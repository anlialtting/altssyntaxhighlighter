import doe from         '../lib/doe.mjs'
import style from       './highlighter/style.mjs'
import highlight from   './highlighter/highlight.mjs'
import typeset from     './highlighter/typeset.mjs'
doe.head(doe.style(style))
export{
    highlight,
    typeset,
}
export default{
    highlight,
    typeset,
}
