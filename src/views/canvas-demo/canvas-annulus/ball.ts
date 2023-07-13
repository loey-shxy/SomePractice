export interface BallConfig {
  x: number;
  y: number;
  radius: number;
  color: string;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  mouse: { x: number; y: number };
}

export class Ball {
  x: number;
  y: number;
  radius: number;
  color: string;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  mouse: { x: number; y: number };
  theta: number;
  speed: number;
  dragSpeed: number;
  distance: number;
  lastMouse: { x: number; y: number };
  constructor(ball: BallConfig) {
    this.x = ball.x
    this.y = ball.y
    this.radius = ball.radius
    this.color = ball.color
    this.canvas = ball.canvas
    this.ctx = ball.ctx
    this.mouse = ball.mouse
    this.theta = Math.random()*(Math.PI * 2)
    this.speed = 0.05
    this.dragSpeed = 0.05
    this.distance = Math.random() * (100 - 70) + 70
    this.lastMouse = { x: ball.x, y: ball.y}
  }

  draw(lastPosition: { x: number; y: number }) {
    this.ctx.beginPath()
    this.ctx.strokeStyle = this.color
    this.ctx.lineWidth = this.radius
    this.ctx.moveTo(lastPosition.x, lastPosition.y)
    this.ctx.lineTo(this.x, this.y)
    this.ctx.stroke()
    this.ctx.closePath()
  }

  update() { 
    const lastPosition = { x: this.x, y: this.y }
    this.lastMouse.x += (this.mouse.x - this.lastMouse.x) * this.dragSpeed
    this.lastMouse.y += (this.mouse.y - this.lastMouse.y) * this.dragSpeed

    this.x = this.lastMouse.x + Math.cos(this.theta as number) * (this.distance as number)
    this.y = this.lastMouse.y + Math.sin(this.theta as number) * (this.distance as number)
    this.theta += this.speed as number
    this.draw(lastPosition)
  }
}