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
     * 死亡消失
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
    //只移动不切换动作
    BaseMoveGameObject.prototype.moveTo = function ($speed, $endX, $endY) {
        this.speed = $speed;
        this.endX = $endX;
        this.endY = $endY;
        this.radian = 0;
    };
    //行走到某个点
    BaseMoveGameObject.prototype.walkTo = function ($speed, $endX, $endY) {
        this.moveTo($speed, $endX, $endY);
        this.scaleX = this.endX >= this.x ? 1 : -1;
        this.gotoMove();
    };
    //行走
    BaseMoveGameObject.prototype.walk = function (xFlag, yFlag, $speed) {
        this.speed = $speed;
        this.endX = 0;
        this.endY = 0;
        this.radian = Math.atan2(yFlag, xFlag);
        this.scaleX = xFlag > 0 ? 1 : -1;
        this.gotoMove();
    };
    //跳起不切换动作
    BaseMoveGameObject.prototype.moveToZ = function ($speedZ) {
        this.speedZ = $speedZ;
    };
    //强制落地
    BaseMoveGameObject.prototype.standLand = function () {
        this.speedZ = 0;
        this.z = 0;
    };
    //跳起
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
 * View基类，继承自eui.Component
 */
var BaseEuiView = (function (_super) {
    __extends(BaseEuiView, _super);
    /**
     * 构造函数
     * @param $controller 所属模块
     * @param $parent 父级
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
         * 获取我的父级
         * @returns {egret.DisplayObjectContainer}
         */
        get: function () {
            return this._myParent;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 设置初始加载资源
     * @param resources
     */
    BaseEuiView.prototype.setResources = function (resources) {
        this._resources = resources;
    };
    /**
     * 是否已经初始化
     * @returns {boolean}
     */
    BaseEuiView.prototype.isInit = function () {
        return this._isInit;
    };
    /**
     * 触发本模块消息
     * @param key 唯一标识
     * @param param 参数
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
     * 触发其他模块消息
     * @param controllerKey 模块标识
     * @param key 唯一标识
     * @param param 所需参数
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
     * 面板是否显示
     * @return
     *
     */
    BaseEuiView.prototype.isShow = function () {
        return this.stage != null && this.visible;
    };
    /**
     * 添加到父级
     */
    BaseEuiView.prototype.addToParent = function () {
        this._myParent.addChild(this);
    };
    /**
     * 从父级移除
     */
    BaseEuiView.prototype.removeFromParent = function () {
        App.DisplayUtils.removeFromParent(this);
    };
    /**
     *对面板进行显示初始化，用于子类继承
     *
     */
    BaseEuiView.prototype.initUI = function () {
        this._isInit = true;
    };
    /**
     *对面板数据的初始化，用于子类继承
     *
     */
    BaseEuiView.prototype.initData = function () {
    };
    /**
     * 销毁
     */
    BaseEuiView.prototype.destroy = function () {
        this._controller = null;
        this._myParent = null;
        this._resources = null;
    };
    /**
     * 面板开启执行函数，用于子类继承
     * @param param 参数
     */
    BaseEuiView.prototype.open = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
    };
    /**
     * 面板关闭执行函数，用于子类继承
     * @param param 参数
     */
    BaseEuiView.prototype.close = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
    };
    /**
     /**
     * 加载面板所需资源
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
     * 设置是否隐藏
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
     *对面板进行显示初始化，用于子类继承
     *
     */
    BasePanelView.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.closeBtn.addEventListener(egret.TouchEvent.TOUCH_END, this.closeBtnClickHandler, this);
    };
    /**
     *对面板数据的初始化，用于子类继承
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
            _this._completeFunction = null; //播放完毕的回调
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
         * 播放
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
         * 停止
         * @param    stopChild    是否停止子动画
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
         * 是否再播放
         * */
        SwfMovieClip.prototype.isPlay = function () {
            return this._isPlay;
        };
        /**
         * 总共有多少帧
         * */
        SwfMovieClip.prototype.totalFrames = function () {
            return this._frames.length;
        };
        /**
         * 返回当前播放的是哪一个标签
         * */
        SwfMovieClip.prototype.currentLabel = function () {
            return this._currentLabel;
        };
        /**
         * 获取所有标签
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
         * 是否包含某个标签
         * */
        SwfMovieClip.prototype.hasLabel = function (label) {
            var ls = this.labels();
            return !(ls.indexOf(label) == -1);
        };
        /*****************************************以下为扩展代码*****************************************/
        /**
         * 获取某一标签的开始帧
         * @param label 标签名
         * @returns {any}
         */
        SwfMovieClip.prototype.getLabelStartFrame = function (label) {
            return this.getLabelData(label)[1];
        };
        /**
         * 获取某一标签的结束帧
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
 * Sound基类
 */
