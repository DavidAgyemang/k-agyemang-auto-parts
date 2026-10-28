/* ==========================================================================
   Catalogue search and filters (plain JavaScript).
   Reads the parts from parts-data.js. To add or change parts, edit that file.
   Nothing is stored or sent anywhere: all filtering happens in the browser.
   ========================================================================== */
(function () {
  "use strict";

  var PARTS = window.PARTS_DATA || [];
  var form = document.getElementById("catalogue-form");
  var input = document.getElementById("cat-q");
  var filters = document.getElementById("cat-filters");
  var grid = document.getElementById("cat-grid");
  var count = document.getElementById("cat-count");
  var empty = document.getElementById("cat-empty");
  var emptyText = document.getElementById("cat-empty-text");
  var emptyLink = document.getElementById("cat-empty-link");
  var clearBtn = document.getElementById("cat-clear");
  if (!form || !grid) {
    return;
  }

  var state = { q: "", category: "" };

  // Lowercase, remove accents and simple plural endings so "grilles" finds "grille"
  function normalise(text) {
    return (text || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "");
  }
  function tokens(text) {
    return normalise(text)
      .split(/[^a-z0-9]+/)
      .filter(Boolean)
      .map(function (word) {
        return word.length > 3 ? word.replace(/s$/, "") : word;
      });
  }
  function words(text) {
    return normalise(text)
      .split(/[^a-z0-9]+/)
      .filter(Boolean);
  }
  function haystack(part) {
    return words(
      [part.name, part.category, (part.brands || []).join(" "), part.keywords, part.description].join(" ")
    );
  }

  var indexed = PARTS.map(function (part) {
    return { part: part, words: haystack(part) };
  });

  // Every search word must match the START of some word in the part's details,
  // so "led" finds "LED" but not "angled".
  function startsAnyWord(entry, token) {
    for (var i = 0; i < entry.words.length; i++) {
      if (entry.words[i].indexOf(token) === 0) {
        return true;
      }
    }
    return false;
  }

  function matches(entry) {
    if (state.category && entry.part.category !== state.category) {
      return false;
    }
    var wanted = tokens(state.q);
    for (var i = 0; i < wanted.length; i++) {
      if (!startsAnyWord(entry, wanted[i])) {
        return false;
      }
    }
    return true;
  }

  function requestLink(name) {
    return "request.html?part=" + encodeURIComponent(name) + "#request-form";
  }

  function card(part, index, animate) {
    var article = document.createElement("article");
    article.className = "cat-card" + (animate ? " is-new" : "");
    article.style.setProperty("--i", Math.min(index, 8));

    var img = document.createElement("img");
    img.src = part.image;
    img.alt = part.alt || part.name;
    img.width = 800;
    img.height = 600;
    img.loading = "lazy";
    article.appendChild(img);

    var body = document.createElement("div");
    body.className = "cat-body";
    var title = document.createElement("h3");
    title.textContent = part.name;
    var meta = document.createElement("p");
    meta.className = "cat-meta";
    var brands = part.brands && part.brands.length ? " | Fits: " + part.brands.join(", ") : "";
    meta.textContent = part.category + brands;
    var text = document.createElement("p");
    text.textContent = part.description;
    body.appendChild(title);
    body.appendChild(meta);
    body.appendChild(text);
    if (part.note) {
      var note = document.createElement("p");
      note.className = "cat-note";
      note.textContent = part.note;
      body.appendChild(note);
    }
    var link = document.createElement("a");
    link.className = "btn btn--outline";
    link.href = requestLink(part.name);
    link.textContent = "Request this part";
    body.appendChild(link);
    article.appendChild(body);
    return article;
  }

  function renderFilters() {
    var categories = [];
    PARTS.forEach(function (part) {
      if (part.category && categories.indexOf(part.category) === -1) {
        categories.push(part.category);
      }
    });
    filters.innerHTML = "";
    if (categories.length < 2) {
      filters.hidden = true;
      return;
    }
    ["All parts"].concat(categories).forEach(function (label, index) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "cat-chip";
      button.textContent = label;
      var value = index === 0 ? "" : label;
      button.setAttribute("data-category", value);
      button.setAttribute("aria-pressed", state.category === value ? "true" : "false");
      button.addEventListener("click", function () {
        state.category = value;
        update(true);
      });
      filters.appendChild(button);
    });
  }

  function syncUrl() {
    if (!window.history || !window.history.replaceState) {
      return;
    }
    var params = [];
    if (state.q) {
      params.push("q=" + encodeURIComponent(state.q));
    }
    if (state.category) {
      params.push("category=" + encodeURIComponent(state.category));
    }
    window.history.replaceState(null, "", window.location.pathname + (params.length ? "?" + params.join("&") : ""));
  }

  function update(animate) {
    var results = indexed.filter(matches);
    grid.innerHTML = "";
    results.forEach(function (entry, index) {
      grid.appendChild(card(entry.part, index, animate));
    });

    qsAll(".cat-chip").forEach(function (chip) {
      chip.setAttribute("aria-pressed", chip.getAttribute("data-category") === state.category ? "true" : "false");
    });

    var trimmed = state.q.trim();
    clearBtn.hidden = !(trimmed || state.category);

    if (results.length) {
      empty.hidden = true;
      count.textContent = results.length === 1 ? "1 part shown" : results.length + " parts shown";
    } else {
      empty.hidden = false;
      count.textContent = "No parts match";
      var label = trimmed || state.category;
      emptyText.textContent = label
        ? "No parts in the catalogue match “" + label + "”. We can still source it for you. Send us the details and we will try to find it."
        : "The catalogue is empty right now. Send us the details of the part you need.";
      emptyLink.href = requestLink(trimmed || "");
      emptyLink.textContent = trimmed ? "Request “" + trimmed + "”" : "Request a part";
    }
    syncUrl();
  }

  function qsAll(selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector));
  }

  input.addEventListener("input", function () {
    state.q = input.value;
    update(false);
  });
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    state.q = input.value;
    update(true);
  });
  clearBtn.addEventListener("click", function () {
    state.q = "";
    state.category = "";
    input.value = "";
    update(true);
    input.focus();
  });

  // Start from the web address, for example catalogue.html?q=grille
  if (window.URLSearchParams) {
    var params = new URLSearchParams(window.location.search);
    state.q = (params.get("q") || "").slice(0, 80);
    state.category = params.get("category") || "";
    input.value = state.q;
  }
  renderFilters();
  update(true);
})();
