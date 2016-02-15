/*
This is a sample module.
*/
(()=>{
var
    db=new syntaxHighlighter.Database('lang'),
    matchingRules={
    }
syntaxHighlighter.highlightLang=highlightLang
function highlightLang(source,cb){
    db.require([
    ],err=>{
        if(err)
            return cb(err)
        cb(null,syntaxHighlighter.highlight(
            syntaxHighlighter.analyze(matchingRules,source)
        ))
    })
}
})()
