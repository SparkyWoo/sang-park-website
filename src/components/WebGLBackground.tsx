'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

// Vertex shader source
const vertexShaderSource = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_uv = a_position * 0.5 + 0.5;
  }
`;

// Fragment shader source with animated gradient - Optimized version
const fragmentShaderSource = `
  precision mediump float;
  
  uniform float u_time;
  uniform float u_intensity;
  uniform float u_speed;
  uniform vec2 u_resolution;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform vec3 u_color3;
  
  varying vec2 v_uv;
  
  // Simplified noise function for better performance
  float noise(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }
  
  // Simplified smooth noise
  float smoothNoise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    
    float a = noise(i);
    float b = noise(i + vec2(1.0, 0.0));
    float c = noise(i + vec2(0.0, 1.0));
    float d = noise(i + vec2(1.0, 1.0));
    
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  
  void main() {
    vec2 st = v_uv;
    vec2 pos = st - 0.5;
    
    // Simplified animated time
    float time = u_time * u_speed * 0.0005;
    
    // Reduced complexity - only 2 noise layers instead of 3
    float noise1 = smoothNoise(st * 2.0 + time * 0.3);
    float noise2 = smoothNoise(st * 1.5 - time * 0.2);
    
    // Simplified pattern combination
    float pattern = (noise1 + noise2 * 0.5) / 1.5;
    
    // Create radial gradient
    float dist = length(pos);
    float radial = 1.0 - smoothstep(0.0, 0.7, dist);
    
    // Mix colors based on pattern
    vec3 color1 = u_color1;
    vec3 color2 = u_color2;
    vec3 color3 = u_color3;
    
    vec3 finalColor = mix(color1, color2, pattern);
    finalColor = mix(finalColor, color3, noise2 * 0.3);
    
    // Apply radial gradient and intensity
    finalColor *= radial;
    finalColor *= u_intensity;
    
    // Simplified animation
    float pulse = sin(time * 1.5) * 0.05 + 0.95;
    finalColor *= pulse;
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

interface WebGLBackgroundProps {
  enabled?: boolean;
  intensity?: number;
  speed?: number;
  colors?: string[];
  fallbackColor?: string;
  className?: string;
}

interface WebGLState {
  supported: boolean;
  context: WebGLRenderingContext | null;
  program: WebGLProgram | null;
  animationId: number | null;
  startTime: number;
  fps: number;
  frameCount: number;
  lastFpsUpdate: number;
}

const WebGLBackground: React.FC<WebGLBackgroundProps> = ({
  enabled = true,
  intensity = 0.5,
  speed = 1.0,
  colors = ['#1e40af', '#7c3aed', '#db2777'],
  fallbackColor = 'linear-gradient(135deg, #1e40af 0%, #7c3aed 50%, #db2777 100%)',
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<WebGLState>({
    supported: false,
    context: null,
    program: null,
    animationId: null,
    startTime: 0,
    fps: 0,
    frameCount: 0,
    lastFpsUpdate: 0
  });
  const [fallbackMode, setFallbackMode] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Create shader
  const createShader = useCallback((gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null => {
    const shader = gl.createShader(type);
    if (!shader) return null;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }, []);

  // Create program
  const createProgram = useCallback((gl: WebGLRenderingContext): WebGLProgram | null => {
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) return null;

    const program = gl.createProgram();
    if (!program) return null;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }

    return program;
  }, [createShader]);

  // Convert hex color to RGB
  const hexToRgb = useCallback((hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [
          parseInt(result[1], 16) / 255,
          parseInt(result[2], 16) / 255,
          parseInt(result[3], 16) / 255
        ]
      : [0, 0, 0];
  }, []);

  // Initialize WebGL
  const initWebGL = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return false;

    try {
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl || !(gl instanceof WebGLRenderingContext)) {
        console.warn('WebGL not supported');
        return false;
      }

      const program = createProgram(gl);
      if (!program) {
        console.error('Failed to create WebGL program');
        return false;
      }

      // Set up geometry (full screen quad)
      const positions = new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
         1,  1,
      ]);

      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

      const positionLocation = gl.getAttribLocation(program, 'a_position');
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      stateRef.current = {
        ...stateRef.current,
        supported: true,
        context: gl,
        program,
        startTime: performance.now()
      };

      return true;
    } catch (error) {
      console.error('WebGL initialization error:', error);
      return false;
    }
  }, [createProgram]);

  // Render frame
  const render = useCallback(() => {
    const state = stateRef.current;
    if (!state.context || !state.program || !canvasRef.current) return;

    const gl = state.context;
    const canvas = canvasRef.current;

    // Update canvas size
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
      gl.viewport(0, 0, displayWidth, displayHeight);
    }

    // Calculate time and FPS
    const currentTime = performance.now();
    const elapsedTime = currentTime - state.startTime;
    
    state.frameCount++;
    if (currentTime - state.lastFpsUpdate > 1000) {
      state.fps = state.frameCount;
      state.frameCount = 0;
      state.lastFpsUpdate = currentTime;
      
      // Automatic fallback if performance is poor
      if (state.fps < 30) {
        console.warn(`WebGL performance poor: ${state.fps} FPS - switching to fallback`);
        setFallbackMode(true);
        return;
      }
    }

    // Use program
    gl.useProgram(state.program);

    // Set uniforms
    const timeLocation = gl.getUniformLocation(state.program, 'u_time');
    const intensityLocation = gl.getUniformLocation(state.program, 'u_intensity');
    const speedLocation = gl.getUniformLocation(state.program, 'u_speed');
    const resolutionLocation = gl.getUniformLocation(state.program, 'u_resolution');
    const color1Location = gl.getUniformLocation(state.program, 'u_color1');
    const color2Location = gl.getUniformLocation(state.program, 'u_color2');
    const color3Location = gl.getUniformLocation(state.program, 'u_color3');

    gl.uniform1f(timeLocation, elapsedTime);
    gl.uniform1f(intensityLocation, intensity);
    gl.uniform1f(speedLocation, speed);
    gl.uniform2f(resolutionLocation, displayWidth, displayHeight);

    // Set colors
    const [r1, g1, b1] = hexToRgb(colors[0] || '#1e40af');
    const [r2, g2, b2] = hexToRgb(colors[1] || '#7c3aed');
    const [r3, g3, b3] = hexToRgb(colors[2] || '#db2777');

    gl.uniform3f(color1Location, r1, g1, b1);
    gl.uniform3f(color2Location, r2, g2, b2);
    gl.uniform3f(color3Location, r3, g3, b3);

    // Clear and draw
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // Continue animation
    state.animationId = requestAnimationFrame(render);
  }, [intensity, speed, colors, hexToRgb]);

  // Initialize and start animation
  useEffect(() => {
    if (!enabled) {
      setFallbackMode(true);
      return;
    }

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setFallbackMode(true);
      return;
    }

    const success = initWebGL();
    if (success) {
      setFallbackMode(false);
      setIsVisible(true);
      render();
    } else {
      setFallbackMode(true);
    }

    return () => {
      const state = stateRef.current;
      if (state.animationId) {
        cancelAnimationFrame(state.animationId);
        state.animationId = null;
      }
    };
  }, [enabled, initWebGL, render]);

  // Handle visibility changes for performance
  useEffect(() => {
    const handleVisibilityChange = () => {
      const state = stateRef.current;
      
      if (document.hidden) {
        // Pause animation when tab is not visible
        if (state.animationId) {
          cancelAnimationFrame(state.animationId);
          state.animationId = null;
        }
      } else if (enabled && !fallbackMode && state.context && state.program) {
        // Resume animation when tab becomes visible
        state.startTime = performance.now() - (state.startTime ? performance.now() - state.startTime : 0);
        render();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [enabled, fallbackMode, render]);

  if (!enabled) return null;

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {fallbackMode ? (
        // CSS fallback
        <div 
          className="absolute inset-0 opacity-50"
          style={{
            background: fallbackColor,
            filter: 'blur(100px)',
            transform: 'scale(1.1)'
          }}
        />
      ) : (
        // WebGL canvas
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{
            opacity: isVisible ? 0.6 : 0,
            transition: 'opacity 1s ease-in-out'
          }}
        />
      )}
      
      {/* Performance indicator (development only) */}
      {process.env.NODE_ENV === 'development' && !fallbackMode && (
        <div className="absolute top-4 left-4 text-xs text-white/50 font-mono">
          WebGL: {stateRef.current.fps} FPS
        </div>
      )}
    </div>
  );
};

export default WebGLBackground; 