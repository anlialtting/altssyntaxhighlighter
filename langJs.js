(()=>{
window.syntaxHighlighter.highlight_js=highlight_js
function highlight_js(s){
    var stringset_keywords=[
            /*
                Following keywords are listed on:
                https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar
            */
            'break',
            'case',
            'class',
            'catch',
            'const',
            'continue',
            'debugger',
            'default',
            'delete',
            'do',
            'else',
            'export',
            'extends',
            'finally',
            'for',
            'function',
            'if',
            'import',
            'in',
            'instanceof',
            'let',
            'new',
            'return',
            'super',
            'switch',
            'this',
            'throw',
            'try',
            'typeof',
            'var',
            'void',
            'while',
            'with',
            'yield',
        ];
    var stringset_library=[
        'alert',
        ];
    var stringset_stlcontainers=[];
    var stringset_constants=[];
    var regex_operators=/[()\[\]{}<>+\-*\/%,:;?&^=!~.|]/;
    var regex_specifier_characters_first=/[A-Za-z_]/;
    var regex_specifier_characters=/[0-9A-Za-z_]/;
    var regex_literal_characters_first=/[0-9]/;
    var regex_literal_characters=/[0-9ELXelx.]/;
    //s=syntaxHighlighter.htmltextdecode(s);
    var x='';
    /*
       define values in stack
       0 the problem
       1 backslash
       2 single-row comment
       3 multi-row comment
       4 regex literal /
       5 string literal '
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
                if(syntaxHighlighter.contain.call(stringset_keywords,token)){
                    x+='<span style="color:darkblue;"><b>'+token+'</b></span>';
                }else if(syntaxHighlighter.contain.call(stringset_library,token)){
                    x+='<span style="color:deeppink;">'+token+'</span>';
                }else if(syntaxHighlighter.contain.call(stringset_stlcontainers,token)){
                    x+='<span style="color:limegreen;"><b>'+token+'</b></span>';
                }else if(syntaxHighlighter.contain.call(stringset_constants,token)){
                    x+='<span style="color:darkviolet;"><b>'+token+'</b></span>';
                }else
                    x+=token;
                i=last_token;
                continue;
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
            if(i+1<s.length&&s[i]=='/'&&s[i+1]=='/'){
                stack[top_stack++]=2;
                x+='<span style="color:gray;">'+syntaxHighlighter.htmltextencode(s[i++]);
                continue;
            }
            if(i+1<s.length&&s[i]=='/'&&s[i+1]=='*'){
                stack[top_stack++]=3;
                x+='<span style="color:gray;">'+syntaxHighlighter.htmltextencode(s[i++]);
                continue;
            }
            if(s[i]=='\''){
                stack[top_stack++]=5;
                x+='<span style="color:blue;">'+syntaxHighlighter.htmltextencode(s[i++]);
                continue;
            }
            if(s[i]=='"'){
                stack[top_stack++]=6;
                x+='<span style="color:blue;">'+syntaxHighlighter.htmltextencode(s[i++]);
                continue;
            }
            if(regex_operators.test(s[i])){
                x+='<span style="color:red;">'+syntaxHighlighter.htmltextencode(s[i++])+'</span>';
                continue;
            }
        }else if(stack[top_stack-1]==1){
            x+=syntaxHighlighter.htmltextencode(s[i++]);
            top_stack--;
            continue;
        }else if(stack[top_stack-1]==2){
            if(s[i]=='\\'){
                stack[top_stack++]=1;
                x+=syntaxHighlighter.htmltextencode(s[i++]);
                continue;
            }
            if(s[i]=='\n'){
                x+='</span>';
                top_stack--;
                continue;
            }
        }else if(stack[top_stack-1]==3){
            if(i+1&&s[i]=='*'&&s[i+1]=='/'){
                x+=syntaxHighlighter.htmltextencode(s[i++]);
                x+=syntaxHighlighter.htmltextencode(s[i++]);
                top_stack--;
                x+='</span>';
                continue;
            }
        }else if(stack[top_stack-1]==5){ if(s[i]=='\\'){
                stack[top_stack++]=1;
                x+=syntaxHighlighter.htmltextencode(s[i++]);
                continue;
            }
            if(s[i]=='\''){
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
