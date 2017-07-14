(function () {
  "use strict";
  var scenario = new Scenario("Add WebGL blob", 10000, 'Add');

  $.extend(scenario, {
    initShader: function (str, type) {

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
      if (this.vertex && this.fragment) {
        this.initProgram();
      }
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
    getShader: function (id, type) {
      var reader = new FileReader();
      var promise = new Promise(function (resolve, reject) {
        reader.onload = function (evt) {
          resolve(evt.result);
        };
      });
      reader.readAsText(new File(id + "-" + type + ".shd"));
      return promise;
    },

    prepare: function () {
      var gl, can = $("<canvas>");
      gl = can[0].getContext("webgl", {premultipliedAlpha: false}) || can[0].getContext("experimental-webgl", {premultipliedAlpha: false});
      this.g1 = gl;
      this.initShader("add2", "vertex");
      this.initShader("add2", "fragment");
    }
  });


  metadyn.addWebGl = scenario;

})();
