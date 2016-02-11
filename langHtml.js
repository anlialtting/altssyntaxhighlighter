(()=>{
window.syntaxHighlighter.highlight_html=highlight_html
function highlight_html(s){
    var stringset_tags=[
        'body','html','head','meta','title','link','script','div','p','option','form','br','a','table','tr','td','textarea','select','input','span','h1','h2','h3',
    ];
    var stringset_properties=[
        'src','href','rel','type','class','id','name','style','target','value','method','http-equiv','content','action','onchange','onclick','enctype','checked','selected','charset','rows','cols'
        ];0
    var stringset_stlcontainers=[];
    var stringset_constants=[];
    var regex_operators=/[<>=/]/;
    var regex_specifier_characters_first=/[A-Za-z_]/;
    var regex_specifier_characters=/[0-9A-Za-z_-]/;
    var regex_literal_characters_first=/[0-9]/;
    var regex_literal_characters=/[0-9ELXelx.]/;
    //s=syntaxHighlighter.htmltextdecode(s);
    var x='';
    /*
       define values in stack
       0 the problem
       1 backslash
       6 string literal "
     */
    /*
       priority
       0. string
       1. stack
       2. character
     */
    var i=0;
    var stack=[],top_stack=0;
    stack[top_stack++]=0;
    while(i<s.length){
        if(stack[top_stack-1]==0){
            var last_token;
            last_token=syntaxHighlighter.get_token.call(s,i,
                    regex_specifier_characters_first,
                    regex_specifier_characters);
            if(i!=last_token){
                var token=s.substring(i,last_token);
                if(stringset_tags.indexOf(token)!=-1){
                    x+='<span style="color:darkblue;"><b>'+token+'</b></span>';
                }else if(stringset_properties.indexOf(token)!=-1){
                    x+='<span style="color:deeppink;">'+token+'</span>';
                }else if(stringset_stlcontainers.indexOf(token)!=-1){
                    x+='<span style="color:limegreen;"><b>'+token+'</b></span>';
                }else if(stringset_constants.indexOf(token)!=-1){
                    x+='<span style="color:darkviolet;"><b>'+token+'</b></span>';
                }else
                    x+=token
                i=last_token
                continue
            }
            last_token=syntaxHighlighter.get_token.call(s,i,
                    regex_literal_characters_first,
                    regex_literal_characters);
            if(i!=last_token){
                var token=s.substring(i,last_token);
                x+='<span style="color:darkviolet;">'+token+'</span>';
                i=last_token;
                continue;
            }
            if(s[i]=='\\'){
                stack[top_stack++]=1;
                x+=syntaxHighlighter.htmltextencode(s[i++]);
                continue;
            }
            if(i+1<s.length&&s[i]=='<'&&s[i+1]=='!'){
                stack[top_stack++]=2;
                x+='<span style="color:gray;">'+syntaxHighlighter.htmltextencode(s[i++]);
                continue;
            }
            if(s[i]=='"'){
                stack[top_stack++]=6;
                x+='<span style="color:blue;">'+syntaxHighlighter.htmltextencode(s[i++]);
                continue;
            }
            if(regex_operators.test(s[i])){
                x+='<span style="color:green;">'+syntaxHighlighter.htmltextencode(s[i++])+'</span>';
                continue;
            }
        }else if(stack[top_stack-1]==1){
            x+=syntaxHighlighter.htmltextencode(s[i++]);
            top_stack--;
            continue;
        }else if(stack[top_stack-1]==2){
            if(s[i]=='>'){
                x+=syntaxHighlighter.htmltextencode(s[i++])+'</span>';
                top_stack--;
                continue;
            }
        }else if(stack[top_stack-1]==6){
            if(s[i]=='\\'){
                stack[top_stack++]=1;
                x+=syntaxHighlighter.htmltextencode(s[i++]);
                continue;
            }
            if(s[i]=='"'){
                top_stack--;
                x+=syntaxHighlighter.htmltextencode(s[i++])+'</span>';
                continue;
            }
        }
        x+=syntaxHighlighter.htmltextencode(s[i++]);
    }
    return x;
}
})()
