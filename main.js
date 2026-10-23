/* ==========================================================================
   K. Agyemang Auto Parts: main script (plain JavaScript, no libraries)
   Sections:
     1. Helpers
     2. Fill contact links from config.js
     3. Mobile menu
     4. Home page part finder
     5. Forms (validation, WhatsApp message, copy to clipboard)
     6. Videos (only one plays at a time)
   The forms do NOT store anything. They build a WhatsApp message in the
   visitor's browser and open WhatsApp. See README.md for how to connect a
   real backend or form service later.
   ========================================================================== */
(function () {
  "use strict";

  var CONFIG = window.SITE_CONFIG || {};

  /* 1. Helpers ----------------------------------------------------------- */
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }
  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }
  function trim(value) {
    return (value || "").replace(/\s+/g, " ").trim();
  }
  function whatsappLink(text) {
    var number = trim(CONFIG.whatsappNumber).replace(/\D/g, "");
    if (!number) {
      return "";
    }
    var url = "https://wa.me/" + number;
    return text ? url + "?text=" + encodeURIComponent(text) : url;
  }

  /* 2. Fill contact links from config ------------------------------------ */
  function applyConfig() {
    // data-wa: WhatsApp link. data-wa-text: optional starting message.
    qsa("[data-wa]").forEach(function (el) {
      var link = whatsappLink(el.getAttribute("data-wa-text") || "");
      if (link) {
        el.setAttribute("href", link);
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener");
      } else {
        // No number set: send visitors to the contact page instead of a dead link
        el.setAttribute("href", "contact.html");
      }
    });

    qsa("[data-tel]").forEach(function (el) {
      if (CONFIG.phoneTel) {
        el.setAttribute("href", "tel:" + CONFIG.phoneTel);
      } else {
        el.hidden = true;
      }
    });

    qsa("[data-email]").forEach(function (el) {
      if (CONFIG.email) {
        el.setAttribute("href", "mailto:" + CONFIG.email);
        if (el.hasAttribute("data-fill")) {
          el.textContent = CONFIG.email;
        }
      } else {
        el.hidden = true;
      }
    });

    qsa("[data-social]").forEach(function (el) {
      var url = CONFIG[el.getAttribute("data-social")];
      if (url) {
        el.setAttribute("href", url);
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener");
      } else {
        el.hidden = true;
      }
    });

    // Text fillers, for example <span data-text="phoneDisplay"></span>
    qsa("[data-text]").forEach(function (el) {
      var value = CONFIG[el.getAttribute("data-text")];
      if (value) {
        el.textContent = value;
      } else {
        el.hidden = true;
      }
    });

    // Hide a whole block when a detail is missing: data-requires="email"
    qsa("[data-requires]").forEach(function (el) {
      if (!CONFIG[el.getAttribute("data-requires")]) {
        el.hidden = true;
      }
    });

    qsa("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* 3. Mobile menu -------------------------------------------------------- */
  function setupMenu() {
    var toggle = qs(".nav-toggle");
    var nav = qs("#site-nav");
    if (!toggle || !nav) {
      return;
    }
    function setOpen(open) {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "Close" : "Menu";
    }
    toggle.addEventListener("click", function () {
      setOpen(!nav.classList.contains("is-open"));
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });
    qsa("a", nav).forEach(function (link) {
      link.addEventListener("click", function () {
        setOpen(false);
      });
    });
  }

  /* 4. Home page part finder ---------------------------------------------- */
  function setupFinder() {
    var form = qs("#finder-form");
    if (!form) {
      return;
    }
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var params = [];
      ["make", "model", "part"].forEach(function (name) {
        var value = trim(form.elements[name].value);
        if (value) {
          params.push(name + "=" + encodeURIComponent(value));
        }
      });
      window.location.href = "request.html" + (params.length ? "?" + params.join("&") : "") + "#request-form";
    });
  }

  /* 5. Forms ---------------------------------------------------------------- */
  var CURRENT_YEAR = new Date().getFullYear();

  // Each rule returns an error message, or "" when the value is fine.
  var RULES = {
    required: function (value, label) {
      return value ? "" : "Enter " + label + ".";
    },
    phone: function (value) {
      var digits = value.replace(/\D/g, "");
      if (!value) {
        return "Enter a phone number so we can reach you.";
      }
      if (!/^[+\d][\d\s\-()]*$/.test(value) || digits.length < 9 || digits.length > 15) {
        return "Enter a valid phone number, for example 054 123 4567.";
      }
      return "";
    },
    email: function (value) {
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
        return "Enter a valid email address, or leave this blank.";
      }
      return "";
    },
    year: function (value) {
      var year = Number(value);
      if (!value) {
        return "Enter the vehicle year.";
      }
      if (!/^\d{4}$/.test(value) || year < 1950 || year > CURRENT_YEAR + 1) {
        return "Enter a 4-digit year between 1950 and " + (CURRENT_YEAR + 1) + ".";
      }
      return "";
    },
    quantity: function (value) {
      var quantity = Number(value);
      if (!value) {
        return "Enter how many you need.";
      }
      if (!/^\d+$/.test(value) || quantity < 1 || quantity > 999) {
        return "Enter a whole number from 1 to 999.";
      }
      return "";
    },
    vin: function (value) {
      // Optional. Many vehicles have chassis numbers shorter than a 17-character VIN.
      if (value && !/^[A-Za-z0-9\-]{5,25}$/.test(value)) {
        return "Use letters, numbers and dashes only (5 to 25 characters), or leave this blank.";
      }
      return "";
    },
    choose: function (value, label) {
      return value ? "" : "Choose " + label + ".";
    },
    checked: function (value, label, field) {
      return field.checked ? "" : "Tick this box to continue.";
    }
  };

  function fieldLabel(field) {
    var attr = field.getAttribute("data-label");
    return attr ? attr : "this field";
  }

  function validateField(field) {
    var wrapper = field.closest(".field");
    var errorEl = wrapper ? qs(".field-error", wrapper) : null;
    var value = field.type === "checkbox" ? "" : trim(field.value);
    var rules = (field.getAttribute("data-rules") || "").split(" ").filter(Boolean);
    var message = "";

    for (var i = 0; i < rules.length && !message; i++) {
      var rule = RULES[rules[i]];
      if (rule) {
        message = rule(value, fieldLabel(field), field);
      }
    }

    if (errorEl) {
      errorEl.textContent = message;
    }
    if (wrapper) {
      wrapper.classList.toggle("has-error", Boolean(message));
    }
    field.setAttribute("aria-invalid", message ? "true" : "false");
    return message;
  }

  // Reads every named field into an object of trimmed strings
  function readForm(form) {
    var data = {};
    qsa("input, select, textarea", form).forEach(function (field) {
      if (!field.name) {
        return;
      }
      if (field.type === "checkbox") {
        data[field.name] = field.checked;
      } else if (field.tagName === "SELECT") {
        var option = field.options[field.selectedIndex];
        data[field.name] = field.value ? trim(option.text) : "";
      } else if (field.tagName === "TEXTAREA") {
        data[field.name] = field.value.replace(/\r/g, "").trim();
      } else {
        data[field.name] = trim(field.value);
      }
    });
    return data;
  }

  function pushLine(lines, label, value) {
    if (value) {
      lines.push(label + ": " + value);
    }
  }

  /* Message builders: one per form. Edit these to change the WhatsApp text.
     *text* makes bold text in WhatsApp. */
  var BUILDERS = {
    part: function (d) {
      var lines = ["*Part request: " + (CONFIG.businessName || "K. Agyemang Auto Parts") + "*", ""];
      lines.push("*Customer*");
      pushLine(lines, "Name", d.name);
      pushLine(lines, "Phone", d.phone);
      pushLine(lines, "Email", d.email);
      pushLine(lines, "Customer type", d.customerType);
      lines.push("", "*Vehicle*");
      pushLine(lines, "Make", d.make);
      pushLine(lines, "Model", d.model);
      pushLine(lines, "Year", d.year);
      pushLine(lines, "Engine or trim", d.trim);
      pushLine(lines, "Chassis or VIN number", d.vin);
      lines.push("", "*Part*");
      pushLine(lines, "Part needed", d.part);
      pushLine(lines, "OEM or part number", d.partNumber);
      pushLine(lines, "Condition preference", d.condition);
      pushLine(lines, "Quantity", d.quantity);
      pushLine(lines, "Budget", d.budget);
      lines.push("", "*Delivery*");
      pushLine(lines, "Delivery location", d.location);
      if (d.notes) {
        lines.push("", "*Additional information*", d.notes);
      }
      lines.push(
        "",
        d.photos
          ? "I will send photos of the part and vehicle in this chat."
          : "I do not have photos to send right now."
      );
      return lines.join("\n");
    },
    business: function (d) {
      var lines = ["*Business enquiry: " + (CONFIG.businessName || "K. Agyemang Auto Parts") + "*", ""];
      pushLine(lines, "Business name", d.business);
      pushLine(lines, "Contact person", d.name);
      pushLine(lines, "Phone", d.phone);
      pushLine(lines, "Email", d.email);
      pushLine(lines, "Business type", d.businessType);
      pushLine(lines, "Town or city", d.location);
      pushLine(lines, "Vehicle brands we work on", d.brands);
      pushLine(lines, "Parts we need regularly", d.parts);
      pushLine(lines, "How often we order", d.frequency);
      if (d.notes) {
        lines.push("", "*Additional information*", d.notes);
      }
      return lines.join("\n");
    }
  };

  function setupForm(form) {
    var builder = BUILDERS[form.getAttribute("data-builder")];
    var summary = qs(".form-summary", form);
    var result = qs(".result", form.parentNode);
    var fields = qsa("[data-rules]", form);
    if (!builder) {
      return;
    }

    // Clear an error as soon as the visitor fixes the field
    fields.forEach(function (field) {
      var eventName = field.tagName === "SELECT" || field.type === "checkbox" ? "change" : "input";
      field.addEventListener(eventName, function () {
        if (field.getAttribute("aria-invalid") === "true") {
          validateField(field);
        }
      });
      field.addEventListener("blur", function () {
        if (field.value) {
          validateField(field);
        }
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (result) {
        result.hidden = true;
      }

      // Validate everything and collect the problems
      var problems = [];
      fields.forEach(function (field) {
        var message = validateField(field);
        if (message) {
          problems.push({ field: field, message: message });
        }
      });

      if (problems.length) {
        showSummary(summary, problems);
        problems[0].field.focus();
        return;
      }
      if (summary) {
        summary.hidden = true;
      }

      var message = builder(readForm(form));
      showResult(result, message);
    });
  }

  function showSummary(summary, problems) {
    if (!summary) {
      return;
    }
    summary.innerHTML = "";
    var heading = document.createElement("p");
    heading.textContent =
      problems.length === 1 ? "There is 1 thing to fix before you can continue:" : "There are " + problems.length + " things to fix before you can continue:";
    var list = document.createElement("ul");
    problems.forEach(function (problem) {
      var item = document.createElement("li");
      var link = document.createElement("a");
      link.href = "#" + problem.field.id;
      link.textContent = problem.message;
      link.addEventListener("click", function (event) {
        event.preventDefault();
        problem.field.focus();
      });
      item.appendChild(link);
      list.appendChild(item);
    });
    summary.appendChild(heading);
    summary.appendChild(list);
    summary.hidden = false;
    summary.setAttribute("tabindex", "-1");
  }

  function showResult(result, message) {
    if (!result) {
      return;
    }
    var link = whatsappLink(message);
    result.innerHTML = "";
    result.hidden = false;
    result.classList.toggle("result--setup", !link);

    var heading = document.createElement("h3");
    var intro = document.createElement("p");
    result.appendChild(heading);
    result.appendChild(intro);

    if (!link) {
      // No WhatsApp number in config.js: say so plainly, do not pretend it was sent
      heading.textContent = "WhatsApp is not set up yet";
      intro.textContent =
        "Your request has not been sent. The site owner needs to add a WhatsApp number in config.js. You can copy your request below and send it another way.";
    } else {
      heading.textContent = "Your request is ready to send";
      intro.textContent =
        "WhatsApp should open in a new tab with your details filled in. Your request is not sent until you press Send in WhatsApp. If photos will help, attach them in the chat yourself, because a website cannot attach photos to a WhatsApp message.";
    }

    var preview = document.createElement("pre");
    preview.className = "message-preview";
    preview.textContent = message;
    result.appendChild(preview);

    var row = document.createElement("div");
    row.className = "btn-row";
    result.appendChild(row);

    if (link) {
      var open = document.createElement("a");
      open.className = "btn btn--red";
      open.href = link;
      open.target = "_blank";
      open.rel = "noopener";
      open.textContent = "Open WhatsApp";
      row.appendChild(open);
    }

    var copy = document.createElement("button");
    copy.type = "button";
    copy.className = "btn btn--outline-light";
    if (!link) {
      copy.className = "btn btn--dark";
    }
    copy.textContent = "Copy request text";
    row.appendChild(copy);

    var status = document.createElement("p");
    status.className = "copy-status";
    status.setAttribute("role", "status");
    result.appendChild(status);

    copy.addEventListener("click", function () {
      copyText(message).then(
        function () {
          status.textContent = "Copied. You can paste it into WhatsApp, SMS or email.";
        },
        function () {
          status.textContent = "Could not copy automatically. Select the text above and copy it.";
        }
      );
    });

    result.setAttribute("tabindex", "-1");
    result.scrollIntoView({ behavior: "smooth", block: "center" });
    result.focus({ preventScroll: true });

    if (link) {
      // Opens in a new tab. If the browser blocks the pop-up, the button above still works.
      window.open(link, "_blank", "noopener");
    }
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand("copy") ? resolve() : reject();
      } catch (error) {
        reject(error);
      }
      document.body.removeChild(area);
    });
  }

  // Pre-fill the Request a Part form from the page address,
  // for example request.html?make=Toyota&part=front%20grille&type=garage
  function prefillFromUrl() {
    var form = qs("#request-form");
    if (!form || !window.URLSearchParams) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var map = { make: "make", model: "model", part: "part", type: "customerType" };
    Object.keys(map).forEach(function (key) {
      var value = params.get(key);
      var field = form.elements[map[key]];
      if (!value || !field) {
        return;
      }
      if (field.tagName === "SELECT") {
        for (var i = 0; i < field.options.length; i++) {
          if (field.options[i].value === value) {
            field.selectedIndex = i;
          }
        }
      } else {
        field.value = value.slice(0, 200);
      }
    });
  }

  function setupForms() {
    qsa("form[data-builder]").forEach(setupForm);
    prefillFromUrl();
  }

  /* 6. Videos: pause the others when one starts ------------------------------ */
  function setupVideos() {
    var videos = qsa("video");
    videos.forEach(function (video) {
      video.addEventListener("play", function () {
        videos.forEach(function (other) {
          if (other !== video && !other.paused) {
            other.pause();
          }
        });
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyConfig();
    setupMenu();
    setupFinder();
    setupForms();
    setupVideos();
  });
})();
