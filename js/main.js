var egret = window.egret;var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
/**
 * Created by egret on 15-1-16.
 */
var BaseGameObject = (function (_super) {
    __extends(BaseGameObject, _super);
    function BaseGameObject($controller) {
        var _this = _super.call(this) || this;
        _this.originX = 0;
        _this.originY = 0;
        _this.originZ = 0;
        _this.trueY = 0;
        _this.armature = new DragonBonesArmatureContainer();
        _this.addChild(_this.armature);
        _this.controller = $controller;
        return _this;
    }
    BaseGameObject.prototype.init = function () {
        this.hp = 300;
        this.isDie = false;
        App.TimerManager.doFrame(1, 0, this.onFrame, this);
    };
    BaseGameObject.prototype.destory = function () {
        this.armature.stop();
        App.TimerManager.remove(this.onFrame, this);
        App.DisplayUtils.removeFromParent(this);
        ObjectPool.push(this);
    };
    BaseGameObject.prototype.onFrame = function (time) {
        this.update(time);
        this.setPos();
    };
    BaseGameObject.prototype.setPos = function () {
        if (this.$getX() != this.originX) {
            this.$setX(this.originX);
        }
        if (this.$getY() != this.trueY) {
            this.$setY(this.trueY);
        }
    };
    BaseGameObject.prototype.update = function (time) {
    };
    BaseGameObject.prototype.registerArmature = function (actionName) {
    };
    Object.defineProperty(BaseGameObject.prototype, "x", {
        get: function () {
            return this.originX;
        },
        set: function (value) {
            this.originX = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseGameObject.prototype, "y", {
        get: function () {
            return this.originY;
        },
        set: function (value) {
            this.originY = value;
            this.trueY = this.originY + this.originZ;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseGameObject.prototype, "z", {
        get: function () {
            return this.originZ;
        },
        set: function (value) {
            this.originZ = value;
            this.trueY = this.originY + this.originZ;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseGameObject.prototype, "gameController", {
        get: function () {
            return this.controller;
        },
        enumerable: true,
        configurable: true
    });
    BaseGameObject.prototype.isMyFront = function (obj) {
        return this.scaleX == 1 ? this.x <= obj.x : this.x >= obj.x;
    };
    BaseGameObject.prototype.isMyBack = function (obj) {
        return this.scaleX == -1 ? this.x <= obj.x : this.x >= obj.x;
    };
    BaseGameObject.prototype.isMyLeft = function (obj) {
        return this.scaleX == -1 ? this.y <= obj.y : this.y >= obj.y;
    };
    BaseGameObject.prototype.isMyRight = function (obj) {
        return this.scaleX == 1 ? this.y <= obj.y : this.y >= obj.y;
    };
    BaseGameObject.prototype.isMyTop = function (obj) {
        return this.z >= obj.z;
    };
    BaseGameObject.prototype.isMyDown = function (obj) {
        return this.z <= obj.z;
    };
    BaseGameObject.ACTION_Idle = "daiji";
    BaseGameObject.ACTION_Move = "yidong";
    BaseGameObject.ACTION_Hart = "beiji";
    BaseGameObject.ACTION_Fly = "jifei";
    BaseGameObject.ACTION_Land = "daodi";
    BaseGameObject.ACTION_jump = "jump";
    return BaseGameObject;
}(egret.DisplayObjectContainer));
__reflect(BaseGameObject.prototype, "BaseGameObject");
/**
 * Created by egret on 15-1-16.
 */
var BaseMoveGameObject = (function (_super) {
    __extends(BaseMoveGameObject, _super);
    function BaseMoveGameObject($controller) {
        var _this = _super.call(this, $controller) || this;
        _this.maxSpeedZ = 30;
        _this.gravitySpeed = 1;
        return _this;
    }
    BaseMoveGameObject.prototype.init = function () {
        _super.prototype.init.call(this);
        this.speed = 0;
        this.speedX = 0;
        this.speedY = 0;
        this.speedZ = 0;
        this.endX = 0;
        this.endY = 0;
        this.radian = 0;
        this.alpha = 1;
        this.isCommand = false;
    };
    BaseMoveGameObject.prototype.destory = function () {
        _super.prototype.destory.call(this);
    };
    BaseMoveGameObject.prototype.update = function (time) {
        _super.prototype.update.call(this, time);
        var func = "state_" + this.currState;
        if (this.currState) {
            this[func](time);
        }
    };
    BaseMoveGameObject.prototype.state_idle = function (time) {
    };
    BaseMoveGameObject.prototype.state_move = function (time) {
        var useSpeed = this.speed / (1000 / 60) * time;
        if (this.endX && this.endY) {
            this.radian = App.MathUtils.getRadian2(this.x, this.y, this.endX, this.endY);
            this.speedX = Math.cos(this.radian) * useSpeed;
            this.speedY = Math.sin(this.radian) * useSpeed * 0.65;
            var gotoX = this.x + this.speedX;
            var gotoY = this.y + this.speedY;
            if (gotoX < GameData.MIN_X
                || gotoX > GameData.MAX_X
                || gotoY < GameData.MIN_Y
                || gotoY > GameData.MAX_Y) {
                if (!this.isCommand) {
                    this.stopMove();
                    return;
                }
            }
            var dis = App.MathUtils.getDistance(this.x, this.y, this.endX, this.endY);
            if (dis < Math.abs(this.speedX) + Math.abs(this.speedY)) {
                this.stopMove();
                return;
            }
            this.x = gotoX;
            this.y = gotoY;
        }
        else {
            this.speedX = Math.cos(this.radian) * useSpeed;
            this.speedY = Math.sin(this.radian) * useSpeed * 0.65;
            var gotoX = this.x + this.speedX;
            var gotoY = this.y + this.speedY;
            if (gotoX < GameData.MIN_X || gotoX > GameData.MAX_X) {
                gotoX = this.x;
            }
            if (gotoY < GameData.MIN_Y || gotoY > GameData.MAX_Y) {
                gotoY = this.y;
            }
            this.x = gotoX;
            this.y = gotoY;
        }
    };
    BaseMoveGameObject.prototype.state_attack = function (time) {
        if (this.speedZ) {
            this.state_jump(time);
        }
        else if (this.speed) {
            this.state_move(time);
        }
    };
    BaseMoveGameObject.prototype.state_jump = function (time) {
        if (this.speed) {
            this.state_move(time);
        }
        if (this.speedZ > this.maxSpeedZ) {
            this.speedZ = this.maxSpeedZ;
        }
        else {
            this.speedZ += this.gravitySpeed;
        }
        var gotoZ = this.z + this.speedZ / (1000 / 60) * time;
        if (gotoZ > 0) {
            gotoZ = 0;
            this.stopJump();
        }
        this.z = gotoZ;
    };
    BaseMoveGameObject.prototype.state_land = function (time) {
        if (this.isDie) {
            return;
        }
        this.landTime += time;
        if (this.landTime >= 1500) {
            this.leave();
        }
    };
    BaseMoveGameObject.prototype.state_hurt = function (time) {
        if (this.speedZ || this.z < 0) {
            this.state_jump(time);
        }
        else if (this.speed) {
            this.state_move(time);
        }
    };
    BaseMoveGameObject.prototype.stopJump = function () {
        this.speedZ = 0;
        if (!this.isAttack) {
            this.gotoLand();
        }
        if (this.isDie) {
            egret.Tween.get(this).to({ alpha: 0 }, 2000).call(function () {
                this.disappear();
                this.destory();
            }, this);
        }
    };
    /**
     * ????????????
     */
    BaseMoveGameObject.prototype.disappear = function () {
    };
    BaseMoveGameObject.prototype.stopMove = function () {
        this.speed = 0;
        this.isCommand = false;
        if (!this.isHurt && !this.isAttack && this.z == 0) {
            this.gotoIdle();
        }
    };
    BaseMoveGameObject.prototype.leave = function () {
        this.gotoIdle();
    };
    //????????????????????????
    BaseMoveGameObject.prototype.moveTo = function ($speed, $endX, $endY) {
        this.speed = $speed;
        this.endX = $endX;
        this.endY = $endY;
        this.radian = 0;
    };
    //??????????????????
    BaseMoveGameObject.prototype.walkTo = function ($speed, $endX, $endY) {
        this.moveTo($speed, $endX, $endY);
        this.scaleX = this.endX >= this.x ? 1 : -1;
        this.gotoMove();
    };
    //??????
    BaseMoveGameObject.prototype.walk = function (xFlag, yFlag, $speed) {
        this.speed = $speed;
        this.endX = 0;
        this.endY = 0;
        this.radian = Math.atan2(yFlag, xFlag);
        this.scaleX = xFlag > 0 ? 1 : -1;
        this.gotoMove();
    };
    //?????????????????????
    BaseMoveGameObject.prototype.moveToZ = function ($speedZ) {
        this.speedZ = $speedZ;
    };
    //????????????
    BaseMoveGameObject.prototype.standLand = function () {
        this.speedZ = 0;
        this.z = 0;
    };
    //??????
    BaseMoveGameObject.prototype.jump = function ($speedZ, $speedX) {
        if ($speedX === void 0) { $speedX = 0; }
        this.speed = Math.abs($speedX);
        this.radian = Math.atan2(0, $speedX > 0 ? 1 : -1);
        this.endX = 0;
        this.endY = 0;
        this.speedZ = $speedZ;
        this.gotoJump();
    };
    BaseMoveGameObject.prototype.gotoIdle = function () {
        this.speed = 0;
        this.currState = BaseMoveGameObject.STATE_IDLE;
        this.armature.play(BaseMoveGameObject.ACTION_Idle, 0);
    };
    BaseMoveGameObject.prototype.gotoMove = function () {
        this.currState = BaseMoveGameObject.STATE_MOVE;
        this.armature.play(BaseMoveGameObject.ACTION_Move, 0);
    };
    BaseMoveGameObject.prototype.gotoAttack = function () {
        this.currState = BaseMoveGameObject.STATE_ATTACK;
    };
    BaseMoveGameObject.prototype.gotoJump = function () {
        this.currState = BaseMoveGameObject.STATE_JUMP;
    };
    BaseMoveGameObject.prototype.gotoLand = function () {
        this.landTime = 0;
        this.currState = BaseMoveGameObject.STATE_LAND;
        this.armature.play(BaseMoveGameObject.ACTION_Land, 1);
    };
    BaseMoveGameObject.prototype.gotoHurtState = function () {
        this.currState = BaseMoveGameObject.STATE_HURT;
    };
    BaseMoveGameObject.prototype.gotoHurt = function () {
        this.gotoHurtState();
        this.armature.play(BaseMoveGameObject.ACTION_Hart, 1);
    };
    BaseMoveGameObject.prototype.command_in = function (speed, toX, toY) {
        this.isCommand = true;
        this.walkTo(speed, toX, toY);
    };
    Object.defineProperty(BaseMoveGameObject.prototype, "isInScreen", {
        get: function () {
            return this.x > GameData.MIN_X && this.x < GameData.MAX_X
                && this.y > GameData.MIN_Y && this.y < GameData.MAX_Y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseMoveGameObject.prototype, "isIdle", {
        get: function () {
            return this.currState == BaseMoveGameObject.STATE_IDLE;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseMoveGameObject.prototype, "isAttack", {
        get: function () {
            return this.currState == BaseMoveGameObject.STATE_ATTACK;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseMoveGameObject.prototype, "isMove", {
        get: function () {
            return this.currState == BaseMoveGameObject.STATE_MOVE;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseMoveGameObject.prototype, "isJump", {
        get: function () {
            return this.currState == BaseMoveGameObject.STATE_JUMP;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseMoveGameObject.prototype, "isLand", {
        get: function () {
            return this.currState == BaseMoveGameObject.STATE_LAND;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseMoveGameObject.prototype, "isHurt", {
        get: function () {
            return this.currState == BaseMoveGameObject.STATE_HURT;
        },
        enumerable: true,
        configurable: true
    });
    BaseMoveGameObject.STATE_IDLE = "idle";
    BaseMoveGameObject.STATE_MOVE = "move";
    BaseMoveGameObject.STATE_ATTACK = "attack";
    BaseMoveGameObject.STATE_JUMP = "jump";
    BaseMoveGameObject.STATE_LAND = "land";
    BaseMoveGameObject.STATE_HURT = "hurt";
    return BaseMoveGameObject;
}(BaseGameObject));
__reflect(BaseMoveGameObject.prototype, "BaseMoveGameObject");
/**
 * Created by egret on 15-1-19.
 */
var BaseAIGameObject = (function (_super) {
    __extends(BaseAIGameObject, _super);
    function BaseAIGameObject($controller) {
        var _this = _super.call(this, $controller) || this;
        _this.move_time = 3000;
        _this.attack_time = 3000;
        _this.ai_attack_dis = [100, 0, 30, 30, 0, 0];
        return _this;
    }
    BaseAIGameObject.prototype.init = function () {
        _super.prototype.init.call(this);
        this.move_time = App.RandomUtils.limitInteger(2000, 5000);
        this.attack_time = App.RandomUtils.limitInteger(2000, 4000);
        this.ai_attack_dis = [100, 0, 30, 30, 0, 0];
        this.ai_currTime = 0;
        this.isAi = true;
    };
    BaseAIGameObject.prototype.destory = function () {
        _super.prototype.destory.call(this);
    };
    BaseAIGameObject.prototype.isCanAttack = function () {
        this.attackObj = this.gameController.getMyAttackObjects(this, this.ai_attack_dis)[0];
        return this.attackObj != null;
    };
    BaseAIGameObject.prototype.update = function (time) {
        _super.prototype.update.call(this, time);
        if (!this.isAi)
            return;
        if (this.isCommand)
            return;
        var func = "state_" + this.currAiState;
        if (this.currAiState) {
            this.ai_currTime += time;
            this[func](time);
        }
    };
    BaseAIGameObject.prototype.state_ai_none = function (time) {
    };
    BaseAIGameObject.prototype.state_ai_idle = function (time) {
        if (this.isCanAttack()) {
            if (this.ai_currTime >= this.attack_time) {
                this.gotoAttack();
            }
        }
        else {
            if (this.ai_currTime >= this.move_time) {
                this.aiMove();
            }
        }
    };
    BaseAIGameObject.prototype.state_ai_move = function (time) {
        if (this.isCanAttack()) {
            this.stopMove();
            this.gotoAttack();
        }
    };
    BaseAIGameObject.prototype.state_ai_attack = function (time) {
    };
    BaseAIGameObject.prototype.gotoIdle = function () {
        _super.prototype.gotoIdle.call(this);
        if (!this.isAi)
            return;
        this.gotoAiIdle();
    };
    BaseAIGameObject.prototype.gotoMove = function () {
        _super.prototype.gotoMove.call(this);
        if (!this.isAi)
            return;
        this.gotoAiMove();
    };
    BaseAIGameObject.prototype.gotoAttack = function () {
        _super.prototype.gotoAttack.call(this);
        if (!this.isAi)
            return;
        this.gotoAiAttack();
        if (this.attackObj) {
            this.scaleX = this.attackObj.x >= this.x ? 1 : -1;
        }
    };
    BaseAIGameObject.prototype.gotoHurt = function () {
        _super.prototype.gotoHurt.call(this);
        if (!this.isAi)
            return;
        this.stopAi();
    };
    BaseAIGameObject.prototype.gotoJump = function () {
        _super.prototype.gotoJump.call(this);
        if (!this.isAi)
            return;
        this.stopAi();
    };
    BaseAIGameObject.prototype.gotoLand = function () {
        _super.prototype.gotoLand.call(this);
        if (!this.isAi)
            return;
        this.stopAi();
    };
    BaseAIGameObject.prototype.leave = function () {
        _super.prototype.leave.call(this);
        if (!this.isAi)
            return;
        this.moveRandom();
    };
    BaseAIGameObject.prototype.stopMove = function () {
        _super.prototype.stopMove.call(this);
        this.ai_currTime = this.attack_time;
    };
    BaseAIGameObject.prototype.gotoAiIdle = function () {
        this.ai_currTime = 0;
        this.currAiState = BaseAIGameObject.STATE_AI_IDLE;
    };
    BaseAIGameObject.prototype.gotoAiMove = function () {
        this.ai_currTime = 0;
        this.currAiState = BaseAIGameObject.STATE_AI_MOVE;
    };
    BaseAIGameObject.prototype.gotoAiAttack = function () {
        this.ai_currTime = 0;
        this.currAiState = BaseAIGameObject.STATE_AI_ATTACK;
    };
    BaseAIGameObject.prototype.stopAi = function () {
        this.ai_currTime = 0;
        this.currAiState = BaseAIGameObject.STATE_AI_NONE;
    };
    BaseAIGameObject.prototype.aiMove = function () {
        if (Math.random() > 0.7) {
            this.moveRandom();
        }
        else {
            this.moveToTarget();
        }
    };
    BaseAIGameObject.prototype.moveToTarget = function () {
        var target = this.gameController.getMyNearAttackObjects(this);
        var gotoX;
        var gotoY;
        if (target.isMyFront(this)) {
            gotoX = target.x + this.scaleX * App.RandomUtils.limit(0, this.ai_attack_dis[0]);
        }
        else if (target.isMyBack(this)) {
            gotoX = target.x - this.scaleX * App.RandomUtils.limit(0, this.ai_attack_dis[1]);
        }
        if (target.isMyLeft(this)) {
            gotoY = target.y - this.scaleX * App.RandomUtils.limit(0, this.ai_attack_dis[2]);
        }
        else if (target.isMyRight(this)) {
            gotoY = target.y + this.scaleX * App.RandomUtils.limit(0, this.ai_attack_dis[3]);
        }
        this.walkTo(3, gotoX, gotoY);
    };
    BaseAIGameObject.prototype.moveRandom = function () {
        var gotoX = App.RandomUtils.limit(GameData.MIN_X, GameData.MAX_X);
        var gotoY = App.RandomUtils.limit(GameData.MIN_Y, GameData.MAX_Y);
        this.walkTo(3, gotoX, gotoY);
    };
    BaseAIGameObject.STATE_AI_NONE = "ai_none";
    BaseAIGameObject.STATE_AI_IDLE = "ai_idle";
    BaseAIGameObject.STATE_AI_MOVE = "ai_move";
    BaseAIGameObject.STATE_AI_ATTACK = "ai_attack";
    return BaseAIGameObject;
}(BaseMoveGameObject));
__reflect(BaseAIGameObject.prototype, "BaseAIGameObject");
/**
 * Created by yangsong on 2014/11/22.
 * View??????????????????eui.Component
 */
var BaseEuiView = (function (_super) {
    __extends(BaseEuiView, _super);
    /**
     * ????????????
     * @param $controller ????????????
     * @param $parent ??????
     */
    function BaseEuiView($controller, $parent) {
        var _this = _super.call(this) || this;
        _this._resources = null;
        _this._controller = $controller;
        _this._myParent = $parent;
        _this._isInit = false;
        _this.percentHeight = 100;
        _this.percentWidth = 100;
        return _this;
    }
    Object.defineProperty(BaseEuiView.prototype, "myParent", {
        /**
         * ??????????????????
         * @returns {egret.DisplayObjectContainer}
         */
        get: function () {
            return this._myParent;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * ????????????????????????
     * @param resources
     */
    BaseEuiView.prototype.setResources = function (resources) {
        this._resources = resources;
    };
    /**
     * ?????????????????????
     * @returns {boolean}
     */
    BaseEuiView.prototype.isInit = function () {
        return this._isInit;
    };
    /**
     * ?????????????????????
     * @param key ????????????
     * @param param ??????
     *
     */
    BaseEuiView.prototype.applyFunc = function (key) {
        var param = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            param[_i - 1] = arguments[_i];
        }
        return this._controller.applyFunc.apply(this._controller, arguments);
    };
    /**
     * ????????????????????????
     * @param controllerKey ????????????
     * @param key ????????????
     * @param param ????????????
     *
     */
    BaseEuiView.prototype.applyControllerFunc = function (controllerKey, key) {
        var param = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            param[_i - 2] = arguments[_i];
        }
        return this._controller.applyControllerFunc.apply(this._controller, arguments);
    };
    /**
     * ??????????????????
     * @return
     *
     */
    BaseEuiView.prototype.isShow = function () {
        return this.stage != null && this.visible;
    };
    /**
     * ???????????????
     */
    BaseEuiView.prototype.addToParent = function () {
        this._myParent.addChild(this);
    };
    /**
     * ???????????????
     */
    BaseEuiView.prototype.removeFromParent = function () {
        App.DisplayUtils.removeFromParent(this);
    };
    /**
     *???????????????????????????????????????????????????
     *
     */
    BaseEuiView.prototype.initUI = function () {
        this._isInit = true;
    };
    /**
     *????????????????????????????????????????????????
     *
     */
    BaseEuiView.prototype.initData = function () {
    };
    /**
     * ??????
     */
    BaseEuiView.prototype.destroy = function () {
        this._controller = null;
        this._myParent = null;
        this._resources = null;
    };
    /**
     * ?????????????????????????????????????????????
     * @param param ??????
     */
    BaseEuiView.prototype.open = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
    };
    /**
     * ?????????????????????????????????????????????
     * @param param ??????
     */
    BaseEuiView.prototype.close = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
    };
    /**
     /**
     * ????????????????????????
     */
    BaseEuiView.prototype.loadResource = function (loadComplete, initComplete) {
        if (this._resources && this._resources.length > 0) {
            App.ResourceUtils.loadResource(this._resources, [], loadComplete, null, this);
            this.once(eui.UIEvent.CREATION_COMPLETE, initComplete, this);
        }
        else {
            loadComplete();
            initComplete();
        }
    };
    /**
     * ??????????????????
     * @param value
     */
    BaseEuiView.prototype.setVisible = function (value) {
        this.visible = value;
    };
    return BaseEuiView;
}(eui.Component));
__reflect(BaseEuiView.prototype, "BaseEuiView", ["IBaseView"]);
/**
 * Created by egret on 15-1-27.
 */
var BaseHitGameObject = (function (_super) {
    __extends(BaseHitGameObject, _super);
    function BaseHitGameObject($controller) {
        return _super.call(this, $controller) || this;
    }
    BaseHitGameObject.prototype.onAttack = function () {
        if (this.isAttack) {
            return false;
        }
        if (this.isMove) {
            this.stopMove();
        }
        this.stopAi();
        return true;
    };
    BaseHitGameObject.prototype.loseHp = function () {
        var isBao = Math.random() >= 0.95;
        var txt = ObjectPool.pop("egret.Bitmap");
        txt.alpha = 1;
        if (this.x < 50) {
            txt.x = this.x + App.RandomUtils.limit(0, 100);
        }
        else if (this.x > App.StageUtils.getHeight() - 50) {
            txt.x = this.x - App.RandomUtils.limit(0, 100);
        }
        else {
            txt.x = this.x + (Math.random() > 0.5 ? App.RandomUtils.limit(0, 100) : -App.RandomUtils.limit(0, 100));
        }
        txt.y = this.y + this.z - 100;
        App.AnchorUtils.setAnchorX(txt, 0.5);
        txt.texture = isBao ? RES.getRes("losehp_baoji_png") : RES.getRes("losehp_png");
        egret.Tween.get(txt).to({ y: this.y + this.z - 300 }, 1000, egret.Ease.backOut).to({
            alpha: 0,
            y: this.y + this.z - 400
        }, 300).call(function () {
            App.DisplayUtils.removeFromParent(txt);
            ObjectPool.push(txt);
        }, this);
        LayerManager.Game_Main.addChild(txt);
        if (isBao) {
            this.hp -= 30;
        }
        else {
            this.hp -= 10;
        }
        if (this.hp <= 0) {
            this.die();
        }
    };
    BaseHitGameObject.prototype.die = function () {
        this.isDie = true;
        if (this.z == 0) {
            this.jump(-20, 5);
            this.armature.play(BaseGameObject.ACTION_Fly, 1);
        }
    };
    BaseHitGameObject.prototype.fly = function (attackObj, speedZ, speedX) {
        if (this.onAttack()) {
            var xFlag = this.x > attackObj.x ? 1 : -1;
            this.scaleX = attackObj.isMyFront(this) ? -attackObj.scaleX : attackObj.scaleX;
            this.jump(speedZ, xFlag * speedX);
            this.armature.play(BaseGameObject.ACTION_Fly, 1);
        }
        this.loseHp();
    };
    BaseHitGameObject.prototype.hart = function (attackObj, speed, xMoveDis) {
        if (this.onAttack()) {
            this.scaleX = attackObj.isMyFront(this) ? -attackObj.scaleX : attackObj.scaleX;
            this.moveTo(speed, this.x - (this.scaleX * xMoveDis), this.y);
            this.gotoHurt();
        }
        this.loseHp();
    };
    BaseHitGameObject.prototype.hartFly = function (attackObj, speedZ, attract) {
        if (this.onAttack()) {
            if (attract) {
                this.moveTo(1, attackObj.x, attackObj.y);
                this.moveToZ(speedZ);
            }
            else {
                this.moveToZ(speedZ);
            }
            if (this.z == 0) {
                this.scaleX = attackObj.isMyFront(this) ? -attackObj.scaleX : attackObj.scaleX;
                this.armature.play(BaseGameObject.ACTION_Fly, 1);
                this.gotoHurtState();
            }
        }
        this.loseHp();
    };
    return BaseHitGameObject;
}(BaseAIGameObject));
__reflect(BaseHitGameObject.prototype, "BaseHitGameObject");
/**
 * Created by zmliu on 14-5-11.
 */
var starlingswf;
(function (starlingswf) {
    /**Sprite*/
    var SwfSprite = (function (_super) {
        __extends(SwfSprite, _super);
        function SwfSprite() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SwfSprite.prototype.getTextField = function (name) {
            return this.getChildByName(name);
        };
        SwfSprite.prototype.getMovie = function (name) {
            return this.getChildByName(name);
        };
        SwfSprite.prototype.getSprite = function (name) {
            return this.getChildByName(name);
        };
        SwfSprite.prototype.getImage = function (name) {
            return this.getChildByName(name);
        };
        return SwfSprite;
    }(egret.DisplayObjectContainer));
    starlingswf.SwfSprite = SwfSprite;
    __reflect(SwfSprite.prototype, "starlingswf.SwfSprite");
})(starlingswf || (starlingswf = {}));
/**
 * Created by egret on 15-1-7.
 */
var BasePanelView = (function (_super) {
    __extends(BasePanelView, _super);
    function BasePanelView(controller, parent) {
        var _this = _super.call(this, controller, parent) || this;
        _this.skinName = "resource/skins/PanelSkin.exml";
        return _this;
    }
    Object.defineProperty(BasePanelView.prototype, "icon", {
        get: function () {
            return this._icon;
        },
        set: function (value) {
            this._icon = value;
            if (this.iconDisplay) {
                this.iconDisplay.source = this._icon;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BasePanelView.prototype, "btn", {
        get: function () {
            return this._btn;
        },
        set: function (value) {
            this._btn = value;
            if (this.button) {
                this.button.source = this._btn;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     *???????????????????????????????????????????????????
     *
     */
    BasePanelView.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_END, this.closeBtnClickHandler, this);
    };
    /**
     *????????????????????????????????????????????????
     *
     */
    BasePanelView.prototype.initData = function () {
        _super.prototype.initData.call(this);
        this.iconDisplay.source = this._icon;
        this.button.source = this._btn;
    };
    BasePanelView.prototype.closeBtnClickHandler = function (e) {
        App.ViewManager.closeView(this);
    };
    return BasePanelView;
}(BaseEuiView));
__reflect(BasePanelView.prototype, "BasePanelView");
/**
 * Created by egret on 15-1-27.
 */
var BaseFrameGameObject = (function (_super) {
    __extends(BaseFrameGameObject, _super);
    function BaseFrameGameObject($controller) {
        return _super.call(this, $controller) || this;
    }
    BaseFrameGameObject.prototype.initFrameData = function ($dragonBonesDataName) {
        this.attackConfig = RES.getRes("attack_json")[$dragonBonesDataName];
        if (this.attackConfig) {
            this.armature.addFrameCallFunc(this.armatureEventHandle, this);
        }
    };
    BaseFrameGameObject.prototype.armatureEventHandle = function (e) {
        var frameLabel = e.eventObject.name;
        var actionStr = this.attackConfig[frameLabel].action || "";
        var actions = actionStr.split(",");
        for (var i = 0, len = actions.length; i < len; i++) {
            var arr = actions[i].split("_");
            var funcName = arr[0];
            arr[0] = frameLabel;
            this[funcName].apply(this, arr);
        }
    };
    BaseFrameGameObject.prototype.frameEnemyHart = function (frameLabel, speed, xMoveDis, shock) {
        if (shock === void 0) { shock = "0"; }
        var attDis = this.attackConfig[frameLabel].dis;
        var attackObjs = this.gameController.getMyAttackObjects(this, attDis);
        if (attackObjs.length && shock == "1") {
            this.frameShock();
        }
        for (var i = 0, len = attackObjs.length; i < len; i++) {
            attackObjs[i].hart(this, parseInt(speed), parseInt(xMoveDis));
        }
    };
    BaseFrameGameObject.prototype.frameEnemyFly = function (frameLabel, speedZ, speedX, shock) {
        if (shock === void 0) { shock = "0"; }
        var attDis = this.attackConfig[frameLabel].dis;
        var attackObjs = this.gameController.getMyAttackObjects(this, attDis);
        if (attackObjs.length && shock == "1") {
            this.frameShock();
        }
        for (var i = 0, len = attackObjs.length; i < len; i++) {
            attackObjs[i].fly(this, parseInt(speedZ), parseInt(speedX));
        }
    };
    BaseFrameGameObject.prototype.frameEnemyHartMoveToZ = function (frameLabel, speedZ, attract) {
        if (attract === void 0) { attract = "0"; }
        var attDis = this.attackConfig[frameLabel].dis;
        var attackObjs = this.gameController.getMyAttackObjects(this, attDis);
        for (var i = 0, len = attackObjs.length; i < len; i++) {
            attackObjs[i].hartFly(this, parseInt(speedZ), parseInt(attract) == 1);
        }
    };
    BaseFrameGameObject.prototype.frameThisMoveTo = function (frameLabel, speed, xMoveDis) {
        this.moveTo(parseInt(speed), this.x + (this.scaleX * parseInt(xMoveDis)), this.y);
    };
    BaseFrameGameObject.prototype.frameThisMoveToZ = function (frameLabel, $speedZ) {
        this.moveToZ(parseInt($speedZ));
    };
    BaseFrameGameObject.prototype.frameThisStandLand = function (frameLabel) {
        this.standLand();
    };
    BaseFrameGameObject.prototype.frameShock = function (frameLabel) {
        if (frameLabel === void 0) { frameLabel = null; }
        this.gameController.shock();
    };
    return BaseFrameGameObject;
}(BaseHitGameObject));
__reflect(BaseFrameGameObject.prototype, "BaseFrameGameObject");
/**
 * Created by zmliu on 14-5-11.
 */
var starlingswf;
(function (starlingswf) {
    var SwfMovieClip = (function (_super) {
        __extends(SwfMovieClip, _super);
        function SwfMovieClip(frames, labels, displayObjects, ownerSwf) {
            var _this = _super.call(this) || this;
            _this._isPlay = false;
            _this.loop = true;
            _this._completeFunction = null; //?????????????????????
            _this._frames = frames;
            _this._labels = labels;
            _this._displayObjects = displayObjects;
            _this._startFrame = 0;
            _this._endFrame = _this._frames.length - 1;
            _this._ownerSwf = ownerSwf;
            _this.setCurrentFrame(0);
            _this.play();
            return _this;
        }
        SwfMovieClip.prototype.update = function () {
            if (!this._isPlay)
                return;
            if (this._currentFrame > this._endFrame) {
                if (this.hasCompleteListener()) {
                    this.dispatchEventWith(egret.Event.COMPLETE);
                }
                this._currentFrame = this._startFrame;
                if (!this.loop) {
                    if (this._ownerSwf)
                        this.stop(false);
                    return;
                }
                if (this._startFrame == this._endFrame) {
                    if (this._ownerSwf)
                        this.stop(false);
                    return;
                }
                this.setCurrentFrame(this._startFrame);
            }
            else {
                this.setCurrentFrame(this._currentFrame);
                this._currentFrame += 1;
            }
        };
        SwfMovieClip.prototype.setCurrentFrame = function (frame) {
            //dirty hack this.removeChildren();
            this.$children.length = 0;
            this._currentFrame = frame;
            this.__frameInfos = this._frames[this._currentFrame];
            var data;
            var display;
            var textfield;
            var useIndex;
            var length = this.__frameInfos.length;
            for (var i = 0; i < length; i++) {
                data = this.__frameInfos[i];
                useIndex = data[10];
                display = this._displayObjects[data[0]][useIndex];
                display.skewX = data[6];
                display.skewY = data[7];
                display.alpha = data[8];
                display.name = data[9];
                //                if(data[1] == Swf.dataKey_Particle){
                //                    display["setPostion"](data[2],data[3]);
                //                }else{
                display.x = data[2];
                display.y = data[3];
                //                }
                if (data[1] == starlingswf.Swf.dataKey_Scale9) {
                    display.width = data[11];
                    display.height = data[12];
                }
                else {
                    display.scaleX = data[4];
                    display.scaleY = data[5];
                }
                //dirty hack  this.addChild(display);
                this.$children.push(display);
                display.$parent = this;
                if (data[1] == starlingswf.Swf.dataKey_TextField) {
                    textfield = display;
                    textfield.width = data[11];
                    textfield.height = data[12];
                    //textfield.fontFamily = data[13];
                    textfield.textColor = data[14];
                    textfield.size = data[15];
                    textfield.textAlign = data[16];
                    //                    textfield["italic"] = data[17];
                    //                    textfield["bold"] = data[18];
                    if (data[19] && data[19] != "\r" && data[19] != "") {
                        textfield.text = data[19];
                    }
                }
            }
        };
        SwfMovieClip.prototype.getCurrentFrame = function () {
            return this._currentFrame;
        };
        /**
         * ??????
         * */
        SwfMovieClip.prototype.play = function () {
            this._isPlay = true;
            this._ownerSwf.swfUpdateManager.addSwfAnimation(this);
            var k;
            var arr;
            var l;
            for (k in this._displayObjects) {
                if (k.indexOf(starlingswf.Swf.dataKey_MovieClip) == 0) {
                    arr = this._displayObjects[k];
                    l = arr.length;
                    for (var i = 0; i < l; i++) {
                        arr[i].play();
                    }
                }
            }
        };
        /**
         * ??????
         * @param    stopChild    ?????????????????????
         * */
        SwfMovieClip.prototype.stop = function (stopChild) {
            if (stopChild === void 0) { stopChild = true; }
            this._isPlay = false;
            this._ownerSwf.swfUpdateManager.removeSwfAnimation(this);
            if (!stopChild)
                return;
            var k;
            var arr;
            var l;
            for (k in this._displayObjects) {
                if (k.indexOf(starlingswf.Swf.dataKey_MovieClip) == 0) {
                    arr = this._displayObjects[k];
                    l = arr.length;
                    for (var i = 0; i < l; i++) {
                        arr[i].stop(stopChild);
                    }
                }
            }
        };
        SwfMovieClip.prototype.gotoAndStop = function (frame, stopChild) {
            if (stopChild === void 0) { stopChild = true; }
            this.goTo(frame);
            this.stop(stopChild);
        };
        SwfMovieClip.prototype.gotoAndPlay = function (frame) {
            this.goTo(frame);
            this.play();
        };
        SwfMovieClip.prototype.goTo = function (frame) {
            if (typeof (frame) == "string") {
                var labelData = this.getLabelData(frame);
                this._currentLabel = labelData[0];
                this._currentFrame = this._startFrame = labelData[1];
                this._endFrame = labelData[2];
            }
            else if (typeof (frame) == "number") {
                this._currentFrame = this._startFrame = frame;
                this._endFrame = this._frames.length - 1;
            }
            this.setCurrentFrame(this._currentFrame);
        };
        SwfMovieClip.prototype.getLabelData = function (label) {
            var length = this._labels.length;
            var labelData;
            for (var i = 0; i < length; i++) {
                labelData = this._labels[i];
                if (labelData[0] == label) {
                    return labelData;
                }
            }
            return null;
        };
        /**
         * ???????????????
         * */
        SwfMovieClip.prototype.isPlay = function () {
            return this._isPlay;
        };
        /**
         * ??????????????????
         * */
        SwfMovieClip.prototype.totalFrames = function () {
            return this._frames.length;
        };
        /**
         * ???????????????????????????????????????
         * */
        SwfMovieClip.prototype.currentLabel = function () {
            return this._currentLabel;
        };
        /**
         * ??????????????????
         * */
        SwfMovieClip.prototype.labels = function () {
            var length = this._labels.length;
            var returnLabels = [];
            for (var i = 0; i < length; i++) {
                returnLabels.push(this._labels[i][0]);
            }
            return returnLabels;
        };
        SwfMovieClip.prototype.hasCompleteListener = function () {
            return this.hasEventListener(egret.Event.COMPLETE);
        };
        /**
         * ????????????????????????
         * */
        SwfMovieClip.prototype.hasLabel = function (label) {
            var ls = this.labels();
            return !(ls.indexOf(label) == -1);
        };
        /*****************************************?????????????????????*****************************************/
        /**
         * ??????????????????????????????
         * @param label ?????????
         * @returns {any}
         */
        SwfMovieClip.prototype.getLabelStartFrame = function (label) {
            return this.getLabelData(label)[1];
        };
        /**
         * ??????????????????????????????
         * @param label
         * @returns {any}
         */
        SwfMovieClip.prototype.getLabelEndFrame = function (label) {
            return this.getLabelData(label)[2];
        };
        return SwfMovieClip;
    }(starlingswf.SwfSprite));
    starlingswf.SwfMovieClip = SwfMovieClip;
    __reflect(SwfMovieClip.prototype, "starlingswf.SwfMovieClip", ["starlingswf.ISwfAnimation"]);
})(starlingswf || (starlingswf = {}));
/**
 * Created by yangsong on 15-1-7.
 */
var BaseSpriteLayer = (function (_super) {
    __extends(BaseSpriteLayer, _super);
    function BaseSpriteLayer() {
        var _this = _super.call(this) || this;
        _this.touchEnabled = false;
        return _this;
    }
    return BaseSpriteLayer;
}(egret.DisplayObjectContainer));
__reflect(BaseSpriteLayer.prototype, "BaseSpriteLayer");
/**
 * Created by yangsong on 15-1-14.
 * Sound??????
 */
var BaseSound = (function () {
    /**
     * ????????????
     */
    function BaseSound() {
        this._cache = {};
        this._loadingCache = new Array();
        App.TimerManager.doTimer(1 * 60 * 1000, 0, this.dealSoundTimer, this);
    }
    /**
     * ???????????????????????????
     */
    BaseSound.prototype.dealSoundTimer = function () {
        var currTime = egret.getTimer();
        var keys = Object.keys(this._cache);
        for (var i = 0, len = keys.length; i < len; i++) {
            var key = keys[i];
            if (!this.checkCanClear(key))
                continue;
            if (currTime - this._cache[key] >= SoundManager.CLEAR_TIME) {
                //Log.debug(key + "???clear")
                delete this._cache[key];
                RES.destroyRes(key);
            }
        }
    };
    /**
     * ??????Sound
     * @param key
     * @returns {egret.Sound}
     */
    BaseSound.prototype.getSound = function (key) {
        var sound = RES.getRes(key);
        if (sound) {
            if (this._cache[key]) {
                this._cache[key] = egret.getTimer();
            }
        }
        else {
            if (this._loadingCache.indexOf(key) != -1) {
                return null;
            }
            this._loadingCache.push(key);
            RES.getResAsync(key, this.onResourceLoadComplete, this);
        }
        return sound;
    };
    /**
     * ??????????????????
     * @param event
     */
    BaseSound.prototype.onResourceLoadComplete = function (data, key) {
        var index = this._loadingCache.indexOf(key);
        if (index != -1) {
            this._loadingCache.splice(index, 1);
            this._cache[key] = egret.getTimer();
            this.loadedPlay(key);
        }
    };
    /**
     * ????????????????????????????????????????????????
     * @param key
     */
    BaseSound.prototype.loadedPlay = function (key) {
    };
    /**
     * ????????????????????????????????????????????????
     * @param key
     * @returns {boolean}
     */
    BaseSound.prototype.checkCanClear = function (key) {
        return true;
    };
    return BaseSound;
}());
__reflect(BaseSound.prototype, "BaseSound");
/**
 * Created by yangsong on 14/12/18.
 * ??????
 */
var SingtonClass = (function () {
    function SingtonClass() {
    }
    /**
     * ??????????????????
     * @returns {any}
     */
    SingtonClass.getSingtonInstance = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        var Class = this;
        if (!Class._instance) {
            Class._instance = new (Class.bind.apply(Class, [void 0].concat(param)))();
        }
        return Class._instance;
    };
    return SingtonClass;
}());
__reflect(SingtonClass.prototype, "SingtonClass");
/**
 * Created by yangsong on 2014/11/22.
 * Controller??????
 */
var BaseController = (function () {
    /**
     * ????????????
     */
    function BaseController() {
        this._messages = {};
    }
    /**
     * ?????????????????????
     * @param key ????????????
     * @param callbackFunc ????????????
     * @param callbackObj ????????????????????????
     */
    BaseController.prototype.registerFunc = function (key, callbackFunc, callbackObj) {
        this._messages[key] = [callbackFunc, callbackObj];
    };
    /**
     * ?????????????????????
     * @param key ????????????
     * @param param ????????????
     *
     */
    BaseController.prototype.applyFunc = function (key) {
        var param = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            param[_i - 1] = arguments[_i];
        }
        var listen = this._messages[key];
        if (listen) {
            return listen[0].apply(listen[1], param);
        }
        else {
            Log.warn("??????" + key + "???????????????");
            return null;
        }
    };
    /**
     * ????????????????????????
     * @param controllerKey ????????????
     * @param key ????????????
     * @param param ????????????
     *
     */
    BaseController.prototype.applyControllerFunc = function (controllerKey, key) {
        var param = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            param[_i - 2] = arguments[_i];
        }
        return App.ControllerManager.applyFunc.apply(App.ControllerManager, arguments);
    };
    /**
     * ????????????????????????Model??????
     * @param model
     */
    BaseController.prototype.setModel = function (model) {
        this._model = model;
    };
    /**
     * ??????????????????Model??????
     * @returns {BaseModel}
     */
    BaseController.prototype.getModel = function () {
        return this._model;
    };
    /**
     * ????????????Controller???Model??????
     * @param controllerD Controller????????????
     * @returns {BaseModel}
     */
    BaseController.prototype.getControllerModel = function (controllerD) {
        return App.ControllerManager.getControllerModel(controllerD);
    };
    /**
     * View??????
     * @param viewClassZ View??????
     * @param viewId View???ID
     * @param viewParent View?????????
     * @returns {IBaseView}
     */
    BaseController.prototype.registerView = function (viewClass, viewId, viewParent) {
        var view = new viewClass(this, viewParent);
        App.ViewManager.register(viewId, view);
        return view;
    };
    /**
     * View??????
     * @param viewId View???ID
     * @param param ??????
     */
    BaseController.prototype.openView = function (viewId) {
        var param = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            param[_i - 1] = arguments[_i];
        }
        (_a = App.ViewManager).open.apply(_a, [viewId].concat(param));
        var _a;
    };
    /**
     * View??????
     * @param viewId View???ID
     * @param param ??????
     */
    BaseController.prototype.closeView = function (viewId) {
        var param = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            param[_i - 1] = arguments[_i];
        }
        (_a = App.ViewManager).close.apply(_a, [viewId].concat(param));
        var _a;
    };
    return BaseController;
}());
__reflect(BaseController.prototype, "BaseController");
/**
 * Created by yangsong on 15-11-20.
 * Model??????
 */
var BaseModel = (function () {
    /**
     * ????????????
     * @param $controller ????????????
     */
    function BaseModel($controller) {
        this._controller = $controller;
        this._controller.setModel(this);
    }
    return BaseModel;
}());
__reflect(BaseModel.prototype, "BaseModel");
/**
 * Created by yangsong on 2014/11/22.
 * Proxy??????
 */
var BaseProxy = (function () {
    /**
     * ????????????
     * @param $controller ????????????
     */
    function BaseProxy($controller) {
        this._controller = $controller;
    }
    /**
     * ?????????????????????
     * @param key ????????????
     * @param param ??????
     *
     */
    BaseProxy.prototype.applyFunc = function (key) {
        var param = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            param[_i - 1] = arguments[_i];
        }
        return this._controller.applyFunc.apply(this._controller, arguments);
    };
    /**
     * ????????????????????????
     * @param controllerKey ????????????
     * @param key ????????????
     * @param param ????????????
     *
     */
    BaseProxy.prototype.applyControllerFunc = function (controllerKey, key) {
        var param = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            param[_i - 2] = arguments[_i];
        }
        return this._controller.applyControllerFunc.apply(this._controller, arguments);
    };
    /**
     * ???????????????????????????????????????
     * @param key ????????????
     * @param callbackFunc ????????????
     * @param callbackObj ????????????????????????
     */
    BaseProxy.prototype.receiveServerMsg = function (key, callbackFunc, callbackObj) {
        App.MessageCenter.addListener(key, callbackFunc, callbackObj);
    };
    /**
     * ???????????????????????????????????????????????????????????????????????????
     * @param key ????????????
     * @param callbackFunc ????????????
     * @param callbackObj ????????????????????????
     */
    BaseProxy.prototype.receiveServerMsgOnce = function (key, callbackFunc, callbackObj) {
        var callback = function (param) {
            this.removeServerMsg(key, callback, this);
            callbackFunc.apply(callbackObj, param);
        };
        this.receiveServerMsg(key, callback, this);
    };
    /**
     * ?????????Http??????????????????Update??????
     * @param key ????????????
     * @param callbackFunc ????????????
     * @param callbackObj ????????????????????????
     */
    BaseProxy.prototype.receiveServerHttpUpdateMsg = function (key, callbackFunc, callbackObj) {
        this.receiveServerMsg(key + "_HttpUpdate", callbackFunc, callbackObj);
    };
    /**
     * ?????????Http??????????????????Update??????????????????????????????????????????
     * @param key ????????????
     * @param callbackFunc ????????????
     * @param callbackObj ????????????????????????
     */
    BaseProxy.prototype.receiveServerHttpUpdateMsgOnce = function (key, callbackFunc, callbackObj) {
        this.receiveServerMsgOnce(key + "_HttpUpdate", callbackFunc, callbackObj);
    };
    /**
     * ????????????????????????????????????
     * @param key ????????????
     * @param callbackFunc ????????????
     * @param callbackObj ????????????????????????
     */
    BaseProxy.prototype.removeServerMsg = function (key, callbackFunc, callbackObj) {
        App.MessageCenter.removeListener(key, callbackFunc, callbackObj);
    };
    /**
     * ?????????Http??????????????????Update??????
     * @param key ????????????
     * @param callbackFunc ????????????
     * @param callbackObj ????????????????????????
     */
    BaseProxy.prototype.removeServerHttpUpdateMsg = function (key, callbackFunc, callbackObj) {
        this.removeServerMsg(key + "_HttpUpdate", callbackFunc, callbackObj);
    };
    /**
     * ???????????????Socket?????????
     */
    BaseProxy.prototype.sendSocketMsg = function (msg) {
        // App.Socket.send(msg);
    };
    /**
     * ???????????????Http?????????
     * @param type ???????????? ??????: User.login
     * @param paramObj ???????????? ??????: var paramObj:any = {"uName":uName, "uPass":uPass};
     */
    BaseProxy.prototype.sendHttpMsg = function (type, paramObj) {
        if (paramObj === void 0) { paramObj = null; }
        App.Http.send(type, this.getURLVariables(type, paramObj));
    };
    /**
     * ??????????????????URLVariables
     * @param t_type
     * @param t_paramObj
     * @returns {egret.URLVariables}
     */
    BaseProxy.prototype.getURLVariables = function (t_type, t_paramObj) {
        var typeArr = t_type.split(".");
        var paramObj = {};
        paramObj["mod"] = typeArr[0];
        paramObj["do"] = typeArr[1];
        if (t_paramObj != null) {
            paramObj["p"] = t_paramObj;
        }
        var param = JSON.stringify(paramObj);
        var variables = new egret.URLVariables("data=" + param + "&h=" + App.ProxyUserFlag);
        return variables;
    };
    return BaseProxy;
}());
__reflect(BaseProxy.prototype, "BaseProxy");
/**
 * Created by egret on 15-1-7.
 */
var BaseTaskView = (function (_super) {
    __extends(BaseTaskView, _super);
    function BaseTaskView(controller, parent) {
        var _this = _super.call(this, controller, parent) || this;
        _this.dataProvider = new eui.ArrayCollection();
        return _this;
    }
    /**
     *???????????????????????????????????????????????????
     *
     */
    BaseTaskView.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        //??????
        var layout = new eui.VerticalLayout();
        layout.horizontalAlign = "center";
        //??????????????????
        this.taskList = new eui.List();
        this.taskList.itemRenderer = TaskItemRenderer;
        this.taskList.itemRendererSkinName = "resource/skins/TaskItemRendererSkin.exml";
        this.taskList.dataProvider = this.dataProvider;
        this.taskList.layout = layout;
        //???????????? Scroller
        this.scroller = new eui.Scroller();
        this.scroller.percentWidth = this.scroller.percentHeight = 100;
        this.scroller.top = 5;
        this.scroller.viewport = this.taskList;
        this.contentGroup.addChild(this.scroller);
    };
    /**
     *????????????????????????????????????????????????
     *
     */
    BaseTaskView.prototype.initData = function () {
        _super.prototype.initData.call(this);
    };
    return BaseTaskView;
}(BasePanelView));
__reflect(BaseTaskView.prototype, "BaseTaskView");
/**
 * Created by yangsong on 2014/11/22.
 * View??????????????????egret.Sprite
 */
var BaseSpriteView = (function (_super) {
    __extends(BaseSpriteView, _super);
    /**
     * ????????????
     * @param $controller ????????????
     * @param $parent ??????
     */
    function BaseSpriteView($controller, $parent) {
        var _this = _super.call(this) || this;
        _this._resources = null;
        _this._controller = $controller;
        _this._myParent = $parent;
        _this._isInit = false;
        App.StageUtils.getStage().addEventListener(egret.Event.RESIZE, _this.onResize, _this);
        return _this;
    }
    /**
     * ????????????????????????
     * @param resources
     */
    BaseSpriteView.prototype.setResources = function (resources) {
        this._resources = resources;
    };
    Object.defineProperty(BaseSpriteView.prototype, "myParent", {
        /**
         * ??????????????????
         * @returns {egret.DisplayObjectContainer}
         */
        get: function () {
            return this._myParent;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * ?????????????????????
     * @returns {boolean}
     */
    BaseSpriteView.prototype.isInit = function () {
        return this._isInit;
    };
    /**
     * ?????????????????????
     * @param key ????????????
     * @param param ??????
     *
     */
    BaseSpriteView.prototype.applyFunc = function (key) {
        var param = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            param[_i - 1] = arguments[_i];
        }
        return this._controller.applyFunc.apply(this._controller, arguments);
    };
    /**
     * ????????????????????????
     * @param controllerKey ????????????
     * @param key ????????????
     * @param param ????????????
     *
     */
    BaseSpriteView.prototype.applyControllerFunc = function (controllerKey, key) {
        var param = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            param[_i - 2] = arguments[_i];
        }
        return this._controller.applyControllerFunc.apply(this._controller, arguments);
    };
    /**
     * ??????????????????
     * @return
     *
     */
    BaseSpriteView.prototype.isShow = function () {
        return this.stage != null && this.visible;
    };
    /**
     * ???????????????
     */
    BaseSpriteView.prototype.addToParent = function () {
        this._myParent.addChild(this);
    };
    /**
     * ???????????????
     */
    BaseSpriteView.prototype.removeFromParent = function () {
        App.DisplayUtils.removeFromParent(this);
    };
    /**
     *???????????????????????????????????????????????????
     *
     */
    BaseSpriteView.prototype.initUI = function () {
        this._isInit = true;
    };
    /**
     *????????????????????????????????????????????????
     *
     */
    BaseSpriteView.prototype.initData = function () {
    };
    /**
     * ?????????????????????????????????????????????
     * @param param ??????
     */
    BaseSpriteView.prototype.open = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
    };
    /**
     * ?????????????????????????????????????????????
     * @param param ??????
     */
    BaseSpriteView.prototype.close = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
    };
    /**
     * ??????
     */
    BaseSpriteView.prototype.destroy = function () {
        this._controller = null;
        this._myParent = null;
        this._resources = null;
    };
    /**
     * ???????????????????????????
     */
    BaseSpriteView.prototype.onResize = function () {
    };
    /**
     * ????????????????????????
     * @param loadComplete
     * @param initComplete
     */
    BaseSpriteView.prototype.loadResource = function (loadComplete, initComplete) {
        if (this._resources && this._resources.length > 0) {
            App.ResourceUtils.loadResource(this._resources, [], function () {
                loadComplete();
                initComplete();
            }, null, this);
        }
        else {
            loadComplete();
            initComplete();
        }
    };
    /**
     * ??????????????????
     * @param value
     */
    BaseSpriteView.prototype.setVisible = function (value) {
        this.visible = value;
    };
    return BaseSpriteView;
}(egret.DisplayObjectContainer));
__reflect(BaseSpriteView.prototype, "BaseSpriteView", ["IBaseView"]);
/**
 * Created by yangsong on 15-1-7.
 */
var BaseEuiLayer = (function (_super) {
    __extends(BaseEuiLayer, _super);
    function BaseEuiLayer() {
        var _this = _super.call(this) || this;
        _this.percentWidth = 100;
        _this.percentHeight = 100;
        _this.touchEnabled = false;
        return _this;
    }
    return BaseEuiLayer;
}(eui.UILayer));
__reflect(BaseEuiLayer.prototype, "BaseEuiLayer");
/**
 * Created by yangsong on 15-1-7.
 * Scene??????
 */
var BaseScene = (function () {
    /**
     * ????????????
     */
    function BaseScene() {
        this._layers = new Array();
    }
    /**
     * ??????Scene??????
     */
    BaseScene.prototype.onEnter = function () {
    };
    /**
     * ??????Scene??????
     */
    BaseScene.prototype.onExit = function () {
        App.ViewManager.closeAll();
        this.removeAllLayer();
    };
    /**
     * ????????????Layer?????????
     * @param layer
     */
    BaseScene.prototype.addLayer = function (layer) {
        App.StageUtils.getStage().addChild(layer);
        this._layers.push(layer);
    };
    /**
     * ????????????Layer?????????
     * @param layer
     */
    BaseScene.prototype.addLayerAt = function (layer, index) {
        App.StageUtils.getStage().addChildAt(layer, index);
        this._layers.push(layer);
    };
    /**
     * ?????????????????????Layer
     * @param layer
     */
    BaseScene.prototype.removeLayer = function (layer) {
        App.StageUtils.getStage().removeChild(layer);
        this._layers.splice(this._layers.indexOf(layer), 1);
    };
    /**
     * Layer???????????????
     * @param layer
     */
    BaseScene.prototype.layerRemoveAllChild = function (layer) {
        layer.removeChildren();
    };
    /**
     * ????????????Layer
     */
    BaseScene.prototype.removeAllLayer = function () {
        while (this._layers.length) {
            var layer = this._layers[0];
            this.layerRemoveAllChild(layer);
            this.removeLayer(layer);
        }
    };
    return BaseScene;
}());
__reflect(BaseScene.prototype, "BaseScene");
/**
 * Created by yangsong on 15-1-16.
 */
var Enemy = (function (_super) {
    __extends(Enemy, _super);
    function Enemy($controller) {
        var _this = _super.call(this, $controller) || this;
        _this.createArmature();
        return _this;
    }
    Enemy.prototype.createArmature = function () {
        this.armature.register(App.DragonBonesFactory.makeArmature("guaiwu001", "guaiwu001", 1.2), [
            BaseGameObject.ACTION_Idle,
            BaseGameObject.ACTION_Move,
            BaseGameObject.ACTION_Hart,
            BaseGameObject.ACTION_Fly,
            BaseGameObject.ACTION_Land,
            BaseGameObject.ACTION_jump,
            Enemy.ACTION_Attack
        ]);
        this.armature.addCompleteCallFunc(this.armaturePlayEnd, this);
        this.initFrameData("guaiwu001");
    };
    Enemy.prototype.init = function () {
        _super.prototype.init.call(this);
        this.gotoIdle();
    };
    /**
     * ????????????
     */
    Enemy.prototype.disappear = function () {
        _super.prototype.disappear.call(this);
        this.controller.applyFunc(GameConst.Remove_Enemy, this);
    };
    Enemy.prototype.armaturePlayEnd = function (e, animationName) {
        if (animationName == Enemy.ACTION_Attack) {
            this.gotoIdle();
        }
        else if (animationName == Enemy.ACTION_Hart) {
            this.gotoIdle();
        }
        else if (animationName == Enemy.ACTION_Fly) {
            this.armature.stop();
        }
        else if (animationName == Enemy.ACTION_Land) {
            this.armature.stop();
        }
    };
    Enemy.prototype.gotoAttack = function () {
        _super.prototype.gotoAttack.call(this);
        this.playAttackArmature();
    };
    Enemy.prototype.playAttackArmature = function () {
        this.armature.play(Enemy.ACTION_Attack, 1);
        App.SoundManager.playEffect("sound_enemyAttack");
    };
    Enemy.prototype.gotoLand = function () {
        _super.prototype.gotoLand.call(this);
        if (this.isDie)
            return;
        App.SoundManager.playEffect("sound_enenyLand");
        this.gameController.shock();
    };
    Enemy.prototype.fly = function (attackObj, speedZ, speedX) {
        _super.prototype.fly.call(this, attackObj, speedZ, speedX);
        App.SoundManager.playEffect("sound_beiji");
    };
    Enemy.prototype.hart = function (attackObj, speed, xMoveDis) {
        _super.prototype.hart.call(this, attackObj, speed, xMoveDis);
        App.SoundManager.playEffect("sound_beiji");
    };
    Enemy.prototype.hartFly = function (attackObj, speedZ, attract) {
        _super.prototype.hartFly.call(this, attackObj, speedZ, attract);
        App.SoundManager.playEffect("sound_beiji");
    };
    Enemy.ACTION_Attack = "gongji";
    Enemy.ACTION_Skill1 = "jineng";
    Enemy.ACTION_Skill2 = "jineng2";
    return Enemy;
}(BaseFrameGameObject));
__reflect(Enemy.prototype, "Enemy");
/**
 * Created by yangsong on 2017/10/11.
 */
var Component = (function () {
    function Component() {
    }
    Component.prototype.start = function () {
        this.dealTime = 0;
        this.dealInterval = 0;
        this.isRuning = true;
    };
    Component.prototype.stop = function () {
        this.dealTime = null;
        this.dealInterval = null;
        this.entity = null;
        this.isRuning = false;
        this.type = null;
    };
    Component.prototype.update = function (advancedTime) {
    };
    return Component;
}());
__reflect(Component.prototype, "Component");
/**
 * Created by yangsong on 2017/10/11.
 */
var RpgGameObject = (function () {
    function RpgGameObject() {
        this.killNum = 0; //?????????
        this.buffNum = 0; //buff????????????
        this.outTime = 0; //????????????
        this.delayTime = 1000;
        this._components = {};
    }
    RpgGameObject.prototype.init = function (data) {
        this.isPlayer = data.isPlayer;
        this.id = data.id;
        this.col = data.col;
        this.row = data.row;
        this.gameView = data.gameView;
        this.mcPath = data.mcPath;
        this.mcName = data.mcName;
        this.skillPath = data.skillPath;
        this.speed = data.speed || RpgGameData.WalkSpeed;
        this.dir = data.dir || Dir.Bottom;
        this.propertyData = data.propertyData;
        this.battleobjArray = [];
        var p = RpgGameUtils.convertCellToXY(this.col, this.row);
        this.x = p.x;
        this.y = p.y;
        this.action = Action.Stand;
        this.isAttacking = false;
        this.maxBlood = this.propertyData.hp;
        this.oldBlood = this.propertyData.hp;
        this.timer = new egret.Timer(this.delayTime);
        this.timer.addEventListener(egret.TimerEvent.TIMER, this.updateTimer, this);
        this.timer.start();
    };
    RpgGameObject.prototype.updateTimer = function () {
        this.recoverHp();
    };
    RpgGameObject.prototype.recoverHp = function () {
        if (this.propertyData.hp >= this.maxBlood) {
            this.outTime = 0;
            return;
        }
        if (this.propertyData.hp <= 0) {
            this.stopTimer();
            return;
        }
        if (this.isAttacking || this.isUsingSkill || this.action == Action.Attack || this.action == Action.Attacked) {
            this.outTime = 0;
            this.oldBlood = this.propertyData.hp;
            return;
        }
        if (this.outTime == 0) {
            this.oldBlood = this.propertyData.hp;
        }
        else if (this.outTime == 3 * this.delayTime) {
            if (this.oldBlood < this.propertyData.hp) {
                this.outTime = 0;
                this.oldBlood = this.propertyData.hp;
                return;
            }
        }
        else if (this.outTime > 3 * this.delayTime) {
            if (this.propertyData.hp < this.maxBlood) {
                var recover = Math.floor(this.maxBlood * 0.07);
                if (this.propertyData.hp + recover > this.maxBlood) {
                    recover = Math.floor(this.maxBlood - this.propertyData.hp);
                }
                this.propertyData.hp += recover;
                this.gameView.showHpChange(this, recover, 0x00FF00);
            }
        }
        this.outTime += this.delayTime;
    };
    RpgGameObject.prototype.resetTimer = function () {
        this.outTime = 0;
    };
    RpgGameObject.prototype.stopTimer = function () {
        this.timer.stop();
        this.outTime = 0;
        this.maxBlood = 0;
        this.oldBlood = 0;
    };
    RpgGameObject.prototype.destory = function () {
        this.stopTimer();
        var componentNames = Object.keys(this._components);
        while (componentNames.length) {
            var componentName = componentNames[0];
            this.removeComponent(componentName);
            componentNames = Object.keys(this._components);
        }
        this._path = null;
        this.gameView = null;
        this.battleObj = null;
        //this.propertyData = null;
    };
    RpgGameObject.prototype.addComponent = function (componentName) {
        if (this._components[componentName]) {
            return;
        }
        var component = ObjectPool.pop(componentName);
        component.type = componentName;
        component.entity = this;
        component.start();
        ComponentSystem.addComponent(component);
        this._components[componentName] = component;
    };
    RpgGameObject.prototype.removeComponent = function (componentName) {
        var component = this._components[componentName];
        if (!component) {
            return;
        }
        ComponentSystem.removeComponent(component);
        component.stop();
        ObjectPool.push(component);
        this._components[componentName] = null;
        delete this._components[componentName];
    };
    RpgGameObject.prototype.getComponent = function (componentName) {
        var hasComponent = this._components[componentName];
        return hasComponent;
    };
    Object.defineProperty(RpgGameObject.prototype, "path", {
        get: function () {
            return this._path;
        },
        set: function (value) {
            this._path = value;
            this.pathChange = true;
            if (this._path) {
                this.action = Action.Move;
            }
            else {
                if (!this.isAttacking)
                    this.action = Action.Stand;
            }
        },
        enumerable: true,
        configurable: true
    });
    RpgGameObject.prototype.setInCamera = function (value) {
        this._inCamera = value;
    };
    RpgGameObject.prototype.getInCamera = function () {
        return this._inCamera;
    };
    RpgGameObject.prototype.useAngerSkill = function () {
    };
    RpgGameObject.prototype.useCDSkill = function () {
    };
    return RpgGameObject;
}());
__reflect(RpgGameObject.prototype, "RpgGameObject");
/**
 * Created by egret on 15-1-19.
 */
var GameUIView = (function (_super) {
    __extends(GameUIView, _super);
    function GameUIView($controller, $parent) {
        return _super.call(this, $controller, $parent) || this;
    }
    /**
     *???????????????????????????????????????????????????
     *
     */
    GameUIView.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        //????????????
        this.addChild(this.createImageButton("ui_btnAttack_png", "ui_btnAttack1_png", App.StageUtils.getWidth() - 55, App.StageUtils.getHeight() - 53, this.heroAttack));
        //??????1??????
        this.addChild(this.createImageButton("ui_btnSkill1_png", "ui_btnSkill1_1_png", App.StageUtils.getWidth() - 120, App.StageUtils.getHeight() - 140, this.heroSkill1));
        //??????2??????
        this.addChild(this.createImageButton("ui_btnSkill2_png", "ui_btnSkill2_1_png", App.StageUtils.getWidth() - 40, App.StageUtils.getHeight() - 160, this.heroSkill2));
        //??????3??????
        this.addChild(this.createImageButton("ui_btnSkill3_png", "ui_btnSkill3_1_png", App.StageUtils.getWidth() - 180, App.StageUtils.getHeight() - 40, this.heroSkill3));
        //??????4??????
        this.addChild(this.createImageButton("ui_btnSkill4_png", "ui_btnSkill4_1_png", App.StageUtils.getWidth() - 200, App.StageUtils.getHeight() - 120, this.heroSkill4));
        //??????
        var moveFlagX = 150;
        var moveFlagY = App.StageUtils.getHeight() - 150;
        var moveBg = App.DisplayUtils.createBitmap("ui_moveBg_png");
        App.AnchorUtils.setAnchor(moveBg, 0.5);
        moveBg.x = moveFlagX;
        moveBg.y = moveFlagY;
        this.addChild(moveBg);
        var moveFlag = App.DisplayUtils.createBitmap("ui_move_png");
        App.AnchorUtils.setAnchor(moveFlag, 0.5);
        moveFlag.x = moveFlagX;
        moveFlag.y = moveFlagY;
        this.addChild(moveFlag);
        //????????????
        App.RockerUtils.init(moveBg, moveFlag, this.dealKey, this);
        //????????????
        App.KeyboardUtils.addKeyUp(this.onKeyUp, this);
    };
    /**
     *???????????????????????????????????????????????????
     *
     */
    GameUIView.prototype.initData = function () {
        _super.prototype.initData.call(this);
        this.hero = this.applyFunc(GameConst.Get_Hero);
    };
    GameUIView.prototype.dealKey = function (xFlag, yFlag) {
        if (this.hero.isAttack) {
            return false;
        }
        if (this.hero.isJump) {
            return false;
        }
        if (this.hero.isHurt) {
            return false;
        }
        if (this.hero.isLand) {
            return false;
        }
        if (xFlag || yFlag) {
            this.hero.walk(xFlag, yFlag, 7);
            return true;
        }
        else {
            if (this.hero.isMove) {
                this.hero.stopMove();
            }
        }
        return false;
    };
    GameUIView.prototype.onKeyUp = function (keyCode) {
        switch (keyCode) {
            case Keyboard.J:
                this.heroAttack();
                break;
            case Keyboard.K:
                break;
            case Keyboard.U:
                this.heroSkill1();
                break;
            case Keyboard.I:
                this.heroSkill2();
                break;
            case Keyboard.O:
                this.heroSkill3();
                break;
            case Keyboard.P:
                this.heroSkill4();
                break;
            default:
                break;
        }
    };
    GameUIView.prototype.heroAttack = function () {
        if (this.hero.isAttack) {
            this.hero.addMaxAttackIndex();
            return;
        }
        this.hero.attack();
    };
    GameUIView.prototype.heroSkill1 = function () {
        this.hero.skill(1);
    };
    GameUIView.prototype.heroSkill2 = function () {
        this.hero.skill(2);
    };
    GameUIView.prototype.heroSkill3 = function () {
        this.hero.skill(3);
    };
    GameUIView.prototype.heroSkill4 = function () {
        this.hero.skill(4);
    };
    GameUIView.prototype.createImageButton = function (imgName1, imgName2, $x, $y, callBack) {
        var bitmap = App.DisplayUtils.createBitmap(imgName1);
        bitmap.touchEnabled = true;
        App.AnchorUtils.setAnchor(bitmap, 0.5);
        bitmap.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function () {
            bitmap.texture = RES.getRes(imgName2);
        }, this);
        bitmap.addEventListener(egret.TouchEvent.TOUCH_END, function () {
            bitmap.texture = RES.getRes(imgName1);
        }, this);
        bitmap.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            callBack.call(this);
        }, this);
        bitmap.x = $x;
        bitmap.y = $y;
        return bitmap;
    };
    return GameUIView;
}(BaseSpriteView));
__reflect(GameUIView.prototype, "GameUIView");
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var AssetAdapter = (function () {
    function AssetAdapter() {
    }
    /**
     * @language zh_CN
     * ????????????
     * @param source ??????????????????????????????
     * @param compFunc ????????????????????????????????????callBack(content:any,source:string):void;
     * @param thisObject callBack??? this ??????
     */
    AssetAdapter.prototype.getAsset = function (source, compFunc, thisObject) {
        function onGetRes(data) {
            compFunc.call(thisObject, data, source);
        }
        if (RES.hasRes(source)) {
            var data = RES.getRes(source);
            if (data) {
                onGetRes(data);
            }
            else {
                RES.getResAsync(source, onGetRes, this);
            }
        }
        else {
            RES.getResByUrl(source, onGetRes, this, RES.ResourceItem.TYPE_IMAGE);
        }
    };
    return AssetAdapter;
}());
__reflect(AssetAdapter.prototype, "AssetAdapter", ["eui.IAssetAdapter"]);
// /**
//  * Created by yangsong on 15-11-4.
//  * ????????????json????????????
//  */
// class MergeJsonAnalyzer extends RES.JsonAnalyzer {
//     //?????????????????????????????????json??????
//     private mergeJsons:Array<string> = ["MergeConfig_json"];
//     /**
//      * ????????????????????????????????????
//      */
//     public analyzeData(resItem:RES.ResourceItem, data:any):void {
//         var name:string = resItem.name;
//         if (this.fileDic[name] || !data) {
//             return;
//         }
//         try {
//             var jsonData:any = JSON.parse(<string> data);
//             if (this.mergeJsons.indexOf(name) != -1) {
//                 for (var key in jsonData) {
//                     this.fileDic[key] = jsonData[key];
//                 }
//             }
//             else {
//                 this.fileDic[name] = jsonData;
//             }
//         }
//         catch (e) {
//             egret.$warn(1017, resItem.url, data);
//         }
//     }
// } 
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var ThemeAdapter = (function () {
    function ThemeAdapter() {
    }
    /**
     * ????????????
     * @param url ??????????????????url
     * @param onSuccess ????????????????????????????????????compFunc(e:egret.Event):void;
     * @param onError ????????????????????????????????????errorFunc():void;
     * @param thisObject ?????????this??????
     */
    ThemeAdapter.prototype.getTheme = function (url, onSuccess, onError, thisObject) {
        var _this = this;
        function onResGet(e) {
            onSuccess.call(thisObject, e);
        }
        function onResError(e) {
            if (e.resItem.url == url) {
                RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, onResError, null);
                onError.call(thisObject);
            }
        }
        if (typeof generateEUI !== 'undefined') {
            egret.callLater(function () {
                onSuccess.call(thisObject, generateEUI);
            }, this);
        }
        else if (typeof generateEUI2 !== 'undefined') {
            RES.getResByUrl("resource/gameEui.json", function (data, url) {
                window["JSONParseClass"]["setData"](data);
                egret.callLater(function () {
                    onSuccess.call(thisObject, generateEUI2);
                }, _this);
            }, this, RES.ResourceItem.TYPE_JSON);
        }
        else if (typeof generateJSON !== 'undefined') {
            if (url.indexOf(".exml") > -1) {
                var dataPath = url.split("/");
                dataPath.pop();
                var dirPath = dataPath.join("/") + "_EUI.json";
                if (!generateJSON.paths[url]) {
                    RES.getResByUrl(dirPath, function (data) {
                        window["JSONParseClass"]["setData"](data);
                        egret.callLater(function () {
                            onSuccess.call(thisObject, generateJSON.paths[url]);
                        }, _this);
                    }, this, RES.ResourceItem.TYPE_JSON);
                }
                else {
                    egret.callLater(function () {
                        onSuccess.call(thisObject, generateJSON.paths[url]);
                    }, this);
                }
            }
            else {
                egret.callLater(function () {
                    onSuccess.call(thisObject, generateJSON);
                }, this);
            }
        }
        else {
            RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, onResError, null);
            RES.getResByUrl(url, onResGet, this, RES.ResourceItem.TYPE_TEXT);
        }
    };
    return ThemeAdapter;
}());
__reflect(ThemeAdapter.prototype, "ThemeAdapter", ["eui.IThemeAdapter"]);
var game;
(function (game) {
    /**
     * ??????????????????
     */
    var TimerMgr = (function () {
        function TimerMgr() {
            // ????????????
            this.no = -1;
            this._timeInterval = 0;
            this._actArray = [];
            this._isStart = false;
            this._preTime = 0;
            //??????????????????
            this._currState = true;
            this._time = 0;
            this._actDic = new Object();
            if (egret.Capabilities.isMobile) {
                TimerMgr.DELAY = 30;
            }
            else {
                TimerMgr.DELAY = 17;
            }
            //???????????????????????????
            this._timer = new egret.Timer(1000, 0);
            this._timer.addEventListener(egret.TimerEvent.TIMER, this.onCheckTime, this);
        }
        Object.defineProperty(TimerMgr, "inst", {
            get: function () {
                return game.Singleton.getInstance("TimerMgr");
            },
            enumerable: true,
            configurable: true
        });
        TimerMgr.prototype.onCheckTime = function () {
            var curTime = egret.getTimer();
            //??????????????????????????????????????????
            if (curTime - this._preTime >= 2000) {
                if (this._currState) {
                    this.start();
                }
                else {
                    this.start2();
                }
            }
        };
        TimerMgr.prototype.startTime = function () {
            this._timer.start();
            this.start();
        };
        TimerMgr.prototype.start = function () {
            if (!this._isStart) {
                this.stop();
                this.stop2();
                var that = this;
                // egret.startTick(this.onTimer , this);
                // egret.Ticker.getInstance().register(this.onTimer, this);
                App.StageUtils.getStage().removeEventListener(egret.Event.ENTER_FRAME, this.onTimer, this);
                // if(!this._timer2) this._timer2 = new egret.Timer(TimerMgr.DELAY , 0);
                // this._timer2.addEventListener(egret.TimerEvent.TIMER, this.onTimer , this);
                // this._timer2.start();
                // this._timeInterval = setInterval(function():void{
                // 	that.onTimer();
                // } , TimerMgr.DELAY); //		
                // this._isStart = true;
            }
        };
        TimerMgr.prototype.stop = function () {
            this._isStart = false;
            App.StageUtils.getStage().removeEventListener(egret.Event.ENTER_FRAME, this.onTimer, this);
            // egret.stopTick(this.onTimer , this);				
        };
        TimerMgr.prototype.start2 = function () {
            if (!this._isStart) {
                this.stop2();
                this.stop();
                var that_1 = this;
                this._timeInterval = setInterval(function () {
                    that_1.onTimer(0);
                }, TimerMgr.DELAY); //	
                this._isStart = true;
            }
        };
        TimerMgr.prototype.stop2 = function () {
            this._isStart = false;
            clearInterval(this._timeInterval);
        };
        TimerMgr.prototype.updateActive = function (isActive) {
            if (isActive === void 0) { isActive = true; }
            if (isActive == this._currState)
                return;
            if (isActive) {
                this.stop2();
                this.start();
            }
            else {
                this.stop();
                this.start2();
            }
        };
        /**
         * ????????????
         *
         * @param action ??????
         * @param delay ????????????
         * @param times ??????????????????0??????????????? 	>1??????????????????????????????????????????
         * */
        TimerMgr.prototype.addAction = function (thisObj, action, delay, times, end) {
            if (end === void 0) { end = null; }
            var no = this.getAliveNo();
            // ????????????, ?????????????????????, ???????????????, ???????????????
            this._actArray[no] = { thisObj: thisObj, action: action, delay: delay, time: 0, current: 0, total: times, end: end, start_time: egret.getTimer() };
            this._actDic[thisObj.hashCode + "_" + action] = no;
            // this.startTime();
        };
        /**
         * ????????????
         * */
        TimerMgr.prototype.removeAction = function (thisObj, action) {
            var that = this;
            var actDic = that._actDic;
            if (actDic[thisObj.hashCode + "_" + action] != undefined) {
                var no = actDic[thisObj.hashCode + "_" + action];
                that._actArray[no] = null;
                actDic[thisObj.hashCode + "_" + action] = null;
                // delete actDic[thisObj.hashCode +"_"+action];	
            }
        };
        /**
         * ???????????????????????????
         * */
        TimerMgr.prototype.hasAction = function (thisObj, action) {
            if (this._actDic[thisObj.hashCode + "_" + action] != undefined) {
                return true;
            }
            else
                return false;
        };
        /**
         * ?????????????????????(0-99)
         * */
        TimerMgr.prototype.getAliveNo = function () {
            var currNo = this.no;
            var that = this;
            currNo++;
            if (currNo > TimerMgr.MAX_NO)
                currNo = 1;
            var obj = that._actArray[currNo];
            // ?????????????????????????????????
            while (obj != null) {
                currNo = that.getAliveNo();
                obj = that._actArray[currNo];
            }
            that.no = currNo;
            return currNo;
        };
        TimerMgr.prototype.onTimer = function (timeStamp) {
            var actArray = this._actArray;
            var that = this;
            if (!actArray) {
                // 	that.stop();
                return;
            }
            // if(actArray.length == 0)
            // that.stop();			
            var len = actArray.length;
            for (var i = len; i--;) {
                var info = actArray[i];
                that.execute(info);
            }
        };
        TimerMgr.prototype.execute = function (item) {
            if (item == null)
                return;
            var action = item.action;
            var delay = item.delay;
            var current = item.current;
            var total = item.total;
            var start_time = item.start_time;
            var curTime = egret.getTimer();
            if (this._time == 0) {
                this._time = curTime;
            }
            var delta_t = curTime - this._time;
            if (delta_t <= TimerMgr.DELAY) {
                delta_t = TimerMgr.DELAY;
            }
            this._time = curTime;
            // ????????????????????????????????????
            if (total != 0 && current >= total) {
                var end = item.end;
                if (end != null)
                    end.apply(item.thisObj);
                this.removeAction(item.thisObj, action);
                return;
            }
            if (total == 1) {
                if (delay > delta_t && current != 1) {
                    // ????????????
                    item.time += delta_t;
                    if (item.time < delay)
                        return;
                }
            }
            else {
                if (delay > delta_t && current != 0) {
                    // ????????????
                    item.time += delta_t;
                    if (item.time < delay)
                        return;
                }
            }
            // ????????????
            action.apply(item.thisObj);
            // ???????????????0
            item.time = 0;
            item.current++;
        };
        // ??????????????????
        TimerMgr.DELAY = 30; //17
        // ????????????
        TimerMgr.MAX_NO = 2147483647;
        return TimerMgr;
    }());
    game.TimerMgr = TimerMgr;
    __reflect(TimerMgr.prototype, "game.TimerMgr");
})(game || (game = {}));
/**
 * Created by yangsong on 2014/11/22.
 * Http???????????????
 */
var DynamicChange = (function () {
    function DynamicChange() {
        this._dataCache = [];
        this._pUpdate = new ProxyUpdate(this._dataCache);
    }
    Object.defineProperty(DynamicChange.prototype, "pUpdate", {
        get: function () {
            return this._pUpdate;
        },
        enumerable: true,
        configurable: true
    });
    DynamicChange.prototype.getCacheData = function (key) {
        if (this._dataCache[key]) {
            return this._dataCache[key];
        }
        return null;
    };
    DynamicChange.prototype.clearCache = function () {
        var keys = Object.keys(this._dataCache);
        for (var i = 0, len = keys.length; i < len; i++) {
            var key = keys[i];
            this._dataCache[key] = null;
            delete this._dataCache[key];
        }
    };
    DynamicChange.prototype.getCacheKeyInfos = function () {
        var results = [];
        var keys = Object.keys(this._dataCache);
        for (var i = 0, len = keys.length; i < len; i++) {
            var key = keys[i];
            var k = this._dataCache[key];
            results.push(k);
        }
        return results;
    };
    DynamicChange.prototype.isCache = function (key) {
        return this._dataCache[key];
    };
    return DynamicChange;
}());
__reflect(DynamicChange.prototype, "DynamicChange");
/**
 * Created by yangsong on 2014/11/22.
 * Http???????????????
 */
var ProxyUpdate = (function () {
    function ProxyUpdate(cache) {
        this._cache = cache;
    }
    ProxyUpdate.prototype.isArray = function (key) {
        return key instanceof Array;
    };
    ProxyUpdate.prototype.isObject = function (key) {
        return key.indexOf("object") > -1;
    };
    ProxyUpdate.prototype.isNormal = function (key) {
        var isAt = key.indexOf("@") > -1;
        var isDot = key.indexOf(".") > -1;
        var isUnderline = key.indexOf("_") > -1;
        return (!isAt && !isDot && !isUnderline);
    };
    ProxyUpdate.prototype.isAddToArray = function (key) {
        return (key == "@a");
    };
    ProxyUpdate.prototype.isRemoveToArray = function (key) {
        var arr = key.split("_");
        return (arr.length <= 3 && arr[0] == "@d");
    };
    ProxyUpdate.prototype.isFilter = function (key) {
        var arr = key.split("_");
        return (arr[0] == "@f");
    };
    ProxyUpdate.prototype.isNumeric = function (v) {
        return parseFloat(v).toString() == v.toString();
    };
    ProxyUpdate.prototype._updateObject = function (name, value, cacheData) {
        var arr = name.split(".");
        if (arr[0] == "@a" || arr[0] == "@s") {
            cacheData[arr[1]] = value;
        }
        else if (arr[0] == "@d") {
            delete cacheData[arr[1]];
        }
    };
    ProxyUpdate.prototype._getFilterObject = function (filter, cacheData) {
        if (cacheData) {
            var arr = filter.split("_");
            if (arr.length == 3 && arr[0] == "@f" && this.isArray(cacheData)) {
                var key = arr[1];
                var value = arr[2];
                for (var i = 0; i < cacheData.length; i++) {
                    var v = cacheData[i];
                    if (arr.length == 3 && this.isObject(v.toString())) {
                        var cacheValue = v[key];
                        if (cacheValue) {
                            if (value[0] == "@") {
                                value = value.replace("@", "");
                            }
                            if (value == cacheValue) {
                                return v;
                            }
                        }
                    }
                }
            }
        }
        return null;
    };
    ProxyUpdate.prototype._addObjectToArray = function (cacheData, changeValue) {
        if (this.isArray(changeValue)) {
            for (var i = 0; i < changeValue.length; i++) {
                cacheData.push(changeValue[i]);
            }
        }
        else {
            cacheData.push(changeValue);
        }
    };
    ProxyUpdate.prototype._removeObjectFromArray = function (cacheData, key, changeValue) {
        var arr = key.split("_");
        if (arr.length <= 3 && arr[0] == "@d") {
            if (this.isArray(cacheData)) {
                var count = cacheData.length;
                for (var i = count - 1; i >= 0; i--) {
                    var cacheDataItem = cacheData[i];
                    if (arr.length == 3) {
                        if (cacheDataItem.hasOwnProperty(arr[1])) {
                            var val = arr[2];
                            if (val[0] == "@") {
                                val = val.replace("@", "");
                            }
                            if (val == cacheDataItem[arr[1]]) {
                                cacheData.splice(i, 1);
                            }
                        }
                    }
                    else if (arr.length == 2 && cacheDataItem.hasOwnProperty(arr[1])) {
                        if (changeValue == cacheDataItem[arr[1]]) {
                            cacheData.splice(i, 1);
                        }
                    }
                    else if (arr.length == 1) {
                        if (changeValue == cacheDataItem) {
                            cacheData.splice(i, 1);
                        }
                    }
                }
            }
        }
    };
    ProxyUpdate.prototype.update = function (key, data) {
        this._cache[key] = data;
        if (data.hasOwnProperty("c")) {
            var cdata = data["c"];
            var keys = Object.keys(cdata);
            for (var i = 0, len = keys.length; i < len; i++) {
                var k1 = keys[i];
                if (this._cache[k1]) {
                    this._update(this._cache[k1], cdata[k1]);
                    App.MessageCenter.dispatch(k1 + "_HttpUpdate");
                }
            }
        }
    };
    ProxyUpdate.prototype._update = function (cacheData, changeData) {
        if (cacheData && changeData && this.isObject(changeData.toString())) {
            var keys = Object.keys(changeData);
            for (var i = 0, len = keys.length; i < len; i++) {
                var k = keys[i];
                var v = changeData[k];
                if (this.isNormal(k) && this.isObject(v.toString())) {
                    if (cacheData.hasOwnProperty(k)) {
                        this._update(cacheData[k], v);
                    }
                }
                else if (this.isNormal(k) && this.isNumeric(v)) {
                    var cv = cacheData[k];
                    cacheData[k] = cv + v;
                }
                else if (this.isNormal(k)) {
                    cacheData[k] = v;
                }
                else if (this.isAddToArray(k)) {
                    this._addObjectToArray(cacheData, v);
                }
                else if (this.isRemoveToArray(k)) {
                    this._removeObjectFromArray(cacheData, k, v);
                }
                else if (this.isFilter(k)) {
                    var subCacheData = this._getFilterObject(k, cacheData);
                    if (subCacheData) {
                        this._update(subCacheData, v);
                    }
                }
                else {
                    this._updateObject(k, v, cacheData);
                }
            }
        }
    };
    return ProxyUpdate;
}());
__reflect(ProxyUpdate.prototype, "ProxyUpdate");
/**
 * Created by yangsong on 2014/11/22.
 * Http????????????
 */
var Http = (function (_super) {
    __extends(Http, _super);
    /**
     * ????????????
     */
    function Http() {
        var _this = _super.call(this) || this;
        _this._data = new DynamicChange();
        _this._cache = [];
        _this._request = new egret.URLRequest();
        _this._request.method = egret.URLRequestMethod.POST;
        _this._urlLoader = new egret.URLLoader();
        _this._urlLoader.addEventListener(egret.IOErrorEvent.IO_ERROR, _this.onError, _this);
        return _this;
    }
    /**
     * ????????????????????????
     * @param serverUrl?????????????????????
     */
    Http.prototype.initServer = function (serverUrl) {
        this._serverUrl = serverUrl;
    };
    Object.defineProperty(Http.prototype, "Data", {
        /**
         * ????????????
         * @returns {DynamicChange}
         * @constructor
         */
        get: function () {
            return this._data;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Http??????????????????
     * @param e
     */
    Http.prototype.onError = function (e) {
        this.nextPost();
    };
    /**
     * ????????????
     * @param    type
     * @param    t_variables
     */
    Http.prototype.send = function (type, urlVariables) {
        this._cache.push([type, urlVariables]);
        this.post();
    };
    /**
     * ???????????????
     */
    Http.prototype.post = function () {
        if (this._isRequesting) {
            return;
        }
        if (this._cache.length == 0) {
            return;
        }
        var arr = this._cache.shift();
        var type = arr[0];
        var urlVariables = arr[1];
        this._type = type;
        this._request.url = this._serverUrl;
        this._request.data = urlVariables;
        this._urlLoader.addEventListener(egret.Event.COMPLETE, this.onLoaderComplete, this);
        this._urlLoader.load(this._request);
        this._isRequesting = true;
    };
    /**
     * ????????????
     * @param event
     */
    Http.prototype.onLoaderComplete = function (event) {
        this._urlLoader.removeEventListener(egret.Event.COMPLETE, this.onLoaderComplete, this);
        var t_obj = JSON.parse(this._urlLoader.data);
        if (!t_obj.hasOwnProperty("s") || t_obj["s"] == 0) {
            this._data.pUpdate.update(this._type, t_obj);
            App.MessageCenter.dispatch(this._type, t_obj);
        }
        else {
            Log.debug("Http??????:" + t_obj["s"]);
        }
        this.nextPost();
    };
    /**
     * ?????????????????????
     */
    Http.prototype.nextPost = function () {
        this._isRequesting = false;
        this.post();
    };
    return Http;
}(SingtonClass));
__reflect(Http.prototype, "Http");
var NettyHttp;
(function (NettyHttp) {
    var Http = (function () {
        function Http() {
            this.loader = new egret.URLLoader();
        }
        Http.create = function () {
            return new Http();
        };
        Http.prototype.success = function (handle, thisObj) {
            if (thisObj === void 0) { thisObj = null; }
            this.loader.addEventListener(egret.Event.COMPLETE, function (e) {
                var loader = e.target;
                handle.call(thisObj, loader.data);
            }, thisObj);
            return this;
        };
        Http.prototype.error = function (handle, thisObj) {
            if (thisObj === void 0) { thisObj = null; }
            this.loader.addEventListener(egret.IOErrorEvent.IO_ERROR, handle, thisObj);
            return this;
        };
        Http.prototype.add = function (source) {
            if (!this.variables) {
                this.variables = new egret.URLVariables();
            }
            this.variables.decode(source);
            return this;
        };
        Http.prototype.dataFormat = function (dataFormat) {
            this.loader.dataFormat = dataFormat;
            return this;
        };
        Http.prototype.get = function (url) {
            var req = new egret.URLRequest(url);
            this.variables && (req.data = this.variables);
            this.loader.load(req);
        };
        Http.prototype.post = function (url) {
            var req = new egret.URLRequest(url);
            req.method = egret.URLRequestMethod.POST;
            this.variables && (req.data = this.variables);
            this.loader.load(req);
        };
        return Http;
    }());
    NettyHttp.Http = Http;
    __reflect(Http.prototype, "NettyHttp.Http");
})(NettyHttp || (NettyHttp = {}));
var game;
(function (game) {
    var Singleton = (function () {
        function Singleton() {
        }
        Singleton.getInstance = function (value, needAddShow) {
            if (needAddShow === void 0) { needAddShow = false; }
            if (!this.classDic[value]) {
                var cls = egret.getDefinitionByName("game." + value);
                if (cls) {
                    this.classDic[value] = new cls();
                    // if(needAddShow)
                    // {
                    // 	UIViewMgr.addWin(this.classDic[value] , value);
                    // }
                }
            }
            return this.classDic[value];
        };
        Singleton.classDic = [];
        return Singleton;
    }());
    game.Singleton = Singleton;
    __reflect(Singleton.prototype, "game.Singleton");
})(game || (game = {}));
/**
 * Created by yangsong on 15-1-26.
 */
var Keyboard = (function () {
    function Keyboard() {
    }
    Keyboard.LEFT = 37;
    Keyboard.RIGHT = 39;
    Keyboard.UP = 38;
    Keyboard.DOWN = 40;
    Keyboard.W = 87;
    Keyboard.A = 65;
    Keyboard.S = 83;
    Keyboard.D = 68;
    Keyboard.J = 74;
    Keyboard.K = 75;
    Keyboard.L = 76;
    Keyboard.U = 85;
    Keyboard.I = 73;
    Keyboard.O = 79;
    Keyboard.P = 80;
    Keyboard.SPACE = 32;
    return Keyboard;
}());
__reflect(Keyboard.prototype, "Keyboard");
var CustomLabel = (function (_super) {
    __extends(CustomLabel, _super);
    function CustomLabel(useType) {
        if (useType === void 0) { useType = "CustomLabel"; }
        var _this = _super.call(this) || this;
        _this._type = useType;
        if (CustomLabel._classDic[useType] == undefined || CustomLabel._classDic[useType] == null) {
            CustomLabel._classDic[useType] = 1;
        }
        else {
            CustomLabel._classDic[useType] = CustomLabel._classDic[useType] + 1;
        }
        // this.fontFamily = "Microsoft YaHei";
        _this.textColor = 0xE7D0B7;
        return _this;
    }
    CustomLabel.prototype.dispose = function () {
        if (this.parent) {
            this.parent.removeChild(this);
        }
        CustomLabel._classDic[this._type] = CustomLabel._classDic[this._type]--;
    };
    CustomLabel.prototype.partAdded = function (partName, instance) {
    };
    Object.defineProperty(CustomLabel.prototype, "htmlText", {
        set: function (value) {
            if (!this._htmlTextParser)
                this._htmlTextParser = new egret.HtmlTextParser();
            if (value != null) {
                try {
                    this.textFlow = this._htmlTextParser.parser(value);
                }
                catch (e) {
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    CustomLabel.prototype.addMiaoBian = function () {
        this.stroke = 1;
        this.strokeColor = 0x000000;
    };
    CustomLabel.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
    };
    CustomLabel._classDic = new Object();
    return CustomLabel;
}(eui.Label));
__reflect(CustomLabel.prototype, "CustomLabel", ["eui.UIComponent", "egret.DisplayObject"]);
/**
 * Created by yangsong on 2014/11/28.
 * ???????????????
 */
var SceneManager = (function (_super) {
    __extends(SceneManager, _super);
    /**
     * ????????????
     */
    function SceneManager() {
        var _this = _super.call(this) || this;
        _this._scenes = {};
        return _this;
    }
    /**
     * ????????????
     */
    SceneManager.prototype.clear = function () {
        var nowScene = this._scenes[this._currScene];
        if (nowScene) {
            nowScene.onExit();
            this._currScene = undefined;
        }
        this._scenes = {};
    };
    /**
     * ??????Scene
     * @param key Scene????????????
     * @param scene Scene??????
     */
    SceneManager.prototype.register = function (key, scene) {
        this._scenes[key] = scene;
    };
    /**
     * ????????????
     * @param key ??????????????????
     */
    SceneManager.prototype.runScene = function (key) {
        var param = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            param[_i - 1] = arguments[_i];
        }
        var nowScene = this._scenes[key];
        if (nowScene == null) {
            Log.warn("??????" + key + "?????????");
            return;
        }
        var oldScene = this._scenes[this._currScene];
        if (oldScene) {
            oldScene.onExit();
        }
        nowScene.onEnter.apply(nowScene, param);
        this._currScene = key;
    };
    /**
     * ????????????Scene
     * @returns {number}
     */
    SceneManager.prototype.getCurrScene = function () {
        return this._currScene;
    };
    return SceneManager;
}(SingtonClass));
__reflect(SceneManager.prototype, "SceneManager");
/**
 * ???????????????????????????
 * ???????????????????????????_???????????????????????????????????????????????????????????????????????????????????????????????????
 * ???????????????????????????_dot
 * ??????BitmapNumber??????createNumPic??????DisplayObjectContainer
 * ????????????BitmapNumber???????????????????????????changeNum
 * ????????????desstroyNumPic
 *
 * Created by Saco on 2014/8/1.
 */
var BitmapNumber = (function (_super) {
    __extends(BitmapNumber, _super);
    function BitmapNumber() {
        var _this = _super.call(this) || this;
        _this._imgPool = [];
        _this._containerPool = [];
        return _this;
    }
    /*
     * ??????????????????????????????????????????DisplayObjectContainer
     * num???????????????????????????
     * type????????????
     * */
    BitmapNumber.prototype.createNumPic = function (num, type) {
        var container = this.getContainer();
        var numStr = num.toString();
        var index = 0;
        var tempBm;
        for (index; index < numStr.length; index++) {
            tempBm = this.getSingleNumPic(numStr.charAt(index), type);
            container.addChild(tempBm);
        }
        this.repositionNumPic(container);
        return container;
    };
    //??????????????????DisplayObjectContainer
    BitmapNumber.prototype.desstroyNumPic = function (picContainer) {
        this.clearContainer(picContainer);
        if (picContainer.parent)
            picContainer.parent.removeChild(picContainer);
        this._containerPool.push(picContainer);
    };
    /*
     * ??????????????????DisplayObjectContainer?????????
     * ???????????????????????????????????????????????????????????????????????????texture?????????????????????????????????
     * */
    BitmapNumber.prototype.changeNum = function (picContainer, num, type) {
        var numStr = num.toString();
        var tempBm;
        //???????????????????????????????????????????????????????????????
        if (picContainer.numChildren > numStr.length) {
            while (picContainer.numChildren > numStr.length) {
                this.recycleBM(picContainer.getChildAt(picContainer.numChildren - 1));
            }
        }
        var index = 0;
        var tempStr;
        for (index; index < numStr.length; index++) {
            //???????????????Bitmap???????????????????????????Bitmap??????
            if (index >= picContainer.numChildren)
                picContainer.addChild(this.getBitmap());
            tempStr = numStr.charAt(index);
            tempStr = tempStr == "." ? "dot" : tempStr;
            picContainer.getChildAt(index).texture = this.getTexture(tempStr, type);
        }
        this.repositionNumPic(picContainer);
    };
    //????????????????????????????????????????????????
    BitmapNumber.prototype.repositionNumPic = function (container) {
        var index = 0;
        var lastX = 0;
        var temp;
        for (index; index < container.numChildren; index++) {
            temp = container.getChildAt(index);
            temp.x = lastX;
            lastX = temp.x + temp.width;
        }
    };
    //????????????
    BitmapNumber.prototype.clearContainer = function (picContainer) {
        while (picContainer.numChildren) {
            this.recycleBM(picContainer.removeChildAt(0));
        }
    };
    //??????Bitmap
    BitmapNumber.prototype.recycleBM = function (bm) {
        if (bm && bm.parent) {
            bm.parent.removeChild(bm);
            bm.texture = null;
            this._imgPool.push(bm);
        }
    };
    BitmapNumber.prototype.getContainer = function () {
        if (this._containerPool.length)
            return this._containerPool.shift();
        return new egret.DisplayObjectContainer();
    };
    //??????????????????Bitmap
    BitmapNumber.prototype.getSingleNumPic = function (num, type) {
        if (num == ".")
            num = "dot";
        var bm = this.getBitmap();
        bm.texture = this.getTexture(num, type);
        return bm;
    };
    BitmapNumber.prototype.getTexture = function (num, type) {
        return RES.getRes(type + num);
    };
    BitmapNumber.prototype.getBitmap = function () {
        if (this._imgPool.length)
            return this._imgPool.shift();
        return new egret.Bitmap();
    };
    return BitmapNumber;
}(SingtonClass));
__reflect(BitmapNumber.prototype, "BitmapNumber");
/**
 * Created by yangsong on 15-1-14.
 * ???????????????
 */
var SoundBg = (function (_super) {
    __extends(SoundBg, _super);
    /**
     * ????????????
     */
    function SoundBg() {
        var _this = _super.call(this) || this;
        _this._currBg = "";
        return _this;
    }
    /**
     * ??????????????????
     */
    SoundBg.prototype.stop = function () {
        if (this._currSoundChannel) {
            this._currSoundChannel.stop();
        }
        this._currSoundChannel = null;
        this._currSound = null;
        this._currBg = "";
        this._pausePosition = null;
    };
    /**
     * ??????????????????
     * @param effectName
     */
    SoundBg.prototype.play = function (effectName) {
        if (this._currBg == effectName)
            return;
        this.stop();
        this._currBg = effectName;
        var sound = this.getSound(effectName);
        if (sound) {
            this.playSound(sound);
        }
    };
    /**
     * ??????
     */
    SoundBg.prototype.pause = function () {
        if (!this._currSoundChannel) {
            return;
        }
        this._pausePosition = this._currSoundChannel.position;
        this._currSoundChannel.stop();
    };
    /**
     * ??????
     */
    SoundBg.prototype.resume = function () {
        if (!this._currSoundChannel) {
            return;
        }
        if (!this._pausePosition) {
            return;
        }
        this._currSound.play(this._pausePosition);
        this._pausePosition = null;
    };
    /**
     * ??????
     * @param sound
     */
    SoundBg.prototype.playSound = function (sound) {
        this._currSound = sound;
        this._currSoundChannel = this._currSound.play();
        this._currSoundChannel.volume = this._volume;
    };
    /**
     * ????????????
     * @param volume
     */
    SoundBg.prototype.setVolume = function (volume) {
        this._volume = volume;
        if (this._currSoundChannel) {
            this._currSoundChannel.volume = this._volume;
        }
    };
    /**
     * ?????????????????????????????????
     * @param key
     */
    SoundBg.prototype.loadedPlay = function (key) {
        if (this._currBg == key) {
            this.playSound(RES.getRes(key));
        }
    };
    /**
     * ?????????????????????????????????
     * @param key
     * @returns {boolean}
     */
    SoundBg.prototype.checkCanClear = function (key) {
        return this._currBg != key;
    };
    return SoundBg;
}(BaseSound));
__reflect(SoundBg.prototype, "SoundBg", ["ISoundBg"]);
/**
 * Created by yangsong on 18-12-26.
 * ?????????(?????????????????????)
 */
var SoundBgWx = (function () {
    /**
     * ????????????
     */
    function SoundBgWx() {
        this._audio = window["wx"].createInnerAudioContext();
        this._currBg = "";
    }
    /**
     * ??????????????????
     */
    SoundBgWx.prototype.stop = function () {
        this._audio.stop();
        this._currBg = "";
    };
    /**
     * ??????????????????
     * @param bgName
     */
    SoundBgWx.prototype.play = function (bgName) {
        if (this._currBg == bgName) {
            return;
        }
        this.stop();
        this._currBg = bgName;
        this._audio.src = App.ResourceUtils.getFileRealPath(this._currBg);
        this._audio.loop = true;
        this._audio.volume = this._volume;
        this._audio.startTime = 0;
        this._audio.play();
    };
    /**
     * ??????
     */
    SoundBgWx.prototype.pause = function () {
        if (this._currBg.length == 0) {
            return;
        }
        this._audio.pause();
    };
    /**
     * ??????
     */
    SoundBgWx.prototype.resume = function () {
        if (this._currBg.length == 0) {
            return;
        }
        this._audio.play();
    };
    /**
     * ????????????
     * @param volume
     */
    SoundBgWx.prototype.setVolume = function (volume) {
        this._volume = volume;
        if (this._audio) {
            this._audio.volume = this._volume;
        }
    };
    return SoundBgWx;
}());
__reflect(SoundBgWx.prototype, "SoundBgWx", ["ISoundBg"]);
/**
 * Created by yangsong on 15-1-14.
 * ?????????
 */
var SoundEffect = (function (_super) {
    __extends(SoundEffect, _super);
    /**
     * ????????????
     */
    function SoundEffect() {
        var _this = _super.call(this) || this;
        _this._soundLoops = {};
        _this._soundChannels = {};
        return _this;
    }
    /**
     * ??????????????????
     * @param effectName
     */
    SoundEffect.prototype.play = function (effectName, loops) {
        var sound = this.getSound(effectName);
        if (sound) {
            this.playSound(effectName, sound, loops);
        }
        else {
            this._soundLoops[effectName] = loops;
        }
    };
    /**
     * ??????
     * @param sound
     */
    SoundEffect.prototype.playSound = function (effectName, sound, loops) {
        var channel = sound.play(0, loops);
        channel.volume = this._volume;
        channel["name"] = effectName;
        channel.addEventListener(egret.Event.SOUND_COMPLETE, this.onPlayComplete, this);
        this._soundChannels[channel["name"]] = channel;
    };
    /**
     * ????????????
     */
    SoundEffect.prototype.onPlayComplete = function (e) {
        var channel = e.currentTarget;
        this.destroyChannel(channel);
    };
    /**
     * ??????channel
     */
    SoundEffect.prototype.destroyChannel = function (channel) {
        channel.stop();
        channel.removeEventListener(egret.Event.SOUND_COMPLETE, this.onPlayComplete, this);
        delete this._soundChannels[channel["name"]];
    };
    /**
     * ??????????????????
     * @param effectName
     */
    SoundEffect.prototype.stop = function (effectName) {
        var channel = this._soundChannels[effectName];
        if (channel) {
            this.destroyChannel(channel);
        }
    };
    /**
     * ????????????
     * @param volume
     */
    SoundEffect.prototype.setVolume = function (volume) {
        this._volume = volume;
    };
    /**
     * ?????????????????????????????????
     * @param key
     */
    SoundEffect.prototype.loadedPlay = function (key) {
        this.playSound(key, RES.getRes(key), this._soundLoops[key]);
        delete this._soundLoops[key];
    };
    return SoundEffect;
}(BaseSound));
__reflect(SoundEffect.prototype, "SoundEffect", ["ISoundEffect"]);
/**
 * Created by yangsong on 18-11-21.
 * ?????????(?????????????????????)
 */
var SoundEffectWx = (function () {
    /**
     * ????????????
     */
    function SoundEffectWx() {
        this._wx = window["wx"];
        this._cache = {};
        App.TimerManager.doTimer(1 * 60 * 1000, 0, this.dealSoundTimer, this);
    }
    /**
     * ???????????????????????????
     */
    SoundEffectWx.prototype.dealSoundTimer = function () {
        var currTime = egret.getTimer();
        var keys = Object.keys(this._cache);
        for (var i = 0, len = keys.length; i < len; i++) {
            var key = keys[i];
            if (!this.checkCanClear(key)) {
                continue;
            }
            var audio = this._cache[key];
            if (currTime - audio.useTime >= SoundManager.CLEAR_TIME) {
                // Log.debug(key + "???clear");
                audio.destroy();
                delete this._cache[key];
            }
        }
    };
    /**
     * ?????????????????????????????????
     * @param key
     * @returns {boolean}
     */
    SoundEffectWx.prototype.checkCanClear = function (key) {
        return true;
    };
    /**
     * ??????Sound
     * @param effectName
     * @returns {InnerAudioContext}
     */
    SoundEffectWx.prototype.getAudio = function (effectName) {
        var audio = this._cache[effectName];
        if (!audio) {
            audio = this._wx.createInnerAudioContext();
            audio.src = App.ResourceUtils.getFileRealPath(effectName);
            this._cache[effectName] = audio;
        }
        audio.useTime = egret.getTimer();
        return audio;
    };
    /**
     * ??????????????????
     * @param effectName
     */
    SoundEffectWx.prototype.play = function (effectName, loops) {
        var audio = this.getAudio(effectName);
        audio.loop = loops == 0 ? true : false;
        audio.volume = this._volume;
        audio.startTime = 0;
        audio.play();
    };
    /**
     * ??????????????????
     * @param effectName
     */
    SoundEffectWx.prototype.stop = function (effectName) {
        var audio = this._cache[effectName];
        if (audio) {
            audio.stop();
        }
    };
    /**
     * ????????????
     * @param volume
     */
    SoundEffectWx.prototype.setVolume = function (volume) {
        this._volume = volume;
    };
    return SoundEffectWx;
}());
__reflect(SoundEffectWx.prototype, "SoundEffectWx", ["ISoundEffect"]);
/**
 * Created by yangsong on 15-1-14.
 * Sound?????????
 */
var SoundManager = (function (_super) {
    __extends(SoundManager, _super);
    /**
     * ????????????
     */
    function SoundManager() {
        var _this = _super.call(this) || this;
        //LocalStorage?????????key???
        _this.LocalStorageKey_Bg = "bgMusicFlag";
        _this.LocalStorageKey_Effect = "effectMusicFlag";
        //????????????release?????????????????????
        _this.bgVolume = 0;
        _this.effectVolume = 0;
        if (App.DeviceUtils.IsWxGame) {
            _this.bg = new SoundBgWx();
            _this.effect = new SoundEffectWx();
        }
        else {
            _this.bg = new SoundBg();
            _this.effect = new SoundEffect();
        }
        _this.bg.setVolume(_this.bgVolume);
        _this.effect.setVolume(_this.effectVolume);
        _this.setDefaultSwitchState();
        return _this;
    }
    /**
     * ????????????????????????????????????????????????
     */
    SoundManager.prototype.setDefaultSwitchState = function () {
        var bgMusicFlag = egret.localStorage.getItem(this.LocalStorageKey_Bg);
        if (!bgMusicFlag) {
            this.bgOn = true;
        }
        else {
            this.bgOn = bgMusicFlag == "1";
        }
        var effectMusicFlag = egret.localStorage.getItem(this.LocalStorageKey_Effect);
        if (!effectMusicFlag) {
            this.effectOn = true;
        }
        else {
            this.effectOn = effectMusicFlag == "1";
        }
        Log.info("???????????????", this.bgOn);
        Log.info("?????????", this.effectOn);
    };
    /**
     * ????????????
     * @param effectName
     */
    SoundManager.prototype.playEffect = function (effectName, loops) {
        if (loops === void 0) { loops = 1; }
        if (!this.effectOn)
            return;
        this.effect.play(effectName, loops);
    };
    /**
     * ??????????????????
     * @param effectName
     */
    SoundManager.prototype.stopEffect = function (effectName) {
        this.effect.stop(effectName);
    };
    /**
     * ??????????????????
     * @param key
     */
    SoundManager.prototype.playBg = function (bgName) {
        this.currBg = bgName;
        if (!this.bgOn)
            return;
        this.bg.play(bgName);
    };
    /**
     * ??????????????????
     */
    SoundManager.prototype.stopBg = function () {
        this.bg.stop();
    };
    /**
     * ??????????????????
     */
    SoundManager.prototype.pauseBg = function () {
        if (!this.bgOn)
            return;
        this.bg.pause();
    };
    /**
     * ??????????????????
     */
    SoundManager.prototype.resumeBg = function () {
        if (!this.bgOn)
            return;
        this.bg.resume();
    };
    /**
     * ????????????????????????
     * @param $isOn
     */
    SoundManager.prototype.setEffectOn = function ($isOn) {
        this.effectOn = $isOn;
        egret.localStorage.setItem(this.LocalStorageKey_Effect, $isOn ? "1" : "0");
    };
    /**
     * ??????????????????????????????
     * @param $isOn
     */
    SoundManager.prototype.setBgOn = function ($isOn) {
        this.bgOn = $isOn;
        egret.localStorage.setItem(this.LocalStorageKey_Bg, $isOn ? "1" : "0");
        if (!this.bgOn) {
            this.stopBg();
        }
        else {
            if (this.currBg) {
                this.playBg(this.currBg);
            }
        }
    };
    /**
     * ????????????????????????
     * @param volume
     */
    SoundManager.prototype.setBgVolume = function (volume) {
        volume = Math.min(volume, 1);
        volume = Math.max(volume, 0);
        this.bgVolume = volume;
        this.bg.setVolume(this.bgVolume);
    };
    /**
     * ????????????????????????
     * @returns {number}
     */
    SoundManager.prototype.getBgVolume = function () {
        return this.bgVolume;
    };
    /**
     * ??????????????????
     * @param volume
     */
    SoundManager.prototype.setEffectVolume = function (volume) {
        volume = Math.min(volume, 1);
        volume = Math.max(volume, 0);
        this.effectVolume = volume;
        this.effect.setVolume(this.effectVolume);
    };
    /**
     * ??????????????????
     * @returns {number}
     */
    SoundManager.prototype.getEffectVolume = function () {
        return this.effectVolume;
    };
    Object.defineProperty(SoundManager.prototype, "bgIsOn", {
        /**
         * ???????????????????????????
         * @returns {boolean}
         */
        get: function () {
            return this.bgOn;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SoundManager.prototype, "effectIsOn", {
        /**
         * ?????????????????????
         * @returns {boolean}
         */
        get: function () {
            return this.effectOn;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * ????????????????????????
     * @type {number}
     */
    SoundManager.CLEAR_TIME = 3 * 60 * 1000;
    return SoundManager;
}(SingtonClass));
__reflect(SoundManager.prototype, "SoundManager");
/**
 * Created by zmliu on 14-5-11.
 */
var starlingswf;
(function (starlingswf) {
    /**
     * Swf?????????
     * */
    var Swf = (function () {
        function Swf(swfData, assetManager, fps) {
            if (fps === void 0) { fps = 24; }
            this._swfData = swfData;
            this._assetManager = assetManager;
            this._createDisplayFuns = new Object();
            this._createDisplayFuns[Swf.dataKey_Sprite] = this.createSprite;
            this._createDisplayFuns[Swf.dataKey_MovieClip] = this.createMovie;
            this._createDisplayFuns[Swf.dataKey_Image] = this.createImage;
            this._createDisplayFuns[Swf.dataKey_Scale9] = this.createS9Image;
            this._createDisplayFuns[Swf.dataKey_ShapeImg] = this.createShapeImage;
            this._createDisplayFuns[Swf.dataKey_TextField] = this.createTextField;
            this.swfUpdateManager = starlingswf.SwfUpdateManager.createSwfUpdateManager(fps);
        }
        Swf.prototype.createSprite = function (name, data, sprData) {
            if (data === void 0) { data = null; }
            if (sprData === void 0) { sprData = null; }
            if (sprData == null) {
                sprData = this._swfData[Swf.dataKey_Sprite][name];
            }
            var sprite = new starlingswf.SwfSprite();
            var length = sprData.length;
            var objData;
            var display;
            var fun;
            var swf;
            for (var i = 0; i < length; i++) {
                objData = sprData[i];
                fun = this._createDisplayFuns[objData[1]];
                if (fun == null)
                    continue;
                display = fun.apply(this, [objData[0], objData]);
                display.name = objData[9];
                display.x = objData[2];
                display.y = objData[3];
                if (objData[0] == Swf.dataKey_TextField) {
                    //                    display.y += objData[14] / 10;
                }
                if (objData[1] != Swf.dataKey_Scale9 && objData[1] != Swf.dataKey_ShapeImg) {
                    display.scaleX = objData[4];
                    display.scaleY = objData[5];
                }
                display.skewX = objData[6];
                display.skewY = objData[7];
                display.alpha = objData[8];
                sprite.addChild(display);
            }
            return sprite;
        };
        Swf.prototype.createMovie = function (name, data, cls) {
            if (data === void 0) { data = null; }
            if (cls === void 0) { cls = null; }
            var movieClipData = this._swfData[Swf.dataKey_MovieClip][name];
            var objectCountData = movieClipData["objCount"];
            var displayObjects = {};
            var displayObjectArray;
            var type;
            var count;
            var fun;
            var objName;
            for (objName in objectCountData) {
                type = objectCountData[objName][0];
                count = objectCountData[objName][1];
                displayObjectArray = displayObjects[objName] == null ? [] : displayObjects[objName];
                for (var i = 0; i < count; i++) {
                    fun = this._createDisplayFuns[type];
                    if (fun == null)
                        continue;
                    displayObjectArray.push(fun.apply(this, [objName, null]));
                }
                displayObjects[objName] = displayObjectArray;
            }
            var mc;
            if (cls == null) {
                mc = new starlingswf.SwfMovieClip(movieClipData["frames"], movieClipData["labels"], displayObjects, this);
            }
            else {
                mc = new cls(movieClipData["frames"], movieClipData["labels"], displayObjects, this);
            }
            mc.loop = movieClipData["loop"];
            return mc;
        };
        Swf.prototype.createImage = function (name, data) {
            if (data === void 0) { data = null; }
            var imageData = this._swfData[Swf.dataKey_Image][name];
            var bitmap = this._assetManager.createBitmap(name);
            bitmap.anchorOffsetX = imageData[0];
            bitmap.anchorOffsetY = imageData[1];
            return bitmap;
        };
        Swf.prototype.getTexture = function (name) {
            return this._assetManager.getTexture(name);
        };
        Swf.prototype.createS9Image = function (name, data) {
            if (data === void 0) { data = null; }
            var scale9Data = this._swfData[Swf.dataKey_Scale9][name];
            var bitmap = this._assetManager.createBitmap(name);
            bitmap.scale9Grid = new egret.Rectangle(scale9Data[0], scale9Data[1], scale9Data[2], scale9Data[3]);
            if (data != null) {
                bitmap.width = data[10];
                bitmap.height = data[11];
            }
            return bitmap;
        };
        Swf.prototype.createShapeImage = function (name, data) {
            if (data === void 0) { data = null; }
            var bitmap = this._assetManager.createBitmap(name);
            bitmap.fillMode = egret.BitmapFillMode.REPEAT;
            if (data != null) {
                bitmap.width = data[10];
                bitmap.height = data[11];
            }
            return bitmap;
        };
        Swf.prototype.createTextField = function (name, data) {
            if (data === void 0) { data = null; }
            var textfield = new egret.TextField();
            if (data != null) {
                textfield.width = data[10];
                textfield.height = data[11];
                //textfield.fontFamily = <string>data[12];
                textfield.textColor = data[13];
                textfield.size = data[14];
                textfield.textAlign = data[15];
                //textfield.italic = data[16];
                //textfield.bold = data[17];
                textfield.text = data[18];
            }
            return textfield;
        };
        /**
         * ???????????????Sprite
         * */
        Swf.prototype.hasSprite = function (name) {
            return this._swfData[Swf.dataKey_Sprite][name] != null;
        };
        /**
         * ???????????????MovieClip
         * */
        Swf.prototype.hasMovieClip = function (name) {
            return this._swfData[Swf.dataKey_MovieClip][name] != null;
        };
        /**
         * ???????????????Image
         * */
        Swf.prototype.hasImage = function (name) {
            return this._swfData[Swf.dataKey_Image][name] != null;
        };
        /**
         * ???????????????S9Image
         * */
        Swf.prototype.hasS9Image = function (name) {
            return this._swfData[Swf.dataKey_Scale9][name] != null;
        };
        /**
         * ???????????????S9Image
         * */
        Swf.prototype.hasShapeImage = function (name) {
            return this._swfData[Swf.dataKey_ShapeImg][name] != null;
        };
        Swf.dataKey_Sprite = "spr";
        Swf.dataKey_Image = "img";
        Swf.dataKey_MovieClip = "mc";
        Swf.dataKey_TextField = "text";
        Swf.dataKey_Button = "btn";
        Swf.dataKey_Scale9 = "s9";
        Swf.dataKey_ShapeImg = "shapeImg";
        Swf.dataKey_Component = "comp";
        Swf.dataKey_Particle = "particle";
        return Swf;
    }());
    starlingswf.Swf = Swf;
    __reflect(Swf.prototype, "starlingswf.Swf");
})(starlingswf || (starlingswf = {}));
/**
 * Created by zmliu on 14-5-11.
 */
var starlingswf;
(function (starlingswf) {
    /**
     * swf???????????????
     * */
    var SwfAssetManager = (function () {
        function SwfAssetManager() {
            this._sheets = {};
            this._textures = {};
        }
        SwfAssetManager.prototype.addSpriteSheet = function (name, spriteSheep) {
            this._sheets[name] = spriteSheep;
        };
        SwfAssetManager.prototype.addTexture = function (name, texture) {
            this._textures[name] = texture;
        };
        SwfAssetManager.prototype.createBitmap = function (name) {
            var texture = this.getTexture(name);
            if (texture == null)
                return null;
            var bitmap = new egret.Bitmap();
            bitmap.texture = texture;
            return bitmap;
        };
        SwfAssetManager.prototype.getTexture = function (name) {
            var texture;
            var sheet;
            var key;
            for (key in this._sheets) {
                sheet = this._sheets[key];
                texture = sheet.getTexture(name);
                if (texture != null)
                    break;
            }
            if (texture == null)
                texture = this._textures[name];
            return texture;
        };
        return SwfAssetManager;
    }());
    starlingswf.SwfAssetManager = SwfAssetManager;
    __reflect(SwfAssetManager.prototype, "starlingswf.SwfAssetManager");
})(starlingswf || (starlingswf = {}));
/**
 * Created by zmliu on 14-5-11.
 */
var starlingswf;
(function (starlingswf) {
    /** ????????????????????? */
    var SwfUpdateManager = (function () {
        function SwfUpdateManager() {
        }
        SwfUpdateManager.createSwfUpdateManager = function (fps) {
            var updateManager = new SwfUpdateManager();
            updateManager._animations = [];
            updateManager._addQueue = [];
            updateManager._removeQueue = [];
            updateManager._currentTime = 0;
            updateManager.setFps(fps);
            App.TimerManager.doFrame(1, 0, updateManager.update, updateManager);
            return updateManager;
        };
        SwfUpdateManager.prototype.clear = function () {
            this._addQueue.splice(0);
            this._removeQueue.splice(0);
            this._animations.splice(0);
        };
        SwfUpdateManager.prototype.stop = function () {
            this.clear();
            App.TimerManager.remove(this.update, this);
        };
        SwfUpdateManager.prototype.play = function () {
            App.TimerManager.doFrame(1, 0, this.update, this);
        };
        SwfUpdateManager.prototype.setFps = function (fps) {
            this._fps = fps;
            this._fpsTime = 1000 / fps;
        };
        SwfUpdateManager.prototype.addSwfAnimation = function (animation) {
            this._addQueue.push(animation);
        };
        SwfUpdateManager.prototype.removeSwfAnimation = function (animation) {
            this._removeQueue.push(animation);
            var addIndex = this._addQueue.indexOf(animation);
            if (addIndex != -1) {
                this._addQueue.splice(addIndex, 1);
            }
        };
        SwfUpdateManager.prototype.updateAdd = function () {
            var len = this._addQueue.length;
            var index;
            var animation;
            for (var i = 0; i < len; i++) {
                animation = this._addQueue.pop();
                index = this._animations.indexOf(animation);
                if (index == -1) {
                    this._animations.push(animation);
                }
            }
        };
        SwfUpdateManager.prototype.updateRemove = function () {
            var len = this._removeQueue.length;
            var index;
            var animation;
            for (var i = 0; i < len; i++) {
                animation = this._removeQueue.pop();
                index = this._animations.indexOf(animation);
                if (index != -1) {
                    this._animations.splice(index, 1);
                }
            }
        };
        SwfUpdateManager.prototype.update = function (time) {
            this._currentTime += time;
            if (this._currentTime < this._fpsTime) {
                return;
            }
            this._currentTime -= this._fpsTime;
            this._update();
            var jumpFlag = 0;
            while (this._currentTime > this._fpsTime) {
                this._currentTime -= this._fpsTime;
                jumpFlag++;
                if (jumpFlag < 4) {
                    this._update();
                }
            }
        };
        SwfUpdateManager.prototype._update = function () {
            this.updateRemove();
            this.updateAdd();
            var len = this._animations.length;
            for (var i = 0; i < len; i++) {
                this._animations[i].update();
            }
        };
        return SwfUpdateManager;
    }());
    starlingswf.SwfUpdateManager = SwfUpdateManager;
    __reflect(SwfUpdateManager.prototype, "starlingswf.SwfUpdateManager");
})(starlingswf || (starlingswf = {}));
/**
 * Created by Saco on 2014/12/1.
 */
var HotspotBitmap = (function (_super) {
    __extends(HotspotBitmap, _super);
    function HotspotBitmap() {
        var _this = _super.call(this) || this;
        _this._hotspot = [];
        _this.touchEnabled = true;
        _this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, _this.onTouch, _this);
        return _this;
    }
    HotspotBitmap.prototype.addHotspotArea = function (rect, callBack, thisObj, para) {
        this._hotspot.push({ "rect": rect, "callBack": callBack, "thisObj": thisObj, "para": para });
    };
    HotspotBitmap.prototype.onTouch = function (e) {
        var x = e.localX;
        var y = e.localY;
        var tempObj;
        for (var i = 0; i < this._hotspot.length; i++) {
            tempObj = this._hotspot[i];
            if (tempObj.rect.contains(x, y)) {
                if (tempObj.para)
                    tempObj.callBack.call(tempObj.thisObj, tempObj.para);
                else
                    tempObj.callBack.call(tempObj.thisObj);
            }
        }
    };
    return HotspotBitmap;
}(egret.Bitmap));
__reflect(HotspotBitmap.prototype, "HotspotBitmap");
/**
 * Created by yangsong on 15-1-14.
 * Armature?????????
 */
var DragonBonesArmature = (function (_super) {
    __extends(DragonBonesArmature, _super);
    /**
     * ????????????
     * @param armature dragonBones.Armature
     * @param clock dragonBones.WorldClock
     */
    function DragonBonesArmature(armature, clock) {
        var _this = _super.call(this) || this;
        _this._armature = armature;
        _this._clock = clock;
        _this.addChild(_this._armature.display);
        _this._completeCalls = [];
        _this._frameCalls = [];
        _this._isPlay = false;
        _this._playName = "";
        return _this;
    }
    /**
     * ??????????????????
     */
    DragonBonesArmature.prototype.addListeners = function () {
        this._armature.eventDispatcher.addEvent(dragonBones.EventObject.COMPLETE, this.completeHandler, this);
        this._armature.eventDispatcher.addEvent(dragonBones.EventObject.FRAME_EVENT, this.frameHandler, this);
    };
    /**
     * ??????????????????
     */
    DragonBonesArmature.prototype.removeListeners = function () {
        this._armature.eventDispatcher.removeEvent(dragonBones.EventObject.COMPLETE, this.completeHandler, this);
        this._armature.eventDispatcher.removeEvent(dragonBones.EventObject.FRAME_EVENT, this.frameHandler, this);
    };
    /**
     * ????????????????????????
     * @param e
     */
    DragonBonesArmature.prototype.completeHandler = function (e) {
        var animationName = e.eventObject.animationState.name;
        for (var i = 0, len = this._completeCalls.length; i < len; i++) {
            var arr = this._completeCalls[i];
            arr[0].apply(arr[1], [e, animationName]);
        }
        if (animationName == this._playName) {
            this._playName = "";
        }
    };
    /**
     * ?????????????????????
     * @param e
     */
    DragonBonesArmature.prototype.frameHandler = function (e) {
        for (var i = 0, len = this._frameCalls.length; i < len; i++) {
            var arr = this._frameCalls[i];
            arr[0].apply(arr[1], [e]);
        }
    };
    /**
     * ????????????name?????????
     * @param name ??????
     * @param playNum ??????????????????????????????????????????
     */
    DragonBonesArmature.prototype.play = function (name, playNum) {
        if (playNum === void 0) { playNum = undefined; }
        if (this._playName == name) {
            return this._currAnimationState;
        }
        this._playName = name;
        this.start();
        if (playNum == undefined) {
            this._currAnimationState = this.getAnimation().play(name);
        }
        else {
            this._currAnimationState = this.getAnimation().play(name, playNum);
        }
        return this._currAnimationState;
    };
    /**
     * ?????????????????????????????????
     */
    DragonBonesArmature.prototype.gotoAndPlayByTime = function (name, time, playNum) {
        if (playNum === void 0) { playNum = undefined; }
        this._currAnimationState = this.getAnimation().gotoAndPlayByTime(name, time, playNum);
        return this._currAnimationState;
    };
    Object.defineProperty(DragonBonesArmature.prototype, "currentTime", {
        /**
         * ?????????????????????????????????
         */
        get: function () {
            if (!this._currAnimationState) {
                return 0;
            }
            return this._currAnimationState.currentTime;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * ????????????
     */
    DragonBonesArmature.prototype.start = function () {
        if (!this._isPlay) {
            this._clock.add(this._armature);
            this._isPlay = true;
            this.addListeners();
        }
    };
    /**
     * ????????????
     */
    DragonBonesArmature.prototype.stop = function () {
        if (this._isPlay) {
            this._clock.remove(this._armature);
            this._isPlay = false;
            this._playName = "";
            this.removeListeners();
        }
    };
    /**
     * ??????
     */
    DragonBonesArmature.prototype.destroy = function () {
        this.stop();
        if (this.parent) {
            this.parent.removeChild(this);
        }
        this.removeChildren();
        this._armature.dispose();
        this._armature = null;
        this._clock = null;
        this._completeCalls.length = 0;
        this._completeCalls = null;
        this._frameCalls.length = 0;
        this._frameCalls = null;
        this._currAnimationState = null;
        this._cacheAllSlotDisplayData = null;
    };
    /**
     * ????????????????????????
     * @param callFunc ??????
     * @param target ??????????????????
     */
    DragonBonesArmature.prototype.addCompleteCallFunc = function (callFunc, target) {
        for (var i = 0; i < this._completeCalls.length; i++) {
            var arr = this._completeCalls[i];
            if (arr[0] == callFunc && arr[1] == target) {
                return;
            }
        }
        this._completeCalls.unshift([callFunc, target]);
    };
    /**
     * ??????????????????????????????
     * @param callFunc ??????
     * @param target ??????????????????
     */
    DragonBonesArmature.prototype.removeCompleteCallFunc = function (callFunc, target) {
        for (var i = 0; i < this._completeCalls.length; i++) {
            var arr = this._completeCalls[i];
            if (arr[0] == callFunc && arr[1] == target) {
                this._completeCalls.splice(i, 1);
                i--;
            }
        }
    };
    /**
     * ???????????????????????????
     * @param callFunc ??????
     * @param target ??????????????????
     */
    DragonBonesArmature.prototype.addFrameCallFunc = function (callFunc, target) {
        for (var i = 0; i < this._frameCalls.length; i++) {
            var arr = this._frameCalls[i];
            if (arr[0] == callFunc && arr[1] == target) {
                return;
            }
        }
        this._frameCalls.push([callFunc, target]);
    };
    /**
     * ???????????????????????????
     * @param callFunc ??????
     * @param target ??????????????????
     */
    DragonBonesArmature.prototype.removeFrameCallFunc = function (callFunc, target) {
        for (var i = 0; i < this._frameCalls.length; i++) {
            var arr = this._frameCalls[i];
            if (arr[0] == callFunc && arr[1] == target) {
                this._frameCalls.splice(i, 1);
                i--;
            }
        }
    };
    /**
     * ??????????????????
     * @private
     */
    DragonBonesArmature.prototype.$onRemoveFromStage = function () {
        _super.prototype.$onRemoveFromStage.call(this);
        this.stop();
    };
    /**
     * ??????dragonBones.Armature
     * @returns {dragonBones.Armature}
     */
    DragonBonesArmature.prototype.getArmature = function () {
        return this._armature;
    };
    /**
     * ????????????dragonBones.AnimationState
     * @returns {dragonBones.AnimationState}
     */
    DragonBonesArmature.prototype.getCurrAnimationState = function () {
        return this._currAnimationState;
    };
    /**
     * ????????????dragonBones.WorldClock
     * @returns {dragonBones.WorldClock}
     */
    DragonBonesArmature.prototype.getClock = function () {
        return this._clock;
    };
    /**
     * ??????dragonBones.Animation
     * @returns {Animation}
     */
    DragonBonesArmature.prototype.getAnimation = function () {
        return this._armature.animation;
    };
    /**
     * ????????????dragonBones.Bone
     * @param boneName
     * @returns {dragonBones.Bone}
     */
    DragonBonesArmature.prototype.getBone = function (boneName) {
        return this._armature.getBone(boneName);
    };
    /**
     * ?????????????????????????????????
     * @param animationName
     * @returns {number}
     */
    DragonBonesArmature.prototype.getAnimationDuration = function (animationName) {
        return this._armature.animation.animations[animationName].duration;
    };
    /**
     * ?????????????????????????????????
     * @returns {string}
     */
    DragonBonesArmature.prototype.getPlayName = function () {
        return this._playName;
    };
    /**
     * ???????????????display
     * @param bone
     * @returns {function(): any}
     */
    DragonBonesArmature.prototype.getBoneDisplay = function (bone) {
        return bone.slot.display;
    };
    /**
     * ??????????????????
     * @param boneName
     * @param displayObject
     */
    DragonBonesArmature.prototype.changeBone = function (boneName, displayObject) {
        var bone = this.getBone(boneName);
        if (bone) {
            bone.slot.setDisplay(displayObject);
        }
    };
    /**
     * ????????????
     */
    DragonBonesArmature.prototype.changeSlot = function (slotName, displayObject) {
        var slot = this._armature.getSlot(slotName);
        if (!slot) {
            // Log.warn("Slot?????????", slotName);
            return;
        }
        if (displayObject) {
            if (this._cacheAllSlotDisplayData) {
                var cacheDisplayData = this._cacheAllSlotDisplayData[slotName];
                if (cacheDisplayData) {
                    displayObject.anchorOffsetX = cacheDisplayData.anchorOffsetX / cacheDisplayData.width * displayObject.width;
                    displayObject.anchorOffsetY = cacheDisplayData.anchorOffsetY / cacheDisplayData.height * displayObject.height;
                    displayObject.x = cacheDisplayData.x;
                    displayObject.y = cacheDisplayData.y;
                }
            }
            else {
                var oldDisplayObject = slot.getDisplay();
                if (oldDisplayObject) {
                    displayObject.anchorOffsetX = oldDisplayObject.anchorOffsetX / oldDisplayObject.width * displayObject.width;
                    displayObject.anchorOffsetY = oldDisplayObject.anchorOffsetY / oldDisplayObject.height * displayObject.height;
                    displayObject.x = oldDisplayObject.x;
                    displayObject.y = oldDisplayObject.y;
                }
            }
        }
        slot.setDisplay(displayObject);
    };
    /**
     * ??????????????????
     */
    DragonBonesArmature.prototype.getSlots = function () {
        return this._armature["_slots"];
    };
    /**
     * ??????????????????????????????????????????
     */
    DragonBonesArmature.prototype.getAllSlotDisplayData = function () {
        var slots = this.getSlots();
        var result = {};
        for (var i = 0, len = slots.length; i < len; i++) {
            var slot = slots[i];
            var displayObject = slot.getDisplay();
            result[slot.name] = {
                x: displayObject.x,
                y: displayObject.y,
                width: displayObject.width,
                height: displayObject.height,
                anchorOffsetX: displayObject.anchorOffsetX,
                anchorOffsetY: displayObject.anchorOffsetY,
            };
        }
        return result;
    };
    /**
     * ??????????????????????????????????????????
     */
    DragonBonesArmature.prototype.cacheAllSlotDisplayData = function () {
        this._cacheAllSlotDisplayData = this.getAllSlotDisplayData();
    };
    return DragonBonesArmature;
}(egret.DisplayObjectContainer));
__reflect(DragonBonesArmature.prototype, "DragonBonesArmature");
/**
 * Created by yangsong on 2014/6/16.
 * StarlingSwf?????????
 */
var StarlingSwfFactory = (function (_super) {
    __extends(StarlingSwfFactory, _super);
    /**
     * ????????????
     */
    function StarlingSwfFactory() {
        var _this = _super.call(this) || this;
        _this.swfAssetsManager = new starlingswf.SwfAssetManager();
        _this.swfAssetsNames = new Array();
        _this.swfAssets = new Array();
        _this.swfData = {};
        return _this;
    }
    /**
     * ????????????swf
     * @param name ????????????
     * @param swfData swf????????????
     * @param spriteSheep ??????????????????
     */
    StarlingSwfFactory.prototype.addSwf = function (name, swfData, spriteSheep) {
        if (this.swfAssetsNames.indexOf(name) != -1)
            return;
        if (swfData == null || spriteSheep == null) {
            Log.debug("SWF????????????:" + name);
            return;
        }
        this.swfAssetsManager.addSpriteSheet(name, spriteSheep);
        var swf = new starlingswf.Swf(swfData, this.swfAssetsManager, 24);
        swf.name = name;
        StarlingSwfUtils.addSwf(swf);
        this.swfAssetsNames.push(name);
        this.swfAssets.push(swf);
    };
    /**
     * ??????????????????swf
     * @param arr
     */
    StarlingSwfFactory.prototype.stopSwfs = function (arr) {
        for (var i = 0, len = arr.length; i < len; i++) {
            var swf = StarlingSwfUtils.getSwf(arr[i]);
            if (swf) {
                swf.swfUpdateManager.stop();
            }
        }
    };
    /**
     * ??????????????????swf
     * @param arr
     */
    StarlingSwfFactory.prototype.playSwfs = function (arr) {
        for (var i = 0, len = arr.length; i < len; i++) {
            var swf = StarlingSwfUtils.getSwf(arr[i]);
            if (swf) {
                swf.swfUpdateManager.play();
            }
        }
    };
    /**
     * ????????????swf
     */
    StarlingSwfFactory.prototype.clearSwfs = function () {
        while (this.swfAssets.length) {
            StarlingSwfUtils.removeSwf(this.swfAssets.pop());
        }
        while (this.swfAssetsNames.length) {
            this.swfAssetsNames.pop();
        }
        this.swfAssetsManager = new starlingswf.SwfAssetManager();
    };
    /**
     * ??????
     */
    StarlingSwfFactory.prototype.clear = function () {
        this.clearSwfs();
    };
    /**
     * ????????????StarlingSwfMovieClip
     * @param name mc?????????
     * @returns {StarlingSwfMovieClip}
     */
    StarlingSwfFactory.prototype.makeMc = function (name) {
        var mc = StarlingSwfUtils.createMovie("mc_" + name, null, StarlingSwfMovieClip);
        if (mc == null) {
            Log.debug("SWF????????????: " + name);
        }
        return mc;
    };
    /**
     * ????????????Bitmap
     * @param name ???????????????
     * @returns {egret.Bitmap}
     */
    StarlingSwfFactory.prototype.makeImage = function (name) {
        return StarlingSwfUtils.createImage("img_" + name);
    };
    /**
     * ????????????
     * @param name ????????????
     * @returns {egret.Texture}
     */
    StarlingSwfFactory.prototype.getTexture = function (name) {
        return StarlingSwfUtils.getTexture("img_" + name);
    };
    return StarlingSwfFactory;
}(SingtonClass));
__reflect(StarlingSwfFactory.prototype, "StarlingSwfFactory");
/**
 * Created by yangsong on 2014/6/16.
 * ?????????SwfMovieClip???????????????????????????
 */
var StarlingSwfMovieClip = (function (_super) {
    __extends(StarlingSwfMovieClip, _super);
    /**
     * ????????????
     * @param frames
     * @param labels
     * @param displayObjects
     * @param ownerSwf
     */
    function StarlingSwfMovieClip(frames, labels, displayObjects, ownerSwf) {
        var _this = _super.call(this, frames, labels, displayObjects, ownerSwf) || this;
        _this.frameActions = {};
        _this.preFrame = -1;
        _this.addEventListener(egret.Event.REMOVED_FROM_STAGE, _this.onRemove, _this);
        return _this;
    }
    /**
     * ????????????????????????
     */
    StarlingSwfMovieClip.prototype.onRemove = function () {
        this.stop();
    };
    /**
     * ???????????????
     * @param $frame ?????????
     * @param $action ????????????
     * @param $actionObj ????????????????????????
     * @param $param ????????????????????????
     */
    StarlingSwfMovieClip.prototype.setFrameAction = function ($frame, $action, $actionObj, $param) {
        if ($param === void 0) { $param = null; }
        this.frameActions[$frame] = [$action, $actionObj, $param];
    };
    /**
     * ??????mc???????????????????????????
     * @param $action ????????????
     * @param $actionObj ????????????????????????
     */
    StarlingSwfMovieClip.prototype.setCompleteAction = function ($action, $actionObj) {
        this.complateFunc = $action;
        this.complateObj = $actionObj;
        this.addEventListener(egret.Event.COMPLETE, this.onPlayend, this);
    };
    /**
     * ????????????????????????
     */
    StarlingSwfMovieClip.prototype.onPlayend = function () {
        if (this.complateFunc) {
            this.complateFunc.call(this.complateObj);
        }
    };
    /**
     * ??????
     * @param frame
     */
    StarlingSwfMovieClip.prototype.goToPlay = function (frame) {
        this.preFrame = -1;
        this.currFrameName = frame;
        this.gotoAndPlay(frame);
    };
    /**
     * ??????setCurrentFrame????????????????????????
     */
    StarlingSwfMovieClip.prototype.setCurrentFrame = function (frame) {
        _super.prototype.setCurrentFrame.call(this, frame);
        var currFrame = this.getCurrentFrame();
        if (this.preFrame != currFrame) {
            this.preFrame = currFrame;
            if (this.frameActions && this.frameActions[currFrame]) {
                var arr = this.frameActions[currFrame];
                if (arr[2])
                    arr[0].call(arr[1], arr[2]);
                else
                    arr[0].call(arr[1]);
            }
        }
    };
    /**
     * ??????
     */
    StarlingSwfMovieClip.prototype.dispose = function () {
        this.stop();
        this.removeEventListener(egret.Event.COMPLETE, this.onPlayend, this);
        this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemove, this);
        App.DisplayUtils.removeFromParent(this);
        this.complateFunc = null;
        this.complateObj = null;
        this.frameActions = null;
    };
    return StarlingSwfMovieClip;
}(starlingswf.SwfMovieClip));
__reflect(StarlingSwfMovieClip.prototype, "StarlingSwfMovieClip");
/**
 * Created by lcj on 14-6-18.
 * StarlingSwf?????????
 */
var StarlingSwfUtils = (function () {
    function StarlingSwfUtils() {
    }
    /**
     * ????????????????????????swf
     * @param swf
     */
    StarlingSwfUtils.addSwf = function (swf) {
        StarlingSwfUtils.swfList.push(swf);
    };
    /**
     * ????????????????????????swf
     * @param swf
     */
    StarlingSwfUtils.removeSwf = function (swf) {
        var index = StarlingSwfUtils.swfList.indexOf(swf);
        if (index != -1)
            StarlingSwfUtils.swfList.splice(index, 1);
    };
    /**
     * ??????Sprite
     * @param name Sprite??????
     * @param data
     * @param sprData
     * @returns {*}
     */
    StarlingSwfUtils.createSprite = function (name, data, sprData) {
        if (data === void 0) { data = null; }
        if (sprData === void 0) { sprData = null; }
        var l = StarlingSwfUtils.swfList.length;
        for (var i = 0; i < l; i++) {
            var swf = StarlingSwfUtils.swfList[i];
            if (swf.hasSprite(name)) {
                return swf.createSprite(name, data, sprData);
            }
        }
        return null;
    };
    /**
     * ??????Bitmap
     * @param name Bitmap??????
     * @param data
     * @returns {*}
     */
    StarlingSwfUtils.createImage = function (name, data) {
        if (data === void 0) { data = null; }
        var l = StarlingSwfUtils.swfList.length;
        for (var i = 0; i < l; i++) {
            var swf = StarlingSwfUtils.swfList[i];
            if (swf.hasImage(name)) {
                return swf.createImage(name, data);
            }
        }
        return null;
    };
    /**
     * ????????????
     * @param name ????????????
     * @returns {*}
     */
    StarlingSwfUtils.getTexture = function (name) {
        var l = StarlingSwfUtils.swfList.length;
        for (var i = 0; i < l; i++) {
            var swf = StarlingSwfUtils.swfList[i];
            if (swf.hasImage(name)) {
                return swf.getTexture(name);
            }
        }
        return null;
    };
    /**
     * ????????????SwfMovieClip
     * @param name SwfMovieClip??????
     * @param data
     * @param cls
     * @returns {*}
     */
    StarlingSwfUtils.createMovie = function (name, data, cls) {
        if (data === void 0) { data = null; }
        if (cls === void 0) { cls = null; }
        var l = StarlingSwfUtils.swfList.length;
        for (var i = 0; i < l; i++) {
            var swf = StarlingSwfUtils.swfList[i];
            if (swf.hasMovieClip(name)) {
                return swf.createMovie(name, data, cls);
            }
        }
        return null;
    };
    /**
     * ???????????????????????????
     * @param name ????????????
     * @param data
     * @returns {*}
     */
    StarlingSwfUtils.createS9Image = function (name, data) {
        if (data === void 0) { data = null; }
        var l = StarlingSwfUtils.swfList.length;
        for (var i = 0; i < l; i++) {
            var swf = StarlingSwfUtils.swfList[i];
            if (swf.hasS9Image(name)) {
                return swf.createS9Image(name, data);
            }
        }
        return null;
    };
    /**
     * ??????ShapeImage
     * @param name ShapeImage??????
     * @param data
     * @returns {*}
     */
    StarlingSwfUtils.createShapeImage = function (name, data) {
        if (data === void 0) { data = null; }
        var l = StarlingSwfUtils.swfList.length;
        for (var i = 0; i < l; i++) {
            var swf = StarlingSwfUtils.swfList[i];
            if (swf.hasShapeImage(name)) {
                return swf.createShapeImage(name, data);
            }
        }
        return null;
    };
    /**
     * ?????????????????????Swf
     * @param name ??????
     * @returns {*}
     */
    StarlingSwfUtils.getSwf = function (name) {
        var l = StarlingSwfUtils.swfList.length;
        for (var i = 0; i < l; i++) {
            var swf = StarlingSwfUtils.swfList[i];
            if (swf.name == name) {
                return swf;
            }
        }
        return null;
    };
    /**
     * ??????????????????mc?????????Button
     * @param btn
     * @param onClick
     * @param thisObj
     */
    StarlingSwfUtils.fixButton = function (btn, onClick, thisObj) {
        if (StarlingSwfUtils.firstAddBtn) {
            StarlingSwfUtils.firstAddBtn = false;
            egret.MainContext.instance.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
            egret.MainContext.instance.stage.addEventListener(egret.Event.LEAVE_STAGE, this.onTouchEnd, this);
        }
        var data = new StarlingSwfButtonData();
        data.btn = btn;
        data.onClick = onClick;
        data.thisObj = thisObj;
        StarlingSwfUtils.btnList.push(data);
        btn.touchEnabled = true;
        btn.gotoAndStop(0);
        btn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBtnTouchBegin, btn);
    };
    StarlingSwfUtils.onBtnTouchBegin = function (event) {
        var btn = event.currentTarget;
        var l = StarlingSwfUtils.btnList.length;
        for (var i = 0; i < l; i++) {
            var data = StarlingSwfUtils.btnList[i];
            if (data.btn == btn) {
                data.touchStageX = event.stageX;
                data.touchStageY = event.stageY;
                btn.gotoAndStop(1);
                break;
            }
        }
    };
    StarlingSwfUtils.onTouchEnd = function (event) {
        var l = StarlingSwfUtils.btnList.length;
        for (var i = 0; i < l; i++) {
            var data = StarlingSwfUtils.btnList[i];
            if (data.touchStageX != -1) {
                if (event.stageX && Math.abs(data.touchStageX - event.stageX) < 10 && Math.abs(data.touchStageY - event.stageY) < 10) {
                    if (data.onClick) {
                        data.onClick.call(data.thisObj, event);
                    }
                }
                data.touchStageX = -1;
                data.touchStageY = -1;
                data.btn.gotoAndStop(0);
            }
        }
    };
    StarlingSwfUtils.swfList = [];
    StarlingSwfUtils.btnList = [];
    StarlingSwfUtils.firstAddBtn = true;
    return StarlingSwfUtils;
}());
__reflect(StarlingSwfUtils.prototype, "StarlingSwfUtils");
var StarlingSwfButtonData = (function () {
    function StarlingSwfButtonData() {
        this.touchStageX = -1;
        this.touchStageY = -1;
    }
    return StarlingSwfButtonData;
}());
__reflect(StarlingSwfButtonData.prototype, "StarlingSwfButtonData");
/**
 * Created by yangsong on 15-11-4.
 */
var AllAsyncExecutor = (function () {
    /**
     * ????????????
     */
    function AllAsyncExecutor() {
        this._functions = new Array();
        this._complateNum = 0;
    }
    /**
     * ????????????????????????????????????
     * @param callBack ?????????????????????????????????
     * @param callBackTarget ?????????????????????????????????????????????
     */
    AllAsyncExecutor.prototype.setCallBack = function (callBack, callBackTarget) {
        this._callBack = callBack;
        this._callBackTarget = callBackTarget;
    };
    /**
     * ?????????????????????????????????
     * @param $func ??????
     * @param $thisObj ??????????????????
     */
    AllAsyncExecutor.prototype.regist = function ($func, $thisObj) {
        this._functions.push([$func, $thisObj]);
    };
    /**
     * ????????????
     */
    AllAsyncExecutor.prototype.start = function () {
        App.ArrayUtils.forEach(this._functions, function (arr) {
            arr[0].call(arr[1]);
        }, this);
    };
    /**
     * ????????????
     */
    AllAsyncExecutor.prototype.complate = function () {
        if (!this._functions) {
            return;
        }
        this._complateNum++;
        if (this._complateNum == this._functions.length) {
            if (this._callBack) {
                this._callBack.call(this._callBackTarget);
            }
            this._callBack = null;
            this._callBackTarget = null;
            this._functions = null;
        }
    };
    return AllAsyncExecutor;
}());
__reflect(AllAsyncExecutor.prototype, "AllAsyncExecutor");
/**
 * Created by Saco on 2015/9/16.
 */
var AnchorUtils = (function (_super) {
    __extends(AnchorUtils, _super);
    function AnchorUtils() {
        var _this = _super.call(this) || this;
        _this.init();
        return _this;
    }
    AnchorUtils.prototype.init = function () {
        this._propertyChange = Object.create(null);
        this._anchorChange = Object.create(null);
        this.injectAnchor();
    };
    AnchorUtils.prototype.clear = function (target) {
        delete this._propertyChange[target.hashCode];
        delete this._anchorChange[target.hashCode];
    };
    AnchorUtils.prototype.setAnchorX = function (target, value) {
        target["anchorX"] = value;
    };
    AnchorUtils.prototype.setAnchorY = function (target, value) {
        target["anchorY"] = value;
    };
    AnchorUtils.prototype.setAnchor = function (target, value) {
        target["anchorX"] = target["anchorY"] = value;
    };
    AnchorUtils.prototype.getAnchor = function (target) {
        if (target["anchorX"] != target["anchorY"]) {
            Log.debug("target's anchorX != anchorY");
        }
        return target["anchorX"] || 0;
    };
    AnchorUtils.prototype.getAnchorY = function (target) {
        return target["anchorY"] || 0;
    };
    AnchorUtils.prototype.getAnchorX = function (target) {
        return target["anchorX"] || 0;
    };
    AnchorUtils.prototype.injectAnchor = function () {
        var self = this;
        Object.defineProperty(egret.DisplayObject.prototype, "width", {
            get: function () {
                return this.$getWidth();
            },
            set: function (value) {
                var _this = this;
                this.$setWidth(value);
                self._propertyChange[this.hashCode] = true;
                egret.callLater(function () {
                    self.changeAnchor(_this);
                }, this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(egret.DisplayObject.prototype, "height", {
            get: function () {
                return this.$getHeight();
            },
            set: function (value) {
                var _this = this;
                this.$setHeight(value);
                self._propertyChange[this.hashCode] = true;
                egret.callLater(function () {
                    self.changeAnchor(_this);
                }, this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(egret.DisplayObject.prototype, "anchorX", {
            get: function () {
                return this._anchorX;
            },
            set: function (value) {
                var _this = this;
                this._anchorX = value;
                self._propertyChange[this.hashCode] = true;
                self._anchorChange[this.hashCode] = true;
                egret.callLater(function () {
                    self.changeAnchor(_this);
                }, this);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(egret.DisplayObject.prototype, "anchorY", {
            get: function () {
                return this._anchorY;
            },
            set: function (value) {
                var _this = this;
                this._anchorY = value;
                self._propertyChange[this.hashCode] = true;
                self._anchorChange[this.hashCode] = true;
                egret.callLater(function () {
                    self.changeAnchor(_this);
                }, this);
            },
            enumerable: true,
            configurable: true
        });
    };
    AnchorUtils.prototype.changeAnchor = function (tar) {
        if (this._propertyChange[tar.hashCode] && this._anchorChange[tar.hashCode]) {
            if (tar._anchorX) {
                tar.anchorOffsetX = tar._anchorX * tar.width;
            }
            if (tar._anchorY) {
                tar.anchorOffsetY = tar._anchorY * tar.height;
            }
            delete this._propertyChange[tar.hashCode];
        }
    };
    return AnchorUtils;
}(SingtonClass));
__reflect(AnchorUtils.prototype, "AnchorUtils");
/**
 * Created by egret on 15-8-7.
 */
var ArrayUtils = (function (_super) {
    __extends(ArrayUtils, _super);
    function ArrayUtils() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * ????????????
     * @param arr
     * @param func
     */
    ArrayUtils.prototype.forEach = function (arr, func, funcObj) {
        for (var i = 0, len = arr.length; i < len; i++) {
            func.apply(funcObj, [arr[i]]);
        }
    };
    return ArrayUtils;
}(SingtonClass));
__reflect(ArrayUtils.prototype, "ArrayUtils");
/**
 * Created by yangsong on 15-8-19.
 * ??????????????????
 */
var AverageUtils = (function () {
    /**
     * ????????????
     * @param $maxNum ????????????????????????
     */
    function AverageUtils($maxNum) {
        if ($maxNum === void 0) { $maxNum = 10; }
        this.nums = [];
        this.numsLen = 0;
        this.numSum = 0;
        this.maxNum = $maxNum;
    }
    /**
     * ???????????????
     * @param value
     */
    AverageUtils.prototype.push = function (value) {
        if (this.numsLen > this.maxNum) {
            this.numsLen--;
            this.numSum -= this.nums.shift();
        }
        this.nums.push(value);
        this.numSum += value;
        this.numsLen++;
    };
    /**
     * ???????????????
     * @returns {number}
     */
    AverageUtils.prototype.getValue = function () {
        return this.numSum / this.numsLen;
    };
    /**
     * ??????
     */
    AverageUtils.prototype.clear = function () {
        this.nums.splice(0);
        this.numsLen = 0;
        this.numSum = 0;
    };
    return AverageUtils;
}());
__reflect(AverageUtils.prototype, "AverageUtils");
/**
 * Created by yangsong on 15-1-12.
 * ???????????????
 */
var CommonUtils = (function (_super) {
    __extends(CommonUtils, _super);
    function CommonUtils() {
        var _this = _super.call(this) || this;
        /**
         * ???????????????
         * @param label
         * @param num
         */
        _this.labelIsOverLenght = function (label, num) {
            var str = null;
            if (num < 100000) {
                str = num;
            }
            else if (num < 1000000) {
                str = Math.floor(num / 1000 / 10).toString() + "???";
            }
            else {
                str = Math.floor(num / 10000).toString() + "???";
            }
            label.text = str;
        };
        return _this;
    }
    /**
     * ?????????????????????
     * @param lable      ??????
     * @param color      ???????????????????????????
     * @param width      ???????????????
     */
    CommonUtils.prototype.addLableStrokeColor = function (lable, color, width) {
        lable.strokeColor = color;
        lable.stroke = width;
    };
    /**
     * ????????????
     * @param _data
     */
    CommonUtils.prototype.copyDataHandler = function (obj) {
        var newObj;
        if (obj instanceof Array) {
            newObj = [];
        }
        else if (obj instanceof Object) {
            newObj = {};
        }
        else {
            return obj;
        }
        var keys = Object.keys(obj);
        for (var i = 0, len = keys.length; i < len; i++) {
            var key = keys[i];
            newObj[key] = this.copyDataHandler(obj[key]);
        }
        return newObj;
    };
    /**
     * ??????
     */
    CommonUtils.prototype.lock = function () {
        App.StageUtils.setTouchChildren(false);
    };
    /**
     * ??????
     */
    CommonUtils.prototype.unlock = function () {
        App.StageUtils.setTouchChildren(true);
    };
    /**
     * int64???number
     * @param obj
     * @returns {number}
     */
    CommonUtils.prototype.int64ToNumber = function (obj) {
        return parseInt(obj.toString());
    };
    return CommonUtils;
}(SingtonClass));
__reflect(CommonUtils.prototype, "CommonUtils");
/**
 * Created by yangsong on 2014/11/22.
 * Date?????????
 */
var DateUtils = (function (_super) {
    __extends(DateUtils, _super);
    function DateUtils() {
        return _super.call(this) || this;
    }
    /**
     * ??????????????????????????????
     * @param second ??????
     * @param type 1:00:00:00   2:yyyy-mm-dd h:m:s    3:00:00(???:???)   4:xx?????????xx????????????xx?????????    6:00:00(???:???)
     * @return
     *
     */
    DateUtils.prototype.getFormatBySecond = function (second, type) {
        if (type === void 0) { type = 1; }
        var str = "";
        switch (type) {
            case 1:
                str = this.getFormatBySecond1(second);
                break;
            case 2:
                str = this.getFormatBySecond2(second);
                break;
            case 3:
                str = this.getFormatBySecond3(second);
                break;
            case 4:
                str = this.getFormatBySecond4(second);
                break;
            case 5:
                str = this.getFormatBySecond5(second);
                break;
            case 6:
                str = this.getFormatBySecond6(second);
                break;
        }
        return str;
    };
    //1: 00:00:00
    DateUtils.prototype.getFormatBySecond1 = function (t) {
        if (t === void 0) { t = 0; }
        var hourst = Math.floor(t / 3600);
        var hours;
        if (hourst == 0) {
            hours = "00";
        }
        else {
            if (hourst < 10)
                hours = "0" + hourst;
            else
                hours = "" + hourst;
        }
        var minst = Math.floor((t - hourst * 3600) / 60);
        var secondt = Math.floor((t - hourst * 3600) % 60);
        var mins;
        var sens;
        if (minst == 0) {
            mins = "00";
        }
        else if (minst < 10) {
            mins = "0" + minst;
        }
        else {
            mins = "" + minst;
        }
        if (secondt == 0) {
            sens = "00";
        }
        else if (secondt < 10) {
            sens = "0" + secondt;
        }
        else {
            sens = "" + secondt;
        }
        return hours + ":" + mins + ":" + sens;
    };
    //3:00:00(???:???)
    DateUtils.prototype.getFormatBySecond3 = function (t) {
        if (t === void 0) { t = 0; }
        var hourst = Math.floor(t / 3600);
        var minst = Math.floor((t - hourst * 3600) / 60);
        var secondt = Math.floor((t - hourst * 3600) % 60);
        var mins;
        var sens;
        if (minst == 0) {
            mins = "00";
        }
        else if (minst < 10) {
            mins = "0" + minst;
        }
        else {
            mins = "" + minst;
        }
        if (secondt == 0) {
            sens = "00";
        }
        else if (secondt < 10) {
            sens = "0" + secondt;
        }
        else {
            sens = "" + secondt;
        }
        return mins + ":" + sens;
    };
    //2:yyyy-mm-dd h:m:s
    DateUtils.prototype.getFormatBySecond2 = function (time) {
        var date = new Date(time);
        var year = date.getFullYear();
        var month = date.getMonth() + 1; //??????????????????0-11???
        var day = date.getDate();
        var hours = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        return year + "-" + month + "-" + day + " " + hours + ":" + minute + ":" + second;
    };
    //4:xx?????????xx????????????xx?????????
    DateUtils.prototype.getFormatBySecond4 = function (time) {
        var t = Math.floor(time / 3600);
        if (t > 0) {
            if (t > 24) {
                return Math.floor(t / 24) + "??????";
            }
            else {
                return t + "?????????";
            }
        }
        else {
            return Math.floor(time / 60) + "?????????";
        }
    };
    DateUtils.prototype.getFormatBySecond5 = function (time) {
        //????????????????????????????????????
        var oneDay = 3600 * 24;
        var oneHourst = 3600;
        var oneMinst = 60;
        var days = Math.floor(time / oneDay);
        var hourst = Math.floor(time % oneDay / oneHourst);
        var minst = Math.floor((time - hourst * oneHourst) / oneMinst); //Math.floor(time % oneDay % oneHourst / oneMinst);
        var secondt = Math.floor((time - hourst * oneHourst) % oneMinst); //time;
        var dayss = "";
        var hourss = "";
        var minss = "";
        var secss = "";
        if (time > 0) {
            //???
            if (days == 0) {
                dayss = "";
                //??????
                if (hourst == 0) {
                    hourss = "";
                    //???
                    if (minst == 0) {
                        minss = "";
                        if (secondt == 0) {
                            secss = "";
                        }
                        else if (secondt < 10) {
                            secss = "0" + secondt + "???";
                        }
                        else {
                            secss = "" + secondt + "???";
                        }
                        return secss;
                    }
                    else {
                        minss = "" + minst + "???";
                        if (secondt == 0) {
                            secss = "";
                        }
                        else if (secondt < 10) {
                            secss = "0" + secondt + "???";
                        }
                        else {
                            secss = "" + secondt + "???";
                        }
                    }
                    return minss + secss;
                }
                else {
                    hourss = hourst + "??????";
                    if (minst == 0) {
                        minss = "";
                        if (secondt == 0) {
                            secss = "";
                        }
                        else if (secondt < 10) {
                            secss = "0" + secondt + "???";
                        }
                        else {
                            secss = "" + secondt + "???";
                        }
                        return secss;
                    }
                    else if (minst < 10) {
                        minss = "0" + minst + "???";
                    }
                    else {
                        minss = "" + minst + "???";
                    }
                    return hourss + minss;
                }
            }
            else {
                dayss = days + "???";
                if (hourst == 0) {
                    hourss = "";
                }
                else {
                    if (hourst < 10)
                        hourss = "0" + hourst + "??????";
                    else
                        hourss = "" + hourst + "??????";
                    ;
                }
                return dayss + hourss;
            }
        }
        return "";
    };
    //6:00:00(???:???) 
    DateUtils.prototype.getFormatBySecond6 = function (t) {
        if (t === void 0) { t = 0; }
        var hourst = Math.floor(t / 3600);
        var minst = Math.floor((t - hourst * 3600) / 60);
        var houers;
        var mins;
        if (hourst == 0) {
            houers = "00";
        }
        else if (hourst < 10) {
            houers = "0" + hourst;
        }
        else {
            houers = "" + hourst;
        }
        if (minst == 0) {
            mins = "00";
        }
        else if (minst < 10) {
            mins = "0" + minst;
        }
        else {
            mins = "" + minst;
        }
        return houers + ":" + mins;
    };
    /**
     * ?????????????????????
     * ["?????????","?????????","?????????","?????????","?????????","?????????","?????????"]
     */
    DateUtils.prototype.getDay = function (timestamp) {
        var date = new Date(timestamp);
        return date.getDay();
    };
    /**
     * ????????????????????????????????????
     */
    DateUtils.prototype.isSameDate = function (timestamp1, timestamp2) {
        var date1 = new Date(timestamp1);
        var date2 = new Date(timestamp2);
        return date1.getFullYear() == date2.getFullYear()
            && date1.getMonth() == date2.getMonth()
            && date1.getDate() == date2.getDate();
    };
    /**
     * ???????????????
     */
    DateUtils.prototype.format = function (d, fmt) {
        if (fmt === void 0) { fmt = "yyyy-MM-dd hh:mm:ss"; }
        var o = {
            "M+": d.getMonth() + 1,
            "d+": d.getDate(),
            "h+": d.getHours(),
            "m+": d.getMinutes(),
            "s+": d.getSeconds(),
            "q+": Math.floor((d.getMonth() + 3) / 3),
            "S": d.getMilliseconds() //millisecond
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] :
                    ("00" + o[k]).substr(("" + o[k]).length));
        return fmt;
    };
    /**
     * ??????????????????????????????
     */
    DateUtils.prototype.dateDifference = function (timestamp1, timestamp2) {
        var d_value = Math.abs(timestamp2 - timestamp1);
        return Math.ceil(d_value / (24 * 60 * 60 * 1000));
    };
    return DateUtils;
}(SingtonClass));
__reflect(DateUtils.prototype, "DateUtils");
/**
 * Created by yangsong on 2014/11/23.
 * Debug????????????
 */
var DebugUtils = (function (_super) {
    __extends(DebugUtils, _super);
    function DebugUtils() {
        var _this = _super.call(this) || this;
        _this._threshold = 3;
        _this._startTimes = {};
        return _this;
    }
    /**
     * ????????????????????????
     * @param flag
     *
     */
    DebugUtils.prototype.isOpen = function (flag) {
        this._isOpen = flag;
    };
    Object.defineProperty(DebugUtils.prototype, "isDebug", {
        /**
         * ?????????????????????
         * @returns {boolean}
         */
        get: function () {
            return this._isOpen;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * ??????
     * @param key ??????
     * @param minTime ????????????
     *
     */
    DebugUtils.prototype.start = function (key) {
        if (!this._isOpen) {
            return;
        }
        this._startTimes[key] = egret.getTimer();
    };
    /**
     * ??????
     *
     */
    DebugUtils.prototype.stop = function (key) {
        if (!this._isOpen) {
            return 0;
        }
        if (!this._startTimes[key]) {
            return 0;
        }
        var cha = egret.getTimer() - this._startTimes[key];
        if (cha > this._threshold) {
            Log.debug(key + ": " + cha);
        }
        return cha;
    };
    /**
     * ????????????????????????
     * @param value
     */
    DebugUtils.prototype.setThreshold = function (value) {
        this._threshold = value;
    };
    return DebugUtils;
}(SingtonClass));
__reflect(DebugUtils.prototype, "DebugUtils");
/**
 * Created by Saco on 2014/8/2.
 */
var DelayOptManager = (function (_super) {
    __extends(DelayOptManager, _super);
    function DelayOptManager() {
        var _this = _super.call(this) || this;
        //???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
        _this.TIME_THRESHOLD = 2;
        _this._delayOpts = [];
        App.TimerManager.doFrame(1, 0, _this.runCachedFun, _this);
        return _this;
    }
    DelayOptManager.prototype.addDelayOptFunction = function (thisObj, fun, funPara, callBack, para) {
        this._delayOpts.push({ "fun": fun, "funPara": funPara, "thisObj": thisObj, "callBack": callBack, "para": para });
    };
    DelayOptManager.prototype.clear = function () {
        this._delayOpts.length = 0;
    };
    DelayOptManager.prototype.stop = function () {
        App.TimerManager.remove(this.runCachedFun, this);
    };
    DelayOptManager.prototype.runCachedFun = function (f) {
        if (this._delayOpts.length == 0) {
            return;
        }
        var timeFlag = egret.getTimer();
        var funObj;
        while (this._delayOpts.length) {
            funObj = this._delayOpts.shift();
            if (funObj.funPara)
                funObj.fun.call(funObj.thisObj, funObj.funPara);
            else
                funObj.fun.call(funObj.thisObj);
            if (funObj.callBack) {
                if (funObj.para != undefined)
                    funObj.callBack.call(funObj.thisObj, funObj.para);
                else
                    funObj.callBack();
            }
            if (egret.getTimer() - timeFlag > this.TIME_THRESHOLD)
                break;
        }
    };
    return DelayOptManager;
}(SingtonClass));
__reflect(DelayOptManager.prototype, "DelayOptManager");
/**
 * Created by yangsong on 15-1-20.
 */
var DeviceUtils = (function (_super) {
    __extends(DeviceUtils, _super);
    /**
     * ????????????
     */
    function DeviceUtils() {
        return _super.call(this) || this;
    }
    Object.defineProperty(DeviceUtils.prototype, "IsHtml5", {
        /**
         * ????????????Html5??????
         * @returns {boolean}
         * @constructor
         */
        get: function () {
            return egret.Capabilities.runtimeType == egret.RuntimeType.WEB;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeviceUtils.prototype, "IsNative", {
        /**
         * ???????????????Native??????
         * @returns {boolean}
         * @constructor
         */
        get: function () {
            return egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeviceUtils.prototype, "IsWxGame", {
        /**
         * ????????????????????????????????????
         */
        get: function () {
            return egret.Capabilities.runtimeType == egret.RuntimeType.WXGAME;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeviceUtils.prototype, "IsMobile", {
        /**
         * ?????????????????????
         * @returns {boolean}
         * @constructor
         */
        get: function () {
            return egret.Capabilities.isMobile;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeviceUtils.prototype, "IsPC", {
        /**
         * ????????????PC???
         * @returns {boolean}
         * @constructor
         */
        get: function () {
            return !egret.Capabilities.isMobile;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeviceUtils.prototype, "IsQQBrowser", {
        /**
         * ?????????QQ?????????
         * @returns {boolean}
         * @constructor
         */
        get: function () {
            return this.IsHtml5 && navigator.userAgent.indexOf('MQQBrowser') != -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeviceUtils.prototype, "IsIEBrowser", {
        /**
         * ?????????IE?????????
         * @returns {boolean}
         * @constructor
         */
        get: function () {
            return this.IsHtml5 && navigator.userAgent.indexOf("MSIE") != -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeviceUtils.prototype, "IsFirefoxBrowser", {
        /**
         * ?????????Firefox?????????
         * @returns {boolean}
         * @constructor
         */
        get: function () {
            return this.IsHtml5 && navigator.userAgent.indexOf("Firefox") != -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeviceUtils.prototype, "IsChromeBrowser", {
        /**
         * ?????????Chrome?????????
         * @returns {boolean}
         * @constructor
         */
        get: function () {
            return this.IsHtml5 && navigator.userAgent.indexOf("Chrome") != -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeviceUtils.prototype, "IsSafariBrowser", {
        /**
         * ?????????Safari?????????
         * @returns {boolean}
         * @constructor
         */
        get: function () {
            return this.IsHtml5 && navigator.userAgent.indexOf("Safari") != -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeviceUtils.prototype, "IsOperaBrowser", {
        /**
         * ?????????Opera?????????
         * @returns {boolean}
         * @constructor
         */
        get: function () {
            return this.IsHtml5 && navigator.userAgent.indexOf("Opera") != -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeviceUtils.prototype, "DeviceOs", {
        /**
         * ?????????????????? ??????iOS/Android/WP7
         */
        get: function () {
            var os = "";
            var ua;
            ua = this.IsHtml5 ? navigator.userAgent.toLowerCase() : egret.Capabilities.os.toLowerCase();
            if (ua.indexOf("ipod") != -1 || ua.indexOf("iphone") != -1 || ua.indexOf("ipad") != -1 || ua.indexOf("macintosh") != -1 || ua.indexOf("ios") != -1) {
                os = "ios";
            }
            else if (ua.indexOf("windows") != -1) {
                os = "windows";
            }
            else if (ua.indexOf("android") != -1) {
                os = "android";
            }
            else if (ua.indexOf("symbian") != -1) {
                os = "symbian";
            }
            else if (ua.indexOf("linux") != -1) {
                os = "linux";
            }
            return os;
        },
        enumerable: true,
        configurable: true
    });
    DeviceUtils.OS_IOS = "ios";
    DeviceUtils.OS_Android = "android";
    return DeviceUtils;
}(SingtonClass));
__reflect(DeviceUtils.prototype, "DeviceUtils");
/**
 * Created by yangsong on 2014/11/24.
 * ?????????????????????
 */
var DisplayUtils = (function (_super) {
    __extends(DisplayUtils, _super);
    /**
     * ????????????
     */
    function DisplayUtils() {
        return _super.call(this) || this;
    }
    /**
     * ????????????Bitmap
     * @param resName resource.json????????????name
     * @returns {egret.Bitmap}
     */
    DisplayUtils.prototype.createBitmap = function (resName) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(resName);
        result.texture = texture;
        return result;
    };
    /**
     * ????????????textField
     * @param size;
     * @param color;
     * @param otherParam;
     */
    DisplayUtils.prototype.createTextField = function (size, color, otherParam) {
        if (size === void 0) { size = 12; }
        if (color === void 0) { color = 0xFFFFFF; }
        var txt = new egret.TextField();
        txt.size = size;
        txt.textColor = color;
        if (!otherParam)
            return txt;
        for (var key in otherParam) {
            txt[key] = otherParam[key];
        }
        return txt;
    };
    /**
     * ????????????????????????
     */
    DisplayUtils.prototype.createBitmapFont = function (fontName) {
        var bpFont = new egret.BitmapText();
        bpFont.font = RES.getRes(fontName);
        return bpFont;
    };
    /**
     * ????????????Gui?????????
     * @param resName
     * @returns {egret.Bitmap}
     */
    DisplayUtils.prototype.createEuiImage = function (resName) {
        var result = new eui.Image();
        var texture = RES.getRes(resName);
        result.source = texture;
        return result;
    };
    /**
     * ???????????????child
     * @param child
     */
    DisplayUtils.prototype.removeFromParent = function (child) {
        if (child.parent == null)
            return;
        child.parent.removeChild(child);
    };
    /**
     * ?????????????????????
     * @param child
     * @param parent
     */
    DisplayUtils.prototype.addChild = function (child, parent) {
        if (!child || !parent)
            return;
        parent.addChild(child);
    };
    return DisplayUtils;
}(SingtonClass));
__reflect(DisplayUtils.prototype, "DisplayUtils");
/**
 * Created by yangsong on 2014/12/3.
 * ?????????????????????
 */
var EffectUtils = (function (_super) {
    __extends(EffectUtils, _super);
    /**
     * ????????????
     */
    function EffectUtils() {
        return _super.call(this) || this;
    }
    /**
     * ??????mac??????????????????????????????
     * @param obj ???????????????????????????
     * @param initY ???????????????????????????Y??????????????????
     */
    EffectUtils.prototype.macIconShake = function (obj, initY) {
        //????????????[?????????????????????]????????????
        var arr = [
            [20, 300],
            [15, 300],
            [10, 300],
            [5, 300]
        ];
        var tween = egret.Tween.get(obj);
        for (var i = 0, len = arr.length; i < len; i++) {
            tween.to({ y: initY - arr[i][0] }, arr[i][1]);
            tween.to({ y: initY }, arr[i][1]);
        }
    };
    /**
     * ??????????????????
     * @param obj
     */
    EffectUtils.prototype.startScale = function (obj, scaleTime) {
        obj.scaleX = 1;
        obj.scaleY = 1;
        egret.Tween.get(obj)
            .to({ scaleX: 1.1, scaleY: 1.1 }, scaleTime)
            .to({ scaleX: 1.0, scaleY: 1.0 }, scaleTime)
            .to({ scaleX: 0.9, scaleY: 0.9 }, scaleTime)
            .to({ scaleX: 1.0, scaleY: 1.0 }, scaleTime)
            .call(this.startScale, this, [obj, scaleTime]);
    };
    /**
     * ??????????????????
     * @param obj
     */
    EffectUtils.prototype.stopScale = function (obj) {
        egret.Tween.removeTweens(obj);
    };
    /**
     * ????????????
     * @param obj
     */
    EffectUtils.prototype.startFlicker = function (obj, alphaTime, alpha_min) {
        if (alpha_min === void 0) { alpha_min = 0; }
        obj.alpha = 1;
        egret.Tween.get(obj).to({ "alpha": alpha_min }, alphaTime).to({ "alpha": 1 }, alphaTime).call(this.startFlicker, this, [obj, alphaTime]);
    };
    /**
     * ????????????
     * @param obj
     */
    EffectUtils.prototype.stopFlicker = function (obj) {
        egret.Tween.removeTweens(obj);
    };
    /**
     * ??????????????????
     * @param obj
     */
    EffectUtils.prototype.startShake = function (obj, shakeTime, shakeHeight) {
        if (shakeHeight === void 0) { shakeHeight = 20; }
        if (!obj["shakeStartY"]) {
            obj["shakeStartY"] = obj.y;
            obj["shakeEndY"] = obj.y + shakeHeight;
        }
        var startY = obj["shakeStartY"];
        var endY = obj["shakeEndY"];
        egret.Tween.get(obj).to({ "y": endY }, shakeTime).to({ "y": startY }, shakeTime).call(this.startShake, this, [obj, shakeTime]);
    };
    /**
     * ??????????????????
     * @param obj
     */
    EffectUtils.prototype.stopShake = function (obj) {
        if (!obj["shakeStartY"]) {
            return;
        }
        obj.y = obj["shakeStartY"];
        egret.Tween.removeTweens(obj);
        delete obj["shakeStartY"];
        delete obj["shakeEndY"];
    };
    /**
     * ????????????????????????????????????
     */
    EffectUtils.prototype.setDisplayObjectBlack = function (obj) {
        //??????????????????
        var colorMatrix = [
            1, 0, 0, 0, -255,
            0, 1, 0, 0, -255,
            0, 0, 1, 0, -255,
            0, 0, 0, 1, 0
        ];
        var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
        obj.filters = [colorFlilter];
    };
    /**
     * ????????????????????????????????????
     */
    EffectUtils.prototype.setDisplayObjectGray = function (obj) {
        //??????????????????
        var colorMatrix = [
            0.3, 0.6, 0, 0, 0,
            0.3, 0.6, 0, 0, 0,
            0.3, 0.6, 0, 0, 0,
            0, 0, 0, 1, 0
        ];
        var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
        obj.filters = [colorFlilter];
    };
    /**
     * ??????????????????
     * @param obj
     */
    EffectUtils.prototype.startWobble = function (obj, wobbleTime, wobbleRotation) {
        if (wobbleTime === void 0) { wobbleTime = 100; }
        if (wobbleRotation === void 0) { wobbleRotation = 20; }
        egret.Tween.get(obj)
            .to({ rotation: wobbleRotation }, wobbleTime, egret.Ease.bounceInOut)
            .to({ rotation: -wobbleRotation }, wobbleTime, egret.Ease.bounceInOut)
            .to({ rotation: wobbleRotation }, wobbleTime, egret.Ease.bounceInOut)
            .call(this.startWobble, this, [obj, wobbleTime]);
    };
    /**
     * ??????????????????
     * @param obj
     */
    EffectUtils.prototype.stopWobble = function (obj) {
        obj.rotation = 0;
        egret.Tween.removeTweens(obj);
    };
    /**
     * ??????????????????
     * @param obj
     */
    EffectUtils.prototype.startFlash = function (obj, flashColor, flashTime) {
        var glowFilter = obj["flashFilter"];
        if (!glowFilter) {
            var color = flashColor; /// ???????????????????????????????????????????????????
            var alpha = 1; /// ????????????????????????????????? color ??????????????????????????????????????? 0.0 ??? 1.0????????????0.8 ????????????????????? 80%???
            var blurX = 35; /// ?????????????????????????????? 0 ??? 255.0????????????
            var blurY = 35; /// ?????????????????????????????? 0 ??? 255.0????????????
            var strength = 2; /// ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? 0 ??? 255???????????????
            var quality = 3 /* HIGH */; /// ????????????????????????????????? BitmapFilterQuality ?????????????????????
            glowFilter = new egret.GlowFilter(color, alpha, blurX, blurY, strength, quality);
            obj.filters = [glowFilter];
            obj["flashFilter"] = glowFilter;
        }
        egret.Tween.get(glowFilter).to({ "alpha": 0 }, flashTime).to({ "alpha": 1 }, flashTime).call(this.startFlash, this, [obj, flashColor, flashTime]);
    };
    /**
     * ??????????????????
     * @param obj
     */
    EffectUtils.prototype.stopFlash = function (obj) {
        var glowFilter = obj["flashFilter"];
        if (glowFilter) {
            egret.Tween.removeTweens(glowFilter);
            obj.filters = null;
            delete obj["flashFilter"];
        }
    };
    return EffectUtils;
}(SingtonClass));
__reflect(EffectUtils.prototype, "EffectUtils");
/**
 * Created by yangsong on 15-1-23.
 * ???????????????
 */
var EgretExpandUtils = (function (_super) {
    __extends(EgretExpandUtils, _super);
    /**
     * ????????????
     */
    function EgretExpandUtils() {
        return _super.call(this) || this;
    }
    /**
     * ???????????????
     */
    EgretExpandUtils.prototype.init = function () {
    };
    return EgretExpandUtils;
}(SingtonClass));
__reflect(EgretExpandUtils.prototype, "EgretExpandUtils");
/**
 * Created by yangsong on 2014/11/23.
 * ???????????????
 */
var FrameDelay = (function () {
    /**
     * ????????????
     */
    function FrameDelay() {
    }
    /**
     * ????????????
     * @param delayFrame ????????????
     * @param func ?????????????????????
     * @param thisObj ????????????????????????????????????
     */
    FrameDelay.prototype.delayCall = function (delayFrame, func, thisObj) {
        this.func = func;
        this.thisObj = thisObj;
        egret.callLater(function () {
            App.TimerManager.doFrame(delayFrame, 1, this.listener_enterFrame, this);
        }, this);
    };
    FrameDelay.prototype.listener_enterFrame = function () {
        this.func.call(this.thisObj);
    };
    return FrameDelay;
}());
__reflect(FrameDelay.prototype, "FrameDelay");
/**
 * Created by yangsong on 2014/11/23.
 * ????????????
 */
var FrameExecutor = (function () {
    /**
     * ????????????
     */
    function FrameExecutor($delayFrame) {
        this.delayFrame = $delayFrame;
        this.frameDelay = new FrameDelay();
        this.functions = new Array();
    }
    /**
     * ??????????????????????????????
     * @param $func ??????
     * @param $thisObj ??????????????????
     */
    FrameExecutor.prototype.regist = function ($func, $thisObj) {
        this.functions.push([$func, $thisObj]);
    };
    /**
     * ??????
     */
    FrameExecutor.prototype.execute = function () {
        if (this.functions.length) {
            var arr = this.functions.shift();
            arr[0].call(arr[1]);
            this.frameDelay.delayCall(this.delayFrame, this.execute, this);
        }
    };
    return FrameExecutor;
}());
__reflect(FrameExecutor.prototype, "FrameExecutor");
/**
 * Created by yangsong on 15-1-26.
 * ???????????????
 */
var KeyboardUtils = (function (_super) {
    __extends(KeyboardUtils, _super);
    /**
     * ????????????
     */
    function KeyboardUtils() {
        var _this = _super.call(this) || this;
        _this.key_ups = new Array();
        _this.key_downs = new Array();
        if (App.DeviceUtils.IsHtml5) {
            var self = _this;
            document.addEventListener("keyup", function (e) {
                for (var i = 0, len = self.key_ups.length; i < len; i++) {
                    var func = self.key_ups[i][0];
                    var target = self.key_ups[i][1];
                    if (target) {
                        func.call(target, e["keyCode"]);
                    }
                    else {
                        func(e["keyCode"]);
                    }
                }
            });
            document.addEventListener("keydown", function (e) {
                for (var i = 0, len = self.key_downs.length; i < len; i++) {
                    var func = self.key_downs[i][0];
                    var target = self.key_downs[i][1];
                    if (target) {
                        func.call(target, e["keyCode"]);
                    }
                    else {
                        func(e["keyCode"]);
                    }
                }
            });
        }
        return _this;
    }
    /**
     * ??????KeyUp??????
     * @param callback ????????????
     * @param target ???????????????????????????
     */
    KeyboardUtils.prototype.addKeyUp = function (callback, target) {
        this.key_ups.push([callback, target]);
    };
    /**
     * ??????KeyDown??????
     * @param callback ????????????
     * @param target ???????????????????????????
     */
    KeyboardUtils.prototype.addKeyDown = function (callback, target) {
        this.key_downs.push([callback, target]);
    };
    /**
     * ??????KeyUp??????
     * @param callback ????????????
     * @param target ???????????????????????????
     */
    KeyboardUtils.prototype.removeKeyUp = function (callback, target) {
        for (var i = 0; i < this.key_ups.length; i++) {
            if (this.key_ups[i][0] == callback && this.key_ups[i][1] == target) {
                this.key_ups.splice(i, 1);
                i--;
            }
        }
    };
    /**
     * ??????KeyDown??????
     * @param callback ????????????
     * @param target ???????????????????????????
     */
    KeyboardUtils.prototype.removeKeyDown = function (callback, target) {
        for (var i = 0; i < this.key_downs.length; i++) {
            if (this.key_downs[i][0] == callback && this.key_downs[i][1] == target) {
                this.key_downs.splice(i, 1);
                i--;
            }
        }
    };
    return KeyboardUtils;
}(SingtonClass));
__reflect(KeyboardUtils.prototype, "KeyboardUtils");
/**
 * Created by Saco on 2014/12/1.
 */
var LocationPropertyUtils = (function (_super) {
    __extends(LocationPropertyUtils, _super);
    function LocationPropertyUtils() {
        return _super.call(this) || this;
    }
    /*
     * ??????url????????????????????????null
     * ?????????paraUrl????????????????????????url
     * */
    LocationPropertyUtils.prototype.getPara = function (paraName, paraUrl) {
        if (egret.Capabilities.runtimeType != egret.RuntimeType.WEB) {
            return null;
        }
        var url = paraUrl || location.href;
        if (url.indexOf("?") != -1) {
            var urlPara = "&" + url.split("?")[1];
            var reg = new RegExp("\&" + paraName + "\=.*?(?:\&|$)");
            var result = reg.exec(urlPara);
            if (result) {
                var value = result[0];
                return value.split("&")[1].split("=")[1];
            }
        }
        return null;
    };
    /*
     * ???Url????????????
     * ?????????paraUrl????????????????????????url
     * */
    LocationPropertyUtils.prototype.setProperty = function (paraName, paraValue, paraUrl) {
        var url = paraUrl || location.href;
        var urlPara = "&" + url.split("?")[1];
        if (url.indexOf("?") == -1) {
            return url += "?" + paraName + "=" + paraValue;
        }
        else {
            var urlPara = url.split("?")[1];
            if (urlPara == "")
                return url += paraName + "=" + paraValue;
            var regParaKV = new RegExp("(?:^|\&)" + paraName + "\=.*?(?:\&|$)");
            var result = regParaKV.exec(urlPara);
            if (!result || result[0] == "") {
                return url += "&" + paraName + "=" + paraValue;
            }
            else {
                var oldValue = result[0];
                var regParaKey = new RegExp("\=.*$");
                var newValue = oldValue.replace(regParaKey, "=" + paraValue);
                return url.replace(oldValue, newValue);
            }
        }
    };
    /*
     * ??????url????????????????????????
     * ??????????????????????????????paraName = "undefined", paraUrl?????????"?"?????????true
     * ??????????????????????????? =.=
     * */
    LocationPropertyUtils.prototype.hasProperty = function (paraName, paraUrl) {
        var url = paraUrl || location.href;
        var para = "&" + url.split("?")[1]; //???&????????????&?????????????????????=??????????????????????????????uid=1&id=2????????????
        return para.indexOf("&" + paraName + "=") != -1;
    };
    return LocationPropertyUtils;
}(SingtonClass));
__reflect(LocationPropertyUtils.prototype, "LocationPropertyUtils");
/**
 * Created by yangsong on 2014/11/22.
 */
var Log = (function () {
    function Log() {
    }
    /**
     * Debug
     */
    Log.debug = function () {
        var optionalParams = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            optionalParams[_i] = arguments[_i];
        }
        if (!App.DebugUtils.isDebug) {
            return;
        }
        var message = "[Debug]" + optionalParams.shift();
        console.log.apply(console, [message].concat(optionalParams));
    };
    /**
     * Info
     */
    Log.info = function () {
        var optionalParams = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            optionalParams[_i] = arguments[_i];
        }
        var message = "[Info]" + optionalParams.shift();
        console.log.apply(console, [message].concat(optionalParams));
    };
    /**
     * Warn
     */
    Log.warn = function () {
        var optionalParams = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            optionalParams[_i] = arguments[_i];
        }
        var message = "[Warn]" + optionalParams.shift();
        console.warn.apply(console, [message].concat(optionalParams));
    };
    /**
     * Error
     */
    Log.error = function () {
        var optionalParams = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            optionalParams[_i] = arguments[_i];
        }
        var message = "[Error]" + optionalParams.shift();
        console.error.apply(console, [message].concat(optionalParams));
    };
    return Log;
}());
__reflect(Log.prototype, "Log");
/**
 * Created by yangsong on 2014/11/22.
 * ?????????????????????
 */
var MathUtils = (function (_super) {
    __extends(MathUtils, _super);
    function MathUtils() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * ???????????????????????????
     * @param radian ?????????
     * @returns {number}
     */
    MathUtils.prototype.getAngle = function (radian) {
        return 180 * radian / Math.PI;
    };
    /**
     * ???????????????????????????
     * @param angle
     */
    MathUtils.prototype.getRadian = function (angle) {
        return angle / 180 * Math.PI;
    };
    /**
     * ?????????????????????
     * @param p1X
     * @param p1Y
     * @param p2X
     * @param p2Y
     * @returns {number}
     */
    MathUtils.prototype.getRadian2 = function (p1X, p1Y, p2X, p2Y) {
        var xdis = p2X - p1X;
        var ydis = p2Y - p1Y;
        return Math.atan2(ydis, xdis);
    };
    /**
     * ?????????????????????
     * @param p1X
     * @param p1Y
     * @param p2X
     * @param p2Y
     * @returns {number}
     */
    MathUtils.prototype.getDistance = function (p1X, p1Y, p2X, p2Y) {
        var disX = p2X - p1X;
        var disY = p2Y - p1Y;
        var disQ = disX * disX + disY * disY;
        return Math.sqrt(disQ);
    };
    return MathUtils;
}(SingtonClass));
__reflect(MathUtils.prototype, "MathUtils");
/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */
/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
var md5 = (function () {
    function md5() {
        this.hexcase = 0;
        /* hex output format. 0 - lowercase; 1 - uppercase        */
        this.b64pad = "";
    }
    /* base-64 pad character. "=" for strict RFC compliance   */
    /*
     * These are the privates you'll usually want to call
     * They take string arguments and return either hex or base-64 encoded strings
     */
    md5.prototype.hex_md5 = function (s) {
        return this.rstr2hex(this.rstr_md5(this.str2rstr_utf8(s)));
    };
    md5.prototype.b64_md5 = function (s) {
        return this.rstr2b64(this.rstr_md5(this.str2rstr_utf8(s)));
    };
    md5.prototype.any_md5 = function (s, e) {
        return this.rstr2any(this.rstr_md5(this.str2rstr_utf8(s)), e);
    };
    md5.prototype.hex_hmac_md5 = function (k, d) {
        return this.rstr2hex(this.rstr_hmac_md5(this.str2rstr_utf8(k), this.str2rstr_utf8(d)));
    };
    md5.prototype.b64_hmac_md5 = function (k, d) {
        return this.rstr2b64(this.rstr_hmac_md5(this.str2rstr_utf8(k), this.str2rstr_utf8(d)));
    };
    md5.prototype.any_hmac_md5 = function (k, d, e) {
        return this.rstr2any(this.rstr_hmac_md5(this.str2rstr_utf8(k), this.str2rstr_utf8(d)), e);
    };
    /*
     * Perform a simple self-test to see if the VM is working
     */
    md5.prototype.md5_vm_test = function () {
        return this.hex_md5("abc").toLowerCase() == "900150983cd24fb0d6963f7d28e17f72";
    };
    /*
     * Calculate the MD5 of a raw string
     */
    md5.prototype.rstr_md5 = function (s) {
        return this.binl2rstr(this.binl_md5(this.rstr2binl(s), s.length * 8));
    };
    /*
     * Calculate the HMAC-MD5, of a key and some data (raw strings)
     */
    md5.prototype.rstr_hmac_md5 = function (key, data) {
        var bkey = this.rstr2binl(key);
        if (bkey.length > 16)
            bkey = this.binl_md5(bkey, key.length * 8);
        var ipad = Array(16), opad = Array(16);
        for (var i = 0; i < 16; i++) {
            ipad[i] = bkey[i] ^ 0x36363636;
            opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }
        var hash = this.binl_md5(ipad.concat(this.rstr2binl(data)), 512 + data.length * 8);
        return this.binl2rstr(this.binl_md5(opad.concat(hash), 512 + 128));
    };
    /*
     * Convert a raw string to a hex string
     */
    md5.prototype.rstr2hex = function (input) {
        try {
            this.hexcase;
        }
        catch (e) {
            this.hexcase = 0;
        }
        var hex_tab = this.hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var output = "";
        var x;
        for (var i = 0; i < input.length; i++) {
            x = input.charCodeAt(i);
            output += hex_tab.charAt((x >>> 4) & 0x0F)
                + hex_tab.charAt(x & 0x0F);
        }
        return output;
    };
    /*
     * Convert a raw string to a base-64 string
     */
    md5.prototype.rstr2b64 = function (input) {
        try {
            this.b64pad;
        }
        catch (e) {
            this.b64pad = '';
        }
        var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var output = "";
        var len = input.length;
        for (var i = 0; i < len; i += 3) {
            var triplet = (input.charCodeAt(i) << 16)
                | (i + 1 < len ? input.charCodeAt(i + 1) << 8 : 0)
                | (i + 2 < len ? input.charCodeAt(i + 2) : 0);
            for (var j = 0; j < 4; j++) {
                if (i * 8 + j * 6 > input.length * 8)
                    output += this.b64pad;
                else
                    output += tab.charAt((triplet >>> 6 * (3 - j)) & 0x3F);
            }
        }
        return output;
    };
    /*
     * Convert a raw string to an arbitrary string encoding
     */
    md5.prototype.rstr2any = function (input, encoding) {
        var divisor = encoding.length;
        var i, j, q, x, quotient;
        /* Convert to an array of 16-bit big-endian values, forming the dividend */
        var dividend = Array(Math.ceil(input.length / 2));
        for (i = 0; i < dividend.length; i++) {
            dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
        }
        /*
         * Repeatedly perform a long division. The binary array forms the dividend,
         * the length of the encoding is the divisor. Once computed, the quotient
         * forms the dividend for the next step. All remainders are stored for later
         * use.
         */
        var full_length = Math.ceil(input.length * 8 /
            (Math.log(encoding.length) / Math.log(2)));
        var remainders = Array(full_length);
        for (j = 0; j < full_length; j++) {
            quotient = Array();
            x = 0;
            for (i = 0; i < dividend.length; i++) {
                x = (x << 16) + dividend[i];
                q = Math.floor(x / divisor);
                x -= q * divisor;
                if (quotient.length > 0 || q > 0)
                    quotient[quotient.length] = q;
            }
            remainders[j] = x;
            dividend = quotient;
        }
        /* Convert the remainders to the output string */
        var output = "";
        for (i = remainders.length - 1; i >= 0; i--)
            output += encoding.charAt(remainders[i]);
        return output;
    };
    /*
     * Encode a string as utf-8.
     * For efficiency, this assumes the input is valid utf-16.
     */
    md5.prototype.str2rstr_utf8 = function (input) {
        var output = "";
        var i = -1;
        var x, y;
        while (++i < input.length) {
            /* Decode utf-16 surrogate pairs */
            x = input.charCodeAt(i);
            y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
            if (0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF) {
                x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
                i++;
            }
            /* Encode output as utf-8 */
            if (x <= 0x7F)
                output += String.fromCharCode(x);
            else if (x <= 0x7FF)
                output += String.fromCharCode(0xC0 | ((x >>> 6) & 0x1F), 0x80 | (x & 0x3F));
            else if (x <= 0xFFFF)
                output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F), 0x80 | ((x >>> 6) & 0x3F), 0x80 | (x & 0x3F));
            else if (x <= 0x1FFFFF)
                output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07), 0x80 | ((x >>> 12) & 0x3F), 0x80 | ((x >>> 6) & 0x3F), 0x80 | (x & 0x3F));
        }
        return output;
    };
    /*
     * Encode a string as utf-16
     */
    md5.prototype.str2rstr_utf16le = function (input) {
        var output = "";
        for (var i = 0; i < input.length; i++)
            output += String.fromCharCode(input.charCodeAt(i) & 0xFF, (input.charCodeAt(i) >>> 8) & 0xFF);
        return output;
    };
    md5.prototype.str2rstr_utf16be = function (input) {
        var output = "";
        for (var i = 0; i < input.length; i++)
            output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF, input.charCodeAt(i) & 0xFF);
        return output;
    };
    /*
     * Convert a raw string to an array of little-endian words
     * Characters >255 have their high-byte silently ignored.
     */
    md5.prototype.rstr2binl = function (input) {
        var output = Array(input.length >> 2);
        for (var i = 0; i < output.length; i++)
            output[i] = 0;
        for (var i = 0; i < input.length * 8; i += 8)
            output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
        return output;
    };
    /*
     * Convert an array of little-endian words to a string
     */
    md5.prototype.binl2rstr = function (input) {
        var output = "";
        for (var i = 0; i < input.length * 32; i += 8)
            output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
        return output;
    };
    /*
     * Calculate the MD5 of an array of little-endian words, and a bit length.
     */
    md5.prototype.binl_md5 = function (x, len) {
        /* append padding */
        x[len >> 5] |= 0x80 << ((len) % 32);
        x[(((len + 64) >>> 9) << 4) + 14] = len;
        var a = 1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d = 271733878;
        for (var i = 0; i < x.length; i += 16) {
            var olda = a;
            var oldb = b;
            var oldc = c;
            var oldd = d;
            a = this.md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
            d = this.md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
            c = this.md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
            b = this.md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
            a = this.md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
            d = this.md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
            c = this.md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
            b = this.md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
            a = this.md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
            d = this.md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
            c = this.md5_ff(c, d, a, b, x[i + 10], 17, -42063);
            b = this.md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
            a = this.md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
            d = this.md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
            c = this.md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
            b = this.md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
            a = this.md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
            d = this.md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
            c = this.md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
            b = this.md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
            a = this.md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
            d = this.md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
            c = this.md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
            b = this.md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
            a = this.md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
            d = this.md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
            c = this.md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
            b = this.md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
            a = this.md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
            d = this.md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
            c = this.md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
            b = this.md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
            a = this.md5_hh(a, b, c, d, x[i + 5], 4, -378558);
            d = this.md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
            c = this.md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
            b = this.md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
            a = this.md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
            d = this.md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
            c = this.md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
            b = this.md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
            a = this.md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
            d = this.md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
            c = this.md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
            b = this.md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
            a = this.md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
            d = this.md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
            c = this.md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
            b = this.md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
            a = this.md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
            d = this.md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
            c = this.md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
            b = this.md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
            a = this.md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
            d = this.md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
            c = this.md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
            b = this.md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
            a = this.md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
            d = this.md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
            c = this.md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
            b = this.md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
            a = this.md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
            d = this.md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
            c = this.md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
            b = this.md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
            a = this.safe_add(a, olda);
            b = this.safe_add(b, oldb);
            c = this.safe_add(c, oldc);
            d = this.safe_add(d, oldd);
        }
        return [a, b, c, d];
    };
    /*
     * These privates implement the four basic operations the algorithm uses.
     */
    md5.prototype.md5_cmn = function (q, a, b, x, s, t) {
        return this.safe_add(this.bit_rol(this.safe_add(this.safe_add(a, q), this.safe_add(x, t)), s), b);
    };
    md5.prototype.md5_ff = function (a, b, c, d, x, s, t) {
        return this.md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
    };
    md5.prototype.md5_gg = function (a, b, c, d, x, s, t) {
        return this.md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
    };
    md5.prototype.md5_hh = function (a, b, c, d, x, s, t) {
        return this.md5_cmn(b ^ c ^ d, a, b, x, s, t);
    };
    md5.prototype.md5_ii = function (a, b, c, d, x, s, t) {
        return this.md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
    };
    /*
     * Add integers, wrapping at 2^32. This uses 16-bit operations internally
     * to work around bugs in some JS interpreters.
     */
    md5.prototype.safe_add = function (x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    };
    /*
     * Bitwise rotate a 32-bit number to the left.
     */
    md5.prototype.bit_rol = function (num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    };
    return md5;
}());
__reflect(md5.prototype, "md5");
/**
 * Created by yangsong on 2014/11/23.
 * ???????????????????????????
 */
var MessageCenter = (function (_super) {
    __extends(MessageCenter, _super);
    /**
     * ????????????
     * @param type 0:?????????????????? 1:????????????
     */
    function MessageCenter(type) {
        var _this = _super.call(this) || this;
        _this.type = type;
        _this.dict = {};
        _this.eVec = new Array();
        _this.lastRunTime = 0;
        if (_this.type == 0) {
            App.TimerManager.doFrame(1, 0, _this.run, _this);
        }
        return _this;
    }
    /**
     * ????????????
     */
    MessageCenter.prototype.clear = function () {
        this.dict = {};
        this.eVec.splice(0);
    };
    /**
     * ??????????????????
     * @param type ??????????????????
     * @param listener ????????????
     * @param listenerObj ????????????????????????
     *
     */
    MessageCenter.prototype.addListener = function (type, listener, listenerObj) {
        var arr = this.dict[type];
        if (arr == null) {
            arr = new Array();
            this.dict[type] = arr;
        }
        //????????????????????????
        var i = 0;
        var len = arr.length;
        for (i; i < len; i++) {
            if (arr[i][0] == listener && arr[i][1] == listenerObj) {
                return;
            }
        }
        arr.push([listener, listenerObj]);
    };
    /**
     * ??????????????????
     * @param type ??????????????????
     * @param listener ????????????
     * @param listenerObj ????????????????????????
     */
    MessageCenter.prototype.removeListener = function (type, listener, listenerObj) {
        var arr = this.dict[type];
        if (arr == null) {
            return;
        }
        var i = 0;
        var len = arr.length;
        for (i; i < len; i++) {
            if (arr[i][0] == listener && arr[i][1] == listenerObj) {
                arr.splice(i, 1);
                break;
            }
        }
        if (arr.length == 0) {
            this.dict[type] = null;
            delete this.dict[type];
        }
    };
    /**
     * ?????????????????????????????????
     * @param listenerObj ????????????????????????
     */
    MessageCenter.prototype.removeAll = function (listenerObj) {
        var keys = Object.keys(this.dict);
        for (var i = 0, len = keys.length; i < len; i++) {
            var type = keys[i];
            var arr = this.dict[type];
            for (var j = 0; j < arr.length; j++) {
                if (arr[j][1] == listenerObj) {
                    arr.splice(j, 1);
                    j--;
                }
            }
            if (arr.length == 0) {
                this.dict[type] = null;
                delete this.dict[type];
            }
        }
    };
    /**
     * ????????????
     * @param type ??????????????????
     * @param param ????????????
     *
     */
    MessageCenter.prototype.dispatch = function (type) {
        var param = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            param[_i - 1] = arguments[_i];
        }
        if (this.dict[type] == null) {
            return;
        }
        var vo = ObjectPool.pop("MessageVo");
        vo.type = type;
        vo.param = param;
        if (this.type == 0) {
            this.eVec.push(vo);
        }
        else if (this.type == 1) {
            this.dealMsg(vo);
        }
        else {
            Log.warn("MessageCenter??????????????????");
        }
    };
    /**
     * ??????
     *
     */
    MessageCenter.prototype.run = function () {
        var currTime = egret.getTimer();
        var inSleep = currTime - this.lastRunTime > 100;
        this.lastRunTime = currTime;
        if (inSleep) {
            while (this.eVec.length > 0) {
                this.dealMsg(this.eVec.shift());
            }
        }
        else {
            while (this.eVec.length > 0) {
                this.dealMsg(this.eVec.shift());
                if ((egret.getTimer() - currTime) > 5) {
                    break;
                }
            }
        }
    };
    /**
     * ??????????????????
     * @param msgVo
     */
    MessageCenter.prototype.dealMsg = function (msgVo) {
        var listeners = this.dict[msgVo.type];
        var i = 0;
        var len = listeners.length;
        var listener = null;
        while (i < len) {
            listener = listeners[i];
            listener[0].apply(listener[1], msgVo.param);
            if (listeners.length != len) {
                len = listeners.length;
                i--;
            }
            i++;
        }
        msgVo.dispose();
        ObjectPool.push(msgVo);
    };
    /**
     * ????????????????????????????????????????????????
     * @param type ????????????
     */
    MessageCenter.prototype.isHasListener = function (type) {
        return this.dict[type] != undefined;
    };
    return MessageCenter;
}(SingtonClass));
__reflect(MessageCenter.prototype, "MessageCenter");
var MessageVo = (function () {
    function MessageVo() {
    }
    MessageVo.prototype.dispose = function () {
        this.type = null;
        this.param = null;
    };
    return MessageVo;
}());
__reflect(MessageVo.prototype, "MessageVo");
/**
 * Created by yangsong on 2014/11/22.
 * ????????????
 */
var ObjectPool = (function () {
    /**
     * ????????????
     */
    function ObjectPool() {
        this._objs = new Array();
    }
    /**
     * ??????????????????
     * @param obj
     */
    ObjectPool.prototype.pushObj = function (obj) {
        this._objs.push(obj);
    };
    /**
     * ??????????????????
     * @returns {*}
     */
    ObjectPool.prototype.popObj = function () {
        if (this._objs.length > 0) {
            return this._objs.pop();
        }
        else {
            return null;
        }
    };
    /**
     * ????????????????????????
     */
    ObjectPool.prototype.clear = function () {
        while (this._objs.length > 0) {
            this._objs.pop();
        }
    };
    /**
     * ??????????????????
     * @param classZ Class
     * @return Object
     *
     */
    ObjectPool.pop = function (refKey) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (!ObjectPool._content[refKey]) {
            ObjectPool._content[refKey] = [];
        }
        var list = ObjectPool._content[refKey];
        if (list.length) {
            return list.pop();
        }
        else {
            this.defineDic();
            var classZ = egret.getDefinitionByName(refKey);
            var argsLen = args.length;
            var obj;
            if (argsLen == 0) {
                obj = new classZ();
            }
            else if (argsLen == 1) {
                obj = new classZ(args[0]);
            }
            else if (argsLen == 2) {
                obj = new classZ(args[0], args[1]);
            }
            else if (argsLen == 3) {
                obj = new classZ(args[0], args[1], args[2]);
            }
            else if (argsLen == 4) {
                obj = new classZ(args[0], args[1], args[2], args[3]);
            }
            else if (argsLen == 5) {
                obj = new classZ(args[0], args[1], args[2], args[3], args[4]);
            }
            obj.ObjectPoolKey = refKey;
            return obj;
        }
    };
    ObjectPool.defineDic = function () {
        window["MessageVo"] = MessageVo;
        window["TimerHandler2"] = TimerHandler2;
        window["Enemy"] = Enemy;
        window["Boss"] = Boss;
        window["Hero"] = Hero;
        window["RpgMovieClip"] = RpgMovieClip;
        window["egret.Bitmap"] = egret.Bitmap;
        window["egret.DisplayObjectContainer"] = egret.DisplayObjectContainer;
        window["egret.MovieClip"] = egret.MovieClip;
        window["egret.DisplayObjectContainer"] = egret.DisplayObjectContainer;
        window["RpgMonster"] = RpgMonster;
        window["RpgPlayer"] = RpgPlayer;
        window["egret.TextField"] = egret.TextField;
        window["AiComponent"] = AiComponent;
        window["AoiComponent"] = AoiComponent;
        window["AvatarComponent"] = AvatarComponent;
        window["AvatarSkillComponent"] = AvatarSkillComponent;
        window["CameraComponent"] = CameraComponent;
        window["MoveComponent"] = MoveComponent;
        window["ControlComponent"] = ControlComponent;
        window["SortComponent"] = SortComponent;
        window["HeadComponent"] = HeadComponent;
        window["AutoBattleComponent"] = AutoBattleComponent;
        window["BattleComponent"] = BattleComponent;
        window["MonsterBattleComponent"] = MonsterBattleComponent;
        window["EffectComponent"] = EffectComponent;
    };
    /**
     * ??????????????????
     * @param refKey Class
     * @param extraKey ?????????
     * @returns {any}
     */
    ObjectPool.popWithExtraKey = function (refKey, extraKey) {
        if (!ObjectPool._content[refKey]) {
            ObjectPool._content[refKey] = [];
        }
        var obj;
        var list = ObjectPool._content[refKey];
        if (list.length) {
            for (var i = 0; i < list.length; i++) {
                if (list[i].extraKey == extraKey) {
                    obj = list[i];
                    list.splice(i, 1);
                    break;
                }
            }
        }
        if (!obj) {
            this.defineDic();
            var classZ = egret.getDefinitionByName(refKey);
            obj = new classZ(extraKey);
            obj.extraKey = extraKey;
            obj.ObjectPoolKey = refKey;
        }
        return obj;
    };
    /**
     * ??????????????????
     * @param obj
     *
     */
    ObjectPool.push = function (obj) {
        if (obj == null) {
            return false;
        }
        var refKey = obj.ObjectPoolKey;
        //????????????pop?????????????????????????????????????????????????????????????????????
        if (!ObjectPool._content[refKey]) {
            return false;
        }
        ObjectPool._content[refKey].push(obj);
        return true;
    };
    /**
     * ??????????????????
     */
    ObjectPool.clear = function () {
        ObjectPool._content = {};
    };
    /**
     * ?????????????????????
     * @param classZ Class
     * @param clearFuncName ?????????????????????????????????
     */
    ObjectPool.clearClass = function (refKey, clearFuncName) {
        if (clearFuncName === void 0) { clearFuncName = null; }
        var list = ObjectPool._content[refKey];
        while (list && list.length) {
            var obj = list.pop();
            if (clearFuncName) {
                obj[clearFuncName]();
            }
            obj = null;
        }
        ObjectPool._content[refKey] = null;
        delete ObjectPool._content[refKey];
    };
    /**
     * ???????????????????????????????????????
     * @param classZ Class
     * @param dealFuncName ????????????????????????
     */
    ObjectPool.dealFunc = function (refKey, dealFuncName) {
        var list = ObjectPool._content[refKey];
        if (list == null) {
            return;
        }
        var i = 0;
        var len = list.length;
        for (i; i < len; i++) {
            list[i][dealFuncName]();
        }
    };
    ObjectPool._content = {};
    return ObjectPool;
}());
__reflect(ObjectPool.prototype, "ObjectPool");
/**
 * Created by yangsong on 2014/11/23.
 * ????????????
 */
var Percent = (function () {
    /**
     * ????????????
     * @param $currentValue ?????????
     * @param $totalValue ??????
     */
    function Percent($currentValue, $totalValue) {
        this.currentValue = $currentValue;
        this.totalValue = $totalValue;
    }
    /**
     * ?????????????????????
     * @returns {number}
     */
    Percent.prototype.computePercent = function () {
        return this.currentValue / this.totalValue * 100;
    };
    /**
     * ??????????????????
     * @returns {number}
     */
    Percent.prototype.computeRate = function () {
        return this.currentValue / this.totalValue;
    };
    /**
     * ??????
     * @returns {Percent}
     */
    Percent.prototype.reverse = function () {
        this.currentValue = this.totalValue - this.currentValue;
        return this;
    };
    /**
     * ??????
     * @returns {Percent}
     */
    Percent.prototype.copy = function () {
        return new Percent(this.currentValue, this.totalValue);
    };
    /**
     * ?????????????????????
     * @returns {number}
     */
    Percent.prototype.computePercentReverse = function () {
        return (this.totalValue - this.currentValue) / this.totalValue * 100;
    };
    /**
     * ??????????????????
     * @returns {number}
     */
    Percent.prototype.computeRateReverse = function () {
        return (this.totalValue - this.currentValue) / this.totalValue;
    };
    return Percent;
}());
__reflect(Percent.prototype, "Percent");
/**
 * Created by yangsong on 15-8-19.
 * ????????????
 */
var QueueExecutor = (function () {
    /**
     * ????????????
     */
    function QueueExecutor() {
        this._functions = new Array();
    }
    /**
     * ????????????????????????????????????
     * @param callBack ?????????????????????????????????
     * @param callBackTarget ?????????????????????????????????????????????
     */
    QueueExecutor.prototype.setCallBack = function (callBack, callBackTarget) {
        this._callBack = callBack;
        this._callBackTarget = callBackTarget;
    };
    /**
     * ?????????????????????????????????
     * @param $func ??????
     * @param $thisObj ??????????????????
     */
    QueueExecutor.prototype.regist = function ($func, $thisObj) {
        this._functions.push([$func, $thisObj]);
    };
    /**
     * ????????????
     */
    QueueExecutor.prototype.start = function () {
        this.next();
    };
    /**
     * ???????????????
     */
    QueueExecutor.prototype.next = function () {
        if (!this._functions) {
            return;
        }
        if (this._functions.length == 0) {
            if (this._callBack) {
                this._callBack.call(this._callBackTarget);
            }
            this._callBack = null;
            this._callBackTarget = null;
            this._functions = null;
        }
        else {
            var arr = this._functions.shift();
            arr[0].call(arr[1]);
        }
    };
    return QueueExecutor;
}());
__reflect(QueueExecutor.prototype, "QueueExecutor");
/**
 * Created by yangsong on 2014/11/23.
 */
var RandomUtils = (function (_super) {
    __extends(RandomUtils, _super);
    function RandomUtils() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * ??????????????????????????????
     * @param $from ?????????
     * @param $end ?????????
     * @returns {number}
     */
    RandomUtils.prototype.limit = function ($from, $end) {
        $from = Math.min($from, $end);
        $end = Math.max($from, $end);
        var range = $end - $from;
        return $from + Math.random() * range;
    };
    /**
     * ??????????????????????????????(??????)
     * @param $from ?????????
     * @param $end ?????????
     * @returns {number}
     */
    RandomUtils.prototype.limitInteger = function ($from, $end) {
        return Math.floor(this.limit($from, $end + 1));
    };
    /**
     * ??????????????????????????????????????????
     * @param arr ??????
     * @returns {any} ?????????????????????
     */
    RandomUtils.prototype.randomArray = function (arr) {
        if (!arr) {
            return null;
        }
        var index = Math.floor(Math.random() * arr.length);
        return arr[index];
    };
    return RandomUtils;
}(SingtonClass));
__reflect(RandomUtils.prototype, "RandomUtils");
/**
 * cacheAsBitmap????????????????????????QQ????????????1G?????????????????????????????????20???Canvas?????????
 */
var RenderTextureManager = (function (_super) {
    __extends(RenderTextureManager, _super);
    /**
     * ????????????
     */
    function RenderTextureManager() {
        var _this = _super.call(this) || this;
        _this._pool = [];
        _this._useNum = 0;
        if (_this.isLowerQQBrowser()) {
            _this._maxNum = 18;
        }
        else {
            _this._maxNum = -1;
        }
        return _this;
    }
    /**
     * ????????????????????????QQ?????????
     * @returns {boolean}
     */
    RenderTextureManager.prototype.isLowerQQBrowser = function () {
        if (App.DeviceUtils.IsQQBrowser) {
            //?????????????????????????????????????????????????????????????????????????????????
            var arr = [
                "2013022",
                "Lenovo A630t",
                "SM-G3818",
                "vivo X3t",
                "GT-I9100"
            ];
            var lower = false;
            for (var i = 0, len = arr.length; i < len; i++) {
                if (navigator.userAgent.indexOf(arr[i]) != -1) {
                    lower = true;
                    break;
                }
            }
            return lower;
        }
        return false;
    };
    /**
     * ????????????egret.RenderTexture
     * @returns {egret.RenderTexture}
     */
    RenderTextureManager.prototype.pop = function () {
        var result = this._pool.pop();
        if (!result) {
            if (this._maxNum == -1 || this._useNum < this._maxNum) {
                result = new egret.RenderTexture();
                this._useNum++;
            }
        }
        return result;
    };
    /**
     * ????????????egret.RenderTexture
     * @param texture
     */
    RenderTextureManager.prototype.push = function (texture) {
        var exists = false;
        for (var i = 0, len = this._pool.length; i < len; i++) {
            if (this._pool[i] == texture) {
                exists = true;
                break;
            }
        }
        if (!exists) {
            this._pool.push(texture);
        }
    };
    return RenderTextureManager;
}(SingtonClass));
__reflect(RenderTextureManager.prototype, "RenderTextureManager");
/**
 * Created by yangsong on 15-2-11.
 * ????????????????????????
 * ????????????resource.json????????????
 * ??????Group?????????
 * ????????????????????????
 */
var ResourceUtils = (function (_super) {
    __extends(ResourceUtils, _super);
    /**
     * ????????????
     */
    function ResourceUtils() {
        var _this = _super.call(this) || this;
        _this._groupIndex = 0;
        _this._configs = new Array();
        _this._groups = {};
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, _this.onResourceLoadComplete, _this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, _this.onResourceLoadProgress, _this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, _this.onResourceLoadError, _this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, _this.onResourceItemLoadError, _this);
        return _this;
    }
    /**
     * ????????????????????????
     * @param jsonPath resource.json??????
     * @param filePath ??????????????????
     */
    ResourceUtils.prototype.addConfig = function (jsonPath, filePath) {
        this._configs.push([jsonPath, filePath]);
    };
    /**
     * ????????????????????????
     * @param $onConfigComplete ????????????????????????
     * @param $onConfigCompleteTarget ????????????????????????????????????
     */
    ResourceUtils.prototype.loadConfig = function ($onConfigComplete, $onConfigCompleteTarget) {
        this._onConfigComplete = $onConfigComplete;
        this._onConfigCompleteTarget = $onConfigCompleteTarget;
        this.loadNextConfig();
    };
    /**
     * ??????
     */
    ResourceUtils.prototype.loadNextConfig = function () {
        //????????????
        if (this._configs.length == 0) {
            this._onConfigComplete.call(this._onConfigCompleteTarget);
            this._onConfigComplete = null;
            this._onConfigCompleteTarget = null;
            return;
        }
        var arr = this._configs.shift();
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigCompleteHandle, this);
        RES.loadConfig(arr[0], arr[1]);
    };
    /**
     * ????????????
     * @param event
     */
    ResourceUtils.prototype.onConfigCompleteHandle = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigCompleteHandle, this);
        this.loadNextConfig();
    };
    /**
     * ???????????????
     * @param $groupName ???????????????
     * @param $onResourceLoadComplete ??????????????????????????????
     * @param $onResourceLoadProgress ??????????????????????????????
     * @param $onResourceLoadTarget ????????????????????????????????????
     */
    ResourceUtils.prototype.loadGroup = function ($groupName, $onResourceLoadComplete, $onResourceLoadProgress, $onResourceLoadTarget) {
        this._groups[$groupName] = [$onResourceLoadComplete, $onResourceLoadProgress, $onResourceLoadTarget];
        RES.loadGroup($groupName);
    };
    /**
     * ?????????????????????
     * @param $groupName ?????????????????????
     * @param $subGroups ???????????????????????????key????????????
     * @param $onResourceLoadComplete ??????????????????????????????
     * @param $onResourceLoadProgress ??????????????????????????????
     * @param $onResourceLoadTarget ????????????????????????????????????
     */
    ResourceUtils.prototype.loadGroups = function ($groupName, $subGroups, $onResourceLoadComplete, $onResourceLoadProgress, $onResourceLoadTarget) {
        RES.createGroup($groupName, $subGroups, true);
        this.loadGroup($groupName, $onResourceLoadComplete, $onResourceLoadProgress, $onResourceLoadTarget);
    };
    /**
     * ????????????
     * @param $groupName ???????????????
     * @param $groupName ???????????????????????????key????????????
     */
    ResourceUtils.prototype.pilfererLoadGroup = function ($groupName, $subGroups) {
        if ($subGroups === void 0) { $subGroups = null; }
        //????????????????????????????????????????????????
        var useGroupName = "pilferer_" + $groupName;
        if (!$subGroups) {
            $subGroups = [$groupName];
        }
        RES.createGroup(useGroupName, $subGroups, true);
        RES.loadGroup(useGroupName, -1);
    };
    /**
     * ?????????????????????
     */
    ResourceUtils.prototype.onResourceLoadComplete = function (event) {
        var groupName = event.groupName;
        if (this._groups[groupName]) {
            var loadComplete = this._groups[groupName][0];
            var loadCompleteTarget = this._groups[groupName][2];
            if (loadComplete != null) {
                loadComplete.apply(loadCompleteTarget, [groupName]);
            }
            this._groups[groupName] = null;
            delete this._groups[groupName];
        }
    };
    /**
     * ?????????????????????
     */
    ResourceUtils.prototype.onResourceLoadProgress = function (event) {
        var groupName = event.groupName;
        if (this._groups[groupName]) {
            var loadProgress = this._groups[groupName][1];
            var loadProgressTarget = this._groups[groupName][2];
            if (loadProgress != null) {
                loadProgress.call(loadProgressTarget, event.itemsLoaded, event.itemsTotal);
            }
        }
    };
    /**
     * ?????????????????????
     * @param event
     */
    ResourceUtils.prototype.onResourceLoadError = function (event) {
        Log.warn(event.groupName + "??????????????????????????????");
        this.onResourceLoadComplete(event);
    };
    /**
     * ??????????????????
     * @param event
     */
    ResourceUtils.prototype.onResourceItemLoadError = function (event) {
        Log.warn(event.resItem.url + "??????????????????");
        if (this._itemLoadErrorFunction) {
            this._itemLoadErrorFunction(event);
        }
    };
    /**
     * ????????????????????????????????????
     */
    ResourceUtils.prototype.registerItemLoadErrorFunction = function (func) {
        this._itemLoadErrorFunction = func;
    };
    /**
     * ?????????????????????
     * @param $resources ????????????
     * @param $groups ???????????????
     * @param $onResourceLoadComplete ??????????????????????????????
     * @param $onResourceLoadProgress ??????????????????????????????
     * @param $onResourceLoadTarget ????????????????????????????????????
     */
    ResourceUtils.prototype.loadResource = function ($resources, $groups, $onResourceLoadComplete, $onResourceLoadProgress, $onResourceLoadTarget) {
        if ($resources === void 0) { $resources = []; }
        if ($groups === void 0) { $groups = []; }
        if ($onResourceLoadComplete === void 0) { $onResourceLoadComplete = null; }
        if ($onResourceLoadProgress === void 0) { $onResourceLoadProgress = null; }
        if ($onResourceLoadTarget === void 0) { $onResourceLoadTarget = null; }
        var needLoadArr = $resources.concat($groups);
        var groupName = "loadGroup" + this._groupIndex++;
        RES.createGroup(groupName, needLoadArr, true);
        this._groups[groupName] = [$onResourceLoadComplete, $onResourceLoadProgress, $onResourceLoadTarget];
        RES.loadGroup(groupName);
    };
    /**
     * ?????????????????????
     * @param {string} $groupName
     * @param {string[]} resKeys
     */
    ResourceUtils.prototype.createGroup = function ($groupName, resKeys) {
        RES.createGroup($groupName, resKeys, true);
    };
    /**
     * ????????????Resource
     * @param {string} resKey
     * @param {string} resType
     * @param {string} resUrl
     */
    ResourceUtils.prototype.createResource = function (resKey, resType, resUrl) {
        var res = {
            name: resKey,
            type: resType,
            url: resUrl
        };
        RES.$addResourceData(res);
    };
    /**
     * ???????????????????????????
     */
    ResourceUtils.prototype.getFileRealPath = function (key) {
        var fileInfo = RES.getResourceInfo(key);
        return fileInfo.root + fileInfo.url;
    };
    return ResourceUtils;
}(SingtonClass));
__reflect(ResourceUtils.prototype, "ResourceUtils");
/**
 * Created by yangsong on 15-1-27.
 * ???????????????
 */
var RockerUtils = (function (_super) {
    __extends(RockerUtils, _super);
    function RockerUtils() {
        return _super.call(this) || this;
    }
    /**
     * ???????????????
     * @param moveBg ???????????????
     * @param moveFlag ????????????
     * @param dealKeyFunc ???????????????????????????
     * @param dealKeyTarget ???????????????????????????????????????
     */
    RockerUtils.prototype.init = function (moveBg, moveFlag, dealKeyFunc, dealKeyTarget) {
        this.keys = [0, 0];
        this.mouseX = -1;
        this.mouseY = -1;
        this.moveFlag = moveFlag;
        this.moveFlagX = moveFlag.x;
        this.moveFlagY = moveFlag.y;
        this.moveFlagGoX = this.moveFlagX;
        this.moveFlagGoY = this.moveFlagY;
        this.moveFlagWidthHelf = moveBg.width * 0.5;
        this.moveFlagRec = new egret.Rectangle(this.moveFlagX - moveBg.width * 0.5, this.moveFlagY - moveBg.height * 0.5, moveBg.width, moveBg.height);
        this.moveFlagCheckRec = new egret.Rectangle(0, 0, App.StageUtils.getWidth() * 0.5, App.StageUtils.getHeight());
        this.dealKeyFunc = dealKeyFunc;
        this.dealKeyTarget = dealKeyTarget;
        this.moveFlag.touchEnabled = true;
        this.moveFlag.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.startMove, this);
        this.moveFlag.addEventListener(egret.TouchEvent.TOUCH_END, this.stopMove, this);
        this.moveFlag.addEventListener(egret.TouchEvent.TOUCH_TAP, this.stopEvent, this);
        App.StageUtils.getStage().addEventListener(egret.TouchEvent.TOUCH_END, this.leaveStateEvent, this);
        App.StageUtils.getStage().addEventListener(egret.TouchEvent.TOUCH_MOVE, this.heroMoveEvent, this);
        //????????????
        App.KeyboardUtils.addKeyDown(this.onKeyDown, this);
        App.KeyboardUtils.addKeyUp(this.onKeyUp, this);
    };
    /**
     * ??????????????????
     * @param keyCode
     */
    RockerUtils.prototype.onKeyDown = function (keyCode) {
        switch (keyCode) {
            case Keyboard.A:
                this.keys[0] = -1;
                this.startCheckKey();
                break;
            case Keyboard.D:
                this.keys[0] = 1;
                this.startCheckKey();
                break;
            case Keyboard.W:
                this.keys[1] = -1;
                this.startCheckKey();
                break;
            case Keyboard.S:
                this.keys[1] = 1;
                this.startCheckKey();
                break;
            default:
                break;
        }
    };
    /**
     * ??????????????????
     * @param keyCode
     */
    RockerUtils.prototype.onKeyUp = function (keyCode) {
        switch (keyCode) {
            case Keyboard.A:
                if (this.keys[0] == -1) {
                    this.keys[0] = 0;
                }
                break;
            case Keyboard.D:
                if (this.keys[0] == 1) {
                    this.keys[0] = 0;
                }
                break;
            case Keyboard.W:
                if (this.keys[1] == -1) {
                    this.keys[1] = 0;
                }
                break;
            case Keyboard.S:
                if (this.keys[1] == 1) {
                    this.keys[1] = 0;
                }
                break;
            default:
                break;
        }
    };
    /**
     * ????????????
     * @param e
     */
    RockerUtils.prototype.stopEvent = function (e) {
        e.stopPropagation();
    };
    /**
     * ????????????Stage????????????
     * @param e
     */
    RockerUtils.prototype.leaveStateEvent = function (e) {
        if (e.stageX == this.mouseX && e.stageY == this.mouseY) {
            this.stopMove();
        }
    };
    /**
     * ????????????
     */
    RockerUtils.prototype.startMove = function (e) {
        this.isMoveing = true;
        this.moveFlagGoX = this.moveFlagX;
        this.moveFlagGoY = this.moveFlagY;
        this.mouseX = e.stageX;
        this.mouseY = e.stageY;
    };
    /**
     * ????????????
     */
    RockerUtils.prototype.stopMove = function () {
        this.isMoveing = false;
        this.keys[0] = 0;
        this.keys[1] = 0;
        this.moveFlagGoX = this.moveFlagX;
        this.moveFlagGoY = this.moveFlagY;
        this.mouseX = -1;
        this.mouseY = -1;
    };
    /**
     * ??????????????????
     */
    RockerUtils.prototype.resetRockerPos = function () {
        this.moveFlag.x = this.moveFlagX;
        this.moveFlag.y = this.moveFlagY;
    };
    /**
     * ??????????????????
     * @param e
     */
    RockerUtils.prototype.heroMoveEvent = function (e) {
        this.runMove(e.stageX, e.stageY);
    };
    /**
     * ????????????
     * @param e
     */
    RockerUtils.prototype.runMove = function (stageX, stageY) {
        if (!this.isMoveing) {
            return;
        }
        if (!this.moveFlagCheckRec.contains(stageX, stageY)) {
            if (Math.abs(this.mouseX - stageX) > 50 || Math.abs(this.mouseY - stageY) > 50) {
                return;
            }
        }
        this.mouseX = stageX;
        this.mouseY = stageY;
        if (this.moveFlagRec.contains(this.mouseX, this.mouseY)) {
            this.moveFlagGoX = this.mouseX;
            this.moveFlagGoY = this.mouseY;
        }
        else {
            var radian = App.MathUtils.getRadian2(this.moveFlagX, this.moveFlagY, this.mouseX, this.mouseY);
            this.moveFlagGoX = this.moveFlagX + Math.cos(radian) * this.moveFlagWidthHelf;
            this.moveFlagGoY = this.moveFlagY + Math.sin(radian) * this.moveFlagWidthHelf;
        }
        if (this.moveFlagGoX > this.moveFlagX && Math.abs(this.moveFlagGoX - this.moveFlagX) > 10) {
            this.keys[0] = 1;
        }
        else if (this.moveFlagGoX < this.moveFlagX && Math.abs(this.moveFlagGoX - this.moveFlagX) > 10) {
            this.keys[0] = -1;
        }
        else {
            this.keys[0] = 0;
        }
        if (this.moveFlagGoY > this.moveFlagY && Math.abs(this.moveFlagGoY - this.moveFlagY) > 10) {
            this.keys[1] = 1;
        }
        else if (this.moveFlagGoY < this.moveFlagY && Math.abs(this.moveFlagGoY - this.moveFlagY) > 10) {
            this.keys[1] = -1;
        }
        else {
            this.keys[1] = 0;
        }
        this.startCheckKey();
    };
    /**
     * ????????????
     */
    RockerUtils.prototype.startCheckKey = function () {
        if (!this.checkKeying) {
            this.checkKeying = true;
            App.TimerManager.doFrame(1, 0, this.delKeys, this);
        }
    };
    /**
     * ????????????
     */
    RockerUtils.prototype.stopCheckKey = function () {
        this.keys[0] = 0;
        this.keys[1] = 0;
        if (this.checkKeying) {
            App.TimerManager.remove(this.delKeys, this);
            this.checkKeying = false;
        }
    };
    /**
     * ??????
     */
    RockerUtils.prototype.delKeys = function () {
        if (this.mouseX != -1 && !this.moveFlagCheckRec.contains(this.mouseX, this.mouseY)) {
            this.stopMove();
        }
        if (this.moveFlag.x != this.moveFlagGoX) {
            this.moveFlag.x = this.moveFlagGoX;
        }
        if (this.moveFlag.y != this.moveFlagGoY) {
            this.moveFlag.y = this.moveFlagGoY;
        }
        if (!this.keys[0] && !this.keys[1]) {
            this.stopCheckKey();
        }
        if (!this.dealKeyFunc.call(this.dealKeyTarget, this.keys[0], this.keys[1])) {
            this.resetRockerPos();
        }
    };
    /**
     * ????????????
     */
    RockerUtils.prototype.stop = function () {
        this.stopCheckKey();
        this.stopMove();
    };
    return RockerUtils;
}(SingtonClass));
__reflect(RockerUtils.prototype, "RockerUtils");
/**
 * Created by Channing on 2014/12/6.
 * ??????
 */
var ShockUtils = (function (_super) {
    __extends(ShockUtils, _super);
    function ShockUtils() {
        var _this = _super.call(this) || this;
        _this.MAP = 0;
        _this.SPRITE = 1;
        _this.mapPoss = [new egret.Point(0, 3), new egret.Point(0, 0), new egret.Point(0, -2)];
        _this.spritePoss = [new egret.Point(5, 0), new egret.Point(-5, 0), new egret.Point(5, 0)];
        _this._shockLength = 0;
        _this._shockCount = 0;
        _this._rx = 0;
        _this._ry = 0;
        _this._type = 0;
        _this._repeatCount = 0;
        return _this;
    }
    ShockUtils.prototype.destroy = function () {
        this.stop();
    };
    ShockUtils.prototype.shock = function (type, target, repeatCount) {
        if (type === void 0) { type = 0; }
        if (target === void 0) { target = null; }
        if (repeatCount === void 0) { repeatCount = 3; }
        if (this._target) {
            return;
        }
        this._type = type;
        this._target = target;
        if (this._type == this.MAP) {
            this._shockPoss = this.mapPoss.concat();
            this._shockLength = this._shockPoss.length;
        }
        else if (this._type == this.SPRITE) {
            this._shockPoss = this.spritePoss.concat();
            this._shockLength = this._shockPoss.length;
        }
        this.start(repeatCount);
    };
    ShockUtils.prototype.start = function (num) {
        if (num === void 0) { num = 1; }
        this.repeatCount = num;
        this._shockCount = 0;
        if (this._target) {
            if (this._type != this.MAP) {
                this._rx = this._target.x;
            }
            this._ry = this._target.y;
            App.TimerManager.doFrame(1, 0, this.onShockEnter, this);
        }
    };
    ShockUtils.prototype.stop = function () {
        if (this._target) {
            if (this._type != this.MAP) {
                this._target.x = this._rx;
            }
            this._target.y = this._ry;
            App.TimerManager.remove(this.onShockEnter, this);
        }
        this._target = null;
    };
    ShockUtils.prototype.onShockEnter = function (time) {
        var maxCount = this._shockLength * this._repeatCount;
        if (this._shockCount >= maxCount) {
            this.stop();
            return;
        }
        var index = this._shockCount % this._shockLength;
        var pos = this._shockPoss[index];
        if (this._target) {
            if (this._type != this.MAP) {
                this._target.x = this._rx + pos.x;
            }
            this._target.y = this._ry + pos.y;
        }
        this._shockCount++;
    };
    Object.defineProperty(ShockUtils.prototype, "repeatCount", {
        get: function () {
            return this._repeatCount;
        },
        set: function (value) {
            this._repeatCount = value;
        },
        enumerable: true,
        configurable: true
    });
    return ShockUtils;
}(SingtonClass));
__reflect(ShockUtils.prototype, "ShockUtils");
/**
 * Created by yangsong on 2014/12/3.
 * Stage???????????????
 */
var StageUtils = (function (_super) {
    __extends(StageUtils, _super);
    /**
     * ????????????
     */
    function StageUtils() {
        return _super.call(this) || this;
    }
    /**
     * ?????????????????????
     * @returns {number}
     */
    StageUtils.prototype.getHeight = function () {
        return this.getStage().stageHeight;
    };
    /**
     * ??????????????????
     * @returns {number}
     */
    StageUtils.prototype.getWidth = function () {
        return this.getStage().stageWidth;
    };
    /**
     * ?????????????????????????????????????????????????????????/????????????
     * @param value
     */
    StageUtils.prototype.setTouchChildren = function (value) {
        this.getStage().touchChildren = value;
    };
    /**
     * ???????????????????????????????????????????????????2
     * @param value
     */
    StageUtils.prototype.setMaxTouches = function (value) {
        this.getStage().maxTouches = value;
    };
    /**
     * ????????????
     * @param value
     */
    StageUtils.prototype.setFrameRate = function (value) {
        this.getStage().frameRate = value;
    };
    /**
     * ??????????????????
     * @param value
     */
    StageUtils.prototype.setScaleMode = function (value) {
        this.getStage().scaleMode = value;
    };
    /**
     * ????????????Stage??????
     * @returns {egret.MainContext}
     */
    StageUtils.prototype.getStage = function () {
        return egret.MainContext.instance.stage;
    };
    StageUtils.prototype.startFullscreenAdaptation = function (designWidth, designHeight, resizeCallback) {
        this.designWidth = designWidth;
        this.designHeight = designHeight;
        this.resizeCallback = resizeCallback;
        this.stageOnResize();
    };
    StageUtils.prototype.stageOnResize = function () {
        this.getStage().removeEventListener(egret.Event.RESIZE, this.stageOnResize, this);
        var designWidth = this.designWidth;
        var designHeight = this.designHeight;
        var clientWidth = window.innerWidth;
        var clientHeight = window.innerHeight;
        var a = clientWidth / clientHeight;
        var b = designWidth / designHeight;
        var c = a / b;
        if (a > b) {
            var c1 = c;
            var c2 = c;
            designWidth = Math.floor(designWidth * c1);
            designHeight = Math.floor(designHeight * c2);
        }
        this.getStage().setContentSize(designWidth, designHeight);
        // Log.debug(a, b, c);
        // Log.debug(designWidth, designHeight);
        this.resizeCallback && this.resizeCallback();
        this.getStage().addEventListener(egret.Event.RESIZE, this.stageOnResize, this);
    };
    return StageUtils;
}(SingtonClass));
__reflect(StageUtils.prototype, "StageUtils");
/**
 * Created by yangsong on 2014/12/8.
 * StringBuffer???
 */
var StringBuffer = (function () {
    /**
     * ????????????
     */
    function StringBuffer() {
        this._strings = new Array();
    }
    /**
     * ?????????????????????
     * @param str
     */
    StringBuffer.prototype.append = function (str) {
        this._strings.push(str);
    };
    /**
     * ??????????????????
     * @returns {string}
     */
    StringBuffer.prototype.toString = function () {
        return this._strings.join("");
    };
    /**
     * ??????
     */
    StringBuffer.prototype.clear = function () {
        this._strings.length = 0;
    };
    return StringBuffer;
}());
__reflect(StringBuffer.prototype, "StringBuffer");
/**
 * Created by yangsong on 14/12/18.
 * ????????????????????????
 */
var StringUtils = (function (_super) {
    __extends(StringUtils, _super);
    /**
     * ????????????
     */
    function StringUtils() {
        return _super.call(this) || this;
    }
    /**
     * ??????????????????
     * @param str
     * @returns {string}
     */
    StringUtils.prototype.trimSpace = function (str) {
        return str.replace(/^\s*(.*?)[\s\n]*$/g, '$1');
    };
    /**
     * ?????????????????????????????????2
     * @param str
     */
    StringUtils.prototype.getStringLength = function (str) {
        var strArr = str.split("");
        var length = 0;
        for (var i = 0; i < strArr.length; i++) {
            var s = strArr[i];
            if (this.isChinese(s)) {
                length += 2;
            }
            else {
                length += 1;
            }
        }
        return length;
    };
    /**
     * ???????????????????????????????????????
     * @param str
     * @returns {boolean}
     */
    StringUtils.prototype.isChinese = function (str) {
        var reg = /^.*[\u4E00-\u9FA5]+.*$/;
        return reg.test(str);
    };
    /**
     * ?????????????????? "{0},{1}.format("text0","text1")
     */
    StringUtils.prototype.format = function (val) {
        var param = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            param[_i - 1] = arguments[_i];
        }
        for (var i = 0, len = param.length; i < len; i++) {
            var reg = new RegExp("({)" + i + "(})", "g");
            val = val.replace(reg, param[i]);
        }
        return val;
    };
    return StringUtils;
}(SingtonClass));
__reflect(StringUtils.prototype, "StringUtils");
/**
 * Created by Saco on 2015/10/26.
 */
var TextFlowMaker = (function (_super) {
    __extends(TextFlowMaker, _super);
    function TextFlowMaker() {
        var _this = _super.call(this) || this;
        _this.STYLE_COLOR = "C";
        _this.STYLE_SIZE = "S";
        _this.PROP_TEXT = "T";
        return _this;
    }
    /**
     * "??????|S:18&C:0xffff00&T:???????????????|S:50&T:????????????|C:0x0000ff&T:????????????";
     * @param sourceText
     * @returns {Array}
     */
    TextFlowMaker.prototype.generateTextFlow = function (sourceText) {
        var textArr = sourceText.split("|");
        var result = [];
        for (var i = 0, len = textArr.length; i < len; i++) {
            result.push(this.getSingleTextFlow(textArr[i]));
        }
        return result;
    };
    TextFlowMaker.prototype.getSingleTextFlow = function (text) {
        var textArr = text.split("&");
        var tempArr;
        var textFlow = { "style": {} };
        for (var i = 0, len = textArr.length; i < len; i++) {
            tempArr = textArr[i].split(":");
            if (tempArr[0] == this.PROP_TEXT) {
                textFlow.text = tempArr[1];
            }
            else if (tempArr[0] == this.STYLE_SIZE) {
                textFlow.style.size = parseInt(tempArr[1]);
            }
            else if (tempArr[0] == this.STYLE_COLOR) {
                textFlow.style.textColor = parseInt(tempArr[1]);
            }
            else {
                textFlow.text = tempArr[0];
            }
        }
        return textFlow;
    };
    return TextFlowMaker;
}(SingtonClass));
__reflect(TextFlowMaker.prototype, "TextFlowMaker");
/**
 * Created by yangsong on 2014/11/23.
 * Timer?????????
 */
var TimerManager = (function (_super) {
    __extends(TimerManager, _super);
    /**
     * ????????????
     */
    function TimerManager() {
        var _this = _super.call(this) || this;
        _this._handlers = new Array();
        _this._delHandlers = new Array();
        _this._currTime = egret.getTimer();
        _this._currFrame = 0;
        _this._count = 0;
        _this._timeScale = 1;
        egret.Ticker.getInstance().register(_this.onEnterFrame, _this);
        return _this;
    }
    /**
     * ??????????????????
     * @param timeScale
     */
    TimerManager.prototype.setTimeScale = function (timeScale) {
        this._timeScale = timeScale;
    };
    /**
     * ??????????????????
     * @param frameTime
     */
    TimerManager.prototype.onEnterFrame = function () {
        if (this._isPause) {
            return;
        }
        this._currFrame++;
        this._currTime = egret.getTimer();
        //App.DebugUtils.start("TimerManager:");
        while (this._delHandlers.length) {
            this.removeHandle(this._delHandlers.pop());
        }
        for (var i = 0; i < this._count; i++) {
            var handler = this._handlers[i];
            if (this._delHandlers.indexOf(handler) != -1) {
                continue;
            }
            var t = handler.userFrame ? this._currFrame : this._currTime;
            if (t >= handler.exeTime) {
                //App.DebugUtils.start(handler.method.toString());
                handler.method.call(handler.methodObj, (this._currTime - handler.dealTime) * this._timeScale);
                App.DebugUtils.stop(handler.method.toString());
                handler.dealTime = this._currTime;
                handler.exeTime += handler.delay;
                if (!handler.repeat) {
                    if (handler.repeatCount > 1) {
                        handler.repeatCount--;
                    }
                    else {
                        if (handler.complateMethod) {
                            handler.complateMethod.apply(handler.complateMethodObj);
                        }
                        if (this._delHandlers.indexOf(handler) == -1) {
                            this._delHandlers.push(handler);
                        }
                    }
                }
            }
        }
        App.DebugUtils.stop("TimerManager:");
    };
    TimerManager.prototype.removeHandle = function (handler) {
        var i = this._handlers.indexOf(handler);
        if (i == -1) {
            Log.warn("what????");
            return;
        }
        this._handlers.splice(i, 1);
        ObjectPool.push(handler);
        this._count--;
    };
    TimerManager.prototype.create = function (useFrame, delay, repeatCount, method, methodObj, complateMethod, complateMethodObj) {
        //????????????
        if (delay < 0 || repeatCount < 0 || method == null) {
            return;
        }
        //??????????????????????????????
        this.remove(method, methodObj);
        //??????
        var handler = ObjectPool.pop("TimerHandler2");
        handler.userFrame = useFrame;
        handler.repeat = repeatCount == 0;
        handler.repeatCount = repeatCount;
        handler.delay = delay;
        handler.method = method;
        handler.methodObj = methodObj;
        handler.complateMethod = complateMethod;
        handler.complateMethodObj = complateMethodObj;
        handler.exeTime = delay + (useFrame ? this._currFrame : this._currTime);
        handler.dealTime = this._currTime;
        this._handlers.push(handler);
        this._count++;
    };
    /**
     * ?????????????????????????????????????????????????????????????????????
     * @param delay ????????????:??????
     * @param method ????????????
     * @param methodObj ????????????????????????
     */
    TimerManager.prototype.setTimeOut = function (delay, method, methodObj) {
        this.doTimer(delay, 1, method, methodObj);
    };
    /**
     * ??????????????????????????????????????????
     * @param delay ????????????:??????
     * @param method ????????????
     * @param methodObj ????????????????????????
     */
    TimerManager.prototype.setFrameOut = function (delay, method, methodObj) {
        this.doFrame(delay, 1, method, methodObj);
    };
    /**
     *
     * ????????????
     * @param delay ????????????:??????
     * @param repeatCount ????????????, 0????????????
     * @param method ????????????
     * @param methodObj ????????????????????????
     * @param complateMethod ??????????????????
     * @param complateMethodObj ??????????????????????????????
     *
     */
    TimerManager.prototype.doTimer = function (delay, repeatCount, method, methodObj, complateMethod, complateMethodObj) {
        if (complateMethod === void 0) { complateMethod = null; }
        if (complateMethodObj === void 0) { complateMethodObj = null; }
        this.create(false, delay, repeatCount, method, methodObj, complateMethod, complateMethodObj);
    };
    /**
     *
     * ????????????
     * @param delay ????????????:??????
     * @param repeatCount ????????????, 0????????????
     * @param method ????????????
     * @param methodObj ????????????????????????
     * @param complateMethod ??????????????????
     * @param complateMethodObj ??????????????????????????????
     *
     */
    TimerManager.prototype.doFrame = function (delay, repeatCount, method, methodObj, complateMethod, complateMethodObj) {
        if (complateMethod === void 0) { complateMethod = null; }
        if (complateMethodObj === void 0) { complateMethodObj = null; }
        this.create(true, delay, repeatCount, method, methodObj, complateMethod, complateMethodObj);
    };
    Object.defineProperty(TimerManager.prototype, "count", {
        /**
         * ?????????????????????
         * @return
         *
         */
        get: function () {
            return this._count;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * ??????
     * @param method ??????????????????
     * @param methodObj ?????????????????????????????????
     */
    TimerManager.prototype.remove = function (method, methodObj) {
        for (var i = 0; i < this._count; i++) {
            var handler = this._handlers[i];
            if (handler.method == method && handler.methodObj == methodObj && this._delHandlers.indexOf(handler) == -1) {
                this._delHandlers.push(handler);
                break;
            }
        }
    };
    /**
     * ??????
     * @param methodObj ?????????????????????????????????
     */
    TimerManager.prototype.removeAll = function (methodObj) {
        for (var i = 0; i < this._count; i++) {
            var handler = this._handlers[i];
            if (handler.methodObj == methodObj && this._delHandlers.indexOf(handler) == -1) {
                this._delHandlers.push(handler);
            }
        }
    };
    /**
     * ????????????????????????
     * @param method
     * @param methodObj
     *
     */
    TimerManager.prototype.isExists = function (method, methodObj) {
        for (var i = 0; i < this._count; i++) {
            var handler = this._handlers[i];
            if (handler.method == method && handler.methodObj == methodObj && this._delHandlers.indexOf(handler) == -1) {
                return true;
            }
        }
        return false;
    };
    /**
     * ??????
     */
    TimerManager.prototype.pause = function () {
        if (this._isPause) {
            return;
        }
        this._isPause = true;
        this._pauseTime = egret.getTimer();
    };
    /**
     * ??????????????????
     */
    TimerManager.prototype.resume = function () {
        if (!this._isPause) {
            return;
        }
        this._isPause = false;
        this._currTime = egret.getTimer();
        var gap = this._currTime - this._pauseTime;
        for (var i = 0; i < this._count; i++) {
            var handler = this._handlers[i];
            handler.dealTime += gap;
            if (!handler.userFrame) {
                handler.exeTime += gap;
            }
        }
    };
    return TimerManager;
}(SingtonClass));
__reflect(TimerManager.prototype, "TimerManager");
var TimerHandler2 = (function () {
    function TimerHandler2() {
        /**????????????*/
        this.delay = 0;
        /**??????????????????*/
        this.repeatCount = 0;
        /**????????????*/
        this.exeTime = 0;
        /**?????????????????????*/
        this.dealTime = 0;
    }
    /**??????*/
    TimerHandler2.prototype.clear = function () {
        this.method = null;
        this.methodObj = null;
        this.complateMethod = null;
        this.complateMethodObj = null;
    };
    return TimerHandler2;
}());
__reflect(TimerHandler2.prototype, "TimerHandler2");
/**
 * Created by Saco on 2015/1/14.
 * hack?????????????????????
 */
var TouchEventHook = (function (_super) {
    __extends(TouchEventHook, _super);
    function TouchEventHook() {
        var _this = _super.call(this) || this;
        _this._eventCallDic = {};
        return _this;
    }
    Object.defineProperty(TouchEventHook.prototype, "systemTouch", {
        get: function () {
            return egret.sys.$TempStage.$screen["webTouchHandler"].touch;
        },
        enumerable: true,
        configurable: true
    });
    /*
    * eventType:?????????????????????TOUCH_BEGIN???TOUCH_MOVE???TOUCH_END
    * bindCall:????????????????????????????????????x,y,identifier
    * */
    TouchEventHook.prototype.hookTouchEvent = function (eventType, bindCall) {
        if (!this._eventCallDic.hasOwnProperty(eventType)) {
            this.restoreEvent(eventType);
        }
        switch (eventType) {
            case egret.TouchEvent.TOUCH_BEGIN: {
                this.systemTouch.onTouchBegan = bindCall;
                break;
            }
            case egret.TouchEvent.TOUCH_MOVE: {
                this.systemTouch.onTouchMove = bindCall;
                break;
            }
            case egret.TouchEvent.TOUCH_END: {
                this.systemTouch.onTouchEnd = bindCall;
                break;
            }
        }
    };
    TouchEventHook.prototype.restoreEvent = function (eventType) {
        switch (eventType) {
            case egret.TouchEvent.TOUCH_BEGIN: {
                this._eventCallDic[eventType] = this.systemTouch.onTouchBegan;
                break;
            }
            case egret.TouchEvent.TOUCH_MOVE: {
                this._eventCallDic[eventType] = this.systemTouch.onTouchMove;
                break;
            }
            case egret.TouchEvent.TOUCH_END: {
                this._eventCallDic[eventType] = this.systemTouch.onTouchEnd;
                break;
            }
        }
    };
    /*
    * ???????????????????????????
    * eventType:?????????????????????TOUCH_BEGIN???TOUCH_MOVE???TOUCH_END
    */
    TouchEventHook.prototype.releaseTouchEvent = function (eventType) {
        switch (eventType) {
            case egret.TouchEvent.TOUCH_BEGIN: {
                this.systemTouch.onTouchBegan = this._eventCallDic[eventType];
                break;
            }
            case egret.TouchEvent.TOUCH_MOVE: {
                this.systemTouch.onTouchMove = this._eventCallDic[eventType];
                break;
            }
            case egret.TouchEvent.TOUCH_END: {
                this.systemTouch.onTouchEnd = this._eventCallDic[eventType];
                break;
            }
        }
    };
    return TouchEventHook;
}(SingtonClass));
__reflect(TouchEventHook.prototype, "TouchEventHook");
/**
 * Tween?????????
 */
var TweenUtils = (function (_super) {
    __extends(TweenUtils, _super);
    function TweenUtils() {
        return _super.call(this) || this;
    }
    /**
     * ???????????????Tween
     */
    TweenUtils.prototype.pause = function () {
        var tweens = egret.Tween["_tweens"];
        for (var i = 0, l = tweens.length; i < l; i++) {
            var tween_2 = tweens[i];
            tween_2.paused = true;
        }
    };
    /**
     * ??????????????????
     */
    TweenUtils.prototype.resume = function () {
        var tweens = egret.Tween["_tweens"];
        for (var i = 0, l = tweens.length; i < l; i++) {
            var tween_2 = tweens[i];
            tween_2.paused = false;
        }
    };
    return TweenUtils;
}(SingtonClass));
__reflect(TweenUtils.prototype, "TweenUtils");
/**
 * Created by Administrator on 2014/11/23.
 */
var ControllerConst;
(function (ControllerConst) {
    ControllerConst[ControllerConst["Loading"] = 10000] = "Loading";
    ControllerConst[ControllerConst["Login"] = 10001] = "Login";
    ControllerConst[ControllerConst["Home"] = 10002] = "Home";
    ControllerConst[ControllerConst["Friend"] = 10003] = "Friend";
    ControllerConst[ControllerConst["Shop"] = 10004] = "Shop";
    ControllerConst[ControllerConst["Warehouse"] = 10005] = "Warehouse";
    ControllerConst[ControllerConst["Factory"] = 10006] = "Factory";
    ControllerConst[ControllerConst["Task"] = 10007] = "Task";
    ControllerConst[ControllerConst["Mail"] = 10008] = "Mail";
    ControllerConst[ControllerConst["Game"] = 10009] = "Game";
    ControllerConst[ControllerConst["RpgGame"] = 10010] = "RpgGame";
    ControllerConst[ControllerConst["AdsView"] = 10011] = "AdsView";
    ControllerConst[ControllerConst["LevelRewardView"] = 10012] = "LevelRewardView";
    ControllerConst[ControllerConst["SettingView"] = 10013] = "SettingView";
    ControllerConst[ControllerConst["SettlementView"] = 10014] = "SettlementView";
    ControllerConst[ControllerConst["MatchingView"] = 10015] = "MatchingView";
    ControllerConst[ControllerConst["ExplainView"] = 10016] = "ExplainView";
})(ControllerConst || (ControllerConst = {}));
var EventNames = (function () {
    function EventNames() {
    }
    EventNames.Login_Succ = "LoginSucc"; //????????????
    EventNames.Login_Error = "Login_Error"; //????????????
    EventNames.Role_Choose = "Role_Choose"; //????????????
    EventNames.Rolo_INFO = "Rolo_INFO"; //????????????????????????
    EventNames.Pet_unlock = "Pet_unlock"; //????????????
    EventNames.Pet_uplevel = "Pet_uplevel"; //????????????
    EventNames.Role_update = "Role_update"; //??????????????????
    EventNames.Kill_Monster = "Kill_Monster"; //????????????
    EventNames.Fight_End = "Fight_End"; //????????????  ????????????????????????
    EventNames.Load_text = "Load_text"; //loading
    return EventNames;
}());
__reflect(EventNames.prototype, "EventNames");
/**
 * Created by Administrator on 2014/11/23.
 */
var HttpConst = (function () {
    function HttpConst() {
    }
    HttpConst.USER_LOGIN = "User.login";
    return HttpConst;
}());
__reflect(HttpConst.prototype, "HttpConst");
/**
 * Created by yangsong on 2014/11/28.
 */
var SceneConsts;
(function (SceneConsts) {
    /**
     * Game??????
     * @type {number}
     */
    SceneConsts[SceneConsts["Game"] = 1] = "Game";
    /**
     * ????????????
     * @type {number}
     */
    SceneConsts[SceneConsts["UI"] = 2] = "UI";
    /**
     * Loading??????
     * @type {number}
     */
    SceneConsts[SceneConsts["LOADING"] = 3] = "LOADING";
    /**
     * RpgGame??????
     * @type {number}
     */
    SceneConsts[SceneConsts["RpgGame"] = 4] = "RpgGame";
})(SceneConsts || (SceneConsts = {}));
/**
 * Created by Administrator on 2014/11/23.
 */
var ViewConst;
(function (ViewConst) {
    ViewConst[ViewConst["Loading"] = 10000] = "Loading";
    ViewConst[ViewConst["Login"] = 10001] = "Login";
    ViewConst[ViewConst["Home"] = 10002] = "Home";
    ViewConst[ViewConst["Friend"] = 10003] = "Friend";
    ViewConst[ViewConst["Shop"] = 10004] = "Shop";
    ViewConst[ViewConst["Warehouse"] = 10005] = "Warehouse";
    ViewConst[ViewConst["Factory"] = 10006] = "Factory";
    ViewConst[ViewConst["Task"] = 10007] = "Task";
    ViewConst[ViewConst["Daily"] = 10008] = "Daily";
    ViewConst[ViewConst["Mail"] = 10009] = "Mail";
    ViewConst[ViewConst["MonsterIntro"] = 10010] = "MonsterIntro";
    ViewConst[ViewConst["MonsterList"] = 10011] = "MonsterList";
    ViewConst[ViewConst["Game"] = 20000] = "Game";
    ViewConst[ViewConst["GameUI"] = 20001] = "GameUI";
    ViewConst[ViewConst["RpgGame"] = 20002] = "RpgGame";
    ViewConst[ViewConst["AdsView"] = 20003] = "AdsView";
    ViewConst[ViewConst["LevelRewardView"] = 20004] = "LevelRewardView";
    ViewConst[ViewConst["SettingView"] = 20005] = "SettingView";
    ViewConst[ViewConst["SettlementView"] = 20006] = "SettlementView";
    ViewConst[ViewConst["MatchingView"] = 20007] = "MatchingView";
    ViewConst[ViewConst["ExplainView"] = 20008] = "ExplainView";
})(ViewConst || (ViewConst = {}));
/**
 * Created by yangsong on 15-1-16.
 * DragonBonesArmature??????????????????????????????????????????DragonBonesArmature?????????
 */
var DragonBonesArmatureContainer = (function (_super) {
    __extends(DragonBonesArmatureContainer, _super);
    /**
     * ????????????
     */
    function DragonBonesArmatureContainer() {
        var _this = _super.call(this) || this;
        _this.armatures = new Array();
        _this.actions = {};
        _this.cacheBones = {};
        return _this;
    }
    /**
     * ??????????????????DragonBonesArmature
     * @param $armature DragonBonesArmature
     * @param $actions ??????DragonBonesArmature???????????????
     */
    DragonBonesArmatureContainer.prototype.register = function ($armature, $actions) {
        this.armatures.push($armature);
        for (var i = 0, len = $actions.length; i < len; i++) {
            this.actions[$actions[i]] = this.armatures.length - 1;
        }
    };
    Object.defineProperty(DragonBonesArmatureContainer.prototype, "armature", {
        /**
         * ?????????????????????armature
         * @returns {DragonBonesArmature}
         */
        get: function () {
            return this.armatures[this.currArmatureIndex];
        },
        enumerable: true,
        configurable: true
    });
    /**
     * ??????Bone
     * @param boneName
     * @returns {any}
     */
    DragonBonesArmatureContainer.prototype.getCacheBone = function (boneName) {
        if (!this.cacheBones[boneName]) {
            this.cacheBones[boneName] = [];
            for (var i = 0, len = this.armatures.length; i < len; i++) {
                var arm = this.armatures[i];
                this.cacheBones[boneName].push(arm.getBone(boneName));
            }
        }
        return this.cacheBones[boneName][this.currArmatureIndex];
    };
    /**
     * ????????????
     * @param action
     * @param playNum
     */
    DragonBonesArmatureContainer.prototype.play = function (action, playNum) {
        if (playNum === void 0) { playNum = undefined; }
        if (this.actions[action] == null) {
            Log.debug("DragonBonesArmatureContainer??????????????????", action);
            return;
        }
        var armatureIndex = this.actions[action];
        if (armatureIndex != this.currArmatureIndex) {
            this.remove();
        }
        var newArm = this.armatures[armatureIndex];
        if (newArm) {
            this.addChild(newArm);
            this.currArmatureIndex = armatureIndex;
            return newArm.play(action, playNum);
        }
        return null;
    };
    /**
     * ????????????DragonBonesArmature
     */
    DragonBonesArmatureContainer.prototype.stop = function () {
        var currArm = this.armatures[this.currArmatureIndex];
        if (currArm) {
            currArm.stop();
        }
    };
    /**
     * ??????
     */
    DragonBonesArmatureContainer.prototype.start = function () {
        var currArm = this.armatures[this.currArmatureIndex];
        if (currArm) {
            currArm.start();
        }
    };
    /**
     * ???????????????DragonBonesArmature
     */
    DragonBonesArmatureContainer.prototype.remove = function () {
        var oldArm = this.armatures[this.currArmatureIndex];
        if (oldArm) {
            oldArm.stop();
            App.DisplayUtils.removeFromParent(oldArm);
            this.currArmatureIndex = null;
        }
    };
    /**
     * ??????????????????????????????
     * @param callFunc
     * @param target
     */
    DragonBonesArmatureContainer.prototype.addCompleteCallFunc = function (callFunc, target) {
        for (var i = 0, len = this.armatures.length; i < len; i++) {
            var arm = this.armatures[i];
            arm.addCompleteCallFunc(callFunc, target);
        }
    };
    /**
     * ??????????????????????????????
     * @param callFunc
     * @param target
     */
    DragonBonesArmatureContainer.prototype.removeCompleteCallFunc = function (callFunc, target) {
        for (var i = 0, len = this.armatures.length; i < len; i++) {
            var arm = this.armatures[i];
            arm.removeCompleteCallFunc(callFunc, target);
        }
    };
    /**
     * ???????????????????????????
     * @param callFunc
     * @param target
     */
    DragonBonesArmatureContainer.prototype.addFrameCallFunc = function (callFunc, target) {
        for (var i = 0, len = this.armatures.length; i < len; i++) {
            var arm = this.armatures[i];
            arm.addFrameCallFunc(callFunc, target);
        }
    };
    /**
     * ???????????????????????????
     * @param key
     * @param callFunc
     * @param target
     */
    DragonBonesArmatureContainer.prototype.removeFrameCallFunc = function (callFunc, target) {
        for (var i = 0, len = this.armatures.length; i < len; i++) {
            var arm = this.armatures[i];
            arm.removeFrameCallFunc(callFunc, target);
        }
    };
    /**
     * ??????
     */
    DragonBonesArmatureContainer.prototype.clear = function () {
        while (this.armatures.length) {
            var arm = this.armatures.pop();
            App.DisplayUtils.removeFromParent(arm);
            arm.destroy();
        }
        this.cacheBones = {};
        this.actions = {};
    };
    /**
     * ??????
     */
    DragonBonesArmatureContainer.prototype.destroy = function () {
        this.clear();
        this.armatures = null;
        this.cacheBones = null;
        this.actions = null;
    };
    return DragonBonesArmatureContainer;
}(egret.DisplayObjectContainer));
__reflect(DragonBonesArmatureContainer.prototype, "DragonBonesArmatureContainer");
var Menu = (function (_super) {
    __extends(Menu, _super);
    function Menu() {
        return _super.call(this) || this;
    }
    return Menu;
}(eui.Component));
__reflect(Menu.prototype, "Menu");
/**
 * ??????????????????
 */
var SaleItemRenderer = (function (_super) {
    __extends(SaleItemRenderer, _super);
    function SaleItemRenderer() {
        return _super.call(this) || this;
    }
    SaleItemRenderer.prototype.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        if (this.titleDisplay) {
            this.titleDisplay.text = this.data.title;
        }
        if (this.priceDisplay) {
            this.priceDisplay.text = this.data.price;
        }
        if (this.timeDisplay) {
            this.timeDisplay.text = this.data.time;
        }
        if (this.iconDisplay) {
            this.iconDisplay.source = this.data.icon;
        }
    };
    SaleItemRenderer.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
        if (!this.data)
            return;
        if (instance == this.titleDisplay) {
            this.titleDisplay.text = this.data.title;
        }
        if (instance == this.priceDisplay) {
            this.priceDisplay.text = this.data.price;
        }
        if (instance == this.timeDisplay) {
            this.timeDisplay.text = this.data.time;
        }
        if (instance == this.iconDisplay) {
            this.iconDisplay.source = this.data.icon;
        }
    };
    return SaleItemRenderer;
}(eui.ItemRenderer));
__reflect(SaleItemRenderer.prototype, "SaleItemRenderer");
/**
 * tabbar?????????
 */
var TabBarButton = (function (_super) {
    __extends(TabBarButton, _super);
    function TabBarButton() {
        return _super.call(this) || this;
    }
    Object.defineProperty(TabBarButton.prototype, "data", {
        get: function () {
            return this.mydata;
        },
        set: function (value) {
            this.mydata = value;
            if (this.iconDisplay) {
                this.iconDisplay.source = this.data.title;
            }
            if (this.iconDisplaySelected) {
                this.iconDisplaySelected.source = this.data.titleSelected;
            }
        },
        enumerable: true,
        configurable: true
    });
    TabBarButton.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
        if (!this.data)
            return;
        if (instance == this.iconDisplay) {
            this.iconDisplay.source = this.data.title;
        }
        if (instance == this.iconDisplaySelected) {
            this.iconDisplaySelected.source = this.data.titleSelected;
        }
    };
    return TabBarButton;
}(eui.ItemRenderer));
__reflect(TabBarButton.prototype, "TabBarButton");
/**
 * tabbar??????????????????
 */
var TabBarContainer = (function (_super) {
    __extends(TabBarContainer, _super);
    function TabBarContainer(skinName) {
        if (skinName === void 0) { skinName = null; }
        var _this = _super.call(this) || this;
        //????????????
        if (!skinName) {
            skinName = "resource/skins/TabBarSkin.exml";
        }
        _this._tabBarItemRendererSkinName = "resource/skins/TabBarButtonSkin.exml";
        _this._tabBarItemRenderer = TabBarButton;
        _this._dp = new eui.ArrayCollection();
        _this._views = [];
        _this.skinName = skinName;
        return _this;
    }
    TabBarContainer.prototype.onTabBarIndexChanged = function (e) {
        this.viewStack.selectedIndex = this.tabBar.selectedIndex;
    };
    TabBarContainer.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
        if (instance == this.tabBar) {
            this.tabBar.itemRendererSkinName = this._tabBarItemRendererSkinName;
            this.tabBar.itemRenderer = this._tabBarItemRenderer;
            this.tabBar.dataProvider = this._dp;
            this.tabBar.addEventListener(egret.Event.CHANGE, this.onTabBarIndexChanged, this);
        }
        else if (instance == this.viewStack) {
            for (var i = 0; i < this._views.length; i++) {
                this.viewStack.addChild(this._views[i]);
            }
            this._views.length = 0;
            this.tabBar.selectedIndex = 0;
            this.viewStack.selectedIndex = 0;
        }
    };
    Object.defineProperty(TabBarContainer.prototype, "tabBarItemRendererSkinName", {
        set: function (value) {
            this._tabBarItemRendererSkinName = value;
            if (this.tabBar) {
                this.tabBar.itemRendererSkinName = this._tabBarItemRendererSkinName;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabBarContainer.prototype, "tabBarItemRenderer", {
        set: function (value) {
            this._tabBarItemRenderer = value;
            if (this.tabBar) {
                this.tabBar.itemRenderer = this._tabBarItemRenderer;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     *  ???????????????ViewStack
     * @param title
     * @param titleSelected
     * @param content
     */
    TabBarContainer.prototype.addViewStackElement = function (title, titleSelected, content) {
        this._dp.addItem({ "title": title, "titleSelected": titleSelected });
        if (this.viewStack) {
            this.viewStack.addChild(content);
        }
        else {
            this._views.push(content);
        }
    };
    return TabBarContainer;
}(eui.Component));
__reflect(TabBarContainer.prototype, "TabBarContainer");
/**
 * ??????????????????
 */
var TaskItemRenderer = (function (_super) {
    __extends(TaskItemRenderer, _super);
    function TaskItemRenderer() {
        return _super.call(this) || this;
    }
    TaskItemRenderer.prototype.dataChanged = function () {
        _super.prototype.dataChanged.call(this);
        if (this.iconDisplay) {
            this.iconDisplay.source = this.data.icon;
        }
        if (this.goldDisplay) {
            this.goldDisplay.text = this.data.gold;
        }
        if (this.seedDisplay) {
            this.seedDisplay.text = this.data.seed;
        }
        if (this.progressDisplay) {
            this.progressDisplay.text = this.data.progress;
        }
        if (this.labelDisplay) {
            this.labelDisplay.text = this.data.label;
        }
    };
    TaskItemRenderer.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
        if (!this.data)
            return;
        if (instance == this.iconDisplay) {
            this.iconDisplay.source = this.data.icon;
        }
        if (instance == this.goldDisplay) {
            this.goldDisplay.text = this.data.gold;
        }
        if (instance == this.seedDisplay) {
            this.seedDisplay.text = this.data.seed;
        }
        if (instance == this.progressDisplay) {
            this.progressDisplay.text = this.data.progress;
        }
        if (instance == this.labelDisplay) {
            this.labelDisplay.text = this.data.label;
        }
    };
    return TaskItemRenderer;
}(eui.ItemRenderer));
__reflect(TaskItemRenderer.prototype, "TaskItemRenderer");
/**
 * Created by egret on 15-1-6.
 */
var GameConst = (function () {
    function GameConst() {
    }
    GameConst.Get_Hero = 10000;
    GameConst.Remove_Enemy = 10001;
    GameConst.HEART = 20000;
    return GameConst;
}());
__reflect(GameConst.prototype, "GameConst");
/**
 * Created by egret on 15-1-16.
 */
var GameController = (function (_super) {
    __extends(GameController, _super);
    function GameController() {
        var _this = _super.call(this) || this;
        /**
         * ???????????????????????????????????????
         */
        _this.checkHitRectangle_Att = new egret.Rectangle();
        _this.checkHitRectangle_Def = new egret.Rectangle();
        _this.canAttackObjs = new Array();
        _this.gameView = new GameView(_this, LayerManager.Game_Main);
        App.ViewManager.register(ViewConst.Game, _this.gameView);
        _this.gameUIView = new GameUIView(_this, LayerManager.Game_Main);
        App.ViewManager.register(ViewConst.GameUI, _this.gameUIView);
        _this.registerFunc(GameConst.Get_Hero, _this.getHero, _this);
        _this.registerFunc(GameConst.Remove_Enemy, _this.removeEnemy, _this);
        return _this;
    }
    /**
     * ????????????
     * @returns {Hero}
     */
    GameController.prototype.getHero = function () {
        return this.gameView.hero;
    };
    GameController.prototype.removeEnemy = function (enemy) {
        this.gameView.removeEnemy(enemy);
    };
    /**
     * ??????
     */
    GameController.prototype.shock = function () {
        App.ShockUtils.shock(App.ShockUtils.MAP, this.gameView);
    };
    /**
     * ?????????
     */
    GameController.prototype.slowMotion = function () {
        App.ShockUtils.destroy();
        App.AnchorUtils.setAnchor(this.gameView, 0.5);
        this.gameView.x = App.StageUtils.getWidth() * 0.5;
        this.gameView.y = App.StageUtils.getHeight() * 0.5;
        this.gameView.width = App.StageUtils.getWidth();
        this.gameView.height = App.StageUtils.getHeight();
        App.TimerManager.setTimeScale(0.1);
        egret.Tween.get(this.gameView).to({ scaleX: 1.1, scaleY: 1.1 }, 1200).to({
            scaleX: 1,
            scaleY: 1
        }, 300).call(this.slowMotionEnd, this);
    };
    GameController.prototype.slowMotionEnd = function () {
        App.AnchorUtils.setAnchor(this.gameView, 0);
        this.gameView.x = 0;
        this.gameView.y = 0;
        App.TimerManager.setTimeScale(1);
    };
    /**
     * ?????????????????????
     */
    GameController.prototype.getMyAttackObjects = function (me, meAttackDis) {
        this.canAttackObjs.length = 0;
        if (me instanceof Enemy) {
            if (!this.gameView.hero.isLand && this.checkIsInDis(me, this.gameView.hero, meAttackDis)) {
                this.canAttackObjs.push(this.gameView.hero);
            }
        }
        else if (me instanceof Hero) {
            for (var i = 0, len = this.gameView.enemys.length; i < len; i++) {
                var enemy = this.gameView.enemys[i];
                if (enemy.isDie)
                    continue;
                if (enemy.isLand)
                    continue;
                if (!enemy.isInScreen)
                    continue;
                if (this.checkIsInDis(me, enemy, meAttackDis)) {
                    this.canAttackObjs.push(enemy);
                }
            }
        }
        return this.canAttackObjs;
    };
    /**
     * ??????????????????????????????
     * @param me
     */
    GameController.prototype.getMyNearAttackObjects = function (me) {
        if (me instanceof Enemy) {
            return this.gameView.hero;
        }
        else if (me instanceof Hero) {
        }
        return null;
    };
    GameController.prototype.checkIsInDis = function (attactObj, defenceObj, attackDis) {
        var front = attackDis[0]; //???
        var back = attackDis[1]; //???
        var left = attackDis[2]; //???
        var right = attackDis[3]; //???
        var top = attackDis[4]; //???
        var down = attackDis[5]; //???
        var ylen = defenceObj.y <= attactObj.y ? left : right;
        this.checkHitRectangle_Att.x = attactObj.x - (attactObj.scaleX == 1 ? back : front);
        this.checkHitRectangle_Att.y = attactObj.z - top;
        this.checkHitRectangle_Att.width = front + back;
        this.checkHitRectangle_Att.height = top + down;
        this.checkHitRectangle_Def.x = defenceObj.x - defenceObj.width * 0.5;
        this.checkHitRectangle_Def.y = defenceObj.z - defenceObj.height;
        this.checkHitRectangle_Def.width = defenceObj.width;
        this.checkHitRectangle_Def.height = defenceObj.height;
        return Math.abs(defenceObj.y - attactObj.y) <= ylen && this.checkHitRectangle_Att.intersects(this.checkHitRectangle_Def);
    };
    return GameController;
}(BaseController));
__reflect(GameController.prototype, "GameController");
/**
 * Created by egret on 15-1-19.
 */
var GameData = (function () {
    function GameData() {
    }
    return GameData;
}());
__reflect(GameData.prototype, "GameData");
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var LoadingUI = (function (_super) {
    __extends(LoadingUI, _super);
    function LoadingUI() {
        var _this = _super.call(this) || this;
        _this.createView();
        return _this;
    }
    LoadingUI.prototype.createView = function () {
        this.startLoad();
        this.textField = new egret.TextField();
        this.addChild(this.textField);
        this.textField.y = 300;
        this.textField.width = 480;
        this.textField.height = 100;
        this.textField.textAlign = "center";
    };
    LoadingUI.prototype.startLoad = function () {
        //?????? ImageLoader ??????
        var loader = new egret.ImageLoader();
        //????????????????????????
        loader.addEventListener(egret.Event.COMPLETE, this.onLoadComplete, this);
        var url = "https://yqllm.wangqucc.com/gameres/dld//resource/assets/launch/launch_bg.jpg";
        //????????????
        loader.load(url);
    };
    LoadingUI.prototype.onLoadComplete = function (event) {
        var loader = event.target;
        //??????????????????????????????
        var bitmapData = loader.data;
        //??????????????????
        var texture = new egret.Texture();
        texture.bitmapData = bitmapData;
        //?????? Bitmap ????????????
        this.addChildAt(new egret.Bitmap(texture), 0);
    };
    LoadingUI.prototype.setProgress = function (current, total) {
        this.textField.text = "Loading..." /*+ current + "/" + total*/;
    };
    return LoadingUI;
}(egret.Sprite));
__reflect(LoadingUI.prototype, "LoadingUI");
/**
 * Created by yangsong on 15-1-15.
 */
var GameView = (function (_super) {
    __extends(GameView, _super);
    function GameView($controller, $parent) {
        var _this = _super.call(this, $controller, $parent) || this;
        _this.controller = $controller;
        return _this;
    }
    /**
     *???????????????????????????????????????????????????
     *
     */
    GameView.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        GameData.MIN_X = 50;
        GameData.MAX_X = App.StageUtils.getWidth() - 50;
        GameData.MIN_Y = App.StageUtils.getHeight() - 300;
        GameData.MAX_Y = App.StageUtils.getHeight() - 10;
        this.bg = App.DisplayUtils.createBitmap("map_jpg");
        App.AnchorUtils.setAnchorX(this.bg, 0.5);
        App.AnchorUtils.setAnchorY(this.bg, 1);
        this.bg.x = App.StageUtils.getWidth() * 0.5;
        this.bg.y = App.StageUtils.getHeight();
        this.addChild(this.bg);
        this.objectContainer = new egret.DisplayObjectContainer();
        this.addChild(this.objectContainer);
        //????????????????????????
        this.enemys = new Array();
        for (var i = 0; i < 4; i++) {
            var enemy = ObjectPool.pop("Enemy", this.controller);
            enemy.init();
            this.enemys.push(enemy);
        }
        while (this.enemys.length) {
            this.enemys.pop().destory();
        }
        //??????????????????Boss
        var boss = ObjectPool.pop("Boss", this.controller);
        boss.destory();
        //????????????
        this.hero = ObjectPool.pop("Hero", this.controller);
        this.hero.init();
        this.hero.x = App.StageUtils.getWidth() * 0.3;
        this.hero.y = App.StageUtils.getHeight() * 0.7;
        this.objectContainer.addChild(this.hero);
        //??????Enemy
        this.startCreateEnemy();
        if (!App.DeviceUtils.IsMobile) {
            this.touchEnabled = true;
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
        }
        //????????????
        App.TimerManager.doTimer(3, 0, this.sortGameObjs, this);
    };
    /**
     *????????????????????????????????????????????????
     *
     */
    GameView.prototype.initData = function () {
        _super.prototype.initData.call(this);
    };
    /**
     * ??????????????????
     */
    GameView.prototype.startCreateEnemy = function () {
        this.enemys.length = 0;
        App.TimerManager.doTimer(100, 0, this.createEnemy, this);
    };
    /**
     * ????????????
     */
    GameView.prototype.createEnemy = function () {
        this.enemys.push(this.createEnemySingle("Enemy"));
        if (this.enemys.length >= 4) {
            App.TimerManager.remove(this.createEnemy, this);
        }
    };
    /**
     * ??????Boss
     */
    GameView.prototype.createBoss = function () {
        for (var i = 0, len = this.enemys.length; i < len; i++) {
            if (this.enemys[i] instanceof Boss) {
                return;
            }
        }
        this.enemys.push(this.createEnemySingle("Boss"));
    };
    GameView.prototype.createEnemySingle = function (clsName) {
        var initX = Math.random() > 0.5 ? GameData.MAX_X + 200 : GameData.MIN_X - 200;
        var initY = App.RandomUtils.limit(GameData.MIN_Y, GameData.MAX_Y);
        var enemy = ObjectPool.pop(clsName, this.controller);
        enemy.init();
        enemy.x = initX;
        enemy.y = initY;
        enemy.setPos();
        enemy.scaleX = Math.random() < 0.5 ? 1 : -1;
        this.objectContainer.addChild(enemy);
        var gotoX = App.RandomUtils.limit(GameData.MIN_X, GameData.MAX_X);
        var gotoY = initY;
        enemy.command_in(3, gotoX, gotoY);
        return enemy;
    };
    GameView.prototype.removeEnemy = function (enemy) {
        var index = this.enemys.indexOf(enemy);
        if (index != -1) {
            this.enemys.splice(index, 1);
            if (this.enemys.length == 0) {
                this.startCreateEnemy();
            }
            else if (this.enemys.length == 2) {
                this.createBoss();
            }
        }
    };
    GameView.prototype.sortGameObjs = function () {
        this.objectContainer.$children.sort(this.sortF);
    };
    GameView.prototype.sortF = function (d1, d2) {
        if (d1.y > d2.y) {
            return 1;
        }
        else if (d1.y < d2.y) {
            return -1;
        }
        else {
            return 0;
        }
    };
    GameView.prototype.onClick = function (evt) {
        if (this.hero.isAttack) {
            return;
        }
        if (evt.localX < GameData.MIN_X
            || evt.localX > GameData.MAX_X
            || evt.localY < GameData.MIN_Y
            || evt.localY > GameData.MAX_Y) {
            return;
        }
        App.RockerUtils.stop();
        this.hero.walkTo(5, evt.localX, evt.localY);
    };
    return GameView;
}(BaseSpriteView));
__reflect(GameView.prototype, "GameView");
/**
 * Created by egret on 15-1-16.
 */
var MyButton = (function (_super) {
    __extends(MyButton, _super);
    function MyButton(buttonName, $x, $y, func, target) {
        var _this = _super.call(this) || this;
        _this._func = func;
        _this._target = target;
        _this.width = 100;
        _this.height = 40;
        _this.graphics.beginFill(0x333333, 1);
        _this.graphics.drawRect(0, 0, _this.width, _this.height);
        _this.graphics.endFill();
        var txt = new egret.TextField();
        txt.textColor = 0xFFFFFF;
        txt.textAlign = egret.HorizontalAlign.CENTER;
        txt.text = buttonName;
        txt.width = _this.width;
        txt.height = 20;
        txt.size = 20;
        txt.y = (_this.height - txt.height) * 0.5;
        _this.addChild(txt);
        _this.touchEnabled = true;
        _this.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.onClick, _this);
        _this.x = $x;
        _this.y = $y;
        return _this;
    }
    MyButton.prototype.onClick = function (e) {
        e.stopPropagation();
        if (this._func)
            this._func.call(this._target);
    };
    return MyButton;
}(egret.Sprite));
__reflect(MyButton.prototype, "MyButton");
/**
 * Created by egret on 15-1-14.
 * DragonBones?????????
 */
var DragonBonesFactory = (function (_super) {
    __extends(DragonBonesFactory, _super);
    /**
     * ????????????
     */
    function DragonBonesFactory() {
        var _this = _super.call(this) || this;
        _this.averageUtils = new AverageUtils();
        _this.factory = new dragonBones.EgretFactory();
        _this.clocks = new Array();
        _this.clocksLen = 0;
        _this.files = [];
        //????????????
        _this.start();
        return _this;
    }
    /**
     * ???????????????????????????
     * @param skeletonData ??????????????????
     * @param texture ????????????
     * @param textureData ????????????????????????
     */
    DragonBonesFactory.prototype.initArmatureFile = function (skeletonData, texture, textureData) {
        if (this.files.indexOf(skeletonData.name) != -1) {
            return;
        }
        this.addSkeletonData(skeletonData);
        this.addTextureAtlas(texture, textureData);
        this.files.push(skeletonData.name);
    };
    /**
     * ??????????????????
     * @param name
     */
    DragonBonesFactory.prototype.removeArmatureFile = function (name) {
        var index = this.files.indexOf(name);
        if (index != -1) {
            this.removeSkeletonData(name);
            this.removeTextureAtlas(name);
            this.files.splice(index, 1);
        }
    };
    /**
     * ??????????????????
     */
    DragonBonesFactory.prototype.clear = function () {
        while (this.files.length) {
            this.removeArmatureFile(this.files[0]);
        }
    };
    /**
     * ????????????????????????
     * @param skeletonData
     */
    DragonBonesFactory.prototype.addSkeletonData = function (skeletonData) {
        this.factory.parseDragonBonesData(skeletonData);
    };
    /**
     * ????????????????????????
     * @param texture ????????????
     * @param textureData ????????????????????????
     */
    DragonBonesFactory.prototype.addTextureAtlas = function (texture, textureData) {
        this.factory.parseTextureAtlasData(textureData, texture);
    };
    /**
     * ????????????????????????
     * @param skeletonData
     */
    DragonBonesFactory.prototype.removeSkeletonData = function (name) {
        this.factory.removeDragonBonesData(name);
    };
    /**
     * ????????????????????????
     * @param texture ????????????
     * @param textureData ????????????????????????
     */
    DragonBonesFactory.prototype.removeTextureAtlas = function (name) {
        this.factory.removeTextureAtlasData(name);
    };
    /**
     * ??????????????????
     * @param name ????????????
     * @param fromDragonBonesDataName ??????????????????
     * @returns {Armature}
     */
    DragonBonesFactory.prototype.makeArmature = function (name, fromDragonBonesDataName, playSpeed) {
        if (playSpeed === void 0) { playSpeed = 1; }
        var armature = this.factory.buildArmature(name, fromDragonBonesDataName);
        if (armature == null) {
            Log.warn("?????????Armature??? " + name);
            return null;
        }
        var clock = this.createWorldClock(playSpeed);
        var result = new DragonBonesArmature(armature, clock);
        return result;
    };
    /**
     * ????????????????????????????????????
     * @param name ????????????
     * @param fromDragonBonesDataName ??????????????????
     * @returns {Armature}
     */
    DragonBonesFactory.prototype.makeFastArmature = function (name, fromDragonBonesDataName, playSpeed) {
        if (playSpeed === void 0) { playSpeed = 1; }
        var result = this.makeArmature(name, fromDragonBonesDataName, playSpeed);
        result.getArmature().cacheFrameRate = 24;
        return result;
    };
    /**
     * ??????WorldClock
     * @param playSpeed
     * @returns {dragonBones.WorldClock}
     */
    DragonBonesFactory.prototype.createWorldClock = function (playSpeed) {
        for (var i = 0; i < this.clocksLen; i++) {
            if (this.clocks[i].timeScale == playSpeed) {
                return this.clocks[i];
            }
        }
        var newClock = new dragonBones.WorldClock();
        newClock.timeScale = playSpeed;
        this.clocks.push(newClock);
        this.clocksLen = this.clocks.length;
        return newClock;
    };
    /**
     * dragonBones?????????????????????
     * @param advancedTime
     */
    DragonBonesFactory.prototype.onEnterFrame = function (advancedTime) {
        this.averageUtils.push(advancedTime);
        var time = this.averageUtils.getValue() * 0.001;
        for (var i = 0; i < this.clocksLen; i++) {
            var clock = this.clocks[i];
            clock.advanceTime(time);
        }
    };
    /**
     * ??????
     */
    DragonBonesFactory.prototype.stop = function () {
        if (this.isPlay) {
            App.TimerManager.remove(this.onEnterFrame, this);
            this.isPlay = false;
        }
    };
    /**
     * ??????
     */
    DragonBonesFactory.prototype.start = function () {
        if (!this.isPlay) {
            this.isPlay = true;
            App.TimerManager.doFrame(1, 0, this.onEnterFrame, this);
        }
    };
    return DragonBonesFactory;
}(SingtonClass));
__reflect(DragonBonesFactory.prototype, "DragonBonesFactory");
/**
 * Created by yangsong on 14-12-2.
 * ??????????????????????????????????????????????????????????????????
 */
var GuideMaskBackgroud = (function (_super) {
    __extends(GuideMaskBackgroud, _super);
    /**
     * ????????????
     */
    function GuideMaskBackgroud() {
        var _this = _super.call(this) || this;
        _this._stageWidth = 0;
        _this._stageHeight = 0;
        _this._bgs = new Array();
        _this.touchEnabled = true;
        return _this;
    }
    /**
     * ?????????????????????
     * @param stageWidth ???
     * @param stageHeight ???
     */
    GuideMaskBackgroud.prototype.init = function (stageWidth, stageHeight) {
        this._stageWidth = stageWidth;
        this._stageHeight = stageHeight;
    };
    /**
     * Draw
     * @param deductRec ??????????????????
     */
    GuideMaskBackgroud.prototype.draw = function (deductRec) {
        this.cacheAsBitmap = false;
        this._deductRec = deductRec;
        this.removeAllChild();
        var minX = Math.max(deductRec.x, 0);
        var minY = Math.max(deductRec.y, 0);
        var maxX = Math.min(deductRec.x + deductRec.width, this._stageWidth);
        var maxY = Math.min(deductRec.y + deductRec.height, this._stageHeight);
        this.addBg(0, 0, this._stageWidth, minY);
        this.addBg(0, minY, minX, deductRec.height);
        this.addBg(maxX, minY, this._stageWidth - maxX, deductRec.height);
        this.addBg(0, maxY, this._stageWidth, this._stageHeight - maxY);
        this.width = this._stageWidth;
        this.height = this._stageHeight;
        this.cacheAsBitmap = true;
    };
    /**
     * ??????
     */
    GuideMaskBackgroud.prototype.destroy = function () {
        this.removeChildren();
        this._bgs = [];
    };
    /**
     * ??????????????????
     */
    GuideMaskBackgroud.prototype.removeAllChild = function () {
        while (this.numChildren) {
            var bg = this.removeChildAt(0);
            this._bgs.push(bg);
        }
    };
    /**
     * ????????????bg
     * @param $x ??????X
     * @param $y ??????Y
     * @param $w ???
     * @param $h ???
     */
    GuideMaskBackgroud.prototype.addBg = function ($x, $y, $w, $h) {
        var bg;
        if (this._bgs.length) {
            bg = this._bgs.pop();
            bg.graphics.clear();
        }
        else {
            bg = new egret.Shape();
        }
        bg.graphics.beginFill(0x000000, 0.5);
        bg.graphics.drawRect($x, $y, $w, $h);
        bg.graphics.endFill();
        this.addChild(bg);
    };
    /**
     * ??????hitTest
     * ??????????????????????????????????????????
     * @method egret.DisplayObject#hitTest
     * @param x {number} ???????????????x???
     * @param y {number} ???????????????y???
     * @param ignoreTouchEnabled {boolean} ????????????TouchEnabled
     * @returns {*}
     */
    GuideMaskBackgroud.prototype.hitTest = function (x, y, ignoreTouchEnabled) {
        if (this._deductRec && this._deductRec.contains(x, y)) {
            return null;
        }
        else {
            return this;
        }
    };
    return GuideMaskBackgroud;
}(egret.Sprite));
__reflect(GuideMaskBackgroud.prototype, "GuideMaskBackgroud");
/**
 * Created by yangsong on 14-12-2.
 * ???????????????????????????????????????????????????????????????
 */
var GuideUtils = (function (_super) {
    __extends(GuideUtils, _super);
    function GuideUtils() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //handDir  1:?????? 2:??????
        //txtdir  ????????????: 1:?????????????????? 2:?????????????????? 3:?????????????????? 4:??????????????????
        _this.configData = {
            "1": {
                "1": {
                    "txt": "????????????????????????????????????",
                    "txtdir": 1,
                    "handDir": 1
                },
                "2": {
                    "txt": "??????????????????????????????",
                    "txtdir": 3,
                    "handDir": 1
                },
                "3": {
                    "txt": "??????????????????",
                    "txtdir": 3,
                    "handDir": 1
                }
            },
            "2": {
                "1": {
                    "txt": "???????????????????????????????????????",
                    "txtdir": 1,
                    "handDir": 2
                },
                "2": {
                    "txt": "??????????????????",
                    "txtdir": 1,
                    "handDir": 1
                }
            },
            "3": {
                "1": {
                    "txt": "???????????????????????????",
                    "txtdir": 1,
                    "handDir": 1
                },
                "2": {
                    "txt": "??????????????????",
                    "txtdir": 3,
                    "handDir": 1
                }
            },
            "4": {
                "1": {
                    "txt": "????????????????????????",
                    "txtdir": 4,
                    "handDir": 1
                },
                "2": {
                    "txt": "??????????????????",
                    "txtdir": 1,
                    "handDir": 2
                },
                "3": {
                    "txt": "????????????????????????",
                    "txtdir": 3,
                    "handDir": 1
                },
                "4": {
                    "txt": "???????????????????????????????????????",
                    "txtdir": 3,
                    "handDir": 1
                },
                "5": {
                    "txt": "?????????????????????????????????????????????",
                    "txtdir": 1,
                    "handDir": 2
                },
                "6": {
                    "txt": "??????????????????",
                    "txtdir": 1,
                    "handDir": 2
                }
            },
            "5": {
                "1": {
                    "txt": "??????????????????\n??????????????????",
                    "txtdir": 1,
                    "handDir": 2
                },
                "2": {
                    "txt": "?????????3???????????????",
                    "txtdir": 1,
                    "handDir": 1
                },
                "3": {
                    "txt": "???????????????",
                    "txtdir": 1,
                    "handDir": 2
                }
            },
            "6": {
                "1": {
                    "txt": "????????????????????????",
                    "txtdir": 1,
                    "handDir": 1
                },
                "2": {
                    "txt": "?????????????????????\n??????????????????",
                    "txtdir": 1,
                    "handDir": 2
                }
            }
        };
        /**
         * ?????????
         * @type {number}
         */
        _this.currPart = 0;
        /**
         * ?????????
         * @type {number}
         */
        _this.currStep = 0;
        return _this;
    }
    /**
     * ?????????
     */
    GuideUtils.prototype.next = function () {
        if (this.view == null || this.view.parent == null) {
            return;
        }
        this.currStep++;
        if (!this.configData[this.currPart][this.currStep]) {
            //????????????
            this.currPart++;
            this.currStep = 1;
            //???????????????
            //TODO
        }
        if (!this.configData[this.currPart]) {
            //??????????????????
            this.currPart = 0;
            this.currStep = 0;
        }
        this.hide();
    };
    /**
     * ??????
     */
    GuideUtils.prototype.show = function (obj, targetPart, targetStep) {
        if (this.currPart == targetPart && this.currStep == targetStep) {
            if (this.view == null) {
                this.view = new GuideView();
            }
            this.view.setData(obj, this.configData[this.currPart][this.currStep]);
            egret.MainContext.instance.stage.addChild(this.view);
        }
    };
    /**
     * ??????
     */
    GuideUtils.prototype.hide = function () {
        App.DisplayUtils.removeFromParent(this.view);
    };
    /**
     * ??????????????????
     */
    GuideUtils.prototype.isShow = function () {
        return this.view != null && this.view.parent != null;
    };
    return GuideUtils;
}(SingtonClass));
__reflect(GuideUtils.prototype, "GuideUtils");
/**
 * Created by yangsong on 14-12-2.
 * GuideView
 */
var GuideView = (function (_super) {
    __extends(GuideView, _super);
    /**
     * ????????????
     */
    function GuideView() {
        var _this = _super.call(this) || this;
        _this._objRec = new egret.Rectangle();
        _this._objGlobalPoint = new egret.Point();
        _this._bg = new GuideMaskBackgroud();
        _this.addChild(_this._bg);
        _this._maskPic = StarlingSwfUtils.createS9Image("s9_guide_mask");
        _this.addChild(_this._maskPic);
        _this._textBgPic = StarlingSwfUtils.createS9Image("s9_guide_txt");
        App.AnchorUtils.setAnchorY(_this._textBgPic, 1);
        _this.addChild(_this._textBgPic);
        _this._handPic = StarlingSwfUtils.createImage("img_hand");
        App.AnchorUtils.setAnchorX(_this._handPic, 0.5);
        _this.addChild(_this._handPic);
        _this._txt = new egret.TextField();
        _this._txt.size = 26;
        _this._txt.textColor = 0x575757;
        _this._txt.lineSpacing = 4;
        App.AnchorUtils.setAnchorY(_this._txt, 0.5);
        _this.addChild(_this._txt);
        egret.MainContext.instance.stage.addEventListener(egret.Event.RESIZE, _this.onResize, _this);
        return _this;
    }
    /**
     * ???????????????????????????
     */
    GuideView.prototype.onResize = function () {
        if (this.stage) {
            egret.setTimeout(this.refurbish, this, 500);
        }
    };
    /**
     * ??????
     */
    GuideView.prototype.refurbish = function () {
        this.setData(this._obj, this._data);
    };
    /**
     * ??????????????????
     * @param obj
     * @param data
     */
    GuideView.prototype.setData = function (obj, data) {
        if (obj == null) {
            return;
        }
        this._obj = obj;
        this._data = data;
        this._obj.localToGlobal(0, 0, this._objGlobalPoint);
        this._obj.getBounds(this._objRec);
        this._objGlobalPoint.x = Math.ceil(this._objGlobalPoint.x);
        this._objGlobalPoint.y = Math.ceil(this._objGlobalPoint.y);
        var tmpX = 15;
        var tmpy = 15;
        this._objRec.x = this._objGlobalPoint.x - tmpX;
        this._objRec.y = this._objGlobalPoint.y - tmpy;
        this._objRec.width += tmpX * 2;
        this._objRec.height += tmpy * 2;
        //???????????????
        this._bg.init(egret.MainContext.instance.stage.stageWidth, egret.MainContext.instance.stage.stageHeight);
        this._bg.draw(this._objRec);
        //????????????
        this._maskPic.cacheAsBitmap = false;
        this._maskPic.x = this._objRec.x;
        this._maskPic.y = this._objRec.y;
        this._maskPic.width = this._objRec.width;
        this._maskPic.height = this._objRec.height;
        this._maskPic.cacheAsBitmap = true;
        //handDir  1:?????? 2:??????
        if (this._data.handDir == 1) {
            this._handPic.scaleY = 1;
            this._handPic.y = this._objRec.y + this._objRec.height - 20;
        }
        else if (this._data.handDir == 2) {
            this._handPic.scaleY = -1;
            this._handPic.y = this._objRec.y + 20;
        }
        this._handPic.x = this._objRec.x + this._objRec.width * 0.5;
        //????????????
        this._txt.width = NaN;
        this._txt.height = NaN;
        this._txt.text = this._data.txt;
        if (this._txt.width > 320) {
            this._txt.text = "";
            this._txt.width = 320;
            this._txt.text = this._data.txt;
        }
        var temp = 15;
        this._textBgPic.cacheAsBitmap = false;
        this._textBgPic.width = this._txt.width + temp * 2 + 35;
        this._textBgPic.height = 114;
        //txtdir  ????????????: 1:?????????????????? 2:?????????????????? 3:?????????????????? 4:??????????????????
        if (this._data.txtdir == 1) {
            this._textBgPic.scaleX = -1;
            this._textBgPic.scaleY = 1;
            this._textBgPic.x = this._objRec.x;
        }
        else if (this._data.txtdir == 2) {
            this._textBgPic.scaleX = -1;
            this._textBgPic.scaleY = -1;
            this._textBgPic.x = this._objRec.x;
        }
        else if (this._data.txtdir == 3) {
            this._textBgPic.scaleX = 1;
            this._textBgPic.scaleY = 1;
            this._textBgPic.x = this._objRec.x + this._objRec.width;
        }
        else if (this._data.txtdir == 4) {
            this._textBgPic.scaleX = 1;
            this._textBgPic.scaleY = -1;
            this._textBgPic.x = this._objRec.x + this._objRec.width;
        }
        this.checkTextBgX();
        this._textBgPic.y = this._objRec.y + this._objRec.height * 0.5;
        this._txt.x = this._textBgPic.x - (this._textBgPic.scaleX == -1 ? this._textBgPic.width : -35) + temp;
        this._txt.y = this._textBgPic.y - this._textBgPic.scaleY * this._textBgPic.height * 0.5;
        this._textBgPic.cacheAsBitmap = true;
    };
    /**
     * ???????????????????????????????????????
     */
    GuideView.prototype.checkTextBgX = function () {
        if (this._textBgPic.scaleX == 1) {
            var stageW = egret.MainContext.instance.stage.stageWidth;
            if (this._textBgPic.x + this._textBgPic.width > stageW) {
                this._textBgPic.x = stageW - this._textBgPic.width;
            }
        }
        else if (this._textBgPic.scaleX == -1) {
            if (this._textBgPic.x - this._textBgPic.width < 0) {
                this._textBgPic.x = this._textBgPic.width;
            }
        }
    };
    return GuideView;
}(egret.Sprite));
__reflect(GuideView.prototype, "GuideView");
/**
 * Created by husong on 4/10/15.
 */
var EasyLoading = (function (_super) {
    __extends(EasyLoading, _super);
    function EasyLoading() {
        var _this = _super.call(this) || this;
        _this.content = null;
        _this.speed = 10 / (1000 / 60);
        _this.init();
        return _this;
    }
    EasyLoading.prototype.init = function () {
        this.averageUtils = new AverageUtils();
        this.content = new egret.Sprite();
        this.content.graphics.beginFill(0x000000, 0.2);
        this.content.graphics.drawRect(0, 0, App.StageUtils.getWidth(), App.StageUtils.getHeight());
        this.content.graphics.endFill();
        this.content.touchEnabled = true;
        this.uiImageContainer = new egret.DisplayObjectContainer();
        this.uiImageContainer.x = this.content.width * 0.5;
        this.uiImageContainer.y = this.content.height * 0.5;
        this.content.addChild(this.uiImageContainer);
        RES.getResByUrl("https://yqllm.wangqucc.com/gameres/dld/resource/assets/load_Reel.png", function (texture) {
            var img = new egret.Bitmap();
            img.texture = texture;
            img.x = -img.width * 0.5;
            img.y = -img.height * 0.5;
            this.uiImageContainer.addChild(img);
        }, this, RES.ResourceItem.TYPE_IMAGE);
    };
    EasyLoading.prototype.showLoading = function () {
        App.StageUtils.getStage().addChild(this.content);
        App.TimerManager.doFrame(1, 0, this.enterFrame, this);
    };
    EasyLoading.prototype.hideLoading = function () {
        if (this.content && this.content.parent) {
            App.StageUtils.getStage().removeChild(this.content);
            this.uiImageContainer.rotation = 0;
        }
        App.TimerManager.remove(this.enterFrame, this);
    };
    EasyLoading.prototype.enterFrame = function (time) {
        this.averageUtils.push(this.speed * time);
        this.uiImageContainer.rotation += this.averageUtils.getValue();
    };
    return EasyLoading;
}(SingtonClass));
__reflect(EasyLoading.prototype, "EasyLoading");
/**
 * Created by egret on 15-2-2.
 */
var Boss = (function (_super) {
    __extends(Boss, _super);
    function Boss($controller) {
        return _super.call(this, $controller) || this;
    }
    Boss.prototype.init = function () {
        _super.prototype.init.call(this);
        this.move_time = App.RandomUtils.limitInteger(1000, 2000);
        this.attack_time = App.RandomUtils.limitInteger(1000, 2000);
        this.hp = 500;
        this.setAttackType(1);
    };
    Boss.prototype.createArmature = function () {
        this.armature.register(App.DragonBonesFactory.makeArmature("guaiwu002", "guaiwu002", 1.2), [
            BaseGameObject.ACTION_Idle,
            BaseGameObject.ACTION_Move,
            BaseGameObject.ACTION_Hart,
            BaseGameObject.ACTION_Fly,
            BaseGameObject.ACTION_Land,
            BaseGameObject.ACTION_jump,
            Enemy.ACTION_Attack,
            Enemy.ACTION_Skill1
        ]);
        this.armature.register(App.DragonBonesFactory.makeArmature("guaiwu003", "guaiwu003", 1.2), [
            Enemy.ACTION_Skill2
        ]);
        this.armature.addCompleteCallFunc(this.armaturePlayEnd, this);
        this.initFrameData("guaiwu002");
        this.effectArmature = new DragonBonesArmatureContainer();
        this.effectArmature.register(App.DragonBonesFactory.makeArmature("guaiwu002_effect", "guaiwu002_effect", 1.2), [
            Enemy.ACTION_Attack,
            Enemy.ACTION_Skill1
        ]);
        this.effectArmature.register(App.DragonBonesFactory.makeArmature("guaiwu003_effect", "guaiwu003_effect", 1.2), [
            Enemy.ACTION_Skill2
        ]);
    };
    Boss.prototype.setAttackType = function (type) {
        this.attackType = type;
        if (this.attackType == 1) {
            this.ai_attack_dis = this.attackConfig["attack1"].dis;
        }
        else if (this.attackType == 2) {
            this.ai_attack_dis = this.attackConfig["skill1"].dis;
        }
        else if (this.attackType == 3) {
            this.ai_attack_dis = this.attackConfig["skill2_3"].dis;
        }
    };
    Boss.prototype.update = function (time) {
        _super.prototype.update.call(this, time);
    };
    Boss.prototype.armaturePlayEnd = function (e, animationName) {
        _super.prototype.armaturePlayEnd.call(this, e, animationName);
        if (animationName == Enemy.ACTION_Attack) {
            this.setAttackType(2);
        }
        else if (animationName == Enemy.ACTION_Skill1) {
            this.gotoIdle();
            this.setAttackType(3);
        }
        else if (animationName == Enemy.ACTION_Skill2) {
            this.gotoIdle();
            this.setAttackType(1);
        }
    };
    Boss.prototype.playAttackArmature = function () {
        var anmatureName;
        if (this.attackType == 1) {
            anmatureName = Enemy.ACTION_Attack;
            App.SoundManager.playEffect("sound_bossAttack");
        }
        else if (this.attackType == 2) {
            anmatureName = Enemy.ACTION_Skill1;
            App.SoundManager.playEffect("sound_bossSkill");
        }
        else if (this.attackType == 3) {
            anmatureName = Enemy.ACTION_Skill2;
            App.SoundManager.playEffect("sound_bossSkill");
        }
        this.armature.play(anmatureName, 1);
        this.playEffect(anmatureName);
    };
    Boss.prototype.die = function () {
        _super.prototype.die.call(this);
        this.jump(-40, this.scaleX * -10);
        this.gameController.slowMotion();
    };
    Boss.prototype.removeEffect = function () {
        this.effectArmature.stop();
        App.DisplayUtils.removeFromParent(this.effectArmature);
    };
    Boss.prototype.playEffect = function (actionName) {
        if (this.effectArmature.play(actionName, 1)) {
            this.addChild(this.effectArmature);
        }
        else {
            this.removeEffect();
        }
    };
    Boss.prototype.leave = function () {
        _super.prototype.leave.call(this);
        this.stopMove();
        this.setAttackType(2);
        this.gotoAttack();
    };
    Boss.prototype.gotoIdle = function () {
        _super.prototype.gotoIdle.call(this);
        this.removeEffect();
    };
    Boss.prototype.destory = function () {
        _super.prototype.destory.call(this);
        this.removeEffect();
    };
    return Boss;
}(Enemy));
__reflect(Boss.prototype, "Boss");
/**
 * Created by yangsong on 2014/11/22.
 * Controller?????????
 */
var ControllerManager = (function (_super) {
    __extends(ControllerManager, _super);
    /**
     * ????????????
     */
    function ControllerManager() {
        var _this = _super.call(this) || this;
        _this._modules = {};
        return _this;
    }
    /**
     * ????????????
     */
    ControllerManager.prototype.clear = function () {
        this._modules = {};
    };
    /**
     * ???????????????Controller
     * @param key ????????????
     * @param manager Manager
     *
     */
    ControllerManager.prototype.register = function (key, control) {
        if (this.isExists(key))
            return;
        this._modules[key] = control;
    };
    /**
     * ????????????Controller
     * @param key ????????????
     *
     */
    ControllerManager.prototype.unregister = function (key) {
        if (!this.isExists(key))
            return;
        this._modules[key] = null;
        delete this._modules[key];
    };
    /**
     * ??????????????????Controller
     * @param key ????????????
     * @return Boolean
     *
     */
    ControllerManager.prototype.isExists = function (key) {
        return this._modules[key] != null;
    };
    /**
     * ?????????????????????
     * @param controllerD Controller????????????
     * @param key ??????????????????
     *
     */
    ControllerManager.prototype.applyFunc = function (controllerD, key) {
        var param = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            param[_i - 2] = arguments[_i];
        }
        var manager = this._modules[controllerD];
        if (manager) {
            var params = [];
            for (var i = 1; i < arguments.length; i++) {
                params[i - 1] = arguments[i];
            }
            return manager.applyFunc.apply(manager, params);
        }
        else {
            Log.warn("??????" + controllerD + "?????????");
            return null;
        }
    };
    /**
     * ????????????Controller???Model??????
     * @param controllerD Controller????????????
     * @returns {BaseModel}
     */
    ControllerManager.prototype.getControllerModel = function (controllerD) {
        var manager = this._modules[controllerD];
        if (manager) {
            return manager.getModel();
        }
        return null;
    };
    /**
     * ??????????????????????????????controller??????
     * @param controllerD Controller????????????
     * @returns {BaseController}
     * */
    ControllerManager.prototype.getController = function (controllerD) {
        return this._modules[controllerD];
    };
    return ControllerManager;
}(SingtonClass));
__reflect(ControllerManager.prototype, "ControllerManager");
/**
 * Created by yangsong on 15-1-15.
 */
var Hero = (function (_super) {
    __extends(Hero, _super);
    function Hero($controller) {
        var _this = _super.call(this, $controller) || this;
        _this.attackMaxIndex = 0;
        _this.attackIndex = 0;
        _this.armature.register(App.DragonBonesFactory.makeArmature("zhujue1", "zhujue1", 1.4), [
            BaseGameObject.ACTION_Idle,
            BaseGameObject.ACTION_Move,
            BaseGameObject.ACTION_Hart,
            BaseGameObject.ACTION_Fly,
            BaseGameObject.ACTION_Land,
            BaseGameObject.ACTION_jump,
            Hero.ACTION_Attack0,
            Hero.ACTION_Attack1,
            Hero.ACTION_Attack2,
            Hero.ACTION_Attack3,
            Hero.ACTION_Skill1
        ]);
        _this.armature.register(App.DragonBonesFactory.makeArmature("zhujue2", "zhujue2", 1.4), [
            Hero.ACTION_Skill2,
            Hero.ACTION_Skill3,
            Hero.ACTION_Skill4
        ]);
        _this.armature.addCompleteCallFunc(_this.armaturePlayEnd, _this);
        _this.initFrameData("zhujue1");
        _this.effectArmature = new DragonBonesArmatureContainer();
        _this.effectArmature.register(App.DragonBonesFactory.makeArmature("jineng1", "jineng1", 1.4), [
            Hero.ACTION_Attack0,
            Hero.ACTION_Attack1,
            Hero.ACTION_Attack2,
            Hero.ACTION_Attack3,
            Hero.ACTION_Skill1
        ]);
        _this.effectArmature.register(App.DragonBonesFactory.makeArmature("jineng2", "jineng2", 1.4), [
            Hero.ACTION_Skill2,
            Hero.ACTION_Skill3,
            Hero.ACTION_Skill4
        ]);
        return _this;
    }
    Hero.prototype.init = function () {
        _super.prototype.init.call(this);
        this.isAi = false;
        this.gotoIdle();
    };
    Hero.prototype.destory = function () {
        _super.prototype.destory.call(this);
        this.removeEffect();
    };
    Hero.prototype.armaturePlayEnd = function (e, animationName) {
        if (animationName == Hero.ACTION_Attack0
            || animationName == Hero.ACTION_Attack1
            || animationName == Hero.ACTION_Attack2) {
            if (this.attackMaxIndex > this.attackIndex) {
                this.nextAttack();
            }
            else {
                this.overAttack();
            }
        }
        else if (animationName == Hero.ACTION_Attack3) {
            this.overAttack();
        }
        else if (animationName == Hero.ACTION_Skill1
            || animationName == Hero.ACTION_Skill2
            || animationName == Hero.ACTION_Skill3
            || animationName == Hero.ACTION_Skill4) {
            this.overSkill();
        }
        else if (animationName == Hero.ACTION_Hart) {
            this.gotoIdle();
        }
    };
    Hero.prototype.addMaxAttackIndex = function () {
        this.attackMaxIndex++;
        if (this.attackMaxIndex > 3) {
            this.attackMaxIndex = 3;
        }
    };
    Hero.prototype.attack = function () {
        if (this.isJump)
            return;
        if (this.isHurt)
            return;
        if (this.isLand)
            return;
        if (this.isMove) {
            this.stopMove();
        }
        this.gotoAttack();
        this.armature.play(Hero["ACTION_Attack" + this.attackIndex], 1);
        this.playEffect(Hero["ACTION_Attack" + this.attackIndex]);
        App.SoundManager.playEffect("sound_heroAttack");
    };
    Hero.prototype.nextAttack = function () {
        this.attackIndex++;
        this.attack();
    };
    Hero.prototype.overAttack = function () {
        this.attackMaxIndex = 0;
        this.attackIndex = 0;
        this.gotoIdle();
    };
    Hero.prototype.skill = function (id) {
        if (this.isAttack)
            return;
        if (this.isJump)
            return;
        if (this.isHurt)
            return;
        if (this.isLand)
            return;
        if (this.isMove) {
            this.stopMove();
        }
        this.gotoAttack();
        this.armature.play(Hero["ACTION_Skill" + id], 1);
        this.playEffect(Hero["ACTION_Skill" + id]);
        App.SoundManager.playEffect("sound_heroSkill");
    };
    Hero.prototype.overSkill = function () {
        this.gotoIdle();
    };
    Hero.prototype.gotoIdle = function () {
        _super.prototype.gotoIdle.call(this);
        this.removeEffect();
    };
    Hero.prototype.removeEffect = function () {
        this.effectArmature.stop();
        App.DisplayUtils.removeFromParent(this.effectArmature);
    };
    Hero.prototype.playEffect = function (actionName) {
        if (this.effectArmature.play(actionName, 1)) {
            this.addChild(this.effectArmature);
        }
        else {
            this.removeEffect();
        }
    };
    Hero.prototype.die = function () {
    };
    Hero.prototype.fly = function (attackObj, speedZ, speedX) {
        _super.prototype.fly.call(this, attackObj, speedZ, speedX);
        App.SoundManager.playEffect("sound_heroBeiji");
    };
    Hero.prototype.hart = function (attackObj, speed, xMoveDis) {
        _super.prototype.hart.call(this, attackObj, speed, xMoveDis);
        App.SoundManager.playEffect("sound_heroBeiji");
    };
    Hero.prototype.hartFly = function (attackObj, speedZ, attract) {
        _super.prototype.hartFly.call(this, attackObj, speedZ, attract);
        App.SoundManager.playEffect("sound_heroBeiji");
    };
    Hero.ACTION_Attack0 = "gongji1";
    Hero.ACTION_Attack1 = "gongji2";
    Hero.ACTION_Attack2 = "gongji3";
    Hero.ACTION_Attack3 = "gongji4";
    Hero.ACTION_Skill1 = "jineng1";
    Hero.ACTION_Skill2 = "jineng2";
    Hero.ACTION_Skill3 = "jineng3";
    Hero.ACTION_Skill4 = "jineng4";
    return Hero;
}(BaseFrameGameObject));
__reflect(Hero.prototype, "Hero");
/**
 * Created by egret on 15-1-6.
 */
var HomeConst = (function () {
    function HomeConst() {
    }
    return HomeConst;
}());
__reflect(HomeConst.prototype, "HomeConst");
/**
 * Created by yangsong on 15-1-6.
 */
var HomeController = (function (_super) {
    __extends(HomeController, _super);
    function HomeController() {
        var _this = _super.call(this) || this;
        _this.proxy = new HomeProxy(_this);
        _this.homeView = new HomeView(_this, LayerManager.UI_Main);
        App.ViewManager.register(ViewConst.Home, _this.homeView);
        return _this;
    }
    return HomeController;
}(BaseController));
__reflect(HomeController.prototype, "HomeController");
/**
 * Created by egret on 15-1-6.
 */
var HomeProxy = (function (_super) {
    __extends(HomeProxy, _super);
    function HomeProxy($controller) {
        return _super.call(this, $controller) || this;
    }
    return HomeProxy;
}(BaseProxy));
__reflect(HomeProxy.prototype, "HomeProxy");
/**
 * Created by egret on 15-1-6.
 */
var HomeView = (function (_super) {
    __extends(HomeView, _super);
    function HomeView($controller, $parent) {
        var _this = _super.call(this, $controller, $parent) || this;
        _this.monsterId = 0;
        _this.monsterIntro = new MonsterIntro(); //????????????????????????
        _this.monsterList = new MonsterList();
        _this.seletedItemIndex = 0;
        //????????????
        _this.user = UserModel.instance();
        _this.skinName = "resource/skins/GuiScreenSkin.exml";
        return _this;
    }
    /**
     *???????????????????????????????????????????????????
     *
     */
    HomeView.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.addEveListeners();
        this.roleInfo();
        this.loadMstListDatas(); //??????????????????
        var info1 = this.mstListDatas[this.seletedItemIndex];
        this.updatemodel(info1);
        this.startLoadRoleRes();
        this.headDisplay.source = RES.getRes("home_icon_" + this.monsterId + "_png");
        this.standMC = new egret.MovieClip();
        this.standMC.x -= 35;
        this.standMC.y += 30;
        this.standMC.width += 140;
        this.standMC.height += 140;
        this.rolePlatformGroup.addChild(this.standMC);
        this.updateUpLevelInfo();
        this.updateMonstInfo();
        this.createList();
    };
    //?????????????????? ????????????
    HomeView.prototype.roleInfo = function () {
        // RoleInfoConst.roleInfo = JSON.parse("{\"ext\":\"\",\"pets\":[{\"level\":1,\"roleId\":124,\"num\":20???me\":\"qq\",\"diamondCount\":0,\"goldCount\":0,\"id\":124}");
        RoleInfoConst.roleInfo = JSON.parse('{\"ext\":\"\",\"pets\":[{\"level\":1,\"roleId\":124,\"num\":20004,\"name\":\"??????\",\"id\":359,\"statu\":0},{\"level\":1,\"roleId\":124,\"num\":20005,\"name\":\"??????\",\"id\":360,\"statu\":0},{\"level\":1,\"roleId\":124,\"num\":20002,\"name\":\"??????\",\"id\":361,\"statu\":1}],\"nickname\":\"qq\",\"diamondCount\":0,\"goldCount\":0,\"id\":124}');
        this.webInfo = RoleInfoConst.roleInfo;
        if (!this.webInfo) {
            Log.debug("webInfo is undefind");
            return;
        }
        this.user.username = this.webInfo["nickname"];
        this.user.userbrands = this.webInfo["diamondCount"]; //??????
        this.user.usertreasure = this.webInfo["goldCount"]; //??????
        this.user.id = this.webInfo["id"];
        this.user.adnumber = this.webInfo["ext"] == "nothing" ? 0 : this.webInfo["ext"];
        this.brandsLabel.text = this.user.userbrands + ""; //??????
        this.goldDisplay.text = this.user.usertreasure + ""; //??????
        this.unameLabel.text = this.user.username;
    };
    HomeView.prototype.addEveListeners = function () {
        this.instructionsBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.instructionsBtnClickHandle, this);
        this.settingBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.settingBtnClickHandle, this);
        this.advertisingBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.advertisingBtnClickHandle, this);
        this.monsterBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.monsterBtnClickHandle, this);
        this.matchBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.matchBtnClickHandle, this);
        this.improveBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.upmonstrrLevel, this);
        //????????????
        App.MessageCenter.addListener(EventNames.Pet_unlock, this.unlocksuccess, this);
        //????????????
        App.MessageCenter.addListener(EventNames.Pet_uplevel, this.levelupsuccess, this);
        //??????????????????
        App.MessageCenter.addListener(EventNames.Role_update, this.updatarolesuccess, this);
        //??????????????????
        App.MessageCenter.addListener(EventNames.Rolo_INFO, this.getrolesuccess, this);
    };
    HomeView.prototype.playSound = function () {
        App.SoundManager.playEffect("sound_dianji");
    };
    //????????????
    HomeView.prototype.instructionsBtnClickHandle = function (e) {
        this.playSound();
        //  App.ViewManager.open(ViewConst.SettlementView);
        // App.MessageCenter.dispatch(EventNames.Fight_End, 2);
        App.ViewManager.open(ViewConst.ExplainView);
    };
    //??????
    HomeView.prototype.settingBtnClickHandle = function (e) {
        this.playSound();
        App.ViewManager.open(ViewConst.SettingView);
    };
    //??????
    HomeView.prototype.advertisingBtnClickHandle = function (e) {
        this.playSound();
        App.ViewManager.open(ViewConst.AdsView);
    };
    //??????
    HomeView.prototype.monsterBtnClickHandle = function (e) {
        this.playSound();
        this.displayMainUI(false);
        this.displayMstInfoUI(true);
    };
    //????????????
    HomeView.prototype.matchBtnClickHandle = function (e) {
        this.playSound();
        App.ViewManager.open(ViewConst.MatchingView);
    };
    //???????????????
    HomeView.prototype.gobackBtnClickHandle = function (e) {
        this.playSound();
        this.displayMainUI(true);
        this.displayMstInfoUI(false);
    };
    HomeView.prototype.upmonstrrLevel = function () {
        App.SoundManager.playEffect("sound_dianji");
        var cost = this.user.usertreasure; //??????
        var ods = this.monsterIntro.model.odds * 100; //????????????
        var nedcost = this.monsterIntro.model.costnumber; //????????????
        var radm = App.RandomUtils.limit(1, 100);
        if (cost < nedcost) {
            App.ViewManager.open(ViewConst.LevelRewardView, 2, "????????????????????????????????????");
            return;
        }
        if (radm <= ods) {
            this.user.monsterModel.monsterlevel += 1;
            App.ViewManager.open(ViewConst.LevelRewardView, 1, this.user.monsterModel.monsterlevel);
            this.user.usertreasure = cost - nedcost;
            var rManager = RoleInfoManager.getSingtonInstance();
            var ob = {
                "num": this.user.monsterModel.monsterId,
                "name": this.user.monsterModel.monstername,
                "level": this.user.monsterModel.monsterlevel,
                "roleId": this.user.id,
                "statu": 1
            };
            rManager.updatePet(ob);
        }
        else {
            //????????????
            App.ViewManager.open(ViewConst.LevelRewardView, 2, "???????????????????????????");
            this.user.usertreasure = cost - nedcost;
            this.changeUserInfo();
        }
    };
    //?????????????????????UI
    HomeView.prototype.createList = function () {
        var testDatas = TestRankDataConfiger.testDatas();
        var obj = { "rank": "1", "username": this.user.username, "medal": this.user.usertreasure };
        testDatas.push(obj);
        testDatas.sort(function (a, b) {
            if (a["medal"] > b["medal"]) {
                return -1;
            }
            else {
                return 1;
            }
        });
        this.listRankings.dataProvider = new eui.ArrayCollection(testDatas);
        this.listRankings.itemRenderer = RankListItem;
    };
    //???????????????????????????????????????
    HomeView.prototype.startLoadRoleRes = function () {
        if (this.monsterId == 0) {
        }
        else {
            this.mcName = "monster_" + this.monsterId + "_stand";
            var mcPath = "https://yqllm.wangqucc.com/gameres/dld/resource/assets/rpgGame/monster/" + this.monsterId + "/";
            RpgGameRes.loadAvatar(mcPath, this.mcName, this.onLoadComplate, this);
        }
    };
    //?????????????????????????????????????????????
    HomeView.prototype.onLoadComplate = function () {
        var avatarResName = this.mcName;
        var data = RES.getRes("avatar_" + avatarResName + ".json");
        var texture = RES.getRes("avatar_" + avatarResName + ".png");
        var mcFactory = new egret.MovieClipDataFactory(data, texture);
        this.standMC.movieClipData = mcFactory.generateMovieClipData(avatarResName);
        this.standMC.gotoAndPlay("stand_0", -1);
    };
    //???????????????????????????UI
    HomeView.prototype.displayMainUI = function (isShow) {
        if (isShow) {
            this.alphaAnimation(this.rankingGroup, 1);
            this.alphaAnimation(this.buttonsGroup, 1);
            this.improveGroup.visible = !isShow;
            this.gobackBtn.visible = !isShow;
            this.gobackBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.gobackBtnClickHandle, this);
        }
        else {
            this.alphaAnimation(this.rankingGroup, 0);
            this.alphaAnimation(this.buttonsGroup, 0);
            this.improveGroup.visible = !isShow;
            this.gobackBtn.visible = !isShow;
            this.gobackBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.gobackBtnClickHandle, this);
        }
    };
    //alpha????????????
    HomeView.prototype.alphaAnimation = function (displayer, toAlpha) {
        var tween = egret.Tween.get(displayer);
        if (toAlpha == 1)
            displayer.visible = true;
        tween.to({ alpha: toAlpha }, 300).call(function () {
            displayer.alpha = toAlpha;
            if (toAlpha == 0)
                displayer.visible = true;
        });
    };
    //????????????????????????????????????
    HomeView.prototype.displayMstInfoUI = function (isShow, animation) {
        if (animation === void 0) { animation = true; }
        if (isShow) {
            this.monsterIntro.showIntro(this, animation);
            this.monsterList.showList(this, animation);
            this.monsterList.loadData(this.mstListDatas);
            this.monsterList.addEventListener(MonsterListItem.btnTapAction, this.onTapListItemBtn, this);
            this.monsterList.addEventListener(MonsterListItem.unlockAction, this.unlockmonster, this);
            this.movePlatform(true);
        }
        else {
            this.monsterIntro.dismissIntro(this, animation);
            this.monsterList.dismissList(this, animation);
            this.movePlatform(false);
        }
    };
    //????????????????????????
    HomeView.prototype.movePlatform = function (toLeft, animation) {
        if (animation === void 0) { animation = true; }
        var moveValue = 40;
        if (toLeft) {
            if (animation) {
                var tween = egret.Tween.get(this.rolePlatformGroup);
                tween.to({ horizontalCenter: -moveValue }, 300);
            }
            else {
                this.rolePlatformGroup.horizontalCenter -= moveValue;
            }
        }
        else {
            if (animation) {
                var tween = egret.Tween.get(this.rolePlatformGroup);
                tween.to({ horizontalCenter: +moveValue }, 300);
            }
            else {
                this.rolePlatformGroup.horizontalCenter += moveValue;
            }
        }
    };
    HomeView.prototype.loadMstListDatas = function () {
        this.mstListDatas = this.getMostListWithWebData();
        return this.mstListDatas;
    };
    HomeView.prototype.getMostListWithWebData = function () {
        if (!this.webInfo) {
            Log.debug("this.webInfo is Null");
            return;
        }
        var mosts = MonsterConfiger.getMonsters();
        var curtMosts = this.webInfo["pets"];
        for (var l = 0; l < mosts.length; l++) {
            var m = mosts[l];
            for (var k = 0; k < curtMosts.length; k++) {
                var n = curtMosts[k];
                if (m["monsterId"] == n["num"]) {
                    m["currentlevel"] = n["level"];
                    m["status"] = n["statu"];
                }
            }
            if (m["status"] == 1) {
                this.seletedItemIndex = l;
            }
        }
        return mosts;
    };
    HomeView.prototype.onTapListItemBtn = function (evt) {
        if (evt.data == this.seletedItemIndex)
            return;
        var obj1 = this.mstListDatas[this.seletedItemIndex];
        obj1["status"] = Global.useStatus.unused;
        var obj2 = this.mstListDatas[evt.data];
        obj2["status"] = Global.useStatus.using;
        this.monsterId = obj2["monsterId"];
        this.seletedItemIndex = evt.data;
        this.startLoadRoleRes();
        this.monsterList.loadData(this.mstListDatas);
        this.headDisplay.source = RES.getRes("home_icon_" + this.monsterId + "_png");
        this.updatemodel(obj2);
        this.updateUpLevelInfo();
        this.updateMonstInfo();
        var rManger = RoleInfoManager.getSingtonInstance();
        var ob = {
            "num": obj1["monsterId"],
            "name": obj1["name"],
            "level": obj1["currentlevel"],
            "roleId": this.user.id,
            "statu": 0
        };
        var ob1 = {
            "num": obj2["monsterId"],
            "name": obj2["name"],
            "level": obj2["currentlevel"],
            "roleId": this.user.id,
            "statu": 1
        };
        rManger.updatePet(ob);
        rManger.updatePet(ob1);
    };
    //????????????
    HomeView.prototype.unlockmonster = function (evt) {
        var obj1 = this.mstListDatas[evt.data];
        if (obj1["unlock"] > this.user.userbrands) {
            App.ViewManager.open(ViewConst.LevelRewardView, 4, "??????????????????????????????????????????????????????");
        }
        else {
            this.user.userbrands -= obj1["unlock"];
            var ob = {
                num: obj1["monsterId"],
                name: obj1["name"],
                level: 1,
                roleId: this.user.id,
                statu: 0
            };
            var rManger = RoleInfoManager.getSingtonInstance();
            rManger.addPet(ob);
        }
    };
    HomeView.prototype.unlocksuccess = function () {
        App.ViewManager.open(ViewConst.LevelRewardView, 3, "????????????????????????");
        this.changeUserInfo();
    };
    HomeView.prototype.levelupsuccess = function () {
        this.changeUserInfo();
    };
    HomeView.prototype.updatarolesuccess = function () {
        this.getUserInfo();
    };
    HomeView.prototype.getrolesuccess = function () {
        this.roleInfo();
        this.loadMstListDatas(); //??????????????????
        this.monsterList.loadData(this.mstListDatas);
        var info1 = this.mstListDatas[this.seletedItemIndex];
        this.updatemodel(info1);
        this.updateUpLevelInfo();
        this.updateMonstInfo();
    };
    //  ????????????
    HomeView.prototype.updatemodel = function (obj) {
        this.user.monsterModel.desc = obj["monstintro"];
        this.user.monsterModel.monsterId = obj["monsterId"];
        this.user.monsterModel.monstername = obj["name"];
        this.user.monsterModel.monsterlevel = obj["currentlevel"];
        this.user.monsterModel.status = obj["status"];
        this.user.monsterModel.unlocknumber = obj["unlock"];
        this.user.monsterModel.skill1 = obj["skill1"];
        this.user.monsterModel.skill2 = obj["skill2"];
        this.user.monsterModel.skill3 = obj["skill3"];
        this.monsterIntro.setModel(this.user.monsterModel);
        this.monsterId = this.user.monsterModel.monsterId;
    };
    //???????????????????????? 
    HomeView.prototype.updateUpLevelInfo = function () {
        this.expendLabel.text = this.user.monsterModel.costnumber + "";
        this.monstName.text = this.user.monsterModel.monstername + "";
    };
    HomeView.prototype.updateMonstInfo = function () {
        this.monsterIntro.updateInfr();
    };
    /*------------------??????????????????--------------------*/
    HomeView.prototype.changeUserInfo = function () {
        var rManager = RoleInfoManager.getSingtonInstance();
        if (!this.user.username) {
            return;
        }
        var ob = {
            "nickname": this.user.username,
            "diamondCount": this.user.userbrands,
            "goldCount": this.user.usertreasure,
            "ext": this.user.adnumber
        };
        rManager.updateRoleInfo(ob);
    };
    HomeView.prototype.getUserInfo = function () {
        var rManager = RoleInfoManager.getSingtonInstance();
        rManager.getRoleInfo(this.user.username);
    };
    return HomeView;
}(BaseEuiView));
__reflect(HomeView.prototype, "HomeView");
var MonsterConfiger = (function () {
    function MonsterConfiger() {
    }
    MonsterConfiger.getMonsters = function () {
        return [
            { monsterId: 20004,
                status: Global.useStatus.using,
                monstintro: "??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????",
                currentlevel: 1,
                name: "??????",
                unlock: 0,
                skill1: { skillid: 30004, skillname: "??????", skilltype: 1, cd: 0, skillspace: 5, skillspacetype: 2, skillangle: 45, skillradiues: 0, skilldistance: 0, skilldisplacement: 0 },
                skill2: { skillid: 30010, skillname: "??????", skilltype: 2, cd: 0, skillspace: 0, skillspacetype: 5, skillangle: 0, skillradiues: 0, skilldistance: 0, skilldisplacement: 0 },
                skill3: { skillid: 30016, skillname: "??????", skilltype: 3, cd: 40, skillspace: 45, skillspacetype: 3, skillangle: 0, skillradiues: 10, skilldistance: 5, skilldisplacement: 0 }, },
            { monsterId: 20005,
                status: Global.useStatus.unused,
                monstintro: "??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????",
                currentlevel: 1,
                name: "??????",
                unlock: 0,
                skill1: { skillid: 30005, skillname: "??????", skilltype: 1, cd: 0, skillspace: 4, skillspacetype: 2, skillangle: 45, skillradiues: 0, skilldistance: 0, skilldisplacement: 0 },
                skill2: { skillid: 30011, skillname: "??????", skilltype: 2, cd: 0, skillspace: 0, skillspacetype: 5, skillangle: 0, skillradiues: 0, skilldistance: 0, skilldisplacement: 0 },
                skill3: { skillid: 30017, skillname: "??????", skilltype: 3, cd: 40, skillspace: 0, skillspacetype: 5, skillangle: 0, skillradiues: 0, skilldistance: 0, skilldisplacement: 0 },
            },
            { monsterId: 20002,
                status: Global.useStatus.unused,
                monstintro: "?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????",
                currentlevel: 1,
                name: "??????",
                unlock: 0,
                skill1: { skillid: 30002, skillname: "??????", skilltype: 1, cd: 0, skillspace: 3, skillspacetype: 2, skillangle: 45, skillradiues: 0, skilldistance: 0, skilldisplacement: 0 },
                skill2: { skillid: 30008, skillname: "??????", skilltype: 2, cd: 0, skillspace: 0, skillspacetype: 5, skillangle: 0, skillradiues: 0, skilldistance: 0, skilldisplacement: 0 },
                skill3: { skillid: 30014, skillname: "??????", skilltype: 3, cd: 30, skillspace: 0, skillspacetype: 4, skillangle: 0, skillradiues: 0, skilldistance: 5, skilldisplacement: 15 },
            },
            { monsterId: 20001,
                status: Global.useStatus.locked,
                monstintro: "???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????",
                currentlevel: 1,
                name: "??????",
                unlock: 30,
                skill1: { skillid: 30001, skillname: "??????", skilltype: 1, cd: 0, skillspace: 3, skillspacetype: 2, skillangle: 45, skillradiues: 0, skilldistance: 0, skilldisplacement: 0 },
                skill2: { skillid: 30007, skillname: "??????", skilltype: 2, cd: 0, skillspace: 3, skillspacetype: 2, skillangle: 45, skillradiues: 0, skilldistance: 3, skilldisplacement: 0 },
                skill3: { skillid: 30013, skillname: "??????", skilltype: 3, cd: 25, skillspace: 0, skillspacetype: 4, skillangle: 0, skillradiues: 0, skilldistance: 0, skilldisplacement: 10 },
            },
            { monsterId: 20003,
                status: Global.useStatus.locked,
                monstintro: "??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????",
                currentlevel: 1,
                name: "??????",
                unlock: 50,
                skill1: { skillid: 30003, skillname: "??????", skilltype: 1, cd: 0, skillspace: 3, skillspacetype: 2, skillangle: 45, skillradiues: 0, skilldistance: 0, skilldisplacement: 0 },
                skill2: { skillid: 30009, skillname: "??????", skilltype: 2, cd: 0, skillspace: 0, skillspacetype: 5, skillangle: 0, skillradiues: 0, skilldistance: 0, skilldisplacement: 0 },
                skill3: { skillid: 30015, skillname: "??????", skilltype: 3, cd: 30, skillspace: 6, skillspacetype: 2, skillangle: 45, skillradiues: 0, skilldistance: 0, skilldisplacement: 0 },
            },
            { monsterId: 20006,
                status: Global.useStatus.locked,
                monstintro: "?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????  ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????",
                currentlevel: 1,
                name: "??????",
                unlock: 100,
                skill1: { skillid: 30006, skillname: "??????", skilltype: 1, cd: 0, skillspace: 6, skillspacetype: 2, skillangle: 45, skillradiues: 0, skilldistance: 0, skilldisplacement: 0 },
                skill2: { skillid: 30012, skillname: "??????", skilltype: 2, cd: 0, skillspace: 6, skillspacetype: 2, skillangle: 45, skillradiues: 0, skilldistance: 0, skilldisplacement: 0 },
                skill3: { skillid: 30018, skillname: "??????", skilltype: 3, cd: 45, skillspace: 100, skillspacetype: 1, skillangle: 0, skillradiues: 0, skilldistance: 0, skilldisplacement: 0 } }
        ];
        ;
    };
    MonsterConfiger.getMonstersInfoConfig = function () {
        var mostJson = RES.getRes("monster_config_json");
        if (mostJson) {
            var monsterInfoList = mostJson["monster_config"];
            return monsterInfoList;
        }
    };
    MonsterConfiger.getMosterFightConfig = function () {
        var json = RES.getRes("monster_fight_config_json");
        var conf = json["monster_fight_config"];
        return conf;
    };
    MonsterConfiger.getRadmane = function () {
        var json = RES.getRes("name_conf_json");
        var names = json["name"];
        var n1 = names[0];
        var n2 = names[1];
        var n3 = names[2];
        var a1 = n1.split(",");
        var a2 = n2.split(",");
        var a3 = n3.split(",");
        var radom = RandomUtils.getSingtonInstance().randomArray(a1);
        var radom1 = RandomUtils.getSingtonInstance().randomArray(a2);
        var radom2 = RandomUtils.getSingtonInstance().randomArray(a3);
        return radom + radom2;
    };
    MonsterConfiger.randomMonsters = [];
    return MonsterConfiger;
}());
__reflect(MonsterConfiger.prototype, "MonsterConfiger");
var MonsterInfoModel = (function () {
    function MonsterInfoModel() {
    }
    return MonsterInfoModel;
}());
__reflect(MonsterInfoModel.prototype, "MonsterInfoModel");
// TypeScript file
var TestRankDataConfiger = (function () {
    function TestRankDataConfiger() {
    }
    TestRankDataConfiger.testDatas = function () {
        return [
            {
                rank: 1,
                username: "????????????",
                medal: 9778
            },
            {
                rank: 2,
                username: "Yessenia",
                medal: 8681
            },
            {
                rank: 3,
                username: "????????????",
                medal: 7324
            },
            {
                rank: 4,
                username: "?????????",
                medal: 7306
            },
            {
                rank: 5,
                username: "Giacinta99",
                medal: 7288
            },
            {
                rank: 6,
                username: "?????????",
                medal: 7113
            },
            {
                rank: 7,
                username: "?????????",
                medal: 7100
            },
            {
                rank: 8,
                username: "????????????",
                medal: 7008
            },
            {
                rank: 9,
                username: "????????????",
                medal: 7005
            },
            {
                rank: 10,
                username: "????????????",
                medal: 6852
            },
            {
                rank: 11,
                username: "??????lvc",
                medal: 6592
            },
            {
                rank: 12,
                username: "kvg?????????",
                medal: 6366
            },
            {
                rank: 13,
                username: "?????????19827",
                medal: 6152
            },
            {
                rank: 14,
                username: "??????Sunshine",
                medal: 5677
            },
            {
                rank: 15,
                username: "???????????????Feel",
                medal: 4852
            },
            {
                rank: 16,
                username: "maTahari",
                medal: 4289
            },
            {
                rank: 17,
                username: "??????Sak1tama1993",
                medal: 3812
            },
            {
                rank: 18,
                username: "KinKinBbi",
                medal: 3856
            },
            {
                rank: 19,
                username: "??????summer",
                medal: 3852
            },
            {
                rank: 20,
                username: "?????????",
                medal: 3470
            },
            {
                rank: 21,
                username: "????????????",
                medal: 3253
            },
            {
                rank: 22,
                username: "?????????",
                medal: 2896
            },
            {
                rank: 23,
                username: "????????????",
                medal: 2778
            },
            {
                rank: 24,
                username: "Garfield",
                medal: 2644
            },
            {
                rank: 25,
                username: "Westley1664",
                medal: 2479
            },
            {
                rank: 26,
                username: "?????????",
                medal: 2100
            },
            {
                rank: 27,
                username: "?????????1955",
                medal: 1908
            },
            {
                rank: 28,
                username: "Avangaline",
                medal: 1770
            },
            {
                rank: 29,
                username: "????????????",
                medal: 1569
            },
            {
                rank: 30,
                username: "??????1998",
                medal: 1355
            },
            {
                rank: 31,
                username: "Cute????????",
                medal: 1119
            },
            {
                rank: 32,
                username: "??????Pun3ma",
                medal: 970
            },
            {
                rank: 33,
                username: "?????????",
                medal: 892
            },
            {
                rank: 34,
                username: "????????????",
                medal: 770
            },
            {
                rank: 35,
                username: "????????????ai",
                medal: 695
            }
        ];
    };
    return TestRankDataConfiger;
}());
__reflect(TestRankDataConfiger.prototype, "TestRankDataConfiger");
// TypeScript file
var UserModel = (function () {
    function UserModel() {
        this.id = 1; //??????id
        this.monsterModel = new MonsterInfoModel(); //?????????????????????????????????
        this.username = "???????????????"; //????????????
        this.usertreasure = 0; //??????(????????????)
        this.userbrands = 0; //?????????????????????/???????????????
        this.adnumber = 0; //??????????????????
    }
    UserModel.instance = function () {
        if (!this._u)
            this._u = new UserModel();
        return this._u;
    };
    return UserModel;
}());
__reflect(UserModel.prototype, "UserModel");
/**
 * Created by harvey on 19-7-2.
 */
var MonsterIntro = (function (_super) {
    __extends(MonsterIntro, _super);
    function MonsterIntro() {
        var _this = _super.call(this) || this;
        _this.skinName = "MonsterIntroSkin";
        _this.x = -426;
        _this.y = 155;
        _this.loadMonsterListInfo();
        return _this;
    }
    MonsterIntro.prototype.showIntro = function (parentView, animation) {
        if (!parentView)
            return;
        if (animation) {
            parentView.addChild(this);
            var tween = egret.Tween.get(this);
            tween.to({ x: 0 }, 300, egret.Ease.backIn);
        }
        else {
            this.x = 0;
            parentView.addChild(this);
        }
    };
    MonsterIntro.prototype.dismissIntro = function (parentView, animation) {
        var _this = this;
        if (!parentView)
            return;
        if (animation) {
            var tween = egret.Tween.get(this);
            tween.to({ x: -426 }, 300, egret.Ease.backOut).call(function () {
                parentView.removeChild(_this);
            });
        }
        else {
            parentView.removeChild(this);
        }
    };
    MonsterIntro.prototype.updateInfr = function () {
        this.titleLabel.text = "Lv" + this.model.monsterlevel + " " + this.model.monstername;
        this.hplabel.text = this.model.hp + "";
        this.skillplabel.text = this.model.skillp + "";
        this.skillhlabel.text = this.model.skillh + "";
        this.introLabel.text = "????????????\n\n" + "    " + this.model.desc;
    };
    MonsterIntro.prototype.setModel = function (_mod) {
        this.model = _mod;
        var m = this.loadMonstConfigWith(_mod.monsterId, _mod.monsterlevel);
        this.model.costid = m["costid"];
        this.model.costnumber = m["costnumber"];
        this.model.odds = m["odds"];
        this.model.hp = m["hp"];
        this.model.skillp = m["skillp"];
        this.model.skillh = m["skillh"];
        this.model.skill1 = _mod["skill1"];
        this.model.skill2 = _mod["skill2"];
        this.model.skill3 = _mod["skill3"];
    };
    MonsterIntro.prototype.loadMonsterListInfo = function () {
        var monsterInfoList = MonsterConfiger.getMonstersInfoConfig();
        this.monsterInfoListData = monsterInfoList["monster_config"];
        return this.monsterInfoListData;
    };
    MonsterIntro.prototype.loadMonstConfigWith = function (monid, level) {
        if (level >= 50)
            return null;
        var obj;
        for (var i = 0; i < this.monsterInfoListData.length; i++) {
            var p = this.monsterInfoListData[i];
            if (p["monsterid"] == monid && p["monsterlevel"] == level) {
                obj = p;
            }
        }
        return obj;
    };
    return MonsterIntro;
}(eui.Component));
__reflect(MonsterIntro.prototype, "MonsterIntro");
/**
 * Created by harvey on 19-7-2.
 */
var MonsterList = (function (_super) {
    __extends(MonsterList, _super);
    function MonsterList() {
        var _this = _super.call(this) || this;
        _this.skinName = "MonsterListSkin";
        _this.y = 130;
        return _this;
        //w:481 h:613
    }
    MonsterList.prototype.loadData = function (datas) {
        this.monsterList.dataProvider = new eui.ArrayCollection(datas);
        this.monsterList.itemRenderer = MonsterListItem;
    };
    MonsterList.prototype.showList = function (parentView, animation) {
        this.x = parentView.width;
        var toX = parentView.width - this.width;
        if (!parentView)
            return;
        if (animation) {
            parentView.addChild(this);
            var tween = egret.Tween.get(this);
            tween.to({ x: toX }, 300, egret.Ease.backIn);
        }
        else {
            this.x = toX;
            parentView.addChild(this);
        }
    };
    MonsterList.prototype.dismissList = function (parentView, animation) {
        var _this = this;
        if (!parentView)
            return;
        var toX = parentView.width;
        if (animation) {
            var tween = egret.Tween.get(this);
            tween.to({ x: toX }, 300, egret.Ease.backOut).call(function () {
                parentView.removeChild(_this);
            });
        }
        else {
            parentView.removeChild(this);
        }
    };
    return MonsterList;
}(eui.Component));
__reflect(MonsterList.prototype, "MonsterList");
/**
 * Created by harvey on 19-7-2.
 */
var Global;
(function (Global) {
    var useStatus;
    (function (useStatus) {
        useStatus[useStatus["unused"] = 0] = "unused";
        useStatus[useStatus["using"] = 1] = "using";
        useStatus[useStatus["locked"] = 2] = "locked";
    })(useStatus = Global.useStatus || (Global.useStatus = {}));
})(Global || (Global = {}));
var MonsterListItem = (function (_super) {
    __extends(MonsterListItem, _super);
    function MonsterListItem() {
        var _this = _super.call(this) || this;
        _this.skinName = "MonsterListItemSkin";
        _this.useBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.onTapUseBtnHandle, _this);
        return _this;
    }
    MonsterListItem.prototype.dataChanged = function () {
        var imgPath = "MInfo_card_" + this.data.monsterId + "_png";
        this.unlockNumberLabel.text = this.data.unlock + "??????";
        this.iconHead.texture = RES.getRes(imgPath);
        if (this.data.status == Global.useStatus.unused) {
            this.iconLine.visible = false;
            this.useBtn.visible = true;
            this.usingLabel.visible = false;
            this.lockGroup.visible = false;
        }
        else if (this.data.status == Global.useStatus.using) {
            this.iconLine.visible = true;
            this.useBtn.visible = false;
            this.usingLabel.visible = true;
            this.lockGroup.visible = false;
        }
        else {
            this.iconLine.visible = false;
            this.useBtn.visible = false;
            this.usingLabel.visible = false;
            this.lockGroup.visible = true;
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.unlockAction, this);
            this.iconToGray();
        }
    };
    // ???????????????
    MonsterListItem.prototype.iconToGray = function () {
        //??????????????????
        var colorMatrix = [
            0.3, 0.6, 0, 0, 0,
            0.3, 0.6, 0, 0, 0,
            0.3, 0.6, 0, 0, 0,
            0, 0, 0, 1, 0
        ];
        var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
        this.iconHead.filters = [colorFlilter];
    };
    MonsterListItem.prototype.onTapUseBtnHandle = function () {
        this.useBtn.dispatchEventWith(MonsterListItem.btnTapAction, true, this.itemIndex);
    };
    //????????????
    MonsterListItem.prototype.unlockAction = function () {
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.unlockAction, this);
        this.dispatchEventWith(MonsterListItem.unlockAction, true, this.itemIndex);
    };
    MonsterListItem.btnTapAction = "btnTapAction";
    MonsterListItem.unlockAction = "unlockAction";
    return MonsterListItem;
}(eui.ItemRenderer));
__reflect(MonsterListItem.prototype, "MonsterListItem");
/**
 * Created by harvey on 19-7-2.
 */
var RankListItem = (function (_super) {
    __extends(RankListItem, _super);
    function RankListItem() {
        var _this = _super.call(this) || this;
        _this.skinName = "RankListItemSkin";
        return _this;
    }
    RankListItem.prototype.createChildren = function () {
        _super.prototype.createChildren.call(this);
    };
    RankListItem.prototype.dataChanged = function () {
        switch (this.itemIndex) {
            case (0):
                {
                    this.rankLabel.textColor = 0xffe65c;
                    this.unameLabel.textColor = 0xffe65c;
                    this.medalLabel.textColor = 0xffe65c;
                }
                break;
            case (1):
                {
                    this.rankLabel.textColor = 0x66ff62;
                    this.unameLabel.textColor = 0x66ff62;
                    this.medalLabel.textColor = 0x66ff62;
                }
                break;
            case (2):
                {
                    this.rankLabel.textColor = 0x62fff6;
                    this.unameLabel.textColor = 0x62fff6;
                    this.medalLabel.textColor = 0x62fff6;
                }
                break;
            default:
                {
                    this.rankLabel.textColor = 0xfff9dc;
                    this.unameLabel.textColor = 0xfff9dc;
                    this.medalLabel.textColor = 0xfff9dc;
                }
                break;
        }
        this.rankLabel.text = this.itemIndex + 1 + "";
        this.unameLabel.text = this.data.username;
        this.medalLabel.text = this.data.medal;
    };
    return RankListItem;
}(eui.ItemRenderer));
__reflect(RankListItem.prototype, "RankListItem");
/**
 * Created by Administrator on 2014/11/23.
 */
var LoadingConst = (function () {
    function LoadingConst() {
    }
    LoadingConst.SetProgress = 10001;
    return LoadingConst;
}());
__reflect(LoadingConst.prototype, "LoadingConst");
/**
 * Created by yangsong on 15-1-6.
 */
var LoadingController = (function (_super) {
    __extends(LoadingController, _super);
    function LoadingController() {
        var _this = _super.call(this) || this;
        //?????????UI
        _this.loadingView = new LoadingView(_this, LayerManager.UI_Main);
        App.ViewManager.register(ViewConst.Loading, _this.loadingView);
        //??????????????????
        _this.registerFunc(LoadingConst.SetProgress, _this.setProgress, _this);
        return _this;
    }
    LoadingController.prototype.setProgress = function (current, total) {
        this.loadingView.setProgress(current, total);
    };
    return LoadingController;
}(BaseController));
__reflect(LoadingController.prototype, "LoadingController");
/**
 * Created by egret on 15-1-7.
 */
var LoadingView = (function (_super) {
    __extends(LoadingView, _super);
    function LoadingView($controller, $parent) {
        var _this = _super.call(this, $controller, $parent) || this;
        _this.skinName = "resource/skins/LoadingUISkin.exml";
        App.MessageCenter.addListener(EventNames.Load_text, _this.appearText, _this);
        return _this;
    }
    LoadingView.prototype.setProgress = function (current, total) {
        this.txtMsg.text = "???????????????..." /*+ current + "/" + total*/;
    };
    LoadingView.prototype.appearText = function () {
        this.txtMsg.visible = true;
    };
    return LoadingView;
}(BaseEuiView));
__reflect(LoadingView.prototype, "LoadingView");
/**
 * Created by Administrator on 2014/11/23.
 */
var LoginConst = (function () {
    function LoginConst() {
    }
    LoginConst.gettexts = function () {
        var arr = ["?????????", "?????????", "?????????", "??????", "?????????", "??????", "?????????", "??????", "??????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "??????", "?????????", "?????????", "??????", "?????????", "??????", "?????????", "?????????", "?????????", "?????????", "?????????", "??????", "?????????", "?????????", "?????????", "?????????", "??????", "?????????", "?????????", "??????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "??????", "?????????", "??????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "??????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "??????", "?????????", "??????", "?????????", "????????????", "??????", "????????????", "??????", "?????????", "?????????", "??????", "?????????", "??????", "?????????", "????????????", "??????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "????????????", "?????????", "?????????", "?????????", "?????????", "????????????", "????????????", "?????????", "???????????????", "?????????", "????????????", "??????", "??????????????????", "??????", "?????????", "?????????", "???????????????", "?????????", "?????????", "?????????", "??????", "??????", "????????????", "??????", "?????????", "?????????", "?????????", "????????????", "?????????", "????????????", "????????????", "????????????", "?????????", "?????????", "??????", "????????????", "?????????", "?????????", "?????????", "?????????", "??????", "????????????", "???????????????", "??????", "????????????", "?????????", "??????", "????????????", "????????????", "??????", "??????", "?????????", "??????", "??????", "?????????", "?????????", "??????", "????????????", "??????", "?????????", "??????", "?????????", "?????????", "?????????", "?????????", "????????????", "???????????????", "????????????", "??????", "??????", "??????", "????????????", "??????", "????????????", "????????????", "?????????", "????????????", "?????????", "???????????????", "??????", "??????", "??????", "????????????", "????????????", "?????????", "??????", "????????????", "????????????", "?????????", "??????", "?????????", "?????????", "??????", "??????", "????????????", "????????????", "????????????", "?????????", "??????", "??????", "??????", "?????????", "??????", "??????", "??????", "???????????????", "?????????", "??????", "?????????", "??????", "??????", "??????", "?????????", "????????????", "?????????", "??????", "??????", "??????", "?????????", "????????????", "?????????", "????????????", "??????", "?????????", "?????????", "??????", "??????", "?????????", "???????????????", "?????????", "???", "?????????", "??????", "??????", "?????????", "?????????", "?????????", "??????????????????", "??????", "??????", "??????", "??????", "????????????", "??????", "????????????", "?????????", "??????", "??????", "??????", "??????", "??????", "??????", "?????????", "????????????", "?????????", "??????", "??????", "??????", "?????????", "??????", "?????????", "????????????", "?????????", "?????????", "?????????", "?????????", "??????", "??????", "?????????", "?????????", "?????????", "?????????", "?????????", "??????", "????????????", "?????????", "??????", "?????????", "??????", "??????", "?????????", "?????????", "??????", "????????????", "????????????", "??????", "????????????", "??????", "??????", "????????????", "??????", "????????????", "??????", "????????????", "????????????", "????????????", "??????", "?????????", "???????????????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "????????????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "?????????", "?????????", "????????????", "??????", "?????????", "?????????", "??????", "?????????", "?????????", "??????", "??????", "?????????", "??????", "??????", "???????????????", "K???", "???", "???", "???", "???", "??????", "?????????", "??????", "?????????", "?????????", "?????????", "????????????", "??????", "??????", "??????", "?????????", "??????", "?????????", "??????", "??????", "??????", "?????????", "??????", "?????????", "??????", "??????", "??????", "?????????", "??????", "?????????", "??????", "??????", "??????", "??????", "?????????", "??????", "?????????", "??????", "??????", "??????", "??????", "?????????", "??????", "?????????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "?????????", "??????", "?????????", "??????", "??????", "G???", "??????", "??????", "??????", "G???", "??????", "??????", "??????", "G???", "??????", "??????", "??????", "G???", "??????", "??????", "??????", "G???", "??????", "???Y", "??????", "???Y", "??????", "???8", "??????", "??????", "??????", "??????", "??????", "??????", "???GY", "?????????", "???GY", "?????????", "???GY", "?????????", "???GY", "?????????", "???GY", "?????????", "?????????", "???78", "?????????", "?????????", "???78", "?????????", "?????????", "???78", "?????????", "?????????", "???78", "?????????", "??????", "??????", "???B", "??????", "??????", "???", "???", "?????????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "TNND", "??????", "?????????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "?????????", "??????", "??????", "??????", "?????????", "?????????", "??????", "?????????", "??????", "??????", "??????", "??????", "??????", "?????????", "??????", "??????", "??????", "??????", "??????", "??????", "???b", "??????", "??????", "??????", "?????????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "???b", "???b", "??????", "?????????", "??????", "??????", "?????????", "??????", "??????", "??????", "??????", "??????", "?????????", "??????", "?????????", "??????", "???B", "??????", "??????", "??????", "?????????", "??????", "????????????", "?????????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "16dy-??????", "??????", "?????????", "?????????", "???b", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "????????????", "????????????", "??????", "??????", "??????", "??????", "??????", "????????????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "???????????????", "??????", "??????", "?????????", "???????????????", "999?????????", "??????", "?????????", "?????????????????????", "???????????????", "????????????", "????????????", "?????????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "?????????", "????????????", "??????", "??????", "??????", "??????", "??????", "??????", "?????????", "????????????", "?????????", "?????????", "??????", "??????", "????????????", "????????????", "??????", "??????", "?????????", "??????", "????????????", "??????", "?????????", "??????", "?????????", "????????????", "??????", "?????????", "??????", "????????????", "??????", "??????", "??????", "?????????", "??????", "??????", "??????", "?????????", "????????????", "????????????", "??????", "??????", "??????", "????????????", "??????", "???B", "????????????", "????????????", "??????", "????????????", "????????????", "???????????????", "????????????", "??????", "?????????", "?????????", "???????????????", "??????", "?????????", "??????", "97sese", "?????????", "??????AV??????", "????????????", "33bbb??????", "????????????", "????????????", "????????????", "????????????", "BlowJobs", "????????????", "?????????", "?????????", "?????????", "?????????", "?????????", "??????cc", "????????????", "????????????", "????????????", "??????cc", "????????????", "????????????", "????????????", "????????????", "????????????", "??????", "????????????", "??????", "????????????", "SM??????", "????????????", "????????????", "????????????", "????????????", "???B??????", "????????????", "????????????", "SM??????", "??????H???", "????????????", "????????????", "????????????", "????????????", "?????????", "????????????", "????????????", "????????????", "?????????", "????????????", "?????????", "??????", "?????????", "????????????", "????????????", "?????????B", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "??????", "3P??????", "?????????", "????????????", "????????????", "????????????", "????????????", "????????????", "?????????", "????????????", "????????????", "????????????", "????????????", "????????????", "??????", "????????????", "??????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "?????????", "????????????", "????????????", "????????????", "????????????", "?????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "???BB", "????????????", "????????????", "?????????", "????????????", "????????????", "????????????", "????????????", "????????????", "??????", "????????????", "??????", "??????", "??????", "?????????", "?????????", "????????????", "??????", "?????????", "????????????", "??????", "??????", "????????????", "??????", "??????", "?????????", "?????????", "?????????", "?????????", "??????", "????????????", "??????", "????????????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "?????????", "?????????", "??????", "??????", "??????", "a4u", "??????", "??????", "????????????", "????????????", "????????????", "??????", "??????", "?????????", "????????????", "?????????", "????????????", "??????", "??????", "g???", "??????????????????", "????????????", "??????", "??????", "??????", "????????????", "??????????????????", "???????????????", "??????A???", "?????????", "???b", "??????", "??????", "??????", "?????????", "??????", "?????????", "??????", "??????", "??????", "????????????", "????????????", "??????", "?????????", "??????", "??????", "??????", "??????", "??????", "?????????", "??????", "??????", "??????", "????????????", "????????????", "????????????", "????????????", "??????", "??????", "???????????????", "??????", "???????????????", "??????", "??????", "??????", "??????", "???????????????", "????????????", "????????????", "??????", "????????????", "??????", "?????????", "??????", "??????", "??????", "????????????", "??????", "??????", "?????????", "??????", "????????????", "????????????", "??????", "??????", "??????", "??????", "??????", "??????", "???????????????", "??????", "????????????", "?????????", "????????????", "????????????", "?????????", "??????", "??????", "??????", "porn", "???????????????", "????????????", "???????????????", "??????", "?????????", "??????", "??????", "??????", "??????", "????????????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "????????????", "??????", "??????", "??????", "??????", "???????????????", "?????????", "?????????", "????????????", "??????", "????????????", "?????????", "????????????", "??????", "???????????????", "????????????", "??????uu", "????????????", "??????", "mm??????", "????????????", "77bbb", "??????", "????????????", "????????????", "????????????", "????????????", "??????A???", "?????????p", "?????????", "??????", "?????????", "????????????", "????????????", "???97???", "??????", "????????????", "????????????", "????????????", "????????????", "????????????", "??????", "????????????", "sm??????", "?????????", "????????????", "????????????", "?????????", "?????????", "??????", "????????????", "??????", "??????3p", "????????????", "????????????", "????????????", "??????", "????????????", "????????????", "????????????", "????????????", "??????AV", "????????????", "????????????", "????????????", "?????????", "???????????????", "?????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "?????????", "????????????", "??????", "????????????", "??????", "??????", "??????", "?????????", "????????????", "????????????", "????????????", "????????????", "???????????????", "?????????", "???????????????", "???????????????", "????????????", "????????????", "????????????", "?????????", "???B??????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "??????", "?????????", "??????AV", "????????????", "????????????", "????????????", "?????????B", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "?????????", "????????????", "??????", "??????", "????????????", "??????", "??????", "????????????", "??????", "????????????", "??????", "????????????", "??????", "??????", "??????", "??????", "??????", "??????", "????????????", "????????????", "????????????", "????????????", "??????", "????????????", "????????????", "??????", "?????????", "??????", "??????", "?????????", "?????????", "??????", "?????????", "?????????", "???B", "??????", "??????", "?????????", "???B", "??????", "a4y", "??????", "????????????", "?????????", "??????", "?????????", "??????", "???P", "??????", "??????", "??????", "18???", "g???", "teen", "????????????", "??????", "???b", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????????????????", "?????????", "??????", "????????????", "????????????", "????????????", "??????", "??????", "?????????????????????", "????????????", "??????????????????", "???????????????", "????????????", "????????????", "??????", "?????????", "??????", "??????", "????????????", "????????????", "?????????", "????????????", "???????????????", "???????????????", "????????????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "H??????", "????????????", "??????", "??????", "??????", "??????", "??????", "???????????????", "????????????", "????????????", "??????", "?????????????????????", "????????????", "????????????", "????????????", "??????", "??????", "????????????", "??????", "??????", "????????????", "????????????", "????????????", "??????", "?????????", "petgirl", "????????????", "????????????", "??????", "???????????????", "????????????", "??????", "??????", "??????", "??????", "?????????", "??????", "????????????", "??????", "?????????", "??????", "??????", "??????", "??????", "??????", "??????", "????????????", "??????", "????????????", "55sss?????????", "?????????", "xiao77", "????????????", "????????????", "????????????", "????????????", "????????????", "??????????????????", "222se??????", "??????", "????????????", "??????", "????????????", "????????????", "?????????", "????????????", "??????xx???", "?????????", "??????bt", "????????????", "??????", "????????????", "????????????", "????????????", "?????????", "???????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "??????????????????", "????????????", "??????", "??????", "?????????", "??????xx???", "??????", "????????????", "????????????", "????????????", "????????????", "??????", "????????????", "????????????", "????????????", "??????", "?????????", "????????????", "????????????", "??????", "????????????", "????????????", "????????????", "????????????", "????????????", "?????????", "????????????", "????????????", "????????????", "????????????", "????????????", "??????", "????????????", "???????????????", "?????????", "????????????", "SM??????", "????????????", "????????????", "????????????", "?????????P", "??????", "????????????", "??????", "????????????", "????????????", "????????????", "????????????", "?????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "?????????", "????????????", "???????????????", "?????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "??????", "????????????", "????????????", "????????????", "?????????", "MM???", "????????????", "?????????", "????????????", "????????????", "????????????", "????????????", "?????????B", "????????????", "?????????", "????????????", "??????", "????????????", "????????????", "????????????", "????????????", "??????", "??????", "??????", "??????", "????????????", "????????????", "??????", "????????????", "??????", "??????", "????????????", "??????", "??????", "??????", "??????", "?????????", "????????????", "??????", "??????", "?????????", "??????", "??????", "??????", "??????", "??????", "?????????", "??????", "??????", "??????", "??????", "??????", "??????", "????????????", "??????", "?????????", "??????", "?????????", "??????", "????????????", "??????", "????????????", "????????????", "?????????", "????????????", "?????????", "??????", "????????????", "??????", "????????????", "???B", "??????", "??????", "???", "???", "?????????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "TNND", "??????", "?????????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "?????????", "??????", "??????", "??????", "?????????", "?????????", "??????", "?????????", "??????", "??????", "??????", "??????", "??????", "?????????", "??????", "??????", "??????", "??????", "??????", "??????", "???b", "??????", "??????", "??????", "?????????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "???b", "???b", "??????", "?????????", "??????", "??????", "?????????", "??????", "??????", "??????", "??????", "??????", "?????????", "??????", "?????????", "??????", "???B", "??????", "??????", "??????", "?????????", "??????", "????????????", "?????????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "16dy-??????", "??????", "?????????", "?????????", "???b", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "????????????", "????????????", "??????", "??????", "??????", "??????", "??????", "????????????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "???????????????", "??????", "??????", "?????????", "???????????????", "999?????????", "??????", "?????????", "?????????????????????", "???????????????", "????????????", "????????????", "?????????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "?????????", "????????????", "??????", "??????", "??????", "??????", "??????", "??????", "?????????", "????????????", "?????????", "?????????", "??????", "??????", "????????????", "????????????", "??????", "??????", "?????????", "??????", "????????????", "??????", "?????????", "??????", "?????????", "????????????", "??????", "?????????", "??????", "????????????", "??????", "??????", "??????", "?????????", "??????", "??????", "??????", "?????????", "????????????", "????????????", "??????", "??????", "??????", "????????????", "??????", "???B", "????????????", "????????????", "??????", "????????????", "????????????", "???????????????", "????????????", "??????", "?????????", "?????????", "???????????????", "??????", "?????????", "??????", "97sese", "?????????", "??????AV??????", "????????????", "33bbb??????", "????????????", "????????????", "????????????", "????????????", "BlowJobs", "????????????", "?????????", "?????????", "?????????", "?????????", "?????????", "??????cc", "????????????", "????????????", "????????????", "??????cc", "????????????", "????????????", "????????????", "????????????", "????????????", "??????", "????????????", "??????", "????????????", "SM??????", "????????????", "????????????", "????????????", "????????????", "???B??????", "????????????", "????????????", "SM??????", "??????H???", "????????????", "????????????", "????????????", "????????????", "?????????", "????????????", "????????????", "????????????", "?????????", "????????????", "?????????", "??????", "?????????", "????????????", "????????????", "?????????B", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "??????", "3P??????", "?????????", "????????????", "????????????", "????????????", "????????????", "????????????", "?????????", "????????????", "????????????", "????????????", "????????????", "????????????", "??????", "????????????", "??????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "?????????", "????????????", "????????????", "????????????", "????????????", "?????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "???BB", "????????????", "????????????", "?????????", "????????????", "????????????", "????????????", "????????????", "????????????", "??????", "????????????", "??????", "??????", "??????", "?????????", "?????????", "????????????", "??????", "?????????", "????????????", "??????", "??????", "????????????", "??????", "??????", "?????????", "?????????", "?????????", "?????????", "??????", "????????????", "??????", "????????????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "?????????", "?????????", "??????", "??????", "??????", "a4u", "??????", "??????", "????????????", "????????????", "????????????", "??????", "??????", "?????????", "????????????", "?????????", "????????????", "??????", "??????", "g???", "??????????????????", "????????????", "??????", "??????", "??????", "????????????", "??????????????????", "???????????????", "??????A???", "?????????", "???b", "??????", "??????", "??????", "?????????", "??????", "?????????", "??????", "??????", "??????", "????????????", "????????????", "??????", "?????????", "??????", "??????", "??????", "??????", "??????", "?????????", "??????", "??????", "??????", "????????????", "????????????", "????????????", "????????????", "??????", "??????", "???????????????", "??????", "???????????????", "??????", "??????", "??????", "??????", "???????????????", "????????????", "????????????", "??????", "????????????", "??????", "?????????", "??????", "??????", "??????", "????????????", "??????", "??????", "?????????", "??????", "????????????", "????????????", "??????", "??????", "??????", "??????", "??????", "??????", "???????????????", "??????", "????????????", "?????????", "????????????", "????????????", "?????????", "??????", "??????", "??????", "porn", "???????????????", "????????????", "???????????????", "??????", "?????????", "??????", "??????", "??????", "??????", "????????????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "????????????", "??????", "??????", "??????", "??????", "???????????????", "?????????", "?????????", "????????????", "??????", "????????????", "?????????", "????????????", "??????", "???????????????", "????????????", "??????uu", "????????????", "??????", "mm??????", "????????????", "77bbb", "??????", "????????????", "????????????", "????????????", "????????????", "??????A???", "?????????p", "?????????", "??????", "?????????", "????????????", "????????????", "???97???", "??????", "????????????", "????????????", "????????????", "????????????", "????????????", "??????", "????????????", "sm??????", "?????????", "????????????", "????????????", "?????????", "?????????", "??????", "????????????", "??????", "??????3p", "????????????", "????????????", "????????????", "??????", "????????????", "????????????", "????????????", "????????????", "??????AV", "????????????", "????????????", "????????????", "?????????", "???????????????", "?????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "?????????", "????????????", "??????", "????????????", "??????", "??????", "??????", "?????????", "????????????", "????????????", "????????????", "????????????", "???????????????", "?????????", "???????????????", "???????????????", "????????????", "????????????", "????????????", "?????????", "???B??????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "??????", "?????????", "??????AV", "????????????", "????????????", "????????????", "?????????B", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "?????????", "????????????", "??????", "??????", "????????????", "??????", "??????", "????????????", "??????", "????????????", "??????", "????????????", "??????", "??????", "??????", "??????", "??????", "??????", "????????????", "????????????", "????????????", "????????????", "??????", "????????????", "????????????", "??????", "?????????", "??????", "??????", "?????????", "?????????", "??????", "?????????", "?????????", "???B", "??????", "??????", "?????????", "???B", "??????", "a4y", "??????", "????????????", "?????????", "??????", "?????????", "??????", "???P", "??????", "??????", "??????", "18???", "g???", "teen", "????????????", "??????", "???b", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????????????????", "?????????", "??????", "????????????", "????????????", "????????????", "??????", "??????", "?????????????????????", "????????????", "??????????????????", "???????????????", "????????????", "????????????", "??????", "?????????", "??????", "??????", "????????????", "????????????", "?????????", "????????????", "???????????????", "???????????????", "????????????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "H??????", "????????????", "??????", "??????", "??????", "??????", "??????", "???????????????", "????????????", "????????????", "??????", "?????????????????????", "????????????", "????????????", "????????????", "??????", "??????", "????????????", "??????", "??????", "????????????", "????????????", "????????????", "??????", "?????????", "petgirl", "????????????", "????????????", "??????", "???????????????", "????????????", "??????", "??????", "??????", "??????", "?????????", "??????", "????????????", "??????", "?????????", "??????", "??????", "??????", "??????", "??????", "??????", "????????????", "??????", "????????????", "55sss?????????", "?????????", "xiao77", "????????????", "????????????", "????????????", "????????????", "????????????", "??????????????????", "222se??????", "??????", "????????????", "??????", "????????????", "????????????", "?????????", "????????????", "??????xx???", "?????????", "??????bt", "????????????", "??????", "????????????", "????????????", "????????????", "?????????", "???????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "??????????????????", "????????????", "??????", "??????", "?????????", "??????xx???", "??????", "????????????", "????????????", "????????????", "????????????", "??????", "????????????", "????????????", "????????????", "??????", "?????????", "????????????", "????????????", "??????", "????????????", "????????????", "????????????", "????????????", "????????????", "?????????", "????????????", "????????????", "????????????", "????????????", "????????????", "??????", "????????????", "???????????????", "?????????", "????????????", "SM??????", "????????????", "????????????", "????????????", "?????????P", "??????", "????????????", "??????", "????????????", "????????????", "????????????", "????????????", "?????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "?????????", "????????????", "???????????????", "?????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "????????????", "??????", "????????????", "????????????", "????????????", "?????????", "MM???", "????????????", "?????????", "????????????", "????????????", "????????????", "????????????", "?????????B", "????????????", "?????????", "????????????", "??????", "????????????", "????????????", "????????????", "????????????", "??????", "??????", "??????", "??????", "????????????", "????????????", "??????", "????????????", "??????", "??????", "????????????", "??????", "??????", "??????", "??????", "?????????", "????????????", "??????", "??????", "?????????", "??????", "??????", "??????", "??????", "??????", "?????????", "??????", "??????", "??????", "??????", "??????", "??????", "????????????", "??????", "?????????", "??????", "?????????", "??????", "????????????", "??????", "????????????", "????????????", "?????????", "????????????", "?????????", "??????", "????????????", "??????", "????????????", "??????", "???", "??????", "??????", "??????", "??????", "???", "??????", "??????", "??????", "??????", "?????????", "??????", "??????", "??????", "?????????", "?????????", "??????", "??????", "?????????", "??????", "??????", "??????", "??????", "??????", "???B", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "???", "???", "??????", "??????", "??????", "??????", "??????", "??????", "????????????", "??????", "??????", "???", "??????", "??????", "?????????", "???", "???", "??????", "??????", "???", "???", "???", "???", "???", "???", "??????", "sm", "??????", "???B", "ADMIN", "Admin", "xtl", "system", "admin", "Administrator", "administrator", "??????", "??????", "?????????", "????????????", "?????????", "???????????????", "??????", "??????", "??????", "????????????", "??????", "??????", "??????", "??????", "game", "master", "GAMEMASTER", "GameMaster", "GM", "Gm", "gm", "???????????????", "Client", "Server", "CS", "Cs", "cs", "cS", "KEFU", "kefu", "Kefu", "KeFu", "??????", "????????????", "??????", "????????????", "TEsT", "tESt", "test", "test", "TeSt", "tEST", "Test", "??????", "????????????", "??????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "??????", "sf", "??????", "???????????????", "wg", "??????", "&", "??????", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "?????????", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "??????", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "??????", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "???", "??????", "???", "???", "???", "???", "??????", "???", "???", "???", "???", "???", "???", "???", "???", "??????", "???", "Xijinping", "likeqiang", "zhangdejiang", "yuzhengsheng", "liuyunshan", "wangqishan", "zhanggaoli", "dishun", "Dishun", "DISHUN", "DiShun", "16???", "18???", "21?????????????????????", "6-4tianwang", "89-64cdjp", "ADMIN", "AIDS", "Aiort??????", "ai???", "Arqus?????????", "asshole", "Atan????????????", "A???", "Baichi", "Baopi", "Bao???", "bastard", "Bc", "biaozi", "Biao???", "bignews", "bitch", "Bi???", "BLOWJOB", "boxun", "B???", "caoB", "caobi", "cao???", "cao??????", "cao?????????", "cha???", "chinaliberal", "chinamz", "chinesenewsnet", "Clockgemstone", "cnd", "creaders", "Crestbone", "dafa", "dajiyuan", "damn", "dfdz", "DICK", "dpp", "EVENT", "falu", "falun", "falundafa", "fa???", "Feelmistone", "Fku", "FLG", "flg", "freechina", "freedom", "freenet", "Fuck", "fuck", "GAMEMASTER", "gan???", "GCD", "gcd", "Gruepin", "HACKING", "hongzhi", "hrichina", "http", "huanet", "hypermart", ".net", "incest", "item", "J8", "JB", "jiangdongriji", "jian???", "jiaochuang", "jiaochun", "jiba", "jinv", "Ji???", "Kao", "KISSMYASS", "lihongzhi", "Mai???", "making", "minghui", "minghuinews", "nacb", "naive", "Neckromancer", "nmis", "paper64", "peacehall", "PENIS", "playboy", "pussy", "qiangjian", "Rape", "renminbao", "renmingbao", "rfa", "safeweb", "saobi", "sb", "SEX", "sex", "sf", "SHIT", "shit", "simple", "SUCK", "sucker", "svdc", "System", "taip", "TEST", "The9", "The9City", "tibetalk", "TMD", "TNND", "triangle", "triangleboy", "Tringel", "UltraSurf", "unixbox", "ustibet", "voa", "voachinese", "wangce", "WEBZEN", "WG", "wstaiji", "xinsheng", "yuming", "zhengjian", "zhengjianwang", "zhenshanren", "zhuanfalunADMIN", "AIDS", "AIORT??????", "AI???", "ARQUS?????????", "ASSHOLE", "ATAN????????????", "A???", "BAICHI", "BAOPI", "BAO???", "BASTARD", "BC", "BIAOZI", "BIAO???", "BIGNEWS", "BITCH", "BI???", "BLOWJOB", "BOXUN", "B???", "CAOB", "CAOBI", "CAO???", "CC??????", "CHA???", "CHINALIBERAL", "CHINAMZ", "CHINESENEWSNET", "CLOCKGEMSTONE", "CND", "CREADERS", "CRESTBONE", "DAFA", "DAJIYUAN", "DAMN", "DFDZ", "DICK", "DPP", "EVENT", "FALU", "FALUN", "FALUNDAFA", "FA???", "FEELMISTONE", "FKU", "FLG", "FREECHINA", "FREEDOM", "FREENET", "FUCK", "GAMEMASTER", "GAN???", "GCD", "GM", "GRUEPIN", "HACKING", "HONGZHI", "HRICHINA", "HTTP", "HUANET", "HYPERMART", ".NET", "INCEST", "ITEM", "J8", "JB", "JIANGDONGRIJI", "JIAN???", "JIAOCHUANG", "JIAOCHUN", "JIBA", "JINV", "JI???", "KAO", "KISSMYASS", "???", "LIHONGZHI", "MAI???", "MAKING", "MINGHUI", "MINGHUINEWS", "???", "???", "NACB", "NAIVE", "NECKROMANCER", "NMIS", "PAPER64", "PEACEHALL", "PENIS", "PLAYBOY", "PUSSY", "QIANGJIAN", "RAPE", "RENMINBAO", "RENMINGBAO", "RFA", "SAFEWEB", "SAOBI", "SB", "SEX", "SF", "SHIT", "SIMPLE", "SUCK", "SUCKER", "SVDC", "SYSTEM", "TAIP", "THE9", "THE9CITY", "TIBETALK", "TMD", "TNND", "TRIANGLE", "TRIANGLEBOY", "TRINGEL", "ULTRASURF", "UNIXBOX", "USTIBET", "VOA", "VOACHINESE", "WANGCE", "WEBZEN", "WG", "WSTAIJI", "WWW", "WWW.", "XINSHENG", "YUMING", "ZHENGJIAN", "ZHENGJIANWANG", "ZHENSHANREN", "ZHUANFALUN", "???", "???", "??????", "?????????", "?????????", "?????????", "?????????", "?????????", "???", "??????", "?????????", "??????", "??????1", "???", "???", "???", "???", "??????", "???", "???", "???", "???", "?????????", "???", "???", "???", "???", "???", "??????", "???", "???", "??????", "?????????", "??????", "???????????????", "??????????????????", "??????", "???", "???", "???", "???", "???", "???", "???", "??????", "??????", "???", "???", "??????", "????????????", "?????????", "?????????", "??????????????????", "?????????", "?????????", "??????", "?????????", "???", "????????????", "???", "?????????", "?????????", "?????????", "?????????", "??????", "?????????", "???", "????????????", "?????????", "?????????", "??????", "?????????", "??????", "????????????", "??????", "??????", "??????", "??????", "????????????", "??????", "???????????????", "?????????????????????", "????????????????????????", "??????????????????", "?????????????????????", "??????", "????????????", "??????????????????", "?????????", "???", "??????", "??????", "???", "???", "???", "????????????", "??????", "??????", "??????", "????????????", "???????????????", "?????????", "?????????", "?????????", "?????????", "???", "??????", "?????????B", "????????????", "????????????", "?????????", "????????????", "?????????", "?????????", "???", "?????????", "?????????", "???????????????", "?????????B", "????????????", "????????????", "?????????", "????????????", "???", "???", "???", "???", "???????????????", "??????", "??????", "??????", "????????????", "????????????", "?????????", "?????????", "?????????", "?????????", "?????????", "??????", "??????", "?????????", "??????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "???", "???", "???", "???", "??????", "?????????", "???", "??????", "??????", "???????????????", "???????????????", "????????????", "????????????", "?????????", "????????????", "??????", "??????????????????", "?????????B", "????????????", "????????????", "???", "???", "???B", "??????", "??????", "?????????B", "????????????", "????????????", "???????????????", "????????????", "??????", "?????????", "?????????", "?????????", "???????????????", "?????????", "?????????", "??????????????????", "?????????", "????????????", "?????????", "?????????", "?????????", "?????????", "???????????????", "???????????????", "??????????????????", "???", "?????????", "?????????", "??????", "???", "??????", "??????", "?????????", "?????????", "??????", "?????????", "???", "????????????", "???", "????????????", "????????????", "????????????", "?????????", "?????????", "?????????", "????????????", "??????????????????", "???????????????", "????????????", "??????????????????", "??????", "??????", "??????", "????????????", "????????????", "????????????", "??????????????????", "??????????????????", "??????", "????????????", "??????", "??????????????????", "????????????", "??????", "????????????", "??????", "???????????????", "??????", "???", "???", "??????", "??????", "?????????", "??????", "?????????", "??????", "??????", "?????????", "?????????", "??????", "?????????", "???~???", "???~???", "???~???", "???~???", "???~???", "?????????", "??????", "?????????", "??????", "??????", "??????", "????????????", "?????????", "???????????????", "??????", "?????????", "?????????", "???????????????", "???????????????", "?????????", "?????????", "?????????", "???????????????", "??????", "????????????", "???????????????", "?????????", "?????????", "??????????????????", "????????????", "??????", "???", "???????????????", "????????????", "??????????????????", "?????????", "??????", "?????????????????????", "?????????", "?????????", "???", "???", "???", "?????????", "???bi", "??????", "??????", "?????????", "?????????", "??????", "??????", "????????????", "????????????", "?????????", "?????????", "??????", "?????????", "??????", "?????????", "?????????", "??????", "??????", "????????????", "????????????", "??????", "????????????", "?????????", "????????????", "?????????", "?????????", "????????????", "??????", "??????", "????????????", "??????(?????????????????????)", "??????", "(????????????)", "???", "?????????", "??????", "??????", "?????????", "????????????", "??????", "??????", "?????????", "???", "??????", "????????????", "????????????", "??????", "?????????", "???", "???", "????????????", "??????", "???", "???", "???", "?????????", "???????????????", "??????", "???", "?????????", "??????", "?????????", "??????", "??????", "???", "???", "?????????", "?????????B", "???????????????", "???????????????", "???????????????", "???", "???", "?????????", "?????????", "?????????", "????????????", "????????????", "??????", "??????", "????????????", "???", "?????????", "?????????", "??????", "??????", "???", "???", "??????", "?????????", "??????", "?????????", "?????????", "?????????", "????????????", "????????????", "??????", "??????", "?????????", "???", "???", "?????????", "?????????", "?????????", "?????????", "?????????", "????????????", "???????????????", "???????????????", "??????????????????", "??????", "???", "?????????", "??????????????????", "????????????", "??????????????????", "??????????????????", "??????", "???", "??????", "?????????", "?????????", "??????", "?????????", "????????????", "??????", "??????", "??????", "?????????", "?????????", "????????????", "???", "???", "????????????", "????????????", "????????????", "????????????", "???????????????", "???", "??????", "????????????", "???????????????", "???8", "??????", "??????", "??????", "??????", "??????", "???????????????", "??????", "??????", "?????????", "?????????", "???", "???", "?????????", "?????????", "???", "?????????", "???????????????", "?????????????????????", "???", "???", "?????????", "?????????", "???B", "???bi", "??????", "??????", "??????", "??????", "??????", "?????????", "??????", "?????????", "?????????", "?????????", "?????????", "??????", "?????????", "?????????", "?????????", "??????", "?????????", "??????", "?????????", "?????????", "?????????????????????", "?????????", "???", "???????????????", "??????????????????", "???", "?????????", "???", "?????????", "???", "??????", "????????????????????????", "????????????", "?????????", "?????????", "???", "??????", "??????", "??????", "????????????", "???????????????", "????????????", "???", "???????????????", "???", "????????????", "???????????????", "??????????????????????????????", "??????????????????", "???", "???", "????????????", "???", "??????", "??????", "????????????", "???????????????", "?????????", "????????????", "????????????", "???????????????", "?????????", "???", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "????????????", "???", "????????????", "???????????????", "????????????", "????????????", "???", "???", "?????????", "???", "??????", "??????????????????", "?????????", "??????", "?????????", "??????", "???B", "??????", "??????", "??????", "??????", "???B", "??????", "??????", "??????", "??????", "???????????????", "??????", "??????", "???", "?????????", "???", "?????????", "?????????", "?????????", "?????????", "?????????", "??????", "??????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "????????????", "?????????", "?????????", "?????????", "?????????", "???", "???", "???", "???", "?????????", "?????????", "?????????", "?????????", "??????", "??????", "???????????????", "??????", "????????????", "??????????????????", "????????????", "??????", "????????????", "????????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "???", "??????", "?????????", "?????????", "??????", "?????????", "?????????", "?????????", "?????????", "?????????", "??????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "???", "???", "?????????", "????????????", "??????", "?????????", "?????????", "???", "?????????", "?????????", "??????", "??????", "??????", "???", "??????", "??????", "??????", "??????", "??????", "???????????????", "?????????", "??????", "?????????", "?????????", "?????????", "???", "???", "???????????????", "???B", "??????", "??????", "??????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "??????", "??????", "??????", "???", "?????????", "??????", "??????", "??????", "??????", "??????", "??????", "?????????", "??????", "?????????", "??????", "????????????", "?????????", "????????????", "??????", "????????????", "?????????", "????????????", "???", "???", "??????", "???", "??????", "?????????", "??????", "????????????", "??????", "?????????", "???", "???", "???", "????????????", "?????????", "????????????", "??????", "??????", "??????B", "?????????", "????????????", "????????????", "????????????", "????????????", "??????", "??????", "??????????????????", "?????????", "??????", "??????", "?????????", "?????????", "???", "??????", "?????????", "?????????", "?????????", "????????????", "??????????????????", "??????", "?????????", "????????????", "????????????", "????????????", "??????????????????", "??????", "?????????????????????", "???", "??????", "?????????", "???", "?????????", "????????????", "???", "??????", "?????????", "???", "???", "??????", "??????", "??????", "??????", "???", "???", "???", "??????", "?????????", "?????????", "???", "???", "???", "???", "??????", "??????", "????????????", "???", "???", "???", "??????", "?????????", "??????", "?????????", "??????", "???", "????????????", "??????", "??????", "???", "??????", "?????????", "???", "????????????", "???", "????????????", "????????????", "???", "???", "?????????", "???", "?????????", "?????????", "???????????????", "?????????", "???????????????", "??????????????????", "????????????", "??????????????????", "??????", "????????????", "??????", "???????????????", "?????????", "????????????", "?????????", "???", "??????", "??????", "??????????????????", "?????????", "???K???", "????????????", "?????????", "??????????????????", "???", "???", "???", "???B", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "????????????", "????????????", "?????????", "??????", "??????", "?????????", "????????????", "??????", "?????????", "???????????????", "???", "????????????", "???????????????", "???", "???", "?????????", "???", "??????????????????", "?????????????????????", "???", "?????????", "??????", "?????????", "??????????????????", "???????????????", "???", "???", "???", "????????????", "???????????????", "????????????", "????????????", "???", "?????????", "????????????", "????????????????????????", "??????????????????", "????????????", "??????????????????", "???????????????", "???", "???", "????????????", "?????????", "??????????????????", "???????????????????", "??????", "?????????", "?????????", "?????????", "???????", "??????", "?????????", "??????", "????????????", "?????????", "????????????", "?????????", "???", "?????????", "???", "?????????", "??????", "?????????", "?????????", "??????????????????", "?????????", "??????????????????", "??????????????????", "?????????", "?????????", "?????????", "???", "????????????????????????", "????????????????????????", "?????????", "?????????", "??????", "?????????", "?????????", "?????????", "??????", "??????", "???", "???", "??????", "????????????", "????????????", "?????????", "???????????????", "?????????", "????????????????????????", "????????????", "????????????????????????", "???????????????", "??????????????????", "???", "??????", "??????????????????", "??????????????????", "?????????", "?????????", "???", "???", "?????????", "??????????????????", "???????????????", "???????????????", "???????????????", "??????", "?????????", "???", "???", "???", "???????????????", "??????", "????????????", "??????", "????????????", "?????????????????????", "?????????????????????", "??????", "????????????", "???????????????", "???", "???", "???", "???", "????????????", "???????????????", "???????????????", "???", "??????", "?????????", "??????????????????", "?????????", "?????????", "?????????", "?????????", "??????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "??????", "??????", "??????", "???", "???B", "??????", "??????", "?????????", "?????????", "???", "???????????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "???????????????", "?????????", "???", "??????", "??????", "????????????", "???", "???", "??????", "??????", "???", "???", "??????", "???", "???", "???", "??????", "????????????", "???????????????", "???", "?????????", "?????????", "???", "???B???", "?????????", "?????????", "?????????", "?????????", "???????????????", "?????????", "?????????", "?????????", "?????????", "?????????", "???????????????", "????????????", "????????????", "???????????????", "?????????", "?????????", "???????????????", "??????????????????", "????????????", "?????????", "?????????", "????????????", "??????", "??????", "?????????", "??????", "???", "????????????", "??????????????????", "?????????", "?????????", "?????????", "?????????", "???", "??????", "??????", "??????", "??????", "?????????", "???", "??????", "???", "?????????", "?????????", "?????????", "?????????", "?????????", "??????", "???", "??????????????????", "??????", "??????", "??????", "?????????", "?????????", "??????", "?????????", "??????", "??????", "?????????", "???", "?????????", "?????????????????????", "??????", "??????", "??????", "?????????", "???????????????", "?????????", "???", "????????????", "?????????", "????????????????????????", "??????", "??????????????????", "??????????????????", "????????????", "????????????", "????????????", "?????????", "?????????????????????", "???", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "?????????", "??????", "????????????", "???????????????", "????????????", "???????????????", "?????????", "?????????", "???????????????", "???????????????", "????????????", "?????????", "???????????????", "???????????????", "??????", "??????", "?????????", "?????????", "???????????????", "??????", "????????????", "???", "?????????", "???", "???", "???", "????????????(?????????", "??????", "?????????", "?????????", "??????", "???", "??????", "???", "??????", "??????", "??????", "??????", "??????", "???", "??????", "???", "??????????????????", "???", "?????????", "?????????", "??????", "??????", "??????", "?????????", "?????????", "?????????", "?????????", "?????????", "?????????", "??????", "??????", "??????", "?????????", "?????????", "??????", "?????????", "?????????", "?????????", "??????", "??????", "????????????", "?????????", "???????????????", "???", "?????????", "?????????", "??????", "?????????", "??????", "?????????", "??????", "???????????????", "???", "???", "??????????????????", "???", "???", "???", "???????????????", "????????????", "????????????", "??????????????????", "???????????????", "???????????????", "????????????", "????????????", "?????????????????????", "??????????????????", "???????????????", "??????????????????", "??????????????????", "??????????????????", "????????????", "?????????", "????????????", "????????????", "????????????", "????????????", "????????????????????????", "??????????????????", "????????????", "?????????????????????", "??????????????????", "???????????????", "??????????????????", "?????????", "?????????", "?????????", "?????????", "?????????", "???", "?????????", "???????????????", "??????", "???????????????", "??????", "???", "??????", "???", "????????????", "???", "??????", "?????????", "??????????????????", "??????", "???", "???", "???", "???", "??????", "??????", "bcd.s.59764.com", "kkk.xaoh.cn", "www.xaoh.cn", "zzz.xaoh.cn", "aa.yazhousetu.hi.9705.net.cn", "eee.xaoh.cn", "lll.xaoh.cn", "jj.pangfangwuyuetian.hi.9705.net.cn", "rrr.xaoh.cn", "ooo.xaoh.cn", "www.zy528.com", "aaad.s.59764.com", "www.dy6789.cn", "aaac.s.51524.com", "208.43.198.56", "166578.cn", "www.wang567.com", "www.bin5.cn", "www.sanjidianying.com.cn", "www.anule.cn", "%77%77%77%2E%39%37%38%38%30%38%2E%63%6F%6D", "www.976543.com", "www.50spcombaidu1828adyou97sace.co.cc", "chengrenmanhua.1242.net.cn", "qingsewuyuetian.1174.net.cn", "lunlidianyingxiazai.1174.net.cn", "siwameitui.1274.net.cn", "niuniujidi.1174.net.cn", "xiao77.1243.net.cn", "woyinwose.1243.net.cn", "dingxiang.1249.net", "cnaicheng.1174.net.cn", "1234chengren.1249.net.cn", "sewuyuetian.1174.net.cn", "huangsexiaoshuo.1242.net.cn", "lunlidianying.1274.net.cn", "xingqingzhongren.1174.net.cn", "chengrenwangzhi.1242.net.cn", "xiao77luntan.1249.net.cn", "dingxiang.1243.net.cn", "11xp.1243.net.cn", "baijie.1249.net.cn", "sewuyuetian.1274.net.cn", "meiguiqingren.1274.net.cn", "tb.hi.4024.net.cn", "www.91wangyou.com", "www.wow366.cn", "www.yxnpc.com", "www.365jw.com", "58.253.67.74", "www.978808.com", "www.sexwyt.com", "7GG", "www.567yx.com", "131.com", "bbs.7gg.cn", "www.99game.net", "ppt.cc", "www.zsyxhd.cn", "www.foyeye.com", "www.23nice.com.cn", "www.maituan.com", "www.ylteam.cn", "www.yhzt.org", "vip886.com", "www.neicehao.cn", "bbs.butcn.com", "www.gamelifeclub.cn", "consignment5173", "www.70yx.com", "www.legu.com", "ko180", "bbs.pkmmo", "whoyo.com", "www.2q5q.com", "www.zxkaku.cn", "www.gw17173.cn", "www.315ts.net", "qgqm.org", "17173dl.net", "i9game.com", "365gn", "158le.com", "1100y.com", "bulaoge.com", "17youle.com", "reddidi.com.cn", "icpcn.com", "ul86.com", "showka8.com", "szlmgh.cn", "bbs.766.com", "www.766.com", "91bysd.cn", "jiayyou.cn", "gigabyte.cn", "duowan", "wgxiaowu.com", "youxiji888.cn", "yz55.cn", "Carrefour", "51jiafen.cn", "597ft.com", "itnongzhuang.com2y7v.cnhwxvote.cn", "92klgh.cn", "xiaoqinzaixian.cn", "661661.com", "haosilu.com", "dl.com", "xl517.com", "sjlike.com", "tont.cn", "xq-wl.cn", "feitengdl.com", "bz176.com", "dadati.com", "asgardcn.com", "dolbbs.com", "okaygood.cn", "1t1t.com", "jinpaopao.com", "blacksee.com.cn", "1qmsj.com", "202333.com", "luoxialu.cn", "37447.cn", "567567aa.cn", "09city.com", "71ka.com", "fy371.com", "365tttyx.com", "host800.com", "lybbs.info", "ys168.com", "88mysf.com", "5d6d.com", "id666.uqc.cn", "stlmbbs.cn", "pcikchina.com", "lxsm888.com", "wangyoudl.com", "chinavfx.net", "zxsj188.com", "wg7766.cn", "e7sw.cn", "jooplay.com", "gssmtt.com", "likeko.com", "lyx-game.cn", "wy33.com", "zy666.net", "newsmth.net", "l2jsom.cn", "13888wg.com", "qtoy.com", "1000scarf.com", "digitallongking.com", "zaixu.net", "ncyh.cn", "888895.com", "ising99.com", "cikcatv.2om", "parke888.com", "01gh.com", "gogo.net", "uu1001.com", "wy724.com", "prettyirene.net", "yaokong7.com", "zzmysf.com", "52sxhy.cn", "92wydl.com", "g365.net", "pkmmo.com", "52ppsa.cn", "bl62.com", "canyaa.com", "lordren.com", "xya3.cn", "5m5m5m.com", "www.gardcn.com", "www.sf766.com.cn", "ent365.com", "18900.com", "7mmo.com", "cdream.com", "wy3868.com", "nbfib.cn", "17173yxdl.cn", "osisa.cn", "haouse.cn", "54hero.com", "ieboy.cn", "geocities.com", "xiuau.cn", "cvceo.com", "fxjsqc.com", "thec.cn", "c5c8.cn", "a33.com", "qqsg.org", "my3q.com", "51juezhan.com", "kartt.cn", "hexun.com", "15wy.com", "13ml.net", "homexf.cn", "xyxgh.com", "jdyou.com", "langyou.info", "duowan.com", "8188mu.com", "tianlong4f.cn", "yeswm.com", "wgbobo.cn", "haog8.cn", "47513.cn", "92ey.com", "hao1788.co", "mgjzybj.com", "xdns.eu", "shenycs.co", "mpceggs.cn", "kod920.cn", "njgamecollege.org", "51hdw.com", "025game.cn", "bibidu.com", "bwowd.com", "3kwow.com", "zx002.com", "bazhuwg.cn", "991game.com", "zuanshi1000.cn", "10mb.cn", "Huihuangtx.com", "chongxianmu.cn", "any2000.com", "99sa.com", "zhidian8.com", "t9wg.cn", "bobaoping", "qixingnet.com", "88kx.com", "00sm.cn", "moyi520.cn", "d666.com", "fisonet.com", "0571qq.com", "173at.com", "pk200.com", "2feiche.cn", "jjdlw.com", "xyq2sf.com", "69nb.com", "txwsWind", "jiayyou.com", "Freetibet", "isil", "ISIS", "ISIL", "k???", "?????????", "?????????", "?????????", "?????????", "???????????????", "????????????", "?????????", "??????", "?????????", "????????????", "?????????", "?????????", "???????????????", "???????????????", "?????????", "???????????????", "?????????", "?????????????????????????????????", "???????????????", "?????????", "?????????", "????????????", "????????????", "????????????", "????????????", "??????", "???????????????????????????", "?????????", "??????", "???????????????", "????????????", "??????", "???", "??????", "?????????", "?????????", "jian???Jiba", "sb", "Penis", "isis", "ISILfalungong", "falun", "k???", "?????????", "?????????", "?????????", "?????????", "???????????????", "????????????", "?????????", "??????", "?????????????????????", "?????????", "?????????", "???????????????", "???????????????", "?????????", "???????????????", "?????????", "??????????????????????????????", "???????????????", "?????????", "?????????", "????????????", "????????????", "????????????", "??????", "???????????????????????????", "?????????", "??????", "????????????", "???????????????", "???", "??????", "?????????", "?????????", "??????", "?????????", "??????", "????????????", "??????", "????????????", "????????????", "??????", "??????", "?????????", "??????", "??????", "?????????", "?????????", "??????", "????????????", "??????", "?????????", "?????????", "??????", "??????", "??????", "??????", "?????????", "??????", "??????", "?????????", "?????????", "?????????", "????????????", "??????", "??????", "??????", "???3", "??????", "??????", "??????", "??????", "?????????", "??????", "?????????", "??????", "???5", "?????????", "?????????", "??????", "??????", "??????", "??????", "????????????", "??????", "250", "?????????", "??????", "?????????", "??????", "????????????", "?????????", "?????????", "????????????", "?????????", "?????????", "??????", "?????????", "?????????", "?????????", "???????????????????????????", "????????????", "????????????", "?????????", "???????????????", "???????????????", "?????????", "7.3", "??????", "??????", "ISIS", "????????????", "isil", "?????????", "?????????", "??????", "?????????", "??????", "?????????", "????????????", "????????????", "??????", "?????????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "?????????", "??????", "??????", "??????", "libao???gift", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "??????", "switch", "show", "hide", "pay", "money", "wechat", "weixin", "alipay", "platform", "sdk", "update", "order", "dingdan", "goumai", "web", "zf", "zfb", "jine", "buy", "detriment", "purchasing", "diamond", "ingot", "??????", "tanwan"];
        return arr;
    };
    LoginConst.LOGIN_C2S = 10001;
    LoginConst.LOGIN_S2C = 10002;
    return LoginConst;
}());
__reflect(LoginConst.prototype, "LoginConst");
/**
 * Created by Administrator on 2014/11/23.
 */
var LoginController = (function (_super) {
    __extends(LoginController, _super);
    function LoginController() {
        var _this = _super.call(this) || this;
        //?????????Model
        _this.loginModel = new LoginModel(_this);
        //?????????UI
        _this.loginView = new LoginView(_this, LayerManager.UI_Main);
        App.ViewManager.register(ViewConst.Login, _this.loginView);
        //?????????Proxy
        _this.loginProxy = new LoginProxy(_this);
        //??????????????????????????????????????????
        //??????C2S??????
        _this.registerFunc(LoginConst.LOGIN_C2S, _this.onLogin, _this);
        //??????S2C??????
        _this.registerFunc(LoginConst.LOGIN_S2C, _this.loginSuccess, _this);
        return _this;
    }
    /**
     * ??????????????????
     * @param userName
     * @param pwd
     */
    LoginController.prototype.onLogin = function (userName, pwd) {
        this.loginProxy.login(userName, pwd);
    };
    /**
     * ??????????????????
     */
    LoginController.prototype.loginSuccess = function (userInfo) {
        //????????????
        this.loginModel.userInfo = userInfo;
        //?????????UI??????
        this.loginView.loginSuccess();
        //UI??????
        App.ViewManager.close(ViewConst.Login);
        var model = this.getControllerModel(ControllerConst.Login);
    };
    return LoginController;
}(BaseController));
__reflect(LoginController.prototype, "LoginController");
/**
 * Created by yangsong on 15-11-20.
 */
var LoginModel = (function (_super) {
    __extends(LoginModel, _super);
    /**
     * ????????????
     * @param $controller ????????????
     */
    function LoginModel($controller) {
        return _super.call(this, $controller) || this;
    }
    return LoginModel;
}(BaseModel));
__reflect(LoginModel.prototype, "LoginModel");
/**
 * Created by Administrator on 2014/11/23.
 */
var LoginProxy = (function (_super) {
    __extends(LoginProxy, _super);
    function LoginProxy($controller) {
        var _this = _super.call(this, $controller) || this;
        //???????????????????????????????????????
        _this.receiveServerMsg(HttpConst.USER_LOGIN, _this.loginSuccess, _this);
        return _this;
    }
    /**
     * ????????????
     * @param userName
     * @param pwd
     */
    LoginProxy.prototype.login = function (userName, pwd) {
        var paramObj = {
            "uName": userName,
            "uPass": pwd
        };
        this.sendHttpMsg(HttpConst.USER_LOGIN, paramObj);
    };
    /**
     * ????????????????????????
     */
    LoginProxy.prototype.loginSuccess = function (obj) {
        this.applyFunc(LoginConst.LOGIN_S2C, obj);
    };
    return LoginProxy;
}(BaseProxy));
__reflect(LoginProxy.prototype, "LoginProxy");
/**
 * Created by Administrator on 2014/11/23.
 */
var LoginView = (function (_super) {
    __extends(LoginView, _super);
    function LoginView($controller, $parent) {
        var _this = _super.call(this, $controller, $parent) || this;
        _this.skinName = "resource/skins/login/login.exml";
        return _this;
    }
    /**
     *???????????????????????????????????????????????????
     *
     */
    LoginView.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        //this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onLogin, this);
        this.btnEnter.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onLoginBtnClick, this);
    };
    /**
     *????????????????????????????????????????????????
     *
     */
    LoginView.prototype.initData = function () {
        _super.prototype.initData.call(this);
    };
    /**
     * ?????????????????????????????????????????????
     * @param param ??????
     */
    LoginView.prototype.open = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        _super.prototype.open.call(this, param);
    };
    /**
     * ?????????????????????????????????????????????
     * @param param ??????
     */
    LoginView.prototype.close = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        _super.prototype.close.call(this, param);
    };
    /**
     * ??????????????????
     * @param userName
     * @param pwd
     */
    LoginView.prototype.onLoginBtnClick = function (e) {
        var nickName = this.platId.text;
        if (nickName == null || nickName.length == 0 || nickName == "?????????????????????" || nickName == "??????????????????6???????????????") {
            this.platId.text = "?????????????????????";
            return;
        }
        if (nickName.length > 6) {
            this.platId.text = "??????????????????6???????????????";
            return;
        }
        var k = this.texttest(nickName);
        if (k) {
            this.platId.text = "?????????????????????????????????????????????";
            return;
        }
        //????????????
        //this.applyFunc(LoginConst.LOGIN_C2S, userName); 
        //???????????????????????? ????????????
        App.MessageCenter.dispatch(EventNames.Role_Choose, this.platId.text);
        App.MessageCenter.dispatch(EventNames.Load_text);
        this.applyFunc(LoginConst.LOGIN_S2C);
    };
    /**
     * ??????????????????
     */
    LoginView.prototype.loginSuccess = function () {
        //TODO ??????????????????
        new EUITest();
    };
    LoginView.prototype.gettextjson = function () {
        var array = LoginConst.gettexts();
        return array;
    };
    LoginView.prototype.texttest = function (str) {
        var k = false;
        var ars = this.gettextjson();
        for (var i = 0; i < ars.length; i++) {
            //????????????
            var m = ars[i];
            var n = str.indexOf(m);
            if (n != -1) {
                k = true;
            }
        }
        return k;
    };
    return LoginView;
}(BaseEuiView));
__reflect(LoginView.prototype, "LoginView");
var RoleInfoConst = (function () {
    function RoleInfoConst() {
    }
    RoleInfoConst.rolename = "";
    return RoleInfoConst;
}());
__reflect(RoleInfoConst.prototype, "RoleInfoConst");
var RoleInfoManager = (function (_super) {
    __extends(RoleInfoManager, _super);
    function RoleInfoManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    //?????????????????? 
    RoleInfoManager.prototype.getRoleInfo = function (nickname) {
        // CMsgMgr.sendMsg( GMsgNo.M1029 );  
        //?????????????????????
        //     let commonHeader: simple.CommonProtocol = new simple.CommonProtocol();
        //     commonHeader.CommandId =  65792;
        //     commonHeader.SeqId = 1000;
        //     commonHeader.Version = 12;
        //     commonHeader.BodyData = nickname;
        //    //?????????
        //     var buffer = simple.CommonProtocol.encode(commonHeader).finish();
        //     //Log.debug("??????????????????", buffer);
        //     var buf = new egret.ByteArray(buffer);
        //     //??????ByteArray????????????????????????????????????????????????
        //     var mss = new egret.ByteArray();
        //     mss.writeBytes(buf);
        //     App.Socket.sendProtobuf(mss);
    };
    //??????????????????
    RoleInfoManager.prototype.updateRoleInfo = function (roleinfo) {
        // CMsgMgr.sendMsg( GMsgNo.M1029 );  
        //?????????????????????
        //     let commonHeader: simple.CommonProtocol = new simple.CommonProtocol();
        //     commonHeader.CommandId =  65793;
        //     commonHeader.SeqId = 1000;
        //     commonHeader.Version = 12;
        //     commonHeader.BodyData = JSON.stringify(roleinfo);
        //    //?????????
        //     var buffer = simple.CommonProtocol.encode(commonHeader).finish();
        //     //Log.debug("??????????????????", buffer);
        //     var buf = new egret.ByteArray(buffer);
        //     //??????ByteArray????????????????????????????????????????????????
        //     var mss = new egret.ByteArray();
        //     mss.writeBytes(buf);
        // App.Socket.sendProtobuf(mss);
    };
    //??????????????????
    RoleInfoManager.prototype.updatePet = function (roleinfo) {
        // CMsgMgr.sendMsg( GMsgNo.M1029 );  
        //?????????????????????
        //     let commonHeader: simple.CommonProtocol = new simple.CommonProtocol();
        //     commonHeader.CommandId =  65794;
        //     commonHeader.SeqId = 1000;
        //     commonHeader.Version = 12;
        //     commonHeader.BodyData = JSON.stringify(roleinfo);
        //    //?????????
        //     var buffer = simple.CommonProtocol.encode(commonHeader).finish();
        //     //Log.debug("??????????????????", buffer);
        //     var buf = new egret.ByteArray(buffer);
        //     //??????ByteArray????????????????????????????????????????????????
        //     var mss = new egret.ByteArray();
        //     mss.writeBytes(buf);
        // App.Socket.sendProtobuf(mss);
    };
    //??????????????????
    RoleInfoManager.prototype.addPet = function (roleinfo) {
        // CMsgMgr.sendMsg( GMsgNo.M1029 );  
        //?????????????????????
        //     let commonHeader: simple.CommonProtocol = new simple.CommonProtocol();
        //     commonHeader.CommandId =  65795;
        //     commonHeader.SeqId = 1000;
        //     commonHeader.Version = 12;
        //     commonHeader.BodyData = JSON.stringify(roleinfo);
        //    //?????????
        //     var buffer = simple.CommonProtocol.encode(commonHeader).finish();
        //     //Log.debug("??????????????????", buffer);
        //     var buf = new egret.ByteArray(buffer);
        //     //??????ByteArray????????????????????????????????????????????????
        //     var mss = new egret.ByteArray();
        //     mss.writeBytes(buf);
        // App.Socket.sendProtobuf(mss);
    };
    return RoleInfoManager;
}(SingtonClass));
__reflect(RoleInfoManager.prototype, "RoleInfoManager");
/**
 * Created by yangsong on 2017/10/11.
 */
var RpgGameConst = (function () {
    function RpgGameConst() {
    }
    RpgGameConst.GameInit = 10000;
    RpgGameConst.GameResize = 10001;
    return RpgGameConst;
}());
__reflect(RpgGameConst.prototype, "RpgGameConst");
/**
 * Created by yangsong on 2017/10/11.
 */
var RpgGameController = (function (_super) {
    __extends(RpgGameController, _super);
    function RpgGameController() {
        var _this = _super.call(this) || this;
        //View?????????
        _this.gameView = new RpgGameView(_this, LayerManager.Game_Main);
        App.ViewManager.register(ViewConst.RpgGame, _this.gameView);
        //Model?????????
        _this.gameModel = new RpgGameModel(_this);
        //??????????????????
        _this.registerFunc(RpgGameConst.GameInit, _this.gameInit, _this);
        _this.registerFunc(RpgGameConst.GameResize, _this.gameResize, _this);
        return _this;
    }
    RpgGameController.prototype.gameInit = function (mapId) {
        var user = UserModel.instance();
        this.gameModel.mapId = mapId;
        var pId = user.monsterModel.monsterId;
        this.gameModel.playerData = {
            id: pId,
            mcName: "monster_" + pId,
            propertyData: {
                name: user.username,
                hp: user.monsterModel.hp,
                maxBlood: user.monsterModel.hp,
                attackDis: user.monsterModel.skill1["skillspace"],
                attackInterval: 1000,
                angel: 0,
                enerty: 0,
                skillbooks: 3,
                ski1add: 0.01,
                ski2add: 0.01,
                buffname: "",
                buffstatus: 0,
                buffnumber: 0,
                exp: 0,
                level: 1,
                skill1: user.monsterModel.skill1,
                skill2: user.monsterModel.skill2,
                skill3: user.monsterModel.skill3,
                skillp: user.monsterModel.skillp,
                skillh: user.monsterModel.skillh //????????????
            }
        };
        this.gameModel.monsterNum = 5;
        App.ViewManager.open(ViewConst.RpgGame, this.gameModel);
    };
    RpgGameController.prototype.gameResize = function () {
        this.gameView.resize();
    };
    return RpgGameController;
}(BaseController));
__reflect(RpgGameController.prototype, "RpgGameController");
/**
 * Created by yangsong on 2017/10/11.
 */
var RpgGameData = (function () {
    function RpgGameData() {
    }
    RpgGameData.GameTileWidth = 256;
    RpgGameData.GameTileHeight = 256;
    RpgGameData.GameCellWidth = 32;
    RpgGameData.GameCellHeight = 16;
    RpgGameData.GameAoiWidth = 256;
    RpgGameData.GameAoiHeight = 256;
    RpgGameData.WalkSpeed = 4;
    return RpgGameData;
}());
__reflect(RpgGameData.prototype, "RpgGameData");
/**
 * Created by yangsong on 2017/10/11.
 */
var RpgGameModel = (function (_super) {
    __extends(RpgGameModel, _super);
    function RpgGameModel($controller) {
        return _super.call(this, $controller) || this;
    }
    return RpgGameModel;
}(BaseModel));
__reflect(RpgGameModel.prototype, "RpgGameModel");
/**
 * Created by yangsong on 2017/10/18.
 */
var RpgGameRes = (function () {
    function RpgGameRes() {
    }
    RpgGameRes.clearAvatar = function (avatarResName) {
        var groupName = "avatarGroup_" + avatarResName;
        if (this.LoadingResList[groupName]) {
            this.LoadingResList[groupName] = null;
            delete this.LoadingResList[groupName];
        }
        if (this.ComplateResList[groupName]) {
            this.ComplateResList[groupName] = null;
            delete this.ComplateResList[groupName];
        }
        RES.destroyRes(groupName);
    };
    RpgGameRes.loadAvatar = function (avatarResPath, avatarResName, onLoadComplate, onLoadComplateTarget) {
        var groupName = "avatarGroup_" + avatarResName;
        if (this.ComplateResList[groupName]) {
            onLoadComplate.call(onLoadComplateTarget);
        }
        else if (this.LoadingResList[groupName]) {
            this.LoadingResList[groupName].push([onLoadComplate, onLoadComplateTarget]);
        }
        else {
            this.LoadingResList[groupName] = [];
            this.LoadingResList[groupName].push([onLoadComplate, onLoadComplateTarget]);
            var avatarResKeys = [];
            [
                {
                    name: avatarResName + ".json",
                    type: "json"
                },
                {
                    name: avatarResName + ".png",
                    type: "image"
                }
            ].forEach(function (res) {
                var resKey = "avatar_" + res.name;
                avatarResKeys.push(resKey);
                App.ResourceUtils.createResource(resKey, res.type, avatarResPath + res.name);
            });
            App.ResourceUtils.createGroup(groupName, avatarResKeys);
            App.ResourceUtils.loadGroup(groupName, this.onLoadGroupComplate, this.onLoadGroupProgress, this);
        }
    };
    RpgGameRes.onLoadGroupComplate = function (groupName) {
        var callBacks = this.LoadingResList[groupName];
        callBacks.forEach(function (arr) {
            arr[0].call(arr[1]);
        });
        this.LoadingResList[groupName] = null;
        delete this.LoadingResList[groupName];
        this.ComplateResList[groupName] = 1;
    };
    RpgGameRes.onLoadGroupProgress = function (groupName) {
    };
    RpgGameRes.ComplateResList = {};
    RpgGameRes.LoadingResList = {};
    return RpgGameRes;
}());
__reflect(RpgGameRes.prototype, "RpgGameRes");
var RpgGameSkill;
(function (RpgGameSkill) {
    RpgGameSkill[RpgGameSkill["sk30000"] = 0] = "sk30000";
    RpgGameSkill[RpgGameSkill["sk30006"] = 30006] = "sk30006";
    RpgGameSkill[RpgGameSkill["sk30007"] = 30007] = "sk30007";
    RpgGameSkill[RpgGameSkill["sk30008"] = 30008] = "sk30008";
    RpgGameSkill[RpgGameSkill["sk30009"] = 30009] = "sk30009";
    RpgGameSkill[RpgGameSkill["sk30010"] = 30010] = "sk30010";
    RpgGameSkill[RpgGameSkill["sk30011"] = 30011] = "sk30011";
    RpgGameSkill[RpgGameSkill["sk30012"] = 30012] = "sk30012";
    RpgGameSkill[RpgGameSkill["sk30013"] = 30013] = "sk30013";
    RpgGameSkill[RpgGameSkill["sk30014"] = 30014] = "sk30014";
    RpgGameSkill[RpgGameSkill["sk30015"] = 30015] = "sk30015";
    RpgGameSkill[RpgGameSkill["sk30016"] = 30016] = "sk30016";
    RpgGameSkill[RpgGameSkill["sk30017"] = 30017] = "sk30017";
    RpgGameSkill[RpgGameSkill["sk30018"] = 30018] = "sk30018"; //??????
})(RpgGameSkill || (RpgGameSkill = {}));
var RpgRandomSkill;
(function (RpgRandomSkill) {
    RpgRandomSkill[RpgRandomSkill["sk31001"] = 31001] = "sk31001";
    RpgRandomSkill[RpgRandomSkill["sk31002"] = 31002] = "sk31002";
    RpgRandomSkill[RpgRandomSkill["sk31003"] = 31003] = "sk31003";
    RpgRandomSkill[RpgRandomSkill["sk32001"] = 32001] = "sk32001";
    RpgRandomSkill[RpgRandomSkill["sk32002"] = 32002] = "sk32002";
    RpgRandomSkill[RpgRandomSkill["sk32003"] = 32003] = "sk32003"; // ????????????????????????????????????????????????								
})(RpgRandomSkill || (RpgRandomSkill = {}));
var RpgGameSkills = (function (_super) {
    __extends(RpgGameSkills, _super);
    function RpgGameSkills() {
        var _this = _super.call(this) || this;
        _this.hitTime = 0;
        _this.startTime = 0;
        _this.triggerTime = 0;
        _this.skillPath = "https://yqllm.wangqucc.com/gameres/dld/resource/assets/rpgGame/skill/";
        return _this;
    }
    RpgGameSkills.prototype.loadRandomSkill = function (mapId, gameView) {
        this.gameView = gameView;
        if (!this.gameView)
            return;
        this.rangeImgs = [];
        var avatarComponent = this.gameView.player.getComponent(ComponentType.Avatar);
        this.parent = avatarComponent.body.parent;
        if (mapId == 1191) {
            this.randomSkill = RpgRandomSkill.sk32001;
        }
        else if (mapId == 1192) {
            this.randomSkill = RpgRandomSkill.sk32002;
        }
        else {
            this.randomSkill = RpgRandomSkill.sk32003;
        }
        this.mcName = this.randomSkill.toString();
        this.starTimer();
    };
    RpgGameSkills.prototype.starTimer = function () {
        this.timer = new egret.Timer(1000);
        this.timer.addEventListener(egret.TimerEvent.TIMER, this.updateTimer, this);
        this.timer.start();
        this.triggerTime = App.RandomUtils.limitInteger(15, 20) * 1000;
    };
    RpgGameSkills.prototype.updateTimer = function () {
        this.startTime += 1000;
        if (this.startTime == this.triggerTime) {
            var randCount = App.RandomUtils.limitInteger(6, 10);
            for (var i = 0; i < randCount; i++) {
                RpgGameRes.loadAvatar(this.skillPath, this.mcName, this.onLoadComplate, this);
            }
            this.triggerTime += (App.RandomUtils.limitInteger(15, 20) + 8) * 1000;
        }
    };
    RpgGameSkills.prototype.stopTimer = function () {
        if (this.timer) {
            this.timer.stop();
            this.timer = null;
        }
    };
    RpgGameSkills.prototype.onLoadComplate = function () {
        var col = App.RandomUtils.limitInteger(3, 10);
        var row = App.RandomUtils.limitInteger(3, 6);
        var x = col * RpgGameData.GameTileWidth;
        var y = row * RpgGameData.GameTileHeight;
        var rangeImg = App.DisplayUtils.createBitmap("circle_yellow_png");
        rangeImg.x = x;
        rangeImg.y = y;
        rangeImg.alpha = 0;
        this.parent.addChild(rangeImg);
        egret.Tween.get(rangeImg).to({ alpha: 1 }, 2000);
        this.rangeImgs.push(rangeImg);
        var mc = new egret.MovieClip();
        mc.x = x;
        mc.y = y;
        this.adjustPonit(mc);
        egret.setTimeout(function () {
            this.isAppear = true;
            this.parent.removeChild(rangeImg);
            this.parent.addChild(mc);
            egret.setTimeout(function () {
                this.parent.removeChild(mc);
                this.isAppear = false;
                this.rangeImgs = [];
            }, this, 5000);
        }, this, 3000);
        var avatarResName = this.mcName;
        var data = RES.getRes("avatar_" + avatarResName + ".json");
        var texture = RES.getRes("avatar_" + avatarResName + ".png");
        var mcFactory = new egret.MovieClipDataFactory(data, texture);
        mc.movieClipData = mcFactory.generateMovieClipData(avatarResName);
        mc.gotoAndPlay("skill", -1);
    };
    RpgGameSkills.prototype.adjustPonit = function (mc) {
        if (this.randomSkill == RpgRandomSkill.sk32001) {
            App.AnchorUtils.setAnchorX(mc, 0.2);
            App.AnchorUtils.setAnchorY(mc, 0.5);
        }
        else if (this.randomSkill == RpgRandomSkill.sk32002) {
            App.AnchorUtils.setAnchorX(mc, 0.1);
            App.AnchorUtils.setAnchorY(mc, 0.2);
        }
        else if (this.randomSkill == RpgRandomSkill.sk32003) {
            App.AnchorUtils.setAnchorX(mc, 0.2);
            App.AnchorUtils.setAnchorY(mc, 1);
        }
    };
    //??????????????????
    RpgGameSkills.prototype.startHitTest = function (monster) {
        var avatarComponent = monster.getComponent(ComponentType.Avatar);
        if (!this.rangeImgs || !avatarComponent)
            return;
        if (!this.isAppear)
            return;
        if (this.hitTime == 0) {
            this.hitTime = egret.getTimer();
        }
        else {
            var nowTime = egret.getTimer();
            var tmpTime = nowTime - this.hitTime;
            if (tmpTime < 2000)
                return;
        }
        var hitBody = new egret.Bitmap();
        hitBody.x = avatarComponent.body.x - 30;
        hitBody.y = avatarComponent.body.y - 70;
        hitBody.width = avatarComponent.mc.width / 2;
        hitBody.height = avatarComponent.mc.height / 4;
        this.parent.addChild(hitBody);
        //Log.debug("body width:" + hitBody.width + " height:" + hitBody.height);
        for (var i = 0; i < this.rangeImgs.length; i++) {
            var rangeImg = this.rangeImgs[i];
            var isHit = RpgGameUtils.hitTest(rangeImg, hitBody);
            // Log.debug("rangeImg x:" + rangeImg.x + " y:" + rangeImg.y);
            if (isHit) {
                this.hitTime = egret.getTimer();
                if (this.randomSkill == RpgRandomSkill.sk32001) {
                    Log.debug("HitTest sk32001");
                    var harm = monster.propertyData.maxBlood * 0.2;
                    monster.propertyData.hp -= harm;
                    this.gameView.showHpChange(monster, -harm);
                }
                else if (this.randomSkill == RpgRandomSkill.sk32002) {
                    Log.debug("HitTest sk32002");
                    monster.speed -= monster.speed * 0.2;
                    if (monster.propertyData.buffnumber != RpgBoxBuff.buff4 || monster.propertyData.buffnumber != RpgBoxBuff.buff7) {
                        monster.propertyData.buffnumber = RpgBoxBuff.buff7;
                        egret.setTimeout(function () {
                            monster.propertyData.buffnumber = RpgBoxBuff.buff0;
                        }, this, 10000);
                    }
                }
                else {
                    Log.debug("HitTest sk32003");
                    var harm = monster.propertyData.maxBlood * 0.1;
                    monster.propertyData.hp -= harm;
                    this.gameView.showHpChange(monster, -harm);
                }
            }
        }
        this.parent.removeChild(hitBody);
    };
    return RpgGameSkills;
}(SingtonClass));
__reflect(RpgGameSkills.prototype, "RpgGameSkills");
/**
 * Created by yangsong on 2017/10/12.
 */
var RpgGameUtils = (function () {
    function RpgGameUtils() {
    }
    RpgGameUtils.convertCellToXY = function (col, row) {
        this._convertUsePoint.x = col * RpgGameData.GameCellWidth + RpgGameData.GameCellWidth * 0.5;
        this._convertUsePoint.y = row * RpgGameData.GameCellHeight + RpgGameData.GameCellHeight * 0.5;
        return this._convertUsePoint;
    };
    RpgGameUtils.convertXYToCell = function (x, y) {
        this._convertUsePoint.x = Math.floor(x / RpgGameData.GameCellWidth);
        this._convertUsePoint.y = Math.floor(y / RpgGameData.GameCellHeight);
        return this._convertUsePoint;
    };
    RpgGameUtils.convertXYToAoi = function (x, y) {
        this._convertUsePoint.x = Math.floor(x / RpgGameData.GameAoiWidth);
        this._convertUsePoint.y = Math.floor(y / RpgGameData.GameAoiHeight);
        return this._convertUsePoint;
    };
    RpgGameUtils.computeGameObjDir = function (currX, currY, gotoX, gotoY) {
        if (Math.abs(gotoX - currX) < 0.1) {
            gotoX = currX;
        }
        if (Math.abs(gotoY - currY) < 0.1) {
            gotoY = currY;
        }
        var radian = App.MathUtils.getRadian2(currX, currY, gotoX, gotoY);
        var angle = App.MathUtils.getAngle(radian);
        var dir;
        if (angle == 0) {
            dir = Dir.Right;
        }
        else if (angle == 90) {
            dir = Dir.Bottom;
        }
        else if (angle == 180) {
            dir = Dir.Left;
        }
        else if (angle == -90) {
            dir = Dir.Top;
        }
        else if (angle > 0 && angle < 90) {
            dir = Dir.BottomRight;
        }
        else if (angle > 90 && angle < 180) {
            dir = Dir.BottomLeft;
        }
        else if (angle > -180 && angle < -90) {
            dir = Dir.TopLeft;
        }
        else if (angle > -90 && angle < 0) {
            dir = Dir.TopRight;
        }
        return dir;
    };
    //90??????
    RpgGameUtils.isSameAngle = function (currX, currY, gotoX, gotoY, pDir) {
        if (Math.abs(gotoX - currX) < 0.1) {
            gotoX = currX;
        }
        if (Math.abs(gotoY - currY) < 0.1) {
            gotoY = currY;
        }
        var radian = App.MathUtils.getRadian2(currX, currY, gotoX, gotoY);
        var angle = App.MathUtils.getAngle(radian);
        Log.debug("isSameAngle ????????????: " + angle);
        if (angle <= -45 && angle >= -135) {
            if (pDir == Dir.Top || pDir == Dir.TopLeft || pDir == Dir.TopRight) {
                return true;
            }
        }
        else if (angle >= -45 && angle <= 45) {
            if (pDir == Dir.TopRight || pDir == Dir.Right || pDir == Dir.BottomRight) {
                return true;
            }
        }
        else if (angle >= 45 && angle <= 135) {
            if (pDir == Dir.BottomRight || pDir == Dir.Bottom || pDir == Dir.BottomLeft) {
                return true;
            }
        }
        else if (angle >= 135 || angle <= -135) {
            if (pDir == Dir.BottomLeft || pDir == Dir.Left || pDir == Dir.TopLeft) {
                return true;
            }
        }
        return false;
    };
    //45??????
    RpgGameUtils.computeSkillDir = function (currX, currY, gotoX, gotoY) {
        if (Math.abs(gotoX - currX) < 0.1) {
            gotoX = currX;
        }
        if (Math.abs(gotoY - currY) < 0.1) {
            gotoY = currY;
        }
        var radian = App.MathUtils.getRadian2(currX, currY, gotoX, gotoY);
        var angle = App.MathUtils.getAngle(radian);
        Log.debug("??????: " + angle);
        var dir;
        if (angle > -22.5 && angle < 22.5) {
            dir = Dir.Right;
        }
        else if (angle > 67.5 && angle < 112.5) {
            dir = Dir.Bottom;
        }
        else if (angle > 157.5 || angle < -157.5) {
            dir = Dir.Left;
        }
        else if (angle > -112.5 && angle < -67.5) {
            dir = Dir.Top;
        }
        else if (angle > 22.5 && angle < 67.5) {
            dir = Dir.BottomRight;
        }
        else if (angle > 112.5 && angle < 157.5) {
            dir = Dir.BottomLeft;
        }
        else if (angle > -157.5 && angle < -112.5) {
            dir = Dir.TopLeft;
        }
        else if (angle > -67.5 && angle < -22.5) {
            dir = Dir.TopRight;
        }
        return dir;
    };
    /**????????????*  ?????????????????????*/
    RpgGameUtils.hitTest = function (obj1, obj2) {
        var rect1 = obj1.getBounds();
        var rect2 = obj2.getBounds();
        rect1.x = obj1.x;
        rect1.y = obj1.y;
        rect2.x = obj2.x;
        rect2.y = obj2.y;
        return rect1.intersects(rect2);
    };
    RpgGameUtils._convertUsePoint = new egret.Point();
    return RpgGameUtils;
}());
__reflect(RpgGameUtils.prototype, "RpgGameUtils");
var SilzAstar = (function () {
    /**
     * @param    mapdata        ????????????
     */
    function SilzAstar(mapdata) {
        /**
         * ???????????????8?????????4?????????????????????8???4
         */
        this.WorkMode = 8;
        this.makeGrid(mapdata);
    }
    /**
     * @param        xnow    ????????????X(????????????)
     * @param        ynow    ????????????Y(????????????)
     * @param        xpos    ?????????X(????????????)
     * @param        ypos    ?????????Y(????????????)
     */
    SilzAstar.prototype.find = function (xnow, ynow, xpos, ypos) {
        xpos = Math.floor(xnow / RpgGameData.GameCellWidth) + xpos;
        ypos = Math.floor(ynow / RpgGameData.GameCellHeight) + ypos;
        xpos = Math.min(xpos, this._grid.numCols - 1);
        ypos = Math.min(ypos, this._grid.numRows - 1);
        this._grid.setEndNode(xpos, ypos);
        xnow = Math.floor(xnow / RpgGameData.GameCellWidth);
        ynow = Math.floor(ynow / RpgGameData.GameCellHeight);
        this._grid.setStartNode(xnow, ynow); //2
        var time = egret.getTimer();
        if (this._astar.findPath()) {
            this._path = this._astar.path;
            return this._path;
        }
        else {
            this._grid.setEndNode(xpos - 1, ypos - 1);
            time = egret.getTimer() - time;
            Log.debug("[SilzAstar]", time + "ms ?????????");
        }
        return null;
    };
    SilzAstar.prototype.makeGrid = function (data) {
        var rows = data.length;
        var cols = data[0].length;
        this._grid = new Grid(cols, rows);
        var px;
        var py;
        for (py = 0; py < rows; py++) {
            for (px = 0; px < cols; px++) {
                this._grid.setWalkable(px, py, data[py][px] == 1);
            }
        }
        if (this.WorkMode == 4)
            this._grid.calculateLinks(1);
        else
            this._grid.calculateLinks();
        this._astar = new AStar(this._grid);
    };
    return SilzAstar;
}());
__reflect(SilzAstar.prototype, "SilzAstar");
var AStar = (function () {
    function AStar(grid) {
        this._straightCost = 1.0;
        this._diagCost = Math.SQRT2;
        this._nowversion = 1;
        this.TwoOneTwoZero = 2 * Math.cos(Math.PI / 3);
        this._grid = grid;
        this._heuristic = this.manhattan;
    }
    AStar.prototype.justMin = function (x, y) {
        return x.f < y.f;
    };
    AStar.prototype.findPath = function () {
        this._endNode = this._grid.endNode;
        this._nowversion++;
        this._startNode = this._grid.startNode;
        this._open = new BinaryHeap(this.justMin);
        this._startNode.g = 0;
        return this.search();
    };
    AStar.prototype.floyd = function () {
        if (this.path == null)
            return;
        this._floydPath = this.path.concat();
        var len = this._floydPath.length;
        if (len > 2) {
            var vector = new PathNode(0, 0);
            var tempVector = new PathNode(0, 0);
            this.floydVector(vector, this._floydPath[len - 1], this._floydPath[len - 2]);
            for (var i = this._floydPath.length - 3; i >= 0; i--) {
                this.floydVector(tempVector, this._floydPath[i + 1], this._floydPath[i]);
                if (vector.x == tempVector.x && vector.y == tempVector.y) {
                    this._floydPath.splice(i + 1, 1);
                }
                else {
                    vector.x = tempVector.x;
                    vector.y = tempVector.y;
                }
            }
        }
        len = this._floydPath.length;
        for (i = len - 1; i >= 0; i--) {
            for (var j = 0; j <= i - 2; j++) {
                if (this.floydCrossAble(this._floydPath[i], this._floydPath[j])) {
                    for (var k = i - 1; k > j; k--) {
                        this._floydPath.splice(k, 1);
                    }
                    i = j;
                    len = this._floydPath.length;
                    break;
                }
            }
        }
    };
    AStar.prototype.floydCrossAble = function (n1, n2) {
        var ps = this.bresenhamNodes(new egret.Point(n1.x, n1.y), new egret.Point(n2.x, n2.y));
        for (var i = ps.length - 2; i > 0; i--) {
            if (!this._grid.getNode(ps[i].x, ps[i].y).walkable) {
                return false;
            }
        }
        return true;
    };
    AStar.prototype.bresenhamNodes = function (p1, p2) {
        var steep = Math.abs(p2.y - p1.y) > Math.abs(p2.x - p1.x);
        if (steep) {
            var temp = p1.x;
            p1.x = p1.y;
            p1.y = temp;
            temp = p2.x;
            p2.x = p2.y;
            p2.y = temp;
        }
        var stepX = p2.x > p1.x ? 1 : (p2.x < p1.x ? -1 : 0);
        var stepY = p2.y > p1.y ? 1 : (p2.y < p1.y ? -1 : 0);
        var deltay = (p2.y - p1.y) / Math.abs(p2.x - p1.x);
        var ret = [];
        var nowX = p1.x + stepX;
        var nowY = p1.y + deltay;
        if (steep) {
            ret.push(new egret.Point(p1.y, p1.x));
        }
        else {
            ret.push(new egret.Point(p1.x, p1.y));
        }
        while (nowX != p2.x) {
            var fy = Math.floor(nowY);
            var cy = Math.ceil(nowY);
            if (steep) {
                ret.push(new egret.Point(fy, nowX));
            }
            else {
                ret.push(new egret.Point(nowX, fy));
            }
            if (fy != cy) {
                if (steep) {
                    ret.push(new egret.Point(cy, nowX));
                }
                else {
                    ret.push(new egret.Point(nowX, cy));
                }
            }
            nowX += stepX;
            nowY += deltay;
        }
        if (steep) {
            ret.push(new egret.Point(p2.y, p2.x));
        }
        else {
            ret.push(new egret.Point(p2.x, p2.y));
        }
        return ret;
    };
    AStar.prototype.floydVector = function (target, n1, n2) {
        target.x = n1.x - n2.x;
        target.y = n1.y - n2.y;
    };
    AStar.prototype.search = function () {
        var node = this._startNode;
        node.version = this._nowversion;
        while (node != this._endNode) {
            var len = node.links.length;
            for (var i = 0; i < len; i++) {
                var test = node.links[i].node;
                if (!test.walkable) {
                    continue;
                }
                var cost = node.links[i].cost;
                var g = node.g + cost;
                var h = this._heuristic(test);
                var f = g + h;
                if (test.version == this._nowversion) {
                    if (test.f > f) {
                        test.f = f;
                        test.g = g;
                        test.h = h;
                        test.parent = node;
                    }
                }
                else {
                    test.f = f;
                    test.g = g;
                    test.h = h;
                    test.parent = node;
                    this._open.ins(test);
                    test.version = this._nowversion;
                }
            }
            if (this._open.a.length == 1) {
                return false;
            }
            node = this._open.pop();
        }
        this.buildPath();
        return true;
    };
    AStar.prototype.buildPath = function () {
        this._path = [];
        var node = this._endNode;
        this._path.push(node);
        while (node != this._startNode) {
            node = node.parent;
            this._path.unshift(node);
        }
    };
    Object.defineProperty(AStar.prototype, "path", {
        get: function () {
            return this._path;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AStar.prototype, "floydPath", {
        get: function () {
            return this._floydPath;
        },
        enumerable: true,
        configurable: true
    });
    AStar.prototype.manhattan = function (node) {
        return Math.abs(node.x - this._endNode.x) + Math.abs(node.y - this._endNode.y);
    };
    AStar.prototype.manhattan2 = function (node) {
        var dx = Math.abs(node.x - this._endNode.x);
        var dy = Math.abs(node.y - this._endNode.y);
        return dx + dy + Math.abs(dx - dy) / 1000;
    };
    AStar.prototype.euclidian = function (node) {
        var dx = node.x - this._endNode.x;
        var dy = node.y - this._endNode.y;
        return Math.sqrt(dx * dx + dy * dy);
    };
    AStar.prototype.chineseCheckersEuclidian2 = function (node) {
        var y = node.y / this.TwoOneTwoZero;
        var x = node.x + node.y / 2;
        var dx = x - this._endNode.x - this._endNode.y / 2;
        var dy = y - this._endNode.y / this.TwoOneTwoZero;
        return this.sqrt(dx * dx + dy * dy);
    };
    AStar.prototype.sqrt = function (x) {
        return Math.sqrt(x);
    };
    AStar.prototype.euclidian2 = function (node) {
        var dx = node.x - this._endNode.x;
        var dy = node.y - this._endNode.y;
        return dx * dx + dy * dy;
    };
    AStar.prototype.diagonal = function (node) {
        var dx = Math.abs(node.x - this._endNode.x);
        var dy = Math.abs(node.y - this._endNode.y);
        var diag = Math.min(dx, dy);
        var straight = dx + dy;
        return this._diagCost * diag + this._straightCost * (straight - 2 * diag);
    };
    return AStar;
}());
__reflect(AStar.prototype, "AStar");
var BinaryHeap = (function () {
    function BinaryHeap(justMinFun) {
        if (justMinFun === void 0) { justMinFun = null; }
        this.a = [];
        this.justMinFun = function (x, y) {
            return x < y;
        };
        this.a.push(-1);
        if (justMinFun != null) {
            this.justMinFun = justMinFun;
        }
    }
    BinaryHeap.prototype.ins = function (value) {
        var p = this.a.length;
        this.a[p] = value;
        var pp = p >> 1;
        while (p > 1 && this.justMinFun(this.a[p], this.a[pp])) {
            var temp = this.a[p];
            this.a[p] = this.a[pp];
            this.a[pp] = temp;
            p = pp;
            pp = p >> 1;
        }
    };
    BinaryHeap.prototype.pop = function () {
        var min = this.a[1];
        this.a[1] = this.a[this.a.length - 1];
        this.a.pop();
        var p = 1;
        var l = this.a.length;
        var sp1 = p << 1;
        var sp2 = sp1 + 1;
        while (sp1 < l) {
            if (sp2 < l) {
                var minp = this.justMinFun(this.a[sp2], this.a[sp1]) ? sp2 : sp1;
            }
            else {
                minp = sp1;
            }
            if (this.justMinFun(this.a[minp], this.a[p])) {
                var temp = this.a[p];
                this.a[p] = this.a[minp];
                this.a[minp] = temp;
                p = minp;
                sp1 = p << 1;
                sp2 = sp1 + 1;
            }
            else {
                break;
            }
        }
        return min;
    };
    return BinaryHeap;
}());
__reflect(BinaryHeap.prototype, "BinaryHeap");
var Grid = (function () {
    function Grid(numCols, numRows) {
        this._straightCost = 1.0;
        this._diagCost = Math.SQRT2;
        this._numCols = numCols;
        this._numRows = numRows;
        this._nodes = [];
        for (var i = 0; i < this._numCols; i++) {
            this._nodes[i] = [];
            for (var j = 0; j < this._numRows; j++) {
                this._nodes[i][j] = new PathNode(i, j);
            }
        }
    }
    /**
     *
     * @param   type    0????????? 1????????? 2??????
     */
    Grid.prototype.calculateLinks = function (type) {
        if (type === void 0) { type = 0; }
        this.type = type;
        for (var i = 0; i < this._numCols; i++) {
            for (var j = 0; j < this._numRows; j++) {
                this.initNodeLink(this._nodes[i][j], type);
            }
        }
    };
    Grid.prototype.getType = function () {
        return this.type;
    };
    /**
     *
     * @param   node
     * @param   type    0????????? 1????????? 2??????
     */
    Grid.prototype.initNodeLink = function (node, type) {
        var startX = Math.max(0, node.x - 1);
        var endX = Math.min(this.numCols - 1, node.x + 1);
        var startY = Math.max(0, node.y - 1);
        var endY = Math.min(this.numRows - 1, node.y + 1);
        node.links = [];
        for (var i = startX; i <= endX; i++) {
            for (var j = startY; j <= endY; j++) {
                var test = this.getNode(i, j);
                if (test == node || !test.walkable) {
                    continue;
                }
                if (type != 2 && i != node.x && j != node.y) {
                    var test2 = this.getNode(node.x, j);
                    if (!test2.walkable) {
                        continue;
                    }
                    test2 = this.getNode(i, node.y);
                    if (!test2.walkable) {
                        continue;
                    }
                }
                var cost = this._straightCost;
                if (!((node.x == test.x) || (node.y == test.y))) {
                    if (type == 1) {
                        continue;
                    }
                    if (type == 2 && (node.x - test.x) * (node.y - test.y) == 1) {
                        continue;
                    }
                    if (type == 2) {
                        cost = this._straightCost;
                    }
                    else {
                        cost = this._diagCost;
                    }
                }
                node.links.push(new Link(test, cost));
            }
        }
    };
    Grid.prototype.getNode = function (x, y) {
        return this._nodes[x][y];
    };
    Grid.prototype.setEndNode = function (x, y) {
        this._endNode = this._nodes[x][y];
    };
    Grid.prototype.setStartNode = function (x, y) {
        this._startNode = this._nodes[x][y];
    };
    Grid.prototype.setWalkable = function (x, y, value) {
        this._nodes[x][y].walkable = value;
    };
    Object.defineProperty(Grid.prototype, "endNode", {
        get: function () {
            return this._endNode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Grid.prototype, "numCols", {
        get: function () {
            return this._numCols;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Grid.prototype, "numRows", {
        get: function () {
            return this._numRows;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Grid.prototype, "startNode", {
        get: function () {
            return this._startNode;
        },
        enumerable: true,
        configurable: true
    });
    return Grid;
}());
__reflect(Grid.prototype, "Grid");
var Link = (function () {
    function Link(node, cost) {
        this.node = node;
        this.cost = cost;
    }
    return Link;
}());
__reflect(Link.prototype, "Link");
var PathNode = (function () {
    //public index:number;
    function PathNode(x, y) {
        this.walkable = true;
        //public costMultiplier:number = 1.0;
        this.version = 1;
        this.x = x;
        this.y = y;
    }
    PathNode.prototype.toString = function () {
        return "x:" + this.x + " y:" + this.y;
    };
    return PathNode;
}());
__reflect(PathNode.prototype, "PathNode");
/**
 * Created by yangsong on 2017/10/13.
 */
var AiComponent = (function (_super) {
    __extends(AiComponent, _super);
    function AiComponent() {
        return _super.call(this) || this;
    }
    AiComponent.prototype.start = function () {
        _super.prototype.start.call(this);
        this.resetDealInterval();
    };
    AiComponent.prototype.stop = function () {
        _super.prototype.stop.call(this);
    };
    AiComponent.prototype.update = function (advancedTime) {
        _super.prototype.update.call(this, advancedTime);
        if (this.entity.battleObj) {
            return;
        }
        // this.doMove();
        this.resetDealInterval();
    };
    AiComponent.prototype.resetDealInterval = function () {
        this.dealInterval = App.RandomUtils.limitInteger(5 * 1000, 50 * 1000);
    };
    AiComponent.prototype.doMove = function () {
        var currCol = this.entity.col;
        var currRow = this.entity.row;
        var gotoDir = App.RandomUtils.limitInteger(0, 7); //??????
        var gotoDis = App.RandomUtils.limitInteger(20, 30); //??????
        var dirCol = 0;
        var dirRow = 0;
        if (gotoDir == Dir.Top) {
            dirRow = -1;
        }
        else if (gotoDir == Dir.TopRight) {
            dirCol = 1;
            dirRow = -1;
        }
        else if (gotoDir == Dir.Right) {
            dirCol = 1;
        }
        else if (gotoDir == Dir.BottomRight) {
            dirCol = 1;
            dirRow = 1;
        }
        else if (gotoDir == Dir.Bottom) {
            dirRow = 1;
        }
        else if (gotoDir == Dir.BottomLeft) {
            dirCol = -1;
            dirRow = 1;
        }
        else if (gotoDir == Dir.Left) {
            dirCol = -1;
        }
        else if (gotoDir == Dir.TopLeft) {
            dirCol = -1;
            dirRow = -1;
        }
        var mapBlocks = this.entity.gameView.getBlocksData();
        var paths = [];
        for (var i = 1; i <= gotoDis; i++) {
            var tmpCol = currCol + dirCol * i;
            var tmpRow = currRow + dirRow * i;
            if (!mapBlocks[tmpRow]) {
                break;
            }
            if (!mapBlocks[tmpRow][tmpCol]) {
                break;
            }
            paths.push(new PathNode(tmpCol, tmpRow));
        }
        if (paths.length > 1) {
            this.entity.path = paths;
        }
        else {
            this.entity.path = null;
        }
    };
    return AiComponent;
}(Component));
__reflect(AiComponent.prototype, "AiComponent");
/**
 * Created by yangsong on 2017/10/13.
 */
var AoiComponent = (function (_super) {
    __extends(AoiComponent, _super);
    function AoiComponent() {
        return _super.call(this) || this;
    }
    AoiComponent.prototype.start = function () {
        _super.prototype.start.call(this);
        this.dealInterval = 1000;
        this.dealTime = this.dealInterval;
    };
    AoiComponent.prototype.stop = function () {
        _super.prototype.stop.call(this);
    };
    AoiComponent.prototype.update = function (advancedTime) {
        _super.prototype.update.call(this, advancedTime);
        this.setEntityAoi();
    };
    AoiComponent.prototype.setEntityAoi = function () {
        var gameObjectLayer = this.entity.gameView.getGameObjcetLayer();
        var minX = -gameObjectLayer.x;
        var minY = -gameObjectLayer.y;
        var maxX = minX + App.StageUtils.getWidth();
        var maxY = minY + App.StageUtils.getHeight();
        var minAoiPoint = RpgGameUtils.convertXYToAoi(minX, minY).clone();
        var maxAoiPoint = RpgGameUtils.convertXYToAoi(maxX, maxY).clone();
        var entityAoiPoint = RpgGameUtils.convertXYToAoi(this.entity.x, this.entity.y);
        var inCamera = (entityAoiPoint.x >= minAoiPoint.x && entityAoiPoint.x <= maxAoiPoint.x)
            && (entityAoiPoint.y >= minAoiPoint.y && entityAoiPoint.y <= maxAoiPoint.y);
        if (inCamera) {
            if (!this.entity.getInCamera()) {
                this.entity.setInCamera(true);
            }
        }
        else {
            if (this.entity.getInCamera()) {
                this.entity.setInCamera(false);
            }
        }
    };
    return AoiComponent;
}(Component));
__reflect(AoiComponent.prototype, "AoiComponent");
/**
 * Created by yangsong on 2017/10/13.
 */
var AutoBattleComponent = (function (_super) {
    __extends(AutoBattleComponent, _super);
    function AutoBattleComponent() {
        return _super.call(this) || this;
    }
    AutoBattleComponent.prototype.start = function () {
        _super.prototype.start.call(this);
        this.dealInterval = 500;
        this.astar = new SilzAstar(this.entity.gameView.getBlocksData());
    };
    AutoBattleComponent.prototype.stop = function () {
        _super.prototype.stop.call(this);
        this.astar = null;
    };
    AutoBattleComponent.prototype.update = function (advancedTime) {
        _super.prototype.update.call(this, advancedTime);
        if (this.entity.battleObj) {
            if (this.entity.propertyData.hp > 1000) {
                if (!this.canAttack()) {
                    // this.moveTo(this.entity.battleObj.col,this.entity.battleObj.row);
                    this.bestToMoveTagert();
                }
            }
            else {
                this.entity.battleObj = null;
                this.doMove();
            }
        }
        else {
            if (this.entity.propertyData.hp > 1000) {
                this.searchBattleObj();
            }
            if (!this.entity.battleObj)
                this.doMove();
        }
    };
    //????????????????????????????????????????????????
    AutoBattleComponent.prototype.bestToMoveTagert = function () {
        var battleObj = this.entity.battleObj;
        var gotoCol = battleObj.col;
        var gotoRow = battleObj.row;
        var currCol = this.entity.col;
        var currRow = this.entity.row;
        var dir = RpgGameUtils.computeGameObjDir(currCol, currRow, gotoCol, gotoRow);
        var tagertCol = gotoCol;
        var tagertRow = gotoRow;
        //????????????????????????
        var offsetCol = Math.abs(tagertCol - currCol);
        var offsetRow = Math.abs(tagertRow - currRow);
        offsetCol = offsetCol > 5 ? 5 : offsetCol;
        offsetRow = offsetRow > 5 ? 5 : offsetRow;
        if (dir == Dir.Bottom) {
            tagertRow -= offsetRow;
        }
        else if (dir == Dir.BottomRight) {
            tagertCol -= offsetCol;
            tagertRow -= offsetRow;
        }
        else if (dir == Dir.Right) {
            tagertCol -= offsetCol;
        }
        else if (dir == Dir.TopRight) {
            tagertCol -= offsetCol;
            tagertRow += offsetRow;
        }
        else if (dir == Dir.Top) {
            tagertRow += offsetRow;
        }
        else if (dir == Dir.TopLeft) {
            tagertCol += offsetCol;
            tagertRow += offsetRow;
        }
        else if (dir == Dir.Left) {
            tagertCol += offsetCol;
        }
        else if (dir == Dir.BottomLeft) {
            tagertCol -= offsetCol;
            tagertRow -= offsetRow;
        }
        this.moveTo(tagertCol, tagertRow);
    };
    AutoBattleComponent.prototype.doMove = function () {
        var currCol = this.entity.col;
        var currRow = this.entity.row;
        var gotoDir = App.RandomUtils.limitInteger(0, 7); //??????
        var gotoDis = App.RandomUtils.limitInteger(20, 30); //??????
        var dirCol = 0;
        var dirRow = 0;
        if (gotoDir == Dir.Top) {
            dirRow = -1;
        }
        else if (gotoDir == Dir.TopRight) {
            dirCol = 1;
            dirRow = -1;
        }
        else if (gotoDir == Dir.Right) {
            dirCol = 1;
        }
        else if (gotoDir == Dir.BottomRight) {
            dirCol = 1;
            dirRow = 1;
        }
        else if (gotoDir == Dir.Bottom) {
            dirRow = 1;
        }
        else if (gotoDir == Dir.BottomLeft) {
            dirCol = -1;
            dirRow = 1;
        }
        else if (gotoDir == Dir.Left) {
            dirCol = -1;
        }
        else if (gotoDir == Dir.TopLeft) {
            dirCol = -1;
            dirRow = -1;
        }
        var mapBlocks = this.entity.gameView.getBlocksData();
        var paths = [];
        for (var i = 1; i <= gotoDis; i++) {
            var tmpCol = currCol + dirCol * i;
            var tmpRow = currRow + dirRow * i;
            if (!mapBlocks[tmpRow]) {
                break;
            }
            if (!mapBlocks[tmpRow][tmpCol]) {
                break;
            }
            paths.push(new PathNode(tmpCol, tmpRow));
        }
        if (paths.length > 1) {
            this.entity.path = paths;
        }
        else {
            this.entity.path = null;
        }
    };
    AutoBattleComponent.prototype.moveTo = function (gotoX, gotoY) {
        var currX = this.entity.x;
        var currY = this.entity.y;
        gotoX = gotoX - this.entity.col;
        gotoY = gotoY - this.entity.row;
        var path = this.astar.find(currX, currY, gotoX, gotoY);
        if (path && path.length > 1) {
            path.shift();
            this.entity.path = path;
        }
        else {
            this.entity.path = null;
        }
    };
    AutoBattleComponent.prototype.canAttack = function () {
        var attackDis = this.entity.propertyData.attackDis;
        return Math.abs(this.entity.battleObj.col - this.entity.col) <= attackDis
            && Math.abs(this.entity.battleObj.row - this.entity.row) <= attackDis;
    };
    AutoBattleComponent.prototype.searchBattleObj = function () {
        var list = this.entity.gameView.getAllRpgGameObject();
        list.forEach(function (monster) {
            monster["dis"] = App.MathUtils.getDistance(monster.col, monster.row, this.entity.col, this.entity.row);
        }.bind(this));
        list.sort(function (a, b) {
            if (a["dis"] < b["dis"]) {
                return -1;
            }
            else {
                return 1;
            }
        });
        for (var i = 0; i < list.length; i++) {
            var obj = list[i];
            if (!obj.propertyData)
                break;
            if (obj.propertyData.hp) {
                if (obj.getComponent(ComponentType.AutoBattle)) {
                    if (obj.getComponent(ComponentType.AutoBattle) != this) {
                        this.entity.battleObj = obj;
                        break;
                    }
                }
                else {
                    if (obj.getComponent(ComponentType.Control)) {
                        this.entity.battleObj = obj;
                        break;
                    }
                }
            }
        }
    };
    AutoBattleComponent.prototype.moveToBattleObj = function () {
        if (!this.entity.battleObj) {
            return;
        }
        var offsetFlagX = 0;
        if (this.entity.x > this.entity.battleObj.x) {
            offsetFlagX = 1;
        }
        else if (this.entity.x < this.entity.battleObj.x) {
            offsetFlagX = -1;
        }
        var offsetFlagY = 0;
        if (this.entity.y > this.entity.battleObj.y) {
            offsetFlagY = 1;
        }
        else if (this.entity.y < this.entity.battleObj.y) {
            offsetFlagY = -1;
        }
        var endX = this.entity.battleObj.x + offsetFlagX * RpgGameData.GameCellWidth;
        var endY = this.entity.battleObj.y + offsetFlagY * RpgGameData.GameCellHeight;
        var controlComponent = this.entity.getComponent(ComponentType.Control);
        controlComponent.moveTo(endX, endY);
    };
    return AutoBattleComponent;
}(Component));
__reflect(AutoBattleComponent.prototype, "AutoBattleComponent");
/**
 * Created by yangsong on 2017/10/11.
 */
var AvatarComponent = (function (_super) {
    __extends(AvatarComponent, _super);
    function AvatarComponent() {
        return _super.call(this) || this;
    }
    AvatarComponent.prototype.start = function () {
        _super.prototype.start.call(this);
        this.mc = ObjectPool.pop("RpgMovieClip");
        this.mc.setDefault("avatarDefault_png");
        this.mc.setComplateAction(this.complateAction, this);
        this.buildshadow();
        this.body = ObjectPool.pop("egret.DisplayObjectContainer");
        this.body.addChild(this.mc);
        this.body.addChild(this.shadow);
        this.shadow.x = -65;
        this.shadow.y = -40;
        this.entity.gameView.getGameObjcetLayer().addChild(this.body);
        this.startLoad();
    };
    AvatarComponent.prototype.buildshadow = function () {
        if (!this.shadow) {
            this.shadow = new eui.Image();
            this.shadow.source = "bottomShadow_png";
        }
    };
    AvatarComponent.prototype.stop = function () {
        _super.prototype.stop.call(this);
        this.mc.destroy();
        this.mc = null;
        App.DisplayUtils.removeFromParent(this.body);
        ObjectPool.push(this.body);
        this.body.removeChildren();
        this.body = null;
    };
    AvatarComponent.prototype.update = function (advancedTime) {
        _super.prototype.update.call(this, advancedTime);
        this.setPos();
        if (this.entity.action != this.mc.getCurrAction()
            || this.entity.dir != this.mc.getCurrDir()) {
            this.mc.gotoAction(this.entity.action, this.entity.dir);
        }
        this.mc.runAction(advancedTime);
    };
    AvatarComponent.prototype.complateAction = function () {
        if (this.mc.getCurrAction() == Action.Die) {
            this.entity.gameView.removeMonster(this.entity);
        }
        else {
            this.entity.action = Action.Stand;
            this.mc.gotoAction(this.entity.action, this.entity.dir);
        }
    };
    AvatarComponent.prototype.setPos = function () {
        if (this.body.x != this.entity.x) {
            this.body.x = this.entity.x;
        }
        if (this.body.y != this.entity.y) {
            this.body.y = this.entity.y;
        }
    };
    AvatarComponent.prototype.startLoad = function () {
        Log.debug(this.entity.mcPath, this.entity.mcName);
        RpgGameRes.loadAvatar(this.entity.mcPath, this.entity.mcName, this.onLoadComplate, this);
    };
    AvatarComponent.prototype.onLoadComplate = function () {
        if (!this.isRuning) {
            return;
        }
        var avatarResName = this.entity.mcName;
        var data = RES.getRes("avatar_" + avatarResName + ".json");
        var texture = RES.getRes("avatar_" + avatarResName + ".png");
        var mcFactory = new egret.MovieClipDataFactory(data, texture);
        this.mc.setMcData(mcFactory.generateMovieClipData(avatarResName));
    };
    return AvatarComponent;
}(Component));
__reflect(AvatarComponent.prototype, "AvatarComponent");
/**
 * Created by yangsong on 2017/10/11.
 */
var AvatarSkillComponent = (function (_super) {
    __extends(AvatarSkillComponent, _super);
    function AvatarSkillComponent() {
        return _super.call(this) || this;
    }
    AvatarSkillComponent.prototype.start = function () {
        _super.prototype.start.call(this);
        this.stageCenterX = App.StageUtils.getWidth() * 0.5;
        this.stageCenterY = App.StageUtils.getHeight() * 0.5;
        var avatarComponent = this.entity.getComponent(ComponentType.Avatar);
        this.mcParent = avatarComponent.body;
        this.mc1 = new RpgMovieClip();
        this.mc1.setComplateAction(this.complateAction, this);
        this.mc3 = new RpgMovieClip();
        this.mc3.setComplateAction(this.complateAction3, this);
        this.dirImage = new egret.Bitmap();
        this.circleImage = new egret.Bitmap();
        if (this.entity.id == 20002) {
            this.skillNum = RpgGameSkill.sk30014;
        }
        else if (this.entity.id == 20004) {
            this.skillNum = RpgGameSkill.sk30016;
            var imgName = this.entity.isPlayer ? "circle_blue" : "circle_red";
            this.circleImage.texture = RES.getRes(imgName + "_png");
            this.mc2 = new egret.MovieClip;
            this.position = new egret.Bitmap();
            this.position.width = this.circleImage.width;
            this.position.height = this.circleImage.height;
            this.mcParent.parent.addChild(this.position);
        }
        else if (this.entity.id == 20005) {
            this.mc2 = new egret.MovieClip;
            this.skillNum = RpgGameSkill.sk30017;
        }
        this.startLoad();
    };
    AvatarSkillComponent.prototype.stop = function () {
        _super.prototype.stop.call(this);
        this.mc1.destroy();
        this.mc3.destroy();
        this.mc1 = null;
        this.mc2 = null;
        this.mc3 = null;
        this.mcParent = null;
        this.dirImage = null;
        // this.circleImage = null;
    };
    AvatarSkillComponent.prototype.update = function (advancedTime) {
        _super.prototype.update.call(this, advancedTime);
        if (this.entity.propertyData.skillbooks <= 0)
            return;
        if (this.skillNum == RpgGameSkill.sk30014) {
            if (this.entity.isUsingSkill && !this.mc1.parent) {
                this.startMc();
            }
            else if (!this.entity.isUsingSkill && this.mc1.parent) {
                this.stopMc();
            }
            if (this.mc1 && this.mc1.parent) {
                this.mc1.runAction(advancedTime);
            }
        }
        else if (this.skillNum == RpgGameSkill.sk30016 || this.skillNum == RpgGameSkill.sk30017) {
            if (this.entity.isUsingSkill && !this.mc2.parent) {
                this.startMc();
            }
            else if (!this.entity.isUsingSkill && this.mc2.parent) {
                this.stopMc();
            }
        }
        if (this.entity && this.entity.isDirection) {
            if (this.skillNum == RpgGameSkill.sk30014) {
                if (!this.dirImage.parent) {
                    this.mcParent.addChildAt(this.dirImage, 0);
                    this.entity.skillDir = this.entity.dir;
                    this.updateFanDirBitmap();
                }
                this.updateFanDirBitmap();
            }
            else if (this.skillNum == RpgGameSkill.sk30016) {
                if (!this.circleImage.parent) {
                    this.entity.gameView.addChild(this.circleImage);
                    this.updateCircleBitmap();
                }
                this.updateCircleBitmap();
            }
        }
        else {
            if (this.skillNum == RpgGameSkill.sk30014 && this.dirImage.parent) {
                App.DisplayUtils.removeFromParent(this.dirImage);
            }
            else if (this.skillNum == RpgGameSkill.sk30016 && this.circleImage.parent) {
                App.DisplayUtils.removeFromParent(this.circleImage);
            }
        }
        if (this.isNorAttack) {
            if (this.entity.action == Action.Attack && !this.mc3.parent) {
                this.startMc3();
            }
            if (this.mc3.parent) {
                this.mc3.runAction(advancedTime);
            }
        }
        else if (this.entity && this.entity.action != Action.Attack) {
            if (this.mc3 && this.mc3.parent) {
                this.stopMc3();
            }
        }
    };
    AvatarSkillComponent.prototype.startMc = function () {
        if (this.entity.propertyData.skillbooks <= 0)
            return;
        if (this.skillNum == RpgGameSkill.sk30014) {
            this.mc1.gotoAction(this.entity.action, this.entity.dir, true);
            this.adjustPosition();
            this.mcParent.addChild(this.mc1);
            this.searchBattleObj();
        }
        else if (this.skillNum == RpgGameSkill.sk30016) {
            this.mcParent.parent.addChild(this.mc2);
            this.searchBattleObj();
        }
        else if (this.skillNum == RpgGameSkill.sk30017) {
            App.AnchorUtils.setAnchorX(this.mc2, 1.05);
            App.AnchorUtils.setAnchorY(this.mc2, 1.1);
            this.mcParent.addChild(this.mc2);
            this.entity.propertyData.attackDis += 12;
        }
    };
    AvatarSkillComponent.prototype.stopMc = function () {
        if (this.skillNum == RpgGameSkill.sk30014) {
            App.DisplayUtils.removeFromParent(this.mc1);
        }
        else if (this.skillNum == RpgGameSkill.sk30016) {
            App.DisplayUtils.removeFromParent(this.mc2);
        }
        else if (this.skillNum == RpgGameSkill.sk30017) {
            App.DisplayUtils.removeFromParent(this.mc2);
            this.entity.propertyData.attackDis -= 12;
        }
    };
    AvatarSkillComponent.prototype.complateAction = function () {
        this.stopMc();
    };
    AvatarSkillComponent.prototype.startMc3 = function () {
        this.mc3.gotoAction(this.entity.action, this.entity.dir, true);
        this.adjustPosition3();
        if (this.entity.dir == Dir.Top
            || this.entity.dir == Dir.TopLeft
            || this.entity.dir == Dir.TopRight) {
            this.mcParent.addChildAt(this.mc3, 0);
        }
        else {
            this.mcParent.addChild(this.mc3);
        }
    };
    AvatarSkillComponent.prototype.stopMc3 = function () {
        App.DisplayUtils.removeFromParent(this.mc3);
    };
    AvatarSkillComponent.prototype.complateAction3 = function () {
        this.stopMc3();
    };
    AvatarSkillComponent.prototype.startLoad = function () {
        RpgGameRes.loadAvatar(this.entity.skillPath, this.skillNum.toString(), this.onLoadComplate, this);
        RpgGameRes.loadAvatar(this.entity.skillPath, RpgGameSkill.sk30006.toString(), this.onLoadComplate3, this);
    };
    AvatarSkillComponent.prototype.onLoadComplate = function () {
        if (!this.isRuning) {
            return;
        }
        var avatarResName = this.skillNum.toString();
        var data = RES.getRes("avatar_" + avatarResName + ".json");
        var texture = RES.getRes("avatar_" + avatarResName + ".png");
        var mcFactory = new egret.MovieClipDataFactory(data, texture);
        if (this.skillNum == RpgGameSkill.sk30014) {
            this.mc1.setMcData(mcFactory.generateMovieClipData(avatarResName));
        }
        else if (this.skillNum == RpgGameSkill.sk30016 || this.skillNum == RpgGameSkill.sk30017) {
            this.mc2.movieClipData = mcFactory.generateMovieClipData(avatarResName);
            this.mc2.gotoAndPlay("release", -1);
        }
    };
    AvatarSkillComponent.prototype.onLoadComplate3 = function () {
        if (!this.isRuning) {
            return;
        }
        var avatarResName = RpgGameSkill.sk30006.toString();
        var data = RES.getRes("avatar_" + avatarResName + ".json");
        var texture = RES.getRes("avatar_" + avatarResName + ".png");
        var mcFactory = new egret.MovieClipDataFactory(data, texture);
        this.mc3.setMcData(mcFactory.generateMovieClipData(avatarResName));
    };
    //???????????????????????????
    AvatarSkillComponent.prototype.updateCircleBitmap = function () {
        //var gotoDir = this.entity.dir;
        var x = this.entity.skillX;
        var y = this.entity.skillY;
        var fixDis = 80;
        var radius = this.stageCenterY - fixDis;
        var distance = App.MathUtils.getDistance(this.stageCenterX, this.stageCenterY, x, y);
        if (distance > radius) {
            var sideLength = (distance - radius) / Math.sqrt(2);
            if (this.stageCenterX > x) {
                x += sideLength;
            }
            else if (this.stageCenterX < x) {
                x -= sideLength;
            }
            // var tempY: number  = this.stageCenterY - y;
            // if (tempY > 0  && tempY > radius) {
            //     y += sideLength;
            // }else if (tempY < 0 && tempY < -radius) {
            //     y -= sideLength;
            // }
        }
        // var tempX: number  = this.stageCenterX - x;
        // var tempY: number  = this.stageCenterY - y;
        // if (tempX > radius) {
        //     x = this.stageCenterX - radius;
        // }else if (tempX < 0 && tempX < -radius) {
        //     x = this.stageCenterX + radius;
        // }
        // if (tempY > radius) {
        //     y = this.stageCenterY - radius;
        // }else if (tempY < 0 && tempY < -radius) {
        //     y = this.stageCenterY + radius;
        // }
        this.circleImage.anchorOffsetX = this.circleImage.width * 0.5;
        this.circleImage.anchorOffsetY = this.circleImage.height * 0.5;
        this.circleImage.x = x;
        this.circleImage.y = y;
        var px;
        var py;
        if (!x && !y) {
            if (this.entity.battleObj) {
                px = this.entity.battleObj.x;
                py = this.entity.battleObj.y;
            }
        }
        else {
            px = this.entity.x - (this.stageCenterX - x);
            py = this.entity.y - (this.stageCenterY - y);
        }
        App.AnchorUtils.setAnchorX(this.position, 0.5);
        App.AnchorUtils.setAnchorY(this.position, 0.5);
        this.position.x = px;
        this.position.y = py;
        App.AnchorUtils.setAnchorX(this.mc2, 0.7);
        App.AnchorUtils.setAnchorY(this.mc2, 1);
        this.mc2.x = px;
        this.mc2.y = py;
        // if(gotoDir == Dir.Bottom){
        //     x = -125;
        //     y = 20;
        // }else if(gotoDir == Dir.BottomRight){
        //     x = 35;
        //     y = -40;
        // }else if(gotoDir == Dir.Right){
        //     x = 80;
        //     y = -150;
        // }else if(gotoDir == Dir.TopRight){
        //     x = 35;
        //     y = -290;
        // }else if(gotoDir == Dir.Top){
        //     x = -125;
        //     y = -310;
        // }else if(gotoDir == Dir.TopLeft){
        //     x = -300;
        //     y = -290;
        // }else if(gotoDir == Dir.Left){
        //     x = -330;
        //     y = -150;
        // }else if(gotoDir == Dir.BottomLeft){
        //     x = -310;
        //     y = -40;
        // }
        // this.mc2.x = this.mcParent.x + x;
        // this.mc2.y = this.mcParent.y + y; 
    };
    //?????????????????????
    AvatarSkillComponent.prototype.updateFanDirBitmap = function () {
        //0??? 1?????? 2??? 3?????? 4???
        var gotoDir = this.entity.skillDir;
        var dir;
        var scaleX;
        var x;
        var y;
        if (gotoDir == Dir.Bottom) {
            dir = 0;
            scaleX = 1;
            x = -105;
            y = 20;
        }
        else if (gotoDir == Dir.BottomRight) {
            dir = 1;
            scaleX = 1;
            x = 35;
            y = 0;
        }
        else if (gotoDir == Dir.Right) {
            dir = 2;
            scaleX = 1;
            x = 30;
            y = -60;
        }
        else if (gotoDir == Dir.TopRight) {
            dir = 3;
            scaleX = 1;
            x = 35;
            y = -110;
        }
        else if (gotoDir == Dir.Top) {
            dir = 4;
            scaleX = 1;
            x = -75;
            y = -150;
        }
        else if (gotoDir == Dir.TopLeft) {
            dir = 3;
            scaleX = -1;
            x = -20;
            y = -130;
        }
        else if (gotoDir == Dir.Left) {
            dir = 2;
            scaleX = -1;
            x = -30;
            y = -60;
        }
        else if (gotoDir == Dir.BottomLeft) {
            dir = 1;
            scaleX = -1;
            x = -20;
            y = 20;
        }
        this.dirImage.x = x;
        this.dirImage.y = y;
        this.dirImage.texture = RES.getRes("cone_" + dir + "_png");
        this.dirImage.scaleX = scaleX;
    };
    //??????????????????
    AvatarSkillComponent.prototype.adjustPosition = function () {
        if (this.skillNum != RpgGameSkill.sk30014)
            return;
        switch (this.entity.dir) {
            case Dir.Bottom:
                this.mc1.x = 0;
                this.mc1.y = 160;
                break;
            case Dir.BottomRight:
                this.mc1.x = 100;
                this.mc1.y = 100;
                break;
            case Dir.Right:
                this.mc1.x = 160;
                this.mc1.y = 0;
                break;
            case Dir.TopRight:
                this.mc1.x = 100;
                this.mc1.y = -60;
                break;
            case Dir.Top:
                this.mc1.x = 0;
                this.mc1.y = -100;
                break;
            case Dir.TopLeft:
                this.mc1.x = -100;
                this.mc1.y = -60;
                break;
            case Dir.Left:
                this.mc1.x = -160;
                this.mc1.y = 0;
                break;
            case Dir.BottomLeft:
                this.mc1.x = -100;
                this.mc1.y = 100;
                break;
        }
    };
    //????????????????????????
    AvatarSkillComponent.prototype.adjustPosition3 = function () {
        switch (this.entity.dir) {
            case Dir.Bottom:
                this.mc3.x = 0;
                this.mc3.y = 120;
                break;
            case Dir.BottomRight:
                this.mc3.x = 100;
                this.mc3.y = 100;
                break;
            case Dir.Right:
                this.mc3.x = 100;
                this.mc3.y = 0;
                break;
            case Dir.TopRight:
                this.mc3.x = 100;
                this.mc3.y = -60;
                break;
            case Dir.Top:
                this.mc3.x = 0;
                this.mc3.y = -100;
                break;
            case Dir.TopLeft:
                this.mc3.x = -100;
                this.mc3.y = -60;
                break;
            case Dir.Left:
                this.mc3.x = -100;
                this.mc3.y = 0;
                break;
            case Dir.BottomLeft:
                this.mc3.x = -100;
                this.mc3.y = 100;
                break;
        }
    };
    AvatarSkillComponent.prototype.searchBattleObj = function () {
        var list = this.entity.gameView.getMonsters();
        if (this.skillNum == RpgGameSkill.sk30014) {
            var cx = this.entity.col;
            var cy = this.entity.row;
            var ux = this.getPointOfDirection(this.entity.dir, this.entity.propertyData.attackDis)[0];
            var uy = this.getPointOfDirection(this.entity.dir, this.entity.propertyData.attackDis)[1];
            var squaredR = (this.entity.propertyData.attackDis + 22) * 2;
            var cosTheta = this.getPointOfDirection(this.entity.dir, this.entity.propertyData.attackDis)[2];
            for (var i = 0; i < list.length; i++) {
                var monster = list[i];
                var px = monster.col;
                var py = monster.row;
                var result = this.in_circular_sector(cx, cy, ux, uy, squaredR, cosTheta, px, py);
                if (result) {
                    Log.debug("????????????????????????, ??????????????????:" + this.entity.propertyData.skillh);
                    this.entity.battleObj = monster;
                    this.dealHarm(monster);
                }
            }
        }
        else if (this.skillNum == RpgGameSkill.sk30016) {
            for (var i = 0; i < list.length; i++) {
                var monster = list[i];
                var avatarComponent = monster.getComponent(ComponentType.Avatar);
                var isHit = RpgGameUtils.hitTest(this.position, avatarComponent.body);
                if (isHit) {
                    Log.debug("pgGameSkill.sk30016 isHit");
                    this.dealHarm(monster);
                }
            }
        }
    };
    //????????????????????????????????????????????????
    AvatarSkillComponent.prototype.getPointOfDirection = function (dir, radius) {
        var angle = this.getAngleBydir(dir);
        var array = [];
        var radian = App.MathUtils.getRadian(angle);
        var cosRadian = Math.cos(radian);
        var x = radius * cosRadian;
        var y = radius * Math.sin(radian);
        array.push(x);
        array.push(y);
        array.push(cosRadian);
        return array;
    };
    //???????????????????????????????????????
    //@param cx ???????????????x
    //@param cy ???????????????y 
    //@param ux ????????????????????????x
    //@param uy ????????????????????????y
    //@param squaredR ??????
    //@param cosTheta ????????????cos0
    AvatarSkillComponent.prototype.in_circular_sector = function (cx, cy, ux, uy, squaredR, cosTheta, px, py) {
        // |D|^2 = (dx^2 + dy^2)
        var dx = px - cx;
        var dy = py - cy;
        // |D|^2 = (dx^2 + dy^2)
        var squaredLength = dx * dx + dy * dy;
        if (squaredLength > squaredR)
            return false;
        // |D|
        //var length = Math.sqrt(squaredLength);
        // // D dot U > |D| cos(theta)
        // return dx * ux + dy * uy > length * cosTheta;
        // D dot U
        var DdotU = dx * ux + dy * uy;
        // D dot U > |D| cos(theta)
        // <=>
        // (D dot U)^2 > |D|^2 (cos(theta))^2 if D dot U >= 0 and cos(theta) >= 0
        // (D dot U)^2 < |D|^2 (cos(theta))^2 if D dot U <  0 and cos(theta) <  0
        // true                               if D dot U >= 0 and cos(theta) <  0
        // false                              if D dot U <  0 and cos(theta) >= 0
        if (DdotU >= 0 && cosTheta >= 0)
            return DdotU * DdotU > squaredLength * cosTheta * cosTheta;
        else if (DdotU < 0 && cosTheta < 0)
            return DdotU * DdotU < squaredLength * cosTheta * cosTheta;
        else
            return DdotU >= 0;
    };
    //???????????????????????????
    AvatarSkillComponent.prototype.getAngleBydir = function (dir) {
        var angle = 0;
        if (dir == Dir.Right) {
            angle = 0;
            return angle;
        }
        else if (dir == Dir.TopRight) {
            angle = 45;
            return angle;
        }
        else if (dir == Dir.Top) {
            angle = 90;
            return angle;
        }
        else if (dir == Dir.TopLeft) {
            angle = 135;
            return angle;
        }
        else if (dir == Dir.Left) {
            angle = 180;
            return angle;
        }
        else if (dir == Dir.BottomLeft) {
            angle = 225;
            return angle;
        }
        else if (dir == Dir.Bottom) {
            angle = 270;
            return angle;
        }
        else if (dir == Dir.BottomRight) {
            angle = 315;
            return angle;
        }
        return angle;
    };
    AvatarSkillComponent.prototype.dealHarm = function (battleObj) {
        if (!this.entity) {
            return;
        }
        var defenceObj = battleObj;
        if (!defenceObj) {
            return;
        }
        //????????????
        var harm;
        var skillh = this.entity.propertyData.skillh;
        if (this.entity.isSkillBuff) {
            if (defenceObj.buffNum == RpgGameSkill.sk30010) {
                harm = skillh - skillh * 0.1;
            }
            else if (defenceObj.buffNum == RpgGameSkill.sk30011) {
                harm = skillh - skillh * 0.15;
            }
            else {
                harm = skillh;
            }
        }
        else {
            harm = skillh;
        }
        defenceObj.propertyData.hp = Math.max(0, defenceObj.propertyData.hp - harm);
        //??????????????????
        //f (defenceObj instanceof RpgMonster) {
        this.entity.gameView.showHpChange(defenceObj, -harm);
        //} else {
        //    this.entity.gameView.showHpChange(defenceObj, -harm, 0x00FF00);
        //}
        //????????????
        if (defenceObj.propertyData.hp == 0) {
            if (defenceObj instanceof RpgMonster) {
                battleObj = null;
                if (this.entity) {
                    this.entity.battleObj = null;
                    this.entity.gameView.removeMonster(defenceObj);
                    this.entity.killNum += 1; //?????????+1
                    this.entity.gameView.refreshRankList();
                }
                Log.debug(this.entity.gameView.getMonsters().length);
                if (this.entity.gameView.getMonsters().length <= 0) {
                    App.MessageCenter.dispatch(EventNames.Fight_End, this.entity.killNum);
                    App.ViewManager.close(ViewConst.RpgGame);
                    App.ViewManager.destroy(ViewConst.RpgGame);
                    App.SceneManager.runScene(SceneConsts.UI);
                    App.ViewManager.open(ViewConst.SettlementView);
                }
            }
        }
        else {
            if (defenceObj.action == Action.Stand) {
                defenceObj.action = Action.Attacked;
            }
        }
    };
    return AvatarSkillComponent;
}(Component));
__reflect(AvatarSkillComponent.prototype, "AvatarSkillComponent");
/**
 * Created by yangsong on 2017/10/13.
 */
//pay attention to ???????????????battle?????????
var BattleComponent = (function (_super) {
    __extends(BattleComponent, _super);
    function BattleComponent() {
        return _super.call(this) || this;
    }
    BattleComponent.prototype.start = function () {
        _super.prototype.start.call(this);
        // this.dealInterval = 100;
    };
    BattleComponent.prototype.stop = function () {
        _super.prototype.stop.call(this);
        this.isAttacking = false;
        this.attackTime = null;
    };
    BattleComponent.prototype.update = function (advancedTime) {
        _super.prototype.update.call(this, advancedTime);
    };
    BattleComponent.prototype.canAttack = function () {
        var attackDis = this.entity.propertyData.attackDis;
        return Math.abs(this.entity.battleObj.col - this.entity.col) <= attackDis
            && Math.abs(this.entity.battleObj.row - this.entity.row) <= attackDis;
    };
    BattleComponent.prototype.stopAttack = function () {
        this.isAttacking = false;
        this.attackTime = null;
        this.entity.battleObj = null;
    };
    BattleComponent.prototype.startAttack = function () {
        if (!this.entity || this.entity.propertyData.skillbooks <= 0)
            return;
        this.entity.propertyData.skillbooks -= 1;
        this.entity.resetTimer();
        this.isAttacking = true;
        this.attackTime = egret.getTimer();
        this.entity.action = Action.Attack;
        if (!this.entity.isUsingSkill) {
            this.searchBattleObj();
        }
    };
    BattleComponent.prototype.searchBattleObj = function () {
        var list = this.entity.gameView.getMonsters();
        var cx = this.entity.col;
        var cy = this.entity.row;
        var attackDis = this.entity.propertyData.attackDis * 2;
        for (var i = 0; i < list.length; i++) {
            var monster = list[i];
            var px = monster.col;
            var py = monster.row;
            var isSameDir = RpgGameUtils.isSameAngle(cx, cy, px, py, this.entity.dir);
            if (isSameDir) {
                Log.debug("???????????????????????????????????????");
                //var distance = App.MathUtils.getDistance(cx,cy,px,py);
                if (Math.abs(px - cx) <= attackDis && Math.abs(py - cy) <= attackDis) {
                    Log.debug("??????????????????????????????");
                    this.entity.battleObj = monster;
                    //egret.setTimeout(this.dealHarm, this, 500);
                    //????????????
                    this.dealHarm(monster);
                }
            }
            else {
                //Log.debug("???????????????" + pDir + " ???????????????" + this.entity.dir + "??????????????????");
                Log.debug("?????????????????????????????????");
            }
        }
        // var cx = this.entity.col;
        // var cy = this.entity.row;
        // var ux = this.getPointOfDirection(this.entity.dir,this.entity.propertyData.attackDis)[0];
        // var uy = this.getPointOfDirection(this.entity.dir,this.entity.propertyData.attackDis)[1];
        // var squaredR = (this.entity.propertyData.attackDis + 10) * 2;
        // var cosTheta = this.getPointOfDirection(this.entity.dir,this.entity.propertyData.attackDis)[2];
        // for (var i=0; i<list.length; i++) {
        //     var monster = list[i];
        //     var px = monster.col;
        //     var py = monster.row;
        //     var result:boolean = this.in_circular_sector(cx,cy,ux,uy,squaredR,cosTheta,px,py);
        //     if (result) {
        //         Log.debug("????????????????????????");
        //         this.entity.battleObj = monster;
        //         //egret.setTimeout(this.dealHarm, this, 500);
        //         //????????????
        //         this.dealHarm(monster);
        //     }else {
        //         //Log.debug("????????????????????????");
        //     }
        // }
    };
    //????????????????????????????????????????????????
    BattleComponent.prototype.getPointOfDirection = function (dir, radius) {
        var angle = this.getAngleBydir(dir);
        var array = [];
        var radian = App.MathUtils.getRadian(angle);
        var cosRadian = Math.cos(radian);
        var x = radius * cosRadian;
        var y = radius * Math.sin(radian);
        array.push(x);
        array.push(y);
        array.push(cosRadian);
        return array;
    };
    //???????????????????????????????????????
    //@param cx ???????????????x
    //@param cy ???????????????y 
    //@param ux ????????????????????????x
    //@param uy ????????????????????????y
    //@param squaredR ??????
    //@param cosTheta ????????????cos0
    BattleComponent.prototype.in_circular_sector = function (cx, cy, ux, uy, squaredR, cosTheta, px, py) {
        // |D|^2 = (dx^2 + dy^2)
        var dx = px - cx;
        var dy = py - cy;
        // |D|^2 = (dx^2 + dy^2)
        var squaredLength = dx * dx + dy * dy;
        if (squaredLength > squaredR)
            return false;
        // |D|
        var length = Math.sqrt(squaredLength);
        // D dot U > |D| cos(theta)
        return Math.abs(dx * ux + dy * uy) > Math.abs(length * cosTheta);
    };
    //???????????????????????????
    BattleComponent.prototype.getAngleBydir = function (dir) {
        var angle = 0;
        if (dir == Dir.Right) {
            angle = 0;
            return angle;
        }
        else if (dir == Dir.TopRight) {
            angle = 45;
            return angle;
        }
        else if (dir == Dir.Top) {
            angle = 90;
            return angle;
        }
        else if (dir == Dir.TopLeft) {
            angle = 135;
            return angle;
        }
        else if (dir == Dir.Left) {
            angle = 180;
            return angle;
        }
        else if (dir == Dir.BottomLeft) {
            angle = 225;
            return angle;
        }
        else if (dir == Dir.Bottom) {
            angle = 270;
            return angle;
        }
        else if (dir == Dir.BottomRight) {
            angle = 315;
            return angle;
        }
        return angle;
    };
    // list.forEach(function (monster) {
    //     var distance = App.MathUtils.getDistance(monster.col, monster.row, this.entity.col, this.entity.row);
    //     monster["dis"] = distance;
    //     if (distance > this.entity.propertyData.attackDis) {
    //         return;
    //     }else {
    //         var dir = RpgGameUtils.computeGameObjDir(this.entity.x, this.entity.y, monster.x, monster.y);
    //     }
    // }.bind(this));
    // list.sort(function (a, b) {
    //     if (a["dis"] < b["dis"]) {
    //         return -1;
    //     } else {
    //         return 1;
    //     }
    // })
    // for (var i = 0; i < list.length; i++) {
    //     var obj = list[i];
    //     var dis = obj["dis"];
    //     if (dis < this.entity.propertyData.attackDis) {
    //         return;
    //     }
    //     var arg = Math.atan2(obj.row, obj.col); //?????????????????????
    //     if (arg < (this.entity.dir *Math.PI / 180.0)) {
    //         Log.debug("..............");
    //         Math.acos
    //     }
    //     // if (obj.propertyData.hp) {
    //     //     this.entity.battleObj = obj;
    //     //     break;
    //     // }
    // }
    BattleComponent.prototype.dealHarm = function (battleObj) {
        if (!this.entity) {
            return;
        }
        var defenceObj = battleObj;
        if (!defenceObj) {
            return;
        }
        //???????????????
        defenceObj.resetTimer();
        //????????????
        var harm;
        var skillp = this.entity.propertyData.skillp;
        if (this.entity.isSkillBuff) {
            if (this.entity.buffNum == RpgGameSkill.sk30008) {
                harm = skillp + skillp * 0.2;
            }
            else if (defenceObj.buffNum == RpgGameSkill.sk30010) {
                harm = skillp - skillp * 0.1;
                this.entity.speed -= this.entity.speed * 0.2;
                this.entity.propertyData.buffnumber = RpgBoxBuff.buff7;
                egret.setTimeout(function () {
                    if (this.entity) {
                        this.entity.propertyData.buffnumber = RpgBoxBuff.buff0;
                    }
                }, this, 5000);
            }
            else if (defenceObj.buffNum == RpgGameSkill.sk30011) {
                harm = skillp - skillp * 0.15;
            }
            else {
                harm = skillp;
            }
        }
        else {
            harm = skillp;
        }
        defenceObj.propertyData.hp = Math.max(0, defenceObj.propertyData.hp - harm);
        //??????????????????
        //if (defenceObj instanceof RpgMonster) {
        this.entity.gameView.showHpChange(defenceObj, -harm);
        //} else {
        //    this.entity.gameView.showHpChange(defenceObj, -harm, 0x00FF00);
        //}
        //????????????????????????10%
        this.entity.gameView.skillBtn1.updateAngelShap(10);
        //????????????
        if (defenceObj.propertyData.hp == 0) {
            if (defenceObj instanceof RpgMonster) {
                battleObj = null;
                this.entity.battleObj = null;
                this.entity.gameView.removeMonster(defenceObj);
                this.entity.killNum += 1; //?????????+1
                this.entity.gameView.refreshRankList();
                Log.debug(this.entity.gameView.getMonsters().length);
                //????????????????????????30%
                this.entity.gameView.skillBtn1.updateAngelShap(30);
                if (this.entity.gameView.getMonsters().length <= 0) {
                    App.MessageCenter.dispatch(EventNames.Fight_End, this.entity.killNum);
                    App.ViewManager.close(ViewConst.RpgGame);
                    App.ViewManager.destroy(ViewConst.RpgGame);
                    App.SceneManager.runScene(SceneConsts.UI);
                    App.ViewManager.open(ViewConst.SettlementView);
                }
            }
        }
        else {
            if (defenceObj.action == Action.Stand) {
                defenceObj.action = Action.Attacked;
            }
        }
    };
    BattleComponent.prototype.continueAttack = function () {
        var attackInterval = this.entity.propertyData.attackInterval;
        var nowTime = egret.getTimer();
        if (nowTime - this.attackTime >= attackInterval) {
            this.startAttack();
        }
    };
    return BattleComponent;
}(Component));
__reflect(BattleComponent.prototype, "BattleComponent");
/**
 * Created by yangsong on 2017/10/13.
 */
var CameraComponent = (function (_super) {
    __extends(CameraComponent, _super);
    function CameraComponent() {
        return _super.call(this) || this;
    }
    CameraComponent.prototype.start = function () {
        _super.prototype.start.call(this);
        this.moveObjs = [];
        this.moveObjs.push(this.entity.gameView.getGameEffectLayer());
        this.moveObjs.push(this.entity.gameView.getGameObjcetLayer());
        this.moveObjs.push(this.entity.gameView.getBackground());
        this.background = this.entity.gameView.getBackground();
    };
    CameraComponent.prototype.stop = function () {
        _super.prototype.stop.call(this);
        this.moveObjs = null;
        this.background = null;
        this.playerX = null;
        this.playerY = null;
        this.playerCol = null;
        this.playerRow = null;
    };
    CameraComponent.prototype.update = function (advancedTime) {
        _super.prototype.update.call(this, advancedTime);
        if (this.playerPosChange()) {
            this.playerX = this.entity.x;
            this.playerY = this.entity.y;
            this.dealMoveObjs();
        }
        if (this.playerCellChange()) {
            this.playerCol = this.entity.col;
            this.playerRow = this.entity.row;
            this.dealBgCamera();
        }
    };
    CameraComponent.prototype.playerPosChange = function () {
        return this.playerX != this.entity.x || this.playerY != this.entity.y;
    };
    CameraComponent.prototype.playerCellChange = function () {
        return this.playerCol != this.entity.col || this.playerRow != this.entity.row;
    };
    CameraComponent.prototype.dealMoveObjs = function () {
        var left = Math.max(this.playerX - App.StageUtils.getWidth() * 0.5, 0);
        var top = Math.max(this.playerY - App.StageUtils.getHeight() * 0.5, 0);
        left = Math.min(this.background.mapWidth - App.StageUtils.getWidth(), left);
        top = Math.min(this.background.mapHeight - App.StageUtils.getHeight(), top);
        this.moveObjs.forEach(function (obj) {
            obj.x = -left;
            obj.y = -top;
        });
    };
    CameraComponent.prototype.dealBgCamera = function () {
        this.background.updateCameraPos(this.playerX, this.playerY);
    };
    return CameraComponent;
}(Component));
__reflect(CameraComponent.prototype, "CameraComponent");
var ViewManager = (function (_super) {
    __extends(ViewManager, _super);
    /**
     * ????????????
     */
    function ViewManager() {
        var _this = _super.call(this) || this;
        _this._views = {};
        _this._opens = [];
        return _this;
    }
    /**
     * ????????????
     */
    ViewManager.prototype.clear = function () {
        this.closeAll();
        this._views = {};
    };
    /**
     * ????????????
     * @param key ??????????????????
     * @param view ??????
     */
    ViewManager.prototype.register = function (key, view) {
        if (view == null) {
            return;
        }
        if (this._views[key]) {
            return;
        }
        this._views[key] = view;
    };
    /**
     * ??????????????????
     * @param key
     */
    ViewManager.prototype.unregister = function (key) {
        if (!this._views[key]) {
            return;
        }
        this._views[key] = null;
        delete this._views[key];
    };
    /**
     * ??????????????????
     * @param key ????????????
     * @param newView ?????????
     */
    ViewManager.prototype.destroy = function (key, newView) {
        if (newView === void 0) { newView = null; }
        var oldView = this.getView(key);
        if (oldView) {
            this.unregister(key);
            oldView.destroy();
            oldView = null;
        }
        this.register(key, newView);
    };
    /**
     * ????????????
     * @param key ??????????????????
     * @param param ??????
     *
     */
    ViewManager.prototype.open = function (key) {
        var param = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            param[_i - 1] = arguments[_i];
        }
        var view = this.getView(key);
        if (view == null) {
            Log.warn("UI_" + key + "?????????");
            return;
        }
        if (view.isShow()) {
            view.open.apply(view, param);
            ;
            return view;
        }
        if (view.isInit()) {
            view.addToParent();
            view.open.apply(view, param);
            ;
        }
        else {
            App.EasyLoading.showLoading();
            view.loadResource(function () {
                view.setVisible(false);
                view.addToParent();
                App.EasyLoading.hideLoading();
            }.bind(this), function () {
                view.initUI();
                view.initData();
                view.open.apply(view, param);
                view.setVisible(true);
            }.bind(this));
        }
        this._opens.push(key);
        return view;
    };
    /**
     * ????????????
     * @param key ??????????????????
     * @param param ??????
     *
     */
    ViewManager.prototype.close = function (key) {
        var param = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            param[_i - 1] = arguments[_i];
        }
        if (!this.isShow(key)) {
            return;
        }
        var view = this.getView(key);
        if (view == null) {
            return;
        }
        var viewIndex = this._opens.indexOf(key);
        if (viewIndex >= 0) {
            this._opens.splice(viewIndex, 1);
        }
        view.removeFromParent();
        view.close.apply(view, param);
    };
    /**
     * ????????????
     * @param view
     * @param param
     */
    ViewManager.prototype.closeView = function (view) {
        var param = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            param[_i - 1] = arguments[_i];
        }
        var keys = Object.keys(this._views);
        for (var i = 0, len = keys.length; i < len; i++) {
            var key = parseInt(keys[i]);
            if (this._views[key] == view) {
                this.close(key, param);
                return;
            }
        }
    };
    /**
     * ??????????????????????????????UI??????
     * @param key
     * @returns {any}
     */
    ViewManager.prototype.getView = function (key) {
        return this._views[key];
    };
    /**
     * ????????????????????????UI
     */
    ViewManager.prototype.closeAll = function () {
        while (this._opens.length) {
            this.close(this._opens[0]);
        }
    };
    /**
     * ??????ui????????????
     * @returns {number}
     */
    ViewManager.prototype.currOpenNum = function () {
        return this._opens.length;
    };
    /**
     * ????????????UI???????????????
     * @param key
     * @returns {boolean}
     */
    ViewManager.prototype.isShow = function (key) {
        return this._opens.indexOf(key) != -1;
    };
    return ViewManager;
}(SingtonClass));
__reflect(ViewManager.prototype, "ViewManager");
/**
 * Created by yangsong on 2017/10/11.
 */
var ComponentSystem = (function () {
    function ComponentSystem() {
    }
    ComponentSystem.addComponent = function (component) {
        if (!this._Components[component.type]) {
            this._Components[component.type] = [];
        }
        this._Components[component.type].push(component);
    };
    ComponentSystem.removeComponent = function (component) {
        if (!this._Components[component.type]) {
            return;
        }
        var index = this._Components[component.type].indexOf(component);
        if (index != -1) {
            this._Components[component.type].splice(index, 1);
        }
    };
    ComponentSystem.start = function () {
        App.TimerManager.doFrame(1, 0, this.onEnterFrame, this);
    };
    ComponentSystem.stop = function () {
        App.TimerManager.remove(this.onEnterFrame, this);
    };
    ComponentSystem.onEnterFrame = function (advancedTime) {
        this.dealComponents(this._Components[ComponentType.Ai], advancedTime);
        this.dealComponents(this._Components[ComponentType.AutoBattle], advancedTime);
        this.dealComponents(this._Components[ComponentType.Move], advancedTime);
        this.dealComponents(this._Components[ComponentType.Aoi], advancedTime);
        this.dealComponents(this._Components[ComponentType.Battle], advancedTime);
        this.dealComponents(this._Components[ComponentType.Avatar], advancedTime);
        this.dealComponents(this._Components[ComponentType.AvatarSkill], advancedTime);
        this.dealComponents(this._Components[ComponentType.Camera], advancedTime);
        this.dealComponents(this._Components[ComponentType.Sort], advancedTime);
        this.dealComponents(this._Components[ComponentType.MonsterBattle], advancedTime);
        this.dealComponents(this._Components[ComponentType.Effect], advancedTime);
        this.dealComponents(this._Components[ComponentType.Head], advancedTime);
    };
    ComponentSystem.dealComponents = function (arr, advancedTime) {
        if (!arr) {
            return;
        }
        arr.forEach(function (component) {
            if (!component.isRuning) {
                return;
            }
            component.dealTime += advancedTime;
            if (component.dealTime >= component.dealInterval) {
                component.dealTime = 0;
                component.update(advancedTime);
            }
        });
    };
    ComponentSystem._Components = {};
    return ComponentSystem;
}());
__reflect(ComponentSystem.prototype, "ComponentSystem");
/**
 * Created by yangsong on 2017/10/19.
 */
var ComponentType = (function () {
    function ComponentType() {
    }
    ComponentType.Ai = "AiComponent";
    ComponentType.Aoi = "AoiComponent";
    ComponentType.Avatar = "AvatarComponent";
    ComponentType.AvatarSkill = "AvatarSkillComponent";
    ComponentType.Camera = "CameraComponent";
    ComponentType.Move = "MoveComponent";
    ComponentType.Control = "ControlComponent";
    ComponentType.Sort = "SortComponent";
    ComponentType.Head = "HeadComponent";
    ComponentType.AutoBattle = "AutoBattleComponent";
    ComponentType.Battle = "BattleComponent";
    ComponentType.MonsterBattle = "MonsterBattleComponent";
    ComponentType.Effect = "EffectComponent";
    return ComponentType;
}());
__reflect(ComponentType.prototype, "ComponentType");
/**
 * Created by yangsong on 2017/10/13.
 */
var ControlComponent = (function (_super) {
    __extends(ControlComponent, _super);
    function ControlComponent() {
        return _super.call(this) || this;
    }
    ControlComponent.prototype.start = function () {
        _super.prototype.start.call(this);
        // this.entity.gameView.touchEnabled = true;
        // this.entity.gameView.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
        this.astar = new SilzAstar(this.entity.gameView.getBlocksData());
    };
    ControlComponent.prototype.stop = function () {
        _super.prototype.stop.call(this);
        // this.entity.gameView.touchEnabled = false;
        // this.entity.gameView.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
        this.astar = null;
    };
    ControlComponent.prototype.update = function (advancedTime) {
        _super.prototype.update.call(this, advancedTime);
        //
    };
    ControlComponent.prototype.onClick = function (evt) {
        var gotoX = evt.stageX + (-this.entity.gameView.getGameObjcetLayer().x);
        var gotoY = evt.stageY + (-this.entity.gameView.getGameObjcetLayer().y);
        this.moveTo(gotoX, gotoY);
        this.entity.battleObj = null;
    };
    ControlComponent.prototype.moveTo = function (gotoX, gotoY) {
        if (!this.entity)
            return;
        var currX = this.entity.x;
        var currY = this.entity.y;
        var path = this.astar.find(currX, currY, gotoX, gotoY);
        if (path && path.length > 1) {
            path.shift();
            this.entity.path = path;
        }
        else {
            this.entity.path = null;
        }
    };
    return ControlComponent;
}(Component));
__reflect(ControlComponent.prototype, "ControlComponent");
/**
 * Created by Harvey on 2019/7/9.
 */
var EffectComponent = (function (_super) {
    __extends(EffectComponent, _super);
    function EffectComponent() {
        return _super.call(this) || this;
    }
    EffectComponent.prototype.start = function () {
        _super.prototype.start.call(this);
        var avatarComponent = this.entity.getComponent(ComponentType.Avatar);
        this.mcParent = avatarComponent.body;
        if (this.entity.id == 20002) {
            this.mcName = RpgGameSkill.sk30008.toString();
        }
        else if (this.entity.id == 20004) {
            this.mcName = RpgGameSkill.sk30010.toString();
        }
        else if (this.entity.id == 20005) {
            this.mcName = RpgGameSkill.sk30011.toString();
        }
        this.buffMC = ObjectPool.pop("egret.MovieClip");
        this.startLoad();
    };
    EffectComponent.prototype.stop = function () {
        _super.prototype.stop.call(this);
        this.buffMC = null;
        this.mcParent = null;
    };
    EffectComponent.prototype.update = function (advancedTime) {
        _super.prototype.update.call(this, advancedTime);
        if (this.entity.isSkillBuff && !this.buffMC.parent) {
            this.startMc();
        }
        else if (!this.entity.isSkillBuff && this.buffMC.parent) {
            this.stopMc();
        }
        var boxManage = this.entity.gameView.surfaceView;
        boxManage.hitBox(this.entity);
        boxManage.hitEnergy(this.entity);
        var randomSkill = RpgGameSkills.getSingtonInstance();
        randomSkill.startHitTest(this.entity);
    };
    EffectComponent.prototype.adjustAnchor = function (mc) {
        if (this.mcName == "30008") {
            App.AnchorUtils.setAnchorX(mc, 0.7);
            App.AnchorUtils.setAnchorY(mc, 0.9);
        }
        else if (this.mcName == "30010") {
            App.AnchorUtils.setAnchorX(mc, 1);
            App.AnchorUtils.setAnchorY(mc, 1.2);
        }
        else if (this.mcName == "30011") {
            App.AnchorUtils.setAnchorX(mc, 0.5);
            App.AnchorUtils.setAnchorY(mc, 1);
        }
    };
    EffectComponent.prototype.startMc = function () {
        this.adjustAnchor(this.buffMC);
        this.mcParent.addChild(this.buffMC);
        if (this.entity.id == 20002) {
            this.buffNum = RpgGameSkill.sk30008;
        }
        else if (this.entity.id == 20004) {
            this.buffNum = RpgGameSkill.sk30010;
        }
        else if (this.entity.id == 20005) {
            this.buffNum = RpgGameSkill.sk30011;
        }
        this.entity.buffNum = this.buffNum;
    };
    EffectComponent.prototype.stopMc = function () {
        App.DisplayUtils.removeFromParent(this.buffMC);
        this.entity.buffNum = RpgGameSkill.sk30000;
    };
    EffectComponent.prototype.complateAction = function () {
        this.stopMc();
    };
    EffectComponent.prototype.startLoad = function () {
        Log.debug(this.entity.skillPath + this.mcName);
        if (!this.mcName)
            return;
        RpgGameRes.loadAvatar(this.entity.skillPath, this.mcName, this.onLoadComplate, this);
    };
    EffectComponent.prototype.onLoadComplate = function () {
        var avatarResName = this.mcName;
        var data = RES.getRes("avatar_" + avatarResName + ".json");
        var texture = RES.getRes("avatar_" + avatarResName + ".png");
        var mcFactory = new egret.MovieClipDataFactory(data, texture);
        this.buffMC.movieClipData = mcFactory.generateMovieClipData(avatarResName);
        this.buffMC.gotoAndPlay("buff", -1);
    };
    return EffectComponent;
}(Component));
__reflect(EffectComponent.prototype, "EffectComponent");
/**
 * Created by yangsong on 2017/10/11.
 */
var HeadComponent = (function (_super) {
    __extends(HeadComponent, _super);
    function HeadComponent() {
        var _this = _super.call(this) || this;
        //?????????
        _this.maxSkillNumber = 3; //??????????????????
        _this.skillNumber = 0; //??????????????????
        //????????????
        _this.level = 1;
        _this.exp = 0;
        _this.attackDis = 6; //????????????
        _this.speed = 0; //????????????
        _this.enerty = 0; //???????????????
        _this.ski1add = 0.01; //??????????????????
        _this.ski2add = 0.01; //??????????????????
        _this.buffname = "??????"; //buff??????
        _this.buffstatus = 0; //0??? 1 ?????? 2??????
        _this.buffnumber = 0; //buff??????
        return _this;
    }
    HeadComponent.prototype.start = function () {
        _super.prototype.start.call(this);
        this.fightconf = MonsterConfiger.getMosterFightConfig();
        this.timer = new egret.Timer(1500);
        this.timer.addEventListener(egret.TimerEvent.TIMER, this.updateTimer, this);
        this.timer.start();
        var avatarComponent = this.entity.getComponent(ComponentType.Avatar);
        this.createNameTxt(avatarComponent.body);
        this.createTitleTxt(avatarComponent.body);
        this.createMain(avatarComponent.body);
        this.createBufferView(avatarComponent.body);
        this.mcParent = avatarComponent.body;
    };
    HeadComponent.prototype.createBufferView = function (parent) {
        if (!this.buffGroup) {
            this.buffGroup = new eui.Group();
            this.buffGroup.x = 100;
            this.buffGroup.y = -170;
            this.buffGroup.width = 70;
            this.buffGroup.height = 70;
        }
        parent.addChild(this.buffGroup);
        if (!this.buffLabel) {
            this.buffLabel = new eui.Label();
            this.buffLabel.x = 0;
            this.buffLabel.y = 12;
            this.buffLabel.size = 24;
            this.buffLabel.width = 50;
            this.buffLabel.text = "??????";
        }
        this.buffGroup.addChild(this.buffLabel);
        if (!this.buffImage) {
            this.buffImage = new eui.Image();
            this.buffImage.x = 50;
            this.buffImage.y = 15;
            this.buffImage.width = 15;
            this.buffImage.height = 18;
            this.buffImage.source = "arrows_up_png";
        }
        ;
        this.buffGroup.addChild(this.buffImage);
    };
    HeadComponent.prototype.updateTimer = function () {
        this.skillNumber++;
        if (this.skillNumber >= 3) {
            this.skillNumber = 3;
            this.timer.stop();
        }
        if (!this.entity)
            return;
        this.entity.propertyData.skillbooks = this.skillNumber;
    };
    //UI??????
    HeadComponent.prototype.createMain = function (parent) {
        this.level = 1;
        this.buffnumber = this.entity.propertyData.buffnumber;
        this.hp = this.entity.propertyData.hp;
        this.maxBlood = this.entity.propertyData.hp;
        this.skillp = this.entity.propertyData.skillp;
        this.skillh = this.entity.propertyData.skillh;
        this.attackDis = this.entity.propertyData.attackDis;
        this.speed = this.entity.speed;
        if (!this.bloodgroup) {
            this.bloodgroup = new eui.Group();
            this.bloodgroup.width = 200;
            this.bloodgroup.height = 30;
            this.bloodgroup.x = -100;
            this.bloodgroup.y = -167;
        }
        parent.addChild(this.bloodgroup);
        if (!this.bottomImage) {
            this.bottomImage = new eui.Image();
            this.bottomImage.source = "bloodBar_1_png";
            this.bottomImage.width = 200;
            this.bottomImage.height = 30;
        }
        this.bloodgroup.addChild(this.bottomImage);
        if (!this.bloodImage) {
            this.bloodImage = new eui.Image();
            this.bloodImage.source = "bloodBar_4_png";
            this.bloodImage.width = 200;
            this.bloodImage.height = 30;
        }
        this.bloodgroup.addChild(this.bloodImage);
        this.skillNumber = this.entity.propertyData.skillbooks;
        if (this.entity.isPlayer) {
            if (!this.skillbooksGroup) {
                this.skillbooksGroup = new eui.Group();
                this.skillbooksGroup.x = -94;
                this.skillbooksGroup.y = -142;
                this.skillbooksGroup.width = 188;
                this.skillbooksGroup.height = 5;
            }
            parent.addChild(this.skillbooksGroup);
            if (!this.s1) {
                this.s1 = new eui.Image();
                this.s1.source = "skillpoint_light_png";
                this.s1.x = 0;
                this.s1.y = 0;
                this.s1.width = 62;
                this.s1.height = 10;
            }
            ;
            this.skillbooksGroup.addChild(this.s1);
            if (!this.s2) {
                this.s2 = new eui.Image();
                this.s2.source = "skillpoint_light_png";
                this.s2.x = 62;
                this.s2.y = 0;
                this.s2.width = 62;
                this.s2.height = 10;
            }
            ;
            this.skillbooksGroup.addChild(this.s2);
            if (!this.s3) {
                this.s3 = new eui.Image();
                this.s3.source = "skillpoint_light_png";
                this.s3.x = 125;
                this.s3.y = 0;
                this.s3.width = 61;
                this.s3.height = 10;
            }
            ;
            this.skillbooksGroup.addChild(this.s3);
        }
    };
    HeadComponent.prototype.createNameTxt = function (parent) {
        this.nameTxt = new egret.TextField();
        this.nameTxt.size = 24;
        this.nameTxt.textColor = this.entity.isPlayer ? 0x66ff62 : 0xf83947;
        this.nameTxt.width = 100;
        this.nameTxt.height = 25;
        this.nameTxt.textAlign = egret.HorizontalAlign.CENTER;
        this.nameTxt.text = this.entity.propertyData.name;
        this.nameTxt.y = -190;
        this.nameTxt.x = 25;
        App.AnchorUtils.setAnchorX(this.nameTxt, 0.5);
        parent.addChild(this.nameTxt);
    };
    HeadComponent.prototype.createTitleTxt = function (parent) {
        this.titleTxt = new egret.TextField();
        this.titleTxt.size = 24;
        this.titleTxt.textColor = 0xffbc1c;
        this.titleTxt.width = 50;
        this.titleTxt.height = 25;
        this.titleTxt.textAlign = egret.HorizontalAlign.CENTER;
        this.titleTxt.text = "Lv" + this.level;
        this.titleTxt.y = -190;
        this.titleTxt.x = -50;
        App.AnchorUtils.setAnchorX(this.titleTxt, 0.5);
        parent.addChild(this.titleTxt);
    };
    HeadComponent.prototype.stop = function () {
        _super.prototype.stop.call(this);
        App.DisplayUtils.removeFromParent(this.nameTxt);
        this.nameTxt = null;
        App.DisplayUtils.removeFromParent(this.titleTxt);
        this.titleTxt = null;
    };
    HeadComponent.prototype.update = function (advancedTime) {
        _super.prototype.update.call(this, advancedTime);
        this.updateBuff();
        this.updateEffer();
        this.updateLevel();
        this.hp = this.entity.propertyData.hp;
        if (this.maxBlood <= 0) {
            return;
        }
        if (this.hp <= 0) {
            //Log.debug("????????????"); 
            if (this.entity.isPlayer) {
                App.MessageCenter.dispatch(EventNames.Fight_End, this.entity.killNum);
                App.ViewManager.close(ViewConst.RpgGame);
                App.ViewManager.destroy(ViewConst.RpgGame);
                App.SceneManager.runScene(SceneConsts.UI);
                App.ViewManager.open(ViewConst.SettlementView);
            }
            return;
        }
        var rate = this.hp / this.maxBlood;
        this.bloodImage.width = this.bottomImage.width * rate;
        this.bottomImage.x = 0;
        this.bottomImage.y = 0;
        if (rate > 0.7) {
            this.bloodImage.source = "bloodBar_4_png";
        }
        else if (rate <= 0.7 && rate > 0.3) {
            this.bloodImage.source = "bloodBar_3_png";
        }
        else {
            this.bloodImage.source = "bloodBar_2_png";
        }
        if (!this.entity.isPlayer)
            return;
        this.skillNumber = this.entity.propertyData.skillbooks;
        if (this.skillNumber >= 3) {
            this.skillNumber = 3;
            this.s1.source = "skillpoint_light_png";
            this.s2.source = "skillpoint_light_png";
            this.s3.source = "skillpoint_light_png";
        }
        else if (this.skillNumber == 0) {
            this.skillNumber = 0;
            this.s1.source = "skillpoint_gray_png";
            this.s2.source = "skillpoint_gray_png";
            this.s3.source = "skillpoint_gray_png";
            Log.debug("???????????? = " + this.skillNumber);
        }
        else if (this.skillNumber == 1) {
            this.s1.source = "skillpoint_light_png";
            this.s2.source = "skillpoint_gray_png";
            this.s3.source = "skillpoint_gray_png";
        }
        else if (this.skillNumber == 2) {
            this.s1.source = "skillpoint_light_png";
            this.s2.source = "skillpoint_light_png";
            this.s3.source = "skillpoint_gray_png";
        }
        if (this.timer.stop && this.skillNumber < 3) {
            this.timer.start();
        }
    };
    //????????????
    HeadComponent.prototype.updateBuff = function () {
        this.buffnumber = this.entity.propertyData.buffnumber;
        var bf = RpgBuffConfig.getBuff(this.buffnumber);
        this.buffstatus = bf["buffstatus"];
        if (this.buffstatus == 0) {
            this.buffGroup.visible = false;
        }
        else if (this.buffstatus == 1) {
            this.buffname = bf["buffname"];
            this.buffGroup.visible = true;
            this.buffLabel.text = this.buffname;
            this.buffImage.source = "arrows_up_png";
        }
        else {
            this.buffname = bf["buffname"];
            this.buffGroup.visible = true;
            this.buffLabel.text = this.buffname;
            this.buffImage.source = "arrows_down_png";
        }
    };
    HeadComponent.prototype.updateEffer = function () {
        if (this.buffnumber == 0 || this.buffnumber == 4) {
            this.entity.speed = this.speed;
            this.entity.propertyData.attackDis = this.attackDis;
            this.entity.propertyData.skillp = Math.floor(this.skillp + this.skillp * 0.01 * this.level);
            this.entity.propertyData.skillh = Math.floor(this.skillh + this.skillh * 0.01 * this.level);
            return;
        }
        ;
        if (this.buffnumber == RpgBoxBuff.buff1) {
            this.entity.propertyData.skillp += Math.floor(this.entity.propertyData.skillp * 0.1);
            this.entity.propertyData.skillh += Math.floor(this.entity.propertyData.skillh * 0.1);
        }
        else if (this.buffnumber == RpgBoxBuff.buff2) {
            this.entity.propertyData.attackDis = this.attackDis + 2;
        }
        else if (this.buffnumber == RpgBoxBuff.buff3) {
            this.entity.speed = this.speed + this.speed * 0.1;
        }
        else if (this.buffnumber == RpgBoxBuff.buff5) {
            this.entity.propertyData.skillp -= Math.floor(this.entity.propertyData.skillp * 0.1);
            this.entity.propertyData.skillh -= Math.floor(this.entity.propertyData.skillh * 0.1);
        }
        else if (this.buffnumber == RpgBoxBuff.buff6) {
            this.entity.propertyData.attackDis = this.attackDis - 2;
        }
        else if (this.buffnumber == RpgBoxBuff.buff7) {
            this.entity.speed = this.speed - this.speed * 0.1;
        }
        else if (this.buffnumber == RpgBoxBuff.buff8) {
            var harm = Math.floor(this.maxBlood * 0.2);
            this.entity.gameView.showHpChange(this.entity, -harm);
        }
    };
    HeadComponent.prototype.updateLevel = function () {
        if (this.level >= 10 || !this.entity)
            return;
        //????????????
        this.exp = 50 * this.entity.killNum + this.entity.propertyData.enerty;
        var levelConf = this.getCurrentConf();
        var exp1 = levelConf["exp"];
        if (this.exp >= exp1) {
            this.level++;
            this.entity.propertyData.hp = this.maxBlood; //?????????
            //??????????????????????????????????????????
            levelConf = this.getCurrentConf();
            this.ski1add = levelConf["harm"];
            this.ski2add = levelConf["harm"];
            this.entity.propertyData.skillp = Math.floor(this.skillp + this.skillp * this.ski1add);
            this.entity.propertyData.skillh = Math.floor(this.skillh + this.skillh * this.ski2add);
            var mcPath = "https://yqllm.wangqucc.com/gameres/dld/resource/assets/rpgGame/";
            var mcName = "upgrade_50";
            RpgGameRes.loadAvatar(mcPath, mcName, this.onLoadComplate, this);
        }
        this.titleTxt.text = "Lv" + this.level;
    };
    HeadComponent.prototype.onLoadComplate = function () {
        var mc = new egret.MovieClip();
        App.AnchorUtils.setAnchorX(mc, 0.7);
        App.AnchorUtils.setAnchorY(mc, 1);
        this.mcParent.addChild(mc);
        var avatarResName = "upgrade_50";
        var data = RES.getRes("avatar_" + avatarResName + ".json");
        var texture = RES.getRes("avatar_" + avatarResName + ".png");
        var mcFactory = new egret.MovieClipDataFactory(data, texture);
        mc.movieClipData = mcFactory.generateMovieClipData("upgrade");
        mc.gotoAndPlay("release", -1);
        egret.setTimeout(function () {
            this.mcParent.removeChild(mc);
        }, this, 500);
    };
    HeadComponent.prototype.getCurrentConf = function () {
        var ob;
        for (var i = 0; i < this.fightconf.length; i++) {
            var k = this.fightconf[i];
            if (k["level"] == this.level) {
                ob = k;
            }
        }
        return ob;
    };
    return HeadComponent;
}(Component));
__reflect(HeadComponent.prototype, "HeadComponent");
/**
 * Create by weixiaobao on 2019/7/9
 */
var MonsterBattleComponent = (function (_super) {
    __extends(MonsterBattleComponent, _super);
    function MonsterBattleComponent() {
        return _super.call(this) || this;
    }
    MonsterBattleComponent.prototype.start = function () {
        _super.prototype.start.call(this);
    };
    MonsterBattleComponent.prototype.stop = function () {
        _super.prototype.stop.call(this);
        this.isAttacking = false;
        this.attackTime = null;
    };
    MonsterBattleComponent.prototype.update = function (advancedTime) {
        _super.prototype.update.call(this, advancedTime);
        if (!this.entity.battleObj) {
            return;
        }
        if (!this.isAttacking) {
            if (this.canAttack()) {
                this.startAttack();
            }
        }
        else {
            if (!this.canAttack()) {
                this.stopAttack();
            }
            else {
                this.continueAttack();
            }
        }
    };
    MonsterBattleComponent.prototype.canAttack = function () {
        var attackDis = this.entity.propertyData.attackDis;
        return Math.abs(this.entity.battleObj.col - this.entity.col) <= attackDis
            && Math.abs(this.entity.battleObj.row - this.entity.row) <= attackDis;
    };
    MonsterBattleComponent.prototype.stopAttack = function () {
        this.isAttacking = false;
        this.attackTime = null;
        this.entity.battleObj = null;
    };
    MonsterBattleComponent.prototype.startAttack = function () {
        this.isAttacking = true;
        this.attackTime = egret.getTimer();
        this.entity.action = Action.Attack;
        this.entity.resetTimer();
        if (this.entity.battleObj) {
            this.entity.dir = RpgGameUtils.computeGameObjDir(this.entity.x, this.entity
                .y, this.entity.battleObj.x, this.entity.battleObj.y);
            var defenceObj = this.entity.battleObj;
            if (!defenceObj.battleObj) {
                defenceObj.battleObj = this.entity;
                defenceObj.path = null;
            }
            egret.setTimeout(this.dealHarm, this, 500);
        }
        else {
            this.entity.battleObj = null;
        }
    };
    MonsterBattleComponent.prototype.dealHarm = function () {
        if (!this.entity) {
            return;
        }
        var defenceObj = this.entity.battleObj;
        if (!defenceObj || !defenceObj.propertyData) {
            return;
        }
        //???????????????
        defenceObj.resetTimer();
        var harm;
        var skillp = this.entity.propertyData.skillp;
        if (this.entity.isSkillBuff) {
            if (defenceObj.buffNum == RpgGameSkill.sk30008) {
                harm = skillp - skillp * 0.2;
            }
            else if (defenceObj.buffNum == RpgGameSkill.sk30010) {
                harm = skillp - skillp * 0.1;
                this.entity.speed -= this.entity.speed * 0.2;
                this.entity.propertyData.buffnumber = RpgBoxBuff.buff7;
                egret.setTimeout(function () {
                    if (this.entity) {
                        this.entity.propertyData.buffnumber = RpgBoxBuff.buff0;
                    }
                }, this, 10000);
            }
            else if (defenceObj.buffNum == RpgGameSkill.sk30011) {
                harm = skillp - skillp * 0.15;
            }
            else {
                harm = skillp;
            }
        }
        else {
            harm = skillp;
        }
        defenceObj.propertyData.hp = Math.max(0, defenceObj.propertyData.hp - harm);
        //if(defenceObj instanceof RpgMonster){
        this.entity.gameView.showHpChange(defenceObj, -harm);
        // }else{
        // 	this.entity.gameView.showHpChange(defenceObj,-harm,0x00FF00);
        // }
        if (defenceObj.propertyData.hp == 0) {
            if (defenceObj instanceof RpgMonster) {
                if (this.entity) {
                    this.entity.battleObj = null;
                    this.entity.gameView.removeMonster(defenceObj);
                    this.entity.killNum += 1; //?????????+1
                    this.entity.gameView.refreshRankList();
                }
            }
        }
        else {
            if (defenceObj.action == Action.Stand) {
                defenceObj.action = Action.Attacked;
            }
        }
    };
    MonsterBattleComponent.prototype.continueAttack = function () {
        var attackInterval = this.entity.propertyData.attackInterval;
        var nowTime = egret.getTimer();
        if (nowTime - this.attackTime >= attackInterval) {
            this.startAttack();
        }
    };
    return MonsterBattleComponent;
}(Component));
__reflect(MonsterBattleComponent.prototype, "MonsterBattleComponent");
/**
 * Created by yangsong on 2017/10/12.
 */
var MoveComponent = (function (_super) {
    __extends(MoveComponent, _super);
    function MoveComponent() {
        return _super.call(this) || this;
    }
    MoveComponent.prototype.start = function () {
        _super.prototype.start.call(this);
        this.astar = new SilzAstar(this.entity.gameView.getBlocksData());
    };
    MoveComponent.prototype.stop = function () {
        _super.prototype.stop.call(this);
        this.endX = null;
        this.endY = null;
        this.radian = null;
        this.distance = null;
        this.node = null;
    };
    MoveComponent.prototype.update = function (advancedTime) {
        _super.prototype.update.call(this, advancedTime);
        if (this.entity.pathChange) {
            this.entity.pathChange = false;
            if (this.node) {
                this.entity.col = this.node.x;
                this.entity.row = this.node.y;
            }
            this.node = null;
        }
        if (!this.node) {
            if (!this.entity.path) {
                return;
            }
            if (!this.entity.path.length) {
                this.entity.path = null;
                return;
            }
            this.nextNode();
            if (this.node) {
                this.move(advancedTime);
            }
        }
        else {
            this.move(advancedTime);
        }
    };
    MoveComponent.prototype.move = function (advancedTime) {
        var useSpeed = this.entity.speed / (1000 / 60) * advancedTime;
        var speedX = Math.cos(this.radian) * useSpeed;
        var speedY = Math.sin(this.radian) * useSpeed;
        this.entity.x += speedX;
        this.entity.y += speedY;
        this.distance -= useSpeed;
        if (this.distance <= 0) {
            this.entity.col = this.node.x;
            this.entity.row = this.node.y;
            if (!this.entity.path || !this.entity.path.length) {
                this.entity.x = this.endX;
                this.entity.y = this.endY;
            }
            this.node = null;
        }
    };
    MoveComponent.prototype.nextNode = function () {
        this.node = this.entity.path.shift();
        var p = RpgGameUtils.convertCellToXY(this.node.x, this.node.y);
        this.endX = p.x;
        this.endY = p.y;
        this.radian = App.MathUtils.getRadian2(this.entity.x, this.entity.y, this.endX, this.endY);
        this.distance = App.MathUtils.getDistance(this.entity.x, this.entity.y, this.endX, this.endY);
        this.entity.dir = RpgGameUtils.computeGameObjDir(this.entity.x, this.entity.y, this.endX, this.endY);
        // if (this.entity.isPlayer) {
        //     Log.debug(" nextNode entity dir = :",this.entity.dir);
        // }   
    };
    return MoveComponent;
}(Component));
__reflect(MoveComponent.prototype, "MoveComponent");
/**
 * Created by yangsong on 2017/10/13.
 */
var SortComponent = (function (_super) {
    __extends(SortComponent, _super);
    function SortComponent() {
        return _super.call(this) || this;
    }
    SortComponent.prototype.start = function () {
        _super.prototype.start.call(this);
        this.dealInterval = 500;
    };
    SortComponent.prototype.stop = function () {
        _super.prototype.stop.call(this);
    };
    SortComponent.prototype.update = function (advancedTime) {
        _super.prototype.update.call(this, advancedTime);
        this.sortGameObjs();
    };
    SortComponent.prototype.sortGameObjs = function () {
        this.entity.gameView.getGameObjcetLayer().$children.sort(this.sortF);
    };
    SortComponent.prototype.sortF = function (d1, d2) {
        if (d1.y > d2.y) {
            return 1;
        }
        else if (d1.y < d2.y) {
            return -1;
        }
        else {
            return 0;
        }
    };
    return SortComponent;
}(Component));
__reflect(SortComponent.prototype, "SortComponent");
/**
 * Created by yangsong on 2017/10/11.
 */
var Dir;
(function (Dir) {
    Dir[Dir["Top"] = 0] = "Top";
    Dir[Dir["TopRight"] = 1] = "TopRight";
    Dir[Dir["Right"] = 2] = "Right";
    Dir[Dir["BottomRight"] = 3] = "BottomRight";
    Dir[Dir["Bottom"] = 4] = "Bottom";
    Dir[Dir["BottomLeft"] = 5] = "BottomLeft";
    Dir[Dir["Left"] = 6] = "Left";
    Dir[Dir["TopLeft"] = 7] = "TopLeft";
})(Dir || (Dir = {}));
var Action = (function () {
    function Action() {
    }
    Action.Prepare = "prepare";
    Action.Attack = "attack";
    Action.Attacked = "attacked";
    Action.Die = "die";
    Action.Move = "move";
    Action.Stand = "stand";
    return Action;
}());
__reflect(Action.prototype, "Action");
var RpgMovieClip = (function (_super) {
    __extends(RpgMovieClip, _super);
    function RpgMovieClip() {
        var _this = _super.call(this) || this;
        _this.McFrameTime = 1000 / 8;
        return _this;
    }
    RpgMovieClip.prototype.setBitmap = function (texture, scaleX) {
        this.texture = texture;
        this.scaleX = scaleX;
        App.AnchorUtils.setAnchorX(this, 0.5);
        App.AnchorUtils.setAnchorY(this, 1);
    };
    RpgMovieClip.prototype.setDefault = function (resName) {
        this.setBitmap(RES.getRes(resName), 1);
    };
    RpgMovieClip.prototype.setMcData = function (mcData) {
        this.mcData = mcData;
    };
    RpgMovieClip.prototype.runAction = function (advancedTime) {
        if (!this.mcData) {
            return;
        }
        this.currFrameTime += advancedTime;
        if (this.currFrameTime >= this.McFrameTime) {
            this.currFrameTime = 0;
            this.currFrame++;
            if (this.currFrame > this.endFrame) {
                this.currFrame = this.startFrame;
                this.currPlayNum++;
            }
            if (this.totalPlayNum && this.currPlayNum >= this.totalPlayNum) {
                this.complateAction && this.complateAction.apply(this.complateActionObj);
            }
            else {
                var bitmapTexture = this.mcData.getTextureByFrame(this.currFrame);
                this.setBitmap(bitmapTexture, this.scaleX);
            }
        }
    };
    RpgMovieClip.prototype.gotoAction = function (gotoAction, gotoDir, cover) {
        if (cover === void 0) { cover = false; }
        if (!this.mcData || gotoDir == undefined) {
            return;
        }
        if (!cover) {
            if (this.currAction == gotoAction && this.currDir == gotoDir) {
                return;
            }
        }
        var totalPlayNum = 0; //????????????
        if (gotoAction == Action.Attack
            || gotoAction == Action.Attacked
            || gotoAction == Action.Die) {
            totalPlayNum = 1;
        }
        //0??? 1?????? 2??? 3?????? 4???
        var dir;
        var scaleX;
        if (gotoDir == Dir.Bottom) {
            dir = 0;
            scaleX = 1;
        }
        else if (gotoDir == Dir.BottomRight) {
            dir = 1;
            scaleX = 1;
        }
        else if (gotoDir == Dir.Right) {
            dir = 2;
            scaleX = 1;
        }
        else if (gotoDir == Dir.TopRight) {
            dir = 3;
            scaleX = 1;
        }
        else if (gotoDir == Dir.Top) {
            dir = 4;
            scaleX = 1;
        }
        else if (gotoDir == Dir.TopLeft) {
            dir = 3;
            scaleX = -1;
        }
        else if (gotoDir == Dir.Left) {
            dir = 2;
            scaleX = -1;
        }
        else if (gotoDir == Dir.BottomLeft) {
            dir = 1;
            scaleX = -1;
        }
        var actionName = gotoAction + "_" + dir;
        var currLabel;
        for (var i = 0; i < this.mcData.labels.length; i++) {
            if (actionName == this.mcData.labels[i].name) {
                //Log.debug("this.mcData.labels.length ==" + i);
                currLabel = this.mcData.labels[i];
            }
        }
        if (this.currAction == gotoAction && !cover) {
            this.currFrame = currLabel.frame + (this.currFrame - this.startFrame);
        }
        else {
            if (!currLabel)
                return;
            this.currFrame = currLabel.frame;
            this.currFrameTime = 0;
        }
        this.startFrame = currLabel.frame;
        this.endFrame = currLabel.end;
        this.currAction = gotoAction;
        this.currDir = gotoDir;
        this.totalPlayNum = totalPlayNum;
        this.currPlayNum = 0;
        var bitmapTexture = this.mcData.getTextureByFrame(this.currFrame);
        this.setBitmap(bitmapTexture, scaleX);
    };
    RpgMovieClip.prototype.setComplateAction = function (complateAction, complateActionObj) {
        this.complateAction = complateAction;
        this.complateActionObj = complateActionObj;
    };
    RpgMovieClip.prototype.destroy = function () {
        App.DisplayUtils.removeFromParent(this);
        ObjectPool.push(this);
        this.texture = null;
        this.mcData = null;
        this.currAction = null;
        this.currDir = null;
        this.currFrame = null;
        this.startFrame = null;
        this.endFrame = null;
        this.currFrameTime = null;
        this.totalPlayNum = null;
        this.currPlayNum = null;
        this.complateAction = null;
        this.complateActionObj = null;
    };
    RpgMovieClip.prototype.getCurrAction = function () {
        return this.currAction;
    };
    RpgMovieClip.prototype.getCurrDir = function () {
        return this.currDir;
    };
    return RpgMovieClip;
}(egret.Bitmap));
__reflect(RpgMovieClip.prototype, "RpgMovieClip");
var RpgBoxBuff;
(function (RpgBoxBuff) {
    RpgBoxBuff[RpgBoxBuff["buff0"] = 0] = "buff0";
    RpgBoxBuff[RpgBoxBuff["buff1"] = 1] = "buff1";
    RpgBoxBuff[RpgBoxBuff["buff2"] = 2] = "buff2";
    RpgBoxBuff[RpgBoxBuff["buff3"] = 3] = "buff3";
    RpgBoxBuff[RpgBoxBuff["buff4"] = 4] = "buff4";
    RpgBoxBuff[RpgBoxBuff["buff5"] = 5] = "buff5";
    RpgBoxBuff[RpgBoxBuff["buff6"] = 6] = "buff6";
    RpgBoxBuff[RpgBoxBuff["buff7"] = 7] = "buff7";
    RpgBoxBuff[RpgBoxBuff["buff8"] = 8] = "buff8"; //??? ??????????????????3??????????????????????????????20%????????????????????????
})(RpgBoxBuff || (RpgBoxBuff = {}));
var RpgBuffConfig = (function () {
    function RpgBuffConfig() {
    }
    RpgBuffConfig.getBuff = function (st) {
        var bfs = RpgBuffConfig.configBuffs();
        for (var i = 0; i < bfs.length; i++) {
            var ob = bfs[i];
            if (ob["buffnumber"] == st) {
                return ob;
            }
        }
    };
    RpgBuffConfig.configBuffs = function () {
        var buffs = [
            {
                buffnumber: RpgBoxBuff.buff0,
                buffname: "",
                buffstatus: 0
            },
            {
                buffnumber: RpgBoxBuff.buff1,
                buffname: "??????",
                buffstatus: 1
            },
            {
                buffnumber: RpgBoxBuff.buff2,
                buffname: "??????",
                buffstatus: 1
            },
            {
                buffnumber: RpgBoxBuff.buff3,
                buffname: "??????",
                buffstatus: 1
            },
            {
                buffnumber: RpgBoxBuff.buff4,
                buffname: "??????",
                buffstatus: 1
            },
            {
                buffnumber: RpgBoxBuff.buff5,
                buffname: "??????",
                buffstatus: 2
            },
            {
                buffnumber: RpgBoxBuff.buff6,
                buffname: "??????",
                buffstatus: 2
            },
            {
                buffnumber: RpgBoxBuff.buff7,
                buffname: "??????",
                buffstatus: 2
            },
            {
                buffnumber: RpgBoxBuff.buff8,
                buffname: "",
                buffstatus: 0
            }
        ];
        return buffs;
    };
    return RpgBuffConfig;
}());
__reflect(RpgBuffConfig.prototype, "RpgBuffConfig");
/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super.call(this) || this;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Main.prototype.onAddToStage = function (event) {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        //?????????????????????????????????
        egret.registerImplementation("eui.IAssetAdapter", new AssetAdapter());
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
        App.StageUtils.setFrameRate(60);
        //????????????(????????????) iphonex 2436x1125 1334x750
        App.StageUtils.startFullscreenAdaptation(1334, 750, this.onResize);
        //????????????
        this.stage.orientation = egret.OrientationMode.LANDSCAPE;
        //??????????????????
        App.StageUtils.setScaleMode(egret.StageScaleMode.EXACT_FIT);
        //?????????
        this.initLifecycle();
        this.initScene();
        //????????????????????????
        this.loadResConfig();
    };
    Main.prototype.initLifecycle = function () {
        egret.lifecycle.addLifecycleListener(function (context) {
            // custom lifecycle plugin
        });
        egret.lifecycle.onPause = function () {
            egret.ticker.pause();
            App.TimerManager.pause();
            App.TweenUtils.pause();
        };
        egret.lifecycle.onResume = function () {
            egret.ticker.resume();
            App.TimerManager.resume();
            App.TweenUtils.resume();
        };
    };
    Main.prototype.onResize = function () {
        //App.ControllerManager.applyFunc(ControllerConst.RpgGame, RpgGameConst.GameResize);
    };
    Main.prototype.loadResConfig = function () {
        //?????????Resource???????????????
        // App.ResourceUtils.addConfig("resource/default.res.json", "resource/");
        // App.ResourceUtils.addConfig("resource/resource_core.json", "resource/");
        // App.ResourceUtils.addConfig("resource/resource_ui.json", "resource/");
        // App.ResourceUtils.addConfig("resource/resource_battle.json", "resource/");
        // App.ResourceUtils.addConfig("resource/resource_rpg.json", "resource/");
        egret.ImageLoader.crossOrigin = "anonymous"; //????????????????????????
        App.ResourceUtils.addConfig("default.res.json", "https://yqllm.wangqucc.com/gameres/dld/resource/");
        App.ResourceUtils.addConfig("resource_core.json", "https://yqllm.wangqucc.com/gameres/dld/resource/");
        App.ResourceUtils.addConfig("resource_ui.json", "https://yqllm.wangqucc.com/gameres/dld/resource/");
        App.ResourceUtils.addConfig("resource_battle.json", "https://yqllm.wangqucc.com/gameres/dld/resource/");
        App.ResourceUtils.addConfig("resource_rpg.json", "https://yqllm.wangqucc.com/gameres/dld/resource/");
        App.ResourceUtils.loadConfig(this.onConfigComplete, this);
    };
    /**
     * ????????????????????????,???????????????preload????????????
     */
    Main.prototype.onConfigComplete = function () {
        egret.ImageLoader.crossOrigin = "anonymous"; //????????????????????????
        //??????????????????????????????,??????????????????????????????????????????????????????
        var theme = new eui.Theme("resource/default.thm.json", this.stage);
        // EXML.prefixURL = "https://yqllm.wangqucc.com/gameres/dld/";//??????????????????,???????????????????????????ip??????
        // // load skin theme configuration file, you can manually modify the file. And replace the default skin.
        // //??????????????????????????????,??????????????????????????????????????????????????????
        // let theme = new eui.Theme("https://yqllm.wangqucc.com/gameres/dld/resource/default.thm.json", this.stage);//???????????????????????????ip??????
        theme.addEventListener(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);
    };
    /**
     * ????????????????????????
     */
    Main.prototype.onThemeLoadComplete = function () {
        //???????????????
        this.initModule();
        //????????????????????????
        App.SceneManager.runScene(SceneConsts.LOADING);
        //??????websocket??????
        new ProtoBufTest();
        App.MessageCenter.addListener(EventNames.Role_Choose, function (nick) {
            RoleInfoConst.rolename = nick;
            if (nick != null) {
                var nickname = nick;
                var roleManager = RoleInfoManager.getSingtonInstance();
                roleManager.getRoleInfo(nickname);
            }
        }, this);
        //??????????????????????????????
        App.ViewManager.open(ViewConst.Login);
    };
    /**
     * ?????????????????????
     */
    Main.prototype.initScene = function () {
        App.SceneManager.register(SceneConsts.LOADING, new LoadingScene());
        App.SceneManager.register(SceneConsts.UI, new UIScene());
        App.SceneManager.register(SceneConsts.Game, new GameScene());
        App.SceneManager.register(SceneConsts.RpgGame, new RpgGameScene());
    };
    /**
     * ?????????????????????
     */
    Main.prototype.initModule = function () {
        App.ControllerManager.register(ControllerConst.Loading, new LoadingController());
        App.ControllerManager.register(ControllerConst.Loading, new LoginController());
    };
    return Main;
}(egret.DisplayObjectContainer));
__reflect(Main.prototype, "Main");
/**
 * Created by yangsong on 2017/10/13.
 */
var RpgMonster = (function (_super) {
    __extends(RpgMonster, _super);
    function RpgMonster() {
        return _super.call(this) || this;
    }
    RpgMonster.prototype.init = function (data) {
        _super.prototype.init.call(this, data);
        this.isCanUseAnger = true;
        this.addComponent(ComponentType.Aoi);
        this.addComponent(ComponentType.Ai);
        this.addComponent(ComponentType.Move);
        this.addComponent(ComponentType.AutoBattle);
        this.addComponent(ComponentType.Avatar);
        this.addComponent(ComponentType.Head);
        this.addComponent(ComponentType.Effect);
        this.addComponent(ComponentType.MonsterBattle);
        this.addComponent(ComponentType.AvatarSkill);
    };
    RpgMonster.prototype.setInCamera = function (value) {
        _super.prototype.setInCamera.call(this, value);
        //if(value){
        //this.addComponent(ComponentType.Avatar);
        // this.addComponent(ComponentType.Battle);
        //this.addComponent(ComponentType.MonsterBattle);
        //this.addComponent(ComponentType.Head);
        // } else {
        //this.removeComponent(ComponentType.Avatar);
        // this.removeComponent(ComponentType.Battle);
        //this.removeComponent(ComponentType.MonsterBattle);
        //this.removeComponent(ComponentType.Head);
        //} 
    };
    RpgMonster.prototype.destory = function () {
        _super.prototype.destory.call(this);
    };
    RpgMonster.prototype.updateTimer = function () {
        _super.prototype.updateTimer.call(this);
        //if (!this.battleObj) return;
        if (this.timer.currentCount % 10 == 0) {
            this.useAngerSkill();
        }
        else if (this.timer.currentCount % 35 == 0) {
            this.useCDSkill();
        }
        else if (this.isCanUseAnger) {
            egret.setTimeout(function () {
                this.isCanUseAnger = false;
                this.isDirection = true;
                this.useCDSkill();
            }, this, 4000);
        }
    };
    RpgMonster.prototype.useAngerSkill = function () {
        _super.prototype.useAngerSkill.call(this);
        this.isSkillBuff = true;
        egret.setTimeout(function () {
            this.isSkillBuff = false;
        }, this, 3000);
    };
    RpgMonster.prototype.useCDSkill = function () {
        _super.prototype.useCDSkill.call(this);
        this.isUsingSkill = true;
        var skillNum = this.propertyData.skill3["skillid"];
        var outTime = (skillNum == RpgGameSkill.sk30017) ? 5000 : 1000;
        egret.setTimeout(function () {
            this.isUsingSkill = false;
            this.isDirection = false;
        }, this, outTime);
    };
    return RpgMonster;
}(RpgGameObject));
__reflect(RpgMonster.prototype, "RpgMonster");
/**
 * Created by yangsong on 2017/10/11.
 */
var RpgPlayer = (function (_super) {
    __extends(RpgPlayer, _super);
    function RpgPlayer() {
        return _super.call(this) || this;
    }
    RpgPlayer.prototype.init = function (data) {
        _super.prototype.init.call(this, data);
        this.addComponent(ComponentType.Avatar);
        this.addComponent(ComponentType.AvatarSkill);
        this.addComponent(ComponentType.Head);
        this.addComponent(ComponentType.Move);
        this.addComponent(ComponentType.Camera);
        this.addComponent(ComponentType.Sort);
        this.addComponent(ComponentType.Control);
        this.addComponent(ComponentType.Battle);
        this.addComponent(ComponentType.Effect);
    };
    RpgPlayer.prototype.destory = function () {
        _super.prototype.destory.call(this);
    };
    return RpgPlayer;
}(RpgGameObject));
__reflect(RpgPlayer.prototype, "RpgPlayer");
/**
 * Created by yangsong on 2017/10/11.
 */
var RpgBackground = (function (_super) {
    __extends(RpgBackground, _super);
    function RpgBackground() {
        return _super.call(this) || this;
    }
    RpgBackground.prototype.init = function (mapId) {
        this.mapId = mapId;
        var mapData = RES.getRes("map_" + mapId + "_data.json");
        this.mapWidth = mapData.width;
        this.mapHeight = mapData.height;
        this.miniBg = new egret.Bitmap();
        this.miniBg.texture = RES.getRes("map_" + mapId + "_mini.jpg");
        this.miniBg.width = this.mapWidth;
        this.miniBg.height = this.mapHeight;
        this.addChild(this.miniBg);
        this.tiles = new RpgTiles();
        this.tiles.init(mapId);
        this.addChild(this.tiles);
    };
    RpgBackground.prototype.updateCameraPos = function ($x, $y) {
        this.tiles.updateCameraPos($x, $y);
    };
    return RpgBackground;
}(egret.DisplayObjectContainer));
__reflect(RpgBackground.prototype, "RpgBackground");
var RpgEnergyView = (function (_super) {
    __extends(RpgEnergyView, _super);
    function RpgEnergyView() {
        var _this = _super.call(this) || this;
        _this.canbeHit = false;
        _this.createImage();
        return _this;
    }
    RpgEnergyView.prototype.createImage = function () {
        if (!this.energyImage) {
            this.energyImage = new eui.Image();
            this.energyImage.source = "energy_icon_png";
            this.addChild(this.energyImage);
        }
    };
    return RpgEnergyView;
}(eui.Group));
__reflect(RpgEnergyView.prototype, "RpgEnergyView");
var RpgGameBackView = (function (_super) {
    __extends(RpgGameBackView, _super);
    function RpgGameBackView() {
        var _this = _super.call(this) || this;
        _this.skinName = "resource/skins/RpgGameBackSkin.exml";
        _this.backBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.backclick, _this);
        return _this;
    }
    RpgGameBackView.prototype.backclick = function () {
        App.SoundManager.playEffect("sound_dianji");
        App.SoundManager.stopBg();
        var alert = new RpgGameQuiteAlertView();
        alert.parView = this.parView;
        this.gameView.addChild(alert);
    };
    return RpgGameBackView;
}(eui.Component));
__reflect(RpgGameBackView.prototype, "RpgGameBackView");
var RpgGameBoxView = (function (_super) {
    __extends(RpgGameBoxView, _super);
    function RpgGameBoxView() {
        var _this = _super.call(this) || this;
        _this.boxStatus = false; // ??????1 ??????0
        _this.isDisPlay = false; //????????????
        _this.boxStatus = false;
        _this.isDisPlay = false;
        _this.makeUI();
        _this.createEffect();
        return _this;
    }
    RpgGameBoxView.prototype.dis = function () {
        this.parent.removeChild(this);
        this.isDisPlay = false;
        this.effectClip.visible = false;
    };
    RpgGameBoxView.prototype.createEffect = function () {
        if (!this.effectClip) {
            this.effectClip = new egret.MovieClip();
            this.addChild(this.effectClip);
            this.effectClip.x = -70;
            this.effectClip.y = -100;
            this.statusRole = this.random_num(1, 8);
            // this.addeffect();
        }
    };
    RpgGameBoxView.prototype.random_num = function (min, max) {
        var Range = max - min;
        var Rand = Math.random();
        return (min + Math.round(Rand * Range));
    };
    RpgGameBoxView.prototype.makeUI = function () {
        this.boxItem = new eui.Image();
        this.addChild(this.boxItem);
        if (this.boxStatus) {
            this.boxItem.source = "boxopen_png";
        }
        else {
            this.boxItem.source = "boxclose_png";
        }
    };
    RpgGameBoxView.prototype.changeStatus = function (state) {
        if (!this.isDisPlay)
            return;
        // if (!state) return;
        this.boxStatus = state;
        if (this.boxStatus) {
            this.boxItem.source = "boxopen_png";
        }
        else {
            this.boxItem.source = "boxclose_png";
        }
    };
    RpgGameBoxView.prototype.reset = function () {
        this.changeStatus(false);
        this.statusRole = this.random_num(1, 8);
    };
    RpgGameBoxView.prototype.addeffect = function () {
        var i = "";
        if (this.statusRole <= 4) {
            i = "31002";
        }
        else if (this.statusRole > 4 && this.statusRole <= 7) {
            i = "31001";
        }
        else {
            i = "31003";
        }
        var data = RES.getRes(i + "_json");
        var txtr = RES.getRes(i + "_png");
        var mcFactory = new egret.MovieClipDataFactory(data, txtr);
        var clipData = mcFactory.generateMovieClipData(i);
        this.effectClip.movieClipData = clipData;
        this.effectClip.gotoAndPlay("release", -1);
        this.effectClip.visible = true;
    };
    return RpgGameBoxView;
}(eui.Group));
__reflect(RpgGameBoxView.prototype, "RpgGameBoxView");
var RpgGameListView = (function (_super) {
    __extends(RpgGameListView, _super);
    function RpgGameListView($controller, $parent) {
        var _this = _super.call(this, $controller, $parent) || this;
        _this.state = true; //??????
        _this.skinName = "resource/skins/RpgGameListViewSkin.exml";
        return _this;
    }
    RpgGameListView.prototype.initUI = function () {
        var _this = this;
        this.actionBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.changgeTween, this);
        //????????????????????????
        this.gameView = App.ViewManager.getView(ViewConst.RpgGame);
        setTimeout(function (out) {
            _this.timerrun();
        }, 1200);
        // App.MessageCenter.addListener(EventNames.Kill_Monster,this.timerrun,this);
    };
    //???????????????
    RpgGameListView.prototype.timerrun = function () {
        var mosts = this.gameView.getAllRpgGameObject();
        mosts.sort(function (m, n) {
            if (m.killNum >= n.killNum) {
                return -1;
            }
            else {
                return 1;
            }
        });
        var lists = [];
        for (var i = 0; i < mosts.length; i++) {
            var ob = mosts[i];
            lists.push({ rank: i + 1, username: ob.propertyData.name, medal: ob.killNum });
        }
        this.createList(lists);
    };
    RpgGameListView.prototype.changgeTween = function () {
        this.state = !this.state;
        if (!this.state) {
            this.actionBtn.rotation = -180;
            this.listRankings.visible = false;
            egret.Tween.get(this.bgimg, {
                loop: false,
            })
                .to({ width: 0 }, 100)
                .wait(50)
                .call(this.onComplete1, this);
        }
        else {
            this.actionBtn.rotation = 0;
            egret.Tween.get(this.bgimg, {
                loop: false,
            })
                .to({ width: 400 }, 100)
                .wait(50)
                .call(this.onComplete, this);
        }
    };
    RpgGameListView.prototype.onComplete1 = function () {
        Log.debug("??????????????????");
    };
    RpgGameListView.prototype.onComplete = function () {
        this.listRankings.visible = true;
        ;
    };
    //?????????????????????UI
    RpgGameListView.prototype.createList = function (rankDatas) {
        var testDatas = rankDatas;
        this.listRankings.dataProvider = new eui.ArrayCollection(testDatas);
        this.listRankings.itemRenderer = RankListItem;
    };
    return RpgGameListView;
}(BaseEuiView));
__reflect(RpgGameListView.prototype, "RpgGameListView");
var RpgGameQuiteAlertView = (function (_super) {
    __extends(RpgGameQuiteAlertView, _super);
    function RpgGameQuiteAlertView() {
        var _this = _super.call(this) || this;
        _this.skinName = "resource/skins/RpgGameQuitAlertViewSkin.exml";
        _this.goOnBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.gonaction, _this);
        _this.quitBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.quitaction, _this);
        return _this;
    }
    RpgGameQuiteAlertView.prototype.gonaction = function () {
        this.parent.removeChild(this);
    };
    RpgGameQuiteAlertView.prototype.quitaction = function () {
        App.ViewManager.close(ViewConst.RpgGame);
        App.ViewManager.destroy(ViewConst.RpgGame);
        App.SceneManager.runScene(SceneConsts.UI);
    };
    return RpgGameQuiteAlertView;
}(eui.Component));
__reflect(RpgGameQuiteAlertView.prototype, "RpgGameQuiteAlertView");
var RpgGameShowView = (function () {
    function RpgGameShowView(rootView) {
        this.rgpGameTotalTime = 300;
        this.energyList = []; //???????????????  ???????????? 30s ???????????? ????????????40??? ??????????????????????????????
        this._rootView = rootView;
        this.gameView = App.ViewManager.getView(ViewConst.RpgGame);
        this.adtimeicon();
        this.alertWithStatus(true);
        this.startTimer();
        this.createBox();
        this.addBackBtn();
        this.createList();
        for (var i = 0; i < 40; i++) {
            var ent = new RpgEnergyView();
            ent.canbeHit = false;
            this.energyList.push(ent);
        }
    }
    RpgGameShowView.prototype.addBackBtn = function () {
        if (this.backBtn == null) {
            this.backBtn = new RpgGameBackView();
            this.backBtn.gameView = this._rootView;
            this.backBtn.parView = this;
            this._rootView.addChild(this.backBtn);
            this.backBtn.y = 20;
            this.backBtn.x = App.StageUtils.getWidth() - 150;
        }
    };
    RpgGameShowView.prototype.createBox = function () {
        if (this.box == null)
            this.box = new RpgGameBoxView();
    };
    RpgGameShowView.prototype.adtimeicon = function () {
        var group = new eui.Group();
        group.x = App.StageUtils.getWidth() / 2 - 189;
        group.y = 0;
        group.width = 378;
        group.height = 140;
        this._rootView.addChild(group);
        var timBg = new eui.Image();
        timBg.source = "timeBg_png";
        timBg.x = 0;
        timBg.y = -10;
        timBg.width = 378;
        timBg.height = 140;
        group.addChild(timBg);
        if (this.timeMapText == null) {
            this.timeMapText = new egret.BitmapText();
            this.timeMapText.font = RES.getRes("timefont_fnt");
            this.timeMapText.text = "05:00";
            this.timeMapText.x = 115;
            this.timeMapText.y = 50;
            group.addChild(this.timeMapText);
        }
    };
    RpgGameShowView.prototype.alertWithStatus = function (show) {
        if (this.alertBg == null) {
            this.alertBg = new eui.Group();
            this.alertBg.x = App.StageUtils.getWidth() / 2 - 310;
            this.alertBg.y = 140;
            this.alertBg.width = 620;
            this.alertBg.height = 62;
            this._rootView.addChild(this.alertBg);
            var alertbgimage = new eui.Image();
            alertbgimage.source = "rgpalertBg_png";
            alertbgimage.left = 0;
            alertbgimage.y = 0;
            this.alertBg.addChild(alertbgimage);
        }
        if (this.alertLabel == null) {
            this.alertLabel = new eui.Label();
            this.alertLabel.textAlign = "center";
            this.alertLabel.textFlow = [{ text: "??????", style: { textColor: 0xffffff } },
                { text: "10???", style: { textColor: 0x00ff00 } },
                { text: "??????????????????", style: { textColor: 0xffffff } }];
            this.alertBg.addChild(this.alertLabel);
            this.alertLabel.x = 0;
            this.alertLabel.y = 20;
            this.alertLabel.size = 20;
            this.alertLabel.width = 620;
            this.alertLabel.height = 40;
        }
        this.alertBg.visible = false;
    };
    RpgGameShowView.prototype.startTimer = function () {
        if (this.rgpTimer == null) {
            this.rgpTimer = new egret.Timer(1000, 300);
            this.rgpTimer.addEventListener(egret.TimerEvent.TIMER, this.updateTimer, this);
            this.rgpTimer.start();
        }
    };
    RpgGameShowView.prototype.updateTimer = function () {
        var _this = this;
        var m = this.rgpGameTotalTime % 60 > 9 ? "" + this.rgpGameTotalTime % 60 : "0" + this.rgpGameTotalTime % 60;
        this.timeMapText.text = "0" + parseInt("" + this.rgpGameTotalTime / 60) + ":" + m;
        this.rgpGameTotalTime--;
        if (this.rgpGameTotalTime <= 0) {
            //????????????
            this.rgpTimer.stop();
            this.rgpTimer = null;
            App.ViewManager.close(ViewConst.RpgGame);
            App.ViewManager.destroy(ViewConst.RpgGame);
            // App.SceneManager.runScene(SceneConsts.UI);
            App.ViewManager.open(ViewConst.SettlementView);
        }
        else {
            if ((this.rgpGameTotalTime - 30) % 60 == 0 || (this.rgpGameTotalTime - 10) % 60 == 0) {
                this.alertBg.visible = true;
                this.alertLabel.textFlow = [
                    { text: "??????", style: { textColor: 0xffffff } },
                    { text: this.rgpGameTotalTime % 60 + "???", style: { textColor: 0x00ff00 } },
                    { text: "??????????????????", style: { textColor: 0xffffff } }
                ];
                setTimeout(function (out) {
                    _this.alertBg.visible = false;
                }, 3000);
            }
            if ((this.rgpGameTotalTime % 60) == 0) {
                this.appearBox();
            }
            if (this.rgpGameTotalTime % 30 == 0) {
                this.appearenergys();
            }
        }
    };
    RpgGameShowView.prototype.appearBox = function () {
        if (this.box != null) {
            this.box.isDisPlay = true;
            this.box.reset();
            var col = App.RandomUtils.limitInteger(3, 10);
            var row = App.RandomUtils.limitInteger(3, 6);
            var x = col * RpgGameData.GameTileWidth;
            var y = row * RpgGameData.GameTileHeight;
            this.box.x = x;
            this.box.y = y;
            this.gameView.getGameObjcetLayer().addChild(this.box);
        }
        ;
    };
    RpgGameShowView.prototype.disBox = function () {
        this.box.dis();
    };
    RpgGameShowView.prototype.hitBox = function (player) {
        var _this = this;
        if (this.box.isDisPlay) {
            var avatarComponent = player.getComponent(ComponentType.Avatar);
            if (!avatarComponent) {
                return;
            }
            var isHit = this.hitInTwoObject(this.box, avatarComponent.body);
            if (isHit) {
                if (this.box.boxStatus) {
                    return;
                }
                this.box.addeffect();
                this.box.changeStatus(true);
                this.box.entity_id = player.id;
                player.propertyData.buffnumber = this.box.statusRole;
                setTimeout(function (out) {
                    _this.disBox();
                }, 3000);
                var timeNum = 0;
                timeNum = (this.box.statusRole == 4) ? 5000 : 10000;
                setTimeout(function (out) {
                    player.propertyData.buffnumber = 0;
                }, timeNum);
            }
        }
    };
    ;
    RpgGameShowView.prototype.hitInTwoObject = function (obj1, obj2) {
        var rect1 = obj1.getBounds();
        var wid = obj2.getBounds().width / 3;
        var hei = obj2.getBounds().height / 3;
        var rect2 = new egret.Rectangle();
        rect2.width = wid;
        rect2.height = hei;
        rect1.x = obj1.x;
        rect1.y = obj1.y;
        rect2.x = obj2.x - wid / 2;
        rect2.y = obj2.y - hei / 2;
        return rect1.intersects(rect2);
    };
    RpgGameShowView.prototype.createList = function () {
        this.ranklist = new RpgGameListView(null, null);
        this.ranklist.initUI();
        this._rootView.addChild(this.ranklist);
    };
    RpgGameShowView.prototype.appearenergys = function () {
        for (var i = 0; i < this.energyList.length; i++) {
            var ent = this.energyList[i];
            var col = App.RandomUtils.limitInteger(3, 10);
            var row = App.RandomUtils.limitInteger(3, 6);
            var x = App.RandomUtils.limitInteger(3 * RpgGameData.GameTileWidth, 10 * RpgGameData.GameTileWidth); //col * RpgGameData.GameTileWidth;
            var y = App.RandomUtils.limitInteger(3 * RpgGameData.GameTileHeight, 6 * RpgGameData.GameTileHeight); //row * RpgGameData.GameTileHeight;
            ent.x = x;
            ent.y = y;
            this.gameView.getGameObjcetLayer().addChild(ent);
            ent.canbeHit = true;
        }
    };
    RpgGameShowView.prototype.hitEnergy = function (player) {
        var avatarComponent = player.getComponent(ComponentType.Avatar);
        if (!avatarComponent) {
            return;
        }
        for (var i = 0; i < this.energyList.length; i++) {
            var ent = this.energyList[i];
            if (ent.canbeHit) {
                var isHit = this.hitInTwoObject(ent, avatarComponent.body);
                if (isHit) {
                    ent.canbeHit = false;
                    ent.parent.removeChild(ent);
                    player.propertyData.enerty += 5; //??????????????? 
                }
            }
        }
    };
    RpgGameShowView.prototype.disableTimer = function () {
        if (this.rgpTimer) {
            this.rgpTimer.stop();
            this.rgpTimer = null;
        }
    };
    return RpgGameShowView;
}());
__reflect(RpgGameShowView.prototype, "RpgGameShowView");
/**
 * Created by yangsong on 2017/10/11.
 */
var RpgGameView = (function (_super) {
    __extends(RpgGameView, _super);
    function RpgGameView($controller, $parent) {
        var _this = _super.call(this, $controller, $parent) || this;
        _this.touchEnabled = true;
        return _this;
    }
    RpgGameView.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.background = new RpgBackground();
        this.addChild(this.background);
        this.gameObjcetLayer = new egret.DisplayObjectContainer();
        this.addChild(this.gameObjcetLayer);
        this.gameEffectLayer = new egret.DisplayObjectContainer();
        this.addChild(this.gameEffectLayer);
        this.addVirtualRoker();
    };
    RpgGameView.prototype.initData = function () {
        _super.prototype.initData.call(this);
        this.monsters = [];
        this.allRpgGameobject = [];
        this.perAttackTime = 0; //???1.5s????????????
        this.stageCenterX = App.StageUtils.getWidth() * 0.5;
        this.stageCenterY = App.StageUtils.getHeight() * 0.5;
    };
    /**
     * ?????????????????????????????????????????????
     * @param param ??????
     */
    RpgGameView.prototype.open = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        _super.prototype.open.call(this, param);
        var gameModel = param[0];
        this.initBackground(gameModel.mapId);
        this.initBlocks(gameModel.mapId);
        this.createPlayer(gameModel.playerData);
        this.createMonsters(gameModel.monsterNum);
        this.addSkillBtns();
        this.randomSkills = RpgGameSkills.getSingtonInstance();
        this.randomSkills.loadRandomSkill(gameModel.mapId, this);
        this.surfaceView = new RpgGameShowView(this);
    };
    RpgGameView.prototype.close = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        _super.prototype.close.call(this, param);
        this.surfaceView.disableTimer();
        this.randomSkills.stopTimer();
    };
    RpgGameView.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        //this.player.destory();
        for (var i = 0; i < this.allRpgGameobject.length; i++) {
            var obj = this.allRpgGameobject[i];
            obj.destory();
        }
    };
    RpgGameView.prototype.initBackground = function (mapId) {
        this.background.init(mapId);
    };
    RpgGameView.prototype.initBlocks = function (mapId) {
        var mapData = RES.getRes("map_" + mapId + "_data.json");
        this.blocksData = mapData.blocks;
    };
    RpgGameView.prototype.createPlayer = function (playData) {
        var col = App.RandomUtils.limitInteger(20, 65);
        var row = App.RandomUtils.limitInteger(50, 105);
        this.player = ObjectPool.pop("RpgPlayer");
        this.player.init({
            isPlayer: true,
            id: playData.id,
            col: col,
            row: row,
            mcName: playData.mcName,
            mcPath: "https://yqllm.wangqucc.com/gameres/dld/resource/assets/rpgGame/monster/" + playData.id + "/",
            skillPath: "https://yqllm.wangqucc.com/gameres/dld/resource/assets/rpgGame/skill/",
            gameView: this,
            propertyData: playData.propertyData,
        });
        this.controlComponent = this.player.getComponent(ComponentType.Control);
        this.battleComponent = this.player.getComponent(ComponentType.Battle);
        this.avatarSkillComponent = this.player.getComponent(ComponentType.AvatarSkill);
        this.allRpgGameobject.push(this.player);
    };
    RpgGameView.prototype.createMonsters = function (monsterNum) {
        var monstersData = [];
        var mosts = MonsterConfiger.randomMonsters;
        for (var j = 0; j < mosts.length; j++) {
            var i = mosts[j] - 20001;
            var col = App.RandomUtils.limitInteger(15, 55) + i * 8;
            var row = App.RandomUtils.limitInteger(35, 85) + i * 8;
            var monsId = mosts[j];
            var mcName = "monster_" + monsId;
            var mcPath = "https://yqllm.wangqucc.com/gameres/dld/resource/assets/rpgGame/monster/" + monsId + "/";
            monstersData.push({
                id: monsId,
                isPlayer: false,
                col: col,
                row: row,
                mcName: mcName,
                mcPath: mcPath,
                skillPath: "https://yqllm.wangqucc.com/gameres/dld/resource/assets/rpgGame/skill/",
                gameView: this,
                dis: App.MathUtils.getDistance(col, row, this.player.col, this.player.row),
                propertyData: this.reduiceMonsterInfo(monsId)
            });
        }
        monstersData.sort(function (a, b) {
            if (a.dis < b.dis) {
                return -1;
            }
            else {
                return 1;
            }
        });
        var executor = new FrameExecutor(1);
        var self = this;
        monstersData.forEach(function (data) {
            executor.regist(function () {
                var monster = ObjectPool.pop("RpgMonster");
                monster.init(data);
                self.monsters.push(monster);
                self.allRpgGameobject.push(monster);
            }, this);
        }.bind(this));
        executor.execute();
    };
    //??????????????????  ?????????
    RpgGameView.prototype.reduiceMonsterInfo = function (mostid) {
        var mosters = MonsterConfiger.getMonstersInfoConfig()["monster_config"]; //??????????????????
        var molist = MonsterConfiger.getMonsters(); //??????????????????
        var moinfo = new Object();
        moinfo["name"] = MonsterConfiger.getRadmane();
        moinfo["attackDis"] = 6; //??????????????????
        moinfo["attackInterval"] = 2000;
        for (var j = 0; j < molist.length; j++) {
            var m = molist[j];
            if (m["monsterId"] == mostid) {
                moinfo["skill1"] = m["skill1"];
                moinfo["skill2"] = m["skill2"];
                moinfo["skill3"] = m["skill3"];
            }
        }
        for (var i = 0; i < mosters.length; i++) {
            var mo = mosters[i];
            if (mostid == mo["monsterid"] && mo["monsterlevel"] == 1) {
                moinfo["hp"] = mo["hp"];
                moinfo["maxBlood"] = mo["hp"];
                moinfo["skillp"] = mo["skillp"];
                moinfo["skillh"] = mo["skillh"];
                moinfo["skillbooks"] = 3;
                moinfo["level"] = 1;
                moinfo["exp"] = 0;
                moinfo["buffname"] = "";
                moinfo["buffnumber"] = 0;
                moinfo["buffstatus"] = 0;
                moinfo["enerty"] = 0;
                moinfo["ski1add"] = 0.01;
                moinfo["ski2add"] = 0.01;
            }
        }
        return moinfo;
        ;
    };
    RpgGameView.prototype.refreshRankList = function () {
        this.surfaceView.ranklist.timerrun();
    };
    RpgGameView.prototype.showHpChange = function (gameObj, changeHp, txtColor) {
        if (txtColor === void 0) { txtColor = 0xFF0000; }
        var hpTxt = ObjectPool.pop("egret.TextField");
        hpTxt.size = 25;
        hpTxt.textColor = txtColor;
        hpTxt.width = 100;
        hpTxt.height = 20;
        hpTxt.textAlign = egret.HorizontalAlign.CENTER;
        hpTxt.strokeColor = 0x000000;
        hpTxt.stroke = 2;
        hpTxt.text = changeHp.toString();
        hpTxt.x = gameObj.x;
        hpTxt.y = gameObj.y - 150;
        hpTxt.alpha = 1;
        App.AnchorUtils.setAnchorX(hpTxt, 0.5);
        this.gameEffectLayer.addChild(hpTxt);
        egret.Tween.get(hpTxt).to({ "y": gameObj.y - 250, "alpha": 0 }, 1000).call(function () {
            App.DisplayUtils.removeFromParent(hpTxt);
            ObjectPool.push(hpTxt);
        });
    };
    RpgGameView.prototype.removeMonster = function (monster) {
        var index = this.monsters.indexOf(monster);
        if (index != -1) {
            this.monsters.splice(index, 1);
        }
        monster.destory();
        monster = null;
    };
    RpgGameView.prototype.resize = function () {
        if (!this.player) {
            return;
        }
        var cameraComponent = this.player.getComponent(ComponentType.Camera);
        cameraComponent.dealMoveObjs();
        cameraComponent.dealBgCamera();
    };
    RpgGameView.prototype.getBlocksData = function () {
        return this.blocksData;
    };
    RpgGameView.prototype.getGameObjcetLayer = function () {
        return this.gameObjcetLayer;
    };
    RpgGameView.prototype.getGameEffectLayer = function () {
        return this.gameEffectLayer;
    };
    RpgGameView.prototype.getBackground = function () {
        return this.background;
    };
    RpgGameView.prototype.getMonsters = function () {
        return this.monsters;
    };
    RpgGameView.prototype.getAllRpgGameObject = function () {
        return this.allRpgGameobject;
    };
    /*********************************7???4????????? **********************************************/
    /**
     * ????????????????????????????????????
     */
    RpgGameView.prototype.addVirtualRoker = function () {
        //??????
        var moveFlagX = 200;
        var moveFlagY = App.StageUtils.getHeight() - 150;
        var moveBg = App.DisplayUtils.createBitmap("ui_moveBg_png");
        App.AnchorUtils.setAnchor(moveBg, 0.5);
        moveBg.x = moveFlagX;
        moveBg.y = moveFlagY;
        this.addChild(moveBg);
        var moveFlag = App.DisplayUtils.createBitmap("ui_move_png");
        App.AnchorUtils.setAnchor(moveFlag, 0.5);
        moveFlag.x = moveFlagX;
        moveFlag.y = moveFlagY;
        // moveFlag.width = 259;
        // moveFlag.height = 258;
        this.addChild(moveFlag);
        //????????????
        App.RockerUtils.init(moveBg, moveFlag, this.dealkey, this);
        //????????????
        App.KeyboardUtils.addKeyUp(this.onKeyUp, this);
    };
    // ????????????
    RpgGameView.prototype.onKeyUp = function (keyCode) {
        switch (keyCode) {
            case Keyboard.J:
                this.heroAttack();
                break;
            case Keyboard.K:
                this.heroSkill1();
                break;
            case Keyboard.L:
                this.heroSkill2();
                break;
        }
    };
    // ????????????
    RpgGameView.prototype.dealkey = function (xFlag, yFlag) {
        if (xFlag || yFlag) {
            if (!this.player.isAttacking) {
                this.controlComponent.moveTo(xFlag, yFlag);
            }
            return true;
        }
        return false;
    };
    //??????????????????
    RpgGameView.prototype.addSkillBtns = function () {
        var data = { "20001": [{ "icon": "skillIcon_30007_png", "cd": 5, "point": 3, "anger": 0 },
                { "icon": "skillIcon_30013_png", "cd": 25, "point": 3, "anger": 0 }],
            "20002": [{ "icon": "skillIcon_30008_png", "cd": 5, "point": 3, "anger": 0 },
                { "icon": "skillIcon_30014_png", "cd": 30, "point": 3, "anger": 0 }],
            "20003": [{ "icon": "skillIcon_30009_png", "cd": 5, "point": 3, "anger": 0 },
                { "icon": "skillIcon_30015_png", "cd": 30, "point": 3, "anger": 0 }],
            "20004": [{ "icon": "skillIcon_30010_png", "cd": 5, "point": 3, "anger": 0 },
                { "icon": "skillIcon_30016_png", "cd": 40, "point": 3, "anger": 0 }],
            "20005": [{ "icon": "skillIcon_30011_png", "cd": 5, "point": 3, "anger": 0 },
                { "icon": "skillIcon_30017_png", "cd": 40, "point": 3, "anger": 0 }],
            "20006": [{ "icon": "skillIcon_30012_png", "cd": 5, "point": 3, "anger": 0 },
                { "icon": "skillIcon_30018_png", "cd": 30, "point": 3, "anger": 0 }]
        };
        var pId = (this.player.id).toString();
        this.skillBtn1 = new RpgSkillBtn(data[pId][0]["icon"], data[pId][0]["cd"], data[pId][0]["point"], data[pId][0]["anger"], App.StageUtils.getWidth() - 459, App.StageUtils.getHeight() - 180, SkillBtnType.anger);
        this.addChild(this.skillBtn1);
        this.skillBtn1.handleEvents(this.heroSkill2, null, null, this);
        this.skillBtn2 = new RpgSkillBtn(data[pId][1]["icon"], data[pId][1]["cd"], data[pId][1]["point"], data[pId][1]["anger"], App.StageUtils.getWidth() - 307, App.StageUtils.getHeight() - 180, SkillBtnType.CD);
        this.addChild(this.skillBtn2);
        this.skillBtn2.handleEvents(null, this.skill2BtnTouchBegin, this.skill2BtnTouchEnd, this);
        this.skillBtn3 = new RpgSkillBtn("skillIcon_30001_png", 1, -1, 0, App.StageUtils.getWidth() - 155, App.StageUtils.getHeight() - 180, SkillBtnType.common);
        this.addChild(this.skillBtn3);
        this.skillBtn3.handleEvents(this.normalAttack, null, null, this);
    };
    //??????1
    RpgGameView.prototype.heroSkill1 = function () {
        Log.debug("????????????1");
        this.player.isUsingSkill = true;
        var skillNum = this.player.propertyData.skill3["skillid"];
        var outTime = (skillNum == RpgGameSkill.sk30017) ? 5000 : 1000;
        egret.setTimeout(function () {
            this.player.isUsingSkill = false;
        }, this, outTime);
        this.heroAttack();
    };
    //??????2
    RpgGameView.prototype.heroSkill2 = function () {
        Log.debug("????????????2");
        this.player.isSkillBuff = true;
        egret.setTimeout(function () {
            this.player.isSkillBuff = false;
        }, this, 3000);
    };
    //????????????
    RpgGameView.prototype.normalAttack = function () {
        this.avatarSkillComponent.isNorAttack = true;
        this.heroAttack();
    };
    RpgGameView.prototype.heroAttack = function () {
        if (this.perAttackTime == 0) {
            Log.debug("????????????");
            this.player.isAttacking = true;
            this.battleComponent.startAttack();
            this.perAttackTime = 1.0;
            egret.setTimeout(function () {
                this.player.isAttacking = false;
                this.avatarSkillComponent.isNorAttack = false;
                this.perAttackTime = 0;
            }, this, 1000);
        }
    };
    RpgGameView.prototype.skill2BtnTouchBegin = function () {
        Log.debug("??????????????????");
        this.player.isDirection = true;
        this.addTouchs();
    };
    RpgGameView.prototype.skill2BtnTouchEnd = function () {
        Log.debug("??????????????????");
        //this.player.isDirection = false;
    };
    RpgGameView.prototype.stageTouchBegin = function (e) {
        Log.debug("??????????????????");
    };
    RpgGameView.prototype.stageTouchMove = function (e) {
        //Log.debug("local x:" + e.localX + " local y:" + e.localY + " this.weight:" + this.width + " this.height:" + this.height);
        var touchX = e.stageX;
        var touchY = e.stageY;
        var moveFlagX = 200;
        var moveFlagY = App.StageUtils.getHeight() - 150;
        moveFlagX += 259 + 20;
        if (touchX < moveFlagX || touchY > moveFlagY) {
            return;
        }
        this.player.skillX = touchX;
        this.player.skillY = touchY;
        this.player.skillDir = RpgGameUtils.computeSkillDir(this.stageCenterX, this.stageCenterY, touchX, touchY);
        Log.debug("???????????? x:" + touchX + " y:" + touchY);
    };
    RpgGameView.prototype.stageTouchEnd = function (e) {
        Log.debug("?????????????????? x:");
        this.removeTouchs();
        this.player.isDirection = false;
        this.player.dir = this.player.skillDir;
        this.heroSkill1();
        this.skillBtn2.changeStatus();
    };
    RpgGameView.prototype.stageOutside = function (e) {
        Log.debug("????????????");
        this.removeTouchs();
        this.player.isDirection = false;
        this.player.dir = this.player.skillDir;
        this.heroSkill1();
        this.skillBtn2.changeStatus();
    };
    RpgGameView.prototype.addTouchs = function () {
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.stageTouchBegin, this);
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.stageTouchMove, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.stageTouchEnd, this);
        this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.stageOutside, this);
    };
    RpgGameView.prototype.removeTouchs = function () {
        this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.stageTouchBegin, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.stageTouchMove, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_END, this.stageTouchEnd, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.stageOutside, this);
    };
    return RpgGameView;
}(BaseSpriteView));
__reflect(RpgGameView.prototype, "RpgGameView");
/**
 * Created by Harvey on 2019/7/9.
 */
var SkillBtnType;
(function (SkillBtnType) {
    SkillBtnType[SkillBtnType["common"] = 1] = "common";
    SkillBtnType[SkillBtnType["CD"] = 2] = "CD";
    SkillBtnType[SkillBtnType["anger"] = 3] = "anger";
})(SkillBtnType || (SkillBtnType = {}));
var RpgSkillBtn = (function (_super) {
    __extends(RpgSkillBtn, _super);
    function RpgSkillBtn(imgName, cd, point, anger, $x, $y, type) {
        if (cd === void 0) { cd = 0; }
        if (point === void 0) { point = -1; }
        if (anger === void 0) { anger = 0; }
        var _this = _super.call(this) || this;
        _this.x = $x;
        _this.y = $y;
        _this.width = 152;
        _this.height = 152;
        _this.type = type;
        _this.cd = cd;
        _this.point = point;
        _this.anger = 0;
        _this.totalAngel = 100;
        var icon = _this.icon = App.DisplayUtils.createBitmap(imgName);
        icon.x = (_this.width - icon.width) / 2;
        icon.y = (_this.height - icon.height) / 2;
        _this.addChild(icon);
        icon.touchEnabled = true;
        icon.addEventListener(egret.TouchEvent.TOUCH_TAP, _this.onTapedBtn, _this);
        icon.addEventListener(egret.TouchEvent.TOUCH_BEGIN, _this.onTouchStart, _this);
        icon.addEventListener(egret.TouchEvent.TOUCH_END, _this.onTouchEnd, _this);
        if (type == SkillBtnType.anger) {
            if (anger < _this.totalAngel) {
                _this.icon.touchEnabled = false;
                // this.isCDEnable = true;
                App.EffectUtils.setDisplayObjectGray(_this.icon);
            }
            _this.skillLineIcon = App.DisplayUtils.createBitmap("skillIcon_line_png");
            _this.addChildAt(_this.skillLineIcon, 0);
            var shape = new egret.Shape();
            _this.angelMask = shape;
            _this.addChild(_this.angelMask);
            _this.skillLineIcon.mask = _this.angelMask;
            _this.radius = _this.skillLineIcon.width / 2;
            _this.cenPoint = new egret.Point(_this.skillLineIcon.width / 2, _this.skillLineIcon.height / 2);
            _this.updateAngelShap(anger);
        }
        return _this;
    }
    RpgSkillBtn.prototype.handleEvents = function (tapFunc, startFunc, endFunc, thisObj) {
        this.tapCallBack = tapFunc;
        this.startCallBack = startFunc;
        this.endCallBack = endFunc;
        this.thisObj = thisObj;
    };
    RpgSkillBtn.prototype.onTapedBtn = function () {
        //Log.debug("btn tap");
        switch (this.type) {
            case (SkillBtnType.common):
                {
                    if (this.tapCallBack)
                        this.tapCallBack.call(this.thisObj);
                    this.icon.touchEnabled = false;
                    var mask = new SkillMask(this, (this.icon.width - 30) / 2);
                    mask.start(this.cd * 1000, this.timerCompletion, this);
                }
                break;
            case (SkillBtnType.CD):
                {
                    if (this.tapCallBack)
                        this.tapCallBack.call(this.thisObj);
                    this.icon.touchEnabled = false;
                    var mask = new SkillMask(this, (this.icon.width - 30) / 2);
                    mask.start(this.cd * 1000, this.timerCompletion, this);
                }
                break;
            case (SkillBtnType.anger):
                {
                    Log.debug("SkillBtn Type anger");
                    if (this.tapCallBack)
                        this.tapCallBack.call(this.thisObj);
                    this.icon.touchEnabled = false;
                    // this.isCDEnable = false;
                    // let mask = new SkillMask(this, (this.icon.width -30)/2);
                    // mask.start(this.cd * 1000,this.timerCompletion,this);
                    App.EffectUtils.setDisplayObjectGray(this.icon);
                    this.updateAngelShap(-this.totalAngel);
                }
                break;
            default:
                break;
        }
    };
    RpgSkillBtn.prototype.onTouchStart = function () {
        //Log.debug("btn touch start");
        if (this.startCallBack)
            this.startCallBack.call(this.thisObj);
    };
    RpgSkillBtn.prototype.onTouchEnd = function () {
        //Log.debug("btn touch end");
        if (this.endCallBack)
            this.endCallBack.call(this.thisObj);
    };
    RpgSkillBtn.prototype.changeStatus = function () {
        if (this.type == SkillBtnType.CD) {
            this.icon.touchEnabled = false;
            //this.isCDEnable = false;
            var mask = new SkillMask(this, (this.icon.width - 30) / 2);
            mask.start(this.cd * 1000, this.timerCompletion, this);
            //App.EffectUtils.setDisplayObjectGray(this.icon);
            //this.updateAngelShap(-this.totalAngel);
        }
    };
    //?????????????????????
    RpgSkillBtn.prototype.timerCompletion = function () {
        // if (this.type == SkillBtnType.anger) {
        //     this.isCDEnable = true;
        //     if (this.anger >= this.totalAngel) {
        //         this.icon.touchEnabled = true;
        //     }
        // }else {
        this.icon.touchEnabled = true;
        //}   
    };
    RpgSkillBtn.prototype.updateAngelShap = function (changeAngel) {
        this.anger += changeAngel;
        this.anger = this.anger > this.totalAngel ? this.totalAngel : this.anger;
        this.anger = this.anger < 0 ? 0 : this.anger;
        //???????????????
        if (this.icon.filters && this.anger == this.totalAngel) {
            this.icon.filters = null;
        }
        if (this.anger <= 0) {
            this.angelMask.graphics.clear();
        }
        else {
            Log.debug(this.anger);
            if (this.anger == this.totalAngel) {
                this.icon.touchEnabled = true;
            }
            var startAngle = RpgSkillBtn.START_ANGLE + (this.anger / this.totalAngel) * Math.PI * 2;
            var endAngle = RpgSkillBtn.END_ANGLE;
            this.drawCircle(startAngle, endAngle);
        }
    };
    /** ???????????? */
    RpgSkillBtn.prototype.drawCircle = function (startAngle, endAngle) {
        var shape = this.angelMask;
        var point = this.cenPoint;
        if (startAngle == endAngle) {
            startAngle -= 0.01;
        }
        shape.graphics.clear();
        shape.graphics.beginFill(0x0, 1);
        shape.graphics.moveTo(point.x, point.y); //???????????????
        shape.graphics.lineTo(point.x, 0); //????????????
        shape.graphics.drawArc(point.x, point.y, this.radius, startAngle, endAngle, true); //??????????????????
        shape.graphics.lineTo(point.x, point.y);
        shape.graphics.endFill();
    };
    RpgSkillBtn.START_ANGLE = -Math.PI / 2; //????????????
    RpgSkillBtn.END_ANGLE = Math.PI * 3 / 2; //????????????
    return RpgSkillBtn;
}(eui.Component));
__reflect(RpgSkillBtn.prototype, "RpgSkillBtn", ["eui.UIComponent", "egret.DisplayObject"]);
// TypeScript file
/** ??????????????? */
var SkillMask = (function () {
    function SkillMask(target, radius) {
        if (!target) {
            console.error("????????????????????????");
            return;
        }
        var shape = new egret.Shape();
        this.shape = shape;
        target.addChild(shape);
        var txt = new egret.TextField();
        this.txt = txt;
        txt.size = 30;
        txt.textColor = 0xfff9dc;
        txt.stroke = 2;
        txt.strokeColor = 0x231706;
        txt.textAlign = egret.HorizontalAlign.CENTER;
        txt.verticalAlign = egret.VerticalAlign.MIDDLE;
        txt.text = "0";
        txt.width = target.width;
        txt.y = (target.height - txt.height) / 2;
        txt.text = "";
        target.addChild(txt);
        this.cenPoint = new egret.Point(target.width / 2, target.height / 2);
        this.radius = radius;
    }
    /**
     * @param totalTime ??????????????????????????????
     * @param completeFunc ???????????????????????????
     * @param thisObj ?????????????????????this??????
     * @param param ????????????????????????????????????
     */
    SkillMask.prototype.start = function (totalTime, completeFunc, thisObj, param) {
        if (totalTime < 0) {
            console.error("start??????????????????");
            return;
        }
        egret.stopTick(this.onTick, this);
        this.totalTime = totalTime;
        this.callBack = completeFunc;
        this.thisObj = thisObj;
        this.param = param;
        this.timeStamp = egret.getTimer();
        this.countNum = 0;
        //???????????????????????????????????????????????????????????????
        egret.startTick(this.onTick, this);
    };
    SkillMask.prototype.onTick = function (timeStamp) {
        var nowTime = egret.getTimer();
        this.countNum += nowTime - this.timeStamp;
        this.timeStamp = nowTime;
        //Log.debug(timeStamp);
        if (this.countNum > this.totalTime) {
            this.txt.text = "";
            this.shape.graphics.clear();
            egret.stopTick(this.onTick, this);
            if (this.callBack) {
                this.callBack.call(this.thisObj, this.param);
            }
        }
        else {
            var startAngle = SkillMask.START_ANGLE + (this.countNum / this.totalTime) * Math.PI * 2;
            var endAngle = SkillMask.END_ANGLE;
            this.drawCircle(startAngle, endAngle);
            this.txt.text = "" + Math.ceil((this.totalTime - this.countNum) / 1000) + " S";
        }
        return true;
    };
    /** ???????????? */
    SkillMask.prototype.drawCircle = function (startAngle, endAngle) {
        var shape = this.shape;
        var point = this.cenPoint;
        shape.graphics.clear();
        shape.graphics.beginFill(0x0, 0.5);
        shape.graphics.moveTo(point.x, point.y); //???????????????
        shape.graphics.lineTo(point.x, 0); //????????????
        shape.graphics.drawArc(point.x, point.y, this.radius, startAngle, endAngle, false); //??????????????????
        shape.graphics.lineTo(point.x, point.y);
        shape.graphics.endFill();
    };
    SkillMask.START_ANGLE = -Math.PI / 2; //????????????
    SkillMask.END_ANGLE = Math.PI * 3 / 2; //????????????
    return SkillMask;
}());
__reflect(SkillMask.prototype, "SkillMask");
/**
 * Created by yangsong on 2017/10/11.
 */
var RpgTile = (function (_super) {
    __extends(RpgTile, _super);
    function RpgTile() {
        return _super.call(this) || this;
    }
    RpgTile.prototype.init = function (mapId, col, row) {
        this.col = col;
        this.row = row;
        this.x = this.col * RpgGameData.GameTileWidth;
        this.y = this.row * RpgGameData.GameTileHeight;
        var tileResName = row + "_" + col + ".jpg";
        var tileResPath = "https://yqllm.wangqucc.com/gameres/dld/resource/assets/rpgGame/map/" + mapId + "/" + tileResName;
        this.tileResKey = "map_" + mapId + "_" + tileResName;
        //????????????
        App.ResourceUtils.createResource(this.tileResKey, "image", tileResPath);
        RES.getResAsync(this.tileResKey, function (img) {
            this.texture = img;
        }, this);
    };
    RpgTile.prototype.destory = function () {
        App.DisplayUtils.removeFromParent(this);
        RES.destroyRes(this.tileResKey);
        this.texture = null;
    };
    return RpgTile;
}(egret.Bitmap));
__reflect(RpgTile.prototype, "RpgTile");
/**
 * Created by yangsong on 2017/10/11.
 */
var RpgTiles = (function (_super) {
    __extends(RpgTiles, _super);
    function RpgTiles() {
        var _this = _super.call(this) || this;
        _this.tiles = [];
        _this.screenTiles = [];
        return _this;
    }
    RpgTiles.prototype.init = function (mapId) {
        this.mapId = mapId;
        var mapData = RES.getRes("map_" + mapId + "_data.json");
        this.cols = Math.floor(mapData.width / RpgGameData.GameTileWidth);
        this.rows = Math.floor(mapData.height / RpgGameData.GameTileHeight);
    };
    RpgTiles.prototype.updateCameraPos = function ($x, $y) {
        var currCol = Math.round($x / RpgGameData.GameTileWidth);
        var currRow = Math.round($y / RpgGameData.GameTileHeight);
        var screenCols = Math.ceil(App.StageUtils.getWidth() / RpgGameData.GameTileWidth) + 1;
        var screenRows = Math.ceil(App.StageUtils.getHeight() / RpgGameData.GameTileHeight) + 1;
        var halfScreenCols = Math.ceil(screenCols / 2);
        var halfScreenRows = Math.ceil(screenRows / 2);
        // Log.debug("currCol " + currCol + "======== " + "currRow" + currRow);
        // Log.debug("screenCols " + screenCols + "------------" + "screenRows " + screenRows);
        // Log.debug("halfScreenCols " + halfScreenCols + "+++++++++++++" + "halfScreenRows " + halfScreenRows);
        var minCol = currCol - halfScreenCols;
        var maxCol = currCol + halfScreenCols;
        if (minCol < 0) {
            maxCol += -minCol;
            minCol = 0;
        }
        if (maxCol > this.cols) {
            minCol -= (maxCol - this.cols);
            maxCol = this.cols;
        }
        var minRow = currRow - halfScreenRows;
        var maxRow = currRow + halfScreenRows;
        if (minRow < 0) {
            maxRow += -minRow;
            minRow = 0;
        }
        if (maxRow > this.rows) {
            minRow -= (maxRow - this.rows);
            maxRow = this.rows;
        }
        var screenTiles = [];
        for (var i = minCol; i <= maxCol; i++) {
            for (var j = minRow; j <= maxRow; j++) {
                var tileKey = i + "_" + j;
                var tile = this.tiles[tileKey];
                if (!tile) {
                    tile = new RpgTile();
                    tile.init(this.mapId, i, j);
                    this.tiles[tileKey] = tile;
                }
                if (!tile.parent) {
                    this.addChild(tile);
                }
                screenTiles.push(tileKey);
            }
        }
        //??????????????????????????????
        this.screenTiles.forEach(function (tileKey) {
            if (screenTiles.indexOf(tileKey) == -1) {
                var tile = this.tiles[tileKey];
                tile && App.DisplayUtils.removeFromParent(tile);
            }
        }.bind(this));
        this.screenTiles = screenTiles;
    };
    RpgTiles.prototype.destory = function () {
        var keys = Object.keys(this.tiles);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var tile = this.tiles[key];
            tile.destory();
            this.tiles[key] = null;
            delete this.tiles[key];
        }
        this.screenTiles.splice(0);
    };
    return RpgTiles;
}(egret.DisplayObjectContainer));
__reflect(RpgTiles.prototype, "RpgTiles");
/**
 * Created by egret on 15-1-7.
 */
var ShopController = (function (_super) {
    __extends(ShopController, _super);
    function ShopController() {
        var _this = _super.call(this) || this;
        _this.shopView = new ShopView(_this, LayerManager.UI_Popup);
        App.ViewManager.register(ViewConst.Shop, _this.shopView);
        return _this;
    }
    return ShopController;
}(BaseController));
__reflect(ShopController.prototype, "ShopController");
/**
 * Created by egret on 15-1-7.
 */
var ShopView = (function (_super) {
    __extends(ShopView, _super);
    function ShopView(controller, parent) {
        var _this = _super.call(this, controller, parent) || this;
        _this.icon = "table_shop";
        return _this;
    }
    /**
     *????????????????????????????????????????????????
     *
     */
    ShopView.prototype.initData = function () {
        _super.prototype.initData.call(this);
        var dp1 = new eui.ArrayCollection();
        dp1.addItem({ title: "????????????", price: "3", time: "-5??????", icon: "icon_fertilizer02" });
        dp1.addItem({ title: "????????????", price: "5", time: "-10??????", icon: "icon_fertilizer03" });
        dp1.addItem({ title: "????????????", price: "15", time: "-30??????", icon: "icon_fertilizer04" });
        dp1.addItem({ title: "????????????", price: "25", time: "-60??????", icon: "icon_fertilizer05" });
        dp1.addItem({ title: "????????????", price: "3", time: "-5??????", icon: "icon_fertilizer02" });
        dp1.addItem({ title: "????????????", price: "5", time: "-10??????", icon: "icon_fertilizer03" });
        dp1.addItem({ title: "????????????", price: "15", time: "-30??????", icon: "icon_fertilizer04" });
        dp1.addItem({ title: "????????????", price: "25", time: "-60??????", icon: "icon_fertilizer05" });
        dp1.addItem({ title: "????????????", price: "3", time: "-5??????", icon: "icon_fertilizer02" });
        dp1.addItem({ title: "????????????", price: "5", time: "-10??????", icon: "icon_fertilizer03" });
        dp1.addItem({ title: "????????????", price: "15", time: "-30??????", icon: "icon_fertilizer04" });
        dp1.addItem({ title: "????????????", price: "25", time: "-60??????", icon: "icon_fertilizer05" });
        var dp2 = new eui.ArrayCollection();
        dp2.addItem({ title: "????????????", price: "25", time: "-60??????", icon: "icon_fertilizer05" });
        dp2.addItem({ title: "????????????", price: "3", time: "-5??????", icon: "icon_fertilizer02" });
        dp2.addItem({ title: "????????????", price: "5", time: "-10??????", icon: "icon_fertilizer03" });
        dp2.addItem({ title: "????????????", price: "15", time: "-30??????", icon: "icon_fertilizer04" });
        dp2.addItem({ title: "????????????", price: "25", time: "-60??????", icon: "icon_fertilizer05" });
        dp2.addItem({ title: "????????????", price: "3", time: "-5??????", icon: "icon_fertilizer02" });
        dp2.addItem({ title: "????????????", price: "5", time: "-10??????", icon: "icon_fertilizer03" });
        dp2.addItem({ title: "????????????", price: "15", time: "-30??????", icon: "icon_fertilizer04" });
        dp2.addItem({ title: "????????????", price: "25", time: "-60??????", icon: "icon_fertilizer05" });
        dp2.addItem({ title: "????????????", price: "3", time: "-5??????", icon: "icon_fertilizer02" });
        dp2.addItem({ title: "????????????", price: "5", time: "-10??????", icon: "icon_fertilizer03" });
        dp2.addItem({ title: "????????????", price: "15", time: "-30??????", icon: "icon_fertilizer04" });
        var tabbar = new TabBarContainer();
        tabbar.addViewStackElement("text_fertilizer01", "text_fertilizer02", this.createList(dp1));
        tabbar.addViewStackElement("text_seed01", "text_seed02", this.createList(dp2));
        tabbar.horizontalCenter = 0;
        this.contentGroup.addChild(tabbar);
    };
    ShopView.prototype.createList = function (dp) {
        var layout = new eui.TileLayout();
        layout.requestedColumnCount = 2;
        var taskList = new eui.List();
        taskList.layout = layout;
        taskList.itemRenderer = SaleItemRenderer;
        taskList.itemRendererSkinName = "resource/skins/SaleItemSkin.exml";
        taskList.dataProvider = dp;
        var scroller = new eui.Scroller();
        scroller.percentWidth = scroller.percentHeight = 100;
        scroller.viewport = taskList;
        return scroller;
    };
    return ShopView;
}(BasePanelView));
__reflect(ShopView.prototype, "ShopView");
/**
 * Created by yangsong on 2014/11/22.
 */
var App = (function () {
    function App() {
    }
    Object.defineProperty(App, "Http", {
        /**
         * Http??????
         * @type {Http}
         */
        get: function () {
            return Http.getSingtonInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "ControllerManager", {
        /**
         * Socket??????
         * @type {null}
         */
        // public static get Socket(): Socket {
        //     return Socket.getSingtonInstance();
        // }
        /**
         * ???????????????
         * @type {ControllerManager}
         */
        get: function () {
            return ControllerManager.getSingtonInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "ViewManager", {
        /**
         * View?????????
         * @type {ViewManager}
         */
        get: function () {
            return ViewManager.getSingtonInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "SceneManager", {
        /**
         * ???????????????
         * @type {SceneManager}
         */
        get: function () {
            return SceneManager.getSingtonInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "DebugUtils", {
        /**
         * ????????????
         * @type {DebugUtils}
         */
        get: function () {
            return DebugUtils.getSingtonInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "MessageCenter", {
        /**
         * ????????????????????????????????????
         * @type {MessageCenter}
         */
        get: function () {
            return MessageCenter.getSingtonInstance(0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "TimerManager", {
        /**
         * ????????????????????????????????????
         * @type {TimerManager}
         */
        get: function () {
            return TimerManager.getSingtonInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "DateUtils", {
        /**
         * ???????????????
         * @type {DateUtils}
         */
        get: function () {
            return DateUtils.getSingtonInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "MathUtils", {
        /**
         * ?????????????????????
         * @type {MathUtils}
         */
        get: function () {
            return MathUtils.getSingtonInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "RandomUtils", {
        /**
         * ??????????????????
         * @type {RandomUtils}
         */
        get: function () {
            return RandomUtils.getSingtonInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "DisplayUtils", {
        /**
         * ?????????????????????
         * @type {DisplayUtils}
         */
        get: function () {
            return DisplayUtils.getSingtonInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "BitmapNumber", {
        /*
         * ???????????????????????????
         * */
        get: function () {
            return BitmapNumber.getSingtonInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "GuideUtils", {
        /**
         * ???????????????
         */
        get: function () {
            return GuideUtils.getSingtonInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "StageUtils", {
        /**
         * Stage?????????????????????
         */
        get: function () {
            return StageUtils.getSingtonInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "EffectUtils", {
        /**
         * Effect?????????
         */
        get: function () {
            return EffectUtils.getSingtonInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "StringUtils", {
        /**
         * ??????????????????
         */
        get: function () {
            return StringUtils.getSingtonInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "CommonUtils", {
        /**
         * ???????????????
         */
        get: function () {
            return CommonUtils.getSingtonInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "SoundManager", {
        /**
         * ???????????????
         */
        get: function () {
            return SoundManager.getSingtonInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "DeviceUtils", {
        /**
         * ???????????????
         */
        get: function () {
            return DeviceUtils.getSingtonInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "EgretExpandUtils", {
        /**
         * ???????????????
         */
        get: function () {
            return EgretExpandUtils.getSingtonInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "KeyboardUtils", {
        /**
         * ?????????????????????
         */
        get: function () {
            return KeyboardUtils.getSingtonInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "RockerUtils", {
        /**
         * ?????????????????????
         */
        get: function () {
            return RockerUtils.getSingtonInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "ShockUtils", {
        /**
         * ?????????
         */
        get: function () {
            return ShockUtils.getSingtonInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "ResourceUtils", {
        /**
         * ?????????????????????
         */
        get: function () {
            return ResourceUtils.getSingtonInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "RenderTextureManager", {
        /**
         * RenderTextureManager
         */
        get: function () {
            return RenderTextureManager.getSingtonInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "TextFlowMaker", {
        /**
         * TextFlow
         */
        get: function () {
            return TextFlowMaker.getSingtonInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "NotificationCenter", {
        get: function () {
            if (App._notificationCenter == null) {
                App._notificationCenter = new MessageCenter(1);
            }
            return App._notificationCenter;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "DelayOptManager", {
        /**
         * ???????????????
         * @returns {any}
         * @constructor
         */
        get: function () {
            return DelayOptManager.getSingtonInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "ArrayUtils", {
        /**
         * ???????????????
         * @returns {any}
         * @constructor
         */
        get: function () {
            return ArrayUtils.getSingtonInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "EasyLoading", {
        /**
         * ??????Loading??????
         * @returns {any}
         * @constructor
         */
        get: function () {
            return EasyLoading.getSingtonInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "DragonBonesFactory", {
        /**
         * DragonBones?????????
         * @returns {any}
         * @constructor
         */
        get: function () {
            return DragonBonesFactory.getSingtonInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "StarlingSwfFactory", {
        /**
         * StarlingSwf?????????
         * @returns {StarlingSwfFactory}
         * @constructor
         */
        get: function () {
            return StarlingSwfFactory.getSingtonInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "AnchorUtils", {
        /**
         * AnchorUtils?????????
         */
        get: function () {
            return AnchorUtils.getSingtonInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "TouchEventHook", {
        /**
         * hack?????????Touch??????
         */
        get: function () {
            return TouchEventHook.getSingtonInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "LocationPropertyUtils", {
        /**
         * H5??????????????????????????????
         */
        get: function () {
            return LocationPropertyUtils.getSingtonInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "TweenUtils", {
        /**
         * Tween?????????
         */
        get: function () {
            return TweenUtils.getSingtonInstance();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * ???????????????
     * @constructor
     */
    App.Init = function () {
        Log.debug("??????????????????: ", egret.Capabilities.engineVersion);
        //??????????????????
        App.GlobalData = RES.getRes("global");
        //????????????
        App.DebugUtils.isOpen(App.GlobalData.IsDebug);
        App.DebugUtils.setThreshold(5);
        //?????????????????????
        App.EgretExpandUtils.init();
        //?????????Http??????
        App.Http.initServer(App.GlobalData.HttpSerever);
        //?????????ProtoBuf???Socket??????
        App.ProtoConfig = RES.getRes(App.GlobalData.ProtoConfig);
        // App.Socket.initServer(App.GlobalData.SocketServer, App.GlobalData.SocketPort, new ByteArrayMsgByProtobuf());
    };
    /**
     * ????????????????????????????????????
     * @type {string}
     */
    App.ProxyUserFlag = "";
    /**
     * ??????????????????
     * @type {null}
     */
    App.GlobalData = null;
    /**
     * ProtoConfig
     * @type {null}
     */
    App.ProtoConfig = null;
    return App;
}());
__reflect(App.prototype, "App");
/**
 * Created by egret on 15-1-7.
 */
var DailyView = (function (_super) {
    __extends(DailyView, _super);
    function DailyView(controller, parent) {
        var _this = _super.call(this, controller, parent) || this;
        _this.icon = "table_activity";
        return _this;
    }
    /**
     *????????????????????????????????????????????????
     *
     */
    DailyView.prototype.initData = function () {
        _super.prototype.initData.call(this);
        this.dataProvider.addItem({ icon: "icon_experience", gold: "+50", seed: "+200", label: "????????????5???", progress: "0/5" });
        this.dataProvider.addItem({ icon: "icon_fertilization", gold: "+120", seed: "+100", label: "????????????10???", progress: "0/10" });
        this.dataProvider.addItem({ icon: "icon_diamond", gold: "+520", seed: "+500", label: "????????????100???", progress: "0/100" });
        this.dataProvider.addItem({ icon: "icon_experience", gold: "+50", seed: "+200", label: "????????????5???", progress: "0/5" });
        this.dataProvider.addItem({ icon: "icon_fertilization", gold: "+120", seed: "+100", label: "????????????10???", progress: "0/10" });
        this.dataProvider.addItem({ icon: "icon_diamond", gold: "+520", seed: "+500", label: "????????????100???", progress: "0/100" });
        this.dataProvider.addItem({ icon: "icon_experience", gold: "+50", seed: "+200", label: "????????????5???", progress: "0/5" });
        this.dataProvider.addItem({ icon: "icon_fertilization", gold: "+120", seed: "+100", label: "????????????10???", progress: "0/10" });
        this.dataProvider.addItem({ icon: "icon_diamond", gold: "+520", seed: "+500", label: "????????????100???", progress: "0/100" });
        this.dataProvider.addItem({ icon: "icon_experience", gold: "+50", seed: "+200", label: "????????????5???", progress: "0/5" });
        this.dataProvider.addItem({ icon: "icon_fertilization", gold: "+120", seed: "+100", label: "????????????10???", progress: "0/10" });
        this.dataProvider.addItem({ icon: "icon_diamond", gold: "+520", seed: "+500", label: "????????????100???", progress: "0/100" });
        this.dataProvider.addItem({ icon: "icon_experience", gold: "+50", seed: "+200", label: "????????????5???", progress: "0/5" });
        this.dataProvider.addItem({ icon: "icon_fertilization", gold: "+120", seed: "+100", label: "????????????10???", progress: "0/10" });
        this.dataProvider.addItem({ icon: "icon_diamond", gold: "+520", seed: "+500", label: "????????????100???", progress: "0/100" });
    };
    return DailyView;
}(BaseTaskView));
__reflect(DailyView.prototype, "DailyView");
/**
 * Created by egret on 15-1-7.
 */
var TaskController = (function (_super) {
    __extends(TaskController, _super);
    function TaskController() {
        var _this = _super.call(this) || this;
        _this.taskView = new TaskView(_this, LayerManager.UI_Popup);
        App.ViewManager.register(ViewConst.Task, _this.taskView);
        _this.dailyView = new DailyView(_this, LayerManager.UI_Popup);
        App.ViewManager.register(ViewConst.Daily, _this.dailyView);
        return _this;
    }
    return TaskController;
}(BaseController));
__reflect(TaskController.prototype, "TaskController");
/**
 * Created by egret on 15-1-7.
 */
var TaskView = (function (_super) {
    __extends(TaskView, _super);
    function TaskView(controller, parent) {
        var _this = _super.call(this, controller, parent) || this;
        _this.icon = "table_task";
        return _this;
    }
    /**
     *????????????????????????????????????????????????
     *
     */
    TaskView.prototype.initData = function () {
        _super.prototype.initData.call(this);
        this.dataProvider.addItem({ icon: "icon_experience", gold: "+50", seed: "+200", label: "????????????5???", progress: "0/5" });
        this.dataProvider.addItem({ icon: "icon_fertilization", gold: "+120", seed: "+100", label: "????????????10???", progress: "0/10" });
        this.dataProvider.addItem({ icon: "icon_diamond", gold: "+520", seed: "+500", label: "????????????100???", progress: "0/100" });
        this.dataProvider.addItem({ icon: "icon_experience", gold: "+50", seed: "+200", label: "????????????5???", progress: "0/5" });
        this.dataProvider.addItem({ icon: "icon_fertilization", gold: "+120", seed: "+100", label: "????????????10???", progress: "0/10" });
        this.dataProvider.addItem({ icon: "icon_diamond", gold: "+520", seed: "+500", label: "????????????100???", progress: "0/100" });
        this.dataProvider.addItem({ icon: "icon_experience", gold: "+50", seed: "+200", label: "????????????5???", progress: "0/5" });
        this.dataProvider.addItem({ icon: "icon_fertilization", gold: "+120", seed: "+100", label: "????????????10???", progress: "0/10" });
        this.dataProvider.addItem({ icon: "icon_diamond", gold: "+520", seed: "+500", label: "????????????100???", progress: "0/100" });
        this.dataProvider.addItem({ icon: "icon_experience", gold: "+50", seed: "+200", label: "????????????5???", progress: "0/5" });
        this.dataProvider.addItem({ icon: "icon_fertilization", gold: "+120", seed: "+100", label: "????????????10???", progress: "0/10" });
        this.dataProvider.addItem({ icon: "icon_diamond", gold: "+520", seed: "+500", label: "????????????100???", progress: "0/100" });
        this.dataProvider.addItem({ icon: "icon_experience", gold: "+50", seed: "+200", label: "????????????5???", progress: "0/5" });
        this.dataProvider.addItem({ icon: "icon_fertilization", gold: "+120", seed: "+100", label: "????????????10???", progress: "0/10" });
        this.dataProvider.addItem({ icon: "icon_diamond", gold: "+520", seed: "+500", label: "????????????100???", progress: "0/100" });
    };
    return TaskView;
}(BaseTaskView));
__reflect(TaskView.prototype, "TaskView");
/**
 * Created by egret on 15-1-7.
 */
var WarehouseController = (function (_super) {
    __extends(WarehouseController, _super);
    function WarehouseController() {
        var _this = _super.call(this) || this;
        _this.warehouseView = new WarehouseView(_this, LayerManager.UI_Popup);
        App.ViewManager.register(ViewConst.Warehouse, _this.warehouseView);
        return _this;
    }
    return WarehouseController;
}(BaseController));
__reflect(WarehouseController.prototype, "WarehouseController");
/**
 * Created by egret on 15-1-7.
 */
var WarehouseView = (function (_super) {
    __extends(WarehouseView, _super);
    function WarehouseView(controller, parent) {
        var _this = _super.call(this, controller, parent) || this;
        _this.icon = "table_warehouse";
        _this.btn = "icon_sale";
        return _this;
    }
    /**
     *????????????????????????????????????????????????
     *
     */
    WarehouseView.prototype.initData = function () {
        _super.prototype.initData.call(this);
        var dp1 = new eui.ArrayCollection();
        dp1.addItem({ title: "????????????", price: "3", time: "-5??????", icon: "icon_fertilizer02" });
        dp1.addItem({ title: "????????????", price: "5", time: "-10??????", icon: "icon_fertilizer03" });
        dp1.addItem({ title: "????????????", price: "15", time: "-30??????", icon: "icon_fertilizer04" });
        dp1.addItem({ title: "????????????", price: "25", time: "-60??????", icon: "icon_fertilizer05" });
        dp1.addItem({ title: "????????????", price: "3", time: "-5??????", icon: "icon_fertilizer02" });
        dp1.addItem({ title: "????????????", price: "5", time: "-10??????", icon: "icon_fertilizer03" });
        dp1.addItem({ title: "????????????", price: "15", time: "-30??????", icon: "icon_fertilizer04" });
        dp1.addItem({ title: "????????????", price: "25", time: "-60??????", icon: "icon_fertilizer05" });
        dp1.addItem({ title: "????????????", price: "3", time: "-5??????", icon: "icon_fertilizer02" });
        dp1.addItem({ title: "????????????", price: "5", time: "-10??????", icon: "icon_fertilizer03" });
        dp1.addItem({ title: "????????????", price: "15", time: "-30??????", icon: "icon_fertilizer04" });
        dp1.addItem({ title: "????????????", price: "25", time: "-60??????", icon: "icon_fertilizer05" });
        var dp2 = new eui.ArrayCollection();
        dp2.addItem({ title: "????????????", price: "25", time: "-60??????", icon: "icon_fertilizer05" });
        dp2.addItem({ title: "????????????", price: "3", time: "-5??????", icon: "icon_fertilizer02" });
        dp2.addItem({ title: "????????????", price: "5", time: "-10??????", icon: "icon_fertilizer03" });
        dp2.addItem({ title: "????????????", price: "15", time: "-30??????", icon: "icon_fertilizer04" });
        dp2.addItem({ title: "????????????", price: "25", time: "-60??????", icon: "icon_fertilizer05" });
        dp2.addItem({ title: "????????????", price: "3", time: "-5??????", icon: "icon_fertilizer02" });
        dp2.addItem({ title: "????????????", price: "5", time: "-10??????", icon: "icon_fertilizer03" });
        dp2.addItem({ title: "????????????", price: "15", time: "-30??????", icon: "icon_fertilizer04" });
        dp2.addItem({ title: "????????????", price: "25", time: "-60??????", icon: "icon_fertilizer05" });
        dp2.addItem({ title: "????????????", price: "3", time: "-5??????", icon: "icon_fertilizer02" });
        dp2.addItem({ title: "????????????", price: "5", time: "-10??????", icon: "icon_fertilizer03" });
        dp2.addItem({ title: "????????????", price: "15", time: "-30??????", icon: "icon_fertilizer04" });
        var tabbar = new TabBarContainer();
        tabbar.addViewStackElement("text_seed01", "text_seed02", this.createList(dp1));
        tabbar.addViewStackElement("text_fruit_01", "text_fruit_02", this.createList(dp2));
        tabbar.addViewStackElement("text_fruit_juice_01", "text_fruit_juice_02", this.createList(dp1));
        tabbar.horizontalCenter = 0;
        this.contentGroup.addChild(tabbar);
    };
    WarehouseView.prototype.createList = function (dp) {
        var layout = new eui.TileLayout();
        layout.requestedColumnCount = 2;
        var taskList = new eui.List();
        taskList.layout = layout;
        taskList.itemRenderer = SaleItemRenderer;
        taskList.itemRendererSkinName = "resource/skins/SaleItemSkin.exml";
        taskList.dataProvider = dp;
        var scroller = new eui.Scroller();
        scroller.percentWidth = scroller.percentHeight = 100;
        scroller.viewport = taskList;
        return scroller;
    };
    return WarehouseView;
}(BasePanelView));
__reflect(WarehouseView.prototype, "WarehouseView");
/**
 * Created by yangsong on 2014/11/28.
 * ????????????
 */
var GameScene = (function (_super) {
    __extends(GameScene, _super);
    /**
     * ????????????
     */
    function GameScene() {
        return _super.call(this) || this;
    }
    /**
     * ??????Scene??????
     */
    GameScene.prototype.onEnter = function () {
        _super.prototype.onEnter.call(this);
        this.addLayerAt(LayerManager.Game_Main, 0);
        App.ViewManager.open(ViewConst.Game);
        App.ViewManager.open(ViewConst.GameUI);
        //??????????????????
        App.SoundManager.playBg("sound_bg");
    };
    /**
     * ??????Scene??????
     */
    GameScene.prototype.onExit = function () {
        _super.prototype.onExit.call(this);
    };
    return GameScene;
}(BaseScene));
__reflect(GameScene.prototype, "GameScene");
/**
 * Created by yangsong on 2014/11/23.
 * ???????????????
 */
var LayerManager = (function () {
    function LayerManager() {
    }
    /**
     * ???????????????
     * @type {BaseSpriteLayer}
     */
    LayerManager.Game_Bg = new BaseSpriteLayer();
    /**
     * ????????????
     * @type {BaseSpriteLayer}
     */
    LayerManager.Game_Main = new BaseSpriteLayer();
    /**
     * UI?????????
     * @type {BaseEuiLayer}
     */
    LayerManager.UI_Main = new BaseEuiLayer();
    /**
     * UI????????????
     * @type {BaseEuiLayer}
     */
    LayerManager.UI_Popup = new BaseEuiLayer();
    /**
     * UI???????????????
     * @type {BaseEuiLayer}
     */
    LayerManager.UI_Message = new BaseEuiLayer();
    /**
     * UITips???
     * @type {BaseEuiLayer}
     */
    LayerManager.UI_Tips = new BaseEuiLayer();
    return LayerManager;
}());
__reflect(LayerManager.prototype, "LayerManager");
/**
 * Created by egret on 15-1-7.
 */
var LoadingScene = (function (_super) {
    __extends(LoadingScene, _super);
    /**
     * ????????????
     */
    function LoadingScene() {
        return _super.call(this) || this;
    }
    /**
     * ??????Scene??????
     */
    LoadingScene.prototype.onEnter = function () {
        _super.prototype.onEnter.call(this);
        //?????????Scene???????????????
        this.addLayer(LayerManager.UI_Main);
        //????????????Loading??????
        App.ViewManager.open(ViewConst.Loading);
    };
    /**
     * ??????Scene??????
     */
    LoadingScene.prototype.onExit = function () {
        _super.prototype.onExit.call(this);
    };
    return LoadingScene;
}(BaseScene));
__reflect(LoadingScene.prototype, "LoadingScene");
/**
 * Created by yangsong on 2017/10/11.
 */
var RpgGameScene = (function (_super) {
    __extends(RpgGameScene, _super);
    /**
     * ????????????
     */
    function RpgGameScene() {
        return _super.call(this) || this;
    }
    /**
     * ??????Scene??????
     */
    RpgGameScene.prototype.onEnter = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        _super.prototype.onEnter.call(this);
        //??????
        var mapId = param[0];
        //??????ComponentSystem
        ComponentSystem.start();
        //?????????Scene?????????Layer
        this.addLayer(LayerManager.Game_Main);
        this.addLayer(LayerManager.UI_Main);
        this.addLayer(LayerManager.UI_Popup);
        this.addLayer(LayerManager.UI_Message);
        this.addLayer(LayerManager.UI_Tips);
        //??????RpgGame
        App.ControllerManager.applyFunc(ControllerConst.RpgGame, RpgGameConst.GameInit, mapId);
        //??????UI??????
        //App.ViewManager.open(ViewConst.Home);
        //??????????????????
        App.SoundManager.playBg("sound_bg");
    };
    /**
     * ??????Scene??????
     */
    RpgGameScene.prototype.onExit = function () {
        _super.prototype.onExit.call(this);
        //??????ComponentSystem
        ComponentSystem.stop();
    };
    return RpgGameScene;
}(BaseScene));
__reflect(RpgGameScene.prototype, "RpgGameScene");
/**
 * Created by yangsong on 2014/11/28.
 * UI?????????
 */
var UIScene = (function (_super) {
    __extends(UIScene, _super);
    /**
     * ????????????
     */
    function UIScene() {
        return _super.call(this) || this;
    }
    /**
     * ??????Scene??????
     */
    UIScene.prototype.onEnter = function () {
        _super.prototype.onEnter.call(this);
        //?????????Scene???????????????
        this.addLayer(LayerManager.UI_Main);
        this.addLayer(LayerManager.UI_Popup);
        this.addLayer(LayerManager.UI_Message);
        this.addLayer(LayerManager.UI_Tips);
        //????????????Home??????
        App.ViewManager.open(ViewConst.Home);
        //??????????????????
        // App.SoundManager.playBg("sound_bg");
    };
    /**
     * ??????Scene??????
     */
    UIScene.prototype.onExit = function () {
        _super.prototype.onExit.call(this);
    };
    return UIScene;
}(BaseScene));
__reflect(UIScene.prototype, "UIScene");
/**
 * Created by yangsong on 15-3-27.
 * GUI??????
 */
var EUITest = (function () {
    function EUITest() {
        var groupName = "preload_EUITest";
        // var subGroups:Array<string> = ["preload_core", "preload_ui"];
        var subGroups = ["preload_core", "preload_battle", "preload_ui", "preload"];
        App.ResourceUtils.loadGroups(groupName, subGroups, this.onResourceLoadComplete, this.onResourceLoadProgress, this);
    }
    /**
     * ?????????????????????
     */
    EUITest.prototype.onResourceLoadComplete = function () {
        this.initModule();
        //App.Init();
        //??????????????????
        App.SoundManager.setBgOn(true);
        App.SoundManager.setEffectOn(!App.DeviceUtils.IsHtml5 || !App.DeviceUtils.IsMobile);
        App.SceneManager.runScene(SceneConsts.UI);
    };
    /**
     * ?????????????????????
     */
    EUITest.prototype.onResourceLoadProgress = function (itemsLoaded, itemsTotal) {
        App.ControllerManager.applyFunc(ControllerConst.Loading, LoadingConst.SetProgress, itemsLoaded, itemsTotal);
    };
    /**
     * ?????????????????????
     */
    EUITest.prototype.initModule = function () {
        App.ControllerManager.register(ControllerConst.Login, new LoginController());
        App.ControllerManager.register(ControllerConst.Home, new HomeController());
        App.ControllerManager.register(ControllerConst.AdsView, new AdsController());
        App.ControllerManager.register(ControllerConst.LevelRewardView, new LevelRewardController());
        App.ControllerManager.register(ControllerConst.SettingView, new SettingController());
        App.ControllerManager.register(ControllerConst.SettlementView, new SettlementController());
        App.ControllerManager.register(ControllerConst.MatchingView, new MatchingController());
        App.ControllerManager.register(ControllerConst.ExplainView, new ExplainController());
    };
    return EUITest;
}());
__reflect(EUITest.prototype, "EUITest");
/**
 * Created by yangsong on 15-3-27.
 * ProtoBuf??????
 */
var ProtoBufTest = (function () {
    function ProtoBufTest() {
        App.ResourceUtils.loadGroup("preload_core", this.onResourceLoadComplete, this.onResourceLoadProgress, this);
    }
    /**
     * ?????????????????????
     */
    ProtoBufTest.prototype.onResourceLoadComplete = function () {
        App.Init();
        // this.clientTest();
        this.socketTest();
        this.userLogin("root", "666");
    };
    /**
     * ?????????????????????
     */
    ProtoBufTest.prototype.onResourceLoadProgress = function (itemsLoaded, itemsTotal) {
        //App.ControllerManager.applyFunc(ControllerConst.Loading, LoadingConst.SetProgress, itemsLoaded, itemsTotal);
    };
    /**
     * type ??????
     * 1.?????????
     * 2.????????????
     * 3.????????????
     * 4.????????????
     * 5.??????
     */
    // ??????????????????
    ProtoBufTest.browView = function (record) {
        // NettyHttp.Http.create()
        // .success(this.browSuccess, this)
        // .error(this.browFailed, this)
        // .add('record='+record)
        // .dataFormat(egret.URLLoaderDataFormat.TEXT)
        // .post('http://localhost:8083');//????????????post??????
    };
    // ??????????????????
    ProtoBufTest.click = function (record) {
        // NettyHttp.Http.create()
        // .success(this.browSuccess, this)
        // .error(this.browFailed, this)
        // .add('record='+record)
        // .dataFormat(egret.URLLoaderDataFormat.TEXT)
        // .post('http://localhost:8083');//????????????post??????
    };
    ProtoBufTest.browSuccess = function () {
    };
    ProtoBufTest.browFailed = function () {
    };
    ProtoBufTest.prototype.userLogin = function (name, pass) {
        // NettyHttp.Http.create()
        // .success(this.onSuccess, this)
        // .error(this.onLoadError, this)
        // .add('username='+name)
        // .add('userpass='+pass)
        // .dataFormat(egret.URLLoaderDataFormat.TEXT)
        // .post('http://localhost:8083');//????????????post??????
    };
    ProtoBufTest.prototype.onLoadError = function () {
        Log.debug('error');
    };
    ProtoBufTest.prototype.onSuccess = function (data) {
        Log.debug(data);
    };
    ProtoBufTest.prototype.clientTest = function () {
        //??????????????????
        // var msg = simple.user_login_c2s.fromObject({
        //     accid: 1,
        //     tstamp: 2,
        //     ticket: "yangsong"
        // });
        // //?????????
        // var buffer = simple.user_login_c2s.encode(msg).finish();
        // Log.debug("??????????????????", buffer);
        // //????????????
        // var message = simple.user_login_c2s.decode(buffer);
        // Log.debug("?????????????????????", message);
    };
    ProtoBufTest.prototype.getRoleInfo = function () {
        var nickname = "??????";
        var roleManager = RoleInfoManager.getSingtonInstance();
        roleManager.getRoleInfo(nickname);
    };
    ProtoBufTest.prototype.updateRoleInfo = function () {
        var roleinfo = {
            "nickname": "??????",
            "diamondCount": 999,
            "goldCount": 998,
            "ext": "nothing"
        };
        var roleManager = RoleInfoManager.getSingtonInstance();
        roleManager.updateRoleInfo(roleinfo);
    };
    ProtoBufTest.prototype.updatePet = function () {
        var roleinfo = {
            "num": 20004,
            "name": "?????????",
            "level": 21,
            "roleId": 1,
            "statu": 1
        };
        var roleManager = RoleInfoManager.getSingtonInstance();
        roleManager.updatePet(roleinfo);
    };
    ProtoBufTest.prototype.addPet = function () {
        var roleinfo = {
            "num": 20005,
            "name": "????????????",
            "level": 83,
            "roleId": 2,
            "statu": 0
        };
        var roleManager = RoleInfoManager.getSingtonInstance();
        roleManager.addPet(roleinfo);
    };
    ProtoBufTest.prototype.socketTest = function () {
        //??????????????????????????????
        function send() {
            // var msg: any = {};
            // msg.key = "simple.user_login_c2s";
            // msg.body = {
            //     "accid": 888,
            //     "tstamp": 999,
            //     "ticket": "yangsong"
            // };
            // App.Socket.send(msg);
        }
        // App.Socket.connect();
        // App.MessageCenter.addListener(SocketConst.SOCKET_CONNECT, () => {
        //     Log.debug("?????????????????????");
        //     send();
        //     // this.getRoleInfo();
        //     // this.updateRoleInfo();
        //     // this.updatePet();
        //     // this.addPet();
        // }, this);
        // App.MessageCenter.addListener(SocketConst.SOCKET_RECONNECT, () => {
        //     Log.debug("???????????????????????????");
        //     send();
        //     this.getRoleInfo();
        // }, this);
        // App.MessageCenter.addListener(SocketConst.SOCKET_START_RECONNECT, () => {
        //     Log.debug("??????????????????????????????");
        // }, this);
        // App.MessageCenter.addListener(SocketConst.SOCKET_CLOSE, () => {
        //     Log.debug("????????????????????????");
        // }, this);
        // App.MessageCenter.addListener(SocketConst.SOCKET_NOCONNECT, () => {
        //     Log.debug("?????????????????????");
        // }, this);
        // App.MessageCenter.addListener("10001", function (msg): void {
        //     Log.debug("?????????????????????:", msg);
        // }, this);
    };
    return ProtoBufTest;
}());
__reflect(ProtoBufTest.prototype, "ProtoBufTest");
/**
 * Created by yangsong on 15-3-27.
 * RpgDemo
 */
var RpgTest = (function () {
    function RpgTest() {
        //??????MapId
        this.mapId = this.random_num(1191, 1193);
        this.mapGroupKey = "map_" + this.mapId;
        this.initMapResource();
        //????????????
        var groupName = "preload_RpgTest";
        var subGroups = ["preload_core", "preload_ui", "preload_rpg", this.mapGroupKey];
        App.ResourceUtils.loadGroups(groupName, subGroups, this.onResourceLoadComplete, this.onResourceLoadProgress, this);
    }
    RpgTest.prototype.initMapResource = function () {
        var mapResPath = "https://yqllm.wangqucc.com/gameres/dld/resource/assets/rpgGame/map/" + this.mapId + "/";
        var mapResKey = this.mapGroupKey + "_";
        var mapResKeys = [];
        var mapRes = [
            {
                name: "data.json",
                type: "json"
            },
            {
                name: "mini.jpg",
                type: "image"
            }
        ];
        mapRes.forEach(function (res) {
            var resKey = mapResKey + res.name;
            App.ResourceUtils.createResource(resKey, res.type, mapResPath + res.name);
            mapResKeys.push(resKey);
        });
        App.ResourceUtils.createGroup(this.mapGroupKey, mapResKeys);
    };
    /**
     * ?????????????????????
     */
    RpgTest.prototype.onResourceLoadComplete = function () {
        this.initModule();
        //App.Init();
        //??????????????????
        App.SoundManager.setBgOn(true);
        App.SoundManager.setEffectOn(true);
        //????????????
        App.SceneManager.runScene(SceneConsts.RpgGame, this.mapId);
    };
    /**
     * ?????????????????????
     */
    RpgTest.prototype.onResourceLoadProgress = function (itemsLoaded, itemsTotal) {
        App.ControllerManager.applyFunc(ControllerConst.Loading, LoadingConst.SetProgress, itemsLoaded, itemsTotal);
    };
    /**
     * ?????????????????????
     */
    RpgTest.prototype.initModule = function () {
        App.ControllerManager.register(ControllerConst.RpgGame, new RpgGameController());
    };
    /**
     * ?????????????????????
     */
    RpgTest.prototype.random_num = function (min, max) {
        var Range = max - min;
        var Rand = Math.random();
        return (min + Math.round(Rand * Range));
    };
    return RpgTest;
}());
__reflect(RpgTest.prototype, "RpgTest");
var AdsController = (function (_super) {
    __extends(AdsController, _super);
    function AdsController() {
        var _this = _super.call(this) || this;
        _this.adsView = new AdsView(_this, LayerManager.UI_Main);
        App.ViewManager.register(ViewConst.AdsView, _this.adsView);
        return _this;
    }
    return AdsController;
}(BaseController));
__reflect(AdsController.prototype, "AdsController");
var AdsView = (function (_super) {
    __extends(AdsView, _super);
    function AdsView($controller, $parent) {
        var _this = _super.call(this, $controller, $parent) || this;
        _this.user = UserModel.instance();
        _this.skinName = "resource/skins/AdsViewSkin.exml";
        return _this;
    }
    /**
     *???????????????????????????????????????????????????
     *
     */
    AdsView.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.bg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onExitBtnClick, this);
        this.adsBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onWatchBtnClick, this);
    };
    AdsView.prototype.open = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        _super.prototype.open.call(this, param);
        this.setVisible(true);
        if (this.user.adnumber >= 5) {
            this.adsBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onWatchBtnClick, this);
            this.adsBtn.currentState = "disabled";
        }
        this.leftNum.text = (5 - this.user.adnumber) + "/5";
    };
    AdsView.prototype.onExitBtnClick = function () {
        var _this = this;
        if (this.alpha < 1)
            return;
        var tween = egret.Tween.get(this);
        tween.to({ alpha: 0 }, 300).call(function () {
            App.ViewManager.closeView(_this);
            _this.alpha = 1;
        });
    };
    AdsView.prototype.onWatchBtnClick = function () {
        var _this = this;
        App.SoundManager.playEffect("sound_dianji");
        if (this.alpha < 1)
            return;
        var tween = egret.Tween.get(this);
        tween.to({ alpha: 0 }, 300).call(function () {
            App.ViewManager.closeView(_this);
            _this.alpha = 1;
        });
    };
    AdsView.prototype.adBack = function () {
        this.user.adnumber += 1;
        this.leftNum.text = (5 - this.user.adnumber) + "/5";
        if (this.user.adnumber == 0) {
            this.adsBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onWatchBtnClick, this);
            this.adsBtn.currentState = "disabled";
            return;
        }
        this.changeUserInfo();
    };
    //??????????????????
    AdsView.prototype.changeUserInfo = function () {
        this.user.usertreasure += 50; //????????????50
        var rManager = RoleInfoManager.getSingtonInstance();
        var ob = {
            "nickname": this.user.username,
            "diamondCount": this.user.userbrands,
            "goldCount": this.user.usertreasure,
            "ext": this.user.adnumber
        };
        rManager.updateRoleInfo(ob);
    };
    return AdsView;
}(BaseEuiView));
__reflect(AdsView.prototype, "AdsView");
var ExplainController = (function (_super) {
    __extends(ExplainController, _super);
    function ExplainController() {
        var _this = _super.call(this) || this;
        _this.explainView = new ExplainView(_this, LayerManager.UI_Main);
        App.ViewManager.register(ViewConst.ExplainView, _this.explainView);
        return _this;
    }
    return ExplainController;
}(BaseController));
__reflect(ExplainController.prototype, "ExplainController");
var ExplainView = (function (_super) {
    __extends(ExplainView, _super);
    function ExplainView($controller, $parent) {
        var _this = _super.call(this, $controller, $parent) || this;
        _this.skinName = "resource/skins/ExplainViewSkin.exml";
        return _this;
    }
    ExplainView.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.exitBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.btnClick, this);
    };
    ExplainView.prototype.btnClick = function () {
        App.SoundManager.playEffect("sound_dianji");
        this.parent.removeChild(this);
    };
    return ExplainView;
}(BaseEuiView));
__reflect(ExplainView.prototype, "ExplainView");
var LevelRewardController = (function (_super) {
    __extends(LevelRewardController, _super);
    function LevelRewardController() {
        var _this = _super.call(this) || this;
        _this.levelRewardView = new LevelRewardView(_this, LayerManager.UI_Main);
        App.ViewManager.register(ViewConst.LevelRewardView, _this.levelRewardView);
        return _this;
    }
    return LevelRewardController;
}(BaseController));
__reflect(LevelRewardController.prototype, "LevelRewardController");
var LevelRewardStatus;
(function (LevelRewardStatus) {
    LevelRewardStatus[LevelRewardStatus["levelUp"] = 1] = "levelUp";
    LevelRewardStatus[LevelRewardStatus["levelUpFail"] = 2] = "levelUpFail";
    LevelRewardStatus[LevelRewardStatus["unlock"] = 3] = "unlock";
    LevelRewardStatus[LevelRewardStatus["unlockFail"] = 4] = "unlockFail";
    LevelRewardStatus[LevelRewardStatus["getaward"] = 5] = "getaward";
})(LevelRewardStatus || (LevelRewardStatus = {}));
var LevelRewardView = (function (_super) {
    __extends(LevelRewardView, _super);
    function LevelRewardView($controller, $parent) {
        var _this = _super.call(this, $controller, $parent) || this;
        _this.currentStatus = "reward"; //????????????
        _this.skinName = "resource/skins/LevelRewardViewSkin.exml";
        return _this;
    }
    LevelRewardView.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.bg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onExitBtnClick, this);
    };
    LevelRewardView.prototype.open = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        _super.prototype.open.call(this, param);
        this.setVisible(true);
        if (param[0] == 1) {
            this.currentStatus = "levelUp";
        }
        else if (param[0] == 2) {
            this.currentStatus = "levelupfail";
        }
        else if (param[0] == 3) {
            this.currentStatus = "unlocksucc";
        }
        else if (param[0] == 4) {
            this.currentStatus = "unlockfail";
        }
        else {
            this.currentStatus = "reward";
        }
        this.skin.currentState = this.currentStatus;
        this.initView(param[0], param[1]);
    };
    LevelRewardView.prototype.onExitBtnClick = function () {
        var _this = this;
        if (this.alpha < 1)
            return;
        var tween = egret.Tween.get(this);
        tween.to({ alpha: 0 }, 300).call(function () {
            App.ViewManager.closeView(_this);
            _this.alpha = 1;
        });
    };
    LevelRewardView.prototype.initView = function (isLevelUp, title) {
        if (isLevelUp == 1) {
            this.initUpLevelView(title);
        }
        else {
            this.initRewardView();
            this.levelUpLabel.text = title;
        }
    };
    LevelRewardView.prototype.initRewardView = function () {
    };
    LevelRewardView.prototype.initUpLevelView = function (ob) {
        //???????????????????????????
        this.levelUpLabel.textFlow = [
            { text: "??????" },
            { text: "??????", style: { "textColor": 0x47ff54 } },
            { text: "???????????????" },
            { text: "Lv" + ob, style: { "textColor": 0xfffd47 } },
        ];
    };
    return LevelRewardView;
}(BaseEuiView));
__reflect(LevelRewardView.prototype, "LevelRewardView");
var MatchingController = (function (_super) {
    __extends(MatchingController, _super);
    function MatchingController() {
        var _this = _super.call(this) || this;
        _this.view = new MatchingView(_this, LayerManager.UI_Main);
        App.ViewManager.register(ViewConst.MatchingView, _this.view);
        return _this;
    }
    return MatchingController;
}(BaseController));
__reflect(MatchingController.prototype, "MatchingController");
var MatchingView = (function (_super) {
    __extends(MatchingView, _super);
    function MatchingView($controller, $parent) {
        var _this = _super.call(this, $controller, $parent) || this;
        _this.skinName = "resource/skins/CatchingViewSkin.exml";
        return _this;
    }
    /**
     *???????????????????????????????????????????????????
     *
     */
    MatchingView.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        if (this.lighting.mask == null) {
            /// ????????????????????????
            var mask = new egret.Shape;
            mask.graphics.lineStyle(0x000000);
            mask.graphics.beginFill(0xffffff, 0.5);
            mask.graphics.drawRect(0, 0, this._Catchingprogress.width, this._Catchingprogress.height);
            mask.x = this._Catchingprogress.x;
            mask.y = this._Catchingprogress.y;
            mask.graphics.endFill();
            this._Catchingprogress.parent.addChild(mask);
            this.lighting.mask = mask;
        }
        // this.bg.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onExitBtnClick, this);
    };
    MatchingView.prototype.open = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        _super.prototype.open.call(this, param);
        this._OuterGlow.visible = false;
        this._OuterGlow0.visible = false;
        this._OuterGlow1.visible = false;
        this._OuterGlow2.visible = false;
        this._OuterGlow3.visible = false;
        this._OuterGlow4.visible = false;
        this._Icon.source = "MInfo_card_unknown_png";
        this._Icon0.source = "MInfo_card_unknown_png";
        this._Icon1.source = "MInfo_card_unknown_png";
        this._Icon2.source = "MInfo_card_unknown_png";
        this._Icon3.source = "MInfo_card_unknown_png";
        this._Icon4.source = "MInfo_card_unknown_png";
        this._lab2.alpha = 0;
        this._lab1.alpha = 1;
        this._lab1.y = 520;
        this._lab2.y = 545;
        this.setVisible(true);
        this.TweenProgress();
    };
    MatchingView.prototype.onExitBtnClick = function () {
        var _this = this;
        if (this.alpha < 1)
            return;
        var tween = egret.Tween.get(this);
        tween.to({ alpha: 0 }, 300).call(function () {
            App.ViewManager.closeView(_this);
            _this.alpha = 1;
        });
    };
    MatchingView.prototype.createMonsters = function () {
        var ns = [];
        var randomArr = [20002, 20004, 20005];
        for (var i = 0; i < 5; i++) {
            //let m = App.RandomUtils.limitInteger(20002,20005);
            var m = App.RandomUtils.randomArray(randomArr);
            ns.push(m);
        }
        return ns;
    };
    MatchingView.prototype.TweenProgress = function () {
        var _this = this;
        this.loadView();
        this._Catchingprogress.value = 0;
        this._Catchingprogress.slideDuration = 0;
        this._Catchingprogress.labelFunction = function (value, maximum) {
            _this.lighting.parent.x = _this._Catchingprogress.x + (_this._Catchingprogress.width / _this._Catchingprogress.maximum) * value;
            return value + "/" + maximum;
        };
        egret.Tween.get(this._Catchingprogress).wait(500).to({ value: 100 }, 3000).call(function () {
            App.ViewManager.closeView(_this);
            new RpgTest();
            App.SoundManager.playBg("sound_bg");
        });
    };
    MatchingView.prototype.loadView = function () {
        var _this = this;
        var s1 = this.getText();
        var s2 = this.getText();
        if (s1 == s2) {
            s2 = this.getText();
        }
        this._lab1.text = s1;
        this._lab2.text = s2;
        var k = this.createMonsters();
        MonsterConfiger.randomMonsters = k;
        this._OuterGlow.visible = true;
        this._Icon.source = "MInfo_card_" + UserModel.instance().monsterModel.monsterId + "_png";
        setTimeout(function (out) {
            _this._OuterGlow0.visible = true;
            _this._Icon0.source = "MInfo_card_" + k[1] + "_png";
            _this._OuterGlow1.visible = true;
            _this._Icon1.source = "MInfo_card_" + k[0] + "_png";
        }, 1000);
        setTimeout(function (out) {
            _this._OuterGlow2.visible = true;
            _this._Icon2.source = "MInfo_card_" + k[2] + "_png";
            _this._OuterGlow3.visible = true;
            _this._Icon3.source = "MInfo_card_" + k[3] + "_png";
        }, 2000);
        setTimeout(function (out) {
            _this._OuterGlow4.visible = true;
            _this._Icon4.source = "MInfo_card_" + k[4] + "_png";
        }, 2700);
        setTimeout(function (out) {
            egret.Tween.get(_this._lab1, { loop: false }).to({ y: 500, alpha: 0 }, 500);
        }, 1000);
        setTimeout(function (out) {
            egret.Tween.get(_this._lab2, { loop: false }).to({ y: 520, alpha: 1 }, 500);
        }, 1000);
    };
    MatchingView.prototype.getText = function () {
        var ars = ["????????????????????????", "?????????????????????", "???????????????????????????", "????????????????????????", "?????????????????????", "???????????????????????????", "???????????????????????????"];
        return RandomUtils.getSingtonInstance().randomArray(ars);
    };
    return MatchingView;
}(BaseEuiView));
__reflect(MatchingView.prototype, "MatchingView");
var SettingController = (function (_super) {
    __extends(SettingController, _super);
    function SettingController() {
        var _this = _super.call(this) || this;
        _this.settingiew = new SettingView(_this, LayerManager.UI_Main);
        App.ViewManager.register(ViewConst.SettingView, _this.settingiew);
        return _this;
    }
    return SettingController;
}(BaseController));
__reflect(SettingController.prototype, "SettingController");
var SettingView = (function (_super) {
    __extends(SettingView, _super);
    function SettingView($controller, $parent) {
        var _this = _super.call(this, $controller, $parent) || this;
        _this.skinName = "resource/skins/SetViewSkin.exml";
        return _this;
    }
    SettingView.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this._MusicSlider.snapInterval = 0.1;
        this._SoundSliser.snapInterval = 0.1;
        this.bg.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onExitBtnClick, this);
        this._MusicSlider.addEventListener(eui.UIEvent.CHANGE, this.changeHandler, this);
        this._SoundSliser.addEventListener(eui.UIEvent.CHANGE, this.changeHandler, this);
        this._click.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onExitBtnClick, this);
    };
    SettingView.prototype.changeHandler = function (evt) {
        if (evt.target == this._MusicSlider) {
            App.SoundManager.setBgVolume(evt.target.value);
        }
        else if (evt.target == this._SoundSliser) {
            App.SoundManager.setEffectVolume(evt.target.value);
        }
    };
    SettingView.prototype.open = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        _super.prototype.open.call(this, param);
        this.setVisible(true);
        this._MusicSlider.value = App.SoundManager.getBgVolume();
        this._SoundSliser.value = App.SoundManager.getEffectVolume();
    };
    SettingView.prototype.onExitBtnClick = function () {
        var _this = this;
        App.SoundManager.playEffect("sound_dianji");
        if (this.alpha < 1)
            return;
        var tween = egret.Tween.get(this);
        tween.to({ alpha: 0 }, 300).call(function () { App.ViewManager.closeView(_this); _this.alpha = 1; });
    };
    return SettingView;
}(BaseEuiView));
__reflect(SettingView.prototype, "SettingView");
var PlayerRanking = (function (_super) {
    __extends(PlayerRanking, _super);
    function PlayerRanking() {
        var _this = _super.call(this) || this;
        _this.skinName = "resource/skins/PlayerRankingSkin.exml";
        return _this;
    }
    return PlayerRanking;
}(eui.Component));
__reflect(PlayerRanking.prototype, "PlayerRanking");
var SettlementController = (function (_super) {
    __extends(SettlementController, _super);
    function SettlementController() {
        var _this = _super.call(this) || this;
        _this.settingiew = new SettlementView(_this, LayerManager.UI_Main);
        App.ViewManager.register(ViewConst.SettlementView, _this.settingiew);
        return _this;
    }
    return SettlementController;
}(BaseController));
__reflect(SettlementController.prototype, "SettlementController");
var SettlementView = (function (_super) {
    __extends(SettlementView, _super);
    function SettlementView($controller, $parent) {
        var _this = _super.call(this, $controller, $parent) || this;
        _this.use = UserModel.instance();
        _this.skinName = "resource/skins/SettlementView.exml";
        _this.Init();
        return _this;
    }
    SettlementView.prototype.Init = function () {
        this._replay.addEventListener(egret.TouchEvent.TOUCH_TAP, this.ReplayBtnClickHandle, this);
        this._return.addEventListener(egret.TouchEvent.TOUCH_TAP, this.ReturnBtnClickHandle, this);
        App.MessageCenter.addListener(EventNames.Fight_End, this.fightEnd, this);
    };
    //??????
    SettlementView.prototype.ReturnBtnClickHandle = function (e) {
        App.SoundManager.playEffect("sound_dianji");
        App.ViewManager.closeView(this);
    };
    //????????????
    SettlementView.prototype.ReplayBtnClickHandle = function (e) {
        App.SoundManager.playEffect("sound_dianji");
        App.ViewManager.closeView(this);
        App.ViewManager.open(ViewConst.MatchingView);
    };
    SettlementView.prototype.open = function () {
        _super.prototype.open.call(this);
        App.SoundManager.stopBg();
        this.heroimage.source = "settlment_hero_" + this.use.monsterModel.monsterId + "_png";
        this.modelNameIcon.source = "hero_name_" + this.use.monsterModel.monsterId;
        this.player_name.text = this.use.username;
    };
    //?????????????????????????????????
    SettlementView.prototype.fightEnd = function (ski) {
        var ob = this.rewardWithKillNumber(ski);
        this.use.usertreasure += ob["r1"]; //??????
        this.use.userbrands += ob["r2"]; //??????
        this._killCount.text = ski + "";
        this.gemText.text = ob["r1"];
        this.trophyText.text = ob["r2"];
        this.changeRoleInfo();
    };
    SettlementView.prototype.changeRoleInfo = function () {
        var user = UserModel.instance();
        var rManager = RoleInfoManager.getSingtonInstance();
        var ob = {
            "nickname": user.username,
            "diamondCount": user.userbrands <= 0 ? 0 : user.userbrands,
            "goldCount": user.usertreasure,
            "ext": user.adnumber
        };
        rManager.updateRoleInfo(ob);
    };
    SettlementView.prototype.rewardWithKillNumber = function (num) {
        if (num < 0 || num >= 6) {
            return { r1: 0, r2: 0 };
        }
        var rewards = [
            {
                r1: 5, r2: -1
            },
            {
                r1: 10, r2: 0
            },
            {
                r1: 20, r2: 1
            },
            {
                r1: 30, r2: 2
            },
            {
                r1: 40, r2: 3
            },
            {
                r1: 50, r2: 4
            }
        ];
        return rewards[num];
    };
    return SettlementView;
}(BaseEuiView));
__reflect(SettlementView.prototype, "SettlementView");

;window.Main = Main;