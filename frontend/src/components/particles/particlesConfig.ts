import type { ISourceOptions } from '@tsparticles/engine';

export const particlesConfig: ISourceOptions = {
  background: { color: { value: 'transparent' } },
  fpsLimit: 60,
  interactivity: {
    events: {
      onHover: { enable: true, mode: 'grab' },
      resize: { enable: true },
    },
    modes: {
      grab: { distance: 150, links: { opacity: 0.4 } },
    },
  },
  particles: {
    color: { value: ['#6366f1', '#8b5cf6', '#06b6d4'] },
    links: {
      color: '#6366f1',
      distance: 130,
      enable: true,
      opacity: 0.12,
      width: 1,
    },
    move: {
      direction: 'none',
      enable: true,
      outModes: { default: 'bounce' },
      random: true,
      speed: 0.5,
      straight: false,
    },
    number: { density: { enable: true, width: 900 }, value: 70 },
    opacity: {
      value: { min: 0.1, max: 0.5 },
      animation: { enable: true, speed: 0.5, sync: false },
    },
    shape: { type: 'circle' },
    size: { value: { min: 1, max: 3 } },
  },
  detectRetina: true,
};
