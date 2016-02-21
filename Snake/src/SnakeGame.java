import java.applet.Applet;
import java.awt.Color;
import java.awt.Graphics;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.util.ArrayList;

import javax.swing.JFrame;
import javax.swing.JPanel;

public class SnakeGame extends Applet implements KeyListener, Runnable {
	
	private final int WIDTH = 600;
	private final int HEIGHT = 600;
	private final int SEGMENT_SIZE = 10;
	private final int MINIMUM_DIFFICULTY = 50;
	private final int APPLE_POINT_VALUE = 10;
	
	private final Color BACKGROUND_COLOUR = Color.BLACK;
	private final Color SNAKE_COLOUR = Color.WHITE;
	private final Color APPLE_COLOUR = Color.RED;

	
	Thread tBegin;
	Snake s = new Snake(100, 100, 3, SEGMENT_SIZE, Color.BLUE, SNAKE_COLOUR);
	int score = 0;
	int difficulty = 100; // Number of milliseconds to delay. Decreases as score increases
	
	GameObject apple = new GameObject(0, 0, SEGMENT_SIZE, APPLE_COLOUR);
	
	int direction = 4;
	
	boolean running = true;
	
	public void init() {
		addKeyListener(this);
		this.setSize(WIDTH, HEIGHT);
		this.setBackground(BACKGROUND_COLOUR);
		randomizeApple();
		
		tBegin = new Thread(this);
		tBegin.start();
	}
	
	/**
	 * This function resets all the variables in preperation for the game to be restarted
	 */
	private void reset() {
		s = new Snake(100, 100, 3, SEGMENT_SIZE, Color.BLUE, SNAKE_COLOUR);
		score = 0;
		difficulty = 100;
		apple = new GameObject(0, 0, SEGMENT_SIZE, APPLE_COLOUR);
		direction = 4;
		running = true;
		
		init();
	}

	@Override
	public void keyTyped(KeyEvent e) {}

	@Override
	public void keyPressed(KeyEvent e) {
		
		int key = e.getKeyCode();
		
		// Change the direction the snake is travelling based on the key pressed. Cannot change direction
		// that would make it go back into itself (must turn 90 degrees)

		if(key == KeyEvent.VK_RIGHT && s.getHead().getDirection() != 4){
			direction=2;
		}
		if(key == KeyEvent.VK_UP && s.getHead().getDirection() != 3){
			direction=1;
		}
		if(key == KeyEvent.VK_DOWN && s.getHead().getDirection() != 1){
			direction=3;
		}
		if(key == KeyEvent.VK_LEFT && s.getHead().getDirection() != 2){
			direction = 4;
		}
		
		if ( running == false && key == KeyEvent.VK_SPACE ) {
			System.out.println("asdf");
			reset();
		}
	}

	@Override
	public void keyReleased(KeyEvent e) {}

	@Override
	public void run() {
		
		// Check to see if still running. If it is update, draw and delay based on the current difficulty
		while ( running ) {
			update();
			draw();
			delay(difficulty);
		}
		
	}
	
	/**
	 * updates the position of the snake, checks whether the game is still running and whether the
	 * apple should be moved or not
	 */
	private void update() {
		running = checkRunning();
		if ( running == false ) {
			return;
		}
		s.move(direction);
		checkApple();
	}
	
	/**
	 * Checks to see if the game is still running based on where the head position is. If the head
	 * intersects the body or is outside of the game bounds it returns false, otherwise returns true
	 */
	private boolean checkRunning() {
		
		SnakeSegment head = s.getHead();
		ArrayList<SnakeSegment> body = s.getBody();
		
		// Check if still in the game grid
		if ( head.getX() < 0 || head.getY() < 0 || 
			head.getX() > WIDTH - SEGMENT_SIZE || head.getY() > HEIGHT - SEGMENT_SIZE ) {
			System.out.println("Out of bounds");
			return false;
		}
		
		// Check intersection with body
		for ( SnakeSegment bodySegment : body ) {
			if ( head.isIntersecting(bodySegment) ) {
				System.out.println("Intersecting body");
				return false;
			}
		}
		
		return true;
	}
	
	
	/**
	 * Checks to see if the head is intersecting the apple. If it has, replace the apple somewhere
	 * else in the map and increase the difficulty and score
	 */
	private void checkApple() {
		if ( s.getHead().isIntersecting(apple) ) {
			modifyScore(APPLE_POINT_VALUE);
			if ( difficulty > MINIMUM_DIFFICULTY ) { difficulty -= 2; }
			randomizeApple();
			s.grow();
		}
	}
	
	/**
	 * Changes the score
	 * @param amount - The amount to change the score by
	 */
	private void modifyScore( int amount ) {
		score += amount;
	}
	
	/**
	 * Function to randomly place the apple in an open space in the board
	 */
	private void randomizeApple() {
		apple.setPosition(Utils.randomInt(0, 59) * SEGMENT_SIZE,
						Utils.randomInt(0, 59) * SEGMENT_SIZE);
		
		// Check to see if the apple has spawned anywhere inside of the snake, if it
		// has then rerandomize it
		ArrayList<GameObject> snake = s.getParts();
		
		for ( GameObject snakeSegment : snake ) {
			if ( apple.isIntersecting(snakeSegment) ) {
				randomizeApple();
			}
		}
	}
	
	/**
	 * Draw the game board based on the gameobject's current positions
	 */
	private void draw() {
		Graphics g = getGraphics();
		ArrayList<GameObject> snakeParts = s.getParts();
		
		// Draw background
		g.fillRect(0, 0, WIDTH, HEIGHT);
		
		// Draw score
		g.setColor(Color.white);
		g.drawString("Score: " + score, 10, 10);
		
		// Draw snake
		for ( GameObject part : snakeParts ) {
			g.setColor(part.getC());
			g.fillRect(part.getX(), part.getY(), part.getSize(), part.getSize());
		}
		
		// Draw Apple
		g.setColor(apple.getC());
		g.fillRect(apple.getX(), apple.getY(), apple.getSize(), apple.getSize());
	}
	
	/**
	 * Delays the game execution by the number of millisecodns supplied
	 * @param milliseconds - The number of milliseconds to be delayed by
	 */
	private void delay( int milliseconds ) {
		try { Thread.sleep(milliseconds);}
		catch (InterruptedException e) {}
	}
	
}
