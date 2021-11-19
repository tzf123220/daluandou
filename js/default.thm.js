var egret = window.egret;window.skins=window.skins||{};
                var __extends = this && this.__extends|| function (d, b) {
                    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                        function __() {
                            this.constructor = d;
                        }
                    __.prototype = b.prototype;
                    d.prototype = new __();
                };
                window.generateEUI = window.generateEUI||{};
                generateEUI.paths = generateEUI.paths||{};
                generateEUI.styles = undefined;
                generateEUI.skins = {"eui.Button":"resource/eui_skins/ButtonSkin.exml","eui.CheckBox":"resource/eui_skins/CheckBoxSkin.exml","eui.HScrollBar":"resource/eui_skins/HScrollBarSkin.exml","eui.HSlider":"resource/eui_skins/HSliderSkin.exml","eui.Panel":"resource/eui_skins/PanelSkin.exml","eui.TextInput":"resource/eui_skins/TextInputSkin.exml","eui.ProgressBar":"resource/eui_skins/ProgressBarSkin.exml","eui.RadioButton":"resource/eui_skins/RadioButtonSkin.exml","eui.Scroller":"resource/eui_skins/ScrollerSkin.exml","eui.ToggleSwitch":"resource/eui_skins/ToggleSwitchSkin.exml","eui.VScrollBar":"resource/eui_skins/VScrollBarSkin.exml","eui.VSlider":"resource/eui_skins/VSliderSkin.exml","eui.ItemRenderer":"resource/eui_skins/ItemRendererSkin.exml"};generateEUI.paths['resource/eui_skins/ButtonSkin.exml'] = window.skins.ButtonSkin = (function (_super) {
	__extends(ButtonSkin, _super);
	function ButtonSkin() {
		_super.call(this);
		this.skinParts = ["labelDisplay","iconDisplay"];
		
		this.minHeight = 50;
		this.minWidth = 100;
		this.elementsContent = [this._Image1_i(),this.labelDisplay_i(),this.iconDisplay_i()];
		this.states = [
			new eui.State ("up",
				[
				])
			,
			new eui.State ("down",
				[
					new eui.SetProperty("_Image1","source","button_down_png")
				])
			,
			new eui.State ("disabled",
				[
					new eui.SetProperty("_Image1","alpha",0.5)
				])
		];
	}
	var _proto = ButtonSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		this._Image1 = t;
		t.percentHeight = 100;
		t.scale9Grid = new egret.Rectangle(1,3,8,8);
		t.source = "button_up_png";
		t.percentWidth = 100;
		return t;
	};
	_proto.labelDisplay_i = function () {
		var t = new eui.Label();
		this.labelDisplay = t;
		t.bottom = 8;
		t.fontFamily = "Tahoma 'Microsoft Yahei'";
		t.left = 8;
		t.right = 8;
		t.size = 20;
		t.textAlign = "center";
		t.textColor = 0xFFFFFF;
		t.top = 8;
		t.verticalAlign = "middle";
		return t;
	};
	_proto.iconDisplay_i = function () {
		var t = new eui.Image();
		this.iconDisplay = t;
		t.horizontalCenter = 0;
		t.verticalCenter = 0;
		return t;
	};
	return ButtonSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/CheckBoxSkin.exml'] = window.skins.CheckBoxSkin = (function (_super) {
	__extends(CheckBoxSkin, _super);
	function CheckBoxSkin() {
		_super.call(this);
		this.skinParts = ["labelDisplay"];
		
		this.elementsContent = [this._Group1_i()];
		this.states = [
			new eui.State ("up",
				[
				])
			,
			new eui.State ("down",
				[
					new eui.SetProperty("_Image1","alpha",0.7)
				])
			,
			new eui.State ("disabled",
				[
					new eui.SetProperty("_Image1","alpha",0.5)
				])
			,
			new eui.State ("upAndSelected",
				[
					new eui.SetProperty("_Image1","source","checkbox_select_up_png")
				])
			,
			new eui.State ("downAndSelected",
				[
					new eui.SetProperty("_Image1","source","checkbox_select_down_png")
				])
			,
			new eui.State ("disabledAndSelected",
				[
					new eui.SetProperty("_Image1","source","checkbox_select_disabled_png")
				])
		];
	}
	var _proto = CheckBoxSkin.prototype;

	_proto._Group1_i = function () {
		var t = new eui.Group();
		t.percentHeight = 100;
		t.percentWidth = 100;
		t.layout = this._HorizontalLayout1_i();
		t.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
		return t;
	};
	_proto._HorizontalLayout1_i = function () {
		var t = new eui.HorizontalLayout();
		t.verticalAlign = "middle";
		return t;
	};
	_proto._Image1_i = function () {
		var t = new eui.Image();
		this._Image1 = t;
		t.alpha = 1;
		t.fillMode = "scale";
		t.source = "checkbox_unselect_png";
		return t;
	};
	_proto.labelDisplay_i = function () {
		var t = new eui.Label();
		this.labelDisplay = t;
		t.fontFamily = "Tahoma";
		t.size = 20;
		t.textAlign = "center";
		t.textColor = 0x707070;
		t.verticalAlign = "middle";
		return t;
	};
	return CheckBoxSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/HScrollBarSkin.exml'] = window.skins.HScrollBarSkin = (function (_super) {
	__extends(HScrollBarSkin, _super);
	function HScrollBarSkin() {
		_super.call(this);
		this.skinParts = ["thumb"];
		
		this.minHeight = 8;
		this.minWidth = 20;
		this.elementsContent = [this.thumb_i()];
	}
	var _proto = HScrollBarSkin.prototype;

	_proto.thumb_i = function () {
		var t = new eui.Image();
		this.thumb = t;
		t.height = 8;
		t.scale9Grid = new egret.Rectangle(3,3,2,2);
		t.source = "roundthumb_png";
		t.verticalCenter = 0;
		t.width = 30;
		return t;
	};
	return HScrollBarSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/HSliderSkin.exml'] = window.skins.HSliderSkin = (function (_super) {
	__extends(HSliderSkin, _super);
	function HSliderSkin() {
		_super.call(this);
		this.skinParts = ["track","thumb"];
		
		this.minHeight = 8;
		this.minWidth = 20;
		this.elementsContent = [this.track_i(),this.thumb_i()];
	}
	var _proto = HSliderSkin.prototype;

	_proto.track_i = function () {
		var t = new eui.Image();
		this.track = t;
		t.height = 6;
		t.scale9Grid = new egret.Rectangle(1,1,4,4);
		t.source = "track_sb_png";
		t.verticalCenter = 0;
		t.percentWidth = 100;
		return t;
	};
	_proto.thumb_i = function () {
		var t = new eui.Image();
		this.thumb = t;
		t.source = "thumb_png";
		t.verticalCenter = 0;
		return t;
	};
	return HSliderSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/ItemRendererSkin.exml'] = window.skins.ItemRendererSkin = (function (_super) {
	__extends(ItemRendererSkin, _super);
	function ItemRendererSkin() {
		_super.call(this);
		this.skinParts = ["labelDisplay"];
		
		this.minHeight = 50;
		this.minWidth = 100;
		this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
		this.states = [
			new eui.State ("up",
				[
				])
			,
			new eui.State ("down",
				[
					new eui.SetProperty("_Image1","source","button_down_png")
				])
			,
			new eui.State ("disabled",
				[
					new eui.SetProperty("_Image1","alpha",0.5)
				])
		];
		
		eui.Binding.$bindProperties(this, ["hostComponent.data"],[0],this.labelDisplay,"text");
	}
	var _proto = ItemRendererSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		this._Image1 = t;
		t.percentHeight = 100;
		t.scale9Grid = new egret.Rectangle(1,3,8,8);
		t.source = "button_up_png";
		t.percentWidth = 100;
		return t;
	};
	_proto.labelDisplay_i = function () {
		var t = new eui.Label();
		this.labelDisplay = t;
		t.bottom = 8;
		t.fontFamily = "Tahoma 'Microsoft Yahei'";
		t.left = 8;
		t.right = 8;
		t.size = 20;
		t.textAlign = "center";
		t.textColor = 0xFFFFFF;
		t.top = 8;
		t.verticalAlign = "middle";
		return t;
	};
	return ItemRendererSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/PanelSkin.exml'] = window.skins.PanelSkin = (function (_super) {
	__extends(PanelSkin, _super);
	function PanelSkin() {
		_super.call(this);
		this.skinParts = ["titleDisplay","moveArea","closeButton"];
		
		this.minHeight = 230;
		this.minWidth = 450;
		this.elementsContent = [this._Image1_i(),this.moveArea_i(),this.closeButton_i()];
	}
	var _proto = PanelSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.scale9Grid = new egret.Rectangle(2,2,12,12);
		t.source = "border_png";
		t.top = 0;
		return t;
	};
	_proto.moveArea_i = function () {
		var t = new eui.Group();
		this.moveArea = t;
		t.height = 45;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		t.elementsContent = [this._Image2_i(),this.titleDisplay_i()];
		return t;
	};
	_proto._Image2_i = function () {
		var t = new eui.Image();
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.source = "header_png";
		t.top = 0;
		return t;
	};
	_proto.titleDisplay_i = function () {
		var t = new eui.Label();
		this.titleDisplay = t;
		t.fontFamily = "Tahoma";
		t.left = 15;
		t.right = 5;
		t.size = 20;
		t.textColor = 0xFFFFFF;
		t.verticalCenter = 0;
		t.wordWrap = false;
		return t;
	};
	_proto.closeButton_i = function () {
		var t = new eui.Button();
		this.closeButton = t;
		t.bottom = 5;
		t.horizontalCenter = 0;
		t.label = "close";
		return t;
	};
	return PanelSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/ProgressBarSkin.exml'] = window.skins.ProgressBarSkin = (function (_super) {
	__extends(ProgressBarSkin, _super);
	function ProgressBarSkin() {
		_super.call(this);
		this.skinParts = ["thumb","labelDisplay"];
		
		this.minHeight = 18;
		this.minWidth = 30;
		this.elementsContent = [this._Image1_i(),this.thumb_i(),this.labelDisplay_i()];
	}
	var _proto = ProgressBarSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.percentHeight = 100;
		t.scale9Grid = new egret.Rectangle(1,1,4,4);
		t.source = "track_pb_png";
		t.verticalCenter = 0;
		t.percentWidth = 100;
		return t;
	};
	_proto.thumb_i = function () {
		var t = new eui.Image();
		this.thumb = t;
		t.percentHeight = 100;
		t.source = "thumb_pb_png";
		t.percentWidth = 100;
		return t;
	};
	_proto.labelDisplay_i = function () {
		var t = new eui.Label();
		this.labelDisplay = t;
		t.fontFamily = "Tahoma";
		t.horizontalCenter = 0;
		t.size = 15;
		t.textAlign = "center";
		t.textColor = 0x707070;
		t.verticalAlign = "middle";
		t.verticalCenter = 0;
		return t;
	};
	return ProgressBarSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/RadioButtonSkin.exml'] = window.skins.RadioButtonSkin = (function (_super) {
	__extends(RadioButtonSkin, _super);
	function RadioButtonSkin() {
		_super.call(this);
		this.skinParts = ["labelDisplay"];
		
		this.elementsContent = [this._Group1_i()];
		this.states = [
			new eui.State ("up",
				[
				])
			,
			new eui.State ("down",
				[
					new eui.SetProperty("_Image1","alpha",0.7)
				])
			,
			new eui.State ("disabled",
				[
					new eui.SetProperty("_Image1","alpha",0.5)
				])
			,
			new eui.State ("upAndSelected",
				[
					new eui.SetProperty("_Image1","source","radiobutton_select_up_png")
				])
			,
			new eui.State ("downAndSelected",
				[
					new eui.SetProperty("_Image1","source","radiobutton_select_down_png")
				])
			,
			new eui.State ("disabledAndSelected",
				[
					new eui.SetProperty("_Image1","source","radiobutton_select_disabled_png")
				])
		];
	}
	var _proto = RadioButtonSkin.prototype;

	_proto._Group1_i = function () {
		var t = new eui.Group();
		t.percentHeight = 100;
		t.percentWidth = 100;
		t.layout = this._HorizontalLayout1_i();
		t.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
		return t;
	};
	_proto._HorizontalLayout1_i = function () {
		var t = new eui.HorizontalLayout();
		t.verticalAlign = "middle";
		return t;
	};
	_proto._Image1_i = function () {
		var t = new eui.Image();
		this._Image1 = t;
		t.alpha = 1;
		t.fillMode = "scale";
		t.source = "radiobutton_unselect_png";
		return t;
	};
	_proto.labelDisplay_i = function () {
		var t = new eui.Label();
		this.labelDisplay = t;
		t.fontFamily = "Tahoma";
		t.size = 20;
		t.textAlign = "center";
		t.textColor = 0x707070;
		t.verticalAlign = "middle";
		return t;
	};
	return RadioButtonSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/ScrollerSkin.exml'] = window.skins.ScrollerSkin = (function (_super) {
	__extends(ScrollerSkin, _super);
	function ScrollerSkin() {
		_super.call(this);
		this.skinParts = ["horizontalScrollBar","verticalScrollBar"];
		
		this.minHeight = 20;
		this.minWidth = 20;
		this.elementsContent = [this.horizontalScrollBar_i(),this.verticalScrollBar_i()];
	}
	var _proto = ScrollerSkin.prototype;

	_proto.horizontalScrollBar_i = function () {
		var t = new eui.HScrollBar();
		this.horizontalScrollBar = t;
		t.bottom = 0;
		t.percentWidth = 100;
		return t;
	};
	_proto.verticalScrollBar_i = function () {
		var t = new eui.VScrollBar();
		this.verticalScrollBar = t;
		t.percentHeight = 100;
		t.right = 0;
		return t;
	};
	return ScrollerSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/TextInputSkin.exml'] = window.skins.TextInputSkin = (function (_super) {
	__extends(TextInputSkin, _super);
	function TextInputSkin() {
		_super.call(this);
		this.skinParts = ["textDisplay","promptDisplay"];
		
		this.minHeight = 40;
		this.minWidth = 300;
		this.elementsContent = [this._Image1_i(),this._Rect1_i(),this.textDisplay_i()];
		this.promptDisplay_i();
		
		this.states = [
			new eui.State ("normal",
				[
				])
			,
			new eui.State ("disabled",
				[
					new eui.SetProperty("textDisplay","textColor",0xff0000)
				])
			,
			new eui.State ("normalWithPrompt",
				[
					new eui.AddItems("promptDisplay","",1,"")
				])
			,
			new eui.State ("disabledWithPrompt",
				[
					new eui.AddItems("promptDisplay","",1,"")
				])
		];
	}
	var _proto = TextInputSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.percentHeight = 100;
		t.scale9Grid = new egret.Rectangle(1,3,8,8);
		t.source = "button_up_png";
		t.percentWidth = 100;
		return t;
	};
	_proto._Rect1_i = function () {
		var t = new eui.Rect();
		t.fillColor = 0xffffff;
		t.percentHeight = 100;
		t.percentWidth = 100;
		return t;
	};
	_proto.textDisplay_i = function () {
		var t = new eui.EditableText();
		this.textDisplay = t;
		t.height = 24;
		t.left = "10";
		t.right = "10";
		t.size = 20;
		t.textColor = 0x000000;
		t.verticalCenter = "0";
		t.percentWidth = 100;
		return t;
	};
	_proto.promptDisplay_i = function () {
		var t = new eui.Label();
		this.promptDisplay = t;
		t.height = 24;
		t.left = 10;
		t.right = 10;
		t.size = 20;
		t.textColor = 0xa9a9a9;
		t.touchEnabled = false;
		t.verticalCenter = 0;
		t.percentWidth = 100;
		return t;
	};
	return TextInputSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/ToggleSwitchSkin.exml'] = window.skins.ToggleSwitchSkin = (function (_super) {
	__extends(ToggleSwitchSkin, _super);
	function ToggleSwitchSkin() {
		_super.call(this);
		this.skinParts = [];
		
		this.elementsContent = [this._Image1_i(),this._Image2_i()];
		this.states = [
			new eui.State ("up",
				[
					new eui.SetProperty("_Image1","source","off_png")
				])
			,
			new eui.State ("down",
				[
					new eui.SetProperty("_Image1","source","off_png")
				])
			,
			new eui.State ("disabled",
				[
					new eui.SetProperty("_Image1","source","off_png")
				])
			,
			new eui.State ("upAndSelected",
				[
					new eui.SetProperty("_Image2","horizontalCenter",18)
				])
			,
			new eui.State ("downAndSelected",
				[
					new eui.SetProperty("_Image2","horizontalCenter",18)
				])
			,
			new eui.State ("disabledAndSelected",
				[
					new eui.SetProperty("_Image2","horizontalCenter",18)
				])
		];
	}
	var _proto = ToggleSwitchSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		this._Image1 = t;
		t.source = "on_png";
		return t;
	};
	_proto._Image2_i = function () {
		var t = new eui.Image();
		this._Image2 = t;
		t.horizontalCenter = -18;
		t.source = "handle_png";
		t.verticalCenter = 0;
		return t;
	};
	return ToggleSwitchSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/VScrollBarSkin.exml'] = window.skins.VScrollBarSkin = (function (_super) {
	__extends(VScrollBarSkin, _super);
	function VScrollBarSkin() {
		_super.call(this);
		this.skinParts = ["thumb"];
		
		this.minHeight = 20;
		this.minWidth = 8;
		this.elementsContent = [this.thumb_i()];
	}
	var _proto = VScrollBarSkin.prototype;

	_proto.thumb_i = function () {
		var t = new eui.Image();
		this.thumb = t;
		t.height = 30;
		t.horizontalCenter = 0;
		t.scale9Grid = new egret.Rectangle(3,3,2,2);
		t.source = "roundthumb_png";
		t.width = 8;
		return t;
	};
	return VScrollBarSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/VSliderSkin.exml'] = window.skins.VSliderSkin = (function (_super) {
	__extends(VSliderSkin, _super);
	function VSliderSkin() {
		_super.call(this);
		this.skinParts = ["track","thumb"];
		
		this.minHeight = 30;
		this.minWidth = 25;
		this.elementsContent = [this.track_i(),this.thumb_i()];
	}
	var _proto = VSliderSkin.prototype;

	_proto.track_i = function () {
		var t = new eui.Image();
		this.track = t;
		t.percentHeight = 100;
		t.horizontalCenter = 0;
		t.scale9Grid = new egret.Rectangle(1,1,4,4);
		t.source = "track_png";
		t.width = 7;
		return t;
	};
	_proto.thumb_i = function () {
		var t = new eui.Image();
		this.thumb = t;
		t.horizontalCenter = 0;
		t.source = "thumb_png";
		return t;
	};
	return VSliderSkin;
})(eui.Skin);generateEUI.paths['resource/skins/AdsViewSkin.exml'] = window.AdsViewSkin = (function (_super) {
	__extends(AdsViewSkin, _super);
	var AdsViewSkin$Skin1 = 	(function (_super) {
		__extends(AdsViewSkin$Skin1, _super);
		function AdsViewSkin$Skin1() {
			_super.call(this);
			this.skinParts = ["labelDisplay"];
			
			this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
			this.states = [
				new eui.State ("up",
					[
					])
				,
				new eui.State ("down",
					[
						new eui.SetProperty("_Image1","source","ads_reward_texture_json.blackBg_over_view")
					])
				,
				new eui.State ("disabled",
					[
					])
			];
		}
		var _proto = AdsViewSkin$Skin1.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			this._Image1 = t;
			t.percentHeight = 100;
			t.source = "ads_reward_texture_json.blackBg_over_view";
			t.percentWidth = 100;
			return t;
		};
		_proto.labelDisplay_i = function () {
			var t = new eui.Label();
			this.labelDisplay = t;
			t.horizontalCenter = 0;
			t.verticalCenter = 0;
			return t;
		};
		return AdsViewSkin$Skin1;
	})(eui.Skin);

	var AdsViewSkin$Skin2 = 	(function (_super) {
		__extends(AdsViewSkin$Skin2, _super);
		function AdsViewSkin$Skin2() {
			_super.call(this);
			this.skinParts = ["labelDisplay"];
			
			this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
			this.states = [
				new eui.State ("up",
					[
					])
				,
				new eui.State ("down",
					[
						new eui.SetProperty("_Image1","source","ads_btn")
					])
				,
				new eui.State ("disabled",
					[
						new eui.SetProperty("_Image1","source","ads_unable_icon_png")
					])
			];
		}
		var _proto = AdsViewSkin$Skin2.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			this._Image1 = t;
			t.percentHeight = 100;
			t.source = "ads_btn";
			t.percentWidth = 100;
			return t;
		};
		_proto.labelDisplay_i = function () {
			var t = new eui.Label();
			this.labelDisplay = t;
			t.horizontalCenter = 0;
			t.verticalCenter = 0;
			return t;
		};
		return AdsViewSkin$Skin2;
	})(eui.Skin);

	function AdsViewSkin() {
		_super.call(this);
		this.skinParts = ["bg","border","word_bg","des","rewardNum","left","leftNum","adsBtn","adsPanel","content"];
		
		this.height = 750;
		this.width = 1334;
		this.elementsContent = [this.content_i()];
	}
	var _proto = AdsViewSkin.prototype;

	_proto.content_i = function () {
		var t = new eui.Group();
		this.content = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		t.elementsContent = [this.bg_i(),this.adsPanel_i()];
		return t;
	};
	_proto.bg_i = function () {
		var t = new eui.Button();
		this.bg = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.bottom = 0;
		t.label = "";
		t.left = -1;
		t.right = 1;
		t.top = 0;
		t.skinName = AdsViewSkin$Skin1;
		return t;
	};
	_proto.adsPanel_i = function () {
		var t = new eui.Group();
		this.adsPanel = t;
		t.anchorOffsetX = 295;
		t.height = 380;
		t.horizontalCenter = 0;
		t.scaleX = 1;
		t.scaleY = 1;
		t.verticalCenter = 0;
		t.width = 590;
		t.elementsContent = [this.border_i(),this.word_bg_i(),this.des_i(),this.rewardNum_i(),this.left_i(),this.leftNum_i(),this._Image1_i(),this.adsBtn_i()];
		return t;
	};
	_proto.border_i = function () {
		var t = new eui.Image();
		this.border = t;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "ads_reward_texture_json.ads_border";
		t.x = 0;
		t.y = 0;
		return t;
	};
	_proto.word_bg_i = function () {
		var t = new eui.Image();
		this.word_bg = t;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "ads_reward_texture_json.ads_word_bg";
		t.x = 33;
		t.y = 117;
		return t;
	};
	_proto.des_i = function () {
		var t = new eui.Label();
		this.des = t;
		t.anchorOffsetX = 0;
		t.bold = true;
		t.size = 26;
		t.text = "观看广告即可获得";
		t.textColor = 0xf9e3ac;
		t.width = 336;
		t.x = 120;
		t.y = 124.5;
		return t;
	};
	_proto.rewardNum_i = function () {
		var t = new eui.Label();
		this.rewardNum = t;
		t.anchorOffsetX = 0;
		t.bold = true;
		t.size = 26;
		t.text = "x 50";
		t.textAlign = "center";
		t.textColor = 0x28ff00;
		t.width = 56;
		t.x = 414;
		t.y = 124.5;
		return t;
	};
	_proto.left_i = function () {
		var t = new eui.Label();
		this.left = t;
		t.anchorOffsetX = 0;
		t.bold = true;
		t.size = 24;
		t.text = "剩余 ：";
		t.width = 80;
		t.x = 241;
		t.y = 199;
		return t;
	};
	_proto.leftNum_i = function () {
		var t = new eui.Label();
		this.leftNum = t;
		t.anchorOffsetX = 0;
		t.bold = true;
		t.size = 24;
		t.text = "5/5";
		t.textAlign = "center";
		t.width = 44;
		t.x = 309;
		t.y = 199;
		return t;
	};
	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 55;
		t.source = "home_gemstone_png";
		t.width = 50;
		t.x = 360;
		t.y = 107;
		return t;
	};
	_proto.adsBtn_i = function () {
		var t = new eui.Button();
		this.adsBtn = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.label = "";
		t.width = 173;
		t.x = 210;
		t.y = 287;
		t.skinName = AdsViewSkin$Skin2;
		return t;
	};
	return AdsViewSkin;
})(eui.Skin);generateEUI.paths['resource/skins/CustomProgressBarSkin.exml'] = window.skins.CustomProgressBarSkin = (function (_super) {
	__extends(CustomProgressBarSkin, _super);
	function CustomProgressBarSkin() {
		_super.call(this);
		this.skinParts = ["thumb","labelDisplay"];
		
		this.minHeight = 18;
		this.minWidth = 30;
		this.elementsContent = [this._Image1_i(),this.thumb_i(),this.labelDisplay_i()];
	}
	var _proto = CustomProgressBarSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.percentHeight = 100;
		t.scale9Grid = new egret.Rectangle(1,1,4,4);
		t.source = "set_match_views_atlas_json.match_progress1";
		t.verticalCenter = 0;
		t.percentWidth = 100;
		return t;
	};
	_proto.thumb_i = function () {
		var t = new eui.Image();
		this.thumb = t;
		t.anchorOffsetX = 0;
		t.percentHeight = 100;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "set_match_views_atlas_json.match_progress2";
		t.percentWidth = 100;
		t.x = 0;
		t.y = 0;
		return t;
	};
	_proto.labelDisplay_i = function () {
		var t = new eui.Label();
		this.labelDisplay = t;
		t.fontFamily = "Tahoma";
		t.horizontalCenter = 0;
		t.size = 15;
		t.text = "0/0";
		t.textAlign = "center";
		t.textColor = 0x707070;
		t.verticalAlign = "middle";
		t.verticalCenter = 0;
		t.visible = false;
		return t;
	};
	return CustomProgressBarSkin;
})(eui.Skin);generateEUI.paths['resource/skins/CatchingViewSkin.exml'] = window.CatchingView = (function (_super) {
	__extends(CatchingView, _super);
	function CatchingView() {
		_super.call(this);
		this.skinParts = ["bg","_txt","title","_OuterGlow","_Icon","_player0","_OuterGlow0","_Icon0","_player1","_OuterGlow1","_Icon1","_player2","_OuterGlow2","_Icon2","_player3","_OuterGlow3","_Icon3","_player4","_OuterGlow4","_Icon4","_player5","_CatchingGroup","_Catchingprogress","lighting","_lab2","_lab1","content"];
		
		this.height = 750;
		this.width = 1334;
		this.elementsContent = [this.bg_i(),this._txt_i(),this.content_i()];
	}
	var _proto = CatchingView.prototype;

	_proto.bg_i = function () {
		var t = new eui.Rect();
		this.bg = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.bottom = 0;
		t.fillAlpha = 0.6;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		return t;
	};
	_proto._txt_i = function () {
		var t = new eui.Label();
		this._txt = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.bold = true;
		t.height = 34;
		t.italic = true;
		t.size = 26;
		t.text = "正在为您匹配对手...";
		t.textAlign = "center";
		t.textColor = 0x4bef10;
		t.verticalAlign = "middle";
		t.visible = false;
		t.width = 538;
		t.x = 378;
		t.y = 576;
		return t;
	};
	_proto.content_i = function () {
		var t = new eui.Group();
		this.content = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 621;
		t.width = 609;
		t.x = 352;
		t.y = 57;
		t.elementsContent = [this.title_i(),this._CatchingGroup_i(),this._Catchingprogress_i(),this._Group1_i(),this._lab2_i(),this._lab1_i()];
		return t;
	};
	_proto.title_i = function () {
		var t = new eui.Image();
		this.title = t;
		t.source = "set_match_views_atlas_json.match_word";
		t.x = 18.5;
		t.y = 13;
		return t;
	};
	_proto._CatchingGroup_i = function () {
		var t = new eui.Group();
		this._CatchingGroup = t;
		t.anchorOffsetY = 0;
		t.height = 407;
		t.scaleX = 1;
		t.scaleY = 1;
		t.width = 600;
		t.x = 4;
		t.y = 87;
		t.layout = this._TileLayout1_i();
		t.elementsContent = [this._player0_i(),this._player1_i(),this._player2_i(),this._player3_i(),this._player4_i(),this._player5_i()];
		return t;
	};
	_proto._TileLayout1_i = function () {
		var t = new eui.TileLayout();
		t.horizontalGap = -6;
		return t;
	};
	_proto._player0_i = function () {
		var t = new eui.Group();
		this._player0 = t;
		t.height = 200;
		t.scaleX = 1;
		t.scaleY = 1;
		t.width = 200;
		t.x = 486;
		t.y = -48;
		t.elementsContent = [this._OuterGlow_i(),this._Icon_i()];
		return t;
	};
	_proto._OuterGlow_i = function () {
		var t = new eui.Image();
		this._OuterGlow = t;
		t.scale9Grid = new egret.Rectangle(35,35,144,139);
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "MInfo_card_shine_png";
		t.visible = false;
		t.x = 0;
		t.y = 0;
		return t;
	};
	_proto._Icon_i = function () {
		var t = new eui.Image();
		this._Icon = t;
		t.horizontalCenter = 5;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "MInfo_card_unknown_png";
		t.verticalCenter = 6;
		return t;
	};
	_proto._player1_i = function () {
		var t = new eui.Group();
		this._player1 = t;
		t.height = 200;
		t.scaleX = 1;
		t.scaleY = 1;
		t.width = 200;
		t.x = 496;
		t.y = -38;
		t.elementsContent = [this._OuterGlow0_i(),this._Icon0_i()];
		return t;
	};
	_proto._OuterGlow0_i = function () {
		var t = new eui.Image();
		this._OuterGlow0 = t;
		t.scale9Grid = new egret.Rectangle(35,35,144,139);
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "MInfo_card_shine_png";
		t.visible = false;
		t.x = 0;
		t.y = 0;
		return t;
	};
	_proto._Icon0_i = function () {
		var t = new eui.Image();
		this._Icon0 = t;
		t.horizontalCenter = 5;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "MInfo_card_unknown_png";
		t.verticalCenter = 6;
		return t;
	};
	_proto._player2_i = function () {
		var t = new eui.Group();
		this._player2 = t;
		t.height = 200;
		t.scaleX = 1;
		t.scaleY = 1;
		t.width = 200;
		t.x = 506;
		t.y = -28;
		t.elementsContent = [this._OuterGlow1_i(),this._Icon1_i()];
		return t;
	};
	_proto._OuterGlow1_i = function () {
		var t = new eui.Image();
		this._OuterGlow1 = t;
		t.scale9Grid = new egret.Rectangle(35,35,144,139);
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "MInfo_card_shine_png";
		t.visible = false;
		t.x = 0;
		t.y = 0;
		return t;
	};
	_proto._Icon1_i = function () {
		var t = new eui.Image();
		this._Icon1 = t;
		t.horizontalCenter = 5;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "MInfo_card_unknown_png";
		t.verticalCenter = 6;
		return t;
	};
	_proto._player3_i = function () {
		var t = new eui.Group();
		this._player3 = t;
		t.height = 200;
		t.scaleX = 1;
		t.scaleY = 1;
		t.width = 200;
		t.x = 516;
		t.y = -18;
		t.elementsContent = [this._OuterGlow2_i(),this._Icon2_i()];
		return t;
	};
	_proto._OuterGlow2_i = function () {
		var t = new eui.Image();
		this._OuterGlow2 = t;
		t.scale9Grid = new egret.Rectangle(35,35,144,139);
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "MInfo_card_shine_png";
		t.visible = false;
		t.x = 0;
		t.y = 0;
		return t;
	};
	_proto._Icon2_i = function () {
		var t = new eui.Image();
		this._Icon2 = t;
		t.horizontalCenter = 5;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "MInfo_card_unknown_png";
		t.verticalCenter = 6;
		return t;
	};
	_proto._player4_i = function () {
		var t = new eui.Group();
		this._player4 = t;
		t.height = 200;
		t.scaleX = 1;
		t.scaleY = 1;
		t.width = 200;
		t.x = 526;
		t.y = -8;
		t.elementsContent = [this._OuterGlow3_i(),this._Icon3_i()];
		return t;
	};
	_proto._OuterGlow3_i = function () {
		var t = new eui.Image();
		this._OuterGlow3 = t;
		t.scale9Grid = new egret.Rectangle(35,35,144,139);
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "MInfo_card_shine_png";
		t.visible = false;
		t.x = 0;
		t.y = 0;
		return t;
	};
	_proto._Icon3_i = function () {
		var t = new eui.Image();
		this._Icon3 = t;
		t.horizontalCenter = 5;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "MInfo_card_unknown_png";
		t.verticalCenter = 6;
		return t;
	};
	_proto._player5_i = function () {
		var t = new eui.Group();
		this._player5 = t;
		t.height = 200;
		t.scaleX = 1;
		t.scaleY = 1;
		t.width = 200;
		t.x = 536;
		t.y = 2;
		t.elementsContent = [this._OuterGlow4_i(),this._Icon4_i()];
		return t;
	};
	_proto._OuterGlow4_i = function () {
		var t = new eui.Image();
		this._OuterGlow4 = t;
		t.scale9Grid = new egret.Rectangle(35,35,144,139);
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "MInfo_card_shine_png";
		t.visible = false;
		t.x = 0;
		t.y = 0;
		return t;
	};
	_proto._Icon4_i = function () {
		var t = new eui.Image();
		this._Icon4 = t;
		t.horizontalCenter = 5;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "MInfo_card_unknown_png";
		t.verticalCenter = 6;
		return t;
	};
	_proto._Catchingprogress_i = function () {
		var t = new eui.ProgressBar();
		this._Catchingprogress = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 26;
		t.skinName = "skins.CustomProgressBarSkin";
		t.value = 0;
		t.width = 420;
		t.x = 93;
		t.y = 570;
		return t;
	};
	_proto._Group1_i = function () {
		var t = new eui.Group();
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 26;
		t.width = 12.67;
		t.x = 93;
		t.y = 570;
		t.elementsContent = [this.lighting_i()];
		return t;
	};
	_proto.lighting_i = function () {
		var t = new eui.Image();
		this.lighting = t;
		t.anchorOffsetX = 140;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "set_match_views_atlas_json.match_progress3";
		t.width = 259;
		t.x = -73;
		t.y = 0;
		return t;
	};
	_proto._lab2_i = function () {
		var t = new eui.Label();
		this._lab2 = t;
		t.alpha = 1;
		t.anchorOffsetX = 0;
		t.size = 18;
		t.text = "正在確認對手方位";
		t.textAlign = "center";
		t.textColor = 0x00FF00;
		t.width = 188;
		t.x = 214;
		t.y = 545;
		return t;
	};
	_proto._lab1_i = function () {
		var t = new eui.Label();
		this._lab1 = t;
		t.anchorOffsetX = 0;
		t.size = 18;
		t.text = "正在確認對手方位";
		t.textAlign = "center";
		t.textColor = 0x00ff00;
		t.width = 188;
		t.x = 215;
		t.y = 520;
		return t;
	};
	return CatchingView;
})(eui.Skin);generateEUI.paths['resource/skins/ExplainViewSkin.exml'] = window.ExplainViewSkin = (function (_super) {
	__extends(ExplainViewSkin, _super);
	var ExplainViewSkin$Skin3 = 	(function (_super) {
		__extends(ExplainViewSkin$Skin3, _super);
		function ExplainViewSkin$Skin3() {
			_super.call(this);
			this.skinParts = ["labelDisplay"];
			
			this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
			this.states = [
				new eui.State ("up",
					[
					])
				,
				new eui.State ("down",
					[
						new eui.SetProperty("_Image1","source","explain_back_icon_png")
					])
				,
				new eui.State ("disabled",
					[
					])
			];
		}
		var _proto = ExplainViewSkin$Skin3.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			this._Image1 = t;
			t.percentHeight = 100;
			t.source = "explain_back_icon_png";
			t.percentWidth = 100;
			return t;
		};
		_proto.labelDisplay_i = function () {
			var t = new eui.Label();
			this.labelDisplay = t;
			t.horizontalCenter = 0;
			t.verticalCenter = 0;
			return t;
		};
		return ExplainViewSkin$Skin3;
	})(eui.Skin);

	function ExplainViewSkin() {
		_super.call(this);
		this.skinParts = ["exitBtn"];
		
		this.height = 750;
		this.width = 1334;
		this.elementsContent = [this._Image1_i(),this._Image2_i(),this.exitBtn_i()];
	}
	var _proto = ExplainViewSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.percentHeight = 100;
		t.source = "ads_reward_texture_json.blackBg_over_view";
		t.percentWidth = 100;
		t.x = 0;
		t.y = 0;
		return t;
	};
	_proto._Image2_i = function () {
		var t = new eui.Image();
		t.anchorOffsetX = 0;
		t.fillMode = "scale";
		t.percentHeight = 100;
		t.source = "explain_view_jpg";
		t.percentWidth = 100;
		t.x = 0;
		t.y = 0;
		return t;
	};
	_proto.exitBtn_i = function () {
		var t = new eui.Button();
		this.exitBtn = t;
		t.height = 60;
		t.label = "";
		t.right = 64;
		t.top = 30;
		t.width = 60;
		t.skinName = ExplainViewSkin$Skin3;
		return t;
	};
	return ExplainViewSkin;
})(eui.Skin);generateEUI.paths['resource/skins/GuiScreenSkin.exml'] = window.GuiScreenSkin = (function (_super) {
	__extends(GuiScreenSkin, _super);
	var GuiScreenSkin$Skin4 = 	(function (_super) {
		__extends(GuiScreenSkin$Skin4, _super);
		function GuiScreenSkin$Skin4() {
			_super.call(this);
			this.skinParts = ["labelDisplay"];
			
			this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
			this.states = [
				new eui.State ("up",
					[
					])
				,
				new eui.State ("down",
					[
					])
				,
				new eui.State ("disabled",
					[
					])
			];
		}
		var _proto = GuiScreenSkin$Skin4.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			t.percentHeight = 100;
			t.source = "home_goback_png";
			t.percentWidth = 100;
			return t;
		};
		_proto.labelDisplay_i = function () {
			var t = new eui.Label();
			this.labelDisplay = t;
			t.horizontalCenter = 0;
			t.verticalCenter = 0;
			return t;
		};
		return GuiScreenSkin$Skin4;
	})(eui.Skin);

	var GuiScreenSkin$Skin5 = 	(function (_super) {
		__extends(GuiScreenSkin$Skin5, _super);
		function GuiScreenSkin$Skin5() {
			_super.call(this);
			this.skinParts = ["labelDisplay"];
			
			this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
			this.states = [
				new eui.State ("up",
					[
					])
				,
				new eui.State ("down",
					[
					])
				,
				new eui.State ("disabled",
					[
					])
			];
		}
		var _proto = GuiScreenSkin$Skin5.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			t.percentHeight = 100;
			t.source = "home_instructions_png";
			t.percentWidth = 100;
			return t;
		};
		_proto.labelDisplay_i = function () {
			var t = new eui.Label();
			this.labelDisplay = t;
			t.horizontalCenter = 0;
			t.verticalCenter = 0;
			return t;
		};
		return GuiScreenSkin$Skin5;
	})(eui.Skin);

	var GuiScreenSkin$Skin6 = 	(function (_super) {
		__extends(GuiScreenSkin$Skin6, _super);
		function GuiScreenSkin$Skin6() {
			_super.call(this);
			this.skinParts = ["labelDisplay"];
			
			this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
			this.states = [
				new eui.State ("up",
					[
					])
				,
				new eui.State ("down",
					[
					])
				,
				new eui.State ("disabled",
					[
					])
			];
		}
		var _proto = GuiScreenSkin$Skin6.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			t.percentHeight = 100;
			t.source = "home_setting_png";
			t.percentWidth = 100;
			return t;
		};
		_proto.labelDisplay_i = function () {
			var t = new eui.Label();
			this.labelDisplay = t;
			t.horizontalCenter = 0;
			t.verticalCenter = 0;
			return t;
		};
		return GuiScreenSkin$Skin6;
	})(eui.Skin);

	var GuiScreenSkin$Skin7 = 	(function (_super) {
		__extends(GuiScreenSkin$Skin7, _super);
		function GuiScreenSkin$Skin7() {
			_super.call(this);
			this.skinParts = ["labelDisplay"];
			
			this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
			this.states = [
				new eui.State ("up",
					[
					])
				,
				new eui.State ("down",
					[
					])
				,
				new eui.State ("disabled",
					[
					])
			];
		}
		var _proto = GuiScreenSkin$Skin7.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			t.percentHeight = 100;
			t.source = "home_advertising_png";
			t.percentWidth = 100;
			return t;
		};
		_proto.labelDisplay_i = function () {
			var t = new eui.Label();
			this.labelDisplay = t;
			t.horizontalCenter = 0;
			t.verticalCenter = 0;
			return t;
		};
		return GuiScreenSkin$Skin7;
	})(eui.Skin);

	var GuiScreenSkin$Skin8 = 	(function (_super) {
		__extends(GuiScreenSkin$Skin8, _super);
		function GuiScreenSkin$Skin8() {
			_super.call(this);
			this.skinParts = ["labelDisplay"];
			
			this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
			this.states = [
				new eui.State ("up",
					[
					])
				,
				new eui.State ("down",
					[
					])
				,
				new eui.State ("disabled",
					[
					])
			];
		}
		var _proto = GuiScreenSkin$Skin8.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			t.percentHeight = 100;
			t.source = "home_monster_png";
			t.percentWidth = 100;
			return t;
		};
		_proto.labelDisplay_i = function () {
			var t = new eui.Label();
			this.labelDisplay = t;
			t.horizontalCenter = 0;
			t.verticalCenter = 0;
			return t;
		};
		return GuiScreenSkin$Skin8;
	})(eui.Skin);

	var GuiScreenSkin$Skin9 = 	(function (_super) {
		__extends(GuiScreenSkin$Skin9, _super);
		function GuiScreenSkin$Skin9() {
			_super.call(this);
			this.skinParts = ["labelDisplay"];
			
			this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
			this.states = [
				new eui.State ("up",
					[
					])
				,
				new eui.State ("down",
					[
						new eui.SetProperty("_Image1","source","home_matchBtn_selected_png")
					])
				,
				new eui.State ("disabled",
					[
					])
			];
		}
		var _proto = GuiScreenSkin$Skin9.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			this._Image1 = t;
			t.percentHeight = 100;
			t.source = "home_matchBtn_normal_png";
			t.percentWidth = 100;
			return t;
		};
		_proto.labelDisplay_i = function () {
			var t = new eui.Label();
			this.labelDisplay = t;
			t.horizontalCenter = 0;
			t.verticalCenter = 0;
			return t;
		};
		return GuiScreenSkin$Skin9;
	})(eui.Skin);

	var GuiScreenSkin$Skin10 = 	(function (_super) {
		__extends(GuiScreenSkin$Skin10, _super);
		function GuiScreenSkin$Skin10() {
			_super.call(this);
			this.skinParts = ["labelDisplay"];
			
			this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
			this.states = [
				new eui.State ("up",
					[
					])
				,
				new eui.State ("down",
					[
						new eui.SetProperty("_Image1","source","MInfo_improveBtn_selected_png")
					])
				,
				new eui.State ("disabled",
					[
					])
			];
		}
		var _proto = GuiScreenSkin$Skin10.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			this._Image1 = t;
			t.percentHeight = 100;
			t.source = "MInfo_improveBtn_normal_png";
			t.percentWidth = 100;
			return t;
		};
		_proto.labelDisplay_i = function () {
			var t = new eui.Label();
			this.labelDisplay = t;
			t.horizontalCenter = 0;
			t.verticalCenter = 0;
			return t;
		};
		return GuiScreenSkin$Skin10;
	})(eui.Skin);

	function GuiScreenSkin() {
		_super.call(this);
		this.skinParts = ["headDisplay","goldDisplay","diamondDisplay","brandsLabel","unameLabel","gobackBtn","instructionsBtn","settingBtn","advertisingBtn","monsterBtn","matchBtn","buttonsGroup","monstName","improveBtn","expendLabel","improveGroup","rolePlatformGroup","listRankings","scrListRankings","rankingGroup"];
		
		this.height = 750;
		this.width = 1334;
		this.elementsContent = [this._Image1_i(),this._Group6_i(),this.gobackBtn_i(),this.buttonsGroup_i(),this.rolePlatformGroup_i(),this.rankingGroup_i()];
	}
	var _proto = GuiScreenSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.source = "home_background_jpg";
		t.top = 0;
		return t;
	};
	_proto._Group6_i = function () {
		var t = new eui.Group();
		t.anchorOffsetX = 0;
		t.height = 170;
		t.left = 0;
		t.right = 334;
		t.top = 0;
		t.width = 1000;
		t.elementsContent = [this._Group5_i()];
		return t;
	};
	_proto._Group5_i = function () {
		var t = new eui.Group();
		t.anchorOffsetX = 0;
		t.height = 170;
		t.width = 1000;
		t.x = 0;
		t.y = 0;
		t.elementsContent = [this._Image2_i(),this.headDisplay_i(),this._Group2_i(),this._Group4_i(),this.unameLabel_i()];
		return t;
	};
	_proto._Image2_i = function () {
		var t = new eui.Image();
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 145;
		t.source = "home_headBg_png";
		t.width = 350;
		t.x = 12.5;
		t.y = 10;
		return t;
	};
	_proto.headDisplay_i = function () {
		var t = new eui.Image();
		this.headDisplay = t;
		t.height = 201;
		t.source = "";
		t.width = 198;
		t.x = -10;
		t.y = -48.5;
		return t;
	};
	_proto._Group2_i = function () {
		var t = new eui.Group();
		t.x = 390;
		t.y = 25;
		t.elementsContent = [this._Image3_i(),this._Group1_i(),this._Image4_i()];
		return t;
	};
	_proto._Image3_i = function () {
		var t = new eui.Image();
		t.source = "home_resourcesBg_png";
		t.x = 10;
		t.y = 0;
		return t;
	};
	_proto._Group1_i = function () {
		var t = new eui.Group();
		t.height = 30;
		t.rotation = 0.73;
		t.width = 142;
		t.x = 40;
		t.y = 15;
		t.elementsContent = [this.goldDisplay_i()];
		return t;
	};
	_proto.goldDisplay_i = function () {
		var t = new eui.Label();
		this.goldDisplay = t;
		t.bold = true;
		t.horizontalCenter = 0;
		t.size = 21;
		t.text = "9999999";
		t.textColor = 0xffffff;
		t.verticalCenter = 0;
		return t;
	};
	_proto._Image4_i = function () {
		var t = new eui.Image();
		t.height = 54;
		t.source = "home_gemstone_png";
		t.width = 53;
		t.x = 5;
		t.y = 0;
		return t;
	};
	_proto._Group4_i = function () {
		var t = new eui.Group();
		t.x = 650;
		t.y = 25;
		t.elementsContent = [this._Image5_i(),this._Group3_i(),this._Image6_i()];
		return t;
	};
	_proto._Image5_i = function () {
		var t = new eui.Image();
		t.source = "home_resourcesBg_png";
		t.x = 10;
		t.y = 0;
		return t;
	};
	_proto._Group3_i = function () {
		var t = new eui.Group();
		t.height = 30;
		t.rotation = 0.65;
		t.width = 142;
		t.x = 40;
		t.y = 15;
		t.elementsContent = [this.diamondDisplay_i(),this.brandsLabel_i()];
		return t;
	};
	_proto.diamondDisplay_i = function () {
		var t = new eui.BitmapLabel();
		this.diamondDisplay = t;
		t.font = "font_fnt";
		t.horizontalCenter = 0;
		t.text = "99";
		t.verticalCenter = 0;
		t.visible = false;
		return t;
	};
	_proto.brandsLabel_i = function () {
		var t = new eui.Label();
		this.brandsLabel = t;
		t.bold = true;
		t.horizontalCenter = 0;
		t.size = 21;
		t.text = "9999999";
		t.verticalCenter = 0;
		return t;
	};
	_proto._Image6_i = function () {
		var t = new eui.Image();
		t.height = 54;
		t.source = "home_emblem_png";
		t.width = 53;
		t.x = 5;
		t.y = 0;
		return t;
	};
	_proto.unameLabel_i = function () {
		var t = new eui.Label();
		this.unameLabel = t;
		t.anchorOffsetX = 0;
		t.bold = true;
		t.rotation = 359.5;
		t.size = 25;
		t.text = "孤独的威";
		t.textColor = 0xffffff;
		t.width = 150;
		t.x = 173.39;
		t.y = 45;
		return t;
	};
	_proto.gobackBtn_i = function () {
		var t = new eui.Button();
		this.gobackBtn = t;
		t.height = 76;
		t.label = "";
		t.right = 42;
		t.top = 20;
		t.visible = false;
		t.width = 87;
		t.skinName = GuiScreenSkin$Skin4;
		return t;
	};
	_proto.buttonsGroup_i = function () {
		var t = new eui.Group();
		this.buttonsGroup = t;
		t.anchorOffsetY = 0;
		t.height = 624;
		t.right = 0;
		t.width = 242;
		t.y = 126;
		t.elementsContent = [this.instructionsBtn_i(),this.settingBtn_i(),this.advertisingBtn_i(),this.monsterBtn_i(),this.matchBtn_i()];
		return t;
	};
	_proto.instructionsBtn_i = function () {
		var t = new eui.Button();
		this.instructionsBtn = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.bottom = 515;
		t.height = 101;
		t.label = "";
		t.right = 34;
		t.scaleX = 1;
		t.scaleY = 1;
		t.width = 96;
		t.x = 112;
		t.skinName = GuiScreenSkin$Skin5;
		return t;
	};
	_proto.settingBtn_i = function () {
		var t = new eui.Button();
		this.settingBtn = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.bottom = 394;
		t.height = 101;
		t.label = "";
		t.right = 34;
		t.scaleX = 1;
		t.scaleY = 1;
		t.width = 96;
		t.x = 112;
		t.skinName = GuiScreenSkin$Skin6;
		return t;
	};
	_proto.advertisingBtn_i = function () {
		var t = new eui.Button();
		this.advertisingBtn = t;
		t.bottom = 274;
		t.height = 101;
		t.label = "";
		t.right = 34;
		t.scaleX = 1;
		t.scaleY = 1;
		t.width = 96;
		t.x = 112;
		t.skinName = GuiScreenSkin$Skin7;
		return t;
	};
	_proto.monsterBtn_i = function () {
		var t = new eui.Button();
		this.monsterBtn = t;
		t.bottom = 154;
		t.height = 101;
		t.label = "";
		t.right = 34;
		t.scaleX = 1;
		t.scaleY = 1;
		t.width = 96;
		t.x = 112;
		t.skinName = GuiScreenSkin$Skin8;
		return t;
	};
	_proto.matchBtn_i = function () {
		var t = new eui.Button();
		this.matchBtn = t;
		t.bottom = 25;
		t.height = 109;
		t.label = "";
		t.right = 0;
		t.scaleX = 1;
		t.scaleY = 1;
		t.width = 242;
		t.x = 0;
		t.y = 616;
		t.skinName = GuiScreenSkin$Skin9;
		return t;
	};
	_proto.rolePlatformGroup_i = function () {
		var t = new eui.Group();
		this.rolePlatformGroup = t;
		t.anchorOffsetY = 0;
		t.height = 576;
		t.horizontalCenter = 83.5;
		t.width = 443;
		t.y = 142;
		t.elementsContent = [this._Image7_i(),this._Image8_i(),this.monstName_i(),this.improveGroup_i()];
		return t;
	};
	_proto._Image7_i = function () {
		var t = new eui.Image();
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.bottom = 0;
		t.height = 401;
		t.horizontalCenter = 0;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "home_platform_png";
		t.width = 443;
		return t;
	};
	_proto._Image8_i = function () {
		var t = new eui.Image();
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 50;
		t.horizontalCenter = 0;
		t.source = "home_nameBg_png";
		t.top = 0;
		t.width = 210;
		return t;
	};
	_proto.monstName_i = function () {
		var t = new eui.Label();
		this.monstName = t;
		t.anchorOffsetX = 0;
		t.height = 30;
		t.size = 20;
		t.text = "";
		t.textAlign = "center";
		t.verticalAlign = "middle";
		t.width = 184;
		t.x = 130;
		t.y = 12;
		return t;
	};
	_proto.improveGroup_i = function () {
		var t = new eui.Group();
		this.improveGroup = t;
		t.alpha = 1;
		t.anchorOffsetY = 0;
		t.bottom = -30;
		t.height = 174;
		t.horizontalCenter = 0;
		t.visible = false;
		t.width = 242;
		t.elementsContent = [this.improveBtn_i(),this._Label1_i(),this._Image9_i(),this.expendLabel_i()];
		return t;
	};
	_proto.improveBtn_i = function () {
		var t = new eui.Button();
		this.improveBtn = t;
		t.bottom = 0;
		t.height = 109;
		t.horizontalCenter = 0;
		t.label = "";
		t.width = 242;
		t.skinName = GuiScreenSkin$Skin10;
		return t;
	};
	_proto._Label1_i = function () {
		var t = new eui.Label();
		t.size = 20;
		t.stroke = 1;
		t.strokeColor = 0x725732;
		t.text = "消耗：";
		t.textColor = 0xffffdb;
		t.x = 31.5;
		t.y = 55;
		return t;
	};
	_proto._Image9_i = function () {
		var t = new eui.Image();
		t.height = 54;
		t.source = "home_gemstone_png";
		t.width = 53;
		t.x = 76;
		t.y = 33;
		return t;
	};
	_proto.expendLabel_i = function () {
		var t = new eui.Label();
		this.expendLabel = t;
		t.size = 20;
		t.stroke = 2;
		t.strokeColor = 0x351b0e;
		t.text = "0";
		t.textColor = 0x3aff4d;
		t.x = 131.32;
		t.y = 55;
		return t;
	};
	_proto.rankingGroup_i = function () {
		var t = new eui.Group();
		this.rankingGroup = t;
		t.height = 504;
		t.width = 420;
		t.x = 8;
		t.y = 190;
		t.elementsContent = [this._Image10_i(),this.scrListRankings_i(),this._Label2_i(),this._Label3_i(),this._Label4_i()];
		return t;
	};
	_proto._Image10_i = function () {
		var t = new eui.Image();
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 504;
		t.horizontalCenter = 0;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "home_rank_png";
		t.verticalCenter = 0;
		t.width = 420;
		return t;
	};
	_proto.scrListRankings_i = function () {
		var t = new eui.Scroller();
		this.scrListRankings = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 380;
		t.width = 350;
		t.x = 34;
		t.y = 81;
		t.viewport = this.listRankings_i();
		return t;
	};
	_proto.listRankings_i = function () {
		var t = new eui.List();
		this.listRankings = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 380;
		t.width = 326;
		t.x = 0;
		t.y = -12;
		return t;
	};
	_proto._Label2_i = function () {
		var t = new eui.Label();
		t.fontFamily = "Arial";
		t.size = 24;
		t.text = "名次";
		t.x = 68;
		t.y = 44;
		return t;
	};
	_proto._Label3_i = function () {
		var t = new eui.Label();
		t.size = 24;
		t.text = "玩家名";
		t.x = 174;
		t.y = 44;
		return t;
	};
	_proto._Label4_i = function () {
		var t = new eui.Label();
		t.size = 24;
		t.text = "勛章";
		t.x = 300;
		t.y = 44;
		return t;
	};
	return GuiScreenSkin;
})(eui.Skin);generateEUI.paths['resource/skins/LevelRewardViewSkin.exml'] = window.LevelRewardViewSkin = (function (_super) {
	__extends(LevelRewardViewSkin, _super);
	var LevelRewardViewSkin$Skin11 = 	(function (_super) {
		__extends(LevelRewardViewSkin$Skin11, _super);
		function LevelRewardViewSkin$Skin11() {
			_super.call(this);
			this.skinParts = ["labelDisplay"];
			
			this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
			this.states = [
				new eui.State ("up",
					[
					])
				,
				new eui.State ("down",
					[
						new eui.SetProperty("_Image1","source","ads_reward_texture_json.blackBg_over_view")
					])
				,
				new eui.State ("disabled",
					[
					])
			];
		}
		var _proto = LevelRewardViewSkin$Skin11.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			this._Image1 = t;
			t.percentHeight = 100;
			t.source = "ads_reward_texture_json.blackBg_over_view";
			t.percentWidth = 100;
			return t;
		};
		_proto.labelDisplay_i = function () {
			var t = new eui.Label();
			this.labelDisplay = t;
			t.horizontalCenter = 0;
			t.verticalCenter = 0;
			return t;
		};
		return LevelRewardViewSkin$Skin11;
	})(eui.Skin);

	function LevelRewardViewSkin() {
		_super.call(this);
		this.skinParts = ["bg","title","desBg","levelUpLabel","rewardNum","iconimage","content"];
		
		this.currentState = "levelUp";
		this.height = 750;
		this.width = 1334;
		this.elementsContent = [this.content_i()];
		this.states = [
			new eui.State ("reward",
				[
					new eui.SetProperty("title","source","success_get"),
					new eui.SetProperty("levelUpLabel","visible",false),
					new eui.SetProperty("levelUpLabel","italic",true)
				])
			,
			new eui.State ("levelUp",
				[
					new eui.SetProperty("title","source","success_up"),
					new eui.SetProperty("levelUpLabel","text","你的英雄獲得更強的力量！"),
					new eui.SetProperty("levelUpLabel","bold",true),
					new eui.SetProperty("rewardNum","visible",false),
					new eui.SetProperty("iconimage","visible",false),
					new eui.SetProperty("_Group1","touchEnabled",false)
				])
			,
			new eui.State ("levelupfail",
				[
					new eui.SetProperty("title","source","fail_unlock"),
					new eui.SetProperty("desBg","source","fail_line_bg"),
					new eui.SetProperty("levelUpLabel","text","很遗憾！"),
					new eui.SetProperty("rewardNum","visible",false),
					new eui.SetProperty("iconimage","visible",false)
				])
			,
			new eui.State ("unlocksucc",
				[
					new eui.SetProperty("title","source","success_unlock"),
					new eui.SetProperty("levelUpLabel","text","恭喜解鎖新的妖怪！"),
					new eui.SetProperty("rewardNum","visible",false),
					new eui.SetProperty("iconimage","visible",false)
				])
			,
			new eui.State ("unlockfail",
				[
					new eui.SetProperty("title","source","fail_up"),
					new eui.SetProperty("desBg","source","fail_line_bg"),
					new eui.SetProperty("levelUpLabel","text","收集足夠的徽章才能解鎖！"),
					new eui.SetProperty("rewardNum","visible",false),
					new eui.SetProperty("iconimage","visible",false)
				])
		];
	}
	var _proto = LevelRewardViewSkin.prototype;

	_proto.content_i = function () {
		var t = new eui.Group();
		this.content = t;
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		t.elementsContent = [this.bg_i(),this._Group1_i()];
		return t;
	};
	_proto.bg_i = function () {
		var t = new eui.Button();
		this.bg = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.bottom = 0;
		t.label = "";
		t.left = 0;
		t.right = 0;
		t.scaleX = 1;
		t.scaleY = 1;
		t.top = 0;
		t.x = 0;
		t.y = 0;
		t.skinName = LevelRewardViewSkin$Skin11;
		return t;
	};
	_proto._Group1_i = function () {
		var t = new eui.Group();
		this._Group1 = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 353;
		t.horizontalCenter = 0;
		t.touchEnabled = false;
		t.verticalCenter = 0;
		t.width = 773;
		t.elementsContent = [this.title_i(),this.desBg_i(),this.levelUpLabel_i(),this.rewardNum_i(),this.iconimage_i()];
		return t;
	};
	_proto.title_i = function () {
		var t = new eui.Image();
		this.title = t;
		t.source = "ads_reward_texture_json.reward_word";
		t.x = 193;
		t.y = 0;
		return t;
	};
	_proto.desBg_i = function () {
		var t = new eui.Image();
		this.desBg = t;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "ads_reward_texture_json.uplevel_bg";
		t.x = -74;
		t.y = 128;
		return t;
	};
	_proto.levelUpLabel_i = function () {
		var t = new eui.Label();
		this.levelUpLabel = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.bold = true;
		t.height = 33;
		t.size = 22;
		t.text = "";
		t.textAlign = "center";
		t.verticalAlign = "middle";
		t.width = 500;
		t.x = 135;
		t.y = 159;
		return t;
	};
	_proto.rewardNum_i = function () {
		var t = new eui.Label();
		this.rewardNum = t;
		t.bold = true;
		t.size = 26;
		t.text = "x  50";
		t.textColor = 0x28ff00;
		t.x = 394;
		t.y = 163;
		return t;
	};
	_proto.iconimage_i = function () {
		var t = new eui.Image();
		this.iconimage = t;
		t.source = "home_gemstone_png";
		t.x = 286;
		t.y = 120;
		return t;
	};
	return LevelRewardViewSkin;
})(eui.Skin);generateEUI.paths['resource/skins/LoadingUISkin.exml'] = window.LoadingUISkin = (function (_super) {
	__extends(LoadingUISkin, _super);
	function LoadingUISkin() {
		_super.call(this);
		this.skinParts = ["txtMsg"];
		
		this.height = 667;
		this.width = 1334;
		this.elementsContent = [this._Image1_i(),this.txtMsg_i(),this._Image2_i(),this._Image3_i()];
	}
	var _proto = LoadingUISkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.bottom = 0;
		t.height = 300;
		t.left = 0;
		t.right = 0;
		t.source = "launch_bg_jpg";
		t.top = 0;
		return t;
	};
	_proto.txtMsg_i = function () {
		var t = new eui.Label();
		this.txtMsg = t;
		t.bottom = 46;
		t.horizontalCenter = 0.5;
		t.size = 25;
		t.text = "资源加载中...";
		t.textAlign = "center";
		t.verticalAlign = "middle";
		t.visible = false;
		t.width = 249;
		return t;
	};
	_proto._Image2_i = function () {
		var t = new eui.Image();
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 259;
		t.left = 0;
		t.source = "launch_logo_png";
		t.top = 0;
		t.visible = false;
		t.width = 514;
		return t;
	};
	_proto._Image3_i = function () {
		var t = new eui.Image();
		t.bottom = 0;
		t.height = 118;
		t.right = 0;
		t.source = "launch_startBtn_png";
		t.visible = false;
		t.width = 239;
		return t;
	};
	return LoadingUISkin;
})(eui.Skin);generateEUI.paths['resource/skins/login/login.exml'] = window.login = (function (_super) {
	__extends(login, _super);
	var login$Skin12 = 	(function (_super) {
		__extends(login$Skin12, _super);
		function login$Skin12() {
			_super.call(this);
			this.skinParts = ["labelDisplay"];
			
			this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
			this.states = [
				new eui.State ("up",
					[
					])
				,
				new eui.State ("down",
					[
						new eui.SetProperty("_Image1","source","login_btn1_png")
					])
				,
				new eui.State ("disabled",
					[
					])
			];
		}
		var _proto = login$Skin12.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			this._Image1 = t;
			t.percentHeight = 100;
			t.source = "login_btn0_png";
			t.percentWidth = 100;
			return t;
		};
		_proto.labelDisplay_i = function () {
			var t = new eui.Label();
			this.labelDisplay = t;
			t.horizontalCenter = 0;
			t.verticalCenter = 0;
			return t;
		};
		return login$Skin12;
	})(eui.Skin);

	function login() {
		_super.call(this);
		this.skinParts = ["btnEnter","platId"];
		
		this.height = 750;
		this.width = 1334;
		this.elementsContent = [this._Image1_i(),this._Image2_i(),this.btnEnter_i(),this.platId_i()];
	}
	var _proto = login.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.source = "ads_reward_texture_json.blackBg_over_view";
		t.top = 0;
		return t;
	};
	_proto._Image2_i = function () {
		var t = new eui.Image();
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 605;
		t.horizontalCenter = 0.5;
		t.source = "login_bg_png";
		t.width = 527;
		t.y = 55;
		return t;
	};
	_proto.btnEnter_i = function () {
		var t = new eui.Button();
		this.btnEnter = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 102;
		t.horizontalCenter = -8.5;
		t.label = "";
		t.width = 209;
		t.y = 513;
		t.skinName = login$Skin12;
		return t;
	};
	_proto.platId_i = function () {
		var t = new eui.EditableText();
		this.platId = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.backgroundColor = 0x000000;
		t.height = 45;
		t.horizontalCenter = "0.5";
		t.prompt = "请输入";
		t.size = 20;
		t.text = "";
		t.textAlign = "left";
		t.textColor = 0xffffff;
		t.verticalAlign = "middle";
		t.width = 355;
		t.y = 270;
		return t;
	};
	return login;
})(eui.Skin);generateEUI.paths['resource/skins/login/TextInputSkin.exml'] = window.skins.TextInputSkin = (function (_super) {
	__extends(TextInputSkin, _super);
	function TextInputSkin() {
		_super.call(this);
		this.skinParts = ["textDisplay","promptDisplay"];
		
		this.minHeight = 40;
		this.minWidth = 300;
		this.elementsContent = [this._Image1_i(),this._Rect1_i(),this.textDisplay_i()];
		this.promptDisplay_i();
		
		this.states = [
			new eui.State ("normal",
				[
				])
			,
			new eui.State ("disabled",
				[
					new eui.SetProperty("textDisplay","textColor",0xff0000)
				])
			,
			new eui.State ("normalWithPrompt",
				[
					new eui.AddItems("promptDisplay","",1,"")
				])
			,
			new eui.State ("disabledWithPrompt",
				[
					new eui.AddItems("promptDisplay","",1,"")
				])
		];
	}
	var _proto = TextInputSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.percentHeight = 100;
		t.scale9Grid = new egret.Rectangle(6,6,130,22);
		t.source = "textInput_bg";
		t.percentWidth = 100;
		return t;
	};
	_proto._Rect1_i = function () {
		var t = new eui.Rect();
		t.percentHeight = 100;
		t.visible = false;
		t.percentWidth = 100;
		return t;
	};
	_proto.textDisplay_i = function () {
		var t = new eui.EditableText();
		this.textDisplay = t;
		t.bottom = "8";
		t.percentHeight = 100;
		t.left = "10";
		t.right = "10";
		t.size = 18;
		t.textColor = 0xe7d0b7;
		t.top = "8";
		t.verticalCenter = "0";
		t.percentWidth = 100;
		return t;
	};
	_proto.promptDisplay_i = function () {
		var t = new eui.Label();
		this.promptDisplay = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 76;
		t.horizontalCenter = 0;
		t.size = 20;
		t.text = "hello";
		t.textAlign = "center";
		t.textColor = 0xa9a9a9;
		t.touchEnabled = false;
		t.verticalAlign = "middle";
		t.verticalCenter = 0;
		t.width = 316;
		return t;
	};
	return TextInputSkin;
})(eui.Skin);generateEUI.paths['resource/skins/MenuButtonSkin.exml'] = window.MenuButtonSkin = (function (_super) {
	__extends(MenuButtonSkin, _super);
	function MenuButtonSkin() {
		_super.call(this);
		this.skinParts = [];
		
		this.elementsContent = [this._Image1_i()];
		this._Image2_i();
		
		this._Image3_i();
		
		this.states = [
			new eui.State ("up",
				[
					new eui.AddItems("_Image3","",1,"")
				])
			,
			new eui.State ("down",
				[
					new eui.AddItems("_Image3","",1,"")
				])
			,
			new eui.State ("disabled",
				[
					new eui.AddItems("_Image3","",1,"")
				])
			,
			new eui.State ("upAndSelected",
				[
					new eui.AddItems("_Image2","",1,"")
				])
			,
			new eui.State ("downAndSelected",
				[
					new eui.AddItems("_Image2","",1,"")
				])
			,
			new eui.State ("disabledAndSelected",
				[
					new eui.AddItems("_Image2","",1,"")
				])
		];
	}
	var _proto = MenuButtonSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.source = "btn_shrink_bg";
		t.x = 0;
		t.y = 0;
		return t;
	};
	_proto._Image2_i = function () {
		var t = new eui.Image();
		this._Image2 = t;
		t.scaleX = -1;
		t.source = "btn_shrink";
		t.x = 59;
		t.y = 16;
		return t;
	};
	_proto._Image3_i = function () {
		var t = new eui.Image();
		this._Image3 = t;
		t.source = "btn_shrink";
		t.x = 19;
		t.y = 16;
		return t;
	};
	return MenuButtonSkin;
})(eui.Skin);generateEUI.paths['resource/skins/MenuSkin.exml'] = window.MenuSkin = (function (_super) {
	__extends(MenuSkin, _super);
	function MenuSkin() {
		_super.call(this);
		this.skinParts = [];
		
	}
	var _proto = MenuSkin.prototype;

	return MenuSkin;
})(eui.Skin);generateEUI.paths['resource/skins/MonsterIntroSkin.exml'] = window.MonsterIntroSkin = (function (_super) {
	__extends(MonsterIntroSkin, _super);
	function MonsterIntroSkin() {
		_super.call(this);
		this.skinParts = ["titleLabel","healthLabel","attackLabel","skillLabel","introLabel","hplabel","skillplabel","skillhlabel"];
		
		this.height = 597;
		this.width = 426;
		this.elementsContent = [this._Image1_i(),this.titleLabel_i(),this.healthLabel_i(),this.attackLabel_i(),this.skillLabel_i(),this.introLabel_i(),this.hplabel_i(),this.skillplabel_i(),this.skillhlabel_i()];
	}
	var _proto = MonsterIntroSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.height = 597;
		t.source = "MInfo_IntroductionBg_png";
		t.width = 426;
		t.x = 0;
		t.y = 0;
		return t;
	};
	_proto.titleLabel_i = function () {
		var t = new eui.Label();
		this.titleLabel = t;
		t.bold = true;
		t.horizontalCenter = 0;
		t.size = 20;
		t.stroke = 2;
		t.strokeColor = 0x725732;
		t.text = "Lv1 疾风";
		t.textColor = 0xffffdb;
		t.y = 28;
		return t;
	};
	_proto.healthLabel_i = function () {
		var t = new eui.Label();
		this.healthLabel = t;
		t.size = 20;
		t.text = "最大生命：";
		t.textColor = 0x7bff3a;
		t.x = 123;
		t.y = 105;
		return t;
	};
	_proto.attackLabel_i = function () {
		var t = new eui.Label();
		this.attackLabel = t;
		t.size = 20;
		t.text = "普攻傷害：";
		t.textColor = 0xfff561;
		t.x = 123;
		t.y = 156;
		return t;
	};
	_proto.skillLabel_i = function () {
		var t = new eui.Label();
		this.skillLabel = t;
		t.size = 20;
		t.text = "技能傷害：";
		t.textColor = 0xff57ca;
		t.x = 123;
		t.y = 206;
		return t;
	};
	_proto.introLabel_i = function () {
		var t = new eui.Label();
		this.introLabel = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 294;
		t.horizontalCenter = 0;
		t.size = 20;
		t.text = "妖怪简介";
		t.textColor = 0xfff6c4;
		t.verticalAlign = "top";
		t.verticalCenter = 112.5;
		t.width = 318;
		return t;
	};
	_proto.hplabel_i = function () {
		var t = new eui.Label();
		this.hplabel = t;
		t.size = 20;
		t.text = "1000";
		t.textColor = 0x7bff3a;
		t.x = 229.5;
		t.y = 105;
		return t;
	};
	_proto.skillplabel_i = function () {
		var t = new eui.Label();
		this.skillplabel = t;
		t.size = 20;
		t.text = "800";
		t.textColor = 0xfff561;
		t.x = 229.5;
		t.y = 156;
		return t;
	};
	_proto.skillhlabel_i = function () {
		var t = new eui.Label();
		this.skillhlabel = t;
		t.size = 20;
		t.text = "700";
		t.textColor = 0xff57ca;
		t.x = 229.5;
		t.y = 206;
		return t;
	};
	return MonsterIntroSkin;
})(eui.Skin);generateEUI.paths['resource/skins/MonsterListItemSkin.exml'] = window.MonsterListItemSkin = (function (_super) {
	__extends(MonsterListItemSkin, _super);
	var MonsterListItemSkin$Skin13 = 	(function (_super) {
		__extends(MonsterListItemSkin$Skin13, _super);
		function MonsterListItemSkin$Skin13() {
			_super.call(this);
			this.skinParts = ["labelDisplay"];
			
			this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
			this.states = [
				new eui.State ("up",
					[
					])
				,
				new eui.State ("down",
					[
					])
				,
				new eui.State ("disabled",
					[
					])
			];
		}
		var _proto = MonsterListItemSkin$Skin13.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			t.percentHeight = 100;
			t.source = "MInfo_usedBtn_png";
			t.percentWidth = 100;
			return t;
		};
		_proto.labelDisplay_i = function () {
			var t = new eui.Label();
			this.labelDisplay = t;
			t.horizontalCenter = 0;
			t.verticalCenter = 0;
			return t;
		};
		return MonsterListItemSkin$Skin13;
	})(eui.Skin);

	function MonsterListItemSkin() {
		_super.call(this);
		this.skinParts = ["iconLine","iconHead","useBtn","usingLabel","unlockNumberLabel","lockGroup"];
		
		this.height = 172;
		this.width = 126;
		this.elementsContent = [this._Image1_i(),this.iconLine_i(),this.iconHead_i(),this.useBtn_i(),this.usingLabel_i(),this.lockGroup_i()];
	}
	var _proto = MonsterListItemSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.source = "MInfo_cardList_under_png";
		t.top = 0;
		return t;
	};
	_proto.iconLine_i = function () {
		var t = new eui.Image();
		this.iconLine = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 145;
		t.horizontalCenter = 0;
		t.source = "MInfo_card_shine_png";
		t.width = 146;
		t.y = -10;
		return t;
	};
	_proto.iconHead_i = function () {
		var t = new eui.Image();
		this.iconHead = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 101;
		t.horizontalCenter = 0;
		t.source = "MInfo_card_20005_png";
		t.width = 104;
		t.y = 12;
		return t;
	};
	_proto.useBtn_i = function () {
		var t = new eui.Button();
		this.useBtn = t;
		t.bottom = 2;
		t.height = 48;
		t.horizontalCenter = 0;
		t.label = "";
		t.width = 109;
		t.skinName = MonsterListItemSkin$Skin13;
		return t;
	};
	_proto.usingLabel_i = function () {
		var t = new eui.Label();
		this.usingLabel = t;
		t.bold = true;
		t.size = 20;
		t.stroke = 2;
		t.strokeColor = 0x351b0e;
		t.text = "已上陣";
		t.textColor = 0x3aff4d;
		t.x = 38.5;
		t.y = 135;
		return t;
	};
	_proto.lockGroup_i = function () {
		var t = new eui.Group();
		this.lockGroup = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 20;
		t.horizontalCenter = 0;
		t.width = 102;
		t.y = 135;
		t.elementsContent = [this._Image2_i(),this.unlockNumberLabel_i()];
		return t;
	};
	_proto._Image2_i = function () {
		var t = new eui.Image();
		t.height = 30;
		t.left = 4;
		t.source = "home_emblem_png";
		t.width = 30;
		t.y = -5;
		return t;
	};
	_proto.unlockNumberLabel_i = function () {
		var t = new eui.Label();
		this.unlockNumberLabel = t;
		t.bold = true;
		t.right = -2;
		t.size = 20;
		t.stroke = 2;
		t.strokeColor = 0x351b05;
		t.text = "100解锁";
		t.textColor = 0xff5f45;
		return t;
	};
	return MonsterListItemSkin;
})(eui.Skin);generateEUI.paths['resource/skins/MonsterListSkin.exml'] = window.MonsterListSkin = (function (_super) {
	__extends(MonsterListSkin, _super);
	function MonsterListSkin() {
		_super.call(this);
		this.skinParts = ["monsterList"];
		
		this.height = 613;
		this.width = 481;
		this.elementsContent = [this._Image1_i(),this._Image2_i(),this._Scroller1_i()];
	}
	var _proto = MonsterListSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.source = "MInfo_cardList_bg_png";
		t.top = 0;
		return t;
	};
	_proto._Image2_i = function () {
		var t = new eui.Image();
		t.height = 22;
		t.horizontalCenter = 0;
		t.source = "MInfo_cardList_head_png";
		t.width = 263;
		t.y = 50;
		return t;
	};
	_proto._Scroller1_i = function () {
		var t = new eui.Scroller();
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 480;
		t.horizontalCenter = 0;
		t.verticalCenter = 22.5;
		t.width = 389;
		t.viewport = this.monsterList_i();
		return t;
	};
	_proto.monsterList_i = function () {
		var t = new eui.List();
		this.monsterList = t;
		t.layout = this._TileLayout1_i();
		return t;
	};
	_proto._TileLayout1_i = function () {
		var t = new eui.TileLayout();
		t.requestedColumnCount = 3;
		return t;
	};
	return MonsterListSkin;
})(eui.Skin);generateEUI.paths['resource/skins/PanelSkin.exml'] = window.PanelSkin = (function (_super) {
	__extends(PanelSkin, _super);
	var PanelSkin$Skin14 = 	(function (_super) {
		__extends(PanelSkin$Skin14, _super);
		function PanelSkin$Skin14() {
			_super.call(this);
			this.skinParts = ["labelDisplay"];
			
			this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
			this.states = [
				new eui.State ("up",
					[
					])
				,
				new eui.State ("down",
					[
						new eui.SetProperty("_Image1","source","btn_wrong")
					])
				,
				new eui.State ("disabled",
					[
						new eui.SetProperty("_Image1","source","btn_wrong")
					])
			];
		}
		var _proto = PanelSkin$Skin14.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			this._Image1 = t;
			t.percentHeight = 100;
			t.source = "btn_wrong";
			t.percentWidth = 100;
			return t;
		};
		_proto.labelDisplay_i = function () {
			var t = new eui.Label();
			this.labelDisplay = t;
			t.horizontalCenter = 0;
			t.verticalCenter = 0;
			return t;
		};
		return PanelSkin$Skin14;
	})(eui.Skin);

	function PanelSkin() {
		_super.call(this);
		this.skinParts = ["contentGroup","closeBtn","iconDisplay","button"];
		
		this.elementsContent = [this._Group1_i(),this._Group4_i()];
	}
	var _proto = PanelSkin.prototype;

	_proto._Group1_i = function () {
		var t = new eui.Group();
		t.percentHeight = 100;
		t.touchChildren = true;
		t.touchEnabled = true;
		t.percentWidth = 100;
		t.elementsContent = [this._Rect1_i()];
		return t;
	};
	_proto._Rect1_i = function () {
		var t = new eui.Rect();
		t.fillAlpha = 0;
		t.fillColor = 0;
		t.percentHeight = 100;
		t.rotation = 359.95;
		t.percentWidth = 100;
		t.x = 0;
		t.y = 0;
		return t;
	};
	_proto._Group4_i = function () {
		var t = new eui.Group();
		t.height = 600;
		t.horizontalCenter = 0;
		t.verticalCenter = 0;
		t.width = 505;
		t.elementsContent = [this._Group2_i(),this.closeBtn_i(),this._Group3_i(),this.button_i()];
		return t;
	};
	_proto._Group2_i = function () {
		var t = new eui.Group();
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.top = 50;
		t.elementsContent = [this._Rect2_i(),this._Image1_i(),this._Image2_i(),this._Image3_i(),this.contentGroup_i()];
		return t;
	};
	_proto._Rect2_i = function () {
		var t = new eui.Rect();
		t.bottom = 16;
		t.fillColor = 0x097993;
		t.top = 16;
		t.width = 480;
		t.x = 11;
		return t;
	};
	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.bottom = 0;
		t.source = "table_box_down";
		t.x = 0;
		return t;
	};
	_proto._Image2_i = function () {
		var t = new eui.Image();
		t.source = "table_box_up";
		t.top = 0;
		t.x = 0;
		return t;
	};
	_proto._Image3_i = function () {
		var t = new eui.Image();
		t.bottom = 93;
		t.source = "table_box_middle";
		t.top = 46;
		t.x = 0;
		return t;
	};
	_proto.contentGroup_i = function () {
		var t = new eui.Group();
		this.contentGroup = t;
		t.bottom = 40;
		t.left = 30;
		t.right = 30;
		t.top = 40;
		return t;
	};
	_proto.closeBtn_i = function () {
		var t = new eui.Button();
		this.closeBtn = t;
		t.x = 452;
		t.y = 28;
		t.skinName = PanelSkin$Skin14;
		return t;
	};
	_proto._Group3_i = function () {
		var t = new eui.Group();
		t.horizontalCenter = 0;
		t.top = 0;
		t.elementsContent = [this._Image4_i(),this.iconDisplay_i()];
		return t;
	};
	_proto._Image4_i = function () {
		var t = new eui.Image();
		t.horizontalCenter = 0;
		t.source = "table_bg";
		t.verticalCenter = 0;
		return t;
	};
	_proto.iconDisplay_i = function () {
		var t = new eui.Image();
		this.iconDisplay = t;
		t.horizontalCenter = 0;
		t.source = "table_activity";
		t.verticalCenter = 0;
		return t;
	};
	_proto.button_i = function () {
		var t = new eui.Image();
		this.button = t;
		t.horizontalCenter = 0;
		t.y = 552;
		return t;
	};
	return PanelSkin;
})(eui.Skin);generateEUI.paths['resource/skins/PlayerRankingSkin.exml'] = window.Player = (function (_super) {
	__extends(Player, _super);
	function Player() {
		_super.call(this);
		this.skinParts = ["player_name","kill_count"];
		
		this.height = 60;
		this.width = 250;
		this.elementsContent = [this.player_name_i(),this.kill_count_i()];
	}
	var _proto = Player.prototype;

	_proto.player_name_i = function () {
		var t = new eui.Label();
		this.player_name = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.bold = true;
		t.fontFamily = "Verdana";
		t.height = 30;
		t.size = 24;
		t.stroke = 2;
		t.strokeColor = 0x351B0E;
		t.text = "Label";
		t.textAlign = "center";
		t.textColor = 0x50FF58;
		t.verticalAlign = "middle";
		t.width = 105;
		t.x = 4.5;
		t.y = 15;
		return t;
	};
	_proto.kill_count_i = function () {
		var t = new eui.Label();
		this.kill_count = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.bold = true;
		t.fontFamily = "Verdana";
		t.height = 50;
		t.stroke = 2;
		t.strokeColor = 0x351B0E;
		t.text = "Label";
		t.textAlign = "center";
		t.textColor = 0xffa72a;
		t.verticalAlign = "middle";
		t.width = 105;
		t.x = 141;
		t.y = 5;
		return t;
	};
	return Player;
})(eui.Skin);generateEUI.paths['resource/skins/RankListItemSkin.exml'] = window.RankListItemSkin = (function (_super) {
	__extends(RankListItemSkin, _super);
	function RankListItemSkin() {
		_super.call(this);
		this.skinParts = ["rankLabel","unameLabel","medalLabel"];
		
		this.height = 45;
		this.width = 326;
		this.elementsContent = [this.rankLabel_i(),this.unameLabel_i(),this.medalLabel_i()];
	}
	var _proto = RankListItemSkin.prototype;

	_proto.rankLabel_i = function () {
		var t = new eui.Label();
		this.rankLabel = t;
		t.height = 20;
		t.left = 20;
		t.size = 20;
		t.text = "";
		t.textAlign = "center";
		t.top = 12;
		t.width = 75;
		return t;
	};
	_proto.unameLabel_i = function () {
		var t = new eui.Label();
		this.unameLabel = t;
		t.anchorOffsetX = 0;
		t.height = 20;
		t.horizontalCenter = 0.5;
		t.size = 20;
		t.text = "";
		t.textAlign = "center";
		t.verticalCenter = -0.5;
		t.width = 107;
		return t;
	};
	_proto.medalLabel_i = function () {
		var t = new eui.Label();
		this.medalLabel = t;
		t.height = 20;
		t.right = 15;
		t.size = 20;
		t.text = "";
		t.textAlign = "center";
		t.top = 12;
		t.width = 85;
		return t;
	};
	return RankListItemSkin;
})(eui.Skin);generateEUI.paths['resource/skins/RpgGameBackSkin.exml'] = window.RpgGameBackSkin = (function (_super) {
	__extends(RpgGameBackSkin, _super);
	var RpgGameBackSkin$Skin15 = 	(function (_super) {
		__extends(RpgGameBackSkin$Skin15, _super);
		function RpgGameBackSkin$Skin15() {
			_super.call(this);
			this.skinParts = ["labelDisplay"];
			
			this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
			this.states = [
				new eui.State ("up",
					[
					])
				,
				new eui.State ("down",
					[
					])
				,
				new eui.State ("disabled",
					[
					])
			];
		}
		var _proto = RpgGameBackSkin$Skin15.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			t.percentHeight = 100;
			t.source = "rgpbackicon_png";
			t.percentWidth = 100;
			return t;
		};
		_proto.labelDisplay_i = function () {
			var t = new eui.Label();
			this.labelDisplay = t;
			t.horizontalCenter = 0;
			t.verticalCenter = 0;
			return t;
		};
		return RpgGameBackSkin$Skin15;
	})(eui.Skin);

	function RpgGameBackSkin() {
		_super.call(this);
		this.skinParts = ["backBtn"];
		
		this.height = 97;
		this.width = 120;
		this.elementsContent = [this.backBtn_i()];
	}
	var _proto = RpgGameBackSkin.prototype;

	_proto.backBtn_i = function () {
		var t = new eui.Button();
		this.backBtn = t;
		t.label = "";
		t.x = 16.5;
		t.y = 10.5;
		t.skinName = RpgGameBackSkin$Skin15;
		return t;
	};
	return RpgGameBackSkin;
})(eui.Skin);generateEUI.paths['resource/skins/RpgGameListViewSkin.exml'] = window.RpgGameListViewSkin = (function (_super) {
	__extends(RpgGameListViewSkin, _super);
	var RpgGameListViewSkin$Skin16 = 	(function (_super) {
		__extends(RpgGameListViewSkin$Skin16, _super);
		function RpgGameListViewSkin$Skin16() {
			_super.call(this);
			this.skinParts = ["labelDisplay"];
			
			this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
			this.states = [
				new eui.State ("up",
					[
					])
				,
				new eui.State ("down",
					[
					])
				,
				new eui.State ("disabled",
					[
					])
			];
		}
		var _proto = RpgGameListViewSkin$Skin16.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			t.percentHeight = 100;
			t.source = "trigonicon_png";
			t.percentWidth = 100;
			return t;
		};
		_proto.labelDisplay_i = function () {
			var t = new eui.Label();
			this.labelDisplay = t;
			t.horizontalCenter = 0;
			t.verticalCenter = 0;
			return t;
		};
		return RpgGameListViewSkin$Skin16;
	})(eui.Skin);

	function RpgGameListViewSkin() {
		_super.call(this);
		this.skinParts = ["bgimg","listRankings","scrListRankings","actionBtn"];
		
		this.height = 300;
		this.width = 400;
		this.elementsContent = [this.bgimg_i(),this.scrListRankings_i(),this.actionBtn_i()];
	}
	var _proto = RpgGameListViewSkin.prototype;

	_proto.bgimg_i = function () {
		var t = new eui.Image();
		this.bgimg = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.fillMode = "scale";
		t.height = 350;
		t.source = "scorelistBg_png";
		t.width = 398;
		t.x = 50;
		t.y = -40;
		return t;
	};
	_proto.scrListRankings_i = function () {
		var t = new eui.Scroller();
		this.scrListRankings = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 235;
		t.width = 348;
		t.x = 60;
		t.y = 50;
		t.viewport = this.listRankings_i();
		return t;
	};
	_proto.listRankings_i = function () {
		var t = new eui.List();
		this.listRankings = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.percentHeight = 100;
		t.percentWidth = 100;
		t.x = 16;
		t.y = -81;
		return t;
	};
	_proto.actionBtn_i = function () {
		var t = new eui.Button();
		this.actionBtn = t;
		t.anchorOffsetX = 24;
		t.anchorOffsetY = 30;
		t.label = "";
		t.x = 40;
		t.y = 60;
		t.skinName = RpgGameListViewSkin$Skin16;
		return t;
	};
	return RpgGameListViewSkin;
})(eui.Skin);generateEUI.paths['resource/skins/RpgGameQuitAlertViewSkin.exml'] = window.RpgGameQuitAlertViewSkin = (function (_super) {
	__extends(RpgGameQuitAlertViewSkin, _super);
	var RpgGameQuitAlertViewSkin$Skin17 = 	(function (_super) {
		__extends(RpgGameQuitAlertViewSkin$Skin17, _super);
		function RpgGameQuitAlertViewSkin$Skin17() {
			_super.call(this);
			this.skinParts = ["labelDisplay"];
			
			this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
			this.states = [
				new eui.State ("up",
					[
					])
				,
				new eui.State ("down",
					[
						new eui.SetProperty("_Image1","source","gongame_icon_png")
					])
				,
				new eui.State ("disabled",
					[
					])
			];
		}
		var _proto = RpgGameQuitAlertViewSkin$Skin17.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			this._Image1 = t;
			t.percentHeight = 100;
			t.source = "gongame_icon_png";
			t.percentWidth = 100;
			return t;
		};
		_proto.labelDisplay_i = function () {
			var t = new eui.Label();
			this.labelDisplay = t;
			t.horizontalCenter = 0;
			t.verticalCenter = 0;
			return t;
		};
		return RpgGameQuitAlertViewSkin$Skin17;
	})(eui.Skin);

	var RpgGameQuitAlertViewSkin$Skin18 = 	(function (_super) {
		__extends(RpgGameQuitAlertViewSkin$Skin18, _super);
		function RpgGameQuitAlertViewSkin$Skin18() {
			_super.call(this);
			this.skinParts = ["labelDisplay"];
			
			this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
			this.states = [
				new eui.State ("up",
					[
					])
				,
				new eui.State ("down",
					[
						new eui.SetProperty("_Image1","source","exit_game_icon_png")
					])
				,
				new eui.State ("disabled",
					[
					])
			];
		}
		var _proto = RpgGameQuitAlertViewSkin$Skin18.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			this._Image1 = t;
			t.percentHeight = 100;
			t.source = "exit_game_icon_png";
			t.percentWidth = 100;
			return t;
		};
		_proto.labelDisplay_i = function () {
			var t = new eui.Label();
			this.labelDisplay = t;
			t.horizontalCenter = 0;
			t.verticalCenter = 0;
			return t;
		};
		return RpgGameQuitAlertViewSkin$Skin18;
	})(eui.Skin);

	function RpgGameQuitAlertViewSkin() {
		_super.call(this);
		this.skinParts = ["goOnBtn","quitBtn"];
		
		this.height = 750;
		this.width = 1334;
		this.elementsContent = [this._Image1_i(),this._Image2_i(),this._Label1_i(),this._Label2_i(),this.goOnBtn_i(),this.quitBtn_i()];
	}
	var _proto = RpgGameQuitAlertViewSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.percentHeight = 100;
		t.source = "ads_reward_texture_json.blackBg_over_view";
		t.percentWidth = 100;
		t.x = 0;
		t.y = 0;
		return t;
	};
	_proto._Image2_i = function () {
		var t = new eui.Image();
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 591;
		t.source = "home_rank_png";
		t.width = 564;
		t.x = 407;
		t.y = 66;
		return t;
	};
	_proto._Label1_i = function () {
		var t = new eui.Label();
		t.bold = true;
		t.fontFamily = "Tahoma";
		t.size = 30;
		t.text = "是否退出";
		t.textAlign = "center";
		t.textColor = 0xefd7d7;
		t.x = 625;
		t.y = 114;
		return t;
	};
	_proto._Label2_i = function () {
		var t = new eui.Label();
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.fontFamily = "Tahoma";
		t.height = 61;
		t.size = 25;
		t.text = "中途退出遊戲將無法獲得獎勵，是否退出?";
		t.textAlign = "center";
		t.textColor = 0xedd7d7;
		t.width = 299;
		t.x = 539.5;
		t.y = 300.5;
		return t;
	};
	_proto.goOnBtn_i = function () {
		var t = new eui.Button();
		this.goOnBtn = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 100;
		t.label = "";
		t.width = 215;
		t.x = 467;
		t.y = 500;
		t.skinName = RpgGameQuitAlertViewSkin$Skin17;
		return t;
	};
	_proto.quitBtn_i = function () {
		var t = new eui.Button();
		this.quitBtn = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 100;
		t.label = "";
		t.width = 215;
		t.x = 694;
		t.y = 500;
		t.skinName = RpgGameQuitAlertViewSkin$Skin18;
		return t;
	};
	return RpgGameQuitAlertViewSkin;
})(eui.Skin);generateEUI.paths['resource/skins/SaleItemSkin.exml'] = window.SaleItemSkin = (function (_super) {
	__extends(SaleItemSkin, _super);
	function SaleItemSkin() {
		_super.call(this);
		this.skinParts = ["titleDisplay","iconDisplay","priceDisplay","timeDisplay"];
		
		this.elementsContent = [this._Image1_i(),this._Group1_i(),this.iconDisplay_i(),this._Image2_i(),this.priceDisplay_i(),this._Image3_i(),this.timeDisplay_i()];
	}
	var _proto = SaleItemSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.source = "card_bg";
		return t;
	};
	_proto._Group1_i = function () {
		var t = new eui.Group();
		t.height = 34;
		t.width = 137;
		t.x = 22;
		t.y = 12;
		t.elementsContent = [this.titleDisplay_i()];
		return t;
	};
	_proto.titleDisplay_i = function () {
		var t = new eui.Label();
		this.titleDisplay = t;
		t.bold = true;
		t.horizontalCenter = 0;
		t.size = 21;
		t.text = "普通化肥";
		t.textColor = 16777215;
		t.verticalCenter = 0;
		return t;
	};
	_proto.iconDisplay_i = function () {
		var t = new eui.Image();
		this.iconDisplay = t;
		t.horizontalCenter = 0;
		t.source = "icon_fertilizer02";
		t.verticalCenter = 5;
		return t;
	};
	_proto._Image2_i = function () {
		var t = new eui.Image();
		t.scaleX = 0.5;
		t.scaleY = 0.5;
		t.source = "icon_diamond";
		t.width = 60;
		t.x = 123;
		t.y = 56;
		return t;
	};
	_proto.priceDisplay_i = function () {
		var t = new eui.Label();
		this.priceDisplay = t;
		t.bold = true;
		t.size = 20;
		t.text = "3";
		t.textColor = 3710089;
		t.x = 151;
		t.y = 57;
		return t;
	};
	_proto._Image3_i = function () {
		var t = new eui.Image();
		t.source = "icon_02";
		t.x = 8;
		t.y = 134;
		return t;
	};
	_proto.timeDisplay_i = function () {
		var t = new eui.Label();
		this.timeDisplay = t;
		t.bold = true;
		t.size = 20;
		t.text = "-10分钟";
		t.textColor = 3710089;
		t.x = 47;
		t.y = 144;
		return t;
	};
	return SaleItemSkin;
})(eui.Skin);generateEUI.paths['resource/skins/SettlementView.exml'] = window.NewFile = (function (_super) {
	__extends(NewFile, _super);
	var NewFile$Skin19 = 	(function (_super) {
		__extends(NewFile$Skin19, _super);
		function NewFile$Skin19() {
			_super.call(this);
			this.skinParts = ["labelDisplay"];
			
			this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
			this.states = [
				new eui.State ("up",
					[
					])
				,
				new eui.State ("down",
					[
						new eui.SetProperty("_Image1","source","settlement_view_atlas_json.settlement_back_btn2")
					])
				,
				new eui.State ("disabled",
					[
					])
			];
		}
		var _proto = NewFile$Skin19.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			this._Image1 = t;
			t.percentHeight = 100;
			t.source = "settlement_view_atlas_json.settlement_back_btn1";
			t.percentWidth = 100;
			return t;
		};
		_proto.labelDisplay_i = function () {
			var t = new eui.Label();
			this.labelDisplay = t;
			t.horizontalCenter = 0;
			t.verticalCenter = 0;
			return t;
		};
		return NewFile$Skin19;
	})(eui.Skin);

	var NewFile$Skin20 = 	(function (_super) {
		__extends(NewFile$Skin20, _super);
		function NewFile$Skin20() {
			_super.call(this);
			this.skinParts = ["labelDisplay"];
			
			this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
			this.states = [
				new eui.State ("up",
					[
					])
				,
				new eui.State ("down",
					[
						new eui.SetProperty("_Image1","source","settlement_view_atlas_json.settlement_again_btn2")
					])
				,
				new eui.State ("disabled",
					[
					])
			];
		}
		var _proto = NewFile$Skin20.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			this._Image1 = t;
			t.percentHeight = 100;
			t.source = "settlement_view_atlas_json.settlement_again_btn1";
			t.percentWidth = 100;
			return t;
		};
		_proto.labelDisplay_i = function () {
			var t = new eui.Label();
			this.labelDisplay = t;
			t.horizontalCenter = 0;
			t.verticalCenter = 0;
			return t;
		};
		return NewFile$Skin20;
	})(eui.Skin);

	function NewFile() {
		_super.call(this);
		this.skinParts = ["heroimage","modelNameIcon","_return","_replay","gemText","trophyText","_killCount","player_name"];
		
		this.height = 750;
		this.width = 1334;
		this.elementsContent = [this._Image1_i(),this.heroimage_i(),this._Image2_i(),this._Image3_i(),this._Image4_i(),this.modelNameIcon_i(),this._Image5_i(),this._Image6_i(),this._Image7_i(),this._Image8_i(),this._return_i(),this._replay_i(),this.gemText_i(),this.trophyText_i(),this._killCount_i(),this._Image9_i(),this.player_name_i(),this._Image10_i()];
	}
	var _proto = NewFile.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.bottom = -1;
		t.left = 0;
		t.right = 0;
		t.source = "home_background_jpg";
		t.top = 1;
		return t;
	};
	_proto.heroimage_i = function () {
		var t = new eui.Image();
		this.heroimage = t;
		t.horizontalCenter = 17;
		t.source = "settlment_hero_20006_png";
		t.y = -20;
		return t;
	};
	_proto._Image2_i = function () {
		var t = new eui.Image();
		t.left = 4;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "settlement_view_atlas_json.settlement_hero_name_bg";
		t.top = 31;
		t.width = 220;
		return t;
	};
	_proto._Image3_i = function () {
		var t = new eui.Image();
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.bottom = 292;
		t.height = 79;
		t.right = 43;
		t.source = "settlement_reward_bg";
		t.width = 355;
		return t;
	};
	_proto._Image4_i = function () {
		var t = new eui.Image();
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.bottom = 390;
		t.height = 79;
		t.right = 43;
		t.source = "settlement_reward_bg";
		t.width = 355;
		return t;
	};
	_proto.modelNameIcon_i = function () {
		var t = new eui.Image();
		this.modelNameIcon = t;
		t.left = 71;
		t.source = "settlement_view_atlas_json.hero_name_20006";
		t.top = 212;
		return t;
	};
	_proto._Image5_i = function () {
		var t = new eui.Image();
		t.bottom = 400;
		t.height = 60;
		t.right = 303;
		t.source = "home_gemstone_png";
		t.width = 60;
		return t;
	};
	_proto._Image6_i = function () {
		var t = new eui.Image();
		t.bottom = 303;
		t.height = 60;
		t.right = 303;
		t.source = "home_emblem_png";
		t.width = 60;
		return t;
	};
	_proto._Image7_i = function () {
		var t = new eui.Image();
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.bottom = 197;
		t.height = 69;
		t.right = 42;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "settlement_view_atlas_json.kill_bg";
		t.width = 354;
		return t;
	};
	_proto._Image8_i = function () {
		var t = new eui.Image();
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.bottom = 199;
		t.height = 65;
		t.right = 44;
		t.source = "settlement_view_atlas_json.kill";
		t.width = 102;
		return t;
	};
	_proto._return_i = function () {
		var t = new eui.Button();
		this._return = t;
		t.bottom = 21;
		t.height = 109;
		t.horizontalCenter = -101;
		t.label = "";
		t.width = 242;
		t.skinName = NewFile$Skin19;
		return t;
	};
	_proto._replay_i = function () {
		var t = new eui.Button();
		this._replay = t;
		t.bottom = 21;
		t.height = 109;
		t.horizontalCenter = 154;
		t.label = "";
		t.width = 242;
		t.skinName = NewFile$Skin20;
		return t;
	};
	_proto.gemText_i = function () {
		var t = new eui.Label();
		this.gemText = t;
		t.anchorOffsetX = 0;
		t.bold = true;
		t.bottom = 412;
		t.height = 36;
		t.right = 163;
		t.size = 35;
		t.text = "1";
		t.textAlign = "center";
		t.textColor = 0xeddaad;
		t.verticalAlign = "middle";
		t.width = 110;
		return t;
	};
	_proto.trophyText_i = function () {
		var t = new eui.Label();
		this.trophyText = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.bold = true;
		t.bottom = 315;
		t.height = 36;
		t.right = 163;
		t.size = 35;
		t.text = "1";
		t.textAlign = "center";
		t.textColor = 0xeddaad;
		t.verticalAlign = "middle";
		t.width = 110;
		return t;
	};
	_proto._killCount_i = function () {
		var t = new eui.Label();
		this._killCount = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.bold = true;
		t.bottom = 215;
		t.height = 40;
		t.right = 163;
		t.size = 35;
		t.stroke = 1;
		t.strokeColor = 0x351b0e;
		t.text = "1";
		t.textAlign = "center";
		t.textColor = 0xeddaad;
		t.verticalAlign = "middle";
		t.width = 110;
		return t;
	};
	_proto._Image9_i = function () {
		var t = new eui.Image();
		t.horizontalCenter = 5.5;
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "settlement_view_atlas_json.settlement_name_bg";
		t.y = 43;
		return t;
	};
	_proto.player_name_i = function () {
		var t = new eui.Label();
		this.player_name = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.bold = true;
		t.height = 52;
		t.horizontalCenter = 6;
		t.size = 35;
		t.text = "name";
		t.textAlign = "center";
		t.textColor = 0xfef4de;
		t.top = 48;
		t.verticalAlign = "middle";
		t.width = 256;
		return t;
	};
	_proto._Image10_i = function () {
		var t = new eui.Image();
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.bottom = 548;
		t.height = 40;
		t.right = 40;
		t.source = "reward_head_icon_png";
		t.width = 360.82;
		return t;
	};
	return NewFile;
})(eui.Skin);generateEUI.paths['resource/skins/sliderSkin.exml'] = window.sliderSkin = (function (_super) {
	__extends(sliderSkin, _super);
	function sliderSkin() {
		_super.call(this);
		this.skinParts = ["track","thumb"];
		
		this.height = 25;
		this.width = 415;
		this.elementsContent = [this._Image1_i(),this.track_i(),this.thumb_i()];
	}
	var _proto = sliderSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.source = "set_match_views_atlas_json.setting_progress1";
		t.width = 400;
		t.x = 10;
		t.y = 8;
		return t;
	};
	_proto.track_i = function () {
		var t = new eui.Image();
		this.track = t;
		t.source = "set_match_views_atlas_json.setting_progress2";
		t.width = 400;
		t.x = 10;
		t.y = 8;
		return t;
	};
	_proto.thumb_i = function () {
		var t = new eui.Image();
		this.thumb = t;
		t.source = "set_match_views_atlas_json.setting_progress3";
		t.x = 0;
		t.y = -5;
		return t;
	};
	return sliderSkin;
})(eui.Skin);generateEUI.paths['resource/skins/SetViewSkin.exml'] = window.SetSkin = (function (_super) {
	__extends(SetSkin, _super);
	var SetSkin$Skin21 = 	(function (_super) {
		__extends(SetSkin$Skin21, _super);
		function SetSkin$Skin21() {
			_super.call(this);
			this.skinParts = ["labelDisplay"];
			
			this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
			this.states = [
				new eui.State ("up",
					[
					])
				,
				new eui.State ("down",
					[
					])
				,
				new eui.State ("disabled",
					[
					])
			];
		}
		var _proto = SetSkin$Skin21.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			t.percentHeight = 100;
			t.source = "ads_reward_texture_json.blackBg_over_view";
			t.percentWidth = 100;
			return t;
		};
		_proto.labelDisplay_i = function () {
			var t = new eui.Label();
			this.labelDisplay = t;
			t.horizontalCenter = 0;
			t.verticalCenter = 0;
			return t;
		};
		return SetSkin$Skin21;
	})(eui.Skin);

	var SetSkin$Skin22 = 	(function (_super) {
		__extends(SetSkin$Skin22, _super);
		function SetSkin$Skin22() {
			_super.call(this);
			this.skinParts = ["labelDisplay"];
			
			this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
			this.states = [
				new eui.State ("up",
					[
					])
				,
				new eui.State ("down",
					[
					])
				,
				new eui.State ("disabled",
					[
					])
			];
		}
		var _proto = SetSkin$Skin22.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			t.percentHeight = 100;
			t.source = "set_match_views_atlas_json.setting_sure_btn";
			t.percentWidth = 100;
			return t;
		};
		_proto.labelDisplay_i = function () {
			var t = new eui.Label();
			this.labelDisplay = t;
			t.horizontalCenter = 0;
			t.verticalCenter = 0;
			return t;
		};
		return SetSkin$Skin22;
	})(eui.Skin);

	function SetSkin() {
		_super.call(this);
		this.skinParts = ["bg","_click","_MusicSlider","_SoundSliser","content"];
		
		this.height = 750;
		this.width = 1334;
		this.elementsContent = [this.bg_i(),this.content_i()];
	}
	var _proto = SetSkin.prototype;

	_proto.bg_i = function () {
		var t = new eui.Button();
		this.bg = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.bottom = 0;
		t.label = "";
		t.left = 0;
		t.right = 0;
		t.scaleX = 1;
		t.scaleY = 1;
		t.top = 0;
		t.x = 0;
		t.y = 0;
		t.skinName = SetSkin$Skin21;
		return t;
	};
	_proto.content_i = function () {
		var t = new eui.Group();
		this.content = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 384;
		t.horizontalCenter = 0;
		t.verticalCenter = 0;
		t.width = 590;
		t.elementsContent = [this._Image1_i(),this._click_i(),this._MusicSlider_i(),this._SoundSliser_i()];
		return t;
	};
	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.scaleX = 1;
		t.scaleY = 1;
		t.source = "set_match_views_atlas_json.setting_bg";
		t.x = 0;
		t.y = 11;
		return t;
	};
	_proto._click_i = function () {
		var t = new eui.Button();
		this._click = t;
		t.label = "";
		t.scaleX = 1;
		t.scaleY = 1;
		t.x = 209;
		t.y = 295;
		t.skinName = SetSkin$Skin22;
		return t;
	};
	_proto._MusicSlider_i = function () {
		var t = new eui.HSlider();
		this._MusicSlider = t;
		t.height = 20;
		t.maximum = 1;
		t.scaleX = 1;
		t.scaleY = 1;
		t.skinName = "sliderSkin";
		t.value = 0;
		t.width = 400;
		t.x = 135;
		t.y = 137;
		return t;
	};
	_proto._SoundSliser_i = function () {
		var t = new eui.HSlider();
		this._SoundSliser = t;
		t.anchorOffsetX = 0;
		t.height = 20;
		t.maximum = 1;
		t.minimum = 0;
		t.scaleX = 1;
		t.scaleY = 1;
		t.skinName = "sliderSkin";
		t.width = 400;
		t.x = 135;
		t.y = 197;
		return t;
	};
	return SetSkin;
})(eui.Skin);generateEUI.paths['resource/skins/TabBarButtonSkin.exml'] = window.TabBarButtonSkin = (function (_super) {
	__extends(TabBarButtonSkin, _super);
	function TabBarButtonSkin() {
		_super.call(this);
		this.skinParts = ["iconDisplaySelected","iconDisplay"];
		
		this.elementsContent = [];
		this._Image1_i();
		
		this.iconDisplaySelected_i();
		
		this._Image2_i();
		
		this.iconDisplay_i();
		
		this.states = [
			new eui.State ("up",
				[
					new eui.AddItems("_Image1","",0,""),
					new eui.AddItems("iconDisplaySelected","",1,"")
				])
			,
			new eui.State ("down",
				[
					new eui.AddItems("_Image1","",0,""),
					new eui.AddItems("iconDisplaySelected","",1,"")
				])
			,
			new eui.State ("disabled",
				[
					new eui.AddItems("_Image1","",0,""),
					new eui.AddItems("iconDisplaySelected","",1,"")
				])
			,
			new eui.State ("upAndSelected",
				[
					new eui.AddItems("_Image2","",1,""),
					new eui.AddItems("iconDisplay","",1,"")
				])
			,
			new eui.State ("downAndSelected",
				[
					new eui.AddItems("_Image2","",1,""),
					new eui.AddItems("iconDisplay","",1,"")
				])
			,
			new eui.State ("disabledAndSelected",
				[
					new eui.AddItems("_Image2","",1,""),
					new eui.AddItems("iconDisplay","",1,"")
				])
		];
	}
	var _proto = TabBarButtonSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		this._Image1 = t;
		t.source = "tabBar_down";
		t.x = 0;
		t.y = 0;
		return t;
	};
	_proto.iconDisplaySelected_i = function () {
		var t = new eui.Image();
		this.iconDisplaySelected = t;
		t.source = "text_fertilizer01";
		t.x = 18;
		t.y = 7;
		return t;
	};
	_proto._Image2_i = function () {
		var t = new eui.Image();
		this._Image2 = t;
		t.source = "tabBar_selected_down";
		t.x = 0;
		t.y = 0;
		return t;
	};
	_proto.iconDisplay_i = function () {
		var t = new eui.Image();
		this.iconDisplay = t;
		t.source = "text_fertilizer02";
		t.x = 18;
		t.y = 10;
		return t;
	};
	return TabBarButtonSkin;
})(eui.Skin);generateEUI.paths['resource/skins/TabBarSkin.exml'] = window.TabBarSkin = (function (_super) {
	__extends(TabBarSkin, _super);
	function TabBarSkin() {
		_super.call(this);
		this.skinParts = ["tabBar","viewStack"];
		
		this.elementsContent = [this._Group1_i()];
	}
	var _proto = TabBarSkin.prototype;

	_proto._Group1_i = function () {
		var t = new eui.Group();
		t.percentHeight = 100;
		t.percentWidth = 100;
		t.elementsContent = [this.tabBar_i(),this._Image1_i(),this._Scroller1_i()];
		return t;
	};
	_proto.tabBar_i = function () {
		var t = new eui.TabBar();
		this.tabBar = t;
		t.left = 10;
		t.top = 5;
		t.layout = this._HorizontalLayout1_i();
		return t;
	};
	_proto._HorizontalLayout1_i = function () {
		var t = new eui.HorizontalLayout();
		t.gap = 5;
		return t;
	};
	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.source = "sto_table_tittle";
		t.x = 0;
		t.y = 50;
		return t;
	};
	_proto._Scroller1_i = function () {
		var t = new eui.Scroller();
		t.height = 385;
		t.left = 25;
		t.right = 25;
		t.top = 85;
		t.viewport = this.viewStack_i();
		return t;
	};
	_proto.viewStack_i = function () {
		var t = new eui.ViewStack();
		this.viewStack = t;
		return t;
	};
	return TabBarSkin;
})(eui.Skin);generateEUI.paths['resource/skins/TaskItemRendererSkin.exml'] = window.TaskItemRendererSkin = (function (_super) {
	__extends(TaskItemRendererSkin, _super);
	function TaskItemRendererSkin() {
		_super.call(this);
		this.skinParts = ["labelDisplay","iconDisplay","goldDisplay","seedDisplay","progressDisplay"];
		
		this.elementsContent = [this._Image1_i(),this._Group1_i(),this.iconDisplay_i(),this._Image2_i(),this._Image3_i(),this.goldDisplay_i(),this.seedDisplay_i(),this.progressDisplay_i()];
	}
	var _proto = TaskItemRendererSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.source = "task_bg";
		return t;
	};
	_proto._Group1_i = function () {
		var t = new eui.Group();
		t.height = 39;
		t.width = 204;
		t.x = 80;
		t.y = 4;
		t.elementsContent = [this.labelDisplay_i()];
		return t;
	};
	_proto.labelDisplay_i = function () {
		var t = new eui.Label();
		this.labelDisplay = t;
		t.bold = true;
		t.horizontalCenter = 1.5;
		t.size = 21;
		t.text = "标签";
		t.textColor = 5918538;
		t.verticalCenter = 1;
		return t;
	};
	_proto.iconDisplay_i = function () {
		var t = new eui.Image();
		this.iconDisplay = t;
		t.source = "icon_experience";
		t.verticalCenter = 0.5;
		t.x = 13;
		return t;
	};
	_proto._Image2_i = function () {
		var t = new eui.Image();
		t.height = 26;
		t.source = "icon_experience";
		t.verticalCenter = 20.5;
		t.width = 26;
		t.x = 205;
		return t;
	};
	_proto._Image3_i = function () {
		var t = new eui.Image();
		t.height = 25;
		t.source = "icon_gold";
		t.width = 25;
		t.x = 81;
		t.y = 50;
		return t;
	};
	_proto.goldDisplay_i = function () {
		var t = new eui.Label();
		this.goldDisplay = t;
		t.bold = true;
		t.fontFamily = "SimSun";
		t.size = 20;
		t.text = "+100";
		t.textColor = 5918538;
		t.x = 109;
		t.y = 50;
		return t;
	};
	_proto.seedDisplay_i = function () {
		var t = new eui.Label();
		this.seedDisplay = t;
		t.bold = true;
		t.fontFamily = "SimSun";
		t.size = 20;
		t.text = "+100";
		t.textColor = 5918538;
		t.x = 233;
		t.y = 50;
		return t;
	};
	_proto.progressDisplay_i = function () {
		var t = new eui.Label();
		this.progressDisplay = t;
		t.bold = true;
		t.fontFamily = "SimSun";
		t.horizontalCenter = 139;
		t.size = 20;
		t.text = "0/5";
		t.textColor = 5918538;
		t.verticalCenter = 0;
		return t;
	};
	return TaskItemRendererSkin;
})(eui.Skin);