// https://en.wikipedia.org/wiki/Linear_interpolation
function lerp( x, y, t ) {

	return ( 1 - t ) * x + t * y;

}

// https://www.desmos.com/calculator/vcsjnyz7x4
function pingpong( x, length = 1 ) {

	return length - Math.abs( euclideanModulo( x, length * 2 ) - length );

}

export { lerp, pingpong }