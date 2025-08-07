# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Bootstrap v4.6.2 fork that maintains jQuery v4 compatibility by implementing deprecated jQuery functions that were removed in jQuery 3+. The project includes a custom `jquery.deprecated_functions.js` file that polyfills removed jQuery methods like `$.isFunction()`, `$.trim()`, `$.parseJSON()`, and others.

## Development Commands

### Build Commands
- `npm run dist` - Build both CSS and JS (production build)
- `npm run css` - Compile, prefix, and minify CSS
- `npm run js` - Compile and minify JavaScript
- `npm run css-compile` - Compile SCSS to CSS only
- `npm run js-compile` - Compile JavaScript only

### Testing
- `npm test` - Run complete test suite (lint, build, js-test, docs)
- `npm run js-test` - Run JavaScript tests with Karma
- `npm run js-test-karma` - Run Karma tests
- `npm run js-test-karma-old` - Test with older jQuery version
- `npm run js-test-karma-bundle` - Test bundled version

### Development
- `npm start` - Start development with file watching and docs server
- `npm run watch` - Watch files and rebuild on changes
- `npm run docs-serve` - Serve documentation at http://localhost:9001

### Linting
- `npm run lint` - Run all linters (JS, CSS, lockfile)
- `npm run js-lint` - Lint JavaScript with ESLint
- `npm run css-lint` - Lint CSS/SCSS with Stylelint

## Architecture

### JavaScript Structure
- `js/index.js` - Main entry point exporting all Bootstrap components
- `js/src/` - Individual component modules (alert.js, button.js, carousel.js, etc.)
- `js/src/jquery.deprecated_functions.js` - jQuery v4 compatibility polyfills
- `js/src/util.js` - Shared utility functions
- `js/tests/` - Unit tests using Karma + QUnit

### CSS Structure
- `scss/bootstrap.scss` - Main SCSS entry point
- `scss/` - Individual component stylesheets and mixins
- `dist/css/` - Compiled CSS output

### Build System
- Uses Rollup for JavaScript bundling
- Node-sass for SCSS compilation
- Babel for JavaScript transpilation
- Supports both bundled (with Popper.js) and standalone builds

### Dependencies
- **jQuery**: 1.9.1 - 3.x supported, includes jQuery v4 compatibility layer
- **Popper.js**: ^1.16.1 for tooltip/popover positioning
- **Hugo**: Used for documentation site generation

## Key Files for jQuery v4 Support

The main compatibility work is in `js/src/jquery.deprecated_functions.js` which implements:
- `$.isFunction()` - Function type checking
- `$.trim()` - String trimming
- `$.parseJSON()` - JSON parsing
- `$.type()` - Type detection
- `$.isArray()` - Array detection
- `$.camelCase()` - String camel case conversion
- `$.isWindow()` - Window object detection
- `$.nodeName()` - Node name checking
- `$.isNumeric()` - Numeric value detection

## Testing Notes

- Tests run in Chrome/Firefox/Chromium headless by default
- Use `USE_OLD_JQUERY=true` environment variable to test with jQuery 1.9.1
- Use `BUNDLE=true` to test bundled version with Popper.js included
- Coverage reports generated in `js/coverage/`

## Code Style

- 2-space indentation
- ESLint with XO config + Unicorn rules
- Stylelint for SCSS
- EditorConfig enforced

## Implementation Plan: Integrating jQuery Deprecated Functions

### Goal
Ensure `js/src/jquery.deprecated_functions.js` is automatically included in all Bootstrap builds (both standalone and bundled) so jQuery v4 compatibility functions are always available.

### Analysis
- **Current State**: `jquery.deprecated_functions.js` exists but is not included in the build process
- **Build System**: Rollup uses `js/index.js` as entry point and bundles all exported modules
- **Challenge**: The deprecated functions file uses an IIFE pattern `(function ($) { ... })(jQuery)` that extends jQuery directly, rather than exporting modules

### Implementation Options

#### Option 1: Import as Side Effect (Recommended)
Convert `jquery.deprecated_functions.js` to use ES6 import/export and import it as a side effect in `js/index.js`.

**Steps**:
1. Modify `js/src/jquery.deprecated_functions.js`:
   - Remove IIFE wrapper
   - Add ES6 import for jQuery: `import $ from 'jquery'`
   - Keep the function implementations that extend jQuery
   
2. Add import to `js/index.js`:
   - Add `import './src/jquery.deprecated_functions'` at the top
   - This runs the polyfills when Bootstrap is loaded

**Pros**: Clean, automatic inclusion, follows ES6 patterns
**Cons**: Requires modifying the deprecated functions file

### Recommended Implementation: Option 1

**Phase 1: Prepare deprecated functions file**
```javascript
// Convert js/src/jquery.deprecated_functions.js from:
(function ($) {
  // functions here
})(jQuery);

// To:
import $ from 'jquery'
// functions here (same content, without IIFE wrapper)
```

**Phase 2: Include in build**
```javascript
// Add to js/index.js at top:
import './src/jquery.deprecated_functions'
// ... existing exports
```

**Phase 3: Test**
- Run `npm run js-compile` to build
- Verify deprecated functions are included in `dist/js/bootstrap.js`
- Test that functions work in both bundled and standalone versions
- Run existing test suite to ensure no regressions

### Testing Strategy
1. Build the library: `npm run dist`
2. Check that deprecated functions are present in output files
3. Create simple test HTML file that uses deprecated jQuery methods
4. Run full test suite: `npm test`
5. Test with multiple jQuery versions using `USE_OLD_JQUERY=true npm run js-test-karma`

### Success Criteria
- `dist/js/bootstrap.js` and `dist/js/bootstrap.bundle.js` include jQuery compatibility functions
- All deprecated jQuery methods work when Bootstrap is loaded
- No breaking changes to existing Bootstrap functionality
- All tests pass
