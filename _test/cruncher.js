/* var running = false;

onmessage = function (event) {
  // doesn't matter what the message is, just toggle the worker
  console.log(event);
  if (running == false) {
    running = true;
    run();
  } else {
    running = false;
  }
};

function run() {
  var n = 1;
  search: while (running) {
    n += 1;
    for (var i = 2; i <= Math.sqrt(n); i += 1)
      if (n % i == 0)
       continue search;
    // found a prime!
    postMessage(n);
  }
} */


/**
 * Double Density Relaxation Algorithm
 * Particles Fluid Simulation
 */

/**
 * namespace
 */
var ddra = {};

ddra.$version = 0.1;

ddra.config = {
    gridResolution: 20,
    particleRadius: 20, //should <= gridResolution
    gravity: 0.01 // number or vector2
}

/**
 * ddra.Class
 */

;(function ($, undefined) {
    var context = $ || this,
        old = context.Class,
        f = 'function',
        fnTest = /xyz/.test(function() {
            xyz
        }) ? /\bsupr\b/: /.*/,
        proto = 'prototype';
    
    function Class(o) {
        return extend.call(isFn(o) ? o: function() {},
        o, 1);
    }

    function isFn(o) {
        return typeof o === f;
    }

    function wrap(k, fn, supr) {
        return function() {
            var tmp = this.supr;
            this.supr = supr[proto][k];
            var ret = fn.apply(this, arguments);
            this.supr = tmp;
            return ret;
        }
    }

    function process(what, o, supr) {
        for (var k in o) {
            if (o.hasOwnProperty(k)) {
                what[k] = isFn(o[k]) && isFn(supr[proto][k]) && fnTest.test(o[k]) ? wrap(k, o[k], supr) : o[k];
            }
        }
    }

    function extend(o, fromSub) {
        // must redefine noop each time so it doesn't inherit from previous arbitrary classes
        function noop() {}
        noop[proto] = this[proto];
        
        var supr = this,
        prototype = new noop(),
        isFunction = isFn(o),
        _constructor = isFunction ? o: this,
        _methods = isFunction ? {}: o;
        
        function fn() {
            if (this.initialize) this.initialize.apply(this, arguments);
            else {
                fromSub || isFunction && supr.apply(this, arguments);
                _constructor.apply(this, arguments);
            }
        }

        fn.methods = function(o) {
            process(prototype, o, supr);
            fn[proto] = prototype;
            return this;
        }

        fn.methods.call(fn, _methods).prototype.constructor = fn;

        fn.extend = arguments.callee;
        fn[proto].implement = fn.statics = function(o, optFn) {
            o = typeof o == 'string' ? (function() {
                var obj = {};
                obj[o] = optFn;
                return obj;
            } ()) : o;
            process(this, o, supr);
            return this;
        }

        return fn;
    }
    
    
    Class.noConflict = function() {
        context.Class = old;
        return this;
    }

    // public interface
    context.Class = Class;
     

})(ddra);

/**
 * ddra.util
 */

;(function ($, undefined) {
    
    
    function extend (target, source, isOverwrite) {
        if (isOverwrite == undefined) { isOverwrite = true }
        for (var k in source) {
            if (!(k in target) || isOverwrite) {
                target[k] = source[k];
            }
        }
        return target;
    }

    
    $.extend = extend;

})(ddra);

/**
 * ddra.Vector2
 */

;(function ($, undefined) {

    var Vector2 = $.Class(function (x, y) {
        this.x = x;
        this.y = y;

    }).methods({
        manitude: function () {
            return Math.sqrt(this.x*this.x + this.y*this.y);
        },
        add: function (v) {
            this.x += v.x;
            this.y += v.y;
            return this;
        },
        sub: function (v) {
            this.x -= v.x;
            this.y -= v.y;
            return this;
        },
        mul: function (f) {
            this.x *= f;
            this.y *= f;
            return this;
        },
        div: function (f) {
            this.x /= f;
            this.y /= f;
            return this;
        },
        addNew: function (v) {
            return new Vector2(this.x + v.x, this.y + v.y);
        },
        subNew: function (v) {
            return new Vector2(this.x - v.x, this.y - v.y);
        },
        mulNew: function (f) {
            return new Vector2(this.x * f, this.y * f);
        },
        divNew: function (f) {
            return new Vector2(this.x / f, this.y / f);
        },

        equal: function (v) {
            return (this.x === v.x && this.y === v.y);
        },
        copy: function () {
            return new Vector2(this.x, this.y);
        },

        dot: function (v) {
            return this.x * v.x + this.y * v.y;
        },
        cross: function (v) {
            return this.x * v.x - this.y * v.y;
        },
        length: function () {
            return this.manitude();
        },
        normalize: function () {
            var inv = 1/this.length();
            return this.mul(inv);
        }
    
    });

    $.Vector2 = Vector2;

})(ddra);

