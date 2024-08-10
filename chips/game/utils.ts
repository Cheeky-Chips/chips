/**
 * A class to represent a 2D Vector
 * @class Vector2D
 * @param {number} x - The x value
 * @param {number} y - The y value
 */
export class Vector2D {
  constructor(public x: number, public y: number) {}

  /**
   * Add a vector to this vector
   * @param {Vector2D} v - The vector to add
   * @returns {Vector2D} The sum of the two vectors
   */
  public add(v: Vector2D): Vector2D {
    return new Vector2D(this.x + v.x, this.y + v.y);
  }

  /**
   * Subtract a vector from this vector
   * @param {Vector2D} v - The vector to subtract
   * @returns {Vector2D} The difference of the two vectors
   */
  public sub(v: Vector2D): Vector2D {
    return new Vector2D(this.x - v.x, this.y - v.y);
  }

  /**
   * Multiply this vector by a scalar
   * @param {number} s - The scalar to multiply by
   * @returns {Vector2D} The product of the vector and the scalar
   */
  public mul(s: number): Vector2D {
    return new Vector2D(this.x * s, this.y * s);
  }

  /**
   * Divide this vector by a scalar
   * @param {number} s - The scalar to divide by
   * @returns {Vector2D} The quotient of the vector and the scalar
   */
  public div(s: number): Vector2D {
    return new Vector2D(this.x / s, this.y / s);
  }

  /**
   * Get the length of this vector
   * @returns {number} The length of the vector
   */
  public length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Normalize this vector
   * @returns {Vector2D} The normalized vector
   */
  public normalize(): Vector2D {
    return this.div(this.length());
  }

  /**
   * Get the distance between this vector and another vector
   * @param {Vector2D} v - The other vector
   * @returns {number} The distance between the two vectors
   */
  public distance(v: Vector2D): number {
    return this.sub(v).length();
  }

  /**
   * Get the tuple representation of this vector
   * @returns {[number, number]} The tuple representation of the vector
   */
  public t(): [number, number] {
    return [this.x, this.y];
  }
}

// alias for Vector2D
export type Cood = Vector2D;
export type Size = Vector2D;

// constructor for Vector2D
export const V = (x: number, y: number): Vector2D => new Vector2D(x, y);

/**
 * A class to represent a rectangle
 * @class Rect
 * @param {number} x - The x value
 * @param {number} y - The y value
 * @param {number} width - The width of the rectangle
 * @param {number} height - The height of the rectangle
 */
export class Rect {
  public x: number;
  public y: number;
  public width: number;
  public height: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  /**
   * Create a rectangle from a coordinate and a size
   * @param {Cood} cood - The coordinate of the rectangle
   * @param {Size} size - The size of the rectangle
   * @returns {Rect} The rectangle
   */
  public static from(cood: Cood, size: Size): Rect {
    return new Rect(cood.x, cood.y, size.x, size.y);
  }

  /**
   * Create a rectangle from a center and a size
   * @param {Vector2D} center - The center of the rectangle
   * @param {Size} size - The size of the rectangle
   * @returns {Rect} The rectangle
   */
  public static fromCenter(center: Vector2D, size: Size): Rect {
    return new Rect(
      center.x - size.x / 2,
      center.y - size.y / 2,
      size.x,
      size.y
    );
  }

  /**
   * Create a rectangle from bounds
   * @param {number} left - The left bound
   * @param {number} top - The top bound
   * @param {number} right - The right bound
   * @param {number} bottom - The bottom bound
   * @returns {Rect} The rectangle
   */
  public static fromBounds(
    left: number,
    top: number,
    right: number,
    bottom: number
  ): Rect {
    return new Rect(left, top, right - left, bottom - top);
  }

  /**
   * Get the left bound of the rectangle
   * @returns {number} The left bound
   */
  public get left(): number {
    return this.x;
  }

  /**
   * Get the right bound of the rectangle
   */
  public get right(): number {
    return this.x + this.width;
  }

  /**
   * Get the top bound of the rectangle
   * @returns {number} The top bound
   */
  public get top(): number {
    return this.y;
  }

  /**
   * Get the bottom bound of the rectangle
   * @returns {number} The bottom bound
   */
  public get bottom(): number {
    return this.y + this.height;
  }

  /**
   * Get the center of the rectangle
   * @returns {Vector2D} The center of the rectangle
   */
  public get center(): Vector2D {
    return new Vector2D(this.x + this.width / 2, this.y + this.height / 2);
  }

  /**
   * Check if a point is contained in the rectangle
   * @param {Vector2D} point - The point to check
   * @returns {boolean} Whether the point is contained in the rectangle
   */
  public contains(point: Vector2D): boolean {
    return (
      point.x >= this.left &&
      point.x <= this.right &&
      point.y >= this.top &&
      point.y <= this.bottom
    );
  }

  /**
   * Check if a rectangle intersects with this rectangle
   * @param {Rect} rect - The rectangle to check
   * @returns {boolean} Whether the rectangles intersect
   */
  public intersects(rect: Rect): boolean {
    return (
      this.left < rect.right &&
      this.right > rect.left &&
      this.top < rect.bottom &&
      this.bottom > rect.top
    );
  }

  /**
   * Check if a rectangle is contained in the rectangle
   * @param {Rect} rect - The rectangle to check
   * @returns {boolean} Whether the rectangle is contained in the rectangle
   */
  public containsRect(rect: Rect): boolean {
    return (
      this.left <= rect.left &&
      this.right >= rect.right &&
      this.top <= rect.top &&
      this.bottom >= rect.bottom
    );
  }
}
