import moduleLoader from 'https://cdn.rawgit.com/anliting/module/533c10b65a8b71c14de16f5ed99e466ddf8a2bae/src/esm/moduleLoader.js'
import Cache from './Cache.mjs'
function Database(name){
    Cache.call(this,async key=>{
        let module=await moduleLoader()
        this.data[key]=JSON.parse(
            await module.get(`highlighter/${name}/${key}.json`)
        )
    })
    this.data={}
}
Object.setPrototypeOf(Database.prototype,Cache.prototype)
export default Database
