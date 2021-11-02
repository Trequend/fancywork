import { WebGL } from './WebGL';

export class Shader {
  private id: WebGLProgram | null;

  constructor(
    private readonly gl: WebGL,
    name: string,
    vertexSource: string,
    fragmentSource: string
  ) {
    let vertexShader: WebGLProgram | null = null;
    let fragmentShader: WebGLProgram | null = null;
    try {
      vertexShader = createShader(name, gl, gl.VERTEX_SHADER, vertexSource);
      fragmentShader = createShader(
        name,
        gl,
        gl.FRAGMENT_SHADER,
        fragmentSource
      );
    } catch (error) {
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      throw error;
    }

    this.id = gl.createProgram();
    if (!this.id) {
      throw new Error('cannot create program');
    }

    gl.attachShader(this.id, vertexShader);
    gl.attachShader(this.id, fragmentShader);
    gl.linkProgram(this.id);
    if (!gl.getProgramParameter(this.id, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(this.id);
      gl.deleteProgram(this.id);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      throw new ShaderError(
        name,
        `Cannot link vertex and fragment shader. Info: ${info}`
      );
    }

    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
  }

  bind() {
    this.gl.useProgram(this.id);
  }

  unbind() {
    this.gl.useProgram(null);
  }

  setInt(name: string, x: number) {
    if (!this.id) {
      return;
    }

    const { gl } = this;
    const location = gl.getUniformLocation(this.id, name);
    gl.uniform1i(location, x);
  }

  setIntArray(name: string, values: Iterable<number>) {
    if (!this.id) {
      return;
    }

    const { gl } = this;
    const location = gl.getUniformLocation(this.id, name);
    gl.uniform1iv(location, values);
  }

  setFloat(name: string, x: number) {
    if (!this.id) {
      return;
    }

    const { gl } = this;
    const location = gl.getUniformLocation(this.id, name);
    gl.uniform1f(location, x);
  }

  setFloat2(name: string, x: number, y: number) {
    if (!this.id) {
      return;
    }

    const { gl } = this;
    const location = gl.getUniformLocation(this.id, name);
    gl.uniform2f(location, x, y);
  }

  setFloat3(name: string, x: number, y: number, z: number) {
    if (!this.id) {
      return;
    }

    const { gl } = this;
    const location = gl.getUniformLocation(this.id, name);
    gl.uniform3f(location, x, y, z);
  }

  setFloat4(name: string, x: number, y: number, z: number, w: number) {
    if (!this.id) {
      return;
    }

    const { gl } = this;
    const location = gl.getUniformLocation(this.id, name);
    gl.uniform4f(location, x, y, z, w);
  }

  setMatrix3x3(name: string, matrix: Iterable<number>) {
    if (!this.id) {
      return;
    }

    const { gl } = this;
    const location = gl.getUniformLocation(this.id, name);
    gl.uniformMatrix3fv(location, false, matrix);
  }

  destroy() {
    this.gl.deleteProgram(this.id);
    this.id = null;
  }
}

const createShader = (
  name: string,
  gl: WebGL,
  type: number,
  source: string
) => {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new ShaderError(name, 'Cannot create shader');
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    if (info === null) {
      throw new ShaderError(name, 'Unknown error');
    } else {
      throw new ShaderError(name, info);
    }
  }

  return shader;
};

class ShaderError extends Error {
  constructor(public readonly shaderName: string, message: string) {
    super(`Shader: "${shaderName}". ${message}`);
    this.name = 'ShaderError';
  }
}
