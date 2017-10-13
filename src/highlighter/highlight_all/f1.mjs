import functions from '../functions.mjs'
function f1(e,highlighter){
    let syntaxHighlighter=this
    ;[
        ...e.querySelectorAll('div'+highlighter.selector)
    ].map(e=>{
        /*e.ondblclick=()=>{
            e.contentEditable=true
        }*/
        e.onkeydown=event=>{
            var cursorPosition
            event.stopPropagation()
            console.log(event.keyCode)
            if(event.keyCode==37){
                event.preventDefault()
                cursorPosition=
                    getCharacterOffsetWithin(document.getSelection().getRangeAt(0),e)
                goto(e,Math.max(0,cursorPosition-1),0)
            }
            if(event.keyCode==38){
                event.preventDefault()
            }
            if(event.keyCode==39){
                event.preventDefault()
                cursorPosition=
                    getCharacterOffsetWithin(document.getSelection().getRangeAt(0),e)
                goto(e,Math.min(e.textContent.length,cursorPosition+1),0)
            }
        }
        e.oninput=event=>{
            var range,cursorPosition
            range=document.getSelection().getRangeAt(0)
            if(range.startContainer!=range.endContainer||range.startOffset!=range.endOffset)
                return
            cursorPosition=getCharacterOffsetWithin(document.getSelection().getRangeAt(0),e)
            var a=e.querySelectorAll('.content')
            for(var j=0;j<a.length;j++)
                if(!/\n$/.test(a[j].textContent))
                    a[j].textContent+='\n'
            if(!/\n$/.test(e.textContent))
                e.textContent+='\n'
            dom(e,{innerHTML:''},text_border(
                functions[
                    highlighter.functionName
                ].call(syntaxHighlighter,e.textContent)
            ))
            goto(e,cursorPosition,0)
        }
        e.innerHTML=functions[highlighter.functionName].call(syntaxHighlighter,e.textContent)
        if(!e.classList.contains('bordered'))
            e.style.visibility=''
        function getCharacterOffsetWithin(range,node){
            var treeWalker=document.createTreeWalker(
                node,
                NodeFilter.SHOW_TEXT,
                node=>{
                    var nodeRange=document.createRange()
                    nodeRange.selectNode(node)
                    return nodeRange.compareBoundaryPoints(Range.END_TO_END,range)<1?
                        NodeFilter.FILTER_ACCEPT
                    :
                        NodeFilter.FILTER_REJECT
                }
            )
            var charCount=0
            while(treeWalker.nextNode())
                charCount+=treeWalker.currentNode.length
            if(range.startContainer.nodeType==3)
                charCount+=range.startOffset
            return charCount
        }
        function goto(node,position,which){
            var treeWalker=document.createTreeWalker(
                node,
                NodeFilter.SHOW_TEXT
            )
            var charCount=0
            while(treeWalker.nextNode()){
                if(position<charCount+treeWalker.currentNode.length){
                    var selection=window.getSelection()
                    var range=document.createRange()
                    if(which==0){
                        range.setStart(treeWalker.currentNode,position-charCount)
                        range.setEnd(treeWalker.currentNode,position-charCount)
                    }else if(which==1){
                        range.setStart(treeWalker.currentNode,position-charCount)
                    }else if(which==2){
                        range.setEnd(treeWalker.currentNode,position-charCount)
                    }
                    selection.removeAllRanges()
                    selection.addRange(range)
                    return
                }
                charCount+=treeWalker.currentNode.length
            }
        }
    })
}
export default f1
