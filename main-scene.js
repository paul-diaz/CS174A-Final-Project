window.Assignment_Three_Scene = window.classes.Assignment_Three_Scene =
class Assignment_Three_Scene extends Scene_Component
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
                         sphere4: new ( Subdivision_Sphere.prototype.make_flat_shaded_version() ) (4)
 
                                // TODO:  Fill in as many additional shape instances as needed in this key/value table.
                                //        (Requirement 1)
                       }
        this.submit_shapes( context, shapes );
                                     
                                     // Make some Material objects available to you:
        this.materials =
          { test:     context.get_instance( Phong_Shader ).material( Color.of( 1,1,0,1 ), { ambient:.2 } ),
            ring:     context.get_instance( Ring_Shader  ).material(),

                                // TODO:  Fill in as many additional material objects as needed in this key/value table.
                                //        (Requirement 1)
          }

        this.lights = [ 
        new Light( Vec.of( 5,-10,5,1 ), Color.of( 0, 1, 1, 1 ), 1000 ) 
        ];

        //Custom Objects
        this.context = context;
        this.sun = this.initial_camera_location
        this.planet_1 = this.sun;
        this.planet_2 = this.sun;
        this.planet_3 = this.sun;
        this.planet_4 = this.sun;
        this.planet_5 = this.sun;
        this.moon = this.sun;
        this.attached();

      }
//End of Constructor

attached() {
  return this.sun;
}

    make_control_panel(graphics_state)
    // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurement
      { this.key_triggered_button( "View solar system",  [ "0" ], () => this.attached = () => this.initial_camera_location );
        this.new_line();
        this.key_triggered_button( "Attach to planet 1", [ "1" ], () => this.attached = () => this.planet_1 );
        this.key_triggered_button( "Attach to planet 2", [ "2" ], () => this.attached = () => this.planet_2 ); this.new_line();
        this.key_triggered_button( "Attach to planet 3", [ "3" ], () => this.attached = () => this.planet_3 );
        this.key_triggered_button( "Attach to planet 4", [ "4" ], () => this.attached = () => this.planet_4 ); this.new_line();
        this.key_triggered_button( "Attach to planet 5", [ "5" ], () => this.attached = () => this.planet_5 );
        this.key_triggered_button( "Attach to moon",     [ "m" ], () => this.attached = () => this.moon     );
      }


//End of Control Panel
    display( graphics_state )
      { graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
        const t = graphics_state.animation_time / 1000, 
        dt = graphics_state.animation_delta_time / 1000;
        let model_transform = Mat4.identity();
        
        //Size equation
        let m = 2/5;
        let w = 2*Math.PI/5;
        let s = -Math.cos(w*t) + 2;

        model_transform = model_transform.times(Mat4.scale([s,s,s]));

        // TODO:  Fill in matrix operations and drawing code to draw the solar system scene (Requirements 2 and 3)
        //Color Equation
        let b = 0.5*(Math.cos(2*Math.PI*t/5) + 1);
        let r = 0.5*(Math.sin(2*Math.PI*(t-Math.PI/2)/5) + 1);

        //Planet 2 gouraud shading odd seconds and regular smooth every even second
        let g = 0;
        if (Math.floor(t)%2 == 1) {
          g = 1;
        }

        this.materials =
          { sun:     this.context.get_instance( Phong_Shader ).material( Color.of( r,0,b,1 ), 
             { ambient:1 } ),
            planet1: this.context.get_instance( Phong_Shader ).material( Color.of( 160/256,160/256,160/256, 1 ), 
             { diffusivity: 1} ),
            planet2: this.context.get_instance( Phong_Shader ).material( Color.of( 0, 102/256, 51/256, 1 ), 
             { specular: 1, diffusivity: 1, gouraud: g} ),
            planet3: this.context.get_instance( Phong_Shader ).material( Color.of( 102/256, 51/256, 0, 1 ), 
             { specular: 1, diffusivity: 1} ),
            planet4: this.context.get_instance( Phong_Shader ).material( Color.of( 0, 102/256, 204/256, 1 ), 
             { specular: 1} ),
            moon:    this.context.get_instance( Phong_Shader ).material( Color.of( 160/256,160/256,160/256, 1 ), 
             { ambient: 1} ),
            
            ring:    this.context.get_instance( Phong_Shader ).material( Color.of( 1,1,0,1 ), { ambient:.2 } )
          }
        
        //Lights Equation
        this.lights = [ 
        new Light( Vec.of( 5,-10,5,1 ), Color.of( 0, 1, 1, 1 ), 100000 ), //Maybe redundant but not sure if deletes constructor light
        new Light( Vec.of( 0, 0, 0, 1 ), Color.of( r, 0, b, 1 ), 10**s ) 
        ];

        // Create sun
        this.shapes.sphere4.draw( graphics_state, model_transform, this.materials.sun);
        
        // Set rate of rotating planets depending on radius
        let r1 = 5;
        let r2 = 8;
        let r3 = 11;
        let r4 = 14;
        let c = 10;
        let rot1 = c*t/r1;
        let rot2 = c*t/r2;
        let rot3 = c*t/r3;
        let rot4 = c*t/r4;


        // Create planet 1
        let model_transform_p1 = Mat4.identity();
        model_transform_p1 = model_transform_p1.times(Mat4.rotation(rot1, Vec.of(0,1,0)));
        model_transform_p1 = model_transform_p1.times(Mat4.translation([0,0,-r1]));
        this.shapes.sphere2.draw( graphics_state, model_transform_p1, this.materials.planet1);

        model_transform_p1 = model_transform_p1.times(Mat4.rotation(Math.PI/2, Vec.of(0,1,0)));
        this.planet_1 = model_transform_p1;

        // Create planet 2
        let model_transform_p2 = Mat4.identity();
        model_transform_p2 = model_transform_p2.times(Mat4.rotation(rot2, Vec.of(0,1,0)));
        model_transform_p2 = model_transform_p2.times(Mat4.translation([0,0,-r2]));
        //Check for gouraud vs smooth shading
//                 model_transform_p2 = model_transform_p2.times(Mat4.scale([3,3,3]));
        this.shapes.sphere3.draw( graphics_state, model_transform_p2, this.materials.planet2);

        model_transform_p2 = model_transform_p2.times(Mat4.rotation(Math.PI/2, Vec.of(0,1,0)));
        this.planet_2 = model_transform_p2;

        // Create planet 3
        let model_transform_p3 = Mat4.identity();
        model_transform_p3 = model_transform_p3.times(Mat4.rotation(rot3, Vec.of(0,1,0.1)));
        model_transform_p3 = model_transform_p3.times(Mat4.translation([0,0,-r3 + Math.sin(Math.PI*t/20)]));
        //Wobble Rotation
        model_transform_p3 = model_transform_p3.times(Mat4.rotation(Math.PI/2 + 0.8*Math.sin(t) , Vec.of(1,0,0)));    
        this.shapes.sphere4.draw( graphics_state, model_transform_p3, this.materials.planet3);        
        let model_transform_p3_ring = model_transform_p3.times(Mat4.scale([.9,.9,1/15]));                
        this.shapes.torus2.draw( graphics_state, model_transform_p3_ring, this.materials.planet3);

        model_transform_p3 = model_transform_p3.times(Mat4.rotation(Math.PI/2, Vec.of(0,1,0)));
        model_transform_p3 = model_transform_p3.times(Mat4.rotation(Math.PI/2, Vec.of(0,0,1)));
        this.planet_3 = model_transform_p3;


        // Create planet 4
        let model_transform_p4 = Mat4.identity();
        model_transform_p4 = model_transform_p4.times(Mat4.rotation(rot4, Vec.of(0,1,0)));
        model_transform_p4 = model_transform_p4.times(Mat4.translation([0,0,-r4]));
        this.shapes.sphere4.draw( graphics_state, model_transform_p4, this.materials.planet4);

        this.planet_4 = model_transform_p4;
        
        //Create moon of planet 4
        let model_transform_p4_moon = model_transform_p4
        model_transform_p4_moon = model_transform_p4_moon.times(Mat4.translation([0,0,2]));
        model_transform_p4_moon = model_transform_p4_moon.times(Mat4.rotation(rot4, Vec.of(0,1,0)));
        model_transform_p4_moon = model_transform_p4_moon.times(Mat4.scale([.4,.4,.4]));                
        this.shapes.sphere1.draw( graphics_state, model_transform_p4_moon, this.materials.planet1);
        
        this.moon = model_transform_p4_moon;

        //Camera Buttons
        let target = this.attached();
        target = Mat4.inverse(target.times(Mat4.translation([0, 0, 5])));
//         target = Mat4.inverse(target);
        graphics_state.camera_transform = target;
      }
  }

