function Cache(load){
    this.load=load
    this.status={}
    this.onLoad={}
}
Cache.prototype.require=async function(key){
    if(key instanceof Array)
        return Promise.all(key.map(key=>this.require(key)))
    if(!this.onLoad[key])
        this.onLoad[key]=this.load(key)
    return this.onLoad[key]
}
export default Cache
