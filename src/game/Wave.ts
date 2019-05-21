// Liberapp 2019 - Tahiti Katagai
// ブロック生成

class Wave extends GameObject{

    static I:Wave = null;
    static readonly speedMin = 1/(60*10);
    static readonly speedMax = 1/(60*2.0);
    random:Random;
    scroll:number = 0;
    period:number = 0;
    speedY:number;
    wave:number = 0;
    map:number[] = null;
    mapIndex:number = 0;

    constructor() {
        super();

        Wave.I = this;
        this.random = new Random();
        this.speedY = Util.height * Wave.speedMin;
    }

    update() {
        if( Player.I.state == Player.I.stateNone ) return;

        const hardRate = Util.clamp( this.scroll / (10 * Util.height), 0, 1 );
    }
}