// Extra credit begins here (See TODO comments below): /////////////////////////////

window.Ring_Shader = window.classes.Ring_Shader =
class Ring_Shader extends Shader              // Subclasses of Shader each store and manage a complete GPU program.
{ material() { return { shader: this } }      // Materials here are minimal, without any settings.
  map_attribute_name_to_buffer_name( name )       // The shader will pull single entries out of the vertex arrays, by their data fields'
    {                                             // names.  Map those names onto the arrays we'll pull them from.  This determines
                                                  // which kinds of Shapes this Shader is compatible with.  Thanks to this function, 
                                                  // Vertex buffers in the GPU can get their pointers matched up with pointers to 
                                                  // attribute names in the GPU.  Shapes and Shaders can still be compatible even
                                                  // if some vertex data feilds are unused. 
      return { object_space_pos: "positions" }[ name ];      // Use a simple lookup table.
    }
    // Define how to synchronize our JavaScript's variables to the GPU's:
  update_GPU( g_state, model_transform, material, gpu = this.g_addrs, gl = this.gl )
      { const proj_camera = g_state.projection_transform.times( g_state.camera_transform );
                                                                                        // Send our matrices to the shader programs:
        gl.uniformMatrix4fv( gpu.model_transform_loc,             false, Mat.flatten_2D_to_1D( model_transform.transposed() ) );
        gl.uniformMatrix4fv( gpu.projection_camera_transform_loc, false, Mat.flatten_2D_to_1D(     proj_camera.transposed() ) );
      }
  shared_glsl_code()            // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
    { return `precision mediump float;
              varying vec4 position;
              varying vec4 center;
      `;
    }
  vertex_glsl_code()           // ********* VERTEX SHADER *********
    { return `
        attribute vec3 object_space_pos;
        uniform mat4 model_transform;
        uniform mat4 projection_camera_transform;

        void main()
        { 
        }`;           // TODO:  Complete the main function of the vertex shader (Extra Credit Part II).
    }
  fragment_glsl_code()           // ********* FRAGMENT SHADER *********
    { return `
        void main()
        { 
        }`;           // TODO:  Complete the main function of the fragment shader (Extra Credit Part II).
    }
}

window.Grid_Sphere = window.classes.Grid_Sphere =
class Grid_Sphere extends Shape           // With lattitude / longitude divisions; this means singularities are at 
  { constructor( rows, columns, texture_range )             // the mesh's top and bottom.  Subdivision_Sphere is a better alternative.
      { super( "positions", "normals", "texture_coords" );
        

                      // TODO:  Complete the specification of a sphere with lattitude and longitude lines
                      //        (Extra Credit Part III)
      } }