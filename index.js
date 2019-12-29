/**
 * Library by Drew Snow for miscellaneous uses 
 * @namespace Modules
 */

~function () {
	const timer = 'Exploit API loaded in';
	console.time(timer);

	window.drewsnow = {
		'mouse': { 'x': 0, 'y': 0 },

		/**
		 * Allow a container to be dragged around
		 * @param {HTMLElement} container - Container of the draggable element
		 * @param {HTMLElement} dragItem - Element to drag to move container
		 * @memberof Modules
		 */
		'draggable': (container, dragItem) => {
			if (dragItem === undefined) dragItem = container;

			let xOffset = 0,
				yOffset = 0,
				active = false,
				currentX,
				currentY,
				initialX,
				initialY;

			dragItem.addEventListener('touchstart', dragStart, false);
			document.addEventListener('touchend', dragEnd, false);
			document.addEventListener('touchmove', drag, false);

			dragItem.addEventListener('mousedown', dragStart, false);
			document.addEventListener('mouseup', dragEnd, false);
			document.addEventListener('mousemove', drag, false);

			function dragStart(e) {
				active = true;
				if (e.type === 'touchstart') {
					initialX = e.touches[0].clientX - xOffset;
					initialY = e.touches[0].clientY - yOffset;
				} else {
					initialX = e.clientX - xOffset;
					initialY = e.clientY - yOffset;
				}
				let ignoredElems = ['INPUT', 'BUTTON', 'A', 'P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
				if (e.target === dragItem || container === dragItem && ignoredElems.indexOf(e.target.nodeName) == -1) active = true;
			}

			function dragEnd(e) {
				initialX = currentX;
				initialY = currentY;
				active = false;
			}

			function drag(e) {
				if (active) {
					e.preventDefault();
					if (e.type === 'touchmove') {
						currentX = e.touches[0].clientX - initialX;
						currentY = e.touches[0].clientY - initialY;
					} else {
						currentX = e.clientX - initialX;
						currentY = e.clientY - initialY;
					}
					xOffset = currentX;
					yOffset = currentY;
					setTranslate(currentX, currentY, container);
				}
			}

			function setTranslate(xPos, yPos, el) {
				el.style.transform = 'translate3d(' + xPos + 'px, ' + yPos + 'px, 0)';
			}
		},

		/**
		 * Create new cascading style sheet (CSS)
		 * @param {String} css - CSS style to add to the page
		 * @returns {HTMLElement} New style sheet
		 * @memberof Modules
		 */
		'css': (css) => {
			let elem = document.createElement('style');
			elem.textContent = css;
			document.head.appendChild(elem);
			return elem;
		},

		/**
		 * Append HTML to body or given element
		 * @param {String} html - HTML to append to parent
		 * @param {HTMLElement} [HTMLElement] parent - Parent to append HTML to
		 * @returns {HTMLElement} New HTML element
		 * @memberof Modules
		 */
		'html': (html, parent) => {
			elements = new DOMParser().parseFromString(html, 'text/html');
			container = elements.body.firstChild;
			(parent || document.body).appendChild(container);
			return container;
		},

		/**
		 * Create and run a new script
		 * @param {String} script - Script element to create
		 * @returns {HTMLElement} New HTML element
		 * @memberof Modules
		 */
		'script': (script) => {
			let elem = document.createElement('script');
			elem.type = 'text/javascript';
			elem.textContent = script;
			elem.onload = function () { this.remove(); };
			document.body.appendChild(elem);
		},

		/**
		 * Create a new keybind
		 * @param {Function} func - Function to run on keydown
		 * @param {*} code - Identifier to select or remove keybind
		 * @param {Number} key - Key to call function
		 * @param {Boolean} [false] bool - Does the keybind start as on or off
		 * @memberof Modules
		 */
		'addKeyBind': function (func, code = -1, key = '', bool = false) {
			this.keybinds.push({
				'key': key,
				'on': bool,
				'func': func,
				'code': code
			});
			if (bool) func();
		},

		/**
		 * Remove keybind(s) with given identifier
		 * @param {*} code - Identifier to find and remove keybind
		 * @returns {Boolean} Keybind found or not
		 * @memberof Modules
		 */
		'removeKeyBind': function (code) {
			for (let i = 0; i < this.keybinds.length; ++i) {
				let binds = this.keybinds;
				if (binds[i].code === code) {
					binds.splice(i, 1);
					return true;
				}
			}
			return false;
		},

		'keybinds': [],

		/**
		 * Find the angle between two given points
		 * @param {Number} x1 - X position of first point
		 * @param {Number} y1 - Y position of first point
		 * @param {Number} x2 - X position of second point
		 * @param {Number} y2 - Y position of second point
		 * @returns {Number} Angle between the two points
		 * @memberof Modules
		 */
		'angle': (x1, y1, x2, y2) => {
			return Math.atan2(y1 - y2, x1 - x2);
		},

		/**
		 * Find the distance between two given points
		 * @param {Number} x1 - X position of first point
		 * @param {Number} y1 - Y position of first point
		 * @param {Number} x2 - X position of second point
		 * @param {Number} y2 - Y position of second point
		 * @returns {Number} Distance between the two points
		 * @memberof Modules
		 */
		'distance': (x1, y1, x2, y2) => {
			let a = x1 - x2,
				b = y1 - y2;

			return Math.sqrt(a * a + b * b);
		},

		/**
		 * Find the closest object in an array to the given point
		 * @param {Object} you - Main charecter's position
		 * @param {String} you.x - Main charecter's position on X-axis
		 * @param {String} you.y - Main charecter's position on Y-axis
		 * @param {Array} objects - Array of positions of the other charecters
		 * @returns {Object} Closest object to main charecter
		 * @memberof Modules
		 */
		'closest': function (you, objects = []) {
			let closestObj = objects[0];
			let closestDist = Infinity;
			for (let i = 0; i < objects.length; ++i) {
				let obj = objects[i],
					dist = this.getDist(you.x, you.y, obj.x, obj.y);
				if (dist < closestDist) {
					closestObj = obj;
					closestDist = dist;
				}
			}
			return closestObj;
		},

		/**
		 * Download a file with given name and contents
		 * @param {String} filename - Name of the file to download
		 * @param {String} data - Contents of the file to download
		 * @memberof Modules
		 */
		'download': function (filename, data) {
			let elem = document.createElement('a');
			elem.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
			elem.setAttribute('download', filename);

			elem.style.display = 'none';
			document.body.appendChild(elem);

			elem.click();

			document.body.removeChild(elem);
		},

		/**
		 * Attempt to go fullscreen
		 */
		'fullscreen': function () {
			let elem = document.documentElement;
			if (elem.requestFullscreen) {
				elem.requestFullscreen();
			} else if (elem.mozRequestFullScreen) {
				elem.mozRequestFullScreen();
			} else if (elem.webkitRequestFullscreen) {
				elem.webkitRequestFullscreen();
			} else if (elem.msRequestFullscreen) {
				elem.msRequestFullscreen();
			}
		},

		/**
		 * Attempt to intercept scripts
		 * @param {String} match - String to match the script SRC to
		 * @param {String} script - Script to replace the file with
		 * @memberof Modules
		 */
		'intercept': function (match, script) {
			document.addEventListener('beforescriptexecute', function (e) {
				src = e.target.src;
				content = e.target.text;

				if (src.indexOf(match) != -1) {
					e.preventDefault();
					e.stopPropagation();
					e.target.remove();

					this.script(script);
				}
			});
		},

		/**
		 * Attempt to copy text to clipboard
		 * @param {String} text - String to copy to clipboard
		 * @memberof Modules
		 */
		'copy': function (text) {
			let input = document.createElement('textarea');

			input.value = text;
			input.setAttribute('readonly', '');
			document.body.appendChild(input);

			input.focus();
			input.select();

			try {
				input.style = 'opacity: 0; visibility: hidden;';

				document.execCommand('copy');
				document.body.removeChild(input);
			} catch (e) {
				input.style = 'z-index: 2147483646; position: fixed; left: 50%; top: 50%; width: 50%; height: 50%; transform: translate(-50%, -50%)';

				input.onclick = function () {
					this.focus();
					this.select();
					document.execCommand('copy');
				};

				input.onblur = function () { this.remove(); };
			}
		},

		/**
		 * Spoof mousedown event on given element
		 * @param {HTMLElement} elem - Element to dispatch the event onto
		 * @param {Object} params - Parameters to be fed into the event
		 * @memberof Modules
		 */
		'mousedown': function (elem, params = {}) {
			let event = new MouseEvent('mousedown', {
				currentTarget: params.currentTarget || elem || document.body,
				view: params.view || window,
				bubbles: params.bubbles || true,
				cancelable: params.cancelable || true,
				clientX: params.x || 0,
				clientY: params.y || 0,
				pageX: params.x || 0,
				pageY: params.y || 0
			});
			elem.dispatchEvent(event);
		},

		/**
		 * Spoof mouseup event on given element
		 * @param {HTMLElement} elem - Element to dispatch the event onto
		 * @param {Object} params - Parameters to be fed into the event
		 * @memberof Modules
		 */
		'mouseup': function (elem, params = {}) {
			let event = new MouseEvent('mouseup', {
				currentTarget: params.currentTarget || elem || document.body,
				view: params.view || window,
				bubbles: params.bubbles || true,
				cancelable: params.cancelable || true,
				clientX: params.x || 0,
				clientY: params.y || 0,
				pageX: params.x || 0,
				pageY: params.y || 0
			});
			elem.dispatchEvent(event);
		},

		/**
		 * Spoof mousemove event on given element
		 * @param {HTMLElement} elem - Element to dispatch the event onto
		 * @param {Object} params - Parameters to be fed into the event
		 * @memberof Modules
		 */
		'mousemove': function (elem, params = {}) {
			let event = new MouseEvent('mousemove', {
				currentTarget: params.currentTarget || elem || document.body,
				view: params.view || window,
				bubbles: params.bubbles || true,
				cancelable: params.cancelable || true,
				clientX: params.x || 0,
				clientY: params.y || 0,
				pageX: params.x || 0,
				pageY: params.y || 0
			});
			elem.dispatchEvent(event);
		},

		/**
		 * Spoof keydown event on given element
		 * @param {HTMLElement} elem - Element to dispatch the event onto
		 * @param {String} key - Keycode to be fed into the event
		 * @memberof Modules
		 */
		'keydown': function (elem, key = 'a') {
			let event = new KeyboardEvent('keydown', {
				view: window,
				bubbles: true,
				cancelable: true,
				altKey: false,
				ctrlKey: false,
				key,
				keyCode: key.charCodeAt(0),
				shiftKey: false,
				target: elem,
				which: key.charCodeAt(0)
			});
			elem.dispatchEvent(event);
		},

		/**
		 * Spoof keyup event on given element
		 * @param {HTMLElement} elem - Element to dispatch the event onto
		 * @param {String} key - Keycode to be fed into the event
		 * @memberof Modules
		 */
		'keyup': function (elem, key = 'a') {
			let event = new KeyboardEvent('keyup', {
				view: window,
				bubbles: true,
				cancelable: true,
				altKey: false,
				ctrlKey: false,
				key,
				keyCode: key.charCodeAt(0),
				shiftKey: false,
				target: elem,
				which: key.charCodeAt(0)
			});
			elem.dispatchEvent(event);
		},

		/**
		 * Spoof change event on given element
		 * @param {HTMLElement} elem - Element to dispatch the event onto
		 * @memberof Modules
		 */
		'change': function (elem) {
			let event = new Event('change', {
				bubbles: true,
				cancelBubble: false,
				cancelable: false,
				composed: false,
				currentTarget: null,
				defaultPrevented: false,
				eventPhase: 0,
				returnValue: true,
				srcElement: elem,
				target: elem
			});
			elem.dispatchEvent(event);
		},

		/**
		 * Spoof input event on given element
		 * @param {HTMLElement} elem - Element to dispatch the event onto
		 * @param {String} data - Data to be fed into the event
		 * @memberof Modules
		 */
		'input': function (elem, data = '') {
			let event = new InputEvent('input', {
				bubbles: true,
				cancelBubble: false,
				cancelable: false,
				composed: true,
				currentTarget: null,
				dataTransfer: null,
				defaultPrevented: false,
				detail: 0,
				view: null,
				which: 0,
				returnValue: true,
				sourceCapabilities: null,
				eventPhase: 0,
				isComposing: false,
				inputType: 'insertText',
				srcElement: elem,
				target: elem,
				data
			});
			elem.dispatchEvent(event);
		},

		/**
		 * Spoof focus event on given element
		 * @param {HTMLElement} elem - Element to dispatch the event onto
		 * @memberof Modules
		 */
		'focus': function (elem) {
			elem.focus();
			let event = new FocusEvent('focus', {
				bubbles: false,
				cancelBubble: false,
				cancelable: false,
				composed: true,
				currentTarget: null,
				defaultPrevented: false,
				detail: 0,
				eventPhase: 0,
				isTrusted: true,
				relatedTarget: null,
				returnValue: true,
				sourceCapabilities: null,
				srcElement: elem,
				target: elem,
				view: window,
				which: 0
			});
			elem.dispatchEvent(event);
		},

		/**
		 * Spoof changing of text input
		 * @param {HTMLElement} elem - Element to write the text onto
		 * @param {String} text - Text top write
		 * @memberof Modules
		 */
		'write': function (elem, text = 'abc') {
			this.focus(elem);

			elem.value = text;
			elem.textContent = text;

			this.input(elem, text);
			this.change(elem);
		},

		'init': function () {
			const binds = this.keybinds;
			document.body.addEventListener('keydown', (e) => {
				for (let i = 0; i < binds.length; ++i) {
					let data = binds[i];
					if ((e.which || e.keyCode) === data.code) {
						data.func(data.on);
						data.on = !data.on;
					}
				}
			});

			window.addEventListener('mousemove', e => {
				this.mouse.x = e.clientX;
				this.mouse.y = e.clientY;
			});

			let elem = this.html(`
				<div style="pointer-events: none; user-select: none;box-shadow: 0 5px 35px rgba(0, 0, 0, .65);font-family: Consolas, monaco, monospace;transition: transform 1s ease;transform: translateX(125%);border-radius: 3px 0 0 3px;width: 250px; height: 90px;background-color: #11af00;box-sizing: content-box;bottom: 20px; right: 0;box-sizing: border-box;margin: 0; padding: 0;z-index: 2147483647;text-align: center;line-height: 100%;padding-top: 30px;position: fixed;line-height: 0;color: #000;">
					<span style="line-height: 0px; font-size: 25px; font-family: inherit;">Developed By</span><br>
					<span style="line-height: 45px; font-size: 45px; text-shadow: 0 1px #808d93, -1px 0 #cdd2d5, -1px 2px #808d93, -2px 1px #cdd2d5, -2px 3px #808d93, -3px 2px #cdd2d5, -3px 4px #808d93, -4px 3px #cdd2d5, 2px 2px 2px rgba(206, 89, 55, 0.1); font-family: inherit;">Drew Snow</span>
				</div>
			`.trim());

			setTimeout(() => { elem.style.transform = ''; }, 1);

			setTimeout(() => { elem.style.transform = 'translateX(125%)'; }, 4000);

			setTimeout(() => { elem.remove(); }, 5250);

			Number.prototype.toDegree = function () { return this * (180 / Math.PI); };

			Number.prototype.toRadian = function () { return this * (Math.PI / 180); };

			Array.prototype.random = function () { return this[Math.floor(Math.random() * this.length)] || ''; };

			Element.prototype.forEach = function (callback) { for (let i = 0; i < this.length; ++i) callback(this[i], i); };

			Array.prototype.contains = function (value) {
				for (let i = 0; i < this.length; ++i)
					if (this[i] === value) return true;
				return false;
			};

			Array.prototype.findByName = function (name = '', exact = false) {
				let result = [],
					index = -1;
				if (this.length < 1) return [];

				for (let i = 0; i < this.length; ++i) {
					let obj = this[i];

					if (exact && obj.name != name) continue;
					if (!exact && obj.name !== name) continue;

					result.push(obj);
					index = i;
				}

				return result[0];
			};

			String.prototype.encode = function () {
				return this
					.replace(/</g, '&lt;')
					.replace(/>/g, '&gt;')
					.replace(/"/g, '&quot;')
					.replace(/'/g, '&#39;');
			};

			CanvasRenderingContext2D.prototype.line = function (x1, y1, x2, y2, color = '#000', thickness = 1) {
				this.save();
				this.lineWidth = thickness;
				this.strokeStyle = color;

				this.beginPath();
				this.moveTo(x1, y1);
				this.lineTo(x2, y2);
				this.stroke();
				this.restore();
			};

			CanvasRenderingContext2D.prototype.circle = function (x, y, r, color = '#000') {
				this.save();

				this.arc(x, y, r, 0, 2 * Math.PI, false);
				this.fillStyle = color;
				this.fill();

				this.restore();
			};

			CanvasRenderingContext2D.prototype.rect = function (x, y, width, height, color = '#000') {
				this.save();

				this.fillStyle = color;
				this.fillRect(x, y, width, height, color);

				this.restore();
			};

			console.timeEnd(timer);
		}
	};
	window.drewsnow.init();
}();

function Exploit() {
	this.container = drewsnow.html(`
		<div class="drew-container">
			<input placeholder="Username" class="player-name">
			<button class="btn-id">ID</button>
			<input placeholder="ID" class="player-id">
			<button class="btn-username">Name</button>
			<button class="btn-join btn-three">Join</button>
			<button class="btn-empty btn-three">Empty</button>
			<button class="btn-find btn-three">Stalk</button>
			<div class="output"></div>
		</div>
	`);

	this.css = this.dark();

	this.inp = {
		'name': this.container.getElementsByClassName('player-name')[0],
		'id': this.container.getElementsByClassName('player-id')[0]
	};

	this.btn = {
		'username': this.container.getElementsByClassName('btn-username')[0],
		'id': this.container.getElementsByClassName('btn-id')[0],
		'join': this.container.getElementsByClassName('btn-join')[0],
		'empty': this.container.getElementsByClassName('btn-empty')[0],
		'find': this.container.getElementsByClassName('btn-find')[0]
	};

	this.elem = {
		'output': this.container.getElementsByClassName('output')[0]
	};

	this.color = {
		'error': '#ff0000',
		'success': '#00d107',
		'warning': '#ffa600',
		'info': '#0fafff',
		'greyed': '#7d7d7d'
	}

	this.btn.username.addEventListener('click', () => { this.handleUsername(); });
	this.btn.id.addEventListener('click', () => { this.handleId(); });
	this.btn.join.addEventListener('click', () => { this.handleJoin(); });
	this.btn.empty.addEventListener('click', () => { this.handleEmpty(); });
	this.btn.find.addEventListener('click', () => { this.handleFind(); });

	window.addEventListener('keydown', e => {
		let key = e.keyCode || e.which;

		if (key == 76 && e.ctrlKey) {
			e.preventDefault();

			let elem = this.elem.output;
			while (elem.firstChild) elem.removeChild(elem.firstChild);
			this.log('Console has been cleared.', this.color.greyed);
		}
	});

	this.log('Modules loaded!', this.color.success);
}

Exploit.prototype.presence = function (id, callback = console.log) {
	let xhr = new XMLHttpRequest();
	xhr.open('POST', 'https://presence.roblox.com/v1/presence/users', false);
	xhr.withCredentials = true;
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.setRequestHeader('Accept', 'application/json');
	xhr.onreadystatechange = () => {
		if (xhr.readyState != 4) return;

		if (xhr.status == 200) {
			let data = JSON.parse(xhr.responseText);

			if (data['userPresences'].length) callback(data['userPresences'][0]);
			else callback(false);
		} else {
			callback(xhr);
		}
	};
	xhr.send(JSON.stringify({
		'userIds': [id]
	}));
}

Exploit.prototype.handleUsername = function () {
	let id = this.inp.id.value;

	if (!id) return this.invalid(this.inp.id);
	this.username(id, e => {
		if (e.Username) {
			this.inp.name.value = e.Username;
			this.log('Found username: ' + e.Username, this.color.success);
		} else {
			this.log('Invalid ID.', this.color.error);
		}
	});
}

Exploit.prototype.handleId = function () {
	let name = this.inp.name.value;

	if (!name) return this.invalid(this.inp.name);
	this.id(name, e => {
		if (e.Id) {
			this.inp.id.value = e.Id;
			this.inp.name.value = e.Username;
			this.log('Found ID: ' + e.Id, this.color.success);
		} else {
			this.log('Invalid username.', this.color.error);
		}
	});
}

Exploit.prototype.handleJoin = function () {
	let username = this.inp.name.value,
		id = this.inp.id.value;

	if (!username && !id) return this.invalid(this.inp.name);
	if (username && !id) return this.id(this.inp.name.value, e => {
		this.inp.id.value = e.Id;
		this.handleJoin();
	});

	this.btn.join.disabled = true;
	return this.join(id, () => {
		this.btn.join.disabled = false;
	});
}

Exploit.prototype.handleEmpty = function () {
	this.btn.empty.disabled = true;
	this.empty(() => {
		this.btn.empty.disabled = false;
	});
}

Exploit.prototype.handleFind = function () {
	let username = this.inp.name.value,
		id = this.inp.id.value;

	if (!username && !id) return this.invalid(this.inp.name);

	if (username && !id) {
		this.btn.find.disabled = true;
		return this.id(this.inp.name.value, e => {
			this.btn.find.disabled = false;
			this.inp.id.value = e.Id;
			this.handleFind();
		});
	}

	this.log('Username: ' + username, this.color.info);
	this.log('ID: ' + id, this.color.info);

	this.btn.find.disabled = true;
	this.presence(id, resp => {
		this.btn.find.disabled = false;
		if (resp) {
			let lastDate = new Date(resp['lastOnline']),
				types = ['Offline', 'Online', 'Playing'];

			this.log('Last Location: ' + resp['lastLocation'], this.color.info);
			this.log('Last On: ' + this.age(lastDate), this.color.info);
			this.log('Presence: ' + types[resp['userPresenceType']], this.color.info);
			if (resp['universeId']) this.log('Universe: ' + resp['universeId'], this.color.info);
			this.log('---------------------------', this.color.greyed);
		} else {
			this.log('Unable to find information.', this.color.error);
		}
	});
}

Exploit.prototype.age = function (date = new Date()) {
	let now = new Date(),
		passed = now.getTime() - date.getTime(),
		seconds = passed / 1000,
		minutes = seconds / 60,
		hours = minutes / 60,
		days = hours / 24,
		years = days / 365,
		best = seconds + 'Seconds';

		if (minutes < 60) best = (Math.round(minutes * 10) / 10) + ' Minute(s)';
		else if (hours < 24) best = (Math.round(hours * 10) / 10) + ' Hour(s)';
		else if (days < 365) best = (Math.round(days * 10) / 10) + ' Day(s)';
		else if (years > 0) best = (Math.round(years * 10) / 10) + ' Year(s)';
		
	return best;	
}

Exploit.prototype.log = function (message, color = '#fff') {
	let elem = document.createElement('span');
	elem.className = 'log';
	elem.style.color = color;
	elem.textContent = message;

	this.elem.output.appendChild(elem);
	elem.scrollIntoView(false);

	return elem;
}

Exploit.prototype.invalid = function (elem) {
	elem.classList.add('invalid');
	setTimeout(() => {
		elem.classList.remove('invalid');
	}, 1000);
}

Exploit.prototype.multiget = function (urls, callback = console.log) {
	return Promise.all(urls)
		.then(responses => {
			return Promise.all(responses.map(resp => resp.json()));

		}).then(data => {
			callback(data);

		}).catch(error => {
			callback(error);

		});
}

Exploit.prototype.dark = function () {
	return drewsnow.css(`
		.drew-container > * {
			font: 15px Ubuntu, Consolas, Courier, 'Courier New', serif !important;
			box-sizing: border-box;
		}

		.drew-container ::placeholder {
			color: #adadad;
			opacity: 1;
		}

		.drew-container ::-webkit-scrollbar {
			width: 10px;
		}

		.drew-container ::-webkit-scrollbar-track {
			background: transparent; 
		}
		
		.drew-container ::-webkit-scrollbar-thumb {
			background: #393b3d; 
		}

		.drew-container ::-webkit-scrollbar-thumb:hover {
			background: #555; 
		}

		.drew-container {
			box-shadow: -1px 5px 5px 1px rgba(0, 0, 0, 0.1);
			animation: 1s ease 0s 1 slide-from-right;
			background-color: rgba(25, 27, 29, 1);
			transition: opacity 150ms linear;
			width: 250px; height: 350px;
			border-radius: 5px 0 0 5px;
			top: 45px; right: 0;
			z-index: 2147483638;
			position: fixed;
			opacity: 0.95;
		}

		.drew-container:hover {
			opacity: 1;
		}

		.drew-container input {
			background-color: transparent;
			transition: all 0.1s ease;
			line-height: normal;
			outline: none;
			padding: 5px;
			border: none;
			height: 30px;
			width: 180px;
			color: #fff;
			border-bottom: 1px solid #fff;
		}

		.drew-container input:focus {
			border-bottom: 1px solid #656668;
		}

		.drew-container button {
			background-color: #393b3d;
			cursor: pointer;
			outline: none;
			height: 30px;
			border: none;
			width: 65px;
			color: #fff;
			border-bottom: 1px solid #fff;
		}

		.drew-container button:active {
			border-bottom: 1px solid #656668;
		}

		.drew-container .btn-search {
			width: 65px;
		} 

		.drew-container .btn-three {
			margin-right: 3px;
			margin-top: 3px;
			width: 81px;
			float: left;
		}

		.drew-container .btn-three:last-of-type {
			margin-right: 0;
		}

		.btn-id, .btn-username {
			margin-left: 4px;
		}

		.player-name, .btn-id, .player-id, .btn-username {
			margin-top: 3px;
			float: left;
		}

		.drew-container .invalid {
			animation: 0.25s linear 0s 3 error-shake;
			border-bottom: 1px solid #9c000a;
		}

		.drew-container .output {
			overflow-x: hidden;
			margin-right: 2px;
			max-height: 248px;
			overflow-y: auto;
			margin-top: 3px;
			width: 100%;
			float: left;
		}

		.drew-container .log {
			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
			display: block;
		}

		@keyframes slide-from-right {
			from { transform: translateX(100%); }
			to { transform: translateX(0); }
		}

		@keyframes error-shake {
			0% { transform: translate(-1px, -1px) rotate(1deg); }
            20% { transform: translate(1px, 1px) rotate(0deg); }
            40% { transform: translate(-1px, 1px) rotate(-1deg); }
            60% { transform: translate(-0px, 0px) rotate(0deg); }
            80% { transform: translate(-2px, -1px) rotate(-1deg); }
            100% { transform: translate(1px, 0px) rotate(1deg); }
		}
	`);
}

Exploit.prototype.light = function () {
	return drewsnow.css(`
	
	`);
}

Exploit.prototype.isDark = function () {
	let elem = document.getElementById('header');

	if (!elem) return true;
	return elem.classList.contains('dark-theme');
}

Exploit.prototype.empty = function (callback = console.log) {
	if (window.location.href.indexOf('roblox.com/games/') == -1) return callback(false);

	const gid = Number(window.location.pathname.split('/')[2]) || Number(prompt('Game ID to join:', '301549746'));
	const url = `https://www.roblox.com/games/${gid}`;

	const searchForGame = (gid, min, max) => {
		let page = Math.round((max + min) / 2);
		fetch(`https://www.roblox.com/games/getgameinstancesjson?placeId=${gid}&startindex=${page}`)
			.then(resp => resp.json())
			.then(data => {
				if (data['Collection'].length < 10 && data['Collection'].length > 0) {
					let server = data['Collection'][data['Collection'].length - 1];
					try {
						callback(server);
						eval(server['JoinScript']);
					} catch (e) { callback(e); }
					this.log('Total Players: ' + server['CurrentPlayers'].length, this.color.info);
					this.log('Joining smallest server.', this.color.success);
				} else if (data['Collection'].length == 0) {
					max = page;
					searchForGame(gid, min, max);
				} else {
					min = page;
					searchForGame(gid, min, max);
				}
			});
	}
	return searchForGame(gid, 0, 10000);
}

Exploit.prototype.username = (id, callback = console.log) => {
	let url = 'https://api.roblox.com/users/' + id;

	return fetch(url)
		.then((resp) => resp.json())
		.then(data => callback(data));
}

Exploit.prototype.id = function (username, callback = console.log) {
	let url = 'https://api.roblox.com/users/get-by-username?username=' + username;

	return fetch(url)
		.then((resp) => resp.json())
		.then(data => callback(data));
}

Exploit.prototype.avatar = function (id, callback = console.log) {
	let url = 'https://www.roblox.com/headshot-thumbnail/image?userId=' + id + '&width=48&height=48&format=png';
	fetch(url)
		.then(function (resp) {
			callback(resp['url']);
		});
}

Exploit.prototype.search = function (gid, avatar, progress = document.createElement('div'), callback = console.log, start = 0) {
	let url = `https://www.roblox.com/games/getgameinstancesjson?placeId=${gid}&startindex=`,
		urls = [],
		threads = 10;

	for (let i = 0; i < threads; ++i) urls.push(fetch(url + (start + i)));

	this.multiget(urls, responses => {
		for (let i = 0; i < responses.length; ++i) {
			let data = responses[i];
			if (data['Collection'].length < 1) return callback([false, 'Unable to find player.', data]);
			for (let j = 0; j < data['Collection'].length; ++j) {
				let server = data['Collection'][j];
				for (let k = 0; k < server['CurrentPlayers'].length; ++k) {
					let player = server['CurrentPlayers'][k];
					if (player['Thumbnail']['Url'].split('/')[3] == avatar) return callback(server);
				}
			}
		}
		progress.textContent = 'Servers checked: ' + start;
		this.search(gid, avatar, progress, callback, start += threads);
	});
}

Exploit.prototype.join = function (id, callback = console.log) {
	let gid = Number(window.location.pathname.split('/')[2]) || Number(prompt('Game ID to search in:', '3956818381'));

	this.avatar(id, url => {
		let log = this.log('Servers checked: 0', this.color.info);
		this.search(gid, url.split('/')[3], log, resp => {
			callback(resp);
			if (resp.length) {
				this.log('Unable to find player.', this.color.error);
				console.log('Error:', resp[1], resp[2]);
			} else {
				this.log('Joining player.', this.color.success);
				eval(resp['JoinScript']);
			}
		});
	});
}

window.Session = new Exploit();
