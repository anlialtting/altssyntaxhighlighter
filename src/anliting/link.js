let
    rollup=require('rollup'),
    skip=[
        'https://rawgit.com/anliting/althea/e7e8805ef158bb86edfb1cd31eda881c8b4bab79/src/AltheaServer/HttpServer/files/lib/core.static.js'
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
