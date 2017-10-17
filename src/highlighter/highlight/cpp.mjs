import newlineDeletedAnalyze from   './newlineDeletedAnalyze.mjs'
import highlight from               './highlight.mjs'
import keywords from                './cpp/keywords.mjs'
import library from                 './cpp/library.mjs'
import stlcontainers from           './cpp/stlcontainers.mjs'
import constants from               './cpp/constants.mjs'
var
    matchingRules={
        characterLiteral:{
            regex:/^('(?:[^'\\]|\\.)')/,
        },
        comment:[
            {
                regex:/^(\/\/.*)\n/,
            },{
                regex:/^(\/\*(?:(?!\*\/)(?:.|\n))*\*\/)/,
            }
        ],
        rawStringLiteral:{
            regex:/^(R"([^\ \(\)\\]{0,16})\((?:(?!\)\2")(?:.|\n))*\)\2")/,
        },
        cStringLiteral:{
            regex:/^("(?:[^"\\]|\\.)*")/,
        },
        identifier:{
            regex:/^([A-Z_a-z][0-9A-Z_a-z]*)/,
            containKeywords:[
                'keywords',
                'library',
                'stlcontainers',
                'constants',
            ]
        },
        numberLiteral:{
            regex:/^([0-9][0-9ELXelx.]*)/,
        },
        operator:{
            regex:/^([()\[\]{}<>+\-*\/%,:;?&^=!~.|])/,
        },
        preprocessingDirective:{
            headRegex:/^(#)/,
            tailRegex:/^()\n/,
            contain:['comment','includePD','definePD'],
        },
        includePD:{
            active:false,
            headRegex:/^(include)/,
            tailRegex:/^()\n/,
            contain:['comment','headerName'],
        },
        headerName:[
            {
                active:false,
                headRegex:/^(<)/,
                tailRegex:/^(>)/,
                contain:['headerNameSlash'],
            },{
                active:false,
                headRegex:/^(")/,
                tailRegex:/^(")/,
                contain:['headerNameSlash'],
            },
        ],
        headerNameSlash:{
            active:false,
            regex:/^(\/)/
        },
        definePD:{
            active:false,
            headRegex:/^(define)/,
            tailRegex:/^()\n/,
            contain:['comment','operator','definePDKeyValue'],
        },
        definePDKeyValue:{
            active:false,
            headRegex:/^([A-Z_a-z]+(?:\([^\)]*\))?)/,
            tailRegex:/^()\n/,
            contain:['comment','operator','definePDValue'],
        },
        definePDValue:{
            active:false,
            headRegex:/^(.)/,
            tailRegex:/^()\n/,
            contain:['comment','operator'],
        },
        keywords:{
            active:false,
        },
        library:{
            active:false,
        },
        stlcontainers:{
            active:false,
        },
        constants:{
            active:false,
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
