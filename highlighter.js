/*
 * Alt's Syntax Highlighter
 * /highlighter.js
 * Version: 2015-03-01
 * Author: An-Li Alt Ting
 * Email: anlialtting@gmail.com
 */
'use strict';
function htmltextencode(s){
    var e=document.createElement('div');
    e.appendChild(document.createTextNode(s));
    return e.innerHTML;
}
function htmltextdecode(s){
    var e=document.createElement('div');
    e.innerHTML=s;
    return e.firstChild.data;
}
function contain(key){
    var bound=this.indexOf(key);
    return bound!=-1&&this[bound]==key;
}
function get_token(i,regex_first,regex){
    if(regex_first.test(this[i])){
        i++;
        while(i<this.length&&regex.test(this[i]))
            i++;
    }
    return i;
}
function highlight_cpp(s){
    /*
     * `stringset_keywords` contains `Keywords` and `Alternative representations`.
     * Standard: N3242 2.13.
     * Compelete.
     */
    var stringset_keywords=[
        // Keywords
        'alignas','alignof','asm','auto','bool','break','case','catch','char','char16_t','char32_t','class','const','constexpr','const_cast','continue','default','delete','double','do','dynamic_cast','else','enum','explicit','export','extern','false','float','for','friend','goto','if','inline','int','long','mutable','namespace','new','noexcept','nullptr','operator','private','protected','public','register','reinterpret_cast','return','short','signed','sizeof','static','static_assert','static_cast','struct','switch','template','this','thread_local','throw','true','try','typedef','typeid','typename','union','unsigned','using','virtual','void','volatile','wchar_t','while',
        // Alternative representations
        'and','and_eq','bitand','bitor','compl','not','not_eq','or','or_eq','xor','xor_eq',
        ];
    /*
     * `stringset_library` contains following:
     * Algorithms library - Non-modifying sequence operations
     * Algorithms library - Modifying sequence operations
     * Algorithms library - Sorting and related operations
     * Algorithms library - C library algorithms
     * Numerics library - Floating-Point Environment
     * Numerics library - Complex numbers
     * Numerics library - Random number generation
     * Standard: N3242 25, 26.
     * Algorithm Compelete.
     */
    var stringset_library=[
        // Algorithms library - Non-modifying sequence operations
        'all_of','any_of','none_of','for_each','find','find_if','find_if_not','find_end','find_first_of','adjacent_find','count','count_if','mismatch','equal','is_permutation','search','search_n',
        // Algorithms library - Modifying sequence operations
        'copy','copy_n','copy_if','copy_backward','move','move_backward','swap_ranges','iter_swap','transform','replace','replace_if','replace_copy','replace_copy_if','fill','fill_n','generate','generate_n','remove','remove_if','remove_copy','remove_copy_if','unique','unique_copy','reverse','reverse_copy','rotate','rotate_copy','random_shuffle','is_partitioned','partition','stable_partition','partition_copy','partition_point',
        // Algorithms library - Sorting and related operations
        'sort','stable_sort','partial_sort','partial_sort_copy','is_sorted','is_sorted_until','nth_element','lower_bound','upper_bound','equal_range','binary_search','merge','inplace_merge','includes','set_union','set_intersection','set_difference','set_symmetric_difference','push_heap','pop_heap','make_heap','sort_heap','is_heap','is_heap_until','min','max','minmax','min_element','max_element','minmax_element','lexicographical_compare','next_permutation','prev_permutation',// Algorithms library - C library algorithms
        'bsearch','qsort',
        // Numerics library - Floating-Point Environment
        'feclearexcept','fegetexceptflag','feraiseexcept','fesetexceptflag','fetestexcept','fegetround','fesetround','fegetenv','feholdexcept','fesetenv','feupdateenv',
        // Numerics library - Complex numbers
        'complex','real','imag','abs','arg','norm','conj','proj','polar','acos','asin','atan','acosh','asinh','atanh','cos','cosh','exp','log','log10','pow','sin','sinh','sqrt','tan','tanh',
        // Numerics library - Random number generation
        'linear_congruential_engine','mersenne_twister_engine','subtract_with_carry_engine','discard_block_engine','independent_bits_engine','shuffle_order_engine','minstd_rand0','minstd_rand','mt19937','mt19937_64','ranlux24_base','ranlux48_base','ranlux24','ranlux48','knuth_b','default_random_engine','random_device','seed_seq','RealType generate_canonical(URNG& g)','uniform_int_distribution','uniform_real_distribution','bernoulli_distribution','binomial_distribution','geometric_distribution','negative_binomial_distribution','poisson_distribution','exponential_distribution','gamma_distribution','weibull_distribution','extreme_value_distribution','normal_distribution','lognormal_distribution','chi_squared_distribution','cauchy_distribution','fisher_f_distribution','student_t_distribution','discrete_distribution','piecewise_constant_distribution','piecewise_linear_distribution',
        //
        'accumulate','adjacent_difference','advance','back','begin','chdir','chroot','cin','copy','copy','count','count_if','cout','distance','empty','end','endl','equal_range','execl','exit','fclose','fflush','fgets','FILE','fill','first','fopen','for_each','fork','fprintf','fputc','fputs','fputs','freopen','front','fscanf','getchar','getpagesize','gets','inner_product','int16_t','int32_t','int64_t','int8_t','uint16_t','uint32_t','uint64_t','uint8_t','ios_base','islower','isupper','iterator','kill','malloc','max','max_element','memset','min','min_element','nice','partial_sum','pclose','pop','popen','printf','ptrace','push','push_back','puts','random_shuffle','remove','reverse','scanf','second','setvbuf','size','sort','sprintf','sscanf','std','stdin','stdout','strcat','strcmp','strcpy','strlen','strncmp','swap','sync_with_stdio','top','unique','plus','equal','is_permutation','search','search_n','memcpy','log2','log10','log','exp','pow','round','floor','ceil','sqrt','clock','clock_t','erase','insert','plus','minus','multiplies','divides','modulus','negate','less','greater',
        ];
    var stringset_stlcontainers=[
        'array','bitset','deque','forward_list','list','map','multimap','multiset','pair','priority_queue','queue','set','stack','string','unordered_map','unordered_set','valarray','vector',
        ];
    var stringset_constants=[
        // Numerics library - Floating-Point Environment
        'FE_ALL_EXCEPT','FE_DIVBYZERO','FE_INEXACT','FE_INVALID','FE_OVERFLOW','FE_UNDERFLOW','FE_DOWNWARD','FE_TONEAREST','FE_TOWARDZERO','FE_UPWARD','FE_DFL_ENV',
        //
        'EOF','EXIT_FAILURE','EXIT_SUCCESS','INFINITY','INT_MAX','INT_MIN','LONG_MAX','LONG_MIN','NULL',
        ];
    var regex_operators=/[()\[\]{}<>+\-*\/%,:;?&^=!~.|]/;
    var regex_specifier_characters_first=/[A-Za-z_]/;
    var regex_specifier_characters=/[0-9A-Za-z_]/;
    var regex_literal_characters_first=/[0-9]/;
    var regex_literal_characters=/[0-9ELXelx.]/;
    s=htmltextdecode(s);
    var x='';
    /*
       define values in stack
       0 the problem
       1 backslash
       2 single-row comment
       3 multi-row comment
       4 preprocessor instruction
       5 character literal
       6 string literal
       7 preprocessor instruction - include
       8 preprocessor instruction - define
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
            last_token=get_token.call(s,i,
                    regex_specifier_characters_first,
                    regex_specifier_characters);
            if(i!=last_token){
                var token=s.substring(i,last_token);
                if(contain.call(stringset_keywords,token)){
                    x+='<span class="keywords">'+token+'</span>';
                }else if(contain.call(stringset_library,token)){
                    x+='<span class="library">'+token+'</span>';
                }else if(contain.call(stringset_stlcontainers,token)){
                    x+='<span class="stlcontainers">'+token+'</span>';
                }else if(contain.call(stringset_constants,token)){
                    x+='<span class="constants">'+token+'</span>';
                }else
                    x+=token;
                i=last_token;
                continue;
            }
            last_token=get_token.call(s,i,
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
                x+=htmltextencode(s[i++]);
                continue;
            }
            if(i+1<s.length&&s[i]=='/'&&s[i+1]=='/'){
                stack[top_stack++]=2;
                x+='<span style="color:gray;">'+htmltextencode(s[i++]);
                continue;
            }
            if(i+1<s.length&&s[i]=='/'&&s[i+1]=='*'){
                stack[top_stack++]=3;
                x+='<span style="color:gray;">'+htmltextencode(s[i++]);
                continue;
            }
            if(s[i]=='#'){
                stack[top_stack++]=4;
                x+='<span style="color:green;">'+htmltextencode(s[i++]);
                continue;
            }
            if(s[i]=='\''){
                stack[top_stack++]=5;
                x+='<span style="color:blue;">'+htmltextencode(s[i++]);
                continue;
            }
            if(s[i]=='"'){
                stack[top_stack++]=6;
                x+='<span style="color:blue;">'+htmltextencode(s[i++]);
                continue;
            }
            if(regex_operators.test(s[i])){
                x+='<span style="color:red;">'+htmltextencode(s[i++])+'</span>';
                continue;
            }
        }else if(stack[top_stack-1]==1){
            x+=htmltextencode(s[i++]);
            top_stack--;
            continue;
        }else if(stack[top_stack-1]==2){
            if(s[i]=='\\'){
                stack[top_stack++]=1;
                x+=htmltextencode(s[i++]);
                continue;
            }
            if(s[i]=='\n'){
                x+='</span>';
                top_stack--;
                continue;
            }
        }else if(stack[top_stack-1]==3){
            if(i+1&&s[i]=='*'&&s[i+1]=='/'){
                x+=htmltextencode(s[i++]);
                x+=htmltextencode(s[i++]);
                top_stack--;
                x+='</span>';
                continue;
            }
        }else if(stack[top_stack-1]==4){
            if(s[i]=='\n'){
                x+='</span>';
                top_stack--;
                continue;
            }
            if(s[i]=='\\'){
                stack[top_stack++]=1;
                x+=htmltextencode(s[i++]);
                continue;
            }
            if(i+1<s.length&&s[i]=='/'&&s[i+1]=='/'){
                stack[top_stack++]=2;
                x+='<span style="color:gray;">'+htmltextencode(s[i++]);
                continue;
            }
            if(i+1<s.length&&s[i]=='/'&&s[i+1]=='*'){
                stack[top_stack++]=3;
                x+='<span style="color:gray;">'+htmltextencode(s[i++]);
                continue;
            }
            var last_token;
            last_token=get_token.call(s,i,
                    regex_specifier_characters_first,
                    regex_specifier_characters);
            if(i!=last_token){
                var token=s.substring(i,last_token);
                x+=token;
                if(token=='include'){
                    stack[top_stack++]=7;
                    x+='<span style="color:darkred;">';
                }else if(token=='define'){
                    stack[top_stack++]=8;
                }
                i=last_token;
                continue;
            }
        }else if(stack[top_stack-1]==5){
            if(s[i]=='\\'){
                stack[top_stack++]=1;
                x+=htmltextencode(s[i++]);
                continue;
            }
            if(s[i]=='\''){
                x+=htmltextencode(s[i++])+'</span>';
                top_stack--;
                continue;
            }
        }else if(stack[top_stack-1]==6){
            if(s[i]=='\\'){
                stack[top_stack++]=1;
                x+=htmltextencode(s[i++]);
                continue;
            }
            if(s[i]=='"'){
                top_stack--;
                x+=htmltextencode(s[i++])+'</span>';
                continue;
            }
        }else if(stack[top_stack-1]==7){
            if(s[i]=='\n'){
                x+='</span>';
                top_stack--;
                continue;
            }
            if(s[i]=='\\'){
                stack[top_stack++]=1;
                x+=htmltextencode(s[i++]);
                continue;
            }
            if(i+1<s.length&&s[i]=='/'&&s[i+1]=='/'){
                stack[top_stack++]=2;
                x+='<span style="color:gray;">'+htmltextencode(s[i++]);
                continue;
            }
            if(i+1<s.length&&s[i]=='/'&&s[i+1]=='*'){
                stack[top_stack++]=3;
                x+='<span style="color:gray;">'+htmltextencode(s[i++]);
                continue;
            }
        }else if(stack[top_stack-1]==8){
            if(s[i]=='\n'){
                top_stack--;
                continue;
            }
            if(s[i]=='\\'){
                stack[top_stack++]=1;
                x+=htmltextencode(s[i++]);
                continue;
            }
            if(i+1<s.length&&s[i]=='/'&&s[i+1]=='/'){
                stack[top_stack++]=2;
                x+='<span style="color:gray;">'+htmltextencode(s[i++]);
                continue;
            }
            if(i+1<s.length&&s[i]=='/'&&s[i+1]=='*'){
                stack[top_stack++]=3;
                x+='<span style="color:gray;">'+htmltextencode(s[i++]);
                continue;
            }
            if(regex_operators.test(s[i])){
                x+='<span style="color:blue;">'+htmltextencode(s[i++])+'</span>';
                continue;
            }
        }
        x+=htmltextencode(s[i++]);
    }
    return x;
}
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
    s=htmltextdecode(s);
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
            last_token=get_token.call(s,i,
                    regex_specifier_characters_first,
                    regex_specifier_characters);
            if(i!=last_token){
                var token=s.substring(i,last_token);
                if(contain.call(stringset_tags,token)){
                    x+='<span style="color:darkblue;"><b>'+token+'</b></span>';
                }else if(contain.call(stringset_properties,token)){
                    x+='<span style="color:deeppink;">'+token+'</span>';
                }else if(contain.call(stringset_stlcontainers,token)){
                    x+='<span style="color:limegreen;"><b>'+token+'</b></span>';
                }else if(contain.call(stringset_constants,token)){
                    x+='<span style="color:darkviolet;"><b>'+token+'</b></span>';
                }else
                    x+=token;
                i=last_token;
                continue;
            }
            last_token=get_token.call(s,i,
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
                x+=htmltextencode(s[i++]);
                continue;
            }
            if(i+1<s.length&&s[i]=='<'&&s[i+1]=='!'){
                stack[top_stack++]=2;
                x+='<span style="color:gray;">'+htmltextencode(s[i++]);
                continue;
            }
            if(s[i]=='"'){
                stack[top_stack++]=6;
                x+='<span style="color:blue;">'+htmltextencode(s[i++]);
                continue;
            }
            if(regex_operators.test(s[i])){
                x+='<span style="color:green;">'+htmltextencode(s[i++])+'</span>';
                continue;
            }
        }else if(stack[top_stack-1]==1){
            x+=htmltextencode(s[i++]);
            top_stack--;
            continue;
        }else if(stack[top_stack-1]==2){
            if(s[i]=='>'){
                x+=htmltextencode(s[i++])+'</span>';
                top_stack--;
                continue;
            }
        }else if(stack[top_stack-1]==6){
            if(s[i]=='\\'){
                stack[top_stack++]=1;
                x+=htmltextencode(s[i++]);
                continue;
            }
            if(s[i]=='"'){
                top_stack--;
                x+=htmltextencode(s[i++])+'</span>';
                continue;
            }
        }
        x+=htmltextencode(s[i++]);
    }
    return x;
}
function highlight_js(s){
    var stringset_keywords=[
        'break','case','catch','continue','debugger','default','delete','do','else','finally','for','function','if','in','instanceof','new','return','switch','this','throw','try','typeof','var','void','while','with'
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
    s=htmltextdecode(s);
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
            last_token=get_token.call(s,i,
                    regex_specifier_characters_first,
                    regex_specifier_characters);
            if(i!=last_token){
                var token=s.substring(i,last_token);
                if(contain.call(stringset_keywords,token)){
                    x+='<span style="color:darkblue;"><b>'+token+'</b></span>';
                }else if(contain.call(stringset_library,token)){
                    x+='<span style="color:deeppink;">'+token+'</span>';
                }else if(contain.call(stringset_stlcontainers,token)){
                    x+='<span style="color:limegreen;"><b>'+token+'</b></span>';
                }else if(contain.call(stringset_constants,token)){
                    x+='<span style="color:darkviolet;"><b>'+token+'</b></span>';
                }else
                    x+=token;
                i=last_token;
                continue;
            }
            last_token=get_token.call(s,i,
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
                x+=htmltextencode(s[i++]);
                continue;
            }
            if(i+1<s.length&&s[i]=='/'&&s[i+1]=='/'){
                stack[top_stack++]=2;
                x+='<span style="color:gray;">'+htmltextencode(s[i++]);
                continue;
            }
            if(i+1<s.length&&s[i]=='/'&&s[i+1]=='*'){
                stack[top_stack++]=3;
                x+='<span style="color:gray;">'+htmltextencode(s[i++]);
                continue;
            }
            if(s[i]=='\''){
                stack[top_stack++]=5;
                x+='<span style="color:blue;">'+htmltextencode(s[i++]);
                continue;
            }
            if(s[i]=='"'){
                stack[top_stack++]=6;
                x+='<span style="color:blue;">'+htmltextencode(s[i++]);
                continue;
            }
            if(regex_operators.test(s[i])){
                x+='<span style="color:red;">'+htmltextencode(s[i++])+'</span>';
                continue;
            }
        }else if(stack[top_stack-1]==1){
            x+=htmltextencode(s[i++]);
            top_stack--;
            continue;
        }else if(stack[top_stack-1]==2){
            if(s[i]=='\\'){
                stack[top_stack++]=1;
                x+=htmltextencode(s[i++]);
                continue;
            }
            if(s[i]=='\n'){
                x+='</span>';
                top_stack--;
                continue;
            }
        }else if(stack[top_stack-1]==3){
            if(i+1&&s[i]=='*'&&s[i+1]=='/'){
                x+=htmltextencode(s[i++]);
                x+=htmltextencode(s[i++]);
                top_stack--;
                x+='</span>';
                continue;
            }
        }else if(stack[top_stack-1]==5){ if(s[i]=='\\'){
                stack[top_stack++]=1;
                x+=htmltextencode(s[i++]);
                continue;
            }
            if(s[i]=='\''){
                x+=htmltextencode(s[i++])+'</span>';
                top_stack--;
                continue;
            }
        }else if(stack[top_stack-1]==6){
            if(s[i]=='\\'){
                stack[top_stack++]=1;
                x+=htmltextencode(s[i++]);
                continue;
            }
            if(s[i]=='"'){
                top_stack--;
                x+=htmltextencode(s[i++])+'</span>';
                continue;
            }
        }
        x+=htmltextencode(s[i++]);
    }
    return x;
}
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
    s=htmltextdecode(s);
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
            last_token=get_token.call(s,i,
                    regex_specifier_characters_first,
                    regex_specifier_characters);
            if(i!=last_token){
                var token=s.substring(i,last_token);
                if(contain.call(stringset_keywords,token)){
                    x+='<span style="color:darkblue;"><b>'+token+'</b></span>';
                }else if(contain.call(stringset_library,token)){
                    x+='<span style="color:deeppink;">'+token+'</span>';
                }else if(contain.call(stringset_stlcontainers,token)){
                    x+='<span style="color:limegreen;"><b>'+token+'</b></span>';
                }else if(contain.call(stringset_constants,token)){
                    x+='<span style="color:darkviolet;"><b>'+token+'</b></span>';
                }else
                    x+=token;
                i=last_token;
                continue;
            }
            last_token=get_token.call(s,i,
                    regex_literal_characters_first,
                    regex_literal_characters);
            if(i!=last_token){
                var token=s.substring(i,last_token);
                x+='<span style="color:darkviolet;">'+token+'</span>';
                i=last_token;
                continue;
            }
            last_token=get_token.call(s,i,
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
                x+=htmltextencode(s[i++]);
                continue;
            }
            if(i+1<s.length&&s[i]=='/'&&s[i+1]=='/'){
                stack[top_stack++]=2;
                x+='<span style="color:gray;">'+htmltextencode(s[i++]);
                continue;
            }
            if(i+1<s.length&&s[i]=='/'&&s[i+1]=='*'){
                stack[top_stack++]=3;
                x+='<span style="color:gray;">'+htmltextencode(s[i++]);
                continue;
            }
            if(s[i]=='\''){
                stack[top_stack++]=5;
                x+='<span style="color:blue;">'+htmltextencode(s[i++]);
                continue;
            }
            if(s[i]=='"'){
                stack[top_stack++]=6;
                x+='<span style="color:blue;">'+htmltextencode(s[i++]);
                continue;
            }
            if(regex_operators.test(s[i])){
                x+='<span style="color:red;">'+htmltextencode(s[i++])+'</span>';
                continue;
            }
        }else if(stack[top_stack-1]==1){
            x+=htmltextencode(s[i++]);
            top_stack--;
            continue;
        }else if(stack[top_stack-1]==2){
            if(s[i]=='\\'){
                stack[top_stack++]=1;
                x+=htmltextencode(s[i++]);
                continue;
            }
            if(s[i]=='\n'){
                x+='</span>';
                top_stack--;
                continue;
            }
        }else if(stack[top_stack-1]==3){
            if(i+1&&s[i]=='*'&&s[i+1]=='/'){
                x+=htmltextencode(s[i++]);
                x+=htmltextencode(s[i++]);
                top_stack--;
                x+='</span>';
                continue;
            }
        }else if(stack[top_stack-1]==5){
            if(s[i]=='\\'){
                stack[top_stack++]=1;
                x+=htmltextencode(s[i++]);
                continue;
            }
            if(s[i]=='\''){
                x+=htmltextencode(s[i++])+'</span>';
                top_stack--;
                continue;
            }
        }else if(stack[top_stack-1]==6){
            if(s[i]=='\\'){
                stack[top_stack++]=1;
                x+=htmltextencode(s[i++]);
                continue;
            }
            if(s[i]=='"'){
                top_stack--;
                x+=htmltextencode(s[i++])+'</span>';
                continue;
            }
        }
        x+=htmltextencode(s[i++]);
    }
    return x;
}
function text_border(s,overflow){
    overflow=overflow||'auto';
    var x='',y='';
    var res=s.split('\n');
    for(var i=0;i<res.length-1;i++)
        x+='<span style="color:gray;">'+i+'</span><br>';
    for(var i=0;i<res.length;i++)
        y+=res[i]+'<br>';
    var css_fontfamiliy=
        'font-family:'+
        '\'Monospace\','+
        '\'Consolas\','+
        '\'Monaco\','+
        '\'Bitstream Vera Sans Mono\''+
        ',\'Courier New\''+
        ',\'Courier\','+
        '\'monospace\';';
    var css_overflow='';
    if(overflow==='auto')
        css_overflow='overflow-x:auto;';
    var css_pre='margin:0px;';
    return'<table><tr><td style="width:12px;text-align:right;vertical-align:top;"><pre style="'+
        css_fontfamiliy+css_overflow+css_pre+'">'+x+
        '</pre><td style="padding-left:12px;"><pre style="max-width:800px;'+
        css_fontfamiliy+css_overflow+css_pre+'">'+y+'</pre></table>';
}
function highlight_all(e){
    e=e||document;
    var a;
    a=e.getElementsByClassName('highlighted_cpp');
    for(var i=0;i<a.length;i++){
        a[i].innerHTML=highlight_cpp(a[i].innerHTML);
        a[i].style.visibility='visible';
    }
    a=e.getElementsByClassName('highlighted_html');
    for(var i=0;i<a.length;i++){
        a[i].innerHTML=highlight_html(a[i].innerHTML);
        a[i].style.visibility='visible';
    }
    a=e.getElementsByClassName('highlighted_js');
    for(var i=0;i<a.length;i++){
        a[i].innerHTML=highlight_js(a[i].innerHTML);
        a[i].style.visibility='visible';
    }
    a=e.getElementsByClassName('highlighted_php');
    for(var i=0;i<a.length;i++){
        a[i].innerHTML=highlight_php(a[i].innerHTML);
        a[i].style.visibility='visible';
    }
}
function border_all(e){
    e=e||document;
    var a=e.getElementsByClassName('bordered');
    for(var i=0;i<a.length;i++){
        a[i].innerHTML=text_border(a[i].innerHTML,'auto');
        a[i].style.visibility='visible';
    }
}
