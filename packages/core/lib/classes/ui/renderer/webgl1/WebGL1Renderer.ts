import { SchemaInfo, Shader, WEBGL1_MAX_QUADS, WebGLRenderer } from '../webgl';
import fragmentShaderSource from './shaders/texture.frag.glsl';
import vertexShaderSource from './shaders/texture.vert.glsl';
import { WebGL1RendererData } from './WebGL1RendererData';

export class WebGL1Renderer extends WebGLRenderer {
  public constructor(gl: WebGLRenderingContext, schemaInfo: SchemaInfo) {
    const data = new WebGL1RendererData(gl, WEBGL1_MAX_QUADS);
    const shader = new Shader(
      gl,
      'WEBGL1_SHADER',
      vertexShaderSource,
      fragmentShaderSource
    );
    super(gl, schemaInfo, shader, data);
  }
}
