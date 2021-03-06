import Phaser from "phaser";
import * as Config from "../config";
import * as GlobalConst from "../../../globalconst";
import Player from "../element/player";
import LifeBar from  "../block/lifebar";
import PlayState from "./play";
import I18nUtil from "../../../util/i18n";

class Play1PState extends PlayState {
    constructor() {
        super();
    }

    create(game) {
        // 遊戲初始化
        this.initGame();

        // 建置移動階梯
        this.createLedgesRunner();

        // 建置邊界
        this.createBounds();

        // 玩家角色建置
        this.player = new Player(
            game,
            Config.PlayerType.Green,
            Config.PlayerIniPos.X,
            Config.PlayerIniPos.Y,
            Config.PorkOldManAtlasName,
        );
        game.add.existing(this.player.effect);
        game.add.existing(this.player);
        game.physics.arcade.enable(this.player);
        this.player.body.gravity.y = Config.PlayerGravity.Y;
        this.player.body.collideWorldBounds = true;

        // 建立上方邊界的刺
        this.createTopThorns();

        // 繪製邊框
        this.createMainBox();

        // 加入滾動式計數器
        this.createScrollCounter();

        // 加入生命條
        this.lifeText = new Phaser.BitmapText(
            this.game,
            Config.LifeTextPos.X,
            Config.LifeTextPos.Y,
            Config.DollBitmapFontName,
            I18nUtil.dict.LifeText,
            GlobalConst.BitmapFont34Style.Size
        );
        this.lifeText.anchor.setTo(
            Config.LifeTextPos.Anchor.X,
            Config.LifeTextPos.Anchor.Y
        );
        this.game.add.existing(this.lifeText);
        this.lifeBar = new LifeBar(this.game, Config.LifeBarPos.X, Config.LifeBarPos.Y);

        // 加入倒數計時
        this.createCountDownEffect();

        // 加入提示訊息
        this.createHintBox();

        // 加入暫停選單
        this.createPauseMenu();

        // 監聽輸入: 上下左右鍵
        this.cursors = game.input.keyboard.createCursorKeys();
        // 監聽esc鍵
        this.escKey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        // 監聽space鍵
        this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        // 配置每種階梯的比重 (該比重會影響階梯的出現率)
        this.adjustGameDifficulty();
        // 亂數設置所有階梯的種類
        this.ledgesRunner.randAllLedges();
        // 將中間的階梯設為普通階梯，並將位置移到玩家初始所站位置
        this.ledgesRunner.setLedgeToNormalType(Config.MiddleLedgesNumber);
        this.ledgesRunner.setLedgePos(Config.MiddleLedgesNumber, Config.LedgeMiddlePos.X, undefined);

        // 每5秒調整一次遊戲難度
        this.gameTimer.loop(Phaser.Timer.SECOND * 5,  this.adjustGameDifficulty.bind(this), this);

        // 開始遊戲！
        this.startGame();
    }

    update() {
        // 遊戲結束則不進行update
        if (this.isGameOver) {
            return;
        }
        // 偵測 space/esc 鍵是否按下
        if (this.spaceKey.justDown || this.escKey.justDown) {
            this.togglePauseEvent();
        }
        // 如果暫停中不進行update
        if (this.isPause) {
            return;
        }
        if (this.lifeBar.life <= 0) {
            this.endGame();
            return;
        }
        if (this.lifeBar.life > 0) {
            this.handlePlayerEvents(this.player, this.lifeBar, this.cursors);
        }
    }

    pausePlayer() {
        if (this.player !== null) {
            this.player.animations.paused = true;
        }
    }

    resumePlayer() {
        if (this.player !== null) {
            this.player.animations.paused = false;
        }
    }
}

export default Play1PState;
