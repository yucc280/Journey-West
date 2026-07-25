import React, { useRef, useState, useEffect } from "react";

function resolveAssetUrl(path) {
  if (!path) {
    return `${import.meta.env.BASE_URL}media/music.mp3`;
  }

  if (/^(https?:)?\/\//i.test(path) || path.startsWith("data:")) {
    return path;
  }

  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
}

export default function AudioVisualizer({ audioSrc }) {
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const animIdRef = useRef(null);
  const sourceRef = useRef(null);

  // 初始化 Web Audio API 上下文
  const initAudioContext = () => {
    if (audioCtxRef.current) return;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 128; // 采样频段数

    // 连接节点
    if (audioRef.current) {
      sourceRef.current = ctx.createMediaElementSource(audioRef.current);
      sourceRef.current.connect(analyser);
      analyser.connect(ctx.destination);
    }

    audioCtxRef.current = ctx;
    analyserRef.current = analyser;
  };

  // Canvas 高清 DPR 自适应缩放
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
  };

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
    };
  }, []);

  // 播放 / 暂停切换
  const togglePlay = () => {
    initAudioContext();

    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }

    if (isPlaying) {
      audioRef.current.pause();
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
    } else {
      audioRef.current
        .play()
        .then(() => {
          draw();
        })
        .catch((err) => {
          console.error("音频播放失败:", err);
        });
    }
    setIsPlaying(!isPlaying);
  };

  // 音频播放结束回调
  const handleEnded = () => {
    setIsPlaying(false);
    if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
  };

  // Canvas 渲染频段动画
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const analyser = analyserRef.current;
    if (!analyser) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animIdRef.current = requestAnimationFrame(render);
      analyser.getByteFrequencyData(dataArray);

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.clearRect(0, 0, width, height);

      const barWidth = (width / bufferLength) * 2.1;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * height * 0.82;

        const gradient = ctx.createLinearGradient(0, height, 0, 0);
        gradient.addColorStop(0, "rgba(49, 95, 88, 0.2)"); /* --jade */
        gradient.addColorStop(0.5, "rgba(163, 59, 49, 0.7)"); /* --cinnabar */
        gradient.addColorStop(1, "rgba(167, 129, 67, 0.95)"); /* --gold */

        ctx.fillStyle = gradient;

        if (barHeight > 0) {
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(
              x,
              height - barHeight,
              Math.max(barWidth - 3, 2),
              barHeight,
              [4, 4, 0, 0],
            );
          } else {
            ctx.rect(
              x,
              height - barHeight,
              Math.max(barWidth - 3, 2),
              barHeight,
            );
          }
          ctx.fill();
        }

        x += barWidth;
      }
    };

    render();
  };

  return (
    <div className="audio-visualizer-card">
      <div className="audio-header">
        <div>
          <h3 className="audio-title">原声律动 · 敢问路在何方</h3>
          <span className="audio-subtitle">
            点击播放主题曲音律与实时频谱可视化
          </span>
        </div>
        <button className="audio-btn" onClick={togglePlay}>
          {isPlaying ? "⏸ 暂停" : "▶ 播放"}
        </button>
      </div>

      <audio
        ref={audioRef}
        src={resolveAssetUrl(audioSrc)}
        onEnded={handleEnded}
        crossOrigin="anonymous"
      />
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "90px" }}
        className="audio-canvas"
      />
    </div>
  );
}
