(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@swim/angle'), require('@swim/length'), require('@swim/color'), require('@swim/font'), require('@swim/view'), require('@swim/typeset'), require('@swim/math'), require('@swim/shape'), require('@swim/collections'), require('@swim/time'), require('@swim/scale'), require('@swim/interpolate'), require('@swim/transition'), require('@swim/style'), require('@swim/util'), require('@swim/gesture'), require('@swim/codec'), require('@swim/transform'), require('mapbox-gl')) :
    typeof define === 'function' && define.amd ? define(['exports', '@swim/angle', '@swim/length', '@swim/color', '@swim/font', '@swim/view', '@swim/typeset', '@swim/math', '@swim/shape', '@swim/collections', '@swim/time', '@swim/scale', '@swim/interpolate', '@swim/transition', '@swim/style', '@swim/util', '@swim/gesture', '@swim/codec', '@swim/transform', 'mapbox-gl'], factory) :
    (global = global || self, factory(global.swim = global.swim || {}, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.mapboxgl));
}(this, function (exports, angle, length, color, font, view, typeset, math, shape, collections, time, scale, interpolate, transition, style, util, gesture, codec, transform, mapboxgl) { 'use strict';

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

    var DialView = (function (_super) {
        __extends(DialView, _super);
        function DialView() {
            var _this = _super.call(this) || this;
            _this.value.setState(0);
            _this.total.setState(1);
            _this._arrangement = "auto";
            return _this;
        }
        Object.defineProperty(DialView.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: true,
            configurable: true
        });
        DialView.prototype.label = function (label) {
            if (label === void 0) {
                return this.getChildView("label");
            }
            else {
                if (label !== null && !(label instanceof view.View)) {
                    label = typeset.TextRunView.fromAny(label);
                }
                this.setChildView("label", label);
                return this;
            }
        };
        DialView.prototype.legend = function (legend) {
            if (legend === void 0) {
                return this.getChildView("legend");
            }
            else {
                if (legend !== null && !(legend instanceof view.View)) {
                    legend = typeset.TextRunView.fromAny(legend);
                }
                this.setChildView("legend", legend);
                return this;
            }
        };
        DialView.prototype.arrangement = function (arrangement) {
            if (arrangement === void 0) {
                return this._arrangement;
            }
            else {
                this._arrangement = arrangement;
                return this;
            }
        };
        DialView.prototype.onAnimate = function (t) {
            this.value.onFrame(t);
            this.total.onFrame(t);
            this.innerRadius.onFrame(t);
            this.outerRadius.onFrame(t);
            this.startAngle.onFrame(t);
            this.sweepAngle.onFrame(t);
            this.cornerRadius.onFrame(t);
            this.dialColor.onFrame(t);
            this.meterColor.onFrame(t);
            this.labelPadding.onFrame(t);
            this.tickAlign.onFrame(t);
            this.tickRadius.onFrame(t);
            this.tickLength.onFrame(t);
            this.tickWidth.onFrame(t);
            this.tickPadding.onFrame(t);
            this.tickColor.onFrame(t);
            this.font.onFrame(t);
            this.textColor.onFrame(t);
        };
        DialView.prototype.onRender = function (context) {
            context.save();
            var bounds = this._bounds;
            var anchor = this._anchor;
            this.renderDial(context, bounds, anchor);
            context.restore();
            this.renderTick(context, bounds, anchor);
        };
        DialView.prototype.renderDial = function (context, bounds, anchor) {
            var size = Math.min(bounds.width, bounds.height);
            var r0 = this.innerRadius.value.pxValue(size);
            var r1 = this.outerRadius.value.pxValue(size);
            var a0 = this.startAngle.value.radValue();
            var da = this.sweepAngle.value.radValue();
            var rc = this.cornerRadius.value.pxValue(r1 - r0);
            var dial = new shape.Arc(length.Length.px(r0), length.Length.px(r1), angle.Angle.rad(a0), angle.Angle.rad(da), angle.Angle.zero(), null, length.Length.px(rc));
            var meter = dial.sweepAngle(da * this.value.value / (this.total.value || 1));
            context.beginPath();
            var dialColor = this.dialColor.value;
            context.fillStyle = dialColor.toString();
            dial.render(context, bounds, anchor);
            context.fill();
            context.clip();
            context.beginPath();
            var meterColor = this.meterColor.value;
            context.fillStyle = meterColor.toString();
            meter.render(context, bounds, anchor);
            context.fill();
            var label = this.label();
            if (view.RenderView.is(label)) {
                var r = (r0 + r1) / 2;
                var rx = r * Math.cos(a0 + 1e-12);
                var ry = r * Math.sin(a0 + 1e-12);
                var textAlign = void 0;
                if (rx >= 0) {
                    if (ry >= 0) {
                        textAlign = "start";
                    }
                    else {
                        textAlign = "end";
                    }
                }
                else {
                    if (ry < 0) {
                        textAlign = "end";
                    }
                    else {
                        textAlign = "start";
                    }
                }
                var padAngle = a0 - Math.PI / 2;
                var labelPadding = this.labelPadding.value.pxValue(r1 - r0);
                var dx = labelPadding * Math.cos(padAngle);
                var dy = labelPadding * Math.sin(padAngle);
                var labelAnchor = new math.PointR2(anchor.x + rx + dx, anchor.y + ry + dy);
                label.setAnchor(labelAnchor);
                if (view.TypesetView.is(label)) {
                    label.textAlign(textAlign);
                    label.textBaseline("middle");
                }
            }
        };
        DialView.prototype.renderTick = function (context, bounds, anchor) {
            var legend = this.legend();
            if (view.RenderView.is(legend) && !legend.hidden) {
                var width = bounds.width;
                var height = bounds.height;
                var size = Math.min(width, height);
                var cx = anchor.x;
                var cy = anchor.y;
                var a0 = this.startAngle.value.radValue();
                var da = this.sweepAngle.value.radValue() * this.value.value / (this.total.value || 1);
                var a = a0 + da * this.tickAlign.value;
                var r1 = this.outerRadius.value.pxValue(size);
                var r2 = this.tickRadius.value.pxValue(size);
                var r3 = this.tickLength.value.pxValue(width);
                var r1x = r1 * Math.cos(a + 1e-12);
                var r1y = r1 * Math.sin(a + 1e-12);
                var r2x = r2 * Math.cos(a + 1e-12);
                var r2y = r2 * Math.sin(a + 1e-12);
                var l = 0;
                context.beginPath();
                var tickColor = this.tickColor.value;
                context.strokeStyle = tickColor.toString();
                context.lineWidth = this.tickWidth.value.pxValue(size);
                context.moveTo(cx + r1x, cy + r1y);
                context.lineTo(cx + r2x, cy + r2y);
                if (r3) {
                    if (r2x >= 0) {
                        context.lineTo(cx + r3, cy + r2y);
                        l = r3 - r2x;
                    }
                    else if (r2x < 0) {
                        context.lineTo(cx - r3, cy + r2y);
                        l = r3 + r2x;
                    }
                }
                context.stroke();
                var dx = void 0;
                var textAlign = void 0;
                if (r2x >= 0) {
                    dx = l;
                    if (r2y >= 0) {
                        textAlign = "end";
                    }
                    else {
                        textAlign = "end";
                    }
                }
                else {
                    dx = -l;
                    if (r2y < 0) {
                        textAlign = "start";
                    }
                    else {
                        textAlign = "start";
                    }
                }
                var legendAnchor = new math.PointR2(cx + r2x + dx, cy + r2y - this.tickPadding.value.pxValue(size));
                legend.setAnchor(legendAnchor);
                if (view.TypesetView.is(legend)) {
                    if (view.FillView.is(legend)) {
                        legend.fill(tickColor);
                    }
                    legend.textAlign(textAlign);
                    legend.textBaseline("alphabetic");
                }
            }
        };
        DialView.prototype.hitTest = function (x, y, context) {
            var hit = _super.prototype.hitTest.call(this, x, y, context);
            if (hit === null) {
                context.save();
                var pixelRatio = this.pixelRatio;
                x *= pixelRatio;
                y *= pixelRatio;
                var bounds = this._bounds;
                var anchor = this._anchor;
                hit = this.hitTestDial(x, y, context, bounds, anchor);
                context.restore();
            }
            return hit;
        };
        DialView.prototype.hitTestDial = function (x, y, context, bounds, anchor) {
            var size = Math.min(bounds.width, bounds.height);
            var r0 = this.innerRadius.value.pxValue(size);
            var r1 = this.outerRadius.value.pxValue(size);
            var a0 = this.startAngle.value.radValue();
            var da = this.sweepAngle.value.radValue();
            var rc = this.cornerRadius.value.pxValue(r1 - r0);
            var dial = new shape.Arc(length.Length.px(r0), length.Length.px(r1), angle.Angle.rad(a0), angle.Angle.rad(da), angle.Angle.zero(), null, length.Length.px(rc));
            context.beginPath();
            dial.render(context, bounds, anchor);
            if (context.isPointInPath(x, y)) {
                return this;
            }
            return null;
        };
        DialView.fromAny = function (dial) {
            if (dial instanceof DialView) {
                return dial;
            }
            else if (typeof dial === "object" && dial) {
                var view = new DialView();
                if (dial.key !== void 0) {
                    view.key(dial.key);
                }
                if (dial.value !== void 0) {
                    view.value(dial.value);
                }
                if (dial.total !== void 0) {
                    view.total(dial.total);
                }
                if (dial.innerRadius !== void 0) {
                    view.innerRadius(dial.innerRadius);
                }
                if (dial.outerRadius !== void 0) {
                    view.outerRadius(dial.outerRadius);
                }
                if (dial.startAngle !== void 0) {
                    view.startAngle(dial.startAngle);
                }
                if (dial.sweepAngle !== void 0) {
                    view.sweepAngle(dial.sweepAngle);
                }
                if (dial.cornerRadius !== void 0) {
                    view.cornerRadius(dial.cornerRadius);
                }
                if (dial.dialColor !== void 0) {
                    view.dialColor(dial.dialColor);
                }
                if (dial.meterColor !== void 0) {
                    view.meterColor(dial.meterColor);
                }
                if (dial.labelPadding !== void 0) {
                    view.labelPadding(dial.labelPadding);
                }
                if (dial.tickAlign !== void 0) {
                    view.tickAlign(dial.tickAlign);
                }
                if (dial.tickRadius !== void 0) {
                    view.tickRadius(dial.tickRadius);
                }
                if (dial.tickLength !== void 0) {
                    view.tickLength(dial.tickLength);
                }
                if (dial.tickWidth !== void 0) {
                    view.tickWidth(dial.tickWidth);
                }
                if (dial.tickPadding !== void 0) {
                    view.tickPadding(dial.tickPadding);
                }
                if (dial.tickColor !== void 0) {
                    view.tickColor(dial.tickColor);
                }
                if (dial.font !== void 0) {
                    view.font(dial.font);
                }
                if (dial.textColor !== void 0) {
                    view.textColor(dial.textColor);
                }
                if (dial.arrangement !== void 0) {
                    view.arrangement(dial.arrangement);
                }
                if (dial.label !== void 0) {
                    view.label(dial.label);
                }
                if (dial.legend !== void 0) {
                    view.legend(dial.legend);
                }
                return view;
            }
            throw new TypeError("" + dial);
        };
        __decorate([
            view.MemberAnimator(Number)
        ], DialView.prototype, "value", void 0);
        __decorate([
            view.MemberAnimator(Number)
        ], DialView.prototype, "total", void 0);
        __decorate([
            view.MemberAnimator(length.Length, "inherit")
        ], DialView.prototype, "innerRadius", void 0);
        __decorate([
            view.MemberAnimator(length.Length, "inherit")
        ], DialView.prototype, "outerRadius", void 0);
        __decorate([
            view.MemberAnimator(angle.Angle, "inherit")
        ], DialView.prototype, "startAngle", void 0);
        __decorate([
            view.MemberAnimator(angle.Angle, "inherit")
        ], DialView.prototype, "sweepAngle", void 0);
        __decorate([
            view.MemberAnimator(length.Length, "inherit")
        ], DialView.prototype, "cornerRadius", void 0);
        __decorate([
            view.MemberAnimator(color.Color, "inherit")
        ], DialView.prototype, "dialColor", void 0);
        __decorate([
            view.MemberAnimator(color.Color, "inherit")
        ], DialView.prototype, "meterColor", void 0);
        __decorate([
            view.MemberAnimator(length.Length, "inherit")
        ], DialView.prototype, "labelPadding", void 0);
        __decorate([
            view.MemberAnimator(Number, "inherit")
        ], DialView.prototype, "tickAlign", void 0);
        __decorate([
            view.MemberAnimator(length.Length, "inherit")
        ], DialView.prototype, "tickRadius", void 0);
        __decorate([
            view.MemberAnimator(length.Length, "inherit")
        ], DialView.prototype, "tickLength", void 0);
        __decorate([
            view.MemberAnimator(length.Length, "inherit")
        ], DialView.prototype, "tickWidth", void 0);
        __decorate([
            view.MemberAnimator(length.Length, "inherit")
        ], DialView.prototype, "tickPadding", void 0);
        __decorate([
            view.MemberAnimator(color.Color, "inherit")
        ], DialView.prototype, "tickColor", void 0);
        __decorate([
            view.MemberAnimator(font.Font, "inherit")
        ], DialView.prototype, "font", void 0);
        __decorate([
            view.MemberAnimator(color.Color, "inherit")
        ], DialView.prototype, "textColor", void 0);
        return DialView;
    }(view.GraphicView));

    var GaugeView = (function (_super) {
        __extends(GaugeView, _super);
        function GaugeView() {
            var _this = _super.call(this) || this;
            _this.limit.setState(0);
            _this.innerRadius.setState(length.Length.pct(30));
            _this.outerRadius.setState(length.Length.pct(40));
            _this.startAngle.setState(angle.Angle.rad(-Math.PI / 2));
            _this.sweepAngle.setState(angle.Angle.rad(2 * Math.PI));
            _this.cornerRadius.setState(length.Length.pct(50));
            _this.dialSpacing.setState(length.Length.px(1));
            _this.dialColor.setState(color.Color.transparent());
            _this.meterColor.setState(color.Color.black());
            _this.labelPadding.setState(length.Length.pct(25));
            _this.tickAlign.setState(0.5);
            _this.tickRadius.setState(length.Length.pct(45));
            _this.tickLength.setState(length.Length.pct(50));
            _this.tickWidth.setState(length.Length.px(1));
            _this.tickPadding.setState(length.Length.px(1));
            _this.tickColor.setState(color.Color.black());
            return _this;
        }
        Object.defineProperty(GaugeView.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: true,
            configurable: true
        });
        GaugeView.prototype.title = function (title) {
            if (title === void 0) {
                return this.getChildView("title");
            }
            else {
                if (title !== null && !(title instanceof view.View)) {
                    title = typeset.TextRunView.fromAny(title);
                }
                this.setChildView("title", title);
                return this;
            }
        };
        GaugeView.prototype.addDial = function (dial) {
            dial = DialView.fromAny(dial);
            this.appendChildView(dial);
        };
        GaugeView.prototype.onAnimate = function (t) {
            this.limit.onFrame(t);
            this.innerRadius.onFrame(t);
            this.outerRadius.onFrame(t);
            this.startAngle.onFrame(t);
            this.sweepAngle.onFrame(t);
            this.cornerRadius.onFrame(t);
            this.dialSpacing.onFrame(t);
            this.dialColor.onFrame(t);
            this.meterColor.onFrame(t);
            this.labelPadding.onFrame(t);
            this.tickAlign.onFrame(t);
            this.tickRadius.onFrame(t);
            this.tickLength.onFrame(t);
            this.tickWidth.onFrame(t);
            this.tickPadding.onFrame(t);
            this.tickColor.onFrame(t);
            this.font.onFrame(t);
            this.textColor.onFrame(t);
        };
        GaugeView.prototype.didAnimate = function (t) {
            this.layoutGauge();
            _super.prototype.didAnimate.call(this, t);
        };
        GaugeView.prototype.layoutGauge = function () {
            var bounds = this._bounds;
            var size = Math.min(bounds.width, bounds.height);
            var childViews = this._childViews;
            var childCount = childViews.length;
            var limit = this.limit.value;
            var innerRadius = this.innerRadius.value;
            var outerRadius = this.outerRadius.value;
            var startAngle = this.startAngle.value;
            var sweepAngle = this.sweepAngle.value;
            var dialSpacing = this.dialSpacing.value;
            var r0;
            var r1;
            var rs;
            var dr;
            if (innerRadius && outerRadius) {
                var dialCount = 0;
                for (var i = 0; i < childCount; i += 1) {
                    var childView = childViews[i];
                    if (childView instanceof DialView && childView._arrangement === "auto") {
                        dialCount += 1;
                    }
                }
                r0 = innerRadius.pxValue(size);
                r1 = outerRadius.pxValue(size);
                rs = dialSpacing ? dialSpacing.pxValue(size) : 0;
                dr = dialCount > 1 ? (r1 - r0 - rs * (dialCount - 1)) / dialCount : r1 - r0;
            }
            for (var i = 0; i < childCount; i += 1) {
                var childView = childViews[i];
                if (childView instanceof DialView && childView._arrangement === "auto") {
                    if (limit && isFinite(limit)) {
                        var total = childView.total();
                        if (total) {
                            childView.total(Math.max(total, limit));
                        }
                    }
                    if (innerRadius && outerRadius) {
                        childView.innerRadius(length.Length.px(r0))
                            .outerRadius(length.Length.px(r0 + dr));
                        r0 = r0 + dr + rs;
                    }
                    if (startAngle) {
                        childView.startAngle(startAngle);
                    }
                    if (sweepAngle) {
                        childView.sweepAngle(sweepAngle);
                    }
                }
            }
            var title = this.title();
            if (view.TypesetView.is(title)) {
                title.textAlign("center");
                title.textBaseline("middle");
            }
        };
        GaugeView.fromAny = function (gauge) {
            if (gauge instanceof GaugeView) {
                return gauge;
            }
            else if (typeof gauge === "object" && gauge) {
                var view = new GaugeView();
                if (gauge.key !== void 0) {
                    view.key(gauge.key);
                }
                if (gauge.limit !== void 0) {
                    view.limit(gauge.limit);
                }
                if (gauge.innerRadius !== void 0) {
                    view.innerRadius(gauge.innerRadius);
                }
                if (gauge.outerRadius !== void 0) {
                    view.outerRadius(gauge.outerRadius);
                }
                if (gauge.startAngle !== void 0) {
                    view.startAngle(gauge.startAngle);
                }
                if (gauge.sweepAngle !== void 0) {
                    view.sweepAngle(gauge.sweepAngle);
                }
                if (gauge.cornerRadius !== void 0) {
                    view.cornerRadius(gauge.cornerRadius);
                }
                if (gauge.dialSpacing !== void 0) {
                    view.dialSpacing(gauge.dialSpacing);
                }
                if (gauge.dialColor !== void 0) {
                    view.dialColor(gauge.dialColor);
                }
                if (gauge.meterColor !== void 0) {
                    view.meterColor(gauge.meterColor);
                }
                if (gauge.labelPadding !== void 0) {
                    view.labelPadding(gauge.labelPadding);
                }
                if (gauge.tickAlign !== void 0) {
                    view.tickAlign(gauge.tickAlign);
                }
                if (gauge.tickRadius !== void 0) {
                    view.tickRadius(gauge.tickRadius);
                }
                if (gauge.tickLength !== void 0) {
                    view.tickLength(gauge.tickLength);
                }
                if (gauge.tickWidth !== void 0) {
                    view.tickWidth(gauge.tickWidth);
                }
                if (gauge.tickPadding !== void 0) {
                    view.tickPadding(gauge.tickPadding);
                }
                if (gauge.tickColor !== void 0) {
                    view.tickColor(gauge.tickColor);
                }
                if (gauge.font !== void 0) {
                    view.font(gauge.font);
                }
                if (gauge.textColor !== void 0) {
                    view.textColor(gauge.textColor);
                }
                if (gauge.title !== void 0) {
                    view.title(gauge.title);
                }
                var dials = gauge.dials;
                if (dials) {
                    for (var i = 0, n = dials.length; i < n; i += 1) {
                        view.addDial(dials[i]);
                    }
                }
                return view;
            }
            throw new TypeError("" + gauge);
        };
        __decorate([
            view.MemberAnimator(Number)
        ], GaugeView.prototype, "limit", void 0);
        __decorate([
            view.MemberAnimator(length.Length)
        ], GaugeView.prototype, "innerRadius", void 0);
        __decorate([
            view.MemberAnimator(length.Length)
        ], GaugeView.prototype, "outerRadius", void 0);
        __decorate([
            view.MemberAnimator(angle.Angle)
        ], GaugeView.prototype, "startAngle", void 0);
        __decorate([
            view.MemberAnimator(angle.Angle)
        ], GaugeView.prototype, "sweepAngle", void 0);
        __decorate([
            view.MemberAnimator(length.Length)
        ], GaugeView.prototype, "cornerRadius", void 0);
        __decorate([
            view.MemberAnimator(length.Length)
        ], GaugeView.prototype, "dialSpacing", void 0);
        __decorate([
            view.MemberAnimator(color.Color)
        ], GaugeView.prototype, "dialColor", void 0);
        __decorate([
            view.MemberAnimator(color.Color)
        ], GaugeView.prototype, "meterColor", void 0);
        __decorate([
            view.MemberAnimator(length.Length)
        ], GaugeView.prototype, "labelPadding", void 0);
        __decorate([
            view.MemberAnimator(Number)
        ], GaugeView.prototype, "tickAlign", void 0);
        __decorate([
            view.MemberAnimator(length.Length)
        ], GaugeView.prototype, "tickRadius", void 0);
        __decorate([
            view.MemberAnimator(length.Length)
        ], GaugeView.prototype, "tickLength", void 0);
        __decorate([
            view.MemberAnimator(length.Length)
        ], GaugeView.prototype, "tickWidth", void 0);
        __decorate([
            view.MemberAnimator(length.Length)
        ], GaugeView.prototype, "tickPadding", void 0);
        __decorate([
            view.MemberAnimator(color.Color)
        ], GaugeView.prototype, "tickColor", void 0);
        __decorate([
            view.MemberAnimator(font.Font, "inherit")
        ], GaugeView.prototype, "font", void 0);
        __decorate([
            view.MemberAnimator(color.Color, "inherit")
        ], GaugeView.prototype, "textColor", void 0);
        return GaugeView;
    }(view.GraphicView));

    var SliceView = (function (_super) {
        __extends(SliceView, _super);
        function SliceView() {
            var _this = _super.call(this) || this;
            _this.value.setState(0);
            _this._total = 1;
            _this.phaseAngle.setState(angle.Angle.zero());
            return _this;
        }
        Object.defineProperty(SliceView.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: true,
            configurable: true
        });
        SliceView.prototype.total = function (value) {
            if (value === void 0) {
                return this._total;
            }
            else {
                this._total = value;
                return this;
            }
        };
        SliceView.prototype.label = function (label) {
            if (label === void 0) {
                return this.getChildView("label");
            }
            else {
                if (label !== null && !(label instanceof view.View)) {
                    label = typeset.TextRunView.fromAny(label);
                }
                this.setChildView("label", label);
                return this;
            }
        };
        SliceView.prototype.legend = function (legend) {
            if (legend === void 0) {
                return this.getChildView("legend");
            }
            else {
                if (legend !== null && !(legend instanceof view.View)) {
                    legend = typeset.TextRunView.fromAny(legend);
                }
                this.setChildView("legend", legend);
                return this;
            }
        };
        SliceView.prototype.onAnimate = function (t) {
            this.value.onFrame(t);
            this.innerRadius.onFrame(t);
            this.outerRadius.onFrame(t);
            this.phaseAngle.onFrame(t);
            this.padAngle.onFrame(t);
            this.padRadius.onFrame(t);
            this.cornerRadius.onFrame(t);
            this.labelRadius.onFrame(t);
            this.sliceColor.onFrame(t);
            this.tickAlign.onFrame(t);
            this.tickRadius.onFrame(t);
            this.tickLength.onFrame(t);
            this.tickWidth.onFrame(t);
            this.tickPadding.onFrame(t);
            this.tickColor.onFrame(t);
            this.font.onFrame(t);
            this.textColor.onFrame(t);
        };
        SliceView.prototype.onRender = function (context) {
            context.save();
            var bounds = this._bounds;
            var anchor = this._anchor;
            this.renderSlice(context, bounds, anchor);
            this.renderTick(context, bounds, anchor);
            context.restore();
        };
        SliceView.prototype.renderSlice = function (context, bounds, anchor) {
            var size = Math.min(bounds.width, bounds.height);
            var r0 = this.innerRadius.value.pxValue(size);
            var r1 = this.outerRadius.value.pxValue(size);
            var a0 = this.phaseAngle.value.radValue();
            var da = 2 * Math.PI * this.value.value / (this._total || 1);
            var ap = this.padAngle.value;
            var rp = this.padRadius.value || null;
            var rc = this.cornerRadius.value.pxValue(r1 - r0);
            var arc = new shape.Arc(length.Length.px(r0), length.Length.px(r1), angle.Angle.rad(a0), angle.Angle.rad(da), ap, rp, length.Length.px(rc));
            context.beginPath();
            var sliceColor = this.sliceColor.value;
            context.fillStyle = sliceColor.toString();
            arc.render(context, bounds, anchor);
            context.fill();
            var label = this.label();
            if (view.RenderView.is(label)) {
                var a = a0 + da / 2;
                var r = r0 + this.labelRadius.value.pxValue(r1 - r0);
                var rx = r * Math.cos(a);
                var ry = r * Math.sin(a);
                var labelAnchor = new math.PointR2(anchor.x + rx, anchor.y + ry);
                label.setAnchor(labelAnchor);
                if (view.TypesetView.is(label)) {
                    label.textAlign("center");
                    label.textBaseline("middle");
                }
            }
        };
        SliceView.prototype.renderTick = function (context, bounds, anchor) {
            var legend = this.legend();
            if (view.RenderView.is(legend) && !legend.hidden) {
                var width = bounds.width;
                var height = bounds.height;
                var size = Math.min(width, height);
                var cx = anchor.x;
                var cy = anchor.y;
                var a0 = this.phaseAngle.value.radValue();
                var da = Math.min(2 * Math.PI * this.value.value / (this._total || 1), 2 * Math.PI);
                var a = a0 + da * this.tickAlign.value;
                var r1 = this.outerRadius.value.pxValue(size);
                var r2 = this.tickRadius.value.pxValue(size);
                var r3 = this.tickLength.value.pxValue(width);
                var r1x = r1 * Math.cos(a + 1e-12);
                var r1y = r1 * Math.sin(a + 1e-12);
                var r2x = r2 * Math.cos(a + 1e-12);
                var r2y = r2 * Math.sin(a + 1e-12);
                var l = 0;
                context.beginPath();
                var tickColor = this.tickColor.value;
                context.strokeStyle = tickColor.toString();
                context.lineWidth = this.tickWidth.value.pxValue(size);
                context.moveTo(cx + r1x, cy + r1y);
                context.lineTo(cx + r2x, cy + r2y);
                if (r3) {
                    if (r2x >= 0) {
                        context.lineTo(cx + r3, cy + r2y);
                        l = r3 - r2x;
                    }
                    else if (r2x < 0) {
                        context.lineTo(cx - r3, cy + r2y);
                        l = r3 + r2x;
                    }
                }
                context.stroke();
                var dx = void 0;
                var textAlign = void 0;
                if (r2x >= 0) {
                    dx = l;
                    if (r2y >= 0) {
                        textAlign = "end";
                    }
                    else {
                        textAlign = "end";
                    }
                }
                else {
                    dx = -l;
                    if (r2y < 0) {
                        textAlign = "start";
                    }
                    else {
                        textAlign = "start";
                    }
                }
                var legendAnchor = new math.PointR2(cx + r2x + dx, cy + r2y - this.tickPadding.value.pxValue(size));
                legend.setAnchor(legendAnchor);
                if (view.TypesetView.is(legend)) {
                    if (view.FillView.is(legend)) {
                        legend.fill(tickColor);
                    }
                    legend.textAlign(textAlign);
                    legend.textBaseline("alphabetic");
                }
            }
        };
        SliceView.prototype.hitTest = function (x, y, context) {
            var hit = _super.prototype.hitTest.call(this, x, y, context);
            if (hit === null) {
                context.save();
                var pixelRatio = this.pixelRatio;
                x *= pixelRatio;
                y *= pixelRatio;
                var bounds = this._bounds;
                var anchor = this._anchor;
                hit = this.hitTestSlice(x, y, context, bounds, anchor);
                context.restore();
            }
            return hit;
        };
        SliceView.prototype.hitTestSlice = function (x, y, context, bounds, anchor) {
            var size = Math.min(bounds.width, bounds.height);
            var r0 = this.innerRadius.value.pxValue(size);
            var r1 = this.outerRadius.value.pxValue(size);
            var a0 = this.phaseAngle.value.radValue();
            var da = 2 * Math.PI * this.value.value / (this._total || 1);
            var ap = this.padAngle.value;
            var rp = this.padRadius.value || null;
            var rc = this.cornerRadius.value.pxValue(r1 - r0);
            var arc = new shape.Arc(length.Length.px(r0), length.Length.px(r1), angle.Angle.rad(a0), angle.Angle.rad(da), ap, rp, length.Length.px(rc));
            context.beginPath();
            arc.render(context, bounds, anchor);
            if (context.isPointInPath(x, y)) {
                return this;
            }
            return null;
        };
        SliceView.fromAny = function (slice) {
            if (slice instanceof SliceView) {
                return slice;
            }
            else if (typeof slice === "object" && slice) {
                var view = new SliceView();
                if (slice.key !== void 0) {
                    view.key(slice.key);
                }
                if (slice.value !== void 0) {
                    view.value(slice.value);
                }
                if (slice.total !== void 0) {
                    view.total(slice.total);
                }
                if (slice.innerRadius !== void 0) {
                    view.innerRadius(slice.innerRadius);
                }
                if (slice.outerRadius !== void 0) {
                    view.outerRadius(slice.outerRadius);
                }
                if (slice.phaseAngle !== void 0) {
                    view.phaseAngle(slice.phaseAngle);
                }
                if (slice.padAngle !== void 0) {
                    view.padAngle(slice.padAngle);
                }
                if (slice.padRadius !== void 0) {
                    view.padRadius(slice.padRadius);
                }
                if (slice.cornerRadius !== void 0) {
                    view.cornerRadius(slice.cornerRadius);
                }
                if (slice.labelRadius !== void 0) {
                    view.labelRadius(slice.labelRadius);
                }
                if (slice.sliceColor !== void 0) {
                    view.sliceColor(slice.sliceColor);
                }
                if (slice.tickAlign !== void 0) {
                    view.tickAlign(slice.tickAlign);
                }
                if (slice.tickRadius !== void 0) {
                    view.tickRadius(slice.tickRadius);
                }
                if (slice.tickLength !== void 0) {
                    view.tickLength(slice.tickLength);
                }
                if (slice.tickWidth !== void 0) {
                    view.tickWidth(slice.tickWidth);
                }
                if (slice.tickPadding !== void 0) {
                    view.tickPadding(slice.tickPadding);
                }
                if (slice.tickColor !== void 0) {
                    view.tickColor(slice.tickColor);
                }
                if (slice.font !== void 0) {
                    view.font(slice.font);
                }
                if (slice.textColor !== void 0) {
                    view.textColor(slice.textColor);
                }
                if (slice.label !== void 0) {
                    view.label(slice.label);
                }
                if (slice.legend !== void 0) {
                    view.legend(slice.legend);
                }
                return view;
            }
            throw new TypeError("" + slice);
        };
        __decorate([
            view.MemberAnimator(Number)
        ], SliceView.prototype, "value", void 0);
        __decorate([
            view.MemberAnimator(length.Length, "inherit")
        ], SliceView.prototype, "innerRadius", void 0);
        __decorate([
            view.MemberAnimator(length.Length, "inherit")
        ], SliceView.prototype, "outerRadius", void 0);
        __decorate([
            view.MemberAnimator(angle.Angle)
        ], SliceView.prototype, "phaseAngle", void 0);
        __decorate([
            view.MemberAnimator(angle.Angle, "inherit")
        ], SliceView.prototype, "padAngle", void 0);
        __decorate([
            view.MemberAnimator(length.Length, "inherit")
        ], SliceView.prototype, "padRadius", void 0);
        __decorate([
            view.MemberAnimator(length.Length, "inherit")
        ], SliceView.prototype, "cornerRadius", void 0);
        __decorate([
            view.MemberAnimator(length.Length, "inherit")
        ], SliceView.prototype, "labelRadius", void 0);
        __decorate([
            view.MemberAnimator(color.Color, "inherit")
        ], SliceView.prototype, "sliceColor", void 0);
        __decorate([
            view.MemberAnimator(Number, "inherit")
        ], SliceView.prototype, "tickAlign", void 0);
        __decorate([
            view.MemberAnimator(length.Length, "inherit")
        ], SliceView.prototype, "tickRadius", void 0);
        __decorate([
            view.MemberAnimator(length.Length, "inherit")
        ], SliceView.prototype, "tickLength", void 0);
        __decorate([
            view.MemberAnimator(length.Length, "inherit")
        ], SliceView.prototype, "tickWidth", void 0);
        __decorate([
            view.MemberAnimator(length.Length, "inherit")
        ], SliceView.prototype, "tickPadding", void 0);
        __decorate([
            view.MemberAnimator(color.Color, "inherit")
        ], SliceView.prototype, "tickColor", void 0);
        __decorate([
            view.MemberAnimator(font.Font, "inherit")
        ], SliceView.prototype, "font", void 0);
        __decorate([
            view.MemberAnimator(color.Color, "inherit")
        ], SliceView.prototype, "textColor", void 0);
        return SliceView;
    }(view.GraphicView));

    var PieView = (function (_super) {
        __extends(PieView, _super);
        function PieView() {
            var _this = _super.call(this) || this;
            _this.limit.setState(0);
            _this.baseAngle.setState(angle.Angle.rad(-Math.PI / 2));
            _this.innerRadius.setState(length.Length.pct(3));
            _this.outerRadius.setState(length.Length.pct(25));
            _this.padAngle.setState(angle.Angle.deg(2));
            _this.padRadius.setState(null);
            _this.cornerRadius.setState(length.Length.zero());
            _this.labelRadius.setState(length.Length.pct(50));
            _this.sliceColor.setState(color.Color.black());
            _this.tickAlign.setState(0.5);
            _this.tickRadius.setState(length.Length.pct(30));
            _this.tickLength.setState(length.Length.pct(50));
            _this.tickWidth.setState(length.Length.px(1));
            _this.tickPadding.setState(length.Length.px(1));
            _this.tickColor.setState(color.Color.black());
            return _this;
        }
        Object.defineProperty(PieView.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: true,
            configurable: true
        });
        PieView.prototype.title = function (title) {
            if (title === void 0) {
                return this.getChildView("title");
            }
            else {
                if (title !== null && !(title instanceof view.View)) {
                    title = typeset.TextRunView.fromAny(title);
                }
                this.setChildView("title", title);
                return this;
            }
        };
        PieView.prototype.addSlice = function (slice) {
            slice = SliceView.fromAny(slice);
            this.appendChildView(slice);
        };
        PieView.prototype.onAnimate = function (t) {
            this.limit.onFrame(t);
            this.baseAngle.onFrame(t);
            this.innerRadius.onFrame(t);
            this.outerRadius.onFrame(t);
            this.padAngle.onFrame(t);
            this.padRadius.onFrame(t);
            this.cornerRadius.onFrame(t);
            this.labelRadius.onFrame(t);
            this.sliceColor.onFrame(t);
            this.tickAlign.onFrame(t);
            this.tickRadius.onFrame(t);
            this.tickLength.onFrame(t);
            this.tickWidth.onFrame(t);
            this.tickPadding.onFrame(t);
            this.tickColor.onFrame(t);
            this.font.onFrame(t);
            this.textColor.onFrame(t);
        };
        PieView.prototype.didAnimate = function (t) {
            this.layoutPie();
            _super.prototype.didAnimate.call(this, t);
        };
        PieView.prototype.layoutPie = function () {
            var childViews = this._childViews;
            var childCount = childViews.length;
            var total = 0;
            for (var i = 0; i < childCount; i += 1) {
                var childView = childViews[i];
                if (childView instanceof SliceView) {
                    var value = childView.value.value;
                    if (isFinite(value)) {
                        total += value;
                    }
                }
            }
            total = Math.max(total, this.limit.value);
            var baseAngle = this.baseAngle.value;
            for (var i = 0; i < childCount; i += 1) {
                var childView = childViews[i];
                if (childView instanceof SliceView) {
                    childView.total(total).phaseAngle(baseAngle);
                    var value = childView.value.value;
                    if (isFinite(value)) {
                        baseAngle = baseAngle.plus(angle.Angle.rad(2 * Math.PI * value / (total || 1)));
                    }
                }
            }
            var title = this.title();
            if (view.TypesetView.is(title)) {
                title.textAlign("center");
                title.textBaseline("middle");
            }
        };
        PieView.fromAny = function (pie) {
            if (pie instanceof PieView) {
                return pie;
            }
            else if (typeof pie === "object" && pie) {
                var view = new PieView();
                if (pie.key !== void 0) {
                    view.key(pie.key);
                }
                if (pie.limit !== void 0) {
                    view.limit(pie.limit);
                }
                if (pie.baseAngle !== void 0) {
                    view.baseAngle(pie.baseAngle);
                }
                if (pie.innerRadius !== void 0) {
                    view.innerRadius(pie.innerRadius);
                }
                if (pie.outerRadius !== void 0) {
                    view.outerRadius(pie.outerRadius);
                }
                if (pie.padAngle !== void 0) {
                    view.padAngle(pie.padAngle);
                }
                if (pie.padRadius !== void 0) {
                    view.padRadius(pie.padRadius);
                }
                if (pie.cornerRadius !== void 0) {
                    view.cornerRadius(pie.cornerRadius);
                }
                if (pie.labelRadius !== void 0) {
                    view.labelRadius(pie.labelRadius);
                }
                if (pie.sliceColor !== void 0) {
                    view.sliceColor(pie.sliceColor);
                }
                if (pie.tickAlign !== void 0) {
                    view.tickAlign(pie.tickAlign);
                }
                if (pie.tickRadius !== void 0) {
                    view.tickRadius(pie.tickRadius);
                }
                if (pie.tickLength !== void 0) {
                    view.tickLength(pie.tickLength);
                }
                if (pie.tickWidth !== void 0) {
                    view.tickWidth(pie.tickWidth);
                }
                if (pie.tickPadding !== void 0) {
                    view.tickPadding(pie.tickPadding);
                }
                if (pie.tickColor !== void 0) {
                    view.tickColor(pie.tickColor);
                }
                if (pie.font !== void 0) {
                    view.font(pie.font);
                }
                if (pie.textColor !== void 0) {
                    view.textColor(pie.textColor);
                }
                if (pie.title !== void 0) {
                    view.title(pie.title);
                }
                var slices = pie.slices;
                if (slices) {
                    for (var i = 0, n = slices.length; i < n; i += 1) {
                        view.addSlice(slices[i]);
                    }
                }
                return view;
            }
            throw new TypeError("" + pie);
        };
        __decorate([
            view.MemberAnimator(Number)
        ], PieView.prototype, "limit", void 0);
        __decorate([
            view.MemberAnimator(angle.Angle)
        ], PieView.prototype, "baseAngle", void 0);
        __decorate([
            view.MemberAnimator(length.Length)
        ], PieView.prototype, "innerRadius", void 0);
        __decorate([
            view.MemberAnimator(length.Length)
        ], PieView.prototype, "outerRadius", void 0);
        __decorate([
            view.MemberAnimator(angle.Angle)
        ], PieView.prototype, "padAngle", void 0);
        __decorate([
            view.MemberAnimator(length.Length)
        ], PieView.prototype, "padRadius", void 0);
        __decorate([
            view.MemberAnimator(length.Length)
        ], PieView.prototype, "cornerRadius", void 0);
        __decorate([
            view.MemberAnimator(length.Length)
        ], PieView.prototype, "labelRadius", void 0);
        __decorate([
            view.MemberAnimator(color.Color)
        ], PieView.prototype, "sliceColor", void 0);
        __decorate([
            view.MemberAnimator(Number)
        ], PieView.prototype, "tickAlign", void 0);
        __decorate([
            view.MemberAnimator(length.Length)
        ], PieView.prototype, "tickRadius", void 0);
        __decorate([
            view.MemberAnimator(length.Length)
        ], PieView.prototype, "tickLength", void 0);
        __decorate([
            view.MemberAnimator(length.Length)
        ], PieView.prototype, "tickWidth", void 0);
        __decorate([
            view.MemberAnimator(length.Length)
        ], PieView.prototype, "tickPadding", void 0);
        __decorate([
            view.MemberAnimator(color.Color)
        ], PieView.prototype, "tickColor", void 0);
        __decorate([
            view.MemberAnimator(font.Font, "inherit")
        ], PieView.prototype, "font", void 0);
        __decorate([
            view.MemberAnimator(color.Color, "inherit")
        ], PieView.prototype, "textColor", void 0);
        return PieView;
    }(view.GraphicView));

    (function (TickState) {
        TickState[TickState["Excluded"] = 0] = "Excluded";
        TickState[TickState["Entering"] = 1] = "Entering";
        TickState[TickState["Included"] = 2] = "Included";
        TickState[TickState["Leaving"] = 3] = "Leaving";
    })(exports.TickState || (exports.TickState = {}));
    var TickView = (function (_super) {
        __extends(TickView, _super);
        function TickView(value) {
            var _this = _super.call(this) || this;
            _this._value = value;
            _this._coord = 0;
            _this._coord0 = NaN;
            _this._state = 0;
            _this._preserve = true;
            _this.opacity.setState(1);
            _this.opacity.interpolate = TickView.interpolateOpacity;
            return _this;
        }
        Object.defineProperty(TickView.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TickView.prototype, "value", {
            get: function () {
                return this._value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TickView.prototype, "coord", {
            get: function () {
                return this._coord;
            },
            enumerable: true,
            configurable: true
        });
        TickView.prototype.setCoord = function (coord) {
            this._coord = coord;
        };
        TickView.prototype.tickLabel = function (tickLabel) {
            if (tickLabel === void 0) {
                return this.getChildView("tickLabel");
            }
            else {
                if (tickLabel !== null && !(tickLabel instanceof view.View)) {
                    tickLabel = typeset.TextRunView.fromAny(tickLabel);
                }
                this.setChildView("tickLabel", tickLabel);
                return this;
            }
        };
        TickView.prototype.preserve = function (preserve) {
            if (preserve === void 0) {
                return this._preserve;
            }
            else {
                this._preserve = preserve;
                return this;
            }
        };
        TickView.prototype.fadeIn = function (transition) {
            if (this._state === 0 || this._state === 3) {
                this.opacity.setState(1, transition);
                this._state = 1;
            }
        };
        TickView.prototype.fadeOut = function (transition) {
            if (this._state === 1 || this._state === 2) {
                this.opacity.setState(0, transition);
                this._state = 3;
            }
        };
        TickView.prototype.onAnimate = function (t) {
            this.opacity.onFrame(t);
            this.tickMarkColor.onFrame(t);
            this.tickMarkWidth.onFrame(t);
            this.tickMarkLength.onFrame(t);
            this.tickLabelPadding.onFrame(t);
            this.gridLineColor.onFrame(t);
            this.gridLineWidth.onFrame(t);
            this.font.onFrame(t);
            this.textColor.onFrame(t);
            var tickLabel = this.tickLabel();
            if (view.RenderView.is(tickLabel)) {
                this.layoutTickLabel(tickLabel, this._bounds, this._anchor);
            }
        };
        TickView.prototype.willRender = function (context) {
            _super.prototype.willRender.call(this, context);
            context.save();
            context.globalAlpha = this.opacity.value;
        };
        TickView.prototype.onRender = function (context) {
            var bounds = this._bounds;
            var anchor = this._anchor;
            this.renderTick(context, bounds, anchor);
        };
        TickView.prototype.didRender = function (context) {
            context.restore();
            _super.prototype.didRender.call(this, context);
        };
        TickView.prototype.setChildViewBounds = function (childView, bounds) {
            if (childView.key() === "tickLabel") {
                this.layoutTickLabel(childView, bounds, this._anchor);
            }
            else {
                _super.prototype.setChildViewBounds.call(this, childView, bounds);
            }
        };
        TickView.prototype.setChildViewAnchor = function (childView, anchor) {
            if (childView.key() === "tickLabel") {
                this.layoutTickLabel(childView, this._bounds, anchor);
            }
            else {
                _super.prototype.setChildViewAnchor.call(this, childView, anchor);
            }
        };
        TickView.top = function (value) {
            return new TickView.Top(value);
        };
        TickView.right = function (value) {
            return new TickView.Right(value);
        };
        TickView.bottom = function (value) {
            return new TickView.Bottom(value);
        };
        TickView.left = function (value) {
            return new TickView.Left(value);
        };
        TickView.from = function (orientation, value) {
            if (orientation === "top") {
                return TickView.top(value);
            }
            else if (orientation === "right") {
                return TickView.right(value);
            }
            else if (orientation === "bottom") {
                return TickView.bottom(value);
            }
            else if (orientation === "left") {
                return TickView.left(value);
            }
            else {
                throw new TypeError(orientation);
            }
        };
        TickView.fromAny = function (tick, orientation) {
            if (tick instanceof TickView) {
                return tick;
            }
            else if (tick && typeof tick === "object") {
                if (tick.orientation) {
                    orientation = tick.orientation;
                }
                if (!orientation) {
                    throw new TypeError();
                }
                var view = TickView.from(orientation, tick.value);
                if (tick.key !== void 0) {
                    view.key(tick.key);
                }
                if (tick.tickMarkColor !== void 0) {
                    view.tickMarkColor(tick.tickMarkColor);
                }
                if (tick.tickMarkWidth !== void 0) {
                    view.tickMarkWidth(tick.tickMarkWidth);
                }
                if (tick.tickMarkLength !== void 0) {
                    view.tickMarkLength(tick.tickMarkLength);
                }
                if (tick.tickLabelPadding !== void 0) {
                    view.tickLabelPadding(tick.tickLabelPadding);
                }
                if (tick.gridLineColor !== void 0) {
                    view.gridLineColor(tick.gridLineColor);
                }
                if (tick.gridLineWidth !== void 0) {
                    view.gridLineWidth(tick.gridLineWidth);
                }
                if (tick.font !== void 0) {
                    view.font(tick.font);
                }
                if (tick.textColor !== void 0) {
                    view.textColor(tick.textColor);
                }
                if (tick.tickLabel !== void 0) {
                    view.tickLabel(tick.tickLabel);
                }
                return view;
            }
            throw new TypeError("" + tick);
        };
        TickView.interpolateOpacity = function (u) {
            var view = this._view;
            var coord = view._coord;
            if (isNaN(view._coord0)) {
                view._coord0 = coord;
            }
            var axisView = view._parentView;
            var tickSpacing = axisView._tickSpacing / 2;
            var v = Math.min(Math.abs(coord - view._coord0) / tickSpacing, 1);
            var opacity = this._interpolator.interpolate(Math.max(u, v));
            if (u === 1 || v === 1) {
                this._tweenState = 3;
            }
            if (opacity === 0 && view._state === 3) {
                view._state = 0;
                view._coord0 = NaN;
                view.remove();
            }
            else if (opacity === 1 && view._state === 1) {
                view._state = 2;
                view._coord0 = NaN;
            }
            return opacity;
        };
        __decorate([
            view.MemberAnimator(Number)
        ], TickView.prototype, "opacity", void 0);
        __decorate([
            view.MemberAnimator(color.Color, "inherit")
        ], TickView.prototype, "tickMarkColor", void 0);
        __decorate([
            view.MemberAnimator(Number, "inherit")
        ], TickView.prototype, "tickMarkWidth", void 0);
        __decorate([
            view.MemberAnimator(Number, "inherit")
        ], TickView.prototype, "tickMarkLength", void 0);
        __decorate([
            view.MemberAnimator(Number, "inherit")
        ], TickView.prototype, "tickLabelPadding", void 0);
        __decorate([
            view.MemberAnimator(color.Color, "inherit")
        ], TickView.prototype, "gridLineColor", void 0);
        __decorate([
            view.MemberAnimator(Number, "inherit")
        ], TickView.prototype, "gridLineWidth", void 0);
        __decorate([
            view.MemberAnimator(font.Font, "inherit")
        ], TickView.prototype, "font", void 0);
        __decorate([
            view.MemberAnimator(color.Color, "inherit")
        ], TickView.prototype, "textColor", void 0);
        return TickView;
    }(view.GraphicView));

    var TopTickView = (function (_super) {
        __extends(TopTickView, _super);
        function TopTickView(value) {
            return _super.call(this, value) || this;
        }
        Object.defineProperty(TopTickView.prototype, "orientation", {
            get: function () {
                return "top";
            },
            enumerable: true,
            configurable: true
        });
        TopTickView.prototype.layoutTickLabel = function (tickLabel, bounds, anchor) {
            var x = Math.round(anchor.x);
            var y0 = Math.round(anchor.y);
            var y1 = y0 - this.tickMarkLength.value;
            var y2 = y1 - this.tickLabelPadding.value;
            var tickLabelAnchor = new math.PointR2(x, y2);
            tickLabel.setAnchor(tickLabelAnchor);
            if (view.TypesetView.is(tickLabel)) {
                tickLabel.textAlign("center");
                tickLabel.textBaseline("bottom");
            }
        };
        TopTickView.prototype.renderTick = function (context, bounds, anchor) {
            var x = Math.round(anchor.x);
            var y0 = Math.round(anchor.y);
            var y1 = y0 - this.tickMarkLength.value;
            context.beginPath();
            context.strokeStyle = this.tickMarkColor.value.toString();
            context.lineWidth = this.tickMarkWidth.value;
            context.moveTo(x, y0);
            context.lineTo(x, y1);
            context.stroke();
            var gridLineWidth = this.gridLineWidth.value;
            if (gridLineWidth && bounds.xMin < x && x < bounds.xMax) {
                context.beginPath();
                context.strokeStyle = this.gridLineColor.value.toString();
                context.lineWidth = gridLineWidth;
                context.moveTo(x, y0);
                context.lineTo(x, bounds.yMax);
                context.stroke();
            }
        };
        return TopTickView;
    }(TickView));
    TickView.Top = TopTickView;

    var RightTickView = (function (_super) {
        __extends(RightTickView, _super);
        function RightTickView(value) {
            return _super.call(this, value) || this;
        }
        Object.defineProperty(RightTickView.prototype, "orientation", {
            get: function () {
                return "right";
            },
            enumerable: true,
            configurable: true
        });
        RightTickView.prototype.layoutTickLabel = function (tickLabel, bounds, anchor) {
            var x0 = Math.round(anchor.x);
            var y = Math.round(anchor.y);
            var x1 = x0 + this.tickMarkLength.value;
            var x2 = x1 + this.tickLabelPadding.value;
            var tickLabelAnchor = new math.PointR2(x2, y);
            tickLabel.setAnchor(tickLabelAnchor);
            if (view.TypesetView.is(tickLabel)) {
                tickLabel.textAlign("left");
                tickLabel.textBaseline("middle");
            }
        };
        RightTickView.prototype.renderTick = function (context, bounds, anchor) {
            var x0 = Math.round(anchor.x);
            var y = Math.round(anchor.y);
            var x1 = x0 + this.tickMarkLength.value;
            context.beginPath();
            context.strokeStyle = this.tickMarkColor.value.toString();
            context.lineWidth = this.tickMarkWidth.value;
            context.moveTo(x0, y);
            context.lineTo(x1, y);
            context.stroke();
            var gridLineWidth = this.gridLineWidth.value;
            if (gridLineWidth && bounds.yMin < y && y < bounds.yMax) {
                context.beginPath();
                context.strokeStyle = this.gridLineColor.value.toString();
                context.lineWidth = gridLineWidth;
                context.moveTo(x0, y);
                context.lineTo(bounds.xMin, y);
                context.stroke();
            }
        };
        return RightTickView;
    }(TickView));
    TickView.Right = RightTickView;

    var BottomTickView = (function (_super) {
        __extends(BottomTickView, _super);
        function BottomTickView(value) {
            return _super.call(this, value) || this;
        }
        Object.defineProperty(BottomTickView.prototype, "orientation", {
            get: function () {
                return "bottom";
            },
            enumerable: true,
            configurable: true
        });
        BottomTickView.prototype.layoutTickLabel = function (tickLabel, bounds, anchor) {
            var x = Math.round(anchor.x);
            var y0 = Math.round(anchor.y);
            var y1 = y0 + this.tickMarkLength.value;
            var y2 = y1 + this.tickLabelPadding.value;
            var tickLabelAnchor = new math.PointR2(x, y2);
            tickLabel.setAnchor(tickLabelAnchor);
            if (view.TypesetView.is(tickLabel)) {
                tickLabel.textAlign("center");
                tickLabel.textBaseline("top");
            }
        };
        BottomTickView.prototype.renderTick = function (context, bounds, anchor) {
            var x = Math.round(anchor.x);
            var y0 = Math.round(anchor.y);
            var y1 = y0 + this.tickMarkLength.value;
            context.beginPath();
            context.strokeStyle = this.tickMarkColor.value.toString();
            context.lineWidth = this.tickMarkWidth.value;
            context.moveTo(x, y0);
            context.lineTo(x, y1);
            context.stroke();
            var gridLineWidth = this.gridLineWidth.value;
            if (gridLineWidth && bounds.xMin < x && x < bounds.xMax) {
                context.beginPath();
                context.strokeStyle = this.gridLineColor.value.toString();
                context.lineWidth = gridLineWidth;
                context.moveTo(x, y0);
                context.lineTo(x, bounds.yMin);
                context.stroke();
            }
        };
        return BottomTickView;
    }(TickView));
    TickView.Bottom = BottomTickView;

    var LeftTickView = (function (_super) {
        __extends(LeftTickView, _super);
        function LeftTickView(value) {
            return _super.call(this, value) || this;
        }
        Object.defineProperty(LeftTickView.prototype, "orientation", {
            get: function () {
                return "left";
            },
            enumerable: true,
            configurable: true
        });
        LeftTickView.prototype.layoutTickLabel = function (tickLabel, bounds, anchor) {
            var x0 = Math.round(anchor.x);
            var y = Math.round(anchor.y);
            var x1 = x0 - this.tickMarkLength.value;
            var x2 = x1 - this.tickLabelPadding.value;
            var tickLabelAnchor = new math.PointR2(x2, y);
            tickLabel.setAnchor(tickLabelAnchor);
            if (view.TypesetView.is(tickLabel)) {
                tickLabel.textAlign("right");
                tickLabel.textBaseline("middle");
            }
        };
        LeftTickView.prototype.renderTick = function (context, bounds, anchor) {
            var x0 = Math.round(anchor.x);
            var y = Math.round(anchor.y);
            var x1 = x0 - this.tickMarkLength.value;
            context.beginPath();
            context.strokeStyle = this.tickMarkColor.value.toString();
            context.lineWidth = this.tickMarkWidth.value;
            context.moveTo(x0, y);
            context.lineTo(x1, y);
            context.stroke();
            var gridLineWidth = this.gridLineWidth.value;
            if (gridLineWidth && bounds.yMin < y && y < bounds.yMax) {
                context.beginPath();
                context.strokeStyle = this.gridLineColor.value.toString();
                context.lineWidth = gridLineWidth;
                context.moveTo(x0, y);
                context.lineTo(bounds.xMax, y);
                context.stroke();
            }
        };
        return LeftTickView;
    }(TickView));
    TickView.Left = LeftTickView;

    var ERROR_10 = Math.sqrt(50);
    var ERROR_5 = Math.sqrt(10);
    var ERROR_2 = Math.sqrt(2);
    var SECOND = 1000;
    var MINUTE = 60 * SECOND;
    var HOUR = 60 * MINUTE;
    var DAY = 24 * HOUR;
    var WEEK = 7 * DAY;
    var MONTH = 30 * DAY;
    var YEAR = 365 * DAY;
    var TIME_TICK_INTERVALS = new collections.BTree()
        .set(SECOND, time.TimeInterval.second())
        .set(5 * SECOND, time.TimeInterval.second(5))
        .set(15 * SECOND, time.TimeInterval.second(15))
        .set(30 * SECOND, time.TimeInterval.second(30))
        .set(MINUTE, time.TimeInterval.minute(1))
        .set(5 * MINUTE, time.TimeInterval.minute(5))
        .set(15 * MINUTE, time.TimeInterval.minute(15))
        .set(30 * MINUTE, time.TimeInterval.minute(30))
        .set(HOUR, time.TimeInterval.hour())
        .set(3 * HOUR, time.TimeInterval.hour(3))
        .set(6 * HOUR, time.TimeInterval.hour(6))
        .set(12 * HOUR, time.TimeInterval.hour(12))
        .set(DAY, time.TimeInterval.day())
        .set(2 * DAY, time.TimeInterval.day(2))
        .set(WEEK, time.TimeInterval.week())
        .set(MONTH, time.TimeInterval.month())
        .set(3 * MONTH, time.TimeInterval.month(3))
        .set(YEAR, time.TimeInterval.year());
    var MILLISECOND_FORMAT = time.DateTimeFormat.pattern(".%L");
    var SECOND_FORMAT = time.DateTimeFormat.pattern(":%S");
    var MINUTE_FORMAT = time.DateTimeFormat.pattern("%I:%M");
    var HOUR_FORMAT = time.DateTimeFormat.pattern("%I %p");
    var WEEKDAY_FORMAT = time.DateTimeFormat.pattern("%a %d");
    var MONTHDAY_FORMAT = time.DateTimeFormat.pattern("%b %d");
    var MONTH_FORMAT = time.DateTimeFormat.pattern("%B");
    var YEAR_FORMAT = time.DateTimeFormat.pattern("%Y");
    var TickGenerator = (function () {
        function TickGenerator() {
        }
        TickGenerator.prototype.format = function (tickValue) {
            return "" + tickValue;
        };
        TickGenerator.fromScale = function (scale$1, n) {
            if (n === void 0) {
                n = 10;
            }
            if (scale$1 instanceof scale.TimeScale) {
                var domain = scale$1.domain();
                return new TimeTickGenerator(domain[0], domain[1], n);
            }
            else {
                var domain = scale$1.domain();
                return new NumberTickGenerator(domain[0], domain[1], n);
            }
        };
        TickGenerator.step = function (dx, n) {
            var step0 = Math.abs(dx) / n;
            var step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10));
            var error = step0 / step1;
            if (error >= ERROR_10) {
                step1 *= 10;
            }
            else if (error >= ERROR_5) {
                step1 *= 5;
            }
            else if (error >= ERROR_2) {
                step1 *= 2;
            }
            return dx < 0 ? -step1 : step1;
        };
        return TickGenerator;
    }());
    var NumberTickGenerator = (function (_super) {
        __extends(NumberTickGenerator, _super);
        function NumberTickGenerator(x0, x1, n) {
            var _this = _super.call(this) || this;
            _this.x0 = x0;
            _this.dx = x1 - _this.x0;
            _this.n = Math.max(0, n);
            return _this;
        }
        NumberTickGenerator.prototype.count = function (n) {
            if (n === void 0) {
                return this.n;
            }
            else {
                this.n = Math.max(0, n);
                return this;
            }
        };
        NumberTickGenerator.prototype.domain = function (x0, x1) {
            if (x0 === void 0) {
                return [this.x0, this.x0 + this.dx];
            }
            else if (x1 === void 0) {
                this.x0 = x0[0];
                this.dx = x0[1] - this.x0;
                return this;
            }
            else {
                this.x0 = x0;
                this.dx = x1 - this.x0;
                return this;
            }
        };
        NumberTickGenerator.prototype.generate = function () {
            var x0;
            var x1;
            if (this.dx < 0) {
                x1 = this.x0;
                x0 = x1 + this.dx;
            }
            else {
                x0 = this.x0;
                x1 = x0 + this.dx;
            }
            var step = NumberTickGenerator.interval(x1 - x0, this.n);
            if (step === 0 || !isFinite(step)) {
                return [];
            }
            var ticks;
            if (step > 0) {
                x0 = Math.ceil(x0 / step);
                x1 = Math.floor(x1 / step);
                var n = Math.ceil(x1 - x0 + 1);
                ticks = new Array(n);
                for (var i = 0; i < n; i += 1) {
                    ticks[i] = (x0 + i) * step;
                }
            }
            else {
                x0 = Math.floor(x0 * step);
                x1 = Math.ceil(x1 * step);
                var n = Math.ceil(x0 - x1 + 1);
                ticks = new Array(n);
                for (var i = 0; i < n; i += 1) {
                    ticks[i] = (x0 - i) / step;
                }
            }
            if (this.dx < 0) {
                ticks.reverse();
            }
            return ticks;
        };
        NumberTickGenerator.interval = function (dx, n) {
            if (n === void 0) { n = 10; }
            var step = dx / n;
            var power = Math.floor(Math.log(step) / Math.LN10);
            var power10 = Math.pow(10, power);
            var error = step / power10;
            var base = error >= ERROR_10 ? 10 : error >= ERROR_5 ? 5 : error >= ERROR_2 ? 2 : 1;
            return power >= 0 ? power10 * base : -Math.pow(10, -power) / base;
        };
        return NumberTickGenerator;
    }(TickGenerator));
    var TimeTickGenerator = (function (_super) {
        __extends(TimeTickGenerator, _super);
        function TimeTickGenerator(d0, d1, n, zone) {
            var _this = _super.call(this) || this;
            d0 = time.DateTime.fromAny(d0);
            d1 = time.DateTime.fromAny(d1);
            _this.t0 = d0.time();
            _this.dt = d1.time() - _this.t0;
            _this.zone = zone || d0.zone();
            _this.n = Math.max(0, n);
            return _this;
        }
        TimeTickGenerator.prototype.count = function (n) {
            if (n === void 0) {
                return this.n;
            }
            else {
                this.n = Math.max(0, n);
                return this;
            }
        };
        TimeTickGenerator.prototype.domain = function (d0, d1) {
            if (d0 === void 0) {
                return [new time.DateTime(this.t0, this.zone), new time.DateTime(this.t0 + this.dt, this.zone)];
            }
            else {
                if (d1 === void 0) {
                    d1 = d0[1];
                    d0 = d0[0];
                }
                else {
                    d0 = d0;
                }
                d0 = time.DateTime.fromAny(d0);
                d1 = time.DateTime.fromAny(d1);
                this.t0 = d0.time();
                this.dt = d1.time() - this.t0;
                return this;
            }
        };
        TimeTickGenerator.prototype.generate = function (interval) {
            var t0;
            var t1;
            if (this.dt < 0) {
                t1 = this.t0;
                t0 = t1 + this.dt;
            }
            else {
                t0 = this.t0;
                t1 = t0 + this.dt;
            }
            if (interval === void 0) {
                interval = this.n;
            }
            interval = TimeTickGenerator.interval(t1 - t0, interval);
            var ticks = interval.range(new time.DateTime(t0, this.zone), new time.DateTime(t1 + 1, this.zone));
            if (this.dt < 0) {
                ticks.reverse();
            }
            return ticks;
        };
        TimeTickGenerator.prototype.format = function (tickValue) {
            if (time.TimeInterval.second().floor(tickValue) < tickValue) {
                return MILLISECOND_FORMAT.format(tickValue);
            }
            else if (time.TimeInterval.minute().floor(tickValue) < tickValue) {
                return SECOND_FORMAT.format(tickValue);
            }
            else if (time.TimeInterval.hour().floor(tickValue) < tickValue) {
                return MINUTE_FORMAT.format(tickValue);
            }
            else if (time.TimeInterval.day().floor(tickValue) < tickValue) {
                return HOUR_FORMAT.format(tickValue);
            }
            else if (time.TimeInterval.month().floor(tickValue) < tickValue) {
                if (time.TimeInterval.week().floor(tickValue) < tickValue) {
                    return WEEKDAY_FORMAT.format(tickValue);
                }
                else {
                    return MONTHDAY_FORMAT.format(tickValue);
                }
            }
            else if (time.TimeInterval.year().floor(tickValue) < tickValue) {
                return MONTH_FORMAT.format(tickValue);
            }
            else {
                return YEAR_FORMAT.format(tickValue);
            }
        };
        TimeTickGenerator.interval = function (dt, interval) {
            if (interval === void 0) { interval = 10; }
            if (typeof interval === "number") {
                var t = Math.abs(dt) / interval;
                var duration = TIME_TICK_INTERVALS.nextKey(t);
                if (duration === void 0) {
                    var k = TickGenerator.step(dt / YEAR, interval);
                    interval = time.TimeInterval.year(k);
                }
                else if (duration > SECOND) {
                    if (t / TIME_TICK_INTERVALS.previousKey(t) < duration / t) {
                        interval = TIME_TICK_INTERVALS.previousValue(t);
                    }
                    else {
                        interval = TIME_TICK_INTERVALS.nextValue(t);
                    }
                }
                else {
                    var k = Math.max(1, TickGenerator.step(dt, interval));
                    interval = time.TimeInterval.millisecond(k);
                }
            }
            return interval;
        };
        return TimeTickGenerator;
    }(TickGenerator));

    var AxisView = (function (_super) {
        __extends(AxisView, _super);
        function AxisView(scale) {
            var _this = _super.call(this) || this;
            _this._ticks = new collections.BTree();
            _this._tickGenerator = TickGenerator.fromScale(scale);
            _this._tickSpacing = 80;
            _this._tickTransition = transition.Transition.duration(200);
            _this.scale.setState(scale);
            return _this;
        }
        Object.defineProperty(AxisView.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: true,
            configurable: true
        });
        AxisView.prototype.getTick = function (value) {
            return this._ticks.get(value);
        };
        AxisView.prototype.insertTick = function (tick) {
            tick = TickView.fromAny(tick, this.orientation);
            this.insertChildView(tick, this._ticks.nextValue(tick.value) || null);
        };
        AxisView.prototype.removeTick = function (value) {
            var tick = this._ticks.get(value);
            if (tick) {
                tick.remove();
                this._ticks.delete(value);
            }
        };
        AxisView.prototype.domain = function (x0, x1, tween) {
            var scale = this.scale.value;
            if (x0 === void 0) {
                return scale.domain();
            }
            else {
                scale = scale.domain(x0, x1);
                if (!scale.equals(this.scale.state)) {
                    this.scale.setState(scale, tween);
                }
                return this;
            }
        };
        AxisView.prototype.range = function (y0, y1, tween) {
            var scale = this.scale.value;
            if (y0 === void 0) {
                return scale.range();
            }
            else {
                scale = scale.range(y0, y1);
                if (!scale.equals(this.scale.state)) {
                    this.scale.setState(scale, tween);
                }
                return this;
            }
        };
        AxisView.prototype.tickGenerator = function (tickGenerator) {
            if (tickGenerator === void 0) {
                return this._tickGenerator;
            }
            else {
                this._tickGenerator = tickGenerator;
                return this;
            }
        };
        AxisView.prototype.tickSpacing = function (tickSpacing) {
            if (tickSpacing === void 0) {
                return this._tickSpacing;
            }
            else {
                this._tickSpacing = tickSpacing;
                return this;
            }
        };
        AxisView.prototype.tickTransition = function (tickTransition) {
            if (tickTransition === void 0) {
                return this._tickTransition;
            }
            else {
                tickTransition = tickTransition !== null ? transition.Transition.fromAny(tickTransition) : null;
                this._tickTransition = tickTransition;
                return this;
            }
        };
        AxisView.prototype.onAnimate = function (t) {
            this.scale.onFrame(t);
            this.domainColor.onFrame(t);
            this.domainWidth.onFrame(t);
            this.domainSerif.onFrame(t);
            this.tickMarkColor.onFrame(t);
            this.tickMarkWidth.onFrame(t);
            this.tickMarkLength.onFrame(t);
            this.tickLabelPadding.onFrame(t);
            this.gridLineColor.onFrame(t);
            this.gridLineWidth.onFrame(t);
            this.font.onFrame(t);
            this.textColor.onFrame(t);
            if (this._tickGenerator) {
                this.generateTicks(this._tickGenerator);
                this.layoutTicks(this._bounds, this._anchor);
            }
        };
        AxisView.prototype.generateTicks = function (tickGenerator) {
            var scale = this.scale.value;
            if (this._tickSpacing) {
                var _a = scale.range(), y0 = _a[0], y1 = _a[1];
                var dy = Math.abs(y1 - y0);
                var n = Math.max(1, Math.floor(dy / this._tickSpacing));
                tickGenerator.count(n);
            }
            tickGenerator.domain(scale.domain());
            var oldTicks = this._ticks.clone();
            var tickValues = tickGenerator.generate();
            for (var i = 0, n = tickValues.length; i < n; i += 1) {
                var tickValue = tickValues[i];
                var oldTick = oldTicks.get(tickValue);
                if (oldTick) {
                    oldTicks.delete(tickValue);
                    oldTick.fadeIn(this._tickTransition || void 0);
                }
                else {
                    var newTick = this.createTickView(tickValue);
                    if (newTick) {
                        this.insertTick(newTick);
                        newTick.opacity._value = 0;
                        newTick.opacity._state = 0;
                        newTick.fadeIn(this._tickTransition || void 0);
                    }
                }
            }
            oldTicks.forEach(function (value, oldTick) {
                if (!oldTick._preserve) {
                    oldTick.fadeOut(this._tickTransition || void 0);
                }
            }, this);
        };
        AxisView.prototype.createTickView = function (tickValue) {
            var tickView;
            var viewController = this._viewController;
            if (viewController) {
                tickView = viewController.createTickView(tickValue);
            }
            if (tickView === void 0) {
                tickView = TickView.from(this.orientation, tickValue);
            }
            if (tickView) {
                var tickLabel = this.createTickLabel(tickValue, tickView);
                if (tickLabel !== null) {
                    tickView.tickLabel(tickLabel);
                    tickView._preserve = false;
                }
            }
            return tickView;
        };
        AxisView.prototype.createTickLabel = function (tickValue, tickView) {
            var tickLabel;
            var viewController = this._viewController;
            if (viewController) {
                tickLabel = viewController.createTickLabel(tickValue, tickView);
            }
            if (tickLabel === void 0) {
                if (this._tickGenerator) {
                    tickLabel = this._tickGenerator.format(tickValue);
                }
                else {
                    tickLabel = "" + tickValue;
                }
            }
            if (typeof tickLabel === "string") {
                tickLabel = this.formatTickLabel(tickLabel, tickView);
            }
            return tickLabel;
        };
        AxisView.prototype.formatTickLabel = function (tickLabel, tickView) {
            var viewController = this._viewController;
            if (viewController) {
                return viewController.formatTickLabel(tickLabel, tickView);
            }
            else {
                return tickLabel;
            }
        };
        AxisView.prototype.didRender = function (context) {
            context.save();
            var bounds = this._bounds;
            var anchor = this._anchor;
            this.renderDomain(context, bounds, anchor);
            context.restore();
        };
        AxisView.prototype.layoutTicks = function (bounds, anchor) {
            var childViews = this._childViews;
            for (var i = 0, n = childViews.length; i < n; i += 1) {
                var childView = childViews[i];
                if (childView instanceof TickView) {
                    this.layoutTick(childView, bounds, anchor);
                }
            }
        };
        AxisView.prototype.onInsertChildView = function (childView) {
            if (childView instanceof TickView) {
                this._ticks.set(childView.value, childView);
            }
        };
        AxisView.prototype.onRemoveChildView = function (childView) {
            if (childView instanceof TickView) {
                this._ticks.delete(childView.value);
            }
        };
        AxisView.prototype.setChildViewBounds = function (childView, bounds) {
            if (childView instanceof TickView) {
                this.layoutTick(childView, bounds, this._anchor);
            }
            else {
                _super.prototype.setChildViewBounds.call(this, childView, bounds);
            }
        };
        AxisView.prototype.setChildViewAnchor = function (childView, anchor) {
            if (childView instanceof TickView) {
                this.layoutTick(childView, this._bounds, anchor);
            }
            else {
                _super.prototype.setChildViewAnchor.call(this, childView, anchor);
            }
        };
        AxisView.top = function (scale) {
            scale = AxisView.scale(scale);
            return new AxisView.Top(scale);
        };
        AxisView.right = function (scale) {
            scale = AxisView.scale(scale);
            return new AxisView.Right(scale);
        };
        AxisView.bottom = function (scale) {
            scale = AxisView.scale(scale);
            return new AxisView.Bottom(scale);
        };
        AxisView.left = function (scale) {
            scale = AxisView.scale(scale);
            return new AxisView.Left(scale);
        };
        AxisView.from = function (orientation, scale) {
            if (orientation === "top") {
                return AxisView.top(scale);
            }
            else if (orientation === "right") {
                return AxisView.right(scale);
            }
            else if (orientation === "bottom") {
                return AxisView.bottom(scale);
            }
            else if (orientation === "left") {
                return AxisView.left(scale);
            }
            else {
                throw new TypeError(orientation);
            }
        };
        AxisView.fromAny = function (axis) {
            if (axis instanceof AxisView) {
                return axis;
            }
            else if (typeof axis === "object" && axis) {
                var view = AxisView.from(axis.orientation, axis.scale);
                if (axis.key !== void 0) {
                    view.key(axis.key);
                }
                var ticks = axis.ticks;
                var tickGenerator = axis.tickGenerator ? axis.tickGenerator : (ticks ? null : void 0);
                if (tickGenerator !== void 0) {
                    view.tickGenerator(tickGenerator);
                }
                if (ticks) {
                    for (var i = 0, n = ticks.length; i < n; i += 1) {
                        view.insertTick(ticks[i]);
                    }
                }
                if (axis.tickSpacing !== void 0) {
                    view.tickSpacing(axis.tickSpacing);
                }
                if (axis.tickTransition !== void 0) {
                    view.tickTransition(axis.tickTransition);
                }
                if (axis.domainColor !== void 0) {
                    view.domainColor(axis.domainColor);
                }
                if (axis.domainWidth !== void 0) {
                    view.domainWidth(axis.domainWidth);
                }
                if (axis.domainSerif !== void 0) {
                    view.domainSerif(axis.domainSerif);
                }
                if (axis.tickMarkColor !== void 0) {
                    view.tickMarkColor(axis.tickMarkColor);
                }
                if (axis.tickMarkWidth !== void 0) {
                    view.tickMarkWidth(axis.tickMarkWidth);
                }
                if (axis.tickMarkLength !== void 0) {
                    view.tickMarkLength(axis.tickMarkLength);
                }
                if (axis.tickLabelPadding !== void 0) {
                    view.tickLabelPadding(axis.tickLabelPadding);
                }
                if (axis.gridLineColor !== void 0) {
                    view.gridLineColor(axis.gridLineColor);
                }
                if (axis.gridLineWidth !== void 0) {
                    view.gridLineWidth(axis.gridLineWidth);
                }
                if (axis.font !== void 0) {
                    view.font(axis.font);
                }
                if (axis.textColor !== void 0) {
                    view.textColor(axis.textColor);
                }
                return view;
            }
            throw new TypeError("" + axis);
        };
        AxisView.scale = function (value) {
            if (value instanceof scale.ContinuousScale) {
                return value;
            }
            else if (typeof value === "string") {
                if (value === "linear") {
                    return new scale.LinearScale(0, 1, new interpolate.NumberInterpolator(0, 0));
                }
                else if (value === "time") {
                    var d1 = time.DateTime.current();
                    var d0 = d1.day(d1.day() - 1);
                    return new scale.TimeScale(d0, d1, new interpolate.NumberInterpolator(0, 0));
                }
                else {
                    var domain = value.split("...");
                    var x0 = style.StyleValue.parse(domain[0]);
                    var x1 = style.StyleValue.parse(domain[1]);
                    if (typeof x0 === "number" && typeof x1 === "number") {
                        return new scale.LinearScale(x0, x1, new interpolate.NumberInterpolator(0, 0));
                    }
                    else if (x0 instanceof time.DateTime && x1 instanceof time.DateTime) {
                        return new scale.TimeScale(x0, x1, new interpolate.NumberInterpolator(0, 0));
                    }
                }
            }
            throw new TypeError(value);
        };
        __decorate([
            view.MemberAnimator(Object)
        ], AxisView.prototype, "scale", void 0);
        __decorate([
            view.MemberAnimator(color.Color, "inherit")
        ], AxisView.prototype, "domainColor", void 0);
        __decorate([
            view.MemberAnimator(Number, "inherit")
        ], AxisView.prototype, "domainWidth", void 0);
        __decorate([
            view.MemberAnimator(Number, "inherit")
        ], AxisView.prototype, "domainSerif", void 0);
        __decorate([
            view.MemberAnimator(color.Color, "inherit")
        ], AxisView.prototype, "tickMarkColor", void 0);
        __decorate([
            view.MemberAnimator(Number, "inherit")
        ], AxisView.prototype, "tickMarkWidth", void 0);
        __decorate([
            view.MemberAnimator(Number, "inherit")
        ], AxisView.prototype, "tickMarkLength", void 0);
        __decorate([
            view.MemberAnimator(Number, "inherit")
        ], AxisView.prototype, "tickLabelPadding", void 0);
        __decorate([
            view.MemberAnimator(color.Color, "inherit")
        ], AxisView.prototype, "gridLineColor", void 0);
        __decorate([
            view.MemberAnimator(Number, "inherit")
        ], AxisView.prototype, "gridLineWidth", void 0);
        __decorate([
            view.MemberAnimator(font.Font, "inherit")
        ], AxisView.prototype, "font", void 0);
        __decorate([
            view.MemberAnimator(color.Color, "inherit")
        ], AxisView.prototype, "textColor", void 0);
        return AxisView;
    }(view.GraphicView));

    var AxisViewController = (function (_super) {
        __extends(AxisViewController, _super);
        function AxisViewController() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(AxisViewController.prototype, "orientation", {
            get: function () {
                var view = this._view;
                return view ? view.orientation : void 0;
            },
            enumerable: true,
            configurable: true
        });
        AxisViewController.prototype.createTickView = function (tickValue) {
            return void 0;
        };
        AxisViewController.prototype.createTickLabel = function (tickValue, tickView) {
            return void 0;
        };
        AxisViewController.prototype.formatTickLabel = function (tickLabel, tickView) {
            return tickLabel;
        };
        return AxisViewController;
    }(view.GraphicViewController));

    var TopAxisView = (function (_super) {
        __extends(TopAxisView, _super);
        function TopAxisView(scale) {
            return _super.call(this, scale) || this;
        }
        Object.defineProperty(TopAxisView.prototype, "orientation", {
            get: function () {
                return "top";
            },
            enumerable: true,
            configurable: true
        });
        TopAxisView.prototype.renderDomain = function (context, bounds, anchor) {
            var ax = anchor.x;
            var ay = anchor.y;
            var _a = this.scale.value.range(), x0 = _a[0], x1 = _a[1];
            var dy = this.domainSerif.value;
            context.beginPath();
            context.strokeStyle = this.domainColor.value.toString();
            context.lineWidth = this.domainWidth.value;
            if (dy) {
                context.moveTo(ax + x0, ay - dy);
                context.lineTo(ax + x0, ay);
                context.lineTo(ax + x1, ay);
                context.lineTo(ax + x1, ay - dy);
            }
            else {
                context.moveTo(ax + x0, ay);
                context.lineTo(ax + x1, ay);
            }
            context.stroke();
        };
        TopAxisView.prototype.layoutTick = function (tick, bounds, anchor) {
            var dx = this.scale.value.scale(tick.value);
            var ax = anchor.x + dx;
            var ay = anchor.y;
            var tickAnchor = new math.PointR2(ax, ay);
            tick.setBounds(bounds);
            tick.setAnchor(tickAnchor);
            tick.setCoord(dx);
        };
        return TopAxisView;
    }(AxisView));
    AxisView.Top = TopAxisView;

    var RightAxisView = (function (_super) {
        __extends(RightAxisView, _super);
        function RightAxisView(scale) {
            return _super.call(this, scale) || this;
        }
        Object.defineProperty(RightAxisView.prototype, "orientation", {
            get: function () {
                return "right";
            },
            enumerable: true,
            configurable: true
        });
        RightAxisView.prototype.renderDomain = function (context, bounds, anchor) {
            var ax = anchor.x;
            var ay = anchor.y;
            var _a = this.scale.value.range(), y0 = _a[0], y1 = _a[1];
            var dx = this.domainSerif.value;
            context.beginPath();
            context.strokeStyle = this.domainColor.value.toString();
            context.lineWidth = this.domainWidth.value;
            if (dx) {
                context.moveTo(ax + dx, ay + y0);
                context.lineTo(ax, ay + y0);
                context.lineTo(ax, ay + y1);
                context.lineTo(ax + dx, ay + y1);
            }
            else {
                context.moveTo(ax, ay + y0);
                context.lineTo(ax, ay + y1);
            }
            context.stroke();
        };
        RightAxisView.prototype.layoutTick = function (tick, bounds, anchor) {
            var dy = this.scale.value.scale(tick.value);
            var ax = anchor.x;
            var ay = anchor.y + dy;
            var tickAnchor = new math.PointR2(ax, ay);
            tick.setBounds(bounds);
            tick.setAnchor(tickAnchor);
            tick.setCoord(dy);
        };
        return RightAxisView;
    }(AxisView));
    AxisView.Right = RightAxisView;

    var BottomAxisView = (function (_super) {
        __extends(BottomAxisView, _super);
        function BottomAxisView(scale) {
            return _super.call(this, scale) || this;
        }
        Object.defineProperty(BottomAxisView.prototype, "orientation", {
            get: function () {
                return "bottom";
            },
            enumerable: true,
            configurable: true
        });
        BottomAxisView.prototype.renderDomain = function (context, bounds, anchor) {
            var ax = anchor.x;
            var ay = anchor.y;
            var _a = this.scale.value.range(), x0 = _a[0], x1 = _a[1];
            var dy = this.domainSerif.value;
            context.beginPath();
            context.strokeStyle = this.domainColor.value.toString();
            context.lineWidth = this.domainWidth.value;
            if (dy) {
                context.moveTo(ax + x0, ay + dy);
                context.lineTo(ax + x0, ay);
                context.lineTo(ax + x1, ay);
                context.lineTo(ax + x1, ay + dy);
            }
            else {
                context.moveTo(ax + x0, ay);
                context.lineTo(ax + x1, ay);
            }
            context.stroke();
        };
        BottomAxisView.prototype.layoutTick = function (tick, bounds, anchor) {
            var dx = this.scale.value.scale(tick.value);
            var ax = anchor.x + dx;
            var ay = anchor.y;
            var tickAnchor = new math.PointR2(ax, ay);
            tick.setBounds(bounds);
            tick.setAnchor(tickAnchor);
            tick.setCoord(dx);
        };
        return BottomAxisView;
    }(AxisView));
    AxisView.Bottom = BottomAxisView;

    var LeftAxisView = (function (_super) {
        __extends(LeftAxisView, _super);
        function LeftAxisView(scale) {
            return _super.call(this, scale) || this;
        }
        Object.defineProperty(LeftAxisView.prototype, "orientation", {
            get: function () {
                return "left";
            },
            enumerable: true,
            configurable: true
        });
        LeftAxisView.prototype.renderDomain = function (context, bounds, anchor) {
            var ax = anchor.x;
            var ay = anchor.y;
            var _a = this.scale.value.range(), y0 = _a[0], y1 = _a[1];
            var dx = this.domainSerif.value;
            context.beginPath();
            context.strokeStyle = this.domainColor.value.toString();
            context.lineWidth = this.domainWidth.value;
            if (dx) {
                context.moveTo(ax - dx, ay + y0);
                context.lineTo(ax, ay + y0);
                context.lineTo(ax, ay + y1);
                context.lineTo(ax - dx, ay + y1);
            }
            else {
                context.moveTo(ax, ay + y0);
                context.lineTo(ax, ay + y1);
            }
            context.stroke();
        };
        LeftAxisView.prototype.layoutTick = function (tick, bounds, anchor) {
            var dy = this.scale.value.scale(tick.value);
            var ax = anchor.x;
            var ay = anchor.y + dy;
            var tickAnchor = new math.PointR2(ax, ay);
            tick.setBounds(bounds);
            tick.setAnchor(tickAnchor);
            tick.setCoord(dy);
        };
        return LeftAxisView;
    }(AxisView));
    AxisView.Left = LeftAxisView;

    var DatumView = (function (_super) {
        __extends(DatumView, _super);
        function DatumView(x, y, key) {
            var _this = _super.call(this, key) || this;
            _this.x.setState(x);
            _this.y.setState(y);
            _this._y2Coord = null;
            _this._hitRadius = 5;
            _this._category = null;
            _this._labelPlacement = "auto";
            return _this;
        }
        Object.defineProperty(DatumView.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DatumView.prototype, "xCoord", {
            get: function () {
                return this._anchor.x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DatumView.prototype, "yCoord", {
            get: function () {
                return this._anchor.y;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DatumView.prototype, "y2Coord", {
            get: function () {
                return this._y2Coord;
            },
            enumerable: true,
            configurable: true
        });
        DatumView.prototype.hitRadius = function (hitRadius) {
            if (hitRadius === void 0) {
                return this._hitRadius;
            }
            else {
                this._hitRadius = hitRadius;
                return this;
            }
        };
        DatumView.prototype.category = function (category) {
            if (category === void 0) {
                return this._category;
            }
            else {
                this._category = category;
                return this;
            }
        };
        DatumView.prototype.label = function (label) {
            if (label === void 0) {
                return this.getChildView("label");
            }
            else {
                if (label !== null && !(label instanceof view.View)) {
                    label = typeset.TextRunView.fromAny(label);
                }
                this.setChildView("label", label);
                return this;
            }
        };
        DatumView.prototype.labelPlacement = function (labelPlacement) {
            if (labelPlacement === void 0) {
                return this._labelPlacement;
            }
            else {
                this._labelPlacement = labelPlacement;
                return this;
            }
        };
        DatumView.prototype.isGradientStop = function () {
            return !!this.color.value || typeof this.opacity.value === "number";
        };
        DatumView.prototype.onAnimate = function (t) {
            this.x.onFrame(t);
            this.y.onFrame(t);
            this.y2.onFrame(t);
            this.r.onFrame(t);
            this.color.onFrame(t);
            this.opacity.onFrame(t);
            this.labelPadding.onFrame(t);
            this.font.onFrame(t);
            this.textColor.onFrame(t);
            var label = this.label();
            if (view.RenderView.is(label)) {
                this.layoutLabel(label, this._bounds, this._anchor);
            }
        };
        DatumView.prototype.layoutLabel = function (label, bounds, anchor) {
            var placement = this._labelPlacement;
            if (placement !== "above" && placement !== "below") {
                var category = this._category;
                if (category === "increasing" || category === "maxima") {
                    placement = "above";
                }
                else if (category === "decreasing" || category === "minima") {
                    placement = "below";
                }
                else {
                    placement = "above";
                }
            }
            var padding = this.labelPadding.value.pxValue(Math.min(bounds.width, bounds.height));
            var x = anchor.x;
            var y0 = anchor.y;
            var y1 = y0;
            if (placement === "above") {
                y1 -= padding;
            }
            else if (placement === "below") {
                y1 += padding;
            }
            var labelAnchor = new math.PointR2(x, y1);
            label.setAnchor(labelAnchor);
            if (view.TypesetView.is(label)) {
                label.textAlign("center");
                label.textBaseline("bottom");
            }
        };
        DatumView.prototype.hitTest = function (x, y, context) {
            var hit = _super.prototype.hitTest.call(this, x, y, context);
            if (hit === null) {
                var bounds = this._bounds;
                var anchor = this._anchor;
                hit = this.hitTestDatum(x, y, context, bounds, anchor);
            }
            return hit;
        };
        DatumView.prototype.hitTestDatum = function (x, y, context, bounds, anchor) {
            var hitRadius = this._hitRadius;
            var radius = this.r.value;
            if (radius) {
                var bounds_1 = this.bounds;
                var size = Math.min(bounds_1.width, bounds_1.height);
                hitRadius = Math.max(hitRadius, radius.pxValue(size));
            }
            var dx = anchor.x - x;
            var dy = anchor.y - y;
            if (dx * dx + dy * dy < hitRadius * hitRadius) {
                return this;
            }
            return null;
        };
        DatumView.fromAny = function (datum) {
            if (datum instanceof DatumView) {
                return datum;
            }
            else if (typeof datum === "object" && datum) {
                var view = new DatumView(datum.x, datum.y, datum.key);
                if (datum.y2 !== void 0) {
                    view.y2(datum.y2);
                }
                if (datum.r !== void 0) {
                    view.r(datum.r);
                }
                if (datum.hitRadius !== void 0) {
                    view.hitRadius(datum.hitRadius);
                }
                if (datum.category !== void 0) {
                    view.category(datum.category);
                }
                if (datum.color !== void 0) {
                    view.color(datum.color);
                }
                if (datum.opacity !== void 0) {
                    view.opacity(datum.opacity);
                }
                if (datum.labelPadding !== void 0) {
                    view.labelPadding(datum.labelPadding);
                }
                if (datum.labelPlacement !== void 0) {
                    view.labelPlacement(datum.labelPlacement);
                }
                if (datum.font !== void 0) {
                    view.font(datum.font);
                }
                if (datum.textColor !== void 0) {
                    view.textColor(datum.textColor);
                }
                if (datum.label !== void 0) {
                    view.label(datum.label);
                }
                return view;
            }
            throw new TypeError("" + datum);
        };
        __decorate([
            view.MemberAnimator(Object)
        ], DatumView.prototype, "x", void 0);
        __decorate([
            view.MemberAnimator(Object)
        ], DatumView.prototype, "y", void 0);
        __decorate([
            view.MemberAnimator(Object)
        ], DatumView.prototype, "y2", void 0);
        __decorate([
            view.MemberAnimator(length.Length)
        ], DatumView.prototype, "r", void 0);
        __decorate([
            view.MemberAnimator(color.Color)
        ], DatumView.prototype, "color", void 0);
        __decorate([
            view.MemberAnimator(Number)
        ], DatumView.prototype, "opacity", void 0);
        __decorate([
            view.MemberAnimator(length.Length)
        ], DatumView.prototype, "labelPadding", void 0);
        __decorate([
            view.MemberAnimator(font.Font, "inherit")
        ], DatumView.prototype, "font", void 0);
        __decorate([
            view.MemberAnimator(color.Color, "inherit")
        ], DatumView.prototype, "textColor", void 0);
        return DatumView;
    }(view.GraphicView));

    var PlotView = (function (_super) {
        __extends(PlotView, _super);
        function PlotView() {
            var _this = _super.call(this) || this;
            _this._xAxis = null;
            _this._yAxis = null;
            _this._xDomain = [null, null];
            _this._xRange = [Infinity, -Infinity];
            _this._yDomain = [null, null];
            _this._yRange = [Infinity, -Infinity];
            return _this;
        }
        Object.defineProperty(PlotView.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: true,
            configurable: true
        });
        PlotView.prototype.xAxis = function (xAxis) {
            if (xAxis === void 0) {
                return this._xAxis;
            }
            else {
                this._xAxis = xAxis;
                return this;
            }
        };
        PlotView.prototype.yAxis = function (yAxis) {
            if (yAxis === void 0) {
                return this._yAxis;
            }
            else {
                this._yAxis = yAxis;
                return this;
            }
        };
        PlotView.prototype.xDomain = function () {
            return this._xDomain;
        };
        PlotView.prototype.xRange = function () {
            return this._xRange;
        };
        PlotView.prototype.yDomain = function () {
            return this._yDomain;
        };
        PlotView.prototype.yRange = function () {
            return this._yRange;
        };
        PlotView.prototype.onAnimate = function (t) {
            this.font.onFrame(t);
            this.textColor.onFrame(t);
        };
        PlotView.prototype.didAnimate = function (t) {
            if (this._xAxis && this._yAxis) {
                this.layoutData(this._xAxis.scale.value, this._yAxis.scale.value, this._bounds, this._anchor);
            }
            _super.prototype.didAnimate.call(this, t);
        };
        PlotView.prototype.layoutData = function (xScale, yScale, bounds, anchor) {
            var datum0;
            var xDomainMin;
            var xDomainMax;
            var xRangeMin;
            var xRangeMax;
            var yDomainMin;
            var yDomainMax;
            var yRangeMin;
            var yRangeMax;
            var childViews = this._childViews;
            for (var i = 0, n = childViews.length; i < n; i += 1) {
                var datum1 = childViews[i];
                if (datum1 instanceof DatumView) {
                    var x1 = datum1.x.value;
                    var y1 = datum1.y.value;
                    var ax1 = xScale.scale(x1);
                    var ay1 = yScale.scale(y1);
                    var datumAnchor = new math.PointR2(anchor.x + ax1, anchor.y + ay1);
                    datum1.setAnchor(datumAnchor);
                    if (datum0) {
                        if (util.Objects.compare(x1, xDomainMin) < 0) {
                            xDomainMin = x1;
                        }
                        else if (util.Objects.compare(x1, xDomainMax) > 0) {
                            xDomainMax = x1;
                        }
                        if (ax1 < xRangeMin) {
                            xRangeMin = ax1;
                        }
                        else if (ax1 > xRangeMax) {
                            xRangeMax = ax1;
                        }
                        if (util.Objects.compare(y1, yDomainMin) < 0) {
                            yDomainMin = y1;
                        }
                        else if (util.Objects.compare(y1, yDomainMax) > 0) {
                            yDomainMax = y1;
                        }
                        if (ay1 < yRangeMin) {
                            yRangeMin = ay1;
                        }
                        else if (ay1 > yRangeMax) {
                            yRangeMax = ay1;
                        }
                    }
                    else {
                        xDomainMin = x1;
                        xDomainMax = x1;
                        xRangeMin = ax1;
                        xRangeMax = ax1;
                        yDomainMin = y1;
                        yDomainMax = y1;
                        yRangeMin = ay1;
                        yRangeMax = ay1;
                    }
                    datum0 = datum1;
                }
            }
            if (datum0) {
                var rebound = false;
                if (this._xDomain[0] !== xDomainMin) {
                    this._xDomain[0] = xDomainMin;
                    rebound = true;
                }
                if (this._xDomain[1] !== xDomainMax) {
                    this._xDomain[1] = xDomainMax;
                    rebound = true;
                }
                if (this._xRange[0] !== xRangeMin) {
                    this._xRange[0] = xRangeMin;
                    rebound = true;
                }
                if (this._xRange[1] !== xRangeMax) {
                    this._xRange[1] = xRangeMax;
                    rebound = true;
                }
                if (this._yDomain[0] !== yDomainMin) {
                    this._yDomain[0] = yDomainMin;
                    rebound = true;
                }
                if (this._yDomain[1] !== yDomainMax) {
                    this._yDomain[1] = yDomainMax;
                    rebound = true;
                }
                if (this._yRange[0] !== yRangeMin) {
                    this._yRange[0] = yRangeMin;
                    rebound = true;
                }
                if (this._yRange[1] !== yRangeMax) {
                    this._yRange[1] = yRangeMax;
                    rebound = true;
                }
                if (rebound) {
                    this.animate();
                }
            }
        };
        PlotView.prototype.willRender = function (context) {
            _super.prototype.willRender.call(this, context);
            context.save();
            this.clipPlot(context, this._bounds);
        };
        PlotView.prototype.onRender = function (context) {
            var bounds = this._bounds;
            var anchor = this._anchor;
            this.renderPlot(context, bounds, anchor);
        };
        PlotView.prototype.didRender = function (context) {
            context.restore();
            _super.prototype.didRender.call(this, context);
        };
        PlotView.prototype.clipPlot = function (context, bounds) {
            context.beginPath();
            context.rect(bounds.x, bounds.y, bounds.width, bounds.height);
            context.clip();
        };
        PlotView.fromAny = function (plot) {
            if (plot instanceof PlotView) {
                return plot;
            }
            else if (typeof plot === "string") {
                if (plot === "bubble") {
                    return new PlotView.Bubble();
                }
                else if (plot === "line") {
                    return new PlotView.Line();
                }
                else if (plot === "area") {
                    return new PlotView.Area();
                }
            }
            else if (typeof plot === "object" && plot) {
                var type = plot.type;
                if (type === "bubble") {
                    return PlotView.Bubble.fromAny(plot);
                }
                else if (type === "line") {
                    return PlotView.Line.fromAny(plot);
                }
                else if (type === "area") {
                    return PlotView.Area.fromAny(plot);
                }
            }
            throw new TypeError("" + plot);
        };
        __decorate([
            view.MemberAnimator(font.Font, "inherit")
        ], PlotView.prototype, "font", void 0);
        __decorate([
            view.MemberAnimator(color.Color, "inherit")
        ], PlotView.prototype, "textColor", void 0);
        return PlotView;
    }(view.GraphicView));

    var PlotViewController = (function (_super) {
        __extends(PlotViewController, _super);
        function PlotViewController() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(PlotViewController.prototype, "type", {
            get: function () {
                var view = this._view;
                return view ? view.type : void 0;
            },
            enumerable: true,
            configurable: true
        });
        PlotViewController.prototype.xAxis = function () {
            var view = this._view;
            return view ? view.xAxis() : null;
        };
        PlotViewController.prototype.yAxis = function () {
            var view = this._view;
            return view ? view.yAxis() : null;
        };
        return PlotViewController;
    }(view.GraphicViewController));

    var BubblePlotView = (function (_super) {
        __extends(BubblePlotView, _super);
        function BubblePlotView() {
            var _this = _super.call(this) || this;
            _this.radius.setState(length.Length.px(5));
            _this.fill.setState(color.Color.black());
            return _this;
        }
        Object.defineProperty(BubblePlotView.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BubblePlotView.prototype, "type", {
            get: function () {
                return "bubble";
            },
            enumerable: true,
            configurable: true
        });
        BubblePlotView.prototype.getDatum = function (key) {
            var datum = this.getChildView(key);
            return datum instanceof DatumView ? datum : void 0;
        };
        BubblePlotView.prototype.insertDatum = function (datum) {
            datum = DatumView.fromAny(datum);
            this.appendChildView(datum);
            return datum;
        };
        BubblePlotView.prototype.insertData = function () {
            var data = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                data[_i] = arguments[_i];
            }
            for (var i = 0, n = arguments.length; i < n; i += 1) {
                this.insertDatum(arguments[i]);
            }
        };
        BubblePlotView.prototype.removeDatum = function (key) {
            var datum = this.getChildView(key);
            if (datum instanceof DatumView) {
                datum.remove();
                return datum;
            }
            else {
                return null;
            }
        };
        BubblePlotView.prototype.onAnimate = function (t) {
            this.radius.onFrame(t);
            this.fill.onFrame(t);
            this.stroke.onFrame(t);
            this.strokeWidth.onFrame(t);
            _super.prototype.onAnimate.call(this, t);
        };
        BubblePlotView.prototype.renderPlot = function (context, bounds, anchor) {
            var size = Math.min(bounds.width, bounds.height);
            var radius = this.radius.value;
            var fill = this.fill.value;
            var stroke = this.stroke.value;
            var strokeWidth = this.strokeWidth.value;
            var childViews = this._childViews;
            for (var i = 0, n = childViews.length; i < n; i += 1) {
                var p = childViews[i];
                if (p instanceof DatumView) {
                    context.beginPath();
                    var r = p.r.value || radius;
                    context.arc(p.xCoord, p.yCoord, r.pxValue(size), 0, 2 * Math.PI);
                    var fillStyle = p.color.value || fill;
                    if (fillStyle) {
                        var opacity = p.opacity.value;
                        if (typeof opacity === "number") {
                            fillStyle = fillStyle.alpha(opacity);
                        }
                        context.fillStyle = fillStyle.toString();
                        context.fill();
                    }
                    if (stroke) {
                        if (strokeWidth) {
                            context.lineWidth = strokeWidth.pxValue(size);
                        }
                        context.strokeStyle = stroke.toString();
                        context.stroke();
                    }
                }
            }
        };
        BubblePlotView.fromAny = function (plot) {
            if (plot instanceof BubblePlotView) {
                return plot;
            }
            else if (plot instanceof PlotView) ;
            else if (typeof plot === "object" && plot) {
                plot = plot;
                var view = new BubblePlotView();
                if (plot.key !== void 0) {
                    view.key(plot.key);
                }
                if (plot.xAxis !== void 0) {
                    view.xAxis(plot.xAxis);
                }
                if (plot.yAxis !== void 0) {
                    view.yAxis(plot.yAxis);
                }
                var data = plot.data;
                if (data) {
                    for (var i = 0, n = data.length; i < n; i += 1) {
                        view.insertDatum(data[i]);
                    }
                }
                if (plot.radius !== void 0) {
                    view.radius(plot.radius);
                }
                if (plot.fill !== void 0) {
                    view.fill(plot.fill);
                }
                if (plot.stroke !== void 0) {
                    view.stroke(plot.stroke);
                }
                if (plot.strokeWidth !== void 0) {
                    view.strokeWidth(plot.strokeWidth);
                }
                if (plot.font !== void 0) {
                    view.font(plot.font);
                }
                if (plot.textColor !== void 0) {
                    view.textColor(plot.textColor);
                }
                return view;
            }
            throw new TypeError("" + plot);
        };
        __decorate([
            view.MemberAnimator(length.Length)
        ], BubblePlotView.prototype, "radius", void 0);
        __decorate([
            view.MemberAnimator(color.Color)
        ], BubblePlotView.prototype, "fill", void 0);
        __decorate([
            view.MemberAnimator(color.Color)
        ], BubblePlotView.prototype, "stroke", void 0);
        __decorate([
            view.MemberAnimator(length.Length)
        ], BubblePlotView.prototype, "strokeWidth", void 0);
        return BubblePlotView;
    }(PlotView));
    PlotView.Bubble = BubblePlotView;

    var GraphView = (function (_super) {
        __extends(GraphView, _super);
        function GraphView() {
            var _this = _super.call(this) || this;
            _this._data = new collections.BTree();
            _this._gradientStops = 0;
            return _this;
        }
        Object.defineProperty(GraphView.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: true,
            configurable: true
        });
        GraphView.prototype.getDatum = function (x) {
            return this._data.get(x);
        };
        GraphView.prototype.insertDatum = function (datum) {
            datum = DatumView.fromAny(datum);
            this.insertChildView(datum, this._data.nextValue(datum.x.state) || null);
            return datum;
        };
        GraphView.prototype.insertData = function () {
            var data = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                data[_i] = arguments[_i];
            }
            for (var i = 0, n = arguments.length; i < n; i += 1) {
                this.insertDatum(arguments[i]);
            }
        };
        GraphView.prototype.removeDatum = function (x) {
            var datum = this._data.get(x);
            if (datum) {
                datum.remove();
                this._data.delete(x);
                return datum;
            }
            else {
                return null;
            }
        };
        GraphView.prototype.layoutData = function (xScale, yScale, bounds, anchor) {
            var datum0;
            var datum1;
            var y0;
            var y1;
            var xDomainMin;
            var xDomainMax;
            var xRangeMin;
            var xRangeMax;
            var yDomainMin;
            var yDomainMax;
            var yRangeMin;
            var yRangeMax;
            var gradientStops = 0;
            this._data.forEach(function (x2, datum2) {
                var y2 = datum2.y.value;
                var ax2 = xScale.scale(x2);
                var ay2 = yScale.scale(y2);
                var datumAnchor = new math.PointR2(anchor.x + ax2, anchor.y + ay2);
                datum2.setAnchor(datumAnchor);
                var dy2 = datum2.y2.value;
                var ady2 = dy2 !== null && dy2 !== void 0 ? yScale.scale(dy2) : null;
                datum2._y2Coord = ady2 !== null ? anchor.y + ady2 : null;
                if (datum2.isGradientStop()) {
                    gradientStops += 1;
                }
                if (datum1) {
                    var category = void 0;
                    if (datum0) {
                        if (util.Objects.compare(y0, y1) < 0 && util.Objects.compare(y1, y2) > 0) {
                            category = "maxima";
                        }
                        else if (util.Objects.compare(y0, y1) > 0 && util.Objects.compare(y1, y2) < 0) {
                            category = "minima";
                        }
                        else if (util.Objects.compare(y0, y1) < 0 && util.Objects.compare(y1, y2) < 0) {
                            category = "increasing";
                        }
                        else if (util.Objects.compare(y0, y1) > 0 && util.Objects.compare(y1, y2) > 0) {
                            category = "decreasing";
                        }
                        else {
                            category = "flat";
                        }
                    }
                    else {
                        if (util.Objects.compare(y1, y2) < 0) {
                            category = "increasing";
                        }
                        else if (util.Objects.compare(y1, y2) > 0) {
                            category = "decreasing";
                        }
                        else {
                            category = "flat";
                        }
                    }
                    datum1.category(category);
                    if (util.Objects.compare(y2, yDomainMin) < 0) {
                        yDomainMin = y2;
                    }
                    else if (util.Objects.compare(y2, yDomainMax) > 0) {
                        yDomainMax = y2;
                    }
                    if (dy2 !== null && dy2 !== void 0) {
                        if (util.Objects.compare(dy2, yDomainMin) < 0) {
                            yDomainMin = dy2;
                        }
                        else if (util.Objects.compare(dy2, yDomainMax) > 0) {
                            yDomainMax = dy2;
                        }
                    }
                    if (ay2 < yRangeMin) {
                        yRangeMin = ay2;
                    }
                    else if (ay2 > yRangeMax) {
                        yRangeMax = ay2;
                    }
                }
                else {
                    xDomainMin = x2;
                    xRangeMin = ax2;
                    yDomainMin = y2;
                    yDomainMax = y2;
                    yRangeMin = ay2;
                    yRangeMax = ay2;
                }
                datum0 = datum1;
                datum1 = datum2;
                y0 = y1;
                y1 = y2;
                xDomainMax = x2;
                xRangeMax = ax2;
            }, this);
            if (datum1) {
                var category = void 0;
                if (datum0) {
                    if (util.Objects.compare(y0, y1) < 0) {
                        category = "increasing";
                    }
                    else if (util.Objects.compare(y0, y1) > 0) {
                        category = "decreasing";
                    }
                    else {
                        category = "flat";
                    }
                }
                else {
                    category = "flat";
                }
                datum1.category(category);
                var rebound = false;
                if (this._xDomain[0] !== xDomainMin) {
                    this._xDomain[0] = xDomainMin;
                    rebound = true;
                }
                if (this._xDomain[1] !== xDomainMax) {
                    this._xDomain[1] = xDomainMax;
                    rebound = true;
                }
                if (this._xRange[0] !== xRangeMin) {
                    this._xRange[0] = xRangeMin;
                    rebound = true;
                }
                if (this._xRange[1] !== xRangeMax) {
                    this._xRange[1] = xRangeMax;
                    rebound = true;
                }
                if (this._yDomain[0] !== yDomainMin) {
                    this._yDomain[0] = yDomainMin;
                    rebound = true;
                }
                if (this._yDomain[1] !== yDomainMax) {
                    this._yDomain[1] = yDomainMax;
                    rebound = true;
                }
                if (this._yRange[0] !== yRangeMin) {
                    this._yRange[0] = yRangeMin;
                    rebound = true;
                }
                if (this._yRange[1] !== yRangeMax) {
                    this._yRange[1] = yRangeMax;
                    rebound = true;
                }
                if (rebound) {
                    this.animate();
                }
            }
            this._gradientStops = gradientStops;
        };
        GraphView.prototype.hitTest = function (x, y, context) {
            var hit = _super.prototype.hitTest.call(this, x, y, context);
            if (hit === null) {
                context.save();
                var pixelRatio = this.pixelRatio;
                x *= pixelRatio;
                y *= pixelRatio;
                var bounds = this._bounds;
                var anchor = this._anchor;
                hit = this.hitTestGraph(x, y, context, bounds, anchor);
                context.restore();
            }
            return hit;
        };
        GraphView.prototype.onInsertChildView = function (childView, targetView) {
            _super.prototype.onInsertChildView.call(this, childView, targetView);
            if (childView instanceof DatumView) {
                this._data.set(childView.x.state, childView);
            }
        };
        GraphView.prototype.onRemoveChildView = function (childView) {
            if (childView instanceof DatumView) {
                this._data.delete(childView.x.state);
            }
            _super.prototype.onRemoveChildView.call(this, childView);
        };
        GraphView.fromAny = function (plot) {
            return PlotView.fromAny(plot);
        };
        return GraphView;
    }(PlotView));

    var GraphViewController = (function (_super) {
        __extends(GraphViewController, _super);
        function GraphViewController() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(GraphViewController.prototype, "type", {
            get: function () {
                var view = this._view;
                return view ? view.type : void 0;
            },
            enumerable: true,
            configurable: true
        });
        return GraphViewController;
    }(PlotViewController));

    var LineGraphView = (function (_super) {
        __extends(LineGraphView, _super);
        function LineGraphView() {
            var _this = _super.call(this) || this;
            _this.stroke.setState(color.Color.black());
            _this.strokeWidth.setState(length.Length.px(1));
            _this._hitWidth = 5;
            return _this;
        }
        Object.defineProperty(LineGraphView.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LineGraphView.prototype, "type", {
            get: function () {
                return "line";
            },
            enumerable: true,
            configurable: true
        });
        LineGraphView.prototype.hitWidth = function (hitWidth) {
            if (hitWidth === void 0) {
                return this._hitWidth;
            }
            else {
                this._hitWidth = hitWidth;
                return this;
            }
        };
        LineGraphView.prototype.onAnimate = function (t) {
            this.stroke.onFrame(t);
            this.strokeWidth.onFrame(t);
            _super.prototype.onAnimate.call(this, t);
        };
        LineGraphView.prototype.renderPlot = function (context, bounds, anchor) {
            var data = this._data;
            var n = data.size;
            var stroke = this.stroke.value;
            var strokeWidth = this.strokeWidth.value.pxValue(Math.min(bounds.width, bounds.height));
            var gradientStops = this._gradientStops;
            var gradient;
            var x0;
            var x1;
            var dx;
            if (n > 0) {
                var p0 = data.firstValue();
                var p1 = data.lastValue();
                x0 = p0.xCoord;
                x1 = p1.xCoord;
                dx = x1 - x0;
                if (gradientStops) {
                    gradient = context.createLinearGradient(x0, 0, x1, 0);
                }
            }
            else {
                x0 = NaN;
                x1 = NaN;
                dx = NaN;
            }
            context.beginPath();
            var i = 0;
            data.forEach(function (x, p) {
                var xCoord = p.xCoord;
                var yCoord = p.yCoord;
                if (i === 0) {
                    context.moveTo(xCoord, yCoord);
                }
                else {
                    context.lineTo(xCoord, yCoord);
                }
                if (p.isGradientStop()) {
                    var color = p.color.value || stroke;
                    var opacity = p.opacity.value;
                    if (typeof opacity === "number") {
                        color = color.alpha(opacity);
                    }
                    var offset = (p.xCoord - x0) / (dx || 1);
                    gradient.addColorStop(offset, color.toString());
                }
                i += 1;
            }, this);
            context.strokeStyle = gradient ? gradient : stroke.toString();
            context.lineWidth = strokeWidth;
            context.stroke();
        };
        LineGraphView.prototype.hitTestGraph = function (x, y, context, bounds, anchor) {
            var hitWidth = this._hitWidth;
            var strokeWidth = this.strokeWidth.value;
            if (strokeWidth) {
                var bounds_1 = this.bounds;
                var size = Math.min(bounds_1.width, bounds_1.height);
                hitWidth = Math.max(hitWidth, strokeWidth.pxValue(size));
            }
            context.beginPath();
            var i = 0;
            this._data.forEach(function (x, p) {
                var xCoord = p.xCoord;
                var yCoord = p.yCoord;
                if (i === 0) {
                    context.moveTo(xCoord, yCoord);
                }
                else {
                    context.lineTo(xCoord, yCoord);
                }
                i += 1;
            }, this);
            context.lineWidth = hitWidth;
            if (context.isPointInStroke(x, y)) {
                return this;
            }
            return null;
        };
        LineGraphView.fromAny = function (graph) {
            if (graph instanceof LineGraphView) {
                return graph;
            }
            else if (graph instanceof GraphView) ;
            else if (typeof graph === "object" && graph) {
                graph = graph;
                var view = new LineGraphView();
                if (graph.key !== void 0) {
                    view.key(graph.key);
                }
                if (graph.xAxis !== void 0) {
                    view.xAxis(graph.xAxis);
                }
                if (graph.yAxis !== void 0) {
                    view.yAxis(graph.yAxis);
                }
                var data = graph.data;
                if (data) {
                    for (var i = 0, n = data.length; i < n; i += 1) {
                        view.insertDatum(data[i]);
                    }
                }
                if (graph.stroke !== void 0) {
                    view.stroke(graph.stroke);
                }
                if (graph.strokeWidth !== void 0) {
                    view.strokeWidth(graph.strokeWidth);
                }
                if (graph.hitWidth !== void 0) {
                    view.hitWidth(graph.hitWidth);
                }
                if (graph.font !== void 0) {
                    view.font(graph.font);
                }
                if (graph.textColor !== void 0) {
                    view.textColor(graph.textColor);
                }
                return view;
            }
            throw new TypeError("" + graph);
        };
        __decorate([
            view.MemberAnimator(color.Color)
        ], LineGraphView.prototype, "stroke", void 0);
        __decorate([
            view.MemberAnimator(length.Length)
        ], LineGraphView.prototype, "strokeWidth", void 0);
        return LineGraphView;
    }(GraphView));
    PlotView.Line = LineGraphView;

    var AreaGraphView = (function (_super) {
        __extends(AreaGraphView, _super);
        function AreaGraphView() {
            var _this = _super.call(this) || this;
            _this.fill.setState(color.Color.black());
            return _this;
        }
        Object.defineProperty(AreaGraphView.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AreaGraphView.prototype, "type", {
            get: function () {
                return "area";
            },
            enumerable: true,
            configurable: true
        });
        AreaGraphView.prototype.onAnimate = function (t) {
            this.fill.onFrame(t);
            _super.prototype.onAnimate.call(this, t);
        };
        AreaGraphView.prototype.renderPlot = function (context, bounds, anchor) {
            var data = this._data;
            var n = data.size;
            var fill = this.fill.value;
            var gradientStops = this._gradientStops;
            var gradient;
            context.beginPath();
            var x0;
            var x1;
            var dx;
            if (n > 0) {
                var p0 = data.firstValue();
                var p1 = data.lastValue();
                x0 = p0.xCoord;
                x1 = p1.xCoord;
                dx = x1 - x0;
                context.moveTo(p0.xCoord, p0.yCoord);
                if (gradientStops) {
                    gradient = context.createLinearGradient(x0, 0, x1, 0);
                    if (p0.isGradientStop()) {
                        var color = p0.color.value || fill;
                        var opacity = p0.opacity.value;
                        if (typeof opacity === "number") {
                            color = color.alpha(opacity);
                        }
                        gradient.addColorStop(0, color.toString());
                    }
                }
            }
            else {
                x0 = NaN;
                x1 = NaN;
                dx = NaN;
            }
            var cursor = data.values();
            cursor.next();
            while (cursor.hasNext()) {
                var p = cursor.next().value;
                context.lineTo(p.xCoord, p.yCoord);
                if (p.isGradientStop()) {
                    var color = p.color.value || fill;
                    var opacity = p.opacity.value;
                    if (typeof opacity === "number") {
                        color = color.alpha(opacity);
                    }
                    var offset = (p.xCoord - x0) / (dx || 1);
                    gradient.addColorStop(offset, color.toString());
                }
            }
            while (cursor.hasPrevious()) {
                var p = cursor.previous().value;
                context.lineTo(p.xCoord, p.y2Coord);
            }
            if (n > 0) {
                context.closePath();
            }
            context.fillStyle = gradient ? gradient : fill.toString();
            context.fill();
        };
        AreaGraphView.prototype.hitTestGraph = function (x, y, context, bounds, anchor) {
            var data = this._data;
            var n = data.size;
            context.beginPath();
            var cursor = data.values();
            if (cursor.hasNext()) {
                var p = cursor.next().value;
                context.moveTo(p.xCoord, p.yCoord);
            }
            while (cursor.hasNext()) {
                var p = cursor.next().value;
                context.lineTo(p.xCoord, p.yCoord);
            }
            while (cursor.hasPrevious()) {
                var p = cursor.previous().value;
                context.lineTo(p.xCoord, p.y2Coord);
            }
            if (n > 0) {
                context.closePath();
            }
            if (context.isPointInPath(x, y)) {
                return this;
            }
            return null;
        };
        AreaGraphView.fromAny = function (graph) {
            if (graph instanceof AreaGraphView) {
                return graph;
            }
            else if (graph instanceof GraphView) ;
            else if (typeof graph === "object" && graph) {
                graph = graph;
                var view = new AreaGraphView();
                if (graph.key !== void 0) {
                    view.key(graph.key);
                }
                if (graph.xAxis !== void 0) {
                    view.xAxis(graph.xAxis);
                }
                if (graph.yAxis !== void 0) {
                    view.yAxis(graph.yAxis);
                }
                var data = graph.data;
                if (data) {
                    for (var i = 0, n = data.length; i < n; i += 1) {
                        view.insertDatum(data[i]);
                    }
                }
                if (graph.fill !== void 0) {
                    view.fill(graph.fill);
                }
                if (graph.font !== void 0) {
                    view.font(graph.font);
                }
                if (graph.textColor !== void 0) {
                    view.textColor(graph.textColor);
                }
                return view;
            }
            throw new TypeError("" + graph);
        };
        __decorate([
            view.MemberAnimator(color.Color)
        ], AreaGraphView.prototype, "fill", void 0);
        return AreaGraphView;
    }(GraphView));
    PlotView.Area = AreaGraphView;

    var ChartView = (function (_super) {
        __extends(ChartView, _super);
        function ChartView() {
            var _this = _super.call(this) || this;
            _this.onScaleStart = _this.onScaleStart.bind(_this);
            _this.onScaleChange = _this.onScaleChange.bind(_this);
            _this.onScaleEnd = _this.onScaleEnd.bind(_this);
            _this._fitTopDomain = true;
            _this._fitRightDomain = true;
            _this._fitBottomDomain = true;
            _this._fitLeftDomain = true;
            _this._trackTopDomain = true;
            _this._trackRightDomain = true;
            _this._trackBottomDomain = true;
            _this._trackLeftDomain = true;
            _this._topDomainBounds = [true, true];
            _this._rightDomainBounds = [true, true];
            _this._bottomDomainBounds = [true, true];
            _this._leftDomainBounds = [true, true];
            _this._topDomainPadding = [null, null];
            _this._rightDomainPadding = [null, null];
            _this._bottomDomainPadding = [null, null];
            _this._leftDomainPadding = [null, null];
            _this._multitouch = null;
            _this._topGesture = null;
            _this._rightGesture = null;
            _this._bottomGesture = null;
            _this._leftGesture = null;
            _this._rescaleTransition = null;
            _this.topGutter.setState(length.Length.px(20));
            _this.rightGutter.setState(length.Length.px(40));
            _this.bottomGutter.setState(length.Length.px(20));
            _this.leftGutter.setState(length.Length.px(40));
            _this.domainColor.setState(color.Color.black());
            _this.domainWidth.setState(1);
            _this.domainSerif.setState(6);
            _this.tickMarkColor.setState(color.Color.black());
            _this.tickMarkWidth.setState(1);
            _this.tickMarkLength.setState(6);
            _this.tickLabelPadding.setState(2);
            _this.gridLineColor.setState(color.Color.transparent());
            _this.gridLineWidth.setState(0);
            _this.setChildView("surface", new view.GraphicView());
            return _this;
        }
        Object.defineProperty(ChartView.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: true,
            configurable: true
        });
        ChartView.prototype.surface = function (surface) {
            if (surface === void 0) {
                var childView = this.getChildView("surface");
                return view.RenderView.is(childView) ? childView : null;
            }
            else {
                this.setChildView("surface", surface);
                return this;
            }
        };
        ChartView.prototype.topAxis = function (topAxis) {
            if (topAxis === void 0) {
                var childView = this.getChildView("topAxis");
                return childView instanceof AxisView ? childView : null;
            }
            else {
                if (typeof topAxis === "string") {
                    topAxis = AxisView.top(topAxis);
                }
                else if (topAxis !== null) {
                    topAxis = AxisView.fromAny(topAxis);
                }
                this.setChildView("topAxis", topAxis);
                return this;
            }
        };
        ChartView.prototype.rightAxis = function (rightAxis) {
            if (rightAxis === void 0) {
                var childView = this.getChildView("rightAxis");
                return childView instanceof AxisView ? childView : null;
            }
            else {
                if (typeof rightAxis === "string") {
                    rightAxis = AxisView.right(rightAxis);
                }
                else if (rightAxis !== null) {
                    rightAxis = AxisView.fromAny(rightAxis);
                }
                this.setChildView("rightAxis", rightAxis);
                return this;
            }
        };
        ChartView.prototype.bottomAxis = function (bottomAxis) {
            if (bottomAxis === void 0) {
                var childView = this.getChildView("bottomAxis");
                return childView instanceof AxisView ? childView : null;
            }
            else {
                if (typeof bottomAxis === "string") {
                    bottomAxis = AxisView.bottom(bottomAxis);
                }
                else if (bottomAxis !== null) {
                    bottomAxis = AxisView.fromAny(bottomAxis);
                }
                this.setChildView("bottomAxis", bottomAxis);
                return this;
            }
        };
        ChartView.prototype.leftAxis = function (leftAxis) {
            if (leftAxis === void 0) {
                var childView = this.getChildView("leftAxis");
                return childView instanceof AxisView ? childView : null;
            }
            else {
                if (typeof leftAxis === "string") {
                    leftAxis = AxisView.left(leftAxis);
                }
                else if (leftAxis !== null) {
                    leftAxis = AxisView.fromAny(leftAxis);
                }
                this.setChildView("leftAxis", leftAxis);
                return this;
            }
        };
        ChartView.prototype.addPlot = function (plot) {
            plot = PlotView.fromAny(plot);
            this.appendChildView(plot);
        };
        ChartView.prototype.multitouch = function (multitouch) {
            if (multitouch === void 0) {
                return this._multitouch;
            }
            else {
                if (multitouch === true) {
                    multitouch = gesture.Multitouch.create();
                }
                else if (multitouch === false) {
                    multitouch = null;
                }
                if (this._multitouch) {
                    this._multitouch.surface(null);
                }
                this._multitouch = multitouch;
                if (this._multitouch) {
                    this._multitouch.surface(this.surface());
                }
                return this;
            }
        };
        ChartView.prototype.topGesture = function (topGesture) {
            if (topGesture === void 0) {
                return this._topGesture;
            }
            else {
                if (topGesture === true) {
                    topGesture = gesture.ScaleGesture.horizontal();
                }
                else if (topGesture === false) {
                    topGesture = null;
                }
                if (this._topGesture) {
                    this._topGesture.multitouch(null).ruler(null).scale(null);
                }
                this._topGesture = topGesture;
                if (this._topGesture) {
                    if (!this._multitouch) {
                        this.multitouch(true);
                    }
                    this._topGesture.multitouch(this._multitouch)
                        .ruler(this.surface())
                        .scale(this.topAxis().scale.value);
                    if (this._multitouch && this.isMounted()) {
                        this._topGesture.attach(this._multitouch);
                    }
                    this.reboundTop();
                }
                return this;
            }
        };
        ChartView.prototype.rightGesture = function (rightGesture) {
            if (rightGesture === void 0) {
                return this._rightGesture;
            }
            else {
                if (rightGesture === true) {
                    rightGesture = gesture.ScaleGesture.vertical();
                }
                else if (rightGesture === false) {
                    rightGesture = null;
                }
                if (this._rightGesture) {
                    this._rightGesture.multitouch(null).ruler(null).scale(null);
                }
                this._rightGesture = rightGesture;
                if (this._rightGesture) {
                    if (!this._multitouch) {
                        this.multitouch(true);
                    }
                    this._rightGesture.multitouch(this._multitouch)
                        .ruler(this.surface())
                        .scale(this.rightAxis().scale.value);
                    if (this._multitouch && this.isMounted()) {
                        this._rightGesture.attach(this._multitouch);
                    }
                    this.reboundRight();
                }
                return this;
            }
        };
        ChartView.prototype.bottomGesture = function (bottomGesture) {
            if (bottomGesture === void 0) {
                return this._bottomGesture;
            }
            else {
                if (bottomGesture === true) {
                    bottomGesture = gesture.ScaleGesture.horizontal();
                }
                else if (bottomGesture === false) {
                    bottomGesture = null;
                }
                if (this._bottomGesture) {
                    this._bottomGesture.multitouch(null).ruler(null).scale(null);
                }
                this._bottomGesture = bottomGesture;
                if (this._bottomGesture) {
                    if (!this._multitouch) {
                        this.multitouch(true);
                    }
                    this._bottomGesture.multitouch(this._multitouch)
                        .ruler(this.surface())
                        .scale(this.bottomAxis().scale.value);
                    if (this._multitouch && this.isMounted()) {
                        this._bottomGesture.attach(this._multitouch);
                    }
                    this.reboundBottom();
                }
                return this;
            }
        };
        ChartView.prototype.leftGesture = function (leftGesture) {
            if (leftGesture === void 0) {
                return this._leftGesture;
            }
            else {
                if (leftGesture === true) {
                    leftGesture = gesture.ScaleGesture.vertical();
                }
                else if (leftGesture === false) {
                    leftGesture = null;
                }
                if (this._leftGesture) {
                    this._leftGesture.multitouch(null).ruler(null).scale(null);
                }
                this._leftGesture = leftGesture;
                if (this._leftGesture) {
                    if (!this._multitouch) {
                        this.multitouch(true);
                    }
                    this._leftGesture.multitouch(this._multitouch)
                        .ruler(this.surface())
                        .scale(this.leftAxis().scale.value);
                    if (this._multitouch && this.isMounted()) {
                        this._leftGesture.attach(this._multitouch);
                    }
                    this.reboundLeft();
                }
                return this;
            }
        };
        ChartView.prototype.rescaleTransition = function (rescaleTransition) {
            if (rescaleTransition === void 0) {
                return this._rescaleTransition;
            }
            else {
                rescaleTransition = rescaleTransition !== null ? transition.Transition.fromAny(rescaleTransition) : null;
                this._rescaleTransition = rescaleTransition;
                return this;
            }
        };
        ChartView.prototype.fitTopDomain = function (fitTopDomain) {
            if (fitTopDomain === void 0) {
                return this._fitTopDomain;
            }
            else {
                if (!this._fitTopDomain && fitTopDomain) {
                    this.setDirty(true);
                }
                this._fitTopDomain = fitTopDomain;
                return this;
            }
        };
        ChartView.prototype.fitRightDomain = function (fitRightDomain) {
            if (fitRightDomain === void 0) {
                return this._fitRightDomain;
            }
            else {
                if (!this._fitRightDomain && fitRightDomain) {
                    this.setDirty(true);
                }
                this._fitRightDomain = fitRightDomain;
                return this;
            }
        };
        ChartView.prototype.fitBottomDomain = function (fitBottomDomain) {
            if (fitBottomDomain === void 0) {
                return this._fitBottomDomain;
            }
            else {
                if (!this._fitBottomDomain && fitBottomDomain) {
                    this.setDirty(true);
                }
                this._fitBottomDomain = fitBottomDomain;
                return this;
            }
        };
        ChartView.prototype.fitLeftDomain = function (fitLeftDomain) {
            if (fitLeftDomain === void 0) {
                return this._fitLeftDomain;
            }
            else {
                if (!this._fitLeftDomain && fitLeftDomain) {
                    this.setDirty(true);
                }
                this._fitLeftDomain = fitLeftDomain;
                return this;
            }
        };
        ChartView.prototype.topDomainBounds = function (topDomainBounds) {
            if (topDomainBounds === void 0) {
                return this._topDomainBounds;
            }
            else {
                this._topDomainBounds[0] = topDomainBounds[0];
                this._topDomainBounds[1] = topDomainBounds[1];
                this.reboundTop();
                return this;
            }
        };
        ChartView.prototype.rightDomainBounds = function (rightDomainBounds) {
            if (rightDomainBounds === void 0) {
                return this._rightDomainBounds;
            }
            else {
                this._rightDomainBounds[0] = rightDomainBounds[0];
                this._rightDomainBounds[1] = rightDomainBounds[1];
                this.reboundRight();
                return this;
            }
        };
        ChartView.prototype.bottomDomainBounds = function (bottomDomainBounds) {
            if (bottomDomainBounds === void 0) {
                return this._bottomDomainBounds;
            }
            else {
                this._bottomDomainBounds[0] = bottomDomainBounds[0];
                this._bottomDomainBounds[1] = bottomDomainBounds[1];
                this.reboundBottom();
                return this;
            }
        };
        ChartView.prototype.leftDomainBounds = function (leftDomainBounds) {
            if (leftDomainBounds === void 0) {
                return this._leftDomainBounds;
            }
            else {
                this._leftDomainBounds[0] = leftDomainBounds[0];
                this._leftDomainBounds[1] = leftDomainBounds[1];
                this.reboundLeft();
                return this;
            }
        };
        ChartView.prototype.topDomainPadding = function (topDomainPadding) {
            if (topDomainPadding === void 0) {
                return this._topDomainPadding;
            }
            else {
                this._topDomainPadding[0] = topDomainPadding[0];
                this._topDomainPadding[1] = topDomainPadding[1];
                this.setDirty(true);
                return this;
            }
        };
        ChartView.prototype.rightDomainPadding = function (rightDomainPadding) {
            if (rightDomainPadding === void 0) {
                return this._rightDomainPadding;
            }
            else {
                this._rightDomainPadding[0] = rightDomainPadding[0];
                this._rightDomainPadding[1] = rightDomainPadding[1];
                this.setDirty(true);
                return this;
            }
        };
        ChartView.prototype.bottomDomainPadding = function (bottomDomainPadding) {
            if (bottomDomainPadding === void 0) {
                return this._bottomDomainPadding;
            }
            else {
                this._bottomDomainPadding[0] = bottomDomainPadding[0];
                this._bottomDomainPadding[1] = bottomDomainPadding[1];
                this.setDirty(true);
                return this;
            }
        };
        ChartView.prototype.leftDomainPadding = function (leftDomainPadding) {
            if (leftDomainPadding === void 0) {
                return this._leftDomainPadding;
            }
            else {
                this._leftDomainPadding[0] = leftDomainPadding[0];
                this._leftDomainPadding[1] = leftDomainPadding[1];
                this.setDirty(true);
                return this;
            }
        };
        ChartView.prototype.topDomain = function () {
            var topDomain = [null, null];
            var topAxis = this.topAxis();
            var childViews = this._childViews;
            for (var i = 0, n = childViews.length; i < n; i += 1) {
                var childView = childViews[i];
                if (childView instanceof PlotView && childView.xAxis() === topAxis) {
                    var xDomain = childView.xDomain();
                    if (topDomain[0] === null || xDomain[0] !== null && util.Objects.compare(topDomain[0], xDomain[0]) > 0) {
                        topDomain[0] = xDomain[0];
                    }
                    if (topDomain[1] === null || xDomain[1] !== null && util.Objects.compare(topDomain[1], xDomain[1]) < 0) {
                        topDomain[1] = xDomain[1];
                    }
                }
            }
            return topDomain;
        };
        ChartView.prototype.rightDomain = function () {
            var rightDomain = [null, null];
            var rightAxis = this.rightAxis();
            var childViews = this._childViews;
            for (var i = 0, n = childViews.length; i < n; i += 1) {
                var childView = childViews[i];
                if (childView instanceof PlotView && childView.yAxis() === rightAxis) {
                    var yDomain = childView.yDomain();
                    if (rightDomain[0] === null || yDomain[0] !== null && util.Objects.compare(rightDomain[0], yDomain[0]) > 0) {
                        rightDomain[0] = yDomain[0];
                    }
                    if (rightDomain[1] === null || yDomain[1] !== null && util.Objects.compare(rightDomain[1], yDomain[1]) < 0) {
                        rightDomain[1] = yDomain[1];
                    }
                }
            }
            return rightDomain;
        };
        ChartView.prototype.bottomDomain = function () {
            var bottomDomain = [null, null];
            var bottomAxis = this.bottomAxis();
            var childViews = this._childViews;
            for (var i = 0, n = childViews.length; i < n; i += 1) {
                var childView = childViews[i];
                if (childView instanceof PlotView && childView.xAxis() === bottomAxis) {
                    var xDomain = childView.xDomain();
                    if (bottomDomain[0] === null || xDomain[0] !== null && util.Objects.compare(bottomDomain[0], xDomain[0]) > 0) {
                        bottomDomain[0] = xDomain[0];
                    }
                    if (bottomDomain[1] === null || xDomain[1] !== null && util.Objects.compare(bottomDomain[1], xDomain[1]) < 0) {
                        bottomDomain[1] = xDomain[1];
                    }
                }
            }
            return bottomDomain;
        };
        ChartView.prototype.leftDomain = function () {
            var leftDomain = [null, null];
            var leftAxis = this.leftAxis();
            var childViews = this._childViews;
            for (var i = 0, n = childViews.length; i < n; i += 1) {
                var childView = childViews[i];
                if (childView instanceof PlotView && childView.yAxis() === leftAxis) {
                    var yDomain = childView.yDomain();
                    if (leftDomain[0] === null || yDomain[0] !== null && util.Objects.compare(leftDomain[0], yDomain[0]) > 0) {
                        leftDomain[0] = yDomain[0];
                    }
                    if (leftDomain[1] === null || yDomain[1] !== null && util.Objects.compare(leftDomain[1], yDomain[1]) < 0) {
                        leftDomain[1] = yDomain[1];
                    }
                }
            }
            return leftDomain;
        };
        ChartView.prototype.topDomainPadded = function () {
            var _a = this.topDomain(), xMin = _a[0], xMax = _a[1];
            var _b = this._topDomainPadding, padMin = _b[0], padMax = _b[1];
            if (xMin !== null && padMin !== null) {
                xMin = (+xMin - +padMin);
            }
            if (xMax !== null && padMax !== null) {
                xMax = (+xMax + +padMax);
            }
            return [xMin, xMax];
        };
        ChartView.prototype.rightDomainPadded = function () {
            var _a = this.rightDomain(), yMin = _a[0], yMax = _a[1];
            var _b = this._topDomainPadding, padMin = _b[0], padMax = _b[1];
            if (yMin !== null && padMin !== null) {
                yMin = (+yMin - +padMin);
            }
            if (yMax !== null && padMax !== null) {
                yMax = (+yMax + +padMax);
            }
            return [yMin, yMax];
        };
        ChartView.prototype.bottomDomainPadded = function () {
            var _a = this.bottomDomain(), xMin = _a[0], xMax = _a[1];
            var _b = this._bottomDomainPadding, padMin = _b[0], padMax = _b[1];
            if (xMin !== null && padMin !== null) {
                xMin = (+xMin - +padMin);
            }
            if (xMax !== null && padMax !== null) {
                xMax = (+xMax + +padMax);
            }
            return [xMin, xMax];
        };
        ChartView.prototype.leftDomainPadded = function () {
            var _a = this.leftDomain(), yMin = _a[0], yMax = _a[1];
            var _b = this._leftDomainPadding, padMin = _b[0], padMax = _b[1];
            if (yMin !== null && padMin !== null) {
                yMin = (+yMin - +padMin);
            }
            if (yMax !== null && padMax !== null) {
                yMax = (+yMax + +padMax);
            }
            return [yMin, yMax];
        };
        ChartView.prototype.topRange = function () {
            var topRange = [Infinity, -Infinity];
            var topAxis = this.topAxis();
            var childViews = this._childViews;
            for (var i = 0, n = childViews.length; i < n; i += 1) {
                var childView = childViews[i];
                if (childView instanceof PlotView && childView.xAxis() === topAxis) {
                    var xRange = childView.xRange();
                    topRange[0] = Math.min(topRange[0], xRange[0]);
                    topRange[1] = Math.max(topRange[1], xRange[1]);
                }
            }
            return topRange;
        };
        ChartView.prototype.rightRange = function () {
            var rightRange = [Infinity, -Infinity];
            var rightAxis = this.rightAxis();
            var childViews = this._childViews;
            for (var i = 0, n = childViews.length; i < n; i += 1) {
                var childView = childViews[i];
                if (childView instanceof PlotView && childView.yAxis() === rightAxis) {
                    var yRange = childView.yRange();
                    rightRange[0] = Math.min(rightRange[0], yRange[0]);
                    rightRange[1] = Math.max(rightRange[1], yRange[1]);
                }
            }
            return rightRange;
        };
        ChartView.prototype.bottomRange = function () {
            var bottomRange = [Infinity, -Infinity];
            var bottomAxis = this.bottomAxis();
            var childViews = this._childViews;
            for (var i = 0, n = childViews.length; i < n; i += 1) {
                var childView = childViews[i];
                if (childView instanceof PlotView && childView.xAxis() === bottomAxis) {
                    var xRange = childView.xRange();
                    bottomRange[0] = Math.min(bottomRange[0], xRange[0]);
                    bottomRange[1] = Math.max(bottomRange[1], xRange[1]);
                }
            }
            return bottomRange;
        };
        ChartView.prototype.leftRange = function () {
            var leftRange = [Infinity, -Infinity];
            var leftAxis = this.leftAxis();
            var childViews = this._childViews;
            for (var i = 0, n = childViews.length; i < n; i += 1) {
                var childView = childViews[i];
                if (childView instanceof PlotView && childView.yAxis() === leftAxis) {
                    var yRange = childView.yRange();
                    leftRange[0] = Math.min(leftRange[0], yRange[0]);
                    leftRange[1] = Math.max(leftRange[1], yRange[1]);
                }
            }
            return leftRange;
        };
        ChartView.prototype.onMount = function () {
            if (this._multitouch) {
                this._multitouch.attach(this);
                if (this._topGesture) {
                    this._topGesture.attach(this._multitouch);
                }
                if (this._rightGesture) {
                    this._rightGesture.attach(this._multitouch);
                }
                if (this._bottomGesture) {
                    this._bottomGesture.attach(this._multitouch);
                }
                if (this._leftGesture) {
                    this._leftGesture.attach(this._multitouch);
                }
            }
            this.on("scalestart", this.onScaleStart);
            this.on("scalechange", this.onScaleChange);
            this.on("scaleend", this.onScaleEnd);
        };
        ChartView.prototype.onUnmount = function () {
            this.off("scalestart", this.onScaleStart);
            this.off("scalechange", this.onScaleChange);
            this.off("scaleend", this.onScaleEnd);
            if (this._multitouch) {
                if (this._topGesture) {
                    this._topGesture.detach(this._multitouch);
                }
                if (this._rightGesture) {
                    this._rightGesture.detach(this._multitouch);
                }
                if (this._bottomGesture) {
                    this._bottomGesture.detach(this._multitouch);
                }
                if (this._leftGesture) {
                    this._leftGesture.detach(this._multitouch);
                }
                this._multitouch.detach(this);
            }
        };
        ChartView.prototype.willAnimate = function (t) {
            _super.prototype.willAnimate.call(this, t);
            this.autoscale();
            this.rebound();
        };
        ChartView.prototype.onAnimate = function (t) {
            this.topGutter.onFrame(t);
            this.rightGutter.onFrame(t);
            this.bottomGutter.onFrame(t);
            this.leftGutter.onFrame(t);
            this.domainColor.onFrame(t);
            this.domainWidth.onFrame(t);
            this.domainSerif.onFrame(t);
            this.tickMarkColor.onFrame(t);
            this.tickMarkWidth.onFrame(t);
            this.tickMarkLength.onFrame(t);
            this.tickLabelPadding.onFrame(t);
            this.gridLineColor.onFrame(t);
            this.gridLineWidth.onFrame(t);
            this.font.onFrame(t);
            this.textColor.onFrame(t);
            if (this._topGesture) {
                this._topGesture.scale(this.topAxis().scale.value);
            }
            if (this._rightGesture) {
                this._rightGesture.scale(this.rightAxis().scale.value);
            }
            if (this._bottomGesture) {
                this._bottomGesture.scale(this.bottomAxis().scale.value);
            }
            if (this._leftGesture) {
                this._leftGesture.scale(this.leftAxis().scale.value);
            }
        };
        ChartView.prototype.layoutSurface = function (surface, bounds) {
            var topGutter = this.topGutter.value.pxValue(bounds.height);
            var rightGutter = this.rightGutter.value.pxValue(bounds.width);
            var bottomGutter = this.bottomGutter.value.pxValue(bounds.height);
            var leftGutter = this.leftGutter.value.pxValue(bounds.width);
            var xMin = bounds.xMin + leftGutter;
            var yMin = bounds.yMin + topGutter;
            var xMax = bounds.xMax - rightGutter;
            var yMax = bounds.yMax - bottomGutter;
            var xMid = (xMin + xMax) / 2;
            var yMid = (yMin + yMax) / 2;
            surface.setBounds(new math.BoxR2(xMin, yMin, xMax, yMax));
            surface.setAnchor(new math.PointR2(xMid, yMid));
        };
        ChartView.prototype.layoutAxes = function (bounds) {
            var childViews = this._childViews;
            for (var i = 0, n = childViews.length; i < n; i += 1) {
                var childView = childViews[i];
                if (childView instanceof AxisView) {
                    var childKey = childView.key();
                    if (childKey === "topAxis") {
                        this.layoutTopAxis(childView, bounds);
                    }
                    else if (childKey === "rightAxis") {
                        this.layoutRightAxis(childView, bounds);
                    }
                    else if (childKey === "bottomAxis") {
                        this.layoutBottomAxis(childView, bounds);
                    }
                    else if (childKey === "leftAxis") {
                        this.layoutLeftAxis(childView, bounds);
                    }
                }
            }
        };
        ChartView.prototype.layoutTopAxis = function (axis, bounds) {
            var topGutter = this.topGutter.value.pxValue(bounds.height);
            var rightGutter = this.rightGutter.value.pxValue(bounds.width);
            var bottomGutter = this.bottomGutter.value.pxValue(bounds.height);
            var leftGutter = this.leftGutter.value.pxValue(bounds.width);
            var anchorX = bounds.xMin + leftGutter;
            var anchorY = bounds.yMin + topGutter;
            var xMin = anchorX;
            var yMin = bounds.yMin;
            var xMax = bounds.xMax - rightGutter;
            var yMax = bounds.yMax - bottomGutter;
            axis.setBounds(new math.BoxR2(xMin, yMin, xMax, yMax));
            axis.setAnchor(new math.PointR2(anchorX, anchorY));
            axis.range(0, xMax - xMin);
        };
        ChartView.prototype.layoutRightAxis = function (axis, bounds) {
            var topGutter = this.topGutter.value.pxValue(bounds.height);
            var rightGutter = this.rightGutter.value.pxValue(bounds.width);
            var bottomGutter = this.bottomGutter.value.pxValue(bounds.height);
            var leftGutter = this.leftGutter.value.pxValue(bounds.width);
            var anchorX = Math.max(bounds.xMin + leftGutter, bounds.xMax - rightGutter);
            var anchorY = bounds.yMin + topGutter;
            var xMin = bounds.xMin + leftGutter;
            var yMin = anchorY;
            var xMax = bounds.xMax;
            var yMax = bounds.yMax - bottomGutter;
            axis.setBounds(new math.BoxR2(xMin, yMin, xMax, yMax));
            axis.setAnchor(new math.PointR2(anchorX, anchorY));
            axis.range(yMax - yMin, 0);
        };
        ChartView.prototype.layoutBottomAxis = function (axis, bounds) {
            var topGutter = this.topGutter.value.pxValue(bounds.height);
            var rightGutter = this.rightGutter.value.pxValue(bounds.width);
            var bottomGutter = this.bottomGutter.value.pxValue(bounds.height);
            var leftGutter = this.leftGutter.value.pxValue(bounds.width);
            var anchorX = bounds.xMin + leftGutter;
            var anchorY = Math.max(bounds.yMin + topGutter, bounds.yMax - bottomGutter);
            var xMin = anchorX;
            var yMin = bounds.yMin + topGutter;
            var xMax = bounds.xMax - rightGutter;
            var yMax = bounds.yMax;
            axis.setBounds(new math.BoxR2(xMin, yMin, xMax, yMax));
            axis.setAnchor(new math.PointR2(anchorX, anchorY));
            axis.range(0, xMax - xMin);
        };
        ChartView.prototype.layoutLeftAxis = function (axis, bounds) {
            var topGutter = this.topGutter.value.pxValue(bounds.height);
            var rightGutter = this.rightGutter.value.pxValue(bounds.width);
            var bottomGutter = this.bottomGutter.value.pxValue(bounds.height);
            var leftGutter = this.leftGutter.value.pxValue(bounds.width);
            var anchorX = bounds.xMin + leftGutter;
            var anchorY = bounds.yMin + topGutter;
            var xMin = bounds.xMin;
            var yMin = anchorY;
            var xMax = bounds.xMax - rightGutter;
            var yMax = bounds.yMax - bottomGutter;
            axis.setBounds(new math.BoxR2(xMin, yMin, xMax, yMax));
            axis.setAnchor(new math.PointR2(anchorX, anchorY));
            axis.range(yMax - yMin, 0);
        };
        ChartView.prototype.layoutPlot = function (plot, bounds) {
            var topGutter = this.topGutter.value.pxValue(bounds.height);
            var rightGutter = this.rightGutter.value.pxValue(bounds.width);
            var bottomGutter = this.bottomGutter.value.pxValue(bounds.height);
            var leftGutter = this.leftGutter.value.pxValue(bounds.width);
            var xMin = bounds.xMin + leftGutter;
            var yMin = bounds.yMin + topGutter;
            var xMax = bounds.xMax - rightGutter;
            var yMax = bounds.yMax - bottomGutter;
            var anchorX = xMin;
            var anchorY = yMin;
            plot.setBounds(new math.BoxR2(xMin, yMin, xMax, yMax));
            plot.setAnchor(new math.PointR2(anchorX, anchorY));
        };
        ChartView.prototype.onInsertPlot = function (plot) {
            if (!plot.xAxis() || !plot.yAxis()) {
                var childViews = this._childViews;
                for (var i = 0, n = childViews.length; i < n; i += 1) {
                    var childView = childViews[i];
                    if (childView instanceof AxisView) {
                        var childKey = childView.key();
                        if (childKey === "topAxis" && !plot.xAxis()) {
                            plot.xAxis(childView);
                        }
                        else if (childKey === "rightAxis" && !plot.yAxis()) {
                            plot.yAxis(childView);
                        }
                        else if (childKey === "bottomAxis" && !plot.xAxis()) {
                            plot.xAxis(childView);
                        }
                        else if (childKey === "leftAxis" && !plot.yAxis()) {
                            plot.yAxis(childView);
                        }
                    }
                }
            }
        };
        ChartView.prototype.onRemovePlot = function (plot) {
        };
        ChartView.prototype.onInsertChildView = function (childView) {
            var childKey = childView.key();
            if (childKey === "surface" && view.RenderView.is(childView)) {
                this.layoutSurface(childView, this._bounds);
                return;
            }
            else if (childView instanceof AxisView) {
                if (childKey === "topAxis") {
                    this.layoutTopAxis(childView, this._bounds);
                    return;
                }
                else if (childKey === "rightAxis") {
                    this.layoutRightAxis(childView, this._bounds);
                    return;
                }
                else if (childKey === "bottomAxis") {
                    this.layoutBottomAxis(childView, this._bounds);
                    return;
                }
                else if (childKey === "leftAxis") {
                    this.layoutLeftAxis(childView, this._bounds);
                    return;
                }
            }
            else if (childView instanceof PlotView) {
                this.onInsertPlot(childView);
                this.layoutPlot(childView, this._bounds);
            }
        };
        ChartView.prototype.onRemoveChildView = function (childView) {
            if (childView instanceof PlotView) {
                this.onRemovePlot(childView);
            }
        };
        ChartView.prototype.setChildViewBounds = function (childView, bounds) {
            var childKey = childView.key();
            if (childKey === "surface" && view.RenderView.is(childView)) {
                this.layoutSurface(childView, bounds);
                return;
            }
            else if (childView instanceof AxisView) {
                if (childKey === "topAxis") {
                    this.layoutTopAxis(childView, bounds);
                    return;
                }
                else if (childKey === "rightAxis") {
                    this.layoutRightAxis(childView, bounds);
                    return;
                }
                else if (childKey === "bottomAxis") {
                    this.layoutBottomAxis(childView, bounds);
                    return;
                }
                else if (childKey === "leftAxis") {
                    this.layoutLeftAxis(childView, bounds);
                    return;
                }
            }
            else if (childView instanceof PlotView) {
                this.layoutPlot(childView, bounds);
                return;
            }
            _super.prototype.setChildViewBounds.call(this, childView, bounds);
        };
        ChartView.prototype.setChildViewAnchor = function (childView, anchor) {
            var childKey = childView.key();
            if (childKey === "surface" && view.RenderView.is(childView)) {
                return;
            }
            else if (childView instanceof AxisView) {
                return;
            }
            else if (childView instanceof PlotView) {
                return;
            }
            _super.prototype.setChildViewAnchor.call(this, childView, anchor);
        };
        ChartView.prototype.autoscale = function (tween) {
            if (tween === void 0) {
                tween = this._rescaleTransition || void 0;
            }
            this.autoscaleTop(tween);
            this.autoscaleRight(tween);
            this.autoscaleBottom(tween);
            this.autoscaleLeft(tween);
        };
        ChartView.prototype.autoscaleTop = function (tween) {
            if (this._trackTopDomain) {
                var topAxis = this.topAxis();
                if (topAxis) {
                    if (tween === void 0) {
                        tween = this._rescaleTransition || void 0;
                    }
                    var _a = this.topDomainPadded(), xMin = _a[0], xMax = _a[1];
                    if (xMin !== null && xMax !== null) {
                        topAxis.domain(xMin, xMax, tween);
                    }
                }
            }
        };
        ChartView.prototype.autoscaleRight = function (tween) {
            if (this._trackRightDomain) {
                var rightAxis = this.rightAxis();
                if (rightAxis) {
                    if (tween === void 0) {
                        tween = this._rescaleTransition || void 0;
                    }
                    var _a = this.rightDomainPadded(), yMin = _a[0], yMax = _a[1];
                    if (yMin !== null && yMax !== null) {
                        rightAxis.domain(yMin, yMax, tween);
                    }
                }
            }
        };
        ChartView.prototype.autoscaleBottom = function (tween) {
            if (this._trackBottomDomain) {
                var bottomAxis = this.bottomAxis();
                if (bottomAxis) {
                    if (tween === void 0) {
                        tween = this._rescaleTransition || void 0;
                    }
                    var _a = this.bottomDomainPadded(), xMin = _a[0], xMax = _a[1];
                    if (xMin !== null && xMax !== null) {
                        bottomAxis.domain(xMin, xMax, tween);
                    }
                }
            }
        };
        ChartView.prototype.autoscaleLeft = function (tween) {
            if (this._trackLeftDomain) {
                var leftAxis = this.leftAxis();
                if (leftAxis) {
                    if (tween === void 0) {
                        tween = this._rescaleTransition || void 0;
                    }
                    var _a = this.leftDomainPadded(), yMin = _a[0], yMax = _a[1];
                    if (yMin !== null && yMax !== null) {
                        leftAxis.domain(yMin, yMax, tween);
                    }
                }
            }
        };
        ChartView.prototype.rebound = function () {
            this.reboundTop();
            this.reboundRight();
            this.reboundBottom();
            this.reboundLeft();
        };
        ChartView.prototype.reboundTop = function () {
            var topGesture = this._topGesture;
            if (topGesture) {
                var _a = this.topDomainPadded(), xMin = _a[0], xMax = _a[1];
                if (xMin !== null && xMax !== null) {
                    var _b = this._topDomainBounds, boundMin = _b[0], boundMax = _b[1];
                    if (typeof boundMin !== "boolean") {
                        xMin = (+xMin - +boundMin);
                    }
                    if (typeof boundMax !== "boolean") {
                        xMax = (+xMax + +boundMax);
                    }
                    topGesture.domainBounds(typeof boundMin !== "boolean" || boundMin ? xMin : null, typeof boundMax !== "boolean" || boundMax ? xMax : null);
                }
            }
        };
        ChartView.prototype.reboundRight = function () {
            var rightGesture = this._rightGesture;
            if (rightGesture) {
                var _a = this.rightDomainPadded(), yMin = _a[0], yMax = _a[1];
                if (yMin !== null && yMax !== null) {
                    var _b = this._rightDomainBounds, boundMin = _b[0], boundMax = _b[1];
                    if (typeof boundMin !== "boolean") {
                        yMin = (+yMin - +boundMin);
                    }
                    if (typeof boundMax !== "boolean") {
                        yMax = (+yMax + +boundMax);
                    }
                    rightGesture.domainBounds(typeof boundMin !== "boolean" || boundMin ? yMin : null, typeof boundMax !== "boolean" || boundMax ? yMax : null);
                }
            }
        };
        ChartView.prototype.reboundBottom = function () {
            var bottomGesture = this._bottomGesture;
            if (bottomGesture) {
                var _a = this.bottomDomainPadded(), xMin = _a[0], xMax = _a[1];
                if (xMin !== null && xMax !== null) {
                    var _b = this._bottomDomainBounds, boundMin = _b[0], boundMax = _b[1];
                    if (typeof boundMin !== "boolean") {
                        xMin = (+xMin - +boundMin);
                    }
                    if (typeof boundMax !== "boolean") {
                        xMax = (+xMax + +boundMax);
                    }
                    bottomGesture.domainBounds(typeof boundMin !== "boolean" || boundMin ? xMin : null, typeof boundMax !== "boolean" || boundMax ? xMax : null);
                }
            }
        };
        ChartView.prototype.reboundLeft = function () {
            var leftGesture = this._leftGesture;
            if (leftGesture) {
                var _a = this.leftDomainPadded(), yMin = _a[0], yMax = _a[1];
                if (yMin !== null && yMax !== null) {
                    var _b = this._leftDomainBounds, boundMin = _b[0], boundMax = _b[1];
                    if (typeof boundMin !== "boolean") {
                        yMin = (+yMin - +boundMin);
                    }
                    if (typeof boundMax !== "boolean") {
                        yMax = (+yMax + +boundMax);
                    }
                    leftGesture.domainBounds(typeof boundMin !== "boolean" || boundMin ? yMin : null, typeof boundMax !== "boolean" || boundMax ? yMax : null);
                }
            }
        };
        ChartView.prototype.retrackTop = function () {
            var topGesture = this._topGesture;
            if (topGesture) {
                var _a = topGesture.scale().domain(), xMin = _a[0], xMax = _a[1];
                var boundMin = topGesture.domainMin();
                var boundMax = topGesture.domainMax();
                if (xMin !== null && xMax !== null && boundMin != null && boundMax !== null) {
                    var order = util.Objects.compare(xMin, xMax);
                    if (order < 0 && util.Objects.compare(xMin, boundMin) <= 0 && util.Objects.compare(xMax, boundMax) >= 0
                        || order > 0 && util.Objects.compare(xMax, boundMin) <= 0 && util.Objects.compare(xMin, boundMax) >= 0) {
                        this._trackTopDomain = true;
                    }
                }
            }
        };
        ChartView.prototype.retrackRight = function () {
            var rightGesture = this._rightGesture;
            if (rightGesture) {
                var _a = rightGesture.scale().domain(), yMin = _a[0], yMax = _a[1];
                var boundMin = rightGesture.domainMin();
                var boundMax = rightGesture.domainMax();
                if (yMin !== null && yMax !== null && boundMin != null && boundMax !== null) {
                    var order = util.Objects.compare(yMin, yMax);
                    if (order < 0 && util.Objects.compare(yMin, boundMin) <= 0 && util.Objects.compare(yMax, boundMax) >= 0
                        || order > 0 && util.Objects.compare(yMax, boundMin) <= 0 && util.Objects.compare(yMin, boundMax) >= 0) {
                        this._trackRightDomain = true;
                    }
                }
            }
        };
        ChartView.prototype.retrackBottom = function () {
            var bottomGesture = this._bottomGesture;
            if (bottomGesture) {
                var _a = bottomGesture.scale().domain(), xMin = _a[0], xMax = _a[1];
                var boundMin = bottomGesture.domainMin();
                var boundMax = bottomGesture.domainMax();
                if (xMin !== null && xMax !== null && boundMin != null && boundMax !== null) {
                    var order = util.Objects.compare(xMin, xMax);
                    if (order < 0 && util.Objects.compare(xMin, boundMin) <= 0 && util.Objects.compare(xMax, boundMax) >= 0
                        || order > 0 && util.Objects.compare(xMax, boundMin) <= 0 && util.Objects.compare(xMin, boundMax) >= 0) {
                        this._trackBottomDomain = true;
                    }
                }
            }
        };
        ChartView.prototype.retrackLeft = function () {
            var leftGesture = this._leftGesture;
            if (leftGesture) {
                var _a = leftGesture.scale().domain(), yMin = _a[0], yMax = _a[1];
                var boundMin = leftGesture.domainMin();
                var boundMax = leftGesture.domainMax();
                if (yMin !== null && yMax !== null && boundMin != null && boundMax !== null) {
                    var order = util.Objects.compare(yMin, yMax);
                    if (order < 0 && util.Objects.compare(yMin, boundMin) <= 0 && util.Objects.compare(yMax, boundMax) >= 0
                        || order > 0 && util.Objects.compare(yMax, boundMin) <= 0 && util.Objects.compare(yMin, boundMax) >= 0) {
                        this._trackLeftDomain = true;
                    }
                }
            }
        };
        ChartView.prototype.onScaleStart = function (event) {
            if (event.gesture === this._topGesture) {
                var topAxis = this.topAxis();
                if (topAxis) {
                    topAxis.domain(event.scale.domain());
                }
                this._trackTopDomain = false;
            }
            else if (event.gesture === this._rightGesture) {
                var rightAxis = this.rightAxis();
                if (rightAxis) {
                    rightAxis.domain(event.scale.domain());
                }
                this._trackRightDomain = false;
            }
            else if (event.gesture === this._bottomGesture) {
                var bottomAxis = this.bottomAxis();
                if (bottomAxis) {
                    bottomAxis.domain(event.scale.domain());
                }
                this._trackBottomDomain = false;
            }
            else if (event.gesture === this._leftGesture) {
                var leftAxis = this.leftAxis();
                if (leftAxis) {
                    leftAxis.domain(event.scale.domain());
                }
                this._trackLeftDomain = false;
            }
        };
        ChartView.prototype.onScaleChange = function (event) {
            if (event.gesture === this._topGesture) {
                var topAxis = this.topAxis();
                if (topAxis) {
                    topAxis.domain(event.scale.domain());
                }
            }
            else if (event.gesture === this._rightGesture) {
                var rightAxis = this.rightAxis();
                if (rightAxis) {
                    rightAxis.domain(event.scale.domain());
                }
            }
            else if (event.gesture === this._bottomGesture) {
                var bottomAxis = this.bottomAxis();
                if (bottomAxis) {
                    bottomAxis.domain(event.scale.domain());
                }
            }
            else if (event.gesture === this._leftGesture) {
                var leftAxis = this.leftAxis();
                if (leftAxis) {
                    leftAxis.domain(event.scale.domain());
                }
            }
        };
        ChartView.prototype.onScaleEnd = function (event) {
            if (event.gesture === this._topGesture) {
                var topAxis = this.topAxis();
                if (topAxis) {
                    topAxis.domain(event.scale.domain());
                }
                this.retrackTop();
            }
            else if (event.gesture === this._rightGesture) {
                var rightAxis = this.rightAxis();
                if (rightAxis) {
                    rightAxis.domain(event.scale.domain());
                }
                this.retrackRight();
            }
            else if (event.gesture === this._bottomGesture) {
                var bottomAxis = this.bottomAxis();
                if (bottomAxis) {
                    bottomAxis.domain(event.scale.domain());
                }
                this.retrackBottom();
            }
            else if (event.gesture === this._leftGesture) {
                var leftAxis = this.leftAxis();
                if (leftAxis) {
                    leftAxis.domain(event.scale.domain());
                }
                this.retrackLeft();
            }
        };
        ChartView.fromAny = function (chart) {
            if (chart instanceof ChartView) {
                return chart;
            }
            else if (typeof chart === "object" && chart) {
                var view = new ChartView();
                if (chart.key !== void 0) {
                    view.key(chart.key);
                }
                if (chart.bottomAxis !== void 0) {
                    view.bottomAxis(chart.bottomAxis);
                }
                if (chart.leftAxis !== void 0) {
                    view.leftAxis(chart.leftAxis);
                }
                if (chart.topAxis !== void 0) {
                    view.topAxis(chart.topAxis);
                }
                if (chart.rightAxis !== void 0) {
                    view.rightAxis(chart.rightAxis);
                }
                var plots = chart.plots;
                if (plots) {
                    for (var i = 0, n = plots.length; i < n; i += 1) {
                        view.addPlot(plots[i]);
                    }
                }
                if (chart.fitTopDomain !== void 0) {
                    view.fitTopDomain(chart.fitTopDomain);
                }
                if (chart.fitRightDomain !== void 0) {
                    view.fitRightDomain(chart.fitRightDomain);
                }
                if (chart.fitBottomDomain !== void 0) {
                    view.fitBottomDomain(chart.fitBottomDomain);
                }
                if (chart.fitLeftDomain !== void 0) {
                    view.fitLeftDomain(chart.fitLeftDomain);
                }
                if (chart.topDomainBounds !== void 0) {
                    view.topDomainBounds(chart.topDomainBounds);
                }
                if (chart.rightDomainBounds !== void 0) {
                    view.rightDomainBounds(chart.rightDomainBounds);
                }
                if (chart.bottomDomainBounds !== void 0) {
                    view.bottomDomainBounds(chart.bottomDomainBounds);
                }
                if (chart.leftDomainBounds !== void 0) {
                    view.leftDomainBounds(chart.leftDomainBounds);
                }
                if (chart.topDomainPadding !== void 0) {
                    view.topDomainPadding(chart.topDomainPadding);
                }
                if (chart.rightDomainPadding !== void 0) {
                    view.rightDomainPadding(chart.rightDomainPadding);
                }
                if (chart.bottomDomainPadding !== void 0) {
                    view.bottomDomainPadding(chart.bottomDomainPadding);
                }
                if (chart.leftDomainPadding !== void 0) {
                    view.leftDomainPadding(chart.leftDomainPadding);
                }
                if (chart.multitouch !== void 0) {
                    view.multitouch(chart.multitouch);
                }
                if (chart.topGesture !== void 0) {
                    view.topGesture(chart.topGesture);
                }
                if (chart.rightGesture !== void 0) {
                    view.rightGesture(chart.rightGesture);
                }
                if (chart.bottomGesture !== void 0) {
                    view.bottomGesture(chart.bottomGesture);
                }
                if (chart.leftGesture !== void 0) {
                    view.leftGesture(chart.leftGesture);
                }
                if (chart.rescaleTransition !== void 0) {
                    view.rescaleTransition(chart.rescaleTransition);
                }
                if (chart.topGutter !== void 0) {
                    view.topGutter(chart.topGutter);
                }
                if (chart.rightGutter !== void 0) {
                    view.rightGutter(chart.rightGutter);
                }
                if (chart.bottomGutter !== void 0) {
                    view.bottomGutter(chart.bottomGutter);
                }
                if (chart.leftGutter !== void 0) {
                    view.leftGutter(chart.leftGutter);
                }
                if (chart.domainColor !== void 0) {
                    view.domainColor(chart.domainColor);
                }
                if (chart.domainWidth !== void 0) {
                    view.domainWidth(chart.domainWidth);
                }
                if (chart.domainSerif !== void 0) {
                    view.domainSerif(chart.domainSerif);
                }
                if (chart.tickMarkColor !== void 0) {
                    view.tickMarkColor(chart.tickMarkColor);
                }
                if (chart.tickMarkWidth !== void 0) {
                    view.tickMarkWidth(chart.tickMarkWidth);
                }
                if (chart.tickMarkLength !== void 0) {
                    view.tickMarkLength(chart.tickMarkLength);
                }
                if (chart.tickLabelPadding !== void 0) {
                    view.tickLabelPadding(chart.tickLabelPadding);
                }
                if (chart.gridLineColor !== void 0) {
                    view.gridLineColor(chart.gridLineColor);
                }
                if (chart.gridLineWidth !== void 0) {
                    view.gridLineWidth(chart.gridLineWidth);
                }
                if (chart.font !== void 0) {
                    view.font(chart.font);
                }
                if (chart.textColor !== void 0) {
                    view.textColor(chart.textColor);
                }
                return view;
            }
            throw new TypeError("" + chart);
        };
        __decorate([
            view.MemberAnimator(length.Length)
        ], ChartView.prototype, "topGutter", void 0);
        __decorate([
            view.MemberAnimator(length.Length)
        ], ChartView.prototype, "rightGutter", void 0);
        __decorate([
            view.MemberAnimator(length.Length)
        ], ChartView.prototype, "bottomGutter", void 0);
        __decorate([
            view.MemberAnimator(length.Length)
        ], ChartView.prototype, "leftGutter", void 0);
        __decorate([
            view.MemberAnimator(color.Color)
        ], ChartView.prototype, "domainColor", void 0);
        __decorate([
            view.MemberAnimator(Number)
        ], ChartView.prototype, "domainWidth", void 0);
        __decorate([
            view.MemberAnimator(Number)
        ], ChartView.prototype, "domainSerif", void 0);
        __decorate([
            view.MemberAnimator(color.Color)
        ], ChartView.prototype, "tickMarkColor", void 0);
        __decorate([
            view.MemberAnimator(Number)
        ], ChartView.prototype, "tickMarkWidth", void 0);
        __decorate([
            view.MemberAnimator(Number)
        ], ChartView.prototype, "tickMarkLength", void 0);
        __decorate([
            view.MemberAnimator(Number)
        ], ChartView.prototype, "tickLabelPadding", void 0);
        __decorate([
            view.MemberAnimator(color.Color)
        ], ChartView.prototype, "gridLineColor", void 0);
        __decorate([
            view.MemberAnimator(Number)
        ], ChartView.prototype, "gridLineWidth", void 0);
        __decorate([
            view.MemberAnimator(font.Font, "inherit")
        ], ChartView.prototype, "font", void 0);
        __decorate([
            view.MemberAnimator(color.Color, "inherit")
        ], ChartView.prototype, "textColor", void 0);
        return ChartView;
    }(view.GraphicView));

    var ChartViewController = (function (_super) {
        __extends(ChartViewController, _super);
        function ChartViewController() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ChartViewController.prototype.topAxis = function () {
            var view = this._view;
            return view ? view.topAxis() : null;
        };
        ChartViewController.prototype.rightAxis = function () {
            var view = this._view;
            return view ? view.rightAxis() : null;
        };
        ChartViewController.prototype.bottomAxis = function () {
            var view = this._view;
            return view ? view.bottomAxis() : null;
        };
        ChartViewController.prototype.leftAxis = function () {
            var view = this._view;
            return view ? view.leftAxis() : null;
        };
        return ChartViewController;
    }(view.GraphicViewController));

    var LngLat = (function () {
        function LngLat(lng, lat) {
            this._lng = lng;
            this._lat = lat;
        }
        Object.defineProperty(LngLat.prototype, "lng", {
            get: function () {
                return this._lng;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LngLat.prototype, "lat", {
            get: function () {
                return this._lat;
            },
            enumerable: true,
            configurable: true
        });
        LngLat.prototype.toAny = function () {
            return {
                lng: this._lng,
                lat: this._lat,
            };
        };
        LngLat.prototype.equals = function (that) {
            if (this === that) {
                return true;
            }
            else if (that instanceof LngLat) {
                return this._lng === that._lng && this._lat === that._lat;
            }
            return false;
        };
        LngLat.prototype.debug = function (output) {
            output = output.write("LngLat").write(46).write("from").write(40)
                .debug(this._lng).write(", ").debug(this._lat).write(41);
        };
        LngLat.prototype.toString = function () {
            return codec.Format.debug(this);
        };
        LngLat.origin = function () {
            if (!LngLat._origin) {
                LngLat._origin = new LngLat(0, 0);
            }
            return LngLat._origin;
        };
        LngLat.from = function (lng, lat) {
            return new LngLat(lng, lat);
        };
        LngLat.fromAny = function (value) {
            if (value instanceof LngLat) {
                return value;
            }
            else if (value && typeof value === "object") {
                var lng = void 0;
                var lat = void 0;
                if (Array.isArray(value)) {
                    lng = value[0];
                    lat = value[1];
                }
                else {
                    lng = value.lng;
                    lat = value.lat;
                }
                return LngLat.from(lng, lat);
            }
            throw new TypeError("" + value);
        };
        return LngLat;
    }());

    var LngLatInterpolator = (function (_super) {
        __extends(LngLatInterpolator, _super);
        function LngLatInterpolator(c0, c1) {
            var _this = _super.call(this) || this;
            if (c0 !== void 0) {
                c0 = LngLat.fromAny(c0);
            }
            if (c1 !== void 0) {
                c1 = LngLat.fromAny(c1);
            }
            if (!c0 && !c1) {
                c1 = c0 = LngLat.origin();
            }
            else if (!c1) {
                c1 = c0;
            }
            else if (!c0) {
                c0 = c1;
            }
            _this.x0 = c0.lng;
            _this.dx = c1.lng - _this.x0;
            _this.y0 = c0.lat;
            _this.dy = c1.lat - _this.y0;
            return _this;
        }
        LngLatInterpolator.prototype.interpolate = function (u) {
            var lng = this.x0 + this.dx * u;
            var lat = this.y0 + this.dy * u;
            return new LngLat(lng, lat);
        };
        LngLatInterpolator.prototype.deinterpolate = function (c) {
            c = LngLat.fromAny(c);
            var cx = c.lng - this.x0;
            var cy = c.lat - this.y0;
            var dc = cx * this.dx + cy * this.dy;
            var lc = Math.sqrt(cx * cx + cy * cy);
            return lc ? dc / lc : lc;
        };
        LngLatInterpolator.prototype.range = function (c0, c1) {
            if (c0 === void 0) {
                return [this.interpolate(0), this.interpolate(1)];
            }
            else if (c1 === void 0) {
                c0 = c0;
                return new LngLatInterpolator(c0[0], c0[1]);
            }
            else {
                return new LngLatInterpolator(c0, c1);
            }
        };
        LngLatInterpolator.prototype.equals = function (that) {
            if (this === that) {
                return true;
            }
            else if (that instanceof LngLatInterpolator) {
                return this.x0 === that.x0 && this.dx === that.dx
                    && this.y0 === that.y0 && this.dy === that.dy;
            }
            return false;
        };
        LngLatInterpolator.lngLat = function (c0, c1) {
            return new LngLatInterpolator(c0, c1);
        };
        return LngLatInterpolator;
    }(interpolate.Interpolator));
    interpolate.Interpolator.lngLat = LngLatInterpolator.lngLat;
    var InterpolatorFrom = interpolate.Interpolator.from;
    interpolate.Interpolator.from = function (a, b) {
        if (a instanceof LngLat || b instanceof LngLat) {
            return interpolate.Interpolator.lngLat(a, b);
        }
        else {
            return InterpolatorFrom(a, b);
        }
    };

    var MapProjection = {
        _identity: void 0,
        identity: function () {
            if (!MapProjection._identity) {
                MapProjection._identity = new IdentityMapProjection();
            }
            return MapProjection._identity;
        },
        is: function (object) {
            if (typeof object === "object" && object) {
                var projection = object;
                return typeof projection.project === "function"
                    && typeof projection.unproject === "function";
            }
            return false;
        },
    };
    var IdentityMapProjection = (function () {
        function IdentityMapProjection() {
        }
        Object.defineProperty(IdentityMapProjection.prototype, "bounds", {
            get: function () {
                return [LngLat.origin(), LngLat.origin()];
            },
            enumerable: true,
            configurable: true
        });
        IdentityMapProjection.prototype.project = function (lng, lat) {
            var x;
            var y;
            if (typeof lng === "number") {
                x = lng;
                y = lat;
            }
            else {
                var coord = LngLat.fromAny(lng);
                x = coord.lng;
                y = coord.lat;
            }
            return new math.PointR2(x, y);
        };
        IdentityMapProjection.prototype.unproject = function (x, y) {
            var lng;
            var lat;
            if (typeof x === "number") {
                lng = x;
                lat = y;
            }
            else {
                var point = math.PointR2.fromAny(x);
                lng = point.x;
                lat = point.y;
            }
            return new LngLat(lng, lat);
        };
        return IdentityMapProjection;
    }());

    var MapView = {
        is: function (object) {
            if (typeof object === "object" && object) {
                var view$1 = object;
                return view$1 instanceof view.View
                    && typeof view$1.setProjection === "function"
                    && typeof view$1.setZoom === "function";
            }
            return false;
        },
    };

    var MapGraphicView = (function (_super) {
        __extends(MapGraphicView, _super);
        function MapGraphicView(key) {
            if (key === void 0) { key = null; }
            var _this = _super.call(this, key) || this;
            _this._projection = MapProjection.identity();
            _this._hitBounds = null;
            _this._dirtyProjection = true;
            return _this;
        }
        Object.defineProperty(MapGraphicView.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: true,
            configurable: true
        });
        MapGraphicView.prototype.onInsertChildView = function (childView, targetView) {
            if (view.RenderView.is(childView)) {
                this.setChildViewBounds(childView, this._bounds);
                if (MapView.is(childView)) {
                    this.setChildViewProjection(childView, this._projection);
                    this.setChildViewZoom(childView, this._zoom);
                }
                if (this._culled) {
                    childView.setCulled(true);
                }
            }
        };
        MapGraphicView.prototype.project = function (lng, lat) {
            return this.projection.project.apply(this.projection, arguments);
        };
        MapGraphicView.prototype.unproject = function (x, y) {
            return this.projection.unproject.apply(this.projection, arguments);
        };
        Object.defineProperty(MapGraphicView.prototype, "projection", {
            get: function () {
                return this._projection;
            },
            enumerable: true,
            configurable: true
        });
        MapGraphicView.prototype.setProjection = function (projection) {
            var newProjection = this.willSetProjection(projection);
            if (newProjection !== void 0) {
                projection = newProjection;
            }
            this._projection = projection;
            this._dirtyProjection = true;
            this.onSetProjection(projection);
            var childViews = this.childViews;
            for (var i = 0, n = childViews.length; i < n; i += 1) {
                var childView = childViews[i];
                if (MapView.is(childView)) {
                    this.setChildViewProjection(childView, projection);
                }
            }
            this.didSetProjection(projection);
        };
        MapGraphicView.prototype.willSetProjection = function (projection) {
            var viewController = this._viewController;
            if (viewController) {
                var newProjection = viewController.viewWillSetProjection(projection, this);
                if (newProjection !== void 0) {
                    projection = newProjection;
                }
            }
            var viewObservers = this._viewObservers;
            for (var i = 0, n = viewObservers.length; i < n; i += 1) {
                var viewObserver = viewObservers[i];
                if (viewObserver.viewWillSetProjection) {
                    viewObserver.viewWillSetProjection(projection, this);
                }
            }
        };
        MapGraphicView.prototype.onSetProjection = function (projection) {
        };
        MapGraphicView.prototype.didSetProjection = function (projection) {
            this.didObserve(function (viewObserver) {
                if (viewObserver.viewDidSetProjection) {
                    viewObserver.viewDidSetProjection(projection, this);
                }
            });
        };
        MapGraphicView.prototype.setChildViewProjection = function (childView, projection) {
            childView.setProjection(projection);
        };
        Object.defineProperty(MapGraphicView.prototype, "zoom", {
            get: function () {
                return this._zoom;
            },
            enumerable: true,
            configurable: true
        });
        MapGraphicView.prototype.setZoom = function (zoom) {
            this.willSetZoom(zoom);
            var oldZoom = this._zoom;
            this._zoom = zoom;
            this.onSetZoom(zoom, oldZoom);
            var childViews = this.childViews;
            for (var i = 0, n = childViews.length; i < n; i += 1) {
                var childView = childViews[i];
                if (MapView.is(childView)) {
                    this.setChildViewZoom(childView, zoom);
                }
            }
            this.didSetZoom(zoom, oldZoom);
        };
        MapGraphicView.prototype.willSetZoom = function (zoom) {
            this.didObserve(function (viewObserver) {
                if (viewObserver.viewWillSetZoom) {
                    viewObserver.viewWillSetZoom(zoom, this);
                }
            });
        };
        MapGraphicView.prototype.onSetZoom = function (newZoom, oldZoom) {
            if (newZoom !== oldZoom) {
                this.setDirty(true);
            }
        };
        MapGraphicView.prototype.didSetZoom = function (newZoom, oldZoom) {
            this.didObserve(function (viewObserver) {
                if (viewObserver.viewDidSetZoom) {
                    viewObserver.viewDidSetZoom(newZoom, oldZoom, this);
                }
            });
        };
        MapGraphicView.prototype.setChildViewZoom = function (childView, zoom) {
            childView.setZoom(zoom);
        };
        MapGraphicView.prototype.onAnimate = function (t) {
            this.projectGeometry();
        };
        MapGraphicView.prototype.didAnimate = function (t) {
            _super.prototype.didAnimate.call(this, t);
            this._dirtyProjection = false;
        };
        MapGraphicView.prototype.onCull = function () {
            var hitBounds = this._hitBounds;
            if (hitBounds !== null) {
                var culled = !this._bounds.intersects(hitBounds);
                this.setCulled(culled);
            }
        };
        MapGraphicView.prototype.projectGeometry = function () {
            var hitBounds = null;
            var childViews = this._childViews;
            for (var i = 0, n = childViews.length; i < n; i += 1) {
                var childView = childViews[i];
                if (view.RenderView.is(childView)) {
                    var childHitBounds = childView.hitBounds;
                    if (childHitBounds) {
                        hitBounds = hitBounds ? hitBounds.union(childHitBounds) : childHitBounds;
                    }
                }
            }
            this._hitBounds = hitBounds;
        };
        Object.defineProperty(MapGraphicView.prototype, "hitBounds", {
            get: function () {
                return this._hitBounds;
            },
            enumerable: true,
            configurable: true
        });
        return MapGraphicView;
    }(view.GraphicView));

    var MapGraphicViewController = (function (_super) {
        __extends(MapGraphicViewController, _super);
        function MapGraphicViewController() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MapGraphicViewController.prototype.project = function (lng, lat) {
            return this.projection.project.apply(this.projection, arguments);
        };
        MapGraphicViewController.prototype.unproject = function (x, y) {
            return this.projection.unproject.apply(this.projection, arguments);
        };
        Object.defineProperty(MapGraphicViewController.prototype, "projection", {
            get: function () {
                var view = this._view;
                return view ? view.projection : MapProjection.identity();
            },
            enumerable: true,
            configurable: true
        });
        MapGraphicViewController.prototype.viewWillSetProjection = function (projection, view) {
        };
        MapGraphicViewController.prototype.viewDidSetProjection = function (projection, view) {
        };
        Object.defineProperty(MapGraphicViewController.prototype, "zoom", {
            get: function () {
                var view = this._view;
                return view ? view.zoom : 0;
            },
            enumerable: true,
            configurable: true
        });
        MapGraphicViewController.prototype.viewWillSetZoom = function (zoom, view) {
        };
        MapGraphicViewController.prototype.viewDidSetZoom = function (newZoom, oldZoom, view) {
        };
        return MapGraphicViewController;
    }(view.GraphicViewController));

    var MapLayerView = (function (_super) {
        __extends(MapLayerView, _super);
        function MapLayerView(key) {
            if (key === void 0) { key = null; }
            var _this = _super.call(this, key) || this;
            _this._canvas = _this.createCanvas();
            return _this;
        }
        Object.defineProperty(MapLayerView.prototype, "canvas", {
            get: function () {
                return this._canvas;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapLayerView.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: true,
            configurable: true
        });
        MapLayerView.prototype.cascadeRender = function (context) {
            var layerContext = this.getContext();
            this.willRender(context, layerContext);
            if (this._dirty) {
                this.onRender(context, layerContext);
                var childViews = this.childViews;
                for (var i = 0, n = childViews.length; i < n; i += 1) {
                    var childView = childViews[i];
                    if (view.RenderView.is(childView)) {
                        childView.cascadeRender(layerContext);
                    }
                }
            }
            this.didRender(context, layerContext);
        };
        MapLayerView.prototype.willRender = function (context, layerContext) {
            _super.prototype.willRender.call(this, context);
        };
        MapLayerView.prototype.onRender = function (context, layerContext) {
            var bounds = this._bounds;
            layerContext.clearRect(0, 0, bounds.width, bounds.height);
            _super.prototype.onRender.call(this, context);
        };
        MapLayerView.prototype.didRender = function (context, layerContext) {
            this.copyLayerImage(context, layerContext);
            _super.prototype.didRender.call(this, context);
        };
        MapLayerView.prototype.copyLayerImage = function (context, layerContext) {
            var bounds = this._bounds;
            var pixelRatio = this.pixelRatio;
            var imageData = layerContext.getImageData(0, 0, bounds.width * pixelRatio, bounds.height * pixelRatio);
            context.putImageData(imageData, bounds.x * pixelRatio, bounds.y * pixelRatio);
        };
        MapLayerView.prototype.onCull = function () {
        };
        Object.defineProperty(MapLayerView.prototype, "parentTransform", {
            get: function () {
                return transform.Transform.identity();
            },
            enumerable: true,
            configurable: true
        });
        MapLayerView.prototype.willSetBounds = function (bounds) {
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
        MapLayerView.prototype.onSetBounds = function (newBounds, oldBounds) {
            if (!newBounds.equals(oldBounds)) {
                this.resizeCanvas(this._canvas, newBounds);
                this.setDirty(true);
            }
        };
        MapLayerView.prototype.setChildViewBounds = function (childView, bounds) {
            if (bounds.x !== 0 || bounds.y !== 0) {
                var width = bounds.width;
                var height = bounds.height;
                bounds = new math.BoxR2(0, 0, width, height);
            }
            childView.setBounds(bounds);
        };
        MapLayerView.prototype.setChildViewAnchor = function (childView, anchor) {
            var bounds = this._bounds;
            var x = bounds.x;
            var y = bounds.y;
            if (x !== 0 || y !== 0) {
                anchor = new math.PointR2(anchor.x - x, anchor.y - y);
            }
            childView.setAnchor(anchor);
        };
        MapLayerView.prototype.hitTest = function (x, y, context) {
            var layerContext = this.getContext();
            var bounds = this._bounds;
            x -= bounds.x;
            y -= bounds.y;
            var hit = null;
            var childViews = this._childViews;
            for (var i = childViews.length - 1; i >= 0; i -= 1) {
                var childView = childViews[i];
                if (view.RenderView.is(childView) && childView.bounds.contains(x, y)) {
                    hit = childView.hitTest(x, y, layerContext);
                    if (hit !== null) {
                        break;
                    }
                }
            }
            return hit;
        };
        MapLayerView.prototype.getContext = function () {
            return this._canvas.getContext("2d");
        };
        MapLayerView.prototype.createCanvas = function () {
            return document.createElement("canvas");
        };
        MapLayerView.prototype.resizeCanvas = function (node, bounds) {
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
        return MapLayerView;
    }(MapGraphicView));

    var MapLayerViewController = (function (_super) {
        __extends(MapLayerViewController, _super);
        function MapLayerViewController() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return MapLayerViewController;
    }(MapGraphicViewController));

    var MapLineView = (function (_super) {
        __extends(MapLineView, _super);
        function MapLineView(start, end) {
            if (start === void 0) { start = LngLat.origin(); }
            if (end === void 0) { end = LngLat.origin(); }
            var _this = _super.call(this) || this;
            _this.start.setState(start);
            _this.end.setState(end);
            _this._startPoint = math.PointR2.origin();
            _this._endPoint = math.PointR2.origin();
            _this._hitWidth = 0;
            return _this;
        }
        Object.defineProperty(MapLineView.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: true,
            configurable: true
        });
        MapLineView.prototype.hitWidth = function (hitWidth) {
            if (hitWidth === void 0) {
                return this._hitWidth;
            }
            else {
                this._hitWidth = hitWidth;
                return this;
            }
        };
        MapLineView.prototype.onAnimate = function (t) {
            var oldStart = this.start.value;
            this.start.onFrame(t);
            var newStart = this.start.value;
            var oldEnd = this.end.value;
            this.end.onFrame(t);
            var newEnd = this.end.value;
            this.stroke.onFrame(t);
            this.strokeWidth.onFrame(t);
            if (this._dirtyProjection || oldStart !== newStart || oldEnd !== newEnd) {
                this.projectGeometry();
            }
        };
        MapLineView.prototype.onRender = function (context) {
            context.save();
            var bounds = this._bounds;
            var anchor = this._anchor;
            this.renderLine(context, bounds, anchor);
            context.restore();
        };
        MapLineView.prototype.renderLine = function (context, bounds, anchor) {
            var stroke = this.stroke.value;
            if (stroke) {
                var strokeWidth = this.strokeWidth.value;
                if (strokeWidth) {
                    var start = this._startPoint;
                    var end = this._endPoint;
                    context.beginPath();
                    context.moveTo(start.x, start.y);
                    context.lineTo(end.x, end.y);
                    var size = Math.min(bounds.width, bounds.height);
                    context.lineWidth = strokeWidth.pxValue(size);
                    context.strokeStyle = stroke.toString();
                    context.stroke();
                }
            }
        };
        MapLineView.prototype.onCull = function () {
            var bounds = this._bounds;
            var start = this._startPoint;
            var end = this._endPoint;
            var invalid = !isFinite(start.x) || isFinite(start.y)
                || !isFinite(end.x) || !isFinite(end.y);
            var culled = invalid || !bounds.intersectsSegment(new math.SegmentR2(start.x, start.y, end.x, end.y));
            this.setCulled(culled);
        };
        MapLineView.prototype.projectGeometry = function () {
            var start = this.project(this.start.value);
            var end = this.project(this.end.value);
            var anchor = new math.PointR2((start.x + end.x) / 2, (start.y + end.y) / 2);
            this._startPoint = start;
            this._endPoint = end;
            this._hitBounds = new math.BoxR2(Math.min(start.x, end.x), Math.min(start.y, end.y), Math.max(start.x, end.x), Math.max(start.y, end.y));
            this.setAnchor(anchor);
        };
        MapLineView.prototype.hitTest = function (x, y, context) {
            var hit = _super.prototype.hitTest.call(this, x, y, context);
            if (hit === null) {
                context.save();
                var pixelRatio = this.pixelRatio;
                x *= pixelRatio;
                y *= pixelRatio;
                var bounds = this._bounds;
                var anchor = this._anchor;
                hit = this.hitTestLine(x, y, context, bounds, anchor);
                context.restore();
            }
            return hit;
        };
        MapLineView.prototype.hitTestLine = function (x, y, context, bounds, anchor) {
            var start = this._startPoint;
            var end = this._endPoint;
            var hitWidth = this._hitWidth;
            var strokeWidth = this.strokeWidth.value;
            if (strokeWidth) {
                var size = Math.min(bounds.width, bounds.height);
                hitWidth = Math.max(hitWidth, strokeWidth.pxValue(size));
            }
            context.beginPath();
            context.moveTo(start.x, start.y);
            context.lineTo(end.x, end.y);
            context.lineWidth = hitWidth;
            if (context.isPointInStroke(x, y)) {
                return this;
            }
            return null;
        };
        MapLineView.fromAny = function (line) {
            if (line instanceof MapLineView) {
                return line;
            }
            else if (typeof line === "object" && line) {
                var view = new MapLineView();
                if (line.key !== void 0) {
                    view.key(line.key);
                }
                if (line.start !== void 0) {
                    view.start(line.start);
                }
                if (line.end !== void 0) {
                    view.end(line.end);
                }
                if (line.stroke !== void 0) {
                    view.stroke(line.stroke);
                }
                if (line.strokeWidth !== void 0) {
                    view.strokeWidth(line.strokeWidth);
                }
                if (line.hitWidth !== void 0) {
                    view.hitWidth(line.hitWidth);
                }
                return view;
            }
            throw new TypeError("" + line);
        };
        __decorate([
            view.MemberAnimator(LngLat)
        ], MapLineView.prototype, "start", void 0);
        __decorate([
            view.MemberAnimator(LngLat)
        ], MapLineView.prototype, "end", void 0);
        __decorate([
            view.MemberAnimator(color.Color, "inherit")
        ], MapLineView.prototype, "stroke", void 0);
        __decorate([
            view.MemberAnimator(length.Length, "inherit")
        ], MapLineView.prototype, "strokeWidth", void 0);
        return MapLineView;
    }(MapGraphicView));

    var MapCircleView = (function (_super) {
        __extends(MapCircleView, _super);
        function MapCircleView(center, radius) {
            if (center === void 0) { center = LngLat.origin(); }
            if (radius === void 0) { radius = length.Length.zero(); }
            var _this = _super.call(this) || this;
            _this.center.setState(center);
            _this.radius.setState(radius);
            _this._hitRadius = 0;
            return _this;
        }
        Object.defineProperty(MapCircleView.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: true,
            configurable: true
        });
        MapCircleView.prototype.hitRadius = function (hitRadius) {
            if (hitRadius === void 0) {
                return this._hitRadius;
            }
            else {
                this._hitRadius = hitRadius;
                return this;
            }
        };
        MapCircleView.prototype.onAnimate = function (t) {
            var oldCenter = this.center.value;
            this.center.onFrame(t);
            var newCenter = this.center.value;
            this.radius.onFrame(t);
            this.fill.onFrame(t);
            this.stroke.onFrame(t);
            this.strokeWidth.onFrame(t);
            if (this._dirtyProjection || oldCenter !== newCenter) {
                this.projectGeometry();
            }
        };
        MapCircleView.prototype.onRender = function (context) {
            context.save();
            var bounds = this._bounds;
            var anchor = this._anchor;
            this.renderCircle(context, bounds, anchor);
            context.restore();
        };
        MapCircleView.prototype.renderCircle = function (context, bounds, anchor) {
            var size = Math.min(bounds.width, bounds.height);
            context.beginPath();
            var radius = this.radius.value.pxValue(size);
            context.arc(anchor.x, anchor.y, radius, 0, 2 * Math.PI);
            var fill = this.fill.value;
            if (fill) {
                context.fillStyle = fill.toString();
                context.fill();
            }
            var stroke = this.stroke.value;
            if (stroke) {
                var strokeWidth = this.strokeWidth.value;
                if (strokeWidth) {
                    context.lineWidth = strokeWidth.pxValue(size);
                }
                context.strokeStyle = stroke.toString();
                context.stroke();
            }
        };
        MapCircleView.prototype.onCull = function () {
            var bounds = this._bounds;
            var anchor = this._anchor;
            var size = Math.min(bounds.width, bounds.height);
            var radius = this.radius.value.pxValue(size);
            var invalid = !isFinite(anchor.x) || !isFinite(anchor.y) || !isFinite(radius);
            var culled = invalid || !bounds.intersectsCircle(new math.CircleR2(anchor.x, anchor.y, radius));
            this.setCulled(culled);
        };
        Object.defineProperty(MapCircleView.prototype, "popoverBounds", {
            get: function () {
                var inversePageTransform = this.pageTransform.inverse();
                var hitBounds = this._hitBounds;
                if (hitBounds !== null) {
                    return hitBounds.transform(inversePageTransform);
                }
                else {
                    var pageAnchor = this.anchor.transform(inversePageTransform);
                    var pageX = Math.round(pageAnchor.x);
                    var pageY = Math.round(pageAnchor.y);
                    return new math.BoxR2(pageX, pageY, pageX, pageY);
                }
            },
            enumerable: true,
            configurable: true
        });
        MapCircleView.prototype.projectGeometry = function () {
            var bounds = this._bounds;
            var anchor = this.project(this.center.value);
            var size = Math.min(bounds.width, bounds.height);
            var radius = this.radius.value.pxValue(size);
            var hitRadius = Math.max(this._hitRadius, radius);
            this._hitBounds = new math.BoxR2(anchor.x - hitRadius, anchor.y - hitRadius, anchor.x + hitRadius, anchor.y + hitRadius);
            this.setAnchor(anchor);
        };
        MapCircleView.prototype.hitTest = function (x, y, context) {
            var hit = _super.prototype.hitTest.call(this, x, y, context);
            if (hit === null) {
                var bounds = this._bounds;
                var anchor = this._anchor;
                hit = this.hitTestCircle(x, y, context, bounds, anchor);
            }
            return hit;
        };
        MapCircleView.prototype.hitTestCircle = function (x, y, context, bounds, anchor) {
            var size = Math.min(bounds.width, bounds.height);
            var radius = this.radius.value.pxValue(size);
            if (this.fill.value) {
                var hitRadius = Math.max(this._hitRadius, radius);
                var dx = anchor.x - x;
                var dy = anchor.y - y;
                if (dx * dx + dy * dy < hitRadius * hitRadius) {
                    return this;
                }
            }
            var strokeWidth = this.strokeWidth.value;
            if (this.stroke.value && strokeWidth) {
                var pixelRatio = this.pixelRatio;
                x *= pixelRatio;
                y *= pixelRatio;
                context.save();
                context.beginPath();
                context.arc(anchor.x, anchor.y, radius, 0, 2 * Math.PI);
                context.lineWidth = strokeWidth.pxValue(size);
                if (context.isPointInStroke(x, y)) {
                    context.restore();
                    return this;
                }
                else {
                    context.restore();
                }
            }
            return null;
        };
        MapCircleView.fromAny = function (circle) {
            if (circle instanceof MapCircleView) {
                return circle;
            }
            else if (typeof circle === "object" && circle) {
                var view = new MapCircleView();
                if (circle.key !== void 0) {
                    view.key(circle.key);
                }
                if (circle.center !== void 0) {
                    view.center(circle.center);
                }
                if (circle.radius !== void 0) {
                    view.radius(circle.radius);
                }
                if (circle.hitRadius !== void 0) {
                    view.hitRadius(circle.hitRadius);
                }
                if (circle.fill !== void 0) {
                    view.fill(circle.fill);
                }
                if (circle.stroke !== void 0) {
                    view.stroke(circle.stroke);
                }
                if (circle.strokeWidth !== void 0) {
                    view.strokeWidth(circle.strokeWidth);
                }
                return view;
            }
            throw new TypeError("" + circle);
        };
        __decorate([
            view.MemberAnimator(LngLat)
        ], MapCircleView.prototype, "center", void 0);
        __decorate([
            view.MemberAnimator(length.Length)
        ], MapCircleView.prototype, "radius", void 0);
        __decorate([
            view.MemberAnimator(color.Color, "inherit")
        ], MapCircleView.prototype, "fill", void 0);
        __decorate([
            view.MemberAnimator(color.Color, "inherit")
        ], MapCircleView.prototype, "stroke", void 0);
        __decorate([
            view.MemberAnimator(length.Length, "inherit")
        ], MapCircleView.prototype, "strokeWidth", void 0);
        return MapCircleView;
    }(MapGraphicView));

    var MapPolygonView = (function (_super) {
        __extends(MapPolygonView, _super);
        function MapPolygonView() {
            var _this = _super.call(this) || this;
            _this._coords = [];
            _this._points = [];
            return _this;
        }
        Object.defineProperty(MapPolygonView.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapPolygonView.prototype, "coords", {
            get: function () {
                return this._coords;
            },
            enumerable: true,
            configurable: true
        });
        MapPolygonView.prototype.setCoords = function (coords, tween) {
            var i = 0;
            for (var n = Math.min(this._coords.length, coords.length); i < n; i += 1) {
                var coord = LngLat.fromAny(coords[i]);
                this._coords[i].setState(coord, tween);
            }
            for (var n = coords.length; i < n; i += 1) {
                var coord = LngLat.fromAny(coords[i]);
                this._coords.push(new view.AnyMemberAnimator(LngLat, this, coord));
                this._points.push(math.PointR2.origin());
                this.setDirty(true);
            }
            this._coords.length = coords.length;
        };
        Object.defineProperty(MapPolygonView.prototype, "points", {
            get: function () {
                return this._points;
            },
            enumerable: true,
            configurable: true
        });
        MapPolygonView.prototype.appendCoord = function (coord) {
            coord = LngLat.fromAny(coord);
            this._coords.push(new view.AnyMemberAnimator(LngLat, this, coord));
            this._points.push(math.PointR2.origin());
            this.setDirty(true);
        };
        MapPolygonView.prototype.insertCoord = function (index, coord) {
            coord = LngLat.fromAny(coord);
            this._coords.splice(index, 0, new view.AnyMemberAnimator(LngLat, this, coord));
            this._points.splice(index, 0, math.PointR2.origin());
            this.setDirty(true);
        };
        MapPolygonView.prototype.removeCoord = function (index) {
            this._coords.splice(index, 1);
            this._points.splice(index, 1);
        };
        MapPolygonView.prototype.onAnimate = function (t) {
            var moved = false;
            var coords = this._coords;
            for (var i = 0, n = coords.length; i < n; i += 1) {
                var point = coords[i];
                var oldPoint = point.value;
                point.onFrame(t);
                var newPoint = point.value;
                if (oldPoint !== newPoint) {
                    moved = true;
                }
            }
            this.fill.onFrame(t);
            this.stroke.onFrame(t);
            this.strokeWidth.onFrame(t);
            if (this._dirtyProjection || moved) {
                this.projectGeometry();
            }
        };
        MapPolygonView.prototype.onRender = function (context) {
            context.save();
            var bounds = this._bounds;
            var anchor = this._anchor;
            this.renderPolygon(context, bounds, anchor);
            context.restore();
        };
        MapPolygonView.prototype.renderPolygon = function (context, bounds, anchor) {
            var points = this._points;
            var n = points.length;
            if (n > 0) {
                context.beginPath();
                var start = points[0];
                context.moveTo(start.x, start.y);
                for (var i = 1; i < n; i += 1) {
                    var point = points[i];
                    context.lineTo(point.x, point.y);
                }
                context.closePath();
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
                        context.strokeStyle = stroke.toString();
                        context.stroke();
                    }
                }
            }
        };
        MapPolygonView.prototype.onCull = function () {
            var hitBounds = this._hitBounds;
            if (hitBounds !== null) {
                var bounds = this._bounds;
                var contained = bounds.xMin - bounds.width <= hitBounds.xMin
                    && hitBounds.xMax <= bounds.xMax + bounds.width
                    && bounds.yMin - bounds.height <= hitBounds.yMin
                    && hitBounds.yMax <= bounds.yMax + bounds.height;
                var culled = !contained || !bounds.intersects(hitBounds);
                this.setCulled(culled);
            }
            else {
                this.setCulled(true);
            }
        };
        MapPolygonView.prototype.projectGeometry = function () {
            var coords = this._coords;
            var points = this._points;
            var n = coords.length;
            var cx = 0;
            var cy = 0;
            var hitBounds = null;
            if (n > 0) {
                var invalid = false;
                var xMin = Infinity;
                var yMin = Infinity;
                var xMax = -Infinity;
                var yMax = -Infinity;
                for (var i = 0; i < n; i += 1) {
                    var coord = coords[i].value;
                    var point = this.project(coord);
                    points[i] = point;
                    cx += point.x;
                    cy += point.y;
                    invalid = invalid || !isFinite(point.x) || !isFinite(point.y);
                    xMin = Math.min(xMin, point.x);
                    yMin = Math.min(yMin, point.y);
                    xMax = Math.max(point.x, xMax);
                    yMax = Math.max(point.y, yMax);
                }
                cx /= n;
                cy /= n;
                if (!invalid) {
                    hitBounds = new math.BoxR2(xMin, yMin, xMax, yMax);
                }
            }
            this._hitBounds = hitBounds;
            this.setAnchor(new math.PointR2(cx, cy));
        };
        MapPolygonView.prototype.hitTest = function (x, y, context) {
            var hit = _super.prototype.hitTest.call(this, x, y, context);
            if (hit === null) {
                context.save();
                var pixelRatio = this.pixelRatio;
                x *= pixelRatio;
                y *= pixelRatio;
                var bounds = this._bounds;
                var anchor = this._anchor;
                hit = this.hitTestPolygon(x, y, context, bounds, anchor);
                context.restore();
            }
            return hit;
        };
        MapPolygonView.prototype.hitTestPolygon = function (x, y, context, bounds, anchor) {
            var points = this._points;
            var n = points.length;
            if (n > 0) {
                context.beginPath();
                var start = points[0];
                context.moveTo(start.x, start.y);
                for (var i = 1; i < n; i += 1) {
                    var point = points[i];
                    context.lineTo(point.x, point.y);
                }
                context.closePath();
                if (this.fill.value && context.isPointInPath(x, y)) {
                    return this;
                }
                if (this.stroke.value) {
                    var strokeWidth = this.strokeWidth.value;
                    if (strokeWidth) {
                        var size = Math.min(bounds.width, bounds.height);
                        context.lineWidth = strokeWidth.pxValue(size);
                        if (context.isPointInStroke(x, y)) {
                            return this;
                        }
                    }
                }
            }
            return null;
        };
        MapPolygonView.fromAny = function (polygon) {
            if (polygon instanceof MapPolygonView) {
                return polygon;
            }
            else if (typeof polygon === "object" && polygon) {
                var view = new MapPolygonView();
                if (polygon.key !== void 0) {
                    view.key(polygon.key);
                }
                if (polygon.fill !== void 0) {
                    view.fill(polygon.fill);
                }
                if (polygon.stroke !== void 0) {
                    view.stroke(polygon.stroke);
                }
                if (polygon.strokeWidth !== void 0) {
                    view.strokeWidth(polygon.strokeWidth);
                }
                var coords = polygon.coords;
                if (coords !== void 0) {
                    for (var i = 0, n = coords.length; i < n; i += 1) {
                        view.appendCoord(coords[i]);
                    }
                }
                return view;
            }
            throw new TypeError("" + polygon);
        };
        __decorate([
            view.MemberAnimator(color.Color, "inherit")
        ], MapPolygonView.prototype, "fill", void 0);
        __decorate([
            view.MemberAnimator(color.Color, "inherit")
        ], MapPolygonView.prototype, "stroke", void 0);
        __decorate([
            view.MemberAnimator(length.Length, "inherit")
        ], MapPolygonView.prototype, "strokeWidth", void 0);
        return MapPolygonView;
    }(MapGraphicView));

    var MapboxProjection = (function () {
        function MapboxProjection(map) {
            this._map = map;
        }
        Object.defineProperty(MapboxProjection.prototype, "map", {
            get: function () {
                return this._map;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapboxProjection.prototype, "bounds", {
            get: function () {
                var mapBounds = this._map.getBounds();
                return [new LngLat(mapBounds.getWest(), mapBounds.getSouth()),
                    new LngLat(mapBounds.getEast(), mapBounds.getNorth())];
            },
            enumerable: true,
            configurable: true
        });
        MapboxProjection.prototype.project = function (lng, lat) {
            var coord;
            if (typeof lng === "number") {
                coord = new mapboxgl.LngLat(lng, lat);
            }
            else {
                coord = lng;
            }
            var _a = this._map.project(coord), x = _a.x, y = _a.y;
            return new math.PointR2(x, y);
        };
        MapboxProjection.prototype.unproject = function (x, y) {
            var point;
            if (typeof x === "number") {
                point = new mapboxgl.Point(x, y);
            }
            else if (Array.isArray(x)) {
                point = x;
            }
            else {
                point = new mapboxgl.Point(x.x, x.y);
            }
            var _a = this._map.unproject(point), lng = _a.lng, lat = _a.lat;
            return new LngLat(lng, lat);
        };
        return MapboxProjection;
    }());

    var MapboxView = (function (_super) {
        __extends(MapboxView, _super);
        function MapboxView(map, key) {
            if (key === void 0) { key = null; }
            var _this = _super.call(this, key) || this;
            _this.doZoom = _this.doZoom.bind(_this);
            _this.onMapLoad = _this.onMapLoad.bind(_this);
            _this.onMapRender = _this.onMapRender.bind(_this);
            _this.onMapZoom = _this.onMapZoom.bind(_this);
            _this._map = map;
            _this._projection = new MapboxProjection(_this._map);
            _this._zoom = map.getZoom();
            _this._zoomTimer = 0;
            _this.initMap(_this._map);
            return _this;
        }
        Object.defineProperty(MapboxView.prototype, "map", {
            get: function () {
                return this._map;
            },
            enumerable: true,
            configurable: true
        });
        MapboxView.prototype.initMap = function (map) {
            map.on("load", this.onMapLoad);
            map.on("zoom", this.onMapZoom);
            map.on("render", this.onMapRender);
        };
        Object.defineProperty(MapboxView.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: true,
            configurable: true
        });
        MapboxView.prototype.onInsertChildView = function (childView, targetView) {
            _super.prototype.onInsertChildView.call(this, childView, targetView);
            if (view.RenderView.is(childView)) {
                this.setChildViewBounds(childView, this._bounds);
                if (MapView.is(childView)) {
                    this.setChildViewProjection(childView, this._projection);
                }
                if (this._culled) {
                    childView.setCulled(true);
                }
                else {
                    childView.cascadeCull();
                }
            }
        };
        MapboxView.prototype.throttleZoom = function () {
            if (!this._zoomTimer) {
                this._zoomTimer = setTimeout(this.doZoom, 500);
            }
        };
        MapboxView.prototype.doZoom = function () {
            this._zoomTimer = 0;
            this.setZoom(this._map.getZoom());
        };
        MapboxView.prototype.onMapLoad = function () {
            var map = this._map;
            map.off("load", this.onMapLoad);
        };
        MapboxView.prototype.onMapRender = function () {
            this.setProjection(this._projection);
            var canvasView = this.canvasView;
            if (canvasView) {
                canvasView.animate(true);
            }
        };
        MapboxView.prototype.onMapZoom = function () {
            this.throttleZoom();
        };
        MapboxView.prototype.overlayCanvas = function () {
            if (this._parentView) {
                return this.canvasView;
            }
            else {
                var map = this._map;
                view.View.fromNode(map.getContainer());
                var canvasContainer = view.View.fromNode(map.getCanvasContainer());
                var canvas = canvasContainer.append("canvas");
                canvas.append(this);
                return canvas;
            }
        };
        return MapboxView;
    }(MapGraphicView));

    exports.AreaGraphView = AreaGraphView;
    exports.AxisView = AxisView;
    exports.AxisViewController = AxisViewController;
    exports.BottomAxisView = BottomAxisView;
    exports.BottomTickView = BottomTickView;
    exports.BubblePlotView = BubblePlotView;
    exports.ChartView = ChartView;
    exports.ChartViewController = ChartViewController;
    exports.DatumView = DatumView;
    exports.DialView = DialView;
    exports.GaugeView = GaugeView;
    exports.GraphView = GraphView;
    exports.GraphViewController = GraphViewController;
    exports.LeftAxisView = LeftAxisView;
    exports.LeftTickView = LeftTickView;
    exports.LineGraphView = LineGraphView;
    exports.LngLat = LngLat;
    exports.LngLatInterpolator = LngLatInterpolator;
    exports.MapCircleView = MapCircleView;
    exports.MapGraphicView = MapGraphicView;
    exports.MapGraphicViewController = MapGraphicViewController;
    exports.MapLayerView = MapLayerView;
    exports.MapLayerViewController = MapLayerViewController;
    exports.MapLineView = MapLineView;
    exports.MapPolygonView = MapPolygonView;
    exports.MapProjection = MapProjection;
    exports.MapView = MapView;
    exports.MapboxProjection = MapboxProjection;
    exports.MapboxView = MapboxView;
    exports.NumberTickGenerator = NumberTickGenerator;
    exports.PieView = PieView;
    exports.PlotView = PlotView;
    exports.PlotViewController = PlotViewController;
    exports.RightAxisView = RightAxisView;
    exports.RightTickView = RightTickView;
    exports.SliceView = SliceView;
    exports.TickGenerator = TickGenerator;
    exports.TickView = TickView;
    exports.TimeTickGenerator = TimeTickGenerator;
    exports.TopAxisView = TopAxisView;
    exports.TopTickView = TopTickView;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=swim-ux.js.map