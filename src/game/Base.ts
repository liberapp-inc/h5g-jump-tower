// Liberapp 2019 - Tahiti Katagai
// 土台ブロック

class Base extends PhysicsObject{

    sizeW:number;
    sizeH:number;
    color:number;

    static newBase( px:number, py:number ):Base{
        return new Base( px, py, Util.w( BLOCK_SIZE_PER_W * 2 ), Util.h( BLOCK_SIZE_PER_H ) );
    }

    constructor( px:number, py:number, w:number, h:number ) {
        super();

        this.sizeW = w;
        this.sizeH = h;
        this.color = BLOCK_COLOR;
        this.setDisplay( px, py );
        this.setBody( px, py );
        this.display.rotation = this.body.angle * 180 / Math.PI;
        Camera2D.transform( this.display );
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
        this.body = new p2.Body( {gravityScale:0, mass:1, position:[this.p2m(px), this.p2m(py)], type:p2.Body.STATIC} );
        this.body.addShape(new p2.Box( { width:this.p2m(this.sizeW), height:this.p2m(this.sizeH), collisionGroup:PHYSICS_GROUP_BLOCK, collisionMask:PHYSICS_GROUP_PLAYER|PHYSICS_GROUP_BLOCK } ), [0, 0], 0);
        this.body.displays = [this.display];
        PhysicsObject.world.addBody(this.body);
    }

    fixedUpdate() {
        Camera2D.transform( this.display );
    }
}
