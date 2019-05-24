// Liberapp 2019 - Tahiti Katagai
// 障害物ブロック

class Block extends PhysicsObject{

    static newBlock( frame:number, px:number, py:number, scale:number, vx:number ):Block{
        return new Block( frame, px, py, Util.w( BLOCK_SIZE_PER_W * scale ), Util.h( BLOCK_SIZE_PER_H ), vx, 0 );
    }
    
    static blocks:Block[] = [];

    frame:number;
    sizeW:number;
    sizeH:number;
    color:number;
    x:number;
    y:number;
    vx:number;
    vy:number;

    constructor( frame:number, px:number, py:number, w:number, h:number, vx:number, vy:number ) {
        super();

        Block.blocks.push(this);
        this.frame = frame;
        this.sizeW = w;
        this.sizeH = h;
        this.color = randBool() ? BLOCK_COLOR : BLOCK_COLOR2;
        this.x = px;
        this.y = py;
        this.vx = vx;
        this.vy = vy;
        this.setDisplay( px, py );
        this.setBody( px, py );
        this.display.rotation = this.body.angle * 180 / Math.PI;
        this.body.velocity[0] = vx;
        this.body.velocity[1] = vy;
        Camera2D.transform( this.display );
    }

    onDestroy(){
        Block.blocks = Block.blocks.filter( obj => obj != this );
    }

    setDisplay( px:number, py:number ){
        if( this.display )
            GameObject.display.removeChild( this.display );

        const shape = new egret.Shape();
        this.display = shape;
        GameObject.display.addChildAt(this.display, 1);
        shape.x = px;
        shape.y = py;
        shape.graphics.lineStyle(3, LINE_COLOR );
        shape.graphics.beginFill( this.color );
        shape.graphics.drawRect( -0.5*this.sizeW, -0.5*this.sizeH, this.sizeW, this.sizeH );
        shape.graphics.endFill();
    }

    setBody( px:number, py:number ){
        this.body = new p2.Body( {gravityScale:0, mass:1, position:[this.p2m(px), this.p2m(py)]} );
        this.body.addShape(new p2.Box( { width:this.p2m(this.sizeW), height:this.p2m(this.sizeH), collisionGroup:PHYSICS_GROUP_BLOCK, collisionMask:PHYSICS_GROUP_PLAYER|PHYSICS_GROUP_BLOCK } ), [0, 0], 0);
        this.body.displays = [this.display];
        PhysicsObject.world.addBody(this.body);
    }

    fixedUpdate() {
        // 等速横移動
        if( this.body.gravityScale <= 0 ){
            if( this.body.velocity[1] == 0 ){
                this.x += this.vx;
                this.y += this.vy;
                this.px = this.x;
                this.py = this.y;
                this.body.velocity[0] = this.vx;
                this.body.velocity[1] = this.vy;
            }else{
                this.body.gravityScale = 1;
            }
        }
        Camera2D.transform( this.display );

        // ミス判定　中央到達時にプレイヤーが下にいたらミス
        if( (--this.frame) == 0 ){
            Player.I.topBlockY = this.y;
            // if( Player.I.py >= this.y ){
            //     Player.I.miss();
            // }
        }
    }
}
