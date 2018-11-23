https://img.shields.io/npm/v/webflow-multilingual.svg

# Webflow Multilingual

Fork from http://multilinguale.webflow.io

Only support modern browsers

## Install

```
<script src="https://unpkg.com/webflow-multilingual/webflow-multilingual.js"></script>
```

## Usage

### Text node

```
<p>[[ko]] 안녕 [[en]]hello</p>
```

### Class

```
<p class="wm-ko">안녕</p>
<p class="wm-en">hello</p>
```

### Attribute (not yet)

```
<p data-wm-lang="ko">안녕</p>
<p data-wm-lang="en">hello</p>
```

### Select language by URL query string parameters

```
https://your-awesome-site.site?lang=ko
https://your-awesome-site.site?lang=en
```

### Select language by button

```
<button data-wm-sel="ko">한국어</button>
<button data-wm-sel="en">English</button>
```

### Switch language

```
<button data-wm-switch>Switch</button>
```
