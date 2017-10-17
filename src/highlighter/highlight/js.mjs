import analyze from     './analyze.mjs'
import highlight from   './highlight.mjs'
import keyword from     './js/keyword.mjs'
import library from     './js/library.mjs'
let matchingRules={
    comment:[
        {
            root:1,
            regex:/^(\/\/.*\n)/,
        },{
            root:1,
            regex:/^(\/\*(?:.|\n)*\*\/)/,
        }
    ],
    string:[
        {
            root:1,
            regex:/^('(?:[^'\\]|\\.)*')/,
        },{
            root:1,
            regex:/^("(?:[^"\\]|\\.)*")/,
        },{
            root:1,
            headRegex:/^(`)/,
            tailRegex:/^(`)/,
            contain:['templateStringPlaceHolder'],
        }
    ],
    operator:{
        root:1,
        regex:/^([!%&\(\)\*\+\,\-\.\/\:;\<=\>\?\[\]\^\{\|\}\~])/,
    },
    number:{
        root:1,
        regex:/^([0-9]+(?:\.[0-9]+)?)/
    },
    identifier:{
        root:1,
        regex:/^([A-Z_a-z]+)/,
        containKeywords:[
            'keyword',
            'library',
        ]
    },
    keyword:{
    },
    library:{
    },
    templateStringPlaceHolder:{
        headRegex:/^(\${)/,
        tailRegex:/^(})/,
    },
}
matchingRules.keyword.keywords=keyword
matchingRules.library.keywords=library
function highlightJs(source){
    return highlight(analyze(matchingRules,source))
}
export default highlightJs
