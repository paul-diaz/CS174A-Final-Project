//---------------------------------------------------------------Custom Shapes-----------------------------------------------------
window.Cube = window.classes.Cube =
    class Cube extends Shape {
        // Here's a complete, working example of a Shape subclass.  It is a blueprint for a cube.
        constructor() {
            super("positions", "normals"); // Name the values we'll define per each vertex.  They'll have positions and normals.

            // First, specify the vertex positions -- just a bunch of points that exist at the corners of an imaginary cube.
            this.positions.push(...Vec.cast(
                [-1, -1, -1], [1, -1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, -1], [-1, 1, -1], [1, 1, 1], [-1, 1, 1],
                [-1, -1, -1], [-1, -1, 1], [-1, 1, -1], [-1, 1, 1], [1, -1, 1], [1, -1, -1], [1, 1, 1], [1, 1, -1],
                [-1, -1, 1], [1, -1, 1], [-1, 1, 1], [1, 1, 1], [1, -1, -1], [-1, -1, -1], [1, 1, -1], [-1, 1, -1]));
            // Supply vectors that point away from eace face of the cube.  They should match up with the points in the above list
            // Normal vectors are needed so the graphics engine can know if the shape is pointed at light or not, and color it accordingly.
            this.normals.push(...Vec.cast(
                [0, -1, 0], [0, -1, 0], [0, -1, 0], [0, -1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0],
                [-1, 0, 0], [-1, 0, 0], [-1, 0, 0], [-1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0], [1, 0, 0],
                [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, -1], [0, 0, -1], [0, 0, -1], [0, 0, -1]));

            // Those two lists, positions and normals, fully describe the "vertices".  What's the "i"th vertex?  Simply the combined
            // data you get if you look up index "i" of both lists above -- a position and a normal vector, together.  Now let's
            // tell it how to connect vertex entries into triangles.  Every three indices in this list makes one triangle:
            this.indices.push(0, 1, 2, 1, 3, 2, 4, 5, 6, 5, 7, 6, 8, 9, 10, 9, 11, 10, 12, 13, 14, 13, 15, 14, 16, 17, 18, 17, 19, 
            18, 20, 21, 22, 21, 23, 22);
            // It stinks to manage arrays this big.  Later we'll show code that generates these same cube vertices more automatically.
        }
    };
//------------------------------------------------------------------------------------------------------------------------------

