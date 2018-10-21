// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"util.ts":[function(require,module,exports) {
"use strict";

exports.__esModule = true;

exports.shuffle = function (list) {
  for (var i = list.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var x = list[i];
    list[i] = list[j];
    list[j] = x;
  }
};

exports.each = function (list, iterator) {
  for (var i = 0, l = list.length; i < l; i++) {
    iterator(list[i], i, list);
  }
};

exports.map = function (list, iterator) {
  var output = new Array(list.length);

  for (var i = 0, l = list.length; i < l; i++) {
    output[i] = iterator(list[i], i, list);
  }

  return output;
};

exports.times = function (length, iterator) {
  var output = new Array(length);

  for (var i = 0; i < length; i++) {
    output[i] = iterator(i, output);
  }

  return output;
};

exports.reduce = function (list, iterator, memo) {
  for (var i = 0, l = list.length; i < l; i++) {
    memo = iterator(memo, list[i], i, list);
  }

  return memo;
};

exports.clamp = function (n, min, max) {
  return Math.max(min, Math.min(max, n));
};

exports.coinFlip = function () {
  return Math.random() < 0.5;
};

exports.assertNever = function (value) {
  throw new TypeError("never violation: " + JSON.stringify(value));
};
},{}],"simulation/vector-n.ts":[function(require,module,exports) {
"use strict";

exports.__esModule = true;

var util_1 = require("../util");

var curryMath = function curryMath(math) {
  return function (a, b) {
    var c = new Float32Array(a.length);
    var isNumB = typeof b === "number";

    for (var i = 0, l = a.length; i < l; i++) {
      var an = a[i];
      var bn = isNumB ? b : b[i];
      c[i] = math(an, bn);
    }

    return c;
  };
};

exports.add = curryMath(function (an, bn) {
  return an + bn;
});
exports.subtract = curryMath(function (an, bn) {
  return an - bn;
});
exports.multiply = curryMath(function (an, bn) {
  return an * bn;
});
exports.divide = curryMath(function (an, bn) {
  return an / bn;
});

exports.getDistanceSq = function (a, b) {
  var delta = exports.subtract(a, b);
  return exports.getMagnitudeSq(delta);
};

exports.getDistance = function (a, b) {
  return Math.sqrt(exports.getDistanceSq(a, b));
};

exports.getMagnitudeSq = function (v) {
  var magnitudeSq = 0;

  for (var i = 0, l = v.length; i < l; i++) {
    magnitudeSq += v[i] * v[i];
  }

  return magnitudeSq;
};

exports.getMagnitude = function (v) {
  return Math.sqrt(exports.getMagnitudeSq(v));
};

exports.setMagnitude = function (v, magnitude) {
  var prevMagnitude = exports.getMagnitude(v);
  return prevMagnitude === 0 ? exports.add(v, Math.sqrt(magnitude / v.length)) : exports.multiply(v, magnitude / prevMagnitude);
};

exports.limitMagnitude = function (v, limit) {
  var limitSq = limit * limit;
  var currSq = exports.getMagnitudeSq(v);
  return currSq > limitSq ? exports.multiply(v, limitSq / currSq) : v;
};

exports.getAverage = function (vectors) {
  if (vectors.length === 0) throw new Error("Cannot average zero vectors");
  var count = vectors.length;
  var dimensions = vectors[0].length;
  var average = new Float32Array(dimensions);

  for (var i = 0; i < count; i++) {
    for (var j = 0; j < dimensions; j++) {
      average[j] = average[j] + vectors[i][j] / count;
    }
  }

  return average;
};

exports.radialRandomize = function (v, radius) {
  if (radius === void 0) {
    radius = 1;
  } // Algorithm via Colin Ballast


  var result = new Float32Array(v);
  var radiusSq = radius * radius;

  for (var i = 0, l = v.length; i < l; i++) {
    var value = Math.random() * Math.sqrt(radiusSq);
    var valueSq = value * value;
    radiusSq -= valueSq;
    result[i] = util_1.coinFlip() ? value : -value;
  }

  util_1.shuffle(result);
  return result;
};

exports.backfill = function (newV, oldV) {
  var filled = new Float32Array(newV.length);

  for (var i = 0, l = newV.length; i < l; i++) {
    filled[i] = i < oldV.length ? oldV[i] : newV[i];
  }

  return filled;
};
},{"../util":"util.ts"}],"simulation/neighbors.ts":[function(require,module,exports) {
"use strict";

exports.__esModule = true;

var vector_n_1 = require("./vector-n");

var util_1 = require("../util");
/**
 * Calculate the Neighbor[] list for each Particle
 */


exports.getNeighborhood = function (particles) {
  return util_1.map(particles, function (particle) {
    var neighbors = []; // Find relation with every other Particle

    util_1.each(particles, function (other, index) {
      if (particle === other) return;
      var delta = vector_n_1.subtract(particle.position, other.position);
      var distance = vector_n_1.getMagnitude(delta);
      return {
        index: index,
        delta: delta,
        distance: distance
      };
    }); // Sort relations by nearest -> furthest

    neighbors.sort(function (a, b) {
      return a.distance - b.distance;
    });
    return neighbors;
  });
};
},{"./vector-n":"simulation/vector-n.ts","../util":"util.ts"}],"simulation/behavior/orbits.ts":[function(require,module,exports) {
"use strict";

exports.__esModule = true;

var util_1 = require("../../util");

var vector_n_1 = require("../vector-n");

exports.orbits = function (particles, _neighborhood, config) {
  // Attract each particle to the center
  var minDistSq = config.distance.min * config.distance.min;
  var maxDistSq = config.distance.max * config.distance.max;
  var mass = config.mass;
  util_1.each(particles, function (particle) {
    var force = vector_n_1.multiply(particle.position, -1); // vector to center

    var distanceSq = util_1.clamp(vector_n_1.getMagnitudeSq(force), minDistSq, maxDistSq);
    var strength = mass.g * mass.attractor * mass.orbiter / distanceSq;
    force = vector_n_1.setMagnitude(force, strength);
    force = vector_n_1.divide(force, config.mass.orbiter);
    particle.acceleration = vector_n_1.add(particle.acceleration, force);
  });
};
},{"../../util":"util.ts","../vector-n":"simulation/vector-n.ts"}],"simulation/behavior/behavior.ts":[function(require,module,exports) {
"use strict";

exports.__esModule = true;

var orbits_1 = require("./orbits");

var BehaviorNames;

(function (BehaviorNames) {
  BehaviorNames["Orbits"] = "orbits";
})(BehaviorNames = exports.BehaviorNames || (exports.BehaviorNames = {}));

var behaviors = {
  orbits: orbits_1.orbits
};

exports.behavior = function (particles, neighborhood, spec) {
  return behaviors[spec.name](particles, neighborhood, spec.config);
};
},{"./orbits":"simulation/behavior/orbits.ts"}],"simulation/bounding/centerScaling.ts":[function(require,module,exports) {
"use strict";

exports.__esModule = true;

var vector_n_1 = require("./../vector-n");

var util_1 = require("../../util");

exports.centerScaling = function (particles, radius) {
  if (particles.length < 1) return; // Avoid Math.sqrt

  var radiusSq = radius * radius; // Find longest distance between individual particle & origin

  var largestMagnitudeSq = util_1.reduce(particles, function (memo, p) {
    return Math.max(memo, vector_n_1.getMagnitudeSq(p.position));
  }, 0); // Abort if already within limits

  if (largestMagnitudeSq <= radiusSq) return; // Scale down all particle positions

  var factor = radiusSq / largestMagnitudeSq;
  util_1.each(particles, function (p) {
    return p.position = vector_n_1.multiply(p.position, factor);
  });
};
},{"./../vector-n":"simulation/vector-n.ts","../../util":"util.ts"}],"simulation/bounding/bounding.ts":[function(require,module,exports) {
"use strict";

exports.__esModule = true;

var centerScaling_1 = require("./centerScaling");

var BoundingNames;

(function (BoundingNames) {
  BoundingNames["CenterScaling"] = "centerScaling";
})(BoundingNames = exports.BoundingNames || (exports.BoundingNames = {}));

var boundings = {
  centerScaling: centerScaling_1.centerScaling
};

exports.bounding = function (particles, radius, name) {
  return boundings[name](particles, radius);
};
},{"./centerScaling":"simulation/bounding/centerScaling.ts"}],"simulation/simulation-worker.ts":[function(require,module,exports) {
"use strict";

exports.__esModule = true;

var neighbors_1 = require("./neighbors");

var vector_n_1 = require("./vector-n");

var vector_n_2 = require("./vector-n");

var util_1 = require("../util");

var behavior_1 = require("./behavior/behavior");

var bounding_1 = require("./bounding/bounding");
/**
 * TypeScript currently does not support loading both "DOM" and "WebWorker"
 * type definitions (in the tsconfig "lib" field), so we are falling back to
 * incomplete types hacked out of the desired definitions file
 *
 * Issue:
 * https://github.com/Microsoft/TypeScript/issues/20595
 *
 * Hack:
 * node_modules/typescript/lib/lib.webworker.d.ts -> typings/custom.d.ts
 *
 * Actual:
 * https://developer.mozilla.org/en-US/docs/Web/API/DedicatedWorkerGlobalScope
 *
 */


var context = self; // TODO const context = (self as any) as DedicatedWorkerGlobalScope;

var DEFAULT_CONFIG = {
  behaviorSpec: {
    name: behavior_1.BehaviorNames.Orbits,
    config: {
      mass: {
        g: 1,
        orbiter: 1,
        attractor: 1
      },
      distance: {
        min: 1,
        max: 1
      }
    }
  },
  boundingName: bounding_1.BoundingNames.CenterScaling,
  max: {
    force: 1,
    speed: 1,
    radius: 100
  }
};
var simulation = {
  config: DEFAULT_CONFIG,
  data: {
    particles: [],
    neighborhood: []
  }
};

var isWorkerMessage = function isWorkerMessage(val) {
  return val && typeof val.type === "string";
}; // safe enough


context.addEventListener("message", function (e) {
  var message = JSON.parse(e.data);
  if (!isWorkerMessage(message)) return;

  switch (message.type) {
    case "init":
      {
        simulation.config = message.config || DEFAULT_CONFIG;
        simulation.data.particles = message.particles;
        simulation.data.neighborhood = neighbors_1.getNeighborhood(message.particles);
        break;
      }

    case "tick":
      {
        tick();
        context.postMessage(JSON.stringify(simulation.data));
        break;
      }

    case "destroy":
      {
        context.close();
        break;
      }

    default:
      {
        util_1.assertNever(message);
      }
  }
});

var tick = function tick() {
  // Reset accelerations
  util_1.each(simulation.data.particles, function (p) {
    return p.acceleration = vector_n_2.multiply(p.acceleration, 0);
  }); // Apply particle behavior

  behavior_1.behavior(simulation.data.particles, simulation.data.neighborhood, simulation.config.behaviorSpec); // Update positions

  util_1.each(simulation.data.particles, function (p) {
    p.velocity = vector_n_1.add(p.velocity, p.acceleration);
    p.velocity = vector_n_1.limitMagnitude(p.velocity, simulation.config.max.speed);
    p.position = vector_n_1.add(p.position, p.velocity);
  }); // Apply particle bounding

  bounding_1.bounding(simulation.data.particles, simulation.config.max.radius, simulation.config.boundingName); // Re-calculate Particle relations

  simulation.data.neighborhood = neighbors_1.getNeighborhood(simulation.data.particles);
};
},{"./neighbors":"simulation/neighbors.ts","./vector-n":"simulation/vector-n.ts","../util":"util.ts","./behavior/behavior":"simulation/behavior/behavior.ts","./bounding/bounding":"simulation/bounding/bounding.ts"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "55738" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","simulation/simulation-worker.ts"], null)
//# sourceMappingURL=/simulation-worker.3fbf0b2c.map