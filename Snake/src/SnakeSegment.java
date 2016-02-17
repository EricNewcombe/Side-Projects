import java.awt.Color;

public class SnakeSegment extends GameObject {
	
	protected int direction = 0;
	
	public SnakeSegment(int x, int y, int size, Color c, int direction) {
		super(x, y, size, c);
		this.direction = direction;
	}
	
	/**
	 * Moves the snake segment in the direction specified. 
	 * @param direction - integer representing direction (1 is up, 2 is right, 3 is down, 4 is left)
	 */
	public void move( int direction ) {
		if ( direction > 4 || direction < 1 ) { return; }
		
		this.direction = direction;
		switch ( direction ) {
			case 1: // up
				this.changeY(-this.size);
				break;
			case 2: // right
				this.changeX(this.size);
				break;
			case 3: // down
				this.changeY(this.size);
				break;
			case 4: // left
				this.changeX(-this.size);
				break;
			default:
				break;
		}
	}
	
	public int getDirection() {
		return direction;
	}
	
}
