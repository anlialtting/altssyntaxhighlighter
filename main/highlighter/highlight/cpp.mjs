import newlineDeletedAnalyze from   './newlineDeletedAnalyze.mjs'
import highlight from               './highlight.mjs'
import keywords from                './cpp/keywords.mjs'
import library from                 './cpp/library.mjs'
import stlcontainers from           './cpp/stlcontainers.mjs'
import constants from               './cpp/constants.mjs'
var
    matchingRules={
        characterLiteral:{
            root:1,
            regex:/^('(?:[^'\\]|\\.)')/,
        },
        comment:[
            {
                root:1,
                regex:/^(\/\/.*)\n/,
            },{
                root:1,
                regex:/^(\/\*(?:(?!\*\/)(?:.|\n))*\*\/)/,
            }
        ],
        rawStringLiteral:{
            root:1,
            regex:/^(R"([^\ \(\)\\]{0,16})\((?:(?!\)\2")(?:.|\n))*\)\2")/,
        },
        cStringLiteral:{
            root:1,
            regex:/^("(?:[^"\\]|\\.)*")/,
        },
        identifier:{
            root:1,
            regex:/^([A-Z_a-z][0-9A-Z_a-z]*)/,
            containKeywords:[
                'keywords',
                'library',
                'stlcontainers',
                'constants',
            ]
        },
        numberLiteral:{
            root:1,
            regex:/^([0-9][0-9ELXelx.]*)/,
        },
        operator:{
            root:1,
            regex:/^([()\[\]{}<>+\-*\/%,:;?&^=!~.|])/,
        },
        preprocessingDirective:{
            root:1,
            headRegex:/^(#)/,
            tailRegex:/^()\n/,
            contain:['comment','includePD','definePD'],
        },
        includePD:{
            headRegex:/^(include)/,
            tailRegex:/^()\n/,
            contain:['comment','headerName'],
        },
        headerName:[
            {
                headRegex:/^(<)/,
                tailRegex:/^(>)/,
                contain:['headerNameSlash'],
            },{
                headRegex:/^(")/,
                tailRegex:/^(")/,
                contain:['headerNameSlash'],
            },
        ],
        headerNameSlash:{
            regex:/^(\/)/
        },
        definePD:{
            headRegex:/^(define)/,
            tailRegex:/^()\n/,
            contain:['comment','operator','definePDKeyValue'],
        },
        definePDKeyValue:{
            headRegex:/^([A-Z_a-z]+(?:\([^\)]*\))?)/,
            tailRegex:/^()\n/,
            contain:['comment','operator','definePDValue'],
        },
        definePDValue:{
            headRegex:/^(.)/,
            tailRegex:/^()\n/,
            contain:['comment','operator'],
        },
        keywords:{
        },
        library:{
        },
        stlcontainers:{
        },
        constants:{
        },
    }
matchingRules.keywords.keywords=keywords
matchingRules.library.keywords=library
matchingRules.stlcontainers.keywords=stlcontainers
matchingRules.constants.keywords=constants
function highlightCpp(source){
    return highlight(newlineDeletedAnalyze(matchingRules,source))
}
export default highlightCpp
