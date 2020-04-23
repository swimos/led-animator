(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@swim/codec'), require('@swim/recon'), require('@swim/util'), require('@swim/uri'), require('@swim/structure'), require('@swim/collections'), require('@swim/streamlet'), require('@swim/dataflow')) :
    typeof define === 'function' && define.amd ? define(['exports', '@swim/codec', '@swim/recon', '@swim/util', '@swim/uri', '@swim/structure', '@swim/collections', '@swim/streamlet', '@swim/dataflow'], factory) :
    (global = global || self, factory(global.swim = global.swim || {}, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim));
}(this, function (exports, codec, recon, util, uri, structure, collections, streamlet, dataflow) { 'use strict';

    var Envelope = (function () {
        function Envelope() {
        }
        Envelope.prototype.tag = function () {
            return this.constructor.tag();
        };
        Envelope.prototype.prio = function (prio) {
            if (prio === void 0) {
                return 0;
            }
            else {
                return this;
            }
        };
        Envelope.prototype.rate = function (rate) {
            if (rate === void 0) {
                return 0;
            }
            else {
                return this;
            }
        };
        Envelope.prototype.toRecon = function () {
            return recon.Recon.toString(this.toValue());
        };
        Envelope.prototype.toString = function () {
            return codec.Format.debug(this);
        };
        Envelope.tag = function () {
            return void 0;
        };
        Envelope.fromValue = function (value) {
            switch (value.tag()) {
                case "event": return Envelope.EventMessage.fromValue(value);
                case "command": return Envelope.CommandMessage.fromValue(value);
                case "link": return Envelope.LinkRequest.fromValue(value);
                case "linked": return Envelope.LinkedResponse.fromValue(value);
                case "sync": return Envelope.SyncRequest.fromValue(value);
                case "synced": return Envelope.SyncedResponse.fromValue(value);
                case "unlink": return Envelope.UnlinkRequest.fromValue(value);
                case "unlinked": return Envelope.UnlinkedResponse.fromValue(value);
                case "auth": return Envelope.AuthRequest.fromValue(value);
                case "authed": return Envelope.AuthedResponse.fromValue(value);
                case "deauth": return Envelope.DeauthRequest.fromValue(value);
                case "deauthed": return Envelope.DeauthedResponse.fromValue(value);
                default: return void 0;
            }
        };
        Envelope.parseRecon = function (input) {
            return Envelope.fromValue(recon.Recon.parse(input));
        };
        return Envelope;
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

    var HostAddressed = (function (_super) {
        __extends(HostAddressed, _super);
        function HostAddressed(body) {
            var _this = _super.call(this) || this;
            _this._body = body;
            return _this;
        }
        HostAddressed.prototype.node = function (node) {
            if (node === void 0) {
                return uri.Uri.empty();
            }
            else {
                return this;
            }
        };
        HostAddressed.prototype.lane = function (lane) {
            if (lane === void 0) {
                return uri.Uri.empty();
            }
            else {
                return this;
            }
        };
        HostAddressed.prototype.body = function (body) {
            if (body === void 0) {
                return this._body;
            }
            else {
                body = structure.Value.fromAny(body);
                return this.copy(body);
            }
        };
        HostAddressed.prototype.equals = function (that) {
            if (this === that) {
                return true;
            }
            else if (that instanceof HostAddressed
                && this.__proto__.constructor === that.__proto__.constructor) {
                return this._body.equals(that._body);
            }
            return false;
        };
        HostAddressed.prototype.hashCode = function () {
            return util.Murmur3.mash(util.Murmur3.mix(util.Murmur3.seed(this.__proto__), this._body.hashCode()));
        };
        HostAddressed.prototype.debug = function (output) {
            output = output.write(this.__proto__.constructor.name).write(46).write("of").write(40);
            if (this._body.isDefined()) {
                output = output.debug(this._body);
            }
            output = output.write(41);
        };
        HostAddressed.prototype.toValue = function () {
            return structure.Attr.of(this.tag()).concat(this._body);
        };
        HostAddressed.fromValue = function (value, E) {
            var header = value.header(E.tag());
            if (header.isDefined()) {
                var body = value.body();
                return new E(body);
            }
            return void 0;
        };
        return HostAddressed;
    }(Envelope));

    var LaneAddressed = (function (_super) {
        __extends(LaneAddressed, _super);
        function LaneAddressed(node, lane, body) {
            var _this = _super.call(this) || this;
            _this._node = node;
            _this._lane = lane;
            _this._body = body;
            return _this;
        }
        LaneAddressed.prototype.node = function (node) {
            if (node === void 0) {
                return this._node;
            }
            else {
                node = uri.Uri.fromAny(node);
                return this.copy(node, this._lane, this._body);
            }
        };
        LaneAddressed.prototype.lane = function (lane) {
            if (lane === void 0) {
                return this._lane;
            }
            else {
                lane = uri.Uri.fromAny(lane);
                return this.copy(this._node, lane, this._body);
            }
        };
        LaneAddressed.prototype.body = function (body) {
            if (body === void 0) {
                return this._body;
            }
            else {
                body = structure.Value.fromAny(body);
                return this.copy(this._node, this._lane, body);
            }
        };
        LaneAddressed.prototype.toValue = function () {
            var header = structure.Record.create(2)
                .slot("node", this._node.toString())
                .slot("lane", this._lane.toString());
            return structure.Attr.of(this.tag(), header).concat(this._body);
        };
        LaneAddressed.prototype.equals = function (that) {
            if (this === that) {
                return true;
            }
            else if (that instanceof LaneAddressed
                && this.__proto__.constructor === that.__proto__.constructor) {
                return this._node.equals(that._node) && this._lane.equals(that._lane)
                    && this._body.equals(that._body);
            }
            return false;
        };
        LaneAddressed.prototype.hashCode = function () {
            return util.Murmur3.mash(util.Murmur3.mix(util.Murmur3.mix(util.Murmur3.mix(util.Murmur3.seed(this.__proto__), this._node.hashCode()), this._lane.hashCode()), this._body.hashCode()));
        };
        LaneAddressed.prototype.debug = function (output) {
            output = output.write(this.__proto__.constructor.name).write(46).write("of").write(40)
                .debug(this._node.toString()).write(", ").debug(this._lane.toString());
            if (this._body.isDefined()) {
                output = output.write(", ").debug(this._body);
            }
            output = output.write(41);
        };
        LaneAddressed.fromValue = function (value, E) {
            var node;
            var lane;
            var header = value.header(E.tag());
            header.forEach(function (header, index) {
                var key = header.key.stringValue(void 0);
                if (key !== void 0) {
                    if (key === "node") {
                        node = uri.Uri.parse(header.toValue().stringValue(""));
                    }
                    else if (key === "lane") {
                        lane = uri.Uri.parse(header.toValue().stringValue(""));
                    }
                }
                else if (header instanceof structure.Value) {
                    if (index === 0) {
                        node = uri.Uri.parse(header.stringValue(""));
                    }
                    else if (index === 1) {
                        lane = uri.Uri.parse(header.stringValue(""));
                    }
                }
            });
            if (node && lane) {
                var body = value.body();
                return new E(node, lane, body);
            }
            return void 0;
        };
        return LaneAddressed;
    }(Envelope));

    var LinkAddressed = (function (_super) {
        __extends(LinkAddressed, _super);
        function LinkAddressed(node, lane, prio, rate, body) {
            var _this = _super.call(this) || this;
            _this._node = node;
            _this._lane = lane;
            _this._prio = prio;
            _this._rate = rate;
            _this._body = body;
            return _this;
        }
        LinkAddressed.prototype.node = function (node) {
            if (node === undefined) {
                return this._node;
            }
            else {
                node = uri.Uri.fromAny(node);
                return this.copy(node, this._lane, this._prio, this._rate, this._body);
            }
        };
        LinkAddressed.prototype.lane = function (lane) {
            if (lane === undefined) {
                return this._lane;
            }
            else {
                lane = uri.Uri.fromAny(lane);
                return this.copy(this._node, lane, this._prio, this._rate, this._body);
            }
        };
        LinkAddressed.prototype.prio = function (prio) {
            if (prio === undefined) {
                return this._prio;
            }
            else {
                return this.copy(this._node, this._lane, prio, this._rate, this._body);
            }
        };
        LinkAddressed.prototype.rate = function (rate) {
            if (rate === undefined) {
                return this._rate;
            }
            else {
                return this.copy(this._node, this._lane, this._prio, rate, this._body);
            }
        };
        LinkAddressed.prototype.body = function (body) {
            if (body === undefined) {
                return this._body;
            }
            else {
                body = structure.Value.fromAny(body);
                return this.copy(this._node, this._lane, this._prio, this._rate, body);
            }
        };
        LinkAddressed.prototype.equals = function (that) {
            if (this === that) {
                return true;
            }
            else if (that instanceof LinkAddressed
                && this.__proto__.constructor === that.__proto__.constructor) {
                return this._node.equals(that._node) && this._lane.equals(that._lane)
                    && this._prio === that._prio && this._rate === that._rate
                    && this._body.equals(that._body);
            }
            return false;
        };
        LinkAddressed.prototype.hashCode = function () {
            return util.Murmur3.mash(util.Murmur3.mix(util.Murmur3.mix(util.Murmur3.mix(util.Murmur3.mix(util.Murmur3.mix(util.Murmur3.seed(this.__proto__), this._node.hashCode()), this._lane.hashCode()), util.Murmur3.hash(this._prio)), util.Murmur3.hash(this._rate)), this._body.hashCode()));
        };
        LinkAddressed.prototype.debug = function (output) {
            output = output.write(this.__proto__.constructor.name).write(46).write("of").write(40)
                .debug(this._node.toString()).write(", ").debug(this._lane.toString());
            if (this._prio || this._rate) {
                output = output.write(", ").debug(this._prio).write(", ").debug(this._rate);
            }
            if (this._body.isDefined()) {
                output = output.write(", ").debug(this._body);
            }
            output = output.write(41);
        };
        LinkAddressed.prototype.toValue = function () {
            var header = structure.Record.create(4)
                .slot("node", this._node.toString())
                .slot("lane", this._lane.toString());
            if (this._prio) {
                header.slot("prio", this._prio);
            }
            if (this._rate) {
                header.slot("rate", this._rate);
            }
            return structure.Attr.of(this.tag(), header).concat(this._body);
        };
        LinkAddressed.fromValue = function (value, E) {
            var node;
            var lane;
            var prio = 0;
            var rate = 0;
            var header = value.header(E.tag());
            header.forEach(function (header, index) {
                var key = header.key.stringValue(void 0);
                if (key !== void 0) {
                    if (key === "node") {
                        node = uri.Uri.parse(header.toValue().stringValue(""));
                    }
                    else if (key === "lane") {
                        lane = uri.Uri.parse(header.toValue().stringValue(""));
                    }
                    else if (key === "prio") {
                        prio = header.numberValue(prio);
                    }
                    else if (key === "rate") {
                        rate = header.numberValue(rate);
                    }
                }
                else if (header instanceof structure.Value) {
                    if (index === 0) {
                        node = uri.Uri.parse(header.stringValue(""));
                    }
                    else if (index === 1) {
                        lane = uri.Uri.parse(header.stringValue(""));
                    }
                }
            });
            if (node && lane) {
                var body = value.body();
                return new E(node, lane, prio, rate, body);
            }
            return void 0;
        };
        return LinkAddressed;
    }(Envelope));

    var EventMessage = (function (_super) {
        __extends(EventMessage, _super);
        function EventMessage(node, lane, body) {
            return _super.call(this, node, lane, body) || this;
        }
        EventMessage.prototype.copy = function (node, lane, body) {
            return new EventMessage(node, lane, body);
        };
        EventMessage.tag = function () {
            return "event";
        };
        EventMessage.fromValue = function (value) {
            return LaneAddressed.fromValue(value, EventMessage);
        };
        EventMessage.of = function (node, lane, body) {
            if (body === void 0) { body = structure.Value.absent(); }
            node = uri.Uri.fromAny(node);
            lane = uri.Uri.fromAny(lane);
            body = structure.Value.fromAny(body);
            return new EventMessage(node, lane, body);
        };
        return EventMessage;
    }(LaneAddressed));
    Envelope.EventMessage = EventMessage;

    var CommandMessage = (function (_super) {
        __extends(CommandMessage, _super);
        function CommandMessage(node, lane, body) {
            return _super.call(this, node, lane, body) || this;
        }
        CommandMessage.prototype.copy = function (node, lane, body) {
            return new CommandMessage(node, lane, body);
        };
        CommandMessage.tag = function () {
            return "command";
        };
        CommandMessage.fromValue = function (value) {
            return LaneAddressed.fromValue(value, CommandMessage);
        };
        CommandMessage.of = function (node, lane, body) {
            if (body === void 0) { body = structure.Value.absent(); }
            node = uri.Uri.fromAny(node);
            lane = uri.Uri.fromAny(lane);
            body = structure.Value.fromAny(body);
            return new CommandMessage(node, lane, body);
        };
        return CommandMessage;
    }(LaneAddressed));
    Envelope.CommandMessage = CommandMessage;

    var LinkRequest = (function (_super) {
        __extends(LinkRequest, _super);
        function LinkRequest(node, lane, prio, rate, body) {
            return _super.call(this, node, lane, prio, rate, body) || this;
        }
        LinkRequest.prototype.copy = function (node, lane, prio, rate, body) {
            return new LinkRequest(node, lane, prio, rate, body);
        };
        LinkRequest.tag = function () {
            return "link";
        };
        LinkRequest.fromValue = function (value) {
            return LinkAddressed.fromValue(value, LinkRequest);
        };
        LinkRequest.of = function (node, lane, prio, rate, body) {
            if (prio === void 0) { prio = 0; }
            if (rate === void 0) { rate = 0; }
            if (body === void 0) { body = structure.Value.absent(); }
            node = uri.Uri.fromAny(node);
            lane = uri.Uri.fromAny(lane);
            body = structure.Value.fromAny(body);
            return new LinkRequest(node, lane, prio, rate, body);
        };
        return LinkRequest;
    }(LinkAddressed));
    Envelope.LinkRequest = LinkRequest;

    var LinkedResponse = (function (_super) {
        __extends(LinkedResponse, _super);
        function LinkedResponse(node, lane, prio, rate, body) {
            return _super.call(this, node, lane, prio, rate, body) || this;
        }
        LinkedResponse.prototype.copy = function (node, lane, prio, rate, body) {
            return new LinkedResponse(node, lane, prio, rate, body);
        };
        LinkedResponse.tag = function () {
            return "linked";
        };
        LinkedResponse.fromValue = function (value) {
            return LinkAddressed.fromValue(value, LinkedResponse);
        };
        LinkedResponse.of = function (node, lane, prio, rate, body) {
            if (prio === void 0) { prio = 0; }
            if (rate === void 0) { rate = 0; }
            if (body === void 0) { body = structure.Value.absent(); }
            node = uri.Uri.fromAny(node);
            lane = uri.Uri.fromAny(lane);
            body = structure.Value.fromAny(body);
            return new LinkedResponse(node, lane, prio, rate, body);
        };
        return LinkedResponse;
    }(LinkAddressed));
    Envelope.LinkedResponse = LinkedResponse;

    var SyncRequest = (function (_super) {
        __extends(SyncRequest, _super);
        function SyncRequest(node, lane, prio, rate, body) {
            return _super.call(this, node, lane, prio, rate, body) || this;
        }
        SyncRequest.prototype.copy = function (node, lane, prio, rate, body) {
            return new SyncRequest(node, lane, prio, rate, body);
        };
        SyncRequest.tag = function () {
            return "sync";
        };
        SyncRequest.fromValue = function (value) {
            return LinkAddressed.fromValue(value, SyncRequest);
        };
        SyncRequest.of = function (node, lane, prio, rate, body) {
            if (prio === void 0) { prio = 0; }
            if (rate === void 0) { rate = 0; }
            if (body === void 0) { body = structure.Value.absent(); }
            node = uri.Uri.fromAny(node);
            lane = uri.Uri.fromAny(lane);
            body = structure.Value.fromAny(body);
            return new SyncRequest(node, lane, prio, rate, body);
        };
        return SyncRequest;
    }(LinkAddressed));
    Envelope.SyncRequest = SyncRequest;

    var SyncedResponse = (function (_super) {
        __extends(SyncedResponse, _super);
        function SyncedResponse(node, lane, body) {
            return _super.call(this, node, lane, body) || this;
        }
        SyncedResponse.prototype.copy = function (node, lane, body) {
            return new SyncedResponse(node, lane, body);
        };
        SyncedResponse.tag = function () {
            return "synced";
        };
        SyncedResponse.fromValue = function (value) {
            return LaneAddressed.fromValue(value, SyncedResponse);
        };
        SyncedResponse.of = function (node, lane, body) {
            if (body === void 0) { body = structure.Value.absent(); }
            node = uri.Uri.fromAny(node);
            lane = uri.Uri.fromAny(lane);
            body = structure.Value.fromAny(body);
            return new SyncedResponse(node, lane, body);
        };
        return SyncedResponse;
    }(LaneAddressed));
    Envelope.SyncedResponse = SyncedResponse;

    var UnlinkRequest = (function (_super) {
        __extends(UnlinkRequest, _super);
        function UnlinkRequest(node, lane, body) {
            return _super.call(this, node, lane, body) || this;
        }
        UnlinkRequest.prototype.copy = function (node, lane, body) {
            return new UnlinkRequest(node, lane, body);
        };
        UnlinkRequest.tag = function () {
            return "unlink";
        };
        UnlinkRequest.fromValue = function (value) {
            return LaneAddressed.fromValue(value, UnlinkRequest);
        };
        UnlinkRequest.of = function (node, lane, body) {
            if (body === void 0) { body = structure.Value.absent(); }
            node = uri.Uri.fromAny(node);
            lane = uri.Uri.fromAny(lane);
            body = structure.Value.fromAny(body);
            return new UnlinkRequest(node, lane, body);
        };
        return UnlinkRequest;
    }(LaneAddressed));
    Envelope.UnlinkRequest = UnlinkRequest;

    var UnlinkedResponse = (function (_super) {
        __extends(UnlinkedResponse, _super);
        function UnlinkedResponse(node, lane, body) {
            return _super.call(this, node, lane, body) || this;
        }
        UnlinkedResponse.prototype.copy = function (node, lane, body) {
            return new UnlinkedResponse(node, lane, body);
        };
        UnlinkedResponse.tag = function () {
            return "unlinked";
        };
        UnlinkedResponse.fromValue = function (value) {
            return LaneAddressed.fromValue(value, UnlinkedResponse);
        };
        UnlinkedResponse.of = function (node, lane, body) {
            if (body === void 0) { body = structure.Value.absent(); }
            node = uri.Uri.fromAny(node);
            lane = uri.Uri.fromAny(lane);
            body = structure.Value.fromAny(body);
            return new UnlinkedResponse(node, lane, body);
        };
        return UnlinkedResponse;
    }(LaneAddressed));
    Envelope.UnlinkedResponse = UnlinkedResponse;

    var AuthRequest = (function (_super) {
        __extends(AuthRequest, _super);
        function AuthRequest(body) {
            return _super.call(this, body) || this;
        }
        AuthRequest.prototype.copy = function (body) {
            return new AuthRequest(body);
        };
        AuthRequest.tag = function () {
            return "auth";
        };
        AuthRequest.fromValue = function (value) {
            return HostAddressed.fromValue(value, AuthRequest);
        };
        AuthRequest.of = function (body) {
            if (body === void 0) { body = structure.Value.absent(); }
            body = structure.Value.fromAny(body);
            return new AuthRequest(body);
        };
        return AuthRequest;
    }(HostAddressed));
    Envelope.AuthRequest = AuthRequest;

    var AuthedResponse = (function (_super) {
        __extends(AuthedResponse, _super);
        function AuthedResponse(body) {
            return _super.call(this, body) || this;
        }
        AuthedResponse.prototype.copy = function (body) {
            return new AuthedResponse(body);
        };
        AuthedResponse.tag = function () {
            return "authed";
        };
        AuthedResponse.fromValue = function (value) {
            return HostAddressed.fromValue(value, AuthedResponse);
        };
        AuthedResponse.of = function (body) {
            if (body === void 0) { body = structure.Value.absent(); }
            body = structure.Value.fromAny(body);
            return new AuthedResponse(body);
        };
        return AuthedResponse;
    }(HostAddressed));
    Envelope.AuthedResponse = AuthedResponse;

    var DeauthRequest = (function (_super) {
        __extends(DeauthRequest, _super);
        function DeauthRequest(body) {
            return _super.call(this, body) || this;
        }
        DeauthRequest.prototype.copy = function (body) {
            return new DeauthRequest(body);
        };
        DeauthRequest.tag = function () {
            return "deauth";
        };
        DeauthRequest.fromValue = function (value) {
            return HostAddressed.fromValue(value, DeauthRequest);
        };
        DeauthRequest.of = function (body) {
            if (body === void 0) { body = structure.Value.absent(); }
            body = structure.Value.fromAny(body);
            return new DeauthRequest(body);
        };
        return DeauthRequest;
    }(HostAddressed));
    Envelope.DeauthRequest = DeauthRequest;

    var DeauthedResponse = (function (_super) {
        __extends(DeauthedResponse, _super);
        function DeauthedResponse(body) {
            return _super.call(this, body) || this;
        }
        DeauthedResponse.prototype.copy = function (body) {
            return new DeauthedResponse(body);
        };
        DeauthedResponse.tag = function () {
            return "deauthed";
        };
        DeauthedResponse.fromValue = function (value) {
            return HostAddressed.fromValue(value, DeauthedResponse);
        };
        DeauthedResponse.of = function (body) {
            if (body === void 0) { body = structure.Value.absent(); }
            body = structure.Value.fromAny(body);
            return new DeauthedResponse(body);
        };
        return DeauthedResponse;
    }(HostAddressed));
    Envelope.DeauthedResponse = DeauthedResponse;

    var Host = (function () {
        function Host() {
        }
        return Host;
    }());

    var MAX_RECONNECT_TIMEOUT = 30000;
    var IDLE_TIMEOUT = 1000;
    var SEND_BUFFER_SIZE = 1024;
    var RemoteHost = (function (_super) {
        __extends(RemoteHost, _super);
        function RemoteHost(context, hostUri, options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this) || this;
            _this._context = context;
            _this._hostUri = hostUri;
            _this._options = options;
            _this._downlinks = new collections.BTree();
            _this._downlinkCount = 0;
            _this._authenticated = false;
            _this._session = structure.Value.absent();
            _this._uriCache = new uri.UriCache(hostUri);
            _this._sendBuffer = [];
            _this._reconnectTimer = 0;
            _this._reconnectTimeout = 0;
            _this._idleTimer = 0;
            _this.open = _this.open.bind(_this);
            _this.checkIdle = _this.checkIdle.bind(_this);
            return _this;
        }
        RemoteHost.prototype.hostUri = function () {
            return this._hostUri;
        };
        RemoteHost.prototype.credentials = function () {
            return this._options.credentials || structure.Value.absent();
        };
        RemoteHost.prototype.maxReconnectTimeout = function () {
            return this._options.maxReconnectTimeout || MAX_RECONNECT_TIMEOUT;
        };
        RemoteHost.prototype.idleTimeout = function () {
            return this._options.idleTimeout || IDLE_TIMEOUT;
        };
        RemoteHost.prototype.sendBufferSize = function () {
            return this._options.sendBufferSize || SEND_BUFFER_SIZE;
        };
        RemoteHost.prototype.isAuthenticated = function () {
            return this._authenticated;
        };
        RemoteHost.prototype.session = function () {
            return this._session;
        };
        RemoteHost.prototype.isIdle = function () {
            return !this._sendBuffer.length && !this._downlinkCount;
        };
        RemoteHost.prototype.resolve = function (relative) {
            return this._uriCache.resolve(relative);
        };
        RemoteHost.prototype.unresolve = function (absolute) {
            return this._uriCache.unresolve(absolute);
        };
        RemoteHost.prototype.authenticate = function (credentials) {
            credentials = structure.Value.fromAny(credentials);
            if (!credentials.equals(this._options.credentials)) {
                this._options.credentials = credentials;
                if (this.isConnected()) {
                    var request = AuthRequest.of(credentials);
                    this.push(request);
                }
                else {
                    this.open();
                }
            }
        };
        RemoteHost.prototype.openDownlink = function (downlink) {
            this.clearIdle();
            var nodeUri = this.resolve(downlink.nodeUri());
            var laneUri = downlink.laneUri();
            if (!this._downlinkCount) {
                this.open();
            }
            var nodeDownlinks = this._downlinks.get(nodeUri);
            if (!nodeDownlinks) {
                nodeDownlinks = new collections.BTree();
                this._downlinks.set(nodeUri, nodeDownlinks);
            }
            if (nodeDownlinks.get(laneUri)) {
                throw new Error("duplicate downlink");
            }
            nodeDownlinks.set(laneUri, downlink);
            this._downlinkCount += 1;
            downlink.openUp(this);
            if (this.isConnected()) {
                downlink.hostDidConnect(this);
            }
        };
        RemoteHost.prototype.unlinkDownlink = function (downlink) {
            var nodeUri = this.resolve(downlink.nodeUri());
            var laneUri = downlink.laneUri();
            var nodeDownlinks = this._downlinks.get(nodeUri);
            if (nodeDownlinks && nodeDownlinks.get(laneUri) && this.isConnected()) {
                var request = UnlinkRequest.of(this.unresolve(nodeUri), laneUri);
                downlink.onUnlinkRequest(request, this);
                this.push(request);
            }
        };
        RemoteHost.prototype.closeDownlink = function (downlink) {
            var nodeUri = this.resolve(downlink.nodeUri());
            var laneUri = downlink.laneUri();
            var nodeDownlinks = this._downlinks.get(nodeUri);
            if (nodeDownlinks) {
                if (nodeDownlinks.get(laneUri)) {
                    this._downlinkCount -= 1;
                    nodeDownlinks.delete(laneUri);
                    if (nodeDownlinks.isEmpty()) {
                        this._downlinks.delete(nodeUri);
                    }
                    if (!this._downlinkCount) {
                        this.watchIdle();
                    }
                    downlink.closeUp(this);
                }
            }
        };
        RemoteHost.prototype.command = function (nodeUri, laneUri, body) {
            nodeUri = uri.Uri.fromAny(nodeUri);
            nodeUri = this.resolve(nodeUri);
            laneUri = uri.Uri.fromAny(laneUri);
            body = structure.Value.fromAny(body);
            var message = CommandMessage.of(this.unresolve(nodeUri), laneUri, body);
            this.push(message);
        };
        RemoteHost.prototype.onEnvelope = function (envelope) {
            if (envelope instanceof EventMessage) {
                this.onEventMessage(envelope);
            }
            else if (envelope instanceof CommandMessage) {
                this.onCommandMessage(envelope);
            }
            else if (envelope instanceof LinkRequest) {
                this.onLinkRequest(envelope);
            }
            else if (envelope instanceof LinkedResponse) {
                this.onLinkedResponse(envelope);
            }
            else if (envelope instanceof SyncRequest) {
                this.onSyncRequest(envelope);
            }
            else if (envelope instanceof SyncedResponse) {
                this.onSyncedResponse(envelope);
            }
            else if (envelope instanceof UnlinkRequest) {
                this.onUnlinkRequest(envelope);
            }
            else if (envelope instanceof UnlinkedResponse) {
                this.onUnlinkedResponse(envelope);
            }
            else if (envelope instanceof AuthRequest) {
                this.onAuthRequest(envelope);
            }
            else if (envelope instanceof AuthedResponse) {
                this.onAuthedResponse(envelope);
            }
            else if (envelope instanceof DeauthRequest) {
                this.onDeauthRequest(envelope);
            }
            else if (envelope instanceof DeauthedResponse) {
                this.onDeauthedResponse(envelope);
            }
            else {
                this.onUnknownEnvelope(envelope);
            }
        };
        RemoteHost.prototype.onEventMessage = function (message) {
            var nodeUri = this.resolve(message.node());
            var laneUri = message.lane();
            var nodeDownlinks = this._downlinks.get(nodeUri);
            if (nodeDownlinks) {
                var downlink = nodeDownlinks.get(laneUri);
                if (downlink) {
                    var resolvedMessage = message.node(nodeUri);
                    downlink.onEventMessage(resolvedMessage, this);
                }
            }
        };
        RemoteHost.prototype.onCommandMessage = function (message) {
        };
        RemoteHost.prototype.onLinkRequest = function (request) {
        };
        RemoteHost.prototype.onLinkedResponse = function (response) {
            var nodeUri = this.resolve(response.node());
            var laneUri = response.lane();
            var nodeDownlinks = this._downlinks.get(nodeUri);
            if (nodeDownlinks) {
                var downlink = nodeDownlinks.get(laneUri);
                if (downlink) {
                    var resolvedResponse = response.node(nodeUri);
                    downlink.onLinkedResponse(resolvedResponse, this);
                }
            }
        };
        RemoteHost.prototype.onSyncRequest = function (request) {
        };
        RemoteHost.prototype.onSyncedResponse = function (response) {
            var nodeUri = this.resolve(response.node());
            var laneUri = response.lane();
            var nodeDownlinks = this._downlinks.get(nodeUri);
            if (nodeDownlinks) {
                var downlink = nodeDownlinks.get(laneUri);
                if (downlink) {
                    var resolvedResponse = response.node(nodeUri);
                    downlink.onSyncedResponse(resolvedResponse, this);
                }
            }
        };
        RemoteHost.prototype.onUnlinkRequest = function (request) {
        };
        RemoteHost.prototype.onUnlinkedResponse = function (response) {
            var nodeUri = this.resolve(response.node());
            var laneUri = response.lane();
            var nodeDownlinks = this._downlinks.get(nodeUri);
            if (nodeDownlinks) {
                var downlink = nodeDownlinks.get(laneUri);
                if (downlink) {
                    var resolvedResponse = response.node(nodeUri);
                    downlink.onUnlinkedResponse(resolvedResponse, this);
                }
            }
        };
        RemoteHost.prototype.onAuthRequest = function (request) {
        };
        RemoteHost.prototype.onAuthedResponse = function (response) {
            this._authenticated = true;
            this._session = response.body();
            this._context.hostDidAuthenticate(response.body(), this);
        };
        RemoteHost.prototype.onDeauthRequest = function (request) {
        };
        RemoteHost.prototype.onDeauthedResponse = function (response) {
            this._authenticated = false;
            this._session = structure.Value.absent();
            this._context.hostDidDeauthenticate(response.body(), this);
        };
        RemoteHost.prototype.onUnknownEnvelope = function (envelope) {
        };
        RemoteHost.prototype.onConnect = function () {
            this._reconnectTimeout = 0;
            this._context.hostDidConnect(this);
            this._downlinks.forEach(function (nodeUri, nodeDownlinks) {
                nodeDownlinks.forEach(function (laneUri, downlink) {
                    downlink.hostDidConnect(this);
                }, this);
            }, this);
        };
        RemoteHost.prototype.onDisconnect = function () {
            this._authenticated = false;
            this._session = structure.Value.absent();
            this._context.hostDidDisconnect(this);
            this._downlinks.forEach(function (nodeUri, nodeDownlinks) {
                nodeDownlinks.forEach(function (laneUri, downlink) {
                    downlink.hostDidDisconnect(this);
                }, this);
            }, this);
        };
        RemoteHost.prototype.onError = function (error) {
            this._context.hostDidFail(error, this);
            this._downlinks.forEach(function (nodeUri, nodeDownlinks) {
                nodeDownlinks.forEach(function (laneUri, downlink) {
                    downlink.hostDidFail(error, this);
                }, this);
            }, this);
        };
        RemoteHost.prototype.reconnect = function () {
            if (!this._reconnectTimer) {
                if (!this._reconnectTimeout) {
                    this._reconnectTimeout = Math.floor(500 + 1000 * Math.random());
                }
                else {
                    this._reconnectTimeout = Math.min(Math.floor(1.8 * this._reconnectTimeout), this.maxReconnectTimeout());
                }
                this._reconnectTimer = setTimeout(this.open, this._reconnectTimeout);
            }
        };
        RemoteHost.prototype.clearReconnect = function () {
            if (this._reconnectTimer) {
                clearTimeout(this._reconnectTimer);
                this._reconnectTimer = 0;
            }
        };
        RemoteHost.prototype.watchIdle = function () {
            if (!this._idleTimer && this.isConnected() && this.isIdle()) {
                this._idleTimer = setTimeout(this.checkIdle, this.idleTimeout());
            }
        };
        RemoteHost.prototype.clearIdle = function () {
            if (this._idleTimer) {
                clearTimeout(this._idleTimer);
                this._idleTimer = 0;
            }
        };
        RemoteHost.prototype.checkIdle = function () {
            if (this.isConnected() && this.isIdle()) {
                this.close();
            }
        };
        RemoteHost.prototype.close = function () {
            this._context.closeHost(this);
        };
        RemoteHost.prototype.closeUp = function () {
            this._downlinks.forEach(function (nodeUri, nodeDownlinks) {
                nodeDownlinks.forEach(function (laneUri, downlink) {
                    downlink.closeUp(this);
                }, this);
            }, this);
        };
        return RemoteHost;
    }(Host));

    var WebSocketHost = (function (_super) {
        __extends(WebSocketHost, _super);
        function WebSocketHost(context, hostUri, options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, context, hostUri, options) || this;
            _this.onWebSocketOpen = _this.onWebSocketOpen.bind(_this);
            _this.onWebSocketMessage = _this.onWebSocketMessage.bind(_this);
            _this.onWebSocketClose = _this.onWebSocketClose.bind(_this);
            _this.onWebSocketError = _this.onWebSocketError.bind(_this);
            return _this;
        }
        Object.defineProperty(WebSocketHost.prototype, "WebSocket", {
            get: function () {
                return this._options.WebSocket
                    || typeof WebSocket !== "undefined" && WebSocket
                    || typeof require === "function" && require("ws")
                    || void 0;
            },
            enumerable: true,
            configurable: true
        });
        WebSocketHost.prototype.isConnected = function () {
            return this._socket ? this._socket.readyState === this._socket.OPEN : false;
        };
        WebSocketHost.prototype.open = function () {
            this.clearReconnect();
            if (!this._socket) {
                var WebSocket_1 = this.WebSocket;
                if (!WebSocket_1) {
                    throw new Error("WebSocket undefined");
                }
                var hostUri = this._hostUri;
                var schemeName = hostUri.schemeName();
                if (schemeName === "warp" || schemeName === "swim") {
                    hostUri = hostUri.scheme("ws");
                }
                else if (schemeName === "warps" || schemeName === "swims") {
                    hostUri = hostUri.scheme("wss");
                }
                if (this._options.protocols) {
                    this._socket = new WebSocket_1(hostUri.toString(), this._options.protocols);
                }
                else {
                    this._socket = new WebSocket_1(hostUri.toString());
                }
                this._socket.onopen = this.onWebSocketOpen;
                this._socket.onmessage = this.onWebSocketMessage;
                this._socket.onclose = this.onWebSocketClose;
                this._socket.onerror = this.onWebSocketError;
            }
        };
        WebSocketHost.prototype.close = function () {
            this.clearReconnect();
            this.clearIdle();
            if (this._socket) {
                this._socket.close();
                if (!this._context.isOnline()) {
                    this.onWebSocketClose();
                }
            }
            else {
                _super.prototype.close.call(this);
            }
        };
        WebSocketHost.prototype.push = function (envelope) {
            if (this.isConnected()) {
                this.clearIdle();
                var text = envelope.toRecon();
                this._socket.send(text);
                this.watchIdle();
            }
            else if (envelope instanceof CommandMessage) {
                if (this._sendBuffer.length < this.sendBufferSize()) {
                    this._sendBuffer.push(envelope);
                }
                else {
                    throw new Error("send buffer overflow");
                }
                this.open();
            }
        };
        WebSocketHost.prototype.onWebSocketOpen = function () {
            if (this.isConnected()) {
                var credentials = this.credentials();
                if (credentials.isDefined()) {
                    var request = new AuthRequest(credentials);
                    this.push(request);
                }
                this.onConnect();
                var envelope = void 0;
                while ((envelope = this._sendBuffer.shift()) && this.isConnected()) {
                    this.push(envelope);
                }
                this.watchIdle();
            }
            else {
                this.close();
            }
        };
        WebSocketHost.prototype.onWebSocketMessage = function (message) {
            var data = message.data;
            if (typeof data === "string") {
                var envelope = Envelope.parseRecon(data);
                if (envelope) {
                    this.onEnvelope(envelope);
                }
                else {
                    this.onUnknownEnvelope(data);
                }
            }
        };
        WebSocketHost.prototype.onWebSocketClose = function () {
            if (this._socket) {
                this._socket.onopen = null;
                this._socket.onmessage = null;
                this._socket.onclose = null;
                this._socket.onerror = null;
                this._socket = void 0;
            }
            this.onDisconnect();
            this.clearIdle();
            if (!this.isIdle()) {
                if (this._context.isOnline()) {
                    this.reconnect();
                }
            }
            else {
                this.close();
            }
        };
        WebSocketHost.prototype.onWebSocketError = function () {
            this.onError();
            if (this._socket) {
                this._socket.close();
            }
        };
        return WebSocketHost;
    }(RemoteHost));

    var LINKING = 1;
    var LINKED = 2;
    var SYNCING = 4;
    var SYNCED = 8;
    var UNLINKING = 16;
    var DownlinkModel = (function () {
        function DownlinkModel(context, hostUri, nodeUri, laneUri, prio, rate, body) {
            if (prio === void 0) { prio = 0; }
            if (rate === void 0) { rate = 0; }
            if (body === void 0) { body = structure.Value.absent(); }
            this._context = context;
            this._hostUri = hostUri;
            this._nodeUri = nodeUri;
            this._laneUri = laneUri;
            this._prio = prio;
            this._rate = rate;
            this._body = body;
            this._views = [];
            this._host = null;
            this._status = 0;
        }
        DownlinkModel.prototype.hostUri = function () {
            return this._hostUri;
        };
        DownlinkModel.prototype.nodeUri = function () {
            return this._nodeUri;
        };
        DownlinkModel.prototype.laneUri = function () {
            return this._laneUri;
        };
        DownlinkModel.prototype.prio = function () {
            return this._prio;
        };
        DownlinkModel.prototype.rate = function () {
            return this._rate;
        };
        DownlinkModel.prototype.body = function () {
            return this._body;
        };
        DownlinkModel.prototype.keepLinked = function () {
            for (var i = 0; i < this._views.length; i += 1) {
                if (this._views[i].keepLinked()) {
                    return true;
                }
            }
            return false;
        };
        DownlinkModel.prototype.keepSynced = function () {
            for (var i = 0; i < this._views.length; i += 1) {
                if (this._views[i].keepSynced()) {
                    return true;
                }
            }
            return false;
        };
        DownlinkModel.prototype.isConnected = function () {
            return !!(this._host && this._host.isConnected());
        };
        DownlinkModel.prototype.isAuthenticated = function () {
            return !!(this._host && this._host.isAuthenticated());
        };
        DownlinkModel.prototype.isLinked = function () {
            return (this._status & LINKED) !== 0;
        };
        DownlinkModel.prototype.isSynced = function () {
            return (this._status & SYNCED) !== 0;
        };
        DownlinkModel.prototype.session = function () {
            return this._host ? this._host.session() : structure.Value.absent();
        };
        DownlinkModel.prototype.addDownlink = function (view) {
            this._views.push(view);
        };
        DownlinkModel.prototype.removeDownlink = function (view) {
            for (var i = 0; i < this._views.length; i += 1) {
                if (this._views[i] === view) {
                    this._views.splice(i, 1);
                    view.closeUp();
                }
            }
            if (this._views.length === 0) {
                this.unlink();
            }
        };
        DownlinkModel.prototype.onEventMessage = function (message, host) {
            for (var i = 0; i < this._views.length; i += 1) {
                this._views[i].onEventMessage(message);
            }
        };
        DownlinkModel.prototype.onCommandMessage = function (body) {
            for (var i = 0; i < this._views.length; i += 1) {
                this._views[i].onCommandMessage(body);
            }
        };
        DownlinkModel.prototype.onLinkRequest = function (request) {
            this._status |= LINKING;
            for (var i = 0; i < this._views.length; i += 1) {
                this._views[i].onLinkRequest(request);
            }
        };
        DownlinkModel.prototype.onLinkedResponse = function (response, host) {
            this._status = this._status & ~LINKING | LINKED;
            for (var i = 0; i < this._views.length; i += 1) {
                this._views[i].onLinkedResponse(response);
            }
        };
        DownlinkModel.prototype.onSyncRequest = function (request) {
            this._status |= SYNCING;
            for (var i = 0; i < this._views.length; i += 1) {
                this._views[i].onSyncRequest(request);
            }
        };
        DownlinkModel.prototype.onSyncedResponse = function (response, host) {
            this._status = this._status & ~SYNCING | SYNCED;
            for (var i = 0; i < this._views.length; i += 1) {
                this._views[i].onSyncedResponse(response);
            }
        };
        DownlinkModel.prototype.onUnlinkRequest = function (request, host) {
            this._status = this._status & ~(LINKING | SYNCING) | UNLINKING;
            for (var i = 0; i < this._views.length; i += 1) {
                this._views[i].onUnlinkRequest(request);
            }
        };
        DownlinkModel.prototype.onUnlinkedResponse = function (response, host) {
            this._status &= ~UNLINKING;
            for (var i = 0; i < this._views.length; i += 1) {
                this._views[i].onUnlinkedResponse(response);
            }
            if (this._status === 0) {
                this.close();
            }
        };
        DownlinkModel.prototype.hostDidConnect = function (host) {
            for (var i = 0; i < this._views.length; i += 1) {
                this._views[i].hostDidConnect();
            }
            var nodeUri = this._host.unresolve(this._nodeUri);
            var request;
            if (this.keepSynced()) {
                request = SyncRequest.of(nodeUri, this._laneUri, this._prio, this._rate, this._body);
                this.onSyncRequest(request);
            }
            else {
                request = LinkRequest.of(nodeUri, this._laneUri, this._prio, this._rate, this._body);
                this.onLinkRequest(request);
            }
            this._host.push(request);
        };
        DownlinkModel.prototype.hostDidDisconnect = function (host) {
            this._status = 0;
            var keepLinked = false;
            for (var i = 0; i < this._views.length; i += 1) {
                var view = this._views[i];
                view.hostDidDisconnect();
                keepLinked = keepLinked || view.keepLinked();
            }
            if (!keepLinked) {
                this.close();
            }
        };
        DownlinkModel.prototype.hostDidFail = function (error, host) {
            for (var i = 0; i < this._views.length; i += 1) {
                this._views[i].hostDidFail(error);
            }
        };
        DownlinkModel.prototype.command = function (body) {
            body = structure.Value.fromAny(body);
            this.onCommandMessage(body);
            this._host.command(this._nodeUri, this._laneUri, body);
        };
        DownlinkModel.prototype.unlink = function () {
            this._status = UNLINKING;
            this._context.unlinkDownlink(this);
        };
        DownlinkModel.prototype.close = function () {
            this._context.closeDownlink(this);
        };
        DownlinkModel.prototype.openUp = function (host) {
            this._host = host;
            for (var i = 0; i < this._views.length; i += 1) {
                this._views[i].openUp(host);
            }
        };
        DownlinkModel.prototype.closeUp = function () {
            var views = this._views;
            this._views = [];
            for (var i = 0; i < views.length; i += 1) {
                views[i].closeUp();
            }
        };
        return DownlinkModel;
    }());

    (function (DownlinkFlags) {
        DownlinkFlags[DownlinkFlags["KeepLinked"] = 1] = "KeepLinked";
        DownlinkFlags[DownlinkFlags["KeepSynced"] = 2] = "KeepSynced";
        DownlinkFlags[DownlinkFlags["KeepLinkedSynced"] = 3] = "KeepLinkedSynced";
    })(exports.DownlinkFlags || (exports.DownlinkFlags = {}));
    var Downlink = (function () {
        function Downlink(context, owner, init, hostUri, nodeUri, laneUri, prio, rate, body, flags, observers) {
            if (hostUri === void 0) { hostUri = uri.Uri.empty(); }
            if (nodeUri === void 0) { nodeUri = uri.Uri.empty(); }
            if (laneUri === void 0) { laneUri = uri.Uri.empty(); }
            if (prio === void 0) { prio = 0; }
            if (rate === void 0) { rate = 0; }
            if (body === void 0) { body = structure.Value.absent(); }
            if (flags === void 0) { flags = 0; }
            if (observers === void 0) { observers = null; }
            var observer;
            if (!observers) {
                observers = [];
            }
            else if (!Array.isArray(observers)) {
                observer = observers;
                observers = [observer];
            }
            if (init) {
                observer = observer || {};
                observers = observers ? observers.concat(observer) : [observer];
                hostUri = init.hostUri !== void 0 ? uri.Uri.fromAny(init.hostUri) : hostUri;
                nodeUri = init.nodeUri !== void 0 ? uri.Uri.fromAny(init.nodeUri) : nodeUri;
                laneUri = init.laneUri !== void 0 ? uri.Uri.fromAny(init.laneUri) : laneUri;
                prio = init.prio !== void 0 ? init.prio : prio;
                rate = init.rate !== void 0 ? init.rate : rate;
                body = init.body !== void 0 ? structure.Value.fromAny(init.body) : body;
                observer.onEvent = init.onEvent || observer.onEvent;
                observer.onCommand = init.onCommand || observer.onCommand;
                observer.willLink = init.willLink || observer.willLink;
                observer.didLink = init.didLink || observer.didLink;
                observer.willSync = init.willSync || observer.willSync;
                observer.didSync = init.didSync || observer.didSync;
                observer.willUnlink = init.willUnlink || observer.willUnlink;
                observer.didUnlink = init.didUnlink || observer.didUnlink;
                observer.didConnect = init.didConnect || observer.didConnect;
                observer.didDisconnect = init.didDisconnect || observer.didDisconnect;
                observer.didClose = init.didClose || observer.didClose;
                observer.didFail = init.didFail || observer.didFail;
            }
            this._context = context;
            this._owner = owner;
            this._hostUri = hostUri;
            this._nodeUri = nodeUri;
            this._laneUri = laneUri;
            this._prio = prio;
            this._rate = rate;
            this._body = body;
            this._flags = flags;
            this._model = null;
            this._observers = observers;
        }
        Downlink.prototype.hostUri = function (hostUri) {
            if (hostUri === void 0) {
                return this._hostUri;
            }
            else {
                hostUri = uri.Uri.fromAny(hostUri);
                return this.copy(this._context, this._owner, hostUri, this._nodeUri, this._laneUri, this._prio, this._rate, this._body, this._flags, this._observers);
            }
        };
        Downlink.prototype.nodeUri = function (nodeUri) {
            if (nodeUri === void 0) {
                return this._nodeUri;
            }
            else {
                nodeUri = uri.Uri.fromAny(nodeUri);
                return this.copy(this._context, this._owner, this._hostUri, nodeUri, this._laneUri, this._prio, this._rate, this._body, this._flags, this._observers);
            }
        };
        Downlink.prototype.laneUri = function (laneUri) {
            if (laneUri === void 0) {
                return this._laneUri;
            }
            else {
                laneUri = uri.Uri.fromAny(laneUri);
                return this.copy(this._context, this._owner, this._hostUri, this._nodeUri, laneUri, this._prio, this._rate, this._body, this._flags, this._observers);
            }
        };
        Downlink.prototype.prio = function (prio) {
            if (prio === void 0) {
                return this._prio;
            }
            else {
                return this.copy(this._context, this._owner, this._hostUri, this._nodeUri, this._laneUri, prio, this._rate, this._body, this._flags, this._observers);
            }
        };
        Downlink.prototype.rate = function (rate) {
            if (rate === void 0) {
                return this._rate;
            }
            else {
                return this.copy(this._context, this._owner, this._hostUri, this._nodeUri, this._laneUri, this._prio, rate, this._body, this._flags, this._observers);
            }
        };
        Downlink.prototype.body = function (body) {
            if (body === void 0) {
                return this._body;
            }
            else {
                body = structure.Value.fromAny(body);
                return this.copy(this._context, this._owner, this._hostUri, this._nodeUri, this._laneUri, this._prio, this._rate, body, this._flags, this._observers);
            }
        };
        Downlink.prototype.keepLinked = function (keepLinked) {
            if (keepLinked === void 0) {
                return (this._flags & 1) !== 0;
            }
            else {
                var flags = keepLinked ? this._flags | 1 : this._flags & ~1;
                return this.copy(this._context, this._owner, this._hostUri, this._nodeUri, this._laneUri, this._prio, this._rate, this._body, flags, this._observers);
            }
        };
        Downlink.prototype.keepSynced = function (keepSynced) {
            if (keepSynced === void 0) {
                return (this._flags & 2) !== 0;
            }
            else {
                var flags = keepSynced ? this._flags | 2 : this._flags & ~2;
                return this.copy(this._context, this._owner, this._hostUri, this._nodeUri, this._laneUri, this._prio, this._rate, this._body, flags, this._observers);
            }
        };
        Downlink.prototype.observe = function (observer) {
            var oldObservers = this._observers;
            var n = oldObservers ? oldObservers.length : 0;
            var newObservers = new Array(n + 1);
            for (var i = 0; i < n; i += 1) {
                newObservers[i] = oldObservers[i];
            }
            newObservers[n] = observer;
            this._observers = newObservers;
            return this;
        };
        Downlink.prototype.unobserve = function (observer) {
            var oldObservers = this._observers;
            var n = oldObservers ? oldObservers.length : 0;
            for (var i = 0; i < n; i += 1) {
                var oldObserver = oldObservers[i];
                var found = oldObserver === observer;
                if (!found) {
                    for (var key in oldObserver) {
                        if (oldObserver[key] === observer) {
                            found = true;
                            break;
                        }
                    }
                }
                if (found) {
                    if (n > 1) {
                        var newObservers = new Array(n - 1);
                        for (var j = 0; j < i; j += 1) {
                            newObservers[j] = oldObservers[j];
                        }
                        for (var j = i + 1; j < n; j += 1) {
                            newObservers[j - 1] = oldObservers[j];
                        }
                        this._observers = newObservers;
                    }
                    else {
                        this._observers = null;
                    }
                    break;
                }
            }
            return this;
        };
        Downlink.prototype.onEvent = function (onEvent) {
            return this.observe({ onEvent: onEvent });
        };
        Downlink.prototype.onCommand = function (onCommand) {
            return this.observe({ onCommand: onCommand });
        };
        Downlink.prototype.willLink = function (willLink) {
            return this.observe({ willLink: willLink });
        };
        Downlink.prototype.didLink = function (didLink) {
            return this.observe({ didLink: didLink });
        };
        Downlink.prototype.willSync = function (willSync) {
            return this.observe({ willSync: willSync });
        };
        Downlink.prototype.didSync = function (didSync) {
            return this.observe({ didSync: didSync });
        };
        Downlink.prototype.willUnlink = function (willUnlink) {
            return this.observe({ willUnlink: willUnlink });
        };
        Downlink.prototype.didUnlink = function (didUnlink) {
            return this.observe({ didUnlink: didUnlink });
        };
        Downlink.prototype.didConnect = function (didConnect) {
            return this.observe({ didConnect: didConnect });
        };
        Downlink.prototype.didDisconnect = function (didDisconnect) {
            return this.observe({ didDisconnect: didDisconnect });
        };
        Downlink.prototype.didClose = function (didClose) {
            return this.observe({ didClose: didClose });
        };
        Downlink.prototype.didFail = function (didFail) {
            return this.observe({ didFail: didFail });
        };
        Downlink.prototype.isConnected = function () {
            return this._model ? this._model.isConnected() : false;
        };
        Downlink.prototype.isAuthenticated = function () {
            return this._model ? this._model.isAuthenticated() : false;
        };
        Downlink.prototype.isLinked = function () {
            return this._model ? this._model.isLinked() : false;
        };
        Downlink.prototype.isSynced = function () {
            return this._model ? this._model.isSynced() : false;
        };
        Downlink.prototype.session = function () {
            return this._model ? this._model.session() : structure.Value.absent();
        };
        Downlink.prototype.onEventMessage = function (message) {
            var observers = this._observers;
            var n = observers ? observers.length : 0;
            for (var i = 0; i < n; i += 1) {
                var observer = observers[i];
                if (observer.onEvent) {
                    observer.onEvent(message.body(), this);
                }
            }
        };
        Downlink.prototype.onCommandMessage = function (body) {
            var observers = this._observers;
            var n = observers ? observers.length : 0;
            for (var i = 0; i < n; i += 1) {
                var observer = observers[i];
                if (observer.onCommand) {
                    observer.onCommand(body, this);
                }
            }
        };
        Downlink.prototype.onLinkRequest = function (request) {
            var observers = this._observers;
            var n = observers ? observers.length : 0;
            for (var i = 0; i < n; i += 1) {
                var observer = observers[i];
                if (observer.willLink) {
                    observer.willLink(this);
                }
            }
        };
        Downlink.prototype.onLinkedResponse = function (response) {
            var observers = this._observers;
            var n = observers ? observers.length : 0;
            for (var i = 0; i < n; i += 1) {
                var observer = observers[i];
                if (observer.didLink) {
                    observer.didLink(this);
                }
            }
        };
        Downlink.prototype.onSyncRequest = function (request) {
            var observers = this._observers;
            var n = observers ? observers.length : 0;
            for (var i = 0; i < n; i += 1) {
                var observer = observers[i];
                if (observer.willSync) {
                    observer.willSync(this);
                }
            }
        };
        Downlink.prototype.onSyncedResponse = function (response) {
            var observers = this._observers;
            var n = observers ? observers.length : 0;
            for (var i = 0; i < n; i += 1) {
                var observer = observers[i];
                if (observer.didSync) {
                    observer.didSync(this);
                }
            }
        };
        Downlink.prototype.onUnlinkRequest = function (request) {
            var observers = this._observers;
            var n = observers ? observers.length : 0;
            for (var i = 0; i < n; i += 1) {
                var observer = observers[i];
                if (observer.willUnlink) {
                    observer.willUnlink(this);
                }
            }
        };
        Downlink.prototype.onUnlinkedResponse = function (response) {
            var observers = this._observers;
            var n = observers ? observers.length : 0;
            for (var i = 0; i < n; i += 1) {
                var observer = observers[i];
                if (observer.didUnlink) {
                    observer.didUnlink(this);
                }
            }
        };
        Downlink.prototype.hostDidConnect = function () {
            var observers = this._observers;
            var n = observers ? observers.length : 0;
            for (var i = 0; i < n; i += 1) {
                var observer = observers[i];
                if (observer.didConnect) {
                    observer.didConnect(this);
                }
            }
        };
        Downlink.prototype.hostDidDisconnect = function () {
            var observers = this._observers;
            var n = observers ? observers.length : 0;
            for (var i = 0; i < n; i += 1) {
                var observer = observers[i];
                if (observer.didDisconnect) {
                    observer.didDisconnect(this);
                }
            }
        };
        Downlink.prototype.hostDidFail = function (error) {
            var observers = this._observers;
            var n = observers ? observers.length : 0;
            for (var i = 0; i < n; i += 1) {
                var observer = observers[i];
                if (observer.didFail) {
                    observer.didFail(error, this);
                }
            }
        };
        Downlink.prototype.command = function (body) {
            this._model.command(body);
        };
        Downlink.prototype.close = function () {
            if (this._owner) {
                this._owner.removeDownlink(this);
            }
            if (this._model) {
                this._model.removeDownlink(this);
            }
        };
        Downlink.prototype.openUp = function (host) {
        };
        Downlink.prototype.closeUp = function () {
            var observers = this._observers;
            var n = observers ? observers.length : 0;
            for (var i = 0; i < n; i += 1) {
                var observer = observers[i];
                if (observer.didClose) {
                    observer.didClose(this);
                }
            }
        };
        Downlink.initForm = function () {
            if (!Downlink._initForm) {
                Downlink._initForm = new DownlinkInitForm();
            }
            return Downlink._initForm;
        };
        return Downlink;
    }());
    var DownlinkInitForm = (function (_super) {
        __extends(DownlinkInitForm, _super);
        function DownlinkInitForm() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DownlinkInitForm.prototype.tag = function (tag) {
            if (arguments.length === 0) {
                return "link";
            }
            else if (tag !== void 0) {
                return _super.prototype.tag.call(this, tag);
            }
            else {
                return this;
            }
        };
        DownlinkInitForm.prototype.mold = function (init) {
            if (init) {
                var header = structure.Record.create();
                if (init.hostUri !== void 0) {
                    header.slot("host", uri.Uri.fromAny(init.hostUri).toString());
                }
                if (init.nodeUri !== void 0) {
                    header.slot("node", uri.Uri.fromAny(init.nodeUri).toString());
                }
                if (init.laneUri !== void 0) {
                    header.slot("lane", uri.Uri.fromAny(init.laneUri).toString());
                }
                if (init.prio !== void 0) {
                    header.slot("prio", init.prio);
                }
                if (init.rate !== void 0) {
                    header.slot("rate", init.rate);
                }
                if (init.body !== void 0) {
                    header.slot("body", init.body);
                }
                if (init.type !== void 0) {
                    header.slot("type", init.type);
                }
                return structure.Record.of(structure.Attr.of("link", header));
            }
            else {
                return structure.Item.extant();
            }
        };
        DownlinkInitForm.prototype.cast = function (item) {
            var value = item.toValue();
            var header = value.get("link");
            if (header.isDefined()) {
                var init = {};
                var host = header.get("host");
                if (host.isDefined()) {
                    init.hostUri = host.cast(uri.Uri.form());
                }
                var node = header.get("node");
                if (node.isDefined()) {
                    init.nodeUri = node.cast(uri.Uri.form());
                }
                var lane = header.get("lane");
                if (lane.isDefined()) {
                    init.laneUri = lane.cast(uri.Uri.form());
                }
                var prio = header.get("prio");
                if (prio.isDefined()) {
                    init.prio = prio.numberValue();
                }
                var rate = header.get("rate");
                if (rate.isDefined()) {
                    init.rate = rate.numberValue();
                }
                var body = header.get("body");
                if (body.isDefined()) {
                    init.body = body;
                }
                var type = header.get("type");
                if (type.isDefined()) {
                    init.type = type.stringValue();
                }
                return init;
            }
            return void 0;
        };
        return DownlinkInitForm;
    }(structure.Form));

    var EventDownlinkModel = (function (_super) {
        __extends(EventDownlinkModel, _super);
        function EventDownlinkModel(context, hostUri, nodeUri, laneUri, prio, rate, body) {
            return _super.call(this, context, hostUri, nodeUri, laneUri, prio, rate, body) || this;
        }
        EventDownlinkModel.prototype.type = function () {
            return "event";
        };
        return EventDownlinkModel;
    }(DownlinkModel));

    var EventDownlink = (function (_super) {
        __extends(EventDownlink, _super);
        function EventDownlink(context, owner, init, hostUri, nodeUri, laneUri, prio, rate, body, flags, observers) {
            if (flags === void 0) { flags = 1; }
            return _super.call(this, context, owner, init, hostUri, nodeUri, laneUri, prio, rate, body, flags, observers) || this;
        }
        EventDownlink.prototype.copy = function (context, owner, hostUri, nodeUri, laneUri, prio, rate, body, flags, observers) {
            return new EventDownlink(context, owner, void 0, hostUri, nodeUri, laneUri, prio, rate, body, flags, observers);
        };
        EventDownlink.prototype.type = function () {
            return "event";
        };
        EventDownlink.prototype.observe = function (observer) {
            return _super.prototype.observe.call(this, observer);
        };
        EventDownlink.prototype.open = function () {
            var laneUri = this._laneUri;
            if (laneUri.isEmpty()) {
                throw new Error("no lane");
            }
            var nodeUri = this._nodeUri;
            if (nodeUri.isEmpty()) {
                throw new Error("no node");
            }
            var hostUri = this._hostUri;
            if (hostUri.isEmpty()) {
                hostUri = nodeUri.endpoint();
                nodeUri = hostUri.unresolve(nodeUri);
            }
            var model = this._context.getDownlink(hostUri, nodeUri, laneUri);
            if (model) {
                if (!(model instanceof EventDownlinkModel)) {
                    throw new Error("downlink type mismatch");
                }
                model.addDownlink(this);
            }
            else {
                model = new EventDownlinkModel(this._context, hostUri, nodeUri, laneUri, this._prio, this._rate, this._body);
                model.addDownlink(this);
                this._context.openDownlink(model);
            }
            this._model = model;
            if (this._owner) {
                this._owner.addDownlink(this);
            }
            return this;
        };
        return EventDownlink;
    }(Downlink));

    var ListDownlinkModel = (function (_super) {
        __extends(ListDownlinkModel, _super);
        function ListDownlinkModel(context, hostUri, nodeUri, laneUri, prio, rate, body, state) {
            if (state === void 0) { state = new collections.STree(); }
            var _this = _super.call(this, context, hostUri, nodeUri, laneUri, prio, rate, body) || this;
            _this._state = state;
            return _this;
        }
        ListDownlinkModel.prototype.type = function () {
            return "list";
        };
        ListDownlinkModel.prototype.isEmpty = function () {
            return this._state.isEmpty();
        };
        Object.defineProperty(ListDownlinkModel.prototype, "length", {
            get: function () {
                return this._state.length;
            },
            enumerable: true,
            configurable: true
        });
        ListDownlinkModel.prototype.get = function (index, key) {
            return this._state.get(index, key) || structure.Value.absent();
        };
        ListDownlinkModel.prototype.getEntry = function (index, key) {
            return this._state.getEntry(index, key);
        };
        ListDownlinkModel.prototype.set = function (index, newValue, key) {
            if (key !== void 0) {
                index = this._state.lookup(key, index);
                if (index < 0) {
                    throw new RangeError("" + key);
                }
            }
            if (index < 0 || index >= this._state.length) {
                throw new RangeError("" + index);
            }
            newValue = this.listWillUpdate(index, newValue);
            var oldEntry = this._state.getEntry(index);
            this._state.set(index, newValue);
            this.listDidUpdate(index, newValue, oldEntry[1]);
            var header = structure.Record.create(2).slot("key", oldEntry[0]).slot("index", index);
            this.command(structure.Attr.of("update", header).concat(newValue));
            return this;
        };
        ListDownlinkModel.prototype.insert = function (index, newValue, key) {
            if (index < 0 || index > this._state.length) {
                throw new RangeError("" + index);
            }
            newValue = this.listWillUpdate(index, newValue);
            this._state.insert(index, newValue, key);
            var newEntry = this._state.getEntry(index);
            this.listDidUpdate(index, newValue, structure.Value.absent());
            var header = structure.Record.create(2).slot("key", newEntry[0]).slot("index", index);
            this.command(structure.Attr.of("update", header).concat(newValue));
            return this;
        };
        ListDownlinkModel.prototype.remove = function (index, key) {
            if (key !== void 0) {
                index = this._state.lookup(key, index);
                if (index < 0) {
                    throw new RangeError("" + key);
                }
            }
            if (index < 0 || index > this._state.length) {
                throw new RangeError("" + index);
            }
            this.listWillRemove(index);
            var oldEntry = this._state.getEntry(index);
            this._state.remove(index);
            this.listDidRemove(index, oldEntry[1]);
            var header = structure.Record.create(2).slot("key", oldEntry[0]).slot("index", index);
            this.command(structure.Record.create(1).attr("remove", header));
            return this;
        };
        ListDownlinkModel.prototype.push = function () {
            var newValues = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                newValues[_i] = arguments[_i];
            }
            for (var i = 0; i < newValues.length; i += 1) {
                var index = this._state.length + i;
                var newValue = this.listWillUpdate(index, newValues[i]);
                this._state.insert(index, newValue);
                var newEntry = this._state.getEntry(index);
                this.listDidUpdate(index, newValue, structure.Value.absent());
                var header = structure.Record.create(2).slot("key", newEntry[0]).slot("index", index);
                this.command(structure.Attr.of("update", header).concat(newValue));
            }
            return this._state.length;
        };
        ListDownlinkModel.prototype.pop = function () {
            var index = this._state.length - 1;
            if (index >= 0) {
                this.listWillRemove(index);
                var oldEntry = this._state.getEntry(index);
                this._state.remove(index);
                this.listDidRemove(index, oldEntry[1]);
                var header = structure.Record.create(2).slot("key", oldEntry[0]).slot("index", index);
                this.command(structure.Record.create(1).attr("remove", header));
                return oldEntry[1];
            }
            else {
                return structure.Value.absent();
            }
        };
        ListDownlinkModel.prototype.unshift = function () {
            var newValues = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                newValues[_i] = arguments[_i];
            }
            for (var i = newValues.length - 1; i >= 0; i -= 1) {
                var newValue = this.listWillUpdate(0, newValues[i]);
                this._state.insert(0, newValue);
                var newEntry = this._state.getEntry(0);
                this.listDidUpdate(0, newValue, structure.Value.absent());
                var header = structure.Record.create(2).slot("key", newEntry[0]).slot("index", 0);
                this.command(structure.Attr.of("update", header).concat(newValue));
            }
            return this._state.length;
        };
        ListDownlinkModel.prototype.shift = function () {
            if (this._state.length > 0) {
                this.listWillRemove(0);
                var oldEntry = this._state.getEntry(0);
                this._state.remove(0);
                this.listDidRemove(0, oldEntry[1]);
                var header = structure.Record.create(2).slot("key", oldEntry[0]).slot("index", 0);
                this.command(structure.Record.create(1).attr("remove", header));
                return oldEntry[1];
            }
            else {
                return structure.Value.absent();
            }
        };
        ListDownlinkModel.prototype.move = function (fromIndex, toIndex, key) {
            if (key !== void 0) {
                fromIndex = this._state.lookup(key, fromIndex);
                if (fromIndex < 0) {
                    throw new RangeError("" + key);
                }
            }
            if (fromIndex < 0 || fromIndex >= this._state.length) {
                throw new RangeError("" + fromIndex);
            }
            if (toIndex < 0 || toIndex >= this._state.length) {
                throw new RangeError("" + toIndex);
            }
            if (fromIndex !== toIndex) {
                var entry = this._state.getEntry(fromIndex);
                this.listWillMove(fromIndex, toIndex, entry[1]);
                this._state.remove(fromIndex).insert(toIndex, entry[1], entry[0]);
                this.listDidMove(fromIndex, toIndex, entry[1]);
                var header = structure.Record.create(2).slot("key", entry[0]).slot("from", fromIndex).slot("to", toIndex);
                this.command(structure.Record.create(1).attr("move", header));
            }
            return this;
        };
        ListDownlinkModel.prototype.splice = function (start, deleteCount) {
            var newValues = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                newValues[_i - 2] = arguments[_i];
            }
            if (start < 0) {
                start = this._state.length + start;
            }
            start = Math.min(Math.max(0, start), this._state.length);
            if (deleteCount === void 0) {
                deleteCount = this._state.length - start;
            }
            var deleted = [];
            for (var i = start, n = start + deleteCount; i < n; i += 1) {
                this.listWillRemove(start);
                var oldEntry = this._state.getEntry(start);
                deleted.push(oldEntry[1]);
                this._state.remove(start);
                this.listDidRemove(start, oldEntry[1]);
                var header = structure.Record.create(2).slot("key", oldEntry[0]).slot("index", start);
                this.command(structure.Record.create(1).attr("remove", header));
            }
            for (var i = 0; i < newValues.length; i += 1) {
                var index = start + i;
                var newValue = this.listWillUpdate(index, newValues[i]);
                this._state.insert(index, newValue);
                var newEntry = this._state.getEntry(index);
                this.listDidUpdate(index, newValue, structure.Value.absent());
                var header = structure.Record.create(2).slot("key", newEntry[0]).slot("index", index);
                this.command(structure.Attr.of("update", header).concat(newValue));
            }
            return deleted;
        };
        ListDownlinkModel.prototype.clear = function () {
            this.listWillClear();
            this._state.clear();
            this.listDidClear();
            this.command(structure.Record.create(1).attr("clear"));
        };
        ListDownlinkModel.prototype.forEach = function (callback, thisArg) {
            return this._state.forEach(function (value, index, tree, key) {
                return callback.call(thisArg, value, index, this, key);
            }, this);
        };
        ListDownlinkModel.prototype.values = function () {
            return this._state.values();
        };
        ListDownlinkModel.prototype.keys = function () {
            return this._state.keys();
        };
        ListDownlinkModel.prototype.entries = function () {
            return this._state.entries();
        };
        ListDownlinkModel.prototype.snapshot = function () {
            return this._state.clone();
        };
        ListDownlinkModel.prototype.setState = function (state) {
            this._state = state;
        };
        ListDownlinkModel.prototype.onEventMessage = function (message, host) {
            _super.prototype.onEventMessage.call(this, message, host);
            var event = message.body();
            var tag = event.tag();
            if (tag === "update") {
                var header = event.head().toValue();
                var index = this._state.lookup(header.get("key"), header.get("index").numberValue());
                if (index >= 0) {
                    this.onUpdateEvent(index, event.body(), header.get("key"));
                }
                else {
                    this.onInsertEvent(header.get("index").numberValue(0), event.body(), header.get("key"));
                }
            }
            else if (tag === "move") {
                var header = event.head().toValue();
                var index = this._state.lookup(header.get("key"), header.get("from").numberValue());
                if (index >= 0) {
                    this.onMoveEvent(index, header.get("to").numberValue(0), header.get("key"));
                }
            }
            else if (tag === "remove") {
                var header = event.head().toValue();
                var index = this._state.lookup(header.get("key"), header.get("index").numberValue());
                if (index >= 0) {
                    this.onRemoveEvent(index, header.get("key"));
                }
            }
            else if (tag === "drop") {
                var header = event.head();
                this.onDropEvent(header.numberValue(0));
            }
            else if (tag === "take") {
                var header = event.head();
                this.onTakeEvent(header.numberValue(0));
            }
            else if (tag === "clear") {
                this.onClearEvent();
            }
        };
        ListDownlinkModel.prototype.onInsertEvent = function (index, newValue, key) {
            newValue = this.listWillUpdate(index, newValue);
            this._state.insert(index, newValue, key);
            this.listDidUpdate(index, newValue, structure.Value.absent());
        };
        ListDownlinkModel.prototype.onUpdateEvent = function (index, newValue, key) {
            newValue = this.listWillUpdate(index, newValue);
            var oldValue = this._state.get(index) || structure.Value.absent();
            this._state.set(index, newValue);
            this.listDidUpdate(index, newValue, oldValue);
        };
        ListDownlinkModel.prototype.onMoveEvent = function (fromIndex, toIndex, key) {
            toIndex = Math.min(Math.max(0, toIndex), this._state.length);
            if (fromIndex !== toIndex) {
                var value = this._state.get(fromIndex) || structure.Value.absent();
                this.listWillMove(fromIndex, toIndex, value);
                this._state.remove(fromIndex).insert(toIndex, value, key);
                this.listDidMove(fromIndex, toIndex, value);
            }
        };
        ListDownlinkModel.prototype.onRemoveEvent = function (index, key) {
            this.listWillRemove(index);
            var oldValue = this._state.get(index) || structure.Value.absent();
            this._state.remove(index);
            this.listDidRemove(index, oldValue);
        };
        ListDownlinkModel.prototype.onDropEvent = function (lower) {
            this.listWillDrop(lower);
            this._state.drop(lower);
            this.listDidDrop(lower);
        };
        ListDownlinkModel.prototype.onTakeEvent = function (upper) {
            this.listWillTake(upper);
            this._state.take(upper);
            this.listDidTake(upper);
        };
        ListDownlinkModel.prototype.onClearEvent = function () {
            this.listWillClear();
            this._state.clear();
            this.listDidClear();
        };
        ListDownlinkModel.prototype.listWillUpdate = function (index, newValue) {
            for (var i = 0; i < this._views.length; i += 1) {
                newValue = this._views[i].listWillUpdate(index, newValue);
            }
            return newValue;
        };
        ListDownlinkModel.prototype.listDidUpdate = function (index, newValue, oldValue) {
            for (var i = 0; i < this._views.length; i += 1) {
                this._views[i].listDidUpdate(index, newValue, oldValue);
            }
        };
        ListDownlinkModel.prototype.listWillMove = function (fromIndex, toIndex, value) {
            for (var i = 0; i < this._views.length; i += 1) {
                this._views[i].listWillMove(fromIndex, toIndex, value);
            }
        };
        ListDownlinkModel.prototype.listDidMove = function (fromIndex, toIndex, value) {
            for (var i = 0; i < this._views.length; i += 1) {
                this._views[i].listDidMove(fromIndex, toIndex, value);
            }
        };
        ListDownlinkModel.prototype.listWillRemove = function (index) {
            for (var i = 0; i < this._views.length; i += 1) {
                this._views[i].listWillRemove(index);
            }
        };
        ListDownlinkModel.prototype.listDidRemove = function (index, oldValue) {
            for (var i = 0; i < this._views.length; i += 1) {
                this._views[i].listDidRemove(index, oldValue);
            }
        };
        ListDownlinkModel.prototype.listWillDrop = function (lower) {
            for (var i = 0; i < this._views.length; i += 1) {
                this._views[i].listWillDrop(lower);
            }
        };
        ListDownlinkModel.prototype.listDidDrop = function (lower) {
            for (var i = 0; i < this._views.length; i += 1) {
                this._views[i].listDidDrop(lower);
            }
        };
        ListDownlinkModel.prototype.listWillTake = function (upper) {
            for (var i = 0; i < this._views.length; i += 1) {
                this._views[i].listWillTake(upper);
            }
        };
        ListDownlinkModel.prototype.listDidTake = function (upper) {
            for (var i = 0; i < this._views.length; i += 1) {
                this._views[i].listDidTake(upper);
            }
        };
        ListDownlinkModel.prototype.listWillClear = function () {
            for (var i = 0; i < this._views.length; i += 1) {
                this._views[i].listWillClear();
            }
        };
        ListDownlinkModel.prototype.listDidClear = function () {
            for (var i = 0; i < this._views.length; i += 1) {
                this._views[i].listDidClear();
            }
        };
        return ListDownlinkModel;
    }(DownlinkModel));

    var ListDownlink = (function (_super) {
        __extends(ListDownlink, _super);
        function ListDownlink(context, owner, init, hostUri, nodeUri, laneUri, prio, rate, body, flags, observers, valueForm, state0) {
            if (flags === void 0) { flags = 3; }
            var _this = _super.call(this, context, owner, init, hostUri, nodeUri, laneUri, prio, rate, body, flags, observers) || this;
            if (init) {
                var observer = _this._observers[_this._observers.length - 1];
                observer.willUpdate = init.willUpdate || observer.willUpdate;
                observer.didUpdate = init.didUpdate || observer.didUpdate;
                observer.willMove = init.willMove || observer.willMove;
                observer.didMove = init.didMove || observer.didMove;
                observer.willRemove = init.willRemove || observer.willRemove;
                observer.didRemove = init.didRemove || observer.didRemove;
                observer.willDrop = init.willDrop || observer.willDrop;
                observer.didDrop = init.didDrop || observer.didDrop;
                observer.willTake = init.willTake || observer.willTake;
                observer.didTake = init.didTake || observer.didTake;
                observer.willClear = init.willClear || observer.willClear;
                observer.didClear = init.didClear || observer.didClear;
                valueForm = init.valueForm ? init.valueForm : valueForm;
            }
            _this._valueForm = valueForm || structure.Form.forValue();
            _this._state0 = state0;
            return _this;
        }
        ListDownlink.prototype.copy = function (context, owner, hostUri, nodeUri, laneUri, prio, rate, body, flags, observers, valueForm, state0) {
            if (arguments.length === 10) {
                valueForm = this._valueForm;
                state0 = this._state0;
            }
            return new ListDownlink(context, owner, void 0, hostUri, nodeUri, laneUri, prio, rate, body, flags, observers, valueForm, state0);
        };
        ListDownlink.prototype.type = function () {
            return "list";
        };
        ListDownlink.prototype.valueForm = function (valueForm) {
            if (valueForm === void 0) {
                return this._valueForm;
            }
            else {
                return this.copy(this._context, this._owner, this._hostUri, this._nodeUri, this._laneUri, this._prio, this._rate, this._body, this._flags, this._observers, valueForm, this._state0);
            }
        };
        ListDownlink.prototype.isEmpty = function () {
            return this._model.isEmpty();
        };
        Object.defineProperty(ListDownlink.prototype, "length", {
            get: function () {
                return this._model.length;
            },
            enumerable: true,
            configurable: true
        });
        ListDownlink.prototype.get = function (index, id) {
            var value = this._model.get(index, id);
            return value.coerce(this._valueForm);
        };
        ListDownlink.prototype.getEntry = function (index, id) {
            var entry = this._model.getEntry(index, id);
            if (entry) {
                return [entry[0].coerce(this._valueForm), entry[1]];
            }
            return void 0;
        };
        ListDownlink.prototype.set = function (index, newObject, id) {
            var newValue = this._valueForm.mold(newObject);
            this._model.set(index, newValue, id);
            return this;
        };
        ListDownlink.prototype.insert = function (index, newObject, id) {
            var newValue = this._valueForm.mold(newObject);
            this._model.insert(index, newValue, id);
            return this;
        };
        ListDownlink.prototype.remove = function (index, id) {
            this._model.remove(index, id);
            return this;
        };
        ListDownlink.prototype.push = function () {
            var newObjects = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                newObjects[_i] = arguments[_i];
            }
            var newValues = new Array(newObjects.length);
            for (var i = 0; i < newObjects.length; i += 1) {
                newValues[i] = this._valueForm.mold(newObjects[i]);
            }
            return this._model.push.apply(this._model, newValues);
        };
        ListDownlink.prototype.pop = function () {
            var value = this._model.pop();
            return value.coerce(this._valueForm);
        };
        ListDownlink.prototype.unshift = function () {
            var newObjects = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                newObjects[_i] = arguments[_i];
            }
            var newValues = new Array(newObjects.length);
            for (var i = 0; i < newObjects.length; i += 1) {
                newValues[i] = this._valueForm.mold(newObjects[i]);
            }
            return this._model.unshift.apply(this._model, newValues);
        };
        ListDownlink.prototype.shift = function () {
            var value = this._model.shift();
            return value.coerce(this._valueForm);
        };
        ListDownlink.prototype.move = function (fromIndex, toIndex, id) {
            this._model.move(fromIndex, toIndex, id);
            return this;
        };
        ListDownlink.prototype.splice = function (start, deleteCount) {
            var _a;
            var newObjects = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                newObjects[_i - 2] = arguments[_i];
            }
            var newValues = new Array(newObjects.length);
            for (var i = 0; i < newObjects.length; i += 1) {
                newValues[i] = this._valueForm.mold(newObjects[i]);
            }
            var oldValues = (_a = this._model).splice.apply(_a, [start, deleteCount].concat(newValues));
            var oldObjects = new Array(oldValues.length);
            for (var i = 0; i < oldValues.length; i += 1) {
                oldObjects[i] = oldValues[i].coerce(this._valueForm);
            }
            return oldObjects;
        };
        ListDownlink.prototype.clear = function () {
            this._model.clear();
        };
        ListDownlink.prototype.forEach = function (callback, thisArg) {
            if (this._valueForm === structure.Form.forValue()) {
                return this._model._state.forEach(callback, thisArg);
            }
            else {
                return this._model._state.forEach(function (value, index, tree, id) {
                    var object = value.coerce(this._valueForm);
                    return callback.call(thisArg, object, index, this, id);
                }, this);
            }
        };
        ListDownlink.prototype.values = function () {
            var cursor = this._model.values();
            if (this._valueForm === structure.Form.forValue()) {
                return cursor;
            }
            else {
                return new structure.ValueCursor(cursor, this._valueForm);
            }
        };
        ListDownlink.prototype.keys = function () {
            return this._model.keys();
        };
        ListDownlink.prototype.entries = function () {
            var cursor = this._model.entries();
            if (this._valueForm === structure.Form.forValue()) {
                return cursor;
            }
            else {
                return new structure.ValueEntryCursor(cursor, structure.Form.forValue(), this._valueForm);
            }
        };
        ListDownlink.prototype.snapshot = function () {
            return this._model.snapshot();
        };
        ListDownlink.prototype.setState = function (state) {
            this._model.setState(state);
        };
        ListDownlink.prototype.observe = function (observer) {
            return _super.prototype.observe.call(this, observer);
        };
        ListDownlink.prototype.willUpdate = function (willUpdate) {
            return this.observe({ willUpdate: willUpdate });
        };
        ListDownlink.prototype.didUpdate = function (didUpdate) {
            return this.observe({ didUpdate: didUpdate });
        };
        ListDownlink.prototype.willMove = function (willMove) {
            return this.observe({ willMove: willMove });
        };
        ListDownlink.prototype.didMove = function (didMove) {
            return this.observe({ didMove: didMove });
        };
        ListDownlink.prototype.willRemove = function (willRemove) {
            return this.observe({ willRemove: willRemove });
        };
        ListDownlink.prototype.didRemove = function (didRemove) {
            return this.observe({ didRemove: didRemove });
        };
        ListDownlink.prototype.willDrop = function (willDrop) {
            return this.observe({ willDrop: willDrop });
        };
        ListDownlink.prototype.didDrop = function (didDrop) {
            return this.observe({ didDrop: didDrop });
        };
        ListDownlink.prototype.willTake = function (willTake) {
            return this.observe({ willTake: willTake });
        };
        ListDownlink.prototype.didTake = function (didTake) {
            return this.observe({ didTake: didTake });
        };
        ListDownlink.prototype.willClear = function (willClear) {
            return this.observe({ willClear: willClear });
        };
        ListDownlink.prototype.didClear = function (didClear) {
            return this.observe({ didClear: didClear });
        };
        ListDownlink.prototype.listWillUpdate = function (index, newValue) {
            var observers = this._observers;
            var n = observers ? observers.length : 0;
            var newObject;
            for (var i = 0; i < n; i += 1) {
                var observer = observers[i];
                if (observer.willUpdate) {
                    if (newObject === void 0) {
                        newObject = newValue.coerce(this._valueForm);
                    }
                    var newResult = observer.willUpdate(index, newObject, this);
                    if (newResult !== void 0) {
                        newObject = newResult;
                        newValue = this._valueForm.mold(newObject);
                    }
                }
            }
            return newValue;
        };
        ListDownlink.prototype.listDidUpdate = function (index, newValue, oldValue) {
            var observers = this._observers;
            var n = observers ? observers.length : 0;
            var newObject;
            var oldObject;
            for (var i = 0; i < n; i += 1) {
                var observer = observers[i];
                if (observer.didUpdate) {
                    if (newObject === void 0) {
                        newObject = newValue.coerce(this._valueForm);
                    }
                    if (oldObject === void 0) {
                        oldObject = oldValue.coerce(this._valueForm);
                    }
                    observer.didUpdate(index, newObject, oldObject, this);
                }
            }
        };
        ListDownlink.prototype.listWillMove = function (fromIndex, toIndex, value) {
            var observers = this._observers;
            var n = observers ? observers.length : 0;
            var object;
            for (var i = 0; i < n; i += 1) {
                var observer = observers[i];
                if (observer.willMove) {
                    if (object === void 0) {
                        object = value.coerce(this._valueForm);
                    }
                    observer.willMove(fromIndex, toIndex, object, this);
                }
            }
        };
        ListDownlink.prototype.listDidMove = function (fromIndex, toIndex, value) {
            var observers = this._observers;
            var n = observers ? observers.length : 0;
            var object;
            for (var i = 0; i < n; i += 1) {
                var observer = observers[i];
                if (observer.didMove) {
                    if (object === void 0) {
                        object = value.coerce(this._valueForm);
                    }
                    observer.didMove(fromIndex, toIndex, object, this);
                }
            }
        };
        ListDownlink.prototype.listWillRemove = function (index) {
            var observers = this._observers;
            var n = observers ? observers.length : 0;
            for (var i = 0; i < n; i += 1) {
                var observer = observers[i];
                if (observer.willRemove) {
                    observer.willRemove(index, this);
                }
            }
        };
        ListDownlink.prototype.listDidRemove = function (index, oldValue) {
            var observers = this._observers;
            var n = observers ? observers.length : 0;
            var oldObject;
            for (var i = 0; i < n; i += 1) {
                var observer = observers[i];
                if (observer.didRemove) {
                    if (oldObject === void 0) {
                        oldObject = oldValue.coerce(this._valueForm);
                    }
                    observer.didRemove(index, oldObject, this);
                }
            }
        };
        ListDownlink.prototype.listWillDrop = function (lower) {
            var observers = this._observers;
            var n = observers ? observers.length : 0;
            for (var i = 0; i < n; i += 1) {
                var observer = observers[i];
                if (observer.willDrop) {
                    observer.willDrop(lower, this);
                }
            }
        };
        ListDownlink.prototype.listDidDrop = function (lower) {
            var observers = this._observers;
            var n = observers ? observers.length : 0;
            for (var i = 0; i < n; i += 1) {
                var observer = observers[i];
                if (observer.didDrop) {
                    observer.didDrop(lower, this);
                }
            }
        };
        ListDownlink.prototype.listWillTake = function (upper) {
            var observers = this._observers;
            var n = observers ? observers.length : 0;
            for (var i = 0; i < n; i += 1) {
                var observer = observers[i];
                if (observer.willTake) {
                    observer.willTake(upper, this);
                }
            }
        };
        ListDownlink.prototype.listDidTake = function (upper) {
            var observers = this._observers;
            var n = observers ? observers.length : 0;
            for (var i = 0; i < n; i += 1) {
                var observer = observers[i];
                if (observer.didTake) {
                    observer.didTake(upper, this);
                }
            }
        };
        ListDownlink.prototype.listWillClear = function () {
            var observers = this._observers;
            var n = observers ? observers.length : 0;
            for (var i = 0; i < n; i += 1) {
                var observer = observers[i];
                if (observer.willClear) {
                    observer.willClear(this);
                }
            }
        };
        ListDownlink.prototype.listDidClear = function () {
            var observers = this._observers;
            var n = observers ? observers.length : 0;
            for (var i = 0; i < n; i += 1) {
                var observer = observers[i];
                if (observer.didClear) {
                    observer.didClear(this);
                }
            }
        };
        ListDownlink.prototype.initialState = function (state0) {
            if (state0 === void 0) {
                return this._state0 || null;
            }
            else {
                return this.copy(this._context, this._owner, this._hostUri, this._nodeUri, this._laneUri, this._prio, this._rate, this._body, this._flags, this._observers, this._valueForm, state0 || void 0);
            }
        };
        ListDownlink.prototype.didAliasModel = function () {
            this.onLinkedResponse();
            this._model._state.forEach(function (value, index) {
                this.listDidUpdate(index, value, structure.Value.absent());
            }, this);
            this.onSyncedResponse();
        };
        ListDownlink.prototype.open = function () {
            var laneUri = this._laneUri;
            if (laneUri.isEmpty()) {
                throw new Error("no lane");
            }
            var nodeUri = this._nodeUri;
            if (nodeUri.isEmpty()) {
                throw new Error("no node");
            }
            var hostUri = this._hostUri;
            if (hostUri.isEmpty()) {
                hostUri = nodeUri.endpoint();
                nodeUri = hostUri.unresolve(nodeUri);
            }
            var model = this._context.getDownlink(hostUri, nodeUri, laneUri);
            if (model) {
                if (!(model instanceof ListDownlinkModel)) {
                    throw new Error("downlink type mismatch");
                }
                model.addDownlink(this);
                this._model = model;
                this.didAliasModel();
            }
            else {
                model = new ListDownlinkModel(this._context, hostUri, nodeUri, laneUri, this._prio, this._rate, this._body, this._state0);
                model.addDownlink(this);
                this._context.openDownlink(model);
                this._model = model;
            }
            if (this._owner) {
                this._owner.addDownlink(this);
            }
            return this;
        };
        return ListDownlink;
    }(Downlink));

    var MapDownlinkModel = (function (_super) {
        __extends(MapDownlinkModel, _super);
        function MapDownlinkModel(context, hostUri, nodeUri, laneUri, prio, rate, body, state) {
            if (state === void 0) { state = new collections.BTree(); }
            var _this = _super.call(this, context, hostUri, nodeUri, laneUri, prio, rate, body) || this;
            _this._state = state;
            return _this;
        }
        MapDownlinkModel.prototype.type = function () {
            return "map";
        };
        Object.defineProperty(MapDownlinkModel.prototype, "size", {
            get: function () {
                return this._state.size;
            },
            enumerable: true,
            configurable: true
        });
        MapDownlinkModel.prototype.isEmpty = function () {
            return this._state.isEmpty();
        };
        MapDownlinkModel.prototype.has = function (key) {
            return this._state.has(key);
        };
        MapDownlinkModel.prototype.get = function (key) {
            return this._state.get(key) || structure.Value.absent();
        };
        MapDownlinkModel.prototype.getEntry = function (index) {
            return this._state.getEntry(index);
        };
        MapDownlinkModel.prototype.set = function (key, newValue) {
            newValue = this.mapWillUpdate(key, newValue);
            var oldValue = this._state.get(key) || structure.Value.absent();
            this._state.set(key, newValue);
            this.mapDidUpdate(key, newValue, oldValue);
            var header = structure.Record.create(1).slot("key", key);
            this.command(structure.Attr.of("update", header).concat(newValue));
            return this;
        };
        MapDownlinkModel.prototype.delete = function (key) {
            if (this._state.has(key)) {
                this.mapWillRemove(key);
                var oldValue = this._state.get(key) || structure.Value.absent();
                this._state.delete(key);
                this.mapDidRemove(key, oldValue);
                var header = structure.Record.create(1).slot("key", key);
                this.command(structure.Record.create(1).attr("remove", header));
                return true;
            }
            else {
                return false;
            }
        };
        MapDownlinkModel.prototype.drop = function (lower) {
            this.mapWillDrop(lower);
            this._state.drop(lower);
            this.mapDidDrop(lower);
            this.command(structure.Record.create(1).attr("drop", lower));
            return this;
        };
        MapDownlinkModel.prototype.take = function (upper) {
            this.mapWillTake(upper);
            this._state.take(upper);
            this.mapDidTake(upper);
            this.command(structure.Record.create(1).attr("take", upper));
            return this;
        };
        MapDownlinkModel.prototype.clear = function () {
            this.mapWillClear();
            this._state.clear();
            this.mapDidClear();
            this.command(structure.Record.create(1).attr("clear"));
        };
        MapDownlinkModel.prototype.forEach = function (callback, thisArg) {
            return this._state.forEach(function (key, value) {
                return callback.call(thisArg, key, value, this);
            }, this);
        };
        MapDownlinkModel.prototype.keys = function () {
            return this._state.keys();
        };
        MapDownlinkModel.prototype.values = function () {
            return this._state.values();
        };
        MapDownlinkModel.prototype.entries = function () {
            return this._state.entries();
        };
        MapDownlinkModel.prototype.snapshot = function () {
            return this._state.clone();
        };
        MapDownlinkModel.prototype.setState = function (state) {
            this._state = state;
        };
        MapDownlinkModel.prototype.onEventMessage = function (message, host) {
            _super.prototype.onEventMessage.call(this, message, host);
            var event = message.body();
            var tag = event.tag();
            if (tag === "update") {
                var header = event.head().toValue();
                this.onUpdateEvent(header.get("key"), event.body());
            }
            else if (tag === "remove") {
                var header = event.head().toValue();
                this.onRemoveEvent(header.get("key"));
            }
            else if (tag === "drop") {
                var header = event.head().toValue();
                this.onDropEvent(header.numberValue(0));
            }
            else if (tag === "take") {
                var header = event.head().toValue();
                this.onTakeEvent(header.numberValue(0));
            }
            else if (tag === "clear") {
                this.onClearEvent();
            }
        };
        MapDownlinkModel.prototype.onUpdateEvent = function (key, newValue) {
            newValue = this.mapWillUpdate(key, newValue);
            var oldValue = this._state.get(key) || structure.Value.absent();
            this._state.set(key, newValue);
            this.mapDidUpdate(key, newValue, oldValue);
        };
        MapDownlinkModel.prototype.onRemoveEvent = function (key) {
            this.mapWillRemove(key);
            var oldValue = this._state.get(key) || structure.Value.absent();
            this._state.delete(key);
            this.mapDidRemove(key, oldValue);
        };
        MapDownlinkModel.prototype.onDropEvent = function (lower) {
            this.mapWillDrop(lower);
            this._state.drop(lower);
            this.mapDidDrop(lower);
        };
        MapDownlinkModel.prototype.onTakeEvent = function (upper) {
            this.mapWillTake(upper);
            this._state.take(upper);
            this.mapDidTake(upper);
        };
        MapDownlinkModel.prototype.onClearEvent = function () {
            this.mapWillClear();
            this._state.clear();
            this.mapDidClear();
        };
        MapDownlinkModel.prototype.mapWillUpdate = function (key, newValue) {
            for (var i = 0; i < this._views.length; i += 1) {
                newValue = this._views[i].mapWillUpdate(key, newValue);
            }
            return newValue;
        };
        MapDownlinkModel.prototype.mapDidUpdate = function (key, newValue, oldValue) {
            for (var i = 0; i < this._views.length; i += 1) {
                this._views[i].mapDidUpdate(key, newValue, oldValue);
            }
        };
        MapDownlinkModel.prototype.mapWillRemove = function (key) {
            for (var i = 0; i < this._views.length; i += 1) {
                this._views[i].mapWillRemove(key);
            }
        };
        MapDownlinkModel.prototype.mapDidRemove = function (key, oldValue) {
            for (var i = 0; i < this._views.length; i += 1) {
                this._views[i].mapDidRemove(key, oldValue);
            }
        };
        MapDownlinkModel.prototype.mapWillDrop = function (lower) {
            for (var i = 0; i < this._views.length; i += 1) {
                this._views[i].mapWillDrop(lower);
            }
        };
        MapDownlinkModel.prototype.mapDidDrop = function (lower) {
            for (var i = 0; i < this._views.length; i += 1) {
                this._views[i].mapDidDrop(lower);
            }
        };
        MapDownlinkModel.prototype.mapWillTake = function (upper) {
            for (var i = 0; i < this._views.length; i += 1) {
                this._views[i].mapWillTake(upper);
            }
        };
        MapDownlinkModel.prototype.mapDidTake = function (upper) {
            for (var i = 0; i < this._views.length; i += 1) {
                this._views[i].mapDidTake(upper);
            }
        };
        MapDownlinkModel.prototype.mapWillClear = function () {
            for (var i = 0; i < this._views.length; i += 1) {
                this._views[i].mapWillClear();
            }
        };
        MapDownlinkModel.prototype.mapDidClear = function () {
            for (var i = 0; i < this._views.length; i += 1) {
                this._views[i].mapDidClear();
            }
        };
        return MapDownlinkModel;
    }(DownlinkModel));

    var MapDownlink = (function (_super) {
        __extends(MapDownlink, _super);
        function MapDownlink(context, owner, init, hostUri, nodeUri, laneUri, prio, rate, body, flags, observers, keyForm, valueForm, state0) {
            if (flags === void 0) { flags = 3; }
            var _this = _super.call(this, context, owner, init, hostUri, nodeUri, laneUri, prio, rate, body, flags, observers) || this;
            if (init) {
                var observer = _this._observers[_this._observers.length - 1];
                observer.willUpdate = init.willUpdate || observer.willUpdate;
                observer.didUpdate = init.didUpdate || observer.didUpdate;
                observer.willRemove = init.willRemove || observer.willRemove;
                observer.didRemove = init.didRemove || observer.didRemove;
                observer.willDrop = init.willDrop || observer.willDrop;
                observer.didDrop = init.didDrop || observer.didDrop;
                observer.willTake = init.willTake || observer.willTake;
                observer.didTake = init.didTake || observer.didTake;
                observer.willClear = init.willClear || observer.willClear;
                observer.didClear = init.didClear || observer.didClear;
                keyForm = init.keyForm ? init.keyForm : keyForm;
                valueForm = init.valueForm ? init.valueForm : valueForm;
            }
            _this._keyForm = keyForm || structure.Form.forValue();
            _this._valueForm = valueForm || structure.Form.forValue();
            _this._state0 = state0;
            _this._input = null;
            _this._effects = new collections.BTree();
            _this._outlets = new collections.BTree();
            _this._outputs = null;
            _this._version = -1;
            return _this;
        }
        MapDownlink.prototype.copy = function (context, owner, hostUri, nodeUri, laneUri, prio, rate, body, flags, observers, keyForm, valueForm, state0) {
            if (arguments.length === 10) {
                state0 = this._state0;
                keyForm = this._keyForm;
                valueForm = this._valueForm;
            }
            return new MapDownlink(context, owner, void 0, hostUri, nodeUri, laneUri, prio, rate, body, flags, observers, keyForm, valueForm, state0);
        };
        MapDownlink.prototype.type = function () {
            return "map";
        };
        MapDownlink.prototype.keyForm = function (keyForm) {
            if (keyForm === void 0) {
                return this._keyForm;
            }
            else {
                return this.copy(this._context, this._owner, this._hostUri, this._nodeUri, this._laneUri, this._prio, this._rate, this._body, this._flags, this._observers, keyForm, this._valueForm, this._state0);
            }
        };
        MapDownlink.prototype.valueForm = function (valueForm) {
            if (valueForm === void 0) {
                return this._valueForm;
            }
            else {
                return this.copy(this._context, this._owner, this._hostUri, this._nodeUri, this._laneUri, this._prio, this._rate, this._body, this._flags, this._observers, this._keyForm, valueForm, this._state0);
            }
        };
        Object.defineProperty(MapDownlink.prototype, "size", {
            get: function () {
                return this._model.size;
            },
            enumerable: true,
            configurable: true
        });
        MapDownlink.prototype.isEmpty = function () {
            return this._model.isEmpty();
        };
        MapDownlink.prototype.has = function (key) {
            var keyObject = this._keyForm.mold(key);
            return this._model.has(keyObject);
        };
        MapDownlink.prototype.get = function (key) {
            if (key === void 0) {
                return this;
            }
            else {
                var keyObject = this._keyForm.mold(key);
                var value = this._model.get(keyObject);
                return value.coerce(this._valueForm);
            }
        };
        MapDownlink.prototype.getEntry = function (index) {
            var entry = this._model.getEntry(index);
            if (entry) {
                return [entry[0].coerce(this._keyForm), entry[1].coerce(this._valueForm)];
            }
            return void 0;
        };
        MapDownlink.prototype.firstKey = function () {
            var key = this._model._state.firstKey();
            if (key !== void 0) {
                var keyObject = this._keyForm.cast(key);
                if (keyObject !== void 0) {
                    return keyObject;
                }
            }
            return this._keyForm.unit();
        };
        MapDownlink.prototype.firstValue = function () {
            var value = this._model._state.firstValue();
            if (value !== void 0) {
                var object = this._valueForm.cast(value);
                if (object !== void 0) {
                    return object;
                }
            }
            return this._valueForm.unit();
        };
        MapDownlink.prototype.firstEntry = function () {
            var entry = this._model._state.firstEntry();
            if (entry !== void 0) {
                var keyObject = this._keyForm.cast(entry[0]);
                var object = this._valueForm.cast(entry[1]);
                return [keyObject, object];
            }
            return void 0;
        };
        MapDownlink.prototype.lastKey = function () {
            var key = this._model._state.lastKey();
            if (key !== void 0) {
                var keyObject = this._keyForm.cast(key);
                if (keyObject !== void 0) {
                    return keyObject;
                }
            }
            return this._keyForm.unit();
        };
        MapDownlink.prototype.lastValue = function () {
            var value = this._model._state.lastValue();
            if (value !== void 0) {
                var object = this._valueForm.cast(value);
                if (object !== void 0) {
                    return object;
                }
            }
            return this._valueForm.unit();
        };
        MapDownlink.prototype.lastEntry = function () {
            var entry = this._model._state.lastEntry();
            if (entry !== void 0) {
                var keyObject = this._keyForm.cast(entry[0]);
                var object = this._valueForm.cast(entry[1]);
                return [keyObject, object];
            }
            return void 0;
        };
        MapDownlink.prototype.nextKey = function (keyObject) {
            var key = this._keyForm.mold(keyObject);
            var nextKey = this._model._state.nextKey(key);
            if (nextKey !== void 0) {
                var nextKeyObject = this._keyForm.cast(nextKey);
                if (nextKeyObject !== void 0) {
                    return nextKeyObject;
                }
            }
            return this._keyForm.unit();
        };
        MapDownlink.prototype.nextValue = function (keyObject) {
            var key = this._keyForm.mold(keyObject);
            var nextValue = this._model._state.nextValue(key);
            if (nextValue !== void 0) {
                var nextObject = this._valueForm.cast(nextValue);
                if (nextObject !== void 0) {
                    return nextObject;
                }
            }
            return this._valueForm.unit();
        };
        MapDownlink.prototype.nextEntry = function (keyObject) {
            var key = this._keyForm.mold(keyObject);
            var entry = this._model._state.nextEntry(key);
            if (entry !== void 0) {
                var keyObject_1 = this._keyForm.cast(entry[0]);
                var object = this._valueForm.cast(entry[1]);
                return [keyObject_1, object];
            }
            return void 0;
        };
        MapDownlink.prototype.previousKey = function (keyObject) {
            var key = this._keyForm.mold(keyObject);
            var previousKey = this._model._state.previousKey(key);
            if (previousKey !== void 0) {
                var previousKeyObject = this._keyForm.cast(previousKey);
                if (previousKeyObject !== void 0) {
                    return previousKeyObject;
                }
            }
            return this._keyForm.unit();
        };
        MapDownlink.prototype.previousValue = function (keyObject) {
            var key = this._keyForm.mold(keyObject);
            var previousValue = this._model._state.previousValue(key);
            if (previousValue !== void 0) {
                var previousObject = this._valueForm.cast(previousValue);
                if (previousObject !== void 0) {
                    return previousObject;
                }
            }
            return this._valueForm.unit();
        };
        MapDownlink.prototype.previousEntry = function (keyObject) {
            var key = this._keyForm.mold(keyObject);
            var entry = this._model._state.previousEntry(key);
            if (entry !== void 0) {
                var keyObject_2 = this._keyForm.cast(entry[0]);
                var object = this._valueForm.cast(entry[1]);
                return [keyObject_2, object];
            }
            return void 0;
        };
        MapDownlink.prototype.set = function (key, newValue) {
            var keyObject = this._keyForm.mold(key);
            var newObject = this._valueForm.mold(newValue);
            this._model.set(keyObject, newObject);
            return this;
        };
        MapDownlink.prototype.delete = function (key) {
            var keyObject = this._keyForm.mold(key);
            return this._model.delete(keyObject);
        };
        MapDownlink.prototype.drop = function (lower) {
            this._model.drop(lower);
            return this;
        };
        MapDownlink.prototype.take = function (upper) {
            this._model.take(upper);
            return this;
        };
        MapDownlink.prototype.clear = function () {
            this._model.clear();
        };
        MapDownlink.prototype.forEach = function (callback, thisArg) {
            if (this._keyForm === structure.Form.forValue() && this._valueForm === structure.Form.forValue()) {
                return this._model._state.forEach(callback, thisArg);
            }
            else {
                return this._model._state.forEach(function (key, value) {
                    var keyObject = key.coerce(this._keyForm);
                    var object = value.coerce(this._valueForm);
                    return callback.call(thisArg, keyObject, object, this);
                }, this);
            }
        };
        MapDownlink.prototype.keys = function () {
            var cursor = this._model.keys();
            if (this._keyForm === structure.Form.forValue()) {
                return cursor;
            }
            else {
                return new structure.ValueCursor(cursor, this._keyForm);
            }
        };
        MapDownlink.prototype.values = function () {
            var cursor = this._model.values();
            if (this._valueForm === structure.Form.forValue()) {
                return cursor;
            }
            else {
                return new structure.ValueCursor(cursor, this._valueForm);
            }
        };
        MapDownlink.prototype.entries = function () {
            var cursor = this._model.entries();
            if (this._keyForm === structure.Form.forValue() && this._valueForm === structure.Form.forValue()) {
                return cursor;
            }
            else {
                return new structure.ValueEntryCursor(cursor, this._keyForm, this._valueForm);
            }
        };
        MapDownlink.prototype.snapshot = function () {
            return this._model.snapshot();
        };
        MapDownlink.prototype.setState = function (state) {
            this._model.setState(state);
        };
        MapDownlink.prototype.observe = function (observer) {
            return _super.prototype.observe.call(this, observer);
        };
        MapDownlink.prototype.willUpdate = function (willUpdate) {
            return this.observe({ willUpdate: willUpdate });
        };
        MapDownlink.prototype.didUpdate = function (didUpdate) {
            return this.observe({ didUpdate: didUpdate });
        };
        MapDownlink.prototype.willRemove = function (willRemove) {
            return this.observe({ willRemove: willRemove });
        };
        MapDownlink.prototype.didRemove = function (didRemove) {
            return this.observe({ didRemove: didRemove });
        };
        MapDownlink.prototype.willDrop = function (willDrop) {
            return this.observe({ willDrop: willDrop });
        };
        MapDownlink.prototype.didDrop = function (didDrop) {
            return this.observe({ didDrop: didDrop });
        };
        MapDownlink.prototype.willTake = function (willTake) {
            return this.observe({ willTake: willTake });
        };
        MapDownlink.prototype.didTake = function (didTake) {
            return this.observe({ didTake: didTake });
        };
        MapDownlink.prototype.willClear = function (willClear) {
            return this.observe({ willClear: willClear });
        };
        MapDownlink.prototype.didClear = function (didClear) {
            return this.observe({ didClear: didClear });
        };
        MapDownlink.prototype.mapWillUpdate = function (key, newValue) {
            var observers = this._observers;
            var n = observers ? observers.length : 0;
            var keyObject;
            var newObject;
            for (var i = 0; i < n; i += 1) {
                var observer = observers[i];
                if (observer.willUpdate) {
                    if (keyObject === void 0) {
                        keyObject = key.coerce(this._keyForm);
                    }
                    if (newObject === void 0) {
                        newObject = newValue.coerce(this._valueForm);
                    }
                    var newResult = observer.willUpdate(keyObject, newObject, this);
                    if (newResult !== void 0) {
                        newObject = newResult;
                        newValue = this._valueForm.mold(newObject);
                    }
                }
            }
            return newValue;
        };
        MapDownlink.prototype.mapDidUpdate = function (key, newValue, oldValue) {
            var observers = this._observers;
            var n = observers ? observers.length : 0;
            var keyObject = key.coerce(this._keyForm);
            var newObject;
            var oldObject;
            for (var i = 0; i < n; i += 1) {
                var observer = observers[i];
                if (observer.didUpdate) {
                    if (newObject === void 0) {
                        newObject = newValue.coerce(this._valueForm);
                    }
                    if (oldObject === void 0) {
                        oldObject = oldValue.coerce(this._valueForm);
                    }
                    observer.didUpdate(keyObject, newObject, oldObject, this);
                }
            }
            this.invalidateInputKey(keyObject, 0);
            this.reconcileInput(0);
        };
        MapDownlink.prototype.mapWillRemove = function (key) {
            var observers = this._observers;
            var n = observers ? observers.length : 0;
            var keyObject;
            for (var i = 0; i < n; i += 1) {
                var observer = observers[i];
                if (observer.willRemove) {
                    if (keyObject === void 0) {
                        keyObject = key.coerce(this._keyForm);
                    }
                    observer.willRemove(keyObject, this);
                }
            }
        };
        MapDownlink.prototype.mapDidRemove = function (key, oldValue) {
            var observers = this._observers;
            var n = observers ? observers.length : 0;
            var keyObject = key.coerce(this._keyForm);
            var oldObject;
            for (var i = 0; i < n; i += 1) {
                var observer = observers[i];
                if (observer.didRemove) {
                    if (oldObject === void 0) {
                        oldObject = oldValue.coerce(this._valueForm);
                    }
                    observer.didRemove(keyObject, oldObject, this);
                }
            }
            this.invalidateInputKey(keyObject, 1);
            this.reconcileInput(0);
        };
        MapDownlink.prototype.mapWillDrop = function (lower) {
            var observers = this._observers;
            var n = observers ? observers.length : 0;
            for (var i = 0; i < n; i += 1) {
                var observer = observers[i];
                if (observer.willDrop) {
                    observer.willDrop(lower, this);
                }
            }
        };
        MapDownlink.prototype.mapDidDrop = function (lower) {
            var observers = this._observers;
            var n = observers ? observers.length : 0;
            for (var i = 0; i < n; i += 1) {
                var observer = observers[i];
                if (observer.didDrop) {
                    observer.didDrop(lower, this);
                }
            }
        };
        MapDownlink.prototype.mapWillTake = function (upper) {
            var observers = this._observers;
            var n = observers ? observers.length : 0;
            for (var i = 0; i < n; i += 1) {
                var observer = observers[i];
                if (observer.willTake) {
                    observer.willTake(upper, this);
                }
            }
        };
        MapDownlink.prototype.mapDidTake = function (upper) {
            var observers = this._observers;
            var n = observers ? observers.length : 0;
            for (var i = 0; i < n; i += 1) {
                var observer = observers[i];
                if (observer.didTake) {
                    observer.didTake(upper, this);
                }
            }
        };
        MapDownlink.prototype.mapWillClear = function () {
            var observers = this._observers;
            var n = observers ? observers.length : 0;
            for (var i = 0; i < n; i += 1) {
                var observer = observers[i];
                if (observer.willClear) {
                    observer.willClear(this);
                }
            }
        };
        MapDownlink.prototype.mapDidClear = function () {
            var observers = this._observers;
            var n = observers ? observers.length : 0;
            for (var i = 0; i < n; i += 1) {
                var observer = observers[i];
                if (observer.didClear) {
                    observer.didClear(this);
                }
            }
        };
        MapDownlink.prototype.initialState = function (state0) {
            if (state0 === void 0) {
                return this._state0 || null;
            }
            else {
                return this.copy(this._context, this._owner, this._hostUri, this._nodeUri, this._laneUri, this._prio, this._rate, this._body, this._flags, this._observers, this._keyForm, this._valueForm, state0 || void 0);
            }
        };
        MapDownlink.prototype.didAliasModel = function () {
            this.onLinkedResponse();
            this._model._state.forEach(function (key, value) {
                this.mapDidUpdate(key, value, structure.Value.absent());
            }, this);
            this.onSyncedResponse();
        };
        MapDownlink.prototype.open = function () {
            var laneUri = this._laneUri;
            if (laneUri.isEmpty()) {
                throw new Error("no lane");
            }
            var nodeUri = this._nodeUri;
            if (nodeUri.isEmpty()) {
                throw new Error("no node");
            }
            var hostUri = this._hostUri;
            if (hostUri.isEmpty()) {
                hostUri = nodeUri.endpoint();
                nodeUri = hostUri.unresolve(nodeUri);
            }
            var model = this._context.getDownlink(hostUri, nodeUri, laneUri);
            if (model) {
                if (!(model instanceof MapDownlinkModel)) {
                    throw new Error("downlink type mismatch");
                }
                model.addDownlink(this);
                this._model = model;
                this.didAliasModel();
            }
            else {
                model = new MapDownlinkModel(this._context, hostUri, nodeUri, laneUri, this._prio, this._rate, this._body, this._state0);
                model.addDownlink(this);
                this._context.openDownlink(model);
                this._model = model;
            }
            if (this._owner) {
                this._owner.addDownlink(this);
            }
            return this;
        };
        MapDownlink.prototype.keyIterator = function () {
            return this.keys();
        };
        MapDownlink.prototype.input = function () {
            return this._input;
        };
        MapDownlink.prototype.bindInput = function (input) {
            if (!streamlet.MapOutlet.is(input)) {
                throw new TypeError("" + input);
            }
            if (this._input !== null) {
                this._input.unbindOutput(this);
            }
            this._input = input;
            if (this._input !== null) {
                this._input.bindOutput(this);
            }
        };
        MapDownlink.prototype.unbindInput = function () {
            if (this._input !== null) {
                this._input.unbindOutput(this);
            }
            this._input = null;
        };
        MapDownlink.prototype.disconnectInputs = function () {
            var input = this._input;
            if (input !== null) {
                input.unbindOutput(this);
                this._input = null;
                input.disconnectInputs();
            }
        };
        MapDownlink.prototype.outlet = function (key) {
            var outlet = this._outlets.get(key);
            if (outlet === void 0) {
                outlet = new streamlet.KeyOutlet(this, key);
                this._outlets = this._outlets.updated(key, outlet);
            }
            return outlet;
        };
        MapDownlink.prototype.outputIterator = function () {
            return this._outputs !== null ? util.Cursor.array(this._outputs) : util.Cursor.empty();
        };
        MapDownlink.prototype.bindOutput = function (output) {
            var oldOutputs = this._outputs;
            var n = oldOutputs !== null ? oldOutputs.length : 0;
            var newOutputs = new Array(n + 1);
            for (var i = 0; i < n; i += 1) {
                newOutputs[i] = oldOutputs[i];
            }
            newOutputs[n] = output;
            this._outputs = newOutputs;
        };
        MapDownlink.prototype.unbindOutput = function (output) {
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
        MapDownlink.prototype.unbindOutputs = function () {
            var oldOutputs = this._outputs;
            if (oldOutputs !== null) {
                this._outputs = null;
                for (var i = 0, n = oldOutputs.length; i < n; i += 1) {
                    oldOutputs[i].unbindInput();
                }
            }
        };
        MapDownlink.prototype.disconnectOutputs = function () {
            var outlets = this._outlets;
            if (outlets.isEmpty()) {
                this._outlets = new collections.BTree();
                outlets.forEach(function (key, keyOutlet) {
                    keyOutlet.disconnectOutputs();
                }, this);
            }
            var outputs = this._outputs;
            if (outputs !== null) {
                this._outputs = null;
                for (var i = 0, n = outputs.length; i < n; i += 1) {
                    var output = outputs[i];
                    output.unbindInput();
                    output.disconnectOutputs();
                }
            }
        };
        MapDownlink.prototype.invalidateOutputKey = function (key, effect) {
            this.invalidateKey(key, effect);
        };
        MapDownlink.prototype.invalidateInputKey = function (key, effect) {
            this.invalidateKey(key, effect);
        };
        MapDownlink.prototype.invalidateKey = function (key, effect) {
            var oldEffects = this._effects;
            if (oldEffects.get(key) !== effect) {
                this.willInvalidateKey(key, effect);
                this._effects = oldEffects.updated(key, effect);
                this._version = -1;
                this.onInvalidateKey(key, effect);
                var n = this._outputs !== null ? this._outputs.length : 0;
                for (var i = 0; i < n; i += 1) {
                    var output = this._outputs[i];
                    if (streamlet.MapInlet.is(output)) {
                        output.invalidateOutputKey(key, effect);
                    }
                    else {
                        output.invalidateOutput();
                    }
                }
                var outlet = this._outlets.get(key);
                if (outlet !== void 0) {
                    outlet.invalidateInput();
                }
                this.didInvalidateKey(key, effect);
            }
        };
        MapDownlink.prototype.invalidateOutput = function () {
            this.invalidate();
        };
        MapDownlink.prototype.invalidateInput = function () {
            this.invalidate();
        };
        MapDownlink.prototype.invalidate = function () {
            if (this._version >= 0) {
                this.willInvalidate();
                this._version = -1;
                this.onInvalidate();
                var n = this._outputs !== null ? this._outputs.length : 0;
                for (var i = 0; i < n; i += 1) {
                    this._outputs[i].invalidateOutput();
                }
                this._outlets.forEach(function (key, outlet) {
                    outlet.invalidateInput();
                }, this);
                this.didInvalidate();
            }
        };
        MapDownlink.prototype.reconcileOutputKey = function (key, version) {
            this.reconcileKey(key, version);
        };
        MapDownlink.prototype.reconcileInputKey = function (key, version) {
            this.reconcileKey(key, version);
        };
        MapDownlink.prototype.reconcileKey = function (key, version) {
            if (this._version < 0) {
                var oldEffects = this._effects;
                var effect = oldEffects.get(key);
                if (effect !== void 0) {
                    this.willReconcileKey(key, effect, version);
                    this._effects = oldEffects.removed(key);
                    if (this._input !== null) {
                        this._input.reconcileInputKey(key, version);
                    }
                    this.onReconcileKey(key, effect, version);
                    for (var i = 0, n = this._outputs !== null ? this._outputs.length : 0; i < n; i += 1) {
                        var output = this._outputs[i];
                        if (streamlet.MapInlet.is(output)) {
                            output.reconcileOutputKey(key, version);
                        }
                    }
                    var outlet = this._outlets.get(key);
                    if (outlet !== void 0) {
                        outlet.reconcileInput(version);
                    }
                    this.didReconcileKey(key, effect, version);
                }
            }
        };
        MapDownlink.prototype.reconcileOutput = function (version) {
            this.reconcile(version);
        };
        MapDownlink.prototype.reconcileInput = function (version) {
            this.reconcile(version);
        };
        MapDownlink.prototype.reconcile = function (version) {
            if (this._version < 0) {
                this.willReconcile(version);
                this._effects.forEach(function (key) {
                    this.reconcileKey(key, version);
                }, this);
                this._version = version;
                this.onReconcile(version);
                for (var i = 0, n = this._outputs !== null ? this._outputs.length : 0; i < n; i += 1) {
                    this._outputs[i].reconcileOutput(version);
                }
                this.didReconcile(version);
            }
        };
        MapDownlink.prototype.willInvalidateKey = function (key, effect) {
        };
        MapDownlink.prototype.onInvalidateKey = function (key, effect) {
        };
        MapDownlink.prototype.didInvalidateKey = function (key, effect) {
        };
        MapDownlink.prototype.willInvalidate = function () {
        };
        MapDownlink.prototype.onInvalidate = function () {
        };
        MapDownlink.prototype.didInvalidate = function () {
        };
        MapDownlink.prototype.willReconcileKey = function (key, effect, version) {
        };
        MapDownlink.prototype.onReconcileKey = function (key, effect, version) {
            if (effect === 0) {
                if (this._input !== null) {
                    var value = this._input.get(key);
                    if (value !== void 0) {
                        this.set(key, value);
                    }
                    else {
                        this.delete(key);
                    }
                }
            }
            else if (effect === 1) {
                this.delete(key);
            }
        };
        MapDownlink.prototype.didReconcileKey = function (key, effect, version) {
        };
        MapDownlink.prototype.willReconcile = function (version) {
        };
        MapDownlink.prototype.onReconcile = function (version) {
        };
        MapDownlink.prototype.didReconcile = function (version) {
        };
        MapDownlink.prototype.memoize = function () {
            return this;
        };
        MapDownlink.prototype.filter = function (func) {
            var combinator = new streamlet.FilterFieldsCombinator(func);
            combinator.bindInput(this);
            return combinator;
        };
        MapDownlink.prototype.map = function (func) {
            if (func.length === 1) {
                var combinator = new streamlet.MapValueCombinator(func);
                combinator.bindInput(this);
                return combinator;
            }
            else {
                var combinator = new streamlet.MapFieldValuesCombinator(func);
                combinator.bindInput(this);
                return combinator;
            }
        };
        MapDownlink.prototype.reduce = function (identity, accumulator, combiner) {
            var combinator = new streamlet.ReduceFieldsCombinator(identity, accumulator, combiner);
            combinator.bindInput(this);
            return combinator;
        };
        MapDownlink.prototype.watch = function (func) {
            if (func.length === 1) {
                var combinator = new streamlet.WatchValueCombinator(func);
                combinator.bindInput(this);
                return this;
            }
            else {
                var combinator = new streamlet.WatchFieldsCombinator(func);
                combinator.bindInput(this);
                return this;
            }
        };
        return MapDownlink;
    }(Downlink));

    var ValueDownlinkModel = (function (_super) {
        __extends(ValueDownlinkModel, _super);
        function ValueDownlinkModel(context, hostUri, nodeUri, laneUri, prio, rate, body, state) {
            if (state === void 0) { state = structure.Value.absent(); }
            var _this = _super.call(this, context, hostUri, nodeUri, laneUri, prio, rate, body) || this;
            _this._state = state;
            return _this;
        }
        ValueDownlinkModel.prototype.type = function () {
            return "value";
        };
        ValueDownlinkModel.prototype.get = function () {
            return this._state;
        };
        ValueDownlinkModel.prototype.set = function (newValue) {
            newValue = this.valueWillSet(newValue);
            var oldValue = this._state;
            this.setState(newValue);
            this.valueDidSet(newValue, oldValue);
            this.command(newValue);
        };
        ValueDownlinkModel.prototype.setState = function (state) {
            this._state = state;
        };
        ValueDownlinkModel.prototype.onEventMessage = function (message, host) {
            _super.prototype.onEventMessage.call(this, message, host);
            this.onSetEvent(message.body());
        };
        ValueDownlinkModel.prototype.onSetEvent = function (newValue) {
            newValue = this.valueWillSet(newValue);
            var oldValue = this._state;
            this.setState(newValue);
            this.valueDidSet(newValue, oldValue);
        };
        ValueDownlinkModel.prototype.valueWillSet = function (newValue) {
            for (var i = 0; i < this._views.length; i += 1) {
                newValue = this._views[i].valueWillSet(newValue);
            }
            return newValue;
        };
        ValueDownlinkModel.prototype.valueDidSet = function (newValue, oldValue) {
            for (var i = 0; i < this._views.length; i += 1) {
                this._views[i].valueDidSet(newValue, oldValue);
            }
        };
        return ValueDownlinkModel;
    }(DownlinkModel));

    var ValueDownlink = (function (_super) {
        __extends(ValueDownlink, _super);
        function ValueDownlink(context, owner, init, hostUri, nodeUri, laneUri, prio, rate, body, flags, observers, valueForm, state0) {
            if (flags === void 0) { flags = 3; }
            if (state0 === void 0) { state0 = structure.Value.absent(); }
            var _this = _super.call(this, context, owner, init, hostUri, nodeUri, laneUri, prio, rate, body, flags, observers) || this;
            if (init) {
                var observer = _this._observers[_this._observers.length - 1];
                observer.willSet = init.willSet || observer.willSet;
                observer.didSet = init.didSet || observer.didSet;
                valueForm = init.valueForm ? init.valueForm : valueForm;
            }
            _this._valueForm = valueForm || structure.Form.forValue();
            _this._state0 = state0;
            _this._input = null;
            _this._outputs = null;
            _this._version = -1;
            return _this;
        }
        ValueDownlink.prototype.copy = function (context, owner, hostUri, nodeUri, laneUri, prio, rate, body, flags, observers, valueForm, state0) {
            if (arguments.length === 10) {
                state0 = this._state0;
                valueForm = this._valueForm;
            }
            return new ValueDownlink(context, owner, void 0, hostUri, nodeUri, laneUri, prio, rate, body, flags, observers, valueForm, state0);
        };
        ValueDownlink.prototype.type = function () {
            return "value";
        };
        ValueDownlink.prototype.valueForm = function (valueForm) {
            if (valueForm === void 0) {
                return this._valueForm;
            }
            else {
                return this.copy(this._context, this._owner, this._hostUri, this._nodeUri, this._laneUri, this._prio, this._rate, this._body, this._flags, this._observers, valueForm, this._state0);
            }
        };
        ValueDownlink.prototype.get = function () {
            var value = this._model.get();
            var object = value.coerce(this._valueForm);
            return object;
        };
        ValueDownlink.prototype.set = function (newObject) {
            var newValue = this._valueForm.mold(newObject);
            this._model.set(newValue);
        };
        ValueDownlink.prototype.setState = function (state) {
            this._model.setState(state);
        };
        ValueDownlink.prototype.observe = function (observer) {
            return _super.prototype.observe.call(this, observer);
        };
        ValueDownlink.prototype.willSet = function (willSet) {
            return this.observe({ willSet: willSet });
        };
        ValueDownlink.prototype.didSet = function (didSet) {
            return this.observe({ didSet: didSet });
        };
        ValueDownlink.prototype.valueWillSet = function (newValue) {
            var observers = this._observers;
            var n = observers ? observers.length : 0;
            var newObject;
            for (var i = 0; i < n; i += 1) {
                var observer = observers[i];
                if (observer.willSet) {
                    if (newObject === void 0) {
                        newObject = newValue.coerce(this._valueForm);
                    }
                    var newResult = observer.willSet(newObject, this);
                    if (newResult !== void 0) {
                        newObject = newResult;
                        newValue = this._valueForm.mold(newObject);
                    }
                }
            }
            return newValue;
        };
        ValueDownlink.prototype.valueDidSet = function (newValue, oldValue) {
            var observers = this._observers;
            var n = observers ? observers.length : 0;
            var newObject;
            var oldObject;
            for (var i = 0; i < n; i += 1) {
                var observer = observers[i];
                if (observer.didSet) {
                    if (newObject === void 0) {
                        newObject = newValue.coerce(this._valueForm);
                    }
                    if (oldObject === void 0) {
                        oldObject = oldValue.coerce(this._valueForm);
                    }
                    observer.didSet(newObject, oldObject, this);
                }
            }
            this.invalidate();
            this.reconcile(0);
        };
        ValueDownlink.prototype.initialState = function (state0) {
            if (state0 === void 0) {
                return this._state0;
            }
            else {
                return this.copy(this._context, this._owner, this._hostUri, this._nodeUri, this._laneUri, this._prio, this._rate, this._body, this._flags, this._observers, this._valueForm, state0);
            }
        };
        ValueDownlink.prototype.didAliasModel = function () {
            this.onLinkedResponse();
            this.valueDidSet(this._model.get(), structure.Value.absent());
            this.onSyncedResponse();
        };
        ValueDownlink.prototype.open = function () {
            var laneUri = this._laneUri;
            if (laneUri.isEmpty()) {
                throw new Error("no lane");
            }
            var nodeUri = this._nodeUri;
            if (nodeUri.isEmpty()) {
                throw new Error("no node");
            }
            var hostUri = this._hostUri;
            if (hostUri.isEmpty()) {
                hostUri = nodeUri.endpoint();
                nodeUri = hostUri.unresolve(nodeUri);
            }
            var model = this._context.getDownlink(hostUri, nodeUri, laneUri);
            if (model) {
                if (!(model instanceof ValueDownlinkModel)) {
                    throw new Error("downlink type mismatch");
                }
                model.addDownlink(this);
                this._model = model;
                this.didAliasModel();
            }
            else {
                model = new ValueDownlinkModel(this._context, hostUri, nodeUri, laneUri, this._prio, this._rate, this._body, this._state0);
                model.addDownlink(this);
                this._context.openDownlink(model);
                this._model = model;
            }
            if (this._owner) {
                this._owner.addDownlink(this);
            }
            return this;
        };
        ValueDownlink.prototype.input = function () {
            return this._input;
        };
        ValueDownlink.prototype.bindInput = function (input) {
            if (this._input !== null) {
                this._input.unbindOutput(this);
            }
            this._input = input;
            if (this._input !== null) {
                this._input.bindOutput(this);
            }
        };
        ValueDownlink.prototype.unbindInput = function () {
            if (this._input !== null) {
                this._input.unbindOutput(this);
            }
            this._input = null;
        };
        ValueDownlink.prototype.disconnectInputs = function () {
            var input = this._input;
            if (input !== null) {
                input.unbindOutput(this);
                this._input = null;
                input.disconnectInputs();
            }
        };
        ValueDownlink.prototype.outputIterator = function () {
            return this._outputs !== null ? util.Cursor.array(this._outputs) : util.Cursor.empty();
        };
        ValueDownlink.prototype.bindOutput = function (output) {
            var oldOutputs = this._outputs;
            var n = oldOutputs !== null ? oldOutputs.length : 0;
            var newOutputs = new Array(n + 1);
            for (var i = 0; i < n; i += 1) {
                newOutputs[i] = oldOutputs[i];
            }
            newOutputs[n] = output;
            this._outputs = newOutputs;
        };
        ValueDownlink.prototype.unbindOutput = function (output) {
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
        ValueDownlink.prototype.unbindOutputs = function () {
            var oldOutputs = this._outputs;
            if (oldOutputs !== null) {
                this._outputs = null;
                for (var i = 0, n = oldOutputs.length; i < n; i += 1) {
                    oldOutputs[i].unbindInput();
                }
            }
        };
        ValueDownlink.prototype.disconnectOutputs = function () {
            var outputs = this._outputs;
            if (outputs !== null) {
                this._outputs = null;
                for (var i = 0, n = outputs.length; i < n; i += 1) {
                    var output = outputs[i];
                    output.unbindInput();
                    output.disconnectOutputs();
                }
            }
        };
        ValueDownlink.prototype.invalidateOutput = function () {
            this.invalidate();
        };
        ValueDownlink.prototype.invalidateInput = function () {
            this.invalidate();
        };
        ValueDownlink.prototype.invalidate = function () {
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
        ValueDownlink.prototype.reconcileOutput = function (version) {
            this.reconcile(version);
        };
        ValueDownlink.prototype.reconcileInput = function (version) {
            this.reconcile(version);
        };
        ValueDownlink.prototype.reconcile = function (version) {
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
        ValueDownlink.prototype.willInvalidate = function () {
        };
        ValueDownlink.prototype.onInvalidate = function () {
        };
        ValueDownlink.prototype.didInvalidate = function () {
        };
        ValueDownlink.prototype.willReconcile = function (version) {
        };
        ValueDownlink.prototype.onReconcile = function (version) {
            if (this._input !== null) {
                var value = this._input.get();
                if (value !== void 0) {
                    this.set(value);
                }
            }
        };
        ValueDownlink.prototype.didReconcile = function (version) {
        };
        ValueDownlink.prototype.memoize = function () {
            return this;
        };
        ValueDownlink.prototype.map = function (func) {
            var combinator = new streamlet.MapValueCombinator(func);
            combinator.bindInput(this);
            return combinator;
        };
        ValueDownlink.prototype.watch = function (func) {
            var combinator = new streamlet.WatchValueCombinator(func);
            combinator.bindInput(this);
            return this;
        };
        return ValueDownlink;
    }(Downlink));

    var DownlinkRecord = (function (_super) {
        __extends(DownlinkRecord, _super);
        function DownlinkRecord() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return DownlinkRecord;
    }(dataflow.AbstractRecordOutlet));

    var ListDownlinkRecord = (function (_super) {
        __extends(ListDownlinkRecord, _super);
        function ListDownlinkRecord(downlink) {
            var _this = _super.call(this) || this;
            _this._downlink = downlink;
            return _this;
        }
        Object.defineProperty(ListDownlinkRecord.prototype, "downlink", {
            get: function () {
                return this._downlink;
            },
            enumerable: true,
            configurable: true
        });
        ListDownlinkRecord.prototype.isEmpty = function () {
            return this._downlink.isEmpty();
        };
        ListDownlinkRecord.prototype.isArray = function () {
            return true;
        };
        ListDownlinkRecord.prototype.isObject = function () {
            return this._downlink.isEmpty();
        };
        Object.defineProperty(ListDownlinkRecord.prototype, "length", {
            get: function () {
                return this._downlink.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListDownlinkRecord.prototype, "size", {
            get: function () {
                return this._downlink.length;
            },
            enumerable: true,
            configurable: true
        });
        ListDownlinkRecord.prototype.has = function (key) {
            return false;
        };
        ListDownlinkRecord.prototype.get = function (key) {
            if (key === void 0) {
                return this;
            }
            else {
                return structure.Value.absent();
            }
        };
        ListDownlinkRecord.prototype.getAttr = function (key) {
            return structure.Value.absent();
        };
        ListDownlinkRecord.prototype.getSlot = function (key) {
            return structure.Value.absent();
        };
        ListDownlinkRecord.prototype.getItem = function (index) {
            if (index instanceof structure.Num) {
                index = index.value;
            }
            var n = this._downlink.length;
            if (index < 0) {
                index = n + index;
            }
            index = Math.min(Math.max(0, index), n - 1);
            if (index >= 0) {
                return this._downlink.get(index);
            }
            return structure.Item.absent();
        };
        ListDownlinkRecord.prototype.set = function (key, newValue) {
            throw new Error("unsupported");
        };
        ListDownlinkRecord.prototype.setAttr = function (key, newValue) {
            throw new Error("unsupported");
        };
        ListDownlinkRecord.prototype.setSlot = function (key, newValue) {
            throw new Error("unsupported");
        };
        ListDownlinkRecord.prototype.setItem = function (index, newItem) {
            if (index instanceof structure.Num) {
                index = index.value;
            }
            var n = this._downlink.length;
            if (index < 0) {
                index = n + index;
            }
            index = Math.min(Math.max(0, index), n - 1);
            if (index >= 0) {
                this._downlink.set(index, structure.Value.fromAny(newItem));
            }
            return this;
        };
        ListDownlinkRecord.prototype.push = function () {
            var newItems = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                newItems[_i] = arguments[_i];
            }
            return this._downlink.push.apply(this._downlink, arguments);
        };
        ListDownlinkRecord.prototype.splice = function (start, deleteCount) {
            var newItems = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                newItems[_i - 2] = arguments[_i];
            }
            return this._downlink.splice.apply(this._downlink, arguments);
        };
        ListDownlinkRecord.prototype.delete = function (key) {
            return structure.Item.absent();
        };
        ListDownlinkRecord.prototype.clear = function () {
            this._downlink.clear();
        };
        ListDownlinkRecord.prototype.forEach = function (callback, thisArg) {
            return this._downlink.forEach(function (value, index) {
                return callback.call(thisArg, value, index);
            });
        };
        ListDownlinkRecord.prototype.keyIterator = function () {
            return util.Cursor.empty();
        };
        return ListDownlinkRecord;
    }(DownlinkRecord));

    var MapDownlinkRecord = (function (_super) {
        __extends(MapDownlinkRecord, _super);
        function MapDownlinkRecord(downlink) {
            var _this = _super.call(this) || this;
            _this._downlink = downlink;
            _this._downlink.observe(_this);
            return _this;
        }
        Object.defineProperty(MapDownlinkRecord.prototype, "downlink", {
            get: function () {
                return this._downlink;
            },
            enumerable: true,
            configurable: true
        });
        MapDownlinkRecord.prototype.isEmpty = function () {
            return this._downlink.isEmpty();
        };
        MapDownlinkRecord.prototype.isArray = function () {
            return this._downlink.isEmpty();
        };
        MapDownlinkRecord.prototype.isObject = function () {
            return true;
        };
        Object.defineProperty(MapDownlinkRecord.prototype, "length", {
            get: function () {
                return this._downlink.size;
            },
            enumerable: true,
            configurable: true
        });
        MapDownlinkRecord.prototype.has = function (key) {
            return this._downlink.has(key);
        };
        MapDownlinkRecord.prototype.get = function (key) {
            if (key === void 0) {
                return this;
            }
            else {
                return this._downlink.get(key);
            }
        };
        MapDownlinkRecord.prototype.getAttr = function (key) {
            return structure.Value.absent();
        };
        MapDownlinkRecord.prototype.getSlot = function (key) {
            return this.get(key);
        };
        MapDownlinkRecord.prototype.getItem = function (index) {
            if (index instanceof structure.Num) {
                index = index.value;
            }
            var n = this._downlink.size;
            if (index < 0) {
                index = n + index;
            }
            index = Math.min(Math.max(0, index), n - 1);
            if (index >= 0) {
                var entry = this._downlink.getEntry(index);
                return structure.Slot.of(entry[0], entry[1]);
            }
            return structure.Item.absent();
        };
        MapDownlinkRecord.prototype.set = function (key, newValue) {
            this._downlink.set(key, newValue);
            return this;
        };
        MapDownlinkRecord.prototype.setAttr = function (key, newValue) {
            throw new Error("unsupported");
        };
        MapDownlinkRecord.prototype.setSlot = function (key, newValue) {
            return this.set(key, newValue);
        };
        MapDownlinkRecord.prototype.setItem = function (index, newItem) {
            throw new Error("unsupported");
        };
        MapDownlinkRecord.prototype.push = function () {
            var newItems = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                newItems[_i] = arguments[_i];
            }
            throw new Error("unsupported");
        };
        MapDownlinkRecord.prototype.splice = function (start, deleteCount) {
            var newItems = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                newItems[_i - 2] = arguments[_i];
            }
            throw new Error("unsupported");
        };
        MapDownlinkRecord.prototype.delete = function (key) {
            key = structure.Value.fromAny(key);
            var oldValue = this._downlink.get(key);
            if (this._downlink.delete(key)) {
                return structure.Slot.of(key, oldValue);
            }
            return structure.Item.absent();
        };
        MapDownlinkRecord.prototype.clear = function () {
            this._downlink.clear();
        };
        MapDownlinkRecord.prototype.forEach = function (callback, thisArg) {
            var index = 0;
            return this._downlink.forEach(function (key, value) {
                var result = callback.call(thisArg, structure.Slot.of(key, value), index);
                index += 1;
                return result;
            });
        };
        MapDownlinkRecord.prototype.keyIterator = function () {
            return this._downlink.keys();
        };
        MapDownlinkRecord.prototype.didUpdate = function (key, newValue, oldValue) {
            this.invalidateInputKey(key, 0);
            this.reconcileInput(0);
        };
        MapDownlinkRecord.prototype.didRemove = function (key, oldValue) {
            this.invalidateInputKey(key, 1);
            this.reconcileInput(0);
        };
        MapDownlinkRecord.prototype.didDrop = function (lower) {
        };
        MapDownlinkRecord.prototype.didTake = function (upper) {
        };
        MapDownlinkRecord.prototype.didClear = function () {
        };
        return MapDownlinkRecord;
    }(DownlinkRecord));

    var ValueDownlinkRecord = (function (_super) {
        __extends(ValueDownlinkRecord, _super);
        function ValueDownlinkRecord(downlink) {
            var _this = _super.call(this) || this;
            _this._downlink = downlink;
            _this._downlink.observe(_this);
            return _this;
        }
        Object.defineProperty(ValueDownlinkRecord.prototype, "downlink", {
            get: function () {
                return this._downlink;
            },
            enumerable: true,
            configurable: true
        });
        ValueDownlinkRecord.prototype.isEmpty = function () {
            var value = this._downlink.get();
            if (value instanceof structure.Record) {
                return value.isEmpty();
            }
            else {
                return !value.isDefined();
            }
        };
        ValueDownlinkRecord.prototype.isArray = function () {
            var value = this._downlink.get();
            if (value instanceof structure.Record) {
                return value.isArray();
            }
            else {
                return true;
            }
        };
        ValueDownlinkRecord.prototype.isObject = function () {
            var value = this._downlink.get();
            if (value instanceof structure.Record) {
                return value.isObject();
            }
            else {
                return !value.isDefined();
            }
        };
        Object.defineProperty(ValueDownlinkRecord.prototype, "length", {
            get: function () {
                var value = this._downlink.get();
                if (value instanceof structure.Record) {
                    return value.length;
                }
                else if (value.isDefined()) {
                    return 1;
                }
                else {
                    return 0;
                }
            },
            enumerable: true,
            configurable: true
        });
        ValueDownlinkRecord.prototype.has = function (key) {
            var value = this._downlink.get();
            if (value instanceof structure.Record) {
                return value.has(key);
            }
            else {
                return false;
            }
        };
        ValueDownlinkRecord.prototype.get = function (key) {
            if (key === void 0) {
                return this;
            }
            else {
                var value = this._downlink.get();
                if (value instanceof structure.Record) {
                    return value.get(key);
                }
                else {
                    return structure.Value.absent();
                }
            }
        };
        ValueDownlinkRecord.prototype.getAttr = function (key) {
            var value = this._downlink.get();
            if (value instanceof structure.Record) {
                return value.getAttr(key);
            }
            else {
                return structure.Value.absent();
            }
        };
        ValueDownlinkRecord.prototype.getSlot = function (key) {
            var value = this._downlink.get();
            if (value instanceof structure.Record) {
                return value.getSlot(key);
            }
            else {
                return structure.Value.absent();
            }
        };
        ValueDownlinkRecord.prototype.getField = function (key) {
            var value = this._downlink.get();
            if (value instanceof structure.Record) {
                return value.getField(key);
            }
            else {
                return void 0;
            }
        };
        ValueDownlinkRecord.prototype.getItem = function (index) {
            var value = this._downlink.get();
            if (value instanceof structure.Record) {
                return value.getItem(index);
            }
            else {
                return value;
            }
        };
        ValueDownlinkRecord.prototype.set = function (key, newValue) {
            var value = this._downlink.get();
            if (value instanceof structure.Record) {
                value.set(key, newValue);
            }
            else {
                throw new Error("unsupported");
            }
            return this;
        };
        ValueDownlinkRecord.prototype.setAttr = function (key, newValue) {
            var value = this._downlink.get();
            if (value instanceof structure.Record) {
                value.setAttr(key, newValue);
            }
            else {
                throw new Error("unsupported");
            }
            return this;
        };
        ValueDownlinkRecord.prototype.setSlot = function (key, newValue) {
            var value = this._downlink.get();
            if (value instanceof structure.Record) {
                value.setSlot(key, newValue);
            }
            else {
                throw new Error("unsupported");
            }
            return this;
        };
        ValueDownlinkRecord.prototype.setItem = function (index, newItem) {
            var value = this._downlink.get();
            if (value instanceof structure.Record) {
                value.setItem(index, newItem);
            }
            else {
                this._downlink.set(structure.Item.fromAny(newItem).toValue());
            }
            return this;
        };
        ValueDownlinkRecord.prototype.push = function () {
            var newItems = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                newItems[_i] = arguments[_i];
            }
            var value = this._downlink.get();
            if (value instanceof structure.Record) {
                return value.push.apply(value, arguments);
            }
            else {
                throw new Error("unsupported");
            }
        };
        ValueDownlinkRecord.prototype.splice = function (start, deleteCount) {
            var newItems = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                newItems[_i - 2] = arguments[_i];
            }
            var value = this._downlink.get();
            if (value instanceof structure.Record) {
                return value.splice.apply(value, arguments);
            }
            else {
                throw new Error("unsupported");
            }
        };
        ValueDownlinkRecord.prototype.delete = function (key) {
            var value = this._downlink.get();
            if (value instanceof structure.Record) {
                return value.delete(key);
            }
            else {
                return structure.Value.absent();
            }
        };
        ValueDownlinkRecord.prototype.clear = function () {
            var value = this._downlink.get();
            if (value instanceof structure.Record) {
                value.clear();
            }
            else {
                throw new Error("unsupported");
            }
        };
        ValueDownlinkRecord.prototype.forEach = function (callback, thisArg) {
            var value = this._downlink.get();
            return value.forEach(callback, thisArg);
        };
        ValueDownlinkRecord.prototype.keyIterator = function () {
            var value = this._downlink.get();
            if (value instanceof structure.Record) {
                throw new Error();
            }
            else {
                return util.Cursor.empty();
            }
        };
        ValueDownlinkRecord.prototype.didSet = function (newValue, oldValue) {
            this.invalidateInput();
            this.reconcileInput(0);
        };
        return ValueDownlinkRecord;
    }(DownlinkRecord));

    var DownlinkTransmuter = (function (_super) {
        __extends(DownlinkTransmuter, _super);
        function DownlinkTransmuter(warp) {
            var _this = _super.call(this) || this;
            _this.warp = warp;
            return _this;
        }
        DownlinkTransmuter.prototype.transmute = function (model) {
            if (model.tag() === "link") {
                var streamlet = new DownlinkStreamlet(this.warp, model);
                streamlet.compile();
                return streamlet;
            }
            return model;
        };
        return DownlinkTransmuter;
    }(dataflow.Transmuter));

    var DownlinkStreamlet = (function (_super) {
        __extends(DownlinkStreamlet, _super);
        function DownlinkStreamlet(warp, scope) {
            var _this = _super.call(this, scope) || this;
            _this.hostUri = _this.inoutlet();
            _this.nodeUri = _this.inoutlet();
            _this.laneUri = _this.inoutlet();
            _this.prio = _this.inoutlet();
            _this.rate = _this.inoutlet();
            _this.bodyValue = _this.inoutlet();
            _this.type = _this.inoutlet();
            _this.warp = warp;
            return _this;
        }
        DownlinkStreamlet.prototype.getOutput = function (outlet) {
            outlet = this.outlet(outlet);
            if (outlet === this.state) {
                if (this.downlink instanceof ValueDownlink) {
                    return this.downlink.get();
                }
                else if (this.downlinkRecord) {
                    return this.downlinkRecord;
                }
            }
            return void 0;
        };
        DownlinkStreamlet.prototype.onReconcile = function (version) {
            var hostUri = this.castInput(this.hostUri, structure.Form.forString());
            var nodeUri = this.castInput(this.nodeUri, structure.Form.forString());
            var laneUri = this.castInput(this.laneUri, structure.Form.forString());
            var prio = this.castInput(this.prio, structure.Form.forNumber(), 0);
            var rate = this.castInput(this.rate, structure.Form.forNumber(), 0);
            var body = this.getInput(this.bodyValue);
            var type = this.castInput(this.type, structure.Form.forString(), void 0);
            if (hostUri !== this.inputHostUri || nodeUri !== this.inputNodeUri || laneUri !== this.inputLaneUri
                || prio !== this.inputPrio || rate !== this.inputRate
                || (body === void 0 ? this.inputBody !== void 0 : !body.equals(this.inputBody))
                || type !== this.inputType) {
                if (this.downlink) {
                    this.downlink.close();
                    this.downlink = void 0;
                    this.downlinkRecord = void 0;
                }
                this.inputHostUri = hostUri;
                this.inputNodeUri = nodeUri;
                this.inputLaneUri = laneUri;
                this.inputPrio = prio;
                this.inputRate = rate;
                this.inputBody = body;
                this.inputType = type;
                var warp = this.warp || client;
                if (type === "map") {
                    var downlink = warp.downlinkMap();
                    if (hostUri !== void 0) {
                        downlink = downlink.hostUri(hostUri);
                    }
                    if (nodeUri !== void 0) {
                        downlink = downlink.nodeUri(nodeUri);
                    }
                    if (laneUri !== void 0) {
                        downlink = downlink.laneUri(laneUri);
                    }
                    if (prio !== 0) {
                        downlink = downlink.prio(prio);
                    }
                    if (rate !== 0) {
                        downlink = downlink.rate(rate);
                    }
                    if (body !== void 0) {
                        downlink = downlink.body(body);
                    }
                    downlink = downlink.open();
                    this.state = downlink;
                    this.downlink = downlink;
                    this.downlinkRecord = new MapDownlinkRecord(downlink);
                }
                else if (type === "value") {
                    var downlink = warp.downlinkValue();
                    if (hostUri !== void 0) {
                        downlink = downlink.hostUri(hostUri);
                    }
                    if (nodeUri !== void 0) {
                        downlink = downlink.nodeUri(nodeUri);
                    }
                    if (laneUri !== void 0) {
                        downlink = downlink.laneUri(laneUri);
                    }
                    if (prio !== void 0) {
                        downlink = downlink.prio(prio);
                    }
                    if (rate !== void 0) {
                        downlink = downlink.rate(rate);
                    }
                    if (body !== void 0) {
                        downlink = downlink.body(body);
                    }
                    downlink = downlink.open();
                    this.state = downlink;
                    this.downlink = downlink;
                }
            }
        };
        DownlinkStreamlet.transmuter = function (warp) {
            if (warp === void 0) {
                if (!DownlinkStreamlet._transmuter) {
                    DownlinkStreamlet._transmuter = new DownlinkTransmuter();
                }
                return DownlinkStreamlet._transmuter;
            }
            else {
                return new DownlinkTransmuter(warp);
            }
        };
        __decorate([
            streamlet.Inout
        ], DownlinkStreamlet.prototype, "hostUri", void 0);
        __decorate([
            streamlet.Inout
        ], DownlinkStreamlet.prototype, "nodeUri", void 0);
        __decorate([
            streamlet.Inout
        ], DownlinkStreamlet.prototype, "laneUri", void 0);
        __decorate([
            streamlet.Inout
        ], DownlinkStreamlet.prototype, "prio", void 0);
        __decorate([
            streamlet.Inout
        ], DownlinkStreamlet.prototype, "rate", void 0);
        __decorate([
            streamlet.Inout("body")
        ], DownlinkStreamlet.prototype, "bodyValue", void 0);
        __decorate([
            streamlet.Inout
        ], DownlinkStreamlet.prototype, "type", void 0);
        __decorate([
            streamlet.Out
        ], DownlinkStreamlet.prototype, "state", void 0);
        return DownlinkStreamlet;
    }(dataflow.AbstractRecordStreamlet));

    var BaseRef = (function () {
        function BaseRef(context) {
            this._context = context;
            this._host = void 0;
            this._downlinks = [];
            this._observers = null;
        }
        BaseRef.prototype.isConnected = function () {
            return this._host ? this._host.isConnected() : false;
        };
        BaseRef.prototype.isAuthenticated = function () {
            return this._host ? this._host.isAuthenticated() : false;
        };
        BaseRef.prototype.session = function () {
            return this._host ? this._host.session() : structure.Value.absent();
        };
        BaseRef.prototype.authenticate = function (credentials) {
            this._context.authenticate(this.hostUri(), credentials);
        };
        BaseRef.prototype.addDownlink = function (downlink) {
            if (this._downlinks.length === 0) {
                this.open();
            }
            this._downlinks.push(downlink);
        };
        BaseRef.prototype.removeDownlink = function (downlink) {
            var i = this._downlinks.indexOf(downlink);
            if (i >= 0) {
                this._downlinks.splice(i, 1);
                if (this._downlinks.length === 0) {
                    this.close();
                }
            }
        };
        BaseRef.prototype.open = function () {
            this._context.openRef(this);
        };
        BaseRef.prototype.close = function () {
            this._context.closeRef(this);
        };
        BaseRef.prototype.closeUp = function () {
            var downlinks = this._downlinks;
            this._downlinks = [];
            for (var i = 0, n = downlinks.length; i < n; i += 1) {
                downlinks[i].close();
            }
        };
        BaseRef.prototype.observe = function (observer) {
            var oldObservers = this._observers;
            var n = oldObservers ? oldObservers.length : 0;
            var newObservers = new Array(n + 1);
            for (var i = 0; i < n; i += 1) {
                newObservers[i] = oldObservers[i];
            }
            newObservers[n] = observer;
            this._observers = newObservers;
            return this;
        };
        BaseRef.prototype.unobserve = function (observer) {
            var oldObservers = this._observers;
            var n = oldObservers ? oldObservers.length : 0;
            for (var i = 0; i < n; i += 1) {
                var oldObserver = oldObservers[i];
                var found = oldObserver === observer;
                if (!found) {
                    for (var key in oldObserver) {
                        if (oldObserver[key] === observer) {
                            found = true;
                            break;
                        }
                    }
                }
                if (found) {
                    if (n > 1) {
                        var newObservers = new Array(n - 1);
                        for (var j = 0; j < i; j += 1) {
                            newObservers[j] = oldObservers[j];
                        }
                        for (var j = i + 1; j < n; j += 1) {
                            newObservers[j - 1] = oldObservers[j];
                        }
                        this._observers = newObservers;
                    }
                    else {
                        this._observers = null;
                    }
                    break;
                }
            }
            return this;
        };
        BaseRef.prototype.didConnect = function (didConnect) {
            return this.observe({ didConnect: didConnect });
        };
        BaseRef.prototype.didAuthenticate = function (didAuthenticate) {
            return this.observe({ didAuthenticate: didAuthenticate });
        };
        BaseRef.prototype.didDeauthenticate = function (didDeauthenticate) {
            return this.observe({ didDeauthenticate: didDeauthenticate });
        };
        BaseRef.prototype.didDisconnect = function (didDisconnect) {
            return this.observe({ didDisconnect: didDisconnect });
        };
        BaseRef.prototype.didFail = function (didFail) {
            return this.observe({ didFail: didFail });
        };
        BaseRef.prototype.hostDidConnect = function (host) {
            this._host = host;
            var observers = this._observers;
            var n = observers ? observers.length : 0;
            for (var i = 0; i < n; i += 1) {
                var observer = observers[i];
                if (observer.didConnect) {
                    observer.didConnect(host, this);
                }
            }
        };
        BaseRef.prototype.hostDidAuthenticate = function (body, host) {
            var observers = this._observers;
            var n = observers ? observers.length : 0;
            for (var i = 0; i < n; i += 1) {
                var observer = observers[i];
                if (observer.didAuthenticate) {
                    observer.didAuthenticate(body, host, this);
                }
            }
        };
        BaseRef.prototype.hostDidDeauthenticate = function (body, host) {
            var observers = this._observers;
            var n = observers ? observers.length : 0;
            for (var i = 0; i < n; i += 1) {
                var observer = observers[i];
                if (observer.didDeauthenticate) {
                    observer.didDeauthenticate(body, host, this);
                }
            }
        };
        BaseRef.prototype.hostDidDisconnect = function (host) {
            this._host = void 0;
            var observers = this._observers;
            var n = observers ? observers.length : 0;
            for (var i = 0; i < n; i += 1) {
                var observer = observers[i];
                if (observer.didDisconnect) {
                    observer.didDisconnect(host, this);
                }
            }
        };
        BaseRef.prototype.hostDidFail = function (error, host) {
            var observers = this._observers;
            var n = observers ? observers.length : 0;
            for (var i = 0; i < n; i += 1) {
                var observer = observers[i];
                if (observer.didFail) {
                    observer.didFail(error, host, this);
                }
            }
        };
        return BaseRef;
    }());

    var LaneRef = (function (_super) {
        __extends(LaneRef, _super);
        function LaneRef(context, hostUri, nodeUri, laneUri) {
            var _this = _super.call(this, context) || this;
            _this._hostUri = hostUri;
            _this._nodeUri = nodeUri;
            _this._laneUri = laneUri;
            return _this;
        }
        LaneRef.prototype.hostUri = function () {
            return this._hostUri;
        };
        LaneRef.prototype.nodeUri = function () {
            return this._nodeUri;
        };
        LaneRef.prototype.laneUri = function () {
            return this._laneUri;
        };
        LaneRef.prototype.hostRef = function (hostUri) {
            hostUri = uri.Uri.fromAny(hostUri);
            return new HostRef(this._context, hostUri);
        };
        LaneRef.prototype.nodeRef = function (nodeUri) {
            nodeUri = uri.Uri.fromAny(nodeUri);
            return new NodeRef(this._context, this._hostUri, nodeUri);
        };
        LaneRef.prototype.laneRef = function (laneUri) {
            laneUri = uri.Uri.fromAny(laneUri);
            return new LaneRef(this._context, this._hostUri, this._nodeUri, laneUri);
        };
        LaneRef.prototype.downlink = function (init) {
            return new EventDownlink(this._context, this, init, this._hostUri, this._nodeUri, this._laneUri);
        };
        LaneRef.prototype.downlinkList = function (init) {
            return new ListDownlink(this._context, this, init, this._hostUri, this._nodeUri, this._laneUri);
        };
        LaneRef.prototype.downlinkMap = function (init) {
            return new MapDownlink(this._context, this, init, this._hostUri, this._nodeUri, this._laneUri);
        };
        LaneRef.prototype.downlinkValue = function (init) {
            return new ValueDownlink(this._context, this, init, this._hostUri, this._nodeUri, this._laneUri);
        };
        LaneRef.prototype.command = function (body) {
            this._context.command(this._hostUri, this._nodeUri, this._laneUri, body);
        };
        return LaneRef;
    }(BaseRef));

    var NodeRef = (function (_super) {
        __extends(NodeRef, _super);
        function NodeRef(context, hostUri, nodeUri) {
            var _this = _super.call(this, context) || this;
            _this._hostUri = hostUri;
            _this._nodeUri = nodeUri;
            return _this;
        }
        NodeRef.prototype.hostUri = function () {
            return this._hostUri;
        };
        NodeRef.prototype.nodeUri = function () {
            return this._nodeUri;
        };
        NodeRef.prototype.hostRef = function (hostUri) {
            hostUri = uri.Uri.fromAny(hostUri);
            return new HostRef(this._context, hostUri);
        };
        NodeRef.prototype.nodeRef = function (nodeUri) {
            nodeUri = uri.Uri.fromAny(nodeUri);
            return new NodeRef(this._context, this._hostUri, nodeUri);
        };
        NodeRef.prototype.laneRef = function (laneUri) {
            laneUri = uri.Uri.fromAny(laneUri);
            return new LaneRef(this._context, this._hostUri, this._nodeUri, laneUri);
        };
        NodeRef.prototype.downlink = function (init) {
            return new EventDownlink(this._context, this, init, this._hostUri, this._nodeUri);
        };
        NodeRef.prototype.downlinkList = function (init) {
            return new ListDownlink(this._context, this, init, this._hostUri, this._nodeUri);
        };
        NodeRef.prototype.downlinkMap = function (init) {
            return new MapDownlink(this._context, this, init, this._hostUri, this._nodeUri);
        };
        NodeRef.prototype.downlinkValue = function (init) {
            return new ValueDownlink(this._context, this, init, this._hostUri, this._nodeUri);
        };
        NodeRef.prototype.command = function (laneUri, body) {
            this._context.command(this._hostUri, this._nodeUri, laneUri, body);
        };
        return NodeRef;
    }(BaseRef));

    var HostRef = (function (_super) {
        __extends(HostRef, _super);
        function HostRef(context, hostUri) {
            var _this = _super.call(this, context) || this;
            _this._hostUri = hostUri;
            return _this;
        }
        HostRef.prototype.hostUri = function () {
            return this._hostUri;
        };
        HostRef.prototype.hostRef = function (hostUri) {
            hostUri = uri.Uri.fromAny(hostUri);
            return new HostRef(this._context, hostUri);
        };
        HostRef.prototype.nodeRef = function (nodeUri) {
            nodeUri = uri.Uri.fromAny(nodeUri);
            return new NodeRef(this._context, this._hostUri, nodeUri);
        };
        HostRef.prototype.laneRef = function (nodeUri, laneUri) {
            nodeUri = uri.Uri.fromAny(nodeUri);
            laneUri = uri.Uri.fromAny(laneUri);
            return new LaneRef(this._context, this._hostUri, nodeUri, laneUri);
        };
        HostRef.prototype.downlink = function (init) {
            return new EventDownlink(this._context, this, init, this._hostUri);
        };
        HostRef.prototype.downlinkList = function (init) {
            return new ListDownlink(this._context, this, init, this._hostUri);
        };
        HostRef.prototype.downlinkMap = function (init) {
            return new MapDownlink(this._context, this, init, this._hostUri);
        };
        HostRef.prototype.downlinkValue = function (init) {
            return new ValueDownlink(this._context, this, init, this._hostUri);
        };
        HostRef.prototype.command = function (nodeUri, laneUri, body) {
            this._context.command(this._hostUri, nodeUri, laneUri, body);
        };
        return HostRef;
    }(BaseRef));

    var WarpClient = (function () {
        function WarpClient(options) {
            if (options === void 0) { options = {}; }
            if (options.keepOnline === void 0) {
                options.keepOnline = true;
            }
            this._options = options;
            this._hosts = new collections.BTree();
            this._downlinks = new collections.BTree();
            this._downlinkCount = 0;
            this._refs = [];
            this._online = true;
            this._observers = null;
            this.onOnline = this.onOnline.bind(this);
            this.onOffline = this.onOffline.bind(this);
            this.watchOnline(!!options.keepOnline);
        }
        WarpClient.prototype.isOnline = function (online) {
            if (online === void 0) {
                return this._online;
            }
            else {
                if (this._online !== online) {
                    this._online = online;
                    this._hosts.forEach(function (hostUri, host) {
                        if (online) {
                            host.open();
                        }
                        else {
                            host.close();
                        }
                    }, this);
                }
                return this;
            }
        };
        WarpClient.prototype.keepOnline = function (keepOnline) {
            if (keepOnline === void 0) {
                return !!this._options.keepOnline;
            }
            else {
                if (this._options.keepOnline !== keepOnline) {
                    this._options.keepOnline = keepOnline;
                    this.watchOnline(keepOnline);
                }
                return this;
            }
        };
        WarpClient.prototype.watchOnline = function (keepOnline) {
            if (typeof window === "object") {
                if (keepOnline) {
                    window.addEventListener("online", this.onOnline);
                    window.addEventListener("offline", this.onOffline);
                }
                else {
                    window.removeEventListener("online", this.onOnline);
                    window.removeEventListener("offline", this.onOffline);
                }
            }
        };
        WarpClient.prototype.onOnline = function (event) {
            this.isOnline(true);
        };
        WarpClient.prototype.onOffline = function (event) {
            this.isOnline(false);
        };
        WarpClient.prototype.getHost = function (hostUri) {
            hostUri = uri.Uri.fromAny(hostUri);
            return this._hosts.get(hostUri);
        };
        WarpClient.prototype.openHost = function (hostUri) {
            hostUri = uri.Uri.fromAny(hostUri);
            var host = this._hosts.get(hostUri);
            if (!host) {
                host = new WebSocketHost(this, hostUri, this._options);
                this._hosts.set(hostUri, host);
            }
            return host;
        };
        WarpClient.prototype.closeHost = function (host) {
            if (this._hosts.get(host.hostUri())) {
                this._hosts.delete(host.hostUri());
                host.closeUp();
            }
        };
        WarpClient.prototype.getDownlink = function (hostUri, nodeUri, laneUri) {
            var hostDownlinks = this._downlinks.get(hostUri);
            if (hostDownlinks) {
                var nodeDownlinks = hostDownlinks.get(nodeUri);
                if (nodeDownlinks) {
                    return nodeDownlinks.get(laneUri);
                }
            }
            return void 0;
        };
        WarpClient.prototype.openDownlink = function (downlink) {
            var hostUri = downlink.hostUri();
            var nodeUri = downlink.nodeUri();
            var laneUri = downlink.laneUri();
            var hostDownlinks = this._downlinks.get(hostUri);
            if (!hostDownlinks) {
                hostDownlinks = new collections.BTree();
                this._downlinks.set(hostUri, hostDownlinks);
            }
            var nodeDownlinks = hostDownlinks.get(nodeUri);
            if (!nodeDownlinks) {
                nodeDownlinks = new collections.BTree();
                hostDownlinks.set(nodeUri, nodeDownlinks);
            }
            if (nodeDownlinks.has(laneUri)) {
                throw new Error("duplicate downlink");
            }
            nodeDownlinks.set(laneUri, downlink);
            this._downlinkCount += 1;
            var host = this.openHost(hostUri);
            host.openDownlink(downlink);
        };
        WarpClient.prototype.unlinkDownlink = function (downlink) {
            var hostUri = downlink.hostUri();
            var host = this.getHost(hostUri);
            if (host) {
                host.unlinkDownlink(downlink);
            }
        };
        WarpClient.prototype.closeDownlink = function (downlink) {
            var hostUri = downlink.hostUri();
            var nodeUri = downlink.nodeUri();
            var laneUri = downlink.laneUri();
            var hostDownlinks = this._downlinks.get(hostUri);
            if (hostDownlinks) {
                var nodeDownlinks = hostDownlinks.get(nodeUri);
                if (nodeDownlinks) {
                    if (nodeDownlinks.get(laneUri)) {
                        this._downlinkCount -= 1;
                        nodeDownlinks.delete(laneUri);
                        if (nodeDownlinks.isEmpty()) {
                            hostDownlinks.delete(nodeUri);
                            if (hostDownlinks.isEmpty()) {
                                this._downlinks.delete(hostUri);
                            }
                        }
                        var host = this.getHost(hostUri);
                        if (host) {
                            host.closeDownlink(downlink);
                        }
                    }
                }
            }
        };
        WarpClient.prototype.downlink = function (init) {
            return new EventDownlink(this, void 0, init);
        };
        WarpClient.prototype.downlinkList = function (init) {
            return new ListDownlink(this, void 0, init);
        };
        WarpClient.prototype.downlinkMap = function (init) {
            return new MapDownlink(this, void 0, init);
        };
        WarpClient.prototype.downlinkValue = function (init) {
            return new ValueDownlink(this, void 0, init);
        };
        WarpClient.prototype.openRef = function (ref) {
            this._refs.push(ref);
        };
        WarpClient.prototype.closeRef = function (ref) {
            var index = this._refs.indexOf(ref);
            if (index >= 0) {
                this._refs.splice(index, 1);
                ref.closeUp();
            }
        };
        WarpClient.prototype.hostRef = function (hostUri) {
            hostUri = uri.Uri.fromAny(hostUri);
            return new HostRef(this, hostUri);
        };
        WarpClient.prototype.nodeRef = function (hostUri, nodeUri) {
            hostUri = uri.Uri.fromAny(hostUri);
            if (nodeUri === void 0) {
                nodeUri = hostUri;
                hostUri = nodeUri.endpoint();
                nodeUri = hostUri.unresolve(nodeUri);
            }
            else {
                nodeUri = uri.Uri.fromAny(nodeUri);
            }
            return new NodeRef(this, hostUri, nodeUri);
        };
        WarpClient.prototype.laneRef = function (hostUri, nodeUri, laneUri) {
            hostUri = uri.Uri.fromAny(hostUri);
            nodeUri = uri.Uri.fromAny(nodeUri);
            if (laneUri === void 0) {
                laneUri = nodeUri;
                nodeUri = hostUri;
                hostUri = nodeUri.endpoint();
                nodeUri = hostUri.unresolve(nodeUri);
            }
            else {
                laneUri = uri.Uri.fromAny(laneUri);
            }
            return new LaneRef(this, hostUri, nodeUri, laneUri);
        };
        WarpClient.prototype.authenticate = function (hostUri, credentials) {
            hostUri = uri.Uri.fromAny(hostUri);
            credentials = structure.Value.fromAny(credentials);
            var host = this.openHost(hostUri);
            host.authenticate(credentials);
        };
        WarpClient.prototype.command = function (hostUri, nodeUri, laneUri, body) {
            hostUri = uri.Uri.fromAny(hostUri);
            nodeUri = uri.Uri.fromAny(nodeUri);
            if (arguments.length === 3) {
                body = laneUri;
                laneUri = nodeUri;
                nodeUri = hostUri;
                hostUri = nodeUri.endpoint();
                nodeUri = hostUri.unresolve(nodeUri);
            }
            else {
                laneUri = uri.Uri.fromAny(laneUri);
            }
            body = structure.Value.fromAny(body);
            var host = this.openHost(hostUri);
            host.command(nodeUri, laneUri, body);
        };
        WarpClient.prototype.close = function () {
            var refs = this._refs;
            this._refs = [];
            for (var i = 0; i < refs.length; i += 1) {
                refs[i].closeUp();
            }
            var downlinks = this._downlinks.clone();
            this._downlinks.clear();
            this._downlinkCount = 0;
            downlinks.forEach(function (hostUri, hostDownlinks) {
                hostDownlinks.forEach(function (nodeUri, nodeDownlinks) {
                    nodeDownlinks.forEach(function (laneUri, downlink) {
                        downlink.closeUp();
                        var host = this.getHost(hostUri);
                        if (host) {
                            host.closeDownlink(downlink);
                        }
                    }, this);
                }, this);
            }, this);
            var hosts = this._hosts.clone();
            this._hosts.clear();
            hosts.forEach(function (hostUri, host) {
                host.closeUp();
            }, this);
        };
        WarpClient.prototype.observe = function (observer) {
            var oldObservers = this._observers;
            var n = oldObservers ? oldObservers.length : 0;
            var newObservers = new Array(n + 1);
            for (var i = 0; i < n; i += 1) {
                newObservers[i] = oldObservers[i];
            }
            newObservers[n] = observer;
            this._observers = newObservers;
            return this;
        };
        WarpClient.prototype.unobserve = function (observer) {
            var oldObservers = this._observers;
            var n = oldObservers ? oldObservers.length : 0;
            for (var i = 0; i < n; i += 1) {
                var oldObserver = oldObservers[i];
                var found = oldObserver === observer;
                if (!found) {
                    for (var key in oldObserver) {
                        if (oldObserver[key] === observer) {
                            found = true;
                            break;
                        }
                    }
                }
                if (found) {
                    if (n > 1) {
                        var newObservers = new Array(n - 1);
                        for (var j = 0; j < i; j += 1) {
                            newObservers[j] = oldObservers[j];
                        }
                        for (var j = i + 1; j < n; j += 1) {
                            newObservers[j - 1] = oldObservers[j];
                        }
                        this._observers = newObservers;
                    }
                    else {
                        this._observers = null;
                    }
                    break;
                }
            }
            return this;
        };
        WarpClient.prototype.didConnect = function (didConnect) {
            return this.observe({ didConnect: didConnect });
        };
        WarpClient.prototype.didAuthenticate = function (didAuthenticate) {
            return this.observe({ didAuthenticate: didAuthenticate });
        };
        WarpClient.prototype.didDeauthenticate = function (didDeauthenticate) {
            return this.observe({ didDeauthenticate: didDeauthenticate });
        };
        WarpClient.prototype.didDisconnect = function (didDisconnect) {
            return this.observe({ didDisconnect: didDisconnect });
        };
        WarpClient.prototype.didFail = function (didFail) {
            return this.observe({ didFail: didFail });
        };
        WarpClient.prototype.hostDidConnect = function (host) {
            var observers = this._observers;
            var n = observers ? observers.length : 0;
            for (var i = 0; i < n; i += 1) {
                var observer = observers[i];
                if (observer.didConnect) {
                    observer.didConnect(host, this);
                }
            }
            for (var i = 0; i < this._refs.length; i += 1) {
                var ref = this._refs[i];
                if (ref.hostUri().equals(host.hostUri())) {
                    ref.hostDidConnect(host);
                }
            }
        };
        WarpClient.prototype.hostDidAuthenticate = function (body, host) {
            var observers = this._observers;
            var n = observers ? observers.length : 0;
            for (var i = 0; i < n; i += 1) {
                var observer = observers[i];
                if (observer.didAuthenticate) {
                    observer.didAuthenticate(body, host, this);
                }
            }
            for (var i = 0; i < this._refs.length; i += 1) {
                var ref = this._refs[i];
                if (ref.hostUri().equals(host.hostUri())) {
                    ref.hostDidAuthenticate(body, host);
                }
            }
        };
        WarpClient.prototype.hostDidDeauthenticate = function (body, host) {
            var observers = this._observers;
            var n = observers ? observers.length : 0;
            for (var i = 0; i < n; i += 1) {
                var observer = observers[i];
                if (observer.didDeauthenticate) {
                    observer.didDeauthenticate(body, host, this);
                }
            }
            for (var i = 0; i < this._refs.length; i += 1) {
                var ref = this._refs[i];
                if (ref.hostUri().equals(host.hostUri())) {
                    ref.hostDidDeauthenticate(body, host);
                }
            }
        };
        WarpClient.prototype.hostDidDisconnect = function (host) {
            var observers = this._observers;
            var n = observers ? observers.length : 0;
            for (var i = 0; i < n; i += 1) {
                var observer = observers[i];
                if (observer.didDisconnect) {
                    observer.didDisconnect(host, this);
                }
            }
            for (var i = 0; i < this._refs.length; i += 1) {
                var ref = this._refs[i];
                if (ref.hostUri().equals(host.hostUri())) {
                    ref.hostDidDisconnect(host);
                }
            }
        };
        WarpClient.prototype.hostDidFail = function (error, host) {
            var observers = this._observers;
            var n = observers ? observers.length : 0;
            for (var i = 0; i < n; i += 1) {
                var observer = observers[i];
                if (observer.didFail) {
                    observer.didFail(error, host, this);
                }
            }
            for (var i = 0; i < this._refs.length; i += 1) {
                var ref = this._refs[i];
                if (ref.hostUri().equals(host.hostUri())) {
                    ref.hostDidFail(error, host);
                }
            }
        };
        return WarpClient;
    }());

    var client = new WarpClient();
    var isOnline = client.isOnline.bind(client);
    var keepOnline = client.keepOnline.bind(client);
    var downlink = client.downlink.bind(client);
    var downlinkList = client.downlinkList.bind(client);
    var downlinkMap = client.downlinkMap.bind(client);
    var downlinkValue = client.downlinkValue.bind(client);
    var hostRef = client.hostRef.bind(client);
    var nodeRef = client.nodeRef.bind(client);
    var laneRef = client.laneRef.bind(client);
    var authenticate = client.authenticate.bind(client);
    var command = client.command.bind(client);

    exports.AuthRequest = AuthRequest;
    exports.AuthedResponse = AuthedResponse;
    exports.BaseRef = BaseRef;
    exports.CommandMessage = CommandMessage;
    exports.DeauthRequest = DeauthRequest;
    exports.DeauthedResponse = DeauthedResponse;
    exports.Downlink = Downlink;
    exports.DownlinkModel = DownlinkModel;
    exports.DownlinkRecord = DownlinkRecord;
    exports.DownlinkStreamlet = DownlinkStreamlet;
    exports.DownlinkTransmuter = DownlinkTransmuter;
    exports.Envelope = Envelope;
    exports.EventDownlink = EventDownlink;
    exports.EventDownlinkModel = EventDownlinkModel;
    exports.EventMessage = EventMessage;
    exports.Host = Host;
    exports.HostAddressed = HostAddressed;
    exports.HostRef = HostRef;
    exports.LaneAddressed = LaneAddressed;
    exports.LaneRef = LaneRef;
    exports.LinkAddressed = LinkAddressed;
    exports.LinkRequest = LinkRequest;
    exports.LinkedResponse = LinkedResponse;
    exports.ListDownlink = ListDownlink;
    exports.ListDownlinkModel = ListDownlinkModel;
    exports.ListDownlinkRecord = ListDownlinkRecord;
    exports.MapDownlink = MapDownlink;
    exports.MapDownlinkModel = MapDownlinkModel;
    exports.MapDownlinkRecord = MapDownlinkRecord;
    exports.NodeRef = NodeRef;
    exports.RemoteHost = RemoteHost;
    exports.SyncRequest = SyncRequest;
    exports.SyncedResponse = SyncedResponse;
    exports.UnlinkRequest = UnlinkRequest;
    exports.UnlinkedResponse = UnlinkedResponse;
    exports.ValueDownlink = ValueDownlink;
    exports.ValueDownlinkModel = ValueDownlinkModel;
    exports.ValueDownlinkRecord = ValueDownlinkRecord;
    exports.WarpClient = WarpClient;
    exports.WebSocketHost = WebSocketHost;
    exports.authenticate = authenticate;
    exports.client = client;
    exports.command = command;
    exports.downlink = downlink;
    exports.downlinkList = downlinkList;
    exports.downlinkMap = downlinkMap;
    exports.downlinkValue = downlinkValue;
    exports.hostRef = hostRef;
    exports.isOnline = isOnline;
    exports.keepOnline = keepOnline;
    exports.laneRef = laneRef;
    exports.nodeRef = nodeRef;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=swim-mesh.js.map