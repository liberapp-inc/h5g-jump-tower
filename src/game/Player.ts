// Liberapp 2019 - Tahiti Katagai
// プレイヤー

class Player extends PhysicsObject{

    static I:Player = null;

    radius:number;
    button:Button;
    topBlockY:number = 0;
    state:()=>void = this.stateNone;
    step:number = 0;
    scale:number = 1;
    hit:boolean = false;

    constructor( px:number, py:number ) {
        super();

        Player.I = this;
        this.radius = PLAYER_RADIUS_PER_W * Util.width;
        this.setDisplay( px, py );
        this.setBody( px, py );
        Camera2D.transform( this.display );
        
        this.button = new Button( null, 0, 0, 0.5, 0.5, 1, 1, 0x000000, 0.0, null ); // 透明な全画面ボタン
    }

    onDestroy(){
        this.button.destroy();
        Player.I = null;
    }

    setDisplay( px:number, py:number ){
        if( this.display )
            GameObject.display.removeChild( this.display );

        const shape = new egret.Shape();
        this.display = shape;
        GameObject.display.addChild(this.display);
        shape.x = px;
        shape.y = py;
        shape.graphics.beginFill( PLAYER_COLOR );
        shape.graphics.drawCircle( 0, 0, this.radius );
        shape.graphics.endFill();
    }

    setBody( px:number, py:number ){
        this.body = new p2.Body( {gravityScale:0, mass:1, position:[this.p2m(px), this.p2m(py)] } );
        this.body.addShape(new p2.Circle({ radius:this.p2m(this.radius), collisionGroup:PHYSICS_GROUP_PLAYER, collisionMask:PHYSICS_GROUP_BLOCK }));
        this.body.displays = [this.display];
        PhysicsObject.world.addBody(this.body);
        PhysicsObject.world.on("beginContact", this.beginContact, this);
        PhysicsObject.world.on("endContact",   this.endContact,   this);
    }

    beginContact(e){
        const bodyA:p2.Body = e.bodyA;
        const bodyB:p2.Body = e.bodyB;
        if( bodyA == this.body || bodyB == this.body ){
            this.scale = 1.2;
            this.hit = true;
        }
    }
    endContact(e){
        const bodyA:p2.Body = e.bodyA;
        const bodyB:p2.Body = e.bodyB;
        if( bodyA == this.body || bodyB == this.body ){
            this.scale = 1.0;
            this.hit = false;
        }
    }

    fixedUpdate() {
        this.state();
        // this.scale += (1 - this.scale) * 0.2;
        this.cameraAtTop();
//        this.hit = false;
    }

    cameraAtTop(){
        let top = Math.min( this.topBlockY, this.py, Camera2D.y + Util.h(0.25) ) - Util.h(0.25);

        Camera2D.x = Util.w(-0.5);
        Camera2D.y = Math.min( top, -Util.h(0.25) );
        Camera2D.transform( this.display, this.scale );
    }

    cameraOverall(){

    }

    setStateNone(){
        this.state = this.stateNone;
    }
    stateNone(){}


    setStateStand(){
        this.state = this.stateStand;
        this.body.gravityScale = 1;
        this.step = 0;
    }
    stateStand() {
        if( this.hit ){
            this.body.velocity[0] *= 0.75;
            this.body.velocity[1] *= 0.75;

            // jump
            if( this.button.press ){
                this.setStateJump();
            }
        }
    }

    setStateJump(){
        this.state = this.stateJump;
        this.step = 0;
        this.body.velocity[1] = -Util.h(0.65);
    }
    stateJump(){
        if( this.step == 0 ){
            if( this.body.velocity[1] > 0 ){
                this.step = 1;
            }
        }
        else{
            if( this.body.velocity[1] <= 0 ){
                this.setStateStand();
            }
        }
    }
}
