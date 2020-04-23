(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@swim/view')) :
    typeof define === 'function' && define.amd ? define(['exports', '@swim/view'], factory) :
    (global = global || self, factory(global.swim = global.swim || {}, global.swim));
}(this, function (exports, view) { 'use strict';

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

    var NavbarView = (function (_super) {
        __extends(NavbarView, _super);
        function NavbarView(node, key) {
            if (key === void 0) { key = null; }
            var _this = _super.call(this, node, key) || this;
            _this.onToggleClick = _this.onToggleClick.bind(_this);
            _this._visibleClass = "navbar-visible";
            return _this;
        }
        Object.defineProperty(NavbarView.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NavbarView.prototype, "toggleView", {
            get: function () {
                return this.getChildView("toggle");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NavbarView.prototype, "menuView", {
            get: function () {
                return this.getChildView("menu");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NavbarView.prototype, "visibleClass", {
            get: function () {
                return this._visibleClass;
            },
            set: function (value) {
                this._visibleClass = value;
            },
            enumerable: true,
            configurable: true
        });
        NavbarView.prototype.onInsertChildView = function (childView, targetView) {
            _super.prototype.onInsertChildView.call(this, childView, targetView);
            var childKey = childView.key();
            if (childKey === "toggle") {
                this.onInsertToggleView(childView);
            }
        };
        NavbarView.prototype.onRemoveChildView = function (childView) {
            var childKey = childView.key();
            if (childKey === "toggle") {
                this.onRemoveToggleView(childView);
            }
            _super.prototype.onRemoveChildView.call(this, childView);
        };
        NavbarView.prototype.onInsertToggleView = function (toggleView) {
            toggleView.on("click", this.onToggleClick);
        };
        NavbarView.prototype.onRemoveToggleView = function (toggleView) {
            toggleView.off("click", this.onToggleClick);
        };
        NavbarView.prototype.onToggleClick = function (event) {
            var menuView = this.menuView;
            if (menuView) {
                var classList = menuView.node.classList;
                if (classList.contains(this._visibleClass)) {
                    classList.remove(this._visibleClass);
                }
                else {
                    classList.add(this._visibleClass);
                }
            }
        };
        return NavbarView;
    }(view.HtmlView));

    var DropdownView = (function (_super) {
        __extends(DropdownView, _super);
        function DropdownView(node, key) {
            if (key === void 0) { key = null; }
            var _this = _super.call(this, node, key) || this;
            _this.onToggleClick = _this.onToggleClick.bind(_this);
            _this._visibleClass = "dropdown-visible";
            return _this;
        }
        Object.defineProperty(DropdownView.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DropdownView.prototype, "toggleView", {
            get: function () {
                return this.getChildView("toggle");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DropdownView.prototype, "menuView", {
            get: function () {
                return this.getChildView("menu");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DropdownView.prototype, "visibleClass", {
            get: function () {
                return this._visibleClass;
            },
            set: function (value) {
                this._visibleClass = value;
            },
            enumerable: true,
            configurable: true
        });
        DropdownView.prototype.onInsertChildView = function (childView, targetView) {
            _super.prototype.onInsertChildView.call(this, childView, targetView);
            var childKey = childView.key();
            if (childKey === "toggle") {
                this.onInsertToggleView(childView);
            }
        };
        DropdownView.prototype.onRemoveChildView = function (childView) {
            var childKey = childView.key();
            if (childKey === "toggle") {
                this.onRemoveToggleView(childView);
            }
            _super.prototype.onRemoveChildView.call(this, childView);
        };
        DropdownView.prototype.onInsertToggleView = function (toggleView) {
            toggleView.on("click", this.onToggleClick);
        };
        DropdownView.prototype.onRemoveToggleView = function (toggleView) {
            toggleView.off("click", this.onToggleClick);
        };
        DropdownView.prototype.onToggleClick = function (event) {
            var menuView = this.menuView;
            if (menuView) {
                var classList = menuView.node.classList;
                if (classList.contains(this._visibleClass)) {
                    classList.remove(this._visibleClass);
                }
                else {
                    var appView = this.appView;
                    if (appView) {
                        appView.showPopover(this);
                    }
                }
                event.stopPropagation();
                event.preventDefault();
            }
        };
        Object.defineProperty(DropdownView.prototype, "popoverState", {
            get: function () {
                var menuView = this.menuView;
                if (menuView) {
                    var classList = menuView.node.classList;
                    if (classList.contains(this._visibleClass)) {
                        return "shown";
                    }
                }
                return "hidden";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DropdownView.prototype, "popoverView", {
            get: function () {
                return this.menuView;
            },
            enumerable: true,
            configurable: true
        });
        DropdownView.prototype.showPopover = function (tween) {
            var menuView = this.menuView;
            if (menuView) {
                var classList = menuView.node.classList;
                classList.add(this._visibleClass);
            }
        };
        DropdownView.prototype.hidePopover = function (tween) {
            var menuView = this.menuView;
            if (menuView) {
                var classList = menuView.node.classList;
                classList.remove(this._visibleClass);
            }
            var appView = this.appView;
            if (appView) {
                appView.hidePopover(this);
            }
        };
        return DropdownView;
    }(view.HtmlView));

    var WebAppView = (function (_super) {
        __extends(WebAppView, _super);
        function WebAppView(node, key) {
            if (key === void 0) { key = null; }
            return _super.call(this, node, key) || this;
        }
        Object.defineProperty(WebAppView.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: true,
            configurable: true
        });
        WebAppView.prototype.materializeTree = function (parentView) {
            if (parentView === void 0) { parentView = this; }
            var childNodes = parentView.node.childNodes;
            for (var i = 0; i < childNodes.length; i += 1) {
                var childNode = childNodes[i];
                var childView = this.materializeNode(parentView, childNode);
                if (childView) {
                    this.materializeTree(childView);
                }
            }
        };
        WebAppView.prototype.materializeNode = function (parentView, childNode) {
            if (childNode.view) {
                return childNode.view;
            }
            else if (childNode instanceof Element) {
                return this.materializeElement(parentView, childNode);
            }
            else if (childNode instanceof Text) {
                return this.materializeText(parentView, childNode);
            }
            else {
                return void 0;
            }
        };
        WebAppView.prototype.materializeElement = function (parentView, childNode) {
            var ViewClass;
            var viewClassName = childNode.getAttribute("swim-view");
            if (viewClassName) {
                var viewClass = WebAppView.eval(viewClassName);
                if (typeof viewClass === "function") {
                    ViewClass = viewClass;
                }
                else {
                    throw new TypeError(viewClassName);
                }
            }
            if (!ViewClass) {
                if (childNode instanceof HTMLElement) {
                    ViewClass = view.HtmlView;
                }
                else if (childNode instanceof SVGElement) {
                    ViewClass = view.SvgView;
                }
                else {
                    ViewClass = view.ElementView;
                }
            }
            var childView = new ViewClass(childNode);
            var key = childNode.getAttribute("slot");
            if (key) {
                childView.key(key);
            }
            WebAppView.bindController(childView);
            parentView.injectChildView(childView, null);
            return childView;
        };
        WebAppView.prototype.materializeText = function (parentView, childNode) {
            return void 0;
        };
        WebAppView.boot = function () {
            var webapps = [];
            if (typeof document !== "undefined") {
                var nodes = document.querySelectorAll("[swim-webapp]");
                for (var i = 0; i < nodes.length; i += 1) {
                    var node = nodes[i];
                    if (node instanceof HTMLElement) {
                        var webapp = WebAppView.bootElement(node);
                        webapps.push(webapp);
                    }
                }
            }
            return webapps;
        };
        WebAppView.bootElement = function (node) {
            var ViewClass;
            var viewClassName = node.getAttribute("swim-webapp");
            if (viewClassName) {
                var viewClass = WebAppView.eval(viewClassName);
                if (typeof viewClass === "function") {
                    ViewClass = viewClass;
                }
                else {
                    throw new TypeError(viewClassName);
                }
            }
            if (!ViewClass) {
                ViewClass = WebAppView;
            }
            var webapp = new ViewClass(node);
            var key = node.getAttribute("slot");
            if (key) {
                webapp.key(key);
            }
            WebAppView.bindController(webapp);
            webapp.cascadeMount();
            webapp.materializeTree();
            return webapp;
        };
        WebAppView.bindController = function (view) {
            var viewControllerName = view.node.getAttribute("swim-controller");
            if (viewControllerName) {
                var viewControllerClass = WebAppView.eval(viewControllerName);
                if (typeof viewControllerClass === "function") {
                    var ViewControllerClass = viewControllerClass;
                    var viewController = new ViewControllerClass();
                    view.setViewController(viewController);
                }
                else {
                    throw new TypeError(viewControllerName);
                }
            }
        };
        WebAppView.eval = function (qname) {
            var value = typeof window !== "undefined" ? window : void 0;
            var idents = qname.split(".");
            for (var i = 0, n = idents.length; value && typeof value === "object" && i < n; i += 1) {
                var ident = idents[i];
                value = value[ident];
            }
            return value;
        };
        return WebAppView;
    }(view.HtmlAppView));

    var WebAppViewController = (function (_super) {
        __extends(WebAppViewController, _super);
        function WebAppViewController() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return WebAppViewController;
    }(view.HtmlAppViewController));

    if (typeof document !== "undefined") {
        document.addEventListener("DOMContentLoaded", function (event) {
            WebAppView.boot();
        });
    }

    exports.DropdownView = DropdownView;
    exports.NavbarView = NavbarView;
    exports.WebAppView = WebAppView;
    exports.WebAppViewController = WebAppViewController;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=swim-web.js.map