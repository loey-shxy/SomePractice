// 烟花柱
class Fireworks {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  vel: number;
  color: string;
  particles: Particle[]

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, particles: Particle[]) {
    this.canvas = canvas
    this.ctx = ctx
    this.x = Math.random() * canvas.width | 0
    this.y = canvas.height
    this.vel = -(Math.random() * Math.sqrt(canvas.height) / 3 + Math.sqrt(4 * canvas.height) / 2 ) / 5
    this.color = `hsl(${Math.random() * 360 | 0}, 100%, 60%)`
    this.particles = particles
  }

  draw() {
    this.ctx.globalAlpha = 1
    this.ctx.beginPath()
    this.ctx.fillStyle = this.color
    this.ctx.arc(this.x, this.y, 3, 0, Math.PI * 2)
    this.ctx.fill()
  }

  update() {
    this.y += this.vel
    this.vel += 0.04
    if (this.vel >= 0) {
      for (let i = 0; i < 200; i++) {
        this.particles.push(
          new Particle(this.x, this.y, this.color, this.canvas, this.ctx)
        )
      }
      this.x = Math.random() * this.canvas.width | 0
      this.y = this.canvas.height
      this.vel = -(Math.random() * Math.sqrt(this.canvas.height) / 3 + Math.sqrt(4 * this.canvas.height) / 2 ) / 5
      this.color = `hsl(${Math.random() * 360 | 0}, 100%, 60%)`
    }
  }
}

// 烟花粒子
class Particle {
  x: number;
  y: number;
  color: string;
  vx: number;
  vy: number;
  age: number;
  ctx: CanvasRenderingContext2D;
  constructor(x: number, y: number, color: string, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.x = x
    this.y = y
    this.color = color
    this.ctx = ctx
    // 随机生成粒子炸开的方向
    this.vx = (0.5 - Math.random()) * 100
    this.vy = (0.5 - Math.random()) * 100
    this.age = Math.random() * 100 | 0
  }

  draw() {
    this.ctx.globalAlpha = 1
    this.ctx.beginPath()
    this.ctx.fillStyle = this.color
    this.ctx.arc(this.x, this.y, 1, 0, Math.PI * 2)
    this.ctx.fill()
  }

  update() {
    this.x += this.vx / 20
    this.y += this.vy / 20
    this.vy++
    this.age--
  }
}

// 烟花效果
export class FireworksEffect {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  fireworks: Fireworks[];
  particles: Particle[];
  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas
    this.ctx = ctx
    this.fireworks = []
    this.particles = []

    this.init()
    this.animate()
    this.resize()
  }

  init() {
    for (let i = 0; i < (this.canvas.width / 100 | 0); i++) {
      this.fireworks.push(
        new Fireworks(this.canvas, this.ctx, this.particles)
      )
    }
  }

  resize() {
    addEventListener('resize', () => {
      this.canvas.width = innerWidth
      this.canvas.height = innerHeight
    })
  }

  draw() {
    this.ctx.globalAlpha = 0.1
    this.ctx.fillStyle = '#000'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    for (let i = 0; i < this.fireworks.length; i++) {
      this.fireworks[i].update()
      this.fireworks[i].draw()
    }

    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].update()
      this.particles[i].draw()
      if (this.particles[i].age < 0) {
        this.particles.splice(i , 1)
      }
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate())
    this.draw()
  }
}