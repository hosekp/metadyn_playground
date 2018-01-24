"use strict";
/**
 *
 * @param {Scenario} scenario
 * @constructor
 */
metadyn.WebGLDrawScenario = function (scenario) {
  metadyn.DrawScenario(scenario);
  metadyn.utils.extend(scenario, {
    g1: null,
    vertex: null,
    fragment: null,
    inited: false,
    $can: null,
    program: null,
    INTER: 16384,
    shader: "",
    contourStep: 0,
    asyncPrepare: function (callback, reject) {
      // noinspection JSBitwiseOperatorUsage
      if (this.dim & (this.dim - 1)) {
        throw "dim " + this.dataDim + " is not power-of-2 !"
      }
      // noinspection JSBitwiseOperatorUsage
      if (this.dataDim & (this.dataDim - 1)) {
        throw "dataDim " + this.dataDim + " is not power-of-2 !"
      }
      /**
       *
       * @type {HTMLCanvasElement}
       */
      this.canvas = this.createCanvas();
      var data = this.prepareData(this.dataDim);
      var i8array = new Uint8Array(this.dataDim * this.dataDim * 4);
      var i32array = new Uint32Array(i8array.buffer);
      data = Array.from(data, function (value) {
        return Math.floor(value * 16384)
      });
      i32array.set(data);
      this.sourceData = i8array;
      if (!this.initGL(this.canvas)) {
        return callback();
      }
      var self = this;
      return Promise.all([
        this.initShader(this.shader, "vertex"),
        this.initShader(this.shader, "fragment")
      ]).then(function () {
        self.initProgram();
      }).then(function () {
        return callback();
        // if (!self.leftTexture) return reject();
        // self.preadd(self.space1, self.space2, [false, false]);
        // return callback();
      });

      //if(!this.initShaders()){return false;}
      //this.initBuffers();
      //this.initParam();
      //this.initTextures();
      //var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
      //gl.uniform2f(resolutionLocation, main.width, main.height);
    },
    resize: function (width, height) {
      if (this.g1) {
        this.g1.viewport(0, 0, width, height);
      }
    },
    /**
     * @param {HTMLCanvasElement} can
     */
    initGL: function (can) {
      var params, gl;
      //draw.drawer.appendCanvas();
      try {
        params = {premultipliedAlpha: false, preserveDrawingBuffer: true};
        gl = can.getContext("webgl", params)
            || can.getContext("experimental-webgl", params);
      } catch (e) {
        this.skipReason = e;
        return false;
      }
      if (!gl) {
        this.skipReason = "WebGL: Could not initialize WebGL context";
        return false;
      }
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      this.g1 = gl;
      //this.resize();
      return true;
    },
    initShader: function (id, type) {
      var self = this;
      return this.getShader(id, type).then(function (text) {
        self.processShader(text, type);
      });
    },
    getShader: function (id, type) {
      var xobj = new XMLHttpRequest();
      xobj.overrideMimeType("text");
      xobj.open('GET', './js/scenarios/draw/' + id + '-' + type + '.shd', true); // Replace 'my_data' with the path to your file
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
    processShader: function (str, typ) {
      var gl = this.g1, shader;
      if (typ === "vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
      } else if (typ === "fragment") {
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
      if (typ === "vertex") {
        this.vertex = shader;
      } else if (typ === "fragment") {
        this.fragment = shader;
      } else {
        return null;
      }
    },
    initProgram: function () {
      var gl = this.g1,
          progr = gl.createProgram();
      this.program = progr;
      gl.attachShader(progr, this.vertex);
      gl.attachShader(progr, this.fragment);
      gl.linkProgram(progr);
      if (!gl.getProgramParameter(progr, gl.LINK_STATUS)) {
        metadyn.utils.warning("WebGL: Could to initialize shader program");
        this.loadFailed();
        return false;
      }
      this.initParam();
      gl.useProgram(progr);
      this.initBuffers();
      this.initTextures();
      return true;
    },
    initParam: function () {
      var gl = this.g1,
          progr = this.program;
      progr.positionLocation = gl.getAttribLocation(progr, "a_position");
      gl.enableVertexAttribArray(progr.positionLocation);

      progr.texCoordLocation = gl.getAttribLocation(progr, "a_texCoord");
      gl.enableVertexAttribArray(progr.texCoordLocation);

      progr.zmaxLoc = gl.getUniformLocation(progr, "u_zmax");
      progr.stepLoc = gl.getUniformLocation(progr, "u_step");
      progr.cmarginLoc = gl.getUniformLocation(progr, "u_cmargin");

      //program.texCoordLocation=texCoordLocation;

    },
    initBuffers: function () {
      var gl = this.g1;
      this.coordBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.coordBuffer);
      //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0,  1.0, -1.0,  1.0, 1.0, -1.0, 1.0,  1.0]), gl.STATIC_DRAW);
      this.coordarr = new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]);
      gl.bufferData(gl.ARRAY_BUFFER, this.coordarr, gl.STATIC_DRAW);
      this.texCoordBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]), gl.STATIC_DRAW);
      // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0]), gl.STATIC_DRAW);
      //gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1.0,-1.0,1.0,-1.0,-1.0,1.0,-1.0,1.0,1.0,-1.0,1.0,1.0]),gl.STATIC_DRAW);
    },
    initTextures: function () {
      var gl = this.g1,
          texture = gl.createTexture();
      gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      // metadyn.utils.log("WebGL: loaded");
    },
    draw: function (array, zmax) {
      var gl = this.g1, resol;
      // nat = view.axi.natureRange(0, zmax, 10, false);
      //manage.console.debug("step="+nat[2]);
      //manage.console.debug("drawing");
      gl.bindBuffer(gl.ARRAY_BUFFER, this.coordBuffer);
      //this.updateCoord();
      gl.bufferData(gl.ARRAY_BUFFER, this.coordarr, gl.STATIC_DRAW);
      gl.vertexAttribPointer(this.program.positionLocation, 2, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
      gl.vertexAttribPointer(this.program.texCoordLocation, 2, gl.FLOAT, false, 0, 0);
      gl.uniform1f(this.program.zmaxLoc, zmax * 64);
      gl.uniform1f(this.program.stepLoc, this.contourStep * 64);
      gl.uniform1f(this.program.cmarginLoc, 0.003 /*/ control.settings.zoompow()*/);
      /*var arrBuffer=gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER,arrBuffer);
      gl.bufferData(gl.ARRAY_BUFFER,graf.arrbuf,gl.STATIC_DRAW);
      gl.vertexAttribPointer(this.program.arrBuffLocation,1,gl.FLOAT,false,0,0);*/
      //graf.compArr();
      //main.cons(graf.bytearr.length);
      resol = this.dataDim;

      if (resol * resol * 4 !== array.length) {
        throw "WebGL: Wrong length of texture array";
      }

      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, resol, resol, 0, gl.RGBA, gl.UNSIGNED_BYTE, array);
      //var err=gl.getError();if(err!==gl.NO_ERROR){manage.console.error("WebGL texture error: ",err);}
      //array=new Uint8Array([0,80,160,240]);
      //gl.texImage2D(gl.TEXTURE_2D, 0, gl.ALPHA,2,2,0,gl.ALPHA,gl.UNSIGNED_BYTE,array);
      //texImage2D (ulong target, long level, ulong intformat, ulong width, ulong height, long border, ulong format, ulong type, Object data )
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      //var err=gl.getError();if(err!==gl.NO_ERROR){manage.console.error("WebGL draw error: ",err);}
    },
    updateCoordOld: function () {
      var zoompow, posx, posy, xlow, xhigh, ylow, yhigh, mustr, i, arr,
          sett = control.settings;
      posx = sett.frameposx.get();
      posy = sett.frameposy.get();
      zoompow = sett.zoompow();
      xlow = posx * zoompow;
      xhigh = zoompow + posx * zoompow;
      ylow = posy * zoompow;
      yhigh = zoompow + posy * zoompow;
      //arr[0]=xlow;
      arr = this.coordarr;
      mustr = [xlow, ylow, xhigh, ylow, xlow, yhigh, xlow, yhigh, xhigh, ylow, xhigh, yhigh];
      for (i = 0; i < 12; i += 1) {
        arr[i] = mustr[i];
      }
      //[0,0, 1,0, 0,1, 0,1, 1,0, 1,1]
    },
    updateCoord: function () {

    },
    syncScenario: function () {
      this.draw(this.sourceData, 1);
    },
    getResult: function () {
      var copyCanvas = this.createCanvas();
      var copyCtx = copyCanvas.getContext("2d");
      copyCtx.drawImage(this.canvas, 0, 0);
      return copyCtx.getImageData(0, 0, this.dim, this.dim).data;
    }
  });
  return scenario;
};

