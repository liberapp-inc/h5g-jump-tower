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
    fall:boolean = false;

    constructor( px:number, py:number ) {
        super();

        Player.I = this;
        this.radius = PLAYER_RADIUS_PER_W * Util.width;
        this.setDisplay( px, py );
        this.setBody( px, py );
        Camera2D.y = Util.h(-0.75);
        this.cameraAtTop();
        
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
        shape.graphics.lineStyle( 3, LINE_COLOR );
        shape.graphics.beginFill( PLAYER_COLOR );
        shape.graphics.drawCircle( 0, 0, this.radius );
        shape.graphics.endFill();
    }

    setBody( px:number, py:number ){
        this.body = new p2.Body( {gravityScale:0, mass:0.1, position:[this.p2m(px), this.p2m(py)] } );
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
            this.scale = 1.0;
            this.hit = true;
        }
    }
    endContact(e){
        const bodyA:p2.Body = e.bodyA;
        const bodyB:p2.Body = e.bodyB;
        if( bodyA == this.body || bodyB == this.body ){
            this.scale = 0.9;
            this.hit = false;
        }
    }

    fixedUpdate() {
        this.state();
    }

    cameraAtTop(){
        let top = Math.min( this.topBlockY-Util.h(0.25), this.py-Util.h(0.25), Camera2D.y );

        Camera2D.x = Util.w(-0.5);
        Camera2D.y = Util.lerp( Camera2D.y, Math.min( top, -Util.h(0.25) ), 0.25 );
        Camera2D.scale = 1;
        Camera2D.transform( this.display, this.scale );
    }

    cameraOverall(){
        let upper = this.topBlockY - Util.h(0.25);
        let lower = 0;
        let range = lower - upper;
        let camScale = Util.height / range;
        const rate = 1/16;
        Camera2D.x = Util.lerp( Camera2D.x, Util.w(-0.5)/camScale, rate );
        Camera2D.y = Util.lerp( Camera2D.y, Util.h(-0.5)/camScale + (lower + upper) * 0.5, rate );
        Camera2D.scale = Util.lerp( Camera2D.scale, camScale, rate );
        Camera2D.transform( this.display, this.scale );
    }

    setStateNone(){
        this.state = this.stateNone;
    }
    stateNone(){
        if( !this.fall )
            this.cameraAtTop();
        else
            this.cameraOverall();
    }


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
        this.cameraAtTop();
        this.checkFall();
    }

    setStateJump(){
        this.state = this.stateJump;
        this.step = 0;
        this.body.velocity[1] = -Util.h(JUMP_VELOCITY_PER_H);
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
                Score.I.addPoint();
            }
        }
        this.cameraAtTop();
        this.checkFall();
    }

    checkFall(){
        if( this.topBlockY - Util.h(BLOCK_SIZE_PER_H*0.5) <= this.py )
            this.miss();
    }

    miss(){
        if( this.state == this.stateNone )
            return;
        new GameOver();
        PhysicsObject.deltaScale = 0.1;
        this.state = this.stateNone;
        this.fall = true;
        this.topBlockY -= Util.h( BLOCK_SIZE_PER_H );
    }
}
