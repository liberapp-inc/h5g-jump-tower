// Liberapp 2019 - Tahiti Katagai
// 障害物ブロック

class Block extends PhysicsObject{

    static newBase( px:number, py:number ):Block{
        return new Block( px, py, Util.w( BLOCK_SIZE_PER_W * 2 ), Util.h( BLOCK_SIZE_PER_H ), true, 0, 0 );
    }
    static newBlock( px:number, py:number, scale:number, vx:number ):Block{
        return new Block( px, py, Util.w( BLOCK_SIZE_PER_W * 2 * scale ), Util.w( BLOCK_SIZE_PER_W * scale ), false, vx, 0 );
    }
    
    static blocks:Block[] = [];

    sizeW:number;
    sizeH:number;
    color:number;
    base:boolean;

    constructor( px:number, py:number, w:number, h:number, base:boolean, vx:number, vy:number ) {
        super();

        Block.blocks.push(this);
        this.sizeW = w;
        this.sizeH = h;
        this.color = BLOCK_COLOR;
        this.base = base;
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
        shape.graphics.beginFill( this.color );
        shape.graphics.drawRect( -0.5*this.sizeW, -0.5*this.sizeH, this.sizeW, this.sizeH );
        shape.graphics.endFill();
    }

    setBody( px:number, py:number ){
        if( this.base )
            this.body = new p2.Body( {gravityScale:0, mass:1, position:[this.p2m(px), this.p2m(py)], type:p2.Body.STATIC} );
        else
            this.body = new p2.Body( {gravityScale:0, mass:1, position:[this.p2m(px), this.p2m(py)]} );
        this.body.addShape(new p2.Box( { width:this.p2m(this.sizeW), height:this.p2m(this.sizeH), collisionGroup:PHYSICS_GROUP_BLOCK, collisionMask:PHYSICS_GROUP_PLAYER|PHYSICS_GROUP_BLOCK } ), [0, 0], 0);
        this.body.displays = [this.display];
        PhysicsObject.world.addBody(this.body);
    }

    fixedUpdate() {
        Camera2D.transform( this.display );

        const r = this.body.boundingRadius;
        if( (this.display.x - Util.width*0.5)**2 > (Util.width*0.5+r)**2 || this.display.y > Util.height+r ){
            this.destroy();
        }
    }
}
