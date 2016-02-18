import java.awt.Color;
import java.util.ArrayList;

public class Snake {
	
	private SnakeSegment head;
	private ArrayList<SnakeSegment> body;
	
	public Snake ( int headX, int headY, int startLength, int segmentSize, Color headColour, Color bodyColour ) {
		
		// Initialize the moving parts of the snake
		head = new SnakeSegment(headX, headY, segmentSize, headColour, 4);
		initBody(headX, headY, startLength, segmentSize, bodyColour);
	}
	
	public Snake ( int headX, int headY, int startLength, int segmentSize, Color snakeColour ) {
		this(headX, headY, startLength, segmentSize, snakeColour,snakeColour);
	}
	
	/**
	 * Initializes the body of the snake with segments travelling in the correct direction
	 * @param startX - The starting x position of the body
	 * @param startY - The starting y position of the body
	 * @param numberOfLinks - The number of links to start with in the body
	 * @param segmentSize - The segment size of links (for offsetting position)
	 */
	
	private void initBody( int startX, int startY, int numberOfLinks, int segmentSize, Color bodyColour ) {
		
		body = new ArrayList<>();
		int segmentX = startX + segmentSize;
		
		for ( int i = 1; i <= numberOfLinks; i++ ) {
			SnakeSegment s;
			
			segmentX = startX + (segmentSize * i);
			s = new SnakeSegment(segmentX, startY, segmentSize, bodyColour, 4);
			
			body.add(s);
		}
		
	}
	
	/**
	 * Function to move the segments of the snake based on the previous positions
	 * of the snake head
	 * 
	 *  @param direction - int (1 - up, 2 - right, 3 - down, 4 - left)
	 */
	public void move( int direction ) {
		
		// Set the previous direction that the head was travelling in
		int previousDirection = head.getDirection();
		
		// Start moving the snake in the new direction
		head.move(direction); // Move the head
		
		// Move the body parts based on the travelling direction of the previous pieces
		for ( int i = 0; i < this.body.size(); i++ ) {
			// Retrieve the section currently being moved
			SnakeSegment bodySegment = this.body.get(i);
			
			// Set the new direction to move as the direction to where the old section was
			direction = previousDirection;
			
			// Get the direction that the current section was travelling before
			previousDirection = bodySegment.getDirection();
			
			// Move the section in the new direction
			bodySegment.move(direction);
		}
		
	}
	
	/**
	 * Checks to see if the head of the snake has collided with any of the body
	 * segments of the snake
	 */
	public boolean checkColisionWithSelf() {
		for ( int i = 0; i < this.body.size(); i++ ) {
			SnakeSegment bodySegment = this.body.get(i);
			if ( this.head.isIntersecting(bodySegment)) {
				return true;
			}
		}
		return false;
	}
	
	public SnakeSegment getHead() {
		return head;
	}
	
	public ArrayList<GameObject> getParts() {
		ArrayList<GameObject> parts = new ArrayList<GameObject>();
		parts.add(head);
		parts.addAll(body);
		return parts;
	}
	
	public void print() {
		System.out.print("Head: (" + head.getX() + ", " + head.getY() + ") Body:");
		for ( int i = 0; i < body.size(); i++ ) {
			SnakeSegment s = body.get(i);
			System.out.print(" (" + s.getX() + ", " + s.getY() + ")");
		}
		System.out.println();
	}
	
	public void grow() {
		SnakeSegment lastLink = body.get( body.size() - 1 );
		
		int direction = lastLink.getDirection();
		int xPos = 0, yPos = 0;
		switch ( direction ) {
			case 1: // up
				xPos = lastLink.getX();
				yPos = lastLink.getY() + lastLink.getSize();
				break;
			case 2: // right
				xPos = lastLink.getX() + lastLink.getSize();
				yPos = lastLink.getY();
				break;
			case 3: // down
				xPos = lastLink.getX();
				yPos = lastLink.getY() - lastLink.getSize();
				break;
			case 4: // left
				xPos = lastLink.getX() - lastLink.getSize();
				yPos = lastLink.getY();
				break;
			default:
				break;
		}
		
		body.add(new SnakeSegment(xPos, yPos, lastLink.getSize(), lastLink.getC(), direction));
	}
}
