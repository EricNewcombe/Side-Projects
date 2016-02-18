import java.awt.Color;

public class GameObject {
	private int x, y;
	protected int size = 0;
	private Color c;
	
	public GameObject ( int x, int y, int size, Color c ) {
		this.x = x;
		this.y = y;
		this.size = size;
		this.c = c;
	}
	
	public void changeX ( int amount ) {
		this.x += amount;
	}
	
	public void changeY ( int amount ) {
		this.y += amount;
	}
	
	public int getX() {
		return x;
	}
	
	public Color getC() {
		return c;
	}
	
	public int getY() {
		return y;
	}
	
	public int getSize() {
		return size;
	}
	
	public boolean isIntersecting ( GameObject o ) {
		if ( this.x == o.getX() && this.y == o.getY() ) {
			return true;
		}
		return false;
	}
	
	public void setPosition ( int x, int y ) {
		this.x = x;
		this.y = y;
	}
}
