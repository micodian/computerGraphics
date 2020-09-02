var gl;
var points;

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");

    gl= WebGLUtils.setupWebGL( canvas );
    if(!gl){
        alert("WebGL isnt available");
    }
} 
//four Vertices

var vertices = [
    vec2(-0.5,-0.5),
    vec2(-0.5,0.5),
    vec2(0.5,0.5),
    vec2(0.5,-0.5)
];

//configure WebGL

gl.viewport(0,0,canvas.width,canvas.height);
gl.clearColor(0.0,0.0,0.0,1.0);
//load shaders and initialize attribute buffers
var program = initShaders(gl,"vertex-shader","fragment-shader");
gl.useProgram(program);

//load the data into the GPU
var bufferId = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices),gl.STATIC_DRAW);

//associate out shader variables with out data buffer

var vPosition = gl.getAttribLocation(program, "vPosition");
gl.vertexAttribPointer(vPosition,2,gl.FLOAT,false,0,0);
gl.enableVertexAttribArray(vPosition);
