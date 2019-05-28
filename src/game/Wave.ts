// Liberapp 2019 - Tahiti Katagai
// ブロック生成

class Wave extends GameObject{

    static readonly speedMin = 1/(60*10);
    static readonly speedMax = 1/(60*2.0);
    speed:number = Wave.speedMin;
    count:number = 0;
    frame:number = 0;

    constructor() {
        super();
    }

    update() {
        if( Player.I.state == Player.I.stateNone ) return;

        if( (--this.frame) <= 0 ){
            this.count++;
            const hardRate = Util.clamp( this.count / 30, 0, 1 );   // 0~1
            const random = randI( 0, 10 );
            this.frame = Util.lerp( 150, 120, hardRate );
            const xlr = (this.count & 1) * 2 - 1; // -1 or +1
            const xrange = Util.w(0.5+BLOCK_SIZE_PER_W) * xlr;
            const px = -xrange;
            const py = -Util.h(BLOCK_SIZE_PER_H) * (this.count + 0.05);
            let   sizeW = 1;
            let   color = (random & 1) != 0 ? BLOCK_COLOR : BLOCK_COLOR2;

            if( this.count >= 5 ){
                if( random == 0 ){
                    sizeW = 0.75;
                    color = BLOCK_COLOR_SMALL;
                }
                if( random == 1 ){
                    this.frame *= 0.75;
                    color = BLOCK_COLOR_FAST;
                }
            }
            const vx = xrange / this.frame;
            Block.newBlock( this.frame, px, py, sizeW, vx, color );
        }
    }
}

