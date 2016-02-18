
public class Utils {
	public static int randomInt( int lowerBounds, int upperBounds ) {
		return (int)(Math.random() * ( upperBounds- lowerBounds + 1) + lowerBounds);
	}
}
