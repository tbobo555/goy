import Phaser from "phaser";
import * as Config from "../config";
import * as TimeUtil from "../../../util/time";
import * as Sounds from "../sounds";

class PreloadState extends Phaser.State {
    constructor() {
        super();
        // loading文字
        this.loadingText = null;
        // loading進度條
        this.loadingProgress = null;
    }

    create(game){
        game.load.onFileComplete.add(this.fileComplete.bind(this), this);
        game.load.onLoadComplete.add(this.loadComplete.bind(this), this);

        // 建立loading文字
        this.loadingText = game.add.text(
            Config.LoadingTextPos.X,
            Config.LoadingTextPos.Y,
            "loading...",
            Config.DefaultFontStyle
        );
        this.loadingText.anchor.setTo(Config.LoadingTextPos.Anchor.X, Config.LoadingTextPos.Anchor.Y);

        // 建立loading進度條
        this.loadingProgress = game.add.text(
            Config.LoadingProgressPos.X,
            Config.LoadingProgressPos.Y,
            "0%",
            Config.DefaultFontStyle
        );
        this.loadingProgress.anchor.setTo(Config.LoadingProgressPos.Anchor.X, Config.LoadingProgressPos.Anchor.Y);

        this.startLoad();
    }

    startLoad() {
        // 預先載入資源
        this.game.load.atlasJSONHash(
            Config.PorkOldManAtlasName,
            Config.PorkOldManAtlasPath.Image,
            Config.PorkOldManAtlasPath.JSON
        );
        this.game.load.atlasJSONHash(
            Config.MainTextureAtlasName,
            Config.MainTextureAtlasPath.Image,
            Config.MainTextureAtlasPath.JSON
        );
        this.game.load.atlasJSONHash(
            Config.LedgesAtlasName,
            Config.LedgesAtlasPath.Image,
            Config.LedgesAtlasPath.JSON
        );
        let styles = {
            font: "60px Play",
            fill: "black",
            align: "center",
            wordWrap: true,
            wordWrapWidth: 5
        };
        let scrollCounter = new Phaser.Text(this.game, 0, 0, "0 1 2 3 4 5 6 7 8 9", styles);
        this.game.load.image(Config.ScrollCounterImageName, scrollCounter.generateTexture().getImage().src);

        // 載入 bitmap font
        this.game.load.bitmapFont(
            Config.DollBitmapFontName,
            Config.DollBitmapFontPath.Texture,
            Config.DollBitmapFontPath.Atlas
        );
        this.game.load.bitmapFont(
            Config.DollBigBitmapFontName,
            Config.DollBigBitmapFontPath.Texture,
            Config.DollBigBitmapFontPath.Atlas
        );

        // 載入音效
        this.game.load.audiosprite(
            Config.SoundsName,
            [
                Config.SoundsPath.MP3,
                Config.SoundsPath.OGG
            ],
            Config.SoundsPath.JSON
        );

        this.game.load.start();
    }

    fileComplete(progress) {
        this.loadingProgress.text = progress + "%";
    }

    loadComplete() {
        Sounds.init(this.game);
        TimeUtil.sleep(300).then(() => {
            this.game.state.start("MainMenu");
        });
    }
}

export default PreloadState;