/**
 * ddra.Particle
 * @class
 */

;(function ($, undefined) {

    var Particle = $.Class(function (x, y) {
        this.pos = x instanceof $.Vector2 ? x : new $.Vector2(x, y);
        this.oldpos = this.pos.copy();
        this.velocity = new $.Vector2(0, 0);
        this.width = 0;
        this.height = 0;
    
    }).methods({
        simulate: function () {
            
        },

        applyGravity: function () {
            
        }

    
    });

    $.Particle = Particle;

})(ddra);

/**
 * ddra.Collection
 * collection 
 */

;(function ($, undefined) {
    
    var toString = Object.prototype.toString,
        push = Array.prototype.push,
        slice = Array.prototype.slice;
    
    var Collection = $.Class(function () {
        this.length = 0;
        
    }).methods({

        size: function () {
            return this.length;
        },
        toArray: function () {
            return slice.call(this, 0);
        },

        simulate: function () {
            this.dispatch('simulate');
        },
        dispatch: function (fnName) {
            for (var i = 0; i < this.length; i ++) {
                (fnName in this[i]) && this[i][fnName].call(this[i]);
            }
        },
        
        push: push,
        sort: [].sort,
        splice: [].splice
    
    });
    
    $.Collection = Collection;

})(ddra);


/**
 * ddra.FluidParticle
 * 针对流体粒子的particle
 */
 
;(function ($, undefined) {

    var FluidParticle = $.Particle.extend(function (x, y, collection) {
        if (x instanceof $.Vector2) {
            this.pos = x;
            this.collection = y;
        }
        this.pos =  new $.Vector2(x, y);
        this.oldpos = this.pos.copy();
        this.velocity = new $.Vector2(0, 0);
        
        this.collection = collection;
        this.width = 12;
        this.height = 12;
        
        if (!this.collection) {
            throw 'FluidParticles need a FluidCollection!'
        }

    }).methods({
        simulate: function () {
            // todo
        },
        // step 1
        simulate1: function () {
            this.updateNeighbors();
            this.applyGravity();
        },
        // setp 2
        simulate2: function () {
            this.ddra();
        },
        // step 3
        simulate3: function () {
            // calculate next velocity
            this.velocity = this.pos.subNew(this.oldpos);
            // draw
            //this.draw();
            // for worker
            //postMessage(JSON.stringify({x: this.pos.x-this.width/2, y: this.pos.y-this.height/2}))
            data.push({x: this.pos.x-this.width/2, y: this.pos.y-this.height/2});
        },
        
        draw: function () {
            this.collection.ctx.drawImage(document.getElementById('particle'), this.pos.x - this.width/2, this.pos.y - this.height/2);
        },
        updateNeighbors: function () {
            var grid = this.collection.grids[Math.round(this.pos.y / this.collection.cfg.gridResolution) * this.collection.nbx + Math.round(this.pos.x / this.collection.cfg.gridResolution)];
            
            grid && grid.push(this);
        },
        applyGravity: function () {
            var g = this.collection.cfg.gravity;
            g = g instanceof $.Vector2 ? g : new $.Vector2(0, g);
            this.velocity.add(g);
            this.oldpos = this.pos.copy();
            this.pos.add(this.velocity);
        },
        // Double Density Relaxation Algorithm
        ddra: function () {
            var pressure = 0,
                pressureNear = 0,
                nl = 0;
            // grid pos
            var gridpos = new $.Vector2(Math.round(this.pos.x / this.collection.cfg.gridResolution),
                                        Math.round(this.pos.y / this.collection.cfg.gridResolution));
            // 3*3 grid
            for (var i = -1; i <= 1; i ++) {
                for (var j = -1; j <= 1; j ++) {
                    var h = this.collection.grids[(gridpos.y + j) * this.collection.nbx + (gridpos.x + i)]; 
                    if (h && h.hasNeighbors()) { 
                        // foreach neighbors pair
                        for (var a = 0, l = h._i; a < l; a++) { 
                            var pn = h.neighbors[a]; 
                            if (pn != this) { 
                                var dv = pn.pos.subNew(this.pos);
                                var vlen = dv.length();
                                if (vlen < this.collection.cfg.particleRadius){ 
                                    // compute density and near-density 
                                    var q = 1 - (vlen / this.collection.cfg.particleRadius); 
                                    pressure += q * q; // quadratic spike 
                                    pressureNear += q * q * q; // cubic spike 
                                    pn.q = q; 
                                    pn.vl = dv.mulNew(q).divNew(vlen);

                                    this.collection.neighbors[nl++] = pn; 
                                } 
                            } 
                        } 
                    } 
                }
            }
            
            this.boundaryLimit();
            // relaxation
            this.relaxation(pressure, pressureNear, nl);
        },
        // boundaryLimit
        boundaryLimit: function () {
            var rad = this.collection.cfg.particleRadius,
                nw = this.collection.width,
                nh = this.collection.height,
                halfW = this.width/2,
                halfH = this.height/2;
            
            // horizontal check
            if (this.pos.x < rad){ 
                var q = 1 - Math.abs(this.pos.x / rad); 
                this.pos.x += q * q * 0.5; 
            } else if (this.pos.x > nw - rad){ 
                var q = 1 - Math.abs((nw - this.pos.x) / rad); 
                this.pos.x -= q * q * 0.5; 
            } 
            
            // vertical check
            if (this.pos.y < rad){ 
                var q = 1 - Math.abs(this.pos.y / rad); 
                this.pos.y += q * q * 0.5; 
            } else if (this.pos.y > nh - rad){ 
                var q = 1 - Math.abs((nh - this.pos.y) / rad); 
                this.pos.y -= q * q * 0.5; 
            } 
            
            if (this.pos.x < halfW) {
                this.pos.x = halfW;
            } else if (this.pos.x > nw - halfW) {
                this.pos.x = nw - halfW;
            }  
            
            if (this.pos.y < halfH) {
                this.pos.y = halfH;
            } else if (this.pos.y > nh - halfH) {
                this.pos.y = nh - halfH;
            }  
            
        },
        relaxation: function (pressure, pressureNear, nl) {
            pressure = (pressure - 3) * 0.5; 
            pressureNear *= 0.5; 
            for (var a = 0; a < nl; a++){ 
                var np = this.collection.neighbors[a]; 
                // apply displacements 
                var p = pressure + pressureNear * np.q; 

                var dd = np.vl.mulNew(p * 0.5);
                np.pos.add(dd);
                this.pos.sub(dd);
            } 
        }
        
    });
    
    $.FluidParticle = FluidParticle;

})(ddra);

