import{escape}from'../../lib/cr.mjs'
import doe from'../../lib/doe/main/doe.mjs'
function text_border(s){
    let
        countOfLines,
        logCountOfLines
    s=splitSourceByNewlineCharacter(s)
    countOfLines=s.replace(/&#10;/g,'\n').split('\n').length-1
    logCountOfLines=Math.floor(Math.round(
        Math.log(countOfLines)/Math.log(10)*1e6
    )/1e6)
    return table()
    function splitSourceByNewlineCharacter(source){
        return splitElementByNewlineCharacter(
            doe.div({innerHTML:source})
        )
    }
    function splitElementByNewlineCharacter(e){
        return[...e.childNodes].map(node=>
            node.nodeType==Node.TEXT_NODE?
                escape(node.wholeText)
            :
                splitElementByNewlineCharacter(
                    node
                ).replace(/&#10;/g,'\n').split('\n').map(s=>(
                    node.innerHTML=s,
                    node.outerHTML
                )).join('\n')
        ).join('')
    }
    function table(){
        let lines=s.replace(/&#10;/g,'\n').split('\n')
        lines.pop()
        return doe.div({className:'typeset table'},
            lines.map(s=>s+'\n').map((e,i)=>
                tr(i,e)
            )
        )
    }
    function tr(i,s){
        return doe.div({className:'tableRow'},
            tr=>{tr.dataset.lineNumber=i+1},
            td_lineNumber(i),
            doe.div({className:'content',innerHTML:s})
        )
    }
    function td_lineNumber(i){
        return doe.div({className:'lineNumber'},td=>{
            td.dataset.lineNumber=i+1
            td.style.width=6*(logCountOfLines+1)+'pt'
        })
    }
}
export default text_border
