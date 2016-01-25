/* timepicker */
(function ($) { function TimeEntry() { this._disabledInputs = []; this.regional = []; this.regional[''] = { show24Hours: false, separator: ':', ampmPrefix: '', ampmNames: ['AM', 'PM'], spinnerTexts: ['Now', 'Previous field', 'Next field', 'Increment', 'Decrement'] }; this._defaults = { appendText: '', showSeconds: false, timeSteps: [1, 1, 1], initialField: 0, noSeparatorEntry: false, useMouseWheel: true, defaultTime: null, minTime: null, maxTime: null, spinnerImage: 'spinnerDefault.png', spinnerSize: [20, 20, 8], spinnerBigImage: '', spinnerBigSize: [40, 40, 16], spinnerIncDecOnly: false, spinnerRepeat: [500, 250], beforeShow: null, beforeSetTime: null }; $.extend(this._defaults, this.regional['']) } $.extend(TimeEntry.prototype, { markerClassName: 'hasTimeEntry', propertyName: 'timeEntry', _appendClass: 'timeEntry_append', _controlClass: 'timeEntry_control', _expandClass: 'timeEntry_expand', setDefaults: function (a) { $.extend(this._defaults, a || {}); return this }, _attachPlugin: function (b, c) { var d = $(b); if (d.hasClass(this.markerClassName)) { return } var e = { options: $.extend({}, this._defaults, c), input: d, _field: 0, _selectedHour: 0, _selectedMinute: 0, _selectedSecond: 0 }; d.data(this.propertyName, e).addClass(this.markerClassName).bind('focus.' + this.propertyName, this._doFocus).bind('blur.' + this.propertyName, this._doBlur).bind('click.' + this.propertyName, this._doClick).bind('keydown.' + this.propertyName, this._doKeyDown).bind('keypress.' + this.propertyName, this._doKeyPress).bind('paste.' + this.propertyName, function (a) { setTimeout(function () { n._parseTime(e) }, 1) }); this._optionPlugin(b, c) }, _optionPlugin: function (a, b, c) { a = $(a); var d = a.data(this.propertyName); if (!b || (typeof b == 'string' && c == null)) { var e = b; b = (d || {}).options; return (b && e ? b[e] : b) } if (!a.hasClass(this.markerClassName)) { return } b = b || {}; if (typeof b == 'string') { var e = b; b = {}; b[e] = c } var f = this._extractTime(d); $.extend(d.options, b); d._field = 0; if (f) { this._setTime(d, new Date(0, 0, 0, f[0], f[1], f[2])) } a.next('span.' + this._appendClass).remove(); a.parent().find('span.' + this._controlClass).remove(); if ($.fn.mousewheel) { a.unmousewheel() } var g = (!d.options.spinnerImage ? null : $('<span class="' + this._controlClass + '" style="display: inline-block; ' + 'background: url(\'' + d.options.spinnerImage + '\') 0 0 no-repeat; width: ' + d.options.spinnerSize[0] + 'px; height: ' + d.options.spinnerSize[1] + 'px;"></span>')); a.after(d.options.appendText ? '<span class="' + this._appendClass + '">' + d.options.appendText + '</span>' : '').after(g || ''); if (d.options.useMouseWheel && $.fn.mousewheel) { a.mousewheel(this._doMouseWheel) } if (g) { g.mousedown(this._handleSpinner).mouseup(this._endSpinner).mouseover(this._expandSpinner).mouseout(this._endSpinner).mousemove(this._describeSpinner) } }, _enablePlugin: function (a) { this._enableDisable(a, false) }, _disablePlugin: function (a) { this._enableDisable(a, true) }, _enableDisable: function (b, c) { var d = $.data(b, this.propertyName); if (!d) { return } b.disabled = c; if (b.nextSibling && b.nextSibling.nodeName.toLowerCase() == 'span') { n._changeSpinner(d, b.nextSibling, (c ? 5 : -1)) } n._disabledInputs = $.map(n._disabledInputs, function (a) { return (a == b ? null : a) }); if (c) { n._disabledInputs.push(b) } }, _isDisabledPlugin: function (a) { return $.inArray(a, this._disabledInputs) > -1 }, _destroyPlugin: function (b) { b = $(b); if (!b.hasClass(this.markerClassName)) { return } b.removeClass(this.markerClassName).removeData(this.propertyName).unbind('.' + this.propertyName); if ($.fn.mousewheel) { b.unmousewheel() } this._disabledInputs = $.map(this._disabledInputs, function (a) { return (a == b[0] ? null : a) }); b.siblings('.' + this._appendClass + ',.' + this._controlClass).remove() }, _setTimePlugin: function (a, b) { var c = $.data(a, this.propertyName); if (c) { if (b === null || b === '') { c.input.val('') } else { this._setTime(c, b ? (typeof b == 'object' ? new Date(b.getTime()) : b) : null) } } }, _getTimePlugin: function (a) { var b = $.data(a, this.propertyName); var c = (b ? this._extractTime(b) : null); return (!c ? null : new Date(0, 0, 0, c[0], c[1], c[2])) }, _getOffsetPlugin: function (a) { var b = $.data(a, this.propertyName); var c = (b ? this._extractTime(b) : null); return (!c ? 0 : (c[0] * 3600 + c[1] * 60 + c[2]) * 1000) }, _doFocus: function (a) { var b = (a.nodeName && a.nodeName.toLowerCase() == 'input' ? a : this); if (n._lastInput == b || n._isDisabledPlugin(b)) { n._focussed = false; return } var c = $.data(b, n.propertyName); n._focussed = true; n._lastInput = b; n._blurredInput = null; $.extend(c.options, ($.isFunction(c.options.beforeShow) ? c.options.beforeShow.apply(b, [b]) : {})); n._parseTime(c); setTimeout(function () { n._showField(c) }, 10) }, _doBlur: function (a) { n._blurredInput = n._lastInput; n._lastInput = null }, _doClick: function (b) { var c = b.target; var d = $.data(c, n.propertyName); if (!n._focussed) { var e = d.options.separator.length + 2; d._field = 0; if (c.selectionStart != null) { for (var f = 0; f <= Math.max(1, d._secondField, d._ampmField) ; f++) { var g = (f != d._ampmField ? (f * e) + 2 : (d._ampmField * e) + d.options.ampmPrefix.length + d.options.ampmNames[0].length); d._field = f; if (c.selectionStart < g) { break } } } else if (c.createTextRange) { var h = $(b.srcElement); var i = c.createTextRange(); var j = function (a) { return { thin: 2, medium: 4, thick: 6 }[a] || a }; var k = b.clientX + document.documentElement.scrollLeft - (h.offset().left + parseInt(j(h.css('border-left-width')), 10)) - i.offsetLeft; for (var f = 0; f <= Math.max(1, d._secondField, d._ampmField) ; f++) { var g = (f != d._ampmField ? (f * e) + 2 : (d._ampmField * e) + d.options.ampmPrefix.length + d.options.ampmNames[0].length); i.collapse(); i.moveEnd('character', g); d._field = f; if (k < i.boundingWidth) { break } } } } n._showField(d); n._focussed = false }, _doKeyDown: function (a) { if (a.keyCode >= 48) { return true } var b = $.data(a.target, n.propertyName); switch (a.keyCode) { case 9: return (a.shiftKey ? n._changeField(b, -1, true) : n._changeField(b, +1, true)); case 35: if (a.ctrlKey) { n._setValue(b, '') } else { b._field = Math.max(1, b._secondField, b._ampmField); n._adjustField(b, 0) } break; case 36: if (a.ctrlKey) { n._setTime(b) } else { b._field = 0; n._adjustField(b, 0) } break; case 37: n._changeField(b, -1, false); break; case 38: n._adjustField(b, +1); break; case 39: n._changeField(b, +1, false); break; case 40: n._adjustField(b, -1); break; case 46: n._setValue(b, ''); break; default: return true } return false }, _doKeyPress: function (a) { var b = String.fromCharCode(a.charCode == undefined ? a.keyCode : a.charCode); if (b < ' ') { return true } var c = $.data(a.target, n.propertyName); n._handleKeyPress(c, b); return false }, _doMouseWheel: function (a, b) { if (n._isDisabledPlugin(a.target)) { return } var c = $.data(a.target, n.propertyName); c.input.focus(); if (!c.input.val()) { n._parseTime(c) } n._adjustField(c, b); a.preventDefault() }, _expandSpinner: function (b) { var c = n._getSpinnerTarget(b); var d = $.data(n._getInput(c), n.propertyName); if (n._isDisabledPlugin(d.input[0])) { return } if (d.options.spinnerBigImage) { d._expanded = true; var e = $(c).offset(); var f = null; $(c).parents().each(function () { var a = $(this); if (a.css('position') == 'relative' || a.css('position') == 'absolute') { f = a.offset() } return !f }); $('<div class="' + n._expandClass + '" style="position: absolute; left: ' + (e.left - (d.options.spinnerBigSize[0] - d.options.spinnerSize[0]) / 2 - (f ? f.left : 0)) + 'px; top: ' + (e.top - (d.options.spinnerBigSize[1] - d.options.spinnerSize[1]) / 2 - (f ? f.top : 0)) + 'px; width: ' + d.options.spinnerBigSize[0] + 'px; height: ' + d.options.spinnerBigSize[1] + 'px; background: transparent url(' + d.options.spinnerBigImage + ') no-repeat 0px 0px; z-index: 10;"></div>').mousedown(n._handleSpinner).mouseup(n._endSpinner).mouseout(n._endExpand).mousemove(n._describeSpinner).insertAfter(c) } }, _getInput: function (a) { return $(a).siblings('.' + n.markerClassName)[0] }, _describeSpinner: function (a) { var b = n._getSpinnerTarget(a); var c = $.data(n._getInput(b), n.propertyName); b.title = c.options.spinnerTexts[n._getSpinnerRegion(c, a)] }, _handleSpinner: function (a) { var b = n._getSpinnerTarget(a); var c = n._getInput(b); if (n._isDisabledPlugin(c)) { return } if (c == n._blurredInput) { n._lastInput = c; n._blurredInput = null } var d = $.data(c, n.propertyName); n._doFocus(c); var e = n._getSpinnerRegion(d, a); n._changeSpinner(d, b, e); n._actionSpinner(d, e); n._timer = null; n._handlingSpinner = true; if (e >= 3 && d.options.spinnerRepeat[0]) { n._timer = setTimeout(function () { n._repeatSpinner(d, e) }, d.options.spinnerRepeat[0]); $(b).one('mouseout', n._releaseSpinner).one('mouseup', n._releaseSpinner) } }, _actionSpinner: function (a, b) { if (!a.input.val()) { n._parseTime(a) } switch (b) { case 0: this._setTime(a); break; case 1: this._changeField(a, -1, false); break; case 2: this._changeField(a, +1, false); break; case 3: this._adjustField(a, +1); break; case 4: this._adjustField(a, -1); break } }, _repeatSpinner: function (a, b) { if (!n._timer) { return } n._lastInput = n._blurredInput; this._actionSpinner(a, b); this._timer = setTimeout(function () { n._repeatSpinner(a, b) }, a.options.spinnerRepeat[1]) }, _releaseSpinner: function (a) { clearTimeout(n._timer); n._timer = null }, _endExpand: function (a) { n._timer = null; var b = n._getSpinnerTarget(a); var c = n._getInput(b); var d = $.data(c, n.propertyName); $(b).remove(); d._expanded = false }, _endSpinner: function (a) { n._timer = null; var b = n._getSpinnerTarget(a); var c = n._getInput(b); var d = $.data(c, n.propertyName); if (!n._isDisabledPlugin(c)) { n._changeSpinner(d, b, -1) } if (n._handlingSpinner) { n._lastInput = n._blurredInput } if (n._lastInput && n._handlingSpinner) { n._showField(d) } n._handlingSpinner = false }, _getSpinnerTarget: function (a) { return a.target || a.srcElement }, _getSpinnerRegion: function (a, b) { var c = this._getSpinnerTarget(b); var d = $(c).offset(); var e = [document.documentElement.scrollLeft || document.body.scrollLeft, document.documentElement.scrollTop || document.body.scrollTop]; var f = (a.options.spinnerIncDecOnly ? 99 : b.clientX + e[0] - d.left); var g = b.clientY + e[1] - d.top; var h = a.options[a._expanded ? 'spinnerBigSize' : 'spinnerSize']; var i = (a.options.spinnerIncDecOnly ? 99 : h[0] - 1 - f); var j = h[1] - 1 - g; if (h[2] > 0 && Math.abs(f - i) <= h[2] && Math.abs(g - j) <= h[2]) { return 0 } var k = Math.min(f, g, i, j); return (k == f ? 1 : (k == i ? 2 : (k == g ? 3 : 4))) }, _changeSpinner: function (a, b, c) { $(b).css('background-position', '-' + ((c + 1) * a.options[a._expanded ? 'spinnerBigSize' : 'spinnerSize'][0]) + 'px 0px') }, _parseTime: function (a) { var b = this._extractTime(a); if (b) { a._selectedHour = b[0]; a._selectedMinute = b[1]; a._selectedSecond = b[2] } else { var c = this._constrainTime(a); a._selectedHour = c[0]; a._selectedMinute = c[1]; a._selectedSecond = (a.options.showSeconds ? c[2] : 0) } a._secondField = (a.options.showSeconds ? 2 : -1); a._ampmField = (a.options.show24Hours ? -1 : (a.options.showSeconds ? 3 : 2)); a._lastChr = ''; a._field = Math.max(0, Math.min(Math.max(1, a._secondField, a._ampmField), a.options.initialField)); if (a.input.val() != '') { this._showTime(a) } }, _extractTime: function (a, b) { b = b || a.input.val(); var c = b.split(a.options.separator); if (a.options.separator == '' && b != '') { c[0] = b.substring(0, 2); c[1] = b.substring(2, 4); c[2] = b.substring(4, 6) } if (c.length >= 2) { var d = !a.options.show24Hours && (b.indexOf(a.options.ampmNames[0]) > -1); var e = !a.options.show24Hours && (b.indexOf(a.options.ampmNames[1]) > -1); var f = parseInt(c[0], 10); f = (isNaN(f) ? 0 : f); f = ((d || e) && f == 12 ? 0 : f) + (e ? 12 : 0); var g = parseInt(c[1], 10); g = (isNaN(g) ? 0 : g); var h = (c.length >= 3 ? parseInt(c[2], 10) : 0); h = (isNaN(h) || !a.options.showSeconds ? 0 : h); return this._constrainTime(a, [f, g, h]) } return null }, _constrainTime: function (a, b) { var c = (b != null); if (!c) { var d = this._determineTime(a.options.defaultTime, a) || new Date(); b = [d.getHours(), d.getMinutes(), d.getSeconds()] } var e = false; for (var i = 0; i < a.options.timeSteps.length; i++) { if (e) { b[i] = 0 } else if (a.options.timeSteps[i] > 1) { b[i] = Math.round(b[i] / a.options.timeSteps[i]) * a.options.timeSteps[i]; e = true } } return b }, _showTime: function (a) { var b = (this._formatNumber(a.options.show24Hours ? a._selectedHour : ((a._selectedHour + 11) % 12) + 1) + a.options.separator + this._formatNumber(a._selectedMinute) + (a.options.showSeconds ? a.options.separator + this._formatNumber(a._selectedSecond) : '') + (a.options.show24Hours ? '' : a.options.ampmPrefix + a.options.ampmNames[(a._selectedHour < 12 ? 0 : 1)])); this._setValue(a, b); this._showField(a) }, _showField: function (a) { var b = a.input[0]; if (a.input.is(':hidden') || n._lastInput != b) { return } var c = a.options.separator.length + 2; var d = (a._field != a._ampmField ? (a._field * c) : (a._ampmField * c) - a.options.separator.length + a.options.ampmPrefix.length); var e = d + (a._field != a._ampmField ? 2 : a.options.ampmNames[0].length); if (b.setSelectionRange) { b.setSelectionRange(d, e) } else if (b.createTextRange) { var f = b.createTextRange(); f.moveStart('character', d); f.moveEnd('character', e - a.input.val().length); f.select() } if (!b.disabled) { b.focus() } }, _formatNumber: function (a) { return (a < 10 ? '0' : '') + a }, _setValue: function (a, b) { if (b != a.input.val()) { a.input.val(b).trigger('change') } }, _changeField: function (a, b, c) { var d = (a.input.val() == '' || a._field == (b == -1 ? 0 : Math.max(1, a._secondField, a._ampmField))); if (!d) { a._field += b } this._showField(a); a._lastChr = ''; return (d && c) }, _adjustField: function (a, b) { if (a.input.val() == '') { b = 0 } this._setTime(a, new Date(0, 0, 0, a._selectedHour + (a._field == 0 ? b * a.options.timeSteps[0] : 0) + (a._field == a._ampmField ? b * 12 : 0), a._selectedMinute + (a._field == 1 ? b * a.options.timeSteps[1] : 0), a._selectedSecond + (a._field == a._secondField ? b * a.options.timeSteps[2] : 0))) }, _setTime: function (a, b) { b = this._determineTime(b, a); var c = this._constrainTime(a, b ? [b.getHours(), b.getMinutes(), b.getSeconds()] : null); b = new Date(0, 0, 0, c[0], c[1], c[2]); var b = this._normaliseTime(b); var d = this._normaliseTime(this._determineTime(a.options.minTime, a)); var e = this._normaliseTime(this._determineTime(a.options.maxTime, a)); b = (d && b < d ? d : (e && b > e ? e : b)); if ($.isFunction(a.options.beforeSetTime)) { b = a.options.beforeSetTime.apply(a.input[0], [this._getTimePlugin(a.input[0]), b, d, e]) } a._selectedHour = b.getHours(); a._selectedMinute = b.getMinutes(); a._selectedSecond = b.getSeconds(); this._showTime(a) }, _determineTime: function (i, j) { var k = function (a) { var b = new Date(); b.setTime(b.getTime() + a * 1000); return b }; var l = function (a) { var b = n._extractTime(j, a); var c = new Date(); var d = (b ? b[0] : c.getHours()); var e = (b ? b[1] : c.getMinutes()); var f = (b ? b[2] : c.getSeconds()); if (!b) { var g = /([+-]?[0-9]+)\s*(s|S|m|M|h|H)?/g; var h = g.exec(a); while (h) { switch (h[2] || 's') { case 's': case 'S': f += parseInt(h[1], 10); break; case 'm': case 'M': e += parseInt(h[1], 10); break; case 'h': case 'H': d += parseInt(h[1], 10); break } h = g.exec(a) } } c = new Date(0, 0, 10, d, e, f, 0); if (/^!/.test(a)) { if (c.getDate() > 10) { c = new Date(0, 0, 10, 23, 59, 59) } else if (c.getDate() < 10) { c = new Date(0, 0, 10, 0, 0, 0) } } return c }; return (i ? (typeof i == 'string' ? l(i) : (typeof i == 'number' ? k(i) : i)) : null) }, _normaliseTime: function (a) { if (!a) { return null } a.setFullYear(1900); a.setMonth(0); a.setDate(0); return a }, _handleKeyPress: function (a, b) { if (b == a.options.separator) { this._changeField(a, +1, false) } else if (b >= '0' && b <= '9') { var c = parseInt(b, 10); var d = parseInt(a._lastChr + b, 10); var e = (a._field != 0 ? a._selectedHour : (a.options.show24Hours ? (d < 24 ? d : c) : (d >= 1 && d <= 12 ? d : (c > 0 ? c : a._selectedHour)) % 12 + (a._selectedHour >= 12 ? 12 : 0))); var f = (a._field != 1 ? a._selectedMinute : (d < 60 ? d : c)); var g = (a._field != a._secondField ? a._selectedSecond : (d < 60 ? d : c)); var h = this._constrainTime(a, [e, f, g]); this._setTime(a, new Date(0, 0, 0, h[0], h[1], h[2])); if (a.options.noSeparatorEntry && a._lastChr) { this._changeField(a, +1, false) } else { a._lastChr = b } } else if (!a.options.show24Hours) { b = b.toLowerCase(); if ((b == a.options.ampmNames[0].substring(0, 1).toLowerCase() && a._selectedHour >= 12) || (b == a.options.ampmNames[1].substring(0, 1).toLowerCase() && a._selectedHour < 12)) { var i = a._field; a._field = a._ampmField; this._adjustField(a, +1); a._field = i; this._showField(a) } } } }); var m = ['getOffset', 'getTime', 'isDisabled']; function isNotChained(a, b) { if (a == 'option' && (b.length == 0 || (b.length == 1 && typeof b[0] == 'string'))) { return true } return $.inArray(a, m) > -1 } $.fn.timeEntry = function (b) { var c = Array.prototype.slice.call(arguments, 1); if (isNotChained(b, c)) { return n['_' + b + 'Plugin'].apply(n, [this[0]].concat(c)) } return this.each(function () { if (typeof b == 'string') { if (!n['_' + b + 'Plugin']) { throw 'Unknown command: ' + b; } n['_' + b + 'Plugin'].apply(n, [this].concat(c)) } else { var a = ($.fn.metadata ? $(this).metadata() : {}); n._attachPlugin(this, $.extend({}, a, b || {})) } }) }; var n = $.timeEntry = new TimeEntry() })(jQuery);

