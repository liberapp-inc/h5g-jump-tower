// Liberapp 2019 - Tahiti Katagai
// スタート時の説明テキスト

class StartMessage extends GameObject{

    texts:egret.TextField[] = [];
    
    constructor() {
        super();

        this.texts[0] = Util.newTextField("ジャンプの塔", Util.width / 12, FONT_COLOR, 0.5, 0.3, true, false);
        this.texts[1] = Util.newTextField("左右から迫ってくるブロックに", Util.width / 18, FONT_COLOR, 0.5, 0.4, true, false);
        this.texts[2] = Util.newTextField("ジャンプして登っていこう", Util.width / 18, FONT_COLOR, 0.5, 0.5, true, false);
        this.texts.forEach( text =>{ GameObject.display.addChild( text ); });

        GameObject.display.once(egret.TouchEvent.TOUCH_BEGIN, this.tap, this);
    }

    onDestroy(){
        this.texts.forEach( text =>{ GameObject.display.removeChild( text ); });
        this.texts = null;
    }

    update() {}

    tap(e:egret.TouchEvent){
        Player.I.setStateStand();
        this.destroy();
    }
}
