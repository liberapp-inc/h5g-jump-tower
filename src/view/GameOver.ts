// Liberapp 2019 Tahiti Katagai
// ゲームオーバー表示

class GameOver extends GameObject{

    texts:egret.TextField[] = [];
    retryButton:Button = null;
    step:number = 0;
    readonly fadeInFrame:number = 64;

    constructor() {
        super();

        if( Score.I ){
            this.texts[0] = Util.newTextField("SCORE : " + Score.I.point.toFixed(), Util.width / 12, FONT_COLOR, 0.5, 0.25, true, false);
            GameObject.display.addChild( this.texts[0] );

            if( Score.I.point >= Score.I.bestScore ){
                egret.localStorage.setItem(SAVE_KEY_BESTSCORE, Score.I.point.toFixed() ); // string
                this.texts[1] = Util.newTextField("NEW RECORD!", Util.width / 13, FONT_COLOR, 0.5, 0.4, true, false);
                this.texts[1].alpha = 0;
                GameObject.display.addChild( this.texts[1] );
            }
        }
    }

    onDestroy() {
        this.texts.forEach( text =>{ GameObject.display.removeChild( text ); });
        this.texts = null;
    }
    
    update() {
        this.step++;
        if( this.step <= this.fadeInFrame ){
            const a = this.step / this.fadeInFrame;
            this.texts[0].alpha = a;
            
            if( this.step == this.fadeInFrame ){
                this.retryButton = new Button("リトライ", Util.width/16, BACK_COLOR, 0.50, 0.65, 0.4, 0.1, FONT_COLOR, 1.0, this.onTapRetry );
            }
        }
        else{
            if( this.texts[1] ){
                this.texts[1].alpha = ( 0x40 - (this.step & 0x3f) ) / 0x40;
            }
        }
     }

    onTapRetry(){
        GameObject.transit = Game.loadSceneGamePlay;
        this.destroy();
    }
}
