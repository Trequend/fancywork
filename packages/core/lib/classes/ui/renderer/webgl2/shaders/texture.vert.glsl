#version 300 es

in vec2 a_Position;
in vec4 a_Color;
in float a_TexIndex;
in vec2 a_TexCoords;

uniform mat3 u_ProjectionMatrix;

out vec4 v_Color;
out float v_TexIndex;
out vec2 v_TexCoords;

void main() {
  v_Color = a_Color;
  v_TexIndex = a_TexIndex;
  v_TexCoords = a_TexCoords;
  gl_Position = vec4(u_ProjectionMatrix * vec3(a_Position, 1.0), 1.0);
}