var BaseSound = (function () {
    /**
     * 构造函数
     */
    function BaseSound() {
        this._cache = {};
        this._loadingCache = new Array();
        App.TimerManager.doTimer(1 * 60 * 1000, 0, this.dealSoundTimer, this);
    }
    /**
     * 处理音乐文件的清理
     */
    BaseSound.prototype.dealSoundTimer = function () {
        var currTime = egret.getTimer();
        var keys = Object.keys(this._cache);
        for (var i = 0, len = keys.length; i < len; i++) {
            var key = keys[i];
            if (!this.checkCanClear(key))
                continue;
            if (currTime - this._cache[key] >= SoundManager.CLEAR_TIME) {
                //Log.debug(key + "已clear")
                delete this._cache[key];
                RES.destroyRes(key);
            }
        }
    };
    /**
     * 获取Sound
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
     * 资源加载完成
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
     * 资源加载完成后处理播放，子类重写
     * @param key
     */
    BaseSound.prototype.loadedPlay = function (key) {
    };
    /**
     * 检测一个文件是否要清除，子类重写
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
 * 基类
 */
var SingtonClass = (function () {
    function SingtonClass() {
    }
    /**
     * 获取一个单例
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
 * Controller基类
 */
var BaseController = (function () {
    /**
     * 构造函数
     */
    function BaseController() {
        this._messages = {};
    }
    /**
     * 注册本模块消息
     * @param key 唯一标识
     * @param callbackFunc 侦听函数
     * @param callbackObj 侦听函数所属对象
     */
    BaseController.prototype.registerFunc = function (key, callbackFunc, callbackObj) {
        this._messages[key] = [callbackFunc, callbackObj];
    };
    /**
     * 触发本模块消息
     * @param key 唯一标识
     * @param param 所需参数
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
            Log.warn("消息" + key + "不存在侦听");
            return null;
        }
    };
    /**
     * 触发其他模块消息
     * @param controllerKey 模块标识
     * @param key 唯一标识
     * @param param 所需参数
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
     * 设置该模块使用的Model对象
     * @param model
     */
    BaseController.prototype.setModel = function (model) {
        this._model = model;
    };
    /**
     * 获取该模块的Model对象
     * @returns {BaseModel}
     */
    BaseController.prototype.getModel = function () {
        return this._model;
    };
    /**
     * 获取指定Controller的Model对象
     * @param controllerD Controller唯一标识
     * @returns {BaseModel}
     */
    BaseController.prototype.getControllerModel = function (controllerD) {
        return App.ControllerManager.getControllerModel(controllerD);
    };
    /**
     * View注册
     * @param viewClassZ View的类
     * @param viewId View的ID
     * @param viewParent View的父级
     * @returns {IBaseView}
     */
    BaseController.prototype.registerView = function (viewClass, viewId, viewParent) {
        var view = new viewClass(this, viewParent);
        App.ViewManager.register(viewId, view);
        return view;
    };
    /**
     * View打开
     * @param viewId View的ID
     * @param param 参数
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
     * View关闭
     * @param viewId View的ID
     * @param param 参数
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
 * Model基类
 */
var BaseModel = (function () {
    /**
     * 构造函数
     * @param $controller 所属模块
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
 * Proxy基类
 */
var BaseProxy = (function () {
    /**
     * 构造函数
     * @param $controller 所属模块
     */
    function BaseProxy($controller) {
        this._controller = $controller;
    }
    /**
     * 触发本模块消息
     * @param key 唯一标识
     * @param param 参数
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
     * 触发其他模块消息
     * @param controllerKey 模块标识
     * @param key 唯一标识
     * @param param 所需参数
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
     * 注册从服务器返回消息的监听
     * @param key 消息标识
     * @param callbackFunc 处理函数
     * @param callbackObj 处理函数所属对象
     */
    BaseProxy.prototype.receiveServerMsg = function (key, callbackFunc, callbackObj) {
        App.MessageCenter.addListener(key, callbackFunc, callbackObj);
    };
    /**
     * 注册从服务器返回消息的监听，仅一次，执行完成后删除
     * @param key 消息标识
     * @param callbackFunc 处理函数
     * @param callbackObj 处理函数所属对象
     */
    BaseProxy.prototype.receiveServerMsgOnce = function (key, callbackFunc, callbackObj) {
        var callback = function (param) {
            this.removeServerMsg(key, callback, this);
            callbackFunc.apply(callbackObj, param);
        };
        this.receiveServerMsg(key, callback, this);
    };
    /**
     * 注册从Http服务端返回的Update消息
     * @param key 消息标识
     * @param callbackFunc 处理函数
     * @param callbackObj 处理函数所属对象
     */
    BaseProxy.prototype.receiveServerHttpUpdateMsg = function (key, callbackFunc, callbackObj) {
        this.receiveServerMsg(key + "_HttpUpdate", callbackFunc, callbackObj);
    };
    /**
     * 注册从Http服务端返回的Update消息，仅一次，执行完成后删除
     * @param key 消息标识
     * @param callbackFunc 处理函数
     * @param callbackObj 处理函数所属对象
     */
    BaseProxy.prototype.receiveServerHttpUpdateMsgOnce = function (key, callbackFunc, callbackObj) {
        this.receiveServerMsgOnce(key + "_HttpUpdate", callbackFunc, callbackObj);
    };
    /**
     * 移除服务端返回消息的监听
     * @param key 消息标识
     * @param callbackFunc 处理函数
     * @param callbackObj 处理函数所属对象
     */
    BaseProxy.prototype.removeServerMsg = function (key, callbackFunc, callbackObj) {
        App.MessageCenter.removeListener(key, callbackFunc, callbackObj);
    };
    /**
     * 移除从Http服务端返回的Update消息
     * @param key 消息标识
     * @param callbackFunc 处理函数
     * @param callbackObj 处理函数所属对象
     */
    BaseProxy.prototype.removeServerHttpUpdateMsg = function (key, callbackFunc, callbackObj) {
        this.removeServerMsg(key + "_HttpUpdate", callbackFunc, callbackObj);
    };
    /**
     * 发送消息到Socket服务器
     */
    BaseProxy.prototype.sendSocketMsg = function (msg) {
        // App.Socket.send(msg);
    };
    /**
     * 发送消息到Http服务端
     * @param type 消息标识 例如: User.login
     * @param paramObj 消息参数 例如: var paramObj:any = {"uName":uName, "uPass":uPass};
     */
    BaseProxy.prototype.sendHttpMsg = function (type, paramObj) {
        if (paramObj === void 0) { paramObj = null; }
        App.Http.send(type, this.getURLVariables(type, paramObj));
    };
    /**
     * 将参数转换为URLVariables
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
     *对面板进行显示初始化，用于子类继承
     *
     */
    BaseTaskView.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        //布局
        var layout = new eui.VerticalLayout();
        layout.horizontalAlign = "center";
        //创建一个列表
        this.taskList = new eui.List();
        this.taskList.itemRenderer = TaskItemRenderer;
        this.taskList.itemRendererSkinName = "resource/skins/TaskItemRendererSkin.exml";
        this.taskList.dataProvider = this.dataProvider;
        this.taskList.layout = layout;
        //创建一个 Scroller
        this.scroller = new eui.Scroller();
        this.scroller.percentWidth = this.scroller.percentHeight = 100;
        this.scroller.top = 5;
        this.scroller.viewport = this.taskList;
        this.contentGroup.addChild(this.scroller);
    };
    /**
     *对面板数据的初始化，用于子类继承
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
 * View基类，继承自egret.Sprite
 */
var BaseSpriteView = (function (_super) {
    __extends(BaseSpriteView, _super);
    /**
     * 构造函数
     * @param $controller 所属模块
     * @param $parent 父级
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
     * 设置初始加载资源
     * @param resources
     */
    BaseSpriteView.prototype.setResources = function (resources) {
        this._resources = resources;
    };
    Object.defineProperty(BaseSpriteView.prototype, "myParent", {
        /**
         * 获取我的父级
         * @returns {egret.DisplayObjectContainer}
         */
        get: function () {
            return this._myParent;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 是否已经初始化
     * @returns {boolean}
     */
    BaseSpriteView.prototype.isInit = function () {
        return this._isInit;
    };
    /**
     * 触发本模块消息
     * @param key 唯一标识
     * @param param 参数
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
     * 触发其他模块消息
     * @param controllerKey 模块标识
     * @param key 唯一标识
     * @param param 所需参数
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
     * 面板是否显示
     * @return
     *
     */
    BaseSpriteView.prototype.isShow = function () {
        return this.stage != null && this.visible;
    };
    /**
     * 添加到父级
     */
    BaseSpriteView.prototype.addToParent = function () {
        this._myParent.addChild(this);
    };
    /**
     * 从父级移除
     */
    BaseSpriteView.prototype.removeFromParent = function () {
        App.DisplayUtils.removeFromParent(this);
    };
    /**
     *对面板进行显示初始化，用于子类继承
     *
     */
    BaseSpriteView.prototype.initUI = function () {
        this._isInit = true;
    };
    /**
     *对面板数据的初始化，用于子类继承
     *
     */
    BaseSpriteView.prototype.initData = function () {
    };
    /**
     * 面板开启执行函数，用于子类继承
     * @param param 参数
     */
    BaseSpriteView.prototype.open = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
    };
    /**
     * 面板关闭执行函数，用于子类继承
     * @param param 参数
     */
    BaseSpriteView.prototype.close = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
    };
    /**
     * 销毁
     */
    BaseSpriteView.prototype.destroy = function () {
        this._controller = null;
        this._myParent = null;
        this._resources = null;
    };
    /**
     * 屏幕尺寸变化时调用
     */
    BaseSpriteView.prototype.onResize = function () {
    };
    /**
     * 加载面板所需资源
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
     * 设置是否隐藏
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
 * Scene基类
 */
var BaseScene = (function () {
    /**
     * 构造函数
     */
    function BaseScene() {
        this._layers = new Array();
    }
    /**
     * 进入Scene调用
     */
    BaseScene.prototype.onEnter = function () {
    };
    /**
     * 退出Scene调用
     */
    BaseScene.prototype.onExit = function () {
        App.ViewManager.closeAll();
        this.removeAllLayer();
    };
    /**
     * 添加一个Layer到舞台
     * @param layer
     */
    BaseScene.prototype.addLayer = function (layer) {
        App.StageUtils.getStage().addChild(layer);
        this._layers.push(layer);
    };
    /**
     * 添加一个Layer到舞台
     * @param layer
     */
    BaseScene.prototype.addLayerAt = function (layer, index) {
        App.StageUtils.getStage().addChildAt(layer, index);
        this._layers.push(layer);
    };
    /**
     * 在舞台移除一个Layer
     * @param layer
     */
    BaseScene.prototype.removeLayer = function (layer) {
        App.StageUtils.getStage().removeChild(layer);
        this._layers.splice(this._layers.indexOf(layer), 1);
    };
    /**
     * Layer中移除所有
     * @param layer
     */
    BaseScene.prototype.layerRemoveAllChild = function (layer) {
        layer.removeChildren();
    };
    /**
     * 移除所有Layer
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
     * 死亡消失
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
        this.killNum = 0; //擊殺數
        this.buffNum = 0; //buff類型技能
        this.outTime = 0; //脫戰時間
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
     *对面板进行显示初始化，用于子类继承
     *
     */
    GameUIView.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        //攻击图标
        this.addChild(this.createImageButton("ui_btnAttack_png", "ui_btnAttack1_png", App.StageUtils.getWidth() - 55, App.StageUtils.getHeight() - 53, this.heroAttack));
        //技能1图标
        this.addChild(this.createImageButton("ui_btnSkill1_png", "ui_btnSkill1_1_png", App.StageUtils.getWidth() - 120, App.StageUtils.getHeight() - 140, this.heroSkill1));
        //技能2图标
        this.addChild(this.createImageButton("ui_btnSkill2_png", "ui_btnSkill2_1_png", App.StageUtils.getWidth() - 40, App.StageUtils.getHeight() - 160, this.heroSkill2));
        //技能3图标
        this.addChild(this.createImageButton("ui_btnSkill3_png", "ui_btnSkill3_1_png", App.StageUtils.getWidth() - 180, App.StageUtils.getHeight() - 40, this.heroSkill3));
        //技能4图标
        this.addChild(this.createImageButton("ui_btnSkill4_png", "ui_btnSkill4_1_png", App.StageUtils.getWidth() - 200, App.StageUtils.getHeight() - 120, this.heroSkill4));
        //摇杆
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
        //摇杆控制
        App.RockerUtils.init(moveBg, moveFlag, this.dealKey, this);
        //键盘控制
        App.KeyboardUtils.addKeyUp(this.onKeyUp, this);
    };
    /**
     *对面板进行显示初始化，用于子类继承
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
     * 解析素材
     * @param source 待解析的新素材标识符
     * @param compFunc 解析完成回调函数，示例：callBack(content:any,source:string):void;
     * @param thisObject callBack的 this 引用
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
//  * 合并过的json文件解析
//  */
// class MergeJsonAnalyzer extends RES.JsonAnalyzer {
//     //按名字指定要特殊处理的json数据
//     private mergeJsons:Array<string> = ["MergeConfig_json"];
//     /**
//      * 解析并缓存加载成功的数据
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
     * 解析主题
     * @param url 待解析的主题url
     * @param onSuccess 解析完成回调函数，示例：compFunc(e:egret.Event):void;
     * @param onError 解析失败回调函数，示例：errorFunc():void;
     * @param thisObject 回调的this引用
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
     * 定时器管理类
     */
    var TimerMgr = (function () {
        function TimerMgr() {
            // 动作编号
            this.no = -1;
            this._timeInterval = 0;
            this._actArray = [];
            this._isStart = false;
            this._preTime = 0;
            //更新激活状态
            this._currState = true;
            this._time = 0;
            this._actDic = new Object();
            if (egret.Capabilities.isMobile) {
                TimerMgr.DELAY = 30;
            }
            else {
                TimerMgr.DELAY = 17;
            }
            //每秒钟进行检测处理
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
            //如果定时器停止了。则重新开启
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
         * 添加动作
         *
         * @param action 动作
         * @param delay 执行间隔
         * @param times 执行次数，为0时循环执行 	>1表示第一次不考虑延迟直接执行
         * */
        TimerMgr.prototype.addAction = function (thisObj, action, delay, times, end) {
            if (end === void 0) { end = null; }
            var no = this.getAliveNo();
            // 执行间隔, 每次的累积时间, 已执行次数, 总执行次数
            this._actArray[no] = { thisObj: thisObj, action: action, delay: delay, time: 0, current: 0, total: times, end: end, start_time: egret.getTimer() };
            this._actDic[thisObj.hashCode + "_" + action] = no;
            // this.startTime();
        };
        /**
         * 移除动作
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
         * 是否侦听了事件监听
         * */
        TimerMgr.prototype.hasAction = function (thisObj, action) {
            if (this._actDic[thisObj.hashCode + "_" + action] != undefined) {
                return true;
            }
            else
                return false;
        };
        /**
         * 得到可用的编号(0-99)
         * */
        TimerMgr.prototype.getAliveNo = function () {
            var currNo = this.no;
            var that = this;
            currNo++;
            if (currNo > TimerMgr.MAX_NO)
                currNo = 1;
            var obj = that._actArray[currNo];
            // 得到一个未被占用的编号
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
            // 完成需求次数后结束该动作
            if (total != 0 && current >= total) {
                var end = item.end;
                if (end != null)
                    end.apply(item.thisObj);
                this.removeAction(item.thisObj, action);
                return;
            }
            if (total == 1) {
                if (delay > delta_t && current != 1) {
                    // 累积时间
                    item.time += delta_t;
                    if (item.time < delay)
                        return;
                }
            }
            else {
                if (delay > delta_t && current != 0) {
                    // 累积时间
                    item.time += delta_t;
                    if (item.time < delay)
                        return;
                }
            }
            // 执行动作
            action.apply(item.thisObj);
            // 累积时间清0
            item.time = 0;
            item.current++;
        };
        // 最小延迟时间
        TimerMgr.DELAY = 30; //17
        // 最大编号
        TimerMgr.MAX_NO = 2147483647;
        return TimerMgr;
    }());
    game.TimerMgr = TimerMgr;
    __reflect(TimerMgr.prototype, "game.TimerMgr");
})(game || (game = {}));
/**
 * Created by yangsong on 2014/11/22.
 * Http数据缓存类
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
 * Http数据更新类
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
 * Http请求处理
 */
var Http = (function (_super) {
    __extends(Http, _super);
    /**
     * 构造函数
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
     * 初始化服务器地址
     * @param serverUrl服务器链接地址
     */
    Http.prototype.initServer = function (serverUrl) {
        this._serverUrl = serverUrl;
    };
    Object.defineProperty(Http.prototype, "Data", {
        /**
         * 数据缓存
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
     * Http错误处理函数
     * @param e
     */
    Http.prototype.onError = function (e) {
        this.nextPost();
    };
    /**
     * 请求数据
     * @param    type
     * @param    t_variables
     */
    Http.prototype.send = function (type, urlVariables) {
        this._cache.push([type, urlVariables]);
        this.post();
    };
    /**
     * 请求服务器
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
     * 数据返回
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
            Log.debug("Http错误:" + t_obj["s"]);
        }
        this.nextPost();
    };
    /**
     * 开始下一个请求
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
 * 场景管理类
 */
var SceneManager = (function (_super) {
    __extends(SceneManager, _super);
    /**
     * 构造函数
     */
    function SceneManager() {
        var _this = _super.call(this) || this;
        _this._scenes = {};
        return _this;
    }
    /**
     * 清空处理
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
     * 注册Scene
     * @param key Scene唯一标识
     * @param scene Scene对象
     */
    SceneManager.prototype.register = function (key, scene) {
        this._scenes[key] = scene;
    };
    /**
     * 切换场景
     * @param key 场景唯一标识
     */
    SceneManager.prototype.runScene = function (key) {
        var param = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            param[_i - 1] = arguments[_i];
        }
        var nowScene = this._scenes[key];
        if (nowScene == null) {
            Log.warn("场景" + key + "不存在");
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
     * 获取当前Scene
     * @returns {number}
     */
    SceneManager.prototype.getCurrScene = function () {
        return this._currScene;
    };
    return SceneManager;
}(SingtonClass));
__reflect(SceneManager.prototype, "SceneManager");
/**
 * 素材需要提前加载好
 * 素材命名规则：类型_数值（有类型是因为一般会同时有几种数字图片，比如大小号或不同颜色）
 * 点号素材命名：类型_dot
 * 创建BitmapNumber使用createNumPic返回DisplayObjectContainer
 * 创建好的BitmapNumber数值需要变化是调用changeNum
 * 回收使用desstroyNumPic
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
     * 根据需要的数字和类型返回一个DisplayObjectContainer
     * num数字值，支持小数点
     * type素材类型
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
    //回收带数字的DisplayObjectContainer
    BitmapNumber.prototype.desstroyNumPic = function (picContainer) {
        this.clearContainer(picContainer);
        if (picContainer.parent)
            picContainer.parent.removeChild(picContainer);
        this._containerPool.push(picContainer);
    };
    /*
     * 改变带数字的DisplayObjectContainer数字值
     * 提供这个方法是为了提高效率，直接更换之前创建对象的texture，避免多余的删除和创建
     * */
    BitmapNumber.prototype.changeNum = function (picContainer, num, type) {
        var numStr = num.toString();
        var tempBm;
        //如果当前数字个数多于目标个数则把多余的回收
        if (picContainer.numChildren > numStr.length) {
            while (picContainer.numChildren > numStr.length) {
                this.recycleBM(picContainer.getChildAt(picContainer.numChildren - 1));
            }
        }
        var index = 0;
        var tempStr;
        for (index; index < numStr.length; index++) {
            //如果当前的Bitmap数量不够则获取新的Bitmap补齐
            if (index >= picContainer.numChildren)
                picContainer.addChild(this.getBitmap());
            tempStr = numStr.charAt(index);
            tempStr = tempStr == "." ? "dot" : tempStr;
            picContainer.getChildAt(index).texture = this.getTexture(tempStr, type);
        }
        this.repositionNumPic(picContainer);
    };
    //每个数字宽度不一样，所以重新排列
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
    //清理容器
    BitmapNumber.prototype.clearContainer = function (picContainer) {
        while (picContainer.numChildren) {
            this.recycleBM(picContainer.removeChildAt(0));
        }
    };
    //回收Bitmap
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
    //获得单个数字Bitmap
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
 * 背景音乐类
 */
var SoundBg = (function (_super) {
    __extends(SoundBg, _super);
    /**
     * 构造函数
     */
    function SoundBg() {
        var _this = _super.call(this) || this;
        _this._currBg = "";
        return _this;
    }
    /**
     * 停止当前音乐
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
     * 播放某个音乐
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
     * 暂停
     */
    SoundBg.prototype.pause = function () {
        if (!this._currSoundChannel) {
            return;
        }
        this._pausePosition = this._currSoundChannel.position;
        this._currSoundChannel.stop();
    };
    /**
     * 恢复
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
     * 播放
     * @param sound
     */
    SoundBg.prototype.playSound = function (sound) {
        this._currSound = sound;
        this._currSoundChannel = this._currSound.play();
        this._currSoundChannel.volume = this._volume;
    };
    /**
     * 设置音量
     * @param volume
     */
    SoundBg.prototype.setVolume = function (volume) {
        this._volume = volume;
        if (this._currSoundChannel) {
            this._currSoundChannel.volume = this._volume;
        }
    };
    /**
     * 资源加载完成后处理播放
     * @param key
     */
    SoundBg.prototype.loadedPlay = function (key) {
        if (this._currBg == key) {
            this.playSound(RES.getRes(key));
        }
    };
    /**
     * 检测一个文件是否要清除
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
 * 音效类(微信小游戏专用)
 */
var SoundBgWx = (function () {
    /**
     * 构造函数
     */
    function SoundBgWx() {
        this._audio = window["wx"].createInnerAudioContext();
        this._currBg = "";
    }
    /**
     * 停止当前音乐
     */
    SoundBgWx.prototype.stop = function () {
        this._audio.stop();
        this._currBg = "";
    };
    /**
     * 播放某个音乐
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
     * 暂停
     */
    SoundBgWx.prototype.pause = function () {
        if (this._currBg.length == 0) {
            return;
        }
        this._audio.pause();
    };
    /**
     * 恢复
     */
    SoundBgWx.prototype.resume = function () {
        if (this._currBg.length == 0) {
            return;
        }
        this._audio.play();
    };
    /**
     * 设置音量
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
 * 音效类
 */
var SoundEffect = (function (_super) {
    __extends(SoundEffect, _super);
    /**
     * 构造函数
     */
    function SoundEffect() {
        var _this = _super.call(this) || this;
        _this._soundLoops = {};
        _this._soundChannels = {};
        return _this;
    }
    /**
     * 播放一个音效
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
     * 播放
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
     * 播放完成
     */
    SoundEffect.prototype.onPlayComplete = function (e) {
        var channel = e.currentTarget;
        this.destroyChannel(channel);
    };
    /**
     * 销毁channel
     */
    SoundEffect.prototype.destroyChannel = function (channel) {
        channel.stop();
        channel.removeEventListener(egret.Event.SOUND_COMPLETE, this.onPlayComplete, this);
        delete this._soundChannels[channel["name"]];
    };
    /**
     * 播放一个音效
     * @param effectName
     */
    SoundEffect.prototype.stop = function (effectName) {
        var channel = this._soundChannels[effectName];
        if (channel) {
            this.destroyChannel(channel);
        }
    };
    /**
     * 设置音量
     * @param volume
     */
    SoundEffect.prototype.setVolume = function (volume) {
        this._volume = volume;
    };
    /**
     * 资源加载完成后处理播放
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
 * 音效类(微信小游戏专用)
 */
var SoundEffectWx = (function () {
    /**
     * 构造函数
     */
    function SoundEffectWx() {
        this._wx = window["wx"];
        this._cache = {};
        App.TimerManager.doTimer(1 * 60 * 1000, 0, this.dealSoundTimer, this);
    }
    /**
     * 处理音乐文件的清理
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
                // Log.debug(key + "已clear");
                audio.destroy();
                delete this._cache[key];
            }
        }
    };
    /**
     * 检测一个文件是否要清除
     * @param key
     * @returns {boolean}
     */
    SoundEffectWx.prototype.checkCanClear = function (key) {
        return true;
    };
    /**
     * 获取Sound
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
     * 播放一个音效
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
     * 播放一个音效
     * @param effectName
     */
    SoundEffectWx.prototype.stop = function (effectName) {
        var audio = this._cache[effectName];
        if (audio) {
            audio.stop();
        }
    };
    /**
     * 设置音量
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
 * Sound管理类
 */
var SoundManager = (function (_super) {
    __extends(SoundManager, _super);
    /**
     * 构造函数
     */
    function SoundManager() {
        var _this = _super.call(this) || this;
        //LocalStorage使用的key值
        _this.LocalStorageKey_Bg = "bgMusicFlag";
        _this.LocalStorageKey_Effect = "effectMusicFlag";
        //吵死了，release版本再设置一下
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
     * 设置背景音乐和音效的默认开关状态
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
        Log.info("背景音乐：", this.bgOn);
        Log.info("音效：", this.effectOn);
    };
    /**
     * 播放音效
     * @param effectName
     */
    SoundManager.prototype.playEffect = function (effectName, loops) {
        if (loops === void 0) { loops = 1; }
        if (!this.effectOn)
            return;
        this.effect.play(effectName, loops);
    };
    /**
     * 停止音效播放
     * @param effectName
     */
    SoundManager.prototype.stopEffect = function (effectName) {
        this.effect.stop(effectName);
    };
    /**
     * 播放背景音乐
     * @param key
     */
    SoundManager.prototype.playBg = function (bgName) {
        this.currBg = bgName;
        if (!this.bgOn)
            return;
        this.bg.play(bgName);
    };
    /**
     * 停止背景音乐
     */
    SoundManager.prototype.stopBg = function () {
        this.bg.stop();
    };
    /**
     * 暂停背景音乐
     */
    SoundManager.prototype.pauseBg = function () {
        if (!this.bgOn)
            return;
        this.bg.pause();
    };
    /**
     * 恢复背景音乐
     */
    SoundManager.prototype.resumeBg = function () {
        if (!this.bgOn)
            return;
        this.bg.resume();
    };
    /**
     * 设置音效是否开启
     * @param $isOn
     */
    SoundManager.prototype.setEffectOn = function ($isOn) {
        this.effectOn = $isOn;
        egret.localStorage.setItem(this.LocalStorageKey_Effect, $isOn ? "1" : "0");
    };
    /**
     * 设置背景音乐是否开启
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
     * 设置背景音乐音量
     * @param volume
     */
    SoundManager.prototype.setBgVolume = function (volume) {
        volume = Math.min(volume, 1);
        volume = Math.max(volume, 0);
        this.bgVolume = volume;
        this.bg.setVolume(this.bgVolume);
    };
    /**
     * 获取背景音乐音量
     * @returns {number}
     */
    SoundManager.prototype.getBgVolume = function () {
        return this.bgVolume;
    };
    /**
     * 设置音效音量
     * @param volume
     */
    SoundManager.prototype.setEffectVolume = function (volume) {
        volume = Math.min(volume, 1);
        volume = Math.max(volume, 0);
        this.effectVolume = volume;
        this.effect.setVolume(this.effectVolume);
    };
    /**
     * 获取音效音量
     * @returns {number}
     */
    SoundManager.prototype.getEffectVolume = function () {
        return this.effectVolume;
    };
    Object.defineProperty(SoundManager.prototype, "bgIsOn", {
        /**
         * 背景音乐是否已开启
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
         * 音效是否已开启
         * @returns {boolean}
         */
        get: function () {
            return this.effectOn;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 音乐文件清理时间
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
     * Swf文档类
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
         * 是否有某个Sprite
         * */
        Swf.prototype.hasSprite = function (name) {
            return this._swfData[Swf.dataKey_Sprite][name] != null;
        };
        /**
         * 是否有某个MovieClip
         * */
        Swf.prototype.hasMovieClip = function (name) {
            return this._swfData[Swf.dataKey_MovieClip][name] != null;
        };
        /**
         * 是否有某个Image
         * */
        Swf.prototype.hasImage = function (name) {
            return this._swfData[Swf.dataKey_Image][name] != null;
        };
        /**
         * 是否有某个S9Image
         * */
        Swf.prototype.hasS9Image = function (name) {
            return this._swfData[Swf.dataKey_Scale9][name] != null;
        };
        /**
         * 是否有某个S9Image
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
     * swf资源管理器
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
    /** 动画更新管理器 */
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
 * Armature封装类
 */
var DragonBonesArmature = (function (_super) {
    __extends(DragonBonesArmature, _super);
    /**
     * 构造函数
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
     * 添加事件监听
     */
    DragonBonesArmature.prototype.addListeners = function () {
        this._armature.eventDispatcher.addEvent(dragonBones.EventObject.COMPLETE, this.completeHandler, this);
        this._armature.eventDispatcher.addEvent(dragonBones.EventObject.FRAME_EVENT, this.frameHandler, this);
    };
    /**
     * 移除事件监听
     */
    DragonBonesArmature.prototype.removeListeners = function () {
        this._armature.eventDispatcher.removeEvent(dragonBones.EventObject.COMPLETE, this.completeHandler, this);
        this._armature.eventDispatcher.removeEvent(dragonBones.EventObject.FRAME_EVENT, this.frameHandler, this);
    };
    /**
     * 事件完成执行函数
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
     * 帧事件处理函数
     * @param e
     */
    DragonBonesArmature.prototype.frameHandler = function (e) {
        for (var i = 0, len = this._frameCalls.length; i < len; i++) {
            var arr = this._frameCalls[i];
            arr[0].apply(arr[1], [e]);
        }
    };
    /**
     * 播放名为name的动作
     * @param name 名称
     * @param playNum 指定播放次数，默认走动画配置
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
     * 从指定时间播放指定动画
     */
    DragonBonesArmature.prototype.gotoAndPlayByTime = function (name, time, playNum) {
        if (playNum === void 0) { playNum = undefined; }
        this._currAnimationState = this.getAnimation().gotoAndPlayByTime(name, time, playNum);
        return this._currAnimationState;
    };
    Object.defineProperty(DragonBonesArmature.prototype, "currentTime", {
        /**
         * 获取当前动作的播放时间
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
     * 恢复播放
     */
    DragonBonesArmature.prototype.start = function () {
        if (!this._isPlay) {
            this._clock.add(this._armature);
            this._isPlay = true;
            this.addListeners();
        }
    };
    /**
     * 停止播放
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
     * 销毁
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
     * 添加动画完成函数
     * @param callFunc 函数
     * @param target 函数所属对象
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
     * 移除一个动画完成函数
     * @param callFunc 函数
     * @param target 函数所属对象
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
     * 添加帧事件处理函数
     * @param callFunc 函数
     * @param target 函数所属对象
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
     * 移除帧事件处理函数
     * @param callFunc 函数
     * @param target 函数所属对象
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
     * 移除舞台处理
     * @private
     */
    DragonBonesArmature.prototype.$onRemoveFromStage = function () {
        _super.prototype.$onRemoveFromStage.call(this);
        this.stop();
    };
    /**
     * 获取dragonBones.Armature
     * @returns {dragonBones.Armature}
     */
    DragonBonesArmature.prototype.getArmature = function () {
        return this._armature;
    };
    /**
     * 获取当前dragonBones.AnimationState
     * @returns {dragonBones.AnimationState}
     */
    DragonBonesArmature.prototype.getCurrAnimationState = function () {
        return this._currAnimationState;
    };
    /**
     * 获取所属dragonBones.WorldClock
     * @returns {dragonBones.WorldClock}
     */
    DragonBonesArmature.prototype.getClock = function () {
        return this._clock;
    };
    /**
     * 获取dragonBones.Animation
     * @returns {Animation}
     */
    DragonBonesArmature.prototype.getAnimation = function () {
        return this._armature.animation;
    };
    /**
     * 获取一个dragonBones.Bone
     * @param boneName
     * @returns {dragonBones.Bone}
     */
    DragonBonesArmature.prototype.getBone = function (boneName) {
        return this._armature.getBone(boneName);
    };
    /**
     * 获取一个动作的运行时长
     * @param animationName
     * @returns {number}
     */
    DragonBonesArmature.prototype.getAnimationDuration = function (animationName) {
        return this._armature.animation.animations[animationName].duration;
    };
    /**
     * 当前正在播放的动作名字
     * @returns {string}
     */
    DragonBonesArmature.prototype.getPlayName = function () {
        return this._playName;
    };
    /**
     * 获取骨骼的display
     * @param bone
     * @returns {function(): any}
     */
    DragonBonesArmature.prototype.getBoneDisplay = function (bone) {
        return bone.slot.display;
    };
    /**
     * 替换骨骼插件
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
     * 替换插槽
     */
    DragonBonesArmature.prototype.changeSlot = function (slotName, displayObject) {
        var slot = this._armature.getSlot(slotName);
        if (!slot) {
            // Log.warn("Slot不存在", slotName);
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
     * 获取所有插槽
     */
    DragonBonesArmature.prototype.getSlots = function () {
        return this._armature["_slots"];
    };
    /**
     * 获取所有插槽中对象的位置信息
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
     * 缓存所有插槽中对象的位置信息
     */
    DragonBonesArmature.prototype.cacheAllSlotDisplayData = function () {
        this._cacheAllSlotDisplayData = this.getAllSlotDisplayData();
    };
    return DragonBonesArmature;
}(egret.DisplayObjectContainer));
__reflect(DragonBonesArmature.prototype, "DragonBonesArmature");
/**
 * Created by yangsong on 2014/6/16.
 * StarlingSwf工厂类
 */
var StarlingSwfFactory = (function (_super) {
    __extends(StarlingSwfFactory, _super);
    /**
     * 构造函数
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
     * 添加一个swf
     * @param name 唯一标识
     * @param swfData swf配置数据
     * @param spriteSheep 资源配置数据
     */
    StarlingSwfFactory.prototype.addSwf = function (name, swfData, spriteSheep) {
        if (this.swfAssetsNames.indexOf(name) != -1)
            return;
        if (swfData == null || spriteSheep == null) {
            Log.debug("SWF加载失败:" + name);
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
     * 停止列表中的swf
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
     * 播放列表中的swf
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
     * 清空所有swf
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
     * 清空
     */
    StarlingSwfFactory.prototype.clear = function () {
        this.clearSwfs();
    };
    /**
     * 创建一个StarlingSwfMovieClip
     * @param name mc的名字
     * @returns {StarlingSwfMovieClip}
     */
    StarlingSwfFactory.prototype.makeMc = function (name) {
        var mc = StarlingSwfUtils.createMovie("mc_" + name, null, StarlingSwfMovieClip);
        if (mc == null) {
            Log.debug("SWF创建失败: " + name);
        }
        return mc;
    };
    /**
     * 创建一个Bitmap
     * @param name 图片的名称
     * @returns {egret.Bitmap}
     */
    StarlingSwfFactory.prototype.makeImage = function (name) {
        return StarlingSwfUtils.createImage("img_" + name);
    };
    /**
     * 获取材质
     * @param name 材质名称
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
 * 自定义SwfMovieClip类，带有帧处理函数
 */
var StarlingSwfMovieClip = (function (_super) {
    __extends(StarlingSwfMovieClip, _super);
    /**
     * 构造函数
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
     * 移除舞台处理函数
     */
    StarlingSwfMovieClip.prototype.onRemove = function () {
        this.stop();
    };
    /**
     * 设置帧事件
     * @param $frame 第几帧
     * @param $action 执行函数
     * @param $actionObj 执行函数所属对象
     * @param $param 执行函数所需参数
     */
    StarlingSwfMovieClip.prototype.setFrameAction = function ($frame, $action, $actionObj, $param) {
        if ($param === void 0) { $param = null; }
        this.frameActions[$frame] = [$action, $actionObj, $param];
    };
    /**
     * 设置mc播放完成执行的函数
     * @param $action 执行函数
     * @param $actionObj 执行函数所属对象
     */
    StarlingSwfMovieClip.prototype.setCompleteAction = function ($action, $actionObj) {
        this.complateFunc = $action;
        this.complateObj = $actionObj;
        this.addEventListener(egret.Event.COMPLETE, this.onPlayend, this);
    };
    /**
     * 播放结束执行函数
     */
    StarlingSwfMovieClip.prototype.onPlayend = function () {
        if (this.complateFunc) {
            this.complateFunc.call(this.complateObj);
        }
    };
    /**
     * 播放
     * @param frame
     */
    StarlingSwfMovieClip.prototype.goToPlay = function (frame) {
        this.preFrame = -1;
        this.currFrameName = frame;
        this.gotoAndPlay(frame);
    };
    /**
     * 重写setCurrentFrame函数，处理帧事件
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
     * 销毁
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
 * StarlingSwf工具类
 */
var StarlingSwfUtils = (function () {
    function StarlingSwfUtils() {
    }
    /**
     * 函数游戏内用到的swf
     * @param swf
     */
    StarlingSwfUtils.addSwf = function (swf) {
        StarlingSwfUtils.swfList.push(swf);
    };
    /**
     * 在缓存中移除一个swf
     * @param swf
     */
    StarlingSwfUtils.removeSwf = function (swf) {
        var index = StarlingSwfUtils.swfList.indexOf(swf);
        if (index != -1)
            StarlingSwfUtils.swfList.splice(index, 1);
    };
    /**
     * 创建Sprite
     * @param name Sprite名称
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
     * 创建Bitmap
     * @param name Bitmap名称
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
     * 获取材质
     * @param name 材质名称
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
     * 创建一个SwfMovieClip
     * @param name SwfMovieClip名称
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
     * 创建一个九宫格图片
     * @param name 图片名称
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
     * 创建ShapeImage
     * @param name ShapeImage名称
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
     * 获取缓存中一个Swf
     * @param name 名称
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
     * 根据一个两帧mc自定义Button
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
     * 构造函数
     */
    function AllAsyncExecutor() {
        this._functions = new Array();
        this._complateNum = 0;
    }
    /**
     * 设置全部执行完成处理函数
     * @param callBack 此队列处理完成执行函数
     * @param callBackTarget 此队列处理完成执行函数所属对象
     */
    AllAsyncExecutor.prototype.setCallBack = function (callBack, callBackTarget) {
        this._callBack = callBack;
        this._callBackTarget = callBackTarget;
    };
    /**
     * 注册需要队列处理的函数
     * @param $func 函数
     * @param $thisObj 函数所属对象
     */
    AllAsyncExecutor.prototype.regist = function ($func, $thisObj) {
        this._functions.push([$func, $thisObj]);
    };
    /**
     * 开始执行
     */
    AllAsyncExecutor.prototype.start = function () {
        App.ArrayUtils.forEach(this._functions, function (arr) {
            arr[0].call(arr[1]);
        }, this);
    };
    /**
     * 执行完成
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
     * 遍历操作
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
 * 平均数工具类
 */
var AverageUtils = (function () {
    /**
     * 构造函数
     * @param $maxNum 参与计算的最大值
     */
    function AverageUtils($maxNum) {
        if ($maxNum === void 0) { $maxNum = 10; }
        this.nums = [];
        this.numsLen = 0;
        this.numSum = 0;
        this.maxNum = $maxNum;
    }
    /**
     * 加入一个值
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
     * 获取平均值
     * @returns {number}
     */
    AverageUtils.prototype.getValue = function () {
        return this.numSum / this.numsLen;
    };
    /**
     * 清空
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
 * 通用工具类
 */
var CommonUtils = (function (_super) {
    __extends(CommonUtils, _super);
    function CommonUtils() {
        var _this = _super.call(this) || this;
        /**
         * 万字的显示
         * @param label
         * @param num
         */
        _this.labelIsOverLenght = function (label, num) {
            var str = null;
            if (num < 100000) {
                str = num;
            }
            else if (num < 1000000) {
                str = Math.floor(num / 1000 / 10).toString() + "万";
            }
            else {
                str = Math.floor(num / 10000).toString() + "万";
            }
            label.text = str;
        };
        return _this;
    }
    /**
     * 给字体添加描边
     * @param lable      文字
     * @param color      表示文本的描边颜色
     * @param width      描边宽度。
     */
    CommonUtils.prototype.addLableStrokeColor = function (lable, color, width) {
        lable.strokeColor = color;
        lable.stroke = width;
    };
    /**
     * 深度复制
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
     * 锁屏
     */
    CommonUtils.prototype.lock = function () {
        App.StageUtils.setTouchChildren(false);
    };
    /**
     * 解屏
     */
    CommonUtils.prototype.unlock = function () {
        App.StageUtils.setTouchChildren(true);
    };
    /**
     * int64转number
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
 * Date工具类
 */
var DateUtils = (function (_super) {
    __extends(DateUtils, _super);
    function DateUtils() {
        return _super.call(this) || this;
    }
    /**
     * 根据秒数格式化字符串
     * @param second 秒数
     * @param type 1:00:00:00   2:yyyy-mm-dd h:m:s    3:00:00(分:秒)   4:xx天前，xx小时前，xx分钟前    6:00:00(时:分)
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
    //3:00:00(分:秒)
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
        var month = date.getMonth() + 1; //返回的月份从0-11；
        var day = date.getDate();
        var hours = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        return year + "-" + month + "-" + day + " " + hours + ":" + minute + ":" + second;
    };
    //4:xx天前，xx小时前，xx分钟前
    DateUtils.prototype.getFormatBySecond4 = function (time) {
        var t = Math.floor(time / 3600);
        if (t > 0) {
            if (t > 24) {
                return Math.floor(t / 24) + "天前";
            }
            else {
                return t + "小时前";
            }
        }
        else {
            return Math.floor(time / 60) + "分钟前";
        }
    };
    DateUtils.prototype.getFormatBySecond5 = function (time) {
        //每个时间单位所对应的秒数
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
            //天
            if (days == 0) {
                dayss = "";
                //小时
                if (hourst == 0) {
                    hourss = "";
                    //分
                    if (minst == 0) {
                        minss = "";
                        if (secondt == 0) {
                            secss = "";
                        }
                        else if (secondt < 10) {
                            secss = "0" + secondt + "秒";
                        }
                        else {
                            secss = "" + secondt + "秒";
                        }
                        return secss;
                    }
                    else {
                        minss = "" + minst + "分";
                        if (secondt == 0) {
                            secss = "";
                        }
                        else if (secondt < 10) {
                            secss = "0" + secondt + "秒";
                        }
                        else {
                            secss = "" + secondt + "秒";
                        }
                    }
                    return minss + secss;
                }
                else {
                    hourss = hourst + "小时";
                    if (minst == 0) {
                        minss = "";
                        if (secondt == 0) {
                            secss = "";
                        }
                        else if (secondt < 10) {
                            secss = "0" + secondt + "秒";
                        }
                        else {
                            secss = "" + secondt + "秒";
                        }
                        return secss;
                    }
                    else if (minst < 10) {
                        minss = "0" + minst + "分";
                    }
                    else {
                        minss = "" + minst + "分";
                    }
                    return hourss + minss;
                }
            }
            else {
                dayss = days + "天";
                if (hourst == 0) {
                    hourss = "";
                }
                else {
                    if (hourst < 10)
                        hourss = "0" + hourst + "小时";
                    else
                        hourss = "" + hourst + "小时";
                    ;
                }
                return dayss + hourss;
            }
        }
        return "";
    };
    //6:00:00(时:分) 
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
     * 获取当前是周几
     * ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"]
     */
    DateUtils.prototype.getDay = function (timestamp) {
        var date = new Date(timestamp);
        return date.getDay();
    };
    /**
     * 判定两个时间是否是同一天
     */
    DateUtils.prototype.isSameDate = function (timestamp1, timestamp2) {
        var date1 = new Date(timestamp1);
        var date2 = new Date(timestamp2);
        return date1.getFullYear() == date2.getFullYear()
            && date1.getMonth() == date2.getMonth()
            && date1.getDate() == date2.getDate();
    };
    /**
     * 日期格式化
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
     * 计算两个时间相差天数
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
 * Debug调试工具
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
     * 设置调试是否开启
     * @param flag
     *
     */
    DebugUtils.prototype.isOpen = function (flag) {
        this._isOpen = flag;
    };
    Object.defineProperty(DebugUtils.prototype, "isDebug", {
        /**
         * 是否是调试模式
         * @returns {boolean}
         */
        get: function () {
            return this._isOpen;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 开始
     * @param key 标识
     * @param minTime 最小时间
     *
     */
    DebugUtils.prototype.start = function (key) {
        if (!this._isOpen) {
            return;
        }
        this._startTimes[key] = egret.getTimer();
    };
    /**
     * 停止
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
     * 设置时间间隔阈值
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
        //每帧运算逻辑的时间阈值，执行代码超过这个时间就跳过到下一帧继续执行，根据实际情况调整，因为每一帧除了这里的逻辑还有别的逻辑要做对吧
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
     * 构造函数
     */
    function DeviceUtils() {
        return _super.call(this) || this;
    }
    Object.defineProperty(DeviceUtils.prototype, "IsHtml5", {
        /**
         * 当前是否Html5版本
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
         * 当前是否是Native版本
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
         * 当前是否是微信小游戏平台
         */
        get: function () {
            return egret.Capabilities.runtimeType == egret.RuntimeType.WXGAME;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeviceUtils.prototype, "IsMobile", {
        /**
         * 是否是在手机上
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
         * 是否是在PC上
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
         * 是否是QQ浏览器
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
         * 是否是IE浏览器
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
         * 是否是Firefox浏览器
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
         * 是否是Chrome浏览器
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
         * 是否是Safari浏览器
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
         * 是否是Opera浏览器
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
         * 得到设备系统 如：iOS/Android/WP7
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
 * 显示对象工具类
 */
var DisplayUtils = (function (_super) {
    __extends(DisplayUtils, _super);
    /**
     * 构造函数
     */
    function DisplayUtils() {
        return _super.call(this) || this;
    }
    /**
     * 创建一个Bitmap
     * @param resName resource.json中配置的name
     * @returns {egret.Bitmap}
     */
    DisplayUtils.prototype.createBitmap = function (resName) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(resName);
        result.texture = texture;
        return result;
    };
    /**
     * 创建一个textField
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
     * 创建一个位图字体
     */
    DisplayUtils.prototype.createBitmapFont = function (fontName) {
        var bpFont = new egret.BitmapText();
        bpFont.font = RES.getRes(fontName);
        return bpFont;
    };
    /**
     * 创建一张Gui的图片
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
     * 从父级移除child
     * @param child
     */
    DisplayUtils.prototype.removeFromParent = function (child) {
        if (child.parent == null)
            return;
        child.parent.removeChild(child);
    };
    /**
     * 添加到指定容器
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
 * 各种效果工具类
 */
var EffectUtils = (function (_super) {
    __extends(EffectUtils, _super);
    /**
     * 构造函数
     */
    function EffectUtils() {
        return _super.call(this) || this;
    }
    /**
     * 类似mac上图标上下抖动的效果
     * @param obj 要抖动的对象，使用
     * @param initY 要抖动的对象的初始Y值，原始位置
     */
    EffectUtils.prototype.macIconShake = function (obj, initY) {
        //抖动频率[时间，移动距离]，可修改
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
     * 开始放大缩小
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
     * 停止放大缩小
     * @param obj
     */
    EffectUtils.prototype.stopScale = function (obj) {
        egret.Tween.removeTweens(obj);
    };
    /**
     * 开始闪烁
     * @param obj
     */
    EffectUtils.prototype.startFlicker = function (obj, alphaTime, alpha_min) {
        if (alpha_min === void 0) { alpha_min = 0; }
        obj.alpha = 1;
        egret.Tween.get(obj).to({ "alpha": alpha_min }, alphaTime).to({ "alpha": 1 }, alphaTime).call(this.startFlicker, this, [obj, alphaTime]);
    };
    /**
     * 停止闪烁
     * @param obj
     */
    EffectUtils.prototype.stopFlicker = function (obj) {
        egret.Tween.removeTweens(obj);
    };
    /**
     * 开始上下抖动
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
     * 停止上下抖动
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
     * 设置显示对象“黑化”效果
     */
    EffectUtils.prototype.setDisplayObjectBlack = function (obj) {
        //颜色矩阵数组
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
     * 设置显示对象“灰化”效果
     */
    EffectUtils.prototype.setDisplayObjectGray = function (obj) {
        //颜色矩阵数组
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
     * 开始左右摇动
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
     * 停止左右摇动
     * @param obj
     */
    EffectUtils.prototype.stopWobble = function (obj) {
        obj.rotation = 0;
        egret.Tween.removeTweens(obj);
    };
    /**
     * 开始发光闪烁
     * @param obj
     */
    EffectUtils.prototype.startFlash = function (obj, flashColor, flashTime) {
        var glowFilter = obj["flashFilter"];
        if (!glowFilter) {
            var color = flashColor; /// 光晕的颜色，十六进制，不包含透明度
            var alpha = 1; /// 光晕的颜色透明度，是对 color 参数的透明度设定。有效值为 0.0 到 1.0。例如，0.8 设置透明度值为 80%。
            var blurX = 35; /// 水平模糊量。有效值为 0 到 255.0（浮点）
            var blurY = 35; /// 垂直模糊量。有效值为 0 到 255.0（浮点）
            var strength = 2; /// 压印的强度，值越大，压印的颜色越深，而且发光与背景之间的对比度也越强。有效值为 0 到 255。暂未实现
            var quality = 3 /* HIGH */; /// 应用滤镜的次数，建议用 BitmapFilterQuality 类的常量来体现
            glowFilter = new egret.GlowFilter(color, alpha, blurX, blurY, strength, quality);
            obj.filters = [glowFilter];
            obj["flashFilter"] = glowFilter;
        }
        egret.Tween.get(glowFilter).to({ "alpha": 0 }, flashTime).to({ "alpha": 1 }, flashTime).call(this.startFlash, this, [obj, flashColor, flashTime]);
    };
    /**
     * 停止发光闪烁
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
 * 引擎扩展类
 */
var EgretExpandUtils = (function (_super) {
    __extends(EgretExpandUtils, _super);
    /**
     * 构造函数
     */
    function EgretExpandUtils() {
        return _super.call(this) || this;
    }
    /**
     * 初始化函数
     */
    EgretExpandUtils.prototype.init = function () {
    };
    return EgretExpandUtils;
}(SingtonClass));
__reflect(EgretExpandUtils.prototype, "EgretExpandUtils");
/**
 * Created by yangsong on 2014/11/23.
 * 帧延迟处理
 */
var FrameDelay = (function () {
    /**
     * 构造函数
     */
    function FrameDelay() {
    }
    /**
     * 延迟处理
     * @param delayFrame 延迟帧数
     * @param func 延迟执行的函数
     * @param thisObj 延迟执行的函数的所属对象
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
 * 分帧处理
 */
var FrameExecutor = (function () {
    /**
     * 构造函数
     */
    function FrameExecutor($delayFrame) {
        this.delayFrame = $delayFrame;
        this.frameDelay = new FrameDelay();
        this.functions = new Array();
    }
    /**
     * 注册要分帧处理的函数
     * @param $func 函数
     * @param $thisObj 函数所属对象
     */
    FrameExecutor.prototype.regist = function ($func, $thisObj) {
        this.functions.push([$func, $thisObj]);
    };
    /**
     * 执行
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
 * 键盘工具类
 */
var KeyboardUtils = (function (_super) {
    __extends(KeyboardUtils, _super);
    /**
     * 构造函数
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
     * 添加KeyUp事件
     * @param callback 回调函数
     * @param target 回调函数对应的对象
     */
    KeyboardUtils.prototype.addKeyUp = function (callback, target) {
        this.key_ups.push([callback, target]);
    };
    /**
     * 添加KeyDown事件
     * @param callback 回调函数
     * @param target 回调函数对应的对象
     */
    KeyboardUtils.prototype.addKeyDown = function (callback, target) {
        this.key_downs.push([callback, target]);
    };
    /**
     * 移除KeyUp事件
     * @param callback 回调函数
     * @param target 回调函数对应的对象
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
     * 移除KeyDown事件
     * @param callback 回调函数
     * @param target 回调函数对应的对象
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
     * 获取url参数值，没有返回null
     * 不传递paraUrl参数默认获取当前url
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
     * 给Url参数赋值
     * 不传递paraUrl参数默认获取当前url
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
     * 检查url中是否包含某参数
     * 这代码有一个例外就是paraName = "undefined", paraUrl中不含"?"会返回true
     * 相信你不会这么用的 =.=
     * */
    LocationPropertyUtils.prototype.hasProperty = function (paraName, paraUrl) {
        var url = paraUrl || location.href;
        var para = "&" + url.split("?")[1]; //加&是为了把&作为参数名开始=作为参数名结束，防止uid=1&id=2此类误判
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
 * 数学计算工具类
 */
var MathUtils = (function (_super) {
    __extends(MathUtils, _super);
    function MathUtils() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * 弧度制转换为角度值
     * @param radian 弧度制
     * @returns {number}
     */
    MathUtils.prototype.getAngle = function (radian) {
        return 180 * radian / Math.PI;
    };
    /**
     * 角度值转换为弧度制
     * @param angle
     */
    MathUtils.prototype.getRadian = function (angle) {
        return angle / 180 * Math.PI;
    };
    /**
     * 获取两点间弧度
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
     * 获取两点间距离
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
 * 服务端返回消息处理
 */
var MessageCenter = (function (_super) {
    __extends(MessageCenter, _super);
    /**
     * 构造函数
     * @param type 0:使用分帧处理 1:及时执行
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
     * 清空处理
     */
    MessageCenter.prototype.clear = function () {
        this.dict = {};
        this.eVec.splice(0);
    };
    /**
     * 添加消息监听
     * @param type 消息唯一标识
     * @param listener 侦听函数
     * @param listenerObj 侦听函数所属对象
     *
     */
    MessageCenter.prototype.addListener = function (type, listener, listenerObj) {
        var arr = this.dict[type];
        if (arr == null) {
            arr = new Array();
            this.dict[type] = arr;
        }
        //检测是否已经存在
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
     * 移除消息监听
     * @param type 消息唯一标识
     * @param listener 侦听函数
     * @param listenerObj 侦听函数所属对象
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
     * 移除某一对象的所有监听
     * @param listenerObj 侦听函数所属对象
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
     * 触发消息
     * @param type 消息唯一标识
     * @param param 消息参数
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
            Log.warn("MessageCenter未实现的类型");
        }
    };
    /**
     * 运行
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
     * 处理一条消息
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
     * 判断指定类型的事件是否注册了监听
     * @param type 事件类型
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
 * 对象池类
 */
var ObjectPool = (function () {
    /**
     * 构造函数
     */
    function ObjectPool() {
        this._objs = new Array();
    }
    /**
     * 放回一个对象
     * @param obj
     */
    ObjectPool.prototype.pushObj = function (obj) {
        this._objs.push(obj);
    };
    /**
     * 取出一个对象
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
     * 清除所有缓存对象
     */
    ObjectPool.prototype.clear = function () {
        while (this._objs.length > 0) {
            this._objs.pop();
        }
    };
    /**
     * 取出一个对象
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
     * 取出一个对象
     * @param refKey Class
     * @param extraKey 标识值
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
     * 放入一个对象
     * @param obj
     *
     */
    ObjectPool.push = function (obj) {
        if (obj == null) {
            return false;
        }
        var refKey = obj.ObjectPoolKey;
        //保证只有pop出来的对象可以放进来，或者是已经清除的无法放入
        if (!ObjectPool._content[refKey]) {
            return false;
        }
        ObjectPool._content[refKey].push(obj);
        return true;
    };
    /**
     * 清除所有对象
     */
    ObjectPool.clear = function () {
        ObjectPool._content = {};
    };
    /**
     * 清除某一类对象
     * @param classZ Class
     * @param clearFuncName 清除对象需要执行的函数
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
     * 缓存中对象统一执行一个函数
     * @param classZ Class
     * @param dealFuncName 要执行的函数名称
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
 * 百分比类
 */
var Percent = (function () {
    /**
     * 构造函数
     * @param $currentValue 当前值
     * @param $totalValue 总值
     */
    function Percent($currentValue, $totalValue) {
        this.currentValue = $currentValue;
        this.totalValue = $totalValue;
    }
    /**
     * 计算当前百分比
     * @returns {number}
     */
    Percent.prototype.computePercent = function () {
        return this.currentValue / this.totalValue * 100;
    };
    /**
     * 计算当前比例
     * @returns {number}
     */
    Percent.prototype.computeRate = function () {
        return this.currentValue / this.totalValue;
    };
    /**
     * 反转
     * @returns {Percent}
     */
    Percent.prototype.reverse = function () {
        this.currentValue = this.totalValue - this.currentValue;
        return this;
    };
    /**
     * 复制
     * @returns {Percent}
     */
    Percent.prototype.copy = function () {
        return new Percent(this.currentValue, this.totalValue);
    };
    /**
     * 计算百分比反转
     * @returns {number}
     */
    Percent.prototype.computePercentReverse = function () {
        return (this.totalValue - this.currentValue) / this.totalValue * 100;
    };
    /**
     * 计算比例反转
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
 * 队列处理
 */
var QueueExecutor = (function () {
    /**
     * 构造函数
     */
    function QueueExecutor() {
        this._functions = new Array();
    }
    /**
     * 设置全部执行完成处理函数
     * @param callBack 此队列处理完成执行函数
     * @param callBackTarget 此队列处理完成执行函数所属对象
     */
    QueueExecutor.prototype.setCallBack = function (callBack, callBackTarget) {
        this._callBack = callBack;
        this._callBackTarget = callBackTarget;
    };
    /**
     * 注册需要队列处理的函数
     * @param $func 函数
     * @param $thisObj 函数所属对象
     */
    QueueExecutor.prototype.regist = function ($func, $thisObj) {
        this._functions.push([$func, $thisObj]);
    };
    /**
     * 开始执行
     */
    QueueExecutor.prototype.start = function () {
        this.next();
    };
    /**
     * 执行下一个
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
     * 获取一个区间的随机数
     * @param $from 最小值
     * @param $end 最大值
     * @returns {number}
     */
    RandomUtils.prototype.limit = function ($from, $end) {
        $from = Math.min($from, $end);
        $end = Math.max($from, $end);
        var range = $end - $from;
        return $from + Math.random() * range;
    };
    /**
     * 获取一个区间的随机数(整数)
     * @param $from 最小值
     * @param $end 最大值
     * @returns {number}
     */
    RandomUtils.prototype.limitInteger = function ($from, $end) {
        return Math.floor(this.limit($from, $end + 1));
    };
    /**
     * 在一个数组中随机获取一个元素
     * @param arr 数组
     * @returns {any} 随机出来的结果
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
 * cacheAsBitmap的替代方案，解决QQ浏览器在1G内存的机器上最多能使用20个Canvas的限制
 */
var RenderTextureManager = (function (_super) {
    __extends(RenderTextureManager, _super);
    /**
     * 构造函数
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
     * 是否是低端手机的QQ浏览器
     * @returns {boolean}
     */
    RenderTextureManager.prototype.isLowerQQBrowser = function () {
        if (App.DeviceUtils.IsQQBrowser) {
            //判定机型，因为拿不到内存信息，现在只能根据机型进行判定
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
     * 获取一个egret.RenderTexture
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
     * 回收一个egret.RenderTexture
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
 * 资源加载工具类，
 * 支持多个resource.json文件加载
 * 封装Group的加载
 * 增加静默加载机制
 */
var ResourceUtils = (function (_super) {
    __extends(ResourceUtils, _super);
    /**
     * 构造函数
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
     * 添加一个配置文件
     * @param jsonPath resource.json路径
     * @param filePath 访问资源路径
     */
    ResourceUtils.prototype.addConfig = function (jsonPath, filePath) {
        this._configs.push([jsonPath, filePath]);
    };
    /**
     * 开始加载配置文件
     * @param $onConfigComplete 加载完成执行函数
     * @param $onConfigCompleteTarget 加载完成执行函数所属对象
     */
    ResourceUtils.prototype.loadConfig = function ($onConfigComplete, $onConfigCompleteTarget) {
        this._onConfigComplete = $onConfigComplete;
        this._onConfigCompleteTarget = $onConfigCompleteTarget;
        this.loadNextConfig();
    };
    /**
     * 加载
     */
    ResourceUtils.prototype.loadNextConfig = function () {
        //加载完成
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
     * 加载完成
     * @param event
     */
    ResourceUtils.prototype.onConfigCompleteHandle = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigCompleteHandle, this);
        this.loadNextConfig();
    };
    /**
     * 加载资源组
     * @param $groupName 资源组名称
     * @param $onResourceLoadComplete 资源加载完成执行函数
     * @param $onResourceLoadProgress 资源加载进度监听函数
     * @param $onResourceLoadTarget 资源加载监听函数所属对象
     */
    ResourceUtils.prototype.loadGroup = function ($groupName, $onResourceLoadComplete, $onResourceLoadProgress, $onResourceLoadTarget) {
        this._groups[$groupName] = [$onResourceLoadComplete, $onResourceLoadProgress, $onResourceLoadTarget];
        RES.loadGroup($groupName);
    };
    /**
     * 同时加载多个组
     * @param $groupName 自定义的组名称
     * @param $subGroups 所包含的组名称或者key名称数组
     * @param $onResourceLoadComplete 资源加载完成执行函数
     * @param $onResourceLoadProgress 资源加载进度监听函数
     * @param $onResourceLoadTarget 资源加载监听函数所属对象
     */
    ResourceUtils.prototype.loadGroups = function ($groupName, $subGroups, $onResourceLoadComplete, $onResourceLoadProgress, $onResourceLoadTarget) {
        RES.createGroup($groupName, $subGroups, true);
        this.loadGroup($groupName, $onResourceLoadComplete, $onResourceLoadProgress, $onResourceLoadTarget);
    };
    /**
     * 静默加载
     * @param $groupName 资源组名称
     * @param $groupName 所包含的组名称或者key名称数组
     */
    ResourceUtils.prototype.pilfererLoadGroup = function ($groupName, $subGroups) {
        if ($subGroups === void 0) { $subGroups = null; }
        //添加前缀，防止与正常加载组名重复
        var useGroupName = "pilferer_" + $groupName;
        if (!$subGroups) {
            $subGroups = [$groupName];
        }
        RES.createGroup(useGroupName, $subGroups, true);
        RES.loadGroup(useGroupName, -1);
    };
    /**
     * 资源组加载完成
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
     * 资源组加载进度
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
     * 资源组加载失败
     * @param event
     */
    ResourceUtils.prototype.onResourceLoadError = function (event) {
        Log.warn(event.groupName + "资源组有资源加载失败");
        this.onResourceLoadComplete(event);
    };
    /**
     * 资源加载失败
     * @param event
     */
    ResourceUtils.prototype.onResourceItemLoadError = function (event) {
        Log.warn(event.resItem.url + "资源加载失败");
        if (this._itemLoadErrorFunction) {
            this._itemLoadErrorFunction(event);
        }
    };
    /**
     * 注册资源加载失败处理函数
     */
    ResourceUtils.prototype.registerItemLoadErrorFunction = function (func) {
        this._itemLoadErrorFunction = func;
    };
    /**
     * 混合加载资源组
     * @param $resources 资源数组
     * @param $groups 资源组数组
     * @param $onResourceLoadComplete 资源加载完成执行函数
     * @param $onResourceLoadProgress 资源加载进度监听函数
     * @param $onResourceLoadTarget 资源加载监听函数所属对象
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
     * 动态创建加载组
     * @param {string} $groupName
     * @param {string[]} resKeys
     */
    ResourceUtils.prototype.createGroup = function ($groupName, resKeys) {
        RES.createGroup($groupName, resKeys, true);
    };
    /**
     * 动态创建Resource
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
     * 获取文件的真实路径
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
 * 摇杆控制类
 */
var RockerUtils = (function (_super) {
    __extends(RockerUtils, _super);
    function RockerUtils() {
        return _super.call(this) || this;
    }
    /**
     * 摇杆初始化
     * @param moveBg 摇杆背景图
     * @param moveFlag 摇杆图标
     * @param dealKeyFunc 摇杆移动时处理函数
     * @param dealKeyTarget 摇杆移动时处理函数所属对象
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
        //键盘控制
        App.KeyboardUtils.addKeyDown(this.onKeyDown, this);
        App.KeyboardUtils.addKeyUp(this.onKeyUp, this);
    };
    /**
     * 键盘按下处理
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
     * 键盘弹起处理
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
     * 事件拦截
     * @param e
     */
    RockerUtils.prototype.stopEvent = function (e) {
        e.stopPropagation();
    };
    /**
     * 手指离开Stage事件处理
     * @param e
     */
    RockerUtils.prototype.leaveStateEvent = function (e) {
        if (e.stageX == this.mouseX && e.stageY == this.mouseY) {
            this.stopMove();
        }
    };
    /**
     * 开始移动
     */
    RockerUtils.prototype.startMove = function (e) {
        this.isMoveing = true;
        this.moveFlagGoX = this.moveFlagX;
        this.moveFlagGoY = this.moveFlagY;
        this.mouseX = e.stageX;
        this.mouseY = e.stageY;
    };
    /**
     * 停止移动
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
     * 复位摇杆位置
     */
    RockerUtils.prototype.resetRockerPos = function () {
        this.moveFlag.x = this.moveFlagX;
        this.moveFlag.y = this.moveFlagY;
    };
    /**
     * 摇杆移动事件
     * @param e
     */
    RockerUtils.prototype.heroMoveEvent = function (e) {
        this.runMove(e.stageX, e.stageY);
    };
    /**
     * 摇杆移动
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
     * 开启检测
     */
    RockerUtils.prototype.startCheckKey = function () {
        if (!this.checkKeying) {
            this.checkKeying = true;
            App.TimerManager.doFrame(1, 0, this.delKeys, this);
        }
    };
    /**
     * 停止检测
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
     * 检测
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
     * 停止处理
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
 * 震动
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
 * Stage相关工具类
 */
var StageUtils = (function (_super) {
    __extends(StageUtils, _super);
    /**
     * 构造函数
     */
    function StageUtils() {
        return _super.call(this) || this;
    }
    /**
     * 获取游戏的高度
     * @returns {number}
     */
    StageUtils.prototype.getHeight = function () {
        return this.getStage().stageHeight;
    };
    /**
     * 获取游戏宽度
     * @returns {number}
     */
    StageUtils.prototype.getWidth = function () {
        return this.getStage().stageWidth;
    };
    /**
     * 指定此对象的子项以及子孙项是否接收鼠标/触摸事件
     * @param value
     */
    StageUtils.prototype.setTouchChildren = function (value) {
        this.getStage().touchChildren = value;
    };
    /**
     * 设置同时可触发几个点击事件，默认为2
     * @param value
     */
    StageUtils.prototype.setMaxTouches = function (value) {
        this.getStage().maxTouches = value;
    };
    /**
     * 设置帧频
     * @param value
     */
    StageUtils.prototype.setFrameRate = function (value) {
        this.getStage().frameRate = value;
    };
    /**
     * 设置适配方式
     * @param value
     */
    StageUtils.prototype.setScaleMode = function (value) {
        this.getStage().scaleMode = value;
    };
    /**
     * 获取游戏Stage对象
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
 * StringBuffer类
 */
var StringBuffer = (function () {
    /**
     * 构造函数
     */
    function StringBuffer() {
        this._strings = new Array();
    }
    /**
     * 追加一个字符串
     * @param str
     */
    StringBuffer.prototype.append = function (str) {
        this._strings.push(str);
    };
    /**
     * 转换为字符串
     * @returns {string}
     */
    StringBuffer.prototype.toString = function () {
        return this._strings.join("");
    };
    /**
     * 清空
     */
    StringBuffer.prototype.clear = function () {
        this._strings.length = 0;
    };
    return StringBuffer;
}());
__reflect(StringBuffer.prototype, "StringBuffer");
/**
 * Created by yangsong on 14/12/18.
 * 字符串操作工具类
 */
var StringUtils = (function (_super) {
    __extends(StringUtils, _super);
    /**
     * 构造函数
     */
    function StringUtils() {
        return _super.call(this) || this;
    }
    /**
     * 去掉前后空格
     * @param str
     * @returns {string}
     */
    StringUtils.prototype.trimSpace = function (str) {
        return str.replace(/^\s*(.*?)[\s\n]*$/g, '$1');
    };
    /**
     * 获取字符串长度，中文为2
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
     * 判断一个字符串是否包含中文
     * @param str
     * @returns {boolean}
     */
    StringUtils.prototype.isChinese = function (str) {
        var reg = /^.*[\u4E00-\u9FA5]+.*$/;
        return reg.test(str);
    };
    /**
     * 格式化字符串 "{0},{1}.format("text0","text1")
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
     * "你好|S:18&C:0xffff00&T:带颜色字号|S:50&T:大号字体|C:0x0000ff&T:带色字体";
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
 * Timer管理器
 */
var TimerManager = (function (_super) {
    __extends(TimerManager, _super);
    /**
     * 构造函数
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
     * 设置时间参数
     * @param timeScale
     */
    TimerManager.prototype.setTimeScale = function (timeScale) {
        this._timeScale = timeScale;
    };
    /**
     * 每帧执行函数
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
        //参数监测
        if (delay < 0 || repeatCount < 0 || method == null) {
            return;
        }
        //先删除相同函数的计时
        this.remove(method, methodObj);
        //创建
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
     * 在指定的延迟（以毫秒为单位）后运行指定的函数。
     * @param delay 执行间隔:毫秒
     * @param method 执行函数
     * @param methodObj 执行函数所属对象
     */
    TimerManager.prototype.setTimeOut = function (delay, method, methodObj) {
        this.doTimer(delay, 1, method, methodObj);
    };
    /**
     * 在指定的帧后运行指定的函数。
     * @param delay 执行间隔:帧频
     * @param method 执行函数
     * @param methodObj 执行函数所属对象
     */
    TimerManager.prototype.setFrameOut = function (delay, method, methodObj) {
        this.doFrame(delay, 1, method, methodObj);
    };
    /**
     *
     * 定时执行
     * @param delay 执行间隔:毫秒
     * @param repeatCount 执行次数, 0为无限次
     * @param method 执行函数
     * @param methodObj 执行函数所属对象
     * @param complateMethod 完成执行函数
     * @param complateMethodObj 完成执行函数所属对象
     *
     */
    TimerManager.prototype.doTimer = function (delay, repeatCount, method, methodObj, complateMethod, complateMethodObj) {
        if (complateMethod === void 0) { complateMethod = null; }
        if (complateMethodObj === void 0) { complateMethodObj = null; }
        this.create(false, delay, repeatCount, method, methodObj, complateMethod, complateMethodObj);
    };
    /**
     *
     * 定时执行
     * @param delay 执行间隔:帧频
     * @param repeatCount 执行次数, 0为无限次
     * @param method 执行函数
     * @param methodObj 执行函数所属对象
     * @param complateMethod 完成执行函数
     * @param complateMethodObj 完成执行函数所属对象
     *
     */
    TimerManager.prototype.doFrame = function (delay, repeatCount, method, methodObj, complateMethod, complateMethodObj) {
        if (complateMethod === void 0) { complateMethod = null; }
        if (complateMethodObj === void 0) { complateMethodObj = null; }
        this.create(true, delay, repeatCount, method, methodObj, complateMethod, complateMethodObj);
    };
    Object.defineProperty(TimerManager.prototype, "count", {
        /**
         * 定时器执行数量
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
     * 清理
     * @param method 要移除的函数
     * @param methodObj 要移除的函数对应的对象
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
     * 清理
     * @param methodObj 要移除的函数对应的对象
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
     * 检测是否已经存在
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
     * 暂停
     */
    TimerManager.prototype.pause = function () {
        if (this._isPause) {
            return;
        }
        this._isPause = true;
        this._pauseTime = egret.getTimer();
    };
    /**
     * 从暂停中恢复
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
        /**执行间隔*/
        this.delay = 0;
        /**重复执行次数*/
        this.repeatCount = 0;
        /**执行时间*/
        this.exeTime = 0;
        /**上次的执行时间*/
        this.dealTime = 0;
    }
    /**清理*/
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
 * hack引擎的点击事件
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
    * eventType:绑定事件类型，TOUCH_BEGIN、TOUCH_MOVE、TOUCH_END
    * bindCall:接受参数为点击事件的坐标x,y,identifier
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
    * 释放绑定的点击事件
    * eventType:绑定事件类型，TOUCH_BEGIN、TOUCH_MOVE、TOUCH_END
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
 * Tween工具类
 */
var TweenUtils = (function (_super) {
    __extends(TweenUtils, _super);
    function TweenUtils() {
        return _super.call(this) || this;
    }
    /**
     * 暂停所有的Tween
     */
    TweenUtils.prototype.pause = function () {
        var tweens = egret.Tween["_tweens"];
        for (var i = 0, l = tweens.length; i < l; i++) {
            var tween_2 = tweens[i];
            tween_2.paused = true;
        }
    };
    /**
     * 从暂停中恢复
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
    EventNames.Login_Succ = "LoginSucc"; //登录成功
    EventNames.Login_Error = "Login_Error"; //登录失败
    EventNames.Role_Choose = "Role_Choose"; //登录失败
    EventNames.Rolo_INFO = "Rolo_INFO"; //获取角色信息完成
    EventNames.Pet_unlock = "Pet_unlock"; //宠物解锁
    EventNames.Pet_uplevel = "Pet_uplevel"; //宠物升级
    EventNames.Role_update = "Role_update"; //角色数据更新
    EventNames.Kill_Monster = "Kill_Monster"; //战斗击杀
    EventNames.Fight_End = "Fight_End"; //战斗结束  传值带上计算数据
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
     * Game场景
     * @type {number}
     */
    SceneConsts[SceneConsts["Game"] = 1] = "Game";
    /**
     * 游戏场景
     * @type {number}
     */
    SceneConsts[SceneConsts["UI"] = 2] = "UI";
    /**
     * Loading场景
     * @type {number}
     */
    SceneConsts[SceneConsts["LOADING"] = 3] = "LOADING";
    /**
     * RpgGame场景
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
 * DragonBonesArmature容器类，用于一个动画使用多个DragonBonesArmature的情况
 */
var DragonBonesArmatureContainer = (function (_super) {
    __extends(DragonBonesArmatureContainer, _super);
    /**
     * 构造函数
     */
    function DragonBonesArmatureContainer() {
        var _this = _super.call(this) || this;
        _this.armatures = new Array();
        _this.actions = {};
        _this.cacheBones = {};
        return _this;
    }
    /**
     * 注册缩需要的DragonBonesArmature
     * @param $armature DragonBonesArmature
     * @param $actions 当前DragonBonesArmature所有的动作
     */
    DragonBonesArmatureContainer.prototype.register = function ($armature, $actions) {
        this.armatures.push($armature);
        for (var i = 0, len = $actions.length; i < len; i++) {
            this.actions[$actions[i]] = this.armatures.length - 1;
        }
    };
    Object.defineProperty(DragonBonesArmatureContainer.prototype, "armature", {
        /**
         * 当前正在使用的armature
         * @returns {DragonBonesArmature}
         */
        get: function () {
            return this.armatures[this.currArmatureIndex];
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 获取Bone
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
     * 播放动作
     * @param action
     * @param playNum
     */
    DragonBonesArmatureContainer.prototype.play = function (action, playNum) {
        if (playNum === void 0) { playNum = undefined; }
        if (this.actions[action] == null) {
            Log.debug("DragonBonesArmatureContainer不存在动作：", action);
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
     * 停止当前DragonBonesArmature
     */
    DragonBonesArmatureContainer.prototype.stop = function () {
        var currArm = this.armatures[this.currArmatureIndex];
        if (currArm) {
            currArm.stop();
        }
    };
    /**
     * 播放
     */
    DragonBonesArmatureContainer.prototype.start = function () {
        var currArm = this.armatures[this.currArmatureIndex];
        if (currArm) {
            currArm.start();
        }
    };
    /**
     * 移除上一个DragonBonesArmature
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
     * 添加播放完成处理函数
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
     * 移除播放完成处理函数
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
     * 添加帧事件处理函数
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
     * 移除帧事件处理函数
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
     * 清空
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
     * 销毁
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
 * 商品的渲染器
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
 * tabbar的按钮
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
 * tabbar附加一个容器
 */
var TabBarContainer = (function (_super) {
    __extends(TabBarContainer, _super);
    function TabBarContainer(skinName) {
        if (skinName === void 0) { skinName = null; }
        var _this = _super.call(this) || this;
        //默认皮肤
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
     *  添加一项到ViewStack
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
 * 任务的渲染器
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
         * 六方向检测是否在攻击范围内
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
     * 获取主角
     * @returns {Hero}
     */
    GameController.prototype.getHero = function () {
        return this.gameView.hero;
    };
    GameController.prototype.removeEnemy = function (enemy) {
        this.gameView.removeEnemy(enemy);
    };
    /**
     * 震动
     */
    GameController.prototype.shock = function () {
        App.ShockUtils.shock(App.ShockUtils.MAP, this.gameView);
    };
    /**
     * 慢镜头
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
     * 获取可攻击对象
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
     * 获取离自己最近的对象
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
        var front = attackDis[0]; //前
        var back = attackDis[1]; //后
        var left = attackDis[2]; //左
        var right = attackDis[3]; //右
        var top = attackDis[4]; //上
        var down = attackDis[5]; //下
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
        //创建 ImageLoader 对象
        var loader = new egret.ImageLoader();
        //添加加载完成侦听
        loader.addEventListener(egret.Event.COMPLETE, this.onLoadComplete, this);
        var url = "https://yqllm.wangqucc.com/gameres/dld//resource/assets/launch/launch_bg.jpg";
        //开始加载
        loader.load(url);
    };
    LoadingUI.prototype.onLoadComplete = function (event) {
        var loader = event.target;
        //获取加载到的纹理对象
        var bitmapData = loader.data;
        //创建纹理对象
        var texture = new egret.Texture();
        texture.bitmapData = bitmapData;
        //创建 Bitmap 进行显示
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
     *对面板进行显示初始化，用于子类继承
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
        //提前初始化好怪物
        this.enemys = new Array();
        for (var i = 0; i < 4; i++) {
            var enemy = ObjectPool.pop("Enemy", this.controller);
            enemy.init();
            this.enemys.push(enemy);
        }
        while (this.enemys.length) {
            this.enemys.pop().destory();
        }
        //提前初始化好Boss
        var boss = ObjectPool.pop("Boss", this.controller);
        boss.destory();
        //创建主角
        this.hero = ObjectPool.pop("Hero", this.controller);
        this.hero.init();
        this.hero.x = App.StageUtils.getWidth() * 0.3;
        this.hero.y = App.StageUtils.getHeight() * 0.7;
        this.objectContainer.addChild(this.hero);
        //创建Enemy
        this.startCreateEnemy();
        if (!App.DeviceUtils.IsMobile) {
            this.touchEnabled = true;
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
        }
        //深度排序
        App.TimerManager.doTimer(3, 0, this.sortGameObjs, this);
    };
    /**
     *对面板数据的初始化，用于子类继承
     *
     */
    GameView.prototype.initData = function () {
        _super.prototype.initData.call(this);
    };
    /**
     * 开始创建怪物
     */
    GameView.prototype.startCreateEnemy = function () {
        this.enemys.length = 0;
        App.TimerManager.doTimer(100, 0, this.createEnemy, this);
    };
    /**
     * 创建怪物
     */
    GameView.prototype.createEnemy = function () {
        this.enemys.push(this.createEnemySingle("Enemy"));
        if (this.enemys.length >= 4) {
            App.TimerManager.remove(this.createEnemy, this);
        }
    };
    /**
     * 创建Boss
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
 * DragonBones工厂类
 */
var DragonBonesFactory = (function (_super) {
    __extends(DragonBonesFactory, _super);
    /**
     * 构造函数
     */
    function DragonBonesFactory() {
        var _this = _super.call(this) || this;
        _this.averageUtils = new AverageUtils();
        _this.factory = new dragonBones.EgretFactory();
        _this.clocks = new Array();
        _this.clocksLen = 0;
        _this.files = [];
        //默认开启
        _this.start();
        return _this;
    }
    /**
     * 初始化一个动画文件
     * @param skeletonData 动画描述文件
     * @param texture 动画资源
     * @param textureData 动画资源描述文件
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
     * 移除动画文件
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
     * 清空所有动画
     */
    DragonBonesFactory.prototype.clear = function () {
        while (this.files.length) {
            this.removeArmatureFile(this.files[0]);
        }
    };
    /**
     * 添加动画描述文件
     * @param skeletonData
     */
    DragonBonesFactory.prototype.addSkeletonData = function (skeletonData) {
        this.factory.parseDragonBonesData(skeletonData);
    };
    /**
     * 添加动画所需资源
     * @param texture 动画资源
     * @param textureData 动画资源描述文件
     */
    DragonBonesFactory.prototype.addTextureAtlas = function (texture, textureData) {
        this.factory.parseTextureAtlasData(textureData, texture);
    };
    /**
     * 移除动画描述文件
     * @param skeletonData
     */
    DragonBonesFactory.prototype.removeSkeletonData = function (name) {
        this.factory.removeDragonBonesData(name);
    };
    /**
     * 移除动画所需资源
     * @param texture 动画资源
     * @param textureData 动画资源描述文件
     */
    DragonBonesFactory.prototype.removeTextureAtlas = function (name) {
        this.factory.removeTextureAtlasData(name);
    };
    /**
     * 创建一个动画
     * @param name 动作名称
     * @param fromDragonBonesDataName 动画文件名称
     * @returns {Armature}
     */
    DragonBonesFactory.prototype.makeArmature = function (name, fromDragonBonesDataName, playSpeed) {
        if (playSpeed === void 0) { playSpeed = 1; }
        var armature = this.factory.buildArmature(name, fromDragonBonesDataName);
        if (armature == null) {
            Log.warn("不存在Armature： " + name);
            return null;
        }
        var clock = this.createWorldClock(playSpeed);
        var result = new DragonBonesArmature(armature, clock);
        return result;
    };
    /**
     * 创建一个动画（急速模式）
     * @param name 动作名称
     * @param fromDragonBonesDataName 动画文件名称
     * @returns {Armature}
     */
    DragonBonesFactory.prototype.makeFastArmature = function (name, fromDragonBonesDataName, playSpeed) {
        if (playSpeed === void 0) { playSpeed = 1; }
        var result = this.makeArmature(name, fromDragonBonesDataName, playSpeed);
        result.getArmature().cacheFrameRate = 24;
        return result;
    };
    /**
     * 创建WorldClock
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
     * dragonBones体系的每帧刷新
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
     * 停止
     */
    DragonBonesFactory.prototype.stop = function () {
        if (this.isPlay) {
            App.TimerManager.remove(this.onEnterFrame, this);
            this.isPlay = false;
        }
    };
    /**
     * 开启
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
 * 引导背景层，实现的是一个类似不规则遮罩的功能
 */
var GuideMaskBackgroud = (function (_super) {
    __extends(GuideMaskBackgroud, _super);
    /**
     * 构造函数
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
     * 初始化游戏宽高
     * @param stageWidth 宽
     * @param stageHeight 高
     */
    GuideMaskBackgroud.prototype.init = function (stageWidth, stageHeight) {
        this._stageWidth = stageWidth;
        this._stageHeight = stageHeight;
    };
    /**
     * Draw
     * @param deductRec 抠出矩形区域
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
     * 销毁
     */
    GuideMaskBackgroud.prototype.destroy = function () {
        this.removeChildren();
        this._bgs = [];
    };
    /**
     * 移除所有对象
     */
    GuideMaskBackgroud.prototype.removeAllChild = function () {
        while (this.numChildren) {
            var bg = this.removeChildAt(0);
            this._bgs.push(bg);
        }
    };
    /**
     * 添加一个bg
     * @param $x 初始X
     * @param $y 初始Y
     * @param $w 宽
     * @param $h 高
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
     * 重写hitTest
     * 检测指定坐标是否在显示对象内
     * @method egret.DisplayObject#hitTest
     * @param x {number} 检测坐标的x轴
     * @param y {number} 检测坐标的y轴
     * @param ignoreTouchEnabled {boolean} 是否忽略TouchEnabled
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
 * 引导工具类，根据每个项目重写实现可重写实现
 */
var GuideUtils = (function (_super) {
    __extends(GuideUtils, _super);
    function GuideUtils() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //handDir  1:下面 2:上面
        //txtdir  箭头指向: 1:背景左箭头下 2:背景左箭头上 3:背景右箭头下 4:背景右箭头上
        _this.configData = {
            "1": {
                "1": {
                    "txt": "点击这里，去设置宠物出战",
                    "txtdir": 1,
                    "handDir": 1
                },
                "2": {
                    "txt": "点击选择一个宠物出战",
                    "txtdir": 3,
                    "handDir": 1
                },
                "3": {
                    "txt": "点击宠物出战",
                    "txtdir": 3,
                    "handDir": 1
                }
            },
            "2": {
                "1": {
                    "txt": "更多宠物，可以抽取获得哦！",
                    "txtdir": 1,
                    "handDir": 2
                },
                "2": {
                    "txt": "点击抽取宠物",
                    "txtdir": 1,
                    "handDir": 1
                }
            },
            "3": {
                "1": {
                    "txt": "点击选择另一个宠物",
                    "txtdir": 1,
                    "handDir": 1
                },
                "2": {
                    "txt": "点击宠物出战",
                    "txtdir": 3,
                    "handDir": 1
                }
            },
            "4": {
                "1": {
                    "txt": "点击查看宠物属性",
                    "txtdir": 4,
                    "handDir": 1
                },
                "2": {
                    "txt": "点击宠物升级",
                    "txtdir": 1,
                    "handDir": 2
                },
                "3": {
                    "txt": "点击选择升级材料",
                    "txtdir": 3,
                    "handDir": 1
                },
                "4": {
                    "txt": "选择一个宠物或卡牌作为材料",
                    "txtdir": 3,
                    "handDir": 1
                },
                "5": {
                    "txt": "选择材料后点击确定回到升级界面",
                    "txtdir": 1,
                    "handDir": 2
                },
                "6": {
                    "txt": "点击完成升级",
                    "txtdir": 1,
                    "handDir": 2
                }
            },
            "5": {
                "1": {
                    "txt": "现在立刻享受\n炫酷的飞行吧",
                    "txtdir": 1,
                    "handDir": 2
                },
                "2": {
                    "txt": "每天前3次购买免费",
                    "txtdir": 1,
                    "handDir": 1
                },
                "3": {
                    "txt": "开始战斗吧",
                    "txtdir": 1,
                    "handDir": 2
                }
            },
            "6": {
                "1": {
                    "txt": "点击这里查看战机",
                    "txtdir": 1,
                    "handDir": 1
                },
                "2": {
                    "txt": "点击升级战机，\n可以提高战力",
                    "txtdir": 1,
                    "handDir": 2
                }
            }
        };
        /**
         * 大步骤
         * @type {number}
         */
        _this.currPart = 0;
        /**
         * 小步骤
         * @type {number}
         */
        _this.currStep = 0;
        return _this;
    }
    /**
     * 下一步
     */
    GuideUtils.prototype.next = function () {
        if (this.view == null || this.view.parent == null) {
            return;
        }
        this.currStep++;
        if (!this.configData[this.currPart][this.currStep]) {
            //下一部分
            this.currPart++;
            this.currStep = 1;
            //通知服务端
            //TODO
        }
        if (!this.configData[this.currPart]) {
            //所有引导结束
            this.currPart = 0;
            this.currStep = 0;
        }
        this.hide();
    };
    /**
     * 显示
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
     * 隐藏
     */
    GuideUtils.prototype.hide = function () {
        App.DisplayUtils.removeFromParent(this.view);
    };
    /**
     * 引导是否显示
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
     * 构造函数
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
     * 屏幕大小改变时重置
     */
    GuideView.prototype.onResize = function () {
        if (this.stage) {
            egret.setTimeout(this.refurbish, this, 500);
        }
    };
    /**
     * 刷新
     */
    GuideView.prototype.refurbish = function () {
        this.setData(this._obj, this._data);
    };
    /**
     * 设置显示数据
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
        //不透明区域
        this._bg.init(egret.MainContext.instance.stage.stageWidth, egret.MainContext.instance.stage.stageHeight);
        this._bg.draw(this._objRec);
        //透明区域
        this._maskPic.cacheAsBitmap = false;
        this._maskPic.x = this._objRec.x;
        this._maskPic.y = this._objRec.y;
        this._maskPic.width = this._objRec.width;
        this._maskPic.height = this._objRec.height;
        this._maskPic.cacheAsBitmap = true;
        //handDir  1:下面 2:上面
        if (this._data.handDir == 1) {
            this._handPic.scaleY = 1;
            this._handPic.y = this._objRec.y + this._objRec.height - 20;
        }
        else if (this._data.handDir == 2) {
            this._handPic.scaleY = -1;
            this._handPic.y = this._objRec.y + 20;
        }
        this._handPic.x = this._objRec.x + this._objRec.width * 0.5;
        //文字显示
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
        //txtdir  箭头指向: 1:背景左箭头下 2:背景左箭头上 3:背景右箭头下 4:背景右箭头上
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
     * 检测文本提示框是否出了边界
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
 * Controller管理类
 */
var ControllerManager = (function (_super) {
    __extends(ControllerManager, _super);
    /**
     * 构造函数
     */
    function ControllerManager() {
        var _this = _super.call(this) || this;
        _this._modules = {};
        return _this;
    }
    /**
     * 清空处理
     */
    ControllerManager.prototype.clear = function () {
        this._modules = {};
    };
    /**
     * 动态添加的Controller
     * @param key 唯一标识
     * @param manager Manager
     *
     */
    ControllerManager.prototype.register = function (key, control) {
        if (this.isExists(key))
            return;
        this._modules[key] = control;
    };
    /**
     * 动态移除Controller
     * @param key 唯一标识
     *
     */
    ControllerManager.prototype.unregister = function (key) {
        if (!this.isExists(key))
            return;
        this._modules[key] = null;
        delete this._modules[key];
    };
    /**
     * 是否已经存在Controller
     * @param key 唯一标识
     * @return Boolean
     *
     */
    ControllerManager.prototype.isExists = function (key) {
        return this._modules[key] != null;
    };
    /**
     * 跨模块消息传递
     * @param controllerD Controller唯一标识
     * @param key 消息唯一标识
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
            Log.warn("模块" + controllerD + "不存在");
            return null;
        }
    };
    /**
     * 获取指定Controller的Model对象
     * @param controllerD Controller唯一标识
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
     * 根据唯一标识获取一个controller对象
     * @param controllerD Controller唯一标识
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
        _this.monsterIntro = new MonsterIntro(); //左侧妖兽详情界面
        _this.monsterList = new MonsterList();
        _this.seletedItemIndex = 0;
        //用户详情
        _this.user = UserModel.instance();
        _this.skinName = "resource/skins/GuiScreenSkin.exml";
        return _this;
    }
    /**
     *对面板进行显示初始化，用于子类继承
     *
     */
    HomeView.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.addEveListeners();
        this.roleInfo();
        this.loadMstListDatas(); //加載妖獸列表
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
    //获取用户数据 界面赋值
    HomeView.prototype.roleInfo = function () {
        // RoleInfoConst.roleInfo = JSON.parse("{\"ext\":\"\",\"pets\":[{\"level\":1,\"roleId\":124,\"num\":20…me\":\"qq\",\"diamondCount\":0,\"goldCount\":0,\"id\":124}");
        RoleInfoConst.roleInfo = JSON.parse('{\"ext\":\"\",\"pets\":[{\"level\":1,\"roleId\":124,\"num\":20004,\"name\":\"霜靈\",\"id\":359,\"statu\":0},{\"level\":1,\"roleId\":124,\"num\":20005,\"name\":\"暗精\",\"id\":360,\"statu\":0},{\"level\":1,\"roleId\":124,\"num\":20002,\"name\":\"狂徒\",\"id\":361,\"statu\":1}],\"nickname\":\"qq\",\"diamondCount\":0,\"goldCount\":0,\"id\":124}');
        this.webInfo = RoleInfoConst.roleInfo;
        if (!this.webInfo) {
            Log.debug("webInfo is undefind");
            return;
        }
        this.user.username = this.webInfo["nickname"];
        this.user.userbrands = this.webInfo["diamondCount"]; //徽章
        this.user.usertreasure = this.webInfo["goldCount"]; //金币
        this.user.id = this.webInfo["id"];
        this.user.adnumber = this.webInfo["ext"] == "nothing" ? 0 : this.webInfo["ext"];
        this.brandsLabel.text = this.user.userbrands + ""; //徽章
        this.goldDisplay.text = this.user.usertreasure + ""; //金币
        this.unameLabel.text = this.user.username;
    };
    HomeView.prototype.addEveListeners = function () {
        this.instructionsBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.instructionsBtnClickHandle, this);
        this.settingBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.settingBtnClickHandle, this);
        this.advertisingBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.advertisingBtnClickHandle, this);
        this.monsterBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.monsterBtnClickHandle, this);
        this.matchBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.matchBtnClickHandle, this);
        this.improveBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.upmonstrrLevel, this);
        //解锁妖怪
        App.MessageCenter.addListener(EventNames.Pet_unlock, this.unlocksuccess, this);
        //强化妖怪
        App.MessageCenter.addListener(EventNames.Pet_uplevel, this.levelupsuccess, this);
        //更新用户信息
        App.MessageCenter.addListener(EventNames.Role_update, this.updatarolesuccess, this);
        //获取用户信息
        App.MessageCenter.addListener(EventNames.Rolo_INFO, this.getrolesuccess, this);
    };
    HomeView.prototype.playSound = function () {
        App.SoundManager.playEffect("sound_dianji");
    };
    //游戏说明
    HomeView.prototype.instructionsBtnClickHandle = function (e) {
        this.playSound();
        //  App.ViewManager.open(ViewConst.SettlementView);
        // App.MessageCenter.dispatch(EventNames.Fight_End, 2);
        App.ViewManager.open(ViewConst.ExplainView);
    };
    //设置
    HomeView.prototype.settingBtnClickHandle = function (e) {
        this.playSound();
        App.ViewManager.open(ViewConst.SettingView);
    };
    //广告
    HomeView.prototype.advertisingBtnClickHandle = function (e) {
        this.playSound();
        App.ViewManager.open(ViewConst.AdsView);
    };
    //妖兽
    HomeView.prototype.monsterBtnClickHandle = function (e) {
        this.playSound();
        this.displayMainUI(false);
        this.displayMstInfoUI(true);
    };
    //开始匹配
    HomeView.prototype.matchBtnClickHandle = function (e) {
        this.playSound();
        App.ViewManager.open(ViewConst.MatchingView);
    };
    //返回主界面
    HomeView.prototype.gobackBtnClickHandle = function (e) {
        this.playSound();
        this.displayMainUI(true);
        this.displayMstInfoUI(false);
    };
    HomeView.prototype.upmonstrrLevel = function () {
        App.SoundManager.playEffect("sound_dianji");
        var cost = this.user.usertreasure; //金币
        var ods = this.monsterIntro.model.odds * 100; //升级概率
        var nedcost = this.monsterIntro.model.costnumber; //强化所需
        var radm = App.RandomUtils.limit(1, 100);
        if (cost < nedcost) {
            App.ViewManager.open(ViewConst.LevelRewardView, 2, "徽記不足，無法進行強化！");
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
            //强化失败
            App.ViewManager.open(ViewConst.LevelRewardView, 2, "很遺憾，強化失敗！");
            this.user.usertreasure = cost - nedcost;
            this.changeUserInfo();
        }
    };
    //创建排行榜列表UI
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
    //开始加载妖兽序列帧动作资源
    HomeView.prototype.startLoadRoleRes = function () {
        if (this.monsterId == 0) {
        }
        else {
            this.mcName = "monster_" + this.monsterId + "_stand";
            var mcPath = "https://yqllm.wangqucc.com/gameres/dld/resource/assets/rpgGame/monster/" + this.monsterId + "/";
            RpgGameRes.loadAvatar(mcPath, this.mcName, this.onLoadComplate, this);
        }
    };
    //完成加载妖兽序列帧动作资源回调
    HomeView.prototype.onLoadComplate = function () {
        var avatarResName = this.mcName;
        var data = RES.getRes("avatar_" + avatarResName + ".json");
        var texture = RES.getRes("avatar_" + avatarResName + ".png");
        var mcFactory = new egret.MovieClipDataFactory(data, texture);
        this.standMC.movieClipData = mcFactory.generateMovieClipData(avatarResName);
        this.standMC.gotoAndPlay("stand_0", -1);
    };
    //显示或者隐藏主界面UI
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
    //alpha改变动画
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
    //显示或隐藏怪物简介和列表
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
    //怪物角色平台移动
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
    //解锁妖怪
    HomeView.prototype.unlockmonster = function (evt) {
        var obj1 = this.mstListDatas[evt.data];
        if (obj1["unlock"] > this.user.userbrands) {
            App.ViewManager.open(ViewConst.LevelRewardView, 4, "勛章不足！收集足夠勛章才能解鎖妖怪！");
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
        App.ViewManager.open(ViewConst.LevelRewardView, 3, "恭喜解鎖新的妖怪");
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
        this.loadMstListDatas(); //加載妖獸列表
        this.monsterList.loadData(this.mstListDatas);
        var info1 = this.mstListDatas[this.seletedItemIndex];
        this.updatemodel(info1);
        this.updateUpLevelInfo();
        this.updateMonstInfo();
    };
    //  数据更新
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
    //更新妖怪信息界面 
    HomeView.prototype.updateUpLevelInfo = function () {
        this.expendLabel.text = this.user.monsterModel.costnumber + "";
        this.monstName.text = this.user.monsterModel.monstername + "";
    };
    HomeView.prototype.updateMonstInfo = function () {
        this.monsterIntro.updateInfr();
    };
    /*------------------更新用户信息--------------------*/
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
                monstintro: "冰之國位於極寒之境，多年來鮮有人踏足。王國方圓百裏都是由皇家法師團布下的冰霜結界，誤入的冒險者片刻就會成為壹座冰雕。作為靈族中法術天分最高的人，王子“霜靈”對王國百年前便立下“遺世獨立”的鐵律不屑壹顧，他壹心只想證明自己的實力。“終於偷溜出王國了，接下來就是找個最厲害的家夥，打敗他後本王子的揚名天下了吧！”",
                currentlevel: 1,
                name: "霜靈",
                unlock: 0,
                skill1: { skillid: 30004, skillname: "普攻", skilltype: 1, cd: 0, skillspace: 5, skillspacetype: 2, skillangle: 45, skillradiues: 0, skilldistance: 0, skilldisplacement: 0 },
                skill2: { skillid: 30010, skillname: "霜甲", skilltype: 2, cd: 0, skillspace: 0, skillspacetype: 5, skillangle: 0, skillradiues: 0, skilldistance: 0, skilldisplacement: 0 },
                skill3: { skillid: 30016, skillname: "隕冰", skilltype: 3, cd: 40, skillspace: 45, skillspacetype: 3, skillangle: 0, skillradiues: 10, skilldistance: 5, skilldisplacement: 0 }, },
            { monsterId: 20005,
                status: Global.useStatus.unused,
                monstintro: "黑暗法陣傾瀉出來的能量似乎還影響著她，曾經那位高貴的精靈女王，現在變得性情暴戾。“暗精”是她給自己取的綽號，自從被滅族之後，她就拋棄了自己的姓名。如今，她的心中只有仇恨。“狂徒，終有壹天我要你血債血償！”——暗精",
                currentlevel: 1,
                name: "暗精",
                unlock: 0,
                skill1: { skillid: 30005, skillname: "普攻", skilltype: 1, cd: 0, skillspace: 4, skillspacetype: 2, skillangle: 45, skillradiues: 0, skilldistance: 0, skilldisplacement: 0 },
                skill2: { skillid: 30011, skillname: "賜福", skilltype: 2, cd: 0, skillspace: 0, skillspacetype: 5, skillangle: 0, skillradiues: 0, skilldistance: 0, skilldisplacement: 0 },
                skill3: { skillid: 30017, skillname: "劍氣", skilltype: 3, cd: 40, skillspace: 0, skillspacetype: 5, skillangle: 0, skillradiues: 0, skilldistance: 0, skilldisplacement: 0 },
            },
            { monsterId: 20002,
                status: Global.useStatus.unused,
                monstintro: "巨大的召喚法陣在眾多黑暗精靈的法力灌輸下，迸發出血紅的光芒。光芒之中，壹個身影逐漸實體化。精靈女王迫不及待想要奴役這只異世界的惡魔，然而施法耗費了他太多的靈力。直到夥伴們的哀嚎響徹荒野，他才發現場面已經失控。除女王僥幸逃脫外，眾多黑暗精靈被屠戮殆盡。血泊之中，只有閃爍的刀光，和“狂徒”那雙鮮紅的雙眼。",
                currentlevel: 1,
                name: "狂徒",
                unlock: 0,
                skill1: { skillid: 30002, skillname: "普攻", skilltype: 1, cd: 0, skillspace: 3, skillspacetype: 2, skillangle: 45, skillradiues: 0, skilldistance: 0, skilldisplacement: 0 },
                skill2: { skillid: 30008, skillname: "狂怒", skilltype: 2, cd: 0, skillspace: 0, skillspacetype: 5, skillangle: 0, skillradiues: 0, skilldistance: 0, skilldisplacement: 0 },
                skill3: { skillid: 30014, skillname: "尖嘯", skilltype: 3, cd: 30, skillspace: 0, skillspacetype: 4, skillangle: 0, skillradiues: 0, skilldistance: 5, skilldisplacement: 15 },
            },
            { monsterId: 20001,
                status: Global.useStatus.locked,
                monstintro: "“迅翼”是遠古龍族的後裔。它來無影去無蹤，沒人知道它的巢穴在哪裏。它總是盤踞在高空中，尋找著心儀的獵物。不要試圖去挑戰這頭猛獸，因為當壹絲風掠過，下壹秒被撕成碎片的人可能就是妳。",
                currentlevel: 1,
                name: "迅翼",
                unlock: 30,
                skill1: { skillid: 30001, skillname: "普攻", skilltype: 1, cd: 0, skillspace: 3, skillspacetype: 2, skillangle: 45, skillradiues: 0, skilldistance: 0, skilldisplacement: 0 },
                skill2: { skillid: 30007, skillname: "裂空", skilltype: 2, cd: 0, skillspace: 3, skillspacetype: 2, skillangle: 45, skillradiues: 0, skilldistance: 3, skilldisplacement: 0 },
                skill3: { skillid: 30013, skillname: "飛掠", skilltype: 3, cd: 25, skillspace: 0, skillspacetype: 4, skillangle: 0, skillradiues: 0, skilldistance: 0, skilldisplacement: 10 },
            },
            { monsterId: 20003,
                status: Global.useStatus.locked,
                monstintro: "“雷帝”是位高權重的君王，也是神族最強大的勇士。厚重的盔甲之下，道道傷疤代表他輝煌的戰績。他手中的戰錘，名曰“奔雷”，乃矮人王親自為其鑄造，手握此錘者，便能隨意號令閃電。在雷帝強大的實力面前，所有妖魔都會被輕易碾為粉末。",
                currentlevel: 1,
                name: "雷帝",
                unlock: 50,
                skill1: { skillid: 30003, skillname: "普攻", skilltype: 1, cd: 0, skillspace: 3, skillspacetype: 2, skillangle: 45, skillradiues: 0, skilldistance: 0, skilldisplacement: 0 },
                skill2: { skillid: 30009, skillname: "化身", skilltype: 2, cd: 0, skillspace: 0, skillspacetype: 5, skillangle: 0, skillradiues: 0, skilldistance: 0, skilldisplacement: 0 },
                skill3: { skillid: 30015, skillname: "沖撞", skilltype: 3, cd: 30, skillspace: 6, skillspacetype: 2, skillangle: 45, skillradiues: 0, skilldistance: 0, skilldisplacement: 0 },
            },
            { monsterId: 20006,
                status: Global.useStatus.locked,
                monstintro: "“無論妳怎麽努力，這個王位都是留給妳哥哥的。”貴為教團領袖，人類王國的首席智囊，曾經的天族二王子。誰也沒想到他的另壹個身份，“鬼使”。  潛藏這麽多年，他已經實質控制了這個王國。為了奪回王位，他不惜與冥王達成交易。壹場神魔之戰，已在所難免。",
                currentlevel: 1,
                name: "鬼使",
                unlock: 100,
                skill1: { skillid: 30006, skillname: "普攻", skilltype: 1, cd: 0, skillspace: 6, skillspacetype: 2, skillangle: 45, skillradiues: 0, skilldistance: 0, skilldisplacement: 0 },
                skill2: { skillid: 30012, skillname: "勾魂", skilltype: 2, cd: 0, skillspace: 6, skillspacetype: 2, skillangle: 45, skillradiues: 0, skilldistance: 0, skilldisplacement: 0 },
                skill3: { skillid: 30018, skillname: "奪魂", skilltype: 3, cd: 45, skillspace: 100, skillspacetype: 1, skillangle: 0, skillradiues: 0, skilldistance: 0, skilldisplacement: 0 } }
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
                username: "尤利塞斯",
                medal: 9778
            },
            {
                rank: 2,
                username: "Yessenia",
                medal: 8681
            },
            {
                rank: 3,
                username: "阿莎利亞",
                medal: 7324
            },
            {
                rank: 4,
                username: "喬安娜",
                medal: 7306
            },
            {
                rank: 5,
                username: "Giacinta99",
                medal: 7288
            },
            {
                rank: 6,
                username: "海倫娜",
                medal: 7113
            },
            {
                rank: 7,
                username: "艾莉莎",
                medal: 7100
            },
            {
                rank: 8,
                username: "奧古斯汀",
                medal: 7008
            },
            {
                rank: 9,
                username: "多明尼卡",
                medal: 7005
            },
            {
                rank: 10,
                username: "菲力克斯",
                medal: 6852
            },
            {
                rank: 11,
                username: "莎拉lvc",
                medal: 6592
            },
            {
                rank: 12,
                username: "kvg海倫娜",
                medal: 6366
            },
            {
                rank: 13,
                username: "尤利安19827",
                medal: 6152
            },
            {
                rank: 14,
                username: "嬌媚Sunshine",
                medal: 5677
            },
            {
                rank: 15,
                username: "你不懂我的Feel",
                medal: 4852
            },
            {
                rank: 16,
                username: "maTahari",
                medal: 4289
            },
            {
                rank: 17,
                username: "失夜Sak1tama1993",
                medal: 3812
            },
            {
                rank: 18,
                username: "KinKinBbi",
                medal: 3856
            },
            {
                rank: 19,
                username: "溫唇summer",
                medal: 3852
            },
            {
                rank: 20,
                username: "微微妮",
                medal: 3470
            },
            {
                rank: 21,
                username: "布列塔尼",
                medal: 3253
            },
            {
                rank: 22,
                username: "艾芙琳",
                medal: 2896
            },
            {
                rank: 23,
                username: "蘇妮莉亞",
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
                username: "卡爾文",
                medal: 2100
            },
            {
                rank: 27,
                username: "史蒂夫1955",
                medal: 1908
            },
            {
                rank: 28,
                username: "Avangaline",
                medal: 1770
            },
            {
                rank: 29,
                username: "奧古斯特",
                medal: 1569
            },
            {
                rank: 30,
                username: "哈威1998",
                medal: 1355
            },
            {
                rank: 31,
                username: "Cute·寂寥",
                medal: 1119
            },
            {
                rank: 32,
                username: "花黎Pun3ma",
                medal: 970
            },
            {
                rank: 33,
                username: "丹尼斯",
                medal: 892
            },
            {
                rank: 34,
                username: "塞西莉亞",
                medal: 770
            },
            {
                rank: 35,
                username: "海洛伊絲ai",
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
        this.id = 1; //用户id
        this.monsterModel = new MonsterInfoModel(); //当前任务使用的怪物信息
        this.username = "妖怪大乱斗"; //用户名称
        this.usertreasure = 0; //印记(战斗获得)
        this.userbrands = 0; //用户徽章（战斗/广告获得）
        this.adnumber = 0; //观看广告次数
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
        this.introLabel.text = "妖怪簡介\n\n" + "    " + this.model.desc;
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
        this.unlockNumberLabel.text = this.data.unlock + "解锁";
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
    // 图片转灰度
    MonsterListItem.prototype.iconToGray = function () {
        //颜色矩阵数组
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
    //点解解锁
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
        //初始化UI
        _this.loadingView = new LoadingView(_this, LayerManager.UI_Main);
        App.ViewManager.register(ViewConst.Loading, _this.loadingView);
        //注册事件监听
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
        this.txtMsg.text = "资源加载中..." /*+ current + "/" + total*/;
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
        var arr = ["毛泽东", "周恩来", "刘少奇", "朱德", "彭德怀", "林彪", "刘伯承", "陈毅", "贺龙", "聂荣臻", "徐向前", "罗荣桓", "叶剑英", "李大钊", "陈独秀", "孙中山", "孙文", "孙逸仙", "邓小平", "陈云", "江泽民", "李鹏", "朱镕基", "李瑞环", "尉健行", "李岚清", "胡锦涛", "罗干", "温家宝", "吴邦国", "曾庆红", "贾庆林", "黄菊", "吴官正", "李长春", "吴仪", "回良玉", "曾培炎", "周永康", "曹刚川", "唐家璇", "华建敏", "陈至立", "陈良宇", "张德江", "张立昌", "俞正声", "王乐泉", "刘云山", "王刚", "王兆国", "刘淇", "贺国强", "郭伯雄", "胡耀邦", "王乐泉", "王兆国", "周永康", "李登辉", "连战", "陈水扁", "宋楚瑜", "吕秀莲", "郁慕明", "蒋介石", "蒋中正", "蒋经国", "马英九", "习近平", "李克强", "张高丽", "吴帮国", "无帮国", "无邦国", "无帮过", "瘟家宝", "假庆林", "甲庆林", "假青林", "离长春", "习远平", "袭近平", "李磕墙", "贺过墙", "和锅枪", "粥永康", "轴永康", "肘永康", "周健康", "粥健康", "周小康", "布什", "布莱尔", "小泉", "纯一郎", "萨马兰奇", "安南", "阿拉法特", "普京", "默克尔", "克林顿", "里根", "尼克松", "林肯", "杜鲁门", "赫鲁晓夫", "列宁", "斯大林", "马克思", "恩格斯", "金正日", "金日成", "萨达姆", "胡志明", "西哈努克", "希拉克", "撒切尔", "阿罗约", "曼德拉", "卡斯特罗", "富兰克林", "华盛顿", "艾森豪威尔", "拿破仑", "亚历山大", "路易", "拉姆斯菲尔德", "劳拉", "鲍威尔", "奥巴马", "梅德韦杰夫", "金正恩", "本拉登", "奥马尔", "柴玲", "达赖", "达赖喇嘛", "江青", "张春桥", "姚文元", "王洪文", "东条英机", "希特勒", "墨索里尼", "冈村秀树", "冈村宁次", "高丽朴", "赵紫阳", "王丹", "沃尔开西", "李洪志", "李大师", "赖昌星", "马加爵", "班禅", "额尔德尼", "山本五十六", "阿扁", "阿扁万岁", "热那亚", "六四", "六四运动", "美国之音", "密宗", "民国", "民进党", "民运", "民主", "民主潮", "摩门教", "纳粹", "南华早报", "南蛮", "明慧网", "起义", "亲民党", "瘸腿帮", "人民报", "法轮功", "法轮大法", "打倒共产党", "台独万岁", "圣战", "示威", "台独", "台独分子", "台联", "台湾民国", "台湾岛国", "台湾国", "台湾独立", "太子党", "天安门事件", "屠杀", "小泉", "新党", "新疆独立", "新疆分裂", "新疆国", "疆独", "西藏独立", "西藏分裂", "西藏国", "藏独", "藏青会", "藏妇会", "学潮", "学运", "一党专政", "一中一台", "两个中国", "一贯道", "游行", "圆满", "造反", "真善忍", "镇压", "政变", "政治", "政治反对派", "政治犯", "中共", "共产党", "反党", "反共", "政府", "民主党", "中国之春", "转法轮", "自焚", "共党", "共匪", "苏家屯", "基地组织", "塔利班", "东亚病夫", "支那", "高治联", "高自联", "专政", "专制", "四人帮", "核工业基地", "核武器", "铀", "原子弹", "氢弹", "导弹", "核潜艇", "大参考", "小参考", "国内动态清样", "道教", "多维", "佛教", "佛祖", "释迦牟尼", "如来", "阿弥陀佛", "观世音", "普贤", "文殊", "地藏", "河殇", "回教", "密宗", "摩门教", "穆罕默德", "穆斯林", "升天", "圣母", "圣战", "耶和华", "耶稣", "伊斯兰", "真主安拉", "白莲教", "天主教", "基督教", "东正教", "大法", "法轮", "法轮功", "瘸腿帮", "真理教", "真善忍", "转法轮", "自焚", "走向圆满", "黄大仙", "风水", "跳大神", "神汉", "神婆", "真理教", "大卫教", "阎王", "黑白无常", "牛头马面", "藏独", "高丽棒子", "回回", "疆独", "蒙古鞑子", "台独", "台独分子", "台联", "台湾民国", "西藏独立", "新疆独立", "南蛮", "老毛子", "回民吃猪肉", "谋杀", "杀人", "吸毒", "贩毒", "赌博", "拐卖", "走私", "卖淫", "造反", "监狱", "强奸", "轮奸", "抢劫", "先奸后杀", "下注", "押大", "押小", "抽头", "坐庄", "赌马", "赌球", "筹码", "老虎机", "轮盘赌", "安非他命", "大麻", "可卡因", "海洛因", "冰毒", "摇头丸", "杜冷丁", "鸦片", "罂粟", "迷幻药", "白粉", "嗑药", "卖枪支弹药", "K粉", "閪", "屄", "肏", "屌", "马的", "马白勺", "妈的", "妈白勺", "女马ㄉ", "女马的", "女马白勺", "操你", "操妳", "操他", "操人也", "操她", "操女也", "干你", "干妳", "干他", "干人也", "干她", "干女也", "超你", "超妳", "超他", "超人也", "超她", "超女也", "屌你", "屌我", "屌妳", "屌他", "屌人也", "屌她", "屌女也", "凸你", "凸我", "凸妳", "凸他", "凸人也", "凸她", "凸女也", "插你", "插他", "插我", "插她", "插妳", "臭你", "臭妳", "臭他", "臭人也", "臭她", "臭女也", "机八", "鸡八", "G八", "Ｇ八", "机巴", "鸡巴", "G巴", "Ｇ巴", "机叭", "鸡叭", "G叭", "Ｇ叭", "机芭", "鸡芭", "G芭", "Ｇ芭", "机掰", "鸡掰", "G掰", "Ｇ掰", "机Y", "机Ｙ", "鸡Y", "鸡Ｙ", "机8", "鸡８", "靠爸", "靠母", "哭爸", "哭母", "靠北", "老GY", "老ＧＹ", "干GY", "干ＧＹ", "操GY", "操ＧＹ", "超GY", "超ＧＹ", "臭GY", "臭ＧＹ", "干七八", "干78", "干７８", "操七八", "操78", "操７８", "超七八", "超78", "超７８", "臭七八", "臭78", "臭７８", "懒叫", "懒教", "妈B", "鸡巴", "我日", "婊", "屌", "璩美凤", "操你", "阴茎", "妈的", "日你", "阴道", "干你", "干死", "强奸", "你妈", "TNND", "幼齿", "干死你", "作爱", "阝月", "歇逼", "蛤蟆", "发骚", "招妓", "阴唇", "操你妈", "精子", "奸淫", "菜逼", "奶奶的", "日死你", "贱人", "江八点", "你娘", "肛交", "破鞋", "贱逼", "娘的", "狗卵子", "骚货", "操蛋", "大比", "龟公", "穷逼", "欠日", "狗b", "牛逼", "妈批", "欠操", "我操你", "烂逼", "你爸", "屁眼", "密穴", "鸡奸", "群奸", "烂比", "牛比", "喷你", "大b", "小b", "性欲", "你大爷", "淫荡", "轮奸", "中国猪", "狂操", "插你", "婊子", "我操", "淫秽", "江猪媳", "狗屎", "十八摸", "操逼", "二B", "猪毛", "狗操", "奶子", "大花逼", "逼样", "去你妈的", "完蛋操", "下贱", "淫穴", "猪操", "妓女", "阴水", "操比", "精液", "卖比", "16dy-图库", "獸交", "爱女人", "拔出来", "操b", "插进", "插我", "插穴", "吃精", "抽插", "大乳", "调教", "黄色电影", "激情电影", "轮暴", "迷奸", "乳房", "色猫", "色欲", "性爱图库", "亚情", "淫亂", "淫女", "淫蕩", "淫水", "淫汁", "幼圖", "中文搜性网", "自慰", "鷄巴", "學生妹", "１８歲淫亂", "999日本妹", "幹炮", "摸阴蒂", "金鳞岂是池中物", "掰穴皮卡丘", "白虎少妇", "白虎阴穴", "包二奶", "暴淫", "逼痒", "蕩妹", "肥逼", "粉穴", "干穴", "开苞", "口活", "狼友", "春药", "风艳阁", "激情小说", "兽欲", "全裸", "秘唇", "蜜穴", "玉穴", "应召", "菊花蕾", "大力抽送", "干的爽", "肉蒲团", "后庭", "淫叫", "男女交欢", "极品波霸", "兽奸", "流淫", "销魂洞", "操烂", "成人网站", "淫色", "一夜欢", "姦淫", "给你爽", "偷窥图片", "性奴", "大奶头", "奸幼", "中年美妇", "豪乳", "喷精", "逼奸", "脱内裤", "发浪", "浪叫", "肉茎", "菊花洞", "成人自拍", "自拍美穴", "抠穴", "颜射", "肉棍", "淫水爱液", "阴核", "露B", "母子奸情", "人妻熟女", "色界", "丁香社区", "爱图公园", "色色五月天", "鹿城娱乐", "色色", "幼香阁", "隐窝窝", "乱伦熟女网", "插阴", "露阴照", "美幼", "97sese", "嫩鲍鱼", "日本AV女优", "美女走光", "33bbb走光", "激情贴图", "成人论坛", "就去诱惑", "浴室自拍", "BlowJobs", "激情裸体", "丽春苑", "窝窝客", "银民吧", "亚洲色", "碧香亭", "爱色cc", "妹妹骚图", "宾馆女郎", "美腿丝足", "好色cc", "无码长片", "淫水涟涟", "放荡少妇", "成人图片", "黄金圣水", "脚交", "勾魂少妇", "女尻", "我要性交", "SM女王", "乳此丝袜", "日本灌肠", "集体性爱", "国产骚货", "操B指南", "亚洲淫娃", "熟女乱伦", "SM舔穴", "無碼H漫", "大胆少女", "乳此丰满", "屄屄特写", "熟女颜射", "要色色", "耻辱轮奸", "巨乳素人", "妩媚挑逗", "骚姨妈", "裸体少妇", "美少妇", "射奶", "杨思敏", "野外性交", "风骚淫荡", "白虎嫩B", "明星淫图", "淫乱熟女", "高清性愛", "高潮集锦", "淫兽学园", "俏臀摄魄", "有容奶大", "无套内射", "毛鲍", "3P炮图", "性交课", "激凸走光", "性感妖娆", "人妻交换", "监禁陵辱", "生徒胸触", "東洋屄", "翘臀嫩穴", "春光外泻", "淫妇自慰", "本土无码", "淫妻交换", "日屄", "近亲相奸", "艳乳", "白虎小穴", "肛门喷水", "淫荡贵妇", "鬼畜轮奸", "浴室乱伦", "生奸内射", "国产嫖娼", "白液四溅", "带套肛交", "大乱交", "精液榨取", "性感乳娘", "魅惑巨乳", "无码炮图", "群阴会", "人性本色", "极品波神", "淫乱工作", "白浆四溅", "街头扒衣", "口内爆射", "嫩BB", "肛门拳交", "灌满精液", "莲花逼", "自慰抠穴", "人妻榨乳", "拔屄自拍", "洗肠射尿", "人妻色诱", "淫浆", "狂乳激揺", "騷浪", "射爽", "蘚鮑", "制服狩", "無毛穴", "骚浪美女", "肏屄", "舌头穴", "人妻做爱", "插逼", "爆操", "插穴止痒", "骚乳", "食精", "爆乳娘", "插阴茎", "黑毛屄", "肉便器", "肉逼", "淫亂潮吹", "母奸", "熟妇人妻", "発射", "幹砲", "性佣", "爽穴", "插比", "嫩鲍", "骚母", "吃鸡巴", "金毛穴", "体奸", "爆草", "操妻", "a4u", "酥穴", "屄毛", "厕所盗摄", "艳妇淫女", "掰穴打洞", "盗撮", "薄码", "少修正", "巧淫奸戏", "成人片", "换妻大会", "破处", "穴爽", "g点", "欢欢娱乐时空", "近親相姦", "裤袜", "乱伦", "买春", "妹妹阴毛", "免费成人网站", "免费偷窥网", "免费A片", "摩洛客", "嫩b", "捏弄", "女优", "肉棒", "骚姐姐", "色区", "色书库", "射颜", "手淫", "兽交", "吸精少女", "下流地带", "性虎", "性饥渴", "阴部", "淫妹", "淫图", "幼交", "欲火", "援交妹", "嫩屄", "嫩女", "噴精", "情色天崖", "情色文学", "群交亂舞", "日本骚货", "肉唇", "肉沟", "肉棍干骚妇", "肉壶", "肉淫器吞精", "骚妹", "骚女", "骚水", "骚穴", "色狐狸网址", "色狼论坛", "色狼小说", "湿穴", "爽死我了", "舔逼", "舔屁眼", "好嫩", "大波", "亂倫", "做爱电影", "色诱", "秘裂", "采花堂", "含屌", "亚洲性虐", "夫妻自拍", "熟女", "操穴", "裹本", "淫妇", "嫩逼", "淫贱", "欢乐性今宵", "巨乳", "性愛圖片", "学生妹", "炮友之家", "花花公子", "一夜情", "乳沟", "淫虫", "叫床", "porn", "小姐打飞机", "少女被插", "Ｘ到噴屎尿", "口淫", "按摩棒", "操我", "奸情", "被干", "露逼", "美女高潮", "日逼", "肉洞", "阴缔", "插暴", "人妻", "内射", "肉具", "欲仙欲浪", "玉乳", "被插", "吞精", "暴乳", "成人午夜场", "买春堂", "性之站", "成人社区", "群交", "激情聊天", "三八淫", "做爱自拍", "淫妻", "夫妻俱乐部", "激情交友", "诱色uu", "就去色色", "熟妇", "mm美图", "走光偷拍", "77bbb", "虎骑", "咪咪图片", "成人导航", "深爱色色", "厕所偷拍", "成人A片", "夫妻多p", "我就色", "释欲", "你色吗", "裙内偷拍", "男女蒲典", "色97爱", "丝诱", "人妻自拍", "色情工厂", "色色婷婷", "美体艳姿", "颜射自拍", "熟母", "肉丝裤袜", "sm调教", "打野炮", "赤裸天使", "淫欲世家", "就去日", "爱幼阁", "巨屌", "花样性交", "裸陪", "夫妻3p", "大奶骚女", "性愛插穴", "日本熟母", "幼逼", "淫水四溅", "大胆出位", "旅馆自拍", "无套自拍", "快乐AV", "国产无码", "强制浣肠", "援交自拍", "凸肉优", "撅起大白腚", "骚妹妹", "插穴手淫", "双龙入洞", "美女吞精", "处女开包", "调教虐待", "淫肉诱惑", "激情潮喷", "骚穴怒放", "馒头屄", "无码丝袜", "写真", "寂寞自摸", "警奴", "轮操", "淫店", "精液浴", "淫乱诊所", "极品奶妹", "惹火身材", "暴力虐待", "巨乳俏女医", "扉之阴", "淫の方程式", "丁字裤翘臀", "轮奸内射", "空姐性交", "美乳斗艳", "舔鸡巴", "骚B熟女", "淫丝荡袜", "奴隷调教", "阴阜高耸", "翘臀嫩逼", "口交放尿", "媚药少年", "暴奸", "无修正", "国产AV", "淫水横流", "插入内射", "东热空姐", "大波粉B", "互舔淫穴", "丝袜淫妇", "乳此动人", "大波骚妇", "无码做爱", "口爆吞精", "放荡熟女", "巨炮兵团", "叔嫂肉欲", "肉感炮友", "爱妻淫穴", "无码精选", "超毛大鲍", "熟妇骚器", "内射美妇", "毒龙舔脚", "性爱擂台", "圣泉学淫", "性奴会", "密室淫行", "亮屄", "操肿", "无码淫女", "玩逼", "淫虐", "我就去色", "淫痴", "风骚欲女", "亮穴", "操穴喷水", "幼男", "肉箫", "巨骚", "骚妻", "漏逼", "骚屄", "大奶美逼", "高潮白浆", "性战擂台", "淫女炮图", "小穴", "淫水横溢", "性交吞精", "姦染", "淫告白", "乳射", "操黑", "朝天穴", "公媳乱", "女屄", "慰春情", "集体淫", "淫B", "屄屄", "肛屄", "小嫩鸡", "舔B", "嫩奶", "a4y", "品穴", "淫水翻騰", "一本道", "乳尻", "羞耻母", "艳照", "三P", "露毛", "紧穴", "露点", "18禁", "g片", "teen", "無碼電影", "爱液", "插b", "赤裸", "荡妇", "荡女", "浪穴", "露穴", "美穴", "猛插", "迷药", "嫩穴", "肉穴", "乳交", "乳头", "无码", "吸精", "现代情色小说", "性交图", "性息", "艳情小说", "阴部特写", "阴道图片", "淫书", "幼女", "玉蒲团玉女心经", "援助交易", "中国成人论坛", "中国性爱城", "自拍写真", "做爱图片", "掰穴", "万淫堂", "穴图", "穴淫", "艳舞淫业", "咬着龟头", "要射了", "一夜性网", "阴茎插小穴", "陰穴新玩法", "婬乱军团", "淫逼", "淫姐", "淫浪", "淫流", "淫糜", "淫蜜", "淫魔", "淫母", "淫妞", "淫奴", "淫娃", "淫液", "钻插", "H动漫", "交换夫妻", "美腿", "舔脚", "蜜洞", "丝袜", "淫情", "亚洲情色网", "强奸处女", "鸡巴暴胀", "美乳", "大众色情成人网", "火辣图片", "淫声浪语", "疯狂抽送", "淫河", "强暴", "多人性愛", "操屄", "浪女", "色情论坛", "性虎色网", "淫欲日本", "操死", "色迷城", "petgirl", "骚女叫春", "成人百强", "猖妓", "天天干贴图", "密穴贴图", "凌辱", "偷欢", "小逼", "酥痒", "品色堂", "浪妇", "嫖妓指南", "肉缝", "色窝窝", "被操", "巨奶", "骚洞", "阴精", "阴阜", "阴屄", "群魔色舞", "扒穴", "六月联盟", "55sss偷拍区", "张筱雨", "xiao77", "极品黑丝", "丝袜写真", "天天情色", "成人小说", "成人文学", "情色艺术天空", "222se图片", "偷拍", "淫色贴图", "厕奴", "美女成人", "酥胸诱惑", "五月天", "人体摄影", "东北xx网", "玛雅网", "成人bt", "周六性吧", "爆乳", "诱惑视频", "裙下风光", "嘻游中国", "操母狗", "御の二代目", "丝袜足交", "肮脏美学", "亚洲有码", "欲仙欲死", "丝袜高跟", "偷拍美穴", "原味丝袜", "裸露自拍", "针孔偷拍", "放荡少妇宾馆", "性感肉丝", "拳交", "迫奸", "品香堂", "北京xx网", "虐奴", "情色导航", "欧美大乳", "欧美无套", "骚妇露逼", "炮友", "淫水丝袜", "母女双飞", "老少乱伦", "幼妓", "素人娘", "前凸后翘", "制服誘惑", "舔屄", "色色成人", "迷奸系列", "性交无码", "惹火自拍", "胯下呻吟", "淫驴屯", "少妇偷情", "护士诱惑", "群奸乱交", "极品白虎", "曲线消魂", "淫腔", "无码淫漫", "假阳具插穴", "蝴蝶逼", "自插小穴", "SM援交", "西洋美女", "爱液横流", "无码无套", "淫战群P", "口爆", "酒店援交", "乳霸", "湿身诱惑", "火辣写真", "动漫色图", "熟女护士", "粉红穴", "经典炮图", "童颜巨乳", "性感诱惑", "援交薄码", "美乳美穴", "奇淫宝鉴", "美骚妇", "跨下呻吟", "无毛美少女", "流蜜汁", "日本素人", "爆乳人妻", "妖媚熟母", "日本有码", "激情打炮", "制服美妇", "无码彩图", "放尿", "入穴一游", "丰唇艳姬", "群奸轮射", "高级逼", "MM屄", "美臀嫰穴", "淫东方", "国产偷拍", "清晰内射", "嫩穴肉缝", "雪腿玉胯", "骚妇掰B", "白嫩骚妇", "梅花屄", "猛操狂射", "潮喷", "无码体验", "吞精骚妹", "紧缚凌辱", "奸淫电车", "堕淫", "颜骑", "互淫", "逼毛", "胸濤乳浪", "夫妻乱交", "黑屄", "奶大屄肥", "拔屄", "穴海", "换妻杂交", "狂插", "黑逼", "粉屄", "口射", "多人轮", "奶挺臀翘", "扒屄", "痴乳", "鬼輪姦", "乳爆", "浴尿", "淫样", "発妻", "姫辱", "插后庭", "操爽", "嫩缝", "操射", "骚妈", "激插", "暴干", "母子交欢", "嫐屄", "足脚交", "露屄", "柔阴术", "相奸", "淫师荡母", "欠干", "桃园蜜洞", "二穴中出", "奴畜抄", "连続失禁", "大鸡巴", "玩穴", "性交自拍", "叫鸡", "骚浪人妻", "妈B", "鸡巴", "我日", "婊", "屌", "璩美凤", "操你", "阴茎", "妈的", "日你", "阴道", "干你", "干死", "强奸", "你妈", "TNND", "幼齿", "干死你", "作爱", "阝月", "歇逼", "蛤蟆", "发骚", "招妓", "阴唇", "操你妈", "精子", "奸淫", "菜逼", "奶奶的", "日死你", "贱人", "江八点", "你娘", "肛交", "破鞋", "贱逼", "娘的", "狗卵子", "骚货", "操蛋", "大比", "龟公", "穷逼", "欠日", "狗b", "牛逼", "妈批", "欠操", "我操你", "烂逼", "你爸", "屁眼", "密穴", "鸡奸", "群奸", "烂比", "牛比", "喷你", "大b", "小b", "性欲", "你大爷", "淫荡", "轮奸", "中国猪", "狂操", "插你", "婊子", "我操", "淫秽", "江猪媳", "狗屎", "十八摸", "操逼", "二B", "猪毛", "狗操", "奶子", "大花逼", "逼样", "去你妈的", "完蛋操", "下贱", "淫穴", "猪操", "妓女", "阴水", "操比", "精液", "卖比", "16dy-图库", "獸交", "爱女人", "拔出来", "操b", "插进", "插我", "插穴", "吃精", "抽插", "大乳", "调教", "黄色电影", "激情电影", "轮暴", "迷奸", "乳房", "色猫", "色欲", "性爱图库", "亚情", "淫亂", "淫女", "淫蕩", "淫水", "淫汁", "幼圖", "中文搜性网", "自慰", "鷄巴", "學生妹", "１８歲淫亂", "999日本妹", "幹炮", "摸阴蒂", "金鳞岂是池中物", "掰穴皮卡丘", "白虎少妇", "白虎阴穴", "包二奶", "暴淫", "逼痒", "蕩妹", "肥逼", "粉穴", "干穴", "开苞", "口活", "狼友", "春药", "风艳阁", "激情小说", "兽欲", "全裸", "秘唇", "蜜穴", "玉穴", "应召", "菊花蕾", "大力抽送", "干的爽", "肉蒲团", "后庭", "淫叫", "男女交欢", "极品波霸", "兽奸", "流淫", "销魂洞", "操烂", "成人网站", "淫色", "一夜欢", "姦淫", "给你爽", "偷窥图片", "性奴", "大奶头", "奸幼", "中年美妇", "豪乳", "喷精", "逼奸", "脱内裤", "发浪", "浪叫", "肉茎", "菊花洞", "成人自拍", "自拍美穴", "抠穴", "颜射", "肉棍", "淫水爱液", "阴核", "露B", "母子奸情", "人妻熟女", "色界", "丁香社区", "爱图公园", "色色五月天", "鹿城娱乐", "色色", "幼香阁", "隐窝窝", "乱伦熟女网", "插阴", "露阴照", "美幼", "97sese", "嫩鲍鱼", "日本AV女优", "美女走光", "33bbb走光", "激情贴图", "成人论坛", "就去诱惑", "浴室自拍", "BlowJobs", "激情裸体", "丽春苑", "窝窝客", "银民吧", "亚洲色", "碧香亭", "爱色cc", "妹妹骚图", "宾馆女郎", "美腿丝足", "好色cc", "无码长片", "淫水涟涟", "放荡少妇", "成人图片", "黄金圣水", "脚交", "勾魂少妇", "女尻", "我要性交", "SM女王", "乳此丝袜", "日本灌肠", "集体性爱", "国产骚货", "操B指南", "亚洲淫娃", "熟女乱伦", "SM舔穴", "無碼H漫", "大胆少女", "乳此丰满", "屄屄特写", "熟女颜射", "要色色", "耻辱轮奸", "巨乳素人", "妩媚挑逗", "骚姨妈", "裸体少妇", "美少妇", "射奶", "杨思敏", "野外性交", "风骚淫荡", "白虎嫩B", "明星淫图", "淫乱熟女", "高清性愛", "高潮集锦", "淫兽学园", "俏臀摄魄", "有容奶大", "无套内射", "毛鲍", "3P炮图", "性交课", "激凸走光", "性感妖娆", "人妻交换", "监禁陵辱", "生徒胸触", "東洋屄", "翘臀嫩穴", "春光外泻", "淫妇自慰", "本土无码", "淫妻交换", "日屄", "近亲相奸", "艳乳", "白虎小穴", "肛门喷水", "淫荡贵妇", "鬼畜轮奸", "浴室乱伦", "生奸内射", "国产嫖娼", "白液四溅", "带套肛交", "大乱交", "精液榨取", "性感乳娘", "魅惑巨乳", "无码炮图", "群阴会", "人性本色", "极品波神", "淫乱工作", "白浆四溅", "街头扒衣", "口内爆射", "嫩BB", "肛门拳交", "灌满精液", "莲花逼", "自慰抠穴", "人妻榨乳", "拔屄自拍", "洗肠射尿", "人妻色诱", "淫浆", "狂乳激揺", "騷浪", "射爽", "蘚鮑", "制服狩", "無毛穴", "骚浪美女", "肏屄", "舌头穴", "人妻做爱", "插逼", "爆操", "插穴止痒", "骚乳", "食精", "爆乳娘", "插阴茎", "黑毛屄", "肉便器", "肉逼", "淫亂潮吹", "母奸", "熟妇人妻", "発射", "幹砲", "性佣", "爽穴", "插比", "嫩鲍", "骚母", "吃鸡巴", "金毛穴", "体奸", "爆草", "操妻", "a4u", "酥穴", "屄毛", "厕所盗摄", "艳妇淫女", "掰穴打洞", "盗撮", "薄码", "少修正", "巧淫奸戏", "成人片", "换妻大会", "破处", "穴爽", "g点", "欢欢娱乐时空", "近親相姦", "裤袜", "乱伦", "买春", "妹妹阴毛", "免费成人网站", "免费偷窥网", "免费A片", "摩洛客", "嫩b", "捏弄", "女优", "肉棒", "骚姐姐", "色区", "色书库", "射颜", "手淫", "兽交", "吸精少女", "下流地带", "性虎", "性饥渴", "阴部", "淫妹", "淫图", "幼交", "欲火", "援交妹", "嫩屄", "嫩女", "噴精", "情色天崖", "情色文学", "群交亂舞", "日本骚货", "肉唇", "肉沟", "肉棍干骚妇", "肉壶", "肉淫器吞精", "骚妹", "骚女", "骚水", "骚穴", "色狐狸网址", "色狼论坛", "色狼小说", "湿穴", "爽死我了", "舔逼", "舔屁眼", "好嫩", "大波", "亂倫", "做爱电影", "色诱", "秘裂", "采花堂", "含屌", "亚洲性虐", "夫妻自拍", "熟女", "操穴", "裹本", "淫妇", "嫩逼", "淫贱", "欢乐性今宵", "巨乳", "性愛圖片", "学生妹", "炮友之家", "花花公子", "一夜情", "乳沟", "淫虫", "叫床", "porn", "小姐打飞机", "少女被插", "Ｘ到噴屎尿", "口淫", "按摩棒", "操我", "奸情", "被干", "露逼", "美女高潮", "日逼", "肉洞", "阴缔", "插暴", "人妻", "内射", "肉具", "欲仙欲浪", "玉乳", "被插", "吞精", "暴乳", "成人午夜场", "买春堂", "性之站", "成人社区", "群交", "激情聊天", "三八淫", "做爱自拍", "淫妻", "夫妻俱乐部", "激情交友", "诱色uu", "就去色色", "熟妇", "mm美图", "走光偷拍", "77bbb", "虎骑", "咪咪图片", "成人导航", "深爱色色", "厕所偷拍", "成人A片", "夫妻多p", "我就色", "释欲", "你色吗", "裙内偷拍", "男女蒲典", "色97爱", "丝诱", "人妻自拍", "色情工厂", "色色婷婷", "美体艳姿", "颜射自拍", "熟母", "肉丝裤袜", "sm调教", "打野炮", "赤裸天使", "淫欲世家", "就去日", "爱幼阁", "巨屌", "花样性交", "裸陪", "夫妻3p", "大奶骚女", "性愛插穴", "日本熟母", "幼逼", "淫水四溅", "大胆出位", "旅馆自拍", "无套自拍", "快乐AV", "国产无码", "强制浣肠", "援交自拍", "凸肉优", "撅起大白腚", "骚妹妹", "插穴手淫", "双龙入洞", "美女吞精", "处女开包", "调教虐待", "淫肉诱惑", "激情潮喷", "骚穴怒放", "馒头屄", "无码丝袜", "写真", "寂寞自摸", "警奴", "轮操", "淫店", "精液浴", "淫乱诊所", "极品奶妹", "惹火身材", "暴力虐待", "巨乳俏女医", "扉之阴", "淫の方程式", "丁字裤翘臀", "轮奸内射", "空姐性交", "美乳斗艳", "舔鸡巴", "骚B熟女", "淫丝荡袜", "奴隷调教", "阴阜高耸", "翘臀嫩逼", "口交放尿", "媚药少年", "暴奸", "无修正", "国产AV", "淫水横流", "插入内射", "东热空姐", "大波粉B", "互舔淫穴", "丝袜淫妇", "乳此动人", "大波骚妇", "无码做爱", "口爆吞精", "放荡熟女", "巨炮兵团", "叔嫂肉欲", "肉感炮友", "爱妻淫穴", "无码精选", "超毛大鲍", "熟妇骚器", "内射美妇", "毒龙舔脚", "性爱擂台", "圣泉学淫", "性奴会", "密室淫行", "亮屄", "操肿", "无码淫女", "玩逼", "淫虐", "我就去色", "淫痴", "风骚欲女", "亮穴", "操穴喷水", "幼男", "肉箫", "巨骚", "骚妻", "漏逼", "骚屄", "大奶美逼", "高潮白浆", "性战擂台", "淫女炮图", "小穴", "淫水横溢", "性交吞精", "姦染", "淫告白", "乳射", "操黑", "朝天穴", "公媳乱", "女屄", "慰春情", "集体淫", "淫B", "屄屄", "肛屄", "小嫩鸡", "舔B", "嫩奶", "a4y", "品穴", "淫水翻騰", "一本道", "乳尻", "羞耻母", "艳照", "三P", "露毛", "紧穴", "露点", "18禁", "g片", "teen", "無碼電影", "爱液", "插b", "赤裸", "荡妇", "荡女", "浪穴", "露穴", "美穴", "猛插", "迷药", "嫩穴", "肉穴", "乳交", "乳头", "无码", "吸精", "现代情色小说", "性交图", "性息", "艳情小说", "阴部特写", "阴道图片", "淫书", "幼女", "玉蒲团玉女心经", "援助交易", "中国成人论坛", "中国性爱城", "自拍写真", "做爱图片", "掰穴", "万淫堂", "穴图", "穴淫", "艳舞淫业", "咬着龟头", "要射了", "一夜性网", "阴茎插小穴", "陰穴新玩法", "婬乱军团", "淫逼", "淫姐", "淫浪", "淫流", "淫糜", "淫蜜", "淫魔", "淫母", "淫妞", "淫奴", "淫娃", "淫液", "钻插", "H动漫", "交换夫妻", "美腿", "舔脚", "蜜洞", "丝袜", "淫情", "亚洲情色网", "强奸处女", "鸡巴暴胀", "美乳", "大众色情成人网", "火辣图片", "淫声浪语", "疯狂抽送", "淫河", "强暴", "多人性愛", "操屄", "浪女", "色情论坛", "性虎色网", "淫欲日本", "操死", "色迷城", "petgirl", "骚女叫春", "成人百强", "猖妓", "天天干贴图", "密穴贴图", "凌辱", "偷欢", "小逼", "酥痒", "品色堂", "浪妇", "嫖妓指南", "肉缝", "色窝窝", "被操", "巨奶", "骚洞", "阴精", "阴阜", "阴屄", "群魔色舞", "扒穴", "六月联盟", "55sss偷拍区", "张筱雨", "xiao77", "极品黑丝", "丝袜写真", "天天情色", "成人小说", "成人文学", "情色艺术天空", "222se图片", "偷拍", "淫色贴图", "厕奴", "美女成人", "酥胸诱惑", "五月天", "人体摄影", "东北xx网", "玛雅网", "成人bt", "周六性吧", "爆乳", "诱惑视频", "裙下风光", "嘻游中国", "操母狗", "御の二代目", "丝袜足交", "肮脏美学", "亚洲有码", "欲仙欲死", "丝袜高跟", "偷拍美穴", "原味丝袜", "裸露自拍", "针孔偷拍", "放荡少妇宾馆", "性感肉丝", "拳交", "迫奸", "品香堂", "北京xx网", "虐奴", "情色导航", "欧美大乳", "欧美无套", "骚妇露逼", "炮友", "淫水丝袜", "母女双飞", "老少乱伦", "幼妓", "素人娘", "前凸后翘", "制服誘惑", "舔屄", "色色成人", "迷奸系列", "性交无码", "惹火自拍", "胯下呻吟", "淫驴屯", "少妇偷情", "护士诱惑", "群奸乱交", "极品白虎", "曲线消魂", "淫腔", "无码淫漫", "假阳具插穴", "蝴蝶逼", "自插小穴", "SM援交", "西洋美女", "爱液横流", "无码无套", "淫战群P", "口爆", "酒店援交", "乳霸", "湿身诱惑", "火辣写真", "动漫色图", "熟女护士", "粉红穴", "经典炮图", "童颜巨乳", "性感诱惑", "援交薄码", "美乳美穴", "奇淫宝鉴", "美骚妇", "跨下呻吟", "无毛美少女", "流蜜汁", "日本素人", "爆乳人妻", "妖媚熟母", "日本有码", "激情打炮", "制服美妇", "无码彩图", "放尿", "入穴一游", "丰唇艳姬", "群奸轮射", "高级逼", "MM屄", "美臀嫰穴", "淫东方", "国产偷拍", "清晰内射", "嫩穴肉缝", "雪腿玉胯", "骚妇掰B", "白嫩骚妇", "梅花屄", "猛操狂射", "潮喷", "无码体验", "吞精骚妹", "紧缚凌辱", "奸淫电车", "堕淫", "颜骑", "互淫", "逼毛", "胸濤乳浪", "夫妻乱交", "黑屄", "奶大屄肥", "拔屄", "穴海", "换妻杂交", "狂插", "黑逼", "粉屄", "口射", "多人轮", "奶挺臀翘", "扒屄", "痴乳", "鬼輪姦", "乳爆", "浴尿", "淫样", "発妻", "姫辱", "插后庭", "操爽", "嫩缝", "操射", "骚妈", "激插", "暴干", "母子交欢", "嫐屄", "足脚交", "露屄", "柔阴术", "相奸", "淫师荡母", "欠干", "桃园蜜洞", "二穴中出", "奴畜抄", "连続失禁", "大鸡巴", "玩穴", "性交自拍", "叫鸡", "骚浪人妻", "做爱", "操", "坐台", "自焚", "子宫", "杂种", "淫", "阴毛", "阴户", "阴蒂", "爷爷", "摇头丸", "阳具", "性交", "性爱", "小鸡鸡", "小弟弟", "小便", "武藤", "慰安妇", "猥亵", "猥琐", "生殖", "煞笔", "傻逼", "傻B", "色情", "骚逼", "三陪", "肉欲", "肉体", "情色", "排泄", "女干", "灭族", "梅毒", "卵子", "淋病", "口交", "尻", "贱", "鸡吧", "鸡八", "胡瘟", "龟头", "狗日", "狗娘", "根正苗红", "睾丸", "疯狗", "腚", "大便", "打炮", "打飞机", "娼", "肏", "瘪三", "妈逼", "屄", "妈", "爸", "爹", "爷", "奶", "儿子", "sm", "尼玛", "装B", "ADMIN", "Admin", "xtl", "system", "admin", "Administrator", "administrator", "管理", "管里", "管理员", "服务管理", "服务器", "活动管理员", "官方", "维护", "系统", "系统公告", "审查", "巡查", "监督", "监管", "game", "master", "GAMEMASTER", "GameMaster", "GM", "Gm", "gm", "游戏管理员", "Client", "Server", "CS", "Cs", "cs", "cS", "KEFU", "kefu", "Kefu", "KeFu", "助理", "客户服务", "客服", "服务天使", "TEsT", "tESt", "test", "test", "TeSt", "tEST", "Test", "测试", "辅助程序", "运营", "运营者", "运营组", "运营商", "运营长", "运营官", "运营人", "蔡文胜", "李兴平", "汪东风", "骆海坚", "曹政", "sf", "私服", "私人服务器", "wg", "外挂", "&", "开房", "ㄅ", "ㄆ", "ㄇ", "ㄈ", "ㄉ", "ㄊ", "ㄋ", "ㄌ", "ㄍ", "ㄎ", "ㄏ", "ㄐ", "ㄑ", "ㄒ", "ㄓ", "ㄔ", "ㄕ", "ㄖ", "ㄗ", "ㄘ", "ㄙ", "ㄚ", "ㄛ", "ㄜ", "ㄝ", "ㄞ", "ㄟ", "ㄠ", "ㄡ", "ㄢ", "ㄣ", "ㄤ", "ㄥ", "ㄦ", "ㄧ", "ㄨ", "ㄩ", "鞴", "鐾", "瘭", "镳", "黪", "瘥", "觇", "孱", "廛", "蒇", "冁", "羼", "螭", "傺", "瘛", "舂", "艟", "瘳", "雠", "搋", "嘬", "辏", "殂", "汆", "爨", "榱", "毳", "皴", "蹉", "鹾", "纛", "髑屙民", "莪", "苊", "鲕", "鲼", "瀵", "酆", "幞", "黻", "呒", "黼", "阝", "阝月", "彀", "觏", "毂", "汩", "罟", "嘏", "鲴", "宄", "庋", "刿", "虢", "馘", "撖", "夯", "薅", "曷", "翮", "曷", "翮", "觳", "冱", "怙", "戽", "祜", "瓠", "鹱", "溷", "耠", "锪", "劐", "蠖", "丌", "乩", "赍", "殛", "蕺", "掎", "彐", "芰", "跽", "鲚", "葭", "恝", "湔", "搛", "鲣", "鞯", "囝", "趼", "醮", "疖", "苣", "屦", "醵", "蠲", "桊", "鄄", "谲", "爝", "麇", "贶", "悝", "喟", "仂", "泐", "鳓", "诔", "酹", "嫠", "黧", "蠡", "醴", "鳢", "轹", "詈", "跞", "奁", "臁", "蚍", "埤", "罴", "鼙", "庀", "仳", "圮綦", "屺", "綮", "汔", "碛", "葜", "佥", "岍", "愆", "搴", "钤", "掮", "凵", "肷", "椠", "戕", "锖", "檠", "苘", "謦", "庆红", "跫", "銎", "邛", "筇", "蛩鼽", "诎", "麴", "黢", "劬", "朐", "璩", "蘧", "衢", "蠼毵", "糁", "Xijinping", "likeqiang", "zhangdejiang", "yuzhengsheng", "liuyunshan", "wangqishan", "zhanggaoli", "dishun", "Dishun", "DISHUN", "DiShun", "16大", "18摸", "21世纪中国基金会", "6-4tianwang", "89-64cdjp", "ADMIN", "AIDS", "Aiort墓地", "ai滋", "Arqus会议场", "asshole", "Atan的移动石", "A片", "Baichi", "Baopi", "Bao皮", "bastard", "Bc", "biaozi", "Biao子", "bignews", "bitch", "Bi样", "BLOWJOB", "boxun", "B样", "caoB", "caobi", "cao你", "cao你妈", "cao你大爷", "cha你", "chinaliberal", "chinamz", "chinesenewsnet", "Clockgemstone", "cnd", "creaders", "Crestbone", "dafa", "dajiyuan", "damn", "dfdz", "DICK", "dpp", "EVENT", "falu", "falun", "falundafa", "fa轮", "Feelmistone", "Fku", "FLG", "flg", "freechina", "freedom", "freenet", "Fuck", "fuck", "GAMEMASTER", "gan你", "GCD", "gcd", "Gruepin", "HACKING", "hongzhi", "hrichina", "http", "huanet", "hypermart", ".net", "incest", "item", "J8", "JB", "jiangdongriji", "jian你", "jiaochuang", "jiaochun", "jiba", "jinv", "Ji女", "Kao", "KISSMYASS", "lihongzhi", "Mai骚", "making", "minghui", "minghuinews", "nacb", "naive", "Neckromancer", "nmis", "paper64", "peacehall", "PENIS", "playboy", "pussy", "qiangjian", "Rape", "renminbao", "renmingbao", "rfa", "safeweb", "saobi", "sb", "SEX", "sex", "sf", "SHIT", "shit", "simple", "SUCK", "sucker", "svdc", "System", "taip", "TEST", "The9", "The9City", "tibetalk", "TMD", "TNND", "triangle", "triangleboy", "Tringel", "UltraSurf", "unixbox", "ustibet", "voa", "voachinese", "wangce", "WEBZEN", "WG", "wstaiji", "xinsheng", "yuming", "zhengjian", "zhengjianwang", "zhenshanren", "zhuanfalunADMIN", "AIDS", "AIORT墓地", "AI滋", "ARQUS会议场", "ASSHOLE", "ATAN的移动石", "A片", "BAICHI", "BAOPI", "BAO皮", "BASTARD", "BC", "BIAOZI", "BIAO子", "BIGNEWS", "BITCH", "BI样", "BLOWJOB", "BOXUN", "B样", "CAOB", "CAOBI", "CAO你", "CC小雪", "CHA你", "CHINALIBERAL", "CHINAMZ", "CHINESENEWSNET", "CLOCKGEMSTONE", "CND", "CREADERS", "CRESTBONE", "DAFA", "DAJIYUAN", "DAMN", "DFDZ", "DICK", "DPP", "EVENT", "FALU", "FALUN", "FALUNDAFA", "FA轮", "FEELMISTONE", "FKU", "FLG", "FREECHINA", "FREEDOM", "FREENET", "FUCK", "GAMEMASTER", "GAN你", "GCD", "GM", "GRUEPIN", "HACKING", "HONGZHI", "HRICHINA", "HTTP", "HUANET", "HYPERMART", ".NET", "INCEST", "ITEM", "J8", "JB", "JIANGDONGRIJI", "JIAN你", "JIAOCHUANG", "JIAOCHUN", "JIBA", "JINV", "JI女", "KAO", "KISSMYASS", "㎏", "LIHONGZHI", "MAI骚", "MAKING", "MINGHUI", "MINGHUINEWS", "㎎", "㎜", "NACB", "NAIVE", "NECKROMANCER", "NMIS", "PAPER64", "PEACEHALL", "PENIS", "PLAYBOY", "PUSSY", "QIANGJIAN", "RAPE", "RENMINBAO", "RENMINGBAO", "RFA", "SAFEWEB", "SAOBI", "SB", "SEX", "SF", "SHIT", "SIMPLE", "SUCK", "SUCKER", "SVDC", "SYSTEM", "TAIP", "THE9", "THE9CITY", "TIBETALK", "TMD", "TNND", "TRIANGLE", "TRIANGLEBOY", "TRINGEL", "ULTRASURF", "UNIXBOX", "USTIBET", "VOA", "VOACHINESE", "WANGCE", "WEBZEN", "WG", "WSTAIJI", "WWW", "WWW.", "XINSHENG", "YUMING", "ZHENGJIAN", "ZHENGJIANWANG", "ZHENSHANREN", "ZHUANFALUN", "碡", "籀", "朱駿", "朱狨基", "朱容基", "朱溶剂", "朱熔基", "朱镕基", "邾", "猪操", "猪聋畸", "猪毛", "猪毛1", "舳", "瘃", "躅", "翥", "專政", "颛", "丬", "隹", "窀", "卓伯源", "倬", "斫", "诼", "髭", "鲻", "子宫", "秭", "訾", "自焚", "自民党", "自慰", "自已的故事", "自由民主论坛", "总理", "偬", "诹", "陬", "鄹", "鲰", "躜", "缵", "作爱", "作秀", "阼", "祚", "做爱", "阿扁萬歲", "阿萊娜", "啊無卵", "埃裏克蘇特勤", "埃斯萬", "艾麗絲", "愛滋", "愛滋病", "垵", "暗黑法師", "嶴", "奧克拉", "奧拉德", "奧利弗", "奧魯奇", "奧倫", "奧特蘭", "㈧", "巴倫侍從", "巴倫坦", "白立樸", "白夢", "白皮書", "班禪", "寶石商人", "保釣", "鮑戈", "鮑彤", "鮑伊", "暴風亡靈", "暴亂", "暴熱的戰士", "暴躁的城塔野獸", "暴躁的警衛兵靈魂", "暴躁的馬杜克", "北大三角地論壇", "北韓", "北京當局", "北美自由論壇", "貝尤爾", "韝", "逼樣", "比樣", "蹕", "颮", "鑣", "婊子養的", "賓周", "冰後", "博訊", "不滅帝王", "不爽不要錢", "布萊爾", "布雷爾", "蔡崇國", "蔡啓芳", "黲", "操鶏", "操那嗎B", "操那嗎逼", "操那嗎比", "操你媽", "操你爺爺", "曹長青", "曹剛川", "草", "草你媽", "草擬媽", "册那娘餓比", "插那嗎B", "插那嗎逼", "插那嗎比", "插你媽", "插你爺爺", "覘", "蕆", "囅", "閶", "長官沙塔特", "常勁", "朝鮮", "車侖", "車侖女幹", "沉睡圖騰", "陳炳基", "陳博志", "陳定南", "陳建銘", "陳景俊", "陳菊", "陳軍", "陳良宇", "陳蒙", "陳破空", "陳水扁", "陳唐山", "陳希同", "陳小同", "陳宣良", "陳學聖", "陳一諮", "陳總統", "諶", "齔", "櫬", "讖", "程凱", "程鐵軍", "鴟", "痴鳩", "痴拈", "遲鈍的圖騰", "持不同政見", "赤色騎士", "赤色戰士", "處女膜", "傳染性病", "吹簫", "春夏自由論壇", "戳那嗎B", "戳那嗎逼", "戳那嗎比", "輳", "鹺", "錯B", "錯逼", "錯比", "錯那嗎B", "錯那嗎逼", "錯那嗎比", "達夫警衛兵", "達夫侍從", "達癩", "打飛機", "大參考", "大東亞", "大東亞共榮", "大鶏巴", "大紀元", "大紀元新聞網", "大紀園", "大家論壇", "大奶媽", "大史記", "大史紀", "大衛教", "大中國論壇", "大中華論壇", "大衆真人真事", "紿", "戴維教", "戴相龍", "彈劾", "氹", "蕩婦", "導師", "盜竊犯", "德維爾", "登輝", "鄧笑貧", "糴", "迪裏夏提", "覿", "地下教會", "帝國主義", "電視流氓", "叼你媽", "釣魚島", "丁關根", "東北獨立", "東部地下水路", "東方紅時空", "東方時空", "東南西北論談", "東社", "東升", "東條", "東條英機", "東突暴動", "東突獨立", "東土耳其斯坦", "東西南北論壇", "東亞", "東院看守", "動亂", "鬥士哈夫拉蘇", "鬥士霍克", "獨裁", "獨裁政治", "獨夫", "獨立臺灣會", "俄國", "鮞", "㈡", "發楞", "發掄", "發掄功", "發倫", "發倫功", "發輪", "發論", "發論公", "發論功", "發騷", "發正念", "法~倫", "法~淪", "法~綸", "法~輪", "法~論", "法爾卡", "法掄", "法掄功", "法侖", "法淪", "法綸", "法輪大法", "法輪功", "法十輪十功", "法謫", "法謫功", "反封鎖", "反封鎖技術", "反腐敗論壇", "反人類", "反社會", "方勵之", "防衛指揮官", "放蕩", "飛揚論壇", "廢墟守護者", "費鴻泰", "費良勇", "分隊長施蒂文", "粉飾太平", "糞便", "鱝", "豐饒的果實", "風雨神州", "風雨神州論壇", "封從德", "封殺", "封印的靈魂騎士", "馮東海", "馮素英", "紱", "襆", "嘸", "傅作義", "幹bi", "幹逼", "幹比", "幹的你", "幹幹幹", "幹她", "幹你", "幹你老比", "幹你老母", "幹你娘", "幹全家", "幹死", "幹死你", "幹他", "幹一家", "趕你娘", "岡巒", "剛比", "剛比樣子", "崗哨士兵", "肛門", "高麗棒子", "高文謙", "高薪養廉", "高自聯", "膏藥旗", "戈瑞爾德", "戈揚", "鴿派", "歌功頌德", "格雷(關卡排名管理者)", "格魯", "(城鎮移動)", "鯁", "工自聯", "弓雖", "共産", "共産黨", "共産主義", "共黨", "共軍", "共榮圈", "緱", "狗誠", "狗狼養的", "狗娘養的", "狗養", "狗雜種", "覯", "轂", "古龍祭壇", "骨獅", "鯝", "鴰", "詿", "關卓中", "貫通兩極法", "廣聞", "嬀", "龜兒子", "龜公", "龜孫子", "龜頭", "龜投", "劌", "緄", "滾那嗎", "滾那嗎B", "滾那嗎錯比", "滾那嗎老比", "滾那嗎瘟比", "鯀", "咼", "郭俊銘", "郭羅基", "郭岩華", "國家安全", "國家機密", "國軍", "國賊", "哈爾羅尼", "頇", "韓東方", "韓聯潮", "韓正", "漢奸", "顥", "灝", "河殤", "賀國强", "賀龍", "黑社會", "黑手黨", "紅燈區", "紅色恐怖", "紅炎猛獸", "洪傳", "洪興", "洪哲勝", "黌", "鱟", "胡緊掏", "胡錦滔", "胡錦淘", "胡景濤", "胡喬木", "胡總書記", "湖岸護衛兵", "湖岸警衛兵", "湖岸哨兵隊長", "護法", "鸌", "華建敏", "華通時事論壇", "華夏文摘", "華語世界論壇", "華岳時事論壇", "懷特", "鍰", "皇軍", "黃伯源", "黃慈萍", "黃禍", "黃劍輝", "黃金幼龍", "黃菊", "黃片", "黃翔", "黃義交", "黃仲生", "回民暴動", "噦", "繢", "毀滅步兵", "毀滅騎士", "毀滅射手", "昏迷圖騰", "混亂的圖騰", "鍃", "活動", "擊倒圖騰", "擊傷的圖騰", "鶏8", "鶏八", "鶏巴", "鶏吧", "鶏鶏", "鶏奸", "鶏毛信文匯", "鶏女", "鶏院", "姬勝德", "積克館", "賫", "鱭", "賈廷安", "賈育台", "戔", "監視塔", "監視塔哨兵", "監視塔哨兵隊長", "鰹", "韉", "簡肇棟", "建國黨", "賤B", "賤bi", "賤逼", "賤比", "賤貨", "賤人", "賤種", "江八點", "江羅", "江綿恒", "江戲子", "江則民", "江澤慧", "江賊", "江賊民", "薑春雲", "將則民", "僵賊", "僵賊民", "講法", "蔣介石", "蔣中正", "降低命中的圖騰", "醬猪媳", "撟", "狡猾的達夫", "矯健的馬努爾", "嶠", "教養院", "癤", "揭批書", "訐", "她媽", "届中央政治局委員", "金槍不倒", "金堯如", "金澤辰", "巹", "錦濤", "經文", "經血", "莖候佳陰", "荊棘護衛兵", "靖國神社", "㈨", "舊斗篷哨兵", "齟", "巨槌騎兵", "巨鐵角哈克", "鋸齒通道被遺弃的骷髏", "鋸齒通道骷髏", "屨", "棬", "絕望之地", "譎", "軍妓", "開苞", "開放雜志", "凱奧勒尼什", "凱爾本", "凱爾雷斯", "凱特切爾", "砍翻一條街", "看中國", "闞", "靠你媽", "柯賜海", "柯建銘", "科萊爾", "克萊恩", "克萊特", "克勞森", "客戶服務", "緙", "空氣精靈", "空虛的伊坤", "空虛之地", "恐怖主義", "瞘", "嚳", "鄺錦文", "貺", "昆圖", "拉姆斯菲爾德", "拉皮條", "萊特", "賴士葆", "蘭迪", "爛B", "爛逼", "爛比", "爛袋", "爛貨", "濫B", "濫逼", "濫比", "濫貨", "濫交", "勞動教養所", "勞改", "勞教", "鰳", "雷尼亞", "誄", "李紅痔", "李洪寬", "李繼耐", "李蘭菊", "李老師", "李錄", "李祿", "李慶安", "李慶華", "李淑嫻", "李鐵映", "李旺陽", "李小鵬", "李月月鳥", "李志綏", "李總理", "李總統", "裏菲斯", "鱧", "轢", "躒", "奩", "連方瑀", "連惠心", "連勝德", "連勝文", "連戰", "聯總", "廉政大論壇", "煉功", "兩岸關係", "兩岸三地論壇", "兩個中國", "兩會", "兩會報道", "兩會新聞", "廖錫龍", "林保華", "林長盛", "林佳龍", "林信義", "林正勝", "林重謨", "躪", "淩鋒", "劉賓深", "劉賓雁", "劉剛", "劉國凱", "劉華清", "劉俊國", "劉凱中", "劉千石", "劉青", "劉山青", "劉士賢", "劉文勝", "劉文雄", "劉曉波", "劉曉竹", "劉永川", "㈥", "鷚", "龍虎豹", "龍火之心", "盧卡", "盧西德", "陸委會", "輅", "呂京花", "呂秀蓮", "亂交", "亂倫", "亂輪", "鋝", "掄功", "倫功", "輪大", "輪功", "輪奸", "論壇管理員", "羅福助", "羅幹", "羅禮詩", "羅文嘉", "羅志明", "腡", "濼", "洛克菲爾特", "媽B", "媽比", "媽的", "媽批", "馬大維", "馬克思", "馬良駿", "馬三家", "馬時敏", "馬特斯", "馬英九", "馬永成", "瑪麗亞", "瑪雅", "嗎的", "嗎啡", "勱", "麥克斯", "賣逼", "賣比", "賣國", "賣騷", "賣淫", "瞞報", "毛厠洞", "毛賊", "毛賊東", "美國", "美國參考", "美國佬", "美國之音", "蒙獨", "蒙古達子", "蒙古獨", "蒙古獨立", "禰", "羋", "綿恒", "黽", "民國", "民進黨", "民聯", "民意論壇", "民陣", "民主墻", "緡", "湣", "鰵", "摸你鶏巴", "莫偉强", "木子論壇", "內褲", "內衣", "那嗎B", "那嗎逼", "那嗎錯比", "那嗎老比", "那嗎瘟比", "那娘錯比", "納粹", "奶頭", "南大自由論壇", "南蠻子", "鬧事", "能樣", "尼奧夫", "倪育賢", "鯢", "你媽", "你媽逼", "你媽比", "你媽的", "你媽了妹", "你說我說論壇", "你爺", "娘餓比", "捏你鶏巴", "儂著岡巒", "儂著卵拋", "奴隸魔族士兵", "女幹", "女主人羅姬馬莉", "儺", "諾姆", "潘國平", "蹣", "龐建國", "泡沫經濟", "轡", "噴你", "皮條客", "羆", "諞", "潑婦", "齊墨", "齊諾", "騎你", "磧", "僉", "鈐", "錢達", "錢國梁", "錢其琛", "膁", "槧", "錆", "繰", "喬石", "喬伊", "橋侵襲兵", "譙", "鞽", "篋", "親美", "親民黨", "親日", "欽本立", "禽獸", "唚", "輕舟快訊", "情婦", "情獸", "檾", "慶紅", "丘垂貞", "詘", "去你媽的", "闃", "全國兩會", "全國人大", "犬", "綣", "瘸腿幫", "愨", "讓你操", "熱比婭", "熱站政論網", "人民報", "人民大會堂", "人民內情真相", "人民真實", "人民之聲論壇", "人權", "日本帝國", "日軍", "日內瓦金融", "日你媽", "日你爺爺", "日朱駿", "顬", "乳頭", "乳暈", "瑞士金融大學", "薩達姆", "三K黨", "三個代表", "三級片", "三去車侖工力", "㈢", "毿", "糝", "騷B", "騷棒", "騷包", "騷逼", "騷棍", "騷貨", "騷鶏", "騷卵", "殺你全家", "殺你一家", "殺人犯", "傻鳥", "煞筆", "山口組", "善惡有報", "上訪", "上海幫", "上海孤兒院", "厙", "社會主義", "射了還說要", "灄", "詵", "神經病", "諗", "生孩子沒屁眼", "生命分流的圖騰", "澠", "聖射手", "聖戰", "盛華仁", "濕了還說不要", "濕了還說要", "釃", "鯴", "㈩", "石化圖騰", "石拳戰鬥兵", "時代論壇", "時事論壇", "鰣", "史萊姆", "史萊姆王", "士兵管理員瓦爾臣", "世界經濟導報", "事實獨立", "侍從貝赫爾特", "侍從倫斯韋", "貰", "攄", "數據中國", "雙十節", "氵去車侖工力", "氵去車侖工力?", "稅力", "司馬晋", "司馬璐", "司徒華", "私?服", "私處", "思科羅", "斯諾", "斯皮爾德", "四川獨", "四川獨立", "四人幫", "㈣", "宋書元", "藪", "蘇菲爾", "蘇拉", "蘇南成", "蘇紹智", "蘇特勒守護兵", "蘇特勤", "蘇特勤護衛兵", "蘇特勤魔法師", "蘇曉康", "蘇盈貴", "蘇貞昌", "誶", "碎片製造商人馬克", "碎片製造商人蘇克", "孫大千", "孫中山", "他媽", "他媽的", "他嗎的", "他母親", "塔內", "塔烏", "鰨", "闥", "臺盟", "臺灣帝國", "臺灣獨立", "臺灣獨", "臺灣共産黨", "臺灣狗", "臺灣建國運動組織", "臺灣民國", "臺灣青年獨立聯盟", "臺灣政論區", "臺灣自由聯盟", "鮐", "太監", "泰奴橋警衛兵", "泰奴橋掠奪者", "湯光中", "唐柏橋", "鞀", "謄", "天安門", "天安門錄影帶", "天安門事件", "天安門屠殺", "天安門一代", "天閹", "田紀雲", "齠", "鰷", "銚", "庭院警衛兵", "統獨", "統獨論壇", "統戰", "頭領奧馬", "頭領墳墓管理員", "圖書管理員卡特", "屠殺", "團長戈登", "團員馬爾汀", "摶", "鼉", "籜", "膃", "外交論壇", "外交與方略", "晚年周恩來", "綰", "萬里", "萬潤南", "萬維讀者論壇", "萬曉東", "王寶森", "王超華", "王輔臣", "王剛", "王涵萬", "王滬寧", "王軍濤", "王樂泉", "王潤生", "王世堅", "王世勛", "王秀麗", "王兆國", "網禪", "網特", "猥褻", "鮪", "溫B", "溫逼", "溫比", "溫家寶", "溫元凱", "閿", "無界瀏覽器", "吳百益", "吳敦義", "吳方城", "吳弘達", "吳宏達", "吳仁華", "吳淑珍", "吳學燦", "吳學璨", "吳育升", "吳志芳", "西藏獨", "吸收的圖騰", "吸血獸", "覡", "洗腦", "系統", "系統公告", "餼", "郤", "下賤", "下體", "薟", "躚", "鮮族", "獫", "蜆", "峴", "現金", "現金交易", "獻祭的圖騰", "鯗", "項懷誠", "項小吉", "嘵", "小B樣", "小比樣", "小參考", "小鶏鶏", "小靈通", "小泉純一郎", "謝長廷", "謝深山", "謝選駿", "謝中之", "辛灝年", "新觀察論壇", "新華舉報", "新華內情", "新華通論壇", "新疆獨", "新生網", "新手訓練營", "新聞出版總署", "新聞封鎖", "新義安", "新語絲", "信用危機", "邢錚", "性愛", "性無能", "修煉", "頊", "虛弱圖騰", "虛無的飽食者", "徐國舅", "許財利", "許家屯", "許信良", "諼", "薛偉", "學潮", "學聯", "學運", "學自聯", "澩", "閹狗", "訁", "嚴家其", "嚴家祺", "閻明複", "顔清標", "顔慶章", "顔射", "讞", "央視內部晚會", "陽具", "陽痿", "陽物", "楊懷安", "楊建利", "楊巍", "楊月清", "楊周", "姚羅", "姚月謙", "軺", "搖頭丸", "藥材商人蘇耐得", "藥水", "耶穌", "野鶏", "葉菊蘭", "夜話紫禁城", "一陀糞", "㈠", "伊莎貝爾", "伊斯蘭", "伊斯蘭亞格林尼斯", "遺精", "議長阿茵斯塔", "議員斯格文德", "异見人士", "异型叛軍", "异議人士", "易丹軒", "意志不堅的圖騰", "瘞", "陰部", "陰唇", "陰道", "陰蒂", "陰戶", "陰莖", "陰精", "陰毛", "陰門", "陰囊", "陰水", "淫蕩", "淫穢", "淫貨", "淫賤", "尹慶民", "引導", "隱者之路", "鷹眼派氏族", "硬直圖騰", "憂鬱的艾拉", "尤比亞", "由喜貴", "游蕩的僵尸", "游蕩的士兵", "游蕩爪牙", "游錫坤", "游戲管理員", "友好的魯德", "幼齒", "幼龍", "于幼軍", "余英時", "漁夫菲斯曼", "輿論", "輿論反制", "傴", "宇明網", "齬", "飫", "鵒", "元老蘭提(沃德）", "圓滿", "緣圈圈", "遠志明", "月經", "韞", "雜種", "鏨", "造愛", "則民", "擇民", "澤夫", "澤民", "賾", "賊民", "譖", "扎卡維是英雄", "驏", "張伯笠", "張博雅", "張鋼", "張健", "張林", "張清芳", "張偉國", "張溫鷹", "張昭富", "張志清", "章孝嚴", "帳號", "賬號", "招鶏", "趙海青", "趙建銘", "趙南", "趙品潞", "趙曉微", "趙紫陽", "貞操", "鎮壓", "爭鳴論壇", "正見網", "正義黨論壇", "㊣", "鄭寶清", "鄭麗文", "鄭義", "鄭餘鎮", "鄭源", "鄭運鵬", "政權", "政治反對派", "縶", "躑", "指點江山論壇", "騭", "觶", "躓", "中毒的圖騰", "中毒圖騰", "中俄邊界", "中國復興論壇", "中國共産黨", "中國孤兒院", "中國和平", "中國論壇", "中國社會進步黨", "中國社會論壇", "中國威脅論", "中國問題論壇", "中國移動通信", "中國真實內容", "中國之春", "中國猪", "中華大地", "中華大衆", "中華講清", "中華民國", "中華人民實話實說", "中華人民正邪", "中華時事", "中華養生益智功", "中華真實報道", "中央電視臺", "鐘山風雨論壇", "周鋒鎖", "周守訓", "朱鳳芝", "朱立倫", "朱溶劑", "㈱", "猪聾畸", "主攻指揮官", "主義", "助手威爾特", "專制", "顓", "轉化", "諑", "資本主義", "鯔", "子宮", "自民黨", "自由民主論壇", "總理", "諏", "鯫", "躦", "纘", "作愛", "做愛", "bcd.s.59764.com", "kkk.xaoh.cn", "www.xaoh.cn", "zzz.xaoh.cn", "aa.yazhousetu.hi.9705.net.cn", "eee.xaoh.cn", "lll.xaoh.cn", "jj.pangfangwuyuetian.hi.9705.net.cn", "rrr.xaoh.cn", "ooo.xaoh.cn", "www.zy528.com", "aaad.s.59764.com", "www.dy6789.cn", "aaac.s.51524.com", "208.43.198.56", "166578.cn", "www.wang567.com", "www.bin5.cn", "www.sanjidianying.com.cn", "www.anule.cn", "%77%77%77%2E%39%37%38%38%30%38%2E%63%6F%6D", "www.976543.com", "www.50spcombaidu1828adyou97sace.co.cc", "chengrenmanhua.1242.net.cn", "qingsewuyuetian.1174.net.cn", "lunlidianyingxiazai.1174.net.cn", "siwameitui.1274.net.cn", "niuniujidi.1174.net.cn", "xiao77.1243.net.cn", "woyinwose.1243.net.cn", "dingxiang.1249.net", "cnaicheng.1174.net.cn", "1234chengren.1249.net.cn", "sewuyuetian.1174.net.cn", "huangsexiaoshuo.1242.net.cn", "lunlidianying.1274.net.cn", "xingqingzhongren.1174.net.cn", "chengrenwangzhi.1242.net.cn", "xiao77luntan.1249.net.cn", "dingxiang.1243.net.cn", "11xp.1243.net.cn", "baijie.1249.net.cn", "sewuyuetian.1274.net.cn", "meiguiqingren.1274.net.cn", "tb.hi.4024.net.cn", "www.91wangyou.com", "www.wow366.cn", "www.yxnpc.com", "www.365jw.com", "58.253.67.74", "www.978808.com", "www.sexwyt.com", "7GG", "www.567yx.com", "131.com", "bbs.7gg.cn", "www.99game.net", "ppt.cc", "www.zsyxhd.cn", "www.foyeye.com", "www.23nice.com.cn", "www.maituan.com", "www.ylteam.cn", "www.yhzt.org", "vip886.com", "www.neicehao.cn", "bbs.butcn.com", "www.gamelifeclub.cn", "consignment5173", "www.70yx.com", "www.legu.com", "ko180", "bbs.pkmmo", "whoyo.com", "www.2q5q.com", "www.zxkaku.cn", "www.gw17173.cn", "www.315ts.net", "qgqm.org", "17173dl.net", "i9game.com", "365gn", "158le.com", "1100y.com", "bulaoge.com", "17youle.com", "reddidi.com.cn", "icpcn.com", "ul86.com", "showka8.com", "szlmgh.cn", "bbs.766.com", "www.766.com", "91bysd.cn", "jiayyou.cn", "gigabyte.cn", "duowan", "wgxiaowu.com", "youxiji888.cn", "yz55.cn", "Carrefour", "51jiafen.cn", "597ft.com", "itnongzhuang.com2y7v.cnhwxvote.cn", "92klgh.cn", "xiaoqinzaixian.cn", "661661.com", "haosilu.com", "dl.com", "xl517.com", "sjlike.com", "tont.cn", "xq-wl.cn", "feitengdl.com", "bz176.com", "dadati.com", "asgardcn.com", "dolbbs.com", "okaygood.cn", "1t1t.com", "jinpaopao.com", "blacksee.com.cn", "1qmsj.com", "202333.com", "luoxialu.cn", "37447.cn", "567567aa.cn", "09city.com", "71ka.com", "fy371.com", "365tttyx.com", "host800.com", "lybbs.info", "ys168.com", "88mysf.com", "5d6d.com", "id666.uqc.cn", "stlmbbs.cn", "pcikchina.com", "lxsm888.com", "wangyoudl.com", "chinavfx.net", "zxsj188.com", "wg7766.cn", "e7sw.cn", "jooplay.com", "gssmtt.com", "likeko.com", "lyx-game.cn", "wy33.com", "zy666.net", "newsmth.net", "l2jsom.cn", "13888wg.com", "qtoy.com", "1000scarf.com", "digitallongking.com", "zaixu.net", "ncyh.cn", "888895.com", "ising99.com", "cikcatv.2om", "parke888.com", "01gh.com", "gogo.net", "uu1001.com", "wy724.com", "prettyirene.net", "yaokong7.com", "zzmysf.com", "52sxhy.cn", "92wydl.com", "g365.net", "pkmmo.com", "52ppsa.cn", "bl62.com", "canyaa.com", "lordren.com", "xya3.cn", "5m5m5m.com", "www.gardcn.com", "www.sf766.com.cn", "ent365.com", "18900.com", "7mmo.com", "cdream.com", "wy3868.com", "nbfib.cn", "17173yxdl.cn", "osisa.cn", "haouse.cn", "54hero.com", "ieboy.cn", "geocities.com", "xiuau.cn", "cvceo.com", "fxjsqc.com", "thec.cn", "c5c8.cn", "a33.com", "qqsg.org", "my3q.com", "51juezhan.com", "kartt.cn", "hexun.com", "15wy.com", "13ml.net", "homexf.cn", "xyxgh.com", "jdyou.com", "langyou.info", "duowan.com", "8188mu.com", "tianlong4f.cn", "yeswm.com", "wgbobo.cn", "haog8.cn", "47513.cn", "92ey.com", "hao1788.co", "mgjzybj.com", "xdns.eu", "shenycs.co", "mpceggs.cn", "kod920.cn", "njgamecollege.org", "51hdw.com", "025game.cn", "bibidu.com", "bwowd.com", "3kwow.com", "zx002.com", "bazhuwg.cn", "991game.com", "zuanshi1000.cn", "10mb.cn", "Huihuangtx.com", "chongxianmu.cn", "any2000.com", "99sa.com", "zhidian8.com", "t9wg.cn", "bobaoping", "qixingnet.com", "88kx.com", "00sm.cn", "moyi520.cn", "d666.com", "fisonet.com", "0571qq.com", "173at.com", "pk200.com", "2feiche.cn", "jjdlw.com", "xyq2sf.com", "69nb.com", "txwsWind", "jiayyou.com", "Freetibet", "isil", "ISIS", "ISIL", "k粉", "被立王", "蔡英文", "常受教", "臭尼姑", "达米宣教会", "东方闪电", "港灿狗", "港独", "呼喊派", "回族吃猪", "老处女", "灵灵教", "灵仙真佛宗", "全范围教会", "全能神", "三班仆人派", "实际神", "世界以利亚，福音宣教会", "天父的儿女", "同一教", "徒弟会", "新约教会", "西藏自由", "新约教会", "占领中环", "占中", "中华大陆行政执事站", "主神教", "总局", "乌克兰分离", "新疆势力", "催情", "卍", "毒品", "彭丽媛", "党中央", "jian你Jiba", "sb", "Penis", "isis", "ISILfalungong", "falun", "k粉", "被立王", "蔡英文", "常受教", "臭尼姑", "达米宣教会", "东方闪电", "港灿狗", "港独", "呼喊派回族吃猪", "老处女", "灵灵教", "灵仙真佛宗", "全范围教会", "全能神", "三班仆人派", "实际神", "世界以利亚福音宣教会", "天父的儿女", "同一教", "徒弟会", "西藏自由", "新约教会", "占领中环", "占中", "中华大陆行政执事站", "主神教", "总局", "新疆势力", "乌克兰分离", "卍", "催情", "臭港灿", "党中央", "毒品", "彭丽媛", "总菊", "默罕默德", "六四", "六四运动", "美国之音", "密宗", "民国", "民进党", "民运", "民主", "民主潮", "摩门教", "纳粹", "南华早报", "南蛮", "明慧网", "习近平", "文革", "上访", "绝食", "真主", "特朗普", "上訪", "港独", "啪啪啪", "法图麦", "赫蒂彻", "南海仲裁", "乳贴", "萌娘", "小三", "小3", "软妹", "伪娘", "萝太", "伪男", "萌大奶", "傻毕", "蔡英文", "占中", "红5", "致幻剂", "共青团", "劫持", "绯闻", "出轨", "嫩模", "未婚同居", "辱骂", "250", "二百五", "性侵", "黑木耳", "坑爹", "东方闪电", "全能教", "七灵派", "女基督派", "实际神", "呼喊派", "喊派", "常受教", "被立王", "常受教", "中华大陆行政执事站", "观音法门", "石牌教会", "门徒会", "全范围教会", "三班仆人派", "灵灵教", "7.3", "爆菊", "菊爆", "ISIS", "穆罕穆德", "isil", "中纪委", "热比娅", "静坐", "国民党", "暴乱", "王岐山", "灵仙真佛", "尖阁列岛", "机器", "机器人", "电脑", "充值", "开关", "控制", "切换", "隐藏", "显示", "悬浮", "标识", "标志", "更新", "越狱", "微信", "支付宝", "金额", "支付", "礼包", "libao，gift", "交易", "购买", "商品", "内购", "票据", "漏单", "兑换", "元宝", "钻石", "switch", "show", "hide", "pay", "money", "wechat", "weixin", "alipay", "platform", "sdk", "update", "order", "dingdan", "goumai", "web", "zf", "zfb", "jine", "buy", "detriment", "purchasing", "diamond", "ingot", "贪玩", "tanwan"];
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
        //初始化Model
        _this.loginModel = new LoginModel(_this);
        //初始化UI
        _this.loginView = new LoginView(_this, LayerManager.UI_Main);
        App.ViewManager.register(ViewConst.Login, _this.loginView);
        //初始化Proxy
        _this.loginProxy = new LoginProxy(_this);
        //注册模块间、模块内部事件监听
        //注册C2S消息
        _this.registerFunc(LoginConst.LOGIN_C2S, _this.onLogin, _this);
        //注册S2C消息
        _this.registerFunc(LoginConst.LOGIN_S2C, _this.loginSuccess, _this);
        return _this;
    }
    /**
     * 请求登陆处理
     * @param userName
     * @param pwd
     */
    LoginController.prototype.onLogin = function (userName, pwd) {
        this.loginProxy.login(userName, pwd);
    };
    /**
     * 登陆成功处理
     */
    LoginController.prototype.loginSuccess = function (userInfo) {
        //保存数据
        this.loginModel.userInfo = userInfo;
        //本模块UI处理
        this.loginView.loginSuccess();
        //UI跳转
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
     * 构造函数
     * @param $controller 所属模块
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
        //注册从服务器返回消息的监听
        _this.receiveServerMsg(HttpConst.USER_LOGIN, _this.loginSuccess, _this);
        return _this;
    }
    /**
     * 用户登陆
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
     * 用户登陆成功返回
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
     *对面板进行显示初始化，用于子类继承
     *
     */
    LoginView.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        //this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onLogin, this);
        this.btnEnter.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onLoginBtnClick, this);
    };
    /**
     *对面板数据的初始化，用于子类继承
     *
     */
    LoginView.prototype.initData = function () {
        _super.prototype.initData.call(this);
    };
    /**
     * 面板开启执行函数，用于子类继承
     * @param param 参数
     */
    LoginView.prototype.open = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        _super.prototype.open.call(this, param);
    };
    /**
     * 面板关闭执行函数，用于子类继承
     * @param param 参数
     */
    LoginView.prototype.close = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        _super.prototype.close.call(this, param);
    };
    /**
     * 请求登陆处理
     * @param userName
     * @param pwd
     */
    LoginView.prototype.onLoginBtnClick = function (e) {
        var nickName = this.platId.text;
        if (nickName == null || nickName.length == 0 || nickName == "請輸入用戶暱稱" || nickName == "用戶名應小於6位有效數字") {
            this.platId.text = "請輸入用戶暱稱";
            return;
        }
        if (nickName.length > 6) {
            this.platId.text = "用戶名應小於6位有效數字";
            return;
        }
        var k = this.texttest(nickName);
        if (k) {
            this.platId.text = "用戶名包含敏感詞，請重新輸入！";
            return;
        }
        //发起登录
        //this.applyFunc(LoginConst.LOGIN_C2S, userName); 
        //发起登录成功回调 （测试）
        App.MessageCenter.dispatch(EventNames.Role_Choose, this.platId.text);
        App.MessageCenter.dispatch(EventNames.Load_text);
        this.applyFunc(LoginConst.LOGIN_S2C);
    };
    /**
     * 登陆成功处理
     */
    LoginView.prototype.loginSuccess = function () {
        //TODO 登陆成功处理
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
            //全局替换
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
    //获取角色信息 
    RoleInfoManager.prototype.getRoleInfo = function (nickname) {
        // CMsgMgr.sendMsg( GMsgNo.M1029 );  
        //同步服务器时间
        //     let commonHeader: simple.CommonProtocol = new simple.CommonProtocol();
        //     commonHeader.CommandId =  65792;
        //     commonHeader.SeqId = 1000;
        //     commonHeader.Version = 12;
        //     commonHeader.BodyData = nickname;
        //    //序列化
        //     var buffer = simple.CommonProtocol.encode(commonHeader).finish();
        //     //Log.debug("序列化数据：", buffer);
        //     var buf = new egret.ByteArray(buffer);
        //     //创建ByteArray数组用来保存消息对象并发送到网络
        //     var mss = new egret.ByteArray();
        //     mss.writeBytes(buf);
        //     App.Socket.sendProtobuf(mss);
    };
    //更新角色信息
    RoleInfoManager.prototype.updateRoleInfo = function (roleinfo) {
        // CMsgMgr.sendMsg( GMsgNo.M1029 );  
        //同步服务器时间
        //     let commonHeader: simple.CommonProtocol = new simple.CommonProtocol();
        //     commonHeader.CommandId =  65793;
        //     commonHeader.SeqId = 1000;
        //     commonHeader.Version = 12;
        //     commonHeader.BodyData = JSON.stringify(roleinfo);
        //    //序列化
        //     var buffer = simple.CommonProtocol.encode(commonHeader).finish();
        //     //Log.debug("序列化数据：", buffer);
        //     var buf = new egret.ByteArray(buffer);
        //     //创建ByteArray数组用来保存消息对象并发送到网络
        //     var mss = new egret.ByteArray();
        //     mss.writeBytes(buf);
        // App.Socket.sendProtobuf(mss);
    };
    //更新宠物信息
    RoleInfoManager.prototype.updatePet = function (roleinfo) {
        // CMsgMgr.sendMsg( GMsgNo.M1029 );  
        //同步服务器时间
        //     let commonHeader: simple.CommonProtocol = new simple.CommonProtocol();
        //     commonHeader.CommandId =  65794;
        //     commonHeader.SeqId = 1000;
        //     commonHeader.Version = 12;
        //     commonHeader.BodyData = JSON.stringify(roleinfo);
        //    //序列化
        //     var buffer = simple.CommonProtocol.encode(commonHeader).finish();
        //     //Log.debug("序列化数据：", buffer);
        //     var buf = new egret.ByteArray(buffer);
        //     //创建ByteArray数组用来保存消息对象并发送到网络
        //     var mss = new egret.ByteArray();
        //     mss.writeBytes(buf);
        // App.Socket.sendProtobuf(mss);
    };
    //添加宠物信息
    RoleInfoManager.prototype.addPet = function (roleinfo) {
        // CMsgMgr.sendMsg( GMsgNo.M1029 );  
        //同步服务器时间
        //     let commonHeader: simple.CommonProtocol = new simple.CommonProtocol();
        //     commonHeader.CommandId =  65795;
        //     commonHeader.SeqId = 1000;
        //     commonHeader.Version = 12;
        //     commonHeader.BodyData = JSON.stringify(roleinfo);
        //    //序列化
        //     var buffer = simple.CommonProtocol.encode(commonHeader).finish();
        //     //Log.debug("序列化数据：", buffer);
        //     var buf = new egret.ByteArray(buffer);
        //     //创建ByteArray数组用来保存消息对象并发送到网络
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
        //View初始化
        _this.gameView = new RpgGameView(_this, LayerManager.Game_Main);
        App.ViewManager.register(ViewConst.RpgGame, _this.gameView);
        //Model初始化
        _this.gameModel = new RpgGameModel(_this);
        //注册模块消息
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
                skillh: user.monsterModel.skillh //技能伤害
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
    RpgGameSkill[RpgGameSkill["sk30018"] = 30018] = "sk30018"; //奪魄
})(RpgGameSkill || (RpgGameSkill = {}));
var RpgRandomSkill;
(function (RpgRandomSkill) {
    RpgRandomSkill[RpgRandomSkill["sk31001"] = 31001] = "sk31001";
    RpgRandomSkill[RpgRandomSkill["sk31002"] = 31002] = "sk31002";
    RpgRandomSkill[RpgRandomSkill["sk31003"] = 31003] = "sk31003";
    RpgRandomSkill[RpgRandomSkill["sk32001"] = 32001] = "sk32001";
    RpgRandomSkill[RpgRandomSkill["sk32002"] = 32002] = "sk32002";
    RpgRandomSkill[RpgRandomSkill["sk32003"] = 32003] = "sk32003"; // ⑶远古遗迹：随机事件为“雷击”。								
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
    //开始检测碰撞
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
    //90度角
    RpgGameUtils.isSameAngle = function (currX, currY, gotoX, gotoY, pDir) {
        if (Math.abs(gotoX - currX) < 0.1) {
            gotoX = currX;
        }
        if (Math.abs(gotoY - currY) < 0.1) {
            gotoY = currY;
        }
        var radian = App.MathUtils.getRadian2(currX, currY, gotoX, gotoY);
        var angle = App.MathUtils.getAngle(radian);
        Log.debug("isSameAngle 怪物角度: " + angle);
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
    //45度角
    RpgGameUtils.computeSkillDir = function (currX, currY, gotoX, gotoY) {
        if (Math.abs(gotoX - currX) < 0.1) {
            gotoX = currX;
        }
        if (Math.abs(gotoY - currY) < 0.1) {
            gotoY = currY;
        }
        var radian = App.MathUtils.getRadian2(currX, currY, gotoX, gotoY);
        var angle = App.MathUtils.getAngle(radian);
        Log.debug("角度: " + angle);
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
    /**检测碰撞*  传两个物体对象*/
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
     * @param    mapdata        地图数据
     */
    function SilzAstar(mapdata) {
        /**
         * 寻路方式，8方向和4方向，有效值为8和4
         */
        this.WorkMode = 8;
        this.makeGrid(mapdata);
    }
    /**
     * @param        xnow    当前坐标X(世界坐标)
     * @param        ynow    当前坐标Y(世界坐标)
     * @param        xpos    目标点X(世界坐标)
     * @param        ypos    目标点Y(世界坐标)
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
            Log.debug("[SilzAstar]", time + "ms 找不到");
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
     * @param   type    0八方向 1四方向 2跳棋
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
     * @param   type    0八方向 1四方向 2跳棋
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
        var gotoDir = App.RandomUtils.limitInteger(0, 7); //方向
        var gotoDis = App.RandomUtils.limitInteger(20, 30); //距离
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
    //两个英雄在追击的时候尽量不要重合
    AutoBattleComponent.prototype.bestToMoveTagert = function () {
        var battleObj = this.entity.battleObj;
        var gotoCol = battleObj.col;
        var gotoRow = battleObj.row;
        var currCol = this.entity.col;
        var currRow = this.entity.row;
        var dir = RpgGameUtils.computeGameObjDir(currCol, currRow, gotoCol, gotoRow);
        var tagertCol = gotoCol;
        var tagertRow = gotoRow;
        //跟目标怪物的距离
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
        var gotoDir = App.RandomUtils.limitInteger(0, 7); //方向
        var gotoDis = App.RandomUtils.limitInteger(20, 30); //距离
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
    //更新圆形范围技能图
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
    //更新扇形指向图
    AvatarSkillComponent.prototype.updateFanDirBitmap = function () {
        //0上 1右上 2右 3右下 4下
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
    //调整音波技能
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
    //调整普攻刀光技能
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
                    Log.debug("怪物在扇形範圍內, 技能命中傷害:" + this.entity.propertyData.skillh);
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
    //根据方向和半径获取心线的方向坐标
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
    //判断某个点是否在扇形范围内
    //@param cx 中心点坐标x
    //@param cy 中心点坐标y 
    //@param ux 中心线的方向坐标x
    //@param uy 中心线的方向坐标y
    //@param squaredR 半径
    //@param cosTheta 弧度制的cos0
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
    //根据方向获取角度值
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
        //计算伤害
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
        //掉血数字显示
        //f (defenceObj instanceof RpgMonster) {
        this.entity.gameView.showHpChange(defenceObj, -harm);
        //} else {
        //    this.entity.gameView.showHpChange(defenceObj, -harm, 0x00FF00);
        //}
        //死亡处理
        if (defenceObj.propertyData.hp == 0) {
            if (defenceObj instanceof RpgMonster) {
                battleObj = null;
                if (this.entity) {
                    this.entity.battleObj = null;
                    this.entity.gameView.removeMonster(defenceObj);
                    this.entity.killNum += 1; //击杀数+1
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
//pay attention to 玩家与怪物battle分离了
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
                Log.debug("怪物跟玩家在同一扇形方向上");
                //var distance = App.MathUtils.getDistance(cx,cy,px,py);
                if (Math.abs(px - cx) <= attackDis && Math.abs(py - cy) <= attackDis) {
                    Log.debug("怪物在扇形攻擊範圍內");
                    this.entity.battleObj = monster;
                    //egret.setTimeout(this.dealHarm, this, 500);
                    //伤害计算
                    this.dealHarm(monster);
                }
            }
            else {
                //Log.debug("怪物方向：" + pDir + " 玩家方向：" + this.entity.dir + "不在同一方向");
                Log.debug("怪物玩家不在同一方向上");
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
        //         Log.debug("怪物在扇形範圍內");
        //         this.entity.battleObj = monster;
        //         //egret.setTimeout(this.dealHarm, this, 500);
        //         //伤害计算
        //         this.dealHarm(monster);
        //     }else {
        //         //Log.debug("怪物在扇形范围外");
        //     }
        // }
    };
    //根据方向和半径获取心线的方向坐标
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
    //判断某个点是否在扇形范围内
    //@param cx 中心点坐标x
    //@param cy 中心点坐标y 
    //@param ux 中心线的方向坐标x
    //@param uy 中心线的方向坐标y
    //@param squaredR 半径
    //@param cosTheta 弧度制的cos0
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
    //根据方向获取角度值
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
    //     var arg = Math.atan2(obj.row, obj.col); //求复数的辐角。
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
        //擊中不回血
        defenceObj.resetTimer();
        //计算伤害
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
        //掉血数字显示
        //if (defenceObj instanceof RpgMonster) {
        this.entity.gameView.showHpChange(defenceObj, -harm);
        //} else {
        //    this.entity.gameView.showHpChange(defenceObj, -harm, 0x00FF00);
        //}
        //造成伤害怒气增加10%
        this.entity.gameView.skillBtn1.updateAngelShap(10);
        //死亡处理
        if (defenceObj.propertyData.hp == 0) {
            if (defenceObj instanceof RpgMonster) {
                battleObj = null;
                this.entity.battleObj = null;
                this.entity.gameView.removeMonster(defenceObj);
                this.entity.killNum += 1; //击杀数+1
                this.entity.gameView.refreshRankList();
                Log.debug(this.entity.gameView.getMonsters().length);
                //击杀伤害怒气增加30%
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
     * 构造函数
     */
    function ViewManager() {
        var _this = _super.call(this) || this;
        _this._views = {};
        _this._opens = [];
        return _this;
    }
    /**
     * 清空处理
     */
    ViewManager.prototype.clear = function () {
        this.closeAll();
        this._views = {};
    };
    /**
     * 面板注册
     * @param key 面板唯一标识
     * @param view 面板
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
     * 面板解除注册
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
     * 销毁一个面板
     * @param key 唯一标识
     * @param newView 新面板
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
     * 开启面板
     * @param key 面板唯一标识
     * @param param 参数
     *
     */
    ViewManager.prototype.open = function (key) {
        var param = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            param[_i - 1] = arguments[_i];
        }
        var view = this.getView(key);
        if (view == null) {
            Log.warn("UI_" + key + "不存在");
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
     * 关闭面板
     * @param key 面板唯一标识
     * @param param 参数
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
     * 关闭面板
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
     * 根据唯一标识获取一个UI对象
     * @param key
     * @returns {any}
     */
    ViewManager.prototype.getView = function (key) {
        return this._views[key];
    };
    /**
     * 关闭所有开启中的UI
     */
    ViewManager.prototype.closeAll = function () {
        while (this._opens.length) {
            this.close(this._opens[0]);
        }
    };
    /**
     * 当前ui打开数量
     * @returns {number}
     */
    ViewManager.prototype.currOpenNum = function () {
        return this._opens.length;
    };
    /**
     * 检测一个UI是否开启中
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
        //技能点
        _this.maxSkillNumber = 3; //最大技能点数
        _this.skillNumber = 0; //当前技能点数
        //战斗数据
        _this.level = 1;
        _this.exp = 0;
        _this.attackDis = 6; //攻击范围
        _this.speed = 0; //移动速度
        _this.enerty = 0; //收集的能量
        _this.ski1add = 0.01; //普通攻击加成
        _this.ski2add = 0.01; //技能攻击加成
        _this.buffname = "速度"; //buff加成
        _this.buffstatus = 0; //0无 1 增益 2减益
        _this.buffnumber = 0; //buff数值
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
            this.buffLabel.text = "速度";
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
    //UI创建
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
            //Log.debug("角色死亡"); 
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
            Log.debug("技能点为 = " + this.skillNumber);
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
    //增益更新
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
        //能量计算
        this.exp = 50 * this.entity.killNum + this.entity.propertyData.enerty;
        var levelConf = this.getCurrentConf();
        var exp1 = levelConf["exp"];
        if (this.exp >= exp1) {
            this.level++;
            this.entity.propertyData.hp = this.maxBlood; //回满血
            //根据等级提升攻击力和技能伤害
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
        //擊中不回血
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
                    this.entity.killNum += 1; //击杀数+1
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
        var totalPlayNum = 0; //循环次数
        if (gotoAction == Action.Attack
            || gotoAction == Action.Attacked
            || gotoAction == Action.Die) {
            totalPlayNum = 1;
        }
        //0上 1右上 2右 3右下 4下
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
    RpgBoxBuff[RpgBoxBuff["buff8"] = 8] = "buff8"; //⑻ 范围爆炸：对3码距离内所有角色造成20%最大血量的伤害。
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
                buffname: "攻击",
                buffstatus: 1
            },
            {
                buffnumber: RpgBoxBuff.buff2,
                buffname: "范围",
                buffstatus: 1
            },
            {
                buffnumber: RpgBoxBuff.buff3,
                buffname: "速度",
                buffstatus: 1
            },
            {
                buffnumber: RpgBoxBuff.buff4,
                buffname: "免疫",
                buffstatus: 1
            },
            {
                buffnumber: RpgBoxBuff.buff5,
                buffname: "攻击",
                buffstatus: 2
            },
            {
                buffnumber: RpgBoxBuff.buff6,
                buffname: "范围",
                buffstatus: 2
            },
            {
                buffnumber: RpgBoxBuff.buff7,
                buffname: "速度",
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
        //註入自定義的素材解析器
        egret.registerImplementation("eui.IAssetAdapter", new AssetAdapter());
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
        App.StageUtils.setFrameRate(60);
        //適配方式(全屏適配) iphonex 2436x1125 1334x750
        App.StageUtils.startFullscreenAdaptation(1334, 750, this.onResize);
        //設置橫屏
        this.stage.orientation = egret.OrientationMode.LANDSCAPE;
        //設置適配方式
        App.StageUtils.setScaleMode(egret.StageScaleMode.EXACT_FIT);
        //初始化
        this.initLifecycle();
        this.initScene();
        //加載資源配置文件
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
        //初始化Resource資源加載庫
        // App.ResourceUtils.addConfig("resource/default.res.json", "resource/");
        // App.ResourceUtils.addConfig("resource/resource_core.json", "resource/");
        // App.ResourceUtils.addConfig("resource/resource_ui.json", "resource/");
        // App.ResourceUtils.addConfig("resource/resource_battle.json", "resource/");
        // App.ResourceUtils.addConfig("resource/resource_rpg.json", "resource/");
        egret.ImageLoader.crossOrigin = "anonymous"; //设置允许跨域加载
        App.ResourceUtils.addConfig("default.res.json", "https://yqllm.wangqucc.com/gameres/dld/resource/");
        App.ResourceUtils.addConfig("resource_core.json", "https://yqllm.wangqucc.com/gameres/dld/resource/");
        App.ResourceUtils.addConfig("resource_ui.json", "https://yqllm.wangqucc.com/gameres/dld/resource/");
        App.ResourceUtils.addConfig("resource_battle.json", "https://yqllm.wangqucc.com/gameres/dld/resource/");
        App.ResourceUtils.addConfig("resource_rpg.json", "https://yqllm.wangqucc.com/gameres/dld/resource/");
        App.ResourceUtils.loadConfig(this.onConfigComplete, this);
    };
    /**
     * 配置文件加載完成,開始預加載preload資源組。
     */
    Main.prototype.onConfigComplete = function () {
        egret.ImageLoader.crossOrigin = "anonymous"; //设置允许跨域加载
        //加載皮膚主題配置文件,可以手動修改這個文件。替換默認皮膚。
        var theme = new eui.Theme("resource/default.thm.json", this.stage);
        // EXML.prefixURL = "https://yqllm.wangqucc.com/gameres/dld/";//更改目录位置,这里要填入服务器的ip地址
        // // load skin theme configuration file, you can manually modify the file. And replace the default skin.
        // //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
        // let theme = new eui.Theme("https://yqllm.wangqucc.com/gameres/dld/resource/default.thm.json", this.stage);//这里要填入服务器的ip地址
        theme.addEventListener(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);
    };
    /**
     * 主題文件加載完成
     */
    Main.prototype.onThemeLoadComplete = function () {
        //模塊初始化
        this.initModule();
        //設置加載進度界面
        App.SceneManager.runScene(SceneConsts.LOADING);
        //開啟websocket連接
        new ProtoBufTest();
        App.MessageCenter.addListener(EventNames.Role_Choose, function (nick) {
            RoleInfoConst.rolename = nick;
            if (nick != null) {
                var nickname = nick;
                var roleManager = RoleInfoManager.getSingtonInstance();
                roleManager.getRoleInfo(nickname);
            }
        }, this);
        //打開輸入角色名稱界面
        App.ViewManager.open(ViewConst.Login);
    };
    /**
     * 初始化所有場景
     */
    Main.prototype.initScene = function () {
        App.SceneManager.register(SceneConsts.LOADING, new LoadingScene());
        App.SceneManager.register(SceneConsts.UI, new UIScene());
        App.SceneManager.register(SceneConsts.Game, new GameScene());
        App.SceneManager.register(SceneConsts.RpgGame, new RpgGameScene());
    };
    /**
     * 初始化所有模塊
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
        _this.boxStatus = false; // 打开1 关闭0
        _this.isDisPlay = false; //是否显示
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
        _this.state = true; //展开
        _this.skinName = "resource/skins/RpgGameListViewSkin.exml";
        return _this;
    }
    RpgGameListView.prototype.initUI = function () {
        var _this = this;
        this.actionBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.changgeTween, this);
        //获取游戏场景玩家
        this.gameView = App.ViewManager.getView(ViewConst.RpgGame);
        setTimeout(function (out) {
            _this.timerrun();
        }, 1200);
        // App.MessageCenter.addListener(EventNames.Kill_Monster,this.timerrun,this);
    };
    //定时器刷新
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
        Log.debug("动画执行完成");
    };
    RpgGameListView.prototype.onComplete = function () {
        this.listRankings.visible = true;
        ;
    };
    //创建排行榜列表UI
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
        this.energyList = []; //创建能量球  刷新频率 30s 刷新一次 一次出现40个 未使用的下次刷新清除
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
            this.alertLabel.textFlow = [{ text: "还有", style: { textColor: 0xffffff } },
                { text: "10秒", style: { textColor: 0x00ff00 } },
                { text: "随机刷新宝箱", style: { textColor: 0xffffff } }];
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
            //游戏结束
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
                    { text: "還有", style: { textColor: 0xffffff } },
                    { text: this.rgpGameTotalTime % 60 + "秒", style: { textColor: 0x00ff00 } },
                    { text: "隨機刷新寶箱", style: { textColor: 0xffffff } }
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
                    player.propertyData.enerty += 5; //能量值增加 
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
        this.perAttackTime = 0; //每1.5s攻击一次
        this.stageCenterX = App.StageUtils.getWidth() * 0.5;
        this.stageCenterY = App.StageUtils.getHeight() * 0.5;
    };
    /**
     * 面板开启执行函数，用于子类继承
     * @param param 参数
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
    //随机生成怪物  除玩家
    RpgGameView.prototype.reduiceMonsterInfo = function (mostid) {
        var mosters = MonsterConfiger.getMonstersInfoConfig()["monster_config"]; //获取所有怪物
        var molist = MonsterConfiger.getMonsters(); //固定配置怪物
        var moinfo = new Object();
        moinfo["name"] = MonsterConfiger.getRadmane();
        moinfo["attackDis"] = 6; //怪物攻击距离
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
    /*********************************7月4号添加 **********************************************/
    /**
     * 添加摇杆以及攻击技能按钮
     */
    RpgGameView.prototype.addVirtualRoker = function () {
        //摇杆
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
        //摇杆控制
        App.RockerUtils.init(moveBg, moveFlag, this.dealkey, this);
        //键盘控制
        App.KeyboardUtils.addKeyUp(this.onKeyUp, this);
    };
    // 键盘事件
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
    // 摇杆事件
    RpgGameView.prototype.dealkey = function (xFlag, yFlag) {
        if (xFlag || yFlag) {
            if (!this.player.isAttacking) {
                this.controlComponent.moveTo(xFlag, yFlag);
            }
            return true;
        }
        return false;
    };
    //添加技能按钮
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
    //技能1
    RpgGameView.prototype.heroSkill1 = function () {
        Log.debug("釋放技能1");
        this.player.isUsingSkill = true;
        var skillNum = this.player.propertyData.skill3["skillid"];
        var outTime = (skillNum == RpgGameSkill.sk30017) ? 5000 : 1000;
        egret.setTimeout(function () {
            this.player.isUsingSkill = false;
        }, this, outTime);
        this.heroAttack();
    };
    //技能2
    RpgGameView.prototype.heroSkill2 = function () {
        Log.debug("釋放技能2");
        this.player.isSkillBuff = true;
        egret.setTimeout(function () {
            this.player.isSkillBuff = false;
        }, this, 3000);
    };
    //普通攻击
    RpgGameView.prototype.normalAttack = function () {
        this.avatarSkillComponent.isNorAttack = true;
        this.heroAttack();
    };
    RpgGameView.prototype.heroAttack = function () {
        if (this.perAttackTime == 0) {
            Log.debug("攻擊按鈕");
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
        Log.debug("開始點擊按鈕");
        this.player.isDirection = true;
        this.addTouchs();
    };
    RpgGameView.prototype.skill2BtnTouchEnd = function () {
        Log.debug("結束點擊按鈕");
        //this.player.isDirection = false;
    };
    RpgGameView.prototype.stageTouchBegin = function (e) {
        Log.debug("開始點擊移動");
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
        Log.debug("長按移動 x:" + touchX + " y:" + touchY);
    };
    RpgGameView.prototype.stageTouchEnd = function (e) {
        Log.debug("結束長按點擊 x:");
        this.removeTouchs();
        this.player.isDirection = false;
        this.player.dir = this.player.skillDir;
        this.heroSkill1();
        this.skillBtn2.changeStatus();
    };
    RpgGameView.prototype.stageOutside = function (e) {
        Log.debug("移出屏幕");
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
    //倒计时完成回调
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
        //灰度图还原
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
    /** 繪製圓弧 */
    RpgSkillBtn.prototype.drawCircle = function (startAngle, endAngle) {
        var shape = this.angelMask;
        var point = this.cenPoint;
        if (startAngle == endAngle) {
            startAngle -= 0.01;
        }
        shape.graphics.clear();
        shape.graphics.beginFill(0x0, 1);
        shape.graphics.moveTo(point.x, point.y); //移到圓心點
        shape.graphics.lineTo(point.x, 0); //畫開始縣
        shape.graphics.drawArc(point.x, point.y, this.radius, startAngle, endAngle, true); //默認順時針畫
        shape.graphics.lineTo(point.x, point.y);
        shape.graphics.endFill();
    };
    RpgSkillBtn.START_ANGLE = -Math.PI / 2; //开始角度
    RpgSkillBtn.END_ANGLE = Math.PI * 3 / 2; //結束角度
    return RpgSkillBtn;
}(eui.Component));
__reflect(RpgSkillBtn.prototype, "RpgSkillBtn", ["eui.UIComponent", "egret.DisplayObject"]);
// TypeScript file
/** 技能倒計時 */
var SkillMask = (function () {
    function SkillMask(target, radius) {
        if (!target) {
            console.error("技能模板參數有誤");
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
     * @param totalTime 倒計時縂時間（毫秒）
     * @param completeFunc 倒計時結束回調函數
     * @param thisObj 回調函數携帶的this對象
     * @param param 回調携帶的參數（非必須）
     */
    SkillMask.prototype.start = function (totalTime, completeFunc, thisObj, param) {
        if (totalTime < 0) {
            console.error("start函數參數有誤");
            return;
        }
        egret.stopTick(this.onTick, this);
        this.totalTime = totalTime;
        this.callBack = completeFunc;
        this.thisObj = thisObj;
        this.param = param;
        this.timeStamp = egret.getTimer();
        this.countNum = 0;
        //可以采用項目中通用的計時器，這裏暫時用這個
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
    /** 繪製圓弧 */
    SkillMask.prototype.drawCircle = function (startAngle, endAngle) {
        var shape = this.shape;
        var point = this.cenPoint;
        shape.graphics.clear();
        shape.graphics.beginFill(0x0, 0.5);
        shape.graphics.moveTo(point.x, point.y); //移到圓心點
        shape.graphics.lineTo(point.x, 0); //畫開始縣
        shape.graphics.drawArc(point.x, point.y, this.radius, startAngle, endAngle, false); //默認順時針畫
        shape.graphics.lineTo(point.x, point.y);
        shape.graphics.endFill();
    };
    SkillMask.START_ANGLE = -Math.PI / 2; //開始角度
    SkillMask.END_ANGLE = Math.PI * 3 / 2; //結束角度
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
        //异步加载
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
        //移除不在屏幕内的格子
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
     *对面板数据的初始化，用于子类继承
     *
     */
    ShopView.prototype.initData = function () {
        _super.prototype.initData.call(this);
        var dp1 = new eui.ArrayCollection();
        dp1.addItem({ title: "普通化肥", price: "3", time: "-5分钟", icon: "icon_fertilizer02" });
        dp1.addItem({ title: "高速化肥", price: "5", time: "-10分钟", icon: "icon_fertilizer03" });
        dp1.addItem({ title: "飞速化肥", price: "15", time: "-30分钟", icon: "icon_fertilizer04" });
        dp1.addItem({ title: "神速化肥", price: "25", time: "-60分钟", icon: "icon_fertilizer05" });
        dp1.addItem({ title: "普通化肥", price: "3", time: "-5分钟", icon: "icon_fertilizer02" });
        dp1.addItem({ title: "高速化肥", price: "5", time: "-10分钟", icon: "icon_fertilizer03" });
        dp1.addItem({ title: "飞速化肥", price: "15", time: "-30分钟", icon: "icon_fertilizer04" });
        dp1.addItem({ title: "神速化肥", price: "25", time: "-60分钟", icon: "icon_fertilizer05" });
        dp1.addItem({ title: "普通化肥", price: "3", time: "-5分钟", icon: "icon_fertilizer02" });
        dp1.addItem({ title: "高速化肥", price: "5", time: "-10分钟", icon: "icon_fertilizer03" });
        dp1.addItem({ title: "飞速化肥", price: "15", time: "-30分钟", icon: "icon_fertilizer04" });
        dp1.addItem({ title: "神速化肥", price: "25", time: "-60分钟", icon: "icon_fertilizer05" });
        var dp2 = new eui.ArrayCollection();
        dp2.addItem({ title: "神速化肥", price: "25", time: "-60分钟", icon: "icon_fertilizer05" });
        dp2.addItem({ title: "普通化肥", price: "3", time: "-5分钟", icon: "icon_fertilizer02" });
        dp2.addItem({ title: "高速化肥", price: "5", time: "-10分钟", icon: "icon_fertilizer03" });
        dp2.addItem({ title: "飞速化肥", price: "15", time: "-30分钟", icon: "icon_fertilizer04" });
        dp2.addItem({ title: "神速化肥", price: "25", time: "-60分钟", icon: "icon_fertilizer05" });
        dp2.addItem({ title: "普通化肥", price: "3", time: "-5分钟", icon: "icon_fertilizer02" });
        dp2.addItem({ title: "高速化肥", price: "5", time: "-10分钟", icon: "icon_fertilizer03" });
        dp2.addItem({ title: "飞速化肥", price: "15", time: "-30分钟", icon: "icon_fertilizer04" });
        dp2.addItem({ title: "神速化肥", price: "25", time: "-60分钟", icon: "icon_fertilizer05" });
        dp2.addItem({ title: "普通化肥", price: "3", time: "-5分钟", icon: "icon_fertilizer02" });
        dp2.addItem({ title: "高速化肥", price: "5", time: "-10分钟", icon: "icon_fertilizer03" });
        dp2.addItem({ title: "飞速化肥", price: "15", time: "-30分钟", icon: "icon_fertilizer04" });
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
         * Http请求
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
         * Socket请求
         * @type {null}
         */
        // public static get Socket(): Socket {
        //     return Socket.getSingtonInstance();
        // }
        /**
         * 模块管理类
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
         * View管理类
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
         * 场景管理类
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
         * 调试工具
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
         * 服务器返回的消息处理中心
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
         * 统一的计时器和帧刷管理类
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
         * 日期工具类
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
         * 数学计算工具类
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
         * 随机数工具类
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
         * 显示对象工具类
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
         * 图片合成数字工具类
         * */
        get: function () {
            return BitmapNumber.getSingtonInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "GuideUtils", {
        /**
         * 引导工具类
         */
        get: function () {
            return GuideUtils.getSingtonInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "StageUtils", {
        /**
         * Stage操作相关工具类
         */
        get: function () {
            return StageUtils.getSingtonInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "EffectUtils", {
        /**
         * Effect工具类
         */
        get: function () {
            return EffectUtils.getSingtonInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "StringUtils", {
        /**
         * 字符串工具类
         */
        get: function () {
            return StringUtils.getSingtonInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "CommonUtils", {
        /**
         * 通过工具类
         */
        get: function () {
            return CommonUtils.getSingtonInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "SoundManager", {
        /**
         * 音乐管理类
         */
        get: function () {
            return SoundManager.getSingtonInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "DeviceUtils", {
        /**
         * 设备工具类
         */
        get: function () {
            return DeviceUtils.getSingtonInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "EgretExpandUtils", {
        /**
         * 引擎扩展类
         */
        get: function () {
            return EgretExpandUtils.getSingtonInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "KeyboardUtils", {
        /**
         * 键盘操作工具类
         */
        get: function () {
            return KeyboardUtils.getSingtonInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "RockerUtils", {
        /**
         * 摇杆操作工具类
         */
        get: function () {
            return RockerUtils.getSingtonInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "ShockUtils", {
        /**
         * 震动类
         */
        get: function () {
            return ShockUtils.getSingtonInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "ResourceUtils", {
        /**
         * 资源加载工具类
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
         * 分帧处理类
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
         * 数组工具类
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
         * 通用Loading动画
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
         * DragonBones工厂类
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
         * StarlingSwf工厂类
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
         * AnchorUtils工具类
         */
        get: function () {
            return AnchorUtils.getSingtonInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "TouchEventHook", {
        /**
         * hack引擎的Touch事件
         */
        get: function () {
            return TouchEventHook.getSingtonInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "LocationPropertyUtils", {
        /**
         * H5地址栏参数操作工作类
         */
        get: function () {
            return LocationPropertyUtils.getSingtonInstance();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(App, "TweenUtils", {
        /**
         * Tween工具类
         */
        get: function () {
            return TweenUtils.getSingtonInstance();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 初始化函数
     * @constructor
     */
    App.Init = function () {
        Log.debug("当前引擎版本: ", egret.Capabilities.engineVersion);
        //全局配置数据
        App.GlobalData = RES.getRes("global");
        //开启调试
        App.DebugUtils.isOpen(App.GlobalData.IsDebug);
        App.DebugUtils.setThreshold(5);
        //扩展功能初始化
        App.EgretExpandUtils.init();
        //实例化Http请求
        App.Http.initServer(App.GlobalData.HttpSerever);
        //实例化ProtoBuf和Socket请求
        App.ProtoConfig = RES.getRes(App.GlobalData.ProtoConfig);
        // App.Socket.initServer(App.GlobalData.SocketServer, App.GlobalData.SocketPort, new ByteArrayMsgByProtobuf());
    };
    /**
     * 请求服务器使用的用户标识
     * @type {string}
     */
    App.ProxyUserFlag = "";
    /**
     * 全局配置数据
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
     *对面板数据的初始化，用于子类继承
     *
     */
    DailyView.prototype.initData = function () {
        _super.prototype.initData.call(this);
        this.dataProvider.addItem({ icon: "icon_experience", gold: "+50", seed: "+200", label: "帮助好友5次", progress: "0/5" });
        this.dataProvider.addItem({ icon: "icon_fertilization", gold: "+120", seed: "+100", label: "帮助好友10次", progress: "0/10" });
        this.dataProvider.addItem({ icon: "icon_diamond", gold: "+520", seed: "+500", label: "帮助好友100次", progress: "0/100" });
        this.dataProvider.addItem({ icon: "icon_experience", gold: "+50", seed: "+200", label: "帮助好友5次", progress: "0/5" });
        this.dataProvider.addItem({ icon: "icon_fertilization", gold: "+120", seed: "+100", label: "帮助好友10次", progress: "0/10" });
        this.dataProvider.addItem({ icon: "icon_diamond", gold: "+520", seed: "+500", label: "帮助好友100次", progress: "0/100" });
        this.dataProvider.addItem({ icon: "icon_experience", gold: "+50", seed: "+200", label: "帮助好友5次", progress: "0/5" });
        this.dataProvider.addItem({ icon: "icon_fertilization", gold: "+120", seed: "+100", label: "帮助好友10次", progress: "0/10" });
        this.dataProvider.addItem({ icon: "icon_diamond", gold: "+520", seed: "+500", label: "帮助好友100次", progress: "0/100" });
        this.dataProvider.addItem({ icon: "icon_experience", gold: "+50", seed: "+200", label: "帮助好友5次", progress: "0/5" });
        this.dataProvider.addItem({ icon: "icon_fertilization", gold: "+120", seed: "+100", label: "帮助好友10次", progress: "0/10" });
        this.dataProvider.addItem({ icon: "icon_diamond", gold: "+520", seed: "+500", label: "帮助好友100次", progress: "0/100" });
        this.dataProvider.addItem({ icon: "icon_experience", gold: "+50", seed: "+200", label: "帮助好友5次", progress: "0/5" });
        this.dataProvider.addItem({ icon: "icon_fertilization", gold: "+120", seed: "+100", label: "帮助好友10次", progress: "0/10" });
        this.dataProvider.addItem({ icon: "icon_diamond", gold: "+520", seed: "+500", label: "帮助好友100次", progress: "0/100" });
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
     *对面板数据的初始化，用于子类继承
     *
     */
    TaskView.prototype.initData = function () {
        _super.prototype.initData.call(this);
        this.dataProvider.addItem({ icon: "icon_experience", gold: "+50", seed: "+200", label: "帮助好友5次", progress: "0/5" });
        this.dataProvider.addItem({ icon: "icon_fertilization", gold: "+120", seed: "+100", label: "帮助好友10次", progress: "0/10" });
        this.dataProvider.addItem({ icon: "icon_diamond", gold: "+520", seed: "+500", label: "帮助好友100次", progress: "0/100" });
        this.dataProvider.addItem({ icon: "icon_experience", gold: "+50", seed: "+200", label: "帮助好友5次", progress: "0/5" });
        this.dataProvider.addItem({ icon: "icon_fertilization", gold: "+120", seed: "+100", label: "帮助好友10次", progress: "0/10" });
        this.dataProvider.addItem({ icon: "icon_diamond", gold: "+520", seed: "+500", label: "帮助好友100次", progress: "0/100" });
        this.dataProvider.addItem({ icon: "icon_experience", gold: "+50", seed: "+200", label: "帮助好友5次", progress: "0/5" });
        this.dataProvider.addItem({ icon: "icon_fertilization", gold: "+120", seed: "+100", label: "帮助好友10次", progress: "0/10" });
        this.dataProvider.addItem({ icon: "icon_diamond", gold: "+520", seed: "+500", label: "帮助好友100次", progress: "0/100" });
        this.dataProvider.addItem({ icon: "icon_experience", gold: "+50", seed: "+200", label: "帮助好友5次", progress: "0/5" });
        this.dataProvider.addItem({ icon: "icon_fertilization", gold: "+120", seed: "+100", label: "帮助好友10次", progress: "0/10" });
        this.dataProvider.addItem({ icon: "icon_diamond", gold: "+520", seed: "+500", label: "帮助好友100次", progress: "0/100" });
        this.dataProvider.addItem({ icon: "icon_experience", gold: "+50", seed: "+200", label: "帮助好友5次", progress: "0/5" });
        this.dataProvider.addItem({ icon: "icon_fertilization", gold: "+120", seed: "+100", label: "帮助好友10次", progress: "0/10" });
        this.dataProvider.addItem({ icon: "icon_diamond", gold: "+520", seed: "+500", label: "帮助好友100次", progress: "0/100" });
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
     *对面板数据的初始化，用于子类继承
     *
     */
    WarehouseView.prototype.initData = function () {
        _super.prototype.initData.call(this);
        var dp1 = new eui.ArrayCollection();
        dp1.addItem({ title: "普通化肥", price: "3", time: "-5分钟", icon: "icon_fertilizer02" });
        dp1.addItem({ title: "高速化肥", price: "5", time: "-10分钟", icon: "icon_fertilizer03" });
        dp1.addItem({ title: "飞速化肥", price: "15", time: "-30分钟", icon: "icon_fertilizer04" });
        dp1.addItem({ title: "神速化肥", price: "25", time: "-60分钟", icon: "icon_fertilizer05" });
        dp1.addItem({ title: "普通化肥", price: "3", time: "-5分钟", icon: "icon_fertilizer02" });
        dp1.addItem({ title: "高速化肥", price: "5", time: "-10分钟", icon: "icon_fertilizer03" });
        dp1.addItem({ title: "飞速化肥", price: "15", time: "-30分钟", icon: "icon_fertilizer04" });
        dp1.addItem({ title: "神速化肥", price: "25", time: "-60分钟", icon: "icon_fertilizer05" });
        dp1.addItem({ title: "普通化肥", price: "3", time: "-5分钟", icon: "icon_fertilizer02" });
        dp1.addItem({ title: "高速化肥", price: "5", time: "-10分钟", icon: "icon_fertilizer03" });
        dp1.addItem({ title: "飞速化肥", price: "15", time: "-30分钟", icon: "icon_fertilizer04" });
        dp1.addItem({ title: "神速化肥", price: "25", time: "-60分钟", icon: "icon_fertilizer05" });
        var dp2 = new eui.ArrayCollection();
        dp2.addItem({ title: "神速化肥", price: "25", time: "-60分钟", icon: "icon_fertilizer05" });
        dp2.addItem({ title: "普通化肥", price: "3", time: "-5分钟", icon: "icon_fertilizer02" });
        dp2.addItem({ title: "高速化肥", price: "5", time: "-10分钟", icon: "icon_fertilizer03" });
        dp2.addItem({ title: "飞速化肥", price: "15", time: "-30分钟", icon: "icon_fertilizer04" });
        dp2.addItem({ title: "神速化肥", price: "25", time: "-60分钟", icon: "icon_fertilizer05" });
        dp2.addItem({ title: "普通化肥", price: "3", time: "-5分钟", icon: "icon_fertilizer02" });
        dp2.addItem({ title: "高速化肥", price: "5", time: "-10分钟", icon: "icon_fertilizer03" });
        dp2.addItem({ title: "飞速化肥", price: "15", time: "-30分钟", icon: "icon_fertilizer04" });
        dp2.addItem({ title: "神速化肥", price: "25", time: "-60分钟", icon: "icon_fertilizer05" });
        dp2.addItem({ title: "普通化肥", price: "3", time: "-5分钟", icon: "icon_fertilizer02" });
        dp2.addItem({ title: "高速化肥", price: "5", time: "-10分钟", icon: "icon_fertilizer03" });
        dp2.addItem({ title: "飞速化肥", price: "15", time: "-30分钟", icon: "icon_fertilizer04" });
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
 * 游戏场景
 */
var GameScene = (function (_super) {
    __extends(GameScene, _super);
    /**
     * 构造函数
     */
    function GameScene() {
        return _super.call(this) || this;
    }
    /**
     * 进入Scene调用
     */
    GameScene.prototype.onEnter = function () {
        _super.prototype.onEnter.call(this);
        this.addLayerAt(LayerManager.Game_Main, 0);
        App.ViewManager.open(ViewConst.Game);
        App.ViewManager.open(ViewConst.GameUI);
        //播放背景音乐
        App.SoundManager.playBg("sound_bg");
    };
    /**
     * 退出Scene调用
     */
    GameScene.prototype.onExit = function () {
        _super.prototype.onExit.call(this);
    };
    return GameScene;
}(BaseScene));
__reflect(GameScene.prototype, "GameScene");
/**
 * Created by yangsong on 2014/11/23.
 * 游戏层级类
 */
var LayerManager = (function () {
    function LayerManager() {
    }
    /**
     * 游戏背景层
     * @type {BaseSpriteLayer}
     */
    LayerManager.Game_Bg = new BaseSpriteLayer();
    /**
     * 主游戏层
     * @type {BaseSpriteLayer}
     */
    LayerManager.Game_Main = new BaseSpriteLayer();
    /**
     * UI主界面
     * @type {BaseEuiLayer}
     */
    LayerManager.UI_Main = new BaseEuiLayer();
    /**
     * UI弹出框层
     * @type {BaseEuiLayer}
     */
    LayerManager.UI_Popup = new BaseEuiLayer();
    /**
     * UI警告消息层
     * @type {BaseEuiLayer}
     */
    LayerManager.UI_Message = new BaseEuiLayer();
    /**
     * UITips层
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
     * 构造函数
     */
    function LoadingScene() {
        return _super.call(this) || this;
    }
    /**
     * 进入Scene调用
     */
    LoadingScene.prototype.onEnter = function () {
        _super.prototype.onEnter.call(this);
        //添加该Scene使用的层级
        this.addLayer(LayerManager.UI_Main);
        //初始打开Loading页面
        App.ViewManager.open(ViewConst.Loading);
    };
    /**
     * 退出Scene调用
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
     * 构造函数
     */
    function RpgGameScene() {
        return _super.call(this) || this;
    }
    /**
     * 进入Scene调用
     */
    RpgGameScene.prototype.onEnter = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        _super.prototype.onEnter.call(this);
        //参数
        var mapId = param[0];
        //开启ComponentSystem
        ComponentSystem.start();
        //添加该Scene使用的Layer
        this.addLayer(LayerManager.Game_Main);
        this.addLayer(LayerManager.UI_Main);
        this.addLayer(LayerManager.UI_Popup);
        this.addLayer(LayerManager.UI_Message);
        this.addLayer(LayerManager.UI_Tips);
        //运行RpgGame
        App.ControllerManager.applyFunc(ControllerConst.RpgGame, RpgGameConst.GameInit, mapId);
        //开启UI部分
        //App.ViewManager.open(ViewConst.Home);
        //播放背景音乐
        App.SoundManager.playBg("sound_bg");
    };
    /**
     * 退出Scene调用
     */
    RpgGameScene.prototype.onExit = function () {
        _super.prototype.onExit.call(this);
        //关闭ComponentSystem
        ComponentSystem.stop();
    };
    return RpgGameScene;
}(BaseScene));
__reflect(RpgGameScene.prototype, "RpgGameScene");
/**
 * Created by yangsong on 2014/11/28.
 * UI场景层
 */
var UIScene = (function (_super) {
    __extends(UIScene, _super);
    /**
     * 构造函数
     */
    function UIScene() {
        return _super.call(this) || this;
    }
    /**
     * 进入Scene调用
     */
    UIScene.prototype.onEnter = function () {
        _super.prototype.onEnter.call(this);
        //添加该Scene使用的层级
        this.addLayer(LayerManager.UI_Main);
        this.addLayer(LayerManager.UI_Popup);
        this.addLayer(LayerManager.UI_Message);
        this.addLayer(LayerManager.UI_Tips);
        //初始打开Home页面
        App.ViewManager.open(ViewConst.Home);
        //播放背景音乐
        // App.SoundManager.playBg("sound_bg");
    };
    /**
     * 退出Scene调用
     */
    UIScene.prototype.onExit = function () {
        _super.prototype.onExit.call(this);
    };
    return UIScene;
}(BaseScene));
__reflect(UIScene.prototype, "UIScene");
/**
 * Created by yangsong on 15-3-27.
 * GUI测试
 */
var EUITest = (function () {
    function EUITest() {
        var groupName = "preload_EUITest";
        // var subGroups:Array<string> = ["preload_core", "preload_ui"];
        var subGroups = ["preload_core", "preload_battle", "preload_ui", "preload"];
        App.ResourceUtils.loadGroups(groupName, subGroups, this.onResourceLoadComplete, this.onResourceLoadProgress, this);
    }
    /**
     * 资源组加载完成
     */
    EUITest.prototype.onResourceLoadComplete = function () {
        this.initModule();
        //App.Init();
        //音乐音效处理
        App.SoundManager.setBgOn(true);
        App.SoundManager.setEffectOn(!App.DeviceUtils.IsHtml5 || !App.DeviceUtils.IsMobile);
        App.SceneManager.runScene(SceneConsts.UI);
    };
    /**
     * 资源组加载进度
     */
    EUITest.prototype.onResourceLoadProgress = function (itemsLoaded, itemsTotal) {
        App.ControllerManager.applyFunc(ControllerConst.Loading, LoadingConst.SetProgress, itemsLoaded, itemsTotal);
    };
    /**
     * 初始化所有模块
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
 * ProtoBuf测试
 */
var ProtoBufTest = (function () {
    function ProtoBufTest() {
        App.ResourceUtils.loadGroup("preload_core", this.onResourceLoadComplete, this.onResourceLoadProgress, this);
    }
    /**
     * 资源组加载完成
     */
    ProtoBufTest.prototype.onResourceLoadComplete = function () {
        App.Init();
        // this.clientTest();
        this.socketTest();
        this.userLogin("root", "666");
    };
    /**
     * 资源组加载进度
     */
    ProtoBufTest.prototype.onResourceLoadProgress = function (itemsLoaded, itemsTotal) {
        //App.ControllerManager.applyFunc(ControllerConst.Loading, LoadingConst.SetProgress, itemsLoaded, itemsTotal);
    };
    /**
     * type 类型
     * 1.主界面
     * 2.战斗场景
     * 3.结算界面
     * 4.技能按钮
     * 5.摇杆
     */
    // 界面浏览埋点
    ProtoBufTest.browView = function (record) {
        // NettyHttp.Http.create()
        // .success(this.browSuccess, this)
        // .error(this.browFailed, this)
        // .add('record='+record)
        // .dataFormat(egret.URLLoaderDataFormat.TEXT)
        // .post('http://localhost:8083');//也可以是post方法
    };
    // 点击按钮埋点
    ProtoBufTest.click = function (record) {
        // NettyHttp.Http.create()
        // .success(this.browSuccess, this)
        // .error(this.browFailed, this)
        // .add('record='+record)
        // .dataFormat(egret.URLLoaderDataFormat.TEXT)
        // .post('http://localhost:8083');//也可以是post方法
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
        // .post('http://localhost:8083');//也可以是post方法
    };
    ProtoBufTest.prototype.onLoadError = function () {
        Log.debug('error');
    };
    ProtoBufTest.prototype.onSuccess = function (data) {
        Log.debug(data);
    };
    ProtoBufTest.prototype.clientTest = function () {
        //创建一条消息
        // var msg = simple.user_login_c2s.fromObject({
        //     accid: 1,
        //     tstamp: 2,
        //     ticket: "yangsong"
        // });
        // //序列化
        // var buffer = simple.user_login_c2s.encode(msg).finish();
        // Log.debug("序列化数据：", buffer);
        // //反序列化
        // var message = simple.user_login_c2s.decode(buffer);
        // Log.debug("反序列化数据：", message);
    };
    ProtoBufTest.prototype.getRoleInfo = function () {
        var nickname = "云龙";
        var roleManager = RoleInfoManager.getSingtonInstance();
        roleManager.getRoleInfo(nickname);
    };
    ProtoBufTest.prototype.updateRoleInfo = function () {
        var roleinfo = {
            "nickname": "云龙",
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
            "name": "掉毛受",
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
            "name": "新增宠物",
            "level": 83,
            "roleId": 2,
            "statu": 0
        };
        var roleManager = RoleInfoManager.getSingtonInstance();
        roleManager.addPet(roleinfo);
    };
    ProtoBufTest.prototype.socketTest = function () {
        //发送一条消息到服务器
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
        //     Log.debug("与服务器连接上");
        //     send();
        //     // this.getRoleInfo();
        //     // this.updateRoleInfo();
        //     // this.updatePet();
        //     // this.addPet();
        // }, this);
        // App.MessageCenter.addListener(SocketConst.SOCKET_RECONNECT, () => {
        //     Log.debug("与服务器重新连接上");
        //     send();
        //     this.getRoleInfo();
        // }, this);
        // App.MessageCenter.addListener(SocketConst.SOCKET_START_RECONNECT, () => {
        //     Log.debug("开始与服务器重新连接");
        // }, this);
        // App.MessageCenter.addListener(SocketConst.SOCKET_CLOSE, () => {
        //     Log.debug("与服务器断开连接");
        // }, this);
        // App.MessageCenter.addListener(SocketConst.SOCKET_NOCONNECT, () => {
        //     Log.debug("服务器连接不上");
        // }, this);
        // App.MessageCenter.addListener("10001", function (msg): void {
        //     Log.debug("收到服务器消息:", msg);
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
        //指定MapId
        this.mapId = this.random_num(1191, 1193);
        this.mapGroupKey = "map_" + this.mapId;
        this.initMapResource();
        //加载资源
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
     * 资源组加载完成
     */
    RpgTest.prototype.onResourceLoadComplete = function () {
        this.initModule();
        //App.Init();
        //音乐音效处理
        App.SoundManager.setBgOn(true);
        App.SoundManager.setEffectOn(true);
        //进入游戏
        App.SceneManager.runScene(SceneConsts.RpgGame, this.mapId);
    };
    /**
     * 资源组加载进度
     */
    RpgTest.prototype.onResourceLoadProgress = function (itemsLoaded, itemsTotal) {
        App.ControllerManager.applyFunc(ControllerConst.Loading, LoadingConst.SetProgress, itemsLoaded, itemsTotal);
    };
    /**
     * 初始化所有模块
     */
    RpgTest.prototype.initModule = function () {
        App.ControllerManager.register(ControllerConst.RpgGame, new RpgGameController());
    };
    /**
     * 生成范围随机数
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
     *对面板进行显示初始化，用于子类继承
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
    //修改用户信息
    AdsView.prototype.changeUserInfo = function () {
        this.user.usertreasure += 50; //金币增加50
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
        _this.currentStatus = "reward"; //获得奖励
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
        //设置文本的混合样式
        this.levelUpLabel.textFlow = [
            { text: "你的" },
            { text: "英雄", style: { "textColor": 0x47ff54 } },
            { text: "已经提升到" },
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
     *对面板进行显示初始化，用于子类继承
     *
     */
    MatchingView.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        if (this.lighting.mask == null) {
            /// 用以被遮罩的形状
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
        var ars = ["正在確認對手方位", "正在叫妖怪起床", "正在為妖怪擦拭武器", "正在檢查通訊信號", "正在給妖怪按摩", "正在挑釁對手的妖怪", "正在和妖怪討論戰略"];
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
    //返回
    SettlementView.prototype.ReturnBtnClickHandle = function (e) {
        App.SoundManager.playEffect("sound_dianji");
        App.ViewManager.closeView(this);
    };
    //再来一局
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
    //接收到战斗结束消息调用
    SettlementView.prototype.fightEnd = function (ski) {
        var ob = this.rewardWithKillNumber(ski);
        this.use.usertreasure += ob["r1"]; //金币
        this.use.userbrands += ob["r2"]; //徽章
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