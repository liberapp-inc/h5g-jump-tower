// Liberapp 2019 - Tahiti Katagai
// ブロック生成

class Wave extends GameObject{

    static I:Wave = null;
    static readonly speedMin = 1/(60*10);
    static readonly speedMax = 1/(60*2.0);
    random:Random;
    speed:number = Wave.speedMin;
    count:number = 0;
    frame:number = 0;

    constructor() {
        super();

        Wave.I = this;
        this.random = new Random();
    }

    onDestroy(){
        Wave.I = null;
    }

    update() {
        if( Player.I.state == Player.I.stateNone ) return;

        const hardRate = Util.clamp( this.count / 20, 0, 1 );

        this.frame--;
        if( this.frame <= 0 ){
            this.frame = Util.lerp( 60, 40, hardRate );
            this.count++;

            const xlr = (this.count & 1) * 2 - 1; // -1 or +1

            const xrange = Util.w(0.5) * xlr;
            const vx = xrange / this.frame;
            const px = -xrange;
            const py = -Util.h(BLOCK_SIZE_PER_H) * (this.count + 0.05);
            Block.newBlock( px, py, 1, vx );

            Player.I.topBlockY = py;
        }
    }
}

