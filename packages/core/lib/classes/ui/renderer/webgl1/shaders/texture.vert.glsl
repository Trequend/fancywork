attribute vec2 a_Position;
attribute vec4 a_Color;
attribute float a_TexIndex;
attribute vec2 a_TexCoords;

uniform mat3 u_ProjectionMatrix;

varying vec4 v_Color;
varying float v_TexIndex;
varying vec2 v_TexCoords;

void main() {
  v_Color = a_Color;
  v_TexIndex = a_TexIndex;
  v_TexCoords = a_TexCoords;
  gl_Position = vec4(u_ProjectionMatrix * vec3(a_Position, 1.0), 1.0);
}
