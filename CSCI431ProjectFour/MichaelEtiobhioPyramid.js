"use strict";

var canvas;
var gl;

var numPositions  = 12;//four faces , drawing four triangles with 12 vertices

var positions = [];//hold vertices of 12 triangles
var colors = [];//hold color for all vertices

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;//default rotate with respect to the x-axis
var theta = [0, 0, 0];


var vertices = [
    //vec4(0.0,-0.25,-0.5),
    //vec4(0.0,0.25,0.0),
    //vec4(0.5,-0.25,0.25),
    //vec4(-0.5,-0.25,0.25)
    vec4(0.5, -0.2722, 0.2886),
    vec4(0.0,  -0.2772, -0.5773),
    vec4(-0.5,  -0.2722, 0.2886),
   vec4(0.0, 0.5443, 0.0)
];

var vertexColors = [
    //vec4(0.0, 0.0, 0.0, 1.0),  // black
    vec4(0.0, 0.0, 1.0, 1.0),  // blue
    vec4(1.0, 0.0, 1.0, 1.0),  // magenta
    vec4(0.0, 1.0, 1.0, 1.0),  // cyan
    vec4(1.0, 1.0, 0.0, 1.0)  // yellow
    //vec4(0.0, 1.0, 0.0, 1.0)  // green
   // vec4(0.0, 0.0, 1.0, 1.0)  // blue
    //vec4(1.0, 0.0, 1.0, 1.0) // magenta
   // vec4(0.0, 1.0, 1.0, 1.0),  // cyan
   // vec4(1.0, 1.0, 1.0, 1.0)   // white
];


var thetaLoc;

window.onload = function init()
{
    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    colorPyramid();

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var colorLoc = gl.getAttribLocation( program, "aColor" );
    gl.vertexAttribPointer( colorLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( colorLoc );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positions), gl.STATIC_DRAW);


    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    thetaLoc = gl.getUniformLocation(program, "uTheta");

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

    render();
}

function colorPyramid()
{
    triangle(2,1,3);
    triangle(3,1,0);
    triangle(0,1,2);
    triangle(0,2,3);
    
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

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    theta[axis] += 2.0;
    gl.uniform3fv(thetaLoc, theta);

    gl.drawArrays(gl.TRIANGLES, 0, numPositions);
    requestAnimationFrame(render);
}



