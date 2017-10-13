import keyword from './js/keyword.mjs'
import library from './js/library.mjs'
var
    matchingRules={
        comment:[
            {
                regex:/^(\/\/.*\n)/,
            },{
                regex:/^(\/\*(?:.|\n)*\*\/)/,
            }
        ],
        string:[
            {
                regex:/^('(?:[^'\\]|\\.)*')/,
            },{
                regex:/^("(?:[^"\\]|\\.)*")/,
            },{
                regex:/^(`(?:[^`\\]|\\.)*`)/,
            }
        ],
        operator:{
            regex:/^([!%&\(\)\*\+\,\-\.\/\:;\<=\>\?\[\]\^\{\|\}\~])/,
        },
        number:{
            regex:/^([0-9]+(?:\.[0-9]+)?)/
        },
        identifier:{
            regex:/^([A-Z_a-z]+)/,
            containKeywords:[
                'keyword',
                'library',
            ]
        },
        keyword:{
            active:false,
        },
        library:{
            active:false,
        },
    }
matchingRules.keyword.keywords=keyword
matchingRules.library.keywords=library
async function highlightJs(source){
    return this.highlight(
        this.analyze(matchingRules,source)
    )
}
export default highlightJs
