import analyze from             './analyze.mjs'
import highlight from           './highlight.mjs'
import coreCommands from        './tex/coreCommands.mjs'
import documentClasses from     './tex/documentClasses.mjs'
import commonArguments from     './tex/commonArguments.mjs'
import commonPackages from      './tex/commonPackages.mjs'
var
    matchingRules={
        comment:{
            root:1,
            regex:/^(%.*\n)/,
        },
        command:{
            root:1,
            headRegex:/^()\\/,
            tailRegex:/^()[^\\a-z]/,
            contain:['operator','commandName'],
        },
        operator:{
            root:1,
            regex:/^([\\\[\]\{\}])/,
        },
        identifier:{
            root:1,
            regex:/^([a-z]+)/,
            containKeywords:[
                'documentClasses',
                'commonArguments',
                'commonPackages',
            ],
        },
        commandName:{
            regex:/^([a-z]+)/,
            containKeywords:['coreCommands'],
        },
        coreCommands:{
        },
        documentClasses:{
        },
        commonArguments:{
        },
        commonPackages:{
        },
    }
matchingRules.coreCommands.keywords=coreCommands
matchingRules.documentClasses.keywords=documentClasses
matchingRules.commonArguments.keywords=commonArguments
matchingRules.commonPackages.keywords=commonPackages
function highlightTex(source){
    return highlight(analyze(matchingRules,source))
}
export default highlightTex
