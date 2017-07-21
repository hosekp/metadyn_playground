/**
 *
 * @param scenario
 * @constructor
 */
metadyn.AddScenario = function (scenario) {
  var index = 0;
  /** @mixin */
  var AddScenario = {
    mainSize: 512,
    blobSize: 512,
    sigma: 0.1,
    getX: function () {
      return [0.2,0.2,0.2,0.5,0.5,0.5,0.8,0.8,0.8][index++%9];
      // return (index++ * 0.12564) % 1
    },
    getY: function () {
      return [0.2,0.5,0.8][index++%3];
      // return (index++ * 0.35648) % 1
    },
    getHeight: function () {
      return 1;
      // return (index++ * 0.85642) % 1
    },
    populateBlob: function (data, height) {
      height = height || 1;
      var i, j, dim = this.blobSize;
      var sigmastep = dim / this.sigma;
      for (i = 0; i < dim; i++) {
        for (j = 0; j < dim; j++) {
          var val = height * Math.exp((-Math.pow((i - dim / 2) / sigmastep, 2) - Math.pow((j - dim / 2) / sigmastep, 2)) / 2);
          var offset = dim * i + j;
          data[offset] = val;
        }
      }
    },
    exportCanvas:function (data) {
      var dim = this.mainSize;
      var canvas = document.createElement("canvas");
      canvas.setAttribute("title",this.name);
      canvas.setAttribute("width",dim.toString());
      canvas.setAttribute("height",dim.toString());
      canvas.style.width = "50px";
      canvas.style.height = "50px";
      var ctx = canvas.getContext("2d");
      var imageData = ctx.getImageData(0,0,dim,dim);
      var imageArray = imageData.data;
      var max = metadyn.utils.findMaxMin(data)[0];
      for(var i=0;i<data.length;i++){
        imageArray[i*4]=255;
        imageArray[i*4+1]=Math.floor(255-data[i]/max*255);
        imageArray[i*4+2]=Math.floor(255-data[i]/max*255);
        imageArray[i*4+3]=255;
      }
      ctx.putImageData(imageData,0,0);
      document.getElementById("image_cont").appendChild(canvas);
    }
  };
  metadyn.utils.extend(scenario, AddScenario);
};
