var canvas;
var gl;

var verticeSize  = 12;

var texSize = 256;
var values = 8;

objectRotationSpeed = 100;

var program;

var texture1, texture2;
var t1, t2;

var c;

var flag = true;

var firstImage = new Uint8Array(4*texSize*texSize);

    for ( var i = 0; i < texSize; i++ ) {
        for ( var j = 0; j <texSize; j++ ) {
            var planex = Math.floor(i/(texSize/values));
            var planey = Math.floor(j/(texSize/values));
            if(planex%2 ^ planey%2) c = 255;
            else c = 0;
           
            firstImage[4*i*texSize+4*j] = c;
            firstImage[4*i*texSize+4*j+1] = c;
            firstImage[4*i*texSize+4*j+2] = c;
            firstImage[4*i*texSize+4*j+3] = 255;
        }
    }
    
var secondImage = new Uint8Array(4*texSize*texSize);

    // Creating pattern 
    for ( var i = 0; i < texSize; i++ ) {
        for ( var j = 0; j <texSize; j++ ) {
            secondImage[4*i*texSize+4*j] = 127+127*Math.sin(0.1*i*j);
            secondImage[4*i*texSize+4*j+1] = 127+127*Math.sin(0.1*i*j);
            secondImage[4*i*texSize+4*j+2] = 127+127*Math.sin(0.1*i*j);
            secondImage[4*i*texSize+4*j+3] = 255;
           }
    }

var pointsArray = [];
var colorsArray = [];
var texCoordsArray = [];

var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];

var verticeArray = [
   vec4(0.5,-0.2722,0.2886,1.0),
   vec4(0.0,-0.2772,-0.5773,1.0),
   vec4(-0.5,-0.2722,0.2886,1.0),
   vec4(0.0,0.5443,0.0,1.0)
   
];

var vertexArrayForColors = [
   
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red color
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow color    
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green color
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue color
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta color
    vec4( 0.0, 1.0, 1.0, 1.0 ),  // white color
    vec4( 0.0, 1.0, 1.0, 1.0 )   // cyan color
];    
    
var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = xAxis;

var theta = [45.0, 45.0, 45.0];

var thetaLoc;

function configureTexture() {
    texture1 = gl.createTexture();       
    gl.bindTexture( gl.TEXTURE_2D, texture1 );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, firstImage);
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, 
                      gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    texture2 = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture2 );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, secondImage);
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, 
                      gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
}

function individualTriangle(a, b, c) {
     pointsArray.push(verticeArray[a]); 
     colorsArray.push(vertexArrayForColors[a]); 
     texCoordsArray.push(texCoord[0]);

     pointsArray.push(verticeArray[b]); 
     colorsArray.push(vertexArrayForColors[a]);
     texCoordsArray.push(texCoord[1]); 

     pointsArray.push(verticeArray[c]); 
     colorsArray.push(vertexArrayForColors[a]);
     texCoordsArray.push(texCoord[2]); 
   
  
}

function checkerBoard()
{

   individualTriangle(0,1,2);//,vertexArrayForColors[0]);
    individualTriangle(1,2,3);//,vertexArrayForColors[1]);
    individualTriangle(2,0,3);//,vertexArrayForColors[2]);
    individualTriangle(3,1,0);//,vertexArrayForColors[3]);
  
}


window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    
    // Shader loading and attribute buffer initialization
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    checkerBoard();

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );
    
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    
    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );
    
    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );
    
    

    
    configureTexture();
    
    gl.activeTexture( gl.TEXTURE0 );
    gl.bindTexture( gl.TEXTURE_2D, texture1 );
    gl.uniform1i(gl.getUniformLocation( program, "Tex0"), 0);
            
    gl.activeTexture( gl.TEXTURE1 );
    gl.bindTexture( gl.TEXTURE_2D, texture2 );
    gl.uniform1i(gl.getUniformLocation( program, "Tex1"), 1);

    thetaLoc = gl.getUniformLocation(program, "theta"); 
    


 document.getElementById("myRangeX").onchange = function(event){axis = xAxis;objectRotationSpeed = 100 - event.target.value; };
 document.getElementById("myRangeY").onchange = function(event){axis = yAxis;objectRotationSpeed = 100 - event.target.value;};
 document.getElementById("myRangeZ").onchange = function(event){axis = zAxis;objectRotationSpeed = 100 - event.target.value;};
 document.getElementById("TDButton").onclick = function(){flag = !flag;};
                       
    render();
}

var render = function() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    if(flag) theta[axis] += 2.0;
    gl.uniform3fv(thetaLoc, theta);
    gl.drawArrays( gl.TRIANGLES, 0, verticeSize );
  
    setTimeout(
        function () {requestAnimationFrame(render);},
        objectRotationSpeed
    );

}
