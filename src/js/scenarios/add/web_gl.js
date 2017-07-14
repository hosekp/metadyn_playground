(function () {
  "use strict";
  var scenario = new metadyn.Scenario("Add WebGL blob", 10000, 'Add');

  metadyn.utils.extend(scenario, {
    initShader: function (id, type) {
      var self = this;
      return this.getShader(id, type).then(function (text) {
        self.processShader(text, type);
      });
    },
    // getShader: function (id, type) {
    //   var reader = new FileReader();
    //   var promise = new Promise(function (resolve, reject) {
    //     reader.onloadend = function (evt) {
    //       resolve(evt.target.result);
    //     };
    //   });
    //   var file = new File([""], id + "-" + type + ".shd");
    //   reader.readAsText(file);
    //   return promise;
    // },
    getShader: function (id, type) {
      var xobj = new XMLHttpRequest();
      xobj.overrideMimeType("text");
      xobj.open('GET', './js/scenarios/add/' + id + '-' + type + '.shd', true); // Replace 'my_data' with the path to your file
      var promise = new Promise(function (resolve, reject) {
        xobj.onreadystatechange = function () {
          if (xobj.readyState === 4 && xobj.status === 200) {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            resolve(xobj.responseText);
          }
        };
      });
      xobj.send(null);
      return promise;
    },
    processShader: function (str, type) {
      var gl = this.g1, shader;
      if (type === "vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
      } else if (type === "fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
      } else {
        return null;
      }
      gl.shaderSource(shader, str);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        this.loadFailed(gl.getShaderInfoLog(shader));
        return null;
      }
      //manage.console.debug(typ+"Shader parsed and compiled");
      if (type === "vertex") {
        this.vertex = shader;
      } else if (type === "fragment") {
        this.fragment = shader;
      } else {
        return null;
      }
    },
    loadFailed: function (text) {
      metadyn.utils.error(text);
    },
    initProgram: function () {
      var gl = this.g1, progr;
      progr = gl.createProgram();
      this.program = progr;
      gl.attachShader(progr, this.vertex);
      gl.attachShader(progr, this.fragment);
      gl.linkProgram(progr);
      if (!gl.getProgramParameter(progr, gl.LINK_STATUS)) {
        this.loadFailed("Gl_summer:", "Linker: " + gl.getProgramInfoLog(progr));
        return false;
      }
      gl.useProgram(progr);
      this.initParam();
      this.initBuffers();
      return true;
    },
    initParam: function () {
      var gl = this.g1, progr;
      progr = this.program;
      progr.positionLocation = gl.getAttribLocation(progr, "a_position");
      gl.enableVertexAttribArray(progr.positionLocation);

      progr.texCoordLocation = gl.getAttribLocation(progr, "a_texCoord");
      gl.enableVertexAttribArray(progr.texCoordLocation);

      progr.mainTexLoc = gl.getUniformLocation(progr, "mainTex");
      progr.blobTexLoc = gl.getUniformLocation(progr, "blobTex");
      progr.periodsLoc = gl.getUniformLocation(progr, "periods");
      //progr.canvasWidthLoc = gl.getUniformLocation(progr, "canvasWidth");
      //progr.canvasHeightLoc = gl.getUniformLocation(progr, "canvasHeight");
      progr.posLoc = gl.getUniformLocation(progr, "pos");

    },
    initBuffers: function () {
      var gl = this.g1;
      this.coordBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.coordBuffer);
      //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0,  1.0, -1.0,  1.0, 1.0, -1.0, 1.0,  1.0]), gl.STATIC_DRAW);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
      this.texCoordBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]), gl.STATIC_DRAW);
      //gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1.0,-1.0,1.0,-1.0,-1.0,1.0,-1.0,1.0,1.0,-1.0,1.0,1.0]),gl.STATIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      this.initTextures();
      //this.test();
    },
    initTextures: function () {
      this.leftTexture = this.createTexture();
      this.rightTexture = this.createTexture();
      this.frameTexture = this.createTexture();
      this.frameTexture2 = this.createTexture();
    },
    createTexture: function() {
      var gl = this.g1,texture;
      texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      //manage.console.debug("createTexture: arg is type "+(typeof typedArray));
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.bindTexture(gl.TEXTURE_2D, null);
      return texture;
    },
    updateTexture: function(texture,typedArray,width,height){
      var gl = this.g1;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,width,height,0, gl.RGBA, gl.UNSIGNED_BYTE, typedArray);
      gl.bindTexture(gl.TEXTURE_2D, null);
    },
    /*creaupdateTexture:function(typedArray,width,height){
     var gl = this.g1;
     var texture = gl.createTexture();
     gl.bindTexture(gl.TEXTURE_2D, texture);
     //manage.console.debug("createTexture: arg is type "+(typeof typedArray));
     gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,width,height,0, gl.RGBA, gl.UNSIGNED_BYTE, typedArray);
     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
     gl.bindTexture(gl.TEXTURE_2D, null);
     return texture;
     },*/
    createFramebuffer: function(texture, width, height) {
      var gl = this.g1,
          globalRenderBufferId = gl.createRenderbuffer(),
          globalFbo = gl.createFramebuffer();

      gl.bindRenderbuffer(gl.RENDERBUFFER, globalRenderBufferId);
      gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
      gl.isRenderbuffer(globalRenderBufferId);
      gl.bindRenderbuffer(gl.RENDERBUFFER, null);

      gl.bindFramebuffer(gl.FRAMEBUFFER, globalFbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, globalRenderBufferId);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);


      return globalFbo;
    },

    asyncPrepare: function (callback) {
      var gl, can = document.createElement("canvas");
      gl = can.getContext("webgl", {premultipliedAlpha: false}) || can.getContext("experimental-webgl", {premultipliedAlpha: false});
      this.g1 = gl;
      var self = this;
      Promise.all([
        this.initShader("add2", "vertex"),
        this.initShader("add2", "fragment")
      ]).then(function () {
        self.initProgram();
      }).then(function () {
        return callback();
      });
    },
    syncScenario: function () {
      if (this.leftTexture) {
        console.log("WebGL inited");
      } else {
        this.loadFailed("left texture missing");
      }

    }
  });


  metadyn.addWebGl = scenario;

})();