/* datepicker */
(function ($) {

    var $window = $(window);

    function UTCDate() {
        return new Date(Date.UTC.apply(Date, arguments));
    }
    function UTCToday() {
        var today = new Date();
        return UTCDate(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
    }


    // Picker object
    var Datepicker = function (element, options) {
        var that = this;

        this._process_options(options);

        this.element = $(element);
        this.isInline = false;
        this.isInput = this.element.is('input');
        this.component = this.element.is('.date') ? this.element.find('.add-on, .btn') : false;
        this.hasInput = this.component && this.element.find('input').length;
        if (this.component && this.component.length === 0)
            this.component = false;

        this.picker = $(DPGlobal.template);
        this._buildEvents();
        this._attachEvents();

        if (this.isInline) {
            this.picker.addClass('datepicker-inline').appendTo(this.element);
        } else {
            this.picker.addClass('datepicker-dropdown dropdown-menu');
        }

        if (this.o.rtl) {
            this.picker.addClass('datepicker-rtl');
            this.picker.find('.prev i, .next i')
						.toggleClass('icon-arrow-left icon-arrow-right');
        }


        this.viewMode = this.o.startView;

        if (this.o.calendarWeeks)
            this.picker.find('tfoot th.today')
						.attr('colspan', function (i, val) {
						    return parseInt(val) + 1;
						});

        this._allow_update = false;

        this.setStartDate(this._o.startDate);
        this.setEndDate(this._o.endDate);
        this.setDaysOfWeekDisabled(this.o.daysOfWeekDisabled);

        this.fillDow();
        this.fillMonths();

        this._allow_update = true;

        this.update();
        this.showMode();

        if (this.isInline) {
            this.show();
        }
    };

    Datepicker.prototype = {
        constructor: Datepicker,

        _process_options: function (opts) {
            // Store raw options for reference
            this._o = $.extend({}, this._o, opts);
            // Processed options
            var o = this.o = $.extend({}, this._o);

            // Check if "de-DE" style date is available, if not language should
            // fallback to 2 letter code eg "de"
            var lang = o.language;
            if (!dates[lang]) {
                lang = lang.split('-')[0];
                if (!dates[lang])
                    lang = defaults.language;
            }
            o.language = lang;

            switch (o.startView) {
                case 2:
                case 'decade':
                    o.startView = 2;
                    break;
                case 1:
                case 'year':
                    o.startView = 1;
                    break;
                default:
                    o.startView = 0;
            }

            switch (o.minViewMode) {
                case 1:
                case 'months':
                    o.minViewMode = 1;
                    break;
                case 2:
                case 'years':
                    o.minViewMode = 2;
                    break;
                default:
                    o.minViewMode = 0;
            }

            o.startView = Math.max(o.startView, o.minViewMode);

            o.weekStart %= 7;
            o.weekEnd = ((o.weekStart + 6) % 7);

            var format = DPGlobal.parseFormat(o.format);
            if (o.startDate !== -Infinity) {
                if (!!o.startDate) {
                    if (o.startDate instanceof Date)
                        o.startDate = this._local_to_utc(this._zero_time(o.startDate));
                    else
                        o.startDate = DPGlobal.parseDate(o.startDate, format, o.language);
                } else {
                    o.startDate = -Infinity;
                }
            }
            if (o.endDate !== Infinity) {
                if (!!o.endDate) {
                    if (o.endDate instanceof Date)
                        o.endDate = this._local_to_utc(this._zero_time(o.endDate));
                    else
                        o.endDate = DPGlobal.parseDate(o.endDate, format, o.language);
                } else {
                    o.endDate = Infinity;
                }
            }

            o.daysOfWeekDisabled = o.daysOfWeekDisabled || [];
            if (!$.isArray(o.daysOfWeekDisabled))
                o.daysOfWeekDisabled = o.daysOfWeekDisabled.split(/[,\s]*/);
            o.daysOfWeekDisabled = $.map(o.daysOfWeekDisabled, function (d) {
                return parseInt(d, 10);
            });

            var plc = String(o.orientation).toLowerCase().split(/\s+/g),
				_plc = o.orientation.toLowerCase();
            plc = $.grep(plc, function (word) {
                return (/^auto|left|right|top|bottom$/).test(word);
            });
            o.orientation = { x: 'auto', y: 'auto' };
            if (!_plc || _plc === 'auto')
                ; // no action
            else if (plc.length === 1) {
                switch (plc[0]) {
                    case 'top':
                    case 'bottom':
                        o.orientation.y = plc[0];
                        break;
                    case 'left':
                    case 'right':
                        o.orientation.x = plc[0];
                        break;
                }
            }
            else {
                _plc = $.grep(plc, function (word) {
                    return (/^left|right$/).test(word);
                });
                o.orientation.x = _plc[0] || 'auto';

                _plc = $.grep(plc, function (word) {
                    return (/^top|bottom$/).test(word);
                });
                o.orientation.y = _plc[0] || 'auto';
            }
        },
        _events: [],
        _secondaryEvents: [],
        _applyEvents: function (evs) {
            for (var i = 0, el, ev; i < evs.length; i++) {
                el = evs[i][0];
                ev = evs[i][1];
                el.on(ev);
            }
        },
        _unapplyEvents: function (evs) {
            for (var i = 0, el, ev; i < evs.length; i++) {
                el = evs[i][0];
                ev = evs[i][1];
                el.off(ev);
            }
        },
        _buildEvents: function () {
            if (this.isInput) { // single input
                this._events = [
					[this.element, {
					    focus: $.proxy(this.show, this),
					    keyup: $.proxy(this.update, this),
					    keydown: $.proxy(this.keydown, this)
					}]
                ];
            }
            else if (this.component && this.hasInput) { // component: input + button
                this._events = [
					// For components that are not readonly, allow keyboard nav
					[this.element.find('input'), {
					    focus: $.proxy(this.show, this),
					    keyup: $.proxy(this.update, this),
					    keydown: $.proxy(this.keydown, this)
					}],
					[this.component, {
					    click: $.proxy(this.show, this)
					}]
                ];
            }
            else if (this.element.is('div')) {  // inline datepicker
                this.isInline = true;
            }
            else {
                this._events = [
					[this.element, {
					    click: $.proxy(this.show, this)
					}]
                ];
            }

            this._secondaryEvents = [
				[this.picker, {
				    click: $.proxy(this.click, this)
				}],
				[$(window), {
				    resize: $.proxy(this.place, this)
				}],
				[$(document), {
				    mousedown: $.proxy(function (e) {
				        // Clicked outside the datepicker, hide it
				        if (!(
							this.element.is(e.target) ||
							this.element.find(e.target).length ||
							this.picker.is(e.target) ||
							this.picker.find(e.target).length
						)) {
				            this.hide();
				        }
				    }, this)
				}]
            ];
        },
        _attachEvents: function () {
            this._detachEvents();
            this._applyEvents(this._events);
        },
        _detachEvents: function () {
            this._unapplyEvents(this._events);
        },
        _attachSecondaryEvents: function () {
            this._detachSecondaryEvents();
            this._applyEvents(this._secondaryEvents);
        },
        _detachSecondaryEvents: function () {
            this._unapplyEvents(this._secondaryEvents);
        },
        _trigger: function (event, altdate) {
            var date = altdate || this.date,
				local_date = this._utc_to_local(date);

            this.element.trigger({
                type: event,
                date: local_date,
                format: $.proxy(function (altformat) {
                    var format = altformat || this.o.format;
                    return DPGlobal.formatDate(date, format, this.o.language);
                }, this)
            });
        },

        show: function (e) {
            if (!this.isInline)
                this.picker.appendTo('body');
            this.picker.show();
            this.height = this.component ? this.component.outerHeight() : this.element.outerHeight();
            this.place();
            this._attachSecondaryEvents();
            if (e) {
                e.preventDefault();
            }
            this._trigger('show');
        },

        hide: function (e) {
            if (this.isInline) return;
            if (!this.picker.is(':visible')) return;
            this.picker.hide().detach();
            this._detachSecondaryEvents();
            this.viewMode = this.o.startView;
            this.showMode();

            if (
				this.o.forceParse &&
				(
					this.isInput && this.element.val() ||
					this.hasInput && this.element.find('input').val()
				)
			)
                this.setValue();
            this._trigger('hide');
        },

        remove: function () {
            this.hide();
            this._detachEvents();
            this._detachSecondaryEvents();
            this.picker.remove();
            delete this.element.data().datepicker;
            if (!this.isInput) {
                delete this.element.data().date;
            }
        },

        _utc_to_local: function (utc) {
            return new Date(utc.getTime() + (utc.getTimezoneOffset() * 60000));
        },
        _local_to_utc: function (local) {
            return new Date(local.getTime() - (local.getTimezoneOffset() * 60000));
        },
        _zero_time: function (local) {
            return new Date(local.getFullYear(), local.getMonth(), local.getDate());
        },
        _zero_utc_time: function (utc) {
            return new Date(Date.UTC(utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate()));
        },

        getDate: function () {
            return this._utc_to_local(this.getUTCDate());
        },

        getUTCDate: function () {
            return this.date;
        },

        setDate: function (d) {
            this.setUTCDate(this._local_to_utc(d));
        },

        setUTCDate: function (d) {
            this.date = d;
            this.setValue();
        },

        setValue: function () {
            var formatted = this.getFormattedDate();
            if (!this.isInput) {
                if (this.component) {
                    this.element.find('input').val(formatted).change();
                }
            } else {
                this.element.val(formatted).change();
            }
        },

        getFormattedDate: function (format) {
            if (format === undefined)
                format = this.o.format;
            return DPGlobal.formatDate(this.date, format, this.o.language);
        },

        setStartDate: function (startDate) {
            this._process_options({ startDate: startDate });
            this.update();
            this.updateNavArrows();
        },

        setEndDate: function (endDate) {
            this._process_options({ endDate: endDate });
            this.update();
            this.updateNavArrows();
        },

        setDaysOfWeekDisabled: function (daysOfWeekDisabled) {
            this._process_options({ daysOfWeekDisabled: daysOfWeekDisabled });
            this.update();
            this.updateNavArrows();
        },

        place: function () {
            if (this.isInline) return;
            var calendarWidth = this.picker.outerWidth(),
				calendarHeight = this.picker.outerHeight(),
				visualPadding = 10,
				windowWidth = $window.width(),
				windowHeight = $window.height(),
				scrollTop = $window.scrollTop();

            var zIndex = parseInt(this.element.parents().filter(function () {
                return $(this).css('z-index') != 'auto';
            }).first().css('z-index')) + 10;
            var offset = this.component ? this.component.parent().offset() : this.element.offset();
            var height = this.component ? this.component.outerHeight(true) : this.element.outerHeight(false);
            var width = this.component ? this.component.outerWidth(true) : this.element.outerWidth(false);
            var left = offset.left,
				top = offset.top;

            this.picker.removeClass(
				'datepicker-orient-top datepicker-orient-bottom ' +
				'datepicker-orient-right datepicker-orient-left'
			);

            if (this.o.orientation.x !== 'auto') {
                this.picker.addClass('datepicker-orient-' + this.o.orientation.x);
                if (this.o.orientation.x === 'right')
                    left -= calendarWidth - width;
            }
                // auto x orientation is best-placement: if it crosses a window
                // edge, fudge it sideways
            else {
                // Default to left
                this.picker.addClass('datepicker-orient-left');
                if (offset.left < 0)
                    left -= offset.left - visualPadding;
                else if (offset.left + calendarWidth > windowWidth)
                    left = windowWidth - calendarWidth - visualPadding;
            }

            // auto y orientation is best-situation: top or bottom, no fudging,
            // decision based on which shows more of the calendar
            var yorient = this.o.orientation.y,
				top_overflow, bottom_overflow;
            if (yorient === 'auto') {
                top_overflow = -scrollTop + offset.top - calendarHeight;
                bottom_overflow = scrollTop + windowHeight - (offset.top + height + calendarHeight);
                if (Math.max(top_overflow, bottom_overflow) === bottom_overflow)
                    yorient = 'top';
                else
                    yorient = 'bottom';
            }
            this.picker.addClass('datepicker-orient-' + yorient);
            if (yorient === 'top')
                top += height;
            else
                top -= calendarHeight + parseInt(this.picker.css('padding-top'));

            this.picker.css({
                top: top,
                left: left,
                zIndex: zIndex
            });
        },

        _allow_update: true,
        update: function () {
            if (!this._allow_update) return;

            var oldDate = new Date(this.date),
				date, fromArgs = false;
            if (arguments && arguments.length && (typeof arguments[0] === 'string' || arguments[0] instanceof Date)) {
                date = arguments[0];
                if (date instanceof Date)
                    date = this._local_to_utc(date);
                fromArgs = true;
            } else {
                date = this.isInput ? this.element.val() : this.element.data('date') || this.element.find('input').val();
                delete this.element.data().date;
            }

            this.date = DPGlobal.parseDate(date, this.o.format, this.o.language);

            if (fromArgs) {
                // setting date by clicking
                this.setValue();
            } else if (date) {
                // setting date by typing
                if (oldDate.getTime() !== this.date.getTime())
                    this._trigger('changeDate');
            } else {
                // clearing date
                this._trigger('clearDate');
            }

            if (this.date < this.o.startDate) {
                this.viewDate = new Date(this.o.startDate);
                this.date = new Date(this.o.startDate);
            } else if (this.date > this.o.endDate) {
                this.viewDate = new Date(this.o.endDate);
                this.date = new Date(this.o.endDate);
            } else {
                this.viewDate = new Date(this.date);
                this.date = new Date(this.date);
            }
            this.fill();
        },

        fillDow: function () {
            var dowCnt = this.o.weekStart,
			html = '<tr>';
            if (this.o.calendarWeeks) {
                var cell = '<th class="cw">&nbsp;</th>';
                html += cell;
                this.picker.find('.datepicker-days thead tr:first-child').prepend(cell);
            }
            while (dowCnt < this.o.weekStart + 7) {
                html += '<th class="dow">' + dates[this.o.language].daysMin[(dowCnt++) % 7] + '</th>';
            }
            html += '</tr>';
            this.picker.find('.datepicker-days thead').append(html);
        },

        fillMonths: function () {
            var html = '',
			i = 0;
            while (i < 12) {
                html += '<span class="month">' + dates[this.o.language].monthsShort[i++] + '</span>';
            }
            this.picker.find('.datepicker-months td').html(html);
        },

        setRange: function (range) {
            if (!range || !range.length)
                delete this.range;
            else
                this.range = $.map(range, function (d) { return d.valueOf(); });
            this.fill();
        },

        getClassNames: function (date) {
            var cls = [],
				year = this.viewDate.getUTCFullYear(),
				month = this.viewDate.getUTCMonth(),
				currentDate = this.date.valueOf(),
				today = new Date();
            if (date.getUTCFullYear() < year || (date.getUTCFullYear() == year && date.getUTCMonth() < month)) {
                cls.push('old');
            } else if (date.getUTCFullYear() > year || (date.getUTCFullYear() == year && date.getUTCMonth() > month)) {
                cls.push('new');
            }
            // Compare internal UTC date with local today, not UTC today
            if (this.o.todayHighlight &&
				date.getUTCFullYear() == today.getFullYear() &&
				date.getUTCMonth() == today.getMonth() &&
				date.getUTCDate() == today.getDate()) {
                cls.push('today');
            }
            if (currentDate && date.valueOf() == currentDate) {
                cls.push('active');
            }
            if (date.valueOf() < this.o.startDate || date.valueOf() > this.o.endDate ||
				$.inArray(date.getUTCDay(), this.o.daysOfWeekDisabled) !== -1) {
                cls.push('disabled');
            }
            if (this.range) {
                if (date > this.range[0] && date < this.range[this.range.length - 1]) {
                    cls.push('range');
                }
                if ($.inArray(date.valueOf(), this.range) != -1) {
                    cls.push('selected');
                }
            }
            return cls;
        },

        fill: function () {
            var d = new Date(this.viewDate),
				year = d.getUTCFullYear(),
				month = d.getUTCMonth(),
				startYear = this.o.startDate !== -Infinity ? this.o.startDate.getUTCFullYear() : -Infinity,
				startMonth = this.o.startDate !== -Infinity ? this.o.startDate.getUTCMonth() : -Infinity,
				endYear = this.o.endDate !== Infinity ? this.o.endDate.getUTCFullYear() : Infinity,
				endMonth = this.o.endDate !== Infinity ? this.o.endDate.getUTCMonth() : Infinity,
				currentDate = this.date && this.date.valueOf(),
				tooltip;
            this.picker.find('.datepicker-days thead th.datepicker-switch')
						.text(dates[this.o.language].months[month] + ' ' + year);
            this.picker.find('tfoot th.today')
						.text(dates[this.o.language].today)
						.toggle(this.o.todayBtn !== false);
            this.picker.find('tfoot th.clear')
						.text(dates[this.o.language].clear)
						.toggle(this.o.clearBtn !== false);
            this.updateNavArrows();
            this.fillMonths();
            var prevMonth = UTCDate(year, month - 1, 28, 0, 0, 0, 0),
				day = DPGlobal.getDaysInMonth(prevMonth.getUTCFullYear(), prevMonth.getUTCMonth());
            prevMonth.setUTCDate(day);
            prevMonth.setUTCDate(day - (prevMonth.getUTCDay() - this.o.weekStart + 7) % 7);
            var nextMonth = new Date(prevMonth);
            nextMonth.setUTCDate(nextMonth.getUTCDate() + 42);
            nextMonth = nextMonth.valueOf();
            var html = [];
            var clsName;
            while (prevMonth.valueOf() < nextMonth) {
                if (prevMonth.getUTCDay() == this.o.weekStart) {
                    html.push('<tr>');
                    if (this.o.calendarWeeks) {
                        // ISO 8601: First week contains first thursday.
                        // ISO also states week starts on Monday, but we can be more abstract here.
                        var
							// Start of current week: based on weekstart/current date
							ws = new Date(+prevMonth + (this.o.weekStart - prevMonth.getUTCDay() - 7) % 7 * 864e5),
							// Thursday of this week
							th = new Date(+ws + (7 + 4 - ws.getUTCDay()) % 7 * 864e5),
							// First Thursday of year, year from thursday
							yth = new Date(+(yth = UTCDate(th.getUTCFullYear(), 0, 1)) + (7 + 4 - yth.getUTCDay()) % 7 * 864e5),
							// Calendar week: ms between thursdays, div ms per day, div 7 days
							calWeek = (th - yth) / 864e5 / 7 + 1;
                        html.push('<td class="cw">' + calWeek + '</td>');

                    }
                }
                clsName = this.getClassNames(prevMonth);
                clsName.push('day');

                if (this.o.beforeShowDay !== $.noop) {
                    var before = this.o.beforeShowDay(this._utc_to_local(prevMonth));
                    if (before === undefined)
                        before = {};
                    else if (typeof (before) === 'boolean')
                        before = { enabled: before };
                    else if (typeof (before) === 'string')
                        before = { classes: before };
                    if (before.enabled === false)
                        clsName.push('disabled');
                    if (before.classes)
                        clsName = clsName.concat(before.classes.split(/\s+/));
                    if (before.tooltip)
                        tooltip = before.tooltip;
                }

                clsName = $.unique(clsName);
                html.push('<td class="' + clsName.join(' ') + '"' + (tooltip ? ' title="' + tooltip + '"' : '') + '>' + prevMonth.getUTCDate() + '</td>');
                if (prevMonth.getUTCDay() == this.o.weekEnd) {
                    html.push('</tr>');
                }
                prevMonth.setUTCDate(prevMonth.getUTCDate() + 1);
            }
            this.picker.find('.datepicker-days tbody').empty().append(html.join(''));
            var currentYear = this.date && this.date.getUTCFullYear();

            var months = this.picker.find('.datepicker-months')
						.find('th:eq(1)')
							.text(year)
							.end()
						.find('span').removeClass('active');
            if (currentYear && currentYear == year) {
                months.eq(this.date.getUTCMonth()).addClass('active');
            }
            if (year < startYear || year > endYear) {
                months.addClass('disabled');
            }
            if (year == startYear) {
                months.slice(0, startMonth).addClass('disabled');
            }
            if (year == endYear) {
                months.slice(endMonth + 1).addClass('disabled');
            }

            html = '';
            year = parseInt(year / 10, 10) * 10;
            var yearCont = this.picker.find('.datepicker-years')
								.find('th:eq(1)')
									.text(year + '-' + (year + 9))
									.end()
								.find('td');
            year -= 1;
            for (var i = -1; i < 11; i++) {
                html += '<span class="year' + (i == -1 ? ' old' : i == 10 ? ' new' : '') + (currentYear == year ? ' active' : '') + (year < startYear || year > endYear ? ' disabled' : '') + '">' + year + '</span>';
                year += 1;
            }
            yearCont.html(html);
        },

        updateNavArrows: function () {
            if (!this._allow_update) return;

            var d = new Date(this.viewDate),
				year = d.getUTCFullYear(),
				month = d.getUTCMonth();
            switch (this.viewMode) {
                case 0:
                    if (this.o.startDate !== -Infinity && year <= this.o.startDate.getUTCFullYear() && month <= this.o.startDate.getUTCMonth()) {
                        this.picker.find('.prev').css({ visibility: 'hidden' });
                    } else {
                        this.picker.find('.prev').css({ visibility: 'visible' });
                    }
                    if (this.o.endDate !== Infinity && year >= this.o.endDate.getUTCFullYear() && month >= this.o.endDate.getUTCMonth()) {
                        this.picker.find('.next').css({ visibility: 'hidden' });
                    } else {
                        this.picker.find('.next').css({ visibility: 'visible' });
                    }
                    break;
                case 1:
                case 2:
                    if (this.o.startDate !== -Infinity && year <= this.o.startDate.getUTCFullYear()) {
                        this.picker.find('.prev').css({ visibility: 'hidden' });
                    } else {
                        this.picker.find('.prev').css({ visibility: 'visible' });
                    }
                    if (this.o.endDate !== Infinity && year >= this.o.endDate.getUTCFullYear()) {
                        this.picker.find('.next').css({ visibility: 'hidden' });
                    } else {
                        this.picker.find('.next').css({ visibility: 'visible' });
                    }
                    break;
            }
        },

        click: function (e) {
            e.preventDefault();
            var target = $(e.target).closest('span, td, th');
            if (target.length == 1) {
                switch (target[0].nodeName.toLowerCase()) {
                    case 'th':
                        switch (target[0].className) {
                            case 'datepicker-switch':
                                this.showMode(1);
                                break;
                            case 'prev':
                            case 'next':
                                var dir = DPGlobal.modes[this.viewMode].navStep * (target[0].className == 'prev' ? -1 : 1);
                                switch (this.viewMode) {
                                    case 0:
                                        this.viewDate = this.moveMonth(this.viewDate, dir);
                                        this._trigger('changeMonth', this.viewDate);
                                        break;
                                    case 1:
                                    case 2:
                                        this.viewDate = this.moveYear(this.viewDate, dir);
                                        if (this.viewMode === 1)
                                            this._trigger('changeYear', this.viewDate);
                                        break;
                                }
                                this.fill();
                                break;
                            case 'today':
                                var date = new Date();
                                date = UTCDate(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);

                                this.showMode(-2);
                                var which = this.o.todayBtn == 'linked' ? null : 'view';
                                this._setDate(date, which);
                                break;
                            case 'clear':
                                var element;
                                if (this.isInput)
                                    element = this.element;
                                else if (this.component)
                                    element = this.element.find('input');
                                if (element)
                                    element.val("").change();
                                this._trigger('changeDate');
                                this.update();
                                if (this.o.autoclose)
                                    this.hide();
                                break;
                        }
                        break;
                    case 'span':
                        if (!target.is('.disabled')) {
                            this.viewDate.setUTCDate(1);
                            if (target.is('.month')) {
                                var day = 1;
                                var month = target.parent().find('span').index(target);
                                var year = this.viewDate.getUTCFullYear();
                                this.viewDate.setUTCMonth(month);
                                this._trigger('changeMonth', this.viewDate);
                                if (this.o.minViewMode === 1) {
                                    this._setDate(UTCDate(year, month, day, 0, 0, 0, 0));
                                }
                            } else {
                                var year = parseInt(target.text(), 10) || 0;
                                var day = 1;
                                var month = 0;
                                this.viewDate.setUTCFullYear(year);
                                this._trigger('changeYear', this.viewDate);
                                if (this.o.minViewMode === 2) {
                                    this._setDate(UTCDate(year, month, day, 0, 0, 0, 0));
                                }
                            }
                            this.showMode(-1);
                            this.fill();
                        }
                        break;
                    case 'td':
                        if (target.is('.day') && !target.is('.disabled')) {
                            var day = parseInt(target.text(), 10) || 1;
                            var year = this.viewDate.getUTCFullYear(),
								month = this.viewDate.getUTCMonth();
                            if (target.is('.old')) {
                                if (month === 0) {
                                    month = 11;
                                    year -= 1;
                                } else {
                                    month -= 1;
                                }
                            } else if (target.is('.new')) {
                                if (month == 11) {
                                    month = 0;
                                    year += 1;
                                } else {
                                    month += 1;
                                }
                            }
                            this._setDate(UTCDate(year, month, day, 0, 0, 0, 0));
                        }
                        break;
                }
            }
        },

        _setDate: function (date, which) {
            if (!which || which == 'date')
                this.date = new Date(date);
            if (!which || which == 'view')
                this.viewDate = new Date(date);
            this.fill();
            this.setValue();
            this._trigger('changeDate');
            var element;
            if (this.isInput) {
                element = this.element;
            } else if (this.component) {
                element = this.element.find('input');
            }
            if (element) {
                element.change();
            }
            if (this.o.autoclose && (!which || which == 'date')) {
                this.hide();
            }
        },

        moveMonth: function (date, dir) {
            if (!dir) return date;
            var new_date = new Date(date.valueOf()),
				day = new_date.getUTCDate(),
				month = new_date.getUTCMonth(),
				mag = Math.abs(dir),
				new_month, test;
            dir = dir > 0 ? 1 : -1;
            if (mag == 1) {
                test = dir == -1
					// If going back one month, make sure month is not current month
					// (eg, Mar 31 -> Feb 31 == Feb 28, not Mar 02)
					? function () { return new_date.getUTCMonth() == month; }
					// If going forward one month, make sure month is as expected
					// (eg, Jan 31 -> Feb 31 == Feb 28, not Mar 02)
					: function () { return new_date.getUTCMonth() != new_month; };
                new_month = month + dir;
                new_date.setUTCMonth(new_month);
                // Dec -> Jan (12) or Jan -> Dec (-1) -- limit expected date to 0-11
                if (new_month < 0 || new_month > 11)
                    new_month = (new_month + 12) % 12;
            } else {
                // For magnitudes >1, move one month at a time...
                for (var i = 0; i < mag; i++)
                    // ...which might decrease the day (eg, Jan 31 to Feb 28, etc)...
                    new_date = this.moveMonth(new_date, dir);
                // ...then reset the day, keeping it in the new month
                new_month = new_date.getUTCMonth();
                new_date.setUTCDate(day);
                test = function () { return new_month != new_date.getUTCMonth(); };
            }
            // Common date-resetting loop -- if date is beyond end of month, make it
            // end of month
            while (test()) {
                new_date.setUTCDate(--day);
                new_date.setUTCMonth(new_month);
            }
            return new_date;
        },

        moveYear: function (date, dir) {
            return this.moveMonth(date, dir * 12);
        },

        dateWithinRange: function (date) {
            return date >= this.o.startDate && date <= this.o.endDate;
        },

        keydown: function (e) {
            if (this.picker.is(':not(:visible)')) {
                if (e.keyCode == 27) // allow escape to hide and re-show picker
                    this.show();
                return;
            }
            var dateChanged = false,
				dir, day, month,
				newDate, newViewDate;
            switch (e.keyCode) {
                case 27: // escape
                    this.hide();
                    e.preventDefault();
                    break;
                case 37: // left
                case 39: // right
                    if (!this.o.keyboardNavigation) break;
                    dir = e.keyCode == 37 ? -1 : 1;
                    if (e.ctrlKey) {
                        newDate = this.moveYear(this.date, dir);
                        newViewDate = this.moveYear(this.viewDate, dir);
                        this._trigger('changeYear', this.viewDate);
                    } else if (e.shiftKey) {
                        newDate = this.moveMonth(this.date, dir);
                        newViewDate = this.moveMonth(this.viewDate, dir);
                        this._trigger('changeMonth', this.viewDate);
                    } else {
                        newDate = new Date(this.date);
                        newDate.setUTCDate(this.date.getUTCDate() + dir);
                        newViewDate = new Date(this.viewDate);
                        newViewDate.setUTCDate(this.viewDate.getUTCDate() + dir);
                    }
                    if (this.dateWithinRange(newDate)) {
                        this.date = newDate;
                        this.viewDate = newViewDate;
                        this.setValue();
                        this.update();
                        e.preventDefault();
                        dateChanged = true;
                    }
                    break;
                case 38: // up
                case 40: // down
                    if (!this.o.keyboardNavigation) break;
                    dir = e.keyCode == 38 ? -1 : 1;
                    if (e.ctrlKey) {
                        newDate = this.moveYear(this.date, dir);
                        newViewDate = this.moveYear(this.viewDate, dir);
                        this._trigger('changeYear', this.viewDate);
                    } else if (e.shiftKey) {
                        newDate = this.moveMonth(this.date, dir);
                        newViewDate = this.moveMonth(this.viewDate, dir);
                        this._trigger('changeMonth', this.viewDate);
                    } else {
                        newDate = new Date(this.date);
                        newDate.setUTCDate(this.date.getUTCDate() + dir * 7);
                        newViewDate = new Date(this.viewDate);
                        newViewDate.setUTCDate(this.viewDate.getUTCDate() + dir * 7);
                    }
                    if (this.dateWithinRange(newDate)) {
                        this.date = newDate;
                        this.viewDate = newViewDate;
                        this.setValue();
                        this.update();
                        e.preventDefault();
                        dateChanged = true;
                    }
                    break;
                case 13: // enter
                    this.hide();
                    e.preventDefault();
                    break;
                case 9: // tab
                    this.hide();
                    break;
            }
            if (dateChanged) {
                this._trigger('changeDate');
                var element;
                if (this.isInput) {
                    element = this.element;
                } else if (this.component) {
                    element = this.element.find('input');
                }
                if (element) {
                    element.change();
                }
            }
        },

        showMode: function (dir) {
            if (dir) {
                this.viewMode = Math.max(this.o.minViewMode, Math.min(2, this.viewMode + dir));
            }
            /*
				vitalets: fixing bug of very special conditions:
				jquery 1.7.1 + webkit + show inline datepicker in bootstrap popover.
				Method show() does not set display css correctly and datepicker is not shown.
				Changed to .css('display', 'block') solve the problem.
				See https://github.com/vitalets/x-editable/issues/37

				In jquery 1.7.2+ everything works fine.
			*/
            //this.picker.find('>div').hide().filter('.datepicker-'+DPGlobal.modes[this.viewMode].clsName).show();
            this.picker.find('>div').hide().filter('.datepicker-' + DPGlobal.modes[this.viewMode].clsName).css('display', 'block');
            this.updateNavArrows();
        }
    };

    var DateRangePicker = function (element, options) {
        this.element = $(element);
        this.inputs = $.map(options.inputs, function (i) { return i.jquery ? i[0] : i; });
        delete options.inputs;

        $(this.inputs)
			.datepicker(options)
			.bind('changeDate', $.proxy(this.dateUpdated, this));

        this.pickers = $.map(this.inputs, function (i) { return $(i).data('datepicker'); });
        this.updateDates();
    };
    DateRangePicker.prototype = {
        updateDates: function () {
            this.dates = $.map(this.pickers, function (i) { return i.date; });
            this.updateRanges();
        },
        updateRanges: function () {
            var range = $.map(this.dates, function (d) { return d.valueOf(); });
            $.each(this.pickers, function (i, p) {
                p.setRange(range);
            });
        },
        dateUpdated: function (e) {
            var dp = $(e.target).data('datepicker'),
				new_date = dp.getUTCDate(),
				i = $.inArray(e.target, this.inputs),
				l = this.inputs.length;
            if (i == -1) return;

            if (new_date < this.dates[i]) {
                // Date being moved earlier/left
                while (i >= 0 && new_date < this.dates[i]) {
                    this.pickers[i--].setUTCDate(new_date);
                }
            }
            else if (new_date > this.dates[i]) {
                // Date being moved later/right
                while (i < l && new_date > this.dates[i]) {
                    this.pickers[i++].setUTCDate(new_date);
                }
            }
            this.updateDates();
        },
        remove: function () {
            $.map(this.pickers, function (p) { p.remove(); });
            delete this.element.data().datepicker;
        }
    };

    function opts_from_el(el, prefix) {
        // Derive options from element data-attrs
        var data = $(el).data(),
			out = {}, inkey,
			replace = new RegExp('^' + prefix.toLowerCase() + '([A-Z])'),
			prefix = new RegExp('^' + prefix.toLowerCase());
        for (var key in data)
            if (prefix.test(key)) {
                inkey = key.replace(replace, function (_, a) { return a.toLowerCase(); });
                out[inkey] = data[key];
            }
        return out;
    }

    function opts_from_locale(lang) {
        // Derive options from locale plugins
        var out = {};
        // Check if "de-DE" style date is available, if not language should
        // fallback to 2 letter code eg "de"
        if (!dates[lang]) {
            lang = lang.split('-')[0]
            if (!dates[lang])
                return;
        }
        var d = dates[lang];
        $.each(locale_opts, function (i, k) {
            if (k in d)
                out[k] = d[k];
        });
        return out;
    }

    var old = $.fn.datepicker;
    $.fn.datepicker = function (option) {
        var args = Array.apply(null, arguments);
        args.shift();
        var internal_return,
			this_return;
        this.each(function () {
            var $this = $(this),
				data = $this.data('datepicker'),
				options = typeof option == 'object' && option;
            if (!data) {
                var elopts = opts_from_el(this, 'date'),
					// Preliminary otions
					xopts = $.extend({}, defaults, elopts, options),
					locopts = opts_from_locale(xopts.language),
					// Options priority: js args, data-attrs, locales, defaults
					opts = $.extend({}, defaults, locopts, elopts, options);
                if ($this.is('.input-daterange') || opts.inputs) {
                    var ropts = {
                        inputs: opts.inputs || $this.find('input').toArray()
                    };
                    $this.data('datepicker', (data = new DateRangePicker(this, $.extend(opts, ropts))));
                }
                else {
                    $this.data('datepicker', (data = new Datepicker(this, opts)));
                }
            }
            if (typeof option == 'string' && typeof data[option] == 'function') {
                internal_return = data[option].apply(data, args);
                if (internal_return !== undefined)
                    return false;
            }
        });
        if (internal_return !== undefined)
            return internal_return;
        else
            return this;
    };

    var defaults = $.fn.datepicker.defaults = {
        autoclose: false,
        beforeShowDay: $.noop,
        calendarWeeks: false,
        clearBtn: false,
        daysOfWeekDisabled: [],
        endDate: Infinity,
        forceParse: true,
        format: 'mm/dd/yyyy',
        keyboardNavigation: true,
        language: 'en',
        minViewMode: 0,
        orientation: "auto",
        rtl: false,
        startDate: -Infinity,
        startView: 0,
        todayBtn: false,
        todayHighlight: false,
        weekStart: 0
    };
    var locale_opts = $.fn.datepicker.locale_opts = [
		'format',
		'rtl',
		'weekStart'
    ];
    $.fn.datepicker.Constructor = Datepicker;
    var dates = $.fn.datepicker.dates = {
        en: {
            days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            today: "Today",
            clear: "Clear"
        }
    };

    var DPGlobal = {
        modes: [
			{
			    clsName: 'days',
			    navFnc: 'Month',
			    navStep: 1
			},
			{
			    clsName: 'months',
			    navFnc: 'FullYear',
			    navStep: 1
			},
			{
			    clsName: 'years',
			    navFnc: 'FullYear',
			    navStep: 10
			}],
        isLeapYear: function (year) {
            return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
        },
        getDaysInMonth: function (year, month) {
            return [31, (DPGlobal.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
        },
        validParts: /dd?|DD?|mm?|MM?|yy(?:yy)?/g,
        nonpunctuation: /[^ -\/:-@\[\u3400-\u9fff-`{-~\t\n\r]+/g,
        parseFormat: function (format) {
            // IE treats \0 as a string end in inputs (truncating the value),
            // so it's a bad format delimiter, anyway
            var separators = format.replace(this.validParts, '\0').split('\0'),
				parts = format.match(this.validParts);
            if (!separators || !separators.length || !parts || parts.length === 0) {
                throw new Error("Invalid date format.");
            }
            return { separators: separators, parts: parts };
        },
        parseDate: function (date, format, language) {
            if (date instanceof Date) return date;
            if (typeof format === 'string')
                format = DPGlobal.parseFormat(format);
            if (/^[\-+]\d+[dmwy]([\s,]+[\-+]\d+[dmwy])*$/.test(date)) {
                var part_re = /([\-+]\d+)([dmwy])/,
					parts = date.match(/([\-+]\d+)([dmwy])/g),
					part, dir;
                date = new Date();
                for (var i = 0; i < parts.length; i++) {
                    part = part_re.exec(parts[i]);
                    dir = parseInt(part[1]);
                    switch (part[2]) {
                        case 'd':
                            date.setUTCDate(date.getUTCDate() + dir);
                            break;
                        case 'm':
                            date = Datepicker.prototype.moveMonth.call(Datepicker.prototype, date, dir);
                            break;
                        case 'w':
                            date.setUTCDate(date.getUTCDate() + dir * 7);
                            break;
                        case 'y':
                            date = Datepicker.prototype.moveYear.call(Datepicker.prototype, date, dir);
                            break;
                    }
                }
                return UTCDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0);
            }
            var parts = date && date.match(this.nonpunctuation) || [],
				date = new Date(),
				parsed = {},
				setters_order = ['yyyy', 'yy', 'M', 'MM', 'm', 'mm', 'd', 'dd'],
				setters_map = {
				    yyyy: function (d, v) { return d.setUTCFullYear(v); },
				    yy: function (d, v) { return d.setUTCFullYear(2000 + v); },
				    m: function (d, v) {
				        if (isNaN(d))
				            return d;
				        v -= 1;
				        while (v < 0) v += 12;
				        v %= 12;
				        d.setUTCMonth(v);
				        while (d.getUTCMonth() != v)
				            d.setUTCDate(d.getUTCDate() - 1);
				        return d;
				    },
				    d: function (d, v) { return d.setUTCDate(v); }
				},
				val, filtered, part;
            setters_map['M'] = setters_map['MM'] = setters_map['mm'] = setters_map['m'];
            setters_map['dd'] = setters_map['d'];
            date = UTCDate(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
            var fparts = format.parts.slice();
            // Remove noop parts
            if (parts.length != fparts.length) {
                fparts = $(fparts).filter(function (i, p) {
                    return $.inArray(p, setters_order) !== -1;
                }).toArray();
            }
            // Process remainder
            if (parts.length == fparts.length) {
                for (var i = 0, cnt = fparts.length; i < cnt; i++) {
                    val = parseInt(parts[i], 10);
                    part = fparts[i];
                    if (isNaN(val)) {
                        switch (part) {
                            case 'MM':
                                filtered = $(dates[language].months).filter(function () {
                                    var m = this.slice(0, parts[i].length),
										p = parts[i].slice(0, m.length);
                                    return m == p;
                                });
                                val = $.inArray(filtered[0], dates[language].months) + 1;
                                break;
                            case 'M':
                                filtered = $(dates[language].monthsShort).filter(function () {
                                    var m = this.slice(0, parts[i].length),
										p = parts[i].slice(0, m.length);
                                    return m == p;
                                });
                                val = $.inArray(filtered[0], dates[language].monthsShort) + 1;
                                break;
                        }
                    }
                    parsed[part] = val;
                }
                for (var i = 0, _date, s; i < setters_order.length; i++) {
                    s = setters_order[i];
                    if (s in parsed && !isNaN(parsed[s])) {
                        _date = new Date(date);
                        setters_map[s](_date, parsed[s]);
                        if (!isNaN(_date))
                            date = _date;
                    }
                }
            }
            return date;
        },
        formatDate: function (date, format, language) {
            if (typeof format === 'string')
                format = DPGlobal.parseFormat(format);
            var val = {
                d: date.getUTCDate(),
                D: dates[language].daysShort[date.getUTCDay()],
                DD: dates[language].days[date.getUTCDay()],
                m: date.getUTCMonth() + 1,
                M: dates[language].monthsShort[date.getUTCMonth()],
                MM: dates[language].months[date.getUTCMonth()],
                yy: date.getUTCFullYear().toString().substring(2),
                yyyy: date.getUTCFullYear()
            };
            val.dd = (val.d < 10 ? '0' : '') + val.d;
            val.mm = (val.m < 10 ? '0' : '') + val.m;
            var date = [],
				seps = $.extend([], format.separators);
            for (var i = 0, cnt = format.parts.length; i <= cnt; i++) {
                if (seps.length)
                    date.push(seps.shift());
                date.push(val[format.parts[i]]);
            }
            return date.join('');
        },
        headTemplate: '<thead>' +
							'<tr>' +
								'<th class="prev">&laquo;</th>' +
								'<th colspan="5" class="datepicker-switch"></th>' +
								'<th class="next">&raquo;</th>' +
							'</tr>' +
						'</thead>',
        contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>',
        footTemplate: '<tfoot><tr><th colspan="7" class="today"></th></tr><tr><th colspan="7" class="clear"></th></tr></tfoot>'
    };
    DPGlobal.template = '<div class="datepicker">' +
							'<div class="datepicker-days">' +
								'<table class=" table-condensed">' +
									DPGlobal.headTemplate +
									'<tbody></tbody>' +
									DPGlobal.footTemplate +
								'</table>' +
							'</div>' +
							'<div class="datepicker-months">' +
								'<table class="table-condensed">' +
									DPGlobal.headTemplate +
									DPGlobal.contTemplate +
									DPGlobal.footTemplate +
								'</table>' +
							'</div>' +
							'<div class="datepicker-years">' +
								'<table class="table-condensed">' +
									DPGlobal.headTemplate +
									DPGlobal.contTemplate +
									DPGlobal.footTemplate +
								'</table>' +
							'</div>' +
						'</div>';

    $.fn.datepicker.DPGlobal = DPGlobal;


    /* DATEPICKER NO CONFLICT
	* =================== */

    $.fn.datepicker.noConflict = function () {
        $.fn.datepicker = old;
        return this;
    };


    /* DATEPICKER DATA-API
	* ================== */

    $(document).on(
		'focus.datepicker.data-api click.datepicker.data-api',
		'[data-provide="datepicker"]',
		function (e) {
		    var $this = $(this);
		    if ($this.data('datepicker')) return;
		    e.preventDefault();
		    // component click requires us to explicitly show it
		    $this.datepicker('show');
		}
	);
    $(function () {
        $('[data-provide="datepicker-inline"]').datepicker();
    });

}(window.jQuery));
; (function ($) {
    $.fn.datepicker.dates['es'] = {
        days: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
        daysShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
        daysMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"],
        months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
        today: "Hoy"
    };
}(jQuery));

/*Autocomplete*/
(function (e, t) { function i(t, i) { var s, a, o, r = t.nodeName.toLowerCase(); return "area" === r ? (s = t.parentNode, a = s.name, t.href && a && "map" === s.nodeName.toLowerCase() ? (o = e("img[usemap=#" + a + "]")[0], !!o && n(o)) : !1) : (/input|select|textarea|button|object/.test(r) ? !t.disabled : "a" === r ? t.href || i : i) && n(t) } function n(t) { return e.expr.filters.visible(t) && !e(t).parents().addBack().filter(function () { return "hidden" === e.css(this, "visibility") }).length } var s = 0, a = /^ui-id-\d+$/; e.ui = e.ui || {}, e.extend(e.ui, { version: "1.10.3", keyCode: { BACKSPACE: 8, COMMA: 188, DELETE: 46, DOWN: 40, END: 35, ENTER: 13, ESCAPE: 27, HOME: 36, LEFT: 37, NUMPAD_ADD: 107, NUMPAD_DECIMAL: 110, NUMPAD_DIVIDE: 111, NUMPAD_ENTER: 108, NUMPAD_MULTIPLY: 106, NUMPAD_SUBTRACT: 109, PAGE_DOWN: 34, PAGE_UP: 33, PERIOD: 190, RIGHT: 39, SPACE: 32, TAB: 9, UP: 38 } }), e.fn.extend({ focus: function (t) { return function (i, n) { return "number" == typeof i ? this.each(function () { var t = this; setTimeout(function () { e(t).focus(), n && n.call(t) }, i) }) : t.apply(this, arguments) } }(e.fn.focus), scrollParent: function () { var t; return t = e.ui.ie && /(static|relative)/.test(this.css("position")) || /absolute/.test(this.css("position")) ? this.parents().filter(function () { return /(relative|absolute|fixed)/.test(e.css(this, "position")) && /(auto|scroll)/.test(e.css(this, "overflow") + e.css(this, "overflow-y") + e.css(this, "overflow-x")) }).eq(0) : this.parents().filter(function () { return /(auto|scroll)/.test(e.css(this, "overflow") + e.css(this, "overflow-y") + e.css(this, "overflow-x")) }).eq(0), /fixed/.test(this.css("position")) || !t.length ? e(document) : t }, zIndex: function (i) { if (i !== t) return this.css("zIndex", i); if (this.length) for (var n, s, a = e(this[0]) ; a.length && a[0] !== document;) { if (n = a.css("position"), ("absolute" === n || "relative" === n || "fixed" === n) && (s = parseInt(a.css("zIndex"), 10), !isNaN(s) && 0 !== s)) return s; a = a.parent() } return 0 }, uniqueId: function () { return this.each(function () { this.id || (this.id = "ui-id-" + ++s) }) }, removeUniqueId: function () { return this.each(function () { a.test(this.id) && e(this).removeAttr("id") }) } }), e.extend(e.expr[":"], { data: e.expr.createPseudo ? e.expr.createPseudo(function (t) { return function (i) { return !!e.data(i, t) } }) : function (t, i, n) { return !!e.data(t, n[3]) }, focusable: function (t) { return i(t, !isNaN(e.attr(t, "tabindex"))) }, tabbable: function (t) { var n = e.attr(t, "tabindex"), s = isNaN(n); return (s || n >= 0) && i(t, !s) } }), e("<a>").outerWidth(1).jquery || e.each(["Width", "Height"], function (i, n) { function s(t, i, n, s) { return e.each(a, function () { i -= parseFloat(e.css(t, "padding" + this)) || 0, n && (i -= parseFloat(e.css(t, "border" + this + "Width")) || 0), s && (i -= parseFloat(e.css(t, "margin" + this)) || 0) }), i } var a = "Width" === n ? ["Left", "Right"] : ["Top", "Bottom"], o = n.toLowerCase(), r = { innerWidth: e.fn.innerWidth, innerHeight: e.fn.innerHeight, outerWidth: e.fn.outerWidth, outerHeight: e.fn.outerHeight }; e.fn["inner" + n] = function (i) { return i === t ? r["inner" + n].call(this) : this.each(function () { e(this).css(o, s(this, i) + "px") }) }, e.fn["outer" + n] = function (t, i) { return "number" != typeof t ? r["outer" + n].call(this, t) : this.each(function () { e(this).css(o, s(this, t, !0, i) + "px") }) } }), e.fn.addBack || (e.fn.addBack = function (e) { return this.add(null == e ? this.prevObject : this.prevObject.filter(e)) }), e("<a>").data("a-b", "a").removeData("a-b").data("a-b") && (e.fn.removeData = function (t) { return function (i) { return arguments.length ? t.call(this, e.camelCase(i)) : t.call(this) } }(e.fn.removeData)), e.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()), e.support.selectstart = "onselectstart" in document.createElement("div"), e.fn.extend({ disableSelection: function () { return this.bind((e.support.selectstart ? "selectstart" : "mousedown") + ".ui-disableSelection", function (e) { e.preventDefault() }) }, enableSelection: function () { return this.unbind(".ui-disableSelection") } }), e.extend(e.ui, { plugin: { add: function (t, i, n) { var s, a = e.ui[t].prototype; for (s in n) a.plugins[s] = a.plugins[s] || [], a.plugins[s].push([i, n[s]]) }, call: function (e, t, i) { var n, s = e.plugins[t]; if (s && e.element[0].parentNode && 11 !== e.element[0].parentNode.nodeType) for (n = 0; s.length > n; n++) e.options[s[n][0]] && s[n][1].apply(e.element, i) } }, hasScroll: function (t, i) { if ("hidden" === e(t).css("overflow")) return !1; var n = i && "left" === i ? "scrollLeft" : "scrollTop", s = !1; return t[n] > 0 ? !0 : (t[n] = 1, s = t[n] > 0, t[n] = 0, s) } }) })(jQuery); (function (t, e) { var i = 0, s = Array.prototype.slice, n = t.cleanData; t.cleanData = function (e) { for (var i, s = 0; null != (i = e[s]) ; s++) try { t(i).triggerHandler("remove") } catch (o) { } n(e) }, t.widget = function (i, s, n) { var o, a, r, h, l = {}, c = i.split(".")[0]; i = i.split(".")[1], o = c + "-" + i, n || (n = s, s = t.Widget), t.expr[":"][o.toLowerCase()] = function (e) { return !!t.data(e, o) }, t[c] = t[c] || {}, a = t[c][i], r = t[c][i] = function (t, i) { return this._createWidget ? (arguments.length && this._createWidget(t, i), e) : new r(t, i) }, t.extend(r, a, { version: n.version, _proto: t.extend({}, n), _childConstructors: [] }), h = new s, h.options = t.widget.extend({}, h.options), t.each(n, function (i, n) { return t.isFunction(n) ? (l[i] = function () { var t = function () { return s.prototype[i].apply(this, arguments) }, e = function (t) { return s.prototype[i].apply(this, t) }; return function () { var i, s = this._super, o = this._superApply; return this._super = t, this._superApply = e, i = n.apply(this, arguments), this._super = s, this._superApply = o, i } }(), e) : (l[i] = n, e) }), r.prototype = t.widget.extend(h, { widgetEventPrefix: a ? h.widgetEventPrefix : i }, l, { constructor: r, namespace: c, widgetName: i, widgetFullName: o }), a ? (t.each(a._childConstructors, function (e, i) { var s = i.prototype; t.widget(s.namespace + "." + s.widgetName, r, i._proto) }), delete a._childConstructors) : s._childConstructors.push(r), t.widget.bridge(i, r) }, t.widget.extend = function (i) { for (var n, o, a = s.call(arguments, 1), r = 0, h = a.length; h > r; r++) for (n in a[r]) o = a[r][n], a[r].hasOwnProperty(n) && o !== e && (i[n] = t.isPlainObject(o) ? t.isPlainObject(i[n]) ? t.widget.extend({}, i[n], o) : t.widget.extend({}, o) : o); return i }, t.widget.bridge = function (i, n) { var o = n.prototype.widgetFullName || i; t.fn[i] = function (a) { var r = "string" == typeof a, h = s.call(arguments, 1), l = this; return a = !r && h.length ? t.widget.extend.apply(null, [a].concat(h)) : a, r ? this.each(function () { var s, n = t.data(this, o); return n ? t.isFunction(n[a]) && "_" !== a.charAt(0) ? (s = n[a].apply(n, h), s !== n && s !== e ? (l = s && s.jquery ? l.pushStack(s.get()) : s, !1) : e) : t.error("no such method '" + a + "' for " + i + " widget instance") : t.error("cannot call methods on " + i + " prior to initialization; " + "attempted to call method '" + a + "'") }) : this.each(function () { var e = t.data(this, o); e ? e.option(a || {})._init() : t.data(this, o, new n(a, this)) }), l } }, t.Widget = function () { }, t.Widget._childConstructors = [], t.Widget.prototype = { widgetName: "widget", widgetEventPrefix: "", defaultElement: "<div>", options: { disabled: !1, create: null }, _createWidget: function (e, s) { s = t(s || this.defaultElement || this)[0], this.element = t(s), this.uuid = i++, this.eventNamespace = "." + this.widgetName + this.uuid, this.options = t.widget.extend({}, this.options, this._getCreateOptions(), e), this.bindings = t(), this.hoverable = t(), this.focusable = t(), s !== this && (t.data(s, this.widgetFullName, this), this._on(!0, this.element, { remove: function (t) { t.target === s && this.destroy() } }), this.document = t(s.style ? s.ownerDocument : s.document || s), this.window = t(this.document[0].defaultView || this.document[0].parentWindow)), this._create(), this._trigger("create", null, this._getCreateEventData()), this._init() }, _getCreateOptions: t.noop, _getCreateEventData: t.noop, _create: t.noop, _init: t.noop, destroy: function () { this._destroy(), this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData(t.camelCase(this.widgetFullName)), this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName + "-disabled " + "ui-state-disabled"), this.bindings.unbind(this.eventNamespace), this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus") }, _destroy: t.noop, widget: function () { return this.element }, option: function (i, s) { var n, o, a, r = i; if (0 === arguments.length) return t.widget.extend({}, this.options); if ("string" == typeof i) if (r = {}, n = i.split("."), i = n.shift(), n.length) { for (o = r[i] = t.widget.extend({}, this.options[i]), a = 0; n.length - 1 > a; a++) o[n[a]] = o[n[a]] || {}, o = o[n[a]]; if (i = n.pop(), s === e) return o[i] === e ? null : o[i]; o[i] = s } else { if (s === e) return this.options[i] === e ? null : this.options[i]; r[i] = s } return this._setOptions(r), this }, _setOptions: function (t) { var e; for (e in t) this._setOption(e, t[e]); return this }, _setOption: function (t, e) { return this.options[t] = e, "disabled" === t && (this.widget().toggleClass(this.widgetFullName + "-disabled ui-state-disabled", !!e).attr("aria-disabled", e), this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus")), this }, enable: function () { return this._setOption("disabled", !1) }, disable: function () { return this._setOption("disabled", !0) }, _on: function (i, s, n) { var o, a = this; "boolean" != typeof i && (n = s, s = i, i = !1), n ? (s = o = t(s), this.bindings = this.bindings.add(s)) : (n = s, s = this.element, o = this.widget()), t.each(n, function (n, r) { function h() { return i || a.options.disabled !== !0 && !t(this).hasClass("ui-state-disabled") ? ("string" == typeof r ? a[r] : r).apply(a, arguments) : e } "string" != typeof r && (h.guid = r.guid = r.guid || h.guid || t.guid++); var l = n.match(/^(\w+)\s*(.*)$/), c = l[1] + a.eventNamespace, u = l[2]; u ? o.delegate(u, c, h) : s.bind(c, h) }) }, _off: function (t, e) { e = (e || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace, t.unbind(e).undelegate(e) }, _delay: function (t, e) { function i() { return ("string" == typeof t ? s[t] : t).apply(s, arguments) } var s = this; return setTimeout(i, e || 0) }, _hoverable: function (e) { this.hoverable = this.hoverable.add(e), this._on(e, { mouseenter: function (e) { t(e.currentTarget).addClass("ui-state-hover") }, mouseleave: function (e) { t(e.currentTarget).removeClass("ui-state-hover") } }) }, _focusable: function (e) { this.focusable = this.focusable.add(e), this._on(e, { focusin: function (e) { t(e.currentTarget).addClass("ui-state-focus") }, focusout: function (e) { t(e.currentTarget).removeClass("ui-state-focus") } }) }, _trigger: function (e, i, s) { var n, o, a = this.options[e]; if (s = s || {}, i = t.Event(i), i.type = (e === this.widgetEventPrefix ? e : this.widgetEventPrefix + e).toLowerCase(), i.target = this.element[0], o = i.originalEvent) for (n in o) n in i || (i[n] = o[n]); return this.element.trigger(i, s), !(t.isFunction(a) && a.apply(this.element[0], [i].concat(s)) === !1 || i.isDefaultPrevented()) } }, t.each({ show: "fadeIn", hide: "fadeOut" }, function (e, i) { t.Widget.prototype["_" + e] = function (s, n, o) { "string" == typeof n && (n = { effect: n }); var a, r = n ? n === !0 || "number" == typeof n ? i : n.effect || i : e; n = n || {}, "number" == typeof n && (n = { duration: n }), a = !t.isEmptyObject(n), n.complete = o, n.delay && s.delay(n.delay), a && t.effects && t.effects.effect[r] ? s[e](n) : r !== e && s[r] ? s[r](n.duration, n.easing, o) : s.queue(function (i) { t(this)[e](), o && o.call(s[0]), i() }) } }) })(jQuery); (function (t) { var e = !1; t(document).mouseup(function () { e = !1 }), t.widget("ui.mouse", { version: "1.10.3", options: { cancel: "input,textarea,button,select,option", distance: 1, delay: 0 }, _mouseInit: function () { var e = this; this.element.bind("mousedown." + this.widgetName, function (t) { return e._mouseDown(t) }).bind("click." + this.widgetName, function (i) { return !0 === t.data(i.target, e.widgetName + ".preventClickEvent") ? (t.removeData(i.target, e.widgetName + ".preventClickEvent"), i.stopImmediatePropagation(), !1) : undefined }), this.started = !1 }, _mouseDestroy: function () { this.element.unbind("." + this.widgetName), this._mouseMoveDelegate && t(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate) }, _mouseDown: function (i) { if (!e) { this._mouseStarted && this._mouseUp(i), this._mouseDownEvent = i; var s = this, n = 1 === i.which, a = "string" == typeof this.options.cancel && i.target.nodeName ? t(i.target).closest(this.options.cancel).length : !1; return n && !a && this._mouseCapture(i) ? (this.mouseDelayMet = !this.options.delay, this.mouseDelayMet || (this._mouseDelayTimer = setTimeout(function () { s.mouseDelayMet = !0 }, this.options.delay)), this._mouseDistanceMet(i) && this._mouseDelayMet(i) && (this._mouseStarted = this._mouseStart(i) !== !1, !this._mouseStarted) ? (i.preventDefault(), !0) : (!0 === t.data(i.target, this.widgetName + ".preventClickEvent") && t.removeData(i.target, this.widgetName + ".preventClickEvent"), this._mouseMoveDelegate = function (t) { return s._mouseMove(t) }, this._mouseUpDelegate = function (t) { return s._mouseUp(t) }, t(document).bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate), i.preventDefault(), e = !0, !0)) : !0 } }, _mouseMove: function (e) { return t.ui.ie && (!document.documentMode || 9 > document.documentMode) && !e.button ? this._mouseUp(e) : this._mouseStarted ? (this._mouseDrag(e), e.preventDefault()) : (this._mouseDistanceMet(e) && this._mouseDelayMet(e) && (this._mouseStarted = this._mouseStart(this._mouseDownEvent, e) !== !1, this._mouseStarted ? this._mouseDrag(e) : this._mouseUp(e)), !this._mouseStarted) }, _mouseUp: function (e) { return t(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate), this._mouseStarted && (this._mouseStarted = !1, e.target === this._mouseDownEvent.target && t.data(e.target, this.widgetName + ".preventClickEvent", !0), this._mouseStop(e)), !1 }, _mouseDistanceMet: function (t) { return Math.max(Math.abs(this._mouseDownEvent.pageX - t.pageX), Math.abs(this._mouseDownEvent.pageY - t.pageY)) >= this.options.distance }, _mouseDelayMet: function () { return this.mouseDelayMet }, _mouseStart: function () { }, _mouseDrag: function () { }, _mouseStop: function () { }, _mouseCapture: function () { return !0 } }) })(jQuery); (function (t, e) { function i(t, e, i) { return [parseFloat(t[0]) * (p.test(t[0]) ? e / 100 : 1), parseFloat(t[1]) * (p.test(t[1]) ? i / 100 : 1)] } function s(e, i) { return parseInt(t.css(e, i), 10) || 0 } function n(e) { var i = e[0]; return 9 === i.nodeType ? { width: e.width(), height: e.height(), offset: { top: 0, left: 0 } } : t.isWindow(i) ? { width: e.width(), height: e.height(), offset: { top: e.scrollTop(), left: e.scrollLeft() } } : i.preventDefault ? { width: 0, height: 0, offset: { top: i.pageY, left: i.pageX } } : { width: e.outerWidth(), height: e.outerHeight(), offset: e.offset() } } t.ui = t.ui || {}; var a, o = Math.max, r = Math.abs, l = Math.round, h = /left|center|right/, c = /top|center|bottom/, u = /[\+\-]\d+(\.[\d]+)?%?/, d = /^\w+/, p = /%$/, f = t.fn.position; t.position = { scrollbarWidth: function () { if (a !== e) return a; var i, s, n = t("<div style='display:block;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"), o = n.children()[0]; return t("body").append(n), i = o.offsetWidth, n.css("overflow", "scroll"), s = o.offsetWidth, i === s && (s = n[0].clientWidth), n.remove(), a = i - s }, getScrollInfo: function (e) { var i = e.isWindow ? "" : e.element.css("overflow-x"), s = e.isWindow ? "" : e.element.css("overflow-y"), n = "scroll" === i || "auto" === i && e.width < e.element[0].scrollWidth, a = "scroll" === s || "auto" === s && e.height < e.element[0].scrollHeight; return { width: a ? t.position.scrollbarWidth() : 0, height: n ? t.position.scrollbarWidth() : 0 } }, getWithinInfo: function (e) { var i = t(e || window), s = t.isWindow(i[0]); return { element: i, isWindow: s, offset: i.offset() || { left: 0, top: 0 }, scrollLeft: i.scrollLeft(), scrollTop: i.scrollTop(), width: s ? i.width() : i.outerWidth(), height: s ? i.height() : i.outerHeight() } } }, t.fn.position = function (e) { if (!e || !e.of) return f.apply(this, arguments); e = t.extend({}, e); var a, p, g, m, v, _, b = t(e.of), y = t.position.getWithinInfo(e.within), k = t.position.getScrollInfo(y), w = (e.collision || "flip").split(" "), D = {}; return _ = n(b), b[0].preventDefault && (e.at = "left top"), p = _.width, g = _.height, m = _.offset, v = t.extend({}, m), t.each(["my", "at"], function () { var t, i, s = (e[this] || "").split(" "); 1 === s.length && (s = h.test(s[0]) ? s.concat(["center"]) : c.test(s[0]) ? ["center"].concat(s) : ["center", "center"]), s[0] = h.test(s[0]) ? s[0] : "center", s[1] = c.test(s[1]) ? s[1] : "center", t = u.exec(s[0]), i = u.exec(s[1]), D[this] = [t ? t[0] : 0, i ? i[0] : 0], e[this] = [d.exec(s[0])[0], d.exec(s[1])[0]] }), 1 === w.length && (w[1] = w[0]), "right" === e.at[0] ? v.left += p : "center" === e.at[0] && (v.left += p / 2), "bottom" === e.at[1] ? v.top += g : "center" === e.at[1] && (v.top += g / 2), a = i(D.at, p, g), v.left += a[0], v.top += a[1], this.each(function () { var n, h, c = t(this), u = c.outerWidth(), d = c.outerHeight(), f = s(this, "marginLeft"), _ = s(this, "marginTop"), x = u + f + s(this, "marginRight") + k.width, C = d + _ + s(this, "marginBottom") + k.height, M = t.extend({}, v), T = i(D.my, c.outerWidth(), c.outerHeight()); "right" === e.my[0] ? M.left -= u : "center" === e.my[0] && (M.left -= u / 2), "bottom" === e.my[1] ? M.top -= d : "center" === e.my[1] && (M.top -= d / 2), M.left += T[0], M.top += T[1], t.support.offsetFractions || (M.left = l(M.left), M.top = l(M.top)), n = { marginLeft: f, marginTop: _ }, t.each(["left", "top"], function (i, s) { t.ui.position[w[i]] && t.ui.position[w[i]][s](M, { targetWidth: p, targetHeight: g, elemWidth: u, elemHeight: d, collisionPosition: n, collisionWidth: x, collisionHeight: C, offset: [a[0] + T[0], a[1] + T[1]], my: e.my, at: e.at, within: y, elem: c }) }), e.using && (h = function (t) { var i = m.left - M.left, s = i + p - u, n = m.top - M.top, a = n + g - d, l = { target: { element: b, left: m.left, top: m.top, width: p, height: g }, element: { element: c, left: M.left, top: M.top, width: u, height: d }, horizontal: 0 > s ? "left" : i > 0 ? "right" : "center", vertical: 0 > a ? "top" : n > 0 ? "bottom" : "middle" }; u > p && p > r(i + s) && (l.horizontal = "center"), d > g && g > r(n + a) && (l.vertical = "middle"), l.important = o(r(i), r(s)) > o(r(n), r(a)) ? "horizontal" : "vertical", e.using.call(this, t, l) }), c.offset(t.extend(M, { using: h })) }) }, t.ui.position = { fit: { left: function (t, e) { var i, s = e.within, n = s.isWindow ? s.scrollLeft : s.offset.left, a = s.width, r = t.left - e.collisionPosition.marginLeft, l = n - r, h = r + e.collisionWidth - a - n; e.collisionWidth > a ? l > 0 && 0 >= h ? (i = t.left + l + e.collisionWidth - a - n, t.left += l - i) : t.left = h > 0 && 0 >= l ? n : l > h ? n + a - e.collisionWidth : n : l > 0 ? t.left += l : h > 0 ? t.left -= h : t.left = o(t.left - r, t.left) }, top: function (t, e) { var i, s = e.within, n = s.isWindow ? s.scrollTop : s.offset.top, a = e.within.height, r = t.top - e.collisionPosition.marginTop, l = n - r, h = r + e.collisionHeight - a - n; e.collisionHeight > a ? l > 0 && 0 >= h ? (i = t.top + l + e.collisionHeight - a - n, t.top += l - i) : t.top = h > 0 && 0 >= l ? n : l > h ? n + a - e.collisionHeight : n : l > 0 ? t.top += l : h > 0 ? t.top -= h : t.top = o(t.top - r, t.top) } }, flip: { left: function (t, e) { var i, s, n = e.within, a = n.offset.left + n.scrollLeft, o = n.width, l = n.isWindow ? n.scrollLeft : n.offset.left, h = t.left - e.collisionPosition.marginLeft, c = h - l, u = h + e.collisionWidth - o - l, d = "left" === e.my[0] ? -e.elemWidth : "right" === e.my[0] ? e.elemWidth : 0, p = "left" === e.at[0] ? e.targetWidth : "right" === e.at[0] ? -e.targetWidth : 0, f = -2 * e.offset[0]; 0 > c ? (i = t.left + d + p + f + e.collisionWidth - o - a, (0 > i || r(c) > i) && (t.left += d + p + f)) : u > 0 && (s = t.left - e.collisionPosition.marginLeft + d + p + f - l, (s > 0 || u > r(s)) && (t.left += d + p + f)) }, top: function (t, e) { var i, s, n = e.within, a = n.offset.top + n.scrollTop, o = n.height, l = n.isWindow ? n.scrollTop : n.offset.top, h = t.top - e.collisionPosition.marginTop, c = h - l, u = h + e.collisionHeight - o - l, d = "top" === e.my[1], p = d ? -e.elemHeight : "bottom" === e.my[1] ? e.elemHeight : 0, f = "top" === e.at[1] ? e.targetHeight : "bottom" === e.at[1] ? -e.targetHeight : 0, g = -2 * e.offset[1]; 0 > c ? (s = t.top + p + f + g + e.collisionHeight - o - a, t.top + p + f + g > c && (0 > s || r(c) > s) && (t.top += p + f + g)) : u > 0 && (i = t.top - e.collisionPosition.marginTop + p + f + g - l, t.top + p + f + g > u && (i > 0 || u > r(i)) && (t.top += p + f + g)) } }, flipfit: { left: function () { t.ui.position.flip.left.apply(this, arguments), t.ui.position.fit.left.apply(this, arguments) }, top: function () { t.ui.position.flip.top.apply(this, arguments), t.ui.position.fit.top.apply(this, arguments) } } }, function () { var e, i, s, n, a, o = document.getElementsByTagName("body")[0], r = document.createElement("div"); e = document.createElement(o ? "div" : "body"), s = { visibility: "hidden", width: 0, height: 0, border: 0, margin: 0, background: "none" }, o && t.extend(s, { position: "absolute", left: "-1000px", top: "-1000px" }); for (a in s) e.style[a] = s[a]; e.appendChild(r), i = o || document.documentElement, i.insertBefore(e, i.firstChild), r.style.cssText = "position: absolute; left: 10.7432222px;", n = t(r).offset().left, t.support.offsetFractions = n > 10 && 11 > n, e.innerHTML = "", i.removeChild(e) }() })(jQuery); (function (e) { var t = 0; e.widget("ui.autocomplete", { version: "1.10.3", defaultElement: "<input>", options: { appendTo: null, autoFocus: !1, delay: 300, minLength: 1, position: { my: "left top", at: "left bottom", collision: "none" }, source: null, change: null, close: null, focus: null, open: null, response: null, search: null, select: null }, pending: 0, _create: function () { var t, i, s, n = this.element[0].nodeName.toLowerCase(), a = "textarea" === n, o = "input" === n; this.isMultiLine = a ? !0 : o ? !1 : this.element.prop("isContentEditable"), this.valueMethod = this.element[a || o ? "val" : "text"], this.isNewMenu = !0, this.element.addClass("ui-autocomplete-input").attr("autocomplete", "off"), this._on(this.element, { keydown: function (n) { if (this.element.prop("readOnly")) return t = !0, s = !0, i = !0, undefined; t = !1, s = !1, i = !1; var a = e.ui.keyCode; switch (n.keyCode) { case a.PAGE_UP: t = !0, this._move("previousPage", n); break; case a.PAGE_DOWN: t = !0, this._move("nextPage", n); break; case a.UP: t = !0, this._keyEvent("previous", n); break; case a.DOWN: t = !0, this._keyEvent("next", n); break; case a.ENTER: case a.NUMPAD_ENTER: this.menu.active && (t = !0, n.preventDefault(), this.menu.select(n)); break; case a.TAB: this.menu.active && this.menu.select(n); break; case a.ESCAPE: this.menu.element.is(":visible") && (this._value(this.term), this.close(n), n.preventDefault()); break; default: i = !0, this._searchTimeout(n) } }, keypress: function (s) { if (t) return t = !1, (!this.isMultiLine || this.menu.element.is(":visible")) && s.preventDefault(), undefined; if (!i) { var n = e.ui.keyCode; switch (s.keyCode) { case n.PAGE_UP: this._move("previousPage", s); break; case n.PAGE_DOWN: this._move("nextPage", s); break; case n.UP: this._keyEvent("previous", s); break; case n.DOWN: this._keyEvent("next", s) } } }, input: function (e) { return s ? (s = !1, e.preventDefault(), undefined) : (this._searchTimeout(e), undefined) }, focus: function () { this.selectedItem = null, this.previous = this._value() }, blur: function (e) { return this.cancelBlur ? (delete this.cancelBlur, undefined) : (clearTimeout(this.searching), this.close(e), this._change(e), undefined) } }), this._initSource(), this.menu = e("<ul>").addClass("ui-autocomplete ui-front").appendTo(this._appendTo()).menu({ role: null }).hide().data("ui-menu"), this._on(this.menu.element, { mousedown: function (t) { t.preventDefault(), this.cancelBlur = !0, this._delay(function () { delete this.cancelBlur }); var i = this.menu.element[0]; e(t.target).closest(".ui-menu-item").length || this._delay(function () { var t = this; this.document.one("mousedown", function (s) { s.target === t.element[0] || s.target === i || e.contains(i, s.target) || t.close() }) }) }, menufocus: function (t, i) { if (this.isNewMenu && (this.isNewMenu = !1, t.originalEvent && /^mouse/.test(t.originalEvent.type))) return this.menu.blur(), this.document.one("mousemove", function () { e(t.target).trigger(t.originalEvent) }), undefined; var s = i.item.data("ui-autocomplete-item"); !1 !== this._trigger("focus", t, { item: s }) ? t.originalEvent && /^key/.test(t.originalEvent.type) && this._value(s.value) : this.liveRegion.text(s.value) }, menuselect: function (e, t) { var i = t.item.data("ui-autocomplete-item"), s = this.previous; this.element[0] !== this.document[0].activeElement && (this.element.focus(), this.previous = s, this._delay(function () { this.previous = s, this.selectedItem = i })), !1 !== this._trigger("select", e, { item: i }) && this._value(i.value), this.term = this._value(), this.close(e), this.selectedItem = i } }), this.liveRegion = e("<span>", { role: "status", "aria-live": "polite" }).addClass("ui-helper-hidden-accessible").insertBefore(this.element), this._on(this.window, { beforeunload: function () { this.element.removeAttr("autocomplete") } }) }, _destroy: function () { clearTimeout(this.searching), this.element.removeClass("ui-autocomplete-input").removeAttr("autocomplete"), this.menu.element.remove(), this.liveRegion.remove() }, _setOption: function (e, t) { this._super(e, t), "source" === e && this._initSource(), "appendTo" === e && this.menu.element.appendTo(this._appendTo()), "disabled" === e && t && this.xhr && this.xhr.abort() }, _appendTo: function () { var t = this.options.appendTo; return t && (t = t.jquery || t.nodeType ? e(t) : this.document.find(t).eq(0)), t || (t = this.element.closest(".ui-front")), t.length || (t = this.document[0].body), t }, _initSource: function () { var t, i, s = this; e.isArray(this.options.source) ? (t = this.options.source, this.source = function (i, s) { s(e.ui.autocomplete.filter(t, i.term)) }) : "string" == typeof this.options.source ? (i = this.options.source, this.source = function (t, n) { s.xhr && s.xhr.abort(), s.xhr = e.ajax({ url: i, data: t, dataType: "json", success: function (e) { n(e) }, error: function () { n([]) } }) }) : this.source = this.options.source }, _searchTimeout: function (e) { clearTimeout(this.searching), this.searching = this._delay(function () { this.term !== this._value() && (this.selectedItem = null, this.search(null, e)) }, this.options.delay) }, search: function (e, t) { return e = null != e ? e : this._value(), this.term = this._value(), e.length < this.options.minLength ? this.close(t) : this._trigger("search", t) !== !1 ? this._search(e) : undefined }, _search: function (e) { this.pending++, this.element.addClass("ui-autocomplete-loading"), this.cancelSearch = !1, this.source({ term: e }, this._response()) }, _response: function () { var e = this, i = ++t; return function (s) { i === t && e.__response(s), e.pending--, e.pending || e.element.removeClass("ui-autocomplete-loading") } }, __response: function (e) { e && (e = this._normalize(e)), this._trigger("response", null, { content: e }), !this.options.disabled && e && e.length && !this.cancelSearch ? (this._suggest(e), this._trigger("open")) : this._close() }, close: function (e) { this.cancelSearch = !0, this._close(e) }, _close: function (e) { this.menu.element.is(":visible") && (this.menu.element.hide(), this.menu.blur(), this.isNewMenu = !0, this._trigger("close", e)) }, _change: function (e) { this.previous !== this._value() && this._trigger("change", e, { item: this.selectedItem }) }, _normalize: function (t) { return t.length && t[0].label && t[0].value ? t : e.map(t, function (t) { return "string" == typeof t ? { label: t, value: t } : e.extend({ label: t.label || t.value, value: t.value || t.label }, t) }) }, _suggest: function (t) { var i = this.menu.element.empty(); this._renderMenu(i, t), this.isNewMenu = !0, this.menu.refresh(), i.show(), this._resizeMenu(), i.position(e.extend({ of: this.element }, this.options.position)), this.options.autoFocus && this.menu.next() }, _resizeMenu: function () { var e = this.menu.element; e.outerWidth(Math.max(e.width("").outerWidth() + 1, this.element.outerWidth())) }, _renderMenu: function (t, i) { var s = this; e.each(i, function (e, i) { s._renderItemData(t, i) }) }, _renderItemData: function (e, t) { return this._renderItem(e, t).data("ui-autocomplete-item", t) }, _renderItem: function (t, i) { return e("<li>").append(e("<a>").text(i.label)).appendTo(t) }, _move: function (e, t) { return this.menu.element.is(":visible") ? this.menu.isFirstItem() && /^previous/.test(e) || this.menu.isLastItem() && /^next/.test(e) ? (this._value(this.term), this.menu.blur(), undefined) : (this.menu[e](t), undefined) : (this.search(null, t), undefined) }, widget: function () { return this.menu.element }, _value: function () { return this.valueMethod.apply(this.element, arguments) }, _keyEvent: function (e, t) { (!this.isMultiLine || this.menu.element.is(":visible")) && (this._move(e, t), t.preventDefault()) } }), e.extend(e.ui.autocomplete, { escapeRegex: function (e) { return e.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&") }, filter: function (t, i) { var s = RegExp(e.ui.autocomplete.escapeRegex(i), "i"); return e.grep(t, function (e) { return s.test(e.label || e.value || e) }) } }), e.widget("ui.autocomplete", e.ui.autocomplete, { options: { messages: { noResults: "No se encontraron resultados.", results: function (e) { return e + (e > 1 ? " resultados se han" : " resultado se ha") + " encontrado, use arriba o abajo para navegar." } } }, __response: function (e) { var t; this._superApply(arguments), this.options.disabled || this.cancelSearch || (t = e && e.length ? this.options.messages.results(e.length) : this.options.messages.noResults, this.liveRegion.text(t)) } }) })(jQuery); (function (t) { t.widget("ui.menu", { version: "1.10.3", defaultElement: "<ul>", delay: 300, options: { icons: { submenu: "ui-icon-carat-1-e" }, menus: "ul", position: { my: "left top", at: "right top" }, role: "menu", blur: null, focus: null, select: null }, _create: function () { this.activeMenu = this.element, this.mouseHandled = !1, this.element.uniqueId().addClass("ui-menu ui-widget ui-widget-content ui-corner-all").toggleClass("ui-menu-icons", !!this.element.find(".ui-icon").length).attr({ role: this.options.role, tabIndex: 0 }).bind("click" + this.eventNamespace, t.proxy(function (t) { this.options.disabled && t.preventDefault() }, this)), this.options.disabled && this.element.addClass("ui-state-disabled").attr("aria-disabled", "true"), this._on({ "mousedown .ui-menu-item > a": function (t) { t.preventDefault() }, "click .ui-state-disabled > a": function (t) { t.preventDefault() }, "click .ui-menu-item:has(a)": function (e) { var i = t(e.target).closest(".ui-menu-item"); !this.mouseHandled && i.not(".ui-state-disabled").length && (this.mouseHandled = !0, this.select(e), i.has(".ui-menu").length ? this.expand(e) : this.element.is(":focus") || (this.element.trigger("focus", [!0]), this.active && 1 === this.active.parents(".ui-menu").length && clearTimeout(this.timer))) }, "mouseenter .ui-menu-item": function (e) { var i = t(e.currentTarget); i.siblings().children(".ui-state-active").removeClass("ui-state-active"), this.focus(e, i) }, mouseleave: "collapseAll", "mouseleave .ui-menu": "collapseAll", focus: function (t, e) { var i = this.active || this.element.children(".ui-menu-item").eq(0); e || this.focus(t, i) }, blur: function (e) { this._delay(function () { t.contains(this.element[0], this.document[0].activeElement) || this.collapseAll(e) }) }, keydown: "_keydown" }), this.refresh(), this._on(this.document, { click: function (e) { t(e.target).closest(".ui-menu").length || this.collapseAll(e), this.mouseHandled = !1 } }) }, _destroy: function () { this.element.removeAttr("aria-activedescendant").find(".ui-menu").addBack().removeClass("ui-menu ui-widget ui-widget-content ui-corner-all ui-menu-icons").removeAttr("role").removeAttr("tabIndex").removeAttr("aria-labelledby").removeAttr("aria-expanded").removeAttr("aria-hidden").removeAttr("aria-disabled").removeUniqueId().show(), this.element.find(".ui-menu-item").removeClass("ui-menu-item").removeAttr("role").removeAttr("aria-disabled").children("a").removeUniqueId().removeClass("ui-corner-all ui-state-hover").removeAttr("tabIndex").removeAttr("role").removeAttr("aria-haspopup").children().each(function () { var e = t(this); e.data("ui-menu-submenu-carat") && e.remove() }), this.element.find(".ui-menu-divider").removeClass("ui-menu-divider ui-widget-content") }, _keydown: function (e) { function i(t) { return t.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&") } var s, n, a, o, r, l = !0; switch (e.keyCode) { case t.ui.keyCode.PAGE_UP: this.previousPage(e); break; case t.ui.keyCode.PAGE_DOWN: this.nextPage(e); break; case t.ui.keyCode.HOME: this._move("first", "first", e); break; case t.ui.keyCode.END: this._move("last", "last", e); break; case t.ui.keyCode.UP: this.previous(e); break; case t.ui.keyCode.DOWN: this.next(e); break; case t.ui.keyCode.LEFT: this.collapse(e); break; case t.ui.keyCode.RIGHT: this.active && !this.active.is(".ui-state-disabled") && this.expand(e); break; case t.ui.keyCode.ENTER: case t.ui.keyCode.SPACE: this._activate(e); break; case t.ui.keyCode.ESCAPE: this.collapse(e); break; default: l = !1, n = this.previousFilter || "", a = String.fromCharCode(e.keyCode), o = !1, clearTimeout(this.filterTimer), a === n ? o = !0 : a = n + a, r = RegExp("^" + i(a), "i"), s = this.activeMenu.children(".ui-menu-item").filter(function () { return r.test(t(this).children("a").text()) }), s = o && -1 !== s.index(this.active.next()) ? this.active.nextAll(".ui-menu-item") : s, s.length || (a = String.fromCharCode(e.keyCode), r = RegExp("^" + i(a), "i"), s = this.activeMenu.children(".ui-menu-item").filter(function () { return r.test(t(this).children("a").text()) })), s.length ? (this.focus(e, s), s.length > 1 ? (this.previousFilter = a, this.filterTimer = this._delay(function () { delete this.previousFilter }, 1e3)) : delete this.previousFilter) : delete this.previousFilter } l && e.preventDefault() }, _activate: function (t) { this.active.is(".ui-state-disabled") || (this.active.children("a[aria-haspopup='true']").length ? this.expand(t) : this.select(t)) }, refresh: function () { var e, i = this.options.icons.submenu, s = this.element.find(this.options.menus); s.filter(":not(.ui-menu)").addClass("ui-menu ui-widget ui-widget-content ui-corner-all").hide().attr({ role: this.options.role, "aria-hidden": "true", "aria-expanded": "false" }).each(function () { var e = t(this), s = e.prev("a"), n = t("<span>").addClass("ui-menu-icon ui-icon " + i).data("ui-menu-submenu-carat", !0); s.attr("aria-haspopup", "true").prepend(n), e.attr("aria-labelledby", s.attr("id")) }), e = s.add(this.element), e.children(":not(.ui-menu-item):has(a)").addClass("ui-menu-item").attr("role", "presentation").children("a").uniqueId().addClass("ui-corner-all").attr({ tabIndex: -1, role: this._itemRole() }), e.children(":not(.ui-menu-item)").each(function () { var e = t(this); /[^\-\u2014\u2013\s]/.test(e.text()) || e.addClass("ui-widget-content ui-menu-divider") }), e.children(".ui-state-disabled").attr("aria-disabled", "true"), this.active && !t.contains(this.element[0], this.active[0]) && this.blur() }, _itemRole: function () { return { menu: "menuitem", listbox: "option" }[this.options.role] }, _setOption: function (t, e) { "icons" === t && this.element.find(".ui-menu-icon").removeClass(this.options.icons.submenu).addClass(e.submenu), this._super(t, e) }, focus: function (t, e) { var i, s; this.blur(t, t && "focus" === t.type), this._scrollIntoView(e), this.active = e.first(), s = this.active.children("a").addClass("ui-state-focus"), this.options.role && this.element.attr("aria-activedescendant", s.attr("id")), this.active.parent().closest(".ui-menu-item").children("a:first").addClass("ui-state-active"), t && "keydown" === t.type ? this._close() : this.timer = this._delay(function () { this._close() }, this.delay), i = e.children(".ui-menu"), i.length && /^mouse/.test(t.type) && this._startOpening(i), this.activeMenu = e.parent(), this._trigger("focus", t, { item: e }) }, _scrollIntoView: function (e) { var i, s, n, a, o, r; this._hasScroll() && (i = parseFloat(t.css(this.activeMenu[0], "borderTopWidth")) || 0, s = parseFloat(t.css(this.activeMenu[0], "paddingTop")) || 0, n = e.offset().top - this.activeMenu.offset().top - i - s, a = this.activeMenu.scrollTop(), o = this.activeMenu.height(), r = e.height(), 0 > n ? this.activeMenu.scrollTop(a + n) : n + r > o && this.activeMenu.scrollTop(a + n - o + r)) }, blur: function (t, e) { e || clearTimeout(this.timer), this.active && (this.active.children("a").removeClass("ui-state-focus"), this.active = null, this._trigger("blur", t, { item: this.active })) }, _startOpening: function (t) { clearTimeout(this.timer), "true" === t.attr("aria-hidden") && (this.timer = this._delay(function () { this._close(), this._open(t) }, this.delay)) }, _open: function (e) { var i = t.extend({ of: this.active }, this.options.position); clearTimeout(this.timer), this.element.find(".ui-menu").not(e.parents(".ui-menu")).hide().attr("aria-hidden", "true"), e.show().removeAttr("aria-hidden").attr("aria-expanded", "true").position(i) }, collapseAll: function (e, i) { clearTimeout(this.timer), this.timer = this._delay(function () { var s = i ? this.element : t(e && e.target).closest(this.element.find(".ui-menu")); s.length || (s = this.element), this._close(s), this.blur(e), this.activeMenu = s }, this.delay) }, _close: function (t) { t || (t = this.active ? this.active.parent() : this.element), t.find(".ui-menu").hide().attr("aria-hidden", "true").attr("aria-expanded", "false").end().find("a.ui-state-active").removeClass("ui-state-active") }, collapse: function (t) { var e = this.active && this.active.parent().closest(".ui-menu-item", this.element); e && e.length && (this._close(), this.focus(t, e)) }, expand: function (t) { var e = this.active && this.active.children(".ui-menu ").children(".ui-menu-item").first(); e && e.length && (this._open(e.parent()), this._delay(function () { this.focus(t, e) })) }, next: function (t) { this._move("next", "first", t) }, previous: function (t) { this._move("prev", "last", t) }, isFirstItem: function () { return this.active && !this.active.prevAll(".ui-menu-item").length }, isLastItem: function () { return this.active && !this.active.nextAll(".ui-menu-item").length }, _move: function (t, e, i) { var s; this.active && (s = "first" === t || "last" === t ? this.active["first" === t ? "prevAll" : "nextAll"](".ui-menu-item").eq(-1) : this.active[t + "All"](".ui-menu-item").eq(0)), s && s.length && this.active || (s = this.activeMenu.children(".ui-menu-item")[e]()), this.focus(i, s) }, nextPage: function (e) { var i, s, n; return this.active ? (this.isLastItem() || (this._hasScroll() ? (s = this.active.offset().top, n = this.element.height(), this.active.nextAll(".ui-menu-item").each(function () { return i = t(this), 0 > i.offset().top - s - n }), this.focus(e, i)) : this.focus(e, this.activeMenu.children(".ui-menu-item")[this.active ? "last" : "first"]())), undefined) : (this.next(e), undefined) }, previousPage: function (e) { var i, s, n; return this.active ? (this.isFirstItem() || (this._hasScroll() ? (s = this.active.offset().top, n = this.element.height(), this.active.prevAll(".ui-menu-item").each(function () { return i = t(this), i.offset().top - s + n > 0 }), this.focus(e, i)) : this.focus(e, this.activeMenu.children(".ui-menu-item").first())), undefined) : (this.next(e), undefined) }, _hasScroll: function () { return this.element.outerHeight() < this.element.prop("scrollHeight") }, select: function (e) { this.active = this.active || t(e.target).closest(".ui-menu-item"); var i = { item: this.active }; this.active.has(".ui-menu").length || this.collapseAll(e, !0), this._trigger("select", e, i) } }) })(jQuery);

/* Multiselect */
!function ($) {
    "use strict";// jshint ;_;

    if (typeof ko != 'undefined' && ko.bindingHandlers && !ko.bindingHandlers.multiselect) {
        ko.bindingHandlers.multiselect = {
            init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            },
            update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var ms = $(element).data('multiselect');
                if (!ms) {
                    $(element).multiselect(ko.utils.unwrapObservable(valueAccessor()));
                }
                else
                    if (allBindingsAccessor().options && allBindingsAccessor().options().length !== ms.originalOptions.length) {
                        ms.updateOriginalOptions();
                        $(element).multiselect('rebuild');
                    }
            }
        };
    }

    function Multiselect(select, options) {

        this.options = this.getOptions(options);
        this.$select = $(select);
        this.originalOptions = this.$select.clone()[0].options;
        //we have to clone to create a new reference
        this.query = '';
        this.searchTimeout = null;

        this.options.multiple = this.$select.attr('multiple') == "multiple";

        this.$container = $(this.options.buttonContainer).append('<button type="button" class="multiselect dropdown-toggle ' + this.options.buttonClass + '" data-toggle="dropdown">' + this.options.buttonText(this.getSelected(), this.$select) + '</button>')
            .append('<ul class="multiselect-container dropdown-menu' + (this.options.dropRight ? ' pull-right' : '') + '"></ul>');

        // Manually add button width if set.
        if (this.options.buttonWidth) {
            $('button', this.$container).css({
                'width': this.options.buttonWidth
            });
        }

        // Keep the tab index from the select.
        var tabindex = this.$select.attr('tabindex');
        if (tabindex) {
            $('button', this.$container).attr('tabindex', tabindex);
        }

        // Set max height of dropdown menu to activate auto scrollbar.
        if (this.options.maxHeight) {
            // TODO: Add a class for this option to move the css declarations.
            $('.multiselect-container', this.$container).css({
                'max-height': this.options.maxHeight + 'px',
                'overflow-y': 'auto',
                'overflow-x': 'hidden'
            });
        }

        // Enable filtering.
        if (this.options.enableFiltering || this.options.enableCaseInsensitiveFiltering) {
            var enableFilterLength = Math.max(this.options.enableFiltering, this.options.enableCaseInsensitiveFiltering);
            if (this.$select.find('option').length >= enableFilterLength) {
                this.buildFilter();
            }
        }

        // Build select all if enabled.
        this.buildSelectAll();
        this.buildDropdown();
        this.updateButtonText();

        this.$select.hide().after(this.$container);
    };

    Multiselect.prototype = {

        defaults: {
            // Default text function will either print 'None selected' in case no
            // option is selected, or a list of the selected options up to a length of 3 selected options.
            // If more than 3 options are selected, the number of selected options is printed.
            buttonText: function (options, select) {
                if (options.length == 0) {
                    return this.nonSelectedText + ' <b class="caret"></b>';
                }
                else
                    if (options.length > 3) {
                        return options.length + ' ' + this.nSelectedText + ' <b class="caret"></b>';
                    }
                    else {
                        var selected = '';
                        options.each(function () {
                            var label = ($(this).attr('label') !== undefined) ? $(this).attr('label') : $(this).html();

                            selected += label + ', ';
                        });
                        return selected.substr(0, selected.length - 2) + ' <b class="caret"></b>';
                    }
            },
            // Like the buttonText option to update the title of the button.
            buttonTitle: function (options, select) {
                var selected = '';
                options.each(function () {
                    selected += $(this).text() + ', ';
                });
                return selected.substr(0, selected.length - 2);
            },
            // Is triggered on change of the selected options.
            onChange: function (option, checked) {

            },
            buttonClass: 'btn',
            dropRight: false,
            selectedClass: 'active',
            buttonWidth: 'auto',
            buttonContainer: '<div class="btn-group" />',
            // Maximum height of the dropdown menu.
            // If maximum height is exceeded a scrollbar will be displayed.
            maxHeight: false,
            includeSelectAllOption: false,
            selectAllText: ' Seleccionar todo',
            selectAllValue: 'multiselect-all',
            enableFiltering: false,
            enableCaseInsensitiveFiltering: false,
            filterPlaceholder: 'Search',
            // possible options: 'text', 'value', 'both'
            filterBehavior: 'text',
            preventInputChangeEvent: false,
            nonSelectedText: 'Sin seleccionar',
            nSelectedText: 'seleccionados'
        },

        constructor: Multiselect,

        // Will build an dropdown element for the given option.
        createOptionValue: function (element) {
            if ($(element).is(':selected')) {
                $(element).attr('selected', 'selected').prop('selected', true);
            }

            // Support the label attribute on options.
            var label = $(element).attr('label') || $(element).html();
            var value = $(element).val();
            var inputType = this.options.multiple ? "checkbox" : "radio";

            var $li = $('<li><a href="javascript:void(0);"><label class="' + inputType + '"><input type="' + inputType + '" /></label></a></li>');

            var selected = $(element).prop('selected') || false;
            var $checkbox = $('input', $li);
            $checkbox.val(value);

            if (value == this.options.selectAllValue) {
                $checkbox.parent().parent().addClass('multiselect-all');
            }

            $('label', $li).append(" " + label);

            $('.multiselect-container', this.$container).append($li);

            if ($(element).is(':disabled')) {
                $checkbox.attr('disabled', 'disabled').prop('disabled', true).parents('li').addClass('disabled');
            }

            $checkbox.prop('checked', selected);

            if (selected && this.options.selectedClass) {
                $checkbox.parents('li').addClass(this.options.selectedClass);
            }
        },

        toggleActiveState: function (shouldBeActive) {
            if (this.$select.attr('disabled') == undefined) {
                $('button.multiselect.dropdown-toggle', this.$container).removeClass('disabled');
            }
            else {
                $('button.multiselect.dropdown-toggle', this.$container).addClass('disabled');
            }
        },

        // Add the select all option to the select.
        buildSelectAll: function () {
            var alreadyHasSelectAll = this.$select[0][0] ? this.$select[0][0].value == this.options.selectAllValue : false;

            // If options.includeSelectAllOption === true, add the include all checkbox.
            if (this.options.includeSelectAllOption && this.options.multiple && !alreadyHasSelectAll) {
                this.$select.prepend('<option value="' + this.options.selectAllValue + '">' + this.options.selectAllText + '</option>');
            }
        },

        // Build the dropdown and bind event handling.
        buildDropdown: function () {
            this.toggleActiveState();

            this.$select.children().each($.proxy(function (index, element) {
                // Support optgroups and options without a group simultaneously.
                var tag = $(element).prop('tagName').toLowerCase();
                if (tag == 'optgroup') {
                    var group = element;
                    var groupName = $(group).prop('label');

                    // Add a header for the group.
                    var $li = $('<li><label class="multiselect-group"></label></li>');
                    $('label', $li).text(groupName);
                    $('.multiselect-container', this.$container).append($li);

                    // Add the options of the group.
                    $('option', group).each($.proxy(function (index, element) {
                        this.createOptionValue(element);
                    }, this));
                }
                else
                    if (tag == 'option') {
                        this.createOptionValue(element);
                    }
                    else {
                        // Ignore illegal tags.
                    }
            }, this));

            // Bind the change event on the dropdown elements.
            $('.multiselect-container li input', this.$container).on('change', $.proxy(function (event) {
                var checked = $(event.target).prop('checked') || false;
                var isSelectAllOption = $(event.target).val() == this.options.selectAllValue;

                // Apply or unapply the configured selected class.
                if (this.options.selectedClass) {
                    if (checked) {
                        $(event.target).parents('li').addClass(this.options.selectedClass);
                    }
                    else {
                        $(event.target).parents('li').removeClass(this.options.selectedClass);
                    }
                }

                var $option = $('option', this.$select).filter(function () {
                    return $(this).val() == $(event.target).val();
                });

                var $optionsNotThis = $('option', this.$select).not($option);
                var $checkboxesNotThis = $('input', this.$container).not($(event.target));

                // Toggle all options if the select all option was changed.
                if (isSelectAllOption) {
                    $checkboxesNotThis.filter(function () {
                        return $(this).is(':checked') != checked;
                    }).trigger('click');
                }

                if (checked) {
                    $option.prop('selected', true);

                    if (this.options.multiple) {
                        $option.attr('selected', 'selected');
                    }
                    else {
                        if (this.options.selectedClass) {
                            $($checkboxesNotThis).parents('li').removeClass(this.options.selectedClass);
                        }

                        $($checkboxesNotThis).prop('checked', false);

                        $optionsNotThis.removeAttr('selected').prop('selected', false);

                        // It's a single selection, so close.
                        $(this.$container).find(".multiselect.dropdown-toggle").click();
                    }

                    if (this.options.selectedClass == "active") {
                        $optionsNotThis.parents("a").css("outline", "");
                    }

                }
                else {
                    $option.removeAttr('selected').prop('selected', false);
                }

                this.updateButtonText();

                this.options.onChange($option, checked);

                this.$select.change();

                if (this.options.preventInputChangeEvent) {
                    return false;
                }
            }, this));

            $('.multiselect-container li a', this.$container).on('touchstart click', function (event) {
                event.stopPropagation();
                $(event.target).blur();
            });

            // Keyboard support.
            this.$container.on('keydown', $.proxy(function (event) {
                if ($('input[type="text"]', this.$container).is(':focus'))
                    return;
                if ((event.keyCode == 9 || event.keyCode == 27) && this.$container.hasClass('open')) {
                    // Close on tab or escape.
                    $(this.$container).find(".multiselect.dropdown-toggle").click();
                }
                else {
                    var $items = $(this.$container).find("li:not(.divider):visible a");

                    if (!$items.length) {
                        return;
                    }

                    var index = $items.index($items.filter(':focus'));

                    // Navigation up.
                    if (event.keyCode == 38 && index > 0) {
                        index--;
                    }
                        // Navigate down.
                    else
                        if (event.keyCode == 40 && index < $items.length - 1) {
                            index++;
                        }
                        else
                            if (!~index) {
                                index = 0;
                            }

                    var $current = $items.eq(index);
                    $current.focus();

                    // Override style for items in li:active.
                    if (this.options.selectedClass == "active") {
                        $current.css("outline", "thin dotted #333").css("outline", "5px auto -webkit-focus-ring-color");

                        $items.not($current).css("outline", "");
                    }

                    if (event.keyCode == 32 || event.keyCode == 13) {
                        var $checkbox = $current.find('input');

                        $checkbox.prop("checked", !$checkbox.prop("checked"));
                        $checkbox.change();
                    }

                    event.stopPropagation();
                    event.preventDefault();
                }
            }, this));
        },

        // Build and bind filter.
        buildFilter: function () {
            $('.multiselect-container', this.$container).prepend('<div class="input-group"><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span><input class="form-control multiselect-search" type="text" placeholder="' + this.options.filterPlaceholder + '"></div>');

            $('.multiselect-search', this.$container).val(this.query).on('click', function (event) {
                event.stopPropagation();
            }).on('keydown', $.proxy(function (event) {
                // This is useful to catch "keydown" events after the browser has
                // updated the control.
                clearTimeout(this.searchTimeout);

                this.searchTimeout = this.asyncFunction($.proxy(function () {

                    if (this.query != event.target.value) {
                        this.query = event.target.value;

                        $.each($('.multiselect-container li', this.$container), $.proxy(function (index, element) {
                            var value = $('input', element).val();
                            if (value != this.options.selectAllValue) {
                                var text = $('label', element).text();
                                var value = $('input', element).val();
                                if (value && text && value != this.options.selectAllValue) {
                                    // by default lets assume that element is not
                                    // interesting for this search
                                    var showElement = false;

                                    var filterCandidate = '';
                                    if ((this.options.filterBehavior == 'text' || this.options.filterBehavior == 'both')) {
                                        filterCandidate = text;
                                    }
                                    if ((this.options.filterBehavior == 'value' || this.options.filterBehavior == 'both')) {
                                        filterCandidate = value;
                                    }

                                    if (this.options.enableCaseInsensitiveFiltering && filterCandidate.toLowerCase().indexOf(this.query.toLowerCase()) > -1) {
                                        showElement = true;
                                    }
                                    else if (filterCandidate.indexOf(this.query) > -1) {
                                        showElement = true;
                                    }

                                    if (showElement) {
                                        $(element).show();
                                    }
                                    else {
                                        $(element).hide();
                                    }
                                }
                            }
                        }, this));
                    }
                }, this), 300, this);
            }, this));
        },

        // Destroy - unbind - the plugin.
        destroy: function () {
            this.$container.remove();
            this.$select.show();
        },

        // Refreshs the checked options based on the current state of the select.
        refresh: function () {
            $('option', this.$select).each($.proxy(function (index, element) {
                var $input = $('.multiselect-container li input', this.$container).filter(function () {
                    return $(this).val() == $(element).val();
                });

                if ($(element).is(':selected')) {
                    $input.prop('checked', true);

                    if (this.options.selectedClass) {
                        $input.parents('li').addClass(this.options.selectedClass);
                    }
                }
                else {
                    $input.prop('checked', false);

                    if (this.options.selectedClass) {
                        $input.parents('li').removeClass(this.options.selectedClass);
                    }
                }

                if ($(element).is(":disabled")) {
                    $input.attr('disabled', 'disabled').prop('disabled', true).parents('li').addClass('disabled');
                }
                else {
                    $input.removeAttr('disabled').prop('disabled', false).parents('li').removeClass('disabled');
                }
            }, this));

            this.updateButtonText();
        },

        // Select an option by its value.
        select: function (selectValues) {
            if (selectValues && !$.isArray(selectValues)) {
                selectValues = [selectValues];
            }

            for (var i = 0; i < selectValues.length; i++) {
                var value = selectValues[i];

                var $option = $('option', this.$select).filter(function () {
                    return $(this).val() == value;
                });
                var $checkbox = $('.multiselect-container li input', this.$container).filter(function () {
                    return $(this).val() == value;
                });

                if (this.options.selectedClass) {
                    $checkbox.parents('li').addClass(this.options.selectedClass);
                }

                $checkbox.prop('checked', true);

                $option.attr('selected', 'selected').prop('selected', true);
                this.options.onChange($option, true);
            }

            this.updateButtonText();
        },

        // Deselect an option by its value.
        deselect: function (deselectValues) {
            if (deselectValues && !$.isArray(deselectValues)) {
                deselectValues = [deselectValues];
            }

            for (var i = 0; i < deselectValues.length; i++) {
                var value = deselectValues[i];

                var $option = $('option', this.$select).filter(function () {
                    return $(this).val() == value;
                });
                var $checkbox = $('.multiselect-container li input', this.$container).filter(function () {
                    return $(this).val() == value;
                });

                if (this.options.selectedClass) {
                    $checkbox.parents('li').removeClass(this.options.selectedClass);
                }

                $checkbox.prop('checked', false);

                $option.removeAttr('selected').prop('selected', false);
                this.options.onChange($option, false);
            }

            this.updateButtonText();
        },

        // Rebuild the whole dropdown menu.
        rebuild: function () {
            $('.multiselect-container', this.$container).html('');

            this.buildSelectAll();
            this.buildDropdown(this.$select, this.options);
            this.updateButtonText();

            // Enable filtering.
            if (this.options.enableFiltering || this.options.enableCaseInsensitiveFiltering) {
                this.buildFilter();
            }
        },

        // Build select using the given data as options.
        dataprovider: function (dataprovider) {
            var optionDOM = "";

            dataprovider.forEach(function (option) {
                optionDOM += '<option value="' + option.value + '">' + option.label + '</option>';
            });

            this.$select.html(optionDOM);
            this.rebuild();
        },

        // Get options by merging defaults and given options.
        getOptions: function (options) {
            return $.extend({}, this.defaults, options);
        },

        updateButtonText: function () {
            var options = this.getSelected();

            // First update the displayed button text.
            $('button', this.$container).html(this.options.buttonText(options, this.$select));

            // Now update the title attribute of the button.
            $('button', this.$container).attr('title', this.options.buttonTitle(options, this.$select));

        },

        // Get all selected options.
        getSelected: function () {
            return $('option:selected[value!="' + this.options.selectAllValue + '"]', this.$select);
        },

        updateOriginalOptions: function () {
            this.originalOptions = this.$select.clone()[0].options;
        },

        asyncFunction: function (callback, timeout, self) {
            var args = Array.prototype.slice.call(arguments, 3);
            return setTimeout(function () {
                callback.apply(self || window, args);
            }, timeout);
        }
    };

    $.fn.multiselect = function (option, parameter) {
        return this.each(function () {
            var data = $(this).data('multiselect'), options = typeof option == 'object' && option;

            // Initialize the multiselect.
            if (!data) {
                $(this).data('multiselect', (data = new Multiselect(this, options)));
            }

            // Call multiselect method.
            if (typeof option == 'string') {
                data[option](parameter);
            }
        });
    };

    $.fn.multiselect.Constructor = Multiselect;

    $(function () {
        $("select[data-role=multiselect]").multiselect();
    });

}(window.jQuery);

/*!
 * fancyBox - jQuery Plugin
 * version: 2.1.5 (Fri, 14 Jun 2013)
 * @requires jQuery v1.6 or later
 *
 * Examples at http://fancyapps.com/fancybox/
 * License: www.fancyapps.com/fancybox/#license
 *
 * Copyright 2012 Janis Skarnelis - janis@fancyapps.com
 *
 */

(function (window, document, $, undefined) {
    "use strict";

    var H = $("html"),
		W = $(window),
		D = $(document),
		F = $.fancybox = function () {
		    F.open.apply(this, arguments);
		},
		IE = navigator.userAgent.match(/msie/i),
		didUpdate = null,
		isTouch = document.createTouch !== undefined,

		isQuery = function (obj) {
		    return obj && obj.hasOwnProperty && obj instanceof $;
		},
		isString = function (str) {
		    return str && $.type(str) === "string";
		},
		isPercentage = function (str) {
		    return isString(str) && str.indexOf('%') > 0;
		},
		isScrollable = function (el) {
		    return (el && !(el.style.overflow && el.style.overflow === 'hidden') && ((el.clientWidth && el.scrollWidth > el.clientWidth) || (el.clientHeight && el.scrollHeight > el.clientHeight)));
		},
		getScalar = function (orig, dim) {
		    var value = parseInt(orig, 10) || 0;

		    if (dim && isPercentage(orig)) {
		        value = F.getViewport()[dim] / 100 * value;
		    }

		    return Math.ceil(value);
		},
		getValue = function (value, dim) {
		    return getScalar(value, dim) + 'px';
		};

    $.extend(F, {
        // The current version of fancyBox
        version: '2.1.5',

        defaults: {
            padding: 15,
            margin: 20,

            width: 800,
            height: 600,
            minWidth: 100,
            minHeight: 100,
            maxWidth: 9999,
            maxHeight: 9999,
            pixelRatio: 1, // Set to 2 for retina display support

            autoSize: true,
            autoHeight: false,
            autoWidth: false,

            autoResize: true,
            autoCenter: !isTouch,
            fitToView: true,
            aspectRatio: false,
            topRatio: 0.5,
            leftRatio: 0.5,

            scrolling: 'auto', // 'auto', 'yes' or 'no'
            wrapCSS: '',

            arrows: true,
            closeBtn: true,
            closeClick: false,
            nextClick: false,
            mouseWheel: true,
            autoPlay: false,
            playSpeed: 3000,
            preload: 3,
            modal: false,
            loop: true,

            ajax: {
                dataType: 'html',
                headers: { 'X-fancyBox': true }
            },
            iframe: {
                scrolling: 'auto',
                preload: true
            },
            swf: {
                wmode: 'transparent',
                allowfullscreen: 'true',
                allowscriptaccess: 'always'
            },

            keys: {
                next: {
                    13: 'left', // enter
                    34: 'up',   // page down
                    39: 'left', // right arrow
                    40: 'up'    // down arrow
                },
                prev: {
                    8: 'right',  // backspace
                    33: 'down',   // page up
                    37: 'right',  // left arrow
                    38: 'down'    // up arrow
                },
                close: [27], // escape key
                play: [32], // space - start/stop slideshow
                toggle: [70]  // letter "f" - toggle fullscreen
            },

            direction: {
                next: 'left',
                prev: 'right'
            },

            scrollOutside: true,

            // Override some properties
            index: 0,
            type: null,
            href: null,
            content: null,
            title: null,

            // HTML templates
            tpl: {
                wrap: '<div class="fancybox-wrap" tabIndex="-1"><div class="fancybox-skin"><div class="fancybox-outer"><div class="fancybox-inner"></div></div></div></div>',
                image: '<img class="fancybox-image" src="{href}" alt="" />',
                iframe: '<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen' + (IE ? ' allowtransparency="true"' : '') + '></iframe>',
                error: '<p class="fancybox-error">The requested content cannot be loaded.<br/>Please try again later.</p>',
                closeBtn: '<a title="Close" class="fancybox-item fancybox-close" href="javascript:;"></a>',
                next: '<a title="Next" class="fancybox-nav fancybox-next" href="javascript:;"><span></span></a>',
                prev: '<a title="Previous" class="fancybox-nav fancybox-prev" href="javascript:;"><span></span></a>'
            },

            // Properties for each animation type
            // Opening fancyBox
            openEffect: 'fade', // 'elastic', 'fade' or 'none'
            openSpeed: 250,
            openEasing: 'swing',
            openOpacity: true,
            openMethod: 'zoomIn',

            // Closing fancyBox
            closeEffect: 'fade', // 'elastic', 'fade' or 'none'
            closeSpeed: 250,
            closeEasing: 'swing',
            closeOpacity: true,
            closeMethod: 'zoomOut',

            // Changing next gallery item
            nextEffect: 'elastic', // 'elastic', 'fade' or 'none'
            nextSpeed: 250,
            nextEasing: 'swing',
            nextMethod: 'changeIn',

            // Changing previous gallery item
            prevEffect: 'elastic', // 'elastic', 'fade' or 'none'
            prevSpeed: 250,
            prevEasing: 'swing',
            prevMethod: 'changeOut',

            // Enable default helpers
            helpers: {
                overlay: true,
                title: true
            },

            // Callbacks
            onCancel: $.noop, // If canceling
            beforeLoad: $.noop, // Before loading
            afterLoad: $.noop, // After loading
            beforeShow: $.noop, // Before changing in current item
            afterShow: $.noop, // After opening
            beforeChange: $.noop, // Before changing gallery item
            beforeClose: $.noop, // Before closing
            afterClose: $.noop  // After closing
        },

        //Current state
        group: {}, // Selected group
        opts: {}, // Group options
        previous: null,  // Previous element
        coming: null,  // Element being loaded
        current: null,  // Currently loaded element
        isActive: false, // Is activated
        isOpen: false, // Is currently open
        isOpened: false, // Have been fully opened at least once

        wrap: null,
        skin: null,
        outer: null,
        inner: null,

        player: {
            timer: null,
            isActive: false
        },

        // Loaders
        ajaxLoad: null,
        imgPreload: null,

        // Some collections
        transitions: {},
        helpers: {},

        /*
		 *	Static methods
		 */

        open: function (group, opts) {
            if (!group) {
                return;
            }

            if (!$.isPlainObject(opts)) {
                opts = {};
            }

            // Close if already active
            if (false === F.close(true)) {
                return;
            }

            // Normalize group
            if (!$.isArray(group)) {
                group = isQuery(group) ? $(group).get() : [group];
            }

            // Recheck if the type of each element is `object` and set content type (image, ajax, etc)
            $.each(group, function (i, element) {
                var obj = {},
					href,
					title,
					content,
					type,
					rez,
					hrefParts,
					selector;

                if ($.type(element) === "object") {
                    // Check if is DOM element
                    if (element.nodeType) {
                        element = $(element);
                    }

                    if (isQuery(element)) {
                        obj = {
                            href: element.data('fancybox-href') || element.attr('href'),
                            title: element.data('fancybox-title') || element.attr('title'),
                            isDom: true,
                            element: element
                        };

                        if ($.metadata) {
                            $.extend(true, obj, element.metadata());
                        }

                    } else {
                        obj = element;
                    }
                }

                href = opts.href || obj.href || (isString(element) ? element : null);
                title = opts.title !== undefined ? opts.title : obj.title || '';

                content = opts.content || obj.content;
                type = content ? 'html' : (opts.type || obj.type);

                if (!type && obj.isDom) {
                    type = element.data('fancybox-type');

                    if (!type) {
                        rez = element.prop('class').match(/fancybox\.(\w+)/);
                        type = rez ? rez[1] : null;
                    }
                }

                if (isString(href)) {
                    // Try to guess the content type
                    if (!type) {
                        if (F.isImage(href)) {
                            type = 'image';

                        } else if (F.isSWF(href)) {
                            type = 'swf';

                        } else if (href.charAt(0) === '#') {
                            type = 'inline';

                        } else if (isString(element)) {
                            type = 'html';
                            content = element;
                        }
                    }

                    // Split url into two pieces with source url and content selector, e.g,
                    // "/mypage.html #my_id" will load "/mypage.html" and display element having id "my_id"
                    if (type === 'ajax') {
                        hrefParts = href.split(/\s+/, 2);
                        href = hrefParts.shift();
                        selector = hrefParts.shift();
                    }
                }

                if (!content) {
                    if (type === 'inline') {
                        if (href) {
                            content = $(isString(href) ? href.replace(/.*(?=#[^\s]+$)/, '') : href); //strip for ie7

                        } else if (obj.isDom) {
                            content = element;
                        }

                    } else if (type === 'html') {
                        content = href;

                    } else if (!type && !href && obj.isDom) {
                        type = 'inline';
                        content = element;
                    }
                }

                $.extend(obj, {
                    href: href,
                    type: type,
                    content: content,
                    title: title,
                    selector: selector
                });

                group[i] = obj;
            });

            // Extend the defaults
            F.opts = $.extend(true, {}, F.defaults, opts);

            // All options are merged recursive except keys
            if (opts.keys !== undefined) {
                F.opts.keys = opts.keys ? $.extend({}, F.defaults.keys, opts.keys) : false;
            }

            F.group = group;

            return F._start(F.opts.index);
        },

        // Cancel image loading or abort ajax request
        cancel: function () {
            var coming = F.coming;

            if (!coming || false === F.trigger('onCancel')) {
                return;
            }

            F.hideLoading();

            if (F.ajaxLoad) {
                F.ajaxLoad.abort();
            }

            F.ajaxLoad = null;

            if (F.imgPreload) {
                F.imgPreload.onload = F.imgPreload.onerror = null;
            }

            if (coming.wrap) {
                coming.wrap.stop(true, true).trigger('onReset').remove();
            }

            F.coming = null;

            // If the first item has been canceled, then clear everything
            if (!F.current) {
                F._afterZoomOut(coming);
            }
        },

        // Start closing animation if is open; remove immediately if opening/closing
        close: function (event) {
            F.cancel();

            if (false === F.trigger('beforeClose')) {
                return;
            }

            F.unbindEvents();

            if (!F.isActive) {
                return;
            }

            if (!F.isOpen || event === true) {
                $('.fancybox-wrap').stop(true).trigger('onReset').remove();

                F._afterZoomOut();

            } else {
                F.isOpen = F.isOpened = false;
                F.isClosing = true;

                $('.fancybox-item, .fancybox-nav').remove();

                F.wrap.stop(true, true).removeClass('fancybox-opened');

                F.transitions[F.current.closeMethod]();
            }
        },

        // Manage slideshow:
        //   $.fancybox.play(); - toggle slideshow
        //   $.fancybox.play( true ); - start
        //   $.fancybox.play( false ); - stop
        play: function (action) {
            var clear = function () {
                clearTimeout(F.player.timer);
            },
				set = function () {
				    clear();

				    if (F.current && F.player.isActive) {
				        F.player.timer = setTimeout(F.next, F.current.playSpeed);
				    }
				},
				stop = function () {
				    clear();

				    D.unbind('.player');

				    F.player.isActive = false;

				    F.trigger('onPlayEnd');
				},
				start = function () {
				    if (F.current && (F.current.loop || F.current.index < F.group.length - 1)) {
				        F.player.isActive = true;

				        D.bind({
				            'onCancel.player beforeClose.player': stop,
				            'onUpdate.player': set,
				            'beforeLoad.player': clear
				        });

				        set();

				        F.trigger('onPlayStart');
				    }
				};

            if (action === true || (!F.player.isActive && action !== false)) {
                start();
            } else {
                stop();
            }
        },

        // Navigate to next gallery item
        next: function (direction) {
            var current = F.current;

            if (current) {
                if (!isString(direction)) {
                    direction = current.direction.next;
                }

                F.jumpto(current.index + 1, direction, 'next');
            }
        },

        // Navigate to previous gallery item
        prev: function (direction) {
            var current = F.current;

            if (current) {
                if (!isString(direction)) {
                    direction = current.direction.prev;
                }

                F.jumpto(current.index - 1, direction, 'prev');
            }
        },

        // Navigate to gallery item by index
        jumpto: function (index, direction, router) {
            var current = F.current;

            if (!current) {
                return;
            }

            index = getScalar(index);

            F.direction = direction || current.direction[(index >= current.index ? 'next' : 'prev')];
            F.router = router || 'jumpto';

            if (current.loop) {
                if (index < 0) {
                    index = current.group.length + (index % current.group.length);
                }

                index = index % current.group.length;
            }

            if (current.group[index] !== undefined) {
                F.cancel();

                F._start(index);
            }
        },

        // Center inside viewport and toggle position type to fixed or absolute if needed
        reposition: function (e, onlyAbsolute) {
            var current = F.current,
				wrap = current ? current.wrap : null,
				pos;

            if (wrap) {
                pos = F._getPosition(onlyAbsolute);

                if (e && e.type === 'scroll') {
                    delete pos.position;

                    wrap.stop(true, true).animate(pos, 200);

                } else {
                    wrap.css(pos);

                    current.pos = $.extend({}, current.dim, pos);
                }
            }
        },

        update: function (e) {
            var type = (e && e.type),
				anyway = !type || type === 'orientationchange';

            if (anyway) {
                clearTimeout(didUpdate);

                didUpdate = null;
            }

            if (!F.isOpen || didUpdate) {
                return;
            }

            didUpdate = setTimeout(function () {
                var current = F.current;

                if (!current || F.isClosing) {
                    return;
                }

                F.wrap.removeClass('fancybox-tmp');

                if (anyway || type === 'load' || (type === 'resize' && current.autoResize)) {
                    F._setDimension();
                }

                if (!(type === 'scroll' && current.canShrink)) {
                    F.reposition(e);
                }

                F.trigger('onUpdate');

                didUpdate = null;

            }, (anyway && !isTouch ? 0 : 300));
        },

        // Shrink content to fit inside viewport or restore if resized
        toggle: function (action) {
            if (F.isOpen) {
                F.current.fitToView = $.type(action) === "boolean" ? action : !F.current.fitToView;

                // Help browser to restore document dimensions
                if (isTouch) {
                    F.wrap.removeAttr('style').addClass('fancybox-tmp');

                    F.trigger('onUpdate');
                }

                F.update();
            }
        },

        hideLoading: function () {
            D.unbind('.loading');

            $('#fancybox-loading').remove();
        },

        showLoading: function () {
            var el, viewport;

            F.hideLoading();

            el = $('<div id="fancybox-loading"><div></div></div>').click(F.cancel).appendTo('body');

            // If user will press the escape-button, the request will be canceled
            D.bind('keydown.loading', function (e) {
                if ((e.which || e.keyCode) === 27) {
                    e.preventDefault();

                    F.cancel();
                }
            });

            if (!F.defaults.fixed) {
                viewport = F.getViewport();

                el.css({
                    position: 'absolute',
                    top: (viewport.h * 0.5) + viewport.y,
                    left: (viewport.w * 0.5) + viewport.x
                });
            }
        },

        getViewport: function () {
            var locked = (F.current && F.current.locked) || false,
				rez = {
				    x: W.scrollLeft(),
				    y: W.scrollTop()
				};

            if (locked) {
                rez.w = locked[0].clientWidth;
                rez.h = locked[0].clientHeight;

            } else {
                // See http://bugs.jquery.com/ticket/6724
                rez.w = isTouch && window.innerWidth ? window.innerWidth : W.width();
                rez.h = isTouch && window.innerHeight ? window.innerHeight : W.height();
            }

            return rez;
        },

        // Unbind the keyboard / clicking actions
        unbindEvents: function () {
            if (F.wrap && isQuery(F.wrap)) {
                F.wrap.unbind('.fb');
            }

            D.unbind('.fb');
            W.unbind('.fb');
        },

        bindEvents: function () {
            var current = F.current,
				keys;

            if (!current) {
                return;
            }

            // Changing document height on iOS devices triggers a 'resize' event,
            // that can change document height... repeating infinitely
            W.bind('orientationchange.fb' + (isTouch ? '' : ' resize.fb') + (current.autoCenter && !current.locked ? ' scroll.fb' : ''), F.update);

            keys = current.keys;

            if (keys) {
                D.bind('keydown.fb', function (e) {
                    var code = e.which || e.keyCode,
						target = e.target || e.srcElement;

                    // Skip esc key if loading, because showLoading will cancel preloading
                    if (code === 27 && F.coming) {
                        return false;
                    }

                    // Ignore key combinations and key events within form elements
                    if (!e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey && !(target && (target.type || $(target).is('[contenteditable]')))) {
                        $.each(keys, function (i, val) {
                            if (current.group.length > 1 && val[code] !== undefined) {
                                F[i](val[code]);

                                e.preventDefault();
                                return false;
                            }

                            if ($.inArray(code, val) > -1) {
                                F[i]();

                                e.preventDefault();
                                return false;
                            }
                        });
                    }
                });
            }

            if ($.fn.mousewheel && current.mouseWheel) {
                F.wrap.bind('mousewheel.fb', function (e, delta, deltaX, deltaY) {
                    var target = e.target || null,
						parent = $(target),
						canScroll = false;

                    while (parent.length) {
                        if (canScroll || parent.is('.fancybox-skin') || parent.is('.fancybox-wrap')) {
                            break;
                        }

                        canScroll = isScrollable(parent[0]);
                        parent = $(parent).parent();
                    }

                    if (delta !== 0 && !canScroll) {
                        if (F.group.length > 1 && !current.canShrink) {
                            if (deltaY > 0 || deltaX > 0) {
                                F.prev(deltaY > 0 ? 'down' : 'left');

                            } else if (deltaY < 0 || deltaX < 0) {
                                F.next(deltaY < 0 ? 'up' : 'right');
                            }

                            e.preventDefault();
                        }
                    }
                });
            }
        },

        trigger: function (event, o) {
            var ret, obj = o || F.coming || F.current;

            if (!obj) {
                return;
            }

            if ($.isFunction(obj[event])) {
                ret = obj[event].apply(obj, Array.prototype.slice.call(arguments, 1));
            }

            if (ret === false) {
                return false;
            }

            if (obj.helpers) {
                $.each(obj.helpers, function (helper, opts) {
                    if (opts && F.helpers[helper] && $.isFunction(F.helpers[helper][event])) {
                        F.helpers[helper][event]($.extend(true, {}, F.helpers[helper].defaults, opts), obj);
                    }
                });
            }

            D.trigger(event);
        },

        isImage: function (str) {
            return isString(str) && str.match(/(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg)((\?|#).*)?$)/i);
        },

        isSWF: function (str) {
            return isString(str) && str.match(/\.(swf)((\?|#).*)?$/i);
        },

        _start: function (index) {
            var coming = {},
				obj,
				href,
				type,
				margin,
				padding;

            index = getScalar(index);
            obj = F.group[index] || null;

            if (!obj) {
                return false;
            }

            coming = $.extend(true, {}, F.opts, obj);

            // Convert margin and padding properties to array - top, right, bottom, left
            margin = coming.margin;
            padding = coming.padding;

            if ($.type(margin) === 'number') {
                coming.margin = [margin, margin, margin, margin];
            }

            if ($.type(padding) === 'number') {
                coming.padding = [padding, padding, padding, padding];
            }

            // 'modal' propery is just a shortcut
            if (coming.modal) {
                $.extend(true, coming, {
                    closeBtn: false,
                    closeClick: false,
                    nextClick: false,
                    arrows: false,
                    mouseWheel: false,
                    keys: null,
                    helpers: {
                        overlay: {
                            closeClick: false
                        }
                    }
                });
            }

            // 'autoSize' property is a shortcut, too
            if (coming.autoSize) {
                coming.autoWidth = coming.autoHeight = true;
            }

            if (coming.width === 'auto') {
                coming.autoWidth = true;
            }

            if (coming.height === 'auto') {
                coming.autoHeight = true;
            }

            /*
			 * Add reference to the group, so it`s possible to access from callbacks, example:
			 * afterLoad : function() {
			 *     this.title = 'Image ' + (this.index + 1) + ' of ' + this.group.length + (this.title ? ' - ' + this.title : '');
			 * }
			 */

            coming.group = F.group;
            coming.index = index;

            // Give a chance for callback or helpers to update coming item (type, title, etc)
            F.coming = coming;

            if (false === F.trigger('beforeLoad')) {
                F.coming = null;

                return;
            }

            type = coming.type;
            href = coming.href;

            if (!type) {
                F.coming = null;

                //If we can not determine content type then drop silently or display next/prev item if looping through gallery
                if (F.current && F.router && F.router !== 'jumpto') {
                    F.current.index = index;

                    return F[F.router](F.direction);
                }

                return false;
            }

            F.isActive = true;

            if (type === 'image' || type === 'swf') {
                coming.autoHeight = coming.autoWidth = false;
                coming.scrolling = 'visible';
            }

            if (type === 'image') {
                coming.aspectRatio = true;
            }

            if (type === 'iframe' && isTouch) {
                coming.scrolling = 'scroll';
            }

            // Build the neccessary markup
            coming.wrap = $(coming.tpl.wrap).addClass('fancybox-' + (isTouch ? 'mobile' : 'desktop') + ' fancybox-type-' + type + ' fancybox-tmp ' + coming.wrapCSS).appendTo(coming.parent || 'body');

            $.extend(coming, {
                skin: $('.fancybox-skin', coming.wrap),
                outer: $('.fancybox-outer', coming.wrap),
                inner: $('.fancybox-inner', coming.wrap)
            });

            $.each(["Top", "Right", "Bottom", "Left"], function (i, v) {
                coming.skin.css('padding' + v, getValue(coming.padding[i]));
            });

            F.trigger('onReady');

            // Check before try to load; 'inline' and 'html' types need content, others - href
            if (type === 'inline' || type === 'html') {
                if (!coming.content || !coming.content.length) {
                    return F._error('content');
                }

            } else if (!href) {
                return F._error('href');
            }

            if (type === 'image') {
                F._loadImage();

            } else if (type === 'ajax') {
                F._loadAjax();

            } else if (type === 'iframe') {
                F._loadIframe();

            } else {
                F._afterLoad();
            }
        },

        _error: function (type) {
            $.extend(F.coming, {
                type: 'html',
                autoWidth: true,
                autoHeight: true,
                minWidth: 0,
                minHeight: 0,
                scrolling: 'no',
                hasError: type,
                content: F.coming.tpl.error
            });

            F._afterLoad();
        },

        _loadImage: function () {
            // Reset preload image so it is later possible to check "complete" property
            var img = F.imgPreload = new Image();

            img.onload = function () {
                this.onload = this.onerror = null;

                F.coming.width = this.width / F.opts.pixelRatio;
                F.coming.height = this.height / F.opts.pixelRatio;

                F._afterLoad();
            };

            img.onerror = function () {
                this.onload = this.onerror = null;

                F._error('image');
            };

            img.src = F.coming.href;

            if (img.complete !== true) {
                F.showLoading();
            }
        },

        _loadAjax: function () {
            var coming = F.coming;

            F.showLoading();

            F.ajaxLoad = $.ajax($.extend({}, coming.ajax, {
                url: coming.href,
                error: function (jqXHR, textStatus) {
                    if (F.coming && textStatus !== 'abort') {
                        F._error('ajax', jqXHR);

                    } else {
                        F.hideLoading();
                    }
                },
                success: function (data, textStatus) {
                    if (textStatus === 'success') {
                        coming.content = data;

                        F._afterLoad();
                    }
                }
            }));
        },

        _loadIframe: function () {
            var coming = F.coming,
				iframe = $(coming.tpl.iframe.replace(/\{rnd\}/g, new Date().getTime()))
					.attr('scrolling', isTouch ? 'auto' : coming.iframe.scrolling)
					.attr('src', coming.href);

            // This helps IE
            $(coming.wrap).bind('onReset', function () {
                try {
                    $(this).find('iframe').hide().attr('src', '//about:blank').end().empty();
                } catch (e) { }
            });

            if (coming.iframe.preload) {
                F.showLoading();

                iframe.one('load', function () {
                    $(this).data('ready', 1);

                    // iOS will lose scrolling if we resize
                    if (!isTouch) {
                        $(this).bind('load.fb', F.update);
                    }

                    // Without this trick:
                    //   - iframe won't scroll on iOS devices
                    //   - IE7 sometimes displays empty iframe
                    $(this).parents('.fancybox-wrap').width('100%').removeClass('fancybox-tmp').show();

                    F._afterLoad();
                });
            }

            coming.content = iframe.appendTo(coming.inner);

            if (!coming.iframe.preload) {
                F._afterLoad();
            }
        },

        _preloadImages: function () {
            var group = F.group,
				current = F.current,
				len = group.length,
				cnt = current.preload ? Math.min(current.preload, len - 1) : 0,
				item,
				i;

            for (i = 1; i <= cnt; i += 1) {
                item = group[(current.index + i) % len];

                if (item.type === 'image' && item.href) {
                    new Image().src = item.href;
                }
            }
        },

        _afterLoad: function () {
            var coming = F.coming,
				previous = F.current,
				placeholder = 'fancybox-placeholder',
				current,
				content,
				type,
				scrolling,
				href,
				embed;

            F.hideLoading();

            if (!coming || F.isActive === false) {
                return;
            }

            if (false === F.trigger('afterLoad', coming, previous)) {
                coming.wrap.stop(true).trigger('onReset').remove();

                F.coming = null;

                return;
            }

            if (previous) {
                F.trigger('beforeChange', previous);

                previous.wrap.stop(true).removeClass('fancybox-opened')
					.find('.fancybox-item, .fancybox-nav')
					.remove();
            }

            F.unbindEvents();

            current = coming;
            content = coming.content;
            type = coming.type;
            scrolling = coming.scrolling;

            $.extend(F, {
                wrap: current.wrap,
                skin: current.skin,
                outer: current.outer,
                inner: current.inner,
                current: current,
                previous: previous
            });

            href = current.href;

            switch (type) {
                case 'inline':
                case 'ajax':
                case 'html':
                    if (current.selector) {
                        content = $('<div>').html(content).find(current.selector);

                    } else if (isQuery(content)) {
                        if (!content.data(placeholder)) {
                            content.data(placeholder, $('<div class="' + placeholder + '"></div>').insertAfter(content).hide());
                        }

                        content = content.show().detach();

                        current.wrap.bind('onReset', function () {
                            if ($(this).find(content).length) {
                                content.hide().replaceAll(content.data(placeholder)).data(placeholder, false);
                            }
                        });
                    }
                    break;

                case 'image':
                    content = current.tpl.image.replace('{href}', href);
                    break;

                case 'swf':
                    content = '<object id="fancybox-swf" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="100%" height="100%"><param name="movie" value="' + href + '"></param>';
                    embed = '';

                    $.each(current.swf, function (name, val) {
                        content += '<param name="' + name + '" value="' + val + '"></param>';
                        embed += ' ' + name + '="' + val + '"';
                    });

                    content += '<embed src="' + href + '" type="application/x-shockwave-flash" width="100%" height="100%"' + embed + '></embed></object>';
                    break;
            }

            if (!(isQuery(content) && content.parent().is(current.inner))) {
                current.inner.append(content);
            }

            // Give a chance for helpers or callbacks to update elements
            F.trigger('beforeShow');

            // Set scrolling before calculating dimensions
            current.inner.css('overflow', scrolling === 'yes' ? 'scroll' : (scrolling === 'no' ? 'hidden' : scrolling));

            // Set initial dimensions and start position
            F._setDimension();

            F.reposition();

            F.isOpen = false;
            F.coming = null;

            F.bindEvents();

            if (!F.isOpened) {
                $('.fancybox-wrap').not(current.wrap).stop(true).trigger('onReset').remove();

            } else if (previous.prevMethod) {
                F.transitions[previous.prevMethod]();
            }

            F.transitions[F.isOpened ? current.nextMethod : current.openMethod]();

            F._preloadImages();
        },

        _setDimension: function () {
            var viewport = F.getViewport(),
				steps = 0,
				canShrink = false,
				canExpand = false,
				wrap = F.wrap,
				skin = F.skin,
				inner = F.inner,
				current = F.current,
				width = current.width,
				height = current.height,
				minWidth = current.minWidth,
				minHeight = current.minHeight,
				maxWidth = current.maxWidth,
				maxHeight = current.maxHeight,
				scrolling = current.scrolling,
				scrollOut = current.scrollOutside ? current.scrollbarWidth : 0,
				margin = current.margin,
				wMargin = getScalar(margin[1] + margin[3]),
				hMargin = getScalar(margin[0] + margin[2]),
				wPadding,
				hPadding,
				wSpace,
				hSpace,
				origWidth,
				origHeight,
				origMaxWidth,
				origMaxHeight,
				ratio,
				width_,
				height_,
				maxWidth_,
				maxHeight_,
				iframe,
				body;

            // Reset dimensions so we could re-check actual size
            wrap.add(skin).add(inner).width('auto').height('auto').removeClass('fancybox-tmp');

            wPadding = getScalar(skin.outerWidth(true) - skin.width());
            hPadding = getScalar(skin.outerHeight(true) - skin.height());

            // Any space between content and viewport (margin, padding, border, title)
            wSpace = wMargin + wPadding;
            hSpace = hMargin + hPadding;

            origWidth = isPercentage(width) ? (viewport.w - wSpace) * getScalar(width) / 100 : width;
            origHeight = isPercentage(height) ? (viewport.h - hSpace) * getScalar(height) / 100 : height;

            if (current.type === 'iframe') {
                iframe = current.content;

                if (current.autoHeight && iframe.data('ready') === 1) {
                    try {
                        if (iframe[0].contentWindow.document.location) {
                            inner.width(origWidth).height(9999);

                            body = iframe.contents().find('body');

                            if (scrollOut) {
                                body.css('overflow-x', 'hidden');
                            }

                            origHeight = body.outerHeight(true);
                        }

                    } catch (e) { }
                }

            } else if (current.autoWidth || current.autoHeight) {
                inner.addClass('fancybox-tmp');

                // Set width or height in case we need to calculate only one dimension
                if (!current.autoWidth) {
                    inner.width(origWidth);
                }

                if (!current.autoHeight) {
                    inner.height(origHeight);
                }

                if (current.autoWidth) {
                    origWidth = inner.width();
                }

                if (current.autoHeight) {
                    origHeight = inner.height();
                }

                inner.removeClass('fancybox-tmp');
            }

            width = getScalar(origWidth);
            height = getScalar(origHeight);

            ratio = origWidth / origHeight;

            // Calculations for the content
            minWidth = getScalar(isPercentage(minWidth) ? getScalar(minWidth, 'w') - wSpace : minWidth);
            maxWidth = getScalar(isPercentage(maxWidth) ? getScalar(maxWidth, 'w') - wSpace : maxWidth);

            minHeight = getScalar(isPercentage(minHeight) ? getScalar(minHeight, 'h') - hSpace : minHeight);
            maxHeight = getScalar(isPercentage(maxHeight) ? getScalar(maxHeight, 'h') - hSpace : maxHeight);

            // These will be used to determine if wrap can fit in the viewport
            origMaxWidth = maxWidth;
            origMaxHeight = maxHeight;

            if (current.fitToView) {
                maxWidth = Math.min(viewport.w - wSpace, maxWidth);
                maxHeight = Math.min(viewport.h - hSpace, maxHeight);
            }

            maxWidth_ = viewport.w - wMargin;
            maxHeight_ = viewport.h - hMargin;

            if (current.aspectRatio) {
                if (width > maxWidth) {
                    width = maxWidth;
                    height = getScalar(width / ratio);
                }

                if (height > maxHeight) {
                    height = maxHeight;
                    width = getScalar(height * ratio);
                }

                if (width < minWidth) {
                    width = minWidth;
                    height = getScalar(width / ratio);
                }

                if (height < minHeight) {
                    height = minHeight;
                    width = getScalar(height * ratio);
                }

            } else {
                width = Math.max(minWidth, Math.min(width, maxWidth));

                if (current.autoHeight && current.type !== 'iframe') {
                    inner.width(width);

                    height = inner.height();
                }

                height = Math.max(minHeight, Math.min(height, maxHeight));
            }

            // Try to fit inside viewport (including the title)
            if (current.fitToView) {
                inner.width(width).height(height);

                wrap.width(width + wPadding);

                // Real wrap dimensions
                width_ = wrap.width();
                height_ = wrap.height();

                if (current.aspectRatio) {
                    while ((width_ > maxWidth_ || height_ > maxHeight_) && width > minWidth && height > minHeight) {
                        if (steps++ > 19) {
                            break;
                        }

                        height = Math.max(minHeight, Math.min(maxHeight, height - 10));
                        width = getScalar(height * ratio);

                        if (width < minWidth) {
                            width = minWidth;
                            height = getScalar(width / ratio);
                        }

                        if (width > maxWidth) {
                            width = maxWidth;
                            height = getScalar(width / ratio);
                        }

                        inner.width(width).height(height);

                        wrap.width(width + wPadding);

                        width_ = wrap.width();
                        height_ = wrap.height();
                    }

                } else {
                    width = Math.max(minWidth, Math.min(width, width - (width_ - maxWidth_)));
                    height = Math.max(minHeight, Math.min(height, height - (height_ - maxHeight_)));
                }
            }

            if (scrollOut && scrolling === 'auto' && height < origHeight && (width + wPadding + scrollOut) < maxWidth_) {
                width += scrollOut;
            }

            inner.width(width).height(height);

            wrap.width(width + wPadding);

            width_ = wrap.width();
            height_ = wrap.height();

            canShrink = (width_ > maxWidth_ || height_ > maxHeight_) && width > minWidth && height > minHeight;
            canExpand = current.aspectRatio ? (width < origMaxWidth && height < origMaxHeight && width < origWidth && height < origHeight) : ((width < origMaxWidth || height < origMaxHeight) && (width < origWidth || height < origHeight));

            $.extend(current, {
                dim: {
                    width: getValue(width_),
                    height: getValue(height_)
                },
                origWidth: origWidth,
                origHeight: origHeight,
                canShrink: canShrink,
                canExpand: canExpand,
                wPadding: wPadding,
                hPadding: hPadding,
                wrapSpace: height_ - skin.outerHeight(true),
                skinSpace: skin.height() - height
            });

            if (!iframe && current.autoHeight && height > minHeight && height < maxHeight && !canExpand) {
                inner.height('auto');
            }
        },

        _getPosition: function (onlyAbsolute) {
            var current = F.current,
				viewport = F.getViewport(),
				margin = current.margin,
				width = F.wrap.width() + margin[1] + margin[3],
				height = F.wrap.height() + margin[0] + margin[2],
				rez = {
				    position: 'absolute',
				    top: margin[0],
				    left: margin[3]
				};

            if (current.autoCenter && current.fixed && !onlyAbsolute && height <= viewport.h && width <= viewport.w) {
                rez.position = 'fixed';

            } else if (!current.locked) {
                rez.top += viewport.y;
                rez.left += viewport.x;
            }

            rez.top = getValue(Math.max(rez.top, rez.top + ((viewport.h - height) * current.topRatio)));
            rez.left = getValue(Math.max(rez.left, rez.left + ((viewport.w - width) * current.leftRatio)));

            return rez;
        },

        _afterZoomIn: function () {
            var current = F.current;

            if (!current) {
                return;
            }

            F.isOpen = F.isOpened = true;

            F.wrap.css('overflow', 'visible').addClass('fancybox-opened');

            F.update();

            // Assign a click event
            if (current.closeClick || (current.nextClick && F.group.length > 1)) {
                F.inner.css('cursor', 'pointer').bind('click.fb', function (e) {
                    if (!$(e.target).is('a') && !$(e.target).parent().is('a')) {
                        e.preventDefault();

                        F[current.closeClick ? 'close' : 'next']();
                    }
                });
            }

            // Create a close button
            if (current.closeBtn) {
                $(current.tpl.closeBtn).appendTo(F.skin).bind('click.fb', function (e) {
                    e.preventDefault();

                    F.close();
                });
            }

            // Create navigation arrows
            if (current.arrows && F.group.length > 1) {
                if (current.loop || current.index > 0) {
                    $(current.tpl.prev).appendTo(F.outer).bind('click.fb', F.prev);
                }

                if (current.loop || current.index < F.group.length - 1) {
                    $(current.tpl.next).appendTo(F.outer).bind('click.fb', F.next);
                }
            }

            F.trigger('afterShow');

            // Stop the slideshow if this is the last item
            if (!current.loop && current.index === current.group.length - 1) {
                F.play(false);

            } else if (F.opts.autoPlay && !F.player.isActive) {
                F.opts.autoPlay = false;

                F.play();
            }
        },

        _afterZoomOut: function (obj) {
            obj = obj || F.current;

            $('.fancybox-wrap').trigger('onReset').remove();

            $.extend(F, {
                group: {},
                opts: {},
                router: false,
                current: null,
                isActive: false,
                isOpened: false,
                isOpen: false,
                isClosing: false,
                wrap: null,
                skin: null,
                outer: null,
                inner: null
            });

            F.trigger('afterClose', obj);
        }
    });

    /*
	 *	Default transitions
	 */

    F.transitions = {
        getOrigPosition: function () {
            var current = F.current,
				element = current.element,
				orig = current.orig,
				pos = {},
				width = 50,
				height = 50,
				hPadding = current.hPadding,
				wPadding = current.wPadding,
				viewport = F.getViewport();

            if (!orig && current.isDom && element.is(':visible')) {
                orig = element.find('img:first');

                if (!orig.length) {
                    orig = element;
                }
            }

            if (isQuery(orig)) {
                pos = orig.offset();

                if (orig.is('img')) {
                    width = orig.outerWidth();
                    height = orig.outerHeight();
                }

            } else {
                pos.top = viewport.y + (viewport.h - height) * current.topRatio;
                pos.left = viewport.x + (viewport.w - width) * current.leftRatio;
            }

            if (F.wrap.css('position') === 'fixed' || current.locked) {
                pos.top -= viewport.y;
                pos.left -= viewport.x;
            }

            pos = {
                top: getValue(pos.top - hPadding * current.topRatio),
                left: getValue(pos.left - wPadding * current.leftRatio),
                width: getValue(width + wPadding),
                height: getValue(height + hPadding)
            };

            return pos;
        },

        step: function (now, fx) {
            var ratio,
				padding,
				value,
				prop = fx.prop,
				current = F.current,
				wrapSpace = current.wrapSpace,
				skinSpace = current.skinSpace;

            if (prop === 'width' || prop === 'height') {
                ratio = fx.end === fx.start ? 1 : (now - fx.start) / (fx.end - fx.start);

                if (F.isClosing) {
                    ratio = 1 - ratio;
                }

                padding = prop === 'width' ? current.wPadding : current.hPadding;
                value = now - padding;

                F.skin[prop](getScalar(prop === 'width' ? value : value - (wrapSpace * ratio)));
                F.inner[prop](getScalar(prop === 'width' ? value : value - (wrapSpace * ratio) - (skinSpace * ratio)));
            }
        },

        zoomIn: function () {
            var current = F.current,
				startPos = current.pos,
				effect = current.openEffect,
				elastic = effect === 'elastic',
				endPos = $.extend({ opacity: 1 }, startPos);

            // Remove "position" property that breaks older IE
            delete endPos.position;

            if (elastic) {
                startPos = this.getOrigPosition();

                if (current.openOpacity) {
                    startPos.opacity = 0.1;
                }

            } else if (effect === 'fade') {
                startPos.opacity = 0.1;
            }

            F.wrap.css(startPos).animate(endPos, {
                duration: effect === 'none' ? 0 : current.openSpeed,
                easing: current.openEasing,
                step: elastic ? this.step : null,
                complete: F._afterZoomIn
            });
        },

        zoomOut: function () {
            var current = F.current,
				effect = current.closeEffect,
				elastic = effect === 'elastic',
				endPos = { opacity: 0.1 };

            if (elastic) {
                endPos = this.getOrigPosition();

                if (current.closeOpacity) {
                    endPos.opacity = 0.1;
                }
            }

            F.wrap.animate(endPos, {
                duration: effect === 'none' ? 0 : current.closeSpeed,
                easing: current.closeEasing,
                step: elastic ? this.step : null,
                complete: F._afterZoomOut
            });
        },

        changeIn: function () {
            var current = F.current,
				effect = current.nextEffect,
				startPos = current.pos,
				endPos = { opacity: 1 },
				direction = F.direction,
				distance = 200,
				field;

            startPos.opacity = 0.1;

            if (effect === 'elastic') {
                field = direction === 'down' || direction === 'up' ? 'top' : 'left';

                if (direction === 'down' || direction === 'right') {
                    startPos[field] = getValue(getScalar(startPos[field]) - distance);
                    endPos[field] = '+=' + distance + 'px';

                } else {
                    startPos[field] = getValue(getScalar(startPos[field]) + distance);
                    endPos[field] = '-=' + distance + 'px';
                }
            }

            // Workaround for http://bugs.jquery.com/ticket/12273
            if (effect === 'none') {
                F._afterZoomIn();

            } else {
                F.wrap.css(startPos).animate(endPos, {
                    duration: current.nextSpeed,
                    easing: current.nextEasing,
                    complete: F._afterZoomIn
                });
            }
        },

        changeOut: function () {
            var previous = F.previous,
				effect = previous.prevEffect,
				endPos = { opacity: 0.1 },
				direction = F.direction,
				distance = 200;

            if (effect === 'elastic') {
                endPos[direction === 'down' || direction === 'up' ? 'top' : 'left'] = (direction === 'up' || direction === 'left' ? '-' : '+') + '=' + distance + 'px';
            }

            previous.wrap.animate(endPos, {
                duration: effect === 'none' ? 0 : previous.prevSpeed,
                easing: previous.prevEasing,
                complete: function () {
                    $(this).trigger('onReset').remove();
                }
            });
        }
    };

    /*
	 *	Overlay helper
	 */

    F.helpers.overlay = {
        defaults: {
            closeClick: true,      // if true, fancyBox will be closed when user clicks on the overlay
            speedOut: 200,       // duration of fadeOut animation
            showEarly: true,      // indicates if should be opened immediately or wait until the content is ready
            css: {},        // custom CSS properties
            locked: !isTouch,  // if true, the content will be locked into overlay
            fixed: true       // if false, the overlay CSS position property will not be set to "fixed"
        },

        overlay: null,      // current handle
        fixed: false,     // indicates if the overlay has position "fixed"
        el: $('html'), // element that contains "the lock"

        // Public methods
        create: function (opts) {
            opts = $.extend({}, this.defaults, opts);

            if (this.overlay) {
                this.close();
            }

            this.overlay = $('<div class="fancybox-overlay"></div>').appendTo(F.coming ? F.coming.parent : opts.parent);
            this.fixed = false;

            if (opts.fixed && F.defaults.fixed) {
                this.overlay.addClass('fancybox-overlay-fixed');

                this.fixed = true;
            }
        },

        open: function (opts) {
            var that = this;

            opts = $.extend({}, this.defaults, opts);

            if (this.overlay) {
                this.overlay.unbind('.overlay').width('auto').height('auto');

            } else {
                this.create(opts);
            }

            if (!this.fixed) {
                W.bind('resize.overlay', $.proxy(this.update, this));

                this.update();
            }

            if (opts.closeClick) {
                this.overlay.bind('click.overlay', function (e) {
                    if ($(e.target).hasClass('fancybox-overlay')) {
                        if (F.isActive) {
                            F.close();
                        } else {
                            that.close();
                        }

                        return false;
                    }
                });
            }

            this.overlay.css(opts.css).show();
        },

        close: function () {
            var scrollV, scrollH;

            W.unbind('resize.overlay');

            if (this.el.hasClass('fancybox-lock')) {
                $('.fancybox-margin').removeClass('fancybox-margin');

                scrollV = W.scrollTop();
                scrollH = W.scrollLeft();

                this.el.removeClass('fancybox-lock');

                W.scrollTop(scrollV).scrollLeft(scrollH);
            }

            $('.fancybox-overlay').remove().hide();

            $.extend(this, {
                overlay: null,
                fixed: false
            });
        },

        // Private, callbacks

        update: function () {
            var width = '100%', offsetWidth;

            // Reset width/height so it will not mess
            this.overlay.width(width).height('100%');

            // jQuery does not return reliable result for IE
            if (IE) {
                offsetWidth = Math.max(document.documentElement.offsetWidth, document.body.offsetWidth);

                if (D.width() > offsetWidth) {
                    width = D.width();
                }

            } else if (D.width() > W.width()) {
                width = D.width();
            }

            this.overlay.width(width).height(D.height());
        },

        // This is where we can manipulate DOM, because later it would cause iframes to reload
        onReady: function (opts, obj) {
            var overlay = this.overlay;

            $('.fancybox-overlay').stop(true, true);

            if (!overlay) {
                this.create(opts);
            }

            if (opts.locked && this.fixed && obj.fixed) {
                if (!overlay) {
                    this.margin = D.height() > W.height() ? $('html').css('margin-right').replace("px", "") : false;
                }

                obj.locked = this.overlay.append(obj.wrap);
                obj.fixed = false;
            }

            if (opts.showEarly === true) {
                this.beforeShow.apply(this, arguments);
            }
        },

        beforeShow: function (opts, obj) {
            var scrollV, scrollH;

            if (obj.locked) {
                if (this.margin !== false) {
                    $('*').filter(function () {
                        return ($(this).css('position') === 'fixed' && !$(this).hasClass("fancybox-overlay") && !$(this).hasClass("fancybox-wrap"));
                    }).addClass('fancybox-margin');

                    this.el.addClass('fancybox-margin');
                }

                scrollV = W.scrollTop();
                scrollH = W.scrollLeft();

                this.el.addClass('fancybox-lock');

                W.scrollTop(scrollV).scrollLeft(scrollH);
            }

            this.open(opts);
        },

        onUpdate: function () {
            if (!this.fixed) {
                this.update();
            }
        },

        afterClose: function (opts) {
            // Remove overlay if exists and fancyBox is not opening
            // (e.g., it is not being open using afterClose callback)
            //if (this.overlay && !F.isActive) {
            if (this.overlay && !F.coming) {
                this.overlay.fadeOut(opts.speedOut, $.proxy(this.close, this));
            }
        }
    };

    /*
	 *	Title helper
	 */

    F.helpers.title = {
        defaults: {
            type: 'float', // 'float', 'inside', 'outside' or 'over',
            position: 'bottom' // 'top' or 'bottom'
        },

        beforeShow: function (opts) {
            var current = F.current,
				text = current.title,
				type = opts.type,
				title,
				target;

            if ($.isFunction(text)) {
                text = text.call(current.element, current);
            }

            if (!isString(text) || $.trim(text) === '') {
                return;
            }

            title = $('<div class="fancybox-title fancybox-title-' + type + '-wrap">' + text + '</div>');

            switch (type) {
                case 'inside':
                    target = F.skin;
                    break;

                case 'outside':
                    target = F.wrap;
                    break;

                case 'over':
                    target = F.inner;
                    break;

                default: // 'float'
                    target = F.skin;

                    title.appendTo('body');

                    if (IE) {
                        title.width(title.width());
                    }

                    title.wrapInner('<span class="child"></span>');

                    //Increase bottom margin so this title will also fit into viewport
                    F.current.margin[2] += Math.abs(getScalar(title.css('margin-bottom')));
                    break;
            }

            title[(opts.position === 'top' ? 'prependTo' : 'appendTo')](target);
        }
    };

    // jQuery plugin initialization
    $.fn.fancybox = function (options) {
        var index,
			that = $(this),
			selector = this.selector || '',
			run = function (e) {
			    var what = $(this).blur(), idx = index, relType, relVal;

			    if (!(e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) && !what.is('.fancybox-wrap')) {
			        relType = options.groupAttr || 'data-fancybox-group';
			        relVal = what.attr(relType);

			        if (!relVal) {
			            relType = 'rel';
			            relVal = what.get(0)[relType];
			        }

			        if (relVal && relVal !== '' && relVal !== 'nofollow') {
			            what = selector.length ? $(selector) : that;
			            what = what.filter('[' + relType + '="' + relVal + '"]');
			            idx = what.index(this);
			        }

			        options.index = idx;

			        // Stop an event from bubbling if everything is fine
			        if (F.open(what, options) !== false) {
			            e.preventDefault();
			        }
			    }
			};

        options = options || {};
        index = options.index || 0;

        if (!selector || options.live === false) {
            that.unbind('click.fb-start').bind('click.fb-start', run);

        } else {
            D.undelegate(selector, 'click.fb-start').delegate(selector + ":not('.fancybox-item, .fancybox-nav')", 'click.fb-start', run);
        }

        this.filter('[data-fancybox-start=1]').trigger('click');

        return this;
    };

    // Tests that need a body at doc ready
    D.ready(function () {
        var w1, w2;

        if ($.scrollbarWidth === undefined) {
            // http://benalman.com/projects/jquery-misc-plugins/#scrollbarwidth
            $.scrollbarWidth = function () {
                var parent = $('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo('body'),
					child = parent.children(),
					width = child.innerWidth() - child.height(99).innerWidth();

                parent.remove();

                return width;
            };
        }

        if ($.support.fixedPosition === undefined) {
            $.support.fixedPosition = (function () {
                var elem = $('<div style="position:fixed;top:20px;"></div>').appendTo('body'),
					fixed = (elem[0].offsetTop === 20 || elem[0].offsetTop === 15);

                elem.remove();

                return fixed;
            }());
        }

        $.extend(F.defaults, {
            scrollbarWidth: $.scrollbarWidth(),
            fixed: $.support.fixedPosition,
            parent: $('body')
        });

        //Get real width of page scroll-bar
        w1 = $(window).width();

        H.addClass('fancybox-lock-test');

        w2 = $(window).width();

        H.removeClass('fancybox-lock-test');

        $("<style type='text/css'>.fancybox-margin{margin-right:" + (w2 - w1) + "px;}</style>").appendTo("head");
    });

}(window, document, jQuery));