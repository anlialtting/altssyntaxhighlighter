async function highlight_all(e){
    let syntaxHighlighter=this
    let
        highlighters=[{
            header:'highlightCpp.js',
            selector:'.highlighted_cpp',
            functionName:'highlightCpp',
        },{
            header:'highlightHtml.js',
            selector:'.highlighted_html',
            functionName:'highlightHtml',
        },{
            header:'highlightJs.js',
            selector:'.highlighted_js',
            functionName:'highlightJs',
        },{
            header:'highlightTex.js',
            selector:'.highlighted_tex',
            functionName:'highlightTex',
        }]
    e=e||document
    await Promise.all(highlighters.map(async highlighter=>{
        if(e.querySelectorAll(highlighter.selector).length==0)
            return
        await this.modules.require(highlighter.header)
        await Promise.all([
            f0(highlighter),
            f1(highlighter),
            f2(highlighter),
        ])
    }))
    async function f0(highlighter){
        await Promise.all([
            ...e.querySelectorAll('span'+highlighter.selector)
        ].map(async e=>{
            e.innerHTML=await syntaxHighlighter[highlighter.functionName](e.textContent)
            e.style.visibility=''
        }))
    }
    async function f1(highlighter){
        await Promise.all([
            ...e.querySelectorAll('div'+highlighter.selector)
        ].map(async e=>{
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
            e.oninput=async event=>{
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
                    await syntaxHighlighter[
                        highlighter.functionName
                    ](e.textContent)
                ))
                goto(e,cursorPosition,0)
            }
            e.innerHTML=await syntaxHighlighter[highlighter.functionName](e.textContent)
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
        }))
    }
    async function f2(highlighter){
        await Promise.all([
            ...e.querySelectorAll('script'+highlighter.selector)
        ].map(async e=>{
            e.innerHTML=await syntaxHighlighter[highlighter.functionName](e.innerHTML)
            if(!e.classList.contains('bordered'))
                replaceByDiv(e)
        }))
    }
}
highlight_all