window.Final_Project_Scene = window.classes.Final_Project_Scene =
class Final_Project_Scene extends Scene_Component
  { constructor( context, control_box )     // The scene begins by requesting the camera, shapes, and materials it will need.
      { super(   context, control_box );    // First, include a secondary Scene that provides movement controls:
        if( !context.globals.has_controls   ) 
          context.register_scene_component( new Movement_Controls( context, control_box.parentElement.insertCell() ) ); 

        context.globals.graphics_state.camera_transform = Mat4.look_at( Vec.of( 0,10,20 ), Vec.of( 0,0,0 ), Vec.of( 0,1,0 ) );
        this.initial_camera_location = Mat4.inverse( context.globals.graphics_state.camera_transform );

        const r = context.width/context.height;
        context.globals.graphics_state.projection_transform = Mat4.perspective( Math.PI/4, r, .1, 1000 );

        const shapes = { torus:  new Torus( 15, 15 ),
                         torus2: new ( Torus.prototype.make_flat_shaded_version() )( 100, 100 ),
                         sphere1: new ( Subdivision_Sphere.prototype.make_flat_shaded_version() ) (1),
                         sphere2: new ( Subdivision_Sphere.prototype.make_flat_shaded_version() ) (2),
                         sphere3: new ( Subdivision_Sphere.prototype.make_flat_shaded_version() ) (3),
                         sphere4: new ( Subdivision_Sphere.prototype.make_flat_shaded_version() ) (4),
                         'box': new Cube(),
                         'triangle': new Triangle(),
                         'tetrahedron': new Tetrahedron(),
                         'windmill': new Windmill(),
                         'cylinder': new Cylindrical_Tube(),
                         'cone': new Cone_Tip()
                        }
        this.submit_shapes( context, shapes );                   
                                     // Make some Material objects available to you:
        this.materials =
          { test:     context.get_instance( Phong_Shader ).material( Color.of( 1,1,1,1 ), { ambient:.2 } ),

                                // TODO:  Fill in as many additional material objects as needed in this key/value table.
                                //        (Requirement 1)
          }
        this.clay = context.get_instance(Phong_Shader).material(Color.of(.9, .5, .9, 1), {
            ambient: .4,
            diffusivity: .4
        });
        this.white = context.get_instance(Basic_Shader).material();
        this.plastic = this.clay.override({specularity: .6});

        this.lights = [ 
        new Light( Vec.of( 5,-10,5,1 ), Color.of( 0, 1, 1, 1 ), 1000 ) 
        ];

        //Custom Objects
        this.rocket_transform = Mat4.identity();
        this.t = 0;
        this.context = context;         //do nothing as of now
        this.rocket = Mat4.identity();  //do nothing as of now
        this.aster_1 = Mat4.identity(); //do nothing as of now
      }


      
      //TODO - ADD CODE TO MAKE THESE ROTATE THE ROCKET
    make_control_panel(graphics_state)
    // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurement
      {
          let r = Math.PI/8.
          this.control_panel.innerHTML += "Use these controls to <br> fly your rocket!<br>";
          this.key_triggered_button( "Rotate up", [ "w" ], () => {
                this.rocket_transform = this.rocket_transform.times(Mat4.rotation(r, Vec.of(1,0,0)))
          });
          this.key_triggered_button( "Rotate left",  [ "a" ], () => {
                this.rocket_transform = this.rocket_transform.times(Mat4.rotation(r, Vec.of(0,0,1)))

          });
          this.key_triggered_button( "Rotate down", [ "s" ], () => {
                this.rocket_transform = this.rocket_transform.times(Mat4.rotation(-r, Vec.of(1,0,0)))
          });
          this.new_line();
          this.key_triggered_button( "Rotate right", [ "d" ], () => {
                this.rocket_transform = this.rocket_transform.times(Mat4.rotation(-r, Vec.of(0,0,1)))
          });
          this.key_triggered_button( "Fire Booster", [ "'" ], () => {
                this.rocket_transform = this.rocket_transform.times(Mat4.translation([0, 0.5, 0]))
          }); 
          this.key_triggered_button( "Fire Reverse Booster", [ "[" ], () => {
                this.rocket_transform = this.rocket_transform.times(Mat4.translation([0, -0.5, 0]))
          });           this.key_triggered_button( "Fire laser", [ ";" ], () => {
            //This shit don't work
                let laser_tf = this.rocket_transform;
                laser_tf = laser_tf.times(Mat4.translation([0,3,0])); //Current tip of rocket height
                laser_tf = laser_tf.times(Mat4.scale([1, 3, 1]));
                laser_tf = laser_tf.times(Mat4.translation([0,this.t,0]));
                this.shapes.box.draw(graphics_state, laser_tf, this.plastic.override({color: Color.of(57/255,1,20/255,1)}));
          });
      }


    display( graphics_state )
      { graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
        const t = graphics_state.animation_time / 1000, 
        dt = graphics_state.animation_delta_time / 1000;
        this.t = t;
        let model_transform = Mat4.identity();

        //Color List
        const grey = Color.of(180/255, 180/255, 180/255, 1), white = Color.of(1,1,1,1), yellow = Color.of(1, 1, 0, 1);
        
        //Rocket Body
        let rbody_tf = this.rocket_transform;
        rbody_tf = rbody_tf.times(Mat4.scale([1, 2, 1]))
        this.shapes.box.draw(graphics_state, rbody_tf, this.plastic.override({color: grey}));

        //Rocket Nose
        let rnose_tf = this.rocket_transform;
        rnose_tf = rnose_tf.times(Mat4.translation([0,2.5,0]));
        rnose_tf = rnose_tf.times(Mat4.scale([0.5, 0.5, 0.5]));
//         this.shapes.box.draw(graphics_state, rnose_tf, this.plastic.override({color: white}));
        this.shapes.box.draw(graphics_state, rnose_tf, this.materials.test);
      }
  }


