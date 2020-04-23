(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@swim/codec'), require('@swim/structure'), require('@swim/util'), require('@swim/math'), require('@swim/time'), require('@swim/streamlet')) :
    typeof define === 'function' && define.amd ? define(['exports', '@swim/codec', '@swim/structure', '@swim/util', '@swim/math', '@swim/time', '@swim/streamlet'], factory) :
    (global = global || self, factory(global.swim = global.swim || {}, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim));
}(this, function (exports, codec, structure, util, math, time, streamlet) { 'use strict';

    var Angle = (function () {
        function Angle() {
        }
        Angle.prototype.isDefined = function () {
            return this.value() !== 0;
        };
        Angle.prototype.plus = function (that, units) {
            if (units === void 0) { units = this.units(); }
            return Angle.from(this.toValue(units) + Angle.fromAny(that).toValue(units), units);
        };
        Angle.prototype.opposite = function (units) {
            if (units === void 0) { units = this.units(); }
            return Angle.from(-this.toValue(units), units);
        };
        Angle.prototype.minus = function (that, units) {
            if (units === void 0) { units = this.units(); }
            return Angle.from(this.toValue(units) - Angle.fromAny(that).toValue(units), units);
        };
        Angle.prototype.times = function (scalar, units) {
            if (units === void 0) { units = this.units(); }
            return Angle.from(this.toValue(units) * scalar, units);
        };
        Angle.prototype.divide = function (scalar, units) {
            if (units === void 0) { units = this.units(); }
            return Angle.from(this.toValue(units) / scalar, units);
        };
        Angle.prototype.norm = function (total, units) {
            if (units === void 0) { units = this.units(); }
            return Angle.from(this.toValue(units) / Angle.fromAny(total).toValue(units), units);
        };
        Angle.prototype.deg = function () {
            return Angle.deg(this.degValue());
        };
        Angle.prototype.rad = function () {
            return Angle.rad(this.radValue());
        };
        Angle.prototype.grad = function () {
            return Angle.grad(this.gradValue());
        };
        Angle.prototype.turn = function () {
            return Angle.turn(this.turnValue());
        };
        Angle.prototype.toValue = function (units) {
            switch (units) {
                case "deg": return this.degValue();
                case "grad": return this.gradValue();
                case "rad": return this.radValue();
                case "turn": return this.turnValue();
                default: throw new Error("unknown angle units: " + units);
            }
        };
        Angle.prototype.to = function (units) {
            switch (units) {
                case "deg": return this.deg();
                case "grad": return this.grad();
                case "rad": return this.rad();
                case "turn": return this.turn();
                default: throw new Error("unknown angle units: " + units);
            }
        };
        Angle.zero = function (units) {
            if (units === void 0) { units = "rad"; }
            return Angle.from(0, units);
        };
        Angle.deg = function (value) {
            return new Angle.Deg(value);
        };
        Angle.rad = function (value) {
            return new Angle.Rad(value);
        };
        Angle.grad = function (value) {
            return new Angle.Grad(value);
        };
        Angle.turn = function (value) {
            return new Angle.Turn(value);
        };
        Angle.from = function (value, units) {
            if (units === void 0) { units = "rad"; }
            switch (units) {
                case "deg": return Angle.deg(value);
                case "rad": return Angle.rad(value);
                case "grad": return Angle.grad(value);
                case "turn": return Angle.turn(value);
                default: throw new Error("unknown angle units: " + units);
            }
        };
        Angle.fromAny = function (value, defaultUnits) {
            if (value instanceof Angle) {
                return value;
            }
            else if (typeof value === "number") {
                return Angle.from(value, defaultUnits);
            }
            else if (typeof value === "string") {
                return Angle.parse(value);
            }
            else {
                throw new TypeError("" + value);
            }
        };
        Angle.fromValue = function (value) {
            if (value.length === 2) {
                var num = value.getItem(0).numberValue();
                var units = value.getItem(1);
                if (num !== void 0 && isFinite(num) && units instanceof structure.Attr && units.toValue() === structure.Value.extant()) {
                    switch (units.key.value) {
                        case "deg": return Angle.deg(num);
                        case "rad": return Angle.rad(num);
                        case "grad": return Angle.grad(num);
                        case "turn": return Angle.turn(num);
                        default:
                    }
                }
            }
            return void 0;
        };
        Angle.parse = function (string, defaultUnits) {
            var input = codec.Unicode.stringInput(string);
            while (input.isCont() && codec.Unicode.isWhitespace(input.head())) {
                input = input.step();
            }
            var parser = Angle.Parser.parse(input, defaultUnits);
            if (parser.isDone()) {
                while (input.isCont() && codec.Unicode.isWhitespace(input.head())) {
                    input = input.step();
                }
            }
            if (input.isCont() && !parser.isError()) {
                parser = codec.Parser.error(codec.Diagnostic.unexpected(input));
            }
            return parser.bind();
        };
        Angle.form = function (defaultUnits, unit) {
            if (unit !== void 0) {
                unit = Angle.fromAny(unit);
            }
            if (defaultUnits !== void 0 || unit !== void 0) {
                return new Angle.Form(defaultUnits, unit);
            }
            else {
                if (!Angle._form) {
                    Angle._form = new Angle.Form();
                }
                return Angle._form;
            }
        };
        Angle.PI = Math.PI;
        Angle.TAU = 2 * Angle.PI;
        return Angle;
    }());

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    var DegAngle = (function (_super) {
        __extends(DegAngle, _super);
        function DegAngle(value) {
            var _this = _super.call(this) || this;
            _this._value = value;
            return _this;
        }
        DegAngle.prototype.value = function () {
            return this._value;
        };
        DegAngle.prototype.units = function () {
            return "deg";
        };
        DegAngle.prototype.degValue = function () {
            return this._value;
        };
        DegAngle.prototype.gradValue = function () {
            return this._value * 10 / 9;
        };
        DegAngle.prototype.radValue = function () {
            return this._value * Angle.PI / 180;
        };
        DegAngle.prototype.turnValue = function () {
            return this._value / 360;
        };
        DegAngle.prototype.deg = function () {
            return this;
        };
        DegAngle.prototype.equals = function (that) {
            if (that instanceof DegAngle) {
                return this._value === that._value;
            }
            return false;
        };
        DegAngle.prototype.hashCode = function () {
            if (DegAngle._hashSeed === void 0) {
                DegAngle._hashSeed = util.Murmur3.seed(DegAngle);
            }
            return util.Murmur3.mash(util.Murmur3.mix(DegAngle._hashSeed, util.Murmur3.hash(this._value)));
        };
        DegAngle.prototype.debug = function (output) {
            output = output.write("Angle").write(46).write("deg").write(40)
                .debug(this._value).write(41);
        };
        DegAngle.prototype.toString = function () {
            return this._value + "deg";
        };
        return DegAngle;
    }(Angle));
    Angle.Deg = DegAngle;

    var RadAngle = (function (_super) {
        __extends(RadAngle, _super);
        function RadAngle(value) {
            var _this = _super.call(this) || this;
            _this._value = value;
            return _this;
        }
        RadAngle.prototype.value = function () {
            return this._value;
        };
        RadAngle.prototype.units = function () {
            return "rad";
        };
        RadAngle.prototype.degValue = function () {
            return this._value * 180 / Angle.PI;
        };
        RadAngle.prototype.gradValue = function () {
            return this._value * 200 / Angle.PI;
        };
        RadAngle.prototype.radValue = function () {
            return this._value;
        };
        RadAngle.prototype.turnValue = function () {
            return this._value / Angle.TAU;
        };
        RadAngle.prototype.rad = function () {
            return this;
        };
        RadAngle.prototype.equals = function (that) {
            if (that instanceof RadAngle) {
                return this._value === that._value;
            }
            return false;
        };
        RadAngle.prototype.hashCode = function () {
            if (RadAngle._hashSeed === void 0) {
                RadAngle._hashSeed = util.Murmur3.seed(RadAngle);
            }
            return util.Murmur3.mash(util.Murmur3.mix(RadAngle._hashSeed, util.Murmur3.hash(this._value)));
        };
        RadAngle.prototype.debug = function (output) {
            output = output.write("Angle").write(46).write("rad").write(40)
                .debug(this._value).write(41);
        };
        RadAngle.prototype.toString = function () {
            return this._value + "rad";
        };
        return RadAngle;
    }(Angle));
    Angle.Rad = RadAngle;

    var GradAngle = (function (_super) {
        __extends(GradAngle, _super);
        function GradAngle(value) {
            var _this = _super.call(this) || this;
            _this._value = value;
            return _this;
        }
        GradAngle.prototype.value = function () {
            return this._value;
        };
        GradAngle.prototype.units = function () {
            return "grad";
        };
        GradAngle.prototype.degValue = function () {
            return this._value * 0.9;
        };
        GradAngle.prototype.gradValue = function () {
            return this._value;
        };
        GradAngle.prototype.radValue = function () {
            return this._value * Angle.PI / 200;
        };
        GradAngle.prototype.turnValue = function () {
            return this._value / 400;
        };
        GradAngle.prototype.grad = function () {
            return this;
        };
        GradAngle.prototype.equals = function (that) {
            if (that instanceof GradAngle) {
                return this._value === that._value;
            }
            return false;
        };
        GradAngle.prototype.hashCode = function () {
            if (GradAngle._hashSeed === void 0) {
                GradAngle._hashSeed = util.Murmur3.seed(GradAngle);
            }
            return util.Murmur3.mash(util.Murmur3.mix(GradAngle._hashSeed, util.Murmur3.hash(this._value)));
        };
        GradAngle.prototype.debug = function (output) {
            output = output.write("Angle").write(46).write("grad").write(40)
                .debug(this._value).write(41);
        };
        GradAngle.prototype.toString = function () {
            return this._value + "grad";
        };
        return GradAngle;
    }(Angle));
    Angle.Grad = GradAngle;

    var TurnAngle = (function (_super) {
        __extends(TurnAngle, _super);
        function TurnAngle(value) {
            var _this = _super.call(this) || this;
            _this._value = value;
            return _this;
        }
        TurnAngle.prototype.value = function () {
            return this._value;
        };
        TurnAngle.prototype.units = function () {
            return "turn";
        };
        TurnAngle.prototype.degValue = function () {
            return this._value * 360;
        };
        TurnAngle.prototype.gradValue = function () {
            return this._value * 400;
        };
        TurnAngle.prototype.radValue = function () {
            return this._value * Angle.TAU;
        };
        TurnAngle.prototype.turnValue = function () {
            return this._value;
        };
        TurnAngle.prototype.turn = function () {
            return this;
        };
        TurnAngle.prototype.equals = function (that) {
            if (that instanceof TurnAngle) {
                return this._value === that._value;
            }
            return false;
        };
        TurnAngle.prototype.hashCode = function () {
            if (TurnAngle._hashSeed === void 0) {
                TurnAngle._hashSeed = util.Murmur3.seed(TurnAngle);
            }
            return util.Murmur3.mash(util.Murmur3.mix(TurnAngle._hashSeed, util.Murmur3.hash(this._value)));
        };
        TurnAngle.prototype.debug = function (output) {
            output = output.write("Angle").write(46).write("turn").write(40)
                .debug(this._value).write(41);
        };
        TurnAngle.prototype.toString = function () {
            return this._value + "turn";
        };
        return TurnAngle;
    }(Angle));
    Angle.Turn = TurnAngle;

    var AngleParser = (function (_super) {
        __extends(AngleParser, _super);
        function AngleParser(defaultUnits, valueParser, unitsOutput, step) {
            var _this = _super.call(this) || this;
            _this._defaultUnits = defaultUnits;
            _this._valueParser = valueParser;
            _this._unitsOutput = unitsOutput;
            _this._step = step;
            return _this;
        }
        AngleParser.prototype.feed = function (input) {
            return AngleParser.parse(input, this._defaultUnits, this._valueParser, this._unitsOutput, this._step);
        };
        AngleParser.parse = function (input, defaultUnits, valueParser, unitsOutput, step) {
            if (step === void 0) { step = 1; }
            var c = 0;
            if (step === 1) {
                if (!valueParser) {
                    valueParser = codec.Base10.parseDecimal(input);
                }
                else {
                    valueParser = valueParser.feed(input);
                }
                if (valueParser.isDone()) {
                    step = 2;
                }
                else if (valueParser.isError()) {
                    return valueParser.asError();
                }
            }
            if (step === 2) {
                unitsOutput = unitsOutput || codec.Unicode.stringOutput();
                while (input.isCont() && (c = input.head(), codec.Unicode.isAlpha(c))) {
                    input = input.step();
                    unitsOutput.push(c);
                }
                if (!input.isEmpty()) {
                    var value = valueParser.bind();
                    var units = unitsOutput.bind() || defaultUnits;
                    switch (units) {
                        case "deg": return codec.Parser.done(Angle.deg(value));
                        case "":
                        case "rad": return codec.Parser.done(Angle.rad(value));
                        case "grad": return codec.Parser.done(Angle.grad(value));
                        case "turn": return codec.Parser.done(Angle.turn(value));
                        default: return codec.Parser.error(codec.Diagnostic.message("unknown units: " + units, input));
                    }
                }
            }
            return new AngleParser(defaultUnits, valueParser, unitsOutput, step);
        };
        return AngleParser;
    }(codec.Parser));
    Angle.Parser = AngleParser;

    var AngleForm = (function (_super) {
        __extends(AngleForm, _super);
        function AngleForm(defaultUnits, unit) {
            var _this = _super.call(this) || this;
            _this._defaultUnits = defaultUnits;
            _this._unit = unit;
            return _this;
        }
        AngleForm.prototype.unit = function (unit) {
            if (arguments.length === 0) {
                return this._unit !== void 0 ? this._unit : Angle.zero(this._defaultUnits);
            }
            else {
                return new AngleForm(this._defaultUnits, unit);
            }
        };
        AngleForm.prototype.mold = function (angle) {
            angle = Angle.fromAny(angle, this._defaultUnits);
            return structure.Text.from(angle.toString());
        };
        AngleForm.prototype.cast = function (item) {
            var value = item.toValue();
            var angle;
            try {
                angle = Angle.fromValue(value);
                if (!angle) {
                    var string = value.stringValue(void 0);
                    if (string !== void 0) {
                        angle = Angle.parse(string, this._defaultUnits);
                    }
                }
            }
            catch (e) {
            }
            return angle;
        };
        return AngleForm;
    }(structure.Form));
    Angle.Form = AngleForm;

    var Length = (function () {
        function Length() {
        }
        Length.prototype.isDefined = function () {
            return this.value() !== 0;
        };
        Length.prototype.plus = function (that, units) {
            if (units === void 0) { units = this.units(); }
            return Length.from(this.toValue(units) + Length.fromAny(that).toValue(units), units);
        };
        Length.prototype.opposite = function (units) {
            if (units === void 0) { units = this.units(); }
            return Length.from(-this.toValue(units), units);
        };
        Length.prototype.minus = function (that, units) {
            if (units === void 0) { units = this.units(); }
            return Length.from(this.toValue(units) - Length.fromAny(that).toValue(units), units);
        };
        Length.prototype.times = function (scalar, units) {
            if (units === void 0) { units = this.units(); }
            return Length.from(this.toValue(units) * scalar, units);
        };
        Length.prototype.divide = function (scalar, units) {
            if (units === void 0) { units = this.units(); }
            return Length.from(this.toValue(units) / scalar, units);
        };
        Length.prototype.emValue = function () {
            return this.pxValue() / Length.emUnit(this.node());
        };
        Length.prototype.remValue = function () {
            return this.pxValue() / Length.remUnit();
        };
        Length.prototype.pctValue = function () {
            return this.px().value() / this.unitValue();
        };
        Length.prototype.px = function (unitValue) {
            return Length.px(this.pxValue(unitValue), this.node());
        };
        Length.prototype.em = function () {
            return Length.em(this.emValue(), this.node());
        };
        Length.prototype.rem = function () {
            return Length.rem(this.remValue(), this.node());
        };
        Length.prototype.pct = function () {
            return Length.pct(this.pctValue(), this.node());
        };
        Length.prototype.toValue = function (units) {
            switch (units) {
                case "px": return this.pxValue();
                case "em": return this.emValue();
                case "rem": return this.remValue();
                case "%": return this.pctValue();
                default: throw new Error("unknown length units: " + units);
            }
        };
        Length.prototype.to = function (units) {
            switch (units) {
                case "px": return this.px();
                case "em": return this.em();
                case "rem": return this.rem();
                case "%": return this.pct();
                default: throw new Error("unknown length units: " + units);
            }
        };
        Length.zero = function (units, node) {
            return Length.from(0, units, node);
        };
        Length.px = function (value, node) {
            return new Length.Px(value, node);
        };
        Length.em = function (value, node) {
            return new Length.Em(value, node);
        };
        Length.rem = function (value, node) {
            return new Length.Rem(value, node);
        };
        Length.pct = function (value, node) {
            return new Length.Pct(value, node);
        };
        Length.unitless = function (value, node) {
            return new Length.Unitless(value, node);
        };
        Length.from = function (value, units, node) {
            if (typeof units !== "string") {
                node = units;
                units = "px";
            }
            switch (units) {
                case "px": return Length.px(value, node);
                case "em": return Length.em(value, node);
                case "rem": return Length.rem(value, node);
                case "%": return Length.pct(value, node);
                case "": return Length.unitless(value, node);
                default: throw new Error("unknown length units: " + units);
            }
        };
        Length.fromAny = function (value, defaultUnits, node) {
            if (typeof defaultUnits !== "string") {
                node = defaultUnits;
                defaultUnits = void 0;
            }
            if (value instanceof Length) {
                return value;
            }
            else if (typeof value === "number") {
                return Length.from(value, defaultUnits, node);
            }
            else if (typeof value === "string" && typeof defaultUnits !== "string") {
                return Length.parse(value, defaultUnits, node);
            }
            else {
                throw new TypeError("" + value);
            }
        };
        Length.fromValue = function (value, node) {
            if (value.length === 2) {
                var num = value.getItem(0).numberValue(void 0);
                var units = value.getItem(1);
                if (num !== void 0 && isFinite(num) && units instanceof structure.Attr && units.toValue() === structure.Value.extant()) {
                    switch (units.key.value) {
                        case "px": return Length.px(num, node);
                        case "em": return Length.em(num, node);
                        case "rem": return Length.rem(num, node);
                        case "pct": return Length.pct(num, node);
                        default:
                    }
                }
            }
            return void 0;
        };
        Length.parse = function (string, defaultUnits, node) {
            if (typeof defaultUnits !== "string") {
                node = defaultUnits;
                defaultUnits = void 0;
            }
            var input = codec.Unicode.stringInput(string);
            while (input.isCont() && codec.Unicode.isWhitespace(input.head())) {
                input = input.step();
            }
            var parser = Length.Parser.parse(input, defaultUnits, node);
            if (parser.isDone()) {
                while (input.isCont() && codec.Unicode.isWhitespace(input.head())) {
                    input = input.step();
                }
            }
            if (input.isCont() && !parser.isError()) {
                parser = codec.Parser.error(codec.Diagnostic.unexpected(input));
            }
            return parser.bind();
        };
        Length.form = function (defaultUnits, node, unit) {
            if (unit !== void 0) {
                unit = Length.fromAny(unit);
            }
            if (defaultUnits !== void 0 || node || unit !== void 0) {
                return new Length.Form(defaultUnits, node, unit);
            }
            else {
                if (!Length._form) {
                    Length._form = new Length.Form();
                }
                return Length._form;
            }
        };
        Length.widthUnit = function (node) {
            while (node) {
                if (node instanceof HTMLElement && node.offsetParent instanceof HTMLElement) {
                    return node.offsetParent.offsetWidth;
                }
                node = node.parentNode || void 0;
            }
            return 0;
        };
        Length.emUnit = function (node) {
            while (node) {
                if (node instanceof Element) {
                    var fontSize = getComputedStyle(node).fontSize;
                    if (fontSize !== null) {
                        return parseFloat(fontSize);
                    }
                }
                node = node.parentNode || void 0;
            }
            return 0;
        };
        Length.remUnit = function () {
            var fontSize = getComputedStyle(document.documentElement).fontSize;
            if (fontSize !== null) {
                return parseFloat(fontSize);
            }
            return 0;
        };
        return Length;
    }());

    var PxLength = (function (_super) {
        __extends(PxLength, _super);
        function PxLength(value, node) {
            var _this = _super.call(this) || this;
            _this._value = value;
            _this._node = node;
            return _this;
        }
        PxLength.prototype.value = function () {
            return this._value;
        };
        PxLength.prototype.units = function () {
            return "px";
        };
        PxLength.prototype.unitValue = function () {
            return 1;
        };
        PxLength.prototype.node = function () {
            return this._node;
        };
        PxLength.prototype.pxValue = function () {
            return this._value;
        };
        PxLength.prototype.px = function () {
            return this;
        };
        PxLength.prototype.equals = function (that) {
            if (that instanceof PxLength) {
                return this._value === that._value && this._node === that._node;
            }
            return false;
        };
        PxLength.prototype.hashCode = function () {
            if (PxLength._hashSeed === void 0) {
                PxLength._hashSeed = util.Murmur3.seed(PxLength);
            }
            return util.Murmur3.mash(util.Murmur3.mix(PxLength._hashSeed, util.Murmur3.hash(this._value)));
        };
        PxLength.prototype.debug = function (output) {
            output = output.write("Length").write(46).write("px").write(40).debug(this._value);
            if (this._node) {
                output = output.write(", ").debug(this._node);
            }
            output = output.write(41);
        };
        PxLength.prototype.toString = function () {
            return this._value + "px";
        };
        return PxLength;
    }(Length));
    Length.Px = PxLength;

    var EmLength = (function (_super) {
        __extends(EmLength, _super);
        function EmLength(value, node) {
            var _this = _super.call(this) || this;
            _this._value = value;
            _this._node = node;
            return _this;
        }
        EmLength.prototype.value = function () {
            return this._value;
        };
        EmLength.prototype.units = function () {
            return "em";
        };
        EmLength.prototype.node = function () {
            return this._node;
        };
        EmLength.prototype.unitValue = function () {
            return Length.emUnit(this._node);
        };
        EmLength.prototype.pxValue = function () {
            return this.unitValue() * this._value;
        };
        EmLength.prototype.em = function () {
            return this;
        };
        EmLength.prototype.equals = function (that) {
            if (that instanceof EmLength) {
                return this._value === that._value && this._node === that._node;
            }
            return false;
        };
        EmLength.prototype.hashCode = function () {
            if (EmLength._hashSeed === void 0) {
                EmLength._hashSeed = util.Murmur3.seed(EmLength);
            }
            return util.Murmur3.mash(util.Murmur3.mix(EmLength._hashSeed, util.Murmur3.hash(this._value)));
        };
        EmLength.prototype.debug = function (output) {
            output = output.write("Length").write(46).write("em").write(40).debug(this._value);
            if (this._node) {
                output = output.write(", ").debug(this._node);
            }
            output = output.write(41);
        };
        EmLength.prototype.toString = function () {
            return this._value + "em";
        };
        return EmLength;
    }(Length));
    Length.Em = EmLength;

    var RemLength = (function (_super) {
        __extends(RemLength, _super);
        function RemLength(value, node) {
            var _this = _super.call(this) || this;
            _this._value = value;
            _this._node = node;
            return _this;
        }
        RemLength.prototype.value = function () {
            return this._value;
        };
        RemLength.prototype.units = function () {
            return "rem";
        };
        RemLength.prototype.node = function () {
            return this._node;
        };
        RemLength.prototype.unitValue = function () {
            return Length.remUnit();
        };
        RemLength.prototype.pxValue = function () {
            return this.unitValue() * this._value;
        };
        RemLength.prototype.rem = function () {
            return this;
        };
        RemLength.prototype.equals = function (that) {
            if (that instanceof RemLength) {
                return this._value === that._value && this._node === that._node;
            }
            return false;
        };
        RemLength.prototype.hashCode = function () {
            if (RemLength._hashSeed === void 0) {
                RemLength._hashSeed = util.Murmur3.seed(RemLength);
            }
            return util.Murmur3.mash(util.Murmur3.mix(RemLength._hashSeed, util.Murmur3.hash(this._value)));
        };
        RemLength.prototype.debug = function (output) {
            output = output.write("Length").write(46).write("rem").write(40).debug(this._value);
            if (this._node) {
                output = output.write(", ").debug(this._node);
            }
            output = output.write(41);
        };
        RemLength.prototype.toString = function () {
            return this._value + "rem";
        };
        return RemLength;
    }(Length));
    Length.Rem = RemLength;

    var PctLength = (function (_super) {
        __extends(PctLength, _super);
        function PctLength(value, node) {
            var _this = _super.call(this) || this;
            _this._value = value;
            _this._node = node;
            return _this;
        }
        PctLength.prototype.value = function () {
            return this._value;
        };
        PctLength.prototype.units = function () {
            return "%";
        };
        PctLength.prototype.node = function () {
            return this._node;
        };
        PctLength.prototype.unitValue = function () {
            return Length.widthUnit(this._node);
        };
        PctLength.prototype.pxValue = function (unitValue) {
            if (unitValue === void 0) { unitValue = this.unitValue(); }
            return unitValue * this._value / 100;
        };
        PctLength.prototype.pct = function () {
            return this;
        };
        PctLength.prototype.equals = function (that) {
            if (that instanceof PctLength) {
                return this._value === that._value && this._node === that._node;
            }
            return false;
        };
        PctLength.prototype.hashCode = function () {
            if (PctLength._hashSeed === void 0) {
                PctLength._hashSeed = util.Murmur3.seed(PctLength);
            }
            return util.Murmur3.mash(util.Murmur3.mix(PctLength._hashSeed, util.Murmur3.hash(this._value)));
        };
        PctLength.prototype.debug = function (output) {
            output = output.write("Length").write(46).write("pct").write(40).debug(this._value);
            if (this._node) {
                output = output.write(", ").debug(this._node);
            }
            output = output.write(41);
        };
        PctLength.prototype.toString = function () {
            return this._value + "%";
        };
        return PctLength;
    }(Length));
    Length.Pct = PctLength;

    var UnitlessLength = (function (_super) {
        __extends(UnitlessLength, _super);
        function UnitlessLength(value, node) {
            var _this = _super.call(this) || this;
            _this._value = value;
            _this._node = node;
            return _this;
        }
        UnitlessLength.prototype.value = function () {
            return this._value;
        };
        UnitlessLength.prototype.units = function () {
            return "";
        };
        UnitlessLength.prototype.unitValue = function () {
            return 0;
        };
        UnitlessLength.prototype.node = function () {
            return this._node;
        };
        UnitlessLength.prototype.pxValue = function () {
            return this._value;
        };
        UnitlessLength.prototype.equals = function (that) {
            if (that instanceof UnitlessLength) {
                return this._value === that._value && this._node === that._node;
            }
            return false;
        };
        UnitlessLength.prototype.hashCode = function () {
            if (UnitlessLength._hashSeed === void 0) {
                UnitlessLength._hashSeed = util.Murmur3.seed(UnitlessLength);
            }
            return util.Murmur3.mash(util.Murmur3.mix(UnitlessLength._hashSeed, util.Murmur3.hash(this._value)));
        };
        UnitlessLength.prototype.debug = function (output) {
            output = output.write("Length").write(46).write("unitless").write(40).debug(this._value);
            if (this._node) {
                output = output.write(", ").debug(this._node);
            }
            output = output.write(41);
        };
        UnitlessLength.prototype.toString = function () {
            return this._value + "";
        };
        return UnitlessLength;
    }(Length));
    Length.Unitless = UnitlessLength;

    var LengthParser = (function (_super) {
        __extends(LengthParser, _super);
        function LengthParser(defaultUnits, node, valueParser, unitsOutput, step) {
            var _this = _super.call(this) || this;
            _this._defaultUnits = defaultUnits;
            _this._node = node;
            _this._valueParser = valueParser;
            _this._unitsOutput = unitsOutput;
            _this._step = step;
            return _this;
        }
        LengthParser.prototype.feed = function (input) {
            return LengthParser.parse(input, this._defaultUnits, this._node, this._valueParser, this._unitsOutput, this._step);
        };
        LengthParser.parse = function (input, defaultUnits, node, valueParser, unitsOutput, step) {
            if (step === void 0) { step = 1; }
            var c = 0;
            if (step === 1) {
                if (!valueParser) {
                    valueParser = codec.Base10.parseDecimal(input);
                }
                else {
                    valueParser = valueParser.feed(input);
                }
                if (valueParser.isDone()) {
                    step = 2;
                }
                else if (valueParser.isError()) {
                    return valueParser.asError();
                }
            }
            if (step === 2) {
                unitsOutput = unitsOutput || codec.Unicode.stringOutput();
                while (input.isCont() && (c = input.head(), codec.Unicode.isAlpha(c) || c === 37)) {
                    input = input.step();
                    unitsOutput.push(c);
                }
                if (!input.isEmpty()) {
                    var value = valueParser.bind();
                    var units = unitsOutput.bind() || defaultUnits;
                    switch (units) {
                        case "px": return codec.Parser.done(Length.px(value, node));
                        case "em": return codec.Parser.done(Length.em(value, node));
                        case "rem": return codec.Parser.done(Length.rem(value, node));
                        case "%": return codec.Parser.done(Length.pct(value, node));
                        case "":
                        case void 0: return codec.Parser.done(Length.unitless(value, node));
                        default: return codec.Parser.error(codec.Diagnostic.message("unknown units: " + units, input));
                    }
                }
            }
            return new LengthParser(defaultUnits, node, valueParser, unitsOutput, step);
        };
        return LengthParser;
    }(codec.Parser));
    Length.Parser = LengthParser;

    var LengthForm = (function (_super) {
        __extends(LengthForm, _super);
        function LengthForm(defaultUnits, node, unit) {
            var _this = _super.call(this) || this;
            _this._defaultUnits = defaultUnits;
            _this._node = node;
            _this._unit = unit;
            return _this;
        }
        LengthForm.prototype.unit = function (unit) {
            if (arguments.length === 0) {
                return this._unit !== void 0 ? this._unit : Length.zero(this._defaultUnits, this._node);
            }
            else {
                return new LengthForm(this._defaultUnits, this._node, unit);
            }
        };
        LengthForm.prototype.mold = function (length) {
            length = Length.fromAny(length, this._defaultUnits);
            return structure.Text.from(length.toString());
        };
        LengthForm.prototype.cast = function (item) {
            var value = item.toValue();
            var length;
            try {
                length = Length.fromValue(value, this._node);
                if (!length) {
                    var string = value.stringValue(void 0);
                    if (string !== void 0) {
                        length = Length.parse(string, this._defaultUnits, this._node);
                    }
                }
            }
            catch (e) {
            }
            return length;
        };
        return LengthForm;
    }(structure.Form));
    Length.Form = LengthForm;

    var DARKER = 0.7;
    var BRIGHTER = 1 / DARKER;
    var Color = (function () {
        function Color() {
        }
        Color.prototype.contrast = function (k) {
            return this.lightness() < 0.67 ? this.brighter(k) : this.darker(k);
        };
        Color.transparent = function (alpha) {
            return Color.Rgb.transparent(alpha);
        };
        Color.black = function () {
            return Color.Rgb.black();
        };
        Color.white = function () {
            return Color.Rgb.white();
        };
        Color.rgb = function (r, g, b, a) {
            if (arguments.length === 1) {
                return Color.fromAny(r).rgb();
            }
            else {
                return new Color.Rgb(r, g, b, a);
            }
        };
        Color.hsl = function (h, s, l, a) {
            if (arguments.length === 1) {
                return Color.fromAny(h).hsl();
            }
            else {
                h = typeof h === "number" ? h : Angle.fromAny(h).degValue();
                return new Color.Hsl(h, s, l, a);
            }
        };
        Color.fromName = function (name) {
            switch (name) {
                case "transparent": return Color.transparent();
                case "black": return Color.black();
                case "white": return Color.white();
                default: return void 0;
            }
        };
        Color.fromAny = function (value) {
            if (value instanceof Color) {
                return value;
            }
            else if (typeof value === "string") {
                return Color.parse(value);
            }
            else if (value && typeof value === "object") {
                var rgb = value;
                if (rgb.r !== void 0 && rgb.g !== void 0 && rgb.b !== void 0) {
                    return new Color.Rgb(rgb.r, rgb.g, rgb.b, rgb.a);
                }
                var hsl = value;
                if (hsl.h !== void 0 && hsl.s !== void 0 && hsl.l !== void 0) {
                    var h = typeof hsl.h === "number" ? hsl.h : Angle.fromAny(hsl.h).degValue();
                    return new Color.Hsl(h, hsl.s, hsl.l, hsl.a);
                }
            }
            throw new TypeError("" + value);
        };
        Color.fromValue = function (value) {
            var color;
            color = Color.Rgb.fromValue(value);
            if (!color) {
                color = Color.Hsl.fromValue(value);
            }
            return color;
        };
        Color.parse = function (string) {
            var input = codec.Unicode.stringInput(string);
            while (input.isCont() && codec.Unicode.isWhitespace(input.head())) {
                input = input.step();
            }
            var parser = Color.Parser.parse(input);
            if (parser.isDone()) {
                while (input.isCont() && codec.Unicode.isWhitespace(input.head())) {
                    input = input.step();
                }
            }
            if (input.isCont() && !parser.isError()) {
                parser = codec.Parser.error(codec.Diagnostic.unexpected(input));
            }
            return parser.bind();
        };
        Color.isInit = function (value) {
            return Color.Rgb.isInit(value) || Color.Hsl.isInit(value);
        };
        Color.form = function (unit) {
            if (unit !== void 0) {
                unit = Color.fromAny(unit);
            }
            if (unit !== Color.transparent()) {
                return new Color.Form(unit);
            }
            else {
                if (!Color._form) {
                    Color._form = new Color.Form(Color.transparent());
                }
                return Color._form;
            }
        };
        return Color;
    }());

    var RgbColor = (function (_super) {
        __extends(RgbColor, _super);
        function RgbColor(r, g, b, a) {
            if (a === void 0) { a = 1; }
            var _this = _super.call(this) || this;
            _this.r = r;
            _this.g = g;
            _this.b = b;
            _this.a = a;
            return _this;
        }
        RgbColor.prototype.isDefined = function () {
            return this.r !== 0 || this.g !== 0 || this.b !== 0 || this.a !== 1;
        };
        RgbColor.prototype.alpha = function (a) {
            if (a === void 0) {
                return this.a;
            }
            else if (this.a !== a) {
                return new RgbColor(this.r, this.g, this.b, a);
            }
            else {
                return this;
            }
        };
        RgbColor.prototype.lightness = function () {
            var r = this.r / 255;
            var g = this.g / 255;
            var b = this.b / 255;
            var min = Math.min(r, g, b);
            var max = Math.max(r, g, b);
            return (max + min) / 2;
        };
        RgbColor.prototype.brighter = function (k) {
            k = k === void 0 ? BRIGHTER : Math.pow(BRIGHTER, k);
            return k !== 1 ? new RgbColor(this.r * k, this.g * k, this.b * k, this.a) : this;
        };
        RgbColor.prototype.darker = function (k) {
            k = k === void 0 ? DARKER : Math.pow(DARKER, k);
            return k !== 1 ? new RgbColor(this.r * k, this.g * k, this.b * k, this.a) : this;
        };
        RgbColor.prototype.rgb = function () {
            return this;
        };
        RgbColor.prototype.hsl = function () {
            var r = this.r / 255;
            var g = this.g / 255;
            var b = this.b / 255;
            var min = Math.min(r, g, b);
            var max = Math.max(r, g, b);
            var h = NaN;
            var s = max - min;
            var l = (max + min) / 2;
            if (s) {
                if (r === max) {
                    h = (g - b) / s + +(g < b) * 6;
                }
                else if (g === max) {
                    h = (b - r) / s + 2;
                }
                else {
                    h = (r - g) / s + 4;
                }
                s /= l < 0.5 ? max + min : 2 - (max + min);
                h *= 60;
            }
            else {
                s = l > 0 && l < 1 ? 0 : h;
            }
            return new Color.Hsl(h, s, l, this.a);
        };
        RgbColor.prototype.equals = function (other) {
            if (other instanceof RgbColor) {
                return this.r === other.r && this.g === other.g && this.b === other.b && this.a === other.a;
            }
            return false;
        };
        RgbColor.prototype.hashCode = function () {
            if (RgbColor._hashSeed === void 0) {
                RgbColor._hashSeed = util.Murmur3.seed(RgbColor);
            }
            return util.Murmur3.mash(util.Murmur3.mix(util.Murmur3.mix(util.Murmur3.mix(util.Murmur3.mix(RgbColor._hashSeed, util.Murmur3.hash(this.r)), util.Murmur3.hash(this.g)), util.Murmur3.hash(this.b)), util.Murmur3.hash(this.a)));
        };
        RgbColor.prototype.debug = function (output) {
            output = output.write("Color").write(46).write("rgb").write(40)
                .debug(this.r).write(", ").debug(this.g).write(", ").debug(this.b);
            if (this.a !== 1) {
                output = output.write(", ").debug(this.a);
            }
            output = output.write(41);
        };
        RgbColor.prototype.toHexString = function () {
            var r = Math.min(Math.max(0, Math.round(this.r || 0)), 255);
            var g = Math.min(Math.max(0, Math.round(this.g || 0)), 255);
            var b = Math.min(Math.max(0, Math.round(this.b || 0)), 255);
            var s = "#";
            var base16Alphabet = codec.Base16.lowercase().alphabet();
            s += base16Alphabet.charAt(r >>> 4 & 0xf);
            s += base16Alphabet.charAt(r & 0xf);
            s += base16Alphabet.charAt(g >>> 4 & 0xf);
            s += base16Alphabet.charAt(g & 0xf);
            s += base16Alphabet.charAt(b >>> 4 & 0xf);
            s += base16Alphabet.charAt(b & 0xf);
            return s;
        };
        RgbColor.prototype.toString = function () {
            var a = this.a;
            a = isNaN(a) ? 1 : Math.max(0, Math.min(this.a, 1));
            if (a === 1) {
                return this.toHexString();
            }
            else {
                var s = a === 1 ? "rgb" : "rgba";
                s += "(";
                s += Math.max(0, Math.min(Math.round(this.r) || 0, 255));
                s += ",";
                s += Math.max(0, Math.min(Math.round(this.g) || 0, 255));
                s += ",";
                s += Math.max(0, Math.min(Math.round(this.b) || 0, 255));
                if (a !== 1) {
                    s += ",";
                    s += a;
                }
                s += ")";
                return s;
            }
        };
        RgbColor.transparent = function (alpha) {
            if (alpha === void 0) { alpha = 0; }
            return new RgbColor(0, 0, 0, alpha);
        };
        RgbColor.black = function () {
            return new RgbColor(0, 0, 0, 1);
        };
        RgbColor.white = function () {
            return new RgbColor(255, 255, 255, 1);
        };
        RgbColor.fromValue = function (value) {
            var tag = value.tag();
            var positional;
            if (tag === "rgb" || tag === "rgba") {
                value = value.header(tag);
                positional = true;
            }
            else {
                positional = false;
            }
            var r;
            var g;
            var b;
            var a;
            value.forEach(function (member, index) {
                var key = member.key.stringValue();
                if (key !== void 0) {
                    if (key === "r") {
                        r = member.toValue().numberValue(r);
                    }
                    else if (key === "g") {
                        g = member.toValue().numberValue(g);
                    }
                    else if (key === "b") {
                        b = member.toValue().numberValue(b);
                    }
                    else if (key === "a") {
                        a = member.toValue().numberValue(a);
                    }
                }
                else if (member instanceof structure.Value && positional) {
                    if (index === 0) {
                        r = member.numberValue(r);
                    }
                    else if (index === 1) {
                        g = member.numberValue(g);
                    }
                    else if (index === 2) {
                        b = member.numberValue(b);
                    }
                    else if (index === 3) {
                        a = member.numberValue(a);
                    }
                }
            });
            if (r !== void 0 && g !== void 0 && b !== void 0) {
                return Color.rgb(r, g, b, a);
            }
            return void 0;
        };
        RgbColor.parse = function (str) {
            return Color.parse(str).rgb();
        };
        RgbColor.isInit = function (value) {
            if (value && typeof value === "object") {
                var init = value;
                return init.r !== void 0 && init.g !== void 0 && init.b !== void 0;
            }
            return false;
        };
        return RgbColor;
    }(Color));
    Color.Rgb = RgbColor;

    var HslColor = (function (_super) {
        __extends(HslColor, _super);
        function HslColor(h, s, l, a) {
            if (a === void 0) { a = 1; }
            var _this = _super.call(this) || this;
            _this.h = h;
            _this.s = s;
            _this.l = l;
            _this.a = a;
            return _this;
        }
        HslColor.prototype.isDefined = function () {
            return this.h !== 0 || this.s !== 0 || this.l !== 0 || this.a !== 1;
        };
        HslColor.prototype.alpha = function (a) {
            if (a === void 0) {
                return this.a;
            }
            else if (this.a !== a) {
                return new HslColor(this.h, this.s, this.l, a);
            }
            else {
                return this;
            }
        };
        HslColor.prototype.lightness = function () {
            return this.l;
        };
        HslColor.prototype.brighter = function (k) {
            k = k === void 0 ? BRIGHTER : Math.pow(BRIGHTER, k);
            return k !== 1 ? new HslColor(this.h, this.s, this.l * k, this.a) : this;
        };
        HslColor.prototype.darker = function (k) {
            k = k === void 0 ? DARKER : Math.pow(DARKER, k);
            return k !== 1 ? new HslColor(this.h, this.s, this.l * k, this.a) : this;
        };
        HslColor.toRgb = function (h, m1, m2) {
            return 255 * (h < 60 ? m1 + (m2 - m1) * h / 60
                : h < 180 ? m2
                    : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
                        : m1);
        };
        HslColor.prototype.rgb = function () {
            var h = this.h % 360 + +(this.h < 0) * 360;
            var s = isNaN(h) || isNaN(this.s) ? 0 : this.s;
            var l = this.l;
            var m2 = l + (l < 0.5 ? l : 1 - l) * s;
            var m1 = 2 * l - m2;
            return new Color.Rgb(HslColor.toRgb(h >= 240 ? h - 240 : h + 120, m1, m2), HslColor.toRgb(h, m1, m2), HslColor.toRgb(h < 120 ? h + 240 : h - 120, m1, m2), this.a);
        };
        HslColor.prototype.hsl = function () {
            return this;
        };
        HslColor.prototype.equals = function (other) {
            if (other instanceof HslColor) {
                return this.h === other.h && this.s === other.s && this.l === other.l && this.a === other.a;
            }
            return false;
        };
        HslColor.prototype.hashCode = function () {
            if (HslColor._hashSeed === void 0) {
                HslColor._hashSeed = util.Murmur3.seed(HslColor);
            }
            return util.Murmur3.mash(util.Murmur3.mix(util.Murmur3.mix(util.Murmur3.mix(util.Murmur3.mix(HslColor._hashSeed, util.Murmur3.hash(this.h)), util.Murmur3.hash(this.s)), util.Murmur3.hash(this.l)), util.Murmur3.hash(this.a)));
        };
        HslColor.prototype.debug = function (output) {
            output = output.write("Color").write(46).write("hsl").write(40)
                .debug(this.h).write(", ").debug(this.s).write(", ").debug(this.l);
            if (this.a !== 1) {
                output = output.write(", ").debug(this.a);
            }
            output = output.write(41);
        };
        HslColor.prototype.toHexString = function () {
            return this.rgb().toHexString();
        };
        HslColor.prototype.toString = function () {
            var a = this.a;
            a = isNaN(a) ? 1 : Math.max(0, Math.min(this.a, 1));
            var s = a === 1 ? "hsl" : "hsla";
            s += "(";
            s += Math.max(0, Math.min(Math.round(this.h) || 0, 360));
            s += ",";
            s += Math.max(0, Math.min(100 * Math.round(this.s) || 0, 100)) + "%";
            s += ",";
            s += Math.max(0, Math.min(100 * Math.round(this.l) || 0, 100)) + "%";
            if (a !== 1) {
                s += ",";
                s += a;
            }
            s += ")";
            return s;
        };
        HslColor.transparent = function (alpha) {
            if (alpha === void 0) { alpha = 0; }
            return new HslColor(0, 0, 0, alpha);
        };
        HslColor.black = function () {
            return new HslColor(0, 0, 0, 1);
        };
        HslColor.white = function () {
            return new HslColor(0, 1, 1, 1);
        };
        HslColor.fromValue = function (value) {
            var tag = value.tag();
            var positional;
            if (tag === "hsl" || tag === "hsla") {
                value = value.header(tag);
                positional = true;
            }
            else {
                positional = false;
            }
            var h;
            var s;
            var l;
            var a;
            value.forEach(function (member, index) {
                var key = member.key.stringValue();
                if (key !== void 0) {
                    if (key === "h") {
                        h = member.toValue().cast(Angle.form(), h);
                    }
                    else if (key === "s") {
                        s = member.toValue().numberValue(s);
                    }
                    else if (key === "l") {
                        l = member.toValue().numberValue(l);
                    }
                    else if (key === "a") {
                        a = member.toValue().numberValue(a);
                    }
                }
                else if (member instanceof structure.Value && positional) {
                    if (index === 0) {
                        h = member.cast(Angle.form(), h);
                    }
                    else if (index === 1) {
                        s = member.numberValue(s);
                    }
                    else if (index === 2) {
                        l = member.numberValue(l);
                    }
                    else if (index === 3) {
                        a = member.numberValue(a);
                    }
                }
            });
            if (h !== void 0 && s !== void 0 && l !== void 0) {
                return Color.hsl(h, s, l, a);
            }
            return void 0;
        };
        HslColor.parse = function (str) {
            return Color.parse(str).hsl();
        };
        HslColor.isInit = function (value) {
            if (value && typeof value === "object") {
                var init = value;
                return init.h !== void 0 && init.s !== void 0 && init.l !== void 0;
            }
            return false;
        };
        return HslColor;
    }(Color));
    Color.Hsl = HslColor;

    var ColorChannel = (function () {
        function ColorChannel(value, units) {
            if (units === void 0) { units = ""; }
            this.value = value;
            this.units = units;
        }
        ColorChannel.prototype.scale = function (k) {
            if (this.units === "%") {
                return this.value * k / 100;
            }
            else {
                return this.value;
            }
        };
        return ColorChannel;
    }());

    var ColorChannelParser = (function (_super) {
        __extends(ColorChannelParser, _super);
        function ColorChannelParser(valueParser, step) {
            var _this = _super.call(this) || this;
            _this.valueParser = valueParser;
            _this.step = step;
            return _this;
        }
        ColorChannelParser.prototype.feed = function (input) {
            return ColorChannelParser.parse(input, this.valueParser, this.step);
        };
        ColorChannelParser.parse = function (input, valueParser, step) {
            if (step === void 0) { step = 1; }
            if (step === 1) {
                if (!valueParser) {
                    valueParser = codec.Base10.parseNumber(input);
                }
                else {
                    valueParser = valueParser.feed(input);
                }
                if (valueParser.isDone()) {
                    step = 2;
                }
                else if (valueParser.isError()) {
                    return valueParser.asError();
                }
            }
            if (step === 2) {
                if (input.isCont() && input.head() === 37) {
                    input = input.step();
                    return codec.Parser.done(new ColorChannel(valueParser.bind(), "%"));
                }
                else if (!input.isEmpty()) {
                    return codec.Parser.done(new ColorChannel(valueParser.bind()));
                }
            }
            return new ColorChannelParser(valueParser, step);
        };
        return ColorChannelParser;
    }(codec.Parser));
    ColorChannel.Parser = ColorChannelParser;

    var HexColorParser = (function (_super) {
        __extends(HexColorParser, _super);
        function HexColorParser(value, step) {
            var _this = _super.call(this) || this;
            _this._value = value;
            _this._step = step;
            return _this;
        }
        HexColorParser.prototype.feed = function (input) {
            return HexColorParser.parse(input, this._value, this._step);
        };
        HexColorParser.parse = function (input, value, step) {
            if (value === void 0) { value = 0; }
            if (step === void 0) { step = 1; }
            var c = 0;
            if (step === 1) {
                if (input.isCont() && input.head() === 35) {
                    input = input.step();
                    step = 2;
                }
                else if (!input.isEmpty()) {
                    return codec.Parser.error(codec.Diagnostic.expected("#", input));
                }
            }
            if (step >= 2) {
                while (step <= 9 && input.isCont()) {
                    c = input.head();
                    if (codec.Base16.isDigit(c)) {
                        input = input.step();
                        value = (value << 4) | codec.Base16.decodeDigit(c);
                        step += 1;
                    }
                    else {
                        break;
                    }
                }
                if (!input.isEmpty()) {
                    if (step === 5) {
                        return codec.Parser.done(new RgbColor(value >> 8 & 0x0f | value >> 4 & 0xf0, value >> 4 & 0x0f | value & 0xf0, value << 4 & 0xf0 | value & 0x0f));
                    }
                    else if (step === 6) {
                        return codec.Parser.done(new RgbColor(value >> 12 & 0x0f | value >> 8 & 0xf0, value >> 8 & 0x0f | value >> 4 & 0xf0, value >> 4 & 0x0f | value & 0xf0, (value << 4 & 0xf0 | value & 0x0f) / 255));
                    }
                    else if (step === 8) {
                        return codec.Parser.done(new RgbColor(value >> 16 & 0xff, value >> 8 & 0xff, value & 0xff));
                    }
                    else if (step === 10) {
                        return codec.Parser.done(new RgbColor(value >> 24 & 0xff, value >> 16 & 0xff, value >> 8 & 0xff, (value & 0xff) / 255));
                    }
                    else {
                        return codec.Parser.error(codec.Diagnostic.unexpected(input));
                    }
                }
            }
            return new HexColorParser(value, step);
        };
        return HexColorParser;
    }(codec.Parser));
    Color.HexParser = HexColorParser;

    var RgbColorParser = (function (_super) {
        __extends(RgbColorParser, _super);
        function RgbColorParser(rParser, gParser, bParser, aParser, step) {
            var _this = _super.call(this) || this;
            _this.rParser = rParser;
            _this.gParser = gParser;
            _this.bParser = bParser;
            _this.aParser = aParser;
            _this.step = step;
            return _this;
        }
        RgbColorParser.prototype.feed = function (input) {
            return RgbColorParser.parse(input, this.rParser, this.gParser, this.bParser, this.aParser, this.step);
        };
        RgbColorParser.parse = function (input, rParser, gParser, bParser, aParser, step) {
            var c = 0;
            if (step === 1) {
                if (input.isCont() && input.head() === 114) {
                    input = input.step();
                    step = 2;
                }
                else if (!input.isEmpty()) {
                    return codec.Parser.error(codec.Diagnostic.expected("r", input));
                }
            }
            if (step === 2) {
                if (input.isCont() && input.head() === 103) {
                    input = input.step();
                    step = 3;
                }
                else if (!input.isEmpty()) {
                    return codec.Parser.error(codec.Diagnostic.expected("g", input));
                }
            }
            if (step === 3) {
                if (input.isCont() && input.head() === 98) {
                    input = input.step();
                    step = 4;
                }
                else if (!input.isEmpty()) {
                    return codec.Parser.error(codec.Diagnostic.expected("b", input));
                }
            }
            if (step === 4) {
                if (input.isCont() && input.head() === 97) {
                    input = input.step();
                    step = 5;
                }
                else if (!input.isEmpty()) {
                    step = 5;
                }
            }
            if (step === 5) {
                while (input.isCont() && (c = input.head(), codec.Unicode.isSpace(c))) {
                    input = input.step();
                }
                if (input.isCont() && c === 40) {
                    input = input.step();
                    step = 6;
                }
                else if (!input.isEmpty()) {
                    return codec.Parser.error(codec.Diagnostic.expected("(", input));
                }
            }
            if (step === 6) {
                if (!rParser) {
                    while (input.isCont() && codec.Unicode.isSpace(input.head())) {
                        input = input.step();
                    }
                    if (!input.isEmpty()) {
                        rParser = ColorChannelParser.parse(input);
                    }
                }
                else {
                    rParser = rParser.feed(input);
                }
                if (rParser) {
                    if (rParser.isDone()) {
                        step = 7;
                    }
                    else if (rParser.isError()) {
                        return rParser.asError();
                    }
                }
            }
            if (step === 7) {
                while (input.isCont() && (c = input.head(), codec.Unicode.isSpace(c))) {
                    input = input.step();
                }
                if (input.isCont()) {
                    if (c === 44) {
                        input = input.step();
                    }
                    step = 8;
                }
                else if (input.isDone()) {
                    return codec.Parser.error(codec.Diagnostic.unexpected(input));
                }
            }
            if (step === 8) {
                if (!gParser) {
                    while (input.isCont() && codec.Unicode.isSpace(input.head())) {
                        input = input.step();
                    }
                    if (!input.isEmpty()) {
                        gParser = ColorChannelParser.parse(input);
                    }
                }
                else {
                    gParser = gParser.feed(input);
                }
                if (gParser) {
                    if (gParser.isDone()) {
                        step = 9;
                    }
                    else if (gParser.isError()) {
                        return gParser.asError();
                    }
                }
            }
            if (step === 9) {
                while (input.isCont() && (c = input.head(), codec.Unicode.isSpace(c))) {
                    input = input.step();
                }
                if (input.isCont()) {
                    if (c === 44) {
                        input = input.step();
                    }
                    step = 10;
                }
                else if (input.isDone()) {
                    return codec.Parser.error(codec.Diagnostic.unexpected(input));
                }
            }
            if (step === 10) {
                if (!bParser) {
                    while (input.isCont() && codec.Unicode.isSpace(input.head())) {
                        input = input.step();
                    }
                    if (!input.isEmpty()) {
                        bParser = ColorChannelParser.parse(input);
                    }
                }
                else {
                    bParser = bParser.feed(input);
                }
                if (bParser) {
                    if (bParser.isDone()) {
                        step = 11;
                    }
                    else if (bParser.isError()) {
                        return bParser.asError();
                    }
                }
            }
            if (step === 11) {
                while (input.isCont() && (c = input.head(), codec.Unicode.isSpace(c))) {
                    input = input.step();
                }
                if (input.isCont()) {
                    if (c === 41) {
                        input = input.step();
                        return codec.Parser.done(new RgbColor(rParser.bind().scale(255), gParser.bind().scale(255), bParser.bind().scale(255)));
                    }
                    else if (c === 44 || c === 47) {
                        input = input.step();
                    }
                    step = 12;
                }
                else if (input.isDone()) {
                    return codec.Parser.error(codec.Diagnostic.unexpected(input));
                }
            }
            if (step === 12) {
                if (!aParser) {
                    while (input.isCont() && codec.Unicode.isSpace(input.head())) {
                        input = input.step();
                    }
                    if (!input.isEmpty()) {
                        aParser = ColorChannelParser.parse(input);
                    }
                }
                else {
                    aParser = aParser.feed(input);
                }
                if (aParser) {
                    if (aParser.isDone()) {
                        step = 13;
                    }
                    else if (aParser.isError()) {
                        return aParser.asError();
                    }
                }
            }
            if (step === 13) {
                while (input.isCont() && (c = input.head(), codec.Unicode.isSpace(c))) {
                    input = input.step();
                }
                if (input.isCont() && c === 41) {
                    input = input.step();
                    return codec.Parser.done(new RgbColor(rParser.bind().scale(255), gParser.bind().scale(255), bParser.bind().scale(255), aParser.bind().scale(1)));
                }
                else if (!input.isEmpty()) {
                    return codec.Parser.error(codec.Diagnostic.expected(")", input));
                }
            }
            return new RgbColorParser(rParser, gParser, bParser, aParser, step);
        };
        RgbColorParser.parseRest = function (input) {
            return RgbColorParser.parse(input, void 0, void 0, void 0, void 0, 5);
        };
        return RgbColorParser;
    }(codec.Parser));
    Color.RgbParser = RgbColorParser;

    var HslColorParser = (function (_super) {
        __extends(HslColorParser, _super);
        function HslColorParser(hParser, sParser, lParser, aParser, step) {
            var _this = _super.call(this) || this;
            _this.hParser = hParser;
            _this.sParser = sParser;
            _this.lParser = lParser;
            _this.aParser = aParser;
            _this.step = step;
            return _this;
        }
        HslColorParser.prototype.feed = function (input) {
            return HslColorParser.parse(input, this.hParser, this.sParser, this.lParser, this.aParser, this.step);
        };
        HslColorParser.parse = function (input, hParser, sParser, lParser, aParser, step) {
            var c = 0;
            if (step === 1) {
                if (input.isCont() && input.head() === 104) {
                    input = input.step();
                    step = 2;
                }
                else if (!input.isEmpty()) {
                    return codec.Parser.error(codec.Diagnostic.expected("h", input));
                }
            }
            if (step === 2) {
                if (input.isCont() && input.head() === 115) {
                    input = input.step();
                    step = 3;
                }
                else if (!input.isEmpty()) {
                    return codec.Parser.error(codec.Diagnostic.expected("s", input));
                }
            }
            if (step === 3) {
                if (input.isCont() && input.head() === 108) {
                    input = input.step();
                    step = 4;
                }
                else if (!input.isEmpty()) {
                    return codec.Parser.error(codec.Diagnostic.expected("l", input));
                }
            }
            if (step === 4) {
                if (input.isCont() && input.head() === 97) {
                    input = input.step();
                    step = 5;
                }
                else if (!input.isEmpty()) {
                    step = 5;
                }
            }
            if (step === 5) {
                while (input.isCont() && (c = input.head(), codec.Unicode.isSpace(c))) {
                    input = input.step();
                }
                if (input.isCont() && c === 40) {
                    input = input.step();
                    step = 6;
                }
                else if (!input.isEmpty()) {
                    return codec.Parser.error(codec.Diagnostic.expected("(", input));
                }
            }
            if (step === 6) {
                if (!hParser) {
                    while (input.isCont() && codec.Unicode.isSpace(input.head())) {
                        input = input.step();
                    }
                    if (!input.isEmpty()) {
                        hParser = AngleParser.parse(input, "deg");
                    }
                }
                else {
                    hParser = hParser.feed(input);
                }
                if (hParser) {
                    if (hParser.isDone()) {
                        step = 7;
                    }
                    else if (hParser.isError()) {
                        return hParser.asError();
                    }
                }
            }
            if (step === 7) {
                while (input.isCont() && (c = input.head(), codec.Unicode.isSpace(c))) {
                    input = input.step();
                }
                if (input.isCont()) {
                    if (c === 44) {
                        input = input.step();
                    }
                    step = 8;
                }
                else if (input.isDone()) {
                    return codec.Parser.error(codec.Diagnostic.unexpected(input));
                }
            }
            if (step === 8) {
                if (!sParser) {
                    while (input.isCont() && codec.Unicode.isSpace(input.head())) {
                        input = input.step();
                    }
                    if (!input.isEmpty()) {
                        sParser = ColorChannelParser.parse(input);
                    }
                }
                else {
                    sParser = sParser.feed(input);
                }
                if (sParser) {
                    if (sParser.isDone()) {
                        if (sParser.bind().units === "%") {
                            step = 9;
                        }
                        else {
                            return codec.Parser.error(codec.Diagnostic.expected("%", input));
                        }
                    }
                    else if (sParser.isError()) {
                        return sParser.asError();
                    }
                }
            }
            if (step === 9) {
                while (input.isCont() && (c = input.head(), codec.Unicode.isSpace(c))) {
                    input = input.step();
                }
                if (input.isCont()) {
                    if (c === 44) {
                        input = input.step();
                    }
                    step = 10;
                }
                else if (input.isDone()) {
                    return codec.Parser.error(codec.Diagnostic.unexpected(input));
                }
            }
            if (step === 10) {
                if (!lParser) {
                    while (input.isCont() && codec.Unicode.isSpace(input.head())) {
                        input = input.step();
                    }
                    if (input.isCont()) {
                        lParser = ColorChannelParser.parse(input);
                    }
                }
                else {
                    lParser = lParser.feed(input);
                }
                if (lParser) {
                    if (lParser.isDone()) {
                        if (lParser.bind().units === "%") {
                            step = 11;
                        }
                        else {
                            return codec.Parser.error(codec.Diagnostic.expected("%", input));
                        }
                    }
                    else if (lParser.isError()) {
                        return lParser.asError();
                    }
                }
            }
            if (step === 11) {
                while (input.isCont() && (c = input.head(), codec.Unicode.isSpace(c))) {
                    input = input.step();
                }
                if (input.isCont()) {
                    if (c === 41) {
                        input = input.step();
                        return codec.Parser.done(new HslColor(hParser.bind().degValue(), sParser.bind().scale(1), lParser.bind().scale(1)));
                    }
                    else if (c === 44 || c === 47) {
                        input = input.step();
                    }
                    step = 12;
                }
                else if (input.isDone()) {
                    return codec.Parser.error(codec.Diagnostic.unexpected(input));
                }
            }
            if (step === 12) {
                if (!aParser) {
                    while (input.isCont() && codec.Unicode.isSpace(input.head())) {
                        input = input.step();
                    }
                    if (!input.isEmpty()) {
                        aParser = ColorChannelParser.parse(input);
                    }
                }
                else {
                    aParser = aParser.feed(input);
                }
                if (aParser) {
                    if (aParser.isDone()) {
                        step = 13;
                    }
                    else if (aParser.isError()) {
                        return aParser.asError();
                    }
                }
            }
            if (step === 13) {
                while (input.isCont() && (c = input.head(), codec.Unicode.isSpace(c))) {
                    input = input.step();
                }
                if (input.isCont() && c === 41) {
                    input = input.step();
                    return codec.Parser.done(new HslColor(hParser.bind().degValue(), sParser.bind().scale(1), lParser.bind().scale(1), aParser.bind().scale(1)));
                }
                else if (!input.isEmpty()) {
                    return codec.Parser.error(codec.Diagnostic.expected(")", input));
                }
            }
            return new HslColorParser(hParser, sParser, lParser, aParser, step);
        };
        HslColorParser.parseRest = function (input) {
            return HslColorParser.parse(input, void 0, void 0, void 0, void 0, 5);
        };
        return HslColorParser;
    }(codec.Parser));
    Color.HslParser = HslColorParser;

    var ColorParser = (function (_super) {
        __extends(ColorParser, _super);
        function ColorParser(identOutput, step) {
            var _this = _super.call(this) || this;
            _this.identOutput = identOutput;
            _this.step = step;
            return _this;
        }
        ColorParser.prototype.feed = function (input) {
            return ColorParser.parse(input, this.identOutput, this.step);
        };
        ColorParser.parse = function (input, identOutput, step) {
            if (step === void 0) { step = 1; }
            var c = 0;
            if (step === 1) {
                if (input.isCont()) {
                    if (input.head() === 35) {
                        return HexColorParser.parse(input);
                    }
                    else {
                        step = 2;
                    }
                }
                else if (input.isDone()) {
                    return codec.Parser.error(codec.Diagnostic.unexpected(input));
                }
            }
            if (step === 2) {
                identOutput = identOutput || codec.Unicode.stringOutput();
                while (input.isCont() && (c = input.head(), codec.Unicode.isAlpha(c))) {
                    input = input.step();
                    identOutput.write(c);
                }
                if (!input.isEmpty()) {
                    var ident = identOutput.bind();
                    switch (ident) {
                        case "rgb":
                        case "rgba": return RgbColorParser.parseRest(input);
                        case "hsl":
                        case "hsla": return HslColorParser.parseRest(input);
                        default:
                            var color = Color.fromName(ident);
                            if (color !== void 0) {
                                return codec.Parser.done(color);
                            }
                            else {
                                return codec.Parser.error(codec.Diagnostic.message("unknown color: " + ident, input));
                            }
                    }
                }
            }
            return new ColorParser(identOutput, step);
        };
        return ColorParser;
    }(codec.Parser));
    Color.Parser = ColorParser;

    var ColorForm = (function (_super) {
        __extends(ColorForm, _super);
        function ColorForm(unit) {
            var _this = _super.call(this) || this;
            _this._unit = unit;
            return _this;
        }
        ColorForm.prototype.unit = function (unit) {
            if (arguments.length === 0) {
                return this._unit;
            }
            else {
                return new ColorForm(unit);
            }
        };
        ColorForm.prototype.mold = function (color) {
            color = Color.fromAny(color);
            return structure.Text.from(color.toString());
        };
        ColorForm.prototype.cast = function (item) {
            var value = item.toValue();
            var color;
            try {
                color = Color.fromValue(value);
                if (!color) {
                    var string = value.stringValue(void 0);
                    if (string !== void 0) {
                        color = Color.parse(string);
                    }
                }
            }
            catch (e) {
            }
            return color;
        };
        return ColorForm;
    }(structure.Form));
    Color.Form = ColorForm;

    var FontSize = {
        fromAny: function (size) {
            if (typeof size === "string" && (size === "large" || size === "larger" || size === "medium"
                || size === "small" || size === "smaller" || size === "x-large" || size === "x-small"
                || size === "xx-large" || size === "xx-small")) {
                return size;
            }
            else {
                return Length.fromAny(size);
            }
        },
        fromValue: function (value) {
            var string = value.stringValue(void 0);
            if (string !== void 0) {
                return FontSize.fromAny(string);
            }
            else {
                return Length.form().cast(value);
            }
        },
    };

    var LineHeight = {
        fromAny: function (height) {
            if (typeof height === "string" && height === "normal") {
                return height;
            }
            else {
                return Length.fromAny(height);
            }
        },
        fromValue: function (value) {
            var string = value.stringValue(void 0);
            if (string !== void 0) {
                return LineHeight.fromAny(string);
            }
            else {
                return Length.form().cast(value);
            }
        },
    };

    var FontFamily = {
        fromValue: function (value) {
            var family;
            value.forEach(function (item) {
                if (item instanceof structure.Value) {
                    var string = item.stringValue(void 0);
                    if (string !== void 0) {
                        if (family === void 0) {
                            family = string;
                        }
                        else if (typeof family === "string") {
                            family = [family, string];
                        }
                        else {
                            family.push(string);
                        }
                    }
                }
            });
            return family;
        },
        format: function (family) {
            var n = family.length;
            var isIdent;
            if (n > 0) {
                isIdent = codec.Unicode.isAlpha(family.charCodeAt(0));
                for (var i = family.offsetByCodePoints(0, 1); isIdent && i < n; i = family.offsetByCodePoints(i, 1)) {
                    var c = family.charCodeAt(i);
                    isIdent = codec.Unicode.isAlpha(c) || c === 45;
                }
            }
            else {
                isIdent = false;
            }
            if (isIdent) {
                return family;
            }
            else {
                var output = codec.Unicode.stringOutput();
                output.write(34);
                for (var i = 0; i < n; i = family.offsetByCodePoints(i, 1)) {
                    var c = family.charCodeAt(i);
                    if (c === 10 || c === 34 || c === 39) {
                        output.write(92).write(c);
                    }
                    else if (c >= 0x20) {
                        output.write(c);
                    }
                    else {
                        var base16 = codec.Base16.uppercase();
                        output.write(92).write(base16.encodeDigit(c >>> 20 & 0xf))
                            .write(base16.encodeDigit(c >>> 16 & 0xf))
                            .write(base16.encodeDigit(c >>> 12 & 0xf))
                            .write(base16.encodeDigit(c >>> 8 & 0xf))
                            .write(base16.encodeDigit(c >>> 4 & 0xf))
                            .write(base16.encodeDigit(c & 0xf));
                    }
                }
                output.write(34);
                return output.toString();
            }
        },
    };

    var FontFamilyParser = (function (_super) {
        __extends(FontFamilyParser, _super);
        function FontFamilyParser(output, quote, code, step) {
            var _this = _super.call(this) || this;
            _this.output = output;
            _this.quote = quote;
            _this.code = code;
            _this.step = step;
            return _this;
        }
        FontFamilyParser.prototype.feed = function (input) {
            return FontFamilyParser.parse(input, this.output, this.quote, this.code, this.step);
        };
        FontFamilyParser.parse = function (input, output, quote, code, step) {
            if (quote === void 0) { quote = 0; }
            if (code === void 0) { code = 0; }
            if (step === void 0) { step = 1; }
            var c = 0;
            if (step === 1) {
                while (input.isCont() && (c = input.head(), codec.Unicode.isSpace(c))) {
                    input = input.step();
                }
                if (input.isCont()) {
                    if (codec.Unicode.isAlpha(c)) {
                        output = output || codec.Unicode.stringOutput();
                        step = 2;
                    }
                    else if (c === 34 || c === 39 && (quote === c || quote === 0)) {
                        input = input.step();
                        output = output || codec.Unicode.stringOutput();
                        quote = c;
                        step = 3;
                    }
                    else {
                        return codec.Parser.error(codec.Diagnostic.expected("font family", input));
                    }
                }
                else if (input.isDone()) {
                    return codec.Parser.error(codec.Diagnostic.expected("font family", input));
                }
            }
            if (step === 2) {
                while (input.isCont() && (c = input.head(), codec.Unicode.isAlpha(c) || c === 45)) {
                    input = input.step();
                    output.write(c);
                }
                if (!input.isEmpty()) {
                    return codec.Parser.done(output.bind());
                }
            }
            string: do {
                if (step === 3) {
                    while (input.isCont()) {
                        c = input.head();
                        if (c >= 0x20 && c !== quote && c !== 92) {
                            input = input.step();
                            output.write(c);
                        }
                        else {
                            break;
                        }
                    }
                    if (input.isCont()) {
                        if (c === quote) {
                            input = input.step();
                            return codec.Parser.done(output.bind());
                        }
                        else if (c === 92) {
                            input = input.step();
                            step = 4;
                        }
                        else {
                            return codec.Parser.error(codec.Diagnostic.expected(quote, input));
                        }
                    }
                    else if (input.isDone()) {
                        return codec.Parser.error(codec.Diagnostic.expected(quote, input));
                    }
                }
                if (step === 4) {
                    if (input.isCont()) {
                        c = input.head();
                        if (codec.Base16.isDigit(c)) {
                            step = 5;
                        }
                        else if (c === 10) {
                            input.step();
                            step = 3;
                            continue;
                        }
                        else {
                            input.step();
                            output.write(c);
                            step = 3;
                            continue;
                        }
                    }
                    else if (input.isDone()) {
                        return codec.Parser.error(codec.Diagnostic.expected("escape character", input));
                    }
                }
                if (step >= 5) {
                    do {
                        if (input.isCont() && (c = input.head(), codec.Base16.isDigit(c))) {
                            input = input.step();
                            code = 16 * code + codec.Base16.decodeDigit(c);
                            if (step <= 11) {
                                step += 1;
                                continue;
                            }
                            else {
                                if (code === 0) {
                                    return codec.Parser.error(codec.Diagnostic.message("zero escape", input));
                                }
                                output.write(code);
                                code = 0;
                                step = 3;
                                continue string;
                            }
                        }
                        else if (!input.isEmpty()) {
                            return codec.Parser.error(codec.Diagnostic.unexpected(input));
                        }
                        break;
                    } while (true);
                }
                break;
            } while (true);
            return new FontFamilyParser(output, quote, code, step);
        };
        return FontFamilyParser;
    }(codec.Parser));

    var Font = (function () {
        function Font(style, variant, weight, stretch, size, height, family) {
            this._style = style;
            this._variant = variant;
            this._weight = weight;
            this._stretch = stretch;
            this._size = size;
            this._height = height;
            this._family = family;
        }
        Font.prototype.style = function (style) {
            if (style === void 0) {
                return this._style;
            }
            else {
                if (this._style === style) {
                    return this;
                }
                else {
                    return new Font(style, this._variant, this._weight, this._stretch, this._size, this._height, this._family);
                }
            }
        };
        Font.prototype.variant = function (variant) {
            if (variant === void 0) {
                return this._variant;
            }
            else {
                if (this._variant === variant) {
                    return this;
                }
                else {
                    return new Font(this._style, variant, this._weight, this._stretch, this._size, this._height, this._family);
                }
            }
        };
        Font.prototype.weight = function (weight) {
            if (weight === void 0) {
                return this._weight;
            }
            else {
                if (this._weight === weight) {
                    return this;
                }
                else {
                    return new Font(this._style, this._variant, weight, this._stretch, this._size, this._height, this._family);
                }
            }
        };
        Font.prototype.stretch = function (stretch) {
            if (stretch === void 0) {
                return this._stretch;
            }
            else {
                if (this._stretch === stretch) {
                    return this;
                }
                else {
                    return new Font(this._style, this._variant, this._weight, stretch, this._size, this._height, this._family);
                }
            }
        };
        Font.prototype.size = function (size) {
            if (size === void 0) {
                return this._size;
            }
            else {
                size = size !== null ? FontSize.fromAny(size) : null;
                if (util.Objects.equal(this._size, size)) {
                    return this;
                }
                else {
                    return new Font(this._style, this._variant, this._weight, this._stretch, size, this._height, this._family);
                }
            }
        };
        Font.prototype.height = function (height) {
            if (height === void 0) {
                return this._height;
            }
            else {
                height = height !== null ? LineHeight.fromAny(height) : null;
                if (util.Objects.equal(this._height, height)) {
                    return this;
                }
                else {
                    return new Font(this._style, this._variant, this._weight, this._stretch, this._size, height, this._family);
                }
            }
        };
        Font.prototype.family = function (family) {
            if (family === void 0) {
                return (Array.isArray(this._family) ? this._family.slice(0) : this._family);
            }
            else {
                if (util.Objects.equal(this._family, family)) {
                    return this;
                }
                else {
                    if (Array.isArray(family) && family.length === 1) {
                        family = family[0];
                    }
                    return new Font(this._style, this._variant, this._weight, this._stretch, this._size, this._height, family);
                }
            }
        };
        Font.prototype.toAny = function () {
            return {
                style: this._style,
                variant: this._variant,
                weight: this._weight,
                stretch: this._stretch,
                size: this._size,
                height: this._height,
                family: (Array.isArray(this._family) ? this._family.slice(0) : this._family),
            };
        };
        Font.prototype.equals = function (that) {
            if (this === that) {
                return true;
            }
            else if (that instanceof Font) {
                return this._style === that._style && this._variant === that._variant
                    && this._weight === that._weight && this._stretch === that._stretch
                    && util.Objects.equal(this._size, that._size)
                    && util.Objects.equal(this._height, that._height)
                    && util.Objects.equal(this._family, that._family);
            }
            return false;
        };
        Font.prototype.debug = function (output) {
            output = output.write("Font").write(46).write("family").write(40).write(41);
            if (typeof this._family === "string") {
                output = output.debug(this._family);
            }
            else if (Array.isArray(this._family) && this._family.length) {
                output = output.debug(this._family[0]);
                for (var i = 1; i < this._family.length; i += 1) {
                    output = output.write(", ").debug(this._family[i]);
                }
            }
            output = output.write(41);
            if (this._style !== null) {
                output = output.write(46).write("style").write(40).debug(this._style).write(41);
            }
            if (this._variant !== null) {
                output = output.write(46).write("variant").write(40).debug(this._variant).write(41);
            }
            if (this._weight !== null) {
                output = output.write(46).write("weight").write(40).debug(this._weight).write(41);
            }
            if (this._stretch !== null) {
                output = output.write(46).write("stretch").write(40).debug(this._stretch).write(41);
            }
            if (this._size !== null) {
                output = output.write(46).write("size").write(40).debug(this._size).write(41);
            }
            if (this._height !== null) {
                output = output.write(46).write("height").write(40).debug(this._height).write(41);
            }
        };
        Font.prototype.toString = function () {
            var s = "";
            if (this._style !== null || this._variant === "normal" || this._weight === "normal" || this._stretch === "normal") {
                s += this._style || "normal";
            }
            if (this._variant !== null || this._weight === "normal" || this._stretch === "normal") {
                if (s) {
                    s += " ";
                }
                s += this._variant || "normal";
            }
            if (this._weight !== null || this._stretch === "normal") {
                if (s) {
                    s += " ";
                }
                s += this._weight || "normal";
            }
            if (this._stretch !== null) {
                if (s) {
                    s += " ";
                }
                s += this._stretch;
            }
            if (this._size !== null) {
                if (s) {
                    s += " ";
                }
                s += this._size.toString();
                if (this._height !== null) {
                    s += "/";
                    s += this._height.toString();
                }
            }
            if (typeof this._family === "string") {
                if (s) {
                    s += " ";
                }
                s += FontFamily.format(this._family);
            }
            else if (Array.isArray(this._family) && this._family.length) {
                if (s) {
                    s += " ";
                }
                s += FontFamily.format(this._family[0]);
                for (var i = 1; i < this._family.length; i += 1) {
                    s += ", ";
                    s += FontFamily.format(this._family[i]);
                }
            }
            return s;
        };
        Font.style = function (style, family) {
            if (Array.isArray(family) && family.length === 1) {
                family = family[0];
            }
            return new Font(style, null, null, null, null, null, family);
        };
        Font.variant = function (variant, family) {
            if (Array.isArray(family) && family.length === 1) {
                family = family[0];
            }
            return new Font(null, variant, null, null, null, null, family);
        };
        Font.weight = function (weight, family) {
            if (Array.isArray(family) && family.length === 1) {
                family = family[0];
            }
            return new Font(null, null, weight, null, null, null, family);
        };
        Font.stretch = function (stretch, family) {
            if (Array.isArray(family) && family.length === 1) {
                family = family[0];
            }
            return new Font(null, null, null, stretch, null, null, family);
        };
        Font.size = function (size, family) {
            size = size !== null ? FontSize.fromAny(size) : null;
            if (Array.isArray(family) && family.length === 1) {
                family = family[0];
            }
            return new Font(null, null, null, null, size, null, family);
        };
        Font.family = function (family) {
            if (Array.isArray(family) && family.length === 1) {
                family = family[0];
            }
            return new Font(null, null, null, null, null, null, family);
        };
        Font.from = function (style, variant, weight, stretch, size, height, family) {
            if (style === void 0) { style = null; }
            if (variant === void 0) { variant = null; }
            if (weight === void 0) { weight = null; }
            if (stretch === void 0) { stretch = null; }
            if (size === void 0) { size = null; }
            if (height === void 0) { height = null; }
            size = size !== null ? FontSize.fromAny(size) : null;
            height = height !== null ? LineHeight.fromAny(height) : null;
            if (Array.isArray(family) && family.length === 1) {
                family = family[0];
            }
            return new Font(style, variant, weight, stretch, size, height, family);
        };
        Font.fromAny = function (value) {
            if (value instanceof Font) {
                return value;
            }
            else if (typeof value === "object" && value) {
                return Font.from(value.style, value.variant, value.weight, value.stretch, value.size, value.height, value.family);
            }
            else if (typeof value === "string") {
                return Font.parse(value);
            }
            throw new TypeError("" + value);
        };
        Font.fromValue = function (value) {
            var header = value.header("font");
            if (header) {
                var style = header.get("style").stringValue(null);
                var variant = header.get("variant").stringValue(null);
                var weight = header.get("weight").stringValue(null);
                var stretch = header.get("stretch").stringValue(null);
                var size = FontSize.fromValue(header.get("size"));
                var height = LineHeight.fromValue(header.get("height"));
                var family = FontFamily.fromValue(header.get("family"));
                if (family !== void 0) {
                    return Font.from(style, variant, weight, stretch, size, height, family);
                }
            }
            return void 0;
        };
        Font.parse = function (string) {
            var input = codec.Unicode.stringInput(string);
            while (input.isCont() && codec.Unicode.isWhitespace(input.head())) {
                input = input.step();
            }
            var parser = Font.Parser.parse(input);
            if (parser.isDone()) {
                while (input.isCont() && codec.Unicode.isWhitespace(input.head())) {
                    input = input.step();
                }
            }
            if (input.isCont() && !parser.isError()) {
                parser = codec.Parser.error(codec.Diagnostic.unexpected(input));
            }
            return parser.bind();
        };
        Font.isInit = function (value) {
            if (value && typeof value === "object") {
                var init = value;
                return init.family !== void 0;
            }
            return false;
        };
        Font.form = function (unit) {
            if (unit !== void 0) {
                unit = Font.fromAny(unit);
                return new Font.Form(unit);
            }
            else {
                if (!Font._form) {
                    Font._form = new Font.Form();
                }
                return Font._form;
            }
        };
        return Font;
    }());

    var FontParser = (function (_super) {
        __extends(FontParser, _super);
        function FontParser(style, variant, weight, stretch, size, height, family, identOutput, lengthParser, familyParser, step) {
            var _this = _super.call(this) || this;
            _this.style = style;
            _this.variant = variant;
            _this.weight = weight;
            _this.stretch = stretch;
            _this.size = size;
            _this.height = height;
            _this.family = family;
            _this.identOutput = identOutput;
            _this.lengthParser = lengthParser;
            _this.familyParser = familyParser;
            _this.step = step;
            return _this;
        }
        FontParser.prototype.feed = function (input) {
            return FontParser.parse(input, this.style, this.variant, this.weight, this.stretch, this.size, this.height, this.family, this.identOutput, this.lengthParser, this.familyParser, this.step);
        };
        FontParser.parse = function (input, style, variant, weight, stretch, size, height, family, identOutput, lengthParser, familyParser, step) {
            if (step === void 0) { step = 1; }
            var c = 0;
            do {
                if (step === 1) {
                    while (input.isCont() && (c = input.head(), codec.Unicode.isSpace(c))) {
                        input.step();
                    }
                    if (input.isCont()) {
                        if (codec.Unicode.isAlpha(c)) {
                            step = 2;
                        }
                        else if (c === 34 || c === 39) {
                            step = 11;
                        }
                        else {
                            step = 4;
                        }
                    }
                    else if (!input.isEmpty()) {
                        return codec.Parser.error(codec.Diagnostic.unexpected(input));
                    }
                }
                if (step === 2) {
                    identOutput = identOutput || codec.Unicode.stringOutput();
                    while (input.isCont() && (c = input.head(), codec.Unicode.isAlpha(c) || c === 45)) {
                        input = input.step();
                        identOutput.write(c);
                    }
                    if (!input.isEmpty()) {
                        var ident = identOutput.bind();
                        identOutput = void 0;
                        switch (ident) {
                            case "italic":
                            case "oblique":
                                if (style === void 0) {
                                    style = ident;
                                }
                                else {
                                    return codec.Parser.error(codec.Diagnostic.message("reapeated font style: " + ident, input));
                                }
                                step = 3;
                                break;
                            case "small-caps":
                                if (variant === void 0) {
                                    variant = ident;
                                }
                                else {
                                    return codec.Parser.error(codec.Diagnostic.message("reapeated font variant: " + ident, input));
                                }
                                step = 3;
                                break;
                            case "bold":
                            case "bolder":
                            case "lighter":
                                if (weight === void 0) {
                                    weight = ident;
                                }
                                else {
                                    return codec.Parser.error(codec.Diagnostic.message("reapeated font weight: " + ident, input));
                                }
                                step = 3;
                                break;
                            case "ultra-condensed":
                            case "extra-condensed":
                            case "semi-condensed":
                            case "condensed":
                            case "expanded":
                            case "semi-expanded":
                            case "extra-expanded":
                            case "ultra-expanded":
                                if (stretch === void 0) {
                                    stretch = ident;
                                }
                                else {
                                    return codec.Parser.error(codec.Diagnostic.message("reapeated font stretch: " + ident, input));
                                }
                                step = 3;
                                break;
                            case "normal":
                                if (style === void 0) {
                                    style = ident;
                                }
                                else if (variant === void 0) {
                                    variant = ident;
                                }
                                else if (weight === void 0) {
                                    weight = ident;
                                }
                                else if (stretch === void 0) {
                                    stretch = ident;
                                }
                                else {
                                    return codec.Parser.error(codec.Diagnostic.message("reapeated font property: " + ident, input));
                                }
                                step = 3;
                                break;
                            case "large":
                            case "larger":
                            case "medium":
                            case "small":
                            case "smaller":
                            case "x-large":
                            case "x-small":
                            case "xx-large":
                            case "xx-small":
                                size = ident;
                                step = 5;
                                break;
                            default:
                                family = ident;
                                step = 12;
                        }
                    }
                }
                if (step === 3) {
                    if (input.isCont()) {
                        c = input.head();
                        if (codec.Unicode.isSpace(c)) {
                            input.step();
                            step = 1;
                            continue;
                        }
                        else {
                            return codec.Parser.error(codec.Diagnostic.expected("font property, size, or family", input));
                        }
                    }
                    else if (!input.isEmpty()) {
                        return codec.Parser.error(codec.Diagnostic.unexpected(input));
                    }
                }
                if (step === 4) {
                    if (!lengthParser) {
                        lengthParser = LengthParser.parse(input);
                    }
                    else {
                        lengthParser = lengthParser.feed(input);
                    }
                    if (lengthParser.isDone()) {
                        var length_1 = lengthParser.bind();
                        if (length_1.units() === "") {
                            var value = length_1.value();
                            switch (value) {
                                case 100:
                                case 200:
                                case 300:
                                case 400:
                                case 500:
                                case 600:
                                case 700:
                                case 800:
                                case 900:
                                    if (weight === void 0) {
                                        weight = String(value);
                                    }
                                    else {
                                        return codec.Parser.error(codec.Diagnostic.message("reapeated font weight: " + value, input));
                                    }
                                    break;
                                default:
                                    return codec.Parser.error(codec.Diagnostic.message("unknown font property: " + value, input));
                            }
                            step = 3;
                            continue;
                        }
                        else {
                            size = length_1;
                            lengthParser = void 0;
                            step = 5;
                        }
                    }
                    else if (lengthParser.isError()) {
                        return lengthParser.asError();
                    }
                }
                if (step === 5) {
                    if (input.isCont()) {
                        c = input.head();
                        if (codec.Unicode.isSpace(c)) {
                            input.step();
                            step = 6;
                        }
                        else if (c === 47) {
                            input.step();
                            step = 7;
                        }
                        else {
                            return codec.Parser.error(codec.Diagnostic.expected("font family", input));
                        }
                    }
                    else if (!input.isEmpty()) {
                        return codec.Parser.error(codec.Diagnostic.unexpected(input));
                    }
                }
                if (step === 6) {
                    while (input.isCont() && (c = input.head(), codec.Unicode.isSpace(c))) {
                        input.step();
                    }
                    if (input.isCont()) {
                        if (c === 47) {
                            input.step();
                            step = 7;
                        }
                        else {
                            step = 11;
                        }
                    }
                    else if (!input.isEmpty()) {
                        return codec.Parser.error(codec.Diagnostic.unexpected(input));
                    }
                }
                if (step === 7) {
                    while (input.isCont() && (c = input.head(), codec.Unicode.isSpace(c))) {
                        input.step();
                    }
                    if (input.isCont()) {
                        if (codec.Unicode.isAlpha(c)) {
                            step = 8;
                        }
                        else {
                            step = 9;
                        }
                    }
                    else if (!input.isEmpty()) {
                        return codec.Parser.error(codec.Diagnostic.unexpected(input));
                    }
                }
                if (step === 8) {
                    identOutput = identOutput || codec.Unicode.stringOutput();
                    while (input.isCont() && (c = input.head(), codec.Unicode.isAlpha(c))) {
                        input = input.step();
                        identOutput.write(c);
                    }
                    if (!input.isEmpty()) {
                        var ident = identOutput.bind();
                        identOutput = void 0;
                        switch (ident) {
                            case "normal":
                                height = ident;
                                step = 10;
                                break;
                            default:
                                return codec.Parser.error(codec.Diagnostic.message("unknown line height: " + ident, input));
                        }
                    }
                }
                if (step === 9) {
                    if (!lengthParser) {
                        lengthParser = LengthParser.parse(input);
                    }
                    else {
                        lengthParser = lengthParser.feed(input);
                    }
                    if (lengthParser.isDone()) {
                        height = lengthParser.bind();
                        lengthParser = void 0;
                        step = 10;
                    }
                    else if (lengthParser.isError()) {
                        return lengthParser.asError();
                    }
                }
                if (step === 10) {
                    if (input.isCont()) {
                        c = input.head();
                        if (codec.Unicode.isSpace(c)) {
                            input.step();
                            step = 11;
                        }
                        else {
                            return codec.Parser.error(codec.Diagnostic.expected("font family", input));
                        }
                    }
                    else if (!input.isEmpty()) {
                        return codec.Parser.error(codec.Diagnostic.unexpected(input));
                    }
                }
                if (step === 11) {
                    if (!familyParser) {
                        familyParser = FontFamilyParser.parse(input);
                    }
                    else {
                        familyParser = familyParser.feed(input);
                    }
                    if (familyParser.isDone()) {
                        if (Array.isArray(family)) {
                            family.push(familyParser.bind());
                        }
                        else if (family !== void 0) {
                            family = [family, familyParser.bind()];
                        }
                        else {
                            family = familyParser.bind();
                        }
                        familyParser = void 0;
                        step = 12;
                    }
                    else if (familyParser.isError()) {
                        return familyParser.asError();
                    }
                }
                if (step === 12) {
                    while (input.isCont() && (c = input.head(), codec.Unicode.isSpace(c))) {
                        input.step();
                    }
                    if (input.isCont() && c === 44) {
                        input.step();
                        step = 11;
                        continue;
                    }
                    else if (!input.isEmpty()) {
                        return codec.Parser.done(Font.from(style, variant, weight, stretch, size, height, family));
                    }
                }
                break;
            } while (true);
            return new FontParser(style, variant, weight, stretch, size, height, family, identOutput, lengthParser, familyParser, step);
        };
        FontParser.parseRest = function (input, style, variant, weight, stretch, size, height, family) {
            var step = family !== void 0 ? 12 : size !== void 0 ? 5 : 3;
            return FontParser.parse(input, style, variant, weight, stretch, size, height, family, void 0, void 0, void 0, step);
        };
        return FontParser;
    }(codec.Parser));
    Font.Parser = FontParser;

    var FontForm = (function (_super) {
        __extends(FontForm, _super);
        function FontForm(unit) {
            var _this = _super.call(this) || this;
            _this._unit = unit;
            return _this;
        }
        FontForm.prototype.unit = function (unit) {
            if (arguments.length === 0) {
                return this._unit;
            }
            else {
                return new FontForm(unit);
            }
        };
        FontForm.prototype.mold = function (font) {
            font = Font.fromAny(font);
            var header = structure.Record.create(7);
            if (font._style !== null) {
                header.slot("style", font._style);
            }
            if (font._variant !== null) {
                header.slot("variant", font._variant);
            }
            if (font._weight !== null) {
                header.slot("weight", font._weight);
            }
            if (font._stretch !== null) {
                header.slot("stretch", font._stretch);
            }
            if (font._size instanceof Length) {
                header.slot("size", Length.form().mold(font._size));
            }
            else if (font._size !== null) {
                header.slot("size", font._size);
            }
            if (font._height instanceof Length) {
                header.slot("height", Length.form().mold(font._height));
            }
            else if (font._height !== null) {
                header.slot("height", font._height);
            }
            if (Array.isArray(font._family)) {
                var family = structure.Record.create(font._family.length);
                for (var i = 0; i < font._family.length; i += 1) {
                    family.push(font._family[i]);
                }
                header.slot("family", family);
            }
            else {
                header.slot("family", font._family);
            }
            return structure.Record.of(structure.Attr.of("font", header));
        };
        FontForm.prototype.cast = function (item) {
            var value = item.toValue();
            var font;
            try {
                font = Font.fromValue(value);
                if (!font) {
                    var string = value.stringValue();
                    if (string !== void 0) {
                        font = Font.parse(string);
                    }
                }
            }
            catch (e) {
            }
            return font;
        };
        return FontForm;
    }(structure.Form));
    Font.Form = FontForm;

    var Transform = (function () {
        function Transform() {
        }
        Transform.prototype.translate = function (x, y) {
            return this.transform(Transform.translate(x, y));
        };
        Transform.prototype.translateX = function (x) {
            return this.transform(Transform.translateX(x));
        };
        Transform.prototype.translateY = function (y) {
            return this.transform(Transform.translateY(y));
        };
        Transform.prototype.scale = function (x, y) {
            return this.transform(Transform.scale(x, y));
        };
        Transform.prototype.scaleX = function (x) {
            return this.transform(Transform.scaleX(x));
        };
        Transform.prototype.scaleY = function (y) {
            return this.transform(Transform.scaleY(y));
        };
        Transform.prototype.rotate = function (a) {
            return this.transform(Transform.rotate(a));
        };
        Transform.prototype.skew = function (x, y) {
            return this.transform(Transform.skew(x, y));
        };
        Transform.prototype.skewX = function (x) {
            return this.transform(Transform.skewX(x));
        };
        Transform.prototype.skewY = function (y) {
            return this.transform(Transform.skewY(y));
        };
        Transform.prototype.toAttributeString = function () {
            return this.toString();
        };
        Transform.identity = function () {
            if (!Transform._identity) {
                Transform._identity = new Transform.Identity();
            }
            return Transform._identity;
        };
        Transform.translate = function (x, y) {
            return new Transform.Translate(x, y);
        };
        Transform.translateX = function (x) {
            return new Transform.Translate(x, 0);
        };
        Transform.translateY = function (y) {
            return new Transform.Translate(0, y);
        };
        Transform.scale = function (x, y) {
            return new Transform.Scale(x, y);
        };
        Transform.scaleX = function (x) {
            return new Transform.Scale(x, 1);
        };
        Transform.scaleY = function (y) {
            return new Transform.Scale(1, y);
        };
        Transform.rotate = function (a) {
            return new Transform.Rotate(a);
        };
        Transform.skew = function (x, y) {
            return new Transform.Skew(x, y);
        };
        Transform.skewX = function (x) {
            return new Transform.Skew(x, 0);
        };
        Transform.skewY = function (y) {
            return new Transform.Skew(0, y);
        };
        Transform.affine = function (x0, y0, x1, y1, tx, ty) {
            return new Transform.Affine(x0, y0, x1, y1, tx, ty);
        };
        Transform.list = function () {
            var transforms = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                transforms[_i] = arguments[_i];
            }
            return new Transform.List(transforms);
        };
        Transform.fromAny = function (value) {
            if (value instanceof Transform) {
                return value;
            }
            else if (typeof value === "string") {
                return Transform.parse(value);
            }
            else {
                throw new TypeError("" + value);
            }
        };
        Transform.fromValue = function (value) {
            var tag = value.tag();
            switch (tag) {
                case "identity": return Transform.Identity.fromValue(value);
                case "translate": return Transform.Translate.fromValue(value);
                case "scale": return Transform.Scale.fromValue(value);
                case "rotate": return Transform.Rotate.fromValue(value);
                case "skew": return Transform.Skew.fromValue(value);
                case "matrix": return Transform.Affine.fromValue(value);
                default: return Transform.List.fromValue(value);
            }
        };
        Transform.parse = function (string) {
            var input = codec.Unicode.stringInput(string);
            while (input.isCont() && codec.Unicode.isWhitespace(input.head())) {
                input = input.step();
            }
            var parser = Transform.ListParser.parse(input);
            if (parser.isDone()) {
                while (input.isCont() && codec.Unicode.isWhitespace(input.head())) {
                    input = input.step();
                }
            }
            if (input.isCont() && !parser.isError()) {
                parser = codec.Parser.error(codec.Diagnostic.unexpected(input));
            }
            return parser.bind();
        };
        Transform.form = function (unit) {
            if (unit !== void 0) {
                return new Transform.Form(Transform.fromAny(unit));
            }
            else {
                if (!Transform._form) {
                    Transform._form = new Transform.Form();
                }
                return Transform._form;
            }
        };
        return Transform;
    }());

    var IdentityTransform = (function (_super) {
        __extends(IdentityTransform, _super);
        function IdentityTransform() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        IdentityTransform.prototype.transform = function (x, y) {
            if (x instanceof Transform) {
                return x;
            }
            else {
                if (Array.isArray(x)) {
                    y = x[1];
                    x = x[0];
                }
                if (typeof x === "number" && typeof y === "number") {
                    return [x, y];
                }
                else {
                    x = Length.fromAny(x);
                    y = Length.fromAny(y);
                    return [x, y];
                }
            }
        };
        IdentityTransform.prototype.transformX = function (x, y) {
            return x;
        };
        IdentityTransform.prototype.transformY = function (x, y) {
            return y;
        };
        IdentityTransform.prototype.inverse = function () {
            return this;
        };
        IdentityTransform.prototype.toAffine = function () {
            return new Transform.Affine(1, 0, 0, 1, 0, 0);
        };
        IdentityTransform.prototype.toValue = function () {
            return structure.Record.of(structure.Attr.of("identity"));
        };
        IdentityTransform.prototype.conformsTo = function (that) {
            return that instanceof IdentityTransform;
        };
        IdentityTransform.prototype.equals = function (that) {
            return that instanceof IdentityTransform;
        };
        IdentityTransform.prototype.hashCode = function () {
            if (IdentityTransform._hashSeed === void 0) {
                IdentityTransform._hashSeed = util.Murmur3.seed(IdentityTransform);
            }
            return IdentityTransform._hashSeed;
        };
        IdentityTransform.prototype.debug = function (output) {
            output = output.write("Transform").write(46).write("identity")
                .write(40).write(41);
        };
        IdentityTransform.prototype.toString = function () {
            return "none";
        };
        IdentityTransform.fromValue = function (value) {
            if (value.tag() === "identity") {
                return Transform.identity();
            }
            return void 0;
        };
        return IdentityTransform;
    }(Transform));
    Transform.Identity = IdentityTransform;

    var TranslateTransform = (function (_super) {
        __extends(TranslateTransform, _super);
        function TranslateTransform(x, y) {
            var _this = _super.call(this) || this;
            _this._x = Length.fromAny(x);
            _this._y = Length.fromAny(y);
            return _this;
        }
        Object.defineProperty(TranslateTransform.prototype, "x", {
            get: function () {
                return this._x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TranslateTransform.prototype, "y", {
            get: function () {
                return this._y;
            },
            enumerable: true,
            configurable: true
        });
        TranslateTransform.prototype.transform = function (x, y) {
            if (x instanceof Transform) {
                if (x instanceof Transform.Identity) {
                    return this;
                }
                else {
                    return new Transform.List([this, x]);
                }
            }
            else {
                if (Array.isArray(x)) {
                    y = x[1];
                    x = x[0];
                }
                if (typeof x === "number" && typeof y === "number") {
                    return [x + this._x.pxValue(), y + this._y.pxValue()];
                }
                else {
                    x = Length.fromAny(x);
                    y = Length.fromAny(y);
                    return [x.plus(this._x), y.plus(this._y)];
                }
            }
        };
        TranslateTransform.prototype.transformX = function (x, y) {
            return x + this._x.pxValue();
        };
        TranslateTransform.prototype.transformY = function (x, y) {
            return y + this._y.pxValue();
        };
        TranslateTransform.prototype.inverse = function () {
            return new TranslateTransform(this._x.opposite(), this._y.opposite());
        };
        TranslateTransform.prototype.toAffine = function () {
            return new Transform.Affine(1, 0, 0, 1, this._x.pxValue(), this._y.pxValue());
        };
        TranslateTransform.prototype.toValue = function () {
            return structure.Record.of(structure.Attr.of("translate", structure.Record.of(structure.Slot.of("x", this._x.toString()), structure.Slot.of("y", this._y.toString()))));
        };
        TranslateTransform.prototype.conformsTo = function (that) {
            return that instanceof TranslateTransform;
        };
        TranslateTransform.prototype.equals = function (that) {
            if (that instanceof TranslateTransform) {
                return this._x.equals(that._x) && this._y.equals(that._y);
            }
            return false;
        };
        TranslateTransform.prototype.hashCode = function () {
            if (TranslateTransform._hashSeed === void 0) {
                TranslateTransform._hashSeed = util.Murmur3.seed(TranslateTransform);
            }
            return util.Murmur3.mash(util.Murmur3.mix(util.Murmur3.mix(TranslateTransform._hashSeed, this._x.hashCode()), this._y.hashCode()));
        };
        TranslateTransform.prototype.debug = function (output) {
            output = output.write("Transform").write(46).write("translate");
            if (this._x.isDefined() && !this._y.isDefined()) {
                output = output.write("X").write(40).debug(this._x).write(41);
            }
            else if (!this._x.isDefined() && this._y.isDefined()) {
                output = output.write("Y").write(40).debug(this._y).write(41);
            }
            else {
                output = output.write(40).debug(this._x).write(", ").debug(this._y).write(41);
            }
        };
        TranslateTransform.prototype.toString = function () {
            if (this._x.isDefined() && !this._y.isDefined()) {
                return "translate(" + this._x + ",0)";
            }
            else if (!this._x.isDefined() && this._y.isDefined()) {
                return "translate(0," + this._y + ")";
            }
            else {
                return "translate(" + this._x + "," + this._y + ")";
            }
        };
        TranslateTransform.prototype.toAttributeString = function () {
            if (this._x.isDefined() && !this._y.isDefined()) {
                return "translate(" + this._x.pxValue() + ",0)";
            }
            else if (!this._x.isDefined() && this._y.isDefined()) {
                return "translate(0," + this._y.pxValue() + ")";
            }
            else {
                return "translate(" + this._x.pxValue() + "," + this._y.pxValue() + ")";
            }
        };
        TranslateTransform.fromAny = function (value) {
            if (value instanceof TranslateTransform) {
                return value;
            }
            else if (typeof value === "string") {
                return TranslateTransform.parse(value);
            }
            throw new TypeError("" + value);
        };
        TranslateTransform.fromValue = function (value) {
            var header = value.header("translate");
            if (header.isDefined()) {
                var x_1 = Length.zero();
                var y_1 = Length.zero();
                header.forEach(function (item, index) {
                    var key = item.key.stringValue();
                    if (key !== void 0) {
                        if (key === "x") {
                            x_1 = item.toValue().cast(Length.form(), x_1);
                        }
                        else if (key === "y") {
                            y_1 = item.toValue().cast(Length.form(), y_1);
                        }
                    }
                    else if (item instanceof structure.Value) {
                        if (index === 0) {
                            x_1 = item.cast(Length.form(), x_1);
                        }
                        else if (index === 1) {
                            y_1 = item.cast(Length.form(), y_1);
                        }
                    }
                }, this);
                return new TranslateTransform(x_1, y_1);
            }
            return void 0;
        };
        TranslateTransform.parse = function (string) {
            var input = codec.Unicode.stringInput(string);
            while (input.isCont() && codec.Unicode.isWhitespace(input.head())) {
                input = input.step();
            }
            var parser = Transform.TranslateParser.parse(input);
            if (parser.isDone()) {
                while (input.isCont() && codec.Unicode.isWhitespace(input.head())) {
                    input = input.step();
                }
            }
            if (input.isCont() && !parser.isError()) {
                parser = codec.Parser.error(codec.Diagnostic.unexpected(input));
            }
            return parser.bind();
        };
        return TranslateTransform;
    }(Transform));
    Transform.Translate = TranslateTransform;

    var ScaleTransform = (function (_super) {
        __extends(ScaleTransform, _super);
        function ScaleTransform(x, y) {
            var _this = _super.call(this) || this;
            _this._x = +x;
            _this._y = +y;
            return _this;
        }
        Object.defineProperty(ScaleTransform.prototype, "x", {
            get: function () {
                return this._x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScaleTransform.prototype, "y", {
            get: function () {
                return this._y;
            },
            enumerable: true,
            configurable: true
        });
        ScaleTransform.prototype.transform = function (x, y) {
            if (x instanceof Transform) {
                if (x instanceof Transform.Identity) {
                    return this;
                }
                else {
                    return new Transform.List([this, x]);
                }
            }
            else {
                if (Array.isArray(x)) {
                    y = x[1];
                    x = x[0];
                }
                if (typeof x === "number" && typeof y === "number") {
                    return [x * this._x, y * this._y];
                }
                else {
                    x = Length.fromAny(x);
                    y = Length.fromAny(y);
                    return [x.times(this._x), y.times(this._y)];
                }
            }
        };
        ScaleTransform.prototype.transformX = function (x, y) {
            return x * this._x;
        };
        ScaleTransform.prototype.transformY = function (x, y) {
            return y * this._y;
        };
        ScaleTransform.prototype.inverse = function () {
            return new ScaleTransform(1 / (this._x || 1), 1 / (this._y || 1));
        };
        ScaleTransform.prototype.toAffine = function () {
            return new Transform.Affine(this._x, 0, 0, this._y, 0, 0);
        };
        ScaleTransform.prototype.toValue = function () {
            return structure.Record.of(structure.Attr.of("scale", structure.Record.of(structure.Slot.of("x", this._x), structure.Slot.of("y", this._y))));
        };
        ScaleTransform.prototype.conformsTo = function (that) {
            return that instanceof ScaleTransform;
        };
        ScaleTransform.prototype.equals = function (that) {
            if (that instanceof ScaleTransform) {
                return this._x === that._x && this._y === that._y;
            }
            return false;
        };
        ScaleTransform.prototype.hashCode = function () {
            if (ScaleTransform._hashSeed === void 0) {
                ScaleTransform._hashSeed = util.Murmur3.seed(ScaleTransform);
            }
            return util.Murmur3.mash(util.Murmur3.mix(util.Murmur3.mix(ScaleTransform._hashSeed, util.Murmur3.hash(this._x)), util.Murmur3.hash(this._y)));
        };
        ScaleTransform.prototype.debug = function (output) {
            output = output.write("Transform").write(46).write("scale");
            if (this._x && !this._y) {
                output = output.write("X").write(40).debug(this._x).write(41);
            }
            else if (!this._x && this._y) {
                output = output.write("Y").write(40).debug(this._y).write(41);
            }
            else {
                output = output.write(40).debug(this._x).write(", ").debug(this._y).write(41);
            }
        };
        ScaleTransform.prototype.toString = function () {
            if (this._x && !this._y) {
                return "scaleX(" + this._x + ")";
            }
            else if (!this._x && this._y) {
                return "scaleY(" + this._y + ")";
            }
            else {
                return "scale(" + this._x + "," + this._y + ")";
            }
        };
        ScaleTransform.fromAny = function (value) {
            if (value instanceof ScaleTransform) {
                return value;
            }
            else if (typeof value === "string") {
                return ScaleTransform.parse(value);
            }
            throw new TypeError("" + value);
        };
        ScaleTransform.fromValue = function (value) {
            var header = value.header("scale");
            if (header.isDefined()) {
                var x_1 = 0;
                var y_1 = 0;
                header.forEach(function (item, index) {
                    var key = item.key.stringValue();
                    if (key !== void 0) {
                        if (key === "x") {
                            x_1 = item.toValue().numberValue(x_1);
                        }
                        else if (key === "y") {
                            y_1 = item.toValue().numberValue(y_1);
                        }
                    }
                    else if (item instanceof structure.Value) {
                        if (index === 0) {
                            x_1 = item.numberValue(x_1);
                        }
                        else if (index === 1) {
                            y_1 = item.numberValue(y_1);
                        }
                    }
                }, this);
                return new ScaleTransform(x_1, y_1);
            }
            return void 0;
        };
        ScaleTransform.parse = function (string) {
            var input = codec.Unicode.stringInput(string);
            while (input.isCont() && codec.Unicode.isWhitespace(input.head())) {
                input = input.step();
            }
            var parser = Transform.ScaleParser.parse(input);
            if (parser.isDone()) {
                while (input.isCont() && codec.Unicode.isWhitespace(input.head())) {
                    input = input.step();
                }
            }
            if (input.isCont() && !parser.isError()) {
                parser = codec.Parser.error(codec.Diagnostic.unexpected(input));
            }
            return parser.bind();
        };
        return ScaleTransform;
    }(Transform));
    Transform.Scale = ScaleTransform;

    var RotateTransform = (function (_super) {
        __extends(RotateTransform, _super);
        function RotateTransform(a) {
            var _this = _super.call(this) || this;
            _this._a = Angle.fromAny(a, "deg");
            return _this;
        }
        Object.defineProperty(RotateTransform.prototype, "angle", {
            get: function () {
                return this._a;
            },
            enumerable: true,
            configurable: true
        });
        RotateTransform.prototype.transform = function (x, y) {
            if (x instanceof Transform) {
                if (x instanceof Transform.Identity) {
                    return this;
                }
                else {
                    return new Transform.List([this, x]);
                }
            }
            else {
                if (Array.isArray(x)) {
                    y = x[1];
                    x = x[0];
                }
                x = Length.fromAny(x);
                y = Length.fromAny(y);
                var a = this._a.radValue();
                var cosA = Math.cos(a);
                var sinA = Math.sin(a);
                if (typeof x === "number" && typeof y === "number") {
                    return [x * cosA - y * sinA,
                        x * sinA + y * cosA];
                }
                else {
                    return [x.times(cosA).minus(y.times(sinA)),
                        x.times(sinA).plus(y.times(cosA))];
                }
            }
        };
        RotateTransform.prototype.transformX = function (x, y) {
            var a = this._a.radValue();
            return x * Math.cos(a) - y * Math.sin(a);
        };
        RotateTransform.prototype.transformY = function (x, y) {
            var a = this._a.radValue();
            return x * Math.sin(a) + y * Math.cos(a);
        };
        RotateTransform.prototype.inverse = function () {
            return new RotateTransform(this._a.opposite());
        };
        RotateTransform.prototype.toAffine = function () {
            var a = this._a.radValue();
            return new Transform.Affine(Math.cos(a), Math.sin(a), -Math.sin(a), Math.cos(a), 0, 0);
        };
        RotateTransform.prototype.toValue = function () {
            return structure.Record.of(structure.Attr.of("rotate", this._a.toString()));
        };
        RotateTransform.prototype.conformsTo = function (that) {
            return that instanceof RotateTransform;
        };
        RotateTransform.prototype.equals = function (that) {
            if (that instanceof RotateTransform) {
                return this._a.equals(that._a);
            }
            return false;
        };
        RotateTransform.prototype.hashCode = function () {
            if (RotateTransform._hashSeed === void 0) {
                RotateTransform._hashSeed = util.Murmur3.seed(RotateTransform);
            }
            return util.Murmur3.mash(util.Murmur3.mix(RotateTransform._hashSeed, this._a.hashCode()));
        };
        RotateTransform.prototype.debug = function (output) {
            output = output.write("Transform").write(46).write("rotate")
                .write(40).debug(this._a).write(41);
        };
        RotateTransform.prototype.toString = function () {
            return "rotate(" + this._a + ")";
        };
        RotateTransform.fromAny = function (value) {
            if (value instanceof RotateTransform) {
                return value;
            }
            else if (typeof value === "string") {
                return RotateTransform.parse(value);
            }
            throw new TypeError("" + value);
        };
        RotateTransform.fromValue = function (value) {
            var header = value.header("rotate");
            if (header.isDefined()) {
                var a_1 = Angle.zero();
                header.forEach(function (item, index) {
                    var key = item.key.stringValue();
                    if (key === "a") {
                        a_1 = item.toValue().cast(Angle.form(), a_1);
                    }
                    else if (item instanceof structure.Value && index === 0) {
                        a_1 = item.cast(Angle.form(), a_1);
                    }
                }, this);
                return new RotateTransform(a_1);
            }
            return void 0;
        };
        RotateTransform.parse = function (string) {
            var input = codec.Unicode.stringInput(string);
            while (input.isCont() && codec.Unicode.isWhitespace(input.head())) {
                input = input.step();
            }
            var parser = Transform.RotateParser.parse(input);
            if (parser.isDone()) {
                while (input.isCont() && codec.Unicode.isWhitespace(input.head())) {
                    input = input.step();
                }
            }
            if (input.isCont() && !parser.isError()) {
                parser = codec.Parser.error(codec.Diagnostic.unexpected(input));
            }
            return parser.bind();
        };
        return RotateTransform;
    }(Transform));
    Transform.Rotate = RotateTransform;

    var SkewTransform = (function (_super) {
        __extends(SkewTransform, _super);
        function SkewTransform(x, y) {
            var _this = _super.call(this) || this;
            _this._x = Angle.fromAny(x, "deg");
            _this._y = Angle.fromAny(y, "deg");
            return _this;
        }
        Object.defineProperty(SkewTransform.prototype, "x", {
            get: function () {
                return this._x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SkewTransform.prototype, "y", {
            get: function () {
                return this._y;
            },
            enumerable: true,
            configurable: true
        });
        SkewTransform.prototype.transform = function (x, y) {
            if (x instanceof Transform) {
                if (x instanceof Transform.Identity) {
                    return this;
                }
                else {
                    return new Transform.List([this, x]);
                }
            }
            else {
                if (Array.isArray(x)) {
                    y = x[1];
                    x = x[0];
                }
                x = Length.fromAny(x);
                y = Length.fromAny(y);
                if (typeof x === "number" && typeof y === "number") {
                    return [x + y * Math.tan(this._x.radValue()),
                        x * Math.tan(this._y.radValue()) + y];
                }
                else {
                    return [x.plus(y.times(Math.tan(this._x.radValue()))),
                        x.times(Math.tan(this._y.radValue())).plus(y)];
                }
            }
        };
        SkewTransform.prototype.transformX = function (x, y) {
            return x + y * Math.tan(this._x.radValue());
        };
        SkewTransform.prototype.transformY = function (x, y) {
            return x * Math.tan(this._y.radValue()) + y;
        };
        SkewTransform.prototype.inverse = function () {
            return new SkewTransform(this._x.opposite(), this._y.opposite());
        };
        SkewTransform.prototype.toAffine = function () {
            var x = this._x.radValue();
            var y = this._y.radValue();
            return new Transform.Affine(1, Math.tan(y), Math.tan(x), 1, 0, 0);
        };
        SkewTransform.prototype.toValue = function () {
            return structure.Record.of(structure.Attr.of("skew", structure.Record.of(structure.Slot.of("x", this._x.toString()), structure.Slot.of("y", this._y.toString()))));
        };
        SkewTransform.prototype.conformsTo = function (that) {
            return that instanceof SkewTransform;
        };
        SkewTransform.prototype.equals = function (that) {
            if (that instanceof SkewTransform) {
                return this._x.equals(that._x) && this._y.equals(that._y);
            }
            return false;
        };
        SkewTransform.prototype.hashCode = function () {
            if (SkewTransform._hashSeed === void 0) {
                SkewTransform._hashSeed = util.Murmur3.seed(SkewTransform);
            }
            return util.Murmur3.mash(util.Murmur3.mix(util.Murmur3.mix(SkewTransform._hashSeed, this._x.hashCode()), this._y.hashCode()));
        };
        SkewTransform.prototype.debug = function (output) {
            output = output.write("Transform").write(46).write("skew");
            if (this._x.isDefined() && !this._y.isDefined()) {
                output = output.write("X").write(40).debug(this._x).write(41);
            }
            else if (!this._x.isDefined() && this._y.isDefined()) {
                output = output.write("Y").write(40).debug(this._y).write(41);
            }
            else {
                output = output.write(40).debug(this._x).write(", ").debug(this._y).write(41);
            }
        };
        SkewTransform.prototype.toString = function () {
            if (this._x.isDefined() && !this._y.isDefined()) {
                return "skewX(" + this._x + ")";
            }
            else if (!this._x.isDefined() && this._y.isDefined()) {
                return "skewY(" + this._y + ")";
            }
            else {
                return "skew(" + this._x + "," + this._y + ")";
            }
        };
        SkewTransform.fromAny = function (value) {
            if (value instanceof SkewTransform) {
                return value;
            }
            else if (typeof value === "string") {
                return SkewTransform.parse(value);
            }
            throw new TypeError("" + value);
        };
        SkewTransform.fromValue = function (value) {
            var header = value.header("skew");
            if (header.isDefined()) {
                var x_1 = Angle.zero();
                var y_1 = Angle.zero();
                header.forEach(function (item, index) {
                    var key = item.key.stringValue();
                    if (key !== void 0) {
                        if (key === "x") {
                            x_1 = item.toValue().cast(Angle.form(), x_1);
                        }
                        else if (key === "y") {
                            y_1 = item.toValue().cast(Angle.form(), y_1);
                        }
                    }
                    else if (item instanceof structure.Value) {
                        if (index === 0) {
                            x_1 = item.cast(Angle.form(), x_1);
                        }
                        else if (index === 1) {
                            y_1 = item.cast(Angle.form(), y_1);
                        }
                    }
                }, this);
                return new SkewTransform(x_1, y_1);
            }
            return void 0;
        };
        SkewTransform.parse = function (string) {
            var input = codec.Unicode.stringInput(string);
            while (input.isCont() && codec.Unicode.isWhitespace(input.head())) {
                input = input.step();
            }
            var parser = Transform.SkewParser.parse(input);
            if (parser.isDone()) {
                while (input.isCont() && codec.Unicode.isWhitespace(input.head())) {
                    input = input.step();
                }
            }
            if (input.isCont() && !parser.isError()) {
                parser = codec.Parser.error(codec.Diagnostic.unexpected(input));
            }
            return parser.bind();
        };
        return SkewTransform;
    }(Transform));
    Transform.Skew = SkewTransform;

    var AffineTransform = (function (_super) {
        __extends(AffineTransform, _super);
        function AffineTransform(x0, y0, x1, y1, tx, ty) {
            if (x0 === void 0) { x0 = 1; }
            if (y0 === void 0) { y0 = 0; }
            if (x1 === void 0) { x1 = 0; }
            if (y1 === void 0) { y1 = 1; }
            if (tx === void 0) { tx = 0; }
            if (ty === void 0) { ty = 0; }
            var _this = _super.call(this) || this;
            _this._x0 = +x0;
            _this._y0 = +y0;
            _this._x1 = +x1;
            _this._y1 = +y1;
            _this._tx = +tx;
            _this._ty = +ty;
            return _this;
        }
        Object.defineProperty(AffineTransform.prototype, "x0", {
            get: function () {
                return this._x0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AffineTransform.prototype, "y0", {
            get: function () {
                return this._y0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AffineTransform.prototype, "x1", {
            get: function () {
                return this._x1;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AffineTransform.prototype, "y1", {
            get: function () {
                return this._y1;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AffineTransform.prototype, "tx", {
            get: function () {
                return this._tx;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AffineTransform.prototype, "ty", {
            get: function () {
                return this._ty;
            },
            enumerable: true,
            configurable: true
        });
        AffineTransform.prototype.transform = function (x, y) {
            if (x instanceof Transform) {
                if (x instanceof Transform.Identity) {
                    return this;
                }
                else {
                    return this.multiply(x.toAffine());
                }
            }
            else {
                if (Array.isArray(x)) {
                    y = x[1];
                    x = x[0];
                }
                x = Length.fromAny(x);
                y = Length.fromAny(y);
                if (typeof x === "number" && typeof y === "number") {
                    return [x * this._x0 + y * this._x1 + this._tx,
                        x * this._y0 + y * this._y1 + this._ty];
                }
                else {
                    return [x.times(this._x0).plus(y.times(this._x1)).plus(this._tx),
                        x.times(this._y0).plus(y.times(this._y1)).plus(this._ty)];
                }
            }
        };
        AffineTransform.prototype.transformX = function (x, y) {
            return x * this._x0 + y * this._x1 + this._tx;
        };
        AffineTransform.prototype.transformY = function (x, y) {
            return x * this._y0 + y * this._y1 + this._ty;
        };
        AffineTransform.prototype.inverse = function () {
            var m00 = this._x0;
            var m10 = this._y0;
            var m01 = this._x1;
            var m11 = this._y1;
            var m02 = this._tx;
            var m12 = this._ty;
            var det = m00 * m11 - m01 * m10;
            if (Math.abs(det) >= Number.MIN_VALUE) {
                return new AffineTransform(m11 / det, -m10 / det, -m01 / det, m00 / det, (m01 * m12 - m11 * m02) / det, (m10 * m02 - m00 * m12) / det);
            }
            else {
                throw new Error("non-invertible affine transform with determinant " + det);
            }
        };
        AffineTransform.prototype.multiply = function (that) {
            var x0 = this._x0 * that._x0 + this._x1 * that._y0;
            var y0 = this._y0 * that._x0 + this._y1 * that._y0;
            var x1 = this._x0 * that._x1 + this._x1 * that._y1;
            var y1 = this._y0 * that._x1 + this._y1 * that._y1;
            var tx = this._x0 * that._tx + this._x1 * that._ty;
            var ty = this._y0 * that._tx + this._y1 * that._ty;
            return new AffineTransform(x0, y0, x1, y1, tx, ty);
        };
        AffineTransform.prototype.toAffine = function () {
            return this;
        };
        AffineTransform.prototype.toValue = function () {
            return structure.Record.of(structure.Attr.of("matrix", structure.Record.of(this._x0, this._y0, this._x1, this._y1, this._tx, this._ty)));
        };
        AffineTransform.prototype.conformsTo = function (that) {
            return that instanceof AffineTransform;
        };
        AffineTransform.prototype.equals = function (that) {
            if (that instanceof AffineTransform) {
                return this._x0 === that._x0 && this._y0 === that._y0 &&
                    this._x1 === that._x1 && this._y1 === that._y1 &&
                    this._tx === that._tx && this._ty === that._ty;
            }
            return false;
        };
        AffineTransform.prototype.hashCode = function () {
            if (AffineTransform._hashSeed === void 0) {
                AffineTransform._hashSeed = util.Murmur3.seed(AffineTransform);
            }
            return util.Murmur3.mash(util.Murmur3.mix(util.Murmur3.mix(util.Murmur3.mix(util.Murmur3.mix(util.Murmur3.mix(util.Murmur3.mix(AffineTransform._hashSeed, util.Murmur3.hash(this._x0)), util.Murmur3.hash(this._y0)), util.Murmur3.hash(this._x1)), util.Murmur3.hash(this._y1)), util.Murmur3.hash(this._tx)), util.Murmur3.hash(this._ty)));
        };
        AffineTransform.prototype.debug = function (output) {
            output = output.write("Transform").write(46).write("affine").write(40)
                .debug(this._x0).write(", ").debug(this._y0).write(", ")
                .debug(this._x1).write(", ").debug(this._y1).write(", ")
                .debug(this._tx).write(", ").debug(this._ty).write(41);
        };
        AffineTransform.prototype.toString = function () {
            return "matrix(" + this._x0 + "," + this._y0 + ","
                + this._x1 + "," + this._y1 + ","
                + this._tx + "," + this._ty + ")";
        };
        AffineTransform.identity = function () {
            if (!AffineTransform._identityMatrix) {
                AffineTransform._identityMatrix = new AffineTransform();
            }
            return AffineTransform._identityMatrix;
        };
        AffineTransform.fromAny = function (value) {
            if (value instanceof AffineTransform) {
                return value;
            }
            else if (typeof value === "string") {
                return AffineTransform.parse(value);
            }
            throw new TypeError("" + value);
        };
        AffineTransform.fromValue = function (value) {
            var header = value.header("matrix");
            if (header.isDefined()) {
                var x0_1 = 0;
                var y0_1 = 0;
                var x1_1 = 0;
                var y1_1 = 0;
                var tx_1 = 0;
                var ty_1 = 0;
                header.forEach(function (item, index) {
                    var key = item.key.stringValue();
                    if (key !== void 0) {
                        if (key === "x0") {
                            x0_1 = item.toValue().numberValue(x0_1);
                        }
                        else if (key === "y0") {
                            y0_1 = item.toValue().numberValue(y0_1);
                        }
                        else if (key === "x1") {
                            x1_1 = item.toValue().numberValue(x1_1);
                        }
                        else if (key === "y1") {
                            y1_1 = item.toValue().numberValue(y1_1);
                        }
                        else if (key === "tx") {
                            tx_1 = item.toValue().numberValue(tx_1);
                        }
                        else if (key === "ty") {
                            ty_1 = item.toValue().numberValue(ty_1);
                        }
                    }
                    else if (item instanceof structure.Value) {
                        switch (index) {
                            case 0:
                                x0_1 = item.numberValue(x0_1);
                                break;
                            case 1:
                                y0_1 = item.numberValue(y0_1);
                                break;
                            case 2:
                                x1_1 = item.numberValue(x1_1);
                                break;
                            case 3:
                                y1_1 = item.numberValue(y1_1);
                                break;
                            case 4:
                                tx_1 = item.numberValue(tx_1);
                                break;
                            case 5:
                                ty_1 = item.numberValue(ty_1);
                                break;
                            default:
                        }
                    }
                }, this);
                return new AffineTransform(x0_1, y0_1, x1_1, y1_1, tx_1, ty_1);
            }
            return void 0;
        };
        AffineTransform.parse = function (string) {
            var input = codec.Unicode.stringInput(string);
            while (input.isCont() && codec.Unicode.isWhitespace(input.head())) {
                input = input.step();
            }
            var parser = Transform.AffineParser.parse(input);
            if (parser.isDone()) {
                while (input.isCont() && codec.Unicode.isWhitespace(input.head())) {
                    input = input.step();
                }
            }
            if (input.isCont() && !parser.isError()) {
                parser = codec.Parser.error(codec.Diagnostic.unexpected(input));
            }
            return parser.bind();
        };
        return AffineTransform;
    }(Transform));
    Transform.Affine = AffineTransform;

    var TransformList = (function (_super) {
        __extends(TransformList, _super);
        function TransformList(transforms) {
            var _this = _super.call(this) || this;
            var list = [];
            for (var i = 0; i < transforms.length; i += 1) {
                var transform = Transform.fromAny(transforms[i]);
                if (transform instanceof TransformList) {
                    list.push.apply(list, transform._transforms);
                }
                else if (transform && !(transform instanceof Transform.Identity)) {
                    list.push(transform);
                }
            }
            _this._transforms = list;
            return _this;
        }
        Object.defineProperty(TransformList.prototype, "transforms", {
            get: function () {
                return this._transforms;
            },
            enumerable: true,
            configurable: true
        });
        TransformList.prototype.transform = function (x, y) {
            if (x instanceof Transform) {
                if (x instanceof Transform.Identity) {
                    return this;
                }
                else {
                    return new Transform.List([this, x]);
                }
            }
            else {
                if (Array.isArray(x)) {
                    y = x[1];
                    x = x[0];
                }
                var transforms = this._transforms;
                if (typeof x === "number" && typeof y === "number") {
                    var point = [x, y];
                    for (var i = 0, n = transforms.length; i < n; i += 1) {
                        point = transforms[i].transform(point);
                    }
                    return point;
                }
                else {
                    var point = [Length.fromAny(x), Length.fromAny(y)];
                    for (var i = 0, n = transforms.length; i < n; i += 1) {
                        point = transforms[i].transform(point);
                    }
                    return point;
                }
            }
        };
        TransformList.prototype.transformX = function (x, y) {
            var transforms = this._transforms;
            for (var i = 0, n = transforms.length; i < n; i += 1) {
                x = transforms[i].transformX(x, y);
                y = transforms[i].transformX(x, y);
            }
            return x;
        };
        TransformList.prototype.transformY = function (x, y) {
            var transforms = this._transforms;
            for (var i = 0, n = transforms.length; i < n; i += 1) {
                x = transforms[i].transformX(x, y);
                y = transforms[i].transformX(x, y);
            }
            return y;
        };
        TransformList.prototype.inverse = function () {
            var transforms = this._transforms;
            var n = transforms.length;
            var inverseTransforms = new Array(n);
            for (var i = 0; i < n; i += 1) {
                inverseTransforms[i] = transforms[n - i - 1].inverse();
            }
            return new TransformList(inverseTransforms);
        };
        TransformList.prototype.toAffine = function () {
            var matrix = AffineTransform.identity();
            var transforms = this._transforms;
            for (var i = 0, n = transforms.length; i < n; i += 1) {
                matrix = matrix.multiply(transforms[i].toAffine());
            }
            return matrix;
        };
        TransformList.prototype.toValue = function () {
            var transforms = this._transforms;
            var n = transforms.length;
            var record = structure.Record.create(n);
            for (var i = 0; i < n; i += 1) {
                record.push(transforms[i].toValue());
            }
            return record;
        };
        TransformList.prototype.conformsTo = function (that) {
            if (that instanceof TransformList) {
                var n = this._transforms.length;
                if (n === that._transforms.length) {
                    for (var i = 0; i < n; i += 1) {
                        if (!this._transforms[i].conformsTo(that._transforms[i])) {
                            return false;
                        }
                    }
                    return true;
                }
            }
            return false;
        };
        TransformList.prototype.equals = function (that) {
            if (that instanceof TransformList) {
                var n = this._transforms.length;
                if (n === that._transforms.length) {
                    for (var i = 0; i < n; i += 1) {
                        if (!this._transforms[i].equals(that._transforms[i])) {
                            return false;
                        }
                    }
                    return true;
                }
            }
            return false;
        };
        TransformList.prototype.hashCode = function () {
            if (TransformList._hashSeed === void 0) {
                TransformList._hashSeed = util.Murmur3.seed(TransformList);
            }
            var code = TransformList._hashSeed;
            var transforms = this._transforms;
            for (var i = 0, n = transforms.length; i < n; i += 1) {
                code = util.Murmur3.mix(code, transforms[i].hashCode());
            }
            return util.Murmur3.mash(code);
        };
        TransformList.prototype.debug = function (output) {
            output = output.write("Transform").write(46).write("list").write(40);
            var transforms = this._transforms;
            var n = transforms.length;
            if (n > 0) {
                output = output.debug(transforms[0]);
                for (var i = 1; i < n; i += 1) {
                    output = output.write(", ").debug(transforms[i]);
                }
            }
            output = output.write(41);
        };
        TransformList.prototype.toString = function () {
            var transforms = this._transforms;
            var n = transforms.length;
            if (n > 0) {
                var s = transforms[0].toString();
                for (var i = 1; i < n; i += 1) {
                    s = s + " " + transforms[i].toString();
                }
                return s;
            }
            else {
                return "";
            }
        };
        TransformList.prototype.toAttributeString = function () {
            var transforms = this._transforms;
            var n = transforms.length;
            if (n > 0) {
                var s = transforms[0].toAttributeString();
                for (var i = 1; i < n; i += 1) {
                    s = s + " " + transforms[i].toAttributeString();
                }
                return s;
            }
            else {
                return "";
            }
        };
        TransformList.fromAny = function (value) {
            if (value instanceof TransformList) {
                return value;
            }
            else if (typeof value === "string") {
                return TransformList.parse(value);
            }
            throw new TypeError("" + value);
        };
        TransformList.fromValue = function (value) {
            var transforms = [];
            value.forEach(function (item) {
                var transform = Transform.fromValue(item.toValue());
                if (transform) {
                    transforms.push(transform);
                }
            }, this);
            if (transforms.length) {
                return new TransformList(transforms);
            }
            return undefined;
        };
        TransformList.parse = function (string) {
            var transform = Transform.parse(string);
            if (transform instanceof TransformList) {
                return transform;
            }
            else {
                return new TransformList([transform]);
            }
        };
        return TransformList;
    }(Transform));
    Transform.List = TransformList;

    var TranslateTransformParser = (function (_super) {
        __extends(TranslateTransformParser, _super);
        function TranslateTransformParser(identOutput, xParser, yParser, step) {
            var _this = _super.call(this) || this;
            _this.identOutput = identOutput;
            _this.xParser = xParser;
            _this.yParser = yParser;
            _this.step = step;
            return _this;
        }
        TranslateTransformParser.prototype.feed = function (input) {
            return TranslateTransformParser.parse(input, this.identOutput, this.xParser, this.yParser, this.step);
        };
        TranslateTransformParser.parse = function (input, identOutput, xParser, yParser, step) {
            if (step === void 0) { step = 1; }
            var c = 0;
            if (step === 1) {
                identOutput = identOutput || codec.Unicode.stringOutput();
                while (input.isCont() && (c = input.head(), codec.Unicode.isAlpha(c))) {
                    input = input.step();
                    identOutput.write(c);
                }
                if (!input.isEmpty()) {
                    var ident = identOutput.bind();
                    switch (ident) {
                        case "translateX":
                        case "translateY":
                        case "translate":
                            step = 2;
                            break;
                        default: return codec.Parser.error(codec.Diagnostic.message("unknown transform function: " + ident, input));
                    }
                }
            }
            if (step === 2) {
                while (input.isCont() && (c = input.head(), codec.Unicode.isSpace(c))) {
                    input = input.step();
                }
                if (input.isCont() && c === 40) {
                    input.step();
                    step = 3;
                }
                else if (!input.isEmpty()) {
                    return codec.Parser.error(codec.Diagnostic.expected("(", input));
                }
            }
            if (step === 3) {
                if (!xParser) {
                    while (input.isCont() && codec.Unicode.isSpace(input.head())) {
                        input.step();
                    }
                    if (!input.isEmpty()) {
                        xParser = LengthParser.parse(input, "px");
                    }
                }
                else {
                    xParser = xParser.feed(input);
                }
                if (xParser) {
                    if (xParser.isDone()) {
                        step = 4;
                    }
                    else if (xParser.isError()) {
                        return xParser.asError();
                    }
                }
            }
            if (step === 4) {
                while (input.isCont() && codec.Unicode.isSpace(input.head())) {
                    input.step();
                }
                if (input.isCont()) {
                    c = input.head();
                    if (c === 41) {
                        input.step();
                        var ident = identOutput.bind();
                        switch (ident) {
                            case "translateX": return codec.Parser.done(Transform.translateX(xParser.bind()));
                            case "translateY": return codec.Parser.done(Transform.translateY(xParser.bind()));
                            default: return codec.Parser.error(codec.Diagnostic.message("unknown transform function: " + ident, input));
                        }
                    }
                    else if (c === 44) {
                        input.step();
                        step = 5;
                    }
                    else {
                        return codec.Parser.error(codec.Diagnostic.expected(",", input));
                    }
                }
                else if (input.isDone()) {
                    return codec.Parser.error(codec.Diagnostic.unexpected(input));
                }
            }
            if (step === 5) {
                if (!yParser) {
                    while (input.isCont() && codec.Unicode.isSpace(input.head())) {
                        input.step();
                    }
                    if (!input.isEmpty()) {
                        yParser = LengthParser.parse(input, "px");
                    }
                }
                else {
                    yParser = yParser.feed(input);
                }
                if (yParser) {
                    if (yParser.isDone()) {
                        step = 6;
                    }
                    else if (yParser.isError()) {
                        return yParser.asError();
                    }
                }
            }
            if (step === 6) {
                while (input.isCont() && codec.Unicode.isSpace(input.head())) {
                    input.step();
                }
                if (input.isCont() && input.head() === 41) {
                    input.step();
                    var ident = identOutput.bind();
                    switch (ident) {
                        case "translate": return codec.Parser.done(Transform.translate(xParser.bind(), yParser.bind()));
                        default: return codec.Parser.error(codec.Diagnostic.message("unknown transform function: " + ident, input));
                    }
                }
                else if (!input.isEmpty()) {
                    return codec.Parser.error(codec.Diagnostic.expected(")", input));
                }
            }
            return new TranslateTransformParser(identOutput, xParser, yParser, step);
        };
        TranslateTransformParser.parseRest = function (input, identOutput) {
            return TranslateTransformParser.parse(input, identOutput, void 0, void 0, 2);
        };
        return TranslateTransformParser;
    }(codec.Parser));
    Transform.TranslateParser = TranslateTransformParser;

    var ScaleTransformParser = (function (_super) {
        __extends(ScaleTransformParser, _super);
        function ScaleTransformParser(identOutput, xParser, yParser, step) {
            var _this = _super.call(this) || this;
            _this.identOutput = identOutput;
            _this.xParser = xParser;
            _this.yParser = yParser;
            _this.step = step;
            return _this;
        }
        ScaleTransformParser.prototype.feed = function (input) {
            return ScaleTransformParser.parse(input, this.identOutput, this.xParser, this.yParser, this.step);
        };
        ScaleTransformParser.parse = function (input, identOutput, xParser, yParser, step) {
            if (step === void 0) { step = 1; }
            var c = 0;
            if (step === 1) {
                identOutput = identOutput || codec.Unicode.stringOutput();
                while (input.isCont() && (c = input.head(), codec.Unicode.isAlpha(c))) {
                    input = input.step();
                    identOutput.write(c);
                }
                if (!input.isEmpty()) {
                    var ident = identOutput.bind();
                    switch (ident) {
                        case "scaleX":
                        case "scaleY":
                        case "scale":
                            step = 2;
                            break;
                        default: return codec.Parser.error(codec.Diagnostic.message("unknown transform function: " + ident, input));
                    }
                }
            }
            if (step === 2) {
                while (input.isCont() && (c = input.head(), codec.Unicode.isSpace(c))) {
                    input = input.step();
                }
                if (input.isCont() && c === 40) {
                    input.step();
                    step = 3;
                }
                else if (!input.isEmpty()) {
                    return codec.Parser.error(codec.Diagnostic.expected("(", input));
                }
            }
            if (step === 3) {
                if (!xParser) {
                    while (input.isCont() && codec.Unicode.isSpace(input.head())) {
                        input.step();
                    }
                    if (!input.isEmpty()) {
                        xParser = codec.Base10.parseNumber(input);
                    }
                }
                else {
                    xParser = xParser.feed(input);
                }
                if (xParser) {
                    if (xParser.isDone()) {
                        step = 4;
                    }
                    else if (xParser.isError()) {
                        return xParser.asError();
                    }
                }
            }
            if (step === 4) {
                while (input.isCont() && codec.Unicode.isSpace(input.head())) {
                    input.step();
                }
                if (input.isCont()) {
                    c = input.head();
                    if (c === 41) {
                        input.step();
                        var ident = identOutput.bind();
                        switch (ident) {
                            case "scaleX": return codec.Parser.done(Transform.scaleX(xParser.bind()));
                            case "scaleY": return codec.Parser.done(Transform.scaleY(xParser.bind()));
                            default: return codec.Parser.error(codec.Diagnostic.message("unknown transform function: " + ident, input));
                        }
                    }
                    else if (c === 44) {
                        input.step();
                        step = 5;
                    }
                    else {
                        return codec.Parser.error(codec.Diagnostic.expected(",", input));
                    }
                }
                else if (input.isDone()) {
                    return codec.Parser.error(codec.Diagnostic.unexpected(input));
                }
            }
            if (step === 5) {
                if (!yParser) {
                    while (input.isCont() && codec.Unicode.isSpace(input.head())) {
                        input.step();
                    }
                    if (!input.isEmpty()) {
                        yParser = codec.Base10.parseNumber(input);
                    }
                }
                else {
                    yParser = yParser.feed(input);
                }
                if (yParser) {
                    if (yParser.isDone()) {
                        step = 6;
                    }
                    else if (yParser.isError()) {
                        return yParser.asError();
                    }
                }
            }
            if (step === 6) {
                while (input.isCont() && codec.Unicode.isSpace(input.head())) {
                    input.step();
                }
                if (input.isCont() && input.head() === 41) {
                    input.step();
                    var ident = identOutput.bind();
                    switch (ident) {
                        case "scale": return codec.Parser.done(Transform.scale(xParser.bind(), yParser.bind()));
                        default: return codec.Parser.error(codec.Diagnostic.message("unknown transform function: " + ident, input));
                    }
                }
                else if (!input.isEmpty()) {
                    return codec.Parser.error(codec.Diagnostic.expected(")", input));
                }
            }
            return new ScaleTransformParser(identOutput, xParser, yParser, step);
        };
        ScaleTransformParser.parseRest = function (input, identOutput) {
            return ScaleTransformParser.parse(input, identOutput, void 0, void 0, 2);
        };
        return ScaleTransformParser;
    }(codec.Parser));
    Transform.ScaleParser = ScaleTransformParser;

    var RotateTransformParser = (function (_super) {
        __extends(RotateTransformParser, _super);
        function RotateTransformParser(identOutput, aParser, step) {
            var _this = _super.call(this) || this;
            _this.identOutput = identOutput;
            _this.aParser = aParser;
            _this.step = step;
            return _this;
        }
        RotateTransformParser.prototype.feed = function (input) {
            return RotateTransformParser.parse(input, this.identOutput, this.aParser, this.step);
        };
        RotateTransformParser.parse = function (input, identOutput, aParser, step) {
            if (step === void 0) { step = 1; }
            var c = 0;
            if (step === 1) {
                identOutput = identOutput || codec.Unicode.stringOutput();
                while (input.isCont() && (c = input.head(), codec.Unicode.isAlpha(c))) {
                    input = input.step();
                    identOutput.write(c);
                }
                if (!input.isEmpty()) {
                    var ident = identOutput.bind();
                    switch (ident) {
                        case "rotate":
                            step = 2;
                            break;
                        default: return codec.Parser.error(codec.Diagnostic.message("unknown transform function: " + ident, input));
                    }
                }
            }
            if (step === 2) {
                while (input.isCont() && (c = input.head(), codec.Unicode.isSpace(c))) {
                    input = input.step();
                }
                if (input.isCont() && c === 40) {
                    input.step();
                    step = 3;
                }
                else if (!input.isEmpty()) {
                    return codec.Parser.error(codec.Diagnostic.expected("(", input));
                }
            }
            if (step === 3) {
                if (!aParser) {
                    while (input.isCont() && codec.Unicode.isSpace(input.head())) {
                        input.step();
                    }
                    if (!input.isEmpty()) {
                        aParser = AngleParser.parse(input, "deg");
                    }
                }
                else {
                    aParser = aParser.feed(input);
                }
                if (aParser) {
                    if (aParser.isDone()) {
                        step = 4;
                    }
                    else if (aParser.isError()) {
                        return aParser.asError();
                    }
                }
            }
            if (step === 4) {
                while (input.isCont() && codec.Unicode.isSpace(input.head())) {
                    input.step();
                }
                if (input.isCont() && input.head() === 41) {
                    input.step();
                    var ident = identOutput.bind();
                    switch (ident) {
                        case "rotate": return codec.Parser.done(Transform.rotate(aParser.bind()));
                        default: return codec.Parser.error(codec.Diagnostic.message("unknown transform function: " + ident, input));
                    }
                }
                else if (!input.isEmpty()) {
                    return codec.Parser.error(codec.Diagnostic.expected(")", input));
                }
            }
            return new RotateTransformParser(identOutput, aParser, step);
        };
        RotateTransformParser.parseRest = function (input, identOutput) {
            return RotateTransformParser.parse(input, identOutput, void 0, 2);
        };
        return RotateTransformParser;
    }(codec.Parser));
    Transform.RotateParser = RotateTransformParser;

    var SkewTransformParser = (function (_super) {
        __extends(SkewTransformParser, _super);
        function SkewTransformParser(identOutput, xParser, yParser, step) {
            var _this = _super.call(this) || this;
            _this.identOutput = identOutput;
            _this.xParser = xParser;
            _this.yParser = yParser;
            _this.step = step;
            return _this;
        }
        SkewTransformParser.prototype.feed = function (input) {
            return SkewTransformParser.parse(input, this.identOutput, this.xParser, this.yParser, this.step);
        };
        SkewTransformParser.parse = function (input, identOutput, xParser, yParser, step) {
            if (step === void 0) { step = 1; }
            var c = 0;
            if (step === 1) {
                identOutput = identOutput || codec.Unicode.stringOutput();
                while (input.isCont() && (c = input.head(), codec.Unicode.isAlpha(c))) {
                    input = input.step();
                    identOutput.write(c);
                }
                if (!input.isEmpty()) {
                    var ident = identOutput.bind();
                    switch (ident) {
                        case "skewX":
                        case "skewY":
                        case "skew":
                            step = 2;
                            break;
                        default: return codec.Parser.error(codec.Diagnostic.message("unknown transform function: " + ident, input));
                    }
                }
            }
            if (step === 2) {
                while (input.isCont() && (c = input.head(), codec.Unicode.isSpace(c))) {
                    input = input.step();
                }
                if (input.isCont() && c === 40) {
                    input.step();
                    step = 3;
                }
                else if (!input.isEmpty()) {
                    return codec.Parser.error(codec.Diagnostic.expected("(", input));
                }
            }
            if (step === 3) {
                if (!xParser) {
                    while (input.isCont() && codec.Unicode.isSpace(input.head())) {
                        input.step();
                    }
                    if (!input.isEmpty()) {
                        xParser = AngleParser.parse(input, "deg");
                    }
                }
                else {
                    xParser = xParser.feed(input);
                }
                if (xParser) {
                    if (xParser.isDone()) {
                        step = 4;
                    }
                    else if (xParser.isError()) {
                        return xParser.asError();
                    }
                }
            }
            if (step === 4) {
                while (input.isCont() && codec.Unicode.isSpace(input.head())) {
                    input.step();
                }
                if (input.isCont()) {
                    c = input.head();
                    if (c === 41) {
                        input.step();
                        var ident = identOutput.bind();
                        switch (ident) {
                            case "skewX": return codec.Parser.done(Transform.skewX(xParser.bind()));
                            case "skewY": return codec.Parser.done(Transform.skewY(xParser.bind()));
                            default: return codec.Parser.error(codec.Diagnostic.message("unknown transform function: " + ident, input));
                        }
                    }
                    else if (c === 44) {
                        input.step();
                        step = 5;
                    }
                    else {
                        return codec.Parser.error(codec.Diagnostic.expected(",", input));
                    }
                }
                else if (input.isDone()) {
                    return codec.Parser.error(codec.Diagnostic.unexpected(input));
                }
            }
            if (step === 5) {
                if (!yParser) {
                    while (input.isCont() && codec.Unicode.isSpace(input.head())) {
                        input.step();
                    }
                    if (!input.isEmpty()) {
                        yParser = AngleParser.parse(input, "deg");
                    }
                }
                else {
                    yParser = yParser.feed(input);
                }
                if (yParser) {
                    if (yParser.isDone()) {
                        step = 6;
                    }
                    else if (yParser.isError()) {
                        return yParser.asError();
                    }
                }
            }
            if (step === 6) {
                while (input.isCont() && codec.Unicode.isSpace(input.head())) {
                    input.step();
                }
                if (input.isCont() && input.head() === 41) {
                    input.step();
                    var ident = identOutput.bind();
                    switch (ident) {
                        case "skew": return codec.Parser.done(Transform.skew(xParser.bind(), yParser.bind()));
                        default: return codec.Parser.error(codec.Diagnostic.message("unknown transform function: " + ident, input));
                    }
                }
                else if (!input.isEmpty()) {
                    return codec.Parser.error(codec.Diagnostic.expected(")", input));
                }
            }
            return new SkewTransformParser(identOutput, xParser, yParser, step);
        };
        SkewTransformParser.parseRest = function (input, identOutput) {
            return SkewTransformParser.parse(input, identOutput, void 0, void 0, 2);
        };
        return SkewTransformParser;
    }(codec.Parser));
    Transform.SkewParser = SkewTransformParser;

    var AffineTransformParser = (function (_super) {
        __extends(AffineTransformParser, _super);
        function AffineTransformParser(identOutput, entries, entryParser, step) {
            var _this = _super.call(this) || this;
            _this.identOutput = identOutput;
            _this.entries = entries;
            _this.entryParser = entryParser;
            _this.step = step;
            return _this;
        }
        AffineTransformParser.prototype.feed = function (input) {
            return AffineTransformParser.parse(input, this.identOutput, this.entries, this.entryParser, this.step);
        };
        AffineTransformParser.parse = function (input, identOutput, entries, entryParser, step) {
            if (entries === void 0) { entries = []; }
            if (step === void 0) { step = 1; }
            var c = 0;
            if (step === 1) {
                identOutput = identOutput || codec.Unicode.stringOutput();
                while (input.isCont() && (c = input.head(), codec.Unicode.isAlpha(c))) {
                    input = input.step();
                    identOutput.write(c);
                }
                if (!input.isEmpty()) {
                    var ident = identOutput.bind();
                    switch (ident) {
                        case "matrix":
                            step = 2;
                            break;
                        default: return codec.Parser.error(codec.Diagnostic.message("unknown transform function: " + ident, input));
                    }
                }
            }
            if (step === 2) {
                while (input.isCont() && (c = input.head(), codec.Unicode.isSpace(c))) {
                    input = input.step();
                }
                if (input.isCont() && c === 40) {
                    input.step();
                    step = 3;
                }
                else if (!input.isEmpty()) {
                    return codec.Parser.error(codec.Diagnostic.expected("(", input));
                }
            }
            do {
                if (step === 3) {
                    if (!entryParser) {
                        while (input.isCont() && codec.Unicode.isSpace(input.head())) {
                            input.step();
                        }
                        if (!input.isEmpty()) {
                            entryParser = codec.Base10.parseNumber(input);
                        }
                    }
                    else {
                        entryParser = entryParser.feed(input);
                    }
                    if (entryParser) {
                        if (entryParser.isDone()) {
                            entries.push(entryParser.bind());
                            entryParser = void 0;
                            step = 4;
                        }
                        else if (entryParser.isError()) {
                            return entryParser.asError();
                        }
                    }
                }
                if (step === 4) {
                    while (input.isCont() && codec.Unicode.isSpace(input.head())) {
                        input.step();
                    }
                    if (input.isCont()) {
                        c = input.head();
                        if (c === 41) {
                            input.step();
                            var ident = identOutput.bind();
                            switch (ident) {
                                case "matrix": return codec.Parser.done(Transform.affine.apply(Transform, entries));
                                default: return codec.Parser.error(codec.Diagnostic.message("unknown transform function: " + ident, input));
                            }
                        }
                        else if (entries.length >= 6) {
                            return codec.Parser.error(codec.Diagnostic.expected(")", input));
                        }
                        else if (c === 44) {
                            input.step();
                            step = 3;
                            continue;
                        }
                        else {
                            return codec.Parser.error(codec.Diagnostic.expected(",", input));
                        }
                    }
                    else if (input.isDone()) {
                        return codec.Parser.error(codec.Diagnostic.unexpected(input));
                    }
                }
                break;
            } while (true);
            return new AffineTransformParser(identOutput, entries, entryParser, step);
        };
        AffineTransformParser.parseRest = function (input, identOutput) {
            return AffineTransformParser.parse(input, identOutput, void 0, void 0, 2);
        };
        return AffineTransformParser;
    }(codec.Parser));
    Transform.AffineParser = AffineTransformParser;

    var TransformListParser = (function (_super) {
        __extends(TransformListParser, _super);
        function TransformListParser(transform, transformParser) {
            var _this = _super.call(this) || this;
            _this.transform = transform;
            _this.transformParser = transformParser;
            return _this;
        }
        TransformListParser.prototype.feed = function (input) {
            return TransformListParser.parse(input, this.transform, this.transformParser);
        };
        TransformListParser.parse = function (input, transform, transformParser) {
            if (transform === void 0) { transform = Transform.identity(); }
            do {
                if (!transformParser) {
                    while (input.isCont() && codec.Unicode.isSpace(input.head())) {
                        input.step();
                    }
                    if (input.isCont()) {
                        transformParser = Transform.Parser.parse(input);
                    }
                    else if (input.isDone()) {
                        return codec.Parser.done(transform);
                    }
                }
                if (transformParser) {
                    transformParser = transformParser.feed(input);
                    if (transformParser.isDone()) {
                        transform = transform.transform(transformParser.bind());
                        transformParser = void 0;
                        continue;
                    }
                    else if (transformParser.isError()) {
                        return transformParser.asError();
                    }
                }
                break;
            } while (true);
            return new TransformListParser(transform, transformParser);
        };
        return TransformListParser;
    }(codec.Parser));
    Transform.ListParser = TransformListParser;

    var TransformParser = (function (_super) {
        __extends(TransformParser, _super);
        function TransformParser(identOutput) {
            var _this = _super.call(this) || this;
            _this.identOutput = identOutput;
            return _this;
        }
        TransformParser.prototype.feed = function (input) {
            return TransformParser.parse(input, this.identOutput);
        };
        TransformParser.parse = function (input, identOutput) {
            var c = 0;
            identOutput = identOutput || codec.Unicode.stringOutput();
            while (input.isCont() && (c = input.head(), codec.Unicode.isAlpha(c))) {
                input = input.step();
                identOutput.write(c);
            }
            if (!input.isEmpty()) {
                var ident = identOutput.bind();
                switch (ident) {
                    case "translateX":
                    case "translateY":
                    case "translate": return Transform.TranslateParser.parseRest(input, identOutput);
                    case "scaleX":
                    case "scaleY":
                    case "scale": return Transform.ScaleParser.parseRest(input, identOutput);
                    case "rotate": return Transform.RotateParser.parseRest(input, identOutput);
                    case "skewX":
                    case "skewY":
                    case "skew": return Transform.SkewParser.parseRest(input, identOutput);
                    case "matrix": return Transform.AffineParser.parseRest(input, identOutput);
                    case "none": return codec.Parser.done(Transform.identity());
                    default: return codec.Parser.error(codec.Diagnostic.message("unknown transform function: " + ident, input));
                }
            }
            return new TransformParser(identOutput);
        };
        return TransformParser;
    }(codec.Parser));
    Transform.Parser = TransformParser;

    var TransformForm = (function (_super) {
        __extends(TransformForm, _super);
        function TransformForm(unit) {
            var _this = _super.call(this) || this;
            _this._unit = unit;
            return _this;
        }
        TransformForm.prototype.unit = function (unit) {
            if (arguments.length === 0) {
                return this._unit;
            }
            else {
                return new TransformForm(unit);
            }
        };
        TransformForm.prototype.mold = function (transform) {
            transform = Transform.fromAny(transform);
            return transform.toValue();
        };
        TransformForm.prototype.cast = function (item) {
            var value = item.toValue();
            try {
                if (value instanceof structure.Record) {
                    return Transform.fromValue(value);
                }
                else {
                    var string = value.stringValue(void 0);
                    if (string !== void 0) {
                        return Transform.parse(string);
                    }
                }
            }
            catch (e) {
            }
            return void 0;
        };
        return TransformForm;
    }(structure.Form));
    Transform.Form = TransformForm;

    var Interpolator = (function () {
        function Interpolator() {
        }
        Interpolator.prototype.map = function (f) {
            return new Interpolator.Map(this, f);
        };
        Interpolator.step = function (y0, y1) {
            return new Interpolator.Step(y0, y1);
        };
        Interpolator.number = function (y0, y1) {
            return new Interpolator.Number(y0, y1);
        };
        Interpolator.time = function (d0, d1) {
            return new Interpolator.DateTime(d0, d1);
        };
        Interpolator.angle = function (a0, a1) {
            return new Interpolator.Angle(a0, a1);
        };
        Interpolator.len = function (l0, l1) {
            return new Interpolator.Length(l0, l1);
        };
        Interpolator.array = function (a0, a1) {
            return new Interpolator.Array(a0, a1);
        };
        Interpolator.map = function (a, b, f) {
            return new Interpolator.Map(Interpolator.from(a, b), f);
        };
        Interpolator.interpolator = function (i0, i1) {
            return new Interpolator.Interpolator(i0, i1);
        };
        Interpolator.from = function (a, b) {
            if (a instanceof math.R2Shape || b instanceof math.R2Shape) {
                return Interpolator.shape(a, b);
            }
            else if (a instanceof time.DateTime || a instanceof Date || b instanceof time.DateTime || b instanceof Date) {
                return Interpolator.time(a, b);
            }
            else if (a instanceof Angle || b instanceof Angle) {
                return Interpolator.angle(a, b);
            }
            else if (a instanceof Length || b instanceof Length) {
                return Interpolator.len(a, b);
            }
            else if (a instanceof Color || b instanceof Color) {
                return Interpolator.color(a, b);
            }
            else if (a instanceof Transform || b instanceof Transform) {
                return Interpolator.transform(a, b);
            }
            else if (a instanceof structure.Item || b instanceof structure.Item) {
                return Interpolator.structure(a, b);
            }
            else if (typeof a === "number" || typeof b === "number") {
                return Interpolator.number(a, b);
            }
            else if (Array.isArray(a) || Array.isArray(b)) {
                return Interpolator.array(a, b);
            }
            else if (a instanceof Interpolator && b instanceof Interpolator) {
                return Interpolator.interpolator(a, b);
            }
            else {
                return Interpolator.step(a, b);
            }
        };
        Interpolator.fromAny = function (value) {
            if (value instanceof Interpolator) {
                return value;
            }
            else if (typeof value === "string") {
                switch (value) {
                    case "step": return Interpolator.step();
                    case "number": return Interpolator.number();
                    case "shape": return Interpolator.shape();
                    case "time": return Interpolator.time();
                    case "angle": return Interpolator.angle();
                    case "length": return Interpolator.len();
                    case "transform": return Interpolator.transform();
                    case "color": return Interpolator.color();
                    case "array": return Interpolator.array();
                }
            }
            throw new TypeError("" + value);
        };
        Interpolator.form = function (valueForm, unit) {
            if (valueForm === void 0) {
                valueForm = Interpolator.valueForm();
            }
            if (valueForm !== Interpolator.valueForm() || unit !== void 0) {
                return new Interpolator.Form(valueForm, unit !== void 0 ? Interpolator.fromAny(unit) : void 0);
            }
            else {
                if (!Interpolator._form) {
                    Interpolator._form = new Interpolator.Form(valueForm);
                }
                return Interpolator._form;
            }
        };
        Interpolator.valueForm = function () {
            throw new Error();
        };
        return Interpolator;
    }());

    var StepInterpolator = (function (_super) {
        __extends(StepInterpolator, _super);
        function StepInterpolator(y0, y1) {
            var _this = _super.call(this) || this;
            if (y1 === void 0) {
                y1 = y0;
            }
            else if (y0 === void 0) {
                y0 = y1;
            }
            _this.y0 = y0;
            _this.y1 = y1;
            return _this;
        }
        StepInterpolator.prototype.interpolate = function (u) {
            var v = u < 1 ? this.y0 : this.y1;
            if (v === void 0) {
                throw new TypeError();
            }
            return v;
        };
        StepInterpolator.prototype.deinterpolate = function (y) {
            return y === this.y1 ? 1 : 0;
        };
        StepInterpolator.prototype.range = function (y0, y1) {
            if (y0 === void 0) {
                if (this.y0 === void 0 || this.y1 === void 0) {
                    throw new TypeError();
                }
                return [this.y0, this.y1];
            }
            else if (y1 === void 0) {
                y0 = y0;
                return new StepInterpolator(y0[0], y0[1]);
            }
            else {
                return new StepInterpolator(y0, y1);
            }
        };
        StepInterpolator.prototype.equals = function (that) {
            if (this === that) {
                return true;
            }
            else if (that instanceof StepInterpolator) {
                return this.y0 === that.y0 && this.y1 === that.y1;
            }
            return false;
        };
        return StepInterpolator;
    }(Interpolator));
    Interpolator.Step = StepInterpolator;

    var NumberInterpolator = (function (_super) {
        __extends(NumberInterpolator, _super);
        function NumberInterpolator(y0, y1) {
            var _this = _super.call(this) || this;
            if (y0 === void 0 && y1 === void 0) {
                y1 = y0 = 0;
            }
            else if (y1 === void 0) {
                y1 = y0;
            }
            else if (y0 === void 0) {
                y0 = y1;
            }
            _this.y0 = +y0;
            _this.dy = +y1 - _this.y0;
            return _this;
        }
        NumberInterpolator.prototype.interpolate = function (u) {
            return this.y0 + this.dy * u;
        };
        NumberInterpolator.prototype.deinterpolate = function (y) {
            return this.dy ? (+y - this.y0) / this.dy : this.dy;
        };
        NumberInterpolator.prototype.range = function (y0, y1) {
            if (y0 === void 0) {
                return [this.y0, this.y0 + this.dy];
            }
            else if (y1 === void 0) {
                y0 = y0;
                return new NumberInterpolator(y0[0], y0[1]);
            }
            else {
                return new NumberInterpolator(y0, y1);
            }
        };
        NumberInterpolator.prototype.equals = function (that) {
            if (this === that) {
                return true;
            }
            else if (that instanceof NumberInterpolator) {
                return this.y0 === that.y0 && this.dy === that.dy;
            }
            return false;
        };
        return NumberInterpolator;
    }(Interpolator));
    Interpolator.Number = NumberInterpolator;

    var ShapeInterpolator = (function (_super) {
        __extends(ShapeInterpolator, _super);
        function ShapeInterpolator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ShapeInterpolator.prototype.range = function (s0, s1) {
            if (s0 === void 0) {
                return [this.interpolate(0), this.interpolate(1)];
            }
            else if (s1 === void 0) {
                s0 = s0;
                return Interpolator.shape(s0[0], s0[1]);
            }
            else {
                return Interpolator.shape(s0, s1);
            }
        };
        ShapeInterpolator.shape = function (s0, s1) {
            if (s0 === void 0 && s1 === void 0) {
                return new ShapeInterpolator.Identity();
            }
            if (s0 !== void 0) {
                s0 = math.Shape.fromAny(s0);
            }
            if (s1 !== void 0) {
                s1 = math.Shape.fromAny(s1);
            }
            if (!s0 && !s1) {
                s1 = s0 = math.PointR2.origin();
            }
            else if (!s1) {
                s1 = s0;
            }
            else if (!s0) {
                s0 = s1;
            }
            if (s0 instanceof math.PointR2 && s1 instanceof math.PointR2) {
                return new ShapeInterpolator.PointR2(s0, s1);
            }
            else if (s0 instanceof math.SegmentR2 && s1 instanceof math.SegmentR2) {
                return new ShapeInterpolator.SegmentR2(s0, s1);
            }
            else if (s0 instanceof math.BoxR2 && s1 instanceof math.BoxR2) {
                return new ShapeInterpolator.BoxR2(s0, s1);
            }
            else if (s0 instanceof math.CircleR2 && s1 instanceof math.CircleR2) {
                return new ShapeInterpolator.CircleR2(s0, s1);
            }
            else if (s0 instanceof math.R2Shape && s1 instanceof math.R2Shape) {
                if (!(s0 instanceof math.BoxR2)) {
                    s0 = new math.BoxR2(s0.xMin, s0.yMin, s0.xMax, s0.yMax);
                }
                if (!(s1 instanceof math.BoxR2)) {
                    s1 = new math.BoxR2(s1.xMin, s1.yMin, s1.xMax, s1.yMax);
                }
                return new ShapeInterpolator.BoxR2(s0, s1);
            }
            throw new TypeError(s0 + ", " + s1);
        };
        return ShapeInterpolator;
    }(Interpolator));
    Interpolator.Shape = ShapeInterpolator;
    Interpolator.shape = ShapeInterpolator.shape;

    var IdentityShapeInterpolator = (function (_super) {
        __extends(IdentityShapeInterpolator, _super);
        function IdentityShapeInterpolator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        IdentityShapeInterpolator.prototype.interpolate = function (u) {
            return math.PointR2.origin();
        };
        IdentityShapeInterpolator.prototype.deinterpolate = function (s) {
            return 0;
        };
        IdentityShapeInterpolator.prototype.equals = function (that) {
            if (this === that || that instanceof IdentityShapeInterpolator) {
                return true;
            }
            return false;
        };
        return IdentityShapeInterpolator;
    }(ShapeInterpolator));
    ShapeInterpolator.Identity = IdentityShapeInterpolator;

    var PointR2Interpolator = (function (_super) {
        __extends(PointR2Interpolator, _super);
        function PointR2Interpolator(s0, s1) {
            var _this = _super.call(this) || this;
            if (s0 !== void 0) {
                s0 = math.Shape.fromAny(s0);
            }
            if (s1 !== void 0) {
                s1 = math.Shape.fromAny(s1);
            }
            if (!s0 && !s1) {
                s1 = s0 = math.PointR2.origin();
            }
            else if (!s1) {
                s1 = s0;
            }
            else if (!s0) {
                s0 = s1;
            }
            _this.x = s0.x;
            _this.dx = s1.x - _this.x;
            _this.y = s0.y;
            _this.dy = s1.y - _this.y;
            return _this;
        }
        PointR2Interpolator.prototype.interpolate = function (u) {
            var x = this.x + this.dx * u;
            var y = this.y + this.dy * u;
            return new math.PointR2(x, y);
        };
        PointR2Interpolator.prototype.deinterpolate = function (s) {
            s = math.Shape.fromAny(s);
            if (s instanceof math.PointR2) {
                var sx = s.x - this.x;
                var sy = s.y - this.y;
                var dp = sx * this.dx + sy * this.dy;
                var lf = Math.sqrt(sx * sx + sy * sy);
                return lf ? dp / lf : lf;
            }
            return 0;
        };
        PointR2Interpolator.prototype.equals = function (that) {
            if (this === that) {
                return true;
            }
            else if (that instanceof PointR2Interpolator) {
                return this.x === that.x && this.dx === that.dx
                    && this.y === that.y && this.dy === that.dy;
            }
            return false;
        };
        return PointR2Interpolator;
    }(ShapeInterpolator));
    ShapeInterpolator.PointR2 = PointR2Interpolator;

    var SegmentR2Interpolator = (function (_super) {
        __extends(SegmentR2Interpolator, _super);
        function SegmentR2Interpolator(s0, s1) {
            var _this = _super.call(this) || this;
            if (s0 !== void 0) {
                s0 = math.Shape.fromAny(s0);
            }
            if (s1 !== void 0) {
                s1 = math.Shape.fromAny(s1);
            }
            if (!s0 && !s1) {
                s1 = s0 = new math.SegmentR2(0, 0, 0, 0);
            }
            else if (!s1) {
                s1 = s0;
            }
            else if (!s0) {
                s0 = s1;
            }
            _this.x0 = s0.x0;
            _this.dx0 = s1.x0 - _this.x0;
            _this.y0 = s0.y0;
            _this.dy0 = s1.y0 - _this.y0;
            _this.x1 = s0.x1;
            _this.dx1 = s1.x1 - _this.x1;
            _this.y1 = s0.y1;
            _this.dy1 = s1.y1 - _this.y1;
            return _this;
        }
        SegmentR2Interpolator.prototype.interpolate = function (u) {
            var x0 = this.x0 + this.dx0 * u;
            var y0 = this.y0 + this.dy0 * u;
            var x1 = this.x1 + this.dx1 * u;
            var y1 = this.y1 + this.dy1 * u;
            return new math.SegmentR2(x0, y0, x1, y1);
        };
        SegmentR2Interpolator.prototype.deinterpolate = function (s) {
            return 0;
        };
        SegmentR2Interpolator.prototype.equals = function (that) {
            if (this === that) {
                return true;
            }
            else if (that instanceof SegmentR2Interpolator) {
                return this.x0 === that.x0 && this.dx0 === that.dx0
                    && this.y0 === that.y0 && this.dy0 === that.dy0
                    && this.x1 === that.x1 && this.dx1 === that.dx1
                    && this.y1 === that.y1 && this.dy1 === that.dy1;
            }
            return false;
        };
        return SegmentR2Interpolator;
    }(ShapeInterpolator));
    ShapeInterpolator.SegmentR2 = SegmentR2Interpolator;

    var BoxR2Interpolator = (function (_super) {
        __extends(BoxR2Interpolator, _super);
        function BoxR2Interpolator(s0, s1) {
            var _this = _super.call(this) || this;
            if (s0 !== void 0) {
                s0 = math.Shape.fromAny(s0);
            }
            if (s1 !== void 0) {
                s1 = math.Shape.fromAny(s1);
            }
            if (!s0 && !s1) {
                s1 = s0 = new math.BoxR2(0, 0, 0, 0);
            }
            else if (!s1) {
                s1 = s0;
            }
            else if (!s0) {
                s0 = s1;
            }
            _this.xMin = s0.xMin;
            _this.dxMin = s1.xMin - _this.xMin;
            _this.yMin = s0.yMin;
            _this.dyMin = s1.yMin - _this.yMin;
            _this.xMax = s0.xMax;
            _this.dxMax = s1.xMax - _this.xMax;
            _this.yMax = s0.yMax;
            _this.dyMax = s1.yMax - _this.yMax;
            return _this;
        }
        BoxR2Interpolator.prototype.interpolate = function (u) {
            var xMin = this.xMin + this.dxMin * u;
            var yMin = this.yMin + this.dyMin * u;
            var xMax = this.xMax + this.dxMax * u;
            var yMax = this.yMax + this.dyMax * u;
            return new math.BoxR2(xMin, yMin, xMax, yMax);
        };
        BoxR2Interpolator.prototype.deinterpolate = function (s) {
            return 0;
        };
        BoxR2Interpolator.prototype.equals = function (that) {
            if (this === that) {
                return true;
            }
            else if (that instanceof BoxR2Interpolator) {
                return this.xMin === that.xMin && this.dxMin === that.dxMin
                    && this.yMin === that.yMin && this.dyMin === that.dyMin
                    && this.xMax === that.xMax && this.dxMax === that.dxMax
                    && this.yMax === that.yMax && this.dyMax === that.dyMax;
            }
            return false;
        };
        return BoxR2Interpolator;
    }(ShapeInterpolator));
    ShapeInterpolator.BoxR2 = BoxR2Interpolator;

    var CircleR2Interpolator = (function (_super) {
        __extends(CircleR2Interpolator, _super);
        function CircleR2Interpolator(s0, s1) {
            var _this = _super.call(this) || this;
            if (s0 !== void 0) {
                s0 = math.Shape.fromAny(s0);
            }
            if (s1 !== void 0) {
                s1 = math.Shape.fromAny(s1);
            }
            if (!s0 && !s1) {
                s1 = s0 = new math.CircleR2(0, 0, 0);
            }
            else if (!s1) {
                s1 = s0;
            }
            else if (!s0) {
                s0 = s1;
            }
            _this.cx = s0.cx;
            _this.dcx = s1.cx - _this.cx;
            _this.cy = s0.cy;
            _this.dcy = s1.cy - _this.cy;
            _this.r = s0.r;
            _this.dr = s1.r - _this.r;
            return _this;
        }
        CircleR2Interpolator.prototype.interpolate = function (u) {
            var cx = this.cx + this.dcx * u;
            var cy = this.cy + this.dcy * u;
            var r = this.r + this.dr * u;
            return new math.CircleR2(cx, cy, r);
        };
        CircleR2Interpolator.prototype.deinterpolate = function (s) {
            return 0;
        };
        CircleR2Interpolator.prototype.equals = function (that) {
            if (this === that) {
                return true;
            }
            else if (that instanceof CircleR2Interpolator) {
                return this.cx === that.cx && this.dcx === that.dcx
                    && this.cy === that.cy && this.dcy === that.dcy
                    && this.r === that.r && this.dr === that.dr;
            }
            return false;
        };
        return CircleR2Interpolator;
    }(ShapeInterpolator));
    ShapeInterpolator.CircleR2 = CircleR2Interpolator;

    var DateTimeInterpolator = (function (_super) {
        __extends(DateTimeInterpolator, _super);
        function DateTimeInterpolator(d0, d1, zone) {
            var _this = _super.call(this) || this;
            if (d0 === void 0 && d1 === void 0) {
                d1 = d0 = 0;
            }
            else if (d1 === void 0) {
                d1 = d0;
            }
            else if (d0 === void 0) {
                d0 = d1;
            }
            d0 = time.DateTime.fromAny(d0);
            d1 = time.DateTime.fromAny(d1);
            _this.t0 = d0.time();
            _this.dt = d1.time() - _this.t0;
            _this.zone = zone || d0.zone();
            return _this;
        }
        DateTimeInterpolator.prototype.interpolate = function (u) {
            return new time.DateTime(this.t0 + this.dt * u, this.zone);
        };
        DateTimeInterpolator.prototype.deinterpolate = function (d) {
            d = time.DateTime.time(d);
            return this.dt ? (d - this.t0) / this.dt : this.dt;
        };
        DateTimeInterpolator.prototype.range = function (t0, t1) {
            if (t0 === void 0) {
                return [new time.DateTime(this.t0, this.zone), new time.DateTime(this.t0 + this.dt, this.zone)];
            }
            else if (t1 === void 0) {
                t0 = t0;
                return new DateTimeInterpolator(t0[0], t0[1], this.zone);
            }
            else {
                return new DateTimeInterpolator(t0, t1, this.zone);
            }
        };
        DateTimeInterpolator.prototype.equals = function (that) {
            if (this === that) {
                return true;
            }
            else if (that instanceof DateTimeInterpolator) {
                return this.t0 === that.t0 && this.dt === that.dt;
            }
            return false;
        };
        return DateTimeInterpolator;
    }(Interpolator));
    Interpolator.DateTime = DateTimeInterpolator;

    var AngleInterpolator = (function (_super) {
        __extends(AngleInterpolator, _super);
        function AngleInterpolator(a0, a1) {
            var _this = _super.call(this) || this;
            if (a0 !== void 0) {
                a0 = Angle.fromAny(a0);
            }
            if (a1 !== void 0) {
                a1 = Angle.fromAny(a1);
            }
            if (!a0 && !a1) {
                a1 = a0 = Angle.zero();
            }
            else if (!a1) {
                a1 = a0;
            }
            else if (!a0) {
                a0 = a1;
            }
            else {
                a0 = a0.to(a1.units());
            }
            _this.v0 = a0.value();
            _this.dv = a1.value() - _this.v0;
            _this.units = a1.units();
            return _this;
        }
        AngleInterpolator.prototype.interpolate = function (u) {
            return Angle.from(this.v0 + this.dv * u, this.units);
        };
        AngleInterpolator.prototype.deinterpolate = function (a) {
            var v = Angle.fromAny(a).toValue(this.units);
            return this.dv ? (v - this.v0) / this.dv : this.dv;
        };
        AngleInterpolator.prototype.range = function (a0, a1) {
            if (a0 === void 0) {
                return [Angle.from(this.v0, this.units), Angle.from(this.v0 + this.dv, this.units)];
            }
            else if (a1 === void 0) {
                a0 = a0;
                return new AngleInterpolator(a0[0], a0[1]);
            }
            else {
                return new AngleInterpolator(a0, a1);
            }
        };
        AngleInterpolator.prototype.equals = function (that) {
            if (this === that) {
                return true;
            }
            else if (that instanceof AngleInterpolator) {
                return this.v0 === that.v0 && this.dv === that.dv && this.units === that.units;
            }
            return false;
        };
        return AngleInterpolator;
    }(Interpolator));
    Interpolator.Angle = AngleInterpolator;

    var LengthInterpolator = (function (_super) {
        __extends(LengthInterpolator, _super);
        function LengthInterpolator(l0, l1) {
            var _this = _super.call(this) || this;
            if (l0 !== void 0) {
                l0 = Length.fromAny(l0);
            }
            if (l1 !== void 0) {
                l1 = Length.fromAny(l1);
            }
            if (!l1 && !l1) {
                l1 = l0 = Length.zero();
            }
            else if (!l1) {
                l1 = l0;
            }
            else if (!l0) {
                l0 = l1;
            }
            else {
                l0 = l0.to(l1.units());
            }
            _this.v0 = l0.value();
            _this.dv = l1.value() - _this.v0;
            _this.units = l1.units();
            return _this;
        }
        LengthInterpolator.prototype.interpolate = function (u) {
            return Length.from(this.v0 + this.dv * u, this.units);
        };
        LengthInterpolator.prototype.deinterpolate = function (l) {
            var v = Length.fromAny(l).toValue(this.units);
            return this.dv ? (v - this.v0) / this.dv : this.dv;
        };
        LengthInterpolator.prototype.range = function (l0, l1) {
            if (l0 === void 0) {
                return [Length.from(this.v0, this.units), Length.from(this.v0 + this.dv, this.units)];
            }
            else if (l1 === void 0) {
                l0 = l0;
                return new LengthInterpolator(l0[0], l0[1]);
            }
            else {
                return new LengthInterpolator(l0, l1);
            }
        };
        LengthInterpolator.prototype.equals = function (that) {
            if (this === that) {
                return true;
            }
            else if (that instanceof LengthInterpolator) {
                return this.v0 === that.v0 && this.dv === that.dv && this.units === that.units;
            }
            return false;
        };
        return LengthInterpolator;
    }(Interpolator));
    Interpolator.Length = LengthInterpolator;

    var ColorInterpolator = (function (_super) {
        __extends(ColorInterpolator, _super);
        function ColorInterpolator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ColorInterpolator.prototype.range = function (c0, c1) {
            if (c0 === void 0) {
                return [this.interpolate(0), this.interpolate(1)];
            }
            else if (c1 === void 0) {
                c0 = c0;
                return Interpolator.color(c0[0], c0[1]);
            }
            else {
                return Interpolator.color(c0, c1);
            }
        };
        ColorInterpolator.color = function (c0, c1) {
            if (c0 === void 0 && c1 === void 0) {
                return new ColorInterpolator.Identity();
            }
            if (c0 !== void 0) {
                c0 = Color.fromAny(c0);
            }
            if (c1 !== void 0) {
                c1 = Color.fromAny(c1);
            }
            if (!c0 && !c1) {
                c1 = c0 = Color.transparent();
            }
            else if (!c1) {
                c1 = c0;
            }
            else if (!c0) {
                c0 = c1;
            }
            if (c0 instanceof HslColor && c1 instanceof HslColor) {
                return ColorInterpolator.hsl(c0, c1);
            }
            else {
                return ColorInterpolator.rgb(c0.rgb(), c1.rgb());
            }
        };
        ColorInterpolator.rgb = function (c0, c1) {
            return new ColorInterpolator.Rgb(c0, c1);
        };
        ColorInterpolator.hsl = function (c0, c1) {
            return new ColorInterpolator.Hsl(c0, c1);
        };
        return ColorInterpolator;
    }(Interpolator));
    Interpolator.Color = ColorInterpolator;
    Interpolator.color = ColorInterpolator.color;

    var IdentityColorInterpolator = (function (_super) {
        __extends(IdentityColorInterpolator, _super);
        function IdentityColorInterpolator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        IdentityColorInterpolator.prototype.interpolate = function (u) {
            return Color.transparent();
        };
        IdentityColorInterpolator.prototype.deinterpolate = function (f) {
            return 0;
        };
        IdentityColorInterpolator.prototype.equals = function (that) {
            if (this === that || that instanceof IdentityColorInterpolator) {
                return true;
            }
            return false;
        };
        return IdentityColorInterpolator;
    }(ColorInterpolator));
    ColorInterpolator.Identity = IdentityColorInterpolator;

    var RgbColorInterpolator = (function (_super) {
        __extends(RgbColorInterpolator, _super);
        function RgbColorInterpolator(c0, c1) {
            var _this = _super.call(this) || this;
            if (c0 !== void 0) {
                c0 = Color.rgb(c0);
            }
            if (c1 !== void 0) {
                c1 = Color.rgb(c1);
            }
            if (!c0 && !c1) {
                c1 = c0 = RgbColor.transparent();
            }
            else if (!c1) {
                c1 = c0;
            }
            else if (!c0) {
                c0 = c1;
            }
            _this.r0 = c0.r;
            _this.dr = c1.r - _this.r0;
            _this.g0 = c0.g;
            _this.dg = c1.g - _this.g0;
            _this.b0 = c0.b;
            _this.db = c1.b - _this.b0;
            _this.a0 = c0.a;
            _this.da = c1.a - _this.a0;
            return _this;
        }
        RgbColorInterpolator.prototype.interpolate = function (u) {
            var r = this.r0 + this.dr * u;
            var g = this.g0 + this.dg * u;
            var b = this.b0 + this.db * u;
            var a = this.a0 + this.da * u;
            return new RgbColor(r, g, b, a);
        };
        RgbColorInterpolator.prototype.deinterpolate = function (c) {
            c = Color.rgb(c);
            var cr = c.r - this.r0;
            var cg = c.g - this.g0;
            var cb = c.b - this.b0;
            var ca = c.a - this.a0;
            var dp = cr * this.dr + cg * this.dg + cb * this.db + ca * this.da;
            var lc = Math.sqrt(cr * cr + cg * cg + cb * cb + ca * ca);
            return lc ? dp / lc : lc;
        };
        RgbColorInterpolator.prototype.equals = function (that) {
            if (this === that) {
                return true;
            }
            else if (that instanceof RgbColorInterpolator) {
                return this.r0 === that.r0 && this.dr === that.dr
                    && this.g0 === that.g0 && this.dg === that.dg
                    && this.b0 === that.b0 && this.db === that.db
                    && this.a0 === that.a0 && this.da === that.da;
            }
            return false;
        };
        return RgbColorInterpolator;
    }(ColorInterpolator));
    ColorInterpolator.Rgb = RgbColorInterpolator;

    var HslColorInterpolator = (function (_super) {
        __extends(HslColorInterpolator, _super);
        function HslColorInterpolator(c0, c1) {
            var _this = _super.call(this) || this;
            if (c0 !== void 0) {
                c0 = Color.hsl(c0);
            }
            if (c1 !== void 0) {
                c1 = Color.hsl(c1);
            }
            if (!c0 && !c1) {
                c1 = c0 = HslColor.transparent();
            }
            else if (!c1) {
                c1 = c0;
            }
            else if (!c0) {
                c0 = c1;
            }
            _this.h0 = c0.h;
            _this.dh = c1.h - _this.h0;
            _this.s0 = c0.s;
            _this.ds = c1.s - _this.s0;
            _this.l0 = c0.l;
            _this.dl = c1.l - _this.l0;
            _this.a0 = c0.a;
            _this.da = c1.a - _this.a0;
            return _this;
        }
        HslColorInterpolator.prototype.interpolate = function (u) {
            var h = this.h0 + this.dh * u;
            var s = this.s0 + this.ds * u;
            var l = this.l0 + this.dl * u;
            var a = this.a0 + this.da * u;
            return new HslColor(h, s, l, a);
        };
        HslColorInterpolator.prototype.deinterpolate = function (c) {
            c = Color.hsl(c);
            var ch = c.h - this.h0;
            var cs = c.s - this.s0;
            var cl = c.l - this.l0;
            var ca = c.a - this.a0;
            var dp = ch * this.dh + cs * this.ds + cl * this.dl + ca * this.da;
            var lc = Math.sqrt(ch * ch + cs * cs + cl * cl + ca * ca);
            return lc ? dp / lc : lc;
        };
        HslColorInterpolator.prototype.equals = function (that) {
            if (this === that) {
                return true;
            }
            else if (that instanceof HslColorInterpolator) {
                return this.h0 === that.h0 && this.dh === that.dh
                    && this.s0 === that.s0 && this.ds === that.ds
                    && this.l0 === that.l0 && this.dl === that.dl
                    && this.a0 === that.a0 && this.da === that.da;
            }
            return false;
        };
        return HslColorInterpolator;
    }(ColorInterpolator));
    ColorInterpolator.Hsl = HslColorInterpolator;

    var TransformInterpolator = (function (_super) {
        __extends(TransformInterpolator, _super);
        function TransformInterpolator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TransformInterpolator.prototype.range = function (f0, f1) {
            if (f0 === void 0) {
                return [this.interpolate(0), this.interpolate(1)];
            }
            else if (f1 === void 0) {
                f0 = f0;
                return Interpolator.transform(f0[0], f0[1]);
            }
            else {
                return Interpolator.transform(f0, f1);
            }
        };
        TransformInterpolator.transform = function (f0, f1) {
            if (f0 === void 0 && f1 === void 0) {
                return new TransformInterpolator.Identity();
            }
            if (f0 !== void 0) {
                f0 = Transform.fromAny(f0);
            }
            if (f1 !== void 0) {
                f1 = Transform.fromAny(f1);
            }
            if (!f0 && !f1) {
                f1 = f0 = Transform.identity();
            }
            else if (!f1) {
                f1 = f0;
            }
            else if (!f0) {
                f0 = f1;
            }
            if (f0 instanceof TranslateTransform && f1 instanceof TranslateTransform) {
                return TransformInterpolator.translate(f0, f1);
            }
            else if (f0 instanceof ScaleTransform && f1 instanceof ScaleTransform) {
                return TransformInterpolator.scale(f0, f1);
            }
            else if (f0 instanceof RotateTransform && f1 instanceof RotateTransform) {
                return TransformInterpolator.rotate(f0, f1);
            }
            else if (f0 instanceof SkewTransform && f1 instanceof SkewTransform) {
                return TransformInterpolator.skew(f0, f1);
            }
            else if (f0 instanceof TransformList && f1 instanceof TransformList) {
                if (f0.conformsTo(f1)) {
                    return TransformInterpolator.list(f0, f1);
                }
            }
            return TransformInterpolator.affine(f0.toAffine(), f1.toAffine());
        };
        TransformInterpolator.translate = function (f0, f1) {
            return new TransformInterpolator.Translate(f0, f1);
        };
        TransformInterpolator.scale = function (f0, f1) {
            return new TransformInterpolator.Scale(f0, f1);
        };
        TransformInterpolator.rotate = function (f0, f1) {
            return new TransformInterpolator.Rotate(f0, f1);
        };
        TransformInterpolator.skew = function (f0, f1) {
            return new TransformInterpolator.Skew(f0, f1);
        };
        TransformInterpolator.affine = function (f0, f1) {
            return new TransformInterpolator.Affine(f0, f1);
        };
        TransformInterpolator.list = function (f0, f1) {
            return new TransformInterpolator.List(f0, f1);
        };
        return TransformInterpolator;
    }(Interpolator));
    Interpolator.Transform = TransformInterpolator;
    Interpolator.transform = TransformInterpolator.transform;

    var IdentityTransformInterpolator = (function (_super) {
        __extends(IdentityTransformInterpolator, _super);
        function IdentityTransformInterpolator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        IdentityTransformInterpolator.prototype.interpolate = function (u) {
            return Transform.identity();
        };
        IdentityTransformInterpolator.prototype.deinterpolate = function (f) {
            return 0;
        };
        IdentityTransformInterpolator.prototype.equals = function (that) {
            if (this === that || that instanceof IdentityTransformInterpolator) {
                return true;
            }
            return false;
        };
        return IdentityTransformInterpolator;
    }(TransformInterpolator));
    TransformInterpolator.Identity = IdentityTransformInterpolator;

    var TranslateTransformInterpolator = (function (_super) {
        __extends(TranslateTransformInterpolator, _super);
        function TranslateTransformInterpolator(f0, f1) {
            var _this = _super.call(this) || this;
            var x0;
            var y0;
            if (f0 !== void 0) {
                f0 = TranslateTransform.fromAny(f0);
                x0 = f0.x;
                y0 = f0.y;
            }
            else {
                x0 = void 0;
                y0 = void 0;
            }
            var x1;
            var y1;
            if (f1 !== void 0) {
                f1 = TranslateTransform.fromAny(f1);
                x1 = f1.x;
                y1 = f1.y;
            }
            else {
                x1 = void 0;
                y1 = void 0;
            }
            if (!x0 && !x1) {
                x1 = x0 = Length.zero();
            }
            else if (!x1) {
                x1 = x0;
            }
            else if (!x0) {
                x0 = x1;
            }
            else {
                x0 = x0.to(x1.units());
            }
            if (!y0 && !y1) {
                y1 = y0 = Length.zero();
            }
            else if (!y1) {
                y1 = y0;
            }
            else if (!y0) {
                y0 = y1;
            }
            else {
                y0 = y0.to(y1.units());
            }
            _this.x0 = x0.value();
            _this.dx = x1.value() - _this.x0;
            _this.xUnits = x1.units();
            _this.y0 = y0.value();
            _this.dy = y1.value() - _this.y0;
            _this.yUnits = y1.units();
            return _this;
        }
        TranslateTransformInterpolator.prototype.interpolate = function (u) {
            var x = Length.from(this.x0 + this.dx * u, this.xUnits);
            var y = Length.from(this.y0 + this.dy * u, this.yUnits);
            return new TranslateTransform(x, y);
        };
        TranslateTransformInterpolator.prototype.deinterpolate = function (f) {
            f = Transform.fromAny(f);
            if (f instanceof TranslateTransform) {
                var units = f.x.units();
                var x0 = Length.fromAny(this.x0, this.xUnits).toValue(units);
                var y0 = Length.fromAny(this.y0, this.yUnits).toValue(units);
                var dx = Length.fromAny(this.dx, this.xUnits).toValue(units);
                var dy = Length.fromAny(this.dy, this.yUnits).toValue(units);
                var fx = f.x.toValue(units) - x0;
                var fy = f.y.toValue(units) - y0;
                var dp = fx * dx + fy * dy;
                var lf = Math.sqrt(fx * fx + fy * fy);
                return lf ? dp / lf : lf;
            }
            return 0;
        };
        TranslateTransformInterpolator.prototype.equals = function (that) {
            if (this === that) {
                return true;
            }
            else if (that instanceof TranslateTransformInterpolator) {
                return this.x0 === that.x0 && this.dx === that.dx && this.xUnits === that.xUnits
                    && this.y0 === that.y0 && this.dy === that.dy && this.yUnits === that.yUnits;
            }
            return false;
        };
        return TranslateTransformInterpolator;
    }(TransformInterpolator));
    TransformInterpolator.Translate = TranslateTransformInterpolator;

    var ScaleTransformInterpolator = (function (_super) {
        __extends(ScaleTransformInterpolator, _super);
        function ScaleTransformInterpolator(f0, f1) {
            var _this = _super.call(this) || this;
            var x0;
            var y0;
            if (f0 !== void 0) {
                f0 = ScaleTransform.fromAny(f0);
                x0 = f0.x;
                y0 = f0.y;
            }
            else {
                x0 = void 0;
                y0 = void 0;
            }
            var x1;
            var y1;
            if (f1 !== void 0) {
                f1 = ScaleTransform.fromAny(f1);
                x1 = f1.x;
                y1 = f1.y;
            }
            else {
                x1 = void 0;
                y1 = void 0;
            }
            if (x0 === void 0 && !x1) {
                x1 = x0 = 1;
            }
            else if (x1 === void 0) {
                x1 = x0;
            }
            else if (x0 === void 0) {
                x0 = x1;
            }
            if (y0 === void 0 && y1 === void 0) {
                y1 = y0 = 1;
            }
            else if (y1 === void 0) {
                y1 = y0;
            }
            else if (y0 === void 0) {
                y0 = y1;
            }
            _this.x0 = x0;
            _this.dx = x1 - _this.x0;
            _this.y0 = y0;
            _this.dy = y1 - _this.y0;
            return _this;
        }
        ScaleTransformInterpolator.prototype.interpolate = function (u) {
            var x = this.x0 + this.dx * u;
            var y = this.y0 + this.dy * u;
            return new ScaleTransform(x, y);
        };
        ScaleTransformInterpolator.prototype.deinterpolate = function (f) {
            f = Transform.fromAny(f);
            if (f instanceof ScaleTransform) {
                var fx = f.x - this.x0;
                var fy = f.y - this.y0;
                var dp = fx * this.dx + fy * this.dy;
                var lf = Math.sqrt(fx * fx + fy * fy);
                return lf ? dp / lf : lf;
            }
            return 0;
        };
        ScaleTransformInterpolator.prototype.equals = function (that) {
            if (this === that) {
                return true;
            }
            else if (that instanceof ScaleTransformInterpolator) {
                return this.x0 === that.x0 && this.dx === that.dx
                    && this.y0 === that.y0 && this.dy === that.dy;
            }
            return false;
        };
        return ScaleTransformInterpolator;
    }(TransformInterpolator));
    TransformInterpolator.Scale = ScaleTransformInterpolator;

    var RotateTransformInterpolator = (function (_super) {
        __extends(RotateTransformInterpolator, _super);
        function RotateTransformInterpolator(f0, f1) {
            var _this = _super.call(this) || this;
            var a0;
            if (f0 !== void 0) {
                f0 = RotateTransform.fromAny(f0);
                a0 = f0.angle;
            }
            else {
                a0 = void 0;
            }
            var a1;
            if (f1 !== void 0) {
                f1 = RotateTransform.fromAny(f1);
                a1 = f1.angle;
            }
            else {
                a1 = void 0;
            }
            if (!a0 && !a1) {
                a1 = a0 = Angle.zero();
            }
            else if (!a1) {
                a1 = a0;
            }
            else if (!a0) {
                a0 = a1;
            }
            else {
                a0 = a0.to(a1.units());
            }
            _this.v0 = a0.value();
            _this.dv = a1.value() - _this.v0;
            _this.units = a1.units();
            return _this;
        }
        RotateTransformInterpolator.prototype.interpolate = function (u) {
            var a = Angle.from(this.v0 + this.dv * u, this.units);
            return new RotateTransform(a);
        };
        RotateTransformInterpolator.prototype.deinterpolate = function (f) {
            f = Transform.fromAny(f);
            if (f instanceof RotateTransform) {
                var v = f.angle.toValue(this.units);
                return this.dv ? (v - this.v0) / this.dv : this.dv;
            }
            return 0;
        };
        RotateTransformInterpolator.prototype.equals = function (that) {
            if (this === that) {
                return true;
            }
            else if (that instanceof RotateTransformInterpolator) {
                return this.v0 === that.v0 && this.dv === that.dv && this.units === that.units;
            }
            return false;
        };
        return RotateTransformInterpolator;
    }(TransformInterpolator));
    TransformInterpolator.Rotate = RotateTransformInterpolator;

    var SkewTransformInterpolator = (function (_super) {
        __extends(SkewTransformInterpolator, _super);
        function SkewTransformInterpolator(f0, f1) {
            var _this = _super.call(this) || this;
            var x0;
            var y0;
            if (f0 !== void 0) {
                f0 = SkewTransform.fromAny(f0);
                x0 = f0.x;
                y0 = f0.y;
            }
            else {
                x0 = void 0;
                y0 = void 0;
            }
            var x1;
            var y1;
            if (f1 !== void 0) {
                f1 = SkewTransform.fromAny(f1);
                x1 = f1.x;
                y1 = f1.y;
            }
            else {
                x1 = void 0;
                y1 = void 0;
            }
            if (!x0 && !x1) {
                x1 = x0 = Angle.zero();
            }
            else if (!x1) {
                x1 = x0;
            }
            else if (!x0) {
                x0 = x1;
            }
            else {
                x0 = x0.to(x1.units());
            }
            if (!y0 && !y1) {
                y1 = y0 = Angle.zero();
            }
            else if (!y1) {
                y1 = y0;
            }
            else if (!y0) {
                y0 = y1;
            }
            else {
                y0 = y0.to(y1.units());
            }
            _this.x0 = x0.value();
            _this.dx = x1.value() - _this.x0;
            _this.xUnits = x1.units();
            _this.y0 = y0.value();
            _this.dy = y1.value() - _this.y0;
            _this.yUnits = y1.units();
            return _this;
        }
        SkewTransformInterpolator.prototype.interpolate = function (u) {
            var x = Angle.from(this.x0 + this.dx * u, this.xUnits);
            var y = Angle.from(this.y0 + this.dy * u, this.yUnits);
            return new SkewTransform(x, y);
        };
        SkewTransformInterpolator.prototype.deinterpolate = function (f) {
            f = Transform.fromAny(f);
            if (f instanceof SkewTransform) {
                var units = f.x.units();
                var x0 = Angle.fromAny(this.x0, this.xUnits).toValue(units);
                var y0 = Angle.fromAny(this.y0, this.yUnits).toValue(units);
                var dx = Angle.fromAny(this.dx, this.xUnits).toValue(units);
                var dy = Angle.fromAny(this.dy, this.yUnits).toValue(units);
                var fx = f.x.toValue(units) - x0;
                var fy = f.y.toValue(units) - y0;
                var dp = fx * dx + fy * dy;
                var lf = Math.sqrt(fx * fx + fy * fy);
                return lf ? dp / lf : lf;
            }
            return 0;
        };
        SkewTransformInterpolator.prototype.equals = function (that) {
            if (this === that) {
                return true;
            }
            else if (that instanceof SkewTransformInterpolator) {
                return this.x0 === that.x0 && this.dx === that.dx && this.xUnits === that.xUnits
                    && this.y0 === that.y0 && this.dy === that.dy && this.yUnits === that.yUnits;
            }
            return false;
        };
        return SkewTransformInterpolator;
    }(TransformInterpolator));
    TransformInterpolator.Skew = SkewTransformInterpolator;

    var AffineTransformInterpolator = (function (_super) {
        __extends(AffineTransformInterpolator, _super);
        function AffineTransformInterpolator(f0, f1) {
            var _this = _super.call(this) || this;
            if (f0 !== void 0) {
                f0 = AffineTransform.fromAny(f0);
            }
            if (f1 !== void 0) {
                f1 = AffineTransform.fromAny(f1);
            }
            if (!f0 && !f1) {
                f1 = f0 = new AffineTransform();
            }
            else if (!f1) {
                f1 = f0;
            }
            else if (!f0) {
                f0 = f1;
            }
            _this.f0 = f0;
            _this.f1 = f1;
            return _this;
        }
        AffineTransformInterpolator.prototype.interpolate = function (u) {
            return this.f1;
        };
        AffineTransformInterpolator.prototype.deinterpolate = function (f) {
            return 0;
        };
        AffineTransformInterpolator.prototype.equals = function (that) {
            if (this === that) {
                return true;
            }
            else if (that instanceof AffineTransformInterpolator) {
                return this.f0.equals(that.f0) && this.f1.equals(that.f1);
            }
            return false;
        };
        return AffineTransformInterpolator;
    }(TransformInterpolator));
    TransformInterpolator.Affine = AffineTransformInterpolator;

    var TransformListInterpolator = (function (_super) {
        __extends(TransformListInterpolator, _super);
        function TransformListInterpolator(f0, f1) {
            var _this = _super.call(this) || this;
            if (f0 !== void 0) {
                f0 = TransformList.fromAny(f0);
            }
            if (f1 !== void 0) {
                f1 = TransformList.fromAny(f1);
            }
            if (!f0 && !f1) {
                f1 = f0 = new TransformList([]);
            }
            else if (!f1) {
                f1 = f0;
            }
            else if (!f0) {
                f0 = f1;
            }
            _this.interpolators = [];
            var n = Math.min(f0.transforms.length, f1.transforms.length);
            for (var i = 0; i < n; i += 1) {
                _this.interpolators.push(Interpolator.transform(f0.transforms[i], f1.transforms[i]));
            }
            return _this;
        }
        TransformListInterpolator.prototype.interpolate = function (u) {
            var transforms = [];
            for (var i = 0; i < this.interpolators.length; i += 1) {
                transforms.push(this.interpolators[i].interpolate(u));
            }
            return new TransformList(transforms);
        };
        TransformListInterpolator.prototype.deinterpolate = function (f) {
            return 0;
        };
        TransformListInterpolator.prototype.equals = function (that) {
            if (this === that) {
                return true;
            }
            else if (that instanceof TransformListInterpolator) {
                var n = this.interpolators.length;
                if (n === that.interpolators.length) {
                    for (var i = 0; i < n; i += 1) {
                        if (!this.interpolators[i].equals(that.interpolators[i])) {
                            return false;
                        }
                    }
                    return true;
                }
            }
            return false;
        };
        return TransformListInterpolator;
    }(TransformInterpolator));

    var StructureInterpolator = (function (_super) {
        __extends(StructureInterpolator, _super);
        function StructureInterpolator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        StructureInterpolator.prototype.range = function (i0, i1) {
            if (i0 === void 0) {
                return [this.interpolate(0), this.interpolate(1)];
            }
            else if (i1 === void 0) {
                i0 = i0;
                return Interpolator.structure(i0[0], i0[1]);
            }
            else {
                return Interpolator.structure(i0, i1);
            }
        };
        StructureInterpolator.structure = function (i0, i1) {
            if (i0 === void 0 && i1 === void 0) {
                return new StructureInterpolator.Absent();
            }
            if (i0 !== void 0) {
                i0 = structure.Item.fromAny(i0);
            }
            if (i1 !== void 0) {
                i1 = structure.Item.fromAny(i1);
            }
            if (!i0 && !i1) {
                i1 = i0 = structure.Item.absent();
            }
            else if (!i1) {
                i1 = i0;
            }
            else if (!i0) {
                i0 = i1;
            }
            if (i0 instanceof structure.Field && i1 instanceof structure.Field) {
                if (i0 instanceof structure.Attr && i1 instanceof structure.Attr
                    || i0 instanceof structure.Attr && i1.key instanceof Text
                    || i1 instanceof structure.Attr && i0.key instanceof Text) {
                    return new StructureInterpolator.Attr(i0, i1);
                }
                else {
                    return new StructureInterpolator.Slot(i0, i1);
                }
            }
            var v0 = i0.toValue();
            var v1 = i1.toValue();
            if (v0 instanceof structure.Record && v1 instanceof structure.Record) {
                return new StructureInterpolator.Record(v0, v1);
            }
            else if (v0 instanceof structure.Num && v1 instanceof structure.Num) {
                return new StructureInterpolator.Num(v0, v1);
            }
            else if (v0 instanceof structure.BinaryOperator && v1 instanceof structure.BinaryOperator) {
                return new StructureInterpolator.BinaryOperator(v0, v1);
            }
            else if (v0 instanceof structure.UnaryOperator && v1 instanceof structure.UnaryOperator) {
                return new StructureInterpolator.UnaryOperator(v0, v1);
            }
            else if (v0 instanceof structure.InvokeOperator && v1 instanceof structure.InvokeOperator) {
                return new StructureInterpolator.InvokeOperator(v0, v1);
            }
            return new StructureInterpolator.Value(v0, v1);
        };
        return StructureInterpolator;
    }(Interpolator));
    Interpolator.Structure = StructureInterpolator;
    Interpolator.structure = StructureInterpolator.structure;

    var AttrInterpolator = (function (_super) {
        __extends(AttrInterpolator, _super);
        function AttrInterpolator(f0, f1) {
            var _this = _super.call(this) || this;
            if (!f0 && !f1) {
                throw new TypeError();
            }
            else if (!f1) {
                f1 = f0;
            }
            else if (!f0) {
                f0 = f1;
            }
            if (!(f0.key instanceof structure.Text)) {
                throw new TypeError("" + f0.key);
            }
            else if (!(f1.key instanceof structure.Text)) {
                throw new TypeError("" + f1.key);
            }
            f0.commit();
            f1.commit();
            _this.keyInterpolator = Interpolator.structure(f0.key, f1.key);
            _this.valueInterpolator = Interpolator.structure(f0.value, f1.value);
            return _this;
        }
        AttrInterpolator.prototype.interpolate = function (u) {
            var key = this.keyInterpolator.interpolate(u);
            var value = this.valueInterpolator.interpolate(u);
            return structure.Attr.of(key, value);
        };
        AttrInterpolator.prototype.deinterpolate = function (f) {
            return 0;
        };
        AttrInterpolator.prototype.equals = function (that) {
            if (this === that) {
                return true;
            }
            else if (that instanceof AttrInterpolator) {
                return this.keyInterpolator.equals(that.keyInterpolator)
                    && this.valueInterpolator.equals(that.valueInterpolator);
            }
            return false;
        };
        return AttrInterpolator;
    }(StructureInterpolator));
    StructureInterpolator.Attr = AttrInterpolator;

    var SlotInterpolator = (function (_super) {
        __extends(SlotInterpolator, _super);
        function SlotInterpolator(f0, f1) {
            var _this = _super.call(this) || this;
            if (!f0 && !f1) {
                throw new TypeError();
            }
            else if (!f1) {
                f1 = f0;
            }
            else if (!f0) {
                f0 = f1;
            }
            f0.commit();
            f1.commit();
            _this.keyInterpolator = Interpolator.structure(f0.key, f1.key);
            _this.valueInterpolator = Interpolator.structure(f0.value, f1.value);
            return _this;
        }
        SlotInterpolator.prototype.interpolate = function (u) {
            var key = this.keyInterpolator.interpolate(u);
            var value = this.valueInterpolator.interpolate(u);
            return structure.Slot.of(key, value);
        };
        SlotInterpolator.prototype.deinterpolate = function (f) {
            return 0;
        };
        SlotInterpolator.prototype.equals = function (that) {
            if (this === that) {
                return true;
            }
            else if (that instanceof SlotInterpolator) {
                return this.keyInterpolator.equals(that.keyInterpolator)
                    && this.valueInterpolator.equals(that.valueInterpolator);
            }
            return false;
        };
        return SlotInterpolator;
    }(StructureInterpolator));
    StructureInterpolator.Slot = SlotInterpolator;

    var ValueInterpolator = (function (_super) {
        __extends(ValueInterpolator, _super);
        function ValueInterpolator(v0, v1) {
            var _this = _super.call(this) || this;
            if (v0 !== void 0) {
                v0 = structure.Value.fromAny(v0);
            }
            if (v1 !== void 0) {
                v1 = structure.Value.fromAny(v1);
            }
            if (!v0 && !v1) {
                v1 = v0 = structure.Value.absent();
            }
            else if (!v1) {
                v1 = v0;
            }
            else if (!v0) {
                v0 = v1;
            }
            _this.v0 = v0.commit();
            _this.v1 = v1.commit();
            return _this;
        }
        ValueInterpolator.prototype.interpolate = function (u) {
            return u < 1 ? this.v0 : this.v1;
        };
        ValueInterpolator.prototype.deinterpolate = function (v) {
            v = structure.Item.fromAny(v);
            return v.equals(this.v1) ? 1 : 0;
        };
        ValueInterpolator.prototype.equals = function (that) {
            if (this === that) {
                return true;
            }
            else if (that instanceof ValueInterpolator) {
                return this.v0.equals(that.v0) && this.v1.equals(that.v1);
            }
            return false;
        };
        return ValueInterpolator;
    }(StructureInterpolator));
    StructureInterpolator.Value = ValueInterpolator;

    var RecordInterpolator = (function (_super) {
        __extends(RecordInterpolator, _super);
        function RecordInterpolator(r0, r1) {
            var _this = _super.call(this) || this;
            if (r0 !== void 0) {
                r0 = structure.Record.fromAny(r0);
            }
            if (r1 !== void 0) {
                r1 = structure.Record.fromAny(r1);
            }
            if (!r0 && !r1) {
                r1 = r0 = structure.Record.empty();
            }
            else if (!r1) {
                r1 = r0;
            }
            else if (!r0) {
                r0 = r1;
            }
            r0.commit();
            r1.commit();
            _this.interpolators = [];
            var n = Math.min(r0.length, r1.length);
            for (var i = 0; i < n; i += 1) {
                _this.interpolators.push(Interpolator.structure(r0.getItem(i), r1.getItem(i)));
            }
            return _this;
        }
        RecordInterpolator.prototype.interpolate = function (u) {
            var n = this.interpolators.length;
            var record = structure.Record.create(n);
            for (var i = 0; i < n; i += 1) {
                record.push(this.interpolators[i].interpolate(u));
            }
            return record;
        };
        RecordInterpolator.prototype.deinterpolate = function (f) {
            return 0;
        };
        RecordInterpolator.prototype.equals = function (that) {
            if (this === that) {
                return true;
            }
            else if (that instanceof RecordInterpolator) {
                var n = this.interpolators.length;
                if (n === that.interpolators.length) {
                    for (var i = 0; i < n; i += 1) {
                        if (!this.interpolators[i].equals(that.interpolators[i])) {
                            return false;
                        }
                    }
                    return true;
                }
            }
            return false;
        };
        return RecordInterpolator;
    }(StructureInterpolator));
    StructureInterpolator.Record = RecordInterpolator;

    var NumInterpolator = (function (_super) {
        __extends(NumInterpolator, _super);
        function NumInterpolator(y0, y1) {
            var _this = _super.call(this) || this;
            if (y0 === void 0 && y1 === void 0) {
                y1 = y0 = 0;
            }
            else if (y1 === void 0) {
                y1 = y0;
            }
            else if (y0 === void 0) {
                y0 = y1;
            }
            _this.y0 = +y0;
            _this.dy = +y1 - _this.y0;
            return _this;
        }
        NumInterpolator.prototype.interpolate = function (u) {
            return structure.Num.from(this.y0 + this.dy * u);
        };
        NumInterpolator.prototype.deinterpolate = function (y) {
            y = structure.Item.fromAny(y);
            if (y instanceof structure.Num) {
                return this.dy ? (y.value - this.y0) / this.dy : this.dy;
            }
            return 0;
        };
        NumInterpolator.prototype.equals = function (that) {
            if (this === that) {
                return true;
            }
            else if (that instanceof NumInterpolator) {
                return this.y0 === that.y0 && this.dy === that.dy;
            }
            return false;
        };
        return NumInterpolator;
    }(StructureInterpolator));
    StructureInterpolator.Num = NumInterpolator;

    var ConditionalOperatorInterpolator = (function (_super) {
        __extends(ConditionalOperatorInterpolator, _super);
        function ConditionalOperatorInterpolator(e0, e1) {
            var _this = _super.call(this) || this;
            if (!e0 && !e1) {
                throw new TypeError();
            }
            else if (!e1) {
                e1 = e0;
            }
            else if (!e0) {
                e0 = e1;
            }
            e0.commit();
            e1.commit();
            _this.ifTermInterpolator = Interpolator.structure(e0.ifTerm(), e1.ifTerm());
            _this.thenTermInterpolator = Interpolator.structure(e0.thenTerm(), e1.thenTerm());
            _this.elseTermInterpolator = Interpolator.structure(e0.elseTerm(), e1.elseTerm());
            return _this;
        }
        ConditionalOperatorInterpolator.prototype.interpolate = function (u) {
            var ifTerm = this.ifTermInterpolator.interpolate(u);
            var thenTerm = this.thenTermInterpolator.interpolate(u);
            var elseTerm = this.elseTermInterpolator.interpolate(u);
            return ifTerm.conditional(thenTerm, elseTerm);
        };
        ConditionalOperatorInterpolator.prototype.deinterpolate = function (f) {
            return 0;
        };
        ConditionalOperatorInterpolator.prototype.equals = function (that) {
            if (this === that) {
                return true;
            }
            else if (that instanceof ConditionalOperatorInterpolator) {
                return this.ifTermInterpolator.equals(that.ifTermInterpolator)
                    && this.thenTermInterpolator.equals(that.thenTermInterpolator)
                    && this.elseTermInterpolator.equals(that.elseTermInterpolator);
            }
            return false;
        };
        return ConditionalOperatorInterpolator;
    }(StructureInterpolator));
    StructureInterpolator.ConditionalOperator = ConditionalOperatorInterpolator;

    var BinaryOperatorInterpolator = (function (_super) {
        __extends(BinaryOperatorInterpolator, _super);
        function BinaryOperatorInterpolator(e0, e1) {
            var _this = _super.call(this) || this;
            if (!e0 && !e1) {
                throw new TypeError();
            }
            else if (!e1) {
                e1 = e0;
            }
            else if (!e0) {
                e0 = e1;
            }
            _this.operator = e0.operator();
            if (_this.operator !== e1.operator()) {
                throw new Error(e1.operator());
            }
            e0.commit();
            e1.commit();
            _this.operand1Interpolator = Interpolator.structure(e0.operand1(), e1.operand1());
            _this.operand2Interpolator = Interpolator.structure(e0.operand2(), e1.operand2());
            return _this;
        }
        BinaryOperatorInterpolator.prototype.interpolate = function (u) {
            var operand1 = this.operand1Interpolator.interpolate(u);
            var operand2 = this.operand2Interpolator.interpolate(u);
            switch (this.operator) {
                case "||": return operand1.or(operand2);
                case "&&": return operand1.and(operand2);
                case "|": return operand1.bitwiseOr(operand2);
                case "^": return operand1.bitwiseXor(operand2);
                case "&": return operand1.bitwiseAnd(operand2);
                case "<": return operand1.lt(operand2);
                case "<=": return operand1.le(operand2);
                case "==": return operand1.eq(operand2);
                case "!=": return operand1.ne(operand2);
                case ">=": return operand1.ge(operand2);
                case ">": return operand1.gt(operand2);
                case "+": return operand1.plus(operand2);
                case "-": return operand1.minus(operand2);
                case "*": return operand1.times(operand2);
                case "/": return operand1.divide(operand2);
                case "%": return operand1.modulo(operand2);
                default: throw new Error(this.operator);
            }
        };
        BinaryOperatorInterpolator.prototype.deinterpolate = function (f) {
            return 0;
        };
        BinaryOperatorInterpolator.prototype.equals = function (that) {
            if (this === that) {
                return true;
            }
            else if (that instanceof BinaryOperatorInterpolator) {
                return this.operand1Interpolator.equals(that.operand1Interpolator)
                    && this.operator === that.operator
                    && this.operand2Interpolator.equals(that.operand2Interpolator);
            }
            return false;
        };
        return BinaryOperatorInterpolator;
    }(StructureInterpolator));
    StructureInterpolator.BinaryOperator = BinaryOperatorInterpolator;

    var UnaryOperatorInterpolator = (function (_super) {
        __extends(UnaryOperatorInterpolator, _super);
        function UnaryOperatorInterpolator(e0, e1) {
            var _this = _super.call(this) || this;
            if (!e0 && !e1) {
                throw new TypeError();
            }
            else if (!e1) {
                e1 = e0;
            }
            else if (!e0) {
                e0 = e1;
            }
            _this.operator = e0.operator();
            if (_this.operator !== e1.operator()) {
                throw new Error(e1.operator());
            }
            e0.commit();
            e1.commit();
            _this.operandInterpolator = Interpolator.structure(e0.operand(), e1.operand());
            return _this;
        }
        UnaryOperatorInterpolator.prototype.interpolate = function (u) {
            var operand = this.operandInterpolator.interpolate(u);
            switch (this.operator) {
                case "!": return operand.not();
                case "~": return operand.bitwiseNot();
                case "-": return operand.negative();
                default: throw new Error(this.operator);
            }
        };
        UnaryOperatorInterpolator.prototype.deinterpolate = function (f) {
            return 0;
        };
        UnaryOperatorInterpolator.prototype.equals = function (that) {
            if (this === that) {
                return true;
            }
            else if (that instanceof UnaryOperatorInterpolator) {
                return this.operator === that.operator
                    && this.operandInterpolator.equals(that.operandInterpolator);
            }
            return false;
        };
        return UnaryOperatorInterpolator;
    }(StructureInterpolator));
    StructureInterpolator.UnaryOperator = UnaryOperatorInterpolator;

    var InvokeOperatorInterpolator = (function (_super) {
        __extends(InvokeOperatorInterpolator, _super);
        function InvokeOperatorInterpolator(e0, e1) {
            var _this = _super.call(this) || this;
            if (!e0 && !e1) {
                throw new TypeError();
            }
            else if (!e1) {
                e1 = e0;
            }
            else if (!e0) {
                e0 = e1;
            }
            e0.commit();
            e1.commit();
            _this.funcInterpolator = Interpolator.structure(e0.func(), e1.func());
            _this.argsInterpolator = Interpolator.structure(e0.args(), e1.args());
            return _this;
        }
        InvokeOperatorInterpolator.prototype.interpolate = function (u) {
            var func = this.funcInterpolator.interpolate(u);
            var args = this.argsInterpolator.interpolate(u);
            return structure.Selector.literal(func).invoke(args);
        };
        InvokeOperatorInterpolator.prototype.deinterpolate = function (f) {
            return 0;
        };
        InvokeOperatorInterpolator.prototype.equals = function (that) {
            if (this === that) {
                return true;
            }
            else if (that instanceof InvokeOperatorInterpolator) {
                return this.funcInterpolator.equals(that.funcInterpolator)
                    && this.argsInterpolator.equals(that.argsInterpolator);
            }
            return false;
        };
        return InvokeOperatorInterpolator;
    }(StructureInterpolator));
    StructureInterpolator.InvokeOperator = InvokeOperatorInterpolator;

    var AbsentInterpolator = (function (_super) {
        __extends(AbsentInterpolator, _super);
        function AbsentInterpolator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AbsentInterpolator.prototype.interpolate = function (u) {
            return structure.Item.absent();
        };
        AbsentInterpolator.prototype.deinterpolate = function (f) {
            return 0;
        };
        AbsentInterpolator.prototype.equals = function (that) {
            if (this === that || that instanceof AbsentInterpolator) {
                return true;
            }
            return false;
        };
        return AbsentInterpolator;
    }(StructureInterpolator));
    StructureInterpolator.Absent = AbsentInterpolator;

    var ArrayInterpolator = (function (_super) {
        __extends(ArrayInterpolator, _super);
        function ArrayInterpolator(a0, a1) {
            var _this = _super.call(this) || this;
            if (!a0 && !a1) {
                a1 = a0 = [];
            }
            else if (!a1) {
                a1 = a0;
            }
            else if (!a0) {
                a0 = a1;
            }
            _this.interpolators = [];
            var n = Math.min(a0.length, a1.length);
            for (var i = 0; i < n; i += 1) {
                _this.interpolators.push(Interpolator.from(a0[i], a1[i]));
            }
            return _this;
        }
        ArrayInterpolator.prototype.interpolate = function (u) {
            var n = this.interpolators.length;
            var array = new Array(n);
            for (var i = 0; i < this.interpolators.length; i += 1) {
                array[i] = this.interpolators[i].interpolate(u);
            }
            return array;
        };
        ArrayInterpolator.prototype.deinterpolate = function (a) {
            return 0;
        };
        ArrayInterpolator.prototype.range = function (a0, a1) {
            if (a0 === void 0) {
                return [this.interpolate(0), this.interpolate(1)];
            }
            else if (a1 === void 0) {
                a0 = a0;
                return new ArrayInterpolator(a0[0], a0[1]);
            }
            else {
                return new ArrayInterpolator(a0, a1);
            }
        };
        ArrayInterpolator.prototype.equals = function (that) {
            if (this === that) {
                return true;
            }
            else if (that instanceof ArrayInterpolator) {
                var n = this.interpolators.length;
                if (n === that.interpolators.length) {
                    for (var i = 0; i < n; i += 1) {
                        if (!this.interpolators[i].equals(that.interpolators[i])) {
                            return false;
                        }
                    }
                    return true;
                }
            }
            return false;
        };
        return ArrayInterpolator;
    }(Interpolator));
    Interpolator.Array = ArrayInterpolator;

    var InterpolatorInterpolator = (function (_super) {
        __extends(InterpolatorInterpolator, _super);
        function InterpolatorInterpolator(i0, i1) {
            var _this = _super.call(this) || this;
            if (!i0 && !i1) {
                throw new Error();
            }
            else if (!i1) {
                i1 = i0;
            }
            else if (!i0) {
                i0 = i1;
            }
            _this.i0 = i0;
            _this.i1 = i1;
            _this.i00 = _this.i1.range(_this.i0.interpolate(0), _this.i1.interpolate(0));
            _this.i11 = _this.i1.range(_this.i0.interpolate(1), _this.i1.interpolate(1));
            return _this;
        }
        InterpolatorInterpolator.prototype.interpolate = function (u) {
            if (u === 0) {
                return this.i0;
            }
            else if (u === 1) {
                return this.i1;
            }
            else {
                return this.i1.range(this.i00.interpolate(u), this.i11.interpolate(u));
            }
        };
        InterpolatorInterpolator.prototype.deinterpolate = function (i) {
            return 0;
        };
        InterpolatorInterpolator.prototype.range = function (i0, i1) {
            if (i0 === void 0) {
                return [this.i0, this.i1];
            }
            else if (i1 === void 0) {
                i0 = i0;
                return new InterpolatorInterpolator(Interpolator.fromAny(i0[0]), Interpolator.fromAny(i0[1]));
            }
            else {
                i0 = i0;
                return new InterpolatorInterpolator(Interpolator.fromAny(i0), Interpolator.fromAny(i1));
            }
        };
        InterpolatorInterpolator.prototype.equals = function (that) {
            if (this === that) {
                return true;
            }
            else if (that instanceof InterpolatorInterpolator) {
                return this.i0.equals(that.i0) && this.i1.equals(that.i1);
            }
            return false;
        };
        return InterpolatorInterpolator;
    }(Interpolator));
    Interpolator.Interpolator = InterpolatorInterpolator;

    var InterpolatorMap = (function (_super) {
        __extends(InterpolatorMap, _super);
        function InterpolatorMap(interpolator, transform) {
            var _this = _super.call(this) || this;
            _this._interpolator = interpolator;
            _this._transform = transform;
            return _this;
        }
        InterpolatorMap.prototype.interpolate = function (u) {
            return this._transform(this._interpolator.interpolate(u));
        };
        InterpolatorMap.prototype.deinterpolate = function (y) {
            return 0;
        };
        InterpolatorMap.prototype.range = function (y0, y1) {
            if (y0 === void 0) {
                var range = this._interpolator.range();
                return [this._transform(range[0]), this._transform(range[1])];
            }
            else {
                return this;
            }
        };
        InterpolatorMap.prototype.equals = function (that) {
            if (this === that) {
                return true;
            }
            else if (that instanceof InterpolatorMap) {
                return this._interpolator.equals(that._interpolator)
                    && this._transform === that._transform;
            }
            return false;
        };
        return InterpolatorMap;
    }(Interpolator));
    Interpolator.Map = InterpolatorMap;

    var InterpolatorForm = (function (_super) {
        __extends(InterpolatorForm, _super);
        function InterpolatorForm(valueForm, unit) {
            var _this = _super.call(this) || this;
            _this._valueForm = valueForm;
            _this._unit = unit;
            return _this;
        }
        InterpolatorForm.prototype.unit = function (unit) {
            if (arguments.length === 0) {
                return this._unit;
            }
            else {
                return new InterpolatorForm(this._valueForm, unit);
            }
        };
        InterpolatorForm.prototype.mold = function (interpolator) {
            if (interpolator !== void 0) {
                interpolator = Interpolator.fromAny(interpolator);
                var a = this._valueForm.mold(interpolator.interpolate(0));
                var b = this._valueForm.mold(interpolator.interpolate(1));
                if (a.isDefined() && b.isDefined()) {
                    return structure.Record.of(structure.Attr.of("interpolate", structure.Record.of(a, b)));
                }
            }
            return structure.Item.extant();
        };
        InterpolatorForm.prototype.cast = function (item) {
            var value = item.toValue();
            var header = value.header("interpolate");
            if (header.length >= 2) {
                var a = this._valueForm.cast(header.getItem(0).toValue());
                var b = this._valueForm.cast(header.getItem(1).toValue());
                if (a !== void 0 && b !== void 0) {
                    return Interpolator.from(a, b);
                }
            }
            return void 0;
        };
        return InterpolatorForm;
    }(structure.Form));
    Interpolator.Form = InterpolatorForm;

    var Scale = (function () {
        function Scale() {
        }
        Scale.linear = function (x0, x1, y0, y1) {
            if (Array.isArray(x0)) {
                if (!Array.isArray(x1)) {
                    x1 = x1;
                    return new Scale.Linear(x0[0], x0[1], Interpolator.fromAny(x1));
                }
                else {
                    x1 = x1;
                    return new Scale.Linear(x0[0], x0[1], Interpolator.from(x1[0], x1[1]));
                }
            }
            else {
                x0 = x0;
                x1 = x1;
                if (y1 === void 0) {
                    y0 = y0;
                    return new Scale.Linear(x0, x1, Interpolator.fromAny(y0));
                }
                else {
                    y0 = y0;
                    y1 = y1;
                    return new Scale.Linear(x0, x1, Interpolator.from(y0, y1));
                }
            }
        };
        Scale.time = function (t0, t1, y0, y1) {
            if (Array.isArray(t0)) {
                if (!Array.isArray(t1)) {
                    return new Scale.Time(t0[0], t0[1], Interpolator.fromAny(t1));
                }
                else {
                    t1 = t1;
                    return new Scale.Time(t0[0], t0[1], Interpolator.from(t1[0], t1[1]));
                }
            }
            else {
                t0 = t0;
                t1 = t1;
                if (y1 === void 0) {
                    y0 = y0;
                    return new Scale.Time(t0, t1, Interpolator.fromAny(y0));
                }
                else {
                    y0 = y0;
                    y1 = y1;
                    return new Scale.Time(t0, t1, Interpolator.from(y0, y1));
                }
            }
        };
        Scale.from = function (x0, x1, y0, y1) {
            if (x0 === "time") {
                y1 = y0;
                y0 = x1;
                var now = time.DateTime.current();
                x1 = now;
                x0 = now.time(now.time() - 86400000);
            }
            else if (x0 === "linear") {
                y1 = y0;
                y0 = x1;
                x1 = 1;
                x0 = 0;
            }
            if (x0 instanceof time.DateTime || x0 instanceof Date || x1 instanceof time.DateTime || x1 instanceof Date) {
                if (y1 === void 0) {
                    y0 = y0;
                    return new Scale.Time(x0, x1, Interpolator.fromAny(y0));
                }
                else {
                    return new Scale.Time(x0, x1, Interpolator.from(y0, y1));
                }
            }
            else if (typeof x0 === "number" && typeof x1 === "number") {
                if (y1 === void 0) {
                    y0 = y0;
                    return new Scale.Linear(x0, x1, Interpolator.fromAny(y0));
                }
                else {
                    return new Scale.Linear(x0, x1, Interpolator.from(y0, y1));
                }
            }
            throw new TypeError("" + arguments);
        };
        Scale.form = function (domainForm, interpolatorForm, unit) {
            if (domainForm === void 0) {
                domainForm = Scale.domainForm();
            }
            if (interpolatorForm === void 0) {
                interpolatorForm = Scale.interpolatorForm();
            }
            if (domainForm !== Scale.domainForm() || interpolatorForm !== Scale.interpolatorForm() || unit !== void 0) {
                return new Scale.Form(domainForm, interpolatorForm, unit);
            }
            else {
                if (!Scale._form) {
                    Scale._form = new Scale.Form(domainForm, interpolatorForm);
                }
                return Scale._form;
            }
        };
        Scale.domainForm = function () {
            throw new Error();
        };
        Scale.interpolatorForm = function () {
            throw new Error();
        };
        return Scale;
    }());

    var ContinuousScale = (function (_super) {
        __extends(ContinuousScale, _super);
        function ContinuousScale() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ContinuousScale;
    }(Scale));
    Scale.Continuous = ContinuousScale;

    var LinearScale = (function (_super) {
        __extends(LinearScale, _super);
        function LinearScale(x0, x1, fx) {
            var _this = _super.call(this) || this;
            _this.x0 = x0;
            _this.dx = x1 - _this.x0;
            _this.fx = fx;
            return _this;
        }
        LinearScale.prototype.norm = function (x) {
            return this.dx ? (x - this.x0) / this.dx : this.dx;
        };
        LinearScale.prototype.scale = function (x) {
            var u = this.norm(x);
            return this.fx.interpolate(u);
        };
        LinearScale.prototype.unscale = function (y) {
            var u = this.fx.deinterpolate(y);
            return this.x0 + this.dx * u;
        };
        LinearScale.prototype.clampScale = function (x) {
            var u = Math.min(Math.max(0, this.norm(x)), 1);
            return this.fx.interpolate(u);
        };
        LinearScale.prototype.domain = function (x0, x1) {
            if (x0 === void 0) {
                return [this.x0, this.x0 + this.dx];
            }
            else {
                if (x1 === void 0) {
                    x1 = x0[1];
                    x0 = x0[0];
                }
                var dx = x1 - x0;
                if (x0 === this.x0 && dx === this.dx) {
                    return this;
                }
                else {
                    return new LinearScale(x0, x1, this.fx);
                }
            }
        };
        LinearScale.prototype.range = function (y0, y1) {
            if (y0 === void 0) {
                return this.fx.range();
            }
            else if (y1 === void 0) {
                y0 = y0;
                return new LinearScale(this.x0, this.x0 + this.dx, this.fx.range(y0));
            }
            else {
                y0 = y0;
                return new LinearScale(this.x0, this.x0 + this.dx, this.fx.range(y0, y1));
            }
        };
        LinearScale.prototype.interpolator = function (fx) {
            if (fx === void 0) {
                return this.fx;
            }
            else {
                fx = Interpolator.fromAny(fx);
                return new LinearScale(this.x0, this.x0 + this.dx, fx);
            }
        };
        LinearScale.prototype.clampDomain = function (xMin, xMax, zMin, zMax, epsilon) {
            var x0 = this.x0;
            var x1 = this.x0 + this.dx;
            if (xMin !== void 0) {
                if (x0 < x1 && x0 < xMin) {
                    x0 = xMin;
                }
                else if (x1 < x0 && x1 < xMin) {
                    x1 = xMin;
                }
            }
            if (xMax !== void 0) {
                if (x0 < x1 && x1 > xMax) {
                    x1 = xMax;
                }
                else if (x1 < x0 && x0 > xMax) {
                    x1 = xMax;
                }
            }
            var y0 = +this.scale(x0);
            var y1 = +this.scale(x1);
            var dy = y1 - y0;
            var z = Math.abs(dy / (x1 - x0));
            if (zMin !== void 0 && z < 1 / zMin) {
                var dx_1 = dy * zMin;
                var xSum = x0 + x1;
                x0 = (xSum - dx_1) / 2;
                x1 = (xSum + dx_1) / 2;
            }
            else if (zMax !== void 0 && z > 1 / zMax) {
                var dx_2 = dy * zMax;
                var xSum = x0 + x1;
                x0 = (xSum - dx_2) / 2;
                x1 = (xSum + dx_2) / 2;
            }
            var dx = x1 - x0;
            if (epsilon === void 0) {
                epsilon = 1e-12;
            }
            if (Math.abs(x0 - this.x0) < epsilon && Math.abs(dx - this.dx) < epsilon) {
                return this;
            }
            else {
                return new LinearScale(x0, x1, this.fx);
            }
        };
        LinearScale.prototype.solveDomain = function (x1, y1, x2, y2, epsilon) {
            var range = this.fx.range();
            var y0 = +range[0];
            var y3 = +range[1];
            var m;
            if (x2 === void 0 || y2 === void 0 || x1 === x2 || y1 === y2) {
                m = (y3 - y0) / (this.dx || 1);
            }
            else {
                m = (+y2 - +y1) / (x2 - x1);
            }
            var b = +y1 - m * x1;
            var x0 = (y0 - b) / m;
            var x3 = (y3 - b) / m;
            var dx = x3 - x0;
            if (epsilon === void 0) {
                epsilon = 1e-12;
            }
            if (Math.abs(x0 - this.x0) < epsilon && Math.abs(dx - this.dx) < epsilon) {
                return this;
            }
            else {
                return new LinearScale(x0, x3, this.fx);
            }
        };
        LinearScale.prototype.equals = function (that) {
            if (this === that) {
                return true;
            }
            else if (that instanceof LinearScale) {
                return this.x0 === that.x0 && this.dx === that.dx && this.fx.equals(that.fx);
            }
            return false;
        };
        return LinearScale;
    }(ContinuousScale));
    Scale.Linear = LinearScale;

    var TimeScale = (function (_super) {
        __extends(TimeScale, _super);
        function TimeScale(d0, d1, ft, zone) {
            var _this = _super.call(this) || this;
            d0 = time.DateTime.fromAny(d0);
            d1 = time.DateTime.fromAny(d1);
            _this.t0 = d0.time();
            _this.dt = d1.time() - _this.t0;
            _this.zone = zone || d0.zone();
            _this.ft = ft;
            return _this;
        }
        TimeScale.prototype.norm = function (d) {
            d = time.DateTime.time(d);
            return this.dt ? (d - this.t0) / this.dt : this.dt;
        };
        TimeScale.prototype.scale = function (d) {
            var u = this.norm(d);
            return this.ft.interpolate(u);
        };
        TimeScale.prototype.unscale = function (y) {
            var u = this.ft.deinterpolate(y);
            return new time.DateTime(this.t0 + this.dt * u);
        };
        TimeScale.prototype.clampScale = function (d) {
            var u = Math.min(Math.max(0, this.norm(d)), 1);
            return this.ft.interpolate(u);
        };
        TimeScale.prototype.domain = function (t0, t1) {
            if (t0 === void 0) {
                return [new time.DateTime(this.t0, this.zone), new time.DateTime(this.t0 + this.dt, this.zone)];
            }
            else {
                if (t1 === void 0) {
                    t1 = t0[1];
                    t0 = t0[0];
                }
                t0 = time.DateTime.time(t0);
                t1 = time.DateTime.time(t1);
                var dt = t1 - t0;
                if (t0 === this.t0 && dt === this.dt) {
                    return this;
                }
                else {
                    return new TimeScale(t0, t1, this.ft, this.zone);
                }
            }
        };
        TimeScale.prototype.range = function (y0, y1) {
            if (y0 === void 0) {
                return this.ft.range();
            }
            else if (y1 === void 0) {
                y0 = y0;
                return new TimeScale(this.t0, this.t0 + this.dt, this.ft.range(y0), this.zone);
            }
            else {
                y0 = y0;
                return new TimeScale(this.t0, this.t0 + this.dt, this.ft.range(y0, y1), this.zone);
            }
        };
        TimeScale.prototype.interpolator = function (ft) {
            if (ft === void 0) {
                return this.ft;
            }
            else {
                ft = Interpolator.fromAny(ft);
                return new TimeScale(this.t0, this.t0 + this.dt, ft, this.zone);
            }
        };
        TimeScale.prototype.clampDomain = function (tMin, tMax, zMin, zMax, epsilon) {
            var t0 = this.t0;
            var t1 = this.t0 + this.dt;
            if (tMin !== void 0) {
                tMin = time.DateTime.time(tMin);
                if (t0 < t1 && t0 < tMin) {
                    t0 = tMin;
                }
                else if (t1 < t0 && t1 < tMin) {
                    t1 = tMin;
                }
            }
            if (tMax !== void 0) {
                tMax = time.DateTime.time(tMax);
                if (t0 < t1 && t1 > tMax) {
                    t1 = tMax;
                }
                else if (t1 < t0 && t0 > tMax) {
                    t1 = tMax;
                }
            }
            var y0 = +this.scale(t0);
            var y1 = +this.scale(t1);
            var dy = y1 - y0;
            var z = Math.abs(dy / (t1 - t0));
            if (zMin !== void 0 && z < 1 / zMin) {
                var dt_1 = dy * zMin;
                var tSum = t0 + t1;
                t0 = (tSum - dt_1) / 2;
                t1 = (tSum + dt_1) / 2;
            }
            else if (zMax !== void 0 && z > 1 / zMax) {
                var dt_2 = dy * zMax;
                var tSum = t0 + t1;
                t0 = (tSum - dt_2) / 2;
                t1 = (tSum + dt_2) / 2;
            }
            var dt = t1 - t0;
            if (epsilon === void 0) {
                epsilon = 1e-12;
            }
            if (Math.abs(t0 - this.t0) < epsilon && Math.abs(dt - this.dt) < epsilon) {
                return this;
            }
            else {
                return new TimeScale(t0, t1, this.ft, this.zone);
            }
        };
        TimeScale.prototype.solveDomain = function (t1, y1, t2, y2, epsilon) {
            t1 = time.DateTime.time(t1);
            t2 = t2 !== void 0 ? time.DateTime.time(t2) : t2;
            var range = this.ft.range();
            var y0 = +range[0];
            var y3 = +range[1];
            var m;
            if (t2 === void 0 || y2 === void 0 || t1 === t2 || y1 === y2) {
                m = (y3 - y0) / (this.dt || 1);
            }
            else {
                m = (+y2 - +y1) / (t2 - t1);
            }
            var b = +y1 - m * t1;
            var t0 = (y0 - b) / m;
            var t3 = (y3 - b) / m;
            var dt = t3 - t0;
            if (epsilon === void 0) {
                epsilon = 1e-12;
            }
            if (Math.abs(t0 - this.t0) < epsilon && Math.abs(dt - this.dt) < epsilon) {
                return this;
            }
            else {
                return new TimeScale(t0, t3, this.ft, this.zone);
            }
        };
        TimeScale.prototype.equals = function (that) {
            if (this === that) {
                return true;
            }
            else if (that instanceof TimeScale) {
                return this.t0 === that.t0 && this.dt === that.dt && this.ft.equals(that.ft);
            }
            return false;
        };
        return TimeScale;
    }(ContinuousScale));
    Scale.Time = TimeScale;

    var ScaleForm = (function (_super) {
        __extends(ScaleForm, _super);
        function ScaleForm(domainForm, interpolatorForm, unit) {
            var _this = _super.call(this) || this;
            _this._domainForm = domainForm;
            _this._interpolatorForm = interpolatorForm;
            _this._unit = unit;
            return _this;
        }
        ScaleForm.prototype.unit = function (unit) {
            if (arguments.length === 0) {
                return this._unit;
            }
            else {
                return new ScaleForm(this._domainForm, this._interpolatorForm, unit);
            }
        };
        ScaleForm.prototype.mold = function (scale) {
            if (scale instanceof ContinuousScale) {
                var domain = scale.domain();
                var x0 = this._domainForm.mold(domain[0]);
                var x1 = this._domainForm.mold(domain[1]);
                var header = structure.Record.of(x0, x1);
                var record = structure.Record.of(structure.Attr.of("scale", header));
                var f = this._interpolatorForm.mold(scale.interpolator());
                if (f.isDefined()) {
                    record = record.concat(f);
                }
                return record;
            }
            else {
                return structure.Item.extant();
            }
        };
        ScaleForm.prototype.cast = function (item) {
            var value = item.toValue();
            var header = value.header("scale");
            if (header.length >= 2) {
                var x0_1;
                var x1_1;
                header.forEach(function (item, index) {
                    if (item instanceof structure.Value) {
                        if (index === 0) {
                            x0_1 = item.cast(this._domainForm, x0_1);
                        }
                        else if (index === 1) {
                            x1_1 = item.cast(this._domainForm, x1_1);
                        }
                    }
                }, this);
                var fx = this._interpolatorForm.cast(value.body());
                if (x0_1 !== void 0 && x1_1 !== void 0 && fx) {
                    return Scale.from(x0_1, x1_1, fx);
                }
            }
            return void 0;
        };
        return ScaleForm;
    }(structure.Form));
    Scale.Form = ScaleForm;

    var ScaleInterpolator = (function (_super) {
        __extends(ScaleInterpolator, _super);
        function ScaleInterpolator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ScaleInterpolator.prototype.range = function (s0, s1) {
            if (s0 === void 0) {
                return [this.interpolate(0), this.interpolate(1)];
            }
            else if (s1 === void 0) {
                s0 = s0;
                return Interpolator.scale(s0[0], s0[1]);
            }
            else {
                s0 = s0;
                return Interpolator.scale(s0, s1);
            }
        };
        ScaleInterpolator.scale = function (s0, s1) {
            if (!s0 && !s1) {
                throw new Error();
            }
            else if (!s1) {
                s1 = s0;
            }
            else if (!s0) {
                s0 = s1;
            }
            if (s0 instanceof LinearScale && s1 instanceof LinearScale) {
                return new ScaleInterpolator.Linear(s0, s1);
            }
            else if (s0 instanceof TimeScale && s1 instanceof TimeScale) {
                return new ScaleInterpolator.Time(s0, s1);
            }
            else {
                throw new TypeError(s0 + ", " + s1);
            }
        };
        return ScaleInterpolator;
    }(Interpolator));
    Interpolator.scale = ScaleInterpolator.scale;
    var InterpolatorFrom = Interpolator.from;
    Interpolator.from = function (a, b) {
        if (a instanceof ContinuousScale || b instanceof ContinuousScale) {
            return Interpolator.scale(a, b);
        }
        else {
            return InterpolatorFrom(a, b);
        }
    };

    var LinearScaleInterpolator = (function (_super) {
        __extends(LinearScaleInterpolator, _super);
        function LinearScaleInterpolator(s0, s1) {
            var _this = _super.call(this) || this;
            if (!s0 && !s1) {
                throw new Error();
            }
            else if (!s1) {
                s1 = s0;
            }
            else if (!s0) {
                s0 = s1;
            }
            _this.x0 = new NumberInterpolator(s0.x0, s1.x0);
            _this.dx = new NumberInterpolator(s0.dx, s1.dx);
            _this.fx = new InterpolatorInterpolator(s0.fx, s1.fx);
            return _this;
        }
        LinearScaleInterpolator.prototype.interpolate = function (u) {
            var x0 = this.x0.interpolate(u);
            var dx = this.dx.interpolate(u);
            var fx = this.fx.interpolate(u);
            return new LinearScale(x0, x0 + dx, fx);
        };
        LinearScaleInterpolator.prototype.deinterpolate = function (s) {
            return 0;
        };
        LinearScaleInterpolator.prototype.equals = function (that) {
            if (this === that) {
                return true;
            }
            else if (that instanceof LinearScaleInterpolator) {
                return this.x0.equals(that.x0) && this.dx.equals(that.dx) && this.fx.equals(that.fx);
            }
            return false;
        };
        return LinearScaleInterpolator;
    }(ScaleInterpolator));
    ScaleInterpolator.Linear = LinearScaleInterpolator;

    var TimeScaleInterpolator = (function (_super) {
        __extends(TimeScaleInterpolator, _super);
        function TimeScaleInterpolator(s0, s1) {
            var _this = _super.call(this) || this;
            if (!s0 && !s1) {
                throw new Error();
            }
            else if (!s1) {
                s1 = s0;
            }
            else if (!s0) {
                s0 = s1;
            }
            _this.t0 = new NumberInterpolator(s0.t0, s1.t0);
            _this.dt = new NumberInterpolator(s0.dt, s1.dt);
            _this.ft = new InterpolatorInterpolator(s0.ft, s1.ft);
            return _this;
        }
        TimeScaleInterpolator.prototype.interpolate = function (u) {
            var t0 = this.t0.interpolate(u);
            var dt = this.dt.interpolate(u);
            var ft = this.ft.interpolate(u);
            return new TimeScale(t0, t0 + dt, ft);
        };
        TimeScaleInterpolator.prototype.deinterpolate = function (s) {
            return 0;
        };
        TimeScaleInterpolator.prototype.equals = function (that) {
            if (this === that) {
                return true;
            }
            else if (that instanceof TimeScaleInterpolator) {
                return this.t0.equals(that.t0) && this.dt.equals(that.dt) && this.ft.equals(that.ft);
            }
            return false;
        };
        return TimeScaleInterpolator;
    }(ScaleInterpolator));
    ScaleInterpolator.Time = TimeScaleInterpolator;

    function linear(t) {
        return t;
    }
    linear.type = "linear";
    function quadIn(t) {
        return t * t;
    }
    quadIn.type = "quad-in";
    function quadOut(t) {
        return t * (2 - t);
    }
    quadOut.type = "quad-out";
    function quadInOut(t) {
        t *= 2;
        if (t <= 1) {
            t = t * t;
        }
        else {
            t -= 1;
            t = t * (2 - t);
            t += 1;
        }
        t /= 2;
        return t;
    }
    quadInOut.type = "quad-in-out";
    function cubicIn(t) {
        return t * t * t;
    }
    cubicIn.type = "cubic-in";
    function cubicOut(t) {
        t -= 1;
        t = t * t * t;
        t += 1;
        return t;
    }
    cubicOut.type = "cubic-out";
    function cubicInOut(t) {
        t *= 2;
        if (t <= 1) {
            t = t * t * t;
        }
        else {
            t -= 2;
            t = t * t * t;
            t += 2;
        }
        t /= 2;
        return t;
    }
    cubicInOut.type = "cubic-in-out";
    function quartIn(t) {
        return t * t * t * t;
    }
    quartIn.type = "quart-in";
    function quartOut(t) {
        t -= 1;
        return 1 - t * t * t * t;
    }
    quartOut.type = "quart-out";
    function quartInOut(t) {
        var t1 = t - 1;
        return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * t1 * t1 * t1 * t1;
    }
    quartInOut.type = "quart-in-out";
    function expoIn(t) {
        if (t === 0) {
            return 0;
        }
        return Math.pow(2, 10 * (t - 1));
    }
    expoIn.type = "expo-in";
    function expoOut(t) {
        if (t === 1) {
            return 1;
        }
        return (-Math.pow(2, -10 * t) + 1);
    }
    expoOut.type = "expo-out";
    function expoInOut(t) {
        if (t === 1 || t === 0) {
            return t;
        }
        t *= 2;
        if (t < 1) {
            return 0.5 * Math.pow(2, 10 * (t - 1));
        }
        return 0.5 * (-Math.pow(2, -10 * (t - 1)) + 2);
    }
    expoInOut.type = "expo-in-out";
    function circIn(t) {
        return -1 * (Math.sqrt(1 - (t / 1) * t) - 1);
    }
    circIn.type = "circ-in";
    function circOut(t) {
        t -= 1;
        return Math.sqrt(1 - t * t);
    }
    circOut.type = "circ-out";
    function circInOut(t) {
        t *= 2;
        if (t < 1) {
            return -0.5 * (Math.sqrt(1 - t * t) - 1);
        }
        var st = t - 2;
        return 0.5 * (Math.sqrt(1 - st * st) + 1);
    }
    circInOut.type = "circ-in-out";
    function backIn(t) {
        var m = 1.70158;
        return t * t * ((m + 1) * t - m);
    }
    backIn.type = "back-in";
    function backOut(t) {
        var m = 1.70158;
        var st = (t / 1) - 1;
        return (st * st * ((m + 1) * m + m)) + 1;
    }
    backOut.type = "back-out";
    function backInOut(t) {
        var m = 1.70158;
        var s = m * 1.525;
        if ((t *= 2) < 1) {
            return 0.5 * t * t * (((s + 1) * t) - s);
        }
        var st = t - 2;
        return 0.5 * (st * st * ((s + 1) * st + s) + 2);
    }
    backInOut.type = "back-in-out";
    function elasticIn(t) {
        if (t === 0 || t === 1) {
            return t;
        }
        var m = 0.7;
        var st = (t / 1) - 1;
        var s = (1 - m) / 2 * Math.PI * Math.asin(1);
        return -(Math.pow(2, 10 * st) * Math.sin((st - s) * 2 * Math.PI / (1 - m)));
    }
    elasticIn.type = "elastic-in";
    function elasticOut(t) {
        if (t === 0 || t === 1) {
            return t;
        }
        var m = 0.7;
        var s = (1 - m) / (2 * Math.PI) * Math.asin(1);
        t *= 2;
        return (Math.pow(2, -10 * t) * Math.sin((t - s) * 2 * Math.PI / (1 - m))) + 1;
    }
    elasticOut.type = "elastic-out";
    function elasticInOut(t) {
        if (t === 0 || t === 1) {
            return t;
        }
        var m = 0.65;
        var s = (1 - m) / (2 * Math.PI) * Math.asin(1);
        var st = t * 2;
        var st1 = st - 1;
        if (st < 1) {
            return -0.5 * (Math.pow(2, 10 * st1) * Math.sin((st1 - s) * 2 * Math.PI / (1 - m)));
        }
        return (Math.pow(2, -10 * st1) * Math.sin((st1 - s) * 2 * Math.PI / (1 - m)) * 0.5) + 1;
    }
    elasticInOut.type = "elastic-in-out";
    function bounceIn(t) {
        var p = 7.5625;
        if ((t = 1 - t) < 1 / 2.75) {
            return 1 - (p * t * t);
        }
        else if (t < 2 / 2.75) {
            return 1 - (p * (t -= 1.5 / 2.75) * t + 0.75);
        }
        else if (t < 2.5 / 2.75) {
            return 1 - (p * (t -= 2.25 / 2.75) * t + 0.9375);
        }
        return 1 - (p * (t -= 2.625 / 2.75) * t + 0.984375);
    }
    bounceIn.type = "bounce-in";
    function bounceOut(t) {
        var p = 7.5625;
        if (t < 1 / 2.75) {
            return p * t * t;
        }
        else if (t < 2 / 2.75) {
            return p * (t -= 1.5 / 2.75) * t + 0.75;
        }
        else if (t < 2.5 / 2.75) {
            return p * (t -= 2.25 / 2.75) * t + 0.9375;
        }
        return p * (t -= 2.625 / 2.75) * t + 0.984375;
    }
    bounceOut.type = "bounce-out";
    function bounceInOut(t) {
        var invert = t < 0.5;
        t = invert ? 1 - (t * 2) : (t * 2) - 1;
        var p = 7.5625;
        if (t < 1 / 2.75) {
            t = p * t * t;
        }
        else if (t < 2 / 2.75) {
            t = p * (t -= 1.5 / 2.75) * t + 0.75;
        }
        else if (t < 2.5 / 2.75) {
            t = p * (t -= 2.25 / 2.75) * t + 0.9375;
        }
        else {
            t = p * (t -= 2.625 / 2.75) * t + 0.984375;
        }
        return invert ? (1 - t) * 0.5 : t * 0.5 + 0.5;
    }
    bounceInOut.type = "bounce-in-out";
    var Ease = {
        linear: linear,
        quadIn: quadIn,
        quadOut: quadOut,
        quadInOut: quadInOut,
        cubicIn: cubicIn,
        cubicOut: cubicOut,
        cubicInOut: cubicInOut,
        quartIn: quartIn,
        quartOut: quartOut,
        quartInOut: quartInOut,
        expoIn: expoIn,
        expoOut: expoOut,
        expoInOut: expoInOut,
        circIn: circIn,
        circOut: circOut,
        circInOut: circInOut,
        backIn: backIn,
        backOut: backOut,
        backInOut: backInOut,
        elasticIn: elasticIn,
        elasticOut: elasticOut,
        elasticInOut: elasticInOut,
        bounceIn: bounceIn,
        bounceOut: bounceOut,
        bounceInOut: bounceInOut,
        fromAny: function (value) {
            if (typeof value === "function") {
                return value;
            }
            else if (typeof value === "string") {
                switch (value) {
                    case "linear": return Ease.linear;
                    case "quad-in": return Ease.quadIn;
                    case "quad-out": return Ease.quadOut;
                    case "quad-in-out": return Ease.quadInOut;
                    case "cubic-in": return Ease.cubicIn;
                    case "cubic-out": return Ease.cubicOut;
                    case "cubic-in-out": return Ease.cubicInOut;
                    case "quart-in": return Ease.quartIn;
                    case "quart-out": return Ease.quartOut;
                    case "quart-in-out": return Ease.quartInOut;
                    case "expo-in": return Ease.expoIn;
                    case "expo-out": return Ease.expoOut;
                    case "expo-in-out": return Ease.expoInOut;
                    case "circ-in": return Ease.circIn;
                    case "circ-out": return Ease.circOut;
                    case "circ-in-out": return Ease.circInOut;
                    case "back-in": return Ease.backIn;
                    case "back-out": return Ease.backOut;
                    case "back-in-out": return Ease.backInOut;
                    case "elastic-in": return Ease.elasticIn;
                    case "elastic-out": return Ease.elasticOut;
                    case "elastic-in-out": return Ease.elasticInOut;
                    case "bounce-in": return Ease.bounceIn;
                    case "bounce-out": return Ease.bounceOut;
                    case "bounce-in-out": return Ease.bounceInOut;
                }
            }
            throw new Error(value);
        },
        _form: void 0,
        form: function (unit) {
            if (unit !== void 0) {
                unit = Ease.fromAny(unit);
            }
            if (unit !== Ease.linear) {
                return new Ease.Form(unit);
            }
            else {
                if (!Ease._form) {
                    Ease._form = new Ease.Form(Ease.linear);
                }
                return Ease._form;
            }
        },
        Form: void 0,
    };

    var EaseForm = (function (_super) {
        __extends(EaseForm, _super);
        function EaseForm(unit) {
            var _this = _super.call(this) || this;
            _this._unit = unit;
            return _this;
        }
        EaseForm.prototype.unit = function (unit) {
            if (arguments.length === 0) {
                return this._unit;
            }
            else {
                return new EaseForm(unit);
            }
        };
        EaseForm.prototype.mold = function (ease) {
            ease = Ease.fromAny(ease);
            if (typeof ease.type === "string") {
                return structure.Text.from(ease.type);
            }
            else {
                return structure.Item.extant();
            }
        };
        EaseForm.prototype.cast = function (item) {
            var string = item.toValue().stringValue(void 0);
            if (string !== void 0) {
                try {
                    return Ease.fromAny(string);
                }
                catch (e) {
                }
            }
            return void 0;
        };
        return EaseForm;
    }(structure.Form));
    Ease.Form = EaseForm;

    var Transition = (function () {
        function Transition(duration, ease, interpolator, onStart, onEnd, onInterrupt) {
            this._duration = duration;
            this._ease = ease;
            this._interpolator = interpolator;
            this._onStart = onStart;
            this._onEnd = onEnd;
            this._onInterrupt = onInterrupt;
        }
        Transition.prototype.duration = function (duration) {
            if (duration === void 0) {
                return this._duration;
            }
            else {
                return new Transition(duration, this._ease, this._interpolator, this._onStart, this._onEnd, this._onInterrupt);
            }
        };
        Transition.prototype.ease = function (ease) {
            if (ease === void 0) {
                return this._ease;
            }
            else {
                ease = ease !== null ? Ease.fromAny(ease) : null;
                return new Transition(this._duration, ease, this._interpolator, this._onStart, this._onEnd, this._onInterrupt);
            }
        };
        Transition.prototype.interpolator = function (interpolator) {
            if (interpolator === void 0) {
                return this._interpolator;
            }
            else {
                interpolator = interpolator !== null ? Interpolator.fromAny(interpolator) : null;
                return new Transition(this._duration, this._ease, interpolator, this._onStart, this._onEnd, this._onInterrupt);
            }
        };
        Transition.prototype.range = function (y0, y1) {
            if (y0 === void 0) {
                return this._interpolator ? this._interpolator.range() : null;
            }
            else {
                var interpolator = void 0;
                if (this._interpolator) {
                    interpolator = this._interpolator.range(y0, y1);
                }
                else {
                    interpolator = Interpolator.from(y0, y1);
                }
                return new Transition(this._duration, this._ease, interpolator, this._onStart, this._onEnd, this._onInterrupt);
            }
        };
        Transition.prototype.onStart = function (onStart) {
            if (onStart === void 0) {
                return this._onStart;
            }
            else {
                return new Transition(this._duration, this._ease, this._interpolator, onStart, this._onEnd, this._onInterrupt);
            }
        };
        Transition.prototype.onEnd = function (onEnd) {
            if (onEnd === void 0) {
                return this._onEnd;
            }
            else {
                return new Transition(this._duration, this._ease, this._interpolator, this._onStart, onEnd, this._onInterrupt);
            }
        };
        Transition.prototype.onInterrupt = function (onInterrupt) {
            if (onInterrupt === void 0) {
                return this._onInterrupt;
            }
            else {
                return new Transition(this._duration, this._ease, this._interpolator, this._onStart, this._onEnd, onInterrupt);
            }
        };
        Transition.prototype.toAny = function () {
            var init = {};
            if (this._duration !== null) {
                init.duration = this._duration;
            }
            if (this._ease !== null) {
                init.ease = this._ease;
            }
            if (this._interpolator !== null) {
                init.interpolator = this._interpolator;
            }
            if (this._onStart !== null) {
                init.onStart = this._onStart;
            }
            if (this._onEnd !== null) {
                init.onEnd = this._onEnd;
            }
            if (this._onInterrupt !== null) {
                init.onInterrupt = this._onInterrupt;
            }
            return init;
        };
        Transition.prototype.equals = function (that) {
            if (this === that) {
                return true;
            }
            else if (that instanceof Transition) {
                return this._duration === that._duration && this._ease === that._ease
                    && util.Objects.equal(this._interpolator, that._interpolator);
            }
            return false;
        };
        Transition.duration = function (duration, ease, interpolator) {
            if (ease === void 0) { ease = null; }
            if (interpolator === void 0) { interpolator = null; }
            ease = ease !== null ? Ease.fromAny(ease) : null;
            interpolator = interpolator !== null ? Interpolator.fromAny(interpolator) : null;
            return new Transition(duration, ease, interpolator, null, null, null);
        };
        Transition.ease = function (ease, interpolator) {
            if (interpolator === void 0) { interpolator = null; }
            ease = Ease.fromAny(ease);
            interpolator = interpolator !== null ? Interpolator.fromAny(interpolator) : null;
            return new Transition(null, ease, interpolator, null, null, null);
        };
        Transition.interpolator = function (interpolator) {
            interpolator = Interpolator.fromAny(interpolator);
            return new Transition(null, null, interpolator, null, null, null);
        };
        Transition.range = function (y0, y1) {
            var interpolator;
            if (y1 === void 0 && Array.isArray(y0)) {
                y0 = y0;
                interpolator = Interpolator.from(y0[0], y0[1]);
            }
            else {
                interpolator = Interpolator.from(y0, y1);
            }
            return new Transition(null, null, interpolator, null, null, null);
        };
        Transition.from = function (duration, ease, interpolator, onStart, onEnd, onInterrupt) {
            if (duration === void 0) { duration = null; }
            if (ease === void 0) { ease = null; }
            if (interpolator === void 0) { interpolator = null; }
            if (onStart === void 0) { onStart = null; }
            if (onEnd === void 0) { onEnd = null; }
            if (onInterrupt === void 0) { onInterrupt = null; }
            ease = ease !== null ? Ease.fromAny(ease) : null;
            interpolator = interpolator !== null ? Interpolator.fromAny(interpolator) : null;
            return new Transition(duration, ease, interpolator, onStart, onEnd, onInterrupt);
        };
        Transition.fromAny = function (tween, value, duration, ease) {
            if (duration === void 0) { duration = null; }
            if (ease === void 0) { ease = null; }
            if (tween instanceof Transition) {
                return tween;
            }
            else if (typeof tween === "object" && tween) {
                return Transition.from(tween.duration, tween.ease, tween.interpolator, tween.onStart, tween.onEnd, tween.onInterrupt);
            }
            else if (tween === true) {
                return Transition.from(duration, ease, Interpolator.from(value));
            }
            else {
                return void 0;
            }
        };
        Transition.isInit = function (value) {
            if (value && typeof value === "object") {
                var init = value;
                return init.duration !== void 0 || init.ease !== void 0 || init.interpolator !== void 0;
            }
            return false;
        };
        Transition.form = function (interpolatorForm, unit) {
            if (interpolatorForm === void 0) {
                interpolatorForm = Transition.interpolatorForm();
            }
            if (interpolatorForm !== Transition.interpolatorForm() || unit !== void 0) {
                unit = unit !== void 0 ? Transition.fromAny(unit) : unit;
                return new Transition.Form(interpolatorForm, unit);
            }
            else {
                if (!Transition._form) {
                    Transition._form = new Transition.Form(interpolatorForm);
                }
                return Transition._form;
            }
        };
        Transition.interpolatorForm = function () {
            throw new Error();
        };
        return Transition;
    }());

    var TransitionForm = (function (_super) {
        __extends(TransitionForm, _super);
        function TransitionForm(interpolatorForm, unit) {
            var _this = _super.call(this) || this;
            _this._interpolatorForm = interpolatorForm;
            _this._unit = unit;
            return _this;
        }
        TransitionForm.prototype.unit = function (unit) {
            if (unit === void 0) {
                return this._unit;
            }
            else {
                unit = Transition.fromAny(unit);
                return new TransitionForm(this._interpolatorForm, unit);
            }
        };
        TransitionForm.prototype.mold = function (transition) {
            if (transition !== void 0) {
                transition = Transition.fromAny(transition);
                var header = structure.Record.create();
                if (transition._duration !== null) {
                    header.slot("duration", transition._duration);
                }
                if (transition._ease !== null) {
                    header.slot("ease", Ease.form().mold(transition._ease));
                }
                var record = structure.Record.of(structure.Attr.of("transition", header));
                if (transition._interpolator !== null) {
                    var interpolator = this._interpolatorForm.mold(transition._interpolator);
                    if (interpolator.isDefined()) {
                        record = record.concat(interpolator);
                    }
                }
                return record;
            }
            else {
                return structure.Item.extant();
            }
        };
        TransitionForm.prototype.cast = function (item) {
            var value = item.toValue();
            var header = value.header("transition");
            if (header.length >= 2) {
                var duration_1 = null;
                var ease_1 = null;
                header.forEach(function (item, index) {
                    var key = item.key.stringValue(void 0);
                    if (key !== void 0) {
                        if (key === "duration") {
                            duration_1 = item.toValue().numberValue(duration_1);
                        }
                        else if (key === "ease") {
                            ease_1 = item.toValue().cast(Ease.form(), ease_1);
                        }
                    }
                    else if (item instanceof structure.Value) {
                        if (index === 0) {
                            duration_1 = item.numberValue(duration_1);
                        }
                        else if (index === 1) {
                            ease_1 = item.cast(Ease.form(), ease_1);
                        }
                    }
                }, this);
                var interpolator = this._interpolatorForm.cast(value.body());
                return Transition.from(duration_1, ease_1, interpolator);
            }
            return void 0;
        };
        return TransitionForm;
    }(structure.Form));
    Transition.Form = TransitionForm;

    var Animator = (function () {
        function Animator() {
        }
        return Animator;
    }());

    var FrameAnimator = (function (_super) {
        __extends(FrameAnimator, _super);
        function FrameAnimator() {
            var _this = _super.call(this) || this;
            _this._animationFrame = 0;
            _this._disabled = false;
            _this._dirty = false;
            return _this;
        }
        Object.defineProperty(FrameAnimator.prototype, "enabled", {
            get: function () {
                return !this._disabled;
            },
            enumerable: true,
            configurable: true
        });
        FrameAnimator.prototype.setEnabled = function (enabled) {
            if (enabled && this._disabled) {
                this._disabled = false;
                this.didSetEnabled(false);
            }
            else if (!enabled && !this._disabled) {
                this._disabled = true;
                this.didSetEnabled(true);
            }
        };
        FrameAnimator.prototype.didSetEnabled = function (enabled) {
            if (enabled) {
                this.animate();
            }
            else {
                this.cancel();
            }
        };
        Object.defineProperty(FrameAnimator.prototype, "dirty", {
            get: function () {
                return this._dirty;
            },
            enumerable: true,
            configurable: true
        });
        FrameAnimator.prototype.setDirty = function (dirty) {
            if (dirty && !this._dirty) {
                this._dirty = true;
                this.didSetDirty(true);
            }
            else if (!dirty && this._dirty) {
                this._dirty = false;
                this.didSetDirty(false);
            }
        };
        FrameAnimator.prototype.didSetDirty = function (dirty) {
        };
        FrameAnimator.prototype.animate = function () {
            if (!this._animationFrame && !this._disabled) {
                if (!this.hasOwnProperty("onAnimationFrame")) {
                    this.onAnimationFrame = this.onAnimationFrame.bind(this);
                }
                this._animationFrame = requestAnimationFrame(this.onAnimationFrame);
            }
        };
        FrameAnimator.prototype.cancel = function () {
            if (this._animationFrame) {
                cancelAnimationFrame(this._animationFrame);
                this._animationFrame = 0;
            }
        };
        FrameAnimator.prototype.onAnimationFrame = function (timestamp) {
            this._animationFrame = 0;
            this.onFrame(timestamp);
        };
        return FrameAnimator;
    }(Animator));

    var ChildAnimator = (function (_super) {
        __extends(ChildAnimator, _super);
        function ChildAnimator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(ChildAnimator.prototype, "dirty", {
            get: function () {
                var parent = this.parent;
                return parent ? parent.dirty : false;
            },
            enumerable: true,
            configurable: true
        });
        ChildAnimator.prototype.setDirty = function (dirty) {
            if (dirty) {
                var parent_1 = this.parent;
                if (parent_1) {
                    parent_1.setDirty(dirty);
                }
            }
        };
        ChildAnimator.prototype.animate = function () {
            var parent = this.parent;
            if (parent) {
                parent.animate();
            }
        };
        return ChildAnimator;
    }(Animator));

    (function (TweenState) {
        TweenState[TweenState["Quiesced"] = 0] = "Quiesced";
        TweenState[TweenState["Diverged"] = 1] = "Diverged";
        TweenState[TweenState["Tracking"] = 2] = "Tracking";
        TweenState[TweenState["Converged"] = 3] = "Converged";
        TweenState[TweenState["Interrupt"] = 4] = "Interrupt";
    })(exports.TweenState || (exports.TweenState = {}));
    var TweenAnimator = (function (_super) {
        __extends(TweenAnimator, _super);
        function TweenAnimator(value, transition) {
            var _this = _super.call(this) || this;
            if (transition) {
                _this._duration = transition._duration !== null ? transition._duration : 0;
                _this._ease = transition._ease !== null ? transition._ease : Ease.linear;
                _this._interpolator = transition._interpolator;
                _this._onStart = transition._onStart;
                _this._onEnd = transition._onEnd;
                _this._onInterrupt = transition._onInterrupt;
            }
            else {
                _this._duration = 0;
                _this._ease = Ease.linear;
                _this._interpolator = null;
                _this._onStart = null;
                _this._onEnd = null;
                _this._onInterrupt = null;
            }
            _this._interrupt = null;
            _this._value = value;
            _this._state = value;
            _this._startTime = 0;
            _this._tweenState = 0;
            _this._disabled = false;
            _this._dirty = false;
            _this._input = null;
            _this._outputs = null;
            _this._version = -1;
            return _this;
        }
        Object.defineProperty(TweenAnimator.prototype, "enabled", {
            get: function () {
                return !this._disabled;
            },
            enumerable: true,
            configurable: true
        });
        TweenAnimator.prototype.setEnabled = function (enabled) {
            if (enabled && this._disabled) {
                this._disabled = false;
                this.didSetEnabled(false);
            }
            else if (!enabled && !this._disabled) {
                this._disabled = true;
                this.didSetEnabled(true);
            }
        };
        TweenAnimator.prototype.didSetEnabled = function (enabled) {
            if (enabled) {
                this.animate();
            }
            else {
                this.cancel();
            }
        };
        Object.defineProperty(TweenAnimator.prototype, "dirty", {
            get: function () {
                return this._dirty;
            },
            enumerable: true,
            configurable: true
        });
        TweenAnimator.prototype.setDirty = function (dirty) {
            if (dirty && !this._dirty) {
                this._dirty = true;
                this.didSetDirty(true);
            }
            else if (!dirty && this._dirty) {
                this._dirty = false;
                this.didSetDirty(false);
            }
        };
        TweenAnimator.prototype.didSetDirty = function (dirty) {
        };
        TweenAnimator.prototype.duration = function (duration) {
            if (duration === void 0) {
                return this._duration;
            }
            else {
                this._duration = Math.max(0, duration);
                return this;
            }
        };
        TweenAnimator.prototype.ease = function (ease) {
            if (ease === void 0) {
                return this._ease;
            }
            else {
                this._ease = Ease.fromAny(ease);
                return this;
            }
        };
        TweenAnimator.prototype.interpolator = function (a, b) {
            if (a === void 0) {
                return this._interpolator;
            }
            else {
                if (arguments.length === 1) {
                    this._interpolator = a;
                }
                else {
                    if (this._interpolator !== null && a !== null && a !== void 0) {
                        this._interpolator = this._interpolator.range(a, b);
                    }
                    else {
                        this._interpolator = Interpolator.from(a, b);
                    }
                }
                return this;
            }
        };
        TweenAnimator.prototype.transition = function (transition) {
            if (transition === void 0) {
                return new Transition(this._duration, this._ease, this._interpolator, null, null, null);
            }
            else {
                transition = Transition.fromAny(transition);
                if (transition._duration !== null) {
                    this._duration = transition._duration;
                }
                if (transition._ease !== null) {
                    this._ease = transition._ease;
                }
                if (transition._interpolator !== null) {
                    this._interpolator = transition._interpolator;
                }
                this._onStart = transition._onStart;
                this._onEnd = transition._onEnd;
                this._onInterrupt = transition._onInterrupt;
                return this;
            }
        };
        Object.defineProperty(TweenAnimator.prototype, "value", {
            get: function () {
                return this._value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TweenAnimator.prototype, "state", {
            get: function () {
                return this._state;
            },
            enumerable: true,
            configurable: true
        });
        TweenAnimator.prototype.setState = function (state, tween) {
            var interrupt = this._onInterrupt;
            this._onInterrupt = null;
            if (tween instanceof Transition || typeof tween === "object" && tween) {
                this.transition(tween);
            }
            else if (!tween) {
                this._duration = 0;
                this._onStart = null;
                this._onEnd = null;
                this._onInterrupt = null;
                this.cancel();
            }
            this._interrupt = interrupt;
            if (state !== null && state !== void 0) {
                if (this._tweenState === 0 && util.Objects.equal(this._state, state)) ;
                else {
                    this.interpolator(this.value, state);
                    this._state = state;
                    this._startTime = 0;
                    if (this._tweenState === 2) {
                        this._tweenState = 4;
                    }
                    else {
                        this._tweenState = 1;
                    }
                    if (tween) {
                        this.animate();
                    }
                    else {
                        this.onFrame(0);
                    }
                }
            }
            else {
                this._state = state;
                this._startTime = 0;
                if (this._tweenState === 2) {
                    this.onInterrupt(this._value);
                    var interruptCallback = this._interrupt;
                    if (interruptCallback) {
                        this._interrupt = null;
                        interruptCallback(this._value);
                    }
                }
                this._tweenState = 0;
                this._value = state;
                if (this._value === void 0) {
                    this._interpolator = null;
                    this.delete();
                }
            }
        };
        TweenAnimator.prototype.onFrame = function (t) {
            if (this._tweenState === 0 || this._disabled) {
                return;
            }
            if (this._tweenState === 4) {
                this.onInterrupt(this._value);
                var interruptCallback = this._interrupt;
                if (interruptCallback) {
                    this._interrupt = null;
                    interruptCallback(this._value);
                }
                this._tweenState = 1;
            }
            if (this._tweenState === 1) {
                if (!util.Objects.equal(this._value, this._state)) {
                    this._startTime = t;
                    this.onStart(this._value);
                    var startCallback = this._onStart;
                    if (startCallback) {
                        this._onStart = null;
                        startCallback(this._value);
                    }
                    this._tweenState = 2;
                }
                else {
                    this.tween(1);
                }
            }
            if (this._tweenState === 2) {
                var u = this._duration ? Math.min(Math.max(0, (t - this._startTime) / this._duration), 1) : 1;
                this.tween(u);
            }
            if (this._tweenState === 3) {
                this._onInterrupt = null;
                this._startTime = 0;
                this._tweenState = 0;
                this.onEnd(this._value);
                var endCallback = this._onEnd;
                if (endCallback) {
                    this._onEnd = null;
                    endCallback(this._value);
                }
            }
            else {
                this.animate();
            }
        };
        TweenAnimator.prototype.interpolate = function (u) {
            return this._interpolator ? this._interpolator.interpolate(u) : this._state;
        };
        TweenAnimator.prototype.tween = function (u) {
            u = this._ease(u);
            var oldValue = this._value;
            var newValue = this.interpolate(u);
            this._value = newValue;
            this.update(newValue, oldValue);
            if (u === 1) {
                this._tweenState = 3;
            }
        };
        TweenAnimator.prototype.onStart = function (value) {
        };
        TweenAnimator.prototype.onEnd = function (value) {
        };
        TweenAnimator.prototype.onInterrupt = function (value) {
        };
        TweenAnimator.prototype.get = function () {
            var state = this.state;
            if (state === null) {
                state = void 0;
            }
            return state;
        };
        TweenAnimator.prototype.input = function () {
            return this._input;
        };
        TweenAnimator.prototype.bindInput = function (input) {
            if (this._input !== null) {
                this._input.unbindOutput(this);
            }
            this._input = input;
            if (this._input !== null) {
                this._input.bindOutput(this);
            }
        };
        TweenAnimator.prototype.unbindInput = function () {
            if (this._input !== null) {
                this._input.unbindOutput(this);
            }
            this._input = null;
        };
        TweenAnimator.prototype.disconnectInputs = function () {
            if (this._outputs === null) {
                var input = this._input;
                if (input !== null) {
                    input.unbindOutput(this);
                    this._input = null;
                    input.disconnectInputs();
                }
            }
        };
        TweenAnimator.prototype.outputIterator = function () {
            return this._outputs !== null ? util.Cursor.array(this._outputs) : util.Cursor.empty();
        };
        TweenAnimator.prototype.bindOutput = function (output) {
            var oldOutputs = this._outputs;
            var n = oldOutputs !== null ? oldOutputs.length : 0;
            var newOutputs = new Array(n + 1);
            for (var i = 0; i < n; i += 1) {
                newOutputs[i] = oldOutputs[i];
            }
            newOutputs[n] = output;
            this._outputs = newOutputs;
        };
        TweenAnimator.prototype.unbindOutput = function (output) {
            var oldOutputs = this._outputs;
            var n = oldOutputs !== null ? oldOutputs.length : 0;
            for (var i = 0; i < n; i += 1) {
                if (oldOutputs[i] === output) {
                    if (n > 1) {
                        var newOutputs = new Array(n - 1);
                        for (var j = 0; j < i; j += 1) {
                            newOutputs[j] = oldOutputs[j];
                        }
                        for (var j = i; j < n - 1; j += 1) {
                            newOutputs[j] = oldOutputs[j + 1];
                        }
                        this._outputs = newOutputs;
                    }
                    else {
                        this._outputs = null;
                    }
                    break;
                }
            }
        };
        TweenAnimator.prototype.unbindOutputs = function () {
            var outputs = this._outputs;
            if (outputs !== null) {
                this._outputs = null;
                for (var i = 0, n = outputs.length; i < n; i += 1) {
                    var output = outputs[i];
                    output.unbindInput();
                }
            }
        };
        TweenAnimator.prototype.disconnectOutputs = function () {
            if (this._input === null) {
                var outputs = this._outputs;
                if (outputs !== null) {
                    this._outputs = null;
                    for (var i = 0, n = outputs.length; i < n; i += 1) {
                        var output = outputs[i];
                        output.unbindInput();
                        output.disconnectOutputs();
                    }
                }
            }
        };
        TweenAnimator.prototype.invalidateOutput = function () {
            this.invalidate();
        };
        TweenAnimator.prototype.invalidateInput = function () {
            this.invalidate();
        };
        TweenAnimator.prototype.invalidate = function () {
            if (this._version >= 0) {
                this.willInvalidate();
                this._version = -1;
                this.onInvalidate();
                var n = this._outputs !== null ? this._outputs.length : 0;
                for (var i = 0; i < n; i += 1) {
                    this._outputs[i].invalidateOutput();
                }
                this.didInvalidate();
            }
        };
        TweenAnimator.prototype.reconcileOutput = function (version) {
            this.reconcile(version);
        };
        TweenAnimator.prototype.reconcileInput = function (version) {
            this.reconcile(version);
        };
        TweenAnimator.prototype.reconcile = function (version) {
            if (this._version < 0) {
                this.willReconcile(version);
                this._version = version;
                if (this._input !== null) {
                    this._input.reconcileInput(version);
                }
                this.onReconcile(version);
                var n = this._outputs !== null ? this._outputs.length : 0;
                for (var i = 0; i < n; i += 1) {
                    this._outputs[i].reconcileOutput(version);
                }
                this.didReconcile(version);
            }
        };
        TweenAnimator.prototype.willInvalidate = function () {
        };
        TweenAnimator.prototype.onInvalidate = function () {
        };
        TweenAnimator.prototype.didInvalidate = function () {
        };
        TweenAnimator.prototype.willReconcile = function (version) {
        };
        TweenAnimator.prototype.onReconcile = function (version) {
            if (this._input !== null) {
                var value = this._input.get();
                if (value !== void 0) {
                    this.setState(value, true);
                }
            }
        };
        TweenAnimator.prototype.didReconcile = function (version) {
        };
        TweenAnimator.prototype.memoize = function () {
            return this;
        };
        TweenAnimator.prototype.map = function (func) {
            var combinator = new streamlet.MapValueCombinator(func);
            combinator.bindInput(this);
            return combinator;
        };
        TweenAnimator.prototype.watch = function (func) {
            var combinator = new streamlet.WatchValueCombinator(func);
            combinator.bindInput(this);
            return this;
        };
        return TweenAnimator;
    }(Animator));

    var TweenFrameAnimator = (function (_super) {
        __extends(TweenFrameAnimator, _super);
        function TweenFrameAnimator(value, transition) {
            var _this = _super.call(this, value, transition) || this;
            _this._animationFrame = 0;
            return _this;
        }
        TweenFrameAnimator.prototype.animate = function () {
            if (!this._animationFrame && !this._disabled) {
                if (!this.hasOwnProperty("onAnimationFrame")) {
                    this.onAnimationFrame = this.onAnimationFrame.bind(this);
                }
                this._animationFrame = requestAnimationFrame(this.onAnimationFrame);
            }
        };
        TweenFrameAnimator.prototype.cancel = function () {
            if (this._animationFrame) {
                cancelAnimationFrame(this._animationFrame);
                this._animationFrame = 0;
            }
        };
        TweenFrameAnimator.prototype.onAnimationFrame = function (timestamp) {
            this._animationFrame = 0;
            this.onFrame(timestamp);
        };
        return TweenFrameAnimator;
    }(TweenAnimator));

    var TweenChildAnimator = (function (_super) {
        __extends(TweenChildAnimator, _super);
        function TweenChildAnimator(parent, value, transition) {
            if (transition === void 0) { transition = null; }
            var _this = _super.call(this, value, transition) || this;
            _this.parent = parent;
            return _this;
        }
        Object.defineProperty(TweenChildAnimator.prototype, "dirty", {
            get: function () {
                var parent = this.parent;
                return parent ? parent.dirty : false;
            },
            enumerable: true,
            configurable: true
        });
        TweenChildAnimator.prototype.setDirty = function (dirty) {
            if (dirty) {
                var parent_1 = this.parent;
                if (parent_1) {
                    parent_1.setDirty(dirty);
                }
            }
        };
        TweenChildAnimator.prototype.animate = function () {
            var parent = this.parent;
            if (parent && !this._disabled) {
                parent.animate();
            }
        };
        TweenChildAnimator.prototype.cancel = function () {
        };
        TweenChildAnimator.prototype.update = function (newValue, oldValue) {
            if (!util.Objects.equal(oldValue, newValue)) {
                this.setDirty(true);
            }
        };
        TweenChildAnimator.prototype.delete = function () {
        };
        return TweenChildAnimator;
    }(TweenAnimator));

    var PropertyAnimator = (function (_super) {
        __extends(PropertyAnimator, _super);
        function PropertyAnimator(target, key, value, transition) {
            if (transition === void 0) { transition = null; }
            var _this = _super.call(this, value, transition) || this;
            _this.target = target;
            _this.key = key;
            return _this;
        }
        PropertyAnimator.prototype.update = function (newValue, oldValue) {
            if (!util.Objects.equal(oldValue, newValue)) {
                this.willUpdate(newValue, oldValue);
                this.target[this.key] = newValue;
                this.didUpdate(newValue, oldValue);
            }
        };
        PropertyAnimator.prototype.willUpdate = function (newValue, oldValue) {
        };
        PropertyAnimator.prototype.didUpdate = function (newValue, oldValue) {
        };
        PropertyAnimator.prototype.delete = function () {
            delete this.target[this.key];
        };
        return PropertyAnimator;
    }(TweenFrameAnimator));

    var CustomEventConstructor = function (type, init) {
        if (init === void 0) { init = {}; }
        var event = document.createEvent("CustomEvent");
        event.initCustomEvent(type, init.bubbles || false, init.cancelable || false, init.detail);
        event.__proto__ = this.__proto__;
        return event;
    };
    if (typeof Event !== "undefined") {
        CustomEventConstructor.prototype = Event.prototype;
    }

    var ResizeObserverPolyfill = (function () {
        function ResizeObserverPolyfill(callback) {
            this.callback = callback;
            this.observationTargets = [];
            this.activeTargets = [];
            this.skippedTargets = [];
            DETECTOR.addObserver(this);
        }
        ResizeObserverPolyfill.prototype.observe = function (target) {
            for (var i = 0; i < this.observationTargets.length; i += 1) {
                if (target === this.observationTargets[i].target) {
                    return;
                }
            }
            var observation = new ResizeObservationPolyfill(target);
            this.observationTargets.push(observation);
            DETECTOR.redetect();
        };
        ResizeObserverPolyfill.prototype.unobserve = function (target) {
            for (var i = 0; i < this.observationTargets.length; i += 1) {
                if (target === this.observationTargets[i].target) {
                    this.observationTargets.splice(i, 1);
                }
            }
            if (!this.observationTargets.length) {
                DETECTOR.removeObserver(this);
            }
        };
        ResizeObserverPolyfill.prototype.gatherActive = function (depth) {
            this.clearActive();
            this.clearSkipped();
            for (var i = 0; i < this.observationTargets.length; i += 1) {
                var observation = this.observationTargets[i];
                if (observation.isActive()) {
                    var targetDepth = calculateDepth(observation.target);
                    if (targetDepth > depth) {
                        this.activeTargets.push(observation);
                    }
                    else {
                        this.skippedTargets.push(observation);
                    }
                }
            }
        };
        ResizeObserverPolyfill.prototype.broadcastActive = function (shallowestTargetDepth) {
            if (this.hasActive()) {
                var entries = [];
                for (var i = 0; i < this.activeTargets.length; i += 1) {
                    var observation = this.observationTargets[i];
                    var entry = new ResizeObserverEntryPolyfill(observation.target);
                    entries.push(entry);
                    observation.broadcastWidth = entry.contentRect.width;
                    observation.broadcastHeight = entry.contentRect.height;
                    var targetDepth = calculateDepth(observation.target);
                    if (targetDepth < shallowestTargetDepth) {
                        shallowestTargetDepth = targetDepth;
                    }
                }
                this.callback(entries, this);
                this.clearActive();
            }
            return shallowestTargetDepth;
        };
        ResizeObserverPolyfill.prototype.hasActive = function () {
            return this.activeTargets.length > 0;
        };
        ResizeObserverPolyfill.prototype.hasSkipped = function () {
            return this.skippedTargets.length > 0;
        };
        ResizeObserverPolyfill.prototype.clearActive = function () {
            this.activeTargets.length = 0;
        };
        ResizeObserverPolyfill.prototype.clearSkipped = function () {
            this.skippedTargets.length = 0;
        };
        ResizeObserverPolyfill.prototype.disconnect = function () {
            this.clearActive();
            this.observationTargets.length = 0;
            DETECTOR.removeObserver(this);
        };
        return ResizeObserverPolyfill;
    }());
    var ResizeObserver = (typeof window !== "undefined" && typeof window.ResizeObserver !== "undefined")
        ? window.ResizeObserver
        : ResizeObserverPolyfill;
    var ResizeObserverEntryPolyfill = (function () {
        function ResizeObserverEntryPolyfill(target, contentRect) {
            this.target = target;
            this.contentRect = contentRect || getContentRect(target);
        }
        return ResizeObserverEntryPolyfill;
    }());
    var ResizeObservationPolyfill = (function () {
        function ResizeObservationPolyfill(target) {
            this.target = target;
            this.broadcastWidth = 0;
            this.broadcastHeight = 0;
        }
        ResizeObservationPolyfill.prototype.isActive = function () {
            var contentRect = getContentRect(this.target);
            return !!contentRect && (Math.round(contentRect.width) !== Math.round(this.broadcastWidth) ||
                Math.round(contentRect.height) !== Math.round(this.broadcastHeight));
        };
        return ResizeObservationPolyfill;
    }());
    var ResizeDetector = (function () {
        function ResizeDetector() {
            this.resizeObservers = [];
            this.mutationObserver = void 0;
            this.detectAnimationFrame = 0;
            this.connected = false;
            this.onResize = this.onResize.bind(this);
            this.onTransitionEnd = this.onTransitionEnd.bind(this);
            this.onMutation = this.onMutation.bind(this);
            this.onSubtreeModified = void 0;
            this.onDetectAnimationFrame = this.onDetectAnimationFrame.bind(this);
        }
        ResizeDetector.prototype.addObserver = function (observer) {
            if (this.resizeObservers.indexOf(observer) < 0) {
                this.resizeObservers.push(observer);
            }
            this.connect();
        };
        ResizeDetector.prototype.removeObserver = function (observer) {
            var index = this.resizeObservers.indexOf(observer);
            if (index >= 0) {
                this.resizeObservers.splice(index, 1);
            }
            if (!this.resizeObservers.length) {
                this.disconnect();
            }
        };
        ResizeDetector.prototype.gatherActive = function (depth) {
            for (var i = 0; i < this.resizeObservers.length; i += 1) {
                this.resizeObservers[i].gatherActive(depth);
            }
        };
        ResizeDetector.prototype.hasActive = function () {
            for (var i = 0; i < this.resizeObservers.length; i += 1) {
                if (this.resizeObservers[i].hasActive()) {
                    return true;
                }
            }
            return false;
        };
        ResizeDetector.prototype.hasSkipped = function () {
            for (var i = 0; i < this.resizeObservers.length; i += 1) {
                if (this.resizeObservers[i].hasSkipped()) {
                    return true;
                }
            }
            return false;
        };
        ResizeDetector.prototype.broadcastActive = function () {
            var shallowestTargetDepth = Number.POSITIVE_INFINITY;
            for (var i = 0; i < this.resizeObservers.length; i += 1) {
                shallowestTargetDepth = this.resizeObservers[i].broadcastActive(shallowestTargetDepth);
            }
            return shallowestTargetDepth;
        };
        ResizeDetector.prototype.detect = function () {
            var depth = 0;
            this.gatherActive(depth);
            do {
                depth = this.broadcastActive();
                this.gatherActive(depth);
            } while (this.hasActive());
            if (this.hasSkipped()) {
                window.dispatchEvent(new ErrorEvent("ResizeObserver loop completed with undelivered notifications."));
            }
        };
        ResizeDetector.prototype.redetect = function () {
            if (!this.detectAnimationFrame) {
                this.detectAnimationFrame = requestAnimationFrame(this.onDetectAnimationFrame);
            }
        };
        ResizeDetector.prototype.onDetectAnimationFrame = function (timestamp) {
            this.detectAnimationFrame = 0;
            this.detect();
        };
        ResizeDetector.prototype.onResize = function (event) {
            this.redetect();
        };
        ResizeDetector.prototype.onTransitionEnd = function (event) {
            var reflow = false;
            for (var i = 0; i < REFLOW_KEYS.length; i += 1) {
                if (event.propertyName.indexOf(REFLOW_KEYS[i]) >= 0) {
                    reflow = true;
                    break;
                }
            }
            if (reflow) {
                this.redetect();
            }
        };
        ResizeDetector.prototype.onMutation = function (mutations) {
            for (var i = 0; i < mutations.length; i += 1) {
                var mutation = mutations[i];
                if (mutation.type === "childList") {
                    if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                        for (var j = 0; j < mutation.addedNodes.length; j += 1) {
                            this.addShadows(mutation.addedNodes[j]);
                        }
                    }
                }
            }
            this.redetect();
        };
        ResizeDetector.prototype.addShadows = function (node) {
            if (node instanceof Element) {
                for (var i = 0; i < node.childNodes.length; i += 1) {
                    this.addShadows(node.childNodes[i]);
                }
                if (node.shadowRoot) {
                    this.observe(node.shadowRoot);
                    this.addShadows(node.shadowRoot);
                }
            }
        };
        ResizeDetector.prototype.observe = function (target) {
            this.mutationObserver.observe(target, {
                attributes: true,
                childList: true,
                characterData: true,
                subtree: true,
            });
        };
        ResizeDetector.prototype.connect = function () {
            if (this.connected) {
                return;
            }
            window.addEventListener("resize", this.onResize);
            document.addEventListener("transitionend", this.onTransitionEnd);
            var isIE11 = typeof navigator !== "undefined" && (/Trident\/.*rv:11/).test(navigator.userAgent);
            if (typeof MutationObserver !== "undefined" && !isIE11) {
                this.mutationObserver = new MutationObserver(this.onMutation);
                this.observe(document);
                this.addShadows(document);
            }
            else {
                this.onSubtreeModified = this.onResize;
                document.addEventListener("DOMSubtreeModified", this.onSubtreeModified);
            }
            this.connected = true;
        };
        ResizeDetector.prototype.disconnect = function () {
            if (!this.connected) {
                return;
            }
            window.removeEventListener("resize", this.onResize);
            document.removeEventListener("transitionend", this.onTransitionEnd);
            if (this.mutationObserver) {
                this.mutationObserver.disconnect();
                this.mutationObserver = void 0;
            }
            if (this.onSubtreeModified) {
                document.removeEventListener("DOMSubtreeModified", this.onSubtreeModified);
                this.onSubtreeModified = void 0;
            }
            if (this.detectAnimationFrame) {
                cancelAnimationFrame(this.detectAnimationFrame);
                this.detectAnimationFrame = 0;
            }
            this.connected = false;
        };
        return ResizeDetector;
    }());
    var REFLOW_KEYS = ["top", "right", "bottom", "left", "width", "height", "size", "weight"];
    var DETECTOR = new ResizeDetector();
    function calculateDepth(node) {
        var k = 0;
        while (node.parentNode) {
            node = node.parentNode;
            k += 1;
        }
        return k;
    }
    function isSVGGraphicsElement(target) {
        return typeof SVGGraphicsElement !== "undefined" ?
            target instanceof SVGGraphicsElement :
            target instanceof SVGElement && typeof target.getBBox === "function";
    }
    function getContentRect(target) {
        if (target instanceof HTMLElement) {
            return getHTMLContentRect(target);
        }
        else if (isSVGGraphicsElement(target)) {
            return getSVGContentRect(target);
        }
        else {
            return createContentRect(0, 0, 0, 0);
        }
    }
    function getHTMLContentRect(target) {
        if (!target.clientWidth && !target.clientHeight) {
            return createContentRect(0, 0, 0, 0);
        }
        var style = getComputedStyle(target);
        var paddingLeft = toFloat(style.getPropertyValue("padding-left"));
        var paddingTop = toFloat(style.getPropertyValue("padding-top"));
        var xPadding = paddingLeft + toFloat(style.getPropertyValue("padding-right"));
        var yPadding = paddingTop + toFloat(style.getPropertyValue("padding-bottom"));
        var width = toFloat(style.getPropertyValue("width"));
        var height = toFloat(style.getPropertyValue("height"));
        if (style.getPropertyValue("box-sizing") === "border-box") {
            if (Math.round(width + xPadding) !== target.clientWidth) {
                width -= xPadding + toFloat(style.getPropertyValue("border-left-width")) +
                    toFloat(style.getPropertyValue("border-right-width"));
            }
            if (Math.round(height + yPadding) !== target.clientHeight) {
                height -= yPadding + toFloat(style.getPropertyValue("border-top-width")) +
                    toFloat(style.getPropertyValue("border-bottom-width"));
            }
        }
        if (target !== document.documentElement) {
            var yScrollbar = Math.round(width + xPadding) - target.clientWidth;
            var xScrollbar = Math.round(height + yPadding) - target.clientHeight;
            if (Math.abs(yScrollbar) !== 1) {
                width -= yScrollbar;
            }
            if (Math.abs(xScrollbar) !== 1) {
                height -= xScrollbar;
            }
        }
        return createContentRect(paddingLeft, paddingTop, width, height);
    }
    function getSVGContentRect(target) {
        var bbox = target.getBBox();
        return createContentRect(0, 0, bbox.width, bbox.height);
    }
    function toFloat(value) {
        return parseFloat(value) || 0;
    }
    function createContentRect(x, y, width, height) {
        return {
            x: x,
            y: y,
            width: width,
            height: height,
            top: y,
            right: x + width,
            bottom: y + height,
            left: x,
        };
    }

    var BoxShadow = (function () {
        function BoxShadow(inset, offsetX, offsetY, blurRadius, spreadRadius, color, next) {
            this.inset = inset;
            this.offsetX = offsetX;
            this.offsetY = offsetY;
            this.blurRadius = blurRadius;
            this.spreadRadius = spreadRadius;
            this.color = color;
            this.next = next;
        }
        BoxShadow.prototype.isDefined = function () {
            return this.inset || this.offsetX.isDefined() || this.offsetY.isDefined()
                || this.blurRadius.isDefined() || this.spreadRadius.isDefined()
                || this.color.isDefined() || (this.next ? this.next.isDefined() : false);
        };
        BoxShadow.prototype.and = function (inset, offsetX, offsetY, blurRadius, spreadRadius, color) {
            var next = this.next ? this.next.and.apply(this.next, arguments) : BoxShadow.of.apply(null, arguments);
            return new BoxShadow(this.inset, this.offsetX, this.offsetY, this.blurRadius, this.spreadRadius, this.color, next);
        };
        BoxShadow.prototype.equals = function (that) {
            if (this === that) {
                return true;
            }
            else if (that instanceof BoxShadow) {
                return this.inset === that.inset && this.offsetX.equals(that.offsetX)
                    && this.offsetY.equals(that.offsetY) && this.blurRadius.equals(that.blurRadius)
                    && this.spreadRadius.equals(that.spreadRadius) && this.color.equals(that.color)
                    && util.Objects.equal(this.next, that.next);
            }
            return false;
        };
        BoxShadow.prototype.toString = function () {
            if (this.isDefined()) {
                var s = "";
                var boxShadow = this;
                do {
                    if (boxShadow.inset) {
                        s += "inset";
                        s += " ";
                    }
                    s += boxShadow.offsetX.toString();
                    s += " ";
                    s += boxShadow.offsetY.toString();
                    s += " ";
                    s += boxShadow.blurRadius.toString();
                    s += " ";
                    s += boxShadow.spreadRadius.toString();
                    s += " ";
                    s += boxShadow.color.toString();
                    if (boxShadow.next) {
                        s += ", ";
                        boxShadow = boxShadow.next;
                        continue;
                    }
                    break;
                } while (true);
                return s;
            }
            else {
                return "none";
            }
        };
        BoxShadow.none = function () {
            if (!BoxShadow._none) {
                BoxShadow._none = new BoxShadow(false, Length.zero(), Length.zero(), Length.zero(), Length.zero(), Color.black(), null);
            }
            return BoxShadow._none;
        };
        BoxShadow.of = function (inset, offsetX, offsetY, blurRadius, spreadRadius, color) {
            if (arguments.length === 1) {
                return BoxShadow.fromAny(arguments[0]);
            }
            else if (typeof inset !== "boolean") {
                if (arguments.length === 3) {
                    color = Color.fromAny(arguments[2]);
                    spreadRadius = Length.zero();
                    blurRadius = Length.zero();
                    offsetY = Length.fromAny(arguments[1]);
                    offsetX = Length.fromAny(arguments[0]);
                }
                else if (arguments.length === 4) {
                    color = Color.fromAny(arguments[3]);
                    spreadRadius = Length.zero();
                    blurRadius = Length.fromAny(arguments[2]);
                    offsetY = Length.fromAny(arguments[1]);
                    offsetX = Length.fromAny(arguments[0]);
                }
                else if (arguments.length === 5) {
                    color = Color.fromAny(arguments[4]);
                    spreadRadius = Length.fromAny(arguments[3]);
                    blurRadius = Length.fromAny(arguments[2]);
                    offsetY = Length.fromAny(arguments[1]);
                    offsetX = Length.fromAny(arguments[0]);
                }
                else {
                    throw new TypeError("" + arguments);
                }
                inset = false;
            }
            else {
                if (arguments.length === 4) {
                    color = Color.fromAny(arguments[3]);
                    spreadRadius = Length.zero();
                    blurRadius = Length.zero();
                    offsetX = Length.fromAny(arguments[1]);
                    offsetY = Length.fromAny(arguments[2]);
                }
                else if (arguments.length === 5) {
                    color = Color.fromAny(arguments[4]);
                    spreadRadius = Length.zero();
                    blurRadius = Length.fromAny(arguments[3]);
                    offsetX = Length.fromAny(arguments[1]);
                    offsetY = Length.fromAny(arguments[2]);
                }
                else if (arguments.length === 6) {
                    color = Color.fromAny(arguments[5]);
                    spreadRadius = Length.fromAny(arguments[4]);
                    blurRadius = Length.fromAny(arguments[3]);
                    offsetY = Length.fromAny(arguments[2]);
                    offsetX = Length.fromAny(arguments[1]);
                }
                else {
                    throw new TypeError("" + arguments);
                }
            }
            return new BoxShadow(inset, offsetX, offsetY, blurRadius, spreadRadius, color, null);
        };
        BoxShadow.fromAny = function () {
            var values = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                values[_i] = arguments[_i];
            }
            var value;
            if (arguments.length === 0) {
                value = BoxShadow.none();
            }
            else if (arguments.length === 1) {
                value = arguments[0];
            }
            else {
                value = arguments;
            }
            if (value instanceof BoxShadow) {
                return value;
            }
            else if (typeof value === "string") {
                return BoxShadow.parse(value);
            }
            else if (typeof value === "object" && value && value.length === void 0) {
                value = value;
                var inset = value.inset || false;
                var offsetX = value.offsetX !== void 0 ? Length.fromAny(value.offsetX) : Length.zero();
                var offsetY = value.offsetY !== void 0 ? Length.fromAny(value.offsetY) : Length.zero();
                var blurRadius = value.blurRadius !== void 0 ? Length.fromAny(value.blurRadius) : Length.zero();
                var spreadRadius = value.spreadRadius !== void 0 ? Length.fromAny(value.spreadRadius) : Length.zero();
                var color = value.color !== void 0 ? Color.fromAny(value.color) : Color.black();
                return new BoxShadow(inset, offsetX, offsetY, blurRadius, spreadRadius, color, null);
            }
            else if (typeof value === "object" && value && value.length > 0) {
                value = value;
                var boxShadow = BoxShadow.fromAny(value[0]);
                for (var i = 1; i < value.length; i += 1) {
                    boxShadow = boxShadow.and(value[i]);
                }
                return boxShadow;
            }
            throw new TypeError("" + value);
        };
        BoxShadow.fromValue = function (value) {
            var boxShadow;
            value.forEach(function (item, index) {
                var header = item.header("boxShadow");
                if (header) {
                    var inset_1;
                    var offsetX_1;
                    var offsetY_1;
                    var blurRadius_1;
                    var spreadRadius_1;
                    var color_1;
                    header.forEach(function (item, index) {
                        var key = item.key.stringValue();
                        if (key !== void 0) {
                            if (key === "inset") {
                                inset_1 = item.toValue().booleanValue(inset_1);
                            }
                            else if (key === "offsetX") {
                                offsetX_1 = item.toValue().cast(Length.form(), offsetX_1);
                            }
                            else if (key === "offsetY") {
                                offsetY_1 = item.toValue().cast(Length.form(), offsetY_1);
                            }
                            else if (key === "blurRadius") {
                                blurRadius_1 = item.toValue().cast(Length.form(), blurRadius_1);
                            }
                            else if (key === "spreadRadius") {
                                spreadRadius_1 = item.toValue().cast(Length.form(), spreadRadius_1);
                            }
                            else if (key === "color") {
                                color_1 = item.toValue().cast(Color.form(), color_1);
                            }
                        }
                        else if (item instanceof structure.Value) {
                            if (index === 0 && item instanceof structure.Text && item.value === "inset") {
                                inset_1 = true;
                            }
                            else if (index === 0 || index === 1 && inset_1 !== void 0) {
                                offsetX_1 = item.cast(Length.form(), offsetX_1);
                            }
                            else if (index === 1 || index === 2 && inset_1 !== void 0) {
                                offsetY_1 = item.cast(Length.form(), offsetY_1);
                            }
                            else if (index === 2 || index === 3 && inset_1 !== void 0) {
                                blurRadius_1 = item.cast(Length.form(), blurRadius_1);
                                if (blurRadius_1 === void 0) {
                                    color_1 = item.cast(Color.form(), color_1);
                                }
                            }
                            else if ((index === 3 || index === 4 && inset_1 === void 0) && color_1 === void 0) {
                                spreadRadius_1 = item.cast(Length.form(), spreadRadius_1);
                                if (spreadRadius_1 === void 0) {
                                    color_1 = item.cast(Color.form(), color_1);
                                }
                            }
                            else if ((index === 4 || index === 5 && inset_1 === void 0) && color_1 === void 0) {
                                color_1 = item.cast(Color.form(), color_1);
                            }
                        }
                    });
                    inset_1 = inset_1 !== void 0 ? inset_1 : false;
                    offsetX_1 = offsetX_1 !== void 0 ? offsetX_1 : Length.zero();
                    offsetY_1 = offsetY_1 !== void 0 ? offsetY_1 : Length.zero();
                    blurRadius_1 = blurRadius_1 !== void 0 ? blurRadius_1 : Length.zero();
                    spreadRadius_1 = spreadRadius_1 !== void 0 ? spreadRadius_1 : Length.zero();
                    color_1 = color_1 !== void 0 ? color_1 : Color.black();
                    var next = new BoxShadow(inset_1 || false, offsetX_1, offsetY_1, blurRadius_1, spreadRadius_1, color_1, null);
                    if (boxShadow) {
                        boxShadow = boxShadow.and(next);
                    }
                    else {
                        boxShadow = next;
                    }
                }
            });
            return boxShadow;
        };
        BoxShadow.parse = function (string) {
            var input = codec.Unicode.stringInput(string);
            while (input.isCont() && codec.Unicode.isWhitespace(input.head())) {
                input = input.step();
            }
            var parser = BoxShadow.Parser.parse(input);
            if (parser.isDone()) {
                while (input.isCont() && codec.Unicode.isWhitespace(input.head())) {
                    input = input.step();
                }
            }
            if (input.isCont() && !parser.isError()) {
                parser = codec.Parser.error(codec.Diagnostic.unexpected(input));
            }
            return parser.bind();
        };
        BoxShadow.isInit = function (value) {
            if (value && typeof value === "object") {
                var init = value;
                return init.offsetX !== void 0 && init.offsetY !== void 0 && init.color !== void 0;
            }
            return false;
        };
        BoxShadow.form = function (unit) {
            if (unit !== void 0) {
                unit = BoxShadow.fromAny(unit);
            }
            if (unit !== BoxShadow.none()) {
                return new BoxShadow.Form(unit);
            }
            else {
                if (!BoxShadow._form) {
                    BoxShadow._form = new BoxShadow.Form(BoxShadow.none());
                }
                return BoxShadow._form;
            }
        };
        return BoxShadow;
    }());

    var BoxShadowParser = (function (_super) {
        __extends(BoxShadowParser, _super);
        function BoxShadowParser(boxShadow, identOutput, offsetXParser, offsetYParser, blurRadiusParser, spreadRadiusParser, colorParser, step) {
            var _this = _super.call(this) || this;
            _this.boxShadow = boxShadow;
            _this.identOutput = identOutput;
            _this.offsetXParser = offsetXParser;
            _this.offsetYParser = offsetYParser;
            _this.blurRadiusParser = blurRadiusParser;
            _this.spreadRadiusParser = spreadRadiusParser;
            _this.colorParser = colorParser;
            _this.step = step;
            return _this;
        }
        BoxShadowParser.prototype.feed = function (input) {
            return BoxShadowParser.parse(input, this.boxShadow, this.identOutput, this.offsetXParser, this.offsetYParser, this.blurRadiusParser, this.spreadRadiusParser, this.colorParser, this.step);
        };
        BoxShadowParser.parse = function (input, boxShadow, identOutput, offsetXParser, offsetYParser, blurRadiusParser, spreadRadiusParser, colorParser, step) {
            if (step === void 0) { step = 1; }
            var c = 0;
            do {
                if (step === 1) {
                    while (input.isCont() && (c = input.head(), codec.Unicode.isSpace(c))) {
                        input.step();
                    }
                    if (input.isCont()) {
                        if (codec.Unicode.isAlpha(c)) {
                            step = 2;
                        }
                        else {
                            step = 4;
                        }
                    }
                    else if (!input.isEmpty()) {
                        return codec.Parser.error(codec.Diagnostic.unexpected(input));
                    }
                }
                if (step === 2) {
                    identOutput = identOutput || codec.Unicode.stringOutput();
                    while (input.isCont() && (c = input.head(), codec.Unicode.isAlpha(c))) {
                        input = input.step();
                        identOutput.write(c);
                    }
                    if (!input.isEmpty()) {
                        var ident = identOutput.bind();
                        switch (ident) {
                            case "inset":
                                step = 3;
                                break;
                            case "none": return codec.Parser.done(BoxShadow.none());
                            default: return codec.Parser.error(codec.Diagnostic.message("unknown box-shadow: " + ident, input));
                        }
                    }
                }
                if (step === 3) {
                    if (input.isCont()) {
                        if (codec.Unicode.isSpace(input.head())) {
                            input.step();
                            step = 4;
                        }
                        else {
                            return codec.Parser.error(codec.Diagnostic.expected("space", input));
                        }
                    }
                    else if (input.isDone()) {
                        return codec.Parser.error(codec.Diagnostic.unexpected(input));
                    }
                }
                if (step === 4) {
                    if (!offsetXParser) {
                        while (input.isCont() && codec.Unicode.isSpace(input.head())) {
                            input.step();
                        }
                        if (!input.isEmpty()) {
                            offsetXParser = LengthParser.parse(input);
                        }
                    }
                    else {
                        offsetXParser = offsetXParser.feed(input);
                    }
                    if (offsetXParser) {
                        if (offsetXParser.isDone()) {
                            step = 5;
                        }
                        else if (offsetXParser.isError()) {
                            return offsetXParser.asError();
                        }
                    }
                }
                if (step === 5) {
                    if (input.isCont()) {
                        if (codec.Unicode.isSpace(input.head())) {
                            input.step();
                            step = 6;
                        }
                        else {
                            return codec.Parser.error(codec.Diagnostic.expected("space", input));
                        }
                    }
                    else if (!input.isEmpty()) {
                        return codec.Parser.error(codec.Diagnostic.unexpected(input));
                    }
                }
                if (step === 6) {
                    if (!offsetYParser) {
                        while (input.isCont() && codec.Unicode.isSpace(input.head())) {
                            input.step();
                        }
                        if (!input.isEmpty()) {
                            offsetYParser = LengthParser.parse(input);
                        }
                    }
                    else {
                        offsetYParser = offsetYParser.feed(input);
                    }
                    if (offsetYParser) {
                        if (offsetYParser.isDone()) {
                            step = 7;
                        }
                        else if (offsetYParser.isError()) {
                            return offsetYParser.asError();
                        }
                    }
                }
                if (step === 7) {
                    if (input.isCont()) {
                        if (codec.Unicode.isSpace(input.head())) {
                            input.step();
                            step = 8;
                        }
                        else {
                            return codec.Parser.error(codec.Diagnostic.expected("space", input));
                        }
                    }
                    else if (!input.isEmpty()) {
                        return codec.Parser.error(codec.Diagnostic.unexpected(input));
                    }
                }
                if (step === 8) {
                    if (!blurRadiusParser) {
                        while (input.isCont() && (c = input.head(), codec.Unicode.isSpace(c))) {
                            input.step();
                        }
                        if (input.isCont() && (c === 45 || c >= 48 && c <= 57)) {
                            blurRadiusParser = LengthParser.parse(input);
                        }
                        else if (!input.isEmpty()) {
                            step = 12;
                        }
                    }
                    else {
                        blurRadiusParser = blurRadiusParser.feed(input);
                    }
                    if (blurRadiusParser) {
                        if (blurRadiusParser.isDone()) {
                            step = 9;
                        }
                        else if (blurRadiusParser.isError()) {
                            return blurRadiusParser.asError();
                        }
                    }
                }
                if (step === 9) {
                    if (input.isCont()) {
                        if (codec.Unicode.isSpace(input.head())) {
                            input.step();
                            step = 10;
                        }
                        else {
                            return codec.Parser.error(codec.Diagnostic.expected("space", input));
                        }
                    }
                    else if (!input.isEmpty()) {
                        return codec.Parser.error(codec.Diagnostic.unexpected(input));
                    }
                }
                if (step === 10) {
                    if (!spreadRadiusParser) {
                        while (input.isCont() && (c = input.head(), codec.Unicode.isSpace(c))) {
                            input.step();
                        }
                        if (input.isCont() && (c === 45 || c >= 48 && c <= 57)) {
                            spreadRadiusParser = LengthParser.parse(input);
                        }
                        else if (!input.isEmpty()) {
                            step = 12;
                        }
                    }
                    else {
                        spreadRadiusParser = spreadRadiusParser.feed(input);
                    }
                    if (spreadRadiusParser) {
                        if (spreadRadiusParser.isDone()) {
                            step = 11;
                        }
                        else if (spreadRadiusParser.isError()) {
                            return spreadRadiusParser.asError();
                        }
                    }
                }
                if (step === 11) {
                    if (input.isCont()) {
                        if (codec.Unicode.isSpace(input.head())) {
                            input.step();
                            step = 12;
                        }
                        else {
                            return codec.Parser.error(codec.Diagnostic.expected("space", input));
                        }
                    }
                    else if (!input.isEmpty()) {
                        return codec.Parser.error(codec.Diagnostic.unexpected(input));
                    }
                }
                if (step === 12) {
                    if (!colorParser) {
                        while (input.isCont() && codec.Unicode.isSpace(input.head())) {
                            input.step();
                        }
                        if (!input.isEmpty()) {
                            colorParser = ColorParser.parse(input);
                        }
                    }
                    else {
                        colorParser = colorParser.feed(input);
                    }
                    if (colorParser) {
                        if (colorParser.isDone()) {
                            var inset = identOutput ? identOutput.bind() === "inset" : false;
                            var offsetX = offsetXParser.bind();
                            var offsetY = offsetYParser.bind();
                            var blurRadius = blurRadiusParser ? blurRadiusParser.bind() : Length.zero();
                            var spreadRadius = spreadRadiusParser ? spreadRadiusParser.bind() : Length.zero();
                            var color = colorParser.bind();
                            var next = new BoxShadow(inset, offsetX, offsetY, blurRadius, spreadRadius, color, null);
                            if (!boxShadow) {
                                boxShadow = next;
                            }
                            else {
                                boxShadow = boxShadow.and(next);
                            }
                            identOutput = void 0;
                            offsetXParser = void 0;
                            offsetYParser = void 0;
                            blurRadiusParser = void 0;
                            spreadRadiusParser = void 0;
                            colorParser = void 0;
                            step = 13;
                        }
                        else if (colorParser.isError()) {
                            return colorParser.asError();
                        }
                    }
                }
                if (step === 13) {
                    while (input.isCont() && (c = input.head(), codec.Unicode.isSpace(c))) {
                        input.step();
                    }
                    if (input.isCont() && c === 44) {
                        input.step();
                        step = 1;
                        continue;
                    }
                    else if (!input.isEmpty()) {
                        return codec.Parser.done(boxShadow);
                    }
                }
                break;
            } while (true);
            return new BoxShadowParser(boxShadow, identOutput, offsetXParser, offsetYParser, blurRadiusParser, spreadRadiusParser, colorParser, step);
        };
        return BoxShadowParser;
    }(codec.Parser));
    BoxShadow.Parser = BoxShadowParser;

    var BoxShadowForm = (function (_super) {
        __extends(BoxShadowForm, _super);
        function BoxShadowForm(unit) {
            var _this = _super.call(this) || this;
            _this._unit = unit;
            return _this;
        }
        BoxShadowForm.prototype.unit = function (unit) {
            if (arguments.length === 0) {
                return this._unit;
            }
            else {
                return new BoxShadowForm(unit);
            }
        };
        BoxShadowForm.prototype.mold = function (boxShadow) {
            var shadow = BoxShadow.fromAny(boxShadow);
            var record = structure.Record.create();
            do {
                var header = structure.Record.create(5);
                if (shadow.inset) {
                    header.push("inset");
                }
                header.push(Length.form().mold(shadow.offsetX));
                header.push(Length.form().mold(shadow.offsetY));
                header.push(Length.form().mold(shadow.blurRadius));
                header.push(Length.form().mold(shadow.spreadRadius));
                header.push(Color.form().mold(shadow.color));
                record.attr("boxShadow", header);
                if (shadow.next) {
                    shadow = shadow.next;
                    continue;
                }
                break;
            } while (true);
            return record;
        };
        BoxShadowForm.prototype.cast = function (item) {
            var value = item.toValue();
            var boxShadow;
            try {
                boxShadow = BoxShadow.fromValue(value);
                if (!boxShadow) {
                    var string = value.stringValue();
                    if (string !== void 0) {
                        boxShadow = BoxShadow.parse(string);
                    }
                }
            }
            catch (e) {
            }
            return boxShadow;
        };
        return BoxShadowForm;
    }(structure.Form));
    BoxShadow.Form = BoxShadowForm;

    var StyleValue = {
        fromAny: function (value) {
            if (value instanceof time.DateTime
                || value instanceof Angle
                || value instanceof Length
                || value instanceof Color
                || value instanceof Font
                || value instanceof Transform
                || value instanceof Interpolator
                || value instanceof Scale
                || value instanceof Transition
                || value instanceof BoxShadow
                || typeof value === "number"
                || typeof value === "boolean") {
                return value;
            }
            else if (value instanceof Date || time.DateTime.isInit(value)) {
                return time.DateTime.fromAny(value);
            }
            else if (Color.isInit(value)) {
                return Color.fromAny(value);
            }
            else if (Font.isInit(value)) {
                return Font.fromAny(value);
            }
            else if (Transition.isInit(value)) {
                return Transition.fromAny(value);
            }
            else if (BoxShadow.isInit(value)) {
                return BoxShadow.fromAny(value);
            }
            else if (typeof value === "string") {
                return StyleValue.parse(value);
            }
            throw new TypeError("" + value);
        },
        parse: function (input) {
            if (typeof input === "string") {
                input = codec.Unicode.stringInput(input);
            }
            while (input.isCont() && codec.Unicode.isWhitespace(input.head())) {
                input = input.step();
            }
            var parser = StyleValue.Parser.parse(input);
            if (parser.isDone()) {
                while (input.isCont() && codec.Unicode.isWhitespace(input.head())) {
                    input = input.step();
                }
            }
            if (input.isCont() && !parser.isError()) {
                parser = codec.Parser.error(codec.Diagnostic.unexpected(input));
            }
            return parser.bind();
        },
        _form: void 0,
        form: function (unit) {
            if (unit !== void 0) {
                unit = StyleValue.fromAny(unit);
                return new StyleValue.Form(unit);
            }
            else {
                if (!StyleValue._form) {
                    StyleValue._form = new StyleValue.Form();
                }
                return StyleValue._form;
            }
        },
        Parser: void 0,
        Form: void 0,
    };

    var ISO_8601_REST = time.DateTimeFormat.pattern('%m-%dT%H:%M:%S.%LZ');
    var StyleValueParser = (function (_super) {
        __extends(StyleValueParser, _super);
        function StyleValueParser(identOutput, valueParser, unitsOutput, step) {
            var _this = _super.call(this) || this;
            _this.identOutput = identOutput;
            _this.valueParser = valueParser;
            _this.unitsOutput = unitsOutput;
            _this.step = step;
            return _this;
        }
        StyleValueParser.prototype.feed = function (input) {
            return StyleValueParser.parse(input, this.identOutput, this.valueParser, this.unitsOutput, this.step);
        };
        StyleValueParser.parse = function (input, identOutput, valueParser, unitsOutput, step) {
            if (step === void 0) { step = 1; }
            var c = 0;
            if (step === 1) {
                while (input.isCont() && (c = input.head(), codec.Unicode.isSpace(c))) {
                    input.step();
                }
                if (input.isCont()) {
                    if (c === 35) {
                        return HexColorParser.parse(input);
                    }
                    else if (codec.Unicode.isAlpha(c)) {
                        step = 2;
                    }
                    else {
                        step = 3;
                    }
                }
                else if (!input.isEmpty()) {
                    return codec.Parser.error(codec.Diagnostic.unexpected(input));
                }
            }
            if (step === 2) {
                identOutput = identOutput || codec.Unicode.stringOutput();
                while (input.isCont() && (c = input.head(), codec.Unicode.isAlpha(c) || c === 45)) {
                    input = input.step();
                    identOutput.write(c);
                }
                if (!input.isEmpty()) {
                    var ident = identOutput.bind();
                    switch (ident) {
                        case "rgb":
                        case "rgba": return RgbColorParser.parseRest(input);
                        case "hsl":
                        case "hsla": return HslColorParser.parseRest(input);
                        case "normal":
                        case "italic":
                        case "oblique": return FontParser.parseRest(input, ident);
                        case "small-caps": return FontParser.parseRest(input, void 0, ident);
                        case "bold":
                        case "bolder":
                        case "lighter": return FontParser.parseRest(input, void 0, void 0, ident);
                        case "ultra-condensed":
                        case "extra-condensed":
                        case "semi-condensed":
                        case "condensed":
                        case "expanded":
                        case "semi-expanded":
                        case "extra-expanded":
                        case "ultra-expanded": return FontParser.parseRest(input, void 0, void 0, void 0, ident);
                        case "large":
                        case "larger":
                        case "medium":
                        case "small":
                        case "smaller":
                        case "x-large":
                        case "x-small":
                        case "xx-large":
                        case "xx-small": return FontParser.parseRest(input, void 0, void 0, void 0, void 0, ident);
                        case "translateX":
                        case "translateY":
                        case "translate": return TranslateTransformParser.parseRest(input, identOutput);
                        case "scaleX":
                        case "scaleY":
                        case "scale": return ScaleTransformParser.parseRest(input, identOutput);
                        case "rotate": return RotateTransformParser.parseRest(input, identOutput);
                        case "skewX":
                        case "skewY":
                        case "skew": return SkewTransformParser.parseRest(input, identOutput);
                        case "matrix": return AffineTransformParser.parseRest(input, identOutput);
                        case "none": return codec.Parser.done(Transform.identity());
                        case "true": return codec.Parser.done(true);
                        case "false": return codec.Parser.done(false);
                        default:
                            var color = Color.fromName(ident);
                            if (color !== void 0) {
                                return codec.Parser.done(color);
                            }
                            return codec.Parser.error(codec.Diagnostic.message("unknown style value: " + ident, input));
                    }
                }
            }
            if (step === 3) {
                if (!valueParser) {
                    valueParser = codec.Base10.parseDecimal(input);
                }
                else {
                    valueParser = valueParser.feed(input);
                }
                if (valueParser.isDone()) {
                    step = 4;
                }
                else if (valueParser.isError()) {
                    return valueParser.asError();
                }
            }
            if (step === 4) {
                if (input.isCont() && (c = input.head(), c === 45)) {
                    input.step();
                    var date = {};
                    date.year = valueParser.bind();
                    return ISO_8601_REST.parseDate(input, date);
                }
                else if (!input.isEmpty()) {
                    step = 5;
                }
            }
            if (step === 5) {
                unitsOutput = unitsOutput || codec.Unicode.stringOutput();
                while (input.isCont() && (c = input.head(), codec.Unicode.isAlpha(c) || c === 37)) {
                    input.step();
                    unitsOutput.push(c);
                }
                if (!input.isEmpty()) {
                    step = 6;
                }
            }
            if (step === 6) {
                if (!input.isEmpty()) {
                    var value = valueParser.bind();
                    var units = unitsOutput.bind();
                    var styleValue = void 0;
                    switch (units) {
                        case "deg":
                            styleValue = Angle.deg(value);
                            break;
                        case "rad":
                            styleValue = Angle.rad(value);
                            break;
                        case "grad":
                            styleValue = Angle.grad(value);
                            break;
                        case "turn":
                            styleValue = Angle.turn(value);
                            break;
                        case "px":
                            styleValue = Length.px(value);
                            break;
                        case "em":
                            styleValue = Length.em(value);
                            break;
                        case "rem":
                            styleValue = Length.rem(value);
                            break;
                        case "%":
                            styleValue = Length.pct(value);
                            break;
                        case "":
                            styleValue = value;
                            break;
                        default: return codec.Parser.error(codec.Diagnostic.message("unknown style units: " + units, input));
                    }
                    if (input.isCont() && (c = input.head(), codec.Unicode.isSpace(c) || c === 47)) {
                        if (styleValue instanceof Length) {
                            return FontParser.parseRest(input, void 0, void 0, void 0, void 0, styleValue);
                        }
                        else if (typeof styleValue === "number") {
                            switch (value) {
                                case 100:
                                case 200:
                                case 300:
                                case 400:
                                case 500:
                                case 600:
                                case 700:
                                case 800:
                                case 900: return FontParser.parseRest(input, void 0, void 0, String(value));
                            }
                        }
                    }
                    return codec.Parser.done(styleValue);
                }
            }
            return new StyleValueParser(identOutput, valueParser, unitsOutput, step);
        };
        return StyleValueParser;
    }(codec.Parser));
    StyleValue.Parser = StyleValueParser;

    var StyleValueForm = (function (_super) {
        __extends(StyleValueForm, _super);
        function StyleValueForm(unit) {
            var _this = _super.call(this) || this;
            _this._unit = unit;
            return _this;
        }
        StyleValueForm.prototype.unit = function (unit) {
            if (arguments.length === 0) {
                return this._unit;
            }
            else {
                unit = unit !== void 0 ? StyleValue.fromAny(unit) : void 0;
                return new StyleValueForm(unit);
            }
        };
        StyleValueForm.prototype.mold = function (value) {
            if (value !== void 0) {
                value = StyleValue.fromAny(value);
                if (value instanceof time.DateTime) {
                    return time.DateTime.form().mold(value);
                }
                else if (value instanceof Angle) {
                    return Angle.form().mold(value);
                }
                else if (value instanceof Length) {
                    return Length.form().mold(value);
                }
                else if (value instanceof Color) {
                    return Color.form().mold(value);
                }
                else if (value instanceof Font) {
                    return Font.form().mold(value);
                }
                else if (value instanceof Transform) {
                    return Transform.form().mold(value);
                }
                else if (value instanceof Interpolator) {
                    return Interpolator.form().mold(value);
                }
                else if (value instanceof Scale) {
                    return Scale.form().mold(value);
                }
                else if (value instanceof Transition) {
                    return Transition.form().mold(value);
                }
                else if (value instanceof BoxShadow) {
                    return BoxShadow.form().mold(value);
                }
                else if (typeof value === "number") {
                    return structure.Num.from(value);
                }
                throw new TypeError("" + value);
            }
            else {
                return structure.Item.extant();
            }
        };
        StyleValueForm.prototype.cast = function (item) {
            var value = item.toValue();
            if (value instanceof structure.Num) {
                return value.numberValue();
            }
            if (value instanceof structure.Bool) {
                return value.booleanValue();
            }
            var string = value.stringValue(void 0);
            if (string !== void 0) {
                try {
                    return StyleValue.parse(string);
                }
                catch (e) {
                }
            }
            if (value instanceof structure.Record) {
                var date = time.DateTime.fromValue(value);
                if (date) {
                    return date;
                }
                var angle = Angle.fromValue(value);
                if (angle) {
                    return angle;
                }
                var length_1 = Length.fromValue(value);
                if (length_1) {
                    return length_1;
                }
                var color = Color.fromValue(value);
                if (color) {
                    return color;
                }
                var font = Font.fromValue(value);
                if (font) {
                    return font;
                }
                var transform = Transform.fromValue(value);
                if (transform) {
                    return transform;
                }
                var interpolator = Interpolator.form().cast(value);
                if (interpolator) {
                    return interpolator;
                }
                var scale = Scale.form().cast(value);
                if (scale) {
                    return scale;
                }
                var transition = Transition.form().cast(value);
                if (transition) {
                    return transition;
                }
                var boxShadow = BoxShadow.fromValue(value);
                if (boxShadow) {
                    return boxShadow;
                }
            }
            return void 0;
        };
        return StyleValueForm;
    }(structure.Form));
    StyleValue.Form = StyleValueForm;
    Interpolator.valueForm = StyleValue.form;
    Scale.domainForm = StyleValue.form;
    Scale.interpolatorForm = Interpolator.form;
    Transition.interpolatorForm = Interpolator.form;

    function AttributeString(value) {
        if (value && typeof value === "object" && typeof value.toAttributeString === "function") {
            return value.toAttributeString();
        }
        else {
            return "" + value;
        }
    }

    function StyleString(value) {
        if (value && typeof value === "object" && typeof value.toStyleString === "function") {
            return value.toStyleString();
        }
        else {
            return "" + value;
        }
    }

    var PI = Math.PI;
    var TAU = 2 * PI;
    var EPSILON = 1e-6;
    var PathContext = (function () {
        function PathContext() {
            this.x0 = null;
            this.y0 = null;
            this.x1 = null;
            this.y1 = null;
            this.d = "";
        }
        PathContext.prototype.moveTo = function (x, y) {
            this.d += "M" + (this.x0 = this.x1 = x) + "," + (this.y0 = this.y1 = y);
        };
        PathContext.prototype.closePath = function () {
            if (this.x1 !== undefined) {
                this.x1 = this.x0;
                this.y1 = this.y0;
                this.d += "Z";
            }
        };
        PathContext.prototype.lineTo = function (x, y) {
            this.d += "L" + (this.x1 = x) + "," + (this.y1 = y);
        };
        PathContext.prototype.quadraticCurveTo = function (x1, y1, x, y) {
            this.d += "Q" + x1 + "," + y1 + "," + (this.x1 = x) + "," + (this.y1 = y);
        };
        PathContext.prototype.bezierCurveTo = function (x1, y1, x2, y2, x, y) {
            this.d += "C" + x1 + "," + y1 + "," + x2 + "," + y2 + "," + (this.x1 = x) + "," + (this.y1 = y);
        };
        PathContext.prototype.arcTo = function (x1, y1, x2, y2, r) {
            var x0 = +this.x1;
            var y0 = +this.y1;
            var x21 = x2 - x1;
            var y21 = y2 - y1;
            var x01 = x0 - x1;
            var y01 = y0 - y1;
            var l01_2 = x01 * x01 + y01 * y01;
            if (r < 0) {
                throw new Error("negative radius: " + r);
            }
            else if (this.x1 === null) {
                this.d += "M" + (this.x1 = x1) + "," + (this.y1 = y1);
            }
            else if (!(l01_2 > EPSILON)) ;
            else if (!(Math.abs(y01 * x21 - y21 * x01) > EPSILON) || !r) {
                this.d += "L" + (this.x1 = x1) + "," + (this.y1 = y1);
            }
            else {
                var x20 = x2 - x0;
                var y20 = y2 - y0;
                var l21_2 = x21 * x21 + y21 * y21;
                var l20_2 = x20 * x20 + y20 * y20;
                var l21 = Math.sqrt(l21_2);
                var l01 = Math.sqrt(l01_2);
                var l = r * Math.tan((PI - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2);
                var t01 = l / l01;
                var t21 = l / l21;
                if (Math.abs(t01 - 1) > EPSILON) {
                    this.d += "L" + (x1 + t01 * x01) + "," + (y1 + t01 * y01);
                }
                this.d += "A" + r + "," + r + ",0,0," + (+(y01 * x20 > x01 * y20)) + "," +
                    (this.x1 = x1 + t21 * x21) + "," + (this.y1 = y1 + t21 * y21);
            }
        };
        PathContext.prototype.arc = function (x, y, r, a0, a1, ccw) {
            if (ccw === void 0) { ccw = false; }
            var dx = r * Math.cos(a0);
            var dy = r * Math.sin(a0);
            var x0 = x + dx;
            var y0 = y + dy;
            var cw = 1 ^ +ccw;
            var da = ccw ? a0 - a1 : a1 - a0;
            if (r < 0) {
                throw new Error("negative radius: " + r);
            }
            else if (this.x1 === null) {
                this.d += "M" + x0 + "," + y0;
            }
            else if (Math.abs(+this.x1 - x0) > EPSILON || Math.abs(+this.y1 - y0) > EPSILON) {
                this.d += "L" + x0 + "," + y0;
            }
            if (!r) {
                return;
            }
            else if (da < 0) {
                da = da % TAU + TAU;
            }
            if (da > TAU - EPSILON) {
                this.d += "A" + r + "," + r + ",0,1," + cw + "," + (x - dx) + "," + (y - dy) +
                    "A" + r + "," + r + ",0,1," + cw + "," + (this.x1 = x0) + "," + (this.y1 = y0);
            }
            else if (da > EPSILON) {
                this.d += "A" + r + "," + r + ",0," + (+(da >= PI)) + "," + cw + "," +
                    (this.x1 = x + r * Math.cos(a1)) + "," + (this.y1 = y + r * Math.sin(a1));
            }
        };
        PathContext.prototype.rect = function (x, y, w, h) {
            this.d += "M" + (this.x0 = this.x1 = x) + "," + (this.y0 = this.y1 = y) + "h" + w + "v" + h + "h" + -w + "Z";
        };
        PathContext.prototype.toString = function () {
            return this.d;
        };
        return PathContext;
    }());

    var ConstraintMap = (function () {
        function ConstraintMap(index, array) {
            if (index === void 0) { index = {}; }
            if (array === void 0) { array = []; }
            this._index = index;
            this._array = array;
        }
        Object.defineProperty(ConstraintMap.prototype, "size", {
            get: function () {
                return this._array.length;
            },
            enumerable: true,
            configurable: true
        });
        ConstraintMap.prototype.isEmpty = function () {
            return this._array.length === 0;
        };
        ConstraintMap.prototype.has = function (key) {
            return this._index[key.id] !== void 0;
        };
        ConstraintMap.prototype.get = function (key) {
            var index = this._index[key.id];
            return index !== void 0 ? this._array[index][1] : void 0;
        };
        ConstraintMap.prototype.getField = function (key) {
            var index = this._index[key.id];
            return index !== void 0 ? this._array[index] : void 0;
        };
        ConstraintMap.prototype.getEntry = function (index) {
            return this._array[index];
        };
        ConstraintMap.prototype.set = function (key, newValue) {
            var index = this._index[key.id];
            if (index !== void 0) {
                this._array[index][1] = newValue;
            }
            else {
                this._index[key.id] = this._array.length;
                this._array.push([key, newValue]);
            }
            return this;
        };
        ConstraintMap.prototype.delete = function (key) {
            var index = this._index[key.id];
            if (index !== void 0) {
                delete this._index[key.id];
                var item = this._array[index];
                var last = this._array.pop();
                if (item !== last) {
                    this._array[index] = last;
                    this._index[last[0].id] = index;
                }
                return true;
            }
            else {
                return false;
            }
        };
        ConstraintMap.prototype.remove = function (key) {
            var index = this._index[key.id];
            if (index !== void 0) {
                delete this._index[key.id];
                var item = this._array[index];
                var last = this._array.pop();
                if (item !== last) {
                    this._array[index] = last;
                    this._index[last[0].id] = index;
                }
                return item[1];
            }
            else {
                return void 0;
            }
        };
        ConstraintMap.prototype.clear = function () {
            this._index = {};
            this._array.length = 0;
        };
        ConstraintMap.prototype.forEach = function (callback, thisArg) {
            var array = this._array;
            for (var i = 0, n = array.length; i < n; i += 1) {
                var item = array[i];
                var result = callback.call(thisArg, item[0], item[1]);
                if (result !== void 0) {
                    return result;
                }
            }
            return void 0;
        };
        ConstraintMap.prototype.keys = function () {
            return void 0;
        };
        ConstraintMap.prototype.values = function () {
            return void 0;
        };
        ConstraintMap.prototype.entries = function () {
            return void 0;
        };
        ConstraintMap.prototype.clone = function () {
            var oldArray = this._array;
            var n = oldArray.length;
            var newIndex = {};
            var newArray = new Array(n);
            for (var i = 0; i < n; i += 1) {
                var _a = oldArray[i], key = _a[0], value = _a[1];
                newArray[i] = [key, value];
                newIndex[key.id] = i;
            }
            return new ConstraintMap(newIndex, newArray);
        };
        ConstraintMap.nextId = function () {
            var nextId = ConstraintMap._nextId;
            ConstraintMap._nextId = nextId + 1;
            return nextId;
        };
        ConstraintMap._nextId = 1;
        return ConstraintMap;
    }());

    var ConstraintSymbol = {
        Invalid: void 0,
    };
    var ConstraintSlack = (function () {
        function ConstraintSlack() {
            this._id = ConstraintMap.nextId();
        }
        Object.defineProperty(ConstraintSlack.prototype, "id", {
            get: function () {
                return this._id;
            },
            enumerable: true,
            configurable: true
        });
        ConstraintSlack.prototype.isExternal = function () {
            return false;
        };
        ConstraintSlack.prototype.isDummy = function () {
            return false;
        };
        ConstraintSlack.prototype.isInvalid = function () {
            return false;
        };
        return ConstraintSlack;
    }());
    var ConstraintDummy = (function () {
        function ConstraintDummy() {
            this._id = ConstraintMap.nextId();
        }
        Object.defineProperty(ConstraintDummy.prototype, "id", {
            get: function () {
                return this._id;
            },
            enumerable: true,
            configurable: true
        });
        ConstraintDummy.prototype.isExternal = function () {
            return false;
        };
        ConstraintDummy.prototype.isDummy = function () {
            return true;
        };
        ConstraintDummy.prototype.isInvalid = function () {
            return false;
        };
        return ConstraintDummy;
    }());
    var ConstraintError = (function () {
        function ConstraintError() {
            this._id = ConstraintMap.nextId();
        }
        Object.defineProperty(ConstraintError.prototype, "id", {
            get: function () {
                return this._id;
            },
            enumerable: true,
            configurable: true
        });
        ConstraintError.prototype.isExternal = function () {
            return false;
        };
        ConstraintError.prototype.isDummy = function () {
            return false;
        };
        ConstraintError.prototype.isInvalid = function () {
            return false;
        };
        return ConstraintError;
    }());
    var ConstraintInvalid = (function () {
        function ConstraintInvalid() {
        }
        Object.defineProperty(ConstraintInvalid.prototype, "id", {
            get: function () {
                return -1;
            },
            enumerable: true,
            configurable: true
        });
        ConstraintInvalid.prototype.isExternal = function () {
            return false;
        };
        ConstraintInvalid.prototype.isDummy = function () {
            return false;
        };
        ConstraintInvalid.prototype.isInvalid = function () {
            return true;
        };
        return ConstraintInvalid;
    }());
    ConstraintSymbol.Invalid = new ConstraintInvalid();

    var Constrain = (function () {
        function Constrain() {
            this._id = ConstraintMap.nextId();
        }
        Object.defineProperty(Constrain.prototype, "id", {
            get: function () {
                return this._id;
            },
            enumerable: true,
            configurable: true
        });
        Constrain.sum = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var terms = new ConstraintMap();
            var constant = 0;
            for (var i = 0, n = args.length; i < n; i += 1) {
                var arg = args[i];
                if (typeof arg === "number") {
                    constant += arg;
                }
                else if (arg instanceof Constrain.Term) {
                    var variable = arg.variable;
                    if (variable !== null) {
                        var field = terms.getField(variable);
                        if (field !== void 0) {
                            field[1] += arg.coefficient;
                        }
                        else {
                            terms.set(variable, arg.coefficient);
                        }
                    }
                    else {
                        constant += arg.constant;
                    }
                }
                else {
                    var subterms = arg.terms;
                    for (var j = 0, k = subterms.size; j < k; j += 1) {
                        var _a = subterms.getEntry(j), variable = _a[0], coefficient = _a[1];
                        var field = terms.getField(variable);
                        if (field !== void 0) {
                            field[1] += coefficient;
                        }
                        else {
                            terms.set(variable, coefficient);
                        }
                    }
                    constant += arg.constant;
                }
            }
            return new Constrain.Sum(terms, constant);
        };
        Constrain.product = function (coefficient, variable) {
            return new Constrain.Product(coefficient, variable);
        };
        Constrain.constant = function (value) {
            return new Constrain.Constant(value);
        };
        Constrain.zero = function () {
            return new Constrain.Constant(0);
        };
        return Constrain;
    }());

    var ConstrainSum = (function (_super) {
        __extends(ConstrainSum, _super);
        function ConstrainSum(terms, constant) {
            var _this = _super.call(this) || this;
            _this._terms = terms;
            _this._constant = constant;
            return _this;
        }
        ConstrainSum.prototype.isConstant = function () {
            return this._terms.isEmpty();
        };
        Object.defineProperty(ConstrainSum.prototype, "terms", {
            get: function () {
                return this._terms;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConstrainSum.prototype, "constant", {
            get: function () {
                return this._constant;
            },
            enumerable: true,
            configurable: true
        });
        ConstrainSum.prototype.plus = function (that) {
            return Constrain.sum(this, that);
        };
        ConstrainSum.prototype.opposite = function () {
            var oldTerms = this._terms;
            var newTerms = new ConstraintMap();
            for (var i = 0, n = oldTerms.size; i < n; i += 1) {
                var _a = oldTerms.getEntry(i), variable = _a[0], coefficient = _a[1];
                newTerms.set(variable, -coefficient);
            }
            return new ConstrainSum(newTerms, -this._constant);
        };
        ConstrainSum.prototype.minus = function (that) {
            if (typeof that === "number") {
                that = Constrain.constant(that);
            }
            else {
                that = that.opposite();
            }
            return Constrain.sum(this, that);
        };
        ConstrainSum.prototype.times = function (scalar) {
            var oldTerms = this._terms;
            var newTerms = new ConstraintMap();
            for (var i = 0, n = oldTerms.size; i < n; i += 1) {
                var _a = oldTerms.getEntry(i), variable = _a[0], coefficient = _a[1];
                newTerms.set(variable, coefficient * scalar);
            }
            return new ConstrainSum(newTerms, this._constant * scalar);
        };
        ConstrainSum.prototype.divide = function (scalar) {
            var oldTerms = this._terms;
            var newTerms = new ConstraintMap();
            for (var i = 0, n = oldTerms.size; i < n; i += 1) {
                var _a = oldTerms.getEntry(i), variable = _a[0], coefficient = _a[1];
                newTerms.set(variable, coefficient / scalar);
            }
            return new ConstrainSum(newTerms, this._constant / scalar);
        };
        ConstrainSum.prototype.debug = function (output) {
            output = output.write("Constrain").write(46).write("sum").write(40);
            var n = this._terms.size;
            for (var i = 0; i < n; i += 1) {
                var _a = this._terms.getEntry(i), variable = _a[0], coefficient = _a[1];
                if (i > 0) {
                    output = output.write(", ");
                }
                if (coefficient === 1) {
                    output = output.debug(variable);
                }
                else {
                    output = output.debug(Constrain.product(coefficient, variable));
                }
            }
            if (this._constant !== 0) {
                if (n > 0) {
                    output = output.write(", ");
                }
                output = output.debug(this._constant);
            }
            output = output.write(41);
        };
        ConstrainSum.prototype.toString = function () {
            return codec.Format.debug(this);
        };
        return ConstrainSum;
    }(Constrain));
    Constrain.Sum = ConstrainSum;

    var ConstrainTerm = (function (_super) {
        __extends(ConstrainTerm, _super);
        function ConstrainTerm() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ConstrainTerm;
    }(Constrain));
    Constrain.Term = ConstrainTerm;

    var ConstrainProduct = (function (_super) {
        __extends(ConstrainProduct, _super);
        function ConstrainProduct(coefficient, variable) {
            var _this = _super.call(this) || this;
            _this._coefficient = coefficient;
            _this._variable = variable;
            return _this;
        }
        ConstrainProduct.prototype.isConstant = function () {
            return false;
        };
        Object.defineProperty(ConstrainProduct.prototype, "coefficient", {
            get: function () {
                return this._coefficient;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConstrainProduct.prototype, "variable", {
            get: function () {
                return this._variable;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConstrainProduct.prototype, "terms", {
            get: function () {
                var terms = new ConstraintMap();
                terms.set(this._variable, this._coefficient);
                return terms;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConstrainProduct.prototype, "constant", {
            get: function () {
                return 0;
            },
            enumerable: true,
            configurable: true
        });
        ConstrainProduct.prototype.plus = function (that) {
            if (typeof that === "number") {
                that = Constrain.constant(that);
            }
            if (that instanceof ConstrainProduct && this._variable === that._variable) {
                return Constrain.product(this._coefficient + that._coefficient, this._variable);
            }
            else if (that instanceof Constrain.Variable && this._variable === that) {
                return Constrain.product(this._coefficient + 1, this._variable);
            }
            else {
                return Constrain.sum(this, that);
            }
        };
        ConstrainProduct.prototype.opposite = function () {
            return Constrain.product(-this._coefficient, this._variable);
        };
        ConstrainProduct.prototype.minus = function (that) {
            if (typeof that === "number") {
                that = Constrain.constant(that);
            }
            if (that instanceof ConstrainProduct && this._variable === that._variable) {
                return Constrain.product(this._coefficient - that._coefficient, this._variable);
            }
            else if (that instanceof Constrain.Variable && this._variable === that) {
                return Constrain.product(this._coefficient - 1, this._variable);
            }
            else {
                return Constrain.sum(this, that.opposite());
            }
        };
        ConstrainProduct.prototype.times = function (scalar) {
            return Constrain.product(this._coefficient * scalar, this._variable);
        };
        ConstrainProduct.prototype.divide = function (scalar) {
            return Constrain.product(this._coefficient / scalar, this._variable);
        };
        ConstrainProduct.prototype.debug = function (output) {
            output = output.write("Constrain").write(46).write("product").write(40)
                .debug(this._coefficient).write(", ").debug(this._variable).write(41);
        };
        ConstrainProduct.prototype.toString = function () {
            return codec.Format.debug(this);
        };
        return ConstrainProduct;
    }(ConstrainTerm));
    Constrain.Product = ConstrainProduct;

    var ConstrainConstant = (function (_super) {
        __extends(ConstrainConstant, _super);
        function ConstrainConstant(value) {
            var _this = _super.call(this) || this;
            _this._value = value;
            return _this;
        }
        ConstrainConstant.prototype.isConstant = function () {
            return true;
        };
        Object.defineProperty(ConstrainConstant.prototype, "value", {
            get: function () {
                return this._value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConstrainConstant.prototype, "coefficient", {
            get: function () {
                return 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConstrainConstant.prototype, "variable", {
            get: function () {
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConstrainConstant.prototype, "terms", {
            get: function () {
                return new ConstraintMap();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConstrainConstant.prototype, "constant", {
            get: function () {
                return this._value;
            },
            enumerable: true,
            configurable: true
        });
        ConstrainConstant.prototype.plus = function (that) {
            if (typeof that === "number") {
                that = Constrain.constant(that);
            }
            if (that instanceof ConstrainConstant) {
                return Constrain.constant(this._value + that._value);
            }
            else {
                return Constrain.sum(this, that);
            }
        };
        ConstrainConstant.prototype.opposite = function () {
            return Constrain.constant(-this._value);
        };
        ConstrainConstant.prototype.minus = function (that) {
            if (typeof that === "number") {
                that = Constrain.constant(that);
            }
            if (that instanceof ConstrainConstant) {
                return Constrain.constant(this._value - that._value);
            }
            else {
                return Constrain.sum(this, that.opposite());
            }
        };
        ConstrainConstant.prototype.times = function (scalar) {
            return Constrain.constant(this._value * scalar);
        };
        ConstrainConstant.prototype.divide = function (scalar) {
            return Constrain.constant(this._value / scalar);
        };
        ConstrainConstant.prototype.debug = function (output) {
            output = output.write("Constrain").write(46).write("constant").write(40)
                .debug(this._value).write(41);
        };
        ConstrainConstant.prototype.toString = function () {
            return codec.Format.debug(this);
        };
        return ConstrainConstant;
    }(ConstrainTerm));
    Constrain.Constant = ConstrainConstant;

    var ConstrainVariable = (function (_super) {
        __extends(ConstrainVariable, _super);
        function ConstrainVariable() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ConstrainVariable.prototype.isExternal = function () {
            return true;
        };
        ConstrainVariable.prototype.isDummy = function () {
            return false;
        };
        ConstrainVariable.prototype.isInvalid = function () {
            return false;
        };
        ConstrainVariable.prototype.isConstant = function () {
            return false;
        };
        Object.defineProperty(ConstrainVariable.prototype, "coefficient", {
            get: function () {
                return 1;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConstrainVariable.prototype, "variable", {
            get: function () {
                return this;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConstrainVariable.prototype, "terms", {
            get: function () {
                var terms = new ConstraintMap();
                terms.set(this, 1);
                return terms;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConstrainVariable.prototype, "constant", {
            get: function () {
                return 0;
            },
            enumerable: true,
            configurable: true
        });
        ConstrainVariable.prototype.plus = function (that) {
            if (typeof that === "number") {
                that = Constrain.constant(that);
            }
            if (this === that) {
                return Constrain.product(2, this);
            }
            else {
                return Constrain.sum(this, that);
            }
        };
        ConstrainVariable.prototype.opposite = function () {
            return Constrain.product(-1, this);
        };
        ConstrainVariable.prototype.minus = function (that) {
            if (typeof that === "number") {
                that = Constrain.constant(that);
            }
            if (this === that) {
                return Constrain.zero();
            }
            else {
                return Constrain.sum(this, that.opposite());
            }
        };
        ConstrainVariable.prototype.times = function (coefficient) {
            return Constrain.product(coefficient, this);
        };
        ConstrainVariable.prototype.divide = function (scalar) {
            return Constrain.product(1 / scalar, this);
        };
        ConstrainVariable.prototype.debug = function (output) {
            output = output.debug(this.scope).write(46).write("variable").write(40)
                .debug(this.name).write(", ").debug(this.value).write(41);
        };
        ConstrainVariable.prototype.toString = function () {
            return codec.Format.debug(this);
        };
        return ConstrainVariable;
    }(ConstrainTerm));
    Constrain.Variable = ConstrainVariable;

    var ConstraintStrength = {
        Required: 1001001000,
        Strong: 1000000,
        Medium: 1000,
        Weak: 1,
        Unbound: -1,
        clip: function (strength) {
            return Math.min(Math.max(0, strength), ConstraintStrength.Required);
        },
        fromAny: function (strength) {
            if (typeof strength === "number") {
                return ConstraintStrength.clip(strength);
            }
            else if (strength === "required") {
                return ConstraintStrength.Required;
            }
            else if (strength === "strong") {
                return ConstraintStrength.Strong;
            }
            else if (strength === "medium") {
                return ConstraintStrength.Medium;
            }
            else if (strength === "weak") {
                return ConstraintStrength.Weak;
            }
            throw new TypeError("" + strength);
        },
    };

    var ConstrainBinding = (function (_super) {
        __extends(ConstrainBinding, _super);
        function ConstrainBinding(scope, name, value, strength) {
            var _this = _super.call(this) || this;
            _this._scope = scope;
            Object.defineProperty(_this, "name", {
                value: name,
                enumerable: true,
                configurable: true,
            });
            _this._value = value;
            _this._state = NaN;
            _this._strength = strength;
            return _this;
        }
        Object.defineProperty(ConstrainBinding.prototype, "scope", {
            get: function () {
                return this._scope;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConstrainBinding.prototype, "value", {
            get: function () {
                return this._value;
            },
            enumerable: true,
            configurable: true
        });
        ConstrainBinding.prototype.setValue = function (value) {
            this._value = value;
        };
        Object.defineProperty(ConstrainBinding.prototype, "state", {
            get: function () {
                return this._state;
            },
            enumerable: true,
            configurable: true
        });
        ConstrainBinding.prototype.setState = function (newState) {
            var oldState = this._state;
            if (isFinite(oldState) && !isFinite(newState)) {
                this._scope.removeVariable(this);
            }
            this._state = newState;
            if (isFinite(newState)) {
                if (!isFinite(oldState)) {
                    this._scope.addVariable(this);
                }
                else {
                    this._scope.setVariableState(this, newState);
                }
            }
        };
        Object.defineProperty(ConstrainBinding.prototype, "strength", {
            get: function () {
                return this._strength;
            },
            enumerable: true,
            configurable: true
        });
        ConstrainBinding.prototype.setStrength = function (newStrength) {
            var state = this._state;
            var oldStrength = this._strength;
            newStrength = ConstraintStrength.fromAny(newStrength);
            if (isFinite(state) && oldStrength !== newStrength) {
                this._scope.removeVariable(this);
            }
            this._strength = newStrength;
            if (isFinite(state) && oldStrength !== newStrength) {
                this._scope.addVariable(this);
            }
        };
        return ConstrainBinding;
    }(ConstrainVariable));
    Constrain.Binding = ConstrainBinding;

    var Constraint = (function () {
        function Constraint(scope, constrain, relation, strength) {
            this._id = ConstraintMap.nextId();
            this._scope = scope;
            this._constrain = constrain;
            this._relation = relation;
            this._strength = strength;
        }
        Object.defineProperty(Constraint.prototype, "id", {
            get: function () {
                return this._id;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Constraint.prototype, "scope", {
            get: function () {
                return this._scope;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Constraint.prototype, "constrain", {
            get: function () {
                return this._constrain;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Constraint.prototype, "relation", {
            get: function () {
                return this._relation;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Constraint.prototype, "strength", {
            get: function () {
                return this._strength;
            },
            enumerable: true,
            configurable: true
        });
        Constraint.prototype.enabled = function (enabled) {
            if (enabled === void 0) {
                return this._scope.hasConstraint(this);
            }
            else {
                if (enabled) {
                    this._scope.addConstraint(this);
                }
                else {
                    this._scope.removeConstraint(this);
                }
                return this;
            }
        };
        Constraint.prototype.debug = function (output) {
            output = output.debug(this._scope).write(46).write("constraint").write(40)
                .debug(this._constrain).write(", ").debug(this._relation).write(", ").debug(void 0).write(", ");
            if (this._strength === ConstraintStrength.Required) {
                output = output.debug("required");
            }
            else if (this._strength === ConstraintStrength.Strong) {
                output = output.debug("strong");
            }
            else if (this._strength === ConstraintStrength.Medium) {
                output = output.debug("medium");
            }
            else if (this._strength === ConstraintStrength.Weak) {
                output = output.debug("weak");
            }
            else {
                output = output.debug(this._strength);
            }
            output = output.write(41);
        };
        Constraint.prototype.toString = function () {
            return codec.Format.debug(this);
        };
        return Constraint;
    }());

    var EPSILON$1 = 1.0e-8;
    var ConstraintRow = (function () {
        function ConstraintRow(cells, constant) {
            if (cells === void 0) { cells = new ConstraintMap(); }
            if (constant === void 0) { constant = 0; }
            this._cells = cells;
            this._constant = constant;
        }
        ConstraintRow.prototype.isConstant = function () {
            return this._cells.isEmpty();
        };
        ConstraintRow.prototype.isDummy = function () {
            for (var i = 0, n = this._cells.size; i < n; i += 1) {
                var symbol = this._cells.getEntry(i)[0];
                if (!(symbol instanceof ConstraintDummy)) {
                    return false;
                }
            }
            return true;
        };
        ConstraintRow.prototype.clone = function () {
            return new ConstraintRow(this._cells.clone(), this._constant);
        };
        ConstraintRow.prototype.add = function (value) {
            this._constant += value;
            return this._constant;
        };
        ConstraintRow.prototype.insertSymbol = function (symbol, coefficient) {
            if (coefficient === void 0) { coefficient = 1; }
            coefficient += this._cells.get(symbol) || 0;
            if (Math.abs(coefficient) < EPSILON$1) {
                this._cells.remove(symbol);
            }
            else {
                this._cells.set(symbol, coefficient);
            }
        };
        ConstraintRow.prototype.insertRow = function (that, coefficient) {
            this._constant += that._constant * coefficient;
            for (var i = 0, n = that._cells.size; i < n; i += 1) {
                var _a = that._cells.getEntry(i), symbol = _a[0], value = _a[1];
                this.insertSymbol(symbol, value * coefficient);
            }
        };
        ConstraintRow.prototype.removeSymbol = function (symbol) {
            this._cells.remove(symbol);
        };
        ConstraintRow.prototype.negate = function () {
            this._constant = -this._constant;
            for (var i = 0, n = this._cells.size; i < n; i += 1) {
                var entry = this._cells.getEntry(i);
                entry[1] = -entry[1];
            }
        };
        ConstraintRow.prototype.solveFor = function (symbol) {
            var value = this._cells.remove(symbol);
            if (value !== void 0) {
                var coefficient = -1 / value;
                this._constant *= coefficient;
                for (var i = 0, n = this._cells.size; i < n; i += 1) {
                    var entry = this._cells.getEntry(i);
                    entry[1] *= coefficient;
                }
            }
        };
        ConstraintRow.prototype.solveForEx = function (lhs, rhs) {
            this.insertSymbol(lhs, -1.0);
            this.solveFor(rhs);
        };
        ConstraintRow.prototype.coefficientFor = function (symbol) {
            var value = this._cells.get(symbol);
            return value !== void 0 ? value : 0;
        };
        ConstraintRow.prototype.substitute = function (symbol, row) {
            var value = this._cells.remove(symbol);
            if (value !== void 0) {
                this.insertRow(row, value);
            }
        };
        return ConstraintRow;
    }());
    var ConstraintSolver = (function () {
        function ConstraintSolver() {
            this._constraints = new ConstraintMap();
            this._variables = new ConstraintMap();
            this._rows = new ConstraintMap();
            this._infeasible = [];
            this._objective = new ConstraintRow();
            this._artificial = null;
        }
        ConstraintSolver.prototype.variable = function (name, value, strength) {
            if (value === void 0) {
                value = 0;
            }
            if (strength === void 0) {
                strength = ConstraintStrength.Strong;
            }
            else {
                strength = ConstraintStrength.fromAny(strength);
            }
            return new ConstrainBinding(this, name, value, strength);
        };
        ConstraintSolver.prototype.constraint = function (lhs, relation, rhs, strength) {
            if (typeof lhs === "number") {
                lhs = Constrain.constant(lhs);
            }
            if (typeof rhs === "number") {
                rhs = Constrain.constant(rhs);
            }
            var constrain = rhs ? lhs.minus(rhs) : lhs;
            if (strength === void 0) {
                strength = ConstraintStrength.Required;
            }
            else {
                strength = ConstraintStrength.fromAny(strength);
            }
            return new Constraint(this, constrain, relation, strength);
        };
        ConstraintSolver.prototype.hasConstraint = function (constraint) {
            return this._constraints.has(constraint);
        };
        ConstraintSolver.prototype.addConstraint = function (constraint) {
            if (this._constraints.has(constraint)) {
                return;
            }
            this.willAddConstraint(constraint);
            var _a = this.createRow(constraint), row = _a.row, tag = _a.tag;
            var subject = this.chooseSubject(row, tag);
            if (subject.isInvalid() && row.isDummy()) {
                if (Math.abs(row._constant) < EPSILON$1) {
                    subject = tag.marker;
                }
                else {
                    throw new Error("unsatisfiable constraint");
                }
            }
            if (subject.isInvalid()) {
                if (!this.addWithArtificialVariable(row)) {
                    throw new Error("unsatisfiable constraint");
                }
            }
            else {
                row.solveFor(subject);
                this.substitute(subject, row);
                this._rows.set(subject, row);
            }
            this._constraints.set(constraint, tag);
            this.optimize(this._objective);
            this.didAddConstraint(constraint);
        };
        ConstraintSolver.prototype.willAddConstraint = function (constraint) {
        };
        ConstraintSolver.prototype.didAddConstraint = function (constraint) {
        };
        ConstraintSolver.prototype.removeConstraint = function (constraint) {
            var tag = this._constraints.remove(constraint);
            if (tag === void 0) {
                return;
            }
            this.willRemoveConstraint(constraint);
            this.removeConstraintEffects(constraint, tag);
            var marker = tag.marker;
            if (this._rows.remove(marker) === void 0) {
                var leaving = this.getMarkerLeavingSymbol(marker);
                if (leaving.isInvalid()) {
                    throw new Error("failed to find leaving row");
                }
                var row = this._rows.remove(leaving);
                row.solveForEx(leaving, marker);
                this.substitute(marker, row);
            }
            this.optimize(this._objective);
            this.didRemoveConstraint(constraint);
        };
        ConstraintSolver.prototype.willRemoveConstraint = function (constraint) {
        };
        ConstraintSolver.prototype.didRemoveConstraint = function (constraint) {
        };
        ConstraintSolver.prototype.hasVariable = function (variable) {
            return this._variables.has(variable);
        };
        ConstraintSolver.prototype.addVariable = function (variable) {
            if (this._variables.has(variable)) {
                return;
            }
            var strength = ConstraintStrength.clip(variable.strength);
            if (strength === ConstraintStrength.Required) {
                throw new Error("invalid variable strength");
            }
            this.willAddVariable(variable);
            var constraint = new Constraint(this, variable, "eq", strength);
            this.addConstraint(constraint);
            var tag = this._constraints.get(constraint);
            var binding = { constraint: constraint, tag: tag, state: 0 };
            this._variables.set(variable, binding);
            this.didAddVariable(variable);
            var state = variable.state;
            if (isFinite(state)) {
                this.setVariableState(variable, state);
            }
        };
        ConstraintSolver.prototype.willAddVariable = function (variable) {
        };
        ConstraintSolver.prototype.didAddVariable = function (variable) {
        };
        ConstraintSolver.prototype.removeVariable = function (variable) {
            var binding = this._variables.remove(variable);
            if (binding === void 0) {
                return;
            }
            this.willRemoveVariable(variable);
            this.removeConstraint(binding.constraint);
            this.didRemoveVariable(variable);
        };
        ConstraintSolver.prototype.willRemoveVariable = function (variable) {
        };
        ConstraintSolver.prototype.didRemoveVariable = function (variable) {
        };
        ConstraintSolver.prototype.setVariableState = function (variable, state) {
            var binding = this._variables.get(variable);
            if (binding === void 0) {
                throw new Error("unknown variable");
            }
            this.willSetVariableState(variable, state);
            var delta = state - binding.state;
            binding.state = state;
            var marker = binding.tag.marker;
            var row = this._rows.get(marker);
            if (row !== void 0) {
                if (row.add(-delta) < 0) {
                    this._infeasible.push(marker);
                }
                this.dualOptimize();
                return;
            }
            var other = binding.tag.other;
            row = this._rows.get(other);
            if (row !== void 0) {
                if (row.add(delta) < 0) {
                    this._infeasible.push(other);
                }
                this.dualOptimize();
                return;
            }
            for (var i = 0, n = this._rows.size; i < n; i += 1) {
                var _a = this._rows.getEntry(i), symbol = _a[0], row_1 = _a[1];
                var coefficient = row_1.coefficientFor(marker);
                if (coefficient !== 0 && row_1.add(delta * coefficient) < 0 && !symbol.isExternal()) {
                    this._infeasible.push(symbol);
                }
            }
            this.dualOptimize();
            this.didSetVariableState(variable, state);
        };
        ConstraintSolver.prototype.willSetVariableState = function (variable, state) {
        };
        ConstraintSolver.prototype.didSetVariableState = function (variable, state) {
        };
        ConstraintSolver.prototype.updateVariables = function () {
            for (var i = 0, n = this._rows.size; i < n; i += 1) {
                var _a = this._rows.getEntry(i), symbol = _a[0], row = _a[1];
                if (symbol instanceof ConstrainVariable) {
                    symbol.setValue(row._constant);
                }
            }
        };
        ConstraintSolver.prototype.createRow = function (constraint) {
            var constrain = constraint.constrain;
            var row = new ConstraintRow(void 0, constrain.constant);
            var terms = constrain.terms;
            for (var i = 0, n = terms.size; i < n; i += 1) {
                var _a = terms.getEntry(i), variable = _a[0], coefficient = _a[1];
                if (variable !== null && Math.abs(coefficient) >= EPSILON$1) {
                    var basic = this._rows.get(variable);
                    if (basic !== void 0) {
                        row.insertRow(basic, coefficient);
                    }
                    else {
                        row.insertSymbol(variable, coefficient);
                    }
                }
            }
            var objective = this._objective;
            var relation = constraint.relation;
            var strength = constraint.strength;
            var tag = { marker: ConstraintSymbol.Invalid, other: ConstraintSymbol.Invalid };
            if (relation === "le" || relation === "ge") {
                var coefficient = relation === "le" ? 1 : -1;
                var slack = new ConstraintSlack();
                tag.marker = slack;
                row.insertSymbol(slack, coefficient);
                if (strength < ConstraintStrength.Required) {
                    var error = new ConstraintError();
                    tag.other = error;
                    row.insertSymbol(error, -coefficient);
                    objective.insertSymbol(error, strength);
                }
            }
            else {
                if (strength < ConstraintStrength.Required) {
                    var eplus = new ConstraintError();
                    var eminus = new ConstraintError();
                    tag.marker = eplus;
                    tag.other = eminus;
                    row.insertSymbol(eplus, -1);
                    row.insertSymbol(eminus, 1);
                    objective.insertSymbol(eplus, strength);
                    objective.insertSymbol(eminus, strength);
                }
                else {
                    var dummy = new ConstraintDummy();
                    tag.marker = dummy;
                    row.insertSymbol(dummy);
                }
            }
            if (row._constant < 0) {
                row.negate();
            }
            return { row: row, tag: tag };
        };
        ConstraintSolver.prototype.chooseSubject = function (row, tag) {
            for (var i = 0, n = row._cells.size; i < n; i += 1) {
                var symbol = row._cells.getEntry(i)[0];
                if (symbol.isExternal()) {
                    return symbol;
                }
            }
            if (tag.marker instanceof ConstraintSlack || tag.marker instanceof ConstraintError) {
                if (row.coefficientFor(tag.marker) < 0) {
                    return tag.marker;
                }
            }
            if (tag.other instanceof ConstraintSlack || tag.other instanceof ConstraintError) {
                if (row.coefficientFor(tag.other) < 0) {
                    return tag.other;
                }
            }
            return ConstraintSymbol.Invalid;
        };
        ConstraintSolver.prototype.addWithArtificialVariable = function (row) {
            var artificial = new ConstraintSlack();
            this._rows.set(artificial, row.clone());
            this._artificial = row.clone();
            this.optimize(this._artificial);
            var success = Math.abs(this._artificial._constant) < EPSILON$1;
            this._artificial = null;
            var basic = this._rows.remove(artificial);
            if (basic !== void 0) {
                if (basic.isConstant()) {
                    return success;
                }
                var entering = this.anyPivotableSymbol(basic);
                if (entering.isInvalid()) {
                    return false;
                }
                basic.solveForEx(artificial, entering);
                this.substitute(entering, basic);
                this._rows.set(entering, basic);
            }
            for (var i = 0, n = this._rows.size; i < n; i += 1) {
                this._rows.getEntry(i)[1].removeSymbol(artificial);
            }
            this._objective.removeSymbol(artificial);
            return success;
        };
        ConstraintSolver.prototype.substitute = function (symbol, row) {
            for (var i = 0, n = this._rows.size; i < n; i += 1) {
                var _a = this._rows.getEntry(i), key = _a[0], value = _a[1];
                value.substitute(symbol, row);
                if (value._constant < 0 && !key.isExternal()) {
                    this._infeasible.push(key);
                }
            }
            this._objective.substitute(symbol, row);
            if (this._artificial) {
                this._artificial.substitute(symbol, row);
            }
        };
        ConstraintSolver.prototype.optimize = function (objective) {
            do {
                var entering = this.getEnteringSymbol(objective);
                if (entering.isInvalid()) {
                    return;
                }
                var leaving = this.getLeavingSymbol(entering);
                if (leaving.isInvalid()) {
                    throw new Error("objective is unbounded");
                }
                var row = this._rows.remove(leaving);
                row.solveForEx(leaving, entering);
                this.substitute(entering, row);
                this._rows.set(entering, row);
            } while (true);
        };
        ConstraintSolver.prototype.dualOptimize = function () {
            var leaving;
            while (leaving = this._infeasible.pop()) {
                var row = this._rows.get(leaving);
                if (row !== void 0 && row._constant < 0) {
                    var entering = this.getDualEnteringSymbol(row);
                    if (entering.isInvalid()) {
                        throw new Error("dual optimize failed");
                    }
                    this._rows.remove(leaving);
                    row.solveForEx(leaving, entering);
                    this.substitute(entering, row);
                    this._rows.set(entering, row);
                }
            }
        };
        ConstraintSolver.prototype.getEnteringSymbol = function (objective) {
            for (var i = 0, n = objective._cells.size; i < n; i += 1) {
                var _a = objective._cells.getEntry(i), symbol = _a[0], value = _a[1];
                if (value < 0 && !symbol.isDummy()) {
                    return symbol;
                }
            }
            return ConstraintSymbol.Invalid;
        };
        ConstraintSolver.prototype.getDualEnteringSymbol = function (row) {
            var ratio = Number.MAX_VALUE;
            var entering = ConstraintSymbol.Invalid;
            for (var i = 0, n = row._cells.size; i < n; i += 1) {
                var _a = row._cells.getEntry(i), symbol = _a[0], value = _a[1];
                if (value > 0 && !symbol.isDummy()) {
                    var coefficient = this._objective.coefficientFor(symbol);
                    var coratio = coefficient / value;
                    if (coratio < ratio) {
                        ratio = coratio;
                        entering = symbol;
                    }
                }
            }
            return entering;
        };
        ConstraintSolver.prototype.getLeavingSymbol = function (entering) {
            var ratio = Number.MAX_VALUE;
            var found = ConstraintSymbol.Invalid;
            for (var i = 0, n = this._rows.size; i < n; i += 1) {
                var _a = this._rows.getEntry(i), symbol = _a[0], row = _a[1];
                if (!symbol.isExternal()) {
                    var coefficient = row.coefficientFor(entering);
                    if (coefficient < 0) {
                        var coratio = -row._constant / coefficient;
                        if (coratio < ratio) {
                            ratio = coratio;
                            found = symbol;
                        }
                    }
                }
            }
            return found;
        };
        ConstraintSolver.prototype.getMarkerLeavingSymbol = function (marker) {
            var r1 = Number.MAX_VALUE;
            var r2 = Number.MAX_VALUE;
            var first = ConstraintSymbol.Invalid;
            var second = ConstraintSymbol.Invalid;
            var third = ConstraintSymbol.Invalid;
            for (var i = 0, n = this._rows.size; i < n; i += 1) {
                var _a = this._rows.getEntry(i), symbol = _a[0], row = _a[1];
                var coefficient = row.coefficientFor(marker);
                if (coefficient === 0) {
                    continue;
                }
                if (symbol.isExternal()) {
                    third = symbol;
                }
                else if (coefficient < 0) {
                    var ratio = -row._constant / coefficient;
                    if (ratio < r1) {
                        r1 = ratio;
                        first = symbol;
                    }
                }
                else {
                    var ratio = row._constant / coefficient;
                    if (ratio < r2) {
                        r2 = ratio;
                        second = symbol;
                    }
                }
            }
            if (!first.isInvalid()) {
                return first;
            }
            else if (!second.isInvalid()) {
                return second;
            }
            else {
                return third;
            }
        };
        ConstraintSolver.prototype.removeConstraintEffects = function (constraint, tag) {
            if (tag.marker instanceof ConstraintError) {
                this.removeMarkerEffects(tag.marker, constraint.strength);
            }
            if (tag.other instanceof ConstraintError) {
                this.removeMarkerEffects(tag.other, constraint.strength);
            }
        };
        ConstraintSolver.prototype.removeMarkerEffects = function (marker, strength) {
            var row = this._rows.get(marker);
            if (row !== void 0) {
                this._objective.insertRow(row, -strength);
            }
            else {
                this._objective.insertSymbol(marker, -strength);
            }
        };
        ConstraintSolver.prototype.anyPivotableSymbol = function (row) {
            for (var i = 0, n = row._cells.size; i < n; i += 1) {
                var symbol = row._cells.getEntry(i)[0];
                if (symbol instanceof ConstraintSlack || symbol instanceof ConstraintError) {
                    return symbol;
                }
            }
            return ConstraintSymbol.Invalid;
        };
        return ConstraintSolver;
    }());

    var View = (function () {
        function View() {
        }
        View.prototype.willSetKey = function (key) {
            this.willObserve(function (viewObserver) {
                if (viewObserver.viewWillSetKey) {
                    viewObserver.viewWillSetKey(key, this);
                }
            });
        };
        View.prototype.onSetKey = function (key) {
        };
        View.prototype.didSetKey = function (key) {
            this.didObserve(function (viewObserver) {
                if (viewObserver.viewDidSetKey) {
                    viewObserver.viewDidSetKey(key, this);
                }
            });
        };
        View.prototype.willSetViewController = function (viewController) {
        };
        View.prototype.onSetViewController = function (viewController) {
        };
        View.prototype.didSetViewController = function (viewController) {
        };
        View.prototype.willAddViewObserver = function (viewObserver) {
        };
        View.prototype.onAddViewObserver = function (viewObserver) {
        };
        View.prototype.didAddViewObserver = function (viewObserver) {
        };
        View.prototype.willRemoveViewObserver = function (viewObserver) {
        };
        View.prototype.onRemoveViewObserver = function (viewObserver) {
        };
        View.prototype.didRemoveViewObserver = function (viewObserver) {
        };
        View.prototype.willObserve = function (callback) {
            var viewController = this.viewController;
            if (viewController) {
                callback.call(this, viewController);
            }
            var viewObservers = this.viewObservers;
            for (var i = 0, n = viewObservers.length; i < n; i += 1) {
                callback.call(this, viewObservers[i]);
            }
        };
        View.prototype.didObserve = function (callback) {
            var viewObservers = this.viewObservers;
            for (var i = 0, n = viewObservers.length; i < n; i += 1) {
                callback.call(this, viewObservers[i]);
            }
            var viewController = this.viewController;
            if (viewController) {
                callback.call(this, viewController);
            }
        };
        Object.defineProperty(View.prototype, "appView", {
            get: function () {
                var parentView = this.parentView;
                return parentView ? parentView.appView : null;
            },
            enumerable: true,
            configurable: true
        });
        View.prototype.willSetParentView = function (parentView) {
            this.willObserve(function (viewObserver) {
                if (viewObserver.viewWillSetParentView) {
                    viewObserver.viewWillSetParentView(parentView, this);
                }
            });
        };
        View.prototype.onSetParentView = function (parentView) {
            if (parentView) {
                if (parentView.isMounted()) {
                    this.cascadeMount();
                }
            }
            else {
                this.cascadeUnmount();
            }
        };
        View.prototype.didSetParentView = function (parentView) {
            this.didObserve(function (viewObserver) {
                if (viewObserver.viewDidSetParentView) {
                    viewObserver.viewDidSetParentView(parentView, this);
                }
            });
        };
        View.prototype.getChildView = function (key) {
            var childViews = this.childViews;
            for (var i = childViews.length - 1; i >= 0; i -= 1) {
                var childView = childViews[i];
                if (childView.key() === key) {
                    return childView;
                }
            }
            return null;
        };
        View.prototype.willInsertChildView = function (childView, targetView) {
            this.willObserve(function (viewObserver) {
                if (viewObserver.viewWillInsertChildView) {
                    viewObserver.viewWillInsertChildView(childView, targetView, this);
                }
            });
        };
        View.prototype.onInsertChildView = function (childView, targetView) {
        };
        View.prototype.didInsertChildView = function (childView, targetView) {
            this.didObserve(function (viewObserver) {
                if (viewObserver.viewDidInsertChildView) {
                    viewObserver.viewDidInsertChildView(childView, targetView, this);
                }
            });
        };
        View.prototype.willRemoveChildView = function (childView) {
            this.willObserve(function (viewObserver) {
                if (viewObserver.viewWillRemoveChildView) {
                    viewObserver.viewWillRemoveChildView(childView, this);
                }
            });
        };
        View.prototype.onRemoveChildView = function (childView) {
        };
        View.prototype.didRemoveChildView = function (childView) {
            this.didObserve(function (viewObserver) {
                if (viewObserver.viewDidRemoveChildView) {
                    viewObserver.viewDidRemoveChildView(childView, this);
                }
            });
        };
        View.prototype.isMounted = function () {
            var parentView = this.parentView;
            return parentView ? parentView.isMounted() : false;
        };
        View.prototype.cascadeMount = function () {
            this.willMount();
            this.onMount();
            var childViews = this.childViews;
            for (var i = 0, n = childViews.length; i < n; i += 1) {
                var childView = childViews[i];
                childView.cascadeMount();
            }
            this.didMount();
        };
        View.prototype.willMount = function () {
            this.willObserve(function (viewObserver) {
                if (viewObserver.viewWillMount) {
                    viewObserver.viewWillMount(this);
                }
            });
        };
        View.prototype.onMount = function () {
        };
        View.prototype.didMount = function () {
            this.didObserve(function (viewObserver) {
                if (viewObserver.viewDidMount) {
                    viewObserver.viewDidMount(this);
                }
            });
        };
        View.prototype.cascadeUnmount = function () {
            this.willMount();
            this.onUnmount();
            var childViews = this.childViews;
            for (var i = 0, n = childViews.length; i < n; i += 1) {
                var childView = childViews[i];
                childView.cascadeUnmount();
            }
            this.didMount();
        };
        View.prototype.willUnmount = function () {
            this.willObserve(function (viewObserver) {
                if (viewObserver.viewWillUnmount) {
                    viewObserver.viewWillUnmount(this);
                }
            });
        };
        View.prototype.onUnmount = function () {
        };
        View.prototype.didUnmount = function () {
            this.didObserve(function (viewObserver) {
                if (viewObserver.viewDidUnmount) {
                    viewObserver.viewDidUnmount(this);
                }
            });
        };
        View.prototype.cascadeResize = function () {
            this.willResize();
            this.onResize();
            var childViews = this.childViews;
            for (var i = 0, n = childViews.length; i < n; i += 1) {
                var childView = childViews[i];
                childView.cascadeResize();
            }
            this.didResize();
        };
        View.prototype.willResize = function () {
            this.willObserve(function (viewObserver) {
                if (viewObserver.viewWillResize) {
                    viewObserver.viewWillResize(this);
                }
            });
        };
        View.prototype.onResize = function () {
        };
        View.prototype.didResize = function () {
            this.didObserve(function (viewObserver) {
                if (viewObserver.viewDidResize) {
                    viewObserver.viewDidResize(this);
                }
            });
        };
        View.prototype.cascadeLayout = function () {
            this.willLayout();
            this.onLayout();
            var childViews = this.childViews;
            for (var i = 0, n = childViews.length; i < n; i += 1) {
                var childView = childViews[i];
                childView.cascadeLayout();
            }
            this.didLayout();
        };
        View.prototype.willLayout = function () {
            this.willObserve(function (viewObserver) {
                if (viewObserver.viewWillLayout) {
                    viewObserver.viewWillLayout(this);
                }
            });
        };
        View.prototype.onLayout = function () {
        };
        View.prototype.didLayout = function () {
            this.didObserve(function (viewObserver) {
                if (viewObserver.viewDidLayout) {
                    viewObserver.viewDidLayout(this);
                }
            });
        };
        View.prototype.cascadeScroll = function () {
            this.willScroll();
            this.onScroll();
            var childViews = this.childViews;
            for (var i = 0, n = childViews.length; i < n; i += 1) {
                var childView = childViews[i];
                childView.cascadeScroll();
            }
            this.didScroll();
        };
        View.prototype.willScroll = function () {
            this.willObserve(function (viewObserver) {
                if (viewObserver.viewWillScroll) {
                    viewObserver.viewWillScroll(this);
                }
            });
        };
        View.prototype.onScroll = function () {
        };
        View.prototype.didScroll = function () {
            this.didObserve(function (viewObserver) {
                if (viewObserver.viewDidScroll) {
                    viewObserver.viewDidScroll(this);
                }
            });
        };
        Object.defineProperty(View.prototype, "pageTransform", {
            get: function () {
                var parentView = this.parentView;
                if (parentView) {
                    return parentView.pageTransform.transform(this.parentTransform);
                }
                else {
                    return Transform.identity();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(View.prototype, "pageBounds", {
            get: function () {
                var clientBounds = this.clientBounds;
                var clientTransform = this.clientTransform;
                return clientBounds.transform(clientTransform);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(View.prototype, "popoverBounds", {
            get: function () {
                return this.pageBounds;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(View.prototype, "clientTransform", {
            get: function () {
                var clientTransform;
                var scrollX = window.pageXOffset;
                var scrollY = window.pageYOffset;
                if (scrollX !== 0 || scrollY !== 0) {
                    clientTransform = Transform.translate(scrollX, scrollY);
                }
                else {
                    clientTransform = Transform.identity();
                }
                var pageTransform = this.pageTransform;
                return clientTransform.transform(pageTransform);
            },
            enumerable: true,
            configurable: true
        });
        View.prototype.isVisible = function () {
            var bounds = this.clientBounds;
            var windowWidth = document.documentElement.clientWidth;
            var windowHeight = document.documentElement.clientHeight;
            return (bounds.top <= 0 && 0 < bounds.bottom || 0 <= bounds.top && bounds.top < windowHeight)
                && (bounds.left <= 0 && 0 < bounds.right || 0 <= bounds.left && bounds.left < windowWidth);
        };
        View.fromNode = function (node) {
            if (node.view instanceof View) {
                return node.view;
            }
            else if (node instanceof Element) {
                if (node instanceof HTMLElement) {
                    if (node instanceof HTMLCanvasElement) {
                        return new View.Canvas(node);
                    }
                    else {
                        return new View.Html(node);
                    }
                }
                else if (node instanceof SVGElement) {
                    return new View.Svg(node);
                }
                else {
                    return new View.Element(node);
                }
            }
            else if (node instanceof Text) {
                return new View.Text(node);
            }
            else {
                return new View.Node(node);
            }
        };
        View.create = function (tag, key) {
            if (typeof tag === "string") {
                if (tag === "svg") {
                    return new View.Svg(document.createElementNS(View.Svg.NS, tag));
                }
                else if (tag === "canvas") {
                    return new View.Canvas(document.createElement(tag));
                }
                else {
                    return View.fromNode(document.createElement(tag));
                }
            }
            else if (typeof tag === "function") {
                var ns = tag.NS;
                var view = void 0;
                if (ns === void 0) {
                    view = new tag(document.createElement(tag.tag));
                }
                else {
                    view = new tag(document.createElementNS(ns, tag.tag));
                }
                if (key !== void 0) {
                    view = view.key(key);
                }
                return view;
            }
            throw new TypeError("" + tag);
        };
        View.decorateMemberAnimator = function (MemberAnimator, inherit, target, key) {
            if (inherit === "inherit") {
                inherit = key;
            }
            Object.defineProperty(target, key, {
                get: function () {
                    var animator = new MemberAnimator(this, void 0, void 0, inherit);
                    Object.defineProperty(animator, "name", {
                        value: key,
                        enumerable: true,
                        configurable: true,
                    });
                    Object.defineProperty(this, key, {
                        value: animator,
                        configurable: true,
                        enumerable: true,
                    });
                    return animator;
                },
                configurable: true,
                enumerable: true,
            });
        };
        View.decorateLayoutAnchor = function (LayoutAnchor, value, strength, target, key) {
            Object.defineProperty(target, key, {
                get: function () {
                    var anchor = new LayoutAnchor(this, key, value, strength);
                    Object.defineProperty(this, key, {
                        value: anchor,
                        configurable: true,
                        enumerable: true,
                    });
                    return anchor;
                },
                configurable: true,
                enumerable: true,
            });
        };
        return View;
    }());

    var MemberAnimator = (function (_super) {
        var MemberAnimator = function (view, value, transition, inherit) {
            if (this instanceof MemberAnimator) {
                if (transition === void 0) {
                    transition = null;
                }
                var _this = _super.call(this, value, transition) || this;
                _this._view = view;
                _this._inherit = inherit !== void 0 ? inherit : null;
                return _this;
            }
            else {
                var type = view;
                inherit = value;
                if (type === Object) {
                    return View.decorateMemberAnimator.bind(void 0, MemberAnimator.Object, inherit);
                }
                else if (type === String) {
                    return View.decorateMemberAnimator.bind(void 0, MemberAnimator.String, inherit);
                }
                else if (type === Boolean) {
                    return View.decorateMemberAnimator.bind(void 0, MemberAnimator.Boolean, inherit);
                }
                else if (type === Number) {
                    return View.decorateMemberAnimator.bind(void 0, MemberAnimator.Number, inherit);
                }
                else if (type === Angle) {
                    return View.decorateMemberAnimator.bind(void 0, MemberAnimator.Angle, inherit);
                }
                else if (type === Length) {
                    return View.decorateMemberAnimator.bind(void 0, MemberAnimator.Length, inherit);
                }
                else if (type === Color) {
                    return View.decorateMemberAnimator.bind(void 0, MemberAnimator.Color, inherit);
                }
                else if (type === Font) {
                    return View.decorateMemberAnimator.bind(void 0, MemberAnimator.Font, inherit);
                }
                else if (type === Transform) {
                    return View.decorateMemberAnimator.bind(void 0, MemberAnimator.Transform, inherit);
                }
                else if (util.FromAny.is(type)) {
                    return View.decorateMemberAnimator.bind(void 0, MemberAnimator.Any.bind(void 0, type), inherit);
                }
                throw new TypeError("" + type);
            }
        };
        __extends(MemberAnimator, _super);
        Object.defineProperty(MemberAnimator.prototype, "view", {
            get: function () {
                return this._view;
            },
            enumerable: true,
            configurable: true,
        });
        Object.defineProperty(MemberAnimator.prototype, "inherit", {
            get: function () {
                return this._inherit;
            },
            enumerable: true,
            configurable: true,
        });
        Object.defineProperty(MemberAnimator.prototype, "dirty", {
            get: function () {
                return this._view.dirty;
            },
            enumerable: true,
            configurable: true,
        });
        Object.defineProperty(MemberAnimator.prototype, "value", {
            get: function () {
                var value = this._value;
                if (value === void 0) {
                    var inherit = this._inherit;
                    if (inherit !== null) {
                        var view = this._view.parentView;
                        while (view) {
                            var animator = view[inherit];
                            if (animator instanceof TweenAnimator) {
                                value = animator.value;
                                break;
                            }
                            view = view.parentView;
                        }
                    }
                }
                return value;
            },
            enumerable: true,
            configurable: true,
        });
        Object.defineProperty(MemberAnimator.prototype, "state", {
            get: function () {
                var state = this._state;
                if (state === void 0) {
                    var inherit = this._inherit;
                    if (inherit !== null) {
                        var view = this._view.parentView;
                        while (view) {
                            var animator = view[inherit];
                            if (animator instanceof TweenAnimator) {
                                state = animator.state;
                                break;
                            }
                            view = view.parentView;
                        }
                    }
                }
                return state;
            },
            enumerable: true,
            configurable: true,
        });
        MemberAnimator.prototype.setDirty = function (dirty) {
            if (dirty) {
                this._view.setDirty(dirty);
            }
        };
        MemberAnimator.prototype.animate = function () {
            if (!this._disabled) {
                this._view.animate();
            }
        };
        MemberAnimator.prototype.cancel = function () {
        };
        MemberAnimator.prototype.update = function (newValue, oldValue) {
            if (!util.Objects.equal(oldValue, newValue)) {
                this.setDirty(true);
            }
        };
        MemberAnimator.prototype.delete = function () {
        };
        return MemberAnimator;
    }(TweenAnimator));

    var AnyMemberAnimator = (function (_super) {
        var AnyMemberAnimator = function (type, view, value, transition, inherit) {
            var _this = function (value, tween) {
                if (value === void 0) {
                    return _this.value;
                }
                else {
                    if (value !== null) {
                        value = _this._type.fromAny(value);
                    }
                    _this.setState(value, tween);
                    return _this._view;
                }
            };
            _this.__proto__ = this;
            _this = _super.call(_this, view, value, transition, inherit) || _this;
            _this._type = type;
            return _this;
        };
        __extends(AnyMemberAnimator, _super);
        Object.defineProperty(AnyMemberAnimator.prototype, "type", {
            get: function () {
                return this._type;
            },
            enumerable: true,
            configurable: true,
        });
        return AnyMemberAnimator;
    }(MemberAnimator));
    MemberAnimator.Any = AnyMemberAnimator;

    var ObjectMemberAnimator = (function (_super) {
        var ObjectMemberAnimator = function (view, value, transition, inherit) {
            var _this = function (value, tween) {
                if (value === void 0) {
                    return _this.value;
                }
                else {
                    _this.setState(value, tween);
                    return _this._view;
                }
            };
            _this.__proto__ = this;
            _this = _super.call(_this, view, value, transition, inherit) || _this;
            return _this;
        };
        __extends(ObjectMemberAnimator, _super);
        return ObjectMemberAnimator;
    }(MemberAnimator));
    MemberAnimator.Object = ObjectMemberAnimator;

    var StringMemberAnimator = (function (_super) {
        var StringMemberAnimator = function (view, value, transition, inherit) {
            var _this = function (value, tween) {
                if (value === void 0) {
                    return _this.value;
                }
                else {
                    _this.setState(value, tween);
                    return _this._view;
                }
            };
            _this.__proto__ = this;
            _this = _super.call(_this, view, value, transition, inherit) || _this;
            return _this;
        };
        __extends(StringMemberAnimator, _super);
        return StringMemberAnimator;
    }(MemberAnimator));
    MemberAnimator.String = StringMemberAnimator;

    var BooleanMemberAnimator = (function (_super) {
        var BooleanMemberAnimator = function (view, value, transition, inherit) {
            var _this = function (value, tween) {
                if (value === void 0) {
                    return _this.value;
                }
                else {
                    if (typeof value === "string") {
                        value = value ? true : false;
                    }
                    _this.setState(value, tween);
                    return _this._view;
                }
            };
            _this.__proto__ = this;
            _this = _super.call(_this, view, value, transition, inherit) || _this;
            return _this;
        };
        __extends(BooleanMemberAnimator, _super);
        return BooleanMemberAnimator;
    }(MemberAnimator));
    MemberAnimator.Boolean = BooleanMemberAnimator;

    var NumberMemberAnimator = (function (_super) {
        var NumberMemberAnimator = function (view, value, transition, inherit) {
            var _this = function (value, tween) {
                if (value === void 0) {
                    return _this.value;
                }
                else {
                    if (typeof value === "string") {
                        value = +value;
                    }
                    _this.setState(value, tween);
                    return _this._view;
                }
            };
            _this.__proto__ = this;
            _this = _super.call(_this, view, value, transition, inherit) || _this;
            return _this;
        };
        __extends(NumberMemberAnimator, _super);
        return NumberMemberAnimator;
    }(MemberAnimator));
    MemberAnimator.Number = NumberMemberAnimator;

    var AngleMemberAnimator = (function (_super) {
        var AngleMemberAnimator = function (view, value, transition, inherit) {
            var _this = function (value, tween) {
                if (value === void 0) {
                    return _this.value;
                }
                else {
                    if (value !== null) {
                        value = Angle.fromAny(value);
                    }
                    _this.setState(value, tween);
                    return _this._view;
                }
            };
            _this.__proto__ = this;
            _this = _super.call(_this, view, value, transition, inherit) || _this;
            return _this;
        };
        __extends(AngleMemberAnimator, _super);
        return AngleMemberAnimator;
    }(MemberAnimator));
    MemberAnimator.Angle = AngleMemberAnimator;

    var LengthMemberAnimator = (function (_super) {
        var LengthMemberAnimator = function (view, value, transition, inherit) {
            var _this = function (value, tween) {
                if (value === void 0) {
                    return _this.value;
                }
                else {
                    if (value !== null) {
                        value = Length.fromAny(value);
                    }
                    _this.setState(value, tween);
                    return _this._view;
                }
            };
            _this.__proto__ = this;
            _this = _super.call(_this, view, value, transition, inherit) || _this;
            return _this;
        };
        __extends(LengthMemberAnimator, _super);
        return LengthMemberAnimator;
    }(MemberAnimator));
    MemberAnimator.Length = LengthMemberAnimator;

    var ColorMemberAnimator = (function (_super) {
        var ColorMemberAnimator = function (view, value, transition, inherit) {
            var _this = function (value, tween) {
                if (value === void 0) {
                    return _this.value;
                }
                else {
                    if (value !== null) {
                        value = Color.fromAny(value);
                    }
                    _this.setState(value, tween);
                    return _this._view;
                }
            };
            _this.__proto__ = this;
            _this = _super.call(_this, view, value, transition, inherit) || _this;
            return _this;
        };
        __extends(ColorMemberAnimator, _super);
        return ColorMemberAnimator;
    }(MemberAnimator));
    MemberAnimator.Color = ColorMemberAnimator;

    var FontMemberAnimator = (function (_super) {
        var FontMemberAnimator = function (view, value, transition, inherit) {
            var _this = function (value, tween) {
                if (value === void 0) {
                    return _this.value;
                }
                else {
                    if (value !== null) {
                        value = Font.fromAny(value);
                    }
                    _this.setState(value, tween);
                    return _this._view;
                }
            };
            _this.__proto__ = this;
            _this = _super.call(_this, view, value, transition, inherit) || _this;
            return _this;
        };
        __extends(FontMemberAnimator, _super);
        return FontMemberAnimator;
    }(MemberAnimator));
    MemberAnimator.Font = FontMemberAnimator;

    var TransformMemberAnimator = (function (_super) {
        var TransformMemberAnimator = function (view, value, transition, inherit) {
            var _this = function (value, tween) {
                if (value === void 0) {
                    return _this.value;
                }
                else {
                    if (value !== null) {
                        value = Transform.fromAny(value);
                    }
                    _this.setState(value, tween);
                    return _this._view;
                }
            };
            _this.__proto__ = this;
            _this = _super.call(_this, view, value, transition, inherit) || _this;
            return _this;
        };
        __extends(TransformMemberAnimator, _super);
        return TransformMemberAnimator;
    }(MemberAnimator));
    MemberAnimator.Transform = TransformMemberAnimator;

    var NodeView = (function (_super) {
        __extends(NodeView, _super);
        function NodeView(node, key) {
            if (key === void 0) { key = null; }
            var _this = _super.call(this) || this;
            _this.onAnimationFrame = _this.onAnimationFrame.bind(_this);
            _this._node = node;
            _this._node.view = _this;
            _this._key = key;
            _this._viewController = null;
            _this._viewObservers = [];
            _this._dirty = false;
            _this._animationFrame = 0;
            _this.initNode(_this._node);
            return _this;
        }
        Object.defineProperty(NodeView.prototype, "node", {
            get: function () {
                return this._node;
            },
            enumerable: true,
            configurable: true
        });
        NodeView.prototype.initNode = function (node) {
        };
        NodeView.prototype.key = function (key) {
            if (key === void 0) {
                return this._key;
            }
            else {
                this.willSetKey(key);
                this._key = key;
                this.onSetKey(key);
                this.didSetKey(key);
                return this;
            }
        };
        Object.defineProperty(NodeView.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: true,
            configurable: true
        });
        NodeView.prototype.setViewController = function (viewController) {
            if (this._viewController !== viewController) {
                this.willSetViewController(viewController);
                if (this._viewController && this._viewController.setView) {
                    this._viewController.setView(null);
                }
                this._viewController = viewController;
                if (this._viewController && this._viewController.setView) {
                    this._viewController.setView(this);
                }
                this.onSetViewController(viewController);
                this.didSetViewController(viewController);
            }
        };
        Object.defineProperty(NodeView.prototype, "viewObservers", {
            get: function () {
                return this._viewObservers;
            },
            enumerable: true,
            configurable: true
        });
        NodeView.prototype.addViewObserver = function (viewObserver) {
            var viewObservers = this._viewObservers;
            var index = viewObservers.indexOf(viewObserver);
            if (index < 0) {
                this.willAddViewObserver(viewObserver);
                viewObservers.push(viewObserver);
                this.onAddViewObserver(viewObserver);
                this.didAddViewObserver(viewObserver);
            }
        };
        NodeView.prototype.removeViewObserver = function (viewObserver) {
            var viewObservers = this._viewObservers;
            var index = viewObservers.indexOf(viewObserver);
            if (index >= 0) {
                this.willRemoveViewObserver(viewObserver);
                viewObservers.splice(index, 1);
                this.onRemoveViewObserver(viewObserver);
                this.didRemoveViewObserver(viewObserver);
            }
        };
        Object.defineProperty(NodeView.prototype, "parentView", {
            get: function () {
                var parentNode = this._node.parentNode;
                if (parentNode) {
                    var parentView = parentNode.view;
                    if (parentView instanceof View) {
                        return parentView;
                    }
                }
                return null;
            },
            enumerable: true,
            configurable: true
        });
        NodeView.prototype.setParentView = function (parentView) {
            this.willSetParentView(parentView);
            this.onSetParentView(parentView);
            this.didSetParentView(parentView);
        };
        Object.defineProperty(NodeView.prototype, "childViews", {
            get: function () {
                var childNodes = this._node.childNodes;
                var childViews = [];
                for (var i = 0, n = childNodes.length; i < n; i += 1) {
                    var childView = childNodes[i].view;
                    if (childView) {
                        childViews.push(childView);
                    }
                }
                return childViews;
            },
            enumerable: true,
            configurable: true
        });
        NodeView.prototype.getChildView = function (key) {
            var childNodes = this._node.childNodes;
            for (var i = childNodes.length - 1; i >= 0; i -= 1) {
                var childView = childNodes[i].view;
                if (childView && childView.key() === key) {
                    return childView;
                }
            }
            return null;
        };
        NodeView.prototype.setChildView = function (key, newChildView) {
            if (!(newChildView instanceof NodeView)) {
                throw new TypeError("" + newChildView);
            }
            var oldChildView = null;
            var targetNode = null;
            var childNodes = this._node.childNodes;
            for (var i = childNodes.length - 1; i >= 0; i -= 1) {
                var childView = childNodes[i].view;
                if (childView && childView.key() === key) {
                    oldChildView = childView;
                    targetNode = childNodes[i + 1] || null;
                    this.removeChildView(childView);
                    break;
                }
            }
            if (newChildView) {
                newChildView.key(key);
                this.insertChild(newChildView, targetNode);
            }
            return oldChildView;
        };
        NodeView.prototype.appendChild = function (child) {
            if (child instanceof View) {
                this.appendChildView(child);
            }
            else if (child instanceof Node) {
                this.appendChildNode(child);
            }
            else {
                throw new TypeError("" + child);
            }
        };
        NodeView.prototype.appendChildView = function (childView) {
            if (!(childView instanceof NodeView)) {
                throw new TypeError("" + childView);
            }
            var childNode = childView._node;
            this.willInsertChildView(childView, null);
            this.willInsertChildNode(childNode, null);
            this._node.appendChild(childNode);
            childView.setParentView(this);
            this.onInsertChildNode(childNode, null);
            this.onInsertChildView(childView, null);
            this.didInsertChildNode(childNode, null);
            this.didInsertChildView(childView, null);
        };
        NodeView.prototype.appendChildNode = function (childNode) {
            var childView = childNode.view;
            if (childView !== void 0) {
                this.willInsertChildView(childView, null);
            }
            this.willInsertChildNode(childNode, null);
            this._node.appendChild(childNode);
            if (childView !== void 0) {
                childView.setParentView(this);
            }
            this.onInsertChildNode(childNode, null);
            if (childView !== void 0) {
                this.onInsertChildView(childView, null);
            }
            this.didInsertChildNode(childNode, null);
            if (childView !== void 0) {
                this.didInsertChildView(childView, null);
            }
        };
        NodeView.prototype.prependChild = function (child) {
            if (child instanceof View) {
                this.prependChildView(child);
            }
            else if (child instanceof Node) {
                this.prependChildNode(child);
            }
            else {
                throw new TypeError("" + child);
            }
        };
        NodeView.prototype.prependChildView = function (childView) {
            if (!(childView instanceof NodeView)) {
                throw new TypeError("" + childView);
            }
            var childNode = childView._node;
            var targetNode = this._node.firstChild;
            var targetView = targetNode ? targetNode.view : null;
            this.willInsertChildView(childView, targetView);
            this.willInsertChildNode(childNode, targetNode);
            this._node.insertBefore(childNode, targetNode);
            childView.setParentView(this);
            this.onInsertChildNode(childNode, targetNode);
            this.onInsertChildView(childView, targetView);
            this.didInsertChildNode(childNode, targetNode);
            this.didInsertChildView(childView, targetView);
        };
        NodeView.prototype.prependChildNode = function (childNode) {
            var childView = childNode.view;
            var targetNode = this._node.firstChild;
            var targetView = targetNode ? targetNode.view : null;
            if (childView !== void 0) {
                this.willInsertChildView(childView, targetView);
            }
            this.willInsertChildNode(childNode, targetNode);
            this._node.insertBefore(childNode, targetNode);
            if (childView !== void 0) {
                childView.setParentView(this);
            }
            this.onInsertChildNode(childNode, targetNode);
            if (childView !== void 0) {
                this.onInsertChildView(childView, targetView);
            }
            this.didInsertChildNode(childNode, targetNode);
            if (childView !== void 0) {
                this.didInsertChildView(childView, targetView);
            }
        };
        NodeView.prototype.insertChild = function (child, target) {
            if (child instanceof NodeView) {
                if (target instanceof View) {
                    this.insertChildView(child, target);
                }
                else if (target instanceof Node || target === null) {
                    this.insertChildNode(child._node, target);
                }
                else {
                    throw new TypeError("" + target);
                }
            }
            else if (child instanceof Node) {
                if (target instanceof NodeView) {
                    this.insertChildNode(child, target._node);
                }
                else if (target instanceof Node || target === null) {
                    this.insertChildNode(child, target);
                }
                else {
                    throw new TypeError("" + target);
                }
            }
            else {
                throw new TypeError("" + child);
            }
        };
        NodeView.prototype.insertChildView = function (childView, targetView) {
            if (!(childView instanceof NodeView)) {
                throw new TypeError("" + childView);
            }
            if (targetView !== null && !(targetView instanceof NodeView)) {
                throw new TypeError("" + targetView);
            }
            var childNode = childView._node;
            var targetNode = targetView ? targetView._node : null;
            this.willInsertChildView(childView, targetView);
            this.willInsertChildNode(childNode, targetNode);
            this._node.insertBefore(childNode, targetNode);
            childView.setParentView(this);
            this.onInsertChildNode(childNode, targetNode);
            this.onInsertChildView(childView, targetView);
            this.didInsertChildNode(childNode, targetNode);
            this.didInsertChildView(childView, targetView);
        };
        NodeView.prototype.insertChildNode = function (childNode, targetNode) {
            var childView = childNode.view;
            var targetView = targetNode ? targetNode.view : null;
            if (childView !== void 0) {
                this.willInsertChildView(childView, targetView);
            }
            this.willInsertChildNode(childNode, targetNode);
            this._node.insertBefore(childNode, targetNode);
            if (childView !== void 0) {
                childView.setParentView(this);
            }
            this.onInsertChildNode(childNode, targetNode);
            if (childView !== void 0) {
                this.onInsertChildView(childView, targetView);
            }
            this.didInsertChildNode(childNode, targetNode);
            if (childView !== void 0) {
                this.didInsertChildView(childView, targetView);
            }
        };
        NodeView.prototype.injectChildView = function (childView, targetView) {
            var childNode = childView._node;
            var targetNode = targetView ? targetView._node : null;
            this.willInsertChildView(childView, targetView);
            this.willInsertChildNode(childNode, targetNode);
            childView.setParentView(this);
            this.onInsertChildNode(childNode, targetNode);
            this.onInsertChildView(childView, targetView);
            this.didInsertChildNode(childNode, targetNode);
            this.didInsertChildView(childView, targetView);
        };
        NodeView.prototype.willInsertChildNode = function (childNode, targetNode) {
            this.willObserve(function (viewObserver) {
                if (viewObserver.viewWillInsertChildNode) {
                    viewObserver.viewWillInsertChildNode(childNode, targetNode, this);
                }
            });
        };
        NodeView.prototype.onInsertChildNode = function (childNode, targetNode) {
        };
        NodeView.prototype.didInsertChildNode = function (childNode, targetNode) {
            this.didObserve(function (viewObserver) {
                if (viewObserver.viewDidInsertChildNode) {
                    viewObserver.viewDidInsertChildNode(childNode, targetNode, this);
                }
            });
        };
        NodeView.prototype.removeChild = function (child) {
            if (child instanceof View) {
                this.removeChildView(child);
            }
            else if (child instanceof Node) {
                this.removeChildNode(child);
            }
            else {
                throw new TypeError("" + child);
            }
        };
        NodeView.prototype.removeChildView = function (childView) {
            if (!(childView instanceof NodeView)) {
                throw new TypeError("" + childView);
            }
            var childNode = childView._node;
            this.willRemoveChildView(childView);
            this.willRemoveChildNode(childNode);
            childView.setParentView(null);
            this._node.removeChild(childNode);
            this.onRemoveChildNode(childNode);
            this.onRemoveChildView(childView);
            this.didRemoveChildNode(childNode);
            this.didRemoveChildView(childView);
        };
        NodeView.prototype.removeChildNode = function (childNode) {
            var childView = childNode.view;
            if (childView !== void 0) {
                this.willRemoveChildView(childView);
            }
            this.willRemoveChildNode(childNode);
            this._node.removeChild(childNode);
            if (childView !== void 0) {
                childView.setParentView(null);
            }
            this.onRemoveChildNode(childNode);
            if (childView !== void 0) {
                this.onRemoveChildView(childView);
            }
            this.didRemoveChildNode(childNode);
            if (childView !== void 0) {
                this.didRemoveChildView(childView);
            }
        };
        NodeView.prototype.removeAll = function () {
            do {
                var childNode = this._node.lastChild;
                if (childNode) {
                    var childView = childNode.view;
                    if (childView !== void 0) {
                        this.willRemoveChildView(childView);
                    }
                    this.willRemoveChildNode(childNode);
                    this._node.removeChild(childNode);
                    if (childView !== void 0) {
                        childView.setParentView(null);
                    }
                    this.onRemoveChildNode(childNode);
                    if (childView !== void 0) {
                        this.onRemoveChildView(childView);
                    }
                    this.didRemoveChildNode(childNode);
                    if (childView !== void 0) {
                        this.didRemoveChildView(childView);
                    }
                    continue;
                }
                break;
            } while (true);
        };
        NodeView.prototype.remove = function () {
            var node = this._node;
            var parentNode = node.parentNode;
            if (parentNode) {
                var parentView = parentNode.view;
                if (parentView) {
                    parentView.removeChildView(this);
                }
                else {
                    parentNode.removeChild(node);
                    this.setParentView(null);
                }
            }
        };
        NodeView.prototype.willRemoveChildNode = function (childNode) {
            this.willObserve(function (viewObserver) {
                if (viewObserver.viewWillRemoveChildNode) {
                    viewObserver.viewWillRemoveChildNode(childNode, this);
                }
            });
        };
        NodeView.prototype.onRemoveChildNode = function (childNode) {
        };
        NodeView.prototype.didRemoveChildNode = function (childNode) {
            this.didObserve(function (viewObserver) {
                if (viewObserver.viewDidRemoveChildNode) {
                    viewObserver.viewDidRemoveChildNode(childNode, this);
                }
            });
        };
        NodeView.prototype.text = function (value) {
            if (value === void 0) {
                return this._node.textContent;
            }
            else {
                this._node.textContent = value;
                return this;
            }
        };
        NodeView.prototype.isMounted = function () {
            var node = this._node;
            do {
                var parentNode = node.parentNode;
                if (parentNode) {
                    if (parentNode.nodeType === Node.DOCUMENT_NODE) {
                        return true;
                    }
                    node = parentNode;
                    continue;
                }
                break;
            } while (true);
            return false;
        };
        NodeView.prototype.cascadeMount = function () {
            this.willMount();
            this.onMount();
            var childNodes = this._node.childNodes;
            for (var i = 0, n = childNodes.length; i < n; i += 1) {
                var childView = childNodes[i].view;
                if (childView) {
                    childView.cascadeMount();
                }
            }
            this.didMount();
        };
        NodeView.prototype.cascadeUnmount = function () {
            this.willUnmount();
            this.onUnmount();
            var childNodes = this._node.childNodes;
            for (var i = 0, n = childNodes.length; i < n; i += 1) {
                var childView = childNodes[i].view;
                if (childView) {
                    childView.cascadeUnmount();
                }
            }
            this.didUnmount();
        };
        NodeView.prototype.cascadeResize = function () {
            this.willResize();
            this.onResize();
            var childNodes = this._node.childNodes;
            for (var i = 0, n = childNodes.length; i < n; i += 1) {
                var childView = childNodes[i].view;
                if (childView) {
                    childView.cascadeResize();
                }
            }
            this.didResize();
        };
        NodeView.prototype.cascadeLayout = function () {
            this.willLayout();
            this.onLayout();
            var childNodes = this._node.childNodes;
            for (var i = 0, n = childNodes.length; i < n; i += 1) {
                var childView = childNodes[i].view;
                if (childView) {
                    childView.cascadeLayout();
                }
            }
            this.didLayout();
        };
        NodeView.prototype.cascadeScroll = function () {
            this.willScroll();
            this.onScroll();
            var childNodes = this._node.childNodes;
            for (var i = 0, n = childNodes.length; i < n; i += 1) {
                var childView = childNodes[i].view;
                if (childView) {
                    childView.cascadeScroll();
                }
            }
            this.didScroll();
        };
        NodeView.prototype.animate = function (force) {
            if (force === void 0) { force = false; }
            if (!this._animationFrame && !force) {
                this._animationFrame = requestAnimationFrame(this.onAnimationFrame);
            }
            else if (force) {
                if (this._animationFrame) {
                    cancelAnimationFrame(this._animationFrame);
                }
                this.onAnimationFrame(performance.now());
            }
        };
        NodeView.prototype.onAnimationFrame = function (timestamp) {
            this._animationFrame = 0;
            this.cascadeAnimate(timestamp);
        };
        NodeView.prototype.cascadeAnimate = function (frame) {
            this.willAnimate(frame);
            this.onAnimate(frame);
            this.didAnimate(frame);
        };
        NodeView.prototype.willAnimate = function (frame) {
            this.willObserve(function (viewObserver) {
                if (viewObserver.viewWillAnimate) {
                    viewObserver.viewWillAnimate(frame, this);
                }
            });
        };
        NodeView.prototype.onAnimate = function (frame) {
        };
        NodeView.prototype.didAnimate = function (frame) {
            this.didObserve(function (viewObserver) {
                if (viewObserver.viewDidAnimate) {
                    viewObserver.viewDidAnimate(frame, this);
                }
            });
            this.setDirty(false);
        };
        Object.defineProperty(NodeView.prototype, "dirty", {
            get: function () {
                return this._dirty;
            },
            enumerable: true,
            configurable: true
        });
        NodeView.prototype.setDirty = function (dirty) {
            if (dirty && !this._dirty) {
                this._dirty = true;
                this.didSetDirty(true);
            }
            else if (!dirty && this._dirty) {
                this._dirty = false;
                this.didSetDirty(false);
            }
        };
        NodeView.prototype.didSetDirty = function (dirty) {
            if (dirty) {
                this.animate();
            }
        };
        Object.defineProperty(NodeView.prototype, "parentTransform", {
            get: function () {
                return Transform.identity();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NodeView.prototype, "clientBounds", {
            get: function () {
                var range = document.createRange();
                range.selectNode(this._node);
                var bounds = range.getBoundingClientRect();
                range.detach();
                return new math.BoxR2(bounds.left, bounds.top, bounds.right, bounds.bottom);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NodeView.prototype, "pageBounds", {
            get: function () {
                var range = document.createRange();
                range.selectNode(this._node);
                var bounds = range.getBoundingClientRect();
                range.detach();
                var scrollX = window.pageXOffset;
                var scrollY = window.pageYOffset;
                return new math.BoxR2(bounds.left + scrollX, bounds.top + scrollY, bounds.right + scrollX, bounds.bottom + scrollY);
            },
            enumerable: true,
            configurable: true
        });
        NodeView.prototype.dispatchEvent = function (event) {
            return this._node.dispatchEvent(event);
        };
        NodeView.prototype.on = function (type, listener, options) {
            this._node.addEventListener(type, listener, options);
            return this;
        };
        NodeView.prototype.off = function (type, listener, options) {
            this._node.removeEventListener(type, listener, options);
            return this;
        };
        return NodeView;
    }(View));
    View.Node = NodeView;

    var ElementView = (function (_super) {
        __extends(ElementView, _super);
        function ElementView(node, key) {
            if (key === void 0) { key = null; }
            return _super.call(this, node, key) || this;
        }
        Object.defineProperty(ElementView.prototype, "node", {
            get: function () {
                return this._node;
            },
            enumerable: true,
            configurable: true
        });
        ElementView.prototype.initNode = function (node) {
        };
        Object.defineProperty(ElementView.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: true,
            configurable: true
        });
        ElementView.prototype.getAttribute = function (name) {
            return this._node.getAttribute(name);
        };
        ElementView.prototype.setAttribute = function (name, value) {
            this.willSetAttribute(name, value);
            if (value !== null) {
                this._node.setAttribute(name, AttributeString(value));
            }
            else {
                this._node.removeAttribute(name);
            }
            this.onSetAttribute(name, value);
            this.didSetAttribute(name, value);
            return this;
        };
        ElementView.prototype.willSetAttribute = function (name, value) {
            this.willObserve(function (viewObserver) {
                if (viewObserver.viewWillSetAttribute) {
                    viewObserver.viewWillSetAttribute(name, value, this);
                }
            });
        };
        ElementView.prototype.onSetAttribute = function (name, value) {
        };
        ElementView.prototype.didSetAttribute = function (name, value) {
            this.didObserve(function (viewObserver) {
                if (viewObserver.viewDidSetAttribute) {
                    viewObserver.viewDidSetAttribute(name, value, this);
                }
            });
        };
        ElementView.prototype.setStyle = function (name, value, priority) {
            this.willSetStyle(name, value, priority);
            this._node.style.setProperty(name, StyleString(value), priority);
            this.onSetStyle(name, value, priority);
            this.didSetStyle(name, value, priority);
            return this;
        };
        ElementView.prototype.willSetStyle = function (name, value, priority) {
            this.willObserve(function (viewObserver) {
                if (viewObserver.viewWillSetStyle) {
                    viewObserver.viewWillSetStyle(name, value, priority, this);
                }
            });
        };
        ElementView.prototype.onSetStyle = function (name, value, priority) {
        };
        ElementView.prototype.didSetStyle = function (name, value, priority) {
            this.didObserve(function (viewObserver) {
                if (viewObserver.viewDidSetStyle) {
                    viewObserver.viewDidSetStyle(name, value, priority, this);
                }
            });
        };
        ElementView.prototype.id = function (value) {
            if (value === void 0) {
                return this.getAttribute("id");
            }
            else {
                this.setAttribute("id", value);
                return this;
            }
        };
        ElementView.prototype.className = function (value) {
            if (value === void 0) {
                return this.getAttribute("class");
            }
            else {
                this.setAttribute("class", value);
                return this;
            }
        };
        Object.defineProperty(ElementView.prototype, "classList", {
            get: function () {
                return this._node.classList;
            },
            enumerable: true,
            configurable: true
        });
        ElementView.prototype.hasClass = function (className) {
            return this._node.classList.contains(className);
        };
        ElementView.prototype.addClass = function () {
            var classNames = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                classNames[_i] = arguments[_i];
            }
            var classList = this._node.classList;
            for (var i = 0, n = classNames.length; i < n; i += 1) {
                classList.add(classNames[i]);
            }
            return this;
        };
        ElementView.prototype.removeClass = function () {
            var classNames = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                classNames[_i] = arguments[_i];
            }
            var classList = this._node.classList;
            for (var i = 0, n = classNames.length; i < n; i += 1) {
                classList.remove(classNames[i]);
            }
            return this;
        };
        ElementView.prototype.toggleClass = function (className, state) {
            var classList = this._node.classList;
            if (state === void 0) {
                classList.toggle(className);
            }
            else if (state === true) {
                classList.add(className);
            }
            else if (state === false) {
                classList.remove(className);
            }
            return this;
        };
        Object.defineProperty(ElementView.prototype, "clientBounds", {
            get: function () {
                var bounds = this._node.getBoundingClientRect();
                return new math.BoxR2(bounds.left, bounds.top, bounds.right, bounds.bottom);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ElementView.prototype, "pageBounds", {
            get: function () {
                var bounds = this._node.getBoundingClientRect();
                var scrollX = window.pageXOffset;
                var scrollY = window.pageYOffset;
                return new math.BoxR2(bounds.left + scrollX, bounds.top + scrollY, bounds.right + scrollX, bounds.bottom + scrollY);
            },
            enumerable: true,
            configurable: true
        });
        ElementView.prototype.on = function (type, listener, options) {
            this._node.addEventListener(type, listener, options);
            return this;
        };
        ElementView.prototype.off = function (type, listener, options) {
            this._node.removeEventListener(type, listener, options);
            return this;
        };
        ElementView.decorateAttributeAnimator = function (AttributeAnimator, name, target, key) {
            Object.defineProperty(target, key, {
                get: function () {
                    var animator = new AttributeAnimator(this, name);
                    Object.defineProperty(animator, "name", {
                        value: key,
                        enumerable: true,
                        configurable: true,
                    });
                    Object.defineProperty(this, key, {
                        value: animator,
                        configurable: true,
                        enumerable: true,
                    });
                    return animator;
                },
                configurable: true,
                enumerable: true,
            });
        };
        ElementView.decorateStyleAnimator = function (StyleAnimator, names, target, key) {
            Object.defineProperty(target, key, {
                get: function () {
                    var animator = new StyleAnimator(this, names);
                    Object.defineProperty(animator, "name", {
                        value: key,
                        enumerable: true,
                        configurable: true,
                    });
                    Object.defineProperty(this, key, {
                        value: animator,
                        configurable: true,
                        enumerable: true,
                    });
                    return animator;
                },
                configurable: true,
                enumerable: true,
            });
        };
        return ElementView;
    }(NodeView));
    View.Element = ElementView;

    var AttributeAnimator = (function (_super) {
        var AttributeAnimator = function (view, name, value, transition) {
            if (this instanceof AttributeAnimator) {
                if (transition === void 0) {
                    transition = null;
                }
                var _this = _super.call(this, value, transition) || this;
                _this._view = view;
                _this._name = name;
                return _this;
            }
            else {
                var type = name;
                name = view;
                if (type === String) {
                    return ElementView.decorateAttributeAnimator.bind(void 0, AttributeAnimator.String, name);
                }
                else if (type === Boolean) {
                    return ElementView.decorateAttributeAnimator.bind(void 0, AttributeAnimator.Boolean, name);
                }
                else if (type === Number) {
                    return ElementView.decorateAttributeAnimator.bind(void 0, AttributeAnimator.Number, name);
                }
                else if (type === Length) {
                    return ElementView.decorateAttributeAnimator.bind(void 0, AttributeAnimator.Length, name);
                }
                else if (type === Color) {
                    return ElementView.decorateAttributeAnimator.bind(void 0, AttributeAnimator.Color, name);
                }
                else if (type === Transform) {
                    return ElementView.decorateAttributeAnimator.bind(void 0, AttributeAnimator.Transform, name);
                }
                else if (Array.isArray(type) && type.length === 2) {
                    var type0 = type[0], type1 = type[1];
                    if (type0 === Number && type1 === String) {
                        return ElementView.decorateAttributeAnimator.bind(void 0, AttributeAnimator.NumberOrString, name);
                    }
                    else if (type0 === Length && type1 === String) {
                        return ElementView.decorateAttributeAnimator.bind(void 0, AttributeAnimator.LengthOrString, name);
                    }
                    else if (type0 === Color && type1 === String) {
                        return ElementView.decorateAttributeAnimator.bind(void 0, AttributeAnimator.ColorOrString, name);
                    }
                }
                throw new TypeError("" + type);
            }
        };
        __extends(AttributeAnimator, _super);
        Object.defineProperty(AttributeAnimator.prototype, "view", {
            get: function () {
                return this._view;
            },
            enumerable: true,
            configurable: true,
        });
        Object.defineProperty(AttributeAnimator.prototype, "node", {
            get: function () {
                return this._view._node;
            },
            enumerable: true,
            configurable: true,
        });
        Object.defineProperty(AttributeAnimator.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true,
        });
        Object.defineProperty(AttributeAnimator.prototype, "attributeValue", {
            get: function () {
                return this._view._node.getAttribute(this._name);
            },
            enumerable: true,
            configurable: true,
        });
        AttributeAnimator.prototype.update = function (newValue, oldValue) {
            if (!util.Objects.equal(oldValue, newValue)) {
                this.willUpdate(newValue, oldValue);
                this._view.setAttribute(this._name, newValue);
                this.didUpdate(newValue, oldValue);
            }
        };
        AttributeAnimator.prototype.willUpdate = function (newValue, oldValue) {
        };
        AttributeAnimator.prototype.didUpdate = function (newValue, oldValue) {
        };
        AttributeAnimator.prototype.delete = function () {
            this._view._node.removeAttribute(this._name);
        };
        return AttributeAnimator;
    }(TweenFrameAnimator));

    var StringAttributeAnimator = (function (_super) {
        var StringAttributeAnimator = function (view, name, value, transition) {
            var _this = function (value, tween) {
                if (value === void 0) {
                    return _this.value;
                }
                else {
                    _this.setState(value, tween);
                    return _this._view;
                }
            };
            _this.__proto__ = this;
            _this = _super.call(_this, view, name, value, transition) || _this;
            return _this;
        };
        __extends(StringAttributeAnimator, _super);
        Object.defineProperty(StringAttributeAnimator.prototype, "value", {
            get: function () {
                var value = this._value;
                if (value === void 0) {
                    var attributeValue = this.attributeValue;
                    if (attributeValue) {
                        value = attributeValue;
                    }
                }
                return value;
            },
            enumerable: true,
            configurable: true,
        });
        return StringAttributeAnimator;
    }(AttributeAnimator));
    AttributeAnimator.String = StringAttributeAnimator;

    var BooleanAttributeAnimator = (function (_super) {
        var BooleanAttributeAnimator = function (view, name, value, transition) {
            var _this = function (value, tween) {
                if (value === void 0) {
                    return _this.value;
                }
                else {
                    if (typeof value === "string") {
                        value = value ? true : false;
                    }
                    _this.setState(value, tween);
                    return _this._view;
                }
            };
            _this.__proto__ = this;
            _this = _super.call(_this, view, name, value, transition) || _this;
            return _this;
        };
        __extends(BooleanAttributeAnimator, _super);
        Object.defineProperty(BooleanAttributeAnimator.prototype, "value", {
            get: function () {
                var value = this._value;
                if (value === void 0) {
                    var attributeValue = this.attributeValue;
                    if (attributeValue) {
                        value = !!attributeValue;
                    }
                }
                return value;
            },
            enumerable: true,
            configurable: true,
        });
        return BooleanAttributeAnimator;
    }(AttributeAnimator));
    AttributeAnimator.Boolean = BooleanAttributeAnimator;

    var NumberAttributeAnimator = (function (_super) {
        var NumberAttributeAnimator = function (view, name, value, transition) {
            var _this = function (value, tween) {
                if (value === void 0) {
                    return _this.value;
                }
                else {
                    if (typeof value === "string") {
                        value = +value;
                    }
                    _this.setState(value, tween);
                    return _this._view;
                }
            };
            _this.__proto__ = this;
            _this = _super.call(_this, view, name, value, transition) || _this;
            return _this;
        };
        __extends(NumberAttributeAnimator, _super);
        Object.defineProperty(NumberAttributeAnimator.prototype, "value", {
            get: function () {
                var value = this._value;
                if (value === void 0) {
                    var attributeValue = this.attributeValue;
                    if (attributeValue) {
                        value = +attributeValue;
                    }
                }
                return value;
            },
            enumerable: true,
            configurable: true,
        });
        return NumberAttributeAnimator;
    }(AttributeAnimator));
    AttributeAnimator.Number = NumberAttributeAnimator;

    var LengthAttributeAnimator = (function (_super) {
        var LengthAttributeAnimator = function (view, name, value, transition) {
            var _this = function (value, tween) {
                if (value === void 0) {
                    return _this.value;
                }
                else {
                    if (value !== null) {
                        value = Length.fromAny(value, _this._view._node);
                    }
                    _this.setState(value, tween);
                    return _this._view;
                }
            };
            _this.__proto__ = this;
            _this = _super.call(_this, view, name, value, transition) || _this;
            return _this;
        };
        __extends(LengthAttributeAnimator, _super);
        Object.defineProperty(LengthAttributeAnimator.prototype, "value", {
            get: function () {
                var value = this._value;
                if (value === void 0) {
                    var attributeValue = this.attributeValue;
                    if (attributeValue) {
                        try {
                            value = Length.parse(attributeValue, this._view._node);
                        }
                        catch (swallow) {
                        }
                    }
                }
                return value;
            },
            enumerable: true,
            configurable: true,
        });
        return LengthAttributeAnimator;
    }(AttributeAnimator));
    AttributeAnimator.Length = LengthAttributeAnimator;

    var ColorAttributeAnimator = (function (_super) {
        var ColorAttributeAnimator = function (view, name, value, transition) {
            var _this = function (value, tween) {
                if (value === void 0) {
                    return _this.value;
                }
                else {
                    if (value !== null) {
                        value = Color.fromAny(value);
                    }
                    _this.setState(value, tween);
                    return _this._view;
                }
            };
            _this.__proto__ = this;
            _this = _super.call(_this, view, name, value, transition) || _this;
            return _this;
        };
        __extends(ColorAttributeAnimator, _super);
        Object.defineProperty(ColorAttributeAnimator.prototype, "value", {
            get: function () {
                var value = this._value;
                if (value === void 0) {
                    var attributeValue = this.attributeValue;
                    if (attributeValue) {
                        try {
                            value = Color.parse(attributeValue);
                        }
                        catch (swallow) {
                        }
                    }
                }
                return value;
            },
            enumerable: true,
            configurable: true,
        });
        return ColorAttributeAnimator;
    }(AttributeAnimator));
    AttributeAnimator.Color = ColorAttributeAnimator;

    var TransformAttributeAnimator = (function (_super) {
        var TransformAttributeAnimator = function (view, name, value, transition) {
            var _this = function (value, tween) {
                if (value === void 0) {
                    return _this.value;
                }
                else {
                    if (value !== null) {
                        value = Transform.fromAny(value);
                    }
                    _this.setState(value, tween);
                    return _this._view;
                }
            };
            _this.__proto__ = this;
            _this = _super.call(_this, view, name, value, transition) || _this;
            return _this;
        };
        __extends(TransformAttributeAnimator, _super);
        Object.defineProperty(TransformAttributeAnimator.prototype, "value", {
            get: function () {
                var value = this._value;
                if (value === void 0) {
                    var attributeValue = this.attributeValue;
                    if (attributeValue) {
                        try {
                            value = Transform.parse(attributeValue);
                        }
                        catch (swallow) {
                        }
                    }
                }
                return value;
            },
            enumerable: true,
            configurable: true,
        });
        return TransformAttributeAnimator;
    }(AttributeAnimator));
    AttributeAnimator.Transform = TransformAttributeAnimator;

    var NumberOrStringAttributeAnimator = (function (_super) {
        var NumberOrStringAttributeAnimator = function (view, name, value, transition) {
            var _this = function (value, tween) {
                if (value === void 0) {
                    return _this.value;
                }
                else {
                    if (typeof value === "string" && isFinite(+value)) {
                        value = +value;
                    }
                    _this.setState(value, tween);
                    return _this._view;
                }
            };
            _this.__proto__ = this;
            _this = _super.call(_this, view, name, value, transition) || _this;
            return _this;
        };
        __extends(NumberOrStringAttributeAnimator, _super);
        Object.defineProperty(NumberOrStringAttributeAnimator.prototype, "value", {
            get: function () {
                var value = this._value;
                if (value === void 0) {
                    var attributeValue = this.attributeValue;
                    if (attributeValue) {
                        if (isFinite(+attributeValue)) {
                            value = +attributeValue;
                        }
                        else {
                            value = attributeValue;
                        }
                    }
                }
                return value;
            },
            enumerable: true,
            configurable: true,
        });
        return NumberOrStringAttributeAnimator;
    }(AttributeAnimator));
    AttributeAnimator.NumberOrString = NumberOrStringAttributeAnimator;

    var LengthOrStringAttributeAnimator = (function (_super) {
        var LengthOrStringAttributeAnimator = function (view, name, value, transition) {
            var _this = function (value, tween) {
                if (value === void 0) {
                    return _this.value;
                }
                else {
                    if (value !== null) {
                        if (typeof value === "string") {
                            try {
                                value = Length.parse(value, _this._view._node);
                            }
                            catch (swallow) {
                            }
                        }
                        else {
                            value = Length.fromAny(value, _this._view._node);
                        }
                    }
                    _this.setState(value, tween);
                    return _this._view;
                }
            };
            _this.__proto__ = this;
            _this = _super.call(_this, view, name, value, transition) || _this;
            return _this;
        };
        __extends(LengthOrStringAttributeAnimator, _super);
        Object.defineProperty(LengthOrStringAttributeAnimator.prototype, "value", {
            get: function () {
                var value = this._value;
                if (value === void 0) {
                    var attributeValue = this.attributeValue;
                    if (attributeValue) {
                        try {
                            value = Length.parse(attributeValue, this._view._node);
                        }
                        catch (swallow) {
                            value = attributeValue;
                        }
                    }
                }
                return value;
            },
            enumerable: true,
            configurable: true,
        });
        return LengthOrStringAttributeAnimator;
    }(AttributeAnimator));
    AttributeAnimator.LengthOrString = LengthOrStringAttributeAnimator;

    var ColorOrStringAttributeAnimator = (function (_super) {
        var ColorOrStringAttributeAnimator = function (view, name, value, transition) {
            var _this = function (value, tween) {
                if (value === void 0) {
                    return _this.value;
                }
                else {
                    if (value !== null) {
                        if (typeof value === "string") {
                            try {
                                value = Color.parse(value);
                            }
                            catch (swallow) {
                            }
                        }
                        else {
                            value = Color.fromAny(value);
                        }
                    }
                    _this.setState(value, tween);
                    return _this._view;
                }
            };
            _this.__proto__ = this;
            _this = _super.call(_this, view, name, value, transition) || _this;
            return _this;
        };
        __extends(ColorOrStringAttributeAnimator, _super);
        Object.defineProperty(ColorOrStringAttributeAnimator.prototype, "value", {
            get: function () {
                var value = this._value;
                if (value === void 0) {
                    var attributeValue = this.attributeValue;
                    if (attributeValue) {
                        try {
                            value = Color.parse(attributeValue);
                        }
                        catch (swallow) {
                            value = attributeValue;
                        }
                    }
                }
                return value;
            },
            enumerable: true,
            configurable: true,
        });
        return ColorOrStringAttributeAnimator;
    }(AttributeAnimator));
    AttributeAnimator.ColorOrString = ColorOrStringAttributeAnimator;

    var StyleAnimator = (function (_super) {
        var StyleAnimator = function (view, names, value, transition, priority) {
            if (this instanceof StyleAnimator) {
                if (transition === void 0) {
                    transition = null;
                }
                var _this = _super.call(this, value, transition) || this;
                _this._view = view;
                _this._names = names;
                _this._priority = priority;
                return _this;
            }
            else {
                var type = names;
                names = view;
                if (type === String) {
                    return ElementView.decorateStyleAnimator.bind(void 0, StyleAnimator.String, names);
                }
                else if (type === Number) {
                    return ElementView.decorateStyleAnimator.bind(void 0, StyleAnimator.Number, names);
                }
                else if (type === Length) {
                    return ElementView.decorateStyleAnimator.bind(void 0, StyleAnimator.Length, names);
                }
                else if (type === Color) {
                    return ElementView.decorateStyleAnimator.bind(void 0, StyleAnimator.Color, names);
                }
                else if (type === LineHeight) {
                    return ElementView.decorateStyleAnimator.bind(void 0, StyleAnimator.LineHeight, names);
                }
                else if (type === FontFamily) {
                    return ElementView.decorateStyleAnimator.bind(void 0, StyleAnimator.FontFamily, names);
                }
                else if (type === Transform) {
                    return ElementView.decorateStyleAnimator.bind(void 0, StyleAnimator.Transform, names);
                }
                else if (type === BoxShadow) {
                    return ElementView.decorateStyleAnimator.bind(void 0, StyleAnimator.BoxShadow, names);
                }
                else if (Array.isArray(type) && type.length === 2) {
                    var type0 = type[0], type1 = type[1];
                    if (type0 === Number && type1 === String) {
                        return ElementView.decorateStyleAnimator.bind(void 0, StyleAnimator.NumberOrString, names);
                    }
                    else if (type0 === Length && type1 === String) {
                        return ElementView.decorateStyleAnimator.bind(void 0, StyleAnimator.LengthOrString, names);
                    }
                    else if (type0 === Color && type1 === String) {
                        return ElementView.decorateStyleAnimator.bind(void 0, StyleAnimator.ColorOrString, names);
                    }
                }
                throw new TypeError("" + type);
            }
        };
        __extends(StyleAnimator, _super);
        Object.defineProperty(StyleAnimator.prototype, "view", {
            get: function () {
                return this._view;
            },
            enumerable: true,
            configurable: true,
        });
        Object.defineProperty(StyleAnimator.prototype, "node", {
            get: function () {
                return this._view._node;
            },
            enumerable: true,
            configurable: true,
        });
        Object.defineProperty(StyleAnimator.prototype, "names", {
            get: function () {
                return this._names;
            },
            enumerable: true,
            configurable: true,
        });
        Object.defineProperty(StyleAnimator.prototype, "priority", {
            get: function () {
                return this._priority;
            },
            set: function (value) {
                this._priority = value;
            },
            enumerable: true,
            configurable: true,
        });
        Object.defineProperty(StyleAnimator.prototype, "propertyValue", {
            get: function () {
                var style = this._view._node.style;
                var names = this._names;
                if (typeof names === "string") {
                    return style.getPropertyValue(names);
                }
                else {
                    for (var i = 0, n = names.length; i < n; i += 1) {
                        var value = style.getPropertyValue(names[i]);
                        if (value) {
                            return value;
                        }
                    }
                    return "";
                }
            },
            enumerable: true,
            configurable: true,
        });
        StyleAnimator.prototype.setState = function (state, tween, priority) {
            if (typeof priority === "string") {
                this.priority = priority;
            }
            else if (priority === null) {
                this.priority = void 0;
            }
            _super.prototype.setState.call(this, state, tween);
        };
        StyleAnimator.prototype.update = function (newValue, oldValue) {
            if (!util.Objects.equal(oldValue, newValue)) {
                this.willUpdate(newValue, oldValue);
                var names = this._names;
                if (typeof names === "string") {
                    this._view.setStyle(names, newValue, this.priority);
                }
                else {
                    for (var i = 0, n = names.length; i < n; i += 1) {
                        this._view.setStyle(names[i], newValue, this.priority);
                    }
                }
                this.didUpdate(newValue, oldValue);
            }
        };
        StyleAnimator.prototype.willUpdate = function (newValue, oldValue) {
        };
        StyleAnimator.prototype.didUpdate = function (newValue, oldValue) {
        };
        StyleAnimator.prototype.delete = function () {
            var style = this._view._node.style;
            var names = this._names;
            if (typeof names === "string") {
                style.removeProperty(names);
            }
            else {
                for (var i = 0, n = names.length; i < n; i += 1) {
                    style.removeProperty(names[i]);
                }
            }
        };
        return StyleAnimator;
    }(TweenFrameAnimator));

    var StringStyleAnimator = (function (_super) {
        var StringStyleAnimator = function (view, names, value, transition, priority) {
            var _this = function (value, tween, priority) {
                if (value === void 0) {
                    return _this.value;
                }
                else {
                    _this.setState(value, tween, priority);
                    return _this._view;
                }
            };
            _this.__proto__ = this;
            _this = _super.call(_this, view, names, value, transition, priority) || _this;
            return _this;
        };
        __extends(StringStyleAnimator, _super);
        Object.defineProperty(StringStyleAnimator.prototype, "value", {
            get: function () {
                var value = this._value;
                if (value === void 0) {
                    var propertyValue = this.propertyValue;
                    if (propertyValue) {
                        value = propertyValue;
                    }
                }
                return value;
            },
            enumerable: true,
            configurable: true,
        });
        return StringStyleAnimator;
    }(StyleAnimator));
    StyleAnimator.String = StringStyleAnimator;

    var NumberStyleAnimator = (function (_super) {
        var NumberStyleAnimator = function (view, names, value, transition, priority) {
            var _this = function (value, tween, priority) {
                if (value === void 0) {
                    return _this.value;
                }
                else {
                    if (typeof value === "string") {
                        value = +value;
                    }
                    _this.setState(value, tween, priority);
                    return _this._view;
                }
            };
            _this.__proto__ = this;
            _this = _super.call(_this, view, names, value, transition, priority) || _this;
            return _this;
        };
        __extends(NumberStyleAnimator, _super);
        Object.defineProperty(NumberStyleAnimator.prototype, "value", {
            get: function () {
                var value = this._value;
                if (value === void 0) {
                    var propertyValue = this.propertyValue;
                    if (propertyValue) {
                        value = +propertyValue;
                    }
                }
                return value;
            },
            enumerable: true,
            configurable: true,
        });
        return NumberStyleAnimator;
    }(StyleAnimator));
    StyleAnimator.Number = NumberStyleAnimator;

    var LengthStyleAnimator = (function (_super) {
        var LengthStyleAnimator = function (view, names, value, transition, priority) {
            var _this = function (value, tween, priority) {
                if (value === void 0) {
                    return _this.value;
                }
                else {
                    if (value !== null) {
                        value = Length.fromAny(value, view._node);
                    }
                    _this.setState(value, tween, priority);
                    return _this._view;
                }
            };
            _this.__proto__ = this;
            _this = _super.call(_this, view, names, value, transition, priority) || _this;
            return _this;
        };
        __extends(LengthStyleAnimator, _super);
        Object.defineProperty(LengthStyleAnimator.prototype, "value", {
            get: function () {
                var value = this._value;
                if (value === void 0) {
                    var propertyValue = this.propertyValue;
                    if (propertyValue) {
                        try {
                            value = Length.parse(propertyValue, this._view._node);
                        }
                        catch (swallow) {
                        }
                    }
                }
                return value;
            },
            enumerable: true,
            configurable: true,
        });
        return LengthStyleAnimator;
    }(StyleAnimator));
    StyleAnimator.Length = LengthStyleAnimator;

    var ColorStyleAnimator = (function (_super) {
        var ColorStyleAnimator = function (view, names, value, transition, priority) {
            var _this = function (value, tween, priority) {
                if (value === void 0) {
                    return _this.value;
                }
                else {
                    if (value !== null) {
                        value = Color.fromAny(value);
                    }
                    _this.setState(value, tween, priority);
                    return _this._view;
                }
            };
            _this.__proto__ = this;
            _this = _super.call(_this, view, names, value, transition, priority) || _this;
            return _this;
        };
        __extends(ColorStyleAnimator, _super);
        Object.defineProperty(ColorStyleAnimator.prototype, "value", {
            get: function () {
                var value = this._value;
                if (value === void 0) {
                    var propertyValue = this.propertyValue;
                    if (propertyValue) {
                        try {
                            value = Color.parse(propertyValue);
                        }
                        catch (swallow) {
                        }
                    }
                }
                return value;
            },
            enumerable: true,
            configurable: true,
        });
        return ColorStyleAnimator;
    }(StyleAnimator));
    StyleAnimator.Color = ColorStyleAnimator;

    var LineHeightStyleAnimator = (function (_super) {
        var LineHeightStyleAnimator = function (view, names, value, transition, priority) {
            var _this = function (value, tween, priority) {
                if (value === void 0) {
                    return _this.value;
                }
                else {
                    if (value !== null) {
                        value = LineHeight.fromAny(value);
                    }
                    _this.setState(value, tween, priority);
                    return _this._view;
                }
            };
            _this.__proto__ = this;
            _this = _super.call(_this, view, names, value, transition, priority) || _this;
            return _this;
        };
        __extends(LineHeightStyleAnimator, _super);
        Object.defineProperty(LineHeightStyleAnimator.prototype, "value", {
            get: function () {
                var value = this._value;
                if (value === void 0) {
                    var propertyValue = this.propertyValue;
                    if (propertyValue) {
                        try {
                            value = LineHeight.fromAny(propertyValue);
                        }
                        catch (swallow) {
                        }
                    }
                }
                return value;
            },
            enumerable: true,
            configurable: true,
        });
        return LineHeightStyleAnimator;
    }(StyleAnimator));
    StyleAnimator.LineHeight = LineHeightStyleAnimator;

    var FontFamilyStyleAnimator = (function (_super) {
        var FontFamilyStyleAnimator = function (view, names, value, transition, priority) {
            var _this = function (value, tween, priority) {
                if (value === void 0) {
                    return _this.value;
                }
                else {
                    if (value !== null) {
                        value = Font.family(value).family();
                    }
                    _this.setState(value, tween, priority);
                    return _this._view;
                }
            };
            _this.__proto__ = this;
            _this = _super.call(_this, view, names, value, transition, priority) || _this;
            return _this;
        };
        __extends(FontFamilyStyleAnimator, _super);
        Object.defineProperty(FontFamilyStyleAnimator.prototype, "value", {
            get: function () {
                var value = this._value;
                if (value === void 0) {
                    var propertyValue = this.propertyValue;
                    if (propertyValue) {
                        try {
                            value = Font.parse(propertyValue).family();
                        }
                        catch (swallow) {
                        }
                    }
                }
                return value;
            },
            enumerable: true,
            configurable: true,
        });
        return FontFamilyStyleAnimator;
    }(StyleAnimator));
    StyleAnimator.FontFamily = FontFamilyStyleAnimator;

    var TransformStyleAnimator = (function (_super) {
        var TransformStyleAnimator = function (view, names, value, transition, priority) {
            var _this = function (value, tween, priority) {
                if (value === void 0) {
                    return _this.value;
                }
                else {
                    if (value !== null) {
                        value = Transform.fromAny(value);
                    }
                    _this.setState(value, tween, priority);
                    return _this._view;
                }
            };
            _this.__proto__ = this;
            _this = _super.call(_this, view, names, value, transition, priority) || _this;
            return _this;
        };
        __extends(TransformStyleAnimator, _super);
        Object.defineProperty(TransformStyleAnimator.prototype, "value", {
            get: function () {
                var value = this._value;
                if (value === void 0) {
                    var propertyValue = this.propertyValue;
                    if (propertyValue) {
                        try {
                            value = Transform.parse(propertyValue);
                        }
                        catch (swallow) {
                        }
                    }
                }
                return value;
            },
            enumerable: true,
            configurable: true,
        });
        return TransformStyleAnimator;
    }(StyleAnimator));
    StyleAnimator.Transform = TransformStyleAnimator;

    var BoxShadowStyleAnimator = (function (_super) {
        var BoxShadowStyleAnimator = function (view, names, value, transition, priority) {
            var _this = function (value, tween, priority) {
                if (value === void 0) {
                    return _this.value;
                }
                else {
                    if (value !== null) {
                        value = BoxShadow.fromAny(value);
                    }
                    _this.setState(value, tween, priority);
                    return _this._view;
                }
            };
            _this.__proto__ = this;
            _this = _super.call(_this, view, names, value, transition, priority) || _this;
            return _this;
        };
        __extends(BoxShadowStyleAnimator, _super);
        Object.defineProperty(BoxShadowStyleAnimator.prototype, "value", {
            get: function () {
                var value = this._value;
                if (value === void 0) {
                    var propertyValue = this.propertyValue;
                    if (propertyValue) {
                        try {
                            value = BoxShadow.parse(propertyValue);
                        }
                        catch (swallow) {
                        }
                    }
                }
                return value;
            },
            enumerable: true,
            configurable: true,
        });
        return BoxShadowStyleAnimator;
    }(StyleAnimator));
    StyleAnimator.BoxShadow = BoxShadowStyleAnimator;

    var NumberOrStringStyleAnimator = (function (_super) {
        var NumberOrStringStyleAnimator = function (view, names, value, transition, priority) {
            var _this = function (value, tween, priority) {
                if (value === void 0) {
                    return _this.value;
                }
                else {
                    if (typeof value === "string" && isFinite(+value)) {
                        value = +value;
                    }
                    _this.setState(value, tween, priority);
                    return _this._view;
                }
            };
            _this.__proto__ = this;
            _this = _super.call(_this, view, names, value, transition, priority) || _this;
            return _this;
        };
        __extends(NumberOrStringStyleAnimator, _super);
        Object.defineProperty(NumberOrStringStyleAnimator.prototype, "value", {
            get: function () {
                var value = this._value;
                if (value === void 0) {
                    var propertyValue = this.propertyValue;
                    if (propertyValue) {
                        if (isFinite(+propertyValue)) {
                            value = +propertyValue;
                        }
                        else {
                            value = propertyValue;
                        }
                    }
                }
                return value;
            },
            enumerable: true,
            configurable: true,
        });
        return NumberOrStringStyleAnimator;
    }(StyleAnimator));
    StyleAnimator.NumberOrString = NumberOrStringStyleAnimator;

    var LengthOrStringStyleAnimator = (function (_super) {
        var LengthOrStringStyleAnimator = function (view, names, value, transition, priority) {
            var _this = function (value, tween, priority) {
                if (value === void 0) {
                    return _this.value;
                }
                else {
                    if (value !== null) {
                        if (typeof value === "string") {
                            try {
                                value = Length.parse(value, _this._view._node);
                            }
                            catch (swallow) {
                            }
                        }
                        else {
                            value = Length.fromAny(value, _this._view._node);
                        }
                    }
                    _this.setState(value, tween, priority);
                    return _this._view;
                }
            };
            _this.__proto__ = this;
            _this = _super.call(_this, view, names, value, transition, priority) || _this;
            return _this;
        };
        __extends(LengthOrStringStyleAnimator, _super);
        Object.defineProperty(LengthOrStringStyleAnimator.prototype, "value", {
            get: function () {
                var value = this._value;
                if (value === void 0) {
                    var propertyValue = this.propertyValue;
                    if (propertyValue) {
                        try {
                            value = Length.parse(propertyValue, this._view._node);
                        }
                        catch (swallow) {
                            value = propertyValue;
                        }
                    }
                }
                return value;
            },
            enumerable: true,
            configurable: true,
        });
        return LengthOrStringStyleAnimator;
    }(StyleAnimator));
    StyleAnimator.LengthOrString = LengthOrStringStyleAnimator;

    var ColorOrStringStyleAnimator = (function (_super) {
        var ColorOrStringStyleAnimator = function (view, names, value, transition, priority) {
            var _this = function (value, tween, priority) {
                if (value === void 0) {
                    return _this.value;
                }
                else {
                    if (value !== null) {
                        if (typeof value === "string") {
                            try {
                                value = Color.parse(value);
                            }
                            catch (swallow) {
                            }
                        }
                        else {
                            value = Color.fromAny(value);
                        }
                    }
                    _this.setState(value, tween, priority);
                    return _this._view;
                }
            };
            _this.__proto__ = this;
            _this = _super.call(_this, view, names, value, transition, priority) || _this;
            return _this;
        };
        __extends(ColorOrStringStyleAnimator, _super);
        Object.defineProperty(ColorOrStringStyleAnimator.prototype, "value", {
            get: function () {
                var value = this._value;
                if (value === void 0) {
                    var propertyValue = this.propertyValue;
                    if (propertyValue) {
                        try {
                            value = Color.parse(propertyValue);
                        }
                        catch (swallow) {
                            value = propertyValue;
                        }
                    }
                }
                return value;
            },
            enumerable: true,
            configurable: true,
        });
        return ColorOrStringStyleAnimator;
    }(StyleAnimator));
    StyleAnimator.ColorOrString = ColorOrStringStyleAnimator;

    var LayoutManager = {
        is: function (object) {
            if (typeof object === "object" && object) {
                var view = object;
                return typeof view.throttleLayout === "function";
            }
            return false;
        },
    };

    var LayoutSolver = (function (_super) {
        __extends(LayoutSolver, _super);
        function LayoutSolver(manager) {
            var _this = _super.call(this) || this;
            _this._manager = manager;
            return _this;
        }
        Object.defineProperty(LayoutSolver.prototype, "manager", {
            get: function () {
                return this._manager;
            },
            enumerable: true,
            configurable: true
        });
        LayoutSolver.prototype.didAddConstraint = function (constraint) {
            this._manager.throttleLayout();
        };
        LayoutSolver.prototype.didRemoveConstraint = function (constraint) {
            this._manager.throttleLayout();
        };
        LayoutSolver.prototype.didAddVariable = function (variable) {
            this._manager.throttleLayout();
        };
        LayoutSolver.prototype.didRemoveVariable = function (variable) {
            this._manager.throttleLayout();
        };
        LayoutSolver.prototype.didSetVariableState = function (variable, state) {
            this._manager.throttleLayout();
        };
        return LayoutSolver;
    }(ConstraintSolver));

    var LayoutAnchor = (function (_super) {
        var LayoutAnchor = function (scope, name, value, strength) {
            if (this instanceof LayoutAnchor) {
                var _this_1 = function (state) {
                    if (state === void 0) {
                        return _this_1.state;
                    }
                    else {
                        _this_1.enabled(true).setState(state);
                        return _this_1._scope;
                    }
                };
                _this_1.__proto__ = this;
                _this_1 = _super.call(_this_1, scope, name, value, strength) || _this_1;
                _this_1._enabled = false;
                return _this_1;
            }
            else {
                strength = ConstraintStrength.fromAny(scope);
                return View.decorateLayoutAnchor.bind(void 0, LayoutAnchor, 0, strength);
            }
        };
        __extends(LayoutAnchor, _super);
        LayoutAnchor.prototype.enabled = function (enabled) {
            if (enabled === void 0) {
                return this._enabled;
            }
            else {
                this._enabled = enabled;
                return this;
            }
        };
        return LayoutAnchor;
    }(ConstrainBinding));

    var ViewController = (function () {
        function ViewController() {
            this._view = null;
        }
        Object.defineProperty(ViewController.prototype, "view", {
            get: function () {
                return this._view;
            },
            enumerable: true,
            configurable: true
        });
        ViewController.prototype.setView = function (view) {
            this.willSetView(view);
            this._view = view;
            this.onSetView(view);
            this.didSetView(view);
        };
        ViewController.prototype.willSetView = function (view) {
        };
        ViewController.prototype.onSetView = function (view) {
        };
        ViewController.prototype.didSetView = function (view) {
        };
        ViewController.prototype.key = function () {
            var view = this._view;
            return view ? view.key() : null;
        };
        ViewController.prototype.viewWillSetKey = function (key, view) {
        };
        ViewController.prototype.viewDidSetKey = function (key, view) {
        };
        Object.defineProperty(ViewController.prototype, "appView", {
            get: function () {
                var view = this._view;
                return view ? view.appView : null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewController.prototype, "appViewController", {
            get: function () {
                var appView = this.appView;
                return appView ? appView.viewController : null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewController.prototype, "parentView", {
            get: function () {
                var view = this._view;
                return view ? view.parentView : null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewController.prototype, "parentViewController", {
            get: function () {
                var parentView = this.parentView;
                return parentView ? parentView.viewController : null;
            },
            enumerable: true,
            configurable: true
        });
        ViewController.prototype.viewWillSetParentView = function (parentView, view) {
        };
        ViewController.prototype.viewDidSetParentView = function (parentView, view) {
        };
        Object.defineProperty(ViewController.prototype, "childViews", {
            get: function () {
                var view = this._view;
                return view ? view.childViews : [];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewController.prototype, "childViewControllers", {
            get: function () {
                return this.childViews.map(function (view) {
                    return view.viewController;
                });
            },
            enumerable: true,
            configurable: true
        });
        ViewController.prototype.getChildView = function (key) {
            var view = this._view;
            return view ? view.getChildView(key) : null;
        };
        ViewController.prototype.getChildViewController = function (key) {
            var childView = this.getChildView(key);
            return childView ? childView.viewController : null;
        };
        ViewController.prototype.setChildView = function (key, newChildView) {
            var view = this._view;
            if (view) {
                return view.setChildView(key, newChildView);
            }
            else {
                throw new Error("no view");
            }
        };
        ViewController.prototype.setChildViewController = function (key, newChildViewController) {
            var newChildView = newChildViewController ? newChildViewController.view : null;
            if (newChildView !== void 0) {
                var oldChildView = this.setChildView(key, newChildView);
                return oldChildView ? oldChildView.viewController : null;
            }
            else {
                throw new Error("no view");
            }
        };
        ViewController.prototype.appendChildView = function (childView) {
            var view = this._view;
            if (view) {
                view.appendChildView(childView);
            }
            else {
                throw new Error("no view");
            }
        };
        ViewController.prototype.appendChildViewController = function (childViewController) {
            var childView = childViewController.view;
            if (childView) {
                this.appendChildView(childView);
            }
            else {
                throw new Error("no view");
            }
        };
        ViewController.prototype.prependChildView = function (childView) {
            var view = this._view;
            if (view) {
                view.prependChildView(childView);
            }
            else {
                throw new Error("no view");
            }
        };
        ViewController.prototype.prependChildViewController = function (childViewController) {
            var childView = childViewController.view;
            if (childView) {
                this.prependChildView(childView);
            }
            else {
                throw new Error("no view");
            }
        };
        ViewController.prototype.insertChildView = function (childView, targetView) {
            var view = this._view;
            if (view) {
                view.insertChildView(childView, targetView);
            }
            else {
                throw new Error("no view");
            }
        };
        ViewController.prototype.insertChildViewController = function (childViewController, targetViewController) {
            var childView = childViewController.view;
            var targetView;
            if (targetViewController && !(targetViewController instanceof View)) {
                targetView = targetViewController.view;
            }
            else {
                targetView = targetViewController;
            }
            if (childView && targetView !== void 0) {
                this.insertChildView(childView, targetView);
            }
            else {
                throw new Error("no view");
            }
        };
        ViewController.prototype.viewWillInsertChildView = function (childView, targetView, view) {
        };
        ViewController.prototype.viewDidInsertChildView = function (childView, targetView, view) {
        };
        ViewController.prototype.removeChildView = function (childView) {
            var view = this._view;
            if (view) {
                view.removeChildView(childView);
            }
            else {
                throw new Error("no view");
            }
        };
        ViewController.prototype.removeChildViewController = function (childViewController) {
            var childView = childViewController.view;
            if (childView) {
                this.removeChildView(childView);
            }
            else {
                throw new Error("no view");
            }
        };
        ViewController.prototype.removeAll = function () {
            var view = this._view;
            if (view) {
                view.removeAll();
            }
            else {
                throw new Error("no view");
            }
        };
        ViewController.prototype.remove = function () {
            var view = this._view;
            if (view) {
                view.remove();
            }
            else {
                throw new Error("no view");
            }
        };
        ViewController.prototype.viewWillRemoveChildView = function (childView, view) {
        };
        ViewController.prototype.viewDidRemoveChildView = function (childView, view) {
        };
        ViewController.prototype.isMounted = function () {
            var view = this._view;
            return view ? view.isMounted() : false;
        };
        ViewController.prototype.viewWillMount = function (view) {
        };
        ViewController.prototype.viewDidMount = function (view) {
        };
        ViewController.prototype.viewWillUnmount = function (view) {
        };
        ViewController.prototype.viewDidUnmount = function (view) {
        };
        ViewController.prototype.viewWillResize = function (view) {
        };
        ViewController.prototype.viewDidResize = function (view) {
        };
        ViewController.prototype.viewWillLayout = function (view) {
        };
        ViewController.prototype.viewDidLayout = function (view) {
        };
        ViewController.prototype.viewWillScroll = function (view) {
        };
        ViewController.prototype.viewDidScroll = function (view) {
        };
        return ViewController;
    }());

    var AppView = {
        is: function (object) {
            if (typeof object === "object" && object) {
                var view = object;
                return view instanceof View
                    && typeof view.togglePopover === "function"
                    && typeof view.showPopover === "function"
                    && typeof view.hidePopover === "function"
                    && typeof view.hidePopovers === "function";
            }
            return false;
        },
    };
    View.App = AppView;

    var AnimatedView = {
        is: function (object) {
            if (typeof object === "object" && object) {
                var view = object;
                return view instanceof View.Graphic || view instanceof View
                    && typeof view.cascadeAnimate === "function";
            }
            return false;
        },
    };
    View.Animated = AnimatedView;

    var RenderView = {
        is: function (object) {
            if (typeof object === "object" && object) {
                var view = object;
                return view instanceof View.Graphic || view instanceof View
                    && typeof view.cascadeAnimate === "function"
                    && typeof view.cascadeRender === "function"
                    && typeof view.cascadeCull === "function";
            }
            return false;
        },
    };
    View.Render = RenderView;

    var LayoutView = {
        is: function (object) {
            if (typeof object === "object" && object) {
                var view = object;
                return view instanceof View
                    && typeof view.addConstraint === "function"
                    && typeof view.removeConstraint === "function";
            }
            return false;
        },
    };
    View.Layout = LayoutView;

    var FillView = {
        is: function (object) {
            if (typeof object === "object" && object) {
                var view = object;
                return view instanceof View
                    && typeof view.fill === "function";
            }
            return false;
        },
    };

    var StrokeView = {
        is: function (object) {
            if (typeof object === "object" && object) {
                var view = object;
                return view instanceof View
                    && typeof view.stroke === "function"
                    && typeof view.strokeWidth === "function";
            }
            return false;
        },
    };

    var TypesetView = {
        is: function (object) {
            if (typeof object === "object" && object) {
                var view = object;
                return view instanceof View
                    && typeof view.font === "function"
                    && typeof view.textColor === "function"
                    && typeof view.textAlign === "function"
                    && typeof view.textBaseline === "function";
            }
            return false;
        },
    };

    var GraphicView = (function (_super) {
        __extends(GraphicView, _super);
        function GraphicView(key) {
            if (key === void 0) { key = null; }
            var _this = _super.call(this) || this;
            _this._key = key;
            _this._viewController = null;
            _this._viewObservers = [];
            _this._parentView = null;
            _this._childViews = [];
            _this._bounds = math.BoxR2.empty();
            _this._anchor = math.PointR2.origin();
            _this._hidden = false;
            _this._culled = false;
            _this._dirty = true;
            _this._hover = false;
            _this._eventHandlers = {};
            return _this;
        }
        GraphicView.prototype.key = function (key) {
            if (key === void 0) {
                return this._key;
            }
            else {
                this.willSetKey(key);
                this._key = key;
                this.onSetKey(key);
                this.didSetKey(key);
                return this;
            }
        };
        Object.defineProperty(GraphicView.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: true,
            configurable: true
        });
        GraphicView.prototype.setViewController = function (viewController) {
            if (this._viewController !== viewController) {
                this.willSetViewController(viewController);
                if (this._viewController) {
                    this._viewController.setView(null);
                }
                this._viewController = viewController;
                if (this._viewController) {
                    this._viewController.setView(this);
                }
                this.onSetViewController(viewController);
                this.didSetViewController(viewController);
            }
        };
        Object.defineProperty(GraphicView.prototype, "viewObservers", {
            get: function () {
                return this._viewObservers;
            },
            enumerable: true,
            configurable: true
        });
        GraphicView.prototype.addViewObserver = function (viewObserver) {
            var viewObservers = this._viewObservers;
            var index = viewObservers.indexOf(viewObserver);
            if (index < 0) {
                this.willAddViewObserver(viewObserver);
                viewObservers.push(viewObserver);
                this.onAddViewObserver(viewObserver);
                this.didAddViewObserver(viewObserver);
            }
        };
        GraphicView.prototype.removeViewObserver = function (viewObserver) {
            var viewObservers = this._viewObservers;
            var index = viewObservers.indexOf(viewObserver);
            if (index >= 0) {
                this.willRemoveViewObserver(viewObserver);
                viewObservers.splice(index, 1);
                this.onRemoveViewObserver(viewObserver);
                this.didRemoveViewObserver(viewObserver);
            }
        };
        Object.defineProperty(GraphicView.prototype, "canvasView", {
            get: function () {
                var parentView = this.parentView;
                return RenderView.is(parentView) ? parentView.canvasView : null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GraphicView.prototype, "parentView", {
            get: function () {
                return this._parentView;
            },
            enumerable: true,
            configurable: true
        });
        GraphicView.prototype.setParentView = function (parentView) {
            this.willSetParentView(parentView);
            this._parentView = parentView;
            this.onSetParentView(parentView);
            this.didSetParentView(parentView);
        };
        Object.defineProperty(GraphicView.prototype, "childViews", {
            get: function () {
                return this._childViews;
            },
            enumerable: true,
            configurable: true
        });
        GraphicView.prototype.getChildView = function (key) {
            var childViews = this._childViews;
            for (var i = childViews.length - 1; i >= 0; i -= 1) {
                var childView = childViews[i];
                if (childView.key() === key) {
                    return childView;
                }
            }
            return null;
        };
        GraphicView.prototype.setChildView = function (key, newChildView) {
            if (newChildView !== null && !RenderView.is(newChildView)) {
                throw new TypeError("" + newChildView);
            }
            var oldChildView = null;
            var targetView = null;
            var childViews = this._childViews;
            var index = childViews.length - 1;
            while (index >= 0) {
                var childView = childViews[index];
                if (childView.key() === key) {
                    oldChildView = childView;
                    targetView = childViews[index + 1] || null;
                    this.willRemoveChildView(childView);
                    childView.setParentView(null);
                    childViews.splice(index, 1);
                    this.onRemoveChildView(childView);
                    this.didRemoveChildView(childView);
                    break;
                }
                index -= 1;
            }
            if (newChildView) {
                newChildView.key(key);
                this.willInsertChildView(newChildView, targetView);
                if (index >= 0) {
                    childViews.splice(index, 0, newChildView);
                }
                else {
                    childViews.push(newChildView);
                }
                newChildView.setParentView(this);
                this.onInsertChildView(newChildView, targetView);
                this.didInsertChildView(newChildView, targetView);
                this.setDirty(true);
                this.animate();
            }
            return oldChildView;
        };
        GraphicView.prototype.append = function (child) {
            this.appendChildView(child);
            return child;
        };
        GraphicView.prototype.appendChildView = function (childView) {
            if (!RenderView.is(childView)) {
                throw new TypeError("" + childView);
            }
            this.willInsertChildView(childView, null);
            this._childViews.push(childView);
            childView.setParentView(this);
            this.onInsertChildView(childView, null);
            this.didInsertChildView(childView, null);
            this.setDirty(true);
            this.animate();
        };
        GraphicView.prototype.prepend = function (child) {
            this.prependChildView(child);
            return child;
        };
        GraphicView.prototype.prependChildView = function (childView) {
            if (!RenderView.is(childView)) {
                throw new TypeError("" + childView);
            }
            this.willInsertChildView(childView, null);
            this._childViews.unshift(childView);
            childView.setParentView(this);
            this.onInsertChildView(childView, null);
            this.didInsertChildView(childView, null);
            this.setDirty(true);
            this.animate();
        };
        GraphicView.prototype.insert = function (child, target) {
            this.insertChildView(child, target);
            return child;
        };
        GraphicView.prototype.insertChildView = function (childView, targetView) {
            if (!RenderView.is(childView)) {
                throw new TypeError("" + childView);
            }
            if (targetView !== null && !RenderView.is(childView)) {
                throw new TypeError("" + targetView);
            }
            if (targetView !== null && targetView.parentView !== this) {
                throw new TypeError("" + targetView);
            }
            var childViews = this._childViews;
            this.willInsertChildView(childView, targetView);
            var index = targetView ? childViews.indexOf(targetView) : -1;
            if (index >= 0) {
                childViews.splice(index, 0, childView);
            }
            else {
                childViews.push(childView);
            }
            childView.setParentView(this);
            this.onInsertChildView(childView, targetView);
            this.didInsertChildView(childView, targetView);
            this.setDirty(true);
            this.animate();
        };
        GraphicView.prototype.onInsertChildView = function (childView, targetView) {
            if (RenderView.is(childView)) {
                this.setChildViewBounds(childView, this._bounds);
                this.setChildViewAnchor(childView, this._anchor);
                if (this._culled) {
                    childView.setCulled(true);
                }
            }
        };
        GraphicView.prototype.removeChildView = function (childView) {
            if (!RenderView.is(childView)) {
                throw new TypeError("" + childView);
            }
            if (childView.parentView !== this) {
                throw new TypeError("" + childView);
            }
            var childViews = this._childViews;
            this.willRemoveChildView(childView);
            childView.setParentView(null);
            var index = childViews.indexOf(childView);
            if (index >= 0) {
                childViews.splice(index, 1);
            }
            this.onRemoveChildView(childView);
            this.didRemoveChildView(childView);
            this.setDirty(true);
            this.animate();
        };
        GraphicView.prototype.removeAll = function () {
            var childViews = this._childViews;
            do {
                var count = childViews.length;
                if (count > 0) {
                    var childView = childViews[count - 1];
                    this.willRemoveChildView(childView);
                    childView.setParentView(null);
                    childViews.pop();
                    this.onRemoveChildView(childView);
                    this.didRemoveChildView(childView);
                    this.setDirty(true);
                    this.animate();
                    continue;
                }
                break;
            } while (true);
        };
        GraphicView.prototype.remove = function () {
            if (this._parentView) {
                this._parentView.removeChildView(this);
            }
        };
        GraphicView.prototype.isMounted = function () {
            var parentView = this._parentView;
            return parentView ? parentView.isMounted() : false;
        };
        GraphicView.prototype.cascadeMount = function () {
            this.willMount();
            this.onMount();
            var childViews = this._childViews;
            for (var i = 0, n = childViews.length; i < n; i += 1) {
                var childView = childViews[i];
                childView.cascadeMount();
            }
            this.didMount();
        };
        GraphicView.prototype.onMount = function () {
            _super.prototype.onMount.call(this);
            this.setDirty(true);
        };
        GraphicView.prototype.cascadeUnmount = function () {
            this.willUnmount();
            this.onUnmount();
            var childViews = this._childViews;
            for (var i = 0, n = childViews.length; i < n; i += 1) {
                var childView = childViews[i];
                childView.cascadeUnmount();
            }
            this.didUnmount();
        };
        GraphicView.prototype.cascadeResize = function () {
            this.willResize();
            this.onResize();
            var childViews = this._childViews;
            for (var i = 0, n = childViews.length; i < n; i += 1) {
                var childView = childViews[i];
                childView.cascadeResize();
            }
            this.didResize();
        };
        GraphicView.prototype.cascadeLayout = function () {
            this.willLayout();
            this.onLayout();
            var childViews = this._childViews;
            for (var i = 0, n = childViews.length; i < n; i += 1) {
                var childView = childViews[i];
                childView.cascadeLayout();
            }
            this.didLayout();
        };
        GraphicView.prototype.cascadeScroll = function () {
            this.willScroll();
            this.onScroll();
            var childViews = this._childViews;
            for (var i = 0, n = childViews.length; i < n; i += 1) {
                var childView = childViews[i];
                childView.cascadeScroll();
            }
            this.didScroll();
        };
        GraphicView.prototype.animate = function () {
            var parentView = this._parentView;
            if (AnimatedView.is(parentView)) {
                parentView.animate();
            }
        };
        GraphicView.prototype.cascadeAnimate = function (frame) {
            this.willAnimate(frame);
            this.onAnimate(frame);
            var childViews = this._childViews;
            for (var i = 0, n = childViews.length; i < n; i += 1) {
                var childView = childViews[i];
                if (AnimatedView.is(childView)) {
                    childView.cascadeAnimate(frame);
                }
            }
            this.didAnimate(frame);
        };
        GraphicView.prototype.willAnimate = function (frame) {
            this.willObserve(function (viewObserver) {
                if (viewObserver.viewWillAnimate) {
                    viewObserver.viewWillAnimate(frame, this);
                }
            });
        };
        GraphicView.prototype.onAnimate = function (frame) {
        };
        GraphicView.prototype.didAnimate = function (frame) {
            this.didObserve(function (viewObserver) {
                if (viewObserver.viewDidAnimate) {
                    viewObserver.viewDidAnimate(frame, this);
                }
            });
            this.setDirty(false);
        };
        GraphicView.prototype.cascadeRender = function (context) {
            if (!this._hidden && !this._culled) {
                this.willRender(context);
                this.onRender(context);
                var childViews = this._childViews;
                for (var i = 0, n = childViews.length; i < n; i += 1) {
                    var childView = childViews[i];
                    if (RenderView.is(childView)) {
                        childView.cascadeRender(context);
                    }
                }
                this.didRender(context);
            }
        };
        GraphicView.prototype.willRender = function (context) {
            this.willObserve(function (viewObserver) {
                if (viewObserver.viewWillRender) {
                    viewObserver.viewWillRender(context, this);
                }
            });
        };
        GraphicView.prototype.onRender = function (context) {
        };
        GraphicView.prototype.didRender = function (context) {
            this.didObserve(function (viewObserver) {
                if (viewObserver.viewDidRender) {
                    viewObserver.viewDidRender(context, this);
                }
            });
        };
        Object.defineProperty(GraphicView.prototype, "hidden", {
            get: function () {
                return this._hidden;
            },
            enumerable: true,
            configurable: true
        });
        GraphicView.prototype.setHidden = function (hidden) {
            var newHidden = this.willSetHidden(hidden);
            if (newHidden !== void 0) {
                hidden = newHidden;
            }
            if (this._hidden !== hidden) {
                this._hidden = hidden;
                this.onSetHidden(hidden);
            }
            this.didSetHidden(hidden);
        };
        GraphicView.prototype.willSetHidden = function (hidden) {
            var viewController = this._viewController;
            if (viewController) {
                var newHidden = viewController.viewWillSetHidden(hidden, this);
                if (newHidden !== void 0) {
                    hidden = newHidden;
                }
            }
            var viewObservers = this._viewObservers;
            for (var i = 0, n = viewObservers.length; i < n; i += 1) {
                var viewObserver = viewObservers[i];
                if (viewObserver.viewWillSetHidden) {
                    viewObserver.viewWillSetHidden(hidden, this);
                }
            }
            return hidden;
        };
        GraphicView.prototype.onSetHidden = function (hidden) {
            this.setDirty(true);
        };
        GraphicView.prototype.didSetHidden = function (hidden) {
            this.didObserve(function (viewObserver) {
                if (viewObserver.viewDidSetHidden) {
                    viewObserver.viewDidSetHidden(hidden, this);
                }
            });
        };
        GraphicView.prototype.cascadeCull = function () {
            this.willCull();
            this.onCull();
            var childViews = this._childViews;
            for (var i = 0, n = childViews.length; i < n; i += 1) {
                var childView = childViews[i];
                if (RenderView.is(childView)) {
                    childView.cascadeCull();
                }
            }
            this.didCull();
        };
        GraphicView.prototype.willCull = function () {
            this.willObserve(function (viewObserver) {
                if (viewObserver.viewWillCull) {
                    viewObserver.viewWillCull(this);
                }
            });
        };
        GraphicView.prototype.onCull = function () {
        };
        GraphicView.prototype.didCull = function () {
            this.didObserve(function (viewObserver) {
                if (viewObserver.viewDidCull) {
                    viewObserver.viewDidCull(this);
                }
            });
        };
        Object.defineProperty(GraphicView.prototype, "culled", {
            get: function () {
                return this._culled;
            },
            enumerable: true,
            configurable: true
        });
        GraphicView.prototype.setCulled = function (culled) {
            var newCulled = this.willSetCulled(culled);
            if (newCulled !== void 0) {
                culled = newCulled;
            }
            if (this._culled !== culled) {
                this._culled = culled;
                this.onSetCulled(culled);
                var childViews = this._childViews;
                for (var i = 0, n = childViews.length; i < n; i += 1) {
                    var childView = childViews[i];
                    if (RenderView.is(childView)) {
                        this.setChildViewCulled(childView, culled);
                    }
                }
            }
            this.didSetCulled(culled);
        };
        GraphicView.prototype.willSetCulled = function (culled) {
            var viewController = this._viewController;
            if (viewController) {
                var newCulled = viewController.viewWillSetCulled(culled, this);
                if (newCulled !== void 0) {
                    culled = newCulled;
                }
            }
            var viewObservers = this._viewObservers;
            for (var i = 0, n = viewObservers.length; i < n; i += 1) {
                var viewObserver = viewObservers[i];
                if (viewObserver.viewWillSetCulled) {
                    viewObserver.viewWillSetCulled(culled, this);
                }
            }
            return culled;
        };
        GraphicView.prototype.onSetCulled = function (culled) {
            if (!culled) {
                this.setDirty(true);
            }
        };
        GraphicView.prototype.didSetCulled = function (culled) {
            this.didObserve(function (viewObserver) {
                if (viewObserver.viewDidSetCulled) {
                    viewObserver.viewDidSetCulled(culled, this);
                }
            });
        };
        GraphicView.prototype.setChildViewCulled = function (childView, culled) {
            childView.setCulled(culled);
        };
        Object.defineProperty(GraphicView.prototype, "parentTransform", {
            get: function () {
                var parentView = this._parentView;
                if (RenderView.is(parentView)) {
                    var parentBounds = parentView.bounds;
                    var bounds = this.bounds;
                    var dx = bounds.x - parentBounds.x;
                    var dy = bounds.y - parentBounds.y;
                    if (dx !== 0 || dy !== 0) {
                        return Transform.translate(dx, dy);
                    }
                }
                return Transform.identity();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GraphicView.prototype, "clientBounds", {
            get: function () {
                var inverseClientTransform = this.clientTransform.inverse();
                return this.bounds.transform(inverseClientTransform);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GraphicView.prototype, "popoverBounds", {
            get: function () {
                var inversePageTransform = this.pageTransform.inverse();
                var pageAnchor = this.anchor.transform(inversePageTransform);
                var pageX = Math.round(pageAnchor.x);
                var pageY = Math.round(pageAnchor.y);
                return new math.BoxR2(pageX, pageY, pageX, pageY);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GraphicView.prototype, "bounds", {
            get: function () {
                return this._bounds;
            },
            enumerable: true,
            configurable: true
        });
        GraphicView.prototype.setBounds = function (bounds) {
            var newBounds = this.willSetBounds(bounds);
            if (newBounds !== void 0) {
                bounds = newBounds;
            }
            var oldBounds = this._bounds;
            this._bounds = bounds;
            this.onSetBounds(bounds, oldBounds);
            var childViews = this._childViews;
            for (var i = 0, n = childViews.length; i < n; i += 1) {
                var childView = childViews[i];
                if (RenderView.is(childView)) {
                    this.setChildViewBounds(childView, bounds);
                }
            }
            this.didSetBounds(bounds, oldBounds);
        };
        GraphicView.prototype.willSetBounds = function (bounds) {
            var viewController = this._viewController;
            if (viewController) {
                var newBounds = viewController.viewWillSetBounds(bounds, this);
                if (newBounds !== void 0) {
                    bounds = newBounds;
                }
            }
            var viewObservers = this._viewObservers;
            for (var i = 0, n = viewObservers.length; i < n; i += 1) {
                var viewObserver = viewObservers[i];
                if (viewObserver.viewWillSetBounds) {
                    viewObserver.viewWillSetBounds(bounds, this);
                }
            }
        };
        GraphicView.prototype.onSetBounds = function (newBounds, oldBounds) {
            if (!newBounds.equals(oldBounds)) {
                this.setDirty(true);
            }
        };
        GraphicView.prototype.didSetBounds = function (newBounds, oldBounds) {
            this.didObserve(function (viewObserver) {
                if (viewObserver.viewDidSetBounds) {
                    viewObserver.viewDidSetBounds(newBounds, oldBounds, this);
                }
            });
        };
        GraphicView.prototype.setChildViewBounds = function (childView, bounds) {
            childView.setBounds(bounds);
        };
        Object.defineProperty(GraphicView.prototype, "anchor", {
            get: function () {
                return this._anchor;
            },
            enumerable: true,
            configurable: true
        });
        GraphicView.prototype.setAnchor = function (anchor) {
            var newAnchor = this.willSetAnchor(anchor);
            if (newAnchor !== void 0) {
                anchor = newAnchor;
            }
            var oldAnchor = this._anchor;
            this._anchor = anchor;
            this.onSetAnchor(anchor, oldAnchor);
            var childViews = this._childViews;
            for (var i = 0, n = childViews.length; i < n; i += 1) {
                var childView = childViews[i];
                if (RenderView.is(childView)) {
                    this.setChildViewAnchor(childView, anchor);
                }
            }
            this.didSetAnchor(anchor, oldAnchor);
        };
        GraphicView.prototype.willSetAnchor = function (anchor) {
            var viewController = this._viewController;
            if (viewController) {
                var newAnchor = viewController.viewWillSetAnchor(anchor, this);
                if (newAnchor !== void 0) {
                    anchor = newAnchor;
                }
            }
            var viewObservers = this._viewObservers;
            for (var i = 0, n = viewObservers.length; i < n; i += 1) {
                var viewObserver = viewObservers[i];
                if (viewObserver.viewWillSetAnchor) {
                    viewObserver.viewWillSetAnchor(anchor, this);
                }
            }
        };
        GraphicView.prototype.onSetAnchor = function (newAnchor, oldAnchor) {
        };
        GraphicView.prototype.didSetAnchor = function (newAnchor, oldAnchor) {
            this.didObserve(function (viewObserver) {
                if (viewObserver.viewDidSetAnchor) {
                    viewObserver.viewDidSetAnchor(newAnchor, oldAnchor, this);
                }
            });
        };
        GraphicView.prototype.setChildViewAnchor = function (childView, anchor) {
            childView.setAnchor(anchor);
        };
        Object.defineProperty(GraphicView.prototype, "pixelRatio", {
            get: function () {
                var parentView = this._parentView;
                if (RenderView.is(parentView)) {
                    return parentView.pixelRatio;
                }
                else {
                    return window.devicePixelRatio || 1;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GraphicView.prototype, "dirty", {
            get: function () {
                return this._dirty;
            },
            enumerable: true,
            configurable: true
        });
        GraphicView.prototype.setDirty = function (dirty) {
            if (this._dirty !== dirty) {
                this._dirty = dirty;
                this.didSetDirty(dirty);
            }
        };
        GraphicView.prototype.didSetDirty = function (dirty) {
            if (dirty) {
                var parentView = this._parentView;
                if (RenderView.is(parentView)) {
                    parentView.setDirty(dirty);
                }
            }
        };
        Object.defineProperty(GraphicView.prototype, "hitBounds", {
            get: function () {
                return null;
            },
            enumerable: true,
            configurable: true
        });
        GraphicView.prototype.hitTest = function (x, y, context) {
            var hit = null;
            var childViews = this._childViews;
            for (var i = childViews.length - 1; i >= 0; i -= 1) {
                var childView = childViews[i];
                if (RenderView.is(childView) && !childView.culled) {
                    var hitBounds = childView.hitBounds || childView.bounds;
                    if (hitBounds.contains(x, y)) {
                        hit = childView.hitTest(x, y, context);
                        if (hit !== null) {
                            break;
                        }
                    }
                }
            }
            return hit;
        };
        GraphicView.prototype.on = function (type, listener, options) {
            var handlers = this._eventHandlers[type];
            var capture = typeof options === "boolean" ? options : options && typeof options === "object" && options.capture || false;
            var passive = options && typeof options === "object" && options.passive || false;
            var once = options && typeof options === "object" && options.once || false;
            var handler;
            if (handlers === void 0) {
                handler = { listener: listener, capture: capture, passive: passive, once: once };
                handlers = [handler];
                this._eventHandlers[type] = handlers;
            }
            else {
                var n = handlers.length;
                var i = 0;
                while (i < n) {
                    handler = handlers[i];
                    if (handler.listener === listener && handler.capture === capture) {
                        break;
                    }
                    i += 1;
                }
                if (i < n) {
                    handler.passive = passive;
                    handler.once = once;
                }
                else {
                    handler = { listener: listener, capture: capture, passive: passive, once: once };
                    handlers.push(handler);
                }
            }
            return this;
        };
        GraphicView.prototype.off = function (type, listener, options) {
            var handlers = this._eventHandlers[type];
            if (handlers !== void 0) {
                var capture = typeof options === "boolean" ? options : options && typeof options === "object" && options.capture || false;
                var n = handlers.length;
                var i = 0;
                while (i < n) {
                    var handler = handlers[i];
                    if (handler.listener === listener && handler.capture === capture) {
                        handlers.splice(i, 1);
                        if (handlers.length === 0) {
                            delete this._eventHandlers[type];
                        }
                        break;
                    }
                    i += 1;
                }
            }
            return this;
        };
        GraphicView.prototype.handleEvent = function (event) {
            var type = event.type;
            var handlers = this._eventHandlers[type];
            if (handlers !== void 0) {
                var i = 0;
                while (i < handlers.length) {
                    var handler = handlers[i];
                    if (!handler.capture) {
                        var listener = handler.listener;
                        if (typeof listener === "function") {
                            listener(event);
                        }
                        else if (listener && typeof listener === "object") {
                            listener.handleEvent(event);
                        }
                        if (handler.once) {
                            handlers.splice(i, 1);
                            continue;
                        }
                    }
                    i += 1;
                }
                if (handlers.length === 0) {
                    delete this._eventHandlers[type];
                }
            }
            if (type === "mouseover") {
                this.onMouseOver(event);
            }
            else if (type === "mouseout") {
                this.onMouseOut(event);
            }
        };
        GraphicView.prototype.bubbleEvent = function (event) {
            this.handleEvent(event);
            if (event.bubbles && !event.cancelBubble) {
                var parentView = this._parentView;
                if (RenderView.is(parentView)) {
                    return parentView.bubbleEvent(event);
                }
                else {
                    return parentView;
                }
            }
            else {
                return null;
            }
        };
        GraphicView.prototype.dispatchEvent = function (event) {
            event.targetView = this;
            var next = this.bubbleEvent(event);
            if (next) {
                return next.dispatchEvent(event);
            }
            else {
                return !event.cancelBubble;
            }
        };
        Object.defineProperty(GraphicView.prototype, "hover", {
            get: function () {
                return this._hover;
            },
            enumerable: true,
            configurable: true
        });
        GraphicView.prototype.onMouseOver = function (event) {
            if (!this._hover) {
                this._hover = true;
                if (this._eventHandlers.mouseenter !== void 0) {
                    var enterEvent = new MouseEvent("mouseenter", {
                        clientX: event.clientX,
                        clientY: event.clientY,
                        screenX: event.screenX,
                        screenY: event.screenY,
                        bubbles: false,
                    });
                    enterEvent.targetView = this;
                    enterEvent.relatedTargetView = event.relatedTargetView;
                    this.handleEvent(enterEvent);
                }
            }
        };
        GraphicView.prototype.onMouseOut = function (event) {
            if (this._hover) {
                this._hover = false;
                if (this._eventHandlers.mouseleave !== void 0) {
                    var leaveEvent = new MouseEvent("mouseleave", {
                        clientX: event.clientX,
                        clientY: event.clientY,
                        screenX: event.screenX,
                        screenY: event.screenY,
                        bubbles: false,
                    });
                    leaveEvent.targetView = this;
                    leaveEvent.relatedTargetView = event.relatedTargetView;
                    this.handleEvent(leaveEvent);
                }
            }
        };
        return GraphicView;
    }(View));
    View.Graphic = GraphicView;

    var GraphicViewController = (function (_super) {
        __extends(GraphicViewController, _super);
        function GraphicViewController() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(GraphicViewController.prototype, "canvasView", {
            get: function () {
                var view = this._view;
                return view ? view.canvasView : null;
            },
            enumerable: true,
            configurable: true
        });
        GraphicViewController.prototype.animate = function () {
            var view = this._view;
            if (view) {
                view.animate();
            }
        };
        GraphicViewController.prototype.viewWillAnimate = function (frame, view) {
        };
        GraphicViewController.prototype.viewDidAnimate = function (frame, view) {
        };
        GraphicViewController.prototype.viewWillRender = function (context, view) {
        };
        GraphicViewController.prototype.viewDidRender = function (context, view) {
        };
        Object.defineProperty(GraphicViewController.prototype, "hidden", {
            get: function () {
                var view = this._view;
                return view ? view.hidden : false;
            },
            enumerable: true,
            configurable: true
        });
        GraphicViewController.prototype.viewWillSetHidden = function (hidden, view) {
        };
        GraphicViewController.prototype.viewDidSetHidden = function (hidden, view) {
        };
        GraphicViewController.prototype.viewWillCull = function (view) {
        };
        GraphicViewController.prototype.viewDidCull = function (view) {
        };
        Object.defineProperty(GraphicViewController.prototype, "culled", {
            get: function () {
                var view = this._view;
                return view ? view.culled : false;
            },
            enumerable: true,
            configurable: true
        });
        GraphicViewController.prototype.viewWillSetCulled = function (culled, view) {
        };
        GraphicViewController.prototype.viewDidSetCulled = function (culled, view) {
        };
        Object.defineProperty(GraphicViewController.prototype, "bounds", {
            get: function () {
                var view = this._view;
                return view ? view.bounds : math.BoxR2.empty();
            },
            enumerable: true,
            configurable: true
        });
        GraphicViewController.prototype.viewWillSetBounds = function (bounds, view) {
        };
        GraphicViewController.prototype.viewDidSetBounds = function (newBounds, oldBounds, view) {
        };
        Object.defineProperty(GraphicViewController.prototype, "anchor", {
            get: function () {
                var view = this._view;
                return view ? view.anchor : math.PointR2.origin();
            },
            enumerable: true,
            configurable: true
        });
        GraphicViewController.prototype.viewWillSetAnchor = function (anchor, view) {
        };
        GraphicViewController.prototype.viewDidSetAnchor = function (newAnchor, oldAnchor, view) {
        };
        Object.defineProperty(GraphicViewController.prototype, "dirty", {
            get: function () {
                var view = this._view;
                return view ? view.dirty : false;
            },
            enumerable: true,
            configurable: true
        });
        GraphicViewController.prototype.setDirty = function (dirty) {
            var view = this._view;
            if (view) {
                view.setDirty(dirty);
            }
        };
        return GraphicViewController;
    }(ViewController));

    var LayerView = (function (_super) {
        __extends(LayerView, _super);
        function LayerView(key) {
            if (key === void 0) { key = null; }
            var _this = _super.call(this, key) || this;
            _this._canvas = _this.createCanvas();
            return _this;
        }
        Object.defineProperty(LayerView.prototype, "canvas", {
            get: function () {
                return this._canvas;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LayerView.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: true,
            configurable: true
        });
        LayerView.prototype.cascadeRender = function (context) {
            var layerContext = this.getContext();
            this.willRender(context, layerContext);
            if (this._dirty) {
                this.onRender(context, layerContext);
                var childViews = this.childViews;
                for (var i = 0, n = childViews.length; i < n; i += 1) {
                    var childView = childViews[i];
                    if (RenderView.is(childView)) {
                        childView.cascadeRender(layerContext);
                    }
                }
            }
            this.didRender(context, layerContext);
        };
        LayerView.prototype.willRender = function (context, layerContext) {
            _super.prototype.willRender.call(this, context);
        };
        LayerView.prototype.onRender = function (context, layerContext) {
            var bounds = this._bounds;
            layerContext.clearRect(0, 0, bounds.width, bounds.height);
            _super.prototype.onRender.call(this, context);
        };
        LayerView.prototype.didRender = function (context, layerContext) {
            this.copyLayerImage(context, layerContext);
            _super.prototype.didRender.call(this, context);
        };
        LayerView.prototype.copyLayerImage = function (context, layerContext) {
            var bounds = this._bounds;
            var pixelRatio = this.pixelRatio;
            var imageData = layerContext.getImageData(0, 0, bounds.width * pixelRatio, bounds.height * pixelRatio);
            context.putImageData(imageData, bounds.x * pixelRatio, bounds.y * pixelRatio);
        };
        Object.defineProperty(LayerView.prototype, "parentTransform", {
            get: function () {
                return Transform.identity();
            },
            enumerable: true,
            configurable: true
        });
        LayerView.prototype.willSetBounds = function (bounds) {
            var newBounds = _super.prototype.willSetBounds.call(this, bounds);
            if (newBounds instanceof math.BoxR2) {
                bounds = newBounds;
            }
            var xMin = Math.round(bounds.xMin);
            var yMin = Math.round(bounds.yMin);
            var xMax = Math.round(bounds.xMax);
            var yMax = Math.round(bounds.yMax);
            return new math.BoxR2(xMin, yMin, xMax, yMax);
        };
        LayerView.prototype.onSetBounds = function (newBounds, oldBounds) {
            if (!newBounds.equals(oldBounds)) {
                this.resizeCanvas(this._canvas, newBounds);
                this.setDirty(true);
            }
        };
        LayerView.prototype.setChildViewBounds = function (childView, bounds) {
            if (bounds.x !== 0 || bounds.y !== 0) {
                var width = bounds.width;
                var height = bounds.height;
                bounds = new math.BoxR2(0, 0, width, height);
            }
            childView.setBounds(bounds);
        };
        LayerView.prototype.setChildViewAnchor = function (childView, anchor) {
            var bounds = this._bounds;
            var x = bounds.x;
            var y = bounds.y;
            if (x !== 0 || y !== 0) {
                anchor = new math.PointR2(anchor.x - x, anchor.y - y);
            }
            childView.setAnchor(anchor);
        };
        LayerView.prototype.hitTest = function (x, y, context) {
            var layerContext = this.getContext();
            var bounds = this._bounds;
            x -= bounds.x;
            y -= bounds.y;
            var hit = null;
            var childViews = this._childViews;
            for (var i = childViews.length - 1; i >= 0; i -= 1) {
                var childView = childViews[i];
                if (RenderView.is(childView) && childView.bounds.contains(x, y)) {
                    hit = childView.hitTest(x, y, layerContext);
                    if (hit !== null) {
                        break;
                    }
                }
            }
            return hit;
        };
        LayerView.prototype.getContext = function () {
            return this._canvas.getContext("2d");
        };
        LayerView.prototype.createCanvas = function () {
            return document.createElement("canvas");
        };
        LayerView.prototype.resizeCanvas = function (node, bounds) {
            var width = Math.floor(bounds.width);
            var height = Math.floor(bounds.height);
            var pixelRatio = this.pixelRatio;
            node.width = width * pixelRatio;
            node.height = height * pixelRatio;
            node.style.width = width + "px";
            node.style.height = height + "px";
            var context = this.getContext();
            context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        };
        return LayerView;
    }(GraphicView));
    View.Layer = LayerView;

    var LayerViewController = (function (_super) {
        __extends(LayerViewController, _super);
        function LayerViewController() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return LayerViewController;
    }(GraphicViewController));

    var NodeViewController = (function (_super) {
        __extends(NodeViewController, _super);
        function NodeViewController() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(NodeViewController.prototype, "node", {
            get: function () {
                var view = this._view;
                return view ? view.node : null;
            },
            enumerable: true,
            configurable: true
        });
        NodeViewController.prototype.appendChildNode = function (childNode) {
            var view = this._view;
            if (view) {
                view.appendChildNode(childNode);
            }
            else {
                throw new Error("no view");
            }
        };
        NodeViewController.prototype.prependChildNode = function (childNode) {
            var view = this._view;
            if (view) {
                view.prependChildNode(childNode);
            }
            else {
                throw new Error("no view");
            }
        };
        NodeViewController.prototype.insertChildNode = function (childNode, targetNode) {
            var view = this._view;
            if (view) {
                view.insertChildNode(childNode, targetNode);
            }
            else {
                throw new Error("no view");
            }
        };
        NodeViewController.prototype.viewWillInsertChildNode = function (childNode, targetNode, view) {
        };
        NodeViewController.prototype.viewDidInsertChildNode = function (childNode, targetNode, view) {
        };
        NodeViewController.prototype.removeChildNode = function (childNode) {
            var view = this._view;
            if (view) {
                view.removeChildNode(childNode);
            }
            else {
                throw new Error("no view");
            }
        };
        NodeViewController.prototype.viewWillRemoveChildNode = function (childNode, view) {
        };
        NodeViewController.prototype.viewDidRemoveChildNode = function (childNode, view) {
        };
        NodeViewController.prototype.viewWillAnimate = function (frame, view) {
        };
        NodeViewController.prototype.viewDidAnimate = function (frame, view) {
        };
        return NodeViewController;
    }(ViewController));

    var TextView = (function (_super) {
        __extends(TextView, _super);
        function TextView(node, key) {
            if (key === void 0) { key = null; }
            return _super.call(this, node, key) || this;
        }
        Object.defineProperty(TextView.prototype, "node", {
            get: function () {
                return this._node;
            },
            enumerable: true,
            configurable: true
        });
        TextView.prototype.initNode = function (node) {
        };
        Object.defineProperty(TextView.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: true,
            configurable: true
        });
        return TextView;
    }(NodeView));
    View.Text = TextView;

    var TextViewController = (function (_super) {
        __extends(TextViewController, _super);
        function TextViewController() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(TextViewController.prototype, "node", {
            get: function () {
                var view = this._view;
                return view ? view.node : null;
            },
            enumerable: true,
            configurable: true
        });
        return TextViewController;
    }(NodeViewController));

    var ElementViewController = (function (_super) {
        __extends(ElementViewController, _super);
        function ElementViewController() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(ElementViewController.prototype, "node", {
            get: function () {
                var view = this._view;
                return view ? view.node : null;
            },
            enumerable: true,
            configurable: true
        });
        ElementViewController.prototype.isVisible = function () {
            var view = this._view;
            return view ? view.isVisible() : false;
        };
        ElementViewController.prototype.viewWillSetAttribute = function (name, value, view) {
        };
        ElementViewController.prototype.viewDidSetAttribute = function (name, value, view) {
        };
        ElementViewController.prototype.viewWillSetStyle = function (name, value, priority, view) {
        };
        ElementViewController.prototype.viewDidSetStyle = function (name, value, priority, view) {
        };
        return ElementViewController;
    }(NodeViewController));

    var SvgView = (function (_super) {
        __extends(SvgView, _super);
        function SvgView(node, key) {
            if (key === void 0) { key = null; }
            return _super.call(this, node, key) || this;
        }
        Object.defineProperty(SvgView.prototype, "node", {
            get: function () {
                return this._node;
            },
            enumerable: true,
            configurable: true
        });
        SvgView.prototype.initNode = function (node) {
        };
        Object.defineProperty(SvgView.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: true,
            configurable: true
        });
        SvgView.prototype.append = function (child, key) {
            if (typeof child === "string") {
                child = SvgView.create(child);
            }
            if (child instanceof Node) {
                child = View.fromNode(child);
            }
            if (typeof child === "function") {
                child = View.create(child, key);
            }
            this.appendChildView(child);
            return child;
        };
        SvgView.prototype.prepend = function (child, key) {
            if (typeof child === "string") {
                child = SvgView.create(child);
            }
            if (child instanceof Node) {
                child = View.fromNode(child);
            }
            if (typeof child === "function") {
                child = View.create(child, key);
            }
            this.prependChildView(child);
            return child;
        };
        SvgView.prototype.insert = function (child, target, key) {
            if (typeof child === "string") {
                child = SvgView.create(child);
            }
            if (child instanceof Node) {
                child = View.fromNode(child);
            }
            if (typeof child === "function") {
                child = View.create(child, key);
            }
            this.insertChild(child, target);
            return child;
        };
        Object.defineProperty(SvgView.prototype, "parentTransform", {
            get: function () {
                var transform = this.transform();
                return transform || Transform.identity();
            },
            enumerable: true,
            configurable: true
        });
        SvgView.prototype.on = function (type, listener, options) {
            this._node.addEventListener(type, listener, options);
            return this;
        };
        SvgView.prototype.off = function (type, listener, options) {
            this._node.removeEventListener(type, listener, options);
            return this;
        };
        SvgView.prototype.font = function (value, tween, priority) {
            if (value === void 0) {
                var style = this.fontStyle();
                var variant = this.fontVariant();
                var weight = this.fontWeight();
                var stretch = this.fontStretch();
                var size = this.fontSize();
                var height = this.lineHeight();
                var family = this.fontFamily();
                if (family !== null && family !== void 0) {
                    return Font.from(style, variant, weight, stretch, size, height, family);
                }
                else {
                    return void 0;
                }
            }
            else {
                value = value !== null ? Font.fromAny(value) : null;
                if (value === null || value.style() !== null) {
                    this.fontStyle(value !== null ? value.style() : null, tween, priority);
                }
                if (value === null || value.variant() !== null) {
                    this.fontVariant(value !== null ? value.variant() : null, tween, priority);
                }
                if (value === null || value.weight() !== null) {
                    this.fontWeight(value !== null ? value.weight() : null, tween, priority);
                }
                if (value === null || value.stretch() !== null) {
                    this.fontStretch(value !== null ? value.stretch() : null, tween, priority);
                }
                if (value === null || value.size() !== null) {
                    this.fontSize(value !== null ? value.size() : null, tween, priority);
                }
                if (value === null || value.height() !== null) {
                    this.lineHeight(value !== null ? value.height() : null, tween, priority);
                }
                this.fontFamily(value !== null ? value.family() : null, tween, priority);
                return this;
            }
        };
        SvgView.create = function (tag) {
            if (typeof tag === "string") {
                if (tag === "canvas") {
                    return new View.Canvas(document.createElement(tag));
                }
                else {
                    return new SvgView(document.createElementNS(SvgView.NS, tag));
                }
            }
            else if (typeof tag === "function") {
                return new tag(document.createElementNS(SvgView.NS, tag.tag));
            }
            throw new TypeError("" + tag);
        };
        SvgView.tag = "svg";
        SvgView.NS = "http://www.w3.org/2000/svg";
        __decorate([
            AttributeAnimator("alignment-baseline", String)
        ], SvgView.prototype, "alignmentBaseline", void 0);
        __decorate([
            AttributeAnimator("clip-path", String)
        ], SvgView.prototype, "clipPath", void 0);
        __decorate([
            AttributeAnimator("cursor", String)
        ], SvgView.prototype, "cursor", void 0);
        __decorate([
            AttributeAnimator("cx", Number)
        ], SvgView.prototype, "cx", void 0);
        __decorate([
            AttributeAnimator("cy", Number)
        ], SvgView.prototype, "cy", void 0);
        __decorate([
            AttributeAnimator("d", String)
        ], SvgView.prototype, "d", void 0);
        __decorate([
            AttributeAnimator("dx", [Number, String])
        ], SvgView.prototype, "dx", void 0);
        __decorate([
            AttributeAnimator("dy", [Number, String])
        ], SvgView.prototype, "dy", void 0);
        __decorate([
            AttributeAnimator("edgeMode", String)
        ], SvgView.prototype, "edgeMode", void 0);
        __decorate([
            AttributeAnimator("fill", [Color, String])
        ], SvgView.prototype, "fill", void 0);
        __decorate([
            AttributeAnimator("fill-rule", String)
        ], SvgView.prototype, "fillRuke", void 0);
        __decorate([
            AttributeAnimator("height", Length)
        ], SvgView.prototype, "height", void 0);
        __decorate([
            AttributeAnimator("in", String)
        ], SvgView.prototype, "in", void 0);
        __decorate([
            AttributeAnimator("in2", String)
        ], SvgView.prototype, "in2", void 0);
        __decorate([
            AttributeAnimator("mode", String)
        ], SvgView.prototype, "mode", void 0);
        __decorate([
            AttributeAnimator("opacity", Number)
        ], SvgView.prototype, "opacity", void 0);
        __decorate([
            AttributeAnimator("points", String)
        ], SvgView.prototype, "points", void 0);
        __decorate([
            AttributeAnimator("preserveAspectRatio", Boolean)
        ], SvgView.prototype, "preserveAspectRatio", void 0);
        __decorate([
            AttributeAnimator("r", Number)
        ], SvgView.prototype, "r", void 0);
        __decorate([
            AttributeAnimator("result", String)
        ], SvgView.prototype, "result", void 0);
        __decorate([
            AttributeAnimator("stdDeviation", String)
        ], SvgView.prototype, "stdDeviation", void 0);
        __decorate([
            AttributeAnimator("stroke", [Color, String])
        ], SvgView.prototype, "stroke", void 0);
        __decorate([
            AttributeAnimator("stroke-dasharray", String)
        ], SvgView.prototype, "strokeDasharray", void 0);
        __decorate([
            AttributeAnimator("stroke-width", Number)
        ], SvgView.prototype, "strokeWidth", void 0);
        __decorate([
            AttributeAnimator("text-anchor", String)
        ], SvgView.prototype, "textAnchor", void 0);
        __decorate([
            AttributeAnimator("transform", Transform)
        ], SvgView.prototype, "transform", void 0);
        __decorate([
            AttributeAnimator("type", String)
        ], SvgView.prototype, "type", void 0);
        __decorate([
            AttributeAnimator("values", String)
        ], SvgView.prototype, "values", void 0);
        __decorate([
            AttributeAnimator("viewBox", String)
        ], SvgView.prototype, "viewBox", void 0);
        __decorate([
            AttributeAnimator("width", Length)
        ], SvgView.prototype, "width", void 0);
        __decorate([
            AttributeAnimator("x", Number)
        ], SvgView.prototype, "x", void 0);
        __decorate([
            AttributeAnimator("x1", Number)
        ], SvgView.prototype, "x1", void 0);
        __decorate([
            AttributeAnimator("x2", Number)
        ], SvgView.prototype, "x2", void 0);
        __decorate([
            AttributeAnimator("y", Number)
        ], SvgView.prototype, "y", void 0);
        __decorate([
            AttributeAnimator("y1", Number)
        ], SvgView.prototype, "y1", void 0);
        __decorate([
            AttributeAnimator("y2", Number)
        ], SvgView.prototype, "y2", void 0);
        __decorate([
            StyleAnimator("font-family", FontFamily)
        ], SvgView.prototype, "fontFamily", void 0);
        __decorate([
            StyleAnimator("font-size", [Length, String])
        ], SvgView.prototype, "fontSize", void 0);
        __decorate([
            StyleAnimator("font-stretch", String)
        ], SvgView.prototype, "fontStretch", void 0);
        __decorate([
            StyleAnimator("font-style", String)
        ], SvgView.prototype, "fontStyle", void 0);
        __decorate([
            StyleAnimator("font-variant", String)
        ], SvgView.prototype, "fontVariant", void 0);
        __decorate([
            StyleAnimator("font-weight", String)
        ], SvgView.prototype, "fontWeight", void 0);
        __decorate([
            StyleAnimator("line-height", LineHeight)
        ], SvgView.prototype, "lineHeight", void 0);
        return SvgView;
    }(ElementView));
    View.Svg = SvgView;

    var SvgViewController = (function (_super) {
        __extends(SvgViewController, _super);
        function SvgViewController() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(SvgViewController.prototype, "node", {
            get: function () {
                var view = this._view;
                return view ? view.node : null;
            },
            enumerable: true,
            configurable: true
        });
        return SvgViewController;
    }(ElementViewController));

    var HtmlView = (function (_super) {
        __extends(HtmlView, _super);
        function HtmlView(node, key) {
            if (key === void 0) { key = null; }
            return _super.call(this, node, key) || this;
        }
        Object.defineProperty(HtmlView.prototype, "node", {
            get: function () {
                return this._node;
            },
            enumerable: true,
            configurable: true
        });
        HtmlView.prototype.initNode = function (node) {
        };
        Object.defineProperty(HtmlView.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: true,
            configurable: true
        });
        HtmlView.prototype.append = function (child, key) {
            if (typeof child === "string") {
                child = HtmlView.create(child);
            }
            if (child instanceof Node) {
                child = View.fromNode(child);
            }
            if (typeof child === "function") {
                child = View.create(child, key);
            }
            this.appendChildView(child);
            return child;
        };
        HtmlView.prototype.prepend = function (child, key) {
            if (typeof child === "string") {
                child = HtmlView.create(child);
            }
            if (child instanceof Node) {
                child = View.fromNode(child);
            }
            if (typeof child === "function") {
                child = View.create(child, key);
            }
            this.prependChildView(child);
            return child;
        };
        HtmlView.prototype.insert = function (child, target, key) {
            if (typeof child === "string") {
                child = HtmlView.create(child);
            }
            if (child instanceof Node) {
                child = View.fromNode(child);
            }
            if (typeof child === "function") {
                child = View.create(child, key);
            }
            this.insertChild(child, target);
            return child;
        };
        Object.defineProperty(HtmlView.prototype, "parentTransform", {
            get: function () {
                var transform = this.transform();
                return transform || Transform.identity();
            },
            enumerable: true,
            configurable: true
        });
        HtmlView.prototype.variable = function (name, value, strength) {
            if (value === void 0) {
                value = 0;
            }
            if (strength === void 0) {
                strength = ConstraintStrength.Strong;
            }
            else {
                strength = ConstraintStrength.fromAny(strength);
            }
            return new ConstrainBinding(this, name, value, strength);
        };
        HtmlView.prototype.constraint = function (lhs, relation, rhs, strength) {
            if (typeof lhs === "number") {
                lhs = Constrain.constant(lhs);
            }
            if (typeof rhs === "number") {
                rhs = Constrain.constant(rhs);
            }
            var constrain = rhs ? lhs.minus(rhs) : lhs;
            if (strength === void 0) {
                strength = ConstraintStrength.Required;
            }
            else {
                strength = ConstraintStrength.fromAny(strength);
            }
            return new Constraint(this, constrain, relation, strength);
        };
        Object.defineProperty(HtmlView.prototype, "variables", {
            get: function () {
                if (this._variables === void 0) {
                    this._variables = [];
                }
                return this._variables;
            },
            enumerable: true,
            configurable: true
        });
        HtmlView.prototype.hasVariable = function (variable) {
            return this._variables !== void 0 && this._variables.indexOf(variable) >= 0;
        };
        HtmlView.prototype.addVariable = function (variable) {
            if (this._variables === void 0) {
                this._variables = [];
            }
            if (this._variables.indexOf(variable) < 0) {
                this._variables.push(variable);
                this.activateVariable(variable);
            }
        };
        HtmlView.prototype.activateVariable = function (variable) {
            var appView = this.appView;
            if (LayoutManager.is(appView)) {
                appView.activateVariable(variable);
            }
        };
        HtmlView.prototype.removeVariable = function (variable) {
            if (this._variables !== void 0) {
                var index = this._variables.indexOf(variable);
                if (index >= 0) {
                    this._variables.splice(index, 1);
                    this.deactivateVariable(variable);
                }
            }
        };
        HtmlView.prototype.deactivateVariable = function (variable) {
            var appView = this.appView;
            if (LayoutManager.is(appView)) {
                appView.deactivateVariable(variable);
            }
        };
        HtmlView.prototype.setVariableState = function (variable, state) {
            var appView = this.appView;
            if (LayoutManager.is(appView)) {
                appView.setVariableState(variable, state);
            }
        };
        Object.defineProperty(HtmlView.prototype, "constraints", {
            get: function () {
                if (this._constraints === void 0) {
                    this._constraints = [];
                }
                return this._constraints;
            },
            enumerable: true,
            configurable: true
        });
        HtmlView.prototype.hasConstraint = function (constraint) {
            return this._constraints !== void 0 && this._constraints.indexOf(constraint) >= 0;
        };
        HtmlView.prototype.addConstraint = function (constraint) {
            if (this._constraints === void 0) {
                this._constraints = [];
            }
            if (this._constraints.indexOf(constraint) < 0) {
                this._constraints.push(constraint);
                this.activateConstraint(constraint);
            }
        };
        HtmlView.prototype.activateConstraint = function (constraint) {
            var appView = this.appView;
            if (LayoutManager.is(appView)) {
                appView.activateConstraint(constraint);
            }
        };
        HtmlView.prototype.removeConstraint = function (constraint) {
            if (this._constraints !== void 0) {
                var index = this._constraints.indexOf(constraint);
                if (index >= 0) {
                    this._constraints.splice(index, 1);
                    this.deactivateConstraint(constraint);
                }
            }
        };
        HtmlView.prototype.deactivateConstraint = function (constraint) {
            var appView = this.appView;
            if (LayoutManager.is(appView)) {
                appView.deactivateConstraint(constraint);
            }
        };
        HtmlView.prototype.activateLayout = function () {
            var variables = this._variables;
            var constraints = this._constraints;
            var appView;
            if ((variables !== void 0 || constraints !== void 0)
                && (appView = this.appView, LayoutManager.is(appView))) {
                for (var i = 0, n = variables !== void 0 ? variables.length : 0; i < n; i += 1) {
                    var variable = variables[i];
                    if (variable instanceof LayoutAnchor) {
                        appView.activateVariable(variable);
                    }
                }
                for (var i = 0, n = constraints !== void 0 ? constraints.length : 0; i < n; i += 1) {
                    appView.activateConstraint(constraints[i]);
                }
            }
        };
        HtmlView.prototype.deactivateLayout = function () {
            var variables = this._variables;
            var constraints = this._constraints;
            var appView;
            if ((variables !== void 0 || constraints !== void 0)
                && (appView = this.appView, LayoutManager.is(appView))) {
                for (var i = 0, n = constraints !== void 0 ? constraints.length : 0; i < n; i += 1) {
                    appView.deactivateConstraint(constraints[i]);
                }
                for (var i = 0, n = variables !== void 0 ? variables.length : 0; i < n; i += 1) {
                    appView.deactivateVariable(variables[i]);
                }
            }
        };
        HtmlView.prototype.updateLayoutStates = function () {
            var offsetParent = this._node.offsetParent;
            if (offsetParent) {
                var offsetBounds = offsetParent.getBoundingClientRect();
                var bounds = this._node.getBoundingClientRect();
                var topAnchor = this.hasOwnProperty("topAnchor") ? this.topAnchor : void 0;
                var rightAnchor = this.hasOwnProperty("rightAnchor") ? this.rightAnchor : void 0;
                var bottomAnchor = this.hasOwnProperty("bottomAnchor") ? this.bottomAnchor : void 0;
                var leftAnchor = this.hasOwnProperty("leftAnchor") ? this.leftAnchor : void 0;
                var widthAnchor = this.hasOwnProperty("widthAnchor") ? this.widthAnchor : void 0;
                var heightAnchor = this.hasOwnProperty("heightAnchor") ? this.heightAnchor : void 0;
                var centerXAnchor = this.hasOwnProperty("centerXAnchor") ? this.centerXAnchor : void 0;
                var centerYAnchor = this.hasOwnProperty("centerYAnchor") ? this.centerYAnchor : void 0;
                if (topAnchor && !topAnchor.enabled()) {
                    topAnchor.setState(bounds.top - offsetBounds.top);
                }
                if (rightAnchor && !rightAnchor.enabled()) {
                    rightAnchor.setState(offsetBounds.right + bounds.right);
                }
                if (bottomAnchor && !bottomAnchor.enabled()) {
                    bottomAnchor.setState(offsetBounds.bottom + bounds.bottom);
                }
                if (leftAnchor && !leftAnchor.enabled()) {
                    leftAnchor.setState(bounds.left - offsetBounds.left);
                }
                if (widthAnchor && !widthAnchor.enabled()) {
                    widthAnchor.setState(bounds.width);
                }
                if (heightAnchor && !heightAnchor.enabled()) {
                    heightAnchor.setState(bounds.height);
                }
                if (centerXAnchor && !centerXAnchor.enabled()) {
                    centerXAnchor.setState(bounds.left + 0.5 * bounds.width - offsetBounds.left);
                }
                if (centerYAnchor && !centerYAnchor.enabled()) {
                    centerYAnchor.setState(bounds.top + 0.5 * bounds.height - offsetBounds.top);
                }
            }
        };
        HtmlView.prototype.updateLayoutValues = function () {
            var offsetParent = this._node.offsetParent;
            if (offsetParent) {
                var topAnchor = this.hasOwnProperty("topAnchor") ? this.topAnchor : void 0;
                var rightAnchor = this.hasOwnProperty("rightAnchor") ? this.rightAnchor : void 0;
                var bottomAnchor = this.hasOwnProperty("bottomAnchor") ? this.bottomAnchor : void 0;
                var leftAnchor = this.hasOwnProperty("leftAnchor") ? this.leftAnchor : void 0;
                var widthAnchor = this.hasOwnProperty("widthAnchor") ? this.widthAnchor : void 0;
                var heightAnchor = this.hasOwnProperty("heightAnchor") ? this.heightAnchor : void 0;
                var centerXAnchor = this.hasOwnProperty("centerXAnchor") ? this.centerXAnchor : void 0;
                var centerYAnchor = this.hasOwnProperty("centerYAnchor") ? this.centerYAnchor : void 0;
                if (topAnchor && topAnchor.enabled()) {
                    this.top.setState(Length.px(topAnchor.value));
                }
                if (rightAnchor && rightAnchor.enabled()) {
                    this.right.setState(Length.px(rightAnchor.value));
                }
                if (bottomAnchor && bottomAnchor.enabled()) {
                    this.bottom.setState(Length.px(bottomAnchor.value));
                }
                if (leftAnchor && leftAnchor.enabled()) {
                    this.left.setState(Length.px(leftAnchor.value));
                }
                if (widthAnchor && widthAnchor.enabled()) {
                    this.width.setState(Length.px(widthAnchor.value));
                }
                if (heightAnchor && heightAnchor.enabled()) {
                    this.height.setState(Length.px(heightAnchor.value));
                }
                if (centerXAnchor && centerXAnchor.enabled()) {
                    if (leftAnchor && leftAnchor.enabled()) {
                        this.width.setState(Length.px(2 * (centerXAnchor.value - leftAnchor.value)));
                    }
                    else if (rightAnchor && rightAnchor.enabled()) {
                        this.width.setState(Length.px(2 * (rightAnchor.value - centerXAnchor.value)));
                    }
                    else if (widthAnchor && widthAnchor.enabled()) {
                        this.left.setState(Length.px(centerXAnchor.value - 0.5 * widthAnchor.value));
                    }
                }
                if (centerYAnchor && centerYAnchor.enabled()) {
                    if (topAnchor && topAnchor.enabled()) {
                        this.height.setState(Length.px(2 * (centerYAnchor.value - topAnchor.value)));
                    }
                    else if (bottomAnchor && bottomAnchor.enabled()) {
                        this.height.setState(Length.px(2 * (bottomAnchor.value - centerYAnchor.value)));
                    }
                    else if (heightAnchor && heightAnchor.enabled()) {
                        this.top.setState(Length.px(centerYAnchor.value - 0.5 * heightAnchor.value));
                    }
                }
            }
        };
        HtmlView.prototype.didMount = function () {
            _super.prototype.didMount.call(this);
            this.activateLayout();
        };
        HtmlView.prototype.willUnmount = function () {
            this.deactivateLayout();
            _super.prototype.willUnmount.call(this);
        };
        HtmlView.prototype.didResize = function () {
            _super.prototype.didResize.call(this);
            this.updateLayoutStates();
        };
        HtmlView.prototype.willLayout = function () {
            this.updateLayoutValues();
            _super.prototype.willLayout.call(this);
        };
        HtmlView.prototype.on = function (type, listener, options) {
            this._node.addEventListener(type, listener, options);
            return this;
        };
        HtmlView.prototype.off = function (type, listener, options) {
            this._node.removeEventListener(type, listener, options);
            return this;
        };
        HtmlView.prototype.borderColor = function (value, tween, priority) {
            if (value === void 0) {
                var borderTopColor = this.borderTopColor();
                var borderRightColor = this.borderRightColor();
                var borderBottomColor = this.borderBottomColor();
                var borderLeftColor = this.borderLeftColor();
                if (util.Objects.equal(borderTopColor, borderRightColor)
                    && util.Objects.equal(borderRightColor, borderBottomColor)
                    && util.Objects.equal(borderBottomColor, borderLeftColor)) {
                    return borderTopColor;
                }
                else {
                    return [borderTopColor, borderRightColor, borderBottomColor, borderLeftColor];
                }
            }
            else {
                if (Array.isArray(value)) {
                    if (value.length >= 1) {
                        this.borderTopColor(value[0], tween, priority);
                    }
                    if (value.length >= 2) {
                        this.borderRightColor(value[1], tween, priority);
                    }
                    if (value.length >= 3) {
                        this.borderBottomColor(value[2], tween, priority);
                    }
                    if (value.length >= 4) {
                        this.borderLeftColor(value[3], tween, priority);
                    }
                }
                else {
                    this.borderTopColor(value, tween, priority);
                    this.borderRightColor(value, tween, priority);
                    this.borderBottomColor(value, tween, priority);
                    this.borderLeftColor(value, tween, priority);
                }
                return this;
            }
        };
        HtmlView.prototype.borderRadius = function (value, tween, priority) {
            if (value === void 0) {
                var borderTopLeftRadius = this.borderTopLeftRadius();
                var borderTopRightRadius = this.borderTopRightRadius();
                var borderBottomRightRadius = this.borderBottomRightRadius();
                var borderBottomLeftRadius = this.borderBottomLeftRadius();
                if (util.Objects.equal(borderTopLeftRadius, borderTopRightRadius)
                    && util.Objects.equal(borderTopRightRadius, borderBottomRightRadius)
                    && util.Objects.equal(borderBottomRightRadius, borderBottomLeftRadius)) {
                    return borderTopLeftRadius;
                }
                else {
                    return [borderTopLeftRadius, borderTopRightRadius, borderBottomRightRadius, borderBottomLeftRadius];
                }
            }
            else {
                if (Array.isArray(value)) {
                    if (value.length >= 1) {
                        this.borderTopLeftRadius(value[0], tween, priority);
                    }
                    if (value.length >= 2) {
                        this.borderTopRightRadius(value[1], tween, priority);
                    }
                    if (value.length >= 3) {
                        this.borderBottomRightRadius(value[2], tween, priority);
                    }
                    if (value.length >= 4) {
                        this.borderBottomLeftRadius(value[3], tween, priority);
                    }
                }
                else {
                    this.borderTopLeftRadius(value, tween, priority);
                    this.borderTopRightRadius(value, tween, priority);
                    this.borderBottomRightRadius(value, tween, priority);
                    this.borderBottomLeftRadius(value, tween, priority);
                }
                return this;
            }
        };
        HtmlView.prototype.borderStyle = function (value, tween, priority) {
            if (value === void 0) {
                var borderTopStyle = this.borderTopStyle();
                var borderRightStyle = this.borderRightStyle();
                var borderBottomStyle = this.borderBottomStyle();
                var borderLeftStyle = this.borderLeftStyle();
                if (util.Objects.equal(borderTopStyle, borderRightStyle)
                    && util.Objects.equal(borderRightStyle, borderBottomStyle)
                    && util.Objects.equal(borderBottomStyle, borderLeftStyle)) {
                    return borderTopStyle;
                }
                else {
                    return [borderTopStyle, borderRightStyle, borderBottomStyle, borderLeftStyle];
                }
            }
            else {
                if (Array.isArray(value)) {
                    if (value.length >= 1) {
                        this.borderTopStyle(value[0], tween, priority);
                    }
                    if (value.length >= 2) {
                        this.borderRightStyle(value[1], tween, priority);
                    }
                    if (value.length >= 3) {
                        this.borderBottomStyle(value[2], tween, priority);
                    }
                    if (value.length >= 4) {
                        this.borderLeftStyle(value[3], tween, priority);
                    }
                }
                else {
                    this.borderTopStyle(value, tween, priority);
                    this.borderRightStyle(value, tween, priority);
                    this.borderBottomStyle(value, tween, priority);
                    this.borderLeftStyle(value, tween, priority);
                }
                return this;
            }
        };
        HtmlView.prototype.borderWidth = function (value, tween, priority) {
            if (value === void 0) {
                var borderTopWidth = this.borderTopWidth();
                var borderRightWidth = this.borderRightWidth();
                var borderBottomWidth = this.borderBottomWidth();
                var borderLeftWidth = this.borderLeftWidth();
                if (util.Objects.equal(borderTopWidth, borderRightWidth)
                    && util.Objects.equal(borderRightWidth, borderBottomWidth)
                    && util.Objects.equal(borderBottomWidth, borderLeftWidth)) {
                    return borderTopWidth;
                }
                else {
                    return [borderTopWidth, borderRightWidth, borderBottomWidth, borderLeftWidth];
                }
            }
            else {
                if (Array.isArray(value)) {
                    if (value.length >= 1) {
                        this.borderTopWidth(value[0], tween, priority);
                    }
                    if (value.length >= 2) {
                        this.borderRightWidth(value[1], tween, priority);
                    }
                    if (value.length >= 3) {
                        this.borderBottomWidth(value[2], tween, priority);
                    }
                    if (value.length >= 4) {
                        this.borderLeftWidth(value[3], tween, priority);
                    }
                }
                else {
                    this.borderTopWidth(value, tween, priority);
                    this.borderRightWidth(value, tween, priority);
                    this.borderBottomWidth(value, tween, priority);
                    this.borderLeftWidth(value, tween, priority);
                }
                return this;
            }
        };
        HtmlView.prototype.font = function (value, tween, priority) {
            if (value === void 0) {
                var style = this.fontStyle();
                var variant = this.fontVariant();
                var weight = this.fontWeight();
                var stretch = this.fontStretch();
                var size = this.fontSize();
                var height = this.lineHeight();
                var family = this.fontFamily();
                if (family !== null && family !== void 0) {
                    return Font.from(style, variant, weight, stretch, size, height, family);
                }
                else {
                    return void 0;
                }
            }
            else {
                value = value !== null ? Font.fromAny(value) : null;
                if (value === null || value.style() !== null) {
                    this.fontStyle(value !== null ? value.style() : null, tween, priority);
                }
                if (value === null || value.variant() !== null) {
                    this.fontVariant(value !== null ? value.variant() : null, tween, priority);
                }
                if (value === null || value.weight() !== null) {
                    this.fontWeight(value !== null ? value.weight() : null, tween, priority);
                }
                if (value === null || value.stretch() !== null) {
                    this.fontStretch(value !== null ? value.stretch() : null, tween, priority);
                }
                if (value === null || value.size() !== null) {
                    this.fontSize(value !== null ? value.size() : null, tween, priority);
                }
                if (value === null || value.height() !== null) {
                    this.lineHeight(value !== null ? value.height() : null, tween, priority);
                }
                this.fontFamily(value !== null ? value.family() : null, tween, priority);
                return this;
            }
        };
        HtmlView.prototype.margin = function (value, tween, priority) {
            if (value === void 0) {
                var marginTop = this.marginTop();
                var marginRight = this.marginRight();
                var marginBottom = this.marginBottom();
                var marginLeft = this.marginLeft();
                if (util.Objects.equal(marginTop, marginRight)
                    && util.Objects.equal(marginRight, marginBottom)
                    && util.Objects.equal(marginBottom, marginLeft)) {
                    return marginTop;
                }
                else {
                    return [marginTop, marginRight, marginBottom, marginLeft];
                }
            }
            else {
                if (Array.isArray(value)) {
                    if (value.length >= 1) {
                        this.marginTop(value[0], tween, priority);
                    }
                    if (value.length >= 2) {
                        this.marginRight(value[1], tween, priority);
                    }
                    if (value.length >= 3) {
                        this.marginBottom(value[2], tween, priority);
                    }
                    if (value.length >= 4) {
                        this.marginLeft(value[3], tween, priority);
                    }
                }
                else {
                    this.marginTop(value, tween, priority);
                    this.marginRight(value, tween, priority);
                    this.marginBottom(value, tween, priority);
                    this.marginLeft(value, tween, priority);
                }
                return this;
            }
        };
        HtmlView.prototype.padding = function (value, tween, priority) {
            if (value === void 0) {
                var paddingTop = this.paddingTop();
                var paddingRight = this.paddingRight();
                var paddingBottom = this.paddingBottom();
                var paddingLeft = this.paddingLeft();
                if (util.Objects.equal(paddingTop, paddingRight)
                    && util.Objects.equal(paddingRight, paddingBottom)
                    && util.Objects.equal(paddingBottom, paddingLeft)) {
                    return paddingTop;
                }
                else {
                    return [paddingTop, paddingRight, paddingBottom, paddingLeft];
                }
            }
            else {
                if (Array.isArray(value)) {
                    if (value.length >= 1) {
                        this.paddingTop(value[0], tween, priority);
                    }
                    if (value.length >= 2) {
                        this.paddingRight(value[1], tween, priority);
                    }
                    if (value.length >= 3) {
                        this.paddingBottom(value[2], tween, priority);
                    }
                    if (value.length >= 4) {
                        this.paddingLeft(value[3], tween, priority);
                    }
                }
                else {
                    this.paddingTop(value, tween, priority);
                    this.paddingRight(value, tween, priority);
                    this.paddingBottom(value, tween, priority);
                    this.paddingLeft(value, tween, priority);
                }
                return this;
            }
        };
        HtmlView.create = function (tag) {
            if (typeof tag === "string") {
                if (tag === "svg") {
                    return new View.Svg(document.createElementNS(View.Svg.NS, tag));
                }
                else if (tag === "canvas") {
                    return new View.Canvas(document.createElement(tag));
                }
                else {
                    return new HtmlView(document.createElement(tag));
                }
            }
            else if (typeof tag === "function") {
                return new tag(document.createElement(tag.tag));
            }
            throw new TypeError("" + tag);
        };
        HtmlView.tag = "div";
        __decorate([
            LayoutAnchor("strong")
        ], HtmlView.prototype, "topAnchor", void 0);
        __decorate([
            LayoutAnchor("strong")
        ], HtmlView.prototype, "rightAnchor", void 0);
        __decorate([
            LayoutAnchor("strong")
        ], HtmlView.prototype, "bottomAnchor", void 0);
        __decorate([
            LayoutAnchor("strong")
        ], HtmlView.prototype, "leftAnchor", void 0);
        __decorate([
            LayoutAnchor("strong")
        ], HtmlView.prototype, "widthAnchor", void 0);
        __decorate([
            LayoutAnchor("strong")
        ], HtmlView.prototype, "heightAnchor", void 0);
        __decorate([
            LayoutAnchor("strong")
        ], HtmlView.prototype, "centerXAnchor", void 0);
        __decorate([
            LayoutAnchor("strong")
        ], HtmlView.prototype, "centerYAnchor", void 0);
        __decorate([
            AttributeAnimator("autocomplete", String)
        ], HtmlView.prototype, "autocomplete", void 0);
        __decorate([
            AttributeAnimator("checked", Boolean)
        ], HtmlView.prototype, "checked", void 0);
        __decorate([
            AttributeAnimator("disabled", Boolean)
        ], HtmlView.prototype, "disabled", void 0);
        __decorate([
            AttributeAnimator("placeholder", String)
        ], HtmlView.prototype, "placeholder", void 0);
        __decorate([
            AttributeAnimator("selected", Boolean)
        ], HtmlView.prototype, "selected", void 0);
        __decorate([
            AttributeAnimator("title", String)
        ], HtmlView.prototype, "title", void 0);
        __decorate([
            AttributeAnimator("type", String)
        ], HtmlView.prototype, "type", void 0);
        __decorate([
            AttributeAnimator("value", String)
        ], HtmlView.prototype, "value", void 0);
        __decorate([
            StyleAnimator("align-content", String)
        ], HtmlView.prototype, "alignContent", void 0);
        __decorate([
            StyleAnimator("align-items", String)
        ], HtmlView.prototype, "alignItems", void 0);
        __decorate([
            StyleAnimator("align-self", String)
        ], HtmlView.prototype, "alignSelf", void 0);
        __decorate([
            StyleAnimator("appearance", String)
        ], HtmlView.prototype, "appearance", void 0);
        __decorate([
            StyleAnimator(["backdrop-filter", "-webkit-backdrop-filter"], String)
        ], HtmlView.prototype, "backdropFilter", void 0);
        __decorate([
            StyleAnimator("background-color", Color)
        ], HtmlView.prototype, "backgroundColor", void 0);
        __decorate([
            StyleAnimator("border-collapse", String)
        ], HtmlView.prototype, "borderCollapse", void 0);
        __decorate([
            StyleAnimator("border-top-color", [Color, String])
        ], HtmlView.prototype, "borderTopColor", void 0);
        __decorate([
            StyleAnimator("border-right-color", [Color, String])
        ], HtmlView.prototype, "borderRightColor", void 0);
        __decorate([
            StyleAnimator("border-bottom-color", [Color, String])
        ], HtmlView.prototype, "borderBottomColor", void 0);
        __decorate([
            StyleAnimator("border-left-color", [Color, String])
        ], HtmlView.prototype, "borderLeftColor", void 0);
        __decorate([
            StyleAnimator("border-top-left-radius", Length)
        ], HtmlView.prototype, "borderTopLeftRadius", void 0);
        __decorate([
            StyleAnimator("border-top-right-radius", Length)
        ], HtmlView.prototype, "borderTopRightRadius", void 0);
        __decorate([
            StyleAnimator("border-bottom-right-radius", Length)
        ], HtmlView.prototype, "borderBottomRightRadius", void 0);
        __decorate([
            StyleAnimator("border-bottom-left-radius", Length)
        ], HtmlView.prototype, "borderBottomLeftRadius", void 0);
        __decorate([
            StyleAnimator("border-spacing", String)
        ], HtmlView.prototype, "borderSpacing", void 0);
        __decorate([
            StyleAnimator("border-top-style", String)
        ], HtmlView.prototype, "borderTopStyle", void 0);
        __decorate([
            StyleAnimator("border-right-style", String)
        ], HtmlView.prototype, "borderRightStyle", void 0);
        __decorate([
            StyleAnimator("border-bottom-style", String)
        ], HtmlView.prototype, "borderBottomStyle", void 0);
        __decorate([
            StyleAnimator("border-left-style", String)
        ], HtmlView.prototype, "borderLeftStyle", void 0);
        __decorate([
            StyleAnimator("border-top-width", [Length, String])
        ], HtmlView.prototype, "borderTopWidth", void 0);
        __decorate([
            StyleAnimator("border-right-width", [Length, String])
        ], HtmlView.prototype, "borderRightWidth", void 0);
        __decorate([
            StyleAnimator("border-bottom-width", [Length, String])
        ], HtmlView.prototype, "borderBottomWidth", void 0);
        __decorate([
            StyleAnimator("border-left-width", [Length, String])
        ], HtmlView.prototype, "borderLeftWidth", void 0);
        __decorate([
            StyleAnimator("bottom", [Length, String])
        ], HtmlView.prototype, "bottom", void 0);
        __decorate([
            StyleAnimator("box-shadow", BoxShadow)
        ], HtmlView.prototype, "boxShadow", void 0);
        __decorate([
            StyleAnimator("box-sizing", String)
        ], HtmlView.prototype, "boxSizing", void 0);
        __decorate([
            StyleAnimator("color", [Color, String])
        ], HtmlView.prototype, "color", void 0);
        __decorate([
            StyleAnimator("cursor", String)
        ], HtmlView.prototype, "cursor", void 0);
        __decorate([
            StyleAnimator("display", String)
        ], HtmlView.prototype, "display", void 0);
        __decorate([
            StyleAnimator("filter", String)
        ], HtmlView.prototype, "filter", void 0);
        __decorate([
            StyleAnimator("flex-basis", [Length, String])
        ], HtmlView.prototype, "flexBasis", void 0);
        __decorate([
            StyleAnimator("flex-direction", String)
        ], HtmlView.prototype, "flexDirection", void 0);
        __decorate([
            StyleAnimator("flex-grow", Number)
        ], HtmlView.prototype, "flexGrow", void 0);
        __decorate([
            StyleAnimator("flex-shrink", Number)
        ], HtmlView.prototype, "flexShrink", void 0);
        __decorate([
            StyleAnimator("flex-wrap", String)
        ], HtmlView.prototype, "flexWrap", void 0);
        __decorate([
            StyleAnimator("font-family", FontFamily)
        ], HtmlView.prototype, "fontFamily", void 0);
        __decorate([
            StyleAnimator("font-size", [Length, String])
        ], HtmlView.prototype, "fontSize", void 0);
        __decorate([
            StyleAnimator("font-stretch", String)
        ], HtmlView.prototype, "fontStretch", void 0);
        __decorate([
            StyleAnimator("font-style", String)
        ], HtmlView.prototype, "fontStyle", void 0);
        __decorate([
            StyleAnimator("font-variant", String)
        ], HtmlView.prototype, "fontVariant", void 0);
        __decorate([
            StyleAnimator("font-weight", String)
        ], HtmlView.prototype, "fontWeight", void 0);
        __decorate([
            StyleAnimator("height", [Length, String])
        ], HtmlView.prototype, "height", void 0);
        __decorate([
            StyleAnimator("justify-content", String)
        ], HtmlView.prototype, "justifyContent", void 0);
        __decorate([
            StyleAnimator("left", [Length, String])
        ], HtmlView.prototype, "left", void 0);
        __decorate([
            StyleAnimator("line-height", LineHeight)
        ], HtmlView.prototype, "lineHeight", void 0);
        __decorate([
            StyleAnimator("margin-top", [Length, String])
        ], HtmlView.prototype, "marginTop", void 0);
        __decorate([
            StyleAnimator("margin-right", [Length, String])
        ], HtmlView.prototype, "marginRight", void 0);
        __decorate([
            StyleAnimator("margin-bottom", [Length, String])
        ], HtmlView.prototype, "marginBottom", void 0);
        __decorate([
            StyleAnimator("margin-left", [Length, String])
        ], HtmlView.prototype, "marginLeft", void 0);
        __decorate([
            StyleAnimator("max-height", [Length, String])
        ], HtmlView.prototype, "maxHeight", void 0);
        __decorate([
            StyleAnimator("max-width", [Length, String])
        ], HtmlView.prototype, "maxWidth", void 0);
        __decorate([
            StyleAnimator("min-height", [Length, String])
        ], HtmlView.prototype, "minHeight", void 0);
        __decorate([
            StyleAnimator("min-width", [Length, String])
        ], HtmlView.prototype, "minWidth", void 0);
        __decorate([
            StyleAnimator("opacity", Number)
        ], HtmlView.prototype, "opacity", void 0);
        __decorate([
            StyleAnimator("order", Number)
        ], HtmlView.prototype, "order", void 0);
        __decorate([
            StyleAnimator("outline-color", [Color, String])
        ], HtmlView.prototype, "outlineColor", void 0);
        __decorate([
            StyleAnimator("outline-style", String)
        ], HtmlView.prototype, "outlineStyle", void 0);
        __decorate([
            StyleAnimator("outline-width", [Length, String])
        ], HtmlView.prototype, "outlineWidth", void 0);
        __decorate([
            StyleAnimator("overflow", String)
        ], HtmlView.prototype, "overflow", void 0);
        __decorate([
            StyleAnimator("overflow-x", String)
        ], HtmlView.prototype, "overflowX", void 0);
        __decorate([
            StyleAnimator("overflow-y", String)
        ], HtmlView.prototype, "overflowY", void 0);
        __decorate([
            StyleAnimator("padding-top", Length)
        ], HtmlView.prototype, "paddingTop", void 0);
        __decorate([
            StyleAnimator("padding-right", Length)
        ], HtmlView.prototype, "paddingRight", void 0);
        __decorate([
            StyleAnimator("padding-bottom", Length)
        ], HtmlView.prototype, "paddingBottom", void 0);
        __decorate([
            StyleAnimator("padding-left", Length)
        ], HtmlView.prototype, "paddingLeft", void 0);
        __decorate([
            StyleAnimator("pointer-events", String)
        ], HtmlView.prototype, "pointerEvents", void 0);
        __decorate([
            StyleAnimator("position", String)
        ], HtmlView.prototype, "position", void 0);
        __decorate([
            StyleAnimator("right", [Length, String])
        ], HtmlView.prototype, "right", void 0);
        __decorate([
            StyleAnimator("text-align", String)
        ], HtmlView.prototype, "textAlign", void 0);
        __decorate([
            StyleAnimator("text-decoration-color", [Color, String])
        ], HtmlView.prototype, "textDecorationColor", void 0);
        __decorate([
            StyleAnimator("text-decoration-line", String)
        ], HtmlView.prototype, "textDecorationLine", void 0);
        __decorate([
            StyleAnimator("text-decoration-style", String)
        ], HtmlView.prototype, "textDecorationStyle", void 0);
        __decorate([
            StyleAnimator("text-overflow", String)
        ], HtmlView.prototype, "textOverflow", void 0);
        __decorate([
            StyleAnimator("text-transform", String)
        ], HtmlView.prototype, "textTransform", void 0);
        __decorate([
            StyleAnimator("top", [Length, String])
        ], HtmlView.prototype, "top", void 0);
        __decorate([
            StyleAnimator("transform", Transform)
        ], HtmlView.prototype, "transform", void 0);
        __decorate([
            StyleAnimator(["user-select", "-webkit-user-select", "-moz-user-select", "-ms-user-select"], String)
        ], HtmlView.prototype, "userSelect", void 0);
        __decorate([
            StyleAnimator("vertical-align", [Length, String])
        ], HtmlView.prototype, "verticalAlign", void 0);
        __decorate([
            StyleAnimator("visibility", String)
        ], HtmlView.prototype, "visibility", void 0);
        __decorate([
            StyleAnimator("white-space", String)
        ], HtmlView.prototype, "whiteSpace", void 0);
        __decorate([
            StyleAnimator("width", [Length, String])
        ], HtmlView.prototype, "width", void 0);
        __decorate([
            StyleAnimator("z-index", [Number, String])
        ], HtmlView.prototype, "zIndex", void 0);
        return HtmlView;
    }(ElementView));
    View.Html = HtmlView;

    var HtmlViewController = (function (_super) {
        __extends(HtmlViewController, _super);
        function HtmlViewController() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(HtmlViewController.prototype, "node", {
            get: function () {
                var view = this._view;
                return view ? view.node : null;
            },
            enumerable: true,
            configurable: true
        });
        return HtmlViewController;
    }(ElementViewController));

    var CanvasView = (function (_super) {
        __extends(CanvasView, _super);
        function CanvasView(node, key) {
            if (key === void 0) { key = null; }
            var _this = _super.call(this, node, key) || this;
            _this.onClick = _this.onClick.bind(_this);
            _this.onDblClick = _this.onDblClick.bind(_this);
            _this.onContextMenu = _this.onContextMenu.bind(_this);
            _this.onMouseDown = _this.onMouseDown.bind(_this);
            _this.onMouseMove = _this.onMouseMove.bind(_this);
            _this.onMouseUp = _this.onMouseUp.bind(_this);
            _this.onWheel = _this.onWheel.bind(_this);
            _this.onTouchStart = _this.onTouchStart.bind(_this);
            _this.onTouchMove = _this.onTouchMove.bind(_this);
            _this.onTouchCancel = _this.onTouchCancel.bind(_this);
            _this.onTouchEnd = _this.onTouchEnd.bind(_this);
            _this._renderViews = [];
            _this._bounds = math.BoxR2.empty();
            _this._anchor = math.PointR2.origin();
            _this._dirty = true;
            _this._clientX = 0;
            _this._clientY = 0;
            _this._screenX = 0;
            _this._screenY = 0;
            _this._hoverView = null;
            _this._touches = {};
            return _this;
        }
        Object.defineProperty(CanvasView.prototype, "node", {
            get: function () {
                return this._node;
            },
            enumerable: true,
            configurable: true
        });
        CanvasView.prototype.initNode = function (node) {
            node.style.position = "absolute";
        };
        Object.defineProperty(CanvasView.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CanvasView.prototype, "canvasView", {
            get: function () {
                return this;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CanvasView.prototype, "childViews", {
            get: function () {
                var childNodes = this._node.childNodes;
                var childViews = [];
                for (var i = 0, n = childNodes.length; i < n; i += 1) {
                    var childView = childNodes[i].view;
                    if (childView) {
                        childViews.push(childView);
                    }
                }
                childViews.push.apply(childViews, this._renderViews);
                return childViews;
            },
            enumerable: true,
            configurable: true
        });
        CanvasView.prototype.getChildView = function (key) {
            var renderViews = this._renderViews;
            for (var i = renderViews.length - 1; i >= 0; i -= 1) {
                var renderView = renderViews[i];
                if (renderView.key() === key) {
                    return renderView;
                }
            }
            var childNodes = this._node.childNodes;
            for (var i = childNodes.length - 1; i >= 0; i -= 1) {
                var childView = childNodes[i].view;
                if (childView && childView.key() === key) {
                    return childView;
                }
            }
            return null;
        };
        CanvasView.prototype.setChildView = function (key, newChildView) {
            if (RenderView.is(newChildView)) {
                return this.setRenderView(key, newChildView);
            }
            else {
                return _super.prototype.setChildView.call(this, key, newChildView);
            }
        };
        CanvasView.prototype.setRenderView = function (key, newChildView) {
            if (!RenderView.is(newChildView)) {
                throw new TypeError("" + newChildView);
            }
            var oldChildView = null;
            var targetView = null;
            var renderViews = this._renderViews;
            var index = renderViews.length - 1;
            while (index >= 0) {
                var childView = renderViews[index];
                if (childView.key() === key) {
                    oldChildView = childView;
                    targetView = renderViews[index + 1] || null;
                    this.willRemoveChildView(childView);
                    childView.setParentView(null);
                    renderViews.splice(index, 1);
                    this.onRemoveChildView(childView);
                    this.didRemoveChildView(childView);
                    break;
                }
                index -= 1;
            }
            if (newChildView) {
                newChildView.key(key);
                this.willInsertChildView(newChildView, targetView);
                if (index >= 0) {
                    renderViews.splice(index, 0, newChildView);
                }
                else {
                    renderViews.push(newChildView);
                }
                newChildView.setParentView(this);
                this.onInsertChildView(newChildView, targetView);
                this.didInsertChildView(newChildView, targetView);
                this.animate();
            }
            return oldChildView;
        };
        Object.defineProperty(CanvasView.prototype, "renderViews", {
            get: function () {
                return this._renderViews;
            },
            enumerable: true,
            configurable: true
        });
        CanvasView.prototype.append = function (child, key) {
            if (typeof child === "string") {
                child = HtmlView.create(child);
            }
            if (child instanceof Node) {
                child = View.fromNode(child);
            }
            if (typeof child === "function") {
                child = View.create(child, key);
            }
            this.appendChildView(child);
            return child;
        };
        CanvasView.prototype.appendChildView = function (childView) {
            if (RenderView.is(childView)) {
                this.appendRenderView(childView);
            }
            else {
                _super.prototype.appendChildView.call(this, childView);
            }
        };
        CanvasView.prototype.appendRenderView = function (renderView) {
            this.willInsertChildView(renderView, null);
            this._renderViews.push(renderView);
            renderView.setParentView(this);
            this.onInsertChildView(renderView, null);
            this.didInsertChildView(renderView, null);
            this.animate();
        };
        CanvasView.prototype.prepend = function (child, key) {
            if (typeof child === "string") {
                child = HtmlView.create(child);
            }
            if (child instanceof Node) {
                child = View.fromNode(child);
            }
            if (typeof child === "function") {
                child = View.create(child, key);
            }
            this.prependChildView(child);
            return child;
        };
        CanvasView.prototype.prependChildView = function (childView) {
            if (RenderView.is(childView)) {
                this.prependRenderView(childView);
            }
            else {
                _super.prototype.prependChildView.call(this, childView);
            }
        };
        CanvasView.prototype.prependRenderView = function (renderView) {
            this.willInsertChildView(renderView, null);
            this._renderViews.unshift(renderView);
            renderView.setParentView(this);
            this.onInsertChildView(renderView, null);
            this.didInsertChildView(renderView, null);
            this.animate();
        };
        CanvasView.prototype.insert = function (child, target, key) {
            if (typeof child === "string") {
                child = HtmlView.create(child);
            }
            if (child instanceof Node) {
                child = View.fromNode(child);
            }
            if (typeof child === "function") {
                child = View.create(child, key);
            }
            this.insertChild(child, target);
            return child;
        };
        CanvasView.prototype.insertChildView = function (childView, targetView) {
            if (RenderView.is(childView) && RenderView.is(targetView)) {
                this.insertRenderView(childView, targetView);
            }
            else {
                _super.prototype.insertChildView.call(this, childView, targetView);
            }
        };
        CanvasView.prototype.insertRenderView = function (renderView, targetView) {
            if (targetView !== null && !RenderView.is(targetView)) {
                throw new TypeError("" + targetView);
            }
            if (targetView !== null && targetView.parentView !== this) {
                throw new TypeError("" + targetView);
            }
            var renderViews = this._renderViews;
            this.willInsertChildView(renderView, targetView);
            var index = targetView ? renderViews.indexOf(targetView) : -1;
            if (index >= 0) {
                renderViews.splice(index, 0, renderView);
            }
            else {
                renderViews.push(renderView);
            }
            renderView.setParentView(this);
            this.onInsertChildView(renderView, targetView);
            this.didInsertChildView(renderView, targetView);
            this.animate();
        };
        CanvasView.prototype.onInsertChildView = function (childView, targetView) {
            _super.prototype.onInsertChildView.call(this, childView, targetView);
            if (RenderView.is(childView)) {
                this.setChildViewBounds(childView, this._bounds);
                this.setChildViewAnchor(childView, this._anchor);
            }
        };
        CanvasView.prototype.removeChildView = function (childView) {
            if (RenderView.is(childView)) {
                this.removeRenderView(childView);
            }
            else {
                _super.prototype.removeChildView.call(this, childView);
            }
        };
        CanvasView.prototype.removeRenderView = function (renderView) {
            if (renderView.parentView !== this) {
                throw new TypeError("" + renderView);
            }
            var renderViews = this._renderViews;
            this.willRemoveChildView(renderView);
            renderView.setParentView(null);
            var index = renderViews.indexOf(renderView);
            if (index >= 0) {
                renderViews.splice(index, 1);
            }
            this.onRemoveChildView(renderView);
            this.didRemoveChildView(renderView);
            this.animate();
        };
        CanvasView.prototype.removeAll = function () {
            _super.prototype.removeAll.call(this);
            var renderViews = this._renderViews;
            do {
                var count = renderViews.length;
                if (count > 0) {
                    var childView = renderViews[count - 1];
                    this.willRemoveChildView(childView);
                    childView.setParentView(null);
                    renderViews.pop();
                    this.onRemoveChildView(childView);
                    this.didRemoveChildView(childView);
                    this.animate();
                    continue;
                }
                break;
            } while (true);
        };
        CanvasView.prototype.cascadeMount = function () {
            this.willMount();
            this.onMount();
            var childNodes = this._node.childNodes;
            for (var i = 0, n = childNodes.length; i < n; i += 1) {
                var childView = childNodes[i].view;
                if (childView) {
                    childView.cascadeMount();
                }
            }
            var renderViews = this._renderViews;
            for (var i = 0, n = renderViews.length; i < n; i += 1) {
                var renderView = renderViews[i];
                renderView.cascadeMount();
            }
            this.didMount();
        };
        CanvasView.prototype.onMount = function () {
            _super.prototype.onMount.call(this);
            this.resizeCanvas(this._node);
            this.animate();
            this.addEventListeners(this._node);
        };
        CanvasView.prototype.cascadeUnmount = function () {
            this.willUnmount();
            this.onUnmount();
            var childNodes = this._node.childNodes;
            for (var i = 0, n = childNodes.length; i < n; i += 1) {
                var childView = childNodes[i].view;
                if (childView) {
                    childView.cascadeUnmount();
                }
            }
            var renderViews = this._renderViews;
            for (var i = 0, n = renderViews.length; i < n; i += 1) {
                var renderView = renderViews[i];
                renderView.cascadeUnmount();
            }
            this.didUnmount();
        };
        CanvasView.prototype.onUnmount = function () {
            this.removeEventListeners(this._node);
            if (this._animationFrame) {
                cancelAnimationFrame(this._animationFrame);
                this._animationFrame = 0;
            }
            _super.prototype.onUnmount.call(this);
        };
        CanvasView.prototype.cascadeResize = function () {
            this.willResize();
            this.onResize();
            var childNodes = this._node.childNodes;
            for (var i = 0, n = childNodes.length; i < n; i += 1) {
                var childView = childNodes[i].view;
                if (childView) {
                    childView.cascadeResize();
                }
            }
            var renderViews = this._renderViews;
            for (var i = 0, n = renderViews.length; i < n; i += 1) {
                var renderView = renderViews[i];
                renderView.cascadeResize();
            }
            this.didResize();
        };
        CanvasView.prototype.onResize = function () {
            _super.prototype.onResize.call(this);
            this.resizeCanvas(this._node);
            this.setDirty(true);
        };
        CanvasView.prototype.didResize = function () {
            this.cascadeRender();
            _super.prototype.didResize.call(this);
        };
        CanvasView.prototype.cascadeLayout = function () {
            this.willLayout();
            this.onLayout();
            var childNodes = this._node.childNodes;
            for (var i = 0, n = childNodes.length; i < n; i += 1) {
                var childView = childNodes[i].view;
                if (childView) {
                    childView.cascadeLayout();
                }
            }
            var renderViews = this._renderViews;
            for (var i = 0, n = renderViews.length; i < n; i += 1) {
                var renderView = renderViews[i];
                renderView.cascadeLayout();
            }
            this.didLayout();
        };
        CanvasView.prototype.cascadeScroll = function () {
            this.willScroll();
            this.onScroll();
            var childNodes = this._node.childNodes;
            for (var i = 0, n = childNodes.length; i < n; i += 1) {
                var childView = childNodes[i].view;
                if (childView) {
                    childView.cascadeScroll();
                }
            }
            var renderViews = this._renderViews;
            for (var i = 0, n = renderViews.length; i < n; i += 1) {
                var renderView = renderViews[i];
                renderView.cascadeScroll();
            }
            this.didScroll();
        };
        CanvasView.prototype.onAnimationFrame = function (timestamp) {
            this._animationFrame = 0;
            this.cascadeAnimate(timestamp);
            this.cascadeCull();
            this.cascadeRender();
            this.detectMouseHover();
        };
        CanvasView.prototype.cascadeAnimate = function (frame) {
            this.willAnimate(frame);
            this.onAnimate(frame);
            var renderViews = this._renderViews;
            for (var i = 0, n = renderViews.length; i < n; i += 1) {
                var renderView = renderViews[i];
                renderView.cascadeAnimate(frame);
            }
            this.didAnimate(frame);
        };
        CanvasView.prototype.cascadeRender = function (context) {
            if (context === void 0) { context = this.getContext(); }
            this.willRender(context);
            this.onRender(context);
            var renderViews = this._renderViews;
            for (var i = 0, n = renderViews.length; i < n; i += 1) {
                var renderView = renderViews[i];
                renderView.cascadeRender(context);
            }
            this.didRender(context);
        };
        CanvasView.prototype.willRender = function (context) {
            this.willObserve(function (viewObserver) {
                if (viewObserver.viewWillRender) {
                    viewObserver.viewWillRender(context, this);
                }
            });
        };
        CanvasView.prototype.onRender = function (context) {
            var bounds = this._bounds;
            context.clearRect(0, 0, bounds.width, bounds.height);
        };
        CanvasView.prototype.didRender = function (context) {
            this.didObserve(function (viewObserver) {
                if (viewObserver.viewDidRender) {
                    viewObserver.viewDidRender(context, this);
                }
            });
        };
        Object.defineProperty(CanvasView.prototype, "hidden", {
            get: function () {
                return false;
            },
            enumerable: true,
            configurable: true
        });
        CanvasView.prototype.setHidden = function (hidden) {
        };
        CanvasView.prototype.cascadeCull = function () {
            this.willCull();
            this.onCull();
            var childViews = this.childViews;
            for (var i = 0, n = childViews.length; i < n; i += 1) {
                var childView = childViews[i];
                if (RenderView.is(childView)) {
                    childView.cascadeCull();
                }
            }
            this.didCull();
        };
        CanvasView.prototype.willCull = function () {
            this.willObserve(function (viewObserver) {
                if (viewObserver.viewWillCull) {
                    viewObserver.viewWillCull(this);
                }
            });
        };
        CanvasView.prototype.onCull = function () {
        };
        CanvasView.prototype.didCull = function () {
            this.didObserve(function (viewObserver) {
                if (viewObserver.viewDidCull) {
                    viewObserver.viewDidCull(this);
                }
            });
        };
        Object.defineProperty(CanvasView.prototype, "culled", {
            get: function () {
                return false;
            },
            enumerable: true,
            configurable: true
        });
        CanvasView.prototype.setCulled = function (culled) {
        };
        Object.defineProperty(CanvasView.prototype, "bounds", {
            get: function () {
                return this._bounds;
            },
            enumerable: true,
            configurable: true
        });
        CanvasView.prototype.setBounds = function (bounds) {
            var newBounds = this.willSetBounds(bounds);
            if (newBounds !== void 0) {
                bounds = newBounds;
            }
            var oldBounds = this._bounds;
            this._bounds = bounds;
            this.onSetBounds(bounds, oldBounds);
            var renderViews = this._renderViews;
            for (var i = 0, n = renderViews.length; i < n; i += 1) {
                this.setChildViewBounds(renderViews[i], bounds);
            }
            this.didSetBounds(bounds, oldBounds);
        };
        CanvasView.prototype.willSetBounds = function (bounds) {
            var viewController = this._viewController;
            if (viewController) {
                var newBounds = viewController.viewWillSetBounds(bounds, this);
                if (newBounds !== void 0) {
                    bounds = newBounds;
                }
            }
            var viewObservers = this._viewObservers;
            for (var i = 0, n = viewObservers.length; i < n; i += 1) {
                var viewObserver = viewObservers[i];
                if (viewObserver.viewWillSetBounds) {
                    viewObserver.viewWillSetBounds(bounds, this);
                }
            }
        };
        CanvasView.prototype.onSetBounds = function (newBounds, oldBounds) {
        };
        CanvasView.prototype.didSetBounds = function (newBounds, oldBounds) {
            this.didObserve(function (viewObserver) {
                if (viewObserver.viewDidSetBounds) {
                    viewObserver.viewDidSetBounds(newBounds, oldBounds, this);
                }
            });
        };
        CanvasView.prototype.setChildViewBounds = function (childView, bounds) {
            childView.setBounds(bounds);
        };
        Object.defineProperty(CanvasView.prototype, "anchor", {
            get: function () {
                return this._anchor;
            },
            enumerable: true,
            configurable: true
        });
        CanvasView.prototype.setAnchor = function (anchor) {
            var newAnchor = this.willSetAnchor(anchor);
            if (newAnchor !== void 0) {
                anchor = newAnchor;
            }
            var oldAnchor = this._anchor;
            this._anchor = anchor;
            this.onSetAnchor(anchor, oldAnchor);
            var renderViews = this._renderViews;
            for (var i = 0, n = renderViews.length; i < n; i += 1) {
                this.setChildViewAnchor(renderViews[i], anchor);
            }
            this.didSetAnchor(anchor, oldAnchor);
        };
        CanvasView.prototype.willSetAnchor = function (anchor) {
            var viewController = this._viewController;
            if (viewController) {
                var newAnchor = viewController.viewWillSetAnchor(anchor, this);
                if (newAnchor !== void 0) {
                    anchor = newAnchor;
                }
            }
            var viewObservers = this._viewObservers;
            for (var i = 0, n = viewObservers.length; i < n; i += 1) {
                var viewObserver = viewObservers[i];
                if (viewObserver.viewWillSetAnchor) {
                    viewObserver.viewWillSetAnchor(anchor, this);
                }
            }
        };
        CanvasView.prototype.onSetAnchor = function (newAnchor, oldAnchor) {
        };
        CanvasView.prototype.didSetAnchor = function (newAnchor, oldAnchor) {
            this.didObserve(function (viewObserver) {
                if (viewObserver.viewDidSetAnchor) {
                    viewObserver.viewDidSetAnchor(newAnchor, oldAnchor, this);
                }
            });
        };
        CanvasView.prototype.setChildViewAnchor = function (childView, anchor) {
            childView.setAnchor(anchor);
        };
        Object.defineProperty(CanvasView.prototype, "pixelRatio", {
            get: function () {
                return window.devicePixelRatio || 1;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CanvasView.prototype, "hitBounds", {
            get: function () {
                return null;
            },
            enumerable: true,
            configurable: true
        });
        CanvasView.prototype.hitTest = function (x, y, context) {
            if (context === void 0) { context = this.getContext(); }
            var hit = null;
            var renderViews = this._renderViews;
            for (var i = renderViews.length - 1; i >= 0; i -= 1) {
                var renderView = renderViews[i];
                if (!renderView.hidden && !renderView.culled) {
                    var hitBounds = renderView.hitBounds || renderView.bounds;
                    if (hitBounds.contains(x, y)) {
                        hit = renderView.hitTest(x, y, context);
                        if (hit !== null) {
                            break;
                        }
                    }
                }
            }
            return hit;
        };
        CanvasView.prototype.handleEvent = function (event) {
        };
        CanvasView.prototype.bubbleEvent = function (event) {
            return this;
        };
        CanvasView.prototype.addEventListeners = function (node) {
            node.addEventListener("click", this.onClick);
            node.addEventListener("dblclick", this.onDblClick);
            node.addEventListener("contextmenu", this.onContextMenu);
            node.addEventListener("mousedown", this.onMouseDown);
            window.addEventListener("mousemove", this.onMouseMove);
            node.addEventListener("mouseup", this.onMouseUp);
            node.addEventListener("wheel", this.onWheel);
            node.addEventListener("touchstart", this.onTouchStart);
            node.addEventListener("touchmove", this.onTouchMove);
            node.addEventListener("touchcancel", this.onTouchCancel);
            node.addEventListener("touchend", this.onTouchEnd);
        };
        CanvasView.prototype.removeEventListeners = function (node) {
            node.removeEventListener("click", this.onClick);
            node.removeEventListener("dblclick", this.onDblClick);
            node.removeEventListener("contextmenu", this.onContextMenu);
            node.removeEventListener("mousedown", this.onMouseDown);
            window.removeEventListener("mousemove", this.onMouseMove);
            node.removeEventListener("mouseup", this.onMouseUp);
            node.removeEventListener("wheel", this.onWheel);
            node.removeEventListener("touchstart", this.onTouchStart);
            node.removeEventListener("touchmove", this.onTouchMove);
            node.removeEventListener("touchcancel", this.onTouchCancel);
            node.removeEventListener("touchend", this.onTouchEnd);
        };
        CanvasView.prototype.fireEvent = function (event, clientX, clientY) {
            var bounds = this.clientBounds;
            if (bounds.contains(clientX, clientY)) {
                var x = clientX - bounds.x;
                var y = clientY - bounds.y;
                var hit = this.hitTest(x, y);
                if (hit) {
                    event.targetView = hit;
                    hit.bubbleEvent(event);
                    return hit;
                }
            }
            return null;
        };
        CanvasView.prototype.fireMouseEvent = function (event) {
            return this.fireEvent(event, event.clientX, event.clientY);
        };
        CanvasView.prototype.onClick = function (event) {
            this.fireMouseEvent(event);
        };
        CanvasView.prototype.onDblClick = function (event) {
            this.fireMouseEvent(event);
        };
        CanvasView.prototype.onContextMenu = function (event) {
            this.fireMouseEvent(event);
        };
        CanvasView.prototype.onMouseDown = function (event) {
            this.fireMouseEvent(event);
        };
        CanvasView.prototype.onMouseMove = function (event) {
            this._clientX = event.clientX;
            this._clientY = event.clientY;
            this._screenX = event.screenX;
            this._screenY = event.screenY;
            var oldHoverView = this._hoverView;
            var newHoverView = this.fireMouseEvent(event);
            if (newHoverView !== this._hoverView) {
                this.onMouseHoverChange(newHoverView, oldHoverView);
            }
        };
        CanvasView.prototype.onMouseUp = function (event) {
            this.fireMouseEvent(event);
        };
        CanvasView.prototype.onWheel = function (event) {
            this.fireMouseEvent(event);
        };
        CanvasView.prototype.onMouseHoverChange = function (newHoverView, oldHoverView) {
            var eventInit = {
                clientX: this._clientX,
                clientY: this._clientY,
                screenX: this._screenX,
                screenY: this._screenY,
                bubbles: true,
            };
            if (oldHoverView) {
                var outEvent = new MouseEvent("mouseout", eventInit);
                outEvent.targetView = oldHoverView;
                outEvent.relatedTargetView = newHoverView;
                oldHoverView.bubbleEvent(outEvent);
            }
            this._hoverView = newHoverView;
            if (newHoverView) {
                var overEvent = new MouseEvent("mouseover", eventInit);
                overEvent.targetView = newHoverView;
                overEvent.relatedTargetView = oldHoverView;
                newHoverView.bubbleEvent(overEvent);
            }
        };
        CanvasView.prototype.detectMouseHover = function () {
            var bounds = this.clientBounds;
            if (bounds.contains(this._clientX, this._clientY)) {
                var x = this._clientX - bounds.x;
                var y = this._clientY - bounds.y;
                var oldHoverView = this._hoverView;
                var newHoverView = this.hitTest(x, y);
                if (newHoverView !== this._hoverView) {
                    this.onMouseHoverChange(newHoverView, oldHoverView);
                }
            }
        };
        CanvasView.prototype.fireTouchEvent = function (type, originalEvent, dispatched) {
            var changedTouches = originalEvent.changedTouches;
            for (var i = 0, n = changedTouches.length; i < n; i += 1) {
                var changedTouch = changedTouches[i];
                var targetView = changedTouch.targetView;
                if (targetView && dispatched.indexOf(targetView) < 0) {
                    var startEvent = new TouchEvent(type, {
                        changedTouches: changedTouches,
                        targetTouches: originalEvent.targetTouches,
                        touches: originalEvent.touches,
                        bubbles: true,
                    });
                    startEvent.targetView = targetView;
                    var targetViewTouches = [changedTouch];
                    for (var j = i + 1; j < n; j += 1) {
                        var nextTouch = changedTouches[j];
                        if (nextTouch.targetView === targetView) {
                            targetViewTouches.push(nextTouch);
                        }
                    }
                    startEvent.targetViewTouches = document.createTouchList.apply(document, targetViewTouches);
                    targetView.bubbleEvent(startEvent);
                    dispatched.push(targetView);
                }
            }
        };
        CanvasView.prototype.onTouchStart = function (event) {
            var bounds = this.clientBounds;
            var changedTouches = event.changedTouches;
            for (var i = 0, n = changedTouches.length; i < n; i += 1) {
                var changedTouch = changedTouches[i];
                var clientX = changedTouch.clientX;
                var clientY = changedTouch.clientY;
                if (bounds.contains(clientX, clientY)) {
                    var x = clientX - bounds.x;
                    var y = clientY - bounds.y;
                    var hit = this.hitTest(x, y);
                    if (hit) {
                        changedTouch.targetView = hit;
                    }
                }
                this._touches[changedTouch.identifier] = changedTouch;
            }
            var dispatched = [];
            this.fireTouchEvent("touchstart", event, dispatched);
        };
        CanvasView.prototype.onTouchMove = function (event) {
            var changedTouches = event.changedTouches;
            for (var i = 0, n = changedTouches.length; i < n; i += 1) {
                var changedTouch = changedTouches[i];
                var touch = this._touches[changedTouch.identifier];
                if (touch) {
                    changedTouch.targetView = touch.targetView;
                }
            }
            var dispatched = [];
            this.fireTouchEvent("touchmove", event, dispatched);
        };
        CanvasView.prototype.onTouchCancel = function (event) {
            var changedTouches = event.changedTouches;
            var n = changedTouches.length;
            for (var i = 0; i < n; i += 1) {
                var changedTouch = changedTouches[i];
                var touch = this._touches[changedTouch.identifier];
                if (touch) {
                    changedTouch.targetView = touch.targetView;
                }
            }
            var dispatched = [];
            this.fireTouchEvent("touchcancel", event, dispatched);
            for (var i = 0; i < n; i += 1) {
                var changedTouch = changedTouches[i];
                delete this._touches[changedTouch.identifier];
            }
        };
        CanvasView.prototype.onTouchEnd = function (event) {
            var changedTouches = event.changedTouches;
            var n = changedTouches.length;
            for (var i = 0; i < n; i += 1) {
                var changedTouch = changedTouches[i];
                var touch = this._touches[changedTouch.identifier];
                if (touch) {
                    changedTouch.targetView = touch.targetView;
                }
            }
            var dispatched = [];
            this.fireTouchEvent("touchend", event, dispatched);
            for (var i = 0; i < n; i += 1) {
                var changedTouch = changedTouches[i];
                delete this._touches[changedTouch.identifier];
            }
        };
        CanvasView.prototype.getContext = function () {
            return this._node.getContext("2d");
        };
        CanvasView.prototype.resizeCanvas = function (node) {
            var width;
            var height;
            var pixelRatio;
            var parentNode = node.parentNode;
            if (parentNode instanceof HTMLElement) {
                var bounds = void 0;
                do {
                    bounds = parentNode.getBoundingClientRect();
                    if (bounds.width && bounds.height) {
                        break;
                    }
                    parentNode = parentNode.parentNode;
                } while (parentNode instanceof HTMLElement);
                width = Math.floor(bounds.width);
                height = Math.floor(bounds.height);
                pixelRatio = this.pixelRatio;
                node.width = width * pixelRatio;
                node.height = height * pixelRatio;
                node.style.width = width + "px";
                node.style.height = height + "px";
            }
            else {
                width = Math.floor(node.width);
                height = Math.floor(node.height);
                pixelRatio = 1;
            }
            var context = this.getContext();
            context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
            this.setBounds(new math.BoxR2(0, 0, width, height));
            this.setAnchor(new math.PointR2(width / 2, height / 2));
        };
        CanvasView.tag = "canvas";
        return CanvasView;
    }(HtmlView));
    View.Canvas = CanvasView;

    var CanvasViewController = (function (_super) {
        __extends(CanvasViewController, _super);
        function CanvasViewController() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(CanvasViewController.prototype, "node", {
            get: function () {
                var view = this._view;
                return view ? view.node : null;
            },
            enumerable: true,
            configurable: true
        });
        CanvasViewController.prototype.animate = function () {
            var view = this._view;
            if (view) {
                view.animate();
            }
        };
        CanvasViewController.prototype.viewWillAnimate = function (frame, view) {
        };
        CanvasViewController.prototype.viewDidAnimate = function (frame, view) {
        };
        CanvasViewController.prototype.viewWillRender = function (context, view) {
        };
        CanvasViewController.prototype.viewDidRender = function (context, view) {
        };
        Object.defineProperty(CanvasViewController.prototype, "hidden", {
            get: function () {
                var view = this._view;
                return view ? view.hidden : false;
            },
            enumerable: true,
            configurable: true
        });
        CanvasViewController.prototype.viewWillSetHidden = function (hidden, view) {
        };
        CanvasViewController.prototype.viewDidSetHidden = function (hidden, view) {
        };
        CanvasViewController.prototype.viewWillCull = function (view) {
        };
        CanvasViewController.prototype.viewDidCull = function (view) {
        };
        Object.defineProperty(CanvasViewController.prototype, "culled", {
            get: function () {
                var view = this._view;
                return view ? view.culled : false;
            },
            enumerable: true,
            configurable: true
        });
        CanvasViewController.prototype.viewWillSetCulled = function (culled, view) {
        };
        CanvasViewController.prototype.viewDidSetCulled = function (culled, view) {
        };
        Object.defineProperty(CanvasViewController.prototype, "bounds", {
            get: function () {
                var view = this._view;
                return view ? view.bounds : math.BoxR2.empty();
            },
            enumerable: true,
            configurable: true
        });
        CanvasViewController.prototype.viewWillSetBounds = function (bounds, view) {
        };
        CanvasViewController.prototype.viewDidSetBounds = function (newBounds, oldBounds, view) {
        };
        Object.defineProperty(CanvasViewController.prototype, "anchor", {
            get: function () {
                var view = this._view;
                return view ? view.anchor : math.PointR2.origin();
            },
            enumerable: true,
            configurable: true
        });
        CanvasViewController.prototype.viewWillSetAnchor = function (anchor, view) {
        };
        CanvasViewController.prototype.viewDidSetAnchor = function (newAnchor, oldAnchor, view) {
        };
        Object.defineProperty(CanvasViewController.prototype, "dirty", {
            get: function () {
                var view = this._view;
                return view ? view.dirty : false;
            },
            enumerable: true,
            configurable: true
        });
        CanvasViewController.prototype.setDirty = function (dirty) {
            var view = this._view;
            if (view) {
                view.setDirty(dirty);
            }
        };
        return CanvasViewController;
    }(HtmlViewController));

    var HtmlAppView = (function (_super) {
        __extends(HtmlAppView, _super);
        function HtmlAppView(node, key) {
            if (key === void 0) { key = null; }
            var _this = _super.call(this, node, key) || this;
            _this.doLayout = _this.doLayout.bind(_this);
            _this.throttleResize = _this.throttleResize.bind(_this);
            _this.doResize = _this.doResize.bind(_this);
            _this.throttleScroll = _this.throttleScroll.bind(_this);
            _this.doScroll = _this.doScroll.bind(_this);
            _this.onClick = _this.onClick.bind(_this);
            _this._popovers = [];
            _this._layoutTimer = 0;
            _this._resizeTimer = 0;
            _this._scrollTimer = 0;
            if (typeof window !== "undefined") {
                window.addEventListener("resize", _this.throttleResize);
                window.addEventListener("scroll", _this.throttleScroll, { passive: true });
                window.addEventListener('click', _this.onClick);
            }
            return _this;
        }
        Object.defineProperty(HtmlAppView.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HtmlAppView.prototype, "appView", {
            get: function () {
                return this;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HtmlAppView.prototype, "popovers", {
            get: function () {
                return this._popovers;
            },
            enumerable: true,
            configurable: true
        });
        HtmlAppView.prototype.togglePopover = function (popover, options) {
            var popoverState = popover.popoverState;
            if (popoverState === "hidden" || popoverState === "hiding") {
                this.showPopover(popover, options);
            }
            else if (popoverState === "shown" || popoverState === "showing") {
                this.hidePopover(popover);
            }
        };
        HtmlAppView.prototype.showPopover = function (popover, options) {
            if (options === void 0) { options = {}; }
            this.willShowPopover(popover, options);
            if (options && !options.multi) {
                this.hidePopovers();
            }
            if (this._popovers.indexOf(popover) < 0) {
                this._popovers.push(popover);
            }
            var popoverView = popover.popoverView;
            if (popoverView && !popoverView.isMounted()) {
                this.insertPopoverView(popoverView);
            }
            this.onShowPopover(popover, options);
            popover.showPopover(true);
            this.didShowPopover(popover, options);
        };
        HtmlAppView.prototype.insertPopoverView = function (popoverView) {
            this.appendChildView(popoverView);
        };
        HtmlAppView.prototype.willShowPopover = function (popover, options) {
            this.willObserve(function (viewObserver) {
                if (viewObserver.viewWillShowPopover) {
                    viewObserver.viewWillShowPopover(popover, options, this);
                }
            });
        };
        HtmlAppView.prototype.onShowPopover = function (popover, options) {
        };
        HtmlAppView.prototype.didShowPopover = function (popover, options) {
            this.didObserve(function (viewObserver) {
                if (viewObserver.viewDidShowPopover) {
                    viewObserver.viewDidShowPopover(popover, options, this);
                }
            });
        };
        HtmlAppView.prototype.hidePopover = function (popover) {
            var popovers = this._popovers;
            var index = popovers.indexOf(popover);
            if (index >= 0) {
                this.willHidePopover(popover);
                popovers.splice(index, 1);
                this.onHidePopover(popover);
                popover.hidePopover(true);
                this.didHidePopover(popover);
            }
        };
        HtmlAppView.prototype.willHidePopover = function (popover) {
            this.willObserve(function (viewObserver) {
                if (viewObserver.viewWillHidePopover) {
                    viewObserver.viewWillHidePopover(popover, this);
                }
            });
        };
        HtmlAppView.prototype.onHidePopover = function (popover) {
        };
        HtmlAppView.prototype.didHidePopover = function (popover) {
            this.didObserve(function (viewObserver) {
                if (viewObserver.viewDidHidePopover) {
                    viewObserver.viewDidHidePopover(popover, this);
                }
            });
        };
        HtmlAppView.prototype.hidePopovers = function () {
            var popovers = this._popovers;
            while (popovers.length) {
                var popover = popovers[0];
                this.willHidePopover(popover);
                popovers.shift();
                this.onHidePopover(popover);
                popover.hidePopover(true);
                this.didHidePopover(popover);
            }
        };
        Object.defineProperty(HtmlAppView.prototype, "viewport", {
            get: function () {
                var viewport = this._viewport;
                if (viewport === void 0) {
                    var insetTop = 0;
                    var insetRight = 0;
                    var insetBottom = 0;
                    var insetLeft = 0;
                    var div = document.createElement("div");
                    div.style.setProperty("position", "fixed");
                    div.style.setProperty("top", "0");
                    div.style.setProperty("right", "0");
                    div.style.setProperty("width", "100vw");
                    div.style.setProperty("height", "100vh");
                    div.style.setProperty("box-sizing", "border-box");
                    div.style.setProperty("padding-top", "env(safe-area-inset-top)");
                    div.style.setProperty("padding-right", "env(safe-area-inset-right)");
                    div.style.setProperty("padding-bottom", "env(safe-area-inset-bottom)");
                    div.style.setProperty("padding-left", "env(safe-area-inset-left)");
                    div.style.setProperty("overflow", "hidden");
                    div.style.setProperty("visibility", "hidden");
                    document.body.appendChild(div);
                    var style = window.getComputedStyle(div);
                    var width = parseFloat(style.getPropertyValue("width"));
                    var height = parseFloat(style.getPropertyValue("height"));
                    if (typeof CSS !== "undefined" && typeof CSS.supports === "function"
                        && CSS.supports("padding-top: env(safe-area-inset-top)")) {
                        insetTop = parseFloat(style.getPropertyValue("padding-top"));
                        insetRight = parseFloat(style.getPropertyValue("padding-right"));
                        insetBottom = parseFloat(style.getPropertyValue("padding-bottom"));
                        insetLeft = parseFloat(style.getPropertyValue("padding-left"));
                    }
                    document.body.removeChild(div);
                    var orientation_1 = screen.msOrientation ||
                        screen.mozOrientation ||
                        (screen.orientation || {}).type;
                    if (!orientation_1) {
                        switch (window.orientation) {
                            case 0:
                                orientation_1 = "portrait-primary";
                                break;
                            case 180:
                                orientation_1 = "portrait-secondary";
                                break;
                            case -90:
                                orientation_1 = "landscape-primary";
                                break;
                            case 90:
                                orientation_1 = "landscape-secondary";
                                break;
                            default: orientation_1 = "landscape-primary";
                        }
                    }
                    var safeArea = { insetTop: insetTop, insetRight: insetRight, insetBottom: insetBottom, insetLeft: insetLeft };
                    viewport = { width: width, height: height, orientation: orientation_1, safeArea: safeArea };
                    this._viewport = viewport;
                }
                return viewport;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HtmlAppView.prototype, "solver", {
            get: function () {
                return this._solver || null;
            },
            enumerable: true,
            configurable: true
        });
        HtmlAppView.prototype.activateVariable = function (variable) {
            if (this._solver === void 0) {
                this._solver = new LayoutSolver(this);
            }
            this._solver.addVariable(variable);
        };
        HtmlAppView.prototype.deactivateVariable = function (variable) {
            if (this._solver !== void 0) {
                this._solver.removeVariable(variable);
            }
        };
        HtmlAppView.prototype.setVariableState = function (variable, state) {
            if (this._solver !== void 0) {
                this._solver.setVariableState(variable, state);
            }
        };
        HtmlAppView.prototype.activateConstraint = function (constraint) {
            if (this._solver === void 0) {
                this._solver = new LayoutSolver(this);
            }
            this._solver.addConstraint(constraint);
        };
        HtmlAppView.prototype.deactivateConstraint = function (constraint) {
            if (this._solver !== void 0) {
                this._solver.removeConstraint(constraint);
            }
        };
        HtmlAppView.prototype.updateLayoutStates = function () {
            _super.prototype.updateLayoutStates.call(this);
            var viewport = this.viewport;
            var safeAreaInsetTop = this.hasOwnProperty("safeAreaInsetTop") ? this.safeAreaInsetTop : void 0;
            var safeAreaInsetRight = this.hasOwnProperty("safeAreaInsetRight") ? this.safeAreaInsetRight : void 0;
            var safeAreaInsetBottom = this.hasOwnProperty("safeAreaInsetBottom") ? this.safeAreaInsetBottom : void 0;
            var safeAreaInsetLeft = this.hasOwnProperty("safeAreaInsetLeft") ? this.safeAreaInsetLeft : void 0;
            if (safeAreaInsetTop && !safeAreaInsetTop.enabled()) {
                safeAreaInsetTop.setState(viewport.safeArea.insetTop);
            }
            if (safeAreaInsetRight && !safeAreaInsetRight.enabled()) {
                safeAreaInsetRight.setState(viewport.safeArea.insetRight);
            }
            if (safeAreaInsetBottom && !safeAreaInsetBottom.enabled()) {
                safeAreaInsetBottom.setState(viewport.safeArea.insetBottom);
            }
            if (safeAreaInsetLeft && !safeAreaInsetLeft.enabled()) {
                safeAreaInsetLeft.setState(viewport.safeArea.insetLeft);
            }
        };
        HtmlAppView.prototype.throttleLayout = function () {
            if (!this._layoutTimer) {
                this._layoutTimer = setTimeout(this.doResize, 0);
            }
        };
        HtmlAppView.prototype.doLayout = function () {
            if (this._layoutTimer) {
                clearTimeout(this._layoutTimer);
                this._layoutTimer = 0;
            }
            if (this._solver !== void 0) {
                this._solver.updateVariables();
                this.cascadeLayout();
            }
        };
        HtmlAppView.prototype.throttleResize = function () {
            if (!this._resizeTimer) {
                this._resizeTimer = setTimeout(this.doResize, 0);
            }
        };
        HtmlAppView.prototype.doResize = function () {
            this._resizeTimer = 0;
            this._viewport = void 0;
            this.cascadeResize();
            this.doLayout();
        };
        HtmlAppView.prototype.throttleScroll = function () {
            if (!this._scrollTimer) {
                this._scrollTimer = setTimeout(this.doScroll, 0);
            }
        };
        HtmlAppView.prototype.doScroll = function () {
            this._scrollTimer = 0;
            this.cascadeScroll();
        };
        HtmlAppView.prototype.onUnmount = function () {
            if (this._layoutTimer) {
                clearTimeout(this._layoutTimer);
                this._layoutTimer = 0;
            }
            if (this._resizeTimer) {
                clearTimeout(this._resizeTimer);
                this._resizeTimer = 0;
            }
            if (this._scrollTimer) {
                clearTimeout(this._scrollTimer);
                this._scrollTimer = 0;
            }
            _super.prototype.onUnmount.call(this);
        };
        HtmlAppView.prototype.onClick = function (event) {
            this.onFallthroughClick(event);
        };
        HtmlAppView.prototype.onFallthroughClick = function (event) {
            this.hidePopovers();
        };
        __decorate([
            LayoutAnchor("strong")
        ], HtmlAppView.prototype, "safeAreaInsetTop", void 0);
        __decorate([
            LayoutAnchor("strong")
        ], HtmlAppView.prototype, "safeAreaInsetRight", void 0);
        __decorate([
            LayoutAnchor("strong")
        ], HtmlAppView.prototype, "safeAreaInsetBottom", void 0);
        __decorate([
            LayoutAnchor("strong")
        ], HtmlAppView.prototype, "safeAreaInsetLeft", void 0);
        return HtmlAppView;
    }(HtmlView));

    var HtmlAppViewController = (function (_super) {
        __extends(HtmlAppViewController, _super);
        function HtmlAppViewController() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(HtmlAppViewController.prototype, "popovers", {
            get: function () {
                var view = this._view;
                return view ? view.popovers : [];
            },
            enumerable: true,
            configurable: true
        });
        HtmlAppViewController.prototype.viewWillShowPopover = function (popover, options, view) {
        };
        HtmlAppViewController.prototype.viewDidShowPopover = function (popover, options, view) {
        };
        HtmlAppViewController.prototype.viewWillHidePopover = function (popover, view) {
        };
        HtmlAppViewController.prototype.viewDidHidePopover = function (popover, view) {
        };
        return HtmlAppViewController;
    }(HtmlViewController));

    var Popover = {
        is: function (object) {
            if (typeof object === "object" && object) {
                var popover = object;
                return popover.popoverState !== void 0
                    && popover.popoverView !== void 0
                    && typeof popover.showPopover === "function"
                    && typeof popover.hidePopover === "function";
            }
            return false;
        },
    };

    var PopoverView = (function (_super) {
        __extends(PopoverView, _super);
        function PopoverView(node, key) {
            if (node === void 0) { node = document.createElement("div"); }
            if (key === void 0) { key = null; }
            var _this = _super.call(this, node, key) || this;
            _this.arrowWidth.setState(Length.fromAny(10));
            _this.arrowHeight.setState(Length.fromAny(8));
            _this._source = null;
            _this._sourceBounds = null;
            _this._popoverState = "shown";
            _this._placement = ["top", "bottom", "right", "left"];
            _this._placementBounds = null;
            _this._popoverTransition = Transition.duration(250, Ease.cubicOut);
            var arrow = _this.createArrow();
            if (arrow) {
                var arrowView = View.fromNode(arrow).key("arrow");
                _this.prependChildView(arrowView);
            }
            return _this;
        }
        PopoverView.prototype.createArrow = function () {
            var arrow = document.createElement("div");
            arrow.setAttribute("class", "popover-arrow");
            arrow.style.setProperty("display", "none");
            arrow.style.setProperty("position", "absolute");
            arrow.style.setProperty("width", "0");
            arrow.style.setProperty("height", "0");
            return arrow;
        };
        Object.defineProperty(PopoverView.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PopoverView.prototype, "source", {
            get: function () {
                return this._source;
            },
            enumerable: true,
            configurable: true
        });
        PopoverView.prototype.setSource = function (source) {
            if (this._source !== source) {
                this.willSetSource(source);
                if (this._source !== null && this.isMounted()) {
                    this._source.removeViewObserver(this);
                }
                this._source = source;
                this.onSetSource(source);
                if (this._source !== null && this.isMounted()) {
                    this._source.addViewObserver(this);
                }
                this.didSetSource(source);
            }
        };
        PopoverView.prototype.willSetSource = function (source) {
            this.willObserve(function (viewObserver) {
                if (viewObserver.popoverWillSetSource) {
                    viewObserver.popoverWillSetSource(source, this);
                }
            });
        };
        PopoverView.prototype.onSetSource = function (source) {
        };
        PopoverView.prototype.didSetSource = function (source) {
            this.didObserve(function (viewObserver) {
                if (viewObserver.popoverDidSetSource) {
                    viewObserver.popoverDidSetSource(source, this);
                }
            });
        };
        Object.defineProperty(PopoverView.prototype, "popoverState", {
            get: function () {
                return this._popoverState;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PopoverView.prototype, "popoverView", {
            get: function () {
                return this;
            },
            enumerable: true,
            configurable: true
        });
        PopoverView.prototype.togglePopover = function (tween) {
            if (this._popoverState === "hidden" || this._popoverState === "hiding") {
                this.showPopover(tween);
            }
            else if (this._popoverState === "shown" || this._popoverState === "showing") {
                this.hidePopover(tween);
            }
        };
        PopoverView.prototype.showPopover = function (tween) {
            if (this._popoverState === "hidden" || this._popoverState === "hiding") {
                if (tween === void 0 || tween === true) {
                    tween = this._popoverTransition || void 0;
                }
                else if (tween) {
                    tween = Transition.fromAny(tween);
                }
                this.willShow();
                var placement = this.place();
                if (tween) {
                    tween = tween.onEnd(this.didShow.bind(this));
                    if (placement === "above") {
                        this.opacity.setState(void 0);
                        if (this.marginTop.value === void 0) {
                            this.marginTop(-this._node.offsetHeight);
                        }
                        this.marginTop(0, tween);
                    }
                    else if (placement === "below") {
                        this.opacity.setState(void 0);
                        if (this.marginTop.value === void 0) {
                            this.marginTop(this._node.offsetHeight);
                        }
                        this.marginTop(0, tween);
                    }
                    else {
                        this.marginTop.setState(void 0);
                        if (this.opacity.value === void 0) {
                            this.opacity(0);
                        }
                        this.opacity(1, tween);
                    }
                }
                else {
                    this.didShow();
                }
            }
        };
        PopoverView.prototype.willShow = function () {
            this.willObserve(function (viewObserver) {
                if (viewObserver.popoverWillShow) {
                    viewObserver.popoverWillShow(this);
                }
            });
            this.visibility("visible");
            this._popoverState = "showing";
        };
        PopoverView.prototype.didShow = function () {
            this._popoverState = "shown";
            this.pointerEvents("auto");
            this.marginTop.setState(void 0);
            this.opacity.setState(void 0);
            this.didObserve(function (viewObserver) {
                if (viewObserver.popoverDidShow) {
                    viewObserver.popoverDidShow(this);
                }
            });
        };
        PopoverView.prototype.hidePopover = function (tween) {
            if (this._popoverState === "shown" || this._popoverState === "showing") {
                if (tween === void 0 || tween === true) {
                    tween = this._popoverTransition || void 0;
                }
                else if (tween) {
                    tween = Transition.fromAny(tween);
                }
                this.willHide();
                var placement = this.place();
                if (tween) {
                    tween = tween.onEnd(this.didHide.bind(this));
                    if (placement === "above") {
                        this.opacity.setState(void 0);
                        if (this.marginTop.value === void 0) {
                            this.marginTop(0);
                        }
                        this.marginTop(-this._node.offsetHeight, tween);
                    }
                    else if (placement === "below") {
                        this.opacity.setState(void 0);
                        if (this.marginTop.value === void 0) {
                            this.marginTop(0);
                        }
                        this.marginTop(this._node.offsetHeight, tween);
                    }
                    else {
                        this.marginTop.setState(void 0);
                        if (this.opacity.value === void 0) {
                            this.opacity(1);
                        }
                        this.opacity(0, tween);
                    }
                }
                else {
                    this.didHide();
                }
            }
        };
        PopoverView.prototype.willHide = function () {
            this.willObserve(function (viewObserver) {
                if (viewObserver.popoverWillHide) {
                    viewObserver.popoverWillHide(this);
                }
            });
            this.pointerEvents("none");
            this._popoverState = "hiding";
        };
        PopoverView.prototype.didHide = function () {
            this._popoverState = "hidden";
            this.visibility("hidden");
            this.marginTop.setState(void 0);
            this.opacity.setState(void 0);
            this.didObserve(function (viewObserver) {
                if (viewObserver.popoverDidHide) {
                    viewObserver.popoverDidHide(this);
                }
            });
        };
        PopoverView.prototype.placement = function (placement) {
            if (placement === void 0) {
                return this._placement;
            }
            else {
                this._placement.length = 0;
                for (var i = 0, n = placement.length; i < n; i += 1) {
                    this._placement.push(placement[i]);
                }
                this.setDirty(true);
                return this;
            }
        };
        PopoverView.prototype.placementBounds = function (placementBounds) {
            if (placementBounds === void 0) {
                return this._placementBounds;
            }
            else {
                if (!util.Objects.equal(this._placementBounds, placementBounds)) {
                    this._placementBounds = placementBounds;
                    this.setDirty(true);
                }
                return this;
            }
        };
        PopoverView.prototype.popoverTransition = function (popoverTransition) {
            if (popoverTransition === void 0) {
                return this._popoverTransition;
            }
            else {
                this._popoverTransition = popoverTransition !== null ? Transition.fromAny(popoverTransition) : null;
                return this;
            }
        };
        PopoverView.prototype.onMount = function () {
            if (this._source) {
                this._source.addViewObserver(this);
            }
        };
        PopoverView.prototype.onUnmount = function () {
            if (this._source) {
                this._source.removeViewObserver(this);
            }
        };
        PopoverView.prototype.onResize = function () {
            this.place();
        };
        PopoverView.prototype.onLayout = function () {
            this.place();
        };
        PopoverView.prototype.onScroll = function () {
            this.place();
        };
        PopoverView.prototype.onAnimate = function (t) {
            this.arrowWidth.onFrame(t);
            this.arrowHeight.onFrame(t);
            this.place();
        };
        PopoverView.prototype.place = function () {
            var source = this._source;
            var oldSourceBounds = this._sourceBounds;
            var newSourceBounds = source ? source.popoverBounds : null;
            if (newSourceBounds && this._placement.length
                && (this._dirty || !newSourceBounds.equals(oldSourceBounds))) {
                var placement = this.placePopover(source, newSourceBounds);
                var arrow = this.getChildView("arrow");
                if (arrow instanceof HtmlView) {
                    this.placeArrow(source, newSourceBounds, arrow, placement);
                }
                return placement;
            }
            else {
                return "none";
            }
        };
        PopoverView.prototype.placePopover = function (source, sourceBounds) {
            var node = this._node;
            var parent = node.offsetParent;
            if (!parent) {
                return "none";
            }
            var popoverWidth = Length.fromAny(node.style.getPropertyValue("width") || node.offsetWidth).pxValue();
            var popoverHeight = Length.fromAny(node.style.getPropertyValue("height") || node.offsetHeight).pxValue();
            var parentBounds = parent.getBoundingClientRect();
            var parentLeft = parentBounds.left;
            var parentTop = parentBounds.top;
            var sourceLeft = sourceBounds.left - window.pageXOffset - parentLeft;
            var sourceRight = sourceBounds.right - window.pageXOffset - parentLeft;
            var sourceTop = sourceBounds.top - window.pageYOffset - parentTop;
            var sourceBottom = sourceBounds.bottom - window.pageYOffset - parentTop;
            var sourceWidth = sourceBounds.width;
            var sourceHeight = sourceBounds.height;
            var sourceX = sourceLeft + sourceWidth / 2;
            var sourceY = sourceTop + sourceHeight / 2;
            var placementBounds = this._placementBounds;
            var placementLeft = (placementBounds ? placementBounds.left : 0) - parentLeft;
            var placementRight = (placementBounds ? placementBounds.right : window.innerWidth) - parentLeft;
            var placementTop = (placementBounds ? placementBounds.top : 0) - parentTop;
            var placementBottom = (placementBounds ? placementBounds.bottom : window.innerHeight) - parentTop;
            var marginLeft = sourceLeft - placementLeft;
            var marginRight = placementRight - sourceLeft - sourceWidth;
            var marginTop = sourceTop - placementTop;
            var marginBottom = placementBottom - sourceTop - sourceHeight;
            var arrowHeight = this.arrowHeight.value.pxValue();
            var placement;
            for (var i = 0; i < this._placement.length; i += 1) {
                var p = this._placement[i];
                if (p === "above" || p === "below" || p === "over") {
                    placement = p;
                    break;
                }
                else if (p === "top" && popoverHeight + arrowHeight <= marginTop) {
                    placement = p;
                    break;
                }
                else if (p === "bottom" && popoverHeight + arrowHeight <= marginBottom) {
                    placement = p;
                    break;
                }
                else if (p === "left" && popoverWidth + arrowHeight <= marginLeft) {
                    placement = p;
                    break;
                }
                else if (p === "right" && popoverWidth + arrowHeight <= marginRight) {
                    placement = p;
                    break;
                }
            }
            if (placement === void 0) {
                placement = "none";
                for (var i = 0, n = this._placement.length; i < n; i += 1) {
                    var p = this._placement[i];
                    if (p === "top" && marginTop >= marginBottom) {
                        placement = p;
                        break;
                    }
                    else if (p === "bottom" && marginBottom >= marginTop) {
                        placement = p;
                        break;
                    }
                    else if (p === "left" && marginLeft >= marginRight) {
                        placement = p;
                        break;
                    }
                    else if (p === "right" && marginRight >= marginLeft) {
                        placement = p;
                        break;
                    }
                }
            }
            var oldMaxWidth = Length.fromAny(node.style.getPropertyValue("max-width") || 0).pxValue();
            var oldMaxHeight = Length.fromAny(node.style.getPropertyValue("max-height") || 0).pxValue();
            var maxWidth = oldMaxWidth;
            var maxHeight = oldMaxHeight;
            var left = node.offsetLeft;
            var top = node.offsetTop;
            var right;
            var bottom;
            if (placement === "above") {
                left = placementLeft;
                top = placementTop;
                right = (placementBounds ? placementBounds.width : window.innerWidth) - placementRight;
                maxWidth = Math.max(0, placementRight - placementLeft);
                maxHeight = Math.max(0, placementBottom - placementTop);
            }
            else if (placement === "below") {
                left = placementLeft;
                top = placementBottom - popoverHeight;
                right = placementRight - (placementBounds ? placementBounds.width : window.innerWidth);
                maxWidth = Math.max(0, placementRight - placementLeft);
                maxHeight = Math.max(0, placementBottom - placementTop);
            }
            else if (placement === "over") {
                left = placementLeft;
                top = placementTop;
                right = placementRight - (placementBounds ? placementBounds.width : window.innerWidth);
                bottom = placementBottom - (placementBounds ? placementBounds.height : window.innerHeight);
                maxWidth = Math.max(0, placementRight - placementLeft);
                maxHeight = Math.max(0, placementBottom - placementTop);
            }
            else if (placement === "top") {
                if (sourceX - popoverWidth / 2 <= placementLeft) {
                    left = placementLeft;
                }
                else if (sourceX + popoverWidth / 2 >= placementRight) {
                    left = placementRight - popoverWidth;
                }
                else {
                    left = sourceX - popoverWidth / 2;
                }
                top = Math.max(placementTop, sourceTop - (popoverHeight + arrowHeight));
                maxWidth = Math.max(0, placementRight - placementLeft);
                maxHeight = Math.max(0, sourceBottom - placementTop);
            }
            else if (placement === "bottom") {
                if (sourceX - popoverWidth / 2 <= placementLeft) {
                    left = placementLeft;
                }
                else if (sourceX + popoverWidth / 2 >= placementRight) {
                    left = placementRight - popoverWidth;
                }
                else {
                    left = sourceX - popoverWidth / 2;
                }
                top = Math.max(placementTop, sourceBottom + arrowHeight);
                maxWidth = Math.max(0, placementRight - placementLeft);
                maxHeight = Math.max(0, placementBottom - sourceTop);
            }
            else if (placement === "left") {
                left = Math.max(placementLeft, sourceLeft - (popoverWidth + arrowHeight));
                if (sourceY - popoverHeight / 2 <= placementTop) {
                    top = placementTop;
                }
                else if (sourceY + popoverHeight / 2 >= placementBottom) {
                    top = placementBottom - popoverHeight;
                }
                else {
                    top = sourceY - popoverHeight / 2;
                }
                maxWidth = Math.max(0, sourceRight - placementLeft);
                maxHeight = Math.max(0, placementBottom - placementTop);
            }
            else if (placement === "right") {
                left = Math.max(placementLeft, sourceRight + arrowHeight);
                if (sourceY - popoverHeight / 2 <= placementTop) {
                    top = placementTop;
                }
                else if (sourceY + popoverHeight / 2 >= placementBottom) {
                    top = placementBottom - popoverHeight;
                }
                else {
                    top = sourceY - popoverHeight / 2;
                }
                maxWidth = Math.max(0, placementRight - sourceLeft);
                maxHeight = Math.max(0, placementBottom - placementTop);
            }
            if (placement !== "none" && (left !== node.offsetLeft || top !== node.offsetTop
                || maxWidth !== oldMaxWidth || maxHeight !== oldMaxHeight)) {
                this.willPlacePopover(placement);
                node.style.setProperty("position", "absolute");
                node.style.setProperty("left", left + "px");
                if (right !== void 0) {
                    node.style.setProperty("right", right + "px");
                }
                else {
                    node.style.removeProperty("right");
                }
                node.style.setProperty("top", top + "px");
                if (bottom !== void 0) {
                    node.style.setProperty("bottom", bottom + "px");
                }
                else {
                    node.style.removeProperty("bottom");
                }
                node.style.setProperty("max-width", maxWidth + "px");
                node.style.setProperty("max-height", maxHeight + "px");
                this.onPlacePopover(placement);
                this.didPlacePopover(placement);
            }
            return placement;
        };
        PopoverView.prototype.willPlacePopover = function (placement) {
            this.willObserve(function (viewObserver) {
                if (viewObserver.popoverWillPlace) {
                    viewObserver.popoverWillPlace(placement, this);
                }
            });
        };
        PopoverView.prototype.onPlacePopover = function (placement) {
        };
        PopoverView.prototype.didPlacePopover = function (placement) {
            this.didObserve(function (viewObserver) {
                if (viewObserver.popoverDidPlace) {
                    viewObserver.popoverDidPlace(placement, this);
                }
            });
        };
        PopoverView.prototype.placeArrow = function (source, sourceBounds, arrow, placement) {
            var node = this._node;
            var parent = node.offsetParent;
            if (!parent) {
                return;
            }
            var arrowNode = arrow._node;
            var parentBounds = parent.getBoundingClientRect();
            var parentLeft = parentBounds.left;
            var parentTop = parentBounds.top;
            var sourceLeft = sourceBounds.left - window.pageXOffset - parentLeft;
            var sourceTop = sourceBounds.top - window.pageYOffset - parentTop;
            var sourceWidth = sourceBounds.width;
            var sourceHeight = sourceBounds.height;
            var sourceX = sourceLeft + sourceWidth / 2;
            var sourceY = sourceTop + sourceHeight / 2;
            var offsetLeft = node.offsetLeft;
            var offsetRight = offsetLeft + node.offsetWidth;
            var offsetTop = node.offsetTop;
            var offsetBottom = offsetTop + node.offsetHeight;
            var backgroundColor = this.backgroundColor() || Color.transparent();
            var borderRadius = this.borderRadius();
            var radius = borderRadius instanceof Length ? borderRadius.pxValue() : 0;
            var arrowWidth = this.arrowWidth.value.pxValue();
            var arrowHeight = this.arrowHeight.value.pxValue();
            var arrowXMin = offsetLeft + radius + arrowWidth / 2;
            var arrowXMax = offsetRight - radius - arrowWidth / 2;
            var arrowYMin = offsetTop + radius + arrowWidth / 2;
            var arrowYMax = offsetBottom - radius - arrowWidth / 2;
            arrowNode.style.removeProperty("top");
            arrowNode.style.removeProperty("right");
            arrowNode.style.removeProperty("bottom");
            arrowNode.style.removeProperty("left");
            arrowNode.style.removeProperty("border-left-width");
            arrowNode.style.removeProperty("border-left-style");
            arrowNode.style.removeProperty("border-left-color");
            arrowNode.style.removeProperty("border-right-width");
            arrowNode.style.removeProperty("border-right-style");
            arrowNode.style.removeProperty("border-right-color");
            arrowNode.style.removeProperty("border-top-width");
            arrowNode.style.removeProperty("border-top-style");
            arrowNode.style.removeProperty("border-top-color");
            arrowNode.style.removeProperty("border-bottom-width");
            arrowNode.style.removeProperty("border-bottom-style");
            arrowNode.style.removeProperty("border-bottom-color");
            if (placement === "none" || placement === "above" || placement === "below" || placement === "over") {
                arrowNode.style.setProperty("display", "none");
            }
            else if (offsetTop - arrowHeight >= sourceY
                && arrowXMin <= sourceX && sourceX <= arrowXMax) {
                arrowNode.style.setProperty("display", "block");
                arrowNode.style.setProperty("top", (-arrowHeight) + "px");
                arrowNode.style.setProperty("left", (sourceX - offsetLeft - arrowWidth / 2) + "px");
                arrowNode.style.setProperty("border-left-width", (arrowWidth / 2) + "px");
                arrowNode.style.setProperty("border-left-style", "solid");
                arrowNode.style.setProperty("border-left-color", "transparent");
                arrowNode.style.setProperty("border-right-width", (arrowWidth / 2) + "px");
                arrowNode.style.setProperty("border-right-style", "solid");
                arrowNode.style.setProperty("border-right-color", "transparent");
                arrowNode.style.setProperty("border-bottom-width", arrowHeight + "px");
                arrowNode.style.setProperty("border-bottom-style", "solid");
                arrowNode.style.setProperty("border-bottom-color", backgroundColor.toString());
            }
            else if (offsetBottom + arrowHeight <= sourceY
                && arrowXMin <= sourceX && sourceX <= arrowXMax) {
                arrowNode.style.setProperty("display", "block");
                arrowNode.style.setProperty("bottom", (-arrowHeight) + "px");
                arrowNode.style.setProperty("left", (sourceX - offsetLeft - arrowWidth / 2) + "px");
                arrowNode.style.setProperty("border-left-width", (arrowWidth / 2) + "px");
                arrowNode.style.setProperty("border-left-style", "solid");
                arrowNode.style.setProperty("border-left-color", "transparent");
                arrowNode.style.setProperty("border-right-width", (arrowWidth / 2) + "px");
                arrowNode.style.setProperty("border-right-style", "solid");
                arrowNode.style.setProperty("border-right-color", "transparent");
                arrowNode.style.setProperty("border-top-width", arrowHeight + "px");
                arrowNode.style.setProperty("border-top-style", "solid");
                arrowNode.style.setProperty("border-top-color", backgroundColor.toString());
            }
            else if (offsetLeft - arrowHeight >= sourceX
                && arrowYMin <= sourceY && sourceY <= arrowYMax) {
                arrowNode.style.setProperty("display", "block");
                arrowNode.style.setProperty("left", (-arrowHeight) + "px");
                arrowNode.style.setProperty("top", (sourceY - offsetTop - arrowWidth / 2) + "px");
                arrowNode.style.setProperty("border-top-width", (arrowWidth / 2) + "px");
                arrowNode.style.setProperty("border-top-style", "solid");
                arrowNode.style.setProperty("border-top-color", "transparent");
                arrowNode.style.setProperty("border-bottom-width", (arrowWidth / 2) + "px");
                arrowNode.style.setProperty("border-bottom-style", "solid");
                arrowNode.style.setProperty("border-bottom-color", "transparent");
                arrowNode.style.setProperty("border-right-width", arrowHeight + "px");
                arrowNode.style.setProperty("border-right-style", "solid");
                arrowNode.style.setProperty("border-right-color", backgroundColor.toString());
            }
            else if (offsetRight + arrowHeight <= sourceX
                && arrowYMin <= sourceY && sourceY <= arrowYMax) {
                arrowNode.style.setProperty("display", "block");
                arrowNode.style.setProperty("right", (-arrowHeight) + "px");
                arrowNode.style.setProperty("top", (sourceY - offsetTop - arrowWidth / 2) + "px");
                arrowNode.style.setProperty("border-top-width", (arrowWidth / 2) + "px");
                arrowNode.style.setProperty("border-top-style", "solid");
                arrowNode.style.setProperty("border-top-color", "transparent");
                arrowNode.style.setProperty("border-bottom-width", (arrowWidth / 2) + "px");
                arrowNode.style.setProperty("border-bottom-style", "solid");
                arrowNode.style.setProperty("border-bottom-color", "transparent");
                arrowNode.style.setProperty("border-left-width", arrowHeight + "px");
                arrowNode.style.setProperty("border-left-style", "solid");
                arrowNode.style.setProperty("border-left-color", backgroundColor.toString());
            }
            else {
                arrowNode.style.setProperty("display", "none");
            }
        };
        PopoverView.prototype.viewDidMount = function (view) {
            this.place();
        };
        PopoverView.prototype.viewDidUnmount = function (view) {
            this.place();
        };
        PopoverView.prototype.viewDidResize = function (view) {
            this.place();
        };
        PopoverView.prototype.viewDidScroll = function (view) {
            this.place();
        };
        PopoverView.prototype.viewWillSetAttribute = function (name, value, view) {
            this.place();
        };
        PopoverView.prototype.viewDidSetAttribute = function (name, value, view) {
            this.place();
        };
        PopoverView.prototype.viewWillSetStyle = function (name, value, priority, view) {
            this.place();
        };
        PopoverView.prototype.viewDidSetStyle = function (name, value, priority, view) {
            this.place();
        };
        PopoverView.prototype.viewDidSetAnchor = function (newAnchor, oldAnchor, view) {
            this.place();
        };
        __decorate([
            MemberAnimator(Length)
        ], PopoverView.prototype, "arrowWidth", void 0);
        __decorate([
            MemberAnimator(Length)
        ], PopoverView.prototype, "arrowHeight", void 0);
        return PopoverView;
    }(HtmlView));

    var PopoverViewController = (function (_super) {
        __extends(PopoverViewController, _super);
        function PopoverViewController() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(PopoverViewController.prototype, "source", {
            get: function () {
                var view = this._view;
                return view ? view.source : null;
            },
            enumerable: true,
            configurable: true
        });
        PopoverViewController.prototype.popoverWillSetSource = function (source, view) {
        };
        PopoverViewController.prototype.popoverDidSetSource = function (source, view) {
        };
        PopoverViewController.prototype.popoverWillPlace = function (placement, view) {
        };
        PopoverViewController.prototype.popoverDidPlace = function (placement, view) {
        };
        PopoverViewController.prototype.popoverWillShow = function (view) {
        };
        PopoverViewController.prototype.popoverDidShow = function (view) {
        };
        PopoverViewController.prototype.popoverWillHide = function (view) {
        };
        PopoverViewController.prototype.popoverDidHide = function (view) {
        };
        return PopoverViewController;
    }(HtmlViewController));

    var Rect = (function () {
        function Rect(x, y, width, height) {
            this._x = x;
            this._y = y;
            this._width = width;
            this._height = height;
        }
        Rect.prototype.x = function (x) {
            if (x === void 0) {
                return this._x;
            }
            else {
                x = Length.fromAny(x);
                if (this._x.equals(x)) {
                    return this;
                }
                else {
                    return this.copy(x, this._y, this._width, this._height);
                }
            }
        };
        Rect.prototype.y = function (y) {
            if (y === void 0) {
                return this._y;
            }
            else {
                y = Length.fromAny(y);
                if (this._y.equals(y)) {
                    return this;
                }
                else {
                    return this.copy(this._x, y, this._width, this._height);
                }
            }
        };
        Rect.prototype.width = function (width) {
            if (width === void 0) {
                return this._width;
            }
            else {
                width = Length.fromAny(width);
                if (this._width.equals(width)) {
                    return this;
                }
                else {
                    return this.copy(this._x, this._y, width, this._height);
                }
            }
        };
        Rect.prototype.height = function (height) {
            if (height === void 0) {
                return this._height;
            }
            else {
                height = Length.fromAny(height);
                if (this._height.equals(height)) {
                    return this;
                }
                else {
                    return this.copy(this._x, this._y, this._width, height);
                }
            }
        };
        Rect.prototype.render = function (context) {
            var ctx = context || new PathContext();
            ctx.rect(this._x.pxValue(), this._y.pxValue(), this._width.pxValue(), this._height.pxValue());
            if (!context) {
                return ctx.toString();
            }
        };
        Rect.prototype.copy = function (x, y, width, height) {
            return new Rect(x, y, width, height);
        };
        Rect.prototype.toAny = function () {
            return {
                x: this._x,
                y: this._y,
                width: this._width,
                height: this._height,
            };
        };
        Rect.prototype.equals = function (that) {
            if (this === that) {
                return true;
            }
            else if (that instanceof Rect) {
                return this._x.equals(that._x) && this._y.equals(that._y)
                    && this._width.equals(that._width) && this._height.equals(that._height);
            }
            return false;
        };
        Rect.prototype.debug = function (output) {
            output = output.write("Rect").write(46).write("from").write(40)
                .debug(this._x).write(", ").debug(this._y).write(", ")
                .debug(this._width).write(", ").debug(this._height).write(41);
        };
        Rect.prototype.toString = function () {
            return codec.Format.debug(this);
        };
        Rect.from = function (x, y, width, height) {
            x = Length.fromAny(x);
            y = Length.fromAny(y);
            width = Length.fromAny(width);
            height = Length.fromAny(height);
            return new Rect(x, y, width, height);
        };
        Rect.fromAny = function (rect) {
            if (rect instanceof Rect) {
                return rect;
            }
            else if (typeof rect === "object" && rect) {
                return Rect.from(rect.x, rect.y, rect.width, rect.height);
            }
            throw new TypeError("" + rect);
        };
        return Rect;
    }());

    var RectView = (function (_super) {
        __extends(RectView, _super);
        function RectView(x, y, width, height) {
            if (x === void 0) { x = Length.zero(); }
            if (y === void 0) { y = Length.zero(); }
            if (width === void 0) { width = Length.zero(); }
            if (height === void 0) { height = Length.zero(); }
            var _this = _super.call(this) || this;
            _this.x.setState(x);
            _this.y.setState(y);
            _this.width.setState(width);
            _this.height.setState(height);
            return _this;
        }
        Object.defineProperty(RectView.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RectView.prototype, "value", {
            get: function () {
                return new Rect(this.x.value, this.y.value, this.width.value, this.height.value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RectView.prototype, "state", {
            get: function () {
                return new Rect(this.x.state, this.y.state, this.width.state, this.height.state);
            },
            enumerable: true,
            configurable: true
        });
        RectView.prototype.setState = function (rect, tween) {
            if (rect instanceof Rect) {
                rect = rect.toAny();
            }
            if (rect.key !== void 0) {
                this.key(rect.key);
            }
            if (rect.x !== void 0) {
                this.x(rect.x, tween);
            }
            if (rect.y !== void 0) {
                this.y(rect.y, tween);
            }
            if (rect.width !== void 0) {
                this.width(rect.width, tween);
            }
            if (rect.height !== void 0) {
                this.height(rect.height, tween);
            }
            if (rect.fill !== void 0) {
                this.fill(rect.fill, tween);
            }
            if (rect.stroke !== void 0) {
                this.stroke(rect.stroke, tween);
            }
            if (rect.strokeWidth !== void 0) {
                this.strokeWidth(rect.strokeWidth, tween);
            }
        };
        RectView.prototype.onAnimate = function (t) {
            this.x.onFrame(t);
            this.y.onFrame(t);
            this.width.onFrame(t);
            this.height.onFrame(t);
            this.fill.onFrame(t);
            this.stroke.onFrame(t);
            this.strokeWidth.onFrame(t);
        };
        RectView.prototype.onRender = function (context) {
            context.save();
            context.beginPath();
            context.rect(this.x.value.pxValue(), this.y.value.pxValue(), this.width.value.pxValue(), this.height.value.pxValue());
            var fill = this.fill.value;
            if (fill) {
                context.fillStyle = fill.toString();
                context.fill();
            }
            var stroke = this.stroke.value;
            if (stroke) {
                var strokeWidth = this.strokeWidth.value;
                if (strokeWidth) {
                    var bounds = this._bounds;
                    var size = Math.min(bounds.width, bounds.height);
                    context.lineWidth = strokeWidth.pxValue(size);
                }
                context.strokeStyle = stroke.toString();
                context.stroke();
            }
            context.restore();
        };
        RectView.prototype.hitTest = function (x, y, context) {
            var hit = _super.prototype.hitTest.call(this, x, y, context);
            if (hit === null) {
                context.save();
                var pixelRatio = this.pixelRatio;
                x *= pixelRatio;
                y *= pixelRatio;
                context.beginPath();
                context.rect(this.x.value.pxValue(), this.y.value.pxValue(), this.width.value.pxValue(), this.height.value.pxValue());
                if (this.fill.value && context.isPointInPath(x, y)) {
                    hit = this;
                }
                else if (this.stroke.value) {
                    var strokeWidth = this.strokeWidth.value;
                    if (strokeWidth) {
                        var bounds = this._bounds;
                        var size = Math.min(bounds.width, bounds.height);
                        context.lineWidth = strokeWidth.pxValue(size);
                        if (context.isPointInStroke(x, y)) {
                            hit = this;
                        }
                    }
                }
                context.restore();
            }
            return hit;
        };
        RectView.fromAny = function (rect) {
            if (rect instanceof RectView) {
                return rect;
            }
            else if (rect instanceof Rect) {
                return new RectView(rect.x(), rect.y(), rect.width(), rect.height());
            }
            else if (typeof rect === "object" && rect) {
                var view = new RectView();
                view.setState(rect);
                return view;
            }
            throw new TypeError("" + rect);
        };
        __decorate([
            MemberAnimator(Length)
        ], RectView.prototype, "x", void 0);
        __decorate([
            MemberAnimator(Length)
        ], RectView.prototype, "y", void 0);
        __decorate([
            MemberAnimator(Length)
        ], RectView.prototype, "width", void 0);
        __decorate([
            MemberAnimator(Length)
        ], RectView.prototype, "height", void 0);
        __decorate([
            MemberAnimator(Color, "inherit")
        ], RectView.prototype, "fill", void 0);
        __decorate([
            MemberAnimator(Color, "inherit")
        ], RectView.prototype, "stroke", void 0);
        __decorate([
            MemberAnimator(Length, "inherit")
        ], RectView.prototype, "strokeWidth", void 0);
        return RectView;
    }(GraphicView));

    var PI$1 = Math.PI;
    var TAU$1 = 2 * PI$1;
    var EPSILON$2 = 1e-12;
    var Arc = (function () {
        function Arc(innerRadius, outerRadius, startAngle, sweepAngle, padAngle, padRadius, cornerRadius) {
            this._innerRadius = innerRadius;
            this._outerRadius = outerRadius;
            this._startAngle = startAngle;
            this._deltaAngle = sweepAngle;
            this._padAngle = padAngle;
            this._padRadius = padRadius;
            this._cornerRadius = cornerRadius;
        }
        Arc.prototype.innerRadius = function (innerRadius) {
            if (innerRadius === void 0) {
                return this._innerRadius;
            }
            else {
                innerRadius = Length.fromAny(innerRadius);
                if (this._innerRadius.equals(innerRadius)) {
                    return this;
                }
                else {
                    return this.copy(innerRadius, this._outerRadius, this._startAngle, this._deltaAngle, this._padAngle, this._padRadius, this._cornerRadius);
                }
            }
        };
        Arc.prototype.outerRadius = function (outerRadius) {
            if (outerRadius === void 0) {
                return this._outerRadius;
            }
            else {
                outerRadius = Length.fromAny(outerRadius);
                if (this._outerRadius.equals(outerRadius)) {
                    return this;
                }
                else {
                    return this.copy(this._innerRadius, outerRadius, this._startAngle, this._deltaAngle, this._padAngle, this._padRadius, this._cornerRadius);
                }
            }
        };
        Arc.prototype.startAngle = function (startAngle) {
            if (startAngle === void 0) {
                return this._startAngle;
            }
            else {
                startAngle = Angle.fromAny(startAngle);
                if (this._startAngle.equals(startAngle)) {
                    return this;
                }
                else {
                    return this.copy(this._innerRadius, this._outerRadius, startAngle, this._deltaAngle, this._padAngle, this._padRadius, this._cornerRadius);
                }
            }
        };
        Arc.prototype.sweepAngle = function (sweepAngle) {
            if (sweepAngle === void 0) {
                return this._deltaAngle;
            }
            else {
                sweepAngle = Angle.fromAny(sweepAngle);
                if (this._deltaAngle.equals(sweepAngle)) {
                    return this;
                }
                else {
                    return this.copy(this._innerRadius, this._outerRadius, this._startAngle, sweepAngle, this._padAngle, this._padRadius, this._cornerRadius);
                }
            }
        };
        Arc.prototype.padAngle = function (padAngle) {
            if (padAngle === void 0) {
                return this._padAngle;
            }
            else {
                padAngle = Angle.fromAny(padAngle);
                if (this._padAngle.equals(padAngle)) {
                    return this;
                }
                else {
                    return this.copy(this._innerRadius, this._outerRadius, this._startAngle, this._deltaAngle, padAngle, this._padRadius, this._cornerRadius);
                }
            }
        };
        Arc.prototype.padRadius = function (padRadius) {
            if (padRadius === void 0) {
                return this._padRadius;
            }
            else {
                padRadius = padRadius !== null ? Length.fromAny(padRadius) : null;
                if (util.Objects.equal(this._padRadius, padRadius)) {
                    return this;
                }
                else {
                    return this.copy(this._innerRadius, this._outerRadius, this._startAngle, this._deltaAngle, this._padAngle, padRadius, this._cornerRadius);
                }
            }
        };
        Arc.prototype.cornerRadius = function (cornerRadius) {
            if (cornerRadius === void 0) {
                return this._cornerRadius;
            }
            else {
                cornerRadius = Length.fromAny(cornerRadius);
                if (this._cornerRadius.equals(cornerRadius)) {
                    return this;
                }
                else {
                    return this.copy(this._innerRadius, this._outerRadius, this._startAngle, this._deltaAngle, this._padAngle, this._padRadius, cornerRadius);
                }
            }
        };
        Arc.prototype.render = function (context, bounds, anchor) {
            var ctx = context || new PathContext();
            var cx;
            var cy;
            if (anchor) {
                cx = anchor.x;
                cy = anchor.y;
            }
            else {
                cx = 0;
                cy = 0;
            }
            var size;
            if (bounds) {
                size = Math.min(bounds.width, bounds.height);
            }
            var r0 = this._innerRadius.pxValue(size);
            var r1 = this._outerRadius.pxValue(size);
            var a0 = this._startAngle.radValue();
            var da = this._deltaAngle.radValue();
            var a1 = a0 + da;
            var cw = da >= 0;
            if (r1 < r0) {
                var r = r1;
                r1 = r0;
                r0 = r;
            }
            if (!(r1 > EPSILON$2)) {
                ctx.moveTo(cx, cy);
            }
            else if (da > TAU$1 - EPSILON$2) {
                ctx.moveTo(cx + r1 * Math.cos(a0), cy + r1 * Math.sin(a0));
                ctx.arc(cx, cy, r1, a0, a1, !cw);
                if (r0 > EPSILON$2) {
                    ctx.moveTo(cx + r0 * Math.cos(a1), cy + r0 * Math.sin(a1));
                    ctx.arc(cx, cy, r0, a1, a0, cw);
                }
            }
            else {
                var a01 = a0;
                var a11 = a1;
                var a00 = a0;
                var a10 = a1;
                var da0 = da;
                var da1 = da;
                var ap = (this._padAngle.radValue()) / 2;
                var rp = +(ap > EPSILON$2) && (this._padRadius !== null ? this._padRadius.pxValue(size) : Math.sqrt(r0 * r0 + r1 * r1));
                var rc = Math.min(Math.abs(r1 - r0) / 2, this._cornerRadius.pxValue(size));
                var rc0 = rc;
                var rc1 = rc;
                if (rp > EPSILON$2) {
                    var p0 = Math.asin(rp / r0 * Math.sin(ap));
                    var p1 = Math.asin(rp / r1 * Math.sin(ap));
                    if ((da0 -= p0 * 2) > EPSILON$2) {
                        p0 *= cw ? 1 : -1;
                        a00 += p0;
                        a10 -= p0;
                    }
                    else {
                        da0 = 0;
                        a00 = a10 = (a0 + a1) / 2;
                    }
                    if ((da1 -= p1 * 2) > EPSILON$2) {
                        p1 *= cw ? 1 : -1;
                        a01 += p1;
                        a11 -= p1;
                    }
                    else {
                        da1 = 0;
                        a01 = a11 = (a0 + a1) / 2;
                    }
                }
                var x00 = void 0;
                var y00 = void 0;
                var x01 = r1 * Math.cos(a01);
                var y01 = r1 * Math.sin(a01);
                var x10 = r0 * Math.cos(a10);
                var y10 = r0 * Math.sin(a10);
                var x11 = void 0;
                var y11 = void 0;
                if (rc > EPSILON$2) {
                    x11 = r1 * Math.cos(a11);
                    y11 = r1 * Math.sin(a11);
                    x00 = r0 * Math.cos(a00);
                    y00 = r0 * Math.sin(a00);
                    if (da < PI$1) {
                        var oc = da0 > EPSILON$2 ? Arc.intersect(x01, y01, x00, y00, x11, y11, x10, y10) : [x10, y10];
                        var ax = x01 - oc[0];
                        var ay = y01 - oc[1];
                        var bx = x11 - oc[0];
                        var by = y11 - oc[1];
                        var kc = 1 / Math.sin(0.5 * Math.acos((ax * bx + ay * by) /
                            (Math.sqrt(ax * ax + ay * ay) *
                                Math.sqrt(bx * bx + by * by))));
                        var lc = Math.sqrt(oc[0] * oc[0] + oc[1] * oc[1]);
                        rc0 = Math.min(rc, (r0 - lc) / (kc - 1));
                        rc1 = Math.min(rc, (r1 - lc) / (kc + 1));
                    }
                }
                if (!(da1 > EPSILON$2)) {
                    ctx.moveTo(cx + x01, cy + y01);
                }
                else if (rc1 > EPSILON$2) {
                    var t0 = Arc.cornerTangents(x00, y00, x01, y01, r1, rc1, cw);
                    var t1 = Arc.cornerTangents(x11, y11, x10, y10, r1, rc1, cw);
                    ctx.moveTo(cx + t0.cx + t0.x01, cy + t0.cy + t0.y01);
                    if (rc1 < rc) {
                        ctx.arc(cx + t0.cx, cy + t0.cy, rc1, Math.atan2(t0.y01, t0.x01), Math.atan2(t1.y01, t1.x01), !cw);
                    }
                    else {
                        ctx.arc(cx + t0.cx, cy + t0.cy, rc1, Math.atan2(t0.y01, t0.x01), Math.atan2(t0.y11, t0.x11), !cw);
                        ctx.arc(cx, cy, r1, Math.atan2(t0.cy + t0.y11, t0.cx + t0.x11), Math.atan2(t1.cy + t1.y11, t1.cx + t1.x11), !cw);
                        ctx.arc(cx + t1.cx, cy + t1.cy, rc1, Math.atan2(t1.y11, t1.x11), Math.atan2(t1.y01, t1.x01), !cw);
                    }
                }
                else {
                    ctx.moveTo(cx + x01, cy + y01);
                    ctx.arc(cx, cy, r1, a01, a11, !cw);
                }
                if (!(r0 > EPSILON$2) || !(da0 > EPSILON$2)) {
                    ctx.lineTo(cx + x10, cy + y10);
                }
                else if (rc0 > EPSILON$2) {
                    var t0 = Arc.cornerTangents(x10, y10, x11, y11, r0, -rc0, cw);
                    var t1 = Arc.cornerTangents(x01, y01, x00, y00, r0, -rc0, cw);
                    ctx.lineTo(cx + t0.cx + t0.x01, cy + t0.cy + t0.y01);
                    if (rc0 < rc) {
                        ctx.arc(cx + t0.cx, cy + t0.cy, rc0, Math.atan2(t0.y01, t0.x01), Math.atan2(t1.y01, t1.x01), !cw);
                    }
                    else {
                        ctx.arc(cx + t0.cx, cy + t0.cy, rc0, Math.atan2(t0.y01, t0.x01), Math.atan2(t0.y11, t0.x11), !cw);
                        ctx.arc(cx, cy, r0, Math.atan2(t0.cy + t0.y11, t0.cx + t0.x11), Math.atan2(t1.cy + t1.y11, t1.cx + t1.x11), cw);
                        ctx.arc(cx + t1.cx, cy + t1.cy, rc0, Math.atan2(t1.y11, t1.x11), Math.atan2(t1.y01, t1.x01), !cw);
                    }
                }
                else {
                    ctx.arc(cx, cy, r0, a10, a00, cw);
                }
            }
            ctx.closePath();
            if (!context) {
                return ctx.toString();
            }
        };
        Arc.prototype.copy = function (innerRadius, outerRadius, startAngle, sweepAngle, padAngle, padRadius, cornerRadius) {
            return new Arc(innerRadius, outerRadius, startAngle, sweepAngle, padAngle, padRadius, cornerRadius);
        };
        Arc.prototype.toAny = function () {
            return {
                innerRadius: this._innerRadius,
                outerRadius: this._outerRadius,
                startAngle: this._startAngle,
                sweepAngle: this._deltaAngle,
                padAngle: this._padAngle,
                padRadius: this._padRadius,
                cornerRadius: this._cornerRadius,
            };
        };
        Arc.prototype.equals = function (that) {
            if (this === that) {
                return true;
            }
            else if (that instanceof Arc) {
                return this._innerRadius.equals(that._innerRadius)
                    && this._outerRadius.equals(that._outerRadius)
                    && this._startAngle.equals(that._startAngle)
                    && this._deltaAngle.equals(that._deltaAngle)
                    && this._padAngle.equals(that._padAngle)
                    && util.Objects.equal(this._padRadius, that._padRadius)
                    && this._cornerRadius.equals(that._cornerRadius);
            }
            return false;
        };
        Arc.prototype.debug = function (output) {
            output = output.write("Arc").write(46).write("from").write(40).write(41);
            if (this._innerRadius.isDefined()) {
                output = output.write(46).write("innerRadius").write(40).debug(this._innerRadius).write(41);
            }
            if (this._outerRadius.isDefined()) {
                output = output.write(46).write("outerRadius").write(40).debug(this._outerRadius).write(41);
            }
            if (this._startAngle.isDefined()) {
                output = output.write(46).write("startAngle").write(40).debug(this._startAngle).write(41);
            }
            if (this._deltaAngle.isDefined()) {
                output = output.write(46).write("sweepAngle").write(40).debug(this._deltaAngle).write(41);
            }
            if (this._padAngle.isDefined()) {
                output = output.write(46).write("padAngle").write(40).debug(this._padAngle).write(41);
            }
            if (this._padRadius !== null) {
                output = output.write(46).write("padRadius").write(40).debug(this._padRadius).write(41);
            }
            if (this._cornerRadius.isDefined()) {
                output = output.write(46).write("cornerRadius").write(40).debug(this._cornerRadius).write(41);
            }
        };
        Arc.prototype.toString = function () {
            return codec.Format.debug(this);
        };
        Arc.from = function (innerRadius, outerRadius, startAngle, sweepAngle, padAngle, padRadius, cornerRadius) {
            if (innerRadius === void 0) { innerRadius = Length.zero(); }
            if (outerRadius === void 0) { outerRadius = Length.zero(); }
            if (startAngle === void 0) { startAngle = Angle.zero(); }
            if (sweepAngle === void 0) { sweepAngle = Angle.zero(); }
            if (padAngle === void 0) { padAngle = Angle.zero(); }
            if (padRadius === void 0) { padRadius = null; }
            if (cornerRadius === void 0) { cornerRadius = Length.zero(); }
            innerRadius = Length.fromAny(innerRadius);
            outerRadius = Length.fromAny(outerRadius);
            startAngle = Angle.fromAny(startAngle);
            sweepAngle = Angle.fromAny(sweepAngle);
            padAngle = Angle.fromAny(padAngle);
            padRadius = padRadius !== null ? Length.fromAny(padRadius) : null;
            cornerRadius = Length.fromAny(cornerRadius);
            return new Arc(innerRadius, outerRadius, startAngle, sweepAngle, padAngle, padRadius, cornerRadius);
        };
        Arc.fromAny = function (arc) {
            if (arc instanceof Arc) {
                return arc;
            }
            else if (typeof arc === "object" && arc) {
                return Arc.from(arc.innerRadius, arc.outerRadius, arc.startAngle, arc.sweepAngle, arc.padAngle, arc.padRadius, arc.cornerRadius);
            }
            throw new TypeError("" + arc);
        };
        Arc.intersect = function (x0, y0, x1, y1, x2, y2, x3, y3) {
            var x10 = x1 - x0;
            var y10 = y1 - y0;
            var x32 = x3 - x2;
            var y32 = y3 - y2;
            var t = (x32 * (y0 - y2) - y32 * (x0 - x2)) / (y32 * x10 - x32 * y10);
            return [x0 + t * x10, y0 + t * y10];
        };
        Arc.cornerTangents = function (x0, y0, x1, y1, r1, rc, cw) {
            var x01 = x0 - x1;
            var y01 = y0 - y1;
            var lo = (cw ? rc : -rc) / Math.sqrt(x01 * x01 + y01 * y01);
            var ox = lo * y01;
            var oy = -lo * x01;
            var x11 = x0 + ox;
            var y11 = y0 + oy;
            var x10 = x1 + ox;
            var y10 = y1 + oy;
            var x00 = (x11 + x10) / 2;
            var y00 = (y11 + y10) / 2;
            var dx = x10 - x11;
            var dy = y10 - y11;
            var d2 = dx * dx + dy * dy;
            var r = r1 - rc;
            var D = x11 * y10 - x10 * y11;
            var d = (dy < 0 ? -1 : 1) * Math.sqrt(Math.max(0, r * r * d2 - D * D));
            var cx0 = (D * dy - dx * d) / d2;
            var cy0 = (-D * dx - dy * d) / d2;
            var cx1 = (D * dy + dx * d) / d2;
            var cy1 = (-D * dx + dy * d) / d2;
            var dx0 = cx0 - x00;
            var dy0 = cy0 - y00;
            var dx1 = cx1 - x00;
            var dy1 = cy1 - y00;
            if (dx0 * dx0 + dy0 * dy0 > dx1 * dx1 + dy1 * dy1) {
                cx0 = cx1;
                cy0 = cy1;
            }
            return {
                cx: cx0,
                cy: cy0,
                x01: -ox,
                y01: -oy,
                x11: cx0 * (r1 / r - 1),
                y11: cy0 * (r1 / r - 1),
            };
        };
        return Arc;
    }());

    var ArcView = (function (_super) {
        __extends(ArcView, _super);
        function ArcView(innerRadius, outerRadius, startAngle, sweepAngle, padAngle, padRadius, cornerRadius) {
            if (innerRadius === void 0) { innerRadius = Length.zero(); }
            if (outerRadius === void 0) { outerRadius = Length.zero(); }
            if (startAngle === void 0) { startAngle = Angle.zero(); }
            if (sweepAngle === void 0) { sweepAngle = Angle.zero(); }
            if (padAngle === void 0) { padAngle = Angle.zero(); }
            if (padRadius === void 0) { padRadius = null; }
            if (cornerRadius === void 0) { cornerRadius = Length.zero(); }
            var _this = _super.call(this) || this;
            _this.innerRadius.setState(innerRadius);
            _this.outerRadius.setState(outerRadius);
            _this.startAngle.setState(startAngle);
            _this.sweepAngle.setState(sweepAngle);
            _this.padAngle.setState(padAngle);
            _this.padRadius.setState(padRadius);
            _this.cornerRadius.setState(cornerRadius);
            return _this;
        }
        Object.defineProperty(ArcView.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArcView.prototype, "value", {
            get: function () {
                return new Arc(this.innerRadius.value, this.outerRadius.value, this.startAngle.value, this.sweepAngle.value, this.padAngle.value, this.padRadius.value, this.cornerRadius.value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArcView.prototype, "state", {
            get: function () {
                return new Arc(this.innerRadius.state, this.outerRadius.state, this.startAngle.state, this.sweepAngle.state, this.padAngle.state, this.padRadius.state, this.cornerRadius.state);
            },
            enumerable: true,
            configurable: true
        });
        ArcView.prototype.setState = function (arc, tween) {
            if (arc instanceof Arc) {
                arc = arc.toAny();
            }
            if (arc.key !== void 0) {
                this.key(arc.key);
            }
            if (arc.innerRadius !== void 0) {
                this.innerRadius(arc.innerRadius, tween);
            }
            if (arc.outerRadius !== void 0) {
                this.outerRadius(arc.outerRadius, tween);
            }
            if (arc.startAngle !== void 0) {
                this.startAngle(arc.startAngle, tween);
            }
            if (arc.sweepAngle !== void 0) {
                this.sweepAngle(arc.sweepAngle, tween);
            }
            if (arc.padAngle !== void 0) {
                this.padAngle(arc.padAngle, tween);
            }
            if (arc.padRadius !== void 0) {
                this.padRadius(arc.padRadius, tween);
            }
            if (arc.cornerRadius !== void 0) {
                this.cornerRadius(arc.cornerRadius, tween);
            }
            if (arc.fill !== void 0) {
                this.fill(arc.fill, tween);
            }
            if (arc.stroke !== void 0) {
                this.stroke(arc.stroke, tween);
            }
            if (arc.strokeWidth !== void 0) {
                this.strokeWidth(arc.strokeWidth, tween);
            }
        };
        ArcView.prototype.onAnimate = function (t) {
            this.innerRadius.onFrame(t);
            this.outerRadius.onFrame(t);
            this.startAngle.onFrame(t);
            this.sweepAngle.onFrame(t);
            this.padAngle.onFrame(t);
            this.padRadius.onFrame(t);
            this.cornerRadius.onFrame(t);
            this.fill.onFrame(t);
            this.stroke.onFrame(t);
            this.strokeWidth.onFrame(t);
        };
        ArcView.prototype.onRender = function (context) {
            context.save();
            var bounds = this._bounds;
            var arc = this.value;
            arc.render(context, bounds, this._anchor);
            var fill = this.fill.value;
            if (fill) {
                context.fillStyle = fill.toString();
                context.fill();
            }
            var stroke = this.stroke.value;
            if (stroke) {
                var strokeWidth = this.strokeWidth.value;
                if (strokeWidth) {
                    var size = Math.min(bounds.width, bounds.height);
                    context.lineWidth = strokeWidth.pxValue(size);
                }
                context.strokeStyle = stroke.toString();
                context.stroke();
            }
            context.restore();
        };
        ArcView.prototype.hitTest = function (x, y, context) {
            var hit = _super.prototype.hitTest.call(this, x, y, context);
            if (hit === null) {
                context.save();
                var pixelRatio = this.pixelRatio;
                x *= pixelRatio;
                y *= pixelRatio;
                context.beginPath();
                var bounds = this._bounds;
                var arc = this.value;
                arc.render(context, bounds, this._anchor);
                if (this.fill.value && context.isPointInPath(x, y)) {
                    hit = this;
                }
                else if (this.stroke.value) {
                    var strokeWidth = this.strokeWidth.value;
                    if (strokeWidth) {
                        var size = Math.min(bounds.width, bounds.height);
                        context.lineWidth = strokeWidth.pxValue(size);
                        if (context.isPointInStroke(x, y)) {
                            hit = this;
                        }
                    }
                }
                context.restore();
            }
            return hit;
        };
        ArcView.from = function (innerRadius, outerRadius, startAngle, sweepAngle, padAngle, padRadius, cornerRadius, fill, stroke, strokeWidth) {
            if (innerRadius === void 0) { innerRadius = Length.zero(); }
            if (outerRadius === void 0) { outerRadius = Length.zero(); }
            if (startAngle === void 0) { startAngle = Angle.zero(); }
            if (sweepAngle === void 0) { sweepAngle = Angle.zero(); }
            if (padAngle === void 0) { padAngle = Angle.zero(); }
            if (padRadius === void 0) { padRadius = null; }
            if (cornerRadius === void 0) { cornerRadius = Length.zero(); }
            innerRadius = Length.fromAny(innerRadius);
            outerRadius = Length.fromAny(outerRadius);
            startAngle = Angle.fromAny(startAngle);
            sweepAngle = Angle.fromAny(sweepAngle);
            padAngle = Angle.fromAny(padAngle);
            padRadius = padRadius !== null ? Length.fromAny(padRadius) : null;
            cornerRadius = Length.fromAny(cornerRadius);
            var view = new ArcView(innerRadius, outerRadius, startAngle, sweepAngle, padAngle, padRadius, cornerRadius);
            if (fill !== void 0) {
                view.fill(fill);
            }
            if (stroke !== void 0) {
                view.stroke(stroke);
            }
            if (strokeWidth !== void 0) {
                view.strokeWidth(strokeWidth);
            }
            return view;
        };
        ArcView.fromAny = function (arc) {
            if (arc instanceof ArcView) {
                return arc;
            }
            else if (arc instanceof Arc) {
                return new ArcView(arc.innerRadius(), arc.outerRadius(), arc.startAngle(), arc.sweepAngle(), arc.padAngle(), arc.padRadius(), arc.cornerRadius());
            }
            else if (typeof arc === "object" && arc) {
                var view = new ArcView();
                view.setState(arc);
                return view;
            }
            throw new TypeError("" + arc);
        };
        __decorate([
            MemberAnimator(Length)
        ], ArcView.prototype, "innerRadius", void 0);
        __decorate([
            MemberAnimator(Length)
        ], ArcView.prototype, "outerRadius", void 0);
        __decorate([
            MemberAnimator(Angle)
        ], ArcView.prototype, "startAngle", void 0);
        __decorate([
            MemberAnimator(Angle)
        ], ArcView.prototype, "sweepAngle", void 0);
        __decorate([
            MemberAnimator(Angle)
        ], ArcView.prototype, "padAngle", void 0);
        __decorate([
            MemberAnimator(Length)
        ], ArcView.prototype, "padRadius", void 0);
        __decorate([
            MemberAnimator(Length)
        ], ArcView.prototype, "cornerRadius", void 0);
        __decorate([
            MemberAnimator(Color, "inherit")
        ], ArcView.prototype, "fill", void 0);
        __decorate([
            MemberAnimator(Color, "inherit")
        ], ArcView.prototype, "stroke", void 0);
        __decorate([
            MemberAnimator(Length, "inherit")
        ], ArcView.prototype, "strokeWidth", void 0);
        return ArcView;
    }(GraphicView));

    var TextRun = (function () {
        function TextRun(text, font, textAlign, textBaseline, textColor) {
            this._text = text;
            this._font = font;
            this._textAlign = textAlign;
            this._textBaseline = textBaseline;
            this._textColor = textColor;
        }
        TextRun.prototype.text = function (text) {
            if (text === void 0) {
                return this._text;
            }
            else {
                if (this._text === text) {
                    return this;
                }
                else {
                    return this.copy(text, this._font, this._textAlign, this._textBaseline, this._textColor);
                }
            }
        };
        TextRun.prototype.font = function (font) {
            if (font === void 0) {
                return this._font;
            }
            else {
                font = font !== null ? Font.fromAny(font) : null;
                if (this._font === font) {
                    return this;
                }
                else {
                    return this.copy(this._text, font, this._textAlign, this._textBaseline, this._textColor);
                }
            }
        };
        TextRun.prototype.textAlign = function (textAlign) {
            if (textAlign === void 0) {
                return this._textAlign;
            }
            else {
                if (this._textAlign === textAlign) {
                    return this;
                }
                else {
                    return this.copy(this._text, this._font, textAlign, this._textBaseline, this._textColor);
                }
            }
        };
        TextRun.prototype.textBaseline = function (textBaseline) {
            if (textBaseline === void 0) {
                return this._textBaseline;
            }
            else {
                if (this._textBaseline === textBaseline) {
                    return this;
                }
                else {
                    return this.copy(this._text, this._font, this._textAlign, textBaseline, this._textColor);
                }
            }
        };
        TextRun.prototype.textColor = function (textColor) {
            if (textColor === void 0) {
                return this._textColor;
            }
            else {
                textColor = textColor !== null ? Color.fromAny(textColor) : null;
                if (this._textColor === textColor) {
                    return this;
                }
                else {
                    return this.copy(this._text, this._font, this._textAlign, this._textBaseline, textColor);
                }
            }
        };
        TextRun.prototype.render = function (context, bounds, anchor) {
            context.save();
            if (this._font !== null) {
                context.font = this._font.toString();
            }
            if (this._textAlign !== null) {
                context.textAlign = this._textAlign;
            }
            if (this._textBaseline !== null) {
                context.textBaseline = this._textBaseline;
            }
            if (this._textColor !== null) {
                context.fillStyle = this._textColor.toString();
            }
            context.fillText(this._text, anchor.x, anchor.y);
            context.restore();
        };
        TextRun.prototype.copy = function (text, font, textAlign, textBaseline, textColor) {
            return new TextRun(text, font, textAlign, textBaseline, textColor);
        };
        TextRun.prototype.toAny = function () {
            var init = { text: this._text };
            if (this._font !== null) {
                init.font = this._font;
            }
            if (this._font !== null) {
                init.font = this._font;
            }
            if (this._textAlign !== null) {
                init.textAlign = this._textAlign;
            }
            if (this._textBaseline !== null) {
                init.textBaseline = this._textBaseline;
            }
            if (this._textColor !== null) {
                init.textColor = this._textColor;
            }
            return init;
        };
        TextRun.prototype.equals = function (that) {
            if (this === that) {
                return true;
            }
            else if (that instanceof TextRun) {
                return this._text === that._text && util.Objects.equal(this._font, that._font)
                    && this._textAlign === that._textAlign && this._textBaseline === that._textBaseline
                    && util.Objects.equal(this._textColor, that._textColor);
            }
            return false;
        };
        TextRun.prototype.debug = function (output) {
            output = output.write("TextRun").write(46).write("from").write(40)
                .debug(this._text).write(41);
            if (this._font !== null) {
                output = output.write(46).write("font").write(40).debug(this._font).write(41);
            }
            if (this._textAlign !== null) {
                output = output.write(46).write("textAlign").write(40).debug(this._textAlign).write(41);
            }
            if (this._textBaseline !== null) {
                output = output.write(46).write("textBaseline").write(40).debug(this._textBaseline).write(41);
            }
            if (this._textColor !== null) {
                output = output.write(46).write("textColor").write(40).debug(this._textColor).write(41);
            }
        };
        TextRun.prototype.toString = function () {
            return codec.Format.debug(this);
        };
        TextRun.from = function (text, font, textAlign, textBaseline, textColor) {
            if (font === void 0) { font = null; }
            if (textAlign === void 0) { textAlign = null; }
            if (textBaseline === void 0) { textBaseline = null; }
            if (textColor === void 0) { textColor = null; }
            font = font !== null ? Font.fromAny(font) : null;
            textColor = textColor !== null ? Color.fromAny(textColor) : null;
            return new TextRun(text, font, textAlign, textBaseline, textColor);
        };
        TextRun.fromAny = function (run) {
            if (run instanceof TextRun) {
                return run;
            }
            else if (typeof run === "object" && run) {
                return TextRun.from(run.text, run.font, run.textAlign, run.textBaseline, run.textColor);
            }
            else if (typeof run === "string") {
                return TextRun.from(run);
            }
            throw new TypeError("" + run);
        };
        return TextRun;
    }());

    var TextRunView = (function (_super) {
        __extends(TextRunView, _super);
        function TextRunView(text) {
            if (text === void 0) { text = ""; }
            var _this = _super.call(this) || this;
            _this.text.setState(text);
            return _this;
        }
        Object.defineProperty(TextRunView.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextRunView.prototype, "value", {
            get: function () {
                return new TextRun(this.text.value, this.font.value, this.textAlign.value, this.textBaseline.value, this.textColor.value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextRunView.prototype, "state", {
            get: function () {
                return new TextRun(this.text.state, this.font.state, this.textAlign.state, this.textBaseline.state, this.textColor.state);
            },
            enumerable: true,
            configurable: true
        });
        TextRunView.prototype.setState = function (run, tween) {
            if (typeof run === "string") {
                this.text(run, tween);
            }
            else {
                if (run instanceof TextRun) {
                    run = run.toAny();
                }
                if (run.key !== void 0) {
                    this.key(run.key);
                }
                if (run.text !== void 0) {
                    this.text(run.text, tween);
                }
                if (run.font !== void 0) {
                    this.font(run.font, tween);
                }
                if (run.textAlign !== void 0) {
                    this.textAlign(run.textAlign, tween);
                }
                if (run.textBaseline !== void 0) {
                    this.textBaseline(run.textBaseline, tween);
                }
                if (run.textColor !== void 0) {
                    this.textColor(run.textColor, tween);
                }
            }
        };
        TextRunView.prototype.onAnimate = function (t) {
            this.text.onFrame(t);
            this.font.onFrame(t);
            this.textAlign.onFrame(t);
            this.textBaseline.onFrame(t);
            this.textColor.onFrame(t);
        };
        TextRunView.prototype.onRender = function (context) {
            context.save();
            var anchor = this._anchor;
            var font = this.font.value;
            if (font) {
                context.font = font.toString();
            }
            var textAlign = this.textAlign.value;
            if (textAlign) {
                context.textAlign = textAlign;
            }
            var textBaseline = this.textBaseline.value;
            if (textBaseline) {
                context.textBaseline = textBaseline;
            }
            var textColor = this.textColor.value;
            if (textColor) {
                context.fillStyle = textColor.toString();
            }
            context.fillText(this.text.value, anchor.x, anchor.y);
            context.restore();
        };
        TextRunView.fromAny = function (run) {
            if (run instanceof TextRunView) {
                return run;
            }
            else if (typeof run === "object" && run) {
                var view = new TextRunView();
                view.setState(run);
                return view;
            }
            else if (typeof run === "string") {
                return new TextRunView(run);
            }
            throw new TypeError("" + run);
        };
        __decorate([
            MemberAnimator(String)
        ], TextRunView.prototype, "text", void 0);
        __decorate([
            MemberAnimator(Font, "inherit")
        ], TextRunView.prototype, "font", void 0);
        __decorate([
            MemberAnimator(String, "inherit")
        ], TextRunView.prototype, "textAlign", void 0);
        __decorate([
            MemberAnimator(String, "inherit")
        ], TextRunView.prototype, "textBaseline", void 0);
        __decorate([
            MemberAnimator(Color, "inherit")
        ], TextRunView.prototype, "textColor", void 0);
        return TextRunView;
    }(GraphicView));

    var COS_PI_4 = Math.cos(Math.PI / 4);
    var SIN_PI_4 = Math.sin(Math.PI / 4);
    var MultitouchEvent = (function (_super) {
        __extends(MultitouchEvent, _super);
        function MultitouchEvent(type, init) {
            var _this = _super.call(this, type, init) || this;
            _this.points = init.points;
            return _this;
        }
        return MultitouchEvent;
    }(CustomEventConstructor));
    var MultitouchTrack = (function () {
        function MultitouchTrack(multitouch, identifier) {
            this.multitouch = multitouch;
            this.identifier = identifier;
            this.path = [];
            this.t = NaN;
            this.cx = NaN;
            this.cy = NaN;
            this.vx = NaN;
            this.vy = NaN;
            this.ax = NaN;
            this.ay = NaN;
            this.dx = NaN;
            this.dy = NaN;
        }
        Object.defineProperty(MultitouchTrack.prototype, "ghost", {
            get: function () {
                return false;
            },
            enumerable: true,
            configurable: true
        });
        MultitouchTrack.prototype.moveTo = function (t, cx, cy) {
            this.path.push({ t: t, cx: cx, cy: cy });
            while (this.path.length > 1) {
                if (t - this.path[0].t > this.multitouch._hysteresis) {
                    this.path.splice(0, 1);
                }
                else {
                    break;
                }
            }
            this.update();
        };
        MultitouchTrack.prototype.update = function () {
            var p0 = this.path[0];
            var p1 = this.path[this.path.length - 1];
            if (p1 && p1 !== p0) {
                var dt = p1.t - p0.t;
                var vx = void 0;
                var vy = void 0;
                if (dt) {
                    vx = (p1.cx - p0.cx) / dt;
                    vy = (p1.cy - p0.cy) / dt;
                    var v2 = vx * vx + vy * vy;
                    var vMax = this.multitouch._velocityMax;
                    var vMax2 = vMax * vMax;
                    if (vMax2 < v2) {
                        var v = Math.sqrt(v2);
                        vx = vx * vMax / v;
                        vy = vy * vMax / v;
                    }
                }
                else {
                    vx = 0;
                    vy = 0;
                }
                this.t = p1.t;
                this.dx = p1.cx - this.cx;
                this.dy = p1.cy - this.cy;
                this.cx = p1.cx;
                this.cy = p1.cy;
                this.vx = vx;
                this.vy = vy;
            }
            else if (p0) {
                this.t = p0.t;
                this.dx = p0.cx - this.cx;
                this.dy = p0.cy - this.cy;
                this.cx = p0.cx;
                this.cy = p0.cy;
                this.vx = 0;
                this.vy = 0;
            }
        };
        return MultitouchTrack;
    }());
    var MultitouchGhost = (function () {
        function MultitouchGhost(multitouch, identifier, t, cx, cy, vx, vy, ax, ay) {
            this.multitouch = multitouch;
            this.identifier = identifier;
            this.t = t;
            this.cx = cx;
            this.cy = cy;
            this.vx = vx;
            this.vy = vy;
            this.ax = ax;
            this.ay = ay;
            this.dx = 0;
            this.dy = 0;
        }
        Object.defineProperty(MultitouchGhost.prototype, "ghost", {
            get: function () {
                return true;
            },
            enumerable: true,
            configurable: true
        });
        MultitouchGhost.prototype.translate = function (dx, dy) {
            this.cx += dx;
            this.cy += dy;
        };
        MultitouchGhost.prototype.update = function (t) {
            var dt = t - this.t;
            if (dt) {
                var vx = this.vx + this.ax * dt;
                var cx = void 0;
                if (vx < 0 === this.vx < 0) {
                    cx = this.cx + this.vx * dt + 0.5 * (this.ax * dt * dt);
                }
                else {
                    cx = this.cx - (this.vx * this.vx) / (2 * this.ax);
                    vx = 0;
                    this.ax = 0;
                }
                var vy = this.vy + this.ay * dt;
                var cy = void 0;
                if (vy < 0 === this.vy < 0) {
                    cy = this.cy + this.vy * dt + 0.5 * (this.ay * dt * dt);
                }
                else {
                    cy = this.cy - (this.vy * this.vy) / (2 * this.ay);
                    vy = 0;
                    this.ay = 0;
                }
                this.dx = cx - this.cx;
                this.dy = cy - this.cy;
                this.cx = cx;
                this.cy = cy;
                this.vx = vx;
                this.vy = vy;
                this.t = t;
            }
        };
        return MultitouchGhost;
    }());
    var Multitouch = (function () {
        function Multitouch() {
            this._surface = null;
            this._tracks = {};
            this._trackCount = 0;
            this._ghosts = {};
            this._ghostCount = 0;
            this._ghostFrame = 0;
            this._hysteresis = 67;
            this._acceleration = 0.00175;
            this._velocityMax = 1.75;
            this._distanceMin = 10;
            this.onGhostFrame = this.onGhostFrame.bind(this);
        }
        Multitouch.prototype.surface = function (surface) {
            if (surface === void 0) {
                return this._surface;
            }
            else {
                if (this._surface) {
                    this.detach(this._surface);
                }
                this._surface = surface;
                return this;
            }
        };
        Multitouch.prototype.target = function () {
            var view = this._surface;
            while (view) {
                if (view instanceof ElementView) {
                    return view;
                }
                view = view.parentView;
            }
            return null;
        };
        Multitouch.prototype.hysteresis = function (hysteresis) {
            if (hysteresis === void 0) {
                return this._hysteresis;
            }
            else {
                this._hysteresis = hysteresis;
                return this;
            }
        };
        Multitouch.prototype.acceleration = function (acceleration) {
            if (acceleration === void 0) {
                return this._acceleration;
            }
            else {
                this._acceleration = acceleration;
                return this;
            }
        };
        Multitouch.prototype.velocityMax = function (velocityMax) {
            if (velocityMax === void 0) {
                return this._velocityMax;
            }
            else {
                this._velocityMax = velocityMax;
                return this;
            }
        };
        Multitouch.prototype.distanceMin = function (distanceMin) {
            if (distanceMin === void 0) {
                return this._distanceMin;
            }
            else {
                this._distanceMin = distanceMin;
                return this;
            }
        };
        Multitouch.prototype.wheel = function (wheel) {
            if (wheel === void 0) {
                return false;
            }
            else {
                return this;
            }
        };
        Multitouch.prototype.points = function () {
            var points = [];
            for (var identifier in this._tracks) {
                points.push(this._tracks[identifier]);
            }
            for (var identifier in this._ghosts) {
                points.push(this._ghosts[identifier]);
            }
            return points;
        };
        Multitouch.prototype.interrupt = function () {
            if (this._ghostFrame) {
                cancelAnimationFrame(this._ghostFrame);
                this._ghostFrame = 0;
            }
            if (this._ghostCount) {
                this._ghosts = {};
                this._ghostCount = 0;
                if (this._trackCount) {
                    this.multitouchChange();
                }
                else {
                    this.multitouchEnd();
                }
            }
        };
        Multitouch.prototype.zoom = function (cx, cy, dz) {
            if (!dz) {
                return;
            }
            var t = Date.now();
            var a = this._acceleration;
            var ax = a * COS_PI_4;
            var ay = a * SIN_PI_4;
            var vMax = this._velocityMax;
            var vx = 0.5 * vMax * COS_PI_4;
            var vy = 0.5 * vMax * SIN_PI_4;
            var dx = (4 * vx * vx) / ax;
            var dy = (4 * vy * vy) / ay;
            var zoom0 = this._ghosts.zoom0;
            var zoom1 = this._ghosts.zoom1;
            if (zoom0 && zoom1) {
                var dcx = Math.abs(zoom1.cx - zoom0.cx) / 2;
                var dcy = Math.abs(zoom1.cy - zoom0.cy) / 2;
                var dt = t - zoom0.t;
                dz = Math.min(Math.max(-vMax * dt, dz), vMax * dt);
                var zx = (dz * dcx * COS_PI_4) / dx;
                var zy = (dz * dcy * SIN_PI_4) / dy;
                ax = (ax * dcx) / dx;
                ay = (ay * dcy) / dy;
                if (dt > 0) {
                    zoom0.t = t;
                    zoom0.cx += zx;
                    zoom0.cy += zy;
                    zoom0.vx = zx / dt;
                    zoom0.vy = zy / dt;
                    zoom0.ax = zoom0.vx < 0 ? ax : zoom0.vx > 0 ? -ax : 0;
                    zoom0.ay = zoom0.vy < 0 ? ay : zoom0.vy > 0 ? -ay : 0;
                    zoom0.dx = zx;
                    zoom0.dy = zy;
                    zoom1.t = t;
                    zoom1.cx -= zx;
                    zoom1.cy -= zy;
                    zoom1.vx = -zx / dt;
                    zoom1.vy = -zy / dt;
                    zoom1.ax = zoom1.vx < 0 ? ax : zoom1.vx > 0 ? -ax : 0;
                    zoom1.ay = zoom1.vy < 0 ? ay : zoom1.vy > 0 ? -ay : 0;
                    zoom1.dx = -zx;
                    zoom1.dy = -zy;
                }
            }
            else {
                this.interrupt();
                this.multitouchStart();
                if (dz < 0) {
                    zoom0 = new MultitouchGhost(this, "zoom0", t, cx - dx, cy - dy, -vx, -vy, ax, ay);
                    zoom1 = new MultitouchGhost(this, "zoom1", t, cx + dx, cy + dy, vx, vy, -ax, -ay);
                }
                else {
                    zoom0 = new MultitouchGhost(this, "zoom0", t, cx - dx, cy - dy, vx, vy, -ax, -ay);
                    zoom1 = new MultitouchGhost(this, "zoom1", t, cx + dx, cy + dy, -vx, -vy, ax, ay);
                }
                this._ghosts.zoom0 = zoom0;
                this._ghostCount += 1;
                this._ghosts.zoom1 = zoom1;
                this._ghostCount += 1;
            }
            this.multitouchChange();
            if (this._ghostFrame) {
                cancelAnimationFrame(this._ghostFrame);
            }
            this._ghostFrame = requestAnimationFrame(this.onGhostFrame);
        };
        Multitouch.prototype.updateVelocity = function (t, points) {
            var p0 = points[0];
            var p1 = points[1];
            var i = 0;
            if (p0 && p1) {
                i = 2;
                var dx0 = Math.abs(p1.cx - p0.cx);
                var dy0 = Math.abs(p1.cy - p0.cy);
                if (p0 instanceof MultitouchGhost) {
                    p0.update(t);
                }
                if (p1 instanceof MultitouchGhost) {
                    p1.update(t);
                }
                var dx1 = Math.abs(p1.cx - p0.cx);
                var dy1 = Math.abs(p1.cy - p0.cy);
                var sx = dx1 / dx0;
                var sy = dy1 / dy0;
                p0.vx *= sx;
                p0.vy *= sy;
                p0.ax *= sx;
                p0.ay *= sy;
                p1.vx *= sx;
                p1.vy *= sy;
                p1.ax *= sx;
                p1.ay *= sy;
            }
            while (i < points.length) {
                var p = points[i];
                if (p instanceof MultitouchGhost) {
                    p.update(t);
                }
                i += 1;
            }
        };
        Multitouch.prototype.spreadVelocity = function (track) {
            for (var identifier in this._ghosts) {
                var ghost = this._ghosts[identifier];
                if (track.vx < 0 === ghost.vx < 0) {
                    track.vx = (track.vx + ghost.vx) / 2;
                    ghost.vx = (track.vx + ghost.vx) / 2;
                }
                else {
                    track.vx = (track.vx - ghost.vx) / 2;
                    ghost.vx = (ghost.vx - track.vx) / 2;
                }
                if (track.vy < 0 === ghost.vy < 0) {
                    track.vy = (track.vy + ghost.vy) / 2;
                    ghost.vy = (track.vy + ghost.vy) / 2;
                }
                else {
                    track.vy = (track.vy - ghost.vy) / 2;
                    ghost.vy = (ghost.vy - track.vy) / 2;
                }
            }
        };
        Multitouch.prototype.coast = function (track) {
            if (track.vx || track.vy) {
                this.spreadVelocity(track);
                var alpha = Math.atan2(Math.abs(track.vy), Math.abs(track.vx));
                var a = this._acceleration;
                var ax = (track.vx < 0 ? a : track.vx > 0 ? -a : 0) * Math.cos(alpha);
                var ay = (track.vy < 0 ? a : track.vy > 0 ? -a : 0) * Math.sin(alpha);
                if (ax || ay) {
                    var ghost = new MultitouchGhost(this, track.identifier, track.t, track.cx, track.cy, track.vx, track.vy, ax, ay);
                    this._ghosts[ghost.identifier] = ghost;
                    this._ghostCount += 1;
                    if (!this._ghostFrame) {
                        this._ghostFrame = requestAnimationFrame(this.onGhostFrame);
                    }
                }
            }
        };
        Multitouch.prototype.translate = function (dx, dy) {
            dx = dx || 0;
            dy = dy || 0;
            for (var identifier in this._ghosts) {
                this._ghosts[identifier].translate(dx, dy);
            }
        };
        Multitouch.prototype.interpolate = function (t) {
            for (var identifier in this._tracks) {
                this._tracks[identifier].update();
            }
            this.updateVelocity(t, this.points());
            this.multitouchChange();
            for (var identifier in this._ghosts) {
                var ghost = this._ghosts[identifier];
                if (!ghost.ax && !ghost.ay) {
                    delete this._ghosts[identifier];
                    this._ghostCount -= 1;
                }
            }
            if (!this._trackCount && !this._ghostCount) {
                this.multitouchEnd();
            }
            else if (this._ghostCount && !this._ghostFrame) {
                this._ghostFrame = requestAnimationFrame(this.onGhostFrame);
            }
        };
        Multitouch.prototype.onGhostFrame = function (t) {
            this._ghostFrame = 0;
            this.interpolate(Date.now());
        };
        Multitouch.prototype.multitouchStart = function () {
            var event = new MultitouchEvent("multitouchstart", {
                bubbles: true,
                cancelable: true,
                composed: true,
                points: this.points(),
            });
            this._surface.dispatchEvent(event);
        };
        Multitouch.prototype.multitouchChange = function () {
            var event = new MultitouchEvent("multitouchchange", {
                bubbles: true,
                cancelable: true,
                composed: true,
                points: this.points(),
            });
            this._surface.dispatchEvent(event);
        };
        Multitouch.prototype.multitouchEnd = function () {
            var event = new MultitouchEvent("multitouchend", {
                bubbles: true,
                cancelable: true,
                composed: true,
                points: this.points(),
            });
            this._surface.dispatchEvent(event);
        };
        Multitouch.prototype.trackStart = function (identifier, clientX, clientY, event) {
            this.interrupt();
            var track = new MultitouchTrack(this, identifier);
            this._tracks[identifier] = track;
            track.moveTo(Date.now(), clientX, clientY);
            this._trackCount += 1;
            if (this._trackCount === 1) {
                var target = this.target();
                if (target) {
                    this.startTracking(target);
                }
            }
            this.trackDidStart(track, this._surface, event);
        };
        Multitouch.prototype.trackMove = function (identifier, clientX, clientY, event) {
            var track = this._tracks[identifier];
            if (track) {
                track.moveTo(Date.now(), clientX, clientY);
                this.trackDidMove(track, this._surface, event);
            }
        };
        Multitouch.prototype.trackCancel = function (identifier, clientX, clientY, event) {
            var track = this._tracks[identifier];
            if (track) {
                delete this._tracks[identifier];
                this._trackCount -= 1;
                track.update();
                this.trackDidCancel(track, this._surface, event);
                if (this._trackCount === 0) {
                    var target = this.target();
                    if (target) {
                        this.endTracking(target);
                    }
                }
            }
        };
        Multitouch.prototype.trackEnd = function (identifier, clientX, clientY, event) {
            var track = this._tracks[identifier];
            if (track) {
                delete this._tracks[identifier];
                this._trackCount -= 1;
                track.update();
                this.trackDidEnd(track, this._surface, event);
                if (this._trackCount === 0) {
                    var target = this.target();
                    if (target) {
                        this.endTracking(target);
                    }
                }
            }
        };
        Multitouch.prototype.trackDidStart = function (track, surface, event) {
            if (this._trackCount === 1) {
                this.multitouchStart();
            }
        };
        Multitouch.prototype.trackDidMove = function (track, surface, event) {
            this.translate(track.dx, track.dy);
            this.interpolate(Date.now());
        };
        Multitouch.prototype.trackDidCancel = function (track, surface, event) {
            if (!this._trackCount && !this._ghostCount) {
                this.multitouchEnd();
            }
        };
        Multitouch.prototype.trackDidEnd = function (track, surface, event) {
            this.coast(track);
            if (!this._trackCount && !this._ghostCount) {
                this.multitouchEnd();
            }
        };
        Multitouch.create = function () {
            if (typeof PointerEvent !== "undefined") {
                return new MultitouchPointer();
            }
            else if (typeof TouchEvent !== "undefined") {
                return new MultitouchTouch();
            }
            else {
                return new MultitouchMouse();
            }
        };
        return Multitouch;
    }());
    var MultitouchPointer = (function (_super) {
        __extends(MultitouchPointer, _super);
        function MultitouchPointer() {
            var _this = _super.call(this) || this;
            _this.onPointerDown = _this.onPointerDown.bind(_this);
            _this.onPointerMove = _this.onPointerMove.bind(_this);
            _this.onPointerUp = _this.onPointerUp.bind(_this);
            _this.onWheel = _this.onWheel.bind(_this);
            _this._wheel = true;
            return _this;
        }
        MultitouchPointer.prototype.wheel = function (wheel) {
            if (wheel === void 0) {
                return this._wheel;
            }
            else {
                if (this._wheel !== wheel) {
                    this._wheel = wheel;
                    var target = this.target();
                    if (target) {
                        if (wheel) {
                            target.on("wheel", this.onWheel);
                        }
                        else {
                            target.off("wheel", this.onWheel);
                        }
                    }
                }
                return this;
            }
        };
        MultitouchPointer.prototype.attach = function (surface) {
            var target = this.target();
            if (target) {
                target.on("pointerdown", this.onPointerDown);
                if (this._wheel) {
                    target.on("wheel", this.onWheel);
                }
            }
        };
        MultitouchPointer.prototype.detach = function (surface) {
            var target = this.target();
            if (target) {
                target.off("pointerdown", this.onPointerDown);
                target.off("wheel", this.onWheel);
            }
        };
        MultitouchPointer.prototype.startTracking = function (surface) {
            var target = this.target();
            if (target) {
                target.on("pointermove", this.onPointerMove);
                target.on("pointerup", this.onPointerUp);
            }
        };
        MultitouchPointer.prototype.endTracking = function (surface) {
            var target = this.target();
            if (target) {
                target.off("pointermove", this.onPointerMove);
                target.off("pointerup", this.onPointerUp);
            }
        };
        MultitouchPointer.prototype.trackDidStart = function (track, surface, event) {
            _super.prototype.trackDidStart.call(this, track, surface, event);
            var target = this.target();
            if (target && target.node.setPointerCapture) {
                target.node.setPointerCapture(+track.identifier);
            }
        };
        MultitouchPointer.prototype.trackDidEnd = function (track, surface, event) {
            _super.prototype.trackDidEnd.call(this, track, surface, event);
            var target = this.target();
            if (target && target.node.releasePointerCapture) {
                target.node.releasePointerCapture(+track.identifier);
            }
        };
        MultitouchPointer.prototype.onPointerDown = function (event) {
            this.trackStart("" + event.pointerId, event.clientX, event.clientY, event);
        };
        MultitouchPointer.prototype.onPointerMove = function (event) {
            this.trackMove("" + event.pointerId, event.clientX, event.clientY, event);
        };
        MultitouchPointer.prototype.onPointerUp = function (event) {
            this.trackEnd("" + event.pointerId, event.clientX, event.clientY, event);
        };
        MultitouchPointer.prototype.onWheel = function (event) {
            event.preventDefault();
            this.zoom(event.clientX, event.clientY, event.deltaY);
        };
        return MultitouchPointer;
    }(Multitouch));
    var MultitouchTouch = (function (_super) {
        __extends(MultitouchTouch, _super);
        function MultitouchTouch() {
            var _this = _super.call(this) || this;
            _this.onTouchStart = _this.onTouchStart.bind(_this);
            _this.onTouchMove = _this.onTouchMove.bind(_this);
            _this.onTouchCancel = _this.onTouchCancel.bind(_this);
            _this.onTouchEnd = _this.onTouchEnd.bind(_this);
            return _this;
        }
        MultitouchTouch.prototype.attach = function (surface) {
            var target = this.target();
            if (target) {
                target.on("touchstart", this.onTouchStart);
            }
        };
        MultitouchTouch.prototype.detach = function (surface) {
            var target = this.target();
            if (target) {
                target.off("touchstart", this.onTouchStart);
            }
        };
        MultitouchTouch.prototype.startTracking = function (surface) {
            var target = this.target();
            if (target) {
                target.on("touchmove", this.onTouchMove);
                target.on("touchcancel", this.onTouchCancel);
                target.on("touchend", this.onTouchEnd);
            }
        };
        MultitouchTouch.prototype.endTracking = function (surface) {
            var target = this.target();
            if (target) {
                target.off("touchmove", this.onTouchMove);
                target.off("touchcancel", this.onTouchCancel);
                target.off("touchend", this.onTouchEnd);
            }
        };
        MultitouchTouch.prototype.onTouchStart = function (event) {
            for (var i = 0; i < event.changedTouches.length; i += 1) {
                var touch = event.changedTouches[i];
                this.trackStart("" + touch.identifier, touch.clientX, touch.clientY, event);
            }
            if (event.changedTouches.length > 1 || this._trackCount > 1) {
                event.preventDefault();
            }
        };
        MultitouchTouch.prototype.onTouchMove = function (event) {
            for (var i = 0; i < event.changedTouches.length; i += 1) {
                var touch = event.changedTouches[i];
                this.trackMove("" + touch.identifier, touch.clientX, touch.clientY, event);
            }
        };
        MultitouchTouch.prototype.onTouchCancel = function (event) {
            for (var i = 0; i < event.changedTouches.length; i += 1) {
                var touch = event.changedTouches[i];
                this.trackCancel("" + touch.identifier, touch.clientX, touch.clientY, event);
            }
        };
        MultitouchTouch.prototype.onTouchEnd = function (event) {
            for (var i = 0; i < event.changedTouches.length; i += 1) {
                var touch = event.changedTouches[i];
                this.trackEnd("" + touch.identifier, touch.clientX, touch.clientY, event);
            }
        };
        return MultitouchTouch;
    }(Multitouch));
    var MultitouchMouse = (function (_super) {
        __extends(MultitouchMouse, _super);
        function MultitouchMouse() {
            var _this = _super.call(this) || this;
            _this.onMouseDown = _this.onMouseDown.bind(_this);
            _this.onMouseMove = _this.onMouseMove.bind(_this);
            _this.onMouseUp = _this.onMouseUp.bind(_this);
            _this.onWheel = _this.onWheel.bind(_this);
            _this._wheel = true;
            return _this;
        }
        MultitouchMouse.prototype.wheel = function (wheel) {
            if (wheel === void 0) {
                return this._wheel;
            }
            else {
                if (this._wheel !== wheel) {
                    this._wheel = wheel;
                    var target = this.target();
                    if (target) {
                        if (wheel) {
                            target.on("wheel", this.onWheel);
                        }
                        else {
                            target.off("wheel", this.onWheel);
                        }
                    }
                }
                return this;
            }
        };
        MultitouchMouse.prototype.attach = function (surface) {
            var target = this.target();
            if (target) {
                target.on("mousedown", this.onMouseDown);
                if (this._wheel) {
                    target.on("wheel", this.onWheel);
                }
            }
        };
        MultitouchMouse.prototype.detach = function (surface) {
            var target = this.target();
            if (target) {
                target.off("mousedown", this.onMouseDown);
                target.off("wheel", this.onWheel);
            }
        };
        MultitouchMouse.prototype.startTracking = function (surface) {
            document.body.addEventListener("mousemove", this.onMouseMove);
            document.body.addEventListener("mouseup", this.onMouseUp);
        };
        MultitouchMouse.prototype.endTracking = function (surface) {
            document.body.removeEventListener("mousemove", this.onMouseMove);
            document.body.removeEventListener("mouseup", this.onMouseUp);
        };
        MultitouchMouse.prototype.onMouseDown = function (event) {
            this.trackStart("mouse", event.clientX, event.clientY, event);
        };
        MultitouchMouse.prototype.onMouseMove = function (event) {
            this.trackMove("mouse", event.clientX, event.clientY, event);
        };
        MultitouchMouse.prototype.onMouseUp = function (event) {
            this.trackEnd("mouse", event.clientX, event.clientY, event);
        };
        MultitouchMouse.prototype.onWheel = function (event) {
            event.preventDefault();
            this.zoom(event.clientX, event.clientY, event.deltaY);
        };
        return MultitouchMouse;
    }(Multitouch));

    var ScaleGestureEvent = (function (_super) {
        __extends(ScaleGestureEvent, _super);
        function ScaleGestureEvent(type, init) {
            var _this = _super.call(this, type, init) || this;
            _this.gesture = init.gesture;
            _this.multitouch = init.multitouch;
            _this.ruler = init.ruler;
            _this.scale = init.scale;
            return _this;
        }
        return ScaleGestureEvent;
    }(CustomEventConstructor));
    var ScaleGesture = (function () {
        function ScaleGesture() {
            this._multitouch = null;
            this._ruler = null;
            this._scale = null;
            this._xMin = null;
            this._xMax = null;
            this._zMin = null;
            this._zMax = null;
            this._points = [];
            this.onMultitouchStart = this.onMultitouchStart.bind(this);
            this.onMultitouchChange = this.onMultitouchChange.bind(this);
            this.onMultitouchEnd = this.onMultitouchEnd.bind(this);
        }
        ScaleGesture.prototype.multitouch = function (multitouch) {
            if (multitouch === void 0) {
                return this._multitouch;
            }
            else {
                if (this._multitouch) {
                    this.detach(this._multitouch);
                }
                this._multitouch = multitouch;
                return this;
            }
        };
        ScaleGesture.prototype.hysteresis = function (hysteresis) {
            if (hysteresis === void 0) {
                return this._multitouch.hysteresis();
            }
            else {
                this._multitouch.hysteresis(hysteresis);
                return this;
            }
        };
        ScaleGesture.prototype.acceleration = function (acceleration) {
            if (acceleration === void 0) {
                return this._multitouch.acceleration();
            }
            else {
                this._multitouch.acceleration(acceleration);
                return this;
            }
        };
        ScaleGesture.prototype.velocityMax = function (velocityMax) {
            if (velocityMax === void 0) {
                return this._multitouch.velocityMax();
            }
            else {
                this._multitouch.velocityMax(velocityMax);
                return this;
            }
        };
        ScaleGesture.prototype.distanceMin = function (distanceMin) {
            if (distanceMin === void 0) {
                return this._multitouch.distanceMin();
            }
            else {
                this._multitouch.distanceMin(distanceMin);
                return this;
            }
        };
        ScaleGesture.prototype.wheel = function (wheel) {
            if (wheel === void 0) {
                return this._multitouch.wheel();
            }
            else {
                this._multitouch.wheel(wheel);
                return this;
            }
        };
        ScaleGesture.prototype.ruler = function (ruler) {
            if (ruler === void 0) {
                return this._ruler;
            }
            else {
                this._ruler = ruler;
                return this;
            }
        };
        ScaleGesture.prototype.scale = function (scale) {
            if (scale === void 0) {
                return this._scale;
            }
            else {
                var oldScale = this._scale;
                this._scale = scale;
                if (oldScale === null) {
                    this.zoomBounds(true);
                }
                return this;
            }
        };
        ScaleGesture.prototype.domainMin = function (xMin) {
            if (xMin === void 0) {
                return this._xMin;
            }
            else {
                this._xMin = xMin;
                return this;
            }
        };
        ScaleGesture.prototype.domainMax = function (xMax) {
            if (xMax === void 0) {
                return this._xMax;
            }
            else {
                this._xMax = xMax;
                return this;
            }
        };
        ScaleGesture.prototype.domainBounds = function (xMin, xMax) {
            if (xMin === void 0) {
                return [this._xMin, this._xMax];
            }
            else if (xMax === void 0) {
                xMin = xMin;
                this._xMin = xMin[0];
                this._xMax = xMin[1];
                return this;
            }
            else {
                this._xMin = xMin;
                this._xMax = xMax;
                return this;
            }
        };
        ScaleGesture.prototype.zoomMin = function (zMin) {
            if (zMin === void 0) {
                return this._zMin;
            }
            else {
                this._zMin = zMin;
                return this;
            }
        };
        ScaleGesture.prototype.zoomMax = function (zMax) {
            if (zMax === void 0) {
                return this._zMax;
            }
            else {
                this._zMax = zMax;
                return this;
            }
        };
        ScaleGesture.prototype.zoomBounds = function (zMin, zMax) {
            if (zMin === void 0) {
                return [this._zMin, this._zMax];
            }
            else if (zMax === void 0) {
                if (typeof zMin === "boolean") {
                    if (this._scale instanceof LinearScale) {
                        this._zMin = 1000000;
                        this._zMax = 0.001;
                    }
                    else if (this._scale instanceof TimeScale) {
                        this._zMin = 86400000;
                        this._zMax = 1;
                    }
                }
                else {
                    zMin = zMin;
                    this._zMin = zMin[0];
                    this._zMax = zMin[1];
                }
                return this;
            }
            else {
                this._zMin = zMin;
                this._zMax = zMax;
                return this;
            }
        };
        ScaleGesture.prototype.attach = function (multitouch) {
            var surface = this._multitouch && this._multitouch.surface();
            if (surface) {
                surface.on("multitouchstart", this.onMultitouchStart);
                surface.on("multitouchchange", this.onMultitouchChange);
                surface.on("multitouchend", this.onMultitouchEnd);
            }
        };
        ScaleGesture.prototype.detach = function (multitouch) {
            var surface = this._multitouch && this._multitouch.surface();
            if (surface) {
                surface.off("multitouchstart", this.onMultitouchStart);
                surface.off("multitouchchange", this.onMultitouchChange);
                surface.off("multitouchend", this.onMultitouchEnd);
            }
        };
        ScaleGesture.prototype.createPoint = function (gesturePoint) {
            var coords = this.coords(gesturePoint.cx, gesturePoint.cy);
            return {
                identifier: gesturePoint.identifier,
                domainCoord: coords.domainCoord,
                rangeCoord: coords.rangeCoord,
            };
        };
        ScaleGesture.prototype.updatePoint = function (gesturePoint, scalePoint) {
            scalePoint.rangeCoord = this.rangeCoord(gesturePoint.cx, gesturePoint.cy);
        };
        ScaleGesture.prototype.updatePoints = function (gesturePoints) {
            var scalePoints = this._points;
            outer: for (var i = 0; i < gesturePoints.length; i += 1) {
                var gesturePoint = gesturePoints[i];
                for (var j_1 = 0; j_1 < scalePoints.length; j_1 += 1) {
                    var scalePoint_1 = scalePoints[j_1];
                    if (util.Objects.equal(gesturePoint.identifier, scalePoint_1.identifier)) {
                        this.updatePoint(gesturePoint, scalePoint_1);
                        continue outer;
                    }
                }
                var scalePoint = this.createPoint(gesturePoint);
                scalePoints.push(scalePoint);
            }
            var j = 0;
            outer: while (j < scalePoints.length) {
                var scalePoint = scalePoints[j];
                for (var i = 0; i < gesturePoints.length; i += 1) {
                    var gesturePoint = gesturePoints[i];
                    if (util.Objects.equal(scalePoint.identifier, gesturePoint.identifier)) {
                        j += 1;
                        continue outer;
                    }
                }
                scalePoints.splice(j, 1);
            }
        };
        ScaleGesture.prototype.clampScale = function () {
            var _xMin = this._xMin !== null ? this._xMin : void 0;
            var _xMax = this._xMax !== null ? this._xMax : void 0;
            var _zMin = this._zMin !== null ? this._zMin : void 0;
            var _zMax = this._zMax !== null ? this._zMax : void 0;
            var scale = this._scale;
            this._scale = scale.clampDomain(_xMin, _xMax, _zMin, _zMax);
            if (this._scale !== scale) {
                for (var i = 0; i < this._points.length; i += 1) {
                    var scalePoint = this._points[i];
                    scalePoint.domainCoord = this._scale.unscale(scalePoint.rangeCoord);
                }
                return true;
            }
            else {
                return false;
            }
        };
        ScaleGesture.prototype.rescale = function () {
            var p0 = this._points[0];
            var p1 = this._points[1];
            var oldScale = this._scale;
            if (p0 && p1) {
                var x0 = p0.domainCoord;
                var y0 = p0.rangeCoord;
                var x1 = p1.domainCoord;
                var y1 = p1.rangeCoord;
                this._scale = oldScale.solveDomain(x0, y0, x1, y1);
                this.clampScale();
            }
            else if (p0) {
                var x0 = p0.domainCoord;
                var y0 = p0.rangeCoord;
                this._scale = oldScale.solveDomain(x0, y0);
                this.clampScale();
            }
            return !oldScale.equals(this._scale);
        };
        ScaleGesture.prototype.onMultitouchStart = function (event) {
            this.scaleStart();
        };
        ScaleGesture.prototype.onMultitouchChange = function (event) {
            this.updatePoints(event.points);
            var changed = this.rescale();
            if (changed) {
                this.scaleChange();
            }
        };
        ScaleGesture.prototype.onMultitouchEnd = function (event) {
            this.scaleEnd();
        };
        ScaleGesture.prototype.scaleStart = function () {
            var event = new ScaleGestureEvent("scalestart", {
                bubbles: true,
                cancelable: true,
                composed: true,
                gesture: this,
                multitouch: this._multitouch,
                ruler: this._ruler,
                scale: this._scale,
            });
            this._ruler.dispatchEvent(event);
        };
        ScaleGesture.prototype.scaleChange = function () {
            var event = new ScaleGestureEvent("scalechange", {
                bubbles: true,
                cancelable: true,
                composed: true,
                gesture: this,
                multitouch: this._multitouch,
                ruler: this._ruler,
                scale: this._scale,
            });
            this._ruler.dispatchEvent(event);
        };
        ScaleGesture.prototype.scaleEnd = function () {
            var event = new ScaleGestureEvent("scaleend", {
                bubbles: true,
                cancelable: true,
                composed: true,
                gesture: this,
                multitouch: this._multitouch,
                ruler: this._ruler,
                scale: this._scale,
            });
            this._ruler.dispatchEvent(event);
            this._points.length = 0;
        };
        ScaleGesture.horizontal = function () {
            return new HorizontalScaleGesture();
        };
        ScaleGesture.vertical = function () {
            return new VerticalScaleGesture();
        };
        return ScaleGesture;
    }());
    var HorizontalScaleGesture = (function (_super) {
        __extends(HorizontalScaleGesture, _super);
        function HorizontalScaleGesture() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        HorizontalScaleGesture.prototype.coords = function (clientX, clientY) {
            var ruler = this._ruler;
            var dx = RenderView.is(ruler) ? ruler.bounds.x : 0;
            do {
                if (ruler instanceof ElementView) {
                    var bounds = ruler.node.getBoundingClientRect();
                    var rangeCoord = clientX - bounds.left - dx;
                    var domainCoord = this._scale.unscale(rangeCoord);
                    return { domainCoord: domainCoord, rangeCoord: rangeCoord };
                }
                else if (ruler) {
                    ruler = ruler.parentView;
                }
                else {
                    break;
                }
            } while (true);
            throw new Error("" + this._ruler);
        };
        HorizontalScaleGesture.prototype.rangeCoord = function (clientX, clientY) {
            var ruler = this._ruler;
            var dx = RenderView.is(ruler) ? ruler.bounds.x : 0;
            do {
                if (ruler instanceof ElementView) {
                    var bounds = ruler.node.getBoundingClientRect();
                    var rangeCoord = clientX - bounds.left - dx;
                    return rangeCoord;
                }
                else if (ruler) {
                    ruler = ruler.parentView;
                }
                else {
                    break;
                }
            } while (true);
            throw new Error("" + this._ruler);
        };
        HorizontalScaleGesture.prototype.isParallel = function (x0, y0, x1, y1) {
            return Math.abs(x1 - x0) >= Math.abs(y1 - y0);
        };
        return HorizontalScaleGesture;
    }(ScaleGesture));
    var VerticalScaleGesture = (function (_super) {
        __extends(VerticalScaleGesture, _super);
        function VerticalScaleGesture() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        VerticalScaleGesture.prototype.coords = function (clientX, clientY) {
            var ruler = this._ruler;
            var dy = RenderView.is(ruler) ? ruler.bounds.y : 0;
            do {
                if (ruler instanceof ElementView) {
                    var bounds = ruler.node.getBoundingClientRect();
                    var rangeCoord = clientY - bounds.top - dy;
                    var domainCoord = this._scale.unscale(rangeCoord);
                    return { domainCoord: domainCoord, rangeCoord: rangeCoord };
                }
                else if (ruler) {
                    ruler = ruler.parentView;
                }
                else {
                    break;
                }
            } while (true);
            throw new Error("" + this._ruler);
        };
        VerticalScaleGesture.prototype.rangeCoord = function (clientX, clientY) {
            var ruler = this._ruler;
            var dy = RenderView.is(ruler) ? ruler.bounds.y : 0;
            do {
                if (ruler instanceof ElementView) {
                    var bounds = ruler.node.getBoundingClientRect();
                    var rangeCoord = clientY - bounds.top - dy;
                    return rangeCoord;
                }
                else if (ruler) {
                    ruler = ruler.parentView;
                }
                else {
                    break;
                }
            } while (true);
            throw new Error("" + this._ruler);
        };
        VerticalScaleGesture.prototype.isParallel = function (x0, y0, x1, y1) {
            return Math.abs(y1 - y0) >= Math.abs(x1 - x0);
        };
        return VerticalScaleGesture;
    }(ScaleGesture));

    exports.AbsentInterpolator = AbsentInterpolator;
    exports.AffineTransform = AffineTransform;
    exports.AffineTransformInterpolator = AffineTransformInterpolator;
    exports.AffineTransformParser = AffineTransformParser;
    exports.Angle = Angle;
    exports.AngleForm = AngleForm;
    exports.AngleInterpolator = AngleInterpolator;
    exports.AngleMemberAnimator = AngleMemberAnimator;
    exports.AngleParser = AngleParser;
    exports.AnimatedView = AnimatedView;
    exports.Animator = Animator;
    exports.AnyMemberAnimator = AnyMemberAnimator;
    exports.AppView = AppView;
    exports.Arc = Arc;
    exports.ArcView = ArcView;
    exports.ArrayInterpolator = ArrayInterpolator;
    exports.AttrInterpolator = AttrInterpolator;
    exports.AttributeAnimator = AttributeAnimator;
    exports.AttributeString = AttributeString;
    exports.BinaryOperatorInterpolator = BinaryOperatorInterpolator;
    exports.BooleanAttributeAnimator = BooleanAttributeAnimator;
    exports.BooleanMemberAnimator = BooleanMemberAnimator;
    exports.BoxR2Interpolator = BoxR2Interpolator;
    exports.BoxShadow = BoxShadow;
    exports.BoxShadowForm = BoxShadowForm;
    exports.BoxShadowParser = BoxShadowParser;
    exports.BoxShadowStyleAnimator = BoxShadowStyleAnimator;
    exports.CanvasView = CanvasView;
    exports.CanvasViewController = CanvasViewController;
    exports.ChildAnimator = ChildAnimator;
    exports.CircleR2Interpolator = CircleR2Interpolator;
    exports.Color = Color;
    exports.ColorAttributeAnimator = ColorAttributeAnimator;
    exports.ColorChannel = ColorChannel;
    exports.ColorChannelParser = ColorChannelParser;
    exports.ColorForm = ColorForm;
    exports.ColorInterpolator = ColorInterpolator;
    exports.ColorMemberAnimator = ColorMemberAnimator;
    exports.ColorOrStringAttributeAnimator = ColorOrStringAttributeAnimator;
    exports.ColorOrStringStyleAnimator = ColorOrStringStyleAnimator;
    exports.ColorParser = ColorParser;
    exports.ColorStyleAnimator = ColorStyleAnimator;
    exports.ConditionalOperatorInterpolator = ConditionalOperatorInterpolator;
    exports.Constrain = Constrain;
    exports.ConstrainBinding = ConstrainBinding;
    exports.ConstrainConstant = ConstrainConstant;
    exports.ConstrainProduct = ConstrainProduct;
    exports.ConstrainSum = ConstrainSum;
    exports.ConstrainTerm = ConstrainTerm;
    exports.ConstrainVariable = ConstrainVariable;
    exports.Constraint = Constraint;
    exports.ConstraintDummy = ConstraintDummy;
    exports.ConstraintError = ConstraintError;
    exports.ConstraintInvalid = ConstraintInvalid;
    exports.ConstraintMap = ConstraintMap;
    exports.ConstraintSlack = ConstraintSlack;
    exports.ConstraintSolver = ConstraintSolver;
    exports.ConstraintStrength = ConstraintStrength;
    exports.ConstraintSymbol = ConstraintSymbol;
    exports.ContinuousScale = ContinuousScale;
    exports.CustomEvent = CustomEventConstructor;
    exports.DateTimeInterpolator = DateTimeInterpolator;
    exports.DegAngle = DegAngle;
    exports.Ease = Ease;
    exports.EaseForm = EaseForm;
    exports.ElementView = ElementView;
    exports.ElementViewController = ElementViewController;
    exports.EmLength = EmLength;
    exports.FillView = FillView;
    exports.Font = Font;
    exports.FontFamily = FontFamily;
    exports.FontFamilyParser = FontFamilyParser;
    exports.FontFamilyStyleAnimator = FontFamilyStyleAnimator;
    exports.FontForm = FontForm;
    exports.FontMemberAnimator = FontMemberAnimator;
    exports.FontParser = FontParser;
    exports.FontSize = FontSize;
    exports.FrameAnimator = FrameAnimator;
    exports.GradAngle = GradAngle;
    exports.GraphicView = GraphicView;
    exports.GraphicViewController = GraphicViewController;
    exports.HexColorParser = HexColorParser;
    exports.HorizontalScaleGesture = HorizontalScaleGesture;
    exports.HslColor = HslColor;
    exports.HslColorInterpolator = HslColorInterpolator;
    exports.HslColorParser = HslColorParser;
    exports.HtmlAppView = HtmlAppView;
    exports.HtmlAppViewController = HtmlAppViewController;
    exports.HtmlView = HtmlView;
    exports.HtmlViewController = HtmlViewController;
    exports.IdentityColorInterpolator = IdentityColorInterpolator;
    exports.IdentityShapeInterpolator = IdentityShapeInterpolator;
    exports.IdentityTransform = IdentityTransform;
    exports.IdentityTransformInterpolator = IdentityTransformInterpolator;
    exports.Interpolator = Interpolator;
    exports.InterpolatorForm = InterpolatorForm;
    exports.InterpolatorInterpolator = InterpolatorInterpolator;
    exports.InterpolatorMap = InterpolatorMap;
    exports.InvokeOperatorInterpolator = InvokeOperatorInterpolator;
    exports.LayerView = LayerView;
    exports.LayerViewController = LayerViewController;
    exports.LayoutAnchor = LayoutAnchor;
    exports.LayoutManager = LayoutManager;
    exports.LayoutSolver = LayoutSolver;
    exports.LayoutView = LayoutView;
    exports.Length = Length;
    exports.LengthAttributeAnimator = LengthAttributeAnimator;
    exports.LengthForm = LengthForm;
    exports.LengthInterpolator = LengthInterpolator;
    exports.LengthMemberAnimator = LengthMemberAnimator;
    exports.LengthOrStringAttributeAnimator = LengthOrStringAttributeAnimator;
    exports.LengthOrStringStyleAnimator = LengthOrStringStyleAnimator;
    exports.LengthParser = LengthParser;
    exports.LengthStyleAnimator = LengthStyleAnimator;
    exports.LineHeight = LineHeight;
    exports.LineHeightStyleAnimator = LineHeightStyleAnimator;
    exports.LinearScale = LinearScale;
    exports.LinearScaleInterpolator = LinearScaleInterpolator;
    exports.MemberAnimator = MemberAnimator;
    exports.Multitouch = Multitouch;
    exports.MultitouchEvent = MultitouchEvent;
    exports.MultitouchGhost = MultitouchGhost;
    exports.MultitouchMouse = MultitouchMouse;
    exports.MultitouchPointer = MultitouchPointer;
    exports.MultitouchTouch = MultitouchTouch;
    exports.MultitouchTrack = MultitouchTrack;
    exports.NodeView = NodeView;
    exports.NodeViewController = NodeViewController;
    exports.NumInterpolator = NumInterpolator;
    exports.NumberAttributeAnimator = NumberAttributeAnimator;
    exports.NumberInterpolator = NumberInterpolator;
    exports.NumberMemberAnimator = NumberMemberAnimator;
    exports.NumberOrStringAttributeAnimator = NumberOrStringAttributeAnimator;
    exports.NumberOrStringStyleAnimator = NumberOrStringStyleAnimator;
    exports.NumberStyleAnimator = NumberStyleAnimator;
    exports.ObjectMemberAnimator = ObjectMemberAnimator;
    exports.PathContext = PathContext;
    exports.PctLength = PctLength;
    exports.PointR2Interpolator = PointR2Interpolator;
    exports.Popover = Popover;
    exports.PopoverView = PopoverView;
    exports.PopoverViewController = PopoverViewController;
    exports.PropertyAnimator = PropertyAnimator;
    exports.PxLength = PxLength;
    exports.RadAngle = RadAngle;
    exports.RecordInterpolator = RecordInterpolator;
    exports.Rect = Rect;
    exports.RectView = RectView;
    exports.RemLength = RemLength;
    exports.RenderView = RenderView;
    exports.ResizeObserver = ResizeObserver;
    exports.RgbColor = RgbColor;
    exports.RgbColorInterpolator = RgbColorInterpolator;
    exports.RgbColorParser = RgbColorParser;
    exports.RotateTransform = RotateTransform;
    exports.RotateTransformInterpolator = RotateTransformInterpolator;
    exports.RotateTransformParser = RotateTransformParser;
    exports.Scale = Scale;
    exports.ScaleForm = ScaleForm;
    exports.ScaleGesture = ScaleGesture;
    exports.ScaleGestureEvent = ScaleGestureEvent;
    exports.ScaleInterpolator = ScaleInterpolator;
    exports.ScaleTransform = ScaleTransform;
    exports.ScaleTransformInterpolator = ScaleTransformInterpolator;
    exports.ScaleTransformParser = ScaleTransformParser;
    exports.SegmentR2Interpolator = SegmentR2Interpolator;
    exports.ShapeInterpolator = ShapeInterpolator;
    exports.SkewTransform = SkewTransform;
    exports.SkewTransformInterpolator = SkewTransformInterpolator;
    exports.SkewTransformParser = SkewTransformParser;
    exports.SlotInterpolator = SlotInterpolator;
    exports.StepInterpolator = StepInterpolator;
    exports.StringAttributeAnimator = StringAttributeAnimator;
    exports.StringMemberAnimator = StringMemberAnimator;
    exports.StringStyleAnimator = StringStyleAnimator;
    exports.StrokeView = StrokeView;
    exports.StructureInterpolator = StructureInterpolator;
    exports.StyleAnimator = StyleAnimator;
    exports.StyleString = StyleString;
    exports.StyleValue = StyleValue;
    exports.StyleValueForm = StyleValueForm;
    exports.StyleValueParser = StyleValueParser;
    exports.SvgView = SvgView;
    exports.SvgViewController = SvgViewController;
    exports.TextRun = TextRun;
    exports.TextRunView = TextRunView;
    exports.TextView = TextView;
    exports.TextViewController = TextViewController;
    exports.TimeScale = TimeScale;
    exports.TimeScaleInterpolator = TimeScaleInterpolator;
    exports.Transform = Transform;
    exports.TransformAttributeAnimator = TransformAttributeAnimator;
    exports.TransformForm = TransformForm;
    exports.TransformInterpolator = TransformInterpolator;
    exports.TransformList = TransformList;
    exports.TransformListInterpolator = TransformListInterpolator;
    exports.TransformListParser = TransformListParser;
    exports.TransformMemberAnimator = TransformMemberAnimator;
    exports.TransformParser = TransformParser;
    exports.TransformStyleAnimator = TransformStyleAnimator;
    exports.Transition = Transition;
    exports.TransitionForm = TransitionForm;
    exports.TranslateTransform = TranslateTransform;
    exports.TranslateTransformInterpolator = TranslateTransformInterpolator;
    exports.TranslateTransformParser = TranslateTransformParser;
    exports.TurnAngle = TurnAngle;
    exports.TweenAnimator = TweenAnimator;
    exports.TweenChildAnimator = TweenChildAnimator;
    exports.TweenFrameAnimator = TweenFrameAnimator;
    exports.TypesetView = TypesetView;
    exports.UnaryOperatorInterpolator = UnaryOperatorInterpolator;
    exports.UnitlessLength = UnitlessLength;
    exports.ValueInterpolator = ValueInterpolator;
    exports.VerticalScaleGesture = VerticalScaleGesture;
    exports.View = View;
    exports.ViewController = ViewController;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=swim-ui.js.map