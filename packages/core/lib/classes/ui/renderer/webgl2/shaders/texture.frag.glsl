#version 300 es
precision mediump float;

uniform sampler2D u_Textures[2];

in vec4 v_Color;
in float v_TexIndex;
in vec2 v_TexCoords;

out vec4 color;

vec4 getTextureColor(float texIndex, vec2 texCoords) {
  if (texIndex == 0.0) {
    return texture(u_Textures[0], texCoords);
  } else {
    return texture(u_Textures[1], texCoords);
  }
}

void main() {
  color = getTextureColor(v_TexIndex, v_TexCoords) * v_Color;
}
