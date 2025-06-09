/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!************************!*\
  !*** ./src/account.js ***!
  \************************/
__webpack_require__.r(__webpack_exports__);
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (c = i[4] || 3, u = i[5] === e ? i[3] : i[5], i[4] = 3, i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// DOM Elements
// API Configuration
var API_BASE_URL = 'http://localhost:5101';

// DOM Elements
var loginForm = document.getElementById('login-form');
var registerForm = document.getElementById('register-form');
var profileForm = document.getElementById('profile-form');
var themeButton = document.getElementById('theme-button');
var themeDropdown = document.getElementById('theme-dropdown');
var themeIcon = document.getElementById('theme-icon');
var themeOptions = document.querySelectorAll('.theme-option');

// Show/Hide forms
function showForm(formType) {
  loginForm.classList.add('hidden');
  registerForm.classList.add('hidden');
  profileForm.classList.add('hidden');
  switch (formType) {
    case 'login':
      loginForm.classList.remove('hidden');
      break;
    case 'register':
      registerForm.classList.remove('hidden');
      break;
    case 'profile':
      profileForm.classList.remove('hidden');
      break;
  }
}

// Toggle password visibility
document.querySelectorAll('.toggle-password').forEach(function (button) {
  button.addEventListener('click', function () {
    var input = button.parentElement.querySelector('input');
    var icon = button.querySelector('i');
    if (input.type === 'password') {
      input.type = 'text';
      icon.className = 'ri-eye-line';
    } else {
      input.type = 'password';
      icon.className = 'ri-eye-off-line';
    }
  });
});

// Theme management
function getPreferredTheme() {
  // Get theme preference from localStorage or API
  var savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    return savedTheme;
  }

  // Default to system theme if no saved preference
  return 'system';
}
function getEffectiveTheme(theme) {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return theme;
}
function updateThemeIcon(theme) {
  var effectiveTheme = getEffectiveTheme(theme);
  themeIcon.className = effectiveTheme === 'dark' ? 'ri-moon-line' : 'ri-sun-line';
}
function updateActiveTheme(theme) {
  themeOptions.forEach(function (option) {
    if (option.dataset.theme === theme) {
      option.classList.add('active');
    } else {
      option.classList.remove('active');
    }
  });
}
function setTheme(theme) {
  var updateStorage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  // Make sure we have a string value, not a promise
  var themeValue = typeof theme === 'string' ? theme : 'system';
  var effectiveTheme = getEffectiveTheme(themeValue);
  document.documentElement.style.setProperty('--transition-normal', 'none');
  document.body.classList.remove('light-theme', 'dark-theme');
  requestAnimationFrame(function () {
    // Ensure effectiveTheme is a string
    var themeClass = "".concat(effectiveTheme, "-theme");
    document.body.classList.add(themeClass);
    document.documentElement.style.setProperty('--transition-normal', 'all 0.3s ease');
    if (updateStorage) {
      localStorage.setItem('theme', themeValue);
    }
    updateThemeIcon(themeValue);
    updateActiveTheme(themeValue);
  });
}

// Theme dropdown toggle
themeButton.addEventListener('click', function () {
  themeDropdown.classList.toggle('hidden');
});

// Close theme dropdown when clicking outside
document.addEventListener('click', function (e) {
  if (!themeButton.contains(e.target) && !themeDropdown.contains(e.target)) {
    themeDropdown.classList.add('hidden');
  }
});

// Theme option selection
themeOptions.forEach(function (option) {
  option.addEventListener('click', function () {
    var theme = option.dataset.theme;
    setTheme(theme);
    themeDropdown.classList.add('hidden');
  });
});

// Watch for system theme changes
var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
mediaQuery.addEventListener('change', function (e) {
  var currentTheme = localStorage.getItem('theme') || 'system';
  if (currentTheme === 'system') {
    setTheme('system', false);
  }
});

// Initialize theme with string value to avoid Promise issues
var initialTheme = getPreferredTheme();
if (typeof initialTheme === 'string') {
  setTheme(initialTheme, false);
} else if (initialTheme instanceof Promise) {
  // If it's a promise, wait for it to resolve
  initialTheme.then(function (theme) {
    return setTheme(theme || 'system', false);
  })["catch"](function () {
    return setTheme('system', false);
  });
} else {
  // Fallback to system theme
  setTheme('system', false);
}

// Form submissions
loginForm.addEventListener('submit', /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(e) {
    var email, password, response, data, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          e.preventDefault();
          email = document.getElementById('login-email').value;
          password = document.getElementById('login-password').value;
          _context.p = 1;
          _context.n = 2;
          return fetch("".concat(API_BASE_URL, "/api/auth/login"), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: email,
              password: password
            })
          });
        case 2:
          response = _context.v;
          if (response.ok) {
            _context.n = 3;
            break;
          }
          throw new Error("Login failed: ".concat(response.status));
        case 3:
          _context.n = 4;
          return response.json();
        case 4:
          data = _context.v;
          // Store user data and token
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('token', data.token);

          // Redirect to chat
          window.location.href = 'index.html';
          _context.n = 6;
          break;
        case 5:
          _context.p = 5;
          _t = _context.v;
          console.error('Login error:', _t);
          alert('Login failed. Please try again.');
        case 6:
          return _context.a(2);
      }
    }, _callee, null, [[1, 5]]);
  }));
  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());
registerForm.addEventListener('submit', /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(e) {
    var name, email, password, confirmPassword;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          e.preventDefault();
          name = document.getElementById('register-name').value;
          email = document.getElementById('register-email').value;
          password = document.getElementById('register-password').value;
          confirmPassword = document.getElementById('register-confirm-password').value;
          if (!(password !== confirmPassword)) {
            _context2.n = 1;
            break;
          }
          alert('Passwords do not match');
          return _context2.a(2);
        case 1:
          try {
            // TODO: Implement registration API call
            console.log('Register:', {
              name: name,
              email: email,
              password: password
            });
            showForm('login');
          } catch (error) {
            console.error('Registration error:', error);
          }
        case 2:
          return _context2.a(2);
      }
    }, _callee2);
  }));
  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
}());
profileForm.addEventListener('submit', /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(e) {
    var name, currentPassword, newPassword;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.n) {
        case 0:
          e.preventDefault();
          name = document.getElementById('profile-name').value;
          currentPassword = document.getElementById('profile-current-password').value;
          newPassword = document.getElementById('profile-new-password').value;
          try {
            // TODO: Implement profile update API call
            console.log('Update profile:', {
              name: name,
              currentPassword: currentPassword,
              newPassword: newPassword
            });
          } catch (error) {
            console.error('Profile update error:', error);
          }
        case 1:
          return _context3.a(2);
      }
    }, _callee3);
  }));
  return function (_x3) {
    return _ref3.apply(this, arguments);
  };
}());

// Logout function
function logout() {
  if (confirm('Are you sure you want to logout?')) {
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Redirect to login page - fixed incorrect function call syntax
    window.location.href = 'account.html';
  }
}

// Check authentication status on page load
function checkAuth() {
  var token = localStorage.getItem('token');
  if (token) {
    // TODO: Validate token and load user data
    showForm('profile');
  } else {
    showForm('login');
  }
}

// Initialize page
checkAuth();
/******/ })()
;
//# sourceMappingURL=account.bundle.js.map