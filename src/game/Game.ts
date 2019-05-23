// Liberapp 2019 - Tahiti Katagai
// ゲームシーン

const PIXEL_PER_METER = 1;
const PLAYER_RADIUS_PER_W = 1/18;
const BLOCK_IN_W = 4;
const BLOCK_IN_H = 8;
const BLOCK_SIZE_PER_W = 1 / BLOCK_IN_W;
const BLOCK_SIZE_PER_H = 1 / BLOCK_IN_H;

const PHYSICS_GRAVITY_PER_H = 0.5;
const PHYSICS_GROUP_PLAYER = 1<<1;
const PHYSICS_GROUP_BLOCK = 1<<2;

const SAVE_KEY_BESTSCORE = "jump-tower-bestScore";

const BACK_COLOR = 0xFF2ED0;    // index.htmlで設定
const FONT_COLOR = 0xFFFFFF;
const PLAYER_COLOR = 0xFFFFFF;
const BLOCK_COLOR  = 0x5EFEFF;
const BLOCK_COLOR2 = 0x8A41FF;

class Game {

    static loadSceneGamePlay() {
        PhysicsObject.deltaScale = 1;
        new Score();
        Base.newBase( 0, 0 );
        new Player( 0, 0 - Util.h(BLOCK_SIZE_PER_H*0.5) - Util.w(PLAYER_RADIUS_PER_W*1.1) );
        new Wave();
        new StartMessage();
    }
}
