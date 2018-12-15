import analyze from     './analyze.mjs'
import highlight from   './highlight.mjs'
var
    matchingRules={
        startTag:{
            root:1,
            headRegex:/^()<[a-z]/,
            tailRegex:/^(\>)/,
            contain:['headOfStartTag','attribute']
        },
        headOfStartTag:{
            headRegex:/^()<[a-z]/,
            tailRegex:/^()[\ \>\n]/,
            contain:['tagname']
        },
        tagname:{
            regex:/^([-A-Za-z]+)/,
        },
        attribute:{
            headRegex:/^([-A-Za-z]+)/,
            tailRegex:/^()[\ \>\n]/,
            contain:['afterEqualInAttribute']
        },
        afterEqualInAttribute:{
            headRegex:/^(=)/,
            tailRegex:/^()[\ \>\n]/,
            contain:['attributeValue'],
        },
        attributeValue:[{
            headRegex:/^(')/,
            tailRegex:/^(')/,
        },{
            headRegex:/^(")/,
            tailRegex:/^(")/,
        },{
            headRegex:/^()/,
            tailRegex:/^()[\ \>\n]/,
        }],
        endTag:{
            root:1,
            headRegex:/^(<\/)/,
            tailRegex:/^(\>)/,
            contain:['tagname'],
        },
        comment:[
            {
                root:1,
                regex:/^(\<!--(?:(?!--\>)(?:.|\n))*--\>)/,
            },{
                root:1,
                regex:/^(\<![^\>]*\>)/,
            }
        ],
    }
function highlightHtml(source){
    return highlight(analyze(matchingRules,source))
}
export default highlightHtml
