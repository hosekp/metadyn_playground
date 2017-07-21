(function () {
  "use strict";
  var scenario = new metadyn.Scenario("Add WebGL blob", 'Add');
  /**
   * @typedef {{dims:Array.<int>,getArr:Function}} Space
   */
  metadyn.AddScenario(scenario);
  metadyn.utils.extend(scenario, {
    periods: [false, false],
    last: {
      width: -1,
      height: -1,
      blobarr: null
    },
    g1: null,
    canvas: null,
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
    resize: function (width, height) {
      if (!this.canvas) {
        return;
      }
      //var width=this.$can_cont.width();
      //var height=this.$can_cont.height();
      /** @type {HTMLCanvasElement} */
      var canvas = this.canvas;
      canvas.style.width = width+"px";
      canvas.style.height = height+"px";
      canvas.setAttribute("width",width);
      canvas.setAttribute("height",height);

      if (this.g1) {
        this.g1.viewport(0, 0, width, height);
      }
      this.last.width = width;
      this.last.height = height;
    },
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
    createTexture: function () {
      var gl = this.g1, texture;
      texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      //manage.console.debug("createTexture: arg is type "+(typeof typedArray));
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.bindTexture(gl.TEXTURE_2D, null);
      return texture;
    },
    updateTexture: function (texture, typedArray, width, height) {
      var gl = this.g1;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, typedArray);
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
    createFramebuffer: function (texture, width, height) {
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
    /**
     *
     * @param {Space} space1
     * @param {Space} space2
     * @param {Array.<boolean>} periods
     */
    preadd: function (space1, space2, periods) {
      //var gl = this.g1,
      var width, height;
      this.periods = periods;
      width = space1.dims[0];
      height = space1.dims[1];
      if (width !== this.last.width || height !== this.last.height) {
        this.resize(width, height);
        this.pixels = new Uint8Array(width * height * 4);
        this.updateTexture(this.frameTexture, this.pixels, width, height);
        this.updateTexture(this.frameTexture2, this.pixels, width, height);
        this.framebuffer = this.createFramebuffer(this.frameTexture, width, height);
        this.framebuffer2 = this.createFramebuffer(this.frameTexture2, width, height);
      }
      this.updateTexture(this.frameTexture, space1.getArr(), width, height);
      if (this.last.rightarr !== space2.getArr()) {
        width = space2.dims[0];
        height = space2.dims[1];
        this.updateTexture(this.rightTexture, space2.getArr(), width, height);
        this.last.rightarr = space2.getArr();
      }
      this.tick = true;
      //gl.bindFramebuffer( gl.FRAMEBUFFER, this.framebuffer);

    },
    /**
     * @param {Array.<number>} pos
     */
    add: function (pos) {
      //var gl = this.g1;
      /*if(!this.inited){return null;}
      var width=space1.dims[0];
      var height=space1.dims[1];
      if(width!==this.last.width||height!==this.last.height){
          manage.console.debug("Gl_summer: resize conducted");
          this.resize(width,height);
          this.pixels = new Uint8Array(width* height * 4);
          this.updateTexture(this.frameTexture,this.pixels,width,height);
          this.framebuffer = this.createFramebuffer(this.frameTexture, width, height);

      }
      this.updateTexture(this.leftTexture,space1.getArr(),width,height);
      if(this.last.rightarr!==space2.getArr()){
          this.updateTexture(this.rightTexture,space2.getArr(),width,height);
          this.last.rightarr=space2.getArr();
      }*/
      //var leftTexture = this.createTexture(width, height, space1.spacearr);
      //var rightTexture = this.createTexture(width, height, space2.spacearr);

      if (this.tick) {
        this.calculateFrame(this.framebuffer2, this.frameTexture, this.rightTexture, pos);
      } else {
        this.calculateFrame(this.framebuffer, this.frameTexture2, this.rightTexture, pos);
      }
      this.tick = !this.tick;
      /*gl.bindFramebuffer( gl.FRAMEBUFFER, this.framebuffer);
      gl.readPixels(0, 0, this.last.width, this.last.height, gl.RGBA, gl.UNSIGNED_BYTE, this.pixels);
      gl.bindFramebuffer( gl.FRAMEBUFFER, null);
      this.updateTexture(this.frameTexture,this.pixels,this.last.width, this.last.height);*/
      //return this.unpackTexture(pixels, width, height, 4);
    },
    /**
     * @param {Space} space1
     */
    postadd: function (space1) {
      var gl = this.g1,
          width, height;
      //gl.bindFramebuffer( gl.FRAMEBUFFER, null);
      width = space1.dims[0];
      height = space1.dims[1];
      if (this.tick) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
      } else {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer2);
      }
      gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, space1.getArr());
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    },
    calculateFrame: function (framebuffer, textureOne, textureTwo, pos) {
      var gl = this.g1;
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

      gl.bindBuffer(gl.ARRAY_BUFFER, this.coordBuffer);
      gl.vertexAttribPointer(this.program.positionLocation, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
      gl.vertexAttribPointer(this.program.texCoordLocation, 2, gl.FLOAT, false, 0, 0);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, textureOne);
      gl.uniform1i(this.program.mainTexLoc, 0);
      //gl.uniform1f(this.program.randomUniform, 1);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, textureTwo);
      gl.uniform1i(this.program.blobTexLoc, 1);

      //manage.console.debug(pos);
      //manage.console.error("prepos: "+gl.getError());
      gl.uniform3fv(this.program.posLoc, pos);
      /*var errcode=gl.getError();
      for(var prop in gl){
          if(gl[prop]===errcode){
              manage.console.error("Pos: "+prop);
              break;
          }
      }*/
      gl.uniform2f(this.program.periodsLoc, this.periods[0], this.periods[1]);
      //gl.uniform1f(this.program.canvasWidthLoc, canvasWidth);
      //gl.uniform1f(this.program.canvasHeightLoc, canvasHeight);

      //gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, BUFFERS.cubeVertexIndexBuffer);
      //gl.drawElements(gl.TRIANGLES, BUFFERS.cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);


      //gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
      gl.bindTexture(gl.TEXTURE_2D, null);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    },
    /**
     *
     * @param {int} width
     * @param {int} height
     * @return {Space}
     */
    createSpace: function (width, height) {
      var i8arr = new Uint8Array(width * height * 4);
      var i32arr=new Uint32Array(i8arr.buffer);
      return {
        dims: [width, height], getArr: function (len) {
          if(len===32) return i32arr;
          return i8arr;
        }
      }
    },

    asyncPrepare: function (callback, reject) {
      var gl, can = document.createElement("canvas");
      gl = can.getContext("webgl", {premultipliedAlpha: false}) || can.getContext("experimental-webgl", {premultipliedAlpha: false});
      this.g1 = gl;
      this.canvas = can;
      var self = this;

      this.space1 = this.createSpace(this.mainSize, this.mainSize);
      this.space2 = this.createSpace(this.blobSize, this.blobSize);
      this.populateBlob(this.space2.getArr(32),16384);
      Promise.all([
        this.initShader("add2", "vertex"),
        this.initShader("add2", "fragment")
      ]).then(function () {
        self.initProgram();
      }).then(function () {
        if (!self.leftTexture) return reject();
        self.preadd(self.space1, self.space2, [false, false]);
        return callback();
      });
    },
    syncScenario: function () {
      this.add([this.getX(), this.getY(), this.getHeight()]);
    },
    getResult: function () {
      this.postadd(this.space1);
      return this.space1.getArr()
    },
    checkResult: function () {
      this.compareResult(this.space1.getArr().length,this.mainSize*this.mainSize*4);
    }
  });


  metadyn.addWebGl = scenario;

})();
