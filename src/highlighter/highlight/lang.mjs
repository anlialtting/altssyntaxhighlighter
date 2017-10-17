import analyze from     './analyze.mjs'
import highlight from   './highlight.mjs'
/*
This is a sample module.
*/
var
    matchingRules={
    }
function highlightLang(source){
    return highlight(analyze(matchingRules,source))
}
export default highlightLang
