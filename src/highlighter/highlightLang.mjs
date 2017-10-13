/*
This is a sample module.
*/
var
    matchingRules={
    }
async function highlightLang(source){
    return this.highlight(
        this.analyze(matchingRules,source)
    )
}
export default highlightLang
