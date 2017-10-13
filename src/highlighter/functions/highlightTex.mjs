import coreCommands from            './tex/coreCommands.mjs'
import documentClasses from         './tex/documentClasses.mjs'
import commonArguments from         './tex/commonArguments.mjs'
import commonPackages from          './tex/commonPackages.mjs'
var
    matchingRules={
        comment:{
            regex:/^(%.*\n)/,
        },
        command:{
            headRegex:/^()\\/,
            tailRegex:/^()[^\\a-z]/,
            contain:['operator','commandName'],
        },
        operator:{
            regex:/^([\\\[\]\{\}])/,
        },
        identifier:{
            regex:/^([a-z]+)/,
            containKeywords:[
                'documentClasses',
                'commonArguments',
                'commonPackages',
            ],
        },
        commandName:{
            active:false,
            regex:/^([a-z]+)/,
            containKeywords:['coreCommands'],
        },
        coreCommands:{
            active:false,
        },
        documentClasses:{
            active:false,
        },
        commonArguments:{
            active:false,
        },
        commonPackages:{
            active:false,
        },
    }
matchingRules.coreCommands.keywords=coreCommands
matchingRules.documentClasses.keywords=documentClasses
matchingRules.commonArguments.keywords=commonArguments
matchingRules.commonPackages.keywords=commonPackages
function highlightTex(source){
    return this.highlight(
        this.analyze(matchingRules,source)
    )
}
export default highlightTex