/**
 * ddra.FluidCollection
 * 针对流体粒子的collection
 */
 
;(function ($, undefined) {
    
    // particle neighbors; grid info
    var Grid = $.Class(function () {
        this._i = 0;
        this.neighbors = [];
    }).methods({
        push: function (p) {
            this.neighbors[this._i++] = p;
        },
        reset: function () {
            this._i = 0;
            //this.neighbors = [];
        },
        hasNeighbors: function () {
            return this.neighbors.length > 0;
        }
    });
    
    // 默认以canvas边界为容器边界
    var FluidCollection = $.Class(function (canvas, config) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.cfg = $.extend($.config, config || {});
        
        this.nbx = 0;
        this.nby = 0;
        this.width = this.canvas.width || this.canvas.offsetWidth;
        this.height = this.canvas.height || this.canvas.offsetHeight;
        this.grids = [];
        this.neighbors = [];
        
        this.particles = new $.Collection();
        
        this.initGrid();
    }).methods({
        initGrid: function () {
            // calculate nbx, nby;
            this.nbx = Math.round(this.width / this.cfg.gridResolution) + 1;
            this.nby = Math.round(this.height / this.cfg.gridResolution) + 1;
            // init grid
            for (var i = 0; i < this.nbx * this.nby; i ++) {
                this.grids[i] = new Grid();
            }
        },
        push: function (p) {
            return this.particles.push(p);
        },
        simulate: function () {
            for (var i = 0; i < this.grids.length; i ++) this.grids[i].reset();
            this.particles.dispatch('simulate1');
            this.particles.dispatch('simulate2');
            this.particles.dispatch('simulate3');
        },
        clearCanvas: function () {
            this.ctx.clearRect(0, 0, this.width, this.height);
        }
    
    });
    
    $.FluidCollection = FluidCollection;

})(ddra);

var coll, data = [];
onmessage = function (event) {
    var $ = ddra,
    canvas = {
        width: 600,
        height: 400,
        getContext: function () {}
    };
    coll = new $.FluidCollection(canvas);
    for (var i = 0; i < 2000; i ++) {
        coll.push(new $.FluidParticle(Math.random()*coll.width, Math.random()*coll.height, coll));
    }
    _init();
}
function _init() {

    coll.simulate();
    postMessage(JSON.stringify(data));
    data = [];


    setTimeout(_init, 0);
    
}