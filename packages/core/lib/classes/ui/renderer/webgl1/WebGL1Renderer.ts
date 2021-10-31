import { Shader, WEBGL1_MAX_QUADS, WebGLRenderer, SchemaInfo } from '../webgl';
import { WebGL1RendererData } from './WebGL1RendererData';
import vertexShaderSource from './shaders/texture.vert.glsl';
import fragmentShaderSource from './shaders/texture.frag.glsl';

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
