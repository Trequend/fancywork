precision mediump float;

uniform sampler2D u_Textures[2];

varying vec4 v_Color;
varying float v_TexIndex;
varying vec2 v_TexCoords;

vec4 getTextureColor(float texIndex, vec2 texCoords) {
  if (texIndex == 0.0) {
    return texture2D(u_Textures[0], texCoords);
  } else {
    return texture2D(u_Textures[1], texCoords);
  }
}

void main() {
  gl_FragColor = getTextureColor(v_TexIndex, v_TexCoords) * v_Color;
}
