import { Shader, WEBGL2_MAX_QUADS, WebGLRenderer, SchemaInfo } from '../webgl';
import { WebGL2RendererData } from './WebGL2RendererData';
import vertexShaderSource from './shaders/texture.vert.glsl';
import fragmentShaderSource from './shaders/texture.frag.glsl';

export class WebGL2Renderer extends WebGLRenderer {
  public constructor(gl: WebGL2RenderingContext, schemaInfo: SchemaInfo) {
    const data = new WebGL2RendererData(gl, WEBGL2_MAX_QUADS);
    const shader = new Shader(
      gl,
      'WEBGL2_SHADER',
      vertexShaderSource,
      fragmentShaderSource
    );
    super(gl, schemaInfo, shader, data);
  }
}
