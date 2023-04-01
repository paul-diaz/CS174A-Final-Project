SpaceY Final Project for CS 174A Computer Graphics

Background:
   Space Y is a 3D spin on the classic arcade game, asteroids. The player finds themselves in front of a field of asteroids, and must maneuver a spaceship through and reach the goal, which is a star on the other side. There is a choice of three spaceships, each equipped with lasers just like the arcade game. However, in Space Y there is a limited amount of lasers as well as a difficulty setting. There are also nods to other inspirations throughout the game, such as Star Wars and various Nintendo titles. 
   The storyline of Space Y is a grim one. You play as an astronaut, venturing through space looking for resources to save humanity. During your travels, a parasitic alien boards your ship. You now have limited time to crash into the nearest star before the alien takes over your body. Having inhabited a desolate planet, the only way to be sure the parasite is destroyed completely is to burn it along with your ship. Unfortunately, there is an asteroid field in your way. If you crash into an asteroid, your ship will explode but the vacuum of space will give the parasite an opportunity to survive. And you are not willing to take those odds.

Mechanics:
   The game controls are displayed on the title screen. To move, the user must use “w,” “a,” “s, ” and “d” as well as “.” to thrust forward. Pressing “p” will select the ship and “o” will select the difficulty. After pressing “i” to start, the player can also shoot lasers with “q.” Current speed, time remaining, lasers remaining, and difficulty are also displayed below the scene along with the controls.
   
Advanced Feature: Collision Detection
   The advanced feature we chose for this project is collision detection. We chose this feature as it is most relevant to an obstacle avoidance game. Upon collision with an asteroid, a death animation plays, followed by the game over screen. The laser can also collide with asteroids, in which case one or more asteroids will explode and disappear from the screen. Collision detection is also implemented at the star, as contact with it will display a victory screen. The gameplay area also has a boundary box so that the player cannot stray away from the asteroid field. The explosion animations are an homage to the retro game Asteroids, in which the spaceship shatters and pieces travel in all directions.
   
Implementation:
   All of the asteroids are spherical entities, so their hitboxes are based on the origin of their transforms and the given radius. Because we have three spaceships, each one needs a separate hitbox. To do this, we constructed a frame of points that extends from the central spaceship transform. By choosing points that are on specific edges of the spaceship, hitbox collision can be detected quickly and without redundant points. The hitboxes of each of the ships are shown below.
	The hit boxes are shown located at the front of the ships as well as on the top most and bottom most portions.  This is done because the ship itself only travels forward and does not travel backwards, therefore if it makes any contact with an asteroid it will be on the front, top or bottom of the ship and set off the hitbox.  Additionally, the laser fired from the spacecraft operates with a simple hitbox.  This is a very trivial hitbox, since the laser is small it simply checks the overlap laser with the asteroid itself.
	The way this calculation is performed is shown in a pseudocode below:
    Loop through number of asteroids
	      Loop through number of hitboxes/lasers
		        If ( hitbox (x,y,z)  - asteroid center (x,y,z) <= asteroid size )
			         Animate asteroid explosion and if it is ship hitbox, explode ship and end game
