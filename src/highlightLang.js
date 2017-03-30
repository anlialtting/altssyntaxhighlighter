/*
This is a sample module.
*/
(()=>{
var
    db=new syntaxHighlighter.Database('lang'),
    matchingRules={
    }
syntaxHighlighter.highlightLang=highlightLang
async function highlightLang(source){
    await db.require([
    ])
    return syntaxHighlighter.highlight(
        syntaxHighlighter.analyze(matchingRules,source)
    )
}
})()
