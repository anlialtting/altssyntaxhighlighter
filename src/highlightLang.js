/*
This is a sample module.
*/
(()=>{
var
    db=new syntaxHighlighter.Database('lang'),
    matchingRules={
    }
syntaxHighlighter.highlightLang=highlightLang
async function highlightLang(source,cb){
    await db.require([
    ])
    cb(null,syntaxHighlighter.highlight(
        syntaxHighlighter.analyze(matchingRules,source)
    ))
}
})()
