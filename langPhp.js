(()=>{
window.syntaxHighlighter.highlight_php=highlight_php
function highlight_php(s){
    var stringset_keywords=[
        '__halt_compiler','abstract','and','array','as','break','callable','case','catch','class','clone','const','continue','declare','default','die','do','echo','else','elseif','empty','enddeclare','endfor','endforeach','endif','endswitch','endwhile','eval','exit','extends','final','finally','for','foreach','function','global','goto','if','implements','include','include_once','instanceof','insteadof','interface','isset','list','namespace','new','or','print','private','protected','public','require','require_once','return','static','switch','throw','trait','try','unset','use','var','while','xor','yield',
        ];
    var stringset_library=['echo','setcookie','date_default_timezone_set','real_escape_string','htmlentities','query','fetch_assoc','free','fopen','fclose','fscanf','header','error_reporting','ini_set','fetch_array','explode','close','date','time','md5','move_uploaded_file','unlink',
        ];
    var stringset_stlcontainers=[];
    var stringset_constants=['E_ALL','true','false',
        ];
    var regex_operators=/[()\[\]{}<>+\-*\/%,:;?&^=!~.|]/;

    var regex_specifier_characters_first=/[A-Za-z_]/;
    var regex_specifier_characters=/[0-9A-Za-z_]/;
    var regex_literal_characters_first=/[0-9]/;
    var regex_literal_characters=/[0-9ELXelx.]/;
    var regex_variable_characters_first=/[$]/;
    var regex_variable_characters=/[0-9A-Za-z_]/;
    s=syntaxHighlighter.htmltextdecode(s);
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
            last_token=syntaxHighlighter.get_token.call(s,i,
                    regex_variable_characters_first,
                    regex_variable_characters);
            if(i!=last_token){
                var token=s.substring(i+1,last_token);
                x+='<span style="color:blue;">$</span><span style="color:green;">'+token+'</span>';
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
        }else if(stack[top_stack-1]==5){
            if(s[i]=='\\'){
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
        x+=syntaxHighlighter.htmltextencode(s[i++])
    }
    return x
}
})()
