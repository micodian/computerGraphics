var pyramid = function() {

    "use strict";
    
    var canvas;
    var gl;
    
    var numPositions = 12;
    
    var positions = [];
    var colors = [];
    var xAxis = 0;
    var yAxis = 1;
    var zAxis = 2;
    var direction = false;
    var axis = 0;//default rotate with respect to the x-axis
    var uTheta = [0, 0, 0];
    var uThetaLoc;

    var near = 0.3;
    var far = 3.0;//when program is ran,this has to be adjusted to view pyramid
    var radius = 4.0;
    var theta = 0.0;
    var phi = 0.0;
    var dr = 5.0 * Math.PI/180.0;
    
    var  fovy = 45.0;  // Field-of-view in Y direction angle (in degrees)
    var  aspect = 1.0;       // Viewport aspect ratio
    
    var modelViewMatrix, projectionMatrix;
    var modelViewMatrixLoc, projectionMatrixLoc;
    var eye;
    const at = vec3(0.0, 0.0, 0.0);
    const up = vec3(0.0, 1.0, 0.0);
    
    var vertices = [
        vec4(0.5, -0.2722, 0.2886),
    vec4(0.0,  -0.2772, -0.5773),
    vec4(-0.5,  -0.2722, 0.2886),
   vec4(0.0, 0.5443, 0.0)
    ];
    
    var vertexColors = [
        //vec4(0.0, 0.0, 0.0, 1.0),  // black
        //vec4(1.0, 0.0, 0.0, 1.0),  // red
        vec4(1.0, 1.0, 0.0, 1.0),  // yellow
        vec4(0.0, 1.0, 0.0, 1.0),  // green
       // vec4(0.0, 0.0, 1.0, 1.0),  // blue
        vec4(1.0, 0.0, 1.0, 1.0),  // magenta
        vec4(0.0, 1.0, 1.0, 1.0),  // cyan
        //vec4(1.0, 1.0, 1.0, 1.0),  // white
    ];
    
    


function colorPyramid()
{
    triangle(0,1,2);
    triangle(1,2,3);
    triangle(2,0,3);
    triangle(3,1,0);
   //triangle(2,1,3);
    //triangle(3,1,0);
    //triangle(0,1,2);
    //triangle(0,2,3);
    
}
    
function triangle(a, b, c)
{
   
   

    // We need to parition the pyramid into two triangles in order for
    // WebGL to be able to render it.  

    //vertex color assigned by the index of the vertex

    var indices = [a, b, c];

    for ( var i = 0; i < indices.length; ++i ) {
        positions.push( vertices[indices[i]] );
        //colors.push( vertexColors[indices[i]] );

        // for solid colored faces use
        colors.push(vertexColors[a]);
        
        
    }
   
}
    
    
    
    
    
    window.onload = function init() {
        canvas = document.getElementById("gl-canvas");
    
        gl = canvas.getContext('webgl2');
        if (!gl) alert("WebGL 2.0 isn't available");
    
        gl.viewport(0, 0, canvas.width, canvas.height);
    
        aspect =  canvas.width/canvas.height;
    
        gl.clearColor(1.0, 1.0, 1.0, 1.0);
    
        gl.enable(gl.DEPTH_TEST);
    
        //
        //  Load shaders and initialize attribute buffers
        //
        var program = initShaders(gl, "vertex-shader", "fragment-shader");
        gl.useProgram(program);
    
        colorPyramid();
    
        var cBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
    
        var colorLoc = gl.getAttribLocation(program, "aColor");
        gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(colorLoc);
    
        var vBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(positions), gl.STATIC_DRAW);
    
        var positionLoc = gl.getAttribLocation( program, "aPosition");
        gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(positionLoc);
    
        modelViewMatrixLoc = gl.getUniformLocation(program, "uModelViewMatrix");
        projectionMatrixLoc = gl.getUniformLocation(program, "uProjectionMatrix");

        uThetaLoc = gl.getUniformLocation(program, "uTheta");
    
    // sliders for viewing parameters
    
        document.getElementById("zFarSlider").onchange = function(event) {
            far = event.target.value;
        };
        document.getElementById("zNearSlider").onchange = function(event) {
            near = event.target.value;
        };
        document.getElementById("radiusSlider").onchange = function(event) {
           radius = event.target.value;
        };
        document.getElementById("thetaSlider").onchange = function(event) {
            theta = event.target.value* Math.PI/180.0;
        };
        document.getElementById("phiSlider").onchange = function(event) {
            phi = event.target.value* Math.PI/180.0;
        };
        document.getElementById("aspectSlider").onchange = function(event) {
            aspect = event.target.value;
        };
        document.getElementById("fovSlider").onchange = function(event) {
            fovy = event.target.value;
        };
        //event listeners for buttons

      document.getElementById( "xButton" ).onclick = function () {
        axis = xAxis;
      };
      document.getElementById( "yButton" ).onclick = function () {
        axis = yAxis;
    };
    document.getElementById( "zButton" ).onclick = function () {
        axis = zAxis;
    };
    document.getElementById( "Toggle-Rotation" ).onclick = function () {
        direction = !direction;
    };

    
        render();
    }
    
    
    var render = function(){
    
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
        eye = vec3(radius*Math.sin(theta)*Math.cos(phi),
            radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));
        modelViewMatrix = lookAt(eye, at, up);
        projectionMatrix = perspective(fovy, aspect, near, far);
        if(direction){
            uTheta[axis] += 2.0;
        }
        
        gl.uniform3fv(uThetaLoc, uTheta);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    
        gl.drawArrays(gl.TRIANGLES, 0, numPositions);
        requestAnimationFrame(render);
    }
    
    }
    pyramid();