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
	
	private final Color BACKGROUND_COLOUR = Color.BLACK;
	private final Color SNAKE_COLOUR = Color.WHITE;
	private final Color APPLE_COLOUR = Color.RED;

	
	Thread tBegin;
	Snake s = new Snake(50, 50, 3, SEGMENT_SIZE, Color.BLUE, SNAKE_COLOUR);
	int score = 0;
	
	GameObject apple = new GameObject(0, 0, SEGMENT_SIZE, APPLE_COLOUR);
	
	private int direction = 4;
	
	public void init() {
		addKeyListener(this);
		this.setSize(WIDTH, HEIGHT);
		this.setBackground(BACKGROUND_COLOUR);
		randomizeApple();
		
		tBegin = new Thread(this);
		tBegin.start();
	}

	@Override
	public void keyTyped(KeyEvent e) {}

	@Override
	public void keyPressed(KeyEvent e) {
		// TODO Auto-generated method stub
		int key = e.getKeyCode();

		if(key==e.VK_RIGHT){
			direction=2;
		}
		if(key==e.VK_UP){
			direction=1;
		}
		if(key==e.VK_DOWN){
			direction=3;
		}
		if(key == KeyEvent.VK_LEFT){
			direction = 4;
		}
	}

	@Override
	public void keyReleased(KeyEvent e) {}

	@Override
	public void run() {
		
		while ( running() ) {
			update();
			draw();
			delay(100);
		}
		
	}
	
	private boolean running() {
		return true;
	}
	
	private void update() {
		s.move(direction);
		checkApple();
	}
	
	private void checkApple() {
		if ( s.getHead().isIntersecting(apple) ) {
			score += 10;
			randomizeApple();
			s.grow();
		}
	}
	
	private void randomizeApple() {
		apple.setPosition(Utils.randomInt(0, 60) * SEGMENT_SIZE,
						Utils.randomInt(0, 60) * SEGMENT_SIZE);
	}
	
	private void draw() {
		Graphics g = getGraphics();
		ArrayList<GameObject> snakeParts = s.getParts();
		
		g.fillRect(0, 0, WIDTH, HEIGHT);
		
		for ( GameObject part : snakeParts ) {
			g.setColor(part.getC());
			g.fillRect(part.getX(), part.getY(), part.getSize(), part.getSize());
		}
		
		g.setColor(apple.getC());
		g.fillRect(apple.getX(), apple.getY(), apple.getSize(), apple.getSize());
	}
	
	private void delay( int milliseconds ) {
		try { Thread.sleep(milliseconds);}
		catch (InterruptedException e) {}
	}
	
}
