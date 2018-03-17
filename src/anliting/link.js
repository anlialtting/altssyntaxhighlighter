let
    rollup=require('rollup'),
    skip=[
        'https://rawgit.com/anliting/althea/8ccb030c6f1917895314f493da16123642081760/src/AltheaServer/HttpServer/files/lib/core.static.js'
    ]
async function link(input,file){
    let bundle=await rollup.rollup({
        input,
        external:s=>skip.includes(s),
    })
    await bundle.write({
        file,
        format:'es',
        paths:s=>skip.includes(s)&&s,
    })
}
;(async()=>{
    await link(`highlighter.mjs`,`highlighter.static.mjs`)
    // for rawgit
    await link(`highlighter.mjs`,`highlighter.static.js`)
})()
