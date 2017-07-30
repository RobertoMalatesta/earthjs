// http://davidscottlyons.com/threejs/presentations/frontporch14/offline-extended.html#slide-79
export default worldUrl => {
    /*eslint no-console: 0 */
    /*eslint no-debugger: 0 */
    const _ = {
        sphereObject:null,
        onDraw: {},
        onDrawVals: [],
    };
    var canvas    = d3.select("body").append("canvas").style("display","none").attr("width","1024px").attr("height","512px");
    var context   = canvas.node().getContext("2d");
    var texture   = new THREE.Texture(canvas.node());
    var geometry  = new THREE.SphereGeometry(200,30,30);
    var material  = new THREE.MeshBasicMaterial({transparent:true});
    var projection= d3.geoEquirectangular().precision(0.5).translate([512, 256]).scale(163)
    var path      = d3.geoPath().projection(projection).context(context);
    material.map  = texture;

    function init() {
        this._.options.showTjCanvas = true;
    }

    function create() {
        const tj = this.threejsPlugin;
        if (!_.sphereObject) {
            _.sphereObject= new THREE.Mesh(geometry, material);
        }
        context.clearRect(0, 0, 1024, 512);
        context.fillStyle = "#aaa";
        context.beginPath();
        path(_.countries);
        context.fill();

        _.onDrawVals.forEach(v => {
            v.call(this, context, path);
        });
        texture.needsUpdate = true;
        _.sphereObject.visible = this._.options.showTjCanvas;
        tj.addGroup(_.sphereObject);
        tj.rotate();
    }

    return {
        name: 'canvasThreejs',
        urls: worldUrl && [worldUrl],
        onReady(err, data) {
            this.canvasThreejs.data(data);
        },
        onInit() {
            init.call(this);
        },
        onCreate() {
            create.call(this);
        },
        onRefresh() {
            _.sphereObject.visible = this._.options.showTjCanvas;
        },
        onDraw(obj) {
            Object.assign(_.onDraw, obj);
            _.onDrawVals = Object.keys(_.onDraw).map(k => _.onDraw[k]);
        },
        data(data) {
            if (data) {
                _.world = data;
                _.countries = topojson.feature(data, data.objects.countries);
            } else {
                return  _.world;
            }
        },
    }
}