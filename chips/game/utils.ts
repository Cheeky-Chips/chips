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
  add(v: Vector2D): Vector2D {
    return new Vector2D(this.x + v.x, this.y + v.y);
  }

  /**
   * Subtract a vector from this vector
   * @param {Vector2D} v - The vector to subtract
   * @returns {Vector2D} The difference of the two vectors
   */
  sub(v: Vector2D): Vector2D {
    return new Vector2D(this.x - v.x, this.y - v.y);
  }

  /**
   * Multiply this vector by a scalar
   * @param {number} s - The scalar to multiply by
   * @returns {Vector2D} The product of the vector and the scalar
   */
  mul(s: number): Vector2D {
    return new Vector2D(this.x * s, this.y * s);
  }

  /**
   * Divide this vector by a scalar
   * @param {number} s - The scalar to divide by
   * @returns {Vector2D} The quotient of the vector and the scalar
   */
  div(s: number): Vector2D {
    return new Vector2D(this.x / s, this.y / s);
  }

  /**
   * Get the length of this vector
   * @returns {number} The length of the vector
   */
  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Normalize this vector
   * @returns {Vector2D} The normalized vector
   */
  normalize(): Vector2D {
    return this.div(this.length());
  }

  /**
   * Get the distance between this vector and another vector
   * @param {Vector2D} v - The other vector
   * @returns {number} The distance between the two vectors
   */
  distance(v: Vector2D): number {
    return this.sub(v).length();
  }

  t(): [number, number] {
    return [this.x, this.y];
  }
}

// alias for Vector2D
export type Cood = Vector2D;
export type Size = Vector2D;
