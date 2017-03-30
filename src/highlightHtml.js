(()=>{
var
    db=new syntaxHighlighter.Database('html'),
    matchingRules={
        startTag:{
            headRegex:/^()<[a-z]/,
            tailRegex:/^(\>)/,
            contain:['headOfStartTag','attribute']
        },
        headOfStartTag:{
            active:false,
            headRegex:/^()<[a-z]/,
            tailRegex:/^()[\ \>\n]/,
            contain:['tagname']
        },
        tagname:{
            active:false,
            regex:/^([-A-Za-z]+)/,
        },
        attribute:{
            active:false,
            headRegex:/^([-A-Za-z]+)/,
            tailRegex:/^()[\ \>\n]/,
            contain:['afterEqualInAttribute']
        },
        afterEqualInAttribute:{
            active:false,
            headRegex:/^(=)/,
            tailRegex:/^()[\ \>\n]/,
            contain:['attributeValue'],
        },
        attributeValue:[{
            active:false,
            headRegex:/^(')/,
            tailRegex:/^(')/,
        },{
            active:false,
            headRegex:/^(")/,
            tailRegex:/^(")/,
        },{
            active:false,
            headRegex:/^()/,
            tailRegex:/^()[\ \>\n]/,
        }],
        endTag:{
            headRegex:/^(<\/)/,
            tailRegex:/^(\>)/,
            contain:['tagname'],
        },
        comment:[
            {
                regex:/^(\<!--(?:(?!--\>)(?:.|\n))*--\>)/,
            },{
                regex:/^(\<![^\>]*\>)/,
            }
        ],
    }
syntaxHighlighter.highlightHtml=highlightHtml
async function highlightHtml(source,cb){
    await db.require([
    ])
    cb(null,syntaxHighlighter.highlight(
        syntaxHighlighter.analyze(matchingRules,source)
    ))
}
})()
